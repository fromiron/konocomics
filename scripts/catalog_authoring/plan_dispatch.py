#!/usr/bin/env python3
"""Read-only, pre-assignment route plan against the current Catalog candidate."""
from __future__ import annotations

import argparse
import json
import os
import re
import uuid
from pathlib import Path

from authoring_paths import REPO, ROOT

import catalog_authoring_runner as runner
import notification_guard as notifications
import prepare_factor_batch as prepare
import factor_single_pass as single


def route_for(work: dict, work_id: str, gold: set[str]) -> list[str]:
    protected = work_id in gold or work["annotationReviewMethod"] in {"human", "authorizedModelPanel"}
    if work["recommendationEligible"] == "true":
        return ["eligible"] + (["protected"] if protected else [])
    if protected:
        return ["protected"]
    return ["prior-recovery" if work["annotationReviewMethod"] == "authorizedEvidencePanel" else "fresh"]


def require(ok: bool, message: str) -> None:
    if not ok:
        raise ValueError(message)


def plan(dispatch_path: Path, summary_path: Path | None = None) -> dict:
    dispatch_path = dispatch_path.resolve()
    require(dispatch_path.is_file() and dispatch_path.is_relative_to(ROOT), "dispatch must be an authoring artifact")
    dispatch_sha = prepare.panel.sha256(dispatch_path)
    dispatch = notifications.read(dispatch_path)
    phase = dispatch.get("phase")
    require(phase in {"collection-only", "adjudication-only", "freeze-adjudicate-check"}, "unsupported dispatch phase")
    adjudication = phase != "collection-only"
    for key in ("ownerThreadId", "parentThreadId"):
        require(str(uuid.UUID(dispatch[key])) == dispatch[key], f"invalid {key}")
    rows = dispatch.get("works")
    require(isinstance(rows, list) and rows and len(rows) == dispatch.get("workCount", dispatch.get("assignedCount")), "invalid dispatch count")
    ids = [row.get("workId") for row in rows if isinstance(row, dict)]
    require(len(ids) == len(rows) and all(isinstance(wid, str) and re.fullmatch(r"work-[0-9a-f]{20}", wid) for wid in ids) and len(set(ids)) == len(ids), "invalid dispatch works")
    require(dispatch.get("adjudicationAllowed", adjudication) is adjudication and dispatch.get("publicationAllowed") is False, "dispatch authority mismatch")
    summary_sha, summary_rows = None, {}
    assignment_binding = None
    if summary_path is not None:
        summary_path = summary_path.resolve()
        require(summary_path.is_file() and summary_path.is_relative_to(ROOT), "summary must be an authoring artifact")
        summary_sha = prepare.panel.sha256(summary_path)
        summary = notifications.read(summary_path)
        if adjudication:
            assignment = {"dispatchPath": str(dispatch_path), "dispatchSha256": dispatch_sha,
                          "sessionId": dispatch["ownerThreadId"], "parentThreadId": dispatch["parentThreadId"],
                          "runRoot": str(dispatch_path.parent)}
            registered_path = notifications.state_path(dispatch["ownerThreadId"])
            if registered_path.is_file():
                registered_sha = prepare.panel.sha256(registered_path)
                registered = notifications.read(registered_path)
                if registered.get("dispatchSha256") == dispatch_sha and Path(registered.get("dispatchPath", "")).resolve() == dispatch_path:
                    require(registered.get("sessionId") == assignment["sessionId"] and registered.get("parentThreadId") == assignment["parentThreadId"], "registered assignment ownership mismatch")
                    require(Path(registered["runRoot"]).resolve().is_relative_to(ROOT), "registered assignment root outside artifacts")
                    assignment = registered
                    assignment_binding = {"path": str(registered_path), "sha256": registered_sha}
            notifications.validate_batch(assignment, summary)
            summary_rows = {row["workId"]: row for row in summary["works"]}
        else:
            require(summary.get("batchId") == dispatch["batchId"] and summary.get("dispatchSha256") == dispatch_sha
                    and summary.get("ownerThreadId") == dispatch["ownerThreadId"] and summary.get("parentThreadId") == dispatch["parentThreadId"]
                    and summary.get("processedCount") == len(ids) and summary.get("validation", {}).get("status") == "PASS"
                    and [row.get("workId") for row in summary.get("works", [])] == ids,
                    "collection summary binding mismatch")

    state_path = ROOT / "STATE.json"
    state_sha = prepare.panel.sha256(state_path)
    state, baseline = runner.current()
    candidate = state["latestCandidate"]
    catalog_path = baseline / "catalog-expanded.candidate.sqlite"
    registry_path = baseline / "catalog-source-registry.candidate.sqlite"
    backend = prepare.publisher._backend_module()
    prepare.publisher._verify_result_manifest(baseline)
    facts = backend._baseline_facts(catalog_path)
    registry = backend.ensure_registry(registry_path, set(), candidate["catalogSha256"])
    registry["frozenRowsByWork"] = registry["rowsByWork"]
    contract_paths = {key: REPO / path for key, (path, _) in prepare.CONTRACTS.items()}
    gold_path = REPO / "data/staging/catalog-expansion/gold-set-manifest.json"
    bindings = {"dispatchSha256": dispatch_sha, "stateSha256": state_sha,
                "catalogSha256": prepare.panel.sha256(catalog_path),
                "registrySha256": prepare.panel.sha256(registry_path),
                "goldManifestSha256": prepare.panel.sha256(gold_path),
                "summarySha256": summary_sha,
                "registeredAssignment": assignment_binding,
                "contractsSha256": {key: prepare.panel.sha256(path) for key, path in contract_paths.items()}}
    gold = set(prepare.panel.read_json(gold_path)["workIds"])
    results = []
    for row in rows:
        wid = row["workId"]
        work = facts["works"].get(wid)
        requirements, issues = [], []
        if work is None:
            issues.append("work absent from current candidate")
        else:
            requirements.extend(route_for(work, wid, gold))
            edition = row.get("representativeEdition", {})
            if work["title"] != row.get("title"):
                issues.append("dispatch title differs from current candidate")
            volumes = [v for v in facts["volumeRows"].get(wid, []) if v["isRepresentative"] == "true"]
            # Earlier dispatches bind Work/research only. Check the current
            # representative from the SHA-bound baseline, without inventing a
            # historical edition binding that the dispatch did not contain.
            if "representativeEdition" not in row and len(volumes) == 1:
                edition = {"workId": wid, **{key: volumes[0][key] for key in ("isbn", "volumeNumber", "editionKind")}}
            if len(volumes) != 1 or not isinstance(edition, dict) or edition.get("workId") != wid:
                issues.append("representative volume missing or ambiguous")
            elif any(str(edition.get(key, "")) != str(volumes[0][db_key]) for key, db_key in
                     (("volumeNumber", "volumeNumber"), ("editionKind", "editionKind"))) or backend._normalise_isbn(edition.get("isbn", "")) != backend._normalise_isbn(volumes[0]["isbn"]):
                issues.append("dispatch representative edition differs from current candidate")
            owned = registry["rowsByWork"].get(wid, [])
            if not owned:
                requirements.append("registry-repair")
                issues.append("registry mapping absent")
            elif volumes:
                bibliography = (str(work["title"]), str(work["creators"]), backend._normalise_isbn(volumes[0]["isbn"]), str(volumes[0]["volumeNumber"]), str(volumes[0]["editionKind"]))
                if any(backend._registry_bibliography(source) != bibliography for source in owned):
                    requirements.append("registry-repair")
            if not issues and not set(requirements).intersection({"protected", "eligible"}):
                # Same packet/baseline validators as freeze; no research or model is loaded.
                job = {"schemaVersion": single.FROZEN_JOB, "batchId": "r-" + "0" * 32,
                       "works": [{"workId": wid, "title": row["title"],
                                  "representativeIsbn": edition["isbn"], "registryVolumeProofs": []}]}
                try:
                    packet = prepare.build_packets(job, facts, registry)
                    backend._validate_packet_baseline_binding(packet, facts, registry)
                except (ValueError, prepare.panel.ValidationError, backend.PublishError) as error:
                    issues.append(str(error))
                    if "registry" in str(error).lower() and "registry-repair" not in requirements:
                        requirements.append("registry-repair")
        verified = summary_rows.get(wid)
        if verified and verified["status"] == "READY_FOR_PUBLICATION" and not set(requirements).intersection({"eligible", "protected"}):
            requirements = ["reuse-checked", *(item for item in requirements if item not in {"fresh", "prior-recovery"})]
        results.append({"workId": wid, "requirements": requirements, "assessment": "NOT_ASSESSED" if issues or set(requirements).intersection({"protected", "eligible", "registry-repair"}) else "IDENTITY_PREFLIGHT_PASS_ONLY",
                        "representativeSource": "dispatch" if "representativeEdition" in row else "current-candidate",
                        "issues": issues, "validatedChecked": {"path": verified["checkedPath"], "sha256": verified["checkedSha256"]} if verified and verified["status"] == "READY_FOR_PUBLICATION" else None,
                        "researchBinding": {"path": row.get("researchPath"), "sha256": row.get("researchSha256"), "assessed": False}})
    for path, expected in ((dispatch_path, dispatch_sha), (state_path, state_sha), (catalog_path, bindings["catalogSha256"]), (registry_path, bindings["registrySha256"])):
        require(prepare.panel.sha256(path) == expected, f"stale input: {path}")
    require(all(prepare.panel.sha256(contract_paths[key]) == sha for key, sha in bindings["contractsSha256"].items()), "stale contract")
    require(prepare.panel.sha256(gold_path) == bindings["goldManifestSha256"], "stale Gold manifest")
    if summary_path is not None:
        require(prepare.panel.sha256(summary_path) == summary_sha, "stale summary")
    if assignment_binding is not None:
        require(prepare.panel.sha256(Path(assignment_binding["path"])) == assignment_binding["sha256"], "stale registered assignment")
    return {"schemaVersion": "catalog-dispatch-plan-v1", "batchId": dispatch["batchId"],
            "phase": phase, "ownerThreadId": dispatch["ownerThreadId"], "parentThreadId": dispatch["parentThreadId"], "baselineRoot": str(baseline),
            "bindings": bindings, "summaryValidated": summary_path is not None,
            "workCount": len(results), "works": results,
            "verificationLimit": "Read-only identity/bibliography preflight; research, prior authority, safety, adjudication, and publication are not assessed."}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dispatch", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--batch-summary", type=Path)
    args = parser.parse_args()
    output = args.output.resolve()
    require(output.is_relative_to(ROOT) and not output.exists(), "output must be a new authoring artifact")
    report = plan(args.dispatch, args.batch_summary)
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix("." + uuid.uuid4().hex + ".tmp")
    try:
        temporary.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(temporary, output)
    finally:
        temporary.unlink(missing_ok=True)
    print(json.dumps({"output": str(output), "workCount": report["workCount"], "bindings": report["bindings"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
