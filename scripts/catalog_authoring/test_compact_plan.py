"""Compare the independent plan model to every existing SQL materializer."""
from contextlib import closing
import csv
import importlib.util
import io
import sqlite3
import unittest
from unittest.mock import patch

from authoring_paths import REPO, LEGACY
from compact_plan import CatalogState
import publish_factor_batch as publisher


class CompactPlanTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.backend = publisher._backend_module()
        spec = importlib.util.spec_from_file_location("compact_plan_test_integration", LEGACY / "integration-publisher-v1/integrate.py")
        cls.integration = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.integration)
        with closing(sqlite3.connect(f"file:{(REPO / 'data/source/catalog.sqlite').as_posix()}?mode=ro", uri=True)) as db:
            ids = [row[0] for row in db.execute("select id from source_works where annotationReviewMethod='authorizedEvidencePanel' and recommendationEligible='true' order by sourceOrdinal")]
            cls.work_id = next(wid for wid in ids if not cls.integration.coverage(db, wid)[-1])
            cls.gold_id = db.execute("select id from source_works where annotationReviewMethod='authorizedModelPanel' order by sourceOrdinal limit 1").fetchone()[0]
            cls.fixture = {}
            for (table,) in db.execute("select name from sqlite_master where type='table' order by name"):
                columns = tuple(row[1] for row in db.execute(f'pragma table_info("{table}")'))
                owner = "id" if table == "source_works" else "workId"
                if owner in columns and table != "source_book_metadata":
                    rows = db.execute(f'select * from "{table}" where "{owner}" in (?,?) order by sourceOrdinal', (cls.work_id, cls.gold_id)).fetchall()
                else:
                    rows = db.execute(f'select * from "{table}" order by sourceOrdinal').fetchall()
                # A small real-data fixture still has a valid CSV projection.
                projected, line = [], 1
                for ordinal, row in enumerate(rows, 1):
                    stream = io.StringIO(newline="")
                    csv.writer(stream, lineterminator="\n").writerow([str(value) for value in row[2:]])
                    line += stream.getvalue().count("\n")
                    projected.append((ordinal, line, *row[2:]))
                cls.fixture[table] = (columns, tuple(projected))

    def database(self):
        db = sqlite3.connect(":memory:")
        self.addCleanup(db.close)
        for name, (columns, rows) in self.fixture.items():
            declarations = ','.join(f'"{column}" ' + ('integer primary key' if i == 0 else 'integer' if i == 1 else 'text') for i, column in enumerate(columns))
            db.execute(f'create table "{name}" ({declarations})')
            db.executemany(f'insert into "{name}" values ({",".join("?" for _ in columns)})', rows)
        db.commit()
        return db

    def rows(self, snapshot, table, wid=None):
        columns, rows = snapshot[table]
        owner = "id" if table == "source_works" else "workId"
        return [dict(zip(columns, row)) for row in rows if wid is None or row[columns.index(owner)] == wid]

    def plan(self):
        return {"targetIds": [self.work_id], "newEvidence": {}, "factorUpdates": [],
                "themeInserts": [], "genreUpdates": {}, "contextInserts": [], "workUpdates": [],
                "passIds": [self.work_id], "blockedIds": [], "priorCorrections": [],
                "correctionBlockedIds": [], "correctionReviewedAt": "2026-09-26",
                "correctionReviewReference": "reviews/authorized-evidence-panel-v1-test.md"}

    def evidence(self, before, suffix):
        return {**self.rows(before, "source_evidence", self.work_id)[0], "id": "test-independent-" + suffix}

    def parity(self, db, plan, backend=None):
        backend = backend or publisher._backend_module()
        before = backend._snapshot_db(db)
        state = CatalogState(before, {self.gold_id})
        state.apply(plan)
        expected = state.snapshot()
        db.execute("begin immediate")
        backend.apply_plan_in_transaction(db, plan)
        after = backend._snapshot_db(db)
        self.assertEqual(after, expected)
        for name, (columns, values) in state.scope({self.work_id}).items():
            owner = "id" if name == "source_works" else "workId"
            selected = tuple(row for row in after[name][1] if owner in columns and row[columns.index(owner)] == self.work_id)
            self.assertEqual(values, selected)
        db.rollback()
        self.assertEqual(backend._snapshot_db(db), before)
        self.assertEqual(expected["source_book_metadata"], before["source_book_metadata"])
        return state, expected

    def test_normal_plan_and_target_scope_use_no_whole_table_scan(self):
        db = self.database()
        factor = self.rows(self.fixture, "source_factors", self.work_id)[0]
        db.execute("update source_factors set state='unknown',value='',confidence='' where workId=? and axisId=?", (self.work_id, factor["axisId"]))
        db.execute("delete from source_recommendation_context where workId=?", (self.work_id,))
        db.commit()
        before, plan = self.backend._snapshot_db(db), self.plan()
        evidence = self.evidence(before, "normal")
        second = {**evidence, "id": evidence["id"] + "-a"}
        plan["newEvidence"] = {second["id"]: second, evidence["id"]: evidence}
        plan["factorUpdates"] = [{**factor, "state": "known", "value": "2", "confidence": "0.99", "evidenceId": evidence["id"]}]
        plan["genreUpdates"] = {self.work_id: "fantasy;comedy"}
        plan["themeInserts"] = [{"workId": self.work_id, "themeId": "test-new-theme", "centrality": "2", "confidence": "0.9", "evidenceId": evidence["id"]}]
        plan["contextInserts"] = self.rows(self.fixture, "source_recommendation_context", self.work_id)
        plan["workUpdates"] = [{"id": self.work_id, "annotationReviewedAt": "2026-09-26", "annotationReviewReference": "reviews/test.md"}]
        old = self.rows(before, "source_evidence", self.work_id)[0]
        plan["evidenceUpdates"] = {old["id"]: {"sourceType": "manual", "notes": "updated context provenance"}}
        state = CatalogState(before, {self.gold_id})
        with patch.object(type(state.tables["source_works"]), "all_rows", side_effect=AssertionError("ordinary work scanned all rows")):
            state.apply(plan)
            state.scope({self.work_id})
        self.parity(db, plan)

    def test_context_only_preserves_status_and_factor_metadata(self):
        db, plan = self.database(), self.plan()
        before = self.backend._snapshot_db(db)
        work = self.rows(before, "source_works", self.work_id)[0]
        plan["contextOnlyWorkUpdates"] = {self.work_id: {k: work[k] for k in ("annotationReviewedAt", "annotationReviewReference")}}
        plan["workUpdates"] = [{"id": self.work_id, "annotationReviewedAt": "2026-09-26", "annotationReviewReference": "reviews/new-context.md"}]
        evidence = self.evidence(before, "context")
        plan["newEvidence"] = {evidence["id"]: evidence}
        _, expected = self.parity(db, plan)
        self.assertEqual(expected["source_factors"], before["source_factors"])

    def test_correction_pass_and_demotion_match_exact_projection(self):
        for active in (True, False):
            with self.subTest(active=active):
                db, plan = self.database(), self.plan()
                before = self.backend._snapshot_db(db)
                factors = self.rows(before, "source_factors", self.work_id)
                corrected = factors[:1] if active else factors
                for old in corrected:
                    after = {**old, "state": "known" if active else "unknown", "value": "2" if active else "", "confidence": "0.9" if active else ""}
                    plan["factorUpdates"].append(after)
                    plan["priorCorrections"].append({"before": old, "after": after})
                final = {r["axisId"]: r for r in factors}
                final.update({r["axisId"]: r for r in plan["factorUpdates"]})
                plan["correctionAxisSnapshot"] = {self.work_id: {axis: {k: r[k] for k in ("state", "value")} for axis, r in final.items()}}
                plan["correctionAxisUpdates"] = plan["priorCorrections"]
                plan["correctionPanelCoverage"] = {self.work_id: {}}
                plan["correctionBlockedIds"] = [] if active else [self.work_id]
                backend = publisher._backend_module()
                publisher._install_correction_materializer(backend)
                self.parity(db, plan, backend)

    def test_fresh_snapshot_replacement_keeps_historical_evidence(self):
        db, plan = self.database(), self.plan()
        before = self.backend._snapshot_db(db)
        work = self.rows(before, "source_works", self.work_id)[0]
        themes = [{k: row[k] for k in ("workId", "themeId", "centrality", "confidence", "evidenceId")} for row in self.rows(before, "source_themes", self.work_id)]
        factors = self.rows(before, "source_factors", self.work_id)
        evidence = self.evidence(before, "fresh")
        plan["newEvidence"] = {evidence["id"]: evidence}
        factor_rows = [{"before": row, "after": {**row, "evidenceId": evidence["id"]}} for row in factors]
        after_themes = [{**row, "evidenceId": evidence["id"]} for row in themes]
        plan["factorUpdates"], plan["themeInserts"] = [r["after"] for r in factor_rows], after_themes
        plan["genreUpdates"] = {self.work_id: work["genres"]}
        plan["freshSnapshots"] = {self.work_id: {"factorRows": factor_rows, "beforeGenres": work["genres"], "afterGenres": work["genres"], "beforeThemes": themes, "afterThemes": after_themes}}
        backend = publisher._backend_module()
        publisher._install_correction_materializer(backend)
        self.parity(db, plan, backend)

    def test_recovery_pass_and_blocked_snapshot_replace_only_target(self):
        for active in (True, False):
            with self.subTest(active=active):
                db, plan = self.database(), self.plan()
                before = self.backend._snapshot_db(db)
                binding = publisher._target_semantic_snapshot(db, self.work_id)
                work = self.rows(before, "source_works", self.work_id)[0]
                factors = self.rows(before, "source_factors", self.work_id)
                evidence = self.evidence(before, "recovery")
                plan["newEvidence"] = {evidence["id"]: evidence}
                rows = [{"before": row, "after": {**row, "state": row["state"] if active else "unknown", "value": row["value"] if active else "", "confidence": row["confidence"] if active else "", "evidenceId": evidence["id"]}} for row in factors]
                themes = [{**r, "evidenceId": evidence["id"]} for r in self.rows(before, "source_themes", self.work_id)]
                plan["factorUpdates"], plan["themeInserts"] = [r["after"] for r in rows], themes
                plan["contextInserts"] = self.rows(before, "source_recommendation_context", self.work_id) if active else []
                plan["recoverySnapshots"] = {self.work_id: {"bindingSha256": binding["sha256"], "beforeSnapshot": binding, "factorRows": rows, "afterGenres": work["genres"], "afterThemes": themes}}
                plan["recoveryPromotions"] = {self.work_id: {"panelOutcome": "PASS" if active else "BLOCKED", "panelBlockerCode": "" if active else "NARRATIVE_COVERAGE_INCOMPLETE;TONE_COVERAGE_INCOMPLETE"}}
                plan["recoveryReviewedAt"], plan["recoveryReviewReference"] = "2026-09-26", "reviews/new-recovery.md"
                backend = publisher._backend_module()
                publisher._install_recovery_materializer(backend)
                self.parity(db, plan, backend)

    def test_tag_correction_uses_validated_rows_and_retains_existing_tag(self):
        db, plan = self.database(), self.plan()
        before = self.backend._snapshot_db(db)
        evidence = self.evidence(before, "tag-correction")
        plan["newEvidence"] = {evidence["id"]: evidence}
        plan["tagCorrections"] = [{"retainedStoredTag": True, "published": True, "correctionEvidenceId": evidence["id"]}]
        _, expected = self.parity(db, plan)
        self.assertEqual(expected["source_themes"], before["source_themes"])
        self.assertEqual(expected["source_works"], before["source_works"])

    def test_gold_non_target_and_exact_baseline_are_rejected(self):
        for kind in ("gold", "non-target", "known-factor"):
            with self.subTest(kind=kind):
                state, plan = CatalogState(self.fixture, {self.gold_id}), self.plan()
                if kind == "gold":
                    plan["targetIds"] = [self.gold_id]
                elif kind == "non-target":
                    plan["targetIds"] = []
                    plan["genreUpdates"] = {self.work_id: "changed"}
                else:
                    plan["factorUpdates"] = [next(row for row in self.rows(self.fixture, "source_factors", self.work_id) if row["state"] == "known")]
                with self.assertRaises(ValueError):
                    state.apply(plan)

    def test_final_expected_snapshot_exposes_unplanned_metadata_mutation(self):
        db, plan = self.database(), self.plan()
        state = CatalogState(self.backend._snapshot_db(db), {self.gold_id})
        state.apply(plan)
        changed = db.execute("update source_book_metadata set fetchedAt='unplanned'")
        self.assertGreater(changed.rowcount, 0)
        self.assertNotEqual(state.snapshot(), self.backend._snapshot_db(db))


if __name__ == "__main__":
    unittest.main()
