"""Locate preserved artifact references without filesystem links or rewriting bytes."""
from pathlib import Path
from functools import lru_cache
import json


@lru_cache(maxsize=16)
def restored_origins(repo: Path) -> tuple[Path, ...]:
    marker = repo / ".catalog-restore.json"
    if not marker.is_file():
        return ()
    value = json.loads(marker.read_text(encoding="utf-8"))
    if value.get("schemaVersion") != "catalog-restored-workspace-v1":
        raise ValueError("Unknown authoring restore mapping")
    roots = tuple(Path(item) for item in value["originalRepositories"])
    if any(not root.is_absolute() for root in roots):
        raise ValueError("Invalid authoring restore origin")
    return roots

REPO = Path(__file__).resolve().parents[1]
# Known moved roots also resolve when the entire working copy needs recovery.
MOVED_WORKSPACE_ROOTS = {
    'authoring-optimization-20260912',
    'banner-placement-20260911',
    'catalog-expansion-continuation-20260902',
    'catalog-expansion-continuation-20260912',
    'catalog-followup',
    'catalog-storage-verification-20260909',
    'compatibility-counts-20260911',
    'compatibility-implementation-20260911',
    'detail-information-20260911',
    'detail-related-cards-20260911',
    'implementation-continuation-20260915T024613Z',
    'library-management-20260911',
    'library-ux-audit-20260911',
    'local',
    'mobile-quick-preview-20260910',
    'optimization-restored-20260914',
    'popular-discovery-20260911',
    'prepared-resume-improvement-20260915T031306Z',
    'publisher-metadata-push-20260912',
    'taste-implementation-20260912',
    'taste-plan-review-20260912',
    'taste-review-20260912',
    'verify-batch008',
    'whole-work-scope-20260912',
    'workspace-migration-20260912',
}


def artifact_path(value: str | Path, repo: Path = REPO) -> Path:
    path = Path(value)
    if not path.is_relative_to(repo):
        for original in restored_origins(repo):
            if original != repo and path.is_relative_to(original):
                path = repo / path.relative_to(original)
                break
    if path.is_relative_to(repo):
        relative = path.relative_to(repo)
        if relative.parts and relative.parts[0] not in {
            ".workspace", ".tmp", "handoff", "research", "R", "reviews", "konocomics-production-audit-agent-ready",
        }:
            return path  # Current storage/code paths have no legacy relocation.
    persistent = repo / "data/local/catalog-authoring"
    artifacts = persistent / "artifacts"
    mappings = {
        repo / ".workspace/catalog-authoring": persistent,
        repo / ".workspace/backups": persistent / "backups",
        repo / ".tmp/catalog-authoring": persistent,
        repo / ".tmp/backups": persistent / "backups",
        repo / ".tmp": artifacts,
        repo.parent / (repo.name + "-authoring-backups"): persistent / "backups",
    }
    for name in ("handoff", "research", "R/research", "reviews", "konocomics-production-audit-agent-ready"):
        mappings[repo / name] = artifacts / "local" / name
    for old, current in mappings.items():
        if path.is_relative_to(old):
            return current / path.relative_to(old)
    if path.is_relative_to(repo / ".workspace"):
        relative = path.relative_to(repo / ".workspace")
        if relative.parts and (relative.parts[0] in MOVED_WORKSPACE_ROOTS or (artifacts / relative.parts[0]).is_dir()):
            return artifacts / relative
        original = artifacts / "workspace-root-originals" / relative
        if original.is_file():
            return original
    return path
