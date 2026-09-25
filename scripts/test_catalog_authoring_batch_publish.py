"""Publication recovery uses real storage; no model or canonical publication runs here."""
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

import catalog_authoring_batch_publish as batch


class BatchPublicationTest(unittest.TestCase):
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
                self.assertEqual(validate.call_count, 1)
                for field in ("catalogSha256", "code"):
                    path, _ = batch.preflight_result({**identity, field: "changed"}, ["publisher"], validate)
                    self.assertNotEqual(path, first)
                self.assertEqual(execute.call_count, 3)
                self.assertEqual(validate.call_count, 3)
                changed_command, _ = batch.preflight_result(identity, ["changed-publisher"], validate)
                self.assertNotEqual(changed_command, first)
                self.assertEqual(execute.call_count, 4)
                self.assertEqual(validate.call_count, 4)
            self.assertEqual(batch.preflight_scope('{"error":"frozen registry row set mismatch: work-a"}', "work-a"), "WORK")
            self.assertEqual(batch.preflight_scope('Traceback\nlegacy.PublishError: accepted baseline axis conflict: work-a darkness', "work-a"), "WORK")
            for error in ("manifest changed", "accepted baseline axis conflict: work-other darkness", "Traceback: dependency unavailable"):
                self.assertEqual(batch.preflight_scope(error, "work-a"), "BATCH")

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
