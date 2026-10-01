"""Manifest-bound recommendation scope correction in the existing authoring flow.

Foreign-original scope is independent of the porn/non-porn classification.
This branch never rejudges factors or consumes recommendation coverage as scope.
"""
from __future__ import annotations

import json
from pathlib import Path

import validate_factor_panel as panel

ACTION = "EXCLUDE_NON_JAPANESE_ORIGINAL"
OUTCOME = "SCOPE_CORRECTION"
REQUEST = "catalog-scope-correction-request-v1"
RESULT = "catalog-scope-correction-v1"
EXTRACTOR = "authorized-evidence-panel-scope-correction-v1"
FLAGS = {"onboardingEligible": False, "recommendationEligible": False, "libraryOnly": True}


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def digest(value):
    return panel.sha256_bytes(canonical(value).encode("utf-8"))


def require(condition, message):
    if not condition:
        raise panel.ValidationError(message)


def requested(job):
    rows = [row for row in job["works"] if "scopeCorrection" in row]
    if not rows:
        return False
    require(len(rows) == len(job["works"]) == 1, "scope correction isolates one Work")
    row = rows[0]
    require(row["scopeCorrection"] == {"action": ACTION}, "unsupported scope correction request")
    require(not row["priorDecisions"] and "narrativeToneExhaustion" not in row,
            "eligibility-only scope correction cannot change prior claims or use coverage exceptions")
    return True


def enabled(input_root):
    info = panel.read_json(input_root / "panel-input.json")
    active = "scopeCorrection" in info
    require(not active or info["scopeCorrection"] == ACTION, "invalid frozen scope correction mode")
    require(active == (input_root / "scope-correction-request.json").is_file(), "scope request/mode mismatch")
    return active


def snapshot_from_rows(rows, wid):
    tables = {}
    for name, (columns, values) in rows.items():
        owner = "id" if name == "source_works" else "workId"
        if owner not in columns:
            continue
        index = columns.index(owner)
        tables[name] = sorted(({key: value for key, value in zip(columns, row)
                               if key not in {"sourceOrdinal", "sourceLine"}}
                              for row in values if row[index] == wid), key=canonical)
    return {"tables": tables}


def freeze_request(job, catalog):
    import publish_factor_batch as publisher
    require(requested(job), "missing eligibility-only scope request")
    row = job["works"][0]
    before = snapshot_from_rows(publisher._backend_module()._snapshot_db(catalog), row["workId"])
    works = before["tables"]["source_works"]
    require(len(works) == 1 and works[0]["annotationReviewMethod"] == "authorizedEvidencePanel",
            "scope correction requires existing AEP authority; human/legacy authority is protected")
    require((works[0]["recommendationEligible"], works[0]["libraryOnly"]) == ("true", "false"),
            "scope correction requires an existing recommendation Work")
    return {"schemaVersion": REQUEST, "workId": row["workId"],
            "representativeIsbn": row["representativeIsbn"], "action": ACTION,
            "beforeSnapshot": before, "beforeSnapshotSha256": digest(before["tables"])}


def project(input_root, value):
    import factor_single_pass as single
    from prepare_factor_batch import read_job
    require(enabled(input_root), "scope decision lacks frozen scope request")
    job = read_job(input_root / "authoring-job.json")
    require(requested(job), "scope mode differs from frozen job")
    row = job["works"][0]
    request = panel.read_json(input_root / "scope-correction-request.json")
    panel.exact_dict(request, {"schemaVersion", "workId", "representativeIsbn", "action", "beforeSnapshot", "beforeSnapshotSha256"}, "scope request")
    require(request["schemaVersion"] == REQUEST and request["action"] == ACTION
            and request["workId"] == row["workId"] and request["representativeIsbn"] == row["representativeIsbn"], "scope request identity mismatch")
    panel.exact_dict(request["beforeSnapshot"], {"tables"}, "scope before snapshot")
    require(request["beforeSnapshotSha256"] == digest(request["beforeSnapshot"]["tables"]), "scope before snapshot digest mismatch")
    panel.exact_dict(value, {"schemaVersion", "inputManifestSha256", "works"}, "scope adjudication")
    require(value["schemaVersion"] == single.DECISIONS and value["inputManifestSha256"] == panel.sha256(input_root / "PANEL-INPUT.sha256"), "scope input binding mismatch")
    require(isinstance(value["works"], list) and len(value["works"]) == 1, "scope decision needs one Work")
    decision = panel.exact_dict(value["works"][0], {"workId", "disposition", "sourceDecisions", "scope"}, "scope decision")
    require(decision["workId"] == row["workId"] and decision["disposition"] == "scopeCorrection", "scope decision membership/disposition mismatch")
    scope = panel.exact_dict(decision["scope"], {"outcome", "reasonCode", "evidenceIds", "entryScope", "observation", "limitation"}, "scope judgment")
    require(scope["outcome"] == "OUT_OF_SCOPE" and scope["reasonCode"] == "NON_JAPANESE_ORIGINAL", "scope correction must establish foreign-original exclusion")
    require(all(isinstance(scope[key], str) and scope[key].strip() for key in ("entryScope", "observation", "limitation")), "scope correction lacks actual observation/scope/limit")
    sources = {source.get("evidenceId", source.get("id")): source for source in [*row["evidence"], *row["supplementalEvidence"]]}
    accepted = set()
    seen = set()
    require(isinstance(decision["sourceDecisions"], list), "invalid scope source decisions")
    for source in decision["sourceDecisions"]:
        panel.exact_dict(source, {"evidenceId", "uses", "reason"}, "scope source decision")
        eid = source["evidenceId"]
        require(eid in sources and eid not in seen and isinstance(source["reason"], str) and source["reason"].strip(), "invalid or duplicate scope source")
        uses = single.explicit_ids(source["uses"], "scope source uses")
        require(set(uses) <= {"scope"}, "eligibility-only decision cannot rejudge factors, safety or context")
        if uses:
            accepted.add(eid)
        seen.add(eid)
    ids = single.explicit_ids(scope["evidenceIds"], "scope evidence IDs")
    require(ids and set(ids) <= accepted, "foreign-original exclusion lacks adopted positive scope evidence")
    selected = [sources[eid] for eid in ids]
    # manual is the established collector classification for manually captured
    # official documents (including cultural-agency copyright records). It is
    # not an origin verdict. Adoption still requires an actual positive scope
    # judgment of the exact frozen original/translation provenance.
    require(all(source["sourceType"] in {"publisher", "manual"} for source in selected), "scope exclusion requires official original/edition provenance")
    require(panel.entry_scope_bound(scope["entryScope"], {source.get("entryScope", "whole_work") for source in selected}), "scope reading scope exceeds frozen evidence")
    urls = sorted({source["sourceUrl"] for source in selected}, key=panel.code_unit_key)
    for url in urls:
        panel.valid_url(url, "scope evidence")
        require("anilist.co" not in url.lower(), "ineligible scope authority")
    return {"workId": row["workId"], "representativeIsbn": row["representativeIsbn"], "action": ACTION,
            **scope, "evidenceIds": ids, "citationUrls": urls,
            "inputManifestSha256": value["inputManifestSha256"],
            "beforeSnapshot": request["beforeSnapshot"], "beforeSnapshotSha256": request["beforeSnapshotSha256"],
            "afterEligibility": FLAGS.copy()}


def promotion(correction):
    return dict(zip(panel.PROMOTION_FIELDS, (correction["workId"], "scopeExcluded", OUTCOME,
        "", "false", "true", "authorizedEvidencePanel", "false", "true", "not-applicable-out-of-scope", "", "", "NON_JAPANESE_ORIGINAL")))


def accepted_exclusions(evidence):
    """Applied scope authority cannot be silently replaced by a normal PASS."""
    excluded = set()
    for row in evidence.values():
        if row.get("extractorVersion") != EXTRACTOR:
            continue
        notes = json.loads(row["notes"])
        correction = notes.get("correction", {})
        require(notes.get("schemaVersion") == "catalog-scope-correction-evidence-v1"
                and row["id"] == "ev-scope-correction-" + panel.sha256_bytes(row["notes"].encode("utf-8"))
                and correction.get("workId") == row["workId"] and correction.get("action") == ACTION
                and correction.get("outcome") == "OUT_OF_SCOPE" and correction.get("reasonCode") == "NON_JAPANESE_ORIGINAL"
                and correction.get("afterEligibility") == FLAGS,
                "stored scope correction authority changed")
        excluded.add(row["workId"])
    return excluded


def seal(output, destination, input_root, value, source_digest):
    from prepare_factor_batch import write_json, write_csv, write_text, manifest
    import publish_factor_batch as publisher
    correction = project(input_root, value)
    result = destination / "panel-result/chunk-01"
    write_json(result / "adjudication.json", value)
    write_json(result / "scope-corrections.json", {"schemaVersion": RESULT, "corrections": [correction]})
    write_csv(result / "evidence-panel-ledger.csv", panel.LEDGER_FIELDS, [])
    write_csv(result / "recommendation-context-condition.csv", panel.CONTEXT_FIELDS, [])
    write_csv(result / "promotion-ledger.csv", panel.PROMOTION_FIELDS, [promotion(correction)])
    (result / "PANEL-INPUT.sha256").write_bytes((input_root / "PANEL-INPUT.sha256").read_bytes())
    summary = {"workId": correction["workId"], "outcome": OUTCOME, "blockerCodes": [],
               "recommendationEligible": False, "libraryOnly": True}
    write_json(result / "evidence-panel-summary.json", {"schemaVersion": RESULT, "inputManifestSha256": correction["inputManifestSha256"],
        "targetCount": 1, "passCount": 0, "blockedCount": 0, "scopeCorrectionCount": 1, "works": [summary]})
    write_text(result / "authorized-evidence-panel-v1.md", "# Scope correction\n\nManifest-bound foreign-original exclusion changes eligibility only. Original factors, safety classification, recommendation context, metadata, reviews and history are preserved; this is not human review or a recommendation PASS.")
    manifest(result, "PANEL-RESULT.sha256")
    validation = publisher.validate_bundle(input_root, destination / "panel-result")
    report = {"status": "PASS", "stage": "RESULT_SEALED", "validation": validation, "works": [summary], "published": False,
        "adjudicationSourceKind": "structured-decisions", "adjudicationSourceSha256": source_digest,
        "frozenOutputRoot": str(output.resolve()), "inputManifestSha256": correction["inputManifestSha256"],
        "resultManifestSha256": panel.sha256(result / "PANEL-RESULT.sha256")}
    write_json(destination / "PREPARATION-REPORT.json", report)
    manifest(destination)
    return report


def validate(input_root, result_root, authority=None):
    import factor_single_pass as single
    info, chunks, input_sha = panel.validate_input(input_root)
    require(enabled(input_root) and len(chunks) == 1, "invalid scope correction input")
    ids = {row["workId"] for row in panel.read_csv(chunks[0] / "targets.csv", panel.TARGET_FIELDS)}
    authority = authority or panel.load_prior_authority(input_root, work_ids=ids)
    job = panel.read_json(input_root / "authoring-job.json")
    require({(row["workId"], row["factKey"]) for row in job["works"][0]["priorClaims"]}
            == {key for key in authority["claims"] if key[0] in ids}, "scope correction must retain every accepted prior claim")
    for row in job["works"][0]["priorClaims"]:
        panel.require_prior_claim(row, authority)
    require(not panel.load_prior_decisions(input_root), "scope correction cannot alter prior claims")
    require(result_root.is_dir() and {path.name for path in result_root.iterdir()} == {"chunk-01"}, "scope result membership mismatch")
    result = result_root / "chunk-01"
    files = single.result_files(info)
    require({path.name for path in result.iterdir()} == files and all(path.is_file() and not path.is_symlink() for path in result.iterdir()), "scope result file membership mismatch")
    panel.verify_manifest(result, result / "PANEL-RESULT.sha256", files - {"PANEL-RESULT.sha256"})
    require((result / "PANEL-INPUT.sha256").read_bytes() == (input_root / "PANEL-INPUT.sha256").read_bytes(), "scope copied input mismatch")
    correction = project(input_root, panel.read_json(result / "adjudication.json"))
    require(ids == {correction["workId"]}, "scope result targets mismatch")
    require(panel.read_json(result / "scope-corrections.json") == {"schemaVersion": RESULT, "corrections": [correction]}, "scope sidecar differs from frozen decision")
    require(not panel.read_csv(result / "evidence-panel-ledger.csv", panel.LEDGER_FIELDS)
            and not panel.read_csv(result / "recommendation-context-condition.csv", panel.CONTEXT_FIELDS), "scope-only result must not synthesize factor/context claims")
    require(panel.read_csv(result / "promotion-ledger.csv", panel.PROMOTION_FIELDS) == [promotion(correction)], "scope promotion mismatch")
    summary = panel.read_json(result / "evidence-panel-summary.json")
    require(summary == {"schemaVersion": RESULT, "inputManifestSha256": input_sha, "targetCount": 1,
        "passCount": 0, "blockedCount": 0, "scopeCorrectionCount": 1, "works": [{"workId": correction["workId"],
            "outcome": OUTCOME, "blockerCodes": [], "recommendationEligible": False, "libraryOnly": True}]}, "scope summary mismatch")
    require((result / "authorized-evidence-panel-v1.md").read_text(encoding="utf-8").strip(), "empty scope report")
    return {"schemaVersion": "authorized-evidence-panel-v1-result-validation", "chunkCount": 1, "targetCount": 1,
            "passCount": 0, "blockedCount": 0, "scopeCorrectionCount": 1}


def install_backend(module, input_root, result_root):
    """Reuse existing publisher orchestration, transaction and immutable artifacts."""
    correction = project(input_root, panel.read_json(result_root / "chunk-01/adjudication.json"))
    wid = correction["workId"]
    old_apply = module.apply_plan_in_transaction
    old_verify = module._verify_preservation

    def verify_immutable(input_root, result_root):
        import publish_factor_batch as publisher
        info, chunks, input_sha = publisher.validate_input(input_root)
        summary = validate(input_root, result_root)
        packet = panel.read_json(chunks[0] / f"packets/{wid}/packet.json")
        return {"panelInput": info, "chunks": chunks, "inputManifestSha256": input_sha,
            "targetIds": {wid}, "targetChunks": {wid: chunks[0]}, "contexts": {}, "supplemental": {}, "prior": {}, "frozen": {},
            "packets": {wid: packet}, "rows": [], "promotion": {wid: promotion(correction)}, "panelResult": summary}

    def plan_against_current(con, verified, registry, reviewed_at, review_reference, gold_ids, *, baseline_snapshot=None):
        require(con.in_transaction and wid not in gold_ids, "scope planning requires owned transaction and non-Gold Work")
        current = snapshot_from_rows(module._snapshot_db(con) if baseline_snapshot is None else baseline_snapshot, wid)
        require(current == correction["beforeSnapshot"], f"scope target changed since freeze: {wid}")
        notes = canonical({"schemaVersion": "catalog-scope-correction-evidence-v1", "correction": correction,
                           "resultManifestSha256": panel.sha256(result_root / "chunk-01/PANEL-RESULT.sha256"),
                           "reviewReference": review_reference, "reviewedByHuman": False})
        eid = "ev-scope-correction-" + panel.sha256_bytes(notes.encode("utf-8"))
        evidence = {"id": eid, "workId": wid, "targetType": "work", "targetId": wid, "sourceType": "manual",
            "sourceUrl": correction["citationUrls"][0], "fetchedAt": reviewed_at if "T" in reviewed_at else reviewed_at + "T00:00:00Z",
            "extractorVersion": EXTRACTOR, "reviewedByHuman": "false", "confidence": "0", "notes": notes}
        plan = {"targetIds": [wid], "scopeCorrections": {wid: correction}, "newEvidence": {eid: evidence},
            "factorUpdates": [], "themeInserts": [], "genreUpdates": {}, "contextInserts": [], "workUpdates": [],
            "acceptedClaimCount": 0, "changedClaimCount": 0, "legacyPassIds": [], "passIds": [], "blockedIds": []}
        baseline = module._baseline_facts(con) if baseline_snapshot is None else module._baseline_facts_from_snapshot(baseline_snapshot)
        return plan, baseline, {wid: panel.sha256(verified["targetChunks"][wid] / "CHUNK.sha256")}

    def apply(con, plan):
        if not plan.get("scopeCorrections"):
            return old_apply(con, plan)
        require(con.in_transaction and snapshot_from_rows(module._snapshot_db(con), wid) == correction["beforeSnapshot"], "scope apply lost exact frozen target")
        old_apply(con, plan)
        changed = con.execute("update source_works set onboardingEligible='false',recommendationEligible='false',libraryOnly='true' where id=? and recommendationEligible='true' and libraryOnly='false'", (wid,))
        require(changed.rowcount == 1, "scope eligibility update lost exact row")

    def verify(before, output, plan, gold_ids):
        if not plan.get("scopeCorrections"):
            return old_verify(before, output, plan, gold_ids)
        from compact_plan import CatalogState
        state = CatalogState(before, gold_ids)
        state.apply(plan)
        require(state.snapshot() == module._snapshot_db(output), "scope publication changed preserved rows")

    module.verify_immutable = verify_immutable
    module.plan_against_current = plan_against_current
    module.apply_plan_in_transaction = apply
    module._verify_preservation = verify
