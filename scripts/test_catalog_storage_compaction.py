"""Compact storage keeps every saved byte while removing redundant copies."""
from contextlib import closing
from datetime import datetime, timedelta, timezone
import lzma
import os
from pathlib import Path
import sqlite3
import tempfile
import unittest
import uuid
import zlib
from unittest.mock import patch

import catalog_retention as retention
from catalog_revision_store import LARGE_BLOB, RevisionWorkspace, SCHEMA, V4_SCHEMA, change_triggers, encoded
from catalog_workspace import APPLICATION_ID, XZ_MAGIC, decode_blob, digest

BACKUP = retention.BASE + "/backups/latest.sqlite"


def large_text(seed):
    return b"".join(b"%s line %06d of a long generated catalog export\n" % (seed, n) for n in range(LARGE_BLOB // 40))


class CodecTest(unittest.TestCase):
    def test_decode_dispatches_by_magic_and_rejects_damaged_bytes(self):
        body = b"evidence " * 1000
        sha = digest(body)
        for stored in (lzma.compress(body, preset=6), zlib.compress(body, 1)):
            self.assertEqual(decode_blob(sha, len(body), stored), body)
        packed = lzma.compress(body, preset=6)
        for damaged in (packed + b"tail", packed[:-4], packed[:12] + b"\0" * 40):
            with self.assertRaisesRegex(ValueError, "Corrupt blob"):
                decode_blob(sha, len(body), damaged)
        with self.assertRaisesRegex(ValueError, "Corrupt blob"):
            decode_blob(digest(b"other"), len(body), packed)


class CompactStoreTest(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.repo = Path(self.folder.name)
        self.store = RevisionWorkspace.create(self.repo, self.repo / retention.BASE / "workspace.sqlite")

    def test_new_store_keeps_membership_as_integer_keys_behind_the_same_view(self):
        first = self.store.save_bytes({"run/a.json": b'{"a":1}', "run/b.json": b'{"b":1}'}, "run")
        second = self.store.save_bytes({"run/a.json": b'{"a":2}', "run/b.json": b'{"b":1}'}, "run")
        with closing(self.store.connect()) as db:
            self.assertEqual((db.execute("PRAGMA user_version").fetchone()[0], db.execute("PRAGMA auto_vacuum").fetchone()[0]), (5, 2))
            self.assertEqual([column[1] for column in db.execute("PRAGMA table_info(revision_blob)")], ["revision_id", "path", "sha256"])
            self.assertEqual(db.execute("SELECT count(*) FROM path").fetchone()[0], 2)
            journal = db.execute("SELECT count(*) FROM change_log WHERE entity='revision' AND key1=?", (second["revisionId"],)).fetchone()[0]
            self.assertEqual(journal, 1)
            for query in ("SELECT b.sha256 FROM revision_blob b JOIN revision r ON r.id=b.revision_id WHERE b.path=? ORDER BY r.rowid DESC LIMIT 1",
                          "SELECT 1 FROM revision_blob WHERE path=? AND sha256=? LIMIT 1",
                          "SELECT path,sha256 FROM revision_blob WHERE revision_id=?",
                          "SELECT 1 FROM revision_blob WHERE sha256=? LIMIT 1",
                          "SELECT DISTINCT path FROM revision_blob WHERE path>=? AND path<? ORDER BY path"):
                plan = " ".join(row[3] for row in db.execute("EXPLAIN QUERY PLAN " + query, ("x",) * query.count("?")))
                self.assertNotIn("SCAN m", plan)
                self.assertNotIn("SCAN p", plan)
        self.assertEqual(self.store.get_revision(first)["members"]["run/a.json"], digest(b'{"a":1}'))
        with closing(self.store.connect(write=True)) as db, db:
            with self.assertRaises(sqlite3.IntegrityError):
                db.execute("INSERT INTO revision_blob VALUES (?,?,?)", (second["revisionId"], "run/c.json", "f" * 64))
        self.store.backup()
        backup = RevisionWorkspace(self.repo, self.repo / BACKUP)
        self.assertEqual(backup.get_revision(second), self.store.get_revision(second))

    def test_gc_drops_paths_that_only_expired_revisions_used(self):
        folder = self.repo / "scratch"
        folder.mkdir()
        (folder / "only.txt").write_bytes(b"old")
        scratch = self.store.save([folder], "scratch")
        (folder / "only.txt").unlink()
        (folder / "other.txt").write_bytes(b"new")
        self.store.save([folder], "scratch")
        # The execution both owns and depends on the superseded copy; the
        # preview must count it exactly like the applied run.
        owner = self.store.put_revision("execution", "done", {"status": "PASS", "result": scratch}, terminal=True)
        self.store.own_execution_artifacts(owner, [scratch])
        later = datetime.now(timezone.utc) + timedelta(days=9)
        self.assertEqual(self.store.gc(now=later)["retiredOwnedArtifacts"], [scratch["revisionId"]])
        result = self.store.gc(now=later, apply=True)
        self.assertEqual(result["retiredOwnedArtifacts"], [scratch["revisionId"]])
        with closing(self.store.connect()) as db:
            self.assertEqual([row[0] for row in db.execute("SELECT value FROM path")], ["scratch/other.txt"])
        self.assertEqual(self.store.verify()["status"], "STORAGE_VERIFIED")

    def test_large_writes_stay_fast_until_recompression_reaches_the_backup(self):
        small, tiny, large = b"small evidence " * 400, b"t", large_text(b"catalog")
        receipt = self.store.save_bytes({"pub/small.txt": small, "pub/tiny.txt": tiny, "pub/catalog.sqlite": large}, "pub")
        with closing(self.store.connect()) as db:
            stored = dict(db.execute("SELECT sha256,content FROM blob"))
        self.assertTrue(stored[digest(small)].startswith(XZ_MAGIC))
        self.assertTrue(stored[digest(tiny)].startswith(b"\x78"))
        self.assertTrue(stored[digest(large)].startswith(b"\x78"))
        self.store.backup()
        self.assertEqual(self.store.recompress_large_blobs()["blobs"], 1)
        applied = self.store.recompress_large_blobs(apply=True, workers=1)
        self.assertLess(applied["storedBytesAfter"], applied["storedBytesBefore"])
        self.assertEqual(self.store.backup()["mode"], "revision-incremental")
        backup = RevisionWorkspace(self.repo, self.repo / BACKUP)
        for view in (self.store, backup):
            with closing(view.connect()) as db:
                self.assertTrue(db.execute("SELECT content FROM blob WHERE sha256=?", (digest(large),)).fetchone()[0].startswith(XZ_MAGIC))
                self.assertEqual(view.read_blob(db, digest(large)), large)
        self.assertEqual(self.store.recompress_large_blobs()["blobs"], 0)
        self.assertEqual(backup.get_revision(receipt), self.store.get_revision(receipt))

    def test_journal_prune_keeps_the_cursor_and_incremental_backup_continues(self):
        self.store.save_bytes({"a.txt": b"one"}, "a")
        self.store.backup()
        self.store.save_bytes({"a.txt": b"two"}, "a")
        cursor = self.store.backup()["cursor"]
        pruned = self.store.prune_change_log()
        self.assertEqual(pruned["cursor"], cursor)
        backup = RevisionWorkspace(self.repo, self.repo / BACKUP)
        for view in (self.store, backup):
            with closing(view.connect()) as db:
                self.assertEqual(db.execute("SELECT min(seq),max(seq) FROM change_log").fetchone(), (cursor, cursor))
        latest = self.store.save_bytes({"a.txt": b"three"}, "a")
        self.assertEqual(self.store.backup()["mode"], "revision-incremental")
        self.assertEqual(backup.get_revision(latest), self.store.get_revision(latest))
        self.assertEqual(self.store.reclaim_free_pages()["backup"]["status"], "RECLAIMED")

    def test_superseded_control_snapshots_expire_after_their_successor_ages(self):
        live = self.store.put_revision("active", "current-live-declared-inputs", {"n": 1})
        controls = self.store.put_revision("active", "current-recovery-controls", {"live": live})
        newer_live = self.store.put_revision("active", "current-live-declared-inputs", {"n": 2})
        newer = self.store.put_revision("active", "current-recovery-controls", {"live": newer_live})
        pinned = self.store.put_revision("active", "current-recovery-controls", {"n": 3}, pinned=True)
        head = self.store.put_revision("active", "current-recovery-controls", {"n": 4})
        recent_live = self.store.put_revision("active", "current-live-declared-inputs", {"n": 5})
        later = datetime.now(timezone.utc) + timedelta(days=9)
        with closing(self.store.connect(write=True)) as db, db:
            db.execute("UPDATE revision SET created_at=? WHERE id=?", (later.isoformat(), recent_live["revisionId"]))
        # The first controls snapshot owns a dependency on the first live
        # inputs; both expire together. The second live inputs keep waiting
        # because their successor has not aged past the cutoff yet.
        self.assertEqual(self.store.gc(now=later)["expiredControlRevisions"], 3)
        self.store.gc(now=later, apply=True)
        for receipt in (live, controls, newer):
            with self.assertRaises(ValueError):
                self.store.get_revision(receipt)
        for receipt in (newer_live, pinned, head, recent_live):
            self.store.get_revision(receipt)
        self.assertEqual(self.store.verify()["status"], "STORAGE_VERIFIED")

    def test_control_snapshot_referenced_by_a_surviving_revision_stays(self):
        live = self.store.put_revision("active", "current-live-declared-inputs", {"n": 1})
        controls = self.store.put_revision("active", "current-recovery-controls", {"live": live})
        self.store.put_revision("active", "current-live-declared-inputs", {"n": 2})
        self.store.put_revision("active", "current-recovery-controls", {"n": 2})
        keeper = self.store.put_revision("active", "completion-identity:x", {"controls": controls})
        later = datetime.now(timezone.utc) + timedelta(days=9)
        self.assertEqual(self.store.gc(now=later, apply=True)["expiredControlRevisions"], 0)
        for receipt in (live, controls, keeper):
            self.store.get_revision(receipt)


def v4_store(repo):
    database = repo / retention.BASE / "workspace.sqlite"
    database.parent.mkdir(parents=True)
    with closing(sqlite3.connect(database)) as db:
        db.executescript(f"BEGIN;{SCHEMA}{V4_SCHEMA}{change_triggers()}"
                         f"PRAGMA application_id={APPLICATION_ID};PRAGMA user_version=4;COMMIT;")
        with db:
            db.executemany("INSERT INTO store_meta VALUES (?,?)", [
                ("generation", str(uuid.uuid4())), ("policy", "curation-evidence-active-v1"),
                ("journal_origin", str(uuid.uuid4())), ("legacy_revision_max_rowid", "0")])
    return RevisionWorkspace(repo, database)


class UpgradeV5Test(unittest.TestCase):
    def test_upgrade_preserves_rows_and_bytes_resumes_and_retires_the_rollback_pair(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            base = repo / retention.BASE
            store = v4_store(repo)
            large = large_text(b"v4")
            first = store.save_bytes({"pub/catalog.sqlite": large, "pub/review.md": b"review " * 900}, "pub")
            curation = store.put_revision("curation", "work-a", {"value": "2"}, store.get_revision(first)["members"])
            store.save_bytes({"pub/review.md": b"newer review"}, "pub")
            state = repo / retention.CONTINUATION / "STATE.json"
            retention.write(state, {"authoringStore": {"schemaVersion": 4, "generation": store._generation, "journalMode": "delete"}})
            store.backup()
            with closing(store.connect()) as db:
                rows = db.execute("SELECT rowid,* FROM revision ORDER BY rowid").fetchall()
                members = db.execute("SELECT * FROM revision_blob ORDER BY revision_id,path").fetchall()
            real = retention._checkpoint_to_rollback_journal
            with patch.object(retention, "_checkpoint_to_rollback_journal", side_effect=[OSError("stopped before swap"), real]):
                with self.assertRaisesRegex(OSError, "stopped before swap"):
                    retention.upgrade_store_v5(repo, workers=1)
                with self.assertRaisesRegex(ValueError, "cutover"):
                    store.save_bytes({"no.txt": b"not allowed"}, "during-transition")
                with self.assertRaisesRegex(ValueError, "--resume"):
                    retention.upgrade_store_v5(repo, workers=1)
                result = retention.upgrade_store_v5(repo, resume=True, workers=1)
            self.assertEqual(result["status"], "ACTIVATED")
            active = RevisionWorkspace(repo, base / "workspace.sqlite")
            with closing(active.connect()) as db:
                self.assertEqual(db.execute("PRAGMA user_version").fetchone()[0], 5)
                self.assertEqual(db.execute("SELECT rowid,* FROM revision ORDER BY rowid").fetchall()[:len(rows)], rows)
                self.assertEqual(db.execute("SELECT * FROM revision_blob WHERE revision_id IN (SELECT value FROM json_each(?)) ORDER BY revision_id,path",
                                            (encoded([row[1] for row in rows]).decode(),)).fetchall(), members)
                self.assertTrue(db.execute("SELECT content FROM blob WHERE sha256=?", (digest(large),)).fetchone()[0].startswith(XZ_MAGIC))
                self.assertEqual(active.read_blob(db, digest(large)), large)
            self.assertEqual(active.get_revision(curation)["payload"], {"value": "2"})
            self.assertEqual(retention.read(state)["authoringStore"]["schemaVersion"], 5)
            backup = RevisionWorkspace(repo, base / "backups/latest.sqlite")
            self.assertEqual(backup.get_revision(curation), active.get_revision(curation))
            for rollback in (base / "workspace.pre-v5.sqlite", base / "backups/pre-v5.sqlite"):
                with closing(sqlite3.connect(rollback)) as db:
                    self.assertEqual(db.execute("PRAGMA user_version").fetchone()[0], 4)
            self.assertEqual(retention.upgrade_store_v5(repo)["storage"]["backup"]["mode"], "reused")
            later = active.save_bytes({"pub/review.md": b"after upgrade"}, "pub")
            self.assertEqual(active.backup()["mode"], "revision-incremental")
            self.assertEqual(backup.get_revision(later), active.get_revision(later))
            self.assertEqual(len(retention.prune_pre_v5(repo)["removed"]), 2)
            self.assertFalse((base / "workspace.pre-v5.sqlite").exists())
            self.assertEqual(active.verify()["status"], "STORAGE_VERIFIED")


class MaterializedPruneTest(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.repo = Path(self.folder.name)
        self.base = self.repo / retention.BASE
        self.store = RevisionWorkspace.create(self.repo, self.base / "workspace.sqlite")
        planning = self.repo / retention.CONTINUATION / "planning/run"
        self.done, self.partial, self.latest = (planning / name / "attempts" / (str(n) * 64) for n, name in enumerate(("done", "partial", "latest"), 1))
        self.anchor_old, self.anchor_current = (self.base / "retained/curation-baseline" / name for name in ("old", "current"))
        batches = {}
        for summary, root in (("a" * 64, self.done), ("b" * 64, self.partial), ("c" * 64, self.latest)):
            self.write(root / "readback/catalog.sqlite", b"catalog " + root.name.encode())
            self.write(root / "readback/READBACK.json", b'{"status":"VERIFIED"}')
            self.store.save([root], "batch-publication")
            self.store.put_revision("completion", summary, {"status": "VERIFIED"})
            if root != self.partial:
                self.store.put_revision("canonical-completion", summary, {"status": "APPLIED"})
            batches[summary] = {"batchRoot": str(root), "receiptSha256": "0" * 64}
        for anchor in (self.anchor_old, self.anchor_current):
            self.write(anchor / "CURATION-BASELINE.json", b'{"anchor":"' + anchor.name.encode() + b'"}')
            self.store.save([anchor], "curation-anchor")
        restored = b"older version bytes"
        self.write(self.base / "restored-versions" / digest(restored), restored)
        self.store.save_bytes({"old/path.txt": restored}, "older")
        self.write(self.base / "restored-versions" / digest(b"unsaved"), b"unsaved")
        self.write(self.done / "unsaved.txt", b"never stored")
        retention.write(self.repo / retention.CONTINUATION / "STATE.json", {
            "authoringStore": {"schemaVersion": 5, "generation": self.store._generation},
            "publicationBatches": batches, "pendingPublicationBatch": "c" * 64,
            "latestCandidate": {"root": "../../retained/curation-baseline/current",
                                "readback": os.path.relpath(self.latest / "readback/READBACK.json", self.repo / retention.CONTINUATION)}})
        (self.repo / ".catalog-restore.json").write_bytes(encoded({
            "schemaVersion": "catalog-restored-workspace-v1", "materialization": "on-demand",
            "generation": self.store._generation, "originalRepositories": [str(self.repo)]}))
        self.store.backup()

    @staticmethod
    def write(path, body):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)

    def test_preview_changes_nothing_and_apply_removes_only_durable_backed_up_copies(self):
        preview = retention.prune_materialized(self.repo, min_age_hours=0)
        self.assertEqual(preview["status"], "PREVIEW")
        self.assertTrue((self.done / "readback/catalog.sqlite").is_file())
        self.assertEqual(preview["skippedScopes"], {"protected-attempt": 1, "canonical-incomplete": 1, "current-basis": 1})
        result = retention.prune_materialized(self.repo, apply=True, min_age_hours=0)
        self.assertEqual((result["files"], result["preserved"]["not-durable"]["files"]), (preview["files"], 2))
        self.assertFalse((self.done / "readback").exists())
        self.assertTrue((self.done / "unsaved.txt").is_file())
        self.assertFalse(self.anchor_old.exists())
        self.assertFalse((self.base / "restored-versions" / digest(b"older version bytes")).exists())
        self.assertTrue((self.base / "restored-versions" / digest(b"unsaved")).is_file())
        for kept in (self.partial / "readback/catalog.sqlite", self.latest / "readback/catalog.sqlite", self.anchor_current / "CURATION-BASELINE.json"):
            self.assertTrue(kept.is_file())
        self.assertTrue(Path(result["receipt"]).is_file())
        # The database still restores the removed bytes exactly.
        saved = self.store.file_reference(self.done / "readback/catalog.sqlite", digest(b"catalog " + self.done.name.encode()))
        self.assertEqual(self.store.stored_bytes(saved), b"catalog " + self.done.name.encode())

    def test_recent_changed_and_unbacked_copies_stay(self):
        self.write(self.done / "readback/READBACK.json", b'{"status":"CHANGED"}')
        self.store.save_bytes({"old/late.txt": b"late"}, "late")  # Not in the backup yet.
        self.write(self.base / "restored-versions" / digest(b"late"), b"late")
        preview = retention.prune_materialized(self.repo, min_age_hours=0)
        self.assertEqual(preview["preserved"]["not-durable"]["files"], 4)
        # Applying first completes the boundary backup; only then may the
        # newly saved bytes leave the disk. Changed and unsaved files stay.
        result = retention.prune_materialized(self.repo, apply=True, min_age_hours=0)
        self.assertEqual(result["preserved"]["not-durable"]["files"], 3)
        self.assertTrue((self.done / "readback/READBACK.json").is_file())
        self.assertFalse((self.base / "restored-versions" / digest(b"late")).exists())
        self.assertTrue((self.done / "unsaved.txt").is_file())
        recent = retention.prune_materialized(self.repo, min_age_hours=24)
        self.assertEqual(recent["files"], 0)
        self.assertIn("recent", recent["preserved"])

    def test_partially_materialized_scope_cannot_replace_its_saved_revision(self):
        retention.prune_materialized(self.repo, apply=True, min_age_hours=0)
        self.write(self.done / "readback/READBACK.json", b'{"status":"VERIFIED"}')
        with self.assertRaisesRegex(ValueError, "partially materialized"):
            self.store.save([self.done], "batch-publication")

    def test_prune_requires_an_on_demand_workspace(self):
        (self.repo / ".catalog-restore.json").unlink()
        with self.assertRaisesRegex(ValueError, "on-demand"):
            retention.prune_materialized(self.repo, min_age_hours=0)


class PublicationCleanupTest(unittest.TestCase):
    def test_cleanup_failure_is_reported_without_failing_the_publication(self):
        import catalog_authoring_batch_publish as publisher
        with patch.object(retention, "sparse_restore_marker", return_value={"materialization": "on-demand"}), \
                patch.object(retention, "prune_materialized", side_effect=ValueError("lock busy")) as prune:
            self.assertEqual(publisher.retire_materialized_copies(), {"status": "SKIPPED", "error": "lock busy"})
        self.assertEqual(prune.call_args.kwargs, {"apply": True, "min_age_hours": 1, "owner_lock_held": True})
        with patch.object(retention, "sparse_restore_marker", return_value=None):
            self.assertEqual(publisher.retire_materialized_copies(), {"status": "NOT_APPLICABLE"})


if __name__ == "__main__":
    unittest.main()
