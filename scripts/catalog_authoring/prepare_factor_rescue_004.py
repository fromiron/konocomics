#!/usr/bin/env python3
"""Freeze the bounded two-work Batch 013 claim correction and re-adjudication."""

from __future__ import annotations

import argparse
import json
import shutil
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path

import publish_factor_batch as publisher
import validate_factor_panel as panel
from prepare_ready_safety import manifest, write_csv, write_json


from authoring_paths import REPO, ROOT, LEGACY, artifact_path
BATCH = ROOT / "batches/factor-rescue-004"
BASELINE = ROOT / "runs/identity-resolution-001-022-publication-20260906-artifact-handoff-v1"
OLD = ROOT / "batches/factor-rescue-002"
RESEARCH = ROOT / "research/factor-rescue-004/complete-entry-a-20260906.jsonl"
MARRIAGE = "work-1f836f8114e8e6fc60dc"
AZUMANGA = "work-bc8e807c1cb6b65e509e"
TARGET_CHUNKS = {MARRIAGE: "chunk-20", AZUMANGA: "chunk-04"}
BATCH_ID = "013"
FROZEN_AT = datetime.now(timezone.utc).isoformat(timespec="seconds")
EXPECTED_CANONICAL = "78888710f280f9a10ab3f93f94c63ea80e897c4fc4cff9416c9ef33fb618f83b"
EXPECTED_CATALOG = "e0af2e401cfeaae56c6819a739020b9ed9730fdd4209e82a340e3cf66171fdc9"
EXPECTED_REGISTRY = "a2e51307d6e9104ab1e07b7a0544a9aa4d87116b382deec139b482f9b165391f"
URLS = (
    "https://e-comi.shogakukan.co.jp/books/098606480000d0000000",
    "https://e-comi.shogakukan.co.jp/books/098607590000d0000000",
    "https://e-comi.shogakukan.co.jp/books/098608800000d0000000",
)
AD_URL = "https://adpocket.shogakukan.co.jp/mangaplanning/detail/0dfcebf485c29dd65394538204a5c43821de1e5517712413f44962c1422b3489/"
CONTRACTS = {
    "factorDictionary": ("docs/factors/factor-dictionary.md", "factor-dictionary.md"),
    "annotationGuide": ("docs/factors/annotation-guide.md", "annotation-guide.md"),
    "authorizedEvidencePanel": ("docs/catalog-expansion/02-authorized-evidence-panel-v1.md", "02-authorized-evidence-panel-v1.md"),
    "authoringAuthority": ("docs/planning/09-catalog-authoring-authority.md", "09-catalog-authoring-authority.md"),
}

# These are the completed source-based adjudications, not collector values.
# Sources 0..2 are the official volume 1..3 descriptions; 3 corroborates the setting.
DECISIONS = {
    "problemSolving": ("2", "0.83", (0, 1, 2),
        "Volumes 1-3 show a concrete response to the singles-first overseas assignment rule: the two agree to pretend to marry and act on the arrangement, while family visits and emotional reactions also shape their responses. This combines a devised solution with direct action.",
        "The blurbs do not document a recurring detailed analysis-and-clever-solution process; the 4 anchor is unsupported. No outcome for the separate work assignment is invented."),
    "strategy": ("2", "0.90", (0, 1, 2),
        "Volume 1 introduces a plan to preserve the protagonists' separate lives under an overseas assignment rule; volumes 2-3 explicitly confirm their agreement to pretend to marry and its continuation. A concrete bounded plan exists and is being carried out.",
        "A 365-day premise does not establish long-term strategic management. War, politics and resource-operation centrality are not observed."),
    "pacing": ("2", "0.82", (0, 1, 2),
        "The official entry-volume sequence moves from the marriage-plan setup in volume 1 to family and work complications in volume 2, then an Aso visit and a relationship event in volume 3. These are ordinary volume/arc-level changes of situation.",
        "The summaries do not expose scene intervals, so they cannot establish frequent rapid large changes at the 4 anchor."),
    "worldBuilding": ("2", "0.91", (0, 1, 3),
        "The travel agency's singles-first overseas assignment rule creates the opening constraint and motivates the fake-marriage plan. Family expectations and work duties remain functional conditions in volume 2. The official series account corroborates these employment and marriage systems as the setting's basis.",
        "Only the series account's setting statements corroborated by entry volumes are used; later cohabitation episodes are excluded. Functional setting supports 2, not repeated history/culture/faction system centrality at 4."),
    "characterArcWeight": ("4", "0.88", (0, 1, 2),
        "The entry descriptions repeatedly center the pair's desire to preserve solitary lives, their private denial of emerging feelings and their confused romantic interaction. Their motivations and changing relationship supply the advertised narrative rewards in all three volumes.",
        "This describes the centrality of character motivation and relationships, not a skill/growth reward or a completed character transformation."),
    "relationshipStructure": ("2", "0.94", (0, 1, 2),
        "The same two protagonists form the ongoing core across volumes 1-3; family involvement complicates their arrangement in volume 2 and the pair visit Takuya's family region in volume 3. This is a fixed pair with recurring supporting relations.",
        "Additional family involvement does not establish a multiple-viewpoint ensemble or a complex relationship network at the 4 anchor."),
    "mentalStress": ("2", "0.90", (1, 2),
        "Volume 2 explicitly combines family and high-stakes work pressure with low self-confidence; volume 3 repeats self-directed restraint and confusion about feelings. Tension and frustration are present together.",
        "The sources do not establish sustained breakdown or dominating psychological pressure at 4. No darkness value is inferred from these pressures."),
    "romance": ("4", "0.96", (1, 2),
        "Volumes 2-3 focus on the pair trying not to misunderstand their feelings under the fake-marriage agreement; volume 3 promotes an emotionally charged romantic interaction as its principal scene. Romance is central to the main relationship and developments.",
        "The judgement uses the entry descriptions, not later relationship outcomes or the genre label alone. Romantic centrality does not establish emotional warmth."),
}


def write_text(path: Path, value: str) -> None:
    path.write_text(value.rstrip("\n") + "\n", encoding="utf-8", newline="\n")


def coverage(rows: list[dict[str, str]], work_id: str) -> tuple[dict[str, int], list[str]]:
    keys = {row["factKey"] for row in rows if row["workId"] == work_id and row["state"] == "known"}
    counts = {
        "genreCount": sum(key.startswith("genre:") for key in keys),
        "themeCount": sum(key.startswith("theme:") for key in keys),
        "narrativeKnown": sum(f"axis:{axis}" in keys for axis in panel.NARRATIVE),
        "toneKnown": sum(f"axis:{axis}" in keys for axis in panel.TONE),
        "artKnown": sum(f"axis:{axis}" in keys for axis in panel.ART),
    }
    blockers = sorted(code for field, minimum, code in (
        ("genreCount", 1, "GENRE_COVERAGE_MISSING"), ("themeCount", 1, "THEME_COVERAGE_MISSING"),
        ("narrativeKnown", 4, "NARRATIVE_COVERAGE_INCOMPLETE"), ("toneKnown", 5, "TONE_COVERAGE_INCOMPLETE"),
    ) if counts[field] < minimum)
    return counts, blockers


def research_rows() -> list[dict[str, object]]:
    records = [json.loads(line) for line in RESEARCH.read_text(encoding="utf-8").splitlines() if line]
    matches = [row for row in records if row["workId"] == MARRIAGE]
    assert len(matches) == 1
    sources = matches[0]["sources"]
    assert [source["sourceUrl"] for source in sources] == list(URLS)
    converted = []
    for number, source in enumerate(sources, 1):
        assert source["sourceType"] == "publisher" and source["entryScope"] == f"volume_{number}"
        converted.append({
            "url": source["sourceUrl"], "sourceFamily": "publisher", "language": "ja",
            "entryScope": "entry_1_3_volumes", "workOwned": True, "independentFrom": [],
            "observation": f"Direct source scope: volume {number} only. {source['observation']}",
            "limitation": f"This source does not individually observe all three volumes. {source['limitation']}",
            "claimCandidates": [],
        })
    converted.append({
        "url": AD_URL, "sourceFamily": "publisher", "language": "ja", "entryScope": "entry_1_3_volumes",
        "workOwned": True, "independentFrom": [], "claimCandidates": [],
        "observation": "Series-level official setting corroboration, cross-bound to volumes 1-2: the travel agency's singles-first overseas assignment rule prompts the protagonists to plan a fake marriage; employment and marriage systems are functional conditions of the story.",
        "limitation": "The original page covers the series. Only setting statements also explicitly present in the official entry-volume descriptions are used. The undated cohabitation and later relationship progression statements are excluded.",
    })
    shared = {"schemaVersion": "factor-evidence-collector-v1", "candidateOnly": True, "reviewedByHuman": False, "grokUsed": False, "paidSourceUsed": False}
    return [
        {**shared, "workId": MARRIAGE, "status": "EVIDENCE_FOUND", "sources": converted,
         "remainingGaps": ["No observed comedy frequency or emotional-warmth pattern; progression, mysteryReveal and darkness remain unknown; Art not reviewed."],
         "notes": "The collector observations were corrected against the source before freezing. Numeric decisions are separate. This is non-human re-adjudication, not a blind retag."},
        {**shared, "workId": AZUMANGA, "status": "BLOCKED", "sources": [],
         "remainingGaps": ["The prior darkness and mentalStress claims used absence in a synopsis, not an observed low level."],
         "notes": "Bounded withdrawal of two insufficient prior claims only. No new observation or numeric claim is manufactured; other prior claims are preserved without certifying their semantic correctness."},
    ]


def empty_safety(root: Path) -> None:
    chunk = root / "chunks/chunk-01"
    chunk.mkdir(parents=True)
    write_csv(root / "targets.csv", publisher.SAFETY_TARGET_FIELDS, [])
    write_csv(root / "chunks/chunk-01.csv", publisher.SAFETY_TARGET_FIELDS, [])
    write_csv(chunk / "evidence.csv", publisher.SAFETY_EVIDENCE_FIELDS, [])
    write_csv(chunk / "claims.csv", publisher.SAFETY_CLAIM_FIELDS, [])
    write_json(chunk / "REVIEW.json", {
        "schemaVersion": "safety-recheck-v1-review", "chunkId": "chunk-01", "targetCount": 0,
        "safeCount": 0, "blockedSafetyCount": 0, "verdict": "PASS", "reviewMethod": "authorizedEvidencePanel",
        "candidateOnly": True, "reviewedByHuman": False, "grokUsed": False, "targetWorkIds": [], "issues": [],
    })
    write_text(chunk / "REPORT.md", "# Empty safety assignment\n\nFactor PASS membership is empty. No work is adjudicated SAFE, and no new recommendation eligibility is granted.")
    manifest(chunk, "MANIFEST.sha256")
    write_json(root / "BUILD-REPORT.json", {"schemaVersion": "safety-recheck-v1-build", "targetCount": 0, "candidateOnly": True, "reviewedByHuman": False})
    write_text(root / "BUILD-REPORT.md", "# Safety membership\n\nThe two factor targets remain BLOCKED. The safety target set is exactly the empty factor PASS set. This validates empty membership, not either work's safety.")
    schema = (BASELINE / "safety-recheck-v1/SCHEMA.md").read_text(encoding="utf-8")
    schema = schema.replace("for the 177 works in `targets.csv`", "for the works in `targets.csv` (zero in this bounded correction artifact)")
    schema = schema.split("```powershell\npython .\\tools\\validate_safety_recheck.py", 1)[0] + "Validation uses the existing publish_factor_batch.py --validate-only safety adapter, which binds the exact target count and digest before invoking the unchanged safety validator.\n"
    write_text(root / "SCHEMA.md", schema)
    members = sorted(("BUILD-REPORT.json", "BUILD-REPORT.md", "SCHEMA.md", "targets.csv", "chunks/chunk-01.csv"))
    write_text(root / "MANIFEST.sha256", "\n".join(f"{panel.sha256(root / name)}  {name}" for name in members))


def prepare() -> None:
    assert panel.sha256(REPO / "data/source/catalog.sqlite") == EXPECTED_CANONICAL
    assert panel.sha256(BASELINE / "catalog-expanded.candidate.sqlite") == EXPECTED_CATALOG
    assert panel.sha256(BASELINE / "catalog-source-registry.candidate.sqlite") == EXPECTED_REGISTRY
    panel.verify_manifest(BASELINE, BASELINE / "MANIFEST.sha256", {path.relative_to(BASELINE).as_posix() for path in BASELINE.rglob("*") if path.is_file() and path != BASELINE / "MANIFEST.sha256"})
    # ponytail: two adjudicated works only; select another reviewed cohort in a new batch.
    research = research_rows()
    if BATCH.exists():
        raise ValueError(f"Refusing to overwrite existing immutable batch: {BATCH}")
    input_root, result_root, safety_root = BATCH / "panel-input", BATCH / "panel-result", BATCH / "safety-recheck-v1"
    chunk, result = input_root / "chunks/chunk-01", result_root / "chunk-01"
    chunk.mkdir(parents=True)
    result.mkdir(parents=True)
    (input_root / "contracts").mkdir()
    shutil.copytree(BASELINE, input_root / "baseline")
    for source, name in CONTRACTS.values():
        shutil.copyfile(REPO / source, input_root / "contracts" / name)
    write_json(input_root / "prior-authority.json", {"schemaVersion": "factor-prior-authority-v1", "bundles": [{"root": "baseline", "manifestSha256": panel.sha256(BASELINE / "MANIFEST.sha256")}]})
    with closing(sqlite3.connect(f"file:{(BASELINE / 'catalog-source-registry.candidate.sqlite').as_posix()}?mode=ro", uri=True)) as connection:
        connection.row_factory = sqlite3.Row
        cursor = connection.execute("select * from registry_source_rows where canonicalWorkId in (?,?) order by sourceOrdinal", tuple(TARGET_CHUNKS))
        fields = tuple(column[0] for column in cursor.description)
        registry = [{key: "" if value is None else str(value) for key, value in dict(row).items()} for row in cursor]
    assert {row["canonicalWorkId"] for row in registry} == set(TARGET_CHUNKS)
    write_csv(input_root / "source-registry.csv", fields, registry)
    targets, priors, rows, contexts = [], [], [], []
    for ordinal, (work_id, old_chunk) in enumerate(TARGET_CHUNKS.items(), 1):
        source_chunk = OLD / "panel-input/chunks" / old_chunk
        old_result = OLD / "panel-result" / old_chunk
        panel.verify_manifest(old_result, old_result / "PANEL-RESULT.sha256", panel.RESULT_FILES - {"PANEL-RESULT.sha256"})
        old_target = next(row for row in panel.read_csv(source_chunk / "targets.csv", panel.TARGET_FIELDS) if row["workId"] == work_id)
        selected = [dict(row) for row in panel.read_csv(old_result / "evidence-panel-ledger.csv", panel.LEDGER_FIELDS) if row["workId"] == work_id]
        assert len({row["factKey"] for row in selected if row["factKey"].startswith("axis:")}) == 17
        packet = chunk / "packets" / work_id
        shutil.copytree(source_chunk / "packets" / work_id, packet)
        counts, _ = coverage(selected, work_id)
        target = {**old_target, "batchId": BATCH_ID, "ordinal": str(ordinal), "narrativeKnown": str(counts["narrativeKnown"]), "toneKnown": str(counts["toneKnown"]), "genreKnown": str(counts["genreCount"]), "themeKnown": str(counts["themeCount"]), "missingRequiredClaims": str(max(0, 4-counts["narrativeKnown"]) + max(0, 5-counts["toneKnown"]) + int(not counts["genreCount"]) + int(not counts["themeCount"])), "priorPanelBatch": "011", "priorPanelOrdinal": old_target["ordinal"], "packetDigest": panel.sha256(packet / "PACKET.sha256")}
        targets.append(target)
        contexts.append(next(row for row in panel.read_csv(source_chunk / "recommendation-context-condition.csv", panel.CONTEXT_FIELDS) if row["workId"] == work_id))
        for row in selected:
            prior = {**{key: row[key] for key in panel.SEMANTIC_FIELDS}, "batchId": BATCH_ID, "ordinal": str(ordinal), "title": target["title"], "packetPath": target["packetPath"], "packetDigest": target["packetDigest"], "factType": row["factKey"].split(":")[0], "candidateOnly": "true", "reviewedByHuman": "false"}
            priors.append({key: prior[key] for key in panel.PRIOR_FIELDS})
        rows.extend(selected)
    write_csv(chunk / "targets.csv", panel.TARGET_FIELDS, targets)
    write_csv(chunk / "prior-panel-claims.csv", panel.PRIOR_FIELDS, priors)
    write_csv(chunk / "recommendation-context-condition.csv", panel.CONTEXT_FIELDS, contexts)
    write_text(chunk / "collector-research.jsonl", "\n".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) for row in research))
    write_text(chunk / "collector-report.md", "# Batch 013 근거 수집 범위\n\n결혼은 공식 1~3권 소개와 entry 설정에 한정한 공식 시리즈 보강 자료를 재확인했다. 아즈망가는 추가값 없이 기존 소개문 부재 추론 두 claim을 철회한다. 수집 힌트에는 숫자 판정을 넣지 않았다. 원문별 실제 관찰 범위는 observation과 limitation에 유지한다.")
    supplemental = []
    for source in research[0]["sources"]:
        digest = panel.sha256_bytes(json.dumps([BATCH_ID, MARRIAGE, source], ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))
        supplemental.append(dict(zip(panel.SUPPLEMENTAL_FIELDS, ("factor-evidence-collector-v1", "chunk-01", f"ev-fr004-{digest[:32]}", MARRIAGE, "work", MARRIAGE, "publisher", source["url"], "", "2026-09-06", source["entryScope"], source["observation"], source["limitation"], "", ""))))
    write_csv(chunk / "supplemental-evidence.csv", panel.SUPPLEMENTAL_FIELDS, supplemental)
    by_key = {(row["workId"], row["factKey"]): row for row in rows}
    for axis, (value, confidence, indices, observation, limitation) in DECISIONS.items():
        selected = [supplemental[index] for index in indices]
        urls = sorted({source["sourceUrl"] for source in selected}, key=panel.code_unit_key)
        by_key[(MARRIAGE, f"axis:{axis}")].update(state="known", value=value, confidence=confidence, evidenceIds=";".join(sorted(source["evidenceId"] for source in selected)), citationUrls=";".join(urls), entryScope="entry_1_3_volumes", observation=observation, limitation=limitation, decision="accepted", reasonCode="PANEL_REDERIVED_FROM_FROZEN_ENTRY_OBSERVATION", citationSetDigest=panel.citation_digest(urls))
    for work_id, axis in ((MARRIAGE, "comedy"), (AZUMANGA, "darkness"), (AZUMANGA, "mentalStress")):
        observation = "A comedy genre label and an awkward premise do not establish the actual frequency of gags in entry volumes." if work_id == MARRIAGE else "The prior observation inferred a low numerical value because the synopsis did not mention darkness or sustained psychological pressure. Omission is not an observed absence."
        by_key[(work_id, f"axis:{axis}")].update(state="unknown", value="", confidence="", evidenceIds="", citationUrls="", entryScope="entry_1_3_volumes", observation=observation, limitation="This bounded withdrawal does not establish a replacement numerical value. Other unrevisited prior claims are not newly certified.", decision="explicitUnknown", reasonCode="PRIOR_CLAIM_WITHDRAWN_INSUFFICIENT_ENTRY_OBSERVATION", citationSetDigest=panel.citation_digest([]))
    changes = []
    with closing(sqlite3.connect(f"file:{(BASELINE / 'catalog-expanded.candidate.sqlite').as_posix()}?mode=ro", uri=True)) as connection:
        connection.row_factory = sqlite3.Row
        for prior in priors:
            key = (prior["workId"], prior["factKey"])
            after = by_key[key]
            if prior["decision"] != "accepted" or panel.claim_semantic_digest(prior) == panel.claim_semantic_digest(after):
                continue
            baseline = dict(connection.execute("select * from source_factors where workId=? and axisId=?", (key[0], key[1].split(":")[1])).fetchone())
            changes.append(dict(zip(panel.DECISION_FIELDS, (key[0], key[1], panel.claim_semantic_digest(prior), panel.baseline_axis_digest(baseline), "WITHDRAW" if after["state"] == "unknown" else "REPLACE", panel.claim_semantic_digest(after), after["reasonCode"]))))
    changes.sort(key=lambda row: (row["workId"], row["factKey"]))
    assert len(changes) == 10 and sum(row["action"] == "WITHDRAW" for row in changes) == 3
    write_csv(input_root / "prior-claim-decisions.csv", panel.DECISION_FIELDS, changes)
    manifest(chunk, "CHUNK.sha256")
    digest = panel.sha256(chunk / "CHUNK.sha256")
    for row in rows:
        row["authorityArtifactDigest"] = digest
    rows.sort(key=lambda row: (row["workId"], row["factKey"]))
    write_csv(result / "evidence-panel-ledger.csv", panel.LEDGER_FIELDS, rows)
    panel_input = {"schemaVersion": "authorized-evidence-panel-followup-v2", "batchId": BATCH_ID, "frozenAt": FROZEN_AT, "targetCount": 2, "chunkCount": 1, "annotationReviewMethod": "authorizedEvidencePanel", "candidateOnly": True, "reviewedByHuman": False, "grokExcluded": True, "paidSourcesExcluded": True, "aniListAuthorizingEvidence": False, "collectorDecisionClaimsIncluded": False, "baselineCandidateSha256": EXPECTED_CATALOG, "registrySha256": EXPECTED_REGISTRY, "canonicalSha256": EXPECTED_CANONICAL, "goldManifestSha256": panel.sha256(REPO / "data/staging/catalog-expansion/gold-set-manifest.json"), "policyDigests": {key: panel.sha256(input_root / "contracts" / name) for key, (_, name) in CONTRACTS.items()}}
    write_json(input_root / "panel-input.json", panel_input)
    write_text(input_root / "PANEL-REQUEST.md", "# Authorized Evidence Panel batch 013\n\n두 작품의 bounded 재판정이다. 이전 accepted claim은 manifest-bound 원본으로 연결한다. prior-claim-decisions.csv의 정확한 prior/current/result digest에 결속된 Axis만 REPLACE/WITHDRAW한다. 새 known은 공식 same-work entry 근거에서 사전 0/2/4 기준으로 판정한다. 이전 결론·수집 힌트·승격 quota는 권한이 아니다. 초반 범위와 unknown/0 구분을 유지한다. 사람 검수나 블라인드 재태깅으로 표시하지 않는다.\n\n결혼의 7개 known을 재판정하고 comedy를 철회하며 strategy를 새 판정한다. 아즈망가는 darkness/mentalStress의 부재 추론을 철회하고 다른 prior는 보존한다. 모든 17 Axis를 출력하고 coverage와 context로 PASS/BLOCKED를 재계산한다. 필수 coverage 미달 작품에 SAFE 또는 추천 승격을 생성하지 않는다.")
    manifest(input_root, "PANEL-INPUT.sha256")
    shutil.copyfile(input_root / "PANEL-INPUT.sha256", result / "PANEL-INPUT.sha256")
    promotion, works = [], []
    by_context = {row["workId"]: row for row in contexts}
    for work_id in sorted(TARGET_CHUNKS):
        counts, blockers = coverage(rows, work_id)
        assert blockers
        works.append({"workId": work_id, "outcome": "BLOCKED", "blockerCodes": blockers, "coverage": counts, "recommendationEligible": False, "libraryOnly": True})
        promotion.append({"workId": work_id, "adjudicationStatus": "BLOCKED_FACTOR", "panelOutcome": "BLOCKED", "panelBlockerCode": ";".join(blockers), "recommendationEligible": "false", "libraryOnly": "true", "annotationReviewMethod": "authorizedEvidencePanel", "reviewedByHuman": "false", "candidateOnly": "true", "recommendationContextCondition": "planned-after-coverage-pass", "contextEvidenceIds": by_context[work_id]["evidenceIds"], "contextCitationUrls": by_context[work_id]["citationUrls"], "reasonCode": "FACTOR_COVERAGE_INCOMPLETE"})
    assert coverage(rows, MARRIAGE)[0]["narrativeKnown"] == 4 and all(work["coverage"]["toneKnown"] == 4 for work in works)
    write_csv(result / "promotion-ledger.csv", panel.PROMOTION_FIELDS, promotion)
    write_json(result / "evidence-panel-summary.json", {"schemaVersion": "authorized-evidence-panel-v1", "batchId": BATCH_ID, "chunkId": "01", "inputManifestSha256": panel.sha256(input_root / "PANEL-INPUT.sha256"), "chunkArtifactDigest": digest, "targetCount": 2, "passCount": 0, "blockedCount": 2, "works": works})
    write_text(result / "authorized-evidence-panel-v1.md", "# Batch 013 근거 재판정\n\n공식 초반권 원문으로 결혼의 Narrative 4 / Tone 4를 판정했다. 7개 prior Axis는 새 근거로 REPLACE, comedy는 WITHDRAW, strategy는 신규 known이다. 아즈망가는 darkness와 mentalStress의 소개문 부재 추론만 WITHDRAW했다. 다른 prior는 원본 의미를 보존했으며 재검수했다고 주장하지 않는다.\n\nPASS 0, BLOCKED 2. 둘 다 Tone coverage가 부족하고 아즈망가는 Narrative도 부족하다. unknown에 0을 부여하지 않고 Art는 평가하지 않았다. 비인간 판정이며 이전 점수 노출이 있어 블라인드 재태깅이 아니다. 원본·canonical DB는 변경하지 않았다.")
    manifest(result, "PANEL-RESULT.sha256")
    empty_safety(safety_root)
    report = panel.validate(input_root, result_root)
    safety = publisher._load_safety(safety_root, input_root, result_root)
    assert report["passCount"] == 0 and report["blockedCount"] == 2 and safety["validation"]["safeCount"] == 0
    assert panel.sha256(REPO / "data/source/catalog.sqlite") == EXPECTED_CANONICAL
    write_json(BATCH / "PREPARATION-REPORT.json", {"status": "PASS", "candidateOnly": True, "canonicalDatabaseWritten": False, "panel": report, "safety": safety["validation"], "priorCorrectionCount": len(changes), "inputManifestSha256": panel.sha256(input_root / "PANEL-INPUT.sha256"), "resultManifestSha256": panel.sha256(result / "PANEL-RESULT.sha256")})
    print(json.dumps({"status": "PASS", "batchRoot": str(BATCH), **report}, ensure_ascii=False))


def self_check() -> None:
    rows = [{"workId": MARRIAGE, "factKey": f"axis:{axis}", "state": "known"} for axis in DECISIONS]
    rows += [{"workId": MARRIAGE, "factKey": "genre:romance", "state": "known"}, {"workId": MARRIAGE, "factKey": "theme:workplace", "state": "known"}]
    counts, blockers = coverage(rows, MARRIAGE)
    assert (counts["narrativeKnown"], counts["toneKnown"], blockers) == (4, 4, ["TONE_COVERAGE_INCOMPLETE"])
    rows.append({"workId": MARRIAGE, "factKey": "axis:comedy", "state": "unknown"})
    assert coverage(rows, MARRIAGE) == (counts, blockers)
    assert set(DECISIONS) == {"problemSolving", "strategy", "pacing", "worldBuilding", "characterArcWeight", "relationshipStructure", "mentalStress", "romance"}
    print("PASS: unknown claims do not close coverage; the reviewed 2-work scope remains bounded.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--seal", action="store_true", help="Freeze the reviewed inputs and results once; refuses existing output.")
    parser.add_argument("--self-check", action="store_true")
    args = parser.parse_args()
    self_check()
    if args.seal:
        prepare()
