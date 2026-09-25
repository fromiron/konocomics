"""N/T-only eligibility exception; never changes factor values or engine coverage."""
from __future__ import annotations

import json
from pathlib import Path

POLICY = "narrative-tone-exhaustion-v1"
EXTRACTOR = "narrativeToneExhaustionV1"
REASON = "NARRATIVE_TONE_RESEARCH_EXHAUSTED"
NT_BLOCKERS = {"NARRATIVE_COVERAGE_INCOMPLETE", "TONE_COVERAGE_INCOMPLETE"}


def require(ok, message):
    if not ok:
        import validate_factor_panel as panel
        raise panel.ValidationError(message)


def validate_record(work):
    import validate_factor_panel as panel
    if "narrativeToneExhaustion" not in work:
        return None
    record = work["narrativeToneExhaustion"]
    panel.exact_dict(record, {"policy", "workId", "representativeIsbn", "attempts", "stopReason"}, "N/T exhaustion")
    require(record["policy"] == POLICY and record["workId"] == work["workId"] and record["representativeIsbn"] == work["representativeIsbn"], "N/T exhaustion identity/policy mismatch")
    require(isinstance(record["stopReason"], str) and bool(record["stopReason"].strip()), "N/T exhaustion needs a concrete stop reason")
    require(isinstance(record["attempts"], list) and bool(record["attempts"]), "N/T exhaustion needs actual additional research")
    urls = {source["url"] for source in work["research"]["sources"]}
    for attempt in record["attempts"]:
        panel.exact_dict(attempt, {"sourceUrl", "gap", "outcome", "observation"}, "N/T research attempt")
        require(attempt["sourceUrl"] in urls and attempt["gap"] in {"narrative", "tone"}, "N/T research attempt must bind a same-work frozen source and N/T gap")
        require(attempt["outcome"] in {"insufficient", "unavailable", "duplicate", "resolved"} and isinstance(attempt["observation"], str) and bool(attempt["observation"].strip()), "N/T research attempt lacks its actual outcome")
    return record


def from_input(input_root: Path):
    import validate_factor_panel as panel
    path = input_root / "authoring-job.json"
    if not path.exists():
        return {}
    job = panel.read_json(path)
    records = {work["workId"]: validate_record(work) for work in job["works"] if "narrativeToneExhaustion" in work}
    if records:
        require(job["schemaVersion"] == "factor-authoring-observations-v1", "N/T exception requires single-pass observations")
        require(panel.read_json(input_root / "panel-input.json")["schemaVersion"] == "authorized-evidence-panel-followup-v3", "N/T exception requires v3 input")
        contract = input_root / "contracts/02-authorized-evidence-panel-v1.md"
        require(POLICY in contract.read_text(encoding="utf-8"), "N/T exception absent from frozen policy; create a new input revision")
    return records


def filter_blockers(codes, record):
    attempted = {item["gap"] for item in record["attempts"]} if record else set()
    waived = {group.upper() + "_COVERAGE_INCOMPLETE" for group in attempted}
    return [code for code in codes if code not in waived]


def pass_reason(counts, enabled):
    return REASON if enabled and (counts["narrativeKnown"] < 4 or counts["toneKnown"] < 5) else "COVERAGE_COMPLETE"


def persisted_record(input_root, work_id, record, review_reference):
    import validate_factor_panel as panel
    encoded = json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return {"policy": POLICY, "workId": work_id, "representativeIsbn": record["representativeIsbn"],
            "inputManifestSha256": panel.sha256(input_root / "PANEL-INPUT.sha256"),
            "researchSha256": panel.sha256_bytes(encoded.encode("utf-8")),
            "reviewReference": review_reference, "research": record}
