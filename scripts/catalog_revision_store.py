"""Generation-bound authoring revisions; execution history is not curation history."""
from __future__ import annotations

from contextlib import closing
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import sqlite3
import uuid
import re

from catalog_workspace import Workspace, APPLICATION_ID, digest, exclusive_file, key_path, unlinked, utc_now

VERSION = 3
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


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")


class RevisionWorkspace(Workspace):
    """Same local storage boundary, with explicit revision receipts instead of snapshot IDs."""

    @classmethod
    def create(cls, repo, database):
        store = cls(repo, database)
        store.database.parent.mkdir(parents=True, exist_ok=True)
        with store.database.open("xb"):
            pass
        with closing(sqlite3.connect(store.database)) as db:
            db.executescript(f"BEGIN IMMEDIATE;{SCHEMA}PRAGMA application_id={APPLICATION_ID};PRAGMA user_version={VERSION};COMMIT;")
            with db:
                db.executemany("INSERT INTO store_meta VALUES (?,?)", [
                    ("generation", str(uuid.uuid4())), ("policy", "curation-evidence-active-v1")])
        return store

    def connect(self, *, write=False):
        if write and self.database == self.repo / "data/local/catalog-authoring/workspace.sqlite" and (self.database.parent / "RETENTION-MAINTENANCE.json").exists():
            raise ValueError("Authoring retention cutover is in progress; resume after its STATE/backup readback")
        if not self.database.is_file():
            raise FileNotFoundError(self.database)
        db = sqlite3.connect(self.database.as_uri() + ("?mode=rw" if write else "?mode=ro"), uri=True, timeout=300)
        try:
            db.execute("PRAGMA foreign_keys=ON")
            if (db.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID
                    or db.execute("PRAGMA user_version").fetchone()[0] != VERSION):
                raise ValueError("Authoring store generation/schema changed; reopen with current code")
            generation = db.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0]
            if hasattr(self, "_generation") and self._generation != generation:
                raise ValueError("Authoring store generation changed during operation")
            self._generation = generation
            if write:
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

    def put_revision(self, kind, subject, payload, members=None, *, terminal=False, pinned=False, _db=None):
        """Actual semantic content decides identity; timestamps are provenance only."""
        if _db is None:
            with closing(self.connect(write=True)) as db, db:
                db.execute("BEGIN IMMEDIATE")
                return self.put_revision(kind, subject, payload, members, terminal=terminal, pinned=pinned, _db=db)
        if kind not in {"curation", "collection", "decision", "active", "completion", "artifact", "execution", "legacy-pin"} or not subject:
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
        if old and old[1:] == (sha, int(terminal), int(pinned)):
            self.read_blob(db, sha)
            for member in set(members.values()):
                self.read_blob(db, member)
            return self._receipt(db, old[0])
        for member in set(members.values()):
            if db.execute("SELECT 1 FROM blob WHERE sha256=?", (member,)).fetchone() is None:
                raise ValueError(f"Revision references missing retained bytes: {member}")
        self.add_blob(db, body)
        rid = str(uuid.uuid4())
        previous = old[0] if old and kind in {"curation", "collection", "decision"} else None
        db.execute("INSERT INTO revision VALUES (?,?,?,?,?,?,?,?)", (rid, kind, subject, sha, previous, utc_now(), int(terminal), int(pinned)))
        db.executemany("INSERT INTO revision_blob VALUES (?,?,?)", [(rid, path, member) for path, member in sorted(members.items())])
        db.execute("INSERT INTO head VALUES (?,?,?) ON CONFLICT(kind,subject) DO UPDATE SET revision_id=excluded.revision_id", (kind, subject, rid))
        return self._receipt(db, rid)

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
        if not artifacts or not label.strip():
            raise ValueError("A named artifact set is required")
        for name in artifacts:
            self.key(self.repo / key_path(name))
        with closing(self.connect(write=True)) as db, db:
            db.execute("BEGIN IMMEDIATE")
            members = {name: self.add_blob(db, body) for name, body in artifacts.items()}
            return self.put_revision("artifact", label + ":" + digest(encoded(sorted(members))), {"label": label}, members, _db=db)

    def save(self, roots, label, *, kind="artifact", terminal=False):
        if not roots or not label.strip():
            raise ValueError("Save requires explicit roots and a label")
        inventory = self._inventory(roots)
        # Blobs and their owning revision commit together; GC cannot see a gap.
        with closing(self.connect(write=True)) as db, db:
            db.execute("BEGIN IMMEDIATE")
            seen = set()
            for path, (sha, _) in inventory.items():
                if path.suffix == ".sqlite" and any(Path(str(path) + suffix).exists() for suffix in ("-wal", "-shm", "-journal")):
                    raise ValueError(f"Close/checkpoint the source SQLite before capturing exact bytes: {path}")
                if sha not in seen:
                    body = path.read_bytes()
                    if digest(body) != sha:
                        raise ValueError("Artifact changed before revision save")
                    self.add_blob(db, body)
                    seen.add(sha)
            self._assert_inventory(roots, inventory)
            members = {path.relative_to(self.repo).as_posix(): value[0] for path, value in inventory.items()}
            subject = label + ":" + digest(encoded(sorted(self.key(root) for root in roots)))
            return self.put_revision(kind, subject, {"label": label}, members, terminal=terminal, _db=db)

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
        if "snapshotId" in receipt:
            return self.verify_legacy(receipt, roots)
        inventory = self._inventory(roots)
        value = self.get_revision(receipt)
        with closing(self.connect()) as db:
            db.execute("BEGIN")
            seen = set()
            for path, (sha, size) in inventory.items():
                if value["members"].get(path.relative_to(self.repo).as_posix()) != sha:
                    raise ValueError("Requested artifacts differ from retained revision")
                if sha not in seen:
                    if len(self.read_blob(db, sha)) != size:
                        raise ValueError("Retained artifact length mismatch")
                    seen.add(sha)
        self._assert_inventory(roots, inventory)

    def saved_file_snapshot(self, path):
        ref = self.file_reference(path)
        if ref:
            self.verify_saved(ref["snapshot"], [path])
        return ref["snapshot"] if ref else None

    def saved_files(self, roots):
        inventory, groups, missing = self._inventory(roots), {}, []
        for path, (sha, _) in inventory.items():
            ref = self.file_reference(path, sha)
            if ref is None:
                missing.append(path)
            else:
                groups.setdefault(ref["snapshot"]["revisionId"], (ref["snapshot"], []))[1].append(path)
        for receipt, paths in groups.values():
            self.verify_saved(receipt, paths)
        self._assert_inventory(roots, inventory)
        return list(groups.values()), missing

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
        members = self.get_revision(receipt)["members"]
        if prefix is not None:
            key_path(prefix)
            members = {path: sha for path, sha in members.items() if path == prefix or path.startswith(prefix + "/")}
        if not members:
            raise ValueError("No retained members in requested revision scope")
        destination.mkdir(parents=True)
        with closing(self.connect()) as db:
            for path, sha in members.items():
                target = unlinked(destination / key_path(path))
                target.parent.mkdir(parents=True, exist_ok=True)
                with target.open("xb") as stream:
                    stream.write(self.read_blob(db, sha))
                    stream.flush()
                    os.fsync(stream.fileno())
        return {"status": "RESTORED", "generation": receipt["generation"], "revisionId": revision_id, "files": len(members), "destination": str(destination)}

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

    def backup(self, destination=None):
        root = self.repo / "data/local/catalog-authoring/backups"
        root.mkdir(parents=True, exist_ok=True)
        latest = unlinked(destination or root / "latest.sqlite")
        if latest.parent != root or latest == self.database:
            raise ValueError("Revision backup must be a separate file in the configured backup directory")
        pending = latest.with_name(latest.stem + ".revision-pending.sqlite")
        with exclusive_file(root / "rotation.lock"):
            with closing(self.connect()) as source:
                source.execute("BEGIN")
                identity = source.execute("SELECT * FROM revision ORDER BY id").fetchall()
                heads = source.execute("SELECT * FROM head ORDER BY kind,subject").fetchall()
                if latest.exists():
                    with closing(RevisionWorkspace(self.repo, latest).connect()) as previous:
                        if previous.execute("SELECT value FROM store_meta WHERE key='generation'").fetchone()[0] != self._generation:
                            raise ValueError("Initialize a separate backup for the new retention generation")
                        same = (previous.execute("SELECT * FROM revision ORDER BY id").fetchall() == identity
                                and previous.execute("SELECT * FROM head ORDER BY kind,subject").fetchall() == heads)
                    if same:
                        return {"status": "BACKED_UP", "generation": self._generation, "mode": "reused", "destination": str(latest),
                                "verificationScope": "revision identities; callers verify the actual phase members"}
                if pending.exists():
                    if not latest.is_file():
                        # Only recovery pays for another complete source audit.
                        # Once the original is verified this named partial copy
                        # can be rebuilt without discarding the recovery source.
                        self.verify()
                    # A committed latest remains the recovery point. This named
                    # pending file is a rebuildable copy, never original evidence.
                    pending.unlink()
                with closing(sqlite3.connect(pending)) as target:
                    if not latest.is_file():
                        source.backup(target)
                        added = None
                    else:
                        with closing(RevisionWorkspace(self.repo, latest).connect()) as previous:
                            previous.backup(target)
                        target.execute("PRAGMA foreign_keys=ON")
                        old_blobs = dict(target.execute("SELECT sha256,byte_length FROM blob"))
                        source_blobs = dict(source.execute("SELECT sha256,byte_length FROM blob"))
                        added = set(source_blobs) - set(old_blobs)
                        with target:
                            for sha in added:
                                self.read_blob(source, sha)
                                size, body = source.execute("SELECT byte_length,content FROM blob WHERE sha256=?", (sha,)).fetchone()
                                target.execute("INSERT INTO blob VALUES (?,?,?)", (sha, size, body))
                            if any(old_blobs[sha] != size for sha, size in source_blobs.items() if sha in old_blobs):
                                raise ValueError("Retained backup blob metadata changed")
                            current = {row[0]: row for row in source.execute("SELECT * FROM revision ORDER BY rowid")}
                            previous = {row[0]: row for row in target.execute("SELECT * FROM revision")}
                            target.execute("DELETE FROM head")
                            for rid in set(previous) - set(current):
                                target.execute("DELETE FROM revision_blob WHERE revision_id=?", (rid,))
                                target.execute("DELETE FROM revision WHERE id=?", (rid,))
                            for rid, row in current.items():
                                if rid in previous:
                                    if row[:6] != previous[rid][:6]:
                                        raise ValueError("Immutable revision changed since its backup")
                                    target.execute("UPDATE revision SET terminal=?,pinned=? WHERE id=?", (*row[6:], rid))
                                    continue
                                target.execute("INSERT INTO revision VALUES (?,?,?,?,?,?,?,?)", row)
                                target.executemany("INSERT INTO revision_blob VALUES (?,?,?)", source.execute("SELECT * FROM revision_blob WHERE revision_id=?", (rid,)))
                            target.executemany("INSERT INTO head VALUES (?,?,?)", heads)
                            target.executemany("DELETE FROM blob WHERE sha256=?", [(sha,) for sha in set(old_blobs) - set(source_blobs)])
                        if target.execute("PRAGMA quick_check").fetchall() != [("ok",)] or target.execute("PRAGMA foreign_key_check").fetchall():
                            raise ValueError("Incremental revision backup integrity failure")
                        for sha in added:
                            self.read_blob(target, sha)
                        for rid in set(current) - set(previous):
                            row = current[rid]
                            value = json.loads(self.read_blob(target, row[3]))
                            if value["members"] != dict(target.execute("SELECT path,sha256 FROM revision_blob WHERE revision_id=?", (rid,))):
                                raise ValueError("Backup revision membership mismatch")
            verification = (RevisionWorkspace(self.repo, pending).verify() if added is None else
                            {"status": "INCREMENTAL_STORAGE_VERIFIED", "newBlobs": len(added)})
            os.replace(pending, latest)
            return {"status": "BACKED_UP", "generation": self._generation, "mode": "revision-generation" if added is None else "revision-incremental", "destination": str(latest), "verification": verification}

    def persist(self, paths, label, *, phase_boundary=False, reuse=False):
        # Bind this caller's own scope. Reusing another execution's receipt would
        # make its retention lifetime an implicit dependency. Bytes still dedupe.
        groups = [(self.save(paths, label), paths)]
        references = []
        for receipt, roots in groups:
            self.verify_saved(receipt, roots)
            inventory = self._inventory(roots)
            references.append({"snapshot": receipt, "members": {self.key(path): sha for path, (sha, _) in inventory.items()}})
        backup = self.backup() if phase_boundary else {"status": "PERSISTED", "generation": self._generation}
        if phase_boundary:
            saved = RevisionWorkspace(self.repo, Path(backup["destination"]))
            for receipt, roots in groups:
                saved.verify_saved(receipt, roots)
        receipts = [item[0] for item in groups]
        return {**({"snapshot": receipts[0]} if len(receipts) == 1 else {"snapshots": receipts}),
                "status": backup["status"], "backup": backup, "references": references}

    def gc(self, *, days=7, now=None, apply=False):
        """Expire only successful terminal execution records; evidence/history stays rooted."""
        if days < 1:
            raise ValueError("Execution retention must be positive")
        cutoff = ((now or datetime.now(timezone.utc)) - timedelta(days=days)).isoformat()
        with closing(self.connect(write=apply)) as db:
            db.execute("BEGIN IMMEDIATE" if apply else "BEGIN")
            removable = [row[0] for row in db.execute("SELECT id FROM revision r WHERE kind='execution' AND terminal=1 AND pinned=0 AND created_at<? AND NOT EXISTS(SELECT 1 FROM revision child WHERE child.previous_id=r.id)", (cutoff,))]
            if apply:
                for rid in removable:
                    db.execute("DELETE FROM head WHERE revision_id=?", (rid,))
                    db.execute("DELETE FROM revision_blob WHERE revision_id=?", (rid,))
                    db.execute("DELETE FROM revision WHERE id=?", (rid,))
                db.execute("DELETE FROM blob WHERE sha256 NOT IN (SELECT payload_sha256 FROM revision UNION SELECT sha256 FROM revision_blob)")
                db.commit()
            return {"status": "GC_APPLIED" if apply else "GC_PREVIEW", "expiredExecutionRevisions": removable, "cutoff": cutoff}
    is_revision_store = True
