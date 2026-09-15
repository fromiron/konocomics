"""Incident-scoped, manifest-bound replacement authority; never a missing-prior fallback."""
from __future__ import annotations

import csv
import hashlib
import json
import re
import sqlite3
from contextlib import closing
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path

APPROVAL = "USER_APPROVED_RECOVERY_AND_ELIGIBILITY_DECLINE"
INITIAL = "d35b703eca8c1df366f1c60ad06c75ae659a87a25a102f02cfe034699d7de02f"
CANONICAL = "78888710f280f9a10ab3f93f94c63ea80e897c4fc4cff9416c9ef33fb618f83b"
REGISTRY = "5f355dee719c13bf8120880543d90b5bd6c7f7681594aeb290e077dc9728104f"
TABLES = ("source_works", "source_aliases", "source_volumes", "source_factors", "source_themes", "source_evidence", "source_recommendation_context", "source_art_evidence_manifest")
SHA_RE = re.compile(r"[0-9a-f]{64}")
RETAINED_FIELDS = {
    "schemaVersion", "epochPath", "epochSha256", "workId",
    "originalBatchRoot", "originalBatchManifestSha256",
    "originalPublicationRoot", "originalPublicationManifestSha256",
    "originalCatalogSha256", "originalInputManifestSha256",
    "originalResultManifestSha256", "originalSafetyManifestSha256",
    "originalSafetyArtifactDigest", "originalSemanticSha256",
    "reviewReference", "reviewSha256", "registrySourceRowId",
    "registryRowSha256", "currentRootManifestSha256",
    "currentCatalogSha256", "currentRegistrySha256",
    "currentSemanticSha256", "canonicalSha256", "originalCanonicalSha256",
    "goldManifestSha256",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_json(path: Path) -> dict:
    if not path.is_file() or path.is_symlink():
        raise ValueError(f"recovery artifact missing or linked: {path}")
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"recovery artifact is not an object: {path}")
    return value


def target_snapshot(path: Path, work_id: str) -> dict:
    with closing(sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True)) as con:
        con.row_factory = sqlite3.Row
        tables = {}
        for table in TABLES:
            columns = [row[1] for row in con.execute(f'pragma table_info("{table}")')]
            if not columns:
                continue
            owner = "id" if table == "source_works" else "workId"
            semantic = [key for key in columns if key not in {"sourceOrdinal", "sourceLine"}]
            rows = [{key: row[key] for key in semantic} for row in con.execute(f'select * from "{table}" where "{owner}"=?', (work_id,))]
            tables[table] = sorted(rows, key=lambda row: json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    digest = hashlib.sha256(json.dumps(tables, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    return {"tables": tables, "sha256": digest}


def _registry_row(path: Path, source_row_id: str) -> dict:
    with closing(sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True)) as con:
        con.row_factory = sqlite3.Row
        rows = [dict(row) for row in con.execute(
            "select * from registry_source_rows where sourceRowId=?", (source_row_id,)
        )]
    if len(rows) != 1:
        raise ValueError(f"retained registry row missing or duplicated: {source_row_id}")
    return rows[0]


def _object_sha256(value: object) -> str:
    return hashlib.sha256(json.dumps(
        value, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")).hexdigest()


def validate_retained_request(
    request_path: Path,
    baseline: Path,
    registry: Path,
    canonical: Path,
    gold_manifest: Path,
) -> dict:
    """Bind a complete original authority to one quarantined current target.

    This validates identity and before/after equality only. The caller must also
    validate every original manifest, prior claim, sealed result, and safety
    artifact before publication.
    """

    value = read_json(request_path)
    if set(value) != RETAINED_FIELDS or value.get("schemaVersion") != "factor-loss-retained-authority-v1":
        raise ValueError("invalid retained authority request schema")
    work_id = value.get("workId")
    if not isinstance(work_id, str) or not re.fullmatch(r"work-[0-9a-f]{20}", work_id):
        raise ValueError("invalid retained authority work ID")
    for key in RETAINED_FIELDS - {
        "schemaVersion", "epochPath", "workId", "originalBatchRoot",
        "originalPublicationRoot", "reviewReference", "registrySourceRowId",
    }:
        if not isinstance(value.get(key), str) or not SHA_RE.fullmatch(value[key]):
            raise ValueError(f"invalid retained authority digest: {key}")
    roots = {}
    for key in ("epochPath", "originalBatchRoot", "originalPublicationRoot"):
        path = artifact_path(value[key])
        if not path.is_absolute() or path.is_symlink():
            raise ValueError(f"retained authority path is not absolute and regular: {key}")
        roots[key] = path.resolve()
    epoch_path = roots["epochPath"]
    if not epoch_path.is_file() or sha256(epoch_path) != value["epochSha256"]:
        raise ValueError("retained authority epoch binding mismatch")
    epoch = load_epoch(epoch_path)
    if epoch["scope"].get(work_id, {}).get("classification") != "authority-unresolved":
        raise ValueError(f"protected or out-of-scope retained target: {work_id}")
    original_canonical = artifact_path(str(epoch.get("originalCanonicalPath", "")))
    if not original_canonical.is_absolute() or not original_canonical.is_file() or original_canonical.is_symlink() or sha256(original_canonical) != value["originalCanonicalSha256"]:
        raise ValueError("retained original canonical binding mismatch")

    original_batch = roots["originalBatchRoot"]
    original_publication = roots["originalPublicationRoot"]
    bound_paths = {
        "originalBatchManifestSha256": original_batch / "MANIFEST.sha256",
        "originalPublicationManifestSha256": original_publication / "MANIFEST.sha256",
        "originalCatalogSha256": original_publication / "catalog-expanded.candidate.sqlite",
        "originalInputManifestSha256": original_batch / "panel-input/PANEL-INPUT.sha256",
        "originalResultManifestSha256": original_batch / "panel-result/chunk-01/PANEL-RESULT.sha256",
        "originalSafetyManifestSha256": original_batch / "safety-recheck-v1/MANIFEST.sha256",
        "currentRootManifestSha256": baseline.parent / "MANIFEST.sha256",
        "currentCatalogSha256": baseline,
        "currentRegistrySha256": registry,
        "canonicalSha256": canonical,
        "goldManifestSha256": gold_manifest,
    }
    for key, path in bound_paths.items():
        if not path.is_file() or path.is_symlink() or sha256(path) != value[key]:
            raise ValueError(f"retained authority artifact binding mismatch: {key}")
    if baseline.parent.resolve() != registry.parent.resolve():
        raise ValueError("retained current catalog and registry must be one publication pair")

    original = target_snapshot(bound_paths["originalCatalogSha256"], work_id)
    current = target_snapshot(baseline, work_id)
    if original["sha256"] != value["originalSemanticSha256"] or current["sha256"] != value["currentSemanticSha256"]:
        raise ValueError("retained target semantic binding mismatch")
    original_works = original["tables"].get("source_works", [])
    current_works = current["tables"].get("source_works", [])
    if len(original_works) != 1 or len(current_works) != 1:
        raise ValueError("retained target is missing or duplicated")
    before, authoritative = current_works[0], original_works[0]
    expected_quarantine = {
        "onboardingEligible": "false", "recommendationEligible": "false", "libraryOnly": "true"
    }
    expected_active = {
        "onboardingEligible": "true", "recommendationEligible": "true", "libraryOnly": "false"
    }
    if any(before.get(key) != expected for key, expected in expected_quarantine.items()):
        raise ValueError("retained current target is not exactly quarantined")
    if any(authoritative.get(key) != expected for key, expected in expected_active.items()):
        raise ValueError("retained original target was not recommendation eligible")
    if authoritative.get("annotationReviewMethod") != "authorizedEvidencePanel":
        raise ValueError("retained original target lacks authorizedEvidencePanel authority")
    projected = json.loads(json.dumps(current["tables"], ensure_ascii=False))
    projected["source_works"][0].update(expected_active)
    if projected != original["tables"]:
        raise ValueError("retained target differs beyond quarantine eligibility")

    reference = value.get("reviewReference")
    if not isinstance(reference, str) or not re.fullmatch(r"reviews/[a-z0-9-]+\.md", reference):
        raise ValueError("invalid retained review reference")
    if before.get("annotationReviewReference") != reference or authoritative.get("annotationReviewReference") != reference:
        raise ValueError("retained review reference changed")
    relative_review = Path("authorized-evidence-panel-v1/data/source") / reference
    for root in (baseline.parent, original_publication):
        review = root / relative_review
        if not review.is_file() or review.is_symlink() or sha256(review) != value["reviewSha256"]:
            raise ValueError("retained review artifact binding mismatch")

    source_row_id = value.get("registrySourceRowId")
    if not isinstance(source_row_id, str) or not source_row_id:
        raise ValueError("invalid retained registry source row ID")
    current_row = _registry_row(registry, source_row_id)
    with (original_batch / "panel-input/source-registry.csv").open(encoding="utf-8-sig", newline="") as stream:
        frozen_rows = [row for row in csv.DictReader(stream) if row.get("sourceRowId") == source_row_id]
    if len(frozen_rows) != 1 or {key: str(item) for key, item in current_row.items()} != frozen_rows[0]:
        raise ValueError("retained source registry identity changed")
    if current_row.get("canonicalWorkId") != work_id or _object_sha256(current_row) != value["registryRowSha256"]:
        raise ValueError("retained source registry row binding mismatch")

    gold = read_json(gold_manifest).get("workIds")
    if not isinstance(gold, list) or work_id in gold:
        raise ValueError("retained authority cannot target Gold")
    return {
        "request": value, "epoch": epoch, "workId": work_id,
        "originalBatchRoot": original_batch,
        "originalPublicationRoot": original_publication,
        "beforeSnapshot": current, "authoritativeSnapshot": original,
        "registryRow": current_row, "originalCanonicalPath": original_canonical,
    }


def load_epoch(path: Path) -> dict:
    epoch = read_json(path)
    expected = {"schemaVersion": "factor-loss-recovery-epoch-v1", "epochId": "factor-003-recovery-20260909-v1", "incidentId": "factor-rescue-003-v2-loss-20260909", "approval": APPROVAL, "initialCatalogSha256": INITIAL, "canonicalSha256": CANONICAL, "registrySha256": REGISTRY, "originalScopeComplete": False}
    if any(epoch.get(key) != value for key, value in expected.items()) or not all(isinstance(epoch.get(key), str) and epoch[key] for key in ("epochId", "incidentId")):
        raise ValueError("invalid incident recovery epoch/approval")
    repo = REPO
    policy = repo / "docs/catalog-expansion/04-loss-recovery-v1.md"
    if artifact_path(epoch.get("policyPath", "")).resolve() != policy.resolve() or sha256(policy) != epoch.get("policySha256"):
        raise ValueError("recovery policy binding mismatch")
    # The incident scope is historical; live canonical identity is bound separately
    # by prepare_factor_batch.freeze and publish_factor_batch._verify_input_identities.
    canonical = ROOT / "runs/canonical-promotion-20260910-v2/before/data/source/catalog.sqlite"
    if canonical.is_symlink() or sha256(canonical) != CANONICAL:
        raise ValueError("recovery original canonical identity changed")
    scope_path = artifact_path(epoch.get("scopePath", ""))
    if not scope_path.is_absolute() or scope_path.is_symlink() or sha256(scope_path) != epoch.get("scopeSha256"):
        raise ValueError("recovery scope binding mismatch")
    scope = {}
    for line in scope_path.read_text(encoding="utf-8").splitlines():
        row = json.loads(line)
        if not isinstance(row, dict) or set(row) != {"workId", "classification", "baselineSemanticSha256", "canonicalSemanticSha256"}:
            raise ValueError("invalid recovery scope row")
        work_id = row["workId"]
        if not isinstance(work_id, str) or not work_id or work_id in scope or row["classification"] not in {"protected-gold", "protected-legacy", "authority-unresolved"} or not re.fullmatch(r"[0-9a-f]{64}", str(row["baselineSemanticSha256"])):
            raise ValueError("invalid recovery scope membership")
        if row["classification"] != "authority-unresolved" and not re.fullmatch(r"[0-9a-f]{64}", str(row["canonicalSemanticSha256"])):
            raise ValueError("protected recovery scope lacks canonical identity")
        scope[work_id] = row
    if len(scope) != 3309:
        raise ValueError("recovery scope must classify all 3309 works")
    original = ROOT / "runs/continuation-factor-233-publication-20260909-v1/catalog-expanded.candidate.sqlite"
    if sha256(original) != INITIAL:
        raise ValueError("recovery original 233 identity changed")
    with closing(sqlite3.connect(f"file:{original.as_posix()}?mode=ro", uri=True)) as con:
        original_methods = dict(con.execute("select id,annotationReviewMethod from source_works"))
    with closing(sqlite3.connect(f"file:{canonical.as_posix()}?mode=ro", uri=True)) as con:
        canonical_ids = {row[0] for row in con.execute("select id from source_works where annotationReviewMethod != 'unreviewed'")}
    gold = set(read_json(repo / "data/staging/catalog-expansion/gold-set-manifest.json")["workIds"])
    if set(scope) != set(original_methods):
        raise ValueError("recovery scope IDs differ from original 233")
    for wid, row in scope.items():
        classification = "protected-gold" if wid in gold else "protected-legacy" if wid in canonical_ids else "authority-unresolved"
        if row["classification"] != classification:
            raise ValueError(f"recovery scope reclassifies protected work: {wid}")
    return {**epoch, "scope": scope, "originalCatalogPath": str(original), "originalCanonicalPath": str(canonical)}


def _manifest_member(root: Path, name: str, member: str) -> None:
    entries = {}
    for line in (root / name).read_text(encoding="ascii").splitlines():
        match = re.fullmatch(r"([0-9a-f]{64})  (.+)", line)
        if not match or match[2] in entries:
            raise ValueError("invalid recovery manifest")
        entries[match[2]] = match[1]
    path = root / member
    if path.is_symlink() or entries.get(member) != sha256(path):
        raise ValueError(f"recovery declaration is not manifest-bound: {path}")


def validate_input_context(input_root: Path, baseline: Path | None = None, work_ids: set[str] | None = None) -> dict | None:
    chunks = sorted((input_root / "chunks").glob("chunk-??"))
    declarations = [chunk / "recovery-declaration.json" for chunk in chunks]
    if not any(path.exists() for path in declarations):
        return None
    if not declarations or not all(path.is_file() for path in declarations):
        raise ValueError("recovery and ordinary chunks cannot be mixed")
    _manifest_member(input_root, "PANEL-INPUT.sha256", "external-lineage.json")
    lineage = read_json(input_root / "external-lineage.json")
    frozen_root = artifact_path(lineage["baselineRoot"]).resolve()
    if baseline is None:
        baseline = frozen_root / "catalog-expanded.candidate.sqlite"
    lost = ROOT / "batches/factor-rescue-003"
    missing_roots = {str((lost / name).resolve()) for name in ("panel-input-v2", "panel-result-v2")}
    snapshots, epoch_digest, epoch = {}, None, None
    for chunk, path in zip(chunks, declarations):
        _manifest_member(chunk, "CHUNK.sha256", path.name)
        _manifest_member(input_root, "PANEL-INPUT.sha256", f"chunks/{chunk.name}/CHUNK.sha256")
        value = read_json(path)
        if set(value) != {"schemaVersion", "epochPath", "epochSha256", "targets", "unavailableAuthorityRoots", "supersededAuthorityRoots"} or value["schemaVersion"] != "factor-loss-recovery-v1":
            raise ValueError("invalid recovery declaration schema")
        epoch_path = artifact_path(value["epochPath"])
        if not epoch_path.is_absolute() or sha256(epoch_path) != value["epochSha256"] or (epoch_digest is not None and epoch_digest != value["epochSha256"]):
            raise ValueError("recovery epoch binding mismatch")
        epoch_digest, epoch = value["epochSha256"], load_epoch(epoch_path)
        for field in ("unavailableAuthorityRoots", "supersededAuthorityRoots"):
            roots = value[field]
            if not isinstance(roots, list) or not roots or any(not isinstance(item, str) or not Path(item).is_absolute() for item in roots) or len(set(roots)) != len(roots):
                raise ValueError(f"invalid explicit recovery history: {field}")
        if {str(artifact_path(item).resolve()) for item in value["unavailableAuthorityRoots"]} != missing_roots or {str(artifact_path(item).resolve()) for item in value["supersededAuthorityRoots"]} != {str(frozen_root)}:
            raise ValueError("recovery history does not match explicit incident/frozen lineage")
        with (chunk / "targets.csv").open(encoding="utf-8-sig", newline="") as stream:
            targets = {row["workId"] for row in csv.DictReader(stream)}
        if not isinstance(value["targets"], list) or {row.get("workId") for row in value["targets"]} != targets or len(value["targets"]) != len(targets):
            raise ValueError("recovery target declaration membership mismatch")
        for target in value["targets"]:
            if set(target) != {"workId", "baselineSemanticSha256"}:
                raise ValueError("invalid recovery target binding")
            work_id = target["workId"]
            if work_id in snapshots or epoch["scope"].get(work_id, {}).get("classification") != "authority-unresolved":
                raise ValueError(f"protected or out-of-scope recovery target: {work_id}")
            if target_snapshot(artifact_path(epoch["originalCatalogPath"]), work_id)["sha256"] != epoch["scope"][work_id]["baselineSemanticSha256"]:
                raise ValueError(f"recovery original target scope binding mismatch: {work_id}")
            if not re.fullmatch(r"[0-9a-f]{64}", str(target["baselineSemanticSha256"])):
                raise ValueError("invalid recovery baseline digest")
            snapshot = target_snapshot(baseline, work_id) if baseline is not None else None
            if snapshot is not None:
                works = snapshot["tables"].get("source_works", [])
                if len(works) != 1 or works[0]["annotationReviewMethod"] not in {"unreviewed", "authorizedEvidencePanel"} or snapshot["sha256"] != target["baselineSemanticSha256"]:
                    raise ValueError(f"recovery frozen/current target mismatch: {work_id}")
            snapshots[work_id] = {"bindingSha256": target["baselineSemanticSha256"], "beforeSnapshot": snapshot, "epochId": epoch["epochId"], "epochSha256": epoch_digest, "unavailableAuthorityRoots": value["unavailableAuthorityRoots"], "supersededAuthorityRoots": value["supersededAuthorityRoots"]}
    if work_ids is not None and set(snapshots) != work_ids:
        raise ValueError("recovery requested target membership mismatch")
    if not 1 <= len(snapshots) <= 5:
        raise ValueError("recovery batch must contain 1 to 5 targets")
    return {"claims": {}, "evidence": {}, "recovery": snapshots, "epoch": epoch}


def validate_publish(input_root: Path, result_root: Path, frozen_baseline: Path, baseline: Path) -> dict:
    context = validate_input_context(input_root, frozen_baseline)
    if context is None:
        return {}
    validate_input_context(input_root, baseline, set(context["recovery"]))
    snapshots = context["recovery"]
    for work_id, item in snapshots.items():
        tables = item["beforeSnapshot"]["tables"]
        item.update(beforeFactors={row["axisId"]: row for row in tables["source_factors"]}, beforeThemes=tables["source_themes"], beforeGenres=tables["source_works"][0]["genres"])
    # The caller's ordinary panel validator checks the entire sealed result;
    # these snapshots grant replacement scope, never authority to result values.
    return snapshots


def build_declaration(epoch_path: Path, baseline: Path, work_ids: set[str]) -> dict:
    epoch = load_epoch(epoch_path)
    if not work_ids or any(epoch["scope"].get(work_id, {}).get("classification") != "authority-unresolved" for work_id in work_ids):
        raise ValueError("recovery declaration targets are protected or out of scope")
    lost = ROOT / "batches/factor-rescue-003"
    return {"schemaVersion": "factor-loss-recovery-v1", "epochPath": str(epoch_path.resolve()), "epochSha256": sha256(epoch_path),
            "targets": [{"workId": work_id, "baselineSemanticSha256": target_snapshot(baseline, work_id)["sha256"]} for work_id in sorted(work_ids)],
            "unavailableAuthorityRoots": [str(lost / "panel-input-v2"), str(lost / "panel-result-v2")],
            "supersededAuthorityRoots": [str(baseline.resolve().parent)]}
