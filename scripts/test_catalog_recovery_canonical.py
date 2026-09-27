"""Current recovery preserves canonical metadata independently of the candidate basis."""
from contextlib import closing
import shutil
import sqlite3
import unittest

import catalog_retention as retention
from catalog_revision_store import RevisionWorkspace
from catalog_workspace import digest
import test_catalog_retention as retention_cases


class CanonicalRecoveryTest(unittest.TestCase):
    def metadata_state(self):
        fixture = retention_cases.RetentionCutoverTest()
        self.addCleanup(fixture.doCleanups)
        repo, store, basis, *_ = fixture.recovery_fixture()
        output, _, _, generated = fixture.canonical_fixture(repo)
        source = repo / "data/source"
        (source / "README.md").write_bytes(b"Current canonical opaque source document")
        with closing(sqlite3.connect(source / "catalog.sqlite")) as db, db:
            db.execute("CREATE TABLE source_book_metadata(workId TEXT, description TEXT)")
            db.execute("INSERT INTO source_book_metadata VALUES ('work-0','Latest publisher introduction')")
        for name in generated:
            path = repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(output / "candidate" / name, path)
        intake = repo / ".workspace/metadata-intake/input.json"
        intake.parent.mkdir(parents=True)
        body = intake.parent / "publisher.html"
        body.write_bytes(b"Latest publisher introduction")
        capture = intake.parent / "publisher.receipt.json"
        retention.write(capture, {"url": "https://publisher.example/book", "resolvedUrl": "https://publisher.example/book",
            "fetchedAt": "2026-09-27T00:00:00Z", "status": 200, "sha256": digest(body.read_bytes()), "bytes": body.stat().st_size})
        retention.write(intake, [{"metadata": {"workId": "work-0", "isbn": "9784088848969"},
            "sourceFile": body.name, "receiptFile": capture.name, "receiptSha256": digest(capture.read_bytes()),
            "captionKind": "original", "originalItemCaption": "Latest publisher introduction"}])
        store.save([intake.parent], "metadata:next-request-input")
        return repo, store, basis, source, generated, intake

    def prepare_metadata(self, repo, backup, destination, intake):
        report = retention.restore_current(backup, destination)
        self.assertEqual(report["status"], "DATABASE_RESTORED")
        self.assertEqual(report["artifactFiles"], 0)
        self.assertFalse((destination / "data/source").exists())
        prepared = retention.prepare_restored_operation(destination, {"operation": "metadata",
            "inputPath": str(intake), "outputRoot": str(repo / ".workspace/metadata-next-output")})
        self.assertEqual(prepared["status"], "MATERIALIZED")
        self.assertFalse((destination / retention.BASE / "backups/latest.sqlite").exists())
        # Preparing bytes is not a publication or a new completion authority.
        self.assertFalse((destination / ".workspace/metadata-next-output/completion.json").exists())
        restored = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
        with closing(restored.connect()) as db, closing(backup.connect()) as original:
            self.assertEqual(db.execute("SELECT * FROM head ORDER BY kind,subject").fetchall(),
                             original.execute("SELECT * FROM head ORDER BY kind,subject").fetchall())

    def test_current_metadata_source_and_static_survive_without_a_batch_canonical_receipt(self):
        repo, store, basis, source, generated, intake = self.metadata_state()
        expected = {path.relative_to(repo).as_posix(): digest(path.read_bytes())
                    for path in source.rglob("*") if path.is_file()}
        expected.update({name: digest((repo / name).read_bytes()) for name in generated})
        candidate_sha = digest((basis / "catalog-expanded.candidate.sqlite").read_bytes())
        self.assertNotEqual(expected["data/source/catalog.sqlite"], candidate_sha)
        store.backup()  # The ordinary producer, without special metadata replay.
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        control = backup.get_revision(backup.current_revision("active", "current-recovery-controls"))
        self.assertEqual(control["payload"]["currentCanonical"]["members"], expected)
        destination = repo / "restored-current-metadata"
        self.prepare_metadata(repo, backup, destination, intake)
        for name, sha in expected.items():
            self.assertEqual(digest((destination / name).read_bytes()), sha, name)
        self.assertFalse((destination / basis.relative_to(repo)).exists())
        with closing(sqlite3.connect(destination / "data/source/catalog.sqlite")) as db:
            self.assertEqual(db.execute("SELECT description FROM source_book_metadata").fetchone(),
                             ("Latest publisher introduction",))

    def test_incomplete_current_static_is_preserved_without_inventing_a_completed_build(self):
        repo, store, _, source, generated, intake = self.metadata_state()
        missing = "src/data/generated/landing-v1.json"
        (repo / missing).unlink()
        store.backup()
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        destination = repo / "restored-partial-static"
        self.prepare_metadata(repo, backup, destination, intake)
        self.assertFalse((destination / missing).exists())
        self.assertEqual((destination / "data/source/README.md").read_bytes(), (source / "README.md").read_bytes())
        self.assertEqual(sum((destination / name).is_file() for name in generated), 9)


if __name__ == "__main__":
    unittest.main()
