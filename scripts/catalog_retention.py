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
import sys
import time
from bisect import bisect_left
import hashlib

from catalog_workspace import Workspace, digest, key_path, manifest_digest, unlinked, utc_now
from workspace_paths import absolute_identity, artifact_path, path_identity
from catalog_authoring_locks import acquire, assert_no_pending

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


def retain_completed_identities(store, state):
    """Preserve each completion's small re-reception packet exactly once."""
    import catalog_authoring.validate_factor_panel as panel
    for summary_sha, applied in state.get("publicationBatches", {}).items():
        completion = store.current_revision("completion", summary_sha)
        if completion is None:
            continue  # An interrupted current publication retains its live tree.
        subject = "completion-identity:" + summary_sha
        previous = store.current_revision("active", subject)
        if previous is not None:
            payload = store.get_revision(previous)["payload"]
            if (payload.get("completion", {}).get("revisionId") != completion["revisionId"]
                    or payload["completion"].get("payloadSha256") != completion["payloadSha256"]
                    or payload.get("applied") != applied):
                raise ValueError("Retained completion identity differs from its original completion")
            continue
        proof = store.get_revision(completion)["payload"]
        if proof.get("status") != "VERIFIED" or proof.get("applied") != applied or proof.get("summarySha256") != summary_sha:
            raise ValueError("Completion identity differs from committed STATE")
        finished = proof["finished"]
        if not finished.get("summaryPath"):
            continue  # Older non-batch records have no summary re-reception.
        expected, bodies, physical = {}, {}, set()

        def bind(path, sha=None):
            path = unlinked(artifact_path(path, store.repo))
            if path.is_file():
                body = path.read_bytes()
                physical.add(path)
            else:
                # Retention may already have retired a completed working copy.
                # Only its exact proof-bound blob or saved path is reusable.
                with closing(store.connect()) as db:
                    if sha is None:
                        row = db.execute("SELECT b.sha256 FROM revision_blob b JOIN revision r ON r.id=b.revision_id WHERE b.path=? ORDER BY r.rowid DESC LIMIT 1", (store.key(path),)).fetchone()
                        if row is None:
                            raise ValueError(f"Completed identity is unavailable: {path}")
                        sha = row[0]
                    body = store.read_blob(db, sha)
            actual = digest(body)
            if sha is not None and actual != sha:
                raise ValueError(f"Completed identity changed: {path}")
            if expected.setdefault(path, actual) != actual:
                raise ValueError("Completed identity changed during discovery")
            bodies[store.key(path)] = body
            return body

        def manifest(root, name, sha):
            entries = {}
            for line in bind(root / name, sha).decode("ascii").splitlines():
                match = panel.SHA_ROW.fullmatch(line)
                if match is None or match[2] in entries:
                    raise ValueError("Invalid completed identity manifest")
                entries[key_path(match[2])] = match[1]
            return entries

        summary = json.loads(bind(finished["summaryPath"], summary_sha))
        published = {row["workId"] for row in finished.get("works", [])}
        for row in summary.get("works", []):
            if row.get("workId") not in published or not row.get("checkedPath"):
                continue
            checked_path = unlinked(artifact_path(row["checkedPath"], store.repo))
            checked = json.loads(bind(checked_path, row["checkedSha256"]))
            if checked.get("workId") != row["workId"] or checked.get("status") != "READY_FOR_PUBLICATION":
                raise ValueError("Completed identity is not the originally checked Work")
            run = checked_path.parent
            config = json.loads(bind(run / "RUN.json"))
            frozen_name = config.get("frozenDirectory", "frozen")
            if not isinstance(frozen_name, str) or "/" in frozen_name or "\\" in frozen_name or frozen_name in {".", ".."}:
                raise ValueError("Completed frozen directory escapes its run")
            frozen = run / frozen_name / "panel-input"
            inputs = manifest(frozen, "PANEL-INPUT.sha256", checked["inputManifestSha256"])
            bind(frozen / "authoring-job.json", inputs["authoring-job.json"])
            if config["decisionsSha256"] != checked["decisionsSha256"]:
                raise ValueError("Completed decisions differ from the checked identity")
            bind(config["decisionsPath"], checked["decisionsSha256"])
            sealed = unlinked(artifact_path(checked["sealedRoot"], store.repo))
            for name, sha in manifest(sealed, "MANIFEST.sha256", checked["resultManifestSha256"]).items():
                bind(sealed / name, sha)
        retained = store.save_bytes(bodies, "recovery:completed-identity:" + summary_sha)
        members = store.get_revision(retained)["members"]
        if (members != {store.key(path): sha for path, sha in expected.items()}
                or any(digest(path.read_bytes()) != expected[path] for path in physical)):
            raise ValueError("Completed identity changed during preservation")
        store.put_revision("active", subject, {"schemaVersion": "catalog-completion-identity-v1", "summarySha256": summary_sha,
            "completion": completion, "applied": applied}, members, expected_head=None)


def _metadata_recovery_inputs(repo, prepared_path, publication):
    """Keep the existing metadata command's exact request and raw captures."""
    if publication.get("kind") != "publisher-metadata":
        return set(), {}
    observed = {}

    def bind(path, expected=None):
        path = unlinked(artifact_path(path, repo))
        body = path.read_bytes()
        sha = digest(body)
        if expected is not None and expected != sha:
            raise ValueError("Metadata recovery input binding changed")
        observed[path] = sha
        return body

    receipt = json.loads(bind(prepared_path.parent / "receipt.json"))
    if receipt.get("inputSha256") != publication["requestSha256"]:
        raise ValueError("Metadata recovery receipt differs from its prepared request")
    input_path = unlinked(artifact_path(receipt["input"], repo))
    entries = json.loads(bind(input_path, receipt["inputSha256"]))
    for entry in entries:
        receipt_path = unlinked((input_path.parent / entry["receiptFile"]).resolve())
        source_path = unlinked((input_path.parent / entry["sourceFile"]).resolve())
        if not receipt_path.is_relative_to(input_path.parent) or not source_path.is_relative_to(input_path.parent):
            raise ValueError("Metadata recovery capture escapes its input folder")
        capture = json.loads(bind(receipt_path, entry["receiptSha256"]))
        body = bind(source_path, capture["sha256"])
        if len(body) != capture["bytes"]:
            raise ValueError("Metadata recovery capture length changed")
    return set(observed), observed


def retain_live_declared_inputs(store, registrations, controls, observed):
    """Fill only missing SHA-bound files declared by current work and delivery."""
    expected, missing, contexts, run_roots = {}, {}, [], set()
    with closing(store.connect()) as db:
        db.execute("BEGIN")
        view = _RecoveryFiles(store, db)
        completed = {Path(path).parent.as_posix() for path, in db.execute("SELECT DISTINCT b.path FROM revision_blob b JOIN head h ON h.revision_id=b.revision_id WHERE h.kind='active' AND h.subject LIKE 'completion-identity:%' AND b.path LIKE '%/CHECKED.json'")}

        def load(path, sha=None):
            path = unlinked(artifact_path(path, store.repo))
            body = path.read_bytes()
            actual = digest(body)
            if sha is not None and actual != sha:
                raise ValueError("Live dependency declaration changed")
            if observed.setdefault(path, actual) != actual:
                raise ValueError("Live dependency scope changed during discovery")
            return json.loads(body)

        def declare(path, sha):
            if not isinstance(sha, str) or len(sha) != 64 or any(char not in "0123456789abcdef" for char in sha):
                raise ValueError("Live dependency has an invalid declared SHA")
            name = view.key(path)
            if expected.setdefault(name, sha) != sha:
                raise ValueError("Live work requires conflicting versions of a declared path: " + name)

        for name in registrations:
            registration = load(store.repo / name)
            if not registration.get("active") and not registration.get("suspended"):
                continue
            root = view.key(registration["runRoot"])
            dispatch = load(artifact_path(registration["dispatchPath"], store.repo), registration["dispatchSha256"]) if registration.get("dispatchPath") else {"works": [{"workId": registration.get("workId")}]}
            contexts.append((dispatch, root))
            run_roots.update(view.live_runs(root, {row.get("workId") for row in dispatch.get("works", [])}, completed))
            artifact = artifact_path(registration["artifact"], store.repo) if registration.get("artifact") else None
            if artifact is not None and artifact.is_file():
                contexts.append((load(artifact), root))
            for path in controls:
                if path.parent == store.repo / root and ("CHECKPOINT" in path.name or "PROGRESS" in path.name):
                    contexts.append((load(path), root))
        for path in controls:
            if path.name != "event.json" or not path.is_file():
                continue
            event = load(path)
            if event.get("schemaVersion") == "catalog-notification-v1":
                checkpoint = artifact_path(event["checkpointPath"], store.repo)
                contexts.append((load(checkpoint, event["checkpointSha256"]), view.key(event["assignment"]["runRoot"])))
        while contexts:
            value, root = contexts.pop()
            if isinstance(value, list):
                contexts.extend((item, root) for item in value)
                continue
            if not isinstance(value, dict):
                continue
            # These are the inputs read by dispatch/progress, freeze and resume.
            # Historical selection hints (for example priorSourcePath) do not
            # authorize replay of an earlier mutable progress document.
            for field in ("checkedPath", "researchPath", "decisionPath", "decisionsPath", "userSourcesPath", "collectionSummaryPath"):
                path = value.get(field)
                sha = value.get(field.removesuffix("Path") + "Sha256")
                if isinstance(path, str) and sha is not None:
                    declare(view.assignment_path(path, root), sha)
            for field in ("collectionSummary", "sourceCollectionSummary"):
                reference = value.get(field)
                if isinstance(reference, dict) and reference.get("path") and reference.get("sha256"):
                    declare(view.assignment_path(reference["path"], root), reference["sha256"])
            if value.get("checkedPath") and value.get("checkedSha256"):
                run = Path(view.assignment_path(value["checkedPath"], root)).parent.as_posix()
                if run not in completed:
                    run_roots.add(run)
            contexts.extend((item, root) for field, item in value.items()
                            if field != "preservedEarlierRevisions" and isinstance(item, (list, dict)))
        for run in sorted(run_roots):
            config_name = run + "/RUN.json"
            if config_name in view.latest:
                config = json.loads(store.read_blob(db, view.latest[config_name]))
            else:
                continue  # A reported failed preparation has no saved RUN authority.
            for field in ("registryPath", "recoveryEpoch", "decisionsPath"):
                if config.get(field) and config.get(field + "Sha256"):
                    declare(config[field], config[field + "Sha256"])
            if config.get("decisionsPath") and config.get("decisionsSha256"):
                declare(config["decisionsPath"], config["decisionsSha256"])
            for binding in config.get("sourceResearchBindings", []):
                declare(binding["path"], binding["sha256"])
                for field, filename in (("collectionReceiptSha256", "collection-events.jsonl"),
                                        ("handoffSha256", "COLLECTION-HANDOFF.json")):
                    if binding.get(field):
                        declare(Path(binding["path"]).with_name(filename), binding[field])
            for binding in config.get("provenanceBindings", []):
                for member, sha in binding["files"].items():
                    declare(Path(binding["root"]) / key_path(member), sha)
            for binding in config.get("priorBundleBindings", []):
                declare(artifact_path(binding["root"], store.repo) / "MANIFEST.sha256", binding["manifestSha256"])
        for name, sha in expected.items():
            if db.execute("SELECT 1 FROM revision_blob b JOIN blob v ON v.sha256=b.sha256 WHERE b.path=? AND b.sha256=? LIMIT 1", (name, sha)).fetchone():
                continue  # Actual immutable membership, never a status flag.
            path = unlinked(store.repo / name)
            if path.is_file():
                body = path.read_bytes()
                if digest(body) != sha:
                    raise ValueError("Live declared input differs from its original SHA: " + name)
                if observed.setdefault(path, sha) != sha:
                    raise ValueError("Live declared input changed during discovery")
            else:
                body = store.read_blob(db, sha)  # Only the exact declared original.
            missing[name] = body
    if missing:
        saved = store.save_bytes(missing, "recovery:live-declared-inputs")
        if store.get_revision(saved)["members"] != {name: expected[name] for name in missing}:
            raise ValueError("Live dependency preservation readback differs from its declarations")
    current = store.current_revision("active", "current-live-declared-inputs")
    if current is not None and store.get_revision(current)["members"] == expected:
        return current
    return store.put_revision("active", "current-live-declared-inputs", {"schemaVersion": "catalog-live-declared-inputs-v1"}, expected,
                              expected_head=current["revisionId"] if current else None)


def retain_recovery_controls(store):
    """Bind mutable operator controls at the same boundary as their backup.

    No filesystem hashing or JSON reads happen under the SQLite writer. These
    bytes preserve interrupts and dispatch generations; they never resume work.
    """
    # In a DB-only restore the filesystem is a cache, not the complete logical
    # control set. Explicit operation deltas update that set; absent cache files
    # never replace it with an empty physical directory inventory.
    if sparse_restore_marker(store) is not None:
        return store.current_revision("active", "current-recovery-controls")
    repo = store.repo
    if (repo / BASE / "RETENTION-MAINTENANCE.json").exists():
        return None  # Cutover backs up before its guarded STATE transition.
    with closing(store.connect()) as db:
        if db.execute("PRAGMA user_version").fetchone()[0] != 4:
            return None
        previous = db.execute("SELECT revision_id FROM head WHERE kind='active' AND subject='current-recovery-controls'").fetchone()
        expected_head = previous[0] if previous else None
    state_path = repo / CONTINUATION / "STATE.json"
    if not state_path.is_file():
        return None
    state = read(state_path)
    if not state.get("latestCandidate"):
        return None
    basis = unlinked((repo / CONTINUATION / state["latestCandidate"]["root"]).resolve())
    marker = basis / "CURATION-BASELINE.json"
    if not marker.is_file():
        return None  # An unmigrated store still uses explicit historical restore.
    retain_completed_identities(store, state)
    paths = {state_path, marker, basis / "MANIFEST.sha256"}
    canonical_path = repo / "data/source/catalog.sqlite"
    canonical_targets, canonical_version, canonical_observed = set(), None, {}
    if canonical_path.is_file():
        from catalog_authoring.catalog_completed_checks import _STATIC_ARTIFACTS
        paths.add(repo / "data/source")
        canonical_targets.update(repo / name for name in _STATIC_ARTIFACTS)
        identity_path = repo / "src/data/generated/catalog-identity-v1.json"
        if identity_path.is_file():
            body = identity_path.read_bytes()
            canonical_observed[identity_path] = digest(body)
            canonical_version = json.loads(body).get("catalogVersion")
            if (not isinstance(canonical_version, str) or not canonical_version
                    or any(char not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_." for char in canonical_version)):
                raise ValueError("Invalid current generated Catalog version")
            canonical_targets.update(repo / "public/catalog" / f"{name}.{canonical_version}.json"
                                     for name in ("catalog-v1", "recommendation-context-v1"))
        paths.update(path for path in canonical_targets if path.is_file())
    for name in ("data/staging/catalog-expansion/gold-set-manifest.json", "docs/factors/factor-dictionary.md",
                 "docs/factors/annotation-guide.md", "docs/catalog-expansion/02-authorized-evidence-panel-v1.md",
                 "docs/planning/09-catalog-authoring-authority.md"):
        if (repo / name).is_file():
            paths.add(repo / name)
    notification_paths, registrations, watched, observed = recovery_notification_paths(repo)
    observed.update(canonical_observed)
    paths.update(notification_paths)
    for root in (repo / BASE, repo / BASE / "locks"):
        watched[root] = ("*.json", tuple(sorted(str(path) for path in root.glob("*.json") if path.is_file())))
    for root in {path.parent for path in canonical_targets}:
        watched[root] = ("*.json", tuple(sorted(str(path) for path in root.glob("*.json") if path.is_file())))
    for name in ("locks/publication.pending.json", "RETENTION-MAINTENANCE.json"):
        path = repo / BASE / name
        if path.is_file():
            paths.add(path)
            if name == "locks/publication.pending.json":
                pending = read(path)
                prepared = unlinked(artifact_path(pending["preparedPath"], repo))
                if digest(prepared.read_bytes()) != pending["preparedSha256"]:
                    raise ValueError("Pending canonical recovery input changed")
                paths.add(prepared.parent)
                publication = read(prepared)
                metadata_paths, metadata_observed = _metadata_recovery_inputs(repo, prepared, publication)
                paths.update(metadata_paths)
                observed.update(metadata_observed)
                if artifact_path(publication["root"], repo).resolve() != repo:
                    raise ValueError("Pending canonical recovery belongs to another repository")
                for item in publication["artifacts"]:
                    target = unlinked(repo / key_path(path_identity(item["path"]).as_posix()))
                    if target.exists():
                        paths.add(target)  # Directory swaps recover whole targets.
    completed_pointer = repo / BASE / "locks/publication.completed.json"
    if completed_pointer.is_file():
        body = completed_pointer.read_bytes()
        pointer = json.loads(body)
        if pointer.get("schemaVersion") != "catalog-canonical-completion-pointer-v1":
            raise ValueError("Unknown current canonical completion pointer")
        observed[completed_pointer] = digest(body)
        paths.add(completed_pointer)
        for field in ("prepared", "completion"):
            path = unlinked(artifact_path(pointer[field + "Path"], repo))
            content = path.read_bytes()
            if digest(content) != pointer[field + "Sha256"]:
                raise ValueError("Current canonical completion pointer changed")
            observed[path] = pointer[field + "Sha256"]
            paths.add(path)
        prepared = unlinked(artifact_path(pointer["preparedPath"], repo))
        metadata_paths, metadata_observed = _metadata_recovery_inputs(repo, prepared, read(prepared))
        paths.update(metadata_paths)
        observed.update(metadata_observed)
    roots = sorted(paths, key=str)
    live_inputs = retain_live_declared_inputs(store, registrations, paths, observed)
    inventory = store._inventory(roots)
    if any(digest(path.read_bytes()) != sha for path, sha in observed.items()):
        raise ValueError("Recovery control changed after scope discovery")
    retained = store._save_with_inventory(roots, "recovery:current-controls", inventory=inventory)
    store._assert_inventory(roots, inventory)
    if (read(state_path) != state or any(digest(path.read_bytes()) != sha for path, sha in observed.items())
            or any(names != tuple(sorted(str(path) for path in root.glob(pattern) if path.is_file()))
                   for root, (pattern, names) in watched.items())):
        raise ValueError("Recovery control scope changed during backup preparation")
    members = store.get_revision(retained)["members"]
    canonical_members = {store.key(path): sha for path, (sha, _) in inventory.items()
                         if path.is_relative_to(repo / "data/source") or path in canonical_targets}
    from workspace_paths import restored_origins
    return store.put_revision("active", "current-recovery-controls", {
        "schemaVersion": "catalog-current-recovery-controls-v1",
        "statePath": relative(repo, state_path), "stateSha256": inventory[state_path][0],
        "basisRoot": relative(repo, basis), "basis": read(marker)["revision"],
        "registrations": sorted(registrations),
        "liveDeclaredInputs": live_inputs,
        "originalRepositories": sorted({str(repo), *(str(root) for root in restored_origins(repo))}),
        "canonicalSha256": inventory[canonical_path][0] if canonical_path in inventory else None,
        "currentCanonical": {"members": canonical_members, "staticCatalogVersion": canonical_version,
                             "staticComplete": bool(canonical_version) and canonical_targets <= set(inventory)},
    }, members, expected_head=expected_head)


class _LatestSavedPaths:
    """Indexed, lazy lookups; a restore does not enumerate the entire archive."""

    def __init__(self, db):
        self.db, self.cache = db, {}

    def get(self, name, default=None):
        if name not in self.cache:
            row = self.db.execute("SELECT b.sha256 FROM revision_blob b JOIN revision r ON r.id=b.revision_id WHERE b.path=? ORDER BY r.rowid DESC LIMIT 1", (name,)).fetchone()
            self.cache[name] = row[0] if row else None
        return self.cache[name] or default

    def __contains__(self, name):
        return self.get(name) is not None

    def __getitem__(self, name):
        value = self.get(name)
        if value is None:
            raise KeyError(name)
        return value


class _RecoveryFiles:
    """Read saved paths once; materialize only the selected current/live closure."""

    def __init__(self, store, db):
        self.store, self.db = store, db
        from catalog_revision_store import VerificationContext
        self.verification = VerificationContext(store, [])
        self.view = (store, db, {}, {})
        self.latest = _LatestSavedPaths(db)
        self.members, self.walked, self.historical_versions = {}, set(), set()
        self._key_cache = {}

    def current(self, kind, subject):
        row = self.db.execute("SELECT revision_id FROM head WHERE kind=? AND subject=?", (kind, subject)).fetchone()
        return self.store._receipt(self.db, row[0]) if row else None

    def revision(self, receipt):
        return self.verification._revision(self.view, receipt)

    def key(self, path):
        original = str(path)
        if original in self._key_cache:
            return self._key_cache[original]
        path = artifact_path(path, self.store.repo)
        if not path.is_absolute():
            path = self.store.repo / path
        # This resolves a saved database name, not a live filesystem object.
        # Inspect links only at actual source reads and destination writes.
        path = Path(os.path.abspath(path))
        if not path.is_relative_to(self.store.repo) or path == self.store.repo:
            raise ValueError("Recovery artifact must stay inside its repository")
        if (self.store.database.is_relative_to(path)
                or path == self.store.repo / BASE / "artifacts"
                or path.is_relative_to(self.store.repo / BASE / "backups")):
            raise ValueError("Recovery artifact cannot capture its database or archive")
        name = key_path(path.relative_to(self.store.repo).as_posix())
        if any(part in {".git", "node_modules"} or part.startswith(".env") for part in Path(name).parts):
            raise ValueError("Not a recovery artifact: " + name)
        for alias in (original, path, Path(name)):
            self._key_cache[str(alias)] = name
        return name

    def assignment_path(self, value, root):
        """Keep serialized repository paths distinct from assignment paths."""
        identity = path_identity(value)
        path = artifact_path(value, self.store.repo)
        repository_roots = {"data", ".workspace", ".tmp", "handoff", "research", "R", "reviews", "konocomics-production-audit-agent-ready"}
        if not identity.is_absolute() and path.parts and path.parts[0] not in repository_roots:
            path = artifact_path(root, self.store.repo) / path
        return self.key(path)

    def progress(self, value, root, completed_runs):
        """Read both current and pending-event paths in their assignment context."""
        pending = [value]
        while pending:
            value = pending.pop()
            if isinstance(value, list):
                pending.extend(value)
                continue
            if not isinstance(value, dict):
                continue
            if value.get("checkedPath") and value.get("checkedSha256"):
                path = self.assignment_path(value["checkedPath"], root)
                checked = json.loads(self.file(path, value.get("checkedSha256")))
                run = Path(path).parent.as_posix()
                if run not in completed_runs:
                    self.root(run)
                    if checked.get("sealedRoot"):
                        self.root(checked["sealedRoot"], checked.get("resultManifestSha256"), follow=False)
            if value.get("collectionPath"):
                self.root(self.assignment_path(value["collectionPath"], root), follow=False)
            for field in ("researchPath", "decisionPath", "decisionsPath", "collectionSummaryPath"):
                sha = value.get(field.removesuffix("Path") + "Sha256")
                if value.get(field) and sha:
                    self.file(self.assignment_path(value[field], root), sha)
            for field in ("collectionSummary", "sourceCollectionSummary"):
                reference = value.get(field)
                if isinstance(reference, dict) and reference.get("path") and reference.get("sha256"):
                    self.file(self.assignment_path(reference["path"], root), reference["sha256"])
            for attempted in value.get("captureAttemptPaths", []):
                self.root(self.assignment_path(attempted, root), follow=False)
            # This container records superseded captures, not current work.
            # Its raw JSON and original blobs remain preserved independently.
            pending.extend(item for field, item in value.items()
                           if field != "preservedEarlierRevisions" and isinstance(item, (list, dict)))

    def live_runs(self, root, assigned_ids, completed_runs):
        """Share the current READY/HOLD/preparation selection with backup."""
        selected, preparing = {}, {}
        prefix = self.key(root) + "/"
        paths = [name for name, in self.db.execute("SELECT DISTINCT path FROM revision_blob WHERE path>=? AND path<? AND (path LIKE '%/RUN.json' OR path LIKE '%/CHECKED.json') ORDER BY path", (prefix, prefix + "\uffff"))]
        checked_runs = {Path(path).parent.as_posix() for path in paths if Path(path).name == "CHECKED.json"}
        for run in sorted(checked_runs):
            checked = json.loads(self.store.read_blob(self.db, self.latest[run + "/CHECKED.json"]))
            if (checked.get("status") not in {"READY_FOR_PUBLICATION", "HOLD"}
                    or checked.get("workId") not in assigned_ids):
                continue
            config_path = run + "/RUN.json"
            if config_path not in self.latest:
                raise ValueError("A live checked result has no preserved RUN binding")
            config = json.loads(self.store.read_blob(self.db, self.latest[config_path]))
            key, entry = checked["workId"], (config.get("createdAt", ""), run)
            if key not in selected or entry > selected[key]:
                selected[key] = entry
        for path in paths:
            if Path(path).name != "RUN.json":
                continue
            run = Path(path).parent.as_posix()
            if run in completed_runs or run in checked_runs:
                continue
            job_path = run + "/job.json"
            if job_path not in self.latest:
                continue
            job = json.loads(self.store.read_blob(self.db, self.latest[job_path]))
            works = job.get("works", [])
            if len(works) != 1 or works[0].get("workId") not in assigned_ids:
                continue
            config = json.loads(self.store.read_blob(self.db, self.latest[path]))
            wid, entry = works[0]["workId"], (config.get("createdAt", ""), run)
            if wid not in preparing or entry > preparing[wid]:
                preparing[wid] = entry
        # A completed latest decision supersedes its older unfinished copies.
        # Explicit pending checkpoints are expanded separately by progress().
        return ({entry[1] for entry in selected.values() if entry[1] not in completed_runs}
                | {entry[1] for wid, entry in preparing.items() if wid not in selected or entry > selected[wid]})

    def file(self, path, sha=None, *, historical=False):
        name = self.key(path)
        sha = sha or self.latest.get(name)
        if sha is None or self.db.execute("SELECT 1 FROM revision_blob WHERE path=? AND sha256=? LIMIT 1", (name, sha)).fetchone() is None:
            raise ValueError(f"Current recovery requires an unpreserved file: {name}")
        body = self.store.read_blob(self.db, sha)
        previous = self.members.setdefault(name, sha)
        if previous != sha:
            if historical:
                # Compact readers address their original versions by receipt
                # and SHA in the copied DB, not through the current pathname.
                self.historical_versions.add((name, sha))
                return body
            raise ValueError(f"Current recovery has conflicting live versions: {name}")
        return body

    def target(self, name, sha):
        """Materialize a prepared artifact at its proven canonical target."""
        name = key_path(name)
        self.store.read_blob(self.db, sha)
        if self.members.setdefault(name, sha) != sha:
            raise ValueError(f"Current recovery has conflicting target effects: {name}")

    def children(self, path):
        prefix = self.key(path) + "/"
        for name, in self.db.execute("SELECT DISTINCT path FROM revision_blob WHERE path>=? AND path<? ORDER BY path", (prefix, prefix + "\uffff")):
            if name.startswith(prefix):
                yield name

    def root(self, path, expected=None, *, follow=True, prior=False):
        name = self.key(path)
        if (name, expected, follow, prior) in self.walked:
            return
        self.walked.add((name, expected, follow, prior))
        if name in self.latest:
            self.file(name, expected)
            if Path(name).name in {"recovery-epoch.json", "recovery-declaration.json"}:
                self.dependencies(name)
            return
        manifest_name = next((value for value in ("MANIFEST.sha256", "PANEL-INPUT.sha256", "PANEL-RESULT.sha256")
                              if name + "/" + value in self.latest), None)
        if manifest_name is not None:
            import catalog_authoring.validate_factor_panel as panel
            body = self.file(name + "/" + manifest_name, expected)
            names = []
            for line in body.decode("ascii").splitlines():
                match = panel.SHA_ROW.fullmatch(line)
                if match is None:
                    raise ValueError("Invalid current recovery manifest")
                child = name + "/" + key_path(match[2])
                self.file(child, match[1])
                names.append(child)
        else:
            names = list(self.children(name))
            if not names:
                raise ValueError(f"Current recovery scope is unavailable: {name}")
            for child in names:
                self.file(child)
        if follow:
            for child in names:
                sidecars = {"external-prior-authority.json", "prior-authority.json", "COMPACT-PUBLICATION.json", "CHECKPOINT.json", "recovery-epoch.json", "recovery-declaration.json"}
                if not prior:
                    sidecars |= {"RUN.json", "external-lineage.json"}
                if Path(child).name in sidecars:
                    self.dependencies(child)

    def dependencies(self, path):
        name = self.key(path)
        if ("dependencies", name) in self.walked:
            return
        self.walked.add(("dependencies", name))
        value = json.loads(self.file(name))
        filename = Path(name).name
        if filename == "RUN.json":
            for field in ("baselineRoot", "registryPath", "recoveryEpoch"):
                if value.get(field):
                    self.root(value[field], value.get(field + "Sha256"), prior=field == "baselineRoot")
                    if field == "recoveryEpoch":
                        self.dependencies(value[field])
            if value.get("decisionsPath"):
                decision_sha = value.get("decisionsSha256")
                checked_path = Path(name).parent / "CHECKED.json"
                if decision_sha is None and self.key(checked_path) in self.latest:
                    decision_sha = json.loads(self.file(checked_path)).get("decisionsSha256")
                self.file(value["decisionsPath"], decision_sha)
            for binding in value.get("sourceResearchBindings", []):
                self.file(binding["path"], binding["sha256"])
                for field, filename in (("collectionReceiptSha256", "collection-events.jsonl"),
                                        ("handoffSha256", "COLLECTION-HANDOFF.json")):
                    if binding.get(field):
                        self.file(Path(binding["path"]).with_name(filename), binding[field])
            for binding in value.get("provenanceBindings", []):
                for member, sha in binding["files"].items():
                    self.file(Path(binding["root"]) / key_path(member), sha)
            for binding in value.get("priorBundleBindings", []):
                self.root(binding["root"], binding["manifestSha256"], prior=True)
        elif filename == "external-lineage.json":
            if value.get("baselineRoot"):
                self.root(value["baselineRoot"], value.get("baselineManifestSha256"), prior=True)
            if value.get("registryPath"):
                input_root = Path(name).parent
                manifest_name = (input_root / "PANEL-INPUT.sha256").as_posix()
                manifest_sha = self.members.get(manifest_name)
                if manifest_sha is None:
                    raise ValueError("Frozen registry requires its bound input manifest")
                input_members = source_manifest(self.store, self.db, manifest_sha, retained=set(), selected=())
                if input_members.get("external-lineage.json") != self.members.get(name) or "panel-input.json" not in input_members:
                    raise ValueError("Frozen registry metadata is outside its input manifest")
                metadata = json.loads(self.file(input_root / "panel-input.json", input_members["panel-input.json"]))
                registry_sha = metadata.get("registrySha256")
                if (not isinstance(registry_sha, str) or len(registry_sha) != 64
                        or any(char not in "0123456789abcdef" for char in registry_sha)):
                    raise ValueError("Frozen registry has no exact SHA binding")
                source_sha = value.get("sourceInputBindings", {}).get(value["registryPath"])
                if source_sha is not None and source_sha != registry_sha:
                    raise ValueError("Frozen registry binding differs from its input metadata")
                self.file(value["registryPath"], registry_sha)
            for source, sha in value.get("sourceInputBindings", {}).items():
                self.file(source, sha)
        elif filename in {"external-prior-authority.json", "prior-authority.json"}:
            for binding in value.get("bundles", []):
                root = artifact_path(binding["root"], self.store.repo)
                self.root(root if root.is_absolute() else Path(name).parent / root, binding["manifestSha256"], prior=True)
        elif value.get("schemaVersion") in {"factor-loss-recovery-v1", "factor-loss-recovery-epoch-v1"}:
            for field in ("epochPath", "scopePath", "policyPath"):
                if value.get(field):
                    self.root(value[field], value.get(field.removesuffix("Path") + "Sha256"))
            if value.get("epochId") == "factor-003-recovery-20260909-v1":
                history = self.store.repo / CONTINUATION / "runs"
                self.root(history / "continuation-factor-233-publication-20260909-v1", follow=False)
                self.file(history / "canonical-promotion-20260910-v2/before/data/source/catalog.sqlite")
        elif value.get("schemaVersion") in {"catalog-compact-publication-v1", "catalog-compact-publication-v2"}:
            nested = []
            for reference in value["dependencies"]:
                saved = self.verification._revision(self.view, reference["snapshot"])["members"]
                for member, sha in reference["members"].items():
                    if saved.get(member) != sha:
                        raise ValueError("Live checkpoint dependency differs from its receipt")
                    self.file(member, sha, historical=True)
                    if Path(member).name in {"COMPACT-PUBLICATION.json", "CHECKPOINT.json"}:
                        nested.append(member)
            for source in value["sources"].values():
                saved = self.verification._revision(self.view, source["snapshot"])["members"]
                if saved.get(source["path"]) != source["sha256"]:
                    raise ValueError("Live compact source differs from its receipt")
                self.file(source["path"], source["sha256"], historical=True)
            for member in nested:
                self.dependencies(member)


def _current_canonical_members(files, value, applied, finished):
    """Use the existing canonical effect's prepared-tree digest contract."""
    from catalog_authoring.catalog_completed_checks import _STATIC_ARTIFACTS, _tree_digest
    payload = value["payload"]
    output = files.key(payload["outputRoot"])
    prefix = output + "/candidate/"
    members = {name[len(prefix):]: sha for name, sha in value["members"].items() if name.startswith(prefix)}
    if payload.get("status") != "APPLIED" or payload.get("candidateReceiptSha256") != applied["receiptSha256"]:
        raise ValueError("Canonical recovery effect differs from its candidate completion")

    def bound_json(path, sha):
        if value["members"].get(path) != sha:
            raise ValueError("Canonical recovery proof is outside its original revision")
        return json.loads(files.store.read_blob(files.db, sha))

    completed = bound_json(output + "/completion.json", payload["completionSha256"])
    prepared = bound_json(output + "/prepared.json", completed["preparedSha256"])
    if (completed.get("schemaVersion") != "catalog-canonical-completion-v1" or completed.get("status") != "APPLIED"
            or completed.get("readback") != "PASS" or prepared.get("schemaVersion") != "catalog-canonical-publication-v1"
            or artifact_path(prepared["root"], files.store.repo).resolve() != files.store.repo
            or files.key(prepared["output"]) != output
            or any(completed.get(key) != prepared.get(key) for key in ("artifacts", "workIds", "catalogVersion", "sourceManifestDigest"))
            or set(prepared["workIds"]) != {row["workId"] for row in finished["works"]}):
        raise ValueError("Canonical recovery prepared/completion binding changed")
    artifacts = {key_path(path_identity(item["path"]).as_posix()): item["sha256"] for item in prepared["artifacts"]}
    version = prepared["catalogVersion"]
    expected = _STATIC_ARTIFACTS | {"data/source", f"public/catalog/catalog-v1.{version}.json", f"public/catalog/recommendation-context-v1.{version}.json"}
    source = {name[len("data/source/"):]: sha for name, sha in members.items() if name.startswith("data/source/")}
    generated = {name: sha for name, sha in members.items() if not name.startswith("data/source/")}
    if (len(artifacts) != len(prepared["artifacts"]) or set(artifacts) != expected or not source
            or _tree_digest(source) != artifacts["data/source"]
            or generated != {name: sha for name, sha in artifacts.items() if name != "data/source"}):
        raise ValueError("Canonical recovery members differ from the prepared artifact tree")
    return members


def _restore_completed_canonical_pointer(files, control):
    """Verify a current metadata/adjudication effect without archive searching."""
    from catalog_authoring.catalog_completed_checks import _STATIC_ARTIFACTS, _tree_digest
    name = BASE + "/locks/publication.completed.json"
    if name not in control["members"]:
        return None
    pointer = json.loads(files.file(name, control["members"][name]))
    if pointer.get("schemaVersion") != "catalog-canonical-completion-pointer-v1":
        raise ValueError("Unknown restored canonical completion pointer")
    prepared = json.loads(files.file(pointer["preparedPath"], pointer["preparedSha256"]))
    completed = json.loads(files.file(pointer["completionPath"], pointer["completionSha256"]))
    output = Path(files.key(pointer["preparedPath"])).parent.as_posix()
    if (prepared.get("schemaVersion") != "catalog-canonical-publication-v1"
            or prepared.get("kind") not in {"adjudication", "publisher-metadata"}
            or files.key(prepared["output"]) != output
            or artifact_path(prepared["root"], files.store.repo).resolve() != files.store.repo
            or files.key(pointer["completionPath"]) != output + "/completion.json"
            or completed.get("schemaVersion") != "catalog-canonical-completion-v1"
            or completed.get("status") != "APPLIED" or completed.get("readback") != "PASS"
            or completed.get("preparedSha256") != pointer["preparedSha256"]
            or any(completed.get(key) != prepared.get(key) for key in ("artifacts", "workIds", "catalogVersion", "sourceManifestDigest"))):
        raise ValueError("Restored canonical completion pointer binding changed")
    members = control["payload"].get("currentCanonical", {}).get("members", {})
    source = {name[len("data/source/"):]: sha for name, sha in members.items() if name.startswith("data/source/")}
    generated = {name: sha for name, sha in members.items() if not name.startswith("data/source/")}
    artifacts = {key_path(path_identity(item["path"]).as_posix()): item["sha256"] for item in prepared["artifacts"]}
    version = prepared["catalogVersion"]
    expected = _STATIC_ARTIFACTS | {"data/source", f"public/catalog/catalog-v1.{version}.json", f"public/catalog/recommendation-context-v1.{version}.json"}
    if (len(artifacts) != len(prepared["artifacts"]) or set(artifacts) != expected or not source
            or _tree_digest(source) != artifacts["data/source"]
            or generated != {name: sha for name, sha in artifacts.items() if name != "data/source"}):
        return None  # Preserve actual newer/incomplete bytes, not a false effect.
    # Existing historical verification reads this one completed candidate tree.
    # Its bytes are already preserved under the current target keys, once.
    for name, sha in members.items():
        files.target(output + "/candidate/" + name, sha)
    return {"kind": prepared["kind"], "completionSha256": pointer["completionSha256"], "catalogVersion": version}


def sparse_restore_marker(store):
    """Identify a DB-only cache without treating absent files as deleted state."""
    path = store.repo / ".catalog-restore.json"
    if not path.is_file():
        return None
    value = read(unlinked(path))
    if value.get("materialization") != "on-demand":
        return None
    with closing(store.connect()) as db:
        generation = db.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
    if (value.get("schemaVersion") != "catalog-restored-workspace-v1"
            or value.get("generation") != generation):
        raise ValueError("Sparse restore mapping differs from its database generation")
    return value


def sparse_control_base(store):
    """Capture the logical baseline before preparing an explicit file save."""
    if sparse_restore_marker(store) is None:
        return None
    receipt = store.current_revision("active", "current-recovery-controls")
    if receipt is None:
        return {"receipt": None, "members": {}, "payload": {
            "schemaVersion": "catalog-current-recovery-controls-v1", "statePath": None, "stateSha256": None,
            "basisRoot": None, "basis": None, "registrations": [],
            "originalRepositories": sparse_restore_marker(store)["originalRepositories"],
            "canonicalSha256": None, "currentCanonical": {"members": {}, "staticCatalogVersion": None, "staticComplete": False}}}
    return {"receipt": receipt, **store.get_revision(receipt)}


def prepare_control_delta(store, base, updates, read_body, *, deleted=()):
    """Merge explicit current writes; unmaterialized paths are never deletions."""
    if base is None:
        return None
    deleted = dict(deleted) if isinstance(deleted, dict) else {name: base["members"].get(name) for name in deleted}
    current = sparse_control_base(store)
    if current is not None and current["receipt"] != base["receipt"]:
        # Another completed write can be unrelated, or can already contain this
        # same operation's exact bytes. Neither permits replacing a newer value.
        for name, sha in updates.items():
            before, now = base["members"].get(name), current["members"].get(name)
            if now not in (before, sha) and (name in base["members"] or name in current["members"]):
                raise ValueError("Current control changed after operation preparation: " + name)
        for name, before in deleted.items():
            now = current["members"].get(name)
            if (now is not None and now != before
                    or current["payload"].get("deletedPaths", {}).get(name, before) != before):
                raise ValueError("Current control deletion conflicts with a newer value: " + name)
        base = current
    from catalog_authoring.catalog_completed_checks import _STATIC_ARTIFACTS
    info = json.loads(json.dumps(base["payload"]))
    members = dict(base["members"])
    tombstones = dict(info.get("deletedPaths", {}))
    notifications = BASE + "/notifications/"
    state_path = info.get("statePath") or CONTINUATION + "/STATE.json"

    def current_path(name):
        return (name in members or name in tombstones or name == state_path or name.startswith(notifications)
                or name.startswith("data/source/") or name in _STATIC_ARTIFACTS
                or name.startswith("public/catalog/")
                or name in {BASE + "/locks/publication.pending.json", BASE + "/locks/publication.completed.json"})

    changed = {name: sha for name, sha in updates.items() if current_path(name) and members.get(name) != sha}
    removed = {key_path(name) for name, sha in deleted.items()
               if sha is not None and (name in members or tombstones.get(name) != sha)}
    if not changed and not removed:
        return None
    if state_path in removed:
        raise ValueError("A current STATE cannot be retired by an artifact-cache deletion")
    for name in removed:
        tombstones[name] = deleted[name]
        members.pop(name, None)
    members.update(changed)
    for name in changed:
        tombstones.pop(name, None)
    if state_path in changed:
        state = json.loads(read_body(changed[state_path]))
        if state.get("authoringStore", {}).get("generation") != store._generation:
            raise ValueError("Explicit STATE change belongs to another generation")
        info.update(statePath=state_path, stateSha256=changed[state_path])
        candidate = state.get("latestCandidate")
        if candidate is not None:
            with closing(store.connect()) as db:
                files = _RecoveryFiles(store, db)
                basis = files.key(store.repo / CONTINUATION / candidate["root"])
                marker_name = basis + "/CURATION-BASELINE.json"
                marker = json.loads(files.file(marker_name))
                files.file(basis + "/MANIFEST.sha256", candidate["manifestSha256"])
                info.update(basisRoot=basis, basis=marker["revision"])
                members.update(files.members)
    registrations = set(info.get("registrations", [])) - removed
    for name, sha in changed.items():
        if name.startswith(notifications) and "/" not in name[len(notifications):]:
            value = json.loads(read_body(sha))
            if value.get("sessionId") == Path(name).stem:
                registrations.add(name)
    info["registrations"] = sorted(registrations)
    canonical = info.get("currentCanonical")
    if canonical is not None:
        current = canonical["members"]
        for name in removed:
            current.pop(name, None)
        for name, sha in changed.items():
            if name.startswith("data/source/") or name in _STATIC_ARTIFACTS or name.startswith("public/catalog/"):
                current[name] = sha
        source_changed = any(name.startswith("data/source/") for name in changed.keys() | removed)
        if "data/source/catalog.sqlite" in changed:
            info["canonicalSha256"] = changed["data/source/catalog.sqlite"]
        elif "data/source/catalog.sqlite" in removed:
            info["canonicalSha256"] = None
        identity = "src/data/generated/catalog-identity-v1.json"
        if identity in changed:
            canonical["staticCatalogVersion"] = json.loads(read_body(changed[identity]))["catalogVersion"]
        version = canonical.get("staticCatalogVersion")
        static = {*_STATIC_ARTIFACTS, *(f"public/catalog/{name}.{version}.json" for name in ("catalog-v1", "recommendation-context-v1"))}
        if source_changed or any(name in static for name in changed.keys() | removed):
            canonical["staticComplete"] = bool(version) and static <= changed.keys()
    if tombstones:
        info["deletedPaths"] = tombstones
    else:
        info.pop("deletedPaths", None)
    return {"payload": info, "members": members, "expectedHead": base["receipt"]["revisionId"] if base["receipt"] else None}


def prepare_restored_operation(repo, request):
    """Explicit existing-command boundary; path/read helpers remain read-only."""
    from catalog_recovery import prepare_restored_operation as prepare
    return prepare(Path(repo), request)


def record_restored_operation(repo, preparation, written_paths, deleted_paths=()):
    """Persist only writes/deletions reported by the actual requested operation."""
    from catalog_revision_store import RevisionWorkspace
    repo = unlinked(Path(repo))
    if not preparation or preparation.get("status") != "MATERIALIZED":
        return {"status": "NOT_REQUIRED"}
    store = RevisionWorkspace(repo, repo / BASE / "workspace.sqlite")
    marker = sparse_restore_marker(store)
    if marker is None or marker["generation"] != preparation.get("generation"):
        raise ValueError("Operation recording belongs to another restored generation")
    receipt = preparation.get("controlBase")
    base = {"receipt": receipt, **store.get_revision(receipt)} if receipt else sparse_control_base(store)
    roots = sorted({unlinked(artifact_path(path, repo)) for path in written_paths}, key=str)
    removed = {}
    with closing(store.connect()) as db:
        db.execute("BEGIN")
        files = _RecoveryFiles(store, db)
        for raw in deleted_paths:
            path = unlinked(artifact_path(raw, repo))
            name = store.key(path)
            if path.exists():
                raise ValueError("Reported control deletion still exists: " + name)
            # The producer reports an actual successful unlink/rename. Select
            # only that exact old file or bounded source directory from the DB.
            names = [name] if name in files.latest else list(files.children(name))
            for member in names:
                removed[member] = base["members"].get(member) or files.latest[member]
    saved = None
    if roots:
        saved = store.save(roots, "recovery:explicit-operation-writes", control_base=base, control_deleted=removed)
    elif removed:
        update = prepare_control_delta(store, base, {}, lambda sha: None, deleted=removed)
        if update is not None:
            saved = store.put_revision("active", "current-recovery-controls", update["payload"], update["members"],
                                       expected_head=update["expectedHead"])
    return {"status": "PERSISTED", "controlPersistence": "PERSISTED", "snapshot": saved,
            "controls": store.current_revision("active", "current-recovery-controls")}


def restore_current(store, destination, *, into_checkout=False):
    """Restore the database; existing operations extract their own artifacts."""
    from catalog_revision_store import RevisionWorkspace, VERSION
    from catalog_workspace import APPLICATION_ID
    from workspace_paths import restored_origins
    started = time.perf_counter()
    destination = unlinked(Path(destination))
    if into_checkout:
        import subprocess
        if not destination.is_dir() or not (destination / ".git").exists():
            raise ValueError("--into-checkout requires the exact existing Git checkout root")
        checkout = subprocess.run(["git", "-C", str(destination), "rev-parse", "--show-toplevel"],
                                  capture_output=True, text=True, encoding="utf-8")
        if checkout.returncode or unlinked(Path(checkout.stdout.strip())) != destination:
            raise ValueError("--into-checkout requires the exact existing Git checkout root")
        marker = unlinked(destination / ".catalog-restore.json")
        authoring = unlinked(destination / BASE)
        if marker.exists() or (authoring.exists() and (not authoring.is_dir() or any(
                path.name != "runtime" or not unlinked(path).is_dir() for path in authoring.iterdir()))):
            raise ValueError("Checkout already contains authoring data or recovery metadata; nothing was overwritten")
        if destination.is_relative_to(store.repo / "data/source"):
            raise ValueError("Database recovery requires a non-canonical destination")
    elif (destination.exists() or destination == store.repo or store.repo.is_relative_to(destination)
          or destination.is_relative_to(store.repo / "data/source")):
        raise ValueError("Database recovery requires a new non-canonical destination")
    database = destination / BASE / "workspace.sqlite"
    origins = {str(store.repo), *(str(root) for root in restored_origins(store.repo))}
    with closing(store.connect()) as source:
        source.execute("BEGIN")
        version = source.execute("PRAGMA user_version").fetchone()[0]
        if version != VERSION or source.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID:
            raise ValueError("Database recovery requires an authoring schema v4 store")
        generation = source.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
        revision_ids = [row[0] for row in source.execute("SELECT id FROM revision ORDER BY id")]
        sequence = source.execute("SELECT coalesce(max(seq),0) FROM change_log").fetchone()[0]
        # Only the current mapping metadata is needed. Do not walk its members,
        # basis, assignments or historical publication dependencies.
        control = source.execute("SELECT r.payload_sha256 FROM head h JOIN revision r ON r.id=h.revision_id WHERE h.kind='active' AND h.subject='current-recovery-controls'").fetchone()
        if control is not None:
            info = json.loads(store.read_blob(source, control[0]))["payload"]
            for original in info.get("originalRepositories", []):
                if not isinstance(original, str):
                    raise ValueError("Invalid saved recovery repository identity")
                absolute_identity(original)
                origins.add(original)
        database.parent.mkdir(parents=True, exist_ok=into_checkout)
        with database.open("xb"):
            pass
        with closing(sqlite3.connect(database)) as target:
            source.backup(target)
            if (target.execute("PRAGMA user_version").fetchone()[0] != version
                    or target.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID
                    or target.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0] != generation
                    or [row[0] for row in target.execute("SELECT id FROM revision ORDER BY id")] != revision_ids
                    or target.execute("SELECT coalesce(max(seq),0) FROM change_log").fetchone()[0] != sequence):
                raise ValueError("Recovered database identity differs from its source snapshot")
            if target.execute("PRAGMA integrity_check").fetchall() != [("ok",)]:
                raise ValueError("Recovered database failed SQLite integrity readback")
            if target.execute("PRAGMA foreign_key_check").fetchall():
                raise ValueError("Recovered database failed foreign-key readback")
            journal_mode = target.execute("PRAGMA journal_mode").fetchone()[0]
    mapping = {"schemaVersion": "catalog-restored-workspace-v1", "originalRepositories": sorted(origins),
               "materialization": "on-demand", "generation": generation}
    write(destination / ".catalog-restore.json", mapping)
    report = {"status": "DATABASE_RESTORED", "schemaVersion": version, "generation": generation,
        "revisionCount": len(revision_ids), "revisionIdsSha256": digest(json.dumps(revision_ids, separators=(",", ":")).encode()),
        "committedSequence": sequence, "integrityCheck": "PASS", "foreignKeyCheck": "PASS",
        "artifactFiles": 0, "workersResumed": False, "historicalSnapshotReplay": False,
        "verificationScope": "SQLite integrity, foreign keys and committed database identity; not a full blob or semantic audit",
        "runtime": {"python": sys.version.split()[0], "sqlite": sqlite3.sqlite_version, "executable": sys.executable},
        "codeSha256": digest(Path(__file__).read_bytes()), "workspaceJournalMode": journal_mode,
        "databaseBytes": database.stat().st_size, "destination": str(destination),
        "timingsSeconds": {"totalElapsed": time.perf_counter() - started}}
    write(destination / BASE / "CURRENT-RESTORE.json", report)
    return report


def recovery_notification_paths(repo):
    """Select current controls and pending delivery dependencies, not their history."""
    from catalog_authoring import notification_guard as guard
    notifications = repo / BASE / "notifications"
    paths, registrations, observed = set(), [], {}
    watched = {}
    selected_events, candidate_events = set(), set()

    def watch(root, pattern):
        scope = (pattern, tuple(sorted(str(path) for path in root.glob(pattern) if path.is_file())))
        if watched.setdefault(root, scope) != scope:
            raise ValueError("Recovery notification scope changed during discovery: " + str(root))

    for root, pattern in ((notifications, "*.json"), (notifications / "turns", "*.json"),
                          (notifications / "roots", "*/*.json"), (notifications / "inbox", "*/*.json")):
        watch(root, pattern)

    def actual(path):
        return unlinked(artifact_path(path, repo))

    def load(path, *, retain=False, expected=None):
        path = actual(path)
        body = path.read_bytes()
        sha = digest(body)
        if expected is not None and sha != expected:
            raise ValueError("Recovery notification binding changed: " + str(path))
        if observed.setdefault(path, sha) != sha:
            raise ValueError("Recovery notification changed during discovery: " + str(path))
        if retain:
            paths.add(path)
        return json.loads(body)

    def event_path(assignment, sha, kind="complete"):
        identity = guard.notification_identity(assignment, sha, kind)
        return actual(Path(assignment["runRoot"]) / "notification-events" / guard.digest(identity) / "event.json")

    for path in notifications.glob("*.json"):
        value = load(path)
        if value.get("sessionId") != path.stem:
            continue
        paths.add(path)
        registrations.append(relative(repo, path))
        turn = notifications / "turns" / path.name
        if turn.is_file():
            load(turn, retain=True)
        if value.get("dispatchPath"):
            load(value["dispatchPath"], retain=True, expected=value["dispatchSha256"])
        if value.get("runRoot"):
            root = actual(value["runRoot"])
            watch(root, "*.json")
            watch(root / "notification-events", "*/*.json")
            candidate_events.update((root / "notification-events").glob("*/event.json"))
            for checkpoint in root.glob("*.json"):
                if "CHECKPOINT" in checkpoint.name or "PROGRESS" in checkpoint.name:
                    load(checkpoint, retain=True)
        if value.get("artifact") and actual(value["artifact"]).is_file():
            artifact = actual(value["artifact"])
            load(artifact, retain=True)
            current_event = event_path(value, observed[artifact])
            if current_event.is_file():
                selected_events.add(current_event)
        identity = guard.notification_identity(value, "", "complete")
        record = {"assignment": identity["assignment"], "generation": identity["generation"]}
        root_index = notifications / "roots" / value["parentThreadId"] / (guard.digest(record) + ".json")
        if root_index.is_file():
            if load(root_index, retain=True) != record:
                raise ValueError("Recovery current notification root changed")
        if value.get("transitionReceipt"):
            reference = value["transitionReceipt"]
            transition = load(reference["path"], retain=True, expected=reference["sha256"])
            source = transition.get("collectionSummary")
            if source is not None:
                load(source["path"], retain=True, expected=source["sha256"])
            selected_events.add(actual(transition["collectionEventPath"]))

    # Root registrations recover an event whose inbox index was not committed.
    for path in (notifications / "roots").glob("*/*.json"):
        record = load(path)
        if guard.digest(record) != path.stem or record["assignment"]["parentThreadId"] != path.parent.name:
            raise ValueError("Recovery notification root identity changed")
        root = actual(record["assignment"]["runRoot"]) / "notification-events"
        watch(root, "*/*.json")
        candidate_events.update(root.glob("*/event.json"))
    for path in (notifications / "inbox").glob("*/*.json"):
        reference = load(path)
        source = actual(reference["path"])
        event = load(source, expected=reference["sha256"])
        if event["eventId"] != path.stem or event["assignment"]["parentThreadId"] != path.parent.name:
            raise ValueError("Recovery inbox identity changed")
        candidate_events.add(source)

    for path in sorted(candidate_events | selected_events, key=str):
        watch(path.parent, "*.json")
        value = load(path)
        identity = {key: value[key] for key in ("schemaVersion", "assignment", "generation", "kind", "checkpointSha256")}
        if (value["schemaVersion"] != guard.EVENT or guard.digest(identity) != value["eventId"]
                or path.parent.name != value["eventId"]):
            raise ValueError("Recovery notification event identity changed")
        consumed, handling = path.parent / "consumed.json", path.parent / "handling.json"
        if consumed.is_file():
            ack = load(consumed)
            load(handling)
            if ack != {"eventId": value["eventId"], "handlingSha256": observed[handling]}:
                raise ValueError("Recovery notification consumed acknowledgement changed")
            if path not in selected_events:
                continue
            paths.update((consumed, handling))
        paths.add(path)
        checkpoint = actual(value["checkpointPath"])
        if not checkpoint.is_relative_to(path.parent):
            raise ValueError("Recovery notification checkpoint outside its event")
        load(checkpoint, retain=True, expected=value["checkpointSha256"])
        if value.get("validationSha256"):
            validation = load(path.parent / "validation.json", retain=True, expected=value["validationSha256"])
            if (validation.get("eventId") != value["eventId"]
                    or validation.get("checkpointSha256") != value["checkpointSha256"]
                    or validation.get("dispatchSha256") != value["assignment"].get("dispatchSha256")):
                raise ValueError("Recovery notification validation identity changed")
        if value["assignment"].get("dispatchPath"):
            load(value["assignment"]["dispatchPath"], retain=True, expected=value["assignment"]["dispatchSha256"])
        for name in ("transport.json", "handling.json"):
            item = path.parent / name
            if not item.is_file():
                continue
            content = load(item, retain=True)
            if content.get("eventId") != value["eventId"]:
                raise ValueError("Recovery notification effect identity changed")
            if name == "transport.json":
                if content.get("checkpointSha256") != value["checkpointSha256"]:
                    raise ValueError("Recovery notification transport checkpoint changed")
                guard.validate_queue_response(content.get("queueResponse"), value["assignment"]["parentThreadId"])
        record = {"assignment": value["assignment"], "generation": value["generation"]}
        root_index = notifications / "roots" / value["assignment"]["parentThreadId"] / (guard.digest(record) + ".json")
        if root_index.is_file():
            if load(root_index, retain=True) != record:
                raise ValueError("Recovery pending notification root changed")
        index = notifications / "inbox" / value["assignment"]["parentThreadId"] / (value["eventId"] + ".json")
        if index.is_file():
            reference = load(index, retain=True)
            if actual(reference["path"]) != path or reference["sha256"] != observed[path]:
                raise ValueError("Recovery pending notification inbox changed")
    return paths, sorted(registrations), watched, observed


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


def load_basis(root, work_ids=None, *, metrics=None):
    """The regular prior reader consumes retained revisions, not retired directories."""
    import catalog_authoring.validate_factor_panel as panel
    from catalog_revision_store import RevisionWorkspace
    marker = read(root / "CURATION-BASELINE.json")
    if marker.get("schemaVersion") != "curation-baseline-anchor-v1":
        raise ValueError("Unknown curation basis format")
    original_repo = absolute_identity(marker["repository"])
    # Restores preserve the signed marker bytes. Resolve its repository through
    # the existing restore mapping instead of reading the original live store.
    from workspace_paths import restored_origins
    repo = Path(marker["repository"])
    for parent in root.resolve().parents:
        if (parent / ".catalog-restore.json").is_file() and original_repo in restored_origins(parent):
            repo = parent
            break
    if not root.resolve().is_relative_to((repo / BASE).resolve()):
        raise ValueError("Curation basis is outside the authoring store")
    store = None
    for name in ("workspace.next.sqlite", "workspace.sqlite"):
        database = repo / BASE / name
        if not database.is_file():
            continue
        with closing(sqlite3.connect(database.as_uri() + "?mode=ro", uri=True)) as connection:
            if connection.execute("PRAGMA user_version").fetchone()[0] not in (3, 4):
                continue
            generation = connection.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
        if generation == marker["revision"]["generation"]:
            store = RevisionWorkspace(repo, database)
            break
    if store is None:
        raise ValueError("Curation basis generation is unavailable")
    anchor = store.get_revision(marker["revision"])["payload"]
    if work_ids is None:
        # A full audit still verifies the whole publication. A Work prior is
        # proven by its stored revision, exact current rows and original sources.
        manifest = root / "MANIFEST.sha256"
        panel.verify_manifest(root, manifest, {path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file() and path != manifest})
        for name, sha in anchor["pair"].items():
            if digest(unlinked(root / key_path(name)).read_bytes()) != sha:
                raise ValueError("Curation basis pair changed")
        for name, sha in anchor.get("reviews", {}).items():
            if digest(unlinked(root / key_path(name)).read_bytes()) != sha:
                raise ValueError("Curation review artifact changed")
    selected = set(anchor["works"]) if work_ids is None else work_ids & set(anchor["works"])
    claims, evidence, legacy = {}, {}, []
    with closing(store.connect()) as db, closing(sqlite3.connect(unlinked(root / "catalog-expanded.candidate.sqlite").as_uri() + "?mode=ro", uri=True)) as actual_db:
        db.execute("BEGIN")
        actual_db.execute("BEGIN")
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
                quoted_name = name.replace('"', '""')
                where = "" if work_ids is None else f' WHERE "{owner}" IN ({",".join("?" for _ in selected)})'
                for row in actual_db.execute(f'SELECT * FROM "{quoted_name}"{where} ORDER BY sourceOrdinal',
                                             () if work_ids is None else tuple(sorted(selected))):
                    if metrics is not None:
                        metrics["rowsRead"] = metrics.get("rowsRead", 0) + 1
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
            review = work[0].get("annotationReviewReference")
            if work_ids is not None and review:
                name = "data/source/" + key_path(review)
                expected = anchor.get("reviews", {}).get(name)
                if expected is None or digest(unlinked(root / key_path(name)).read_bytes()) != expected:
                    raise ValueError("Curation review artifact changed")
                if metrics is not None:
                    metrics["reviewsRead"] = metrics.get("reviewsRead", 0) + 1
            for name, grouped in actual_tables.items():
                rows = grouped.get(wid, [])
                if semantic_rows(payload["tables"].get(name, [])) != semantic_rows(rows):
                    raise ValueError(f"Curation basis differs from current rows: {wid} {name}")
            from catalog_authoring import scope_correction as scope
            scoped = {row["id"]: row for row in payload["tables"].get("source_evidence", [])
                      if row.get("extractorVersion") == scope.EXTRACTOR}
            scope.accepted_exclusions(scoped)
            for row in scoped.values():
                notes = json.loads(row["notes"])
                if notes["correction"] not in payload.get("scopeCorrections", []):
                    raise ValueError("Curation scope correction proof is missing")
                name = "data/source/" + key_path(notes["reviewReference"])
                expected = anchor.get("reviews", {}).get(name)
                if expected is None or digest(unlinked(root / name).read_bytes()) != expected:
                    raise ValueError("Curation scope audit review changed")
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
            if name.endswith("-STORAGE.json") or name == "CHECKPOINT.json" or schema in {"catalog-compact-work-v1", "catalog-compact-work-v2", "catalog-compact-publication-v1", "catalog-compact-publication-v2"}:
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
            if schema in {"catalog-compact-work-v1", "catalog-compact-work-v2"}:
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
        from catalog_authoring import scope_correction as scope
        columns = {row[1] for row in db.execute("PRAGMA table_info(source_evidence)")}
        if "extractorVersion" in columns:
            scoped = {row[0]: dict(zip(("id", "workId", "extractorVersion", "notes"), row))
                      for row in db.execute("SELECT id,workId,extractorVersion,notes FROM source_evidence WHERE extractorVersion=?", (scope.EXTRACTOR,))}
            scope.accepted_exclusions(scoped)
            references.update(json.loads(row["notes"])["reviewReference"] for row in scoped.values())
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


def _metadata_curation_updates(store, prior, previous_root, publication, excluded):
    """Bind copied bibliography without changing non-target adjudication facts."""
    table = "source_book_metadata"
    owners, current_metadata = set(), {}
    for root in dict.fromkeys((previous_root, publication)):
        with closing(sqlite3.connect(unlinked(root / "catalog-expanded.candidate.sqlite").as_uri() + "?mode=ro", uri=True)) as db:
            if not db.execute("SELECT 1 FROM sqlite_schema WHERE type='table' AND name=?", (table,)).fetchone():
                continue
            columns = [row[1] for row in db.execute(f'PRAGMA table_info("{table}")')]
            for values in db.execute(f'SELECT * FROM "{table}" ORDER BY sourceOrdinal'):
                row = dict(zip(columns, values))
                owners.add(row["workId"])
                if root == publication:
                    current_metadata.setdefault(row["workId"], []).append(row)
    updates = {}
    with closing(sqlite3.connect(unlinked(publication / "catalog-expanded.candidate.sqlite").as_uri() + "?mode=ro", uri=True)) as db:
        owned_tables = []
        for (name,) in db.execute("SELECT name FROM sqlite_schema WHERE type='table'"):
            quoted = name.replace('"', '""')
            columns = [row[1] for row in db.execute(f'PRAGMA table_info("{quoted}")')]
            owner = "id" if name == "source_works" else "workId"
            if name != table and owner in columns:
                owned_tables.append((name, quoted, columns, owner))
        for wid in sorted(owners - set(excluded)):
            if wid not in prior["works"]:
                raise ValueError(f"Copied metadata Work has no retained curation: {wid}")
            original = store.get_revision(prior["works"][wid])
            payload = original["payload"]
            rows = current_metadata.get(wid, [])
            if semantic_rows(payload["tables"].get(table, [])) == semantic_rows(rows):
                continue
            for name, quoted, columns, owner in owned_tables:
                current = [dict(zip(columns, row)) for row in db.execute(
                    f'SELECT * FROM "{quoted}" WHERE "{owner}"=? ORDER BY sourceOrdinal', (wid,))]
                if semantic_rows(payload["tables"].get(name, [])) != semantic_rows(current):
                    raise ValueError(f"Copied metadata cannot change non-target curation: {wid} {name}")
            updates[wid] = ({**payload, "tables": {**payload["tables"], table: rows}}, original["members"])
    return updates


def advance_basis(repo, previous_root, publication, entries):
    """Advance published facts and copied metadata; never replay other claims."""
    store = Workspace(repo)
    if not getattr(store, "is_revision_store", False):
        return publication
    from catalog_authoring import scope_correction as scope
    if any((entry[2] / "panel-input/scope-correction-request.json").is_file()
           and not (entry[2] / "panel-input/panel-input.json").is_file() for entry in entries):
        raise ValueError("Scope correction request has no frozen input mode")
    scoped = [entry for entry in entries if (entry[2] / "panel-input/panel-input.json").is_file()
              and scope.enabled(entry[2] / "panel-input")]
    if scoped:
        if len(scoped) != len(entries):
            raise ValueError("Scope-only correction must use a separate publication batch")
        proofs, scoped_members = {}, {}
        for wid, _, frozen, sealed in scoped:
            scope.validate(frozen / "panel-input", sealed / "panel-result")
            record = read(sealed / "panel-result/chunk-01/scope-corrections.json")["corrections"][0]
            if record["workId"] != wid:
                raise ValueError("Scope basis target mismatch")
            proofs[wid] = record
            for path in store.files([frozen / "panel-input", sealed]):
                scoped_members[relative(repo, path)] = digest(path.read_bytes())
        return advance_metadata_basis(repo, previous_root, publication, set(proofs),
                                      scope_proofs=proofs, scope_members=scoped_members)
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
    metadata_updates = _metadata_curation_updates(store, prior, previous_root, publication, work_ids)
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
    for wid, (payload, original_members) in metadata_updates.items():
        works[wid] = store.put_revision("curation", wid, payload, original_members)
    # The publisher's complete readback remains the publication verdict. This
    # separate root changes storage references while preserving the exact pair.
    destination = repo / BASE / "retained/curation-baseline" / digest((publication / "MANIFEST.sha256").read_bytes())
    if not destination.exists():
        create_anchor(store, destination, publication, works, legacy_pins=prior.get("legacyPins", {}),
                      provenance={"publicationManifestSha256": digest((publication / "MANIFEST.sha256").read_bytes())})
    load_basis(destination, work_ids | set(metadata_updates))
    return destination


def advance_metadata_basis(repo, previous_root, publication, work_ids, *, scope_proofs=None, scope_members=None):
    """Keep verified claims while an existing publisher changes bibliography/eligibility."""
    from catalog_authoring.publish_factor_batch import _backend_module
    store = Workspace(repo)
    if not getattr(store, "is_revision_store", False):
        return publication
    store.save([publication], "metadata:verified-publication")
    prior = store.get_revision(read(previous_root / "CURATION-BASELINE.json")["revision"])["payload"]
    metadata_updates = _metadata_curation_updates(store, prior, previous_root, publication, work_ids)
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
        if scope_proofs is not None:
            from catalog_authoring import scope_correction as scope
            proof = scope_proofs[wid]
            if not set(payload["tables"]) <= set(proof["beforeSnapshot"]["tables"]):
                raise ValueError("Scope basis snapshot omits owned tables")
            before = {"tables": {name: [json.loads(value) for value in semantic_rows(payload["tables"].get(name, []))]
                                  for name in proof["beforeSnapshot"]["tables"]}}
            # Sorting uses the shared manifest codec; projection ordinals never
            # redefine accepted semantic rows.
            before = {"tables": {name: sorted(rows, key=scope.canonical) for name, rows in before["tables"].items()}}
            if before != proof["beforeSnapshot"]:
                raise ValueError("Scope basis lost exact accepted prior snapshot")
            if not set(current) <= set(before["tables"]):
                raise ValueError("Scope basis changed owned table membership")
            after = {name: sorted((json.loads(value) for value in semantic_rows(current.get(name, []))), key=scope.canonical)
                     for name in before["tables"]}
            expected = json.loads(scope.canonical(before["tables"]))
            expected["source_works"][0].update({key: str(value).lower() for key, value in scope.FLAGS.items()})
            added = [row for row in after["source_evidence"] if row not in expected["source_evidence"]]
            if len(added) != 1 or added[0]["extractorVersion"] != scope.EXTRACTOR:
                raise ValueError("Scope basis lacks exact new scope evidence")
            notes = json.loads(added[0]["notes"])
            if notes.get("correction") != proof or notes.get("schemaVersion") != "catalog-scope-correction-evidence-v1" or added[0]["id"] != "ev-scope-correction-" + digest(added[0]["notes"].encode("utf-8")):
                raise ValueError("Scope basis evidence binding changed")
            expected["source_evidence"] = sorted([*expected["source_evidence"], added[0]], key=scope.canonical)
            if expected != after:
                raise ValueError("Scope basis correction changed preserved facts")
        for name in ("source_factors", "source_themes"):
            if semantic_rows(current.get(name, [])) != semantic_rows(payload["tables"].get(name, [])):
                raise ValueError("A metadata correction cannot change accepted factor/theme claims")
        for field in ("genres", "annotationReviewMethod"):
            if current["source_works"][0][field] != payload["tables"]["source_works"][0][field]:
                raise ValueError("A metadata correction cannot change genre or adjudication authority")
        revised = {**payload, "tables": current}
        revised_members = dict(original["members"])
        if scope_proofs is not None:
            revised["scopeCorrections"] = [*payload.get("scopeCorrections", []), scope_proofs[wid]]
            revised_members.update(scope_members or {})
        works[wid] = store.put_revision("curation", wid, revised, revised_members)
    for wid, (payload, original_members) in metadata_updates.items():
        works[wid] = store.put_revision("curation", wid, payload, original_members)
    destination = repo / BASE / "retained/curation-baseline" / digest((publication / "MANIFEST.sha256").read_bytes())
    if not destination.exists():
        create_anchor(store, destination, publication, works, legacy_pins=prior.get("legacyPins", {}),
                      provenance={"publicationManifestSha256": digest((publication / "MANIFEST.sha256").read_bytes())})
    load_basis(destination, set(work_ids) | set(metadata_updates))
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
    with acquire(base / "locks/publication-owner.lock", wait=False), exclusive(base / "locks/publication.lock", wait=False), exclusive_file(base / "backups/rotation.lock"):
        assert_no_pending(repo)
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
                    for table, order in (("revision", "id"), ("head", "kind,subject")):
                        if source.execute(f"SELECT * FROM {table} ORDER BY {order}").fetchall() != db.execute(f"SELECT * FROM {table} ORDER BY {order}").fetchall():
                            raise ValueError("New backup does not contain the complete staged generation")
                    source_meta = dict(source.execute("SELECT * FROM store_meta"))
                    backup_meta = dict(db.execute("SELECT * FROM store_meta"))
                    if any(backup_meta.get(key) != value for key, value in source_meta.items() if key != "backup_cursor"):
                        raise ValueError("New backup metadata differs from staged generation")
                    if source.execute("PRAGMA user_version").fetchone()[0] == 4:
                        sequence = source.execute("SELECT coalesce(max(seq),0) FROM change_log").fetchone()[0]
                        if backup_meta.get("backup_cursor") != str(sequence):
                            raise ValueError("New backup cursor is incomplete")
            if old.exists() or old_backup.exists():
                raise ValueError("Earlier retired generation still occupies rollback paths")
            state = read(state_path)
            original_state_sha = digest(state_path.read_bytes())
            state["latestCandidate"].update(root=os.path.relpath(build["anchor"], repo / CONTINUATION).replace("\\", "/"),
                manifestSha256=verification["anchorManifestSha256"], curationBasisGeneration=build["generation"])
            state["authoringStore"] = {"schemaVersion": 4, "generation": build["generation"], "policy": "curation-evidence-active-v1"}
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
    with acquire(base / "locks/publication-owner.lock", wait=False), exclusive(base / "locks/publication.lock", wait=False):
        assert_no_pending(repo)
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


def upgrade_store_v4(repo, *, enable_wal=False, resume=False):
    """One stopped-writer transition with a complete pre-upgrade recovery image."""
    from catalog_revision_store import RevisionWorkspace, wal_runtime_supported
    repo = Path(repo).resolve()
    base = repo / BASE
    source = base / "workspace.sqlite"
    state_path = repo / CONTINUATION / "STATE.json"
    maintenance = base / "RETENTION-MAINTENANCE.json"
    completed = base / "STORAGE-V4-UPGRADE.json"
    recovery = base / "backups/pre-v4.sqlite"
    if enable_wal and not wal_runtime_supported():
        raise ValueError("Use the configured patched SQLite runtime before enabling WAL")
    with acquire(base / "locks/publication-owner.lock", wait=False), acquire(base / "locks/publication.lock", wait=False):
        assert_no_pending(repo)
        if completed.is_file() and not maintenance.is_file():
            result = read(completed)
            with closing(sqlite3.connect(source.as_uri() + "?mode=ro", uri=True)) as db:
                if db.execute("PRAGMA user_version").fetchone()[0] != 4:
                    raise ValueError("Completed migration no longer matches the active schema")
            if read(state_path).get("authoringStore", {}).get("generation") != result["generation"]:
                raise ValueError("Completed migration no longer matches STATE")
        else:
            if maintenance.is_file():
                if not resume:
                    raise ValueError("Interrupted storage upgrade exists; use upgrade-v4 --resume")
                intent = read(maintenance)
                if intent.get("schemaVersion") != "catalog-storage-v4-upgrade-v1":
                    raise ValueError("Another retention operation owns the maintenance boundary")
                if intent["enableWal"] != enable_wal:
                    raise ValueError("Resume must retain the original journal mode choice")
            else:
                with closing(sqlite3.connect(source.as_uri() + "?mode=ro", uri=True)) as db:
                    if db.execute("PRAGMA user_version").fetchone()[0] != 3:
                        raise ValueError("Only the current v3 store can start this transition")
                    generation = db.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
                if recovery.exists():
                    raise ValueError("An unbound pre-v4 recovery image already exists; inspect it before transition")
                intent = {"schemaVersion": "catalog-storage-v4-upgrade-v1", "generation": generation,
                          "enableWal": enable_wal, "oldStateSha256": file_sha(state_path),
                          "oldState": read(state_path), "recovery": str(recovery), "createdAt": utc_now()}
                write(maintenance, intent)
            if not intent.get("recoverySha256"):
                recovery.parent.mkdir(parents=True, exist_ok=True)
                # Recreating this named, unverified copy cannot discard evidence:
                # the primary has not yet been upgraded and stays maintenance-locked.
                with closing(sqlite3.connect(source.as_uri() + "?mode=ro", uri=True)) as original:
                    if original.execute("PRAGMA user_version").fetchone()[0] != 3:
                        raise ValueError("Missing recovery proof after source transition")
                    with closing(sqlite3.connect(recovery)) as saved:
                        original.backup(saved)
                        if saved.execute("PRAGMA integrity_check").fetchall() != [("ok",)]:
                            raise ValueError("Pre-upgrade recovery image is corrupt")
                        for table, order in (("revision", "id"), ("head", "kind,subject")):
                            query = f"SELECT * FROM {table} ORDER BY {order}"
                            if original.execute(query).fetchall() != saved.execute(query).fetchall():
                                raise ValueError("Pre-upgrade recovery image is incomplete")
                intent["recoverySha256"] = file_sha(recovery)
                write(maintenance, intent)
            elif file_sha(recovery) != intent["recoverySha256"]:
                raise ValueError("Pre-upgrade recovery image changed")
            store = RevisionWorkspace(repo, source)
            upgraded = store.upgrade_v4(enable_wal=enable_wal)
            if upgraded["generation"] != intent["generation"]:
                raise ValueError("Storage generation changed during schema transition")
            initial_backup = store.backup()
            current = read(state_path)
            if current == intent["oldState"]:
                if file_sha(state_path) != intent["oldStateSha256"]:
                    raise ValueError("STATE bytes changed during storage transition")
                next_state = {**current, "authoringStore": {"schemaVersion": 4,
                    "generation": intent["generation"], "policy": "curation-evidence-active-v1",
                    "journalMode": upgraded["journalMode"], "sqliteVersion": sqlite3.sqlite_version}}
                write(state_path, next_state)
            elif (current.get("authoringStore", {}).get("schemaVersion") != 4
                  or current["authoringStore"]["generation"] != intent["generation"]):
                raise ValueError("STATE advanced outside the stopped-writer transition")
            for database in (source, base / "backups/latest.sqlite"):
                with closing(RevisionWorkspace(repo, database).connect()) as db:
                    if db.execute("PRAGMA user_version").fetchone()[0] != 4:
                        raise ValueError("Storage upgrade readback failed")
            result = {**intent, **upgraded, "status": "ACTIVATED", "stateSha256": file_sha(state_path),
                      "backup": initial_backup, "completedAt": utc_now()}
            write(completed, result)
            maintenance.unlink()
    # A failed final boundary resumes here without repeating the schema change.
    result["storage"] = RevisionWorkspace(repo, source).persist([state_path, completed], "storage-v4:activated", phase_boundary=True)
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
    upgrade = commands.add_parser("upgrade-v4")
    upgrade.add_argument("--enable-wal", action="store_true")
    upgrade.add_argument("--resume", action="store_true")
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
    elif args.action == "upgrade-v4":
        result = upgrade_store_v4(Path(__file__).resolve().parents[1], enable_wal=args.enable_wal, resume=args.resume)
        result = {key: result[key] for key in ("status", "schemaVersion", "generation", "journalMode", "recovery", "recoverySha256", "storage")}
    else:
        store = Workspace()
        if not getattr(store, "is_revision_store", False):
            raise ValueError("GC requires an activated revision store")
        if args.apply:
            with acquire(store.repo / BASE / "locks/publication-owner.lock"), acquire(store.repo / BASE / "locks/publication.lock"):
                assert_no_pending(store.repo)
                result = store.gc(apply=True)
            result["backup"] = store.backup()
        else:
            result = store.gc()
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
