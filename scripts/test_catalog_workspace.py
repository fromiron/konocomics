"""Run with: python scripts/test_catalog_workspace.py (stdlib only)."""
import json
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from contextlib import closing
from pathlib import Path

from catalog_workspace import Workspace, authoring_inputs, key_path, recorded_run


class WorkspaceTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="catalog-workspace-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.repo = self.root / "repo"
        self.repo.mkdir()
        self.inputs = self.repo / ".tmp/job"
        self.inputs.mkdir(parents=True)
        self.file = self.inputs / "原文.jsonl"
        self.file.write_bytes('音\r\n{"value":"unknown"}\n'.encode())
        self.workspace = Workspace(self.repo)

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
        self.assertEqual((destination / ".tmp/job/原文.jsonl").read_bytes(), original)
        restored.restore(second["snapshotId"], self.root / "restored-new")
        self.assertEqual((self.root / "restored-new/.tmp/job/原文.jsonl").read_bytes(), b"second\x00version")
        self.assertEqual(restored.verify()["snapshots"], 2)
        restored.checkout(first["snapshotId"], ".tmp/job/原文.jsonl")
        self.assertEqual(self.file.read_bytes(), original)
        with self.assertRaises(FileExistsError):
            restored.checkout(second["snapshotId"], ".tmp/job/原文.jsonl")
        with self.assertRaisesRegex(ValueError, "not synthesized"):
            restored.checkout(first["snapshotId"], ".tmp/lost-original")
        with self.assertRaises(FileExistsError):
            restored.restore(first["snapshotId"], destination)
        with self.assertRaises(FileExistsError):
            self.workspace.backup(backup)

    def test_invalid_paths_missing_files_and_active_sqlite_fail_closed(self):
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

    def test_failed_command_retains_input_and_partial_result(self):
        output = self.repo / ".tmp/output"
        command = [sys.executable, "-c", "import pathlib,sys; p=pathlib.Path(sys.argv[1]); p.mkdir(); (p/'failure.txt').write_text('real partial output'); sys.exit(7)", str(output)]
        self.assertEqual(recorded_run(command, [self.inputs], [output], "failure", self.workspace), 7)
        self.assertEqual(self.workspace.verify()["snapshots"], 3)
        with closing(self.workspace.connect()) as db:
            label = db.execute("SELECT label FROM snapshot ORDER BY id DESC LIMIT 1").fetchone()[0]
            self.assertEqual(label, "failure:exit-7")
            receipt_sha = db.execute("SELECT sha256 FROM entry WHERE path LIKE '%/command.json'").fetchone()[0]
            receipt = json.loads(self.workspace.read_blob(db, receipt_sha))
            self.assertEqual(receipt["exitCode"], 7)
            self.assertEqual(set(receipt["timingsSeconds"]), {"inputSave", "inputBackup", "command", "outputSave"})
            self.assertTrue(all(value >= 0 for value in receipt["timingsSeconds"].values()))
        backups = list((self.root / "repo-authoring-backups").glob("*.sqlite"))
        self.assertEqual(len(backups), 2)
        with closing(Workspace(self.repo, self.root / "repo-authoring-backups/latest.sqlite").connect()) as db:
            self.assertEqual(json.loads(self.workspace.read_blob(db, receipt_sha)), receipt)

    def test_concurrent_writers_keep_both_snapshots(self):
        self.workspace.save([self.inputs], "initialize")
        code = "import sys; from pathlib import Path; from catalog_workspace import Workspace; w=Workspace(Path(sys.argv[1])); w.save([Path(sys.argv[2])], sys.argv[3]); w.backup()"
        processes = [subprocess.Popen([sys.executable, "-c", code, str(self.repo), str(self.inputs), label], cwd=Path(__file__).parent) for label in ("writer-a", "writer-b")]
        for process in processes:
            self.assertEqual(process.wait(timeout=30), 0)
        self.assertEqual(self.workspace.verify()["snapshots"], 3)
        latest = self.root / "repo-authoring-backups/latest.sqlite"
        self.assertEqual(Workspace(self.repo, latest).verify()["snapshots"], 3)

    def test_job_and_prior_references_are_saved_not_only_their_paths(self):
        prior = self.repo / ".tmp/prior"
        prior.mkdir()
        (prior / "MANIFEST.sha256").write_text("actual manifest fixture")
        source = self.repo / ".tmp/research.jsonl"
        source.write_text("actual source bytes")
        (self.inputs / "records.json").write_text(json.dumps({"schemaVersion": "factor-authoring-job-v3", "works": [{"researchRef": {"path": "../research.jsonl"}}]}))
        (self.inputs / "external-prior-authority.json").write_text(json.dumps({"bundles": [{"root": str(prior)}]}))
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

    def test_recovery_declaration_preserves_epoch_scope_and_policy(self):
        epoch = self.repo / ".tmp/recovery-epoch.json"
        scope = self.repo / ".tmp/recovery-scope.jsonl"
        policy = self.repo / ".tmp/recovery-policy.md"
        scope.write_text("scope bytes\n")
        policy.write_text("approved policy bytes\n")
        epoch.write_text(json.dumps({"schemaVersion": "factor-loss-recovery-epoch-v1", "scopePath": str(scope), "policyPath": str(policy)}))
        (self.inputs / "recovery-declaration.json").write_text(json.dumps({"schemaVersion": "factor-loss-recovery-v1", "epochPath": str(epoch)}))
        roots = authoring_inputs([self.inputs], self.workspace)
        self.workspace.save(roots, "recovery dependencies")
        with closing(self.workspace.connect()) as db:
            paths = {row[0] for row in db.execute("SELECT path FROM entry")}
        self.assertTrue({".tmp/recovery-epoch.json", ".tmp/recovery-scope.jsonl", ".tmp/recovery-policy.md"} <= paths)
        scope.unlink()
        with self.assertRaises(FileNotFoundError):
            authoring_inputs([self.inputs], self.workspace)


if __name__ == "__main__":
    unittest.main()
