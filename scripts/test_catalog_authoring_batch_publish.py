"""Publication recovery uses real storage; no model or canonical publication runs here."""
import io
import json
from contextlib import closing, nullcontext, redirect_stdout
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch

import catalog_authoring_batch_publish as batch
from catalog_revision_store import RevisionWorkspace


class BatchPublicationTest(unittest.TestCase):
    def test_summary_byte_adapter_preserves_original_and_semantic_rows(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            root = repo / "artifacts"
            root.mkdir()
            store = RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            value = {"works": [{"workId": "work-a", "status": "HOLD", "evidence": "原文\\nそのまま"}],
                     "extra": {"retained": [None, False, 1.25]}}
            canonical = (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
            variants = [canonical.replace(b"\n", b"\r\n"), b"\xef\xbb\xbf" + canonical,
                        canonical.rstrip(b"\n"), b"\xef\xbb\xbf" + canonical.replace(b"\n", b"\r").rstrip(b"\r")]
            with patch.object(batch.runner, "REPO", repo), patch.object(batch.runner, "ROOT", root):
                for index, raw in enumerate(variants):
                    with self.subTest(index=index):
                        source = root / f"summary-{index}.json"
                        source.write_bytes(raw)
                        sha = batch.runner.panel.sha256(source)
                        output = root / "planning/attempt"
                        self.assertEqual(batch.read_batch_summary(source, sha, batch=output), value)
                        self.assertEqual(source.read_bytes(), raw)
                        adapted = output / "summary-adapters" / sha
                        self.assertEqual((adapted / "SOURCE.json").read_bytes(), raw)
                        self.assertEqual(batch.runner.panel.read_json(adapted / "SUMMARY.json"), value)
                        receipt = batch.runner.panel.read_json(adapted / "ADAPTER.json")
                        self.assertEqual(receipt["sourceSha256"], sha)
                        self.assertEqual(receipt["normalizedSha256"], batch.runner.panel.sha256(adapted / "SUMMARY.json"))
                        # The byte adapter is retained through the ordinary private v4 store.
                        with closing(store.connect()) as db:
                            for path in adapted.iterdir():
                                digest = batch.runner.panel.sha256(path)
                                self.assertEqual(store.read_blob(db, digest), path.read_bytes())
                            revisions = db.execute("SELECT count(*) FROM revision").fetchone()[0]
                        self.assertEqual(batch.read_batch_summary(source, sha, batch=output), value)
                        with closing(store.connect()) as db:
                            self.assertEqual(db.execute("SELECT count(*) FROM revision").fetchone()[0], revisions)
                        with self.assertRaises(ValueError):
                            batch.runner.panel.read_json(source)

    def test_summary_source_chain_preserves_raw_sha_and_rejects_changed_rows_or_bytes(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            root = repo / "artifacts"
            root.mkdir()
            RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            original = root / "original.json"
            first = {"workId": "work-a", "status": "READY_FOR_PUBLICATION", "checkedSha256": "exact-original"}
            second = {"workId": "work-b", "status": "HOLD"}
            original.write_bytes(json.dumps({"works": [first, second]}).encode() + b"\r\n")
            original_sha = batch.runner.panel.sha256(original)
            subset = root / "subset.json"
            final = root / "final.json"
            batch.runner.write(subset, {"sourceSummary": {"path": str(original), "sha256": original_sha}, "works": [first]})
            batch.runner.write(final, {"sourceSummary": {"path": str(subset), "sha256": batch.runner.panel.sha256(subset)}, "works": [first]})
            output = root / "planning/attempt"
            with patch.object(batch.runner, "REPO", repo), patch.object(batch.runner, "ROOT", root):
                sha = batch.runner.panel.sha256(final)
                result = batch.read_batch_summary(final, sha, batch=output)
                self.assertEqual(result["works"], [first])
                self.assertEqual(batch.runner.panel.read_json(subset)["sourceSummary"]["sha256"], original_sha)
                self.assertTrue((output / "summary-adapters" / original_sha / "ADAPTER.json").exists())
                changed = {**first, "checkedSha256": "invented"}
                batch.runner.write(final, {"sourceSummary": {"path": str(subset), "sha256": batch.runner.panel.sha256(subset)}, "works": [changed]})
                with self.assertRaisesRegex(ValueError, "subset changed source result rows"):
                    batch.read_batch_summary(final, batch.runner.panel.sha256(final), batch=output)
                with self.assertRaisesRegex(ValueError, "source batch summary changed"):
                    batch.read_batch_summary(final, sha, batch=output)
                original.write_bytes(original.read_bytes() + b" ")
                with self.assertRaisesRegex(ValueError, "source batch summary changed"):
                    batch.read_batch_summary(subset, batch.runner.panel.sha256(subset), batch=output)

    def test_summary_adapter_rejects_invalid_json_and_saved_adapter_mutation(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            source = repo / "summary.json"
            output = repo / "planning/attempt"
            RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            with patch.object(batch.runner, "REPO", repo):
                for raw in (b'{"works": [}', b'{"works": [], "works": []}', b'{"works": [], "x": NaN}',
                            b'{"works": [], "x": "raw\rnewline"}', b'\xff{"works": []}', b'[]'):
                    source.write_bytes(raw)
                    with self.assertRaises(ValueError):
                        batch.read_batch_summary(source, batch.runner.panel.sha256(source), batch=output)
                    self.assertFalse(output.exists())
                source.write_bytes(b'{"works": []}\r\n')
                sha = batch.runner.panel.sha256(source)
                batch.read_batch_summary(source, sha, batch=output)
                (output / "summary-adapters" / sha / "SUMMARY.json").write_bytes(b'{"works": ["invented"]}\n')
                with self.assertRaisesRegex(ValueError, "saved summary adapter changed"):
                    batch.read_batch_summary(source, sha, batch=output)

    def test_normal_publish_adapts_summary_but_keeps_checked_reader_strict(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            root = repo / "artifacts"
            root.mkdir()
            RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            checked = root / "run/CHECKED.json"
            checked.parent.mkdir()
            checked.write_bytes(b'{"workId":"work-a","status":"READY_FOR_PUBLICATION"}\r\n')
            summary = root / "summary.json"
            summary.write_bytes(json.dumps({"works": [{"workId": "work-a", "status": "READY_FOR_PUBLICATION",
                "checkedPath": str(checked), "checkedSha256": batch.runner.panel.sha256(checked)}]}).encode() + b"\r\n")
            raw = summary.read_bytes()
            args = SimpleNamespace(batch_summary=summary, batch_root=root / "planning/attempt", apply_canonical=False)
            output = io.StringIO()
            with patch.object(batch.runner, "REPO", repo), patch.object(batch.runner, "ROOT", root), \
                 patch.object(batch.runner, "current", return_value=({}, root)), redirect_stdout(output):
                with self.assertRaisesRegex(ValueError, "LF-only") as failure:
                    batch.publish(args)
            self.assertEqual(summary.read_bytes(), raw)
            self.assertTrue((args.batch_root / "summary-adapters" / batch.runner.panel.sha256(summary) / "ADAPTER.json").exists())
            events = [json.loads(line) for line in output.getvalue().splitlines()]
            timing = events[-1]["batchPublicationTimingsSeconds"]
            self.assertEqual(timing["outcome"], "FAILED")
            self.assertEqual(timing["executionMode"], "unresolved")
            self.assertEqual(timing["failedStage"], "summaryAndCheckedInputs")
            self.assertEqual(timing["errorType"], type(failure.exception).__name__)
            self.assertGreaterEqual(timing["total"], 0)

    def test_canonical_resume_rejects_a_changed_live_candidate_receipt(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            receipt = root / "BATCH-FINISHED.json"
            batch.runner.write(receipt, {"summarySha256": "applied summary"})
            applied = {"batchRoot": str(root), "receiptSha256": batch.runner.panel.sha256(receipt)}
            batch.runner.write(receipt, {"summarySha256": "different summary", "works": []})
            with patch.object(batch, "apply_canonical", side_effect=AssertionError("changed receipt must not reach canonical")):
                with self.assertRaisesRegex(ValueError, "differs from the applied completion"):
                    batch.report_completed(root, applied, canonical=True)

    def test_legacy_canonical_completion_repairs_missing_final_receipt_backup(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            output = repo / "artifacts/planning/batch"
            canonical_output = output / "canonical/first"
            receipt = output / "BATCH-FINISHED.json"
            final = output / "CANONICAL-COMPLETED.json"
            with patch.object(batch.runner, "REPO", repo):
                batch.runner.write(receipt, {"summarySha256": "summary"})
                batch.runner.write(canonical_output / "completion.json", {"status": "APPLIED"})
                storage = batch.runner.preserve([canonical_output], "test:canonical")
                batch.runner.write(final, {"status": "APPLIED", "candidateReceiptSha256": batch.runner.panel.sha256(receipt),
                                           "outputRoot": str(canonical_output), "storage": storage})
                self.assertFalse(batch.runner.receipt_backed_up(final))
                with patch.object(batch.subprocess, "run", side_effect=AssertionError("must not republish")):
                    result = batch.apply_canonical(output, receipt)
                self.assertEqual(result["readback"], "HISTORICAL_COMPLETION_VERIFIED")
                self.assertTrue(batch.runner.receipt_backed_up(final))

    def test_canonical_readback_cannot_adopt_a_generation_not_in_the_dependency_proof(self):
        import canonical_rebase
        import catalog_readback_identity
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            canonical = repo / "data/source/catalog.sqlite"
            canonical.parent.mkdir(parents=True)
            canonical.write_bytes(b"generation A")
            for name, relative in canonical_rebase.POLICIES.items():
                path = repo / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(name, encoding="utf-8")
            source_sha = batch.runner.panel.sha256(canonical)
            root = repo / "batch"
            run = repo / "run"
            manifest = run / "frozen/panel-input/PANEL-INPUT.sha256"
            manifest.parent.mkdir(parents=True)
            manifest.write_bytes(b"original immutable input")
            checked = run / "CHECKED.json"
            summary = repo / "summary.json"
            readback = root / "readback/READBACK.json"
            batch.runner.write(run / "RUN.json", {})
            batch.runner.write(checked, {"workId": "work-a", "status": "READY_FOR_PUBLICATION",
                                       "inputManifestSha256": batch.runner.panel.sha256(manifest)})
            batch.runner.write(summary, {"works": [{"workId": "work-a", "checkedPath": str(checked),
                                                   "checkedSha256": batch.runner.panel.sha256(checked)}]})
            batch.runner.write(readback, {"canonicalSha256": "older generation", "resultRoots": [{"root": str(repo / "result")}],
                                         "batchPublications": {"path": str(root / "READBACK-PUBLICATIONS.json")}})
            saved = {"readback": str(readback), "readbackSha256": batch.runner.panel.sha256(readback),
                     "summaryPath": str(summary), "summarySha256": batch.runner.panel.sha256(summary),
                     "finalPublicationRoot": str(repo / "publication"), "works": [{"workId": "work-a"}]}
            def advanced_before_readback(command, **kwargs):
                canonical.write_bytes(b"generation B with a changed target")
                batch.runner.write(Path(command[6]) / "READBACK.json",
                                   {"canonicalSha256": batch.runner.panel.sha256(canonical)})
                return SimpleNamespace(returncode=0)
            with patch.object(batch.runner, "REPO", repo), \
                 patch.object(batch.runner.publisher, "validate_input"), \
                 patch.object(canonical_rebase, "validate_rebase", return_value={"currentCanonicalSha256": source_sha,
                     "currentPolicyDigests": {name: batch.runner.panel.sha256(repo / path) for name, path in canonical_rebase.POLICIES.items()}}), \
                 patch.object(catalog_readback_identity, "execution_identity", return_value={"files": []}), \
                 patch.object(batch.runner, "readback_matches", side_effect=[False, True]), \
                 patch.object(batch.subprocess, "run", side_effect=advanced_before_readback):
                with self.assertRaisesRegex(ValueError, "advanced after dependency proof"):
                    batch.canonical_readback(root, saved)
            self.assertFalse(list(root.rglob("CANONICAL-REBASE.json")))

    def test_unchanged_canonical_readback_does_not_skip_live_policy_validation(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            canonical = repo / "data/source/catalog.sqlite"
            canonical.parent.mkdir(parents=True)
            canonical.write_bytes(b"unchanged canonical")
            readback = repo / "batch/READBACK.json"
            batch.runner.write(readback, {"canonicalSha256": batch.runner.panel.sha256(canonical)})
            saved = {"readback": str(readback), "readbackSha256": batch.runner.panel.sha256(readback)}
            with patch.object(batch.runner, "REPO", repo), \
                 patch.object(batch, "canonical_dependency_proof", side_effect=ValueError("policy changed")), \
                 patch.object(batch.subprocess, "run", side_effect=AssertionError("policy conflict must stop before effect")):
                with self.assertRaisesRegex(ValueError, "policy changed"):
                    batch.canonical_readback(repo / "batch", saved)

    def test_cached_canonical_stage_cannot_skip_live_policy_validation(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            canonical = repo / "data/source/catalog.sqlite"
            canonical.parent.mkdir(parents=True)
            canonical.write_bytes(b"unchanged canonical")
            original = canonical.read_bytes()
            output = repo / "batch"
            receipt, readback = output / "BATCH-FINISHED.json", output / "READBACK.json"
            RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            batch.runner.write(readback, {"canonicalSha256": batch.runner.panel.sha256(canonical)})
            batch.runner.write(receipt, {"summarySha256": "summary", "works": [{"workId": "work-a"}],
                                        "readback": str(readback), "readbackSha256": batch.runner.panel.sha256(readback)})
            batch.runner.write(output / "canonical-inputs" / (batch.runner.panel.sha256(canonical) + ".json"), {
                "candidateReceiptSha256": batch.runner.panel.sha256(receipt), "readback": str(readback),
                "readbackSha256": batch.runner.panel.sha256(readback)})
            with patch.object(batch.runner, "REPO", repo), \
                 patch.object(batch, "canonical_dependency_proof", side_effect=ValueError("policy changed")), \
                 patch.object(batch.subprocess, "run", side_effect=AssertionError("must not apply an outdated policy")):
                with self.assertRaisesRegex(ValueError, "policy changed"):
                    batch.apply_canonical(output, receipt)
            self.assertEqual(canonical.read_bytes(), original)
            self.assertFalse((output / "CANONICAL-COMPLETED.json").exists())

    def test_backed_canonical_completion_is_acknowledged_after_canonical_advances(self):
        import sqlite3
        from test_completed_checks import CompletedCheckTest
        fixture = CompletedCheckTest()
        self.addCleanup(fixture.doCleanups)
        fixture.setUp()
        canonical = fixture.repo / "data/source/catalog.sqlite"
        original_completion = fixture.store.current_revision("canonical-completion", fixture.summary_sha)
        with closing(sqlite3.connect(canonical)) as db, db:
            db.execute("UPDATE source_works SET title='Later bibliography'")
        fixture.global_effect()
        current = canonical.read_bytes()
        with patch.object(batch.subprocess, "run", side_effect=AssertionError("must not republish historical completion")):
            acknowledged = batch.apply_canonical(fixture.batch, fixture.batch / "BATCH-FINISHED.json")
            self.assertEqual(acknowledged["readback"], "HISTORICAL_COMPLETION_VERIFIED")
            self.assertEqual(acknowledged["revision"], original_completion)
            self.assertEqual(acknowledged["currentCanonicalEffect"]["generatedFiles"], 10)
            self.assertEqual(canonical.read_bytes(), current)
            (fixture.repo / "src/data/generated/catalog-v1.json").write_bytes(b"corrupt static data")
            with self.assertRaisesRegex(ValueError, "current generated artifact differs"):
                batch.apply_canonical(fixture.batch, fixture.batch / "BATCH-FINISHED.json")

    def test_pending_canonical_with_completion_resumes_normal_cli_before_backup(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            output = repo / "artifacts/planning/batch"
            stage = output / "canonical" / ("a" * 64)
            receipt = output / "BATCH-FINISHED.json"
            readback = output / "READBACK.json"
            RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            with patch.object(batch.runner, "REPO", repo):
                batch.runner.write(readback, {"catalogSha256": "candidate", "registrySha256": "registry",
                                             "publicationManifestSha256": "manifest", "targetWorkIds": ["work-a"]})
                batch.runner.write(receipt, {"summarySha256": "summary", "works": [{"workId": "work-a"}],
                                            "readback": str(readback), "readbackSha256": batch.runner.panel.sha256(readback)})
                batch.runner.write(stage / "prepared.json", {"retained": True})
                batch.runner.write(stage / "completion.json", {"schemaVersion": "catalog-canonical-completion-v1", "status": "APPLIED", "workIds": ["work-a"]})
                batch.runner.write(output / "canonical-inputs" / (stage.name + ".json"), {
                    "candidateReceiptSha256": batch.runner.panel.sha256(receipt), "readback": str(readback),
                    "readbackSha256": batch.runner.panel.sha256(readback)})
                pending = repo / "data/local/catalog-authoring/locks/publication.pending.json"
                batch.runner.write(pending, {"preparedPath": str(stage / "prepared.json")})
                def recover(command, **kwargs):
                    self.assertIn("--publication-root", command)
                    self.assertNotIn("--verify-completion", command)
                    pending.unlink()
                    return SimpleNamespace(returncode=0)
                # This test isolates dispatch to the normal pending-recovery
                # CLI. The full current-effect proof is covered above.
                with patch.object(batch.subprocess, "run", side_effect=recover) as child, \
                     patch("catalog_completed_checks.verify_current_canonical_effect", return_value={}) as current_effect:
                    result = batch.apply_canonical(output, receipt)
                self.assertEqual(child.call_count, 1)
                current_effect.assert_called_once_with()
                self.assertEqual(result["readback"], "PASS")
                self.assertFalse(pending.exists())
                self.assertTrue((output / "CANONICAL-COMPLETED.json").is_file())

    def test_only_explicit_pending_completion_blocks_the_next_batch(self):
        state = {"publicationBatches": {"old": {"batchRoot": "absent-old"},
                                         "latest": {"batchRoot": "latest"}},
                 "pendingPublicationBatch": "latest"}
        with patch.object(batch, "verify_completion_revision", return_value=True) as verify:
            batch.require_previous_completion(state, "new")
        verify.assert_called_once_with("latest", state["publicationBatches"]["latest"])
        with patch.object(batch, "verify_completion_revision", return_value=False), \
             patch.object(batch, "verify_completed", side_effect=ValueError("backup incomplete")):
            with self.assertRaisesRegex(ValueError, "backup incomplete"):
                batch.require_previous_completion(state, "new")
        with patch.object(batch, "verify_completion_revision", side_effect=AssertionError("own recovery is allowed")):
            batch.require_previous_completion(state, "latest")

    def test_private_attempt_identity_changes_without_overwriting_saved_attempt(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            source = repo / "data/source/catalog.sqlite"
            source.parent.mkdir(parents=True)
            source.write_bytes(b"canonical-one")
            summary = repo / "summary.json"
            summary.write_text('{"works": []}', encoding="utf-8")
            state = {"latestCandidate": {"catalogSha256": "catalog", "registrySha256": "registry"}}
            args = SimpleNamespace(batch_root=repo / "batch", batch_summary=summary, publication_format="compact")
            with patch.object(batch.runner, "REPO", repo), patch.object(batch.runner, "current", return_value=(state, repo / "basis")), \
                 patch.object(batch, "code_identity", return_value={"same": "code"}):
                first = batch.attempt_arguments(args).batch_root
                first.mkdir(parents=True)
                (first / "original.txt").write_bytes(b"retained failure")
                self.assertEqual(batch.attempt_arguments(args).batch_root, first)
                source.write_bytes(b"canonical-two")
                second = batch.attempt_arguments(args).batch_root
                self.assertNotEqual(first, second)
                self.assertEqual((first / "original.txt").read_bytes(), b"retained failure")
                state["publicationBatches"] = {batch.runner.panel.sha256(summary): {"batchRoot": str(first)}}
                self.assertEqual(batch.attempt_arguments(args).batch_root, first)

    def test_applied_revision_resumes_canonical_and_requires_matching_backup_head(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            root = repo / "artifacts"
            output = root / "planning/batch"
            output.mkdir(parents=True)
            store = RevisionWorkspace.create(repo, repo / "data/local/catalog-authoring/workspace.sqlite")
            summary = root / "summary.json"
            readback = output / "READBACK.json"
            receipt = output / "BATCH-FINISHED.json"
            with patch.object(batch.runner, "REPO", repo), patch.object(batch.runner, "ROOT", root):
                batch.runner.write(summary, {"works": []})
                summary_sha = batch.runner.panel.sha256(summary)
                batch.runner.write(readback, {"verified": True})
                batch.runner.write(receipt, {"summarySha256": summary_sha, "readback": str(readback),
                    "readbackSha256": batch.runner.panel.sha256(readback), "finalPublicationRoot": str(output), "works": []})
                applied = {"batchRoot": str(output), "receiptSha256": batch.runner.panel.sha256(receipt)}
                state = {"publicationBatches": {summary_sha: applied},
                         "latestCandidate": {"catalogSha256": "catalog", "registrySha256": "registry"}}
                batch.runner.write(root / "STATE.json", state)
                storage = batch.runner.preserve([receipt, readback], "test:readback", phase_boundary=True)
                batch.complete_batch(output, receipt, storage)
                self.assertTrue(batch.verify_completion_revision(summary_sha, applied))
                args = SimpleNamespace(batch_summary=summary, batch_root=output, apply_canonical=True)
                authoritative_bytes = {path: path.read_bytes() for path in (summary, readback, receipt)}
                logged = io.StringIO()
                with patch.object(batch.runner, "current", return_value=(state, output)), \
                     patch.object(batch, "apply_canonical", return_value={"status": "APPLIED"}) as canonical, \
                     redirect_stdout(logged):
                    batch.publish(args)
                canonical.assert_called_once_with(output, receipt)
                events = [json.loads(line) for line in logged.getvalue().splitlines()]
                self.assertEqual(events[-1]["status"], "VERIFIED")
                timing = events[-2]["batchPublicationTimingsSeconds"]
                self.assertEqual(timing["outcome"], "COMPLETED")
                self.assertEqual(timing["executionMode"], "reused")
                self.assertEqual(set(timing["stages"]), {"summaryAndCheckedInputs",
                    "candidateStorageBasisStateAndCompletion", "canonicalEffect", "transientCleanup"})
                self.assertTrue(all(value >= 0 for value in timing["stages"].values()))
                self.assertAlmostEqual(sum(timing["stages"].values()), timing["total"], places=6)
                self.assertEqual({path: path.read_bytes() for path in authoritative_bytes}, authoritative_bytes)
                failed = io.StringIO()
                with patch.object(batch.runner, "current", return_value=(state, output)), \
                     patch.object(batch, "apply_canonical", side_effect=OSError("canonical interrupted")), \
                     redirect_stdout(failed):
                    with self.assertRaisesRegex(OSError, "canonical interrupted"):
                        batch.publish(args)
                events = [json.loads(line) for line in failed.getvalue().splitlines()]
                self.assertEqual(events[-2]["status"], "CANDIDATE_VERIFIED_CANONICAL_INCOMPLETE")
                timing = events[-1]["batchPublicationTimingsSeconds"]
                self.assertEqual(timing["outcome"], "FAILED")
                self.assertEqual(timing["executionMode"], "reused")
                self.assertEqual(timing["failedStage"], "canonicalEffect")
                self.assertEqual(timing["errorType"], "OSError")
                self.assertNotIn("transientCleanup", timing["stages"])
                self.assertEqual({path: path.read_bytes() for path in authoritative_bytes}, authoritative_bytes)
                previous = store.current_revision("completion", summary_sha)
                value = store.get_revision(previous)
                store.put_revision("completion", summary_sha, {**value["payload"], "audit": "new unbacked revision"}, value["members"])
                with self.assertRaisesRegex(ValueError, "source/backup head differs"):
                    batch.verify_completion_revision(summary_sha, applied)

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
            self.assertEqual(batch.preflight_scope('{"error":"fresh snapshot materialized fact has protected reviewed evidence: work-a"}', "work-a"), "WORK")
            self.assertEqual(batch.preflight_scope('fresh snapshot materialized fact has protected reviewed evidence: work-other', "work-a"), "BATCH")
            self.assertEqual(batch.preflight_scope('Traceback\nlegacy.PublishError: accepted baseline axis conflict: work-a darkness', "work-a"), "WORK")
            self.assertEqual(batch.preflight_scope("Canonical rebase target conflict: work-a: source_factors", "work-a"), "WORK")
            self.assertEqual(batch.preflight_scope("Canonical rebase target conflict: work-other: source_factors", "work-a"), "BATCH")
            self.assertEqual(batch.preflight_scope("Canonical rebase protected source changed: source_factors", "work-a"), "BATCH")
            for error in ("manifest changed", "accepted baseline axis conflict: work-other darkness", "Traceback: dependency unavailable"):
                self.assertEqual(batch.preflight_scope(error, "work-a"), "BATCH")

    def test_code_identity_binds_external_helpers_gold_schema_and_policy(self):
        identity = batch.code_identity()
        for relative in ("scripts/workspace_paths.py", "scripts/catalog_recovery.py", "scripts/sql/catalog-authority/001-init.sql",
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
