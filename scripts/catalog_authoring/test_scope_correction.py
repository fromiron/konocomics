"""Eligibility-only scope correction, through existing private operator paths.

Test decisions exercise the compiler, never assert a new model adjudication or
mutate the shared Catalog, curation basis, registry, STATE or preserved runs.
"""
import copy
import json
import shutil
import sqlite3
import subprocess
import tempfile
import unittest
from contextlib import closing
from pathlib import Path

from authoring_paths import REPO, ROOT, artifact_path
import factor_single_pass as single
import prepare_factor_batch as prepare
import publish_factor_batch as publisher
import scope_correction as scope
import validate_factor_panel as panel
from compact_plan import CatalogState

P = ROOT / "planning/parallel-recovery-20261001-v2"
WID = "work-b10c43a5dea21ca208e2"


class ScopeCorrectionTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.job_path = P / "SCOPE-CORRECTION-AUTHORING-JOB-V1.json"
        if not cls.job_path.is_file():
            raise unittest.SkipTest("Preserved scope recovery job unavailable")
        cls.job = prepare.read_job(cls.job_path)
        cls.proposal = panel.read_json(P / "SCOPE-CORRECTION-PREPARE-PROPOSAL-V1.json")
        cls.baseline = Path(cls.proposal["currentPairPlanningReadback"]["baselineRoot"])
        cls.catalog = cls.baseline / "catalog-expanded.candidate.sqlite"

    def frozen_fixture(self, root):
        prepare.write_json(root / "authoring-job.json", self.job)
        prepare.write_json(root / "panel-input.json", {"schemaVersion": single.INPUT, "scopeCorrection": scope.ACTION})
        prepare.write_json(root / "scope-correction-request.json", scope.freeze_request(self.job, self.catalog))
        (root / "PANEL-INPUT.sha256").write_bytes(b"test-only frozen identity\n")
        return self.decision(root)

    def decision(self, root):
        source = next(row for row in self.job["works"][0]["supplementalEvidence"]
                      if "bunka.go.jp" in row["sourceUrl"])
        self.assertEqual(source["sourceType"], "manual")
        return {"schemaVersion": single.DECISIONS, "inputManifestSha256": panel.sha256(root / "PANEL-INPUT.sha256"), "works": [{
            "workId": WID, "disposition": "scopeCorrection",
            "sourceDecisions": [{"evidenceId": source["evidenceId"], "uses": ["scope"], "reason": "Test-only adoption of preserved official cultural-agency copyright provenance"}],
            "scope": {"outcome": "OUT_OF_SCOPE", "reasonCode": "NON_JAPANESE_ORIGINAL", "evidenceIds": [source["evidenceId"]],
                "entryScope": source["entryScope"], "observation": "Test-only scope correction fixture: preserved original copyright Kana France 2009/2011 and Japanese translation edition",
                "limitation": "Synthetic regression input; the real scope adjudication remains the authorized operator's separate frozen decision. Nationality, Japanese licensing and award context do not establish original Work scope."}}]}

    def test_actual_manual_official_source_and_scope_only_schema_preserve_originals(self):
        original = panel.sha256(self.job_path)
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            value = self.frozen_fixture(root)
            before = {path: path.read_bytes() for path in root.iterdir()}
            record = scope.project(root, value)
            self.assertEqual(record["afterEligibility"], scope.FLAGS)
            self.assertIn("source_book_metadata", record["beforeSnapshot"]["tables"])
            self.assertEqual(len(self.job["works"][0]["priorClaims"]), 15)
            schema = single.output_schema(self.job)
            self.assertEqual([row["properties"]["disposition"]["enum"] for row in schema["properties"]["works"]["items"]["anyOf"]], [["scopeCorrection"], ["hold"]])
            self.assertEqual(before, {path: path.read_bytes() for path in before})
        self.assertEqual(panel.sha256(self.job_path), original)

    def test_scope_rejects_unbound_source_and_factor_or_safety_substitution(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            value = self.frozen_fixture(root)
            for defect in ("unadopted", "cross-work", "unsupported-type", "factor-use", "factor-field", "safety-field", "input", "snapshot", "nationality-reason"):
                changed = copy.deepcopy(value)
                work = changed["works"][0]
                job = copy.deepcopy(self.job)
                if defect == "unadopted": work["sourceDecisions"][0]["uses"] = []
                elif defect == "cross-work": work["scope"]["evidenceIds"] = ["ev-foreign-work"]
                elif defect == "unsupported-type":
                    selected = work["scope"]["evidenceIds"][0]
                    next(row for row in job["works"][0]["supplementalEvidence"] if row["evidenceId"] == selected)["sourceType"] = "official"
                elif defect == "factor-use": work["sourceDecisions"][0]["uses"] = ["factor"]
                elif defect == "factor-field": work["claims"] = []
                elif defect == "safety-field": work["safety"] = {"outcome": "BLOCKED_SAFETY"}
                elif defect == "input": changed["inputManifestSha256"] = "0" * 64
                elif defect == "snapshot":
                    request = scope.freeze_request(self.job, self.catalog)
                    request["beforeSnapshotSha256"] = "0" * 64
                    prepare.write_json(root / "scope-correction-request.json", request)
                else: work["scope"]["reasonCode"] = "AUTHOR_NATIONALITY"
                prepare.write_json(root / "authoring-job.json", job)
                with self.subTest(defect=defect), self.assertRaises(ValueError):
                    scope.project(root, changed)
                prepare.write_json(root / "scope-correction-request.json", scope.freeze_request(self.job, self.catalog))

    def test_writer_expected_state_and_concurrent_semantic_guard_preserve_every_fact(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            value = self.frozen_fixture(root)
            result = root / "result/chunk-01"
            prepare.write_json(result / "adjudication.json", value)
            (result / "PANEL-RESULT.sha256").write_bytes(b"test-only result manifest\n")
            backend = publisher._backend_module()
            scope.install_backend(backend, root, result.parent)
            catalog = root / "private.sqlite"
            shutil.copyfile(self.catalog, catalog)
            with closing(sqlite3.connect(catalog)) as db:
                before = backend._snapshot_db(db)
                db.execute("begin")
                verified = {"targetChunks": {WID: root}}
                (root / "CHUNK.sha256").write_bytes(b"test-only chunk\n")
                plan, _, _ = backend.plan_against_current(db, verified, None, "2026-10-01", "reviews/authorized-evidence-panel-v1-test-scope.md", set())
                expected = CatalogState(before)
                expected.apply(plan)
                backend.apply_plan_in_transaction(db, plan)
                self.assertEqual(backend._snapshot_db(db), expected.snapshot())
                backend._verify_preservation(before, db, plan, set())
                after = scope.snapshot_from_rows(backend._snapshot_db(db), WID)["tables"]
                for table, rows in scope.project(root, value)["beforeSnapshot"]["tables"].items():
                    if table not in {"source_works", "source_evidence"}:
                        self.assertEqual(after[table], rows, table)
                self.assertEqual(len(after["source_evidence"]), len(scope.project(root, value)["beforeSnapshot"]["tables"]["source_evidence"]) + 1)
                ordinary = publisher._backend_module()
                with self.assertRaisesRegex(ValueError, "scope exclusion cannot be replaced"):
                    ordinary._build_plan([], {WID: {"panelOutcome": "PASS"}}, {}, {}, {}, ordinary._baseline_facts(db),
                                         "2026-10-01", "reviews/authorized-evidence-panel-v1-test-scope.md")
                db.rollback()
                self.assertEqual(backend._snapshot_db(db), before)
                for table, change in (("source_factors", "value='1'"), ("source_works", "annotationReviewMethod='human'"), ("source_book_metadata", "itemCaption='concurrent metadata'")):
                    db.execute("begin")
                    owner = "id" if table == "source_works" else "workId"
                    db.execute(f'update "{table}" set {change} where "{owner}"=?', (WID,))
                    with self.subTest(table=table), self.assertRaisesRegex(ValueError, "exact frozen target"):
                        backend.apply_plan_in_transaction(db, plan)
                    db.rollback()

    def test_native_freeze_check_full_and_compact_private_product_readback(self):
        import catalog_authoring_runner as runner
        import compact_publication as compact
        baseline = self.baseline
        with closing(sqlite3.connect((REPO / "data/source/catalog.sqlite").as_uri() + "?mode=ro", uri=True)) as current:
            if current.execute("select recommendationEligible,libraryOnly from source_works where id=?", (WID,)).fetchone() != ("true", "false"):
                self.skipTest("Recovery already applied; preserved immutable unit/guard fixtures remain testable")
        argv = self.proposal["nativePrepare"]["argv"]
        prior = [Path(argv[i + 1]) for i, arg in enumerate(argv) if arg == "--prior-bundle"]
        provenance = [Path(argv[i + 1]) for i, arg in enumerate(argv) if arg == "--provenance-root"]
        protected = [REPO / "data/source/catalog.sqlite", ROOT / "STATE.json", self.job_path, self.catalog, baseline / "catalog-source-registry.candidate.sqlite", *(path / "MANIFEST.sha256" for path in prior)]
        hashes = {path: panel.sha256(path) for path in protected}
        with tempfile.TemporaryDirectory(prefix="scope-native-regression-") as folder:
            run = Path(folder)
            prepare.freeze(self.job_path, baseline, baseline / "catalog-source-registry.candidate.sqlite", run / "frozen", provenance, tuple(prior))
            frozen = run / "frozen/panel-input"
            runner.prepare_session_input(run / "model-test", frozen)
            prepare.write_json(run / "test-only-decision.json", self.decision(frozen))
            checked = runner.check_result(run, {"decisionsPath": str(run / "test-only-decision.json"), "decisionsSha256": panel.sha256(run / "test-only-decision.json")})
            self.assertEqual(checked["status"], "READY_FOR_PUBLICATION")
            sealed = Path(checked["sealedRoot"])
            self.assertEqual(panel.read_csv(sealed / "panel-result/chunk-01/promotion-ledger.csv", panel.PROMOTION_FIELDS)[0]["panelOutcome"], scope.OUTCOME)
            self.assertEqual(panel.validate(frozen, sealed / "panel-result")["scopeCorrectionCount"], 1)
            self.assertFalse((sealed / "safety-recheck-v1").exists())
            full = run / "full-publication"
            publisher.publish_batch(frozen, sealed / "panel-result", baseline / "catalog-expanded.candidate.sqlite", baseline / "catalog-source-registry.candidate.sqlite", sealed / "safety-recheck-v1", full, "2026-10-01")
            for publication, result in ((full, sealed / "panel-result"),):
                readback = subprocess.run(["node", "--import", "tsx", str(REPO / "scripts/readback-catalog-authoring.mts"), str(publication), str(result), str(run / "full-readback")], cwd=REPO, capture_output=True, text=True, encoding="utf-8")
                self.assertEqual(readback.returncode, 0, readback.stdout + readback.stderr)
            self.canonical_readback(run, run / "full-readback", sealed)
            # Exercise the exact compact caller-owned transaction without the
            # outer scheduler's shared workspace persistence/STATE effect.
            pair = run / "compact-private"
            pair.mkdir()
            for name in (compact.CATALOG, compact.REGISTRY):
                shutil.copyfile(baseline / name, pair / name)
            with closing(sqlite3.connect(pair / compact.CATALOG)) as db:
                db.execute("attach database ? as registry", (str(pair / compact.REGISTRY),))
                view = compact.BatchView(db)
                entry = {"workId": WID, "input": compact.reference(frozen, "PANEL-INPUT.sha256"), "authority": compact.reference(sealed)}
                db.execute("begin immediate")
                prepared, plan, before = compact.prepare_work_v2(entry, db, hashes[REPO / "data/source/catalog.sqlite"], "2026-10-01", view)
                receipt = compact.apply_work_v2(entry, db, prepared, plan, view)
                view.committed(db)
                view.verify_final(db)
                self.assertEqual(receipt["expectedAfter"]["source_works"][0]["recommendationEligible"], "false")
                self.assertEqual(scope.snapshot_from_rows(publisher._backend_module()._snapshot_db(db), WID),
                                 scope.snapshot_from_rows(publisher._backend_module()._snapshot_db(full / compact.CATALOG), WID))
            self.retention_readback(run, full, frozen, sealed)
            # A later ordinary publisher must copy the existing scope audit
            # review even though the Work still references its original review.
            backend = publisher._backend_module()
            prior_snapshot = backend._snapshot_db(full / compact.CATALOG)
            evidence = next(json.loads(row["notes"]) for row in scope.snapshot_from_rows(prior_snapshot, WID)["tables"]["source_evidence"]
                            if row["extractorVersion"] == scope.EXTRACTOR)
            later = run / "later-review-artifacts"
            backend._prepare_review_artifacts(later, input_root=frozen, result_root=sealed / "panel-result", baseline_db=full / compact.CATALOG,
                baseline_snapshot=prior_snapshot, prepared={"inputManifestSha256": panel.sha256(frozen / "PANEL-INPUT.sha256"), "targetCount": 0},
                plan={"acceptedClaimCount": 0, "changedClaimCount": 0}, baseline_sha=panel.sha256(full / compact.CATALOG),
                reviewed_at="2026-10-01", review_reference="reviews/authorized-evidence-panel-v1-batch-later-test.md")
            self.assertEqual((later / "data/source" / evidence["reviewReference"]).read_bytes(),
                (full / "authorized-evidence-panel-v1/data/source" / evidence["reviewReference"]).read_bytes())
        self.assertEqual(hashes, {path: panel.sha256(path) for path in protected})

    def canonical_readback(self, run, publication, sealed):
        import os
        root = run / "canonical-private"
        shutil.copytree(REPO / "data/source", root / "data/source")
        for name in ("data/staging/catalog-expansion/gold-set-manifest.json", "docs/factors/factor-dictionary.md", "docs/factors/annotation-guide.md",
                     "docs/catalog-expansion/02-authorized-evidence-panel-v1.md", "docs/planning/09-catalog-authoring-authority.md"):
            destination = root / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(REPO / name, destination)
        output = root / ".workspace/scope-canonical"
        environment = dict(os.environ, PYTHONPATH=str(REPO / "scripts"), PYTHONDONTWRITEBYTECODE="1")
        command = ["node", "--import", "tsx", str(REPO / "scripts/apply-catalog-authoring-canonical.ts"), "--root", str(root),
                   "--publication-root", str(publication), "--work-ids", json.dumps([WID]), "--output", str(output)]
        executed = subprocess.run(command, cwd=REPO, env=environment, capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(executed.returncode, 0, executed.stdout + executed.stderr)
        completion = json.loads(executed.stdout.strip().splitlines()[-1])
        self.assertEqual((completion["status"], completion["readback"]), ("APPLIED", "PASS"))
        correction = panel.read_json(sealed / "panel-result/chunk-01/scope-corrections.json")["corrections"][0]
        backend = publisher._backend_module()
        current = scope.snapshot_from_rows(backend._snapshot_db(root / "data/source/catalog.sqlite"), WID)["tables"]
        for table, rows in correction["beforeSnapshot"]["tables"].items():
            if table not in {"source_works", "source_evidence"}:
                self.assertEqual(current[table], rows, table)
        work = current["source_works"][0]
        self.assertEqual({key: work[key] for key in scope.FLAGS}, {key: str(value).lower() for key, value in scope.FLAGS.items()})
        for key, value in correction["beforeSnapshot"]["tables"]["source_works"][0].items():
            if key not in scope.FLAGS:
                self.assertEqual(work[key], value, key)
        notes = next(json.loads(row["notes"]) for row in current["source_evidence"] if row["extractorVersion"] == scope.EXTRACTOR)
        self.assertTrue((root / "data/source" / notes["reviewReference"]).is_file())
        self.assertTrue((root / "data/source" / work["annotationReviewReference"]).is_file())

    def retention_readback(self, run, full, frozen, sealed):
        """Real 15 accepted claims/blobs in a separate revision store, no mock."""
        import catalog_retention as retention
        from catalog_revision_store import RevisionWorkspace
        from catalog_workspace import Workspace
        live = Workspace(REPO)
        anchor = live.get_revision(panel.read_json(self.baseline / "CURATION-BASELINE.json")["revision"])["payload"]
        original = live.get_revision(anchor["works"][WID])
        with closing(sqlite3.connect(self.catalog.as_uri() + "?mode=ro", uri=True)) as db:
            metadata_ids = {row[0] for row in db.execute("select distinct workId from source_book_metadata")}
        originals = {wid: live.get_revision(anchor["works"][wid]) for wid in metadata_ids | {WID}}
        repo = run / "retention-repo"
        local = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
        # Copy exact retained source bytes, not fabricated authority fixtures.
        with closing(live.connect()) as source, closing(local.connect(write=True)) as target, target:
            for sha in set().union(*(set(row["members"].values()) for row in originals.values())):
                local.add_blob(target, live.read_blob(source, sha))
        refs = {wid: local.put_revision("curation", wid, row["payload"], row["members"]) for wid, row in originals.items()}
        prior_ref = refs[WID]
        previous = repo / retention.BASE / "retained/prior"
        retention.create_anchor(local, previous, self.baseline, refs)
        canonical = repo / "data/source/catalog.sqlite"
        canonical.parent.mkdir(parents=True)
        shutil.copyfile(self.catalog, canonical)
        state = repo / retention.CONTINUATION / "STATE.json"
        retention.write(state, {"userStop": {"status": "STOPPED"}, "latestCandidate": {"root": str(previous)}})
        state_bytes = state.read_bytes()
        publication = repo / retention.BASE / "private-publication"
        shutil.copytree(full, publication)
        local_frozen, local_sealed = repo / "frozen", repo / "sealed"
        shutil.copytree(frozen, local_frozen / "panel-input")
        shutil.copytree(sealed, local_sealed)
        local.save([local_frozen, local_sealed], "test:exact-frozen-scope-dependencies")
        current = retention.advance_basis(repo, previous, publication, [(WID, repo / "run", local_frozen, local_sealed)])
        approved = retention.load_basis(current, {WID})
        self.assertEqual(len(approved["claims"]), 15)
        advanced = local.get_revision(local.get_revision(panel.read_json(current / "CURATION-BASELINE.json")["revision"])["payload"]["works"][WID])
        after_anchor = local.get_revision(panel.read_json(current / "CURATION-BASELINE.json")["revision"])["payload"]
        for wid, ref in refs.items():
            if wid != WID:
                self.assertEqual(after_anchor["works"][wid], ref, wid)
        self.assertEqual(advanced["payload"]["claims"], original["payload"]["claims"])
        for key, value in original["payload"].items():
            if key != "tables":
                self.assertEqual(advanced["payload"][key], value, key)
        self.assertEqual(state.read_bytes(), state_bytes)
        self.assertEqual(local.get_revision(prior_ref)["payload"], original["payload"])
        correction = panel.read_json(sealed / "panel-result/chunk-01/scope-corrections.json")["corrections"][0]
        self.assertEqual(advanced["payload"]["scopeCorrections"], [correction])
        notes = next(json.loads(row["notes"]) for row in advanced["payload"]["tables"]["source_evidence"] if row.get("extractorVersion") == scope.EXTRACTOR)
        review = current / "data/source" / notes["reviewReference"]
        self.assertTrue(review.is_file())
        changed = review.read_bytes()
        review.write_bytes(changed + b"test-only changed review\n")
        with self.assertRaisesRegex(ValueError, "scope audit review changed"):
            retention.load_basis(current, {WID})
        review.write_bytes(changed)


if __name__ == "__main__":
    unittest.main()
