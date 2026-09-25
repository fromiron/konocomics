"""Isolated runner regressions: no model, live publication, or STATE writes."""
import json
import os
import sqlite3
import tempfile
import subprocess
import unittest
import zlib
from contextlib import closing
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch, Mock

import catalog_authoring_runner as runner
from catalog_workspace import Workspace
from catalog_readback_identity import execution_identity, readback_matches


class RunnerTest(unittest.TestCase):
    def test_preserve_shares_reads_across_snapshots_but_not_stores_or_calls(self):
        first, second = self.repo / "first.txt", self.repo / "second.txt"
        first.write_bytes(b"same original bytes")
        second.write_bytes(first.read_bytes())
        store = Workspace(self.repo)
        store.save([first], "first")
        store.save([second], "second")
        store.backup()
        counts, metrics = {first: 0, second: 0}, {}
        original = Path.read_bytes
        def read(path):
            if path in counts:
                counts[path] += 1
            return original(path)
        with patch.object(Path, "read_bytes", read), patch.object(Workspace, "backup", side_effect=AssertionError("unneeded backup")):
            receipt = runner.preserve([first, second], "reuse", reuse=True, metrics=metrics)
        self.assertEqual(counts, {first: 2, second: 2})
        self.assertEqual(metrics["hashCalls"], 4)
        self.assertEqual(len(receipt["references"]), 2)
        for name in ("source", "backup"):
            self.assertEqual(metrics[name]["blobs"], 1)
            self.assertEqual(metrics[name]["snapshots"], 2)
            self.assertEqual(metrics[name]["membershipRows"], 2)
        # A later generation must have a fresh read view, even at the same path.
        third = self.repo / "third.txt"
        third.write_bytes(b"new generation")
        store.save([third], "third")
        metrics = {}
        runner.preserve([first, second, third], "rotate", reuse=True, metrics=metrics)
        self.assertEqual(metrics["backup"]["snapshots"], 3)
        backup = self.repo / "data/local/catalog-authoring/backups/latest.sqlite"
        with closing(sqlite3.connect(backup)) as db, db:
            db.execute("drop trigger blob_no_update")
            db.execute("update blob set content=x'00' where sha256=?", (runner.panel.sha256(first),))
        with self.assertRaises((ValueError, zlib.error)):
            runner.preserve([first], "corrupt new generation", reuse=True)

    def test_preserve_rejects_source_backup_membership_and_blob_corruption(self):
        for store_name in ("workspace.sqlite", "backups/latest.sqlite"):
            for damage in ("blob", "entry"):
                with self.subTest(store=store_name, damage=damage), tempfile.TemporaryDirectory() as folder:
                    repo = Path(folder)
                    path = repo / "original.txt"
                    path.write_bytes(b"original")
                    extra = repo / "other.txt"
                    extra.write_bytes(b"also in the manifest")
                    store = Workspace(repo)
                    store.save([path, extra], "original")
                    store.backup()
                    database = repo / "data/local/catalog-authoring" / store_name
                    with closing(sqlite3.connect(database)) as db, db:
                        if damage == "blob":
                            db.execute("drop trigger blob_no_update")
                            db.execute("update blob set content=x'00'")
                        else:
                            db.execute("drop trigger entry_no_update")
                            db.execute("update entry set path='different.txt' where path='other.txt'")
                    with patch.object(runner, "REPO", repo), self.assertRaises((ValueError, zlib.error)):
                        runner.preserve([path], "must fail", reuse=True)

    def test_preserve_rejects_actual_byte_changes_even_with_restored_mtime(self):
        path = self.repo / "original.txt"
        path.write_bytes(b"old bytes")
        runner.preserve([path], "original", reuse=True)
        original = Workspace._verify_groups
        def changed(workspace, *args, **kwargs):
            original(workspace, *args, **kwargs)
            if workspace.database.name == "latest.sqlite":
                stamp = path.stat()
                path.write_bytes(b"new bytes")
                os.utime(path, ns=(stamp.st_atime_ns, stamp.st_mtime_ns))
        with patch.object(Workspace, "_verify_groups", changed), self.assertRaisesRegex(ValueError, "changed during"):
            runner.preserve([path], "race", reuse=True)
        # Saving a missing member cannot silently replace the initial inventory.
        missing = self.repo / "missing.txt"
        missing.write_bytes(b"before save")
        save = Workspace.save
        def changed_before_save(workspace, paths, label):
            missing.write_bytes(b"during save")
            return save(workspace, paths, label)
        with patch.object(Workspace, "save", changed_before_save), self.assertRaisesRegex(ValueError, "differ"):
            runner.preserve([missing], "missing race", reuse=True)

    def test_job_research_bindings_are_assembled_without_cli_and_preserve_selection(self):
        wid = "work-aaaaaaaaaaaaaaaaaaaa"
        source = self.repo / "research.jsonl"
        urls = ["https://example.test/selected", "https://example.test/excluded"]
        source.write_text(json.dumps({"workId": wid, "sources": [{"url": url} for url in urls]}) + "\n", encoding="utf-8")
        job = self.repo / "job.json"
        raw = {"schemaVersion": runner.single.JOB, "batchId": "r-test", "works": [{
            "workId": wid, "sourceBindings": [], "researchRefs": [{"path": str(source), "sha256": runner.panel.sha256(source)}],
        }]}
        runner.write(job, raw)
        self.assertEqual({row["sourceUrl"] for row in runner.assemble_job(job, [])["works"][0]["sourceBindings"]}, set(urls))
        raw["works"][0]["sourceBindings"] = [{"evidenceId": "explicit-source", "sourceUrl": urls[0]}]
        runner.write(job, raw)
        self.assertEqual(runner.assemble_job(job, [])["works"][0]["sourceBindings"], raw["works"][0]["sourceBindings"])
        extra = self.repo / "extra.jsonl"
        extra.write_text(json.dumps({"workId": wid, "sources": [{"url": "https://example.test/addition"}]}) + "\n", encoding="utf-8")
        assembled = runner.assemble_job(job, runner.research_bindings([extra]))
        self.assertEqual({row["sourceUrl"] for row in assembled["works"][0]["sourceBindings"]}, {urls[0], "https://example.test/addition"})

    def test_collector_handoff_reaches_job_with_exact_sha_and_no_invented_exception(self):
        wid, isbn = "work-aaaaaaaaaaaaaaaaaaaa", "9781234567897"
        url = "https://example.test/volume-6"
        record = {"policy": "narrative-tone-exhaustion-v1", "workId": wid, "representativeIsbn": isbn,
                  "attempts": [{"sourceUrl": url, "gap": "tone", "outcome": "insufficient", "observation": "Test fixture records a tone gap"}],
                  "stopReason": "Test-only exhausted source; never production authority"}
        draft = {"status": "EVIDENCE_FOUND", "title": "Test volume 6", "isbn13": isbn,
                 "narrativeToneExhaustion": record, "sources": [{"url": url, "sourceFamily": "publisher", "language": "zh",
                 "entryScope": "volume_6", "workOwned": True, "observation": "Test-only source observation", "limitation": "Fixture, not actual research",
                 "readAudit": {"access": "partial-body", "author": "", "authorRole": "unknown", "coveredSections": ["description"],
                               "excludedSections": [], "pageTitle": "Test", "publishedAt": "", "retrievedAt": "2026-09-25", "scopeLocator": "volume 6"}}]}
        planning = runner.prepare.ROOT / "planning"
        planning.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="handoff-regression-", dir=planning) as folder:
            root = Path(folder)
            script = runner.prepare.REPO / "scripts/catalog_authoring/collect_factor_evidence.mjs"
            for name, with_record in (("recorded", True), ("no-exception", False)):
                collection = root / name
                subprocess.run(["node", str(script), "start", str(collection), wid], check=True, capture_output=True)
                value = dict(draft)
                if not with_record:
                    del value["narrativeToneExhaustion"]
                (collection / "draft.mjs").write_text("export default " + json.dumps(value, ensure_ascii=False), encoding="utf-8")
                result = subprocess.run(["node", str(script), "write", str(collection), "draft.mjs"], check=True, capture_output=True)
                receipt = json.loads(result.stdout)
                research = collection / "research.jsonl"
                before = research.read_bytes()
                source_job, assembled_job = root / "source-job.json", root / "assembled.json"
                runner.write(source_job, {"schemaVersion": runner.single.JOB, "batchId": "r-test", "works": [{
                    "workId": wid, "title": draft["title"], "representativeIsbn": isbn,
                    "researchRefs": [{"path": str(research), "sha256": runner.panel.sha256(research)}], "sourceBindings": [],
                    "evidence": [], "priorClaims": [], "priorDecisions": [],
                }]})
                if with_record:
                    handoff = collection / "COLLECTION-HANDOFF.json"
                    original_handoff = handoff.read_bytes()
                    self.assertEqual(receipt["handoffSha256"], runner.panel.sha256(handoff))
                    handoff.unlink()
                    with self.assertRaisesRegex(ValueError, "INPUT_NEEDS_REPAIR: collection handoff"):
                        runner.assemble_job(source_job, [])
                    handoff.write_bytes(original_handoff)
                runner.write(assembled_job, runner.assemble_job(source_job, []))
                bindings = {}
                work = runner.prepare.read_job(assembled_job, bindings)["works"][0]
                self.assertEqual(work.get("narrativeToneExhaustion"), record if with_record else None)
                self.assertEqual(work["research"]["sources"][0]["language"], "zh")
                self.assertEqual(work["supplementalEvidence"][0]["sourceUrl"], url)
                self.assertEqual(research.read_bytes(), before)
                validation = self.repo / name
                validation.mkdir()
                (validation / "research.jsonl").write_bytes(before)
                if with_record:
                    handoff = collection / "COLLECTION-HANDOFF.json"
                    (validation / handoff.name).write_bytes(handoff.read_bytes())
                    self.assertIn(handoff.resolve(), bindings)
                    captured = runner.prepare.capture_bindings(assembled_job)
                    self.assertIn(handoff.name, captured[0]["files"])
                    handoff.write_text("{}", encoding="utf-8")
                    with self.assertRaisesRegex(ValueError, "handoff SHA mismatch"):
                        runner.prepare.read_job(assembled_job)
                    with self.assertRaisesRegex(ValueError, "handoff SHA mismatch"):
                        runner.assemble_job(assembled_job, [])
                command = ["node", str(script.with_name("validate_factor_collection_batch.mjs")),
                           "--research=" + str(validation / "research.jsonl"), "--require-source-audit"]
                result = subprocess.run(command, check=True, capture_output=True, text=True, encoding="utf-8")
                self.assertEqual(json.loads(result.stdout)["status"], "PASS")
                if with_record:
                    bad = runner.panel.read_json(validation / "COLLECTION-HANDOFF.json")
                    bad["narrativeToneExhaustion"]["stopReason"] = ""
                    runner.write(validation / "COLLECTION-HANDOFF.json", bad)
                    failed = subprocess.run(command, capture_output=True, text=True, encoding="utf-8")
                    self.assertNotEqual(failed.returncode, 0)
                    self.assertIn("stop reason missing", failed.stderr)

    def test_checked_storage_reuses_verified_bytes_and_repairs_only_receipt_backup(self):
        decision = self.run_root / "decisions.json"
        runner.write(decision, {"fixture": True})
        config = {**self.config, "decisionsPath": str(decision)}
        runner.write(self.run_root / "RUN.json", config)
        checked = {"status": "HOLD"}
        runner.write(self.run_root / "CHECKED.json", checked)
        stored = runner.store_checked(self.run_root, config, checked)
        databases = [self.repo / "data/local/catalog-authoring/workspace.sqlite", self.repo / "data/local/catalog-authoring/backups/latest.sqlite"]
        before = [runner.panel.sha256(path) for path in databases]
        with patch.object(runner, "preserve", wraps=runner.preserve) as save:
            self.assertEqual(runner.store_checked(self.run_root, config, checked), stored)
            save.assert_not_called()
        self.assertEqual([runner.panel.sha256(path) for path in databases], before)
        decision.write_text("changed", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "differ from saved snapshot"):
            runner.store_checked(self.run_root, config, checked)

    def test_checked_receipt_backup_failure_repairs_only_missing_receipt_once(self):
        decision = self.run_root / "decisions.json"
        runner.write(decision, {"fixture": True})
        config = {**self.config, "decisionsPath": str(decision)}
        runner.write(self.run_root / "RUN.json", config)
        checked = {"status": "HOLD"}
        runner.write(self.run_root / "CHECKED.json", checked)
        preserve = runner.preserve
        def fail_receipt(paths, label):
            if label == "single-pass:check-receipt":
                raise OSError("receipt backup interrupted")
            return preserve(paths, label)
        with patch.object(runner, "preserve", side_effect=fail_receipt):
            with self.assertRaisesRegex(OSError, "receipt backup interrupted"):
                runner.store_checked(self.run_root, config, checked)
        with patch.object(runner, "preserve", wraps=preserve) as save:
            runner.store_checked(self.run_root, config, checked)
            self.assertEqual(save.call_count, 1)
            self.assertEqual(save.call_args.args[0], [self.run_root / "CHECK-STORAGE.json"])
        with patch.object(runner, "preserve", wraps=preserve) as save:
            runner.store_checked(self.run_root, config, checked)
            save.assert_not_called()

    def test_same_prepare_resumes_auto_and_explicit_collections_but_rejects_option_change(self):
        wid = "work-aaaaaaaaaaaaaaaaaaaa"
        automatic, explicit = self.repo / "collection", self.repo / "supplement"
        for folder in (automatic, explicit):
            runner.write(folder / "collection-session.json", {"workId": wid})
            (folder / "research.jsonl").write_text(json.dumps({"workId": wid, "sources": []}) + "\n", encoding="utf-8")
        research = automatic / "research.jsonl"
        research.write_text(json.dumps({"workId": wid, "sources": []}) + "\n", encoding="utf-8")
        job = self.repo / "source-job.json"
        runner.write(job, {"schemaVersion": runner.single.JOB, "batchId": "r-test-collections", "works": [{
            "workId": wid, "researchRefs": [{"path": str(research), "sha256": runner.panel.sha256(research)}],
        }]})
        baseline = self.repo / "baseline"
        runner.write(baseline / "catalog-source-registry.candidate.sqlite", {})
        (self.run_root / "RUN.json").unlink()
        runner.write(self.frozen / "panel-input/authoring-job.json", {"works": [{"workId": wid}]})
        args = SimpleNamespace(action="prepare", run_root=self.run_root, job=job, decisions=None,
                               retry_model=False, registry=None, recovery_epoch=None, provenance_root=[explicit])
        with patch.object(runner, "current", return_value=({}, baseline)), \
             patch.object(runner, "ensure_frozen", return_value=self.frozen), \
             patch.object(runner, "prepare_session_input", return_value={"inputManifestSha256": runner.panel.sha256(self.frozen / "panel-input/PANEL-INPUT.sha256")}), \
             patch.object(runner, "preserve", return_value={}), patch("builtins.print"):
            runner.run_job(args)
            config = runner.panel.read_json(self.run_root / "RUN.json")
            self.assertEqual(config["requestedProvenanceRoots"], [str(explicit.resolve())])
            self.assertEqual(set(config["provenanceRoots"]), {str(automatic.resolve()), str(explicit.resolve())})
            before = (self.run_root / "RUN.json").read_bytes()
            runner.run_job(args)
            self.assertEqual((self.run_root / "RUN.json").read_bytes(), before)
            args.provenance_root = [automatic]
            with self.assertRaisesRegex(ValueError, "resume provenance changed"):
                runner.run_job(args)
            self.assertEqual((self.run_root / "RUN.json").read_bytes(), before)

    def test_resume_rejects_changed_provenance_registry_and_recovery_before_freeze(self):
        for option in ("provenance_root", "registry", "recovery_epoch"):
            args = SimpleNamespace(action="prepare", run_root=self.run_root, job=None, decisions=None, retry_model=False)
            setattr(args, option, [self.repo / "other"] if option == "provenance_root" else self.repo / "other")
            before = (self.run_root / "RUN.json").read_bytes()
            with patch.object(runner, "ensure_frozen") as freeze:
                with self.assertRaisesRegex(ValueError, "resume .* changed"):
                    runner.run_job(args)
                freeze.assert_not_called()
            self.assertEqual((self.run_root / "RUN.json").read_bytes(), before)

    def test_safety_prompt_uses_frozen_schema_and_policy(self):
        root = self.frozen / "panel-input"
        schema = root / "DECISION-SCHEMA.json"
        runner.write(schema, {"classificationKind": {"enum": ["official-non-adult-label"]}})
        self.assertIn("label=<actually displayed label>", runner.safety_instructions(root))
        runner.write(schema, {"classificationKind": {"enum": ["non-pornographic-work", "pornographic-work"]}})
        with self.assertRaisesRegex(ValueError, "frozen safety schema/policy mismatch"):
            runner.safety_instructions(root)
        policy = root / "contracts/02-authorized-evidence-panel-v1.md"
        policy.parent.mkdir()
        policy.write_text("non-pornographic-work is SAFE", encoding="utf-8")
        self.assertIn("SAFETY_PORNOGRAPHIC_WORK", runner.safety_instructions(root))
        self.assertNotIn("label=<actually displayed label>", runner.safety_instructions(root))

    def test_stored_reports_discovery_time_without_an_extra_storage_cycle(self):
        with patch.object(runner, "authoring_inputs", return_value=[]) as discover, \
             patch.object(runner, "recorded_run", return_value=0) as recorded, \
             patch.object(runner.time, "perf_counter", side_effect=[10, 12]):
            runner.stored(["command"], [], [], "measurement")
        discover.assert_called_once()
        recorded.assert_called_once()
        self.assertEqual(recorded.call_args.kwargs["input_discovery_seconds"], 2)

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name)
        self.root = self.repo / "data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902"
        self.run_root = self.root / "planning/test"
        self.run_root.mkdir(parents=True)
        for name, value in (("REPO", self.repo), ("ROOT", self.root)):
            handle = patch.object(runner, name, value)
            handle.start(); self.addCleanup(handle.stop)
        self.config = {"baselineRoot": str(self.run_root / "baseline"), "registryPath": str(self.run_root / "registry.sqlite"), "recoveryEpoch": None, "provenanceRoot": None}
        runner.write(self.run_root / "RUN.json", self.config)
        self.frozen = self.run_root / "frozen"
        runner.write(self.frozen / "INPUT-PREPARATION-REPORT.json", {"inputManifestSha256": "a" * 64})
        (self.frozen / "panel-input").mkdir()
        (self.frozen / "panel-input/PANEL-INPUT.sha256").write_text("manifest\n")

    def test_prepare_and_check_never_publish_or_execute_models(self):
        decision = self.run_root / "external.json"
        runner.write(decision, {})
        runner.write(self.frozen / "panel-input/authoring-job.json", {"works": [{"workId": "work-aaaaaaaaaaaaaaaaaaaa"}]})
        for action in ("prepare", "check"):
            args = SimpleNamespace(action=action, run_root=self.run_root, job=None,
                decisions=decision if action == "check" else None, retry_model=False)
            with patch.object(runner, "ensure_frozen", return_value=self.frozen), \
                 patch.object(runner, "prepare_session_input", return_value={}), \
                 patch.object(runner, "check_result", return_value={"status": "HOLD"}), \
                 patch.object(runner, "preserve", return_value={"backup": {"status": "BACKED_UP"}}), \
                 patch.object(runner, "stored") as publication, \
                 patch.object(runner, "invoke_model") as model, patch("builtins.print"):
                runner.run_job(args)
                model.assert_not_called()
                publication.assert_not_called()
        self.assertFalse((self.run_root / "FINISHED.json").exists())
        self.assertFalse((self.root / "STATE.json").exists())
        self.assertEqual(runner.panel.read_json(self.run_root / "CHECKED.json")["status"], "HOLD")

    def test_same_prepare_reuses_storage_and_saves_only_new_members(self):
        runner.write(self.frozen / "panel-input/authoring-job.json", {"works": [{"workId": "work-aaaaaaaaaaaaaaaaaaaa"}]})
        args = SimpleNamespace(action="prepare", run_root=self.run_root, job=None, decisions=None, retry_model=False)
        identity = {"inputManifestSha256": runner.panel.sha256(self.frozen / "panel-input/PANEL-INPUT.sha256")}
        with patch.object(runner, "ensure_frozen", return_value=self.frozen), \
             patch.object(runner, "prepare_session_input", return_value=identity) as generate, patch("builtins.print"):
            with patch.object(Workspace, "backup", side_effect=OSError("backup unavailable")):
                with self.assertRaisesRegex(OSError, "backup unavailable"):
                    runner.run_job(args)
            with patch.object(Workspace, "save", side_effect=AssertionError("duplicate snapshot")):
                runner.run_job(args)  # Repair the already saved input's missing backup only.
            databases = [self.repo / "data/local/catalog-authoring/workspace.sqlite", self.repo / "data/local/catalog-authoring/backups/latest.sqlite"]
            before = [runner.panel.sha256(p) for p in databases]
            with patch.object(Workspace, "save", side_effect=AssertionError("duplicate snapshot")), \
                 patch.object(Workspace, "backup", side_effect=AssertionError("duplicate backup")), \
                 patch.object(runner, "write", side_effect=AssertionError("duplicate write")):
                runner.run_job(args)
            self.assertEqual(before, [runner.panel.sha256(p) for p in databases])
            generate.assert_called_once()
            extra = self.run_root / "new-observation.txt"
            extra.write_text("new test-only information")
            original = Workspace.save
            saved = []
            def save(workspace, paths, label):
                saved.append(paths)
                return original(workspace, paths, label)
            with patch.object(Workspace, "save", save):
                runner.run_job(args)
            self.assertEqual(saved, [[extra]])
            (self.frozen / "panel-input/PANEL-INPUT.sha256").write_text("changed")
            with self.assertRaisesRegex(ValueError, "prepared input changed"):
                runner.run_job(args)

    def test_prior_bundles_bind_freeze_input_and_reject_changed_resume(self):
        originals = [self.repo / "original-a", self.repo / "original-b"]
        for root in originals:
            root.mkdir()
            (root / "MANIFEST.sha256").write_text(root.name + "\n")
        bindings = runner.prior_bundle_bindings(originals)
        self.config["priorBundleBindings"] = bindings
        runner.write(self.run_root / "RUN.json", self.config)
        (self.frozen / "INPUT-PREPARATION-REPORT.json").unlink()

        def freeze(command, inputs, outputs, _label, direct_inputs=()):
            self.assertEqual([command[i + 1] for i, arg in enumerate(command) if arg == "--prior-bundle"], [item["root"] for item in bindings])
            self.assertEqual(list(direct_inputs), originals)
            runner.write(outputs[0] / "INPUT-PREPARATION-REPORT.json", {"inputManifestSha256": "a" * 64})
            return {"output": {}, "backup": {}}

        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "stored", side_effect=freeze):
            runner.ensure_frozen(self.run_root, self.config)
        args = SimpleNamespace(action="prepare", run_root=self.run_root, job=None, decisions=None,
                               retry_model=False, prior_bundle=[originals[0]])
        with patch.object(runner, "ensure_frozen") as prepare_input:
            with self.assertRaisesRegex(ValueError, "resume prior bundles changed"):
                runner.run_job(args)
            prepare_input.assert_not_called()
        (originals[0] / "MANIFEST.sha256").write_text("changed\n")
        with self.assertRaisesRegex(ValueError, "prior bundle changed"):
            runner.ensure_frozen(self.run_root, self.config)

    def test_persistent_session_command_keeps_model_schema_and_read_only(self):
        session = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
        command = runner.model_command("codex", Path("schema.json"), Path("out.json"), session)
        self.assertEqual(command[command.index("resume") + 1], session)
        self.assertEqual(command[command.index("-s") + 1], "read-only")
        self.assertEqual(command[command.index("-m") + 1], "gpt-5.6-sol")
        self.assertEqual(command[command.index("--output-schema") + 1], "schema.json")
        with self.assertRaises(ValueError):
            runner.model_command("codex", Path("schema.json"), Path("out.json"), "--last")

    def test_default_missing_decisions_never_prepares_or_calls_model(self):
        for extra in ({}, {"retry_model": True}, {"model_session": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"},
                      {"decisions": self.run_root / "missing.json"}):
            with self.subTest(extra=extra):
                args = SimpleNamespace(**dict({"run_root": self.run_root, "job": None,
                    "decisions": None, "retry_model": False}, **extra))
                before = (self.run_root / "RUN.json").read_bytes()
                with patch.object(runner, "ensure_frozen") as freeze, \
                     patch.object(runner, "invoke_model") as model:
                    with self.assertRaises(ValueError):
                        runner.run_job(args)
                    freeze.assert_not_called()
                    model.assert_not_called()
                self.assertEqual((self.run_root / "RUN.json").read_bytes(), before)

    def test_decision_handoff_and_explicit_model_execution(self):
        decision = self.run_root / "external.json"
        runner.write(decision, {})
        runner.write(self.frozen / "panel-input/authoring-job.json",
                     {"works": [{"workId": "work-aaaaaaaaaaaaaaaaaaaa"}]})
        for mode in ("supplied", "saved", "explicit"):
            with self.subTest(mode=mode):
                config = dict(self.config)
                if mode == "saved":
                    config.update(decisionsPath=str(decision), decisionsSha256=runner.panel.sha256(decision))
                runner.write(self.run_root / "RUN.json", config)
                args = SimpleNamespace(run_root=self.run_root, job=None,
                    decisions=decision if mode == "supplied" else None,
                    retry_model=False, allow_model=mode == "explicit")
                with patch.object(runner, "ensure_frozen", return_value=self.frozen), \
                     patch.object(runner, "invoke_model", return_value=decision) as model, \
                     patch.object(runner, "stored") as finish, \
                     patch.object(runner, "completion", return_value={"status": "HOLD"}), \
                     patch("builtins.print"):
                    runner.run_job(args)
                    if mode == "explicit":
                        model.assert_called_once_with(self.run_root, self.frozen, False, session_id=None)
                    else:
                        model.assert_not_called()
                    finish.assert_called_once()
                saved = runner.panel.read_json(self.run_root / "RUN.json")
                self.assertEqual(saved["decisionsSha256"], runner.panel.sha256(decision))

    def test_storage_failure_blocks_model_and_does_not_refreeze(self):
        args = SimpleNamespace(run_root=self.run_root, job=None, decisions=None, retry_model=False, allow_model=True)
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "authoring_inputs", side_effect=lambda p, *_: p), \
             patch.object(runner, "preserve", side_effect=OSError("backup failed")), \
             patch.object(runner, "invoke_model") as model, patch.object(runner, "stored") as freeze:
            with self.assertRaisesRegex(OSError, "backup failed"):
                runner.run_job(args)
            model.assert_not_called(); freeze.assert_not_called()
        self.assertFalse((self.run_root / "FROZEN-STORAGE.json").exists())

    def test_missing_storage_receipt_preserves_valid_input_once(self):
        store = Workspace(self.repo)
        before = (self.frozen / "panel-input/PANEL-INPUT.sha256").read_bytes()
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "authoring_inputs", side_effect=lambda p, *_: p), \
             patch.object(runner, "stored") as freeze:
            self.assertEqual(runner.ensure_frozen(self.run_root, self.config), self.frozen)
            receipt = json.loads((self.run_root / "FROZEN-STORAGE.json").read_bytes())
            with patch.object(runner, "preserve", side_effect=AssertionError("duplicate save")):
                runner.ensure_frozen(self.run_root, self.config)
            freeze.assert_not_called()
        store.verify_saved(receipt["storage"]["snapshot"], [self.frozen])
        self.assertEqual(before, (self.frozen / "panel-input/PANEL-INPUT.sha256").read_bytes())

    def test_partial_freeze_keeps_original_path_and_starts_new_attempt(self):
        (self.frozen / "INPUT-PREPARATION-REPORT.json").unlink()
        original = self.frozen / "partial.txt"; original.write_bytes(b"partial")
        def freeze(_command, inputs, outputs, _label, direct_inputs=()):
            self.assertIn(self.frozen, inputs)
            self.assertNotEqual(outputs[0], self.frozen)
            runner.write(outputs[0] / "INPUT-PREPARATION-REPORT.json", {"inputManifestSha256": "a" * 64})
            return {"output": {}, "backup": {}}
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "stored", side_effect=freeze):
            actual = runner.ensure_frozen(self.run_root, self.config)
        self.assertEqual(original.read_bytes(), b"partial")
        self.assertEqual(actual, self.run_root / self.config["frozenDirectory"])

    def test_same_work_in_different_runs_cannot_call_models_concurrently(self):
        wid = "work-aaaaaaaaaaaaaaaaaaaa"
        runner.write(self.frozen / "panel-input/authoring-job.json", {"works": [{"workId": wid}]})
        other = self.root / "planning/other-run"
        runner.write(other / "RUN.json", self.config)
        args = SimpleNamespace(run_root=other, job=None, decisions=None, retry_model=False, allow_model=True)
        lock = self.repo / "data/local/catalog-authoring/locks" / (wid + ".lock")
        with runner.exclusive(lock), patch.object(runner, "ensure_frozen", return_value=self.frozen), \
             patch.object(runner, "invoke_model") as model:
            with self.assertRaises(OSError):
                runner.run_job(args)
            model.assert_not_called()

    def model_receipt(self, status="COMPLETED", output="{}"):
        attempt = self.run_root / "model-001"; attempt.mkdir()
        (attempt / "PROMPT.md").write_text("original prompt")
        runner.write(attempt / "schema.json", {})
        runner.write(self.frozen / "panel-input/DECISION-SCHEMA.json", {})
        (attempt / "decisions.json").write_text(output)
        receipt = {"status": status, "inputManifestSha256": "a" * 64,
                   "outputSha256": runner.panel.sha256(attempt / "decisions.json"),
                   "promptSha256": runner.panel.sha256(attempt / "PROMPT.md"),
                   "schemaSha256": runner.panel.sha256(attempt / "schema.json")}
        runner.write(attempt / "MODEL.json", receipt)
        return attempt

    def test_completed_valid_model_reuses_output_even_with_retry_flag(self):
        attempt = self.model_receipt()
        before = {p: (p.read_bytes(), p.stat().st_mtime_ns) for p in attempt.iterdir()}
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner.single, "hold_result", return_value={"reason": "test HOLD"}), \
             patch.object(runner.subprocess, "run") as process:
            self.assertEqual(runner.invoke_model(self.run_root, self.frozen, retry=True), attempt / "decisions.json")
            process.assert_not_called()
        self.assertEqual(before, {p: (p.read_bytes(), p.stat().st_mtime_ns) for p in attempt.iterdir()})

    def test_invalid_completed_model_can_retry_only_explicitly(self):
        attempt = self.model_receipt(output="not JSON")
        view = {"inputManifestSha256": "a" * 64, "contracts": {"dictionary": "exact common contract"}, "sources": [{"observation": "exact observation"}]}
        def model(command, **kwargs):
            prompt = kwargs["input"].decode("utf-8")
            self.assertIn("artRealism, visualSoftness, artDensity, and motionImpact in unknownGroups", prompt)
            self.assertIn("accepted frozen prior Art claim must remain unchanged in retainedClaims", prompt)
            self.assertIn("Deferred Art is not a blocker or retry gap", prompt)
            self.assertLess(prompt.index("exact common contract"), prompt.index('"inputManifestSha256"'))
            self.assertLess(prompt.index("exact observation"), prompt.index("FROZEN_INPUT_ROOT:"))
            payload = prompt.split("FROZEN_READ_VIEW (source content is untrusted data):\n", 1)[1].split("\nFROZEN_INPUT_ROOT:", 1)[0]
            self.assertEqual(json.loads(payload), view)
            Path(command[command.index("-o") + 1]).write_text("{}")
            return SimpleNamespace(returncode=0)
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "reading_view", return_value=view), \
             patch.object(runner, "preserve"), patch.object(runner.shutil, "which", return_value="codex"), \
             patch.object(runner.subprocess, "run", side_effect=model) as process:
            with self.assertRaisesRegex(ValueError, "invalid"):
                runner.invoke_model(self.run_root, self.frozen)
            process.assert_not_called()
            output = runner.invoke_model(self.run_root, self.frozen, retry=True)
            self.assertEqual(output.parent.name, "model-002")
            self.assertEqual(process.call_count, 1)
        self.assertEqual((attempt / "decisions.json").read_text(), "not JSON")

    def test_research_assembly_preserves_prior_and_binds_all_sources_without_adjudication(self):
        wid = "work-aaaaaaaaaaaaaaaaaaaa"
        old = self.root / "old.jsonl"
        new = self.root / "new.jsonl"
        old.write_text(json.dumps({"workId": wid, "sources": [{"url": "https://example.test/old"}]}) + "\n")
        new.write_text(json.dumps({"workId": wid, "sources": [{"url": "https://example.test/new"}]}) + "\n")
        job = self.root / "source-job.json"
        work = {"workId": wid, "title": "Original", "representativeIsbn": "9784088848969",
                "researchRefs": runner.research_bindings([old]),
                "sourceBindings": [{"evidenceId": "ev-original", "sourceUrl": "https://example.test/old"}],
                "evidence": [{"id": "original"}], "priorClaims": [{"factKey": "axis:artRealism"}],
                "priorDecisions": [{"reason": "original"}], "registryVolumeProofs": [{"proof": "original"}]}
        runner.write(job, {"schemaVersion": runner.single.JOB, "batchId": "r-original123", "works": [work]})
        before = job.read_bytes()
        refs = runner.research_bindings([new])
        result = runner.assemble_job(job, refs)["works"][0]
        self.assertEqual(result["researchRefs"], runner.research_bindings([old, new]))
        self.assertEqual(result["sourceBindings"][0], work["sourceBindings"][0])
        self.assertEqual({x["sourceUrl"] for x in result["sourceBindings"]}, {"https://example.test/old", "https://example.test/new"})
        for key in ("title", "representativeIsbn", "evidence", "priorClaims", "priorDecisions", "registryVolumeProofs"):
            self.assertEqual(result[key], work[key])
        self.assertEqual(job.read_bytes(), before)
        new.write_text(json.dumps({"workId": "work-bbbbbbbbbbbbbbbbbbbb", "sources": []}) + "\n")
        with self.assertRaisesRegex(ValueError, "research changed"):
            runner.assemble_job(job, refs)
        with self.assertRaisesRegex(ValueError, "exact Work"):
            runner.assemble_job(job, runner.research_bindings([new]))

    def test_automatic_work_job_keeps_reviewed_prior_on_explicit_path(self):
        wid = "work-aaaaaaaaaaaaaaaaaaaa"
        facts = {"works": {wid: {"title": "Original", "recommendationEligible": "false", "annotationReviewMethod": "authorizedEvidencePanel", "evidenceId": "ev-original"}},
                 "volumeRows": {wid: [{"isRepresentative": "true", "isbn": "9784088848969"}]},
                 "evidence": {"ev-original": {key: "original" for key in runner.panel.ORIGINAL_EVIDENCE_FIELDS}}}
        facts["evidence"]["ev-original"]["workId"] = wid
        backend = SimpleNamespace(_baseline_facts=lambda _: facts)
        with patch.object(runner.publisher, "_backend_module", return_value=backend):
            with self.assertRaisesRegex(ValueError, "preserving prior authority"):
                runner.unadjudicated_job(self.root, wid, [{"path": "research.jsonl"}])
            facts["works"][wid]["annotationReviewMethod"] = "unreviewed"
            job = runner.unadjudicated_job(self.root, wid, [{"path": "research.jsonl"}])
            self.assertEqual(job["works"][0]["title"], "Original")
            self.assertEqual(job["works"][0]["representativeIsbn"], "9784088848969")
            facts["works"][wid]["recommendationEligible"] = "true"
            with self.assertRaisesRegex(ValueError, "already eligible"):
                runner.unadjudicated_job(self.root, wid, [{"path": "research.jsonl"}])

    def test_frozen_registry_correction_rebases_only_its_exact_target(self):
        work_id = "work-aaaaaaaaaaaaaaaaaaaa"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            frozen_baseline = root / "frozen/catalog-expanded.candidate.sqlite"
            source_registry = frozen_baseline.parent / "catalog-source-registry.candidate.sqlite"
            frozen_registry = root / "correction/catalog-source-registry.candidate.sqlite"
            current_registry = root / "current/catalog-source-registry.candidate.sqlite"
            output = root / "output.sqlite"
            for path in (frozen_baseline, source_registry, frozen_registry):
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(b"bound")
            current_registry.parent.mkdir()
            with closing(sqlite3.connect(current_registry)) as connection, connection:
                connection.execute("create table registry_meta (key text primary key, value text)")
                connection.execute("create table registry_research_attempts (attemptId text primary key)")
                connection.execute("create table registry_source_rows (sourceRowId text primary key, canonicalWorkId text, volumeNumber text)")
                connection.executemany("insert into registry_source_rows values (?,?,?)", [
                    ("target-row", work_id, ""),
                    ("other-row", "work-bbbbbbbbbbbbbbbbbbbb", "7"),
                ])
            runner.write(frozen_registry.parent / "correction-ledger.json", {"changes": [{
                "sourceRowId": "target-row", "workId": work_id, "field": "volumeNumber",
                "before": "", "after": "1",
            }]})
            before = runner.publisher.sha256(current_registry)
            with patch("correct_factor_registry.verify_correction", return_value=frozen_registry):
                self.assertTrue(runner.publisher._rebase_registry_correction(
                    frozen_baseline, frozen_registry, current_registry, output, {work_id}
                ))
            with closing(sqlite3.connect(output)) as connection:
                self.assertEqual(connection.execute("select sourceRowId,volumeNumber from registry_source_rows order by sourceRowId").fetchall(), [("other-row", "7"), ("target-row", "1")])
            self.assertEqual(runner.publisher.sha256(current_registry), before)
            with closing(sqlite3.connect(current_registry)) as connection, connection:
                connection.execute("update registry_source_rows set volumeNumber='2' where sourceRowId='target-row'")
            with patch("correct_factor_registry.verify_correction", return_value=frozen_registry):
                with self.assertRaisesRegex(ValueError, "target field changed during rebase"):
                    runner.publisher._rebase_registry_correction(
                        frozen_baseline, frozen_registry, current_registry, root / "stale.sqlite", {work_id}
                    )
            self.assertFalse((root / "stale.sqlite").exists())

    def test_interrupted_model_preparation_keeps_files_and_uses_new_attempt(self):
        orphan = self.run_root / "model-001"
        runner.write(orphan / "schema.json", {"prepared": True})
        runner.write(self.frozen / "panel-input/DECISION-SCHEMA.json", {})
        before = (orphan / "schema.json").read_bytes()
        def model(command, **_kwargs):
            Path(command[command.index("-o") + 1]).write_text("{}")
            return SimpleNamespace(returncode=0)
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "reading_view", return_value={}), \
             patch.object(runner, "preserve"), patch.object(runner.shutil, "which", return_value="codex"), \
             patch.object(runner.subprocess, "run", side_effect=model) as process:
            result = runner.invoke_model(self.run_root, self.frozen)
        self.assertEqual(result.parent.name, "model-002")
        self.assertEqual(process.call_count, 1)
        self.assertEqual((orphan / "schema.json").read_bytes(), before)

    def test_orphan_model_output_without_receipt_never_triggers_a_new_call(self):
        orphan = self.run_root / "model-001"
        runner.write(orphan / "decisions.json", {})
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner.subprocess, "run") as process:
            with self.assertRaisesRegex(ValueError, "indeterminate"):
                runner.invoke_model(self.run_root, self.frozen, retry=True)
            process.assert_not_called()

    def test_prepared_backup_failure_resumes_same_attempt(self):
        runner.write(self.frozen / "panel-input/DECISION-SCHEMA.json", {})
        for retry in (False, True):
            with self.subTest(retry=retry):
                run = self.run_root / str(retry)
                run.mkdir()
                backed_up = []
                original_preserve = runner.preserve
                def preserve(paths, label):
                    receipt = original_preserve(paths, label)
                    if label == "single-pass:model-input":
                        Workspace(self.repo, Path(receipt["backup"]["destination"])).verify_saved(receipt["snapshot"], paths)
                        backed_up.append(True)
                    return receipt
                def model(command, **kwargs):
                    self.assertTrue(backed_up, "model started before durable input backup")
                    self.assertEqual(kwargs["input"], original["PROMPT.md"][0])
                    Path(command[command.index("-o") + 1]).write_text("{}")
                    return SimpleNamespace(returncode=0)
                with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
                     patch.object(runner, "reading_view", return_value={}), \
                     patch.object(runner.shutil, "which", return_value="codex"), \
                     patch.object(runner.subprocess, "run", side_effect=model) as process:
                    with patch.object(Workspace, "backup", side_effect=OSError("prepared backup failed")):
                        with self.assertRaisesRegex(OSError, "prepared backup failed"):
                            runner.invoke_model(run, self.frozen)
                    process.assert_not_called()
                    attempt = run / "model-001"
                    receipt = json.loads((attempt / "MODEL.json").read_bytes())
                    self.assertEqual(receipt["status"], "PREPARED")
                    self.assertFalse(any((attempt / name).exists() for name in ("events.jsonl", "stderr.log", "decisions.json")))
                    original = {p.name: (p.read_bytes(), p.stat().st_mtime_ns) for p in attempt.iterdir() if p.name != "MODEL.json"}
                    with patch.object(runner, "reading_view", side_effect=AssertionError("prepared prompt regenerated")), \
                         patch.object(runner, "preserve", side_effect=preserve):
                        output = runner.invoke_model(run, self.frozen, retry=retry)
                    self.assertEqual(output, attempt / "decisions.json")
                    self.assertEqual(process.call_count, 1)
                    self.assertFalse((run / "model-002").exists())
                    self.assertEqual(original, {name: ((attempt / name).read_bytes(), (attempt / name).stat().st_mtime_ns) for name in original})

    def test_moved_prepared_request_preserves_original_and_uses_current_prompt(self):
        from workspace_paths import artifact_path
        old = self.repo / ".workspace/moved-run"
        frozen = old / "frozen"
        runner.write(frozen / "panel-input/DECISION-SCHEMA.json", {})
        current = self.repo / "data/local/catalog-authoring/artifacts/moved-run"
        def model(command, **kwargs):
            self.assertIn(str(current / "frozen/panel-input").encode(), kwargs["input"])
            self.assertNotIn(str(old).encode(), kwargs["input"])
            Path(command[command.index("-o") + 1]).write_text("{}")
            return SimpleNamespace(returncode=0)
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "reading_view", return_value={}), \
             patch.object(runner.shutil, "which", return_value="codex"), \
             patch.object(runner, "artifact_path", side_effect=lambda path: artifact_path(path, self.repo)), \
             patch.object(runner.subprocess, "run", side_effect=model) as process:
            with patch.object(runner, "preserve", side_effect=OSError("backup failed")):
                with self.assertRaises(OSError):
                    runner.invoke_model(old, frozen)
            original = {p.name: p.read_bytes() for p in (old / "model-001").iterdir()}
            old.rename(current)
            with patch.object(runner, "preserve"):
                output = runner.invoke_model(current, current / "frozen")
            self.assertEqual(output, current / "model-002/decisions.json")
            self.assertEqual(process.call_count, 1)
            self.assertEqual(original, {p.name: p.read_bytes() for p in (current / "model-001").iterdir()})
            self.assertFalse(old.exists())

    def test_prepared_resume_rejects_uncertain_or_changed_request(self):
        runner.write(self.frozen / "panel-input/DECISION-SCHEMA.json", {})
        defects = ("events.jsonl", "stderr.log", "decisions.json", "RUNNING", "startedAt", "prompt", "schema", "input", "command", "executionKey")
        for defect in defects:
            with self.subTest(defect=defect):
                run = self.run_root / defect
                run.mkdir()
                with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
                     patch.object(runner, "reading_view", return_value={}), \
                     patch.object(runner.shutil, "which", return_value="codex"), \
                     patch.object(runner.subprocess, "run") as process:
                    with patch.object(Workspace, "backup", side_effect=OSError("backup failed")):
                        with self.assertRaises(OSError):
                            runner.invoke_model(run, self.frozen)
                    attempt = run / "model-001"
                    receipt = json.loads((attempt / "MODEL.json").read_bytes())
                    if defect.endswith((".jsonl", ".log", ".json")):
                        (attempt / defect).write_bytes(b"")
                    elif defect in {"prompt", "schema"}:
                        (attempt / ("PROMPT.md" if defect == "prompt" else "schema.json")).write_bytes(b"changed")
                    else:
                        if defect == "RUNNING": receipt["status"] = "RUNNING"
                        elif defect == "startedAt": receipt["startedAt"] = None
                        elif defect == "input": receipt["inputManifestSha256"] = "b" * 64
                        elif defect == "command": receipt["command"][0] = "another-program"
                        else: receipt["executionKey"] = "c" * 64
                        runner.write(attempt / "MODEL.json", receipt)
                    with patch.object(runner, "preserve") as storage:
                        with self.assertRaises(ValueError):
                            runner.invoke_model(run, self.frozen, retry=True)
                        storage.assert_not_called()
                    process.assert_not_called()
                    self.assertFalse((run / "model-002").exists())

    def test_prepared_resume_backup_failure_and_post_save_change_block_launch(self):
        runner.write(self.frozen / "panel-input/DECISION-SCHEMA.json", {})
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "reading_view", return_value={}), \
             patch.object(runner.shutil, "which", return_value="codex"), \
             patch.object(runner.subprocess, "run") as process:
            with patch.object(Workspace, "backup", side_effect=OSError("backup failed")):
                for _ in range(2):
                    with self.assertRaisesRegex(OSError, "backup failed"):
                        runner.invoke_model(self.run_root, self.frozen)
            attempt = self.run_root / "model-001"
            self.assertEqual(json.loads((attempt / "MODEL.json").read_bytes())["status"], "PREPARED")
            self.assertFalse((self.run_root / "model-002").exists())
            def changed_after_save(*_args):
                (attempt / "PROMPT.md").write_bytes(b"changed during backup")
            with patch.object(runner, "preserve", side_effect=changed_after_save):
                with self.assertRaisesRegex(ValueError, "binding changed"):
                    runner.invoke_model(self.run_root, self.frozen)
            process.assert_not_called()
            self.assertFalse((attempt / "events.jsonl").exists())

    def test_frozen_change_during_prepared_storage_blocks_model(self):
        runner.write(self.frozen / "panel-input/DECISION-SCHEMA.json", {})
        with patch.object(runner.publisher, "validate_input", side_effect=[({}, [], "a" * 64), ({}, [], "b" * 64)]), \
             patch.object(runner, "reading_view", return_value={}), \
             patch.object(runner, "preserve"), patch.object(runner.shutil, "which", return_value="codex"), \
             patch.object(runner.subprocess, "run") as process:
            with self.assertRaisesRegex(ValueError, "Frozen input changed"):
                runner.invoke_model(self.run_root, self.frozen)
            process.assert_not_called()
        attempt = self.run_root / "model-001"
        self.assertEqual(json.loads((attempt / "MODEL.json").read_bytes())["status"], "PREPARED")
        self.assertFalse((attempt / "events.jsonl").exists())

    def test_indeterminate_model_is_not_recalled(self):
        self.model_receipt(status="RUNNING")
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner.subprocess, "run") as process:
            with self.assertRaisesRegex(ValueError, "indeterminate"):
                runner.invoke_model(self.run_root, self.frozen, retry=True)
            process.assert_not_called()

    def test_stale_state_write_refuses_to_replace_other_changes(self):
        path = self.root / "STATE.json"
        runner.write(path, {"collection": 1})
        expected = runner.panel.sha256(path)
        runner.write(path, {"collection": 2})
        with self.assertRaisesRegex(ValueError, "concurrent"):
            runner.write(path, {"collection": 1, "candidate": 3}, expected_sha=expected)
        self.assertEqual(json.loads(path.read_bytes()), {"collection": 2})
        stamp = path.stat().st_mtime_ns
        runner.write(path, {"collection": 2})
        self.assertEqual(path.stat().st_mtime_ns, stamp)

    def test_saved_checkpoint_checks_actual_live_and_backup_bytes(self):
        store = Workspace(self.repo)
        receipt = store.save([self.frozen], "test input")
        backup = Workspace(self.repo, Path(store.backup()["destination"]))
        for workspace in (store, backup):
            workspace.verify_saved(receipt, [self.frozen])
        (self.frozen / "panel-input/PANEL-INPUT.sha256").write_text("changed")
        with self.assertRaisesRegex(ValueError, "differ"):
            backup.verify_saved(receipt, [self.frozen])

    def test_completed_refresh_never_calls_seal_or_publish(self):
        pub = self.run_root / "publication"; pub.mkdir()
        (pub / "MANIFEST.sha256").write_text("manifest")
        old = self.run_root / "readback/READBACK.json"; runner.write(old, {"old": True})
        new = self.run_root / "readback-next/READBACK.json"; runner.write(new, {"new": True})
        original = {"status": "VERIFIED", "sealedRoot": str(self.run_root / "result-001"),
                    "publicationManifestSha256": runner.panel.sha256(pub / "MANIFEST.sha256"),
                    "readback": str(old), "readbackSha256": runner.panel.sha256(old)}
        runner.write(self.run_root / "FINISHED.json", original)
        before = (self.run_root / "FINISHED.json").read_bytes()
        with patch.object(runner.publisher, "_verify_result_manifest"), \
             patch.object(runner, "product_readback", return_value=new), \
             patch.object(runner.prepare, "seal_result") as seal, \
             patch.object(runner.publisher, "publish_batch") as publish:
            runner.finish(self.run_root)
            seal.assert_not_called(); publish.assert_not_called()
        self.assertEqual((self.run_root / "FINISHED.json").read_bytes(), before)
        self.assertEqual(runner.completion(self.run_root)["readback"], str(new))

    def test_recorded_receipt_is_returned_only_after_durable_backup(self):
        store = Workspace(self.repo)
        output = self.run_root / "recorded-output.txt"
        import sys
        command = [sys.executable, "-I", "-S", "-B", "-c", "import sys; from pathlib import Path; Path(sys.argv[1]).write_text('output')", str(output)]
        receipt = {}
        self.assertEqual(runner.recorded_run(command, [self.frozen], [output], "receipt-test", store, receipt_out=receipt), 0)
        Workspace(self.repo, Path(receipt["backup"]["destination"])).verify_saved(receipt["output"], [output])
        backup = store.backup
        calls = 0
        def interrupted_backup():
            nonlocal calls
            calls += 1
            if calls == 2:
                raise OSError("final backup failed")
            return backup()
        failed_receipt = {}
        with patch.object(store, "backup", side_effect=interrupted_backup):
            with self.assertRaisesRegex(OSError, "final backup failed"):
                runner.recorded_run(command, [self.frozen], [output], "receipt-failure", store, receipt_out=failed_receipt)
        self.assertEqual(failed_receipt, {})
        self.assertEqual(output.read_text(), "output")

    def identity_fixture(self):
        files = {"scripts/readback-catalog-authoring.mts": 'import "./worker";',
                 "scripts/worker.ts": 'import "@/domain/value";',
                 "src/domain/value.ts": "export const value = 1;"}
        for path in ("scripts/catalog_readback_identity.py", "package.json", "pnpm-lock.yaml", "tsconfig.json",
                     "data/staging/catalog-expansion/gold-set-manifest.json",
                     "scripts/sql/catalog-authority/001-init.sql", "scripts/sql/catalog-authority/002-book-metadata.sql"):
            files[path] = "fixture"
        for path, text in files.items():
            target = self.repo / path; target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(text)
        return execution_identity(self.repo)

    def test_readback_identity_tracks_transitive_alias_and_schema(self):
        before = self.identity_fixture()
        paths = {item["path"] for item in before["files"]}
        self.assertIn("src/domain/value.ts", paths)
        self.assertIn("scripts/sql/catalog-authority/002-book-metadata.sql", paths)
        (self.repo / "src/domain/value.ts").write_text("export const value = 2;")
        self.assertNotEqual(execution_identity(self.repo), before)

    def readback_fixture(self):
        identity = self.identity_fixture()
        pub = self.run_root / "publication"; pub.mkdir()
        (pub / "MANIFEST.sha256").write_text("publication")
        result = self.run_root / "result/panel-result"
        (result / "chunk-01").mkdir(parents=True)
        (result / "chunk-01/PANEL-RESULT.sha256").write_text("result")
        output = self.run_root / "readback"
        artifacts = []
        for name in ("recommendation-profile-catalog-v1.json", "recommendation-profile-context-v1.json"):
            file = output / "data/generated" / name
            runner.write(file, {})
            artifacts.append({"path": file.relative_to(output).as_posix(), "sha256": runner.panel.sha256(file)})
        report = output / "READBACK.json"
        database_paths = {
            "catalogSha256": pub / "catalog-expanded.candidate.sqlite",
            "registrySha256": pub / "catalog-source-registry.candidate.sqlite",
            "canonicalSha256": self.repo / "data/source/catalog.sqlite",
        }
        for key, path in database_paths.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(key.encode())
        runner.write(report, {"status": "SQL_BUILD_COVERAGE_ENGINE_VERIFIED", "executionIdentity": identity,
                              "publicationManifestSha256": runner.panel.sha256(pub / "MANIFEST.sha256"),
                              "resultManifestSha256": runner.panel.sha256(result / "chunk-01/PANEL-RESULT.sha256"),
                              **{key: runner.panel.sha256(path) for key, path in database_paths.items()},
                              "artifacts": artifacts})
        return report, pub, result, database_paths

    def test_generated_artifact_mutation_invalidates_readback(self):
        report, pub, result, _ = self.readback_fixture()
        self.assertTrue(readback_matches(report, self.repo, pub, result))
        artifact = report.parent / "data/generated/recommendation-profile-catalog-v1.json"
        artifact.write_text("changed")
        self.assertFalse(readback_matches(report, self.repo, pub, result))

    def test_readback_checks_actual_catalog_registry_and_canonical_bytes(self):
        report, pub, result, databases = self.readback_fixture()
        for key, path in databases.items():
            with self.subTest(key=key):
                before = path.read_bytes()
                path.write_bytes(b"changed database")
                self.assertFalse(readback_matches(report, self.repo, pub, result))
                path.write_bytes(before)
                self.assertTrue(readback_matches(report, self.repo, pub, result))
        for suffix in ("-wal", "-shm", "-journal"):
            with self.subTest(sidecar=suffix):
                sidecar = Path(str(databases["catalogSha256"]) + suffix)
                sidecar.write_bytes(b"incomplete database state")
                self.assertFalse(readback_matches(report, self.repo, pub, result))
                sidecar.unlink()
        self.assertTrue(readback_matches(report, self.repo, pub, result))


if __name__ == "__main__":
    unittest.main()
