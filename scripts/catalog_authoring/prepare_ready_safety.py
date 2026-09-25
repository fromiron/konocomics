#!/usr/bin/env python3
"""Prepare deterministic safety-review child manifests from a panel result.

This is a read-only planning step.  It never opens SQLite and never writes a
publication artifact.  Existing safety is reused only when the frozen target
binding and the complete SAFE claim contract match exactly.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path
from urllib.parse import urlsplit


TARGET_FIELDS = (
    "batchId", "ordinal", "workId", "title", "narrativeKnown", "toneKnown",
    "genreKnown", "themeKnown", "missingRequiredClaims", "priorPanelBatch",
    "priorPanelOrdinal", "representativeIsbn", "packetPath", "packetDigest",
)
PROMOTION_FIELDS = (
    "workId", "adjudicationStatus", "panelOutcome", "panelBlockerCode",
    "recommendationEligible", "libraryOnly", "annotationReviewMethod",
    "reviewedByHuman", "candidateOnly", "recommendationContextCondition",
    "contextEvidenceIds", "contextCitationUrls", "reasonCode",
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
CHILD_FIELDS = (
    "ordinal", "workId", "title", "representativeIsbn", "currentPacketDigest",
    "panelBatch", "panelOrdinal", "safetyStatus", "safetyClaimEvidenceIds",
    "missingSafetyClaims", "missingSafetyReason", "candidateOnly", "reviewedByHuman",
)
MISSING_FIELDS = (
    "ordinal", "workId", "title", "representativeIsbn", "currentPacketDigest",
    "panelBatch", "panelOrdinal", "missingSafetyClaims", "missingSafetyReason",
    "candidateOnly", "reviewedByHuman",
)
AFFIRMATIVE_KINDS = {
    "non-pornographic-work",
    "official-non-adult-label", "licensed-general-audience-label",
    "mainstream-selection-and-manga-category",
}
SOURCE_TYPES = {"publisher", "rakuten", "manual"}
DENY_RE = re.compile(r"grok|그록|anilist\.co|paid|유료", re.IGNORECASE)


class ReadyError(ValueError):
    pass


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_csv(path: Path, fields: tuple[str, ...] | None = None) -> list[dict[str, str]]:
    try:
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle, strict=True)
            if fields is not None and tuple(reader.fieldnames or ()) != fields:
                raise ReadyError(f"invalid CSV header: {path}")
            rows = list(reader)
    except (OSError, UnicodeError, csv.Error) as error:
        raise ReadyError(f"invalid CSV {path}: {error}") from error
    if any(None in row or any(value is None for value in row.values()) for row in rows):
        raise ReadyError(f"malformed CSV row: {path}")
    return rows


def write_csv(path: Path, fields: tuple[str, ...], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8", newline="\n")


def manifest(root: Path, name: str = "MANIFEST.sha256") -> None:
    target = root / name
    members = sorted(
        (path for path in root.rglob("*") if path.is_file() and path != target and not path.is_symlink()),
        key=lambda path: path.relative_to(root).as_posix(),
    )
    target.write_text("".join(f"{sha256(path)}  {path.relative_to(root).as_posix()}\n" for path in members), encoding="ascii", newline="\n")


def _panel_rows(panel_root: Path) -> list[dict[str, str]]:
    paths = sorted(panel_root.rglob("promotion-ledger.csv"))
    if not paths:
        raise ReadyError(f"promotion-ledger.csv not found: {panel_root}")
    rows: list[dict[str, str]] = []
    seen: set[str] = set()
    for path in paths:
        for row in read_csv(path):
            if set(row) != set(PROMOTION_FIELDS):
                raise ReadyError(f"invalid promotion header: {path}")
            if row["workId"] in seen:
                raise ReadyError(f"duplicate panel work: {row['workId']}")
            seen.add(row["workId"])
            if row["panelOutcome"] == "PASS":
                if row["annotationReviewMethod"] != "authorizedEvidencePanel" or row["candidateOnly"] != "true" or row["reviewedByHuman"] != "false":
                    raise ReadyError(f"panel boundary mismatch: {row['workId']}")
                rows.append(row)
    return rows


def _target_rows(roots: list[Path], panel_root: Path) -> dict[str, dict[str, str]]:
    candidates = list(roots)
    sibling = panel_root.parent / "panel-input"
    if sibling.is_dir() and sibling not in candidates:
        candidates.append(sibling)
    result: dict[str, dict[str, str]] = {}
    for root in candidates:
        paths = sorted(root.rglob("targets.csv"))
        for path in paths:
            rows = read_csv(path)
            if rows and tuple(rows[0]) == TARGET_FIELDS:
                for row in rows:
                    if row["workId"] in result and result[row["workId"]] != row:
                        raise ReadyError(f"conflicting frozen target: {row['workId']}")
                    result[row["workId"]] = row
    # Batch-010/011 frozen-work-set.csv has identity metadata but not packet digests.
    for root in candidates:
        for path in sorted(root.rglob("frozen-work-set.csv")):
            for row in read_csv(path):
                if set(row) >= {"workId", "canonicalTitle"}:
                    result.setdefault(row["workId"], {
                        "batchId": path.parent.name.removeprefix("batch-"), "ordinal": row.get("position", ""),
                        "workId": row["workId"], "title": row["canonicalTitle"],
                        "representativeIsbn": "", "packetDigest": "",
                    })
    return result


def _safety_records(roots: list[Path]) -> dict[str, tuple[dict[str, str], dict[str, str], dict[str, str]]]:
    records: dict[str, tuple[dict[str, str], dict[str, str], dict[str, str]]] = {}
    loaded: dict[Path, tuple[dict[str, list[dict[str, str]]], dict[str, dict[str, dict[str, str]]]]] = {}
    for root in roots:
        for target_path in sorted(root.rglob("targets.csv")):
            try:
                targets = read_csv(target_path, SAFETY_TARGET_FIELDS)
            except ReadyError:
                continue
            for target in targets:
                work_id = target["workId"]
                base = target_path.parent
                safety_root = next((ancestor for ancestor in (base, *base.parents) if (ancestor / "chunks").is_dir()), root)
                if safety_root not in loaded:
                    claims_by_work: dict[str, list[dict[str, str]]] = {}
                    evidence_by_work: dict[str, dict[str, dict[str, str]]] = {}
                    for chunk in sorted(safety_root.glob("chunks/chunk-??")):
                        for claim in read_csv(chunk / "claims.csv", SAFETY_CLAIM_FIELDS):
                            claims_by_work.setdefault(claim["workId"], []).append(claim)
                        for evidence in read_csv(chunk / "evidence.csv", SAFETY_EVIDENCE_FIELDS):
                            evidence_by_work.setdefault(evidence["workId"], {})[evidence["evidenceId"]] = evidence
                    loaded[safety_root] = (claims_by_work, evidence_by_work)
                claims_by_work, evidence_by_work = loaded[safety_root]
                for claim in claims_by_work.get(work_id, []):
                    evidence = evidence_by_work.get(work_id, {})
                    if _qualifies(target, claim, evidence):
                        if work_id in records and records[work_id][0] != target:
                            raise ReadyError(f"conflicting safety target: {work_id}")
                        records[work_id] = (target, claim, evidence)
    return records


def _qualifies(target: dict[str, str], claim: dict[str, str], evidence: dict[str, dict[str, str]]) -> bool:
    if (claim["outcome"], claim["factKey"], claim["state"], claim["value"], claim["decision"], claim["reasonCode"]) != ("SAFE", "scope:safety", "known", "in-scope-japanese-manga", "accepted", "SAFETY_VERIFIED"):
        return False
    if claim["candidateOnly"] != "true" or claim["reviewedByHuman"] != "false" or not claim["evidenceIds"]:
        return False
    ids = claim["evidenceIds"].split(";")
    urls = claim["citationUrls"].split(";")
    if ids != sorted(set(ids)) or urls != sorted(set(urls)) or any(item not in evidence for item in ids):
        return False
    selected = [evidence[item] for item in ids]
    return all(
        row["workId"] == target["workId"] and row["sourceType"] in SOURCE_TYPES
        and row["classificationKind"] in AFFIRMATIVE_KINDS
        and row["audienceClassification"] == ("non-porn" if row["classificationKind"] == "non-pornographic-work" else "non-adult")
        and row["candidateOnly"] == "true" and row["reviewedByHuman"] == "false"
        and not DENY_RE.search(" ".join(row.values()))
        and row["sourceUrl"] in urls
        and urlsplit(row["sourceUrl"]).scheme in {"http", "https"}
        for row in selected
    )


def prepare(panel_root: Path, frozen_roots: list[Path], safety_roots: list[Path], output_root: Path, chunk_size: int = 50) -> dict[str, object]:
    if not 25 <= chunk_size <= 50:
        raise ReadyError("chunk-size must be between 25 and 50")
    panel_root, output_root = panel_root.resolve(), output_root.resolve()
    if output_root.exists():
        raise ReadyError(f"output exists; refusing overwrite: {output_root}")
    panel = _panel_rows(panel_root)
    targets = _target_rows([path.resolve() for path in frozen_roots], panel_root)
    safety = _safety_records([path.resolve() for path in safety_roots])
    records: list[dict[str, str]] = []
    missing: list[dict[str, str]] = []
    reused = 0
    for ordinal, row in enumerate(sorted(panel, key=lambda item: item["workId"]), 1):
        target = targets.get(row["workId"], {})
        title = target.get("title", "")
        isbn = target.get("representativeIsbn", "")
        digest = target.get("packetDigest", "")
        source = safety.get(row["workId"])
        bound = bool(source and title and isbn and digest and source[0]["title"] == title and source[0]["representativeIsbn"] == isbn and source[0]["currentPacketDigest"] == digest)
        status = "REUSED" if bound else "MISSING"
        claim_ids = ";".join(sorted(source[1]["evidenceIds"].split(";"))) if bound and source else ""
        reason = "" if bound else ("MISSING_FROZEN_TARGET_BINDING" if not target or not isbn or not digest else "SAFETY_CLAIM_NOT_QUALIFYING_OR_STALE")
        child = {
            "ordinal": str(ordinal), "workId": row["workId"], "title": title, "representativeIsbn": isbn,
            "currentPacketDigest": digest, "panelBatch": target.get("batchId", ""), "panelOrdinal": target.get("ordinal", ""),
            "safetyStatus": status, "safetyClaimEvidenceIds": claim_ids,
            "missingSafetyClaims": "" if bound else "scope:safety", "missingSafetyReason": reason,
            "candidateOnly": "true", "reviewedByHuman": "false",
        }
        records.append(child)
        if bound:
            reused += 1
        else:
            missing.append({key: child[key] for key in MISSING_FIELDS})

    output_root.mkdir(parents=True)
    write_csv(output_root / "reused-safety-evidence.csv", CHILD_FIELDS, [row for row in records if row["safetyStatus"] == "REUSED"])
    write_csv(output_root / "missing-safety-claims.csv", MISSING_FIELDS, missing)
    children: list[str] = []
    for index, start in enumerate(range(0, len(records), chunk_size), 1):
        child_root = output_root / "children" / f"child-{index:02d}"
        rows = records[start:start + chunk_size]
        write_csv(child_root / "targets.csv", CHILD_FIELDS, rows)
        write_json(child_root / "READY.json", {
            "schemaVersion": "safety-ready-child-v1", "childId": f"child-{index:02d}",
            "targetCount": len(rows), "reusedSafetyCount": sum(row["safetyStatus"] == "REUSED" for row in rows),
            "missingSafetyCount": sum(row["safetyStatus"] == "MISSING" for row in rows),
            "candidateOnly": True, "reviewedByHuman": False,
            "grokExcluded": True, "paidSourcesExcluded": True, "aniListAuthorizingEvidence": False,
            "workIds": [row["workId"] for row in rows],
        })
        manifest(child_root)
        children.append(f"children/child-{index:02d}")
    report = {
        "schemaVersion": "safety-ready-v1", "panelPassCount": len(records), "reusedSafetyCount": reused,
        "missingSafetyCount": len(missing), "chunkSize": chunk_size, "children": children,
        "candidateOnly": True, "reviewedByHuman": False, "grokExcluded": True,
        "paidSourcesExcluded": True, "aniListAuthorizingEvidence": False,
        "workIds": [row["workId"] for row in records],
    }
    write_json(output_root / "READY.json", report)
    manifest(output_root)
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--panel-result", "--panel-result-root", "--panel-output-root", dest="panel_result", type=Path, required=True)
    parser.add_argument("--frozen-root", "--frozen-input-root", dest="frozen_root", type=Path, action="append", default=[])
    parser.add_argument("--safety-root", "--existing-safety-root", dest="safety_root", type=Path, action="append", default=[])
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument("--chunk-size", type=int, default=50)
    args = parser.parse_args(argv)
    try:
        result = prepare(args.panel_result, args.frozen_root, args.safety_root, args.output_root, args.chunk_size)
    except (OSError, ReadyError, ValueError) as error:
        print(json.dumps({"status": "BLOCKED", "error": str(error)}, ensure_ascii=False, separators=(",", ":")))
        return 1
    print(json.dumps({"status": "READY", **result}, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
