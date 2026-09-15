#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
from datetime import date, datetime
from pathlib import Path
from urllib.parse import urlsplit


TARGET_FIELDS = [
    "ordinal", "sourcePanelBatch", "sourceOrdinal", "sourceOutcome", "workId", "title",
    "identityUrl", "representativeIsbn", "safetyClaimEvidenceId", "currentPacketDigest",
    "candidateOnly", "reviewedByHuman",
]
EVIDENCE_FIELDS = [
    "evidenceId", "workId", "sourceType", "sourceUrl", "classificationKind",
    "audienceClassification", "observation", "limitation", "retrievedAt",
    "candidateOnly", "reviewedByHuman",
]
CLAIM_FIELDS = [
    "workId", "outcome", "factKey", "state", "value", "decision", "reasonCode",
    "evidenceIds", "citationUrls", "observation", "limitation", "candidateOnly",
    "reviewedByHuman",
]
REVIEW_KEYS = {
    "schemaVersion", "chunkId", "targetCount", "safeCount", "blockedSafetyCount",
    "verdict", "reviewMethod", "candidateOnly", "reviewedByHuman", "grokUsed",
    "targetWorkIds", "issues",
}
CHUNK_FILES = {"evidence.csv", "claims.csv", "REVIEW.json", "REPORT.md", "MANIFEST.sha256"}
SOURCE_TYPES = {"publisher", "rakuten", "manual"}
AFFIRMATIVE_KINDS = {
    "official-non-adult-label",
    "licensed-general-audience-label",
    "mainstream-selection-and-manga-category",
}
CLASSIFICATIONS = {
    "official-non-adult-label": "non-adult",
    "licensed-general-audience-label": "non-adult",
    "mainstream-selection-and-manga-category": "non-adult",
    "classification-unresolved": "unknown",
    "adult-or-scope-excluded": "adult",
}
BLOCK_REASONS = {
    "SAFETY_EVIDENCE_INSUFFICIENT",
    "SAFETY_CLASSIFICATION_AMBIGUOUS",
    "SAFETY_ADULT_OR_SCOPE_EXCLUDED",
}
PROHIBITED = re.compile(r"grok|그록", re.IGNORECASE)
NON_EVIDENCE = re.compile(
    r"resolved identity|identity[- ]only|no (?:bibliography|scope|previous) hold|absence[- ]only",
    re.IGNORECASE,
)
WORK_ID = re.compile(r"work-[0-9a-f]{20}\Z")
EVIDENCE_ID = re.compile(r"ev-[A-Za-z0-9._-]+\Z")
CHUNK_ID = re.compile(r"chunk-[0-9]{2}\Z")
EXPECTED_TARGET_COUNT = 177
TARGETS_SHA256 = "c4cba6d84ef889cada3a1e0331863756357f79ee97ab31e3847ba2b12a76ab0e"


class ValidationError(ValueError):
    pass


def fail(message: str) -> None:
    raise ValidationError(message)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_text(path: Path) -> str:
    data = path.read_bytes()
    if data.startswith(b"\xef\xbb\xbf") or b"\r" in data:
        fail(f"file must be UTF-8 without BOM and LF-only: {path}")
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError as error:
        raise ValidationError(f"invalid UTF-8: {path}") from error
    if not text or not text.endswith("\n") or text.endswith("\n\n"):
        fail(f"file must have exactly one final newline: {path}")
    return text


def read_csv(path: Path, fields: list[str]) -> list[dict[str, str]]:
    text = read_text(path)
    reader = csv.DictReader(io.StringIO(text, newline=""))
    if reader.fieldnames != fields:
        fail(f"CSV header mismatch: {path}: {reader.fieldnames!r}")
    rows = list(reader)
    if any(None in row or any(value is None for value in row.values()) for row in rows):
        fail(f"malformed CSV row: {path}")
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=fields, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    if output.getvalue() != text:
        fail(f"CSV is not canonical: {path}")
    return rows


def exact_url(value: str, label: str) -> None:
    if not value or any(character.isspace() for character in value) or any(c in value for c in "`\"'<>"):
        fail(f"invalid exact URL for {label}: {value!r}")
    parsed = urlsplit(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        fail(f"invalid HTTP(S) URL for {label}: {value!r}")


def split_sorted(value: str, label: str, *, allow_empty: bool) -> list[str]:
    if value == "":
        if allow_empty:
            return []
        fail(f"empty {label}")
    items = value.split(";")
    if any(not item or item != item.strip() for item in items):
        fail(f"invalid {label}: {value!r}")
    if items != sorted(set(items)):
        fail(f"{label} must be unique and codepoint-sorted: {value!r}")
    return items


def no_prohibited(value: str, label: str) -> None:
    if PROHIBITED.search(value):
        fail(f"prohibited provider reference in {label}")


def validate_targets(path: Path) -> dict[str, dict[str, str]]:
    if sha256(path) != TARGETS_SHA256:
        fail(f"frozen targets.csv digest mismatch: {path}")
    rows = read_csv(path, TARGET_FIELDS)
    targets: dict[str, dict[str, str]] = {}
    for index, row in enumerate(rows, 1):
        work_id = row["workId"]
        if row["ordinal"] != str(index) or not WORK_ID.fullmatch(work_id) or work_id in targets:
            fail(f"invalid or duplicate target at ordinal {index}: {work_id}")
        if row["sourceOutcome"] != "PASS" or row["candidateOnly"] != "true" or row["reviewedByHuman"] != "false":
            fail(f"target boundary mismatch: {work_id}")
        no_prohibited("\n".join(row.values()), f"target {work_id}")
        exact_url(row["identityUrl"], f"target {work_id}")
        if not re.fullmatch(r"[0-9a-f]{64}", row["currentPacketDigest"]):
            fail(f"invalid packet digest: {work_id}")
        targets[work_id] = row
    if len(targets) != EXPECTED_TARGET_COUNT:
        fail(f"targets.csv must contain exactly {EXPECTED_TARGET_COUNT} rows")
    return targets


def assignment_ids(path: Path, targets: dict[str, dict[str, str]]) -> list[str]:
    rows = read_csv(path, TARGET_FIELDS)
    ids: list[str] = []
    for row in rows:
        work_id = row["workId"]
        if work_id not in targets or row != targets[work_id]:
            fail(f"chunk assignment does not match frozen target: {path}: {work_id}")
        ids.append(work_id)
    if ids != sorted(ids):
        fail(f"chunk assignment must be codepoint-sorted by workId: {path}")
    return ids


def validate_manifest(chunk: Path) -> None:
    expected = sorted(CHUNK_FILES - {"MANIFEST.sha256"})
    lines = read_text(chunk / "MANIFEST.sha256").splitlines()
    actual: list[str] = []
    for line in lines:
        match = re.fullmatch(r"([0-9a-f]{64})  ([^/\\]+)", line)
        if not match:
            fail(f"invalid manifest line: {chunk}: {line!r}")
        digest, name = match.groups()
        actual.append(name)
        if digest != sha256(chunk / name):
            fail(f"manifest hash mismatch: {chunk / name}")
    if actual != expected:
        fail(f"manifest entries must be exact and codepoint-sorted: {chunk}: {actual!r}")


def validate_evidence(rows: list[dict[str, str]], chunk: Path, targets: set[str]) -> dict[str, dict[str, str]]:
    result: dict[str, dict[str, str]] = {}
    order: list[tuple[str, str]] = []
    for row in rows:
        evidence_id, work_id = row["evidenceId"], row["workId"]
        if not EVIDENCE_ID.fullmatch(evidence_id) or evidence_id in result:
            fail(f"invalid or duplicate evidence ID: {chunk}: {evidence_id}")
        if work_id not in targets or row["sourceType"] not in SOURCE_TYPES:
            fail(f"evidence boundary/sourceType mismatch: {chunk}: {evidence_id}")
        exact_url(row["sourceUrl"], f"evidence {evidence_id}")
        kind = row["classificationKind"]
        if kind not in CLASSIFICATIONS or row["audienceClassification"] != CLASSIFICATIONS[kind]:
            fail(f"classification mismatch: {chunk}: {evidence_id}")
        if not row["observation"] or not row["limitation"] or NON_EVIDENCE.search(row["observation"]):
            fail(f"missing or identity/hold-only observation: {chunk}: {evidence_id}")
        if kind in {"official-non-adult-label", "licensed-general-audience-label"} and not re.search(r"(?:^|;\s*)label=\S", row["observation"]):
            fail(f"affirmative label observation missing: {chunk}: {evidence_id}")
        if kind == "mainstream-selection-and-manga-category" and not (
            re.search(r"(?:^|;\s*)selection=\S", row["observation"])
            and re.search(r"(?:^|;\s*)mangaCategory=\S", row["observation"])
        ):
            fail(f"mainstream selection/category observation missing: {chunk}: {evidence_id}")
        if row["candidateOnly"] != "true" or row["reviewedByHuman"] != "false":
            fail(f"evidence review boundary mismatch: {chunk}: {evidence_id}")
        try:
            datetime.fromisoformat(row["retrievedAt"]) if "T" in row["retrievedAt"] else date.fromisoformat(row["retrievedAt"])
        except ValueError as error:
            raise ValidationError(f"invalid retrievedAt: {chunk}: {evidence_id}") from error
        no_prohibited("\n".join(row.values()), f"evidence {evidence_id}")
        order.append((work_id, evidence_id))
        result[evidence_id] = row
    if order != sorted(order):
        fail(f"evidence rows must be codepoint-sorted by workId,evidenceId: {chunk}")
    return result


def validate_claims(
    rows: list[dict[str, str]],
    evidence: dict[str, dict[str, str]],
    chunk: Path,
    targets: set[str],
) -> dict[str, dict[str, str]]:
    claims: dict[str, dict[str, str]] = {}
    for row in rows:
        work_id = row["workId"]
        if work_id not in targets or work_id in claims:
            fail(f"unknown or duplicate claim target: {chunk}: {work_id}")
        if row["factKey"] != "scope:safety" or not row["observation"] or not row["limitation"]:
            fail(f"invalid safety claim metadata: {chunk}: {work_id}")
        if row["candidateOnly"] != "true" or row["reviewedByHuman"] != "false":
            fail(f"claim review boundary mismatch: {chunk}: {work_id}")
        no_prohibited("\n".join(row.values()), f"claim {work_id}")
        ids = split_sorted(row["evidenceIds"], f"evidenceIds for {work_id}", allow_empty=row["outcome"] == "BLOCKED_SAFETY")
        urls = split_sorted(row["citationUrls"], f"citationUrls for {work_id}", allow_empty=row["outcome"] == "BLOCKED_SAFETY")
        try:
            selected = [evidence[evidence_id] for evidence_id in ids]
        except KeyError as error:
            raise ValidationError(f"claim references unknown evidence: {chunk}: {work_id}: {error.args[0]}") from error
        if any(item["workId"] != work_id for item in selected):
            fail(f"claim references cross-work evidence: {chunk}: {work_id}")
        if urls != sorted({item["sourceUrl"] for item in selected}):
            fail(f"claim/evidence URL mismatch: {chunk}: {work_id}")
        if row["outcome"] == "SAFE":
            expected = ("known", "in-scope-japanese-manga", "accepted", "SAFETY_VERIFIED")
            actual = (row["state"], row["value"], row["decision"], row["reasonCode"])
            if actual != expected or not selected or any(item["classificationKind"] not in AFFIRMATIVE_KINDS for item in selected):
                fail(f"SAFE contract mismatch: {chunk}: {work_id}")
        elif row["outcome"] == "BLOCKED_SAFETY":
            if (row["state"], row["value"], row["decision"]) != ("unknown", "", "blocked") or row["reasonCode"] not in BLOCK_REASONS:
                fail(f"BLOCKED_SAFETY contract mismatch: {chunk}: {work_id}")
        else:
            fail(f"invalid safety outcome: {chunk}: {work_id}: {row['outcome']}")
        claims[work_id] = row
    if list(claims) != sorted(claims):
        fail(f"claim rows must be codepoint-sorted by workId: {chunk}")
    if set(evidence) != {item for row in rows for item in split_sorted(row["evidenceIds"], "evidenceIds", allow_empty=True)}:
        fail(f"unreferenced evidence row: {chunk}")
    return claims


def validate_review(path: Path, chunk_id: str, claims: dict[str, dict[str, str]]) -> None:
    text = read_text(path)
    try:
        value = json.loads(text)
    except json.JSONDecodeError as error:
        raise ValidationError(f"invalid REVIEW.json: {path}") from error
    if not isinstance(value, dict) or set(value) != REVIEW_KEYS:
        fail(f"REVIEW.json keys mismatch: {path}")
    canonical = json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if text != canonical:
        fail(f"REVIEW.json is not canonical: {path}")
    ids = sorted(claims)
    safe = sum(row["outcome"] == "SAFE" for row in claims.values())
    expected = {
        "schemaVersion": "safety-recheck-v1-review",
        "chunkId": chunk_id,
        "targetCount": len(ids),
        "safeCount": safe,
        "blockedSafetyCount": len(ids) - safe,
        "verdict": "PASS",
        "reviewMethod": "authorizedEvidencePanel",
        "candidateOnly": True,
        "reviewedByHuman": False,
        "grokUsed": False,
        "targetWorkIds": ids,
        "issues": [],
    }
    if value != expected:
        fail(f"REVIEW.json content mismatch: {path}")


def validate(root: Path) -> dict[str, int | str]:
    root = root.resolve()
    targets = validate_targets(root / "targets.csv")
    chunks_root = root / "chunks"
    result_chunks = sorted(path for path in chunks_root.iterdir() if path.is_dir()) if chunks_root.is_dir() else []
    assignment_files = sorted(path for path in chunks_root.glob("chunk-??.csv")) if chunks_root.is_dir() else []
    assignment_names = {path.stem for path in assignment_files}
    if not assignment_names or any(not CHUNK_ID.fullmatch(name) for name in assignment_names):
        fail("frozen chunk-NN.csv assignments are missing")
    if {path.name for path in result_chunks} != assignment_names:
        fail(f"result chunk directories must exactly match assignments: expected={sorted(assignment_names)!r}")
    assignments = {path.stem: assignment_ids(path, targets) for path in assignment_files}
    assigned = [work_id for name in sorted(assignments) for work_id in assignments[name]]
    if len(assigned) != len(set(assigned)) or set(assigned) != set(targets):
        fail("frozen chunk assignments do not partition targets exactly once")
    all_claims: dict[str, str] = {}
    all_evidence_ids: set[str] = set()
    safe_count = 0
    for chunk in result_chunks:
        entries = {path.name for path in chunk.iterdir()}
        if entries != CHUNK_FILES or any(not path.is_file() for path in chunk.iterdir()):
            fail(f"chunk files must be exact: {chunk}: {sorted(entries)!r}")
        validate_manifest(chunk)
        evidence = validate_evidence(read_csv(chunk / "evidence.csv", EVIDENCE_FIELDS), chunk, set(targets))
        duplicate_evidence = all_evidence_ids & set(evidence)
        if duplicate_evidence:
            fail(f"evidence IDs reused across chunks: {sorted(duplicate_evidence)!r}")
        all_evidence_ids.update(evidence)
        claims = validate_claims(read_csv(chunk / "claims.csv", CLAIM_FIELDS), evidence, chunk, set(targets))
        if sorted(claims) != assignments[chunk.name]:
            fail(f"claim membership does not match frozen assignment: {chunk}")
        duplicate_claims = set(all_claims) & set(claims)
        if duplicate_claims:
            fail(f"targets repeated across chunks: {sorted(duplicate_claims)!r}")
        all_claims.update({work_id: chunk.name for work_id in claims})
        safe_count += sum(row["outcome"] == "SAFE" for row in claims.values())
        report = read_text(chunk / "REPORT.md")
        no_prohibited(report, f"REPORT.md in {chunk.name}")
        validate_review(chunk / "REVIEW.json", chunk.name, claims)
    if set(all_claims) != set(targets):
        missing = sorted(set(targets) - set(all_claims))
        extra = sorted(set(all_claims) - set(targets))
        fail(f"target membership mismatch: missing={missing[:5]!r} extra={extra[:5]!r}")
    return {
        "schemaVersion": "safety-recheck-v1-validation",
        "chunkCount": len(result_chunks),
        "targetCount": len(targets),
        "safeCount": safe_count,
        "blockedSafetyCount": len(targets) - safe_count,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    args = parser.parse_args()
    try:
        print(json.dumps(validate(args.root), ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    except (OSError, ValidationError) as error:
        print(f"FAIL: {error}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
