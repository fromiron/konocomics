"""Generation-bound authoring revisions; execution history is not curation history."""
from __future__ import annotations

from contextlib import closing, ExitStack
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import sqlite3
import uuid
import re
import tempfile
from time import perf_counter
import zlib

from catalog_workspace import Workspace, APPLICATION_ID, digest, exclusive_file, key_path, unlinked, utc_now, replace_busy_backup

VERSION = 4
FORMAT = "catalog-authoring-revision-v1"
SCHEMA = """
CREATE TABLE store_meta(key TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT;
CREATE TABLE blob(sha256 TEXT PRIMARY KEY CHECK(length(sha256)=64), byte_length INTEGER NOT NULL CHECK(byte_length>=0), content BLOB NOT NULL) STRICT;
CREATE TABLE revision(
 id TEXT PRIMARY KEY, kind TEXT NOT NULL, subject TEXT NOT NULL,
 payload_sha256 TEXT NOT NULL REFERENCES blob(sha256),
 previous_id TEXT REFERENCES revision(id), created_at TEXT NOT NULL,
 terminal INTEGER NOT NULL CHECK(terminal IN (0,1)), pinned INTEGER NOT NULL CHECK(pinned IN (0,1))
) STRICT;
CREATE TABLE head(kind TEXT NOT NULL, subject TEXT NOT NULL, revision_id TEXT NOT NULL REFERENCES revision(id), PRIMARY KEY(kind,subject)) STRICT;
CREATE TABLE revision_blob(revision_id TEXT NOT NULL REFERENCES revision(id), path TEXT NOT NULL,
 sha256 TEXT NOT NULL REFERENCES blob(sha256), PRIMARY KEY(revision_id,path)) STRICT;
CREATE INDEX revision_subject ON revision(kind,subject);
CREATE INDEX revision_blob_path ON revision_blob(path,sha256);
"""

V4_SCHEMA = """
CREATE INDEX revision_previous ON revision(previous_id);
CREATE INDEX revision_payload ON revision(payload_sha256);
CREATE INDEX revision_expiry ON revision(kind,terminal,pinned,created_at);
CREATE INDEX revision_blob_sha ON revision_blob(sha256);
CREATE INDEX head_revision ON head(revision_id);
CREATE TABLE execution_artifact(
 execution_id TEXT NOT NULL REFERENCES revision(id),
 artifact_id TEXT NOT NULL REFERENCES revision(id),
 PRIMARY KEY(execution_id,artifact_id)
) STRICT;
CREATE INDEX execution_artifact_target ON execution_artifact(artifact_id);
CREATE TABLE revision_dependency(
 owner_id TEXT NOT NULL REFERENCES revision(id), target_id TEXT NOT NULL REFERENCES revision(id),
 PRIMARY KEY(owner_id,target_id)
) STRICT;
CREATE INDEX revision_dependency_target ON revision_dependency(target_id);
CREATE TABLE change_log(
 seq INTEGER PRIMARY KEY AUTOINCREMENT, entity TEXT NOT NULL,
 key1 TEXT NOT NULL, key2 TEXT NOT NULL DEFAULT ''
) STRICT;
"""


def change_triggers():
    statements = []
    tables = {"blob": ("blob", "sha256", None), "revision": ("revision", "id", None),
              "head": ("head", "kind", "subject"),
              "revision_blob": ("revision", "revision_id", None),
              "execution_artifact": ("ownership", "execution_id", "artifact_id"),
              "revision_dependency": ("dependency", "owner_id", "target_id")}
    for table, (entity, first, second) in tables.items():
        for action in ("INSERT", "UPDATE", "DELETE"):
            row = "old" if action == "DELETE" else "new"
            key2 = f"{row}.{second}" if second else "''"
            statements.append(f"""CREATE TRIGGER log_{table}_{action.lower()} AFTER {action} ON {table}
                BEGIN INSERT INTO change_log(entity,key1,key2) VALUES ('{entity}',{row}.{first},{key2}); END;""")
    return "\n".join(statements)


def wal_runtime_supported(version=None):
    """Reject SQLite releases affected by the upstream WAL-reset corruption bug."""
    version = tuple(version or sqlite3.sqlite_version_info)
    return version >= (3, 51, 3) or ((3, 50, 7) <= version < (3, 51, 0)) or ((3, 44, 6) <= version < (3, 45, 0))


class PreparedBlobs:
    """Bound memory while preparing a large explicit input closure outside SQL."""

    def __init__(self):
        self.stream = tempfile.SpooledTemporaryFile(max_size=16 * 1024 * 1024)
        self.entries = {}
        self.dependencies = set()

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.close()

    def close(self):
        self.stream.close()

    def add(self, sha, size, compressed):
        if sha not in self.entries:
            self.entries[sha] = size, self.stream.tell(), len(compressed)
            self.stream.write(compressed)

    def items(self):
        for sha, (size, offset, length) in self.entries.items():
            self.stream.seek(offset)
            yield sha, (size, self.stream.read(length))

    def content(self, sha):
        _, offset, length = self.entries[sha]
        self.stream.seek(offset)
        return self.stream.read(length)


class VerificationContext:
    """One invocation, one real-file inventory, independent source/backup views."""

    def __init__(self, store, roots, *, backup=False, metrics=None):
        self.store, self.roots, self.backup = store, roots, backup
        self.metrics = metrics if metrics is not None else {}

    def __enter__(self):
        self.started = perf_counter()
        self.inventory = self.store._inventory(self.roots, self.metrics)
        self.stack = ExitStack()
        self.views = []
        try:
            stores = [self.store]
            if self.backup:
                stores.append(RevisionWorkspace(self.store.repo, self.store.repo / "data/local/catalog-authoring/backups/latest.sqlite"))
            for store in stores:
                db = self.stack.enter_context(closing(store.connect()))
                db.execute("BEGIN")
                self.views.append((store, db, {}, {}))
            return self
        except BaseException:
            self.stack.close()
            raise

    def __exit__(self, kind, value, traceback):
        self.stack.close()
        if kind is None:
            self.store._assert_inventory(self.roots, self.inventory, self.metrics)
        self.metrics["verificationSeconds"] = perf_counter() - self.started

    def _paths(self, roots):
        roots = [Path(root).absolute() for root in roots]
        selected = {}
        for root in roots:
            if root in self.inventory:
                selected[root] = self.inventory[root]
                continue
            members = {path: item for path, item in self.inventory.items() if path.is_relative_to(root)}
            if not members:
                raise ValueError(f"Verification path is outside the invocation inventory: {root}")
            selected.update(members)
        return selected

    def _blob(self, view, sha, *, payload=False):
        store, db, revisions, blobs = view
        payload_key = ("payload", sha)
        if sha not in blobs or (payload and payload_key not in revisions):
            started = perf_counter()
            body = store.read_blob(db, sha)
            blobs[sha] = len(body)
            if payload:
                revisions[payload_key] = json.loads(body)
            key = "source" if store is self.store else "backup"
            measured = self.metrics.setdefault(key, {})
            measured["blobs"] = measured.get("blobs", 0) + 1
            measured["blobBytes"] = measured.get("blobBytes", 0) + blobs[sha]
            measured["blobSeconds"] = measured.get("blobSeconds", 0) + perf_counter() - started
        return revisions[payload_key] if payload else blobs[sha]

    def _revision(self, view, receipt):
        store, db, revisions, _ = view
        if "snapshotId" in receipt:
            legacy_key = ("legacy", receipt["snapshotId"], receipt["files"], receipt["manifestSha256"])
            if legacy_key in revisions:
                return revisions[legacy_key]
            row = db.execute("SELECT revision_id FROM head WHERE kind='legacy-pin' AND subject=?", (str(receipt["snapshotId"]),)).fetchone()
            if row is None:
                raise ValueError("Legacy source reference was retired")
            value = self._revision(view, store._receipt(db, row[0]))
            store._verify_legacy_header(receipt, value)
            revisions[legacy_key] = value
            return value
        if receipt.get("schemaVersion") != FORMAT or receipt.get("generation") != store._generation:
            raise ValueError("Revision belongs to a different authoring generation")
        rid = receipt["revisionId"]
        if rid not in revisions:
            started = perf_counter()
            actual = store._receipt(db, rid)
            value = self._blob(view, actual["payloadSha256"], payload=True)
            rows = dict(db.execute("SELECT path,sha256 FROM revision_blob WHERE revision_id=?", (rid,)))
            if value["members"] != rows:
                raise ValueError("Authoring revision membership mismatch")
            revisions[rid] = actual, value
            key = "source" if store is self.store else "backup"
            measured = self.metrics.setdefault(key, {})
            measured["revisions"] = measured.get("revisions", 0) + 1
            measured["membershipRows"] = measured.get("membershipRows", 0) + len(rows)
            measured["revisionSeconds"] = measured.get("revisionSeconds", 0) + perf_counter() - started
        actual, value = revisions[rid]
        if any(actual[key] != receipt[key] for key in ("payloadSha256", "files")):
            raise ValueError("Authoring revision receipt mismatch")
        return value

    def verify_saved(self, receipt, roots):
        inventory = self._paths(roots)
        for view in self.views:
            value = self._revision(view, receipt)
            for path, (sha, size) in inventory.items():
                if value["members"].get(path.relative_to(self.store.repo).as_posix()) != sha:
                    raise ValueError("Requested artifacts differ from retained revision")
                if self._blob(view, sha) != size:
                    raise ValueError("Retained artifact length mismatch")

    def saved_files(self, roots):
        groups, missing = {}, []
        store, db, _, _ = self.views[0]
        started = perf_counter()
        for path, (sha, _) in self._paths(roots).items():
            row = db.execute("SELECT b.revision_id FROM revision_blob b JOIN revision r ON r.id=b.revision_id WHERE b.path=? AND b.sha256=? ORDER BY r.rowid DESC LIMIT 1",
                             (path.relative_to(store.repo).as_posix(), sha)).fetchone()
            if row is None:
                missing.append(path)
            else:
                if row[0] not in groups:
                    groups[row[0]] = (store._receipt(db, row[0]), [])
                groups[row[0]][1].append(path)
        self.metrics["lookupSeconds"] = self.metrics.get("lookupSeconds", 0) + perf_counter() - started
        for receipt, paths in groups.values():
            self.verify_saved(receipt, paths)
        return list(groups.values()), missing

    def verify_references(self, references):
        for reference in references:
            paths = []
            for name, sha in reference["members"].items():
                path = self.store.repo / key_path(name)
                if path not in self.inventory or self.inventory[path][0] != sha:
                    raise ValueError("Retained reference differs from actual file bytes")
                paths.append(path)
            self.verify_saved(reference["snapshot"], paths)


class RetainedInputContext:
    """Reuse exact saved manifests without walking or saving their old trees again."""

    def __init__(self, store, references):
        self.store, self.references = store, references
        self.groups, self.receipts, self.resolved = {}, {}, {}
        self.roots, self.originals = {}, {}

    def __enter__(self):
        self.verification = VerificationContext(self.store, [])
        self.verification.__enter__()
        self.view = self.verification.views[0]
        self.db = self.view[1]
        return self

    def __exit__(self, kind, value, traceback):
        try:
            if kind is None:
                for path, sha in self.originals.items():
                    if digest(path.read_bytes()) != sha:
                        raise ValueError("Retained input manifest changed during dependency discovery")
                self.references.extend(self.groups.values())
        finally:
            self.verification.__exit__(kind, value, traceback)

    def _reference(self, name, sha):
        key = name, sha
        if key not in self.resolved:
            row = self.db.execute("SELECT b.revision_id FROM revision_blob b JOIN revision r ON r.id=b.revision_id WHERE b.path=? AND b.sha256=? ORDER BY r.rowid DESC LIMIT 1", key).fetchone()
            if row is None:
                self.resolved[key] = None
            else:
                rid = row[0]
                if rid not in self.receipts:
                    self.receipts[rid] = self.store._receipt(self.db, rid)
                self.resolved[key] = self.receipts[rid]
        return self.resolved[key]

    def resolve(self, root):
        """None means use ordinary capture; corrupt retained data always fails."""
        if root in self.roots:
            return self.roots[root]
        if root.is_file():
            body = root.read_bytes()
            members = {root.relative_to(self.store.repo).as_posix(): digest(body)}
            original = root
        else:
            manifest = next((root / name for name in ("MANIFEST.sha256", "PANEL-INPUT.sha256", "PANEL-RESULT.sha256") if (root / name).is_file()), None)
            if manifest is None:
                return None
            body = manifest.read_bytes()
            members = {manifest.relative_to(self.store.repo).as_posix(): digest(body)}
            original = manifest
            prefix = root.relative_to(self.store.repo).as_posix()
            try:
                for line in body.decode("utf-8").splitlines():
                    sha, name = line.split("  ", 1)
                    if not re.fullmatch("[0-9a-f]{64}", sha):
                        return None
                    key = prefix + "/" + key_path(name)
                    if key in members:
                        return None
                    members[key] = sha
            except (ValueError, UnicodeError):
                return None
        bound = [(name, sha, self._reference(name, sha)) for name, sha in members.items()]
        if any(receipt is None for _, _, receipt in bound):
            return None
        for name, sha, receipt in bound:
            value = self.verification._revision(self.view, receipt)
            if value["members"].get(name) != sha:
                raise ValueError("Retained input differs from its revision membership")
            self.verification._blob(self.view, sha)
        for name, sha, receipt in bound:
            rid = receipt["revisionId"]
            self.groups.setdefault(rid, {"snapshot": receipt, "members": {}})["members"][name] = sha
        self.originals[original] = digest(body)
        self.roots[root] = [(self.store.repo / name, sha) for name, sha, _ in bound]
        return self.roots[root]

    def read(self, sha):
        return self.store.read_blob(self.db, sha)

    def retain_exact(self, references):
        """Preserve declared versions, including old canonical/policy paths."""
        for reference in references:
            receipt = reference["snapshot"]
            saved = self.verification._revision(self.view, receipt)["members"]
            members = reference["members"]
            for name, sha in members.items():
                key_path(name)
                if saved.get(name) != sha:
                    raise ValueError("Declared compact dependency differs from retained membership")
                self.verification._blob(self.view, sha)
            identity = ("declared", json.dumps(receipt, sort_keys=True, separators=(",", ":")))
            self.groups.setdefault(identity, {"snapshot": receipt, "members": {}})["members"].update(members)


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")


class RevisionWorkspace(Workspace):
    """Same local storage boundary, with explicit revision receipts instead of snapshot IDs."""

    @classmethod
    def create(cls, repo, database, *, enable_wal=False):
        if enable_wal and not wal_runtime_supported():
            raise ValueError("WAL requires a SQLite release with the WAL-reset corruption fix")
        store = cls(repo, database)
        store.database.parent.mkdir(parents=True, exist_ok=True)
        with store.database.open("xb"):
            pass
        with closing(sqlite3.connect(store.database)) as db:
            db.executescript(f"BEGIN IMMEDIATE;{SCHEMA}{V4_SCHEMA}{change_triggers()}PRAGMA application_id={APPLICATION_ID};PRAGMA user_version={VERSION};COMMIT;")
            with db:
                db.executemany("INSERT INTO store_meta VALUES (?,?)", [
                    ("generation", str(uuid.uuid4())), ("policy", "curation-evidence-active-v1"),
                    ("journal_origin", str(uuid.uuid4()))])
            if enable_wal:
                db.execute("PRAGMA journal_mode=WAL")
        return store

    def upgrade_v4(self, *, enable_wal=False):
        """Explicit stopped-writer migration; preserve every generation/revision byte."""
        if enable_wal and not wal_runtime_supported():
            raise ValueError("WAL requires a SQLite release with the WAL-reset corruption fix")
        with closing(sqlite3.connect(self.database.as_uri() + "?mode=rw", uri=True, timeout=300)) as db:
            if db.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID:
                raise ValueError("Not an authoring revision store")
            version = db.execute("PRAGMA user_version").fetchone()[0]
            if version not in (3, VERSION):
                raise ValueError("Only schema v3 can migrate to v4")
            generation = db.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
            if version == 3:
                origin = str(uuid.uuid4())
                db.executescript(f"BEGIN IMMEDIATE;{V4_SCHEMA}{change_triggers()}"
                    f"INSERT INTO store_meta VALUES ('journal_origin','{origin}');"
                    "INSERT INTO store_meta SELECT 'legacy_revision_max_rowid',cast(coalesce(max(rowid),0) AS TEXT) FROM revision;"
                    f"PRAGMA user_version={VERSION};COMMIT;")
            if enable_wal:
                if db.execute("PRAGMA journal_mode=WAL").fetchone()[0] != "wal":
                    raise ValueError("Authoring WAL activation failed")
            mode = db.execute("PRAGMA journal_mode").fetchone()[0]
        return {"status": "UPGRADED", "schemaVersion": VERSION, "generation": generation, "journalMode": mode}

    def connect(self, *, write=False):
        if write and self.database == self.repo / "data/local/catalog-authoring/workspace.sqlite" and (self.database.parent / "RETENTION-MAINTENANCE.json").exists():
            raise ValueError("Authoring retention cutover is in progress; resume after its STATE/backup readback")
        if not self.database.is_file():
            raise FileNotFoundError(self.database)
        db = sqlite3.connect(self.database.as_uri() + ("?mode=rw" if write else "?mode=ro"), uri=True, timeout=300)
        try:
            db.execute("PRAGMA foreign_keys=ON")
            version = db.execute("PRAGMA user_version").fetchone()[0]
            if (db.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID
                    or version not in (3, VERSION)):
                raise ValueError("Authoring store generation/schema changed; reopen with current code")
            if write and version != VERSION:
                raise ValueError("Schema v3 is read-only; explicitly upgrade_v4 with writers stopped")
            generation = db.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
            if hasattr(self, "_generation") and self._generation != generation:
                raise ValueError("Authoring store generation changed during operation")
            self._generation = generation
            if write:
                if db.execute("PRAGMA journal_mode").fetchone()[0] == "wal" and not wal_runtime_supported():
                    raise ValueError("WAL writes require a SQLite release with the WAL-reset corruption fix")
                db.execute("PRAGMA synchronous=FULL")
            return db
        except BaseException:
            db.close()
            raise

    def _receipt(self, db, revision_id):
        row = db.execute("SELECT payload_sha256 FROM revision WHERE id=?", (revision_id,)).fetchone()
        if row is None:
            raise ValueError("Missing authoring revision")
        return {"schemaVersion": FORMAT, "generation": self._generation, "revisionId": revision_id,
                "payloadSha256": row[0], "files": db.execute("SELECT count(*) FROM revision_blob WHERE revision_id=?", (revision_id,)).fetchone()[0],
                "database": str(self.database)}

    def put_revision(self, kind, subject, payload, members=None, *, terminal=False, pinned=False, expected_head=False, _db=None, _prepared=None, _dependencies=None):
        """Actual semantic content decides identity; timestamps are provenance only."""
        if _db is None:
            body = encoded({"payload": payload, "members": members or {}})
            with closing(self.connect()) as read:
                found = self._unchanged(read, kind, subject, digest(body), terminal, pinned, members or {})
                if found:
                    return found
            dependencies = self._receipt_dependencies(payload)
            with self._prepare_blobs({digest(body): body}) as prepared, closing(self.connect(write=True)) as db, db:
                db.execute("BEGIN IMMEDIATE")
                self._insert_prepared(db, prepared)
                return self.put_revision(kind, subject, payload, members, terminal=terminal, pinned=pinned, _db=db, _prepared=prepared,
                                         _dependencies=dependencies, expected_head=expected_head)
        if kind not in {"curation", "collection", "decision", "active", "completion", "canonical-completion", "artifact", "execution-artifact", "execution", "legacy-pin"} or not subject:
            raise ValueError("Invalid authoring revision target")
        members = members or {}
        for path, sha in members.items():
            key_path(path)
            if not re.fullmatch("[0-9a-f]{64}", sha):
                raise ValueError("Invalid authoring member SHA")
        body = encoded({"payload": payload, "members": members})
        sha = digest(body)
        db = _db
        old = db.execute("SELECT r.id,r.payload_sha256,r.terminal,r.pinned FROM head h JOIN revision r ON r.id=h.revision_id WHERE h.kind=? AND h.subject=?", (kind, subject)).fetchone()
        if expected_head is not False and (old[0] if old else None) != expected_head:
            raise ValueError("Authoring revision head advanced during preparation")
        if old and old[1:] == (sha, int(terminal), int(pinned)):
            return self._receipt(db, old[0])
        for member in set(members.values()):
            if db.execute("SELECT 1 FROM blob WHERE sha256=?", (member,)).fetchone() is None:
                raise ValueError(f"Revision references missing retained bytes: {member}")
        if _prepared is None:
            self.add_blob(db, body)
        rid = str(uuid.uuid4())
        previous = old[0] if old and kind in {"curation", "collection", "decision"} else None
        db.execute("INSERT INTO revision VALUES (?,?,?,?,?,?,?,?)", (rid, kind, subject, sha, previous, utc_now(), int(terminal), int(pinned)))
        db.executemany("INSERT INTO revision_blob VALUES (?,?,?)", [(rid, path, member) for path, member in sorted(members.items())])
        db.execute("INSERT INTO head VALUES (?,?,?) ON CONFLICT(kind,subject) DO UPDATE SET revision_id=excluded.revision_id", (kind, subject, rid))
        dependencies = _dependencies if _dependencies is not None else self._receipt_dependencies(payload)
        # Raw failure reports can mention missing receipts. Retain those bytes;
        # only actual same-generation revisions create a retention edge. The
        # caller's ordinary receipt verification still rejects missing authority.
        db.executemany("INSERT INTO revision_dependency SELECT ?,id FROM revision WHERE id=?", [(rid, target) for target in sorted(dependencies) if target != rid])
        return self._receipt(db, rid)

    def _receipt_dependencies(self, value):
        found, pending = set(), [value]
        while pending:
            item = pending.pop()
            if isinstance(item, dict):
                if (item.get("schemaVersion") == FORMAT and item.get("generation") == self._generation
                        and isinstance(item.get("revisionId"), str)):
                    found.add(item["revisionId"])
                pending.extend(item.values())
            elif isinstance(item, list):
                pending.extend(item)
        return found

    def _unchanged(self, db, kind, subject, sha, terminal, pinned, members):
        old = db.execute("SELECT r.id,r.payload_sha256,r.terminal,r.pinned FROM head h JOIN revision r ON r.id=h.revision_id WHERE h.kind=? AND h.subject=?", (kind, subject)).fetchone()
        if old and old[1:] == (sha, int(terminal), int(pinned)):
            self.read_blob(db, sha)
            for member in set(members.values()):
                self.read_blob(db, member)
            if dict(db.execute("SELECT path,sha256 FROM revision_blob WHERE revision_id=?", (old[0],))) != members:
                raise ValueError("Authoring revision membership mismatch")
            return self._receipt(db, old[0])
        return None

    def _prepare_blobs(self, bodies):
        """Hash/compress/verify before acquiring the SQLite writer slot."""
        prepared = PreparedBlobs()
        try:
            with closing(self.connect()) as db:
                for sha, body in bodies.items():
                    self._prepare_blob(db, prepared, sha, body)
            return prepared
        except BaseException:
            prepared.close()
            raise

    def _prepare_blob(self, db, prepared, sha, body):
        if sha in prepared.entries:
            return
        old = db.execute("SELECT byte_length,content FROM blob WHERE sha256=?", (sha,)).fetchone()
        if old is not None:
            if old[0] != len(body) or self._decode_compressed(sha, *old) != body:
                raise ValueError(f"Stored blob conflict: {sha}")
            # Keep prepared bytes: concurrent GC may retire a formerly saved blob.
            compressed = old[1]
        else:
            compressed = zlib.compress(body, level=1)
            if zlib.decompress(compressed) != body:
                raise ValueError("Compression readback failed")
        prepared.add(sha, len(body), compressed)
        if body.lstrip()[:1] in (b"{", b"["):
            try:
                prepared.dependencies.update(self._receipt_dependencies(json.loads(body)))
            except (ValueError, UnicodeDecodeError):
                pass

    @staticmethod
    def _insert_prepared(db, prepared):
        for sha, (size, _, _) in prepared.entries.items():
            old = db.execute("SELECT byte_length FROM blob WHERE sha256=?", (sha,)).fetchone()
            if old is None:
                db.execute("INSERT INTO blob VALUES (?,?,?)", (sha, size, prepared.content(sha)))
            elif old[0] != size:
                raise ValueError(f"Stored blob conflict: {sha}")

    def get_revision(self, receipt):
        with closing(self.connect()) as db:
            db.execute("BEGIN")
            if receipt.get("schemaVersion") != FORMAT or receipt.get("generation") != self._generation:
                raise ValueError("Revision belongs to a different authoring generation")
            actual = self._receipt(db, receipt["revisionId"])
            if any(actual[key] != receipt[key] for key in ("payloadSha256", "files")):
                raise ValueError("Authoring revision receipt mismatch")
            value = json.loads(self.read_blob(db, receipt["payloadSha256"]))
            rows = dict(db.execute("SELECT path,sha256 FROM revision_blob WHERE revision_id=?", (receipt["revisionId"],)))
            if value["members"] != rows:
                raise ValueError("Authoring revision membership mismatch")
            return value

    def current_revision(self, kind, subject):
        with closing(self.connect()) as db:
            row = db.execute("SELECT revision_id FROM head WHERE kind=? AND subject=?", (kind, subject)).fetchone()
            return self._receipt(db, row[0]) if row else None

    def save_bytes(self, artifacts, label):
        from catalog_retention import sparse_control_base, prepare_control_delta
        control_base = sparse_control_base(self)
        if not artifacts or not label.strip():
            raise ValueError("A named artifact set is required")
        for name in artifacts:
            self.key(self.repo / key_path(name))
        members = {name: digest(body) for name, body in artifacts.items()}
        bodies = {digest(body): body for body in artifacts.values()}
        control_update = prepare_control_delta(self, control_base, members, bodies.__getitem__)
        return self._save_prepared("artifact", label + ":" + digest(encoded(sorted(members))), label,
                                   members, bodies, control_update=control_update)

    def _save_prepared(self, kind, subject, label, members, bodies, *, terminal=False, before_commit=None, execution=None, control_update=None):
        payload = {"label": label}
        body = encoded({"payload": payload, "members": members})
        sha = digest(body)
        with closing(self.connect()) as db:
            found = self._unchanged(db, kind, subject, sha, terminal, False, members)
            if found and execution is not None:
                self._bind_execution_artifacts(db, execution, [found], require_existing=True)
        if found and control_update is None:
            if before_commit:
                before_commit()
            return found
        if isinstance(bodies, PreparedBlobs):
            prepared = bodies
            with closing(self.connect()) as db:
                self._prepare_blob(db, prepared, sha, body)
        else:
            bodies[sha] = body
            prepared = self._prepare_blobs(bodies)
        try:
            if control_update is not None:
                control_body = encoded({key: control_update[key] for key in ("payload", "members")})
                with closing(self.connect()) as db:
                    self._prepare_blob(db, prepared, digest(control_body), control_body)
            if before_commit:
                before_commit()
            with closing(self.connect(write=True)) as db, db:
                started = perf_counter()
                db.execute("BEGIN IMMEDIATE")
                acquired = perf_counter()
                self._insert_prepared(db, prepared)
                receipt = self.put_revision(kind, subject, payload, members, terminal=terminal, _db=db, _prepared=prepared, _dependencies=prepared.dependencies)
                if execution is not None:
                    self._bind_execution_artifacts(db, execution, [receipt])
                if control_update is not None:
                    self.put_revision("active", "current-recovery-controls", control_update["payload"], control_update["members"],
                        expected_head=control_update["expectedHead"], _db=db, _prepared=prepared, _dependencies=prepared.dependencies)
                db.commit()
                self.last_save_timings = {"writerWait": acquired - started, "writerHeld": perf_counter() - acquired}
            return receipt
        finally:
            if prepared is not bodies:
                prepared.close()

    def save(self, roots, label, *, kind="artifact", terminal=False, execution=None, control_base=False, control_deleted=()):
        from catalog_retention import sparse_control_base, prepare_control_delta
        if control_base is False:
            control_base = sparse_control_base(self)
        if not roots or not label.strip():
            raise ValueError("Save requires explicit roots and a label")
        if (kind == "execution-artifact") != (execution is not None):
            raise ValueError("Transient artifacts require an atomic execution owner")
        inventory = self._inventory(roots)
        for path in inventory:
            if path.suffix == ".sqlite" and any(Path(str(path) + suffix).exists() for suffix in ("-wal", "-shm", "-journal")):
                raise ValueError(f"Close/checkpoint the source SQLite before capturing exact bytes: {path}")
        members = {path.relative_to(self.repo).as_posix(): value[0] for path, value in inventory.items()}
        paths_by_sha = {value[0]: path for path, value in inventory.items()}

        def control_body(sha):
            body = paths_by_sha[sha].read_bytes()
            if digest(body) != sha:
                raise ValueError("Control changed before revision save")
            return body

        control_update = prepare_control_delta(self, control_base, members, control_body, deleted=control_deleted)
        subject = label + ":" + digest(encoded(sorted(self.key(root) for root in roots)))
        payload_sha = digest(encoded({"payload": {"label": label}, "members": members}))
        with closing(self.connect()) as db:
            unchanged = self._unchanged(db, kind, subject, payload_sha, terminal, False, members)
            if unchanged and execution is not None:
                self._bind_execution_artifacts(db, execution, [unchanged], require_existing=True)
        if unchanged and control_update is None:
            self._assert_inventory(roots, inventory)
            return unchanged
        with PreparedBlobs() as prepared:
            with closing(self.connect()) as db:
                for path, (sha, _) in inventory.items():
                    body = path.read_bytes()
                    if digest(body) != sha:
                        raise ValueError("Artifact changed before revision save")
                    self._prepare_blob(db, prepared, sha, body)
            receipt = self._save_prepared(kind, subject, label, members, prepared, terminal=terminal,
                                         before_commit=lambda: self._assert_inventory(roots, inventory), execution=execution, control_update=control_update)
        # A concurrent file change during commit cannot produce a success receipt.
        self._assert_inventory(roots, inventory)
        return receipt

    def file_reference(self, path, sha=None):
        key = self.key(path)
        sha = sha or digest(path.read_bytes())
        with closing(self.connect()) as db:
            row = db.execute("SELECT b.revision_id FROM revision_blob b JOIN revision r ON r.id=b.revision_id WHERE b.path=? AND b.sha256=? ORDER BY r.rowid DESC LIMIT 1", (key, sha)).fetchone()
            if row is None:
                return None
            return {"path": key, "sha256": sha, "snapshot": self._receipt(db, row[0])}

    def stored_bytes(self, reference):
        if "snapshotId" in reference["snapshot"]:
            original = reference["snapshot"]
            pin = self.current_revision("legacy-pin", str(original["snapshotId"]))
            if pin is None:
                raise ValueError("Legacy source reference was retired")
            value = self.get_revision(pin)
            self._verify_legacy_header(original, value)
            if value["payload"]["originalMembers"].get(reference["path"]) != reference["sha256"]:
                raise ValueError("Source is outside original legacy snapshot")
            if reference["sha256"] not in value["members"].values():
                raise ValueError("Legacy source bytes were not retained")
            with closing(self.connect()) as db:
                return self.read_blob(db, reference["sha256"])
        value = self.get_revision(reference["snapshot"])
        if value["members"].get(key_path(reference["path"])) != reference["sha256"]:
            raise ValueError("File is outside its authoring revision")
        with closing(self.connect()) as db:
            return self.read_blob(db, reference["sha256"])

    def verify_saved(self, receipt, roots):
        with self.verification_context(roots) as verification:
            verification.verify_saved(receipt, roots)

    def verification_context(self, roots, *, backup=False, metrics=None):
        return VerificationContext(self, roots, backup=backup, metrics=metrics)

    def saved_file_snapshot(self, path):
        ref = self.file_reference(path)
        if ref:
            self.verify_saved(ref["snapshot"], [path])
        return ref["snapshot"] if ref else None

    def saved_files(self, roots):
        with self.verification_context(roots) as verification:
            return verification.saved_files(roots)

    def verify_legacy(self, snapshot, roots):
        """Only explicitly retained legacy members survive; old whole snapshots do not."""
        ref = self.current_revision("legacy-pin", str(snapshot["snapshotId"]))
        if ref is None:
            raise ValueError("Legacy snapshot was retired by the retention policy")
        value = self.get_revision(ref)
        self._verify_legacy_header(snapshot, value)
        self.verify_saved(ref, roots)

    @staticmethod
    def _verify_legacy_header(snapshot, value):
        if any(value["payload"]["snapshot"][key] != snapshot[key] for key in ("snapshotId", "files", "manifestSha256")):
            raise ValueError("Legacy pin receipt mismatch")
        from catalog_workspace import manifest_digest
        original = value["payload"]["originalMembers"]
        if len(original) != snapshot["files"] or manifest_digest(original.items()) != snapshot["manifestSha256"]:
            raise ValueError("Legacy pin original membership mismatch")

    def restore(self, revision_id, destination, prefix=None):
        destination = unlinked(destination)
        if destination.exists() or destination.is_relative_to(self.repo / "data/source"):
            raise ValueError("Revision restore requires a new non-canonical destination")
        with closing(self.connect()) as db:
            receipt = self._receipt(db, revision_id)
        destination.mkdir(parents=True)
        restored, compact, pending = set(), False, []
        with self.verification_context([]) as verification:
            view = verification.views[0]
            members = verification._revision(view, receipt)["members"]
            if prefix is not None:
                key_path(prefix)
                members = {name: sha for name, sha in members.items() if name == prefix or name.startswith(prefix + "/")}
            if not members:
                raise ValueError("No retained members in requested revision scope")
            pending.extend(members.items())
            while pending:
                name, sha = pending.pop()
                if (name, sha) in restored:
                    continue
                name = key_path(name)
                body = self.read_blob(view[1], sha)
                target = unlinked(destination / name)
                if target.exists() and digest(target.read_bytes()) != sha:
                    target = destination / "data/local/catalog-authoring/restored-versions" / sha
                target.parent.mkdir(parents=True, exist_ok=True)
                if not target.exists():
                    with target.open("xb") as stream:
                        stream.write(body)
                        stream.flush()
                        os.fsync(stream.fileno())
                if digest(target.read_bytes()) != sha:
                    raise ValueError("Restored artifact readback failed")
                restored.add((name, sha))
                if Path(name).name not in {"COMPACT-PUBLICATION.json", "CHECKPOINT.json"}:
                    continue
                value = json.loads(body)
                if value.get("schemaVersion") not in {"catalog-compact-publication-v1", "catalog-compact-publication-v2"}:
                    if Path(name).name == "CHECKPOINT.json":
                        continue
                    raise ValueError("Unknown compact restore format")
                compact = True
                references = [*value["dependencies"], *({"snapshot": ref["snapshot"], "members": {ref["path"]: ref["sha256"]}} for ref in value["sources"].values())]
                for reference in references:
                    saved = verification._revision(view, reference["snapshot"])["members"]
                    for path, expected in reference["members"].items():
                        if saved.get(path) != expected:
                            raise ValueError("Compact restore dependency member changed")
                        pending.append((key_path(path), expected))
        if compact:
            (destination / ".catalog-restore.json").write_text(json.dumps({"schemaVersion": "catalog-restored-workspace-v1", "originalRepositories": [str(self.repo)]}), encoding="utf-8")
        return {"status": "RESTORED", "generation": receipt["generation"], "revisionId": revision_id, "files": len(restored), "destination": str(destination)}

    def checkout(self, revision_id, prefix):
        prefix = key_path(prefix)
        target = unlinked(self.repo / prefix)
        self.key(target)
        if target.exists() or target.is_relative_to(self.repo / "data/source"):
            raise ValueError("Checkout requires an absent non-canonical target")
        with closing(self.connect()) as db:
            receipt = self._receipt(db, revision_id)
        value = self.get_revision(receipt)
        members = {name: sha for name, sha in value["members"].items() if name == prefix or name.startswith(prefix + "/")}
        if not members:
            raise ValueError("No retained files in this revision scope")
        with closing(self.connect()) as db:
            for name, sha in members.items():
                path = unlinked(self.repo / key_path(name))
                path.parent.mkdir(parents=True, exist_ok=True)
                with path.open("xb") as stream:
                    stream.write(self.read_blob(db, sha))
                    stream.flush()
                    os.fsync(stream.fileno())
        return {"status": "CHECKED_OUT", "revisionId": revision_id, "files": len(members), "path": str(target)}

    def verify(self):
        with closing(self.connect()) as db:
            db.execute("BEGIN")
            if db.execute("PRAGMA integrity_check").fetchall() != [("ok",)] or db.execute("PRAGMA foreign_key_check").fetchall():
                raise ValueError("Revision store integrity failure")
            size, count = 0, 0
            for (sha,) in db.execute("SELECT sha256 FROM blob"):
                size += len(self.read_blob(db, sha))
                count += 1
            refs = [self._receipt(db, row[0]) for row in db.execute("SELECT id FROM revision")]
        for ref in refs:
            self.get_revision(ref)
        return {"status": "STORAGE_VERIFIED", "generation": self._generation, "revisions": len(refs), "blobs": count, "uniqueBytes": size}

    @staticmethod
    def _decode_compressed(sha, size, compressed):
        decoder = zlib.decompressobj()
        body = decoder.decompress(compressed, size + 1)
        if not decoder.eof or decoder.unused_data or len(body) != size or digest(body) != sha:
            raise ValueError(f"Corrupt blob: {sha}")
        return body

    def _initial_backup(self, latest):
        pending = latest.with_name(latest.stem + ".revision-pending.sqlite")
        if pending.exists():
            # This is a disposable named copy; the original and previous latest survive.
            pending.unlink()
        with closing(self.connect()) as source, closing(sqlite3.connect(pending)) as target:
            source.backup(target)
            target.execute("PRAGMA journal_mode=DELETE")
            with target:
                watermark = target.execute("SELECT coalesce(max(seq),0) FROM change_log").fetchone()[0]
                target.execute("INSERT INTO store_meta VALUES ('backup_cursor',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(watermark),))
        verification = RevisionWorkspace(self.repo, pending).verify()
        replace_busy_backup(pending, latest)
        return {"status": "BACKED_UP", "generation": self._generation, "mode": "revision-generation",
                "destination": str(latest), "cursor": watermark, "verification": verification}

    def _capture_delta(self, source, cursor, watermark, spool):
        changes = source.execute("SELECT seq,entity,key1,key2 FROM change_log WHERE seq>? AND seq<=? ORDER BY seq", (cursor, watermark)).fetchall()
        keys = {(entity, first, second) for _, entity, first, second in changes}
        delta = {"changes": changes, "blobs": {}, "revisions": {}, "heads": {}, "ownership": {}, "dependencies": {}, "bytes": 0}
        for entity, first, second in sorted(keys):
            if entity == "blob":
                row = source.execute("SELECT byte_length,content FROM blob WHERE sha256=?", (first,)).fetchone()
                if row is None:
                    delta["blobs"][first] = None
                else:
                    size, compressed = row
                    self._decode_compressed(first, size, compressed)
                    offset = spool.tell()
                    spool.write(compressed)
                    delta["blobs"][first] = size, offset, len(compressed)
                    delta["bytes"] += len(compressed)
            elif entity == "revision":
                row = source.execute("SELECT rowid,* FROM revision WHERE id=?", (first,)).fetchone()
                delta["revisions"][first] = None if row is None else (row, source.execute("SELECT * FROM revision_blob WHERE revision_id=? ORDER BY path", (first,)).fetchall())
            elif entity == "head":
                delta["heads"][(first, second)] = source.execute("SELECT * FROM head WHERE kind=? AND subject=?", (first, second)).fetchone()
            elif entity == "ownership":
                delta["ownership"][(first, second)] = source.execute("SELECT * FROM execution_artifact WHERE execution_id=? AND artifact_id=?", (first, second)).fetchone()
            elif entity == "dependency":
                delta["dependencies"][(first, second)] = source.execute("SELECT * FROM revision_dependency WHERE owner_id=? AND target_id=?", (first, second)).fetchone()
            else:
                raise ValueError("Unknown authoring change entity")
        return delta

    def _apply_delta(self, target, delta, spool, cursor, watermark):
        target.execute("BEGIN IMMEDIATE")
        target.execute("PRAGMA defer_foreign_keys=ON")
        for sha, entry in delta["blobs"].items():
            if entry is not None:
                size, offset, length = entry
                spool.seek(offset)
                compressed = spool.read(length)
                target.execute("INSERT INTO blob VALUES (?,?,?) ON CONFLICT(sha256) DO UPDATE SET byte_length=excluded.byte_length,content=excluded.content", (sha, size, compressed))
        for (execution, artifact), row in delta["ownership"].items():
            if row is None:
                target.execute("DELETE FROM execution_artifact WHERE execution_id=? AND artifact_id=?", (execution, artifact))
        for (owner, dependency), row in delta["dependencies"].items():
            if row is None:
                target.execute("DELETE FROM revision_dependency WHERE owner_id=? AND target_id=?", (owner, dependency))
        for (kind, subject), row in delta["heads"].items():
            if row is None:
                target.execute("DELETE FROM head WHERE kind=? AND subject=?", (kind, subject))
        for rid, entry in delta["revisions"].items():
            target.execute("DELETE FROM revision_blob WHERE revision_id=?", (rid,))
            if entry is None:
                target.execute("DELETE FROM revision WHERE id=?", (rid,))
        for entry in sorted((entry for entry in delta["revisions"].values() if entry is not None), key=lambda entry: entry[0][0]):
            (_, *row), members = entry
            target.execute("INSERT INTO revision VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET terminal=excluded.terminal,pinned=excluded.pinned,created_at=excluded.created_at", row)
            actual = target.execute("SELECT * FROM revision WHERE id=?", (row[0],)).fetchone()
            if actual != tuple(row):
                raise ValueError("Immutable backup revision changed")
            target.executemany("INSERT INTO revision_blob VALUES (?,?,?)", members)
            value = json.loads(self.read_blob(target, row[3]))
            if value["members"] != {path: sha for _, path, sha in members}:
                raise ValueError("Backup revision membership mismatch")
        for row in delta["heads"].values():
            if row is not None:
                target.execute("INSERT INTO head VALUES (?,?,?) ON CONFLICT(kind,subject) DO UPDATE SET revision_id=excluded.revision_id", row)
        for row in delta["ownership"].values():
            if row is not None:
                target.execute("INSERT OR IGNORE INTO execution_artifact VALUES (?,?)", row)
        for row in delta["dependencies"].values():
            if row is not None:
                target.execute("INSERT OR IGNORE INTO revision_dependency VALUES (?,?)", row)
        for sha, entry in delta["blobs"].items():
            if entry is None:
                target.execute("DELETE FROM blob WHERE sha256=?", (sha,))
            else:
                self.read_blob(target, sha)
        # Replication triggers ran normally. Replace only their uncommitted tail
        # with the exact source journal so restoring latest also restores lineage.
        target.execute("DELETE FROM change_log WHERE seq>?", (cursor,))
        target.executemany("INSERT INTO change_log(seq,entity,key1,key2) VALUES (?,?,?,?)", delta["changes"])
        target.execute("UPDATE sqlite_sequence SET seq=? WHERE name='change_log'", (watermark,))
        target.execute("INSERT INTO store_meta VALUES ('backup_cursor',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(watermark),))
        target.commit()

    def backup(self, destination=None):
        operation_started = perf_counter()
        if self.database == self.repo / "data/local/catalog-authoring/workspace.sqlite":
            from catalog_retention import retain_recovery_controls
            retain_recovery_controls(self)
        controls_elapsed = perf_counter() - operation_started
        root = self.repo / "data/local/catalog-authoring/backups"
        root.mkdir(parents=True, exist_ok=True)
        latest = unlinked(destination or root / "latest.sqlite")
        if latest.parent != root or latest == self.database:
            raise ValueError("Revision backup must be a separate file in the configured backup directory")
        lock_started = perf_counter()
        with exclusive_file(root / "rotation.lock"):
            acquired = perf_counter()
            with closing(self.connect()) as source:
                if source.execute("PRAGMA user_version").fetchone()[0] != VERSION:
                    raise ValueError("Schema v3 is read-only; explicitly upgrade_v4 before backup")
                origin = source.execute("SELECT value FROM store_meta WHERE key='journal_origin'").fetchone()[0]
            initialize = not latest.exists()
            cursor = 0
            if not initialize:
                # Opening our designated backup read/write lets SQLite recover a
                # hot rollback journal left by a killed delta transaction. A
                # read-only first open cannot perform that recovery on Windows.
                with closing(sqlite3.connect(latest.as_uri() + "?mode=rw", uri=True, timeout=300)) as previous:
                    if (previous.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID
                            or previous.execute("PRAGMA user_version").fetchone()[0] not in (3, VERSION)):
                        raise ValueError("Not a supported authoring revision backup")
                    generation = previous.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
                    if generation != self._generation:
                        raise ValueError("Initialize a separate backup for the new retention generation")
                    old_origin = previous.execute("SELECT value FROM store_meta WHERE key='journal_origin'").fetchone()
                    initialize = old_origin is None or old_origin[0] != origin
                    if not initialize:
                        value = previous.execute("SELECT value FROM store_meta WHERE key='backup_cursor'").fetchone()
                        if value is None:
                            raise ValueError("Existing revision backup has no verified cursor")
                        cursor = int(value[0])
                        if previous.execute("SELECT coalesce(max(seq),0) FROM change_log").fetchone()[0] != cursor:
                            raise ValueError("Backup advanced outside its source cursor; preserve and repair the divergent copy")
                        if cursor:
                            prior_change = previous.execute("SELECT * FROM change_log WHERE seq=?", (cursor,)).fetchone()
                            with closing(self.connect()) as source:
                                if prior_change != source.execute("SELECT * FROM change_log WHERE seq=?", (cursor,)).fetchone():
                                    raise ValueError("Backup change cursor belongs to a divergent source history")
            if initialize:
                result = self._initial_backup(latest)
            else:
                with tempfile.SpooledTemporaryFile(max_size=16 * 1024 * 1024) as spool:
                    capture_start = perf_counter()
                    with closing(self.connect()) as source:
                        source.execute("BEGIN")
                        watermark = source.execute("SELECT coalesce(max(seq),0) FROM change_log").fetchone()[0]
                        if cursor > watermark:
                            raise ValueError("Backup cursor is ahead of its source")
                        delta = self._capture_delta(source, cursor, watermark, spool)
                    captured = perf_counter()
                    if watermark == cursor:
                        result = {"status": "BACKED_UP", "generation": self._generation, "mode": "reused", "destination": str(latest), "cursor": cursor,
                                  "verificationScope": "committed change cursor; callers verify actual phase members"}
                    else:
                        with closing(RevisionWorkspace(self.repo, latest).connect(write=True)) as target:
                            try:
                                self._apply_delta(target, delta, spool, cursor, watermark)
                            except BaseException:
                                target.rollback()
                                raise
                        with closing(RevisionWorkspace(self.repo, latest).connect()) as readback:
                            if readback.execute("SELECT value FROM store_meta WHERE key='backup_cursor'").fetchone()[0] != str(watermark):
                                raise ValueError("Backup commit cursor readback failed")
                        result = {"status": "BACKED_UP", "generation": self._generation, "mode": "revision-incremental", "destination": str(latest), "cursor": watermark,
                                  "verification": {"status": "INCREMENTAL_STORAGE_VERIFIED", "newBlobs": sum(value is not None for value in delta["blobs"].values()), "changedRevisions": len(delta["revisions"]), "copiedBytes": delta["bytes"]}}
                    result["timingsSeconds"] = {"capture": captured - capture_start, "applyReadback": perf_counter() - captured}
            result.setdefault("timingsSeconds", {}).update(controlsElapsed=controls_elapsed,
                lockWait=acquired - lock_started, totalElapsed=perf_counter() - operation_started)
            return result

    def persist(self, paths, label, *, phase_boundary=False, reuse=False, execution=None):
        # Bind this caller's own scope. Reusing another execution's receipt would
        # make its retention lifetime an implicit dependency. Bytes still dedupe.
        if execution is not None:
            roots = self._transient_roots(self.get_revision(execution)["payload"])
            if any(not self._within_transient(self.key(path), roots) for path in self.files(paths)):
                raise ValueError("Transient execution cannot own files outside its declared scopes")
        receipt = self.save(paths, label, kind="execution-artifact" if execution is not None else "artifact", execution=execution)
        backup = self.backup() if phase_boundary else {"status": "PERSISTED", "generation": self._generation}
        with self.verification_context(paths, backup=phase_boundary) as verification:
            verification.verify_saved(receipt, paths)
            references = [{"snapshot": receipt, "members": {self.key(path): sha for path, (sha, _) in verification.inventory.items()}}]
        return {"snapshot": receipt,
                "status": backup["status"], "backup": backup, "references": references}

    def own_execution_artifacts(self, execution, artifacts):
        """Record ownership without granting permission to retire semantic heads."""
        with closing(self.connect(write=True)) as db, db:
            db.execute("BEGIN IMMEDIATE")
            self._bind_execution_artifacts(db, execution, artifacts)

    def _bind_execution_artifacts(self, db, execution, artifacts, *, require_existing=False):
        owner = db.execute("SELECT kind,terminal,payload_sha256 FROM revision WHERE id=?", (execution["revisionId"],)).fetchone()
        if (execution["generation"] != self._generation or owner is None or owner[0] != "execution"
                or owner[2] != execution["payloadSha256"]):
            raise ValueError("Execution artifact owner must be a current-generation execution")
        for artifact in artifacts:
            if artifact is None:
                continue
            row = db.execute("SELECT kind FROM revision WHERE id=?", (artifact["revisionId"],)).fetchone()
            if artifact["generation"] != self._generation or row not in {("artifact",), ("execution-artifact",)}:
                raise ValueError("Execution can only own an existing artifact revision")
            if row == ("execution-artifact",):
                roots = self._transient_roots(json.loads(self.read_blob(db, owner[2]))["payload"])
                if owner[1] or any(not self._within_transient(path, roots) for path, in db.execute(
                        "SELECT path FROM revision_blob WHERE revision_id=?", (artifact["revisionId"],))):
                    raise ValueError("Transient ownership requires an open execution and declared member scopes")
            values = execution["revisionId"], artifact["revisionId"]
            if require_existing:
                if not db.execute("SELECT 1 FROM execution_artifact WHERE execution_id=? AND artifact_id=?", values).fetchone():
                    raise ValueError("Transient ownership was not atomically retained")
            else:
                db.execute("INSERT OR IGNORE INTO execution_artifact VALUES (?,?)", values)

    @staticmethod
    def _transient_roots(payload):
        roots = payload.get("disposableRoots")
        if (payload.get("schemaVersion") != "authoring-transient-execution-v1" or not isinstance(roots, list)
                or not roots or len(set(roots)) != len(roots)):
            raise ValueError("Missing explicit transient execution scopes")
        for root in roots:
            if (not isinstance(root, str) or key_path(root) != root
                    or not root.startswith((".workspace/", "data/local/catalog-authoring/artifacts/"))):
                raise ValueError("Invalid transient execution scope")
        return roots

    @staticmethod
    def _within_transient(path, roots):
        return any(path == root or path.startswith(root + "/") for root in roots)

    def _transient_candidates(self, db, execution_id, legacy_watermark=0):
        row = db.execute("SELECT payload_sha256 FROM revision WHERE id=?", (execution_id,)).fetchone()
        roots = self._transient_roots(json.loads(self.read_blob(db, row[0]))["payload"])
        owned = {row[0] for row in db.execute("SELECT artifact_id FROM execution_artifact WHERE execution_id=?", (execution_id,))}
        eligible = set()
        for rid in owned:
            safe = db.execute("""SELECT 1 FROM revision r WHERE id=? AND kind='execution-artifact' AND pinned=0 AND rowid>?
                AND NOT EXISTS(SELECT 1 FROM execution_artifact WHERE artifact_id=r.id AND execution_id<>?)
                AND NOT EXISTS(SELECT 1 FROM revision WHERE previous_id=r.id)""", (rid, legacy_watermark, execution_id)).fetchone()
            if safe and all(self._within_transient(path, roots) for path, in db.execute(
                    "SELECT path FROM revision_blob WHERE revision_id=?", (rid,))):
                eligible.add(rid)
        # A live semantic or other execution dependency protects the referenced
        # copy. Internal transient dependencies can be retired together.
        while True:
            blocked = {rid for rid in eligible if any(owner not in eligible for owner, in db.execute(
                "SELECT owner_id FROM revision_dependency WHERE target_id=?", (rid,)))}
            if not blocked:
                break
            eligible.difference_update(blocked)
        if db.execute("SELECT 1 FROM revision_dependency WHERE target_id=? LIMIT 1", (execution_id,)).fetchone():
            eligible.clear()
        return roots, owned, eligible

    def close_transient_execution(self, execution):
        """Close one verified lifetime; terminal is mutable revision metadata."""
        self._transient_roots(self.get_revision(execution)["payload"])
        with closing(self.connect(write=True)) as db, db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT kind FROM revision WHERE id=?", (execution["revisionId"],)).fetchone()
            if row != ("execution",):
                raise ValueError("Transient lifecycle owner is not an execution")
            db.execute("UPDATE revision SET terminal=1,created_at=? WHERE id=? AND terminal=0", (utc_now(), execution["revisionId"]))

    def retire_transient_files(self, execution):
        """Remove only declared, saved, backed-up copies after verified completion."""
        self.get_revision(execution)
        backup = RevisionWorkspace(self.repo, self.repo / "data/local/catalog-authoring/backups/latest.sqlite")
        expected, protected = {}, set()
        with closing(self.connect()) as db, closing(backup.connect()) as saved:
            if db.execute("SELECT terminal FROM revision WHERE id=?", (execution["revisionId"],)).fetchone() != (1,):
                raise ValueError("Unfinished transient execution cannot retire files")
            if saved.execute("SELECT terminal,payload_sha256 FROM revision WHERE id=?", (execution["revisionId"],)).fetchone() != (1, execution["payloadSha256"]):
                raise ValueError("Transient completion is not backed up")
            roots, owned, eligible = self._transient_candidates(db, execution["revisionId"])
            for rid in owned:
                for path, sha in db.execute("SELECT path,sha256 FROM revision_blob WHERE revision_id=?", (rid,)):
                    if rid not in eligible:
                        protected.add(path)
                    else:
                        expected.setdefault(path, set()).add(sha)
            removed, preserved = [], []
            for name in roots:
                root = unlinked(self.repo / name)
                if not root.exists():
                    continue
                if not root.is_dir():
                    raise ValueError("Declared transient scope is not a directory")
                for path in self.files([root]):
                    key = self.key(path)
                    if key in protected or key not in expected:
                        preserved.append({"path": key, "reason": "live-reference" if key in protected else "unrecorded"})
                        continue
                    body = path.read_bytes()
                    sha = digest(body)
                    if sha not in expected[key]:
                        preserved.append({"path": key, "reason": "changed"})
                        continue
                    # Read the actual recovery bytes before deleting the file.
                    if backup.read_blob(saved, sha) != body:
                        raise ValueError("Transient backup readback differs")
                    if path.read_bytes() != body:
                        raise ValueError("Transient file changed during retirement")
                    path.unlink()
                    removed.append({"path": key, "sha256": sha})
                for directory in sorted([p for p in root.rglob("*") if p.is_dir()], key=lambda p: len(p.parts), reverse=True):
                    if not directory.is_symlink() and not any(directory.iterdir()):
                        directory.rmdir()
                if not any(root.iterdir()):
                    root.rmdir()
        return {"status": "RETIRED" if not preserved else "PARTIALLY_RETAINED", "removed": removed, "preserved": preserved}

    def gc(self, *, days=7, now=None, apply=False):
        """Expire only successful terminal execution records; evidence/history stays rooted."""
        if days < 1:
            raise ValueError("Execution retention must be positive")
        cutoff = ((now or datetime.now(timezone.utc)) - timedelta(days=days)).isoformat()
        # Filesystem probes precede the SQLite writer. The ordinary GC entry
        # point holds publication ownership, preventing a normal publisher from
        # recreating these closed scopes while their metadata is committed.
        physical_state = {}
        with closing(self.connect()) as prepared:
            legacy = prepared.execute("SELECT value FROM store_meta WHERE key='legacy_revision_max_rowid'").fetchone()
            watermark = int(legacy[0]) if legacy else 0
            for rid, sha in prepared.execute("SELECT id,payload_sha256 FROM revision WHERE kind='execution' AND terminal=1 AND pinned=0 AND created_at<? AND rowid>?", (cutoff, watermark)):
                payload = json.loads(self.read_blob(prepared, sha))["payload"]
                if payload.get("schemaVersion") == "authoring-transient-execution-v1":
                    roots = self._transient_roots(payload)
                    physical_state[rid] = (sha, any(unlinked(self.repo / name).exists() for name in roots))
        with closing(self.connect(write=apply)) as db:
            db.execute("BEGIN IMMEDIATE" if apply else "BEGIN")
            modern = db.execute("PRAGMA user_version").fetchone()[0] == VERSION
            legacy = db.execute("SELECT value FROM store_meta WHERE key='legacy_revision_max_rowid'").fetchone()
            legacy_watermark = int(legacy[0]) if legacy else 0
            dependency_guard = "AND NOT EXISTS(SELECT 1 FROM revision_dependency WHERE target_id=r.id)" if modern else ""
            removable = [row[0] for row in db.execute("SELECT id FROM revision r WHERE kind='execution' AND terminal=1 AND pinned=0 AND created_at<? AND r.rowid>? AND NOT EXISTS(SELECT 1 FROM revision child WHERE child.previous_id=r.id) " + dependency_guard, (cutoff, legacy_watermark))]
            artifacts = set()
            transient = {}
            cleanup_pending = set()
            if modern:
                for rid in removable:
                    payload_sha = db.execute("SELECT payload_sha256 FROM revision WHERE id=?", (rid,)).fetchone()[0]
                    payload = json.loads(self.read_blob(db, payload_sha))["payload"]
                    if payload.get("schemaVersion") == "authoring-transient-execution-v1":
                        roots, owned, eligible = self._transient_candidates(db, rid, legacy_watermark)
                        # Keep the owner and recovery bytes if filesystem cleanup
                        # was interrupted or deliberately preserved changed files.
                        if physical_state.get(rid) != (payload_sha, False):
                            cleanup_pending.add(rid)
                            eligible.clear()
                        transient[rid] = (owned, eligible)
                    else:
                        artifacts.update(row[0] for row in db.execute("SELECT artifact_id FROM execution_artifact WHERE execution_id=?", (rid,)))
            blocked = [rid for rid, (owned, eligible) in transient.items() if owned - eligible or rid in cleanup_pending]
            removable = [rid for rid in removable if rid not in blocked]
            if apply:
                retired = []
                for rid, (_, eligible) in transient.items():
                    for artifact in eligible:
                        db.execute("DELETE FROM revision_dependency WHERE owner_id=?", (artifact,))
                    for artifact in eligible:
                        db.execute("DELETE FROM execution_artifact WHERE execution_id=? AND artifact_id=?", (rid, artifact))
                        db.execute("DELETE FROM head WHERE revision_id=?", (artifact,))
                        db.execute("DELETE FROM revision_blob WHERE revision_id=?", (artifact,))
                        db.execute("DELETE FROM revision WHERE id=?", (artifact,))
                        retired.append(artifact)
                for rid in removable:
                    db.execute("DELETE FROM execution_artifact WHERE execution_id=?", (rid,))
                    db.execute("DELETE FROM revision_dependency WHERE owner_id=?", (rid,))
                    db.execute("DELETE FROM head WHERE revision_id=?", (rid,))
                    db.execute("DELETE FROM revision_blob WHERE revision_id=?", (rid,))
                    db.execute("DELETE FROM revision WHERE id=?", (rid,))
                for rid in sorted(artifacts):
                    # Current heads, meaningful history, other executions and
                    # legacy artifacts without explicit ownership stay protected.
                    eligible = db.execute("""SELECT 1 FROM revision r WHERE id=? AND kind='artifact' AND pinned=0 AND rowid>?
                        AND NOT EXISTS(SELECT 1 FROM head WHERE revision_id=r.id)
                        AND NOT EXISTS(SELECT 1 FROM execution_artifact WHERE artifact_id=r.id)
                        AND NOT EXISTS(SELECT 1 FROM revision_dependency WHERE target_id=r.id)
                        AND NOT EXISTS(SELECT 1 FROM revision WHERE previous_id=r.id)""", (rid, legacy_watermark)).fetchone()
                    if eligible:
                        db.execute("DELETE FROM revision_dependency WHERE owner_id=?", (rid,))
                        db.execute("DELETE FROM revision_blob WHERE revision_id=?", (rid,))
                        db.execute("DELETE FROM revision WHERE id=?", (rid,))
                        retired.append(rid)
                db.execute("DELETE FROM blob WHERE sha256 NOT IN (SELECT payload_sha256 FROM revision UNION SELECT sha256 FROM revision_blob)")
                db.commit()
            return {"status": "GC_APPLIED" if apply else "GC_PREVIEW", "expiredExecutionRevisions": removable,
                    "retiredOwnedArtifacts": retired if apply else [], "blockedExecutionRevisions": blocked, "cutoff": cutoff}
    is_revision_store = True
