"""Revision storage checks use real SQLite, file bytes and backup boundaries."""
from contextlib import closing
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
import threading
import tracemalloc
import zlib

from catalog_revision_store import RevisionWorkspace, SCHEMA, FORMAT, encoded, wal_runtime_supported
from catalog_workspace import digest, APPLICATION_ID, Workspace, authoring_inputs, recorded_run, FROZEN_POLICIES


class RevisionStoreTest(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.repo = Path(self.folder.name)
        self.store = RevisionWorkspace.create(self.repo, self.repo / "data/local/catalog-authoring/workspace.sqlite")

    def test_transient_lifetime_preserves_unfinished_and_retires_only_backed_owned_bytes(self):
        root = self.repo / ".workspace/lifetime/checkpoints"
        root.mkdir(parents=True)
        copied, changed = root / "pair.sqlite", root / "changed.txt"
        with closing(sqlite3.connect(copied)) as db, db:
            db.execute("CREATE TABLE checkpoint(value TEXT)")
            db.execute("INSERT INTO checkpoint VALUES ('actual checkpoint')")
        changed.write_bytes(b"original transient")
        semantic = self.repo / "meaningful.json"
        semantic.write_bytes(b'{"authority":"retained"}')
        durable = self.store.save([semantic], "meaningful authority")
        execution = self.store.put_revision("execution", "private batch", {
            "schemaVersion": "authoring-transient-execution-v1", "disposableRoots": [self.store.key(root)], "identitySha256": "a" * 64})
        snapshot = self.store.persist([root], "checkpoint", execution=execution, phase_boundary=True)["snapshot"]
        with self.assertRaisesRegex(ValueError, "outside its declared scopes"):
            self.store.persist([semantic], "invalid checkpoint", execution=execution)
        self.assertEqual(self.store.gc(now=datetime(2030, 1, 1, tzinfo=timezone.utc), apply=True)["expiredExecutionRevisions"], [])
        self.assertTrue(copied.exists())
        extra = root / "user-note.txt"
        extra.write_bytes(b"not execution-owned")
        changed.write_bytes(b"new unrecorded bytes")
        self.store.close_transient_execution(execution)
        self.store.close_transient_execution(execution)
        with self.assertRaisesRegex(ValueError, "not backed up"):
            self.store.retire_transient_files(execution)
        self.store.backup()
        retired = self.store.retire_transient_files(execution)
        self.assertEqual(retired["status"], "PARTIALLY_RETAINED")
        self.assertEqual({item["reason"] for item in retired["preserved"]}, {"changed", "unrecorded"})
        self.assertFalse(copied.exists())
        self.assertEqual(changed.read_bytes(), b"new unrecorded bytes")
        self.assertEqual(extra.read_bytes(), b"not execution-owned")
        pending = self.store.gc(now=datetime(2030, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertEqual(pending["blockedExecutionRevisions"], [execution["revisionId"]])
        # Explicit operator handling of the preserved test files finishes the
        # exception. The product must never delete these unowned/changed bytes.
        changed.unlink()
        extra.unlink()
        self.store.retire_transient_files(execution)
        result = self.store.gc(now=datetime(2030, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertIn(execution["revisionId"], result["expiredExecutionRevisions"])
        self.assertIn(snapshot["revisionId"], result["retiredOwnedArtifacts"])
        with self.assertRaisesRegex(ValueError, "Missing authoring revision"):
            self.store.get_revision(snapshot)
        self.store.backup()
        backup = RevisionWorkspace(self.repo, self.repo / "data/local/catalog-authoring/backups/latest.sqlite")
        self.assertEqual(backup.get_revision(durable), self.store.get_revision(durable))
        self.assertEqual(backup.stored_bytes({"snapshot": durable, "path": "meaningful.json", "sha256": digest(semantic.read_bytes())}), semantic.read_bytes())


    def test_live_dependency_keeps_terminal_transient_owner_for_later_gc(self):
        root = self.repo / ".workspace/lifetime/checkpoints"
        root.mkdir(parents=True)
        files = [root / name for name in ("needed.txt", "spent.txt")]
        for path in files:
            path.write_bytes(path.name.encode())
        execution = self.store.put_revision("execution", "private batch", {
            "schemaVersion": "authoring-transient-execution-v1", "disposableRoots": [self.store.key(root)]})
        receipts = [self.store.persist([path], "checkpoint", execution=execution)["snapshot"] for path in files]
        active = self.store.put_revision("active", "still needed", {"checkpoint": receipts[0]})
        self.store.close_transient_execution(execution)
        self.store.backup()
        result = self.store.retire_transient_files(execution)
        self.assertEqual(result["preserved"], [{"path": self.store.key(files[0]), "reason": "live-reference"}])
        self.assertTrue(files[0].exists())
        self.assertFalse(files[1].exists())
        gc = self.store.gc(now=datetime(2030, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertEqual(gc["blockedExecutionRevisions"], [execution["revisionId"]])
        self.assertEqual(gc["retiredOwnedArtifacts"], [])
        self.store.get_revision(execution)
        self.store.get_revision(receipts[0])
        self.store.get_revision(active)

    def test_cleanup_interruption_cannot_expire_its_recovery_metadata(self):
        root = self.repo / ".workspace/lifetime/checkpoints"
        root.mkdir(parents=True)
        path = root / "pair.bin"
        path.write_bytes(b"checkpoint bytes")
        execution = self.store.put_revision("execution", "private batch", {
            "schemaVersion": "authoring-transient-execution-v1", "disposableRoots": [self.store.key(root)]})
        snapshot = self.store.persist([root], "checkpoint", execution=execution, phase_boundary=True)["snapshot"]
        self.store.close_transient_execution(execution)
        self.store.backup()
        with patch.object(Path, "unlink", side_effect=PermissionError("checkpoint is open")):
            with self.assertRaisesRegex(PermissionError, "checkpoint is open"):
                self.store.retire_transient_files(execution)
        gc = self.store.gc(now=datetime(2030, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertEqual(gc["blockedExecutionRevisions"], [execution["revisionId"]])
        self.store.get_revision(snapshot)
        self.assertTrue(path.exists())
        self.assertEqual(self.store.retire_transient_files(execution)["status"], "RETIRED")
        gc = self.store.gc(now=datetime(2030, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertIn(snapshot["revisionId"], gc["retiredOwnedArtifacts"])


    def test_transient_ownership_failure_rolls_back_snapshot_and_head(self):
        root = self.repo / ".workspace/lifetime/checkpoints"
        root.mkdir(parents=True)
        (root / "pair.bin").write_bytes(b"checkpoint bytes")
        execution = self.store.put_revision("execution", "private batch", {
            "schemaVersion": "authoring-transient-execution-v1", "disposableRoots": [self.store.key(root)]})
        with patch.object(self.store, "_bind_execution_artifacts", side_effect=RuntimeError("ownership interrupted")):
            with self.assertRaisesRegex(RuntimeError, "ownership interrupted"):
                self.store.persist([root], "checkpoint", execution=execution)
        with closing(self.store.connect()) as db:
            self.assertEqual(db.execute("SELECT count(*) FROM revision WHERE kind='execution-artifact'").fetchone()[0], 0)
            self.assertEqual(db.execute("SELECT count(*) FROM head WHERE kind='execution-artifact'").fetchone()[0], 0)
            self.assertEqual(db.execute("SELECT count(*) FROM execution_artifact").fetchone()[0], 0)
        receipt = self.store.persist([root], "checkpoint", execution=execution)["snapshot"]
        self.assertEqual(self.store.persist([root], "checkpoint", execution=execution)["snapshot"], receipt)
        with closing(self.store.connect()) as db:
            self.assertEqual(db.execute("SELECT execution_id,artifact_id FROM execution_artifact").fetchall(),
                             [(execution["revisionId"], receipt["revisionId"])])

    def test_transient_expiry_starts_at_close_and_retry_does_not_extend_it(self):
        start, closed = "2026-01-01T00:00:00+00:00", "2026-06-01T00:00:00+00:00"
        execution = self.store.put_revision("execution", "long-running batch", {
            "schemaVersion": "authoring-transient-execution-v1", "startedAt": start,
            "disposableRoots": [".workspace/lifetime/checkpoints"]})
        original = self.store.get_revision(execution)
        with closing(self.store.connect(write=True)) as db, db:
            db.execute("UPDATE revision SET created_at=? WHERE id=?", (start, execution["revisionId"]))
        self.store.backup()
        with patch("catalog_revision_store.utc_now", return_value=closed):
            self.store.close_transient_execution(execution)
        with patch("catalog_revision_store.utc_now", return_value="2026-07-01T00:00:00+00:00"):
            self.store.close_transient_execution(execution)
        self.store.backup()
        for path in (self.store.database, self.repo / "data/local/catalog-authoring/backups/latest.sqlite"):
            with closing(sqlite3.connect(path)) as db:
                self.assertEqual(db.execute("SELECT terminal,created_at FROM revision WHERE id=?", (execution["revisionId"],)).fetchone(), (1, closed))
        self.assertEqual(self.store.get_revision(execution), original)
        self.assertEqual(self.store.gc(now=datetime(2026, 6, 7, tzinfo=timezone.utc))["expiredExecutionRevisions"], [])
        self.assertIn(execution["revisionId"], self.store.gc(now=datetime(2026, 6, 9, tzinfo=timezone.utc))["expiredExecutionRevisions"])


    def test_nested_prior_recovery_closure_restores_without_original_paths(self):
        artifacts = self.repo / "data/local/catalog-authoring/artifacts"
        prior = artifacts / "prior"
        chunk = prior / "authorized-evidence-panel-v1/input/chunks/chunk-01"
        chunk.mkdir(parents=True)
        epoch, scope, policy = (artifacts / name for name in ("recovery-epoch.json", "scope.jsonl", "policy.md"))
        scope.write_bytes(b"original incident membership\n")
        policy.write_bytes(b"original approved recovery policy\n")
        history = artifacts / "catalog-expansion-continuation-20260902/runs"
        originals = [history / "continuation-factor-233-publication-20260909-v1/catalog-expanded.candidate.sqlite",
                     history / "canonical-promotion-20260910-v2/before/data/source/catalog.sqlite"]
        for path in originals:
            path.parent.mkdir(parents=True)
            path.write_bytes(b"original incident database bytes")
        epoch.write_text(json.dumps({"schemaVersion": "factor-loss-recovery-epoch-v1",
            "epochId": "factor-003-recovery-20260909-v1", "scopePath": str(scope),
            "scopeSha256": digest(scope.read_bytes()), "policyPath": str(policy),
            "policySha256": digest(policy.read_bytes())}), encoding="utf-8")
        declaration = chunk / "recovery-declaration.json"
        baseline = artifacts / "superseded-basis"
        baseline.mkdir()
        baseline_db = baseline / "catalog-expanded.candidate.sqlite"
        baseline_db.write_bytes(b"frozen recovery target baseline bytes")
        baseline_manifest = baseline / "MANIFEST.sha256"
        baseline_manifest.write_text(f"{digest(baseline_db.read_bytes())}  {baseline_db.name}\n", encoding="ascii")
        input_lineage = chunk.parent.parent / "external-lineage.json"
        input_lineage.write_text(json.dumps({
            "baselineRoot": str(baseline), "baselineManifestSha256": digest(baseline_manifest.read_bytes()),
            "sourceInputBindings": {str(artifacts / "unneeded-original-research.json"): "0" * 64},
        }), encoding="utf-8")
        declaration.write_text(json.dumps({"schemaVersion": "factor-loss-recovery-v1",
            "epochPath": str(epoch), "epochSha256": digest(epoch.read_bytes()),
            "supersededAuthorityRoots": [str(baseline)]}), encoding="utf-8")
        unrelated = prior / "external-lineage.json"
        unrelated.write_text(json.dumps({"baselineRoot": str(artifacts / "unneeded-provenance")}), encoding="utf-8")
        manifest = prior / "MANIFEST.sha256"
        manifest.write_text("".join(f"{digest(path.read_bytes())}  {path.relative_to(prior).as_posix()}\n"
                                    for path in (declaration, input_lineage, unrelated)), encoding="ascii")
        frozen = artifacts / "frozen"
        frozen.mkdir()
        (frozen / "external-lineage.json").write_text(json.dumps({"baselineRoot": str(prior),
            "baselineManifestSha256": digest(manifest.read_bytes())}), encoding="utf-8")
        required = {self.store.key(path): path.read_bytes() for path in [epoch, scope, policy, baseline_db, baseline_manifest, *originals]}
        roots = authoring_inputs([frozen], self.store)
        receipt = self.store.save(roots, "nested prior recovery")
        self.assertTrue(set(required) <= set(self.store.get_revision(receipt)["members"]))
        # A bound epoch cannot silently change during the next capture.
        original_epoch = epoch.read_bytes()
        epoch.write_bytes(original_epoch + b" ")
        with self.assertRaisesRegex(ValueError, "differs from its frozen binding"):
            authoring_inputs([frozen], self.store)
        epoch.write_bytes(original_epoch)
        original_baseline = baseline_db.read_bytes()
        baseline_db.write_bytes(original_baseline + b" ")
        with self.assertRaisesRegex(ValueError, "differs from its frozen binding"):
            authoring_inputs([frozen], self.store)
        baseline_db.write_bytes(original_baseline)
        backup = self.store.backup()
        hidden = artifacts.with_name("hidden-original-artifacts")
        self.assertTrue(artifacts.resolve().is_relative_to(self.repo.resolve()))
        self.assertTrue(hidden.resolve().is_relative_to(self.repo.resolve()))
        artifacts.rename(hidden)
        restored = self.repo / "restored"
        RevisionWorkspace(self.repo, Path(backup["destination"])).restore(receipt["revisionId"], restored)
        for key, body in required.items():
            self.assertFalse((self.repo / key).exists())
            self.assertEqual((restored / key).read_bytes(), body)

    def test_content_noop_shared_bytes_and_changed_revision(self):
        first = self.store.save_bytes({"raw/a.txt": b"same", "raw/b.txt": b"same"}, "collection")
        self.assertEqual(self.store.save_bytes({"raw/a.txt": b"same", "raw/b.txt": b"same"}, "collection"), first)
        with closing(self.store.connect()) as db:
            self.assertEqual(db.execute("select count(*) from revision").fetchone()[0], 1)
            self.assertEqual(db.execute("select count(*) from blob").fetchone()[0], 2)
        changed = self.store.save_bytes({"raw/a.txt": b"changed", "raw/b.txt": b"same"}, "collection")
        self.assertNotEqual(changed["revisionId"], first["revisionId"])
        self.assertEqual(self.store.stored_bytes({"snapshot": first, "path": "raw/a.txt", "sha256": digest(b"same")}), b"same")
        result = subprocess.run([sys.executable, "-B", str(Path(__file__).with_name("catalog_workspace.py")),
                                 "--database", str(self.store.database), "verify"], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "STORAGE_VERIFIED")

    def test_backup_timing_includes_controls_and_separates_rotation_lock_wait(self):
        from contextlib import contextmanager
        import catalog_revision_store as revision_store
        import catalog_retention
        clock = [100.0]
        original_controls = catalog_retention.retain_recovery_controls
        original_lock = revision_store.exclusive_file

        def controls(store):
            result = original_controls(store)
            clock[0] += 7.0
            return result

        @contextmanager
        def measured_lock(path):
            with original_lock(path):
                clock[0] += 3.0
                yield

        with patch.object(revision_store, "perf_counter", side_effect=lambda: clock[0]), \
                patch.object(catalog_retention, "retain_recovery_controls", side_effect=controls), \
                patch.object(revision_store, "exclusive_file", side_effect=measured_lock):
            for mode in ("revision-generation", "reused"):
                result = self.store.backup()
                self.assertEqual(result["status"], "BACKED_UP")
                self.assertEqual(result["mode"], mode)
                self.assertEqual(result["timingsSeconds"]["controlsElapsed"], 10.0)
                self.assertEqual(result["timingsSeconds"]["lockWait"], 3.0)
                self.assertEqual(result["timingsSeconds"]["totalElapsed"], 13.0)

    def test_backup_retries_changed_recovery_control_scope(self):
        import catalog_retention
        transient = ValueError("Recovery control scope changed during backup preparation")
        head_race = ValueError("Authoring revision head advanced during preparation")
        with patch.object(catalog_retention, "retain_recovery_controls", side_effect=[transient, head_race, None]) as controls, \
                patch("catalog_revision_store.sleep") as wait:
            self.assertEqual(self.store.backup()["status"], "BACKED_UP")
            self.assertEqual(controls.call_count, 3)
            self.assertEqual(wait.call_count, 2)
        with patch.object(catalog_retention, "retain_recovery_controls", side_effect=ValueError("Corrupt recovery control")):
            with self.assertRaisesRegex(ValueError, "Corrupt recovery control"):
                self.store.backup()

    def test_backup_generation_and_corruption_are_not_receipt_flags(self):
        path = self.repo / "input.txt"
        path.write_bytes(b"retained evidence")
        receipt = self.store.save([path], "collection")
        self.store.verify_saved(receipt, [path])
        with self.assertRaises(FileNotFoundError):
            RevisionWorkspace(self.repo, self.repo / "data/local/catalog-authoring/backups/latest.sqlite").verify_saved(receipt, [path])
        backup = self.store.backup()
        copied = RevisionWorkspace(self.repo, Path(backup["destination"]))
        copied.verify_saved(receipt, [path])
        other = RevisionWorkspace.create(self.repo, self.repo / "data/local/catalog-authoring/another.sqlite")
        with self.assertRaisesRegex(ValueError, "generation"):
            other.get_revision(receipt)
        with closing(sqlite3.connect(copied.database)) as db, db:
            db.execute("update blob set content=x'00' where sha256=?", (digest(path.read_bytes()),))
        with self.assertRaises((ValueError, zlib.error)):
            copied.verify_saved(receipt, [path])

    def test_phase_backup_copies_new_revisions_and_noop_does_not_rotate(self):
        path = self.repo / "input.txt"
        path.write_bytes(b"first original")
        persisted = self.store.persist([path], "collection")
        self.assertEqual(persisted["status"], "PERSISTED")
        self.assertFalse((self.repo / "data/local/catalog-authoring/backups/latest.sqlite").exists())
        first = self.store.persist([path], "collection", phase_boundary=True)
        path.write_bytes(b"second original")
        changed = self.store.persist([path], "collection", phase_boundary=True)
        self.assertEqual(changed["backup"]["mode"], "revision-incremental")
        backup = RevisionWorkspace(self.repo, Path(changed["backup"]["destination"]))
        self.assertEqual(backup.stored_bytes({"snapshot": first["snapshot"], "path": "input.txt", "sha256": digest(b"first original")}), b"first original")
        stat = backup.database.stat()
        noop = self.store.persist([path], "collection", phase_boundary=True)
        self.assertEqual(noop["snapshot"], changed["snapshot"])
        self.assertEqual(noop["backup"]["mode"], "reused")
        self.assertEqual(backup.database.stat().st_mtime_ns, stat.st_mtime_ns)
        with closing(sqlite3.connect(backup.database)) as db, db:
            db.execute("update blob set content=x'00' where sha256=?", (digest(path.read_bytes()),))
        with self.assertRaises((ValueError, zlib.error)):
            self.store.persist([path], "collection", phase_boundary=True)

    def test_gc_never_expires_curation_or_unresolved_execution(self):
        raw = self.store.save_bytes({"source.txt": b"original source"}, "source")
        members = self.store.get_revision(raw)["members"]
        old = self.store.put_revision("curation", "work-a", {"value": "2"}, members)
        current = self.store.put_revision("curation", "work-a", {"value": "4"}, members)
        failed = self.store.put_revision("execution", "failed", {"error": "unresolved"})
        done = self.store.put_revision("execution", "done", {"status": "PASS"}, terminal=True)
        pinned = self.store.put_revision("execution", "pin", {"status": "PASS"}, terminal=True, pinned=True)
        now = datetime.now(timezone.utc) + timedelta(days=9)
        preview = self.store.gc(now=now)
        self.assertEqual(preview["expiredExecutionRevisions"], [done["revisionId"]])
        self.store.gc(now=now, apply=True)
        for receipt in (old, current, failed, pinned):
            self.store.get_revision(receipt)
        self.assertEqual(self.store.verify()["status"], "STORAGE_VERIFIED")

    def test_noop_does_not_acquire_a_writer_or_advance_the_change_cursor(self):
        first = self.store.save_bytes({"input.txt": b"same"}, "collection")
        with closing(self.store.connect()) as db:
            cursor = db.execute("SELECT max(seq) FROM change_log").fetchone()[0]
        original = self.store.connect

        def readonly_only(*, write=False):
            self.assertFalse(write, "A content no-op must not queue behind another writer")
            return original()

        with patch.object(self.store, "connect", side_effect=readonly_only):
            self.assertEqual(self.store.save_bytes({"input.txt": b"same"}, "collection"), first)
        with closing(self.store.connect()) as db:
            self.assertEqual(db.execute("SELECT max(seq) FROM change_log").fetchone()[0], cursor)

    def test_file_preparation_does_not_hold_the_writer_and_mutation_is_rejected(self):
        path = self.repo / "input.txt"
        path.write_bytes(b"original")
        compress = zlib.compress
        checked = []

        def change_during_preparation(body, level):
            if not checked:
                with closing(sqlite3.connect(self.store.database, timeout=0)) as other, other:
                    other.execute("BEGIN IMMEDIATE")
                    other.execute("INSERT INTO store_meta VALUES ('parallel-proof','committed')")
                checked.append(True)
                path.write_bytes(b"changed during preparation")
            return compress(body, level)

        with patch("catalog_revision_store.zlib.compress", side_effect=change_during_preparation):
            with self.assertRaisesRegex(ValueError, "changed"):
                self.store.save([path], "collection")
        self.assertEqual(checked, [True])
        with closing(self.store.connect()) as db:
            self.assertEqual(db.execute("SELECT count(*) FROM revision").fetchone()[0], 0)

    def test_incremental_backup_updates_in_place_and_only_copies_the_delta(self):
        self.store.save_bytes({"large.bin": os.urandom(1024 * 1024)}, "large")
        initial = self.store.backup()
        latest = Path(initial["destination"])
        before = latest.stat()
        tiny = self.store.save_bytes({"small.txt": b"new evidence"}, "small")
        with patch.object(self.store, "_initial_backup", side_effect=AssertionError("Unexpected full copy")):
            changed = self.store.backup()
        self.assertEqual(changed["mode"], "revision-incremental")
        self.assertEqual(latest.stat().st_ino, before.st_ino)
        self.assertLess(changed["verification"]["copiedBytes"], 4096)
        copied = RevisionWorkspace(self.repo, latest)
        self.assertEqual(copied.get_revision(tiny), self.store.get_revision(tiny))
        with closing(self.store.connect()) as source, closing(copied.connect()) as target:
            for query in ("SELECT * FROM revision ORDER BY id", "SELECT * FROM head ORDER BY kind,subject", "SELECT * FROM change_log ORDER BY seq"):
                self.assertEqual(source.execute(query).fetchall(), target.execute(query).fetchall())

    def test_failed_delta_rolls_back_latest_and_its_cursor_then_retries(self):
        self.store.save_bytes({"old.txt": b"old"}, "old")
        initial = self.store.backup()
        new = self.store.save_bytes({"new.txt": b"new"}, "new")
        latest = RevisionWorkspace(self.repo, Path(initial["destination"]))
        capture = self.store._capture_delta

        def corrupt_delta(source, cursor, watermark, spool):
            delta = capture(source, cursor, watermark, spool)
            spool.seek(0)
            spool.write(b"bad")
            return delta

        with patch.object(self.store, "_capture_delta", side_effect=corrupt_delta):
            with self.assertRaises((ValueError, zlib.error)):
                self.store.backup()
        with closing(latest.connect()) as db:
            self.assertEqual(int(db.execute("SELECT value FROM store_meta WHERE key='backup_cursor'").fetchone()[0]), initial["cursor"])
            self.assertIsNone(db.execute("SELECT 1 FROM revision WHERE id=?", (new["revisionId"],)).fetchone())
        self.store.backup()
        self.assertEqual(latest.get_revision(new), self.store.get_revision(new))

    def test_source_writer_finishes_while_delta_is_waiting_for_backup_application(self):
        self.store.save_bytes({"old.txt": b"old"}, "old")
        self.store.backup()
        self.store.save_bytes({"new.txt": b"new"}, "new")
        entered, release, errors = threading.Event(), threading.Event(), []
        apply = self.store._apply_delta

        def delayed(*args):
            entered.set()
            if not release.wait(5):
                raise TimeoutError("Test backup application did not resume")
            return apply(*args)

        def backup():
            try:
                self.store.backup()
            except BaseException as error:
                errors.append(error)

        with patch.object(self.store, "_apply_delta", side_effect=delayed):
            thread = threading.Thread(target=backup)
            thread.start()
            try:
                self.assertTrue(entered.wait(5))
                # DELETE mode intentionally proves the source read transaction was closed.
                with closing(sqlite3.connect(self.store.database, timeout=0.1)) as db, db:
                    db.execute("BEGIN IMMEDIATE")
                    db.execute("INSERT INTO store_meta VALUES ('during-backup','committed')")
            finally:
                release.set()
                thread.join(5)
        self.assertFalse(thread.is_alive())
        self.assertEqual(errors, [])

    def test_bulk_verification_deduplicates_each_view_but_not_source_and_backup(self):
        paths = [self.repo / name for name in ("a.txt", "b.txt")]
        for path in paths:
            path.write_bytes(b"shared evidence")
        self.store.persist(paths, "collection", phase_boundary=True)
        counts = {}
        read = Workspace.read_blob

        def counted(db, sha):
            filename = db.execute("PRAGMA database_list").fetchone()[2]
            counts[filename, sha] = counts.get((filename, sha), 0) + 1
            return read(db, sha)

        with patch.object(RevisionWorkspace, "read_blob", staticmethod(counted)):
            with self.store.verification_context(paths, backup=True) as verification:
                groups, missing = verification.saved_files(paths)
                self.assertEqual(missing, [])
                for receipt, members in groups:
                    verification.verify_saved(receipt, members)
        self.assertTrue(counts)
        self.assertEqual(set(counts.values()), {1})
        self.assertEqual(len({name for name, _ in counts}), 2)
        latest = self.repo / "data/local/catalog-authoring/backups/latest.sqlite"
        with closing(sqlite3.connect(latest)) as db, db:
            db.execute("UPDATE blob SET content=x'00' WHERE sha256=?", (digest(b"shared evidence"),))
        with self.assertRaises((ValueError, zlib.error)):
            with self.store.verification_context(paths, backup=True) as verification:
                verification.saved_files(paths)

    def test_v3_migration_is_explicit_and_preserves_generation_receipts_and_bytes(self):
        path = self.repo / "legacy.sqlite"
        generation = "old-generation"
        raw = b"original evidence"
        payload = encoded({"payload": {"label": "original"}, "members": {"raw.txt": digest(raw)}})
        with closing(sqlite3.connect(path)) as db, db:
            db.executescript(SCHEMA + f"PRAGMA application_id={APPLICATION_ID};PRAGMA user_version=3;")
            db.execute("INSERT INTO store_meta VALUES ('generation',?)", (generation,))
            db.execute("INSERT INTO store_meta VALUES ('policy','curation-evidence-active-v1')")
            for body in (raw, payload):
                db.execute("INSERT INTO blob VALUES (?,?,?)", (digest(body), len(body), zlib.compress(body)))
            db.execute("INSERT INTO revision VALUES ('original','artifact','original',?,NULL,'2026-01-01',0,0)", (digest(payload),))
            db.execute("INSERT INTO head VALUES ('artifact','original','original')")
            db.execute("INSERT INTO revision_blob VALUES ('original','raw.txt',?)", (digest(raw),))
        old = Workspace(self.repo, path)
        with closing(old.connect()) as db:
            receipt = old._receipt(db, "original")
        self.assertEqual(receipt["schemaVersion"], FORMAT)
        with self.assertRaisesRegex(ValueError, "read-only"):
            old.save_bytes({"new.txt": b"new"}, "new")
        migration = old.upgrade_v4()
        self.assertEqual(migration["generation"], generation)
        self.assertEqual(old.stored_bytes({"snapshot": receipt, "path": "raw.txt", "sha256": digest(raw)}), raw)
        with closing(old.connect()) as db:
            self.assertEqual(db.execute("PRAGMA user_version").fetchone()[0], 4)
            self.assertEqual(old._receipt(db, "original"), receipt)

    def test_wal_is_gated_and_supported_runtime_allows_a_writer_during_bulk_read(self):
        self.assertFalse(wal_runtime_supported((3, 49, 1)))
        self.assertFalse(wal_runtime_supported((3, 51, 2)))
        self.assertTrue(wal_runtime_supported((3, 51, 3)))
        self.assertTrue(wal_runtime_supported((3, 53, 4)))
        with patch("catalog_revision_store.wal_runtime_supported", return_value=False):
            with self.assertRaisesRegex(ValueError, "WAL-reset"):
                self.store.upgrade_v4(enable_wal=True)
        if not wal_runtime_supported():
            return
        self.store.upgrade_v4(enable_wal=True)
        path = self.repo / "raw.txt"
        path.write_bytes(b"original")
        receipt = self.store.save([path], "original")
        with self.store.verification_context([path]) as verification:
            verification.verify_saved(receipt, [path])
            RevisionWorkspace(self.repo, self.store.database).save_bytes({"concurrent.txt": b"other worker"}, "parallel")

    def test_gc_ownership_keeps_dependencies_and_current_heads(self):
        original = self.store.save_bytes({"result.json": b"old"}, "result")
        owner = self.store.put_revision("execution", "first", {"status": "PASS"}, terminal=True)
        self.store.own_execution_artifacts(owner, [original])
        self.store.save_bytes({"result.json": b"new"}, "result")
        protected = self.store.put_revision("active", "ready", {"source": original})
        now = datetime.now(timezone.utc) + timedelta(days=9)
        self.store.gc(now=now, apply=True)
        self.store.get_revision(original)
        self.store.get_revision(protected)
        expiring = self.store.save_bytes({"scratch.txt": b"old"}, "scratch")
        self.store.save_bytes({"scratch.txt": b"new"}, "scratch")
        owner = self.store.put_revision("execution", "second", {"status": "PASS"}, terminal=True)
        self.store.own_execution_artifacts(owner, [expiring])
        result = self.store.gc(now=now, apply=True)
        self.assertEqual(result["retiredOwnedArtifacts"], [expiring["revisionId"]])
        self.store.backup()
        self.assertEqual(self.store.verify()["status"], "STORAGE_VERIFIED")

    def test_six_processes_preserve_all_commits_and_phase_backups(self):
        if wal_runtime_supported():
            self.store.upgrade_v4(enable_wal=True)
        self.store.backup()
        code = """import sys
from pathlib import Path
from catalog_revision_store import RevisionWorkspace
repo=Path(sys.argv[1]); name=sys.argv[2]
store=RevisionWorkspace(repo,repo/'data/local/catalog-authoring/workspace.sqlite')
store.save_bytes({name+'.txt': (name*1000).encode()},name)
store.backup()
"""
        processes = [subprocess.Popen([sys.executable, "-B", "-c", code, str(self.repo), f"worker-{number}"],
                                      cwd=Path(__file__).parent, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                     for number in range(6)]
        try:
            for process in processes:
                stdout, stderr = process.communicate(timeout=15)
                self.assertEqual(process.returncode, 0, stdout + stderr)
        finally:
            for process in processes:
                if process.poll() is None:
                    process.kill()
                    process.communicate()
        saved = RevisionWorkspace(self.repo, self.repo / "data/local/catalog-authoring/backups/latest.sqlite")
        with closing(self.store.connect()) as source, closing(saved.connect()) as backup:
            rows = source.execute("SELECT * FROM revision ORDER BY id").fetchall()
            self.assertEqual(len(rows), 6)
            self.assertEqual(backup.execute("SELECT * FROM revision ORDER BY id").fetchall(), rows)
        self.assertEqual(saved.verify()["status"], "STORAGE_VERIFIED")

    def test_process_death_during_delta_recovers_last_backup_and_replays(self):
        old = self.store.save_bytes({"old.txt": b"retained original"}, "old")
        initial = self.store.backup()
        new = self.store.save_bytes({"new.txt": b"new original"}, "new")
        code = """import os,sys
from pathlib import Path
from catalog_revision_store import RevisionWorkspace
repo=Path(sys.argv[1]); store=RevisionWorkspace(repo,repo/'data/local/catalog-authoring/workspace.sqlite')
def killed(target, delta, spool, cursor, watermark):
 target.execute('BEGIN IMMEDIATE')
 target.execute("DELETE FROM head")
 target.execute("UPDATE store_meta SET value='999999' WHERE key='backup_cursor'")
 os._exit(77)
store._apply_delta=killed
store.backup()
"""
        killed = subprocess.run([sys.executable, "-B", "-c", code, str(self.repo)], cwd=Path(__file__).parent,
                                capture_output=True, text=True, timeout=10)
        self.assertEqual(killed.returncode, 77, killed.stderr)
        repaired = self.store.backup()
        self.assertEqual(repaired["mode"], "revision-incremental")
        backup = RevisionWorkspace(self.repo, Path(initial["destination"]))
        for receipt in (old, new):
            self.assertEqual(backup.get_revision(receipt), self.store.get_revision(receipt))

    def test_divergent_backup_is_preserved_and_rejected(self):
        self.store.save_bytes({"old.txt": b"old"}, "old")
        first = self.store.backup()
        latest = RevisionWorkspace(self.repo, Path(first["destination"]))
        unrelated = latest.save_bytes({"backup-only.txt": b"unrelated"}, "unrelated")
        self.store.save_bytes({"new.txt": b"new"}, "new")
        with self.assertRaisesRegex(ValueError, "advanced outside"):
            self.store.backup()
        latest.get_revision(unrelated)

    def test_legacy_execution_referenced_by_pinned_payload_survives_migration_gc(self):
        path = self.repo / "legacy-gc.sqlite"
        execution = encoded({"payload": {"status": "PASS"}, "members": {}})
        receipt = {"schemaVersion": FORMAT, "generation": "legacy", "revisionId": "execution",
                   "payloadSha256": digest(execution), "files": 0, "database": str(path)}
        owner = encoded({"payload": {"retained": receipt}, "members": {}})
        with closing(sqlite3.connect(path)) as db, db:
            db.executescript(SCHEMA + f"PRAGMA application_id={APPLICATION_ID};PRAGMA user_version=3;")
            db.execute("INSERT INTO store_meta VALUES ('generation','legacy')")
            for body in (execution, owner):
                db.execute("INSERT INTO blob VALUES (?,?,?)", (digest(body), len(body), zlib.compress(body)))
            db.execute("INSERT INTO revision VALUES ('execution','execution','done',?,NULL,'2026-01-01',1,0)", (digest(execution),))
            db.execute("INSERT INTO revision VALUES ('owner','active','ready',?,NULL,'2026-01-01',0,1)", (digest(owner),))
            db.executemany("INSERT INTO head VALUES (?,?,?)", [("execution", "done", "execution"), ("active", "ready", "owner")])
        legacy = RevisionWorkspace(self.repo, path)
        legacy.upgrade_v4()
        result = legacy.gc(now=datetime(2030, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertEqual(result["expiredExecutionRevisions"], [])
        self.assertEqual(legacy.get_revision(receipt)["payload"], {"status": "PASS"})

    def test_large_file_set_uses_bounded_preparation_memory(self):
        root = self.repo / "large-input"
        root.mkdir()
        for number in range(12):
            (root / f"part-{number}.bin").write_bytes(os.urandom(4 * 1024 * 1024))
        tracemalloc.start()
        try:
            receipt = self.store.save([root], "large-closure")
            _, peak = tracemalloc.get_traced_memory()
        finally:
            tracemalloc.stop()
        # The previous implementation retained all raw+compressed files (>96 MB).
        self.assertLess(peak, 72 * 1024 * 1024)
        self.store.verify_saved(receipt, [root])

    def test_canonical_completion_survives_gc_and_is_backed_up(self):
        completed = self.store.put_revision("canonical-completion", "batch-sha", {"status": "APPLIED"})
        self.store.gc(now=datetime.now(timezone.utc) + timedelta(days=9), apply=True)
        copied = self.store.backup()
        backup = RevisionWorkspace(self.repo, Path(copied["destination"]))
        self.assertEqual(backup.current_revision("canonical-completion", "batch-sha")["revisionId"], completed["revisionId"])

    def test_retained_dependency_closure_skips_old_walks_and_native_restore_resolves_it(self):
        prior, ancestor, origin, irrelevant, current = [self.repo / name for name in ("prior", "ancestor", "origin", "irrelevant", "current")]
        for root in (prior, ancestor, origin, irrelevant, current):
            root.mkdir()
        (origin / "original.txt").write_bytes(b"original primary evidence")
        (irrelevant / "unused.txt").write_bytes(b"historical provenance is not prior authority")

        def seal(root):
            manifest = "".join(f"{digest(path.read_bytes())}  {path.name}\n" for path in sorted(root.iterdir()))
            (root / "MANIFEST.sha256").write_bytes(manifest.encode("ascii"))
            self.store.save([root], "retained:" + root.name)
            return digest(manifest.encode("ascii"))

        origin_sha, irrelevant_sha = seal(origin), seal(irrelevant)
        (ancestor / "external-prior-authority.json").write_text(json.dumps({"bundles": [{"root": str(origin), "manifestSha256": origin_sha}]}), encoding="utf-8")
        ancestor_sha = seal(ancestor)
        (prior / "external-prior-authority.json").write_text(json.dumps({"bundles": [{"root": str(ancestor), "manifestSha256": ancestor_sha}]}), encoding="utf-8")
        (prior / "external-lineage.json").write_text(json.dumps({"baselineRoot": str(irrelevant), "baselineManifestSha256": irrelevant_sha,
            "registryPath": str(irrelevant / "historical.sqlite"), "sourceInputBindings": {str(irrelevant / "unused.txt"): digest((irrelevant / "unused.txt").read_bytes())}}), encoding="utf-8")
        prior_sha = seal(prior)
        (current / "external-lineage.json").write_text(json.dumps({"baselineRoot": str(prior), "baselineManifestSha256": prior_sha,
            "registryPath": str(prior / "catalog-source-registry.candidate.sqlite")}), encoding="utf-8")
        calls, original_files = [], self.store.files

        def bounded(roots):
            calls.extend(roots)
            self.assertFalse(any(root in (prior, ancestor, origin, irrelevant) for root in roots), "Saved authority trees must not be walked again")
            return original_files(roots)

        references = []
        with patch.object(self.store, "files", side_effect=bounded):
            roots = authoring_inputs([current], self.store, retained=references)
        self.assertEqual(roots, [current])
        self.assertEqual(calls, [current])
        members = {path: sha for reference in references for path, sha in reference["members"].items()}
        self.assertEqual(members["prior/MANIFEST.sha256"], prior_sha)
        self.assertEqual(members["ancestor/MANIFEST.sha256"], ancestor_sha)
        self.assertEqual(members["origin/MANIFEST.sha256"], origin_sha)
        self.assertNotIn("irrelevant/unused.txt", members)
        self.assertNotIn("irrelevant/MANIFEST.sha256", members)
        publication = self.repo / "publication"
        publication.mkdir()
        (publication / "COMPACT-PUBLICATION.json").write_text(json.dumps({"schemaVersion": "catalog-compact-publication-v2", "dependencies": references, "sources": {}}), encoding="utf-8")
        saved = self.store.save([publication], "publication")
        copied = self.store.backup()
        for root in (prior, ancestor, origin, irrelevant):
            root.rename(self.repo / ("unavailable-" + root.name))
        restored = self.repo / "restored"
        RevisionWorkspace(self.repo, Path(copied["destination"])).restore(saved["revisionId"], restored)
        self.assertFalse((restored / "irrelevant").exists())
        code = """import json,sys
from pathlib import Path
from workspace_paths import artifact_path
from catalog_authoring.publish_factor_batch import _verify_result_manifest
restored=Path(sys.argv[1]); original=Path(sys.argv[2])
prior=artifact_path(original,restored)
_verify_result_manifest(prior)
ancestor=artifact_path(json.loads((prior/'external-prior-authority.json').read_text())['bundles'][0]['root'],restored)
_verify_result_manifest(ancestor)
origin=artifact_path(json.loads((ancestor/'external-prior-authority.json').read_text())['bundles'][0]['root'],restored)
_verify_result_manifest(origin)
assert (origin/'original.txt').read_bytes()==b'original primary evidence'
assert not artifact_path(json.loads((prior/'external-lineage.json').read_text())['baselineRoot'],restored).exists()
"""
        native = subprocess.run([sys.executable, "-B", "-c", code, str(restored), str(prior)], cwd=Path(__file__).parent,
                                capture_output=True, text=True, timeout=10)
        self.assertEqual(native.returncode, 0, native.stdout + native.stderr)

    def test_compact_declared_dependencies_keep_old_path_versions_on_restore(self):
        old_body = b"original policy and canonical"
        new_body = b"current policy and canonical"
        old = self.store.save_bytes({"data/source/catalog.sqlite": old_body, "docs/policy.md": old_body}, "before")
        self.store.save_bytes({"data/source/catalog.sqlite": new_body, "docs/policy.md": new_body}, "after")
        for name in ("data/source/catalog.sqlite", "docs/policy.md"):
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(new_body)
        prior = self.repo / "prior-compact"
        prior.mkdir()
        declared = {"snapshot": old, "members": {"data/source/catalog.sqlite": digest(old_body), "docs/policy.md": digest(old_body)}}
        source = {"snapshot": old, "path": "data/source/catalog.sqlite", "sha256": digest(old_body)}
        body = encoded({"schemaVersion": "catalog-compact-publication-v2", "dependencies": [declared], "sources": {"canonical": source}, "works": []})
        (prior / "COMPACT-PUBLICATION.json").write_bytes(body)
        (prior / "MANIFEST.sha256").write_bytes((digest(body) + "  COMPACT-PUBLICATION.json\n").encode())
        self.store.save([prior], "prior-publication")
        current = self.repo / "current"
        current.mkdir()
        (current / "external-prior-authority.json").write_bytes(encoded({"bundles": [{"root": str(prior), "manifestSha256": digest((prior / "MANIFEST.sha256").read_bytes())}]}))
        references = []
        authoring_inputs([current], self.store, retained=references)
        old_refs = [reference for reference in references if reference["snapshot"] == old]
        self.assertEqual(len(old_refs), 1)
        self.assertEqual(old_refs[0]["members"], declared["members"])
        metadata = encoded({"schemaVersion": "catalog-compact-publication-v2", "dependencies": references, "sources": {"canonical": source}})
        publication = self.store.save_bytes({"publication/COMPACT-PUBLICATION.json": metadata,
            "data/source/catalog.sqlite": new_body, "docs/policy.md": new_body}, "complete-publication")
        restored = self.repo / "restored-versions-check"
        self.store.restore(publication["revisionId"], restored)
        for name in declared["members"]:
            actual = (restored / name).read_bytes()
            alternate = restored / "data/local/catalog-authoring/restored-versions" / digest(new_body if actual == old_body else old_body)
            self.assertIn(actual, (old_body, new_body))
            self.assertEqual({actual, alternate.read_bytes()}, {old_body, new_body})
        code = """import json,sys
from pathlib import Path
import compact_publication
compact_publication.REPO=Path(sys.argv[1])
reference=json.loads(sys.argv[2])
assert compact_publication.read_stored_file(reference)==b'original policy and canonical'
"""
        native = subprocess.run([sys.executable, "-B", "-c", code, str(restored), json.dumps(source)], cwd=Path(__file__).parent,
                                capture_output=True, text=True, timeout=10)
        self.assertEqual(native.returncode, 0, native.stdout + native.stderr)

    def test_prior_manifest_binding_is_checked_even_when_bytes_are_retained(self):
        prior = self.repo / "prior"
        prior.mkdir()
        (prior / "raw.txt").write_bytes(b"evidence")
        (prior / "MANIFEST.sha256").write_bytes((digest(b"evidence") + "  raw.txt\n").encode())
        self.store.save([prior], "prior")
        current = self.repo / "current"
        current.mkdir()
        (current / "external-lineage.json").write_bytes(encoded({"baselineRoot": str(prior), "baselineManifestSha256": "0" * 64}))
        with self.assertRaisesRegex(ValueError, "frozen binding"):
            authoring_inputs([current], self.store, retained=[])

    def test_dependency_walk_reuses_overlapping_directory_inventory(self):
        parent = self.repo / "inputs"
        child = parent / "child"
        child.mkdir(parents=True)
        (child / "raw.txt").write_bytes(b"source")
        original, calls = self.store.files, []

        def counted(roots):
            calls.extend(roots)
            return original(roots)

        with patch.object(self.store, "files", side_effect=counted):
            roots = authoring_inputs([child, parent], self.store)
        self.assertEqual(roots, [parent])
        self.assertEqual(calls, [parent])

    def test_failure_report_keeps_missing_receipt_bytes_without_granting_authority(self):
        with closing(self.store.connect()):
            pass
        missing = {"schemaVersion": FORMAT, "generation": self.store._generation,
                   "revisionId": "unavailable", "payloadSha256": "0" * 64, "files": 0}
        body = encoded({"error": "missing original revision", "source": missing})
        saved = self.store.save_bytes({"failure.json": body}, "unresolved-failure")
        self.assertEqual(self.store.stored_bytes({"snapshot": saved, "path": "failure.json", "sha256": digest(body)}), body)
        with self.assertRaisesRegex(ValueError, "Missing authoring revision"):
            self.store.get_revision(missing)

    def _frozen_recording_inputs(self):
        canonical = self.repo / "data/source/catalog.sqlite"
        canonical.parent.mkdir(parents=True)
        with closing(sqlite3.connect(canonical)) as db, db:
            db.execute("CREATE TABLE source_works(id TEXT PRIMARY KEY,title TEXT)")
            db.execute("INSERT INTO source_works VALUES ('work-a','original')")
        global_files = {"data/staging/catalog-expansion/gold-set-manifest.json": b'{"gold":["work-a"]}',
                        "overlay/data/staging/catalog-expansion/v4-final/alias-resolution.csv": b"alias,workId\na,work-a\n",
                        "docs/catalog-expansion/factor-panel-request.md": b"original panel request"}
        global_files.update({source: ("original " + key).encode() for key, (source, _) in FROZEN_POLICIES.items()})
        for name, body in global_files.items():
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(body)
        script = self.repo / "scripts/catalog_authoring/prepare_factor_batch.py"
        script.parent.mkdir(parents=True)
        # A real child process exercises the storage boundary; semantic panel
        # validation belongs to the existing preparation integration tests.
        script.write_text("""import hashlib,json,shutil,sqlite3,sys
from pathlib import Path
repo=Path(sys.argv[2]); output=Path(sys.argv[3]); root=output/'panel-input'
root.mkdir(parents=True)
if '--change-canonical' in sys.argv:
 with sqlite3.connect(repo/'data/source/catalog.sqlite') as db:
  db.execute("INSERT INTO source_works VALUES ('concurrent','changed')")
policies=json.loads(sys.argv[4])
hashfile=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for source,name in policies.values():
 target=root/'contracts'/name
 target.parent.mkdir(exist_ok=True)
 shutil.copyfile(repo/source,target)
shutil.copyfile(repo/'docs/catalog-expansion/factor-panel-request.md',root/'PANEL-REQUEST.md')
meta={'canonicalSha256':hashfile(repo/'data/source/catalog.sqlite'),
      'goldManifestSha256':hashfile(repo/'data/staging/catalog-expansion/gold-set-manifest.json'),
      'policyDigests':{key:hashfile(root/'contracts'/name) for key,(_,name) in policies.items()}}
(root/'panel-input.json').write_text(json.dumps(meta))
rows=[hashfile(p)+'  '+p.relative_to(root).as_posix() for p in sorted(root.rglob('*')) if p.is_file()]
(root/'PANEL-INPUT.sha256').write_bytes(('\\n'.join(rows)+'\\n').encode())
(output/'INPUT-PREPARATION-REPORT.json').write_text(json.dumps({'status':'PASS'}))
print('frozen result')
""", encoding="utf-8")
        inputs = authoring_inputs([script], self.store)
        self.assertNotIn(script, inputs)
        for name in ("data/source/catalog.sqlite", *global_files):
            self.assertIn(self.repo / name, inputs)
        return script, inputs, canonical, global_files

    def test_successful_freeze_pins_exact_canonical_gold_alias_and_policies_across_gc(self):
        script, inputs, canonical, global_files = self._frozen_recording_inputs()
        originals = {self.store.key(path): path.read_bytes() for path in inputs}
        output = self.repo / "run/frozen"
        receipt = {}
        command = [sys.executable, "-B", str(script), "freeze", str(self.repo), str(output), json.dumps(FROZEN_POLICIES)]
        self.assertEqual(recorded_run(command, inputs, [output], "single-pass:freeze", self.store, receipt_out=receipt), 0)
        pin = receipt["frozenDependencies"][0]
        before_manifest = (output / "panel-input/PANEL-INPUT.sha256").read_bytes()
        original_sha = digest(originals["data/source/catalog.sqlite"])
        with closing(sqlite3.connect(canonical)) as db, db:
            db.execute("UPDATE source_works SET title='new canonical'")
        for name in global_files:
            (self.repo / name).write_bytes(b"later version")
        self.store.gc(now=datetime.now(timezone.utc) + timedelta(days=9), apply=True)
        backup = RevisionWorkspace(self.repo, Path(self.store.backup()["destination"]))
        for store in (self.store, backup):
            value = store.get_revision(pin)
            for name, body in originals.items():
                self.assertEqual(value["members"][name], digest(body))
                self.assertEqual(store.stored_bytes({"snapshot": pin, "path": name, "sha256": digest(body)}), body)
            reference = store.file_reference(canonical, original_sha)
            with closing(sqlite3.connect(":memory:")) as db:
                db.deserialize(store.stored_bytes(reference))
                self.assertEqual(db.execute("SELECT title FROM source_works").fetchone()[0], "original")
        self.assertEqual((output / "panel-input/PANEL-INPUT.sha256").read_bytes(), before_manifest)

    def test_mismatched_freeze_retains_failed_provenance_and_never_pins_success(self):
        script, inputs, _, _ = self._frozen_recording_inputs()
        output = self.repo / "run/frozen"
        command = [sys.executable, "-B", str(script), "freeze", str(self.repo), str(output), json.dumps(FROZEN_POLICIES), "--change-canonical"]
        with self.assertRaisesRegex(ValueError, "matching exact captured original"):
            recorded_run(command, inputs, [output], "single-pass:freeze", self.store)
        with closing(self.store.connect()) as db:
            self.assertEqual(db.execute("SELECT count(*) FROM head WHERE kind='active'").fetchone()[0], 0)
            row = db.execute("SELECT id,terminal FROM revision WHERE kind='execution'").fetchone()
            self.assertEqual(row[1], 0)
            execution = self.store._receipt(db, row[0])
        result = self.store.gc(now=datetime.now(timezone.utc) + timedelta(days=9), apply=True)
        self.assertNotIn(execution["revisionId"], result["expiredExecutionRevisions"])
        value = self.store.get_revision(execution)
        command_path = next(path for path in value["members"] if path.endswith("/command.json"))
        body = self.store.stored_bytes({"snapshot": execution, "path": command_path, "sha256": value["members"][command_path]})
        self.assertEqual(json.loads(body)["status"], "OUTPUT_SAVE_FAILED")


if __name__ == "__main__":
    unittest.main()
