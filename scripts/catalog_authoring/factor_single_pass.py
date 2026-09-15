"""Versioned post-freeze judgments; projections never modify their raw input."""
from __future__ import annotations

import re
import json
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path

import validate_factor_panel as panel

JOB = "factor-authoring-job-v4"
FROZEN_JOB = "factor-authoring-observations-v1"
INPUT = "authorized-evidence-panel-followup-v3"
DECISIONS = "factor-adjudication-v3"
EXTRA_RESULT_FILES = {"adjudication.json", "recommendation-context-condition.csv"}


def require(condition, message):
    if not condition:
        raise panel.ValidationError(message)


def valid_revision(value):
    return isinstance(value, str) and re.fullmatch(r"r-[a-z0-9][a-z0-9-]{7,63}", value) is not None


def is_single(input_root: Path) -> bool:
    return panel.read_json(input_root / "panel-input.json")["schemaVersion"] == INPUT


def result_files(info):
    return panel.RESULT_FILES | (EXTRA_RESULT_FILES if info["schemaVersion"] == INPUT else set())


def read_decisions(path):
    # CLI JSON has no required final newline. Preserve original bytes and hash;
    # the normal seal writes canonical derived JSON after semantic validation.
    return json.loads(path.read_text(encoding="utf-8"))


def explicit_ids(value, label):
    require(isinstance(value, list) and all(isinstance(v, str) and v and ";" not in v for v in value), f"invalid {label}")
    require(len(value) == len(set(value)), f"duplicate {label}")
    return sorted(value, key=panel.code_unit_key)


def scalars(value, fields, label):
    panel.exact_dict(value, set(fields), label)
    require(all(isinstance(value[key], str) for key in fields), f"invalid {label} scalars")
    return value


def project(input_root: Path, value: dict):
    """Bind every decision to frozen sources; retain the model's actual meaning."""
    from prepare_factor_batch import read_job, validated_safety
    require(is_single(input_root), "single adjudication requires v3 frozen input")
    panel.exact_dict(value, {"schemaVersion", "inputManifestSha256", "works"}, "single adjudication")
    require(value["schemaVersion"] == DECISIONS and value["inputManifestSha256"] == panel.sha256(input_root / "PANEL-INPUT.sha256"), "single adjudication input binding mismatch")
    job = read_job(input_root / "authoring-job.json")
    require(job["schemaVersion"] == FROZEN_JOB, "raw authoring format mismatch")
    require(isinstance(value["works"], list), "invalid decision works")
    decisions = {}
    for work in value["works"]:
        panel.exact_dict(work, {"workId", "disposition", "sourceDecisions", "identity", "safety", "context", "claims", "retainedClaims", "unknownGroups"}, "single work decision")
        require(work["disposition"] == "adjudicated", "HOLD is preserved separately, not a fabricated ledger")
        require(isinstance(work["workId"], str) and work["workId"] not in decisions, "duplicate decision work")
        decisions[work["workId"]] = work
    require(set(decisions) == {work["workId"] for work in job["works"]}, "single decision membership mismatch")
    projected, blockers, factor_works = [], {}, []
    for work in job["works"]:
        wid = work["workId"]
        decision = decisions[wid]
        sources = {row["id"]: row for row in work["evidence"]}
        require(len(sources) == len(work["evidence"]), "duplicate original source ID")
        for source in work["supplementalEvidence"]:
            require(source["evidenceId"] not in sources, f"ambiguous source ID: {source['evidenceId']}")
            sources[source["evidenceId"]] = source
        accepted, seen = {}, set()
        require(isinstance(decision["sourceDecisions"], list), "sourceDecisions must be a list")
        for source in decision["sourceDecisions"]:
            panel.exact_dict(source, {"evidenceId", "uses", "reason"}, "source decision")
            eid = source["evidenceId"]
            require(isinstance(eid, str) and eid in sources and eid not in seen and isinstance(source["reason"], str) and bool(source["reason"]), f"invalid source decision: {wid}")
            uses = explicit_ids(source["uses"], "source uses")
            require(set(uses) <= {"identity", "safety", "context", "factor"}, "invalid source use")
            seen.add(eid)
            accepted[eid] = set(uses)

        def selected(ids, purpose):
            ids = explicit_ids(ids, f"{wid} source IDs")
            require(all(purpose in accepted.get(eid, set()) for eid in ids), f"source not accepted for {purpose}, absent or cross-work: {wid}")
            rows = [sources[eid] for eid in ids]
            require(all(row["sourceType"] != "model" and "anilist.co" not in row["sourceUrl"].lower() for row in rows), "ineligible model/AniList source authority")
            urls = sorted({row["sourceUrl"] for row in rows}, key=panel.code_unit_key)
            for url in urls:
                panel.valid_url(url, wid)
            return ids, rows, urls

        identity = panel.exact_dict(decision["identity"], {"outcome", "evidenceIds", "observation", "limitation"}, "identity decision")
        require(identity["outcome"] in {"MATCH", "HOLD"} and all(isinstance(identity[k], str) and identity[k] for k in ("observation", "limitation")), "invalid identity decision")
        ids, _, identity_urls = selected(identity["evidenceIds"], "identity")
        require(identity["outcome"] != "MATCH" or bool(ids), "identity MATCH lacks source evidence")
        codes = [] if identity["outcome"] == "MATCH" else ["TARGET_IDENTITY_UNRESOLVED"]
        packet = panel.read_json(input_root / f"chunks/chunk-01/packets/{wid}/packet.json")
        require(packet.get("contextEvidenceId") is None, "v3 input must not contain a context verdict")
        context = scalars(decision["context"], {"evidenceId", "condition", "catalogRole", "observation", "limitation"}, "context decision")
        ids, _, urls = selected([context["evidenceId"]] if context["evidenceId"] else [], "context")
        require(set(urls) <= set(packet["supportEvidenceUrls"]), f"context source outside frozen registry support: {wid}")
        if not ids or any(not context[key] for key in ("condition", "catalogRole", "observation", "limitation")):
            codes.append("RECOMMENDATION_CONTEXT_MISSING")
        context_row = {"workId": wid, **{k: context[k] for k in ("condition", "catalogRole", "observation", "limitation")}, "evidenceIds": ";".join(ids), "citationUrls": ";".join(urls)}
        safety = panel.exact_dict(decision["safety"], {"outcome", "reasonCode", "sources", "observation", "limitation"}, "safety decision")
        require(safety["outcome"] in {"SAFE", "BLOCKED_SAFETY"} and isinstance(safety["sources"], list), "invalid safety decision")
        require(all(isinstance(safety[k], str) and safety[k] for k in ("observation", "limitation")) and isinstance(safety["reasonCode"], str), "invalid safety metadata")
        evidence = []
        for item in safety["sources"]:
            scalars(item, {"evidenceId", "classificationKind", "observation", "limitation"}, "safety source")
            _, rows, _ = selected([item["evidenceId"]], "safety")
            source = rows[0]
            kind = item["classificationKind"]
            classification = {"official-non-adult-label": "non-adult", "licensed-general-audience-label": "non-adult", "mainstream-selection-and-manga-category": "non-adult", "classification-unresolved": "unknown", "adult-or-scope-excluded": "adult"}.get(kind)
            require(classification is not None, "invalid safety classification")
            evidence.append({"evidenceId": f"ev-{job['batchId']}-{panel.sha256_bytes(item['evidenceId'].encode())[:16]}-safety", "workId": wid, "sourceType": source["sourceType"], "sourceUrl": source["sourceUrl"], "classificationKind": kind, "audienceClassification": classification, "observation": item["observation"], "limitation": item["limitation"], "retrievedAt": source.get("retrievedAt") or source.get("fetchedAt", ""), "candidateOnly": "true", "reviewedByHuman": "false"})
        safe = safety["outcome"] == "SAFE"
        require(not safe or safety["reasonCode"] == "SAFETY_VERIFIED", "invalid SAFE reason")
        if not safe:
            codes.append("BLOCKED_SAFETY")
        claim = {"workId": wid, "outcome": safety["outcome"], "factKey": "scope:safety", "state": "known" if safe else "unknown", "value": "in-scope-japanese-manga" if safe else "", "decision": "accepted" if safe else "blocked", "reasonCode": safety["reasonCode"], "evidenceIds": ";".join(sorted(row["evidenceId"] for row in evidence)), "citationUrls": ";".join(sorted({row["sourceUrl"] for row in evidence})), "observation": safety["observation"], "limitation": safety["limitation"], "candidateOnly": "true", "reviewedByHuman": "false"}
        require(isinstance(decision["claims"], list), "claims must be a list")
        for row in decision["claims"]:
            selected(row.get("evidenceIds"), "factor")
        factor_works.append({key: decision[key] for key in ("workId", "claims", "retainedClaims", "unknownGroups")})
        projected.append({**work, "identitySourceUrl": identity_urls[0] if identity_urls else "", "context": context_row, "safety": {"claim": claim, "evidence": evidence}})
        blockers[wid] = sorted(codes)
    output = {**job, "works": projected}
    validated_safety(output)
    factors = {"schemaVersion": "factor-adjudication-v2", "inputManifestSha256": value["inputManifestSha256"], "works": factor_works}
    return output, factors, blockers


def result_projection(chunk, result):
    value = panel.read_json(result / "adjudication.json")
    return project(chunk.parent.parent, value)


def contexts(chunk, result, targets, blockers, authority=None):
    if not is_single(chunk.parent.parent):
        return panel.validate_contexts(chunk, targets, blockers)
    from prepare_factor_batch import expand_decisions, canonicalize_new_claim
    job, factors, gates = result_projection(chunk, result)
    expected_ledger = expand_decisions(factors, chunk, targets, authority or {}, factors["inputManifestSha256"])
    retained = {(work["workId"], row["factKey"]) for work in job["works"] for key in ("priorClaims", "priorDecisions") for row in work[key]}
    for row in expected_ledger:
        if (row["workId"], row["factKey"]) not in retained:
            canonicalize_new_claim(row)
    semantic = set(panel.LEDGER_FIELDS) - {"authorityArtifactDigest", "citationSetDigest"}
    actual_ledger = panel.read_csv(result / "evidence-panel-ledger.csv", panel.LEDGER_FIELDS)
    require([{k: row[k] for k in semantic} for row in actual_ledger] == [{k: row[k] for k in semantic} for row in expected_ledger], "ledger differs from bound adjudication")
    rows = panel.read_csv(result / "recommendation-context-condition.csv", panel.CONTEXT_FIELDS)
    expected = [work["context"] for work in job["works"]]
    require(rows == expected, "result context differs from bound adjudication")
    for wid, codes in gates.items():
        blockers[wid] = sorted(set(blockers[wid]) | set(codes))
    return {row["workId"]: row for row in rows}


def install_backend(module, input_root, result_root):
    """Versioned input/result loader for the existing cumulative publisher."""
    if not is_single(input_root):
        return
    job, _, _ = project(input_root, panel.read_json(result_root / "chunk-01/adjudication.json"))
    contexts_by_id = {work["workId"]: work["context"] for work in job["works"]}

    def load(chunks):
        require(len(chunks) == 1 and chunks[0].resolve() == (input_root / "chunks/chunk-01").resolve(), "single-pass backend chunk mismatch")
        chunk = chunks[0]
        targets = panel.read_csv(chunk / "targets.csv", panel.TARGET_FIELDS)
        ids = {row["workId"] for row in targets}
        require(ids == set(contexts_by_id), "single-pass backend context membership")
        packets, frozen = {}, {}
        for wid in ids:
            root = chunk / "packets" / wid
            packet = panel.read_json(root / "packet.json")
            require(packet["work"]["id"] == wid and packet.get("contextEvidenceId") is None, "raw packet identity/context mismatch")
            # This is a result binding, never a rewrite of the frozen packet.
            packets[wid] = {**packet, "contextEvidenceId": contexts_by_id[wid]["evidenceIds"], "_packetDigest": panel.sha256(root / "PACKET.sha256")}
            for row in panel.read_csv(root / "evidence.csv", panel.ORIGINAL_EVIDENCE_FIELDS):
                require(row["id"] not in frozen or frozen[row["id"]] == row, "frozen evidence ID collision")
                frozen[row["id"]] = row
        supplemental = {row["evidenceId"]: row for row in panel.read_csv(chunk / "supplemental-evidence.csv", panel.SUPPLEMENTAL_FIELDS)}
        prior = {f"{row['workId']}\x1f{row['factKey']}": row for row in panel.read_csv(chunk / "prior-panel-claims.csv", panel.PRIOR_FIELDS)}
        return ids, {wid: chunk for wid in ids}, contexts_by_id, supplemental, prior, frozen, packets

    module._load_frozen = load


def output_schema(job=None, packets=None):
    """Transport schema only. Existing semantic validators remain authoritative."""
    string = {"type": "string"}
    strings = {"type": "array", "items": string}
    def obj(properties):
        return {"type": "object", "properties": properties, "required": list(properties), "additionalProperties": False}
    def array(item):
        return {"type": "array", "items": item}
    explanation = {"observation": string, "limitation": string}
    fact_key = {"type": "string", "enum": [*("axis:" + key for key in panel.AXES), *("genre:" + key for key in sorted(panel.GENRES)), *("theme:" + key for key in sorted(panel.THEMES))]}
    claim = obj({"factKey": fact_key, "state": {"enum": ["known", "notApplicable"]}, "value": string, "confidence": string, "evidenceIds": strings, "entryScope": string, **explanation, "reasonCode": string})
    work = obj({"workId": string, "disposition": {"enum": ["adjudicated"]}, "sourceDecisions": array(obj({"evidenceId": string, "uses": array({"enum": ["identity", "safety", "context", "factor"]}), "reason": string})), "identity": obj({"outcome": {"enum": ["MATCH", "HOLD"]}, "evidenceIds": strings, **explanation}), "safety": obj({"outcome": {"enum": ["SAFE", "BLOCKED_SAFETY"]}, "reasonCode": string, "sources": array(obj({"evidenceId": string, "classificationKind": string, **explanation})), **explanation}), "context": obj({"evidenceId": string, "condition": string, "catalogRole": string, **explanation}), "claims": array(claim), "retainedClaims": strings, "unknownGroups": array(obj({"axes": strings, "entryScope": string, **explanation, "reasonCode": string}))})
    hold = obj({"workId": string, "disposition": {"enum": ["hold"]}, "reason": string, "retryCondition": string})
    result = obj({"schemaVersion": {"enum": [DECISIONS]}, "inputManifestSha256": string, "works": array({"anyOf": [work, hold]})})
    work["properties"]["unknownGroups"]["items"]["properties"]["axes"] = array({"type": "string", "enum": list(panel.AXES)})
    safety_source = work["properties"]["safety"]["properties"]["sources"]["items"]["properties"]
    safety_source["classificationKind"] = {"enum": ["official-non-adult-label", "licensed-general-audience-label", "mainstream-selection-and-manga-category", "classification-unresolved", "adult-or-scope-excluded"]}
    if job is not None:
        require(len(job["works"]) == 1, "model schema needs one frozen Work")
        row = job["works"][0]
        for branch in (work, hold):
            branch["properties"]["workId"] = {"type": "string", "enum": [row["workId"]]}
        sources = [*row["evidence"], *row["supplementalEvidence"]]
        ids = sorted({s.get("evidenceId", s.get("id")) for s in sources})
        if ids:
            source_id = {"type": "string", "enum": ids}
            work["properties"]["sourceDecisions"]["items"]["properties"]["evidenceId"] = source_id
            work["properties"]["identity"]["properties"]["evidenceIds"] = array(source_id)
            safety_source["evidenceId"] = source_id
            claim["properties"]["evidenceIds"] = array(source_id)
        if packets is not None:
            support = packets[row["workId"]]["supportEvidenceUrls"]
            context_ids = sorted({s.get("evidenceId", s.get("id")) for s in sources if s["sourceUrl"] in support})
            work["properties"]["context"]["properties"]["evidenceId"] = {"type": "string", "enum": ["", *context_ids]}
    return result


def hold_result(input_root, value):
    panel.exact_dict(value, {"schemaVersion", "inputManifestSha256", "works"}, "adjudication envelope")
    require(value["schemaVersion"] == DECISIONS and value["inputManifestSha256"] == panel.sha256(input_root / "PANEL-INPUT.sha256"), "HOLD input binding mismatch")
    targets = panel.read_json(input_root / "authoring-job.json")["works"]
    require(isinstance(value["works"], list) and len(value["works"]) == len(targets) == 1, "single-pass revision requires one Work")
    work = value["works"][0]
    require(work.get("workId") == targets[0]["workId"], "HOLD target mismatch")
    if work.get("disposition") != "hold":
        return None
    scalars(work, {"workId", "disposition", "reason", "retryCondition"}, "HOLD")
    require(bool(work["reason"].strip()) and bool(work["retryCondition"].strip()), "HOLD needs its reason and retry condition")
    return work
