"""v3 consumers against preserved artifacts; mutations are temporary copies only."""
import json
import shutil
import tempfile
import unittest
import copy
import subprocess
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path
import factor_single_pass as single
import validate_factor_panel as panel
from factor_model_input import reading_text, reading_view
from test_validate_factor_panel import seal, write_csv


class ReadingTextEncodingTest(unittest.TestCase):
    def test_declared_http_codecs_keep_complete_text_and_decoding_origin(self):
        for label, codec in (("UTF-8", "utf-8"), ("EUC-JP", "euc_jp"),
                             ("Shift_JIS", "shift_jis"), ("CP932", "cp932")):
            with self.subTest(label=label):
                text = "日本語の本文" + ("髙" if codec == "cp932" else "")
                body = ("<p>" + text + "</p>").encode(codec)
                before = panel.sha256_bytes(body)
                view = reading_text(body, {"kind": "http-body", "contentType": "text/html; charset=" + label})
                self.assertEqual(view["text"], text)
                self.assertEqual(view["sha256"], panel.sha256_bytes(text.encode("utf-8")))
                self.assertEqual(view["sourceEncoding"], {"codec": codec, "strict": True, "basis": "declared",
                    "declarations": [{"source": "http-content-type", "label": label}]})
                self.assertEqual(panel.sha256_bytes(body), before)
                self.assertFalse(view["isRenderedPage"])

    def test_html_meta_declarations_preserve_projection_and_ignore_script_or_comment_text(self):
        for meta, source in (("<meta charset='EUC-JP'>", "html-meta-charset"),
                             ('<meta http-equiv="Content-Type" content="text/html; charset=EUC-JP">', "html-meta-http-equiv")):
            with self.subTest(source=source):
                body = (meta + '<!-- <meta charset="UTF-8"> --><script><meta charset="UTF-8"></script>'
                        '<style>metadata only</style><p>日常１巻 &amp; 本文</p><span hidden>補足</span>').encode("euc_jp")
                view = reading_text(body, {"kind": "http-body", "contentType": "text/html"})
                self.assertEqual(view["text"], "日常１巻 & 本文\n補足")
                self.assertEqual(view["sourceEncoding"]["declarations"], [{"source": source, "label": "EUC-JP"}])
                self.assertIn("Hidden nodes may remain", view["limitation"])

    def test_unknown_conflicting_or_invalid_bytes_keep_the_raw_path(self):
        cases = [
            (b"<p>plain</p>", "text/html; charset=unknown"),
            (b'<meta charset="unknown"><p>plain</p>', "text/html"),
            (b'<meta charset=""><p>plain</p>', "text/html"),
            (b'<meta charset="EUC-JP"><p>plain</p>', "text/html; charset=UTF-8"),
            (b'<meta charset="Shift_JIS"><meta charset="CP932"><p>plain</p>', "text/html"),
            (b"<p>plain</p>", "text/html; charset=UTF-8; charset=EUC-JP"),
            (b"<p>plain</p>", 'text/html; charset="UTF-8'),
            (b"\xff", "text/html; charset=EUC-JP"),
            (b"\x81", "text/html; charset=Shift_JIS"),
            (b"\x81", "text/html; charset=CP932"),
        ]
        for body, content_type in cases:
            with self.subTest(body=body, content_type=content_type):
                self.assertIsNone(reading_text(body, {"kind": "http-body", "contentType": content_type}))
        self.assertIsNone(reading_text("本文".encode("euc_jp"), {"kind": "browser-text", "contentType": "text/plain; charset=EUC-JP"}))
        direct = "宣言なしのUTF-8".encode("utf-8")
        for kind, content_type in (("browser-text", ""), ("http-body", "text/html")):
            view = reading_text(direct, {"kind": kind, "contentType": content_type})
            self.assertEqual(view["text"].encode("utf-8"), direct)
            self.assertEqual(view["sourceEncoding"]["basis"], "existing-utf8-default")

    def test_charset_named_inside_another_quoted_parameter_is_not_a_declaration(self):
        body = "<p>日本語の本文</p>".encode("utf-8")
        view = reading_text(body, {"kind": "http-body",
            "contentType": 'text/html; charset="UTF-8"; note="; charset=EUC-JP"; tag=publisher\'s'})
        self.assertEqual(view["text"], "日本語の本文")
        self.assertEqual(view["sourceEncoding"]["declarations"], [
            {"source": "http-content-type", "label": "UTF-8"}])


class SinglePassArtifactsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.run_root = ROOT / "planning/single-pass-runner-20260914/candy-run"
        cls.publication = cls.run_root / "publication"
        if not (cls.run_root / "frozen/panel-input/PANEL-INPUT.sha256").is_file():
            raise unittest.SkipTest("Preserved Candy v3 artifact unavailable")
        cls.input = cls.run_root / "frozen/panel-input"
        cls.wid = "work-593252c1d560872fb254"

    def test_nt_exception_check_publish_and_product_readback_preserve_unknown(self):
        """Private copies and explicit test decisions, never a new model attestation."""
        import prepare_factor_batch as prepare
        import catalog_authoring_runner as runner
        import coverage_exception as nt
        config = panel.read_json(self.run_root / "RUN.json")
        baseline, registry = artifact_path(config["baselineRoot"]), artifact_path(config["registryPath"])
        protected = [REPO / "data/source/catalog.sqlite", ROOT / "STATE.json", baseline / "catalog-expanded.candidate.sqlite", registry]
        before = {path: panel.sha256(path) for path in protected}
        original_input = {path: panel.sha256(path) for path in self.input.rglob("*") if path.is_file()}
        job = panel.read_json(self.input / "authoring-job.json")
        job["batchId"] = "r-nt-exception-regression"
        work = job["works"][0]
        work["narrativeToneExhaustion"] = {
            "policy": nt.POLICY, "workId": self.wid, "representativeIsbn": work["representativeIsbn"],
            "attempts": [{"sourceUrl": work["research"]["sources"][0]["url"], "gap": group, "outcome": "insufficient", "observation": "Test-only exhaustion fixture; not a real research attestation"} for group in ("narrative", "tone")],
            "stopReason": "Test-only eligibility exception, never publish this fixture to canonical",
        }
        with tempfile.TemporaryDirectory(prefix="nt-exception-regression-") as folder:
            run = Path(folder)
            prepare.write_json(run / "job.json", job)
            prepare.freeze(run / "job.json", baseline, registry, run / "frozen",
                           recovery_epoch=artifact_path(config["recoveryEpoch"]) if config.get("recoveryEpoch") else None)
            value = copy.deepcopy(panel.read_json(self.publication / "authorized-evidence-panel-v1/result/followup-panel-output-v1/chunk-01/adjudication.json"))
            value["inputManifestSha256"] = panel.sha256(run / "frozen/panel-input/PANEL-INPUT.sha256")
            decision = value["works"][0]
            nt_axes = panel.NARRATIVE | panel.TONE
            decision["claims"] = [row for row in decision["claims"] if row["factKey"] not in {"axis:" + axis for axis in nt_axes}]
            decision["unknownGroups"] = [{**row, "axes": [axis for axis in row["axes"] if axis not in nt_axes]} for row in decision["unknownGroups"] if set(row["axes"]) - nt_axes]
            decision["unknownGroups"].append({"axes": sorted(nt_axes), "entryScope": "whole_work", "observation": "Test-only insufficient N/T evidence", "limitation": "Synthetic regression decision; not model authority", "reasonCode": "FACTOR_EVIDENCE_INSUFFICIENT"})
            prepare.write_json(run / "test-decisions.json", value)
            checked = runner.check_result(run, {"decisionsPath": str(run / "test-decisions.json"), "decisionsSha256": panel.sha256(run / "test-decisions.json")})
            self.assertEqual(checked["status"], "READY_FOR_PUBLICATION")
            sealed = Path(checked["sealedRoot"])
            self.assertEqual(panel.read_csv(sealed / "panel-result/chunk-01/promotion-ledger.csv", panel.PROMOTION_FIELDS)[0]["reasonCode"], nt.REASON)
            publication = run / "publication"
            prepare.publisher.publish_batch(run / "frozen/panel-input", sealed / "panel-result", baseline / "catalog-expanded.candidate.sqlite", registry,
                                             sealed / "safety-recheck-v1", publication, "2026-09-23T00:00:00Z")
            # Existing readback builds from the private authority DB and exercises
            # the real recommendation engine, including explicit unknown checks.
            result = subprocess.run(["node", "--import", "tsx", str(REPO / "scripts/readback-catalog-authoring.mts"), str(publication), str(sealed / "panel-result"), str(run / "readback")],
                                    cwd=REPO, capture_output=True, text=True, encoding="utf-8")
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(before, {path: panel.sha256(path) for path in protected})
        self.assertEqual(original_input, {path: panel.sha256(path) for path in original_input})

    def test_general_consumer_accepts_v3_and_scopes_returned_authority(self):
        with tempfile.TemporaryDirectory() as temporary:
            consumer = Path(temporary)
            for ids, expected in (({self.wid}, 18), ({"work-aaaaaaaaaaaaaaaaaaaa"}, 0)):
                result = panel.load_prior_authority(consumer, self.publication / "catalog-expanded.candidate.sqlite", work_ids=ids)
                self.assertEqual(len(result["claims"]), expected)

    def test_freeze_resolves_preserved_registry_correction_without_links(self):
        import prepare_factor_batch as prepare
        config = panel.read_json(self.run_root / "RUN.json")
        provenance = artifact_path(config["provenanceRoot"])
        originals = sorted(path for path in provenance.rglob("*") if path.is_file())
        registry = artifact_path(config["registryPath"])
        protected = [*originals, self.run_root / "job.json", registry, *[path for path in self.input.rglob("*") if path.is_file()]]
        before = {path: panel.sha256(path) for path in protected}
        self.assertFalse(registry.is_symlink() or registry.is_junction())
        with tempfile.TemporaryDirectory() as temporary, tempfile.TemporaryDirectory(
            prefix="test-registry-provenance-", dir=ROOT / "planning"
        ) as assigned:
            collection = Path(assigned)
            # The historic parent is not a Work binding for a new freeze. Use
            # the existing collector CLI to bind its exact originals explicitly,
            # then write the preserved agent-authored draft without new research.
            helper = REPO / "scripts/catalog_authoring/collect_factor_evidence.mjs"
            command = ["node", str(helper), "start", str(collection), self.wid]
            for path in originals:
                command.extend(("--input", str(path)))
            started = subprocess.run(command, cwd=REPO, capture_output=True, text=True, encoding="utf-8")
            self.assertEqual(started.returncode, 0, started.stdout + started.stderr)
            session = panel.read_json(collection / "collection-session.json")
            self.assertEqual(session["workId"], self.wid)
            self.assertEqual({Path(item["originalPath"]): item["sha256"] for item in session["supplementalFiles"]},
                             {path: before[path] for path in originals})
            shutil.copyfile(provenance / "collected/draft.mjs", collection / "draft.mjs")
            written = subprocess.run(["node", str(helper), "write", str(collection), "draft.mjs"],
                                     cwd=REPO, capture_output=True, text=True, encoding="utf-8")
            self.assertEqual(written.returncode, 0, written.stdout + written.stderr)
            report = prepare.freeze(
                self.run_root / "job.json",
                artifact_path(config["baselineRoot"]),
                registry,
                Path(temporary) / "frozen",
                collection,
                recovery_epoch=artifact_path(config["recoveryEpoch"]) if config.get("recoveryEpoch") else None,
            )
            self.assertEqual(report["status"], "PASS")
            self.assertEqual(report["targetCount"], 1)
            frozen = Path(temporary) / "frozen/panel-input"
            self.assertEqual(panel.read_json(frozen / "panel-input.json")["registrySha256"], before[registry])
            bindings = panel.read_json(frozen / "provenance-bindings.json")["collections"]
            bound = next(item for item in bindings if Path(item["root"]) == collection)
            for item in session["supplementalFiles"]:
                self.assertEqual(bound["files"][item["path"]], item["sha256"])
        self.assertEqual(before, {path: panel.sha256(path) for path in protected})

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
        self.assertIsNone(view_module.reading_text(body, {"kind": "http-body", "contentType": "text/html; charset=utf-16"}))
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
