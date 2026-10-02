"""Runner recovery uses exact saved bytes and one explicitly selected Work."""
from contextlib import closing
import json
import os
from pathlib import Path
import sqlite3
import tempfile
import unittest

import catalog_recovery as recovery
import catalog_retention as retention
from catalog_revision_store import RevisionWorkspace
from catalog_workspace import digest


def encoded(value):
    return (json.dumps(value, ensure_ascii=False) + "\n").encode()


def manifest(members):
    return "".join(f"{digest(body)}  {name}\n" for name, body in sorted(members.items())).encode()


class RunnerRecoveryTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.repo = Path(self.directory.name)
        self.store = RevisionWorkspace.create(self.repo, self.repo / retention.BASE / "workspace.sqlite")
        self.wid = "work-aaaaaaaaaaaaaaaaaaaa"
        self.run = retention.CONTINUATION + "/planning/requested/run"
        self.basis = retention.BASE + "/retained/basis"
        self.research = ".workspace/runner-input/research.jsonl"
        self.job_path = ".workspace/runner-input/job.json"
        with closing(sqlite3.connect(":memory:")) as db:
            db.execute("CREATE TABLE fixture(value TEXT)")
            db.execute("INSERT INTO fixture VALUES ('current pair')")
            self.sqlite = db.serialize()
        curation = self.store.put_revision("curation", self.wid, {
            "schemaVersion": "curation-baseline-v1", "workId": self.wid,
            "tables": {"source_works": [{"annotationReviewReference": "reviews/selected.md"}]}})
        anchor = self.store.put_revision("active", "runner-test-basis", {"works": {self.wid: curation}})
        pair = {"catalog-expanded.candidate.sqlite": self.sqlite,
                "catalog-source-registry.candidate.sqlite": self.sqlite,
                "data/source/reviews/selected.md": b"Selected Work review",
                "data/source/reviews/unrelated.md": b"Unrelated Work review"}
        self.basis_manifest = manifest(pair)
        state_name = retention.CONTINUATION + "/STATE.json"
        state = {"latestCandidate": {
            "root": os.path.relpath(self.repo / self.basis, self.repo / retention.CONTINUATION).replace("\\", "/"),
            "manifestSha256": digest(self.basis_manifest)}, "publicationBatches": {}}
        self.artifacts = {self.basis + "/" + name: body for name, body in pair.items()}
        self.artifacts.update({self.basis + "/CURATION-BASELINE.json": encoded({"revision": anchor}),
                              self.basis + "/MANIFEST.sha256": self.basis_manifest,
                              state_name: encoded(state), "data/source/catalog.sqlite": self.sqlite,
                              "data/staging/catalog-expansion/gold-set-manifest.json": encoded({"workIds": []})})
        self.store.save_bytes(self.artifacts, "runner recovery controls")
        self.controls = {name: digest(body) for name, body in self.artifacts.items()}
        self.payload = {"schemaVersion": "catalog-current-recovery-controls-v1",
                        "statePath": state_name, "stateSha256": self.controls[state_name],
                        "canonicalSha256": digest(self.sqlite),
                        "currentCanonical": {"members": {"data/source/catalog.sqlite": digest(self.sqlite)}}}

    def save(self, values):
        self.store.save_bytes(values, "runner recovery input")

    def start(self):
        self.store.put_revision("active", "current-recovery-controls", self.payload, self.controls)
        (self.repo / ".catalog-restore.json").write_bytes(encoded({
            "schemaVersion": "catalog-restored-workspace-v1", "materialization": "on-demand",
            "generation": self.store._generation, "originalRepositories": [str(self.repo)]}))

    def request(self, **values):
        self.start()
        return recovery.prepare_restored_operation(self.repo, {
            "operation": "runner", "action": "prepare", "runRoot": self.run,
            "inputPaths": [], "researchPaths": [], **values})

    def job(self, *, refs=()):
        return {"schemaVersion": "factor-authoring-job-v4", "works": [{
            "workId": self.wid, "researchRefs": list(refs)}]}

    def frozen(self, *, registry_path=None, source_bindings=None):
        old_canonical = b"Historical canonical bytes remain evidence only"
        self.save({"data/source/catalog.sqlite": old_canonical})
        registry_path = registry_path or self.repo / self.basis / "catalog-source-registry.candidate.sqlite"
        frozen = self.run + "/frozen/panel-input"
        inputs = {"authoring-job.json": encoded(self.job()),
                  "panel-input.json": encoded({"registrySha256": digest(self.sqlite)}),
                  "external-lineage.json": encoded({"baselineRoot": str(self.repo / self.basis),
                      "baselineManifestSha256": digest(self.basis_manifest),
                      "registryPath": str(registry_path),
                      "sourceInputBindings": {str(self.repo / "data/source/catalog.sqlite"): digest(old_canonical),
                                              **(source_bindings or {})}}),
                  "prior-authority.json": encoded({"bundles": []})}
        frozen_manifest = manifest(inputs)
        values = {frozen + "/" + name: body for name, body in inputs.items()}
        values.update({frozen + "/PANEL-INPUT.sha256": frozen_manifest,
                       self.run + "/frozen/INPUT-PREPARATION-REPORT.json": encoded({"inputManifestSha256": digest(frozen_manifest)}),
                       self.run + "/job.json": encoded(self.job(refs=[{"path": "missing-original-research.jsonl", "sha256": "f" * 64}])),
                       self.run + "/RUN.json": encoded({"frozenDirectory": "frozen", "baselineRoot": str(self.repo / self.basis),
                           "registryPath": str(registry_path),
                           "provenanceBindings": [{"root": str(self.repo / ".workspace/absent-history"), "files": {"old.raw": "e" * 64}}],
                           "priorBundleBindings": []}),
                       self.run + "/model-001/MODEL.json": encoded({"status": "RUNNING"})})
        self.save(values)
        return old_canonical, frozen, frozen_manifest

    def shared_support_correction(self):
        """Preserve the existing correction transport in the temporary workspace DB."""
        source_root = ".workspace/shared-support-input"
        correction_root = ".workspace/shared-support-correction"
        values, works = {}, []
        for wid in (self.wid, "work-bbbbbbbbbbbbbbbbbbbb"):
            folder = source_root + "/" + wid
            url = "https://example.test/selection/" + wid
            raw = ("Official selection for " + wid + "\n").encode()
            research = encoded({"workId": wid, "sources": [{"url": url, "workOwned": True}]})
            values.update({
                folder + "/research.jsonl": research,
                folder + "/collection-session.json": encoded({"workId": wid}),
                folder + "/capture-selection.body": raw,
                folder + "/capture-selection.json": encoded({
                    "kind": "http-body", "url": url, "resolvedUrl": url, "status": 200,
                    "complete": True, "rawPath": "capture-selection.body", "sha256": digest(raw), "bytes": len(raw)}),
            })
            works.append({"workId": wid, "researchRefs": [{
                "path": wid + "/research.jsonl", "sha256": digest(research)}]})
        original_job = source_root + "/job.json"
        values[original_job] = encoded({"schemaVersion": "factor-authoring-job-v4", "works": works})
        members = {
            "build_registry_correction.py": b"# Preserved correction builder\n",
            "preflight_registry_correction.py": b"# Preserved correction verifier\n",
            "catalog-source-registry.candidate.sqlite": self.sqlite,
            "source-registry.csv": b"sourceRowId,canonicalWorkId\n",
            "preflight-report.json": encoded({}),
            "correction-ledger.json": encoded({
                "request": {"schemaVersion": "factor-registry-correction-request-v5",
                            "jobSha256": digest(values[original_job])},
                "jobPath": str(self.repo / original_job), "correctedRegistrySha256": digest(self.sqlite),
                "sourceInputBindings": {str(self.repo / name): digest(body) for name, body in values.items()},
            }),
        }
        members["MANIFEST.sha256"] = manifest(members)
        values.update({correction_root + "/" + name: body for name, body in members.items()})
        self.save(values)
        return correction_root + "/catalog-source-registry.candidate.sqlite", values

    def test_new_run_restores_job_relative_research_and_exact_sidecars_only(self):
        research = encoded({"workId": self.wid, "sources": []})
        handoff, events = encoded({"researchSha256": digest(research)}), b"Original completion event\n"
        job = self.job(refs=[{"path": "research.jsonl", "sha256": digest(research),
                            "handoffSha256": digest(handoff), "collectionReceiptSha256": digest(events)}])
        self.save({self.job_path: encoded(job), self.research: research,
                   ".workspace/runner-input/COLLECTION-HANDOFF.json": handoff,
                   ".workspace/runner-input/collection-events.jsonl": events,
                   retention.CONTINUATION + "/planning/unrelated/run/RUN.json": encoded({"other": True})})
        result = self.request(jobPath=self.job_path, inputPaths=[self.job_path])
        self.assertEqual(result["status"], "MATERIALIZED")
        self.assertEqual((self.repo / self.research).read_bytes(), research)
        self.assertEqual((self.repo / ".workspace/runner-input/COLLECTION-HANDOFF.json").read_bytes(), handoff)
        self.assertFalse((self.repo / self.run).exists())
        self.assertFalse((self.repo / retention.CONTINUATION / "planning/unrelated").exists())
        self.assertTrue((self.repo / self.basis / "data/source/reviews/selected.md").is_file())
        self.assertFalse((self.repo / self.basis / "data/source/reviews/unrelated.md").exists())

    def test_missing_bound_sidecar_blocks_without_materializing_a_partial_operation(self):
        research = encoded({"workId": self.wid})
        self.save({self.job_path: encoded(self.job(refs=[{"path": "research.jsonl", "sha256": digest(research),
                                                       "handoffSha256": "d" * 64}])), self.research: research})
        with self.assertRaisesRegex(ValueError, "unpreserved"):
            self.request(jobPath=self.job_path)
        self.assertFalse((self.repo / self.research).exists())

    def test_frozen_prepare_preserves_attempt_and_never_requires_old_live_research(self):
        _, frozen, frozen_manifest = self.frozen()
        self.request()
        self.assertEqual((self.repo / frozen / "PANEL-INPUT.sha256").read_bytes(), frozen_manifest)
        self.assertEqual(json.loads((self.repo / self.run / "model-001/MODEL.json").read_bytes())["status"], "RUNNING")
        self.assertFalse((self.repo / ".workspace/absent-history").exists())
        self.assertFalse((self.repo / self.run / "missing-original-research.jsonl").exists())

    def test_frozen_check_keeps_old_canonical_version_without_replacing_current(self):
        old, frozen, frozen_manifest = self.frozen()
        decisions = ".workspace/selected-decisions.json"
        self.save({decisions: encoded({"workId": self.wid, "disposition": "hold"})})
        self.request(action="check", decisionsPath=decisions, inputPaths=[decisions])
        self.assertEqual((self.repo / "data/source/catalog.sqlite").read_bytes(), self.sqlite)
        self.assertEqual((self.repo / retention.BASE / "restored-versions" / digest(old)).read_bytes(), old)
        self.assertEqual((self.repo / frozen / "PANEL-INPUT.sha256").read_bytes(), frozen_manifest)
        self.assertFalse((self.repo / self.run / "CHECKED.json").exists())

    def test_frozen_single_work_restores_shared_support_proof_without_reassigning_other_work(self):
        registry, proof = self.shared_support_correction()
        _, frozen, frozen_manifest = self.frozen(
            registry_path=self.repo / registry,
            source_bindings={str(self.repo / name): digest(body) for name, body in proof.items()})
        unrelated = ".workspace/shared-support-input/unbound.body"
        other_run = retention.CONTINUATION + "/planning/unrelated/run/RUN.json"
        self.save({unrelated: b"Unbound source", other_run: encoded({"workId": "work-bbbbbbbbbbbbbbbbbbbb"})})

        result = self.request(action="check", workId=self.wid)

        self.assertEqual(result["status"], "MATERIALIZED")
        for name, body in proof.items():
            self.assertEqual((self.repo / name).read_bytes(), body, name)
        assigned = json.loads((self.repo / self.run / "job.json").read_bytes())
        self.assertEqual([work["workId"] for work in assigned["works"]], [self.wid])
        self.assertEqual((self.repo / frozen / "PANEL-INPUT.sha256").read_bytes(), frozen_manifest)
        self.assertFalse((self.repo / unrelated).exists())
        self.assertFalse((self.repo / other_run).exists())
        self.assertFalse((self.repo / self.run / "CHECKED.json").exists())

    def test_frozen_support_correction_rejects_a_different_live_manifest_sha(self):
        registry, proof = self.shared_support_correction()
        self.frozen(registry_path=self.repo / registry,
                    source_bindings={str(self.repo / name): digest(body) for name, body in proof.items()})
        manifest_name = str(Path(registry).parent / "MANIFEST.sha256").replace("\\", "/")
        # Preserve both valid serializations: only the original SHA was frozen.
        changed = b"\n".join(reversed(proof[manifest_name].splitlines())) + b"\n"
        self.assertNotEqual(digest(changed), digest(proof[manifest_name]))
        self.save({manifest_name: changed})
        live_manifest = self.repo / manifest_name
        live_manifest.parent.mkdir(parents=True)
        live_manifest.write_bytes(changed)

        with self.assertRaisesRegex(ValueError, "Requested recovery would overwrite different bytes: .*MANIFEST"):
            self.request(action="check", workId=self.wid)

        self.assertEqual(live_manifest.read_bytes(), changed)
        self.assertFalse((self.repo / self.run).exists())
        self.assertFalse((self.repo / ".workspace/shared-support-input").exists())

    def test_unfinished_ready_batch_keeps_frozen_canonical_separate_from_current(self):
        old, frozen, frozen_manifest = self.frozen()
        decisions = self.run + "/selected-decisions.json"
        decision_body = encoded({"workId": self.wid, "disposition": "adjudicated"})
        sealed = self.run + "/result-001"
        result_body = encoded({"workId": self.wid})
        result_manifest = manifest({"panel-result/chunk-01/result.json": result_body})
        checked_name = self.run + "/CHECKED.json"
        checked = {"status": "READY_FOR_PUBLICATION", "workId": self.wid,
                   "inputManifestSha256": digest(frozen_manifest), "decisionsSha256": digest(decision_body),
                   "sealedRoot": str(self.repo / sealed), "resultManifestSha256": digest(result_manifest)}
        checked_body = encoded(checked)
        summary_name = retention.CONTINUATION + "/planning/requested/BATCH-SUMMARY.json"
        summary = {"works": [{"workId": self.wid, "status": "READY_FOR_PUBLICATION",
                              "checkedPath": str(self.repo / checked_name), "checkedSha256": digest(checked_body)}]}
        self.save({decisions: decision_body, checked_name: checked_body, summary_name: encoded(summary),
                   sealed + "/MANIFEST.sha256": result_manifest,
                   sealed + "/panel-result/chunk-01/result.json": result_body,
                   self.run + "/RUN.json": encoded({"frozenDirectory": "frozen",
                       "baselineRoot": str(self.repo / self.basis),
                       "registryPath": str(self.repo / self.basis / "catalog-source-registry.candidate.sqlite"),
                       "decisionsPath": str(self.repo / decisions), "decisionsSha256": digest(decision_body),
                       "priorBundleBindings": [], "provenanceBindings": []})})
        self.start()
        result = recovery.prepare_restored_operation(self.repo, {
            "operation": "batch", "summaryPath": summary_name, "applyCanonical": False})
        self.assertEqual(result["status"], "MATERIALIZED")
        self.assertEqual((self.repo / "data/source/catalog.sqlite").read_bytes(), self.sqlite)
        self.assertEqual((self.repo / retention.BASE / "restored-versions" / digest(old)).read_bytes(), old)
        self.assertEqual((self.repo / frozen / "PANEL-INPUT.sha256").read_bytes(), frozen_manifest)
        self.assertEqual((self.repo / checked_name).read_bytes(), checked_body)
        self.assertFalse((self.repo / self.run / "FINISHED.json").exists())

    def test_incomplete_run_restores_declared_provenance_without_sibling_files(self):
        research = encoded({"workId": self.wid, "sources": []})
        original = ".workspace/selected-provenance/raw.txt"
        self.save({self.research: research, original: b"Original source",
                   ".workspace/selected-provenance/unrelated.txt": b"Unrelated source",
                   self.run + "/job.json": encoded(self.job(refs=[{"path": str(self.repo / self.research), "sha256": digest(research)}])),
                   self.run + "/RUN.json": encoded({"baselineRoot": str(self.repo / self.basis),
                       "registryPath": str(self.repo / self.basis / "catalog-source-registry.candidate.sqlite"),
                       "registryPathSha256": digest(self.sqlite), "priorBundleBindings": [],
                       "provenanceBindings": [{"root": str(self.repo / ".workspace/selected-provenance"),
                                               "files": {"raw.txt": digest(b"Original source")}}]})})
        self.request()
        self.assertEqual((self.repo / original).read_bytes(), b"Original source")
        self.assertFalse((self.repo / ".workspace/selected-provenance/unrelated.txt").exists())

    def test_pending_canonical_marker_still_blocks_existing_writer_guard(self):
        from catalog_authoring_locks import assert_no_pending
        pending = retention.BASE + "/locks/publication.pending.json"
        body = encoded({"preparedPath": str(self.repo / ".workspace/pending/prepared.json"),
                        "preparedSha256": "f" * 64})
        self.save({pending: body, self.job_path: encoded(self.job())})
        self.controls[pending] = digest(body)
        self.request(jobPath=self.job_path)
        with self.assertRaisesRegex(ValueError, "pending canonical publication"):
            assert_no_pending(self.repo)
        self.assertEqual((self.repo / pending).read_bytes(), body)

    def test_declared_prior_chain_follows_exact_manifests_without_unrelated_lineage(self):
        self.frozen()
        expected = None
        for name in ("c", "b", "a"):
            root = ".workspace/runner-prior/" + name
            values = {"evidence.txt": name.encode()}
            if expected is not None:
                values["external-prior-authority.json"] = encoded({"bundles": [expected]})
            values["external-lineage.json"] = encoded({"baselineRoot": str(self.repo / ".workspace/unrelated-history")})
            body = manifest(values)
            self.save({root + "/" + key: value for key, value in {**values, "MANIFEST.sha256": body}.items()})
            expected = {"root": str(self.repo / root), "manifestSha256": digest(body)}
        self.save({self.run + "/RUN.json": encoded({"frozenDirectory": "frozen", "priorBundleBindings": [expected]})})
        self.request()
        for name in ("a", "b", "c"):
            self.assertEqual((self.repo / ".workspace/runner-prior" / name / "evidence.txt").read_bytes(), name.encode())
        self.assertFalse((self.repo / ".workspace/unrelated-history").exists())

    def test_explicit_user_source_root_selects_only_requested_work(self):
        lead = ".workspace/user-sources/" + self.wid + ".json"
        other = ".workspace/user-sources/work-bbbbbbbbbbbbbbbbbbbb.json"
        self.save({self.job_path: encoded(self.job()), lead: encoded({"workId": self.wid}),
                   other: encoded({"workId": "work-bbbbbbbbbbbbbbbbbbbb"})})
        self.request(jobPath=self.job_path, inputPaths=[self.job_path, ".workspace/user-sources"])
        self.assertTrue((self.repo / lead).is_file())
        self.assertFalse((self.repo / other).exists())

    def test_current_basis_restores_only_selected_work_legacy_pins(self):
        pins = {}
        for wid, name in ((self.wid, "selected"), ("work-bbbbbbbbbbbbbbbbbbbb", "other")):
            root = ".workspace/legacy-prior/" + name
            body = manifest({"evidence.txt": name.encode()})
            self.save({root + "/MANIFEST.sha256": body, root + "/evidence.txt": name.encode()})
            pins[wid] = [{"root": str(self.repo / root), "manifestSha256": digest(body)}]
        metadata = self.basis + "/CURATION-BASELINE.json"
        prior = self.store.get_revision(json.loads(self.artifacts[metadata])["revision"])
        anchor = self.store.put_revision("active", "runner-test-legacy-basis", {**prior["payload"], "legacyPins": pins})
        body = encoded({"revision": anchor})
        self.save({metadata: body, self.job_path: encoded(self.job())})
        self.controls[metadata] = digest(body)
        self.request(jobPath=self.job_path)
        self.assertEqual((self.repo / ".workspace/legacy-prior/selected/evidence.txt").read_bytes(), b"selected")
        self.assertFalse((self.repo / ".workspace/legacy-prior/other").exists())


if __name__ == "__main__":
    unittest.main()
