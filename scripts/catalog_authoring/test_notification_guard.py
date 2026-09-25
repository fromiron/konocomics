"""Exercise saved-result reminders and queue acknowledgements without a model call."""
import hashlib
import json
import tempfile
import unittest
from pathlib import Path

import notification_guard as guard


class NotificationGuardTest(unittest.TestCase):
    def test_collection_only_batch_completion_binds_research_receipts_and_backup(self):
        session = "01a0ccdc-ab40-7df0-9bb7-e428fc4de595"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            work_id = "work-aaaaaaaaaaaaaaaaaaaa"
            collection = root / work_id / "collection"
            collection.mkdir(parents=True)
            user_sources = root / "user-sources.json"
            user_sources.write_text("{}", encoding="utf-8")
            research = collection / "research.jsonl"
            research.write_text(json.dumps({"workId": work_id}) + "\n", encoding="utf-8")
            receipt = collection / "capture.json"
            receipt_body = collection / "capture.body"
            url = "https://example.test/review"
            receipt.write_text(json.dumps({"url": url, "complete": True}), encoding="utf-8")
            receipt_body.write_bytes(b"captured source")
            dispatch = root / "dispatch.json"
            guard.write(dispatch, {
                "phase": "collection-only", "batchId": "collection-test", "ownerThreadId": session,
                "parentThreadId": parent, "works": [{
                    "workId": work_id, "userSourcesPath": str(user_sources),
                    "userSourcesSha256": hashlib.sha256(user_sources.read_bytes()).hexdigest(),
                    "collectionOutput": str(collection),
                }],
            })
            summary = root / "summary.json"
            row = {
                "workId": work_id, "status": "EVIDENCE_FOUND", "userSourcesPath": str(user_sources),
                "userSourcesSha256": hashlib.sha256(user_sources.read_bytes()).hexdigest(),
                "collectionPath": str(collection), "researchPath": str(research),
                "researchSha256": hashlib.sha256(research.read_bytes()).hexdigest(), "sourceCount": 1,
                "sourceReceiptBindings": [{
                    "sourceUrl": url, "receiptPath": str(receipt),
                    "receiptSha256": hashlib.sha256(receipt.read_bytes()).hexdigest(),
                    "rawPath": str(receipt_body), "rawSha256": hashlib.sha256(receipt_body.read_bytes()).hexdigest(),
                    "bytes": receipt_body.stat().st_size,
                }],
                "storage": {"workspaceSnapshotId": 7, "backupSnapshotId": 7, "researchSha256Matches": True},
            }
            guard.write(summary, {
                "phase": "collection-only", "status": "COLLECTION_COMPLETE", "batchId": "collection-test",
                "ownerThreadId": session, "parentThreadId": parent, "assignedCount": 1, "processedCount": 1,
                "statusCounts": {"EVIDENCE_FOUND": 1}, "adjudicationAllowed": False,
                "publicationAllowed": False, "validator": {
                    "status": "PASS", "perWorkSourceAudit": True, "allAssignedResearchRowsPresent": True,
                    "dispatchIdentityAndUserSourceShaVerified": True, "rawReceiptBytesAndShaVerified": True,
                    "workspaceAndAppendOnlyBackupReadbackVerified": True, "backupStatus": "BACKED_UP",
                }, "works": [row],
            })
            state = root / "state"
            guard.register_batch(session, parent, dispatch, summary, root, state, root)
            assignment = guard.read(guard.state_path(session, state))
            self.assertEqual(assignment["phase"], "collection-batch")
            self.assertEqual(guard.result_identity(assignment), hashlib.sha256(summary.read_bytes()).hexdigest())

    def test_batch_requires_complete_unique_bound_results_and_ack(self):
        session = "01a0c194-1e06-77c3-bb1c-7c0afccca19b"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            dispatch, summary, checked = root / "dispatch.json", root / "summary.json", root / "CHECKED.json"
            guard.write(dispatch, {"batchId": "test", "ownerThreadId": session, "parentThreadId": parent, "works": [{"workId": "work-a"}]})
            guard.write(checked, {"workId": "work-a", "status": "ERROR", "error": "Source unavailable"})
            row = {"workId": "work-a", "status": "ERROR", "checkedPath": str(checked), "checkedSha256": hashlib.sha256(checked.read_bytes()).hexdigest()}
            value = {"batchId": "test", "ownerThreadId": session, "parentThreadId": parent, "works": [row]}
            guard.register_batch(session, parent, dispatch, summary, root, root / "state", root)
            assignment = guard.read(guard.state_path(session, root / "state"))
            for rows in ([], [row, row]):
                guard.write(summary, {**value, "works": rows})
                with self.assertRaises(ValueError):
                    guard.result_identity(assignment)
            for counts in ({"processedCount": 2}, {"resultCounts": {"ERROR": 0}}):
                with self.assertRaisesRegex(ValueError, "differs? from bound results"):
                    guard.validate_batch(assignment, {**value, **counts})
            guard.validate_batch(assignment, {**value, "processedCount": 1, "resultCounts": {"ERROR": 1}})
            guard.write(summary, value)
            sha = guard.result_identity(assignment)
            event = {"hook_event_name": "Stop", "session_id": session}
            self.assertIn("CATALOG_BATCH_COMPLETE", guard.on_stop(event, root / "state")["reason"])
            guard.acknowledge(session, sha, {"threadId": parent}, root / "state")
            self.assertEqual(guard.on_stop({**event, "stop_hook_active": True}, root / "state"), {})
            guard.write(checked, {"workId": "work-a", "status": "ERROR", "error": "changed"})
            with self.assertRaisesRegex(ValueError, "SHA mismatch"):
                guard.result_identity(assignment)

    def test_unfinished_batch_reports_each_turn_without_stop_loop(self):
        session = "01a0c193-f39c-7a72-b393-2977bff81697"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            guard.register(session, parent, "batch-a", "batch", root / "missing.json", root, root, root)
            event = {"hook_event_name": "Stop", "session_id": session}
            for _ in range(2):
                result = guard.on_stop(event, root)
                self.assertEqual(result["decision"], "block")
                self.assertIn("CATALOG_PARTIAL_STOP", result["reason"])
                self.assertIn(parent, result["reason"])
                self.assertIn("model=gpt-5.6-sol and thinking=high", result["reason"])
                self.assertIn("needsResume=false", result["reason"])
                self.assertEqual(guard.on_stop({**event, "stop_hook_active": True}, root), {})
            path = guard.state_path(session, root)
            guard.write(path, {**guard.read(path), "active": False})
            self.assertEqual(guard.on_stop(event, root), {})

    def test_result_notification_lifecycle(self):
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        event = {"hook_event_name": "Stop", "session_id": session, "stop_hook_active": False}
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            state, artifact = root / "state", root / "decisions.json"
            self.assertEqual(guard.on_stop(event, state), {})
            guard.register(session, parent, "work-a", "adjudication", artifact, root, state, root)
            self.assertEqual(guard.on_stop(event, state), {})
            with self.assertRaises(ValueError):
                guard.register(session, parent, "work-b", "adjudication", artifact, root, state, root)
            with self.assertRaises(ValueError):
                guard.register(session, parent, "work-a", "adjudication", root.parent / "outside.json", root, state, root)
            artifact.write_text(json.dumps({"works": [{"workId": "work-a", "disposition": "hold"}]}))
            self.assertEqual(guard.on_stop({**event, "stop_hook_active": True}, state), {})
            self.assertEqual(guard.on_stop({**event, "hook_event_name": "Interrupt"}, state), {})
            original = artifact.read_bytes()
            notification = guard.on_stop(event, state)
            self.assertEqual(notification["decision"], "block")
            self.assertIn("model=gpt-5.6-sol and thinking=high", notification["reason"])
            guard.register(session, parent, "work-a", "adjudication", artifact, root, state, root)
            self.assertEqual(guard.on_stop(event, state), {})
            sha = hashlib.sha256(original).hexdigest()
            with self.assertRaises(ValueError):
                guard.acknowledge(session, sha, {"isError": True}, state)
            with self.assertRaises(ValueError):
                guard.acknowledge(session, sha, {"threadId": session}, state)
            guard.acknowledge(session, sha, {"content": [{"type": "text", "text": json.dumps({"threadId": parent})}], "isError": False}, state)
            self.assertEqual(guard.on_stop(event, state), {})
            self.assertEqual(artifact.read_bytes(), original)
            research = root / "research.jsonl"
            guard.register(session, parent, "work-b", "collection", research, root, state, root)
            research.write_text('{"workId":"work-b"}\n')
            sha = hashlib.sha256(research.read_bytes()).hexdigest()
            with self.assertRaises(ValueError):
                guard.acknowledge(session, "0" * 64, {"threadId": parent}, state)
            guard.acknowledge(session, sha, {"threadId": parent}, state)
            self.assertEqual(guard.on_stop(event, state), {})
            research.write_text('{"workId":"wrong"}\n')
            with self.assertRaises(ValueError):
                guard.on_stop(event, state)


if __name__ == "__main__":
    unittest.main()
