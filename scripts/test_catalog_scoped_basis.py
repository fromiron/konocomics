"""A Work-scoped prior keeps the original basis identity after sparse recovery."""
from contextlib import closing
from pathlib import Path
import shutil
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

import catalog_authoring_runner  # Initialize the existing authoring import path.
import catalog_retention as retention
from catalog_authoring import publish_factor_batch as publisher
from catalog_revision_store import RevisionWorkspace


class ScopedBasisTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.repo = Path(directory.name)
        self.store = RevisionWorkspace.create(
            self.repo, self.repo / retention.BASE / "workspace.sqlite")
        pair = self.repo / retention.BASE / "pair"
        pair.mkdir()
        rows = [
            {"sourceOrdinal": index + 1, "sourceLine": index + 2,
             "id": f"work-{index}", "title": f"Original work {index}",
             "annotationReviewMethod": "",
             "annotationReviewReference": f"reviews/work-{index}.md"}
            for index in range(2)
        ]
        for name in ("catalog-expanded.candidate.sqlite", "catalog-source-registry.candidate.sqlite"):
            with closing(sqlite3.connect(pair / name)) as db, db:
                db.execute("CREATE TABLE source_works(sourceOrdinal INTEGER PRIMARY KEY, "
                           "sourceLine INTEGER, id TEXT, title TEXT, annotationReviewMethod TEXT, "
                           "annotationReviewReference TEXT)")
                db.executemany("INSERT INTO source_works VALUES (?,?,?,?,?,?)",
                               [tuple(row.values()) for row in rows])
        revisions = {}
        for row in rows:
            review = pair / "data/source" / row["annotationReviewReference"]
            review.parent.mkdir(parents=True, exist_ok=True)
            review.write_text(f"Original review for {row['id']}\n", encoding="utf-8")
            revisions[row["id"]] = self.store.put_revision("curation", row["id"], {
                "schemaVersion": "curation-baseline-v1", "workId": row["id"],
                "authorityKind": "", "tables": {"source_works": [row]},
                "legacyAuthorityRequired": False, "claims": []})
        self.basis = self.repo / retention.BASE / "retained/basis"
        retention.create_anchor(self.store, self.basis, pair, revisions)
        canonical = self.repo / "data/source/catalog.sqlite"
        canonical.parent.mkdir(parents=True)
        shutil.copyfile(pair / "catalog-expanded.candidate.sqlite", canonical)
        repository = patch.object(publisher, "REPO", self.repo)
        repository.start()
        self.addCleanup(repository.stop)
        self.requested_review = self.basis / "data/source/reviews/work-0.md"
        self.unrequested_review = self.basis / "data/source/reviews/work-1.md"
        self.unrequested_review.unlink()

    def verify_requested(self):
        publisher._verify_result_manifest(self.basis, work_ids={"work-0"})

    def test_requested_work_uses_sparse_basis_without_materializing_other_review(self):
        before = {path.relative_to(self.basis): path.read_bytes()
                  for path in self.basis.rglob("*") if path.is_file()}
        stored_before = self.store.database.read_bytes()
        self.verify_requested()
        self.assertFalse(self.unrequested_review.exists())
        self.assertEqual(before, {path.relative_to(self.basis): path.read_bytes()
                                 for path in self.basis.rglob("*") if path.is_file()})
        self.assertEqual(stored_before, self.store.database.read_bytes())

    def test_full_audit_still_requires_unrequested_original_review(self):
        with self.assertRaises((OSError, ValueError)):
            publisher._verify_result_manifest(self.basis)

    def test_requested_review_missing_fails(self):
        self.requested_review.unlink()
        with self.assertRaises((OSError, ValueError)):
            self.verify_requested()

    def test_requested_review_changed_fails(self):
        self.requested_review.write_bytes(b"Changed adjudication review")
        with self.assertRaises(ValueError):
            self.verify_requested()

    def test_either_current_pair_database_changed_fails(self):
        for name in ("catalog-expanded.candidate.sqlite", "catalog-source-registry.candidate.sqlite"):
            with self.subTest(database=name):
                path = self.basis / name
                original = path.read_bytes()
                try:
                    with closing(sqlite3.connect(path)) as db, db:
                        db.execute("UPDATE source_works SET title='Changed database row' WHERE id='work-0'")
                    with self.assertRaises(ValueError):
                        self.verify_requested()
                finally:
                    path.write_bytes(original)

    def test_rewritten_partial_manifest_cannot_replace_original_manifest(self):
        manifest = self.basis / "MANIFEST.sha256"
        lines = manifest.read_bytes().splitlines(keepends=True)
        manifest.write_bytes(b"".join(line for line in lines if b"reviews/work-1.md" not in line))
        # Merely saving different bytes must not grant them the anchor's authority.
        self.store.save([manifest], "changed sparse manifest")
        with self.assertRaises(ValueError):
            self.verify_requested()

    def test_anchor_receipt_from_another_generation_fails(self):
        marker = self.basis / "CURATION-BASELINE.json"
        value = retention.read(marker)
        value["revision"]["generation"] = "different-generation"
        retention.write(marker, value)
        manifest = self.basis / "MANIFEST.sha256"
        manifest.write_bytes(b"".join(
            f"{retention.digest(marker.read_bytes())}  CURATION-BASELINE.json\n".encode("ascii")
            if line.endswith(b"  CURATION-BASELINE.json\n") else line
            for line in manifest.read_bytes().splitlines(keepends=True)))
        self.store.save([marker, manifest], "changed anchor generation")
        with self.assertRaisesRegex(ValueError, "generation"):
            self.verify_requested()


if __name__ == "__main__":
    unittest.main()
