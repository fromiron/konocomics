"""Locate preserved artifact references without filesystem links or rewriting bytes."""
from pathlib import Path, PurePath, PurePosixPath, PureWindowsPath
from functools import lru_cache
import json
import os
import re


def path_identity(value: str | PurePath) -> PurePath:
    """Parse a saved path without applying the current operating system's rules."""
    raw = str(value)
    components = raw.replace("\\", "/").split("/")
    if "\0" in raw or ".." in components or raw.startswith(("\\\\?\\", "\\\\.\\", "//?/", "//./")):
        raise ValueError("Invalid authoring artifact identity")
    if re.match(r"^[A-Za-z]:", raw) or raw.startswith(("\\\\", "//")):
        path = PureWindowsPath(raw)
        if not path.is_absolute() or any(":" in part for part in path.parts[1:]):
            raise ValueError("Invalid absolute authoring artifact identity")
        return path
    if raw.startswith("\\") or any(":" in part for part in components):
        raise ValueError("Invalid authoring artifact identity")
    return PurePosixPath(raw.replace("\\", "/"))


def absolute_identity(value: str | PurePath) -> PurePath:
    path = path_identity(value)
    if not path.is_absolute():
        raise ValueError("Invalid authoring restore origin")
    return path


@lru_cache(maxsize=16)
def restored_origins(repo: Path) -> tuple[PurePath, ...]:
    marker = repo / ".catalog-restore.json"
    if not marker.is_file():
        return ()
    value = json.loads(marker.read_text(encoding="utf-8"))
    if value.get("schemaVersion") != "catalog-restored-workspace-v1":
        raise ValueError("Unknown authoring restore mapping")
    if not isinstance(value.get("originalRepositories"), list) or any(
            not isinstance(item, str) for item in value["originalRepositories"]):
        raise ValueError("Invalid authoring restore origin")
    roots = tuple(absolute_identity(item) for item in value["originalRepositories"])
    # A restored repository may itself live inside an older repository. Resolve
    # its own saved paths against the most specific declared origin first.
    return tuple(sorted(roots, key=lambda root: len(root.parts), reverse=True))

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
    # STATE roots are repository-relative and can contain bounded parent steps.
    # Resolve these already-local joins lexically; saved foreign identities must
    # still pass the strict parser before any origin mapping.
    if isinstance(value, Path) and value.is_absolute() and value.is_relative_to(repo) and ".." in value.parts:
        value = Path(os.path.abspath(value))
        if not value.is_relative_to(repo):
            raise ValueError("Artifact path escapes its repository")
    identity = path_identity(value)
    current = absolute_identity(repo)
    origins = restored_origins(repo)
    if identity.is_relative_to(current):
        path = repo.joinpath(*identity.relative_to(current).parts)
    elif identity.is_absolute():
        original = next((root for root in origins if identity.is_relative_to(root)), None)
        if original is not None:
            path = repo.joinpath(*identity.relative_to(original).parts)
        elif origins or type(identity) is not type(current):
            raise ValueError("Artifact identity is outside its registered restore origins")
        else:
            path = Path(value)
    else:
        path = Path(*identity.parts)
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
