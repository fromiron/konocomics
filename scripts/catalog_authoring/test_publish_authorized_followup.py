"""Exercise candidate/accepted authority through the existing planner and writer."""
import copy
import csv
import json
import shutil
import sqlite3
import subprocess
import tempfile
import unittest
from contextlib import closing
from pathlib import Path

from authoring_paths import REPO, ROOT
from compact_plan import CatalogState
import publish_factor_batch as publisher
import test_compact_plan as fixtures


class CandidateAxisAuthorityTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        fixtures.CompactPlanTest.setUpClass()
        cls.fixture = fixtures.CompactPlanTest.fixture
        cls.work_id = fixtures.CompactPlanTest.work_id
        cls.gold_id = fixtures.CompactPlanTest.gold_id

    database = fixtures.CompactPlanTest.database
    rows = fixtures.CompactPlanTest.rows

    def setUp(self):
        self.backend = publisher._backend_module()
        self.db = self.database()
        source = self.rows(self.fixture, "source_evidence", self.work_id)[0]
        self.source = {**source, "id": "test-accepted-axis", "sourceType": "manual",
                       "reviewedByHuman": "false", "extractorVersion": "authorizedEvidencePanelV1",
                       "notes": "authorizedEvidencePanelV1|accepted"}
        self.insert_evidence(self.source)
        for axis in publisher.AXES:
            art = axis in publisher.ART
            self.db.execute("update source_factors set state=?,value=?,confidence=?,evidenceId=? where workId=? and axisId=?",
                            ("unknown" if art else "known", "" if art else "2", "" if art else "0.8",
                             "" if art else self.source["id"], self.work_id, axis))
        for axis in ("progression", "worldBuilding", "mysteryReveal", "pacing", *publisher.AXES[13:]):
            raw = {**self.source, "id": "test-raw-" + axis.lower(), "sourceType": "model",
                   "extractorVersion": "catalog-expansion-v4-per-work-section",
                   "notes": "candidateOnly=true; finalSource=pass-c; work-owned evidence only"}
            self.insert_evidence(raw)
            self.db.execute("update source_factors set value=?,confidence=?,evidenceId=? where workId=? and axisId=?",
                            ("" if axis in publisher.ART else "2" if axis == "pacing" else "1",
                             "" if axis in publisher.ART else "0.7", raw["id"], self.work_id, axis))
        self.db.execute("delete from source_recommendation_context where workId=?", (self.work_id,))
        self.db.execute("update source_works set onboardingEligible='false',recommendationEligible='false',libraryOnly='true' where id=?", (self.work_id,))
        self.db.commit()
        self.baseline = self.backend._baseline_facts(self.db)
        self.frozen_source = {**self.source, "id": "test-frozen-publisher", "sourceType": "publisher",
                              "notes": "general-audience non-pornographic publisher edition"}
        self.url = self.frozen_source["sourceUrl"] or "https://example.org/publisher/edition"
        self.frozen_source["sourceUrl"] = self.url
        self.digest = "a" * 64
        self.packet = {"work": self.baseline["works"][self.work_id],
                       "representativeVolume": next(row for row in self.baseline["volumeRows"][self.work_id] if row["isRepresentative"] == "true"),
                       "sourceIdentity": self.url, "supportEvidenceUrls": [self.url],
                       "contextEvidenceId": self.frozen_source["id"], "_packetDigest": self.digest}
        self.context = {"workId": self.work_id, "evidenceIds": self.frozen_source["id"],
                        "citationUrls": self.url, "observation": "Frozen recommendation context",
                        "limitation": "One edition", "entryScope": "entry_1_3_volumes"}
        self.safety = {"decision": "accepted", "state": "known", "value": "in-scope-japanese-manga",
                       "reviewedByHuman": "false", "candidateOnly": "true", "packetDigest": self.digest,
                       "evidenceIds": self.frozen_source["id"], "citationUrls": self.url}
        self.ledger = [self.claim(axis) for axis in ("mysteryReveal", "pacing")]
        self.ledger += [self.claim(axis, unknown=True) for axis in ("progression", "worldBuilding", *publisher.AXES[13:])]

    def insert_evidence(self, row):
        columns = tuple(item[1] for item in self.db.execute('pragma table_info("source_evidence")'))
        ordinal = self.db.execute("select max(sourceOrdinal)+1 from source_evidence").fetchone()[0]
        line = self.db.execute("select max(sourceLine)+1 from source_evidence").fetchone()[0]
        self.db.execute("insert into source_evidence values (" + ",".join("?" for _ in columns) + ")",
                        (ordinal, line, *[row[key] for key in columns[2:]]))

    def claim(self, axis, unknown=False):
        return {"workId": self.work_id, "factKey": "axis:" + axis,
                "decision": "explicitUnknown" if unknown else "accepted",
                "state": "unknown" if unknown else "known", "value": "" if unknown else "2",
                "confidence": "" if unknown else "0.85", "evidenceIds": "" if unknown else self.frozen_source["id"],
                "citationUrls": "" if unknown else self.url, "entryScope": "entry_1_3_volumes",
                "observation": "Frozen claim decision", "limitation": "Limited observed scope",
                "authorityKind": "authorizedEvidencePanelV1", "authorityArtifactDigest": self.digest,
                "citationSetDigest": publisher.citation_digest([] if unknown else [self.url]),
                "candidateOnly": "true", "reviewedByHuman": "false"}

    def plan(self, ledger=None):
        return self.backend._build_plan(
            self.ledger if ledger is None else ledger,
            {self.work_id: {"panelOutcome": "PASS"}}, {self.work_id: self.context}, {},
            {self.frozen_source["id"]: self.frozen_source}, copy.deepcopy(self.baseline),
            "2026-10-01T12:00:00+09:00", "reviews/authorized-evidence-panel-v1-regression.md",
            packets={self.work_id: self.packet}, chunk_digests={self.work_id: self.digest},
            gold_ids={self.gold_id}, prior={self.work_id + "\x1fscope:safety": self.safety})

    def test_candidate_numbers_and_explicit_unknown_match_sql_and_independent_readback(self):
        before = self.backend._snapshot_db(self.db)
        plan = self.plan()
        state = CatalogState(before, {self.gold_id})
        state.apply(plan)
        self.db.execute("begin immediate")
        self.backend.apply_plan_in_transaction(self.db, plan)
        self.backend.verify_expected_after(self.db, before, plan, {self.gold_id})
        after = self.backend._snapshot_db(self.db)
        self.assertEqual(after, state.snapshot())
        factors = {row["axisId"]: row for row in self.rows(after, "source_factors", self.work_id)}
        for axis in ("mysteryReveal", "pacing"):
            expected = self.backend._claim_evidence_id(self.claim(axis))
            self.assertEqual(tuple(factors[axis][field] for field in ("state", "value", "confidence", "evidenceId")),
                             ("known", "2", "0.85", expected))
        for axis in ("progression", "worldBuilding", *publisher.AXES[13:]):
            expected = self.backend._claim_evidence_id(self.claim(axis, unknown=True))
            self.assertEqual(tuple(factors[axis][field] for field in ("state", "value", "confidence", "evidenceId")), ("unknown", "", "", expected))
            decision_evidence = plan["newEvidence"][expected]
            self.assertEqual(decision_evidence["sourceUrl"], "")
            self.assertEqual(decision_evidence["reviewedByHuman"], "false")
            self.assertIn('"decision":"explicitUnknown"', decision_evidence["notes"])
        prior_evidence = {row["id"]: row for row in self.rows(before, "source_evidence")}
        after_evidence = {row["id"]: row for row in self.rows(after, "source_evidence")}
        self.assertTrue(all(after_evidence[eid] == row for eid, row in prior_evidence.items()))
        self.db.rollback()
        self.assertEqual(before, self.backend._snapshot_db(self.db))

    def test_collected_editions_do_not_establish_series_volume_count(self):
        for collected_count in (1, 3):
            with self.subTest(collected_count=collected_count):
                self.baseline["volumes"][self.work_id] = collected_count
                plan = self.plan()
                self.assertEqual(plan["contextInserts"][0]["volumeCount"], "0")
                self.db.execute("begin immediate")
                self.backend.apply_plan_in_transaction(self.db, plan)
                self.assertEqual(self.db.execute(
                    "select volumeCount from source_recommendation_context where workId=?",
                    (self.work_id,),
                ).fetchone()[0], "0")
                self.db.rollback()

    def test_accepted_human_panel_and_correction_conflicts_remain_rejected(self):
        eid = self.baseline["factors"][(self.work_id, "mysteryReveal")]["evidenceId"]
        original = self.baseline["evidence"][eid]
        for changes in ({"reviewedByHuman": "true"}, {"extractorVersion": "authorizedEvidencePanelV1"},
                        {"notes": "candidateOnly=true; authorizedModelPanel"},
                        {"notes": "candidateOnly=true; priorClaimCorrectionV1"},
                        {"notes": "raw model without candidate marker"}, {"workId": "different-work"}):
            with self.subTest(changes=changes):
                self.baseline["evidence"][eid] = {**original, **changes}
                with self.assertRaisesRegex(self.backend.PublishError, "accepted baseline axis conflict"):
                    self.plan()
        self.baseline["evidence"][eid] = original

    def test_protected_known_cannot_be_weakened_to_unknown(self):
        eid = self.baseline["factors"][(self.work_id, "progression")]["evidenceId"]
        self.baseline["evidence"][eid]["extractorVersion"] = "authorizedEvidencePanelV1"
        with self.assertRaisesRegex(self.backend.PublishError, "accepted baseline axis conflict"):
            self.plan()

    def fresh_prior_input(self):
        """A raw work can retain one already adjudicated Axis correction."""
        folder = tempfile.TemporaryDirectory(prefix="publisher-preserved-prior-")
        self.addCleanup(folder.cleanup)
        root = Path(folder.name)
        input_root, result_root = root / "input", root / "result"
        raw_id = "test-raw-progression"
        self.db.execute("update source_factors set evidenceId=? where workId=?", (raw_id, self.work_id))
        self.db.execute("update source_factors set state='known',value='2',confidence='0.85',evidenceId=? where workId=? and axisId='relationshipStructure'", (self.source["id"], self.work_id))
        self.db.execute("update source_themes set evidenceId=? where workId=?", (raw_id, self.work_id))
        self.db.execute("update source_works set annotationReviewMethod='unreviewed',evidenceId=? where id=?", (raw_id, self.work_id))
        self.db.execute("update source_evidence set sourceUrl=? where id=?", (self.url, self.source["id"]))
        self.db.commit()
        self.baseline = self.backend._baseline_facts(self.db)
        self.packet["work"] = self.baseline["works"][self.work_id]
        self.ledger = [self.claim(axis, unknown=axis in publisher.ART) for axis in publisher.AXES]
        prior = {**self.claim("relationshipStructure"), "factType": "axis", "evidenceIds": self.source["id"], "reasonCode": "PRESERVED_VERIFIED_PRIOR"}
        self.ledger = [prior if row["factKey"] == prior["factKey"] else row for row in self.ledger]
        for genre in self.baseline["works"][self.work_id]["genres"].split(";"):
            if genre:
                self.ledger.append({**self.claim("relationshipStructure"), "factKey": "genre:" + genre, "value": "true"})
        for (wid, theme), row in self.baseline["themes"].items():
            if wid == self.work_id:
                self.ledger.append({**self.claim("relationshipStructure"), "factKey": "theme:" + theme, "value": row["centrality"]})
        source = self.baseline["evidence"][self.source["id"]]
        source = {**source, "retrievedAt": source["fetchedAt"], "observation": source["notes"], "limitation": "Frozen prior source record."}
        authority = {"claims": {(self.work_id, prior["factKey"]): {publisher.panel_validation.claim_semantic_digest(prior): prior}}, "evidence": {source["id"]: source}}

        def write(path, fields, rows):
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("w", encoding="utf-8", newline="") as stream:
                writer = csv.DictWriter(stream, fieldnames=fields, extrasaction="ignore", lineterminator="\n")
                writer.writeheader()
                writer.writerows(rows)

        write(input_root / "chunks/chunk-01/prior-panel-claims.csv", publisher.PRIOR_FIELDS, [prior])
        write(result_root / "chunk-01/promotion-ledger.csv", publisher.PROMOTION_FIELDS, [{"workId": self.work_id, "panelOutcome": "PASS"}])
        write(result_root / "chunk-01/evidence-panel-ledger.csv", publisher.LEDGER_FIELDS, self.ledger)
        return input_root, result_root, authority

    def test_stored_withdrawal_validates_exact_frozen_prior_and_native_readback(self):
        # An already eligible AEP work with retained numeric context and no Axis
        # updates must still take the correction path, not context-only replay.
        for axis in publisher.AXES:
            art = axis in publisher.ART
            self.db.execute("update source_factors set state=?,value=?,confidence=?,evidenceId=? where workId=? and axisId=?", ("unknown" if art else "known", "" if art else "2", "" if art else "0.8", "" if art else self.source["id"], self.work_id, axis))
        self.db.execute("update source_works set onboardingEligible='true',recommendationEligible='true',libraryOnly='false' where id=?", (self.work_id,))
        context = self.rows(self.fixture, "source_recommendation_context", self.work_id)[0]
        self.db.execute("insert into source_recommendation_context values(?,?,?,?,?,?,?,?)", tuple(context.values()))
        self.integration = fixtures.CompactPlanTest.integration
        self.integration.reindex_authority_projection(self.db, {"source_recommendation_context"})
        self.db.commit()
        for kind in ("genre", "theme"):
            with self.subTest(kind=kind):
                self.db.execute("update source_works set genres='fantasy;horror;mystery' where id=?", (self.work_id,))
                self.db.commit()
                baseline = self.backend._baseline_facts(self.db)
                tag = "mystery" if kind == "genre" else next(name for wid, name in baseline["themes"] if wid == self.work_id)
                current = baseline["works"][self.work_id] if kind == "genre" else baseline["themes"][(self.work_id, tag)]
                prior = {**self.claim("relationshipStructure"), "factKey": kind + ":" + tag,
                         "factType": kind, "value": "true" if kind == "genre" else current["centrality"], "reasonCode": "ORIGINAL_ACCEPTED"}
                decision = {"workId": self.work_id, "factKey": prior["factKey"], "action": "WITHDRAW", "reasonCode": "NEW_FROZEN_OBSERVATION_CONTRADICTS_PRIOR",
                            "priorSemanticSha256": publisher.panel_validation.claim_semantic_digest(prior),
                            "baselineSemanticSha256": publisher.panel_validation.baseline_stored_tag_digest(self.work_id, prior["factKey"], current),
                            "resultSemanticSha256": publisher.panel_validation.claim_semantic_digest(None)}
                ledger = [self.claim(axis, unknown=axis in publisher.ART) for axis in publisher.AXES]
                with tempfile.TemporaryDirectory() as folder:
                    root = Path(folder)
                    def write(path, fields, rows):
                        path.parent.mkdir(parents=True, exist_ok=True)
                        with path.open("w", encoding="utf-8", newline="") as stream:
                            writer = csv.DictWriter(stream, fieldnames=fields, extrasaction="ignore", restval="", lineterminator="\n")
                            writer.writeheader()
                            writer.writerows(rows)
                    write(root / "input/prior-claim-decisions.csv", publisher.panel_validation.DECISION_FIELDS, [decision])
                    write(root / "input/chunks/chunk-01/prior-panel-claims.csv", publisher.PRIOR_FIELDS, [prior])
                    write(root / "result/chunk-01/evidence-panel-ledger.csv", publisher.LEDGER_FIELDS, ledger)
                    (root / "result/chunk-01/evidence-panel-summary.json").write_text(json.dumps({"works": [{"workId": self.work_id, "coverage": {}}]}) + "\n")
                    corrections = publisher._validate_axis_corrections(root / "input", root / "result", self.db, self.db)
                    self.assertIsNone(corrections[(self.work_id, prior["factKey"])]["result"])
                    # Current drift and a non-omitted result are rejected against the
                    # original frozen digest, before any transaction may publish.
                    sql = "update source_works set evidenceId='stale' where id=?" if kind == "genre" else "update source_themes set confidence='0.01' where workId=? and themeId=?"
                    params = (self.work_id,) if kind == "genre" else (self.work_id, tag)
                    self.db.execute(sql, params)
                    with self.assertRaisesRegex(publisher.ValidationError, "baseline semantic binding mismatch"):
                        publisher._validate_axis_corrections(root / "input", root / "result", self.db, self.db)
                    self.db.rollback()
                    write(root / "result/chunk-01/evidence-panel-ledger.csv", publisher.LEDGER_FIELDS, [*ledger, prior])
                    with self.assertRaisesRegex(publisher.ValidationError, "explicitly withdraw"):
                        publisher._validate_axis_corrections(root / "input", root / "result", self.db, self.db)
                    write(root / "result/chunk-01/evidence-panel-ledger.csv", publisher.LEDGER_FIELDS, ledger)
                    self.backend = publisher._backend_module(prior_corrections=corrections)
                    self.baseline, self.ledger = baseline, ledger
                    self.packet["work"] = baseline["works"][self.work_id]
                    before = self.backend._snapshot_db(self.db)
                    plan = self.plan()
                    self.assertFalse(plan["tagCorrections"][0]["published"])
                    self.assertFalse(plan["tagCorrections"][0]["retainedStoredTag"])
                    self.assertFalse(plan["contextOnlyWorkUpdates"])
                    expected = CatalogState(before, {self.gold_id})
                    expected.apply(plan)
                    self.db.execute("begin immediate")
                    self.backend.apply_plan_in_transaction(self.db, plan)
                    self.backend.verify_expected_after(self.db, before, plan, {self.gold_id})
                    self.assertEqual(self.backend._snapshot_db(self.db), expected.snapshot())
                    originals = {row["id"]: row for row in self.rows(before, "source_evidence")}
                    actual = {row["id"]: row for row in self.rows(expected.snapshot(), "source_evidence")}
                    self.assertTrue(all(actual[eid] == row for eid, row in originals.items()))
                    self.assertIn("priorClaimCorrectionV1|", actual[plan["tagCorrections"][0]["correctionEvidenceId"]]["notes"])
                    if kind == "genre":
                        self.db.execute("savepoint unexpected")
                        self.db.execute("update source_works set genres='horror' where id=?", (self.work_id,))
                        with self.assertRaisesRegex(ValueError, "final membership readback mismatch"):
                            self.backend.verify_expected_after(self.db, before, plan, {self.gold_id})
                        self.db.execute("rollback to unexpected")
                        self.db.execute("release unexpected")
                    # A replay cannot silently omit the old membership again.
                    with self.assertRaisesRegex(ValueError, "lost exact baseline"):
                        self.backend.apply_plan_in_transaction(self.db, plan)
                    self.db.rollback()
                    self.assertEqual(before, self.backend._snapshot_db(self.db))

    def test_fresh_raw_tags_preserve_exact_prior_axis_through_writer_and_readback(self):
        input_root, result_root, authority = self.fresh_prior_input()
        snapshots = publisher._validate_fresh_unreviewed_snapshots(input_root, result_root, self.db, self.db, authority)
        self.assertEqual(snapshots[self.work_id]["preservedAxes"], ["relationshipStructure"])
        self.backend = publisher._backend_module(prior_evidence=authority["evidence"], prior_authority=authority, fresh_snapshots=snapshots)
        before = self.backend._snapshot_db(self.db)
        plan = self.plan()
        self.assertFalse(any(row["axisId"] == "relationshipStructure" for row in plan["factorUpdates"]))
        expected = CatalogState(before, {self.gold_id})
        expected.apply(plan)
        self.db.execute("begin immediate")
        self.backend.apply_plan_in_transaction(self.db, plan)
        self.backend.verify_expected_after(self.db, before, plan, {self.gold_id})
        after = self.backend._snapshot_db(self.db)
        self.assertEqual(after, expected.snapshot())
        prior_axis = next(row for row in self.rows(before, "source_factors", self.work_id) if row["axisId"] == "relationshipStructure")
        actual_axis = next(row for row in self.rows(after, "source_factors", self.work_id) if row["axisId"] == "relationshipStructure")
        self.assertEqual(actual_axis, prior_axis)
        old_sources = {row["id"]: row for row in self.rows(before, "source_evidence")}
        new_sources = {row["id"]: row for row in self.rows(after, "source_evidence")}
        self.assertEqual(new_sources[self.source["id"]], old_sources[self.source["id"]])
        self.db.rollback()

    def test_fresh_prior_preserves_semantic_claim_without_transport_fact_type(self):
        input_root, result_root, authority = self.fresh_prior_input()
        path = input_root / "chunks/chunk-01/prior-panel-claims.csv"
        rows = publisher.read_csv(path, publisher.PRIOR_FIELDS)
        rows[0]["factType"] = ""
        with path.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=publisher.PRIOR_FIELDS, lineterminator="\n")
            writer.writeheader()
            writer.writerows(rows)
        snapshots = publisher._validate_fresh_unreviewed_snapshots(input_root, result_root, self.db, self.db, authority)
        self.assertEqual(snapshots[self.work_id]["preservedAxes"], ["relationshipStructure"])

    def test_fresh_prior_rejects_missing_or_forged_authority(self):
        input_root, result_root, authority = self.fresh_prior_input()
        for claims in ({}, {(self.work_id, "axis:relationshipStructure"): {}}):
            with self.subTest(claims=claims), self.assertRaises(publisher.ValidationError):
                publisher._validate_fresh_unreviewed_snapshots(input_root, result_root, self.db, self.db, {**authority, "claims": claims})

    def test_fresh_prior_rejects_stored_value_confidence_or_evidence_drift(self):
        input_root, result_root, authority = self.fresh_prior_input()
        for column, value in (("value", "3"), ("confidence", "0.99"), ("state", "notApplicable")):
            with self.subTest(column=column):
                self.db.execute(f"update source_factors set {column}=? where workId=? and axisId='relationshipStructure'", (value, self.work_id))
                with self.assertRaisesRegex(publisher.ValidationError, "without exact stored prior"):
                    publisher._validate_fresh_unreviewed_snapshots(input_root, result_root, self.db, self.db, authority)
                self.db.rollback()
        self.db.execute("update source_evidence set notes='authorizedEvidencePanelV1 tampered' where id=?", (self.source["id"],))
        with self.assertRaisesRegex(publisher.ValidationError, "without exact stored prior"):
            publisher._validate_fresh_unreviewed_snapshots(input_root, result_root, self.db, self.db, authority)
        self.db.rollback()

    def test_fresh_prior_rejects_changed_or_omitted_result(self):
        input_root, result_root, authority = self.fresh_prior_input()
        ledger = result_root / "chunk-01/evidence-panel-ledger.csv"
        prior = next(row for row in self.ledger if row["factKey"] == "axis:relationshipStructure")
        for changed in ({**prior, "value": "3"}, None):
            rows = [row for row in self.ledger if row["factKey"] != "axis:relationshipStructure"]
            if changed is not None:
                rows.append(changed)
            with ledger.open("w", encoding="utf-8", newline="") as stream:
                writer = csv.DictWriter(stream, fieldnames=publisher.LEDGER_FIELDS, extrasaction="ignore", lineterminator="\n")
                writer.writeheader()
                writer.writerows(rows)
            with self.subTest(changed=changed), self.assertRaisesRegex(publisher.ValidationError, "accepted prior claim changed or omitted"):
                publisher._validate_fresh_unreviewed_snapshots(input_root, result_root, self.db, self.db, authority)

    def test_fresh_prior_does_not_authorize_protected_tags(self):
        input_root, result_root, authority = self.fresh_prior_input()
        self.db.execute("update source_themes set evidenceId=? where workId=?", (self.source["id"], self.work_id))
        with self.assertRaisesRegex(publisher.ValidationError, "without exact stored prior"):
            publisher._validate_fresh_unreviewed_snapshots(input_root, result_root, self.db, self.db, authority)
        self.db.rollback()

    def test_corrected_unknown_can_be_filled_by_new_frozen_claim(self):
        self._verify_actual_frozen_operator("work-24ae5b81951d389bc686", "run-v1")

    def test_unadjudicated_raw_number_cannot_supply_pass_coverage(self):
        with self.assertRaisesRegex(self.backend.PublishError, "raw candidate axis lacks panel decision"):
            self.plan([row for row in self.ledger if row["factKey"] != "axis:pacing"])

    def test_axis_or_authority_change_after_planning_rejects_application(self):
        for authority in (False, True):
            with self.subTest(authority=authority):
                plan = self.plan()
                before = self.backend._snapshot_db(self.db)
                self.db.execute("begin immediate")
                if authority:
                    self.db.execute("update source_evidence set reviewedByHuman='true' where id='test-raw-mysteryreveal'")
                    error = "candidate axis authority changed before apply"
                else:
                    self.db.execute("update source_factors set value='4' where workId=? and axisId='mysteryReveal'", (self.work_id,))
                    error = "candidate factor lost exact baseline row"
                with self.assertRaisesRegex(self.backend.PublishError, error):
                    self.backend.apply_plan_in_transaction(self.db, plan)
                self.db.rollback()
                self.assertEqual(before, self.backend._snapshot_db(self.db))

    def test_actual_frozen_partial_prior_candidate_passes_catalog_authority_pipeline(self):
        """Use the actual immutable operator artifacts in an OS temporary copy."""
        self._verify_actual_frozen_operator("work-c3ebab6ae5773c22b168", "run-v2")

    def _verify_actual_frozen_operator(self, wid, revision):
        import factor_single_pass as single

        run = ROOT / "planning/parallel-recovery-20261001-v2/batch-01/adjudication" / wid / revision
        if not (run / "RUN.json").is_file():
            self.skipTest("Actual frozen operator artifact is unavailable")
        run_record = json.loads((run / "RUN.json").read_text(encoding="utf-8"))
        baseline = Path(run_record["baselineRoot"]) / "catalog-expanded.candidate.sqlite"
        registry_path = Path(run_record["registryPath"])
        input_root, result_root = run / "frozen/panel-input", run / "result-001/panel-result"
        unchanged = {path: publisher.sha256(path) for path in (baseline, registry_path, run / "decisions.json", input_root / "PANEL-INPUT.sha256", run / "result-001/MANIFEST.sha256")}
        prior = publisher.panel_validation.load_prior_authority(input_root, baseline, work_ids={wid})
        safety = publisher._publication_safety(run / "result-001/safety-recheck-v1", input_root, result_root, {})
        backend = publisher._backend_module(safety, prior["evidence"], prior_authority=prior)
        single.install_backend(backend, input_root, result_root)
        verified = backend.verify_immutable(input_root, result_root)
        registry = backend._bind_frozen_registry(input_root, {wid}, backend.ensure_registry(registry_path, {wid}))
        gold = backend._load_gold_ids(REPO / "data/staging/catalog-expansion/gold-set-manifest.json")
        reviewed_at = "2026-10-01T12:00:00+09:00"
        reference = "reviews/authorized-evidence-panel-v1-regression.md"
        with tempfile.TemporaryDirectory(prefix="publisher-actual-unknown-") as directory:
            artifact = Path(directory)
            candidate = artifact / "data/source/catalog.sqlite"
            candidate.parent.mkdir(parents=True)
            shutil.copyfile(baseline, candidate)
            with closing(sqlite3.connect(candidate)) as db:
                db.execute("begin immediate")
                before = backend._snapshot_db(db)
                plan, _, _ = backend.plan_against_current(db, verified, registry, reviewed_at, reference, gold, baseline_snapshot=before)
                expected = CatalogState(before, gold)
                expected.apply(plan)
                backend.apply_plan_in_transaction(db, plan)
                backend.verify_expected_after(db, before, plan, gold)
                self.assertEqual(backend._snapshot_db(db), expected.snapshot())
                actual = {row[0]: row[1:] for row in db.execute("select axisId,state,value,confidence,evidenceId from source_factors where workId=?", (wid,))}
                ledger = {row["factKey"].split(":", 1)[1]: row for row in verified["rows"] if row["factKey"].startswith("axis:")}
                self.assertEqual(set(actual), set(publisher.AXES))
                old_factors = {row["axisId"]: row for row in self.rows(before, "source_factors", wid)}
                updated_axes = {row["axisId"] for row in plan["factorUpdates"] if row["workId"] == wid}
                for axis, row in ledger.items():
                    expected_id = backend._claim_evidence_id(row) if axis in updated_axes else old_factors[axis]["evidenceId"]
                    self.assertEqual(actual[axis], (row["state"], row["value"], row["confidence"], expected_id))
                    if row["state"] == "known":
                        self.assertEqual(expected_id, backend._claim_evidence_id(row))
                db.commit()
            backend._prepare_review_artifacts(
                artifact, input_root=input_root, result_root=result_root, baseline_db=baseline,
                baseline_snapshot=before, prepared={**verified, "targetCount": 1}, plan=plan,
                baseline_sha=unchanged[baseline], reviewed_at=reviewed_at, review_reference=reference)
            program = '''
import { runCatalogPipelineFromAuthority } from "./scripts/catalog/pipeline.ts";
const result = runCatalogPipelineFromAuthority(process.argv[1]);
const work = result.catalog.works.find(work => work.id === process.argv[2]);
console.log(JSON.stringify({errors: result.issues.filter(issue => issue.severity === "error"), work}));
'''
            checked = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", program, str(candidate.parent), wid],
                                     cwd=REPO, text=True, encoding="utf-8", capture_output=True)
            self.assertEqual(checked.returncode, 0, checked.stderr)
            product = json.loads(checked.stdout)
            self.assertEqual(product["errors"], [])
            self.assertTrue(product["work"]["eligibility"]["recommendationEligible"])
            for axis, row in ledger.items():
                factor = product["work"]["axes"][axis]
                self.assertEqual(factor["state"], row["state"])
                if row["state"] == "known":
                    self.assertEqual(factor["value"], int(row["value"]))
                else:
                    self.assertEqual(factor, {"state": "unknown"})
        self.assertEqual(unchanged, {path: publisher.sha256(path) for path in unchanged})


if __name__ == "__main__":
    unittest.main()
