"""The cutover must resume after DB replacement without exposing writable mixed state."""
from contextlib import closing
import json
import os
from pathlib import Path
import shutil
import sqlite3
import tempfile
import unittest
import uuid
import zlib
from unittest.mock import patch

import catalog_authoring_runner as runner
import catalog_retention as retention
from catalog_authoring.catalog_completed_checks import _STATIC_ARTIFACTS, _tree_digest
from catalog_revision_store import RevisionWorkspace, SCHEMA, encoded
from catalog_workspace import Workspace, APPLICATION_ID, digest


class RetentionCutoverTest(unittest.TestCase):
    def metadata_advance_fixture(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        repo = Path(directory.name)
        store = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
        pair = repo / retention.BASE / "metadata-original"
        pair.mkdir()
        catalog = pair / "catalog-expanded.candidate.sqlite"
        with closing(sqlite3.connect(catalog)) as db, db:
            db.execute("CREATE TABLE source_works(sourceOrdinal INTEGER PRIMARY KEY,sourceLine INTEGER,id TEXT,genres TEXT,annotationReviewMethod TEXT,annotationReviewReference TEXT,recommendationEligible TEXT,libraryOnly TEXT)")
            db.execute("CREATE TABLE source_factors(sourceOrdinal INTEGER PRIMARY KEY,sourceLine INTEGER,workId TEXT,axisId TEXT,state TEXT,value TEXT,confidence TEXT,evidenceId TEXT)")
            db.execute("CREATE TABLE source_themes(sourceOrdinal INTEGER PRIMARY KEY,sourceLine INTEGER,workId TEXT,themeId TEXT,centrality TEXT,confidence TEXT,evidenceId TEXT)")
            db.execute("CREATE TABLE source_evidence(sourceOrdinal INTEGER PRIMARY KEY,sourceLine INTEGER,id TEXT,workId TEXT,sourceType TEXT,notes TEXT)")
            db.execute("CREATE TABLE source_book_metadata(sourceOrdinal INTEGER PRIMARY KEY,sourceLine INTEGER,workId TEXT,isbn TEXT,itemCaption TEXT)")
            for n, method in enumerate(("unreviewed", "human", "authorizedModelPanel"), 1):
                wid = f"work-{n}"
                db.execute("INSERT INTO source_works VALUES (?,?,?,?,?,?,?,?)", (n, n+1, wid, "action", method, "", "false", "true"))
                db.execute("INSERT INTO source_factors VALUES (?,?,?,?,?,?,?,?)", (n, n+1, wid, "strategy", "known", "2", "0.9", f"ev-{n}"))
                db.execute("INSERT INTO source_evidence VALUES (?,?,?,?,?,?)", (n, n+1, f"ev-{n}", wid, "manual", "Original evidence"))
        with closing(sqlite3.connect(pair / "catalog-source-registry.candidate.sqlite")) as db, db:
            db.execute("CREATE TABLE preserved(value TEXT)")
            db.execute("INSERT INTO preserved VALUES ('Original registry')")
        tables = runner.publisher._backend_module()._snapshot_db(catalog)
        works = {}
        for n in range(1, 4):
            wid, owned = f"work-{n}", {}
            for name, (columns, values) in tables.items():
                owner = "id" if name == "source_works" else "workId"
                if owner in columns:
                    rows = [dict(zip(columns, row)) for row in values if row[columns.index(owner)] == wid]
                    if rows:
                        owned[name] = rows
            works[wid] = store.put_revision("curation", wid, {"schemaVersion": "curation-baseline-v1", "workId": wid,
                "authorityKind": owned["source_works"][0]["annotationReviewMethod"], "tables": owned,
                "claims": [], "legacyAuthorityRequired": False, "curationApproved": n > 1})
        previous = repo / retention.BASE / "retained/metadata-original"
        # A prior publication copied bibliography into the valid pair but
        # retained this non-target Work's older curation payload.
        with closing(sqlite3.connect(catalog)) as db, db:
            db.execute("INSERT INTO source_book_metadata VALUES (1,2,'work-2','9784107721952','Preserved publisher description')")
        retention.create_anchor(store, previous, pair, works)
        canonical = repo / "data/source/catalog.sqlite"
        canonical.parent.mkdir(parents=True)
        shutil.copyfile(catalog, canonical)
        state = repo / retention.CONTINUATION / "STATE.json"
        retention.write(state, {"userStop": {"status": "STOPPED"}, "latestCandidate": {"root": str(previous)}})
        publication = repo / retention.BASE / "metadata-publication"
        shutil.copytree(pair, publication)
        runner.publisher._write_result_manifest(publication)
        frozen, sealed = repo / "frozen", repo / "sealed"
        (frozen / "panel-input").mkdir(parents=True)
        sealed.mkdir()
        return repo, store, previous, publication, works, [("work-1", repo / "run", frozen, sealed)], state

    def test_basis_advance_binds_copied_non_target_metadata_without_approving_it(self):
        for metadata_only in (False, True):
            with self.subTest(metadata_only=metadata_only):
                repo, store, previous, publication, refs, entries, state = self.metadata_advance_fixture()
                originals = {wid: store.get_revision(ref) for wid, ref in refs.items()}
                original_state = state.read_bytes()
                original_pair = digest((previous / "catalog-expanded.candidate.sqlite").read_bytes())
                with self.assertRaisesRegex(ValueError, "source_book_metadata"):
                    retention.load_basis(previous, {"work-2"})
                stale_pair = digest((previous / "catalog-expanded.candidate.sqlite").read_bytes())
                if metadata_only:
                    destination = retention.advance_metadata_basis(repo, previous, publication, {"work-1"})
                else:
                    destination = retention.advance_basis(repo, previous, publication, entries)
                retention.load_basis(destination, {"work-2"})
                anchor = store.get_revision(retention.read(destination / "CURATION-BASELINE.json")["revision"])["payload"]
                after = store.get_revision(anchor["works"]["work-2"])
                before = originals["work-2"]
                self.assertEqual(after["members"], before["members"])
                self.assertEqual({k: v for k, v in after["payload"].items() if k != "tables"},
                                 {k: v for k, v in before["payload"].items() if k != "tables"})
                self.assertEqual({k: v for k, v in after["payload"]["tables"].items() if k != "source_book_metadata"}, before["payload"]["tables"])
                self.assertEqual(after["payload"]["tables"]["source_book_metadata"][0]["itemCaption"], "Preserved publisher description")
                self.assertEqual(anchor["works"]["work-3"], refs["work-3"])
                self.assertEqual(store.get_revision(refs["work-2"]), before)
                self.assertEqual(state.read_bytes(), original_state)
                self.assertEqual(digest((previous / "catalog-expanded.candidate.sqlite").read_bytes()), stale_pair)
                self.assertEqual(original_pair, stale_pair)
                self.assertEqual(retention.read(previous / "CURATION-BASELINE.json")["revision"]["generation"], store._generation)

    def test_copied_metadata_cannot_launder_other_non_target_semantic_changes(self):
        for table, change in (("source_factors", "value='4'"), ("source_works", "genres='fantasy'"),
                              ("source_evidence", "notes='Changed authority'")):
            with self.subTest(table=table):
                repo, store, previous, publication, refs, entries, _ = self.metadata_advance_fixture()
                before = {wid: store.current_revision("curation", wid) for wid in refs}
                owner = "id" if table == "source_works" else "workId"
                with closing(sqlite3.connect(publication / "catalog-expanded.candidate.sqlite")) as db, db:
                    db.execute(f'UPDATE "{table}" SET {change} WHERE "{owner}"=?', ("work-2",))
                runner.publisher._write_result_manifest(publication)
                with self.assertRaisesRegex(ValueError, "Copied metadata cannot change non-target curation"):
                    retention.advance_basis(repo, previous, publication, entries)
                self.assertEqual(before, {wid: store.current_revision("curation", wid) for wid in refs})

    def recovery_fixture(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        repo = Path(directory.name)
        store = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
        pair = repo / retention.BASE / "pair"
        pair.mkdir()
        row = {"sourceOrdinal": 0, "id": "work-0", "annotationReviewMethod": "",
               "annotationReviewReference": "reviews/original.md"}
        for name in ("catalog-expanded.candidate.sqlite", "catalog-source-registry.candidate.sqlite"):
            with closing(sqlite3.connect(pair / name)) as db, db:
                db.execute("CREATE TABLE source_works(sourceOrdinal INTEGER PRIMARY KEY,id TEXT,annotationReviewMethod TEXT,annotationReviewReference TEXT)")
                db.execute("INSERT INTO source_works VALUES (?,?,?,?)", tuple(row.values()))
        review = pair / "data/source/reviews/original.md"
        review.parent.mkdir(parents=True)
        review.write_bytes(b"Original referenced review")
        original = b"Original stored source bytes"
        store.save_bytes({"research/original.txt": original}, "original source")
        curation = store.put_revision("curation", "work-0", {
            "schemaVersion": "curation-baseline-v1", "workId": "work-0", "authorityKind": "",
            "tables": {"source_works": [row]}, "legacyAuthorityRequired": False, "claims": []},
            {"retained/" + digest(original): digest(original)})
        basis = repo / retention.BASE / "retained/basis"
        retention.create_anchor(store, basis, pair, {"work-0": curation})
        state_path = repo / retention.CONTINUATION / "STATE.json"
        retention.write(state_path, {"authoringStore": {"schemaVersion": 4, "generation": store._generation},
            "latestCandidate": {"root": os.path.relpath(basis, state_path.parent).replace("\\", "/"),
                "catalogSha256": digest((basis / "catalog-expanded.candidate.sqlite").read_bytes()),
                "registrySha256": digest((basis / "catalog-source-registry.candidate.sqlite").read_bytes()),
                "manifestSha256": digest((basis / "MANIFEST.sha256").read_bytes())}, "publicationBatches": {}})
        completed = repo / retention.CONTINUATION / "batches/completed"
        readback = completed / "readback/READBACK.json"
        state = retention.read(state_path)
        retention.write(readback, {"status": "SQL_BUILD_COVERAGE_ENGINE_VERIFIED",
            "catalogSha256": state["latestCandidate"]["catalogSha256"],
            "registrySha256": state["latestCandidate"]["registrySha256"]})
        summary = digest(b"completed-batch")
        finished_path = completed / "BATCH-FINISHED.json"
        finished = {"status": "READBACK_VERIFIED", "summarySha256": summary,
            "finalPublicationRoot": str(basis), "readback": str(readback),
            "readbackSha256": digest(readback.read_bytes())}
        retention.write(finished_path, finished)
        applied = {"batchRoot": str(completed), "receiptSha256": digest(finished_path.read_bytes())}
        state.update(publicationBatches={summary: applied}, pendingPublicationBatch=summary)
        retention.write(state_path, state)
        proof = store.save([finished_path, readback], "publication:completion-proof")
        store.put_revision("completion", summary, {"status": "VERIFIED", "summarySha256": summary,
            "applied": applied, "finished": finished, "stateSha256": digest(state_path.read_bytes())},
            store.get_revision(proof)["members"])
        run = repo / retention.CONTINUATION / "planning/current-batch"
        collection = run / "work-0/collection"
        collection.mkdir(parents=True)
        retention.write(collection / "collection-session.json", {"workId": "work-0", "status": "STARTED"})
        (collection / "capture.body").write_bytes(b"Incomplete collection's saved raw bytes")
        store.save([collection], "unfinished collection")
        session, parent = str(uuid.uuid4()), str(uuid.uuid4())
        dispatch = run / "COLLECTION-DISPATCH.json"
        retention.write(dispatch, {"batchId": "current-batch", "ownerThreadId": session, "parentThreadId": parent,
            "phase": "collection", "works": [{"workId": "work-0", "collectionOutput": str(collection)}]})
        registration = repo / retention.BASE / "notifications" / (session + ".json")
        generation = digest(b"current stopped assignment")
        retention.write(registration, {"sessionId": session, "parentThreadId": parent, "workId": "current-batch",
            "runRoot": str(run), "artifact": str(run / "COLLECTION-SUMMARY.json"), "phase": "collection-batch",
            "dispatchPath": str(dispatch), "dispatchSha256": digest(dispatch.read_bytes()), "generation": generation,
            "active": True, "suspended": True, "executionTurnId": None, "stoppedTurnId": "stopped-turn",
            "stoppedGeneration": generation})
        historical = repo / retention.CONTINUATION / "batches/old-duplicate"
        historical.mkdir(parents=True)
        shutil.copyfile(pair / "catalog-expanded.candidate.sqlite", historical / "catalog.sqlite")
        old = store.save([historical], "historical duplicate execution copy")
        return repo, store, basis, curation, registration, collection, historical, old


    def test_backup_binds_committed_state_basis_not_newer_prepared_anchor(self):
        repo, store, basis, curation, _, _, _, _ = self.recovery_fixture()
        state_bytes = (repo / retention.CONTINUATION / "STATE.json").read_bytes()
        newer = repo / retention.BASE / "retained/uncommitted-basis"
        retention.create_anchor(store, newer, repo / retention.BASE / "pair", {"work-0": curation})
        self.assertNotEqual(store.current_revision("active", "current-curation-basis"), retention.read(basis / "CURATION-BASELINE.json")["revision"])
        store.backup()
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        controls = backup.current_revision("active", "current-recovery-controls")
        value = backup.get_revision(controls)
        self.assertEqual(value["payload"]["basisRoot"], basis.relative_to(repo).as_posix())
        self.assertEqual(value["payload"]["basis"], retention.read(basis / "CURATION-BASELINE.json")["revision"])
        state_name = retention.CONTINUATION + "/STATE.json"
        self.assertEqual(backup.stored_bytes({"snapshot": controls, "path": state_name,
            "sha256": digest(state_bytes)}), state_bytes)

    def test_database_restore_preserves_unfinished_publisher_receipts_without_expanding_them(self):
        repo, store, _, _, _, _, _, _ = self.recovery_fixture()
        batch = repo / ".workspace/private-publication"
        stage, checkpoints = batch / "compact-working", batch / "checkpoints"
        checkpoint = checkpoints / "0010/CHECKPOINT.json"
        intent = stage / "intents/0010.json"
        retention.write(checkpoint, {"schemaVersion": "catalog-compact-publication-v2", "processedCount": 10,
            "dependencies": [], "sources": {}, "works": [], "failures": [], "reviews": {}})
        retention.write(intent, {"workId": "work-0", "reviewedAt": "2026-09-27T00:00:00+00:00"})
        execution = store.put_revision("execution", "compact-publication:" + store.key(batch), {
            "schemaVersion": "authoring-transient-execution-v1", "identitySha256": digest(b"unfinished publication"),
            "disposableRoots": [store.key(stage), store.key(checkpoints)]})
        snapshot = store.persist([stage, checkpoints], "compact-publication:checkpoint",
                                 execution=execution, phase_boundary=True)["snapshot"]
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        self.assertEqual(backup.get_revision(snapshot), store.get_revision(snapshot))
        destination = repo / "unfinished-restored"
        report = retention.restore_current(backup, destination)
        self.assertEqual(report["artifactFiles"], 0)
        self.assertFalse((destination / batch.relative_to(repo)).exists())
        recovered = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
        self.assertEqual(recovered.get_revision(snapshot), backup.get_revision(snapshot))
        for path in (checkpoint, intent):
            self.assertEqual(recovered.stored_bytes({"snapshot": snapshot, "path": store.key(path),
                "sha256": digest(path.read_bytes())}), path.read_bytes())
        with closing(recovered.connect()) as db:
            self.assertEqual(db.execute("SELECT execution_id,artifact_id FROM execution_artifact WHERE execution_id=?",
                (execution["revisionId"],)).fetchall(), [(execution["revisionId"], snapshot["revisionId"])])
            self.assertEqual(db.execute("SELECT terminal FROM revision WHERE id=?", (execution["revisionId"],)).fetchone(), (0,))

    def test_database_restore_without_controls_preserves_explicit_historical_restore(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            store = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
            original = store.save_bytes({"historical/original.txt": b"Preserved historical bytes"}, "historical input")
            store.backup()
            backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
            destination = repo / "database-restore"
            report = retention.restore_current(backup, destination)
            self.assertEqual(report["status"], "DATABASE_RESTORED")
            self.assertEqual(report["artifactFiles"], 0)
            recovered = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
            self.assertIsNone(recovered.current_revision("active", "current-recovery-controls"))
            self.assertEqual(recovered.get_revision(original), backup.get_revision(original))
            self.assertEqual(recovered.stored_bytes({"snapshot": original, "path": "historical/original.txt",
                "sha256": digest(b"Preserved historical bytes")}), b"Preserved historical bytes")
            self.assertFalse((destination / "historical/original.txt").exists())
            restored = repo / "historical-restore"
            backup.restore(original["revisionId"], restored)
            self.assertEqual((restored / "historical/original.txt").read_bytes(), b"Preserved historical bytes")

    def test_backup_rejects_added_removed_or_changed_controls_during_preparation(self):
        for change in ("added", "removed", "stop-changed"):
            with self.subTest(change=change):
                repo, store, _, _, registration, _, _, _ = self.recovery_fixture()
                save = store._save_with_inventory

                def change_control(paths, label, **kwargs):
                    receipt = save(paths, label, **kwargs)
                    if label == "recovery:current-controls":
                        if change == "added":
                            extra = registration.parent / (str(uuid.uuid4()) + ".json")
                            retention.write(extra, {"active": False})
                        elif change == "removed":
                            registration.unlink()
                        else:
                            value = retention.read(registration)
                            value["suspended"] = False
                            retention.write(registration, value)
                    return receipt

                with patch.object(store, "_save_with_inventory", side_effect=change_control):
                    with self.assertRaises((OSError, ValueError)):
                        store.backup()
                self.assertIsNone(store.current_revision("active", "current-recovery-controls"))
                self.assertFalse((repo / retention.BASE / "backups/latest.sqlite").exists())

    def test_older_backup_cannot_overwrite_newer_stopped_recovery_controls(self):
        repo, store, _, _, registration, _, _, _ = self.recovery_fixture()
        initial = retention.read(registration)
        initial["suspended"] = False
        retention.write(registration, initial)
        store.backup()
        original_put = store.put_revision
        interleaved = False

        def newer_backup_before_old_commit(kind, subject, payload, *args, **kwargs):
            nonlocal interleaved
            if kind == "active" and subject == "current-recovery-controls" and not interleaved:
                interleaved = True
                stopped = retention.read(registration)
                stopped["suspended"] = True
                retention.write(registration, stopped)
                # This second store runs the ordinary backup path after the
                # older caller finished preparing but before it commits head.
                RevisionWorkspace(repo, store.database).backup()
            return original_put(kind, subject, payload, *args, **kwargs)

        with patch.object(store, "put_revision", side_effect=newer_backup_before_old_commit):
            with self.assertRaises(ValueError):
                store.backup()
        self.assertTrue(interleaved)
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        controls = backup.get_revision(backup.current_revision("active", "current-recovery-controls"))
        key = registration.relative_to(repo).as_posix()
        with closing(backup.connect()) as db:
            stopped = json.loads(backup.read_blob(db, controls["members"][key]))
        self.assertTrue(stopped["suspended"])

    def canonical_fixture(self, repo, *, pending=False):
        """Use the existing prepared/completion file layout and tree identity."""
        source = repo / "data/source"
        source.mkdir(parents=True)
        pair = repo / retention.BASE / "pair"
        shutil.copyfile(pair / "catalog-expanded.candidate.sqlite", source / "catalog.sqlite")
        shutil.copytree(pair / "data/source/reviews", source / "reviews")
        output = repo / ".workspace/canonical-publication"
        candidate = output / "candidate"
        shutil.copytree(source, candidate / "data/source")
        version = "v1-recovery-unit"
        generated = _STATIC_ARTIFACTS | {
            f"public/catalog/catalog-v1.{version}.json",
            f"public/catalog/recommendation-context-v1.{version}.json"}
        for name in sorted(generated):
            retention.write(candidate / name, {"catalogVersion": version, "artifact": name, "workIds": ["work-0"]})
        if pending:
            # A real directory-swap boundary: current source remains before,
            # while the prepared candidate has another complete tree.
            (candidate / "data/source/reviews/original.md").write_bytes(b"Prepared replacement review")
            retention.write(repo / "data/generated/catalog-v1.json", {"catalogVersion": "before"})

        def directory_members(root):
            return {path.relative_to(root).as_posix(): digest(path.read_bytes())
                    for path in root.rglob("*") if path.is_file()}

        before_source = directory_members(source)
        after_source = directory_members(candidate / "data/source")
        artifacts = [{"path": "data/source", "beforeSha256": _tree_digest(before_source), "sha256": _tree_digest(after_source)}]
        for name in sorted(generated):
            actual = repo / name
            artifacts.append({"path": name, "beforeSha256": digest(actual.read_bytes()) if actual.is_file() else None,
                              "sha256": digest((candidate / name).read_bytes())})
        prepared = {"schemaVersion": "catalog-canonical-publication-v1", "root": str(repo), "output": str(output),
            "kind": "adjudication", "requestSha256": digest(b"canonical recovery request"), "workIds": ["work-0"],
            "beforeSourceManifestDigest": digest(b"before source manifest"),
            "sourceManifestDigest": digest(b"after source manifest"), "catalogVersion": version,
            "artifacts": artifacts, "guards": []}
        retention.write(output / "prepared.json", prepared)
        return output, prepared, before_source, generated


    def test_backup_retains_legacy_completion_identity_once_without_expanding_old_provenance(self):
        repo, store, _, _, _, _, historical, _ = self.recovery_fixture()
        identity_root = repo / retention.CONTINUATION / "planning/completed-identity"
        run = identity_root / "work-0/run"
        frozen, sealed = run / "frozen/panel-input", run / "result-001"
        job = frozen / "authoring-job.json"
        retention.write(job, {"schemaVersion": "factor-authoring-job-v4", "works": [{"workId": "work-0"}]})
        provenance = frozen / "provenance/original.body"
        provenance.parent.mkdir()
        provenance.write_bytes(b"Already adjudicated provenance is not an ordinary recovery tree")
        input_manifest = frozen / "PANEL-INPUT.sha256"
        input_manifest.write_text("".join(f"{digest(path.read_bytes())}  {path.relative_to(frozen).as_posix()}\n"
            for path in (job, provenance)), encoding="ascii")
        result = sealed / "panel-result.json"
        retention.write(result, {"workId": "work-0", "status": "accepted"})
        result_manifest = sealed / "MANIFEST.sha256"
        result_manifest.write_text(f"{digest(result.read_bytes())}  panel-result.json\n", encoding="ascii")
        decisions = run / "decisions.json"
        retention.write(decisions, {"workId": "work-0", "disposition": "promote"})
        config = run / "RUN.json"
        retention.write(config, {"workId": "work-0", "createdAt": "2026-09-27T00:00:00+00:00",
            "decisionsPath": str(decisions), "decisionsSha256": digest(decisions.read_bytes()),
            "frozenDirectory": "frozen", "provenanceRoots": [str(provenance.parent)]})
        checked = run / "CHECKED.json"
        retention.write(checked, {"workId": "work-0", "status": "READY_FOR_PUBLICATION",
            "inputManifestSha256": digest(input_manifest.read_bytes()), "decisionsSha256": digest(decisions.read_bytes()),
            "sealedRoot": str(sealed), "resultManifestSha256": digest(result_manifest.read_bytes())})
        summary = identity_root / "BATCH-SUMMARY.json"
        retention.write(summary, {"works": [{"workId": "work-0", "status": "READY_FOR_PUBLICATION",
            "checkedPath": str(checked), "checkedSha256": digest(checked.read_bytes())}]})
        summary_sha = digest(summary.read_bytes())
        previous = store.get_revision(store.current_revision("completion", digest(b"completed-batch")))["payload"]
        finished_path = Path(previous["applied"]["batchRoot"]) / "BATCH-FINISHED.json"
        finished = {**previous["finished"], "summaryPath": str(summary), "summarySha256": summary_sha,
            "works": [{"workId": "work-0"}]}
        retention.write(finished_path, finished)
        applied = {**previous["applied"], "receiptSha256": digest(finished_path.read_bytes())}
        state_path = repo / retention.CONTINUATION / "STATE.json"
        state = retention.read(state_path)
        state.update(publicationBatches={summary_sha: applied}, pendingPublicationBatch=summary_sha)
        retention.write(state_path, state)
        proof = store.save([finished_path, Path(finished["readback"])], "publication:completion-proof")
        completion = store.put_revision("completion", summary_sha, {**previous, "summarySha256": summary_sha,
            "applied": applied, "finished": finished, "stateSha256": digest(state_path.read_bytes())},
            store.get_revision(proof)["members"])
        completion_bytes = store.get_revision(completion)
        paths = (summary, checked, config, decisions, input_manifest, job, result_manifest, result)
        expected = {store.key(path): digest(path.read_bytes()) for path in paths}
        for path in paths:
            self.assertIsNone(store.file_reference(path))
        store.backup()
        packet = store.current_revision("active", "completion-identity:" + summary_sha)
        self.assertIsNotNone(packet)
        self.assertEqual(store.get_revision(packet)["members"], expected)
        self.assertEqual(store.get_revision(completion), completion_bytes)
        self.assertIsNone(store.file_reference(provenance))
        identity_root.rename(repo / "unavailable-completed-identity")
        original_open, original_is_file = Path.open, Path.is_file

        def guard_open(path, *args, **kwargs):
            if path.is_relative_to(identity_root):
                raise AssertionError("Repeated backup reopened a retained completion identity")
            return original_open(path, *args, **kwargs)

        def guard_is_file(path, *args, **kwargs):
            if path.is_relative_to(identity_root):
                raise AssertionError("Repeated backup inspected a retained completion identity")
            return original_is_file(path, *args, **kwargs)

        with patch.object(Path, "open", new=guard_open), patch.object(Path, "is_file", new=guard_is_file):
            store.backup()
        self.assertEqual(store.current_revision("active", "completion-identity:" + summary_sha), packet)
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        self.assertEqual(backup.get_revision(completion), completion_bytes)
        self.assertEqual(backup.get_revision(packet)["members"], expected)
        for name, sha in expected.items():
            original = backup.stored_bytes({"snapshot": packet, "path": name, "sha256": sha})
            self.assertEqual(digest(original), sha, name)
        self.assertNotIn(store.key(provenance), backup.get_revision(packet)["members"])
        self.assertFalse(any(name.startswith(store.key(historical) + "/")
                             for name in backup.get_revision(packet)["members"]))


    def test_normal_backup_fills_only_live_ready_declared_inputs_and_reuses_the_revision(self):
        repo, store, _, _, registration, _, _, _ = self.recovery_fixture()
        assignment = retention.read(registration)
        root = Path(assignment["runRoot"])
        ready = root / "work-0/adjudication/run-v3"
        decisions = ready.parent / "decisions-v2.json"
        retention.write(decisions, {"workId": "work-0", "disposition": "promote", "notes": "Saved original decisions"})
        research = root / "work-0/registry-followup/research.jsonl"
        research.parent.mkdir(parents=True)
        research.write_bytes(b'{"workId":"work-0","notes":"Original followup research bytes"}\n')
        events = research.with_name("collection-events.jsonl")
        events.write_bytes(b'{"kind":"research-written","workId":"work-0"}\n')
        handoff = research.with_name("COLLECTION-HANDOFF.json")
        retention.write(handoff, {"schemaVersion": "factor-collection-handoff-v1", "researchSha256": digest(research.read_bytes())})
        unrelated = research.with_name("unrelated-sibling.txt")
        unrelated.write_bytes(b"Not declared by this work")
        config = ready / "RUN.json"
        retention.write(config, {"workId": "work-0", "createdAt": "2026-09-27T00:00:00+00:00",
            "decisionsPath": str(decisions), "decisionsSha256": digest(decisions.read_bytes()),
            "sourceResearchBindings": [{"path": str(research), "sha256": digest(research.read_bytes()),
                "collectionReceiptSha256": digest(events.read_bytes()), "handoffSha256": digest(handoff.read_bytes())}]})
        checked = ready / "CHECKED.json"
        retention.write(checked, {"workId": "work-0", "status": "READY_FOR_PUBLICATION",
            "decisionsSha256": digest(decisions.read_bytes())})
        failed = root / "work-0/adjudication/run-v1"
        retention.write(failed / "RUN.json", {"workId": "work-0", "createdAt": "2026-09-26T00:00:00+00:00",
            "decisionsPath": str(root / "absent-error-only-decision.json"), "decisionsSha256": digest(b"failed attempt")})
        retention.write(failed / "CHECKED.json", {"workId": "work-0", "status": "ERROR"})
        store.save([ready, failed], "adjudication:ready-and-old-error")
        original_summary = root / "COLLECTION-SUMMARY-before-adjudication.json"
        retention.write(original_summary, {"batchId": "current-batch", "phase": "collection", "works": [{"workId": "work-0"}]})
        prior_hint = root / "historic-progress-hint.json"
        prior_hint.write_bytes(b'{"status":"changed historical hint"}')
        dispatch_path = Path(assignment["dispatchPath"])
        dispatch = retention.read(dispatch_path)
        dispatch.update(collectionSummaryPath=str(original_summary), collectionSummarySha256=digest(original_summary.read_bytes()))
        dispatch["works"][0].update(priorSourcePath=str(prior_hint), priorSourceSha256=digest(b"earlier historical hint"))
        retention.write(dispatch_path, dispatch)
        assignment["dispatchSha256"] = digest(dispatch_path.read_bytes())
        retention.write(registration, assignment)
        progress = root / "ADJUDICATION-PROGRESS.json"
        retention.write(progress, {"batchId": "current-batch", "works": [{"workId": "work-0", "status": "READY_FOR_PUBLICATION",
            "checkedPath": checked.relative_to(root).as_posix(), "checkedSha256": digest(checked.read_bytes()),
            "runRoot": ready.relative_to(root).as_posix(), "decisionsPath": decisions.relative_to(root).as_posix(),
            "decisionsSha256": digest(decisions.read_bytes())}]})
        missing_paths = (decisions, research, events, handoff, original_summary)
        expected = {store.key(path): digest(path.read_bytes()) for path in missing_paths}
        for path in missing_paths:
            self.assertIsNone(store.file_reference(path))
        store.backup()
        revision = store.current_revision("active", "current-live-declared-inputs")
        retained = store.get_revision(revision)["members"]
        self.assertTrue(expected.items() <= retained.items())
        self.assertNotIn(store.key(unrelated), retained)
        self.assertNotIn(store.key(prior_hint), retained)
        for path in missing_paths:
            self.assertIsNotNone(store.file_reference(path))
        store.backup()
        self.assertEqual(store.current_revision("active", "current-live-declared-inputs"), revision)
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        self.assertEqual(backup.get_revision(revision)["members"], retained)
        for name, sha in expected.items():
            original = backup.stored_bytes({"snapshot": revision, "path": name, "sha256": sha})
            self.assertEqual(digest(original), sha, name)
        checked_reference = backup.file_reference(checked, digest(checked.read_bytes()))
        self.assertEqual(json.loads(backup.stored_bytes(checked_reference))["status"], "READY_FOR_PUBLICATION")
        self.assertFalse(any(name.startswith(store.key(failed) + "/") for name in retained))
        self.assertIsNone(backup.file_reference(unrelated))
        self.assertIsNone(backup.file_reference(prior_hint))

    def test_frozen_lineage_uses_manifest_bound_registry_instead_of_latest_saved_version(self):
        for mode in ("metadata-only", "matching-binding", "mismatched-binding", "current-run-conflict"):
            with self.subTest(mode=mode):
                repo, store, _, _, _, _, _, _ = self.recovery_fixture()
                registry = repo / retention.BASE / "pair/catalog-source-registry.candidate.sqlite"
                original_body = registry.read_bytes()
                old_sha = digest(original_body)
                store.save([registry], "registry:original-frozen-version")
                with closing(sqlite3.connect(registry)) as db, db:
                    db.execute("UPDATE source_works SET annotationReviewReference='reviews/later.md'")
                new_sha = digest(registry.read_bytes())
                self.assertNotEqual(new_sha, old_sha)
                store.save([registry], "registry:later-live-version")
                frozen = repo / retention.CONTINUATION / "planning/bound-registry/frozen/panel-input"
                metadata = frozen / "panel-input.json"
                lineage = frozen / "external-lineage.json"
                retention.write(metadata, {"registrySha256": old_sha})
                bindings = {} if mode == "metadata-only" else {
                    str(registry): new_sha if mode == "mismatched-binding" else old_sha}
                retention.write(lineage, {"registryPath": str(registry), "sourceInputBindings": bindings})
                manifest = frozen / "PANEL-INPUT.sha256"
                manifest.write_text("".join(f"{digest(path.read_bytes())}  {path.name}\n"
                    for path in (lineage, metadata)), encoding="ascii")
                store.save([frozen], "frozen:registry-identity")
                with closing(store.connect()) as db:
                    db.execute("BEGIN")
                    view = retention._RecoveryFiles(store, db)
                    if mode == "current-run-conflict":
                        view.file(registry, new_sha)
                    if mode in {"mismatched-binding", "current-run-conflict"}:
                        with self.assertRaisesRegex(ValueError, "registry binding|conflicting live versions"):
                            view.root(frozen, digest(manifest.read_bytes()))
                    else:
                        view.root(frozen, digest(manifest.read_bytes()))
                        self.assertEqual(view.members[store.key(registry)], old_sha)
                        self.assertEqual(view.file(registry, old_sha), original_body)

    def test_backup_preserves_current_research_and_history_without_promoting_old_or_planned_aliases(self):
        repo, store, _, _, registration, _, _, _ = self.recovery_fixture()
        assignment = retention.read(registration)
        root = Path(assignment["runRoot"])
        correction = root / "work-0/correction-1"
        correction.mkdir(parents=True)
        current = correction / "research.jsonl"
        current.write_bytes(b'{"workId":"work-0","notes":"Current corrected research"}\n')
        prior_copy = correction / "prior-attempt-research.jsonl"
        prior_copy.write_bytes(b'{"workId":"work-0","notes":"Preserved earlier research"}\n')
        prior_sha = digest(prior_copy.read_bytes())
        prior = store.save([prior_copy], "collection:preserved-earlier-research")
        old_alias = root / "work-0/oldcollection/research.jsonl"
        planned = root / "work-1/planned/research.jsonl"
        summary = Path(assignment["artifact"])
        retention.write(summary, {"batchId": "current-batch", "phase": "collection", "works": [
            {"workId": "work-0", "status": "EVIDENCE_FOUND", "researchPath": current.relative_to(root).as_posix(),
             "researchSha256": digest(current.read_bytes()), "preservedEarlierRevisions": [
                 {"researchPath": old_alias.relative_to(root).as_posix(), "sha256": prior_sha}]},
            {"workId": "work-1", "status": "PLANNED", "researchPath": planned.relative_to(root).as_posix()}]})
        summary_bytes, current_bytes, prior_bytes = summary.read_bytes(), current.read_bytes(), prior_copy.read_bytes()
        self.assertIsNone(store.file_reference(old_alias, prior_sha))
        self.assertFalse(planned.exists())
        store.backup()
        self.assertEqual(summary.read_bytes(), summary_bytes)
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        prior_reference = {"snapshot": prior, "path": store.key(prior_copy), "sha256": prior_sha}
        self.assertEqual(backup.stored_bytes(prior_reference), prior_bytes)
        current_reference = backup.file_reference(current, digest(current_bytes))
        summary_reference = backup.file_reference(summary, digest(summary_bytes))
        self.assertEqual(backup.stored_bytes(current_reference), current_bytes)
        self.assertEqual(backup.stored_bytes(summary_reference), summary_bytes)
        live = backup.get_revision(backup.current_revision("active", "current-live-declared-inputs"))["members"]
        self.assertEqual(live[store.key(current)], digest(current_bytes))
        self.assertNotIn(store.key(old_alias), live)
        self.assertNotIn(store.key(planned), live)
        self.assertIsNone(backup.file_reference(old_alias, prior_sha))
        self.assertIsNone(backup.file_reference(planned, digest(b"uncreated planned research")))

    def test_saved_recovery_keys_are_lexical_and_keep_namespace_boundaries(self):
        repo, store, _, _, _, _, _, _ = self.recovery_fixture()
        original = repo.parent / (repo.name + "-original")
        retention.write(repo / ".catalog-restore.json", {"schemaVersion": "catalog-restored-workspace-v1",
            "originalRepositories": [str(original)]})
        with closing(store.connect()) as db:
            files = retention._RecoveryFiles(store, db)
            self.assertEqual(files.key(original / "data/live/input.json"), "data/live/input.json")
            with patch.object(Path, "resolve", side_effect=AssertionError("Saved keys must not resolve live paths")), \
                    patch.object(Path, "is_symlink", side_effect=AssertionError("Saved keys must not stat ancestors")), \
                    patch.object(Path, "is_junction", side_effect=AssertionError("Saved keys must not stat ancestors")):
                with patch.object(retention, "artifact_path", side_effect=AssertionError("Remap each saved path once per read")):
                    for path in (repo / "data/live/input.json", original / "data/live/input.json", Path("data/live/input.json")):
                        self.assertEqual(files.key(path), "data/live/input.json")
                for path in (repo.parent / "outside.json", repo, store.database, repo / ".git/config",
                             repo / "node_modules/secret.json", repo / ".env", repo / retention.BASE / "backups/latest.sqlite"):
                    with self.assertRaises(ValueError):
                        files.key(path)

    def test_v4_upgrade_resumes_after_state_failure_and_preserves_original_revision(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            base = repo / retention.BASE
            base.mkdir(parents=True)
            source = base / "workspace.sqlite"
            generation, rid = str(uuid.uuid4()), str(uuid.uuid4())
            body = encoded({"payload": {"original": "preserved"}, "members": {}})
            sha = digest(body)
            with closing(sqlite3.connect(source)) as db, db:
                db.executescript(SCHEMA + f"PRAGMA application_id={APPLICATION_ID};PRAGMA user_version=3;")
                db.executemany("INSERT INTO store_meta VALUES (?,?)", [("generation", generation), ("policy", "curation-evidence-active-v1")])
                db.execute("INSERT INTO blob VALUES (?,?,?)", (sha, len(body), zlib.compress(body)))
                db.execute("INSERT INTO revision VALUES (?,?,?,?,?,?,?,?)", (rid, "curation", "work-original", sha, None, "2026-09-26T00:00:00Z", 0, 1))
                db.execute("INSERT INTO head VALUES (?,?,?)", ("curation", "work-original", rid))
            store = RevisionWorkspace(repo, source)
            original = store.current_revision("curation", "work-original")
            state = repo / retention.CONTINUATION / "STATE.json"
            retention.write(state, {"authoringStore": {"schemaVersion": 3, "generation": generation}})
            original_write = retention.write

            def interrupted(path, value):
                if path == state:
                    raise OSError("interrupted STATE update")
                return original_write(path, value)

            with patch.object(retention, "write", side_effect=interrupted):
                with self.assertRaisesRegex(OSError, "interrupted"):
                    retention.upgrade_store_v4(repo, enable_wal=True)
            self.assertTrue((base / "RETENTION-MAINTENANCE.json").exists())
            with self.assertRaisesRegex(ValueError, "cutover"):
                store.save_bytes({"no.txt": b"not allowed"}, "during-transition")
            result = retention.upgrade_store_v4(repo, enable_wal=True, resume=True)
            self.assertEqual(result["status"], "ACTIVATED")
            self.assertEqual(result["journalMode"], "wal")
            self.assertEqual(store.get_revision(original)["payload"], {"original": "preserved"})
            backup = RevisionWorkspace(repo, base / "backups/latest.sqlite")
            self.assertEqual(backup.get_revision(original), store.get_revision(original))
            self.assertEqual(retention.read(state)["authoringStore"]["schemaVersion"], 4)
            with closing(sqlite3.connect(base / "backups/pre-v4.sqlite")) as old:
                self.assertEqual(old.execute("PRAGMA user_version").fetchone()[0], 3)
            self.assertEqual(retention.upgrade_store_v4(repo, enable_wal=True)["storage"]["backup"]["mode"], "reused")

    def test_targeted_prior_reads_only_selected_rows_and_review(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            store = RevisionWorkspace.create(repo, repo / retention.BASE / "workspace.sqlite")
            pair = repo / retention.BASE / "pair"
            pair.mkdir()
            values = [(n, f"work-{n}", "", f"reviews/{n}.md") for n in range(40)]
            for name in ("catalog-expanded.candidate.sqlite", "catalog-source-registry.candidate.sqlite"):
                with closing(sqlite3.connect(pair / name)) as db, db:
                    db.execute("CREATE TABLE source_works(sourceOrdinal INTEGER PRIMARY KEY,id TEXT,annotationReviewMethod TEXT,annotationReviewReference TEXT)")
                    db.executemany("INSERT INTO source_works VALUES (?,?,?,?)", values)
            for _, wid, _, reference in values:
                path = pair / "data/source" / reference
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(wid, encoding="utf-8")
            row = dict(zip(("sourceOrdinal", "id", "annotationReviewMethod", "annotationReviewReference"), values[0]))
            revision = store.put_revision("curation", "work-0", {
                "schemaVersion": "curation-baseline-v1", "workId": "work-0", "authorityKind": "",
                "tables": {"source_works": [row]}, "legacyAuthorityRequired": False, "claims": []})
            anchor = repo / retention.BASE / "retained/basis"
            retention.create_anchor(store, anchor, pair, {"work-0": revision})
            metrics = {}
            retention.load_basis(anchor, {"work-0"}, metrics=metrics)
            self.assertEqual(metrics, {"rowsRead": 1, "reviewsRead": 1})
            # An unrelated row is outside this Work's prior. A full audit still
            # rejects its mutation, while the selected prior proves its own rows.
            with closing(sqlite3.connect(anchor / "catalog-expanded.candidate.sqlite")) as db, db:
                db.execute("UPDATE source_works SET annotationReviewMethod='changed' WHERE id='work-1'")
            retention.load_basis(anchor, {"work-0"})
            with self.assertRaises(ValueError):
                retention.load_basis(anchor)
            (anchor / "data/source/reviews/0.md").write_text("tampered", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "review"):
                retention.load_basis(anchor, {"work-0"})

    def test_interrupted_state_swap_resumes_and_old_writer_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            base, continuation = repo / retention.BASE, repo / retention.CONTINUATION
            pair = continuation / "initial"
            pair.mkdir(parents=True)
            for name in ("catalog-expanded.candidate.sqlite", "catalog-source-registry.candidate.sqlite"):
                with closing(sqlite3.connect(pair / name)) as db, db:
                    db.execute("CREATE TABLE preserved(value TEXT)")
                    db.execute("INSERT INTO preserved VALUES ('original')")
                    db.execute("CREATE TABLE source_works(annotationReviewReference TEXT)")
                    db.execute("INSERT INTO source_works VALUES ('reviews/test.md')")
            review = pair / "data/source/reviews/test.md"
            review.parent.mkdir(parents=True)
            review.write_bytes(b"Original referenced review")
            old = Workspace(repo)
            original = old.save([pair], "original")
            old.backup()
            state_path = continuation / "STATE.json"
            retention.write(state_path, {"latestCandidate": {"root": "initial",
                "catalogSha256": digest((pair / "catalog-expanded.candidate.sqlite").read_bytes()),
                "registrySha256": digest((pair / "catalog-source-registry.candidate.sqlite").read_bytes())}})
            original_state = state_path.read_bytes()
            new = RevisionWorkspace.create(repo, base / "workspace.next.sqlite")
            anchor = base / "retained/basis"
            retention.create_anchor(new, anchor, pair, {}, provenance={"sourceSnapshot": {
                "lastSnapshotId": original["snapshotId"], "lastSnapshotFiles": original["files"],
                "lastSnapshotManifestSha256": original["manifestSha256"]}})
            self.assertEqual((anchor / "data/source/reviews/test.md").read_bytes(), review.read_bytes())
            new.backup(base / "backups/retention-next.sqlite")
            build = {"generation": new._generation, "anchor": str(anchor),
                     "protectedFiles": {state_path.relative_to(repo).as_posix(): digest(original_state)}}
            verified = {"status": "VERIFIED_NOT_ACTIVATED", "generation": new._generation,
                        "databaseSha256": retention.file_sha(new.database),
                        "anchorManifestSha256": retention.file_sha(anchor / "MANIFEST.sha256")}
            original_write = retention.write

            def interrupted(path, value):
                if path == state_path:
                    raise OSError("simulated interruption before STATE replace")
                return original_write(path, value)

            with patch.object(runner, "REPO", repo), patch.object(runner, "ROOT", continuation):
                with patch.object(retention, "write", side_effect=interrupted):
                    with self.assertRaisesRegex(OSError, "interruption"):
                        retention.activate_store(build, verified)
                self.assertEqual(state_path.read_bytes(), original_state)
                self.assertTrue((base / "RETENTION-MAINTENANCE.json").is_file())
                with self.assertRaisesRegex(ValueError, "cutover"):
                    Workspace(repo).connect(write=True)
                result = retention.activate_store(build, verified, resume=True)
                self.assertEqual(result["status"], "ACTIVATED")
                self.assertFalse((base / "RETENTION-MAINTENANCE.json").exists())
                self.assertEqual(runner.current()[1], anchor)
                # An object loaded before the schema switch must not initialize
                # or append v2 history to the new generation.
                with self.assertRaisesRegex(ValueError, "supported"):
                    old.connect(write=True)
                self.assertEqual(json.loads(state_path.read_bytes())["authoringStore"]["generation"], new._generation)
                self.assertTrue((base / "workspace.retired-v2.sqlite").exists())


if __name__ == "__main__":
    unittest.main()
