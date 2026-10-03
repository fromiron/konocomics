"""DB-only recovery exercised through the existing batch command."""
from contextlib import closing, contextmanager
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

import catalog_recovery as recovery
import catalog_retention as retention
from catalog_revision_store import RevisionWorkspace
from catalog_workspace import digest
import test_catalog_retention as retention_cases


class RequestedBatchRecoveryTest(unittest.TestCase):
    def test_historical_windows_artifact_cannot_escape_restored_repository(self):
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary)
            store = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
            output = repo / ".workspace/completed"
            prepared = output / "prepared.json"
            retention.write(prepared, {"output": str(output), "kind": "metadata",
                "artifacts": [{"path": "..\\outside.json", "sha256": digest(b"outside")}]})
            completion = output / "completion.json"
            retention.write(completion, {"preparedSha256": digest(prepared.read_bytes())})
            store.save([output], "retained malformed artifact path")
            store.backup()
            destination = repo / "recovered"
            retention.restore_current(RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite"), destination)
            with self.assertRaises(ValueError):
                retention.prepare_restored_operation(destination, {"operation": "canonical", "action": "verify",
                    "outputRoot": str(output), "inputPath": str(completion)})
            self.assertFalse((repo / "outside.json").exists())
            self.assertFalse((destination / output.relative_to(repo)).exists())

    def test_metadata_pending_preserves_a_saved_source_tree_without_state(self):
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary)
            store = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
            source = repo / "data/source"
            source.mkdir(parents=True)
            with closing(sqlite3.connect(source / "catalog.sqlite")) as db:
                db.execute("CREATE TABLE fixture(value TEXT)")
                db.commit()
            (source / "README.md").write_bytes(b"Opaque source belongs to the exact captured tree")
            (source / "reviews").mkdir()
            (source / "reviews/original.md").write_bytes(b"Preserved current review")
            identity = repo / "src/data/generated/catalog-identity-v1.json"
            retention.write(identity, {"catalogVersion": "v1-test"})
            intake = repo / ".workspace/input.json"
            capture = intake.parent / "capture.body"
            capture.parent.mkdir(parents=True, exist_ok=True)
            capture.write_bytes(b"Exact publisher capture")
            receipt = intake.parent / "capture.receipt.json"
            retention.write(receipt, {"sha256": digest(capture.read_bytes()), "bytes": capture.stat().st_size})
            entry = {"receiptFile": str(receipt), "receiptSha256": digest(receipt.read_bytes()), "sourceFile": str(capture)}
            retention.write(intake, [entry])
            output = repo / ".workspace/current-intent"
            prepared = output / "prepared.json"
            retention.write(prepared, {"output": str(output), "artifacts": [{"path": "data/source", "sha256": "a" * 64}]})
            pending = repo / retention.BASE / "locks/publication.pending.json"
            retention.write(pending, {"preparedPath": str(prepared), "preparedSha256": digest(prepared.read_bytes())})
            store.save([source, identity, intake, receipt, capture, output, pending], "metadata:exact current capture without STATE")
            store.backup()
            destination = repo / "recovered"
            retention.restore_current(RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite"), destination)
            retention.prepare_restored_operation(destination, {"operation": "metadata", "inputPath": str(intake), "outputRoot": str(output)})
            for path in source.rglob("*"):
                if path.is_file():
                    self.assertEqual((destination / path.relative_to(repo)).read_bytes(), path.read_bytes())
            self.assertEqual((destination / identity.relative_to(repo)).read_bytes(), identity.read_bytes())
            for path in (intake, receipt, capture):
                self.assertEqual((destination / path.relative_to(repo)).read_bytes(), path.read_bytes())
            restored_intake = destination / intake.relative_to(repo)
            retention.write(restored_intake, [{**entry, "sourceFile": str(source / "catalog.sqlite")}])
            with self.assertRaisesRegex(ValueError, "capture escapes its input folder"):
                retention.prepare_restored_operation(destination, {"operation": "metadata", "inputPath": str(intake)})
            self.assertFalse((destination / retention.CONTINUATION / "STATE.json").exists())

    def test_historical_verification_selects_its_proof_and_pending_marker_only(self):
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary)
            store = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
            output = repo / ".workspace/completed"
            prepared = output / "prepared.json"
            candidate = output / "candidate/data/generated/catalog-v1.json"
            candidate.parent.mkdir(parents=True)
            candidate.write_bytes(b"retained historical generated bytes")
            policy = output / "policies/docs/policy.md"
            policy.parent.mkdir(parents=True)
            policy.write_bytes(b"Retained frozen policy")
            retention.write(prepared, {"output": str(output), "kind": "adjudication",
                "guards": [{"path": "docs/policy.md", "sha256": digest(policy.read_bytes())}],
                "artifacts": [{"path": "data\\generated\\catalog-v1.json", "sha256": digest(candidate.read_bytes())}]})
            completion = output / "completion.json"
            retention.write(completion, {"preparedSha256": digest(prepared.read_bytes())})
            pending = repo / retention.BASE / "locks/publication.pending.json"
            unrelated = repo / ".workspace/unrelated-pending/prepared.json"
            retention.write(unrelated, {"unrelated": "Must not be selected by historical acknowledgement"})
            retention.write(pending, {"preparedPath": str(unrelated), "preparedSha256": digest(unrelated.read_bytes())})
            store.save([output, pending, unrelated], "retained historical and unrelated current intent")
            store.backup()
            destination = repo / "recovered"
            retention.restore_current(RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite"), destination)
            request = {"operation": "canonical", "action": "verify", "outputRoot": str(output), "inputPath": str(completion)}
            retention.prepare_restored_operation(destination, request)
            for path in (prepared, completion, candidate, policy, pending):
                self.assertEqual((destination / path.relative_to(repo)).read_bytes(), path.read_bytes())
            self.assertFalse((destination / unrelated.parent.relative_to(repo)).exists())
            self.assertFalse((destination / "data/source").exists())
            self.assertFalse((destination / "data/generated").exists())
            self.assertFalse((destination / retention.BASE / "locks/publication.completed.json").exists())

            second = repo / "raced-recovery"
            retention.restore_current(RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite"), second)
            lock = recovery._materialization_lock

            @contextmanager
            def delete_before_shared_commit(root):
                with lock(root):
                    retention.record_restored_operation(root, {"status": "MATERIALIZED", "controlBase": None,
                        "generation": store._generation}, [],
                        deleted_paths=[root / pending.relative_to(repo)])
                    yield

            # Observe a real competing logical delete at the commit boundary;
            # the normal lock, SQLite write, and materializer all still execute.
            with patch.object(recovery, "_materialization_lock", delete_before_shared_commit):
                with self.assertRaisesRegex(ValueError, "explicitly deleted"):
                    retention.prepare_restored_operation(second, request)
            self.assertFalse((second / pending.relative_to(repo)).exists())

    def test_saved_pending_without_state_does_not_invent_missing_canonical_source(self):
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary)
            store = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
            output = repo / ".workspace/operation"
            prepared = output / "prepared.json"
            retention.write(prepared, {"root": str(repo), "output": str(output),
                "artifacts": [{"path": "data/source", "sha256": "a" * 64},
                              {"path": "data\\generated\\catalog-v1.json", "sha256": digest(b"sealed candidate bytes")}]})
            scratch = output / "publish/data/generated/catalog-v1.json"
            scratch.parent.mkdir(parents=True)
            scratch.write_bytes(b"Interrupted private copy")
            rollback = output / "rollback/data/source/original.txt"
            rollback.parent.mkdir(parents=True)
            rollback.write_bytes(b"Exact interrupted directory swap original")
            pending = repo / retention.BASE / "locks/publication.pending.json"
            retention.write(pending, {"preparedPath": str(prepared), "preparedSha256": digest(prepared.read_bytes())})
            store.save([pending, output], "canonical:interrupted")
            store.backup()
            destination = repo / "recovered"
            retention.restore_current(RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite"), destination)
            result = retention.prepare_restored_operation(destination, {"operation": "canonical", "action": "commit",
                "inputPath": str(prepared), "outputRoot": str(output)})
            self.assertEqual(result["status"], "MATERIALIZED")
            self.assertEqual((destination / pending.relative_to(repo)).read_bytes(), pending.read_bytes())
            self.assertEqual((destination / prepared.relative_to(repo)).read_bytes(), prepared.read_bytes())
            self.assertEqual((destination / rollback.relative_to(repo)).read_bytes(), rollback.read_bytes())
            self.assertFalse((destination / "data/source").exists())
            self.assertFalse((destination / retention.CONTINUATION / "STATE.json").exists())
            restored_scratch = destination / scratch.relative_to(repo)
            restored_scratch.write_bytes(b"sealed candidate bytes")
            # The ordinary publisher repairs scratch before its broker child
            # requests the same intent. The cache must not undo that repair.
            retention.prepare_restored_operation(destination, {"operation": "canonical", "action": "commit",
                "inputPath": str(prepared), "outputRoot": str(output)})
            self.assertEqual(restored_scratch.read_bytes(), b"sealed candidate bytes")
            restored_prepared = destination / prepared.relative_to(repo)
            restored_prepared.write_bytes(b"changed immutable prepared receipt")
            with self.assertRaisesRegex(ValueError, "immutable artifact changed"):
                retention.prepare_restored_operation(destination, {"operation": "canonical", "action": "commit",
                    "inputPath": str(prepared), "outputRoot": str(output)})

    def fixture(self):
        factory = retention_cases.RetentionCutoverTest()
        self.addCleanup(factory.doCleanups)
        repo, store, basis, _, registration, collection, unrelated, _ = factory.recovery_fixture()
        source = repo / "data/source/catalog.sqlite"
        source.parent.mkdir(parents=True)
        shutil.copy2(basis / "catalog-expanded.candidate.sqlite", source)
        summary_path = repo / retention.CONTINUATION / "planning/requested/SUMMARY.json"
        dispatch_path = summary_path.parent / "DISPATCH.json"
        retention.write(dispatch_path, {"batchId": "requested", "works": [{"workId": "work-0"}]})
        retention.write(summary_path, {"schemaVersion": "catalog-batch-summary-v2", "status": "COMPLETE",
            "batchId": "requested", "assignedCount": 1, "processedCount": 1,
            "dispatch": {"path": str(dispatch_path), "sha256": digest(dispatch_path.read_bytes())},
            "works": [{"workId": "work-0", "status": "READY_FOR_PUBLICATION",
            "checkedPath": str(unrelated / "CHECKED.json"), "checkedSha256": "0" * 64}]})
        summary_sha = digest(summary_path.read_bytes())
        finished_path = repo / retention.CONTINUATION / "planning/requested-published/BATCH-FINISHED.json"
        finished = {"status": "READBACK_VERIFIED", "summarySha256": summary_sha, "summaryPath": str(summary_path),
                    "works": [{"workId": "work-0"}]}
        retention.write(finished_path, finished)
        state_path = repo / retention.CONTINUATION / "STATE.json"
        state = retention.read(state_path)
        applied = {"batchRoot": str(finished_path.parent), "receiptSha256": digest(finished_path.read_bytes())}
        state["publicationBatches"] = {summary_sha: applied}
        state["authoringStore"]["journalMode"] = "wal"
        state.pop("pendingPublicationBatch", None)
        retention.write(state_path, state)
        saved = store.save([summary_path, dispatch_path, finished_path], "completed request")
        store.put_revision("completion", summary_sha, {"status": "VERIFIED", "summarySha256": summary_sha,
            "applied": applied, "finished": finished}, store.get_revision(saved)["members"])
        # This fixture tests an already-committed receipt, not its original
        # semantic publication. Production controls are saved as exact bytes.
        controls = store.save([state_path, source, basis / "CURATION-BASELINE.json", basis / "MANIFEST.sha256", registration], "controls")
        store.put_revision("active", "current-recovery-controls", {"schemaVersion": "catalog-current-recovery-controls-v1",
            "statePath": state_path.relative_to(repo).as_posix(), "stateSha256": digest(state_path.read_bytes()),
            "basisRoot": basis.relative_to(repo).as_posix(), "basis": retention.read(basis / "CURATION-BASELINE.json")["revision"],
            "registrations": [registration.relative_to(repo).as_posix()], "currentCanonical": {"members": {"data/source/catalog.sqlite": digest(source.read_bytes())}},
            "canonicalSha256": digest(source.read_bytes())}, store.get_revision(controls)["members"])
        store.upgrade_v4(enable_wal=True)
        # An explicit non-default store backup avoids replacing the intentionally
        # small committed fixture controls with a filesystem-discovery operation.
        backup = repo / retention.BASE / "backups/latest.sqlite"
        backup.parent.mkdir()
        with closing(store.connect()) as source_db, closing(sqlite3.connect(backup)) as target:
            source_db.backup(target)
            target.execute("PRAGMA journal_mode=DELETE")
        destination = repo / "restored"
        report = retention.restore_current(RevisionWorkspace(repo, backup), destination)
        self.assertEqual(report["artifactFiles"], 0)
        self.assertFalse((destination / "data/source").exists())
        with closing(sqlite3.connect(destination / retention.BASE / "workspace.sqlite")) as db:
            self.assertEqual(db.execute("PRAGMA journal_mode").fetchone()[0], "delete")
        scripts = Path(__file__).resolve().parent
        shutil.copytree(scripts, destination / "scripts", ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
        shutil.copy2(scripts.parent / "package.json", destination / "package.json")
        # The approved embedded interpreter uses its _pth; point an exact copy
        # at this private checkout rather than importing the operating checkout.
        runtime = repo / "private-runtime"
        shutil.copytree(Path(sys.executable).parent, runtime, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
        pth = next(iter(runtime.glob("python*._pth")), None)
        if pth is not None:
            pth.write_text(f"{pth.stem}.zip\n.\n{destination / 'scripts'}\n{destination / 'scripts/catalog_authoring'}\nimport site\n", encoding="utf-8")
        executable = runtime / Path(sys.executable).name
        command = [str(executable), "-B", str(destination / "scripts/catalog_authoring_batch_publish.py"),
                   "--batch-summary", str(summary_path), "--batch-root", str(finished_path.parent)]
        return repo, store, destination, command, state_path, basis, registration, collection, unrelated

    def test_native_completed_batch_prepares_only_requested_proof_and_reuses_initial_backup(self):
        repo, store, destination, command, state_path, basis, registration, collection, unrelated = self.fixture()
        with closing(store.connect()) as db:
            original_heads = db.execute("SELECT * FROM head ORDER BY kind,subject").fetchall()
        result = subprocess.run(command, cwd=destination, capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn('"status": "ALREADY_APPLIED"', result.stdout)
        self.assertEqual((destination / state_path.relative_to(repo)).read_bytes(), state_path.read_bytes())
        dispatch = Path(command[command.index("--batch-summary") + 1]).parent / "DISPATCH.json"
        self.assertEqual((destination / dispatch.relative_to(repo)).read_bytes(), dispatch.read_bytes())
        self.assertTrue((destination / basis.relative_to(repo) / "catalog-expanded.candidate.sqlite").is_file())
        self.assertFalse((destination / basis.relative_to(repo) / "data/source/reviews").exists())
        for path in (registration, collection, unrelated):
            self.assertFalse((destination / path.relative_to(repo)).exists())
        latest = destination / retention.BASE / "backups/latest.sqlite"
        self.assertTrue(latest.is_file())
        with closing(sqlite3.connect(latest.as_uri() + "?mode=ro", uri=True)) as db:
            self.assertEqual(original_heads, db.execute("SELECT * FROM head ORDER BY kind,subject").fetchall())
            self.assertEqual(db.execute("PRAGMA journal_mode").fetchone()[0], "delete")
        with closing(sqlite3.connect((destination / retention.BASE / "workspace.sqlite").as_uri() + "?mode=ro", uri=True)) as db:
            self.assertEqual(db.execute("PRAGMA journal_mode").fetchone()[0], "wal")
            self.assertEqual(db.execute("PRAGMA synchronous").fetchone()[0], 2)
        source = destination / "data/source/catalog.sqlite"
        source.write_bytes(b"Existing changed bytes must not be overwritten")
        failed = subprocess.run(command, cwd=destination, capture_output=True, text=True, encoding="utf-8")
        self.assertNotEqual(failed.returncode, 0)
        self.assertIn("overwrite different bytes", failed.stderr)
        self.assertEqual(source.read_bytes(), b"Existing changed bytes must not be overwritten")


if __name__ == "__main__":
    unittest.main()
