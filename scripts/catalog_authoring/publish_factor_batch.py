#!/usr/bin/env python3
"""Validate and cumulatively publish an authorized factor-rescue panel batch."""

from __future__ import annotations

import coverage_exception as nt

import argparse
import csv
import copy
import hashlib
import importlib.util
import json
import math
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import types
from contextlib import closing, nullcontext
from pathlib import Path, PurePosixPath
from authoring_paths import REPO, ROOT, LEGACY, artifact_path
from typing import Iterable


AXES = (
    "progression", "problemSolving", "strategy", "pacing", "mysteryReveal",
    "worldBuilding", "characterArcWeight", "relationshipStructure", "comedy",
    "darkness", "mentalStress", "romance", "emotionalWarmth", "artRealism",
    "artDensity", "visualSoftness", "motionImpact",
)
NARRATIVE = set(AXES[:6])
TONE = set(AXES[6:13])
ART = set(AXES[13:])
GENRES = {
    "action", "fantasy", "historical", "scienceFiction", "mystery", "sports",
    "comedy", "horror", "sliceOfLife", "romance",
}
THEMES = {
    "adventure", "combat", "martialArts", "war", "politics", "survival",
    "investigation", "dungeon", "crafting", "cooking", "territoryManagement",
    "tournament", "revenge", "timeTravel", "reincarnation", "school",
    "workplace", "sportsCompetition", "foundFamily", "historicalReconstruction",
    "postApocalypse", "exploration",
}
LEDGER_FIELDS = (
    "workId", "factKey", "state", "value", "confidence", "evidenceIds",
    "citationUrls", "entryScope", "observation", "limitation", "decision",
    "reasonCode", "authorityKind", "authorityArtifactDigest", "citationSetDigest",
    "reviewedByHuman", "candidateOnly",
)
PROMOTION_FIELDS = (
    "workId", "adjudicationStatus", "panelOutcome", "panelBlockerCode",
    "recommendationEligible", "libraryOnly", "annotationReviewMethod",
    "reviewedByHuman", "candidateOnly", "recommendationContextCondition",
    "contextEvidenceIds", "contextCitationUrls", "reasonCode",
)
TARGET_FIELDS = (
    "batchId", "ordinal", "workId", "title", "narrativeKnown", "toneKnown",
    "genreKnown", "themeKnown", "missingRequiredClaims", "priorPanelBatch",
    "priorPanelOrdinal", "representativeIsbn", "packetPath", "packetDigest",
)
PRIOR_FIELDS = (
    "batchId", "ordinal", "workId", "title", "entryScope", "packetPath",
    "packetDigest", "reviewedByHuman", "candidateOnly", "factKey", "factType",
    "state", "value", "confidence", "evidenceIds", "citationUrls", "observation",
    "limitation", "decision", "reasonCode",
)
SUPPLEMENTAL_FIELDS = (
    "collectorPass", "collectorChunk", "evidenceId", "workId", "targetType",
    "targetId", "sourceType", "sourceUrl", "publishedAt", "retrievedAt",
    "entryScope", "observation", "limitation", "claimCandidateKeys",
    "claimCandidateAnchors",
)
ORIGINAL_EVIDENCE_FIELDS = (
    "sourceOrdinal", "sourceLine", "id", "workId", "targetType", "targetId",
    "sourceType", "sourceUrl", "fetchedAt", "extractorVersion", "reviewedByHuman",
    "confidence", "notes",
)
CONTEXT_FIELDS = (
    "workId", "condition", "catalogRole", "evidenceIds", "citationUrls",
    "observation", "limitation",
)
SAFETY_TARGET_FIELDS = (
    "ordinal", "sourcePanelBatch", "sourceOrdinal", "sourceOutcome", "workId", "title",
    "identityUrl", "representativeIsbn", "safetyClaimEvidenceId", "currentPacketDigest",
    "candidateOnly", "reviewedByHuman",
)
SAFETY_EVIDENCE_FIELDS = (
    "evidenceId", "workId", "sourceType", "sourceUrl", "classificationKind",
    "audienceClassification", "observation", "limitation", "retrievedAt",
    "candidateOnly", "reviewedByHuman",
)
SAFETY_CLAIM_FIELDS = (
    "workId", "outcome", "factKey", "state", "value", "decision", "reasonCode",
    "evidenceIds", "citationUrls", "observation", "limitation", "candidateOnly",
    "reviewedByHuman",
)
RESULT_FILES = {
    "PANEL-INPUT.sha256", "authorized-evidence-panel-v1.md",
    "evidence-panel-ledger.csv", "evidence-panel-summary.json",
    "promotion-ledger.csv", "PANEL-RESULT.sha256",
}
SUMMARY_KEYS = {
    "schemaVersion", "batchId", "chunkId", "inputManifestSha256",
    "chunkArtifactDigest", "targetCount", "passCount", "blockedCount", "works",
}
WORK_SUMMARY_KEYS = {
    "workId", "outcome", "blockerCodes", "coverage", "recommendationEligible",
    "libraryOnly",
}
COVERAGE_KEYS = {"genreCount", "themeCount", "narrativeKnown", "toneKnown", "artKnown"}
SHA_ROW = re.compile(r"^([0-9a-f]{64})  ([^\r\n]+)$")
CONFIDENCE = re.compile(r"^(?:0|1|0\.[0-9]+|1\.0+)$")
URL = re.compile(r"^https?://[^\s]+$")
SIDE_SUFFIXES = ("-wal", "-shm", "-journal")
CONFLICT_FIELDS = (
    "workId", "factKey", "panelChunk", "panelLedgerLine", "panelRowSha256",
    "panelState", "panelValue", "panelConfidence", "panelEvidenceIds",
    "panelCitationUrls", "baselineState", "baselineValue", "baselineConfidence",
    "baselineEvidenceId", "baselineUnderlyingEvidenceIds", "baselineCitationUrls",
    "resolution", "reasonCode", "reviewedByHuman", "candidateOnly",
)


_validator_spec = importlib.util.spec_from_file_location(
    "_factor_panel_validation", Path(__file__).with_name("validate_factor_panel.py")
)
assert _validator_spec and _validator_spec.loader
panel_validation = importlib.util.module_from_spec(_validator_spec)
_validator_spec.loader.exec_module(panel_validation)
ValidationError = panel_validation.ValidationError
_recovery_spec = importlib.util.spec_from_file_location("_factor_recovery", Path(__file__).with_name("factor_recovery.py"))
assert _recovery_spec and _recovery_spec.loader
factor_recovery = importlib.util.module_from_spec(_recovery_spec)
_recovery_spec.loader.exec_module(factor_recovery)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _safe_child(base: Path, relative: str) -> Path:
    pure = PurePosixPath(relative)
    if pure.is_absolute() or "\\" in relative or not pure.parts or any(part in {"", ".", ".."} for part in pure.parts):
        raise ValidationError(f"unsafe manifest path: {relative!r}")
    child = base.joinpath(*pure.parts)
    if os.path.commonpath((str(base.resolve()), str(child.resolve()))) != str(base.resolve()):
        raise ValidationError(f"manifest path escapes root: {relative!r}")
    return child


def verify_manifest(
    base: Path,
    manifest: Path,
    expected_paths: set[str] | None = None,
    require_sorted: bool = True,
) -> dict[str, str]:
    try:
        raw = manifest.read_bytes()
        text = raw.decode("ascii")
    except (OSError, UnicodeError) as error:
        raise ValidationError(f"invalid manifest {manifest}: {error}") from error
    if not raw or b"\r" in raw or not raw.endswith(b"\n") or raw.endswith(b"\n\n"):
        raise ValidationError(f"non-canonical manifest bytes: {manifest}")
    entries: dict[str, str] = {}
    for number, line in enumerate(text.splitlines(), 1):
        match = SHA_ROW.fullmatch(line)
        if match is None:
            raise ValidationError(f"invalid manifest row: {manifest}:{number}")
        digest, relative = match.groups()
        if relative in entries:
            raise ValidationError(f"duplicate manifest path: {manifest}:{number}: {relative}")
        path = _safe_child(base, relative)
        if not path.is_file() or path.is_symlink() or sha256(path) != digest:
            raise ValidationError(f"manifest member missing, linked, or mismatched: {path}")
        entries[relative] = digest
    if require_sorted and list(entries) != sorted(entries):
        raise ValidationError(f"manifest paths are not sorted: {manifest}")
    if expected_paths is not None and set(entries) != expected_paths:
        raise ValidationError(f"manifest membership mismatch: {manifest}")
    return entries


def read_csv(path: Path, expected_fields: tuple[str, ...]) -> list[dict[str, str]]:
    try:
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle, strict=True)
            if tuple(reader.fieldnames or ()) != expected_fields:
                raise ValidationError(f"invalid CSV header: {path}: {reader.fieldnames!r}")
            rows = list(reader)
    except (OSError, UnicodeError, csv.Error) as error:
        raise ValidationError(f"invalid CSV {path}: {error}") from error
    for number, row in enumerate(rows, 2):
        if None in row or any(value is None for value in row.values()):
            raise ValidationError(f"malformed CSV row: {path}:{number}")
    return rows


def _read_json(path: Path) -> dict[str, object]:
    try:
        raw = path.read_bytes()
        if raw.startswith(b"\xef\xbb\xbf") or b"\r" in raw or not raw.endswith(b"\n"):
            raise ValidationError(f"JSON must be UTF-8 without BOM, LF-only, newline-terminated: {path}")
        value = json.loads(raw.decode("utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ValidationError(f"invalid JSON {path}: {error}") from error
    if not isinstance(value, dict):
        raise ValidationError(f"JSON must be an object: {path}")
    return value


def split_list(value: str, label: str) -> list[str]:
    items = value.split(";") if value else []
    if (
        any(not item or item != item.strip() for item in items)
        or len(items) != len(set(items))
        or items != sorted(items)
    ):
        raise ValidationError(f"invalid, duplicate, or unsorted semicolon list for {label}")
    return items


def citation_digest(urls: list[str]) -> str:
    payload = json.dumps(sorted(set(urls)), ensure_ascii=False, separators=(",", ":"))
    return sha256_bytes(payload.encode("utf-8"))


def fact_kind(fact_key: str) -> tuple[str, str]:
    if ":" not in fact_key:
        raise ValidationError(f"invalid factKey: {fact_key!r}")
    prefix, value = fact_key.split(":", 1)
    valid: Iterable[str] = AXES if prefix == "axis" else GENRES if prefix == "genre" else THEMES if prefix == "theme" else ()
    if value not in valid:
        raise ValidationError(f"invalid factor vocabulary: {fact_key!r}")
    return prefix, value


def _exact_keys(value: object, expected: set[str], label: str) -> dict[str, object]:
    if not isinstance(value, dict) or set(value) != expected:
        raise ValidationError(f"invalid {label} keys")
    return value


def _exact_int(value: object, label: str) -> int:
    if type(value) is not int or value < 0:
        raise ValidationError(f"invalid non-negative integer for {label}")
    return value


def _confidence(value: str, label: str) -> None:
    if not CONFIDENCE.fullmatch(value):
        raise ValidationError(f"non-canonical confidence: {label}: {value!r}")
    number = float(value)
    if not math.isfinite(number) or not 0 <= number <= 1:
        raise ValidationError(f"confidence outside 0..1: {label}")


def validate_input(input_root: Path) -> tuple[dict[str, object], list[Path], str]:
    input_root = input_root.resolve()
    value, chunks, input_digest = panel_validation.validate_input(input_root)
    batch_id = value["batchId"]
    target_count = value["targetCount"]
    all_targets: list[str] = []
    for chunk in chunks:
        targets = read_csv(chunk / "targets.csv", TARGET_FIELDS)
        if not targets or len({row["workId"] for row in targets}) != len(targets):
            raise ValidationError(f"invalid target membership: {chunk}")
        for row in targets:
            if row["batchId"] != batch_id or row["packetPath"] != f"packets/{row['workId']}":
                raise ValidationError(f"target batch/path mismatch: {row['workId']}")
            packet_manifest = chunk / row["packetPath"] / "PACKET.sha256"
            if not packet_manifest.is_file() or row["packetDigest"] != sha256(packet_manifest):
                raise ValidationError(f"target packet digest mismatch: {row['workId']}")
        target_ids = {row["workId"] for row in targets}
        import factor_single_pass as single
        if value["schemaVersion"] != single.INPUT:
            contexts = read_csv(chunk / "recommendation-context-condition.csv", CONTEXT_FIELDS)
            if len(contexts) != len(target_ids) or {row["workId"] for row in contexts} != target_ids:
                raise ValidationError(f"context target membership mismatch: {chunk}")
        elif (chunk / "recommendation-context-condition.csv").exists():
            raise ValidationError("v3 input cannot contain adjudicated context")
        else:
            for row in targets:
                packet = _read_json(chunk / row["packetPath"] / "packet.json")
                if "contextEvidenceId" not in packet or packet["contextEvidenceId"] is not None:
                    raise ValidationError("v3 packet must explicitly retain unjudged context")
        prior = read_csv(chunk / "prior-panel-claims.csv", PRIOR_FIELDS)
        if any(row["workId"] not in target_ids for row in prior):
            raise ValidationError(f"prior claim outside target membership: {chunk}")
        supplemental = read_csv(chunk / "supplemental-evidence.csv", SUPPLEMENTAL_FIELDS)
        evidence_ids: set[str] = set()
        for row in supplemental:
            if row["workId"] not in target_ids or not row["evidenceId"] or row["evidenceId"] in evidence_ids:
                raise ValidationError(f"supplemental membership/id mismatch: {chunk}")
            if row["sourceType"] == "model" or not URL.fullmatch(row["sourceUrl"]) or "anilist.co" in row["sourceUrl"].lower():
                raise ValidationError(f"ineligible supplemental authority: {row['evidenceId']}")
            if not row["entryScope"] or not row["observation"] or not row["limitation"]:
                raise ValidationError(f"incomplete supplemental evidence: {row['evidenceId']}")
            evidence_ids.add(row["evidenceId"])
        all_targets.extend(sorted(target_ids))
    if len(all_targets) != target_count or len(set(all_targets)) != target_count:
        raise ValidationError("aggregate target membership/count mismatch")
    return value, chunks, input_digest


def supplemental_source_fields(source: dict) -> dict[str, str]:
    """Project a collector record without choosing claims, values, or timestamps."""
    claims = source.get("claimCandidates")
    if (
        source.get("sourceFamily") not in {"publisher", "independent-review", "other"}
        or type(source.get("workOwned")) is not bool
        or (source.get("sourceFamily") == "publisher" and source.get("workOwned") is not True)
        or any(not isinstance(source.get(key), str) for key in ("entryScope", "observation", "limitation"))
        or not isinstance(claims, list)
        or any(
            not isinstance(claim, dict)
            or set(claim) != {"targetType", "targetId", "anchor"}
            or claim["targetType"] not in {"genre", "theme", "factor"}
            or not isinstance(claim["targetId"], str)
            or not isinstance(claim["anchor"], str)
            for claim in claims
        )
    ):
        raise ValidationError("invalid frozen collector source ownership or claim candidates")
    return {
        "sourceType": "publisher" if source["sourceFamily"] == "publisher" else "manual",
        **{key: source[key] for key in ("entryScope", "observation", "limitation")},
        "claimCandidateKeys": ";".join(sorted(
            (f"{claim['targetType']}:{claim['targetId']}" for claim in claims), key=panel_validation.code_unit_key,
        )),
        "claimCandidateAnchors": " | ".join(sorted(
            (f"{claim['targetType']}:{claim['targetId']}={claim['anchor']}" for claim in claims), key=panel_validation.code_unit_key,
        )),
    }


def _evidence_index(chunk: Path, target_ids: set[str]) -> tuple[dict[str, dict[str, str]], set[str]]:
    records: dict[str, dict[str, str]] = {}
    supplemental_ids: set[str] = set()
    research: dict[str, dict[str, object]] = {}
    for number, line in enumerate((chunk / "collector-research.jsonl").read_text(encoding="utf-8").splitlines(), 1):
        if not line:
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as error:
            raise ValidationError(f"invalid collector research JSON: {chunk.name}:{number}") from error
        work_id = item.get("workId") if isinstance(item, dict) else None
        if work_id not in target_ids or work_id in research:
            raise ValidationError(f"collector research membership mismatch: {chunk.name}:{number}")
        if (
            item.get("schemaVersion") != "factor-evidence-collector-v1"
            or item.get("candidateOnly") is not True
            or item.get("reviewedByHuman") is not False
            or item.get("grokUsed") is not False
            or item.get("paidSourceUsed") is not False
            or not isinstance(item.get("sources"), list)
        ):
            raise ValidationError(f"collector research authority boundary mismatch: {work_id}")
        research[work_id] = item
    if set(research) != target_ids:
        raise ValidationError(f"collector research membership mismatch: {chunk}")

    for work_id in sorted(target_ids):
        for row in read_csv(chunk / "packets" / work_id / "evidence.csv", ORIGINAL_EVIDENCE_FIELDS):
            if row["workId"] != work_id or not row["id"] or row["id"] in records:
                raise ValidationError(f"packet evidence ownership/id mismatch: {work_id}")
            records[row["id"]] = row
    for row in read_csv(chunk / "supplemental-evidence.csv", SUPPLEMENTAL_FIELDS):
        if row["evidenceId"] in records:
            raise ValidationError(f"duplicate frozen evidence ID: {row['evidenceId']}")
        work_id = row["workId"]
        if (
            work_id not in target_ids
            or row["collectorPass"] != "factor-evidence-collector-v1"
            or row["collectorChunk"] != chunk.name
            or row["targetType"] != "work"
            or row["targetId"] != work_id
            or row["sourceType"] not in {"publisher", "manual"}
        ):
            raise ValidationError(f"supplemental evidence ownership mismatch: {row['evidenceId']}")
        sources = research[work_id]["sources"]
        matches = [source for source in sources if isinstance(source, dict) and source.get("url") == row["sourceUrl"]]
        if len(matches) != 1:
            raise ValidationError(f"supplemental URL is not uniquely bound to frozen same-work research: {row['evidenceId']}")
        source = matches[0]
        if any(row[key] != value for key, value in supplemental_source_fields(source).items()):
            raise ValidationError(f"supplemental evidence is not bound to its frozen source record: {row['evidenceId']}")
        records[row["evidenceId"]] = row
        records[row["evidenceId"]]["_researchSource"] = source  # frozen, validator-only metadata
        supplemental_ids.add(row["evidenceId"])
    return records, supplemental_ids


def _art_quorum(selected: list[dict[str, str]]) -> bool:
    sources = [row["_researchSource"] for row in selected]
    return any(
        isinstance(source.get("artSample"), dict)
        and type(source["artSample"].get("imagePageCount")) is int
        and type(source["artSample"].get("visualContextCount")) is int
        and source["artSample"]["imagePageCount"] >= 6
        and source["artSample"]["visualContextCount"] >= 2
        for source in sources
    )


def _validate_ledger(
    chunk: Path,
    result: Path,
    targets: list[dict[str, str]],
    artifact_digest: str,
    prior_evidence: dict[str, dict[str, str]] | None = None,
    prior_authority: dict[str, object] | None = None,
) -> tuple[dict[str, dict[str, int]], dict[str, list[str]]]:
    target_ids = {row["workId"] for row in targets}
    evidence, supplemental_ids = _evidence_index(chunk, target_ids)
    prior_rows = read_csv(chunk / "prior-panel-claims.csv", PRIOR_FIELDS)
    prior_accepted: dict[tuple[str, str], dict[str, str]] = {}
    authority = prior_authority or {"claims": {}, "evidence": {}}
    decisions = panel_validation.load_prior_decisions(chunk.parent.parent)
    for row in prior_rows:
        if row["workId"] not in target_ids or row["reviewedByHuman"] != "false" or row["candidateOnly"] != "true":
            raise ValidationError(f"prior claim boundary mismatch: {row['workId']} {row['factKey']}")
        if row["decision"] != "accepted" or row["factType"] not in {"axis", "genre", "theme"}:
            continue
        key = (row["workId"], row["factKey"])
        if key in prior_accepted:
            raise ValidationError(f"duplicate prior accepted claim: {row['workId']} {row['factKey']}")
        panel_validation.require_prior_claim(row, authority)
        ids = panel_validation.split_list(row["evidenceIds"], f"{row['workId']} {row['factKey']} prior evidenceIds", require_sorted=False)
        urls = panel_validation.split_list(row["citationUrls"], f"{row['workId']} {row['factKey']} prior citationUrls", require_sorted=False)
        if not ids or not urls or any(not URL.fullmatch(url) for url in urls):
            raise ValidationError(f"prior evidence/citation mismatch: {row['workId']} {row['factKey']}")
        for evidence_id in ids:
            source = authority["evidence"].get(evidence_id)
            if source is None:
                raise ValidationError(f"prior evidence is not manifest-bound: {evidence_id}")
            url = source["sourceUrl"]
            if source["workId"] != row["workId"] or url not in urls:
                raise ValidationError(f"prior evidence binding mismatch: {evidence_id}")
            existing = evidence.get(evidence_id)
            if existing is not None and (existing.get("workId"), existing.get("sourceUrl")) != (row["workId"], url):
                raise ValidationError(f"prior evidence ID collision: {evidence_id}")
            evidence.setdefault(evidence_id, source)
        if {evidence[evidence_id]["sourceUrl"] for evidence_id in ids} != set(urls):
            raise ValidationError(f"prior evidence URL set mismatch: {row['workId']} {row['factKey']}")
        prior_accepted[key] = row
    if any(key[0] in target_ids and key not in prior_accepted for key in decisions):
        raise ValidationError("prior correction does not target an accepted prior claim")
    rows = read_csv(result / "evidence-panel-ledger.csv", LEDGER_FIELDS)
    by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in rows:
        work_id, fact_key = row["workId"], row["factKey"]
        if work_id not in target_ids or (work_id, fact_key) in by_key:
            raise ValidationError(f"ledger target/duplicate mismatch: {work_id} {fact_key}")
        prefix, name = fact_kind(fact_key)
        state, value, decision = row["state"], row["value"], row["decision"]
        if prefix in {"genre", "theme"} and state != "known":
            raise ValidationError(f"Genre/Theme output rows must be accepted only: {work_id} {fact_key}")
        if state == "known":
            if decision != "accepted" or not row["confidence"]:
                raise ValidationError(f"known/decision mismatch: {work_id} {fact_key}")
            _confidence(row["confidence"], f"{work_id} {fact_key}")
            if (prefix == "axis" and value not in {"0", "1", "2", "3", "4"}) or (prefix == "genre" and value != "true") or (prefix == "theme" and value not in {"1", "2"}):
                raise ValidationError(f"invalid known value: {work_id} {fact_key}")
        elif state == "unknown":
            if prefix != "axis" or value or row["confidence"] or decision != "explicitUnknown":
                raise ValidationError(f"unknown/decision mismatch: {work_id} {fact_key}")
        elif state == "notApplicable":
            if prefix != "axis" or name != "motionImpact" or value or decision != "notApplicable" or not row["confidence"]:
                raise ValidationError(f"invalid notApplicable claim: {work_id} {fact_key}")
            _confidence(row["confidence"], f"{work_id} {fact_key}")
        else:
            raise ValidationError(f"invalid factor state: {work_id} {fact_key}")
        if not row["entryScope"] or not row["observation"] or not row["limitation"] or not row["reasonCode"]:
            raise ValidationError(f"incomplete claim metadata: {work_id} {fact_key}")
        if row["reviewedByHuman"] != "false" or row["candidateOnly"] != "true" or row["authorityKind"] != "authorizedEvidencePanelV1" or row["authorityArtifactDigest"] != artifact_digest:
            raise ValidationError(f"claim authority/flag mismatch: {work_id} {fact_key}")
        old = prior_accepted.get((work_id, fact_key))
        preserved = old is not None and panel_validation.preserved_prior(old, row, decisions)
        ids = panel_validation.split_list(row["evidenceIds"], f"{work_id} {fact_key} evidenceIds", require_sorted=not preserved)
        urls = panel_validation.split_list(row["citationUrls"], f"{work_id} {fact_key} citationUrls", require_sorted=not preserved)
        if state == "unknown":
            panel_validation.validate_unknown_evidence(ids, urls, f"{work_id} {fact_key}", row["citationSetDigest"])
        elif not ids or not urls or any(not URL.fullmatch(url) for url in urls):
            raise ValidationError(f"claim lacks exact HTTP(S) evidence: {work_id} {fact_key}")
        selected: list[dict[str, str]] = []
        for evidence_id in ids:
            record = evidence.get(evidence_id)
            record_work = record.get("workId") if record else None
            if record is None or record_work != work_id:
                raise ValidationError(f"missing or cross-work evidence: {work_id} {fact_key} {evidence_id}")
            selected.append(record)
        selected_urls = {row.get("sourceUrl", "") for row in selected}
        if selected_urls != set(urls) or row["citationSetDigest"] != citation_digest(urls):
            raise ValidationError(f"claim evidence URL/digest mismatch: {work_id} {fact_key}")
        if not preserved and state in {"known", "notApplicable"}:
            if any(evidence_id not in supplemental_ids for evidence_id in ids):
                raise ValidationError(f"new accepted claim lacks same-work supplemental evidence: {work_id} {fact_key}")
            if any(record.get("sourceType") == "model" or "anilist.co" in record.get("sourceUrl", "").lower() for record in selected):
                raise ValidationError(f"new accepted claim uses ineligible authority: {work_id} {fact_key}")
            if not panel_validation.entry_scope_bound(row["entryScope"], {record["entryScope"] for record in selected}):
                raise ValidationError(f"new accepted claim entryScope is not bound to frozen evidence: {work_id} {fact_key}")
            if prefix == "axis" and name in ART and not _art_quorum(selected):
                raise ValidationError(f"Art claim lacks 6-page/2-context quorum: {work_id} {fact_key}")
        by_key[(work_id, fact_key)] = row
    missing_prior = sorted(key for key in prior_accepted if key not in by_key)
    for key in missing_prior:
        panel_validation.preserved_prior(prior_accepted[key], None, decisions)
    coverage: dict[str, dict[str, int]] = {}
    blockers: dict[str, list[str]] = {}
    safety_blocked = panel_validation.recovery_safety_blockers(chunk.parent.parent, target_ids, result.parent)
    for work_id in sorted(target_ids):
        axis_rows = {key.split(":", 1)[1]: row for (wid, key), row in by_key.items() if wid == work_id and key.startswith("axis:")}
        if set(axis_rows) != set(AXES):
            raise ValidationError(f"17-axis membership mismatch: {work_id}")
        known = {axis for axis, row in axis_rows.items() if row["state"] == "known"}
        item = {
            "genreCount": sum(wid == work_id and key.startswith("genre:") for wid, key in by_key),
            "themeCount": sum(wid == work_id and key.startswith("theme:") for wid, key in by_key),
            "narrativeKnown": len(known & NARRATIVE),
            "toneKnown": len(known & TONE),
            "artKnown": len(known & ART),
        }
        codes: list[str] = []
        if item["genreCount"] < 1:
            codes.append("GENRE_COVERAGE_MISSING")
        if item["themeCount"] < 1:
            codes.append("THEME_COVERAGE_MISSING")
        if item["narrativeKnown"] < 4:
            codes.append("NARRATIVE_COVERAGE_INCOMPLETE")
        if item["toneKnown"] < 5:
            codes.append("TONE_COVERAGE_INCOMPLETE")
        coverage[work_id] = item
        if work_id in safety_blocked:
            codes.append("BLOCKED_SAFETY")
        blockers[work_id] = sorted(codes)
    exceptions = nt.from_input(chunk.parent.parent)
    blockers = {wid: nt.filter_blockers(codes, exceptions.get(wid)) for wid, codes in blockers.items()}
    return coverage, blockers


def _validate_promotion(
    result: Path,
    targets: list[dict[str, str]],
    contexts: list[dict[str, str]],
    blockers: dict[str, list[str]],
    pass_reasons=None,
) -> None:
    rows = read_csv(result / "promotion-ledger.csv", PROMOTION_FIELDS)
    target_ids = {row["workId"] for row in targets}
    context_by_work = {row["workId"]: row for row in contexts}
    if len(rows) != len(target_ids) or {row["workId"] for row in rows} != target_ids or set(context_by_work) != target_ids:
        raise ValidationError(f"promotion/context target membership mismatch: {result}")
    for row in rows:
        work_id = row["workId"]
        codes = blockers[work_id]
        context = context_by_work[work_id]
        split_list(row["panelBlockerCode"], f"{work_id} blocker codes")
        expected = {
            "workId": work_id,
            "adjudicationStatus": "BLOCKED_SAFETY" if "BLOCKED_SAFETY" in codes else "BLOCKED_FACTOR" if codes else "recommendationVerified",
            "panelOutcome": "BLOCKED" if codes else "PASS",
            "panelBlockerCode": ";".join(codes),
            "recommendationEligible": "false" if codes else "true",
            "libraryOnly": "true" if codes else "false",
            "annotationReviewMethod": "authorizedEvidencePanel",
            "reviewedByHuman": "false",
            "candidateOnly": "true",
            "recommendationContextCondition": "planned-after-coverage-pass" if codes else "fulfilled-after-coverage-pass",
            "contextEvidenceIds": context["evidenceIds"],
            "contextCitationUrls": context["citationUrls"],
            "reasonCode": "BLOCKED_SAFETY" if "BLOCKED_SAFETY" in codes else "FACTOR_COVERAGE_INCOMPLETE" if codes else (pass_reasons or {}).get(work_id, "COVERAGE_COMPLETE"),
        }
        if row != expected:
            raise ValidationError(f"promotion semantics mismatch: {work_id}")


def _validate_summary(
    path: Path,
    panel_input: dict[str, object],
    chunk_id: str,
    input_digest: str,
    artifact_digest: str,
    coverage: dict[str, dict[str, int]],
    blockers: dict[str, list[str]],
) -> tuple[int, int]:
    summary = _exact_keys(_read_json(path), SUMMARY_KEYS, "summary")
    works = summary["works"]
    if not isinstance(works, list) or [item.get("workId") if isinstance(item, dict) else None for item in works] != sorted(coverage):
        raise ValidationError("summary work membership/order mismatch")
    pass_count = 0
    for raw in works:
        item = _exact_keys(raw, WORK_SUMMARY_KEYS, "work summary")
        work_id = str(item["workId"])
        codes = blockers[work_id]
        if not codes:
            pass_count += 1
        if item["outcome"] != ("BLOCKED" if codes else "PASS") or item["blockerCodes"] != codes:
            raise ValidationError(f"summary outcome mismatch: {work_id}")
        cov = _exact_keys(item["coverage"], COVERAGE_KEYS, "coverage")
        if any(_exact_int(cov[key], f"{work_id}.{key}") != coverage[work_id][key] for key in COVERAGE_KEYS):
            raise ValidationError(f"summary coverage mismatch: {work_id}")
        if item["recommendationEligible"] is not (not codes) or item["libraryOnly"] is not bool(codes):
            raise ValidationError(f"summary eligibility mismatch: {work_id}")
    blocked_count = len(coverage) - pass_count
    expected = {
        "schemaVersion": "authorized-evidence-panel-v1",
        "batchId": panel_input["batchId"],
        "chunkId": chunk_id,
        "inputManifestSha256": input_digest,
        "chunkArtifactDigest": artifact_digest,
        "targetCount": len(coverage),
        "passCount": pass_count,
        "blockedCount": blocked_count,
    }
    if any(summary[key] != value for key, value in expected.items()):
        raise ValidationError(f"summary scalar mismatch: chunk-{chunk_id}")
    return pass_count, blocked_count


def validate(
    input_root: Path,
    result_root: Path,
    prior_evidence: dict[str, dict[str, str]] | None = None,
    prior_authority: dict[str, object] | None = None,
) -> dict[str, int | str]:
    panel_input, chunks, input_digest = validate_input(input_root)
    exceptions = nt.from_input(input_root)
    targets_all = {row["workId"] for chunk in chunks for row in read_csv(chunk / "targets.csv", TARGET_FIELDS)}
    authority = prior_authority or panel_validation.load_prior_authority(input_root, work_ids=targets_all)
    if any(key[0] not in targets_all for key in panel_validation.load_prior_decisions(input_root)):
        raise ValidationError("prior correction outside target membership")
    result_root = result_root.resolve()
    if not result_root.is_dir() or result_root.is_symlink():
        raise ValidationError(f"result root missing or linked: {result_root}")
    if {path.name for path in result_root.iterdir() if path.is_dir()} != {path.name for path in chunks} or any(not path.is_dir() for path in result_root.iterdir()):
        raise ValidationError("result chunk membership mismatch")
    totals = {"targetCount": 0, "passCount": 0, "blockedCount": 0}
    for chunk in chunks:
        result = result_root / chunk.name
        import factor_single_pass as single
        expected_files = single.result_files(panel_input)
        if {path.name for path in result.iterdir() if path.is_file() and not path.is_symlink()} != expected_files or any(path.is_dir() or path.is_symlink() for path in result.iterdir()):
            raise ValidationError(f"result file membership mismatch: {result}")
        if (result / "PANEL-INPUT.sha256").read_bytes() != (input_root / "PANEL-INPUT.sha256").read_bytes():
            raise ValidationError(f"copied PANEL-INPUT mismatch: {result}")
        verify_manifest(result, result / "PANEL-RESULT.sha256", expected_files - {"PANEL-RESULT.sha256"})
        report = (result / "authorized-evidence-panel-v1.md").read_text(encoding="utf-8")
        if not report.strip():
            raise ValidationError(f"panel review report is empty: {result}")
        artifact_digest = sha256(chunk / "CHUNK.sha256")
        targets = read_csv(chunk / "targets.csv", TARGET_FIELDS)
        coverage, blockers = _validate_ledger(chunk, result, targets, artifact_digest, prior_evidence, authority)
        contexts = list(single.contexts(chunk, result, targets, blockers, authority).values()) if panel_input["schemaVersion"] == single.INPUT else read_csv(chunk / "recommendation-context-condition.csv", CONTEXT_FIELDS)
        _validate_promotion(result, targets, contexts, blockers, {wid: nt.pass_reason(item, wid in exceptions) for wid, item in coverage.items()})
        passed, blocked = _validate_summary(
            result / "evidence-panel-summary.json", panel_input,
            chunk.name.removeprefix("chunk-"), input_digest, artifact_digest,
            coverage, blockers,
        )
        totals["targetCount"] += len(targets)
        totals["passCount"] += passed
        totals["blockedCount"] += blocked
    if totals["targetCount"] != panel_input["targetCount"]:
        raise ValidationError("aggregate targetCount mismatch")
    return {"schemaVersion": "authorized-evidence-panel-v1-result-validation", "chunkCount": len(chunks), **totals}


def validate_bundle(
    input_root: Path,
    result_root: Path,
    prior_evidence: dict[str, dict[str, str]] | None = None,
    prior_authority: dict[str, object] | None = None,
) -> dict[str, int | str]:
    """Public validation-only entry point used by tests and operators."""

    return validate(input_root, result_root, prior_evidence, prior_authority)


def _repo_root() -> Path:
    root = REPO
    if not (root / "data" / "source" / "catalog.sqlite").is_file():
        raise ValidationError(f"repository root not found from publisher: {root}")
    return root


def _safety_fetched_at(value: str) -> str:
    return f"{value}T00:00:00+09:00" if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value) else value


def _apply_conflict_decisions(
    rows: list[dict[str, str]],
    conflicts: dict[tuple[str, str], dict[str, str]],
) -> list[dict[str, str]]:
    applied: set[tuple[str, str]] = set()
    adjusted: list[dict[str, str]] = []
    for row in rows:
        key = (row["workId"], row["factKey"])
        conflict = conflicts.get(key)
        if conflict is None:
            adjusted.append(row)
            continue
        if row["decision"] != "accepted" or conflict["resolution"] != "RETAIN_BASELINE":
            raise ValidationError(f"invalid baseline conflict decision: {key[0]} {key[1]}")
        adjusted.append({**row, "state": conflict["baselineState"], "value": conflict["baselineValue"]})
        applied.add(key)
    if applied != set(conflicts):
        raise ValidationError("baseline conflict decisions do not exactly match publishable claims")
    return adjusted


def _load_conflict_adjudication(
    input_root: Path,
    result_root: Path,
    baseline: Path,
) -> tuple[dict[tuple[str, str], dict[str, str]], Path | None]:
    root = input_root.resolve().parent / "baseline-conflict-adjudication-v2"
    if not root.exists():
        return {}, None
    members = {"APPLY-RULES.md", "adjudication-summary.json", "conflicts.csv", "validate_adjudication.py"}
    verify_manifest(root, root / "MANIFEST.sha256", members)
    check = subprocess.run(
        [
            sys.executable,
            str(root / "validate_adjudication.py"),
            "--root", str(root),
            "--panel-result", str(result_root),
            "--baseline", str(baseline),
            "--panel-input", str(input_root),
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    if check.returncode != 0:
        raise ValidationError(f"baseline conflict adjudication failed: {check.stderr.strip() or check.stdout.strip()}")
    rows = read_csv(root / "conflicts.csv", CONFLICT_FIELDS)
    return {(row["workId"], row["factKey"]): row for row in rows}, root


def _target_semantic_snapshot(path: Path | sqlite3.Connection, work_id: str) -> dict[str, object]:
    """Read every work-owned source row without projection ordinals/line numbers."""

    tables = (
        "source_works", "source_aliases", "source_volumes", "source_factors",
        "source_themes", "source_evidence", "source_recommendation_context",
        "source_art_evidence_manifest",
    )
    owned = not isinstance(path, sqlite3.Connection)
    connection = sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True) if owned else path
    previous_factory = connection.row_factory
    connection.row_factory = sqlite3.Row
    try:
        snapshot: dict[str, list[dict[str, object]]] = {}
        for table in tables:
            columns = [row[1] for row in connection.execute(f'pragma table_info("{table}")')]
            if not columns:
                continue
            owner = "id" if table == "source_works" else "workId"
            if owner not in columns:
                continue
            semantic = [column for column in columns if column not in {"sourceOrdinal", "sourceLine"}]
            rows = [
                {column: row[column] for column in semantic}
                for row in connection.execute(
                    f'select * from "{table}" where "{owner}"=?', (work_id,)
                )
            ]
            snapshot[table] = sorted(
                rows,
                key=lambda row: json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")),
            )
        return {"tables": snapshot, "sha256": sha256_bytes(json.dumps(snapshot, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))}
    finally:
        connection.row_factory = previous_factory
        if owned:
            connection.close()


def _protected_snapshot_evidence(row: dict[str, object]) -> bool:
    marker = " ".join(str(row.get(field, "")) for field in ("extractorVersion", "notes")).lower()
    return row.get("reviewedByHuman") != "false" or any(
        token in marker
        for token in ("authorizedevidencepanel", "authorizedmodelpanel", "priorclaimcorrection")
    )


def _validate_fresh_unreviewed_snapshots(
    input_root: Path,
    result_root: Path,
    frozen_baseline: Path,
    baseline: Path,
    prior_authority: dict[str, object],
) -> dict[str, dict[str, object]]:
    """Select PASS works whose raw, unreviewed candidate facts may be replaced exactly."""

    promotions = {
        row["workId"]: row
        for path in result_root.glob("chunk-??/promotion-ledger.csv")
        for row in read_csv(path, PROMOTION_FIELDS)
    }
    pass_ids = {work_id for work_id, row in promotions.items() if row["panelOutcome"] == "PASS"}
    if not pass_ids:
        return {}
    frozen_priors: dict[str, dict[tuple[str, str], dict[str, str]]] = {}
    for row in (
        row
        for path in (input_root / "chunks").glob("chunk-??/prior-panel-claims.csv")
        for row in read_csv(path, PRIOR_FIELDS)
        if row["decision"] == "accepted" and row["factType"] in {"axis", "genre", "theme"}
    ):
        key = (row["workId"], row["factKey"])
        if key in frozen_priors.setdefault(row["workId"], {}):
            raise ValidationError(f"duplicate prior accepted claim: {row['workId']} {row['factKey']}")
        frozen_priors[row["workId"]][key] = row
    result_rows: dict[tuple[str, str], dict[str, str]] = {}
    for row in (
        row
        for path in result_root.glob("chunk-??/evidence-panel-ledger.csv")
        for row in read_csv(path, LEDGER_FIELDS)
    ):
        key = (row["workId"], row["factKey"])
        if key in result_rows:
            raise ValidationError(f"ledger target/duplicate mismatch: {row['workId']} {row['factKey']}")
        result_rows[key] = row
    decision_ids = {key[0] for key in panel_validation.load_prior_decisions(input_root)}
    gold_ids = set(_read_json(_repo_root() / "data/staging/catalog-expansion/gold-set-manifest.json")["workIds"])
    selected: dict[str, dict[str, object]] = {}
    for work_id in sorted(pass_ids):
        frozen = _target_semantic_snapshot(frozen_baseline, work_id)
        current = _target_semantic_snapshot(baseline, work_id)
        frozen_works = frozen["tables"].get("source_works", [])
        current_works = current["tables"].get("source_works", [])
        if len(frozen_works) != 1 or len(current_works) != 1:
            raise ValidationError(f"fresh snapshot target missing or duplicated: {work_id}")
        frozen_work, current_work = frozen_works[0], current_works[0]
        methods = {frozen_work.get("annotationReviewMethod"), current_work.get("annotationReviewMethod")}
        if "unreviewed" not in methods:
            continue
        if work_id in decision_ids:
            # Explicit prior corrections remain on their existing path.
            continue
        raw_state = {
            "annotationReviewMethod": "unreviewed", "onboardingEligible": "false",
            "recommendationEligible": "false", "libraryOnly": "true",
        }
        if work_id in gold_ids or any(
            any(work.get(field) != value for field, value in raw_state.items())
            for work in (frozen_work, current_work)
        ):
            raise ValidationError(f"fresh snapshot requires raw unreviewed libraryOnly target: {work_id}")
        if frozen["sha256"] != current["sha256"]:
            raise ValidationError(f"fresh snapshot frozen/current target binding mismatch: {work_id}")
        evidence = current["tables"].get("source_evidence", [])
        evidence_by_id = {str(row.get("id", "")): row for row in evidence}
        factors = current["tables"].get("source_factors", [])
        if {row.get("axisId") for row in factors} != set(AXES) or len(factors) != len(AXES):
            raise ValidationError(f"fresh snapshot baseline 17-axis membership mismatch: {work_id}")
        themes = current["tables"].get("source_themes", [])
        if any(not str(row.get("evidenceId", "")) or str(row["evidenceId"]) not in evidence_by_id for row in factors + themes):
            raise ValidationError(f"fresh snapshot baseline fact evidence ownership mismatch: {work_id}")
        materialized = [row for row in factors if row.get("state") in {"known", "notApplicable"}] + themes
        genre_evidence_id = str(current_work.get("evidenceId", ""))
        if current_work.get("genres"):
            if not genre_evidence_id or genre_evidence_id not in evidence_by_id:
                raise ValidationError(f"fresh snapshot baseline Genre evidence ownership mismatch: {work_id}")
            materialized.append({"evidenceId": genre_evidence_id})
        if any(_protected_snapshot_evidence(evidence_by_id[str(row["evidenceId"])]) for row in materialized):
            raise ValidationError(f"fresh snapshot materialized fact has protected reviewed evidence: {work_id}")
        if any(evidence_by_id[str(row["evidenceId"])].get("sourceType") != "model" for row in materialized):
            raise ValidationError(f"fresh snapshot materialized facts require raw model evidence: {work_id}")
        prior_keys = set(frozen_priors.get(work_id, {}))
        authority_keys = {key for key in prior_authority.get("claims", {}) if key[0] == work_id}
        if prior_keys != authority_keys:
            raise ValidationError(f"fresh snapshot prior/manifest authority key mismatch: {work_id}")
        for key, original in sorted(frozen_priors.get(work_id, {}).items()):
            panel_validation.require_prior_claim(original, prior_authority)
            panel_validation.preserved_prior(original, result_rows.get(key), {})
        selected[work_id] = {
            "bindingSha256": current["sha256"],
            "beforeFactors": {str(row["axisId"]): row for row in factors},
            "beforeThemes": themes,
            "beforeGenres": str(current_work.get("genres", "")),
        }
    return selected


def _backend_module(
    safety: dict[str, object] | None = None,
    prior_evidence: dict[str, dict[str, str]] | None = None,
    conflicts: dict[tuple[str, str], dict[str, str]] | None = None,
    prior_authority: dict[str, object] | None = None,
    prior_corrections: dict[tuple[str, str], dict[str, object]] | None = None,
    fresh_snapshots: dict[str, dict[str, object]] | None = None,
    recovery_snapshots: dict[str, dict[str, object]] | None = None,
) -> types.ModuleType:
    repo = _repo_root()
    backend_path = LEGACY / "followup-panel-tools" / "publish_authorized_followup.py"
    if not backend_path.is_file():
        raise ValidationError(f"verified cumulative publisher backend missing: {backend_path}")
    adapter = types.ModuleType("validate_panel_results")
    for name in (
        "AXES", "LEDGER_FIELDS", "PROMOTION_FIELDS", "TARGET_FIELDS", "PRIOR_FIELDS",
        "SUPPLEMENTAL_FIELDS", "ORIGINAL_EVIDENCE_FIELDS", "CONTEXT_FIELDS",
        "ValidationError", "read_csv", "split_list", "citation_digest", "fact_kind",
        "validate_input", "validate",
    ):
        setattr(adapter, name, globals()[name])
    if prior_evidence is not None:
        adapter.validate = lambda input_root, result_root: validate(input_root, result_root, prior_evidence, prior_authority)
    previous = sys.modules.get("validate_panel_results")
    sys.modules["validate_panel_results"] = adapter
    try:
        spec = importlib.util.spec_from_file_location("_verified_factor_publisher_backend", backend_path)
        if spec is None or spec.loader is None:
            raise ValidationError(f"cannot load publisher backend: {backend_path}")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
    finally:
        if previous is None:
            sys.modules.pop("validate_panel_results", None)
        else:
            sys.modules["validate_panel_results"] = previous

    # Identity registration emits semicolons; historical registry rows use pipes.
    # Match packet construction without rewriting either frozen source artifact.
    module._split_provenance = lambda value, separator=";": {
        item.strip() for item in re.split(r"[;|]" if separator == "|" else re.escape(separator), str(value or "")) if item.strip()
    }

    original_find_repo_file = module._find_repo_file
    moved_followup_root = artifact_path(
        repo / ".workspace/catalog-followup/batch001-20260902/konocomics-v5-panel-batch-001-of-008"
    ).resolve()

    def find_repo_file(relative: Path) -> Path | None:
        found = original_find_repo_file(relative)
        if found is not None or Path(relative) != module.ALIAS_RESOLUTION_RELATIVE:
            return found
        candidate = (moved_followup_root / relative).resolve()
        return candidate if candidate.is_file() and not candidate.is_symlink() else None

    module._find_repo_file = find_repo_file

    original_find_review = module._find_review_source
    original_reviews_verified = False

    def find_review_source(reference: str, **kwargs: object) -> Path | None:
        nonlocal original_reviews_verified
        found = original_find_review(reference, **kwargs)
        if found is not None:
            return found
        baseline_db = Path(kwargs["baseline_db"])
        compact_review = _safe_child(baseline_db.resolve().parent / "data/source", reference)
        if (baseline_db.parent / "COMPACT-PUBLICATION.json").is_file() and compact_review.is_file() and not compact_review.is_symlink():
            return compact_review.resolve()
        review_root = baseline_db.resolve().parent / "authorized-evidence-panel-v1" / "data" / "source"
        candidate = _safe_child(review_root, reference)
        if candidate.is_file() and not candidate.is_symlink():
            return candidate.resolve()
        if not recovery_snapshots:
            return None
        original_root = ROOT / "runs/continuation-factor-233-publication-20260909-v1"
        original_db = original_root / "catalog-expanded.candidate.sqlite"
        if sha256(original_db) != factor_recovery.INITIAL:
            raise ValidationError("recovery historical review source changed from original 233")
        if not original_reviews_verified:
            _verify_result_manifest(original_root)
            original_reviews_verified = True
        fields = "id,title,creators,annotationReviewMethod,annotationReviewedAt,annotationReviewReference,evidenceId"
        with closing(sqlite3.connect(f"file:{baseline_db.resolve().as_posix()}?mode=ro", uri=True)) as current_con, closing(sqlite3.connect(f"file:{original_db.as_posix()}?mode=ro", uri=True)) as original_con:
            current_rows = current_con.execute(f"select {fields} from source_works where annotationReviewReference=?", (reference,)).fetchall()
            original_rows = set(original_con.execute(f"select {fields} from source_works where annotationReviewReference=?", (reference,)))
            if not current_rows or any(row not in original_rows for row in current_rows):
                raise ValidationError(f"recovery historical review identity mismatch: {reference}")
        historical = _safe_child(original_root / "authorized-evidence-panel-v1/data/source", reference)
        return historical.resolve() if historical.is_file() and not historical.is_symlink() else None

    module._find_review_source = find_review_source

    original_evidence_row = module._evidence_row

    def evidence_row(evidence_id: str, source: dict[str, str], **kwargs: object) -> dict[str, str]:
        # Catalog evidence requires an offset datetime even when collection
        # records only a date. Apply at the shared claim/source/context boundary.
        fetched_at = _safety_fetched_at(source.get("fetchedAt") or source.get("retrievedAt", ""))
        return original_evidence_row(evidence_id, {**source, "fetchedAt": fetched_at}, **kwargs)

    module._evidence_row = evidence_row

    original_build = module._build_plan
    corrections = prior_corrections or {}
    recovery = recovery_snapshots or {}
    fresh = {**(fresh_snapshots or {}), **recovery}
    verified_legacy_lists: set[str] = set()

    def backend_split_list(value: str, label: str) -> list[str]:
        # The frozen backend also parses claim IDs and stored bindings. Permit
        # legacy order only during a build whose full rows were proven below.
        if value in verified_legacy_lists:
            return panel_validation.split_list(value, label, require_sorted=False)
        return split_list(value, label)

    adapter.split_list = backend_split_list

    def factor_only_build(*args: object, **kwargs: object) -> dict[str, object]:
        # Work review timestamps share the product's offset-datetime contract.
        args = (*args[:6], _safety_fetched_at(args[6]), *args[7:])
        rows: list[dict[str, str]] = args[0]  # type: ignore[assignment]
        promotion: dict[str, dict[str, str]] = args[1]  # type: ignore[assignment]
        baseline = args[5]
        protected = {work_id for work_id in promotion if baseline["works"][work_id].get("annotationReviewMethod") == "authorizedModelPanel"}
        if protected:
            raise module.PublishError(f"immutable legacy authorizedModelPanel targets: {sorted(protected)}")
        correction_ids = {key[0] for key in corrections if key[1].startswith("axis:")}
        if set(corrections) & set(conflicts or {}):
            raise module.PublishError("prior correction overlaps retained-baseline conflict")
        fresh_ids = set(fresh)
        if fresh_ids & correction_ids:
            raise module.PublishError(f"fresh snapshot overlaps prior correction: {sorted(fresh_ids & correction_ids)}")
        effective_baseline = copy.deepcopy(baseline) if corrections or fresh else baseline
        by_key = {(row["workId"], row["factKey"]): row for row in rows}
        for work_id in sorted(fresh_ids):
            effective_baseline["works"][work_id]["genres"] = ""
            for axis in AXES:
                current = effective_baseline["factors"].get((work_id, axis))
                if current is None:
                    raise module.PublishError(f"fresh snapshot axis absent from baseline: {work_id} {axis}")
                effective_baseline["factors"][(work_id, axis)] = {
                    **current, "state": "unknown", "value": "", "confidence": "",
                }
            effective_baseline["themes"] = {
                key: value for key, value in effective_baseline["themes"].items()
                if key[0] != work_id
            }
            if work_id in recovery:
                effective_baseline["contexts"][work_id] = []
                effective_baseline["works"][work_id].update(recommendationEligible="false", libraryOnly="true")
        for key, correction in corrections.items():
            if not key[1].startswith("axis:"):
                kind, name = fact_kind(key[1])
                present = name in baseline["works"][key[0]]["genres"].split(";") if kind == "genre" else (key[0], name) in baseline["themes"]
                current = baseline["works"][key[0]] if kind == "genre" else baseline["themes"].get((key[0], name))
                digest = panel_validation.baseline_stored_tag_digest(*key, current) if present else panel_validation.baseline_absent_tag_digest(*key)
                if digest != correction["decision"]["baselineSemanticSha256"]:
                    raise module.PublishError(f"tag baseline changed after validation: {key}")
                result = by_key.get(key)
                if present and (correction["decision"]["action"] != "REPLACE" or result is None or (result["decision"], result["state"], result["value"]) != ("accepted", "known", "true" if kind == "genre" else current["centrality"])):
                    raise module.PublishError(f"stored Genre/Theme correction must preserve its stored value: {key}")
                if panel_validation.claim_semantic_digest(result) != correction["decision"]["resultSemanticSha256"]:
                    raise module.PublishError(f"correction result changed after validation: {key}")
                continue
            current = baseline["factors"].get((key[0], key[1].split(":", 1)[1]))
            if current is None or panel_validation.baseline_axis_digest(current) != correction["decision"]["baselineSemanticSha256"]:
                raise module.PublishError(f"correction baseline changed after validation: {key}")
            row = by_key.get(key)
            if row is None or panel_validation.claim_semantic_digest(row) != correction["decision"]["resultSemanticSha256"]:
                raise module.PublishError(f"correction result changed after validation: {key}")
            effective_baseline["factors"][(key[0], current["axisId"])] = {**current, **{field: row[field] for field in ("state", "value", "confidence")}}
        for work_id in correction_ids:
            if promotion[work_id]["panelOutcome"] == "BLOCKED":
                effective_baseline["works"][work_id].update(recommendationEligible="false", libraryOnly="true")
        publishable = [row for row in rows if promotion[row["workId"]]["panelOutcome"] == "PASS" or row["workId"] in recovery or (row["workId"] in correction_ids and row["factKey"].startswith("axis:"))]
        publishable = _apply_conflict_decisions(publishable, conflicts or {})
        publishable_ids = {work_id for work_id, item in promotion.items() if item["panelOutcome"] == "PASS"}
        build_args = list(args)
        build_args[5] = effective_baseline
        filtered_kwargs = dict(kwargs)
        if "packets" in filtered_kwargs:
            filtered_kwargs["packets"] = {
                work_id: packet for work_id, packet in filtered_kwargs["packets"].items()
                if work_id in publishable_ids | correction_ids | set(recovery)
            }
        if prior_evidence:
            frozen = dict(build_args[4])  # type: ignore[arg-type]
            for evidence_id, source in prior_evidence.items():
                frozen[evidence_id] = {
                    "id": evidence_id,
                    "workId": source["workId"],
                    "targetType": "work",
                    "targetId": source["workId"],
                    "sourceType": source["sourceType"],
                    "sourceUrl": source["sourceUrl"],
                    "fetchedAt": _safety_fetched_at(source["retrievedAt"]),
                    "extractorVersion": "priorAuthorizedPanelV1",
                    "reviewedByHuman": "false",
                    "confidence": "0.99",
                    "notes": f"{source['observation']} {source['limitation']}",
                }
            build_args[4] = frozen
        if safety is not None:
            safety_claims: dict[str, dict[str, str]] = safety["claims"]  # type: ignore[assignment]
            safety_evidence: dict[str, dict[str, str]] = safety["evidence"]  # type: ignore[assignment]
            if set(safety_claims) != publishable_ids:
                raise module.PublishError("safety SAFE membership does not match factor PASS membership")
            frozen: dict[str, dict[str, str]] = dict(build_args[4])  # type: ignore[arg-type]
            prior: dict[str, dict[str, str]] = dict(filtered_kwargs.get("prior", {}))  # type: ignore[arg-type]
            packets: dict[str, dict[str, object]] = filtered_kwargs.get("packets", {})  # type: ignore[assignment]
            for evidence_id, source in safety_evidence.items():
                frozen[evidence_id] = {
                    "id": evidence_id, "workId": source["workId"], "targetType": "work",
                    "targetId": source["workId"], "sourceType": source["sourceType"],
                    "sourceUrl": source["sourceUrl"], "fetchedAt": _safety_fetched_at(source["retrievedAt"]),
                    "confidence": "0.99", "notes": source["audienceClassification"] + "; " + source["observation"] + " " + source["limitation"],
                    "observation": source["observation"], "limitation": source["limitation"],
                }
            for work_id, claim in safety_claims.items():
                packet_digest = packets.get(work_id, {}).get("_packetDigest")
                if not isinstance(packet_digest, str):
                    raise module.PublishError(f"safety packet digest missing: {work_id}")
                prior[f"{work_id}\x1fscope:safety"] = {**claim, "packetDigest": packet_digest}
            build_args[4] = frozen
            filtered_kwargs["prior"] = prior
        legacy_lists: set[str] = set()
        for row in publishable:
            for field in ("evidenceIds", "citationUrls"):
                value = row.get(field, "")
                items = panel_validation.split_list(value, field, require_sorted=False)
                if items != sorted(items):
                    # Never let a new/tampered row borrow another claim's list.
                    panel_validation.require_prior_claim(row, prior_authority or {"claims": {}, "evidence": {}})
                    if (row["workId"], row["factKey"]) in corrections:
                        raise ValidationError("replacement claims require sorted evidence lists")
                    legacy_lists.add(value)
        verified_legacy_lists.update(legacy_lists)
        try:
            plan = original_build(publishable, *build_args[1:], **filtered_kwargs)
        finally:
            verified_legacy_lists.clear()
        plan["legacyPassIds"] = []
        plan["evidenceNormalizations"] = {}
        plan["priorCorrections"] = []
        plan["tagCorrections"] = []
        plan["freshSnapshots"] = {}
        plan["correctionAxisSnapshot"] = {work_id: {row["factKey"].split(":", 1)[1]: {field: row[field] for field in ("state", "value")} for row in rows if row["workId"] == work_id and row["factKey"].startswith("axis:")} for work_id in correction_ids}
        plan["correctionPanelCoverage"] = {key[0]: item["coverage"] for key, item in corrections.items()}
        plan["correctionBlockedIds"] = sorted(work_id for work_id in correction_ids if promotion[work_id]["panelOutcome"] == "BLOCKED")
        plan["correctionReviewedAt"], plan["correctionReviewReference"] = args[6], args[7]
        for key, correction in sorted(corrections.items()):
            row = by_key.get(key)
            if row is None:
                row = {**correction["prior"], "authorityArtifactDigest": next(item["authorityArtifactDigest"] for item in rows if item["workId"] == key[0])}
            decision = correction["decision"]
            payload = {**decision, "authorityArtifactDigest": row["authorityArtifactDigest"]}
            claim_id = "ev-authorized-correction-" + sha256_bytes(json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))
            if claim_id in baseline["evidence"] or claim_id in plan["newEvidence"]:
                raise module.PublishError(f"correction evidence ID collision: {claim_id}")
            if decision["action"] == "REPLACE":
                ids = split_list(row["evidenceIds"], "replacement evidenceIds")
                sources = [args[3].get(evidence_id) for evidence_id in ids]
                if not sources or any(source is None or source["workId"] != key[0] for source in sources):
                    raise module.PublishError(f"replacement lacks new same-work evidence: {key}")
                source = sources[0]
                for evidence_id, original in zip(ids, sources):
                    stored_id = module._canonical_evidence_id(evidence_id)
                    if stored_id not in baseline["evidence"] and stored_id not in plan["newEvidence"]:
                        plan["newEvidence"][stored_id] = module._evidence_row(stored_id, original, panel_row=row, original_evidence_id=evidence_id)
            else:
                # This records the withdrawal decision, not numeric support from
                # the withdrawn citation. Old claim/source rows remain intact.
                source = {"sourceType": "manual", "sourceUrl": correction["prior"]["citationUrls"].split(";")[0], "fetchedAt": args[6]}
            claim = module._evidence_row(claim_id, source, panel_row=row)
            claim["notes"] += " | priorClaimCorrectionV1|" + json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
            plan["newEvidence"][claim_id] = claim
            if not key[1].startswith("axis:"):
                retained = correction["before"].get("state") != "absent"
                plan["tagCorrections"].append({"decision": decision, "before": correction["before"], "after": correction["result"], "correctionEvidenceId": claim_id, "retainedStoredTag": retained, "published": retained or (promotion[key[0]]["panelOutcome"] == "PASS" and correction["result"] is not None)})
                continue
            update = {"workId": key[0], "axisId": key[1].split(":", 1)[1], "state": row["state"], "value": row["value"], "confidence": row["confidence"], "evidenceId": claim_id}
            if any((item["workId"], item["axisId"]) == (update["workId"], update["axisId"]) for item in plan["factorUpdates"]):
                raise module.PublishError(f"duplicate factor correction plan: {key}")
            plan["factorUpdates"].append(update)
            plan["priorCorrections"].append({"decision": decision, "before": correction["before"], "after": update})
            plan["changedClaimCount"] += 1
            if row["decision"] == "notApplicable":
                plan["acceptedClaimCount"] += 1
        supplemental: dict[str, dict[str, str]] = args[3]  # type: ignore[assignment]
        frozen: dict[str, dict[str, str]] = args[4]  # type: ignore[assignment]
        baseline: dict[str, object] = args[5]  # type: ignore[assignment]
        factors: dict[tuple[str, str], dict[str, str]] = build_args[5]["factors"]  # type: ignore[index,assignment]
        evidence: dict[str, dict[str, str]] = baseline["evidence"]  # type: ignore[assignment]
        for row in sorted((item for item in publishable if item["decision"] == "notApplicable"), key=lambda item: (item["workId"], item["factKey"])):
            if (row["workId"], row["factKey"]) in corrections:
                continue
            kind, axis = fact_kind(row["factKey"])
            current = factors.get((row["workId"], axis))
            if kind != "axis" or current is None:
                raise module.PublishError(f"notApplicable axis absent from baseline: {row['workId']} {axis}")
            if current["state"] == "notApplicable":
                continue
            if current["state"] != "unknown":
                raise module.PublishError(f"notApplicable baseline axis conflict: {row['workId']} {axis}")
            claim_id = module._claim_evidence_id(row)
            ids = split_list(row["evidenceIds"], f"{row['workId']} evidenceIds")
            sources = [supplemental.get(evidence_id) or frozen.get(evidence_id) or evidence.get(evidence_id) for evidence_id in ids]
            source = next((item for item in sources if item), None)
            if source is None:
                raise module.PublishError(f"notApplicable claim has no evidence: {row['workId']} {axis}")
            claim_source = dict(source)
            claim_source["sourceUrl"] = split_list(row["citationUrls"], f"{row['workId']} citationUrls")[0]
            plan["factorUpdates"].append({
                "workId": row["workId"], "axisId": axis, "state": "notApplicable",
                "value": "", "confidence": row["confidence"], "evidenceId": claim_id,
            })
            plan["newEvidence"][claim_id] = module._evidence_row(claim_id, claim_source, panel_row=row)
            plan["changedClaimCount"] += 1
            plan["acceptedClaimCount"] += 1
        if safety is not None:
            baseline_evidence: dict[str, dict[str, str]] = build_args[5]["evidence"]  # type: ignore[index,assignment]
            safety_evidence = safety["evidence"]  # type: ignore[assignment]
            safety_claims = safety["claims"]  # type: ignore[assignment]
            artifact_digest = str(safety["artifactDigest"])
            for evidence_id, source in sorted(safety_evidence.items()):
                existing = baseline_evidence.get(evidence_id)
                if existing is not None:
                    if existing.get("workId") != source["workId"] or existing.get("sourceUrl") != source["sourceUrl"]:
                        raise module.PublishError(f"existing safety evidence collision: {evidence_id}")
                    continue
                claim = safety_claims[source["workId"]]
                panel_row = {
                    **claim, "confidence": "0.99", "entryScope": "whole_work",
                    "authorityKind": "authorizedEvidencePanelV1",
                    "authorityArtifactDigest": artifact_digest,
                    "citationSetDigest": citation_digest(split_list(claim["citationUrls"], "safety citationUrls")),
                }
                materialized = module._evidence_row(
                    evidence_id,
                    {**source, "targetType": "work", "targetId": source["workId"], "fetchedAt": _safety_fetched_at(source["retrievedAt"])},
                    panel_row=panel_row,
                    authority_artifact_digest=artifact_digest,
                    citation_set_digest=panel_row["citationSetDigest"],
                )
                materialized["notes"] = source["audienceClassification"] + "; " + materialized["notes"]
                plan["newEvidence"][evidence_id] = materialized
        for work_id in sorted(fresh_ids):
            axis_rows = {
                row["factKey"].split(":", 1)[1]: row
                for row in rows
                if row["workId"] == work_id and row["factKey"].startswith("axis:")
            }
            if set(axis_rows) != set(AXES):
                raise module.PublishError(f"fresh snapshot ledger 17-axis membership mismatch: {work_id}")
            planned_factors = {
                row["axisId"]: row for row in plan["factorUpdates"] if row["workId"] == work_id
            }
            exact_factors = []
            for axis in AXES:
                ledger = axis_rows[axis]
                before = fresh[work_id]["beforeFactors"][axis]
                if ledger["state"] == "unknown":
                    unknown_id = before["evidenceId"]
                    if work_id in recovery:
                        unknown_id = module._claim_evidence_id(ledger)
                        source = {"sourceType": "manual", "sourceUrl": "", "fetchedAt": args[6]}
                        plan["newEvidence"][unknown_id] = module._evidence_row(unknown_id, source, panel_row=ledger)
                        plan["newEvidence"][unknown_id]["notes"] += " | recoveryExplicitUnknownV1; new ledger decision, not missing-file inference"
                    after = {
                        "workId": work_id, "axisId": axis, "state": "unknown",
                        "value": "", "confidence": "", "evidenceId": unknown_id,
                    }
                    plan["factorUpdates"].append(after)
                    if any(str(before[field]) != after[field] for field in ("state", "value", "confidence", "evidenceId")):
                        plan["changedClaimCount"] += 1
                else:
                    after = planned_factors.get(axis)
                    if after is None or after["evidenceId"] not in plan["newEvidence"]:
                        raise module.PublishError(f"fresh snapshot known axis lacks fresh decision evidence: {work_id} {axis}")
                if not after["evidenceId"]:
                    raise module.PublishError(f"fresh snapshot factor evidenceId missing: {work_id} {axis}")
                exact_factors.append({"before": before, "after": after})
            theme_rows = sorted(
                (row for row in rows if row["workId"] == work_id and row["factKey"].startswith("theme:") and row["decision"] == "accepted"),
                key=lambda row: row["factKey"],
            )
            planned_themes = {(row["workId"], row["themeId"]): row for row in plan["themeInserts"]}
            exact_themes = []
            for row in theme_rows:
                name = row["factKey"].split(":", 1)[1]
                after = planned_themes.get((work_id, name))
                if after is None or after["evidenceId"] not in plan["newEvidence"]:
                    raise module.PublishError(f"fresh snapshot theme lacks fresh decision evidence: {work_id} {name}")
                exact_themes.append(after)
            genre_rows = sorted(
                (row for row in rows if row["workId"] == work_id and row["factKey"].startswith("genre:") and row["decision"] == "accepted"),
                key=lambda row: row["factKey"],
            )
            genre_names = [row["factKey"].split(":", 1)[1] for row in genre_rows]
            for row in genre_rows:
                claim_id = module._claim_evidence_id(row)
                if claim_id not in plan["newEvidence"]:
                    raise module.PublishError(f"fresh snapshot genre lacks fresh decision evidence: {work_id} {row['factKey']}")
            plan["genreUpdates"][work_id] = ";".join(genre_names)
            plan["freshSnapshots"][work_id] = {
                **fresh[work_id], "factorRows": exact_factors, "afterThemes": exact_themes,
                "afterGenres": plan["genreUpdates"][work_id],
                "genreEvidenceIds": [module._claim_evidence_id(row) for row in genre_rows],
            }
        plan["recoverySnapshots"] = {wid: plan["freshSnapshots"].pop(wid) for wid in recovery}
        plan["recoveryPromotions"] = {wid: promotion[wid] for wid in recovery}
        plan["recoveryReviewedAt"], plan["recoveryReviewReference"] = args[6], args[7]
        if recovery:
            # Rebind context through the new ledger without mutating old evidence.
            for raw_id, update in list(plan.get("evidenceUpdates", {}).items()):
                old = baseline["evidence"].get(raw_id)
                if old and old["workId"] in recovery:
                    wid = old["workId"]
                    context = args[2][wid]
                    eid = "ev-recovery-context-" + sha256_bytes((recovery[wid]["epochSha256"] + filtered_kwargs["chunk_digests"][wid] + raw_id).encode())
                    plan["newEvidence"][eid] = module._context_evidence_row(context, eid, old, authority_artifact_digest=filtered_kwargs["chunk_digests"][wid], original_evidence_id=raw_id)
                    del plan["evidenceUpdates"][raw_id]
        _materialize_existing_context_evidence(module, plan, {wid: row for wid, row in promotion.items() if wid not in recovery}, args[2], args[3], build_args[4], baseline, filtered_kwargs.get("packets", {}), filtered_kwargs.get("chunk_digests", {}), args[7])
        for collection in (plan["newEvidence"], plan.get("evidenceUpdates", {})):
            for row in collection.values():
                row["notes"] = row["notes"].replace("\r\n", "\n").replace("\r", "\n").replace("\n", "; ")
        plan["correctionAxisUpdates"] = [{"before": args[5]["factors"][(row["workId"], row["axisId"])], "after": row, "explicitPriorDecision": (row["workId"], f"axis:{row['axisId']}") in corrections} for row in plan["factorUpdates"] if row["workId"] in correction_ids]
        return plan

    module._build_plan = factor_only_build
    if corrections or fresh_snapshots:
        _install_correction_materializer(module)
    _install_context_evidence_materializer(module)
    if recovery:
        _install_recovery_materializer(module)
    return module


def _context_bindings(notes: str) -> list[dict]:
    bindings = []
    for match in re.finditer(r"authorizedEvidencePanelV1\|", notes):
        try:
            value, _ = json.JSONDecoder().raw_decode(notes[match.end():])
        except ValueError:
            continue
        if isinstance(value, dict) and value.get("factKey") == "work:recommendationContext":
            bindings.append(value)
    return bindings


def _install_recovery_materializer(module: types.ModuleType) -> None:
    """Replace only declared targets; retain every historical evidence row."""
    path = LEGACY / "integration-publisher-v1/integrate.py"
    spec = importlib.util.spec_from_file_location("_recovery_integration", path)
    assert spec and spec.loader
    integration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(integration)
    original_apply, original_verify = module.apply_plan_in_transaction, module._verify_preservation

    def without_recovery(plan):
        ids = set(plan["recoverySnapshots"])
        result = dict(plan)
        for key in ("factorUpdates", "themeInserts", "contextInserts"):
            result[key] = [row for row in plan[key] if row["workId"] not in ids]
        result["workUpdates"] = [row for row in plan["workUpdates"] if row["id"] not in ids]
        result["genreUpdates"] = {wid: value for wid, value in plan["genreUpdates"].items() if wid not in ids}
        result["passIds"] = [wid for wid in plan["passIds"] if wid not in ids]
        return result

    def expected_work(before, wid, plan):
        active = plan["recoveryPromotions"][wid]["panelOutcome"] == "PASS"
        return {**before, "genres": plan["recoverySnapshots"][wid]["afterGenres"],
                "onboardingEligible": "true" if active else "false", "recommendationEligible": "true" if active else "false", "libraryOnly": "false" if active else "true",
                "annotationReviewMethod": "authorizedEvidencePanel",
                "annotationReviewedAt": plan["recoveryReviewedAt"], "annotationReviewReference": plan["recoveryReviewReference"]}

    def apply(con, plan):
        snapshots = plan["recoverySnapshots"]
        for wid, snapshot in snapshots.items():
            if _target_semantic_snapshot(con, wid)["sha256"] != snapshot["bindingSha256"]:
                raise module.PublishError(f"recovery target changed before apply: {wid}")
        original_apply(con, without_recovery(plan))
        for wid, snapshot in sorted(snapshots.items()):
            for item in snapshot["factorRows"]:
                before, after = item["before"], item["after"]
                values = tuple(after[k] for k in ("state", "value", "confidence", "evidenceId")) + (wid, after["axisId"]) + tuple(before[k] for k in ("state", "value", "confidence", "evidenceId"))
                if con.execute("update source_factors set state=?,value=?,confidence=?,evidenceId=? where workId=? and axisId=? and state=? and value=? and confidence=? and evidenceId=?", values).rowcount != 1:
                    raise module.PublishError(f"recovery exact factor binding lost: {wid}")
            con.execute("delete from source_themes where workId=?", (wid,))
            ordinal = con.execute("select coalesce(max(sourceOrdinal),0)+1 from source_themes").fetchone()[0]
            for row in snapshot["afterThemes"]:
                con.execute("insert into source_themes values(?,?,?,?,?,?,?)", (ordinal, ordinal + 1, wid, row["themeId"], row["centrality"], row["confidence"], row["evidenceId"]))
                ordinal += 1
            con.execute("delete from source_recommendation_context where workId=?", (wid,))
            contexts = [row for row in plan["contextInserts"] if row["workId"] == wid]
            active = plan["recoveryPromotions"][wid]["panelOutcome"] == "PASS"
            if len(contexts) != (1 if active else 0):
                raise module.PublishError(f"recovery exact context plan mismatch: {wid}")
            for row in contexts:
                ordinal = con.execute("select coalesce(max(sourceOrdinal),0)+1 from source_recommendation_context").fetchone()[0]
                con.execute("insert into source_recommendation_context values(?,?,?,?,?,?,?,?)", (ordinal, ordinal + 1, wid, row["catalogRole"], row["seriesGroupId"], row["volumeCount"], row["reviewAverage"], row["reviewCount"]))
            before = snapshot["beforeSnapshot"]["tables"]["source_works"][0]
            final = expected_work(before, wid, plan)
            fields = ("genres", "onboardingEligible", "recommendationEligible", "libraryOnly", "annotationReviewMethod", "annotationReviewedAt", "annotationReviewReference")
            if con.execute("update source_works set " + ",".join(f'"{key}"=?' for key in fields) + " where id=?", (*[final[key] for key in fields], wid)).rowcount != 1:
                raise module.PublishError(f"recovery work missing: {wid}")
            *_, blockers = integration.coverage(con, wid)
            blockers = nt.filter_blockers(blockers, plan.get("narrativeToneExceptions", {}).get(wid))
            if active and blockers:
                raise module.PublishError(f"recovery PASS coverage readback failed: {wid}")
            expected_codes = set(plan["recoveryPromotions"][wid]["panelBlockerCode"].split(";")) - {"", "BLOCKED_SAFETY"}
            if set(blockers) != expected_codes:
                raise module.PublishError(f"recovery coverage/result mismatch: {wid}")
        integration.reindex_authority_projection(con, {"source_themes", "source_recommendation_context"})
        integration.validate_authority_projection(con)


    def verify(before, output, plan, gold_ids):
        after = module._snapshot_db(output)
        ids = set(plan["recoverySnapshots"])
        if ids & gold_ids:
            raise module.PublishError("recovery changed Gold target")
        projected = dict(before)
        for table in ("source_works", "source_factors", "source_themes", "source_recommendation_context"):
            columns, old_rows = before[table]
            _, new_rows = after[table]
            owner = "id" if table == "source_works" else "workId"
            semantic = [key for key in columns if key not in {"sourceOrdinal", "sourceLine"}]
            old = [dict(zip(columns, row)) for row in old_rows]
            new = [dict(zip(columns, row)) for row in new_rows]
            normalize = lambda rows: sorted(tuple(str(row[key]) for key in semantic) for row in rows)
            if normalize([r for r in old if r[owner] not in ids]) != normalize([r for r in new if r[owner] not in ids]):
                raise module.PublishError(f"recovery changed non-target semantics: {table}")
            for wid in ids:
                snapshot = plan["recoverySnapshots"][wid]
                if table == "source_works":
                    expected = [expected_work(snapshot["beforeSnapshot"]["tables"][table][0], wid, plan)]
                elif table == "source_factors":
                    expected = [item["after"] for item in snapshot["factorRows"]]
                elif table == "source_themes":
                    expected = snapshot["afterThemes"]
                else:
                    expected = [r for r in plan["contextInserts"] if r["workId"] == wid]
                if normalize([r for r in new if r[owner] == wid]) != normalize(expected):
                    raise module.PublishError(f"recovery full snapshot readback mismatch: {wid} {table}")
            # Target changes were checked against the sealed plan above. Keep
            # the original verifier for all evidence and untouched tables.
            projected[table] = after[table]
        original_verify(projected, output, without_recovery(plan), gold_ids)
        previous = module._rows_by_key(before, "source_evidence", "id")
        current = module._rows_by_key(after, "source_evidence", "id")
        if any(current.get(eid) != row for eid, row in previous.items()):
            raise module.PublishError("recovery changed historical evidence")
        for wid, snapshot in plan["recoverySnapshots"].items():
            evidence_ids = [item["after"]["evidenceId"] for item in snapshot["factorRows"]] + [row["evidenceId"] for row in snapshot["afterThemes"]] + snapshot["genreEvidenceIds"]
            if any(eid not in plan["newEvidence"] or current.get(eid, {}).get("workId") != wid for eid in evidence_ids):
                raise module.PublishError(f"recovery reuses old decision authority: {wid}")
        for eid, expected in plan["newEvidence"].items():
            if expected["workId"] in ids and any(current.get(eid, {}).get(key) != value for key, value in expected.items()):
                raise module.PublishError(f"recovery evidence contents readback mismatch: {eid}")
        after_snapshots = {}
        for wid in sorted(ids):
            tables = {}
            for table in factor_recovery.TABLES:
                columns, values = after[table]
                owner = "id" if table == "source_works" else "workId"
                rows = [dict(zip(columns, row)) for row in values]
                tables[table] = sorted(({key: value for key, value in row.items() if key not in {"sourceOrdinal", "sourceLine"}} for row in rows if row[owner] == wid), key=lambda row: json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
            after_snapshots[wid] = {"sha256": sha256_bytes(json.dumps(tables, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")), "work": tables["source_works"][0]}
        module.recovery_readback = {"workIds": sorted(ids), "demotedWorkIds": sorted(wid for wid in ids if plan["recoverySnapshots"][wid]["beforeSnapshot"]["tables"]["source_works"][0]["recommendationEligible"] == "true" and plan["recoveryPromotions"][wid]["panelOutcome"] != "PASS"), "snapshots": plan["recoverySnapshots"], "promotions": plan["recoveryPromotions"], "afterSnapshots": after_snapshots}

    module.apply_plan_in_transaction, module._verify_preservation = apply, verify


def _materialize_existing_context_evidence(module, plan, promotion, contexts, supplemental, frozen, baseline, packets, digests, review_reference):
    """An existing numeric context must not swallow a newly accepted source."""
    plan["contextEvidenceAppends"] = []
    plan["contextOnlyWorkUpdates"] = {}
    evidence = baseline["evidence"]
    for wid in sorted(promotion):
        if promotion[wid]["panelOutcome"] != "PASS" or not baseline["contexts"].get(wid):
            continue
        context, packet = contexts[wid], packets.get(wid, {})
        ids = split_list(context["evidenceIds"], f"{wid} context evidenceIds")
        urls = split_list(context["citationUrls"], f"{wid} context citationUrls")
        if ids != [packet.get("contextEvidenceId")] or not set(urls) <= set(packet.get("supportEvidenceUrls", [])):
            raise module.PublishError(f"existing context does not match frozen packet: {wid}")
        if not re.fullmatch(r"[0-9a-f]{64}", digests.get(wid, "")):
            raise module.PublishError(f"missing frozen chunk digest for existing context: {wid}")
        raw_id = ids[0]
        source = supplemental.get(raw_id) or frozen.get(raw_id)
        if source is None or source.get("workId") != wid or source.get("sourceUrl") not in urls:
            raise module.PublishError(f"missing or cross-work frozen existing-context source: {wid}")
        stored_id = module._canonical_evidence_id(raw_id)
        row = module._context_evidence_row(context, stored_id, source, authority_artifact_digest=digests[wid], original_evidence_id=raw_id)
        if stored_id in evidence:
            current = evidence[stored_id]
            expected = _context_bindings(row["notes"])[0]
            fields = ("authorityKind", "candidateOnly", "reviewedByHuman", "workId", "factKey", "evidenceIds", "citationUrls", "citationSetDigest", "entryScope", "decision", "observation", "limitation")
            matches = [b for b in _context_bindings(current.get("notes", "")) if all(b.get(k) == expected[k] for k in fields)]
            if raw_id != stored_id or current.get("workId") != wid or current.get("sourceUrl") != source["sourceUrl"] or current.get("sourceType") != row["sourceType"] or not matches:
                raise module.PublishError(f"existing context evidence ID reused with different binding; use a new ID: {raw_id}")
            continue
        if stored_id in plan["newEvidence"]:
            raise module.PublishError(f"context evidence ID collision: {stored_id}")
        old = {eid: item for eid, item in evidence.items() if item.get("workId") == wid and _context_bindings(item.get("notes", ""))}
        if set(old) & set(plan.get("evidenceUpdates", {})):
            raise module.PublishError(f"previous context evidence must remain immutable: {wid}")
        linkage = {"workId": wid, "priorReviewReference": baseline["works"][wid]["annotationReviewReference"], "reviewReference": review_reference,
                   "priorContextEvidenceSha256": {eid: sha256_bytes(json.dumps(item, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")) for eid, item in sorted(old.items())},
                   "replacementEvidenceId": stored_id, "numericContextPreserved": True, "candidateOnly": True, "reviewedByHuman": False}
        if not module.REVIEW_REFERENCE_RE.fullmatch(linkage["priorReviewReference"]) or linkage["priorReviewReference"] == review_reference:
            raise module.PublishError(f"context replacement requires a new review reference: {wid}")
        context_only = not any(r["workId"] == wid for key in ("factorUpdates", "themeInserts", "contextInserts") for r in plan.get(key, [])) and wid not in plan.get("genreUpdates", {})
        if context_only:
            work = baseline["works"][wid]
            if work.get("annotationReviewMethod") != "authorizedEvidencePanel":
                raise module.PublishError(f"context correction requires an existing AEP work: {wid}")
            if work.get("recommendationEligible") == "true" and work.get("libraryOnly") == "false":
                plan["contextOnlyWorkUpdates"][wid] = {k: work[k] for k in ("annotationReviewedAt", "annotationReviewReference")}
            elif work.get("recommendationEligible") == "false" and work.get("libraryOnly") == "true":
                # A new context may promote an otherwise unchanged, previously blocked AEP work.
                context_only = False
            else:
                raise module.PublishError(f"context correction baseline eligibility conflict: {wid}")
        linkage["contextOnly"] = context_only
        row["notes"] += " | contextSupersessionV1|" + json.dumps(linkage, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        plan["newEvidence"][stored_id] = row
        plan["contextEvidenceAppends"].append(linkage)


def _install_context_evidence_materializer(module):
    original_apply, original_review, original_verify = module.apply_plan_in_transaction, module._prepare_review_artifacts, module._verify_preservation

    def apply(con, plan):
        retained = plan.get("contextOnlyWorkUpdates", {})
        original_apply(con, {**plan, "workUpdates": [r for r in plan["workUpdates"] if r["id"] not in retained]})
        if retained:
            for update in plan["workUpdates"]:
                wid = update["id"]
                if wid not in retained:
                    continue
                old = retained[wid]
                changed = con.execute("update source_works set annotationReviewedAt=?,annotationReviewReference=? where id=? and annotationReviewedAt=? and annotationReviewReference=?", (update["annotationReviewedAt"], update["annotationReviewReference"], wid, old["annotationReviewedAt"], old["annotationReviewReference"]))
                if changed.rowcount != 1:
                    raise module.PublishError(f"context-only review update lost exact baseline: {wid}")


    def review(artifact_root, **kwargs):
        info = original_review(artifact_root, **kwargs)
        appends = kwargs["plan"].get("contextEvidenceAppends", [])
        if appends:
            path = artifact_root / info["reviewArtifactPath"]
            records = [{**item, "priorReviewSha256": info["reviewArtifacts"][item["priorReviewReference"]]} for item in appends]
            with path.open("a", encoding="utf-8", newline="\n") as stream:
                stream.write("\n## Recommendation context supersession\n\nThe new frozen context replaces the prior selection provenance for these works. Previous evidence and reviews remain historical records; numeric context rows are unchanged. Factor decisions remain in the separately validated ledger.\n\n```json\n" + json.dumps(records, ensure_ascii=False, indent=2, sort_keys=True) + "\n```\n")
            info["reviewArtifactSha256"] = sha256(path)
            info["reviewArtifacts"][kwargs["review_reference"]] = info["reviewArtifactSha256"]
        return info

    def verify(before, output, plan, gold_ids):
        retained = plan.get("contextOnlyWorkUpdates", {})
        projected = dict(before)
        if retained:
            # Project only the authorized review fields, then require the old
            # verifier to treat these rows as otherwise wholly immutable.
            columns, rows = before["source_works"]
            updates = {r["id"]: r for r in plan["workUpdates"]}
            expected = []
            for values in rows:
                row = dict(zip(columns, values))
                if row["id"] in retained:
                    row.update({k: updates[row["id"]][k] for k in ("annotationReviewedAt", "annotationReviewReference")})
                expected.append(tuple(row[k] for k in columns))
            projected["source_works"] = (columns, tuple(expected))
        original_verify(projected, output, {**plan, "passIds": [wid for wid in plan["passIds"] if wid not in retained]}, gold_ids)
        appends = plan.get("contextEvidenceAppends", [])
        if not appends:
            return
        after = module._snapshot_db(output)
        actual = module._rows_by_key(after, "source_evidence", "id")
        previous = module._rows_by_key(before, "source_evidence", "id")
        for item in appends:
            eid, wid = item["replacementEvidenceId"], item["workId"]
            if any(actual[eid][key] != value for key, value in plan["newEvidence"][eid].items()):
                raise module.PublishError(f"context evidence contents readback mismatch: {eid}")
            if any(actual[old] != previous[old] for old in item["priorContextEvidenceSha256"]):
                raise module.PublishError(f"previous context evidence changed: {wid}")
            columns = before["source_recommendation_context"][0]
            index = columns.index("workId")
            if tuple(r for r in before["source_recommendation_context"][1] if r[index] == wid) != tuple(r for r in after["source_recommendation_context"][1] if r[index] == wid):
                raise module.PublishError(f"existing numeric context changed: {wid}")

    module.apply_plan_in_transaction, module._prepare_review_artifacts, module._verify_preservation = apply, review, verify


def _validate_axis_corrections(input_root: Path, result_root: Path, frozen_baseline: Path, baseline: Path) -> dict[tuple[str, str], dict[str, object]]:
    decisions = panel_validation.load_prior_decisions(input_root)
    if not decisions:
        return {}
    priors = {(row["workId"], row["factKey"]): row for path in (input_root / "chunks").glob("chunk-??/prior-panel-claims.csv") for row in read_csv(path, PRIOR_FIELDS) if row["decision"] == "accepted"}
    results = {(row["workId"], row["factKey"]): row for path in result_root.glob("chunk-??/evidence-panel-ledger.csv") for row in read_csv(path, LEDGER_FIELDS)}
    coverage = {row["workId"]: row["coverage"] for path in result_root.glob("chunk-??/evidence-panel-summary.json") for row in _read_json(path)["works"]}
    corrections = {}
    gold_ids = set(_read_json(_repo_root() / "data/staging/catalog-expansion/gold-set-manifest.json")["workIds"])
    for database in dict.fromkeys((frozen_baseline, baseline)):
        owned = not isinstance(database, sqlite3.Connection)
        connection = sqlite3.connect(f"file:{database.resolve().as_posix()}?mode=ro", uri=True) if owned else database
        previous_factory = connection.row_factory
        connection.row_factory = sqlite3.Row
        try:
            for key, decision in decisions.items():
                work = connection.execute("select * from source_works where id=?", (key[0],)).fetchone()
                if key[0] in gold_ids or work is None or work["annotationReviewMethod"] not in {"unreviewed", "authorizedEvidencePanel"}:
                    raise ValidationError(f"immutable legacy or missing correction work: {key[0]}")
                kind, name = fact_kind(key[1])
                if kind == "axis":
                    row = connection.execute("select * from source_factors where workId=? and axisId=?", (key[0], name)).fetchone()
                    before = dict(row) if row is not None else None
                    digest = panel_validation.baseline_axis_digest(before) if before is not None else None
                else:
                    row = work if kind == "genre" else connection.execute("select * from source_themes where workId=? and themeId=?", (key[0], name)).fetchone()
                    present = name in work["genres"].split(";") if kind == "genre" else row is not None
                    if present:
                        result = results.get(key)
                        if decision["action"] != "REPLACE" or result is None or (result["decision"], result["state"], result["value"]) != ("accepted", "known", "true" if kind == "genre" else row["centrality"]):
                            raise ValidationError(f"stored Genre/Theme correction must preserve its stored value: {key}")
                        before = dict(row)
                        digest = panel_validation.baseline_stored_tag_digest(*key, before)
                    else:
                        before = {"workId": key[0], "factKey": key[1], "state": "absent"}
                        digest = panel_validation.baseline_absent_tag_digest(*key)
                if digest != decision["baselineSemanticSha256"]:
                    raise ValidationError(f"correction baseline semantic binding mismatch: {key}")
                prior, result = priors.get(key), results.get(key)
                if prior is None or (kind == "axis" and result is None):
                    raise ValidationError(f"correction prior/result absent: {key}")
                panel_validation.preserved_prior(prior, result, decisions)
                corrections[key] = {"decision": decision, "before": before, "prior": prior, "result": result, "coverage": coverage[key[0]]}
        finally:
            connection.row_factory = previous_factory
            if owned:
                connection.close()
    return corrections


def _install_correction_materializer(module: types.ModuleType) -> None:
    """Extend the existing publisher for exact correction and raw-snapshot deltas."""
    path = LEGACY / "integration-publisher-v1/integrate.py"
    spec = importlib.util.spec_from_file_location("_factor_correction_integration", path)
    if spec is None or spec.loader is None:
        raise ValidationError(f"correction integration backend missing: {path}")
    integration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(integration)
    original_apply, original_verify = module.apply_plan_in_transaction, module._verify_preservation

    def apply(con: sqlite3.Connection, plan: dict[str, object]) -> None:
        corrections = plan["priorCorrections"]
        keys = {(row["after"]["workId"], row["after"]["axisId"]) for row in corrections}
        snapshots = plan.get("freshSnapshots", {})
        snapshot_ids = set(snapshots)
        snapshot_keys = {(work_id, axis) for work_id in snapshot_ids for axis in AXES}
        normal = {
            **plan,
            "factorUpdates": [row for row in plan["factorUpdates"] if (row["workId"], row["axisId"]) not in keys | snapshot_keys],
            "themeInserts": [row for row in plan["themeInserts"] if row["workId"] not in snapshot_ids],
            "genreUpdates": {work_id: genres for work_id, genres in plan["genreUpdates"].items() if work_id not in snapshot_ids},
        }
        original_apply(con, normal)
        previous_factory = con.row_factory
        con.row_factory = sqlite3.Row
        try:
            for correction in corrections:
                before, after = correction["before"], correction["after"]
                values = tuple(after[field] for field in ("state", "value", "confidence", "evidenceId", "workId", "axisId")) + tuple(before[field] for field in ("state", "value", "confidence", "evidenceId"))
                changed = con.execute("update source_factors set state=?,value=?,confidence=?,evidenceId=? where workId=? and axisId=? and state=? and value=? and confidence=? and evidenceId=?", values)
                if changed.rowcount != 1:
                    raise module.PublishError(f"correction lost exact baseline row: {after['workId']} {after['axisId']}")
            for work_id, snapshot in sorted(snapshots.items()):
                for item in snapshot["factorRows"]:
                    before, after = item["before"], item["after"]
                    values = tuple(after[field] for field in ("state", "value", "confidence", "evidenceId")) + (
                        work_id, after["axisId"],
                    ) + tuple(str(before[field]) for field in ("state", "value", "confidence", "evidenceId"))
                    changed = con.execute(
                        "update source_factors set state=?,value=?,confidence=?,evidenceId=? where workId=? and axisId=? and state=? and value=? and confidence=? and evidenceId=?",
                        values,
                    )
                    if changed.rowcount != 1:
                        raise module.PublishError(f"fresh snapshot lost exact baseline factor: {work_id} {after['axisId']}")
                changed = con.execute(
                    "update source_works set genres=? where id=? and genres=?",
                    (snapshot["afterGenres"], work_id, snapshot["beforeGenres"]),
                )
                if changed.rowcount != 1:
                    raise module.PublishError(f"fresh snapshot lost exact baseline genres: {work_id}")
                current_themes = [
                    {key: row[key] for key in ("workId", "themeId", "centrality", "confidence", "evidenceId")}
                    for row in con.execute("select * from source_themes where workId=? order by themeId", (work_id,))
                ]
                expected_before = sorted(snapshot["beforeThemes"], key=lambda row: str(row["themeId"]))
                if current_themes != expected_before:
                    raise module.PublishError(f"fresh snapshot lost exact baseline themes: {work_id}")
                con.execute("delete from source_themes where workId=?", (work_id,))
                next_ordinal = con.execute("select coalesce(max(sourceOrdinal),0)+1 from source_themes").fetchone()[0]
                next_line = con.execute("select coalesce(max(sourceLine),1)+1 from source_themes").fetchone()[0]
                for row in snapshot["afterThemes"]:
                    con.execute(
                        "insert into source_themes values(?,?,?,?,?,?,?)",
                        (next_ordinal, next_line, work_id, row["themeId"], row["centrality"], row["confidence"], row["evidenceId"]),
                    )
                    next_ordinal += 1
                    next_line += 1
            if snapshot_ids:
                integration.reindex_authority_projection(con, {"source_themes"})
            ids = {key[0] for key in keys}
            coverage_readback = {}
            for work_id in sorted(ids):
                actual_axes = {row[0]: {"state": row[1], "value": row[2]} for row in con.execute("select axisId,state,value from source_factors where workId=?", (work_id,))}
                if actual_axes != plan["correctionAxisSnapshot"][work_id]:
                    raise module.PublishError(f"correction final Axis snapshot mismatch: {work_id}")
                narrative, tone, genres, themes, blockers = integration.coverage(con, work_id)
                blockers = nt.filter_blockers(blockers, plan.get("narrativeToneExceptions", {}).get(work_id))
                coverage_readback[work_id] = {"panelCoverage": plan["correctionPanelCoverage"][work_id], "databaseCoverage": {"narrativeKnown": narrative, "toneKnown": tone, "genreCount": genres, "themeCount": themes, "artKnown": sum(actual_axes[axis]["state"] == "known" for axis in ART)}, "databaseBlockerCodes": blockers}
            final = {work_id: "BLOCKED_FACTOR" if work_id in plan["correctionBlockedIds"] else "PASS" for work_id in ids}
            integration.REVIEW_REFERENCE = plan["correctionReviewReference"]
            integration.set_final_statuses(con, final, {}, plan["correctionReviewedAt"], {work_id: "true" if status == "PASS" else "false" for work_id, status in final.items()}, nt_exceptions=plan.get("narrativeToneExceptions", {}))
            if plan["correctionBlockedIds"]:
                integration.reindex_authority_projection(con, {"source_recommendation_context"})
            integration.validate_authority_projection(con)
            module.correction_coverage = coverage_readback
        finally:
            con.row_factory = previous_factory

    def verify(before: dict, output: Path, plan: dict, gold_ids: set[str]) -> None:
        projected = dict(before)
        after = module._snapshot_db(output)
        snapshots = plan.get("freshSnapshots", {})
        snapshot_ids = set(snapshots)
        blocked = set(plan["correctionBlockedIds"])
        work_columns, work_rows = before["source_works"]
        expected_rows = []
        after_works = module._rows_by_key(after, "source_works", "id")
        for values in work_rows:
            work = dict(zip(work_columns, values))
            if work["id"] in blocked:
                work.update(onboardingEligible="false", recommendationEligible="false", libraryOnly="true", annotationReviewMethod="unreviewed", annotationReviewedAt="", annotationReviewReference="")
                if after_works[work["id"]] != work:
                    raise module.PublishError(f"correction demotion readback mismatch: {work['id']}")
            expected_rows.append(tuple(work[field] for field in work_columns))
        projected["source_works"] = (work_columns, tuple(expected_rows))
        if blocked:
            columns, values = before["source_recommendation_context"]
            index = columns.index("workId")
            survivors = [row[2:] for row in values if row[index] not in blocked]
            expected = survivors + [tuple(row[field] for field in columns[2:]) for row in plan["contextInserts"]]
            if [row[2:] for row in after["source_recommendation_context"][1]] != expected:
                raise module.PublishError("correction context semantic delta mismatch")
            line, projected_rows = 1, []
            for ordinal, row in enumerate(survivors, 1):
                line += integration._canonical_row_line(row)
                projected_rows.append((ordinal, line, *row))
            projected["source_recommendation_context"] = (columns, tuple(projected_rows))
        if snapshot_ids:
            theme_columns, before_theme_rows = before["source_themes"]
            after_theme_rows = after["source_themes"][1]
            work_index = theme_columns.index("workId")
            semantic_indexes = [index for index, column in enumerate(theme_columns) if column not in {"sourceOrdinal", "sourceLine"}]
            semantic = lambda row: tuple(row[index] for index in semantic_indexes)
            before_other = sorted(semantic(row) for row in before_theme_rows if row[work_index] not in snapshot_ids)
            after_other = sorted(semantic(row) for row in after_theme_rows if row[work_index] not in snapshot_ids)
            if before_other != after_other:
                raise module.PublishError("fresh snapshot changed non-target theme semantics")
            projected["source_themes"] = after["source_themes"]
        # The original verifier still checks every untouched field, old evidence,
        # Gold row, exact factor update, and allowed PASS/context insertion.
        original_verify(projected, output, plan, gold_ids)
        after_themes = {(row["workId"], row["themeId"]): row for row in module._rows_by_key(after, "source_themes", "sourceOrdinal").values()}
        after_factors = {(row["workId"], row["axisId"]): row for row in module._rows_by_key(after, "source_factors", "sourceOrdinal").values()}
        after_evidence = module._rows_by_key(after, "source_evidence", "id")
        for work_id, snapshot in sorted(snapshots.items()):
            for item in snapshot["factorRows"]:
                expected = item["after"]
                actual = after_factors[(work_id, expected["axisId"])]
                if tuple(actual[field] for field in ("state", "value", "confidence", "evidenceId")) != tuple(expected[field] for field in ("state", "value", "confidence", "evidenceId")):
                    raise module.PublishError(f"fresh snapshot factor readback mismatch: {work_id} {expected['axisId']}")
                if not actual["evidenceId"] or (actual["state"] == "unknown" and (actual["value"] or actual["confidence"])):
                    raise module.PublishError(f"fresh snapshot factor schema mismatch: {work_id} {expected['axisId']}")
                if actual["state"] != "unknown" and actual["evidenceId"] not in plan["newEvidence"]:
                    raise module.PublishError(f"fresh snapshot factor lacks fresh evidence readback: {work_id} {expected['axisId']}")
            expected_themes = {
                row["themeId"]: tuple(row[field] for field in ("centrality", "confidence", "evidenceId"))
                for row in snapshot["afterThemes"]
            }
            actual_themes = {
                theme_id: tuple(after_themes[(work_id, theme_id)][field] for field in ("centrality", "confidence", "evidenceId"))
                for owner, theme_id in after_themes if owner == work_id
            }
            if actual_themes != expected_themes or any(values[2] not in plan["newEvidence"] for values in actual_themes.values()):
                raise module.PublishError(f"fresh snapshot theme readback mismatch: {work_id}")
            if after_works[work_id]["genres"] != snapshot["afterGenres"] or any(evidence_id not in after_evidence or evidence_id not in plan["newEvidence"] for evidence_id in snapshot["genreEvidenceIds"]):
                raise module.PublishError(f"fresh snapshot genre readback mismatch: {work_id}")
        for correction in plan["tagCorrections"]:
            decision = correction["decision"]
            work_id, fact_key = decision["workId"], decision["factKey"]
            kind, name = fact_kind(fact_key)
            stored = after_themes.get((work_id, name)) if kind == "theme" else None
            present = name in after_works[work_id]["genres"].split(";") if kind == "genre" else stored is not None
            if present != correction["published"] or (stored is not None and stored["centrality"] != correction["after"]["value"]):
                raise module.PublishError(f"tag correction readback mismatch: {work_id} {fact_key}")
        prior_works = module._rows_by_key(before, "source_works", "id")
        module.correction_readback = {"corrections": [*plan["priorCorrections"], *plan["tagCorrections"]], "axisUpdates": plan["correctionAxisUpdates"], "coverageReadback": module.correction_coverage, "blockedWorkIds": sorted(blocked), "demotedWorkIds": sorted(work_id for work_id in blocked if prior_works[work_id]["recommendationEligible"] == "true"), "removedContexts": [dict(zip(before["source_recommendation_context"][0], row)) for row in before["source_recommendation_context"][1] if row[before["source_recommendation_context"][0].index("workId")] in blocked], "scope": "Axis-corrected works materialize the validated final Axis snapshot. Genre/Theme corrections preserve old evidence, publish absent-tag replacements only on PASS, and retain existing stored tags only for storage-identical REPLACE decisions. Exact tag membership/value readback is verified. Other BLOCKED publication behavior is unchanged; panel and database coverage are reported separately."}

    module.apply_plan_in_transaction, module._verify_preservation = apply, verify


def _registry_correction_slice(
    input_root: Path,
    baseline: Path,
    registry: Path,
    expected_source_sha: str,
) -> Path | None:
    if sha256(registry) == expected_source_sha:
        return None
    root = registry.resolve().parent
    members = {
        "build_registry_correction.py",
        "catalog-source-registry.candidate.sqlite",
        "correction-ledger.json",
        "preflight-report.json",
        "preflight_registry_correction.py",
        "source-registry.csv",
    }
    verify_manifest(root, root / "MANIFEST.sha256", members)
    ledger = _read_json(root / "correction-ledger.json")
    report = _read_json(root / "preflight-report.json")
    panel = _read_json(input_root / "panel-input.json")
    expected = {
        "sourceRegistrySha256": expected_source_sha,
        "correctedRegistrySha256": sha256(registry),
        "baselineSha256": sha256(baseline),
        "panelInputManifestSha256": sha256(input_root / "PANEL-INPUT.sha256"),
        "correctedRegistrySliceSha256": sha256(root / "source-registry.csv"),
        "packetCount": panel["targetCount"],
        "batchId": str(panel["batchId"]),
    }
    if ledger.get("schemaVersion") != "batch010-registry-identity-correction-v1":
        raise ValidationError("unsupported registry correction schema")
    if ledger.get("candidateOnly") is not True or ledger.get("reviewedByHuman") is not False:
        raise ValidationError("registry correction authority flags mismatch")
    if report.get("schemaVersion") != "batch010-registry-correction-preflight-v1" or report.get("status") != "PASS":
        raise ValidationError("registry correction preflight is not PASS")
    if ledger.get("sourceRegistrySha256") != expected["sourceRegistrySha256"]:
        raise ValidationError("registry correction source hash mismatch")
    for key, value in expected.items():
        if key == "sourceRegistrySha256":
            continue
        if report.get(key) != value:
            raise ValidationError(f"registry correction binding mismatch: {key}")
    if report.get("passedCount") != panel["targetCount"] or report.get("blockedCount") != 0 or report.get("blocked") != []:
        raise ValidationError("registry correction did not bind every packet")
    return root / "source-registry.csv"


def registry_correction_changes(frozen_baseline: Path, frozen_registry: Path, target_ids: set[str]) -> list[dict]:
    source_registry = frozen_baseline.parent / "catalog-source-registry.candidate.sqlite"
    if frozen_registry == source_registry:
        return []

    import correct_factor_registry as correction
    root = frozen_registry.parent
    if correction.verify_correction(root, source_registry, frozen_baseline).resolve() != frozen_registry:
        raise ValidationError("verified registry correction target mismatch")
    ledger = _read_json(root / "correction-ledger.json")
    changes = ledger.get("changes")
    if not isinstance(changes, list) or not changes:
        raise ValidationError("verified registry correction has no changes")
    if any(
        not isinstance(change, dict)
        or set(change) != {"sourceRowId", "workId", "field", "before", "after"}
        or change["workId"] not in target_ids
        or not all(isinstance(change[key], str) for key in change)
        for change in changes
    ):
        raise ValidationError("registry correction exceeds frozen target scope")

    return changes


def plan_registry_correction(changes: list[dict], before: dict) -> tuple[dict, list[dict]]:
    expected = copy.deepcopy(before)
    rows = {row["sourceRowId"]: row for row in expected["tables"]["registry_source_rows"]["rows"]}
    pending = []
    for change in changes:
        row = rows.get(change["sourceRowId"])
        if row is None or row.get("canonicalWorkId") != change["workId"] or change["field"] not in row:
            raise ValidationError("registry correction target row changed during rebase")
        current = row[change["field"]]
        if current == change["after"]:
            continue
        if current != change["before"]:
            raise ValidationError("registry correction target field changed during rebase")
        row[change["field"]] = change["after"]
        pending.append(change)

    return expected, pending


def apply_registry_correction(connection: sqlite3.Connection, pending: list[dict], schema="main") -> None:
    if not connection.in_transaction or schema not in {"main", "registry"}:
        raise ValidationError("registry application requires an owned pair transaction")
    for change in pending:
        updated = connection.execute(
            f'update {schema}.registry_source_rows set "{change["field"]}"=? where sourceRowId=? and canonicalWorkId=? and "{change["field"]}"=?',
            (change["after"], change["sourceRowId"], change["workId"], change["before"]),
        )
        if updated.rowcount != 1:
            raise ValidationError("registry correction rebase lost its exact target row")


def _rebase_registry_correction(frozen_baseline: Path, frozen_registry: Path, registry: Path, output: Path, target_ids: set[str]) -> bool:
    changes = registry_correction_changes(frozen_baseline, frozen_registry, target_ids)
    if not changes:
        shutil.copy2(registry, output)
        return False
    import correct_factor_registry as correction
    before = correction.snapshot(registry)
    expected, pending = plan_registry_correction(changes, before)
    shutil.copy2(registry, output)
    with closing(sqlite3.connect(output)) as connection, connection:
        connection.execute("begin immediate")
        apply_registry_correction(connection, pending)
        correction.preservation(before, correction.snapshot(connection), expected, pending)
    return True



def _verify_input_identities(input_root: Path, baseline: Path, registry: Path, repo: Path, *, canonical_sha: str | None = None) -> Path | None:
    value = _read_json(input_root / "panel-input.json")
    expected = {
        "baselineCandidateSha256": sha256(baseline),
        "canonicalSha256": canonical_sha or sha256(repo / "data" / "source" / "catalog.sqlite"),
        "goldManifestSha256": sha256(repo / "data" / "staging" / "catalog-expansion" / "gold-set-manifest.json"),
    }
    for key, digest in expected.items():
        if value.get(key) != digest:
            raise ValidationError(f"panel input identity mismatch: {key}")
    registry_sha = value.get("registrySha256")
    if not isinstance(registry_sha, str) or not re.fullmatch(r"[0-9a-f]{64}", registry_sha):
        raise ValidationError("panel input identity mismatch: registrySha256")
    return _registry_correction_slice(input_root, baseline, registry, registry_sha)


def _load_prior_evidence(baseline: Path) -> dict[str, dict[str, str]]:
    return panel_validation.load_prior_authority(baseline.parent, baseline)["evidence"]


def _sidecars(path: Path) -> list[Path]:
    return [Path(f"{path}{suffix}") for suffix in SIDE_SUFFIXES if Path(f"{path}{suffix}").exists()]


def _verify_result_manifest(root: Path) -> None:
    manifest = root / "MANIFEST.sha256"
    members = {
        path.relative_to(root).as_posix()
        for path in root.rglob("*")
        if path.is_file() and not path.is_symlink() and path != manifest
    }
    verify_manifest(root, manifest, members)


def _write_result_manifest(root: Path) -> None:
    manifest = root / "MANIFEST.sha256"
    members = sorted(
        (path for path in root.rglob("*") if path.is_file() and not path.is_symlink() and path != manifest),
        key=lambda path: path.relative_to(root).as_posix(),
    )
    manifest.write_text(
        "".join(f"{sha256(path)}  {path.relative_to(root).as_posix()}\n" for path in members),
        encoding="ascii", newline="\n",
    )


def _load_safety(
    safety_root: Path,
    input_root: Path,
    result_root: Path,
) -> dict[str, object]:
    repo = _repo_root()
    validator_path = LEGACY / "safety-recheck-v1" / "tools" / "validate_safety_recheck.py"
    spec = importlib.util.spec_from_file_location("_verified_safety_validator", validator_path)
    if spec is None or spec.loader is None:
        raise ValidationError(f"verified safety validator missing: {validator_path}")
    validator = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(validator)
    build_report = _read_json(safety_root / "BUILD-REPORT.json")
    target_rows = read_csv(safety_root / "targets.csv", SAFETY_TARGET_FIELDS)
    expected_count = len(target_rows)
    reported_count = (
        build_report.get("counts", {}).get("expectedUniqueWorks")
        if isinstance(build_report.get("counts"), dict)
        else build_report.get("targetCount")
    )
    if reported_count is None or int(reported_count) != expected_count:
        raise ValidationError("safety BUILD-REPORT target count mismatch")
    validator.EXPECTED_TARGET_COUNT = expected_count
    validator.TARGETS_SHA256 = sha256(safety_root / "targets.csv")
    try:
        validation = validator.validate(safety_root)
    except (OSError, validator.ValidationError, ValueError) as error:
        raise ValidationError(f"safety validation failed: {error}") from error

    input_members = {
        "BUILD-REPORT.json", "BUILD-REPORT.md", "SCHEMA.md", "targets.csv",
        *{path.relative_to(safety_root).as_posix() for path in (safety_root / "chunks").glob("chunk-??.csv")},
        *{path.relative_to(safety_root).as_posix() for path in (safety_root / "tools").glob("*.py")},
    }
    verify_manifest(safety_root, safety_root / "MANIFEST.sha256", input_members)
    factor_targets: dict[str, dict[str, str]] = {}
    factor_promotion: dict[str, dict[str, str]] = {}
    for chunk in sorted((input_root / "chunks").glob("chunk-??")):
        factor_targets.update({row["workId"]: row for row in read_csv(chunk / "targets.csv", TARGET_FIELDS)})
        factor_promotion.update({row["workId"]: row for row in read_csv(result_root / chunk.name / "promotion-ledger.csv", PROMOTION_FIELDS)})
    factor_pass = {work_id for work_id, row in factor_promotion.items() if row["panelOutcome"] == "PASS"}
    targets = read_csv(safety_root / "targets.csv", SAFETY_TARGET_FIELDS)
    if {row["workId"] for row in targets} != factor_pass or len(targets) != expected_count:
        raise ValidationError("safety targets do not exactly match factor PASS membership")
    for row in targets:
        factor = factor_targets[row["workId"]]
        if (
            row["title"] != factor["title"]
            or row["representativeIsbn"] != factor["representativeIsbn"]
            or row["currentPacketDigest"] != factor["packetDigest"]
            or row["sourceOutcome"] != "PASS"
            or row["candidateOnly"] != "true"
            or row["reviewedByHuman"] != "false"
        ):
            raise ValidationError(f"safety target/factor packet binding mismatch: {row['workId']}")

    evidence: dict[str, dict[str, str]] = {}
    claims: dict[str, dict[str, str]] = {}
    chunk_manifests: list[Path] = []
    for chunk in sorted(path for path in (safety_root / "chunks").glob("chunk-??") if path.is_dir()):
        chunk_manifests.append(chunk / "MANIFEST.sha256")
        for row in read_csv(chunk / "evidence.csv", SAFETY_EVIDENCE_FIELDS):
            if "anilist.co" in row["sourceUrl"].lower() or row["evidenceId"] in evidence:
                raise ValidationError(f"ineligible or duplicate safety evidence: {row['evidenceId']}")
            evidence[row["evidenceId"]] = row
        for row in read_csv(chunk / "claims.csv", SAFETY_CLAIM_FIELDS):
            if row["outcome"] != "SAFE" or row["workId"] in claims:
                raise ValidationError(f"safety work is not SAFE or is duplicated: {row['workId']}")
            claims[row["workId"]] = row
    if set(claims) != factor_pass:
        raise ValidationError("safety SAFE membership does not exactly match factor PASS membership")
    import factor_single_pass as single
    if single.is_single(input_root):
        adjudicated, _, _ = single.project(input_root, _read_json(result_root / "chunk-01/adjudication.json"))
        expected = [work for work in adjudicated["works"] if work["workId"] in factor_pass]
        if claims != {work["workId"]: work["safety"]["claim"] for work in expected} or evidence != {row["evidenceId"]: row for work in expected for row in work["safety"]["evidence"]}:
            raise ValidationError("safety projection differs from post-freeze adjudication")
    binding = [safety_root / "MANIFEST.sha256", *chunk_manifests]
    artifact_digest = hashlib.sha256(
        "".join(f"{sha256(path)}  {path.relative_to(safety_root).as_posix()}\n" for path in binding).encode("utf-8")
    ).hexdigest()
    return {"validation": validation, "evidence": evidence, "claims": claims, "artifactDigest": artifact_digest}


def _publication_safety(safety_root, input_root, result_root, recovery):
    if recovery and not any(row["panelOutcome"] == "PASS" for path in result_root.glob("chunk-??/promotion-ledger.csv") for row in read_csv(path, PROMOTION_FIELDS)):
        return {"claims": {}, "evidence": {}, "artifactDigest": sha256(input_root / "PANEL-INPUT.sha256"), "validation": {"targetCount": 0, "safeCount": 0, "blockedSafetyCount": len(panel_validation.recovery_safety_blockers(input_root, set(recovery), result_root)), "scope": "No PASS targets; bound safety decisions remain in panel artifacts."}}
    return _load_safety(safety_root, input_root, result_root)


def validate_retained_authority(
    request_path: Path,
    baseline: Path,
    registry: Path,
) -> dict[str, object]:
    """Validate one complete historical publication for eligibility-only restore."""

    repo = _repo_root()
    canonical = repo / "data/source/catalog.sqlite"
    gold_manifest = repo / "data/staging/catalog-expansion/gold-set-manifest.json"
    baseline, registry = baseline.resolve(), registry.resolve()
    if baseline.parent != registry.parent:
        raise ValidationError("retained current catalog and registry must be one publication pair")
    _verify_result_manifest(baseline.parent)
    try:
        retained = factor_recovery.validate_retained_request(
            request_path.resolve(), baseline, registry, canonical, gold_manifest
        )
    except ValueError as error:
        raise ValidationError(str(error)) from error
    original_batch = retained["originalBatchRoot"]
    original_publication = retained["originalPublicationRoot"]
    _verify_result_manifest(original_batch)
    _verify_result_manifest(original_publication)
    input_root = original_batch / "panel-input"
    result_root = original_batch / "panel-result"
    safety_root = original_batch / "safety-recheck-v1"
    _, chunks, _ = validate_input(input_root)
    target_ids = {
        row["workId"] for chunk in chunks
        for row in read_csv(chunk / "targets.csv", TARGET_FIELDS)
    }
    work_id = str(retained["workId"])
    if target_ids != {work_id} or {chunk.name for chunk in chunks} != {"chunk-01"}:
        raise ValidationError("retained original panel target membership mismatch")
    lineage = _read_json(input_root / "external-lineage.json")
    frozen_root = artifact_path(str(lineage.get("baselineRoot", "")))
    frozen_registry = artifact_path(str(lineage.get("registryPath", "")))
    if not frozen_root.is_absolute() or not frozen_registry.is_absolute():
        raise ValidationError("retained original lineage is not absolute")
    frozen_baseline = frozen_root / "catalog-expanded.candidate.sqlite"
    _verify_result_manifest(frozen_root)
    panel_identity = _read_json(input_root / "panel-input.json")
    expected_original_identity = {
        "baselineCandidateSha256": sha256(frozen_baseline),
        "canonicalSha256": retained["request"]["originalCanonicalSha256"],
        "goldManifestSha256": retained["request"]["goldManifestSha256"],
    }
    if any(panel_identity.get(key) != digest for key, digest in expected_original_identity.items()):
        raise ValidationError("retained original panel identity mismatch")
    registry_sha = panel_identity.get("registrySha256")
    if not isinstance(registry_sha, str) or not re.fullmatch(r"[0-9a-f]{64}", registry_sha):
        raise ValidationError("retained original registry identity is invalid")
    _registry_correction_slice(
        input_root, frozen_baseline, frozen_registry, registry_sha
    )
    prior_authority = panel_validation.load_prior_authority(
        input_root, frozen_baseline, work_ids={work_id}
    )
    validation = validate_bundle(
        input_root, result_root, prior_authority["evidence"], prior_authority
    )
    promotions = [
        row for chunk in chunks
        for row in read_csv(result_root / chunk.name / "promotion-ledger.csv", PROMOTION_FIELDS)
    ]
    if len(promotions) != 1 or promotions[0]["workId"] != work_id or promotions[0]["panelOutcome"] != "PASS" or promotions[0]["recommendationEligible"] != "true" or promotions[0]["libraryOnly"] != "false":
        raise ValidationError("retained original promotion is not an exact PASS")
    safety = _load_safety(safety_root, input_root, result_root)
    request = retained["request"]
    if safety["artifactDigest"] != request["originalSafetyArtifactDigest"] or set(safety["claims"]) != {work_id} or safety["claims"][work_id]["outcome"] != "SAFE":
        raise ValidationError("retained original safety binding mismatch")
    publisher_input = _read_json(
        original_publication / "authorized-evidence-panel-v1/PUBLISHER-INPUT.json"
    )
    expected_publisher = {
        "baselineSha256": sha256(frozen_baseline),
        "inputManifestSha256": request["originalInputManifestSha256"],
        "registrySliceSha256": sha256(input_root / "source-registry.csv"),
        "reviewReference": request["reviewReference"],
        "reviewArtifactSha256": request["reviewSha256"],
        "targetCount": 1,
    }
    if any(publisher_input.get(key) != value for key, value in expected_publisher.items()):
        raise ValidationError("retained original publisher input binding mismatch")
    copied_input = original_publication / "authorized-evidence-panel-v1/input/followup-panel-input-v1/PANEL-INPUT.sha256"
    copied_result = original_publication / "authorized-evidence-panel-v1/result/followup-panel-output-v1/chunk-01/PANEL-RESULT.sha256"
    if not copied_input.is_file() or sha256(copied_input) != request["originalInputManifestSha256"] or not copied_result.is_file() or sha256(copied_result) != request["originalResultManifestSha256"]:
        raise ValidationError("retained original publication omitted or changed sealed panel artifacts")
    if (original_publication / "promotion-ledger.csv").read_bytes() != (result_root / "chunk-01/promotion-ledger.csv").read_bytes():
        raise ValidationError("retained original publication promotion ledger changed")
    return {
        **retained,
        "inputRoot": input_root,
        "resultRoot": result_root,
        "safetyRoot": safety_root,
        "validation": validation,
        "safety": safety,
        "promotion": promotions[0],
    }


def _sqlite_rows(path: Path) -> dict[str, tuple[tuple[str, ...], list[tuple[object, ...]]]]:
    connection = sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True)
    try:
        if connection.execute("pragma integrity_check").fetchone()[0] != "ok" or connection.execute("pragma foreign_key_check").fetchall():
            raise ValidationError(f"SQLite integrity failed: {path}")
        tables = [row[0] for row in connection.execute(
            "select name from sqlite_master where type='table' and name not like 'sqlite_%' order by name"
        )]
        snapshot = {}
        for table in tables:
            columns = tuple(row[1] for row in connection.execute(f'pragma table_info("{table}")'))
            order = ' order by "sourceOrdinal"' if "sourceOrdinal" in columns else ""
            snapshot[table] = (columns, connection.execute(f'select * from "{table}"{order}').fetchall())
        return snapshot
    finally:
        connection.close()


def _verify_retained_database(before: Path, after: Path, work_id: str) -> None:
    old, new = _sqlite_rows(before), _sqlite_rows(after)
    if old.keys() != new.keys():
        raise ValidationError("retained publication changed Catalog table set")
    eligibility = {"onboardingEligible", "recommendationEligible", "libraryOnly"}
    for table in old:
        columns, old_rows = old[table]
        new_columns, new_rows = new[table]
        if columns != new_columns or len(old_rows) != len(new_rows):
            raise ValidationError(f"retained publication changed Catalog shape: {table}")
        if table != "source_works":
            if old_rows != new_rows:
                raise ValidationError(f"retained publication changed non-work table: {table}")
            continue
        index = {name: position for position, name in enumerate(columns)}
        target_index = index.get("id")
        if target_index is None:
            raise ValidationError("retained publication source_works lacks id")
        found = 0
        for left, right in zip(old_rows, new_rows):
            if left[target_index] != work_id:
                if left != right:
                    raise ValidationError("retained publication changed non-target work")
                continue
            found += 1
            differences = {columns[i] for i, (a, b) in enumerate(zip(left, right)) if a != b}
            if differences != eligibility:
                raise ValidationError("retained publication changed target beyond eligibility")
            expected = {
                "onboardingEligible": ("false", "true"),
                "recommendationEligible": ("false", "true"),
                "libraryOnly": ("true", "false"),
            }
            if any((left[index[key]], right[index[key]]) != values for key, values in expected.items()):
                raise ValidationError("retained publication eligibility transition mismatch")
        if found != 1:
            raise ValidationError("retained publication target missing or duplicated")


def publish_retained_authority(
    request_path: Path,
    baseline: Path,
    registry: Path,
    output_root: Path,
) -> dict[str, object]:
    """Restore a verified original authority by changing eligibility only."""

    repo = _repo_root()
    canonical = repo / "data/source/catalog.sqlite"
    baseline, registry, output_root = baseline.resolve(), registry.resolve(), output_root.resolve()
    if output_root.exists():
        raise ValidationError(f"output root already exists; refusing overwrite: {output_root}")
    if canonical.resolve() in {baseline, registry, output_root} or canonical.resolve() in output_root.parents:
        raise ValidationError("canonical catalog.sqlite cannot be an input/output mutation target")
    stage = output_root.with_name(f".{output_root.name}.tmp")
    if stage.exists():
        raise ValidationError(f"staging output already exists: {stage}")
    immutable = {path: sha256(path) for path in (baseline, registry, canonical, request_path.resolve())}
    retained = validate_retained_authority(request_path, baseline, registry)
    work_id = str(retained["workId"])
    try:
        stage.mkdir(parents=True)
        candidate = stage / "catalog-expanded.candidate.sqlite"
        registry_output = stage / "catalog-source-registry.candidate.sqlite"
        shutil.copy2(baseline, candidate)
        shutil.copy2(registry, registry_output)
        reviews = baseline.parent / "authorized-evidence-panel-v1"
        if not reviews.is_dir() or any(path.is_symlink() for path in reviews.rglob("*")):
            raise ValidationError("retained current review tree is missing or linked")
        shutil.copytree(reviews, stage / reviews.name, symlinks=False)
        shutil.copytree(retained["safetyRoot"], stage / "safety-recheck-v1", symlinks=False)
        shutil.copy2(request_path.resolve(), stage / "retained-authority-request.json")
        connection = sqlite3.connect(candidate)
        try:
            connection.execute("pragma foreign_keys=on")
            connection.execute("begin immediate")
            changed = connection.execute(
                "update source_works set onboardingEligible='true',recommendationEligible='true',libraryOnly='false' "
                "where id=? and onboardingEligible='false' and recommendationEligible='false' and libraryOnly='true'",
                (work_id,),
            ).rowcount
            if changed != 1:
                raise ValidationError("retained exact eligibility update affected other than one row")
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()
        _verify_retained_database(baseline, candidate, work_id)
        after = _target_semantic_snapshot(candidate, work_id)
        if after["sha256"] != retained["request"]["originalSemanticSha256"]:
            raise ValidationError("retained publication did not restore exact original semantics")
        if sha256(registry_output) != immutable[registry]:
            raise ValidationError("retained publication changed registry")
        if any(sha256(path) != digest for path, digest in immutable.items()):
            raise ValidationError("retained publication changed an immutable input")
        if _sidecars(candidate) or _sidecars(registry_output) or _sidecars(canonical):
            raise ValidationError("SQLite sidecar exists after retained publication")
        request = retained["request"]
        recovery = {
            "schemaVersion": "factor-loss-recovery-publication-v1",
            "workId": work_id,
            "epochId": retained["epoch"]["epochId"],
            "epochSha256": request["epochSha256"],
            "beforeCatalogSha256": immutable[baseline],
            "beforeRoot": str(baseline.parent),
            "beforeSemanticSha256": request["currentSemanticSha256"],
            "requestSha256": immutable[request_path.resolve()],
            "originalBatchRoot": str(retained["originalBatchRoot"]),
            "originalPublicationRoot": str(retained["originalPublicationRoot"]),
            "originalPublicationManifestSha256": request["originalPublicationManifestSha256"],
            "originalInputManifestSha256": request["originalInputManifestSha256"],
            "originalResultManifestSha256": request["originalResultManifestSha256"],
            "safetyArtifactDigest": request["originalSafetyArtifactDigest"],
            "candidateSha256": sha256(candidate),
            "afterSemanticSha256": after["sha256"],
            "originalAuthorityRecovered": True,
            "originalScopeComplete": False,
            "reviewedByHuman": False,
        }
        (stage / "recovery-publication.json").write_text(
            json.dumps(recovery, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8", newline="\n",
        )
        transition = {
            **recovery,
            "schemaVersion": "factor-loss-recovery-transition-v1",
            "disposition": "retained",
            "recommendationEligible": "true",
            "annotationReviewMethod": "authorizedEvidencePanel",
            "annotationReviewReference": request["reviewReference"],
        }
        (stage / "authority-transition.jsonl").write_text(
            json.dumps(transition, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n",
            encoding="utf-8", newline="\n",
        )
        promotion = retained["promotion"]
        write_rows = [{key: promotion[key] for key in PROMOTION_FIELDS}]
        with (stage / "promotion-ledger.csv").open("w", encoding="utf-8", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=PROMOTION_FIELDS, lineterminator="\n")
            writer.writeheader()
            writer.writerows(write_rows)
        (stage / "safety-validation.json").write_text(
            json.dumps({"artifactDigest": retained["safety"]["artifactDigest"], **retained["safety"]["validation"]}, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8", newline="\n",
        )
        (stage / "catalog-diff.md").write_text(
            "# Retained authority restoration\n\n"
            f"- Work: `{work_id}`\n"
            "- Restored the original manifest-bound authorizedEvidencePanel eligibility.\n"
            "- Factor, Genre, Theme, evidence, context, bibliography, registry, non-target, and Gold data are unchanged.\n",
            encoding="utf-8", newline="\n",
        )
        (stage / "validation-report.md").write_text(
            "# Retained authority validation\n\n- Result: **PASS**\n"
            f"- Original publication manifest: `{request['originalPublicationManifestSha256']}`\n"
            f"- Safety artifact: `{request['originalSafetyArtifactDigest']}`\n"
            "- Mutation: exact eligibility fields on one non-Gold work\n",
            encoding="utf-8", newline="\n",
        )
        _write_result_manifest(stage)
        _verify_result_manifest(stage)
        os.replace(stage, output_root)
        _verify_result_manifest(output_root)
        return {
            "status": "PUBLISHED", "mode": "retained-authority", "workId": work_id,
            "outputRoot": str(output_root), "candidateSha256": sha256(output_root / candidate.name),
            "registrySha256": sha256(output_root / registry_output.name),
            "originalAuthorityRecovered": True,
        }
    except Exception:
        if stage.exists():
            shutil.rmtree(stage)
        if output_root.exists():
            shutil.rmtree(output_root)
        raise


def preserve_book_metadata(candidate: Path | sqlite3.Connection, canonical: Path | sqlite3.Connection, backend) -> dict:
    """Carry current canonical metadata into a candidate without replacing newer candidate rows."""
    before = backend._snapshot_db(candidate)
    canonical_owned = not isinstance(canonical, sqlite3.Connection)
    with closing(sqlite3.connect(f"file:{canonical.resolve().as_posix()}?mode=ro", uri=True)) if canonical_owned else nullcontext(canonical) as source:
        backend._validate_schema(source, "canonical")
        if source.execute("pragma user_version").fetchone()[0] == 1:
            return {"status": "UNCHANGED", "rows": 0}
        columns = [row[1] for row in source.execute("pragma table_info(source_book_metadata)")]
        canonical_rows = [dict(zip(columns, row)) for row in source.execute("select * from source_book_metadata order by sourceOrdinal")]
        ddl = source.execute("select sql from sqlite_master where name='source_book_metadata'").fetchone()[0]
    owned = not isinstance(candidate, sqlite3.Connection)
    if not owned and not candidate.in_transaction:
        raise ValidationError("metadata preservation requires a caller-owned transaction")
    with closing(sqlite3.connect(candidate)) if owned else nullcontext(candidate) as target:
        with target if owned else nullcontext():
            if target.execute("pragma user_version").fetchone()[0] == 1:
                target.execute(ddl)
                target.execute("pragma user_version=2")
            existing = {row[3]: dict(zip(columns, row)) for row in target.execute("select * from source_book_metadata")}
            next_ordinal = max((row["sourceOrdinal"] for row in existing.values()), default=0) + 1
            for row in canonical_rows:
                isbn = row["isbn"]
                previous = existing.get(isbn)
                if previous and previous["workId"] != row["workId"]:
                    raise ValidationError("metadata Work/ISBN conflict")
                binding = target.execute("select workId from source_volumes where isbn=?", (isbn,)).fetchall()
                if binding != [(row["workId"],)]:
                    raise ValidationError("metadata ISBN does not identify exactly one candidate Work")
                # Keep newer candidate metadata, preserve canonical on equal-time disagreement.
                if previous and previous["fetchedAt"] > row["fetchedAt"]:
                    continue
                if previous:
                    row = {**row, "sourceOrdinal": previous["sourceOrdinal"], "sourceLine": previous["sourceLine"]}
                    if row == previous:
                        continue
                    target.execute("delete from source_book_metadata where isbn=?", (isbn,))
                else:
                    row = {**row, "sourceOrdinal": next_ordinal, "sourceLine": next_ordinal + 1}
                    next_ordinal += 1
                target.execute("insert into source_book_metadata values (" + ",".join("?" for _ in columns) + ")", [row[key] for key in columns])
            backend._validate_schema(target, "candidate")
    after = backend._snapshot_db(candidate)
    for table, rows in before.items():
        if table != "source_book_metadata" and rows != after[table]:
            raise ValidationError("metadata preservation changed another source table")
    return {"status": "PRESERVED", "canonicalSha256": sha256(canonical) if canonical_owned else None, "rows": len(after["source_book_metadata"][1])}


def publish_batch(
    input_root: Path,
    result_root: Path,
    baseline: Path,
    registry: Path,
    safety_root: Path,
    output_root: Path,
    reviewed_at: str,
    frozen_baseline: Path | None = None,
    frozen_registry: Path | None = None,
) -> dict[str, object]:
    repo = _repo_root()
    canonical = repo / "data" / "source" / "catalog.sqlite"
    paths = [input_root.resolve(), result_root.resolve(), baseline.resolve(), registry.resolve(), safety_root.resolve(), output_root.resolve()]
    input_root, result_root, baseline, registry, safety_root, output_root = paths
    frozen_baseline = (frozen_baseline or baseline).resolve()
    frozen_registry = (frozen_registry or registry).resolve()
    if output_root.exists():
        raise ValidationError(f"output root already exists; refusing overwrite: {output_root}")
    if canonical.resolve() in {baseline, registry, output_root} or output_root == canonical.resolve() or canonical.resolve() in output_root.parents:
        raise ValidationError("canonical catalog.sqlite cannot be an input/output mutation target")
    stage = output_root.with_name(f".{output_root.name}.tmp")
    if stage.exists():
        raise ValidationError(f"staging output already exists: {stage}")
    baseline_before = sha256(baseline)
    registry_before = sha256(registry)
    canonical_before = sha256(canonical)
    if baseline != frozen_baseline:
        if baseline.parent != registry.parent:
            raise ValidationError("cumulative catalog and registry must come from the same prior run")
        _verify_result_manifest(baseline.parent)
    _, authority_chunks, _ = validate_input(input_root)
    target_ids = {row["workId"] for chunk in authority_chunks for row in read_csv(chunk / "targets.csv", TARGET_FIELDS)}
    prior_authority = panel_validation.load_prior_authority(input_root, frozen_baseline, work_ids=target_ids)
    prior_evidence = prior_authority["evidence"]
    recovery = factor_recovery.validate_publish(input_root, result_root, frozen_baseline, baseline)
    corrections = _validate_axis_corrections(input_root, result_root, frozen_baseline, baseline)
    fresh_snapshots = {} if recovery else _validate_fresh_unreviewed_snapshots(input_root, result_root, frozen_baseline, baseline, prior_authority)
    conflicts, conflict_root = _load_conflict_adjudication(input_root, result_root, frozen_baseline)
    if set(fresh_snapshots) & {key[0] for key in conflicts}:
        raise ValidationError("fresh snapshot target cannot use retained-baseline conflict adjudication")
    if recovery and (corrections or conflicts):
        raise ValidationError("recovery cannot mix prior corrections or retained conflicts")
    batch_id = str(_read_json(input_root / "panel-input.json")["batchId"])
    registry_slice = _verify_input_identities(input_root, frozen_baseline, frozen_registry, repo)
    if registry != frozen_registry and baseline == frozen_baseline:
        registry_sha = str(_read_json(input_root / "panel-input.json")["registrySha256"])
        registry_slice = _registry_correction_slice(input_root, frozen_baseline, registry, registry_sha)
    safety = _publication_safety(safety_root, input_root, result_root, recovery)
    backend = _backend_module(safety, prior_evidence, conflicts, prior_authority, corrections, fresh_snapshots, recovery)
    import factor_single_pass as single
    single.install_backend(backend, input_root, result_root)
    try:
        stage.mkdir(parents=True)
        registry_output = stage / "catalog-source-registry.candidate.sqlite"
        correction_rebased = _rebase_registry_correction(
            frozen_baseline, frozen_registry, registry, registry_output, target_ids
        )
        candidate = stage / "catalog-expanded.candidate.sqlite"
        # Backend preflight repeats full panel validation immediately before
        # planning; the earlier pass binds the scoped prior-authority targets.
        result = backend.publish(
            input_root,
            result_root,
            baseline,
            candidate,
            registry_output,
            reviewed_at=reviewed_at,
            review_reference=f"reviews/authorized-evidence-panel-v1-batch-{batch_id}.md",
            gold_manifest=repo / "data" / "staging" / "catalog-expansion" / "gold-set-manifest.json",
            registry_slice=registry_slice,
        )
        if sha256(baseline) != baseline_before or sha256(registry) != registry_before or sha256(canonical) != canonical_before:
            raise ValidationError("immutable baseline, registry, or canonical catalog changed during publication")
        if not correction_rebased and sha256(registry_output) != registry_before:
            raise ValidationError("published registry is not byte-identical")
        if _sidecars(candidate) or _sidecars(registry_output) or _sidecars(canonical):
            raise ValidationError("SQLite sidecar exists after publication")
        _verify_result_manifest(stage)
        metadata_receipt = preserve_book_metadata(candidate, canonical, backend)
        (stage / "book-metadata-preservation.json").write_text(json.dumps(metadata_receipt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if corrections:
            correction_report = {"schemaVersion": "factor-prior-correction-publication-v1", "status": "PASS", "baselineSha256": baseline_before, "candidateSha256": sha256(candidate), "inputManifestSha256": sha256(input_root / "PANEL-INPUT.sha256"), "candidateOnly": True, "reviewedByHuman": False, **backend.correction_readback}
            (stage / "prior-correction-ledger.json").write_text(json.dumps(correction_report, ensure_ascii=False, indent=2, sort_keys=True)+"\n", encoding="utf-8", newline="\n")
            diff = stage / "catalog-diff.md"
            diff.write_text(diff.read_text(encoding="utf-8").replace("Only panel-accepted values were applied. Existing accepted facts, non-target works, Gold Set rows, volumes, and registry are preserved. BLOCKED_FACTOR works remain libraryOnly.", "Manifest-bound prior Axis corrections and PASS claims were applied. Old evidence/history, non-target facts, Gold Set, legacy authorizedModelPanel works, volumes, and registry are preserved. Corrected BLOCKED_FACTOR works retain their corrected factors and are libraryOnly."), encoding="utf-8", newline="\n")
        if conflict_root is not None:
            shutil.copytree(conflict_root, stage / conflict_root.name, symlinks=False)
        if safety_root.is_dir():
            shutil.copytree(safety_root, stage / "safety-recheck-v1", symlinks=False)
        if any(path.is_symlink() for path in (stage / "safety-recheck-v1").rglob("*")):
            raise ValidationError("safety artifact contains symlink")
        (stage / "safety-validation.json").write_text(
            json.dumps({"artifactDigest": safety["artifactDigest"], **safety["validation"]}, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8", newline="\n",
        )
        if recovery:
            (stage / "recovery-publication.json").write_text(json.dumps({"schemaVersion": "factor-loss-recovery-publication-v1", "inputManifestSha256": sha256(input_root / "PANEL-INPUT.sha256"), "baselineSha256": baseline_before, "candidateSha256": sha256(candidate), "originalAuthorityRecovered": False, **backend.recovery_readback}, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
            job_path = input_root / "authoring-job.json"
            safety_job = single.project(input_root, _read_json(result_root / "chunk-01/adjudication.json"))[0] if single.is_single(input_root) else _read_json(job_path)
            frozen_safety = {row["workId"]: row["safety"] for row in safety_job["works"]}
            safety_decision_path = result_root / "chunk-01/adjudication.json" if single.is_single(input_root) else job_path
            transitions = []
            for chunk in authority_chunks:
                result_manifest = result_root / chunk.name / "PANEL-RESULT.sha256"
                for target in read_csv(chunk / "targets.csv", TARGET_FIELDS):
                    wid = target["workId"]
                    snapshot, after = recovery[wid], backend.recovery_readback["afterSnapshots"][wid]
                    safety_decision = frozen_safety.get(wid)
                    transitions.append({"schemaVersion": "factor-loss-recovery-transition-v1", "workId": wid, "epochId": snapshot["epochId"], "epochSha256": snapshot["epochSha256"], "disposition": "superseded", "unavailableAuthorityRoots": snapshot.get("unavailableAuthorityRoots", []), "supersededAuthorityRoots": snapshot.get("supersededAuthorityRoots", []), "originalAuthorityRecovered": False, "originalScopeComplete": False,
                                        "beforeCatalogSha256": baseline_before, "beforeSemanticSha256": snapshot["bindingSha256"], "inputManifestSha256": sha256(input_root / "PANEL-INPUT.sha256"), "chunkManifestSha256": sha256(chunk / "CHUNK.sha256"), "resultManifestSha256": sha256(result_manifest),
                                        "safetyInputSha256": sha256(safety_decision_path) if safety_decision is not None else None, "safetyDecisionSha256": sha256_bytes(json.dumps(safety_decision, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")) if safety_decision is not None else None, "safetyArtifactDigest": safety["artifactDigest"] if safety_root.is_dir() else None, "safetyOutcome": safety_decision["claim"]["outcome"] if safety_decision is not None else safety["claims"].get(wid, {}).get("outcome", "not-published"),
                                        "afterCatalogSha256": sha256(candidate), "afterSemanticSha256": after["sha256"], "panelOutcome": backend.recovery_readback["promotions"][wid]["panelOutcome"], "blockerCodes": split_list(backend.recovery_readback["promotions"][wid]["panelBlockerCode"], "recovery blockers"), "recommendationEligible": after["work"]["recommendationEligible"], "annotationReviewMethod": after["work"]["annotationReviewMethod"], "annotationReviewReference": after["work"]["annotationReviewReference"], "reviewedByHuman": False})
            (stage / "authority-transition.jsonl").write_text("".join(json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n" for row in sorted(transitions, key=lambda row: row["workId"])), encoding="utf-8", newline="\n")
        _write_result_manifest(stage)
        _verify_result_manifest(stage)
        os.replace(stage, output_root)
        _verify_result_manifest(output_root)
        return {
            "status": "PUBLISHED",
            "batchId": batch_id,
            "outputRoot": str(output_root),
            "candidateSha256": sha256(output_root / candidate.name),
            "registrySha256": sha256(output_root / registry_output.name),
            "canonicalSha256": canonical_before,
            "targetCount": result["targetCount"],
            "acceptedClaimCount": result["acceptedClaimCount"],
            "changedClaimCount": result["changedClaimCount"],
            "retainedBaselineConflictCount": len(conflicts),
            "safetyArtifactDigest": safety["artifactDigest"],
            "safetySafeCount": safety["validation"]["safeCount"],
            "priorCorrectionCount": len(corrections),
            "demotedWorkCount": len(backend.recovery_readback["demotedWorkIds"]) if recovery else len(backend.correction_readback["demotedWorkIds"]) if corrections else 0,
            "freshSnapshotWorkCount": len(fresh_snapshots),
            "recoverySnapshotWorkCount": len(recovery),
        }
    except Exception:
        if stage.exists():
            shutil.rmtree(stage)
        if output_root.exists():
            shutil.rmtree(output_root)
        raise


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-root", type=artifact_path, required=True)
    parser.add_argument("--panel-output-root", type=artifact_path, required=True)
    parser.add_argument("--previous-catalog", type=artifact_path, required=True)
    parser.add_argument("--previous-registry", type=artifact_path, required=True)
    parser.add_argument("--frozen-baseline", type=artifact_path)
    parser.add_argument("--frozen-registry", type=artifact_path)
    parser.add_argument("--safety-root", type=artifact_path, required=True)
    parser.add_argument("--output-root", type=artifact_path, required=True)
    parser.add_argument("--reviewed-at", default="2026-09-02T21:00:00+09:00")
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args(argv)
    if not args.validate_only:
        sys.dont_write_bytecode = True
        sys.path.insert(0, str(_repo_root() / "scripts"))
        from catalog_workspace import record_arguments
        recorded = record_arguments(Path(__file__), args, argv)
        if recorded is not None:
            return recorded
    try:
        if args.validate_only:
            frozen_baseline = args.frozen_baseline or args.previous_catalog
            frozen_registry = args.frozen_registry or args.previous_registry
            if args.previous_catalog.resolve() != frozen_baseline.resolve():
                if args.previous_catalog.resolve().parent != args.previous_registry.resolve().parent:
                    raise ValidationError("cumulative catalog and registry must come from the same prior run")
                _verify_result_manifest(args.previous_catalog.resolve().parent)
            _, authority_chunks, _ = validate_input(args.input_root)
            target_ids = {row["workId"] for chunk in authority_chunks for row in read_csv(chunk / "targets.csv", TARGET_FIELDS)}
            prior_authority = panel_validation.load_prior_authority(args.input_root, frozen_baseline, work_ids=target_ids)
            prior_evidence = prior_authority["evidence"]
            recovery = factor_recovery.validate_publish(args.input_root, args.panel_output_root, frozen_baseline, args.previous_catalog)
            corrections = _validate_axis_corrections(args.input_root, args.panel_output_root, frozen_baseline, args.previous_catalog)
            fresh_snapshots = {} if recovery else _validate_fresh_unreviewed_snapshots(
                args.input_root, args.panel_output_root, frozen_baseline, args.previous_catalog, prior_authority
            )
            conflicts, _ = _load_conflict_adjudication(
                args.input_root, args.panel_output_root, frozen_baseline
            )
            if set(fresh_snapshots) & {key[0] for key in conflicts}:
                raise ValidationError("fresh snapshot target cannot use retained-baseline conflict adjudication")
            if recovery and (corrections or conflicts):
                raise ValidationError("recovery cannot mix prior corrections or retained conflicts")
            repo = _repo_root()
            registry_slice = _verify_input_identities(
                args.input_root, frozen_baseline, frozen_registry, repo
            )
            if args.previous_registry.resolve() != frozen_registry.resolve() and args.previous_catalog.resolve() == frozen_baseline.resolve():
                registry_sha = str(_read_json(args.input_root / "panel-input.json")["registrySha256"])
                registry_slice = _registry_correction_slice(
                    args.input_root, frozen_baseline, args.previous_registry, registry_sha
                )
            safety = _publication_safety(args.safety_root, args.input_root, args.panel_output_root, recovery)
            batch_id = str(_read_json(args.input_root / "panel-input.json")["batchId"])
            backend = _backend_module(safety, prior_evidence, conflicts, prior_authority, corrections, fresh_snapshots, recovery)
            import factor_single_pass as single
            single.install_backend(backend, args.input_root, args.panel_output_root)
            prepared, _ = backend.preflight(
                args.input_root,
                args.panel_output_root,
                args.previous_catalog,
                args.previous_registry,
                args.reviewed_at,
                f"reviews/authorized-evidence-panel-v1-batch-{batch_id}.md",
                repo / "data" / "staging" / "catalog-expansion" / "gold-set-manifest.json",
                registry_slice,
            )
            result: dict[str, object] = dict(prepared["panelResult"])
            result["safety"] = safety["validation"]
            result["safetyArtifactDigest"] = safety["artifactDigest"]
            result["retainedBaselineConflictCount"] = len(conflicts)
            result["freshSnapshotWorkCount"] = len(fresh_snapshots)
            result["status"] = "PASS"
        else:
            result = publish_batch(
                args.input_root, args.panel_output_root, args.previous_catalog,
                args.previous_registry, args.safety_root, args.output_root, args.reviewed_at,
                args.frozen_baseline, args.frozen_registry,
            )
    except (OSError, ValidationError, sqlite3.Error, ValueError) as error:
        print(json.dumps({"status": "BLOCKED", "error": str(error)}, ensure_ascii=False, separators=(",", ":")), file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
