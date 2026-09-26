"""Revision storage checks use real SQLite, file bytes and backup boundaries."""
from contextlib import closing
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import unittest
import zlib

from catalog_revision_store import RevisionWorkspace
from catalog_workspace import digest


class RevisionStoreTest(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.repo = Path(self.folder.name)
        self.store = RevisionWorkspace.create(self.repo, self.repo / "data/local/catalog-authoring/workspace.sqlite")

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


if __name__ == "__main__":
    unittest.main()
