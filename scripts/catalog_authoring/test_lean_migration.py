"""Lean migration must retain usable references without rooting retired copies."""
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from catalog_revision_store import RevisionWorkspace
from catalog_workspace import digest, manifest_digest
import lean_migration


class LeanMigrationTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.repo = Path(self.directory.name)
        self.store = RevisionWorkspace.create(self.repo, self.repo / "workspace.sqlite")

    def migrate(self):
        destination = self.repo / "lean.sqlite"
        lean_migration.build(self.store.database, destination)
        return RevisionWorkspace(self.repo, destination)

    def test_retained_legacy_pin_is_readable_but_unused_pin_is_pruned(self):
        path, body = "evidence/raw.txt", b"Original source bytes"
        sha = digest(body)
        self.store.save_bytes({path: body}, "source")
        snapshot = {"snapshotId": 7, "files": 1,
                    "manifestSha256": manifest_digest([(path, sha)])}
        pin = self.store.put_revision("legacy-pin", "7",
            {"snapshot": snapshot, "originalMembers": {path: sha}}, {path: sha}, pinned=True)
        self.store.put_revision("active", "needed source", {"revision": pin})
        unused = b"Unrelated retired publication copy"
        self.store.save_bytes({"retired/pair.sqlite": unused}, "retired")
        self.store.put_revision("legacy-pin", "unused", {},
                                {"retired/pair.sqlite": digest(unused)}, pinned=True)
        reference = {"snapshot": snapshot, "path": path, "sha256": sha}
        self.assertEqual(self.store.stored_bytes(reference), body)
        migrated = self.migrate()
        self.assertEqual(migrated.stored_bytes(reference), body)
        self.assertEqual(migrated.current_revision("legacy-pin", "7")["revisionId"], pin["revisionId"])
        self.assertIsNone(migrated.current_revision("legacy-pin", "unused"))
        with closing(migrated.connect()) as db:
            self.assertIsNone(db.execute("SELECT 1 FROM blob WHERE sha256=?", (digest(unused),)).fetchone())

    def test_cli_retains_checkpoint_reuse_and_cleanup_without_retired_history(self):
        root = self.repo / ".workspace/batch/checkpoints"
        root.mkdir(parents=True)
        checkpoint = root / "CHECKPOINT.json"
        checkpoint.write_bytes(b'{"processedCount":10}')
        payload = {"schemaVersion": "authoring-transient-execution-v1",
                   "disposableRoots": [self.store.key(root)]}
        owner = self.store.put_revision("execution", "unfinished batch", payload)
        saved = self.store.persist([root], "checkpoint", execution=owner)["snapshot"]
        self.store.put_revision("execution", "retired unrelated batch", {}, terminal=True)
        destination = self.repo / "lean.sqlite"
        result = subprocess.run([sys.executable, "-B", str(Path(lean_migration.__file__)),
                                 "--source", str(self.store.database), "--dest", str(destination)],
                                text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        migrated = RevisionWorkspace(self.repo, destination)
        current = migrated.current_revision("execution", "unfinished batch")
        self.assertEqual(current["revisionId"], owner["revisionId"])
        self.assertEqual(migrated.persist([root], "checkpoint", execution=current)["snapshot"]["revisionId"],
                         saved["revisionId"])
        self.assertIsNone(migrated.current_revision("execution", "retired unrelated batch"))
        migrated.close_transient_execution(current)
        migrated.backup()
        self.assertEqual(migrated.retire_transient_files(current)["status"], "RETIRED")
        self.assertFalse(checkpoint.exists())
        collected = migrated.gc(now=datetime(2035, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertIn(saved["revisionId"], collected["retiredOwnedArtifacts"])
        self.assertIn(owner["revisionId"], collected["expiredExecutionRevisions"])

    def test_finished_checkpoint_keeps_owner_until_cleanup(self):
        root = self.repo / ".workspace/finished/checkpoints"
        root.mkdir(parents=True)
        (root / "pair.sqlite").write_bytes(b"Checkpoint copy")
        owner = self.store.put_revision("execution", "finished batch", {
            "schemaVersion": "authoring-transient-execution-v1",
            "disposableRoots": [self.store.key(root)]})
        saved = self.store.persist([root], "checkpoint", execution=owner)["snapshot"]
        self.store.close_transient_execution(owner)
        migrated = self.migrate()
        current = migrated.current_revision("execution", "finished batch")
        self.assertEqual(current["revisionId"], owner["revisionId"])
        migrated.backup()
        self.assertEqual(migrated.retire_transient_files(current)["status"], "RETIRED")
        result = migrated.gc(now=datetime(2035, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertIn(saved["revisionId"], result["retiredOwnedArtifacts"])

    def test_pruned_legacy_tail_does_not_exempt_new_executions_from_gc(self):
        self.store.put_revision("active", "control", {})
        self.store.put_revision("execution", "obsolete", {}, terminal=True)
        with closing(self.store.connect(write=True)) as db, db:
            # An upgraded store's high watermark may belong to a pruned row.
            db.execute("INSERT INTO store_meta SELECT 'legacy_revision_max_rowid',cast(max(rowid) AS TEXT) FROM revision")
        migrated = self.migrate()
        owner = migrated.put_revision("execution", "new completed operation", {}, terminal=True)
        result = migrated.gc(now=datetime(2035, 1, 1, tzinfo=timezone.utc), apply=True)
        self.assertIn(owner["revisionId"], result["expiredExecutionRevisions"])


if __name__ == "__main__":
    unittest.main()
