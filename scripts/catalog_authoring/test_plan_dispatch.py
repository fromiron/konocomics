"""Small route-boundary regression; this test is not run during batch promotion."""
import unittest
import tempfile
from contextlib import ExitStack
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

from plan_dispatch import route_for
import plan_dispatch as planner


class RouteTest(unittest.TestCase):
    def test_plan_checks_ready_ownership_hashes_and_stale_inputs_with_registry_repair(self):
        # Keep the real notification/manifest validators. Only DB/packet loading
        # is substituted; this regression concerns plan()'s orchestration boundary.
        with tempfile.TemporaryDirectory() as folder, ExitStack() as stack:
            root = Path(folder)
            wid = "work-aaaaaaaaaaaaaaaaaaaa"
            owner, parent = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            write, sha = planner.notifications.write, planner.prepare.panel.sha256
            dispatch, summary = root / "dispatch.json", root / "summary.json"
            checked, sealed = root / "run/CHECKED.json", root / "run/sealed"
            baseline = root / "baseline"
            for path in (baseline / "catalog-expanded.candidate.sqlite", baseline / "catalog-source-registry.candidate.sqlite", root / "STATE.json", root / "contract.md"):
                write(path, {})
            planner.prepare.write_json(root / "data/staging/catalog-expansion/gold-set-manifest.json", {"workIds": []})
            write(sealed / "report.json", {"sealed": True})
            planner.prepare.publisher._write_result_manifest(sealed)
            planner.prepare.publisher._write_result_manifest(baseline)
            decision, manifest = root / "run/decisions.json", root / "run/frozen/panel-input/PANEL-INPUT.sha256"
            write(decision, {})
            write(manifest, {})
            write(root / "run/RUN.json", {"decisionsPath": str(decision)})
            write(checked, {"workId": wid, "status": "READY_FOR_PUBLICATION", "sealedRoot": str(sealed),
                            "decisionsSha256": sha(decision), "inputManifestSha256": sha(manifest),
                            "resultManifestSha256": sha(sealed / "MANIFEST.sha256")})
            write(root / "run/CHECK-STORAGE.json", {"checkedSha256": sha(checked), "storage": {"backup": {"status": "BACKED_UP"}}})
            write(dispatch, {"batchId": "batch", "phase": "adjudication-only", "ownerThreadId": owner,
                             "parentThreadId": parent, "workCount": 1, "publicationAllowed": False,
                             "works": [{"workId": wid, "title": "Title"}]})
            result = {"batchId": "batch", "ownerThreadId": owner, "parentThreadId": parent,
                      "works": [{"workId": wid, "status": "READY_FOR_PUBLICATION", "checkedPath": str(checked), "checkedSha256": sha(checked)}]}
            write(summary, result)
            facts = {"works": {wid: {"title": "Title", "creators": "Creator", "recommendationEligible": "false", "annotationReviewMethod": "unreviewed"}},
                     "volumeRows": {wid: [{"isRepresentative": "true", "isbn": "9780306406157", "volumeNumber": "1", "editionKind": "standard"}]}}
            backend = SimpleNamespace(_baseline_facts=Mock(return_value=facts), ensure_registry=Mock(return_value={"rowsByWork": {wid: [{}]}}),
                                      _normalise_isbn=lambda value: value, _registry_bibliography=lambda row: ("old",),
                                      _validate_packet_baseline_binding=Mock(), PublishError=ValueError)
            for module, name, value in ((planner, "ROOT", root), (planner, "REPO", root),
                                        (planner.prepare, "CONTRACTS", {"policy": ("contract.md", "unused")})):
                stack.enter_context(patch.object(module, name, value))
            stack.enter_context(patch.object(planner.notifications, "state_path", return_value=root / "no-registration"))
            stack.enter_context(patch.object(planner.runner, "current", return_value=({"latestCandidate": {"catalogSha256": sha(baseline / "catalog-expanded.candidate.sqlite")}}, baseline)))
            stack.enter_context(patch.object(planner.prepare.publisher, "_backend_module", return_value=backend))
            packet = stack.enter_context(patch.object(planner.prepare, "build_packets", return_value={}))
            actual = planner.plan(dispatch, summary)
            self.assertEqual(actual["works"][0]["requirements"], ["reuse-checked", "registry-repair"])
            self.assertEqual(actual["bindings"]["summarySha256"], sha(summary))
            write(summary, {**result, "ownerThreadId": parent})
            with self.assertRaisesRegex(ValueError, "ownership"):
                planner.plan(dispatch, summary)
            write(summary, result)
            original = checked.read_bytes()
            write(checked, {"changed": True})
            with self.assertRaisesRegex(ValueError, "SHA mismatch"):
                planner.plan(dispatch, summary)
            checked.write_bytes(original)
            packet.side_effect = lambda *args: write(root / "STATE.json", {"changed": True}) or {}
            with self.assertRaisesRegex(ValueError, "stale input"):
                planner.plan(dispatch, summary)

    def test_eligible_protected_and_prior_are_not_fresh(self):
        self.assertEqual(route_for({"recommendationEligible": "true", "annotationReviewMethod": "human"}, "gold", {"gold"}), ["eligible", "protected"])
        self.assertEqual(route_for({"recommendationEligible": "false", "annotationReviewMethod": "authorizedModelPanel"}, "panel", set()), ["protected"])
        self.assertEqual(route_for({"recommendationEligible": "false", "annotationReviewMethod": "authorizedEvidencePanel"}, "aep", set()), ["prior-recovery"])
        self.assertEqual(route_for({"recommendationEligible": "false", "annotationReviewMethod": "unreviewed"}, "new", set()), ["fresh"])
        self.assertEqual(route_for({"recommendationEligible": "true", "annotationReviewMethod": "authorizedEvidencePanel"}, "done", set()), ["eligible"])


if __name__ == "__main__":
    unittest.main()
