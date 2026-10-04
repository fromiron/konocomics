"""The compact writer must leave both databases under the caller's transaction."""
from contextlib import closing, ExitStack
from pathlib import Path
import shutil
import sqlite3
import tempfile
import unittest
from unittest.mock import patch, Mock

from authoring_paths import REPO
import compact_publication as compact
import correct_factor_registry as correction
import publish_factor_batch as publisher


class CompactTransactionTest(unittest.TestCase):

    def _protected_wrapper_fixture(self, kind="axis", state="known"):
        import copy
        panel = publisher.panel_validation
        wid, name = "work-" + "a" * 20, "progression" if kind == "axis" else "school"
        claim = {field: "" for field in panel.LEDGER_FIELDS}
        claim.update(workId=wid, factKey=f"{kind}:{name}", state="known", value="2", confidence="0.8",
            evidenceIds="ev-original", citationUrls="https://example.org/original", entryScope="entry_1_volume",
            observation="Exact original observation", limitation="One volume", decision="accepted", reasonCode="SUPPORTED",
            authorityKind="authorizedEvidencePanelV1", authorityArtifactDigest="b" * 64,
            citationSetDigest=panel.citation_digest(["https://example.org/original"]), reviewedByHuman="false", candidateOnly="true")
        backend = publisher._backend_module()
        evidence_id = backend._claim_evidence_id(claim)
        source = backend._evidence_row(evidence_id, {"sourceType": "model", "sourceUrl": claim["citationUrls"],
            "fetchedAt": "2026-10-04T00:00:00Z"}, panel_row=claim)
        raw = {"id": "ev-original", "workId": wid, "sourceUrl": claim["citationUrls"]}
        authority = {"claims": {(wid, claim["factKey"]): {panel.claim_semantic_digest(claim): claim}}, "evidence": {"ev-original": raw}}
        if state == "unknown":
            authority["claims"] = {}
        factors = [{"workId": wid, "axisId": axis, "state": "unknown", "value": "", "confidence": "", "evidenceId": "ev-raw"} for axis in publisher.AXES]
        themes = []
        if kind == "axis":
            row = next(row for row in factors if row["axisId"] == name)
            row.update(state=state, value="2" if state == "known" else "", confidence="0.8" if state == "known" else "", evidenceId=evidence_id)
        else:
            themes = [{"workId": wid, "themeId": name, "centrality": "2", "confidence": "0.8", "evidenceId": evidence_id}]
        snapshot = {"sha256": "c" * 64, "tables": {"source_works": [{"id": wid, "annotationReviewMethod": "unreviewed",
            "onboardingEligible": "false", "recommendationEligible": "false", "libraryOnly": "true", "genres": ""}],
            "source_factors": factors, "source_themes": themes, "source_evidence": [source, {"id": "ev-raw", "sourceType": "model", "reviewedByHuman": "false"}]}}
        def invoke(result=None):
            prior = {field: claim.get(field, "") for field in panel.PRIOR_FIELDS}
            prior["factType"] = kind
            self.assertEqual(panel.claim_semantic_digest(prior), panel.claim_semantic_digest(claim))
            with tempfile.TemporaryDirectory() as directory, ExitStack() as stack:
                root = Path(directory); inp, output = root / "input", root / "output"
                (inp / "chunks/chunk-01").mkdir(parents=True); (output / "chunk-01").mkdir(parents=True)
                for file in (inp / "chunks/chunk-01/prior-panel-claims.csv", output / "chunk-01/promotion-ledger.csv", output / "chunk-01/evidence-panel-ledger.csv"):
                    file.touch()
                stack.enter_context(patch.object(publisher, "_read_json", return_value={"workIds": []}))
                stack.enter_context(patch.object(publisher, "_target_semantic_snapshot", side_effect=lambda *args: copy.deepcopy(snapshot)))
                stack.enter_context(patch.object(panel, "load_prior_decisions", return_value={}))
                stack.enter_context(patch.object(publisher, "read_csv", side_effect=lambda path, fields:
                    [{"workId": wid, "panelOutcome": "PASS"}] if path.name == "promotion-ledger.csv" else
                    ([prior] if state == "known" else []) if path.name == "prior-panel-claims.csv" else [result or claim]))
                return publisher._validate_fresh_unreviewed_snapshots(inp, output, root / "frozen.sqlite", root / "current.sqlite", authority)
        return claim, source, snapshot, invoke

    def test_exact_original_known_wrapper_is_preserved(self):
        claim, _, _, invoke = self._protected_wrapper_fixture()
        result = invoke()[claim["workId"]]
        self.assertEqual(result["preservedAxes"], ["progression"])

    def test_protected_wrapper_rejects_altered_original_or_source(self):
        for field in ("observation", "sourceUrl", "reviewedByHuman"):
            with self.subTest(field=field):
                claim, source, _, invoke = self._protected_wrapper_fixture()
                if field == "observation":
                    claim[field] = "Changed original observation"
                else:
                    source[field] = "https://example.org/other" if field == "sourceUrl" else "true"
                with self.assertRaises(publisher.ValidationError):
                    invoke()

    def test_exact_original_known_theme_wrapper_is_preserved(self):
        claim, _, _, invoke = self._protected_wrapper_fixture("theme")
        self.assertEqual(invoke()[claim["workId"]]["preservedThemes"], ["school"])

    def test_protected_unknown_may_be_preserved_but_not_made_known(self):
        claim, source, _, invoke = self._protected_wrapper_fixture(state="unknown")
        with self.assertRaisesRegex(publisher.ValidationError, "cannot override protected unknown"):
            invoke()
        unknown = {**claim, "state": "unknown", "value": "", "confidence": "", "decision": "explicitUnknown"}
        result = invoke(unknown)[claim["workId"]]
        self.assertEqual(result["beforeFactors"]["progression"]["evidenceId"], source["id"])
        self.assertEqual(result["preservedAxes"], [])

    def test_later_frozen_batch_subset_plans_a_new_review_reference(self):
        import factor_single_pass as single
        import canonical_rebase
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            frozen, sealed = root / "input", root / "sealed"
            result = sealed / "panel-result"
            (result / "chunk-01").mkdir(parents=True)
            frozen.mkdir()
            for p in (frozen / "PANEL-INPUT.sha256", result / "chunk-01/PANEL-INPUT.sha256"):
                p.write_bytes(b"same immutable frozen manifest")
            wid = "work-" + "1" * 20
            old_ref = "reviews/authorized-evidence-panel-v1-batch-r-" + "2" * 32 + ".md"
            backend = Mock()
            backend.verify_immutable.return_value = {"targetIds": {wid}, "panelInput": {"batchId": "r-" + "2" * 32},
                                                     "inputManifestSha256": "3" * 64}
            backend._review_references.return_value = {old_ref}
            backend.plan_against_current.return_value = ({}, {}, {})
            registry = {"tables": {"registry_meta": {"rows": []},
                "registry_source_rows": {"columns": [], "rows": []}}}
            with ExitStack() as stack:
                stack.enter_context(patch.object(compact, "resolve_reference", side_effect=lambda p: Path(p)))
                stack.enter_context(patch.object(compact, "artifact_path", side_effect=lambda p: Path(p)))
                stack.enter_context(patch.object(publisher, "_read_json", side_effect=lambda p:
                    {"baselineRoot": str(root), "registryPath": str(root / "registry.sqlite")}
                    if p.name == "external-lineage.json" else {"canonicalSha256": "4" * 64}))
                stack.enter_context(patch.object(publisher.panel_validation, "load_prior_authority", return_value={"evidence": {}}))
                for name in ("_validate_axis_corrections", "_validate_fresh_unreviewed_snapshots", "_verify_input_identities", "_publication_safety"):
                    stack.enter_context(patch.object(publisher, name, return_value={}))
                stack.enter_context(patch.object(publisher.factor_recovery, "validate_publish", return_value={}))
                stack.enter_context(patch.object(publisher, "_load_conflict_adjudication", return_value=({}, {})))
                stack.enter_context(patch.object(publisher, "_backend_module", return_value=backend))
                stack.enter_context(patch.object(publisher, "registry_correction_changes", return_value=[]))
                stack.enter_context(patch.object(publisher, "plan_registry_correction", return_value=(registry, [])))
                stack.enter_context(patch.object(single, "install_backend"))
                stack.enter_context(patch.object(canonical_rebase, "validate_rebase", return_value={}))
                prepared = compact.prepare_work({"workId": wid, "input": str(frozen), "authority": str(sealed)},
                    None, registry, "4" * 64, "test", {})
            self.assertEqual(prepared["reviewReference"], old_ref.removesuffix(".md") + "-" + "3" * 64 + ".md")
            self.assertEqual(backend.plan_against_current.call_args.args[4], prepared["reviewReference"])

    def test_completed_cleanup_reuses_backed_execution_and_observes_recreated_files(self):
        import catalog_authoring_runner as runner
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            store = RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            batch = repo / "data/local/catalog-authoring/artifacts/batch"
            scope = batch / "compact-working"
            scope.mkdir(parents=True)
            copied = scope / "pair.bin"
            copied.write_bytes(b"retained checkpoint")
            execution = store.put_revision("execution", compact.transient_subject(store, batch), {
                "schemaVersion": "authoring-transient-execution-v1", "disposableRoots": [store.key(scope)]})
            store.persist([scope], "checkpoint", execution=execution)
            with patch.object(runner, "REPO", repo):
                self.assertEqual(compact.complete_transient_lifetime(batch)["status"], "RETIRED")
                self.assertFalse(scope.exists())
                with patch.object(RevisionWorkspace, "backup", side_effect=AssertionError("unchanged cleanup backed up again")):
                    self.assertEqual(compact.complete_transient_lifetime(batch), {
                        "status": "RETIRED", "removed": [], "preserved": []})
                # Files added after retirement must re-enter the ordinary
                # ownership/SHA checks and remain available to the operator.
                scope.mkdir()
                copied.write_bytes(b"new operator bytes")
                result = compact.complete_transient_lifetime(batch)
                self.assertEqual(result["status"], "PARTIALLY_RETAINED")
                self.assertEqual(result["preserved"], [{"path": store.key(copied), "reason": "changed"}])
                self.assertEqual(copied.read_bytes(), b"new operator bytes")

    def test_missing_scope_still_backs_up_an_unfinished_execution(self):
        import catalog_authoring_runner as runner
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            store = RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            batch = repo / "data/local/catalog-authoring/artifacts/batch"
            execution = store.put_revision("execution", compact.transient_subject(store, batch), {
                "schemaVersion": "authoring-transient-execution-v1",
                "disposableRoots": [store.key(batch / "compact-working")]})
            store.backup()
            with patch.object(runner, "REPO", repo):
                self.assertEqual(compact.complete_transient_lifetime(batch)["status"], "RETIRED")
            backup = RevisionWorkspace(repo, repo / "data/local/catalog-authoring/backups/latest.sqlite")
            with closing(backup.connect()) as db:
                self.assertEqual(db.execute("SELECT terminal FROM revision WHERE id=?", (execution["revisionId"],)).fetchone(), (1,))
            self.assertEqual(backup.get_revision(execution), store.get_revision(execution))

    def test_completed_cleanup_rejects_corrupt_backed_execution_bytes(self):
        import catalog_authoring_runner as runner
        from catalog_revision_store import RevisionWorkspace
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            store = RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            batch = repo / "data/local/catalog-authoring/artifacts/batch"
            execution = store.put_revision("execution", compact.transient_subject(store, batch), {
                "schemaVersion": "authoring-transient-execution-v1",
                "disposableRoots": [store.key(batch / "compact-working")]})
            store.close_transient_execution(execution)
            store.backup()
            backup = RevisionWorkspace(repo, repo / "data/local/catalog-authoring/backups/latest.sqlite")
            with closing(backup.connect(write=True)) as db, db:
                db.execute("UPDATE blob SET byte_length=byte_length+1 WHERE sha256=?", (execution["payloadSha256"],))
            with patch.object(runner, "REPO", repo), self.assertRaises(ValueError):
                compact.complete_transient_lifetime(batch)

    def test_original_source_bytes_are_rechecked_after_scoped_memo_reuse(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "original.json"
            source.write_text('{"original":"decision"}\n', encoding="utf-8")
            publisher._write_result_manifest(root)
            ref = compact.reference(root)
            entries = [{"input": ref, "authority": ref}]
            compact.verify_source_references(entries)
            source.write_text('{"original":"changed"}\n', encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "mismatch"):
                compact.verify_source_references(entries)

    def test_changed_reused_review_is_rejected_at_final_boundary(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / "data/source/reviews/saved.md"
            path.parent.mkdir(parents=True)
            path.write_text("original authority review", encoding="utf-8")
            reviews = {"reviews/saved.md": publisher.sha256(path)}
            compact.verify_reviews(root, reviews)
            path.write_text("changed after reuse", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "referenced review changed"):
                compact.verify_reviews(root, reviews)

    def test_v2_uses_target_readback_and_final_checker_detects_unrelated_write(self):
        with tempfile.TemporaryDirectory() as directory:
            catalog = Path(directory) / "pair.sqlite"
            shutil.copyfile(REPO / "data/source/catalog.sqlite", catalog)
            backend = publisher._backend_module()
            with closing(sqlite3.connect(catalog)) as db:
                db.execute("attach database ':memory:' as registry")
                db.execute("create table registry.registry_meta(key text primary key,value text)")
                db.execute("create table registry.registry_research_attempts(attemptId text primary key)")
                db.execute("create table registry.registry_source_rows(sourceOrdinal integer primary key,sourceRowId text unique,canonicalWorkId text,volumeNumber text)")
                ids = [row[0] for row in db.execute("select id from source_works order by sourceOrdinal limit 2")]
                db.execute("insert into registry.registry_source_rows values(1,'row',?,'')", (ids[0],))
                db.execute("insert into registry.registry_source_rows values(2,'another',?,'')", (ids[1],))
                db.commit()
                view = compact.BatchView(db)
                work_id = ids[0]
                entry = {"workId": work_id, "input": {}, "authority": {}}
                plan = {"targetIds": [work_id], "passIds": [], "blockedIds": [], "newEvidence": {},
                        "factorUpdates": [], "themeInserts": [], "genreUpdates": {}, "contextInserts": [], "workUpdates": []}
                changes = [{"sourceRowId": "row", "workId": work_id, "field": "volumeNumber", "before": "", "after": "1"}]
                prepared = {"backend": backend, "plan": plan, "registryChanges": changes}
                seal = {"schemaVersion": "catalog-compact-plan-v2", **entry, "reviewedAt": "test",
                        "plan": plan, "registryChanges": changes, "canonicalRebase": None,
                        "beforeTargetSha256": compact.object_sha(compact.target_view(view.catalog.scope({work_id}), work_id))}
                db.execute("begin immediate")
                # A production materializer regression changes an unrelated Work.
                # Touched-row readback alone cannot certify the full publication.
                original_apply = backend.apply_plan_in_transaction
                def corrupting_apply(connection, value):
                    original_apply(connection, value)
                    connection.execute("update source_works set title='unrelated corruption' where id=?", (ids[1],))
                with patch.object(backend, "apply_plan_in_transaction", side_effect=corrupting_apply), patch.object(
                        backend, "_snapshot_db", side_effect=AssertionError("per-work full scan")):
                    receipt = compact.apply_work_v2(entry, db, prepared, seal, view)
                self.assertEqual(receipt["schemaVersion"], compact.WORK_FORMAT)
                self.assertEqual(db.execute("select volumeNumber from registry.registry_source_rows where sourceRowId='row'").fetchone()[0], "1")
                self.assertEqual(view.registry.snapshot(), correction.snapshot(db, namespace="registry", integrity=False))
                with self.assertRaisesRegex(ValueError, "independent sealed plans"):
                    view.verify_final(db)
                db.rollback()

    def test_v2_registry_checker_does_not_accept_unplanned_fields(self):
        with closing(sqlite3.connect(":memory:")) as db:
            db.execute("create table registry_meta(key text primary key,value text)")
            db.execute("create table registry_research_attempts(attemptId text primary key)")
            db.execute("create table registry_source_rows(sourceRowId text primary key,canonicalWorkId text,volumeNumber text)")
            db.execute("insert into registry_source_rows values('row','work','')")
            state = correction.RegistryState(correction.snapshot(db))
            with self.assertRaisesRegex(ValueError, "unauthorized field"):
                state.apply([{"sourceRowId": "row", "workId": "work", "field": "canonicalWorkId", "before": "work", "after": "another"}])

    def test_snapshot_facts_match_sql_and_preserve_immutable_rows(self):
        backend = publisher._backend_module()
        catalog = REPO / "data/source/catalog.sqlite"
        before = backend._snapshot_db(catalog)
        facts = backend._baseline_facts_from_snapshot(before)
        self.assertEqual(facts, backend._baseline_facts(catalog))
        wid = next(iter(facts["works"]))
        facts["works"][wid]["title"] = "planner-local mutation"
        self.assertNotEqual(backend._baseline_facts_from_snapshot(before)["works"][wid]["title"], "planner-local mutation")
        plan = {"targetIds": [], "passIds": [], "blockedIds": []}
        for table, field in (("source_works", "title"), ("source_volumes", "isbn"),
                             ("source_evidence", "notes"), ("source_book_metadata", "fetchedAt")):
            with self.subTest(table=table):
                columns, rows = before[table]
                self.assertTrue(rows)
                changed = list(rows[0])
                changed[columns.index(field)] = "unauthorized change"
                after = {**before, table: (columns, (tuple(changed), *rows[1:]))}
                with self.assertRaises(ValueError):
                    backend._verify_preservation(before, after, plan, {wid})

    def test_serial_view_advances_only_on_commit_and_detects_external_writes(self):
        with tempfile.TemporaryDirectory() as directory:
            catalog = Path(directory) / "pair.sqlite"
            shutil.copyfile(REPO / "data/source/catalog.sqlite", catalog)
            backend = publisher._backend_module()
            plan = {"newEvidence": {}, "factorUpdates": [], "themeInserts": [],
                    "genreUpdates": {}, "contextInserts": [], "workUpdates": [], "passIds": []}
            with closing(sqlite3.connect(catalog)) as db:
                db.execute("attach database ':memory:' as registry")
                db.execute("create table registry.registry_meta(key text primary key,value text)")
                db.execute("create table registry.registry_research_attempts(attemptId text primary key)")
                db.execute("create table registry.registry_source_rows(sourceRowId text primary key)")
                registry = correction.snapshot(db, namespace="registry")
                prepared = {"backend": backend, "plan": plan, "gold": set(), "registryAfter": registry, "registryChanges": []}
                previous = None
                entry = {"workId": "test-only", "input": {}, "authority": {}}
                with patch.object(compact, "prepare_work", return_value=prepared):
                    for expected_reads in (2, 1):
                        db.execute("begin immediate")
                        metrics = {}
                        result, receipt, _ = compact.apply_work(entry, db, "", "", _previous=previous, _metrics=metrics)
                        self.assertEqual(metrics["sourceSnapshots"], expected_reads)
                        previous = compact._commit_view(db, result, receipt)
                    # A separate writer invalidates the view even on this connection.
                    with closing(sqlite3.connect(catalog)) as writer, writer:
                        writer.execute("update source_works set title=title || ' changed' where sourceOrdinal=(select min(sourceOrdinal) from source_works)")
                    db.execute("begin immediate")
                    metrics = {}
                    result, receipt, _ = compact.apply_work(entry, db, "", "", _previous=previous, _metrics=metrics)
                    self.assertEqual(metrics["sourceSnapshots"], 2)
                    db.rollback()
                # SQLite deferred constraints can fail at commit after all reads passed.
                db.execute("pragma foreign_keys=ON")
                db.executescript("create table commit_parent(id integer primary key); create table commit_child(parent integer references commit_parent(id) deferrable initially deferred);")
                db.execute("insert into commit_child values(1)")
                retained = previous
                with self.assertRaises(sqlite3.IntegrityError):
                    previous = compact._commit_view(db, result, receipt)
                self.assertIs(previous, retained)
                db.rollback()

    def test_interrupted_checkpoint_copy_is_rebuilt_before_receipt(self):
        with tempfile.TemporaryDirectory() as directory:
            stage, checkpoint = Path(directory) / "working", Path(directory) / "checkpoint"
            stage.mkdir()
            for name in (compact.CATALOG, compact.REGISTRY):
                (stage / name).write_bytes(("committed " + name).encode())
            original_copy = shutil.copy2
            def partial_copy(source, destination):
                if source.name == compact.REGISTRY:
                    destination.write_bytes(b"interrupted copy")
                    raise OSError("injected copy interruption")
                return original_copy(source, destination)
            with patch.object(compact.shutil, "copy2", side_effect=partial_copy):
                with self.assertRaisesRegex(OSError, "copy interruption"):
                    compact.copy_checkpoint_pair(stage, checkpoint)
            self.assertFalse((checkpoint / "CHECKPOINT.json").exists())
            compact.copy_checkpoint_pair(stage, checkpoint)
            for name in (compact.CATALOG, compact.REGISTRY):
                self.assertEqual((stage / name).read_bytes(), (checkpoint / name).read_bytes())
            (checkpoint / "CHECKPOINT.json").write_text("{}")
            (checkpoint / compact.REGISTRY).write_bytes(b"changed after receipt")
            with self.assertRaisesRegex(ValueError, "checkpoint pair changed"):
                compact.copy_checkpoint_pair(stage, checkpoint)

    def test_late_failure_rolls_back_catalog_and_registry_together(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            catalog, registry = root / compact.CATALOG, root / compact.REGISTRY
            shutil.copyfile(REPO / "data/source/catalog.sqlite", catalog)
            with closing(sqlite3.connect(registry)) as db, db:
                db.execute("create table registry_meta(key text primary key,value text)")
                db.execute("create table registry_research_attempts(attemptId text primary key)")
                db.execute("create table registry_source_rows(sourceRowId text primary key,canonicalWorkId text,volumeNumber text)")
                db.execute("insert into registry_source_rows values('row','work','')")
            backend = publisher._backend_module()
            before = backend._snapshot_db(catalog)
            registry_before = correction.snapshot(registry)
            columns, rows = before["source_evidence"]
            evidence = {**dict(zip(columns, rows[0])), "id": "test-pair-rollback"}
            changes = [{"sourceRowId": "row", "workId": "work", "field": "volumeNumber", "before": "", "after": "1"}]
            expected, pending = publisher.plan_registry_correction(changes, registry_before)
            plan = {"newEvidence": {evidence["id"]: evidence}, "factorUpdates": [], "themeInserts": [],
                    "genreUpdates": {}, "contextInserts": [], "workUpdates": []}
            prepared = {"backend": backend, "plan": plan, "gold": set(),
                        "registryAfter": expected, "registryChanges": pending}
            with closing(sqlite3.connect(catalog)) as db:
                db.execute("attach database ? as registry", (str(registry),))
                with self.assertRaisesRegex(ValueError, "owned pair transaction"):
                    compact.apply_work({}, db, "", "")
                db.execute("begin immediate")
                with patch.object(compact, "prepare_work", return_value=prepared), patch.object(
                        backend, "_verify_preservation", side_effect=ValueError("injected after both writes")):
                    with self.assertRaisesRegex(ValueError, "after both writes"):
                        compact.apply_work({}, db, "", "")
                self.assertEqual(db.execute("select volumeNumber from registry.registry_source_rows").fetchone(), ("1",))
                self.assertEqual(db.execute("select count(*) from source_evidence where id='test-pair-rollback'").fetchone(), (1,))
                with closing(sqlite3.connect(registry)) as reader:
                    self.assertEqual(correction.snapshot(reader), registry_before)
                self.assertEqual(backend._snapshot_db(catalog), before)
                db.rollback()
            self.assertEqual(correction.snapshot(registry), registry_before)
            self.assertEqual(backend._snapshot_db(catalog), before)


if __name__ == "__main__":
    unittest.main()
