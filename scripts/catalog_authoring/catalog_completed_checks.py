"""Read-only recognition of exact adjudications already applied and retained.

This replaces only an obsolete execution-copy receipt. A current curation and
the completed publication must independently bind the original CHECKED bytes.
"""
from __future__ import annotations

from contextlib import ExitStack, closing
import json
from pathlib import Path
import sqlite3

import catalog_authoring_runner as runner
from catalog_revision_store import key_path
from workspace_paths import path_identity


_WORK_FIELDS = {"id", "genres", "factorScope", "onboardingEligible",
                "recommendationEligible", "libraryOnly", "annotationReviewMethod",
                "annotationReviewReference", "annotationReviewedAt"}
_FACT_TABLES = {"source_factors", "source_themes", "source_recommendation_context",
                "source_art_evidence_manifest"}
_STATIC_ARTIFACTS = {
    "data/generated/catalog-v1.json", "src/data/generated/catalog-v1.json",
    "data/generated/recommendation-context-v1.json", "src/data/generated/recommendation-context-v1.json",
    "data/generated/recommendation-profile-catalog-v1.json", "data/generated/recommendation-profile-context-v1.json",
    "src/data/generated/catalog-identity-v1.json", "src/data/generated/landing-v1.json",
}


def _adjudication(tables, claims=()):
    from catalog_retention import semantic_rows
    result = {name: semantic_rows(tables.get(name, [])) for name in _FACT_TABLES}
    result["source_works"] = semantic_rows([
        {key: value for key, value in row.items() if key in _WORK_FIELDS}
        for row in tables.get("source_works", [])])
    # New bibliography and publisher descriptions do not invalidate an applied
    # adjudication. Its factor/theme/context evidence remains exact.
    evidence = {row["evidenceId"] for name in _FACT_TABLES
                for row in tables.get(name, []) if row.get("evidenceId")}
    evidence.update(claim["canonicalEvidenceId"] for claim in claims)
    evidence.update(eid for claim in claims for eid in claim.get("evidence", {}))
    # Recommendation-context and safety rows have no evidenceId foreign key.
    # Preserve their bound authority notes as well as factor/theme references.
    evidence.update(row["id"] for row in tables.get("source_evidence", [])
                    if "authorizedEvidencePanelV1|" in row.get("notes", ""))
    result["source_evidence"] = semantic_rows([
        row for row in tables.get("source_evidence", []) if row["id"] in evidence])
    return result


def _tree_digest(members):
    """Canonical publication artifactDigest over verified file membership.

    Match the existing TypeScript directory digest and its UTF-16 name order.
    An unrepresented empty directory fails closed against the prepared digest.
    """
    tree = {}
    for name, sha in members.items():
        parts = key_path(name).split("/")
        branch = tree
        for part in parts[:-1]:
            branch = branch.setdefault(part, {})
        runner.prepare.require(parts[-1] not in branch, "duplicate canonical tree member")
        branch[parts[-1]] = sha

    def digest(branch):
        rows = [[name, digest(value) if isinstance(value, dict) else value]
                for name, value in sorted(branch.items(), key=lambda item: item[0].encode("utf-16-be", "surrogatepass"))]
        return runner.panel.sha256_bytes(json.dumps(rows, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    return digest(tree)


class _RetainedProof:
    def __init__(self, store, context):
        self.store, self.context, self.heads = store, context, {}

    def _head(self, view, kind, subject):
        source, db, _, _ = view
        row = db.execute("SELECT revision_id FROM head WHERE kind=? AND subject=?", (kind, subject)).fetchone()
        return source._receipt(db, row[0]) if row else None

    def revision(self, kind, subject, *, verify=False, members=None):
        context, heads = self.context, self.heads
        receipt = self._head(context.views[0], kind, subject)
        if receipt is None:
            return None, None
        value = context._revision(context.views[0], receipt)
        if verify:
            for view in context.views:
                other = self._head(view, kind, subject)
                runner.prepare.require(other is not None and
                    {k: v for k, v in other.items() if k != "database"} ==
                    {k: v for k, v in receipt.items() if k != "database"},
                    "completed CHECK source/backup head differs")
                saved = context._revision(view, receipt)
                selected = saved["members"] if members is None else members
                runner.prepare.require(all(saved["members"].get(name) == sha for name, sha in selected.items()),
                                       "completed CHECK selected membership changed")
                for sha in set(selected.values()):
                    context._blob(view, sha)
            heads[kind, subject] = receipt
        return receipt, value

    def retained_json(self, value, path, sha):
        store, context = self.store, self.context
        key = store.key(runner.artifact_path(path))
        runner.prepare.require(value["members"].get(key) == sha,
                               "completed CHECK proof is outside its revision")
        return context._blob(context.views[0], sha, payload=True)


def _assert_heads(store, heads):
    for database in (None, runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite"):
        source = runner.Workspace(runner.REPO, database)
        with closing(source.connect()) as db:
            for (kind, subject), receipt in heads.items():
                row = db.execute("SELECT revision_id FROM head WHERE kind=? AND subject=?", (kind, subject)).fetchone()
                current = source._receipt(db, row[0]) if row else None
                runner.prepare.require(current is not None and {k: v for k, v in current.items() if k != "database"} ==
                    {k: v for k, v in receipt.items() if k != "database"}, "completed CHECK head advanced during verification")


def _assert_effect_files(store, effect_files, canonical_incomplete):
    if effect_files:
        pending = runner.REPO / "data/local/catalog-authoring/locks/publication.pending.json"
        source_root = runner.REPO / "data/source"
        runner.prepare.require(not pending.exists() and set(store.files([source_root])) ==
            {path for path in effect_files if path.is_relative_to(source_root)},
            canonical_incomplete + ": canonical source advanced during effect proof")
        runner.prepare.require(all(path.is_file() and not path.is_symlink() and runner.panel.sha256(path) == sha
                                   for path, sha in effect_files.items()) and not pending.exists(),
                               canonical_incomplete + ": canonical artifacts advanced during effect proof")


def verify_current_canonical_effect(state=None):
    """Verify one backed-up current canonical effect without replaying history."""
    state_path = runner.ROOT / "STATE.json"
    state_sha = runner.panel.sha256(state_path)
    if state is None:
        state = runner.panel.read_json(state_path)
    runner.prepare.require(runner.panel.read_json(state_path) == state, "STATE changed before canonical effect proof")
    store = runner.Workspace(runner.REPO)
    effect_files = {}
    canonical_incomplete = "Candidate complete; canonical publication and backup remain incomplete"
    with store.verification_context([], backup=True) as context:
        reader = _RetainedProof(store, context)
        revision, retained_json = reader.revision, reader.retained_json
        def verify_effect(receipt, prepared, completed, members, completion_sha, *, subject=None):
            """Read the actual current source/static tree of one retained build."""
            runner.prepare.require(completed.get("schemaVersion") == "catalog-canonical-completion-v1" and
                completed.get("status") == "APPLIED" and completed.get("readback") == "PASS" and
                prepared.get("schemaVersion") == "catalog-canonical-publication-v1" and
                runner.artifact_path(prepared["root"]).resolve() == runner.REPO.resolve() and
                all(completed.get(key) == prepared.get(key) for key in
                    ("artifacts", "workIds", "catalogVersion", "sourceManifestDigest")),
                "current canonical effect prepared/completion binding changed")
            artifacts = {key_path(path_identity(item["path"]).as_posix()): item["sha256"] for item in prepared["artifacts"]}
            version = prepared["catalogVersion"]
            expected = _STATIC_ARTIFACTS | {"data/source", f"public/catalog/catalog-v1.{version}.json",
                                           f"public/catalog/recommendation-context-v1.{version}.json"}
            runner.prepare.require(len(artifacts) == len(prepared["artifacts"]) and set(artifacts) == expected,
                                   "current canonical effect artifact membership changed")
            source_members = {name[len("data/source/"):]: sha for name, sha in members.items() if name.startswith("data/source/")}
            generated = {name: sha for name, sha in members.items() if not name.startswith("data/source/")}
            runner.prepare.require(source_members and _tree_digest(source_members) == artifacts["data/source"] and
                generated == {name: sha for name, sha in artifacts.items() if name != "data/source"},
                "current canonical effect retained artifacts differ from prepared")
            actual = {path.relative_to(runner.REPO / "data/source").as_posix(): runner.panel.sha256(path)
                      for path in store.files([runner.REPO / "data/source"])}
            runner.prepare.require(actual == source_members,
                                   canonical_incomplete + ": current source tree differs from retained build")
            for name, sha in generated.items():
                path = runner.REPO / key_path(name)
                runner.prepare.require(path.is_file() and not path.is_symlink() and runner.panel.sha256(path) == sha,
                                       canonical_incomplete + ": current generated artifact differs: " + name)
            effect_files.update({runner.REPO / "data/source" / name: sha for name, sha in source_members.items()})
            effect_files.update({runner.REPO / name: sha for name, sha in generated.items()})
            return {"revision": receipt, "summarySha256": subject, "completionSha256": completion_sha,
                    "canonicalSha256": source_members["catalog.sqlite"], "sourceFiles": len(source_members),
                    "generatedFiles": len(generated)}

        def current_canonical_effect():
            """Select the current pointer, or one exact SQL artifact match."""
            runner.prepare.require(not (runner.REPO / "data/local/catalog-authoring/locks/publication.pending.json").exists(),
                                   canonical_incomplete + ": a canonical publication needs recovery")
            canonical_sha = runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite")
            control_receipt, control = revision("active", "current-recovery-controls")
            pointer_path = runner.REPO / "data/local/catalog-authoring/locks/publication.completed.json"
            pointer_key = store.key(pointer_path)
            if control is not None:
                runner.prepare.require(control["payload"].get("schemaVersion") == "catalog-current-recovery-controls-v1",
                                       "current canonical effect controls changed")
                runner.prepare.require(store.key(pointer_path.with_name("publication.pending.json")) not in control["members"],
                                       canonical_incomplete + ": a canonical publication needs recovery")
            runner.prepare.require(not pointer_path.exists() or (control is not None and pointer_key in control["members"]),
                                   canonical_incomplete + ": current canonical pointer is not backed up")
            if control is not None and pointer_key in control["members"]:
                pointer_sha = control["members"][pointer_key]
                pointer = retained_json(control, pointer_path, pointer_sha)
                runner.prepare.require(pointer.get("schemaVersion") == "catalog-canonical-completion-pointer-v1",
                                       "current canonical effect pointer changed")
                prepared = retained_json(control, pointer["preparedPath"], pointer["preparedSha256"])
                completed = retained_json(control, pointer["completionPath"], pointer["completionSha256"])
                output = runner.artifact_path(prepared["output"])
                runner.prepare.require(runner.artifact_path(pointer["preparedPath"]) == output / "prepared.json" and
                    runner.artifact_path(pointer["completionPath"]) == output / "completion.json" and
                    completed.get("preparedSha256") == pointer["preparedSha256"] and
                    prepared.get("kind") in {"adjudication", "publisher-metadata"},
                    "current canonical effect pointer binding changed")
                members = control["payload"].get("currentCanonical", {}).get("members", {})
                selected = {**members, pointer_key: pointer_sha,
                    store.key(output / "prepared.json"): pointer["preparedSha256"],
                    store.key(output / "completion.json"): pointer["completionSha256"]}
                revision("active", "current-recovery-controls", verify=True, members=selected)
                if pointer_path.exists():
                    runner.prepare.require(runner.panel.sha256(pointer_path) == pointer_sha,
                                           canonical_incomplete + ": current canonical pointer differs from backup")
                    effect_files[pointer_path] = pointer_sha
                return verify_effect(control_receipt, prepared, completed, members, pointer["completionSha256"])
            # Old builds have no current pointer. Query the exact current SQL
            # file's indexed membership, rather than opening every completion.
            db = context.views[0][1]
            match = db.execute("SELECT h.subject FROM revision_blob b JOIN head h ON h.revision_id=b.revision_id "
                "JOIN revision r ON r.id=h.revision_id WHERE h.kind='canonical-completion' AND b.sha256=? "
                "AND b.path LIKE '%/candidate/data/source/catalog.sqlite' ORDER BY r.rowid DESC LIMIT 1",
                (canonical_sha,)).fetchone()
            if match is not None:
                effect_summary = match[0]
                receipt, value = revision("canonical-completion", effect_summary)
                payload = value["payload"]
                output = runner.artifact_path(payload["outputRoot"])
                prefix = store.key(output / "candidate") + "/"
                members = {name[len(prefix):]: sha for name, sha in value["members"].items() if name.startswith(prefix)}
                runner.prepare.require(members.get("data/source/catalog.sqlite") == canonical_sha,
                                       "current canonical effect source binding changed")
                applied = state.get("publicationBatches", {}).get(effect_summary)
                runner.prepare.require(applied is not None, "current canonical effect is outside STATE")
                runner.prepare.require(payload.get("status") == "APPLIED" and
                    payload.get("candidateReceiptSha256") == applied["receiptSha256"],
                    "current canonical effect candidate binding changed")
                _, candidate = revision("completion", effect_summary, verify=True)
                runner.prepare.require(candidate is not None and candidate["payload"].get("status") == "VERIFIED" and
                    candidate["payload"].get("applied") == applied and candidate["payload"].get("summarySha256") == effect_summary,
                    "current canonical effect candidate completion changed")
                finished = retained_json(candidate, Path(applied["batchRoot"]) / "BATCH-FINISHED.json", applied["receiptSha256"])
                runner.prepare.require(candidate["payload"].get("finished") == finished,
                                       "current canonical effect candidate receipt changed")
                completed = retained_json(value, output / "completion.json", payload["completionSha256"])
                prepared = retained_json(value, output / "prepared.json", completed["preparedSha256"])
                runner.prepare.require(runner.artifact_path(payload["completionPath"]) == output / "completion.json" and
                    runner.artifact_path(prepared["output"]) == output and
                    set(prepared["workIds"]) == {row["workId"] for row in finished["works"]},
                    "current canonical effect prepared/completion binding changed")
                selected = {prefix + name: sha for name, sha in members.items()}
                selected.update({store.key(output / "completion.json"): payload["completionSha256"],
                                 store.key(output / "prepared.json"): completed["preparedSha256"]})
                revision("canonical-completion", effect_summary, verify=True, members=selected)
                return verify_effect(receipt, prepared, completed, members, payload["completionSha256"], subject=effect_summary)
            raise ValueError(canonical_incomplete + ": no retained build matches the current canonical source")
        result = current_canonical_effect()
        runner.prepare.require(runner.panel.sha256(state_path) == state_sha, "STATE advanced during canonical effect proof")
    _assert_heads(store, reader.heads)
    _assert_effect_files(store, effect_files, canonical_incomplete)
    return result


def completed_checks(rows, *, state=None, baseline=None, required_effect="candidate", summary_sha=None):
    """Return proofs for requested READY rows; never mutate a store or receipt.

    Exact CHECKED membership locates retained completion identities. An explicit
    summary SHA also supports older completions without that index. Neither path
    scans unrelated completion payloads or reconstructs their original history.
    """
    runner.prepare.require(required_effect in {"candidate", "canonical"}, "unknown completed CHECK effect")
    ready = {row["workId"]: row for row in rows if row.get("status") == "READY_FOR_PUBLICATION"}
    if not ready:
        return {}
    runner.prepare.require(len(ready) == sum(row.get("status") == "READY_FOR_PUBLICATION" for row in rows),
                           "duplicate READY Work in completion lookup")
    store = runner.Workspace(runner.REPO)
    if not getattr(store, "is_revision_store", False):
        return {}
    with closing(store.connect()) as db:
        if db.execute("SELECT 1 FROM head WHERE kind='completion' LIMIT 1").fetchone() is None:
            return {}
        if db.execute("SELECT 1 FROM head WHERE kind='curation' AND subject IN (" +
                      ",".join("?" for _ in ready) + ") LIMIT 1", tuple(ready)).fetchone() is None:
            return {}
    if state is None:
        state, baseline = runner.current()
    state_path = runner.ROOT / "STATE.json"
    state_sha = runner.panel.sha256(state_path)
    runner.prepare.require(runner.panel.read_json(state_path) == state, "STATE changed before completed CHECK proof")
    proofs, candidates, heads = {}, {}, {}
    canonical_incomplete = "Candidate complete; canonical publication and backup remain incomplete"
    with store.verification_context([], backup=True) as context, ExitStack() as stack:
        reader = _RetainedProof(store, context)
        revision, retained_json, heads = reader.revision, reader.retained_json, reader.heads

        for wid, row in ready.items():
            receipt, value = revision("curation", wid)
            if value is None:
                continue
            payload = value["payload"]
            works = payload.get("tables", {}).get("source_works", [])
            if (payload.get("schemaVersion") != "curation-baseline-v1" or
                payload.get("workId") != wid or payload.get("legacyAuthorityRequired") or
                len(works) != 1 or works[0].get("recommendationEligible") != "true" or
                works[0].get("annotationReviewMethod") != "authorizedEvidencePanel"):
                continue
            checked_path = runner.artifact_path(row["checkedPath"])
            runner.prepare.require(runner.panel.sha256(checked_path) == row["checkedSha256"],
                                   "completed CHECK summary bytes changed")
            checked = runner.panel.read_json(checked_path)
            runner.prepare.require(checked.get("workId") == wid and checked.get("status") == row["status"],
                                   "completed CHECK identity changed")
            run = checked_path.parent
            config = runner.panel.read_json(run / "RUN.json")
            frozen = runner.frozen_path(run, config) / "panel-input"
            job = runner.panel.read_json(frozen / "authoring-job.json")
            if works[0].get("annotationReviewReference") != f"reviews/authorized-evidence-panel-v1-batch-{job['batchId']}.md":
                continue
            sealed = runner.artifact_path(checked["sealedRoot"])
            results = {runner.panel.sha256(path) for path in (sealed / "panel-result").glob("chunk-*/PANEL-RESULT.sha256")}
            matched = [claim for claim in payload.get("claims", [])
                       if claim.get("sourceInputManifestSha256") == checked["inputManifestSha256"]
                       and claim.get("sourceResultManifestSha256") in results]
            if not matched:
                continue
            candidates[wid] = {"row": row, "checked": checked, "run": run, "config": config,
                               "frozen": frozen, "sealed": sealed, "curation": receipt,
                               "value": value, "claims": matched}

        applied_batches = state.get("publicationBatches", {})
        selected, identities = set(), {}
        if summary_sha in applied_batches:
            selected.add(summary_sha)
        db = context.views[0][1]
        for wid, item in candidates.items():
            checked_key = store.key(item["run"] / "CHECKED.json")
            matches = db.execute("SELECT h.kind,h.subject FROM revision_blob b JOIN head h ON h.revision_id=b.revision_id "
                "WHERE b.path=? AND b.sha256=? AND (h.kind='completion' OR "
                "(h.kind='active' AND h.subject LIKE 'completion-identity:%'))",
                (checked_key, item["row"]["checkedSha256"]))
            for kind, subject in matches:
                target = subject.removeprefix("completion-identity:") if kind == "active" else subject
                if target in applied_batches:
                    selected.add(target)
                    if kind == "active":
                        identities.setdefault(target, {})[checked_key] = item["row"]["checkedSha256"]
        for summary_sha in reversed(applied_batches):
            if summary_sha not in selected:
                continue
            remaining = set(candidates) - set(proofs)
            if not remaining:
                break
            receipt, value = revision("completion", summary_sha)
            if value is None:
                continue
            payload = value["payload"]
            finished = payload.get("finished", {})
            published = finished.get("works", [])
            relevant = remaining & {item.get("workId") for item in published}
            if not relevant:
                continue
            applied = applied_batches[summary_sha]
            if summary_sha in identities:
                _, identity = revision("active", "completion-identity:" + summary_sha,
                                       verify=True, members=identities[summary_sha])
                identity_payload = identity["payload"]
                runner.prepare.require(identity_payload.get("schemaVersion") == "catalog-completion-identity-v1" and
                    identity_payload.get("summarySha256") == summary_sha and identity_payload.get("applied") == applied and
                    {key: value for key, value in identity_payload.get("completion", {}).items() if key != "database"} ==
                    {key: value for key, value in receipt.items() if key != "database"},
                    "completed CHECK retained identity differs from its completion")
            revision("completion", summary_sha, verify=True)
            runner.prepare.require(payload.get("status") == "VERIFIED" and
                payload.get("summarySha256") == summary_sha and payload.get("applied") == applied,
                "completed CHECK ledger differs from STATE")
            retained = retained_json(value, Path(applied["batchRoot"]) / "BATCH-FINISHED.json", applied["receiptSha256"])
            runner.prepare.require(retained == finished and finished.get("summarySha256") == summary_sha
                and finished.get("status") == "READBACK_VERIFIED", "completed CHECK publication binding changed")
            legacy = True
            for _, db, _, _ in context.views:
                watermark = db.execute("SELECT value FROM store_meta WHERE key='legacy_revision_max_rowid'").fetchone()
                rowid = db.execute("SELECT rowid FROM revision WHERE id=?", (receipt["revisionId"],)).fetchone()[0]
                unmigrated = watermark is not None and rowid <= int(watermark[0])
                if unmigrated:
                    unmigrated = db.execute("SELECT 1 FROM change_log WHERE entity='revision' AND key1=? LIMIT 1",
                                            (receipt["revisionId"],)).fetchone() is None
                legacy = legacy and unmigrated
            canonical_receipt = None
            readback_value = retained_json(value, finished["readback"], finished["readbackSha256"])
            runner.prepare.require(readback_value.get("status") == "SQL_BUILD_COVERAGE_ENGINE_VERIFIED",
                                   "completed CHECK readback was not verified")
            from catalog_authoring_batch_publish import read_batch_summary
            summary = read_batch_summary(runner.artifact_path(finished["summaryPath"]), summary_sha)
            for wid in sorted(relevant):
                item = candidates[wid]
                bound = [row for row in summary["works"] if row.get("workId") == wid]
                # A newer adjudication of the same Work is not this completion.
                if len(bound) != 1 or bound[0].get("checkedSha256") != item["row"]["checkedSha256"]:
                    continue
                runner.prepare.require(bound[0].get("status") == "READY_FOR_PUBLICATION",
                                       "completed CHECK summary was not READY")
                runner.prepare.require(sum(row.get("workId") == wid for row in published) == 1
                    and not any(row.get("workId") == wid for row in finished.get("blockedWorks", []))
                    and wid in readback_value.get("targetWorkIds", []),
                    "completed CHECK Work was not successfully published")
                checked, config, frozen, sealed = (item[key] for key in ("checked", "config", "frozen", "sealed"))
                runner.prepare.require(config["decisionsSha256"] == checked["decisionsSha256"] ==
                    runner.panel.sha256(runner.artifact_path(config["decisionsPath"])), "completed CHECK decisions changed")
                runner.prepare.require(runner.panel.sha256(frozen / "PANEL-INPUT.sha256") == checked["inputManifestSha256"],
                                       "completed CHECK frozen input changed")
                runner.publisher._verify_result_manifest(sealed)
                runner.prepare.require(runner.panel.sha256(sealed / "MANIFEST.sha256") == checked["resultManifestSha256"],
                                       "completed CHECK sealed result changed")
                _, current = revision("curation", wid, verify=True)
                from catalog_retention import source_manifest
                source, db, _, _ = context.views[0]
                input_members = source_manifest(source, db, checked["inputManifestSha256"], retained=set(), selected=())
                runner.prepare.require(input_members.get("authoring-job.json") == runner.panel.sha256(frozen / "authoring-job.json"),
                                       "completed CHECK frozen Work identity changed")
                for claim in item["claims"]:
                    runner.prepare.require(claim["sourceInputManifestSha256"] in current["members"].values()
                        and claim["sourceResultManifestSha256"] in current["members"].values(),
                        "completed CHECK original adjudication was not retained")
                if required_effect == "canonical":
                    canonical_receipt, canonical_value = revision("canonical-completion", summary_sha)
                    if canonical_value is not None:
                        revision("canonical-completion", summary_sha, verify=True, members={})
                        runner.prepare.require(canonical_value["payload"].get("status") == "APPLIED" and
                            canonical_value["payload"].get("candidateReceiptSha256") == applied["receiptSha256"],
                            "completed CHECK canonical completion binding changed")
                    else:
                        runner.prepare.require(legacy, canonical_incomplete + ": this completed candidate has no canonical receipt")
                proofs[wid] = {"status": "ALREADY_APPLIED", "checkedSha256": item["row"]["checkedSha256"],
                    "completion": receipt, "curation": item["curation"], "summarySha256": summary_sha,
                    "receiptSha256": applied["receiptSha256"], "canonicalCompletion": canonical_receipt,
                    "legacyCompletion": legacy, "requiredEffect": required_effect}

        if proofs:
            from canonical_rebase import _scope
            pair_hashes = {}
            paths = [Path(baseline) / "catalog-expanded.candidate.sqlite"]
            if required_effect == "canonical":
                paths.append(runner.REPO / "data/source/catalog.sqlite")
            for path in paths:
                pair_hashes[path] = runner.panel.sha256(path)
                db = stack.enter_context(closing(sqlite3.connect(path.resolve().as_uri() + "?mode=ro", uri=True)))
                db.execute("BEGIN")
                scope = _scope(db, set(proofs), include_global=False)
                for wid in proofs:
                    tables = {name: [row for row in items if row.get("id" if name == "source_works" else "workId") == wid]
                              for name, items in scope.items() if name != "referencedEvidence"}
                    curation = candidates[wid]["value"]["payload"]
                    runner.prepare.require(_adjudication(tables, curation["claims"]) == _adjudication(curation["tables"], curation["claims"]),
                                           f"completed CHECK current adjudication changed: {wid}")
            runner.prepare.require(all(runner.panel.sha256(path) == sha for path, sha in pair_hashes.items()),
                                   "current Catalog advanced during completed CHECK proof")
            stack.close()
            if required_effect == "canonical":
                effect = verify_current_canonical_effect(state)
                runner.prepare.require(effect["canonicalSha256"] == pair_hashes[runner.REPO / "data/source/catalog.sqlite"],
                                       "current Catalog advanced between adjudication and effect proof")
                for proof in proofs.values():
                    proof["currentCanonicalEffect"] = effect
        runner.prepare.require(runner.panel.sha256(state_path) == state_sha, "STATE advanced during completed CHECK proof")
    _assert_heads(store, heads)
    if proofs:
        runner.prepare.require(all(runner.panel.sha256(path) == sha for path, sha in pair_hashes.items()),
                               "current Catalog advanced during completed CHECK effect proof")
    return proofs
