"""Eligibility-policy boundary; fixtures are not source research or model judgments."""
import copy
import tempfile
import unittest
from pathlib import Path

import coverage_exception as nt
import prepare_factor_batch as prepare


class CoverageExceptionTest(unittest.TestCase):
    def test_frozen_record_only_waives_researched_nt_groups_and_binds_identity(self):
        wid, url = "work-aaaaaaaaaaaaaaaaaaaa", "https://example.test/review"
        record = {"policy": nt.POLICY, "workId": wid, "representativeIsbn": "9780306406157",
                  "attempts": [{"sourceUrl": url, "gap": "narrative", "outcome": "insufficient", "observation": "Test-only source exhaustion"}],
                  "stopReason": "Test-only additional review has no narrative observations"}
        work = {"workId": wid, "representativeIsbn": record["representativeIsbn"], "research": {"sources": [{"url": url}]}, "narrativeToneExhaustion": record}
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            prepare.write_json(root / "authoring-job.json", {"schemaVersion": prepare.single.FROZEN_JOB, "works": [work]})
            prepare.write_json(root / "panel-input.json", {"schemaVersion": prepare.single.INPUT})
            (root / "contracts").mkdir()
            prepare.write_text(root / "contracts/02-authorized-evidence-panel-v1.md", nt.POLICY)
            self.assertEqual(nt.from_input(root), {wid: record})
            codes = ["GENRE_COVERAGE_MISSING", "THEME_COVERAGE_MISSING", "TARGET_IDENTITY_UNRESOLVED", "RECOMMENDATION_CONTEXT_MISSING", "BLOCKED_SAFETY", *sorted(nt.NT_BLOCKERS)]
            self.assertEqual(nt.filter_blockers(codes, record), [code for code in codes if code != "NARRATIVE_COVERAGE_INCOMPLETE"])
            self.assertEqual(nt.filter_blockers(codes, None), codes)
            for change in ({"workId": "other"}, {"representativeIsbn": "other"}, {"attempts": []}, {"attempts": [{**record["attempts"][0], "sourceUrl": "https://example.test/foreign"}]}):
                bad = copy.deepcopy(work)
                bad["narrativeToneExhaustion"].update(change)
                with self.assertRaises(ValueError):
                    nt.validate_record(bad)
            prepare.write_text(root / "contracts/02-authorized-evidence-panel-v1.md", "historical policy")
            with self.assertRaisesRegex(ValueError, "absent from frozen policy"):
                nt.from_input(root)


if __name__ == "__main__":
    unittest.main()
