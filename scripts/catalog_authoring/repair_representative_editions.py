#!/usr/bin/env python3
"""Copy-on-write correction of a representative edition and its catalog evidence."""
from __future__ import annotations

import argparse
from contextlib import closing
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "scripts"))
import catalog_authoring_runner as runner


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_request(path: Path) -> list[dict]:
    request = runner.panel.read_json(path)
    runner.prepare.require(request.get("schemaVersion") == "representative-edition-correction-v1", "invalid edition request")
    changes = request.get("changes")
    runner.prepare.require(isinstance(changes, list) and changes and len({row["workId"] for row in changes}) == len(changes), "duplicate or empty edition request")
    for row in changes:
        runner.prepare.require(set(row) == {"workId", "isbn", "volumeNumber", "before", "after", "publisherUrl", "captureReceipt"}, "invalid edition change fields")
        runner.prepare.require(row["before"] == "standard" and row["after"] == "limited" and row["publisherUrl"].startswith("https://www.kodansha.co.jp/comic/products/"), "unsupported edition correction")
        receipt = runner.panel.read_json(Path(row["captureReceipt"]))
        body = Path(row["captureReceipt"]).parent / receipt["rawPath"]
        content = body.read_bytes()
        runner.prepare.require(receipt["url"] == row["publisherUrl"] and receipt["status"] == 200 and receipt["complete"] is True and digest(body) == receipt["sha256"] and len(content) == receipt["bytes"], "publisher capture receipt mismatch")
        runner.prepare.require(row["isbn"].encode() in content and ("限定版".encode() in content or "特装版".encode() in content), "publisher page does not prove the exact limited ISBN")
        row["captureBody"] = str(body)
        row["captureSha256"] = receipt["sha256"]
        row["fetchedAt"] = receipt["observedAt"]
    return changes


def correct_catalog(path: Path, changes: list[dict], integration) -> None:
    with closing(sqlite3.connect(path)) as db:
        db.execute("BEGIN IMMEDIATE")
        for row in changes:
            volume = db.execute("select id,evidenceId from source_volumes where workId=? and isbn=? and volumeNumber=? and editionKind=? and isRepresentative='true'", (row["workId"], row["isbn"], row["volumeNumber"], row["before"])).fetchone()
            runner.prepare.require(volume is not None, f"baseline edition changed: {row['workId']}")
            old = db.execute("select notes from source_evidence where id=? and workId=?", (volume[1], row["workId"])).fetchone()
            runner.prepare.require(old is not None and "editionKind=standard" in old[0], f"old edition evidence differs: {row['workId']}")
            evidence_id = "ev-edition-correction-" + hashlib.sha256((row["workId"] + "\n" + row["isbn"] + "\n" + row["publisherUrl"]).encode()).hexdigest()[:24]
            runner.prepare.require(db.execute("select 1 from source_evidence where id=?", (evidence_id,)).fetchone() is None, "edition evidence ID exists")
            ordinal = db.execute("select coalesce(max(sourceOrdinal),0)+1 from source_evidence").fetchone()[0]
            line = db.execute("select coalesce(max(sourceLine),1)+1 from source_evidence").fetchone()[0]
            notes = "candidateOnly=true; exact publisher ISBN and limited/special edition; priorEvidenceId=" + volume[1] + "; captureSha256=" + row["captureSha256"]
            db.execute("insert into source_evidence values(?,?,?,?,?,?,?,?,?,?,?,?,?)", (ordinal, line, evidence_id, row["workId"], "volume", volume[0], "publisher", row["publisherUrl"], row["fetchedAt"], "representativeEditionCorrectionV1", "false", "0.99", notes))
            updated = db.execute("update source_volumes set editionKind=?,evidenceId=? where id=? and workId=? and isbn=? and volumeNumber=? and editionKind=? and evidenceId=?", (row["after"], evidence_id, volume[0], row["workId"], row["isbn"], row["volumeNumber"], row["before"], volume[1]))
            runner.prepare.require(updated.rowcount == 1, f"edition update lost exact row: {row['workId']}")
            row["newEvidenceId"] = evidence_id
            row["oldEvidenceId"] = volume[1]
        integration.reindex_authority_projection(db, {"source_evidence", "source_volumes"})
        integration.validate_authority_projection(db)
        runner.prepare.require(db.execute("pragma integrity_check").fetchone()[0] == "ok" and not db.execute("pragma foreign_key_check").fetchall(), "catalog correction integrity failed")
        db.commit()


def correct_registry(path: Path, changes: list[dict]) -> None:
    with closing(sqlite3.connect(path)) as db:
        db.execute("BEGIN IMMEDIATE")
        for row in changes:
            matches = db.execute("select sourceRowId,bibliographyEvidenceUrls from registry_source_rows where canonicalWorkId=? and representativeIsbn=? and volumeNumber=? and editionKind=?", (row["workId"], row["isbn"], row["volumeNumber"], row["before"])).fetchall()
            runner.prepare.require(len(matches) == 1, f"registry edition mapping changed: {row['workId']}")
            source_id, urls = matches[0]
            members = [part.strip() for part in urls.replace("|", ";").split(";") if part.strip()]
            if row["publisherUrl"] not in members:
                members.append(row["publisherUrl"])
            updated = db.execute("update registry_source_rows set editionKind=?,bibliographyEvidenceUrls=? where sourceRowId=? and editionKind=? and bibliographyEvidenceUrls=?", (row["after"], " | ".join(members), source_id, row["before"], urls))
            runner.prepare.require(updated.rowcount == 1, f"registry edition update lost exact row: {row['workId']}")
        runner.prepare.require(db.execute("pragma integrity_check").fetchone()[0] == "ok" and not db.execute("pragma foreign_key_check").fetchall(), "registry correction integrity failed")
        db.commit()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--request", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    args = parser.parse_args()
    request, output = args.request.resolve(), args.output_root.resolve()
    runner.prepare.require(output.is_relative_to(runner.ROOT / "planning") and request.is_file(), "invalid correction paths")
    changes = read_request(request)
    spec = importlib.util.spec_from_file_location("edition_projection", runner.REPO / "scripts/catalog_authoring/legacy/integration-publisher-v1/integrate.py")
    runner.prepare.require(spec is not None and spec.loader is not None, "projection helper missing")
    integration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(integration)
    with runner.exclusive(runner.REPO / "data/local/catalog-authoring/locks/publication.lock", wait=True):
        state_sha = digest(runner.ROOT / "STATE.json")
        state, baseline = runner.current()
        runner.publisher._verify_result_manifest(baseline)
        stage = output.with_name("." + output.name + ".tmp")
        runner.prepare.require(not output.exists() and not stage.exists(), "correction output exists; inspect before retry")
        shutil.copytree(baseline, stage)
        try:
            for row in changes:
                source = stage / "edition-correction" / row["workId"]
                source.mkdir(parents=True)
                shutil.copy2(row["captureReceipt"], source / "capture-receipt.json")
                shutil.copy2(row["captureBody"], source / "publisher-page.body")
            correct_catalog(stage / "catalog-expanded.candidate.sqlite", changes, integration)
            correct_registry(stage / "catalog-source-registry.candidate.sqlite", changes)
            runner.write(stage / "edition-correction.json", {"schemaVersion": "representative-edition-publication-v1", "requestSha256": digest(request), "beforeCatalogSha256": digest(baseline / "catalog-expanded.candidate.sqlite"), "beforeRegistrySha256": digest(baseline / "catalog-source-registry.candidate.sqlite"), "changes": changes})
            runner.publisher._write_result_manifest(stage)
            runner.publisher._verify_result_manifest(stage)
            os.replace(stage, output)
        except BaseException:
            if stage.exists():
                shutil.rmtree(stage)
            raise
        previous_readback = runner.panel.read_json(runner.ROOT / state["latestCandidate"]["readback"])
        result_root = Path(previous_readback["resultRoot"])
        readback = runner.product_readback(output.parent, output, result_root)
        verified = runner.panel.read_json(readback)
        runner.prepare.require(verified["status"] == "SQL_BUILD_COVERAGE_ENGINE_VERIFIED" and verified["catalogSha256"] == digest(output / "catalog-expanded.candidate.sqlite") and verified["registrySha256"] == digest(output / "catalog-source-registry.candidate.sqlite"), "edition readback identity mismatch")
        storage = runner.preserve([output.parent], "representative-edition-correction:verified")
        runner.prepare.require(storage["backup"]["status"] == "BACKED_UP" and digest(runner.ROOT / "STATE.json") == state_sha, "correction backup or STATE changed")
        previous_count = state["latestCandidate"]["recommendationEligibleCount"]
        state["latestCandidate"] = {"root": str(output.relative_to(runner.ROOT)).replace("\\", "/"), "previousBaselineRoot": str(baseline.relative_to(runner.ROOT)).replace("\\", "/"), "catalogSha256": verified["catalogSha256"], "registrySha256": verified["registrySha256"], "canonicalSha256": verified["canonicalSha256"], "manifestSha256": digest(output / "MANIFEST.sha256"), "catalogVersion": verified["catalogVersion"], "workCount": verified["counts"]["works"], "recommendationEligibleCount": verified["counts"]["eligible"], "libraryOnlyCount": verified["counts"]["libraryOnly"], "promotedWorkCount": verified["counts"]["eligible"] - previous_count, "state": verified["status"], "readback": str(readback.relative_to(runner.ROOT)).replace("\\", "/"), "verifiedAt": verified["verifiedAt"]}
        state["updatedAt"] = runner.utc_now()
        runner.write(runner.ROOT / "STATE.json", state, expected_sha=state_sha)
        state_storage = runner.preserve([runner.ROOT / "STATE.json"], "representative-edition-correction:current")
        print(json.dumps({"status": "VERIFIED", "works": [row["workId"] for row in changes], "eligible": verified["counts"]["eligible"], "publication": str(output), "storage": storage, "stateStorage": state_storage}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
