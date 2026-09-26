"""Select retained authoring evidence before replacing an execution-snapshot store.

No retention decision depends on the latest global snapshot number. The old
database is read-only throughout planning and selective export.
"""
from __future__ import annotations

from collections import Counter
from contextlib import closing
import csv
import io
import json
import os
from pathlib import Path
import sqlite3
import time
from bisect import bisect_left
import hashlib

from catalog_workspace import Workspace, digest, key_path, manifest_digest, unlinked, utc_now
from workspace_paths import artifact_path

PLAN = "catalog-retention-plan-v1"
BASE = "data/local/catalog-authoring"
CONTINUATION = BASE + "/artifacts/catalog-expansion-continuation-20260902"
REBUILDABLE_NAMES = {"stdout.bin", "stderr.bin", "stdout.log", "stderr.log", "command.json", "PREPARED.json",
                     "FROZEN-STORAGE.json", "CHECK-STORAGE.json", "BATCH-STORAGE.json"}
REBUILDABLE_PARTS = {"node_modules", "operations", "readback", "data/generated", "src/data/generated"}


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write(path, value):
    from catalog_authoring_runner import write as atomic_write
    atomic_write(path, value)


def relative(repo, path):
    return key_path(unlinked(path).relative_to(repo).as_posix())


def capture_state(repo):
    state_path = repo / CONTINUATION / "STATE.json"
    state = read(state_path)
    candidate = repo / CONTINUATION / state["latestCandidate"]["root"]
    protected = {relative(repo, path): digest(path.read_bytes()) for path in (
        repo / "data/source/catalog.sqlite", state_path, candidate / "catalog-expanded.candidate.sqlite",
        candidate / "catalog-source-registry.candidate.sqlite", candidate / "MANIFEST.sha256",
        repo / "data/staging/catalog-expansion/gold-set-manifest.json")}
    for path in sorted((repo / BASE / "notifications").glob("*.json")):
        protected[relative(repo, path)] = digest(path.read_bytes())
    return state, candidate, protected


def current_tables(repo):
    from catalog_authoring.publish_factor_batch import _backend_module
    return _backend_module()._snapshot_db(repo / "data/source/catalog.sqlite")


def classify(path, current_paths, active_roots):
    if path in current_paths or path.startswith("data/source/"):
        return "KEEP_CURRENT"
    parts = path.split("/")
    if any("/".join(parts[:index]) in active_roots for index in range(1, len(parts) + 1)):
        return "PIN_ACTIVE"
    if path.startswith((".workspace/user-sources/", "handoff/", "research/", "R/research/")):
        return "KEEP_EVIDENCE"
    if ("pipeline-prc-verification-" in path or "catalog-pipeline-performance-" in path
            or any(part.startswith(("restore-", "restored-", "tamper-")) for part in parts)):
        return "REBUILDABLE"
    if path.endswith((".sqlite", ".sqlite3", ".db")):
        return "EXPIRE_EXECUTION"
    if (any(part in {"operations", "node_modules", ".git", "__pycache__"} for part in parts)
            or "data/generated/" in path or "src/data/generated/" in path or "/readback/" in path
            or Path(path).name in REBUILDABLE_NAMES or path.endswith((".pstats", ".py", ".pyc", ".ts", ".tsx", ".mjs", ".js"))):
        return "EXPIRE_EXECUTION"
    # Unclassified original research is retained, not guessed away by its age.
    return "KEEP_EVIDENCE"


def valid_working_sets(repo, state):
    """Keep the last valid READY and HOLD independently; ERROR cannot replace either."""
    root = repo / CONTINUATION / "planning"
    applied_results = set()
    completion = []
    for summary_sha, entry in state.get("publicationBatches", {}).items():
        batch = artifact_path(entry["batchRoot"], repo)
        receipt = batch / "BATCH-FINISHED.json"
        if not receipt.is_file() or digest(receipt.read_bytes()) != entry["receiptSha256"]:
            raise ValueError(f"Applied batch receipt is missing or changed: {batch}")
        finished = read(receipt)
        mapping = batch / "READBACK-PUBLICATIONS.json"
        if mapping.is_file():
            applied_results.update(str(artifact_path(row["resultRoot"], repo).parent) for row in read(mapping)["works"])
        completion.append({"summarySha256": summary_sha, "applied": entry, "finished": finished})
    selected, errors = {}, []
    for directory, folders, names in os.walk(root):
        folders[:] = [name for name in folders if not name.startswith(("pipeline-", "restore-", "restored-", "tamper-"))]
        if "CHECKED.json" not in names or "RUN.json" not in names:
            continue
        run = Path(directory)
        try:
            checked, config = read(run / "CHECKED.json"), read(run / "RUN.json")
            if checked.get("status") not in {"READY_FOR_PUBLICATION", "HOLD"}:
                continue
            sealed = str(artifact_path(checked["sealedRoot"], repo)) if checked.get("sealedRoot") else None
            if sealed in applied_results:
                continue
            if (run / "FINISHED.json").is_file() and read(run / "FINISHED.json").get("status") == "VERIFIED":
                continue
            wid = checked["workId"]
            timestamp = config.get("createdAt", "")
            key = wid, checked["status"]
            if key not in selected or timestamp > selected[key][0]:
                selected[key] = (timestamp, run)
        except (OSError, ValueError, KeyError) as error:
            errors.append({"path": relative(repo, run), "reason": str(error)})
    roots = {relative(repo, run): f"latest valid {status}: {wid}" for (wid, status), (_, run) in selected.items()}
    assignments = []
    for path in sorted((repo / BASE / "notifications").glob("*.json")):
        value = read(path)
        if not value.get("active"):
            continue
        dispatch = artifact_path(value["dispatchPath"], repo)
        if digest(dispatch.read_bytes()) != value["dispatchSha256"]:
            raise ValueError(f"Active dispatch changed: {dispatch}")
        record = {key: value.get(key) for key in ("sessionId", "phase", "runRoot", "artifact", "dispatchPath", "dispatchSha256", "suspended")}
        record["summaryExists"] = artifact_path(value["artifact"], repo).is_file()
        assignments.append(record)
        roots[relative(repo, dispatch)] = "current assignment"
        run = artifact_path(value["runRoot"], repo)
        # Collection data is direct original input; do not pin every historical publication under a broad run root.
        for research in run.rglob("research.jsonl"):
            roots[relative(repo, research.parent)] = "current collection and reusable original captures"
        for name in ("COLLECTION-CHECKPOINT.json", "ADJUDICATION-CHECKPOINT.json", "BATCH-CHECKPOINT.json"):
            if (run / name).is_file():
                roots[relative(repo, run / name)] = "current checkpoint"
    return roots, assignments, completion, errors


def make_plan(repo, output):
    repo = unlinked(repo)
    workspace = Workspace(repo)
    if getattr(workspace, "is_revision_store", False):
        raise ValueError("This migration plans a v2 store; use revision GC after activation")
    state, candidate, protected = capture_state(repo)
    active, assignments, completion, errors = valid_working_sets(repo, state)
    tables = current_tables(repo)
    work_columns, works = tables["source_works"]
    method, eligible, library = [work_columns.index(name) for name in ("annotationReviewMethod", "recommendationEligible", "libraryOnly")]
    current_paths = set(protected)
    selected, categories, pending_databases = {}, Counter(), []
    started = time.monotonic()
    print(json.dumps({"retentionStage": "indexing existing paths", "activeRoots": len(active)}), flush=True)
    with closing(workspace.connect()) as db:
        db.execute("BEGIN")
        last = db.execute("SELECT id,file_count,manifest_sha256 FROM snapshot ORDER BY id DESC LIMIT 1").fetchone()
        sizes = dict(db.execute("SELECT sha256,length(content) FROM blob"))
        # The covering path index supplies latest IDs without loading 10 million blobs.
        query = """SELECT e.path,e.sha256,e.snapshot_id FROM entry e JOIN
            (SELECT path,max(snapshot_id) id FROM entry GROUP BY path) latest
            ON e.path=latest.path AND e.snapshot_id=latest.id"""
        for index, (old_path, sha, snapshot_id) in enumerate(db.execute(query), 1):
            # Database keys are lexical here; verify links when reading live files,
            # not every ancestor of every historical index entry.
            path = key_path(Path(os.path.abspath(artifact_path(repo / key_path(old_path), repo))).relative_to(repo).as_posix())
            category = classify(path, current_paths, active)
            categories[category] += 1
            if category.startswith(("KEEP_", "PIN_")):
                previous = selected.get(path)
                if previous is None or previous["legacySnapshotId"] < snapshot_id:
                    selected[path] = {"sha256": sha, "legacySnapshotId": snapshot_id, "legacyPath": old_path, "category": category}
            elif path.endswith(".sqlite"):
                pending_databases.append({"path": path, "sha256": sha, "compressedBytes": sizes[sha], "category": category})
            if index % 25000 == 0:
                print(json.dumps({"retentionIndexedPaths": index, "seconds": time.monotonic() - started}), flush=True)
    unique = {value["sha256"] for value in selected.values()}
    value = {"schemaVersion": PLAN, "createdAt": utc_now(), "repository": str(repo), "policy": "curation-evidence-active-v1",
             "source": {"database": str(workspace.database), "bytes": workspace.database.stat().st_size,
                        "lastSnapshotId": last[0], "lastSnapshotFiles": last[1], "lastSnapshotManifestSha256": last[2]},
             "protectedFiles": protected, "currentCandidate": relative(repo, candidate),
             "catalog": {"works": len(works), "eligible": sum(row[eligible] == "true" for row in works),
                         "libraryOnly": sum(row[library] == "true" for row in works), "authorityKinds": dict(Counter(row[method] for row in works))},
             "activeRoots": active, "assignments": assignments, "completedBatches": completion,
             "unresolvedWorkingSets": errors, "pathClassification": dict(categories), "members": selected,
             "selectedUniqueBlobs": len(unique), "selectedCompressedBytes": sum(sizes[sha] for sha in unique),
             "unselectedDatabases": pending_databases,
             "status": "SELECTION_DRAFT", "limits": ["Current authority basis and active dependency closure must be verified before cutover.",
                "Unclassified original research remains retained; this plan is not permission to delete user-provided material.",
                "Legacy execution snapshot IDs are not durable references in the new store."]}
    write(output, value)
    print(json.dumps({key: value[key] for key in ("status", "catalog", "pathClassification", "selectedUniqueBlobs", "selectedCompressedBytes")}), flush=True)
    return value


def source_manifest(workspace, db, sha, *, retained, selected=None, manifests=None):
    """Bind retained bytes to original membership; retired members are not certified."""
    import catalog_authoring.validate_factor_panel as panel
    entries = manifests.get(sha) if manifests is not None else None
    if entries is None:
        body = workspace.read_blob(db, sha)
        retained.add(sha)
        entries = {}
        for line in body.decode("ascii").splitlines():
            match = panel.SHA_ROW.fullmatch(line)
            if match is None or match[2] in entries:
                raise ValueError("Invalid retained source manifest")
            key_path(match[2])
            entries[match[2]] = match[1]
        if manifests is not None:
            manifests[sha] = entries
    if not entries:
        raise ValueError("Invalid retained source membership")
    paths = set(entries) if selected is None else set(selected)
    if not paths <= set(entries):
        raise ValueError("Retained member is outside its original manifest")
    for member in {sha, *(entries[path] for path in paths)}:
        if member not in retained:
            workspace.read_blob(db, member)
            retained.add(member)
    return entries


def curation_input_paths(entries, chunk):
    return {name for name in entries if "/" not in name or name.startswith(("contracts/", "provenance/", f"chunks/{chunk}/"))}


def csv_rows(body):
    return list(csv.DictReader(io.StringIO(body.decode("utf-8-sig"))))


def semantic_rows(rows):
    # Source CSV coordinates may be reindexed by an unchanged publisher. They
    # are provenance at the revision, not a new factor or evidence decision.
    return sorted(json.dumps({key: value for key, value in row.items() if key not in {"sourceOrdinal", "sourceLine"}},
                             sort_keys=True, ensure_ascii=False) for row in rows)


def retain_research(source, db, repo, input_entries, directories, verified_bytes):
    """Keep all observations/limitations in the actual job, including unused sources."""
    records = {}
    job_sha = input_entries.get("authoring-job.json")
    if job_sha is None:
        return records
    job = json.loads(source.read_blob(db, job_sha))
    for work in job.get("works", []):
        for ref in work.get("researchRefs", [work.get("researchRef", {})]):
            if not ref.get("path") or not ref.get("sha256"):
                continue
            body = source.read_blob(db, ref["sha256"])
            verified_bytes.add(ref["sha256"])
            path = Path(os.path.abspath(artifact_path(ref["path"], repo)))
            parent = path.parent.relative_to(repo).as_posix()
            rows = [json.loads(line) for line in body.decode("utf-8").splitlines() if line.strip()]
            urls = {s.get("url") for row in rows if row.get("workId") == work["workId"] for s in row.get("sources", [])}
            captured = []
            for name, item in directories.get(parent, []):
                if not name.endswith(".json") or not Path(name).name.startswith(("capture-", "response-", "web-")):
                    continue
                try:
                    receipt = json.loads(source.read_blob(db, item["sha256"]))
                except (ValueError, UnicodeError):
                    continue
                if not {receipt.get("url"), receipt.get("resolvedUrl")} & (urls - {None}):
                    continue
                raw = receipt.get("sha256")
                if raw and receipt.get("rawPath"):
                    if raw not in verified_bytes:
                        source.read_blob(db, raw)
                        verified_bytes.add(raw)
                    verified_bytes.add(item["sha256"])
                    captured.append({"receiptSha256": item["sha256"], "rawSha256": raw, "originalPath": parent + "/" + receipt["rawPath"]})
            records.setdefault(work["workId"], []).append({"originalPath": str(path), "sha256": ref["sha256"], "captures": captured})
    return records


def index_original_sources(source, db, members):
    """Index source IDs from frozen CSV bytes; verify their containing manifest on use."""
    import catalog_authoring.validate_factor_panel as panel
    indexed, seen = {}, set()
    manifests = {}
    for path, item in members.items():
        if Path(path).name.startswith("PANEL-INPUT") and path.endswith(".sha256"):
            manifests.setdefault(path.rsplit("/", 1)[0], []).append(item["sha256"])
    fields = ("workId", "targetType", "targetId", "sourceType", "sourceUrl", "retrievedAt", "entryScope", "observation", "limitation", "confidence")
    for path, item in sorted(members.items()):
        if not path.endswith(("/supplemental-evidence.csv", "/evidence.csv")) or item["sha256"] in seen:
            continue
        binding = None
        for ancestor in Path(path).parents:
            base = ancestor.as_posix()
            for sha in manifests.get(base, []):
                csv_path = path[len(base) + 1:]
                entries = source_manifest(source, db, sha, retained=set(), selected=())
                if entries.get(csv_path) == item["sha256"]:
                    binding = (sha, csv_path)
                    break
            if binding:
                break
        if binding is None:
            continue
        seen.add(item["sha256"])
        normalized = {}
        for row in csv_rows(source.read_blob(db, item["sha256"])):
            panel.merge_prior_evidence(normalized, row)
        for eid, row in normalized.items():
            identity = digest(json.dumps({key: row.get(key, "") for key in fields}, sort_keys=True).encode())
            indexed.setdefault(eid, {}).setdefault(identity, {"row": row, "csvSha256": item["sha256"],
                "inputManifestSha256": binding[0], "csvPath": binding[1]})
    return indexed


def build_basis(plan, *, catalog=None, work_ids=None):
    """Bind current AEP values to original result/input manifests and source records.

    This is an explicit storage migration, not a new adjudication. Unresolved
    authority stays an exception with its legacy dependencies; no values change.
    """
    import catalog_authoring.validate_factor_panel as panel
    import catalog_authoring.publish_factor_batch as publisher
    backend = publisher._backend_module()
    repo = Path(plan["repository"])
    tables = backend._snapshot_db(catalog) if catalog is not None else current_tables(repo)
    data = {name: [dict(zip(columns, row)) for row in rows] for name, (columns, rows) in tables.items()}
    if work_ids is not None:
        for name, rows in data.items():
            owner = "id" if name == "source_works" else "workId"
            if rows and owner in rows[0]:
                data[name] = [row for row in rows if row[owner] in work_ids]
    works = {row["id"]: row for row in data["source_works"]}
    evidence = {row["id"]: row for row in data["source_evidence"]}
    wanted = {}
    for table, field, value in (("source_factors", "axisId", "value"), ("source_themes", "themeId", "centrality")):
        for row in data[table]:
            if works[row["workId"]]["annotationReviewMethod"] != "authorizedEvidencePanel" or row.get("state", "known") != "known":
                continue
            fact = ("axis:" if table == "source_factors" else "theme:") + row[field]
            # A Work-level AEP label does not upgrade its older candidate values.
            # Preserve those rows verbatim, without fabricating accepted claims.
            if evidence[row["evidenceId"]]["notes"].startswith("authorizedEvidencePanelV1|"):
                wanted[row["evidenceId"]] = (row["workId"], fact, row[value], row["confidence"])
    for row in data["source_evidence"]:
        if works[row["workId"]]["annotationReviewMethod"] != "authorizedEvidencePanel" or not row["notes"].startswith("authorizedEvidencePanelV1|"):
            continue
        note = json.JSONDecoder().raw_decode(row["notes"].split("|", 1)[1])[0]
        if (note.get("factKey", "").startswith("genre:") and note["factKey"][6:] in works[row["workId"]]["genres"].split(";")):
            wanted[row["id"]] = (row["workId"], note["factKey"], "true", row["confidence"])
    wanted_by_claim = {}
    for eid, expected in wanted.items():
        note = json.JSONDecoder().raw_decode(evidence[eid]["notes"].split("|", 1)[1])[0]
        wanted_by_claim.setdefault((*expected, note["authorityArtifactDigest"], note["citationSetDigest"]), []).append(eid)
    matched, unresolved, verified_bytes, verified_manifests = {}, {}, set(), {}
    source = Workspace(repo, Path(plan["source"]["database"]))
    members = plan["members"]
    directories = {}
    for path, item in members.items():
        directories.setdefault(path.rsplit("/", 1)[0], []).append((path, item))
    ledgers = sorted((path, item) for path, item in members.items() if path.endswith("/evidence-panel-ledger.csv"))
    with closing(source.connect()) as db:
        db.execute("BEGIN")
        source_index = None
        seen_ledgers = set()
        for index, (path, item) in enumerate(ledgers, 1):
            if item["sha256"] in seen_ledgers:
                continue
            seen_ledgers.add(item["sha256"])
            rows = csv_rows(source.read_blob(db, item["sha256"]))
            candidates = []
            for row in rows:
                if row.get("decision") != "accepted" or row.get("state") != "known" or row.get("authorityKind") != "authorizedEvidencePanelV1":
                    continue
                if not set(panel.LEDGER_FIELDS) <= row.keys():
                    continue
                identity = tuple(row[field] for field in ("workId", "factKey", "value", "confidence", "authorityArtifactDigest", "citationSetDigest"))
                for eid in wanted_by_claim.get(identity, []):
                    if eid in matched:
                        continue
                    try:
                        verify_claim_note(row, evidence[eid])
                    except ValueError as error:
                        unresolved[eid] = str(error)
                        continue
                    candidates.append((eid, row))
            if not candidates:
                continue
            result_path = str(Path(path).parent / "PANEL-RESULT.sha256").replace("\\", "/")
            result_ref = members.get(result_path)
            if result_ref is None:
                for eid, _ in candidates:
                    unresolved[eid] = "Original result manifest not indexed"
                continue
            result_entries = source_manifest(source, db, result_ref["sha256"], retained=verified_bytes)
            if result_entries.get("evidence-panel-ledger.csv") != item["sha256"]:
                raise ValueError("Original claim ledger is outside its result manifest")
            input_sha = result_entries["PANEL-INPUT.sha256"]
            input_entries = verified_manifests.get(input_sha)
            if input_entries is None:
                input_entries = source_manifest(source, db, input_sha, retained=verified_bytes, selected=())
                verified_manifests[input_sha] = input_entries
            chunk_name = Path(path).parent.name
            retained_input = curation_input_paths(input_entries, chunk_name)
            source_manifest(source, db, input_sha, retained=verified_bytes, selected=retained_input)
            chunk_sha = input_entries.get(f"chunks/{chunk_name}/CHUNK.sha256")
            chunk_entries = source_manifest(source, db, chunk_sha, retained=verified_bytes)
            research = retain_research(source, db, repo, input_entries, directories, verified_bytes)
            originals = {}
            for name, sha in input_entries.items():
                if name.startswith(f"chunks/{chunk_name}/") and name.endswith(("/evidence.csv", "/supplemental-evidence.csv")):
                    for row in csv_rows(source.read_blob(db, sha)):
                        panel.merge_prior_evidence(originals, row)
            source_proofs = []
            missing = {eid for _, row in candidates for eid in row["evidenceIds"].split(";")} - set(originals)
            if missing and source_index is None:
                source_index = index_original_sources(source, db, members)
            for eid in sorted(missing):
                variants = source_index.get(eid, {})
                observations = {key: item for key, item in variants.items() if "evidenceId" in item["row"]
                                and not item["row"].get("notes", "").startswith("authorizedEvidencePanelV1|")}
                if observations:
                    variants = observations
                if len(variants) != 1:
                    continue  # Ambiguous/missing source remains an explicit legacy exception.
                candidate = next(iter(variants.values()))
                manifest = source_manifest(source, db, candidate["inputManifestSha256"], retained=verified_bytes, selected=(candidate["csvPath"],))
                if manifest.get(candidate["csvPath"]) != candidate["csvSha256"]:
                    raise ValueError("Original retained source CSV is outside its input manifest")
                panel.merge_prior_evidence(originals, candidate["row"])
                source_proofs.append({key: candidate[key] for key in ("csvSha256", "inputManifestSha256", "csvPath")})
            bound_bytes = {item["sha256"], result_ref["sha256"], input_sha, chunk_sha,
                           *result_entries.values(), *(input_entries[name] for name in retained_input), *chunk_entries.values()}
            for eid, row in candidates:
                if row["authorityArtifactDigest"] != chunk_sha:
                    unresolved[eid] = "Claim belongs to a retained prior, not this input chunk"
                    continue
                try:
                    panel.require_prior_claim(row, {"claims": {(row["workId"], row["factKey"]): {panel.claim_semantic_digest(row): row}}, "evidence": originals})
                except ValueError as error:
                    unresolved[eid] = str(error)
                    continue
                matched[eid] = {"claim": row, "canonicalEvidenceId": eid, "evidence": {key: originals[key] for key in row["evidenceIds"].split(";")},
                                "blobs": sorted(bound_bytes), "sourceResultManifestSha256": result_ref["sha256"], "sourceInputManifestSha256": input_sha}
                matched[eid]["research"] = research.get(row["workId"], [])
                matched[eid]["sourceProofs"] = source_proofs
                matched[eid]["chunkName"] = chunk_name
                unresolved.pop(eid, None)
            if index % 50 == 0:
                print(json.dumps({"basisLedgers": index, "matchedCurrentClaims": len(matched)}), flush=True)
    for eid, (wid, fact, _, _) in wanted.items():
        if eid not in matched:
            unresolved.setdefault(eid, "No exact original modern claim binding; retain legacy authority")
    unresolved_works = {wanted[eid][0] for eid in unresolved}
    owned_tables = {wid: {} for wid in works}
    for table, rows in data.items():
        owner = "id" if table == "source_works" else "workId"
        if rows and owner in rows[0]:
            for row in rows:
                owned_tables[row[owner]].setdefault(table, []).append(row)
    owned_claims = {wid: [] for wid in works}
    for eid, value in matched.items():
        owned_claims[wanted[eid][0]].append(value)
    payloads = {}
    for wid, work in works.items():
        payloads[wid] = {"schemaVersion": "curation-baseline-v1", "workId": wid,
                         "authorityKind": work["annotationReviewMethod"], "tables": owned_tables[wid],
                         "claims": owned_claims[wid], "legacyAuthorityRequired": wid in unresolved_works,
                         "canonicalSha256AtMigration": plan["protectedFiles"]["data/source/catalog.sqlite"]}
    return {"payloads": payloads, "unresolvedClaims": unresolved, "unresolvedWorks": sorted(unresolved_works),
            "verifiedSourceBlobs": sorted(verified_bytes), "currentClaims": len(wanted), "matchedClaims": len(matched)}


def verify_claim_note(claim, source):
    """Both standard and correction IDs retain the original authority note."""
    import catalog_authoring.validate_factor_panel as panel
    if not source["notes"].startswith("authorizedEvidencePanelV1|"):
        raise ValueError("Current evidence is not an authorized panel claim")
    note = json.JSONDecoder().raw_decode(source["notes"].split("|", 1)[1])[0]
    fields = ("authorityKind", "authorityArtifactDigest", "citationSetDigest", "workId", "factKey", "entryScope", "observation", "limitation", "candidateOnly", "reviewedByHuman")
    differences = [field for field in fields if note.get(field) != claim[field]]
    if differences:
        raise ValueError("Current evidence differs from this original claim version: " + ", ".join(differences))
    if any(set(note[field].split(";")) != set(claim[field].split(";")) for field in ("evidenceIds", "citationUrls")):
        raise ValueError("Current claim source references differ from the original")
    if claim["candidateOnly"] != "true" or claim["reviewedByHuman"] != "false" or panel.citation_digest(claim["citationUrls"].split(";")) != claim["citationSetDigest"]:
        raise ValueError("Original claim authority boundary changed")


def load_basis(root, work_ids=None):
    """The regular prior reader consumes retained revisions, not retired directories."""
    import catalog_authoring.validate_factor_panel as panel
    from catalog_revision_store import RevisionWorkspace
    marker = read(root / "CURATION-BASELINE.json")
    if marker.get("schemaVersion") != "curation-baseline-anchor-v1":
        raise ValueError("Unknown curation basis format")
    repo = Path(marker["repository"])
    if not root.resolve().is_relative_to((repo / BASE).resolve()):
        raise ValueError("Curation basis is outside the authoring store")
    store = None
    for name in ("workspace.next.sqlite", "workspace.sqlite"):
        database = repo / BASE / name
        if not database.is_file():
            continue
        with closing(sqlite3.connect(database.as_uri() + "?mode=ro", uri=True)) as connection:
            if connection.execute("PRAGMA user_version").fetchone()[0] != 3:
                continue
            generation = connection.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
        if generation == marker["revision"]["generation"]:
            store = RevisionWorkspace(repo, database)
            break
    if store is None:
        raise ValueError("Curation basis generation is unavailable")
    manifest = root / "MANIFEST.sha256"
    panel.verify_manifest(root, manifest, {path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file() and path != manifest})
    anchor = store.get_revision(marker["revision"])["payload"]
    for name, sha in anchor["pair"].items():
        if digest((root / name).read_bytes()) != sha:
            raise ValueError("Curation basis pair changed")
    for name, sha in anchor.get("reviews", {}).items():
        if digest((root / key_path(name)).read_bytes()) != sha:
            raise ValueError("Curation review artifact changed")
    selected = set(anchor["works"]) if work_ids is None else work_ids & set(anchor["works"])
    claims, evidence, legacy = {}, {}, []
    with closing(store.connect()) as db, closing(sqlite3.connect((root / "catalog-expanded.candidate.sqlite").as_uri() + "?mode=ro", uri=True)) as actual_db:
        db.execute("BEGIN")
        verified = set()
        manifests, csv_cache = {}, {}

        def manifest(sha, selected=None):
            return source_manifest(store, db, sha, retained=verified, selected=selected, manifests=manifests)

        def rows_at(sha):
            if sha not in csv_cache:
                csv_cache[sha] = csv_rows(store.read_blob(db, sha))
            return csv_cache[sha]
        actual_tables = {}
        for (name,) in actual_db.execute("SELECT name FROM sqlite_schema WHERE type='table'"):
            columns = [row[1] for row in actual_db.execute(f'PRAGMA table_info("{name}")')]
            owner = "id" if name == "source_works" else "workId"
            if owner in columns:
                grouped = {}
                for row in actual_db.execute(f'SELECT * FROM "{name}" ORDER BY sourceOrdinal'):
                    item = dict(zip(columns, row))
                    if item[owner] in selected:
                        grouped.setdefault(item[owner], []).append(item)
                actual_tables[name] = grouped
        for wid in sorted(selected):
            payload = store.get_revision(anchor["works"][wid])["payload"]
            if payload["schemaVersion"] != "curation-baseline-v1" or payload["workId"] != wid:
                raise ValueError("Curation basis Work binding changed")
            work = payload["tables"]["source_works"]
            if len(work) != 1 or work[0]["id"] != wid or work[0]["annotationReviewMethod"] != payload["authorityKind"]:
                raise ValueError("Curation basis authority kind changed")
            for name, grouped in actual_tables.items():
                rows = grouped.get(wid, [])
                if semantic_rows(payload["tables"].get(name, [])) != semantic_rows(rows):
                    raise ValueError(f"Curation basis differs from current rows: {wid} {name}")
            if payload["legacyAuthorityRequired"]:
                raise ValueError(f"Unresolved original authority remains pinned: {wid}")
            current_ids = {row["evidenceId"] for name in ("source_factors", "source_themes")
                           for row in payload["tables"].get(name, []) if row.get("state", "known") == "known"}
            legacy.extend({**pin, "currentEvidenceIds": sorted(current_ids)} for pin in anchor.get("legacyPins", {}).get(wid, []))
            for original in payload["claims"]:
                claim = original["claim"]
                if claim["workId"] != wid or claim["decision"] != "accepted":
                    raise ValueError("Cross-Work or unaccepted curation claim")
                eid = original["canonicalEvidenceId"]
                original_source = next((row for row in payload["tables"].get("source_evidence", []) if row["id"] == eid), None)
                if original_source is None:
                    raise ValueError("Curation claim has no matching canonical evidence")
                verify_claim_note(claim, original_source)
                fact = claim["factKey"]
                if fact.startswith("axis:"):
                    actual = next((row for row in payload["tables"]["source_factors"] if row["axisId"] == fact[5:]), None)
                    if actual is None or (actual["state"], actual["value"], actual["confidence"], actual["evidenceId"]) != (claim["state"], claim["value"], claim["confidence"], eid):
                        raise ValueError("Curation claim differs from canonical factor")
                elif fact.startswith("theme:"):
                    actual = next((row for row in payload["tables"]["source_themes"] if row["themeId"] == fact[6:]), None)
                    if actual is None or (actual["centrality"], actual["confidence"], actual["evidenceId"]) != (claim["value"], claim["confidence"], eid):
                        raise ValueError("Curation claim differs from canonical theme")
                elif fact.startswith("genre:") and fact[6:] not in work[0]["genres"].split(";"):
                    raise ValueError("Curation claim differs from canonical genres")
                result_entries = manifest(original["sourceResultManifestSha256"])
                if result_entries["PANEL-INPUT.sha256"] != original["sourceInputManifestSha256"]:
                    raise ValueError("Curation original input/result binding changed")
                rows = rows_at(result_entries["evidence-panel-ledger.csv"])
                if claim not in rows:
                    raise ValueError("Curation claim differs from the retained original ledger")
                input_entries = manifest(original["sourceInputManifestSha256"], selected=())
                chunk = original["chunkName"]
                manifest(original["sourceInputManifestSha256"], selected=curation_input_paths(input_entries, chunk))
                if input_entries.get(f"chunks/{chunk}/CHUNK.sha256") != claim["authorityArtifactDigest"]:
                    raise ValueError("Curation claim original chunk binding changed")
                original_records = {}
                for name, sha in input_entries.items():
                    if name.startswith(f"chunks/{chunk}/") and name.endswith(("/evidence.csv", "/supplemental-evidence.csv")):
                        for row in rows_at(sha):
                            panel.merge_prior_evidence(original_records, row)
                for proof in original.get("sourceProofs", []):
                    members = manifest(proof["inputManifestSha256"], selected=(proof["csvPath"],))
                    if members[proof["csvPath"]] != proof["csvSha256"]:
                        raise ValueError("Curation source proof binding changed")
                    for row in rows_at(proof["csvSha256"]):
                        if row.get("evidenceId", row.get("id")) in original["evidence"]:
                            panel.merge_prior_evidence(original_records, row)
                for eid, record in original["evidence"].items():
                    if original_records.get(eid) != record:
                        raise ValueError("Curation source record differs from retained original")
                key = (wid, fact)
                claims.setdefault(key, {})[panel.claim_semantic_digest(claim)] = claim
                for source_row in original["evidence"].values():
                    panel.merge_prior_evidence(evidence, source_row)
                panel.require_prior_claim(claim, {"claims": claims, "evidence": evidence})
    return {"claims": claims, "evidence": evidence, "legacyBundles": legacy}


def active_dependencies(plan):
    """Follow existing runtime references, keeping old frozen identities unchanged."""
    repo = Path(plan["repository"])
    source = Workspace(repo, Path(plan["source"]["database"]))
    members = plan["members"]
    known = {path: item["sha256"] for path, item in members.items()}
    known.update({item["path"]: item["sha256"] for item in plan["unselectedDatabases"]})
    names = sorted(known)
    pending, selected, receipts, expanded = [], {}, {}, set()

    def key(path):
        return key_path(Path(os.path.abspath(artifact_path(path, repo))).relative_to(repo).as_posix())

    def add(path, sha):
        path = key_path(path)
        old = selected.get(path)
        if old and old != sha:
            raise ValueError(f"Active dependency has two required live versions: {path}")
        if old is None:
            selected[path] = sha
            if path.endswith(".json"):
                pending.append(path)

    with closing(source.connect()) as db:
        db.execute("BEGIN")
        def body(path, sha):
            try:
                return source.read_blob(db, sha)
            except ValueError:
                raw = (repo / path).read_bytes()
                if digest(raw) != sha:
                    raise ValueError(f"Active source version is unavailable: {path}")
                return raw

        def need(path):
            target = key(path)
            if target in expanded:
                return
            expanded.add(target)
            if target in known:
                add(target, known[target])
                return
            for manifest_name in ("MANIFEST.sha256", "PANEL-INPUT.sha256"):
                manifest = target + "/" + manifest_name
                if manifest in known:
                    add(manifest, known[manifest])
                    import catalog_authoring.validate_factor_panel as panel
                    for line in body(manifest, known[manifest]).decode("ascii").splitlines():
                        match = panel.SHA_ROW.fullmatch(line)
                        if match is None:
                            raise ValueError(f"Invalid active dependency manifest: {manifest}")
                        add(target + "/" + key_path(match[2]), match[1])
                    return
            start = bisect_left(names, target + "/")
            descendants = []
            for name in names[start:]:
                if not name.startswith(target + "/"):
                    break
                descendants.append(name)
            if descendants:
                for name in descendants:
                    add(name, known[name])
            else:
                actual = unlinked(repo / target)
                if actual.is_file():
                    add(target, digest(actual.read_bytes()))
                elif actual.is_dir():
                    inventory = source._inventory([actual])
                    for path, (sha, _) in inventory.items():
                        add(path.relative_to(repo).as_posix(), sha)
                    source._assert_inventory([actual], inventory)
                else:
                    raise ValueError(f"Unresolved active dependency: {target}")

        def storage_refs(value):
            if isinstance(value, dict):
                if {"snapshotId", "files", "manifestSha256"} <= value.keys():
                    identity = {name: value[name] for name in ("snapshotId", "files", "manifestSha256")}
                    previous = receipts.setdefault(str(value["snapshotId"]), identity)
                    if previous != identity:
                        raise ValueError("Conflicting active legacy receipt")
                for item in value.values():
                    storage_refs(item)
            elif isinstance(value, list):
                for item in value:
                    storage_refs(item)

        for root in plan["activeRoots"]:
            need(repo / root)
        while pending:
            path = pending.pop()
            name = Path(path).name
            try:
                value = json.loads(body(path, selected[path]))
            except (ValueError, UnicodeError):
                continue  # Invalid original drafts remain retained, not interpreted.
            if not isinstance(value, dict):
                continue
            schema = value.get("schemaVersion")
            if name.endswith("-STORAGE.json") or name == "CHECKPOINT.json" or schema in {"catalog-compact-work-v1", "catalog-compact-publication-v1"}:
                storage_refs(value)
            if name in {"RUN.json", "external-lineage.json"}:
                for field in ("baselineRoot", "registryPath", "decisionsPath", "recoveryEpoch"):
                    if value.get(field):
                        need(value[field])
                for binding in value.get("priorBundleBindings", []):
                    need(binding["root"])
                for root in value.get("provenanceRoots", []):
                    need(root)
            if name == "external-prior-authority.json":
                for binding in value["bundles"]:
                    need(binding["root"])
            if schema in {"factor-authoring-job-v3", "factor-authoring-job-v4"}:
                for work in value["works"]:
                    for ref in work.get("researchRefs", [work.get("researchRef", {})]):
                        if ref.get("path"):
                            need((repo / path).parent / ref["path"])
            if schema in {"factor-loss-recovery-v1", "factor-loss-recovery-epoch-v1"}:
                for field in ("epochPath", "scopePath", "policyPath"):
                    if value.get(field):
                        need(value[field])
                if value.get("epochId") == "factor-003-recovery-20260909-v1":
                    runs = repo / CONTINUATION / "runs"
                    need(runs / "continuation-factor-233-publication-20260909-v1")
                    need(runs / "canonical-promotion-20260910-v2/before/data/source/catalog.sqlite")
            if schema == "catalog-compact-work-v1":
                for field in ("input", "authority"):
                    need(value[field]["root"])
            if name == "COMPACT-PUBLICATION.json":
                need(value["baseline"]["root"])
        pins = []
        for identity in receipts.values():
            rows = db.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (identity["snapshotId"],)).fetchall()
            if len(rows) != identity["files"] or manifest_digest(rows) != identity["manifestSha256"]:
                raise ValueError("Active snapshot membership changed")
            retained = {}
            for original, sha in rows:
                normalized = key(repo / key_path(original))
                if normalized in selected and selected[normalized] == sha:
                    retained[normalized] = sha
            pins.append({"snapshot": identity, "originalMembers": dict(rows), "members": retained})
    return {"members": selected, "legacyPins": pins}


def check_protected(plan):
    repo = Path(plan["repository"])
    for name, sha in plan["protectedFiles"].items():
        if digest((repo / name).read_bytes()) != sha:
            raise ValueError(f"Migration inputs advanced; make a new plan: {name}")


def create_anchor(store, destination, pair_root, works, *, legacy_pins=None, provenance=None):
    """A small current basis points at immutable Work revisions and one exact pair."""
    import shutil
    from catalog_authoring.publish_factor_batch import _write_result_manifest
    destination = unlinked(destination)
    destination.mkdir(parents=True, exist_ok=False)
    pair = {}
    for name in ("catalog-expanded.candidate.sqlite", "catalog-source-registry.candidate.sqlite"):
        origin = pair_root / name
        shutil.copyfile(origin, destination / name)
        pair[name] = digest(origin.read_bytes())
        if digest((destination / name).read_bytes()) != pair[name]:
            raise ValueError("Current pair changed while making the retention basis")
    reviews = {}
    with closing(sqlite3.connect((pair_root / "catalog-expanded.candidate.sqlite").resolve().as_uri() + "?mode=ro", uri=True)) as db:
        references = {row[0] for row in db.execute("SELECT annotationReviewReference FROM source_works WHERE annotationReviewReference<>''")}
    for reference in sorted(references):
        name = key_path(reference)
        if not name.startswith("reviews/"):
            raise ValueError("Invalid current review reference")
        candidates = [pair_root / "data/source" / name, pair_root / "authorized-evidence-panel-v1/data/source" / name,
                      store.repo / "data/source" / name]
        source = next((unlinked(path) for path in candidates if path.is_file()), None)
        if source is None:
            raise ValueError(f"Current review artifact is missing: {reference}")
        target = destination / "data/source" / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        reviews["data/source/" + name] = digest(source.read_bytes())
        if digest(target.read_bytes()) != reviews["data/source/" + name]:
            raise ValueError("Review changed while binding the current basis")
    receipt = store.save([destination], "curation:pair")
    members = store.get_revision(receipt)["members"]
    anchor = store.put_revision("active", "current-curation-basis", {"schemaVersion": "curation-baseline-anchor-v1",
        "pair": pair, "reviews": reviews, "works": works, "legacyPins": legacy_pins or {}, "provenance": provenance or {}}, members, pinned=True)
    write(destination / "CURATION-BASELINE.json", {"schemaVersion": "curation-baseline-anchor-v1", "repository": str(store.repo), "revision": anchor})
    _write_result_manifest(destination)
    store.save([destination], "curation:basis")
    return destination


def build_store(plan, basis, dependencies, *, integrated=None):
    """Selective copy; never clone the old database or mutate it in place."""
    from catalog_revision_store import RevisionWorkspace
    import catalog_authoring.validate_factor_panel as panel
    check_protected(plan)
    if basis["unresolvedWorks"] or plan["unresolvedWorkingSets"]:
        raise ValueError("Resolve or explicitly pin incomplete authority/working sets before migration")
    legacy_ids = {row["id"] for payload in basis["payloads"].values() for row in payload["tables"].get("source_evidence", [])
                  if row["extractorVersion"] == "catalog-integration-v1" and "authorityKind=authorizedEvidencePanel" in row["notes"]}
    if legacy_ids and integrated is None:
        raise ValueError("The existing integrated authority needs --legacy-integrated; it cannot be silently discarded")
    repo = Path(plan["repository"])
    source = Workspace(repo, Path(plan["source"]["database"]))
    destination = repo / BASE / "workspace.next.sqlite"
    store = RevisionWorkspace.create(repo, destination)
    paths = {name: item["sha256"] for name, item in plan["members"].items()}
    paths.update(dependencies["members"])
    legacy_pins, legacy_members = {}, {}
    if integrated:
        old_root = Path(integrated["root"])
        if digest((old_root / "MANIFEST.sha256").read_bytes()) != integrated["manifestSha256"]:
            raise ValueError("Legacy migration proof changed")
        # Re-run the existing adapter at the migration boundary, not a projection
        # from numeric values. Retain this one small source bundle as an exception.
        originals = panel.integrated_correction_claims(old_root)
        wanted = {}
        for claim, evidence in originals:
            payload = basis["payloads"].get(claim["workId"])
            if payload is None:
                continue
            table, column, value = ("source_factors", "axisId", "value") if claim["factKey"].startswith("axis:") else ("source_themes", "themeId", "centrality")
            actual = next((row for row in payload["tables"].get(table, []) if row[column] == claim["factKey"].split(":")[1]), None)
            if actual and (actual["evidenceId"], actual[value], actual["confidence"]) == (evidence["id"], claim["value"], claim["confidence"]):
                wanted.setdefault(claim["workId"], []).append(panel.claim_semantic_digest(claim))
        retained_root = repo / BASE / "retained/legacy" / integrated["manifestSha256"]
        for path in source.files([old_root]):
            name = path.relative_to(old_root).as_posix()
            sha = digest(path.read_bytes())
            legacy_members[relative(repo, retained_root / name)] = sha
            paths.setdefault(relative(repo, path), sha)
        for wid, claims in wanted.items():
            legacy_pins[wid] = [{"root": str(retained_root), "manifestSha256": integrated["manifestSha256"],
                                 "workId": wid, "claimDigests": sorted(claims)}]
    required = set(paths.values()) | set(legacy_members.values()) | set(basis["verifiedSourceBlobs"])
    originals_by_sha = {}
    for name, sha in paths.items():
        originals_by_sha.setdefault(sha, repo / name)
    with closing(source.connect()) as old, closing(store.connect(write=True)) as new:
        old.execute("BEGIN")
        for index, sha in enumerate(sorted(required), 1):
            row = old.execute("SELECT byte_length,content FROM blob WHERE sha256=?", (sha,)).fetchone()
            if row:
                source.read_blob(old, sha)
                new.execute("INSERT INTO blob VALUES (?,?,?)", (sha, *row))
            else:
                origin = originals_by_sha.get(sha)
                if origin is None or digest(origin.read_bytes()) != sha:
                    raise ValueError(f"Required original bytes are unavailable: {sha}")
                store.add_blob(new, origin.read_bytes())
            if index % 5000 == 0:
                new.commit()
                print(json.dumps({"retentionCopiedBlobs": index, "total": len(required)}), flush=True)
        new.commit()
    # One path index for retained original material; identical bytes are shared.
    archive = {name: sha for name, sha in paths.items() if name not in dependencies["members"]}
    store.put_revision("collection", "retained-originals", {"policy": plan["policy"]}, archive, pinned=True)
    store.put_revision("active", "migration-working-sets", {"assignments": plan["assignments"], "roots": plan["activeRoots"]}, dependencies["members"], pinned=True)
    for pin in dependencies["legacyPins"]:
        store.put_revision("legacy-pin", str(pin["snapshot"]["snapshotId"]),
            {"snapshot": pin["snapshot"], "originalMembers": pin["originalMembers"]}, pin["members"], pinned=True)
    if legacy_members:
        ref = store.put_revision("legacy-pin", "integrated-authority", {"manifestSha256": integrated["manifestSha256"]}, legacy_members, pinned=True)
        for pins in legacy_pins.values():
            for pin in pins:
                pin["revision"] = ref
        store.checkout(ref["revisionId"], relative(repo, retained_root))
    works = {}
    for wid, payload in basis["payloads"].items():
        blobs = set()
        for claim in payload["claims"]:
            blobs.update(claim["blobs"])
            for proof in claim.get("sourceProofs", []):
                blobs.update((proof["csvSha256"], proof["inputManifestSha256"]))
            for research in claim["research"]:
                blobs.add(research["sha256"])
                for capture in research["captures"]:
                    blobs.update((capture["receiptSha256"], capture["rawSha256"]))
        works[wid] = store.put_revision("curation", wid, payload, {"retained/" + sha: sha for sha in blobs})
    anchor = repo / BASE / "retained/curation-baseline" / store._generation
    create_anchor(store, anchor, repo / plan["currentCandidate"], works, legacy_pins=legacy_pins,
                  provenance={"sourceSnapshot": plan["source"], "canonicalSha256": plan["protectedFiles"]["data/source/catalog.sqlite"]})
    check_protected(plan)
    return {"schemaVersion": "catalog-retention-build-v1", "status": "BUILT_NOT_ACTIVATED", "database": str(destination),
        "generation": store._generation, "anchor": str(anchor), "works": len(works), "copiedOriginalBlobs": len(required),
        "databaseBytes": destination.stat().st_size, "legacyAuthorityWorks": len(legacy_pins), "protectedFiles": plan["protectedFiles"]}


def advance_basis(repo, previous_root, publication, entries):
    """Advance only published Works; no global archive scan or lineage replay."""
    store = Workspace(repo)
    if not getattr(store, "is_revision_store", False):
        return publication
    marker = read(previous_root / "CURATION-BASELINE.json")
    prior = store.get_revision(marker["revision"])["payload"]
    work_ids = {row[0] for row in entries}
    members = {}
    for _, _, frozen, sealed in entries:
        for path in store.files([frozen / "panel-input", sealed]):
            members[relative(repo, path)] = {"sha256": digest(path.read_bytes())}
    with closing(store.connect()) as db:
        verified = set()
        for wid in work_ids:
            original = store.get_revision(prior["works"][wid])["payload"]
            for claim in original["claims"]:
                input_sha = claim["sourceInputManifestSha256"]
                input_entries = source_manifest(store, db, input_sha, retained=verified, selected=())
                prefix = "retained-basis/input/" + input_sha
                members[prefix + "/PANEL-INPUT.sha256"] = {"sha256": input_sha}
                for name in curation_input_paths(input_entries, claim["chunkName"]):
                    members[prefix + "/" + name] = {"sha256": input_entries[name]}
                result_sha = claim["sourceResultManifestSha256"]
                result_entries = source_manifest(store, db, result_sha, retained=verified)
                result_prefix = "retained-basis/result/" + result_sha + "/" + claim["chunkName"]
                members[result_prefix + "/PANEL-RESULT.sha256"] = {"sha256": result_sha}
                for name, sha in result_entries.items():
                    members[result_prefix + "/" + name] = {"sha256": sha}
                for proof in claim.get("sourceProofs", []):
                    prefix = "retained-basis/source/" + proof["inputManifestSha256"]
                    members[prefix + "/PANEL-INPUT.sha256"] = {"sha256": proof["inputManifestSha256"]}
                    members[prefix + "/" + proof["csvPath"]] = {"sha256": proof["csvSha256"]}
    basis = build_basis({"repository": str(repo), "source": {"database": str(store.database)}, "members": members,
        "protectedFiles": {"data/source/catalog.sqlite": digest((repo / "data/source/catalog.sqlite").read_bytes())}},
        catalog=publication / "catalog-expanded.candidate.sqlite", work_ids=work_ids)
    if basis["unresolvedWorks"]:
        raise ValueError("New publication has unresolved curation references; preserve the result and repair its storage before advancing STATE")
    works = dict(prior["works"])
    for wid, payload in basis["payloads"].items():
        blobs = set()
        for claim in payload["claims"]:
            blobs.update(claim["blobs"])
            for proof in claim["sourceProofs"]:
                blobs.update((proof["csvSha256"], proof["inputManifestSha256"]))
            for research in claim["research"]:
                blobs.add(research["sha256"])
                for capture in research["captures"]:
                    blobs.update((capture["receiptSha256"], capture["rawSha256"]))
        works[wid] = store.put_revision("curation", wid, payload, {"retained/" + sha: sha for sha in blobs})
    # The publisher's complete readback remains the publication verdict. This
    # separate root changes storage references while preserving the exact pair.
    destination = repo / BASE / "retained/curation-baseline" / digest((publication / "MANIFEST.sha256").read_bytes())
    if not destination.exists():
        create_anchor(store, destination, publication, works, legacy_pins=prior.get("legacyPins", {}),
                      provenance={"publicationManifestSha256": digest((publication / "MANIFEST.sha256").read_bytes())})
    load_basis(destination, work_ids)
    return destination


def advance_metadata_basis(repo, previous_root, publication, work_ids):
    """Keep verified claims while an existing publisher changes bibliography/eligibility."""
    from catalog_authoring.publish_factor_batch import _backend_module
    store = Workspace(repo)
    if not getattr(store, "is_revision_store", False):
        return publication
    store.save([publication], "metadata:verified-publication")
    prior = store.get_revision(read(previous_root / "CURATION-BASELINE.json")["revision"])["payload"]
    tables = _backend_module()._snapshot_db(publication / "catalog-expanded.candidate.sqlite")
    owned = {wid: {} for wid in work_ids}
    for name, (columns, rows) in tables.items():
        owner = "id" if name == "source_works" else "workId"
        if owner in columns:
            index = columns.index(owner)
            for values in rows:
                if values[index] in owned:
                    owned[values[index]].setdefault(name, []).append(dict(zip(columns, values)))
    works = dict(prior["works"])
    for wid, current in owned.items():
        original = store.get_revision(works[wid])
        payload = original["payload"]
        for name in ("source_factors", "source_themes"):
            if semantic_rows(current.get(name, [])) != semantic_rows(payload["tables"].get(name, [])):
                raise ValueError("A metadata correction cannot change accepted factor/theme claims")
        for field in ("genres", "annotationReviewMethod"):
            if current["source_works"][0][field] != payload["tables"]["source_works"][0][field]:
                raise ValueError("A metadata correction cannot change genre or adjudication authority")
        works[wid] = store.put_revision("curation", wid, {**payload, "tables": current}, original["members"])
    destination = repo / BASE / "retained/curation-baseline" / digest((publication / "MANIFEST.sha256").read_bytes())
    if not destination.exists():
        create_anchor(store, destination, publication, works, legacy_pins=prior.get("legacyPins", {}),
                      provenance={"publicationManifestSha256": digest((publication / "MANIFEST.sha256").read_bytes())})
    load_basis(destination, work_ids)
    return destination


def retain_completions(plan, store):
    """Validate old effects once, then retain their small idempotence ledger."""
    import catalog_authoring.compact_publication as compact
    repo = Path(plan["repository"])
    source = Workspace(repo, Path(plan["source"]["database"]))
    backup = Workspace(repo, repo / BASE / "backups/latest.sqlite")
    retained = []
    for entry in plan["completedBatches"]:
        summary_sha, applied, finished = entry["summarySha256"], entry["applied"], entry["finished"]
        root = Path(applied["batchRoot"])
        receipt, completed, readback = root / "BATCH-FINISHED.json", root / "BATCH-COMPLETED.json", Path(finished["readback"])
        value = read(completed)
        if value["status"] != "VERIFIED" or value["receiptSha256"] != applied["receiptSha256"] or digest(receipt.read_bytes()) != applied["receiptSha256"]:
            raise ValueError("Legacy completion receipt differs from STATE")
        for existing in (source, backup):
            existing.verify_saved(value["batchStorage"]["snapshot"], [receipt, readback, Path(finished["finalPublicationRoot"])])
        reference = {"path": relative(repo, repo / CONTINUATION / "STATE.json"), "sha256": value["stateSha256"], "snapshot": value["stateStorage"]["snapshot"]}
        for is_backup in (False, True):
            historical = json.loads(compact.read_stored_file(reference, backup=is_backup))
            if historical.get("publicationBatches", {}).get(summary_sha) != applied:
                raise ValueError("Legacy STATE did not acknowledge this batch")
        proof = store.save([receipt, completed, readback], "migration:completed-batch")
        retained.append(store.put_revision("completion", summary_sha,
            {"status": "VERIFIED", "summarySha256": summary_sha, "applied": applied, "finished": finished,
             "stateSha256": value["stateSha256"], "migration": "existing completion and both storage copies verified"}, store.get_revision(proof)["members"]))
    return retained


def file_sha(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def verify_built(build):
    import catalog_authoring.validate_factor_panel as panel
    from catalog_revision_store import RevisionWorkspace
    root = Path(build["anchor"])
    repo = Path(read(root / "CURATION-BASELINE.json")["repository"])
    check_protected({"repository": str(repo), "protectedFiles": build["protectedFiles"]})
    store = RevisionWorkspace(repo, Path(build["database"]))
    verified = store.verify()
    authority = panel.load_prior_authority(root, baseline=root / "catalog-expanded.candidate.sqlite")
    return {"status": "VERIFIED_NOT_ACTIVATED", "generation": verified["generation"], "databaseSha256": file_sha(store.database),
            "databaseBytes": store.database.stat().st_size, "store": verified,
            "anchorManifestSha256": digest((root / "MANIFEST.sha256").read_bytes()),
            "claimKeys": len(authority["claims"]), "claims": sum(len(rows) for rows in authority["claims"].values()),
            "evidenceRecords": len(authority["evidence"]), "protectedFilesUnchanged": True}


def activate_store(build, verification, *, resume=False):
    """Recoverable two-file cutover; never describe DB+STATE as one atomic write."""
    from catalog_workspace import exclusive_file
    from catalog_revision_store import RevisionWorkspace
    from catalog_authoring_runner import exclusive
    repo = Path(read(Path(build["anchor"]) / "CURATION-BASELINE.json")["repository"])
    base, state_path = repo / BASE, repo / CONTINUATION / "STATE.json"
    intent_path = base / "RETENTION-MAINTENANCE.json"
    active, pending = base / "workspace.sqlite", base / "workspace.next.sqlite"
    backup, next_backup = base / "backups/latest.sqlite", base / "backups/retention-next.sqlite"
    old, old_backup = base / "workspace.retired-v2.sqlite", base / "backups/latest.retired-v2.sqlite"
    with exclusive(base / "locks/publication.lock", wait=False), exclusive_file(base / "backups/rotation.lock"):
        if intent_path.exists():
            if not resume:
                raise ValueError("Interrupted retention cutover exists; use activate --resume with the same build")
            intent = read(intent_path)
            if intent["generation"] != build["generation"]:
                raise ValueError("Cutover intent belongs to another generation")
        else:
            check_protected({"repository": str(repo), "protectedFiles": build["protectedFiles"]})
            marker = read(Path(build["anchor"]) / "CURATION-BASELINE.json")
            prepared = RevisionWorkspace(repo, pending).get_revision(marker["revision"])["payload"]
            original = prepared["provenance"]["sourceSnapshot"]
            with closing(sqlite3.connect(active.as_uri() + "?mode=ro", uri=True)) as existing:
                tip = existing.execute("SELECT id,file_count,manifest_sha256 FROM snapshot ORDER BY id DESC LIMIT 1").fetchone()
            if tip != (original["lastSnapshotId"], original["lastSnapshotFiles"], original["lastSnapshotManifestSha256"]):
                raise ValueError("Legacy writer advanced after the retention plan; rebuild before cutover")
            if (verification["status"] != "VERIFIED_NOT_ACTIVATED" or verification["generation"] != build["generation"]
                    or file_sha(pending) != verification["databaseSha256"]):
                raise ValueError("Staged database differs from its verified build")
            next_store = RevisionWorkspace(repo, next_backup)
            with closing(next_store.connect()) as db:
                if next_store._generation != build["generation"]:
                    raise ValueError("New generation backup is missing or different")
                with closing(RevisionWorkspace(repo, pending).connect()) as source:
                    for table, order in (("revision", "id"), ("head", "kind,subject"), ("store_meta", "key")):
                        if source.execute(f"SELECT * FROM {table} ORDER BY {order}").fetchall() != db.execute(f"SELECT * FROM {table} ORDER BY {order}").fetchall():
                            raise ValueError("New backup does not contain the complete staged generation")
            if old.exists() or old_backup.exists():
                raise ValueError("Earlier retired generation still occupies rollback paths")
            state = read(state_path)
            original_state_sha = digest(state_path.read_bytes())
            state["latestCandidate"].update(root=os.path.relpath(build["anchor"], repo / CONTINUATION).replace("\\", "/"),
                manifestSha256=verification["anchorManifestSha256"], curationBasisGeneration=build["generation"])
            state["authoringStore"] = {"schemaVersion": 3, "generation": build["generation"], "policy": "curation-evidence-active-v1"}
            state["updatedAt"] = utc_now()
            intent = {"schemaVersion": "catalog-retention-cutover-v1", "generation": build["generation"],
                      "oldDatabaseSha256": file_sha(active), "newDatabaseSha256": verification["databaseSha256"],
                      "oldBackupSha256": file_sha(backup), "newBackupSha256": file_sha(next_backup),
                      "oldStateSha256": original_state_sha, "oldState": read(state_path), "newState": state,
                      "anchor": build["anchor"]}
            write(intent_path, intent)
        # A hard link retains the old generation without making another 17 GB
        # copy. os.replace swaps one pathname atomically; STATE follows below.
        for target, staged, rollback, expected_old, expected_new in (
            (active, pending, old, intent["oldDatabaseSha256"], intent["newDatabaseSha256"]),
            (backup, next_backup, old_backup, intent["oldBackupSha256"], intent["newBackupSha256"])):
            current_sha = file_sha(target)
            if current_sha == expected_new:
                continue
            if current_sha != expected_old or not staged.is_file() or file_sha(staged) != expected_new:
                raise ValueError("Cutover file identity changed; intent and rollback remain intact")
            if not rollback.exists():
                os.link(target, rollback)
            elif file_sha(rollback) != expected_old:
                raise ValueError("Rollback generation changed")
            os.replace(staged, target)
        current_state = read(state_path)
        if current_state != intent["newState"]:
            if digest(state_path.read_bytes()) != intent["oldStateSha256"]:
                raise ValueError("STATE changed during cutover; reconcile the saved intent")
            write(state_path, intent["newState"])
        # Read the actual primary pointer before releasing writers.
        from catalog_authoring_runner import current
        state, root = current()
        if root != Path(intent["anchor"]).resolve() or state["authoringStore"]["generation"] != build["generation"]:
            raise ValueError("Cutover STATE readback failed")
        marker = read(root / "CURATION-BASELINE.json")
        for database in (active, backup):
            RevisionWorkspace(repo, database).get_revision(marker["revision"])
        completed = base / "RETENTION-CUTOVER.json"
        write(completed, {**intent, "status": "ACTIVATED", "newStateSha256": digest(state_path.read_bytes()),
                          "rollbackFiles": [str(old), str(old_backup)], "completedAt": utc_now()})
        intent_path.unlink()
    # This is the phase checkpoint, after DB/STATE authoritative readback.
    storage = Workspace(repo).persist([state_path, completed], "retention:cutover", phase_boundary=True)
    return {"status": "ACTIVATED", "generation": build["generation"], "stateSha256": digest(state_path.read_bytes()),
            "databaseBytes": active.stat().st_size, "storage": storage, "cutover": str(completed), "retiredFilesDeleted": False}


def prune_retired(cutover_path):
    """Remove only the three obsolete v2 database files after active readback."""
    from catalog_revision_store import RevisionWorkspace
    from catalog_workspace import APPLICATION_ID
    from catalog_authoring_runner import exclusive, current
    cutover = read(cutover_path)
    repo = Path(read(Path(cutover["anchor"]) / "CURATION-BASELINE.json")["repository"])
    base = repo / BASE
    if cutover_path.resolve() != (base / "RETENTION-CUTOVER.json").resolve() or cutover["status"] != "ACTIVATED":
        raise ValueError("Only a completed repository retention cutover may be pruned")
    with exclusive(base / "locks/publication.lock", wait=False):
        if (base / "RETENTION-MAINTENANCE.json").exists():
            raise ValueError("Finish the pending cutover first")
        state, root = current()
        if state["authoringStore"]["generation"] != cutover["generation"]:
            raise ValueError("Current store generation differs from the cutover")
        receipt = base / "RETENTION-PRUNE.json"
        if receipt.is_file():
            previous = read(receipt)
            if previous.get("status") == "PRUNED" and previous.get("generation") == cutover["generation"] and all(
                    not (base / name).exists() for name in ("workspace.retired-v2.sqlite", "backups/latest.retired-v2.sqlite", "backups/previous.sqlite")):
                return previous
        source = RevisionWorkspace(repo, base / "workspace.sqlite")
        source.persist([repo / CONTINUATION / "STATE.json", cutover_path], "retention:prune-boundary", phase_boundary=True)
        backup = RevisionWorkspace(repo, base / "backups/latest.sqlite")
        with closing(source.connect()) as actual, closing(backup.connect()) as saved:
            for query in ("SELECT * FROM revision ORDER BY id", "SELECT * FROM head ORDER BY kind,subject"):
                if actual.execute(query).fetchall() != saved.execute(query).fetchall():
                    raise ValueError("Current revision backup is incomplete")
        for store in (source, backup):
            store.get_revision(read(root / "CURATION-BASELINE.json")["revision"])
        targets = [(base / "workspace.retired-v2.sqlite", cutover["oldDatabaseSha256"]),
                   (base / "backups/latest.retired-v2.sqlite", cutover["oldBackupSha256"]),
                   (base / "backups/previous.sqlite", None)]
        candidates = []
        for path, sha in targets:
            checked = unlinked(path)
            if not checked.is_relative_to(base) or not checked.is_file():
                continue
            with closing(sqlite3.connect(checked.as_uri() + "?mode=ro", uri=True)) as db:
                if db.execute("PRAGMA user_version").fetchone()[0] != 2 or db.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID:
                    raise ValueError("Refusing to prune a non-v2 database")
            if sha is not None and file_sha(checked) != sha:
                raise ValueError("Retired database changed after cutover")
            candidates.append({"path": str(checked), "bytes": checked.stat().st_size, "sha256": sha or file_sha(checked)})
        # The exact reviewed deletion set is durable before the first unlink.
        write(receipt, {"status": "PRUNING", "generation": cutover["generation"], "files": candidates})
        for item in candidates:
            Path(item["path"]).unlink()
        result = {"status": "PRUNED", "generation": cutover["generation"], "files": candidates,
                  "removedBytes": sum(item["bytes"] for item in candidates), "completedAt": utc_now()}
        write(receipt, result)
        source.persist([receipt], "retention:pruned", phase_boundary=True)
        return result


def main():
    import argparse
    from catalog_revision_store import RevisionWorkspace
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="action", required=True)
    plan_command = commands.add_parser("plan")
    plan_command.add_argument("--output", type=Path, required=True)
    build_command = commands.add_parser("build")
    build_command.add_argument("--plan", type=Path, required=True)
    build_command.add_argument("--legacy-integrated", type=Path)
    build_command.add_argument("--report", type=Path, required=True)
    verification = commands.add_parser("verify")
    verification.add_argument("--build", type=Path, required=True)
    verification.add_argument("--report", type=Path, required=True)
    activation = commands.add_parser("activate")
    activation.add_argument("--build", type=Path, required=True)
    activation.add_argument("--verification", type=Path, required=True)
    activation.add_argument("--resume", action="store_true")
    prune = commands.add_parser("prune-retired")
    prune.add_argument("--cutover", type=Path, required=True)
    gc = commands.add_parser("gc")
    gc.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    if args.action == "plan":
        result = make_plan(Path(__file__).resolve().parents[1], args.output)
        result = {key: result[key] for key in ("status", "catalog", "pathClassification", "selectedCompressedBytes")}
    elif args.action == "build":
        plan = read(args.plan)
        integrated = {"root": str(args.legacy_integrated.resolve()), "manifestSha256": file_sha(args.legacy_integrated / "MANIFEST.sha256")} if args.legacy_integrated else None
        result = build_store(plan, build_basis(plan), active_dependencies(plan), integrated=integrated)
        store = RevisionWorkspace(Path(plan["repository"]), Path(result["database"]))
        retain_completions(plan, store)
        result["databaseBytes"] = store.database.stat().st_size
        write(args.report, result)
    elif args.action == "verify":
        result = verify_built(read(args.build))
        write(args.report, result)
    elif args.action == "activate":
        result = activate_store(read(args.build), read(args.verification), resume=args.resume)
    elif args.action == "prune-retired":
        result = prune_retired(args.cutover)
    else:
        store = Workspace()
        if not getattr(store, "is_revision_store", False):
            raise ValueError("GC requires an activated revision store")
        result = store.gc(apply=args.apply)
        if args.apply:
            result["backup"] = store.backup()
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
