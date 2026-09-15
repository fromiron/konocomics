from __future__ import annotations

import argparse
import csv
import hashlib
import importlib.util
import io
import json
import os
import shutil
import sqlite3
import subprocess
import sys
from collections import Counter
from pathlib import Path


REVIEW_REFERENCE = "reviews/authorized-evidence-panel-v1-batch-001.md"
REVIEWED_AT = "2026-09-02T12:00:00+09:00"
EXPECTED_CORRECTION_REVIEWS = (
    "review-01-02",
    "review-03-04",
    "review-05-07",
    "review-06-09",
    "review-08",
    "review-10",
)
EXPECTED_SAFETY_REVIEWS = (
    "review-01-05",
    "review-02",
    "review-03-07",
    "review-04-08",
    "review-06-09",
)
EXPECTED_FOLLOWUP_HASH_ADDENDA = ("03", "05", "07", "10")
EXPECTED_TABLES = {
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
EXPECTED_BASE_SHA = "405a31f9dc33580b5bbd5d2805cb3a4d46491a749f00558b13b41eda9b862f98"
EXPECTED_REGISTRY_SHA = "8610b7b740462f0a287f29541c858b274a8b6f0e3350283ed6e4dc4df9813e7e"
EXPECTED_CANONICAL_SHA = "78888710f280f9a10ab3f93f94c63ea80e897c4fc4cff9416c9ef33fb618f83b"
EXPECTED_CANONICAL_BLOB = "f7fb73662572f496ca3cfb701b3eeed6d1f2bd93"
EXPECTED_GOLD_SHA = "eee9030933949bd92fbb48d0a94610ed933d2aaa76d620b86fec6c4a44b18fe2"
EXPECTED_ALIAS_SHA = "c6ab3d41c96690bc979b7c7e5b93949b9ec184ea19e09d54533a0c54ae0ad289"
REINDEXED_TABLES = {
    "source_themes",
    "source_recommendation_context",
}


class IntegrationError(ValueError):
    pass


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, fields: list[str], rows: list[dict[str, object]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fields})


def run_checked(command: list[str], cwd: Path) -> str:
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True, encoding="utf-8")
    if result.returncode:
        raise IntegrationError(f"validator failed ({' '.join(command)}): {result.stdout}{result.stderr}")
    return (result.stdout + result.stderr).strip()


def verify_manifest(root: Path, manifest: Path) -> None:
    seen: set[str] = set()
    ordered: list[str] = []
    for line in manifest.read_text(encoding="utf-8-sig").splitlines():
        if not line.strip():
            continue
        expected, relative = line.split(None, 1)
        relative = relative.strip().replace("\\", "/")
        if relative in seen or relative == "MANIFEST.sha256":
            raise IntegrationError(f"invalid manifest member: {relative}")
        seen.add(relative)
        ordered.append(relative)
        target = root / Path(relative)
        if not target.is_file() or sha256(target) != expected.lower():
            raise IntegrationError(f"manifest mismatch: {relative}")
    actual = {path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file() and path != manifest}
    if ordered != sorted(ordered) or seen != actual:
        raise IntegrationError("manifest membership/order drift")


def review_verdict(data: dict[str, object]) -> str:
    for key in ("verdict", "overallVerdict", "semanticVerdict"):
        value = data.get(key)
        if isinstance(value, str):
            return value.upper()
    return ""


def validate_review_set(root: Path, names: tuple[str, ...]) -> list[dict[str, str]]:
    ledger: list[dict[str, str]] = []
    actual = {item.name for item in root.iterdir() if item.is_dir()}
    if actual != set(names):
        raise IntegrationError(f"review set drift at {root}: {sorted(actual)}")
    for name in names:
        path = root / name / "REVIEW.json"
        data = json.loads(path.read_text(encoding="utf-8-sig"))
        verdict = review_verdict(data)
        if verdict != "PASS":
            raise IntegrationError(f"review is not PASS: {path}: {verdict}")
        ledger.append({"kind": root.parent.name, "reviewId": name, "verdict": verdict, "sha256": sha256(path)})
    return ledger


def validate_correction_review_hashes(batch_root: Path, data: dict[str, object]) -> None:
    results = data.get("results", [])
    if not isinstance(results, list):
        return
    file_map = {
        "targetSha256": ("targets", "chunk-{chunk}.csv"),
        "correctionsSha256": ("results", "chunk-{chunk}", "corrections.csv"),
        "rescuedEvidenceSha256": ("results", "chunk-{chunk}", "rescued-evidence.csv"),
        "workResultsSha256": ("results", "chunk-{chunk}", "work-results.csv"),
        "manifestSha256": ("results", "chunk-{chunk}", "MANIFEST.sha256"),
    }
    root = batch_root / "initial-pass-correction-v1"
    for item in results:
        if not isinstance(item, dict) or not isinstance(item.get("chunkId"), str):
            continue
        chunk = item["chunkId"]
        for key, parts in file_map.items():
            recorded = item.get(key)
            if not isinstance(recorded, str):
                continue
            path = root.joinpath(*(part.format(chunk=chunk) for part in parts))
            if not path.is_file() or sha256(path) != recorded:
                raise IntegrationError(f"review-recorded hash mismatch: {data.get('reviewId')} {key} {path}")
    chunk = data.get("chunkId")
    result_hashes = data.get("resultHashes")
    if isinstance(chunk, str) and isinstance(result_hashes, dict):
        result_root = root / "results" / f"chunk-{chunk}"
        for filename, recorded in result_hashes.items():
            path = result_root / filename
            if not isinstance(recorded, str) or not path.is_file() or sha256(path) != recorded:
                raise IntegrationError(f"review-recorded result hash mismatch: {data.get('reviewId')} {path}")
        target_hash = data.get("targetFileSha256")
        target = root / "targets" / f"chunk-{chunk}.csv"
        if isinstance(target_hash, str) and sha256(target) != target_hash:
            raise IntegrationError(f"review-recorded target hash mismatch: {data.get('reviewId')} {target}")


def validate_followup_hash_addenda(batch_root: Path) -> list[dict[str, str]]:
    root = batch_root / "followup-review-hash-addenda"
    actual_dirs = {path.name for path in root.iterdir() if path.is_dir()}
    expected_dirs = {f"chunk-{chunk}" for chunk in EXPECTED_FOLLOWUP_HASH_ADDENDA}
    if actual_dirs != expected_dirs:
        raise IntegrationError(f"followup hash-addendum set drift: {sorted(actual_dirs)}")
    ledger: list[dict[str, str]] = []
    for chunk in EXPECTED_FOLLOWUP_HASH_ADDENDA:
        addendum = root / f"chunk-{chunk}"
        actual_files = {path.name for path in addendum.iterdir() if path.is_file()}
        if actual_files != {"REVIEW.json", "REVIEW.md", "MANIFEST.sha256"}:
            raise IntegrationError(f"followup hash-addendum file set drift: chunk-{chunk}")
        manifest_entries: dict[str, str] = {}
        for line in (addendum / "MANIFEST.sha256").read_text(encoding="utf-8-sig").splitlines():
            digest, name = line.split(None, 1)
            manifest_entries[name.strip()] = digest.lower()
        expected_manifest = {
            "REVIEW.json": sha256(addendum / "REVIEW.json"),
            "REVIEW.md": sha256(addendum / "REVIEW.md"),
        }
        if manifest_entries != expected_manifest:
            raise IntegrationError(f"followup hash-addendum manifest drift: chunk-{chunk}")
        data = json.loads((addendum / "REVIEW.json").read_text(encoding="utf-8-sig"))
        if (
            data.get("schemaVersion") != "followup-review-hash-addendum-v1"
            or data.get("chunkId") != chunk
            or review_verdict(data) != "PASS"
            or data.get("candidateOnly") is not True
            or data.get("reviewedByHuman") is not False
            or data.get("issues") != []
        ):
            raise IntegrationError(f"followup hash-addendum authority drift: chunk-{chunk}")
        panel_root = batch_root / "followup-panel-output-v1" / f"chunk-{chunk}"
        panel_manifest = panel_root / "PANEL-RESULT.sha256"
        manifest_data = data.get("panelResultManifest", {})
        manifest_checks_pass = isinstance(manifest_data, dict) and (
            (
                manifest_data.get("syntax") == "PASS"
                and manifest_data.get("membership") == "PASS"
                and manifest_data.get("listedFileHashVerification") == "PASS"
                and manifest_data.get("listedFileCount") == 5
            )
            or (
                manifest_data.get("syntaxValid") is True
                and manifest_data.get("exactMembership") is True
                and manifest_data.get("allListedHashesMatch") is True
                and manifest_data.get("listedMemberCount") == 5
            )
        )
        if (
            not isinstance(manifest_data, dict)
            or manifest_data.get("path") != f"followup-panel-output-v1/chunk-{chunk}/PANEL-RESULT.sha256"
            or manifest_data.get("sha256") != sha256(panel_manifest)
            or not manifest_checks_pass
        ):
            raise IntegrationError(f"followup hash-addendum result-manifest binding drift: chunk-{chunk}")
        panel_entries: dict[str, str] = {}
        for line in panel_manifest.read_text(encoding="utf-8-sig").splitlines():
            digest, name = line.split(None, 1)
            relative = name.strip().replace("\\", "/")
            if relative in panel_entries:
                raise IntegrationError(f"duplicate panel result manifest member: chunk-{chunk} {relative}")
            panel_entries[relative] = digest.lower()
            path = panel_root / relative
            if not path.is_file() or sha256(path) != digest.lower():
                raise IntegrationError(f"panel result manifest hash drift: chunk-{chunk} {relative}")
        if len(panel_entries) != 5:
            raise IntegrationError(f"panel result manifest membership drift: chunk-{chunk}")
        reviewed_results = {
            item.get("path"): item.get("sha256")
            for item in (data.get("resultFiles") or data.get("resultFileBindings") or [])
            if isinstance(item, dict)
        }
        expected_results = {
            f"followup-panel-output-v1/chunk-{chunk}/{relative}": digest
            for relative, digest in panel_entries.items()
        }
        if reviewed_results != expected_results:
            raise IntegrationError(f"followup hash-addendum result-file binding drift: chunk-{chunk}")
        semantic = data.get("semanticReview", {})
        reviewed_semantic = {
            item.get("path"): item.get("sha256")
            for item in ((semantic.get("files") if isinstance(semantic, dict) else None) or data.get("reviewBindings") or [])
            if isinstance(item, dict)
        } if isinstance(semantic, dict) else {}
        expected_semantic = {
            f"followup-panel-review-v1/chunk-{chunk}/REVIEW.json": sha256(batch_root / "followup-panel-review-v1" / f"chunk-{chunk}" / "REVIEW.json"),
            f"followup-panel-review-v1/chunk-{chunk}/REVIEW.md": sha256(batch_root / "followup-panel-review-v1" / f"chunk-{chunk}" / "REVIEW.md"),
        }
        if not isinstance(semantic, dict) or semantic.get("verdict") != "PASS" or reviewed_semantic != expected_semantic:
            raise IntegrationError(f"followup hash-addendum semantic-review binding drift: chunk-{chunk}")
        ledger.append({
            "kind": "followup-review-hash-addendum-v1", "reviewId": f"chunk-{chunk}",
            "verdict": "PASS", "sha256": sha256(addendum / "REVIEW.json"),
        })
    return ledger


def load_followup_module(batch_root: Path):
    tools = batch_root / "followup-panel-tools"
    sys.path.insert(0, str(tools))
    path = tools / "publish_authorized_followup.py"
    spec = importlib.util.spec_from_file_location("followup_publisher", path)
    if spec is None or spec.loader is None:
        raise IntegrationError(f"cannot load publisher: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_safety(batch_root: Path) -> tuple[dict[str, dict[str, str]], dict[str, dict[str, str]]]:
    evidence: dict[str, dict[str, str]] = {}
    claims: dict[str, dict[str, str]] = {}
    chunks = sorted(item for item in (batch_root / "safety-recheck-v1" / "chunks").glob("chunk-*") if item.is_dir())
    if len(chunks) != 9:
        raise IntegrationError(f"expected 9 safety chunks, found {len(chunks)}")
    for chunk in chunks:
        for row in read_csv(chunk / "evidence.csv"):
            evidence_id = row["evidenceId"]
            if evidence_id in evidence or row["reviewedByHuman"] != "false" or row["candidateOnly"] != "true":
                raise IntegrationError(f"invalid/duplicate safety evidence: {evidence_id}")
            evidence[evidence_id] = row
        for row in read_csv(chunk / "claims.csv"):
            work_id = row["workId"]
            if work_id in claims or row["outcome"] != "SAFE" or row["decision"] != "accepted":
                raise IntegrationError(f"invalid/duplicate safety claim: {work_id}")
            if row["reviewedByHuman"] != "false" or row["candidateOnly"] != "true":
                raise IntegrationError(f"invalid safety authority flags: {work_id}")
            claims[work_id] = row
    if len(evidence) != 177 or len(claims) != 177:
        raise IntegrationError(f"safety cardinality drift: evidence={len(evidence)} claims={len(claims)}")
    return evidence, claims


def load_corrections(batch_root: Path) -> tuple[list[dict[str, str]], dict[str, dict[str, str]], list[dict[str, str]]]:
    rows: list[dict[str, str]] = []
    work_results: dict[str, dict[str, str]] = {}
    rescued: list[dict[str, str]] = []
    for index in range(1, 11):
        chunk = batch_root / "initial-pass-correction-v1" / "results" / f"chunk-{index:02d}"
        rows.extend(read_csv(chunk / "corrections.csv"))
        rescued.extend(read_csv(chunk / "rescued-evidence.csv"))
        for row in read_csv(chunk / "work-results.csv"):
            if row["workId"] in work_results:
                raise IntegrationError(f"duplicate correction work result: {row['workId']}")
            work_results[row["workId"]] = row
    if len(rows) != 491 or len(work_results) != 108:
        raise IntegrationError(f"correction cardinality drift: targets={len(rows)} works={len(work_results)}")
    if Counter(row["decision"] for row in rows) != Counter({"BLOCKED_FACTOR": 303, "CORRECTED": 113, "RESCUED": 75}):
        raise IntegrationError("correction decision counts drifted")
    for row in rows:
        if (row["candidateOnly"], row["reviewedByHuman"], row["grokUsed"], row["researchCost"]) != ("true", "false", "false", "FREE"):
            raise IntegrationError(f"correction authority flags drift: {row['targetId']}")
    return rows, work_results, rescued


def external_batch_targets(external_result: Path) -> list[str]:
    rows = read_csv(external_result / "batch-001-targets.csv")
    ids = [row["workId"] for row in rows]
    if len(ids) != 200 or len(set(ids)) != 200:
        raise IntegrationError("external Batch001 target cardinality drift")
    return ids


def _canonicalize_allowed_non_target_projection(
    table: str,
    columns: list[str],
    rows: list[tuple[object, ...]],
) -> list[tuple[object, ...]]:
    normalized: list[tuple[object, ...]] = []
    for original in rows:
        row = list(original)
        values = dict(zip(columns, row))
        if table == "source_evidence":
            evidence_id = str(values["id"])
            work_id = str(values["workId"])
            if work_id in {"work-5b0d4a8aa459ea35977f", "work-6638e4135d80f7366244"} and "problemSolving" in evidence_id:
                row[columns.index("id")] = evidence_id.replace("problemSolving", "problem-solving")
            if work_id == "work-38c172f27525cec2a86b" and "historicalReconstruction" in evidence_id:
                row[columns.index("id")] = evidence_id.replace("historicalReconstruction", "historical-reconstruction")
            raw = str(values["sourceType"])
            if raw in {"cohortSupport", "licensedPlatform"}:
                marker = f"originalSourceType={raw}; normalizedSourceType=manual; "
                notes = str(values["notes"])
                row[columns.index("sourceType")] = "manual"
                row[columns.index("notes")] = notes if notes.startswith(marker) else marker + notes
            fetched_at = str(values["fetchedAt"])
            if len(fetched_at) == 10 and fetched_at[4] == "-" and fetched_at[7] == "-":
                row[columns.index("fetchedAt")] = fetched_at + "T00:00:00+09:00"
        elif table == "source_factors":
            work_id = str(values["workId"])
            evidence_id = str(values["evidenceId"])
            if work_id in {"work-5b0d4a8aa459ea35977f", "work-6638e4135d80f7366244"} and "problemSolving" in evidence_id:
                row[columns.index("evidenceId")] = evidence_id.replace("problemSolving", "problem-solving")
        elif table == "source_themes":
            work_id = str(values["workId"])
            evidence_id = str(values["evidenceId"])
            if work_id == "work-38c172f27525cec2a86b" and "historicalReconstruction" in evidence_id:
                row[columns.index("evidenceId")] = evidence_id.replace("historicalReconstruction", "historical-reconstruction")
        normalized.append(tuple(row))
    return normalized


def snapshot_non_targets(db: Path, target_ids: set[str]) -> dict[str, list[tuple[object, ...]]]:
    con = sqlite3.connect(f"file:{db.as_posix()}?mode=ro", uri=True)
    try:
        result: dict[str, list[tuple[object, ...]]] = {}
        for table in sorted(EXPECTED_TABLES):
            columns = [row[1] for row in con.execute(f'pragma table_info("{table}")')]
            selected = columns[2:] if table in REINDEXED_TABLES else columns
            projection = ",".join(f'"{column}"' for column in selected)
            if table in {"source_aliases", "source_volumes", "source_recommendation_config", "source_art_evidence_manifest"}:
                result[table] = con.execute(f'SELECT * FROM "{table}" ORDER BY sourceOrdinal').fetchall()
            elif "workId" in columns:
                marks = ",".join("?" for _ in target_ids)
                query = f'SELECT {projection} FROM "{table}" WHERE workId NOT IN ({marks}) ORDER BY sourceOrdinal'
                result[table] = con.execute(query, tuple(sorted(target_ids))).fetchall()
            elif table == "source_works":
                marks = ",".join("?" for _ in target_ids)
                result[table] = con.execute(f'SELECT {projection} FROM source_works WHERE id NOT IN ({marks}) ORDER BY sourceOrdinal', tuple(sorted(target_ids))).fetchall()
            else:
                result[table] = con.execute(f'SELECT * FROM "{table}" ORDER BY sourceOrdinal').fetchall()
            result[table] = _canonicalize_allowed_non_target_projection(table, selected, result[table])
        return result
    finally:
        con.close()


def _canonical_row_line(values: tuple[object, ...]) -> int:
    handle = io.StringIO(newline="")
    csv.writer(handle, lineterminator="\n").writerow([str(value) for value in values])
    return handle.getvalue().count("\n")


def reindex_authority_projection(con: sqlite3.Connection, tables: set[str]) -> dict[str, int]:
    """Restore the repository CSV projection metadata after semantic mutations."""
    counts: dict[str, int] = {}
    for table in sorted(tables):
        columns = [row[1] for row in con.execute(f'pragma table_info("{table}")')]
        if columns[:2] != ["sourceOrdinal", "sourceLine"]:
            raise IntegrationError(f"authority projection columns drift: {table}")
        payload = columns[2:]
        select_payload = ",".join(f'"{column}"' for column in payload)
        rows = con.execute(
            f'SELECT sourceOrdinal,{select_payload} FROM "{table}" ORDER BY sourceOrdinal'
        ).fetchall()
        if any(row[0] <= 0 for row in rows):
            raise IntegrationError(f"authority projection has non-positive sourceOrdinal: {table}")
        projected: list[tuple[int, int, int]] = []
        source_line = 1  # canonical CSV header
        for index, row in enumerate(rows, 1):
            source_line += _canonical_row_line(row[1:])
            projected.append((row[0], index, source_line))
        # Two-phase keys above the current maximum avoid PK collisions while
        # respecting the schema's sourceOrdinal >= 1 CHECK constraint.
        offset = max((row[0] for row in rows), default=0)
        for old_ordinal, new_ordinal, line in projected:
            cursor = con.execute(
                f'UPDATE "{table}" SET sourceOrdinal=?,sourceLine=? WHERE sourceOrdinal=?',
                (offset + old_ordinal, line, old_ordinal),
            )
            if cursor.rowcount != 1:
                raise IntegrationError(f"authority reindex lost row: {table} {old_ordinal}")
        for old_ordinal, new_ordinal, _ in projected:
            cursor = con.execute(
                f'UPDATE "{table}" SET sourceOrdinal=? WHERE sourceOrdinal=?',
                (new_ordinal, offset + old_ordinal),
            )
            if cursor.rowcount != 1:
                raise IntegrationError(f"authority reindex finalization lost row: {table} {old_ordinal}")
        counts[table] = len(rows)
    return counts


def validate_authority_projection(con: sqlite3.Connection) -> None:
    for table in sorted(EXPECTED_TABLES):
        columns = [row[1] for row in con.execute(f'pragma table_info("{table}")')]
        if columns[:2] != ["sourceOrdinal", "sourceLine"]:
            raise IntegrationError(f"authority projection columns drift: {table}")
        payload = columns[2:]
        select_payload = ",".join(f'"{column}"' for column in payload)
        rows = con.execute(
            f'SELECT sourceOrdinal,sourceLine,{select_payload} FROM "{table}" ORDER BY sourceOrdinal'
        ).fetchall()
        source_line = 1
        for index, row in enumerate(rows, 1):
            source_line += _canonical_row_line(row[2:])
            if (row[0], row[1]) != (index, source_line):
                raise IntegrationError(
                    f"authority projection drift: {table} ordinal/line={(row[0], row[1])} expected={(index, source_line)}"
                )


def _note_normalization_row(
    evidence_id: str,
    notes: str,
    source: str,
    work_id: str,
) -> tuple[str, dict[str, str] | None]:
    normalized = notes.replace("\r\n", "\n").replace("\r", "\n")
    flattened = normalized.replace("\n", "; ")
    if flattened == notes:
        return flattened, None
    return flattened, {
        "evidenceId": evidence_id,
        "workId": work_id,
        "source": source,
        "operation": "normalize-crlf-and-cr-to-lf-then-lf-to-semicolon-space",
        "oldNotesSha256": hashlib.sha256(notes.encode("utf-8")).hexdigest(),
        "newNotesSha256": hashlib.sha256(flattened.encode("utf-8")).hexdigest(),
    }


def insert_evidence(
    con: sqlite3.Connection,
    rows: dict[str, dict[str, str]],
    normalization_source: str,
) -> list[dict[str, str]]:
    existing = {row[0] for row in con.execute("select id from source_evidence")}
    next_ordinal = con.execute("select coalesce(max(sourceOrdinal),0)+1 from source_evidence").fetchone()[0]
    next_line = con.execute("select coalesce(max(sourceLine),1)+1 from source_evidence").fetchone()[0]
    normalizations: list[dict[str, str]] = []
    for evidence_id in sorted(rows):
        if evidence_id in existing:
            continue
        row = rows[evidence_id]
        flattened_notes, normalization = _note_normalization_row(
            evidence_id, row["notes"], normalization_source, row["workId"]
        )
        if normalization is not None:
            normalizations.append(normalization)
        con.execute(
            "insert into source_evidence values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                next_ordinal,
                next_line,
                evidence_id,
                row["workId"],
                row.get("targetType", "work"),
                row.get("targetId", row["workId"]),
                row.get("sourceType", "manual"),
                row["sourceUrl"],
                row.get("fetchedAt", "2026-09-02T00:00:00+09:00"),
                row.get("extractorVersion", "catalog-integration-v1"),
                "false",
                row.get("confidence", ""),
                flattened_notes,
            ),
        )
        next_ordinal += 1
        next_line += 1
    return normalizations


def flatten_followup_evidence_notes(
    plan: dict[str, object], evidence_owners: dict[str, str]
) -> list[dict[str, str]]:
    """Keep evidence CSV rows single-line so untouched sourceLine values stay canonical."""
    normalizations: list[dict[str, str]] = []
    for key in ("newEvidence", "evidenceUpdates"):
        rows = plan.get(key, {})
        if not isinstance(rows, dict):
            raise IntegrationError(f"followup plan {key} is not a mapping")
        for evidence_id, value in rows.items():
            if not isinstance(value, dict) or not isinstance(value.get("notes"), str):
                raise IntegrationError(f"followup plan evidence notes missing: {key} {evidence_id}")
            work_id = value.get("workId") or evidence_owners.get(str(evidence_id))
            if not isinstance(work_id, str) or not work_id:
                raise IntegrationError(f"followup plan evidence owner missing: {key} {evidence_id}")
            flattened, normalization = _note_normalization_row(
                str(evidence_id), value["notes"], f"followup-plan/{key}", work_id
            )
            if normalization is not None:
                value["notes"] = flattened
                normalizations.append(normalization)
    return normalizations


def target_existing_note_mutations(
    con: sqlite3.Connection,
    base_evidence: dict[str, dict[str, str]],
    target_ids: set[str],
    followup_update_ids: set[str],
) -> list[dict[str, str]]:
    """Bind the exact pre-schema-repair note mutations on existing Batch001 evidence."""
    rows: list[dict[str, str]] = []
    for evidence_id, work_id, notes in con.execute(
        "select id,workId,notes from source_evidence order by id"
    ):
        before = base_evidence.get(evidence_id)
        if before is None or work_id not in target_ids or notes == before["notes"]:
            continue
        sources = []
        if evidence_id in followup_update_ids:
            sources.append("followup-plan/evidenceUpdates")
        if "urlRepair=initial-pass-url-repair-v1; verified=true" in notes and "urlRepair=initial-pass-url-repair-v1; verified=true" not in before["notes"]:
            sources.append("integration/initial-url-repair")
        if "effectiveUrlRepair=mechanical-terminal-backtick-removal" in notes and "effectiveUrlRepair=mechanical-terminal-backtick-removal" not in before["notes"]:
            sources.append("integration/effective-url-repair")
        if "contextCorrection=tsugimanga-only" in notes and "contextCorrection=tsugimanga-only" not in before["notes"]:
            sources.append("integration/context-correction")
        if len(sources) != 1:
            raise IntegrationError(f"unclassified or overlapping target note mutation: {evidence_id}: {sources}")
        rows.append({
            "evidenceId": evidence_id,
            "workId": work_id,
            "source": sources[0],
            "operation": "existing-evidence-note-mutation",
            "oldNotesSha256": hashlib.sha256(before["notes"].encode("utf-8")).hexdigest(),
            "newNotesSha256": hashlib.sha256(notes.encode("utf-8")).hexdigest(),
        })
    counts = Counter(row["source"] for row in rows)
    expected = Counter({
        "integration/initial-url-repair": 113,
        "integration/effective-url-repair": 9,
        "followup-plan/evidenceUpdates": 28,
        "integration/context-correction": 2,
    })
    if counts != expected:
        raise IntegrationError(f"target existing note mutation drift: {counts}")
    return rows


def apply_corrections(con: sqlite3.Connection, rows: list[dict[str, str]], rescued_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    rescued = {
        row["evidenceId"]: {
            "workId": row["workId"],
            "sourceUrl": row["sourceUrl"],
            "sourceType": "manual",
            "fetchedAt": row["retrievedDate"] + "T00:00:00+09:00",
            "confidence": "",
            "notes": (
                "candidateOnly=true; reviewedByHuman=false; authorityKind=authorizedEvidencePanel; "
                f"entryRange={row['entryRange']}; observation={row['observation']}; "
                f"sourceKind={row['sourceKind']}; aniListReferenceOnly=false; grokUsed=false"
            ),
        }
        for row in rescued_rows
    }
    normalizations = insert_evidence(con, rescued, "integration/correction-rescued")
    unique: dict[tuple[str, str], dict[str, str]] = {}
    for row in rows:
        key = (row["workId"], row["factKey"])
        prior = unique.get(key)
        if prior is not None and (prior["resolvedValue"], prior["decision"]) != (row["resolvedValue"], row["decision"]):
            raise IntegrationError(f"conflicting duplicate correction: {key}")
        unique[key] = row
    synthetic: dict[str, dict[str, str]] = {}
    for (work_id, fact_key), row in sorted(unique.items()):
        ids = json.loads(row["evidenceIdsJson"])
        urls = json.loads(row["citationUrlsJson"])
        if not ids:
            continue
        owned = []
        for evidence_id in ids:
            source = con.execute("select workId,sourceUrl from source_evidence where id=?", (evidence_id,)).fetchone()
            if source is None or source[0] != work_id:
                raise IntegrationError(f"correction evidence missing/cross-work: {work_id} {fact_key} {evidence_id}")
            owned.append({"id": evidence_id, "sourceUrl": source[1]})
        payload = json.dumps(
            {"workId": work_id, "factKey": fact_key, "value": row["resolvedValue"], "decision": row["decision"], "evidenceIds": ids, "citationUrls": urls},
            ensure_ascii=False, sort_keys=True, separators=(",", ":"),
        )
        claim_id = "ev-authorized-correction-" + hashlib.sha256(payload.encode("utf-8")).hexdigest()
        kind, name = fact_key.split(":", 1)
        synthetic[claim_id] = {
            "workId": work_id,
            "targetType": kind if kind in {"axis", "theme"} else "work",
            "targetId": name if kind in {"axis", "theme"} else work_id,
            "sourceUrl": sorted(urls)[0],
            "sourceType": "manual",
            "fetchedAt": "2026-09-02T12:00:00+09:00",
            "confidence": (
                (con.execute("select confidence from source_factors where workId=? and axisId=?", (work_id, name)).fetchone() or [""])[0]
                if kind == "axis" else
                (con.execute("select confidence from source_themes where workId=? and themeId=?", (work_id, name)).fetchone() or [""])[0]
                if kind == "theme" else
                (con.execute("select confidence from source_evidence where id=?", (ids[0],)).fetchone() or [""])[0]
            ),
            "notes": (
                "candidateOnly=true; reviewedByHuman=false; authorityKind=authorizedEvidencePanel; "
                f"factKey={fact_key}; decision={row['decision']}; resolvedValue={row['resolvedValue']}; "
                f"entryRange={row['entryRange']}; evidenceIdsJson={json.dumps(ids, ensure_ascii=False, separators=(',', ':'))}; "
                f"citationUrlsJson={json.dumps(urls, ensure_ascii=False, separators=(',', ':'))}; "
                f"rationale={row['rationale']}; grokUsed=false"
            ),
        }
        row["_claimEvidenceId"] = claim_id
    normalizations += insert_evidence(con, synthetic, "integration/correction-synthetic")
    next_theme = con.execute("select coalesce(max(sourceOrdinal),0)+1 from source_themes").fetchone()[0]
    next_theme_line = con.execute("select coalesce(max(sourceLine),1)+1 from source_themes").fetchone()[0]
    for (work_id, fact_key), row in sorted(unique.items()):
        kind, name = fact_key.split(":", 1)
        if kind == "coverage":
            continue
        value = row["resolvedValue"]
        evidence_id = row.get("_claimEvidenceId")
        if kind == "axis":
            current = con.execute("select confidence,evidenceId from source_factors where workId=? and axisId=?", (work_id, name)).fetchone()
            if current is None:
                raise IntegrationError(f"correction axis missing in candidate: {work_id} {name}")
            if value == "unknown":
                con.execute("update source_factors set state='unknown',value='',confidence='',evidenceId='' where workId=? and axisId=?", (work_id, name))
            else:
                if not current[0] or not evidence_id:
                    raise IntegrationError(f"known axis correction lacks projected confidence/evidence: {work_id} {name}")
                con.execute("update source_factors set state='known',value=?,confidence=?,evidenceId=? where workId=? and axisId=?", (value, current[0], evidence_id, work_id, name))
        elif kind == "theme":
            current = con.execute("select sourceOrdinal,confidence,evidenceId from source_themes where workId=? and themeId=?", (work_id, name)).fetchone()
            if value == "unknown":
                con.execute("delete from source_themes where workId=? and themeId=?", (work_id, name))
            elif current is None:
                raise IntegrationError(f"known theme correction lacks existing confidence projection: {work_id} {name}")
            else:
                if not current[1] or not evidence_id:
                    raise IntegrationError(f"known theme correction lacks projected confidence/evidence: {work_id} {name}")
                con.execute("update source_themes set centrality=?,confidence=?,evidenceId=? where workId=? and themeId=?", (value, current[1], evidence_id, work_id, name))
        elif kind == "genre":
            current = con.execute("select genres from source_works where id=?", (work_id,)).fetchone()
            if current is None:
                raise IntegrationError(f"correction genre work missing: {work_id}")
            genres = [item for item in current[0].split(";") if item]
            if value == "unknown":
                genres = [item for item in genres if item != name]
            elif value == "true" and name not in genres:
                genres.append(name)
            con.execute("update source_works set genres=? where id=?", (";".join(genres), work_id))
        elif kind == "context" and name == "catalogRole":
            # The reviewed suffix is provenance, not a typed catalogRole value.
            cursor = con.execute("update source_recommendation_context set catalogRole='discovery' where workId=?", (work_id,))
            if cursor.rowcount != 1:
                raise IntegrationError(f"context correction lost row: {work_id}")
            ids = json.loads(row["evidenceIdsJson"])
            urls = json.loads(row["citationUrlsJson"])
            for index, source_id in enumerate(ids):
                source_url = urls[min(index, len(urls) - 1)]
                cursor = con.execute(
                    "update source_evidence set sourceUrl=?,notes=notes||? where id=? and workId=?",
                    (source_url, f"; contextCorrection=tsugimanga-only; citationUrlsJson={json.dumps(urls, ensure_ascii=False, separators=(',', ':'))}", source_id, work_id),
                )
                if cursor.rowcount != 1:
                    raise IntegrationError(f"context provenance binding missing: {work_id} {source_id}")
        else:
            raise IntegrationError(f"unsupported correction fact: {fact_key}")
    return normalizations


def apply_url_repairs(con: sqlite3.Connection, batch_root: Path, target_ids: set[str]) -> int:
    verify = json.loads((batch_root / "initial-pass-url-repair-v1" / "VERIFY.json").read_text(encoding="utf-8-sig"))
    repairs: dict[str, str] = {}
    for item in verify["results"]:
        if item["checkResult"] != "PASS":
            raise IntegrationError(f"URL repair was not verified: {item['cleanTargetUrl']}")
        for raw in item["rawMalformedUrls"]:
            repairs[raw] = item["cleanTargetUrl"]
    changed = 0
    for raw, clean in sorted(repairs.items()):
        marks = ",".join("?" for _ in target_ids)
        cursor = con.execute(
            f"update source_evidence set sourceUrl=?,notes=notes||? where sourceUrl=? and workId in ({marks})",
            (clean, "; urlRepair=initial-pass-url-repair-v1; verified=true", raw, *sorted(target_ids)),
        )
        changed += cursor.rowcount
    return changed


def apply_followup_explicit_unknowns(con: sqlite3.Connection, batch_root: Path) -> int:
    changed = 0
    expected: dict[str, dict[str, int]] = {}
    for chunk in sorted((batch_root / "followup-panel-output-v1").glob("chunk-*")):
        summary = json.loads((chunk / "evidence-panel-summary.json").read_text(encoding="utf-8-sig"))
        for work in summary["works"]:
            coverage_row = work["coverage"]
            expected[work["workId"]] = {
                "narrative": coverage_row["narrativeKnown"], "tone": coverage_row["toneKnown"],
                "genre": coverage_row["genreCount"], "theme": coverage_row["themeCount"], "art": coverage_row["artKnown"],
            }
        for row in read_csv(chunk / "evidence-panel-ledger.csv"):
            if row["decision"] != "explicitUnknown":
                continue
            work_id = row["workId"]
            kind, name = row["factKey"].split(":", 1)
            if kind == "axis":
                cursor = con.execute(
                    "update source_factors set state='unknown',value='',confidence='',evidenceId='' where workId=? and axisId=?",
                    (work_id, name),
                )
                if cursor.rowcount != 1:
                    raise IntegrationError(f"followup explicitUnknown axis missing: {work_id} {name}")
                changed += 1
            elif kind == "theme":
                changed += con.execute("delete from source_themes where workId=? and themeId=?", (work_id, name)).rowcount
            elif kind == "genre":
                current = con.execute("select genres from source_works where id=?", (work_id,)).fetchone()
                if current is None:
                    raise IntegrationError(f"followup explicitUnknown genre work missing: {work_id}")
                genres = [item for item in current[0].split(";") if item and item != name]
                con.execute("update source_works set genres=? where id=?", (";".join(genres), work_id))
            else:
                raise IntegrationError(f"unsupported followup explicitUnknown fact: {row['factKey']}")
    art_axes = {"artRealism", "visualSoftness", "artDensity", "motionImpact"}
    for work_id, wanted in sorted(expected.items()):
        narrative, tone, genre, theme, _ = coverage(con, work_id)
        art = con.execute(
            "select count(*) from source_factors where workId=? and state='known' and axisId in (?,?,?,?)",
            (work_id, *sorted(art_axes)),
        ).fetchone()[0]
        actual = {"narrative": narrative, "tone": tone, "genre": genre, "theme": theme, "art": art}
        if actual != wanted:
            raise IntegrationError(f"followup panel summary projection mismatch: {work_id}: {actual} != {wanted}")
    return changed


def bind_unknown_factor_adjudications(
    con: sqlite3.Connection,
    batch_root: Path,
    target_ids: set[str],
    module,
) -> tuple[int, list[dict[str, str]], list[dict[str, str]]]:
    """Bind exact reviewed unknown decisions without assigning numeric factor values."""
    supplemental: dict[str, dict[str, str]] = {}
    for path in sorted((batch_root / "followup-panel-input-v1" / "chunks").glob("chunk-*/supplemental-evidence.csv")):
        for source in read_csv(path):
            supplemental[source["evidenceId"]] = source
    followup_rows: dict[tuple[str, str], dict[str, str]] = {}
    for chunk in sorted((batch_root / "followup-panel-output-v1").glob("chunk-*")):
        for row in read_csv(chunk / "evidence-panel-ledger.csv"):
            if row["decision"] != "explicitUnknown" or not row["factKey"].startswith("axis:"):
                continue
            key = (row["workId"], row["factKey"].split(":", 1)[1])
            if key in followup_rows:
                raise IntegrationError(f"duplicate followup explicitUnknown decision: {key}")
            followup_rows[key] = row
    if len(followup_rows) != 347:
        raise IntegrationError(f"followup explicitUnknown axis decision drift: {len(followup_rows)}")

    evidence_columns = [row[1] for row in con.execute("pragma table_info(source_evidence)")][2:]
    followup_evidence: dict[str, dict[str, str]] = {}
    followup_bindings: list[tuple[str, str, str]] = []
    adjudication_ledger: list[dict[str, str]] = []
    for (work_id, axis_id), row in sorted(followup_rows.items()):
        claim_id = module._claim_evidence_id(row)
        ids = module.panel.split_list(row["evidenceIds"], f"{work_id} evidenceIds")
        source = None
        for evidence_id in ids:
            db_row = con.execute(
                "select " + ",".join(f'\"{column}\"' for column in evidence_columns) + " from source_evidence where id=? and workId=?",
                (evidence_id, work_id),
            ).fetchone()
            if db_row is not None:
                source = dict(zip(evidence_columns, (str(value) for value in db_row)))
                break
            candidate = supplemental.get(evidence_id)
            if candidate is not None and candidate["workId"] == work_id:
                source = candidate
                break
        if source is None:
            raise IntegrationError(f"followup explicitUnknown source evidence missing: {work_id} {axis_id}")
        claim_source = dict(source)
        claim_source["sourceUrl"] = sorted(module.panel.split_list(row["citationUrls"], f"{work_id} citationUrls"))[0]
        record = module._evidence_row(claim_id, claim_source, panel_row=row)
        # Newly projected claim records must be schema-valid at creation.  Keep
        # the independent 225-row compatibility projection scoped to frozen
        # input records rather than mixing generated-row lexical repair into it.
        generated_date_normalized = len(record["fetchedAt"]) == 10
        if generated_date_normalized:
            record["fetchedAt"] += "T00:00:00+09:00"
        record["confidence"] = "1"
        if "confidenceSemantics=adjudication-record-validity" not in record["notes"]:
            record["notes"] += "; confidenceSemantics=adjudication-record-validity"
        followup_evidence[claim_id] = record
        followup_bindings.append((claim_id, work_id, axis_id))
        adjudication_ledger.append({
            "workId": work_id,
            "axisId": axis_id,
            "evidenceId": claim_id,
            "adjudicationSource": "followup-explicit-unknown",
            "bindingAction": "create",
            "factorState": "unknown",
            "factorValue": "",
            "factorConfidence": "",
            "previousEvidenceConfidence": "",
            "evidenceConfidence": "1",
            "confidenceSemantics": "adjudication-record-validity",
            "generatedFetchedAtNormalization": "date-only->rfc3339-midnight-jst" if generated_date_normalized else "",
        })
    normalizations = insert_evidence(con, followup_evidence, "integration/followup-explicit-unknown-claim")
    for evidence_id, work_id, axis_id in followup_bindings:
        cursor = con.execute(
            "update source_factors set evidenceId=? where workId=? and axisId=? and state='unknown' and value='' and confidence='' and evidenceId=''",
            (evidence_id, work_id, axis_id),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"followup unknown claim binding lost factor: {work_id} {axis_id}")

    correction_rows: dict[tuple[str, str], list[dict[str, str]]] = {}
    for index in range(1, 11):
        chunk = batch_root / "initial-pass-correction-v1" / "results" / f"chunk-{index:02d}"
        manifest_digest = sha256(chunk / "MANIFEST.sha256")
        for row in read_csv(chunk / "corrections.csv"):
            if row["resolvedValue"] != "unknown" or not row["factKey"].startswith("axis:"):
                continue
            key = (row["workId"], row["factKey"].split(":", 1)[1])
            correction_rows.setdefault(key, []).append({**row, "resultManifestSha256": manifest_digest})
    if len(correction_rows) != 311:
        raise IntegrationError(f"correction unknown axis decision drift: {len(correction_rows)}")
    correction_evidence: dict[str, dict[str, str]] = {}
    correction_bindings: list[tuple[str, str, str]] = []
    reused = 0
    created = 0
    for (work_id, axis_id), rows in sorted(correction_rows.items()):
        existing = con.execute(
            "select id,confidence from source_evidence where workId=? and targetType='axis' and targetId=? and id like 'ev-authorized-correction-%' order by id",
            (work_id, axis_id),
        ).fetchall()
        if existing:
            if len(existing) != 1 or not any(json.loads(row["evidenceIdsJson"]) for row in rows):
                raise IntegrationError(f"ambiguous correction evidence reuse: {work_id} {axis_id}")
            evidence_id = existing[0][0]
            previous_evidence_confidence = existing[0][1]
            reused += 1
            binding_action = "reuse"
        else:
            tuple_rows = [
                [
                    row["schemaVersion"], row["chunkId"], row["targetFileSha256"], row["targetId"],
                    row["workId"], row["factKey"], row["decision"], row["resolvedValue"],
                    row["evidenceIdsJson"], row["citationUrlsJson"], row["entryRange"], row["rationale"],
                    row["candidateOnly"], row["reviewedByHuman"], row["grokUsed"], row["researchCost"],
                    row["resultManifestSha256"],
                ]
                for row in sorted(rows, key=lambda item: item["targetId"])
            ]
            payload_json = json.dumps(tuple_rows, ensure_ascii=False, separators=(",", ":"))
            evidence_id = "ev-authorized-correction-resolution-" + hashlib.sha256(payload_json.encode("utf-8")).hexdigest()
            correction_evidence[evidence_id] = {
                "workId": work_id,
                "targetType": "axis",
                "targetId": axis_id,
                "sourceType": "model",
                "sourceUrl": "",
                "fetchedAt": REVIEWED_AT,
                "confidence": "1",
                "notes": (
                    "candidateOnly=true; reviewedByHuman=false; grokUsed=false; authorityKind=authorizedEvidencePanel; "
                    "factorState=unknown; factorValue=blank; factorConfidence=blank; "
                    f"confidenceSemantics=adjudication-record-validity; correctionTuple={payload_json}"
                ),
            }
            created += 1
            binding_action = "create"
            previous_evidence_confidence = ""
        correction_bindings.append((evidence_id, work_id, axis_id))
        adjudication_ledger.append({
            "workId": work_id,
            "axisId": axis_id,
            "evidenceId": evidence_id,
            "adjudicationSource": "initial-pass-correction",
            "bindingAction": binding_action,
            "factorState": "unknown",
            "factorValue": "",
            "factorConfidence": "",
            "previousEvidenceConfidence": previous_evidence_confidence,
            "evidenceConfidence": "1",
            "confidenceSemantics": "adjudication-record-validity",
            "generatedFetchedAtNormalization": "",
        })
    if (reused, created) != (60, 251):
        raise IntegrationError(f"correction unknown evidence reuse/create drift: {(reused, created)}")
    normalizations += insert_evidence(con, correction_evidence, "integration/correction-unknown-resolution")
    binding_ids = {evidence_id for evidence_id, _work_id, _axis_id in followup_bindings + correction_bindings}
    if len(binding_ids) != 658:
        raise IntegrationError(f"unknown adjudication evidence ID cardinality drift: {len(binding_ids)}")
    confidence_marker = "confidenceSemantics=adjudication-record-validity"
    for evidence_id in sorted(binding_ids):
        row = con.execute("select notes from source_evidence where id=?", (evidence_id,)).fetchone()
        if row is None:
            raise IntegrationError(f"unknown adjudication evidence missing: {evidence_id}")
        notes = row[0] if confidence_marker in row[0] else row[0] + "; " + confidence_marker
        con.execute("update source_evidence set confidence='1',notes=? where id=?", (notes, evidence_id))
    for evidence_id, work_id, axis_id in correction_bindings:
        cursor = con.execute(
            "update source_factors set evidenceId=? where workId=? and axisId=? and state='unknown' and value='' and confidence='' and evidenceId=''",
            (evidence_id, work_id, axis_id),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"correction unknown claim binding lost factor: {work_id} {axis_id}")
    marks = ",".join("?" for _ in target_ids)
    if con.execute(
        f"select count(*) from source_factors where state='unknown' and evidenceId='' and workId in ({marks})",
        tuple(sorted(target_ids)),
    ).fetchone()[0] != 0:
        raise IntegrationError("reviewed B001 unknown factor still lacks evidence")
    if sum(row["generatedFetchedAtNormalization"] != "" for row in adjudication_ledger) != 28:
        raise IntegrationError("generated followup claim fetchedAt normalization count drift")
    return (
        len(followup_bindings) + len(correction_bindings),
        normalizations,
        sorted(adjudication_ledger, key=lambda row: (row["workId"], row["axisId"], row["evidenceId"])),
    )


def normalize_exact_known_evidence_ids(con: sqlite3.Connection) -> list[dict[str, str]]:
    works = ("work-5b0d4a8aa459ea35977f", "work-6638e4135d80f7366244")
    ledger: list[dict[str, str]] = []
    for work_id in works:
        row = con.execute(
            "select evidenceId from source_factors where workId=? and axisId='problemSolving' and state='known'",
            (work_id,),
        ).fetchone()
        if row is None or "problemSolving" not in row[0]:
            raise IntegrationError(f"expected Batch005 problemSolving evidence ID missing: {work_id}")
        old_id = row[0]
        new_id = old_id.replace("problemSolving", "problem-solving")
        if con.execute("select count(*) from source_evidence where id=? and workId=?", (old_id, work_id)).fetchone()[0] != 1:
            raise IntegrationError(f"Batch005 evidence row missing/cross-work: {old_id}")
        if con.execute("select count(*) from source_evidence where id=?", (new_id,)).fetchone()[0]:
            raise IntegrationError(f"Batch005 normalized evidence ID collision: {new_id}")
        con.execute("update source_evidence set id=? where id=? and workId=?", (new_id, old_id, work_id))
        cursor = con.execute(
            "update source_factors set evidenceId=? where workId=? and axisId='problemSolving' and evidenceId=?",
            (new_id, work_id, old_id),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"Batch005 factor evidence rebind lost row: {work_id}")
        ledger.append({
            "workId": work_id,
            "targetType": "axis",
            "targetId": "problemSolving",
            "referenceTable": "source_factors",
            "oldEvidenceId": old_id,
            "newEvidenceId": new_id,
        })
    theme_work = "work-38c172f27525cec2a86b"
    row = con.execute(
        "select evidenceId from source_themes where workId=? and themeId='historicalReconstruction'",
        (theme_work,),
    ).fetchone()
    if row is None or "historicalReconstruction" not in row[0]:
        raise IntegrationError("expected Batch004 historicalReconstruction evidence ID missing")
    old_id = row[0]
    new_id = old_id.replace("historicalReconstruction", "historical-reconstruction")
    if con.execute("select count(*) from source_evidence where id=? and workId=?", (old_id, theme_work)).fetchone()[0] != 1:
        raise IntegrationError(f"Batch004 theme evidence row missing/cross-work: {old_id}")
    if con.execute("select count(*) from source_evidence where id=?", (new_id,)).fetchone()[0]:
        raise IntegrationError(f"Batch004 normalized evidence ID collision: {new_id}")
    con.execute("update source_evidence set id=? where id=? and workId=?", (new_id, old_id, theme_work))
    cursor = con.execute(
        "update source_themes set evidenceId=? where workId=? and themeId='historicalReconstruction' and evidenceId=?",
        (new_id, theme_work, old_id),
    )
    if cursor.rowcount != 1:
        raise IntegrationError("Batch004 theme evidence rebind lost row")
    ledger.append({
        "workId": theme_work,
        "targetType": "theme",
        "targetId": "historicalReconstruction",
        "referenceTable": "source_themes",
        "oldEvidenceId": old_id,
        "newEvidenceId": new_id,
    })
    return ledger


def project_global_source_types(con: sqlite3.Connection) -> list[dict[str, str]]:
    expected = Counter({"cohortSupport": 1540, "licensedPlatform": 1})
    rows = con.execute(
        "select id,workId,sourceType,sourceUrl,notes from source_evidence where sourceType in ('cohortSupport','licensedPlatform') order by id"
    ).fetchall()
    if Counter(row[2] for row in rows) != expected:
        raise IntegrationError(f"global sourceType projection count drift: {Counter(row[2] for row in rows)}")
    ledger: list[dict[str, str]] = []
    for evidence_id, work_id, raw, source_url, notes in rows:
        marker = f"originalSourceType={raw}; normalizedSourceType=manual; "
        projected_notes = notes if notes.startswith(marker) else marker + notes
        cursor = con.execute(
            "update source_evidence set sourceType='manual',notes=? where id=? and workId=? and sourceType=?",
            (projected_notes, evidence_id, work_id, raw),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"global sourceType projection lost row: {evidence_id}")
        ledger.append({
            "evidenceId": evidence_id,
            "workId": work_id,
            "sourceUrlSha256": hashlib.sha256(source_url.encode("utf-8")).hexdigest(),
            "oldSourceType": raw,
            "newSourceType": "manual",
            "oldNotesSha256": hashlib.sha256(notes.encode("utf-8")).hexdigest(),
            "newNotesSha256": hashlib.sha256(projected_notes.encode("utf-8")).hexdigest(),
        })
    return ledger


def normalize_date_only_fetched_at(con: sqlite3.Connection) -> tuple[list[dict[str, str]], str]:
    rows = con.execute(
        "select id,workId,fetchedAt from source_evidence where length(fetchedAt)=10 and substr(fetchedAt,5,1)='-' and substr(fetchedAt,8,1)='-' order by id"
    ).fetchall()
    if len(rows) != 225:
        raise IntegrationError(f"date-only evidence fetchedAt count drift: {len(rows)}")
    digest_rows = [[row[0], row[1], row[2], row[2] + "T00:00:00+09:00"] for row in rows]
    digest = hashlib.sha256(
        json.dumps(digest_rows, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    expected_digest = "9714d9a49b3d44d42d2c5a3da135554294b63e70d1ce5ad2ef062e21798323d5"
    if digest != expected_digest:
        raise IntegrationError(f"date-only evidence projection digest drift: {digest}")
    ledger: list[dict[str, str]] = []
    for evidence_id, work_id, old_value in rows:
        new_value = old_value + "T00:00:00+09:00"
        cursor = con.execute(
            "update source_evidence set fetchedAt=? where id=? and workId=? and fetchedAt=?",
            (new_value, evidence_id, work_id, old_value),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"date-only evidence normalization lost row: {evidence_id}")
        ledger.append({"evidenceId": evidence_id, "workId": work_id, "oldFetchedAt": old_value, "newFetchedAt": new_value})
    return ledger, digest


def project_blank_evidence_confidence(con: sqlite3.Connection) -> tuple[list[dict[str, str]], str]:
    rows = con.execute(
        "select id,workId,targetType,targetId,confidence,notes from source_evidence where confidence='' order by id"
    ).fetchall()
    if len(rows) != 227:
        raise IntegrationError(f"blank evidence confidence count drift: {len(rows)}")
    digest_rows = [[row[0], row[1], row[2], row[3], row[4], "1", "adjudication-record-validity"] for row in rows]
    digest = hashlib.sha256(
        json.dumps(digest_rows, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    expected_digest = "6f986035dcb56765101643ccf73e9f3a43736ad7ea586cc90630f85037b0a705"
    if digest != expected_digest:
        raise IntegrationError(f"evidence confidence projection digest drift: {digest}")
    ledger: list[dict[str, str]] = []
    marker = "confidenceSemantics=adjudication-record-validity"
    for evidence_id, work_id, target_type, target_id, old_value, notes in rows:
        projected_notes = notes if marker in notes else f"{notes}; {marker}"
        cursor = con.execute(
            "update source_evidence set confidence='1',notes=? where id=? and workId=? and confidence=''",
            (projected_notes, evidence_id, work_id),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"evidence confidence projection lost row: {evidence_id}")
        ledger.append({
            "evidenceId": evidence_id,
            "workId": work_id,
            "targetType": target_type,
            "targetId": target_id,
            "oldConfidence": old_value,
            "newConfidence": "1",
            "confidenceSemantics": "adjudication-record-validity",
        })
    return ledger, digest


def validate_and_apply_effective_url_repair(
    con: sqlite3.Connection,
    batch_root: Path,
) -> tuple[int, str, list[dict[str, str]]]:
    root = batch_root / "effective-url-repair-v1"
    result_path = root / "RESULT.json"
    review_path = root / "SECOND-INDEPENDENT-REVIEW.json"
    result = json.loads(result_path.read_text(encoding="utf-8-sig"))
    review = json.loads(review_path.read_text(encoding="utf-8-sig"))
    if result.get("status") != "PASS" or review_verdict(review) != "PASS" or review.get("promotionVerdict") != "PASS":
        raise IntegrationError("effective URL repair/review is not PASS")
    current_artifacts = review.get("currentArtifactHashes", {})
    reviewed_artifacts = {
        "RESULT.json": result_path,
        "REVIEW-REQUEST.md": root / "REVIEW-REQUEST.md",
        "MANIFEST.sha256": root / "MANIFEST.sha256",
    }
    if not isinstance(current_artifacts, dict) or any(
        current_artifacts.get(name) != sha256(path) for name, path in reviewed_artifacts.items()
    ):
        raise IntegrationError("effective URL repair review/artifact binding mismatch")
    manifest_entries = {}
    for line in (root / "MANIFEST.sha256").read_text(encoding="utf-8-sig").splitlines():
        digest, name = line.split(None, 1)
        manifest_entries[name.strip()] = digest
    if manifest_entries != {"RESULT.json": sha256(result_path), "REVIEW-REQUEST.md": sha256(root / "REVIEW-REQUEST.md")}:
        raise IntegrationError("effective URL repair manifest drift")
    for item in review.get("frozenInputHashChecks", []):
        path = batch_root / item["path"]
        if not item.get("match") or item.get("expected") != item.get("actual") or sha256(path) != item["actual"]:
            raise IntegrationError(f"effective URL review input hash mismatch: {path}")
    decisions = result.get("effectiveDecisions")
    if not isinstance(decisions, list) or len(decisions) != 4:
        raise IntegrationError("effective URL repair decision cardinality drift")
    by_fact = {item.get("factKey"): item for item in decisions if isinstance(item, dict)}
    expected_unknown = {"axis:problemSolving", "axis:artRealism", "axis:visualSoftness"}
    if set(by_fact) != expected_unknown | {"axis:romance"}:
        raise IntegrationError("effective URL repair decision membership drift")
    for fact_key in expected_unknown:
        decision = by_fact[fact_key]
        if (
            decision.get("action") != "REBIND_EFFECTIVE_UNKNOWN"
            or decision.get("state") != "unknown"
            or decision.get("value") is not None
            or decision.get("confidence") is not None
            or decision.get("panelDecision") != "explicitUnknown"
        ):
            raise IntegrationError(f"effective URL repair unknown decision drift: {fact_key}")
    decision = by_fact["axis:romance"]
    if (
        result.get("workId") != "work-28249a5ba5e717ee2732"
        or decision.get("action") != "REBIND_EFFECTIVE_CLAIM"
        or (decision.get("state"), decision.get("value"), decision.get("confidence")) != ("known", 4, 0.99)
        or decision.get("panelDecision") != "accepted"
    ):
        raise IntegrationError("effective URL repair romance decision drift")
    work_id = result["workId"]
    for item in result["rawUrlNormalizations"]:
        cursor = con.execute(
            "update source_evidence set sourceUrl=?,notes=notes||? where id=? and workId=? and sourceUrl=?",
            (item["cleanUrl"], "; effectiveUrlRepair=mechanical-terminal-backtick-removal", item["evidenceId"], work_id, item["rawUrl"]),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"effective URL normalization lost exact source row: {item['evidenceId']}")
    # The current supplemental schema uses evidenceId; preserve compatibility with
    # the frozen publisher helper's older id spelling without widening authority.
    supplemental = {
        (row.get("evidenceId") or row.get("id")): row
        for row in read_csv(batch_root / "followup-panel-input-v1" / "chunks" / "chunk-06" / "supplemental-evidence.csv")
    }
    new_sources: dict[str, dict[str, str]] = {}
    for evidence_id in decision["evidenceIds"]:
        existing = con.execute("select workId,sourceUrl from source_evidence where id=?", (evidence_id,)).fetchone()
        source = supplemental.get(evidence_id)
        if source is None or source["workId"] != work_id or source["sourceUrl"] not in decision["citationUrls"]:
            raise IntegrationError(f"effective URL repair supplemental evidence missing: {evidence_id}")
        if existing is not None:
            if existing != (work_id, source["sourceUrl"]):
                raise IntegrationError(f"effective URL repair existing evidence drift: {evidence_id}")
            continue
        new_sources[evidence_id] = {
            "workId": work_id, "sourceUrl": source["sourceUrl"], "sourceType": source["sourceType"],
            "fetchedAt": source["retrievedAt"], "confidence": "",
            "notes": (
                "candidateOnly=true; reviewedByHuman=false; authorityKind=authorizedEvidencePanel; "
                f"entryScope={source['entryScope']}; observation={source['observation']}; limitation={source['limitation']}; grokUsed=false"
            ),
        }
    normalizations = insert_evidence(con, new_sources, "integration/effective-url-source")
    for fact_key in sorted(expected_unknown):
        axis_id = fact_key.split(":", 1)[1]
        cursor = con.execute(
            "update source_factors set state='unknown',value='',confidence='',evidenceId='' where workId=? and axisId=?",
            (work_id, axis_id),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"effective URL repair unknown rebind lost row: {fact_key}")
    payload = json.dumps(decision, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    claim_id = "ev-authorized-url-repair-" + hashlib.sha256(payload.encode("utf-8")).hexdigest()
    normalizations += insert_evidence(con, {claim_id: {
        "workId": work_id, "targetType": "axis", "targetId": "romance", "sourceUrl": sorted(decision["citationUrls"])[0],
        "sourceType": "manual", "fetchedAt": "2026-09-02T12:00:00+09:00", "confidence": str(decision["confidence"]),
        "notes": (
            "candidateOnly=true; reviewedByHuman=false; authorityKind=authorizedEvidencePanel; "
            f"factKey=axis:romance; decision=accepted; value=4; evidenceIdsJson={json.dumps(decision['evidenceIds'], ensure_ascii=False, separators=(',', ':'))}; "
            f"citationUrlsJson={json.dumps(decision['citationUrls'], ensure_ascii=False, separators=(',', ':'))}; "
            f"observation={decision['observation']}; limitation={decision['limitation']}; reviewSha256={sha256(review_path)}; grokUsed=false"
        ),
    }}, "integration/effective-url-claim")
    cursor = con.execute(
        "update source_factors set state='known',value='4',confidence='0.99',evidenceId=? where workId=? and axisId='romance'",
        (claim_id, work_id),
    )
    if cursor.rowcount != 1:
        raise IntegrationError("effective romance factor rebind lost row")
    return len(result["rawUrlNormalizations"]), claim_id, normalizations


def coverage(con: sqlite3.Connection, work_id: str) -> tuple[int, int, int, int, list[str]]:
    known = {row[0] for row in con.execute("select axisId from source_factors where workId=? and state='known'", (work_id,))}
    narrative = {"progression", "problemSolving", "strategy", "pacing", "mysteryReveal", "worldBuilding"}
    tone = {"comedy", "darkness", "mentalStress", "romance", "emotionalWarmth", "relationshipStructure", "characterArcWeight"}
    genres = [item for item in con.execute("select genres from source_works where id=?", (work_id,)).fetchone()[0].split(";") if item]
    themes = con.execute("select count(*) from source_themes where workId=?", (work_id,)).fetchone()[0]
    counts = (len(known & narrative), len(known & tone), len(genres), themes)
    blockers = []
    if counts[0] < 4: blockers.append("NARRATIVE_COVERAGE_INCOMPLETE")
    if counts[1] < 5: blockers.append("TONE_COVERAGE_INCOMPLETE")
    if counts[2] < 1: blockers.append("GENRE_COVERAGE_MISSING")
    if counts[3] < 1: blockers.append("THEME_COVERAGE_MISSING")
    return (*counts, blockers)


def set_final_statuses(
    con: sqlite3.Connection,
    final: dict[str, str],
    work_results: dict[str, dict[str, str]],
    reviewed_at: str,
    onboarding: dict[str, str],
) -> dict[str, tuple[int, int, int, int]]:
    counts: dict[str, tuple[int, int, int, int]] = {}
    for work_id in sorted(final):
        narrative, tone, genres, themes, blockers = coverage(con, work_id)
        expected = final[work_id]
        actual = "BLOCKED_FACTOR" if blockers else "PASS"
        if actual != expected:
            raise IntegrationError(f"coverage/status mismatch: {work_id} expected={expected} actual={actual} blockers={blockers}")
        prior = work_results.get(work_id)
        if prior and (narrative, tone, genres, themes) != tuple(int(prior[key]) for key in ("narrativeKnown", "toneKnown", "genreKnown", "themeKnown")):
            raise IntegrationError(f"correction coverage readback mismatch: {work_id}")
        recommendation, library = ("true", "false") if expected == "PASS" else ("false", "true")
        reference = REVIEW_REFERENCE if expected == "PASS" else ""
        method = "authorizedEvidencePanel" if expected == "PASS" else "unreviewed"
        effective_reviewed_at = reviewed_at if expected == "PASS" else ""
        cursor = con.execute(
            "update source_works set onboardingEligible=?,recommendationEligible=?,libraryOnly=?,annotationReviewMethod=?,annotationReviewedAt=?,annotationReviewReference=? where id=?",
            (onboarding[work_id], recommendation, library, method, effective_reviewed_at, reference, work_id),
        )
        if cursor.rowcount != 1:
            raise IntegrationError(f"target work missing: {work_id}")
        if expected != "PASS":
            con.execute("delete from source_recommendation_context where workId=?", (work_id,))
        elif con.execute("select count(*) from source_recommendation_context where workId=?", (work_id,)).fetchone()[0] != 1:
            raise IntegrationError(f"PASS lacks exact recommendation context: {work_id}")
        counts[work_id] = (narrative, tone, genres, themes)
    return counts


def sqlite_check(path: Path, expected_tables: set[str]) -> None:
    for suffix in ("-wal", "-shm", "-journal"):
        if Path(str(path) + suffix).exists():
            raise IntegrationError(f"SQLite sidecar exists: {path}{suffix}")
    con = sqlite3.connect(f"file:{path.as_posix()}?mode=ro", uri=True)
    try:
        if con.execute("pragma integrity_check").fetchone()[0] != "ok" or con.execute("pragma foreign_key_check").fetchall():
            raise IntegrationError(f"SQLite integrity failure: {path}")
        tables = {row[0] for row in con.execute("select name from sqlite_master where type='table'")}
        if tables != expected_tables:
            raise IntegrationError(f"SQLite table set drift: {path}: {sorted(tables)}")
    finally:
        con.close()


def write_manifest(root: Path) -> Path:
    manifest = root / "MANIFEST.sha256"
    lines = []
    paths = (item for item in root.rglob("*") if item.is_file() and item != manifest)
    for path in sorted(paths, key=lambda item: item.relative_to(root).as_posix()):
        lines.append(f"{sha256(path)}  {path.relative_to(root).as_posix()}")
    manifest.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    return manifest


def blob_sha1(path: Path) -> str:
    data = path.read_bytes()
    return hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()


def bind_input_manifest(batch_root: Path, external_root: Path) -> tuple[bytes, list[tuple[str, Path]]]:
    external_result = external_root / "result"
    members: list[tuple[str, Path]] = [
        ("external/catalog-expanded.candidate.sqlite", external_result / "catalog-expanded.candidate.sqlite"),
        ("external/catalog-source-registry.candidate.sqlite", external_result / "catalog-source-registry.candidate.sqlite"),
        ("external/MANIFEST.sha256", external_result / "MANIFEST.sha256"),
        ("external/machine-validation.batch-008.json", external_result / "machine-validation.batch-008.json"),
        ("external/reproducibility-report.batch-008.json", external_result / "reproducibility-report.batch-008.json"),
        ("external/root-MANIFEST.sha256", external_root / "MANIFEST.sha256"),
        ("external/batch-001-targets.csv", external_result / "batch-001-targets.csv"),
        ("external/claim-ledger.batch-001.csv", external_result / "claim-ledger.batch-001.csv"),
        ("external/evidence-panel-ledger.batch-001.csv", external_result / "evidence-panel-ledger.batch-001.csv"),
        ("external/evidence-panel-summary.batch-001.json", external_result / "evidence-panel-summary.batch-001.json"),
        ("external/recommendation-context-ledger.batch-001.csv", external_result / "recommendation-context-ledger.batch-001.csv"),
        ("external/promotion-ledger.csv", external_result / "promotion-ledger.csv"),
        ("external/authorized-evidence-panel-v5-batch-001.md", external_result / "authorized-evidence-panel-v5-batch-001.md"),
        ("external/PANEL-INPUT.batch-001.sha256", external_root / "PANEL-INPUT.batch-001.sha256"),
        ("external/PANEL-RESULT.batch-001.sha256", external_root / "PANEL-RESULT.batch-001.sha256"),
        ("followup/PANEL-INPUT.sha256", batch_root / "followup-panel-input-v1" / "PANEL-INPUT.sha256"),
        ("correction/TARGETS.sha256", batch_root / "initial-pass-correction-v1" / "TARGETS.sha256"),
        ("safety/MANIFEST.sha256", batch_root / "safety-recheck-v1" / "MANIFEST.sha256"),
        ("effective-url-repair/RESULT.json", batch_root / "effective-url-repair-v1" / "RESULT.json"),
        ("effective-url-repair/REVIEW-REQUEST.md", batch_root / "effective-url-repair-v1" / "REVIEW-REQUEST.md"),
        ("effective-url-repair/MANIFEST.sha256", batch_root / "effective-url-repair-v1" / "MANIFEST.sha256"),
        ("effective-url-repair/SECOND-INDEPENDENT-REVIEW.json", batch_root / "effective-url-repair-v1" / "SECOND-INDEPENDENT-REVIEW.json"),
        ("effective-url-repair/SECOND-INDEPENDENT-REVIEW.md", batch_root / "effective-url-repair-v1" / "SECOND-INDEPENDENT-REVIEW.md"),
    ]
    packet_root = external_root / "overlay" / "data" / "staging" / "catalog-expansion" / "v5-panel" / "batch-001" / "evidence-packets"
    packet_manifests = sorted(packet_root.glob("work-*/PACKET.sha256"), key=lambda path: path.parent.name)
    if len(packet_manifests) != 200:
        raise IntegrationError(f"original Batch001 packet membership drift: {len(packet_manifests)}")
    members.extend((f"external/evidence-packets/{path.parent.name}/PACKET.sha256", path) for path in packet_manifests)
    for index in range(1, 11):
        members.extend([
            (f"followup/result/chunk-{index:02d}/PANEL-RESULT.sha256", batch_root / "followup-panel-output-v1" / f"chunk-{index:02d}" / "PANEL-RESULT.sha256"),
            (f"followup/review/chunk-{index:02d}/REVIEW.json", batch_root / "followup-panel-review-v1" / f"chunk-{index:02d}" / "REVIEW.json"),
            (f"followup/review/chunk-{index:02d}/REVIEW.md", batch_root / "followup-panel-review-v1" / f"chunk-{index:02d}" / "REVIEW.md"),
            (f"correction/result/chunk-{index:02d}/MANIFEST.sha256", batch_root / "initial-pass-correction-v1" / "results" / f"chunk-{index:02d}" / "MANIFEST.sha256"),
        ])
    for chunk in EXPECTED_FOLLOWUP_HASH_ADDENDA:
        for filename in ("REVIEW.json", "REVIEW.md", "MANIFEST.sha256"):
            members.append((
                f"followup/hash-addenda/chunk-{chunk}/{filename}",
                batch_root / "followup-review-hash-addenda" / f"chunk-{chunk}" / filename,
            ))
    for name in EXPECTED_CORRECTION_REVIEWS:
        for filename in ("REVIEW.json", "REVIEW.md"):
            members.append((f"correction/review/{name}/{filename}", batch_root / "initial-pass-correction-v1" / "reviews" / name / filename))
    for index in range(1, 10):
        members.append((f"safety/result/chunk-{index:02d}/MANIFEST.sha256", batch_root / "safety-recheck-v1" / "chunks" / f"chunk-{index:02d}" / "MANIFEST.sha256"))
    for name in EXPECTED_SAFETY_REVIEWS:
        for filename in ("REVIEW.json", "REVIEW.md"):
            members.append((f"safety/review/{name}/{filename}", batch_root / "safety-recheck-v1" / "reviews" / name / filename))
    invalid = [name for name, path in members if not path.is_file() or path.is_symlink()]
    if invalid:
        raise IntegrationError(f"combined input manifest member missing or symlinked: {invalid}")
    content = "".join(f"{sha256(path)}  {name}\n" for name, path in sorted(members)).encode("utf-8")
    # Consume the just-created binding before any output is made.
    parsed = [line.split(None, 1) for line in content.decode("utf-8").splitlines()]
    if len(parsed) != len(members) or any(sha256(dict(members)[name.strip()]) != digest for digest, name in parsed):
        raise IntegrationError("combined input manifest self-check failed")
    return content, members


def copy_audit_tree(batch_root: Path, external_root: Path, target: Path) -> None:
    target.mkdir(parents=True)
    external_target = target / "external"
    external_target.mkdir()
    for relative in (
        "BATCH-STATUS.json", "PANEL-INPUT.batch-001.sha256", "PANEL-RESULT.batch-001.sha256",
        "result/machine-validation.batch-001.json", "result/machine-validation.batch-008.json",
        "result/reproducibility-report.batch-001.json", "result/reproducibility-report.batch-008.json",
        "result/authoring-summary.json", "result/batch-001-targets.csv",
        "result/claim-ledger.batch-001.csv", "result/evidence-panel-ledger.batch-001.csv",
        "result/evidence-panel-summary.batch-001.json", "result/recommendation-context-ledger.batch-001.csv",
        "result/promotion-ledger.csv", "result/authorized-evidence-panel-v5-batch-001.md",
    ):
        source = external_root / relative
        destination = external_target / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    shutil.copy2(external_root / "MANIFEST.sha256", external_target / "SOURCE-root-MANIFEST.sha256")
    shutil.copy2(external_root / "result" / "MANIFEST.sha256", external_target / "result" / "SOURCE-MANIFEST.sha256")
    (external_target / "PARTIAL-SNAPSHOT.md").write_text(
        "# External audit subset\n\nThis directory is a selected Batch001/cumulative evidence subset, not the full external return tree. "
        "SOURCE-root-MANIFEST.sha256 and result/SOURCE-MANIFEST.sha256 preserve the original source manifests; "
        "the enclosing result/MANIFEST.sha256 binds every file actually packaged here.\n",
        encoding="utf-8", newline="\n",
    )
    shutil.copytree(
        external_root / "overlay" / "data" / "staging" / "catalog-expansion" / "v5-panel" / "batch-001" / "evidence-packets",
        external_target / "evidence-packets",
    )
    shutil.copytree(batch_root / "followup-panel-input-v1", target / "followup" / "input")
    shutil.copytree(batch_root / "followup-panel-output-v1", target / "followup" / "result")
    shutil.copytree(batch_root / "followup-panel-review-v1", target / "followup" / "reviews")
    shutil.copytree(batch_root / "followup-review-hash-addenda", target / "followup" / "hash-addenda")
    correction = target / "correction"
    correction.mkdir()
    for name in ("SCHEMA.md", "TARGETS.sha256", "BUILD-REPORT.json", "BUILD-REPORT.md"):
        shutil.copy2(batch_root / "initial-pass-correction-v1" / name, correction / name)
    shutil.copytree(batch_root / "initial-pass-correction-v1" / "targets", correction / "targets")
    shutil.copytree(batch_root / "initial-pass-correction-v1" / "results", correction / "results")
    shutil.copytree(batch_root / "initial-pass-correction-v1" / "reviews", correction / "reviews")
    safety = target / "safety"
    safety.mkdir()
    for name in ("SCHEMA.md", "MANIFEST.sha256", "BUILD-REPORT.json", "BUILD-REPORT.md"):
        source = batch_root / "safety-recheck-v1" / name
        if source.is_file():
            shutil.copy2(source, safety / name)
    shutil.copy2(batch_root / "safety-recheck-v1" / "targets.csv", safety / "targets.csv")
    shutil.copytree(batch_root / "safety-recheck-v1" / "chunks", safety / "chunks")
    shutil.copytree(batch_root / "safety-recheck-v1" / "reviews", safety / "reviews")
    repair_target = target / "effective-url-repair"
    repair_target.mkdir()
    for name in ("RESULT.json", "REVIEW-REQUEST.md", "MANIFEST.sha256", "SECOND-INDEPENDENT-REVIEW.json", "SECOND-INDEPENDENT-REVIEW.md"):
        shutil.copy2(batch_root / "effective-url-repair-v1" / name, repair_target / name)


def copy_referenced_reviews(db: Path, external_result: Path, repo_root: Path, reviews_dir: Path) -> None:
    con = sqlite3.connect(f"file:{db.as_posix()}?mode=ro", uri=True)
    references = {row[0] for row in con.execute("select distinct annotationReviewReference from source_works where annotationReviewReference<>''")}
    con.close()
    for reference in sorted(references):
        if reference == REVIEW_REFERENCE:
            continue
        if not reference.startswith("reviews/") or "/" in reference[len("reviews/"):]:
            raise IntegrationError(f"invalid review reference: {reference}")
        name = Path(reference).name
        candidates = [external_result / name, repo_root / "data" / "source" / reference]
        source = next((path for path in candidates if path.is_file() and not path.is_symlink()), None)
        if source is None:
            raise IntegrationError(f"review reference cannot be resolved: {reference}")
        destination = reviews_dir / name
        if destination.exists() and sha256(destination) != sha256(source):
            raise IntegrationError(f"review filename collision: {name}")
        if not destination.exists():
            shutil.copy2(source, destination)


def publish(batch_root: Path, external_root: Path, output_root: Path, reviewed_at: str) -> dict[str, object]:
    if output_root.exists():
        raise IntegrationError(f"output exists; refusing overwrite: {output_root}")
    external_result = external_root / "result"
    base_db = external_result / "catalog-expanded.candidate.sqlite"
    base_registry = external_result / "catalog-source-registry.candidate.sqlite"
    repo_root = next((parent for parent in batch_root.parents if (parent / ".git").exists()), None)
    if repo_root is None:
        raise IntegrationError("repository root not found")
    canonical = repo_root / "data" / "source" / "catalog.sqlite"
    gold_path = repo_root / "data" / "staging" / "catalog-expansion" / "gold-set-manifest.json"
    alias_path = batch_root / "overlay" / "data" / "staging" / "catalog-expansion" / "v4-final" / "alias-resolution.csv"
    identities = {
        "base": sha256(base_db), "registry": sha256(base_registry), "canonical": sha256(canonical),
        "canonicalBlob": blob_sha1(canonical), "gold": sha256(gold_path), "aliases": sha256(alias_path),
    }
    expected_identities = {
        "base": EXPECTED_BASE_SHA, "registry": EXPECTED_REGISTRY_SHA, "canonical": EXPECTED_CANONICAL_SHA,
        "canonicalBlob": EXPECTED_CANONICAL_BLOB, "gold": EXPECTED_GOLD_SHA, "aliases": EXPECTED_ALIAS_SHA,
    }
    if identities != expected_identities:
        raise IntegrationError(f"frozen input identity drift: {identities}")
    combined_input_manifest, _ = bind_input_manifest(batch_root, external_root)
    verify_manifest(external_result, external_result / "MANIFEST.sha256")
    sqlite_check(base_db, EXPECTED_TABLES)
    sqlite_check(base_registry, {"registry_meta", "registry_research_attempts", "registry_source_rows"})
    sqlite_check(canonical, EXPECTED_TABLES)
    validator_logs = {
        "followup": run_checked([sys.executable, "-B", str(batch_root / "followup-panel-tools" / "validate_panel_results.py"), "--input-root", str(batch_root / "followup-panel-input-v1"), "--result-root", str(batch_root / "followup-panel-output-v1")], batch_root),
        "correction": run_checked([sys.executable, "-B", str(batch_root / "initial-pass-correction-v1" / "tools" / "validate_corrections.py"), "validate-results", str(batch_root / "initial-pass-correction-v1" / "results")], batch_root),
        "safety": run_checked([sys.executable, "-B", str(batch_root / "safety-recheck-v1" / "tools" / "validate_safety_recheck.py"), "--root", str(batch_root / "safety-recheck-v1")], batch_root),
    }
    review_ledger = []
    review_ledger += validate_review_set(batch_root / "initial-pass-correction-v1" / "reviews", EXPECTED_CORRECTION_REVIEWS)
    review_ledger += validate_review_set(batch_root / "safety-recheck-v1" / "reviews", EXPECTED_SAFETY_REVIEWS)
    for name in EXPECTED_CORRECTION_REVIEWS:
        data = json.loads((batch_root / "initial-pass-correction-v1" / "reviews" / name / "REVIEW.json").read_text(encoding="utf-8-sig"))
        validate_correction_review_hashes(batch_root, data)
    for index in range(1, 11):
        path = batch_root / "followup-panel-review-v1" / f"chunk-{index:02d}" / "REVIEW.json"
        data = json.loads(path.read_text(encoding="utf-8-sig"))
        if review_verdict(data) != "PASS":
            raise IntegrationError(f"followup independent review is not PASS: {path}")
        review_ledger.append({"kind": "followup-panel-review-v1", "reviewId": f"chunk-{index:02d}", "verdict": "PASS", "sha256": sha256(path)})
    review_ledger += validate_followup_hash_addenda(batch_root)
    repair_review_path = batch_root / "effective-url-repair-v1" / "SECOND-INDEPENDENT-REVIEW.json"
    repair_review = json.loads(repair_review_path.read_text(encoding="utf-8-sig"))
    if review_verdict(repair_review) != "PASS" or repair_review.get("promotionVerdict") != "PASS":
        raise IntegrationError("effective URL repair independent review is not PASS")
    if repair_review.get("currentArtifactHashes", {}).get("RESULT.json") != sha256(batch_root / "effective-url-repair-v1" / "RESULT.json"):
        raise IntegrationError("effective URL repair independent review is stale")
    review_ledger.append({
        "kind": "effective-url-repair-v1", "reviewId": "independent-review", "verdict": "PASS",
        "sha256": sha256(repair_review_path),
    })

    corrections, correction_results, rescued = load_corrections(batch_root)
    safety_evidence, safety_claims = load_safety(batch_root)
    target_ids = set(external_batch_targets(external_result))
    if set(correction_results) - target_ids or set(safety_claims) - target_ids:
        raise IntegrationError("integration artifacts exceed external Batch001 membership")
    module = load_followup_module(batch_root)
    _, chunks, _ = module.panel.validate_input(batch_root / "followup-panel-input-v1")
    followup_ids, target_chunks, contexts, supplemental, prior, frozen, packets = module._load_frozen(chunks)
    panel_rows, promotion, _, _ = module._load_panel(batch_root / "followup-panel-input-v1", batch_root / "followup-panel-output-v1", chunks)
    if len(followup_ids) != 51 or followup_ids - target_ids:
        raise IntegrationError("followup target membership drift")
    for work_id, claim in safety_claims.items():
        source = safety_evidence[claim["evidenceIds"]]
        frozen[source["evidenceId"]] = {
            "id": source["evidenceId"], "workId": work_id, "sourceType": source["sourceType"],
            "sourceUrl": source["sourceUrl"], "fetchedAt": source["retrievedAt"] + "T00:00:00+09:00",
            "targetType": "work", "targetId": work_id, "confidence": "0.99",
            "notes": "non-adult; " + source["observation"] + " " + source["limitation"],
            "observation": source["observation"], "limitation": source["limitation"],
        }
        if work_id in followup_ids:
            prior[f"{work_id}\x1fscope:safety"] = {**claim, "packetDigest": packets[work_id]["_packetDigest"]}
    baseline_facts = module._baseline_facts(base_db)
    gold_manifest = module._find_repo_gold_manifest()
    gold_ids = module._load_gold_ids(gold_manifest)
    if target_ids & gold_ids:
        raise IntegrationError("Batch001 overlaps immutable Gold150")
    followup_plan = module._build_plan(
        panel_rows, promotion, contexts, supplemental, frozen, baseline_facts, reviewed_at, REVIEW_REFERENCE,
        packets=packets, chunk_digests={wid: module.sha256(chunk / "CHUNK.sha256") for wid, chunk in target_chunks.items()},
        registry=None, gold_ids=gold_ids, prior=prior,
    )
    followup_plan["legacyPassIds"] = []
    base_con = sqlite3.connect(f"file:{base_db.as_posix()}?mode=ro", uri=True)
    try:
        base_evidence = {
            row[0]: {"workId": row[1], "sourceType": row[2], "notes": row[3]}
            for row in base_con.execute("select id,workId,sourceType,notes from source_evidence")
        }
        evidence_owners = {evidence_id: row["workId"] for evidence_id, row in base_evidence.items()}
    finally:
        base_con.close()
    normalizations = followup_plan.get("evidenceNormalizations", {})
    if not isinstance(normalizations, dict):
        raise IntegrationError("followup evidenceNormalizations is not a mapping")
    normalization_owners = Counter(
        "target" if base_evidence.get(str(evidence_id), {}).get("workId") in target_ids else "other"
        for evidence_id in normalizations
    )
    if len(normalizations) != 1568 or normalization_owners != Counter({"target": 200, "other": 1368}):
        raise IntegrationError(f"legacy evidence normalization scope drift: {normalization_owners}")
    # The followup helper offers a global legacy sourceType rewrite.  The
    # dedicated compatibility projection below owns that change; applying this
    # map here would mutate unrelated batches and overwrite the 28 accepted
    # context bindings in evidenceUpdates.
    followup_plan["evidenceNormalizations"] = {}
    for evidence_id, row in followup_plan.get("newEvidence", {}).items():
        if isinstance(row, dict) and isinstance(row.get("workId"), str):
            evidence_owners[str(evidence_id)] = row["workId"]
    followup_note_normalizations = flatten_followup_evidence_notes(followup_plan, evidence_owners)
    if (
        len(followup_note_normalizations) != 28
        or any(row["workId"] not in target_ids for row in followup_note_normalizations)
    ):
        raise IntegrationError("Batch001 note normalization membership/count drift")
    if (len(followup_plan["passIds"]), len(followup_plan["blockedIds"])) != (28, 23):
        raise IntegrationError("followup result count drift")

    original_pass = {
        work_id for work_id, work in baseline_facts["works"].items()
        if work_id in target_ids and work["recommendationEligible"] == "true" and work["libraryOnly"] == "false"
    }
    if len(original_pass) != 149 or original_pass & followup_ids or original_pass | followup_ids != target_ids:
        raise IntegrationError("external Batch001 original 149/51 partition drift")
    onboarding = {work_id: baseline_facts["works"][work_id]["onboardingEligible"] for work_id in target_ids}
    unaffected = original_pass - set(correction_results)
    if len(unaffected) != 41:
        raise IntegrationError(f"unaffected original PASS count drift: {len(unaffected)}")
    final = {work_id: "PASS" for work_id in unaffected}
    final.update({work_id: row["status"] for work_id, row in correction_results.items()})
    final.update({work_id: ("PASS" if item["panelOutcome"] == "PASS" else "BLOCKED_FACTOR") for work_id, item in promotion.items()})
    if set(final) != target_ids or Counter(final.values()) != Counter({"PASS": 131, "BLOCKED_FACTOR": 69}):
        raise IntegrationError(f"integrated Batch001 count drift: {Counter(final.values())}")

    before_non_targets = snapshot_non_targets(base_db, target_ids)
    temp_root = output_root.with_name(f".{output_root.name}.tmp")
    if temp_root.exists():
        raise IntegrationError(f"temporary output exists: {temp_root}")
    try:
        result = temp_root / "result"
        result.mkdir(parents=True)
        out_db = result / "catalog-expanded.candidate.sqlite"
        out_registry = result / "catalog-source-registry.candidate.sqlite"
        shutil.copy2(base_db, out_db)
        shutil.copy2(base_registry, out_registry)
        module._apply_plan(out_db, followup_plan)
        con = sqlite3.connect(out_db)
        try:
            con.execute("pragma journal_mode=DELETE")
            con.execute("begin immediate")
            explicit_unknown_rows = apply_followup_explicit_unknowns(con, batch_root)
            correction_note_normalizations = apply_corrections(con, corrections, rescued)
            url_repairs = apply_url_repairs(con, batch_root, target_ids)
            safety_rows = {
                evidence_id: {
                    "workId": row["workId"], "sourceUrl": row["sourceUrl"], "sourceType": "manual",
                    "fetchedAt": row["retrievedAt"] + "T00:00:00+09:00", "confidence": "",
                    "notes": (
                        "candidateOnly=true; reviewedByHuman=false; authorityKind=authorizedEvidencePanel; "
                        f"scope:safety; audienceClassification={row['audienceClassification']}; "
                        f"observation={row['observation']}; limitation={row['limitation']}; grokUsed=false"
                    ),
                }
                for evidence_id, row in safety_evidence.items()
            }
            safety_note_normalizations = insert_evidence(con, safety_rows, "integration/safety")
            effective_url_repairs, repair_claim_id, repair_note_normalizations = validate_and_apply_effective_url_repair(con, batch_root)
            note_normalizations = target_existing_note_mutations(
                con,
                base_evidence,
                target_ids,
                set(followup_plan.get("evidenceUpdates", {})),
            )
            confidence_projection, confidence_tuple_digest = project_blank_evidence_confidence(con)
            unknown_adjudication_count, unknown_note_normalizations, unknown_adjudication_ledger = bind_unknown_factor_adjudications(
                con, batch_root, target_ids, module
            )
            generated_claim_date_normalizations = sum(
                row["generatedFetchedAtNormalization"] != "" for row in unknown_adjudication_ledger
            )
            evidence_id_projection = normalize_exact_known_evidence_ids(con)
            exact_id_normalizations = len(evidence_id_projection)
            source_type_projection = project_global_source_types(con)
            fetched_at_projection, fetched_at_tuple_digest = normalize_date_only_fetched_at(con)
            inserted_note_normalizations = (
                correction_note_normalizations
                + safety_note_normalizations
                + repair_note_normalizations
                + unknown_note_normalizations
            )
            note_mutation_counts = Counter(row["source"] for row in note_normalizations)
            if inserted_note_normalizations or len(note_normalizations) != 152:
                raise IntegrationError(f"note-normalization mutation count drift: {len(note_normalizations)}")
            counts = set_final_statuses(con, final, correction_results, reviewed_at, onboarding)
            reindex_counts = reindex_authority_projection(con, REINDEXED_TABLES)
            validate_authority_projection(con)
            con.commit()
        except Exception:
            con.rollback()
            raise
        finally:
            con.close()
        sqlite_check(out_db, EXPECTED_TABLES)
        sqlite_check(out_registry, {"registry_meta", "registry_research_attempts", "registry_source_rows"})
        if sha256(out_registry) != EXPECTED_REGISTRY_SHA:
            raise IntegrationError("copied source registry is not byte-identical")
        if snapshot_non_targets(out_db, target_ids) != before_non_targets:
            raise IntegrationError("non-Batch001 catalog rows changed")

        con = sqlite3.connect(f"file:{out_db.as_posix()}?mode=ro", uri=True)
        validate_authority_projection(con)
        dangling = sum(con.execute(f"select count(*) from {table} t left join source_evidence e on e.id=t.evidenceId where t.evidenceId<>'' and e.id is null").fetchone()[0] for table in ("source_works", "source_factors", "source_themes", "source_volumes"))
        recommendation_rows = con.execute("select count(*) from source_works where recommendationEligible='true' and libraryOnly='false'").fetchone()[0]
        panel_recommendation_rows = con.execute("select count(*) from source_works where annotationReviewMethod='authorizedEvidencePanel' and recommendationEligible='true' and libraryOnly='false'").fetchone()[0]
        context_rows = con.execute("select count(*) from source_recommendation_context").fetchone()[0]
        work_rows = con.execute("select count(*) from source_works").fetchone()[0]
        replacement_refs = con.execute("select count(*) from source_works where annotationReviewReference=?", (REVIEW_REFERENCE,)).fetchone()[0]
        stale_refs = con.execute("select count(*) from source_works where annotationReviewReference='reviews/authorized-evidence-panel-v5-batch-001.md'").fetchone()[0]
        factor_rows = con.execute("select count(*) from source_factors").fetchone()[0]
        evidence_rows = con.execute("select count(*) from source_evidence").fetchone()[0]
        blank_factor_refs = con.execute("select count(*) from source_factors where evidenceId=''").fetchone()[0]
        invalid_source_types = con.execute(
            "select count(*) from source_evidence where sourceType not in ('publisher','manual','model','rakuten')"
        ).fetchone()[0]
        date_only_evidence = con.execute(
            "select count(*) from source_evidence where length(fetchedAt)=10 and substr(fetchedAt,5,1)='-' and substr(fetchedAt,8,1)='-'"
        ).fetchone()[0]
        blank_evidence_confidence = con.execute("select count(*) from source_evidence where confidence=''").fetchone()[0]
        source_type_marker_rows = con.execute(
            "select count(*) from source_evidence where notes like '%normalizedSourceType=manual;%'"
        ).fetchone()[0]
        confidence_marker_rows = con.execute(
            "select count(*) from source_evidence where notes like '%confidenceSemantics=adjudication-record-validity%'"
        ).fetchone()[0]
        malformed_evidence_ids = con.execute(
            "select count(*) from source_evidence where id like '%problemSolving%' or id like '%historicalReconstruction%'"
        ).fetchone()[0]
        con.close()
        reg = sqlite3.connect(f"file:{out_registry.as_posix()}?mode=ro", uri=True)
        registry_rows = reg.execute("select count(*) from registry_source_rows").fetchone()[0]
        reg.close()
        if (dangling or work_rows != 3182 or recommendation_rows != 1717 or context_rows != 1757
                or panel_recommendation_rows != 276 or replacement_refs != 131 or stale_refs or registry_rows != 5750):
            raise IntegrationError(
                f"final validation count mismatch: dangling={dangling} works={work_rows} recommendation={recommendation_rows} "
                f"contexts={context_rows} panelRecommendation={panel_recommendation_rows} replacementRefs={replacement_refs} "
                f"staleRefs={stale_refs} registryRows={registry_rows}"
            )
        if (
            factor_rows != 54094
            or evidence_rows != 17693
            or blank_factor_refs
            or invalid_source_types
            or date_only_evidence
            or blank_evidence_confidence
            or source_type_marker_rows != 1541
            or confidence_marker_rows != 883
            or malformed_evidence_ids
        ):
            raise IntegrationError(
                "source schema compatibility count mismatch: "
                f"factors={factor_rows} evidence={evidence_rows} blankFactorRefs={blank_factor_refs} "
                f"invalidSourceTypes={invalid_source_types} dateOnly={date_only_evidence} "
                f"blankEvidenceConfidence={blank_evidence_confidence} sourceTypeMarkers={source_type_marker_rows} "
                f"confidenceMarkers={confidence_marker_rows} malformedEvidenceIds={malformed_evidence_ids}"
            )

        promotion_rows = []
        for work_id in sorted(final):
            n, t, g, th = counts[work_id]
            blockers = [] if final[work_id] == "PASS" else [
                code for code, failed in (
                    ("NARRATIVE_COVERAGE_INCOMPLETE", n < 4), ("TONE_COVERAGE_INCOMPLETE", t < 5),
                    ("GENRE_COVERAGE_MISSING", g < 1), ("THEME_COVERAGE_MISSING", th < 1),
                ) if failed
            ]
            promotion_rows.append({
                "workId": work_id, "batchId": "001", "finalStatus": final[work_id],
                "recommendationEligible": "true" if final[work_id] == "PASS" else "false",
                "libraryOnly": "false" if final[work_id] == "PASS" else "true",
                "narrativeKnown": n, "toneKnown": t, "genreKnown": g, "themeKnown": th,
                "safetyState": "SAFE" if work_id in safety_claims else "NOT_REQUIRED_BLOCKED_FACTOR",
                "factorBlockerCodes": ";".join(blockers),
                "contextState": "present" if final[work_id] == "PASS" else "absent",
                "candidateOnly": "true", "reviewedByHuman": "false",
                "reviewReference": REVIEW_REFERENCE if final[work_id] == "PASS" else "",
            })
        write_csv(result / "promotion-ledger.csv", list(promotion_rows[0]), promotion_rows)
        correction_fields = list(corrections[0]) + ["independentReviewReference"]
        correction_ledger = [{**row, "independentReviewReference": REVIEW_REFERENCE} for row in corrections]
        write_csv(result / "correction-ledger.csv", correction_fields, correction_ledger)
        write_csv(result / "review-ledger.csv", ["kind", "reviewId", "verdict", "sha256"], review_ledger)
        write_csv(
            result / "unknown-factor-adjudication-ledger.csv",
            ["workId", "axisId", "evidenceId", "adjudicationSource", "bindingAction", "factorState", "factorValue", "factorConfidence", "previousEvidenceConfidence", "evidenceConfidence", "confidenceSemantics", "generatedFetchedAtNormalization"],
            unknown_adjudication_ledger,
        )
        unknown_adjudication_digest = sha256(result / "unknown-factor-adjudication-ledger.csv")
        write_csv(result / "evidence-ledger.csv", ["evidenceId", "workId", "kind", "sourceUrl", "candidateOnly", "reviewedByHuman", "grokUsed"], [
            *({"evidenceId": row["evidenceId"], "workId": row["workId"], "kind": "factor-rescue", "sourceUrl": row["sourceUrl"], "candidateOnly": "true", "reviewedByHuman": "false", "grokUsed": "false"} for row in rescued),
            *({"evidenceId": row["evidenceId"], "workId": row["workId"], "kind": "safety", "sourceUrl": row["sourceUrl"], "candidateOnly": "true", "reviewedByHuman": "false", "grokUsed": "false"} for row in safety_evidence.values()),
            {"evidenceId": repair_claim_id, "workId": "work-28249a5ba5e717ee2732", "kind": "effective-url-repair", "sourceUrl": "https://honto.jp/cp/bl/yuuthunaasa.html", "candidateOnly": "true", "reviewedByHuman": "false", "grokUsed": "false"},
        ])
        write_csv(
            result / "note-normalization-ledger.csv",
            ["evidenceId", "workId", "source", "operation", "oldNotesSha256", "newNotesSha256"],
            note_normalizations,
        )
        note_normalization_digest = sha256(result / "note-normalization-ledger.csv")
        write_csv(
            result / "source-type-compatibility-ledger.csv",
            ["evidenceId", "workId", "sourceUrlSha256", "oldSourceType", "newSourceType", "oldNotesSha256", "newNotesSha256"],
            source_type_projection,
        )
        source_type_projection_digest = sha256(result / "source-type-compatibility-ledger.csv")
        write_csv(
            result / "fetched-at-compatibility-ledger.csv",
            ["evidenceId", "workId", "oldFetchedAt", "newFetchedAt"],
            fetched_at_projection,
        )
        fetched_at_projection_digest = sha256(result / "fetched-at-compatibility-ledger.csv")
        write_csv(
            result / "evidence-confidence-compatibility-ledger.csv",
            ["evidenceId", "workId", "targetType", "targetId", "oldConfidence", "newConfidence", "confidenceSemantics"],
            confidence_projection,
        )
        confidence_projection_digest = sha256(result / "evidence-confidence-compatibility-ledger.csv")
        write_csv(
            result / "evidence-id-compatibility-ledger.csv",
            ["workId", "targetType", "targetId", "referenceTable", "oldEvidenceId", "newEvidenceId"],
            evidence_id_projection,
        )
        evidence_id_projection_digest = sha256(result / "evidence-id-compatibility-ledger.csv")
        combined_schema_projection = sorted(
            [
                {
                    "repairKind": "fetchedAt",
                    "evidenceId": row["evidenceId"], "workId": row["workId"],
                    "targetType": "", "targetId": "", "oldValue": row["oldFetchedAt"],
                    "newValue": row["newFetchedAt"], "semantics": "rfc3339-midnight-jst",
                }
                for row in fetched_at_projection
            ]
            + [
                {
                    "repairKind": "confidence",
                    "evidenceId": row["evidenceId"], "workId": row["workId"],
                    "targetType": row["targetType"], "targetId": row["targetId"],
                    "oldValue": row["oldConfidence"], "newValue": row["newConfidence"],
                    "semantics": row["confidenceSemantics"],
                }
                for row in confidence_projection
            ]
            + [
                {
                    "repairKind": "evidenceId",
                    "evidenceId": row["newEvidenceId"], "workId": row["workId"],
                    "targetType": row["targetType"], "targetId": row["targetId"],
                    "oldValue": row["oldEvidenceId"], "newValue": row["newEvidenceId"],
                    "semantics": f"mechanical-kebab-case;referenceTable={row['referenceTable']}",
                }
                for row in evidence_id_projection
            ],
            key=lambda row: (row["repairKind"], row["evidenceId"]),
        )
        write_csv(
            result / "evidence-schema-compatibility-ledger.csv",
            ["repairKind", "evidenceId", "workId", "targetType", "targetId", "oldValue", "newValue", "semantics"],
            combined_schema_projection,
        )
        combined_schema_projection_digest = sha256(result / "evidence-schema-compatibility-ledger.csv")
        reviews_dir = result / "reviews"
        reviews_dir.mkdir()
        review_hash = hashlib.sha256("".join(sorted(item["sha256"] for item in review_ledger)).encode()).hexdigest()
        input_bindings = {
            name.strip(): digest
            for digest, name in (line.split(None, 1) for line in combined_input_manifest.decode("utf-8").splitlines())
        }
        manifest_lines = [
            f"  - `{name}`: `{digest}`"
            for name, digest in sorted(input_bindings.items())
            if (
                "PANEL-RESULT.sha256" in name
                or "/result/chunk-" in name and name.endswith("MANIFEST.sha256")
                or name in {"correction/TARGETS.sha256", "safety/MANIFEST.sha256", "followup/PANEL-INPUT.sha256"}
            )
        ]
        review_lines = [f"  - `{item['kind']}/{item['reviewId']}`: `{item['sha256']}`" for item in sorted(review_ledger, key=lambda item: (item["kind"], item["reviewId"]))]
        packet_digest = hashlib.sha256(
            "".join(f"{name}={digest}\n" for name, digest in sorted(input_bindings.items()) if "/evidence-packets/" in name).encode("utf-8")
        ).hexdigest()
        (reviews_dir / "authorized-evidence-panel-v1-batch-001.md").write_text(
            "# Authorized evidence panel — integrated Batch001\n\n"
            "- Decision authority: authorizedEvidencePanel (non-human evidence panel)\n"
            "- candidateOnly: true\n- reviewedByHuman: false\n- Grok used: false\n- AniList authorizing evidence: none\n"
            f"- Canonical immutable Catalog SHA256/blob: `{identities['canonical']}` / `{identities['canonicalBlob']}`\n"
            f"- Frozen cumulative Batch008 candidate SHA256: `{identities['base']}`\n"
            f"- Frozen source registry SHA256: `{identities['registry']}`\n"
            f"- Gold manifest / alias-resolution SHA256: `{identities['gold']}` / `{identities['aliases']}`\n"
            f"- COMBINED-INPUT.sha256 file SHA256: `{hashlib.sha256(combined_input_manifest).hexdigest()}`\n"
            f"- Original Batch001 claim ledger SHA256: `{input_bindings['external/claim-ledger.batch-001.csv']}`\n"
            f"- Original Batch001 200 packet-manifest aggregate SHA256: `{packet_digest}`\n"
            f"- Review set aggregate digest: `{review_hash}`\n- Final outcome: 131 PASS / 69 BLOCKED_FACTOR\n"
            f"- Unknown-factor adjudication ledger SHA256: `{unknown_adjudication_digest}` (658 exact bindings; factor value/confidence remain blank)\n"
            f"- Generated followup claim fetchedAt normalization: {generated_claim_date_normalizations} rows, recorded per row in the unknown-factor adjudication ledger\n"
            f"- Global schema compatibility ledgers: sourceType `{source_type_projection_digest}`, fetchedAt `{fetched_at_projection_digest}`, evidence confidence `{confidence_projection_digest}`, evidence ID `{evidence_id_projection_digest}`, combined `{combined_schema_projection_digest}`\n"
            "- Structural projection exception: source_themes and source_recommendation_context sourceOrdinal/sourceLine only; all non-target semantic columns, keys, order, and counts remain exact\n"
            "- Compatibility distribution: outside Batch001 only 1,368 cohortSupport sourceType projections and three malformed evidence IDs/references; all 225 fetchedAt lexical projections and the remaining 173 sourceType projections belong to Batch001.\n"
            "- BLOCKED_FACTOR means factor evidence is incomplete; it is not a support rejection.\n\n"
            "## Frozen panel/result manifests\n\n" + "\n".join(manifest_lines) + "\n\n"
            "## Independent review digests\n\n" + "\n".join(review_lines) + "\n",
            encoding="utf-8", newline="\n",
        )
        copy_referenced_reviews(out_db, external_result, repo_root, reviews_dir)
        (result / "COMBINED-INPUT.sha256").write_bytes(combined_input_manifest)
        copy_audit_tree(batch_root, external_root, result / "audit")
        (result / "catalog-diff.md").write_text(
            "# Catalog integration diff\n\n"
            f"- External Batch008 candidate SHA256: `{sha256(base_db)}`\n"
            f"- Integrated candidate SHA256: `{sha256(out_db)}`\n"
            "- Batch001: external 149 PASS / 51 BLOCKED -> integrated 131 PASS / 69 BLOCKED_FACTOR\n"
            "- Cumulative external targets: 276 PASS / 1,292 BLOCKED\n"
            "- Recommendation contexts: 1,757\n"
            f"- Verified malformed URL rows repaired: {url_repairs}\n"
            f"- Followup explicitUnknown bindings projected: {explicit_unknown_rows}; effective URL repairs: {effective_url_repairs}\n"
            f"- Existing evidence note mutations: 152 exact Batch001-owned rows (initial URL repair {note_mutation_counts['integration/initial-url-repair']}; effective URL repair {note_mutation_counts['integration/effective-url-repair']}; followup update {note_mutation_counts['followup-plan/evidenceUpdates']}; context correction {note_mutation_counts['integration/context-correction']}); ledger SHA256 `{note_normalization_digest}`\n"
            f"- Schema repairs: {unknown_adjudication_count} B001 unknown adjudication bindings (ledger SHA256 `{unknown_adjudication_digest}`); {exact_id_normalizations} exact kebab-case evidence-ID normalizations (ledger SHA256 `{evidence_id_projection_digest}`)\n"
            f"- Generated followup claim fetchedAt values normalized at construction: {generated_claim_date_normalizations} date-only→RFC3339 rows (separate from the frozen-input 225-row ledger)\n"
            f"- Global sourceType compatibility projection: {len(source_type_projection)} exact rows; ledger SHA256 `{source_type_projection_digest}`\n"
            f"- Date-only fetchedAt compatibility projection: {len(fetched_at_projection)} exact rows; ledger SHA256 `{fetched_at_projection_digest}`\n"
            f"- Evidence confidence compatibility projection: {len(confidence_projection)} adjudication-validity rows; ledger SHA256 `{confidence_projection_digest}`\n"
            f"- Evidence schema combined ledger SHA256: `{combined_schema_projection_digest}` (independent tuple digests fetchedAt `{fetched_at_tuple_digest}`, confidence `{confidence_tuple_digest}`)\n"
            "- Existing 150-work Gold Set: unchanged except its authorized positional reindex metadata where applicable\n"
            "- Structural projection exception: sourceOrdinal/sourceLine were deterministically reindexed only in source_themes and source_recommendation_context; non-target keys/order/counts and semantic payloads are unchanged\n"
            "- Compatibility distribution: outside Batch001 only 1,368 cohortSupport sourceType projections and three exact malformed evidence-ID/reference renames; inside Batch001 172 cohortSupport plus one licensedPlatform sourceType projection and 225 fetchedAt lexical projections\n"
            "- Source registry: byte-identical to frozen Batch008 input\n",
            encoding="utf-8", newline="\n",
        )
        (result / "validation-report.md").write_text(
            "# Integration validation report\n\n- Result: **PASS**\n"
            "- Followup panel validator: PASS (51; 28 PASS / 23 BLOCKED)\n"
            "- Correction validator: PASS (491: 303 BLOCKED_FACTOR / 113 CORRECTED / 75 RESCUED; 62 PASS / 46 BLOCKED_FACTOR affected works)\n"
            "- Safety validator: PASS (177 SAFE / 0 BLOCKED_SAFETY)\n"
            "- Independent reviews: PASS (10 followup semantic, 4 followup hash-binding addenda, 6 correction, 5 safety, 1 effective URL repair)\n"
            f"- Followup explicitUnknown projection: {explicit_unknown_rows} rows; effective URL repair: {effective_url_repairs} exact normalizations\n"
            f"- Existing evidence note mutation audit: PASS; 152 exact Batch001-owned old/new note hashes in note-normalization-ledger.csv (`{note_normalization_digest}`; initial URL repair {note_mutation_counts['integration/initial-url-repair']}, effective URL repair {note_mutation_counts['integration/effective-url-repair']}, followup update {note_mutation_counts['followup-plan/evidenceUpdates']}, context correction {note_mutation_counts['integration/context-correction']}, non-target 0)\n"
            f"- Schema repairs applied: {unknown_adjudication_count} B001 unknown adjudication bindings in unknown-factor-adjudication-ledger.csv (`{unknown_adjudication_digest}`); {exact_id_normalizations} exact kebab-case evidence-ID normalizations in evidence-id-compatibility-ledger.csv (`{evidence_id_projection_digest}`)\n"
            f"- Generated followup claim fetchedAt construction rule: PASS; {generated_claim_date_normalizations} date-only values projected to JST midnight, recorded in the adjudication ledger and excluded from the independently audited frozen-input 225-row digest\n"
            f"- Global sourceType compatibility projection: PASS; {len(source_type_projection)} exact raw→manual rows in source-type-compatibility-ledger.csv (`{source_type_projection_digest}`)\n"
            f"- Date-only fetchedAt compatibility projection: PASS; {len(fetched_at_projection)} exact rows in fetched-at-compatibility-ledger.csv (`{fetched_at_projection_digest}`)\n"
            f"- Evidence confidence compatibility projection: PASS; {len(confidence_projection)} exact rows in evidence-confidence-compatibility-ledger.csv (`{confidence_projection_digest}`)\n"
            f"- Evidence schema combined ledger: `{combined_schema_projection_digest}`; independently reproducible tuple digests fetchedAt `{fetched_at_tuple_digest}` and confidence `{confidence_tuple_digest}`. The auditor's informational combined constant is not asserted because its wrapper/order was unspecified.\n"
            "- Integrated Batch001: 131 PASS / 69 BLOCKED_FACTOR\n"
            "- Cumulative panel targets: 276 PASS / 1,292 BLOCKED\n"
            "- Catalog rows: 3,182; recommendation/context rows: 1,717 / 1,757; authorized panel PASS rows: 276\n"
            "- candidateOnly=true; reviewedByHuman=false; Grok excluded; AniList non-authorizing\n"
            "- SQLite integrity/FK: PASS; dangling evidence: 0; WAL/SHM/journal: absent\n"
            f"- Authority projection: PASS; deterministically reindexed tables/rows: `{json.dumps(reindex_counts, sort_keys=True, separators=(',', ':'))}`\n"
            "- Structural reindex exception changes only sourceOrdinal/sourceLine positional metadata; non-target semantic payload comparison: PASS\n"
            "- Global compatibility exception is limited to the explicitly ledgered sourceType/notes, fetchedAt lexical, and three evidence-ID/reference projections; all other non-Batch001 semantic/identity payload comparison: PASS\n"
            f"- Frozen canonical SHA/blob: `{identities['canonical']}` / `{identities['canonicalBlob']}`; not written\n"
            f"- Frozen Batch008 candidate/registry SHA: `{identities['base']}` / `{identities['registry']}`\n\n"
            "## Validator output\n\n" + "\n".join(f"- {key}: `{value}`" for key, value in validator_logs.items()) + "\n",
            encoding="utf-8", newline="\n",
        )
        manifest = write_manifest(result)
        verify_manifest(result, manifest)
        if sha256(canonical) != EXPECTED_CANONICAL_SHA or blob_sha1(canonical) != EXPECTED_CANONICAL_BLOB:
            raise IntegrationError("canonical catalog changed during publication")
        if sha256(base_db) != EXPECTED_BASE_SHA or sha256(base_registry) != EXPECTED_REGISTRY_SHA:
            raise IntegrationError("frozen Batch008 inputs changed during publication")
        # Windows ReplaceFile semantics can reject a directory source even when
        # the destination is absent. rename is the same-volume atomic operation
        # required here, and the existing-output guard above prevents overwrite.
        os.rename(temp_root, output_root)
        final_result = output_root / "result"
        return {
            "status": "PASS",
            "outputRoot": str(output_root),
            "candidateSha256": sha256(final_result / "catalog-expanded.candidate.sqlite"),
            "registrySha256": sha256(final_result / "catalog-source-registry.candidate.sqlite"),
            "manifestSha256": sha256(final_result / "MANIFEST.sha256"),
            "batch001": {"PASS": 131, "BLOCKED_FACTOR": 69},
            "cumulative": {"PASS": 276, "BLOCKED": 1292},
            "recommendationRows": 1717,
            "recommendationContextRows": 1757,
        }
    except Exception:
        if temp_root.exists():
            shutil.rmtree(temp_root)
        raise


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch-root", type=Path, required=True)
    parser.add_argument("--external-root", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument("--reviewed-at", default=REVIEWED_AT)
    args = parser.parse_args(argv)
    try:
        result = publish(args.batch_root.resolve(), args.external_root.resolve(), args.output_root.resolve(), args.reviewed_at)
    except Exception as error:
        print(json.dumps({"status": "BLOCKED", "error": str(error)}, ensure_ascii=False, sort_keys=True), file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
