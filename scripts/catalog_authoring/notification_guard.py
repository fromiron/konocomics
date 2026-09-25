"""Opt-in Stop reminder for Catalog result delivery and batch interruption reports.

No model, network, catalog mutation, publication or transcript parsing occurs here.
"""
import argparse
import hashlib
import json
import os
import sys
import uuid
from pathlib import Path

from authoring_paths import REPO, ROOT

STATE = REPO / "data/local/catalog-authoring/notifications"


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f".{uuid.uuid4().hex}.tmp")
    try:
        temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def state_path(session, directory=STATE):
    return directory / (str(uuid.UUID(session)) + ".json")


def result_identity(assignment):
    path = Path(assignment["artifact"])
    data = path.read_bytes()
    if assignment["phase"] == "batch":
        validate_batch(assignment, json.loads(data))
        return hashlib.sha256(data).hexdigest()
    if assignment["phase"] == "collection-batch":
        validate_collection_batch(assignment, json.loads(data))
        return hashlib.sha256(data).hexdigest()
    if assignment["phase"] == "collection":
        rows = [json.loads(line) for line in data.decode("utf-8").splitlines() if line.strip()]
    else:
        rows = json.loads(data)["works"]
    if len(rows) != 1 or rows[0].get("workId") != assignment["workId"]:
        raise ValueError("Result does not match the assigned Work")
    return hashlib.sha256(data).hexdigest()


def validate_batch(assignment, summary):
    dispatch_path = Path(assignment["dispatchPath"])
    if hashlib.sha256(dispatch_path.read_bytes()).hexdigest() != assignment["dispatchSha256"]:
        raise ValueError("Batch dispatch changed")
    dispatch = read(dispatch_path)
    if (summary.get("batchId") != dispatch["batchId"] or summary.get("ownerThreadId") != assignment["sessionId"]
            or summary.get("parentThreadId") != assignment["parentThreadId"]):
        raise ValueError("Batch ownership mismatch")
    expected = [row["workId"] for row in dispatch["works"]]
    rows = summary["works"]
    actual = [row["workId"] for row in rows]
    if len(set(expected)) != len(expected) or len(set(actual)) != len(actual) or set(actual) != set(expected):
        raise ValueError("Batch results missing, duplicated or outside assignment")
    for key in ("processedCount", "assignedCount", "workCount"):
        if key in summary and (type(summary[key]) is not int or summary[key] != len(rows)):
            raise ValueError(f"Batch {key} differs from bound results")
    if "resultCounts" in summary:
        counts = summary["resultCounts"]
        statuses = {"READY_FOR_PUBLICATION", "HOLD", "ERROR"}
        if not isinstance(counts, dict) or set(counts) - statuses or any(type(counts.get(status, 0)) is not int or counts.get(status, 0) != sum(row["status"] == status for row in rows) for status in statuses):
            raise ValueError("Batch resultCounts differ from bound results")
    for row in rows:
        path = Path(row["checkedPath"]).resolve()
        if not path.is_relative_to(Path(assignment["runRoot"]).resolve()):
            raise ValueError("Batch result outside assigned directory")
        if hashlib.sha256(path.read_bytes()).hexdigest() != row["checkedSha256"]:
            raise ValueError("Batch result SHA mismatch")
        checked = read(path)
        if checked.get("workId") != row["workId"] or checked.get("status") != row["status"]:
            raise ValueError("Batch result identity mismatch")
        if row["status"] not in ("READY_FOR_PUBLICATION", "HOLD", "ERROR"):
            raise ValueError("Batch result has no terminal check state")
        if row["status"] == "ERROR":
            if not checked.get("error"):
                raise ValueError("Batch error reason is missing")
            continue
        storage = read(path.parent / "CHECK-STORAGE.json")
        if storage["checkedSha256"] != row["checkedSha256"] or storage["storage"]["backup"]["status"] != "BACKED_UP":
            raise ValueError("Batch check backup binding mismatch")
        config = read(path.parent / "RUN.json")
        from authoring_paths import artifact_path
        decision = artifact_path(config["decisionsPath"])
        if hashlib.sha256(decision.read_bytes()).hexdigest() != checked["decisionsSha256"]:
            raise ValueError("Batch decision changed")
        frozen = path.parent / config.get("frozenDirectory", "frozen") / "panel-input/PANEL-INPUT.sha256"
        if hashlib.sha256(frozen.read_bytes()).hexdigest() != checked["inputManifestSha256"]:
            raise ValueError("Batch input binding changed")
        if row["status"] == "READY_FOR_PUBLICATION":
            import publish_factor_batch as publisher
            sealed = artifact_path(checked["sealedRoot"])
            publisher._verify_result_manifest(sealed)
            if hashlib.sha256((sealed / "MANIFEST.sha256").read_bytes()).hexdigest() != checked["resultManifestSha256"]:
                raise ValueError("Batch sealed result changed")


def validate_collection_batch(assignment, summary):
    dispatch_path = Path(assignment["dispatchPath"])
    if hashlib.sha256(dispatch_path.read_bytes()).hexdigest() != assignment["dispatchSha256"]:
        raise ValueError("Collection dispatch changed")
    dispatch = read(dispatch_path)
    if dispatch.get("phase") != "collection-only":
        raise ValueError("Collection assignment phase mismatch")
    if (summary.get("batchId") != dispatch["batchId"] or summary.get("ownerThreadId") != assignment["sessionId"]
            or summary.get("parentThreadId") != assignment["parentThreadId"] or summary.get("phase") != "collection-only"
            or summary.get("status") != "COLLECTION_COMPLETE" or summary.get("adjudicationAllowed") is not False
            or summary.get("publicationAllowed") is not False):
        raise ValueError("Collection batch ownership or phase mismatch")
    rows = summary.get("works")
    expected_rows = {row["workId"]: row for row in dispatch["works"]}
    if not isinstance(rows, list) or len(rows) != len(expected_rows) or {row.get("workId") for row in rows} != set(expected_rows):
        raise ValueError("Collection results missing, duplicated or outside assignment")
    for key in ("processedCount", "assignedCount"):
        if type(summary.get(key)) is not int or summary[key] != len(rows):
            raise ValueError(f"Collection {key} differs from bound results")
    counts = summary.get("statusCounts")
    if (not isinstance(counts, dict) or set(counts) - {"EVIDENCE_FOUND", "INSUFFICIENT"}
            or any(type(counts.get(status, 0)) is not int
                   or counts.get(status, 0) != sum(row.get("status") == status for row in rows)
                   for status in ("EVIDENCE_FOUND", "INSUFFICIENT"))):
        raise ValueError("Collection statusCounts differ from bound results")
    validator = summary.get("validator", {})
    if (validator.get("status") != "PASS" or validator.get("perWorkSourceAudit") is not True
            or validator.get("allAssignedResearchRowsPresent") is not True
            or validator.get("dispatchIdentityAndUserSourceShaVerified") is not True
            or validator.get("rawReceiptBytesAndShaVerified") is not True
            or validator.get("workspaceAndAppendOnlyBackupReadbackVerified") is not True
            or validator.get("backupStatus") != "BACKED_UP"):
        raise ValueError("Collection validation or backup receipt is incomplete")
    for row in rows:
        work_id = row["workId"]
        assigned = expected_rows[work_id]
        collection = Path(assigned["collectionOutput"]).resolve()
        if row.get("status") not in {"EVIDENCE_FOUND", "INSUFFICIENT"}:
            raise ValueError("Collection result has no terminal state")
        if row.get("userSourcesPath") != assigned["userSourcesPath"] or row.get("userSourcesSha256") != assigned["userSourcesSha256"]:
            raise ValueError("Collection user-source binding changed")
        user_sources = Path(row["userSourcesPath"]).resolve()
        if hashlib.sha256(user_sources.read_bytes()).hexdigest() != row["userSourcesSha256"]:
            raise ValueError("Collection user-source SHA mismatch")
        if Path(row["collectionPath"]).resolve() != collection:
            raise ValueError("Collection output path changed")
        research = Path(row["researchPath"]).resolve()
        if not research.is_relative_to(collection) or hashlib.sha256(research.read_bytes()).hexdigest() != row["researchSha256"]:
            raise ValueError("Collection research path or SHA mismatch")
        storage = row.get("storage", {})
        if storage.get("researchSha256Matches") is not True or storage.get("workspaceSnapshotId") != storage.get("backupSnapshotId"):
            raise ValueError("Collection work backup binding mismatch")
        receipts = row.get("sourceReceiptBindings")
        if not isinstance(receipts, list) or type(row.get("sourceCount")) is not int or len(receipts) != row["sourceCount"]:
            raise ValueError("Collection source receipt count mismatch")
        for binding in receipts:
            receipt_path = Path(binding["receiptPath"]).resolve()
            if (not receipt_path.is_relative_to(collection)
                    or hashlib.sha256(receipt_path.read_bytes()).hexdigest() != binding["receiptSha256"]):
                raise ValueError("Collection source receipt SHA mismatch")
            receipt = read(receipt_path)
            if receipt.get("url") != binding.get("sourceUrl"):
                raise ValueError("Collection source receipt URL mismatch")
            raw_path, raw_sha = binding.get("rawPath"), binding.get("rawSha256")
            if raw_path and raw_sha:
                raw = Path(raw_path).resolve()
                if not raw.is_relative_to(collection) or hashlib.sha256(raw.read_bytes()).hexdigest() != raw_sha:
                    raise ValueError("Collection source body SHA mismatch")
                if binding.get("bytes") is not None and raw.stat().st_size != binding["bytes"]:
                    raise ValueError("Collection source body length mismatch")
            elif not receipt.get("error"):
                raise ValueError("Collection source body is missing without an error receipt")


def register_batch(session, parent, dispatch, artifact, run, directory=STATE, artifact_root=ROOT):
    dispatch = Path(dispatch).resolve()
    if not dispatch.is_relative_to(artifact_root.resolve()):
        raise ValueError("Batch dispatch outside authoring artifacts")
    data = read(dispatch)
    if data["ownerThreadId"] != session or data["parentThreadId"] != parent:
        raise ValueError("Batch assignment ownership mismatch")
    phase = "collection-batch" if data.get("phase") == "collection-only" else "batch"
    register(session, parent, data["batchId"], phase, artifact, run, directory, artifact_root)
    path = state_path(session, directory)
    value = read(path)
    binding = {"dispatchPath": str(dispatch), "dispatchSha256": hashlib.sha256(dispatch.read_bytes()).hexdigest()}
    if "dispatchSha256" in value and any(value.get(k) != v for k, v in binding.items()):
        raise ValueError("Registered batch changed")
    value.update(binding)
    write(path, value)


def register(session, parent, work, phase, artifact, run, directory=STATE, artifact_root=ROOT):
    path = state_path(session, directory)
    parent = str(uuid.UUID(parent))
    artifact, run = Path(artifact).resolve(), Path(run).resolve()
    if not artifact.is_relative_to(artifact_root.resolve()) or not run.is_relative_to(artifact_root.resolve()):
        raise ValueError("Notification paths must stay in local authoring artifacts")
    value = {"sessionId": str(uuid.UUID(session)), "parentThreadId": parent, "workId": work,
             "phase": phase, "artifact": str(artifact), "runRoot": str(run), "active": True}
    if path.exists():
        old = read(path)
        if all(old.get(k) == v for k, v in value.items()):
            return  # Preserve successful sends and the one-reminder flag on retry.
        if old.get("active") and not old.get("notifiedSha256"):
            raise ValueError("Previous assignment still active; finish or explicitly clear it")
    write(path, value)


def acknowledge(session, sha, tool_result, directory=STATE):
    path = state_path(session, directory)
    assignment = read(path)
    if not assignment.get("active") or result_identity(assignment) != sha.lower():
        raise ValueError("Acknowledgement is not for the current saved result")
    # Accept the actual app tool envelope or its decoded text payload, not an invented flag.
    if tool_result.get("isError"):
        raise ValueError("Queue send failed")
    payload = tool_result
    if "content" in payload:
        texts = [item["text"] for item in payload["content"] if item.get("type") == "text"]
        if len(texts) != 1:
            raise ValueError("Unexpected queue response")
        payload = json.loads(texts[0])
    if payload.get("threadId") != assignment["parentThreadId"]:
        raise ValueError("Queue response does not confirm the assigned parent")
    assignment.update(notifiedSha256=sha.lower(), queueResponse=tool_result)
    write(path, assignment)


def on_stop(event, directory=STATE):
    if event.get("hook_event_name") != "Stop" or event.get("stop_hook_active"):
        return {}
    path = state_path(event["session_id"], directory)
    if not path.exists():
        return {}
    assignment = read(path)
    if assignment.get("active") and assignment.get("phase") in {"batch", "collection-batch"}:
        # Stop re-entry is suppressed by stop_hook_active above, not a lifetime flag:
        # a later turn can stop with unfinished work even after an earlier report.
        return {"decision": "block", "reason": (
            "This hook is not an instruction to stop authorized work. If unfinished work is "
            "authorized and no real blocker or user stop exists, continue from the current "
            "checkpoint now; do not end merely to deliver a stop report. A newer parent stage "
            "assignment takes precedence over the historical registration shown below. "
            f"Registered Catalog batch: {assignment['workId']}. Only when actually stopping, "
            f"send_message_to_thread to parent {assignment['parentThreadId']} with destination "
            "model=gpt-5.6-sol and thinking=high, plus the actual current "
            f"checkpoint under {assignment['runRoot']}. If assigned work remains, send "
            "CATALOG_PARTIAL_STOP with batchId, processedCount, nextWorkId, checkpoint path, "
            "exactReason and needsResume. Use needsResume=false for a user-requested stop or an "
            "unresolved blocker; do not resume against a user stop. Do not invent a platform limit. "
            "If the assigned stage is finished, report its actual completion and whether parent "
            "action is needed; use COLLECTION_STAGE_COMPLETE for collection-only batches and "
            "CATALOG_BATCH_COMPLETE for adjudication batches, with the existing ack command only "
            "after the matching phase validator passes. If already sent this turn for this checkpoint, "
            "retain that successful tool response instead of sending twice. Confirm the send result; "
            "on failure preserve the error and state delivery failed in the final response. "
            "Do not repeat completed work or publish merely to satisfy this hook. This does not "
            "prohibit continuing unfinished collection or adjudication already authorized by the parent."
        )}
    if not assignment.get("active") or assignment.get("reminded") or not Path(assignment["artifact"]).is_file():
        return {}
    sha = result_identity(assignment)
    if assignment.get("notifiedSha256") == sha:
        return {}
    # One reminder per explicitly registered stage, even if its file later changes.
    # A per-session exclusive claim prevents concurrent Stop deliveries from doubling it.
    marker = path.with_suffix(".reminding")
    try:
        claim = marker.open("x")
    except FileExistsError:
        return {}
    try:
        with claim:
            current = read(path)
            if current.get("reminded") or current.get("notifiedSha256") == sha:
                return {}
            current["reminded"] = True
            write(path, current)
    finally:
        marker.unlink(missing_ok=True)
    kind = ("CATALOG_BATCH_COMPLETE" if assignment["phase"] == "batch" else
            "COLLECTION_STAGE_COMPLETE" if assignment["phase"] == "collection-batch" else
            "COLLECTION_READY" if assignment["phase"] == "collection" else "SOL_COMPLETE")
    return {"decision": "block", "reason": (
        f"Catalog notification only: saved {assignment['workId']} result {assignment['artifact']} "
        f"SHA256={sha} has no confirmed queue-send receipt. Send {kind} with the assigned paths "
        f"(runRoot={assignment['runRoot']}) to parent {assignment['parentThreadId']} using "
        "send_message_to_thread with destination model=gpt-5.6-sol and thinking=high, "
        "then acknowledge the actual successful tool result with "
        "scripts/catalog_authoring/notification_guard.py ack. If already sent, record its existing "
        "successful response instead. Do not recollect, readjudicate, publish or assign another Work. "
        "On send failure, preserve the error and stop; this hook will not retry again."
    )}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="action")
    arm = commands.add_parser("register")
    for name in ("session", "parent", "work", "artifact", "run"):
        arm.add_argument("--" + name, required=True)
    arm.add_argument("--phase", choices=("collection", "adjudication"), required=True)
    batch = commands.add_parser("register-batch")
    for name in ("session", "parent", "dispatch", "artifact", "run"):
        batch.add_argument("--" + name, required=True)
    ack = commands.add_parser("ack")
    ack.add_argument("--session", required=True)
    ack.add_argument("--sha", required=True)
    clear = commands.add_parser("clear")
    clear.add_argument("--session", required=True)
    args = parser.parse_args()
    if args.action == "register":
        register(args.session, args.parent, args.work, args.phase, args.artifact, args.run)
    elif args.action == "register-batch":
        register_batch(args.session, args.parent, args.dispatch, args.artifact, args.run)
    elif args.action == "ack":
        acknowledge(args.session, args.sha, json.load(sys.stdin))
    elif args.action == "clear":
        path = state_path(args.session)
        value = read(path)
        value["active"] = False
        write(path, value)
    else:
        try:
            print(json.dumps(on_stop(json.load(sys.stdin)), ensure_ascii=False))
        except (OSError, ValueError, KeyError, TypeError) as error:
            print(json.dumps({"systemMessage": f"Catalog notification guard skipped: {error}"}))


if __name__ == "__main__":
    main()
