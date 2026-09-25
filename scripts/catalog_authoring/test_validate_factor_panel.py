from __future__ import annotations

import csv
import hashlib
import json
import shutil
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
from contextlib import closing
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path
import validate_factor_panel as panel

from validate_factor_panel import (
    AXES,
    CONTEXT_FIELDS,
    LEDGER_FIELDS,
    ORIGINAL_EVIDENCE_FIELDS,
    PRIOR_FIELDS,
    PROMOTION_FIELDS,
    SUPPLEMENTAL_FIELDS,
    TARGET_FIELDS,
    ValidationError,
    art_quorum,
    citation_digest,
    claim_semantic_digest,
    entry_scope_bound,
    indexes,
    load_prior_authority,
    merge_prior_evidence,
    read_csv,
    require_prior_claim,
    validate,
    validate_input,
    validate_recovery_evidence,
    verify_manifest,
)


WORK = "work-test0000000000000000"
URL = "https://example.test/work/entry"
OLD_URL = "https://example.test/work/prior"
CONTEXT_URL = "https://example.test/cohort"
EVIDENCE = "ev-supplemental"
OLD_EVIDENCE = "ev-prior"
OTHER_WORK = "work-other000000000000000"


def write_csv(path: Path, fields: tuple[str, ...], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def seal(root: Path, name: str) -> None:
    manifest = root / name
    files = sorted(
        (path for path in root.rglob("*") if path.is_file() and path != manifest),
        key=lambda path: path.relative_to(root).as_posix(),
    )
    manifest.write_text(
        "".join(f"{digest(path)}  {path.relative_to(root).as_posix()}\n" for path in files),
        encoding="ascii",
        newline="\n",
    )


def mutate_csv(path: Path, fields: tuple[str, ...], change) -> None:
    with path.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    change(rows)
    write_csv(path, fields, rows)


class FactorPanelValidatorTest(unittest.TestCase):
    def test_recovery_fact_evidence_cannot_import_old_model_or_materialized_answer(self):
        row = {field: "" for field in ORIGINAL_EVIDENCE_FIELDS}
        row.update(workId=WORK, id="old-fact", targetType="axis", targetId="pacing", sourceType="model")
        with self.assertRaisesRegex(ValueError, "materialized fact authority"):
            validate_recovery_evidence([row])
        row.update(sourceType="publisher", notes="An observed chase in the first episode.")
        validate_recovery_evidence([row])
        row["notes"] = "resolvedValue=2; previous adjudication"
        with self.assertRaisesRegex(ValueError, "materialized fact authority"):
            validate_recovery_evidence([row])

    def test_unbound_recovery_declaration_cannot_skip_missing_prior(self) -> None:
        missing = self.input_root / "missing-original"
        write_json(self.input_root / "external-prior-authority.json", {
            "schemaVersion": "factor-external-prior-authority-v1",
            "bundles": [{"root": str(missing.resolve()), "manifestSha256": "a" * 64}],
        })
        with self.assertRaisesRegex(ValueError, "prior bundle missing"):
            load_prior_authority(self.input_root)
        write_json(self.input_root / "external-lineage.json", {"baselineRoot": str(missing.resolve())})
        seal(self.input_root, "PANEL-INPUT.sha256")
        write_json(self.chunk / "recovery-declaration.json", {"schemaVersion": "factor-loss-recovery-v1"})
        with self.assertRaisesRegex(ValueError, "not manifest-bound"):
            load_prior_authority(self.input_root)
        seal(self.chunk, "CHUNK.sha256")
        seal(self.input_root, "PANEL-INPUT.sha256")
        with self.assertRaisesRegex(ValueError, "recovery declaration schema"):
            load_prior_authority(self.input_root)

    def test_rejects_unmanifested_child_added_during_validation(self) -> None:
        original = verify_manifest

        def add_after_parent(base, manifest, expected_paths):
            result = original(base, manifest, expected_paths)
            if manifest.name == "PANEL-INPUT.sha256":
                (self.chunk / "late-unmanifested.txt").write_text("late", encoding="utf-8")
            return result

        with patch("validate_factor_panel.verify_manifest", side_effect=add_after_parent):
            with self.assertRaisesRegex(ValidationError, "membership changed"):
                validate_input(self.input_root)

    def test_manifest_nested_escape_and_fresh_payload_check(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            nested = root / "nested"
            nested.mkdir()
            payload = nested / "data.txt"
            payload.write_text("before", encoding="utf-8")
            seal(root, "MANIFEST.sha256")
            verify_manifest(root, root / "MANIFEST.sha256", {"nested/data.txt"})
            payload.write_text("after!", encoding="utf-8")
            with self.assertRaises(ValidationError):
                verify_manifest(root, root / "MANIFEST.sha256", {"nested/data.txt"})
            (root / "MANIFEST.sha256").write_text(f"{digest(payload)}  nested/../nested/data.txt\n", encoding="ascii", newline="\n")
            with self.assertRaises(ValidationError):
                verify_manifest(root, root / "MANIFEST.sha256", {"nested/../nested/data.txt"})

    def test_locked_batch_reuses_exact_manifest_verification(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            payload = root / "data.txt"
            payload.write_text("fixed", encoding="utf-8")
            (root / "MANIFEST.sha256").write_text(
                f"{digest(payload)}  data.txt\n", encoding="ascii", newline="\n"
            )
            with patch.object(panel, "sha256", wraps=panel.sha256) as sha:
                with panel.manifest_verification_cache():
                    panel.verify_manifest(root, root / "MANIFEST.sha256", {"data.txt"})
                    panel.verify_manifest(root, root / "MANIFEST.sha256", {"data.txt"})
            self.assertEqual(sha.call_count, 1)

    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        base = Path(self.temporary.name)
        self.input_root = base / "input"
        self.result_root = base / "result"
        self.chunk = self.input_root / "chunks" / "chunk-01"
        packet = self.chunk / "packets" / WORK
        packet.mkdir(parents=True)

        write_csv(packet / "evidence.csv", ORIGINAL_EVIDENCE_FIELDS, [])
        (packet / "packet.json").write_text("{}\n", encoding="utf-8", newline="\n")
        seal(packet, "PACKET.sha256")

        for name in (
            "factor-dictionary.md", "annotation-guide.md",
            "02-authorized-evidence-panel-v1.md", "09-catalog-authoring-authority.md",
        ):
            path = self.input_root / "contracts" / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(f"{name}\n", encoding="utf-8", newline="\n")
        policies = {
            "factorDictionary": digest(self.input_root / "contracts" / "factor-dictionary.md"),
            "annotationGuide": digest(self.input_root / "contracts" / "annotation-guide.md"),
            "authorizedEvidencePanel": digest(self.input_root / "contracts" / "02-authorized-evidence-panel-v1.md"),
            "authoringAuthority": digest(self.input_root / "contracts" / "09-catalog-authoring-authority.md"),
        }
        panel_input = {
            "schemaVersion": "authorized-evidence-panel-followup-v2",
            "batchId": "009", "frozenAt": "2026-09-02T21:00:00+09:00",
            "targetCount": 1, "chunkCount": 1,
            "annotationReviewMethod": "authorizedEvidencePanel",
            "candidateOnly": True, "reviewedByHuman": False, "grokExcluded": True,
            "paidSourcesExcluded": True, "aniListAuthorizingEvidence": False,
            "collectorDecisionClaimsIncluded": False,
            "baselineCandidateSha256": "a" * 64, "registrySha256": "b" * 64,
            "canonicalSha256": "c" * 64, "goldManifestSha256": "d" * 64,
            "policyDigests": policies,
        }
        write_json(self.input_root / "panel-input.json", panel_input)
        (self.input_root / "PANEL-REQUEST.md").write_text("request\n", encoding="utf-8", newline="\n")

        targets = [{
            "batchId": "009", "ordinal": "1", "workId": WORK, "title": "Test",
            "narrativeKnown": "0", "toneKnown": "0", "genreKnown": "0",
            "themeKnown": "0", "missingRequiredClaims": "11",
            "priorPanelBatch": "001", "priorPanelOrdinal": "1",
            "representativeIsbn": "9780000000002", "packetPath": f"packets/{WORK}",
            "packetDigest": digest(packet / "PACKET.sha256"),
        }]
        write_csv(self.chunk / "targets.csv", TARGET_FIELDS, targets)
        supplemental = [{field: "" for field in SUPPLEMENTAL_FIELDS}]
        supplemental[0].update({
            "collectorPass": "factor-evidence-collector-v1", "collectorChunk": "01",
            "evidenceId": EVIDENCE, "workId": WORK, "targetType": "work",
            "targetId": WORK, "sourceType": "publisher", "sourceUrl": URL,
            "retrievedAt": "2026-09-02T21:00:00+09:00",
            "entryScope": "entry_1_3_volumes", "observation": "Concrete entry observation.",
            "limitation": "Entry range only.",
            "claimCandidateKeys": "factor:pacing;factor:pacing;genre:action;theme:adventure",
            "claimCandidateAnchors": "navigation hints only",
        })
        write_csv(self.chunk / "supplemental-evidence.csv", SUPPLEMENTAL_FIELDS, supplemental)
        prior = [{field: "" for field in PRIOR_FIELDS}]
        prior[0].update({
            "batchId": "009", "ordinal": "1", "workId": WORK, "title": "Test",
            "entryScope": "entry_1_3_volumes", "packetPath": f"packets/{WORK}",
            "packetDigest": digest(packet / "PACKET.sha256"), "reviewedByHuman": "false",
            "candidateOnly": "true", "factKey": "axis:progression", "factType": "axis",
            "state": "known", "value": "2", "confidence": "0.80",
            "evidenceIds": OLD_EVIDENCE, "citationUrls": OLD_URL,
            "observation": "Prior accepted observation.", "limitation": "Prior scope only.",
            "decision": "accepted", "reasonCode": "PRESERVED_PRIOR",
        })
        write_csv(self.chunk / "prior-panel-claims.csv", PRIOR_FIELDS, prior)
        self.authority = {
            "claims": {(WORK, "axis:progression"): {claim_semantic_digest(prior[0]): prior[0]}},
            "evidence": {OLD_EVIDENCE: {"workId": WORK, "sourceUrl": OLD_URL}},
        }
        write_csv(self.chunk / "recommendation-context-condition.csv", CONTEXT_FIELDS, [{
            "workId": WORK, "condition": "Strong cohort provenance retained.",
            "catalogRole": "discovery", "evidenceIds": "ev-context",
            "citationUrls": CONTEXT_URL, "observation": "Supported cohort.",
            "limitation": "Selection provenance only.",
        }])
        research = {
            "schemaVersion": "factor-evidence-collector-v1", "workId": WORK,
            "status": "EVIDENCE_FOUND", "candidateOnly": True,
            "reviewedByHuman": False, "grokUsed": False, "paidSourceUsed": False,
            "sources": [{
                "url": URL, "sourceFamily": "publisher", "language": "ja",
                "entryScope": "entry_1_3_volumes", "workOwned": True,
                "independentFrom": [], "observation": "Concrete entry observation.",
                "limitation": "Entry range only.", "claimCandidates": [],
            }], "remainingGaps": [], "notes": "",
        }
        (self.chunk / "collector-research.jsonl").write_text(json.dumps(research) + "\n", encoding="utf-8", newline="\n")
        (self.chunk / "collector-report.md").write_text("report\n", encoding="utf-8", newline="\n")
        seal(self.chunk, "CHUNK.sha256")
        seal(self.input_root, "PANEL-INPUT.sha256")

        result = self.result_root / "chunk-01"
        result.mkdir(parents=True)
        (result / "PANEL-INPUT.sha256").write_bytes((self.input_root / "PANEL-INPUT.sha256").read_bytes())
        artifact = digest(self.chunk / "CHUNK.sha256")
        known = {"progression", "problemSolving", "strategy", "pacing", "characterArcWeight", "relationshipStructure", "comedy", "darkness", "mentalStress"}
        ledger = [self.ledger_row(f"axis:{axis}", "known" if axis in known else "unknown", "2" if axis in known else "", artifact) for axis in AXES]
        ledger.extend([
            self.ledger_row("genre:action", "known", "true", artifact),
            self.ledger_row("theme:adventure", "known", "2", artifact),
        ])
        write_csv(result / "evidence-panel-ledger.csv", LEDGER_FIELDS, ledger)
        write_csv(result / "promotion-ledger.csv", PROMOTION_FIELDS, [{
            "workId": WORK, "adjudicationStatus": "recommendationVerified",
            "panelOutcome": "PASS", "panelBlockerCode": "",
            "recommendationEligible": "true", "libraryOnly": "false",
            "annotationReviewMethod": "authorizedEvidencePanel",
            "reviewedByHuman": "false", "candidateOnly": "true",
            "recommendationContextCondition": "fulfilled-after-coverage-pass",
            "contextEvidenceIds": "ev-context", "contextCitationUrls": CONTEXT_URL,
            "reasonCode": "COVERAGE_COMPLETE",
        }])
        write_json(result / "evidence-panel-summary.json", {
            "schemaVersion": "authorized-evidence-panel-v1", "batchId": "009",
            "chunkId": "01", "inputManifestSha256": digest(self.input_root / "PANEL-INPUT.sha256"),
            "chunkArtifactDigest": artifact, "targetCount": 1, "passCount": 1,
            "blockedCount": 0, "works": [{
                "workId": WORK, "outcome": "PASS", "blockerCodes": [],
                "coverage": {"genreCount": 1, "themeCount": 1, "narrativeKnown": 4, "toneKnown": 5, "artKnown": 0},
                "recommendationEligible": True, "libraryOnly": False,
            }],
        })
        (result / "authorized-evidence-panel-v1.md").write_text("validated\n", encoding="utf-8", newline="\n")
        self.seal_result()

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def ledger_row(self, fact_key: str, state: str, value: str, artifact: str) -> dict[str, str]:
        prior = fact_key == "axis:progression"
        ids = OLD_EVIDENCE if prior else EVIDENCE if state != "unknown" else ""
        urls = OLD_URL if prior else URL if state != "unknown" else ""
        return {
            "workId": WORK, "factKey": fact_key, "state": state, "value": value,
            "confidence": "0.80" if prior else "0.90" if state != "unknown" else "",
            "evidenceIds": ids, "citationUrls": urls, "entryScope": "entry_1_3_volumes",
            "observation": "Prior accepted observation." if prior else "Concrete entry observation." if state != "unknown" else "No sufficient evidence.",
            "limitation": "Prior scope only." if prior else "Entry range only.",
            "decision": "accepted" if state == "known" else "explicitUnknown",
            "reasonCode": "PRESERVED_PRIOR" if prior else "FROZEN_EVIDENCE_REDERIVATION" if state == "known" else "INSUFFICIENT_EVIDENCE",
            "authorityKind": "authorizedEvidencePanelV1", "authorityArtifactDigest": artifact,
            "citationSetDigest": citation_digest([urls] if urls else []),
            "reviewedByHuman": "false", "candidateOnly": "true",
        }

    def seal_result(self) -> None:
        seal(self.result_root / "chunk-01", "PANEL-RESULT.sha256")

    def make_prior_bundle(self, name: str, layout: str = "sealed") -> Path:
        root = Path(self.temporary.name) / name
        if layout == "sealed":
            input_target = root / "panel-input"
            result_target = root / "panel-result"
        elif layout == "modern":
            input_target = root / "authorized-evidence-panel-v1/input/followup-panel-input-v1"
            result_target = root / "authorized-evidence-panel-v1/result/followup-panel-output-v1"
        else:
            raise AssertionError(f"unsupported test layout: {layout}")
        shutil.copytree(self.input_root, input_target)
        shutil.copytree(self.result_root, result_target)
        seal(root, "MANIFEST.sha256")
        return root

    def test_prior_authority_modern_and_sealed_prepare_layouts(self) -> None:
        for layout in ("modern", "sealed"):
            with self.subTest(layout=layout):
                root = self.make_prior_bundle(f"prior-{layout}", layout)
                authority = load_prior_authority(
                    Path(self.temporary.name),
                    extra_bundles=((root, digest(root / "MANIFEST.sha256")),),
                )
                accepted = {
                    key for key, versions in authority["claims"].items()
                    if any(row["decision"] == "accepted" and row["state"] == "known" for row in versions.values())
                }
                self.assertEqual(len(accepted), 11)
                self.assertIn((WORK, "axis:progression"), accepted)
                self.assertNotIn((WORK, "axis:mysteryReveal"), accepted)
                self.assertEqual(authority["evidence"][EVIDENCE]["sourceUrl"], URL)

    def test_sealed_prepare_rejects_tampered_and_missing_manifests(self) -> None:
        mutations = (
            ("tampered member", lambda root: (root / "panel-result/chunk-01/authorized-evidence-panel-v1.md").write_text("tampered\n", encoding="utf-8"), "manifest mismatch"),
            ("missing input", lambda root: (root / "panel-input/PANEL-INPUT.sha256").unlink(), "manifest member missing"),
            ("missing result", lambda root: (root / "panel-result/chunk-01/PANEL-RESULT.sha256").unlink(), "manifest member missing"),
            ("missing root manifest", lambda root: (root / "MANIFEST.sha256").unlink(), "prior bundle manifest missing"),
        )
        for number, (label, mutate, message) in enumerate(mutations, 1):
            with self.subTest(label=label):
                root = self.make_prior_bundle(f"sealed-invalid-{number}")
                expected = digest(root / "MANIFEST.sha256")
                mutate(root)
                with self.assertRaisesRegex(ValidationError, message):
                    load_prior_authority(
                        Path(self.temporary.name),
                        extra_bundles=((root, expected),),
                    )

    def test_sealed_prepare_reuses_inner_input_chunk_and_evidence_bindings(self) -> None:
        cases = (
            ("input/result", "prior result/input binding mismatch", lambda root: (
                (root / "panel-result/chunk-01/PANEL-INPUT.sha256").write_text("changed\n", encoding="ascii")
            )),
            ("chunk", "prior claim artifact binding mismatch", lambda root: mutate_csv(
                root / "panel-result/chunk-01/evidence-panel-ledger.csv", LEDGER_FIELDS,
                lambda rows: rows[0].update(authorityArtifactDigest="0" * 64),
            )),
            ("evidence", "prior citation digest mismatch", lambda root: mutate_csv(
                root / "panel-result/chunk-01/evidence-panel-ledger.csv", LEDGER_FIELDS,
                lambda rows: rows[0].update(citationSetDigest="0" * 64),
            )),
        )
        for number, (label, message, mutate) in enumerate(cases, 1):
            with self.subTest(label=label):
                root = self.make_prior_bundle(f"sealed-inner-{number}")
                mutate(root)
                seal(root / "panel-result/chunk-01", "PANEL-RESULT.sha256")
                seal(root, "MANIFEST.sha256")
                with self.assertRaisesRegex(ValidationError, message):
                    load_prior_authority(
                        Path(self.temporary.name),
                        extra_bundles=((root, digest(root / "MANIFEST.sha256")),),
                    )

    def test_valid_and_key_fail_closed_cases(self) -> None:
        self.assertEqual(validate(self.input_root, self.result_root, self.authority)["passCount"], 1)
        with self.assertRaisesRegex(ValidationError, "manifest-bound original"):
            validate(self.input_root, self.result_root)

        ledger_path = self.result_root / "chunk-01" / "evidence-panel-ledger.csv"
        cases = (
            ("NaN confidence", lambda rows: rows[1].update(confidence="NaN"), "invalid canonical confidence"),
            ("unknown carries value", lambda rows: next(row for row in rows if row["state"] == "unknown").update(value="0"), "unknown/decision mismatch"),
            ("unknown carries evidence", lambda rows: next(row for row in rows if row["state"] == "unknown").update(evidenceIds=EVIDENCE, citationUrls=URL, citationSetDigest=citation_digest([URL])), "unknown claim carries evidence"),
            ("unsorted evidence list", lambda rows: rows[1].update(evidenceIds="z;a"), "not code-unit sorted"),
            ("wrong exact URL", lambda rows: rows[1].update(citationUrls="https://example.test/wrong", citationSetDigest=citation_digest(["https://example.test/wrong"])), "evidence URL set mismatch"),
            ("new claim without supplemental", lambda rows: rows[1].update(evidenceIds="", citationUrls="", citationSetDigest=citation_digest([])), "new claim lacks same-work"),
            ("missing axis", lambda rows: rows.pop(5), "17-axis membership mismatch"),
            ("Art without quorum", lambda rows: next(row for row in rows if row["factKey"] == "axis:artRealism").update(state="known", value="2", confidence="0.90", evidenceIds=EVIDENCE, citationUrls=URL, decision="accepted", reasonCode="FROZEN_EVIDENCE_REDERIVATION", citationSetDigest=citation_digest([URL])), "Art claim lacks"),
        )
        original = ledger_path.read_bytes()
        for label, change, message in cases:
            with self.subTest(label=label):
                ledger_path.write_bytes(original)
                mutate_csv(ledger_path, LEDGER_FIELDS, change)
                self.seal_result()
                with self.assertRaisesRegex(ValidationError, message):
                    validate(self.input_root, self.result_root, self.authority)
        ledger_path.write_bytes(original)
        self.seal_result()

    def test_art_quorum_routes(self) -> None:
        supplemental = {
            "a": {"sourceUrl": "https://review-a.test/work"},
            "b": {"sourceUrl": "https://review-b.test/work"},
        }
        reviews = {WORK: {"sources": [
            {"url": "https://review-a.test/work", "sourceFamily": "independent-review"},
            {"url": "https://review-b.test/work", "sourceFamily": "independent-review"},
        ]}}
        self.assertFalse(art_quorum(WORK, ["a", "b"], supplemental, reviews))
        sample = {WORK: {"sources": [{
            "url": "https://review-a.test/work", "sourceFamily": "publisher",
            "artSample": {"imagePageCount": 6, "visualContextCount": 2},
        }]}}
        self.assertTrue(art_quorum(WORK, ["a"], supplemental, sample))
        self.assertFalse(art_quorum(WORK, ["a"], supplemental, reviews))

    def test_aggregate_entry_scope_contains_all_cited_ranges(self) -> None:
        self.assertTrue(entry_scope_bound("entry_1_3_volumes", {"entry_1_2_volumes", "entry_3_volume"}))
        self.assertTrue(entry_scope_bound("entry_1_3_volumes", {"entry_1_volume", "volume_2", "volume_3"}))
        self.assertTrue(entry_scope_bound("entry_1_3_volumes", {"manga volume 1", "manga volume 2", "manga volume 3"}))
        self.assertTrue(entry_scope_bound("volume_2", {"entry_2_volume"}))
        self.assertFalse(entry_scope_bound("volume_1", {"volume_2"}))
        self.assertFalse(entry_scope_bound("entry_1_2_volumes", {"volume_1", "volume_3"}))
        self.assertFalse(entry_scope_bound("entry_1_3_volumes", {"volume_4"}))
        self.assertFalse(entry_scope_bound("entry_1_3_volumes", {"manga volume 30"}))
        self.assertFalse(entry_scope_bound("entry_1_3_volumes", {"edition_scope_unverified"}))
        self.assertTrue(entry_scope_bound("entry_1_2_volumes", {"entry_1_volume", "entry_2_volume"}))
        self.assertFalse(entry_scope_bound("entry_1_2_volumes", {"entry_1_2_volumes", "entry_3_volume"}))
        self.assertFalse(entry_scope_bound("entry_1_3_volumes", {"entry_1_volume", "full_series"}))
        self.assertFalse(entry_scope_bound("entry_1_3_volumes", {"entry_4_volume"}))
        self.assertFalse(entry_scope_bound("entry_1_3_volumes", set()))
        self.assertTrue(entry_scope_bound("first_major_episode", {"first_major_episode"}))
        mixed = "entry_1_3_volumes_or_first_major_episode"
        self.assertTrue(entry_scope_bound(mixed, {"first_major_episode", "entry_1_volume"}))
        self.assertTrue(entry_scope_bound(mixed, {"first_major_episode", "entry_2_volume"}))
        self.assertFalse(entry_scope_bound(mixed, {"first_major_episode", "full_series"}))
        self.assertFalse(entry_scope_bound(mixed, {"first_major_episode", "volume_4"}))
        self.assertFalse(entry_scope_bound(mixed, {"first_major_episode", "manga volume 30"}))
        self.assertFalse(entry_scope_bound(mixed, {"first_major_episode", "edition_scope_unverified"}))
        self.assertFalse(entry_scope_bound(mixed, set()))
        self.assertFalse(entry_scope_bound("entry_1_3_volumes", {"first_major_episode", "entry_1_volume"}))
        self.assertFalse(entry_scope_bound("first_major_episode", {"first_major_episode", "entry_1_volume"}))

    def test_whole_work_scope_keeps_actual_evidence_limits(self) -> None:
        for scope in ("whole_work", "series_level", "volume_30", "entry_4_volume", "entry_10_12_volumes", "first_major_episode", "entry_1_3_volumes"):
            self.assertTrue(entry_scope_bound("whole_work", {scope}))
        self.assertTrue(entry_scope_bound("whole_work", {"volume_1", "volume_30"}))
        for scopes in (set(), {"edition_scope_unverified"}, {"entry_30_4_volumes"}, {"volume_0"}):
            self.assertFalse(entry_scope_bound("whole_work", scopes))
        self.assertFalse(entry_scope_bound("entry_1_volume", {"whole_work"}))

    def test_prior_evidence_and_citation_lists_are_independent_sets(self) -> None:
        prior_path = self.chunk / "prior-panel-claims.csv"
        with prior_path.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.DictReader(handle))
        rows[0].update(
            evidenceIds="ev-prior-a;ev-prior-b",
            citationUrls="https://example.test/a;https://example.test/z",
        )
        rows.append({
            **rows[0],
            "factKey": "axis:problemSolving",
            "evidenceIds": "ev-prior-a",
            "citationUrls": "https://example.test/z",
        })
        write_csv(prior_path, PRIOR_FIELDS, rows)

        frozen, _, prior, _ = indexes(self.chunk, [{"workId": WORK}])
        self.assertNotIn("ev-prior-a", frozen)
        self.assertEqual(len(prior), 2)

    def test_prior_evidence_rejects_cross_work_and_missing_citations(self) -> None:
        prior_path = self.chunk / "prior-panel-claims.csv"
        original_prior = prior_path.read_bytes()

        with prior_path.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.DictReader(handle))
        rows[0]["citationUrls"] = ""
        write_csv(prior_path, PRIOR_FIELDS, rows)
        with self.assertRaisesRegex(ValidationError, "prior evidence/citation presence mismatch"):
            indexes(self.chunk, [{"workId": WORK}])

        prior_path.write_bytes(original_prior)
        other_packet = self.chunk / "packets" / OTHER_WORK
        write_csv(other_packet / "evidence.csv", ORIGINAL_EVIDENCE_FIELDS, [{
            field: OLD_EVIDENCE if field == "id" else OTHER_WORK if field == "workId" else OLD_URL if field == "sourceUrl" else ""
            for field in ORIGINAL_EVIDENCE_FIELDS
        }])
        research_path = self.chunk / "collector-research.jsonl"
        with research_path.open("a", encoding="utf-8", newline="") as handle:
            handle.write(json.dumps({"workId": OTHER_WORK, "sources": []}) + "\n")
        with self.assertRaisesRegex(ValidationError, "prior evidence is cross-work"):
            indexes(self.chunk, [{"workId": WORK}, {"workId": OTHER_WORK}])

    def test_unsorted_prior_requires_exact_original_authority(self) -> None:
        path = self.chunk / "prior-panel-claims.csv"
        rows = read_csv(path, PRIOR_FIELDS)
        rows[0].update(evidenceIds="ev-z;ev-a", citationUrls=OLD_URL)
        write_csv(path, PRIOR_FIELDS, rows)
        with self.assertRaisesRegex(ValidationError, "manifest-bound original"):
            indexes(self.chunk, [{"workId": WORK}])
        authority = {
            "claims": {(WORK, rows[0]["factKey"]): {claim_semantic_digest(rows[0]): rows[0]}},
            "evidence": {key: {"workId": WORK, "sourceUrl": OLD_URL} for key in ("ev-z", "ev-a")},
        }
        _, _, prior, _ = indexes(self.chunk, [{"workId": WORK}], authority)
        self.assertEqual(prior[(WORK, rows[0]["factKey"])]["evidenceIds"], "ev-z;ev-a")
        rows[0]["observation"] = "Changed after original authority."
        write_csv(path, PRIOR_FIELDS, rows)
        with self.assertRaisesRegex(ValidationError, "manifest-bound original"):
            indexes(self.chunk, [{"workId": WORK}], authority)

    def test_manifest_and_input_authority_flags(self) -> None:
        report = self.result_root / "chunk-01" / "authorized-evidence-panel-v1.md"
        report.write_text("tampered\n", encoding="utf-8", newline="\n")
        with self.assertRaisesRegex(ValidationError, "manifest mismatch"):
            validate(self.input_root, self.result_root, self.authority)

        panel_path = self.input_root / "panel-input.json"
        panel = json.loads(panel_path.read_text(encoding="utf-8"))
        panel["grokExcluded"] = False
        write_json(panel_path, panel)
        seal(self.input_root, "PANEL-INPUT.sha256")
        with self.assertRaisesRegex(ValidationError, "authority flags mismatch"):
            validate(self.input_root, self.result_root, self.authority)


class SealedPrepareLineageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.workspace = REPO
        cls.original = ROOT / "batches/sol-bambino-anchor-115-v1"
        if not cls.original.is_dir():
            raise unittest.SkipTest("Frozen batch 115 prepare bundle is unavailable")
        cls.original_digest = "c6d6cb718739fce2f530bc07a847df379753413f510d75ad86bace9520fea3de"
        cls.authority = load_prior_authority(
            cls.original.parent,
            extra_bundles=((cls.original, cls.original_digest),),
        )

    def test_real_blocked_bundle_grants_only_accepted_claim_authority(self) -> None:
        rows = [row for versions in self.authority["claims"].values() for row in versions.values()]
        expected = {
            "axis:characterArcWeight": "2", "axis:mentalStress": "4",
            "axis:pacing": "2", "axis:problemSolving": "2",
            "axis:relationshipStructure": "2", "axis:romance": "2",
            "axis:worldBuilding": "2", "genre:sliceOfLife": "true",
            "theme:cooking": "2", "theme:workplace": "2",
        }
        self.assertEqual({row["factKey"]: row["value"] for row in rows}, expected)
        self.assertTrue(all(row["decision"] == "accepted" and row["state"] == "known" for row in rows))
        for row in rows:
            require_prior_claim(row, self.authority)
        promotion = read_csv(self.original / "panel-result/chunk-01/promotion-ledger.csv", PROMOTION_FIELDS)
        self.assertEqual(
            (promotion[0]["panelOutcome"], promotion[0]["recommendationEligible"], promotion[0]["libraryOnly"]),
            ("BLOCKED", "false", "true"),
        )
        self.assertEqual(digest(self.original / "MANIFEST.sha256"), self.original_digest)


class ScopedPriorAuthorityLineageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        workspace = REPO
        runs = ROOT / "runs"
        cls.current = runs / "sol-bambino-tone-gap-119-publication-20260909-v1"
        cls.rescue = runs / "factor-rescue-002-run-h"
        if not cls.current.is_dir() or not cls.rescue.is_dir():
            raise unittest.SkipTest("Frozen current-119 and rescue-002 bundles are unavailable")
        cls.extra = (
            (cls.current, "9f86b30373642676e75db3c1aa68048d9b23fa48e8e607ba418a954a95f6bb0a"),
            (cls.rescue, "acafbe1f68bb483776d1be014e013a0f6987a5fa4f07747f19abc6881e3ae915"),
        )
        cls.input_root = runs.parent

    def test_actual_unrelated_conflict_is_excluded_only_by_target_scope(self) -> None:
        conflict = "ambiguous prior evidence: ev-v5-b001-work-4008eef2794c516d373a-cohort-context"
        with self.assertRaisesRegex(ValidationError, conflict):
            load_prior_authority(self.input_root, extra_bundles=self.extra)

        work_id = "work-210ec08cff1d512a4900"
        authority = load_prior_authority(self.input_root, extra_bundles=self.extra, work_ids={work_id})
        rows = [row for versions in authority["claims"].values() for row in versions.values()]
        self.assertEqual(len(rows), 12)
        self.assertEqual({row["workId"] for row in rows}, {work_id})
        for row in rows:
            require_prior_claim(row, authority)

        with self.assertRaisesRegex(ValidationError, conflict):
            load_prior_authority(
                self.input_root,
                extra_bundles=self.extra,
                work_ids={"work-4008eef2794c516d373a"},
            )


class IntegratedCorrectionLineageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.workspace = REPO
        cls.original = REPO / "data/local/catalog-authoring/artifacts/catalog-followup/batch001-20260902/konocomics-v5-panel-batch-001-of-008/integration-publisher-v1/published-run-8/result"
        if not cls.original.is_dir():
            raise unittest.SkipTest("Frozen historical integration bundle is unavailable")
        cls.original_digest = "3b35c323379f173cfb7adba1b015ef34223e7454ec3390113bc5845d2623e321"
        cls.authority = load_prior_authority(REPO / "data/local/catalog-authoring/artifacts", extra_bundles=((cls.original, cls.original_digest),))

    def test_real_original_binds_all_historical_integrated_wrappers(self) -> None:
        wrappers = {}
        batches = self.ROOT / "batches"
        for batch in ("factor-rescue-001", "factor-rescue-002"):
            for path in (batches / batch / "panel-input/chunks").glob("*/prior-panel-claims.csv"):
                for row in read_csv(path, PRIOR_FIELDS):
                    if row["decision"] == "accepted" and row["reasonCode"] == "PRESERVED_VERIFIED_INTEGRATED_PANEL_CLAIM":
                        require_prior_claim(row, self.authority)
                        wrappers[(row["workId"], row["factKey"])] = row
        self.assertEqual(len(wrappers), 16)
        self.assertEqual(wrappers[("work-600d24b85d5e4e0d968c", "theme:war")]["value"], "1")
        corrections = {
            key for key, versions in self.authority["claims"].items()
            if any(row["reasonCode"] == "PRESERVED_VERIFIED_INTEGRATED_PANEL_CLAIM" for row in versions.values())
        }
        self.assertEqual(len(corrections), 111)
        self.assertEqual(digest(self.original / "MANIFEST.sha256"), self.original_digest)

    def test_real_nested_followup_binds_exact_gokon_claims(self) -> None:
        work_id = "work-657fd4a7e4a07edf7127"
        rows = [row for row in read_csv(self.original / "audit/followup/result/chunk-03/evidence-panel-ledger.csv", LEDGER_FIELDS)
                if row["workId"] == work_id and row["decision"] == "accepted"]
        self.assertEqual(len(rows), 14)
        self.assertTrue(any(row["evidenceIds"].split(";") != sorted(row["evidenceIds"].split(";")) for row in rows))
        for row in rows:
            require_prior_claim(row, self.authority)
            for evidence_id in row["evidenceIds"].split(";"):
                self.assertEqual(self.authority["evidence"][evidence_id]["workId"], work_id)
        self.assertEqual(len(self.authority["claims"]), 806)
        # No sorted copy, same-ID alias or modified semantic claim is authority.
        unsorted = next(row for row in rows if row["evidenceIds"].split(";") != sorted(row["evidenceIds"].split(";")))
        with self.assertRaisesRegex(ValidationError, "manifest-bound original"):
            require_prior_claim({**unsorted, "evidenceIds": ";".join(sorted(unsorted["evidenceIds"].split(";")))}, self.authority)

    def test_rehashed_parent_cannot_hide_nested_followup_input_binding_drift(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary) / "integration"
            shutil.copytree(self.original, root)
            result = root / "audit/followup/result/chunk-03"
            copied_input = result / "PANEL-INPUT.sha256"
            content = copied_input.read_bytes()
            copied_input.write_bytes((b"0" if content[:1] != b"0" else b"1") + content[1:])
            seal(result, "PANEL-RESULT.sha256")
            seal(root, "MANIFEST.sha256")
            with self.assertRaisesRegex(ValidationError, "integrated followup original validation failed: copied PANEL-INPUT mismatch"):
                load_prior_authority(Path(temporary), extra_bundles=((root, digest(root / "MANIFEST.sha256")),))

    def test_same_id_cannot_hide_changed_prior_claim_or_source(self) -> None:
        key = ("work-83c6bdf88ed5d8cdc704", "axis:relationshipStructure")
        row = next(iter(self.authority["claims"][key].values()))
        for field, value in (("confidence", "0.94"), ("value", "3"), ("entryScope", "full_series"), ("observation", "Invented observation.")):
            with self.subTest(field=field), self.assertRaisesRegex(ValidationError, "manifest-bound original"):
                require_prior_claim({**row, field: value}, self.authority)
        evidence = dict(self.authority["evidence"])
        source = evidence[row["evidenceIds"]]
        with self.assertRaisesRegex(ValidationError, "ambiguous prior evidence"):
            merge_prior_evidence(evidence, {**source, "observation": "Same ID and URL, different observation."})

    def test_rehashed_database_tamper_does_not_become_original_authority(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary) / "integration"
            shutil.copytree(self.original, root)
            database = root / "catalog-expanded.candidate.sqlite"
            original_database = database.read_bytes()
            mutations = (
                ("factor confidence", "update source_factors set confidence='0.94' where workId='work-83c6bdf88ed5d8cdc704' and axisId='relationshipStructure'"),
                ("generated source notes", "update source_evidence set notes='forged' where id='ev-authorized-correction-8781c473c7e468b0a57a8af1f054ecbd856f03a41addfb4928e82de59026ff87'"),
                ("Theme value", "update source_themes set centrality='2' where workId='work-600d24b85d5e4e0d968c' and themeId='war'"),
            )
            for label, statement in mutations:
                with self.subTest(label=label):
                    database.write_bytes(original_database)
                    with closing(sqlite3.connect(database)) as con:
                        con.execute(statement)
                        con.commit()
                    seal(root, "MANIFEST.sha256")
                    with self.assertRaisesRegex(ValidationError, "generated projection mismatch"):
                        load_prior_authority(Path(temporary), extra_bundles=((root, digest(root / "MANIFEST.sha256")),))
            database.write_bytes(original_database)
            path = root / "audit/correction/results/chunk-10/corrections.csv"
            with path.open(encoding="utf-8", newline="") as handle:
                reader = csv.DictReader(handle)
                fields, rows = tuple(reader.fieldnames), list(reader)
            rows[71]["rationale"] = "Changed adjudication after independent review."
            write_csv(path, fields, rows)
            seal(path.parent, "MANIFEST.sha256")
            seal(root, "MANIFEST.sha256")
            with self.assertRaisesRegex(ValidationError, "review hash mismatch"):
                load_prior_authority(Path(temporary), extra_bundles=((root, digest(root / "MANIFEST.sha256")),))


if __name__ == "__main__":
    unittest.main()
