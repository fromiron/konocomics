import copy
from contextlib import closing
import json
import io
import os
from pathlib import Path
import runpy
import shutil
import sqlite3
import tempfile
import sys
from types import SimpleNamespace
import unittest
from unittest.mock import patch
from contextlib import redirect_stdout

import catalog_authoring_runner as runner
from catalog_revision_store import RevisionWorkspace
from catalog_completed_checks import completed_checks


class CompletedCheckTest(unittest.TestCase):
    def relocated_copy(self):
        destination = tempfile.TemporaryDirectory()
        self.addCleanup(destination.cleanup)
        restored = Path(destination.name) / "restored"
        shutil.copytree(self.repo, restored)
        runner.write(restored / ".catalog-restore.json", {
            "schemaVersion": "catalog-restored-workspace-v1", "originalRepositories": [str(self.repo)]})
        return restored

    def test_restored_legacy_effect_reads_only_relocated_files(self):
        self.migrate_legacy()
        self.global_effect()
        restored = self.relocated_copy()
        original_open = Path.open
        def local_only(path, *args, **kwargs):
            if path.resolve().is_relative_to(self.repo):
                raise AssertionError("Restored proof accessed the original repository: " + str(path))
            return original_open(path, *args, **kwargs)
        restored_root = restored / self.root.relative_to(self.repo)
        with patch.object(runner, "REPO", restored), patch.object(runner, "ROOT", restored_root), \
                patch.object(Path, "open", local_only):
            proof = completed_checks([self.row], state=self.state, baseline=restored_root / "baseline",
                                     required_effect="canonical")[self.wid]
            self.assertEqual(proof["currentCanonicalEffect"]["generatedFiles"], 10)

    def test_restored_original_summary_main_rereception_preserves_bytes(self):
        import catalog_authoring_batch_publish as batch
        registry = self.baseline / "catalog-source-registry.candidate.sqlite"
        shutil.copy2(self.baseline / "catalog-expanded.candidate.sqlite", registry)
        self.state["latestCandidate"].update(root=os.path.relpath(self.baseline, self.root),
            catalogSha256=runner.panel.sha256(self.baseline / "catalog-expanded.candidate.sqlite"),
            registrySha256=runner.panel.sha256(registry))
        runner.write(self.root / "STATE.json", self.state)
        restored = self.relocated_copy()
        restored_root = restored / self.root.relative_to(self.repo)
        control_files = [restored_root / "STATE.json", restored_root / "summary.json",
                         restored_root / "planning/completed/BATCH-FINISHED.json"]
        before = {path: path.read_bytes() for path in control_files}
        original_open = Path.open
        def local_only(path, *args, **kwargs):
            if path.resolve().is_relative_to(self.repo):
                raise AssertionError("Restored CLI accessed the original repository: " + str(path))
            return original_open(path, *args, **kwargs)
        argv = ["catalog_authoring_batch_publish.py", "--batch-summary", str(self.summary),
                "--batch-root", str(self.root / "planning/rereceived"), "--apply-canonical"]
        with patch.object(runner, "REPO", restored), patch.object(runner, "ROOT", restored_root), \
                patch.object(sys, "argv", argv), patch.object(Path, "open", local_only), \
                redirect_stdout(io.StringIO()) as output:
            batch.main()
            value = json.loads(output.getvalue().splitlines()[-1])
            self.assertEqual(value["effects"]["canonical"]["status"], "APPLIED")
            self.assertEqual(value["batchRoot"], str(self.batch))  # The receipt identity stays original.
            self.assertEqual({path: path.read_bytes() for path in control_files}, before)
        self.assertFalse((self.root / "planning/rereceived").exists())

    def test_database_only_restore_then_original_summary_public_main(self):
        import catalog_authoring_batch_publish as batch
        import catalog_workspace
        from catalog_retention import create_anchor
        registry = self.baseline / "catalog-source-registry.candidate.sqlite"
        shutil.copy2(self.baseline / "catalog-expanded.candidate.sqlite", registry)
        review = self.repo / "data/source" / self.work["annotationReviewReference"]
        review.parent.mkdir(parents=True, exist_ok=True)
        review.write_text("Original accepted adjudication evidence\n", encoding="utf-8")
        anchor = self.repo / "data/local/catalog-authoring/retained/current-test"
        create_anchor(self.store, anchor, self.baseline, {self.wid: self.store.current_revision("curation", self.wid)})
        self.state["latestCandidate"].update(root=os.path.relpath(anchor, self.root),
            catalogSha256=runner.panel.sha256(anchor / "catalog-expanded.candidate.sqlite"),
            registrySha256=runner.panel.sha256(anchor / "catalog-source-registry.candidate.sqlite"))
        runner.write(self.root / "STATE.json", self.state)
        self.global_effect(own=True)
        # Only executable code is installed separately from the input backup.
        restore_script = self.repo / "scripts/catalog_workspace.py"
        restore_script.parent.mkdir()
        shutil.copy2(Path(catalog_workspace.__file__), restore_script)
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        destination = Path(temporary.name) / "restored"
        argv = [str(restore_script), "--database", str(self.repo / "data/local/catalog-authoring/backups/latest.sqlite"),
                "restore", "--destination", str(destination)]
        with patch.object(sys, "argv", argv), redirect_stdout(io.StringIO()) as restore_output:
            with self.assertRaises(SystemExit) as stopped:
                runpy.run_path(str(restore_script), run_name="__main__")
        self.assertEqual(stopped.exception.code, 0)
        self.assertEqual(json.loads(restore_output.getvalue().splitlines()[-1])["artifactFiles"], 0)
        self.assertFalse((destination / "data/local/catalog-authoring/artifacts").exists())
        self.assertFalse((destination / "data/local/catalog-authoring/backups/latest.sqlite").exists())
        before = {path.relative_to(self.repo): path.read_bytes() for path in
                  [self.root / "STATE.json", self.summary, self.batch / "BATCH-FINISHED.json",
                   *self.store.files([self.repo / "data/source", self.repo / "src/data/generated",
                                      self.repo / "data/generated", self.repo / "public/catalog"])]}
        with closing(self.store.connect()) as db:
            revisions_before = db.execute("SELECT id FROM revision ORDER BY id").fetchall()
            heads_before = db.execute("SELECT kind,subject,revision_id FROM head ORDER BY kind,subject").fetchall()
        restored_root = destination / self.root.relative_to(self.repo)
        original_open = Path.open
        def local_only(path, *args, **kwargs):
            if path.resolve().is_relative_to(self.repo):
                raise AssertionError("Restored CLI accessed the original repository: " + str(path))
            return original_open(path, *args, **kwargs)
        argv = ["catalog_authoring_batch_publish.py", "--batch-summary", str(self.summary),
                "--batch-root", str(self.root / "planning/db-rereceived"), "--apply-canonical"]
        with patch.object(runner, "REPO", destination), patch.object(runner, "ROOT", restored_root), \
                patch.object(sys, "argv", argv), patch.object(Path, "open", local_only), \
                redirect_stdout(io.StringIO()) as output:
            batch.main()
        value = json.loads(output.getvalue().splitlines()[-1])
        self.assertEqual(value["status"], "VERIFIED")
        self.assertEqual(value["effects"]["candidate"], "VERIFIED")
        self.assertEqual(value["effects"]["canonical"]["status"], "APPLIED")
        self.assertEqual(value["effects"]["canonical"]["readback"], "HISTORICAL_COMPLETION_VERIFIED")
        self.assertEqual({name: (destination / name).read_bytes() for name in before}, before)
        self.assertFalse((restored_root / "planning/db-rereceived").exists())
        for name in ("workspace.sqlite", "backups/latest.sqlite"):
            with closing(sqlite3.connect(destination / "data/local/catalog-authoring" / name)) as db:
                self.assertEqual(db.execute("SELECT id FROM revision ORDER BY id").fetchall(), revisions_before)
                self.assertEqual(db.execute("SELECT kind,subject,revision_id FROM head ORDER BY kind,subject").fetchall(), heads_before)

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name)
        self.root = self.repo / "data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902"
        self.baseline = self.root / "baseline"
        self.baseline.mkdir(parents=True)
        self.addCleanup(patch.stopall)
        patch.object(runner, "REPO", self.repo).start()
        patch.object(runner, "ROOT", self.root).start()
        self.store = RevisionWorkspace.create(self.repo, self.repo / "data/local/catalog-authoring/workspace.sqlite")
        self.wid = "work-test"
        self.run = self.root / "run"
        frozen = self.run / "frozen/panel-input"
        runner.write(frozen / "authoring-job.json", {"batchId": "test", "works": [{"workId": self.wid}]})
        self.input = frozen / "PANEL-INPUT.sha256"
        self.input.write_text(runner.panel.sha256(frozen / "authoring-job.json") + "  authoring-job.json\n", encoding="ascii")
        self.result = self.run / "result/panel-result/chunk-01/PANEL-RESULT.sha256"
        self.result.parent.mkdir(parents=True)
        self.result.write_text(runner.panel.sha256(self.input) + "  PANEL-INPUT.sha256\n", encoding="ascii")
        self.sealed = self.run / "result"
        runner.publisher._write_result_manifest(self.sealed)
        self.decision = self.run / "decisions.json"
        runner.write(self.decision, {"decision": "accepted"})
        runner.write(self.run / "RUN.json", {"decisionsPath": str(self.decision), "decisionsSha256": runner.panel.sha256(self.decision)})
        runner.write(self.run / "CHECKED.json", {"workId": self.wid, "status": "READY_FOR_PUBLICATION",
            "sealedRoot": str(self.sealed), "resultManifestSha256": runner.panel.sha256(self.sealed / "MANIFEST.sha256"),
            "inputManifestSha256": runner.panel.sha256(self.input), "decisionsSha256": runner.panel.sha256(self.decision)})
        self.row = {"workId": self.wid, "status": "READY_FOR_PUBLICATION", "checkedPath": str(self.run / "CHECKED.json"),
                    "checkedSha256": runner.panel.sha256(self.run / "CHECKED.json")}
        self.summary = self.root / "summary.json"
        runner.write(self.summary, {"works": [self.row]})
        self.summary_sha = runner.panel.sha256(self.summary)
        self.work = {"id": self.wid, "title": "old title", "genres": "drama", "factorScope": "whole_work",
            "onboardingEligible": "true", "recommendationEligible": "true", "libraryOnly": "false",
            "annotationReviewMethod": "authorizedEvidencePanel", "annotationReviewReference": "reviews/authorized-evidence-panel-v1-batch-test.md",
            "annotationReviewedAt": "2026-09-27"}
        tables = {"source_works": [self.work], "source_factors": [{"workId": self.wid, "axisId": "tone", "value": "2", "evidenceId": "ev-1"}],
                  "source_evidence": [{"workId": self.wid, "id": "ev-1", "notes": "exact source-bound evidence"},
                      {"workId": self.wid, "id": "ev-context", "notes": 'authorizedEvidencePanelV1|{"factKey":"work:recommendationContext"}'}]}
        self.payload = {"schemaVersion": "curation-baseline-v1", "workId": self.wid, "legacyAuthorityRequired": False,
            "tables": tables, "claims": [{"canonicalEvidenceId": "ev-1", "sourceInputManifestSha256": runner.panel.sha256(self.input),
                                         "sourceResultManifestSha256": runner.panel.sha256(self.result)}]}
        captured = self.store.save([self.input, self.input.parent / "authoring-job.json", self.result], "exact adjudication")
        self.members = self.store.get_revision(captured)["members"]
        self.store.put_revision("curation", self.wid, self.payload, self.members)
        for path in (self.baseline / "catalog-expanded.candidate.sqlite", self.baseline / "catalog-source-registry.candidate.sqlite",
                     self.repo / "data/source/catalog.sqlite"):
            path.parent.mkdir(parents=True, exist_ok=True)
            with closing(sqlite3.connect(path)) as db, db:
                for name, rows in tables.items():
                    columns = list(rows[0])
                    db.execute(f'CREATE TABLE "{name}" (' + ','.join('"'+column+'" TEXT' for column in columns) + ')')
                    db.executemany(f'INSERT INTO "{name}" VALUES (' + ','.join('?' for _ in columns) + ')',
                                   [tuple(row[column] for column in columns) for row in rows])
        self.batch = self.root / "planning/completed"
        self.readback = self.batch / "readback/READBACK.json"
        runner.write(self.readback, {"status": "SQL_BUILD_COVERAGE_ENGINE_VERIFIED", "targetWorkIds": [self.wid]})
        self.finished = {"status": "READBACK_VERIFIED", "summaryPath": str(self.summary), "summarySha256": self.summary_sha,
                         "readback": str(self.readback), "readbackSha256": runner.panel.sha256(self.readback), "works": [{"workId": self.wid}]}
        self.save_completion()
        from catalog_retention import retain_completed_identities
        retain_completed_identities(self.store, self.state)
        self.global_effect(own=True)

    def save_completion(self):
        receipt = self.batch / "BATCH-FINISHED.json"
        runner.write(receipt, self.finished)
        applied = {"batchRoot": str(self.batch), "receiptSha256": runner.panel.sha256(receipt)}
        saved = self.store.save([receipt, self.readback], "completion")
        self.store.put_revision("completion", self.summary_sha, {"status": "VERIFIED", "summarySha256": self.summary_sha,
            "applied": applied, "finished": self.finished}, self.store.get_revision(saved)["members"])
        self.store.put_revision("canonical-completion", self.summary_sha,
            {"status": "APPLIED", "candidateReceiptSha256": applied["receiptSha256"]}, self.store.get_revision(saved)["members"])
        self.state = {"latestCandidate": {"readback": str(self.readback), "root": os.path.relpath(self.baseline, self.root),
            "catalogSha256": runner.panel.sha256(self.baseline / "catalog-expanded.candidate.sqlite"),
            "registrySha256": runner.panel.sha256(self.baseline / "catalog-source-registry.candidate.sqlite")},
            "publicationBatches": {self.summary_sha: applied}}
        runner.write(self.root / "STATE.json", self.state)
        self.store.backup()

    def proof(self, rows=None, effect="canonical"):
        return completed_checks(rows or [self.row], state=self.state, baseline=self.baseline,
                                required_effect=effect, summary_sha=self.summary_sha)

    def test_exact_completed_check_without_retired_execution_receipt(self):
        self.assertFalse((self.run / "CHECK-STORAGE.json").exists())
        proof = self.proof()[self.wid]
        self.assertEqual(proof["status"], "ALREADY_APPLIED")
        self.assertEqual(proof["checkedSha256"], self.row["checkedSha256"])

    def test_completion_lookup_does_not_open_unrelated_corrupt_proofs(self):
        unrelated = "f" * 64
        path = self.root / "unrelated-proof.json"
        runner.write(path, {"workId": "other-work", "authority": "unrelated"})
        saved = self.store.save([path], "unrelated proof")
        members = self.store.get_revision(saved)["members"]
        receipts = [self.store.put_revision(kind, unrelated, {"unrelated": True}, members)
                    for kind in ("completion", "canonical-completion")]
        self.state["publicationBatches"][unrelated] = {"batchRoot": str(path.parent / "unrelated"), "receiptSha256": "e" * 64}
        runner.write(self.root / "STATE.json", self.state)
        self.store.backup()
        forbidden = {receipt["payloadSha256"] for receipt in receipts} | set(members.values())
        for database in (self.store.database, self.repo / "data/local/catalog-authoring/backups/latest.sqlite"):
            with closing(sqlite3.connect(database)) as db, db:
                db.executemany("UPDATE blob SET content=? WHERE sha256=?", [(b"corrupt", sha) for sha in forbidden])
        read_blob = RevisionWorkspace.read_blob
        def requested_only(source, db, sha):
            self.assertNotIn(sha, forbidden, "Unrelated completed proof was opened")
            return read_blob(db, sha)
        with patch.object(RevisionWorkspace, "read_blob", requested_only):
            proof = completed_checks([self.row], state=self.state, baseline=self.baseline, required_effect="canonical")
        self.assertEqual(proof[self.wid]["summarySha256"], self.summary_sha)

    def test_legacy_lookup_requires_explicit_summary_or_exact_membership(self):
        with closing(self.store.connect(write=True)) as db, db:
            db.execute("DELETE FROM head WHERE kind='active' AND subject=?", ("completion-identity:" + self.summary_sha,))
        self.store.backup()
        self.assertEqual(completed_checks([self.row], state=self.state, baseline=self.baseline), {})
        self.assertIn(self.wid, self.proof())

    def test_own_completion_still_requires_current_generated_bytes(self):
        path = self.repo / "src/data/generated/catalog-v1.json"
        path.write_bytes(b"{}\n")
        self.assertIn(self.wid, self.proof(effect="candidate"))
        with self.assertRaisesRegex(ValueError, "current generated artifact differs"):
            self.proof()

    def current_pointer(self):
        from catalog_completed_checks import _STATIC_ARTIFACTS
        output = self.global_effect()
        prepared_path, completion_path = output / "prepared.json", output / "completion.json"
        prepared = runner.panel.read_json(prepared_path)
        artifacts = [{**item, "path": item["path"].replace("/", "\\")} for item in prepared["artifacts"]]
        runner.write(prepared_path, {**prepared, "kind": "publisher-metadata", "artifacts": artifacts})
        completed = runner.panel.read_json(completion_path)
        runner.write(completion_path, {**completed, "artifacts": artifacts,
                                      "preparedSha256": runner.panel.sha256(prepared_path)})
        pointer = self.repo / "data/local/catalog-authoring/locks/publication.completed.json"
        runner.write(pointer, {"schemaVersion": "catalog-canonical-completion-pointer-v1",
            "preparedPath": str(prepared_path), "preparedSha256": runner.panel.sha256(prepared_path),
            "completionPath": str(completion_path), "completionSha256": runner.panel.sha256(completion_path)})
        names = _STATIC_ARTIFACTS | {f"public/catalog/catalog-v1.{prepared['catalogVersion']}.json",
                                    f"public/catalog/recommendation-context-v1.{prepared['catalogVersion']}.json"}
        current = {path.relative_to(self.repo).as_posix(): runner.panel.sha256(path)
                   for path in self.store.files([self.repo / "data/source", *(self.repo / name for name in names)])}
        unrelated = self.root / "unrelated-notification.json"
        runner.write(unrelated, {"sessionId": "other", "suspended": True})
        saved = self.store.save([pointer, prepared_path, completion_path, unrelated, *(self.repo / name for name in current)], "current effect")
        self.store.put_revision("active", "current-recovery-controls", {
            "schemaVersion": "catalog-current-recovery-controls-v1", "currentCanonical": {"members": current}},
            self.store.get_revision(saved)["members"])
        self.store.backup()
        return unrelated

    def test_current_metadata_pointer_verifies_only_required_effect_members(self):
        from catalog_completed_checks import verify_current_canonical_effect
        unrelated = self.current_pointer()
        forbidden = runner.panel.sha256(unrelated)
        read_blob = RevisionWorkspace.read_blob
        def effect_only(source, db, sha):
            self.assertNotEqual(sha, forbidden, "Unrelated notification was opened")
            return read_blob(db, sha)
        with patch.object(RevisionWorkspace, "read_blob", effect_only):
            effect = verify_current_canonical_effect(self.state)
        self.assertEqual(effect["generatedFiles"], 10)
        self.assertIsNone(effect["summarySha256"])

    def test_current_pointer_rejects_corrupt_required_backup_static(self):
        from catalog_completed_checks import verify_current_canonical_effect
        self.current_pointer()
        sha = runner.panel.sha256(self.repo / "src/data/generated/landing-v1.json")
        with closing(sqlite3.connect(self.repo / "data/local/catalog-authoring/backups/latest.sqlite")) as db, db:
            db.execute("UPDATE blob SET content=? WHERE sha256=?", (b"corrupt", sha))
        with self.assertRaises(Exception):
            verify_current_canonical_effect(self.state)

    def test_completed_proof_rejects_canonical_advance_to_new_backed_effect(self):
        import catalog_completed_checks as checks
        canonical = self.repo / "data/source/catalog.sqlite"
        original_bytes = canonical.read_bytes()
        with closing(sqlite3.connect(canonical)) as db, db:
            db.execute("UPDATE source_works SET title='next bibliography'")
        self.current_pointer()
        advanced_bytes = canonical.read_bytes()
        advanced_sha = runner.panel.sha256(canonical)
        canonical.write_bytes(original_bytes)
        state_before = (self.root / "STATE.json").read_bytes()
        curation_before = self.store.current_revision("curation", self.wid)
        verify_effect = checks.verify_current_canonical_effect
        observed = []
        def advance_then_read(state):
            # The scheduling seam changes real file bytes. The source/latest
            # reader and current effect checker both execute unchanged.
            canonical.write_bytes(advanced_bytes)
            effect = verify_effect(state)
            observed.append(effect["canonicalSha256"])
            return effect
        with patch.object(checks, "verify_current_canonical_effect", advance_then_read):
            with self.assertRaisesRegex(ValueError, "current Catalog advanced"):
                self.proof()
        self.assertEqual(observed, [advanced_sha])
        self.assertEqual((self.root / "STATE.json").read_bytes(), state_before)
        self.assertEqual(self.store.current_revision("curation", self.wid), curation_before)

    def test_completed_proof_rechecks_candidate_after_current_effect(self):
        import catalog_completed_checks as checks
        candidate = self.baseline / "catalog-expanded.candidate.sqlite"
        verify_effect = checks.verify_current_canonical_effect
        observed = []
        def read_then_advance(state):
            effect = verify_effect(state)
            with closing(sqlite3.connect(candidate)) as db, db:
                db.execute("UPDATE source_works SET title='next candidate bibliography'")
            observed.append(effect["canonicalSha256"])
            return effect
        with patch.object(checks, "verify_current_canonical_effect", read_then_advance):
            with self.assertRaisesRegex(ValueError, "current Catalog advanced"):
                self.proof()
        self.assertEqual(observed, [runner.panel.sha256(self.repo / "data/source/catalog.sqlite")])

    def test_partial_success_does_not_skip_unpublished_ready(self):
        self.finished["works"] = []
        self.save_completion()
        self.assertEqual(self.proof(), {})

    def test_same_work_different_checked_bytes_is_not_the_completion(self):
        checked = runner.panel.read_json(self.run / "CHECKED.json")
        runner.write(self.run / "CHECKED.json", {**checked, "new": True})
        row = {**self.row, "checkedSha256": runner.panel.sha256(self.run / "CHECKED.json")}
        self.assertEqual(self.proof([row]), {})

    def test_completion_source_backup_head_must_match(self):
        self.store.put_revision("curation", self.wid, {**self.payload, "new": True}, self.members)
        with self.assertRaisesRegex(ValueError, "source/backup head differs"):
            self.proof()

    def test_canonical_factor_change_is_not_hidden_by_eligibility(self):
        with closing(sqlite3.connect(self.repo / "data/source/catalog.sqlite")) as db, db:
            db.execute("UPDATE source_factors SET value='4'")
        with self.assertRaisesRegex(ValueError, "current adjudication changed"):
            self.proof()

    def test_new_bibliography_does_not_require_republication(self):
        with closing(sqlite3.connect(self.repo / "data/source/catalog.sqlite")) as db, db:
            db.execute("UPDATE source_works SET title='new title'")
            db.execute("CREATE TABLE source_book_metadata (workId TEXT, description TEXT)")
            db.execute("INSERT INTO source_book_metadata VALUES (?,?)", (self.wid, "new description"))
        self.global_effect()
        self.assertIn(self.wid, self.proof())

    def test_context_evidence_without_foreign_key_is_preserved(self):
        with closing(sqlite3.connect(self.repo / "data/source/catalog.sqlite")) as db, db:
            db.execute("UPDATE source_evidence SET notes='changed' WHERE id='ev-context'")
        with self.assertRaisesRegex(ValueError, "current adjudication changed"):
            self.proof()

    def test_partial_success_cannot_label_blocked_work_completed(self):
        self.finished["blockedWorks"] = [{"workId": self.wid}]
        self.save_completion()
        # Exercise the explicitly requested legacy summary without a new index.
        with closing(self.store.connect(write=True)) as db, db:
            db.execute("DELETE FROM head WHERE kind='active' AND subject=?", ("completion-identity:" + self.summary_sha,))
        self.store.backup()
        with self.assertRaisesRegex(ValueError, "not successfully published"):
            self.proof()

    def test_saved_summary_bytes_are_authoritative(self):
        runner.write(self.summary, {"works": [self.row], "changed": True})
        with self.assertRaisesRegex(ValueError, "source batch summary changed"):
            self.proof()

    def test_generation_mismatch_is_rejected(self):
        latest = self.repo / "data/local/catalog-authoring/backups/latest.sqlite"
        with closing(sqlite3.connect(latest)) as db, db:
            db.execute("UPDATE store_meta SET value='different-generation' WHERE key='generation'")
        with self.assertRaisesRegex(ValueError, "source/backup head differs"):
            self.proof()

    def test_corrupt_original_authority_blob_is_rejected(self):
        latest = self.repo / "data/local/catalog-authoring/backups/latest.sqlite"
        with closing(sqlite3.connect(latest)) as db, db:
            db.execute("UPDATE blob SET content=? WHERE sha256=?", (b'corrupt', runner.panel.sha256(self.input)))
        with self.assertRaises(Exception):
            self.proof()

    def test_normal_batch_all_completed_is_read_only(self):
        import catalog_authoring_batch_publish as batch
        repeated = self.root / "repeated.json"
        runner.write(repeated, {"sourceSummary": {"path": str(self.summary), "sha256": self.summary_sha}, "works": [self.row]})
        args = SimpleNamespace(batch_summary=repeated, batch_root=self.root / "planning/repeated", apply_canonical=True)
        before = {path: runner.panel.sha256(path) for path in (self.root / "STATE.json", self.store.database,
                  self.repo / "data/local/catalog-authoring/backups/latest.sqlite", self.repo / "data/source/catalog.sqlite")}
        with patch.object(runner, "current", return_value=(self.state, self.baseline)), redirect_stdout(io.StringIO()) as output:
            batch.publish(args)
        self.assertEqual(json.loads(output.getvalue().splitlines()[-1])["status"], "ALREADY_APPLIED")
        self.assertEqual(before, {path: runner.panel.sha256(path) for path in before})
        self.assertFalse(args.batch_root.exists())

    def test_mixed_batch_completed_does_not_hide_pending_storage_failure(self):
        import catalog_authoring_batch_publish as batch
        pending = self.root / "pending"
        shutil.copytree(self.run, pending)
        checked = runner.panel.read_json(pending / "CHECKED.json")
        runner.write(pending / "CHECKED.json", {**checked, "workId": "work-pending"})
        sha = runner.panel.sha256(pending / "CHECKED.json")
        runner.write(pending / "CHECK-STORAGE.json", {"checkedSha256": sha, "storage": {"snapshot": {
            "snapshotId": 999, "files": 1, "manifestSha256": "missing"}, "backup": {"status": "BACKED_UP"}}})
        rows = [self.row, {"workId": "work-pending", "status": "READY_FOR_PUBLICATION", "checkedPath": str(pending / "CHECKED.json"),
                           "checkedSha256": sha}]
        summary = self.root / "mixed.json"
        runner.write(summary, {"works": rows})
        args = SimpleNamespace(batch_summary=summary, batch_root=self.root / "planning/mixed", apply_canonical=False)
        with patch.object(runner, "current", return_value=(self.state, self.baseline)), redirect_stdout(io.StringIO()) as output:
            with self.assertRaisesRegex(ValueError, "Legacy source reference was retired"):
                batch.publish(args)
        self.assertEqual(json.loads(output.getvalue().splitlines()[0])["alreadyApplied"], self.wid)

    def test_notification_preserves_summary_counts_without_retired_snapshot(self):
        import notification_guard as guard
        dispatch = self.root / "DISPATCH.json"
        runner.write(dispatch, {"batchId": "batch", "works": [{"workId": self.wid}]})
        assignment = {"dispatchPath": str(dispatch), "dispatchSha256": runner.panel.sha256(dispatch),
                      "sessionId": "owner", "parentThreadId": "parent", "runRoot": str(self.root)}
        summary = {"batchId": "batch", "ownerThreadId": "owner", "parentThreadId": "parent",
                   "works": [self.row], "processedCount": 1, "resultCounts": {"READY_FOR_PUBLICATION": 1}}
        before = copy.deepcopy(summary)
        with patch.object(runner, "current", return_value=(self.state, self.baseline)):
            guard.validate_batch(assignment, summary)
        self.assertEqual(summary, before)

    def test_notification_coverage_uses_original_completed_proofs(self):
        import notification_guard as guard
        event_summary = self.root / "event-summary.json"
        runner.write(event_summary, {"works": [self.row], "batchId": "event"})
        value = {"kind": "complete", "assignment": {"phase": "batch", "expectedPublicationEffect": "canonical"},
                 "checkpointPath": str(event_summary), "checkpointSha256": runner.panel.sha256(event_summary)}
        with patch.object(runner, "current", return_value=(self.state, self.baseline)), patch.object(guard, "ROOT", self.root):
            coverage = guard.publication_coverage(value, {"decision": "published"})
        self.assertEqual(coverage["publishedWorkIds"], [self.wid])
        self.assertEqual(coverage["remainingReadyWorkIds"], [])
        self.assertEqual(coverage["historicalCompletedChecks"][self.wid]["summarySha256"], self.summary_sha)
        self.assertNotIn(value["checkpointSha256"], self.state["publicationBatches"])

    def test_notification_proof_does_not_accept_unrelated_summary(self):
        import notification_guard as guard
        event_summary = self.root / "event-summary.json"
        runner.write(event_summary, {"works": [self.row], "batchId": "event"})
        value = {"kind": "complete", "assignment": {"phase": "batch"}, "checkpointPath": str(event_summary),
                 "checkpointSha256": runner.panel.sha256(event_summary)}
        handling = {"decision": "published", "publications": [{"summaryPath": str(self.summary), "summarySha256": self.summary_sha}]}
        with patch.object(runner, "current", return_value=(self.state, self.baseline)), patch.object(guard, "ROOT", self.root):
            with self.assertRaisesRegex(ValueError, "does not descend from this checkpoint"):
                guard.publication_coverage(value, handling)

    def test_new_candidate_only_completion_is_not_a_canonical_effect(self):
        with closing(self.store.connect(write=True)) as db, db:
            db.execute("DELETE FROM head WHERE kind='canonical-completion'")
        self.store.backup()
        self.assertIn(self.wid, self.proof(effect="candidate"))
        with self.assertRaisesRegex(ValueError, "canonical publication and backup remain incomplete"):
            self.proof()

    def test_v4_journal_prevents_false_legacy_after_rowid_renumbering(self):
        with closing(self.store.connect(write=True)) as db, db:
            db.execute("DELETE FROM head WHERE kind='canonical-completion'")
        self.store.backup()
        for path in (self.store.database, self.repo / "data/local/catalog-authoring/backups/latest.sqlite"):
            with closing(sqlite3.connect(path)) as db, db:
                db.execute("INSERT INTO store_meta VALUES ('legacy_revision_max_rowid','999999')")
        with self.assertRaisesRegex(ValueError, "canonical publication and backup remain incomplete"):
            self.proof()

    def migrate_legacy(self):
        from catalog_revision_store import SCHEMA, APPLICATION_ID
        destination = self.repo / "legacy-v3.sqlite"
        with closing(self.store.connect()) as source, closing(sqlite3.connect(destination)) as old, old:
            old.executescript(SCHEMA + f"PRAGMA application_id={APPLICATION_ID};PRAGMA user_version=3;")
            for table in ("blob", "revision", "revision_blob", "head"):
                rows = source.execute(f'SELECT * FROM "{table}"').fetchall()
                if table == "head":
                    rows = [row for row in rows if row[0] != "canonical-completion"]
                if rows:
                    old.executemany(f'INSERT INTO "{table}" VALUES (' + ','.join('?' for _ in rows[0]) + ')', rows)
            old.execute("INSERT INTO store_meta VALUES ('generation',?)", (self.store._generation,))
        destination.replace(self.store.database)
        self.store = RevisionWorkspace(self.repo, self.store.database)
        self.store.upgrade_v4()
        # The test replaces both copies, as the real explicit v3 cutover does.
        (self.repo / "data/local/catalog-authoring/backups/latest.sqlite").unlink()
        self.store.backup()
    def test_true_v3_migration_is_candidate_only_without_global_effect(self):
        self.migrate_legacy()
        proof = self.proof(effect="candidate")[self.wid]
        self.assertTrue(proof["legacyCompletion"])
        self.assertIsNone(proof["canonicalCompletion"])
        with self.assertRaisesRegex(ValueError, "no retained build matches"):
            self.proof()

    def global_effect(self, *, missing_artifact=None, own=False):
        from catalog_completed_checks import _tree_digest, _STATIC_ARTIFACTS
        summary = self.summary if own else self.root / "global-summary.json"
        if not own:
            runner.write(summary, {"works": [self.row], "global": True})
        summary_sha = runner.panel.sha256(summary)
        batch = self.batch if own else self.root / "planning/global"
        finished = {**self.finished, "summaryPath": str(summary), "summarySha256": summary_sha}
        runner.write(batch / "BATCH-FINISHED.json", finished)
        applied = {"batchRoot": str(batch), "receiptSha256": runner.panel.sha256(batch / "BATCH-FINISHED.json")}
        saved = self.store.save([batch / "BATCH-FINISHED.json", self.readback], "global candidate")
        self.store.put_revision("completion", summary_sha, {"status": "VERIFIED", "summarySha256": summary_sha,
            "applied": applied, "finished": finished}, self.store.get_revision(saved)["members"])
        self.state["publicationBatches"][summary_sha] = applied
        runner.write(self.root / "STATE.json", self.state)
        output = batch / "canonical"
        version = "v1-test"
        names = _STATIC_ARTIFACTS | {f"public/catalog/catalog-v1.{version}.json", f"public/catalog/recommendation-context-v1.{version}.json"}
        artifacts = []
        source_members = {}
        for path in (self.repo / "data/source").rglob("*"):
            if path.is_file():
                name = path.relative_to(self.repo / "data/source").as_posix()
                source_members[name] = runner.panel.sha256(path)
                destination = output / "candidate/data/source" / name
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(path, destination)
        artifacts.append({"path": "data/source", "beforeSha256": None, "sha256": _tree_digest(source_members)})
        for name in sorted(names):
            if name == missing_artifact:
                continue
            path = self.repo / name
            runner.write(path, {"catalogVersion": version, "artifact": name})
            destination = output / "candidate" / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, destination)
            artifacts.append({"path": name, "beforeSha256": None, "sha256": runner.panel.sha256(path)})
        prepared = {"schemaVersion": "catalog-canonical-publication-v1", "kind": "adjudication", "root": str(self.repo), "output": str(output),
                    "workIds": [self.wid], "catalogVersion": version, "sourceManifestDigest": "source", "artifacts": artifacts}
        runner.write(output / "prepared.json", prepared)
        runner.write(output / "completion.json", {"schemaVersion": "catalog-canonical-completion-v1", "status": "APPLIED", "readback": "PASS",
            "preparedSha256": runner.panel.sha256(output / "prepared.json"), **{key: prepared[key] for key in ("workIds", "catalogVersion", "sourceManifestDigest", "artifacts")}})
        saved = self.store.save([output], "global effect")
        self.store.put_revision("canonical-completion", summary_sha, {"status": "APPLIED", "candidateReceiptSha256": applied["receiptSha256"],
            "outputRoot": str(output), "completionPath": str(output / "completion.json"), "completionSha256": runner.panel.sha256(output / "completion.json")},
            self.store.get_revision(saved)["members"])
        self.store.backup()
        return output

    def test_legacy_completion_requires_exact_current_global_static_effect(self):
        self.migrate_legacy()
        self.global_effect()
        proof = self.proof()[self.wid]
        self.assertTrue(proof["legacyCompletion"])
        self.assertEqual(proof["currentCanonicalEffect"]["generatedFiles"], 10)

    def test_legacy_missing_or_stale_generated_artifact_blocks_canonical_only(self):
        self.migrate_legacy()
        self.global_effect()
        path = self.repo / "src/data/generated/catalog-v1.json"
        raw = path.read_bytes()
        for content in (None, b'{}\n'):
            with self.subTest(content=content):
                if content is None:
                    path.unlink()
                else:
                    path.write_bytes(content)
                self.assertIn(self.wid, self.proof(effect="candidate"))
                with self.assertRaisesRegex(ValueError, "current generated artifact differs"):
                    self.proof()
                path.write_bytes(raw)

    def test_legacy_partial_static_receipt_cannot_claim_full_build(self):
        self.migrate_legacy()
        self.global_effect(missing_artifact="src/data/generated/landing-v1.json")
        with self.assertRaisesRegex(ValueError, "artifact membership changed"):
            self.proof()

    def test_legacy_effect_rejects_metadata_advance_after_static_readback(self):
        self.migrate_legacy()
        self.global_effect()
        canonical = self.repo / "data/source/catalog.sqlite"
        original_sha = runner.panel.sha256
        read_static = False

        def advancing_sha(path):
            nonlocal read_static
            if path == self.repo / "src/data/generated/catalog-v1.json":
                read_static = True
            if path == canonical and read_static:
                with closing(sqlite3.connect(canonical)) as db, db:
                    db.execute("UPDATE source_works SET title='concurrent bibliography'")
            return original_sha(path)

        with patch.object(runner.panel, "sha256", side_effect=advancing_sha):
            with self.assertRaisesRegex(ValueError, "artifacts advanced during effect proof"):
                self.proof()

    def test_legacy_effect_rejects_pending_publication(self):
        self.migrate_legacy()
        self.global_effect()
        runner.write(self.repo / "data/local/catalog-authoring/locks/publication.pending.json", {"recovery": "required"})
        with self.assertRaisesRegex(ValueError, "publication needs recovery"):
            self.proof()

    def test_candidate_event_can_acknowledge_without_canonical_database(self):
        import notification_guard as guard
        with closing(self.store.connect(write=True)) as db, db:
            db.execute("DELETE FROM head WHERE kind='canonical-completion'")
        self.store.backup()
        (self.repo / "data/source/catalog.sqlite").unlink()
        value = {"kind": "complete", "assignment": {"phase": "batch", "expectedPublicationEffect": "candidate"},
                 "checkpointPath": str(self.summary), "checkpointSha256": self.summary_sha}
        with patch.object(runner, "current", return_value=(self.state, self.baseline)), patch.object(guard, "ROOT", self.root):
            coverage = guard.publication_coverage(value, {"decision": "published"})
        self.assertEqual(coverage["publishedWorkIds"], [self.wid])


if __name__ == "__main__":
    unittest.main()
