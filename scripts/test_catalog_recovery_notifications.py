"""Current recovery preserves pending delivery, not archived notification history."""
import json
import unittest
import uuid
from unittest.mock import patch

import catalog_retention as retention
from catalog_authoring import notification_guard as guard
from catalog_revision_store import RevisionWorkspace
import test_catalog_retention as retention_tests


class RecoveryNotificationTest(unittest.TestCase):
    def fixture(self, *, consumed=False, missing_index=False):
        owner = retention_tests.RetentionCutoverTest()
        self.addCleanup(owner.doCleanups)
        repo, store, _, _, registration, _, _, _ = owner.recovery_fixture()
        current_bytes = registration.read_bytes()
        current = json.loads(current_bytes)
        registration.unlink()
        run = repo / retention.CONTINUATION / "planning/previous-assignment"
        artifact = run / "result.json"
        guard.write(artifact, {"works": [{"workId": "previous-work"}]})
        guard.register(current["sessionId"], current["parentThreadId"], "previous-work", "adjudication",
                       artifact, run, registration.parent, repo)
        event_path, event = guard.enqueue(current["sessionId"], registration.parent)
        guard.acknowledge(current["sessionId"], event["checkpointSha256"], {"threadId": current["parentThreadId"]},
                          registration.parent, event_id=event["eventId"])
        if consumed:
            handling = repo / "handled.json"
            guard.write(handling, {"schemaVersion": "catalog-notification-handling-v1", "eventId": event["eventId"],
                                  "parentThreadId": current["parentThreadId"], "decision": "stage-reviewed", "reason": "Already handled"})
            guard.consume(current["parentThreadId"], event["eventId"], handling, registration.parent)
        index = registration.parent / "inbox" / current["parentThreadId"] / (event["eventId"] + ".json")
        if missing_index:
            index.unlink()
        store.save([run], "previous-notification")
        registration.write_bytes(current_bytes)
        history = registration.parent / "revisions/old-session/unreferenced.json"
        guard.write(history, {"historyOnly": True})
        return repo, store, registration, current, event_path, event, index, history

    def test_pending_event_closure_survives_new_assignment_and_lost_inbox_index(self):
        for missing_index in (False, True):
            with self.subTest(missingIndex=missing_index):
                repo, store, registration, current, event_path, event, index, history = self.fixture(missing_index=missing_index)
                paths, _, _, observed = retention.recovery_notification_paths(repo)
                self.assertIn(event_path, paths)
                self.assertIn(event_path.parent / "checkpoint.json", paths)
                self.assertIn(event_path.parent / "validation.json", paths)
                self.assertIn(event_path.parent / "transport.json", paths)
                self.assertNotIn(history, paths)
                self.assertEqual(index in paths, not missing_index)
                self.assertEqual(observed[registration], retention.digest(registration.read_bytes()))
                store.backup()
                backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
                destination = repo / "restored"
                retention.restore_current(backup, destination)
                self.assertFalse((destination / event_path.relative_to(repo)).exists())
                from catalog_authoring import test_notification_guard as cli_tests
                result = cli_tests.NotificationGuardTest().restored_cli(destination, "drain", "--parent", current["parentThreadId"])
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                self.assertFalse((destination / history.relative_to(repo)).exists())
                self.assertEqual((destination / event_path.relative_to(repo)).read_bytes(), event_path.read_bytes())
                pending = json.loads(result.stdout)
                self.assertEqual([row["eventId"] for row in pending], [event["eventId"]])
                self.assertTrue((destination / index.relative_to(repo)).is_file())
                self.assertFalse((destination / registration.relative_to(repo)).exists())

    def test_unreferenced_consumed_notification_history_is_not_materialized(self):
        repo, store, _, current, event_path, _, index, history = self.fixture(consumed=True)
        paths, _, _, _ = retention.recovery_notification_paths(repo)
        self.assertNotIn(event_path, paths)
        self.assertNotIn(index, paths)
        self.assertNotIn(history, paths)
        store.backup()
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        destination = repo / "restored"
        retention.restore_current(backup, destination)
        from catalog_authoring import test_notification_guard as cli_tests
        result = cli_tests.NotificationGuardTest().restored_cli(destination, "drain", "--parent", current["parentThreadId"])
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(json.loads(result.stdout), [])
        for path in (event_path, index, history):
            self.assertFalse((destination / path.relative_to(repo)).exists())

    def test_backup_rejects_assignment_changed_between_discovery_and_inventory(self):
        repo, store, registration, current, _, _, _, _ = self.fixture()
        original_inventory = store._inventory
        changed = False

        def replace_assignment(roots, *args, **kwargs):
            nonlocal changed
            if not changed and registration in roots:
                changed = True
                root = repo / retention.CONTINUATION / "planning/new-generation"
                dispatch = root / "DISPATCH.json"
                guard.write(dispatch, {"batchId": "new-generation", "ownerThreadId": current["sessionId"],
                                       "parentThreadId": current["parentThreadId"], "phase": "collection", "works": []})
                guard.write(registration, {**current, "runRoot": str(root), "artifact": str(root / "SUMMARY.json"),
                                          "dispatchPath": str(dispatch), "dispatchSha256": retention.digest(dispatch.read_bytes()),
                                          "generation": "new-generation", "suspended": False, "executionTurnId": "new-turn"})
            return original_inventory(roots, *args, **kwargs)

        with patch.object(store, "_inventory", side_effect=replace_assignment):
            with self.assertRaisesRegex(ValueError, "changed|differs"):
                store.backup()
        self.assertTrue(changed)
        self.assertIsNone(store.current_revision("active", "current-recovery-controls"))
        self.assertFalse((repo / retention.BASE / "backups/latest.sqlite").exists())

    def test_backup_rejects_new_registration_after_notification_scope_discovery(self):
        repo, store, registration, current, _, _, _, _ = self.fixture()
        discover = retention.recovery_notification_paths

        def add_after_discovery(source):
            result = discover(source)
            session = str(uuid.uuid4())
            guard.write(registration.parent / (session + ".json"),
                        {"sessionId": session, "parentThreadId": current["parentThreadId"], "active": False})
            return result

        with patch.object(retention, "recovery_notification_paths", side_effect=add_after_discovery):
            with self.assertRaisesRegex(ValueError, "scope changed"):
                store.backup()
        self.assertIsNone(store.current_revision("active", "current-recovery-controls"))

    def test_current_consumed_event_remains_available_for_stop_idempotency(self):
        repo, _, registration, _, event_path, event, _, _ = self.fixture(consumed=True)
        run = event_path.parent.parent.parent
        guard.write(registration, {**event["assignment"], "generation": event["generation"],
                                   "artifact": str(run / "result.json"), "active": True})
        paths, _, _, _ = retention.recovery_notification_paths(repo)
        for path in (event_path, event_path.parent / "consumed.json", event_path.parent / "handling.json",
                     event_path.parent / "transport.json"):
            self.assertIn(path, paths)

    def test_explicit_user_stop_retains_unfinished_collection_without_resuming(self):
        repo, store, registration, current, _, _, _, _ = self.fixture()
        current.update(active=False, suspended=True, executionTurnId=None)
        guard.write(registration, current)
        original = registration.read_bytes()
        dispatch = json.loads(retention.artifact_path(current["dispatchPath"], repo).read_bytes())
        collection = retention.artifact_path(dispatch["works"][0]["collectionOutput"], repo)
        store.backup()
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        destination = repo / "restored"
        report = retention.restore_current(backup, destination)
        self.assertFalse(report["workersResumed"])
        self.assertFalse((destination / registration.relative_to(repo)).exists())
        from catalog_authoring import test_notification_guard as cli_tests
        result = cli_tests.NotificationGuardTest().restored_cli(destination, "clear", "--session", current["sessionId"])
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((destination / registration.relative_to(repo)).read_bytes(), original)
        self.assertFalse((destination / collection.relative_to(repo)).exists())
        from contextlib import closing
        restored = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
        with closing(restored.connect()) as db:
            body_sha = retention.digest((collection / "capture.body").read_bytes())
            self.assertEqual(restored.read_blob(db, body_sha), (collection / "capture.body").read_bytes())

    def test_legacy_pending_batch_restores_checked_dependencies_for_drain(self):
        """Legacy event readers still require the actual saved check dependency tree."""
        import catalog_authoring_batch_publish as batch
        repo, store, registration, current, _, _, _, _ = self.fixture()
        session, parent = str(uuid.uuid4()), current["parentThreadId"]
        run = repo / retention.CONTINUATION / "planning/legacy-batch"
        work = run / "work-a"
        decision, frozen, sealed = work / "decisions.json", work / "frozen/panel-input/PANEL-INPUT.sha256", work / "sealed"
        for path in (decision, frozen, sealed / "test.json"):
            guard.write(path, {"testOnly": True})
        batch.runner.publisher._write_result_manifest(sealed)
        sha = batch.runner.panel.sha256
        checked = work / "CHECKED.json"
        guard.write(checked, {"workId": "work-a", "status": "READY_FOR_PUBLICATION", "decisionsSha256": sha(decision),
                              "inputManifestSha256": sha(frozen), "sealedRoot": str(sealed), "resultManifestSha256": sha(sealed / "MANIFEST.sha256")})
        guard.write(work / "RUN.json", {"decisionsPath": str(decision)})
        retained = store.persist([work], "legacy check", phase_boundary=True)
        guard.write(work / "CHECK-STORAGE.json", {"checkedSha256": sha(checked), "storage": retained})
        identity = {"batchId": "legacy", "ownerThreadId": session, "parentThreadId": parent}
        summary, dispatch = run / "SUMMARY.json", run / "DISPATCH.json"
        guard.write(summary, {**identity, "works": [{"workId": "work-a", "status": "READY_FOR_PUBLICATION", "checkedPath": str(checked), "checkedSha256": sha(checked)}]})
        guard.write(dispatch, {**identity, "works": [{"workId": "work-a"}]})
        factory = lambda repo=None, database=None: RevisionWorkspace(store.repo, database or store.database)
        with patch("catalog_workspace.Workspace", side_effect=factory):
            guard.register_batch(session, parent, dispatch, summary, run, registration.parent, repo)
            event_path, event = guard.enqueue(session, registration.parent)
            event.pop("validationSha256")  # Persist the supported original event schema.
            guard.write(event_path, event)
            guard.write(registration.parent / "inbox" / parent / (event["eventId"] + ".json"),
                        {"path": str(event_path), "sha256": sha(event_path)})
            guard.acknowledge(session, event["checkpointSha256"], {"threadId": parent}, registration.parent, event_id=event["eventId"])
            next_run = repo / retention.CONTINUATION / "planning/after-legacy-batch"
            next_dispatch = next_run / "DISPATCH.json"
            guard.write(next_dispatch, {**identity, "batchId": "next", "works": []})
            guard.register_batch(session, parent, next_dispatch, next_run / "SUMMARY.json", next_run, registration.parent, repo)
        store.save([run, next_run], "legacy pending dependency bytes")
        store.backup()
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        destination = repo / "restored"
        retention.restore_current(backup, destination)
        self.assertFalse((destination / checked.relative_to(repo)).exists())
        from catalog_authoring import test_notification_guard as cli_tests
        result = cli_tests.NotificationGuardTest().restored_cli(destination, "drain", "--parent", parent)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((destination / checked.relative_to(repo)).read_bytes(), checked.read_bytes())
        self.assertIn(event["eventId"], {row["eventId"] for row in json.loads(result.stdout)})
        self.assertTrue((destination / retention.BASE / "backups/latest.sqlite").is_file())


if __name__ == "__main__":
    unittest.main()
