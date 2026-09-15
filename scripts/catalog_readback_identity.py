"""Readback execution inputs, shared by storage and the Python/Node runners."""
from pathlib import Path
import hashlib
import json
import re
import sys

ENTRY = "scripts/readback-catalog-authoring.mts"
# Same static import/export closure used by catalog-shadow, with @/ aliases.
IMPORTS = re.compile(r"\b(?:import\s+(?:type\s+)?(?:[^;]*?\s+from\s+)?|export\s+(?:type\s+)?[^;]*?\s+from\s+)[\"']([^\"']+)[\"']")
DYNAMIC = re.compile(r"\bimport\s*\(\s*[\"']([^\"']+)[\"']\s*\)")


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def execution_inputs(repo: Path) -> list[Path]:
    repo = repo.resolve()
    pending, visited = [repo / ENTRY], set()
    while pending:
        path = pending.pop().resolve()
        if path in visited:
            continue
        if not path.is_relative_to(repo) or not path.is_file():
            raise ValueError(f"Invalid readback dependency: {path}")
        visited.add(path)
        if path.suffix not in {".ts", ".mts", ".mjs", ".js", ".tsx"}:
            continue
        source = path.read_text(encoding="utf-8")
        for specifier in IMPORTS.findall(source) + DYNAMIC.findall(source):
            if specifier.startswith("@/"):
                base = repo / "src" / specifier[2:]
            elif specifier.startswith("."):
                base = path.parent / specifier
            else:
                continue
            choices = [base, *(Path(str(base) + ext) for ext in (".ts", ".mts", ".mjs", ".js", ".tsx")), base / "index.ts"]
            resolved = next((p for p in choices if p.is_file()), None)
            if resolved is None:
                raise ValueError(f"Unresolved readback import: {path}: {specifier}")
            if resolved.suffix not in {".ts", ".mts", ".mjs", ".js", ".tsx", ".json"}:
                raise ValueError(f"Unsupported readback module: {resolved}")
            pending.append(resolved)
    # Non-module inputs read by authority/schema verification and the toolchain.
    required = ["scripts/catalog_readback_identity.py", "package.json", "pnpm-lock.yaml", "tsconfig.json",
                "data/staging/catalog-expansion/gold-set-manifest.json"]
    for name in required:
        path = repo / name
        if not path.is_file():
            raise FileNotFoundError(path)
        visited.add(path)
    schema_root = repo / "scripts/sql/catalog-authority"
    if not (schema_root / "001-init.sql").is_file() or not (schema_root / "002-book-metadata.sql").is_file():
        raise ValueError("Missing Catalog authority schema inputs")
    visited.update(schema_root.glob("*.sql"))
    visited.update((repo / "data/source").rglob("*.md"))
    return sorted(visited, key=lambda p: p.relative_to(repo).as_posix())


def execution_identity(repo: Path) -> dict:
    entries = [{"path": p.relative_to(repo).as_posix(), "sha256": digest(p)} for p in execution_inputs(repo)]
    return {"schemaVersion": "catalog-readback-code-v1", "files": entries}


def readback_matches(path: Path, repo: Path, publication: Path, result: Path) -> bool:
    """Stale code/artifacts require readback only, not a new model or publication."""
    if not path.is_file():
        return False
    value = json.loads(path.read_bytes())
    if value.get("status") != "SQL_BUILD_COVERAGE_ENGINE_VERIFIED":
        return False
    if value.get("executionIdentity") != execution_identity(repo):
        return False
    databases = {
        "catalogSha256": publication / "catalog-expanded.candidate.sqlite",
        "registrySha256": publication / "catalog-source-registry.candidate.sqlite",
        "canonicalSha256": repo / "data/source/catalog.sqlite",
    }
    for key, database in databases.items():
        if not database.is_file() or database.is_symlink() or value.get(key) != digest(database):
            return False
        if any(Path(str(database) + suffix).exists() for suffix in ("-wal", "-shm", "-journal")):
            return False
    if value.get("resultManifestSha256") != digest(result / "chunk-01/PANEL-RESULT.sha256"):
        return False
    if value.get("publicationManifestSha256") != digest(publication / "MANIFEST.sha256"):
        return False
    artifacts = value.get("artifacts", [])
    paths = [item["path"] for item in artifacts]
    required = {"data/generated/recommendation-profile-catalog-v1.json", "data/generated/recommendation-profile-context-v1.json"}
    if len(set(paths)) != len(paths) or not required <= set(paths):
        return False
    for item in artifacts:
        artifact = path.parent / item["path"]
        if Path(item["path"]).is_absolute() or not artifact.resolve().is_relative_to(path.parent.resolve()):
            raise ValueError("Readback artifact escapes its output")
        if not artifact.is_file() or artifact.is_symlink() or digest(artifact) != item["sha256"]:
            return False
    return True


if __name__ == "__main__":
    print(json.dumps(execution_identity(Path(sys.argv[1]).resolve()), ensure_ascii=True))
