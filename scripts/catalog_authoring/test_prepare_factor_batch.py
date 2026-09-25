"""Regression checks using the real operator records and existing publication flow."""
import shutil
import sqlite3
import csv
import copy
import argparse
import contextlib
import io
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path
from unittest import mock

import prepare_factor_batch as batch


class RetainedOperatorTest(unittest.TestCase):
    def test_collection_binding_preserves_multiple_roots_and_rejects_bad_capture(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            wid = "work-aaaaaaaaaaaaaaaaaaaa"
            refs = []
            for name in ("original", "supplement"):
                collection = root / name
                collection.mkdir()
                batch.write_json(collection / "collection-session.json", {"workId": wid})
                research = collection / "research.jsonl"
                research.write_text(json.dumps({"workId": wid, "sources": []}), encoding="utf-8")
                refs.append({"path": str(research), "sha256": batch.panel.sha256(research)})
                body = collection / "capture-same.body"
                body.write_bytes(name.encode())
                batch.write_json(collection / "capture-same.json", {"rawPath": body.name, "sha256": batch.panel.sha256(body), "bytes": body.stat().st_size})
                (collection / "unrelated.txt").write_text("must not be copied")
            job = root / "job.json"
            batch.write_json(job, {"works": [{"workId": wid, "researchRefs": refs}]})
            bindings = batch.capture_bindings(job)
            self.assertEqual(len(bindings), 2)
            self.assertNotEqual(bindings[0]["files"]["capture-same.body"], bindings[1]["files"]["capture-same.body"])
            self.assertTrue(all("unrelated.txt" not in item["files"] for item in bindings))
            # A revision may replace observations while retaining the original raw dependency.
            batch.write_json(job, {"works": [{"workId": wid, "researchRefs": [refs[1]]}]})
            inherited = batch.capture_bindings(job, [root / "original", root / "supplement"])
            self.assertEqual({item["root"] for item in inherited}, {str(root / name) for name in ("original", "supplement")})
            self.assertTrue(all("capture-same.body" in item["files"] for item in inherited))
            batch.write_json(job, {"works": [{"workId": wid, "researchRefs": refs}]})
            receipt_path = root / "original/capture-same.json"
            original = batch.panel.read_json(receipt_path)
            for change in ({"sha256": "0" * 64}, {"bytes": 0}, {"rawPath": "../outside.body"}, {"rawPath": "missing.body"}):
                batch.write_json(receipt_path, {**original, **change})
                with self.assertRaises(ValueError):
                    batch.capture_bindings(job)
            batch.write_json(receipt_path, original)
            session = root / "original/collection-session.json"
            batch.write_json(session, {"workId": "work-bbbbbbbbbbbbbbbbbbbb"})
            with self.assertRaisesRegex(ValueError, "Work mismatch"):
                batch.capture_bindings(job)
            session.unlink()
            with self.assertRaisesRegex(ValueError, "NEEDS_PROVENANCE_BINDING"):
                batch.capture_bindings(job)
            explicit = batch.capture_bindings(job, root / "original")
            self.assertEqual(explicit[0]["bindingKind"], "explicit-legacy")
            batch.write_json(session, {"workId": wid})
            research = root / "original/research.jsonl"
            research.write_text("\n".join(json.dumps({"workId": item, "sources": []}) for item in (wid, "work-bbbbbbbbbbbbbbbbbbbb")), encoding="utf-8")
            refs[0]["sha256"] = batch.panel.sha256(research)
            batch.write_json(job, {"works": [{"workId": wid, "researchRefs": refs}]})
            self.assertEqual(len(batch.capture_bindings(job)), 2)

    def test_gold_alias_boundary_accepts_applied_delta_and_rejects_changes(self):
        backend = batch.publisher._backend_module()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            baseline, canonical = root / "candidate.sqlite", root / "canonical.sqlite"
            original = {("gold", "original")}
            approved = {("gold", f"approved-{i}") for i in range(20)}
            def database(path, rows):
                with contextlib.closing(sqlite3.connect(path)) as db, db:
                    db.execute("create table if not exists source_aliases (workId text, alias text)")
                    db.execute("delete from source_aliases")
                    db.executemany("insert into source_aliases values (?,?)", sorted(rows))
            manifest = {"datasets": {"aliases.csv": {"headerSha256": backend._json_sha(["workId", "alias"]),
                "rowSha256": [backend._json_sha(list(row)) for row in original], "rowCount": 1}}}
            resolution = root / "resolution.csv"
            with resolution.open("w", newline="", encoding="utf-8") as stream:
                writer = csv.writer(stream)
                writer.writerow(["workId", "alias", "provenance", "sourceRowId", "action", "collisionWith"])
                writer.writerows([wid, alias, "source", str(i), "inserted", ""] for i, (wid, alias) in enumerate(sorted(approved)))
            with mock.patch.object(backend, "_load_gold_manifest", return_value=manifest), \
                 mock.patch.object(backend, "_find_repo_catalog", return_value=canonical), \
                 mock.patch.object(backend, "_find_repo_file", return_value=resolution):
                database(baseline, original | approved)
                for count in (0, 7, 20):
                    database(canonical, original | set(sorted(approved)[:count]))
                    self.assertEqual(backend._validate_alias_boundary(baseline, None, {"gold"})["goldAliasAdditionCount"], 20-count)
                for bad in ((original | approved) - {("gold", "approved-0")}, original | approved | {("gold", "unauthorized")}, approved):
                    database(baseline, bad)
                    with self.assertRaises(backend.PublishError):
                        backend._validate_alias_boundary(baseline, None, {"gold"})

    def test_latest_metadata_survives_old_candidate_publication(self):
        backend = batch.publisher._backend_module()
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            candidate = root / "candidate.sqlite"
            canonical = REPO / "data/source/catalog.sqlite"
            shutil.copyfile(canonical, candidate)
            with contextlib.closing(sqlite3.connect(candidate)) as db, db:
                db.execute("drop table source_book_metadata")
                db.execute("pragma user_version=1")
            before = backend._snapshot_db(candidate)
            receipt = batch.publisher.preserve_book_metadata(candidate, canonical, backend)
            after = backend._snapshot_db(candidate)
            self.assertEqual(receipt["status"], "PRESERVED")
            self.assertEqual(after["source_book_metadata"], backend._snapshot_db(canonical)["source_book_metadata"])
            self.assertEqual(before, {key: value for key, value in after.items() if key != "source_book_metadata"})
            batch.publisher.preserve_book_metadata(candidate, canonical, backend)
            self.assertEqual(after, backend._snapshot_db(candidate))

    def test_freeze_rejects_recursive_provenance_before_reading_or_copying(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            with self.assertRaisesRegex(ValueError, "outside provenance"):
                batch.freeze(root / "missing-job.json", root, root / "missing.sqlite", root / "output", provenance=root)
            self.assertFalse((root / "output").exists())

    def test_backend_resolves_moved_v4_alias_boundary_artifact(self):
        backend = batch.publisher._backend_module()
        expected = artifact_path(
            REPO / ".workspace/catalog-followup/batch001-20260902/konocomics-v5-panel-batch-001-of-008"
            / backend.ALIAS_RESOLUTION_RELATIVE
        ).resolve()
        self.assertEqual(backend._find_repo_file(backend.ALIAS_RESOLUTION_RELATIVE), expected)
        self.assertTrue(expected.is_file())
        self.assertFalse(expected.is_symlink())

    def test_structured_decisions_preserve_prior_and_require_explicit_complete_axes(self):
        wid = "work-aaaaaaaaaaaaaaaaaaaa"
        original = dict(zip(batch.panel.SEMANTIC_FIELDS, (
            wid, "axis:progression", "known", "2", "0.8", "z;a",
            "https://example.test/z;https://example.test/a", "whole_work",
            "Preserved original observation", "Preserved limitation", "accepted", "SOURCE_BOUND",
        )))
        authority = {"claims": {(wid, original["factKey"]): {batch.panel.claim_semantic_digest(original): original}},
                     "evidence": {key: {"workId": wid, "sourceUrl": "https://example.test/" + key} for key in ("a", "z")}}
        sources = {"new": (wid, "https://example.test/new"), "foreign": ("work-b", "https://example.test/other")}
        value = {"schemaVersion": "factor-adjudication-v1", "inputManifestSha256": "a" * 64, "works": [{
            "workId": wid, "retainedClaims": ["axis:progression"],
            "claims": [{"factKey": "genre:action", "state": "known", "value": "true", "confidence": "0.8", "evidenceIds": ["new"],
                        "entryScope": "whole_work", "observation": "An explicit action scene", "limitation": "Bounded source", "reasonCode": "SOURCE_BOUND"}],
            "unknownGroups": [{"axes": list(batch.panel.AXES[1:]), "evidenceIds": [], "entryScope": "whole_work",
                               "observation": "The supplied observations do not establish these axes", "limitation": "No absence inferred", "reasonCode": "INSUFFICIENT_EVIDENCE"}],
        }]}
        before = copy.deepcopy(value)
        with mock.patch.object(batch.panel, "indexes", return_value=(sources, {}, {(wid, "axis:progression"): original}, {})):
            result = batch.expand_decisions(value, Path("unused"), [{"workId": wid}], authority, "a" * 64)
            self.assertEqual(len(result), 18)
            self.assertEqual({field: result[0][field] for field in batch.panel.SEMANTIC_FIELDS}, original)
            self.assertEqual(result[1]["citationUrls"], "https://example.test/new")
            self.assertEqual({row["factKey"] for row in result if row["state"] == "unknown"}, {"axis:" + axis for axis in batch.panel.AXES[1:]})
            self.assertEqual(value, before)
            with self.assertRaisesRegex(ValueError, "exact manifest-bound original"):
                batch.expand_decisions(value, Path("unused"), [{"workId": wid}], {"claims": {}, "evidence": {}}, "a" * 64)
            compact = copy.deepcopy(value)
            compact["schemaVersion"] = "factor-adjudication-v2"
            for group in compact["works"][0]["unknownGroups"]:
                del group["evidenceIds"]
            self.assertEqual(batch.expand_decisions(compact, Path("unused"), [{"workId": wid}], authority, "a" * 64), result)
            compact["works"][0]["unknownGroups"][0]["evidenceIds"] = ["new"]
            with self.assertRaises(ValueError):
                batch.expand_decisions(compact, Path("unused"), [{"workId": wid}], authority, "a" * 64)
            for defect, error in (("missing", "17 explicit axes"), ("overlap", "overlapping decision"), ("foreign", "cross-work"), ("stale", "exact frozen input"), ("unknown-evidence", "unknown claim carries evidence")):
                bad = copy.deepcopy(value)
                if defect == "missing": bad["works"][0]["unknownGroups"][0]["axes"].pop()
                elif defect == "overlap": bad["works"][0]["unknownGroups"][0]["axes"].append("progression")
                elif defect == "foreign": bad["works"][0]["claims"][0]["evidenceIds"] = ["foreign"]
                elif defect == "stale": bad["inputManifestSha256"] = "b" * 64
                else: bad["works"][0]["unknownGroups"][0]["evidenceIds"] = ["new"]
                with self.assertRaisesRegex(ValueError, error):
                    batch.expand_decisions(bad, Path("unused"), [{"workId": wid}], authority, "a" * 64)

    def test_result_attempt_reuses_real_frozen_input_after_rejected_ledger(self):
        source = batch.ROOT / "planning/collection-flow-validation-20260914/w2-preparation"
        frozen = source / "frozen"
        lineage = batch.panel.read_json(frozen / "panel-input/external-lineage.json")
        before = {str(path.relative_to(frozen)): batch.panel.sha256(path) for path in frozen.rglob("*") if path.is_file()}
        with tempfile.TemporaryDirectory(prefix="factor-result-attempt-") as directory:
            root = Path(directory)
            failed, completed = root / "failed", root / "completed"
            with self.assertRaisesRegex(ValueError, "unknown claim carries evidence"):
                batch.seal_result(frozen, frozen / "panel-result/chunk-01/evidence-panel-ledger.csv",
                                  artifact_path(lineage["baselineRoot"]), artifact_path(lineage["registryPath"]), result_output=failed)
            failed_ledger = failed / "panel-result/chunk-01/evidence-panel-ledger.csv"
            rejected_sha = batch.panel.sha256(failed_ledger)
            self.assertFalse((failed / "PREPARATION-REPORT.json").exists())
            result = batch.seal_result(frozen, None, artifact_path(lineage["baselineRoot"]), artifact_path(lineage["registryPath"]),
                                       decisions_path=source / "decisions-v2.json", result_output=completed)
            self.assertEqual(result["stage"], "RESULT_SEALED")
            self.assertEqual(result["inputManifestSha256"], batch.panel.sha256(frozen / "panel-input/PANEL-INPUT.sha256"))
            self.assertEqual(batch.panel.sha256(failed_ledger), rejected_sha)
            self.assertEqual({str(path.relative_to(frozen)): batch.panel.sha256(path) for path in frozen.rglob("*") if path.is_file()}, before)
            with self.assertRaisesRegex(ValueError, "attempt overwrite"):
                batch.seal_result(frozen, None, artifact_path(lineage["baselineRoot"]), artifact_path(lineage["registryPath"]),
                                  decisions_path=source / "decisions-v2.json", result_output=completed)

    def test_invalid_file_argument_fails_before_storage(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(argparse.ArgumentTypeError):
                batch.input_file(directory)

    def test_new_claim_serialization_keeps_values_and_rejects_duplicates(self):
        row = {"value": "2", "observation": "explicit observation", "evidenceIds": "z;a", "citationUrls": "https://x.test/\ue000;https://x.test/\U00010000"}
        batch.canonicalize_new_claim(row)
        self.assertEqual(row, {"value": "2", "observation": "explicit observation", "evidenceIds": "a;z", "citationUrls": "https://x.test/\U00010000;https://x.test/\ue000"})
        row["evidenceIds"] = "a;a"
        with self.assertRaisesRegex(ValueError, "invalid semicolon list"):
            batch.canonicalize_new_claim(row)

    def test_multiple_research_snapshots_accumulate_originals_and_reject_conflicts(self):
        path = batch.ROOT / "planning/efficiency-triage-20260913/sol-next-candidates/jobs/510/records.json"
        job = batch.panel.read_json(path)
        original = batch.read_job(path, recovery=True)["works"][0]["research"]
        work = job["works"][0]
        source = (path.parent / work["researchRef"]["path"]).resolve()
        work["researchRef"]["path"] = str(source)
        supplement = copy.deepcopy(original)
        supplement["sources"] = [copy.deepcopy(original["sources"][0])]
        supplement["sources"][0]["url"] = "https://example.test/new-observation"
        work["sourceBindings"].append({"evidenceId": "ev-new-source", "sourceUrl": supplement["sources"][0]["url"]})
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            extra, path = root / "extra.jsonl", root / "job.json"
            batch.write_text(extra, json.dumps(supplement) + "\n")
            work["researchRefs"] = [work.pop("researchRef"), {"path": str(extra), "sha256": batch.panel.sha256(extra)}]
            batch.write_json(path, job)
            bindings = {}
            actual = batch.read_job(path, bindings, recovery=True)["works"][0]
            self.assertEqual(actual["research"]["sources"], original["sources"] + supplement["sources"])
            self.assertTrue({source.resolve(), extra.resolve()} <= bindings.keys())
            supplement["sources"][0]["url"] = original["sources"][0]["url"]
            supplement["sources"][0]["observation"] = "Conflicting replacement must not discard the original."
            batch.write_text(extra, json.dumps(supplement) + "\n")
            work["researchRefs"][1]["sha256"] = batch.panel.sha256(extra)
            batch.write_json(path, job)
            with self.assertRaisesRegex(ValueError, "conflicting observations for URL"):
                batch.read_job(path, recovery=True)

    def test_validate_only_uses_separate_retained_entry_point(self):
        with tempfile.TemporaryDirectory(prefix="retained-operator-test-") as directory:
            root = Path(directory)
            baseline = root / "baseline"; baseline.mkdir()
            request = root / "request.json"; request.write_text("{}\n", encoding="utf-8")
            output = root / "unused"
            workspace = types.SimpleNamespace(record_arguments=lambda *_args, **_kwargs: None)
            args = [
                "prepare_factor_batch.py", "restore-retained",
                "--baseline-root", str(baseline), "--output-root", str(output),
                "--retained-authority-request", str(request), "--validate-only",
            ]
            validated = {"workId": "work-aaaaaaaaaaaaaaaaaaaa"}
            stream = io.StringIO()
            with mock.patch.dict(sys.modules, {"catalog_workspace": workspace}), mock.patch.object(
                batch.publisher, "validate_retained_authority", return_value=validated
            ) as check, mock.patch.object(sys, "argv", args), contextlib.redirect_stdout(stream):
                self.assertEqual(batch.main(), 0)
            check.assert_called_once_with(
                request,
                baseline.resolve() / "catalog-expanded.candidate.sqlite",
                baseline.resolve() / "catalog-source-registry.candidate.sqlite",
            )
            result = json.loads(stream.getvalue())
            self.assertEqual(result["mode"], "retained-authority-preflight")
            self.assertFalse(result["originalAuthorityRecovered"])
            self.assertFalse(output.exists())


class SafetyPreflightRegressionTest(unittest.TestCase):
    def test_preflight_rejects_baseline_safety_id_that_masks_frozen_observation(self):
        work_id = "work-aaaaaaaaaaaaaaaaaaaa"
        context_url = "https://example.com/context"
        safety_url = "https://example.com/safety"
        safety_id = "ev-safety-collision-test"
        job = {
            "batchId": "test",
            "schemaVersion": "factor-authoring-job-v3",
            "works": [{
                "workId": work_id,
                "title": "Test work",
                "representativeIsbn": "9780000000002",
                "context": {
                    "workId": work_id,
                    "condition": "Test context",
                    "catalogRole": "discovery",
                    "evidenceIds": "ev-context-test",
                    "citationUrls": context_url,
                    "observation": "The source selected this work.",
                    "limitation": "Context only.",
                },
                "evidence": [],
                "supplementalEvidence": [],
                "safety": {
                    "claim": {
                        "workId": work_id,
                        "outcome": "SAFE",
                        "factKey": "scope:safety",
                        "state": "known",
                        "value": "in-scope-japanese-manga",
                        "decision": "accepted",
                        "reasonCode": "SAFETY_VERIFIED",
                        "evidenceIds": safety_id,
                        "citationUrls": safety_url,
                        "observation": "label=official manga catalog; title=Test work",
                        "limitation": "Catalog classification only.",
                        "candidateOnly": "true",
                        "reviewedByHuman": "false",
                    },
                    "evidence": [{
                        "evidenceId": safety_id,
                        "workId": work_id,
                        "sourceType": "publisher",
                        "sourceUrl": safety_url,
                        "classificationKind": "official-non-adult-label",
                        "audienceClassification": "non-adult",
                        "observation": "label=official manga catalog; title=Test work",
                        "limitation": "Catalog classification only.",
                        "retrievedAt": "2026-09-13",
                        "candidateOnly": "true",
                        "reviewedByHuman": "false",
                    }],
                },
            }],
        }
        stale = {
            "id": safety_id,
            "workId": work_id,
            "targetType": "work",
            "targetId": work_id,
            "sourceType": "publisher",
            "sourceUrl": safety_url,
            "notes": "The title and publisher match the work.",
        }
        facts = {
            "works": {work_id: {
                "id": work_id, "title": "Test work", "titleKana": "", "creators": "Test creator",
                "publisher": "Test publisher", "demographic": "", "status": "completed",
                "firstPublishedYear": "2026", "factorScope": "whole_work",
                "annotationReviewMethod": "unreviewed",
            }},
            "volumeRows": {work_id: [{
                "id": f"{work_id}-v1", "volumeNumber": "1", "isbn": "9780000000002",
                "releaseDate": "2026-01-01", "editionKind": "standard", "isRepresentative": "true",
                "evidenceId": "ev-volume-test",
            }]},
            "evidence": {
                "ev-context-test": {"workId": work_id, "sourceUrl": context_url, "fetchedAt": "2026-09-13"},
                safety_id: stale,
            },
        }
        registry = {"rowsByWork": {work_id: [{
            "sourceOrdinal": "1", "cohortKeys": "test", "sourceFamilies": "test",
            "identityEvidenceUrls": context_url, "supportEvidenceUrls": context_url,
        }]}}
        backend = batch.publisher._backend_module()
        with tempfile.TemporaryDirectory(prefix="safety-preflight-test-") as directory:
            baseline = Path(directory)
            (baseline / "catalog-expanded.candidate.sqlite").write_bytes(b"test")
            with mock.patch.object(batch.publisher, "_verify_result_manifest"), mock.patch.object(
                batch.publisher, "_backend_module", return_value=backend
            ), mock.patch.object(backend, "_baseline_facts", return_value=facts), mock.patch.object(
                backend, "ensure_registry", return_value=registry
            ), mock.patch.object(backend, "_validate_packet_baseline_binding"):
                with self.assertRaisesRegex(ValueError, "SAFETY_NOT_SAFE: no affirmative non-model work-owned safety evidence"):
                    batch.preflight(job, baseline, baseline / "catalog-source-registry.candidate.sqlite")


class AuthoringTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.job_path = batch.ROOT / "jobs/hina-drifters/records.json"
        cls.job = batch.read_job(cls.job_path)
        cls.baseline = batch.ROOT / "runs/factor-rescue-008-publication-20260906-v1"
        cls.registry = batch.ROOT / "registry-corrections/factor-rescue-009-v2/catalog-source-registry.candidate.sqlite"

    def read_changed(self, change):
        job = copy.deepcopy(self.job)
        change(job)
        with tempfile.TemporaryDirectory(prefix="factor-job-test-") as directory:
            path = Path(directory) / "job.json"
            batch.write_json(path, job)
            return batch.read_job(path)

    def test_cross_work_source_rejected(self):
        with self.assertRaisesRegex(ValueError, "cross-work supplementalEvidence"):
            self.read_changed(lambda j: j["works"][0]["supplementalEvidence"][0].update(workId=j["works"][1]["workId"]))

    def compact_satin_job(self):
        job = batch.panel.read_json(batch.ROOT / "jobs/satin-031/records-v3.json")
        source = batch.ROOT / "batches/factor-authoring-031-v2/panel-input/chunks/chunk-01/collector-research.jsonl"
        expected = copy.deepcopy(job)
        expected["schemaVersion"] = "factor-authoring-job-v2"
        for work in expected["works"]:
            work["registryVolumeProofs"] = []
            for evidence in work["supplementalEvidence"]:
                evidence["collectorChunk"] = "chunk-01"  # freeze already assigns this transport field
        job["schemaVersion"] = "factor-authoring-job-v3"
        for work in job["works"]:
            del work["research"]
            work["researchRef"] = {"path": str(source), "sha256": batch.panel.sha256(source)}
            work["sourceBindings"] = [{key: row[key] for key in ("evidenceId", "sourceUrl")} for row in work.pop("supplementalEvidence")]
        return job, expected, source

    def test_compact_job_freezes_same_real_observations_without_manual_projection(self):
        job, expected, source = self.compact_satin_job()
        before = batch.panel.sha256(source)
        baseline = batch.ROOT / "runs/factor-authoring-030-publication-20260907-v1"
        with tempfile.TemporaryDirectory(prefix="factor-compact-test-") as directory:
            root = Path(directory)
            path, output = root / "job.json", root / "output"
            batch.write_json(path, job)
            self.assertEqual(batch.read_job(path), expected)
            batch.freeze(path, baseline, baseline / "catalog-source-registry.candidate.sqlite", output)
            chunk = output / "panel-input/chunks/chunk-01"
            self.assertEqual(batch.panel.read_csv(chunk / "supplemental-evidence.csv", batch.panel.SUPPLEMENTAL_FIELDS), expected["works"][0]["supplementalEvidence"])
            lineage = batch.panel.read_json(output / "panel-input/external-lineage.json")
            self.assertEqual(lineage["sourceInputBindings"][str(source.resolve())], before)
            self.assertEqual(batch.read_job(output / "panel-input/authoring-job.json"), expected)
            self.assertEqual(batch.panel.sha256(source), before)

    def test_compact_job_rejects_stale_hash_foreign_source_and_duplicate_binding(self):
        job, _, _ = self.compact_satin_job()
        changes = [
            (lambda row: row["researchRef"].update(sha256="0" * 64), "reference SHA mismatch"),
            (lambda row: row["sourceBindings"][0].update(sourceUrl="https://example.test/another-work"), "resolve exactly once"),
            (lambda row: row["sourceBindings"].append(copy.deepcopy(row["sourceBindings"][0])), "duplicate source binding"),
            (lambda row: row.update(workId="work-00000000000000000000"), "TARGET_IDENTITY_MISMATCH"),
        ]
        with tempfile.TemporaryDirectory(prefix="factor-compact-invalid-") as directory:
            path = Path(directory) / "job.json"
            for change, error in changes:
                changed = copy.deepcopy(job)
                change(changed["works"][0])
                batch.write_json(path, changed)
                with self.subTest(error=error), self.assertRaisesRegex(ValueError, error):
                    batch.read_job(path)

    def test_compact_job_preserves_audit_dates_and_rejects_conflicting_legacy_dates(self):
        job, expected, _ = self.compact_satin_job()
        research = copy.deepcopy(expected["works"][0]["research"])
        for source in research["sources"]:
            source["readAudit"] = {key: source.pop(key, "") for key in ("publishedAt", "retrievedAt")}
        with tempfile.TemporaryDirectory(prefix="factor-compact-audit-") as directory:
            root = Path(directory)
            source_path, job_path = root / "research.jsonl", root / "job.json"
            batch.write_text(source_path, json.dumps(research, ensure_ascii=False) + "\n")
            job["works"][0]["researchRef"] = {"path": "research.jsonl", "sha256": batch.panel.sha256(source_path)}
            batch.write_json(job_path, job)
            actual = batch.read_job(job_path)["works"][0]
            self.assertEqual(actual["supplementalEvidence"], expected["works"][0]["supplementalEvidence"])
            research["sources"][0]["retrievedAt"] = "2000-01-01"
            batch.write_text(source_path, json.dumps(research, ensure_ascii=False) + "\n")
            job["works"][0]["researchRef"]["sha256"] = batch.panel.sha256(source_path)
            batch.write_json(job_path, job)
            with self.assertRaisesRegex(ValueError, "conflicting source and readAudit timestamps"):
                batch.read_job(job_path)

    def test_collector_numeric_candidate_rejected(self):
        with self.assertRaisesRegex(ValueError, "collector decision"):
            self.read_changed(lambda j: j["works"][0]["research"]["sources"][0].update(claimCandidates=[{"targetType": "axis", "targetId": "strategy", "anchor": "x", "value": 4}]))

    def test_cross_work_safety_rejected(self):
        with self.assertRaisesRegex(ValueError, "missing affirmative safety"):
            self.read_changed(lambda j: j["works"][0]["safety"]["evidence"][0].update(workId=j["works"][1]["workId"]))

    def test_recovery_job_requires_fresh_claims_and_explicit_valid_safety_hold(self):
        job = copy.deepcopy(self.job)
        for work in job["works"]:
            work["priorClaims"] = []
            work["priorDecisions"] = []
            work["evidence"] = [row for row in work["evidence"] if row["targetType"] not in {"axis", "factor", "genre", "theme"}]
        claim = job["works"][0]["safety"]["claim"]
        claim.update(outcome="BLOCKED_SAFETY", state="unknown", value="", decision="blocked",
                     evidenceIds="", citationUrls="", reasonCode=sorted(batch.safety_validator().BLOCK_REASONS)[0])
        job["works"][0]["safety"]["evidence"] = []
        with tempfile.TemporaryDirectory(prefix="factor-recovery-job-test-") as directory:
            path = Path(directory) / "job.json"
            batch.write_json(path, job)
            with self.assertRaisesRegex(ValueError, "missing affirmative safety"):
                batch.read_job(path)
            loaded = batch.read_job(path, recovery=True)
            self.assertEqual(batch.validated_safety(loaded)[job["works"][0]["workId"]]["outcome"], "BLOCKED_SAFETY")
            claim["outcome"] = "SAFE"
            batch.write_json(path, job)
            with self.assertRaisesRegex(ValueError, "missing affirmative safety"):
                batch.read_job(path, recovery=True)
            prior_job = batch.read_job(batch.ROOT / "jobs/continuation-237-a/records.json")
            batch.write_json(path, prior_job)
            with self.assertRaisesRegex(ValueError, "fresh full adjudication"):
                batch.read_job(path, recovery=True)

    def test_actual_recovery_epoch_declaration_is_bound_before_any_numeric_result(self):
        import factor_recovery
        baseline = batch.ROOT / "runs/factor-003-recovery-epoch-20260909-v1"
        epoch = baseline / "recovery-epoch.json"
        wid = "work-7090c81c142fd31e591a"
        declaration = factor_recovery.build_declaration(epoch, baseline / "catalog-expanded.candidate.sqlite", {wid})
        with tempfile.TemporaryDirectory(prefix="factor-recovery-binding-test-") as directory:
            root = Path(directory)
            chunk = root / "chunks/chunk-01"
            batch.write_json(root / "external-lineage.json", {"baselineRoot": str(baseline.resolve())})
            batch.write_csv(chunk / "targets.csv", ("workId",), [{"workId": wid}])
            batch.write_json(chunk / "recovery-declaration.json", declaration)
            batch.manifest(chunk, "CHUNK.sha256")
            batch.manifest(root, "PANEL-INPUT.sha256")
            context = factor_recovery.validate_input_context(root, work_ids={wid})
            self.assertEqual(set(context["recovery"]), {wid})
            self.assertEqual(context["claims"], {})
            self.assertEqual(context["evidence"], {})
            old = {field: "" for field in batch.panel.ORIGINAL_EVIDENCE_FIELDS}
            old.update(workId=wid, id="old-materialized-answer", targetType="axis", targetId="pacing", sourceType="manual", notes="resolvedValue=2")
            batch.write_csv(chunk / "packets" / wid / "evidence.csv", batch.panel.ORIGINAL_EVIDENCE_FIELDS, [old])
            batch.manifest(chunk, "CHUNK.sha256")
            batch.manifest(root, "PANEL-INPUT.sha256")
            with self.assertRaisesRegex(ValueError, "materialized fact authority"):
                batch.panel.recovery_safety_blockers(root, {wid})
            before = batch.panel.sha256(chunk / "CHUNK.sha256")
            declaration["targets"][0]["baselineSemanticSha256"] = "0" * 64
            batch.write_json(chunk / "recovery-declaration.json", declaration)
            with self.assertRaisesRegex(ValueError, "not manifest-bound"):
                factor_recovery.validate_input_context(root, work_ids={wid})
            batch.manifest(chunk, "CHUNK.sha256")
            self.assertNotEqual(before, batch.panel.sha256(chunk / "CHUNK.sha256"))

    def test_historical_recovery_scope_and_live_publication_identity_are_distinct(self):
        import factor_recovery
        baseline = batch.ROOT / "runs/recovery-factor-263-publication-20260909-v1"
        epoch = factor_recovery.load_epoch(batch.ROOT / "runs/factor-003-recovery-epoch-20260909-v1/recovery-epoch.json")
        self.assertEqual(batch.panel.sha256(artifact_path(epoch["originalCanonicalPath"])), epoch["canonicalSha256"])
        self.assertEqual(epoch["scope"]["work-7090c81c142fd31e591a"]["classification"], "authority-unresolved")
        database = baseline / "catalog-expanded.candidate.sqlite"
        registry = baseline / "catalog-source-registry.candidate.sqlite"
        metadata = {
            "baselineCandidateSha256": batch.panel.sha256(database),
            "registrySha256": batch.panel.sha256(registry),
            "canonicalSha256": batch.panel.sha256(batch.REPO / "data/source/catalog.sqlite"),
            "goldManifestSha256": batch.panel.sha256(batch.REPO / "data/staging/catalog-expansion/gold-set-manifest.json"),
        }
        with tempfile.TemporaryDirectory(prefix="factor-recovery-current-identity-") as directory:
            root = Path(directory)
            batch.write_json(root / "panel-input.json", metadata)
            self.assertIsNone(batch.publisher._verify_input_identities(root, database, registry, batch.REPO))
            metadata["canonicalSha256"] = "0" * 64
            batch.write_json(root / "panel-input.json", metadata)
            with self.assertRaisesRegex(ValueError, "panel input identity mismatch: canonicalSha256"):
                batch.publisher._verify_input_identities(root, database, registry, batch.REPO)

    def test_actual_recovery_epoch_rejects_authority_and_target_tampering(self):
        import factor_recovery
        baseline = batch.ROOT / "runs/factor-003-recovery-epoch-20260909-v1"
        epoch_path = baseline / "recovery-epoch.json"
        epoch = batch.panel.read_json(epoch_path)
        scope = factor_recovery.load_epoch(epoch_path)["scope"]
        wid = "work-7090c81c142fd31e591a"
        original = factor_recovery.build_declaration(epoch_path, baseline / "catalog-expanded.candidate.sqlite", {wid})
        protected = [next(key for key, row in scope.items() if row["classification"] == kind)
                     for kind in ("protected-gold", "protected-legacy")]
        with tempfile.TemporaryDirectory(prefix="factor-recovery-authority-test-") as directory:
            temporary = Path(directory)
            root = temporary / "input"
            chunk = root / "chunks/chunk-01"
            copied_epoch = temporary / "recovery-epoch.json"
            batch.write_json(root / "external-lineage.json", {"baselineRoot": str(baseline.resolve())})

            def bind(changed_epoch, target=wid, before=None):
                batch.write_json(copied_epoch, changed_epoch)
                declaration = copy.deepcopy(original)
                declaration.update(epochPath=str(copied_epoch), epochSha256=batch.panel.sha256(copied_epoch))
                declaration["targets"][0].update(workId=target)
                if before is not None:
                    declaration["targets"][0]["baselineSemanticSha256"] = before
                batch.write_csv(chunk / "targets.csv", ("workId",), [{"workId": target}])
                batch.write_json(chunk / "recovery-declaration.json", declaration)
                batch.manifest(chunk, "CHUNK.sha256")
                batch.manifest(root, "PANEL-INPUT.sha256")

            for field, value, message in (
                ("approval", "NOT_APPROVED", "epoch/approval"),
                ("policySha256", "0" * 64, "policy binding mismatch"),
            ):
                with self.subTest(field=field):
                    bind({**epoch, field: value})
                    with self.assertRaisesRegex(ValueError, message):
                        factor_recovery.validate_input_context(root, work_ids={wid})
            for target in [*protected, "work-00000000000000000000"]:
                with self.subTest(target=target):
                    bind(epoch, target=target)
                    with self.assertRaisesRegex(ValueError, "protected or out-of-scope"):
                        factor_recovery.validate_input_context(root, work_ids={target})
            bind(epoch, before="0" * 64)
            with self.assertRaisesRegex(ValueError, "frozen/current target mismatch"):
                factor_recovery.validate_input_context(root, work_ids={wid})

    def test_exact_target_guard_before_freeze(self):
        for field, value, message in (("title", "Different book", "title"), ("representativeIsbn", "9780000000000", "ISBN")):
            with self.subTest(field=field):
                job = copy.deepcopy(self.job)
                job["works"][0][field] = value
                with self.assertRaisesRegex(ValueError, "TARGET_IDENTITY_MISMATCH.*" + message):
                    batch.preflight(job, self.baseline, self.registry)

    def test_bad_bibliography_rejected_before_freeze(self):
        with self.assertRaisesRegex(ValueError, "bibliography|volumeNumber|editionKind|representative"):
            batch.preflight(self.job, self.baseline, self.baseline / "catalog-source-registry.candidate.sqlite")

    def test_full_safety_contract_before_freeze(self):
        job = copy.deepcopy(self.job)
        job["works"][0]["safety"]["evidence"][0]["observation"] = "A title match without affirmative classification."
        with self.assertRaisesRegex(ValueError, "selection/category observation missing"):
            batch.preflight(job, self.baseline, self.registry)

    def test_all_context_urls_must_be_packet_supported_before_freeze(self):
        job = copy.deepcopy(self.job)
        context = job["works"][0]["context"]
        urls = batch.panel.split_list(context["citationUrls"], "context citationUrls")
        context["citationUrls"] = ";".join(sorted([*urls, "https://example.com/unfrozen-context"], key=batch.panel.code_unit_key))
        with tempfile.TemporaryDirectory(prefix="factor-context-test-") as directory:
            root = Path(directory)
            path, output = root / "job.json", root / "output"
            batch.write_json(path, job)
            with self.assertRaisesRegex(ValueError, "context citation URL exceeds frozen packet supportEvidenceUrls"):
                batch.freeze(path, self.baseline, self.registry, output)
            self.assertFalse(output.exists())

    def test_actual_141_context_source_fails_early_and_all_publisher_routes_resolve(self):
        root = batch.ROOT
        job_root = root / "jobs/sol-preparation-141-e"
        baseline = root / "runs/sol-kamui-san-factor-143-publication-20260909-v1"
        registry = root / "corrections/hikari-tomoni-registry-141-v2/catalog-source-registry.candidate.sqlite"
        missing = batch.read_job(job_root / "records.json")
        work_id = missing["works"][0]["workId"]
        evidence_id = missing["works"][0]["context"]["evidenceIds"]
        with tempfile.TemporaryDirectory(prefix="factor-context-source-test-") as directory:
            output = Path(directory) / "output"
            with self.assertRaisesRegex(ValueError, f"missing or cross-work context evidence: {work_id} {evidence_id}"):
                batch.freeze(job_root / "records.json", baseline, registry, output)
            self.assertFalse(output.exists())

        corrected = batch.read_job(job_root / "records-v2.json")
        packets, facts, _ = batch.preflight(corrected, baseline, registry)
        work = corrected["works"][0]
        frozen_source = next(source for source in work["evidence"] if source["id"] == evidence_id)
        self.assertEqual(packets[work_id]["contextEvidenceId"], evidence_id)

        for route in ("original", "frozen", "supplemental"):
            with self.subTest(route=route):
                routed_job = copy.deepcopy(corrected)
                routed_facts = copy.deepcopy(facts)
                routed_work = routed_job["works"][0]
                routed_work["evidence"] = [source for source in routed_work["evidence"] if source["id"] != evidence_id]
                routed_work["supplementalEvidence"] = [source for source in routed_work["supplementalEvidence"] if source["evidenceId"] != evidence_id]
                routed_facts["evidence"].pop(evidence_id, None)
                if route == "original":
                    routed_facts["evidence"][evidence_id] = copy.deepcopy(frozen_source)
                elif route == "frozen":
                    routed_work["evidence"].append(copy.deepcopy(frozen_source))
                else:
                    supplemental_source = copy.deepcopy(routed_work["supplementalEvidence"][0])
                    supplemental_source.update(evidenceId=evidence_id, workId=work_id, targetId=work_id, sourceUrl=frozen_source["sourceUrl"])
                    routed_work["supplementalEvidence"].append(supplemental_source)
                batch.validate_context_evidence(routed_job, routed_facts, packets)

        cross_work = copy.deepcopy(corrected)
        source = next(source for source in cross_work["works"][0]["evidence"] if source["id"] == evidence_id)
        source["workId"] = "work-00000000000000000000"
        with self.assertRaisesRegex(ValueError, "missing or cross-work context evidence"):
            batch.validate_context_evidence(cross_work, facts, packets)

        missing_timestamp = copy.deepcopy(corrected)
        source = next(source for source in missing_timestamp["works"][0]["evidence"] if source["id"] == evidence_id)
        source["fetchedAt"] = ""
        with self.assertRaisesRegex(ValueError, f"missing timestamp for {evidence_id}"):
            batch.validate_context_evidence(missing_timestamp, facts, packets)

    def test_existing_output_never_overwritten(self):
        with tempfile.TemporaryDirectory(prefix="factor-output-test-") as directory:
            with self.assertRaisesRegex(ValueError, "refusing overwrite"):
                batch.freeze(self.job_path, self.baseline, self.registry, Path(directory))

    def test_v2_volume_proof_uses_existing_frozen_packet_transport(self):
        _, _, registry = batch.preflight(self.job, self.baseline, self.registry)
        job = copy.deepcopy(self.job)
        job['schemaVersion'] = 'factor-authoring-job-v2'
        for work in job['works']:
            work['registryVolumeProofs'] = []
        work = job['works'][0]
        row = registry['rowsByWork'][work['workId']][0]
        proof = {'sourceRowId': row['sourceRowId'], 'workId': work['workId'], 'title': row['canonicalTitleJa'], 'creators': row['canonicalCreatorsJa'], 'isbn': row['representativeIsbn'], 'volumeNumber': row['volumeNumber'], 'editionKind': row['editionKind'], 'evidenceUrl': row['bibliographyEvidenceUrls'].split(' | ')[0], 'retrievedAt': '2026-09-07', 'observation': 'Test-only explicit bibliography projection; no live source attestation.'}
        work['registryVolumeProofs'] = [proof]
        with tempfile.TemporaryDirectory(prefix='factor-volume-proof-test-') as directory:
            root = Path(directory)
            path = root / 'job.json'
            batch.write_json(path, job)
            loaded = batch.read_job(path)
            packets, facts, checked_registry = batch.preflight(loaded, self.baseline, self.registry)
            self.assertEqual(packets[work['workId']]['registryVolumeProofs'], [proof])
            output = root / 'output'
            batch.freeze(path, self.baseline, self.registry, output)
            input_root = output / 'panel-input'
            packet_path = input_root / 'chunks/chunk-01/packets' / work['workId'] / 'packet.json'
            frozen = batch.panel.read_json(packet_path)
            self.assertEqual(frozen['registryVolumeProofs'], [proof])
            # The same shared publication/rebase validator consumes frozen proof.
            batch.publisher._backend_module()._validate_packet_baseline_binding({work['workId']: frozen}, facts, checked_registry)
            frozen['registryVolumeProofs'][0]['observation'] = 'Tampered after freeze'
            packet_path.write_text(json.dumps(frozen), encoding='utf-8')
            with self.assertRaises(ValueError):
                batch.publisher.validate_input(input_root)

    def test_v2_job_rejects_foreign_or_malformed_volume_proof(self):
        def change(job):
            job['schemaVersion'] = 'factor-authoring-job-v2'
            for work in job['works']:
                work['registryVolumeProofs'] = []
            job['works'][0]['registryVolumeProofs'] = [{'workId': 'foreign'}]
        with self.assertRaisesRegex(ValueError, 'proof fields'):
            self.read_changed(change)

    def test_safety_only_contains_actual_pass_subset(self):
        input_root = batch.ROOT / "batches/factor-authoring-019-v1/panel-input"
        targets = batch.panel.read_csv(input_root / "chunks/chunk-01/targets.csv", batch.panel.TARGET_FIELDS)
        passed = {targets[0]["workId"]}
        with tempfile.TemporaryDirectory(prefix="factor-safety-test-") as directory:
            root = Path(directory) / "safety"
            batch.materialize_safety(self.job, targets, passed, root)
            validator = batch.safety_validator()
            validator.EXPECTED_TARGET_COUNT = 1
            validator.TARGETS_SHA256 = batch.panel.sha256(root / "targets.csv")
            self.assertEqual(validator.validate(root)["safeCount"], 1)
            self.assertEqual({r["workId"] for r in batch.panel.read_csv(root / "targets.csv", batch.publisher.SAFETY_TARGET_FIELDS)}, passed)

    def test_external_prior_authority_preserves_actual_claims(self):
        source = batch.ROOT / "runs/factor-authoring-019-publication-20260906-v1"
        with tempfile.TemporaryDirectory(prefix="factor-lineage-test-") as directory:
            root = Path(directory)
            batch.write_json(root / "external-prior-authority.json", {"schemaVersion": "factor-external-prior-authority-v1", "bundles": [{"root": str(source.resolve()), "manifestSha256": batch.panel.sha256(source / "MANIFEST.sha256")}]})
            authority = batch.panel.load_prior_authority(root)
            self.assertEqual(len(authority["claims"]), 29)
            self.assertEqual({key[0] for key in authority["claims"]}, {w["workId"] for w in self.job["works"]})
            self.assertFalse((root / "baseline").exists())

    def test_external_prior_authority_digest_cannot_drift(self):
        with tempfile.TemporaryDirectory(prefix="factor-lineage-test-") as directory:
            root = Path(directory)
            batch.write_json(root / "external-prior-authority.json", {"schemaVersion": "factor-external-prior-authority-v1", "bundles": [{"root": str(self.baseline.resolve()), "manifestSha256": "0" * 64}]})
            with self.assertRaisesRegex(ValueError, "manifest binding mismatch"):
                batch.panel.load_prior_authority(root)


if __name__ == "__main__":
    unittest.main()
