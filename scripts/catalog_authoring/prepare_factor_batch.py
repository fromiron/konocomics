#!/usr/bin/env python3
"""Data-driven operator entry point for frozen Factor authoring, not adjudication."""
from __future__ import annotations

import argparse
import importlib.util
import json
import re
import shutil
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import publish_factor_batch as publisher
import validate_factor_panel as panel
import factor_single_pass as single
import coverage_exception as nt
from prepare_factor_rescue_004 import CONTRACTS, coverage, write_text
from prepare_ready_safety import manifest, write_csv, write_json, _qualifies

from authoring_paths import REPO, ROOT, LEGACY, artifact_path
from catalog_workspace import unlinked
WORK_KEYS = {"workId", "title", "representativeIsbn", "research", "supplementalEvidence", "context", "evidence", "priorClaims", "priorDecisions", "safety"}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise panel.ValidationError(message)


def input_file(value: str) -> Path:
    path = artifact_path(value)
    if not path.is_file():
        raise argparse.ArgumentTypeError(f"expected an existing file, not a directory: {path}")
    return path


def expand_compact_job(job: dict, directory: Path, bindings: dict[Path, str]) -> dict:
    """Load each explicitly hashed research snapshot once and project its fields."""
    require(isinstance(job["works"], list) and 1 <= len(job["works"]) <= 200, "job needs 1..200 works")
    snapshots, works = {}, []
    for raw in job["works"]:
        require(isinstance(raw, dict), "invalid compact authoring work")
        reference_key = "researchRefs" if "researchRefs" in raw else "researchRef"
        keys = (WORK_KEYS - {"research", "supplementalEvidence"}) | {reference_key, "sourceBindings"}
        if job["schemaVersion"] == single.JOB:
            keys -= {"context", "safety"}
        keys |= {"narrativeToneExhaustion"} if "narrativeToneExhaustion" in raw and job["schemaVersion"] == single.JOB else set()
        panel.exact_dict(raw, keys | ({"registryVolumeProofs"} if "registryVolumeProofs" in raw else set()), "compact authoring work")
        references = raw[reference_key] if reference_key == "researchRefs" else [raw[reference_key]]
        require(isinstance(references, list) and bool(references), "research references must be a nonempty list")
        merged_sources = {}
        for reference in references:
            panel.exact_dict(reference, {"path", "sha256"} | ({"handoffSha256", "collectionReceiptSha256"} & reference.keys()), "research reference")
            require(isinstance(reference["path"], str) and bool(reference["path"]), "missing research reference path")
            require(isinstance(reference["sha256"], str) and panel.SHA_RE.fullmatch(reference["sha256"]) is not None, "invalid research reference SHA")
            source_path = artifact_path(directory / reference["path"]).resolve()
            if source_path not in snapshots:
                source_bytes = source_path.read_bytes()
                bindings[source_path] = panel.sha256_bytes(source_bytes)
                require(bindings[source_path] == reference["sha256"], "research reference SHA mismatch")
                records = [json.loads(line) for line in source_bytes.decode("utf-8").splitlines() if line.strip()]
                require(all(isinstance(row, dict) and isinstance(row.get("workId"), str) for row in records), "invalid research snapshot")
                snapshots[source_path] = {row["workId"]: row for row in records}
                require(len(snapshots[source_path]) == len(records), "duplicate work in research snapshot")
            require(bindings[source_path] == reference["sha256"], "conflicting research reference SHA")
            research = snapshots[source_path].get(raw["workId"])
            require(research is not None, f"TARGET_IDENTITY_MISMATCH: research reference {raw['workId']}")
            for field, expected in {"schemaVersion": "factor-evidence-collector-v1", "candidateOnly": True, "reviewedByHuman": False, "grokUsed": False, "paidSourceUsed": False}.items():
                require(type(research.get(field)) is type(expected) and research[field] == expected, f"collector authority mismatch: {raw['workId']} {field}")
            for field, expected in (("title", raw["title"]), ("isbn13", raw["representativeIsbn"])):
                require(field not in research or research[field] == expected, f"TARGET_IDENTITY_MISMATCH: research {field}")
            if job["schemaVersion"] == single.JOB:
                record = nt.collection_record(source_path, reference, raw, research, bindings)
                if record is not None:
                    raw["narrativeToneExhaustion"] = record
            require(isinstance(research.get("sources"), list), "missing referenced sources")
            seen_urls = set()
            for source in research["sources"]:
                require(isinstance(source, dict) and isinstance(source.get("url"), str), "invalid referenced source")
                require(source["url"] not in seen_urls, "duplicate URL in research snapshot")
                seen_urls.add(source["url"])
                previous = merged_sources.get(source["url"])
                require(previous is None or previous == source, f"conflicting observations for URL; review and supply an explicit merged snapshot: {source['url']}")
                merged_sources[source["url"]] = source
        # Only observations accumulate. The last snapshot's status/gap hints are
        # not a verdict; all original snapshots remain bound by their exact SHA.
        research = {**research, "sources": list(merged_sources.values())}
        require(isinstance(raw["sourceBindings"], list), "invalid source bindings")
        supplemental = []
        for link in raw["sourceBindings"]:
            panel.exact_dict(link, {"evidenceId", "sourceUrl"}, "source binding")
            require(all(isinstance(value, str) and value for value in link.values()), "invalid source binding value")
            sources = [source for source in research["sources"] if isinstance(source, dict) and source.get("url") == link["sourceUrl"]]
            require(len(sources) == 1, f"source binding must resolve exactly once: {link['evidenceId']}")
            source = sources[0]
            audit = source.get("readAudit", {})
            require(isinstance(audit, dict), "invalid source readAudit")
            dates = {key: audit.get(key, source.get(key, "")) for key in ("publishedAt", "retrievedAt")}
            require(all(key not in source or key not in audit or source[key] == audit[key] for key in dates), "conflicting source and readAudit timestamps")
            require(all(isinstance(value, str) for value in dates.values()) and bool(dates["retrievedAt"]), "source needs its actual retrievedAt; no timestamp is invented")
            supplemental.append({
                "collectorPass": "factor-evidence-collector-v1", "collectorChunk": "chunk-01",
                **link, "workId": raw["workId"], "targetType": "work", "targetId": raw["workId"],
                **dates,
                **publisher.supplemental_source_fields(source),
            })
        require(len({row["evidenceId"] for row in supplemental}) == len(supplemental), "duplicate source binding evidence ID")
        require(len({row["sourceUrl"] for row in supplemental}) == len(supplemental), "duplicate source binding URL")
        works.append({
            **{key: value for key, value in raw.items() if key not in {reference_key, "sourceBindings"}},
            "research": research, "supplementalEvidence": supplemental,
            "registryVolumeProofs": raw.get("registryVolumeProofs", []),
        })
    return {**job, "schemaVersion": single.FROZEN_JOB if job["schemaVersion"] == single.JOB else "factor-authoring-job-v2", "works": works}


def read_job(path: Path, input_bindings: dict[Path, str] | None = None, *, recovery: bool = False) -> dict:
    bindings = {} if input_bindings is None else input_bindings
    bindings[path.resolve()] = panel.sha256(path)
    job = panel.exact_dict(panel.read_json(path), {"schemaVersion", "batchId", "works"}, "authoring job")
    if job["schemaVersion"] in {"factor-authoring-job-v3", single.JOB}:
        job = expand_compact_job(job, path.resolve().parent, bindings)
    deferred = job["schemaVersion"] == single.FROZEN_JOB
    require(job["schemaVersion"] in {"factor-authoring-job-v1", "factor-authoring-job-v2", single.FROZEN_JOB}, "unsupported authoring job")
    proof_mode = job["schemaVersion"] != "factor-authoring-job-v1"
    require(single.valid_revision(job["batchId"]) if deferred else isinstance(job["batchId"], str) and re.fullmatch(r"\d{3}", job["batchId"]) is not None, "invalid batchId")
    require(isinstance(job["works"], list) and 1 <= len(job["works"]) <= 200, "job needs 1..200 works")
    seen = set()
    for raw in job["works"]:
        keys = (WORK_KEYS - ({"context", "safety"} if deferred else set())) | ({"registryVolumeProofs"} if proof_mode else set())
        keys |= {"narrativeToneExhaustion"} if deferred and "narrativeToneExhaustion" in raw else set()
        row = panel.exact_dict(raw, keys, "authoring work")
        nt.validate_record(row)
        wid = row["workId"]
        require(isinstance(wid, str) and re.fullmatch(r"work-[0-9a-f]{20}", wid) is not None and wid not in seen, "invalid or duplicate work ID")
        seen.add(wid)
        if proof_mode:
            publisher._backend_module().validate_registry_volume_proofs(row["registryVolumeProofs"], wid)
        require(isinstance(row["title"], str) and bool(row["title"]), f"missing expected title: {wid}")
        require(isinstance(row["representativeIsbn"], str), f"missing expected ISBN: {wid}")
        research = row["research"]
        require(isinstance(research, dict) and research.get("workId") == wid, f"TARGET_IDENTITY_MISMATCH: {wid}")
        for key, value in {"schemaVersion": "factor-evidence-collector-v1", "candidateOnly": True, "reviewedByHuman": False, "grokUsed": False, "paidSourceUsed": False}.items():
            require(type(research.get(key)) is type(value) and research[key] == value, f"collector authority mismatch: {wid} {key}")
        require(isinstance(research.get("sources"), list), f"missing sources: {wid}")
        for source in research["sources"]:
            require(isinstance(source, dict) and isinstance(source.get("claimCandidates"), list), f"invalid source: {wid}")
            for hint in source["claimCandidates"]:
                require(isinstance(hint, dict) and set(hint) == {"targetType", "targetId", "anchor"}, f"collector decision or malformed hint: {wid}")
        for key, fields in (("supplementalEvidence", panel.SUPPLEMENTAL_FIELDS), ("evidence", panel.ORIGINAL_EVIDENCE_FIELDS), ("priorClaims", panel.PRIOR_FIELDS), ("priorDecisions", panel.DECISION_FIELDS)):
            require(isinstance(row[key], list), f"invalid {key}: {wid}")
            for item in row[key]:
                panel.exact_dict(item, set(fields), key)
                require(item.get("workId") == wid, f"cross-work {key}: {wid}")
        if deferred:
            if recovery:
                require(not row["priorClaims"] and not row["priorDecisions"], f"recovery requires fresh full adjudication: {wid}")
                panel.validate_recovery_evidence(row["evidence"])
            continue
        panel.exact_dict(row["context"], set(panel.CONTEXT_FIELDS), "context")
        require(row["context"]["workId"] == wid, f"cross-work context: {wid}")
        safety = panel.exact_dict(row["safety"], {"claim", "evidence"}, "safety")
        require(isinstance(safety["evidence"], list), f"invalid safety evidence: {wid}")
        panel.exact_dict(safety["claim"], set(publisher.SAFETY_CLAIM_FIELDS), "safety claim")
        require(safety["claim"]["workId"] == wid, f"cross-work safety: {wid}")
        for item in safety["evidence"]:
            panel.exact_dict(item, set(publisher.SAFETY_EVIDENCE_FIELDS), "safety evidence")
        ids = [item["evidenceId"] for item in safety["evidence"]]
        require(len(set(ids)) == len(ids), f"duplicate safety evidence: {wid}")
        if not (recovery and safety["claim"]["outcome"] == "BLOCKED_SAFETY"):
            require(_qualifies({"workId": wid}, safety["claim"], dict(zip(ids, safety["evidence"]))), f"missing affirmative safety: {wid}")
        if recovery:
            require(not row["priorClaims"] and not row["priorDecisions"], f"recovery requires fresh full adjudication, not imported prior claims: {wid}")
            panel.validate_recovery_evidence(row["evidence"])
    if recovery and not deferred:
        validated_safety(job)
    require(all(panel.sha256(source) == digest for source, digest in bindings.items()), "authoring input changed while reading")
    return job


def build_packets(job: dict, facts: dict, registry: dict) -> dict:
    """Construct identity packets before either registry correction or input freeze."""
    backend = publisher._backend_module()
    packets = {}
    split = lambda value: sorted(set(filter(None, (v.strip() for v in re.split(r"[;|]", value)))), key=panel.code_unit_key)
    for ordinal, row in enumerate(job["works"], 1):
        wid = row["workId"]
        require(wid in facts["works"], f"unknown work: {wid}")
        work = facts["works"][wid]
        require(work["title"] == row["title"], f"TARGET_IDENTITY_MISMATCH: {wid} title")
        require(work["annotationReviewMethod"] not in {"human", "authorizedModelPanel"}, f"protected authority: {wid}")
        volumes = [v for v in facts["volumeRows"].get(wid, []) if v["isRepresentative"] == "true"]
        require(len(volumes) == 1, f"representative volume count: {wid}")
        volume = volumes[0]
        require(backend._normalise_isbn(row["representativeIsbn"]) == backend._normalise_isbn(volume["isbn"]), f"TARGET_IDENTITY_MISMATCH: {wid} ISBN")
        owned = registry["rowsByWork"].get(wid, [])
        union = lambda key: sorted({v for r in owned for v in split(str(r.get(key, "")))}, key=panel.code_unit_key)
        packets[wid] = {"batchId": job["batchId"], "ordinal": ordinal, "candidateOnly": True, "reviewedByHuman": False, "entryScope": "whole_work", "contextEvidenceId": None if job["schemaVersion"] == single.FROZEN_JOB else row["context"]["evidenceIds"].split(";")[0], "cohortKey": " | ".join(union("cohortKeys")), "sourceClass": " | ".join(union("sourceFamilies")), "sourceIdentity": " | ".join(union("identityEvidenceUrls")), "supportEvidenceUrls": union("supportEvidenceUrls"), "work": {key: work[key] for key in ("id", "title", "titleKana", "creators", "publisher", "demographic", "status", "firstPublishedYear", "factorScope")}, "representativeVolume": {key: volume[key] for key in ("id", "volumeNumber", "isbn", "releaseDate", "editionKind", "isRepresentative", "evidenceId")}, "priorCandidateTablesExcludedFromPacket": True}
        if job["schemaVersion"] in {"factor-authoring-job-v2", single.FROZEN_JOB}:
            backend.validate_registry_volume_proofs(row["registryVolumeProofs"], wid)
            packets[wid]["registryVolumeProofs"] = row["registryVolumeProofs"]
    return packets


def validate_context_evidence(job: dict, facts: dict, packets: dict) -> None:
    """Resolve context evidence through the same three routes as publication."""
    backend = publisher._backend_module()
    baseline_evidence = facts["evidence"]
    for row in job["works"]:
        wid = row["workId"]
        context = row["context"]
        ids = panel.split_list(context["evidenceIds"], f"{wid} context evidenceIds")
        urls = panel.split_list(context["citationUrls"], f"{wid} context citationUrls")
        require(set(urls) <= set(packets[wid]["supportEvidenceUrls"]), f"context citation URL exceeds frozen packet supportEvidenceUrls: {wid}")
        frozen_evidence = {source["id"]: source for source in row["evidence"]}
        supplemental = {source["evidenceId"]: source for source in row["supplementalEvidence"]}
        for evidence_id in ids:
            source = baseline_evidence.get(evidence_id) or frozen_evidence.get(evidence_id) or supplemental.get(evidence_id)
            require(source is not None and source.get("workId") == wid, f"missing or cross-work context evidence: {wid} {evidence_id}")
            backend._iso(publisher._safety_fetched_at(source.get("fetchedAt") or source.get("retrievedAt", "")), evidence_id)
            source_url = source.get("sourceUrl", "")
            require(not source_url or source_url in urls, f"context evidence URL is outside cited support URLs: {wid}")


def preflight(job: dict, baseline: Path, registry_path: Path, *, recovery: bool = False) -> tuple[dict, dict, dict]:
    """Check real publisher identity/bibliography before freezing or numerical review."""
    publisher._verify_result_manifest(baseline)
    catalog_path = baseline / "catalog-expanded.candidate.sqlite"
    if registry_path.resolve() != (baseline / "catalog-source-registry.candidate.sqlite").resolve():
        from correct_factor_registry import verify_correction
        verified = verify_correction(registry_path.parent, baseline / "catalog-source-registry.candidate.sqlite", catalog_path)
        require(verified.resolve() == registry_path.resolve(), "registry correction target mismatch")
    backend = publisher._backend_module()
    ids = {row["workId"] for row in job["works"]}
    require(not ids.intersection(panel.read_json(REPO / "data/staging/catalog-expansion/gold-set-manifest.json")["workIds"]), "protected Gold work")
    facts = backend._baseline_facts(catalog_path)
    registry = backend.ensure_registry(registry_path, ids, panel.sha256(catalog_path))
    registry = {**registry, "frozenRowsByWork": registry["rowsByWork"]}
    packets = build_packets(job, facts, registry)
    backend._validate_packet_baseline_binding(packets, facts, registry)
    if job["schemaVersion"] == single.FROZEN_JOB:
        errors = []
        for row in job["works"]:
            sources = row["evidence"] + row["supplementalEvidence"]
            ids = [source.get("evidenceId", source.get("id")) for source in sources]
            if len(ids) != len(set(ids)):
                errors.append(f"{row['workId']}: duplicate evidence ID across original and supplemental sources")
            if not any(source["sourceUrl"] in packets[row["workId"]]["supportEvidenceUrls"] for source in sources):
                errors.append(f"{row['workId']}: no same-Work evidence bound to an exact supportEvidenceUrl; repair binding or collect the missing context")
        require(not errors, "INPUT_NEEDS_REPAIR: " + "; ".join(errors))
        return packets, facts, registry
    validate_context_evidence(job, facts, packets)
    validated = validated_safety(job)
    require(recovery or all(c["outcome"] == "SAFE" for c in validated.values()), "safety must pass before input freeze")
    safe_ids = {work_id for work_id, claim in validated.items() if claim["outcome"] == "SAFE"}
    if safe_ids:
        safety_packets = {
            work_id: {**packet, "_packetDigest": f"preflight:{work_id}"}
            for work_id, packet in packets.items()
        }
        frozen_safety = {
            source["evidenceId"]: {
                **source,
                "id": source["evidenceId"],
                "targetType": "work",
                "targetId": source["workId"],
                "fetchedAt": source["retrievedAt"],
                "notes": " ".join((source["audienceClassification"], source["observation"], source["limitation"])),
            }
            for work in job["works"]
            for source in work["safety"]["evidence"]
        }
        safety_claims = {
            f"{work['workId']}\x1fscope:safety": {
                **work["safety"]["claim"],
                "packetDigest": f"preflight:{work['workId']}",
            }
            for work in job["works"]
        }
        for work_id in sorted(safe_ids):
            backend._validate_safety_gate(
                work_id, safety_claims, frozen_safety, {}, facts["evidence"], safety_packets
            )
    return packets, facts, registry


def validated_safety(job: dict) -> dict:
    """Validate explicit SAFE or BLOCKED_SAFETY through the existing contract."""
    validator = safety_validator()
    ids = {row["workId"] for row in job["works"]}
    evidence = sorted([e for row in job["works"] for e in row["safety"]["evidence"]], key=lambda e: (e["workId"], e["evidenceId"]))
    claims = sorted([row["safety"]["claim"] for row in job["works"]], key=lambda e: e["workId"])
    indexed = validator.validate_evidence(evidence, Path("job/safety"), ids)
    validated = validator.validate_claims(claims, indexed, Path("job/safety"), ids)
    require(set(validated) == ids, "safety target membership mismatch")
    return validated


def safety_validator():
    path = LEGACY / "safety-recheck-v1/tools/validate_safety_recheck.py"
    spec = importlib.util.spec_from_file_location("_authoring_safety_validator", path)
    require(spec is not None and spec.loader is not None, "missing existing safety validator")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def provenance_roots(value):
    return sorted({unlinked(artifact_path(p)).resolve() for p in ([value] if isinstance(value, (str, Path)) else value or [])}, key=str)


def capture_files(root: Path, *, recursive=False) -> dict:
    files = {}
    for receipt_path in sorted(root.rglob("*.json") if recursive else root.glob("*.json")):
        if not receipt_path.name.startswith(("capture-", "web-response-")) or receipt_path.name.endswith(".publisher-receipt.json"):
            continue
        receipt = panel.read_json(unlinked(receipt_path))
        files[receipt_path.relative_to(root).as_posix()] = panel.sha256(receipt_path)
        if not receipt.get("rawPath"):
            continue  # Failed access remains recorded; it is not invented raw evidence.
        body_path = unlinked(panel._safe_child(receipt_path.parent, receipt["rawPath"]))
        require(body_path.is_file(), f"NEEDS_PROVENANCE_BINDING: missing raw body: {body_path}")
        body = body_path.read_bytes()
        require(panel.sha256_bytes(body) == receipt.get("sha256") and len(body) == receipt.get("bytes"),
                f"NEEDS_PROVENANCE_BINDING: raw capture/receipt mismatch: {receipt_path}")
        files[body_path.relative_to(root).as_posix()] = receipt["sha256"]
    return files


def capture_bindings(job_path: Path, provenance=None) -> list[dict]:
    """Bind completed, same-Work collections; never copy a research parent blindly."""
    raw = panel.read_json(job_path)
    works = {row["workId"]: row for row in raw["works"]}
    explicit = set(provenance_roots(provenance))
    roots = set(explicit)
    research = {}
    for row in raw["works"]:
        for ref in row.get("researchRefs", [row["researchRef"]] if "researchRef" in row else []):
            path = unlinked(artifact_path(job_path.resolve().parent / ref["path"]))
            require(panel.sha256(path) == ref["sha256"], "research reference SHA mismatch")
            research.setdefault(path.parent.resolve(), {})[str(path.resolve())] = ref["sha256"]
            covered = any(path.parent.is_relative_to(root) for root in explicit)
            if (path.parent / "collection-session.json").is_file() and not covered:
                roots.add(path.parent.resolve())
            elif not covered:
                require(not any(path.parent.glob("capture-*.json")) and not any(path.parent.glob("web-response-*.json")),
                        f"NEEDS_PROVENANCE_BINDING: raw receipts without a collection session: {path.parent}")
    bindings = []
    for root in sorted(roots, key=str):
        require(root.is_dir() and not root.is_symlink() and not root.is_junction(), f"NEEDS_PROVENANCE_BINDING: invalid collection: {root}")
        session = unlinked(root / "collection-session.json")
        if not session.is_file():
            # Existing explicit legacy roots remain usable, never auto-discovered.
            # Their files are operator-bound input, not certified same-Work evidence.
            require(root in explicit, f"NEEDS_PROVENANCE_BINDING: missing collection session: {root}")
            files = {}
            for path in root.rglob("*"):
                unlinked(path)
                if path.is_file():
                    files[path.relative_to(root).as_posix()] = panel.sha256(path)
            require(bool(files), f"NEEDS_PROVENANCE_BINDING: empty explicit provenance: {root}")
            for name in files:
                if Path(name).name == "collection-session.json":
                    require(panel.read_json(root / name).get("workId") in works, f"NEEDS_PROVENANCE_BINDING: collection Work mismatch: {root / name}")
            files.update(capture_files(root, recursive=True))
            bindings.append({"root": str(root), "bindingKind": "explicit-legacy", "workIds": sorted(works), "files": files})
            continue
        work_id = panel.read_json(session).get("workId")
        require(work_id in works, f"NEEDS_PROVENANCE_BINDING: collection Work mismatch: {root}")
        refs = research.get(root, {})
        if not refs:
            path = unlinked(root / "research.jsonl")
            require(path.is_file(), f"NEEDS_PROVENANCE_BINDING: collection research missing: {root}")
            refs = {str(path): panel.sha256(path)}
        files = {"collection-session.json": panel.sha256(session)}
        for path, digest in refs.items():
            rows = [json.loads(line) for line in Path(path).read_text(encoding="utf-8").splitlines() if line.strip()]
            require(all(isinstance(row, dict) for row in rows) and sum(row.get("workId") == work_id for row in rows) == 1,
                    f"NEEDS_PROVENANCE_BINDING: research/collection Work mismatch: {path}")
            files[Path(path).relative_to(root).as_posix()] = digest
        files.update(capture_files(root))
        handoff = unlinked(root / "COLLECTION-HANDOFF.json")
        if handoff.is_file():
            files[handoff.name] = panel.sha256(handoff)
        for row in raw["works"]:
            for ref in row.get("researchRefs", [row["researchRef"]] if "researchRef" in row else []):
                if ("collectionReceiptSha256" in ref
                        and artifact_path(job_path.resolve().parent / ref["path"]).parent.resolve() == root):
                    receipt = unlinked(root / "collection-events.jsonl")
                    require(receipt.is_file() and panel.sha256(receipt) == ref["collectionReceiptSha256"], "INPUT_NEEDS_REPAIR: collection receipt changed")
                    files[receipt.name] = ref["collectionReceiptSha256"]
        bindings.append({"root": str(root), "workId": work_id, "researchBindings": refs, "files": files})
    return bindings


def freeze(job_path: Path, baseline: Path, registry_path: Path, output: Path, provenance=None, prior_bundles: tuple[Path, ...] = (), recovery_epoch: Path | None = None) -> dict:
    require(not output.exists(), f"refusing overwrite: {output}")
    for root in provenance_roots(provenance):
        require(not output.resolve().is_relative_to(root), "freeze output must be outside provenance directory")
    input_bindings: dict[Path, str] = {}
    if recovery_epoch is not None:
        import factor_recovery
        epoch = factor_recovery.load_epoch(recovery_epoch)
        input_bindings[recovery_epoch.resolve()] = panel.sha256(recovery_epoch)
        input_bindings[artifact_path(epoch["originalCanonicalPath"]).resolve()] = epoch["canonicalSha256"]
    job = read_job(job_path, input_bindings, recovery=recovery_epoch is not None)
    captures = capture_bindings(job_path, provenance)
    for binding in captures:
        root = Path(binding["root"])
        require(not output.resolve().is_relative_to(root), "freeze output must be outside provenance directory")
        input_bindings.update({root / name: digest for name, digest in binding["files"].items()})
    if job["schemaVersion"] == single.FROZEN_JOB:
        require(len(job["works"]) == 1, "single-pass revisions isolate one Work; queue independent revisions")
    declaration = None
    if recovery_epoch is not None:
        require(1 <= len(job["works"]) <= 5, "recovery freeze needs 1..5 works")
        declaration = factor_recovery.build_declaration(recovery_epoch, baseline / "catalog-expanded.candidate.sqlite", {w["workId"] for w in job["works"]})
    started = time.perf_counter()
    packets, _, registry = preflight(job, baseline, registry_path, recovery=declaration is not None)
    checked = time.perf_counter()
    input_root = output / "panel-input"
    chunk = input_root / "chunks/chunk-01"
    chunk.mkdir(parents=True)
    write_json(input_root / "authoring-job.json", job)
    for source, name in CONTRACTS.values():
        destination = input_root / "contracts" / name
        destination.parent.mkdir(exist_ok=True)
        shutil.copyfile(REPO / source, destination)
    shutil.copyfile(REPO / "docs/catalog-expansion/factor-panel-request.md", input_root / "PANEL-REQUEST.md")
    if job["schemaVersion"] == single.FROZEN_JOB:
        write_json(input_root / "DECISION-SCHEMA.json", single.output_schema(job, packets))
    policies = {key: panel.sha256(input_root / "contracts" / name) for key, (_, name) in CONTRACTS.items()}
    write_json(input_root / "prior-authority.json", {"schemaVersion": "factor-prior-authority-v1", "bundles": []})
    if prior_bundles or any(w["priorClaims"] for w in job["works"]):
        roots = sorted(({baseline.resolve()} if declaration is None else set()) | {p.resolve() for p in prior_bundles}, key=str)
        write_json(input_root / "external-prior-authority.json", {"schemaVersion": "factor-external-prior-authority-v1", "bundles": [{"root": str(p), "manifestSha256": panel.sha256(p / "MANIFEST.sha256")} for p in roots]})
    write_json(input_root / "external-lineage.json", {"baselineRoot": str(baseline.resolve()), "baselineManifestSha256": panel.sha256(baseline / "MANIFEST.sha256"), "registryPath": str(registry_path.resolve()), "sourceJobSha256": input_bindings[job_path.resolve()], "sourceInputBindings": {str(path): digest for path, digest in input_bindings.items()}, "historicalExecutionReplayed": False})
    for binding in captures:
        root = Path(binding["root"])
        # Separate namespaces preserve relative rawPath and same-named captures.
        namespace = panel.sha256_bytes(str(root).encode())[:16]
        for name, digest in binding["files"].items():
            destination = input_root / "provenance" / namespace / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(root / name, destination)
            require(panel.sha256(destination) == digest, "provenance changed during freeze")
    write_json(input_root / "provenance-bindings.json", {"collections": captures})
    registry_rows = sorted([r for wid in packets for r in registry["rowsByWork"][wid]], key=lambda r: int(r["sourceOrdinal"]))
    require(bool(registry_rows), "missing frozen registry rows")
    write_csv(input_root / "source-registry.csv", tuple(registry_rows[0]), registry_rows)
    targets, supplemental = [], []
    for row in job["works"]:
        wid = row["workId"]
        packet = {**packets[wid], "policyDigests": {k: v for k, v in policies.items() if k != "authoringAuthority"}}
        packet_root = chunk / "packets" / wid
        write_json(packet_root / "packet.json", packet)
        write_csv(packet_root / "evidence.csv", panel.ORIGINAL_EVIDENCE_FIELDS, row["evidence"])
        write_text(packet_root / "entry-observation.md", f"# {row['title']}\n\nSource observations are frozen in collector-research.jsonl and supplemental-evidence.csv. No numerical candidates are imported. Original evidence timestamps and provenance remain unchanged; this preparation does not replay historical collection.")
        manifest(packet_root, "PACKET.sha256")
        counts, _ = coverage(row["priorClaims"], wid)
        missing = sum(max(0, minimum - counts[key]) for key, minimum in (("narrativeKnown", 4), ("toneKnown", 5), ("genreCount", 1), ("themeCount", 1)))
        prior_pairs = {(c["batchId"], c["ordinal"]) for c in row["priorClaims"]}
        prior_batch, prior_ordinal = next(iter(prior_pairs)) if len(prior_pairs) == 1 else ("", "")
        targets.append(dict(zip(panel.TARGET_FIELDS, (job["batchId"], str(packet["ordinal"]), wid, row["title"], str(counts["narrativeKnown"]), str(counts["toneKnown"]), str(counts["genreCount"]), str(counts["themeCount"]), str(missing), prior_batch, prior_ordinal, packet["representativeVolume"]["isbn"], f"packets/{wid}", panel.sha256(packet_root / "PACKET.sha256")))))
        supplemental.extend({**e, "collectorChunk": "chunk-01"} for e in row["supplementalEvidence"])
    write_csv(chunk / "targets.csv", panel.TARGET_FIELDS, targets)
    write_csv(chunk / "supplemental-evidence.csv", panel.SUPPLEMENTAL_FIELDS, supplemental)
    if job["schemaVersion"] != single.FROZEN_JOB:
        write_csv(chunk / "recommendation-context-condition.csv", panel.CONTEXT_FIELDS, [row["context"] for row in job["works"]])
    write_csv(chunk / "prior-panel-claims.csv", panel.PRIOR_FIELDS, [c for row in job["works"] for c in row["priorClaims"]])
    write_csv(input_root / "prior-claim-decisions.csv", panel.DECISION_FIELDS, [c for row in job["works"] for c in row["priorDecisions"]])
    write_text(chunk / "collector-research.jsonl", "\n".join(json.dumps(row["research"], ensure_ascii=False, separators=(",", ":")) for row in job["works"]))
    write_text(chunk / "collector-report.md", "# Frozen observations\n\nSource scope, limitations and provenance remain in the data records. No numerical adjudication is performed by this command.")
    if declaration is not None:
        write_json(chunk / "recovery-declaration.json", declaration)
    manifest(chunk, "CHUNK.sha256")
    write_json(input_root / "panel-input.json", {"schemaVersion": single.INPUT if job["schemaVersion"] == single.FROZEN_JOB else "authorized-evidence-panel-followup-v2", "batchId": job["batchId"], "frozenAt": datetime.now(timezone.utc).isoformat(timespec="seconds"), "targetCount": len(targets), "chunkCount": 1, "annotationReviewMethod": "authorizedEvidencePanel", "candidateOnly": True, "reviewedByHuman": False, "grokExcluded": True, "paidSourcesExcluded": True, "aniListAuthorizingEvidence": False, "collectorDecisionClaimsIncluded": False, "baselineCandidateSha256": panel.sha256(baseline / "catalog-expanded.candidate.sqlite"), "registrySha256": panel.sha256(registry_path), "canonicalSha256": panel.sha256(REPO / "data/source/catalog.sqlite"), "goldManifestSha256": panel.sha256(REPO / "data/staging/catalog-expansion/gold-set-manifest.json"), "policyDigests": policies})
    manifest(input_root, "PANEL-INPUT.sha256")
    _, _, digest = publisher.validate_input(input_root)
    if declaration is not None:
        panel.load_prior_authority(input_root, baseline / "catalog-expanded.candidate.sqlite", work_ids=set(packets))
    panel.indexes(chunk, targets)
    publisher._evidence_index(chunk, set(packets))
    require(all(panel.sha256(source) == digest for source, digest in input_bindings.items()), "authoring input changed during freeze; partial output is not usable")
    report = {"status": "PASS", "stage": "INPUT_FROZEN", "targetCount": len(targets), "inputManifestSha256": digest, "inputBytes": sum(p.stat().st_size for p in input_root.rglob("*") if p.is_file()), "baselineCopied": False, "preflightSeconds": checked - started, "freezeSeconds": time.perf_counter() - checked, "collectionSeconds": None, "semanticReviewSeconds": None}
    write_json(output / "INPUT-PREPARATION-REPORT.json", report)
    return report


def materialize_safety(job: dict, targets: list[dict], passed: set[str], root: Path) -> None:
    require(not root.exists(), f"refusing safety overwrite: {root}")
    require(bool(passed), "no PASS works to publish")
    works = {w["workId"]: w for w in job["works"]}
    rows = []
    for ordinal, target in enumerate(sorted((t for t in targets if t["workId"] in passed), key=lambda t: t["workId"]), 1):
        work = works[target["workId"]]
        identity = work["identitySourceUrl"] if job["schemaVersion"] == single.FROZEN_JOB else next((e["sourceUrl"] for e in work["evidence"] if e["targetType"] == "work" and e["sourceUrl"]), "")
        rows.append(dict(zip(publisher.SAFETY_TARGET_FIELDS, (str(ordinal), target["batchId"], target["ordinal"], "PASS", target["workId"], target["title"], identity, target["representativeIsbn"], work["safety"]["claim"]["evidenceIds"], target["packetDigest"], "true", "false"))))
    write_csv(root / "targets.csv", publisher.SAFETY_TARGET_FIELDS, rows)
    write_csv(root / "chunks/chunk-01.csv", publisher.SAFETY_TARGET_FIELDS, rows)
    write_json(root / "BUILD-REPORT.json", {"schemaVersion": "safety-recheck-v1-build", "targetCount": len(rows), "candidateOnly": True, "reviewedByHuman": False})
    stage = "adjudicated after input freeze" if job["schemaVersion"] == single.FROZEN_JOB else "validated before input freeze"
    write_text(root / "BUILD-REPORT.md", f"# Safety binding\n\nExplicit safety observations and decisions, {stage}, bound only to actual Factor PASS targets.")
    write_text(root / "SCHEMA.md", "# Safety contract\n\nExisting safety-recheck-v1 schema. Exact work, ISBN and frozen packet digest binding; no safety inferred from Factor PASS.")
    manifest(root)
    chunk = root / "chunks/chunk-01"
    evidence = sorted([e for wid in passed for e in works[wid]["safety"]["evidence"]], key=lambda e: (e["workId"], e["evidenceId"]))
    claims = [works[wid]["safety"]["claim"] for wid in sorted(passed)]
    write_csv(chunk / "evidence.csv", publisher.SAFETY_EVIDENCE_FIELDS, evidence)
    write_csv(chunk / "claims.csv", publisher.SAFETY_CLAIM_FIELDS, claims)
    write_json(chunk / "REVIEW.json", {"schemaVersion": "safety-recheck-v1-review", "chunkId": "chunk-01", "targetCount": len(passed), "safeCount": len(passed), "blockedSafetyCount": 0, "verdict": "PASS", "reviewMethod": "authorizedEvidencePanel", "candidateOnly": True, "reviewedByHuman": False, "grokUsed": False, "targetWorkIds": sorted(passed), "issues": []})
    write_text(chunk / "REPORT.md", "# Safety review\n\nExplicit adjudication claims and same-work affirmative source observations are preserved in claims.csv and evidence.csv. Human review is not claimed.")
    manifest(chunk)


def expand_decisions(value: dict, chunk: Path, targets: list[dict], authority: dict, input_digest: str) -> list[dict]:
    """Project explicit decisions into the existing ledger; never choose a fact."""
    panel.exact_dict(value, {"schemaVersion", "inputManifestSha256", "works"}, "structured decisions")
    require(value["schemaVersion"] in {"factor-adjudication-v1", "factor-adjudication-v2"}, "unsupported decision format")
    compact_unknown = value["schemaVersion"] == "factor-adjudication-v2"
    require(value["inputManifestSha256"] == input_digest, "decisions must bind the exact frozen input")
    require(isinstance(value["works"], list), "decisions works must be a list")
    frozen, _, prior, _ = panel.indexes(chunk, targets, authority)
    target_ids, seen, ledger = {row["workId"] for row in targets}, set(), []
    fields = {"state", "value", "confidence", "evidenceIds", "entryScope", "observation", "limitation", "reasonCode"}

    def explicit_list(items, label):
        require(isinstance(items, list) and all(isinstance(item, str) and item and ";" not in item for item in items), f"invalid {label}")
        require(len(items) == len(set(items)), f"duplicate {label}")
        return items

    for work in value["works"]:
        panel.exact_dict(work, {"workId", "claims", "retainedClaims", "unknownGroups"}, "work decisions")
        wid = work["workId"]
        require(isinstance(wid, str) and wid in target_ids and wid not in seen, "duplicate or out-of-target decision work")
        seen.add(wid)
        claims = {}

        def add(fact_key, semantic):
            require(isinstance(fact_key, str), "decision factKey must be a string")
            panel.fact_kind(fact_key)
            require(fact_key not in claims, f"overlapping decision: {wid} {fact_key}")
            claims[fact_key] = {
                **{field: "" for field in panel.LEDGER_FIELDS}, **semantic,
                "workId": wid, "factKey": fact_key, "authorityKind": "authorizedEvidencePanelV1",
                "reviewedByHuman": "false", "candidateOnly": "true",
            }

        for fact_key in explicit_list(work["retainedClaims"], "retained claims"):
            original = prior.get((wid, fact_key))
            require(original is not None and original["decision"] == "accepted", f"retained claim is not in the frozen prior: {wid} {fact_key}")
            panel.require_prior_claim(original, authority)
            add(fact_key, {field: original[field] for field in panel.SEMANTIC_FIELDS})

        require(isinstance(work["claims"], list) and isinstance(work["unknownGroups"], list), "claims and unknownGroups must be lists")
        rows = []
        for claim in work["claims"]:
            panel.exact_dict(claim, fields | {"factKey"}, "new claim decision")
            require(not compact_unknown or claim["state"] != "unknown", "v2 unknown axes belong in unknownGroups")
            rows.append(claim)
        for group in work["unknownGroups"]:
            group_fields = (fields - {"state", "value", "confidence"}) | {"axes"}
            panel.exact_dict(group, group_fields - ({"evidenceIds"} if compact_unknown else set()), "explicit unknown group")
            axes = explicit_list(group["axes"], "unknown axes")
            require(bool(axes) and set(axes) <= set(panel.AXES), "unknown group requires explicit valid axes")
            rows.extend({"evidenceIds": [], **{key: val for key, val in group.items() if key != "axes"}, "factKey": "axis:" + axis,
                         "state": "unknown", "value": "", "confidence": ""} for axis in axes)
        for row in rows:
            require(all(isinstance(row[key], str) for key in fields - {"evidenceIds"}), "decision scalar fields must be strings")
            ids = explicit_list(row["evidenceIds"], "decision evidence IDs")
            if row["state"] == "unknown":
                panel.validate_unknown_evidence(ids, [], f"{wid} {row['factKey']}")
            urls = set()
            for evidence_id in ids:
                source = frozen.get(evidence_id)
                require(source is not None and source[0] == wid, f"missing or cross-work decision evidence: {wid} {evidence_id}")
                urls.add(source[1])
            decision = {"known": "accepted", "unknown": "explicitUnknown", "notApplicable": "notApplicable"}.get(row["state"])
            require(decision is not None, "invalid explicit decision state")
            add(row["factKey"], {**row, "evidenceIds": ";".join(ids), "citationUrls": ";".join(sorted(urls, key=panel.code_unit_key)), "decision": decision})
        require({key for key in claims if key.startswith("axis:")} == {"axis:" + axis for axis in panel.AXES}, f"decisions require all 17 explicit axes: {wid}")
        ledger.extend(claims.values())
    require(seen == target_ids, "decision target membership mismatch")
    return ledger


def seal_result(output: Path, ledger_path: Path | None, baseline: Path, registry_path: Path, *, decisions_path: Path | None = None, result_output: Path | None = None) -> dict:
    started = time.perf_counter()
    require((ledger_path is None) != (decisions_path is None), "seal-result requires exactly one ledger or decisions input")
    input_root = output / "panel-input"
    destination = output if result_output is None else result_output.resolve()
    if result_output is not None:
        require(not destination.exists(), f"refusing attempt overwrite: {destination}")
        require(not destination.is_relative_to(input_root.resolve()) and not output.resolve().is_relative_to(destination), "result attempt must not replace or modify frozen input")
    result_root = destination / "panel-result"
    require(not result_root.exists(), f"refusing result overwrite: {result_root}")
    info, chunks, digest = publisher.validate_input(input_root)
    require(len(chunks) == 1, "this data entry point emits one bounded chunk")
    publisher._verify_input_identities(input_root, baseline / "catalog-expanded.candidate.sqlite", registry_path, REPO)
    lineage = panel.read_json(input_root / "external-lineage.json")
    require(panel.sha256(baseline / "MANIFEST.sha256") == lineage["baselineManifestSha256"], "baseline lineage changed")
    chunk = chunks[0]
    artifact = panel.sha256(chunk / "CHUNK.sha256")
    targets = panel.read_csv(chunk / "targets.csv", panel.TARGET_FIELDS)
    ids = {t["workId"] for t in targets}
    authority = panel.load_prior_authority(
        input_root,
        baseline / "catalog-expanded.candidate.sqlite",
        work_ids=ids,
    )
    source_path = decisions_path or ledger_path
    source_digest = panel.sha256(source_path)
    if info["schemaVersion"] == single.INPUT:
        require(decisions_path is not None, "single-pass input requires structured v3 decisions")
        decision_value = single.read_decisions(decisions_path)
        job, factors, _ = single.project(input_root, decision_value)
        ledger = expand_decisions(factors, chunk, targets, authority, digest)
    else:
        ledger = expand_decisions(panel.read_json(decisions_path), chunk, targets, authority, digest) if decisions_path else panel.read_csv(ledger_path, panel.LEDGER_FIELDS)
        job = read_job(input_root / "authoring-job.json", recovery=bool(authority.get("recovery")))
    require({r["workId"] for r in ledger} == ids, "adjudicated ledger target membership mismatch")
    bound_claims = {(work["workId"], row["factKey"]) for work in job["works"] for key in ("priorClaims", "priorDecisions") for row in work[key]}
    for row in ledger:
        if (row["workId"], row["factKey"]) not in bound_claims and not row["authorityArtifactDigest"] and not row["citationSetDigest"]:
            canonicalize_new_claim(row)
        urls = row["citationUrls"].split(";") if row["citationUrls"] else []
        for field, expected in (("authorityArtifactDigest", artifact), ("citationSetDigest", panel.citation_digest(urls))):
            require(row[field] in {"", expected}, f"stale or conflicting adjudication binding: {row['workId']} {field}")
            row[field] = expected
    result = result_root / chunk.name
    if info["schemaVersion"] == single.INPUT:
        write_json(result / "adjudication.json", decision_value)
        write_csv(result / "recommendation-context-condition.csv", panel.CONTEXT_FIELDS, [work["context"] for work in job["works"]])
    write_csv(result / "evidence-panel-ledger.csv", panel.LEDGER_FIELDS, ledger)
    # Validate actual decisions before deriving any promotion or PASS summary.
    counts, blockers = panel.validate_ledger(chunk, result, targets, artifact, authority)
    contexts = single.contexts(chunk, result, targets, blockers, authority)
    exceptions = nt.from_input(input_root)
    if info["schemaVersion"] == single.INPUT:
        facts = publisher._backend_module()._baseline_facts(baseline / "catalog-expanded.candidate.sqlite")
        packets = {wid: panel.read_json(chunk / f"packets/{wid}/packet.json") for wid in ids}
        checked = {**job, "works": [work for work in job["works"] if not blockers[work["workId"]]]}
        validate_context_evidence(checked, facts, packets)
    summaries, promotions = [], []
    for wid in sorted(ids):
        passed = not blockers[wid]
        context = contexts[wid]
        summaries.append({"workId": wid, "outcome": "PASS" if passed else "BLOCKED", "blockerCodes": blockers[wid], "coverage": counts[wid], "recommendationEligible": passed, "libraryOnly": not passed})
        safety_blocked = "BLOCKED_SAFETY" in blockers[wid]
        promotions.append({"workId": wid, "adjudicationStatus": "recommendationVerified" if passed else "BLOCKED_SAFETY" if safety_blocked else "BLOCKED_FACTOR", "panelOutcome": "PASS" if passed else "BLOCKED", "panelBlockerCode": ";".join(blockers[wid]), "recommendationEligible": "true" if passed else "false", "libraryOnly": "false" if passed else "true", "annotationReviewMethod": "authorizedEvidencePanel", "reviewedByHuman": "false", "candidateOnly": "true", "recommendationContextCondition": "fulfilled-after-coverage-pass" if passed else "planned-after-coverage-pass", "contextEvidenceIds": context["evidenceIds"], "contextCitationUrls": context["citationUrls"], "reasonCode": nt.pass_reason(counts[wid], wid in exceptions) if passed else "BLOCKED_SAFETY" if safety_blocked else "FACTOR_COVERAGE_INCOMPLETE"})
    write_csv(result / "promotion-ledger.csv", panel.PROMOTION_FIELDS, promotions)
    shutil.copyfile(input_root / "PANEL-INPUT.sha256", result / "PANEL-INPUT.sha256")
    passed = {r["workId"] for r in summaries if r["outcome"] == "PASS"}
    write_json(result / "evidence-panel-summary.json", {"schemaVersion": "authorized-evidence-panel-v1", "batchId": info["batchId"], "chunkId": "01", "inputManifestSha256": digest, "chunkArtifactDigest": artifact, "targetCount": len(ids), "passCount": len(passed), "blockedCount": len(ids) - len(passed), "works": summaries})
    write_text(result / "authorized-evidence-panel-v1.md", "# Source-bound adjudication\n\nThe separately authored ledger records every axis and accepted tag, with exact source evidence, scope, observations and limitations. The compiler binds digests and derives coverage only; it does not decide values, fill unknowns or claim human review. Safety and publication remain distinct gates.")
    manifest(result, "PANEL-RESULT.sha256")
    validation = publisher.validate_bundle(input_root, result_root, authority["evidence"], authority)
    if passed:
        materialize_safety(job, targets, passed, destination / "safety-recheck-v1")
        publisher._load_safety(destination / "safety-recheck-v1", input_root, result_root)
    require(panel.sha256(source_path) == source_digest, "adjudication source changed during seal; partial output is not usable")
    report = {"status": "PASS", "stage": "RESULT_SEALED", "validation": validation, "works": summaries, "ledgerSourceSha256": source_digest if ledger_path else None, "adjudicationSourceKind": "structured-decisions" if decisions_path else "ledger", "adjudicationSourceSha256": source_digest, "resultManifestSha256": panel.sha256(result / "PANEL-RESULT.sha256"), "sealResultSeconds": time.perf_counter() - started, "semanticReviewSeconds": None, "published": False}
    report.update(frozenOutputRoot=str(output.resolve()), inputManifestSha256=digest)
    write_json(destination / "PREPARATION-REPORT.json", report)
    manifest(destination)
    return report


def canonicalize_new_claim(row: dict) -> None:
    """Serialize sets, never choose values, evidence membership or missing axes."""
    for field in ("evidenceIds", "citationUrls"):
        row[field] = ";".join(sorted(panel.split_list(row[field], field, require_sorted=False), key=panel.code_unit_key))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("freeze", "seal-result", "publish", "restore-retained"))
    parser.add_argument("--baseline-root", type=artifact_path)
    parser.add_argument("--registry", type=input_file)
    parser.add_argument("--output-root", type=artifact_path, required=True)
    parser.add_argument("--result-output-root", type=artifact_path, help="New result attempt using --output-root's unchanged frozen input; use the same path when publishing")
    parser.add_argument("--job", type=input_file)
    adjudication = parser.add_mutually_exclusive_group()
    adjudication.add_argument("--ledger", type=input_file)
    adjudication.add_argument("--decisions", type=input_file, help="Explicit factor-adjudication-v1/v2 JSON projected into the complete existing ledger")
    parser.add_argument("--provenance-root", type=artifact_path, action="append", help="Repeat for explicitly bound completed collections; direct research collections are discovered and verified")
    parser.add_argument("--publication-root", type=artifact_path)
    parser.add_argument("--prior-bundle", type=artifact_path, action="append", default=[])
    parser.add_argument("--recovery-epoch", type=input_file)
    parser.add_argument("--frozen-baseline-root", type=artifact_path)
    parser.add_argument("--frozen-registry", type=input_file)
    parser.add_argument("--reviewed-at")
    parser.add_argument("--retained-authority-request", type=input_file)
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    required = {"freeze": ("job", "baseline_root"), "seal-result": (),
                "publish": ("baseline_root", "publication_root", "reviewed_at"),
                "restore-retained": ("baseline_root", "retained_authority_request")}
    missing = ["--" + field.replace("_", "-") for field in required[args.action] if not getattr(args, field)]
    if missing:
        parser.error(f"{args.action} requires {', '.join(missing)}")
    if args.action == "seal-result" and not (args.ledger or args.decisions):
        parser.error("seal-result requires --ledger or --decisions")
    if args.decisions and args.action != "seal-result":
        parser.error("--decisions is a seal-result input")
    if args.result_output_root and args.action not in {"seal-result", "publish"}:
        parser.error("--result-output-root is only a seal-result or publish input")
    if args.action in {"seal-result", "publish"}:
        # The frozen input already owns this identity; do not ask an operator
        # to reconstruct it from whichever candidate is current today.
        try:
            lineage = panel.read_json(args.output_root / "panel-input/external-lineage.json")
            frozen_root, frozen_registry = artifact_path(lineage["baselineRoot"]), artifact_path(lineage["registryPath"])
        except (OSError, ValueError, KeyError, TypeError) as error:
            parser.error(f"cannot resolve frozen pair: {error}")
        if args.action == "seal-result":
            if args.baseline_root is not None and args.baseline_root.resolve() != frozen_root.resolve():
                parser.error(f"seal-result requires its frozen baseline {frozen_root}; omit --baseline-root to use it")
            args.baseline_root = frozen_root
            args.registry = args.registry or frozen_registry
        else:
            args.frozen_baseline_root = args.frozen_baseline_root or frozen_root
            args.frozen_registry = args.frozen_registry or frozen_registry
    sys.dont_write_bytecode = True
    sys.path.insert(0, str(REPO / "scripts"))
    from catalog_workspace import record_arguments
    recorded = record_arguments(Path(__file__), args)
    if recorded is not None:
        return recorded
    baseline, output = args.baseline_root.resolve(), args.output_root.resolve()
    registry = (args.registry or baseline / "catalog-source-registry.candidate.sqlite").resolve()
    started = time.perf_counter()
    try:
        require(args.recovery_epoch is None or args.action == "freeze", "--recovery-epoch is a freeze input; seal/publish use its frozen declaration")
        if args.action == "freeze":
            require(not args.validate_only and args.retained_authority_request is None, "freeze does not accept retained validation inputs")
            require(args.job is not None, "freeze requires --job")
            result = freeze(args.job, baseline, registry, output, args.provenance_root, tuple(args.prior_bundle), args.recovery_epoch)
        elif args.action == "seal-result":
            require(not args.validate_only and args.retained_authority_request is None, "seal-result does not accept retained validation inputs")
            result = seal_result(output, args.ledger, baseline, registry, decisions_path=args.decisions, result_output=args.result_output_root)
        elif args.action == "publish":
            require(not args.validate_only and args.retained_authority_request is None, "publish does not accept retained validation inputs")
            require(args.publication_root is not None and bool(args.reviewed_at), "publish requires --publication-root and --reviewed-at")
            sealed = args.result_output_root.resolve() if args.result_output_root else output
            publisher._verify_result_manifest(sealed)
            if args.result_output_root:
                receipt = panel.read_json(sealed / "PREPARATION-REPORT.json")
                require(receipt.get("stage") == "RESULT_SEALED" and receipt.get("frozenOutputRoot") == str(output) and receipt.get("inputManifestSha256") == panel.sha256(output / "panel-input/PANEL-INPUT.sha256"), "result attempt does not bind this frozen input")
            frozen = args.frozen_baseline_root / "catalog-expanded.candidate.sqlite" if args.frozen_baseline_root else None
            result = publisher.publish_batch(output / "panel-input", sealed / "panel-result", baseline / "catalog-expanded.candidate.sqlite", registry, sealed / "safety-recheck-v1", args.publication_root, args.reviewed_at, frozen, args.frozen_registry)
        else:
            require(args.retained_authority_request is not None, "restore-retained requires --retained-authority-request")
            require(args.job is None and args.ledger is None and not args.prior_bundle and args.provenance_root is None and args.frozen_baseline_root is None and args.frozen_registry is None and args.reviewed_at is None, "restore-retained accepts only its request and current baseline pair")
            current_catalog = baseline / "catalog-expanded.candidate.sqlite"
            if args.validate_only:
                validated = publisher.validate_retained_authority(
                    args.retained_authority_request, current_catalog, registry
                )
                result = {
                    "status": "PASS", "mode": "retained-authority-preflight",
                    "workId": validated["workId"],
                    "originalAuthorityRecovered": False,
                }
            else:
                require(args.publication_root is not None, "restore-retained publication requires --publication-root")
                result = publisher.publish_retained_authority(
                    args.retained_authority_request, current_catalog, registry,
                    args.publication_root,
                )
        print(json.dumps({"action": args.action, "elapsedSeconds": time.perf_counter() - started, **result}, ensure_ascii=False))
        return 0
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(json.dumps({"status": "BLOCKED", "action": args.action, "elapsedSeconds": time.perf_counter() - started, "error": str(error), "partialOutputPreserved": output.exists()}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
