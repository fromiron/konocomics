"""Run with: python scripts/test_catalog_workspace.py (stdlib only)."""
import json
import os
import sqlite3
import subprocess
import sys
import tempfile
import unittest
import zlib
from unittest.mock import patch
from contextlib import closing
from pathlib import Path

from catalog_workspace import Workspace, authoring_inputs, key_path, recorded_run
from workspace_paths import artifact_path


class WorkspaceTest(unittest.TestCase):
    def test_relocated_snapshot_reads_original_keys_without_links(self):
        repo = self.root / "moved-repo"
        old = repo / ".workspace/catalog-expansion-continuation-20260902"
        old.mkdir(parents=True)
        (old / "original.txt").write_bytes(b"frozen original")
        store = Workspace(repo)
        receipt = store.save([old], "before relocation")
        destination = repo / "data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902"
        destination.parent.mkdir(parents=True)
        old.rename(destination)
        self.assertFalse(old.exists())
        self.assertFalse(old.is_symlink() or old.is_junction())
        self.assertEqual(artifact_path(old / "original.txt", repo), destination / "original.txt")
        store.verify_saved(receipt, [destination])
        with self.assertRaises(ValueError):
            store.save([destination.parent], "must not capture entire archive")
        (destination / "original.txt").write_bytes(b"changed")
        with self.assertRaisesRegex(ValueError, "differ"):
            store.verify_saved(receipt, [destination])
        (destination / "original.txt").unlink()
        destination.rmdir()
        store.checkout(receipt["snapshotId"], ".workspace/catalog-expansion-continuation-20260902")
        self.assertEqual((destination / "original.txt").read_bytes(), b"frozen original")
        self.assertFalse(old.exists())
        outside = self.root / "other/.workspace/job/original.txt"
        self.assertEqual(artifact_path(outside, repo), outside)

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="catalog-workspace-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.repo = self.root / "repo"
        self.repo.mkdir()
        self.inputs = self.repo / "data/local/catalog-authoring/artifacts/job"
        self.inputs.mkdir(parents=True)
        self.file = self.inputs / "原文.jsonl"
        self.file.write_bytes('音\r\n{"value":"unknown"}\n'.encode())
        self.workspace = Workspace(self.repo)
        for directory in (".tmp", ".workspace", "data/source"):
            with self.assertRaises(ValueError):
                Workspace(self.repo, self.repo / directory / "workspace.sqlite")

    def test_versions_backup_and_exact_restore_without_source(self):
        original = self.file.read_bytes()
        duplicate = self.inputs / "duplicate.bin"
        duplicate.write_bytes(original)
        first = self.workspace.save([self.inputs], "first")
        self.file.write_bytes(b"second\x00version")
        second = self.workspace.save([self.inputs], "second")
        self.assertEqual(self.workspace.verify()["blobs"], 2)
        with closing(self.workspace.connect(write=True)) as db:
            for statement in ("DELETE FROM entry", "UPDATE blob SET byte_length=0", "DELETE FROM snapshot"):
                with self.assertRaisesRegex(sqlite3.IntegrityError, "append-only"):
                    db.execute(statement)
        backup = Path(self.workspace.backup()["destination"])
        # Files removed here are disposable test fixtures, not real historical artifacts.
        self.file.unlink()
        duplicate.unlink()
        restored = Workspace(self.repo, backup)
        destination = self.root / "restored"
        restored.restore(first["snapshotId"], destination)
        self.assertEqual((destination / "data/local/catalog-authoring/artifacts/job/原文.jsonl").read_bytes(), original)
        restored.restore(second["snapshotId"], self.root / "restored-new")
        self.assertEqual((self.root / "restored-new/data/local/catalog-authoring/artifacts/job/原文.jsonl").read_bytes(), b"second\x00version")
        self.assertEqual(restored.verify()["snapshots"], 2)
        restored.checkout(first["snapshotId"], "data/local/catalog-authoring/artifacts/job/原文.jsonl")
        self.assertEqual(self.file.read_bytes(), original)
        with self.assertRaises(FileExistsError):
            restored.checkout(second["snapshotId"], "data/local/catalog-authoring/artifacts/job/原文.jsonl")
        with self.assertRaisesRegex(ValueError, "not synthesized"):
            restored.checkout(first["snapshotId"], "data/local/catalog-authoring/artifacts/lost-original")
        with self.assertRaises(FileExistsError):
            restored.restore(first["snapshotId"], destination)
        with self.assertRaises(FileExistsError):
            self.workspace.backup(backup)

    def test_compact_restore_follows_exact_members_and_retains_source_versions(self):
        import hashlib
        original = self.file.read_bytes()
        first = self.workspace.save([self.file], "original source")
        self.file.write_bytes(b"new source revision")
        second = self.workspace.save([self.file], "updated source")
        key = self.workspace.key(self.file)
        old_sha = hashlib.sha256(original).hexdigest()
        new_sha = hashlib.sha256(self.file.read_bytes()).hexdigest()
        publication = self.inputs / "publication/COMPACT-PUBLICATION.json"
        publication.parent.mkdir()
        value = {"schemaVersion": "catalog-compact-publication-v1",
                 "dependencies": [{"snapshot": second, "members": {key: new_sha}}],
                 "sources": {"catalog": {"path": key, "sha256": old_sha, "snapshot": first}}}
        publication.write_text(json.dumps(value), encoding="utf-8")
        saved = self.workspace.save([publication], "compact publication")
        backup = Workspace(self.repo, Path(self.workspace.backup()["destination"]))
        destination = self.repo / ".workspace/compact-restored"
        result = backup.restore(saved["snapshotId"], destination)
        self.assertEqual(result["files"], 3)
        self.assertEqual((destination / key).read_bytes(), b"new source revision")
        self.assertEqual((destination / "data/local/catalog-authoring/restored-versions" / old_sha).read_bytes(), original)
        self.assertEqual(artifact_path(self.file, destination), destination / key)
        self.assertEqual(artifact_path(destination / key, destination), destination / key)
        self.assertEqual(self.file.read_bytes(), b"new source revision")
        # An explicit reference cannot borrow an unrelated member from the store.
        value["sources"]["catalog"]["sha256"] = new_sha
        publication.write_text(json.dumps(value), encoding="utf-8")
        broken = self.workspace.save([publication], "invalid dependency")
        with self.assertRaisesRegex(ValueError, "dependency member changed"):
            self.workspace.restore(broken["snapshotId"], self.root / "refused")

    def test_invalid_paths_missing_files_and_active_sqlite_fail_closed(self):
        with self.assertRaisesRegex(ValueError, "explicit inputs"):
            recorded_run([sys.executable], [], [], "missing input", self.workspace)
        self.assertFalse((self.repo / "data/local/catalog-authoring/operations").exists())
        for key in ("../escape", "/absolute", "C:/root", "a/../b", "a\\b", "a//b", "a/./b"):
            with self.assertRaises(ValueError):
                key_path(key)
        with self.assertRaises(ValueError):
            self.workspace.save([self.repo], "broad root")
        with self.assertRaises(ValueError):
            self.workspace.save([self.root], "outside")
        with self.assertRaises(FileNotFoundError):
            self.workspace.save([self.inputs / "missing"], "missing")
        first = self.workspace.save([self.inputs], "valid")
        database = self.inputs / "source.sqlite"
        database.write_bytes(b"source fixture")
        Path(str(database) + "-wal").touch()
        with self.assertRaisesRegex(ValueError, "Close/checkpoint"):
            self.workspace.save([self.inputs], "must rollback")
        self.assertEqual(self.workspace.verify()["snapshots"], 1)
        with self.assertRaises(ValueError):
            self.workspace.restore(first["snapshotId"], self.repo / "data/source/new")
        with self.assertRaises(ValueError):
            self.workspace.backup(self.repo / "backup.sqlite")

    def test_incremental_backup_is_complete_and_failure_preserves_both_generations(self):
        first = self.workspace.save([self.inputs], "first")
        self.workspace.backup()
        self.workspace.backup()
        previous = self.repo / "data/local/catalog-authoring/backups/previous.sqlite"
        latest = self.repo / "data/local/catalog-authoring/backups/latest.sqlite"
        before = (latest.read_bytes(), previous.read_bytes())
        self.file.write_bytes(b"new original observation")
        second = self.workspace.save([self.inputs], "second")
        with patch.object(Workspace, "read_blob", side_effect=ValueError("corrupt delta")):
            with self.assertRaisesRegex(ValueError, "corrupt delta"):
                self.workspace.backup()
        self.assertEqual((latest.read_bytes(), previous.read_bytes()), before)
        with closing(sqlite3.connect(previous)) as db:
            trigger = db.execute("SELECT sql FROM sqlite_master WHERE name='blob_no_update'").fetchone()[0]
            db.execute("DROP TRIGGER blob_no_update")
            db.execute("UPDATE blob SET content=X'00'")
            db.execute(trigger)
            db.commit()
        # A new snapshot can reference an old blob: that byte content must be
        # checked too, even though its header and schema still match.
        self.file.write_bytes('音\r\n{"value":"unknown"}\n'.encode())
        self.workspace.save([self.inputs], "references old blob")
        with self.assertRaises((ValueError, zlib.error)):
            self.workspace.backup()
        previous.write_bytes(before[1])
        receipt = self.workspace.backup()
        self.assertEqual((receipt["mode"], receipt["addedSnapshots"]), ("append-only", 2))
        timings = receipt["timingsSeconds"]
        self.assertTrue({"headerMembership", "blobCopy", "blobReadback", "newMembership", "commit", "commitReadback", "rotation"} <= timings.keys())
        self.assertTrue(all(0 <= value <= timings["totalElapsed"] for value in timings.values()))
        self.assertEqual(Workspace(self.repo, previous).verify()["snapshots"], 1)
        restored = Workspace(self.repo, latest)
        self.assertEqual(restored.verify(), self.workspace.verify())
        for snapshot in (first, second):
            out = self.root / str(snapshot["snapshotId"])
            restored.restore(snapshot["snapshotId"], out)
        self.assertEqual((self.root / str(second["snapshotId"]) / "data/local/catalog-authoring/artifacts/job/原文.jsonl").read_bytes(), b"new original observation")
        with closing(sqlite3.connect(previous)) as db:
            db.execute("DROP TRIGGER snapshot_no_update")
            db.commit()
        with self.assertRaisesRegex(ValueError, "Backup schema"):
            self.workspace.backup()
        self.assertEqual(restored.verify(), self.workspace.verify())

    def test_version_one_index_migration_resumes_across_backup_generations(self):
        snapshot = self.workspace.save([self.inputs], "index migration")
        self.workspace.backup()
        self.workspace.backup()
        backups = self.repo / "data/local/catalog-authoring/backups"
        databases = [self.workspace.database, backups / "latest.sqlite", backups / "previous.sqlite"]
        for path in databases:
            with closing(sqlite3.connect(path)) as db, db:
                db.execute("drop index entry_snapshot")
                db.execute("pragma user_version=1")
            Workspace(self.repo, path).verify_saved(snapshot, [self.inputs])
        connect = Workspace.connect
        def interrupted(workspace, **kwargs):
            if workspace.database == databases[2] and kwargs.get("write"):
                raise OSError("migration interrupted between generations")
            return connect(workspace, **kwargs)
        with patch.object(Workspace, "connect", interrupted):
            with self.assertRaisesRegex(OSError, "migration interrupted"):
                self.workspace.backup()
        self.workspace.backup()
        for path in databases:
            with closing(sqlite3.connect(path)) as db:
                self.assertEqual(db.execute("pragma user_version").fetchone()[0], 2)
                self.assertIn("entry_snapshot", db.execute("explain query plan select count(*) from entry").fetchone()[3])
            Workspace(self.repo, path).verify_saved(snapshot, [self.inputs])

    def test_failed_command_retains_input_and_partial_result(self):
        output = self.repo / "data/local/catalog-authoring/artifacts/output"
        command = [sys.executable, "-c", "import pathlib,sys; p=pathlib.Path(sys.argv[1]); p.mkdir(); (p/'failure.txt').write_text('real partial output'); sys.exit(7)", str(output)]
        reported = {}
        self.assertEqual(recorded_run(command, [self.inputs], [output], "failure", self.workspace,
                                      receipt_out=reported), 7)
        self.assertEqual(set(reported["timingsSeconds"]), {"inputDiscovery", "inputSave", "inputBackup", "command",
                                                           "outputSave", "operationSave", "outputBackup", "total"})
        self.assertEqual(reported["backup"]["status"], "BACKED_UP")
        self.assertEqual(self.workspace.verify()["snapshots"], 3)
        with closing(self.workspace.connect()) as db:
            label = db.execute("SELECT label FROM snapshot ORDER BY id DESC LIMIT 1").fetchone()[0]
            self.assertEqual(label, "failure:exit-7")
            receipt_sha = db.execute("SELECT sha256 FROM entry WHERE path LIKE '%/command.json' ORDER BY snapshot_id DESC LIMIT 1").fetchone()[0]
            receipt = json.loads(self.workspace.read_blob(db, receipt_sha))
            self.assertEqual(receipt["exitCode"], 7)
            self.assertEqual(set(receipt["timingsSeconds"]), {"inputDiscovery", "inputSave", "inputBackup", "command", "outputSave"})
            self.assertTrue(all(value >= 0 for value in receipt["timingsSeconds"].values()))
        backups = list((self.repo / "data/local/catalog-authoring/backups").glob("*.sqlite"))
        self.assertEqual(len(backups), 2)
        with closing(Workspace(self.repo, self.repo / "data/local/catalog-authoring/backups/latest.sqlite").connect()) as db:
            self.assertEqual(json.loads(self.workspace.read_blob(db, receipt_sha)), receipt)

    def test_backup_resumes_each_interrupted_rotation_without_losing_versions(self):
        replace = os.replace
        for fail_at in range(3):
            with self.subTest(rename=fail_at):
                repo = self.root / f"rotation-{fail_at}"
                repo.mkdir()
                artifact = repo / "original.txt"
                artifact.write_bytes(b"original")
                store = Workspace(repo)
                first = store.save([artifact], "first")
                store.backup()
                store.backup()
                artifact.write_bytes(b"second")
                second = store.save([artifact], "second")
                calls = 0

                def interrupted_replace(source, target):
                    nonlocal calls
                    step = calls
                    calls += 1
                    if step == fail_at:
                        raise OSError("interrupted rotation")
                    replace(source, target)

                with patch("catalog_workspace.os.replace", side_effect=interrupted_replace):
                    with self.assertRaisesRegex(OSError, "interrupted rotation"):
                        store.backup()
                receipt = store.backup()
                self.assertEqual(receipt["latestSnapshotId"], second["snapshotId"])
                self.assertFalse((repo / "data/local/catalog-authoring/backups/pending.sqlite").exists())
                restored = Workspace(repo, Path(receipt["destination"]))
                self.assertEqual(restored.verify(), store.verify())
                for snapshot, expected in ((first, b"original"), (second, b"second")):
                    destination = repo / f"restore-{snapshot['snapshotId']}"
                    restored.restore(snapshot["snapshotId"], destination)
                    self.assertEqual((destination / "original.txt").read_bytes(), expected)

    def test_backup_retries_transient_windows_reader(self):
        self.workspace.save([self.inputs], "first")
        self.workspace.backup()
        self.workspace.backup()
        self.file.write_bytes(b"next observation")
        saved = self.workspace.save([self.inputs], "next")
        replace = os.replace
        attempts = 0

        def busy_once(source, target):
            nonlocal attempts
            if source.name == "latest.sqlite" and target.name == "previous.sqlite":
                attempts += 1
                if attempts == 1:
                    error = PermissionError("backup reader still open")
                    error.winerror = 32
                    raise error
            replace(source, target)

        with patch("catalog_workspace.os.replace", side_effect=busy_once):
            receipt = self.workspace.backup()
        self.assertEqual(attempts, 2)
        self.assertEqual(receipt["latestSnapshotId"], saved["snapshotId"])
        Workspace(self.repo, Path(receipt["destination"])).verify_saved(saved, [self.inputs])

    def test_incomplete_backup_rotation_is_retained_and_rejected(self):
        self.workspace.save([self.inputs], "first")
        latest = Path(self.workspace.backup()["destination"])
        before = latest.read_bytes()
        pending = latest.with_name("pending.sqlite")
        pending.write_bytes(b"")
        with self.assertRaisesRegex(ValueError, "partial copy retained"):
            self.workspace.backup()
        self.assertEqual(latest.read_bytes(), before)
        self.assertEqual(pending.read_bytes(), b"")

    def test_launch_failure_and_handled_interrupt_leave_durable_receipts_and_logs(self):
        self.assertEqual(recorded_run([str(self.root / "missing.exe")], [self.inputs], [], "launch", self.workspace), 127)
        output = self.repo / "interrupted-output"

        def interrupted(*_args, **kwargs):
            output.mkdir()
            (output / "partial.txt").write_bytes(b"partial result")
            kwargs["stdout"].write(b"output before interrupt\n")
            raise KeyboardInterrupt()

        with patch("catalog_workspace.subprocess.run", side_effect=interrupted):
            self.assertEqual(recorded_run([sys.executable], [self.inputs], [output], "interrupt", self.workspace), 130)
        backup = Workspace(self.repo, self.repo / "data/local/catalog-authoring/backups/latest.sqlite")
        with closing(backup.connect()) as db:
            receipts = [json.loads(backup.read_blob(db, sha)) for (sha,) in db.execute(
                "SELECT sha256 FROM entry WHERE path LIKE '%/command.json' ORDER BY snapshot_id")]
            self.assertEqual([row["exitCode"] for row in receipts if row["status"] == "EXITED"], [127, 130])
            self.assertEqual(sum(row["status"] == "PREPARED" for row in receipts), 2)
            paths = {path: backup.read_blob(db, sha) for path, sha in db.execute("SELECT path,sha256 FROM entry")}
            self.assertEqual(paths["interrupted-output/partial.txt"], b"partial result")
            self.assertIn(b"output before interrupt\n", paths.values())

    def test_concurrent_writers_keep_both_snapshots(self):
        self.workspace.save([self.inputs], "initialize")
        code = "import sys; from pathlib import Path; from catalog_workspace import Workspace; w=Workspace(Path(sys.argv[1])); w.save([Path(sys.argv[2])], sys.argv[3]); w.backup()"
        processes = [subprocess.Popen([sys.executable, "-c", code, str(self.repo), str(self.inputs), label], cwd=Path(__file__).parent) for label in ("writer-a", "writer-b")]
        for process in processes:
            self.assertEqual(process.wait(timeout=30), 0)
        self.assertEqual(self.workspace.verify()["snapshots"], 3)
        latest = self.repo / "data/local/catalog-authoring/backups/latest.sqlite"
        self.assertEqual(Workspace(self.repo, latest).verify()["snapshots"], 3)

    def test_job_and_prior_references_are_saved_not_only_their_paths(self):
        prior = self.repo / "data/local/catalog-authoring/artifacts/prior"
        prior.mkdir()
        (prior / "MANIFEST.sha256").write_text("actual manifest fixture")
        source = self.repo / "data/local/catalog-authoring/artifacts/research.jsonl"
        source.write_text("actual source bytes")
        (self.inputs / "external-prior-authority.json").write_text(json.dumps({"bundles": [{"root": str(prior)}]}))
        for version in ("factor-authoring-job-v3", "factor-authoring-job-v4"):
            (self.inputs / "records.json").write_text(json.dumps({"schemaVersion": version, "works": [{"researchRef": {"path": "../research.jsonl"}}]}))
            roots = authoring_inputs([self.inputs], self.workspace)
            snapshot = self.workspace.save(roots, "with dependencies")
            self.assertEqual(snapshot["files"], 5)
        source.unlink()
        with self.assertRaises(FileNotFoundError):
            authoring_inputs([self.inputs], self.workspace)

    def test_foreign_database_and_corrupt_blob_are_not_trusted(self):
        other = self.root / "unrelated.sqlite"
        with closing(sqlite3.connect(other)) as db:
            db.execute("CREATE TABLE unrelated(value TEXT)")
            db.commit()
        with self.assertRaises(ValueError):
            Workspace(self.repo, other).save([self.inputs], "wrong database")
        self.workspace.save([self.inputs], "valid")
        # Simulate out-of-band corruption; normal writers cannot update immutable rows.
        with closing(sqlite3.connect(self.workspace.database)) as db:
            db.execute("DROP TRIGGER blob_no_update")
            db.execute("UPDATE blob SET byte_length=byte_length+1")
            db.commit()
        with self.assertRaisesRegex(ValueError, "Corrupt blob"):
            self.workspace.verify()

    def test_direct_lineage_is_saved_without_recapturing_transitive_history(self):
        baseline = self.repo / "data/local/catalog-authoring/artifacts/baseline"
        baseline.mkdir()
        (baseline / "catalog.sqlite").write_bytes(b"direct baseline bytes")
        (baseline / "external-lineage.json").write_text(json.dumps({"baselineRoot": str(self.repo / "data/local/catalog-authoring/artifacts/historical-only")}))
        (self.inputs / "external-lineage.json").write_text(json.dumps({"baselineRoot": str(baseline)}))
        roots = authoring_inputs([self.inputs], self.workspace)
        snapshot = self.workspace.save(roots, "direct lineage")
        self.assertEqual(snapshot["files"], 4)
        # A direct missing dependency still fails; only its older provenance is not executed.
        (baseline / "catalog.sqlite").unlink()
        (baseline / "external-lineage.json").unlink()
        baseline.rmdir()
        with self.assertRaises(FileNotFoundError):
            self.workspace.save(authoring_inputs([self.inputs], self.workspace), "missing direct dependency")

    def test_collection_capture_does_not_require_publication_dependencies(self):
        script = self.repo / "scripts/catalog_authoring/validate_factor_collection_batch.mjs"
        script.parent.mkdir(parents=True)
        script.write_text("// collection validator bytes\n")
        helper = self.repo / "scripts/catalog_workspace.py"
        helper.parent.mkdir(exist_ok=True)
        helper.write_text("# storage helper bytes\n")
        paths = helper.with_name("workspace_paths.py")
        paths.write_text("# path helper bytes\n")
        collector = script.with_name("collect_factor_evidence.mjs")
        collector.write_text("// acquisition and recording helper bytes\n")
        canonical = self.repo / "data/source/catalog.sqlite"
        canonical.parent.mkdir(parents=True)
        canonical.write_bytes(b"unrelated active canonical")
        Path(str(canonical) + "-wal").touch()
        roots = authoring_inputs([self.inputs, script, helper], self.workspace)
        saved = self.workspace.save(roots, "collection without publishing")
        self.assertEqual(saved["files"], 4)
        with closing(self.workspace.connect()) as db:
            captured = {row[0] for row in db.execute("SELECT path FROM entry")}
        self.assertIn(self.workspace.key(paths), captured)
        self.assertNotIn(self.workspace.key(canonical), captured)
        recording_roots = authoring_inputs([self.inputs, collector, helper], self.workspace)
        recording = self.workspace.save(recording_roots, "recording includes its validator")
        self.assertEqual(recording["files"], 5)
        self.assertIn(script, recording_roots)
        self.assertNotIn(canonical, recording_roots)

    def test_collection_handoff_is_saved_with_compact_job_and_missing_binding_fails(self):
        collection = self.inputs.parent / "collection"
        collection.mkdir()
        research = collection / "research.jsonl"
        research.write_text('{"workId":"work-a"}\n', encoding="utf-8")
        handoff = collection / "COLLECTION-HANDOFF.json"
        handoff.write_text('{"fixture":true}\n', encoding="utf-8")
        job = self.inputs / "job.json"
        job.write_text(json.dumps({"schemaVersion": "factor-authoring-job-v4", "works": [{
            "researchRefs": [{"path": str(research), "handoffSha256": "bound-by-job-reader"}]
        }]}), encoding="utf-8")
        roots = authoring_inputs([job], self.workspace)
        self.assertIn(handoff, roots)
        snapshot = self.workspace.save(roots, "test collection handoff closure")
        self.workspace.verify_saved(snapshot, [job, research, handoff])
        handoff.unlink()
        with self.assertRaises(FileNotFoundError):
            self.workspace.save(authoring_inputs([job], self.workspace), "missing handoff")

    def test_output_capture_failure_still_backs_up_exit_state_and_logs(self):
        output = self.repo / "data/local/catalog-authoring/artifacts/partial.sqlite"
        command = [sys.executable, "-c", "import pathlib,sys; p=pathlib.Path(sys.argv[1]); p.write_bytes(b'partial'); pathlib.Path(str(p)+'-wal').touch(); print('child output'); sys.exit(7)", str(output)]
        with self.assertRaisesRegex(ValueError, "Close/checkpoint"):
            recorded_run(command, [self.inputs], [output], "uncapturable result", self.workspace)
        backup = Workspace(self.repo, self.repo / "data/local/catalog-authoring/backups/latest.sqlite")
        with closing(backup.connect()) as db:
            path, sha = db.execute("SELECT path,sha256 FROM entry WHERE path LIKE '%/command.json' ORDER BY snapshot_id DESC LIMIT 1").fetchone()
            receipt = json.loads(backup.read_blob(db, sha))
            self.assertEqual((receipt["status"], receipt["exitCode"]), ("OUTPUT_SAVE_FAILED", 7))
            self.assertIn("Close/checkpoint", receipt["outputStorageError"])
            self.assertIsNone(receipt["outputSnapshot"])
            sha = db.execute("SELECT sha256 FROM entry WHERE path=? ORDER BY snapshot_id DESC LIMIT 1", (str(Path(path).with_name("stdout.bin")).replace("\\", "/"),)).fetchone()[0]
            self.assertIn(b"child output", backup.read_blob(db, sha))
        self.assertEqual(output.read_bytes(), b"partial")
        self.assertTrue(Path(str(output) + "-wal").exists())

    def test_recovery_declaration_preserves_epoch_scope_and_policy(self):
        epoch = self.repo / "data/local/catalog-authoring/artifacts/recovery-epoch.json"
        scope = self.repo / "data/local/catalog-authoring/artifacts/recovery-scope.jsonl"
        policy = self.repo / "data/local/catalog-authoring/artifacts/recovery-policy.md"
        scope.write_text("scope bytes\n")
        policy.write_text("approved policy bytes\n")
        history = self.repo / "data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/runs"
        originals = [history / "continuation-factor-233-publication-20260909-v1/catalog-expanded.candidate.sqlite",
                     history / "canonical-promotion-20260910-v2/before/data/source/catalog.sqlite"]
        for path in originals:
            path.parent.mkdir(parents=True)
            path.write_bytes(b"exact historical bytes")
        (originals[0].parent / "external-lineage.json").write_text(json.dumps({
            "baselineRoot": str(history / "historical-working-copy-no-longer-required"),
        }))
        epoch.write_text(json.dumps({"schemaVersion": "factor-loss-recovery-epoch-v1", "epochId": "factor-003-recovery-20260909-v1", "scopePath": str(scope), "policyPath": str(policy)}))
        (self.inputs / "recovery-declaration.json").write_text(json.dumps({"schemaVersion": "factor-loss-recovery-v1", "epochPath": str(epoch)}))
        roots = authoring_inputs([self.inputs], self.workspace)
        self.workspace.save(roots, "recovery dependencies")
        with closing(self.workspace.connect()) as db:
            paths = {row[0] for row in db.execute("SELECT path FROM entry")}
        self.assertTrue({"data/local/catalog-authoring/artifacts/recovery-epoch.json", "data/local/catalog-authoring/artifacts/recovery-scope.jsonl", "data/local/catalog-authoring/artifacts/recovery-policy.md"} <= paths)
        self.assertTrue({self.workspace.key(path) for path in originals} <= paths)
        scope.unlink()
        with self.assertRaises(FileNotFoundError):
            authoring_inputs([self.inputs], self.workspace)


if __name__ == "__main__":
    unittest.main()
