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

LEGACY_FORMAT = "catalog-compact-publication-v1"
LEGACY_WORK_FORMAT = "catalog-compact-work-v1"
FORMAT = "catalog-compact-publication-v2"
WORK_FORMAT = "catalog-compact-work-v2"
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


def verify_source_references(entries):
    """Recheck the saved original source bytes once at the batch boundary.

    Recursive semantic validation may reuse immutable prior authority within
    the batch. This direct check deliberately avoids that cache before sealing
    the completed publication, and does not repeat the prior authority graph.
    """
    import publish_factor_batch as publisher
    from catalog_workspace import unlinked
    seen = set()
    for entry in entries:
        for field in ("input", "authority"):
            value = entry[field]
            key = (value["root"], value["manifest"], value["sha256"])
            if key in seen:
                continue
            seen.add(key)
            root = unlinked(artifact_path(value["root"]))
            manifest = root / value["manifest"]
            if manifest.is_symlink() or publisher.sha256(manifest) != value["sha256"]:
                raise ValueError("Compact original source manifest changed during publication")
            members = {path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file() and path != manifest}
            publisher.verify_manifest(root, manifest, members)


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


def verify_reviews(root, reviews):
    import publish_factor_batch as publisher
    for reference, sha in reviews.items():
        path = publisher._safe_child(root / "data/source", reference)
        if not path.is_file() or path.is_symlink() or publisher.sha256(path) != sha:
            raise ValueError(f"Compact referenced review changed: {reference}")


def prepare_work(entry, connection, registry_before, canonical_sha, reviewed_at, before, *, canonical_bytes=None,
                 immutable_source_hashes=None, policy_documents=None):
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
    from canonical_rebase import validate_rebase
    rebase = validate_rebase(input_root, canonical_sha, canonical_bytes=canonical_bytes,
                             policy_documents=policy_documents)
    original_canonical_sha = publisher._read_json(input_root / "panel-input.json")["canonicalSha256"]
    if immutable_source_hashes is None:
        baseline_sha = None
    else:
        key = frozen_baseline.resolve()
        if key not in immutable_source_hashes:
            immutable_source_hashes[key] = publisher.sha256(key)
        baseline_sha = immutable_source_hashes[key]
    registry_slice = publisher._verify_input_identities(input_root, frozen_baseline, frozen_registry, publisher._repo_root(),
                                                       canonical_sha=original_canonical_sha, baseline_sha=baseline_sha)
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
            "inputRoot": input_root, "resultRoot": result_root, "safety": safety, "canonicalRebase": rebase}


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
    receipt = {"schemaVersion": LEGACY_WORK_FORMAT, "workId": entry["workId"], "input": entry["input"],
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


class BatchView:
    """Batch-owned indexed state, derived from one actual read of each database."""

    def __init__(self, connection, *, gold=()):
        from compact_plan import CatalogState
        from correct_factor_registry import RegistryState, snapshot
        import publish_factor_batch as publisher
        self.catalog = CatalogState(publisher._backend_module()._snapshot_db(connection), gold_ids=gold)
        self.registry = RegistryState(snapshot(connection, namespace="registry", integrity=False))
        self.connection = connection
        self.version = _pair_version(connection)
        self.immutable_source_hashes = {}

    def require_current(self, connection):
        if self.connection is not connection or self.version != _pair_version(connection):
            raise ValueError("Compact pair changed outside the batch owner")

    def committed(self, connection):
        version = _pair_version(connection)
        connection.commit()
        self.version = version

    def verify_final(self, connection):
        import correct_factor_registry as correction
        import publish_factor_batch as publisher
        if self.catalog.snapshot() != publisher._backend_module()._snapshot_db(connection):
            raise ValueError("Compact final Catalog differs from independent sealed plans")
        if self.registry.snapshot() != correction.snapshot(connection, namespace="registry", integrity=False):
            raise ValueError("Compact final registry differs from independent sealed corrections")
        self.verify_sources()

    def verify_sources(self):
        import publish_factor_batch as publisher
        for path, sha in self.immutable_source_hashes.items():
            if publisher.sha256(path) != sha:
                raise ValueError("Compact immutable source changed during publication")


def _read_target(connection, template, work_id):
    """Read the direct user-visible Work rows without rescanning unrelated works."""
    result = {}
    for table, (columns, _) in template.items():
        owner = "id" if table == "source_works" else "workId"
        if owner in columns:
            rows = connection.execute(f'SELECT * FROM "{table}" WHERE "{owner}"=? ORDER BY sourceOrdinal', (work_id,)).fetchall()
            result[table] = (tuple(columns), tuple(tuple(row) for row in rows))
    return result


def prepare_work_v2(entry, connection, canonical_sha, reviewed_at, view, *, canonical_bytes=None,
                    policy_documents=None):
    """Seal the authority-derived plan before any database mutation."""
    view.require_current(connection)
    before = view.catalog.scope({entry["workId"]})
    prepared = prepare_work(entry, connection, view.registry.scope(entry["workId"]), canonical_sha, reviewed_at,
                            before, canonical_bytes=canonical_bytes, immutable_source_hashes=view.immutable_source_hashes,
                            policy_documents=policy_documents)
    prepared["backend"].defer_full_projection_validation = True
    seal = {"schemaVersion": "catalog-compact-plan-v2", **entry, "reviewedAt": reviewed_at,
            "beforeTargetSha256": object_sha(target_view(before, entry["workId"])),
            "plan": prepared["plan"], "registryChanges": prepared["registryChanges"],
            "canonicalRebase": prepared.get("canonicalRebase")}
    return prepared, seal, before


def apply_work_v2(entry, connection, prepared, seal, view):
    """Predict independently, then compare actual touched rows and final full state."""
    import publish_factor_batch as publisher
    if not connection.in_transaction:
        raise ValueError("Compact application requires an owned pair transaction")
    view.require_current(connection)
    if seal["plan"] != prepared["plan"] or seal["registryChanges"] != prepared["registryChanges"]:
        raise ValueError("Compact plan changed after sealing")
    view.catalog.apply(seal["plan"])
    view.registry.apply(seal["registryChanges"])
    publisher.apply_registry_correction(connection, seal["registryChanges"], "registry")
    prepared["backend"].apply_plan_in_transaction(connection, seal["plan"])
    expected = view.catalog.scope({entry["workId"]})
    actual = _read_target(connection, expected, entry["workId"])
    expected_target = {name: value for name, value in expected.items()
                       if ("id" if name == "source_works" else "workId") in value[0]}
    if actual != expected_target:
        raise ValueError("Compact Work write differs from independent sealed plan")
    view.registry.verify_touched(connection, seal["registryChanges"])
    return {"schemaVersion": WORK_FORMAT, **entry, "reviewedAt": seal["reviewedAt"],
            "planSha256": object_sha(seal), "plan": seal["plan"],
            "registryChanges": seal["registryChanges"], "canonicalRebase": seal["canonicalRebase"],
            "beforeTargetSha256": seal["beforeTargetSha256"], "expectedAfter": target_view(expected, entry["workId"])}


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
    if getattr(workspace, "is_revision_store", False):
        return workspace.stored_bytes(reference)
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
    if getattr(workspace, "is_revision_store", False):
        reference = workspace.file_reference(path, sha)
        if reference is None:
            raise ValueError(f"Compact source is not durably stored: {path}")
        return reference
    with closing(workspace.connect()) as db:
        row = db.execute("""SELECT s.id,s.file_count,s.manifest_sha256 FROM entry e
            JOIN snapshot s ON s.id=e.snapshot_id WHERE e.path=? AND e.sha256=?
            ORDER BY e.snapshot_id DESC LIMIT 1""", (key, sha)).fetchone()
    if row is None:
        raise ValueError(f"Compact source is not durably stored: {path}")
    return {"path": key, "sha256": sha, "snapshot": dict(zip(("snapshotId", "files", "manifestSha256"), row))}


def publication_policies(sources):
    """Use publication-time policies on audit, with ordinary source retention."""
    from canonical_rebase import POLICIES
    names = {"policy-" + name for name in POLICIES}
    present = {name for name in sources if name.startswith("policy-")}
    if not present:
        return None  # Older publications retain their original policy lookup.
    if present != names:
        raise ValueError("Compact publication policy sources are incomplete")
    result = {}
    for name, relative in POLICIES.items():
        reference = sources["policy-" + name]
        if reference["path"] != relative:
            raise ValueError("Compact publication policy source path changed")
        result[name] = read_stored_file(reference)
    return result


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
    retained = []
    roots = authoring_inputs(paths, workspace, retained=retained)
    metrics = {"closureSeconds": perf_counter() - started, "roots": len(roots),
               "retainedReferences": len(retained), "retainedFiles": sum(len(ref["members"]) for ref in retained)}
    started = perf_counter()
    references = runner.preserve(roots, "compact-publication:inputs", reuse=True, metrics=metrics)["references"]
    metrics["preserveSeconds"] = perf_counter() - started
    print(json.dumps({"compactDependencyStorage": metrics}), flush=True)
    return [*references, *retained]


def copy_checkpoint_pair(stage, root):
    """An interrupted copy has no receipt and may be rebuilt from the owned pair."""
    import publish_factor_batch as publisher
    root.mkdir(parents=True, exist_ok=True)
    for name in (CATALOG, REGISTRY):
        if not (root / "CHECKPOINT.json").exists() or not (root / name).exists():
            shutil.copy2(stage / name, root / name)
        if publisher.sha256(stage / name) != publisher.sha256(root / name):
            raise ValueError("Compact checkpoint pair changed")


def transient_subject(workspace, batch):
    return "compact-publication:" + workspace.key(batch.resolve())


def durable_batch_paths(batch):
    """Exclude only an explicitly registered execution's disposable copies."""
    import catalog_authoring_runner as runner
    workspace = runner.Workspace(runner.REPO)
    if not getattr(workspace, "is_revision_store", False):
        return [batch]
    execution = workspace.current_revision("execution", transient_subject(workspace, batch))
    if execution is None:
        return [batch]
    roots = workspace._transient_roots(workspace.get_revision(execution)["payload"])
    return [path for path in workspace.files([batch]) if not workspace._within_transient(workspace.key(path), roots)]


def complete_transient_lifetime(batch):
    """Called only after the requested candidate/canonical effects and backups."""
    import catalog_authoring_runner as runner
    workspace = runner.Workspace(runner.REPO)
    if not getattr(workspace, "is_revision_store", False):
        return None
    execution = workspace.current_revision("execution", transient_subject(workspace, batch))
    if execution is None:
        return None  # Older publications have no disposable scope grant.
    workspace.close_transient_execution(execution)
    workspace.backup()
    return workspace.retire_transient_files(execution)


def _publish(batch, entries, initial, summary_sha, *, checkpoint_every=10):
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
    from catalog_workspace import Workspace
    workspace = Workspace(REPO)
    execution = None
    if getattr(workspace, "is_revision_store", False):
        payload = {"schemaVersion": "authoring-transient-execution-v1", "identitySha256": object_sha(identity),
                   "disposableRoots": [workspace.key(stage), workspace.key(checkpoints)]}
        subject = transient_subject(workspace, batch)
        execution = workspace.current_revision("execution", subject)
        if execution is None:
            execution = workspace.put_revision("execution", subject, {**payload, "startedAt": runner.utc_now()})
        elif {key: value for key, value in workspace.get_revision(execution)["payload"].items() if key != "startedAt"} != payload:
            raise ValueError("Compact transient execution identity changed")
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
    from canonical_rebase import POLICIES
    sources.update({"policy-" + name: stored_reference(REPO / relative, identity["code"]["files"][relative])
                    for name, relative in POLICIES.items()})
    policy_documents = publication_policies(sources)
    # Rebase verification needs the original exact bytes after later canonical
    # publications and retention. Pin immutable file references separately from
    # the deterministic semantic receipt (whose meaning cannot depend on which
    # matching revision happened to be selected).
    for row in selected:
        info = publisher._read_json(artifact_path(row["input"]["root"]) / "panel-input.json")
        original_sha = info["canonicalSha256"]
        if original_sha != identity["canonicalSha256"]:
            key = "canonical-original-" + original_sha
            if key not in sources:
                sources[key] = stored_reference(REPO / "data/source/catalog.sqlite", original_sha)
    pair_catalog, pair_registry = stage / CATALOG, stage / REGISTRY
    records, failures, reviews, completed = [], [], {}, 0
    for name in ("works", "plans", "intents", "data", "failures"):
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
                restore_missing(stage / row["plan"], row["planSha256"])
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
        view = BatchView(connection, gold=gold)
        baseline_reviews = view.catalog.snapshot()
        verified_reviews = set()  # Only references read in this process may be reused.
        for index, entry in enumerate(selected):
            if index < completed:
                continue
            wid = entry["workId"]
            intent_path = stage / "intents" / f"{index + 1:04d}.json"
            intent = publisher._read_json(intent_path) if intent_path.exists() else {**entry, "reviewedAt": runner.utc_now()}
            if {key: intent[key] for key in entry} != entry:
                raise ValueError("Compact Work intent changed")
            write_once(intent_path, intent)
            connection.execute("begin immediate")
            work_metrics = {}
            started = perf_counter()
            try:
                prepared, seal, before = prepare_work_v2(entry, connection, identity["canonicalSha256"], intent["reviewedAt"], view,
                                                       policy_documents=policy_documents)
            except BaseException as error:
                connection.rollback()
                if isinstance(error, ValueError) and batch_publisher.preflight_scope(str(error), wid) == "WORK":
                    failure = {"workId": wid, "error": str(error), "scope": "WORK"}
                    failures.append(failure)
                    write_once(stage / "failures" / (wid + ".json"), failure)
                else:
                    raise
            else:
                work_metrics["authorityAndPlanSeconds"] = perf_counter() - started
                plan_path = stage / "plans" / (wid + ".json")
                write_once(plan_path, seal)
                started = perf_counter()
                # Failures after a plan is sealed are product/IO failures, never
                # a per-Work HOLD. Discard this private attempt and replay its
                # immutable prefix after recovery instead of continuing a stale view.
                receipt = apply_work_v2(entry, connection, prepared, seal, view)
                view.committed(connection)
                work_metrics.update(applyAndReadbackSeconds=perf_counter() - started,
                                    fullCatalogReads=0, fullRegistryReads=0, fullCatalogHashes=0)
                work_backend = prepared["backend"]
                verified = prepared["verified"]
                review_info = work_backend._prepare_review_artifacts(stage,
                    input_root=prepared["inputRoot"], result_root=prepared["resultRoot"], baseline_db=initial / CATALOG,
                    baseline_snapshot=baseline_reviews if baseline_reviews is not None else before,
                    prepared={"panelResult": verified["panelResult"], "targetCount": 1,
                    "inputManifestSha256": verified["inputManifestSha256"]}, plan=prepared["plan"],
                    baseline_sha=sources["catalog"]["sha256"], reviewed_at=intent["reviewedAt"],
                    review_reference=prepared["reviewReference"], reuse_reviews=reviews,
                    verified_review_references=verified_reviews)
                baseline_reviews = None
                reviews = review_info["reviewArtifacts"]
                path = stage / "works" / (wid + ".json")
                write_once(path, receipt)
                records.append({"workId": wid, "receipt": path.relative_to(stage).as_posix(), "sha256": publisher.sha256(path),
                                "plan": plan_path.relative_to(stage).as_posix(), "planSha256": publisher.sha256(plan_path)})
            if (index + 1) % checkpoint_every == 0 and index + 1 < len(selected):
                root = checkpoints / f"{index + 1:04d}"
                copy_checkpoint_pair(stage, root)
                checkpoint = {"schemaVersion": FORMAT, "identitySha256": object_sha(identity), "processedCount": index + 1,
                    "pair": {name: publisher.sha256(root / name) for name in (CATALOG, REGISTRY)},
                    "dependencies": dependencies, "sources": sources,
                    "works": records, "failures": failures, "reviews": reviews}
                write_once(root / "CHECKPOINT.json", checkpoint)
                checkpoint_paths = [root, stage / "works", stage / "plans", stage / "intents", stage / "data", stage / "failures", storage_file, stage / "IDENTITY.json"]
                # A checkpoint can follow an isolated failure before any Work
                # published. Its JSON and failure bytes bind that empty result;
                # the byte store must not certify unrepresented empty folders.
                checkpoint_paths = [path for path in checkpoint_paths if path.is_file() or workspace.files([path])]
                if execution is None:
                    runner.preserve(checkpoint_paths, "compact-publication:checkpoint", reuse=True, phase_boundary=True)
                else:
                    workspace.persist(checkpoint_paths, "compact-publication:checkpoint", execution=execution, phase_boundary=True)
            print(json.dumps({"compactProcessed": index + 1, "workId": wid, "published": len(records), "blocked": len(failures),
                              "metrics": work_metrics}), flush=True)
        if not records:
            raise ValueError("Compact publication has no applicable READY Work")
        view.verify_final(connection)
        backend._validate_schema(connection, "compact final candidate")
        # Correction/recovery materializers defer their repeated global scan.
        # Verify the actual complete projection once at the publication boundary.
        import importlib.util
        projection_path = publisher.LEGACY / "integration-publisher-v1/integrate.py"
        spec = importlib.util.spec_from_file_location("_compact_final_projection", projection_path)
        projection = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(projection)
        projection.validate_authority_projection(connection)
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
    verify_source_references(selected)
    verify_reviews(stage, reviews)
    value = {"schemaVersion": FORMAT, "baseline": identity["baseline"], "sources": sources, "dependencies": dependencies,
             "works": records, "failures": failures, "reviews": reviews}
    write_once(stage / "COMPACT-PUBLICATION.json", value)
    publisher._write_result_manifest(stage)
    publisher._verify_result_manifest(stage)
    os.replace(stage, output)
    publisher._verify_result_manifest(output)
    return output, [row["workId"] for row in records], failures


def publish(batch, entries, initial, summary_sha, *, checkpoint_every=10):
    from canonical_rebase import validation_cache
    import publish_factor_batch as publisher
    import validate_factor_panel as panel
    with validation_cache(), publisher.panel_validation.manifest_verification_cache(), panel.manifest_verification_cache():
        return _publish(batch, entries, initial, summary_sha, checkpoint_every=checkpoint_every)


def _verify_publication_v1(root):
    """Reconstruct expected state from original decisions, never trust an actual-row hash."""
    import publish_factor_batch as publisher
    root = root.resolve()
    publisher._verify_result_manifest(root)
    metadata = publisher._read_json(root / "COMPACT-PUBLICATION.json")
    if metadata["schemaVersion"] != LEGACY_FORMAT:
        raise ValueError("Unknown compact publication version")
    verify_reviews(root, metadata["reviews"])
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
        return {"schemaVersion": LEGACY_FORMAT, "works": expectations,
                "manifestSha256": publisher.sha256(root / "MANIFEST.sha256")}
    finally:
        canonical.close()
        connection.close()


def _verify_publication(root, *, audit=False):
    """Re-derive plans from original authority and predict rows without SQL replay.

    Legacy v1 keeps its original replay reader. Explicit v2 audits additionally
    replay the production materializer; ordinary v2 checks compare one complete
    final snapshot to the independent model built from the sealed plans.
    """
    import publish_factor_batch as publisher
    root = root.resolve()
    publisher._verify_result_manifest(root)
    metadata = publisher._read_json(root / "COMPACT-PUBLICATION.json")
    if metadata["schemaVersion"] == LEGACY_FORMAT:
        return _verify_publication_v1(root)
    if metadata["schemaVersion"] != FORMAT:
        raise ValueError("Unknown compact publication version")
    verify_reviews(root, metadata["reviews"])
    policy_documents = publication_policies(metadata["sources"])
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
        canonical_bytes = read_stored_file(metadata["sources"]["canonical"])
        canonical.deserialize(canonical_bytes)
        backend = publisher._backend_module()
        connection.execute("begin")
        publisher.preserve_book_metadata(connection, canonical, backend)
        connection.commit()
        gold = backend._load_gold_ids(publisher._repo_root() / "data/staging/catalog-expansion/gold-set-manifest.json")
        view = BatchView(connection, gold=gold)
        expectations = {}
        with publisher.panel_validation.manifest_verification_cache():
            for step in metadata["works"]:
                path, plan_path = (publisher._safe_child(root, step[key]) for key in ("receipt", "plan"))
                if publisher.sha256(path) != step["sha256"] or publisher.sha256(plan_path) != step["planSha256"]:
                    raise ValueError("Compact work receipt or sealed plan changed")
                saved, seal = publisher._read_json(path), publisher._read_json(plan_path)
                if saved["schemaVersion"] != WORK_FORMAT or saved["workId"] != step["workId"] or saved["workId"] in expectations:
                    raise ValueError("Duplicate or mismatched compact Work")
                entry = {key: saved[key] for key in ("workId", "input", "authority")}
                connection.execute("begin")
                prepared, derived, _ = prepare_work_v2(entry, connection, metadata["sources"]["canonical"]["sha256"],
                    saved["reviewedAt"], view, canonical_bytes=canonical_bytes, policy_documents=policy_documents)
                if encoded(derived) != encoded(seal) or saved["planSha256"] != object_sha(seal):
                    raise ValueError("Compact sealed plan differs from original authority")
                if audit:
                    actual = apply_work_v2(entry, connection, prepared, seal, view)
                    view.committed(connection)
                else:
                    view.catalog.apply(seal["plan"])
                    view.registry.apply(seal["registryChanges"])
                    actual = {"schemaVersion": WORK_FORMAT, **entry, "reviewedAt": seal["reviewedAt"],
                              "planSha256": object_sha(seal), "plan": seal["plan"],
                              "registryChanges": seal["registryChanges"], "canonicalRebase": seal["canonicalRebase"],
                              "beforeTargetSha256": seal["beforeTargetSha256"],
                              "expectedAfter": target_view(view.catalog.scope({entry["workId"]}), entry["workId"])}
                    connection.rollback()
                if encoded(actual) != encoded(saved):
                    raise ValueError("Compact expected-after differs from original authority and sealed plan")
                expectations[saved["workId"]] = actual["expectedAfter"]
        if view.catalog.snapshot() != backend._snapshot_db(root / CATALOG):
            raise ValueError("Compact final Catalog differs from independent sealed plans")
        import correct_factor_registry as correction
        if view.registry.snapshot() != correction.snapshot(root / REGISTRY):
            raise ValueError("Compact final registry differs from independent sealed corrections")
        view.verify_sources()
        return {"schemaVersion": FORMAT, "works": expectations,
                "manifestSha256": publisher.sha256(root / "MANIFEST.sha256")}
    finally:
        canonical.close()
        connection.close()


def verify_publication(root, *, audit=False):
    from canonical_rebase import validation_cache
    import publish_factor_batch as publisher
    import validate_factor_panel as panel
    with validation_cache(), publisher.panel_validation.manifest_verification_cache(), panel.manifest_verification_cache():
        return _verify_publication(root, audit=audit)
