#!/usr/bin/env python3
"""Fail-closed validator for frozen factor-rescue panel results."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import os
import re
import sqlite3
import sys
import types
from collections import defaultdict
from contextlib import closing
from pathlib import Path, PurePosixPath
from authoring_paths import REPO, ROOT, LEGACY, artifact_path
from urllib.parse import urlsplit


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
INPUT_KEYS = {
    "schemaVersion", "batchId", "frozenAt", "targetCount", "chunkCount",
    "annotationReviewMethod", "candidateOnly", "reviewedByHuman", "grokExcluded",
    "paidSourcesExcluded", "aniListAuthorizingEvidence",
    "collectorDecisionClaimsIncluded", "baselineCandidateSha256", "registrySha256",
    "canonicalSha256", "goldManifestSha256", "policyDigests",
}
POLICY_KEYS = {
    "factorDictionary", "annotationGuide", "authorizedEvidencePanel",
    "authoringAuthority",
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
RESULT_FILES = {
    "PANEL-INPUT.sha256", "authorized-evidence-panel-v1.md",
    "evidence-panel-ledger.csv", "evidence-panel-summary.json",
    "promotion-ledger.csv", "PANEL-RESULT.sha256",
}
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
SHA_RE = re.compile(r"^[0-9a-f]{64}$")
SHA_ROW = re.compile(r"^([0-9a-f]{64})  ([^\r\n]+)$")
DECIMAL_RE = re.compile(r"^(?:0(?:\.\d+)?|1(?:\.0+)?)$")
SEMANTIC_FIELDS = (
    "workId", "factKey", "state", "value", "confidence", "evidenceIds",
    "citationUrls", "entryScope", "observation", "limitation", "decision", "reasonCode",
)
DECISION_FIELDS = (
    "workId", "factKey", "priorSemanticSha256", "baselineSemanticSha256", "action", "resultSemanticSha256", "reasonCode",
)


class ValidationError(ValueError):
    pass


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _safe_child(base: Path, relative: str) -> Path:
    return _safe_child_resolved(base, relative, base.resolve())


def _safe_child_resolved(base: Path, relative: str, resolved_base: Path) -> Path:
    pure = PurePosixPath(relative)
    if pure.is_absolute() or "\\" in relative or not pure.parts or any(part in {"", ".", ".."} for part in pure.parts):
        raise ValidationError(f"unsafe manifest path: {relative!r}")
    child = base.joinpath(*pure.parts)
    if os.path.commonpath((str(resolved_base), str(child.resolve()))) != str(resolved_base):
        raise ValidationError(f"manifest path escapes root: {relative!r}")
    return child


def verify_manifest(base: Path, manifest: Path, expected_paths: set[str]) -> dict[str, str]:
    resolved_base = base.resolve()
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
        if not match:
            raise ValidationError(f"invalid manifest row: {manifest}:{number}")
        expected, relative = match.groups()
        if relative in entries:
            raise ValidationError(f"duplicate manifest path: {manifest}:{number}: {relative}")
        path = _safe_child_resolved(base, relative, resolved_base)
        if not path.is_file() or path.is_symlink():
            raise ValidationError(f"manifest member missing or non-regular: {path}")
        actual = sha256(path)
        if actual != expected:
            raise ValidationError(f"manifest mismatch: {path}: expected={expected}, actual={actual}")
        entries[relative] = expected
    if list(entries) != sorted(entries):
        raise ValidationError(f"manifest paths are not sorted: {manifest}")
    if set(entries) != expected_paths:
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


def read_json(path: Path) -> object:
    try:
        raw = path.read_bytes()
        if raw.startswith(b"\xef\xbb\xbf") or b"\r" in raw or not raw.endswith(b"\n"):
            raise ValidationError(f"JSON must be UTF-8 without BOM, LF-only, newline-terminated: {path}")
        return json.loads(raw.decode("utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ValidationError(f"invalid JSON {path}: {error}") from error


def exact_dict(value: object, keys: set[str], label: str) -> dict[str, object]:
    if not isinstance(value, dict) or set(value) != keys:
        raise ValidationError(f"invalid {label} keys")
    return value


def exact_count(value: object, label: str, positive: bool = False) -> int:
    if type(value) is not int or value < (1 if positive else 0):
        raise ValidationError(f"invalid integer for {label}")
    return value


def code_unit_key(value: str) -> bytes:
    return value.encode("utf-16-be", "surrogatepass")


def split_list(value: str, label: str, *, require_sorted: bool = True) -> list[str]:
    items = value.split(";") if value else []
    if any(not item or item != item.strip() for item in items) or len(items) != len(set(items)):
        raise ValidationError(f"invalid semicolon list for {label}")
    if require_sorted and items != sorted(items, key=code_unit_key):
        raise ValidationError(f"semicolon list is not code-unit sorted for {label}")
    return items


def valid_url(value: str, label: str) -> None:
    parsed = urlsplit(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValidationError(f"invalid HTTP(S) URL for {label}: {value!r}")


def confidence(value: str, label: str) -> None:
    if not DECIMAL_RE.fullmatch(value):
        raise ValidationError(f"invalid canonical confidence: {label}")
    number = float(value)
    if not math.isfinite(number) or not 0 <= number <= 1:
        raise ValidationError(f"confidence outside 0..1: {label}")


def citation_digest(urls: list[str]) -> str:
    payload = json.dumps(sorted(set(urls), key=code_unit_key), ensure_ascii=False, separators=(",", ":"))
    return sha256_bytes(payload.encode("utf-8"))


def fact_kind(fact_key: str) -> tuple[str, str]:
    if ":" not in fact_key:
        raise ValidationError(f"invalid factKey: {fact_key!r}")
    prefix, name = fact_key.split(":", 1)
    valid = AXES if prefix == "axis" else GENRES if prefix == "genre" else THEMES if prefix == "theme" else ()
    if prefix not in {"axis", "genre", "theme"}:
        raise ValidationError(f"ledger factKey must use axis/theme/genre: {fact_key!r}")
    if prefix == "theme" and name == "minimum":
        raise ValidationError("forbidden diagnostic sentinel theme:minimum")
    if name not in valid:
        raise ValidationError(f"invalid factor vocabulary: {fact_key!r}")
    return prefix, name


def claim_semantic_digest(row: dict[str, str] | None) -> str:
    value = {key: row[key] for key in SEMANTIC_FIELDS} if row is not None else None
    return sha256_bytes(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def baseline_axis_digest(row: dict[str, str]) -> str:
    value = {key: row[key] for key in ("workId", "axisId", "state", "value", "confidence", "evidenceId")}
    return sha256_bytes(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def baseline_absent_tag_digest(work_id: str, fact_key: str) -> str:
    if fact_kind(fact_key)[0] not in {"genre", "theme"} or not work_id:
        raise ValidationError("absent tag binding requires a work and Genre/Theme fact")
    value = {"workId": work_id, "factKey": fact_key, "state": "absent"}
    return sha256_bytes(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def baseline_stored_tag_digest(work_id: str, fact_key: str, row: dict[str, str]) -> str:
    """Bind stored membership/value and provenance independently of the prior claim."""
    kind, name = fact_kind(fact_key)
    if kind == "genre" and row.get("id") == work_id and name in row.get("genres", "").split(";"):
        fields = ("id", "genres", "evidenceId")
    elif kind == "theme" and (row.get("workId"), row.get("themeId")) == (work_id, name):
        fields = ("workId", "themeId", "centrality", "confidence", "evidenceId")
    else:
        raise ValidationError("stored tag binding requires its exact same-work Genre/Theme row")
    value = {"workId": work_id, "factKey": fact_key, "state": "stored", "row": {key: row[key] for key in fields}}
    return sha256_bytes(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def merge_prior_evidence(evidence: dict[str, dict[str, str]], row: dict[str, str]) -> None:
    evidence_id = row.get("evidenceId", row.get("id", ""))
    if not evidence_id or not row.get("sourceUrl"):
        return
    source = {**row, "retrievedAt": row.get("retrievedAt", row.get("fetchedAt", "")),
              "observation": row.get("observation", row.get("notes", "")), "limitation": row.get("limitation", "Frozen prior source record.")}
    old = evidence.get(evidence_id)
    fields = ("workId", "targetType", "targetId", "sourceType", "sourceUrl", "retrievedAt", "entryScope", "observation", "limitation", "confidence")
    if old is not None and any(old.get(field, "") != source.get(field, "") for field in fields):
        raise ValidationError(f"ambiguous prior evidence: {evidence_id}")
    evidence[evidence_id] = source


def integrated_correction_claims(root: Path) -> list[tuple[dict[str, str], dict[str, str]]]:
    """Recover the original integration's packet-backed corrections, not note labels.

    The caller has verified the complete publication manifest. This adapter checks
    the original target/result/review bindings and reproduces its pure projection;
    unknown claims are not granted known-claim authority by this legacy adapter.
    """
    correction_fields = (
        "schemaVersion", "chunkId", "targetFileSha256", "targetId", "workId", "factKey",
        "decision", "resolvedValue", "evidenceIdsJson", "citationUrlsJson", "entryRange",
        "rationale", "candidateOnly", "reviewedByHuman", "grokUsed", "researchCost",
    )
    target_fields = (
        "schemaVersion", "chunkId", "targetId", "issueIndex", "issueSha256", "workId",
        "factKey", "currentValue", "finding", "requiredCorrection", "evidenceIdsJson",
        "citationUrlsJson", "packetPath", "packetDigest", "claimRowsSha256", "authorityBundleSha256",
    )
    rescued_fields = (
        "schemaVersion", "chunkId", "workId", "evidenceId", "sourceUrl", "sourceKind",
        "entryRange", "observation", "retrievedDate", "researchCost", "aniListReferenceOnly",
        "grokUsed", "evidenceSha256",
    )
    contract = root / "audit/correction"
    external = root / "audit/external"
    ledger = read_csv(root / "correction-ledger.csv", correction_fields + ("independentReviewReference",))
    initial = read_csv(external / "result/claim-ledger.batch-001.csv", PRIOR_FIELDS)
    input_hashes = dict((match.group(2), match.group(1)) for line in (external / "PANEL-INPUT.batch-001.sha256").read_text(encoding="ascii").splitlines() if (match := SHA_ROW.fullmatch(line)))
    source_hashes = dict((match.group(2), match.group(1)) for line in (external / "SOURCE-root-MANIFEST.sha256").read_text(encoding="ascii").splitlines() if (match := SHA_ROW.fullmatch(line)))
    result_hashes = dict((match.group(2), match.group(1)) for line in (external / "PANEL-RESULT.batch-001.sha256").read_text(encoding="ascii").splitlines() if (match := SHA_ROW.fullmatch(line)))
    if result_hashes.get("result/claim-ledger.batch-001.csv") != sha256(external / "result/claim-ledger.batch-001.csv"):
        raise ValidationError("integrated correction initial result binding mismatch")

    def canonical_hash(value: object) -> str:
        return sha256_bytes((json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8"))

    def entry_volumes(value: str) -> set[int]:
        value = value.replace("_", " ")
        if value == "entry 1 3 volumes":
            return {1, 2, 3}
        match = re.fullmatch(r"(?:series entry through )?volumes? ([1-3])(?:[- ]([1-3]))?", value)
        if match is None:
            raise ValidationError(f"integrated correction unsupported entry scope: {value}")
        first, last = int(match.group(1)), int(match.group(2) or match.group(1))
        if value.startswith("series entry through "):
            first = 1
        if first > last:
            raise ValidationError(f"integrated correction reversed entry scope: {value}")
        return set(range(first, last + 1))

    policy_names = (
        "overlay/docs/factors/factor-dictionary.md", "overlay/docs/factors/annotation-guide.md",
        "overlay/docs/planning/09-catalog-authoring-authority.md",
        "overlay/docs/catalog-expansion/02-authorized-evidence-panel-v1.md",
    )
    if any(name not in source_hashes for name in policy_names) or any(input_hashes.get(name) != source_hashes[name] for name in policy_names if name in input_hashes):
        raise ValidationError("integrated correction missing original policy binding")
    authority_digest = canonical_hash({name: source_hashes[name] for name in policy_names})
    chunks = sorted((contract / "targets").glob("chunk-*.csv"))
    verify_manifest(contract, contract / "TARGETS.sha256", {path.relative_to(contract).as_posix() for path in chunks})
    originals = defaultdict(list)
    for row in initial:
        originals[(row["workId"], row["factKey"])].append(row)
    all_results = []
    targets = {}
    rescued_sources = {}
    reviewed = set()
    for path in sorted((contract / "reviews").glob("*/REVIEW.json")):
        review = read_json(path)
        if review.get("schemaVersion") != "initial-pass-correction-v1-independent-review" or review.get("verdict") != "PASS":
            raise ValidationError(f"integrated correction review not accepted: {path}")
        bindings = review.get("results", [])
        if review.get("chunkId") and review.get("resultHashes"):
            bindings = [{"chunkId": review["chunkId"], "targetSha256": review.get("targetFileSha256"),
                         **{key: review["resultHashes"].get(name) for key, name in (
                             ("correctionsSha256", "corrections.csv"), ("rescuedEvidenceSha256", "rescued-evidence.csv"),
                             ("workResultsSha256", "work-results.csv"), ("manifestSha256", "MANIFEST.sha256"))}}]
        for binding in bindings:
            chunk_id = binding.get("chunkId", "")
            if re.fullmatch(r"\d{2}", chunk_id) is None or chunk_id in reviewed:
                raise ValidationError("integrated correction ambiguous review membership")
            paths = {"targetSha256": contract / "targets" / f"chunk-{chunk_id}.csv"}
            paths.update({key: contract / "results" / f"chunk-{chunk_id}" / name for key, name in (
                ("correctionsSha256", "corrections.csv"), ("rescuedEvidenceSha256", "rescued-evidence.csv"),
                ("workResultsSha256", "work-results.csv"), ("manifestSha256", "MANIFEST.sha256"))})
            if any(binding.get(key) != sha256(value) for key, value in paths.items()):
                raise ValidationError(f"integrated correction review hash mismatch: {chunk_id}")
            reviewed.add(chunk_id)
    if reviewed != {path.stem.removeprefix("chunk-") for path in chunks}:
        raise ValidationError("integrated correction review coverage mismatch")
    for path in chunks:
        chunk_id = path.stem.removeprefix("chunk-")
        result = contract / "results" / path.stem
        verify_manifest(result, result / "MANIFEST.sha256", {"corrections.csv", "rescued-evidence.csv", "work-results.csv"})
        target_rows = read_csv(path, target_fields)
        rows = read_csv(result / "corrections.csv", correction_fields)
        for source in read_csv(result / "rescued-evidence.csv", rescued_fields):
            if source["schemaVersion"] != "initial-pass-correction-v1-result" or source["chunkId"] != chunk_id or (source["researchCost"], source["aniListReferenceOnly"], source["grokUsed"]) != ("FREE", "false", "false") or source["sourceKind"] not in {"official", "publisher", "licensed"} or not source["observation"] or not source["entryRange"] or re.fullmatch(r"\d{4}-\d{2}-\d{2}", source["retrievedDate"]) is None:
                raise ValidationError("integrated correction rescued evidence policy mismatch")
            valid_url(source["sourceUrl"], "integrated correction rescue")
            if "anilist.co" in urlsplit(source["sourceUrl"]).netloc.lower() or source["evidenceSha256"] != canonical_hash({field: source[field] for field in rescued_fields[:-1]}) or source["evidenceId"] in rescued_sources:
                raise ValidationError("integrated correction rescued evidence binding mismatch")
            rescued_sources[source["evidenceId"]] = source
        targets_by_id = {row["targetId"]: row for row in target_rows}
        if len(targets_by_id) != len(target_rows) or [row["targetId"] for row in rows] != sorted(targets_by_id):
            raise ValidationError(f"integrated correction target membership mismatch: {chunk_id}")
        for row in rows:
            target = targets_by_id[row["targetId"]]
            if row["targetId"] in targets or row["schemaVersion"] != "initial-pass-correction-v1-result" or target["schemaVersion"] != "initial-pass-correction-v1" or row["chunkId"] != chunk_id or target["chunkId"] != chunk_id or row["targetFileSha256"] != sha256(path) or any(row[key] != target[key] for key in ("workId", "factKey")):
                raise ValidationError(f"integrated correction target binding mismatch: {row['targetId']}")
            if (row["candidateOnly"], row["reviewedByHuman"], row["grokUsed"], row["researchCost"]) != ("true", "false", "false", "FREE"):
                raise ValidationError("integrated correction authority flags mismatch")
            targets[row["targetId"]] = target
        all_results.extend(rows)
    if [{key: row[key] for key in correction_fields} for row in ledger] != all_results or any(row["independentReviewReference"] != "reviews/authorized-evidence-panel-v1-batch-001.md" for row in ledger):
        raise ValidationError("integrated correction publication ledger mismatch")

    unique = {}
    for row in all_results:
        key = (row["workId"], row["factKey"])
        # Original integration deterministically selects the final target row for
        # duplicate same-decision/value issues; the generated record below must
        # exactly prove that selection, including its evidence and rationale.
        if key in unique and any(unique[key][field] != row[field] for field in ("decision", "resolvedValue")):
            raise ValidationError(f"integrated correction ambiguous decision: {key}")
        unique[key] = row
    recovered = []
    with closing(sqlite3.connect((root / "catalog-expanded.candidate.sqlite").resolve().as_uri() + "?mode=ro", uri=True)) as con:
        con.row_factory = sqlite3.Row
        for key, row in unique.items():
            if row["decision"] not in {"CORRECTED", "RESCUED"} or row["resolvedValue"] == "unknown" or not row["factKey"].startswith(("axis:", "theme:")):
                continue
            kind, name = fact_kind(row["factKey"])
            target = targets[row["targetId"]]
            matching = originals[key]
            if not matching or target["claimRowsSha256"] != canonical_hash(matching) or target["authorityBundleSha256"] != authority_digest:
                raise ValidationError(f"integrated correction original claim binding mismatch: {key}")
            prior_confidences = {old["confidence"] for old in matching if old["state"] == "known" and old["decision"] == "accepted" and old["value"] == target["currentValue"]}
            if len(prior_confidences) != 1:
                raise ValidationError(f"integrated correction ambiguous prior confidence: {key}")
            projected_confidence = next(iter(prior_confidences))
            confidence(projected_confidence, str(key))
            entry_volumes(row["entryRange"])
            if row["resolvedValue"] not in ({"0", "1", "2", "3", "4"} if kind == "axis" else {"1", "2"}):
                raise ValidationError(f"integrated correction value/scope mismatch: {key}")
            packet = external / "evidence-packets" / row["workId"]
            if target["packetPath"] != f"overlay/data/staging/catalog-expansion/v5-panel/batch-001/evidence-packets/{row['workId']}" or target["packetDigest"] != sha256(packet / "PACKET.sha256") or input_hashes.get(target["packetPath"] + "/PACKET.sha256") != target["packetDigest"] or any(old["packetDigest"] != target["packetDigest"] for old in matching):
                raise ValidationError(f"integrated correction packet binding mismatch: {key}")
            verify_manifest(packet, packet / "PACKET.sha256", {path.name for path in packet.iterdir() if path.is_file() and path.name != "PACKET.sha256"})
            packet_sources = {}
            for source in read_csv(packet / "evidence.csv", ORIGINAL_EVIDENCE_FIELDS):
                if source["workId"] != row["workId"] or source["id"] in packet_sources:
                    raise ValidationError(f"integrated correction source ownership mismatch: {key}")
                packet_sources[source["id"]] = source
            ids, urls = json.loads(row["evidenceIdsJson"]), json.loads(row["citationUrlsJson"])
            sources = packet_sources if row["decision"] == "CORRECTED" else rescued_sources
            if not isinstance(ids, list) or not isinstance(urls, list) or not ids or not urls or any(not isinstance(value, str) for value in ids + urls) or ids != sorted(set(ids)) or urls != sorted(set(urls)) or any(evidence_id not in sources or sources[evidence_id]["workId"] != row["workId"] for evidence_id in ids) or {sources[evidence_id]["sourceUrl"] for evidence_id in ids} != set(urls):
                raise ValidationError(f"integrated correction evidence identity mismatch: {key}")
            if row["decision"] == "CORRECTED" and row["resolvedValue"] == target["currentValue"] or row["decision"] == "RESCUED" and any(evidence_id in packet_sources or sources[evidence_id]["chunkId"] != row["chunkId"] for evidence_id in ids):
                raise ValidationError(f"integrated correction decision provenance mismatch: {key}")
            payload = {"workId": row["workId"], "factKey": row["factKey"], "value": row["resolvedValue"], "decision": row["decision"], "evidenceIds": ids, "citationUrls": urls}
            evidence_id = "ev-authorized-correction-" + sha256_bytes(json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))
            notes = (
                "candidateOnly=true; reviewedByHuman=false; authorityKind=authorizedEvidencePanel; "
                f"factKey={row['factKey']}; decision={row['decision']}; resolvedValue={row['resolvedValue']}; "
                f"entryRange={row['entryRange']}; evidenceIdsJson={json.dumps(ids, ensure_ascii=False, separators=(',', ':'))}; "
                f"citationUrlsJson={json.dumps(urls, ensure_ascii=False, separators=(',', ':'))}; rationale={row['rationale']}; grokUsed=false"
            ).replace("\r\n", "\n").replace("\r", "\n").replace("\n", "; ")
            expected_source = {"id": evidence_id, "workId": row["workId"], "targetType": kind, "targetId": name,
                               "sourceUrl": urls[0], "sourceType": "manual", "fetchedAt": "2026-09-02T12:00:00+09:00",
                               "extractorVersion": "catalog-integration-v1", "reviewedByHuman": "false", "confidence": projected_confidence, "notes": notes}
            actual_source = con.execute("select * from source_evidence where id=?", (evidence_id,)).fetchone()
            table, column = ("source_factors", "axisId") if kind == "axis" else ("source_themes", "themeId")
            factor = con.execute(f"select * from {table} where workId=? and {column}=?", (row["workId"], name)).fetchone()
            if actual_source is None or any(actual_source[field] != value for field, value in expected_source.items()) or factor is None or factor["value" if kind == "axis" else "centrality"] != row["resolvedValue"] or factor["confidence"] != projected_confidence or factor["evidenceId"] != evidence_id or (kind == "axis" and factor["state"] != "known"):
                raise ValidationError(f"integrated correction generated projection mismatch: {key}")
            recovered.append(({"workId": row["workId"], "factKey": row["factKey"], "state": "known", "value": row["resolvedValue"],
                               "confidence": projected_confidence, "evidenceIds": evidence_id, "citationUrls": urls[0], "entryScope": "entry_1_3_volumes",
                               "observation": notes, "limitation": "Frozen effective integrated claim; new values still require frozen supplemental evidence.",
                               "decision": "accepted", "reasonCode": "PRESERVED_VERIFIED_INTEGRATED_PANEL_CLAIM", "candidateOnly": "true", "reviewedByHuman": "false"}, expected_source))
    return recovered


def integrated_followup_claims(root: Path) -> tuple[list[dict[str, str]], dict[str, dict[str, str]]]:
    """Read the preserved legacy follow-up without changing modern input semantics.

    The caller has verified the complete parent publication and its bound digest.
    Reuse the exact original validator for the historical schema and result rules;
    additionally bind the relocated packets and independent review addenda.
    """
    validator_path = LEGACY / "followup-panel-tools/validate_panel_results.py"
    validator_bytes = validator_path.read_bytes()
    if sha256_bytes(validator_bytes) != "a53f09045f2d804d10ca402a427f6f2c7ffbb2f5d06868c37ab675baf6472336":
        raise ValidationError("integrated followup original validator identity mismatch")
    legacy = types.ModuleType("_verified_legacy_followup_validator")
    # Execute only the hash-bound validator; unlike an import this writes no
    # __pycache__ into the preserved original tools directory.
    exec(compile(validator_bytes, str(validator_path), "exec"), legacy.__dict__)
    contract = root / "audit/followup"
    prior_input, result_root = contract / "input", contract / "result"
    metadata = read_json(prior_input / "panel-input.json")
    expected = {
        "schemaVersion": "batch001-followup-panel-input-v1", "batchId": "001",
        "annotationReviewMethod": "authorizedEvidencePanel", "candidateOnly": True,
        "reviewedByHuman": False, "grokExcluded": True,
        "collectorDecisionClaimsIncluded": False,
        "priorPanelClaimsRole": "frozen-prior-adjudication",
        "supplementalEvidenceRole": "evidence-only; panel must re-derive every new claim",
    }
    if not isinstance(metadata, dict) or any(type(metadata.get(key)) is not type(value) or metadata[key] != value for key, value in expected.items()):
        raise ValidationError("integrated followup legacy input authority mismatch")
    policies = {key: sha256(prior_input / "contracts" / name) for key, name in (
        ("factorDictionary", "factor-dictionary.md"), ("annotationGuide", "annotation-guide.md"),
        ("authorizedEvidencePanel", "02-authorized-evidence-panel-v1.md"),
    )}
    if metadata.get("policyDigests") != policies:
        raise ValidationError("integrated followup policy binding mismatch")
    try:
        legacy.validate(prior_input, result_root)
    except (legacy.ValidationError, OSError) as error:
        raise ValidationError(f"integrated followup original validation failed: {error}") from error

    chunks = sorted((prior_input / "chunks").iterdir())
    chunk_names = {chunk.name for chunk in chunks}
    if {path.name for path in (contract / "reviews").iterdir()} != chunk_names:
        raise ValidationError("integrated followup review membership mismatch")
    claims, sources, seen = [], {}, set()
    for chunk in chunks:
        targets = read_csv(chunk / "targets.csv", legacy.TARGET_FIELDS)
        target_ids = {row["workId"] for row in targets}
        if seen & target_ids:
            raise ValidationError("integrated followup duplicate target across chunks")
        seen.update(target_ids)
        review = read_json(contract / "reviews" / chunk.name / "REVIEW.json")
        checked = review.get("checkedWorks")
        if review.get("chunkId") != chunk.name.removeprefix("chunk-") or review.get("verdict") != "PASS" or review.get("issues") != [] or not (
            type(checked) is int and checked == len(targets)
            or isinstance(checked, list) and len(checked) == len(targets) and set(checked) == target_ids
        ):
            raise ValidationError(f"integrated followup review binding mismatch: {chunk.name}")
        for target in targets:
            work_id = target["workId"]
            packet = chunk / "packets" / work_id
            packet_hash = sha256(packet / "PACKET.sha256")
            value = read_json(packet / "packet.json")
            if target["batchId"] != metadata["batchId"] or target["packetPath"] != f"overlay/data/staging/catalog-expansion/v5-panel/batch-001/evidence-packets/{work_id}" or target["packetDigest"] != packet_hash or value.get("work", {}).get("id") != work_id or value.get("work", {}).get("title") != target["title"] or value.get("batchId") != target["batchId"] or str(value.get("ordinal")) != target["ordinal"] or value.get("candidateOnly") is not True or value.get("reviewedByHuman") is not False or value.get("policyDigests") != policies:
                raise ValidationError(f"integrated followup packet binding mismatch: {work_id}")
            verify_manifest(packet, packet / "PACKET.sha256", {path.name for path in packet.iterdir() if path.is_file() and path.name != "PACKET.sha256"})
            for source in read_csv(packet / "evidence.csv", ORIGINAL_EVIDENCE_FIELDS):
                if source["workId"] != work_id:
                    raise ValidationError(f"integrated followup cross-work packet evidence: {work_id}")
                merge_prior_evidence(sources, source)
        for source in read_csv(chunk / "supplemental-evidence.csv", legacy.SUPPLEMENTAL_FIELDS):
            kind, target_id = source["targetType"], source["targetId"]
            vocabulary = {"axis": AXES, "theme": THEMES, "genre": GENRES}.get(kind)
            if source["workId"] not in target_ids or kind not in {"work", "volume", "episode", "entry", "axis", "theme", "genre"} or kind == "work" and target_id != source["workId"] or kind in {"volume", "episode", "entry"} and not target_id.startswith(source["workId"] + "-") or vocabulary is not None and target_id not in vocabulary:
                raise ValidationError(f"integrated followup cross-work supplemental evidence: {source['evidenceId']}")
            merge_prior_evidence(sources, source)
        for row in read_csv(result_root / chunk.name / "evidence-panel-ledger.csv", LEDGER_FIELDS):
            if row["decision"] == "accepted" and row["state"] == "known":
                # Preserve every semantic field, including original reason and
                # observation; this is not a new projection or adjudication.
                claims.append(row)

    addenda = contract / "hash-addenda"
    if {path.name for path in addenda.iterdir()} != {"chunk-03", "chunk-05", "chunk-07", "chunk-10"}:
        raise ValidationError("integrated followup hash-addendum membership mismatch")
    for directory in sorted(addenda.iterdir()):
        chunk_id = directory.name.removeprefix("chunk-")
        verify_manifest(directory, directory / "MANIFEST.sha256", {"REVIEW.json", "REVIEW.md"})
        review = read_json(directory / "REVIEW.json")
        if review.get("schemaVersion") != "followup-review-hash-addendum-v1" or review.get("chunkId") != chunk_id or review.get("verdict") != "PASS" or review.get("candidateOnly") is not True or review.get("reviewedByHuman") is not False or review.get("issues") != []:
            raise ValidationError("integrated followup hash-addendum authority mismatch")
        result = result_root / directory.name
        manifest = review.get("panelResultManifest", {})
        if manifest.get("path") != f"followup-panel-output-v1/{directory.name}/PANEL-RESULT.sha256" or manifest.get("sha256") != sha256(result / "PANEL-RESULT.sha256"):
            raise ValidationError("integrated followup result review binding mismatch")
        result_bindings = review.get("resultFiles") or review.get("resultFileBindings") or []
        expected_results = {f"followup-panel-output-v1/{directory.name}/{name}": sha256(result / name) for name in RESULT_FILES - {"PANEL-RESULT.sha256"}}
        semantic = review.get("semanticReview", {})
        semantic_bindings = semantic.get("files") or review.get("reviewBindings") or []
        expected_reviews = {f"followup-panel-review-v1/{directory.name}/{name}": sha256(contract / "reviews" / directory.name / name) for name in ("REVIEW.json", "REVIEW.md")}
        for bindings, expected_bindings in ((result_bindings, expected_results), (semantic_bindings, expected_reviews)):
            if len(bindings) != len(expected_bindings) or any(not isinstance(item, dict) for item in bindings) or {item.get("path"): item.get("sha256") for item in bindings} != expected_bindings:
                raise ValidationError("integrated followup review child hash binding mismatch")
        if semantic.get("verdict") != "PASS":
            raise ValidationError("integrated followup semantic review is not PASS")
    return claims, sources


def load_prior_authority(
    input_root: Path,
    baseline: Path | None = None,
    extra_bundles: tuple[tuple[Path, str], ...] = (),
    work_ids: set[str] | None = None,
    *, _active_roots: frozenset[Path] = frozenset(),
) -> dict[str, object]:
    """Resolve prior claims from manifest-bound source bundles, never labels."""
    from factor_recovery import validate_input_context
    import factor_single_pass as single
    recovery = validate_input_context(input_root, baseline, work_ids)
    if recovery is not None:
        for chunk in sorted((input_root / "chunks").glob("chunk-??")):
            if read_csv(chunk / "prior-panel-claims.csv", PRIOR_FIELDS):
                raise ValidationError("recovery requires fresh full adjudication, not imported prior claims")
        if load_prior_decisions(input_root):
            raise ValidationError("recovery supersession cannot import prior numerical decisions")
    bundles: list[tuple[Path, str | None]] = list(extra_bundles)
    if recovery is None and baseline is not None and (baseline.parent / "MANIFEST.sha256").is_file():
        bundles.append((baseline.parent.resolve(), None))
    sidecar = input_root / "prior-authority.json"
    if sidecar.is_file():
        value = exact_dict(read_json(sidecar), {"schemaVersion", "bundles"}, "prior authority")
        if value["schemaVersion"] != "factor-prior-authority-v1" or not isinstance(value["bundles"], list):
            raise ValidationError("invalid prior authority schema")
        for raw in value["bundles"]:
            item = exact_dict(raw, {"root", "manifestSha256"}, "prior bundle")
            if not isinstance(item["root"], str) or not isinstance(item["manifestSha256"], str) or not SHA_RE.fullmatch(item["manifestSha256"]):
                raise ValidationError("invalid prior bundle binding")
            bundles.append((_safe_child(input_root, item["root"]), item["manifestSha256"]))
    external = input_root / "external-prior-authority.json"
    if external.is_file():
        value = exact_dict(read_json(external), {"schemaVersion", "bundles"}, "external prior authority")
        if value["schemaVersion"] != "factor-external-prior-authority-v1" or not isinstance(value["bundles"], list):
            raise ValidationError("invalid external prior authority schema")
        for raw in value["bundles"]:
            item = exact_dict(raw, {"root", "manifestSha256"}, "external prior bundle")
            if not isinstance(item["root"], str) or not artifact_path(item["root"]).is_absolute() or not isinstance(item["manifestSha256"], str) or not SHA_RE.fullmatch(item["manifestSha256"]):
                raise ValidationError("invalid external prior bundle binding")
            bundles.append((artifact_path(item["root"]), item["manifestSha256"]))
    # Same source may be supplied by the caller and by its frozen reference.
    unique = {}
    for root, digest in bundles:
        if root.is_symlink() or any(parent.is_symlink() for parent in root.parents):
            raise ValidationError(f"linked prior bundle: {root}")
        root = artifact_path(root).resolve()
        previous = unique.get(root)
        if previous is not None and digest is not None and previous != digest:
            raise ValidationError(f"conflicting prior bundle binding: {root}")
        unique[root] = digest or previous
    bundles = list(unique.items())
    claims: dict[tuple[str, str], dict[str, dict[str, str]]] = defaultdict(dict)
    evidence: dict[str, dict[str, str]] = {}
    verified_packets: dict[Path, str] = {}

    def add_claim(row: dict[str, str]) -> None:
        if row["decision"] != "accepted" or not row["factKey"].startswith(("axis:", "genre:", "theme:")):
            return
        fact_kind(row["factKey"])
        if row["candidateOnly"] != "true" or row["reviewedByHuman"] != "false" or row["state"] != "known":
            raise ValidationError(f"invalid prior accepted boundary: {row['workId']} {row['factKey']}")
        if work_ids is not None and row["workId"] not in work_ids:
            return
        claims[(row["workId"], row["factKey"])][claim_semantic_digest(row)] = row

    for root, expected_digest in bundles:
        if root in _active_roots:
            raise ValidationError(f"cyclic prior authority: {root}")
        if not root.is_dir() or root.is_symlink() or any(path.is_symlink() for path in root.rglob("*")):
            raise ValidationError(f"prior bundle missing or linked: {root}")
        manifest = root / "MANIFEST.sha256"
        if not manifest.is_file() or manifest.is_symlink():
            raise ValidationError(f"prior bundle manifest missing or linked: {root}")
        if expected_digest is not None and sha256(manifest) != expected_digest:
            raise ValidationError(f"prior bundle manifest binding mismatch: {root}")
        members = {path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file() and path != manifest}
        verify_manifest(root, manifest, members)
        modern = root / "authorized-evidence-panel-v1"
        sealed_input = root / "panel-input"
        sealed_result = root / "panel-result"
        has_sealed_layout = sealed_input.exists() or sealed_result.exists()
        if modern.is_dir() and has_sealed_layout:
            raise ValidationError(f"ambiguous prior publication layout: {root}")
        if modern.is_dir():
            inputs = list((modern / "input").glob("*/PANEL-INPUT.sha256"))
            outputs = list((modern / "result").glob("*/chunk-*/PANEL-RESULT.sha256"))
        elif has_sealed_layout:
            inputs = [sealed_input / "PANEL-INPUT.sha256"] if (sealed_input / "PANEL-INPUT.sha256").is_file() else []
            outputs = list(sealed_result.glob("chunk-*/PANEL-RESULT.sha256")) if sealed_result.is_dir() else []
        else:
            inputs = []
            outputs = []
        if modern.is_dir() or has_sealed_layout:
            if len(inputs) != 1 or not outputs:
                raise ValidationError(f"ambiguous prior publication layout: {root}")
            prior_input = inputs[0].parent
            prior_info, chunks, _ = validate_input(prior_input)
            if prior_info["schemaVersion"] == single.INPUT:
                # Verify the original decision-to-ledger/context projection, not
                # just a rehashed collection of v3 result files. Explicit prior
                # dependencies retain their original authority and cycle checks.
                prior_ids = {row["workId"] for chunk in chunks for row in read_csv(chunk / "targets.csv", TARGET_FIELDS)}
                original_authority = load_prior_authority(
                    prior_input, work_ids=prior_ids, _active_roots=_active_roots | {root},
                )
                validate(prior_input, outputs[0].parent.parent, original_authority)
            for chunk in chunks:
                for path in (chunk / "packets").glob("*/evidence.csv"):
                    for row in read_csv(path, ORIGINAL_EVIDENCE_FIELDS):
                        if row["workId"] != path.parent.name:
                            raise ValidationError(f"cross-work prior packet evidence: {path}")
                        if work_ids is None or row["workId"] in work_ids:
                            merge_prior_evidence(evidence, row)
                for row in read_csv(chunk / "supplemental-evidence.csv", SUPPLEMENTAL_FIELDS):
                    if row["targetType"] != "work" or row["targetId"] != row["workId"]:
                        raise ValidationError(f"cross-work prior supplemental evidence: {row['evidenceId']}")
                    if work_ids is None or row["workId"] in work_ids:
                        merge_prior_evidence(evidence, row)
            if {path.parent.name for path in outputs} != {chunk.name for chunk in chunks} or len(outputs) != len(chunks):
                raise ValidationError(f"prior result chunk membership mismatch: {root}")
            for output_manifest in outputs:
                result = output_manifest.parent
                verify_manifest(result, output_manifest, single.result_files(prior_info) - {"PANEL-RESULT.sha256"})
                if (result / "PANEL-INPUT.sha256").read_bytes() != inputs[0].read_bytes():
                    raise ValidationError(f"prior result/input binding mismatch: {result}")
                chunk_digest = sha256(prior_input / "chunks" / result.name / "CHUNK.sha256")
                for row in read_csv(result / "evidence-panel-ledger.csv", LEDGER_FIELDS):
                    if row["authorityKind"] != "authorizedEvidencePanelV1" or row["authorityArtifactDigest"] != chunk_digest:
                        raise ValidationError(f"prior claim artifact binding mismatch: {result}")
                    if row["citationSetDigest"] != citation_digest(split_list(row["citationUrls"], "prior citations")):
                        raise ValidationError(f"prior citation digest mismatch: {result}")
                    add_claim(row)
        elif (root / "audit/correction").is_dir():
            for claim, source in integrated_correction_claims(root):
                if work_ids is None or source["workId"] in work_ids:
                    merge_prior_evidence(evidence, source)
                add_claim(claim)
            if (root / "audit/followup").exists():
                followup_claims, followup_sources = integrated_followup_claims(root)
                for source in followup_sources.values():
                    if work_ids is None or source["workId"] in work_ids:
                        merge_prior_evidence(evidence, source)
                for claim in followup_claims:
                    add_claim(claim)
        else:
            ledgers = sorted((root / "result").glob("claim-ledger.batch-*.csv"))
            if not ledgers:
                raise ValidationError(f"prior bundle has no recognized adjudication results: {root}")
            for ledger in ledgers:
                batch = ledger.stem.removeprefix("claim-ledger.batch-")
                manifest_members = {}
                for name in (f"PANEL-INPUT.batch-{batch}.sha256", f"PANEL-RESULT.batch-{batch}.sha256"):
                    paths = {SHA_ROW.fullmatch(line).group(2) for line in (root / name).read_text(encoding="ascii").splitlines() if SHA_ROW.fullmatch(line)}
                    manifest_members[name] = verify_manifest(root, root / name, paths)
                if ledger.relative_to(root).as_posix() not in manifest_members[f"PANEL-RESULT.batch-{batch}.sha256"]:
                    raise ValidationError(f"prior ledger is outside result manifest: {ledger}")
                for row in read_csv(ledger, PRIOR_FIELDS):
                    if row["decision"] != "accepted" or row["factType"] not in {"axis", "genre", "theme"}:
                        continue
                    packet = _safe_child(root, row["packetPath"])
                    packet_hash = verified_packets.get(packet) or sha256(packet / "PACKET.sha256")
                    if row["batchId"] != batch or packet.name != row["workId"] or packet_hash != row["packetDigest"] or f"{row['packetPath']}/PACKET.sha256" not in manifest_members[f"PANEL-INPUT.batch-{batch}.sha256"]:
                        raise ValidationError(f"prior packet binding mismatch: {row['workId']}")
                    if packet not in verified_packets:
                        packet_members = {path.name for path in packet.iterdir() if path.is_file() and path.name != "PACKET.sha256"}
                        verify_manifest(packet, packet / "PACKET.sha256", packet_members)
                        for source in read_csv(packet / "evidence.csv", ORIGINAL_EVIDENCE_FIELDS):
                            if source["workId"] != row["workId"]:
                                raise ValidationError(f"cross-work prior packet: {row['workId']}")
                            if work_ids is None or source["workId"] in work_ids:
                                merge_prior_evidence(evidence, source)
                        verified_packets[packet] = packet_hash
                    add_claim(row)
    return {**(recovery or {}), "claims": dict(claims), "evidence": evidence}


def require_prior_claim(row: dict[str, str], authority: dict[str, object]) -> None:
    key = (row["workId"], row["factKey"])
    originals = authority["claims"].get(key, {})
    if claim_semantic_digest(row) not in originals:
        raise ValidationError(f"prior accepted claim lacks exact manifest-bound original: {key[0]} {key[1]}")
    # The semantic digest above binds the original byte-order. Historical
    # validators accepted unsorted lists; sorting them would change authority.
    ids = split_list(row["evidenceIds"], "prior evidenceIds", require_sorted=False)
    urls = split_list(row["citationUrls"], "prior citationUrls", require_sorted=False)
    records = [authority["evidence"].get(evidence_id) for evidence_id in ids]
    if not ids or not urls or any(record is None or record["workId"] != row["workId"] for record in records):
        raise ValidationError(f"prior accepted claim lacks original same-work evidence: {key[0]} {key[1]}")
    if {record["sourceUrl"] for record in records} != set(urls):
        raise ValidationError(f"prior accepted claim original URL mismatch: {key[0]} {key[1]}")


def load_prior_decisions(input_root: Path) -> dict[tuple[str, str], dict[str, str]]:
    path = input_root / "prior-claim-decisions.csv"
    rows = read_csv(path, DECISION_FIELDS) if path.is_file() else []
    decisions = {}
    for row in rows:
        key = (row["workId"], row["factKey"])
        fact_kind(row["factKey"])
        if key in decisions or row["action"] not in {"WITHDRAW", "REPLACE"} or not row["reasonCode"] or any(not SHA_RE.fullmatch(row[field]) for field in ("priorSemanticSha256", "baselineSemanticSha256", "resultSemanticSha256")):
            raise ValidationError(f"invalid prior claim decision: {key}")
        decisions[key] = row
    return decisions


def preserved_prior(old: dict[str, str], result: dict[str, str] | None, decisions: dict[tuple[str, str], dict[str, str]]) -> bool:
    key = (old["workId"], old["factKey"])
    decision = decisions.get(key)
    if decision is None:
        if result is None or claim_semantic_digest(old) != claim_semantic_digest(result):
            raise ValidationError(f"accepted prior claim changed or omitted: {key[0]} {key[1]}")
        return True
    if decision["priorSemanticSha256"] != claim_semantic_digest(old) or decision["resultSemanticSha256"] != claim_semantic_digest(result):
        raise ValidationError(f"prior correction semantic binding mismatch: {key[0]} {key[1]}")
    if decision["action"] == "WITHDRAW":
        if key[1].startswith("axis:"):
            if result is None or result["state"] != "unknown" or result["decision"] != "explicitUnknown":
                raise ValidationError(f"withdrawn axis must be explicitUnknown: {key}")
        elif result is not None:
            raise ValidationError(f"withdrawn Genre/Theme must be omitted: {key}")
    elif result is None or result["decision"] not in {"accepted", "notApplicable"} or claim_semantic_digest(old) == claim_semantic_digest(result):
        raise ValidationError(f"replacement must contain a changed adjudicated claim: {key}")
    return False


def validate_input(input_root: Path) -> tuple[dict[str, object], list[Path], str]:
    import factor_single_pass as single
    input_root = input_root.resolve()
    if not input_root.is_dir() or input_root.is_symlink():
        raise ValidationError(f"panel input root missing or linked: {input_root}")
    files = []
    for path in input_root.rglob("*"):
        if path.is_symlink():
            raise ValidationError("input contains symlink")
        if path.is_file():
            files.append(path)
    manifest = input_root / "PANEL-INPUT.sha256"
    members = {path.relative_to(input_root).as_posix() for path in files if path != manifest}
    verify_manifest(input_root, manifest, members)
    panel = exact_dict(read_json(input_root / "panel-input.json"), INPUT_KEYS, "panel-input")
    expected_flags = {
        "annotationReviewMethod": "authorizedEvidencePanel",
        "candidateOnly": True,
        "reviewedByHuman": False,
        "grokExcluded": True,
        "paidSourcesExcluded": True,
        "aniListAuthorizingEvidence": False,
        "collectorDecisionClaimsIncluded": False,
    }
    if any(type(panel[key]) is not type(value) or panel[key] != value for key, value in expected_flags.items()):
        raise ValidationError("panel-input authority flags mismatch")
    if panel["schemaVersion"] not in {"authorized-evidence-panel-followup-v2", single.INPUT}:
        raise ValidationError("unsupported panel-input version")
    valid_id = single.valid_revision(panel["batchId"]) if panel["schemaVersion"] == single.INPUT else isinstance(panel["batchId"], str) and re.fullmatch(r"\d{3}", panel["batchId"]) is not None
    if not valid_id or not isinstance(panel["frozenAt"], str) or not panel["frozenAt"]:
        raise ValidationError("panel-input identity fields invalid")
    chunk_count = exact_count(panel["chunkCount"], "chunkCount", positive=True)
    target_count = exact_count(panel["targetCount"], "targetCount", positive=True)
    if panel["schemaVersion"] == single.INPUT:
        if target_count != 1 or chunk_count != 1 or "DECISION-SCHEMA.json" not in members:
            raise ValidationError("v3 requires one Work and its frozen decision schema")
        if not isinstance(read_json(input_root / "DECISION-SCHEMA.json"), dict):
            raise ValidationError("invalid frozen decision schema")
    if not 1 <= chunk_count <= target_count <= 200:
        raise ValidationError("factor batch requires 1..200 targets and 1..targetCount nonempty chunks")
    for key in ("baselineCandidateSha256", "registrySha256", "canonicalSha256", "goldManifestSha256"):
        if not isinstance(panel[key], str) or not SHA_RE.fullmatch(panel[key]):
            raise ValidationError(f"invalid panel-input digest: {key}")
    policies = exact_dict(panel["policyDigests"], POLICY_KEYS, "policyDigests")
    contract_paths = {
        "factorDictionary": "factor-dictionary.md",
        "annotationGuide": "annotation-guide.md",
        "authorizedEvidencePanel": "02-authorized-evidence-panel-v1.md",
        "authoringAuthority": "09-catalog-authoring-authority.md",
    }
    for key, name in contract_paths.items():
        if policies[key] != sha256(input_root / "contracts" / name):
            raise ValidationError(f"policy digest mismatch: {key}")
    chunks = [input_root / "chunks" / f"chunk-{number:02d}" for number in range(1, chunk_count + 1)]
    if {path.name for path in (input_root / "chunks").iterdir() if path.is_dir()} != {path.name for path in chunks}:
        raise ValidationError("input chunk membership mismatch")
    for chunk in chunks:
        chunk_manifest = chunk / "CHUNK.sha256"
        prefix = f"chunks/{chunk.name}/"
        chunk_members = {name[len(prefix):] for name in members if name.startswith(prefix) and name != prefix + "CHUNK.sha256"}
        verify_manifest(chunk, chunk_manifest, chunk_members)
    fresh_members = set()
    for path in input_root.rglob("*"):
        if path.is_symlink():
            raise ValidationError("input contains symlink")
        if path.is_file() and path != manifest:
            fresh_members.add(path.relative_to(input_root).as_posix())
    if fresh_members != members:
        raise ValidationError("input membership changed during validation")
    return panel, chunks, sha256(manifest)


def indexes(chunk: Path, targets: list[dict[str, str]], prior_authority: dict[str, object] | None = None) -> tuple[dict[str, tuple[str, str]], dict[str, dict[str, str]], dict[tuple[str, str], dict[str, str]], dict[str, dict[str, object]]]:
    target_ids = {row["workId"] for row in targets}
    frozen: dict[str, tuple[str, str]] = {}
    supplemental: dict[str, dict[str, str]] = {}
    research: dict[str, dict[str, object]] = {}

    def add(evidence_id: str, work_id: str, url: str) -> None:
        if not evidence_id or work_id not in target_ids:
            raise ValidationError(f"invalid frozen evidence row in {chunk.name}: {evidence_id!r}")
        valid_url(url, f"{chunk.name} {evidence_id}")
        record = (work_id, url)
        if evidence_id in frozen and frozen[evidence_id] != record:
            raise ValidationError(f"evidence ID collision in {chunk.name}: {evidence_id}")
        frozen[evidence_id] = record

    packet_root = chunk / "packets"
    if {path.name for path in packet_root.iterdir() if path.is_dir()} != target_ids:
        raise ValidationError(f"packet membership mismatch in {chunk.name}")
    for work_id in sorted(target_ids):
        for row in read_csv(packet_root / work_id / "evidence.csv", ORIGINAL_EVIDENCE_FIELDS):
            if row["id"] and row["sourceUrl"]:
                add(row["id"], row["workId"], row["sourceUrl"])
    for row in read_csv(chunk / "supplemental-evidence.csv", SUPPLEMENTAL_FIELDS):
        if row["evidenceId"] in supplemental:
            raise ValidationError(f"duplicate supplemental evidence ID: {row['evidenceId']}")
        if row["workId"] not in target_ids or row["targetType"] != "work" or row["targetId"] != row["workId"]:
            raise ValidationError(f"supplemental evidence is not same-work: {row['evidenceId']}")
        if row["collectorPass"] != "factor-evidence-collector-v1" or row["sourceType"] not in {"publisher", "manual"}:
            raise ValidationError(f"supplemental evidence authority boundary invalid: {row['evidenceId']}")
        if not row["entryScope"] or not row["observation"] or not row["limitation"]:
            raise ValidationError(f"incomplete supplemental evidence: {row['evidenceId']}")
        for fact_key in (item for item in row["claimCandidateKeys"].split(";") if item):
            prefix, separator, name = fact_key.partition(":")
            if separator != ":" or prefix not in {"factor", "genre", "theme"} or not name:
                raise ValidationError(f"invalid collector claim hint: {fact_key!r}")
        add(row["evidenceId"], row["workId"], row["sourceUrl"])
        supplemental[row["evidenceId"]] = row
    for number, line in enumerate((chunk / "collector-research.jsonl").read_text(encoding="utf-8").splitlines(), 1):
        try:
            item = json.loads(line)
        except json.JSONDecodeError as error:
            raise ValidationError(f"invalid collector research JSON: {chunk.name}:{number}") from error
        work_id = item.get("workId") if isinstance(item, dict) else None
        if work_id not in target_ids or work_id in research:
            raise ValidationError(f"collector research membership mismatch: {chunk.name}:{number}")
        research[work_id] = item
    if set(research) != target_ids:
        raise ValidationError(f"collector research membership mismatch: {chunk.name}")
    prior_rows = read_csv(chunk / "prior-panel-claims.csv", PRIOR_FIELDS)
    prior: dict[tuple[str, str], dict[str, str]] = {}
    prior_owners = {evidence_id: record[0] for evidence_id, record in frozen.items()}
    for row in prior_rows:
        if row["workId"] not in target_ids or row["reviewedByHuman"] != "false" or row["candidateOnly"] != "true":
            raise ValidationError(f"prior claim boundary mismatch: {row['workId']} {row['factKey']}")
        key = (row["workId"], row["factKey"])
        if key in prior:
            raise ValidationError(f"duplicate prior claim: {row['workId']} {row['factKey']}")
        prior[key] = row
        if row["decision"] == "accepted":
            original_order = any(row[field].split(";") != sorted(row[field].split(";"), key=code_unit_key) for field in ("evidenceIds", "citationUrls"))
            if original_order:
                if prior_authority is None:
                    prior_authority = load_prior_authority(chunk.parent.parent, work_ids=target_ids)
                require_prior_claim(row, prior_authority)
            ids = split_list(row["evidenceIds"], f"{row['workId']} {row['factKey']} prior evidenceIds", require_sorted=not original_order)
            urls = split_list(row["citationUrls"], f"{row['workId']} {row['factKey']} prior citationUrls", require_sorted=not original_order)
            for url in urls:
                valid_url(url, f"{row['workId']} {row['factKey']} prior")
            if not ids or not urls:
                raise ValidationError(f"prior evidence/citation presence mismatch: {row['workId']} {row['factKey']}")
            for evidence_id in ids:
                if evidence_id in prior_owners and prior_owners[evidence_id] != row["workId"]:
                    raise ValidationError(f"prior evidence is cross-work: {row['workId']} {row['factKey']} {evidence_id}")
                prior_owners[evidence_id] = row["workId"]
            exact_urls = {frozen[evidence_id][1] for evidence_id in ids if evidence_id in frozen}
            if not exact_urls <= set(urls) or (all(evidence_id in frozen for evidence_id in ids) and exact_urls != set(urls)):
                raise ValidationError(f"prior evidence URL set mismatch: {row['workId']} {row['factKey']}")
    return frozen, supplemental, prior, research


def validate_selected(row: dict[str, str], frozen: dict[str, tuple[str, str]]) -> tuple[list[str], list[str]]:
    label = f"{row['workId']} {row['factKey']}"
    ids = split_list(row["evidenceIds"], f"{label} evidenceIds")
    urls = split_list(row["citationUrls"], f"{label} citationUrls")
    for url in urls:
        valid_url(url, label)
    if bool(ids) != bool(urls):
        raise ValidationError(f"evidence/citation presence mismatch: {label}")
    expected_urls: set[str] = set()
    for evidence_id in ids:
        record = frozen.get(evidence_id)
        if record is None or record[0] != row["workId"]:
            raise ValidationError(f"missing or cross-work evidence: {label} {evidence_id}")
        expected_urls.add(record[1])
    if expected_urls != set(urls):
        raise ValidationError(f"evidence URL set mismatch: {label}")
    if row["citationSetDigest"] != citation_digest(urls):
        raise ValidationError(f"citationSetDigest mismatch: {label}")
    return ids, urls


def art_quorum(work_id: str, ids: list[str], supplemental: dict[str, dict[str, str]], research: dict[str, dict[str, object]]) -> bool:
    selected_urls = {supplemental[evidence_id]["sourceUrl"] for evidence_id in ids if evidence_id in supplemental}
    sources = [source for source in research[work_id].get("sources", []) if isinstance(source, dict) and source.get("url") in selected_urls]
    pages = 0
    contexts = 0
    for source in sources:
        sample = source.get("artSample")
        if isinstance(sample, dict) and set(sample) == {"imagePageCount", "visualContextCount"}:
            if type(sample["imagePageCount"]) is int and type(sample["visualContextCount"]) is int:
                pages += max(0, sample["imagePageCount"])
                contexts += max(0, sample["visualContextCount"])
    return pages >= 6 and contexts >= 2


def valid_evidence_scope(scope: str) -> bool:
    if scope in {"whole_work", "series_level", "full_series", "series_general_unbounded", "first_major_episode", "episodes_1_3", "entry_1_3_volumes_and_first_major_episode", "entry_1_3_volumes_or_first_major_episode"}:
        return True
    normalized = scope.replace("_", " ")
    match = re.fullmatch(r"(?:entry )?([1-9]\d*)(?: ([1-9]\d*))? volumes?", normalized)
    if match is None:
        match = re.fullmatch(r"(?:manga )?volumes? ([1-9]\d*)(?:[- ]([1-9]\d*))?", normalized)
    return match is not None and int(match[1]) <= int(match[2] or match[1])


def entry_scope_bound(scope: str, evidence_scopes: set[str]) -> bool:
    """A work-level claim may cite partial observations without claiming a full read."""
    if scope in {"whole_work", "series_level", "full_series", "series_general_unbounded"}:
        return bool(evidence_scopes) and all(valid_evidence_scope(item) for item in evidence_scopes)
    volumes = {
        "entry_1_volume": {1}, "entry_2_volume": {2}, "entry_3_volume": {3},
        "volume_1": {1}, "volume_2": {2}, "volume_3": {3},
        "manga volume 1": {1}, "manga volume 2": {2}, "manga volume 3": {3},
        "entry_1_2_volumes": {1, 2}, "entry_2_3_volumes": {2, 3},
        "entry_1_3_volumes": {1, 2, 3},
    }
    if scope == "entry_1_3_volumes_or_first_major_episode":
        return bool(evidence_scopes) and all(
            item == "first_major_episode" or item in volumes and volumes[item] <= {1, 2, 3}
            for item in evidence_scopes
        )
    if scope in volumes:
        return bool(evidence_scopes) and all(item in volumes and volumes[item] <= volumes[scope] for item in evidence_scopes)
    return evidence_scopes == {scope}


def validate_recovery_evidence(rows: list[dict[str, str]]) -> None:
    """Fresh evidence may contain observations, never materialized fact answers."""
    for row in rows:
        fact = row.get("targetType") in {"axis", "factor", "genre", "theme"}
        marker = " ".join(row.get(key, "") for key in ("extractorVersion", "notes")).lower()
        materialized = any(token in marker for token in ("resolvedvalue", "materialized", "priorclaimcorrection", "authorized-correction", "authorityartifactdigest"))
        authority = any(token in marker for token in ("authorizedevidencepanel", "authorizedmodelpanel"))
        if materialized or fact and (row.get("sourceType") == "model" or authority):
            raise ValidationError(f"recovery evidence imports materialized fact authority: {row.get('workId')} {row.get('id')}")


def recovery_safety_blockers(input_root: Path, work_ids: set[str], result_root: Path | None = None) -> set[str]:
    import factor_single_pass as single
    if single.is_single(input_root):
        if result_root is None:
            raise ValidationError("post-freeze safety requires its result")
        _, _, gates = single.project(input_root, read_json(result_root / "chunk-01/adjudication.json"))
        return {wid for wid, codes in gates.items() if "BLOCKED_SAFETY" in codes}
    from factor_recovery import validate_input_context
    if validate_input_context(input_root, work_ids=work_ids) is None:
        return set()
    for chunk in (input_root / "chunks").glob("chunk-??"):
        for path in (chunk / "packets").glob("*/evidence.csv"):
            validate_recovery_evidence(read_csv(path, ORIGINAL_EVIDENCE_FIELDS))
    from prepare_factor_batch import read_job, validated_safety
    job = read_job(input_root / "authoring-job.json", recovery=True)
    if {row["workId"] for row in job["works"]} != work_ids:
        raise ValidationError("recovery safety job membership mismatch")
    return {wid for wid, claim in validated_safety(job).items() if claim["outcome"] == "BLOCKED_SAFETY"}


def validate_unknown_evidence(ids, urls, label: str, digest: str | None = None) -> None:
    """Unknown is an explicit lack of a value, never an evidence-bearing claim."""
    if ids or urls or (digest is not None and digest != citation_digest([])):
        raise ValidationError(f"unknown claim carries evidence: {label}")


def validate_ledger(chunk: Path, result: Path, targets: list[dict[str, str]], artifact_digest: str, prior_authority: dict[str, object] | None = None) -> tuple[dict[str, dict[str, int]], dict[str, list[str]]]:
    target_ids = {row["workId"] for row in targets}
    authority = prior_authority or {"claims": {}, "evidence": {}}
    safety_blocked = recovery_safety_blockers(chunk.parent.parent, target_ids, result.parent)
    frozen, supplemental, prior, research = indexes(chunk, targets, authority)
    if (chunk / "recovery-declaration.json").is_file() and prior:
        raise ValidationError("recovery requires fresh full adjudication, not imported prior claims")
    decisions = load_prior_decisions(chunk.parent.parent)
    for old in prior.values():
        if old["decision"] == "accepted":
            require_prior_claim(old, authority)
    if any(key[0] in target_ids and (key not in prior or prior[key]["decision"] != "accepted") for key in decisions):
        raise ValidationError("prior correction does not target an accepted prior claim")
    rows = read_csv(result / "evidence-panel-ledger.csv", LEDGER_FIELDS)
    by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in rows:
        work_id, fact_key = row["workId"], row["factKey"]
        if work_id not in target_ids or (work_id, fact_key) in by_key:
            raise ValidationError(f"duplicate or out-of-target ledger fact: {work_id} {fact_key}")
        prefix, name = fact_kind(fact_key)
        state = row["state"]
        if state == "known":
            if row["decision"] != "accepted" or not row["confidence"]:
                raise ValidationError(f"known/decision mismatch: {work_id} {fact_key}")
            confidence(row["confidence"], f"{work_id} {fact_key}")
            if prefix == "axis" and row["value"] not in {"0", "1", "2", "3", "4"}:
                raise ValidationError(f"invalid axis value: {work_id} {fact_key}")
            if prefix == "genre" and row["value"] != "true":
                raise ValidationError(f"invalid genre value: {work_id} {fact_key}")
            if prefix == "theme" and row["value"] not in {"1", "2"}:
                raise ValidationError(f"invalid theme centrality: {work_id} {fact_key}")
        elif state == "unknown":
            if row["value"] or row["confidence"] or row["decision"] != "explicitUnknown":
                raise ValidationError(f"unknown/decision mismatch: {work_id} {fact_key}")
            validate_unknown_evidence(row["evidenceIds"], row["citationUrls"], f"{work_id} {fact_key}", row["citationSetDigest"])
        elif state == "notApplicable":
            if prefix != "axis" or name != "motionImpact" or row["value"] or row["decision"] != "notApplicable" or not row["confidence"]:
                raise ValidationError(f"invalid notApplicable claim: {work_id} {fact_key}")
            confidence(row["confidence"], f"{work_id} {fact_key}")
        else:
            raise ValidationError(f"invalid factor state: {work_id} {fact_key}: {state!r}")
        if not row["entryScope"] or not row["observation"] or not row["limitation"] or not row["reasonCode"]:
            raise ValidationError(f"incomplete claim metadata: {work_id} {fact_key}")
        if row["reviewedByHuman"] != "false" or row["candidateOnly"] != "true" or row["authorityKind"] != "authorizedEvidencePanelV1" or row["authorityArtifactDigest"] != artifact_digest:
            raise ValidationError(f"authority binding mismatch: {work_id} {fact_key}")
        old = prior.get((work_id, fact_key))
        preserved = old is not None and old["decision"] == "accepted" and preserved_prior(old, row, decisions)
        if preserved:
            ids = split_list(row["evidenceIds"], f"{work_id} {fact_key} evidenceIds", require_sorted=False)
            urls = split_list(row["citationUrls"], f"{work_id} {fact_key} citationUrls", require_sorted=False)
            if row["citationSetDigest"] != citation_digest(urls):
                raise ValidationError(f"citationSetDigest mismatch: {work_id} {fact_key}")
        else:
            ids, _ = validate_selected(row, frozen)
        if state in {"known", "notApplicable"} and not preserved:
            selected = [supplemental.get(evidence_id) for evidence_id in ids]
            if not ids or any(item is None or item["workId"] != work_id or item["targetId"] != work_id or item["sourceType"] not in {"publisher", "manual"} for item in selected):
                raise ValidationError(f"new claim lacks same-work non-model supplemental evidence: {work_id} {fact_key}")
            if not entry_scope_bound(row["entryScope"], {item["entryScope"] for item in selected if item is not None}):
                raise ValidationError(f"entryScope not bound to supplemental evidence: {work_id} {fact_key}")
            if prefix == "axis" and name in ART and not art_quorum(work_id, ids, supplemental, research):
                raise ValidationError(f"Art claim lacks 6-page/2-context or two-review quorum: {work_id} {fact_key}")
        by_key[(work_id, fact_key)] = row

    for key, old in prior.items():
        if old["decision"] == "accepted" and key not in by_key:
            preserved_prior(old, None, decisions)

    coverage: dict[str, dict[str, int]] = {}
    blockers: dict[str, list[str]] = {}
    for work_id in sorted(target_ids):
        axis_rows = {key.split(":", 1)[1]: row for (wid, key), row in by_key.items() if wid == work_id and key.startswith("axis:")}
        if set(axis_rows) != set(AXES):
            raise ValidationError(f"17-axis membership mismatch: {work_id}")
        known = {axis for axis, row in axis_rows.items() if row["state"] == "known"}
        item = {
            "genreCount": sum(wid == work_id and key.startswith("genre:") and row["state"] == "known" for (wid, key), row in by_key.items()),
            "themeCount": sum(wid == work_id and key.startswith("theme:") and row["state"] == "known" for (wid, key), row in by_key.items()),
            "narrativeKnown": len(known & NARRATIVE),
            "toneKnown": len(known & TONE),
            "artKnown": len(known & ART),
        }
        codes = []
        if work_id in safety_blocked: codes.append("BLOCKED_SAFETY")
        if item["genreCount"] < 1: codes.append("GENRE_COVERAGE_MISSING")
        if item["themeCount"] < 1: codes.append("THEME_COVERAGE_MISSING")
        if item["narrativeKnown"] < 4: codes.append("NARRATIVE_COVERAGE_INCOMPLETE")
        if item["toneKnown"] < 5: codes.append("TONE_COVERAGE_INCOMPLETE")
        coverage[work_id] = item
        blockers[work_id] = sorted(codes, key=code_unit_key)
    return coverage, blockers


def validate_contexts(chunk: Path, targets: list[dict[str, str]], blockers: dict[str, list[str]]) -> dict[str, dict[str, str]]:
    rows = read_csv(chunk / "recommendation-context-condition.csv", CONTEXT_FIELDS)
    target_ids = {row["workId"] for row in targets}
    contexts: dict[str, dict[str, str]] = {}
    for row in rows:
        work_id = row["workId"]
        if work_id not in target_ids or work_id in contexts:
            raise ValidationError(f"frozen context membership mismatch: {work_id}")
        ids = split_list(row["evidenceIds"], f"{work_id} context evidenceIds")
        urls = split_list(row["citationUrls"], f"{work_id} context citationUrls")
        for url in urls: valid_url(url, f"{work_id} context")
        if not row["condition"] or not row["catalogRole"] or not row["observation"] or not row["limitation"] or not ids or not urls:
            blockers[work_id] = sorted([*blockers[work_id], "RECOMMENDATION_CONTEXT_MISSING"], key=code_unit_key)
        contexts[work_id] = row
    if set(contexts) != target_ids or len(rows) != len(target_ids):
        raise ValidationError("frozen context membership mismatch")
    return contexts


def validate_promotion(result: Path, targets: list[dict[str, str]], contexts: dict[str, dict[str, str]], blockers: dict[str, list[str]]) -> None:
    rows = read_csv(result / "promotion-ledger.csv", PROMOTION_FIELDS)
    target_ids = {row["workId"] for row in targets}
    if len(rows) != len(target_ids) or {row["workId"] for row in rows} != target_ids:
        raise ValidationError("promotion target membership mismatch")
    for row in rows:
        work_id = row["workId"]
        codes = blockers[work_id]
        context = contexts[work_id]
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
            "reasonCode": "BLOCKED_SAFETY" if "BLOCKED_SAFETY" in codes else "FACTOR_COVERAGE_INCOMPLETE" if codes else "COVERAGE_COMPLETE",
        }
        if row != expected:
            raise ValidationError(f"promotion semantics mismatch: {work_id}")


def validate_summary(path: Path, panel: dict[str, object], chunk_id: str, input_digest: str, artifact_digest: str, coverage: dict[str, dict[str, int]], blockers: dict[str, list[str]]) -> tuple[int, int]:
    summary = exact_dict(read_json(path), SUMMARY_KEYS, "summary")
    works = summary["works"]
    if not isinstance(works, list) or [item.get("workId") if isinstance(item, dict) else None for item in works] != sorted(coverage, key=code_unit_key):
        raise ValidationError("summary works must exactly match targets and be sorted")
    passed = 0
    for raw in works:
        item = exact_dict(raw, WORK_SUMMARY_KEYS, "work summary")
        work_id = item["workId"]
        codes = blockers[work_id]
        expected_outcome = "BLOCKED" if codes else "PASS"
        passed += expected_outcome == "PASS"
        if item["outcome"] != expected_outcome or item["blockerCodes"] != codes:
            raise ValidationError(f"summary outcome mismatch: {work_id}")
        cov = exact_dict(item["coverage"], COVERAGE_KEYS, "coverage")
        if any(exact_count(cov[key], f"{work_id}.{key}") != coverage[work_id][key] for key in COVERAGE_KEYS):
            raise ValidationError(f"summary coverage mismatch: {work_id}")
        if type(item["recommendationEligible"]) is not bool or type(item["libraryOnly"]) is not bool or item["recommendationEligible"] != (not codes) or item["libraryOnly"] != bool(codes):
            raise ValidationError(f"summary eligibility mismatch: {work_id}")
    blocked = len(coverage) - passed
    expected = {
        "schemaVersion": "authorized-evidence-panel-v1",
        "batchId": panel["batchId"],
        "chunkId": chunk_id,
        "inputManifestSha256": input_digest,
        "chunkArtifactDigest": artifact_digest,
        "targetCount": len(coverage),
        "passCount": passed,
        "blockedCount": blocked,
    }
    if any(summary[key] != value for key, value in expected.items()):
        raise ValidationError(f"summary scalar mismatch: chunk-{chunk_id}")
    return passed, blocked


def validate(input_root: Path, result_root: Path, prior_authority: dict[str, object] | None = None) -> dict[str, int | str]:
    import factor_single_pass as single
    panel, chunks, input_digest = validate_input(input_root)
    targets_all = {row["workId"] for chunk in chunks for row in read_csv(chunk / "targets.csv", TARGET_FIELDS)}
    authority = prior_authority or load_prior_authority(input_root, work_ids=targets_all)
    if any(key[0] not in targets_all for key in load_prior_decisions(input_root)):
        raise ValidationError("prior correction outside target membership")
    result_root = result_root.resolve()
    if not result_root.is_dir() or any(path.is_symlink() for path in result_root.rglob("*")):
        raise ValidationError(f"result root missing or contains symlink: {result_root}")
    expected_chunks = {path.name for path in chunks}
    if {path.name for path in result_root.iterdir() if path.is_dir()} != expected_chunks or any(not path.is_dir() for path in result_root.iterdir()):
        raise ValidationError("result chunk membership mismatch")
    totals = {"targetCount": 0, "passCount": 0, "blockedCount": 0}
    for chunk in chunks:
        result = result_root / chunk.name
        expected_files = single.result_files(panel)
        if {path.name for path in result.iterdir() if path.is_file()} != expected_files or any(not path.is_file() for path in result.iterdir()):
            raise ValidationError(f"result file membership mismatch: {result}")
        if (result / "PANEL-INPUT.sha256").read_bytes() != (input_root / "PANEL-INPUT.sha256").read_bytes():
            raise ValidationError(f"copied PANEL-INPUT mismatch: {result}")
        verify_manifest(result, result / "PANEL-RESULT.sha256", expected_files - {"PANEL-RESULT.sha256"})
        report = result / "authorized-evidence-panel-v1.md"
        if not report.read_text(encoding="utf-8").strip():
            raise ValidationError(f"empty panel report: {report}")
        targets = read_csv(chunk / "targets.csv", TARGET_FIELDS)
        if not targets or len({row["workId"] for row in targets}) != len(targets) or any(row["batchId"] != panel["batchId"] for row in targets):
            raise ValidationError(f"invalid target membership: {chunk}")
        for target in targets:
            expected_path = f"packets/{target['workId']}"
            packet_manifest = chunk / expected_path / "PACKET.sha256"
            if target["packetPath"] != expected_path or target["packetDigest"] != sha256(packet_manifest):
                raise ValidationError(f"target packet binding mismatch: {target['workId']}")
        artifact_digest = sha256(chunk / "CHUNK.sha256")
        coverage, blockers = validate_ledger(chunk, result, targets, artifact_digest, authority)
        contexts = single.contexts(chunk, result, targets, blockers, authority)
        validate_promotion(result, targets, contexts, blockers)
        passed, blocked = validate_summary(result / "evidence-panel-summary.json", panel, chunk.name.removeprefix("chunk-"), input_digest, artifact_digest, coverage, blockers)
        totals["targetCount"] += len(targets)
        totals["passCount"] += passed
        totals["blockedCount"] += blocked
    if totals["targetCount"] != panel["targetCount"]:
        raise ValidationError("aggregate targetCount mismatch")
    return {"schemaVersion": "authorized-evidence-panel-v1-result-validation", "chunkCount": len(chunks), **totals}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-root", type=Path, required=True)
    parser.add_argument("--result-root", type=Path, required=True)
    args = parser.parse_args()
    try:
        report = validate(args.input_root, args.result_root)
    except (OSError, ValidationError) as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False, separators=(",", ":")), file=sys.stderr)
        return 1
    print(json.dumps(report, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
