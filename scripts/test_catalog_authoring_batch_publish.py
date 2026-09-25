"""Publication recovery uses real storage; no model or canonical publication runs here."""
import json
from contextlib import nullcontext
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch

import catalog_authoring_batch_publish as batch


class BatchPublicationTest(unittest.TestCase):
    def test_cached_preflight_keeps_subset_identity_without_storage_writes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            with patch.object(batch.runner, "REPO", root), patch.object(batch.runner, "ROOT", root), \
                 patch.object(batch.subprocess, "run", return_value=SimpleNamespace(returncode=0, stderr="")) as execute:
                summary = {"works": [{"workId": "work-a", "status": "READY_FOR_PUBLICATION"}]}
                source = root / "summary.json"
                batch.runner.write(source, summary)
                hashes = []
                for number in range(2):
                    path, value = batch.preflight_result({"workId": "work-a"}, ["publisher"])
                    check = {**value, "workId": "work-a", "path": str(path), "sha256": batch.runner.panel.sha256(path)}
                    with patch.object(batch.runner.Workspace, "backup", side_effect=AssertionError("duplicate backup")) if number else nullcontext():
                        output, _, _ = batch.preserve_preflight(root / "batch", source, batch.runner.panel.sha256(source), summary, [check])
                    hashes.append(batch.runner.panel.sha256(output / "PASS-SUBSET.json"))
                self.assertEqual(hashes[0], hashes[1])
                self.assertEqual(execute.call_count, 1)
                batch.runner.write(output / "PREFLIGHT.json", {})
                with self.assertRaisesRegex(ValueError, "saved preflight result changed"):
                    batch.preserve_preflight(root / "batch", source, batch.runner.panel.sha256(source), summary, [check])

    def test_cache_reports_current_cost_and_retry_only_changes_selected_work(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(batch.runner, "ROOT", Path(directory)):
            with patch.object(batch.subprocess, "run", return_value=SimpleNamespace(returncode=0, stderr="")) as execute:
                initial = {wid: batch.preflight_result({"workId": wid}, ["publisher", wid]) for wid in ("work-a", "work-b")}
                retries = batch.retry_attempts(["work-a=retry-2"], set(initial))
                first, changed = batch.preflight_result({"workId": "work-a"}, ["publisher", "work-a"], attempt=retries.get("work-a", "initial"))
                second, hit = batch.preflight_result({"workId": "work-b"}, ["publisher", "work-b"], attempt=retries.get("work-b", "initial"))
                self.assertNotEqual(first, initial["work-a"][0])
                self.assertEqual(second, initial["work-b"][0])
                self.assertEqual(execute.call_count, 3)
                self.assertTrue(hit["cacheHit"])
                self.assertEqual(hit["timingsSeconds"]["subprocessElapsed"], 0)
                self.assertEqual(hit["originalCheckSeconds"], initial["work-b"][1]["elapsedSeconds"])
                self.assertEqual(hit["originalExecutionSeconds"], initial["work-b"][1]["timingsSeconds"]["subprocessElapsed"])
                self.assertGreaterEqual(hit["timingsSeconds"]["totalElapsed"], hit["timingsSeconds"]["validationElapsed"])
                for invalid in (["foreign=retry"], ["work-a="], ["work-a=one", "work-a=two"]):
                    with self.assertRaisesRegex(ValueError, "unique assigned Work"):
                        batch.retry_attempts(invalid, set(initial))

    def test_same_preflight_key_is_generated_once_under_concurrency(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(batch.runner, "ROOT", Path(directory)):
            with patch.object(batch.subprocess, "run", return_value=SimpleNamespace(returncode=0, stderr="")) as execute:
                with ThreadPoolExecutor(max_workers=2) as pool:
                    rows = list(pool.map(lambda _: batch.preflight_result({"workId": "work-a"}, ["publisher"]), range(2)))
                self.assertEqual(execute.call_count, 1)
                self.assertEqual(rows[0][0], rows[1][0])
                self.assertEqual(sorted(row[1]["cacheHit"] for row in rows), [False, True])

    def test_preflight_accepts_checked_storage_receipt_shape(self):
        row = {"storage": {"backupStatus": "BACKED_UP"}, "checkStorage": {
            "storage": {"backup": {"status": "BACKED_UP"}}}}
        self.assertEqual(batch.checked_backup_status(row), "BACKED_UP")
        self.assertEqual(batch.checked_backup_status({"checkStorage": {"backup": {"status": "BACKED_UP"}}}), "BACKED_UP")
        self.assertIsNone(batch.checked_backup_status({}))
        self.assertEqual(batch.checked_backup_status({"storage": {"backupStatus": "FAILED"}}), "FAILED")

    def test_preflight_reuses_only_same_identity_and_isolates_only_known_work_errors(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(batch.runner, "ROOT", Path(directory)):
            identity = {"workId": "work-a", "catalogSha256": "first", "code": "old"}
            result = SimpleNamespace(returncode=1, stderr=json.dumps({"error": "accepted baseline axis conflict: work-a darkness"}))
            validate = unittest.mock.Mock()
            with patch.object(batch.subprocess, "run", return_value=result) as execute:
                first, check = batch.preflight_result(identity, ["publisher"], validate)
                self.assertEqual(check["scope"], "WORK")
                self.assertEqual(batch.preflight_result(identity, ["publisher"], validate)[0], first)
                self.assertEqual(execute.call_count, 1)
                self.assertEqual(validate.call_count, 2)
                for field in ("catalogSha256", "code"):
                    path, _ = batch.preflight_result({**identity, field: "changed"}, ["publisher"], validate)
                    self.assertNotEqual(path, first)
                self.assertEqual(execute.call_count, 3)
                self.assertEqual(validate.call_count, 4)
                changed_command, _ = batch.preflight_result(identity, ["changed-publisher"], validate)
                self.assertNotEqual(changed_command, first)
                self.assertEqual(execute.call_count, 4)
                self.assertEqual(validate.call_count, 5)
                retry, retried = batch.preflight_result(identity, ["publisher"], validate, attempt="environment-retry-1")
                self.assertNotEqual(retry, first)
                self.assertTrue(first.exists())
                self.assertFalse(retried["cacheHit"])
                self.assertIn("elapsedSeconds", retried)
                with self.assertRaisesRegex(ValueError, "member changed"):
                    batch.preflight_result(identity, ["publisher"], lambda: (_ for _ in ()).throw(ValueError("member changed")))
            self.assertEqual(batch.preflight_scope('{"error":"frozen registry row set mismatch: work-a"}', "work-a"), "WORK")
            self.assertEqual(batch.preflight_scope('Traceback\nlegacy.PublishError: accepted baseline axis conflict: work-a darkness', "work-a"), "WORK")
            for error in ("manifest changed", "accepted baseline axis conflict: work-other darkness", "Traceback: dependency unavailable"):
                self.assertEqual(batch.preflight_scope(error, "work-a"), "BATCH")

    def test_code_identity_binds_external_helpers_gold_schema_and_policy(self):
        identity = batch.code_identity()
        for relative in ("scripts/workspace_paths.py", "scripts/sql/catalog-authority/001-init.sql",
                         "data/staging/catalog-expansion/gold-set-manifest.json",
                         "docs/catalog-expansion/02-authorized-evidence-panel-v1.md"):
            self.assertIn(relative, identity["files"])
            original = batch.runner.panel.sha256
            with patch.object(batch.runner.panel, "sha256", side_effect=lambda path: "changed" if path == batch.runner.REPO / relative else original(path)):
                self.assertNotEqual(batch.code_identity(), identity)
        self.assertFalse(any(Path(path).name.startswith("test_") for path in identity["files"]))

    def test_completion_requires_backup_and_survives_later_state_without_republishing(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            root = repo / "artifacts"
            output = root / "planning/batch"
            receipt = output / "BATCH-FINISHED.json"
            readback = output / "readback.json"
            publication = output / "publication"
            publication.mkdir(parents=True)
            (publication / "catalog.sqlite").write_bytes(b"immutable publication")
            with patch.object(batch.runner, "REPO", repo), patch.object(batch.runner, "ROOT", root):
                batch.runner.write(readback, {"verified": True})
                batch.runner.write(receipt, {"summarySha256": "summary", "readback": str(readback), "finalPublicationRoot": str(publication)})
                storage = batch.runner.preserve([output], "test:publication")
                applied = {"batchRoot": str(output), "receiptSha256": batch.runner.panel.sha256(receipt)}
                batch.runner.write(root / "STATE.json", {"publicationBatches": {"summary": applied}, "current": "first"})
                with patch.object(batch.runner, "preserve", side_effect=OSError("backup failed")):
                    with self.assertRaisesRegex(OSError, "backup failed"):
                        batch.complete_batch(output, receipt, storage)
                self.assertFalse((output / "BATCH-COMPLETED.json").exists())
                batch.complete_batch(output, receipt, storage)
                batch.runner.write(root / "STATE.json", {"publicationBatches": {"summary": applied}, "current": "later"})
                before = (root / "STATE.json").read_bytes()
                batch.verify_completed(output, applied)
                self.assertEqual((root / "STATE.json").read_bytes(), before)
                (publication / "catalog.sqlite").write_bytes(b"changed")
                with self.assertRaisesRegex(ValueError, "differ from saved snapshot"):
                    batch.verify_completed(output, applied)


if __name__ == "__main__":
    unittest.main()
