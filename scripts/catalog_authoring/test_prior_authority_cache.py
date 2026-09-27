"""Invocation-scoped reuse retains original authority and cycle boundaries."""
from __future__ import annotations

import shutil
import unittest
from pathlib import Path
from unittest.mock import patch

import compact_publication as compact
import validate_factor_panel as panel
import test_validate_factor_panel as fixtures


class PriorAuthorityCacheTest(unittest.TestCase):
    def setUp(self):
        self.fixture = fixtures.FactorPanelValidatorTest()
        self.fixture.setUp()
        self.addCleanup(self.fixture.tearDown)
        self.root = Path(self.fixture.temporary.name)
        self.consumer = self.root / "consumer"
        self.consumer.mkdir()
        self.prior = self.fixture.make_prior_bundle("prior")

    def load(self, **kwargs):
        return panel.load_prior_authority(
            self.consumer,
            extra_bundles=((self.prior, panel.sha256(self.prior / "MANIFEST.sha256")),),
            **kwargs,
        )

    def test_reuse_skips_recursive_validation_and_is_not_mutable_or_process_cached(self):
        with patch.object(panel, "validate_input", wraps=panel.validate_input) as validate:
            with panel.manifest_verification_cache():
                first = self.load(work_ids={fixtures.WORK})
                first["claims"].clear()
                first["evidence"].clear()
                with panel.manifest_verification_cache():
                    second = self.load(work_ids={fixtures.WORK})
                self.assertEqual(len(second["claims"]), 11)
                self.assertTrue(second["evidence"])
                self.assertEqual(validate.call_count, 1)
            with panel.manifest_verification_cache():
                self.load(work_ids={fixtures.WORK})
            self.assertEqual(validate.call_count, 2)

    def test_work_scope_baseline_and_sealed_input_are_distinct(self):
        with patch.object(panel, "validate_input", wraps=panel.validate_input) as validate:
            with panel.manifest_verification_cache():
                self.assertTrue(self.load(work_ids={fixtures.WORK})["claims"])
                self.assertFalse(self.load(work_ids={fixtures.OTHER_WORK})["claims"])
                self.assertEqual(validate.call_count, 2)
                self.load(work_ids={fixtures.WORK}, baseline=self.root / "unused.sqlite")
                self.assertEqual(validate.call_count, 3)
                other_input = self.root / "other-input"
                shutil.copytree(self.prior / "panel-input", other_input)
                self.load(work_ids={fixtures.WORK}, _sealed_inputs={self.prior: other_input})
                self.assertEqual(validate.call_count, 4)

    def test_changed_manifest_and_sidecar_are_not_reused(self):
        with panel.manifest_verification_cache():
            self.load(work_ids={fixtures.WORK})
            ledger = self.prior / "panel-result/chunk-01/evidence-panel-ledger.csv"
            fixtures.mutate_csv(ledger, panel.LEDGER_FIELDS,
                lambda rows: rows[0].update(citationSetDigest="0" * 64))
            fixtures.seal(ledger.parent, "PANEL-RESULT.sha256")
            fixtures.seal(self.prior, "MANIFEST.sha256")
            with self.assertRaisesRegex(ValueError, "citation digest mismatch"):
                self.load(work_ids={fixtures.WORK})
        with panel.manifest_verification_cache():
            panel.load_prior_authority(self.consumer)
            fixtures.write_json(self.consumer / "external-prior-authority.json", {
                "schemaVersion": "factor-external-prior-authority-v1",
                "bundles": [{"root": str(self.root / "missing"), "manifestSha256": "a" * 64}],
            })
            with self.assertRaisesRegex(ValueError, "prior bundle missing"):
                panel.load_prior_authority(self.consumer)

    def make_compact(self, version):
        root = self.root / version
        root.mkdir()
        receipt = root / "work.json"
        fixtures.write_json(receipt, {
            "workId": fixtures.WORK,
            "input": compact.reference(self.prior / "panel-input", "PANEL-INPUT.sha256"),
            "authority": compact.reference(self.prior),
        })
        fixtures.write_json(root / "COMPACT-PUBLICATION.json", {
            "schemaVersion": version,
            "works": [{"workId": fixtures.WORK, "receipt": receipt.name, "sha256": panel.sha256(receipt)}],
        })
        fixtures.seal(root, "MANIFEST.sha256")
        return root

    def test_compact_v1_v2_and_transitive_cycle_check_on_hit(self):
        for version in (compact.LEGACY_FORMAT, compact.FORMAT):
            with self.subTest(version=version), panel.manifest_verification_cache():
                root = self.make_compact(version)
                args = {"extra_bundles": ((root, panel.sha256(root / "MANIFEST.sha256")),), "work_ids": {fixtures.WORK}}
                first = panel.load_prior_authority(self.consumer, **args)
                second = panel.load_prior_authority(self.consumer, **args)
                self.assertEqual(first, second)
                self.assertEqual(len(first["claims"]), 11)
                with self.assertRaisesRegex(ValueError, "cyclic prior authority"):
                    panel.load_prior_authority(self.consumer, **args, _active_roots=frozenset({self.prior}))

    def test_changed_transitive_manifest_invalidates_parent(self):
        root = self.make_compact(compact.FORMAT)
        args = {"extra_bundles": ((root, panel.sha256(root / "MANIFEST.sha256")),), "work_ids": {fixtures.WORK}}
        with panel.manifest_verification_cache():
            panel.load_prior_authority(self.consumer, **args)
            (self.prior / "new-member.txt").write_text("changed\n", encoding="utf-8")
            fixtures.seal(self.prior, "MANIFEST.sha256")
            with self.assertRaisesRegex(ValueError, "source manifest changed"):
                panel.load_prior_authority(self.consumer, **args)

    def test_publisher_alias_shares_the_same_operation_scope(self):
        import publish_factor_batch as publisher
        args = {"extra_bundles": ((self.prior, panel.sha256(self.prior / "MANIFEST.sha256")),), "work_ids": {fixtures.WORK}}
        with publisher.panel_validation.manifest_verification_cache():
            first = publisher.panel_validation.load_prior_authority(self.consumer, **args)
            with patch.object(panel, "_load_prior_authority", side_effect=AssertionError("revalidated")):
                second = panel.load_prior_authority(self.consumer, **args)
            self.assertEqual(first, second)


if __name__ == "__main__":
    unittest.main()
