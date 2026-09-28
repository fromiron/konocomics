"""Exercise saved-result reminders and queue acknowledgements without a model call."""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import notification_guard as guard


class NotificationGuardTest(unittest.TestCase):
    def restored_cli(self, destination, *arguments, stdin=None):
        """Run the unchanged public CLI from a separately installed code tree."""
        source = Path(guard.__file__).resolve().parents[1]
        script = destination / "scripts/catalog_authoring/notification_guard.py"
        if not script.is_file():
            for path in source.rglob("*.py"):
                target = destination / "scripts" / path.relative_to(source)
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(path, target)
        # The pinned embedded runtime's _pth belongs to the normal checkout;
        # load this copied code tree explicitly without changing product calls.
        bootstrap = "import runpy,sys;from pathlib import Path;p=Path(sys.argv[1]);sys.path[:0]=[str(p.parents[1]),str(p.parent)];sys.argv=sys.argv[1:];runpy.run_path(str(p),run_name='__main__')"
        return subprocess.run([sys.executable, "-B", "-c", bootstrap, str(script), *arguments],
                              input=stdin, text=True, capture_output=True, cwd=destination,
                              env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}, timeout=60)

    def db_only_fixture(self):
        import catalog_retention as retention
        import test_catalog_recovery_notifications as recovery_tests
        from catalog_revision_store import RevisionWorkspace
        owner = recovery_tests.RecoveryNotificationTest()
        self.addCleanup(owner.doCleanups)
        repo, store, registration, current, event_path, event, _, _ = owner.fixture()
        unrelated_session, unrelated_parent = "cccccccc-cccc-cccc-cccc-cccccccccccc", "dddddddd-dddd-dddd-dddd-dddddddddddd"
        unrelated = repo / retention.CONTINUATION / "planning/unrelated"
        artifact = unrelated / "result.json"
        guard.write(artifact, {"works": [{"workId": "unrelated-work"}]})
        guard.register(unrelated_session, unrelated_parent, "unrelated-work", "adjudication", artifact,
                       unrelated, registration.parent, repo)
        guard.enqueue(unrelated_session, registration.parent)
        store.save([unrelated], "unrelated preserved notification")
        store.backup()
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        return repo, store, backup, registration, current, event_path, event, unrelated

    def test_db_only_cli_ack_consume_prepares_only_requested_event_and_preserves_stop(self):
        import catalog_retention as retention
        from catalog_revision_store import RevisionWorkspace
        repo, _, backup, registration, current, event_path, event, unrelated = self.db_only_fixture()
        original_registration, original_event = registration.read_bytes(), event_path.read_bytes()
        destination = repo / "db-only"
        retention.restore_current(backup, destination)
        self.assertFalse((destination / retention.CONTINUATION).exists())
        self.assertFalse((destination / registration.parent.relative_to(repo)).exists())
        result = self.restored_cli(destination, "ack", "--session", current["sessionId"], "--event", event["eventId"],
                                   "--sha", event["checkpointSha256"], stdin=json.dumps({"threadId": current["parentThreadId"]}))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((destination / registration.relative_to(repo)).read_bytes(), original_registration)
        self.assertEqual((destination / event_path.relative_to(repo)).read_bytes(), original_event)
        self.assertFalse((destination / unrelated.relative_to(repo)).exists())
        self.assertFalse((destination / retention.BASE / "retained/basis").exists())
        self.assertFalse((destination / retention.BASE / "backups/latest.sqlite").exists())
        effect = destination / "handling.json"
        guard.write(effect, {"schemaVersion": "catalog-notification-handling-v1", "eventId": event["eventId"],
                             "parentThreadId": current["parentThreadId"], "decision": "stage-reviewed", "reason": "Observe restored delivery"})
        consumed = self.restored_cli(destination, "consume", "--parent", current["parentThreadId"], "--event", event["eventId"], "--effect", str(effect))
        self.assertEqual(consumed.returncode, 0, consumed.stdout + consumed.stderr)
        self.assertFalse((destination / retention.BASE / "backups/latest.sqlite").exists())
        drained = self.restored_cli(destination, "drain", "--parent", current["parentThreadId"])
        self.assertEqual(drained.returncode, 0, drained.stdout + drained.stderr)
        self.assertEqual(json.loads(drained.stdout), [])
        self.assertFalse((destination / unrelated.relative_to(repo)).exists())
        restored = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
        restored.backup()
        second = repo / "second-db-only"
        retention.restore_current(RevisionWorkspace(destination, destination / retention.BASE / "backups/latest.sqlite"), second)
        drained = self.restored_cli(second, "drain", "--parent", current["parentThreadId"])
        self.assertEqual(drained.returncode, 0, drained.stdout + drained.stderr)
        self.assertEqual(json.loads(drained.stdout), [])
        self.assertEqual(registration.read_bytes(), original_registration)
        self.assertEqual(event_path.read_bytes(), original_event)

    def test_db_only_cli_enqueue_reuses_event_and_rejects_conflicting_immutable_cache(self):
        import catalog_retention as retention
        from catalog_revision_store import RevisionWorkspace
        repo, store, _, registration, current, event_path, event, unrelated = self.db_only_fixture()
        assignment = {**event["assignment"], "generation": event["generation"], "active": True,
                      "artifact": str(event_path.parent.parent.parent / "result.json"), "executionTurnId": "saved-turn"}
        guard.write(registration, assignment)
        store.backup()
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        destination = repo / "db-only"
        retention.restore_current(backup, destination)
        result = self.restored_cli(destination, "enqueue", "--session", current["sessionId"])
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(json.loads(result.stdout)["eventId"], event["eventId"])
        restored_event = destination / event_path.relative_to(repo)
        self.assertEqual(restored_event.read_bytes(), event_path.read_bytes())
        self.assertEqual((destination / registration.relative_to(repo)).read_bytes(), registration.read_bytes())
        self.assertFalse((destination / unrelated.relative_to(repo)).exists())
        # A new mutable result is a new checkpoint, not corruption of the old event.
        next_result = destination / Path(assignment["artifact"]).relative_to(repo)
        guard.write(next_result, {"works": [{"workId": "previous-work", "revision": 2}]})
        advanced = self.restored_cli(destination, "enqueue", "--session", current["sessionId"])
        self.assertEqual(advanced.returncode, 0, advanced.stdout + advanced.stderr)
        advanced_event = json.loads(advanced.stdout)
        self.assertNotEqual(advanced_event["eventId"], event["eventId"])
        self.assertEqual(restored_event.read_bytes(), event_path.read_bytes())
        restored_event = Path(advanced_event["path"])
        checkpoint = restored_event.parent / "checkpoint.json"
        checkpoint.write_bytes(b"conflicting existing cache")
        conflict = self.restored_cli(destination, "enqueue", "--session", current["sessionId"])
        self.assertNotEqual(conflict.returncode, 0)
        self.assertEqual(checkpoint.read_bytes(), b"conflicting existing cache")

    def test_db_only_cli_consumes_completed_canonical_effect_without_republishing(self):
        import catalog_retention as retention
        import test_completed_checks as completed_tests
        from catalog_revision_store import RevisionWorkspace
        fixture = completed_tests.CompletedCheckTest()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        root, store = fixture.repo, fixture.store
        review = root / "data/source" / fixture.work["annotationReviewReference"]
        review.parent.mkdir(parents=True, exist_ok=True)
        review.write_text("Original accepted adjudication evidence\n", encoding="utf-8")
        anchor = root / retention.BASE / "retained/current-test"
        retention.create_anchor(store, anchor, fixture.baseline,
                                {fixture.wid: store.current_revision("curation", fixture.wid)})
        fixture.state["latestCandidate"].update(root=os.path.relpath(anchor, fixture.root),
                                               catalogSha256=hashlib.sha256((anchor / "catalog-expanded.candidate.sqlite").read_bytes()).hexdigest(),
                                               registrySha256=hashlib.sha256((anchor / "catalog-source-registry.candidate.sqlite").read_bytes()).hexdigest())
        guard.write(fixture.root / "STATE.json", fixture.state)
        fixture.global_effect(own=True)
        session, parent = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        dispatch, summary = fixture.root / "dispatch.json", fixture.root / "notification-summary.json"
        identity = {"batchId": "completed-reception", "ownerThreadId": session, "parentThreadId": parent}
        guard.write(dispatch, {**identity, "phase": "adjudication", "expectedPublicationEffect": "canonical", "works": [{"workId": fixture.wid}]})
        guard.write(summary, {**identity, "works": [fixture.row]})
        state = root / retention.BASE / "notifications"
        guard.register_batch(session, parent, dispatch, summary, fixture.root, state, root)
        _, event = guard.enqueue(session, state)
        store.backup()
        original_state = (fixture.root / "STATE.json").read_bytes()
        destination = root / "db-only-notification"
        retention.restore_current(RevisionWorkspace(root, root / retention.BASE / "backups/latest.sqlite"), destination)
        effect = destination / "handling.json"
        guard.write(effect, {"schemaVersion": "catalog-notification-handling-v1", "eventId": event["eventId"],
                             "parentThreadId": parent, "decision": "published", "reason": "Verify the retained actual canonical effect"})
        result = self.restored_cli(destination, "consume", "--parent", parent, "--event", event["eventId"], "--effect", str(effect))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        handling = Path(destination / Path(event["checkpointPath"]).relative_to(root)).parent / "handling.json"
        coverage = json.loads(handling.read_bytes())["publicationCoverage"]
        self.assertEqual(coverage["publishedWorkIds"], [fixture.wid])
        self.assertEqual(coverage["publicationEffects"], {"candidate": "VERIFIED", "canonical": "APPLIED"})
        self.assertEqual((destination / fixture.root.relative_to(root) / "STATE.json").read_bytes(), original_state)
        repeated = self.restored_cli(destination, "consume", "--parent", parent, "--event", event["eventId"], "--effect", str(effect))
        self.assertEqual(repeated.returncode, 0, repeated.stdout + repeated.stderr)
        self.assertEqual(json.loads(repeated.stdout), json.loads(result.stdout))
        self.assertEqual((fixture.root / "STATE.json").read_bytes(), original_state)

    def test_normal_collection_requires_supplemental_bytes_in_source_and_backup(self):
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            _, _, _, summary_path, store, _, assignment, _, _ = self.collection_fixture(root)
            summary = guard.read(summary_path)
            row = summary["works"][0]
            collection = Path(row["collectionPath"])
            note = collection / "supplemental/input-0001-note.md"
            guard.write(note, {"original": "Work-bound additional material"})
            session = collection / "collection-session.json"
            guard.write(session, {"workId": row["workId"], "supplementalFiles": [{"path": note.relative_to(collection).as_posix(),
                "originalPath": str(root / "original-note.md"), "sha256": hashlib.sha256(note.read_bytes()).hexdigest(), "bytes": note.stat().st_size}]})
            factory = lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)
            with patch("catalog_workspace.Workspace", side_effect=factory):
                with self.assertRaisesRegex(ValueError, "not persisted"):
                    guard.validate_collection_batch(assignment, summary)
                store.save([session, note], "supplemental")
                with self.assertRaises(ValueError):
                    guard.validate_collection_batch(assignment, summary)
                store.backup()
                guard.validate_collection_batch(assignment, summary)
                note.write_text("changed", encoding="utf-8")
                with self.assertRaisesRegex(ValueError, "supplemental bytes changed"):
                    guard.validate_collection_batch(assignment, summary)

    def test_cli_arm_and_clear_dispatch_to_functions_instead_of_parser_objects(self):
        session = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        for command in ("arm", "clear"):
            with self.subTest(command=command), patch.object(guard.sys, "argv", ["notification_guard.py", command, "--session", session]), patch.object(guard, command) as action:
                guard.main()
                if command == "arm":
                    action.assert_called_once_with(session, resume=False)
                else:
                    action.assert_called_once_with(session)

    def collection_fixture(self, root, *, phase="collection", policy="auto-after-collection", error=False):
        """Real retained bytes; observations are synthetic and never model authority."""
        from catalog_revision_store import RevisionWorkspace
        session, parent = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        state, run = root / "notifications", root / "run"
        dispatch, summary = run / "dispatch.json", run / "summary.json"
        sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
        rows, assigned = [], []
        for index in range(2 if error else 1):
            wid = f"work-{index + 1:020x}"
            collection = run / wid
            user, research, receipt, raw = collection / "leads.json", collection / "research.jsonl", collection / "capture-example.json", collection / "capture.body"
            guard.write(user, {"testOnly": True})
            guard.write(raw, {"testOnly": "actual failure response" if index else "original source"})
            guard.write(receipt, {"url": "https://example.test/" + wid, "rawPath": raw.name, "sha256": sha(raw), "bytes": raw.stat().st_size})
            assigned.append({"workId": wid, "collectionOutput": str(collection), "userSourcesPath": str(user), "userSourcesSha256": sha(user)})
            row = {"workId": wid, "collectionPath": str(collection), "userSourcesPath": str(user), "userSourcesSha256": sha(user)}
            if index:
                failure = collection / "error.json"
                failure_value = {"workId": wid, "error": "Saved source retrieval failed", "errorScope": "work",
                                 "retryCondition": "Retry when the source returns content", "failureEvidence": [{"path": str(raw), "sha256": sha(raw)}]}
                guard.write(failure, failure_value)
                row.update(status="ERROR", errorPath=str(failure), errorSha256=sha(failure),
                           **{key: failure_value[key] for key in ("error", "errorScope", "retryCondition")})
            else:
                guard.write(research, {"workId": wid, "testOnly": True})
                row.update(status="EVIDENCE_FOUND", researchPath=str(research), researchSha256=sha(research), sourceCount=1,
                           storage={"researchSha256Matches": True}, sourceReceiptBindings=[{
                               "sourceUrl": "https://example.test/" + wid, "receiptPath": str(receipt), "receiptSha256": sha(receipt),
                               "rawPath": str(raw), "rawSha256": sha(raw), "bytes": raw.stat().st_size}])
            rows.append(row)
        identity = {"batchId": "synthetic-collection", "ownerThreadId": session, "parentThreadId": parent}
        value = {**identity, "phase": phase, "works": assigned, "adjudicationAllowed": False, "publicationAllowed": False}
        if policy is not None:
            value["transitionPolicy"] = policy
        guard.write(dispatch, value)
        guard.write(summary, {**identity, "phase": phase, "status": "COLLECTION_COMPLETE", "assignedCount": len(rows),
                              "processedCount": len(rows), "statusCounts": {"EVIDENCE_FOUND": 1, "ERROR": int(error)},
                              "adjudicationAllowed": False, "publicationAllowed": False, "works": rows,
                              "validator": {"status": "PASS", "perWorkSourceAudit": True, "allAssignedResultsPresent": True,
                                            "dispatchIdentityAndUserSourceShaVerified": True, "rawReceiptBytesAndShaVerified": True,
                                            "workspaceAndBackupReadbackVerified": True, "backupStatus": "BACKED_UP"}})
        store = RevisionWorkspace.create(root, root / "data/local/catalog-authoring/workspace.sqlite")
        store.persist([run], "collection", phase_boundary=True)
        guard.register_batch(session, parent, dispatch, summary, run, state, root)
        event = {"session_id": session, "turn_id": "execution", "hook_event_name": "Stop"}
        guard.on_prompt(event, state)
        guard.arm(session, state)
        assignment = guard.read(guard.state_path(session, state))
        target, target_summary = run / "adjudication/dispatch.json", run / "adjudication/summary.json"
        guard.write(target, {**identity, "phase": "adjudication-only", "adjudicationAllowed": True, "publicationAllowed": False,
                             "collectionSummary": {"path": str(summary), "sha256": sha(summary)},
                             "collectionErrors": [row for row in rows if row["status"] == "ERROR"],
                             "works": [{key: row[key] for key in ("workId", "researchPath", "researchSha256")}
                                       for row in rows if row["status"] != "ERROR"]})
        return session, parent, state, summary, store, event, assignment, target, target_summary

    def test_auto_transition_uses_backed_up_collection_keeps_work_errors_and_retries_without_parent(self):
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            session, parent, state, summary, store, event, assignment, target, result = self.collection_fixture(root, error=True)
            original_summary = summary.read_bytes()
            with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
                args = (session, assignment["generation"], event["turn_id"], target, result, state)
                with self.assertRaisesRegex(ValueError, "transport acknowledgement"):
                    guard.transition_collection(*args)
                self.assertFalse((target.parent / "COLLECTION-TRANSITION.json").exists())
                queued = guard.pending(parent, state)[0]
                guard.acknowledge(session, queued["checkpointSha256"], {"threadId": parent}, state, event_id=queued["eventId"])
                actual = guard.transition_collection(*args)
                self.assertEqual(actual["workCount"], 1)
                self.assertEqual(actual["collectionErrorCount"], 1)
                replacement = guard.read(guard.state_path(session, state))
                self.assertEqual(replacement["phase"], "batch")
                self.assertEqual(replacement["expectedPublicationEffect"], "canonical")
                self.assertEqual(guard.notification_identity(replacement, "checkpoint", "complete")["assignment"]["expectedPublicationEffect"], "canonical")
                self.assertEqual(len(guard.pending(parent, state)), 1)
                self.assertTrue((Path(actual["eventPath"]).parent / "transport.json").exists())
                self.assertFalse((Path(actual["eventPath"]).parent / "handling.json").exists())
                with patch.object(guard, "enqueue", side_effect=AssertionError("retry must not repeat the boundary")):
                    self.assertTrue(guard.transition_collection(*args)["reused"])
                self.assertEqual(summary.read_bytes(), original_summary)

    def test_auto_transition_cannot_downgrade_canonical_effect(self):
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            session, _, state, _, store, event, assignment, target, result = self.collection_fixture(root)
            guard.write(target, {**guard.read(target), "expectedPublicationEffect": "candidate"})
            with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
                with self.assertRaisesRegex(ValueError, "required publication effect"):
                    guard.transition_collection(session, assignment["generation"], event["turn_id"], target, result, state)
            self.assertEqual(guard.read(guard.state_path(session, state))["phase"], "collection-batch")

    def test_auto_transition_rejects_legacy_policy_shared_error_and_interrupt_during_backup(self):
        from catalog_revision_store import RevisionWorkspace
        for scenario in ("parent", "shared", "interrupt", "new-turn"):
            with self.subTest(scenario=scenario), tempfile.TemporaryDirectory() as folder:
                root = Path(folder)
                values = self.collection_fixture(root, phase="collection-only" if scenario == "parent" else "collection",
                                                 policy=None if scenario == "parent" else "auto-after-collection", error=scenario == "shared")
                session, parent, state, summary, store, event, assignment, target, result = values
                args = (session, assignment["generation"], event["turn_id"], target, result, state)
                if scenario == "shared":
                    value = guard.read(summary)
                    value["works"][1]["errorScope"] = "shared"
                    guard.write(summary, value)
                original_enqueue = guard.enqueue
                def interrupt_after_enqueue(*positional, **keywords):
                    saved = original_enqueue(*positional, **keywords)
                    if scenario == "interrupt":
                        guard.on_interrupt(event, state)
                    else:
                        guard.on_prompt({**event, "turn_id": "report-only"}, state)
                    return saved
                with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
                    if scenario in {"interrupt", "new-turn"}:
                        _, queued = guard.enqueue(session, state, phase_boundary=True)
                        guard.acknowledge(session, queued["checkpointSha256"], {"threadId": parent}, state, event_id=queued["eventId"])
                        with patch.object(guard, "enqueue", side_effect=interrupt_after_enqueue):
                            with self.assertRaisesRegex(ValueError, "stopped|changed"):
                                guard.transition_collection(*args)
                    else:
                        with self.assertRaisesRegex(ValueError, "parent|Shared"):
                            guard.transition_collection(*args)
                self.assertEqual(guard.read(guard.state_path(session, state))["phase"], "collection-batch")

    def test_registration_adapter_preserves_original_and_requires_actual_backed_up_evidence(self):
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            session, _, state, summary, store, _, _, _, _ = self.collection_fixture(root, phase="collection-only", policy=None)
            path = guard.state_path(session, state)
            value = guard.read(path)
            value["phase"] = "batch"
            guard.write(path, value)
            original = path.read_bytes()
            with self.assertRaises(KeyError):
                guard.result_identity(value)
            with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
                repaired = guard.reconcile_registration(session, hashlib.sha256(original).hexdigest(), directory=state)
            revision = guard.read(Path(repaired["revisionPath"]))
            self.assertEqual(revision["original"], value)
            self.assertEqual(revision["originalSha256"], hashlib.sha256(original).hexdigest())
            self.assertIsNone(guard.read(path)["executionTurnId"])
            with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
                resumed = guard.reconcile_registration(session, hashlib.sha256(original).hexdigest(), directory=state)
                self.assertEqual(resumed["generation"], repaired["generation"])
                self.assertEqual(resumed["backupStatus"], "BACKED_UP")
            with self.assertRaisesRegex(ValueError, "changed before"):
                guard.reconcile_registration(session, "0" * 64, directory=state)

    def test_historical_checkpoint_preserves_primary_revision_and_additive_research(self):
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            _, _, _, summary, store, _, assignment, _, _ = self.collection_fixture(root, phase="collection-only", policy=None)
            value = guard.read(summary)
            initial = value["works"][0]
            collection = Path(initial["collectionPath"])
            guard.write(collection / "collection-session.json", {"workId": initial["workId"]})
            def copy_revision(name):
                destination = collection.with_name(name)
                shutil.copytree(collection, destination)
                row = json.loads(json.dumps(initial))
                row.update(collectionPath=str(destination), researchPath=str(destination / "research.jsonl"), remainingGaps=[])
                for binding in row["sourceReceiptBindings"]:
                    for key in ("receiptPath", "rawPath"):
                        binding[key] = str(destination / Path(binding[key]).name)
                return row
            primary, followup = copy_revision("primary-v2"), copy_revision("registry-followup")
            run = summary.parent
            def checkpoint_row(row):
                return {**{key: row[key] for key in ("workId", "status", "researchSha256", "sourceCount", "remainingGaps")},
                        "researchPath": str(Path(row["researchPath"]).relative_to(run))}
            checkpoint = run / "progress.json"
            guard.write(checkpoint, {"batchId": value["batchId"], "dispatchSha256": assignment["dispatchSha256"],
                                     "works": [checkpoint_row(primary)], "registryFollowups": [checkpoint_row(followup)],
                                     "adjudicationPerformed": False, "publicationPerformed": False})
            original = run / "old-summary.json"
            sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
            guard.write(original, {**value, "dispatchSha256": assignment["dispatchSha256"], "checkpointPath": str(checkpoint),
                                   "checkpointSha256": sha(checkpoint), "materialCorrections": ["Unresolved edition kind"]})
            normalized = {**value, "sourceCollectionSummary": {"path": str(original), "sha256": sha(original)},
                          "works": [primary], "registryFollowups": [checkpoint_row(followup)], "supplementalCollections": [followup],
                          "materialCorrections": ["Unresolved edition kind"]}
            store.persist([run], "checkpoint-revisions", phase_boundary=True)
            with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
                guard.validate_collection_batch(assignment, normalized)
                with self.assertRaisesRegex(ValueError, "additive research"):
                    guard.validate_collection_batch(assignment, {**normalized, "supplementalCollections": []})
                with self.assertRaisesRegex(ValueError, "corrections changed"):
                    guard.validate_collection_batch(assignment, {**normalized, "materialCorrections": []})
                checkpoint.write_bytes(b"changed checkpoint")
                with self.assertRaisesRegex(ValueError, "checkpoint path or SHA"):
                    guard.validate_collection_batch(assignment, normalized)

    def test_web_tool_receipt_binds_exact_request_source_and_original_response(self):
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            _, _, _, summary, store, _, assignment, _, _ = self.collection_fixture(root, phase="collection-only", policy=None)
            value = guard.read(summary)
            binding = value["works"][0]["sourceReceiptBindings"][0]
            receipt, raw = Path(binding["receiptPath"]), Path(binding["rawPath"])
            raw.write_text("Observed response from " + binding["sourceUrl"], encoding="utf-8")
            capture = {"kind": "web-tool-response", "tool": "web.run", "request": {"open": [{"ref_id": binding["sourceUrl"]}]},
                       "rawPath": raw.name, "sha256": hashlib.sha256(raw.read_bytes()).hexdigest(), "bytes": raw.stat().st_size}
            guard.write(receipt, capture)
            binding.update(receiptSha256=hashlib.sha256(receipt.read_bytes()).hexdigest(), rawSha256=capture["sha256"], bytes=capture["bytes"])
            store.persist([summary.parent], "web-response", phase_boundary=True)
            with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
                guard.validate_collection_batch(assignment, value)
                guard.write(receipt, {**capture, "request": {"open": [{"ref_id": "https://example.test/other"}]}})
                binding["receiptSha256"] = hashlib.sha256(receipt.read_bytes()).hexdigest()
                with self.assertRaisesRegex(ValueError, "web response does not bind"):
                    guard.validate_collection_batch(assignment, value)

    def test_stop_only_reminds_and_missing_source_bytes_cannot_advance_collection(self):
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            session, _, state, summary, store, event, assignment, target, result = self.collection_fixture(root)
            with patch.object(guard, "enqueue", side_effect=AssertionError("hook must not run full handoff")), patch.object(
                guard, "result_identity", side_effect=AssertionError("hook must not scan batch evidence")
            ):
                self.assertIn("full validation", guard.on_stop(event, state)["reason"])
                self.assertEqual(guard.on_stop(event, state), {})
            assignment = guard.read(guard.state_path(session, state))
            row = guard.read(summary)["works"][0]
            Path(row["sourceReceiptBindings"][0]["rawPath"]).unlink()
            with patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)):
                with self.assertRaises((ValueError, FileNotFoundError)):
                    guard.transition_collection(session, assignment["generation"], event["turn_id"], target, result, state)
            self.assertEqual(guard.read(guard.state_path(session, state))["phase"], "collection-batch")

    def test_transport_consumption_and_stop_reuse_bound_validation_receipt(self):
        session, parent = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            artifact, state = root / "result.json", root / "notifications"
            guard.write(artifact, {"works": [{"workId": "work-a"}]})
            guard.register(session, parent, "work-a", "adjudication", artifact, root, state, root)
            prompt = {"session_id": session, "turn_id": "execution", "hook_event_name": "Stop"}
            guard.on_prompt(prompt, state)
            guard.arm(session, state)
            path, event = guard.enqueue(session, state)
            with patch.object(guard, "result_identity", side_effect=AssertionError("transport must not reread source evidence")):
                guard.acknowledge(session, event["checkpointSha256"], {"threadId": parent}, state, event_id=event["eventId"])
                self.assertEqual(len(guard.pending(parent, state)), 1)
                self.assertEqual(guard.on_stop(prompt, state), {})
                effect = root / "effect.json"
                guard.write(effect, {"schemaVersion": "catalog-notification-handling-v1", "eventId": event["eventId"],
                                     "parentThreadId": parent, "decision": "stage-reviewed", "reason": "Observed saved completion"})
                guard.consume(parent, event["eventId"], effect, state)
                self.assertEqual(guard.pending(parent, state), [])
            guard.write(path.parent / "validation.json", {"changed": True})
            with self.assertRaisesRegex(ValueError, "validation receipt SHA"):
                guard.verify_event(event)

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

    def test_v4_consume_requires_the_assigned_effect_in_source_and_backup(self):
        """Exercise the real completion store and consume path; no semantic model claim."""
        import catalog_authoring_batch_publish as batch
        from catalog_revision_store import RevisionWorkspace
        sha = batch.runner.panel.sha256
        session, parent = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        for required_effect in (None, "canonical"):
            with self.subTest(requiredEffect=required_effect), tempfile.TemporaryDirectory() as folder:
                root = Path(folder)
                run, notifications = root / "run", root / "notifications"
                work = run / "work-a"
                store = RevisionWorkspace.create(root, root / "data/local/catalog-authoring/workspace.sqlite")
                factory = lambda repo=None, database=None: RevisionWorkspace(root, database or store.database)
                decision, frozen, sealed = work / "decisions.json", work / "frozen/panel-input/PANEL-INPUT.sha256", work / "sealed"
                guard.write(decision, {"testOnly": True})
                guard.write(frozen, {"testOnly": True})
                guard.write(sealed / "test.json", {"testOnly": True})
                batch.runner.publisher._write_result_manifest(sealed)
                checked = work / "CHECKED.json"
                guard.write(checked, {"workId": "work-a", "status": "READY_FOR_PUBLICATION", "decisionsSha256": sha(decision),
                                      "inputManifestSha256": sha(frozen), "sealedRoot": str(sealed), "resultManifestSha256": sha(sealed / "MANIFEST.sha256")})
                guard.write(work / "RUN.json", {"decisionsPath": str(decision)})
                retained = store.persist([work], "check", phase_boundary=True)
                guard.write(work / "CHECK-STORAGE.json", {"checkedSha256": sha(checked), "storage": retained})
                identity = {"batchId": "test", "ownerThreadId": session, "parentThreadId": parent}
                summary, dispatch = run / "summary.json", run / "dispatch.json"
                guard.write(summary, {**identity, "works": [{"workId": "work-a", "status": "READY_FOR_PUBLICATION", "checkedPath": str(checked), "checkedSha256": sha(checked)}]})
                policy = {} if required_effect is None else {"expectedPublicationEffect": required_effect}
                guard.write(dispatch, {**identity, **policy, "phase": "adjudication", "works": [{"workId": "work-a"}]})
                output = root / "publication"
                receipt, readback = output / "BATCH-FINISHED.json", output / "readback.json"
                guard.write(readback, {"testOnly": True})
                guard.write(receipt, {"summarySha256": sha(summary), "readback": str(readback), "readbackSha256": sha(readback),
                                      "finalPublicationRoot": str(output), "works": [{"workId": "work-a"}]})
                applied = {"batchRoot": str(output), "receiptSha256": sha(receipt)}
                guard.write(root / "STATE.json", {"publicationBatches": {sha(summary): applied},
                                                  "latestCandidate": {"catalogSha256": "1" * 64, "registrySha256": "2" * 64}})
                with patch.object(guard, "ROOT", root), patch.object(batch.runner, "ROOT", root), patch.object(batch.runner, "REPO", root), \
                        patch.object(batch.runner, "Workspace", side_effect=factory), patch("catalog_workspace.Workspace", side_effect=factory):
                    guard.register_batch(session, parent, dispatch, summary, run, notifications, root)
                    event_path, event = guard.enqueue(session, notifications)
                    storage = batch.runner.preserve([output], "test:publication")
                    batch.complete_batch(output, receipt, storage)
                    self.assertIn("revision", guard.read(output / "BATCH-COMPLETED.json"))
                    effect = root / "handling.json"
                    guard.write(effect, {"schemaVersion": "catalog-notification-handling-v1", "eventId": event["eventId"],
                                         "parentThreadId": parent, "decision": "published", "reason": "Verify required persisted effect"})
                    if required_effect == "canonical":
                        with self.assertRaisesRegex(ValueError, "canonical publication and backup remain incomplete"):
                            guard.consume(parent, event["eventId"], effect, notifications)
                        self.assertFalse((event_path.parent / "consumed.json").exists())
                        completion = output / "canonical/completion.json"
                        guard.write(completion, {"schemaVersion": "catalog-canonical-completion-v1", "status": "APPLIED", "workIds": ["work-a"]})
                        saved = store.save([completion], "canonical-effect")
                        payload = {"status": "APPLIED", "candidateReceiptSha256": applied["receiptSha256"],
                                   "completionPath": str(completion), "completionSha256": sha(completion)}
                        store.put_revision("canonical-completion", sha(summary), payload, store.get_revision(saved)["members"])
                        with self.assertRaisesRegex(ValueError, "canonical completion source/backup head differs"):
                            guard.consume(parent, event["eventId"], effect, notifications)
                        self.assertFalse((event_path.parent / "consumed.json").exists())
                        # A backed-up status alone is not the canonical effect.
                        # Bind the real current SQL/static bytes and their build receipt.
                        import sqlite3
                        from contextlib import closing
                        from catalog_completed_checks import _STATIC_ARTIFACTS, _tree_digest
                        canonical = root / "data/source/catalog.sqlite"
                        canonical.parent.mkdir(parents=True)
                        with closing(sqlite3.connect(canonical)) as database, database:
                            database.execute("CREATE TABLE source_works(id TEXT)")
                            database.execute("INSERT INTO source_works VALUES ('work-a')")
                        canonical_output = completion.parent
                        copied_source = canonical_output / "candidate/data/source/catalog.sqlite"
                        copied_source.parent.mkdir(parents=True)
                        shutil.copyfile(canonical, copied_source)
                        version = "v1-test"
                        artifacts = [{"path": "data/source", "beforeSha256": None,
                                      "sha256": _tree_digest({"catalog.sqlite": sha(canonical)})}]
                        names = _STATIC_ARTIFACTS | {f"public/catalog/catalog-v1.{version}.json",
                                                      f"public/catalog/recommendation-context-v1.{version}.json"}
                        for name in sorted(names):
                            current_file = root / name
                            guard.write(current_file, {"catalogVersion": version, "artifact": name})
                            copied = canonical_output / "candidate" / name
                            copied.parent.mkdir(parents=True, exist_ok=True)
                            shutil.copyfile(current_file, copied)
                            artifacts.append({"path": name, "beforeSha256": None, "sha256": sha(current_file)})
                        prepared = {"schemaVersion": "catalog-canonical-publication-v1", "kind": "adjudication",
                                    "root": str(root), "output": str(canonical_output), "workIds": ["work-a"],
                                    "catalogVersion": version, "sourceManifestDigest": "test-source", "artifacts": artifacts}
                        guard.write(canonical_output / "prepared.json", prepared)
                        guard.write(completion, {"schemaVersion": "catalog-canonical-completion-v1", "status": "APPLIED",
                                                 "readback": "PASS", "preparedSha256": sha(canonical_output / "prepared.json"),
                                                 **{key: prepared[key] for key in ("workIds", "catalogVersion", "sourceManifestDigest", "artifacts")}})
                        retained = store.save([canonical_output], "test:current canonical effect")
                        store.put_revision("canonical-completion", sha(summary),
                                           {**payload, "outputRoot": str(canonical_output), "completionSha256": sha(completion)},
                                           store.get_revision(retained)["members"])
                        store.backup()
                    guard.consume(parent, event["eventId"], effect, notifications)
                    self.assertEqual(guard.pending(parent, notifications), [])
                    coverage = guard.read(event_path.parent / "handling.json")["publicationCoverage"]
                    self.assertEqual(coverage["publishedWorkIds"], ["work-a"])
                    if required_effect == "canonical":
                        self.assertEqual(coverage["publicationEffects"], {"candidate": "VERIFIED", "canonical": "APPLIED"})
                    else:
                        self.assertEqual(set(coverage), {"publishedWorkIds", "remainingReadyWorkIds"})

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
                with self.assertRaisesRegex(ValueError, "transport acknowledgement"):
                    guard.register(session, parent, "work-b", "collection", root / "next/result.json", root / "next", state, root)
                queued = guard.pending(parent, state)[0]
                guard.acknowledge(session, queued["checkpointSha256"], {"threadId": parent}, state, event_id=queued["eventId"])
                (state / "inbox" / parent / (queued["eventId"] + ".json")).unlink()
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
            source = root / "collection-summary.json"
            guard.write(source, {**value, "works": [{**row, "status": "EVIDENCE_FOUND"}]})
            with self.assertRaisesRegex(ValueError, "sourceSummary changed result rows"):
                guard.validate_batch(assignment, {**value, "sourceSummary": {
                    "path": str(source), "sha256": hashlib.sha256(source.read_bytes()).hexdigest()}})
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

    def test_partial_events_survive_report_turn_and_parent_idle_without_clearing_a_stop(self):
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
            with self.assertRaisesRegex(ValueError, "stopped"):
                guard.register(session, parent, "next-batch", "batch", root / "next.json", root, root, root)
            guard.on_prompt({**event, "turn_id": "authorized-next"}, root)
            guard.arm(session, root, resume=True)
            with self.assertRaisesRegex(ValueError, "still active"):
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

    def test_acknowledged_completion_allows_new_assignment_without_waiting_for_parent(self):
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            artifact = root / "result.json"
            guard.write(artifact, {"works": [{"workId": "work-a"}]})
            guard.register(session, parent, "work-a", "adjudication", artifact, root, root, root)
            path, queued = guard.enqueue(session, root)
            with self.assertRaisesRegex(ValueError, "transport acknowledgement"):
                guard.register(session, parent, "work-b", "collection", root / "next.jsonl", root, root, root)
            guard.acknowledge(session, queued["checkpointSha256"], {"threadId": parent}, root, event_id=queued["eventId"])
            guard.register(session, parent, "work-b", "collection", root / "next.jsonl", root, root, root)
            self.assertEqual(guard.read(guard.state_path(session, root))["workId"], "work-b")
            self.assertEqual(guard.pending(parent, root)[0]["path"], str(path))
            self.assertFalse((path.parent / "handling.json").exists())

    def test_reassignment_checks_current_transport_and_recovers_ack_before_flag_write(self):
        session, parent = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        for scenario in ("flag-only", "stale-summary", "transport-before-flag"):
            with self.subTest(scenario=scenario), tempfile.TemporaryDirectory() as folder:
                root = Path(folder)
                artifact, state = root / "result.json", root / "notifications"
                guard.write(artifact, {"works": [{"workId": "work-a"}]})
                guard.register(session, parent, "work-a", "adjudication", artifact, root, state, root)
                turn = {"session_id": session, "turn_id": "execution", "hook_event_name": "Stop"}
                guard.on_prompt(turn, state)
                guard.arm(session, state)
                _, event = guard.enqueue(session, state)
                registration = guard.state_path(session, state)
                if scenario == "flag-only":
                    guard.write(registration, {**guard.read(registration), "notifiedSha256": event["checkpointSha256"]})
                elif scenario == "stale-summary":
                    guard.acknowledge(session, event["checkpointSha256"], {"threadId": parent}, state, event_id=event["eventId"])
                    guard.write(artifact, {"works": [{"workId": "work-a", "revision": 2}]})
                    guard.enqueue(session, state)
                else:
                    original_write = guard.write
                    def fail_registration_write(path, value):
                        if path == registration:
                            raise OSError("injected crash before acknowledgement flag")
                        original_write(path, value)
                    with patch.object(guard, "write", side_effect=fail_registration_write):
                        with self.assertRaisesRegex(OSError, "acknowledgement flag"):
                            guard.acknowledge(session, event["checkpointSha256"], {"threadId": parent}, state, event_id=event["eventId"])
                    self.assertNotIn("notifiedSha256", guard.read(registration))
                if scenario == "transport-before-flag":
                    self.assertEqual(guard.on_stop(turn, state), {})
                    guard.register(session, parent, "work-b", "collection", root / "next.jsonl", root, state, root)
                    self.assertEqual(guard.read(registration)["workId"], "work-b")
                    self.assertEqual(len(guard.pending(parent, state)), 1)
                else:
                    self.assertEqual(guard.on_stop(turn, state)["decision"], "block")
                    with self.assertRaisesRegex(ValueError, "transport acknowledgement"):
                        guard.register(session, parent, "work-b", "collection", root / "next.jsonl", root, state, root)
                    self.assertEqual(guard.read(registration)["workId"], "work-a")

    def test_stop_rechecks_transport_acknowledged_while_acquiring_session_lock(self):
        from contextlib import contextmanager
        session, parent = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            artifact, state = root / "result.json", root / "notifications"
            guard.write(artifact, {"works": [{"workId": "work-a"}]})
            guard.register(session, parent, "work-a", "adjudication", artifact, root, state, root)
            turn = {"session_id": session, "turn_id": "execution", "hook_event_name": "Stop"}
            guard.on_prompt(turn, state)
            guard.arm(session, state)
            _, event = guard.enqueue(session, state)
            original_lock = guard.locked
            @contextmanager
            def acknowledge_before_lock(path):
                with patch.object(guard, "locked", original_lock):
                    guard.acknowledge(session, event["checkpointSha256"], {"threadId": parent}, state, event_id=event["eventId"])
                with original_lock(path):
                    yield
            with patch.object(guard, "locked", side_effect=acknowledge_before_lock):
                self.assertEqual(guard.on_stop(turn, state), {})
            self.assertNotIn("remindedSha256", guard.read(guard.state_path(session, state)))

    def test_restored_notification_flow_keeps_logical_identity_without_accessing_origin(self):
        """Exercise restored consumers; the current-basis restore producer has separate coverage."""
        from catalog_revision_store import RevisionWorkspace
        for scenario in ("collection", "transitioned", "stopped"):
            with self.subTest(scenario=scenario), tempfile.TemporaryDirectory() as folder:
                base = Path(folder)
                original, restored = base / "original", base / "restored"
                original.mkdir()
                session, parent, state, summary, store, turn, assignment, target, result = self.collection_fixture(original)
                args = (session, assignment["generation"], turn["turn_id"], target, result)
                with patch.object(guard, "REPO", original), patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(original, database or store.database)):
                    event_path, event = guard.enqueue(session, state, phase_boundary=True)
                    guard.acknowledge(session, event["checkpointSha256"], {"threadId": parent}, state, event_id=event["eventId"])
                    if scenario == "transitioned":
                        guard.transition_collection(*args, state)
                    elif scenario == "stopped":
                        guard.on_interrupt(turn, state)
                before = {path.relative_to(original): path.read_bytes() for path in
                          (guard.state_path(session, state), event_path, event_path.parent / "checkpoint.json", target,
                           state / "inbox" / parent / (event["eventId"] + ".json"))}
                registration_relative = guard.state_path(session, state).relative_to(original)
                # Copy exact persisted bytes to isolate path resolution from producer selection.
                shutil.copytree(original, restored)
                guard.write(restored / ".catalog-restore.json", {"schemaVersion": "catalog-restored-workspace-v1", "originalRepositories": [str(original)]})
                restored_state = restored / state.relative_to(original)
                restored_store = RevisionWorkspace(restored, restored / store.database.relative_to(original))
                original_open = Path.open
                def forbid_origin(path, *positional, **keywords):
                    if path.is_relative_to(original):
                        raise AssertionError("Restored notification accessed original repository: " + str(path))
                    return original_open(path, *positional, **keywords)
                with patch.object(guard, "REPO", restored), patch("catalog_workspace.Workspace", side_effect=lambda repo=None, database=None: RevisionWorkspace(restored, database or restored_store.database)), patch.object(Path, "open", forbid_origin):
                    self.assertEqual(guard.pending(parent, restored_state)[0]["eventId"], event["eventId"])
                    self.assertEqual(guard.on_stop(turn, restored_state), {})
                    if scenario == "collection":
                        guard.register_batch(session, parent, assignment["dispatchPath"], summary, assignment["runRoot"], restored_state, original)
                        recovered_path, recovered_event = guard.enqueue(session, restored_state, phase_boundary=True)
                        self.assertEqual(recovered_event, event)
                        self.assertTrue(recovered_path.is_relative_to(restored))
                        guard.acknowledge(session, event["checkpointSha256"], {"threadId": parent}, restored_state, event_id=event["eventId"])
                        for relative, body in before.items():
                            self.assertEqual((restored / relative).read_bytes(), body)
                        transitioned = guard.transition_collection(*args, restored_state)
                        self.assertEqual(transitioned["status"], "ADJUDICATION_READY")
                        self.assertTrue(guard.transition_collection(*args, restored_state)["reused"])
                    elif scenario == "transitioned":
                        self.assertTrue(guard.transition_collection(*args, restored_state)["reused"])
                        for relative, body in before.items():
                            self.assertEqual((restored / relative).read_bytes(), body)
                    else:
                        with self.assertRaisesRegex(ValueError, "stopped|changed"):
                            guard.transition_collection(*args, restored_state)
                        self.assertEqual((restored / registration_relative).read_bytes(), before[registration_relative])
                    handling = restored / "handling.json"
                    guard.write(handling, {"schemaVersion": "catalog-notification-handling-v1", "eventId": event["eventId"],
                                          "parentThreadId": parent, "decision": "stage-reviewed", "reason": "Verify restored immutable delivery"})
                    guard.consume(parent, event["eventId"], handling, restored_state)
                    self.assertEqual(guard.pending(parent, restored_state), [])
                for relative, body in before.items():
                    self.assertEqual((original / relative).read_bytes(), body)

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
            guard.enqueue(session, root)
            self.assertEqual(guard.on_stop(event, root), {})
            guard.write(artifact, {"works": [{"workId": "work-a", "revision": 2}]})
            self.assertEqual(guard.on_stop(event, root)["decision"], "block")
            guard.enqueue(session, root)
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

    def test_explicit_clear_allows_a_different_new_assignment(self):
        session = "01a0a48a-4149-7bb3-9eba-7835dfc56ebb"
        parent = "01a0a3b8-5162-78f0-ac39-4e17f730a70a"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            first, second = root / "first.json", root / "second.json"
            guard.write(first, {"works": [{"workId": "work-a"}]})
            guard.register(session, parent, "work-a", "adjudication", first, root, root, root)
            guard.clear(session, root)

            guard.register(session, parent, "work-b", "collection", second, root, root, root)
            current = guard.read(guard.state_path(session, root))
            self.assertEqual(current["workId"], "work-b")
            self.assertTrue(current["active"])
            self.assertNotIn("suspended", current)


if __name__ == "__main__":
    unittest.main()
