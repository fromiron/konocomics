#!/usr/bin/env python3
"""Fail-closed validator for Batch001 authorized-evidence-panel chunk results."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path, PurePosixPath


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
    "genreCount", "themeCount", "blockerCodes", "attemptedUrls", "packetPath",
    "packetDigest",
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
    "entryScope", "observation", "limitation",
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
    pure = PurePosixPath(relative)
    if pure.is_absolute() or "\\" in relative or not pure.parts or any(p in {"", ".", ".."} for p in pure.parts):
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
        if not match:
            raise ValidationError(f"invalid manifest row: {manifest}:{number}")
        expected, relative = match.groups()
        if relative in entries:
            raise ValidationError(f"duplicate manifest path: {manifest}:{number}: {relative}")
        path = _safe_child(base, relative)
        if not path.is_file() or path.is_symlink():
            raise ValidationError(f"manifest member missing or non-regular: {path}")
        actual = sha256(path)
        if actual != expected:
            raise ValidationError(f"manifest mismatch: {path}: expected={expected}, actual={actual}")
        entries[relative] = expected
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


def read_json(path: Path) -> tuple[object, bytes]:
    try:
        raw = path.read_bytes()
        if raw.startswith(b"\xef\xbb\xbf") or b"\r" in raw or not raw.endswith(b"\n"):
            raise ValidationError(f"JSON must be UTF-8 without BOM, LF-only, newline-terminated: {path}")
        return json.loads(raw.decode("utf-8")), raw
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ValidationError(f"invalid JSON {path}: {error}") from error


def split_list(value: str, label: str) -> list[str]:
    items = value.split(";") if value else []
    if any(not item or item != item.strip() for item in items) or len(items) != len(set(items)):
        raise ValidationError(f"invalid semicolon list for {label}")
    return items


def citation_digest(urls: list[str]) -> str:
    payload = json.dumps(sorted(set(urls)), ensure_ascii=False, separators=(",", ":"))
    return sha256_bytes(payload.encode("utf-8"))


def fact_kind(fact_key: str) -> tuple[str, str]:
    if ":" not in fact_key:
        raise ValidationError(f"invalid factKey: {fact_key!r}")
    prefix, value = fact_key.split(":", 1)
    if prefix not in {"axis", "genre", "theme"}:
        raise ValidationError(f"ledger factKey must use axis/theme/genre: {fact_key!r}")
    if prefix == "theme" and value == "minimum":
        raise ValidationError("forbidden diagnostic sentinel theme:minimum")
    valid = AXES if prefix == "axis" else GENRES if prefix == "genre" else THEMES
    if value not in valid:
        raise ValidationError(f"invalid factor vocabulary: {fact_key!r}")
    return prefix, value


def exact_keys(value: object, expected: set[str], label: str) -> dict[str, object]:
    if not isinstance(value, dict) or set(value) != expected:
        raise ValidationError(f"invalid {label} keys")
    return value


def exact_int(value: object, label: str) -> int:
    if type(value) is not int or value < 0:
        raise ValidationError(f"invalid non-negative integer for {label}")
    return value


def validate_input(input_root: Path) -> tuple[dict[str, object], list[Path], str]:
    input_root = input_root.resolve()
    manifest = input_root / "PANEL-INPUT.sha256"
    actual_files = {
        path.relative_to(input_root).as_posix()
        for path in input_root.rglob("*")
        if path.is_file() and not path.is_symlink() and path != manifest
    }
    verify_manifest(input_root, manifest, actual_files)
    value, _ = read_json(input_root / "panel-input.json")
    if not isinstance(value, dict):
        raise ValidationError("panel-input.json must be an object")
    for key in ("batchId", "targetCount", "chunkCount"):
        if key not in value:
            raise ValidationError(f"panel-input.json missing {key}")
    chunk_count = exact_int(value["chunkCount"], "chunkCount")
    if chunk_count < 1:
        raise ValidationError("chunkCount must be positive")
    chunks = [input_root / "chunks" / f"chunk-{number:02d}" for number in range(1, chunk_count + 1)]
    actual_chunk_names = {path.name for path in (input_root / "chunks").iterdir() if path.is_dir()}
    if actual_chunk_names != {path.name for path in chunks}:
        raise ValidationError("input chunk membership mismatch")
    for chunk in chunks:
        chunk_manifest = chunk / "CHUNK.sha256"
        members = {
            path.relative_to(chunk).as_posix()
            for path in chunk.rglob("*")
            if path.is_file() and not path.is_symlink() and path != chunk_manifest
        }
        verify_manifest(chunk, chunk_manifest, members)
    return value, chunks, sha256(manifest)


def evidence_index(chunk: Path, target_ids: set[str]) -> dict[str, tuple[str, str]]:
    evidence: dict[str, tuple[str, str]] = {}

    def add(evidence_id: str, work_id: str, url: str) -> None:
        if work_id not in target_ids or not evidence_id or not url:
            raise ValidationError(f"invalid frozen evidence row in {chunk.name}: {evidence_id!r}")
        record = (work_id, url)
        if evidence_id in evidence and evidence[evidence_id] != record:
            raise ValidationError(f"evidence ID collision in {chunk.name}: {evidence_id}")
        evidence[evidence_id] = record

    packet_dirs = {path.name for path in (chunk / "packets").iterdir() if path.is_dir()}
    if packet_dirs != target_ids:
        raise ValidationError(f"packet membership mismatch in {chunk.name}")
    for work_id in sorted(target_ids):
        for row in read_csv(chunk / "packets" / work_id / "evidence.csv", ORIGINAL_EVIDENCE_FIELDS):
            add(row["id"], row["workId"], row["sourceUrl"])
    for row in read_csv(chunk / "supplemental-evidence.csv", SUPPLEMENTAL_FIELDS):
        add(row["evidenceId"], row["workId"], row["sourceUrl"])
    return evidence


def supplemental_scope_index(chunk: Path) -> dict[str, set[str]]:
    """Return frozen entry scopes by supplemental evidence ID.

    Original packet evidence predates the panel schema and has no entryScope
    column.  Its scope is therefore allowed through the preserved prior claim
    or the panel's canonical target scope; new claims can bind to an exact
    scope carried by supplemental evidence.
    """
    scopes: dict[str, set[str]] = defaultdict(set)
    for row in read_csv(chunk / "supplemental-evidence.csv", SUPPLEMENTAL_FIELDS):
        if row["entryScope"]:
            scopes[row["evidenceId"]].add(row["entryScope"])
    return scopes


def validate_ledger(chunk: Path, result: Path, targets: list[dict[str, str]], artifact_digest: str) -> tuple[dict[str, dict[str, int]], dict[str, list[str]]]:
    target_ids = {row["workId"] for row in targets}
    frozen_evidence = evidence_index(chunk, target_ids)
    frozen_scopes = supplemental_scope_index(chunk)
    prior = read_csv(chunk / "prior-panel-claims.csv", PRIOR_FIELDS)
    prior_accepted_scopes = {
        (row["workId"], row["factKey"]): row["entryScope"]
        for row in prior
        if row["decision"] == "accepted" and row["factType"] in {"axis", "genre", "theme"}
    }
    rows = read_csv(result / "evidence-panel-ledger.csv", LEDGER_FIELDS)
    by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in rows:
        work_id, fact_key = row["workId"], row["factKey"]
        if work_id not in target_ids:
            raise ValidationError(f"ledger work outside target set: {work_id}")
        key = (work_id, fact_key)
        if key in by_key:
            raise ValidationError(f"duplicate ledger fact: {work_id} {fact_key}")
        prefix, name = fact_kind(fact_key)
        state, value, decision = row["state"], row["value"], row["decision"]
        if state == "known":
            if decision != "accepted" or not row["confidence"]:
                raise ValidationError(f"known/decision mismatch: {work_id} {fact_key}")
            try:
                confidence = float(row["confidence"])
            except ValueError as error:
                raise ValidationError(f"invalid confidence: {work_id} {fact_key}") from error
            if not 0 <= confidence <= 1:
                raise ValidationError(f"confidence outside 0..1: {work_id} {fact_key}")
            if prefix == "axis" and (value not in {"0", "1", "2", "3", "4"}):
                raise ValidationError(f"invalid axis value: {work_id} {fact_key}")
            if prefix == "genre" and value != "true":
                raise ValidationError(f"invalid genre value: {work_id} {fact_key}")
            if prefix == "theme" and value not in {"1", "2"}:
                raise ValidationError(f"invalid theme centrality: {work_id} {fact_key}")
        elif state == "unknown":
            if value or row["confidence"] or decision != "explicitUnknown":
                raise ValidationError(f"unknown/decision mismatch: {work_id} {fact_key}")
        elif state == "notApplicable":
            if prefix != "axis" or name != "motionImpact" or value or decision != "notApplicable" or not row["confidence"]:
                raise ValidationError(f"invalid notApplicable claim: {work_id} {fact_key}")
            try:
                confidence = float(row["confidence"])
            except ValueError as error:
                raise ValidationError(f"invalid confidence: {work_id} {fact_key}") from error
            if not 0 <= confidence <= 1:
                raise ValidationError(f"confidence outside 0..1: {work_id} {fact_key}")
        else:
            raise ValidationError(f"invalid factor state: {work_id} {fact_key}: {state!r}")
        if not row["entryScope"] or not row["observation"] or not row["limitation"] or not row["reasonCode"]:
            raise ValidationError(f"incomplete claim metadata: {work_id} {fact_key}")
        if row["reviewedByHuman"] != "false" or row["candidateOnly"] != "true":
            raise ValidationError(f"review boundary mismatch: {work_id} {fact_key}")
        if row["authorityKind"] != "authorizedEvidencePanelV1" or row["authorityArtifactDigest"] != artifact_digest:
            raise ValidationError(f"authority binding mismatch: {work_id} {fact_key}")
        ids = split_list(row["evidenceIds"], f"{work_id} {fact_key} evidenceIds")
        urls = split_list(row["citationUrls"], f"{work_id} {fact_key} citationUrls")
        if not ids or not urls:
            raise ValidationError(f"claim lacks frozen evidence: {work_id} {fact_key}")
        records = []
        for evidence_id in ids:
            record = frozen_evidence.get(evidence_id)
            if record is None or record[0] != work_id:
                raise ValidationError(f"missing or cross-work evidence: {work_id} {fact_key} {evidence_id}")
            records.append(record)
        if {record[1] for record in records} != set(urls):
            expected_urls = ";".join(sorted({record[1] for record in records}))
            raise ValidationError(
                f"evidence URL set mismatch: {work_id} {fact_key}: "
                f"selected={row['citationUrls']!r} expected={expected_urls!r}"
            )
        if row["citationSetDigest"] != citation_digest(urls):
            raise ValidationError(f"citationSetDigest mismatch: {work_id} {fact_key}")
        preserved_scope = prior_accepted_scopes.get((work_id, fact_key))
        if row["entryScope"] != "entry_1_3_volumes" and row["entryScope"] != preserved_scope and not any(
            row["entryScope"] in frozen_scopes.get(evidence_id, set()) for evidence_id in ids
        ):
            raise ValidationError(
                f"entryScope not bound to selected frozen evidence: {work_id} {fact_key}: "
                f"{row['entryScope']!r}"
            )
        by_key[key] = row

    semantic = (
        "state", "value", "confidence", "evidenceIds", "citationUrls", "entryScope",
        "observation", "limitation", "decision", "reasonCode",
    )
    prior_mismatches: list[str] = []
    for old in prior:
        if old["decision"] != "accepted" or old["factType"] not in {"axis", "genre", "theme"}:
            continue
        new = by_key.get((old["workId"], old["factKey"]))
        changed = semantic if new is None else tuple(field for field in semantic if new[field] != old[field])
        if changed:
            prior_mismatches.append(
                f"{old['workId']} {old['factKey']} fields={','.join(changed)}"
            )
    if prior_mismatches:
        raise ValidationError("accepted prior claim changed: " + "; ".join(prior_mismatches))

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
        if item["genreCount"] < 1:
            codes.append("GENRE_COVERAGE_MISSING")
        if item["themeCount"] < 1:
            codes.append("THEME_COVERAGE_MISSING")
        if item["narrativeKnown"] < 4:
            codes.append("NARRATIVE_COVERAGE_INCOMPLETE")
        if item["toneKnown"] < 5:
            codes.append("TONE_COVERAGE_INCOMPLETE")
        coverage[work_id] = item
        blockers[work_id] = sorted(codes)
    return coverage, blockers


def validate_promotion(result: Path, targets: list[dict[str, str]], contexts: list[dict[str, str]], blockers: dict[str, list[str]]) -> None:
    rows = read_csv(result / "promotion-ledger.csv", PROMOTION_FIELDS)
    target_ids = {row["workId"] for row in targets}
    if len(rows) != len(target_ids) or {row["workId"] for row in rows} != target_ids:
        raise ValidationError(f"promotion target membership mismatch: {result}")
    context_by_work = {row["workId"]: row for row in contexts}
    if len(context_by_work) != len(contexts) or set(context_by_work) != target_ids:
        raise ValidationError(f"frozen context membership mismatch: {result}")
    for row in rows:
        work_id = row["workId"]
        codes = blockers[work_id]
        context = context_by_work[work_id]
        expected = {
            "workId": work_id,
            "adjudicationStatus": "BLOCKED_FACTOR" if codes else "recommendationVerified",
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
            "reasonCode": "FACTOR_COVERAGE_INCOMPLETE" if codes else "COVERAGE_COMPLETE",
        }
        if row != expected:
            raise ValidationError(f"promotion semantics mismatch: {work_id}")


def validate_summary(path: Path, panel_input: dict[str, object], chunk_id: str, input_digest: str, artifact_digest: str, coverage: dict[str, dict[str, int]], blockers: dict[str, list[str]]) -> tuple[int, int]:
    value, _ = read_json(path)
    summary = exact_keys(value, SUMMARY_KEYS, "summary")
    works_value = summary["works"]
    if not isinstance(works_value, list):
        raise ValidationError("summary works must be an array")
    expected_ids = sorted(coverage)
    if [item.get("workId") if isinstance(item, dict) else None for item in works_value] != expected_ids:
        raise ValidationError("summary works must exactly match targets and be sorted")
    pass_count = 0
    for value_item in works_value:
        item = exact_keys(value_item, WORK_SUMMARY_KEYS, "work summary")
        work_id = item["workId"]
        codes = blockers[work_id]
        outcome = "BLOCKED" if codes else "PASS"
        if outcome == "PASS":
            pass_count += 1
        if item["outcome"] != outcome or item["blockerCodes"] != codes:
            raise ValidationError(f"summary outcome mismatch: {work_id}")
        cov = exact_keys(item["coverage"], COVERAGE_KEYS, "coverage")
        if any(exact_int(cov[key], f"{work_id}.{key}") != coverage[work_id][key] for key in COVERAGE_KEYS):
            raise ValidationError(f"summary coverage mismatch: {work_id}")
        if type(item["recommendationEligible"]) is not bool or type(item["libraryOnly"]) is not bool:
            raise ValidationError(f"summary booleans invalid: {work_id}")
        if item["recommendationEligible"] != (not codes) or item["libraryOnly"] != bool(codes):
            raise ValidationError(f"summary eligibility mismatch: {work_id}")
    blocked_count = len(expected_ids) - pass_count
    expected_scalars = {
        "schemaVersion": "authorized-evidence-panel-v1",
        "batchId": panel_input["batchId"],
        "chunkId": chunk_id,
        "inputManifestSha256": input_digest,
        "chunkArtifactDigest": artifact_digest,
        "targetCount": len(expected_ids),
        "passCount": pass_count,
        "blockedCount": blocked_count,
    }
    if any(summary[key] != expected for key, expected in expected_scalars.items()):
        raise ValidationError(f"summary scalar mismatch: chunk-{chunk_id}")
    return pass_count, blocked_count


def validate(input_root: Path, result_root: Path) -> dict[str, int | str]:
    panel_input, chunks, input_digest = validate_input(input_root)
    result_root = result_root.resolve()
    if not result_root.is_dir():
        raise ValidationError(f"result root missing: {result_root}")
    expected_names = {chunk.name for chunk in chunks}
    actual_names = {path.name for path in result_root.iterdir() if path.is_dir()}
    non_dirs = [path.name for path in result_root.iterdir() if not path.is_dir()]
    if actual_names != expected_names or non_dirs:
        raise ValidationError("result chunk membership mismatch")
    totals = {"targetCount": 0, "passCount": 0, "blockedCount": 0}
    for chunk in chunks:
        chunk_id = chunk.name.removeprefix("chunk-")
        result = result_root / chunk.name
        actual_files = {path.name for path in result.iterdir() if path.is_file() and not path.is_symlink()}
        if actual_files != RESULT_FILES or any(path.is_dir() or path.is_symlink() for path in result.iterdir()):
            raise ValidationError(f"result file membership mismatch: {result}")
        copied_input = result / "PANEL-INPUT.sha256"
        if copied_input.read_bytes() != (input_root / "PANEL-INPUT.sha256").read_bytes():
            raise ValidationError(f"copied PANEL-INPUT mismatch: {result}")
        result_members = RESULT_FILES - {"PANEL-RESULT.sha256"}
        verify_manifest(result, result / "PANEL-RESULT.sha256", result_members, require_sorted=False)
        artifact_digest = sha256(chunk / "CHUNK.sha256")
        targets = read_csv(chunk / "targets.csv", TARGET_FIELDS)
        if not targets or len({row["workId"] for row in targets}) != len(targets):
            raise ValidationError(f"invalid target membership: {chunk}")
        contexts = read_csv(chunk / "recommendation-context-condition.csv", CONTEXT_FIELDS)
        coverage, blockers = validate_ledger(chunk, result, targets, artifact_digest)
        validate_promotion(result, targets, contexts, blockers)
        passed, blocked = validate_summary(
            result / "evidence-panel-summary.json", panel_input, chunk_id,
            input_digest, artifact_digest, coverage, blockers,
        )
        totals["targetCount"] += len(targets)
        totals["passCount"] += passed
        totals["blockedCount"] += blocked
    if totals["targetCount"] != panel_input["targetCount"]:
        raise ValidationError("aggregate targetCount mismatch")
    return {
        "schemaVersion": "authorized-evidence-panel-v1-result-validation",
        "chunkCount": len(chunks),
        **totals,
    }


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
