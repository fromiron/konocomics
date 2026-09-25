#!/usr/bin/env python3
"""Publish checked, immutable decisions serially; read back and back up once per batch."""
from __future__ import annotations

import argparse
from contextlib import closing
import json
import re
from pathlib import Path
import sqlite3
import subprocess
import sys
import time
import uuid

import catalog_authoring_runner as runner


def preflight_scope(error, work_id):
    """Only established Work-local conflicts can be isolated; unknown failures stop the batch."""
    last = error.strip().splitlines()[-1] if error.strip() else ""
    if last.startswith("{"):
        try:
            last = json.loads(last)["error"]
        except (ValueError, KeyError, TypeError):
            return "BATCH"
    match = re.fullmatch(r"[\w.]*PublishError: (.+)", last)
    if match:
        last = match[1]
    return "WORK" if (last == f"frozen registry row set mismatch: {work_id}"
                      or last.startswith(f"accepted baseline axis conflict: {work_id} ")) else "BATCH"


def checked_backup_status(row):
    check = row.get("checkStorage", {})
    return (row.get("backupStatus") or row.get("storage", {}).get("backupStatus")
            or check.get("backup", {}).get("status")
            or check.get("storage", {}).get("backup", {}).get("status"))


def code_identity():
    files = {
        path.relative_to(runner.REPO).as_posix(): runner.panel.sha256(path)
        for path in sorted((runner.REPO / "scripts/catalog_authoring").rglob("*.py"))
        if not path.name.startswith("test_")
    }
    dependencies = ["scripts/workspace_paths.py", "scripts/catalog_workspace.py",
                    "scripts/catalog_authoring_runner.py", "scripts/catalog_authoring_batch_publish.py",
                    "scripts/catalog_readback_identity.py", "data/staging/catalog-expansion/gold-set-manifest.json"]
    dependencies.extend(source for source, _ in runner.prepare.CONTRACTS.values())
    dependencies.extend(path.relative_to(runner.REPO).as_posix()
                        for path in sorted((runner.REPO / "scripts/sql").rglob("*.sql")))
    files.update({str(name): runner.panel.sha256(runner.REPO / name) for name in dependencies})
    return {"protocol": "catalog-preflight-v2", "files": files,
            "pythonVersion": sys.version, "sqliteVersion": sqlite3.sqlite_version}


def preflight_result(identity, command, validate_input=None, *, attempt="initial"):
    started = time.perf_counter()
    identity = {**identity, "protocol": "catalog-preflight-v2", "command": command, "attempt": attempt}
    key = runner.panel.sha256_bytes(json.dumps(identity, sort_keys=True).encode())
    path = runner.ROOT / "planning/publication-preflight" / (key + ".json")
    lock_requested = time.perf_counter()
    with runner.exclusive(path.with_suffix(".lock"), wait=True):
        acquired = time.perf_counter()
        # A persisted manifest digest is not proof that its member bytes survived.
        if validate_input is not None:
            validate_input()
        validated = time.perf_counter()
        reused = path.exists()
        if reused:
            check = runner.panel.read_json(path)
            runner.prepare.require(check["identity"] == identity, "preflight receipt identity changed")
            runner.prepare.require(check["status"] in {"PASS", "BLOCKED"}, "invalid preflight receipt status")
            runner.prepare.require(check["scope"] == (preflight_scope(check["error"], identity["workId"]) if check["status"] == "BLOCKED" else None), "preflight failure scope changed")
        else:
            execution_started = time.perf_counter()
            try:
                result = subprocess.run(command, cwd=runner.REPO, capture_output=True, text=True)
                code, error = result.returncode, result.stderr.strip()
            except OSError as failure:
                code, error = 1, f"{type(failure).__name__}: {failure}"
            execution_finished = time.perf_counter()
            check = {"identity": identity, "status": "PASS" if code == 0 else "BLOCKED",
                     "error": error, "checkedAt": runner.utc_now(),
                     "elapsedSeconds": execution_finished - acquired,
                     "executionSeconds": execution_finished - execution_started}
            check["scope"] = preflight_scope(check["error"], identity["workId"]) if code else None
            runner.write(path, check)
        finished = time.perf_counter()
    return path, {**check, "cacheHit": reused, "originalCheckSeconds": check["elapsedSeconds"],
                  "originalExecutionSeconds": check.get("executionSeconds"),
                  "timingsSeconds": {"lockWait": acquired - lock_requested,
                    "validationElapsed": validated - acquired,
                    "subprocessElapsed": 0 if reused else execution_finished - execution_started,
                    "lookupElapsed": finished - validated if reused else execution_started - validated,
                    "totalElapsed": time.perf_counter() - started}}


def retry_attempts(values, work_ids):
    attempts = {}
    for value in values:
        work_id, separator, attempt = value.partition("=")
        runner.prepare.require(separator and attempt.strip() and work_id in work_ids and work_id not in attempts,
                               "preflight retry must name a unique assigned Work and explicit attempt: WORK=ATTEMPT")
        attempts[work_id] = attempt
    return attempts


def preserve_preflight(batch, summary_path, summary_sha, summary, checks):
    report = {"sourceSummary": {"path": str(summary_path), "sha256": summary_sha},
              "checks": [{key: row[key] for key in ("workId", "path", "sha256", "status", "scope")} for row in checks]}
    report_sha = runner.panel.sha256_bytes(json.dumps(report, sort_keys=True).encode())
    report_root = batch / "preflight" / report_sha
    common_failure = any(item["scope"] == "BATCH" for item in checks)
    passed = {item["workId"] for item in checks if item["status"] == "PASS"}
    outputs = {report_root / "PREFLIGHT.json": report}
    if passed and not common_failure:
        outputs[report_root / "PASS-SUBSET.json"] = {"sourceSummary": report["sourceSummary"],
            "preflight": str(report_root / "PREFLIGHT.json"), "works": [row for row in summary["works"] if row["workId"] in passed]}
    for path, value in outputs.items():
        if path.exists():
            runner.prepare.require(runner.panel.read_json(path) == value, "saved preflight result changed")
        else:
            runner.write(path, value)
    runner.preserve([*outputs, *(Path(item["path"]) for item in checks)], "batch-publication:preflight", reuse=True)
    return report_root, passed, common_failure


def verify_storage(storage, paths):
    runner.prepare.require(storage["backup"]["status"] == "BACKED_UP", "backup incomplete")
    for database in (None, runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite"):
        runner.Workspace(runner.REPO, database).verify_saved(storage["snapshot"], paths)


def complete_batch(batch, receipt, storage):
    verify_storage(storage, [receipt])
    state_path = runner.ROOT / "STATE.json"
    state_storage = runner.preserve([state_path], "batch-publication:current")
    verify_storage(state_storage, [state_path])
    completed = batch / "BATCH-COMPLETED.json"
    value = {"status": "VERIFIED", "receiptSha256": runner.panel.sha256(receipt),
             "batchStorage": storage, "stateSha256": runner.panel.sha256(state_path), "stateStorage": state_storage}
    if not completed.exists():
        runner.write(completed, value)
    else:
        runner.prepare.require(runner.panel.read_json(completed)["receiptSha256"] == value["receiptSha256"], "completion receipt changed")
    completion_storage = runner.preserve([completed], "batch-publication:completed")
    runner.prepare.require(completion_storage["backup"]["status"] == "BACKED_UP", "completion backup incomplete")
    return state_storage


def verify_completed(batch, applied):
    receipt = batch / "BATCH-FINISHED.json"
    completed = batch / "BATCH-COMPLETED.json"
    runner.prepare.require(completed.is_file(), "applied batch needs completion recovery in its original batch root")
    value = runner.panel.read_json(completed)
    runner.prepare.require(value["status"] == "VERIFIED" and value["receiptSha256"] == applied["receiptSha256"] == runner.panel.sha256(receipt), "applied batch receipt changed")
    saved = runner.panel.read_json(receipt)
    verify_storage(value["batchStorage"], [receipt, Path(saved["readback"]), Path(saved["finalPublicationRoot"])])
    # The saved STATE is historical after another batch advances current.
    for database in (None, runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite"):
        workspace = runner.Workspace(runner.REPO, database)
        with closing(workspace.connect()) as db:
            entry = db.execute("SELECT sha256 FROM entry WHERE snapshot_id=? AND path=?", (value["stateStorage"]["snapshot"]["snapshotId"], workspace.key(runner.ROOT / "STATE.json"))).fetchone()
            runner.prepare.require(entry == (value["stateSha256"],), "saved STATE binding changed")
            state = json.loads(workspace.read_blob(db, entry[0]))
            runner.prepare.require(state.get("publicationBatches", {}).get(saved["summarySha256"]) == applied, "saved STATE does not acknowledge this batch")
    if not runner.receipt_backed_up(completed):
        runner.preserve([completed], "batch-publication:completed-recovery")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch-summary", type=Path, required=True)
    parser.add_argument("--batch-root", type=Path, required=True)
    parser.add_argument("--preflight-only", action="store_true", help="Persist current checks and an explicit independent PASS subset without publishing")
    parser.add_argument("--preflight-attempt", default="initial", help="Explicit retry identity; retains earlier blocked receipts")
    parser.add_argument("--preflight-retry", action="append", default=[], metavar="WORK=ATTEMPT", help="Retry only named Works, preserving other receipt keys")
    parser.add_argument("--publication-format", choices=("compact", "full"), default="compact", help="Compact batch publication; full keeps the historical format")
    parser.add_argument("--checkpoint-every", type=int, default=10, help="Full pair checkpoint interval for compact publication")
    args = parser.parse_args()
    summary_path = args.batch_summary.resolve()
    batch = args.batch_root.resolve()
    runner.prepare.require(batch.is_relative_to(runner.ROOT / "planning"), "batch root must be in planning")
    runner.prepare.require(summary_path.is_file(), "batch summary missing")
    summary_sha = runner.panel.sha256(summary_path)
    summary = runner.panel.read_json(summary_path)
    if "sourceSummary" in summary:
        source = summary["sourceSummary"]
        source_path = runner.artifact_path(source["path"])
        runner.prepare.require(runner.panel.sha256(source_path) == source["sha256"], "source batch summary changed")
        source_rows = runner.panel.read_json(source_path)["works"]
        runner.prepare.require(all(row in source_rows for row in summary["works"]), "subset changed source result rows")
    entries = []
    for row in summary["works"]:
        if row["status"] != "READY_FOR_PUBLICATION":
            continue
        checked_path = runner.artifact_path(row["checkedPath"]).resolve()
        runner.prepare.require(runner.panel.sha256(checked_path) == row["checkedSha256"], "summary CHECKED SHA changed")
        checked = runner.panel.read_json(checked_path)
        runner.prepare.require(checked["status"] == row["status"] and checked["workId"] == row["workId"], "summary CHECKED identity changed")
        backup_status = checked_backup_status(row)
        runner.prepare.require(backup_status == "BACKED_UP", "CHECKED input was not backed up")
        run = checked_path.parent
        if (run / "FINISHED.json").exists():
            runner.prepare.require(runner.completion(run)["status"] == "VERIFIED", "existing completion is not verified")
            continue
        config = runner.panel.read_json(run / "RUN.json")
        frozen = runner.frozen_path(run, config)
        sealed = runner.artifact_path(checked["sealedRoot"])
        runner.prepare.require(config["decisionsSha256"] == row.get("decisionsSha256", checked["decisionsSha256"]) == checked["decisionsSha256"], "decision binding changed")
        runner.prepare.require(runner.panel.sha256(runner.artifact_path(config["decisionsPath"])) == checked["decisionsSha256"], "decision bytes changed")
        runner.prepare.require(runner.panel.sha256(frozen / "panel-input/PANEL-INPUT.sha256") == row.get("inputManifestSha256", checked["inputManifestSha256"]) == checked["inputManifestSha256"], "frozen input changed")
        runner.publisher._verify_result_manifest(sealed)
        runner.prepare.require(runner.panel.sha256(sealed / "MANIFEST.sha256") == checked["resultManifestSha256"], "sealed result changed")
        works = runner.panel.read_json(frozen / "panel-input/authoring-job.json")["works"]
        runner.prepare.require(len(works) == 1 and works[0]["workId"] == row["workId"], "frozen Work changed")
        entries.append((row["workId"], run, frozen, sealed))
    runner.prepare.require(entries, "no unpublished READY results")
    runner.prepare.require(len({item[0] for item in entries}) == len(entries), "duplicate Work in batch")
    attempts = retry_attempts(args.preflight_retry, {item[0] for item in entries})

    lock_root = runner.REPO / "data/local/catalog-authoring/locks"
    with runner.exclusive(lock_root / "publication.lock", wait=True), runner.publisher.panel_validation.manifest_verification_cache():
        state, current_root = runner.current()
        applied = state.get("publicationBatches", {}).get(summary_sha)
        if applied and (Path(applied["batchRoot"]) / "BATCH-COMPLETED.json").exists():
            verify_completed(Path(applied["batchRoot"]), applied)
            print(json.dumps({"status": "ALREADY_APPLIED", "batchRoot": applied["batchRoot"]}), flush=True)
            return
        if applied:
            runner.prepare.require(Path(applied["batchRoot"]).resolve() == batch, "resume incomplete batch in its original batch root")
        for digest, pending in state.get("publicationBatches", {}).items():
            runner.prepare.require(digest == summary_sha or (Path(pending["batchRoot"]) / "BATCH-COMPLETED.json").is_file(), "finish pending batch STATE backup before publishing another batch")
        existing_receipt = batch / "BATCH-FINISHED.json"
        if existing_receipt.exists() and not args.preflight_only:
            saved = runner.panel.read_json(existing_receipt)
            state, current_root = runner.current()
            if current_root == Path(saved["finalPublicationRoot"]).resolve():
                runner.prepare.require(
                    state["latestCandidate"]["catalogSha256"] == runner.panel.sha256(current_root / "catalog-expanded.candidate.sqlite")
                    and saved["summarySha256"] == summary_sha
                    and saved["readbackSha256"] == runner.panel.sha256(Path(saved["readback"])),
                    "completed batch identity changed",
                )
                storage_path = batch / "BATCH-STORAGE.json"
                runner.publisher._verify_result_manifest(current_root)
                runner.prepare.require(runner.readback_matches(Path(saved["readback"]), runner.REPO, current_root, next(item[3] for item in entries if item[0] == saved["works"][-1]["workId"]) / "panel-result"), "completed batch readback needs refresh")
                storage = runner.panel.read_json(storage_path) if storage_path.exists() else runner.preserve([batch], "batch-publication:verified-recovery")
                verify_storage(storage, [existing_receipt, Path(saved["readback"]), current_root])
                if not storage_path.exists():
                    runner.write(storage_path, storage)
                applied = {"batchRoot": str(batch), "receiptSha256": runner.panel.sha256(existing_receipt)}
                state.setdefault("publicationBatches", {})[summary_sha] = applied
                runner.write(runner.ROOT / "STATE.json", state, expected_sha=runner.panel.sha256(runner.ROOT / "STATE.json"))
                state_storage = complete_batch(batch, existing_receipt, storage)
                print(json.dumps({"status": "VERIFIED", "works": len(saved["works"]), "eligible": state["latestCandidate"]["recommendationEligibleCount"], "stateStorage": state_storage}, ensure_ascii=False), flush=True)
                return
            runner.prepare.require(saved["beforeCatalogSha256"] == state["latestCandidate"]["catalogSha256"], "historical batch current advanced; reconcile its applied receipt instead of replaying publication")
        state_sha = runner.panel.sha256(runner.ROOT / "STATE.json")
        state, initial = runner.current()
        preflight_errors = []
        checks = []
        identity = code_identity()
        canonical_sha = runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite")
        if args.preflight_only or args.publication_format == "full":
            for work_id, run, frozen, sealed in entries:
                if existing_receipt.exists() and not args.preflight_only:
                    continue  # Resume the already published/readback-bound outputs below.
                lineage = runner.panel.read_json(frozen / "panel-input/external-lineage.json")
                command = [
                    sys.executable, "-B", "-X", "utf8", str(runner.REPO / "scripts/catalog_authoring/publish_factor_batch.py"),
                    "--validate-only", "--input-root", str(frozen / "panel-input"),
                    "--panel-output-root", str(sealed / "panel-result"),
                    "--previous-catalog", str(initial / "catalog-expanded.candidate.sqlite"),
                    "--previous-registry", str(initial / "catalog-source-registry.candidate.sqlite"),
                    "--frozen-baseline", str(runner.artifact_path(lineage["baselineRoot"]) / "catalog-expanded.candidate.sqlite"),
                    "--frozen-registry", str(runner.artifact_path(lineage["registryPath"])),
                    "--safety-root", str(sealed / "safety-recheck-v1"),
                    "--output-root", str(batch / "validate-only-unused"),
                ]
                key_input = {"workId": work_id, "frozenRoot": str(frozen), "sealedRoot": str(sealed),
                             "inputSha256": runner.panel.sha256(frozen / "panel-input/PANEL-INPUT.sha256"),
                             "resultSha256": runner.panel.sha256(sealed / "MANIFEST.sha256"),
                             "checkedSha256": runner.panel.sha256(run / "CHECKED.json"),
                             "catalogSha256": state["latestCandidate"]["catalogSha256"],
                             "registrySha256": state["latestCandidate"]["registrySha256"],
                             "canonicalSha256": canonical_sha,
                             "frozenCatalogSha256": runner.panel.sha256(runner.artifact_path(lineage["baselineRoot"]) / "catalog-expanded.candidate.sqlite"),
                             "frozenRegistrySha256": runner.panel.sha256(runner.artifact_path(lineage["registryPath"])),
                             "code": identity}
                check_path, check = preflight_result(
                    key_input, command,
                    lambda root=frozen / "panel-input": runner.publisher.validate_input(root),
                    attempt=attempts.get(work_id, args.preflight_attempt),
                )
                checks.append({"workId": work_id, "path": str(check_path), "sha256": runner.panel.sha256(check_path), "status": check["status"], "scope": check["scope"], "cacheHit": check["cacheHit"], "originalCheckSeconds": check["originalCheckSeconds"], "originalExecutionSeconds": check["originalExecutionSeconds"], "timingsSeconds": check["timingsSeconds"]})
                if check["status"] != "PASS":
                    preflight_errors.append({"workId": work_id, "error": check["error"], "scope": check["scope"]})
                print(json.dumps({"preflight": work_id, **{key: check[key] for key in
                    ("status", "cacheHit", "originalCheckSeconds", "originalExecutionSeconds", "timingsSeconds")}}, ensure_ascii=False), flush=True)
            if checks:
                runner.prepare.require(code_identity() == identity and runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite") == canonical_sha, "preflight code/canonical changed during batch")
                runner.prepare.require(runner.panel.sha256(runner.ROOT / "STATE.json") == state_sha, "current advanced during preflight")
                report_root, passed, common_failure = preserve_preflight(batch, summary_path, summary_sha, summary, checks)
                if args.preflight_only:
                    print(json.dumps({"status": "BLOCKED" if common_failure else "PREFLIGHT_COMPLETE", "reportRoot": str(report_root), "passed": len(passed), "blocked": len(preflight_errors)}), flush=True)
                    return
        runner.prepare.require(not preflight_errors, "batch publisher preflight blocked before mutation: " + json.dumps(preflight_errors, ensure_ascii=False))
        first_sha = state["latestCandidate"]["catalogSha256"]
        registry = initial / "catalog-source-registry.candidate.sqlite"
        publications = []
        if args.publication_format == "compact":
            sys.path.insert(0, str(runner.REPO / "scripts/catalog_authoring"))
            import compact_publication
            output, published_ids, compact_failures = compact_publication.publish(batch, entries, initial, summary_sha,
                checkpoint_every=args.checkpoint_every)
            publications = [(work_id, output, sealed) for work_id, run, frozen, sealed in entries if work_id in set(published_ids)]
        else:
            for index, (work_id, run, frozen, sealed) in enumerate(entries, 1):
                output = batch / f"publication-{index:03d}"
                intent_path = batch / f"intent-{index:03d}.json"
                lineage = runner.panel.read_json(frozen / "panel-input/external-lineage.json")
                intent = {
                    "workId": work_id, "runRoot": str(run), "baselineRoot": str(initial if index == 1 else publications[-1][1]),
                    "beforeCatalogSha256": runner.panel.sha256((initial if index == 1 else publications[-1][1]) / "catalog-expanded.candidate.sqlite"),
                    "resultManifestSha256": runner.panel.sha256(sealed / "MANIFEST.sha256"),
                    "reviewedAt": runner.utc_now(),
                }
                if intent_path.exists():
                    prior = runner.panel.read_json(intent_path)
                    runner.prepare.require({k: prior[k] for k in intent if k != "reviewedAt"} == {k: v for k, v in intent.items() if k != "reviewedAt"}, "batch publication intent changed")
                    intent = prior
                else:
                    runner.write(intent_path, intent)
                baseline = initial if index == 1 else publications[-1][1]
                registry = baseline / "catalog-source-registry.candidate.sqlite"
                if not output.exists():
                    runner.publisher.publish_batch(
                        frozen / "panel-input", sealed / "panel-result",
                        baseline / "catalog-expanded.candidate.sqlite", registry,
                        sealed / "safety-recheck-v1", output, intent["reviewedAt"],
                        runner.artifact_path(lineage["baselineRoot"]) / "catalog-expanded.candidate.sqlite",
                        runner.artifact_path(lineage["registryPath"]),
                    )
                runner.publisher._verify_result_manifest(output)
                publications.append((work_id, output, sealed))
                print(json.dumps({"published": index, "workId": work_id}, ensure_ascii=False), flush=True)

        last = publications[-1][1]
        readback = batch / "readback/READBACK.json"
        result_roots = [sealed / "panel-result" for _, _, sealed in publications]
        batch_publications = batch / "READBACK-PUBLICATIONS.json"
        runner.write(batch_publications, {
            "works": [
                {"workId": work_id, "publicationRoot": str(output), "resultRoot": str(sealed / "panel-result")}
                for work_id, output, sealed in publications
            ]
        })
        if not runner.readback_matches(readback, runner.REPO, last, result_roots[-1]):
            destination = readback.parent if not readback.exists() else batch / ("readback-" + uuid.uuid4().hex)
            subprocess.run([
                "node", "--import", "tsx", str(runner.REPO / "scripts/readback-catalog-authoring.mts"),
                str(last), str(result_roots[-1]), str(destination),
                *(str(root) for root in result_roots[:-1]),
                "--batch-publications", str(batch_publications),
            ], cwd=runner.REPO, check=True)
            readback = destination / "READBACK.json"
        runner.prepare.require(runner.readback_matches(readback, runner.REPO, last, result_roots[-1]), "batch readback identity changed")
        verified = runner.panel.read_json(readback)
        runner.prepare.require(set(verified["targetWorkIds"]) == {work_id for work_id, _, _ in publications}, "batch readback target mismatch")
        runner.prepare.require(runner.panel.sha256(summary_path) == summary_sha, "batch summary changed during publication")
        runner.prepare.require(verified["catalogSha256"] == runner.panel.sha256(last / "catalog-expanded.candidate.sqlite"), "final candidate changed")
        with sqlite3.connect(f"file:{(last / 'catalog-expanded.candidate.sqlite').as_posix()}?mode=ro", uri=True) as db:
            for work_id, _, _ in publications:
                runner.prepare.require(db.execute("select recommendationEligible,libraryOnly from source_works where id=?", (work_id,)).fetchone() == ("true", "false"), f"published Work not eligible: {work_id}")
        receipt = batch / "BATCH-FINISHED.json"
        if not receipt.exists():
            runner.write(receipt, {
                "status": "READBACK_VERIFIED", "summaryPath": str(summary_path), "summarySha256": summary_sha,
                "beforeCatalogSha256": first_sha, "finalPublicationRoot": str(last),
                "publicationManifestSha256": runner.panel.sha256(last / "MANIFEST.sha256"),
                "readback": str(readback), "readbackSha256": runner.panel.sha256(readback),
                "works": [{"workId": work_id, "publicationRoot": str(output), "manifestSha256": runner.panel.sha256(output / "MANIFEST.sha256")} for work_id, output, _ in publications],
            })
        else:
            saved = runner.panel.read_json(receipt)
            runner.prepare.require(saved["readbackSha256"] == runner.panel.sha256(readback) and saved["summarySha256"] == summary_sha, "batch receipt changed")
        # The complete publication and readback are backed up before STATE can point to them.
        storage_path = batch / "BATCH-STORAGE.json"
        storage = runner.panel.read_json(storage_path) if storage_path.exists() else runner.preserve([batch], "batch-publication:verified")
        runner.prepare.require(storage["backup"]["status"] == "BACKED_UP", "batch backup incomplete")
        verify_storage(storage, [receipt, readback, last])
        if not storage_path.exists():
            runner.write(storage_path, storage)
        latest_state, latest = runner.current()
        runner.prepare.require(runner.panel.sha256(runner.ROOT / "STATE.json") == state_sha and latest == initial, "current advanced during batch")
        previous_count = latest_state["latestCandidate"]["recommendationEligibleCount"]
        latest_state["latestCandidate"] = {
            "root": str(last.relative_to(runner.ROOT)).replace("\\", "/"),
            "previousBaselineRoot": str(initial.relative_to(runner.ROOT)).replace("\\", "/"),
            "catalogSha256": verified["catalogSha256"], "registrySha256": verified["registrySha256"],
            "canonicalSha256": verified["canonicalSha256"],
            "manifestSha256": runner.panel.sha256(last / "MANIFEST.sha256"),
            "catalogVersion": verified["catalogVersion"], "workCount": verified["counts"]["works"],
            "recommendationEligibleCount": verified["counts"]["eligible"],
            "libraryOnlyCount": verified["counts"]["libraryOnly"],
            "promotedWorkCount": verified["counts"]["eligible"] - previous_count,
            "state": verified["status"],
            "readback": str(readback.relative_to(runner.ROOT)).replace("\\", "/"),
            "verifiedAt": verified["verifiedAt"],
        }
        latest_state["updatedAt"] = runner.utc_now()
        latest_state.setdefault("publicationBatches", {})[summary_sha] = {"batchRoot": str(batch), "receiptSha256": runner.panel.sha256(receipt)}
        runner.write(runner.ROOT / "STATE.json", latest_state, expected_sha=state_sha)
        state_storage = complete_batch(batch, receipt, storage)
        print(json.dumps({"status": "VERIFIED", "works": len(publications), "eligible": verified["counts"]["eligible"], "batchStorage": storage, "stateStorage": state_storage}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
