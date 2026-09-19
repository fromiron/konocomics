"""Opt-in Stop reminder for a saved Catalog result whose queue send was not acknowledged.

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
    if assignment["phase"] == "collection":
        rows = [json.loads(line) for line in data.decode("utf-8").splitlines() if line.strip()]
    else:
        rows = json.loads(data)["works"]
    if len(rows) != 1 or rows[0].get("workId") != assignment["workId"]:
        raise ValueError("Result does not match the assigned Work")
    return hashlib.sha256(data).hexdigest()


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
    kind = "COLLECTION_READY" if assignment["phase"] == "collection" else "SOL_COMPLETE"
    return {"decision": "block", "reason": (
        f"Catalog notification only: saved {assignment['workId']} result {assignment['artifact']} "
        f"SHA256={sha} has no confirmed queue-send receipt. Send {kind} with the assigned paths "
        f"(runRoot={assignment['runRoot']}) to parent {assignment['parentThreadId']} using "
        "send_message_to_thread, then acknowledge the actual successful tool result with "
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
    ack = commands.add_parser("ack")
    ack.add_argument("--session", required=True)
    ack.add_argument("--sha", required=True)
    clear = commands.add_parser("clear")
    clear.add_argument("--session", required=True)
    args = parser.parse_args()
    if args.action == "register":
        register(args.session, args.parent, args.work, args.phase, args.artifact, args.run)
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
