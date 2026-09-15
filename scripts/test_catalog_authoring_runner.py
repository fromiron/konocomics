"""Isolated runner regressions: no model, live publication, or STATE writes."""
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch, Mock

import catalog_authoring_runner as runner
from catalog_workspace import Workspace
from catalog_readback_identity import execution_identity, readback_matches


class RunnerTest(unittest.TestCase):
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

    def test_storage_failure_blocks_model_and_does_not_refreeze(self):
        args = SimpleNamespace(run_root=self.run_root, job=None, decisions=None, retry_model=False)
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
        def freeze(_command, inputs, outputs, _label):
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
        args = SimpleNamespace(run_root=other, job=None, decisions=None, retry_model=False)
        lock = self.repo / "data/local/catalog-authoring/locks" / (wid + ".lock")
        with runner.exclusive(lock), patch.object(runner, "ensure_frozen", return_value=self.frozen), \
             patch.object(runner, "invoke_model") as model:
            with self.assertRaises(OSError):
                runner.run_job(args)
            model.assert_not_called()

    def model_receipt(self, status="COMPLETED", output="{}"):
        attempt = self.run_root / "model-001"; attempt.mkdir()
        (attempt / "PROMPT.md").write_text("original prompt")
        (attempt / "schema.json").write_text("{}")
        (self.frozen / "panel-input/DECISION-SCHEMA.json").write_text("{}")
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
        def model(command, **_kwargs):
            Path(command[command.index("-o") + 1]).write_text("{}")
            return SimpleNamespace(returncode=0)
        with patch.object(runner.publisher, "validate_input", return_value=({}, [], "a" * 64)), \
             patch.object(runner, "reading_view", return_value={"sources": []}), \
             patch.object(runner, "preserve"), patch.object(runner.shutil, "which", return_value="codex"), \
             patch.object(runner.subprocess, "run", side_effect=model) as process:
            with self.assertRaisesRegex(ValueError, "invalid"):
                runner.invoke_model(self.run_root, self.frozen)
            process.assert_not_called()
            output = runner.invoke_model(self.run_root, self.frozen, retry=True)
            self.assertEqual(output.parent.name, "model-002")
            self.assertEqual(process.call_count, 1)
        self.assertEqual((attempt / "decisions.json").read_text(), "not JSON")

    def test_interrupted_model_preparation_keeps_files_and_uses_new_attempt(self):
        orphan = self.run_root / "model-001"
        runner.write(orphan / "schema.json", {"prepared": True})
        (self.frozen / "panel-input/DECISION-SCHEMA.json").write_text("{}")
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
        (self.frozen / "panel-input/DECISION-SCHEMA.json").write_text("{}")
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
        (self.frozen / "panel-input/DECISION-SCHEMA.json").write_text("{}")
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
        (self.frozen / "panel-input/DECISION-SCHEMA.json").write_text("{}")
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
        (self.frozen / "panel-input/DECISION-SCHEMA.json").write_text("{}")
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
