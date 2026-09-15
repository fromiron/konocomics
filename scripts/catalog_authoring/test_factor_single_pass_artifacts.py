"""v3 consumers against preserved artifacts; mutations are temporary copies only."""
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path
import factor_single_pass as single
import validate_factor_panel as panel
from factor_model_input import reading_view
from test_validate_factor_panel import seal, write_csv


class SinglePassArtifactsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.run_root = ROOT / "planning/single-pass-runner-20260914/candy-run"
        cls.publication = cls.run_root / "publication"
        if not (cls.run_root / "frozen/panel-input/PANEL-INPUT.sha256").is_file():
            raise unittest.SkipTest("Preserved Candy v3 artifact unavailable")
        cls.input = cls.run_root / "frozen/panel-input"
        cls.wid = "work-593252c1d560872fb254"

    def test_general_consumer_accepts_v3_and_scopes_returned_authority(self):
        with tempfile.TemporaryDirectory() as temporary:
            consumer = Path(temporary)
            for ids, expected in (({self.wid}, 18), ({"work-aaaaaaaaaaaaaaaaaaaa"}, 0)):
                result = panel.load_prior_authority(consumer, self.publication / "catalog-expanded.candidate.sqlite", work_ids=ids)
                self.assertEqual(len(result["claims"]), expected)

    def test_freeze_resolves_preserved_registry_correction_without_links(self):
        import prepare_factor_batch as prepare
        config = panel.read_json(self.run_root / "RUN.json")
        with tempfile.TemporaryDirectory() as temporary:
            report = prepare.freeze(
                self.run_root / "job.json",
                artifact_path(config["baselineRoot"]),
                artifact_path(config["registryPath"]),
                Path(temporary) / "frozen",
                artifact_path(config["provenanceRoot"]) if config.get("provenanceRoot") else None,
                recovery_epoch=artifact_path(config["recoveryEpoch"]) if config.get("recoveryEpoch") else None,
            )
            self.assertEqual(report["status"], "PASS")
            self.assertEqual(report["targetCount"], 1)

    def test_rehashed_v3_context_or_extra_file_is_not_authority(self):
        for kind in ("context", "ledger", "missing", "extra"):
            with self.subTest(kind=kind), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary) / "bundle"
                source = self.publication / "authorized-evidence-panel-v1"
                shutil.copytree(source / "input", root / "authorized-evidence-panel-v1/input")
                shutil.copytree(source / "result", root / "authorized-evidence-panel-v1/result")
                result = root / "authorized-evidence-panel-v1/result/followup-panel-output-v1/chunk-01"
                if kind == "context":
                    path = result / "recommendation-context-condition.csv"
                    rows = panel.read_csv(path, panel.CONTEXT_FIELDS)
                    rows[0]["condition"] = "unadjudicated replacement"
                    write_csv(path, panel.CONTEXT_FIELDS, rows)
                elif kind == "ledger":
                    path = result / "evidence-panel-ledger.csv"
                    rows = panel.read_csv(path, panel.LEDGER_FIELDS)
                    next(row for row in rows if row["state"] == "known")["observation"] = "Not the original adjudication."
                    write_csv(path, panel.LEDGER_FIELDS, rows)
                elif kind == "missing":
                    (result / "adjudication.json").unlink()
                else:
                    (result / "unexpected.json").write_text("{}")
                seal(result, "PANEL-RESULT.sha256")
                seal(root, "MANIFEST.sha256")
                with self.assertRaisesRegex(ValueError, "context differs|ledger differs|membership mismatch"):
                    panel.load_prior_authority(Path(temporary), extra_bundles=((root, panel.sha256(root / "MANIFEST.sha256")),))

    def test_reading_view_preserves_observations_without_duplicate_hints(self):
        before = {p: panel.sha256(p) for p in self.input.rglob("*") if p.is_file()}
        view = reading_view(self.input)
        job = panel.read_json(self.input / "authoring-job.json")
        projected = {s.get("evidenceId", s.get("id")): s for s in view["works"][0]["sources"]}
        for source in job["works"][0]["supplementalEvidence"]:
            row = projected[source["evidenceId"]]
            for field in ("sourceUrl", "observation", "limitation", "entryScope", "retrievedAt"):
                self.assertEqual(row[field], source[field])
            self.assertNotIn("claimCandidateKeys", row)
        self.assertTrue(view["rawCaptures"])
        self.assertEqual(before, {p: panel.sha256(p) for p in before})

    def test_text_navigation_never_changes_raw_authority_or_access(self):
        import factor_model_input as view_module
        from unittest.mock import patch
        body = b'<title>Page</title><script>metadata only</script><style>hidden</style><p>A &amp; B</p><span hidden>counterexample</span>'
        view = view_module.reading_text(body, {"kind": "http-body", "contentType": "text/html; charset=utf-8"})
        self.assertEqual(view["text"], "Page\nA & B\ncounterexample")
        self.assertFalse(view["isRenderedPage"])
        self.assertIn("attributes", view["limitation"])
        self.assertEqual(view["sha256"], panel.sha256_bytes(view["text"].encode()))
        self.assertIsNone(view_module.reading_text(b"\xff", {"kind": "browser-text"}))
        self.assertIsNone(view_module.reading_text(body, {"kind": "http-body", "contentType": "text/html; charset=shift_jis"}))
        self.assertIsNone(view_module.reading_text(b"%PDF", {"kind": "http-body", "contentType": "application/pdf"}))
        direct = '轢℡춻\r\n{"source":"exact tool result"}'.encode()
        self.assertEqual(view_module.reading_text(direct, {"kind": "web-tool-response"})["text"].encode(), direct)
        before = {p: panel.sha256(p) for p in self.input.rglob("*") if p.is_file()}
        full = reading_view(self.input)
        with patch.object(view_module, "INLINE_READING_BYTES", 0):
            path_only = reading_view(self.input)
        self.assertEqual(full["works"], path_only["works"])
        self.assertTrue(all("readingTextNotInlined" in c for c in path_only["rawCaptures"]))
        self.assertTrue(any("readingText" in c for c in full["rawCaptures"]))
        for capture in full["rawCaptures"]:
            self.assertEqual(panel.sha256(self.input / capture["path"]), capture["sha256"])
        self.assertEqual(before, {p: panel.sha256(p) for p in before})

    def test_schema_binds_work_source_ids_and_context_choices(self):
        job = panel.read_json(self.input / "authoring-job.json")
        packet = panel.read_json(self.input / f"chunks/chunk-01/packets/{self.wid}/packet.json")
        schema = single.output_schema(job, {self.wid: packet})
        work, hold = schema["properties"]["works"]["items"]["anyOf"]
        self.assertEqual(work["properties"]["workId"]["enum"], [self.wid])
        self.assertEqual(hold["properties"]["workId"]["enum"], [self.wid])
        ids = work["properties"]["claims"]["items"]["properties"]["evidenceIds"]["items"]["enum"]
        self.assertIn("ev-single-candy-02", ids)
        contexts = work["properties"]["context"]["properties"]["evidenceId"]["enum"]
        self.assertIn("ev-single-candy-cohort-2019", contexts)
        self.assertNotIn("ev-single-candy-02", contexts)
        unknown = work["properties"]["unknownGroups"]["items"]["properties"]["axes"]["items"]["enum"]
        self.assertEqual(unknown, list(panel.AXES))
        self.assertNotIn("axis:artRealism", unknown)
        kinds = work["properties"]["safety"]["properties"]["sources"]["items"]["properties"]["classificationKind"]["enum"]
        self.assertIn("licensed-general-audience-label", kinds)
        self.assertNotIn("SAFE", kinds)


if __name__ == "__main__":
    unittest.main()
