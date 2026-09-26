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
EVENT = "catalog-notification-v1"


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def notification_identity(assignment, checkpoint_sha, kind):
    bound = {key: assignment[key] for key in ("sessionId", "parentThreadId", "workId", "phase", "runRoot")}
    bound.update({key: assignment[key] for key in ("dispatchPath", "dispatchSha256") if key in assignment})
    return {"schemaVersion": EVENT, "assignment": bound,
            "generation": assignment.get("generation", digest(bound)),
            "kind": kind, "checkpointSha256": checkpoint_sha}


def locked(path):
    from catalog_authoring_runner import exclusive
    return exclusive(path.with_suffix(".lock"), wait=True)


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write(path, value):
    write_bytes(path, (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))


def write_bytes(path, body):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f".{uuid.uuid4().hex}.tmp")
    try:
        with temporary.open("xb") as stream:
            stream.write(body)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def state_path(session, directory=STATE):
    return directory / (str(uuid.UUID(session)) + ".json")


def remember_assignment(assignment, directory):
    identity = notification_identity(assignment, "", "complete")
    value = {"assignment": identity["assignment"], "generation": identity["generation"]}
    path = directory / "roots" / assignment["parentThreadId"] / (digest(value) + ".json")
    if path.exists():
        if read(path) != value:
            raise ValueError("Registered notification root changed")
    else:
        write(path, value)


def registered_events(parent, directory):
    """Only registered notification directories; never scan the Catalog archive."""
    assignments = []
    for path in directory.glob("*.json"):
        value = read(path)
        if value.get("sessionId") == path.stem and value.get("parentThreadId") == parent:
            assignments.append(value)
    for assignment in assignments:
        remember_assignment(assignment, directory)
    found = {}
    for registration in (directory / "roots" / parent).glob("*.json"):
        record = read(registration)
        assignment = record["assignment"]
        if assignment["parentThreadId"] != parent or digest(record) != registration.stem:
            raise ValueError("Notification root registration mismatch")
        root = Path(assignment["runRoot"])
        for path in (root / "notification-events").glob("*/event.json"):
            value = read(path)
            if value.get("assignment") == assignment and value.get("generation") == record["generation"]:
                if value["eventId"] != path.parent.name:
                    raise ValueError("Registered event directory mismatch")
                found[str(path)] = path
    return sorted(found.values(), key=str)


def index_event(path, directory):
    value = read(path)
    parent = value["assignment"]["parentThreadId"]
    index = directory / "inbox" / parent / (value["eventId"] + ".json")
    ref = {"path": str(path), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
    if index.exists():
        if read(index) != ref:
            raise ValueError("Inbox index differs from immutable event")
    else:
        verify_event(value)
        write(index, ref)
    return index


def reconcile(parent, directory=STATE):
    return [index_event(path, directory) for path in registered_events(str(uuid.UUID(parent)), directory)]


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
        if storage["checkedSha256"] != row["checkedSha256"]:
            raise ValueError("Batch check backup binding mismatch")
        if storage["storage"]["backup"]["status"] == "PERSISTED":
            import catalog_authoring_runner as runner
            runner.verify_check_storage(path.parent, require_backup=True)
        elif storage["storage"]["backup"]["status"] != "BACKED_UP":
            raise ValueError("Batch check backup is incomplete")
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
    from catalog_workspace import Workspace
    workspace = Workspace()
    revision_store = getattr(workspace, "is_revision_store", False)
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
            or not (validator.get("workspaceAndAppendOnlyBackupReadbackVerified") is True
                    or (revision_store and validator.get("workspaceAndBackupReadbackVerified") is True))
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
        if storage.get("researchSha256Matches") is not True:
            raise ValueError("Collection work backup binding mismatch")
        if revision_store:
            # Legacy summaries may still contain numeric IDs. Actual retained
            # bytes, not renamed IDs or status flags, establish the new backup.
            reference = workspace.saved_file_snapshot(research)
            if reference is None:
                raise ValueError("Collection research is not persisted")
            backup = Workspace(workspace.repo, workspace.repo / "data/local/catalog-authoring/backups/latest.sqlite")
            backup.verify_saved(reference, [research])
        elif storage.get("workspaceSnapshotId") != storage.get("backupSnapshotId"):
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
            if revision_store:
                retained_paths = [receipt_path] + ([raw] if raw_path and raw_sha else [])
                groups, missing = workspace.saved_files(retained_paths)
                if missing:
                    raise ValueError("Collection original bytes are not persisted")
                for reference, paths in groups:
                    backup.verify_saved(reference, paths)


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
    value["generation"] = digest({key: value[key] for key in
                                  ("sessionId", "parentThreadId", "workId", "phase", "runRoot", "dispatchSha256")})
    remember_assignment(value, directory)
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
        remember_assignment(old, directory)
        reconcile(old["parentThreadId"], directory)
        if all(old.get(k) == v for k, v in value.items() if k != "active"):
            return  # Preserve successful sends and the one-reminder flag on retry.
        if old.get("active") and not old.get("notifiedSha256"):
            previous = Path(old["artifact"])
            if not previous.is_file():
                raise ValueError("Previous assignment still active; finish or explicitly clear it")
            identity = notification_identity(old, hashlib.sha256(previous.read_bytes()).hexdigest(), "complete")
            queued = Path(old["runRoot"]) / "notification-events" / digest(identity) / "event.json"
            if not queued.is_file():
                raise ValueError("Previous assignment still active; enqueue completion or explicitly clear it")
            completion = read(queued)
            if completion["eventId"] != digest(identity):
                raise ValueError("Previous completion identity changed")
            verify_event(completion)
            index_event(queued, directory)
    remember_assignment(value, directory)
    write(path, value)


def arm(session, directory=STATE, *, resume=False):
    """Explicit execution opt-in for the current prompt, never for report turns."""
    path = state_path(session, directory)
    with locked(path):
        value = read(path)
        turn = read(directory / "turns" / path.name)
        if not value.get("active") or value.get("suspended"):
            if not resume:
                raise ValueError("Assignment stopped; only an explicitly authorized resume may arm it")
            generation = notification_identity(value, "", "complete")["generation"]
            if (not value.get("stoppedTurnId") or value["stoppedTurnId"] == turn["turnId"]
                    or value.get("stoppedGeneration") != generation):
                raise ValueError("Resume requires a new turn and the same stopped assignment generation")
        if "dispatchPath" in value and hashlib.sha256(Path(value["dispatchPath"]).read_bytes()).hexdigest() != value["dispatchSha256"]:
            raise ValueError("Execution assignment changed")
        value["executionTurnId"] = turn["turnId"]
        value["suspended"] = False
        value["active"] = True
        write(path, value)


def validate_partial(assignment, summary):
    dispatch = read(Path(assignment["dispatchPath"]))
    if hashlib.sha256(Path(assignment["dispatchPath"]).read_bytes()).hexdigest() != assignment["dispatchSha256"]:
        raise ValueError("Partial report dispatch changed")
    if any(summary.get(key) != assignment[field] for key, field in
           (("batchId", "workId"), ("ownerThreadId", "sessionId"), ("parentThreadId", "parentThreadId"), ("phase", "phase"))):
        raise ValueError("Partial report ownership/phase mismatch")
    count = summary.get("processedCount")
    if (type(count) is not int or not 0 <= count <= len(dispatch["works"])
            or type(summary.get("needsResume")) is not bool
            or not isinstance(summary.get("exactReason"), str) or not summary["exactReason"].strip()
            or summary.get("nextWorkId") not in {None, *[row["workId"] for row in dispatch["works"]]}):
        raise ValueError("Partial report checkpoint is incomplete")


def enqueue(session, directory=STATE, *, checkpoint=None, kind="complete", phase_boundary=False):
    assignment = read(state_path(session, directory))
    if (not assignment.get("active") and kind != "user-stop") or kind not in {"complete", "partial-stop", "user-stop"}:
        raise ValueError("Inactive assignment or invalid notification kind")
    source = Path(checkpoint or assignment["artifact"]).resolve()
    if not source.is_relative_to(Path(assignment["runRoot"]).resolve()):
        raise ValueError("Checkpoint outside assigned run")
    body = source.read_bytes()
    if phase_boundary:
        # Explicit CLI handoff is a backup boundary. Stop/Interrupt hooks never
        # perform a large backup or turn a PERSISTED receipt into a claimed backup.
        from catalog_workspace import Workspace
        workspace = Workspace()
        if getattr(workspace, "is_revision_store", False):
            roots = [source, Path(assignment["dispatchPath"])] if assignment.get("dispatchPath") else [source]
            summary = json.loads(body)
            for row in summary.get("works", []):
                for key in ("checkedPath", "researchPath"):
                    if row.get(key):
                        roots.append(Path(row[key]).parent)
            workspace.persist(roots, "phase:" + assignment["phase"], phase_boundary=True, reuse=True)
    identity = notification_identity(assignment, hashlib.sha256(body).hexdigest(), kind)
    remember_assignment(assignment, directory)
    event_id = digest(identity)
    folder = Path(assignment["runRoot"]) / "notification-events" / event_id
    path = folder / "event.json"
    saved = folder / "checkpoint.json"
    if (not assignment.get("active") and not path.is_file()
            and assignment.get("stoppedCheckpointSha256") != identity["checkpointSha256"]):
        raise ValueError("Stopped assignment cannot enqueue a new checkpoint")
    if kind == "user-stop":
        clear(session, directory, checkpoint_sha=identity["checkpointSha256"])
    with locked(path):
        if saved.exists() and saved.read_bytes() != body:
            raise ValueError("Immutable notification checkpoint changed")
        if not saved.exists():
            write_bytes(saved, body)
        value = {**identity, "eventId": event_id, "checkpointPath": str(saved)}
        verify_event(value)
        if path.exists() and read(path) != value:
            raise ValueError("Immutable notification event changed")
        write(path, value)
    index_event(path, directory)
    return path, value


def verify_event(value):
    identity = {key: value[key] for key in ("schemaVersion", "assignment", "generation", "kind", "checkpointSha256")}
    if value["schemaVersion"] != EVENT or digest(identity) != value["eventId"]:
        raise ValueError("Notification identity changed")
    assignment = {**value["assignment"], "artifact": value["checkpointPath"]}
    path = Path(value["checkpointPath"]).resolve()
    if not path.is_relative_to(Path(assignment["runRoot"]).resolve()):
        raise ValueError("Notification checkpoint outside run")
    if hashlib.sha256(path.read_bytes()).hexdigest() != value["checkpointSha256"]:
        raise ValueError("Notification checkpoint SHA mismatch")
    if value["kind"] == "complete":
        result_identity(assignment)
    elif value["kind"] in {"partial-stop", "user-stop"}:
        validate_partial(assignment, read(path))
        if value["kind"] == "user-stop" and read(path)["needsResume"]:
            raise ValueError("User stop cannot request automatic resume")
    else:
        raise ValueError("Unknown notification kind")


def pending(parent, directory=STATE):
    reconcile(parent, directory)
    rows = []
    for index in sorted((directory / "inbox" / str(uuid.UUID(parent))).glob("*.json")):
        ref = read(index)
        path = Path(ref["path"])
        if hashlib.sha256(path.read_bytes()).hexdigest() != ref["sha256"]:
            raise ValueError("Inbox event SHA mismatch")
        value = read(path)
        if value["assignment"]["parentThreadId"] != parent or value["eventId"] != index.stem:
            raise ValueError("Inbox parent mismatch")
        if (path.parent / "consumed.json").exists():
            ack = read(path.parent / "consumed.json")
            effect = path.parent / "handling.json"
            if ack != {"eventId": value["eventId"], "handlingSha256": hashlib.sha256(effect.read_bytes()).hexdigest()}:
                raise ValueError("Consumed acknowledgement changed")
            continue
        verify_event(value)
        handling = read(effect) if (effect := path.parent / "handling.json").exists() else {}
        rows.append({"eventId": value["eventId"], "path": str(path), "kind": value["kind"],
                     "checkpointSha256": value["checkpointSha256"], "batchId": value["assignment"]["workId"],
                     "handlingRecorded": bool(handling),
                     **handling.get("publicationCoverage", {})})
    return rows


def publication_coverage(value, handling):
    from authoring_paths import artifact_path
    import catalog_authoring_batch_publish as batch
    if value["kind"] != "complete" or value["assignment"]["phase"] != "batch":
        raise ValueError("Only completed adjudication batches can acknowledge publication")
    original = read(Path(value["checkpointPath"]))
    ready = {row["workId"] for row in original["works"] if row["status"] == "READY_FOR_PUBLICATION"}
    publications = handling.get("publications", [{"summaryPath": value["checkpointPath"], "summarySha256": value["checkpointSha256"]}])
    if not isinstance(publications, list) or not publications:
        raise ValueError("Publication summaries are required")
    ledger = read(ROOT / "STATE.json").get("publicationBatches", {})
    published, seen = set(), set()
    for reference in publications:
        if set(reference) != {"summaryPath", "summarySha256"}:
            raise ValueError("Invalid publication summary reference")
        path, sha = artifact_path(reference["summaryPath"]), reference["summarySha256"]
        if sha in seen or hashlib.sha256(path.read_bytes()).hexdigest() != sha:
            raise ValueError("Duplicate or changed publication summary")
        seen.add(sha)
        summary, chain_sha, visited = read(path), sha, set()
        node = summary
        while chain_sha != value["checkpointSha256"]:
            if chain_sha in visited or "sourceSummary" not in node:
                raise ValueError("Publication subset does not descend from this checkpoint")
            visited.add(chain_sha)
            source = node["sourceSummary"]
            parent_path = artifact_path(source["path"])
            if hashlib.sha256(parent_path.read_bytes()).hexdigest() != source["sha256"]:
                raise ValueError("Publication source summary changed")
            parent = read(parent_path)
            rows = node["works"]
            if len({row["workId"] for row in rows}) != len(rows) or any(row not in parent["works"] for row in rows):
                raise ValueError("Publication subset changed exact source rows")
            node, chain_sha = parent, source["sha256"]
        if node != original:
            raise ValueError("Publication origin differs from checkpoint")
        applied = ledger.get(sha)
        if not applied:
            raise ValueError("No authoritative publication for this summary")
        batch.verify_completed(Path(applied["batchRoot"]), applied)
        receipt = read(Path(applied["batchRoot"]) / "BATCH-FINISHED.json")
        rows = receipt["works"]
        ids = {row["workId"] for row in rows}
        allowed = {row["workId"] for row in summary["works"] if row["status"] == "READY_FOR_PUBLICATION"}
        if (receipt["summarySha256"] != sha or not ids or len(ids) != len(rows)
                or not ids <= allowed <= ready or ids & published):
            raise ValueError("Publication applied Work set differs or overlaps")
        published.update(ids)
    remaining = ready - published
    if ((handling["decision"] == "published" and remaining)
            or (handling["decision"] == "partially-published" and not remaining)):
        raise ValueError("Publication decision does not match remaining READY Works")
    return {"publishedWorkIds": sorted(published), "remainingReadyWorkIds": sorted(remaining)}


def consume(parent, event_id, effect, directory=STATE):
    if len(event_id) != 64 or any(char not in "0123456789abcdef" for char in event_id):
        raise ValueError("Invalid event ID")
    reconcile(parent, directory)
    index = directory / "inbox" / str(uuid.UUID(parent)) / (event_id + ".json")
    ref = read(index)
    path = Path(ref["path"])
    with locked(path):
        if hashlib.sha256(path.read_bytes()).hexdigest() != ref["sha256"]:
            raise ValueError("Inbox event SHA mismatch")
        value = read(path)
        if value["eventId"] != event_id:
            raise ValueError("Inbox event ID mismatch")
        verify_event(value)
        handling = read(Path(effect))
        if (handling.get("schemaVersion") != "catalog-notification-handling-v1"
                or handling.get("eventId") != event_id or handling.get("parentThreadId") != parent
                or value["assignment"]["parentThreadId"] != parent
                or handling.get("decision") not in {"deferred", "stopped", "stage-reviewed", "published", "partially-published"}
                or not isinstance(handling.get("reason"), str) or not handling["reason"].strip()):
            raise ValueError("Handling decision is not bound to this event and parent")
        if handling["decision"] in {"published", "partially-published"}:
            handling["publicationCoverage"] = publication_coverage(value, handling)
        elif "publicationCoverage" in handling or "publications" in handling:
            raise ValueError("Publication coverage requires a publication decision")
        saved = path.parent / "handling.json"
        if saved.exists() and read(saved) != handling:
            previous = read(saved)
            if (previous["decision"] != "partially-published" or handling["decision"] not in {"published", "partially-published"}
                    or not set(previous["publicationCoverage"]["publishedWorkIds"]) <= set(handling["publicationCoverage"]["publishedWorkIds"])):
                raise ValueError("Handling already recorded; reconcile it instead of repeating the effect")
        history = path.parent / "handling" / (digest(handling) + ".json")
        if not history.exists():
            write(history, handling)
        if not saved.exists() or read(saved) != handling:
            write(saved, handling)
        if handling["decision"] == "partially-published":
            return {"eventId": event_id, "status": "PARTIALLY_PUBLISHED", **handling["publicationCoverage"]}
        ack = {"eventId": event_id, "handlingSha256": hashlib.sha256(saved.read_bytes()).hexdigest()}
        if not (path.parent / "consumed.json").exists():
            write(path.parent / "consumed.json", ack)
        elif read(path.parent / "consumed.json") != ack:
            raise ValueError("Consumed acknowledgement changed")
        return ack


def clear(session, directory=STATE, *, checkpoint_sha=None):
    path = state_path(session, directory)
    with locked(path):
        value = read(path)
        if value.get("active") and not value.get("suspended"):
            turn_path = directory / "turns" / path.name
            value["stoppedTurnId"] = value.get("executionTurnId") or (read(turn_path)["turnId"] if turn_path.exists() else None)
            value["stoppedGeneration"] = notification_identity(value, "", "complete")["generation"]
        if checkpoint_sha is not None:
            value["stoppedCheckpointSha256"] = checkpoint_sha
        value.update(active=False, suspended=True, executionTurnId=None)
        write(path, value)


def on_prompt(event, directory=STATE):
    session = str(uuid.UUID(event["session_id"]))
    if not event.get("turn_id"):
        return {}
    write(directory / "turns" / (session + ".json"), {"turnId": event["turn_id"]})
    path = state_path(session, directory)
    if path.exists():
        with locked(path):
            value = read(path)
            value["executionTurnId"] = None
            write(path, value)
    events = registered_events(session, directory)
    if (any(not (path.parent / "consumed.json").exists() for path in events)
            or any(not (Path(read(index)["path"]).parent / "consumed.json").exists()
                   for index in (directory / "inbox" / session).glob("*.json"))):
        return {"hookSpecificOutput": {"hookEventName": "UserPromptSubmit", "additionalContext":
                "Catalog inbox may contain unconsumed checkpoints. Run notification_guard.py drain "
                f"--parent {session}; reconcile recorded handling/publication before any repeated effect. "
                "An inbox event does not authorize resuming a stopped assignment."}}
    return {}


def on_interrupt(event, directory=STATE):
    path = state_path(event["session_id"], directory)
    if path.exists():
        with locked(path):
            value = read(path)
            if event.get("turn_id") and value.get("executionTurnId") == event["turn_id"]:
                value.update(executionTurnId=None, suspended=True, stoppedTurnId=event["turn_id"],
                             stoppedGeneration=notification_identity(value, "", "complete")["generation"])
                write(path, value)
    return {}


def acknowledge(session, sha, tool_result, directory=STATE, *, event_id=None):
    path = state_path(session, directory)
    current = read(path)
    if event_id is None:
        if not current.get("active") or result_identity(current) != sha.lower():
            raise ValueError("Acknowledgement is not for the current saved result")
        event_path, value = enqueue(session, directory)
    else:
        if len(event_id) != 64 or any(char not in "0123456789abcdef" for char in event_id):
            raise ValueError("Invalid event ID")
        for parent in (directory / "roots").glob("*"):
            reconcile(parent.name, directory)
        indexes = list((directory / "inbox").glob(f"*/{event_id}.json"))
        if len(indexes) != 1:
            raise ValueError("Event ACK needs one indexed event")
        ref = read(indexes[0])
        event_path = Path(ref["path"])
        value = read(event_path)
        if (hashlib.sha256(event_path.read_bytes()).hexdigest() != ref["sha256"]
                or value["eventId"] != event_id or value["assignment"]["sessionId"] != session
                or value["checkpointSha256"] != sha.lower()):
            raise ValueError("Event ACK identity mismatch")
        verify_event(value)
    assignment = value["assignment"]
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
    write(event_path.parent / "transport.json", {"eventId": value["eventId"], "checkpointSha256": sha.lower(), "queueResponse": tool_result})
    with locked(path):
        current = read(path)
        if (value["kind"] == "complete" and notification_identity(current, sha.lower(), "complete")["generation"] == value["generation"]):
            current.update(notifiedSha256=sha.lower(), queueResponse=tool_result)
            write(path, current)


def on_stop(event, directory=STATE):
    if event.get("hook_event_name") != "Stop" or event.get("stop_hook_active"):
        return {}
    path = state_path(event["session_id"], directory)
    if not path.exists():
        return {}
    assignment = read(path)
    if (not assignment.get("active") or assignment.get("suspended") or not event.get("turn_id")
            or assignment.get("executionTurnId") != event["turn_id"]
            or not Path(assignment["artifact"]).is_file()):
        return {}
    sha = result_identity(assignment)
    event_path, _ = enqueue(event["session_id"], directory)
    if assignment.get("notifiedSha256") == sha or (event_path.parent / "consumed.json").exists():
        return {}
    with locked(path):
        current = read(path)
        if (current.get("remindedSha256") == sha or current.get("notifiedSha256") == sha
                or current.get("executionTurnId") != event["turn_id"] or current.get("suspended")):
            return {}
        current["remindedSha256"] = sha
        write(path, current)
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
    execution = commands.add_parser("arm")
    execution.add_argument("--session", required=True)
    execution.add_argument("--resume", action="store_true")
    queue = commands.add_parser("enqueue")
    queue.add_argument("--session", required=True)
    queue.add_argument("--checkpoint", type=Path)
    queue.add_argument("--kind", choices=("complete", "partial-stop", "user-stop"), default="complete")
    drain = commands.add_parser("drain")
    drain.add_argument("--parent", required=True)
    consume_command = commands.add_parser("consume")
    for name in ("parent", "event", "effect"):
        consume_command.add_argument("--" + name, required=True)
    ack = commands.add_parser("ack")
    ack.add_argument("--session", required=True)
    ack.add_argument("--sha", required=True)
    ack.add_argument("--event", help="Acknowledge a saved complete, partial-stop or user-stop event")
    clear = commands.add_parser("clear")
    clear.add_argument("--session", required=True)
    args = parser.parse_args()
    if args.action == "register":
        register(args.session, args.parent, args.work, args.phase, args.artifact, args.run)
    elif args.action == "register-batch":
        register_batch(args.session, args.parent, args.dispatch, args.artifact, args.run)
    elif args.action == "arm":
        arm(args.session, resume=args.resume)
    elif args.action == "enqueue":
        path, value = enqueue(args.session, checkpoint=args.checkpoint, kind=args.kind, phase_boundary=True)
        print(json.dumps({"eventId": value["eventId"], "path": str(path)}, ensure_ascii=False))
    elif args.action == "drain":
        print(json.dumps(pending(args.parent), ensure_ascii=False))
    elif args.action == "consume":
        print(json.dumps(consume(args.parent, args.event, args.effect), ensure_ascii=False))
    elif args.action == "ack":
        acknowledge(args.session, args.sha, json.load(sys.stdin), event_id=args.event)
    elif args.action == "clear":
        clear(args.session)
    else:
        try:
            event = json.load(sys.stdin)
            handler = {"UserPromptSubmit": on_prompt, "Interrupt": on_interrupt}.get(event.get("hook_event_name"), on_stop)
            print(json.dumps(handler(event), ensure_ascii=False))
        except (OSError, ValueError, KeyError, TypeError) as error:
            print(json.dumps({"systemMessage": f"Catalog notification guard skipped: {error}"}))


if __name__ == "__main__":
    main()
