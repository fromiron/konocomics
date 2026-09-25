"""Batch publication on one private pair; original adjudications remain authority."""
from __future__ import annotations

from contextlib import closing
import json
import os
from pathlib import Path
import shutil
import sqlite3
from time import perf_counter

from authoring_paths import REPO, artifact_path

FORMAT = "catalog-compact-publication-v1"
WORK_FORMAT = "catalog-compact-work-v1"
CATALOG = "catalog-expanded.candidate.sqlite"
REGISTRY = "catalog-source-registry.candidate.sqlite"


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")


def object_sha(value):
    import hashlib
    return hashlib.sha256(encoded(value)).hexdigest()


def write_once(path, value):
    import catalog_authoring_runner as runner
    value = json.loads(encoded(value))
    if path.exists():
        if json.loads(path.read_text(encoding="utf-8")) != value:
            raise ValueError(f"Compact artifact changed on resume: {path}")
    else:
        runner.write(path, value)


def reference(root, manifest="MANIFEST.sha256"):
    import publish_factor_batch as publisher
    root = root.resolve()
    return {"root": str(root), "manifest": manifest, "sha256": publisher.sha256(root / manifest)}


def resolve_reference(value):
    import publish_factor_batch as publisher
    from catalog_workspace import unlinked
    root = unlinked(artifact_path(value["root"]))
    manifest = value["manifest"]
    if manifest not in {"MANIFEST.sha256", "PANEL-INPUT.sha256"}:
        raise ValueError("Unsupported compact source manifest")
    if publisher.sha256(root / manifest) != value["sha256"]:
        raise ValueError("Compact source manifest changed")
    if manifest == "PANEL-INPUT.sha256":
        publisher.validate_input(root)
    else:
        publisher._verify_result_manifest(root)
    return root


def target_view(snapshot, work_id):
    result = {}
    for table, (columns, rows) in snapshot.items():
        owner = "id" if table == "source_works" else "workId"
        if owner in columns:
            index = columns.index(owner)
            result[table] = [dict(zip(columns, row)) for row in rows if row[index] == work_id]
    return result


def logical_delta(before, after):
    changes = {}
    if set(before) != set(after):
        raise ValueError("Work mutation changed Catalog schema")
    for table, (columns, rows) in before.items():
        if columns != after[table][0]:
            raise ValueError("Work mutation changed Catalog columns")
        old, new = {row[0]: row for row in rows}, {row[0]: row for row in after[table][1]}
        delta = [{"before": old.get(key), "after": new.get(key)} for key in sorted(old.keys() | new.keys()) if old.get(key) != new.get(key)]
        if delta:
            changes[table] = {"columns": columns, "rows": delta}
    return changes


def prepare_work(entry, connection, registry_before, canonical_sha, reviewed_at, before):
    """Validate immutable authority once, then plan against this serial pair state."""
    import correct_factor_registry as correction
    import factor_single_pass as single
    import publish_factor_batch as publisher
    work_id = entry["workId"]
    input_root = resolve_reference(entry["input"])
    sealed = resolve_reference(entry["authority"])
    result_root = sealed / "panel-result"
    if (result_root / "chunk-01/PANEL-INPUT.sha256").read_bytes() != (input_root / "PANEL-INPUT.sha256").read_bytes():
        raise ValueError("Compact frozen/sealed input differs")
    lineage = publisher._read_json(input_root / "external-lineage.json")
    frozen_baseline = artifact_path(lineage["baselineRoot"]) / CATALOG
    frozen_registry = artifact_path(lineage["registryPath"])
    prior = publisher.panel_validation.load_prior_authority(input_root, frozen_baseline, work_ids={work_id})
    recovery = publisher.factor_recovery.validate_publish(input_root, result_root, frozen_baseline, connection)
    corrections = publisher._validate_axis_corrections(input_root, result_root, frozen_baseline, connection)
    fresh = {} if recovery else publisher._validate_fresh_unreviewed_snapshots(input_root, result_root, frozen_baseline, connection, prior)
    conflicts, _ = publisher._load_conflict_adjudication(input_root, result_root, frozen_baseline)
    if (set(fresh) & {key[0] for key in conflicts}) or (recovery and (corrections or conflicts)):
        raise ValueError("Incompatible compact correction/recovery scope")
    registry_slice = publisher._verify_input_identities(input_root, frozen_baseline, frozen_registry, publisher._repo_root(), canonical_sha=canonical_sha)
    safety = publisher._publication_safety(sealed / "safety-recheck-v1", input_root, result_root, recovery)
    backend = publisher._backend_module(safety, prior["evidence"], conflicts, prior, corrections, fresh, recovery)
    single.install_backend(backend, input_root, result_root)
    verified = backend.verify_immutable(input_root, result_root)
    if verified["targetIds"] != {work_id}:
        raise ValueError("One exact Work is required per compact step")
    changes = publisher.registry_correction_changes(frozen_baseline, frozen_registry, {work_id})
    registry_after, pending = publisher.plan_registry_correction(changes, registry_before)
    tables = registry_after["tables"]
    metadata = {row["key"]: row["value"] for row in tables["registry_meta"]["rows"]}
    columns = sorted(tables["registry_source_rows"]["columns"])
    registry = backend.registry_facts(metadata, columns, tables["registry_source_rows"]["rows"], {work_id})
    registry = backend._bind_frozen_registry(input_root, {work_id}, registry, registry_slice)
    gold = backend._load_gold_ids(publisher._repo_root() / "data/staging/catalog-expansion/gold-set-manifest.json")
    review_reference = "reviews/authorized-evidence-panel-v1-batch-" + str(verified["panelInput"]["batchId"]) + ".md"
    plan, _, _ = backend.plan_against_current(connection, verified, registry, reviewed_at, review_reference, gold,
                                             baseline_snapshot=before)
    return {"backend": backend, "verified": verified, "plan": plan, "gold": gold,
            "registryAfter": registry_after, "registryChanges": pending, "reviewReference": review_reference,
            "inputRoot": input_root, "resultRoot": result_root, "safety": safety}


def _pair_version(connection):
    # data_version detects other connections; total_changes covers our own writes.
    return (connection.total_changes, *(connection.execute(f"pragma {namespace}.{pragma}").fetchone()[0]
        for namespace in ("main", "registry") for pragma in ("data_version", "schema_version")))


def _commit_view(connection, prepared, receipt):
    version = _pair_version(connection)  # Capture while the transaction still excludes external writes.
    connection.commit()  # A failed commit must never advance the reusable view.
    return (connection, version, prepared["after"], prepared["registrySnapshot"], receipt["afterSemanticSha256"])


def apply_work(entry, connection, canonical_sha, reviewed_at, *, _previous=None, _metrics=None):
    """The caller owns both attached databases and the transaction."""
    import correct_factor_registry as correction
    import publish_factor_batch as publisher
    if not connection.in_transaction:
        raise ValueError("Compact application requires an owned pair transaction")
    timings = {}
    started = perf_counter()
    reused = _previous is not None and _previous[0] is connection and _previous[1] == _pair_version(connection)
    if reused:
        before, registry_before, before_sha = _previous[2:]
    else:
        before = publisher._backend_module()._snapshot_db(connection)
        registry_before = correction.snapshot(connection, namespace="registry", integrity=False)
        before_sha = None
    timings["beforeRead"] = perf_counter() - started
    started = perf_counter()
    prepared = prepare_work(entry, connection, registry_before, canonical_sha, reviewed_at, before)
    timings["authorityAndPlan"] = perf_counter() - started
    backend, plan = prepared["backend"], prepared["plan"]
    started = perf_counter()
    publisher.apply_registry_correction(connection, prepared["registryChanges"], "registry")
    backend.apply_plan_in_transaction(connection, plan)
    timings["mutation"] = perf_counter() - started
    started = perf_counter()
    after = backend._snapshot_db(connection)
    registry_after = correction.snapshot(connection, namespace="registry", integrity=False)
    timings["afterRead"] = perf_counter() - started
    # The same after-view is shared through all adapters, rather than rereading
    # the whole database for each stacked preservation check.
    started = perf_counter()
    backend._verify_preservation(before, after, plan, prepared["gold"])
    correction.preservation(registry_before, registry_after, prepared["registryAfter"], prepared["registryChanges"])
    timings["preservation"] = perf_counter() - started
    started = perf_counter()
    receipt = {"schemaVersion": WORK_FORMAT, "workId": entry["workId"], "input": entry["input"],
               "authority": entry["authority"], "reviewedAt": reviewed_at,
               "beforeSemanticSha256": before_sha or object_sha(before), "afterSemanticSha256": object_sha(after),
               "plan": plan, "delta": logical_delta(before, after),
               "registryChanges": prepared["registryChanges"], "expectedAfter": target_view(after, entry["workId"])}
    timings["serializationAndDelta"] = perf_counter() - started
    prepared.update(after=after, registrySnapshot=registry_after)
    if _metrics is not None:
        _metrics.update(timingsSeconds=timings, sourceSnapshots=1 + int(not reused),
                        semanticHashes=1 + int(not reused), reusedBefore=reused, plannerSourceQueries=0)
    return prepared, receipt, before


def read_stored_file(reference, *, backup=False):
    """Read an immutable source version even when its working copy advanced."""
    from catalog_workspace import Workspace, manifest_digest, key_path
    import re
    key_path(reference["path"])
    if not re.fullmatch(r"[0-9a-f]{64}", reference["sha256"]):
        raise ValueError("Invalid compact source hash")
    workspace = Workspace(REPO, REPO / "data/local/catalog-authoring/backups/latest.sqlite" if backup else None)
    if not workspace.database.exists():
        for path in (artifact_path(REPO / reference["path"]), REPO / "data/local/catalog-authoring/restored-versions" / reference["sha256"]):
            if path.is_file():
                body = path.read_bytes()
                import hashlib
                if hashlib.sha256(body).hexdigest() == reference["sha256"]:
                    return body
        raise ValueError("Restored compact source version missing or changed")
    snapshot = reference["snapshot"]
    with closing(workspace.connect()) as db:
        header = db.execute("SELECT file_count,manifest_sha256 FROM snapshot WHERE id=?", (snapshot["snapshotId"],)).fetchone()
        rows = db.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (snapshot["snapshotId"],)).fetchall()
        if header != (snapshot["files"], snapshot["manifestSha256"]) or len(rows) != header[0] or manifest_digest(rows) != header[1]:
            raise ValueError("Compact source snapshot changed")
        if dict(rows).get(reference["path"]) != reference["sha256"]:
            raise ValueError("Compact source file is outside its saved snapshot")
        return workspace.read_blob(db, reference["sha256"])


def stored_reference(path, sha=None, *, backup=False):
    import publish_factor_batch as publisher
    from catalog_workspace import Workspace
    workspace = Workspace(REPO, REPO / "data/local/catalog-authoring/backups/latest.sqlite" if backup else None)
    key = workspace.key(path)
    sha = sha or publisher.sha256(path)
    with closing(workspace.connect()) as db:
        row = db.execute("""SELECT s.id,s.file_count,s.manifest_sha256 FROM entry e
            JOIN snapshot s ON s.id=e.snapshot_id WHERE e.path=? AND e.sha256=?
            ORDER BY e.snapshot_id DESC LIMIT 1""", (key, sha)).fetchone()
    if row is None:
        raise ValueError(f"Compact source is not durably stored: {path}")
    return {"path": key, "sha256": sha, "snapshot": dict(zip(("snapshotId", "files", "manifestSha256"), row))}


def restore_missing(path, sha):
    import publish_factor_batch as publisher
    if path.exists():
        if publisher.sha256(path) != sha:
            raise ValueError(f"Compact checkpoint member changed: {path}")
        return
    value = stored_reference(path, sha, backup=True)
    body = read_stored_file(value, backup=True)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("xb") as stream:
        stream.write(body)
        stream.flush()
        os.fsync(stream.fileno())


def dependency_storage(paths):
    import catalog_authoring_runner as runner
    from catalog_workspace import Workspace, authoring_inputs
    workspace = Workspace(REPO)
    started = perf_counter()
    roots = authoring_inputs(paths, workspace)
    metrics = {"closureSeconds": perf_counter() - started, "roots": len(roots)}
    started = perf_counter()
    references = runner.preserve(roots, "compact-publication:inputs", reuse=True, metrics=metrics)["references"]
    metrics["preserveSeconds"] = perf_counter() - started
    print(json.dumps({"compactDependencyStorage": metrics}), flush=True)
    return references


def copy_checkpoint_pair(stage, root):
    """An interrupted copy has no receipt and may be rebuilt from the owned pair."""
    import publish_factor_batch as publisher
    root.mkdir(parents=True, exist_ok=True)
    for name in (CATALOG, REGISTRY):
        if not (root / "CHECKPOINT.json").exists() or not (root / name).exists():
            shutil.copy2(stage / name, root / name)
        if publisher.sha256(stage / name) != publisher.sha256(root / name):
            raise ValueError("Compact checkpoint pair changed")


def publish(batch, entries, initial, summary_sha, *, checkpoint_every=10):
    """Apply saved READY decisions serially, retaining one full pair per checkpoint."""
    import catalog_authoring_batch_publish as batch_publisher
    import catalog_authoring_runner as runner
    import correct_factor_registry as correction
    import publish_factor_batch as publisher
    if type(checkpoint_every) is not int or checkpoint_every < 1:
        raise ValueError("Checkpoint interval must be positive")
    batch, initial = batch.resolve(), initial.resolve()
    stage, output = batch / "compact-working", batch / "publication-compact"
    checkpoints = batch / "checkpoints"
    canonical = publisher._repo_root() / "data/source/catalog.sqlite"
    selected = [{"workId": wid, "input": reference(frozen / "panel-input", "PANEL-INPUT.sha256"),
                 "authority": reference(sealed)} for wid, run, frozen, sealed in entries]
    identity = {"schemaVersion": FORMAT, "summarySha256": summary_sha, "entries": selected,
                "baseline": reference(initial), "canonicalSha256": publisher.sha256(canonical),
                "code": batch_publisher.code_identity(), "checkpointEvery": checkpoint_every}
    if output.exists():
        publisher._verify_result_manifest(output)
        saved = publisher._read_json(output / "IDENTITY.json")
        if saved != json.loads(encoded(identity)):
            raise ValueError("Compact completed publication identity changed")
        value = publisher._read_json(output / "COMPACT-PUBLICATION.json")
        return output, [row["workId"] for row in value["works"]], value["failures"]
    stage.mkdir(parents=True, exist_ok=True)
    write_once(stage / "IDENTITY.json", identity)
    storage_file = stage / "DEPENDENCIES.json"
    if storage_file.exists():
        dependencies = json.loads(storage_file.read_text(encoding="utf-8"))
        if not isinstance(dependencies, list):
            raise ValueError("Compact dependency references must be a list")
    else:
        from catalog_readback_identity import execution_inputs
        backend = publisher._backend_module()
        alias_source = backend._find_repo_file(backend.ALIAS_RESOLUTION_RELATIVE)
        if alias_source is None:
            raise ValueError("Approved Gold alias source is missing")
        dependencies = dependency_storage([initial, canonical,
            alias_source,
            *[REPO / name for name in identity["code"]["files"]], *execution_inputs(REPO),
            *[resolve_reference(row[key]) for row in selected for key in ("input", "authority")]])
        write_once(storage_file, dependencies)
    sources = {"catalog": stored_reference(initial / CATALOG), "registry": stored_reference(initial / REGISTRY),
               "canonical": stored_reference(canonical)}
    pair_catalog, pair_registry = stage / CATALOG, stage / REGISTRY
    records, failures, reviews, completed = [], [], {}, 0
    for name in ("works", "intents", "data", "failures"):
        (stage / name).mkdir(exist_ok=True)
    # Only a fully backed checkpoint advances the resume prefix. Later private
    # commits are replayed from their immutable intents, never applied twice.
    for path in sorted(checkpoints.glob("*/CHECKPOINT.json")):
        if runner.receipt_backed_up(path):
            checkpoint = publisher._read_json(path)
            if checkpoint["identitySha256"] != object_sha(identity):
                raise ValueError("Compact checkpoint belongs to another batch")
            completed = checkpoint["processedCount"]
            records, failures, reviews = checkpoint["works"], checkpoint["failures"], checkpoint["reviews"]
            for name, sha in checkpoint["pair"].items():
                restore_missing(path.parent / name, sha)
            for row in records:
                restore_missing(stage / row["receipt"], row["sha256"])
            for name, sha in reviews.items():
                restore_missing(stage / "data/source" / name, sha)
            checkpoint_pair = path.parent
    for name in (CATALOG, REGISTRY):
        target = stage / name
        for suffix in ("-wal", "-shm", "-journal"):
            if Path(str(target) + suffix).exists():
                # Let SQLite recover its own hot journal before replacing our
                # private replay files. Never delete a transaction sidecar.
                with closing(sqlite3.connect(target)) as recovery_connection:
                    recovery_connection.execute("pragma integrity_check").fetchall()
        shutil.copy2((checkpoint_pair if completed else initial) / name, target)
    backend = publisher._backend_module()
    backend.ensure_baseline(pair_catalog)
    backend.ensure_registry(pair_registry, {row["workId"] for row in selected})
    gold = backend._load_gold_ids(publisher._repo_root() / "data/staging/catalog-expansion/gold-set-manifest.json")
    backend._validate_alias_boundary(pair_catalog, None, gold)
    connection = sqlite3.connect(pair_catalog)
    try:
        connection.execute("pragma journal_mode=DELETE")
        connection.execute("pragma synchronous=FULL")
        connection.execute("attach database ? as registry", (str(pair_registry),))
        connection.execute("pragma registry.journal_mode=DELETE")
        connection.execute("pragma registry.synchronous=FULL")
        if not completed:
            connection.execute("begin immediate")
            publisher.preserve_book_metadata(connection, canonical, backend)
            connection.commit()
        previous = None  # A restored pair always starts with a fresh actual view.
        for index, entry in enumerate(selected):
            if index < completed:
                continue
            wid = entry["workId"]
            intent_path = stage / "intents" / f"{index + 1:04d}.json"
            intent = publisher._read_json(intent_path) if intent_path.exists() else {**entry, "reviewedAt": runner.utc_now()}
            if {key: intent[key] for key in entry} != entry:
                raise ValueError("Compact Work intent changed")
            write_once(intent_path, intent)
            before_sha = publisher.sha256(pair_catalog)
            connection.execute("begin immediate")
            work_metrics = {}
            try:
                prepared, receipt, before = apply_work(entry, connection, identity["canonicalSha256"], intent["reviewedAt"],
                    _previous=previous, _metrics=work_metrics)
                previous = _commit_view(connection, prepared, receipt)
            except BaseException as error:
                connection.rollback()
                previous = None
                if isinstance(error, ValueError) and batch_publisher.preflight_scope(str(error), wid) == "WORK":
                    failure = {"workId": wid, "error": str(error), "scope": "WORK"}
                    failures.append(failure)
                    write_once(stage / "failures" / (wid + ".json"), failure)
                else:
                    raise
            else:
                work_backend = prepared["backend"]
                verified = prepared["verified"]
                review_info = work_backend._prepare_review_artifacts(stage,
                    input_root=prepared["inputRoot"], result_root=prepared["resultRoot"], baseline_db=initial / CATALOG,
                    baseline_snapshot=before, prepared={"panelResult": verified["panelResult"], "targetCount": 1,
                    "inputManifestSha256": verified["inputManifestSha256"]}, plan=prepared["plan"],
                    baseline_sha=before_sha, reviewed_at=intent["reviewedAt"], review_reference=prepared["reviewReference"], reuse_reviews=reviews)
                reviews = review_info["reviewArtifacts"]
                path = stage / "works" / (wid + ".json")
                write_once(path, receipt)
                records.append({"workId": wid, "receipt": path.relative_to(stage).as_posix(), "sha256": publisher.sha256(path)})
            if (index + 1) % checkpoint_every == 0 and index + 1 < len(selected):
                root = checkpoints / f"{index + 1:04d}"
                copy_checkpoint_pair(stage, root)
                checkpoint = {"schemaVersion": FORMAT, "identitySha256": object_sha(identity), "processedCount": index + 1,
                    "pair": {name: publisher.sha256(root / name) for name in (CATALOG, REGISTRY)},
                    "dependencies": dependencies, "sources": sources,
                    "works": records, "failures": failures, "reviews": reviews}
                write_once(root / "CHECKPOINT.json", checkpoint)
                runner.preserve([root, stage / "works", stage / "intents", stage / "data", stage / "failures", storage_file, stage / "IDENTITY.json"],
                                "compact-publication:checkpoint", reuse=True)
            print(json.dumps({"compactProcessed": index + 1, "workId": wid, "published": len(records), "blocked": len(failures),
                              "metrics": work_metrics}), flush=True)
        if not records:
            raise ValueError("Compact publication has no applicable READY Work")
        backend._validate_schema(connection, "compact final candidate")
        for namespace in ("main", "registry"):
            if (connection.execute(f"pragma {namespace}.integrity_check").fetchone()[0] != "ok"
                    or connection.execute(f"pragma {namespace}.foreign_key_check").fetchall()):
                raise ValueError("Compact pair integrity failure")
    finally:
        connection.close()
    if (publisher.sha256(canonical) != identity["canonicalSha256"]
            or batch_publisher.code_identity() != identity["code"]):
        raise ValueError("Compact execution code or canonical identity changed")
    resolve_reference(identity["baseline"])
    value = {"schemaVersion": FORMAT, "baseline": identity["baseline"], "sources": sources, "dependencies": dependencies,
             "works": records, "failures": failures, "reviews": reviews}
    write_once(stage / "COMPACT-PUBLICATION.json", value)
    publisher._write_result_manifest(stage)
    publisher._verify_result_manifest(stage)
    os.replace(stage, output)
    publisher._verify_result_manifest(output)
    return output, [row["workId"] for row in records], failures


def verify_publication(root):
    """Reconstruct expected state from original decisions, never trust an actual-row hash."""
    import publish_factor_batch as publisher
    root = root.resolve()
    publisher._verify_result_manifest(root)
    metadata = publisher._read_json(root / "COMPACT-PUBLICATION.json")
    if metadata["schemaVersion"] != FORMAT:
        raise ValueError("Unknown compact publication version")
    baseline = resolve_reference(metadata["baseline"])
    for name, filename in (("catalog", CATALOG), ("registry", REGISTRY)):
        if publisher.sha256(baseline / filename) != metadata["sources"][name]["sha256"]:
            raise ValueError("Compact saved source differs from its baseline manifest")
    connection = sqlite3.connect(":memory:")
    canonical = sqlite3.connect(":memory:")
    try:
        connection.deserialize(read_stored_file(metadata["sources"]["catalog"]))
        connection.execute("attach database ':memory:' as registry")
        connection.deserialize(read_stored_file(metadata["sources"]["registry"]), name="registry")
        canonical.deserialize(read_stored_file(metadata["sources"]["canonical"]))
        backend = publisher._backend_module()
        connection.execute("begin")
        publisher.preserve_book_metadata(connection, canonical, backend)
        connection.commit()
        expectations = {}
        previous = None
        with publisher.panel_validation.manifest_verification_cache():
            for step in metadata["works"]:
                path = publisher._safe_child(root, step["receipt"])
                if publisher.sha256(path) != step["sha256"]:
                    raise ValueError("Compact work receipt changed")
                saved = publisher._read_json(path)
                if saved["workId"] in expectations:
                    raise ValueError("Duplicate compact Work")
                connection.execute("begin")
                prepared, actual, _ = apply_work(saved, connection, metadata["sources"]["canonical"]["sha256"], saved["reviewedAt"], _previous=previous)
                if encoded(actual) != encoded(saved):
                    raise ValueError("Compact expected-after differs from original authority and plan")
                previous = _commit_view(connection, prepared, actual)
                expectations[saved["workId"]] = actual["expectedAfter"]
        if backend._snapshot_db(connection) != backend._snapshot_db(root / CATALOG):
            raise ValueError("Compact final Catalog differs from verified serial plans")
        import correct_factor_registry as correction
        if correction.snapshot(connection, namespace="registry") != correction.snapshot(root / REGISTRY):
            raise ValueError("Compact final registry differs from verified serial plans")
        return {"schemaVersion": FORMAT, "works": expectations,
                "manifestSha256": publisher.sha256(root / "MANIFEST.sha256")}
    finally:
        canonical.close()
        connection.close()
