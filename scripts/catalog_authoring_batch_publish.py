#!/usr/bin/env python3
"""Publish checked, immutable decisions serially; read back and back up once per batch."""
from __future__ import annotations

import argparse
import copy
from contextlib import closing
from contextvars import ContextVar
from functools import wraps
import json
import os
import re
from pathlib import Path
import sqlite3
import subprocess
import sys
import time
import uuid

import catalog_authoring_runner as runner


_publication_timing = ContextVar("catalog_batch_publication_timing", default=None)


class _PublicationTiming:
    """Observe disjoint primary stages without changing saved artifact identity."""

    def __init__(self, args):
        self.started = self.marked = time.perf_counter()
        self.stage = "summaryAndCheckedInputs"
        self.seconds = {}
        self.finished = False
        self.batch = str(args.batch_root)
        self.mode = "unresolved"

    def mark(self, stage):
        if self.finished or stage == self.stage:
            return
        now = time.perf_counter()
        self.seconds[self.stage] = self.seconds.get(self.stage, 0.0) + now - self.marked
        self.stage, self.marked = stage, now

    def finish(self, outcome, *, error_type=None):
        if self.finished:
            return
        now = time.perf_counter()
        self.seconds[self.stage] = self.seconds.get(self.stage, 0.0) + now - self.marked
        self.finished = True
        print(json.dumps({"batchPublicationTimingsSeconds": {
            "batchRoot": self.batch, "outcome": outcome,
            "executionMode": self.mode,
            "stages": self.seconds, "total": now - self.started,
            "failedStage": self.stage if outcome == "FAILED" else None,
            "errorType": error_type,
            "scope": "This invocation only; nested compact/storage metrics are included, not additional time.",
        }}), flush=True)


def _publication_stage(stage):
    timing = _publication_timing.get()
    if timing is not None:
        timing.mark(stage)


def _publication_mode(mode):
    timing = _publication_timing.get()
    if timing is not None:
        timing.mode = mode


def _candidate_publication_stage(stage):
    timing = _publication_timing.get()
    if timing is not None:
        timing.mark(stage if timing.mode == "new" else "candidateStorageBasisStateAndCompletion")


def _finish_publication_timing(outcome="COMPLETED", *, error_type=None):
    timing = _publication_timing.get()
    if timing is not None:
        timing.finish(outcome, error_type=error_type)


def _timed_publication(function):
    @wraps(function)
    def measured(args):
        timing = _PublicationTiming(args)
        token = _publication_timing.set(timing)
        try:
            result = function(args)
        except BaseException as error:
            _finish_publication_timing("FAILED", error_type=type(error).__name__)
            raise
        else:
            _finish_publication_timing()
            return result
        finally:
            _publication_timing.reset(token)
    return measured


def _summary_object(pairs):
    value = {}
    for key, item in pairs:
        runner.prepare.require(key not in value, f"duplicate batch summary key: {key}")
        value[key] = item
    return value


def _summary_constant(value):
    raise ValueError(f"invalid batch summary JSON constant: {value}")


def _immutable_summary_bytes(path, content):
    if path.exists():
        runner.prepare.require(path.read_bytes() == content, "saved summary adapter changed")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".writing-" + uuid.uuid4().hex)
    with temporary.open("xb") as stream:
        stream.write(content)
        stream.flush()
        os.fsync(stream.fileno())
    # The normal caller holds publication-owner.lock for this entire attempt.
    runner.prepare.require(not path.exists(), "concurrent summary adapter creation")
    os.replace(temporary, path)


def read_batch_summary(path, expected_sha, *, batch=None, ancestors=()):
    """Adapt byte formatting only; original summary identities and rows stay authoritative."""
    path = Path(path).resolve()
    runner.prepare.require(path not in ancestors, "cyclic source batch summary")
    raw = path.read_bytes()
    runner.prepare.require(runner.panel.sha256_bytes(raw) == expected_sha, "source batch summary changed")
    normalized = raw.removeprefix(b"\xef\xbb\xbf").replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    if not normalized.endswith(b"\n"):
        normalized += b"\n"
    try:
        value = json.loads(normalized.decode("utf-8"), object_pairs_hook=_summary_object,
                           parse_constant=_summary_constant)
    except (UnicodeError, json.JSONDecodeError) as error:
        raise ValueError(f"invalid batch summary JSON: {path}: {error}") from error
    runner.prepare.require(isinstance(value, dict) and isinstance(value.get("works"), list)
                           and all(isinstance(row, dict) for row in value["works"]), "invalid batch summary works")
    if value.get("schemaVersion") == "catalog-batch-summary-v2":
        rows = value["works"]
        runner.prepare.require(value.get("status") == "COMPLETE" and bool(rows)
                               and type(value.get("assignedCount")) is int and type(value.get("processedCount")) is int
                               and value.get("assignedCount") == value.get("processedCount") == len(rows)
                               and len({r.get("workId") for r in rows}) == len(rows)
                               and all(r.get("status") in {"READY_FOR_PUBLICATION", "HOLD", "ERROR"} for r in rows),
                               "batch checkpoint is incomplete or inconsistent")
        binding = value.get("dispatch", {})
        dispatch = runner.artifact_path(binding["path"])
        runner.prepare.require(runner.panel.sha256(dispatch) == binding["sha256"], "batch dispatch changed")
        assigned = runner.panel.read_json(dispatch)
        runner.prepare.require(assigned.get("batchId") == value.get("batchId")
                               and {r["workId"] for r in assigned["works"]} == {r["workId"] for r in rows},
                               "batch summary membership differs from assignment")
    if "sourceSummary" in value:
        source = value["sourceSummary"]
        runner.prepare.require(isinstance(source, dict) and isinstance(source.get("path"), str)
                               and isinstance(source.get("sha256"), str), "invalid source batch summary binding")
        original = read_batch_summary(runner.artifact_path(source["path"]), source["sha256"],
                                      batch=batch, ancestors=(*ancestors, path))
        runner.prepare.require(all(row in original["works"] for row in value["works"]),
                               "subset changed source result rows")
    if raw != normalized and batch is not None:
        root = batch / "summary-adapters" / expected_sha
        adapter = {"schemaVersion": "catalog-summary-byte-adapter-v1", "sourceSha256": expected_sha,
                   "sourceBytes": len(raw), "normalizedSha256": runner.panel.sha256_bytes(normalized),
                   "transformations": {"utf8BomRemoved": raw.startswith(b"\xef\xbb\xbf"),
                                       "crlfToLf": raw.count(b"\r\n"),
                                       "crToLf": raw.count(b"\r") - raw.count(b"\r\n"),
                                       "finalLfAdded": not raw.endswith((b"\n", b"\r"))}}
        files = {root / "SOURCE.json": raw, root / "SUMMARY.json": normalized,
                 root / "ADAPTER.json": (json.dumps(adapter, ensure_ascii=False, indent=2) + "\n").encode("utf-8")}
        for destination, content in files.items():
            _immutable_summary_bytes(destination, content)
        # Saving on retries also repairs an interruption after files but before storage.
        runner.preserve(list(files), "batch-publication:summary-adapter", reuse=True)
    return value


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
                      or last == f"fresh snapshot materialized fact has protected reviewed evidence: {work_id}"
                      or last.startswith(f"accepted baseline axis conflict: {work_id} ")
                      or last.startswith(f"accepted baseline theme conflict: {work_id} ")
                      or last.startswith(f"Canonical rebase target conflict: {work_id}: ")) else "BATCH"


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
    dependencies = ["scripts/workspace_paths.py", "scripts/catalog_workspace.py", "scripts/catalog_authoring_locks.py",
                    "scripts/catalog_revision_store.py", "scripts/catalog_retention.py", "scripts/catalog_recovery.py",
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
    runner.preserve([*outputs, *(runner.artifact_path(item["path"]) for item in checks)], "batch-publication:preflight", reuse=True)
    return report_root, passed, common_failure


def verify_storage(storage, paths):
    persisted = (storage["backup"]["status"] == "PERSISTED"
                 and storage["snapshot"].get("schemaVersion") == "catalog-authoring-revision-v1")
    runner.prepare.require(persisted or storage["backup"]["status"] == "BACKED_UP", "backup incomplete")
    for database in ((None,) if persisted else (None, runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite")):
        runner.Workspace(runner.REPO, database).verify_saved(storage["snapshot"], paths)


def complete_batch(batch, receipt, storage):
    verify_storage(storage, [receipt])
    state_path = runner.ROOT / "STATE.json"
    state_storage = runner.preserve([state_path], "batch-publication:current")
    verify_storage(state_storage, [state_path])
    workspace = runner.Workspace(runner.REPO)
    if getattr(workspace, "is_revision_store", False):
        finished = runner.panel.read_json(receipt)
        state = runner.panel.read_json(state_path)
        applied = state["publicationBatches"][finished["summarySha256"]]
        runner.prepare.require(applied["receiptSha256"] == runner.panel.sha256(receipt), "completion STATE binding changed")
        readback = runner.artifact_path(finished["readback"])
        runner.prepare.require(runner.panel.sha256(readback) == finished["readbackSha256"], "completion readback changed")
        retained = workspace.save([receipt, readback], "publication:completion-proof")
        completion = workspace.put_revision("completion", finished["summarySha256"],
            {"status": "VERIFIED", "summarySha256": finished["summarySha256"], "applied": applied,
             "finished": finished, "stateSha256": runner.panel.sha256(state_path),
             "catalogSha256": state["latestCandidate"]["catalogSha256"], "registrySha256": state["latestCandidate"]["registrySha256"]},
            workspace.get_revision(retained)["members"])
        completed = batch / "BATCH-COMPLETED.json"
        runner.write(completed, {"status": "VERIFIED", "receiptSha256": applied["receiptSha256"], "revision": completion})
        workspace.save([completed], "publication:completed")
        backup = workspace.backup()
        verify_completion_revision(finished["summarySha256"], applied)
        return {**state_storage, "backup": backup, "completion": completion}
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


def verify_completion_revision(summary_sha, applied):
    workspace = runner.Workspace(runner.REPO)
    if not getattr(workspace, "is_revision_store", False):
        return False
    receipt = workspace.current_revision("completion", summary_sha)
    if receipt is None:
        return False
    for source in (workspace, runner.Workspace(runner.REPO, runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite")):
        current = source.current_revision("completion", summary_sha)
        runner.prepare.require(current is not None and
                               {key: value for key, value in current.items() if key != "database"} ==
                               {key: value for key, value in receipt.items() if key != "database"},
                               "completion source/backup head differs")
        value = source.get_revision(receipt)
        payload = value["payload"]
        runner.prepare.require(payload["status"] == "VERIFIED" and payload["summarySha256"] == summary_sha
                               and payload["applied"] == applied, "completion ledger differs from STATE")
        with closing(source.connect()) as db:
            for sha in set(value["members"].values()):
                source.read_blob(db, sha)
    return True


def require_previous_completion(state, summary_sha):
    """Only the last unacknowledged commit can block the next serial publisher."""
    pending = state.get("pendingPublicationBatch")
    if pending is None:
        # Old states predate the explicit pointer. Their publisher already
        # required earlier completions before each subsequent commit.
        pending = next(reversed(state.get("publicationBatches", {})), None)
    if pending is None or pending == summary_sha:
        return
    applied = state.get("publicationBatches", {}).get(pending)
    runner.prepare.require(applied is not None, "pending publication has no applied receipt")
    if not verify_completion_revision(pending, applied):
        verify_completed(runner.artifact_path(applied["batchRoot"]), applied)


def canonical_dependency_proof(saved, batch=None):
    """Check live dependencies for a new effect, even if canonical is unchanged."""
    from canonical_rebase import POLICIES, validate_rebase, validation_cache
    canonical_sha = runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite")
    policies = {name: runner.panel.sha256(runner.REPO / path) for name, path in POLICIES.items()}
    summary = runner.artifact_path(saved["summaryPath"])
    rows = {row["workId"]: row for row in read_batch_summary(summary, saved["summarySha256"], batch=batch)["works"]}
    proofs = []
    with validation_cache(), runner.publisher.panel_validation.manifest_verification_cache():
        for published in saved["works"]:
            row = rows[published["workId"]]
            checked_path = runner.artifact_path(row["checkedPath"])
            runner.prepare.require(runner.panel.sha256(checked_path) == row["checkedSha256"], "canonical source CHECKED changed")
            checked = runner.panel.read_json(checked_path)
            runner.prepare.require(checked["workId"] == published["workId"] and checked["status"] == "READY_FOR_PUBLICATION", "canonical source Work changed")
            config = runner.panel.read_json(checked_path.parent / "RUN.json")
            input_root = runner.frozen_path(checked_path.parent, config) / "panel-input"
            runner.prepare.require(runner.panel.sha256(input_root / "PANEL-INPUT.sha256") == checked["inputManifestSha256"], "canonical source frozen input changed")
            runner.publisher.validate_input(input_root)
            proofs.append({"workId": published["workId"], "proof": validate_rebase(input_root, canonical_sha)})
    runner.prepare.require(runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite") == canonical_sha,
                           "canonical advanced during dependency proof")
    runner.prepare.require(policies == {name: runner.panel.sha256(runner.REPO / path) for name, path in POLICIES.items()},
                           "policy advanced during dependency proof")
    runner.prepare.require(all(item["proof"] is None or item["proof"].get("currentPolicyDigests", item["proof"].get("policyDigests")) == policies for item in proofs),
                           "policy snapshot differs from dependency proof")
    return {"currentCanonicalSha256": canonical_sha, "currentPolicyDigests": policies, "works": proofs}


def canonical_readback(batch, saved, *, proof=None):
    """Bind live policy checks to readback and the later canonical commit guards."""
    from canonical_rebase import POLICIES
    from catalog_readback_identity import execution_identity
    readback = runner.artifact_path(saved["readback"])
    runner.prepare.require(runner.panel.sha256(readback) == saved["readbackSha256"], "canonical input readback changed")
    original = runner.panel.read_json(readback)
    proof = canonical_dependency_proof(saved, batch) if proof is None else proof
    canonical_sha, policies = proof["currentCanonicalSha256"], proof["currentPolicyDigests"]
    publication = runner.artifact_path(saved["finalPublicationRoot"])
    result_roots = [runner.artifact_path(row["root"]) for row in original["resultRoots"]]
    identity = execution_identity(runner.REPO)
    key = runner.panel.sha256_bytes(json.dumps(identity, sort_keys=True).encode())
    destination = batch / "canonical-readback" / canonical_sha / key
    refreshed = destination / "READBACK.json"
    if original["canonicalSha256"] == canonical_sha and runner.readback_matches(readback, runner.REPO, publication, result_roots[-1]):
        refreshed = readback
    if not runner.readback_matches(refreshed, runner.REPO, publication, result_roots[-1]):
        subprocess.run([
            "node", "--import", "tsx", str(runner.REPO / "scripts/readback-catalog-authoring.mts"),
            str(publication), str(result_roots[-1]), str(destination), *(str(root) for root in result_roots[:-1]),
            "--batch-publications", str(runner.artifact_path(original["batchPublications"]["path"])),
        ], cwd=runner.REPO, check=True)
    runner.prepare.require(runner.readback_matches(refreshed, runner.REPO, publication, result_roots[-1]), "canonical rebase readback changed")
    value = runner.panel.read_json(refreshed)
    runner.prepare.require(value["canonicalSha256"] == canonical_sha
                           and runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite") == canonical_sha,
                           "canonical advanced after dependency proof; retain this attempt and rebase again")
    files = value.get("executionIdentity", {}).get("files", [])
    runner.prepare.require(all([item.get("sha256") for item in files if item.get("path") == path] == [policies[name]]
                               and runner.panel.sha256(runner.REPO / path) == policies[name] for name, path in POLICIES.items()),
                           "policy advanced after dependency proof or readback policy binding missing")
    runner.write(destination / "CANONICAL-REBASE.json", {"originalReadbackSha256": saved["readbackSha256"], **proof})
    return refreshed


def verified_canonical_completion(workspace, summary_sha, candidate_sha):
    if not getattr(workspace, "is_revision_store", False):
        return None
    revision = workspace.current_revision("canonical-completion", summary_sha)
    if revision is None:
        return None
    for source in (workspace, runner.Workspace(runner.REPO, runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite")):
        current = source.current_revision("canonical-completion", summary_sha)
        runner.prepare.require(current is not None and
            {key: value for key, value in current.items() if key != "database"} ==
            {key: value for key, value in revision.items() if key != "database"}, "canonical completion source/backup head differs")
        value = source.get_revision(revision)
        runner.prepare.require(value["payload"]["candidateReceiptSha256"] == candidate_sha
                               and value["payload"]["status"] == "APPLIED", "canonical completion candidate binding changed")
        with closing(source.connect()) as db:
            for sha in set(value["members"].values()):
                source.read_blob(db, sha)
    from catalog_completed_checks import verify_current_canonical_effect
    effect = verify_current_canonical_effect()
    return {**value["payload"], "revision": revision, "readback": "HISTORICAL_COMPLETION_VERIFIED",
            "currentCanonicalEffect": effect}


def apply_canonical(batch, receipt):
    canonical = runner.REPO / "data/source/catalog.sqlite"
    pending = runner.REPO / "data/local/catalog-authoring/locks/publication.pending.json"
    for attempt in range(3):
        before = runner.panel.sha256(canonical) if canonical.is_file() and not pending.is_file() else None
        try:
            return _apply_canonical(batch, receipt)
        except (ValueError, subprocess.CalledProcessError):
            if (attempt == 2 or before is None or pending.is_file() or not canonical.is_file()
                    or runner.panel.sha256(canonical) == before):
                raise
            print(json.dumps({"canonicalRetry": "CANONICAL_ADVANCED", "attempt": attempt + 1}), flush=True)


def _apply_canonical(batch, receipt):
    """Resume the separately authorized canonical effect without publishing decisions again."""
    saved = runner.panel.read_json(receipt)
    workspace = runner.Workspace(runner.REPO)
    candidate_sha = runner.panel.sha256(receipt)
    prior = workspace.current_revision("canonical-completion", saved["summarySha256"]) if getattr(workspace, "is_revision_store", False) else None
    if prior:
        backup = runner.Workspace(runner.REPO, runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite")
        if not backup.database.is_file() or backup.current_revision("canonical-completion", saved["summarySha256"]) != {**prior, "database": str(backup.database)}:
            workspace.backup()
        return verified_canonical_completion(workspace, saved["summarySha256"], candidate_sha)
    final_receipt = batch / "CANONICAL-COMPLETED.json"
    if final_receipt.is_file() and not getattr(workspace, "is_revision_store", False):
        value = runner.panel.read_json(final_receipt)
        runner.prepare.require(value["candidateReceiptSha256"] == candidate_sha, "canonical completion candidate binding changed")
        verify_storage(value["storage"], [runner.artifact_path(value["outputRoot"])])
        if not runner.receipt_backed_up(final_receipt):
            recovered = runner.preserve([final_receipt], "publication:canonical-completed-recovery", phase_boundary=True)
            runner.prepare.require(recovered["backup"]["status"] == "BACKED_UP", "canonical completion receipt backup incomplete")
        return {**value, "readback": "HISTORICAL_COMPLETION_VERIFIED"}
    work_ids = [row["workId"] for row in saved["works"]]
    pending_path = runner.REPO / "data/local/catalog-authoring/locks/publication.pending.json"
    attempt_path = batch / "CANONICAL-ATTEMPT.json"
    previous_attempt = runner.panel.read_json(attempt_path) if attempt_path.is_file() else None
    live_proof = None
    live_readback = None
    if previous_attempt is not None:
        runner.prepare.require(previous_attempt["candidateReceiptSha256"] == candidate_sha, "canonical attempt candidate changed")
        previous_output = runner.artifact_path(previous_attempt["outputRoot"]).resolve()
        runner.prepare.require(previous_output.is_relative_to((batch / "canonical").resolve()), "canonical attempt escapes batch")
    if pending_path.is_file():
        pending = runner.panel.read_json(pending_path)
        prepared = runner.artifact_path(pending["preparedPath"]).resolve()
        runner.prepare.require(prepared.name == "prepared.json" and prepared.parent.is_relative_to((batch / "canonical").resolve()),
                               "another canonical publication needs recovery first")
        output = prepared.parent
    elif previous_attempt is not None and (previous_output / "completion.json").is_file():
        output = previous_output
    else:
        live_proof = canonical_dependency_proof(saved, batch)
        live_readback = canonical_readback(batch, saved, proof=live_proof)
        identity = {"canonicalSha256": live_proof["currentCanonicalSha256"],
                    "readbackSha256": runner.panel.sha256(live_readback)}
        output = batch / "canonical" / runner.panel.sha256_bytes(json.dumps(identity, sort_keys=True).encode())
    binding = batch / "canonical-inputs" / (output.name + ".json")
    if binding.is_file():
        selected = runner.panel.read_json(binding)
        readback = runner.artifact_path(selected["readback"])
        runner.prepare.require(selected["candidateReceiptSha256"] == runner.panel.sha256(receipt)
                               and selected["readbackSha256"] == runner.panel.sha256(readback), "canonical stage input changed")
        if live_proof is not None:
            runner.prepare.require(readback == live_readback and selected.get("dependencyProof") == live_proof,
                                   "canonical live dependency binding changed")
    else:
        runner.prepare.require(live_readback is not None, "canonical recovery input binding missing")
        readback = live_readback
        runner.write(binding, {"candidateReceiptSha256": runner.panel.sha256(receipt),
                              "readback": str(readback), "readbackSha256": runner.panel.sha256(readback),
                              "dependencyProof": live_proof})
    original_readback = runner.artifact_path(saved["readback"])
    runner.prepare.require(runner.panel.sha256(original_readback) == saved["readbackSha256"], "original candidate readback changed")
    original, selected = runner.panel.read_json(original_readback), runner.panel.read_json(readback)
    runner.prepare.require(all(selected.get(key) == original.get(key) for key in
                               ("catalogSha256", "registrySha256", "publicationManifestSha256"))
                           and set(selected["targetWorkIds"]) == set(work_ids),
                           "canonical projection differs from the completed candidate")
    if previous_attempt is None or previous_output != output:
        runner.write(attempt_path, {"candidateReceiptSha256": candidate_sha, "outputRoot": str(output)})
    completion = output / "completion.json"
    historical = completion.is_file() and not pending_path.is_file()
    command = ["node", "--import", "tsx", str(runner.REPO / "scripts/apply-catalog-authoring-canonical.ts")]
    command.extend(["--verify-completion", str(completion)] if historical else [
        "--publication-root", str(readback.parent), "--work-ids", json.dumps(work_ids),
        "--output", str(output), "--root", str(runner.REPO)])
    subprocess.run(command, cwd=runner.REPO, check=True)
    runner.prepare.require(completion.is_file(), "canonical completion receipt missing")
    completed = runner.panel.read_json(completion)
    runner.prepare.require(completed["schemaVersion"] == "catalog-canonical-completion-v1"
                           and completed["status"] == "APPLIED" and set(completed["workIds"]) == set(work_ids),
                           "canonical completion target or status changed")
    storage = runner.preserve([output, binding, attempt_path, readback.parent], "batch-publication:canonical", reuse=True)
    result = {"status": "APPLIED", "candidateReceiptSha256": candidate_sha, "outputRoot": str(output), "completionPath": str(completion),
              "completionSha256": runner.panel.sha256(completion)}
    if getattr(workspace, "is_revision_store", False):
        revision = workspace.put_revision("canonical-completion", saved["summarySha256"], result,
                                          workspace.get_revision(storage["snapshot"])["members"])
        runner.write(final_receipt, {**result, "revision": revision})
        workspace.save([final_receipt], "publication:canonical-completed")
        backup = workspace.backup()
        verified_canonical_completion(workspace, saved["summarySha256"], candidate_sha)
        return {**result, "revision": revision, "backup": backup,
                "readback": "HISTORICAL_COMPLETION_VERIFIED" if historical else "PASS"}
    runner.write(final_receipt, {**result, "storage": storage})
    final_storage = runner.preserve([final_receipt], "publication:canonical-completed", phase_boundary=True)
    runner.prepare.require(final_storage["backup"]["status"] == "BACKED_UP", "canonical completion backup incomplete")
    return {**result, "storage": storage, "completionStorage": final_storage,
            "readback": "HISTORICAL_COMPLETION_VERIFIED" if historical else "PASS"}


def report_completed(batch, applied, *, canonical=False, **details):
    effects = {"candidate": "VERIFIED", "canonical": "NOT_REQUESTED"}
    if canonical:
        _publication_stage("canonicalEffect")
        try:
            runner.prepare.require(runner.panel.sha256(batch / "BATCH-FINISHED.json") == applied["receiptSha256"],
                                   "canonical candidate receipt differs from the applied completion")
            effects["canonical"] = apply_canonical(batch, batch / "BATCH-FINISHED.json")
        except (OSError, ValueError, subprocess.SubprocessError) as error:
            effects["canonical"] = {"status": "INCOMPLETE", "error": str(error)}
            print(json.dumps({"status": "CANDIDATE_VERIFIED_CANONICAL_INCOMPLETE",
                              "batchRoot": applied["batchRoot"], "effects": effects}, ensure_ascii=False), flush=True)
            raise
    _publication_stage("transientCleanup")
    import compact_publication
    cleanup = compact_publication.complete_transient_lifetime(batch)
    if cleanup is not None:
        effects["transientCopies"] = cleanup
    # Keep the existing authoritative status as the last successful stdout record.
    _finish_publication_timing()
    print(json.dumps({"status": "VERIFIED" if canonical else "ALREADY_APPLIED",
                      "batchRoot": applied["batchRoot"], "effects": effects, **details}, ensure_ascii=False), flush=True)


def verify_completed(batch, applied):
    receipt = batch / "BATCH-FINISHED.json"
    runner.prepare.require(receipt.is_file() and runner.panel.sha256(receipt) == applied["receiptSha256"],
                           "applied batch receipt changed")
    saved = runner.panel.read_json(receipt)
    workspace = runner.Workspace(runner.REPO)
    if getattr(workspace, "is_revision_store", False):
        runner.prepare.require(verify_completion_revision(saved["summarySha256"], applied),
                               "applied revision batch needs completion and backup recovery")
        return
    completed = batch / "BATCH-COMPLETED.json"
    runner.prepare.require(completed.is_file(), "applied batch needs completion recovery in its original batch root")
    value = runner.panel.read_json(completed)
    runner.prepare.require(value["status"] == "VERIFIED" and value["receiptSha256"] == applied["receiptSha256"] == runner.panel.sha256(receipt), "applied batch receipt changed")
    verify_storage(value["batchStorage"], [receipt, runner.artifact_path(saved["readback"]), runner.artifact_path(saved["finalPublicationRoot"])])
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


def parse_arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch-summary", type=Path, required=True)
    parser.add_argument("--batch-root", type=Path, required=True)
    parser.add_argument("--preflight-only", action="store_true", help="Persist current checks and an explicit independent PASS subset without publishing")
    parser.add_argument("--preflight-attempt", default="initial", help="Explicit retry identity; retains earlier blocked receipts")
    parser.add_argument("--preflight-retry", action="append", default=[], metavar="WORK=ATTEMPT", help="Retry only named Works, preserving other receipt keys")
    parser.add_argument("--publication-format", choices=("compact", "full"), default="compact", help="Compact batch publication; full keeps the historical format")
    parser.add_argument("--checkpoint-every", type=int, default=50, help="Full pair checkpoint interval for compact publication")
    parser.add_argument("--apply-canonical", action="store_true", help="After candidate completion, apply this verified batch to canonical source and generated product artifacts")
    return parser.parse_args()


def attempt_arguments(args):
    """Keep interrupted private attempts immutable when the shared basis advances."""
    summary_sha = runner.panel.sha256(runner.artifact_path(args.batch_summary).resolve())
    state, initial = runner.current()
    applied = state.get("publicationBatches", {}).get(summary_sha)
    result = copy.copy(args)
    result.summary_sha256 = summary_sha
    result.candidate_applied = applied is not None
    if applied:
        result.batch_root = runner.artifact_path(applied["batchRoot"])
    elif args.publication_format == "compact":
        requested = runner.artifact_path(args.batch_root).resolve()
        legacy = requested / "BATCH-FINISHED.json"
        if legacy.exists():
            saved = runner.panel.read_json(legacy)
            old_readback = runner.panel.read_json(runner.artifact_path(saved["readback"]))
            if old_readback["canonicalSha256"] == runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite"):
                return result
        identity = {"summarySha256": summary_sha, "baseline": str(initial),
                    "catalogSha256": state["latestCandidate"]["catalogSha256"],
                    "registrySha256": state["latestCandidate"]["registrySha256"],
                    "canonicalSha256": runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite"),
                    "code": code_identity()}
        key = runner.panel.sha256_bytes(json.dumps(identity, sort_keys=True).encode())
        result.batch_root = requested / "attempts" / key
    return result


def main() -> None:
    args = parse_arguments()
    runner.prepare.require(not (args.apply_canonical and args.preflight_only), "preflight-only cannot apply canonical")
    from catalog_retention import prepare_restored_operation
    restored = prepare_restored_operation(runner.REPO, {
        "operation": "batch", "summaryPath": str(args.batch_summary),
        "batchRoot": str(args.batch_root), "applyCanonical": args.apply_canonical,
    })
    if restored["status"] == "MATERIALIZED" and restored.get("needsBackup") and not (runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite").is_file():
        runner.Workspace(runner.REPO).backup()
    with runner.exclusive(runner.REPO / "data/local/catalog-authoring/locks/publication-owner.lock",
                          wait=True, metadata={"operation": "batch-publication", "batchRoot": str(args.batch_root)}):
        for number in range(3):
            setup_started = time.perf_counter()
            try:
                attempt = attempt_arguments(args)
                if not attempt.candidate_applied:
                    from catalog_authoring_locks import assert_no_pending
                    assert_no_pending(runner.REPO)
                    canonical_before = runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite")
            except BaseException as error:
                print(json.dumps({"batchPublicationSetupTimingsSeconds": {
                    "batchRoot": str(args.batch_root), "attempt": number + 1,
                    "stage": "attemptSelectionAndPendingGuards", "outcome": "FAILED",
                    "elapsed": time.perf_counter() - setup_started,
                    "errorType": type(error).__name__,
                }}), flush=True)
                raise
            print(json.dumps({"batchPublicationSetupTimingsSeconds": {
                "batchRoot": str(attempt.batch_root), "attempt": number + 1,
                "stage": "attemptSelectionAndPendingGuards", "outcome": "COMPLETED",
                "elapsed": time.perf_counter() - setup_started,
            }}), flush=True)
            if attempt.candidate_applied:
                publish(attempt)
                return
            try:
                publish(attempt)
                return
            except ValueError as error:
                advanced = runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite") != canonical_before
                if not advanced or number == 2 or args.publication_format != "compact":
                    raise
                print(json.dumps({"publicationRetry": "CANONICAL_ADVANCED", "attempt": number + 1,
                                  "retainedAttemptRoot": str(attempt.batch_root), "error": str(error)}), flush=True)


@_timed_publication
def publish(args) -> None:
    summary_path = runner.artifact_path(args.batch_summary).resolve()
    batch = runner.artifact_path(args.batch_root).resolve()
    runner.prepare.require(batch.is_relative_to(runner.ROOT / "planning"), "batch root must be in planning")
    runner.prepare.require(summary_path.is_file(), "batch summary missing")
    summary_sha = getattr(args, "summary_sha256", None) or runner.panel.sha256(summary_path)
    summary = read_batch_summary(summary_path, summary_sha)
    workspace = runner.Workspace(runner.REPO)
    if getattr(workspace, "is_revision_store", False):
        with runner.publisher.panel_validation.manifest_verification_cache():
            state, _ = runner.current()
            applied = state.get("publicationBatches", {}).get(summary_sha)
            completion = workspace.current_revision("completion", summary_sha) if applied else None
            if completion:
                _publication_mode("reused")
                _publication_stage("candidateStorageBasisStateAndCompletion")
                backup = runner.Workspace(runner.REPO, runner.REPO / "data/local/catalog-authoring/backups/latest.sqlite")
                if not backup.database.is_file() or backup.current_revision("completion", summary_sha) != {**completion, "database": str(backup.database)}:
                    workspace.backup()
                verify_completion_revision(summary_sha, applied)
                report_completed(runner.artifact_path(applied["batchRoot"]), applied, canonical=args.apply_canonical)
                return
    from catalog_completed_checks import completed_checks
    historical = completed_checks(summary["works"], summary_sha=summary_sha,
                                  required_effect="canonical" if args.apply_canonical else "candidate")
    if any(row["status"] == "READY_FOR_PUBLICATION" and row["workId"] not in historical for row in summary["works"]):
        read_batch_summary(summary_path, summary_sha, batch=batch)
    entries = []
    for row in summary["works"]:
        if row["status"] != "READY_FOR_PUBLICATION":
            continue
        checked_path = runner.artifact_path(row["checkedPath"]).resolve()
        runner.prepare.require(runner.panel.sha256(checked_path) == row["checkedSha256"], "summary CHECKED SHA changed")
        checked = runner.panel.read_json(checked_path)
        runner.prepare.require(checked["status"] == row["status"] and checked["workId"] == row["workId"], "summary CHECKED identity changed")
        if row["workId"] in historical:
            print(json.dumps({"alreadyApplied": row["workId"], "proof": historical[row["workId"]]}), flush=True)
            continue
        backup_status = checked_backup_status(row)
        if getattr(workspace, "is_revision_store", False):
            runner.verify_check_storage(checked_path.parent, require_backup=True)
        else:
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
    if not entries and historical:
        _publication_mode("reused")
        _finish_publication_timing()
        print(json.dumps({"status": "ALREADY_APPLIED", "summarySha256": summary_sha, "works": len(historical),
                          "completedChecks": historical}), flush=True)
        return
    runner.prepare.require(entries, "no unpublished READY results")
    runner.prepare.require(len({item[0] for item in entries}) == len(entries), "duplicate Work in batch")
    attempts = retry_attempts(args.preflight_retry, {item[0] for item in entries})

    _publication_stage("currentPairAndPreflight")
    with runner.publisher.panel_validation.manifest_verification_cache():
        state, current_root = runner.current()
        applied = state.get("publicationBatches", {}).get(summary_sha)
        if applied and (runner.artifact_path(applied["batchRoot"]) / "BATCH-COMPLETED.json").exists():
            _publication_mode("reused")
            _publication_stage("candidateStorageBasisStateAndCompletion")
            verify_completed(runner.artifact_path(applied["batchRoot"]), applied)
            report_completed(runner.artifact_path(applied["batchRoot"]), applied, canonical=args.apply_canonical)
            return
        if applied:
            runner.prepare.require(runner.artifact_path(applied["batchRoot"]).resolve() == batch, "resume incomplete batch in its original batch root")
        require_previous_completion(state, summary_sha)
        existing_receipt = batch / "BATCH-FINISHED.json"
        if existing_receipt.exists() and not args.preflight_only:
            _publication_mode("resumed")
            saved = runner.panel.read_json(existing_receipt)
            state, current_root = runner.current()
            original_publication = runner.artifact_path(saved["finalPublicationRoot"]).resolve()
            retained_current = False
            if (current_root / "CURATION-BASELINE.json").is_file():
                basis = workspace.get_revision(runner.panel.read_json(current_root / "CURATION-BASELINE.json")["revision"])["payload"]
                retained_current = basis.get("provenance", {}).get("publicationManifestSha256") == saved["publicationManifestSha256"]
            if current_root == original_publication or retained_current:
                _publication_stage("candidateStorageBasisStateAndCompletion")
                runner.prepare.require(
                    state["latestCandidate"]["catalogSha256"] == runner.panel.sha256(current_root / "catalog-expanded.candidate.sqlite")
                    and saved["summarySha256"] == summary_sha
                    and saved["readbackSha256"] == runner.panel.sha256(runner.artifact_path(saved["readback"])),
                    "completed batch identity changed",
                )
                storage_path = batch / "BATCH-STORAGE.json"
                runner.publisher._verify_result_manifest(original_publication)
                runner.prepare.require(runner.readback_matches(runner.artifact_path(saved["readback"]), runner.REPO, original_publication, next(item[3] for item in entries if item[0] == saved["works"][-1]["workId"]) / "panel-result"), "completed batch readback needs refresh")
                from compact_publication import durable_batch_paths
                storage = runner.panel.read_json(storage_path) if storage_path.exists() else runner.preserve(durable_batch_paths(batch), "batch-publication:verified-recovery")
                verify_storage(storage, [existing_receipt, runner.artifact_path(saved["readback"]), original_publication])
                if not storage_path.exists():
                    runner.write(storage_path, storage)
                applied = {"batchRoot": str(batch), "receiptSha256": runner.panel.sha256(existing_receipt)}
                state.setdefault("publicationBatches", {})[summary_sha] = applied
                state["pendingPublicationBatch"] = summary_sha
                runner.commit_state(state, expected_sha=runner.panel.sha256(runner.ROOT / "STATE.json"),
                                    canonical_sha=runner.panel.read_json(runner.artifact_path(saved["readback"]))["canonicalSha256"], baseline=current_root)
                state_storage = complete_batch(batch, existing_receipt, storage)
                report_completed(batch, applied, canonical=args.apply_canonical, status="VERIFIED",
                                 works=len(saved["works"]), eligible=state["latestCandidate"]["recommendationEligibleCount"], stateStorage=state_storage)
                return
            runner.prepare.require(saved["beforeCatalogSha256"] == state["latestCandidate"]["catalogSha256"], "historical batch current advanced; reconcile its applied receipt instead of replaying publication")
        state_sha = runner.panel.sha256(runner.ROOT / "STATE.json")
        state, initial = runner.current()
        preflight_errors = []
        checks = []
        identity = code_identity()
        canonical_sha = runner.panel.sha256(runner.REPO / "data/source/catalog.sqlite")
        if args.preflight_only:
            _publication_mode("preflight")
        elif args.publication_format == "compact":
            interrupted = (batch / "compact-working/IDENTITY.json").is_file() or (batch / "publication-compact/IDENTITY.json").is_file()
            _publication_mode("resumed" if interrupted else "new")
        else:
            _publication_mode("resumed" if (batch / "intent-001.json").is_file() else "new")
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
                    _finish_publication_timing("BLOCKED" if common_failure else "COMPLETED")
                    print(json.dumps({"status": "BLOCKED" if common_failure else "PREFLIGHT_COMPLETE", "reportRoot": str(report_root), "passed": len(passed), "blocked": len(preflight_errors)}), flush=True)
                    return
        runner.prepare.require(not preflight_errors, "batch publisher preflight blocked before mutation: " + json.dumps(preflight_errors, ensure_ascii=False))
        first_sha = state["latestCandidate"]["catalogSha256"]
        registry = initial / "catalog-source-registry.candidate.sqlite"
        publications = []
        compact_failures = []
        if args.publication_format == "compact":
            _publication_stage("compactDependenciesAndApply")
            sys.path.insert(0, str(runner.REPO / "scripts/catalog_authoring"))
            import compact_publication
            output, published_ids, compact_failures = compact_publication.publish(batch, entries, initial, summary_sha,
                checkpoint_every=args.checkpoint_every)
            publications = [(work_id, output, sealed) for work_id, run, frozen, sealed in entries if work_id in set(published_ids)]
        else:
            _publication_stage("fullPublication")
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

        _publication_stage("productReadback")
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
        runner.prepare.require(read_batch_summary(summary_path, summary_sha, batch=batch) == summary,
                               "batch summary changed during publication")
        runner.prepare.require(verified["catalogSha256"] == runner.panel.sha256(last / "catalog-expanded.candidate.sqlite"), "final candidate changed")
        with sqlite3.connect(f"file:{(last / 'catalog-expanded.candidate.sqlite').as_posix()}?mode=ro", uri=True) as db:
            for work_id, _, _ in publications:
                sealed = next(source for wid, _, source in publications if wid == work_id)
                promotion = runner.panel.read_csv(sealed / "panel-result/chunk-01/promotion-ledger.csv", runner.panel.PROMOTION_FIELDS)
                import scope_correction as scope
                excluded = len(promotion) == 1 and promotion[0]["panelOutcome"] == scope.OUTCOME
                if excluded:
                    frozen = next(root for wid, _, root, _ in entries if wid == work_id)
                    scope.validate(frozen / "panel-input", sealed / "panel-result")
                expected = ("false", "false", "true") if excluded else ("true", "true", "false")
                runner.prepare.require(db.execute("select onboardingEligible,recommendationEligible,libraryOnly from source_works where id=?", (work_id,)).fetchone() == expected, f"published Work eligibility differs from bound result: {work_id}")
        _candidate_publication_stage("candidateArtifactStorage")
        receipt = batch / "BATCH-FINISHED.json"
        if not receipt.exists():
            runner.write(receipt, {
                "status": "READBACK_VERIFIED", "summaryPath": str(summary_path), "summarySha256": summary_sha,
                "beforeCatalogSha256": first_sha, "finalPublicationRoot": str(last),
                "publicationManifestSha256": runner.panel.sha256(last / "MANIFEST.sha256"),
                "readback": str(readback), "readbackSha256": runner.panel.sha256(readback),
                "blockedWorks": compact_failures, "alreadyAppliedWorks": historical,
                "works": [{"workId": work_id, "publicationRoot": str(output), "manifestSha256": runner.panel.sha256(output / "MANIFEST.sha256")} for work_id, output, _ in publications],
            })
        else:
            saved = runner.panel.read_json(receipt)
            runner.prepare.require(saved["readbackSha256"] == runner.panel.sha256(readback) and saved["summarySha256"] == summary_sha, "batch receipt changed")
        # The complete publication and readback are backed up before STATE can point to them.
        storage_path = batch / "BATCH-STORAGE.json"
        from compact_publication import durable_batch_paths
        storage = runner.panel.read_json(storage_path) if storage_path.exists() else runner.preserve(durable_batch_paths(batch), "batch-publication:verified", phase_boundary=True)
        runner.prepare.require(storage["backup"]["status"] == "BACKED_UP" or
                               (getattr(workspace, "is_revision_store", False) and storage["backup"]["status"] == "PERSISTED"), "batch persistence incomplete")
        verify_storage(storage, [receipt, readback, last])
        if not storage_path.exists():
            runner.write(storage_path, storage)
        latest_state, latest = runner.current()
        runner.prepare.require(runner.panel.sha256(runner.ROOT / "STATE.json") == state_sha and latest == initial, "current advanced during batch")
        _candidate_publication_stage("curationBasisAdvance")
        if getattr(workspace, "is_revision_store", False):
            from catalog_retention import advance_basis
            selected_entries = [entry for entry in entries if entry[0] in {work_id for work_id, _, _ in publications}]
            last = advance_basis(runner.REPO, initial, last, selected_entries)
        _candidate_publication_stage("candidateStateCommit")
        previous_count = latest_state["latestCandidate"]["recommendationEligibleCount"]
        latest_state["latestCandidate"] = {
            "root": os.path.relpath(last, runner.ROOT).replace("\\", "/"),
            "previousBaselineRoot": os.path.relpath(initial, runner.ROOT).replace("\\", "/"),
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
        latest_state["pendingPublicationBatch"] = summary_sha
        runner.commit_state(latest_state, expected_sha=state_sha, canonical_sha=verified["canonicalSha256"], baseline=initial)
        _candidate_publication_stage("candidateCompletion")
        state_storage = complete_batch(batch, receipt, storage)
        report_completed(batch, latest_state["publicationBatches"][summary_sha], canonical=args.apply_canonical,
                         status="VERIFIED", works=len(publications), eligible=verified["counts"]["eligible"],
                         blockedWorks=compact_failures, batchStorage=storage, stateStorage=state_storage)


if __name__ == "__main__":
    main()
