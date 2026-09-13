"""Restore exact legacy directory aliases after copying the local .workspace."""
from pathlib import Path
import os
import subprocess

REPO = Path(__file__).resolve().parents[1]


def aliases(repo: Path = REPO) -> dict[Path, Path]:
    workspace = repo / ".workspace"
    paths = {
        repo / ".tmp": workspace,
        repo / "data/local/catalog-authoring": workspace / "catalog-authoring",
        repo.parent / (repo.name + "-authoring-backups"): workspace / "backups",
    }
    for name in ("handoff", "research", "R/research", "reviews", "konocomics-production-audit-agent-ready"):
        paths[repo / name] = workspace / "local" / name
    return paths


def is_workspace_alias(path: Path) -> bool:
    target = aliases().get(path)
    return target is not None and target.is_dir() and not any(
        p.is_symlink() or p.is_junction() for p in (target, *target.parents)
    ) and path.resolve() == target.resolve()


def restore_links(repo: Path = REPO) -> None:
    for path, target in aliases(repo).items():
        if not target.is_dir():
            continue
        if path.exists() or path.is_symlink() or path.is_junction():
            if (path.is_symlink() or path.is_junction()) and path.resolve() == target.resolve():
                continue
            raise FileExistsError(f"Existing path is not the expected workspace alias: {path}")
        path.parent.mkdir(parents=True, exist_ok=True)
        if os.name == "nt":
            quote = lambda p: "'" + str(p).replace("'", "''") + "'"
            subprocess.run(["powershell", "-NoProfile", "-Command",
                            f"$ErrorActionPreference='Stop'; New-Item -ItemType Junction -Path {quote(path)} -Target {quote(target)} | Out-Null"], check=True)
        else:
            path.symlink_to(target, target_is_directory=True)
        if path.resolve() != target.resolve():
            raise ValueError(f"Workspace alias readback failed: {path}")
        print(f"{path} -> {target}")


if __name__ == "__main__":
    restore_links()
