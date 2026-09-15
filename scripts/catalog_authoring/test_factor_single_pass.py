"""Transport/projection regression; real model and publication checks run separately."""
import copy
import json
import tempfile
import unittest
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path

import factor_single_pass as single
import prepare_factor_batch as prepare
import validate_factor_panel as panel


class SinglePassTest(unittest.TestCase):
    def test_source_purposes_hold_and_input_immutability(self):
        wid, eid, url = "work-aaaaaaaaaaaaaaaaaaaa", "ev-source-one", "https://example.test/manga"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            packet = root / f"chunks/chunk-01/packets/{wid}/packet.json"
            source = {key: "" for key in panel.SUPPLEMENTAL_FIELDS}
            source.update(evidenceId=eid, workId=wid, sourceType="publisher", sourceUrl=url, targetType="work", targetId=wid, retrievedAt="2026-09-14T00:00:00Z")
            prepare.write_json(root / "panel-input.json", {"schemaVersion": single.INPUT})
            prepare.write_json(packet, {"contextEvidenceId": None, "supportEvidenceUrls": [url]})
            prepare.write_json(root / "authoring-job.json", {
                "schemaVersion": single.FROZEN_JOB, "batchId": "r-test-revision", "works": [{
                    "workId": wid, "title": "Example", "representativeIsbn": "", "registryVolumeProofs": [],
                    "research": {"schemaVersion": "factor-evidence-collector-v1", "workId": wid, "candidateOnly": True, "reviewedByHuman": False, "grokUsed": False, "paidSourceUsed": False, "sources": []},
                    "evidence": [], "supplementalEvidence": [source], "priorClaims": [], "priorDecisions": [],
                }],
            })
            (root / "PANEL-INPUT.sha256").write_bytes(b"test manifest identity\n")
            value = {"schemaVersion": single.DECISIONS, "inputManifestSha256": panel.sha256(root / "PANEL-INPUT.sha256"), "works": [{
                "workId": wid, "disposition": "adjudicated",
                "sourceDecisions": [{"evidenceId": eid, "uses": ["identity", "safety", "context", "factor"], "reason": "Explicit observed source"}],
                "identity": {"outcome": "MATCH", "evidenceIds": [eid], "observation": "Title and ISBN", "limitation": "One edition"},
                "safety": {"outcome": "SAFE", "reasonCode": "SAFETY_VERIFIED", "sources": [{"evidenceId": eid, "classificationKind": "official-non-adult-label", "observation": "label=青年漫画", "limitation": "Classification only"}], "observation": "Official classification", "limitation": "No factor judgment"},
                "context": {"evidenceId": eid, "condition": "test condition", "catalogRole": "test role", "observation": "Observed selection", "limitation": "Selection only"},
                "claims": [], "retainedClaims": [], "unknownGroups": [],
            }]}
            response = root / "response.json"
            response.write_bytes(json.dumps(value).encode("utf-8"))
            self.assertEqual(single.read_decisions(response), value)
            self.assertFalse(response.read_bytes().endswith(b"\n"))
            before = {p: p.read_bytes() for p in root.rglob("*") if p.is_file()}
            projected, _, blockers = single.project(root, value)
            self.assertEqual(blockers[wid], [])
            self.assertEqual(projected["works"][0]["context"]["citationUrls"], url)
            self.assertEqual(before, {p: p.read_bytes() for p in before})
            safety_root = root / "safety"
            target = {"batchId": "r-test-revision", "ordinal": "1", "workId": wid, "title": "Example", "representativeIsbn": "9784199804953", "packetDigest": "a" * 64}
            prepare.materialize_safety(projected, [target], {wid}, safety_root)
            safety_targets = panel.read_csv(safety_root / "targets.csv", prepare.publisher.SAFETY_TARGET_FIELDS)
            self.assertEqual(safety_targets[0]["identityUrl"], url)
            for defect in ("wrong-use", "unknown-id", "duplicate", "wrong-work", "mixed-version"):
                bad = copy.deepcopy(value)
                work = bad["works"][0]
                if defect == "wrong-use": work["sourceDecisions"][0]["uses"].remove("context")
                elif defect == "unknown-id": work["context"]["evidenceId"] = "ev-other-work"
                elif defect == "duplicate": work["sourceDecisions"].append(copy.deepcopy(work["sourceDecisions"][0]))
                elif defect == "wrong-work": work["workId"] = "work-bbbbbbbbbbbbbbbbbbbb"
                else: bad["schemaVersion"] = "factor-adjudication-v2"
                with self.subTest(defect=defect), self.assertRaises(ValueError):
                    single.project(root, bad)
            prepare.write_json(packet, {"contextEvidenceId": None, "supportEvidenceUrls": ["https://example.test/other"]})
            with self.assertRaisesRegex(ValueError, "outside frozen registry"):
                single.project(root, value)
            hold = {**value, "works": [{"workId": wid, "disposition": "hold", "reason": "Missing identity", "retryCondition": "New same-work ISBN evidence"}]}
            self.assertEqual(single.hold_result(root, hold), hold["works"][0])
            with self.assertRaises(ValueError):
                single.hold_result(root, {**hold, "inputManifestSha256": "0" * 64})
            self.assertNotEqual(single.result_files({"schemaVersion": single.INPUT}), single.result_files({"schemaVersion": "authorized-evidence-panel-followup-v2"}))


if __name__ == "__main__":
    unittest.main()
