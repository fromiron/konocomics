"""Prepare only an explicitly requested operation from a DB-only recovery.

Path resolution remains read-only. Existing command entry points invoke this
module before reading their data; historical exports remain separate commands.
"""
from __future__ import annotations

from contextlib import closing, nullcontext
import json
import os
from pathlib import Path
import tempfile
from time import perf_counter

from catalog_workspace import Workspace, digest, key_path, unlinked
from catalog_authoring_locks import acquire
from workspace_paths import artifact_path
import catalog_retention as retention


class _Selection(retention._RecoveryFiles):
    def __init__(self, store, db):
        super().__init__(store, db)
        self.control_receipt = self.current("active", "current-recovery-controls")
        self.control = self.revision(self.control_receipt) if self.control_receipt else {"payload": {}, "members": {}}
        self.live_inputs, self.mutable_targets = {}, set()
        self.needs_backup = False
        self._state = None

    def file(self, path, sha=None, *, historical=False):
        name = self.key(path)
        if name in self.control["payload"].get("deletedPaths", {}) and not (historical and sha is not None):
            raise FileNotFoundError("Current recovery path was explicitly deleted: " + name)
        current = self.control["members"].get(name)
        if sha is None:
            sha = current
        if historical and sha is not None:
            self.historical_versions.add((name, sha))
            if self.db.execute("SELECT 1 FROM revision_blob WHERE path=? AND sha256=? LIMIT 1", (name, sha)).fetchone() is None:
                raise ValueError("Historical recovery has no exact saved membership: " + name)
            return self.store.read_blob(self.db, sha)
        return super().file(name, sha, historical=historical)

    def children(self, path):
        deleted = self.control["payload"].get("deletedPaths", {})
        yield from (name for name in super().children(path) if name not in deleted)

    def request(self, path, expected=None):
        """An explicit new input may exist without an older retained identity."""
        name = self.key(path)
        target = unlinked(self.store.repo / name)
        if target.is_file():
            body = target.read_bytes()
            sha = digest(body)
            if expected is not None and expected != sha:
                raise ValueError("Requested immutable artifact changed: " + name)
            self.live_inputs[name] = sha
            return body
        return self.file(name, expected)

    def json(self, path, expected=None, *, live=False):
        return json.loads(self.request(path, expected) if live else self.file(path, expected))

    def state(self):
        if self._state is None:
            payload = self.control["payload"]
            path = payload.get("statePath", retention.CONTINUATION + "/STATE.json")
            self._state = self.json(path, payload.get("stateSha256"))
        return self._state

    def basis(self, work_ids=()):
        state = self.state()
        basis = Path(self.key(self.store.repo / retention.CONTINUATION / state["latestCandidate"]["root"]))
        metadata = self.json(basis / "CURATION-BASELINE.json")
        anchor = self.revision(metadata["revision"])
        manifest = self.manifest(basis, "MANIFEST.sha256", state["latestCandidate"].get("manifestSha256"))
        for name in ("catalog-expanded.candidate.sqlite", "catalog-source-registry.candidate.sqlite"):
            self.file(basis / name, manifest[name])
        for wid in work_ids:
            reference = anchor["payload"].get("works", {}).get(wid)
            if reference is None:
                continue
            value = self.revision(reference)
            for row in value["payload"].get("tables", {}).get("source_works", []):
                review = row.get("annotationReviewReference")
                if review:
                    name = "data/source/" + key_path(review)
                    self.file(basis / name, manifest[name])
            for legacy in anchor["payload"].get("legacyPins", {}).get(wid, []):
                self.root(legacy["root"], legacy["manifestSha256"], prior=True)
        return basis

    def canonical(self, *, static=False):
        payload = self.control["payload"]
        pending = retention.BASE + "/locks/publication.pending.json"
        pending_present = (pending in self.control["members"] or unlinked(self.store.repo / pending).is_file()
                           or (self.control_receipt is None and pending in self.latest))
        current = payload.get("currentCanonical", {}).get("members", {})
        if self.control_receipt is None:
            # Generic stores can preserve a metadata operation without STATE.
            # Its exact source capture also owns opaque files and reviews;
            # restoring only catalog.sqlite would change the source-tree digest.
            row = self.db.execute("SELECT b.revision_id FROM revision_blob b JOIN revision r ON r.id=b.revision_id "
                "WHERE b.path='data/source/catalog.sqlite' ORDER BY r.rowid DESC LIMIT 1").fetchone()
            if row is not None:
                saved = self.revision(self.store._receipt(self.db, row[0]))["members"]
                from catalog_authoring.catalog_completed_checks import _STATIC_ARTIFACTS
                targets = set(_STATIC_ARTIFACTS)
                identity_sha = saved.get("src/data/generated/catalog-identity-v1.json")
                if identity_sha:
                    version = json.loads(self.store.read_blob(self.db, identity_sha)).get("catalogVersion")
                    if isinstance(version, str):
                        targets.update(f"public/catalog/{stem}.{version}.json" for stem in ("catalog-v1", "recommendation-context-v1"))
                current = {name: sha for name, sha in saved.items() if name.startswith("data/source/") or name in targets}
        for name, sha in current.items():
            if static or name == "data/source/catalog.sqlite":
                self.file(name, sha)
        if "data/source/catalog.sqlite" not in self.members and not pending_present:
            self.file("data/source/catalog.sqlite", payload.get("canonicalSha256"))
        for name in ("data/staging/catalog-expansion/gold-set-manifest.json",):
            if name in self.control["members"] or name in self.latest:
                self.file(name)
        if pending_present:
            self.request(pending, self.control["members"].get(pending))

    def authoring_alias(self):
        relative = Path("overlay/data/staging/catalog-expansion/v4-final/alias-resolution.csv")
        backend = self.store.repo / "scripts/catalog_authoring/legacy/followup-panel-tools"
        roots = [self.store.repo, backend, *(parent for parent in backend.parents if parent.is_relative_to(self.store.repo))]
        paths = [root / relative for root in roots]
        paths.append(artifact_path(self.store.repo / ".workspace/catalog-followup/batch001-20260902/konocomics-v5-panel-batch-001-of-008" / relative, self.store.repo))
        for path in paths:
            name = self.key(path)
            if unlinked(self.store.repo / name).is_file() or name in self.latest:
                self.request(name)
                return
        # The normal prepare consumer reports an unavailable authority; do not
        # invent an alias table in a store which never preserved one.

    def manifest(self, root, filename, sha):
        body = self.file(Path(root) / filename, sha)
        result = {}
        for line in body.decode("ascii").splitlines():
            value, separator, name = line.partition("  ")
            if (not separator or len(value) != 64 or any(c not in "0123456789abcdef" for c in value)
                    or key_path(name) in result):
                raise ValueError("Invalid requested recovery manifest")
            result[key_path(name)] = value
        return result

    def checked(self, row):
        checked_name = self.key(row["checkedPath"])
        checked = self.json(checked_name, row["checkedSha256"])
        if checked.get("workId") != row["workId"] or checked.get("status") != row["status"]:
            raise ValueError("Requested CHECKED identity changed")
        selected = {}
        state = self.state()
        # Exact membership lookup, never a scan of historical completion payloads.
        for kind, subject, revision_id in self.db.execute(
                "SELECT h.kind,h.subject,h.revision_id FROM revision_blob b JOIN head h ON h.revision_id=b.revision_id "
                "WHERE b.path=? AND b.sha256=? AND (h.kind='completion' OR "
                "(h.kind='active' AND h.subject LIKE 'completion-identity:%')) ORDER BY h.kind,h.subject",
                (checked_name, row["checkedSha256"])):
            summary_sha = subject.removeprefix("completion-identity:")
            if summary_sha in state.get("publicationBatches", {}):
                value = self.revision(self.store._receipt(self.db, revision_id))
                selected = value["members"]
                self.completion(summary_sha)
                break
        run = Path(checked_name).parent
        config_name = (run / "RUN.json").as_posix()
        config = self.json(config_name, selected.get(config_name))
        if not selected:
            select_runner_files(self, {"operation": "runner", "action": "check",
                                       "runRoot": str(run), "workId": row["workId"]})
            return
        frozen_name = config.get("frozenDirectory", "frozen")
        if not isinstance(frozen_name, str) or frozen_name in {"", ".", ".."} or "/" in frozen_name or "\\" in frozen_name:
            raise ValueError("Completed frozen directory escapes its run")
        frozen = run / frozen_name / "panel-input"
        inputs = self.manifest(frozen, "PANEL-INPUT.sha256", checked["inputManifestSha256"])
        self.file(frozen / "authoring-job.json", inputs["authoring-job.json"])
        self.file(config["decisionsPath"], checked["decisionsSha256"])
        self.root(checked["sealedRoot"], checked["resultManifestSha256"], follow=False)

    def completion(self, summary_sha):
        receipt = self.current("completion", summary_sha)
        if receipt is None:
            return None
        value = self.revision(receipt)
        payload = value["payload"]
        applied = self.state().get("publicationBatches", {}).get(summary_sha)
        if (payload.get("status") != "VERIFIED" or payload.get("summarySha256") != summary_sha
                or applied is None or payload.get("applied") != applied):
            raise ValueError("Requested completion differs from current STATE")
        finished = payload["finished"]
        self.file(Path(applied["batchRoot"]) / "BATCH-FINISHED.json", applied["receiptSha256"])
        if finished.get("summaryPath"):
            _summary(self, finished["summaryPath"], summary_sha)
        if finished.get("readback"):
            self.file(finished["readback"], finished["readbackSha256"])
        return value


def _summary(files, path, expected=None, ancestors=()):
    name = files.key(path)
    if name in ancestors:
        raise ValueError("Cyclic requested source summary")
    body = files.request(name, expected)
    value = json.loads(body)
    source = value.get("sourceSummary")
    if source is not None:
        _summary(files, source["path"], source["sha256"], (*ancestors, name))
    return body


def _batch(files, request):
    summary_body = _summary(files, request["summaryPath"])
    summary_sha, summary = digest(summary_body), json.loads(summary_body)
    state = files.state()
    files.basis()
    completed = files.completion(summary_sha) if summary_sha in state.get("publicationBatches", {}) else None
    if completed is None or request.get("purpose") == "notification":
        for row in summary.get("works", []):
            if row.get("status") == "READY_FOR_PUBLICATION":
                files.checked(row)
    if request.get("purpose") != "notification" or request.get("applyCanonical"):
        files.canonical(static=bool(request.get("applyCanonical")))
    files.needs_backup = True
    return {"needsBackup": True}


def _canonical(files, request):
    if request.get("action") == "verify":
        output = Path(files.key(request["outputRoot"]))
        completed = files.json(request.get("inputPath") or output / "completion.json")
        prepared = files.json(output / "prepared.json", completed["preparedSha256"])
        if files.key(prepared["output"]) != output.as_posix():
            raise ValueError("Requested historical completion belongs to another output")
        pending_name = retention.BASE + "/locks/publication.pending.json"
        if pending_name in files.control["members"] or (files.control_receipt is None and pending_name in files.latest):
            files.file(pending_name)
        pointer_name = retention.BASE + "/locks/publication.completed.json"
        if pointer_name in files.control["members"]:
            pointer = json.loads(files.store.read_blob(files.db, files.control["members"][pointer_name]))
            if Path(files.key(pointer["preparedPath"])).parent.as_posix() == output.as_posix():
                retention._restore_completed_canonical_pointer(files, files.control)
                files.members.pop(pointer_name, None)  # Read proof metadata; no current-effect selection.
        for item in prepared["artifacts"]:
            target = files.key(item["path"])
            path = output / "candidate" / target
            if target == "data/source":
                prefix = path.as_posix() + "/"
                if not any(name.startswith(prefix) for name in files.members):
                    files.root(path, follow=False)
            else:
                name = path.as_posix()
                if name not in files.members:
                    files.file(path, item["sha256"])
        if prepared.get("kind") == "adjudication":
            for guard in prepared.get("guards", []):
                if guard["path"].startswith("docs/"):
                    files.file(output / "policies" / key_path(guard["path"]), guard["sha256"])
        return {}
    files.canonical(static=True)
    pending_name = retention.BASE + "/locks/publication.pending.json"
    pending = files.json(pending_name, live=True) if (pending_name in files.control["members"]
                or unlinked(files.store.repo / pending_name).is_file()
                or (files.control_receipt is None and pending_name in files.latest)) else None
    output = request.get("outputRoot")
    if pending is not None:
        prepared_path, expected = pending["preparedPath"], pending["preparedSha256"]
        prepared = files.json(prepared_path, expected, live=True)
        files.root(Path(files.key(prepared_path)).parent, follow=False)
        for item in prepared["artifacts"]:
            target = files.key(item["path"])
            scratch = (Path(files.key(prepared_path)).parent / "publish" / target).as_posix()
            # The existing publisher repairs these private copies from its
            # immutable candidate before entering the broker. Its prepared SHA
            # gate, not the older cached scratch bytes, authorizes each swap.
            files.mutable_targets.update(name for name in files.members
                                         if name == scratch or name.startswith(scratch + "/"))
            for name, sha in files.control["members"].items():
                if name == target or name.startswith(target + "/"):
                    files.file(name, sha)
                    files.mutable_targets.add(name)
    elif output:
        name = files.key(output)
        if name + "/prepared.json" in files.latest or name + "/begin.json" in files.latest:
            files.root(name, follow=False)
        pointer_name = retention.BASE + "/locks/publication.completed.json"
        if pointer_name in files.control["members"]:
            pointer = json.loads(files.store.read_blob(files.db, files.control["members"][pointer_name]))
            if Path(files.key(pointer["preparedPath"])).parent.as_posix() == name:
                retention._restore_completed_canonical_pointer(files, files.control)
    if request.get("inputPath"):
        files.request(request["inputPath"])
    for field in ("publicationRoot",):
        if request.get(field):
            path = unlinked(files.store.repo / files.key(request[field]))
            if path.is_file():
                files.request(path)
            elif next(iter(files.children(path)), None) is not None or not path.is_dir():
                files.root(path, follow=False)
    return {}


def _metadata(files, request):
    files.canonical(static=True)
    if request.get("inputPath"):
        source = Path(files.key(request["inputPath"]))
        entries = files.json(source, live=True)
        for item in entries:
            receipt_path = source.parent / key_path(item["receiptFile"])
            receipt = files.json(receipt_path, item["receiptSha256"], live=True)
            body = files.request(source.parent / key_path(item["sourceFile"]), receipt["sha256"])
            if len(body) != receipt["bytes"]:
                raise ValueError("Metadata recovery capture length changed")
    if request.get("outputRoot"):
        name = files.key(request["outputRoot"])
        if name + "/prepared.json" in files.latest:
            files.root(name, follow=False)
    return {}


def _parent_pid(pid):
    if os.name != "nt":
        return int(Path(f"/proc/{pid}/stat").read_text().rsplit(")", 1)[1].split()[1])
    import ctypes
    from ctypes import wintypes
    class Process(ctypes.Structure):
        _fields_ = [("size", wintypes.DWORD), ("usage", wintypes.DWORD), ("pid", wintypes.DWORD),
                    ("heap", ctypes.c_size_t), ("module", wintypes.DWORD), ("threads", wintypes.DWORD),
                    ("parent", wintypes.DWORD), ("priority", wintypes.LONG), ("flags", wintypes.DWORD),
                    ("filename", wintypes.WCHAR * 260)]
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.CreateToolhelp32Snapshot.argtypes = [wintypes.DWORD, wintypes.DWORD]
    kernel.CreateToolhelp32Snapshot.restype = wintypes.HANDLE
    kernel.Process32FirstW.argtypes = [wintypes.HANDLE, ctypes.POINTER(Process)]
    kernel.Process32NextW.argtypes = [wintypes.HANDLE, ctypes.POINTER(Process)]
    kernel.CloseHandle.argtypes = [wintypes.HANDLE]
    snapshot = kernel.CreateToolhelp32Snapshot(2, 0)
    if snapshot == ctypes.c_void_p(-1).value:
        raise ctypes.WinError(ctypes.get_last_error())
    try:
        entry = Process()
        entry.size = ctypes.sizeof(entry)
        present = kernel.Process32FirstW(snapshot, ctypes.byref(entry))
        while present:
            if entry.pid == pid:
                return entry.parent
            present = kernel.Process32NextW(snapshot, ctypes.byref(entry))
    finally:
        kernel.CloseHandle(snapshot)
    raise ValueError("Recovery lock parent process is unavailable")


def _materialization_lock(repo):
    path = repo / retention.BASE / "locks/publication.lock"
    inherited = os.environ.get("CATALOG_COMMIT_LOCK_HELD")
    if inherited:
        owner = json.loads(inherited)
        if Path(owner.get("path", "")).resolve() == path.resolve():
            marker = unlinked(path.with_suffix(path.suffix + ".owner.json"))
            if not marker.is_file() or json.loads(marker.read_bytes()) != owner:
                raise ValueError("Inherited recovery lock ownership changed")
            parent = os.getppid()
            if type(owner.get("pid")) is not int or owner["pid"] not in {parent, _parent_pid(parent)}:
                raise ValueError("Inherited recovery lock is not held by this command's broker")
            return nullcontext()
    return acquire(path, wait=True, metadata={"operation": "requested-recovery"})


def prepare_restored_operation(repo, request):
    repo = unlinked(Path(repo).resolve())
    marker = repo / ".catalog-restore.json"
    if not marker.is_file() or json.loads(unlinked(marker).read_bytes()).get("materialization") != "on-demand":
        return {"status": "NOT_REQUIRED"}
    if not isinstance(request, dict):
        raise ValueError("Recovery requires an explicit operation request")
    operation = request.get("operation")
    if operation not in {"batch", "runner", "notification", "metadata", "canonical"}:
        raise ValueError("Unknown recovery operation")
    store = Workspace(repo)
    if not getattr(store, "is_revision_store", False):
        raise ValueError("DB-only recovery requires a revision store")
    started = perf_counter()
    with closing(store.connect()) as db, tempfile.SpooledTemporaryFile(max_size=16 * 1024 * 1024) as prepared:
        db.execute("BEGIN")
        if db.execute("PRAGMA user_version").fetchone()[0] != 4:
            raise ValueError("DB-only recovery requires authoring schema v4")
        retention.sparse_restore_marker(store)
        files = _Selection(store, db)
        state_sha = files.control["payload"].get("stateSha256")
        saved_mode = None
        if state_sha:
            state_path = files.control["payload"].get("statePath")
            if not state_path or files.control["members"].get(state_path) != state_sha:
                raise ValueError("Recovery journal mode has no exact STATE binding")
            saved_state = json.loads(store.read_blob(db, state_sha))
            saved_mode = saved_state.get("authoringStore", {}).get("journalMode")
        if saved_mode == "wal":
            from catalog_revision_store import wal_runtime_supported
            if not wal_runtime_supported():
                raise ValueError("Recovered workspace WAL requires the approved patched SQLite runtime")
        pending = [request]
        while pending:
            current = pending.pop()
            kind = current["operation"]
            if kind == "batch":
                result = _batch(files, current)
            elif kind == "runner":
                result = select_runner_files(files, current)
            elif kind == "notification":
                from catalog_authoring.notification_guard import select_recovery_files
                result = select_recovery_files(files, current, files.control)
            elif kind == "metadata":
                result = _metadata(files, current)
            elif kind == "canonical":
                result = _canonical(files, current)
            else:
                raise ValueError("Unknown dependent recovery operation")
            result = result or {}
            files.needs_backup |= bool(result.get("needsBackup"))
            pending.extend(result.get("requests", []))
        created, reused = 0, 0
        selected = dict(files.members)
        selected.update({retention.BASE + "/restored-versions/" + sha: sha for _, sha in files.historical_versions})
        shared = {name for name in selected if name in files.control["members"]
                  or name.startswith(("data/source/", "data/generated/", "src/data/generated/", "public/catalog/",
                                      retention.BASE + "/notifications/", retention.BASE + "/locks/"))
                  or "/notification-events/" in name
                  or name == retention.CONTINUATION + "/STATE.json"}
        staged = {}

        def materialize(name, sha, body):
            nonlocal created, reused
            target = unlinked(repo / key_path(name))
            if target.exists():
                if not target.is_file() or (name not in files.mutable_targets and digest(target.read_bytes()) != sha):
                    raise ValueError("Requested recovery file changed during materialization: " + name)
                reused += 1
                return
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open("xb") as stream:
                stream.write(body)
                stream.flush()
                os.fsync(stream.fileno())
            if digest(target.read_bytes()) != sha:
                raise ValueError("Requested recovery readback failed: " + name)
            created += 1

        # Validate every conflict before writing the first selected file.
        for name, sha in selected.items():
            target = unlinked(repo / key_path(name))
            if target.exists() and (not target.is_file() or (digest(target.read_bytes()) != sha and name not in files.mutable_targets)):
                raise ValueError("Requested recovery would overwrite different bytes: " + name)
        for name, sha in selected.items():
            body = store.read_blob(db, sha)
            if name in shared:
                if sha not in staged:
                    staged[sha] = prepared.tell(), len(body)
                    prepared.write(body)
            else:
                materialize(name, sha, body)
        prepared_elapsed = perf_counter() - started
        db.execute("COMMIT")
        commit_started = perf_counter()
        with _materialization_lock(repo) if shared else nullcontext():
            # A fresh view in the same connection checks only this request's
            # shared keys. Independent control updates need not stall it.
            db.execute("BEGIN")
            current = files.current("active", "current-recovery-controls")
            if current != files.control_receipt:
                latest = files.revision(current) if current else {"payload": {}, "members": {}}
                latest_members = latest["members"]
                if any(name in latest["payload"].get("deletedPaths", {}) for name in selected):
                    raise ValueError("Requested recovery was explicitly deleted during private preparation")
                for name in shared:
                    if ((name in files.control["members"] or name in latest_members)
                            and latest_members.get(name) != selected[name]):
                        raise ValueError("Recovery shared control advanced during private preparation: " + name)
            for name in sorted(shared):
                sha = selected[name]
                offset, size = staged[sha]
                prepared.seek(offset)
                materialize(name, sha, prepared.read(size))
            db.execute("COMMIT")
        commit_elapsed = perf_counter() - commit_started
        if any(digest(unlinked(repo / name).read_bytes()) != sha for name, sha in files.live_inputs.items()):
            raise ValueError("Explicit input changed during recovery preparation")
        if any(digest(unlinked(repo / name).read_bytes()) != sha for name, sha in selected.items()
               if name not in files.mutable_targets):
            raise ValueError("Requested recovery changed before final readback")
        result = {"status": "MATERIALIZED", "generation": store._generation, "controlBase": files.control_receipt,
                "request": request, "files": created, "reusedFiles": reused, "needsBackup": files.needs_backup,
                "timingsSeconds": {"privatePreparation": prepared_elapsed, "sharedCommit": commit_elapsed}}
    if saved_mode == "wal":
        result["workspaceJournalMode"] = store.upgrade_v4(enable_wal=True)["journalMode"]
    return result


def select_runner_files(files, request):
    """Select one existing runner invocation without freezing or adjudicating it."""
    import re

    action = request.get("action")
    if action not in {"prepare", "check", "run", "finish"}:
        raise ValueError("Unknown restored runner action")
    run = Path(files.key(request["runRoot"]))
    allowed = [Path(retention.CONTINUATION) / area for area in ("runs", "planning")]
    if not any(run.is_relative_to(parent) and run != parent for parent in allowed):
        raise ValueError("Restored run must remain in authoring runs/planning")

    def available(path):
        name = files.key(path)
        return (unlinked(files.store.repo / name).is_file()
                or name in files.control["members"] or name in files.latest)

    def scope(path, expected=None, *, prior=False):
        name = files.key(path)
        target = unlinked(files.store.repo / name)
        manifest = Path(name) / "MANIFEST.sha256"
        if available(manifest):
            files.request(manifest, expected)
        current_basis = files.key(files.store.repo / retention.CONTINUATION / files.state()["latestCandidate"]["root"])
        if name == current_basis:
            files.basis(work_ids=work_ids)
            return
        if name in files.latest or next(iter(files.children(name)), None) is not None:
            files.root(name, expected, prior=prior, follow=prior)
        elif not target.is_dir():
            raise ValueError("Requested runner input is unavailable: " + name)

    work_ids = set()
    if request.get("workId"):
        if not isinstance(request["workId"], str) or re.fullmatch(r"work-[0-9a-f]{20}", request["workId"]) is None:
            raise ValueError("Invalid restored runner Work identity")
        work_ids.add(request["workId"])
    research_seen = set()

    def research(path, reference=None):
        reference = reference or {}
        name = files.key(path)
        identity = (name, reference.get("sha256"))
        if identity in research_seen:
            return
        research_seen.add(identity)
        files.request(name, reference.get("sha256"))
        folder = Path(name).parent
        session = folder / "collection-session.json"
        if available(session):
            value = files.json(session, live=True)
            if work_ids and value.get("workId") not in work_ids:
                raise ValueError("Restored research collection belongs to another Work")
            scope(folder)
        for field, filename in (("collectionReceiptSha256", "collection-events.jsonl"),
                                ("handoffSha256", "COLLECTION-HANDOFF.json")):
            sidecar = folder / filename
            if reference.get(field) or available(sidecar):
                files.request(sidecar, reference.get(field))

    def job(path, expected=None, *, inputs=True):
        name = files.key(path)
        value = files.json(name, expected, live=True)
        works = value.get("works", [])
        if not isinstance(works, list) or len(works) != 1 or not isinstance(works[0], dict):
            raise ValueError("Restored runner job must identify one Work")
        wid = works[0].get("workId")
        if (not isinstance(wid, str) or re.fullmatch(r"work-[0-9a-f]{20}", wid) is None
                or (work_ids and wid not in work_ids)):
            raise ValueError("Restored runner Work identity differs from its job")
        work_ids.add(wid)
        if inputs:
            refs = works[0].get("researchRefs", [works[0]["researchRef"]] if "researchRef" in works[0] else [])
            for reference in refs:
                research(Path(name).parent / reference["path"], reference)
        return value

    def registry(path, expected=None, source_bindings=None):
        files.request(path, expected)
        folder = Path(files.key(path)).parent
        ledger_path = folder / "correction-ledger.json"
        if not available(ledger_path):
            return
        ledger = files.json(ledger_path, live=True)
        if ledger.get("request", {}).get("schemaVersion") != "factor-registry-correction-request-v5":
            return
        import catalog_authoring.correct_factor_registry as correction
        manifest_name = (folder / "MANIFEST.sha256").as_posix()
        manifest_bindings = [sha for source, sha in (source_bindings or {}).items() if files.key(source) == manifest_name]
        if source_bindings is not None and len(manifest_bindings) != 1:
            raise ValueError("Frozen support correction has no unique manifest binding")
        manifest = files.manifest(folder, "MANIFEST.sha256", manifest_bindings[0] if manifest_bindings else None)
        if set(manifest) != correction.MEMBERS:
            raise ValueError("Restored support correction membership changed")
        for member, sha in manifest.items():
            files.request(folder / member, sha)
        if ledger.get("correctedRegistrySha256") != manifest.get(Path(files.key(path)).name):
            raise ValueError("Restored support correction registry binding changed")
        bindings = ledger.get("sourceInputBindings")
        if not isinstance(bindings, dict) or bindings.get(ledger.get("jobPath")) != ledger["request"].get("jobSha256"):
            raise ValueError("Restored support correction has no bound original job")
        # The correction's multi-Work proof is read by its own verifier. Do not
        # turn its original job into this runner's one-Work assignment.
        for source, sha in bindings.items():
            files.request(source, sha)

    files.state()
    files.canonical()
    config_path = run / "RUN.json"
    config = files.json(config_path, live=True) if available(config_path) else None
    if config is not None:
        # This is the explicitly requested run, including incomplete attempts;
        # restoring no other run prevents an old attempt from becoming current.
        scope(run)
        frozen_name = config.get("frozenDirectory", "frozen")
        if (not isinstance(frozen_name, str) or frozen_name in {"", ".", ".."}
                or "/" in frozen_name or "\\" in frozen_name):
            raise ValueError("Restored frozen directory escapes its run")
        frozen = run / frozen_name
        report_path = frozen / "INPUT-PREPARATION-REPORT.json"
        complete = available(report_path)
        job(run / "job.json", inputs=not complete)
        for binding in config.get("priorBundleBindings", []):
            scope(binding["root"], binding["manifestSha256"], prior=True)
        if complete:
            report = files.json(report_path, live=True)
            input_root = frozen / "panel-input"
            files.root(input_root, report["inputManifestSha256"], follow=False)
            for filename in ("prior-authority.json", "external-prior-authority.json"):
                if available(input_root / filename):
                    for binding in files.json(input_root / filename).get("bundles", []):
                        path = Path(binding["root"])
                        scope(path if path.is_absolute() else input_root / path,
                              binding["manifestSha256"], prior=True)
            if action != "prepare":
                lineage = files.json(input_root / "external-lineage.json")
                metadata = files.json(input_root / "panel-input.json")
                scope(lineage["baselineRoot"], lineage.get("baselineManifestSha256"), prior=True)
                registry(lineage["registryPath"], metadata["registrySha256"], lineage.get("sourceInputBindings", {}))
                for source, sha in lineage.get("sourceInputBindings", {}).items():
                    files.file(source, sha, historical=True)
        else:
            scope(config["baselineRoot"], prior=True)
            registry(config["registryPath"], config.get("registryPathSha256"))
            if config.get("recoveryEpoch"):
                files.request(config["recoveryEpoch"], config.get("recoveryEpochSha256"))
                if files.key(config["recoveryEpoch"]) in files.latest:
                    files.dependencies(config["recoveryEpoch"])
            for binding in config.get("sourceResearchBindings", []):
                research(binding["path"], binding)
            for binding in config.get("provenanceBindings", []):
                for member, sha in binding["files"].items():
                    files.request(Path(binding["root"]) / key_path(member), sha)
        if config.get("decisionsPath") and not request.get("decisionsPath") and action != "prepare":
            files.request(config["decisionsPath"], config.get("decisionsSha256"))

    if request.get("jobPath"):
        job(request["jobPath"], config.get("sourceJobSha256") if config else None,
            inputs=config is None or not complete)
    for path in request.get("researchPaths", []):
        research(path)
    for field in ("registryPath", "decisionsPath"):
        if request.get(field):
            if field == "registryPath":
                registry(request[field])
            else:
                files.request(request[field])
    named = {files.key(path) for path in [request.get("jobPath"), request.get("registryPath"),
             request.get("decisionsPath"), *request.get("researchPaths", [])] if path}
    for path in request.get("inputPaths", []):
        name = files.key(path)
        if name in named:
            continue
        if name == ".workspace/user-sources":
            for wid in sorted(work_ids):
                files.request(Path(name) / (wid + ".json"))
        elif available(name):
            files.request(name)
            if Path(name).name in {"recovery-epoch.json", "recovery-declaration.json"} and name in files.latest:
                files.dependencies(name)
        else:
            session = Path(name) / "collection-session.json"
            if available(session):
                value = files.json(session, live=True)
                if work_ids and value.get("workId") not in work_ids:
                    raise ValueError("Restored explicit collection belongs to another Work")
                scope(name)
            elif available(Path(name) / "MANIFEST.sha256"):
                scope(name, prior=True)
            else:
                raise ValueError("NEEDS_PROVENANCE_BINDING: explicit recovery input has no Work collection or prior manifest")
    if work_ids:
        files.basis(work_ids=work_ids)
    if action == "prepare" and (config is None or not complete):
        files.authoring_alias()
    return {"workIds": sorted(work_ids), "needsBackup": bool(config is not None)}
