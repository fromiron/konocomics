"""Opt-in Stop reminder for Catalog result delivery and batch interruption reports.

No model, network, catalog mutation, publication or transcript parsing occurs here.
"""
import argparse
import hashlib
import json
import os
import sys
import uuid
from contextlib import contextmanager
from pathlib import Path

from authoring_paths import REPO, ROOT, artifact_path as locate_artifact

STATE = REPO / "data/local/catalog-authoring/notifications"
EVENT = "catalog-notification-v1"
COLLECTION_PHASES = {"collection-only", "collection"}
ADJUDICATION_PHASES = {"adjudication", "adjudication-only", "freeze-adjudicate-check"}
_operation_writes = None


def artifact_path(value):
    """Resolve restored files without rewriting their persisted logical identity."""
    return locate_artifact(value, REPO)


def transition_policy(dispatch):
    policy = dispatch.get("transitionPolicy", "parent")
    if policy not in {"parent", "auto-after-collection"}:
        raise ValueError("Unknown collection transition policy")
    if policy == "auto-after-collection" and dispatch.get("phase") != "collection":
        raise ValueError("Automatic adjudication requires an explicitly authorized collection dispatch")
    return policy


def publication_effect(dispatch):
    automatic = transition_policy(dispatch) == "auto-after-collection"
    effect = dispatch.get("expectedPublicationEffect", "canonical" if automatic else "candidate")
    if effect not in {"candidate", "canonical"} or (automatic and effect != "canonical"):
        raise ValueError("Invalid expected publication effect for dispatch")
    return effect


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def notification_identity(assignment, checkpoint_sha, kind):
    bound = {key: assignment[key] for key in ("sessionId", "parentThreadId", "workId", "phase", "runRoot")}
    bound.update({key: assignment[key] for key in ("dispatchPath", "dispatchSha256", "expectedPublicationEffect") if key in assignment})
    return {"schemaVersion": EVENT, "assignment": bound,
            "generation": assignment.get("generation", digest(bound)),
            "kind": kind, "checkpointSha256": checkpoint_sha}


def locked(path):
    from catalog_authoring_runner import exclusive
    return exclusive(artifact_path(path).with_suffix(".lock"), wait=True)


def read(path):
    return json.loads(artifact_path(path).read_text(encoding="utf-8"))


def write(path, value):
    write_bytes(path, (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))


def write_bytes(path, body):
    path = artifact_path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f".{uuid.uuid4().hex}.tmp")
    try:
        with temporary.open("xb") as stream:
            stream.write(body)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
        if _operation_writes is not None:
            _operation_writes.add(path)
    finally:
        temporary.unlink(missing_ok=True)


def state_path(session, directory=STATE):
    return artifact_path(directory) / (str(uuid.UUID(session)) + ".json")


def remember_assignment(assignment, directory):
    directory = artifact_path(directory)
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
    directory = artifact_path(directory)
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
        root = artifact_path(assignment["runRoot"])
        for path in (root / "notification-events").glob("*/event.json"):
            value = read(path)
            if value.get("assignment") == assignment and value.get("generation") == record["generation"]:
                if value["eventId"] != path.parent.name:
                    raise ValueError("Registered event directory mismatch")
                found[str(path)] = path
    return sorted(found.values(), key=str)


def index_event(path, directory):
    path, directory = artifact_path(path), artifact_path(directory)
    value = read(path)
    parent = value["assignment"]["parentThreadId"]
    index = directory / "inbox" / parent / (value["eventId"] + ".json")
    ref = {"path": str(Path(value["checkpointPath"]).parent / "event.json"), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
    if index.exists():
        existing = read(index)
        if (existing.get("sha256") != ref["sha256"]
                or artifact_path(existing.get("path", "")).resolve() != path.resolve()):
            raise ValueError("Inbox index differs from immutable event")
    else:
        verify_event(value)
        write(index, ref)
    return index


def reconcile(parent, directory=STATE):
    return [index_event(path, directory) for path in registered_events(str(uuid.UUID(parent)), directory)]


def result_identity(assignment):
    path = artifact_path(assignment["artifact"])
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
    dispatch_path = artifact_path(assignment["dispatchPath"])
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
    # sourceSummary is a chain of subsets of earlier adjudication results. A
    # collection summary has different rows even when its Work IDs match.
    source = summary
    visited = {artifact_path(assignment["artifact"]).resolve()} if assignment.get("artifact") else set()
    while "sourceSummary" in source:
        binding = source["sourceSummary"]
        if not isinstance(binding, dict) or not isinstance(binding.get("path"), str) or not isinstance(binding.get("sha256"), str):
            raise ValueError("Invalid adjudication sourceSummary binding")
        previous_path = artifact_path(binding["path"]).resolve()
        if previous_path in visited or not previous_path.is_relative_to(artifact_path(assignment["runRoot"]).resolve()):
            raise ValueError("Adjudication sourceSummary cycle or outside assigned run")
        visited.add(previous_path)
        previous_bytes = previous_path.read_bytes()
        if hashlib.sha256(previous_bytes).hexdigest() != binding["sha256"]:
            raise ValueError("Adjudication sourceSummary SHA mismatch")
        previous = json.loads(previous_bytes)
        if (previous.get("batchId") != dispatch["batchId"]
                or previous.get("ownerThreadId") != assignment["sessionId"]
                or previous.get("parentThreadId") != assignment["parentThreadId"]
                or not isinstance(previous.get("works"), list)
                or any(row not in previous["works"] for row in source["works"])):
            raise ValueError("Adjudication sourceSummary changed result rows")
        source = previous
    from catalog_completed_checks import completed_checks
    summary_sha = hashlib.sha256(artifact_path(assignment["artifact"]).read_bytes()).hexdigest() if assignment.get("artifact") else None
    historical = completed_checks(rows, summary_sha=summary_sha)
    stored_checks = []
    for row in rows:
        path = artifact_path(row["checkedPath"]).resolve()
        if not path.is_relative_to(artifact_path(assignment["runRoot"]).resolve()):
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
        if row["workId"] in historical:
            continue
        storage = read(path.parent / "CHECK-STORAGE.json")
        if storage["checkedSha256"] != row["checkedSha256"]:
            raise ValueError("Batch check backup binding mismatch")
        if storage["storage"]["backup"]["status"] not in {"PERSISTED", "BACKED_UP"}:
            raise ValueError("Batch check backup is incomplete")
        if "snapshot" in storage["storage"]:
            stored_checks.append((path.parent, storage["storage"]["snapshot"]))
        elif storage["storage"]["backup"]["status"] == "PERSISTED":
            raise ValueError("Persisted batch check requires a bound revision receipt")
        config = read(path.parent / "RUN.json")
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
    if stored_checks:
        import catalog_authoring_runner as runner
        from catalog_workspace import Workspace
        checks = []
        for run, receipt in stored_checks:
            config, checked = read(run / "RUN.json"), read(run / "CHECKED.json")
            paths = [run / "CHECKED.json", run / "RUN.json", runner.frozen_path(run, config),
                     artifact_path(config["decisionsPath"])]
            if checked.get("sealedRoot"):
                paths.append(artifact_path(checked["sealedRoot"]))
            checks.append((receipt, paths))
        with Workspace().verification_context([path for _, paths in checks for path in paths], backup=True) as context:
            for receipt, paths in checks:
                context.verify_saved(receipt, paths)


def validate_collection_batch(assignment, summary, *, metrics=None):
    from catalog_workspace import Workspace
    workspace = Workspace()
    revision_store = getattr(workspace, "is_revision_store", False)
    dispatch_path = artifact_path(assignment["dispatchPath"])
    if hashlib.sha256(dispatch_path.read_bytes()).hexdigest() != assignment["dispatchSha256"]:
        raise ValueError("Collection dispatch changed")
    dispatch = read(dispatch_path)
    if dispatch.get("phase") not in COLLECTION_PHASES:
        raise ValueError("Collection assignment phase mismatch")
    transition_policy(dispatch)
    if summary.get("dispatchSha256", assignment["dispatchSha256"]) != assignment["dispatchSha256"]:
        raise ValueError("Collection summary dispatch binding changed")
    if (summary.get("batchId") != dispatch["batchId"] or summary.get("ownerThreadId") != assignment["sessionId"]
            or summary.get("parentThreadId") != assignment["parentThreadId"] or summary.get("phase") != dispatch["phase"]
            or summary.get("status") != "COLLECTION_COMPLETE" or summary.get("adjudicationAllowed") is not False
            or summary.get("publicationAllowed") is not False):
        raise ValueError("Collection batch ownership or phase mismatch")
    rows = summary.get("works")
    expected_rows = {row["workId"]: row for row in dispatch["works"]}
    if not isinstance(rows, list) or len(rows) != len(expected_rows) or {row.get("workId") for row in rows} != set(expected_rows):
        raise ValueError("Collection results missing, duplicated or outside assignment")
    legacy, legacy_paths = collection_checkpoint_bindings(assignment, summary, dispatch)
    for key in ("processedCount", "assignedCount"):
        if type(summary.get(key)) is not int or summary[key] != len(rows):
            raise ValueError(f"Collection {key} differs from bound results")
    counts = summary.get("statusCounts")
    if (not isinstance(counts, dict) or set(counts) - {"EVIDENCE_FOUND", "INSUFFICIENT", "ERROR"}
            or any(type(counts.get(status, 0)) is not int
                   or counts.get(status, 0) != sum(row.get("status") == status for row in rows)
                   for status in ("EVIDENCE_FOUND", "INSUFFICIENT", "ERROR"))):
        raise ValueError("Collection statusCounts differ from bound results")
    validator = summary.get("validator", {})
    if (validator.get("status") != "PASS" or validator.get("perWorkSourceAudit") is not True
            or not (validator.get("allAssignedResearchRowsPresent") is True or validator.get("allAssignedResultsPresent") is True)
            or validator.get("dispatchIdentityAndUserSourceShaVerified") is not True
            or validator.get("rawReceiptBytesAndShaVerified") is not True
            or not (validator.get("workspaceAndAppendOnlyBackupReadbackVerified") is True
                    or (revision_store and validator.get("workspaceAndBackupReadbackVerified") is True))
            or validator.get("backupStatus") != "BACKED_UP"):
        raise ValueError("Collection validation or backup receipt is incomplete")
    retained_paths = list(legacy_paths)
    supplemental = summary.get("supplementalCollections", [])
    if supplemental and legacy is None:
        raise ValueError("Supplemental collections require an immutable historical checkpoint")
    if legacy is not None:
        expected_supplements = {(row["workId"], str(artifact_path(Path(assignment["runRoot"]) / row["researchPath"]).resolve()), row["researchSha256"])
                                for row in legacy.get("registryFollowups", [])}
        actual_supplements = {(row["workId"], str(artifact_path(row["researchPath"]).resolve()), row["researchSha256"]) for row in supplemental}
        if len(actual_supplements) != len(supplemental) or actual_supplements != expected_supplements:
            raise ValueError("Historical additive research was omitted or changed")
    for index, row in enumerate([*rows, *supplemental]):
        work_id = row["workId"]
        assigned = expected_rows[work_id]
        collection = artifact_path(assigned["collectionOutput"]).resolve()
        if legacy is not None:
            candidates = legacy["works"] if index < len(rows) else legacy.get("registryFollowups", [])
            binding = next((item for item in candidates if item["workId"] == work_id
                            and artifact_path(Path(assignment["runRoot"]) / item["researchPath"]).resolve() == artifact_path(row["researchPath"]).resolve()), None)
            if (binding is None or any(row.get(key) != binding.get(key) for key in ("status", "researchSha256", "sourceCount", "remainingGaps"))):
                raise ValueError("Historical collection row differs from its checkpoint")
            collection = artifact_path(row["researchPath"]).resolve().parent
            if not collection.is_relative_to(artifact_path(assigned["collectionOutput"]).resolve().parent):
                raise ValueError("Historical collection revision is outside the assigned Work")
            retained_paths.extend(collection_capture_paths(collection, work_id))
            for relative in binding.get("captureAttemptPaths", []):
                attempted = artifact_path(Path(assignment["runRoot"]) / relative).resolve()
                if not attempted.is_relative_to(artifact_path(assigned["collectionOutput"]).resolve().parent):
                    raise ValueError("Historical capture attempt is outside the assigned Work")
                retained_paths.extend(collection_capture_paths(attempted, work_id))
        elif (collection / "collection-session.json").is_file():
            retained_paths.extend(collection_capture_paths(collection, work_id))
        if row.get("status") not in {"EVIDENCE_FOUND", "INSUFFICIENT", "ERROR"}:
            raise ValueError("Collection result has no terminal state")
        if row.get("userSourcesPath") != assigned["userSourcesPath"] or row.get("userSourcesSha256") != assigned["userSourcesSha256"]:
            raise ValueError("Collection user-source binding changed")
        user_sources = artifact_path(row["userSourcesPath"]).resolve()
        if hashlib.sha256(user_sources.read_bytes()).hexdigest() != row["userSourcesSha256"]:
            raise ValueError("Collection user-source SHA mismatch")
        if artifact_path(row["collectionPath"]).resolve() != collection:
            raise ValueError("Collection output path changed")
        if row["status"] == "ERROR":
            retained_paths.extend(validate_collection_error(row, collection))
            continue
        research = artifact_path(row["researchPath"]).resolve()
        if not research.is_relative_to(collection) or hashlib.sha256(research.read_bytes()).hexdigest() != row["researchSha256"]:
            raise ValueError("Collection research path or SHA mismatch")
        storage = row.get("storage", {})
        if storage.get("researchSha256Matches") is not True:
            raise ValueError("Collection work backup binding mismatch")
        retained_paths.append(research)
        if not revision_store and storage.get("workspaceSnapshotId") != storage.get("backupSnapshotId"):
            raise ValueError("Collection work backup binding mismatch")
        receipts = row.get("sourceReceiptBindings")
        if not isinstance(receipts, list) or type(row.get("sourceCount")) is not int or len(receipts) != row["sourceCount"]:
            raise ValueError("Collection source receipt count mismatch")
        for binding in receipts:
            receipt_path = artifact_path(binding["receiptPath"]).resolve()
            if (not receipt_path.is_relative_to(collection)
                    or hashlib.sha256(receipt_path.read_bytes()).hexdigest() != binding["receiptSha256"]):
                raise ValueError("Collection source receipt SHA mismatch")
            receipt = read(receipt_path)
            raw_path, raw_sha = binding.get("rawPath"), binding.get("rawSha256")
            if raw_path and raw_sha:
                raw = artifact_path(raw_path).resolve()
                if not raw.is_relative_to(collection) or hashlib.sha256(raw.read_bytes()).hexdigest() != raw_sha:
                    raise ValueError("Collection source body SHA mismatch")
                if binding.get("bytes") is not None and raw.stat().st_size != binding["bytes"]:
                    raise ValueError("Collection source body length mismatch")
            elif not receipt.get("error"):
                raise ValueError("Collection source body is missing without an error receipt")
            if receipt.get("kind") == "web-tool-response":
                requested = {item.get("ref_id") for item in receipt.get("request", {}).get("open", [])}
                if (receipt.get("tool") != "web.run" or binding.get("sourceUrl") not in requested
                        or not raw_path or not raw_sha or receipt.get("sha256") != raw_sha
                        or artifact_path(receipt_path.parent / receipt.get("rawPath", "")).resolve() != raw
                        or binding["sourceUrl"] not in raw.read_text(encoding="utf-8")):
                    raise ValueError("Collection web response does not bind the requested source and actual raw bytes")
            elif receipt.get("url") != binding.get("sourceUrl"):
                raise ValueError("Collection source receipt URL mismatch")
            retained_paths.extend([receipt_path] + ([raw] if raw_path and raw_sha else []))
    if revision_store:
        # One inventory and independent source/backup snapshots for the complete
        # handoff. Large retained migration revisions are verified once per store.
        with workspace.verification_context(retained_paths, backup=True, metrics=metrics) as context:
            _, missing = context.saved_files(retained_paths)
            if missing:
                raise ValueError("Collection original bytes are not persisted")


def collection_capture_paths(collection, work_id):
    """Existing capture verifier preserves successful and failed historical attempts."""
    from prepare_factor_batch import capture_files
    session = collection / "collection-session.json"
    if read(session).get("workId") != work_id:
        raise ValueError("Historical collection session belongs to another Work")
    return [session, *(collection / name for name in capture_files(collection))]


def collection_checkpoint_bindings(assignment, summary, dispatch):
    reference = summary.get("sourceCollectionSummary")
    if reference is None:
        return None, []
    run = artifact_path(assignment["runRoot"]).resolve()
    source = artifact_path(reference["path"]).resolve()
    if not source.is_relative_to(run) or hashlib.sha256(source.read_bytes()).hexdigest() != reference.get("sha256"):
        raise ValueError("Historical collection summary path or SHA mismatch")
    original = read(source)
    checkpoint = artifact_path(original["checkpointPath"]).resolve()
    if not checkpoint.is_relative_to(run) or hashlib.sha256(checkpoint.read_bytes()).hexdigest() != original["checkpointSha256"]:
        raise ValueError("Historical collection checkpoint path or SHA mismatch")
    value = read(checkpoint)
    if (any(original.get(key) != dispatch.get(key) for key in ("batchId", "ownerThreadId", "parentThreadId", "phase"))
            or original.get("dispatchSha256") != assignment["dispatchSha256"]
            or value.get("batchId") != dispatch["batchId"] or value.get("dispatchSha256") != assignment["dispatchSha256"]
            or value.get("adjudicationPerformed") is not False or value.get("publicationPerformed") is not False
            or [row.get("workId") for row in value.get("works", [])] != [row["workId"] for row in dispatch["works"]]
            or summary.get("registryFollowups", []) != value.get("registryFollowups", [])
            or summary.get("materialCorrections", []) != original.get("materialCorrections", [])):
        raise ValueError("Historical collection checkpoint identity, followups or corrections changed")
    return value, [source, checkpoint, artifact_path(assignment["dispatchPath"])]


def validate_collection_error(row, collection):
    if (row.get("errorScope") not in {"work", "shared"}
            or not isinstance(row.get("error"), str) or not row["error"].strip()
            or not isinstance(row.get("retryCondition"), str) or not row["retryCondition"].strip()):
        raise ValueError("Collection ERROR requires scope, actual error and retry condition")
    path = artifact_path(row["errorPath"]).resolve()
    if not path.is_relative_to(collection) or hashlib.sha256(path.read_bytes()).hexdigest() != row.get("errorSha256"):
        raise ValueError("Collection error artifact path or SHA mismatch")
    error = read(path)
    if any(error.get(key) != row.get(key) for key in ("workId", "error", "errorScope", "retryCondition")):
        raise ValueError("Collection error artifact differs from summary")
    bindings = error.get("failureEvidence")
    if not isinstance(bindings, list) or not bindings:
        raise ValueError("Collection ERROR requires saved failure evidence")
    paths = [path]
    for binding in bindings:
        evidence = artifact_path(binding["path"]).resolve()
        if not evidence.is_relative_to(collection) or hashlib.sha256(evidence.read_bytes()).hexdigest() != binding.get("sha256"):
            raise ValueError("Collection failure evidence path or SHA mismatch")
        paths.append(evidence)
    return paths


def register_batch(session, parent, dispatch, artifact, run, directory=STATE, artifact_root=ROOT):
    dispatch = artifact_path(dispatch).resolve()
    if not dispatch.is_relative_to(artifact_path(artifact_root).resolve()):
        raise ValueError("Batch dispatch outside authoring artifacts")
    data = read(dispatch)
    if data["ownerThreadId"] != session or data["parentThreadId"] != parent:
        raise ValueError("Batch assignment ownership mismatch")
    effect = publication_effect(data)
    phase = "collection-batch" if data.get("phase") in COLLECTION_PHASES else "batch"
    path = state_path(session, directory)
    binding = {"dispatchPath": str(dispatch), "dispatchSha256": hashlib.sha256(dispatch.read_bytes()).hexdigest()}
    if effect == "canonical" or "expectedPublicationEffect" in data:
        binding["expectedPublicationEffect"] = effect
    with locked(path):
        _register(session, parent, data["batchId"], phase, artifact, run, directory, artifact_root, binding)


def register(session, parent, work, phase, artifact, run, directory=STATE, artifact_root=ROOT):
    with locked(state_path(session, directory)):
        _register(session, parent, work, phase, artifact, run, directory, artifact_root)


def _register(session, parent, work, phase, artifact, run, directory, artifact_root, binding=None):
    """Caller owns the session lock shared with prompt/interrupt/transition."""
    path = state_path(session, directory)
    parent = str(uuid.UUID(parent))
    artifact, run = artifact_path(artifact).resolve(), artifact_path(run).resolve()
    if not artifact.is_relative_to(artifact_path(artifact_root).resolve()) or not run.is_relative_to(artifact_path(artifact_root).resolve()):
        raise ValueError("Notification paths must stay in local authoring artifacts")
    value = {"sessionId": str(uuid.UUID(session)), "parentThreadId": parent, "workId": work,
             "phase": phase, "artifact": str(artifact), "runRoot": str(run), "active": True}
    if binding:
        value.update(binding)
        value["generation"] = digest({key: value[key] for key in
                                      ("sessionId", "parentThreadId", "workId", "phase", "runRoot", "dispatchSha256")})
    if path.exists():
        old = read(path)
        remember_assignment(old, directory)
        reconcile(old["parentThreadId"], directory)
        path_keys = {"artifact", "runRoot", "dispatchPath"}
        if all((old.get(k) is not None and artifact_path(old[k]).resolve() == artifact_path(v).resolve())
               if k in path_keys else old.get(k) == v
               for k, v in value.items() if k not in {"active", "generation"}):
            return  # Preserve successful sends and the one-reminder flag on retry.
        if old.get("suspended") or not old.get("active"):
            if (old.get("stoppedCheckpointSha256")
                    or not (old.get("suspended") and old.get("active") is False)):
                raise ValueError("Previous assignment stopped; explicitly clear it before reassignment")
        elif old.get("active"):
            previous = artifact_path(old["artifact"])
            if not previous.is_file():
                raise ValueError("Previous assignment still active; finish or explicitly clear it")
            identity = notification_identity(old, hashlib.sha256(previous.read_bytes()).hexdigest(), "complete")
            queued = artifact_path(old["runRoot"]) / "notification-events" / digest(identity) / "event.json"
            if not queued.is_file():
                raise ValueError("Previous assignment still active; enqueue completion or explicitly clear it")
            completion = read(queued)
            if completion["eventId"] != digest(identity):
                raise ValueError("Previous completion identity changed")
            verify_event(completion)
            verify_transport(queued, completion)
            index_event(queued, directory)
            if hashlib.sha256(previous.read_bytes()).hexdigest() != identity["checkpointSha256"]:
                raise ValueError("Previous completion changed before reassignment")
    remember_assignment(value, directory)
    write(path, value)


def reconcile_registration(session, expected_sha, summary=None, directory=STATE):
    """Explicit adapter: preserve old bytes, validate supplied real evidence, never resume."""
    directory = artifact_path(directory)
    path = state_path(session, directory)
    original = path.read_bytes()
    if hashlib.sha256(original).hexdigest() != expected_sha:
        # A crash after the registration commit but before the final backup is
        # resumed from its exact immutable replacement, never from status flags.
        current = json.loads(original)
        for prior_path in (directory / "revisions" / session).glob("*.json"):
            prior = read(prior_path)
            if (prior.get("schemaVersion") == "catalog-registration-reconciliation-v1"
                    and prior.get("originalSha256") == expected_sha and prior.get("replacement") == current
                    and (summary is None or artifact_path(summary).resolve() == artifact_path(current["artifact"]).resolve())):
                return finish_registration_reconciliation(path, prior_path, prior)
        raise ValueError("Registration changed before reconciliation")
    old = json.loads(original)
    dispatch = read(artifact_path(old["dispatchPath"]))
    phase = "collection-batch" if dispatch.get("phase") in COLLECTION_PHASES else "batch"
    if dispatch.get("phase") not in COLLECTION_PHASES | ADJUDICATION_PHASES:
        raise ValueError("Unrecognized historical dispatch phase")
    replacement = {**old, "phase": phase, "artifact": str(Path(summary or old["artifact"]).resolve())}
    if not artifact_path(replacement["artifact"]).is_relative_to(artifact_path(old["runRoot"]).resolve()):
        raise ValueError("Reconciled summary must remain in the original run")
    summary_sha = result_identity(replacement)  # Missing old evidence is an explicit repair error.
    replacement["generation"] = digest({key: replacement[key] for key in
                                         ("sessionId", "parentThreadId", "workId", "phase", "runRoot", "dispatchSha256")})
    replacement["executionTurnId"] = None
    if replacement.get("suspended") or not replacement.get("active"):
        replacement["stoppedGeneration"] = replacement["generation"]
    for key in ("notifiedSha256", "remindedSha256", "queueResponse"):
        replacement.pop(key, None)
    revision = {"schemaVersion": "catalog-registration-reconciliation-v1", "originalSha256": expected_sha,
                "original": old, "replacement": replacement,
                "summarySha256": summary_sha}
    receipt = directory / "revisions" / session / (digest(revision) + ".json")
    if receipt.exists() and read(receipt) != revision:
        raise ValueError("Registration reconciliation receipt changed")
    write(receipt, revision)
    from catalog_workspace import Workspace
    Workspace().persist([receipt, artifact_path(replacement["artifact"])], "registration-reconciliation", reuse=True)
    with locked(path):
        if path.read_bytes() != original:
            raise ValueError("Registration changed during reconciliation")
        if hashlib.sha256(artifact_path(replacement["artifact"]).read_bytes()).hexdigest() != summary_sha:
            raise ValueError("Reconciled summary changed before registration")
        remember_assignment(old, directory)
        remember_assignment(replacement, directory)
        write(path, replacement)
    return finish_registration_reconciliation(path, receipt, revision)


def finish_registration_reconciliation(path, receipt, revision):
    from catalog_workspace import Workspace
    replacement = revision["replacement"]
    if (read(path) != replacement or replacement.get("executionTurnId") is not None
            or hashlib.sha256(artifact_path(replacement["artifact"]).read_bytes()).hexdigest() != revision["summarySha256"]):
        raise ValueError("Reconciled registration or summary changed before final backup")
    Workspace().persist([path, receipt, artifact_path(replacement["artifact"])], "registration-reconciliation-completed", phase_boundary=True, reuse=True)
    if read(path) != replacement:
        raise ValueError("Reconciled registration changed during final backup")
    return {"registrationPath": str(path), "revisionPath": str(receipt), "generation": replacement["generation"],
            "executionArmed": False, "backupStatus": "BACKED_UP"}


def transition_collection(session, generation, turn, dispatch, artifact, directory=STATE):
    """Advance one authorized legacy session after durable collection, without a parent round trip."""
    path = state_path(session, directory)
    original = path.read_bytes()
    assignment = json.loads(original)
    next_dispatch, next_artifact = artifact_path(dispatch).resolve(), artifact_path(artifact).resolve()
    if assignment.get("transitionReceipt"):
        reference = assignment["transitionReceipt"]
        prior = artifact_path(reference["path"])
        if hashlib.sha256(prior.read_bytes()).hexdigest() != reference["sha256"]:
            raise ValueError("Collection transition receipt SHA mismatch")
        record = read(prior)
        if (record["sourceGeneration"] != generation or record["executionTurnId"] != turn
                or artifact_path(record["targetDispatch"]["path"]).resolve() != next_dispatch
                or record["registration"] != {key: value for key, value in assignment.items() if key != "transitionReceipt"}
                or artifact_path(assignment["artifact"]).resolve() != next_artifact
                or not assignment.get("active") or assignment.get("suspended")
                or assignment.get("executionTurnId") != turn
                or read(directory / "turns" / path.name).get("turnId") != turn):
            raise ValueError("Collection transition stopped or retry identity changed")
        event_path = artifact_path(record["collectionEventPath"])
        completed_event = read(event_path)
        verify_event(completed_event)
        verify_transport(event_path, completed_event)
        if hashlib.sha256(next_dispatch.read_bytes()).hexdigest() != record["targetDispatch"]["sha256"]:
            raise ValueError("Adjudication dispatch changed after transition")
        return {"status": "ADJUDICATION_READY", "generation": assignment["generation"],
                "transitionPath": str(prior), "eventId": event_path.parent.name, "eventPath": str(event_path),
                "reused": True}
    run = artifact_path(assignment["runRoot"]).resolve()
    if (not next_dispatch.is_relative_to(run) or not next_artifact.is_relative_to(next_dispatch.parent)
            or next_artifact == next_dispatch):
        raise ValueError("Transition paths must stay in the assigned run")
    source_dispatch = read(artifact_path(assignment["dispatchPath"]))
    if transition_policy(source_dispatch) != "auto-after-collection":
        raise ValueError("Collection transition requires the parent's explicit instruction")
    expected_effect = publication_effect(source_dispatch)
    def verify_current(value):
        if (value.get("phase") != "collection-batch" or not value.get("active") or value.get("suspended")
                or value.get("generation") != generation or value.get("executionTurnId") != turn
                or read(directory / "turns" / path.name).get("turnId") != turn):
            raise ValueError("Collection transition stopped or its turn/generation changed")
    with locked(path):
        verify_current(read(path))
    summary_path = artifact_path(assignment["artifact"])
    summary_bytes = summary_path.read_bytes()
    summary, target = json.loads(summary_bytes), read(next_dispatch)
    rows = summary.get("works", [])
    errors = [row for row in rows if row.get("status") == "ERROR"]
    if any(row.get("errorScope") == "shared" for row in errors):
        raise ValueError("Shared collection failure blocks automatic adjudication")
    ready = {row["workId"]: row for row in rows if row.get("status") != "ERROR"}
    if not ready:
        raise ValueError("No collected Works remain for adjudication; report the saved errors")
    source = {"path": str(Path(assignment["artifact"]).resolve()), "sha256": hashlib.sha256(summary_bytes).hexdigest()}
    if (target.get("phase") not in ADJUDICATION_PHASES or target.get("adjudicationAllowed") is not True
            or target.get("publicationAllowed") is not False or target.get("collectionSummary") != source
            or target.get("collectionErrors", []) != errors
            or any(target.get(key) != source_dispatch.get(key) for key in ("batchId", "ownerThreadId", "parentThreadId"))):
        raise ValueError("Adjudication dispatch does not bind the collected batch and errors")
    if target.get("expectedPublicationEffect", expected_effect) != expected_effect:
        raise ValueError("Adjudication dispatch cannot change the required publication effect")
    targets = target.get("works", [])
    if (len(targets) != len(ready) or {row.get("workId") for row in targets} != set(ready)
            or any(any(row.get(key) != ready[row["workId"]].get(key) for key in ("researchPath", "researchSha256")) for row in targets)):
        raise ValueError("Adjudication dispatch must contain exactly the collected Works and research")
    # Enqueue validates the collection and its actual boundary backup. A durable
    # inbox entry alone is not the worker's successful delivery acknowledgement.
    event_path, event = enqueue(session, directory, phase_boundary=True)
    if event["checkpointSha256"] != source["sha256"]:
        raise ValueError("Collection summary changed during transition")
    verify_transport(event_path, event)
    next_sha = hashlib.sha256(next_dispatch.read_bytes()).hexdigest()
    replacement = {"sessionId": assignment["sessionId"], "parentThreadId": assignment["parentThreadId"],
                   "workId": assignment["workId"], "phase": "batch", "artifact": str(next_artifact),
                   "runRoot": str(next_dispatch.parent), "active": True, "suspended": False,
                   "executionTurnId": turn, "dispatchPath": str(next_dispatch), "dispatchSha256": next_sha,
                   "expectedPublicationEffect": expected_effect}
    replacement["generation"] = digest({key: replacement[key] for key in
                                         ("sessionId", "parentThreadId", "workId", "phase", "runRoot", "dispatchSha256")})
    receipt = next_dispatch.parent / "COLLECTION-TRANSITION.json"
    event_id = digest(notification_identity(assignment, source["sha256"], "complete"))
    record = {"schemaVersion": "catalog-collection-transition-v1", "sourceRegistrationSha256": hashlib.sha256(original).hexdigest(),
              "sourceGeneration": generation, "executionTurnId": turn, "collectionSummary": source,
              "targetDispatch": {"path": str(next_dispatch), "sha256": next_sha}, "registration": dict(replacement),
              "collectionEventPath": str(run / "notification-events" / event_id / "event.json")}
    if receipt.exists() and read(receipt) != record:
        raise ValueError("Collection transition receipt changed")
    write(receipt, record)
    replacement["transitionReceipt"] = {"path": str(receipt), "sha256": hashlib.sha256(receipt.read_bytes()).hexdigest()}
    from catalog_workspace import Workspace
    Workspace().persist([next_dispatch, receipt], "collection-transition", reuse=True)
    with locked(path):
        current = read(path)
        verify_current(current)
        if (path.read_bytes() != original or hashlib.sha256(next_dispatch.read_bytes()).hexdigest() != next_sha
                or hashlib.sha256(receipt.read_bytes()).hexdigest() != replacement["transitionReceipt"]["sha256"]
                or summary_path.read_bytes() != summary_bytes):
            raise ValueError("Collection transition inputs changed before commit")
        verify_transport(event_path, event)
        remember_assignment(replacement, directory)
        write(path, replacement)
    return {"status": "ADJUDICATION_READY", "generation": replacement["generation"],
            "transitionPath": str(receipt), "eventId": event["eventId"], "eventPath": str(event_path),
            "workCount": len(targets), "collectionErrorCount": len(errors)}


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
        if "dispatchPath" in value and hashlib.sha256(artifact_path(value["dispatchPath"]).read_bytes()).hexdigest() != value["dispatchSha256"]:
            raise ValueError("Execution assignment changed")
        value["executionTurnId"] = turn["turnId"]
        value["suspended"] = False
        value["active"] = True
        write(path, value)


def validate_partial(assignment, summary):
    dispatch = read(artifact_path(assignment["dispatchPath"]))
    if hashlib.sha256(artifact_path(assignment["dispatchPath"]).read_bytes()).hexdigest() != assignment["dispatchSha256"]:
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
    source = artifact_path(checkpoint or assignment["artifact"]).resolve()
    if not source.is_relative_to(artifact_path(assignment["runRoot"]).resolve()):
        raise ValueError("Checkpoint outside assigned run")
    body = source.read_bytes()
    if phase_boundary:
        # Explicit CLI handoff is a backup boundary. Stop/Interrupt hooks never
        # perform a large backup or turn a PERSISTED receipt into a claimed backup.
        from catalog_workspace import Workspace
        workspace = Workspace()
        if getattr(workspace, "is_revision_store", False):
            roots = [source, artifact_path(assignment["dispatchPath"])] if assignment.get("dispatchPath") else [source]
            summary = json.loads(body)
            for row in summary.get("works", []):
                for key in ("checkedPath", "researchPath"):
                    if row.get(key):
                        roots.append(artifact_path(row[key]).parent)
                if row.get("errorPath"):
                    roots.append(artifact_path(row["errorPath"]).parent)
            workspace.persist(roots, "phase:" + assignment["phase"], phase_boundary=True, reuse=True)
    identity = notification_identity(assignment, hashlib.sha256(body).hexdigest(), kind)
    remember_assignment(assignment, directory)
    event_id = digest(identity)
    logical_folder = Path(assignment["runRoot"]) / "notification-events" / event_id
    folder = artifact_path(logical_folder)
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
        value = {**identity, "eventId": event_id, "checkpointPath": str(logical_folder / "checkpoint.json")}
        verify_event(value, full=True)
        validation = {"schemaVersion": "catalog-notification-validation-v1", "eventId": event_id,
                      "checkpointSha256": identity["checkpointSha256"],
                      "dispatchSha256": assignment.get("dispatchSha256"),
                      "validatorSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
        validation_path = folder / "validation.json"
        if path.exists() and "validationSha256" not in read(path):
            # Old immutable events retain their identity and deep verification.
            validation_path = None
        elif validation_path.exists():
            prior_validation = read(validation_path)
            if any(prior_validation.get(key) != validation[key] for key in
                   ("schemaVersion", "eventId", "checkpointSha256", "dispatchSha256")):
                raise ValueError("Notification validation receipt changed")
        else:
            write(validation_path, validation)
        if validation_path is not None:
            value["validationSha256"] = hashlib.sha256(validation_path.read_bytes()).hexdigest()
        if path.exists() and read(path) != value:
            raise ValueError("Immutable notification event changed")
        write(path, value)
    index_event(path, directory)
    return path, value


def verify_event(value, *, full=False):
    identity = {key: value[key] for key in ("schemaVersion", "assignment", "generation", "kind", "checkpointSha256")}
    if value["schemaVersion"] != EVENT or digest(identity) != value["eventId"]:
        raise ValueError("Notification identity changed")
    assignment = {**value["assignment"], "artifact": value["checkpointPath"]}
    path = artifact_path(value["checkpointPath"]).resolve()
    if not path.is_relative_to(artifact_path(assignment["runRoot"]).resolve()):
        raise ValueError("Notification checkpoint outside run")
    if hashlib.sha256(path.read_bytes()).hexdigest() != value["checkpointSha256"]:
        raise ValueError("Notification checkpoint SHA mismatch")
    if not full and value.get("validationSha256"):
        receipt = path.parent / "validation.json"
        if hashlib.sha256(receipt.read_bytes()).hexdigest() != value["validationSha256"]:
            raise ValueError("Notification validation receipt SHA mismatch")
        validation = read(receipt)
        if (validation.get("schemaVersion") != "catalog-notification-validation-v1"
                or validation.get("eventId") != value["eventId"]
                or validation.get("checkpointSha256") != value["checkpointSha256"]
                or validation.get("dispatchSha256") != assignment.get("dispatchSha256")):
            raise ValueError("Notification validation receipt identity mismatch")
        if "dispatchPath" in assignment and hashlib.sha256(artifact_path(assignment["dispatchPath"]).read_bytes()).hexdigest() != assignment["dispatchSha256"]:
            raise ValueError("Notification dispatch changed")
        return
    if value["kind"] == "complete":
        result_identity(assignment)
    elif value["kind"] in {"partial-stop", "user-stop"}:
        validate_partial(assignment, read(path))
        if value["kind"] == "user-stop" and read(path)["needsResume"]:
            raise ValueError("User stop cannot request automatic resume")
    else:
        raise ValueError("Unknown notification kind")


def pending(parent, directory=STATE):
    directory = artifact_path(directory)
    reconcile(parent, directory)
    rows = []
    for index in sorted((directory / "inbox" / str(uuid.UUID(parent))).glob("*.json")):
        ref = read(index)
        path = artifact_path(ref["path"])
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
    import catalog_authoring_batch_publish as batch
    if value["kind"] != "complete" or value["assignment"]["phase"] != "batch":
        raise ValueError("Only completed adjudication batches can acknowledge publication")
    expected_effect = value["assignment"].get("expectedPublicationEffect", "candidate")
    if expected_effect not in {"candidate", "canonical"}:
        raise ValueError("Unknown required publication effect")
    original = read(artifact_path(value["checkpointPath"]))
    ready = {row["workId"] for row in original["works"] if row["status"] == "READY_FOR_PUBLICATION"}
    from catalog_completed_checks import completed_checks
    historical = completed_checks(original["works"], required_effect=expected_effect, summary_sha=value["checkpointSha256"])
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
        allowed = {row["workId"] for row in summary["works"] if row["status"] == "READY_FOR_PUBLICATION"}
        if not allowed <= ready:
            raise ValueError("Publication summary Work set is outside checkpoint")
        applied = ledger.get(sha)
        if not applied:
            if allowed and allowed <= set(historical):
                continue
            raise ValueError("No authoritative publication for this summary")
        batch.verify_completed(artifact_path(applied["batchRoot"]), applied)
        if expected_effect == "canonical":
            workspace = batch.runner.Workspace(batch.runner.REPO)
            canonical = batch.verified_canonical_completion(workspace, sha, applied["receiptSha256"])
            if canonical is None and not allowed <= set(historical):
                raise ValueError("Candidate complete; canonical publication and backup remain incomplete")
        receipt = read(artifact_path(applied["batchRoot"]) / "BATCH-FINISHED.json")
        rows = receipt["works"]
        ids = {row["workId"] for row in rows}
        allowed = {row["workId"] for row in summary["works"] if row["status"] == "READY_FOR_PUBLICATION"}
        if (receipt["summarySha256"] != sha or not ids or len(ids) != len(rows)
                or not ids <= allowed <= ready or ids & published):
            raise ValueError("Publication applied Work set differs or overlaps")
        published.update(ids)
    published.update(historical)
    remaining = ready - published
    if ((handling["decision"] == "published" and remaining)
            or (handling["decision"] == "partially-published" and not remaining)):
        raise ValueError("Publication decision does not match remaining READY Works")
    coverage = {"publishedWorkIds": sorted(published), "remainingReadyWorkIds": sorted(remaining)}
    if historical:
        coverage["historicalCompletedChecks"] = historical
    if "expectedPublicationEffect" in value["assignment"]:
        coverage.update(expectedPublicationEffect=expected_effect,
                        publicationEffects={"candidate": "VERIFIED", "canonical": "APPLIED" if expected_effect == "canonical" else "NOT_REQUIRED"})
    return coverage


def consume(parent, event_id, effect, directory=STATE):
    directory = artifact_path(directory)
    if len(event_id) != 64 or any(char not in "0123456789abcdef" for char in event_id):
        raise ValueError("Invalid event ID")
    reconcile(parent, directory)
    index = directory / "inbox" / str(uuid.UUID(parent)) / (event_id + ".json")
    ref = read(index)
    path = artifact_path(ref["path"])
    with locked(path):
        if hashlib.sha256(path.read_bytes()).hexdigest() != ref["sha256"]:
            raise ValueError("Inbox event SHA mismatch")
        value = read(path)
        if value["eventId"] != event_id:
            raise ValueError("Inbox event ID mismatch")
        verify_event(value)
        handling = read(artifact_path(effect))
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
    directory = artifact_path(directory)
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
    directory = artifact_path(directory)
    session = str(uuid.UUID(event["session_id"]))
    if not event.get("turn_id"):
        return {}
    path = state_path(session, directory)
    with locked(path):
        write(directory / "turns" / (session + ".json"), {"turnId": event["turn_id"]})
        if path.exists():
            value = read(path)
            value["executionTurnId"] = None
            write(path, value)
    events = registered_events(session, directory)
    if (any(not (path.parent / "consumed.json").exists() for path in events)
            or any(not (artifact_path(read(index)["path"]).parent / "consumed.json").exists()
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


def validate_queue_response(tool_result, parent):
    """Validate the successful tool envelope retained by ACK, not a status flag."""
    if not isinstance(tool_result, dict) or tool_result.get("isError"):
        raise ValueError("Queue send failed")
    payload = tool_result
    if "content" in payload:
        texts = [item["text"] for item in payload["content"] if item.get("type") == "text"]
        if len(texts) != 1:
            raise ValueError("Unexpected queue response")
        payload = json.loads(texts[0])
    if not isinstance(payload, dict) or payload.get("threadId") != parent:
        raise ValueError("Queue response does not confirm the assigned parent")


def verify_transport(event_path, value):
    event_path = artifact_path(event_path)
    transport_path = event_path.parent / "transport.json"
    if not transport_path.is_file():
        raise ValueError("Completion has no successful transport acknowledgement")
    transport = read(transport_path)
    if (transport.get("eventId") != value["eventId"]
            or transport.get("checkpointSha256") != value["checkpointSha256"]):
        raise ValueError("Completion transport identity changed")
    validate_queue_response(transport.get("queueResponse"), value["assignment"]["parentThreadId"])


def acknowledge(session, sha, tool_result, directory=STATE, *, event_id=None):
    directory = artifact_path(directory)
    path = state_path(session, directory)
    current = read(path)
    if event_id is None:
        if not current.get("active") or hashlib.sha256(artifact_path(current["artifact"]).read_bytes()).hexdigest() != sha.lower():
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
        event_path = artifact_path(ref["path"])
        value = read(event_path)
        if (hashlib.sha256(event_path.read_bytes()).hexdigest() != ref["sha256"]
                or value["eventId"] != event_id or value["assignment"]["sessionId"] != session
                or value["checkpointSha256"] != sha.lower()):
            raise ValueError("Event ACK identity mismatch")
        verify_event(value)
    assignment = value["assignment"]
    validate_queue_response(tool_result, assignment["parentThreadId"])
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
            or not artifact_path(assignment["artifact"]).is_file()):
        return {}
    sha = hashlib.sha256(artifact_path(assignment["artifact"]).read_bytes()).hexdigest()
    event_path = artifact_path(assignment["runRoot"]) / "notification-events" / digest(notification_identity(assignment, sha, "complete")) / "event.json"
    if (assignment.get("remindedSha256") == sha
            or (event_path.parent / "consumed.json").exists()):
        return {}
    if event_path.is_file():
        saved_event = read(event_path)
        if saved_event.get("validationSha256"):
            verify_event(saved_event)
        if (event_path.parent / "transport.json").is_file():
            verify_transport(event_path, saved_event)
            return {}
    elif assignment["phase"] not in {"batch", "collection-batch"}:
        result_identity(assignment)  # Single-Work identity only; no storage scans.
    with locked(path):
        current = read(path)
        if (current.get("remindedSha256") == sha or not current.get("active")
                or current.get("executionTurnId") != event["turn_id"] or current.get("suspended")
                or notification_identity(current, sha, "complete") != notification_identity(assignment, sha, "complete")):
            return {}
        if event_path.is_file() and (event_path.parent / "transport.json").is_file():
            saved_event = read(event_path)
            identity = notification_identity(current, sha, "complete")
            if (saved_event.get("eventId") != digest(identity)
                    or any(saved_event.get(key) != value for key, value in identity.items())):
                raise ValueError("Completion transport event identity changed")
            verify_transport(event_path, saved_event)
            return {}
        current["remindedSha256"] = sha
        write(path, current)
    kind = ("CATALOG_BATCH_COMPLETE" if assignment["phase"] == "batch" else
            "COLLECTION_STAGE_COMPLETE" if assignment["phase"] == "collection-batch" else
            "COLLECTION_READY" if assignment["phase"] == "collection" else "SOL_COMPLETE")
    return {"decision": "block", "reason": (
        f"Catalog notification only: saved {assignment['workId']} checkpoint {assignment['artifact']} "
        f"SHA256={sha} has no confirmed queue-send receipt. First run notification_guard.py enqueue "
        f"--session {event['session_id']} for full validation and boundary backup outside this hook. "
        f"Only after success, send {kind} with the assigned paths "
        f"(runRoot={assignment['runRoot']}) to parent {assignment['parentThreadId']} using "
        "send_message_to_thread without overriding destination model or thinking, "
        "then acknowledge the actual successful tool result with "
        "scripts/catalog_authoring/notification_guard.py ack. If already sent, record its existing "
        "successful response instead. Do not recollect, readjudicate, publish or assign another Work. "
        "On send failure, preserve the error and stop; this hook will not retry again."
    )}


@contextmanager
def restored_invocation(args, event=None):
    """Prepare only this explicit command and record its actual control writes."""
    if not (REPO / ".catalog-restore.json").is_file():
        yield
        return
    from catalog_retention import prepare_restored_operation, record_restored_operation
    request = {"operation": "notification", "command": args.action or "hook"}
    fields = {"session": "sessionId", "parent": "parentThreadId", "event": "eventId",
              "checkpoint": "checkpointPath", "dispatch": "dispatchPath", "artifact": "artifactPath",
              "run": "runRoot", "effect": "effectPath", "summary": "summaryPath",
              "kind": "eventKind", "sha": "checkpointSha256", "expected_sha": "registrationSha256",
              "work": "workId", "phase": "phase"}
    for argument, field in fields.items():
        value = getattr(args, argument, None)
        if value is not None:
            request[field] = str(value)
    if event is not None:
        request.update(sessionId=event["session_id"], hookEventName=event.get("hook_event_name"), turnId=event.get("turn_id"))
    preparation = prepare_restored_operation(REPO, request)
    if preparation.get("needsBackup") and not (REPO / "data/local/catalog-authoring/backups/latest.sqlite").is_file():
        from catalog_workspace import Workspace
        Workspace(REPO).backup()
    global _operation_writes
    previous, _operation_writes = _operation_writes, set()
    try:
        yield
    finally:
        written, _operation_writes = _operation_writes, previous
        record_restored_operation(REPO, preparation, written)


def select_recovery_files(files, request, control):
    """Select this invocation's retained inputs without creating files or effects."""
    base = "data/local/catalog-authoring/notifications"
    members = control["members"]
    command = request["command"]
    followups, selected_events = [], set()
    needs_backup = False

    def saved(path, expected=None):
        name = files.key(path)
        return files.json(name, expected or members.get(name))

    def exists(path):
        name = files.key(path)
        if name in control.get("payload", {}).get("deletedPaths", []):
            return False
        return name in members or name in files.latest

    def optional(path):
        if exists(path):
            return saved(path)
        return None

    def completed_inputs(rows):
        if files.db.execute("SELECT 1 FROM head WHERE kind='completion' LIMIT 1").fetchone() is None:
            return
        selected = []
        for row in rows:
            if row.get("status") != "READY_FOR_PUBLICATION":
                continue
            receipt = files.current("curation", row["workId"])
            if receipt is None:
                continue
            payload = files.revision(receipt)["payload"]
            works = payload.get("tables", {}).get("source_works", [])
            if (payload.get("schemaVersion") != "curation-baseline-v1" or payload.get("legacyAuthorityRequired")
                    or len(works) != 1 or works[0].get("recommendationEligible") != "true"
                    or works[0].get("annotationReviewMethod") != "authorizedEvidencePanel"):
                continue
            files.checked(row)
            selected.append(row["workId"])
        if selected:
            files.basis(selected)

    def summary_inputs(value, assignment, path):
        nonlocal needs_backup
        needs_backup = True
        if assignment.get("phase") == "batch":
            ready = []
            for row in value.get("works", []):
                checked = files.json(row["checkedPath"], row["checkedSha256"])
                if row.get("status") == "READY_FOR_PUBLICATION":
                    # Exact completion identities avoid expanding old successful runs.
                    files.checked(row)
                    ready.append(row["workId"])
                elif row.get("status") == "HOLD":
                    files.root(Path(files.key(row["checkedPath"])).parent)
                    if checked.get("sealedRoot"):
                        files.root(checked["sealedRoot"], checked.get("resultManifestSha256"), follow=False)
            if (ready and files.db.execute("SELECT 1 FROM head WHERE kind='completion' LIMIT 1").fetchone()
                    and any(files.current("curation", wid) is not None for wid in ready)):
                files.basis(ready)
        elif assignment.get("phase") == "collection-batch":
            files.progress(value, assignment["runRoot"], set())
            legacy = value.get("sourceCollectionSummary")
            if legacy is not None:
                original = saved(legacy["path"], legacy["sha256"])
                checkpoint = saved(original["checkpointPath"], original["checkpointSha256"])
                files.progress(checkpoint, assignment["runRoot"], set())
            pending = [value]
            while pending:
                item = pending.pop()
                if isinstance(item, dict):
                    for field in ("userSourcesPath", "errorPath", "receiptPath", "rawPath"):
                        expected = item.get(field.removesuffix("Path") + "Sha256")
                        if item.get(field) and expected:
                            files.file(files.assignment_path(item[field], assignment["runRoot"]), expected)
                    pending.extend(child for child in item.values() if isinstance(child, (list, dict)))
                elif isinstance(item, list):
                    pending.extend(item)
        # Legacy single-Work results only validate their own saved identity.

    def select_event(path, *, require_session=None, require_parent=None, deep=False, validate_legacy=True):
        name = files.key(path)
        if name in selected_events:
            return saved(name)
        value = saved(name)
        identity = {key: value[key] for key in ("schemaVersion", "assignment", "generation", "kind", "checkpointSha256")}
        assignment = value["assignment"]
        if (value["schemaVersion"] != EVENT or value["eventId"] != digest(identity)
                or Path(name).parent.name != value["eventId"]
                or (require_session is not None and assignment["sessionId"] != require_session)
                or (require_parent is not None and assignment["parentThreadId"] != require_parent)):
            raise ValueError("Requested recovery event identity changed")
        selected_events.add(name)
        checkpoint = saved(value["checkpointPath"], value["checkpointSha256"])
        root = Path(name).parent
        if value.get("validationSha256"):
            saved(root / "validation.json", value["validationSha256"])
        elif validate_legacy and value["kind"] == "complete":
            deep = True
        if assignment.get("dispatchPath"):
            saved(assignment["dispatchPath"], assignment["dispatchSha256"])
        for filename in ("transport.json", "handling.json", "consumed.json"):
            optional(root / filename)
        record = {"assignment": assignment, "generation": value["generation"]}
        optional(f"{base}/roots/{assignment['parentThreadId']}/{digest(record)}.json")
        optional(f"{base}/inbox/{assignment['parentThreadId']}/{value['eventId']}.json")
        if deep and value["kind"] == "complete":
            summary_inputs(checkpoint, assignment, value["checkpointPath"])
        return value

    session = str(uuid.UUID(request["sessionId"])) if request.get("sessionId") else None
    parent = str(uuid.UUID(request["parentThreadId"])) if request.get("parentThreadId") else None
    assignment = None
    if session is not None:
        registration = f"{base}/{session}.json"
        if registration in members:
            assignment = saved(registration)
            if assignment.get("sessionId") != session:
                raise ValueError("Requested recovery registration identity changed")
            optional(f"{base}/turns/{session}.json")
            identity = notification_identity(assignment, "", "complete")
            root_record = {"assignment": identity["assignment"], "generation": identity["generation"]}
            optional(f"{base}/roots/{assignment['parentThreadId']}/{digest(root_record)}.json")
            if assignment.get("dispatchPath") and command in {"arm", "enqueue", "transition-collection", "reconcile-registration", "register-batch"}:
                saved(assignment["dispatchPath"], assignment["dispatchSha256"])

    explicit_event = request.get("eventId")
    event = None
    if explicit_event is not None:
        if len(explicit_event) != 64 or any(char not in "0123456789abcdef" for char in explicit_event):
            raise ValueError("Invalid requested recovery event ID")
        suffix = f"/notification-events/{explicit_event}/event.json"
        candidates = {name for name in members if name.endswith(suffix)}
        if not candidates:
            candidates = {name for name, in files.db.execute("SELECT DISTINCT path FROM revision_blob WHERE path LIKE ?", ("%" + suffix,))}
        if len(candidates) != 1:
            raise ValueError("Requested recovery event is missing or ambiguous")
        event = select_event(candidates.pop(), require_session=session, require_parent=parent)

    if assignment is not None:
        deep = command in {"enqueue", "transition-collection", "reconcile-registration"} or (command == "ack" and explicit_event is None)
        armed_stop = (command == "hook" and request.get("hookEventName") == "Stop"
                      and assignment.get("active") and not assignment.get("suspended")
                      and request.get("turnId") and assignment.get("executionTurnId") == request["turnId"])
        need_result = deep or command in {"register", "register-batch"} or armed_stop
        result_path = request.get("checkpointPath") or assignment.get("artifact")
        if need_result and result_path:
            resolved = files.store.repo / files.key(result_path)
            if resolved.is_file() or exists(result_path):
                body = files.request(result_path)  # A newly written mutable result is a new revision.
                value = json.loads(body)
                sha = hashlib.sha256(body).hexdigest()
                event_identity = notification_identity(assignment, sha, request.get("eventKind", "complete"))
                path = Path(assignment["runRoot"]) / "notification-events" / digest(event_identity) / "event.json"
                if exists(path):
                    select_event(path, require_session=session, validate_legacy=not armed_stop)
                if deep:
                    if request.get("eventKind", "complete") == "complete":
                        summary_inputs(value, assignment, result_path)
                    else:
                        needs_backup = True  # Partial/stop reports bind only their own checkpoint and dispatch.
        if command == "transition-collection" and assignment.get("transitionReceipt"):
            reference = assignment["transitionReceipt"]
            transition = saved(reference["path"], reference["sha256"])
            select_event(transition["collectionEventPath"], require_session=session)

    if command == "drain" or (command == "hook" and request.get("hookEventName") == "UserPromptSubmit"):
        target_parent = parent if command == "drain" else session
        prefix = f"{base}/inbox/{target_parent}/"
        for name in sorted(name for name in members if name.startswith(prefix)):
            reference = saved(name)
            source = files.key(reference["path"])
            if str(Path(source).parent / "consumed.json").replace("\\", "/") in members:
                # The logical current control already records this event as consumed.
                files.members.pop(name, None)
                continue
            if command == "drain":
                select_event(source, require_parent=target_parent)
        if command == "drain":
            # A saved root also recovers a pending event whose inbox write failed.
            prefix = f"{base}/roots/{target_parent}/"
            for name in sorted(name for name in members if name.startswith(prefix)):
                record = json.loads(files.store.read_blob(files.db, members[name]))
                root = files.key(record["assignment"]["runRoot"]) + "/notification-events/"
                for candidate in members:
                    if (candidate.startswith(root) and candidate.endswith("/event.json")
                            and str(Path(candidate).parent / "consumed.json").replace("\\", "/") not in members):
                        select_event(candidate, require_parent=target_parent)

    if command == "consume" and event is not None:
        handling = json.loads(files.request(request["effectPath"]))
        if handling.get("decision") in {"published", "partially-published"}:
            needs_backup = True
            original = saved(event["checkpointPath"], event["checkpointSha256"])
            completed_inputs(original.get("works", []))
            references = handling.get("publications", [{"summaryPath": event["checkpointPath"], "summarySha256": event["checkpointSha256"]}])
            for reference in references:
                summary = json.loads(files.request(reference["summaryPath"], reference["summarySha256"]))
                chain, visited = summary, set()
                while chain.get("sourceSummary") is not None:
                    source = chain["sourceSummary"]
                    if source["sha256"] in visited:
                        raise ValueError("Requested recovery summary ancestry contains a cycle")
                    visited.add(source["sha256"])
                    chain = json.loads(files.request(source["path"], source["sha256"]))
                    if source["sha256"] == event["checkpointSha256"]:
                        break
                followups.append({"operation": "batch", "summaryPath": reference["summaryPath"],
                                  "purpose": "notification",
                                  "applyCanonical": event["assignment"].get("expectedPublicationEffect") == "canonical"})

    for field in ("dispatchPath", "artifactPath", "summaryPath"):
        value = request.get(field)
        if value and exists(value) and not (files.store.repo / files.key(value)).is_file():
            saved(value)
    return {"needsBackup": needs_backup, "requests": followups}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="action")
    registration = commands.add_parser("register")
    for name in ("session", "parent", "work", "artifact", "run"):
        registration.add_argument("--" + name, required=True)
    registration.add_argument("--phase", choices=("collection", "adjudication"), required=True)
    batch = commands.add_parser("register-batch")
    for name in ("session", "parent", "dispatch", "artifact", "run"):
        batch.add_argument("--" + name, required=True)
    reconcile_command = commands.add_parser("reconcile-registration")
    reconcile_command.add_argument("--session", required=True)
    reconcile_command.add_argument("--expected-sha", required=True)
    reconcile_command.add_argument("--summary", type=Path)
    transition = commands.add_parser("transition-collection")
    for name in ("session", "generation", "turn", "dispatch", "artifact"):
        transition.add_argument("--" + name, required=True)
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
    clear_command = commands.add_parser("clear")
    clear_command.add_argument("--session", required=True)
    args = parser.parse_args()
    if args.action is None:
        # Project hooks are retired. Cached app registrations must also be inert.
        print("{}")
        return
    result = None
    with restored_invocation(args):
        if args.action == "register":
            register(args.session, args.parent, args.work, args.phase, args.artifact, args.run)
        elif args.action == "register-batch":
            register_batch(args.session, args.parent, args.dispatch, args.artifact, args.run)
        elif args.action == "reconcile-registration":
            result = reconcile_registration(args.session, args.expected_sha, args.summary)
        elif args.action == "transition-collection":
            result = transition_collection(args.session, args.generation, args.turn, args.dispatch, args.artifact)
        elif args.action == "arm":
            arm(args.session, resume=args.resume)
        elif args.action == "enqueue":
            path, value = enqueue(args.session, checkpoint=args.checkpoint, kind=args.kind, phase_boundary=True)
            result = {"eventId": value["eventId"], "path": str(path)}
        elif args.action == "drain":
            result = pending(args.parent)
        elif args.action == "consume":
            result = consume(args.parent, args.event, args.effect)
        elif args.action == "ack":
            acknowledge(args.session, args.sha, json.load(sys.stdin), event_id=args.event)
        elif args.action == "clear":
            clear(args.session)
    if result is not None:
        print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
