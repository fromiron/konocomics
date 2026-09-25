#!/usr/bin/env python3
"""Copy-on-write publisher for an authorized Batch001 evidence-panel result.

The panel validator is the authority boundary.  This publisher only consumes
its verified ledger, preserves the complete panel artifacts beside the output,
and writes accepted values into the existing nine-table SQLite source schema.
No model-agreement or candidate field is consulted for authority, and the
tracked ``data/source/catalog.sqlite`` is never an output target.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import shutil
import sqlite3
import sys
from datetime import datetime
from pathlib import Path
from typing import Iterable
from urllib.parse import urlsplit

try:  # Running directly from the tools directory.
    import validate_panel_results as panel
except ImportError:  # pragma: no cover - package-style import fallback.
    from . import validate_panel_results as panel


SOURCE_TABLES = {
    "source_aliases",
    "source_art_evidence_manifest",
    "source_evidence",
    "source_factors",
    "source_recommendation_config",
    "source_recommendation_context",
    "source_themes",
    "source_volumes",
    "source_works",
}
SIDE_SUFFIXES = ("-wal", "-shm", "-journal")
REVIEW_REFERENCE_RE = re.compile(r"^reviews/[a-z0-9]+(?:-[a-z0-9]+)*\.md$")
CATALOG_ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
NARRATIVE = set(panel.AXES[:6])
TONE = set(panel.AXES[6:13])
AUTHORITY_KIND = "authorizedEvidencePanelV1"

# The S6 authority contract deliberately has no candidate, resolution, or
# judgement tables.  Keep the canonical DDL here so a publisher cannot silently
# accept a superficially similar database with a missing STRICT/CHECK/PK
# boundary.  Whitespace is normalised before comparison, but the lexical table
# definition (including column order, types, PK and checks) is otherwise exact.
EXPECTED_DDL = {
    "source_works": '''CREATE TABLE source_works (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "titleKana" TEXT NOT NULL,
  "creators" TEXT NOT NULL,
  "publisher" TEXT NOT NULL,
  "demographic" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "firstPublishedYear" TEXT NOT NULL,
  "genres" TEXT NOT NULL,
  "factorScope" TEXT NOT NULL,
  "onboardingEligible" TEXT NOT NULL,
  "recommendationEligible" TEXT NOT NULL,
  "libraryOnly" TEXT NOT NULL,
  "metadataConfidence" TEXT NOT NULL,
  "groupingConfidence" TEXT NOT NULL,
  "sourceAgreement" TEXT NOT NULL,
  "annotationReviewMethod" TEXT NOT NULL,
  "annotationReviewedAt" TEXT NOT NULL,
  "annotationReviewReference" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL
) STRICT''',
    "source_aliases": '''CREATE TABLE source_aliases (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "alias" TEXT NOT NULL
) STRICT''',
    "source_volumes": '''CREATE TABLE source_volumes (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "id" TEXT NOT NULL,
  "workId" TEXT NOT NULL,
  "volumeNumber" TEXT NOT NULL,
  "isbn" TEXT NOT NULL,
  "releaseDate" TEXT NOT NULL,
  "editionKind" TEXT NOT NULL,
  "isRepresentative" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL
) STRICT''',
    "source_factors": '''CREATE TABLE source_factors (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "axisId" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL
) STRICT''',
    "source_themes": '''CREATE TABLE source_themes (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "themeId" TEXT NOT NULL,
  "centrality" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "evidenceId" TEXT NOT NULL
) STRICT''',
    "source_recommendation_context": '''CREATE TABLE source_recommendation_context (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "catalogRole" TEXT NOT NULL,
  "seriesGroupId" TEXT NOT NULL,
  "volumeCount" TEXT NOT NULL,
  "reviewAverage" TEXT NOT NULL,
  "reviewCount" TEXT NOT NULL
) STRICT''',
    "source_recommendation_config": '''CREATE TABLE source_recommendation_config (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "catalogAverageRating" TEXT NOT NULL
) STRICT''',
    "source_evidence": '''CREATE TABLE source_evidence (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "id" TEXT NOT NULL,
  "workId" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "fetchedAt" TEXT NOT NULL,
  "extractorVersion" TEXT NOT NULL,
  "reviewedByHuman" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "notes" TEXT NOT NULL
) STRICT''',
    "source_art_evidence_manifest": '''CREATE TABLE source_art_evidence_manifest (
  "sourceOrdinal" INTEGER PRIMARY KEY CHECK ("sourceOrdinal" >= 1),
  "sourceLine" INTEGER NOT NULL CHECK ("sourceLine" >= 2),
  "workId" TEXT NOT NULL,
  "axisId" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "confidence" TEXT NOT NULL,
  "authorityClass" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "edition" TEXT NOT NULL,
  "scopeMapping" TEXT NOT NULL,
  "pageOrTimeRefs" TEXT NOT NULL,
  "sampleCount" TEXT NOT NULL,
  "contexts" TEXT NOT NULL,
  "observation" TEXT NOT NULL,
  "limitation" TEXT NOT NULL,
  "reviewStatus" TEXT NOT NULL
) STRICT''',
}
EXPECTED_DDL_RAW = dict(EXPECTED_DDL)
EXPECTED_DDL = {name: re.sub(r"\s+", " ", sql).strip().rstrip(";").lower() for name, sql in EXPECTED_DDL.items()}
GOLD_MANIFEST_RELATIVE = Path("data") / "staging" / "catalog-expansion" / "gold-set-manifest.json"
ALIAS_RESOLUTION_RELATIVE = Path("overlay") / "data" / "staging" / "catalog-expansion" / "v4-final" / "alias-resolution.csv"
REVIEW_V5_REFERENCE = "reviews/authorized-evidence-panel-v5-batch-001.md"


class PublishError(ValueError):
    """A fail-closed input, contract, or publication error."""


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def sidecars(path: Path) -> list[Path]:
    return [Path(f"{path}{suffix}") for suffix in SIDE_SUFFIXES if Path(f"{path}{suffix}").exists()]


def _db_uri(path: Path) -> str:
    return f"file:{path.resolve().as_posix()}?mode=ro"


def _table_names(con: sqlite3.Connection) -> set[str]:
    return {
        row[0]
        for row in con.execute(
            "select name from sqlite_master where type in ('table','view','trigger')"
        )
    }


def _columns(con: sqlite3.Connection, table: str) -> set[str]:
    return {row[1] for row in con.execute(f'pragma table_info("{table}")')}


def _normalise_sql(sql: str) -> str:
    """Normalise only insignificant DDL whitespace for exact comparison."""

    return re.sub(r"\s+", " ", sql).strip().rstrip(";").lower()


def _find_repo_file(relative: Path) -> Path | None:
    roots = [Path.cwd(), Path(__file__).resolve()]
    roots.extend(Path.cwd().parents)
    roots.extend(Path(__file__).resolve().parents)
    seen: set[Path] = set()
    for root in roots:
        root = root if root.is_dir() else root.parent
        if root in seen:
            continue
        seen.add(root)
        candidate = (root / relative).resolve()
        if candidate.is_file() and not candidate.is_symlink():
            return candidate
    return None


def _find_repo_gold_manifest() -> Path | None:
    return _find_repo_file(GOLD_MANIFEST_RELATIVE)


def _load_gold_ids(path: Path | None) -> set[str]:
    """Load and self-check the frozen Gold150 manifest when available."""

    if path is None:
        path = _find_repo_gold_manifest()
    if path is None:
        raise PublishError("Gold Set manifest is required to prove Gold150 preservation")
    path = path.resolve()
    if not path.is_file() or path.is_symlink():
        raise PublishError(f"Gold Set manifest is not a regular file: {path}")
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise PublishError(f"invalid Gold Set manifest: {path}: {error}") from error
    if not isinstance(value, dict):
        raise PublishError("Gold Set manifest must be an object")
    ids = value.get("workIds")
    if (
        value.get("schemaVersion") != 1
        or value.get("workCount") != 150
        or not isinstance(ids, list)
        or len(ids) != 150
        or any(not isinstance(item, str) or not CATALOG_ID_RE.fullmatch(item) for item in ids)
        or len(set(ids)) != 150
    ):
        raise PublishError("Gold Set manifest does not describe exactly 150 unique catalog IDs")
    canonical = sorted(ids)
    if ids != canonical:
        raise PublishError("Gold Set workIds must be codepoint-sorted")
    expected_digest = sha256_bytes(("\n".join(ids) + "\n").encode("utf-8"))
    if value.get("workIdsSha256") != expected_digest:
        raise PublishError("Gold Set workIdsSha256 mismatch")
    return set(ids)


def _load_gold_manifest(path: Path | None) -> dict[str, object]:
    """Read the already validated Gold manifest for dataset-level audits."""

    if path is None:
        path = _find_repo_gold_manifest()
    if path is None:
        raise PublishError("Gold Set manifest is required for alias audit")
    try:
        value = json.loads(path.resolve().read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise PublishError(f"invalid Gold Set manifest: {path}: {error}") from error
    if not isinstance(value, dict) or not isinstance(value.get("datasets"), dict):
        raise PublishError("Gold Set manifest lacks datasets for alias audit")
    return value


def _manifest_entries(root: Path, manifest: Path) -> dict[str, str]:
    """Strictly verify a deterministic SHA-256 manifest after writing it."""

    try:
        raw = manifest.read_bytes()
        text = raw.decode("ascii")
    except (OSError, UnicodeError) as error:
        raise PublishError(f"invalid publisher manifest: {manifest}: {error}") from error
    if not raw or b"\r" in raw or not raw.endswith(b"\n") or raw.endswith(b"\n\n"):
        raise PublishError(f"publisher manifest is not canonical LF bytes: {manifest}")
    entries: dict[str, str] = {}
    for number, line in enumerate(text.splitlines(), 1):
        match = re.fullmatch(r"([0-9a-f]{64})  ([^\r\n]+)", line)
        if match is None:
            raise PublishError(f"invalid publisher manifest row {manifest}:{number}")
        digest, relative = match.groups()
        pure = Path(relative)
        if pure.is_absolute() or "\\" in relative or any(part in {"", ".", ".."} for part in pure.parts):
            raise PublishError(f"unsafe publisher manifest path: {relative!r}")
        path = root.joinpath(*pure.parts)
        if not path.is_file() or path.is_symlink() or relative in entries:
            raise PublishError(f"missing/duplicate publisher manifest member: {relative}")
        if sha256(path) != digest:
            raise PublishError(f"publisher manifest digest mismatch: {relative}")
        entries[relative] = digest
    if list(entries) != sorted(entries):
        raise PublishError("publisher manifest paths are not POSIX-sorted")
    expected = {
        path.relative_to(root).as_posix()
        for path in root.rglob("*")
        if path.is_file() and not path.is_symlink() and path != manifest
    }
    if set(entries) != expected:
        raise PublishError("publisher manifest membership mismatch")
    return entries


def _read_csv(path: Path, fields: tuple[str, ...]) -> list[dict[str, str]]:
    try:
        return panel.read_csv(path, fields)
    except (OSError, UnicodeError, csv.Error, panel.ValidationError) as error:
        raise PublishError(f"invalid CSV {path}: {error}") from error


def _validate_schema(con: sqlite3.Connection, label: str) -> None:
    version = con.execute("pragma user_version").fetchone()[0]
    if version not in (1, 2):
        raise PublishError(f"{label} SQLite user_version must be 1 or 2")
    expected_ddl = dict(EXPECTED_DDL)
    expected_tables = set(SOURCE_TABLES)
    if version == 2:
        migration = _find_repo_file(Path("scripts/sql/catalog-authority/002-book-metadata.sql"))
        if migration is None:
            raise PublishError("book metadata migration is missing")
        ddl = migration.read_text(encoding="utf-8").split("CREATE TABLE", 1)[1]
        expected_ddl["source_book_metadata"] = _normalise_sql("CREATE TABLE" + ddl)
        expected_tables.add("source_book_metadata")
    object_rows = con.execute(
        "select type,name,sql from sqlite_master order by type,name"
    ).fetchall()
    table_rows = [(name, sql) for kind, name, sql in object_rows if kind == "table"]
    actual_tables = {name for name, _sql in table_rows}
    if actual_tables != expected_tables or len(table_rows) != len(expected_tables):
        raise PublishError(
            f"{label} schema/table set mismatch: expected={sorted(expected_tables)}, "
            f"actual={sorted(actual_tables)}"
        )
    extras = [
        (kind, name)
        for kind, name, _sql in object_rows
        if kind != "table"
    ]
    if extras:
        raise PublishError(f"{label} has non-table SQLite objects: {extras}")
    for name, sql in table_rows:
        if sql is None or _normalise_sql(sql) != expected_ddl[name]:
            raise PublishError(f"{label} DDL mismatch: {name}")
        if " without rowid" in _normalise_sql(sql):
            raise PublishError(f"{label} table must remain a rowid table: {name}")


def _find_repo_catalog() -> Path | None:
    roots = [Path.cwd(), Path(__file__).resolve()]
    roots.extend(Path.cwd().parents)
    roots.extend(Path(__file__).resolve().parents)
    seen: set[Path] = set()
    for root in roots:
        root = root if root.is_dir() else root.parent
        if root in seen:
            continue
        seen.add(root)
        candidate = root / "data" / "source" / "catalog.sqlite"
        if candidate.is_file():
            return candidate.resolve()
    return None


def ensure_baseline(path: Path) -> dict[str, object]:
    """Check the immutable input DB without opening it for writing."""

    path = path.resolve()
    if not path.is_file() or path.is_symlink():
        raise PublishError(f"baseline SQLite is not a regular file: {path}")
    if sidecars(path):
        raise PublishError(f"baseline SQLite has journal sidecars: {sidecars(path)}")
    try:
        con = sqlite3.connect(_db_uri(path), uri=True)
    except sqlite3.Error as error:
        raise PublishError(f"cannot open baseline SQLite read-only: {error}") from error
    try:
        if con.execute("pragma integrity_check").fetchone()[0] != "ok":
            raise PublishError("baseline SQLite integrity_check failed")
        if con.execute("pragma foreign_key_check").fetchall():
            raise PublishError("baseline SQLite foreign_key_check failed")
        _validate_schema(con, "baseline")
        uniqueness = {
            "source_works": "id",
            "source_factors": "workId || char(31) || axisId",
            "source_themes": "workId || char(31) || themeId",
            "source_evidence": "id",
            "source_volumes": "id",
        }
        for table, expression in uniqueness.items():
            total, distinct = con.execute(
                f"select count(*), count(distinct {expression}) from {table}"
            ).fetchone()
            if total != distinct:
                raise PublishError(f"baseline has duplicate logical rows: {table}")
        work_count = con.execute("select count(*) from source_works").fetchone()[0]
        return {"workCount": work_count, "sha256": sha256(path)}
    finally:
        con.close()


def registry_facts(metadata: dict, columns: list[str], rows: list[dict], target_ids: set[str], baseline_sha: str | None = None) -> dict:
    """Validate the current registry rows, including a transaction's planned corrections."""
    registry_baseline_sha = metadata.get("baselineSha256", "").lower()
    if not re.fullmatch(r"[0-9a-f]{64}", registry_baseline_sha):
        raise PublishError("registry baselineSha256 metadata is missing or malformed")
    if not {"canonicalWorkId", "canonicalTitleJa", "canonicalCreatorsJa", "identityEvidenceUrls", "representativeIsbn", "volumeNumber", "editionKind", "supportEvidenceUrls"} <= set(columns):
        raise PublishError("registry_source_rows lacks identity/bibliography provenance columns")
    mapped = {
        str(row["canonicalWorkId"])
        for row in rows
        if str(row.get("canonicalWorkId", ""))
    }
    missing = sorted(target_ids - mapped)
    if missing:
        raise PublishError(f"registry does not map target works: {missing[:5]}")
    by_work: dict[str, list[dict[str, object]]] = {}
    for row in rows:
        work_id = str(row.get("canonicalWorkId", ""))
        if not work_id:
            continue
        by_work.setdefault(work_id, []).append(row)
    # Duplicate source rows are expected for repeated nominations.  Packet
    # binding below requires the manifest-frozen complete same-work set,
    # one bibliography, and the union of its provenance.
    return {
        "baselineSha256": metadata.get("baselineSha256", ""),
        "baselineMatchesInput": bool(
            baseline_sha is None or registry_baseline_sha == baseline_sha.lower()
        ),
        "columns": columns,
        "rowCount": len(mapped),
        "rowsByWork": {key: sorted(value, key=lambda item: str(item.get("sourceRowId", ""))) for key, value in sorted(by_work.items())},
        # Backwards-compatible first-row view for diagnostics only.
        "rows": {key: sorted(value, key=lambda item: str(item.get("sourceRowId", "")))[0] for key, value in sorted(by_work.items())},
    }


def ensure_registry(path: Path, target_ids: set[str], baseline_sha: str | None = None) -> dict[str, object]:
    path = path.resolve()
    if not path.is_file() or path.is_symlink():
        raise PublishError(f"registry SQLite is not a regular file: {path}")
    if sidecars(path):
        raise PublishError(f"registry SQLite has journal sidecars: {sidecars(path)}")
    con = sqlite3.connect(_db_uri(path), uri=True)
    try:
        if con.execute("pragma integrity_check").fetchone()[0] != "ok":
            raise PublishError("registry SQLite integrity_check failed")
        if con.execute("pragma foreign_key_check").fetchall():
            raise PublishError("registry SQLite foreign_key_check failed")
        if _table_names(con) != {"registry_meta", "registry_source_rows", "registry_research_attempts"}:
            raise PublishError("registry schema/table set mismatch")
        metadata = dict(con.execute("select key,value from registry_meta"))
        columns = sorted(_columns(con, "registry_source_rows"))
        rows = [dict(zip(columns, row)) for row in con.execute(
            "select " + ",".join(f'\"{column}\"' for column in columns) + " from registry_source_rows")]
        return {"sha256": sha256(path), **registry_facts(metadata, columns, rows, target_ids, baseline_sha)}
    finally:
        con.close()


def _bind_frozen_registry(
    input_root: Path,
    target_ids: set[str],
    registry: dict[str, object],
    registry_slice: Path | None = None,
) -> dict[str, object]:
    """Bind an optional manifest-verified registry slice to the registry DB."""

    path = registry_slice.resolve() if registry_slice is not None else input_root / "source-registry.csv"
    if not path.exists():
        return registry
    if not path.is_file() or path.is_symlink():
        raise PublishError(f"frozen source-registry.csv is not a regular file: {path}")
    columns = registry.get("columns")
    rows_by_work = registry.get("rowsByWork")
    if not isinstance(columns, list) or not isinstance(rows_by_work, dict):
        raise PublishError("registry metadata lacks columns/rowsByWork")
    try:
        with path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            if (
                reader.fieldnames is None
                or len(reader.fieldnames) != len(set(reader.fieldnames))
                or set(reader.fieldnames) != set(columns)
            ):
                raise PublishError("frozen source-registry.csv header differs from registry DB")
            rows = list(reader)
    except (OSError, UnicodeError, csv.Error) as error:
        raise PublishError(f"invalid frozen source-registry.csv: {error}") from error
    if any(None in row or any(value is None for value in row.values()) for row in rows):
        raise PublishError("frozen source-registry.csv has malformed rows")
    frozen_by_work: dict[str, list[dict[str, object]]] = {}
    for row in rows:
        work_id = str(row.get("canonicalWorkId", ""))
        if work_id not in target_ids:
            raise PublishError(f"frozen source-registry.csv contains non-target work: {work_id!r}")
        frozen_by_work.setdefault(work_id, []).append(dict(row))

    def row_key(row: dict[str, object]) -> tuple[str, ...]:
        return tuple(str(row.get(column, "")) for column in columns)

    for work_id in sorted(target_ids):
        expected = rows_by_work.get(work_id)
        actual = frozen_by_work.get(work_id)
        if not isinstance(expected, list) or actual is None or sorted(map(row_key, actual)) != sorted(map(row_key, expected)):
            raise PublishError(f"frozen registry row set mismatch: {work_id}")
    return {
        **registry,
        "frozenRowsByWork": frozen_by_work,
        "frozenSlicePath": str(path),
        "frozenSliceSha256": sha256(path),
    }


def _load_frozen(
    chunks: Iterable[Path],
) -> tuple[
    set[str],
    dict[str, Path],
    dict[str, dict[str, str]],
    dict[str, dict[str, str]],
    dict[str, dict[str, str]],
    dict[str, dict[str, str]],
    dict[str, dict[str, object]],
]:
    targets: set[str] = set()
    work_chunk: dict[str, Path] = {}
    contexts: dict[str, dict[str, str]] = {}
    supplemental: dict[str, dict[str, str]] = {}
    prior: dict[str, dict[str, str]] = {}
    frozen_evidence: dict[str, dict[str, str]] = {}
    packets: dict[str, dict[str, object]] = {}
    for chunk in chunks:
        target_rows = _read_csv(chunk / "targets.csv", panel.TARGET_FIELDS)
        target_ids = {row["workId"] for row in target_rows}
        if len(target_ids) != len(target_rows):
            raise PublishError(f"duplicate target work in {chunk}")
        for row in target_rows:
            if row["workId"] in targets:
                raise PublishError(f"duplicate target work across chunks: {row['workId']}")
            targets.add(row["workId"])
            work_chunk[row["workId"]] = chunk
        context_rows = _read_csv(chunk / "recommendation-context-condition.csv", panel.CONTEXT_FIELDS)
        if {row["workId"] for row in context_rows} != target_ids:
            raise PublishError(f"context target membership mismatch: {chunk}")
        for row in context_rows:
            if row["workId"] in contexts:
                raise PublishError(f"duplicate context work: {row['workId']}")
            contexts[row["workId"]] = row
        for row in _read_csv(chunk / "prior-panel-claims.csv", panel.PRIOR_FIELDS):
            key = f"{row['workId']}\x1f{row['factKey']}"
            if key in prior:
                raise PublishError(f"duplicate frozen prior claim: {row['workId']} {row['factKey']}")
            prior[key] = row
        for row in _read_csv(chunk / "supplemental-evidence.csv", panel.SUPPLEMENTAL_FIELDS):
            evidence_id = row["evidenceId"]
            if not evidence_id or evidence_id in supplemental:
                raise PublishError(f"duplicate supplemental evidenceId: {evidence_id}")
            if row["workId"] not in target_ids:
                raise PublishError(f"supplemental evidence outside chunk: {evidence_id}")
            supplemental[evidence_id] = row
        for work_id in sorted(target_ids):
            packet_dir = chunk / "packets" / work_id
            packet_json = packet_dir / "packet.json"
            try:
                packet_value = json.loads(packet_json.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, json.JSONDecodeError) as error:
                raise PublishError(f"invalid frozen packet JSON: {packet_json}: {error}") from error
            if not isinstance(packet_value, dict):
                raise PublishError(f"frozen packet JSON must be an object: {packet_json}")
            packet_work = packet_value.get("work")
            if not isinstance(packet_work, dict) or packet_work.get("id") != work_id:
                raise PublishError(f"frozen packet work identity mismatch: {work_id}")
            support_urls = packet_value.get("supportEvidenceUrls")
            if (
                not isinstance(support_urls, list)
                or not support_urls
                or any(not isinstance(url, str) or not url for url in support_urls)
            ):
                raise PublishError(f"frozen packet supportEvidenceUrls missing: {work_id}")
            context_evidence_id = packet_value.get("contextEvidenceId")
            if not isinstance(context_evidence_id, str) or not context_evidence_id:
                raise PublishError(f"frozen packet contextEvidenceId missing: {work_id}")
            packet_manifest = packet_dir / "PACKET.sha256"
            if not packet_manifest.is_file() or packet_manifest.is_symlink():
                raise PublishError(f"frozen packet manifest missing: {work_id}")
            packet_value["_packetDigest"] = sha256(packet_manifest)
            packets[work_id] = packet_value
            evidence_path = packet_dir / "evidence.csv"
            for row in _read_csv(evidence_path, panel.ORIGINAL_EVIDENCE_FIELDS):
                evidence_id = row["id"]
                if evidence_id in frozen_evidence and frozen_evidence[evidence_id] != row:
                    raise PublishError(f"conflicting frozen evidenceId: {evidence_id}")
                frozen_evidence[evidence_id] = row
    if not targets or set(contexts) != targets:
        raise PublishError("frozen panel input does not cover exact targets and contexts")
    if set(packets) != targets:
        raise PublishError("frozen packet membership mismatch")
    return targets, work_chunk, contexts, supplemental, prior, frozen_evidence, packets


def _load_panel(
    input_root: Path,
    result_root: Path,
    chunks: list[Path],
) -> tuple[list[dict[str, str]], dict[str, dict[str, str]], dict[str, Path], dict[str, int]]:
    try:
        result_summary = panel.validate(input_root, result_root)
    except (OSError, panel.ValidationError, ValueError) as error:
        raise PublishError(f"authorized evidence-panel result validation failed: {error}") from error
    rows: list[dict[str, str]] = []
    promotion: dict[str, dict[str, str]] = {}
    work_chunk: dict[str, Path] = {}
    for chunk in chunks:
        result = result_root / chunk.name
        for row in _read_csv(result / "evidence-panel-ledger.csv", panel.LEDGER_FIELDS):
            rows.append(row)
            work_id = row["workId"]
            if work_id in work_chunk and work_chunk[work_id] != chunk:
                raise PublishError(f"panel work appears in multiple chunks: {work_id}")
            work_chunk[work_id] = chunk
        for row in _read_csv(result / "promotion-ledger.csv", panel.PROMOTION_FIELDS):
            if row["workId"] in promotion:
                raise PublishError(f"duplicate panel promotion row: {row['workId']}")
            promotion[row["workId"]] = row
    return rows, promotion, work_chunk, result_summary


def _baseline_facts(path: Path | sqlite3.Connection) -> dict[str, object]:
    owned = not isinstance(path, sqlite3.Connection)
    con = sqlite3.connect(_db_uri(path), uri=True) if owned else path
    previous_factory = con.row_factory
    con.row_factory = sqlite3.Row
    try:
        works = {row["id"]: dict(row) for row in con.execute("select * from source_works")}
        factors = {
            (row["workId"], row["axisId"]): dict(row)
            for row in con.execute("select * from source_factors")
        }
        themes = {
            (row["workId"], row["themeId"]): dict(row)
            for row in con.execute("select * from source_themes")
        }
        evidence = {
            row["id"]: dict(row)
            for row in con.execute("select * from source_evidence")
        }
        contexts: dict[str, list[dict[str, object]]] = {}
        for row in con.execute("select * from source_recommendation_context"):
            contexts.setdefault(row["workId"], []).append(dict(row))
        volume_rows: dict[str, list[dict[str, object]]] = {}
        for row in con.execute("select workId,count(*) from source_volumes group by workId"):
            volume_rows[row[0]] = []
        for row in con.execute("select * from source_volumes order by sourceOrdinal"):
            volume_rows.setdefault(row["workId"], []).append(dict(row))
        volumes = {work_id: len(rows) for work_id, rows in volume_rows.items()}
        return {
            "works": works,
            "factors": factors,
            "themes": themes,
            "evidence": evidence,
            "contexts": contexts,
            "volumes": volumes,
            "volumeRows": volume_rows,
        }
    finally:
        con.row_factory = previous_factory
        if owned:
            con.close()


def _baseline_facts_from_snapshot(snapshot: dict) -> dict:
    """Build fresh planner dictionaries from an already read, immutable row view."""
    def rows(table):
        columns, values = snapshot[table]
        return [dict(zip(columns, row)) for row in values]

    contexts, volume_rows = {}, {}
    for row in rows("source_recommendation_context"):
        contexts.setdefault(row["workId"], []).append(row)
    for row in rows("source_volumes"):
        volume_rows.setdefault(row["workId"], []).append(row)
    return {
        "works": {row["id"]: row for row in rows("source_works")},
        "factors": {(row["workId"], row["axisId"]): row for row in rows("source_factors")},
        "themes": {(row["workId"], row["themeId"]): row for row in rows("source_themes")},
        "evidence": {row["id"]: row for row in rows("source_evidence")},
        "contexts": contexts, "volumeRows": volume_rows,
        "volumes": {wid: len(values) for wid, values in volume_rows.items()},
    }


def _normalise_isbn(value: object) -> str:
    return re.sub(r"[-\s]", "", str(value))


def _split_provenance(value: object, separator: str = ";") -> set[str]:
    return {item.strip() for item in str(value or "").split(separator) if item.strip()}


REGISTRY_VOLUME_PROOF_FIELDS = {
    "sourceRowId", "workId", "title", "creators", "isbn", "volumeNumber",
    "editionKind", "evidenceUrl", "retrievedAt", "observation",
}


def validate_registry_volume_proofs(value: object, work_id: str) -> dict[str, dict[str, str]]:
    """Validate explicit source-scoped bibliography, never infer it from a host."""
    if not isinstance(value, list):
        raise PublishError(f"registry volume proofs must be a list: {work_id}")
    proofs = {}
    for proof in value:
        if not isinstance(proof, dict) or set(proof) != REGISTRY_VOLUME_PROOF_FIELDS:
            raise PublishError(f"invalid registry volume proof fields: {work_id}")
        if any(not isinstance(v, str) or not v.strip() for v in proof.values()):
            raise PublishError(f"empty registry volume proof field: {work_id}")
        rid = proof["sourceRowId"]
        if rid in proofs or proof["workId"] != work_id:
            raise PublishError(f"duplicate or foreign registry volume proof: {rid}")
        isbn = proof["isbn"]
        if (not re.fullmatch(r"97[89]\d{10}", isbn)
                or sum(int(d) * (1 if i % 2 == 0 else 3) for i, d in enumerate(isbn)) % 10):
            raise PublishError(f"invalid registry volume proof ISBN: {rid}")
        if not re.fullmatch(r"[1-9]\d*", proof["volumeNumber"]):
            raise PublishError(f"invalid registry volume proof number: {rid}")
        if proof["editionKind"] not in {"standard", "digital", "bunko", "complete", "limited", "set"}:
            raise PublishError(f"unproved registry volume edition: {rid}")
        url = proof["evidenceUrl"]
        try:
            parsed = urlsplit(url)
            if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or any(c.isspace() for c in url):
                raise ValueError("invalid URL")
            datetime.fromisoformat(proof["retrievedAt"].replace("Z", "+00:00"))
        except ValueError as error:
            raise PublishError(f"invalid registry volume proof URL/date: {rid}") from error
        proofs[rid] = proof
    return proofs


def _registry_bibliography(row: dict[str, object]) -> tuple[str, ...]:
    return tuple(str(row.get(field, "")) for field in ("canonicalTitleJa", "canonicalCreatorsJa")) + (
        _normalise_isbn(row.get("representativeIsbn")), str(row.get("volumeNumber", "")), str(row.get("editionKind", "")),
    )


def _proof_bibliography(proof: dict[str, str]) -> tuple[str, ...]:
    return tuple(proof[field] for field in ("title", "creators", "isbn", "volumeNumber", "editionKind"))


def _validate_packet_baseline_binding(
    packets: dict[str, dict[str, object]],
    baseline: dict[str, object],
    registry: dict[str, object] | None,
) -> None:
    """Bind frozen packet identity/bibliography/provenance to the candidate DB."""

    works: dict[str, dict[str, object]] = baseline["works"]  # type: ignore[assignment]
    volume_rows: dict[str, list[dict[str, object]]] = baseline["volumeRows"]  # type: ignore[assignment]
    registry_rows: dict[str, list[dict[str, object]]] = {}
    if registry is not None:
        registry_rows = registry.get("rowsByWork", {})  # type: ignore[assignment]
    for work_id, packet in sorted(packets.items()):
        work_meta = packet.get("work")
        volume_meta = packet.get("representativeVolume")
        source_identity = packet.get("sourceIdentity")
        support_urls = packet.get("supportEvidenceUrls")
        if not isinstance(work_meta, dict) or not isinstance(volume_meta, dict):
            raise PublishError(f"packet identity/volume object missing: {work_id}")
        if not isinstance(source_identity, str):
            raise PublishError(f"packet sourceIdentity missing: {work_id}")
        source_identity_urls = _split_provenance(source_identity, "|")
        if not source_identity_urls:
            raise PublishError(f"packet sourceIdentity missing: {work_id}")
        if not isinstance(support_urls, list) or not support_urls:
            raise PublishError(f"packet supportEvidenceUrls missing: {work_id}")
        baseline_work = works.get(work_id)
        if baseline_work is None:
            raise PublishError(f"packet work absent from baseline DB: {work_id}")
        for field in ("id", "title", "creators", "publisher", "demographic", "status", "firstPublishedYear", "factorScope"):
            packet_value = work_id if field == "id" else work_meta.get(field)
            if str(packet_value or "") != str(baseline_work.get(field, "")):
                raise PublishError(
                    f"packet/baseline identity mismatch: {work_id} {field}: "
                    f"packet={packet_value!r} baseline={baseline_work.get(field)!r}"
                )
        candidates = [row for row in volume_rows.get(work_id, []) if str(row.get("isRepresentative")) == "true"]
        if len(candidates) != 1:
            raise PublishError(f"baseline representative volume count mismatch: {work_id}")
        baseline_volume = candidates[0]
        for field in ("id", "volumeNumber", "editionKind", "releaseDate"):
            if str(volume_meta.get(field, "")) != str(baseline_volume.get(field, "")):
                raise PublishError(
                    f"packet/baseline representative volume mismatch: {work_id} {field}: "
                    f"packet={volume_meta.get(field)!r} baseline={baseline_volume.get(field)!r}"
                )
        if _normalise_isbn(volume_meta.get("isbn")) != _normalise_isbn(baseline_volume.get("isbn")):
            raise PublishError(f"packet/baseline representative ISBN mismatch: {work_id}")
        if packet.get("registryVolumeProofs") and registry is None:
            raise PublishError(f"registry volume proofs lack frozen registry: {work_id}")
        if registry is not None:
            registry_candidates = list(registry_rows.get(work_id, []))
            if not registry_candidates:
                raise PublishError(f"registry identity row missing: {work_id}")
            frozen_by_work = registry.get("frozenRowsByWork", {})
            frozen_candidates = frozen_by_work.get(work_id) if isinstance(frozen_by_work, dict) else None
            lexical_row = lambda row: tuple(sorted((str(key), str(value)) for key, value in row.items()))
            if frozen_candidates is not None and sorted(map(lexical_row, frozen_candidates)) != sorted(
                map(lexical_row, registry_candidates)
            ):
                raise PublishError(f"frozen registry row set mismatch: {work_id}")
            if len(registry_candidates) > 1 and frozen_candidates is None:
                raise PublishError(f"frozen registry rows missing for repeated work: {work_id}")
            bound_rows = frozen_candidates if isinstance(frozen_candidates, list) else registry_candidates
            bibliography = (
                str(work_meta.get("title", "")),
                str(work_meta.get("creators", "")),
                _normalise_isbn(volume_meta.get("isbn")),
                str(volume_meta.get("volumeNumber", "")),
                str(volume_meta.get("editionKind", "")),
            )
            proofs = validate_registry_volume_proofs(packet.get("registryVolumeProofs", []), work_id)
            row_ids = [str(row.get("sourceRowId", "")) for row in bound_rows]
            if len(set(row_ids)) != len(row_ids) or not set(proofs) <= set(row_ids):
                raise PublishError(f"extra or nonunique registry volume proof row: {work_id}")
            representative_witness = False
            for row in bound_rows:
                row_bibliography = _registry_bibliography(row)
                if str(row.get("canonicalWorkId", "")) != work_id or row_bibliography[:2] != bibliography[:2]:
                    raise PublishError(f"registry same-work bibliography mismatch: {work_id}")
                proof = proofs.get(str(row.get("sourceRowId", "")))
                if proof is not None and (
                    _proof_bibliography(proof) != row_bibliography
                    or proof["evidenceUrl"] not in _split_provenance(row.get("bibliographyEvidenceUrls"), "|")
                ):
                    raise PublishError(f"registry volume proof bibliography mismatch: {work_id}")
                if row_bibliography == bibliography:
                    representative_witness = True
                elif proof is None:
                    raise PublishError(f"registry same-work bibliography mismatch: {work_id}; unproved alternate volume")
            if not representative_witness:
                raise PublishError(f"registry representative witness missing: {work_id}")
            identity_urls = set().union(*(
                _split_provenance(row.get("identityEvidenceUrls"), "|") for row in bound_rows
            ))
            registry_support = set().union(*(
                _split_provenance(row.get("supportEvidenceUrls"), "|") for row in bound_rows
            ))
            cohort_keys = set().union(*(
                _split_provenance(row.get("cohortKeys"), "|") for row in bound_rows
            ))
            packet_support = {str(url) for url in support_urls if str(url)}
            packet_cohort = packet.get("cohortKey")
            packet_cohorts = _split_provenance(packet_cohort, "|") if packet_cohort is not None else set()
            if (
                not source_identity_urls <= identity_urls
                or not packet_support
                or not packet_support <= registry_support
                or (packet_cohort is not None and (not packet_cohorts or not packet_cohorts <= cohort_keys))
            ):
                raise PublishError(
                    f"registry packet binding is unresolved: {work_id} "
                    f"candidates={len(registry_candidates)}"
                )


def _snapshot_db(path: Path | sqlite3.Connection) -> dict[str, tuple[tuple[str, ...], tuple[tuple[object, ...], ...]]]:
    """Capture every source row for post-write exact-preservation checks."""

    if isinstance(path, dict):
        return path  # One immutable after-view is shared by stacked verifiers.

    owned = not isinstance(path, sqlite3.Connection)
    con = sqlite3.connect(_db_uri(path), uri=True) if owned else path
    previous_factory = con.row_factory
    try:
        snapshot: dict[str, tuple[tuple[str, ...], tuple[tuple[object, ...], ...]]] = {}
        tables = {row[0] for row in con.execute("select name from sqlite_master where type='table'")}
        for table in sorted(tables):
            columns = tuple(row[1] for row in con.execute(f'pragma table_info("{table}")'))
            rows = tuple(
                tuple(row)
                for row in con.execute(f'select * from "{table}" order by "sourceOrdinal"')
            )
            snapshot[table] = (columns, rows)
        return snapshot
    finally:
        con.row_factory = previous_factory
        if owned:
            con.close()


def _json_sha(value: object) -> str:
    return sha256_bytes(json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))


def _validate_alias_boundary(
    baseline_db: Path,
    gold_manifest: Path | None,
    gold_ids: set[str],
) -> dict[str, object]:
    """Prove Gold aliases remain a subset and v4's 20 additions are exact."""

    manifest = _load_gold_manifest(gold_manifest)
    datasets = manifest.get("datasets")
    if not isinstance(datasets, dict) or not isinstance(datasets.get("aliases.csv"), dict):
        raise PublishError("Gold Set aliases.csv dataset binding is missing")
    gold_alias_spec = datasets["aliases.csv"]
    expected_header = ["workId", "alias"]
    expected_header_sha = gold_alias_spec.get("headerSha256")
    if expected_header_sha != _json_sha(expected_header):
        raise PublishError("Gold Set aliases.csv header binding mismatch")
    expected_rows = gold_alias_spec.get("rowSha256")
    if not isinstance(expected_rows, list) or gold_alias_spec.get("rowCount") != len(expected_rows):
        raise PublishError("Gold Set aliases.csv row binding is malformed")

    def alias_rows(path: Path) -> set[tuple[str, str]]:
        con = sqlite3.connect(_db_uri(path), uri=True)
        try:
            return {(str(work_id), str(alias)) for work_id, alias in con.execute("select workId,alias from source_aliases")}
        finally:
            con.close()

    candidate_aliases = alias_rows(baseline_db)
    candidate_gold = {row for row in candidate_aliases if row[0] in gold_ids}
    candidate_hashes = sorted(_json_sha(list(row)) for row in candidate_gold)
    if not set(str(item) for item in expected_rows) <= set(candidate_hashes):
        raise PublishError("Gold Set aliases were removed or changed")

    canonical = _find_repo_catalog()
    if canonical is None:
        raise PublishError("canonical catalog.sqlite is required for alias boundary")
    canonical_aliases = alias_rows(canonical)
    gold_added = {row for row in candidate_gold - canonical_aliases}

    alias_resolution = _find_repo_file(ALIAS_RESOLUTION_RELATIVE)
    if alias_resolution is None:
        raise PublishError("v4-final alias-resolution.csv is required for Gold alias boundary")
    try:
        with alias_resolution.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            if tuple(reader.fieldnames or ()) != ("workId", "alias", "provenance", "sourceRowId", "action", "collisionWith"):
                raise PublishError("v4-final alias-resolution.csv header mismatch")
            resolution = list(reader)
    except (OSError, UnicodeError, csv.Error) as error:
        raise PublishError(f"invalid v4-final alias-resolution.csv: {error}") from error
    inserted = {
        (str(row["workId"]), str(row["alias"]))
        for row in resolution
        if row.get("action") == "inserted" and not row.get("collisionWith")
    }
    if len(inserted) != sum(1 for row in resolution if row.get("action") == "inserted" and not row.get("collisionWith")):
        raise PublishError("v4-final alias-resolution.csv has duplicate inserted aliases")
    gold_inserted = {row for row in inserted if row[0] in gold_ids}
    canonical_gold = {row for row in canonical_aliases if row[0] in gold_ids}
    approved_hashes = {_json_sha(list(row)) for row in gold_inserted}
    expected_hashes = set(str(item) for item in expected_rows) | approved_hashes
    if (len(gold_inserted) != 20 or set(candidate_hashes) != expected_hashes
            or not canonical_gold <= candidate_gold
            or gold_added != gold_inserted - canonical_gold):
        raise PublishError(
            f"Gold alias additions mismatch: require original Gold plus exactly 20 approved v4 aliases, "
            f"candidate={len(gold_added)} resolution={len(gold_inserted)}"
        )
    return {
        "goldAliasManifestRowCount": len(expected_rows),
        "candidateGoldAliasCount": len(candidate_gold),
        "canonicalGoldAliasCount": len({row for row in canonical_aliases if row[0] in gold_ids}),
        "goldAliasAdditions": sorted([list(row) for row in gold_added]),
        "goldAliasAdditionCount": len(gold_added),
        "aliasResolutionSha256": sha256(alias_resolution),
    }


def _rows_by_key(
    snapshot: dict[str, tuple[tuple[str, ...], tuple[tuple[object, ...], ...]]],
    table: str,
    key: str,
) -> dict[object, dict[str, object]]:
    columns, rows = snapshot[table]
    index = columns.index(key)
    return {row[index]: dict(zip(columns, row)) for row in rows}


def _verify_preservation(
    baseline_snapshot: dict[str, tuple[tuple[str, ...], tuple[tuple[object, ...], ...]]],
    output_db: Path,
    plan: dict[str, object],
    gold_ids: set[str],
) -> None:
    after = _snapshot_db(output_db)
    if set(after) != set(baseline_snapshot):
        raise PublishError("published candidate source table membership changed")
    if baseline_snapshot.get("source_book_metadata") != after.get("source_book_metadata"):
        raise PublishError("published candidate book metadata changed")
    target_ids = set(plan.get("targetIds", []))
    blocked_ids = set(plan.get("blockedIds", []))
    pass_ids = set(plan.get("passIds", []))
    gold_overlap = target_ids & gold_ids
    if gold_overlap:
        raise PublishError(f"published candidate targets overlap Gold Set: {sorted(gold_overlap)[:5]}")
    factor_updates = {
        (row["workId"], row["axisId"]): row
        for row in plan.get("factorUpdates", [])  # type: ignore[union-attr]
    }
    theme_inserts = {
        (row["workId"], row["themeId"])
        for row in plan.get("themeInserts", [])  # type: ignore[union-attr]
    }
    genre_updates = set(plan.get("genreUpdates", {}))  # type: ignore[arg-type]
    work_updates = {row["id"]: row for row in plan.get("workUpdates", [])}  # type: ignore[union-attr]
    legacy_pass_ids = set(plan.get("legacyPassIds", []))
    if legacy_pass_ids & target_ids:
        raise PublishError("legacy PASS repair overlaps panel target set")
    new_evidence = set(plan.get("newEvidence", {}))  # type: ignore[arg-type]
    evidence_updates = set(plan.get("evidenceUpdates", {}))  # type: ignore[arg-type]
    evidence_updates.update(plan.get("evidenceNormalizations", {}))  # type: ignore[arg-type]

    # All existing evidence rows are immutable except explicitly declared
    # provenance normalization/context bindings; no row may be deleted.
    before_evidence = _rows_by_key(baseline_snapshot, "source_evidence", "id")
    after_evidence = _rows_by_key(after, "source_evidence", "id")
    if set(after_evidence) != set(before_evidence) | new_evidence:
        raise PublishError("published candidate evidence membership changed unexpectedly")
    for evidence_id, before_row in before_evidence.items():
        after_row = after_evidence[evidence_id]
        if evidence_id not in evidence_updates:
            if after_row != before_row:
                raise PublishError(f"existing evidence row changed unexpectedly: {evidence_id}")
        else:
            for field, value in before_row.items():
                if field not in {"sourceType", "notes"} and after_row[field] != value:
                    raise PublishError(f"evidence provenance update changed immutable field: {evidence_id} {field}")
            expected_update = plan.get("evidenceUpdates", {}).get(evidence_id)  # type: ignore[union-attr]
            expected_normalization = plan.get("evidenceNormalizations", {}).get(evidence_id)  # type: ignore[union-attr]
            expected_value = expected_update or expected_normalization
            if expected_value is not None:
                if after_row["sourceType"] != expected_value["sourceType"] or after_row["notes"] != expected_value["notes"]:
                    raise PublishError(f"evidence provenance update mismatch: {evidence_id}")

    # Existing work metadata (including all non-target and BLOCKED rows) must
    # remain byte-equivalent. PASS rows may change only the explicit promotion
    # fields and any panel-added genre memberships.
    before_works = _rows_by_key(baseline_snapshot, "source_works", "id")
    after_works = _rows_by_key(after, "source_works", "id")
    if set(after_works) != set(before_works):
        raise PublishError("published candidate work membership changed")
    allowed_work_fields = {
        "genres", "onboardingEligible", "recommendationEligible", "libraryOnly",
        "annotationReviewMethod", "annotationReviewedAt", "annotationReviewReference",
    }
    for work_id, before_row in before_works.items():
        current = after_works[work_id]
        if work_id not in pass_ids and work_id not in legacy_pass_ids:
            if current != before_row:
                raise PublishError(f"non-target/BLOCKED work changed unexpectedly: {work_id}")
            continue
        if work_id in legacy_pass_ids:
            # Legacy authorized-evidence-panel PASS rows are only repaired so
            # the S6 registry can consume them.  No adjudication or factor
            # values are changed; the v5 review artifact is copied verbatim.
            for field, value in before_row.items():
                if field != "onboardingEligible" and current[field] != value:
                    raise PublishError(f"legacy PASS immutable field changed: {work_id} {field}")
            if before_row["annotationReviewMethod"] != "authorizedEvidencePanel" or before_row["recommendationEligible"] != "true" or before_row["libraryOnly"] != "false":
                raise PublishError(f"invalid legacy PASS repair candidate: {work_id}")
            if current["onboardingEligible"] != "true":
                raise PublishError(f"legacy PASS onboarding eligibility not repaired: {work_id}")
            continue
        for field, value in before_row.items():
            if field not in allowed_work_fields and current[field] != value:
                raise PublishError(f"PASS work immutable field changed: {work_id} {field}")
        if current["onboardingEligible"] != "true" or current["recommendationEligible"] != "true" or current["libraryOnly"] != "false":
            raise PublishError(f"PASS work eligibility contract failed: {work_id}")
        if current["annotationReviewMethod"] != "authorizedEvidencePanel":
            raise PublishError(f"PASS work review method contract failed: {work_id}")

    # Factors preserve every row except an exact panel update from baseline
    # unknown; themes preserve every row except exact deterministic inserts.
    before_factors = _rows_by_key(baseline_snapshot, "source_factors", "sourceOrdinal")
    after_factors = _rows_by_key(after, "source_factors", "sourceOrdinal")
    if set(after_factors) != set(before_factors) or len(after_factors) != len(before_factors):
        raise PublishError("published candidate factor row membership changed")
    factor_columns = baseline_snapshot["source_factors"][0]
    by_factor_before = {(row["workId"], row["axisId"]): row for row in before_factors.values()}
    by_factor_after = {(row["workId"], row["axisId"]): row for row in after_factors.values()}
    if set(by_factor_before) != set(by_factor_after):
        raise PublishError("published candidate factor key membership changed")
    for key, before_row in by_factor_before.items():
        after_row = by_factor_after[key]
        expected = factor_updates.get(key)
        if expected is None:
            if after_row != before_row:
                raise PublishError(f"factor changed outside panel plan: {key}")
        else:
            for field in factor_columns:
                if field in {"state", "value", "confidence", "evidenceId"}:
                    continue
                if after_row[field] != before_row[field]:
                    raise PublishError(f"factor immutable field changed: {key} {field}")
            if (after_row["state"], after_row["value"], after_row["confidence"], after_row["evidenceId"]) != (
                expected["state"], expected["value"], expected["confidence"], expected["evidenceId"]
            ):
                raise PublishError(f"factor panel update mismatch: {key}")
    before_themes = _rows_by_key(baseline_snapshot, "source_themes", "sourceOrdinal")
    after_themes = _rows_by_key(after, "source_themes", "sourceOrdinal")
    before_theme_keys = {(row["workId"], row["themeId"]): row for row in before_themes.values()}
    after_theme_keys = {(row["workId"], row["themeId"]): row for row in after_themes.values()}
    if set(after_theme_keys) != set(before_theme_keys) | theme_inserts:
        raise PublishError("published candidate theme membership changed unexpectedly")
    for key, before_row in before_theme_keys.items():
        if after_theme_keys[key] != before_row:
            raise PublishError(f"existing theme changed unexpectedly: {key}")

    # Genres may only be changed for a panel claim, while all aliases/volumes,
    # art manifests, recommendation config/context rows retain exact values
    # except deterministic PASS context inserts.
    for work_id, before_row in before_works.items():
        if work_id not in genre_updates and after_works[work_id]["genres"] != before_row["genres"]:
            raise PublishError(f"genre changed outside panel plan: {work_id}")
    # Gold150 is an immutable compatibility boundary.  Check membership and
    # every field explicitly, even when no panel target intersects it.
    missing_gold_before = sorted(gold_ids - set(before_works))
    missing_gold_after = sorted(gold_ids - set(after_works))
    if missing_gold_before or missing_gold_after:
        raise PublishError(f"Gold Set rows missing: before={missing_gold_before[:5]} after={missing_gold_after[:5]}")
    for work_id in gold_ids:
        if after_works[work_id] != before_works[work_id]:
            raise PublishError(f"Gold Set work changed unexpectedly: {work_id}")
    context_before = baseline_snapshot["source_recommendation_context"]
    context_after = after["source_recommendation_context"]
    if len(context_after[1]) != len(context_before[1]) + len(plan.get("contextInserts", [])):  # type: ignore[arg-type]
        raise PublishError("recommendation context row count changed unexpectedly")
    base_context_rows = set(context_before[1])
    current_context_rows = set(context_after[1])
    if not base_context_rows <= current_context_rows:
        raise PublishError("existing recommendation context rows changed or deleted")
    for table in ("source_aliases", "source_volumes", "source_recommendation_config", "source_art_evidence_manifest"):
        if after[table] != baseline_snapshot[table]:
            raise PublishError(f"immutable source table changed: {table}")


LEGACY_SOURCE_TYPE_MAP = {
    # The S6 enum values are already canonical.
    "rakuten": "rakuten",
    "publisher": "publisher",
    "manual": "manual",
    "model": "model",
    # Explicitly adjudicated legacy cohort/award/editorial kinds.
    "cohortSupport": "manual",
    "awardCommittee": "manual",
    "officialAwardComment": "manual",
    "editorialWorkReview": "manual",
    # Licensed/rights-holder and creator-origin evidence is a manual source
    # classification in the existing S6 vocabulary (the raw kind remains in
    # notes for auditability).
    "licensedPlatform": "manual",
    "licensedRetailer": "manual",
    "licensedEditorial": "manual",
    "licensedPreview": "manual",
    "licensedPublisher": "manual",
    "licensedPublisherReader": "manual",
    "licensedPublisherPlatform": "manual",
    "licensedStore": "manual",
    "officialLicensedPreview": "manual",
    "creatorOfficial": "manual",
    "authorInterview": "manual",
    "publisherAuthorInterview": "manual",
    "rightsHolderAdaptation": "manual",
    "rightsholder": "manual",
    # Publisher/official/serialization/retail source labels observed in the
    # frozen panel input are explicitly mapped to the broad publisher enum.
    "officialPublisherReview": "publisher",
    "officialPublisherVolume": "publisher",
    "publisherPressRelease": "publisher",
    "officialPublisherInterview": "publisher",
    "officialPublisherSeries": "publisher",
    "publisherOfficial": "publisher",
    "publisherSerialization": "publisher",
    "publisherOfficialSerialization": "publisher",
    "publisherArticle": "publisher",
    "publisherExcerpt": "publisher",
    "publisherEditorInterview": "publisher",
    "publisherVolumePage": "publisher",
    "publisherFeature": "publisher",
    "publisherEditorial": "publisher",
    "publisherRelease": "publisher",
    "publisherInterview": "publisher",
    "publisherPlatform": "publisher",
    "publisherSample": "publisher",
    "publisherEpisode": "publisher",
    "publisherOfficialImprint": "publisher",
    "publisherOfficialSerialization": "publisher",
    "officialSerializationImage": "publisher",
    "officialSerialization": "publisher",
    "officialPublisher": "publisher",
    "publisherOfficialSeries": "publisher",
    "publisherOfficial": "publisher",
    "publisherStore": "publisher",
}


def _source_type(raw: str) -> str:
    value = raw.strip()
    try:
        return LEGACY_SOURCE_TYPE_MAP[value]
    except KeyError as error:
        raise PublishError(f"unsupported sourceType (explicit mapping required): {value!r}") from error


def _normalise_existing_evidence(row: dict[str, object]) -> dict[str, str] | None:
    """Map legacy source-kind labels into the S6 enum, retaining the raw kind."""

    raw = str(row.get("sourceType", ""))
    if raw in {"rakuten", "publisher", "manual", "model"}:
        return None
    normalised = _source_type(raw)
    original_notes = str(row.get("notes", ""))
    marker = f"originalSourceType={raw}; normalizedSourceType={normalised}"
    notes = original_notes if marker in original_notes else f"{marker}\n{original_notes}"
    return {"id": str(row["id"]), "sourceType": normalised, "notes": notes}


def _target_type(raw: str, work_id: str, target_id: str) -> tuple[str, str]:
    if raw in {"work", "volume", "axis", "theme"}:
        return raw, target_id
    return "work", work_id


def _iso(value: str, label: str) -> str:
    if not value:
        raise PublishError(f"missing timestamp for {label}")
    try:
        datetime.fromisoformat(value)
    except ValueError as error:
        raise PublishError(f"invalid timestamp for {label}: {value}") from error
    return value


def _claim_evidence_id(row: dict[str, str]) -> str:
    evidence_ids = ";".join(sorted(panel.split_list(row["evidenceIds"], f"{row['workId']} evidenceIds")))
    citation_urls = ";".join(sorted(panel.split_list(row["citationUrls"], f"{row['workId']} citationUrls")))
    payload = [
        row["workId"], row["factKey"], row["state"], row["value"], row["confidence"],
        evidence_ids, citation_urls, row["entryScope"], row["decision"],
        row["authorityKind"], row["authorityArtifactDigest"], row["citationSetDigest"],
    ]
    return f"ev-authorized-panel-{sha256_bytes(json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode('utf-8'))}"


def _canonical_evidence_id(raw: str) -> str:
    """Return a schema-safe evidence ID while preserving the raw ID in notes."""

    value = raw.strip()
    if CATALOG_ID_RE.fullmatch(value):
        return value
    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    if not normalized:
        raise PublishError(f"evidence ID cannot be canonicalized: {raw!r}")
    candidate = normalized if CATALOG_ID_RE.fullmatch(normalized) else f"ev-{normalized}"
    if not CATALOG_ID_RE.fullmatch(candidate):
        raise PublishError(f"evidence ID cannot be canonicalized: {raw!r}")
    return candidate


def _binding_notes(
    row: dict[str, str],
    *,
    evidence_id: str,
    source_kind: str,
    context: bool = False,
    authority_artifact_digest: str | None = None,
    citation_set_digest: str | None = None,
    original_evidence_id: str | None = None,
) -> str:
    evidence_value = row.get("evidenceIds", evidence_id)
    citation_value = row.get("citationUrls", "")
    evidence_value = ";".join(sorted(panel.split_list(evidence_value, "binding evidenceIds"))) if evidence_value else ""
    citation_value = ";".join(sorted(panel.split_list(citation_value, "binding citationUrls"))) if citation_value else ""
    payload = {
        "authorityKind": row.get("authorityKind", AUTHORITY_KIND),
        "authorityArtifactDigest": authority_artifact_digest or row.get("authorityArtifactDigest", ""),
        "citationSetDigest": citation_set_digest or row.get("citationSetDigest", ""),
        "candidateOnly": row.get("candidateOnly", "true"),
        "reviewedByHuman": row.get("reviewedByHuman", "false"),
        "workId": row.get("workId", ""),
        "factKey": row.get("factKey", "work:recommendationContext" if context else ""),
        "evidenceIds": evidence_value,
        "citationUrls": citation_value,
        "entryScope": row.get("entryScope", "entry_1_3_volumes"),
        "decision": row.get("decision", "accepted"),
        "sourceKind": source_kind,
        "observation": row.get("observation", ""),
        "limitation": row.get("limitation", ""),
    }
    if original_evidence_id and original_evidence_id != evidence_id:
        payload["originalEvidenceId"] = original_evidence_id
    return "authorizedEvidencePanelV1|" + json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _evidence_row(
    evidence_id: str,
    source: dict[str, str],
    *,
    panel_row: dict[str, str],
    context: bool = False,
    authority_artifact_digest: str | None = None,
    citation_set_digest: str | None = None,
    original_evidence_id: str | None = None,
) -> dict[str, str]:
    work_id = panel_row["workId"]
    target_type, target_id = _target_type(source.get("targetType", "work"), work_id, source.get("targetId", work_id))
    # The claim-level evidence row is the single evidenceId stored by the
    # source factor/theme table.  Bind its target to that fact even when the
    # selected citation came from a volume or entry packet.
    if not context:
        fact_key = panel_row.get("factKey", "")
        if fact_key.startswith("axis:"):
            target_type, target_id = "axis", fact_key.split(":", 1)[1]
        elif fact_key.startswith("theme:"):
            target_type, target_id = "theme", fact_key.split(":", 1)[1]
        elif fact_key.startswith("genre:"):
            target_type, target_id = "work", work_id
    raw_type = source.get("sourceType", "publisher")
    source_kind = _source_type(raw_type)
    fetched = source.get("fetchedAt") or source.get("retrievedAt", "")
    confidence = panel_row.get("confidence", "") or "0.0"
    return {
        "id": evidence_id,
        "workId": work_id,
        "targetType": target_type,
        "targetId": target_id,
        "sourceType": source_kind,
        "sourceUrl": source.get("sourceUrl", ""),
        "fetchedAt": _iso(fetched, evidence_id),
        "extractorVersion": "authorizedEvidencePanelV1",
        "reviewedByHuman": "false",
        "confidence": confidence,
        "notes": _binding_notes(
            panel_row,
            evidence_id=evidence_id,
            source_kind=raw_type,
            context=context,
            authority_artifact_digest=authority_artifact_digest,
            citation_set_digest=citation_set_digest,
            original_evidence_id=original_evidence_id,
        ),
    }


def _context_evidence_row(
    context: dict[str, str],
    evidence_id: str,
    source: dict[str, str],
    *,
    authority_artifact_digest: str,
    original_evidence_id: str | None = None,
) -> dict[str, str]:
    row = {
        "workId": context["workId"],
        "factKey": "work:recommendationContext",
        "evidenceIds": context["evidenceIds"],
        "citationUrls": context["citationUrls"],
        "entryScope": "entry_1_3_volumes",
        "decision": "accepted",
        "authorityKind": AUTHORITY_KIND,
        "authorityArtifactDigest": authority_artifact_digest,
        "citationSetDigest": panel.citation_digest(panel.split_list(context["citationUrls"], "context citationUrls")),
        "candidateOnly": "true",
        "reviewedByHuman": "false",
        "observation": context["observation"],
        "limitation": context["limitation"],
    }
    return _evidence_row(
        evidence_id,
        source,
        panel_row=row,
        context=True,
        authority_artifact_digest=authority_artifact_digest,
        citation_set_digest=row["citationSetDigest"],
        original_evidence_id=original_evidence_id,
    )


def _coverage(
    work_id: str,
    factors: dict[tuple[str, str], dict[str, str]],
    themes: dict[tuple[str, str], dict[str, str]],
    works: dict[str, dict[str, str]],
) -> list[str]:
    known = {axis for (wid, axis), row in factors.items() if wid == work_id and row["state"] == "known"}
    genres = [item for item in works[work_id]["genres"].split(";") if item]
    theme_count = sum(wid == work_id for (wid, _theme) in themes)
    blockers: list[str] = []
    if not genres:
        blockers.append("GENRE_COVERAGE_MISSING")
    if theme_count < 1:
        blockers.append("THEME_COVERAGE_MISSING")
    if len(known & NARRATIVE) < 4:
        blockers.append("NARRATIVE_COVERAGE_INCOMPLETE")
    if len(known & TONE) < 5:
        blockers.append("TONE_COVERAGE_INCOMPLETE")
    return blockers


SAFETY_POSITIVE_RE = re.compile(
    r"(?:non[- ]porn(?:ographic)?|非ポルノ|비포르노|non[- ]adult|nonadult|general[- ]audience|all[- ]ages|"
    r"全年齢|一般向け|成人向けでは(?:ない|ありません)|成人作品では(?:ない|ありません))",
    re.IGNORECASE,
)


def _validate_safety_gate(
    work_id: str,
    prior: dict[str, dict[str, str]],
    frozen_evidence: dict[str, dict[str, str]],
    supplemental: dict[str, dict[str, str]],
    baseline_evidence: dict[str, dict[str, str]],
    packets: dict[str, dict[str, object]],
) -> None:
    """Require affirmative, non-model, work-owned safety provenance.

    A legacy identity lookup saying that no bibliography or scope hold was
    found is not an affirmative safety review.  Promotion requires at least
    one frozen, same-work evidence row from a non-model source whose
    observation supports non-pornographic scope. Legacy non-adult classifications
    remain readable; an adult age rating alone does not exclude a work.
    """

    claim = prior.get(f"{work_id}\x1fscope:safety")
    if claim is None:
        raise PublishError(f"SAFETY_NOT_SAFE: missing frozen scope:safety claim: {work_id}")
    if (
        claim.get("decision") != "accepted"
        or claim.get("state") != "known"
        or claim.get("value") != "in-scope-japanese-manga"
        or claim.get("reviewedByHuman") != "false"
        or claim.get("candidateOnly") != "true"
    ):
        raise PublishError(f"SAFETY_NOT_SAFE: invalid frozen scope:safety claim: {work_id}")
    packet_digest = packets.get(work_id, {}).get("_packetDigest")
    if not isinstance(packet_digest, str) or claim.get("packetDigest") != packet_digest:
        raise PublishError(f"SAFETY_NOT_SAFE: scope:safety packet manifest binding mismatch: {work_id}")
    evidence_ids = panel.split_list(
        claim.get("evidenceIds", ""), f"{work_id} scope:safety evidenceIds"
    )
    citation_urls = set(panel.split_list(
        claim.get("citationUrls", ""), f"{work_id} scope:safety citationUrls"
    ))
    if not evidence_ids or not citation_urls:
        raise PublishError(f"SAFETY_NOT_SAFE: scope:safety lacks evidence/citations: {work_id}")
    eligible = 0
    for evidence_id in evidence_ids:
        source = (
            baseline_evidence.get(evidence_id)
            or supplemental.get(evidence_id)
            or frozen_evidence.get(evidence_id)
        )
        if source is None or source.get("workId") != work_id:
            raise PublishError(
                f"SAFETY_NOT_SAFE: missing/cross-work safety evidence: {work_id} {evidence_id}"
            )
        source_url = source.get("sourceUrl", "")
        if source_url and source_url not in citation_urls:
            raise PublishError(f"SAFETY_NOT_SAFE: safety evidence URL is not cited: {work_id} {evidence_id}")
        try:
            normalized_type = _source_type(source.get("sourceType", ""))
        except PublishError as error:
            raise PublishError(
                f"SAFETY_NOT_SAFE: unsupported safety evidence source: {work_id} {evidence_id}"
            ) from error
        if normalized_type == "model":
            continue
        text = " ".join(
            str(source.get(field, "")) for field in ("notes", "observation", "limitation")
        ) + " " + " ".join(
            str(claim.get(field, "")) for field in ("observation", "limitation")
        )
        if SAFETY_POSITIVE_RE.search(text):
            eligible += 1
    if eligible < 1:
        raise PublishError(
            f"SAFETY_NOT_SAFE: no affirmative non-model work-owned safety evidence: {work_id}"
        )


def _build_plan(
    rows: list[dict[str, str]],
    promotion: dict[str, dict[str, str]],
    contexts: dict[str, dict[str, str]],
    supplemental: dict[str, dict[str, str]],
    frozen_evidence: dict[str, dict[str, str]],
    baseline: dict[str, object],
    reviewed_at: str,
    review_reference: str,
    *,
    packets: dict[str, dict[str, object]] | None = None,
    chunk_digests: dict[str, str] | None = None,
    registry: dict[str, object] | None = None,
    gold_ids: set[str] | None = None,
    prior: dict[str, dict[str, str]] | None = None,
) -> dict[str, object]:
    works: dict[str, dict[str, str]] = baseline["works"]  # type: ignore[assignment]
    factors: dict[tuple[str, str], dict[str, str]] = baseline["factors"]  # type: ignore[assignment]
    themes: dict[tuple[str, str], dict[str, str]] = baseline["themes"]  # type: ignore[assignment]
    evidence: dict[str, dict[str, str]] = baseline["evidence"]  # type: ignore[assignment]
    existing_contexts: dict[str, list[dict[str, object]]] = baseline["contexts"]  # type: ignore[assignment]
    volumes: dict[str, int] = baseline["volumes"]  # type: ignore[assignment]
    target_ids = set(promotion)
    packets = packets or {}
    chunk_digests = chunk_digests or {}
    prior = prior or {}
    if gold_ids is not None and target_ids & gold_ids:
        raise PublishError(f"panel targets overlap immutable Gold Set: {sorted(target_ids & gold_ids)[:5]}")
    if packets:
        _validate_packet_baseline_binding(packets, baseline, registry)
    if not REVIEW_REFERENCE_RE.fullmatch(review_reference):
        raise PublishError(f"invalid annotation review reference: {review_reference}")
    _iso(reviewed_at, "reviewed-at")
    claim_rows = sorted((row for row in rows if row["decision"] == "accepted"), key=lambda row: (row["workId"], row["factKey"]))
    factor_updates: list[dict[str, str]] = []
    theme_inserts: list[dict[str, str]] = []
    genre_updates: dict[str, str] = {}
    work_updates: list[dict[str, str]] = []
    context_inserts: list[dict[str, str]] = []
    evidence_updates: dict[str, dict[str, str]] = {}
    evidence_normalizations: dict[str, dict[str, str]] = {}
    legacy_pass_ids = {
        work_id
        for work_id, work in works.items()
        if work.get("annotationReviewMethod") == "authorizedEvidencePanel"
        and work.get("recommendationEligible") == "true"
        and work.get("libraryOnly") == "false"
        and work.get("onboardingEligible") != "true"
        and (gold_ids is None or work_id not in gold_ids)
    }
    used_claims: list[tuple[dict[str, str], str]] = []
    for evidence_id, existing in evidence.items():
        normalised = _normalise_existing_evidence(existing)
        if normalised is not None:
            evidence_normalizations[evidence_id] = normalised
    for row in claim_rows:
        kind, name = panel.fact_kind(row["factKey"])
        work_id = row["workId"]
        if work_id not in target_ids or work_id not in works:
            raise PublishError(f"accepted claim references unknown target work: {work_id}")
        claim_id = _claim_evidence_id(row)
        if kind == "axis":
            current = factors.get((work_id, name))
            if current is None:
                raise PublishError(f"panel axis absent from baseline: {work_id} {name}")
            if current["state"] == "unknown":
                factor_updates.append({"workId": work_id, "axisId": name, "state": row["state"], "value": row["value"], "confidence": row["confidence"] if row["state"] == "known" else "", "evidenceId": claim_id})
                factors[(work_id, name)] = {**current, "state": row["state"], "value": row["value"], "confidence": row["confidence"] if row["state"] == "known" else "", "evidenceId": claim_id}
                used_claims.append((row, claim_id))
            elif (current["state"], current["value"]) != (row["state"], row["value"]):
                raise PublishError(f"accepted baseline axis conflict: {work_id} {name}")
        elif kind == "theme":
            current = themes.get((work_id, name))
            if current is None:
                theme_inserts.append({"workId": work_id, "themeId": name, "centrality": row["value"], "confidence": row["confidence"], "evidenceId": claim_id})
                themes[(work_id, name)] = {"workId": work_id, "themeId": name, "centrality": row["value"], "confidence": row["confidence"], "evidenceId": claim_id}
                used_claims.append((row, claim_id))
            elif current["centrality"] != row["value"]:
                raise PublishError(f"accepted baseline theme conflict: {work_id} {name}")
        elif row["value"] == "true":
            current = [item for item in works[work_id]["genres"].split(";") if item]
            if name not in current:
                current.append(name)
                genre_updates[work_id] = ";".join(current)
                works[work_id] = {**works[work_id], "genres": genre_updates[work_id]}
                used_claims.append((row, claim_id))

    for work_id, panel_promotion in sorted(promotion.items()):
        if work_id not in works:
            raise PublishError(f"panel promotion references unknown baseline work: {work_id}")
        if panel_promotion["panelOutcome"] == "BLOCKED":
            current = baseline["works"][work_id]  # type: ignore[index]
            if current["recommendationEligible"] != "false" or current["libraryOnly"] != "true":
                raise PublishError(f"BLOCKED baseline eligibility drift: {work_id}")

    for work_id in sorted(target_ids):
        panel_promotion = promotion[work_id]
        if panel_promotion["panelOutcome"] != "PASS":
            continue
        _validate_safety_gate(work_id, prior, frozen_evidence, supplemental, evidence, packets)
        if len(existing_contexts.get(work_id, [])) > 1:
            raise PublishError(f"baseline has duplicate recommendation contexts: {work_id}")
        blockers = _coverage(work_id, factors, themes, works)
        if blockers:
            raise PublishError(f"prospective DB remains blocked for panel PASS: {work_id}: {';'.join(blockers)}")
        current_work = baseline["works"][work_id]  # type: ignore[index]
        if current_work["recommendationEligible"] == "true" and current_work["libraryOnly"] == "true":
            raise PublishError(f"baseline eligibility conflict: {work_id}")
        work_updates.append({"id": work_id, "annotationReviewedAt": reviewed_at, "annotationReviewReference": review_reference})
        if not existing_contexts.get(work_id):
            context = contexts[work_id]
            context_ids = panel.split_list(context["evidenceIds"], f"{work_id} context evidenceIds")
            context_urls = panel.split_list(context["citationUrls"], f"{work_id} context citationUrls")
            packet = packets.get(work_id)
            if packet is None:
                raise PublishError(f"frozen packet missing for context: {work_id}")
            packet_context_id = packet.get("contextEvidenceId")
            packet_support = packet.get("supportEvidenceUrls")
            if not isinstance(packet_context_id, str) or context_ids != [packet_context_id]:
                raise PublishError(f"context evidence ID does not match frozen packet: {work_id}")
            if not isinstance(packet_support, list) or not set(context_urls) <= {str(url) for url in packet_support}:
                raise PublishError(f"context citation URL exceeds frozen packet supportEvidenceUrls: {work_id}")
            context_sources: list[dict[str, str]] = []
            for evidence_id in context_ids:
                source = evidence.get(evidence_id) or frozen_evidence.get(evidence_id) or supplemental.get(evidence_id)
                if source is None or source.get("workId") != work_id:
                    raise PublishError(f"missing or cross-work context evidence: {work_id} {evidence_id}")
                if source.get("sourceUrl", "") and source.get("sourceUrl") not in set(context_urls):
                    raise PublishError(f"context evidence URL is outside cited support URLs: {work_id}")
                context_sources.append(source)
            digest = chunk_digests.get(work_id)
            if not digest:
                raise PublishError(f"missing frozen chunk digest for context: {work_id}")
            context_binding = dict(context)
            context_binding["authorityKind"] = AUTHORITY_KIND
            context_binding["authorityArtifactDigest"] = digest
            context_binding["citationSetDigest"] = panel.citation_digest(context_urls)
            context_binding["candidateOnly"] = "true"
            context_binding["reviewedByHuman"] = "false"
            context_binding["decision"] = "accepted"
            context_binding["factKey"] = "work:recommendationContext"
            context_binding["entryScope"] = "entry_1_3_volumes"
            for evidence_id in context_ids:
                source = context_sources[context_ids.index(evidence_id)]
                if evidence_id in evidence:
                    original = evidence[evidence_id]
                    raw_type = original.get("sourceType", "")
                    normalised = _source_type(raw_type)
                    binding = _binding_notes(
                        context_binding,
                        evidence_id=evidence_id,
                        source_kind=raw_type,
                        context=True,
                        authority_artifact_digest=digest,
                        citation_set_digest=context_binding["citationSetDigest"],
                    )
                    notes = original.get("notes", "")
                    merged_notes = notes if binding in notes else f"{notes}\n{binding}"
                    update = {"id": evidence_id, "sourceType": normalised, "notes": merged_notes}
                    evidence_updates[evidence_id] = update
                else:
                    # The context evidence ID may carry one source URL while
                    # supportEvidenceUrls lists several independent award/
                    # cohort pages.  Keep that source URL and bind the full
                    # cited set in the deterministic notes, rather than
                    # fabricating one source row per URL.
                    new_row = _context_evidence_row(
                        context_binding,
                        evidence_id,
                        source,
                        authority_artifact_digest=digest,
                    )
                    evidence_updates.pop(evidence_id, None)
                    context_sources[context_ids.index(evidence_id)] = new_row
            context_inserts.append({"workId": work_id, "catalogRole": "discovery", "seriesGroupId": "", "volumeCount": str(volumes.get(work_id, 0)), "reviewAverage": "", "reviewCount": ""})

    used_ids = {evidence_id for row, _claim_id in used_claims for evidence_id in panel.split_list(row["evidenceIds"], f"{row['workId']} evidenceIds")}
    for work_id in sorted(target_ids):
        if promotion[work_id]["panelOutcome"] != "PASS" or existing_contexts.get(work_id):
            continue
        used_ids.update(panel.split_list(contexts[work_id]["evidenceIds"], f"{work_id} context evidenceIds"))
    new_evidence: dict[str, dict[str, str]] = {}
    for evidence_id in sorted(used_ids):
        if evidence_id in evidence:
            continue
        source = supplemental.get(evidence_id) or frozen_evidence.get(evidence_id)
        if source is None:
            raise PublishError(f"accepted claim/context evidence is not frozen: {evidence_id}")
        stored_evidence_id = _canonical_evidence_id(evidence_id)
        if stored_evidence_id in evidence:
            raise PublishError(
                f"canonical evidence ID collides with existing row: {evidence_id} -> {stored_evidence_id}"
            )
        if stored_evidence_id in new_evidence:
            raise PublishError(f"canonical evidence ID collision: {evidence_id} -> {stored_evidence_id}")
        owner_rows = [row for row, _claim_id in used_claims if evidence_id in panel.split_list(row["evidenceIds"], f"{row['workId']} evidenceIds")]
        owner = owner_rows[0] if owner_rows else next(row for row in contexts.values() if evidence_id in panel.split_list(row["evidenceIds"], "context evidenceIds"))
        if not owner_rows:
            owner_work = owner["workId"]
            digest = chunk_digests.get(owner_work)
            if not digest:
                raise PublishError(f"missing frozen chunk digest for context: {owner_work}")
            new_evidence[stored_evidence_id] = _context_evidence_row(
                owner,
                stored_evidence_id,
                source,
                authority_artifact_digest=digest,
                original_evidence_id=evidence_id,
            )
        else:
            new_evidence[stored_evidence_id] = _evidence_row(
                stored_evidence_id,
                source,
                panel_row=owner,
                original_evidence_id=evidence_id,
            )
    for row, claim_id in used_claims:
        if claim_id in evidence:
            raise PublishError(f"claim evidence id collision: {claim_id}")
        ids = panel.split_list(row["evidenceIds"], f"{row['workId']} evidenceIds")
        sources = [supplemental.get(evidence_id) or frozen_evidence.get(evidence_id) or evidence.get(evidence_id) for evidence_id in ids]
        source = next((item for item in sources if item), None)
        if source is None:
            raise PublishError(f"claim has no source evidence: {row['workId']} {row['factKey']}")
        claim_source = dict(source)
        claim_source["sourceUrl"] = sorted(panel.split_list(row["citationUrls"], f"{row['workId']} citationUrls"))[0]
        new_evidence[claim_id] = _evidence_row(claim_id, claim_source, panel_row=row)
    return {
        "factorUpdates": factor_updates,
        "themeInserts": theme_inserts,
        "genreUpdates": genre_updates,
        "workUpdates": work_updates,
        "contextInserts": context_inserts,
        "newEvidence": new_evidence,
        "evidenceUpdates": evidence_updates,
        "evidenceNormalizations": evidence_normalizations,
        "legacyPassIds": sorted(legacy_pass_ids),
        "targetIds": sorted(target_ids),
        "blockedIds": sorted(work_id for work_id, item in promotion.items() if item["panelOutcome"] != "PASS"),
        "passIds": sorted(work_id for work_id, item in promotion.items() if item["panelOutcome"] == "PASS"),
        "acceptedClaimCount": len(claim_rows),
        "changedClaimCount": len(used_claims),
    }


def apply_plan_in_transaction(con: sqlite3.Connection, plan: dict[str, object]) -> None:
    """Apply validated rows on the caller's open transaction; never commit here."""
    if not con.in_transaction:
        raise PublishError("plan application requires a caller-owned transaction")
    evidence_rows: dict[str, dict[str, str]] = plan["newEvidence"]  # type: ignore[assignment]
    next_evidence = con.execute("select coalesce(max(sourceOrdinal),0)+1 from source_evidence").fetchone()[0]
    next_line = con.execute("select coalesce(max(sourceLine),1)+1 from source_evidence").fetchone()[0]
    for evidence_id in sorted(evidence_rows):
        row = evidence_rows[evidence_id]
        con.execute(
            "insert into source_evidence values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (next_evidence, next_line, row["id"], row["workId"], row["targetType"], row["targetId"], row["sourceType"], row["sourceUrl"], row["fetchedAt"], row["extractorVersion"], row["reviewedByHuman"], row["confidence"], row["notes"]),
        )
        next_evidence += 1
        next_line += 1
    normalizations: dict[str, dict[str, str]] = plan.get("evidenceNormalizations", {})  # type: ignore[assignment]
    for evidence_id in sorted(normalizations):
        row = normalizations[evidence_id]
        con.execute(
            "update source_evidence set sourceType=?,notes=? where id=?",
            (row["sourceType"], row["notes"], evidence_id),
        )
    updates: dict[str, dict[str, str]] = plan.get("evidenceUpdates", {})  # type: ignore[assignment]
    for evidence_id in sorted(updates):
        row = updates[evidence_id]
        con.execute(
            "update source_evidence set sourceType=?,notes=? where id=?",
            (row["sourceType"], row["notes"], evidence_id),
        )
    for row in plan["factorUpdates"]:  # type: ignore[union-attr]
        cur = con.execute("update source_factors set state=?,value=?,confidence=?,evidenceId=? where workId=? and axisId=? and state='unknown'", (row["state"], row["value"], row["confidence"], row["evidenceId"], row["workId"], row["axisId"]))
        if cur.rowcount != 1:
            raise PublishError(f"factor update lost unknown row: {row['workId']} {row['axisId']}")
    next_theme = con.execute("select coalesce(max(sourceOrdinal),0)+1 from source_themes").fetchone()[0]
    next_theme_line = con.execute("select coalesce(max(sourceLine),1)+1 from source_themes").fetchone()[0]
    for row in plan["themeInserts"]:  # type: ignore[union-attr]
        con.execute("insert into source_themes values(?,?,?,?,?,?,?)", (next_theme, next_theme_line, row["workId"], row["themeId"], row["centrality"], row["confidence"], row["evidenceId"]))
        next_theme += 1
        next_theme_line += 1
    for work_id, genres in sorted(plan["genreUpdates"].items()):  # type: ignore[union-attr]
        con.execute("update source_works set genres=? where id=?", (genres, work_id))
    next_context = con.execute("select coalesce(max(sourceOrdinal),0)+1 from source_recommendation_context").fetchone()[0]
    next_context_line = con.execute("select coalesce(max(sourceLine),1)+1 from source_recommendation_context").fetchone()[0]
    for row in plan["contextInserts"]:  # type: ignore[union-attr]
        con.execute("insert into source_recommendation_context values(?,?,?,?,?,?,?,?)", (next_context, next_context_line, row["workId"], row["catalogRole"], row["seriesGroupId"], row["volumeCount"], row["reviewAverage"], row["reviewCount"]))
        next_context += 1
        next_context_line += 1
    for row in plan["workUpdates"]:  # type: ignore[union-attr]
        cur = con.execute("update source_works set onboardingEligible='true',recommendationEligible='true',libraryOnly='false',annotationReviewMethod='authorizedEvidencePanel',annotationReviewedAt=?,annotationReviewReference=? where id=?", (row["annotationReviewedAt"], row["annotationReviewReference"], row["id"]))
        if cur.rowcount != 1:
            raise PublishError(f"work update lost row: {row['id']}")
    for work_id in plan.get("legacyPassIds", []):  # type: ignore[union-attr]
        cur = con.execute(
            "update source_works set onboardingEligible='true' where id=? and annotationReviewMethod='authorizedEvidencePanel' and recommendationEligible='true' and libraryOnly='false'",
            (work_id,),
        )
        if cur.rowcount != 1:
            raise PublishError(f"legacy PASS eligibility repair lost row: {work_id}")


def verify_expected_after(con: sqlite3.Connection, before: dict, plan: dict, gold_ids: set[str]) -> None:
    if not con.in_transaction:
        raise PublishError("expected-after verification requires a caller-owned transaction")
    _verify_preservation(before, con, plan, gold_ids)
    if con.execute("pragma integrity_check").fetchone()[0] != "ok" or con.execute("pragma foreign_key_check").fetchall():
        raise PublishError("published candidate SQLite integrity failure")


def _apply_plan(db_path: Path, plan: dict[str, object], *, before: dict | None = None, gold_ids: set[str] | None = None) -> None:
    """Standalone compatibility entry point owns exactly one transaction."""
    con = sqlite3.connect(db_path)
    try:
        con.execute("pragma journal_mode=DELETE")
        con.execute("begin immediate")
        current = _snapshot_db(con)
        if before is not None and current != before:
            raise PublishError("candidate changed after current-state planning")
        apply_plan_in_transaction(con, plan)
        verify_expected_after(con, current, plan, gold_ids or set())
        con.commit()
    except BaseException:
        con.rollback()
        raise
    finally:
        con.close()


def _verify_db(path: Path) -> None:
    if sidecars(path):
        raise PublishError(f"published candidate has journal sidecars: {sidecars(path)}")
    con = sqlite3.connect(_db_uri(path), uri=True)
    try:
        if con.execute("pragma integrity_check").fetchone()[0] != "ok":
            raise PublishError("published candidate integrity_check failed")
        if con.execute("pragma foreign_key_check").fetchall():
            raise PublishError("published candidate foreign_key_check failed")
        _validate_schema(con, "published candidate")
    finally:
        con.close()


def _manifest(root: Path, output: Path) -> None:
    files = sorted(
        (
            path
            for path in root.rglob("*")
            if path.is_file() and path != output and not path.is_symlink()
        ),
        key=lambda path: path.relative_to(root).as_posix(),
    )
    lines = [
        f"{sha256(path)}  {path.relative_to(root).as_posix()}"
        for path in files
    ]
    output.write_text("\n".join(lines) + "\n", encoding="ascii", newline="\n")
    _manifest_entries(root, output)


def _review_references(snapshot: dict[str, tuple[tuple[str, ...], tuple[tuple[object, ...], ...]]]) -> set[str]:
    columns, rows = snapshot["source_works"]
    reference_index = columns.index("annotationReviewReference")
    return {
        str(row[reference_index])
        for row in rows
        if str(row[reference_index])
    }


def _find_review_source(
    reference: str,
    *,
    input_root: Path,
    result_root: Path,
    baseline_db: Path,
) -> Path | None:
    """Resolve a pre-existing review artifact without scanning unrelated data."""

    relative = Path("data") / "source" / reference
    candidates = [
        _find_repo_file(relative),
        result_root / Path(reference).name,
        result_root.parent / Path(reference).name,
        baseline_db.parent / Path(reference).name,
        input_root.parent / Path(reference).name,
    ]
    for candidate in candidates:
        if candidate is not None and candidate.is_file() and not candidate.is_symlink():
            return candidate.resolve()
    return None


def _prepare_review_artifacts(
    artifact_root: Path,
    *,
    input_root: Path,
    result_root: Path,
    baseline_db: Path,
    baseline_snapshot: dict[str, tuple[tuple[str, ...], tuple[tuple[object, ...], ...]]],
    prepared: dict[str, object],
    plan: dict[str, object],
    baseline_sha: str,
    reviewed_at: str,
    review_reference: str,
    reuse_reviews: dict[str, str] | None = None,
) -> dict[str, object]:
    """Copy referenced legacy reviews and create the current review artifact.

    Review references are consumed by the Catalog loader relative to
    ``data/source``.  All referenced files therefore live beneath the preserved
    artifact root at ``data/source/<reference>`` and are included in its
    deterministic manifest.
    """

    if not REVIEW_REFERENCE_RE.fullmatch(review_reference):
        raise PublishError(f"invalid annotation review reference: {review_reference}")
    refs = _review_references(baseline_snapshot)
    refs.add(review_reference)
    review_root = artifact_root / "data" / "source"
    copied: dict[str, str] = {}
    for reference in sorted(refs):
        destination = review_root / reference
        destination.parent.mkdir(parents=True, exist_ok=True)
        if reuse_reviews is not None and reference in reuse_reviews:
            if not destination.is_file() or sha256(destination) != reuse_reviews[reference]:
                raise PublishError(f"previously verified review changed: {reference}")
            copied[reference] = reuse_reviews[reference]
            continue
        if reference == review_reference and reference not in _review_references(baseline_snapshot):
            continue
        source = _find_review_source(
            reference, input_root=input_root, result_root=result_root,
            baseline_db=baseline_db,
        )
        if source is None:
            raise PublishError(f"review artifact referenced by baseline is missing: {reference}")
        shutil.copy2(source, destination)
        copied[reference] = sha256(destination)

    if review_reference not in copied:
        # The current panel's review record is deliberately deterministic: it
        # records the frozen input/result identities and counts, without
        # inventing human review or model agreement.
        result_summary = prepared.get("panelResult", {})
        lines = [
            "# Authorized evidence panel follow-up review",
            "",
            f"- schema: authorizedEvidencePanelV1",
            f"- reviewedAt: {reviewed_at}",
            f"- baselineSha256: {baseline_sha}",
            f"- inputManifestSha256: {prepared['inputManifestSha256']}",
            f"- targetCount: {prepared['targetCount']}",
            f"- panelPassCount: {result_summary.get('passCount', 0)}",
            f"- panelBlockedCount: {result_summary.get('blockedCount', 0)}",
            f"- acceptedClaimCount: {plan['acceptedClaimCount']}",
            f"- changedClaimCount: {plan['changedClaimCount']}",
            f"- legacyEligibilityRepairs: {len(plan.get('legacyPassIds', []))}",
            f"- sourceTypeNormalizations: {len(plan.get('evidenceNormalizations', {}))}",
            "- candidateOnly: true",
            "- reviewedByHuman: false",
            "",
            "This artifact records the validated authorized-evidence-panel boundary; it is not human review.",
            "",
        ]
        destination = review_root / review_reference
        destination.parent.mkdir(parents=True, exist_ok=True)
        body = "\n".join(lines).encode("utf-8")
        if destination.exists() and destination.read_bytes() != body:
            raise PublishError(f"current review changed on resume: {review_reference}")
        if not destination.exists():
            destination.write_bytes(body)
        copied[review_reference] = sha256(destination)
    for reference in sorted(refs):
        destination = review_root / reference
        if not destination.is_file() or destination.is_symlink():
            raise PublishError(f"review artifact was not preserved: {reference}")
        if reference not in copied:
            copied[reference] = sha256(destination)
    return {
        "reviewReferences": sorted(copied),
        "reviewArtifacts": {key: copied[key] for key in sorted(copied)},
        "reviewArtifactPath": f"data/source/{review_reference}",
        "reviewArtifactSha256": copied[review_reference],
    }


def _write_promotion_ledger(path: Path, promotion: dict[str, dict[str, str]]) -> None:
    """Write one deterministic aggregate promotion ledger for the batch."""

    if path.exists():
        raise PublishError(f"promotion ledger already exists; refusing overwrite: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=panel.PROMOTION_FIELDS, lineterminator="\n")
        writer.writeheader()
        for work_id in sorted(promotion):
            writer.writerow({field: promotion[work_id][field] for field in panel.PROMOTION_FIELDS})


def _write_reports(
    parent: Path,
    plan: dict[str, object],
    baseline_sha: str,
    output_db: Path,
    artifact_root: Path,
) -> tuple[Path, Path, Path]:
    diff = parent / "catalog-diff.md"
    report = parent / "validation-report.md"
    manifest = parent / "MANIFEST.sha256"
    if any(path.exists() for path in (diff, report, manifest)):
        raise PublishError("output report already exists; refusing overwrite")
    changed_factors = plan["factorUpdates"]
    changed_themes = plan["themeInserts"]
    changed_genres = plan["genreUpdates"]
    changed_contexts = plan["contextInserts"]
    diff.write_text(
        "# Authorized follow-up catalog diff\n\n"
        f"- Accepted panel claims inspected: {plan['acceptedClaimCount']}\n"
        f"- Source facts changed: {plan['changedClaimCount']}\n"
        f"- New source evidence rows: {len(plan['newEvidence'])}\n"
        f"- Factor updates: {len(changed_factors)}\n"
        f"- Theme inserts: {len(changed_themes)}\n"
        f"- Genre memberships added: {len(changed_genres)}\n"
        f"- Recommendation contexts added: {len(changed_contexts)}\n\n"
        "Only panel-accepted values were applied. Existing accepted facts, non-target works, Gold Set rows, volumes, and registry are preserved. BLOCKED_FACTOR works remain libraryOnly.\n",
        encoding="utf-8",
        newline="\n",
    )
    report.write_text(
        "# Authorized follow-up publisher validation report\n\n"
        "- Result: **PASS**\n"
        f"- Baseline SHA-256: `{baseline_sha}`\n"
        f"- Candidate SHA-256: `{sha256(output_db)}`\n"
        f"- Panel artifacts: `{artifact_root.name}`\n"
        f"- Accepted panel claims: {plan['acceptedClaimCount']}\n"
        f"- Changed facts: {plan['changedClaimCount']}\n"
        "- `annotationReviewMethod=authorizedEvidencePanel` for panel PASS works\n"
        "- `reviewedByHuman=false`; `candidateOnly=true`\n"
        f"- Legacy authorized-panel eligibility repairs: {len(plan.get('legacyPassIds', []))}\n"
        f"- Existing sourceType normalizations: {len(plan.get('evidenceNormalizations', {}))}\n"
        "- SQLite integrity/FK: PASS; WAL/SHM/journal: absent\n",
        encoding="utf-8",
        newline="\n",
    )
    _manifest(parent, manifest)
    return diff, report, manifest


def verify_immutable(input_root: Path, result_root: Path) -> dict:
    """Verify frozen inputs and decisions; this does not certify current DB compatibility."""
    try:
        panel_input, chunks, input_digest = panel.validate_input(input_root)
    except (OSError, panel.ValidationError, ValueError) as error:
        raise PublishError(f"frozen panel input validation failed: {error}") from error
    target_ids, target_chunks, contexts, supplemental, prior, frozen, packets = _load_frozen(chunks)
    rows, promotion, output_chunks, result_summary = _load_panel(input_root, result_root, chunks)
    if set(promotion) != target_ids or set(output_chunks) != target_ids:
        raise PublishError("panel outputs do not cover exact frozen target works")
    return {"panelInput": panel_input, "chunks": chunks, "inputManifestSha256": input_digest,
            "targetIds": target_ids, "targetChunks": target_chunks, "contexts": contexts,
            "supplemental": supplemental, "prior": prior, "frozen": frozen, "packets": packets,
            "rows": rows, "promotion": promotion, "panelResult": result_summary}


def plan_against_current(con: sqlite3.Connection, verified: dict, registry: dict | None,
                         reviewed_at: str, review_reference: str, gold_ids: set[str], *,
                         baseline_snapshot: dict | None = None) -> tuple[dict, dict, dict]:
    if not con.in_transaction:
        raise PublishError("current-state planning requires a caller-owned transaction")
    baseline = _baseline_facts(con) if baseline_snapshot is None else _baseline_facts_from_snapshot(baseline_snapshot)
    chunk_digests = {wid: sha256(chunk / "CHUNK.sha256") for wid, chunk in verified["targetChunks"].items()}
    plan = _build_plan(verified["rows"], verified["promotion"], verified["contexts"], verified["supplemental"],
                       verified["frozen"], baseline, reviewed_at, review_reference,
                       packets=verified["packets"], chunk_digests=chunk_digests, registry=registry,
                       gold_ids=gold_ids, prior=verified["prior"])
    return plan, baseline, chunk_digests


def preflight(
    input_root: Path,
    result_root: Path,
    baseline_db: Path,
    registry_db: Path | None,
    reviewed_at: str,
    review_reference: str,
    gold_manifest: Path | None = None,
    registry_slice: Path | None = None,
) -> tuple[dict[str, object], dict[str, object]]:
    input_root = input_root.resolve()
    result_root = result_root.resolve()
    baseline_db = baseline_db.resolve()
    verified = verify_immutable(input_root, result_root)
    panel_input, input_digest = verified["panelInput"], verified["inputManifestSha256"]
    target_ids, target_chunks = verified["targetIds"], verified["targetChunks"]
    packets, contexts, rows = verified["packets"], verified["contexts"], verified["rows"]
    promotion, result_summary = verified["promotion"], verified["panelResult"]
    baseline_meta = ensure_baseline(baseline_db)
    registry_meta = ensure_registry(registry_db, target_ids, str(baseline_meta["sha256"])) if registry_db else None
    if registry_meta is not None:
        registry_meta = _bind_frozen_registry(input_root, target_ids, registry_meta, registry_slice)
    gold_ids = _load_gold_ids(gold_manifest)
    alias_audit = _validate_alias_boundary(baseline_db, gold_manifest, gold_ids)
    con = sqlite3.connect(_db_uri(baseline_db), uri=True)
    try:
        con.execute("begin")
        plan, baseline, chunk_digests = plan_against_current(con, verified, registry_meta, reviewed_at, review_reference, gold_ids)
        baseline_snapshot = _snapshot_db(con)
    finally:
        con.close()
    before = sha256(baseline_db)
    if before != baseline_meta["sha256"]:
        raise PublishError("baseline hash changed during read-only preflight")
    return {
        "panelInput": panel_input,
        "inputManifestSha256": input_digest,
        "targetCount": len(target_ids),
        "panelResult": result_summary,
        "baseline": baseline_meta,
        "registry": registry_meta,
        "targetChunks": target_chunks,
        "chunkDigests": chunk_digests,
        "packets": packets,
        "goldIds": sorted(gold_ids),
        "aliasAudit": alias_audit,
        "contexts": contexts,
        "rows": rows,
        "promotion": promotion,
        "baselineFacts": baseline,
        "baselineSnapshot": baseline_snapshot,
    }, plan


def finalize_projection(input_root: Path, result_root: Path, baseline_db: Path, output_db: Path,
                        db_tmp: Path, prepared: dict, plan: dict, reviewed_at: str,
                        review_reference: str, registry_slice: Path | None = None) -> dict[str, object]:
    """Emit the existing full publication layout after transaction verification."""
    artifact_root = output_db.parent / "authorized-evidence-panel-v1"
    artifact_tmp = artifact_root.with_name(f".{artifact_root.name}.tmp")
    promotion_path = output_db.parent / "promotion-ledger.csv"
    promotion_tmp = output_db.parent / ".promotion-ledger.csv.tmp"
    before = prepared["baseline"]["sha256"]
    shutil.copytree(
        input_root,
        artifact_tmp / "input" / "followup-panel-input-v1",
        symlinks=False,
    )
    if registry_slice is not None:
        registry_copy = artifact_tmp / "input" / "registry-correction" / "source-registry.csv"
        registry_copy.parent.mkdir(parents=True)
        shutil.copy2(registry_slice, registry_copy)
        if sha256(registry_copy) != prepared["registry"]["frozenSliceSha256"]:
            raise PublishError("registry correction changed after preflight")
    shutil.copytree(
        result_root,
        artifact_tmp / "result" / "followup-panel-output-v1",
        symlinks=False,
    )
    for path in artifact_tmp.rglob("*"):
        if path.is_symlink():
            raise PublishError(f"panel artifact contains symlink: {path}")
    review_info = _prepare_review_artifacts(
        artifact_tmp,
        input_root=input_root,
        result_root=result_root,
        baseline_db=baseline_db,
        baseline_snapshot=prepared["baselineSnapshot"],  # type: ignore[arg-type]
        prepared=prepared,
        plan=plan,
        baseline_sha=before,
        reviewed_at=reviewed_at,
        review_reference=review_reference,
    )
    artifact_report = artifact_tmp / "PUBLISHER-INPUT.json"
    artifact_report.write_text(
        json.dumps(
            {
                "baselineSha256": before,
                "inputManifestSha256": prepared["inputManifestSha256"],
                "targetCount": prepared["targetCount"],
                "reviewedAt": reviewed_at,
                "reviewReference": review_reference,
                "registryBaselineSha256": (
                    prepared["registry"].get("baselineSha256")
                    if prepared.get("registry") is not None else None
                ),
                "registryBaselineMatchesInput": (
                    prepared["registry"].get("baselineMatchesInput")
                    if prepared.get("registry") is not None else None
                ),
                "registrySliceSha256": (
                    prepared["registry"].get("frozenSliceSha256")
                    if prepared.get("registry") is not None else None
                ),
                **review_info,
            },
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        ) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    _write_promotion_ledger(promotion_tmp, prepared["promotion"])  # type: ignore[arg-type]
    os.replace(db_tmp, output_db)
    os.replace(artifact_tmp, artifact_root)
    os.replace(promotion_tmp, promotion_path)
    _write_reports(output_db.parent, plan, before, output_db, artifact_root)
    _verify_db(output_db)
    _verify_preservation(
        prepared["baselineSnapshot"],  # type: ignore[arg-type]
        output_db,
        plan,
        set(prepared["goldIds"]),  # type: ignore[arg-type]
    )
    return {
        "status": "PUBLISHED",
        "outputDb": str(output_db),
        "outputSha256": sha256(output_db),
        "artifactRoot": str(artifact_root),
        "acceptedClaimCount": plan["acceptedClaimCount"],
        "changedClaimCount": plan["changedClaimCount"],
        "targetCount": prepared["targetCount"],
    }


def publish(
    input_root: Path,
    result_root: Path,
    baseline_db: Path,
    output_db: Path,
    registry_db: Path | None = None,
    *,
    reviewed_at: str = "2026-09-02T00:00:00+09:00",
    review_reference: str = "reviews/authorized-evidence-panel-v1-batch-001.md",
    gold_manifest: Path | None = None,
    registry_slice: Path | None = None,
) -> dict[str, object]:
    input_root = input_root.resolve()
    result_root = result_root.resolve()
    baseline_db = baseline_db.resolve()
    output_db = output_db.resolve()
    if output_db.exists():
        raise PublishError(f"output already exists; refusing overwrite: {output_db}")
    if output_db == baseline_db:
        raise PublishError("output must not equal baseline DB")
    repo_catalog = _find_repo_catalog()
    if repo_catalog is not None and output_db == repo_catalog:
        raise PublishError("output must not equal repository data/source/catalog.sqlite")
    if output_db == input_root or input_root in output_db.parents:
        raise PublishError("output must be outside frozen input root")
    if output_db == result_root or result_root in output_db.parents:
        raise PublishError("output must be outside panel result root")
    artifact_root = output_db.parent / "authorized-evidence-panel-v1"
    if artifact_root.exists():
        raise PublishError(f"artifact output already exists; refusing overwrite: {artifact_root}")
    if result_root == artifact_root or result_root in artifact_root.parents or artifact_root in result_root.parents:
        raise PublishError("artifact output would recurse into panel result root")
    before = sha256(baseline_db) if baseline_db.is_file() else ""
    prepared, plan = preflight(
        input_root, result_root, baseline_db, registry_db, reviewed_at,
        review_reference, gold_manifest, registry_slice,
    )
    if sha256(baseline_db) != before:
        raise PublishError("baseline changed during preflight")
    output_db.parent.mkdir(parents=True, exist_ok=True)
    db_tmp = output_db.with_name(f".{output_db.name}.tmp")
    artifact_tmp = artifact_root.with_name(f".{artifact_root.name}.tmp")
    promotion_path = output_db.parent / "promotion-ledger.csv"
    promotion_tmp = output_db.parent / ".promotion-ledger.csv.tmp"
    if db_tmp.exists() or artifact_tmp.exists() or promotion_tmp.exists():
        raise PublishError("temporary output already exists")
    reports = [
        output_db.parent / "catalog-diff.md",
        output_db.parent / "validation-report.md",
        output_db.parent / "MANIFEST.sha256",
        promotion_path,
    ]
    if any(path.exists() for path in reports):
        raise PublishError("output report already exists; refusing overwrite")
    published = False
    try:
        shutil.copy2(baseline_db, db_tmp)
        _apply_plan(db_tmp, plan, before=prepared["baselineSnapshot"], gold_ids=set(prepared["goldIds"]))
        _verify_db(db_tmp)
        result = finalize_projection(input_root, result_root, baseline_db, output_db, db_tmp,
                                     prepared, plan, reviewed_at, review_reference, registry_slice)
        published = True
        return result
    finally:
        for path in (db_tmp, artifact_tmp, promotion_tmp):
            if path.exists():
                if path.is_dir():
                    shutil.rmtree(path)
                else:
                    path.unlink()
        if not published:
            for path in (output_db, artifact_root, *reports):
                if path.exists():
                    if path.is_dir():
                        shutil.rmtree(path)
                    else:
                        path.unlink()


def _write_failure_report(path: Path, error: Exception) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "# Authorized follow-up publisher validation report\n\n"
        "- Result: **BLOCKED**\n"
        f"- Error: `{error}`\n\n"
        "No candidate DB was published.\n",
        encoding="utf-8",
        newline="\n",
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-root", type=Path, required=True)
    parser.add_argument("--result-root", type=Path, required=True)
    parser.add_argument("--baseline-db", type=Path, required=True)
    parser.add_argument("--registry-db", type=Path)
    parser.add_argument("--registry-slice", type=Path)
    parser.add_argument("--output-db", type=Path, required=True)
    parser.add_argument("--reviewed-at", default="2026-09-02T00:00:00+09:00")
    parser.add_argument("--review-reference", default="reviews/authorized-evidence-panel-v1-batch-001.md")
    parser.add_argument("--gold-manifest", type=Path)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args(argv)
    try:
        result = publish(
            args.input_root, args.result_root, args.baseline_db, args.output_db,
            args.registry_db, reviewed_at=args.reviewed_at,
            review_reference=args.review_reference, gold_manifest=args.gold_manifest,
            registry_slice=args.registry_slice,
        )
    except (OSError, PublishError, sqlite3.Error) as error:
        if args.report:
            _write_failure_report(args.report, error)
        print(json.dumps({"status": "BLOCKED", "error": str(error)}, ensure_ascii=False, separators=(",", ":")), file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
