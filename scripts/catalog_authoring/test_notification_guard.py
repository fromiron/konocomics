"""Exercise saved-result reminders and queue acknowledgements without a model call."""
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import notification_guard as guard


class NotificationGuardTest(unittest.TestCase):
    def test_publication_subsets_keep_remaining_ready_pending_until_exact_completion(self):
        """Synthetic decisions exercise durable acknowledgement, not model authority."""
        import catalog_authoring_batch_publish as batch
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        sha = batch.runner.panel.sha256
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            state, run = root / "notifications", root / "run"
            rows = []
            for wid in ("work-a", "work-b"):
                work = run / wid
                decision, frozen, sealed = work / "decisions.json", work / "frozen/panel-input/PANEL-INPUT.sha256", work / "sealed"
                guard.write(decision, {"testOnly": True})
                guard.write(frozen, {"testOnly": True})
                guard.write(sealed / "test.json", {"testOnly": True})
                batch.runner.publisher._write_result_manifest(sealed)
                checked = work / "CHECKED.json"
                guard.write(checked, {"workId": wid, "status": "READY_FOR_PUBLICATION", "decisionsSha256": sha(decision),
                                      "inputManifestSha256": sha(frozen), "sealedRoot": str(sealed), "resultManifestSha256": sha(sealed / "MANIFEST.sha256")})
                guard.write(work / "RUN.json", {"decisionsPath": str(decision)})
                guard.write(work / "CHECK-STORAGE.json", {"checkedSha256": sha(checked), "storage": {"backup": {"status": "BACKED_UP"}}})
                rows.append({"workId": wid, "status": "READY_FOR_PUBLICATION", "checkedPath": str(checked), "checkedSha256": sha(checked)})
            summary, dispatch = run / "summary.json", run / "dispatch.json"
            identity = {"batchId": "test", "ownerThreadId": session, "parentThreadId": parent}
            guard.write(summary, {**identity, "works": rows})
            guard.write(dispatch, {**identity, "works": [{"workId": row["workId"]} for row in rows]})
            guard.register_batch(session, parent, dispatch, summary, run, state, root)
            event_path, event = guard.enqueue(session, state)
            effect = run / "handling-request.json"
            handling = {"schemaVersion": "catalog-notification-handling-v1", "eventId": event["eventId"],
                        "parentThreadId": parent, "reason": "Verified subset publication"}
            refs, ledger = [], {}
            with patch.object(guard, "ROOT", root), patch.object(batch.runner, "ROOT", root), patch.object(batch.runner, "REPO", root):
                for row in rows:
                    subset = run / (row["workId"] + "-subset.json")
                    guard.write(subset, {**identity, "sourceSummary": {"path": str(summary), "sha256": sha(summary)}, "works": [row]})
                    refs.append({"summaryPath": str(subset), "summarySha256": sha(subset)})
                    output = root / (row["workId"] + "-publication")
                    receipt, readback, publication = output / "BATCH-FINISHED.json", output / "readback.json", output / "publication"
                    guard.write(readback, {"testOnly": True})
                    guard.write(publication / "test.json", {"testOnly": True})
                    guard.write(receipt, {"summarySha256": sha(subset), "readback": str(readback), "finalPublicationRoot": str(publication), "works": [{"workId": row["workId"]}]})
                    storage = batch.runner.preserve([output], "test:subset")
                    applied = {"batchRoot": str(output), "receiptSha256": sha(receipt)}
                    ledger[sha(subset)] = applied
                    guard.write(root / "STATE.json", {"publicationBatches": ledger})
                    if len(refs) == 1:
                        guard.write(effect, {**handling, "decision": "partially-published", "publications": list(refs)})
                        with self.assertRaisesRegex(ValueError, "needs completion recovery"):
                            guard.consume(parent, event["eventId"], effect, state)
                    batch.complete_batch(output, receipt, storage)
                    guard.write(effect, {**handling, "decision": "published", "publications": list(refs)})
                    if len(refs) == 1:
                        with self.assertRaisesRegex(ValueError, "remaining READY"):
                            guard.consume(parent, event["eventId"], effect, state)
                        guard.write(effect, {**handling, "decision": "partially-published", "publications": list(refs)})
                        result = guard.consume(parent, event["eventId"], effect, state)
                        self.assertEqual(result["remainingReadyWorkIds"], ["work-b"])
                        self.assertEqual(guard.pending(parent, state)[0]["remainingReadyWorkIds"], ["work-b"])
                        self.assertFalse((event_path.parent / "consumed.json").exists())
                    else:
                        guard.consume(parent, event["eventId"], effect, state)
                        self.assertEqual(guard.pending(parent, state), [])
                        self.assertEqual(guard.read(event_path.parent / "handling.json")["publicationCoverage"]["publishedWorkIds"], ["work-a", "work-b"])
                bad = run / "foreign-subset.json"
                guard.write(bad, {**identity, "sourceSummary": {"path": str(summary), "sha256": sha(summary)}, "works": [{**rows[0], "checkedSha256": "0" * 64}]})
                with self.assertRaisesRegex(ValueError, "exact source rows"):
                    guard.publication_coverage(event, {"decision": "published", "publications": [{"summaryPath": str(bad), "summarySha256": sha(bad)}]})

    def test_enqueue_crash_boundaries_recover_index_before_reassignment(self):
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        for boundary in ("checkpoint", "event", "index"):
            with self.subTest(boundary=boundary), tempfile.TemporaryDirectory() as folder:
                root = Path(folder)
                state, run = root / "state", root / "run"
                artifact = run / "result.json"
                guard.write(artifact, {"works": [{"workId": "work-a"}]})
                guard.register(session, parent, "work-a", "adjudication", artifact, run, state, root)
                original = guard.write_bytes
                def fail_after_write(path, body):
                    original(path, body)
                    if ((boundary == "checkpoint" and path.name == "checkpoint.json")
                            or (boundary == "event" and path.name == "event.json")
                            or (boundary == "index" and path.parent.parent.name == "inbox")):
                        raise OSError("injected crash after " + boundary)
                with patch.object(guard, "write_bytes", side_effect=fail_after_write):
                    with self.assertRaisesRegex(OSError, "injected crash"):
                        guard.enqueue(session, state)
                if boundary == "checkpoint":
                    with self.assertRaisesRegex(ValueError, "still active"):
                        guard.register(session, parent, "work-b", "collection", root / "next/result.json", root / "next", state, root)
                    guard.enqueue(session, state)
                # Reassignment itself repairs the lost index before losing the old current slot.
                guard.register(session, parent, "work-b", "collection", root / "next/result.json", root / "next", state, root)
                rows = guard.pending(parent, state)
                self.assertEqual(len(rows), 1)
                event_id = rows[0]["eventId"]
                index = state / "inbox" / parent / (event_id + ".json")
                index.unlink()
                self.assertEqual(guard.pending(parent, state)[0]["eventId"], event_id)
                self.assertTrue(index.exists())
                self.assertEqual(len(guard.pending(parent, state)), 1)

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
            from catalog_revision_store import RevisionWorkspace
            store = RevisionWorkspace.create(root, root / "data/local/catalog-authoring/workspace.sqlite")
            store.persist([collection], "collection", phase_boundary=True)
            with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
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
            event = {"hook_event_name": "Stop", "session_id": session, "turn_id": "execution-1"}
            self.assertEqual(guard.on_stop(event, root / "state"), {})
            guard.on_prompt(event, root / "state")
            guard.arm(session, root / "state")
            self.assertIn("CATALOG_BATCH_COMPLETE", guard.on_stop(event, root / "state")["reason"])
            guard.acknowledge(session, sha, {"threadId": parent}, root / "state")
            self.assertEqual(guard.on_stop(event, root / "state"), {})
            self.assertEqual(guard.on_stop({**event, "stop_hook_active": True}, root / "state"), {})
            guard.write(checked, {"workId": "work-a", "status": "ERROR", "error": "changed"})
            with self.assertRaisesRegex(ValueError, "SHA mismatch"):
                guard.result_identity(assignment)

    def test_partial_events_survive_report_turn_new_assignment_and_parent_idle(self):
        session = "01a0c193-f39c-7a72-b393-2977bff81697"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            dispatch = root / "dispatch.json"
            guard.write(dispatch, {"batchId": "batch-a", "ownerThreadId": session, "parentThreadId": parent, "works": [{"workId": "work-a"}]})
            guard.register_batch(session, parent, dispatch, root / "missing.json", root, root, root)
            event = {"hook_event_name": "Stop", "session_id": session, "turn_id": "execution-1"}
            guard.on_prompt(event, root)
            guard.arm(session, root)
            self.assertEqual(guard.on_stop(event, root), {})
            partial = root / "partial.json"
            checkpoint = {"batchId": "batch-a", "ownerThreadId": session, "parentThreadId": parent,
                          "phase": "batch", "processedCount": 0, "nextWorkId": "work-a", "exactReason": "Source unavailable", "needsResume": False}
            guard.write(partial, checkpoint)
            path, first = guard.enqueue(session, root, checkpoint=partial, kind="partial-stop")
            self.assertEqual(guard.enqueue(session, root, checkpoint=partial, kind="partial-stop")[0], path)
            guard.write(partial, {**checkpoint, "processedCount": 1, "nextWorkId": None})
            _, second = guard.enqueue(session, root, checkpoint=partial, kind="user-stop")
            self.assertEqual(guard.enqueue(session, root, checkpoint=partial, kind="user-stop")[1], second)
            self.assertNotEqual(first["eventId"], second["eventId"])
            with self.assertRaisesRegex(ValueError, "current saved result"):
                guard.acknowledge(session, second["checkpointSha256"], {"threadId": parent}, root)
            with self.assertRaisesRegex(ValueError, "assigned parent"):
                guard.acknowledge(session, second["checkpointSha256"], {"threadId": session}, root, event_id=second["eventId"])
            guard.acknowledge(session, second["checkpointSha256"], {"threadId": parent}, root, event_id=second["eventId"])
            transport = guard.read(Path(second["checkpointPath"]).parent / "transport.json")
            self.assertEqual(transport["eventId"], second["eventId"])
            self.assertTrue(guard.read(guard.state_path(session, root))["suspended"])
            self.assertEqual(len(guard.pending(parent, root)), 2)
            self.assertIn("additionalContext", guard.on_prompt({"session_id": parent, "turn_id": "parent-next"}, root)["hookSpecificOutput"])
            guard.register(session, parent, "next-batch", "batch", root / "next.json", root, root, root)
            self.assertEqual(len(guard.pending(parent, root)), 2)
            self.assertEqual(guard.on_stop(event, root), {})
            effect = root / "handling.json"
            guard.write(effect, {"schemaVersion": "catalog-notification-handling-v1", "eventId": first["eventId"],
                                 "parentThreadId": parent, "decision": "deferred", "reason": "Keep the saved checkpoint; user action required"})
            ack = guard.consume(parent, first["eventId"], effect, root)
            self.assertEqual(guard.consume(parent, first["eventId"], effect, root), ack)
            (path.parent / "consumed.json").unlink()  # Crash after durable handling, before ACK.
            self.assertTrue(next(row for row in guard.pending(parent, root) if row["eventId"] == first["eventId"])["handlingRecorded"])
            self.assertEqual(guard.consume(parent, first["eventId"], effect, root), ack)
            self.assertEqual(len(guard.pending(parent, root)), 1)

    def test_saved_completion_allows_new_assignment_without_discarding_idle_parent_event(self):
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            artifact = root / "result.json"
            guard.write(artifact, {"works": [{"workId": "work-a"}]})
            guard.register(session, parent, "work-a", "adjudication", artifact, root, root, root)
            path, _ = guard.enqueue(session, root)
            guard.register(session, parent, "work-b", "collection", root / "next.jsonl", root, root, root)
            self.assertEqual(guard.read(guard.state_path(session, root))["workId"], "work-b")
            self.assertEqual(guard.pending(parent, root)[0]["path"], str(path))

    def test_result_notification_lifecycle(self):
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        event = {"hook_event_name": "Stop", "session_id": session, "turn_id": "execution-1", "stop_hook_active": False}
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            state, artifact = root / "state", root / "decisions.json"
            self.assertEqual(guard.on_stop(event, state), {})
            guard.register(session, parent, "work-a", "adjudication", artifact, root, state, root)
            guard.on_prompt(event, state)
            guard.arm(session, state)
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
            guard.arm(session, state)
            research.write_text('{"workId":"work-b"}\n')
            sha = hashlib.sha256(research.read_bytes()).hexdigest()
            with self.assertRaises(ValueError):
                guard.acknowledge(session, "0" * 64, {"threadId": parent}, state)
            guard.acknowledge(session, sha, {"threadId": parent}, state)
            self.assertEqual(guard.on_stop(event, state), {})
            research.write_text('{"workId":"wrong"}\n')
            with self.assertRaises(ValueError):
                guard.on_stop(event, state)

    def test_report_turn_interrupt_and_new_checkpoint_do_not_replay_old_notification(self):
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            artifact = root / "result.json"
            guard.write(artifact, {"works": [{"workId": "work-a", "revision": 1}]})
            guard.register(session, parent, "work-a", "adjudication", artifact, root, root, root)
            event = {"hook_event_name": "Stop", "session_id": session, "turn_id": "execution"}
            guard.on_prompt(event, root)
            guard.arm(session, root)
            self.assertEqual(guard.on_stop(event, root)["decision"], "block")
            self.assertEqual(guard.on_stop(event, root), {})
            guard.write(artifact, {"works": [{"workId": "work-a", "revision": 2}]})
            self.assertEqual(guard.on_stop(event, root)["decision"], "block")
            self.assertEqual(len(guard.pending(parent, root)), 2)
            report = {**event, "turn_id": "retrospective"}
            guard.on_prompt(report, root)
            self.assertEqual(guard.on_stop(report, root), {})
            guard.arm(session, root)
            guard.on_interrupt(report, root)
            self.assertEqual(guard.on_stop(report, root), {})
            with self.assertRaisesRegex(ValueError, "new turn"):
                guard.arm(session, root, resume=True)
            with self.assertRaisesRegex(ValueError, "stopped"):
                guard.arm(session, root)
            guard.clear(session, root)
            guard.register(session, parent, "work-a", "adjudication", artifact, root, root, root)
            with self.assertRaisesRegex(ValueError, "stopped"):
                guard.arm(session, root)
            guard.on_prompt({**event, "turn_id": "authorized-resume"}, root)
            guard.arm(session, root, resume=True)
            guard.on_interrupt(report, root)
            self.assertEqual(guard.read(guard.state_path(session, root))["executionTurnId"], "authorized-resume")
            original_write = guard.write
            def interrupt_after_transport(path, value):
                original_write(path, value)
                if path.name == "transport.json":
                    guard.on_interrupt({**event, "turn_id": "authorized-resume"}, root)
            with patch.object(guard, "write", side_effect=interrupt_after_transport):
                guard.acknowledge(session, hashlib.sha256(artifact.read_bytes()).hexdigest(), {"threadId": parent}, root)
            self.assertTrue(guard.read(guard.state_path(session, root))["suspended"])
            with self.assertRaisesRegex(ValueError, "new turn"):
                guard.arm(session, root, resume=True)


if __name__ == "__main__":
    unittest.main()
