"""The compact writer must leave both databases under the caller's transaction."""
from contextlib import closing
from pathlib import Path
import shutil
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

from authoring_paths import REPO
import compact_publication as compact
import correct_factor_registry as correction
import publish_factor_batch as publisher


class CompactTransactionTest(unittest.TestCase):
    def test_snapshot_facts_match_sql_and_preserve_immutable_rows(self):
        backend = publisher._backend_module()
        catalog = REPO / "data/source/catalog.sqlite"
        before = backend._snapshot_db(catalog)
        facts = backend._baseline_facts_from_snapshot(before)
        self.assertEqual(facts, backend._baseline_facts(catalog))
        wid = next(iter(facts["works"]))
        facts["works"][wid]["title"] = "planner-local mutation"
        self.assertNotEqual(backend._baseline_facts_from_snapshot(before)["works"][wid]["title"], "planner-local mutation")
        plan = {"targetIds": [], "passIds": [], "blockedIds": []}
        for table, field in (("source_works", "title"), ("source_volumes", "isbn"),
                             ("source_evidence", "notes"), ("source_book_metadata", "fetchedAt")):
            with self.subTest(table=table):
                columns, rows = before[table]
                self.assertTrue(rows)
                changed = list(rows[0])
                changed[columns.index(field)] = "unauthorized change"
                after = {**before, table: (columns, (tuple(changed), *rows[1:]))}
                with self.assertRaises(ValueError):
                    backend._verify_preservation(before, after, plan, {wid})

    def test_serial_view_advances_only_on_commit_and_detects_external_writes(self):
        with tempfile.TemporaryDirectory() as directory:
            catalog = Path(directory) / "pair.sqlite"
            shutil.copyfile(REPO / "data/source/catalog.sqlite", catalog)
            backend = publisher._backend_module()
            plan = {"newEvidence": {}, "factorUpdates": [], "themeInserts": [],
                    "genreUpdates": {}, "contextInserts": [], "workUpdates": [], "passIds": []}
            with closing(sqlite3.connect(catalog)) as db:
                db.execute("attach database ':memory:' as registry")
                db.execute("create table registry.registry_meta(key text primary key,value text)")
                db.execute("create table registry.registry_research_attempts(attemptId text primary key)")
                db.execute("create table registry.registry_source_rows(sourceRowId text primary key)")
                registry = correction.snapshot(db, namespace="registry")
                prepared = {"backend": backend, "plan": plan, "gold": set(), "registryAfter": registry, "registryChanges": []}
                previous = None
                entry = {"workId": "test-only", "input": {}, "authority": {}}
                with patch.object(compact, "prepare_work", return_value=prepared):
                    for expected_reads in (2, 1):
                        db.execute("begin immediate")
                        metrics = {}
                        result, receipt, _ = compact.apply_work(entry, db, "", "", _previous=previous, _metrics=metrics)
                        self.assertEqual(metrics["sourceSnapshots"], expected_reads)
                        previous = compact._commit_view(db, result, receipt)
                    # A separate writer invalidates the view even on this connection.
                    with closing(sqlite3.connect(catalog)) as writer, writer:
                        writer.execute("update source_works set title=title || ' changed' where sourceOrdinal=(select min(sourceOrdinal) from source_works)")
                    db.execute("begin immediate")
                    metrics = {}
                    result, receipt, _ = compact.apply_work(entry, db, "", "", _previous=previous, _metrics=metrics)
                    self.assertEqual(metrics["sourceSnapshots"], 2)
                    db.rollback()
                # SQLite deferred constraints can fail at commit after all reads passed.
                db.execute("pragma foreign_keys=ON")
                db.executescript("create table commit_parent(id integer primary key); create table commit_child(parent integer references commit_parent(id) deferrable initially deferred);")
                db.execute("insert into commit_child values(1)")
                retained = previous
                with self.assertRaises(sqlite3.IntegrityError):
                    previous = compact._commit_view(db, result, receipt)
                self.assertIs(previous, retained)
                db.rollback()

    def test_interrupted_checkpoint_copy_is_rebuilt_before_receipt(self):
        with tempfile.TemporaryDirectory() as directory:
            stage, checkpoint = Path(directory) / "working", Path(directory) / "checkpoint"
            stage.mkdir()
            for name in (compact.CATALOG, compact.REGISTRY):
                (stage / name).write_bytes(("committed " + name).encode())
            original_copy = shutil.copy2
            def partial_copy(source, destination):
                if source.name == compact.REGISTRY:
                    destination.write_bytes(b"interrupted copy")
                    raise OSError("injected copy interruption")
                return original_copy(source, destination)
            with patch.object(compact.shutil, "copy2", side_effect=partial_copy):
                with self.assertRaisesRegex(OSError, "copy interruption"):
                    compact.copy_checkpoint_pair(stage, checkpoint)
            self.assertFalse((checkpoint / "CHECKPOINT.json").exists())
            compact.copy_checkpoint_pair(stage, checkpoint)
            for name in (compact.CATALOG, compact.REGISTRY):
                self.assertEqual((stage / name).read_bytes(), (checkpoint / name).read_bytes())
            (checkpoint / "CHECKPOINT.json").write_text("{}")
            (checkpoint / compact.REGISTRY).write_bytes(b"changed after receipt")
            with self.assertRaisesRegex(ValueError, "checkpoint pair changed"):
                compact.copy_checkpoint_pair(stage, checkpoint)

    def test_late_failure_rolls_back_catalog_and_registry_together(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            catalog, registry = root / compact.CATALOG, root / compact.REGISTRY
            shutil.copyfile(REPO / "data/source/catalog.sqlite", catalog)
            with closing(sqlite3.connect(registry)) as db, db:
                db.execute("create table registry_meta(key text primary key,value text)")
                db.execute("create table registry_research_attempts(attemptId text primary key)")
                db.execute("create table registry_source_rows(sourceRowId text primary key,canonicalWorkId text,volumeNumber text)")
                db.execute("insert into registry_source_rows values('row','work','')")
            backend = publisher._backend_module()
            before = backend._snapshot_db(catalog)
            registry_before = correction.snapshot(registry)
            columns, rows = before["source_evidence"]
            evidence = {**dict(zip(columns, rows[0])), "id": "test-pair-rollback"}
            changes = [{"sourceRowId": "row", "workId": "work", "field": "volumeNumber", "before": "", "after": "1"}]
            expected, pending = publisher.plan_registry_correction(changes, registry_before)
            plan = {"newEvidence": {evidence["id"]: evidence}, "factorUpdates": [], "themeInserts": [],
                    "genreUpdates": {}, "contextInserts": [], "workUpdates": []}
            prepared = {"backend": backend, "plan": plan, "gold": set(),
                        "registryAfter": expected, "registryChanges": pending}
            with closing(sqlite3.connect(catalog)) as db:
                db.execute("attach database ? as registry", (str(registry),))
                with self.assertRaisesRegex(ValueError, "owned pair transaction"):
                    compact.apply_work({}, db, "", "")
                db.execute("begin immediate")
                with patch.object(compact, "prepare_work", return_value=prepared), patch.object(
                        backend, "_verify_preservation", side_effect=ValueError("injected after both writes")):
                    with self.assertRaisesRegex(ValueError, "after both writes"):
                        compact.apply_work({}, db, "", "")
                self.assertEqual(db.execute("select volumeNumber from registry.registry_source_rows").fetchone(), ("1",))
                self.assertEqual(db.execute("select count(*) from source_evidence where id='test-pair-rollback'").fetchone(), (1,))
                with closing(sqlite3.connect(registry)) as reader:
                    self.assertEqual(correction.snapshot(reader), registry_before)
                self.assertEqual(backend._snapshot_db(catalog), before)
                db.rollback()
            self.assertEqual(correction.snapshot(registry), registry_before)
            self.assertEqual(backend._snapshot_db(catalog), before)


if __name__ == "__main__":
    unittest.main()
