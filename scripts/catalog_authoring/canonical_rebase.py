"""Prove that a changed canonical does not invalidate frozen adjudication input.

The original SHA remains authoritative: this module reads that exact saved
database and returns a separate receipt. It never rewrites a frozen artifact.
"""
from __future__ import annotations

from contextlib import contextmanager
from contextvars import ContextVar
import csv
import hashlib
import json
from pathlib import Path
import re
import sqlite3

from authoring_paths import REPO

FORMAT = "catalog-canonical-rebase-v1"
CANONICAL = Path("data/source/catalog.sqlite")
GOLD = Path("data/staging/catalog-expansion/gold-set-manifest.json")
POLICIES = {
    "factorDictionary": "docs/factors/factor-dictionary.md",
    "annotationGuide": "docs/factors/annotation-guide.md",
    "authorizedEvidencePanel": "docs/catalog-expansion/02-authorized-evidence-panel-v1.md",
    "authoringAuthority": "docs/planning/09-catalog-authoring-authority.md",
}
ORDINALS = {"sourceOrdinal", "sourceLine"}
_ACTIVE_CACHE: ContextVar[dict | None] = ContextVar("canonical_rebase_cache", default=None)


@contextmanager
def validation_cache():
    """Hold one immutable snapshot per canonical SHA for a publication batch.

    The publisher must recheck canonical identity under its final commit lock.
    This is a bounded operation-local snapshot, never an mtime/process cache.
    """
    existing = _ACTIVE_CACHE.get()
    if existing is not None:
        yield
        return
    cache = {"connections": [], "originals": {}, "currents": {}, "contracts": {}, "global": {}}
    token = _ACTIVE_CACHE.set(cache)
    try:
        yield
    finally:
        _ACTIVE_CACHE.reset(token)
        for connection in cache["connections"]:
            connection.close()


def digest(body: bytes) -> str:
    return hashlib.sha256(body).hexdigest()


def encoded(value) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def _saved_original(sha: str) -> tuple[bytes, dict]:
    """Find the frozen canonical by path AND hash, never by the latest head."""
    from catalog_workspace import Workspace, manifest_digest
    from contextlib import closing
    for database in (None, REPO / "data/local/catalog-authoring/backups/latest.sqlite"):
        workspace = Workspace(REPO, database)
        if not workspace.database.is_file():
            continue
        if getattr(workspace, "is_revision_store", False):
            reference = workspace.file_reference(REPO / CANONICAL, sha)
            if reference is not None:
                return workspace.stored_bytes(reference), reference
            continue
        key = CANONICAL.as_posix()
        with closing(workspace.connect()) as db:
            row = db.execute("""SELECT s.id,s.file_count,s.manifest_sha256 FROM entry e
                JOIN snapshot s ON s.id=e.snapshot_id WHERE e.path=? AND e.sha256=?
                ORDER BY e.snapshot_id DESC LIMIT 1""", (key, sha)).fetchone()
            if row is None:
                continue
            members = db.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (row[0],)).fetchall()
            if len(members) != row[1] or manifest_digest(members) != row[2]:
                raise ValueError("Canonical rebase source snapshot changed")
            reference = {"path": key, "sha256": sha, "snapshot":
                         dict(zip(("snapshotId", "files", "manifestSha256"), row))}
            return workspace.read_blob(db, sha), reference
    # Restoration preserves the digest-named immutable versions even when the
    # local store itself is unavailable. The panel already commits their SHA.
    restored = REPO / "data/local/catalog-authoring/restored-versions" / sha
    if restored.is_file() and not restored.is_symlink():
        body = restored.read_bytes()
        if digest(body) == sha:
            return body, {"path": CANONICAL.as_posix(), "sha256": sha, "restored": True}
    raise ValueError("Canonical rebase requires the exact retained original canonical bytes")


def _schema(db: sqlite3.Connection) -> dict:
    return {"objects": sorted(db.execute("SELECT type,name,tbl_name,sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'").fetchall()),
            "userVersion": db.execute("PRAGMA user_version").fetchone()[0],
            "applicationId": db.execute("PRAGMA application_id").fetchone()[0]}


def _quoted(identifier: str) -> str:
    return '"' + identifier.replace('"', '""') + '"'


def _scope(db: sqlite3.Connection, work_ids: set[str], *, include_global: bool = True) -> dict:
    """Read owned rows and global source settings, not unrelated work facts."""
    result = {}
    evidence_ids: set[str] = set()
    for (table,) in db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"):
        columns = [row[1] for row in db.execute(f"PRAGMA table_info({_quoted(table)})")]
        owner = "id" if table == "source_works" else "workId"
        selected = [name for name in columns if name not in ORDINALS]
        query = f"SELECT {','.join(map(_quoted, selected))} FROM {_quoted(table)}"
        if owner in columns:
            query += f" WHERE {_quoted(owner)} IN ({','.join('?' for _ in work_ids)})"
            rows = db.execute(query, sorted(work_ids)).fetchall()
        elif include_global:
            rows = db.execute(query).fetchall()
        else:
            continue
        values = [dict(zip(selected, row)) for row in rows]
        for value in values:
            if value.get("evidenceId"):
                evidence_ids.add(value["evidenceId"])
        result[table] = sorted(values, key=encoded)
    # Cross-owned evidence references are still dependencies of these works.
    if evidence_ids and "source_evidence" in result:
        columns = [row[1] for row in db.execute("PRAGMA table_info(source_evidence)") if row[1] not in ORDINALS]
        query = f"SELECT {','.join(map(_quoted, columns))} FROM source_evidence WHERE id IN ({','.join('?' for _ in evidence_ids)})"
        result["referencedEvidence"] = sorted([dict(zip(columns, row)) for row in db.execute(query, sorted(evidence_ids))], key=encoded)
    return result


def _database(cache: dict, body: bytes, expected_sha: str) -> sqlite3.Connection:
    if digest(body) != expected_sha:
        raise ValueError("Canonical changed before rebase validation")
    db = sqlite3.connect(":memory:")
    try:
        db.deserialize(body)
        db.execute("PRAGMA query_only=ON")
    except BaseException:
        db.close()
        raise
    cache["connections"].append(db)
    return db


def _current_database(cache: dict, expected_sha: str, canonical_path: Path | None, body: bytes | None):
    if body is not None and canonical_path is not None:
        raise ValueError("Supply either canonical bytes or a canonical path")
    if body is not None:
        key = (REPO, "bytes", expected_sha)
        previous = cache["currents"].get(key)
        if previous is not None:
            if body is not previous[1] and digest(body) != expected_sha:
                raise ValueError("Canonical changed before rebase validation")
            return previous[0]
        db = _database(cache, body, expected_sha)
        cache["currents"][key] = (db, body)
        return db
    canonical_path = Path(canonical_path or REPO / CANONICAL).resolve()
    key = (REPO, canonical_path, expected_sha)
    if key not in cache["currents"]:
        if any(Path(str(canonical_path) + suffix).exists() for suffix in ("-wal", "-shm", "-journal")):
            raise ValueError("Canonical rebase requires a closed canonical without sidecars")
        cache["currents"][key] = (_database(cache, canonical_path.read_bytes(), expected_sha), None)
    return cache["currents"][key][0]


def _original_database(cache: dict, original_sha: str):
    key = (REPO, original_sha)
    if key not in cache["originals"]:
        original, _ = _saved_original(original_sha)
        cache["originals"][key] = _database(cache, original, original_sha)
    return cache["originals"][key]


def _contracts(cache: dict, panel: dict, input_root: Path, policy_documents: dict[str, bytes] | None):
    from policy_compatibility import prove_compatibility
    policies = panel.get("policyDigests")
    if not isinstance(policies, dict) or set(policies) != set(POLICIES):
        raise ValueError("Invalid canonical rebase policy binding")
    if policy_documents is not None and (set(policy_documents) != set(POLICIES)
            or not all(isinstance(body, bytes) for body in policy_documents.values())):
        raise ValueError("Invalid canonical rebase publication policy documents")
    documents = {}
    for name, relative in POLICIES.items():
        frozen_path = input_root / "contracts" / Path(relative).name
        if not frozen_path.is_file() or frozen_path.is_symlink():
            raise ValueError(f"Canonical rebase frozen policy missing: {name}")
        frozen = frozen_path.read_bytes()
        current = (REPO / relative).read_bytes() if policy_documents is None else policy_documents[name]
        if digest(frozen) != policies[name]:
            raise ValueError(f"Canonical rebase frozen policy digest mismatch: {name}")
        documents[name] = (frozen, current)
    current_digests = {name: digest(current) for name, (_, current) in documents.items()}
    gold_bytes = (REPO / GOLD).read_bytes()
    if digest(gold_bytes) != panel.get("goldManifestSha256"):
        raise ValueError("Canonical rebase Gold manifest changed")
    key = (REPO, panel.get("goldManifestSha256"), encoded(policies), encoded(current_digests))
    if key not in cache["contracts"]:
        gold = json.loads(gold_bytes)["workIds"]
        if not isinstance(gold, list) or not all(isinstance(value, str) and value for value in gold):
            raise ValueError("Invalid canonical rebase Gold membership")
        proofs = [proof for name, (frozen, current) in documents.items()
                  if (proof := prove_compatibility(name, frozen, current)) is not None]
        cache["contracts"][key] = set(gold), current_digests, proofs
    return cache["contracts"][key]


def _global_proof(cache: dict, old_db: sqlite3.Connection, new_db: sqlite3.Connection, gold: set[str]):
    key = (old_db, new_db, tuple(sorted(gold)))
    if key not in cache["global"]:
        old_schema = _schema(old_db)
        if old_schema != _schema(new_db):
            raise ValueError("Canonical rebase schema changed")
        before, after = _scope(old_db, gold), _scope(new_db, gold)
        if before != after:
            raise ValueError("Canonical rebase relevant source changed: Gold or global settings")
        bindings = _identity_bindings(old_db, before, [])
        if bindings != _identity_bindings(new_db, before, []):
            raise ValueError("Canonical rebase Gold identity binding changed")
        cache["global"][key] = (digest(encoded(old_schema)), digest(encoded(before)), digest(encoded(bindings)))
    return cache["global"][key]


def _identity_bindings(db: sqlite3.Connection, scope: dict, targets: list[dict]) -> dict:
    """Catch a different work acquiring a frozen alias, volume ID, or ISBN."""
    queries = {
        "aliases": ("source_aliases", "alias", {r["alias"] for r in scope.get("source_aliases", [])}),
        "volumeIds": ("source_volumes", "id", {r["id"] for r in scope.get("source_volumes", [])}),
        "isbns": ("source_volumes", "isbn", {r["isbn"] for r in scope.get("source_volumes", [])}
                  | {r["representativeIsbn"] for r in targets if r.get("representativeIsbn")}),
    }
    result = {}
    for name, (table, field, values) in queries.items():
        if not values or table not in scope:
            result[name] = []
            continue
        rows = db.execute(f"SELECT workId,{_quoted(field)} FROM {_quoted(table)} WHERE {_quoted(field)} IN ({','.join('?' for _ in values)})", sorted(values)).fetchall()
        result[name] = sorted(rows)
    return result


def validate_rebase(input_root: Path, current_canonical_sha: str, *, canonical_path: Path | None = None,
                    canonical_bytes: bytes | None = None, policy_documents: dict[str, bytes] | None = None) -> dict | None:
    """Return a dependency proof, or None when the original SHA still matches.

    The caller must validate the frozen input manifest first and must retain this
    receipt in its publication manifest. Historical verification supplies the
    publication's exact SHA-bound policy_documents, never today's replacements.
    Passing the original SHA to a legacy
    identity validator is safe only after this function succeeds. Publication
    must still compare current_canonical_sha under its shared commit lock.
    """
    # All paths, including individual calls, use the same bounded snapshot code.
    if _ACTIVE_CACHE.get() is None:
        with validation_cache():
            return validate_rebase(input_root, current_canonical_sha, canonical_path=canonical_path,
                                   canonical_bytes=canonical_bytes, policy_documents=policy_documents)
    cache = _ACTIVE_CACHE.get()
    input_root = Path(input_root)
    panel_bytes = (input_root / "panel-input.json").read_bytes()
    panel = json.loads(panel_bytes)
    original_sha = panel.get("canonicalSha256")
    if any(not isinstance(value, str) or re.fullmatch(r"[0-9a-f]{64}", value) is None
           for value in (original_sha, current_canonical_sha)):
        raise ValueError("Invalid canonical rebase identity")
    gold, current_policy_digests, policy_proofs = _contracts(cache, panel, input_root, policy_documents)
    if original_sha == current_canonical_sha and not policy_proofs:
        return None
    new_db = _current_database(cache, current_canonical_sha, canonical_path, canonical_bytes)
    targets = []
    for path in sorted((input_root / "chunks").glob("chunk-*/targets.csv")):
        with path.open(encoding="utf-8-sig", newline="") as handle:
            targets.extend(csv.DictReader(handle))
    target_ids = {row["workId"] for row in targets}
    if not target_ids or len(target_ids) != len(targets) or len(targets) != panel.get("targetCount"):
        raise ValueError("Invalid canonical rebase target membership")
    old_db = new_db if original_sha == current_canonical_sha else _original_database(cache, original_sha)
    schema_sha, gold_source_sha, gold_binding_sha = _global_proof(cache, old_db, new_db, gold)
    before, after = _scope(old_db, target_ids, include_global=False), _scope(new_db, target_ids, include_global=False)
    if before != after:
        changed = [name for name in before if before[name] != after[name]]
        prefix = (f"Canonical rebase target conflict: {next(iter(target_ids))}: relevant source changed: "
                  if len(target_ids) == 1 else "Canonical rebase relevant source changed: ")
        raise ValueError(prefix + ", ".join(changed))
    bindings = _identity_bindings(old_db, before, targets)
    if bindings != _identity_bindings(new_db, before, targets):
        prefix = f"Canonical rebase target conflict: {next(iter(target_ids))}: " if len(target_ids) == 1 else "Canonical rebase "
        raise ValueError(prefix + "alias or representative binding changed")
    receipt = {
        "schemaVersion": FORMAT, "inputManifestSha256": digest((input_root / "PANEL-INPUT.sha256").read_bytes()),
        "panelInputSha256": digest(panel_bytes), "originalCanonicalSha256": original_sha,
        "currentCanonicalSha256": current_canonical_sha,
        # The proof binds content, not the mutable choice of matching snapshot.
        # Re-saving identical bytes or restoring a retired store cannot alter it.
        "originalCanonical": {"path": CANONICAL.as_posix(), "sha256": original_sha},
        "targetIds": sorted(target_ids), "goldManifestSha256": panel["goldManifestSha256"],
        "policyDigests": panel["policyDigests"], "schemaSha256": schema_sha,
        "protectedGoldSha256": gold_source_sha, "goldIdentityBindingsSha256": gold_binding_sha,
        "protectedSourceSha256": digest(encoded(before)), "identityBindingsSha256": digest(encoded(bindings)),
    }
    if policy_proofs:
        receipt["currentPolicyDigests"] = current_policy_digests
        receipt["policyCompatibility"] = policy_proofs
    return {**receipt, "receiptSha256": digest(encoded(receipt))}
