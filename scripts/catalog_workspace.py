#!/usr/bin/env python3
"""Durable, versioned local storage for offline Catalog authoring artifacts.

SQLite owns saved bytes; legacy files are editable/materialized working copies.
This store never interprets claims or grants publication authority.
"""
from __future__ import annotations

import argparse
import errno
import hashlib
import json
import os
import shutil
import sqlite3
import stat
import subprocess
import sys
import uuid
import zlib
from contextlib import closing, contextmanager, nullcontext
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from time import perf_counter, sleep
from workspace_paths import artifact_path

REPO = Path(__file__).resolve().parents[1]
APPLICATION_ID = 0x4B435753
SCHEMA_VERSION = 1
SCHEMA = """
CREATE TABLE blob (
    sha256 TEXT PRIMARY KEY CHECK(length(sha256) = 64),
    byte_length INTEGER NOT NULL CHECK(byte_length >= 0),
    content BLOB NOT NULL
) STRICT;
CREATE TABLE snapshot (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL,
    label TEXT NOT NULL,
    roots_json TEXT NOT NULL,
    file_count INTEGER NOT NULL,
    manifest_sha256 TEXT NOT NULL CHECK(length(manifest_sha256) = 64)
) STRICT;
CREATE TABLE entry (
    snapshot_id INTEGER NOT NULL REFERENCES snapshot(id),
    path TEXT NOT NULL,
    sha256 TEXT NOT NULL REFERENCES blob(sha256),
    PRIMARY KEY(snapshot_id, path)
) STRICT;
CREATE INDEX entry_path ON entry(path, snapshot_id DESC);
"""


def digest(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def replace_busy_backup(source: Path, target: Path) -> None:
    """Wait briefly for Windows readers before rotating a verified backup."""
    deadline = perf_counter() + 300
    while True:
        try:
            os.replace(source, target)
            return
        except OSError as error:
            if getattr(error, "winerror", None) != 32 or perf_counter() >= deadline:
                raise
            sleep(0.1)


@contextmanager
def exclusive_file(path: Path):
    """Serialize physical backup rotation without blocking workspace writers."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a+b") as handle:
        if handle.tell() == 0:
            handle.write(b"0")
            handle.flush()
        handle.seek(0)
        if os.name == "nt":
            import msvcrt
            while True:
                try:
                    msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
                    break
                except OSError as error:
                    if error.errno not in {errno.EACCES, errno.EDEADLK}:
                        raise
                    sleep(0.2)
        else:
            import fcntl
            fcntl.flock(handle, fcntl.LOCK_EX)
        try:
            yield
        finally:
            handle.seek(0)
            if os.name == "nt":
                msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(handle, fcntl.LOCK_UN)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="microseconds")


def key_path(value: str) -> str:
    """Validate database paths again at the filesystem trust boundary."""
    parts = PurePosixPath(value).parts
    if (not parts or PurePosixPath(value).is_absolute() or "\\" in value
            or any(p in {".", ".."} or ":" in p for p in parts)
            or "/".join(parts) != value):
        raise ValueError(f"Unsafe artifact path: {value!r}")
    return value


def unlinked(path: Path) -> Path:
    path = Path(os.path.abspath(path))
    for parent in (path, *path.parents):
        if parent.is_symlink() or parent.is_junction():
            raise ValueError(f"Linked path is not allowed: {parent}")
    return path


def existing_parents(paths: list[Path]) -> list[Path]:
    """Keep parent directories once, so reports/source bodies accompany each input."""
    roots = sorted({unlinked(path) for path in paths}, key=lambda p: (len(p.parts), str(p)))
    return [root for index, root in enumerate(roots) if not any(root.is_relative_to(parent) for parent in roots[:index])]


def manifest_digest(entries) -> str:
    hasher = hashlib.sha256()
    for path, sha in sorted(entries):
        hasher.update(json.dumps([path, sha], ensure_ascii=True, separators=(",", ":")).encode("ascii") + b"\n")
    return hasher.hexdigest()


class Workspace:
    def __init__(self, repo: Path = REPO, database: Path | None = None):
        self.repo = unlinked(repo)
        self.database = unlinked(database or self.repo / "data/local/catalog-authoring/workspace.sqlite")
        if any(self.database.is_relative_to(self.repo / name) for name in (".tmp", ".workspace", "data/source")):
            raise ValueError("The working database must be outside .tmp, .workspace and data/source")

    def key(self, path: Path) -> str:
        path = unlinked(path)
        if not path.is_relative_to(self.repo) or path == self.repo:
            raise ValueError(f"Artifact must be a bounded path inside {self.repo}: {path}")
        if self.database.resolve().is_relative_to(path.resolve()):
            raise ValueError("Cannot capture the workspace database or its parent")
        if path.resolve() == self.repo / "data/local/catalog-authoring/artifacts":
            raise ValueError("Capture bounded authoring artifacts, not the entire archive")
        if path.resolve().is_relative_to(self.repo / "data/local/catalog-authoring/backups"):
            raise ValueError("Cannot capture workspace backups")
        relative = key_path(path.relative_to(self.repo).as_posix())
        if any(p in {".git", "node_modules"} or p.startswith(".env") for p in PurePosixPath(relative).parts):
            raise ValueError(f"Not an authoring artifact: {relative}")
        return relative

    def connect(self, *, write=False):
        if write:
            self.database.parent.mkdir(parents=True, exist_ok=True)
        elif not self.database.is_file():
            raise FileNotFoundError(self.database)
        uri = self.database.as_uri() + ("?mode=rwc" if write else "?mode=ro")
        # ponytail: one shared writer; wait for the current save/backup turn instead of retrying failed jobs.
        db = sqlite3.connect(uri, uri=True, timeout=300)
        try:
            db.execute("PRAGMA foreign_keys=ON")
            app_id = db.execute("PRAGMA application_id").fetchone()[0]
            tables = db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
            if write and app_id == 0 and not tables:
                # One initialization transaction, including append-only guards.
                guards = "\n".join(
                    f"CREATE TRIGGER {table}_no_{verb.lower()} BEFORE {verb} ON {table} "
                    "BEGIN SELECT RAISE(ABORT, 'authoring history is append-only'); END;"
                    for table in ("blob", "snapshot", "entry") for verb in ("UPDATE", "DELETE")
                )
                db.executescript(f"BEGIN IMMEDIATE;{SCHEMA}{guards}"
                                 f"PRAGMA application_id={APPLICATION_ID};PRAGMA user_version={SCHEMA_VERSION};COMMIT;")
            if (db.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID
                    or db.execute("PRAGMA user_version").fetchone()[0] != SCHEMA_VERSION):
                raise ValueError("Not a supported Catalog authoring workspace database")
            if write:
                db.execute("PRAGMA synchronous=FULL")
            return db
        except BaseException:
            db.close()
            raise

    def files(self, roots: list[Path]) -> list[Path]:
        found = {}

        def walk(directory):
            # scandir caches Windows reparse/type metadata; do not stat every ancestor per file.
            with os.scandir(directory) as entries:
                for entry in entries:
                    if entry.is_symlink() or entry.is_junction():
                        raise ValueError(f"Linked artifact: {entry.path}")
                    path = Path(entry.path)
                    if entry.name in {".git", "node_modules"} or entry.name.startswith(".env"):
                        raise ValueError(f"Not an authoring artifact: {path}")
                    if entry.is_dir(follow_symlinks=False):
                        yield from walk(path)
                    elif entry.is_file(follow_symlinks=False):
                        yield path
                    else:
                        raise ValueError(f"Not a regular artifact: {path}")

        for root in roots:
            root = unlinked(root)
            self.key(root)
            if not root.exists():
                raise FileNotFoundError(root)
            candidates = walk(root) if root.is_dir() else (root,)
            for path in candidates:
                found[key_path(path.relative_to(self.repo).as_posix())] = path
        return [found[key] for key in sorted(found)]

    def add_blob(self, db, content: bytes) -> str:
        sha = digest(content)
        old = db.execute("SELECT byte_length FROM blob WHERE sha256=?", (sha,)).fetchone()
        if old is None:
            compressed = zlib.compress(content, level=1)
            if zlib.decompress(compressed) != content:
                raise ValueError("Compression readback failed")
            db.execute("INSERT INTO blob VALUES (?, ?, ?)", (sha, len(content), compressed))
        elif old[0] != len(content) or self.read_blob(db, sha) != content:
            raise ValueError(f"Stored blob conflict: {sha}")
        return sha

    def finish_snapshot(self, db, rows, roots, label: str) -> dict:
        sha = manifest_digest(rows)
        cursor = db.execute("INSERT INTO snapshot(created_at,label,roots_json,file_count,manifest_sha256) VALUES (?,?,?,?,?)",
                            (utc_now(), label, json.dumps({"repository": str(self.repo), "paths": roots}), len(rows), sha))
        snapshot_id = cursor.lastrowid
        db.executemany("INSERT INTO entry VALUES (?,?,?)", ((snapshot_id, path, blob) for path, blob in rows))
        db.commit()
        with closing(self.connect()) as readback:
            stored = readback.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (snapshot_id,)).fetchall()
            if len(stored) != len(rows) or manifest_digest(stored) != sha:
                raise ValueError("Committed snapshot readback failed")
        return {"snapshotId": snapshot_id, "files": len(rows), "manifestSha256": sha, "database": str(self.database)}

    def save_bytes(self, artifacts: dict[str, bytes], label: str) -> dict:
        """SQL-first storage for generated receipts; no intermediate file is required."""
        if not artifacts or not label.strip():
            raise ValueError("A named artifact set is required")
        for path, content in artifacts.items():
            self.key(self.repo / key_path(path))
            if not isinstance(content, bytes):
                raise TypeError("Artifact content must be original bytes")
        with closing(self.connect(write=True)) as db:
            try:
                db.execute("BEGIN IMMEDIATE")
                rows = [(path, self.add_blob(db, content)) for path, content in artifacts.items()]
                return self.finish_snapshot(db, rows, sorted(artifacts), label)
            except BaseException:
                db.rollback()
                raise

    def save(self, roots: list[Path], label: str) -> dict:
        if not roots or not label.strip():
            raise ValueError("Save requires explicit roots and a nonempty label")
        files = self.files(roots)
        rows, stats, pending_blobs = [], {}, {}
        existing_context = closing(self.connect()) if self.database.is_file() else nullcontext(None)
        with existing_context as existing:
            for index, path in enumerate(files, 1):
                before = path.lstat()
                if not stat.S_ISREG(before.st_mode) or getattr(before, "st_file_attributes", 0) & stat.FILE_ATTRIBUTE_REPARSE_POINT:
                    raise ValueError(f"Not a regular unlinked artifact: {path}")
                if path.suffix == ".sqlite" and any(Path(str(path) + suffix).exists() for suffix in ("-wal", "-shm", "-journal")):
                    raise ValueError(f"Close/checkpoint the source SQLite before capturing exact bytes: {path}")
                content = path.read_bytes()
                after = path.stat()
                stamp = (before.st_size, before.st_mtime_ns, before.st_ino)
                if stamp != (after.st_size, after.st_mtime_ns, after.st_ino) or len(content) != before.st_size:
                    raise ValueError(f"Artifact changed while reading: {path}")
                sha = digest(content)
                old = existing.execute("SELECT byte_length FROM blob WHERE sha256=?", (sha,)).fetchone() if existing else None
                if old is None:
                    if sha not in pending_blobs:
                        compressed = zlib.compress(content, level=1)
                        if zlib.decompress(compressed) != content:
                            raise ValueError("Compression readback failed")
                        pending_blobs[sha] = (len(content), compressed)
                elif old[0] != len(content) or self.read_blob(existing, sha) != content:
                    raise ValueError(f"Stored blob conflict: {sha}")
                rows.append((key_path(path.relative_to(self.repo).as_posix()), sha))
                stats[path] = stamp
                if index % 10000 == 0:
                    print(f"authoring scan: {index}/{len(files)} files", file=sys.stderr, flush=True)
        # The slow file reads, hashing and compression above do not occupy the
        # single SQLite writer slot shared by independent Catalog workers.
        with closing(self.connect(write=True)) as db:
            try:
                db.execute("BEGIN IMMEDIATE")
                for sha, (length, compressed) in pending_blobs.items():
                    old = db.execute("SELECT byte_length FROM blob WHERE sha256=?", (sha,)).fetchone()
                    if old is None:
                        db.execute("INSERT INTO blob VALUES (?, ?, ?)", (sha, length, compressed))
                    elif old[0] != length:
                        raise ValueError(f"Stored blob conflict: {sha}")
                # The snapshot describes this exact membership, not a mix of directory versions.
                if self.files(roots) != files:
                    raise ValueError("Artifact membership changed while saving")
                for path, stamp in stats.items():
                    current = path.stat()
                    if stamp != (current.st_size, current.st_mtime_ns, current.st_ino):
                        raise ValueError(f"Artifact changed before commit: {path}")
                return self.finish_snapshot(db, rows, [self.key(p) for p in roots], label)
            except BaseException:
                db.rollback()
                raise

    @staticmethod
    def read_blob(db, sha: str) -> bytes:
        row = db.execute("SELECT byte_length,content FROM blob WHERE sha256=?", (sha,)).fetchone()
        if row is None:
            raise ValueError(f"Missing blob: {sha}")
        decoder = zlib.decompressobj()
        content = decoder.decompress(row[1], row[0] + 1)
        if not decoder.eof or decoder.unused_data or len(content) != row[0] or digest(content) != sha:
            raise ValueError(f"Corrupt blob: {sha}")
        return content

    def verify_saved(self, snapshot: dict, roots: list[Path]) -> None:
        """Check a saved receipt and the requested original bytes, read-only."""
        files = self.files(roots)
        expected = {self.key(path): digest(path.read_bytes()) for path in files}
        with closing(self.connect()) as db:
            header = db.execute("SELECT file_count,manifest_sha256 FROM snapshot WHERE id=?", (snapshot["snapshotId"],)).fetchone()
            if header != (snapshot["files"], snapshot["manifestSha256"]):
                raise ValueError("Saved snapshot receipt mismatch")
            rows = db.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (snapshot["snapshotId"],)).fetchall()
            if len(rows) != header[0] or manifest_digest(rows) != header[1]:
                raise ValueError("Saved snapshot membership mismatch")
            # Old snapshot keys stay immutable; the preserved artifact location table
            # can resolve their location to the relocated original bytes.
            indexed = {}
            for path, sha in rows:
                # Compare stored names without stat-ing every ancestor of every
                # snapshot member. files(roots) validates the actual read paths,
                # including links, before and after this readback.
                resolved = Path(os.path.abspath(artifact_path(self.repo / key_path(path), self.repo)))
                if resolved in indexed and indexed[resolved] != sha:
                    raise ValueError("Saved paths disagree on artifact bytes")
                indexed[resolved] = sha
            if any(indexed.get((self.repo / path).resolve()) != sha for path, sha in expected.items()):
                raise ValueError("Requested artifacts differ from saved snapshot")
            for sha in set(expected.values()):
                self.read_blob(db, sha)
        if files != self.files(roots) or any(digest(path.read_bytes()) != expected[self.key(path)] for path in files):
            raise ValueError("Requested artifacts changed during saved readback")

    def verify(self) -> dict:
        with closing(self.connect()) as db:
            db.execute("BEGIN")
            if db.execute("PRAGMA integrity_check").fetchall() != [("ok",)] or db.execute("PRAGMA foreign_key_check").fetchall():
                raise ValueError("Workspace SQLite integrity failure")
            count, size = 0, 0
            for (sha,) in db.execute("SELECT sha256 FROM blob"):
                size += len(self.read_blob(db, sha))
                count += 1
            snapshots = db.execute("SELECT id,file_count,manifest_sha256 FROM snapshot").fetchall()
            for snapshot_id, expected_count, sha in snapshots:
                rows = db.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (snapshot_id,)).fetchall()
                for path, _ in rows:
                    key_path(path)
                if len(rows) != expected_count or manifest_digest(rows) != sha:
                    raise ValueError(f"Snapshot manifest mismatch: {snapshot_id}")
        return {"status": "STORAGE_VERIFIED", "snapshots": len(snapshots), "blobs": count, "uniqueBytes": size}

    def restore(self, snapshot_id: int, destination: Path, prefix: str | None = None) -> dict:
        destination = unlinked(destination)
        if destination.exists():
            raise FileExistsError(f"Restore requires a new destination; no overwrite: {destination}")
        if destination == self.repo or self.repo.is_relative_to(destination) or destination.is_relative_to(self.repo / "data/source"):
            raise ValueError("Cannot restore over the repository or canonical source")
        if prefix is not None:
            key_path(prefix)
        with closing(self.connect()) as db:
            snapshot = db.execute("SELECT file_count,manifest_sha256 FROM snapshot WHERE id=?", (snapshot_id,)).fetchone()
            rows = db.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (snapshot_id,)).fetchall()
            if snapshot is None or len(rows) != snapshot[0] or manifest_digest(rows) != snapshot[1]:
                raise ValueError("Missing or invalid snapshot")
            selected = [(key_path(path), sha) for path, sha in rows if prefix is None or path == prefix or path.startswith(prefix + "/")]
            if not selected:
                raise ValueError("No artifacts in the requested snapshot/prefix")
            destination.mkdir(parents=True, exist_ok=False)
            for index, (path, sha) in enumerate(selected, 1):
                target = unlinked(destination / path)
                target.parent.mkdir(parents=True, exist_ok=True)
                with target.open("xb") as stream:
                    stream.write(self.read_blob(db, sha))
                    stream.flush()
                    os.fsync(stream.fileno())
                if digest(target.read_bytes()) != sha:
                    raise ValueError(f"Restored artifact readback failed: {path}")
                if index % 10000 == 0:
                    print(f"authoring restore: {index}/{len(selected)} files", file=sys.stderr, flush=True)
        return {"status": "RESTORED", "snapshotId": snapshot_id, "files": len(selected), "destination": str(destination)}

    def checkout(self, snapshot_id: int, prefix: str) -> dict:
        """Recover one missing working-copy subtree at its original logical path."""
        prefix = key_path(prefix)
        target = unlinked(artifact_path(self.repo / prefix, self.repo))
        self.key(target)
        if target.is_relative_to(self.repo / "data/source"):
            raise ValueError("Canonical source recovery is a separate authorized operation")
        if target.exists():
            raise FileExistsError(f"Checkout requires an absent target; no overwrite: {target}")
        with closing(self.connect()) as db:
            snapshot = db.execute("SELECT file_count,manifest_sha256 FROM snapshot WHERE id=?", (snapshot_id,)).fetchone()
            rows = db.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (snapshot_id,)).fetchall()
            if snapshot is None or len(rows) != snapshot[0] or manifest_digest(rows) != snapshot[1]:
                raise ValueError("Missing or invalid snapshot")
            selected = [(key_path(path), sha) for path, sha in rows if path == prefix or path.startswith(prefix + "/")]
            if not selected:
                raise ValueError("No artifacts in the requested snapshot/prefix; missing history is not synthesized")
            for path, sha in selected:
                output = unlinked(artifact_path(self.repo / path, self.repo))
                output.parent.mkdir(parents=True, exist_ok=True)
                with output.open("xb") as stream:
                    stream.write(self.read_blob(db, sha))
                    stream.flush()
                    os.fsync(stream.fileno())
                if digest(output.read_bytes()) != sha:
                    raise ValueError(f"Checkout readback failed: {path}")
        return {"status": "CHECKED_OUT", "snapshotId": snapshot_id, "files": len(selected), "path": str(target)}

    def backup(self, destination: Path | None = None) -> dict:
        if not self.database.is_file():
            raise FileNotFoundError(self.database)
        # Backup generations share their own physical names, so serialize only
        # rotation. SQLite read snapshots keep the append-only source coherent
        # while independent workers continue saving new workspace snapshots.
        lock = self.repo / "data/local/catalog-authoring/backups/rotation.lock"
        with exclusive_file(lock):
            return self._backup_locked(destination)

    def _backup_locked(self, destination: Path | None) -> dict:
        automatic = destination is None
        backup_root = unlinked(self.repo / "data/local/catalog-authoring/backups")
        latest, previous = backup_root / "latest.sqlite", backup_root / "previous.sqlite"
        pending = backup_root / "pending.sqlite"
        if automatic and self.database in {latest, previous, pending}:
            raise ValueError("An automatic backup cannot rotate its own source; use an explicit new destination")
        if automatic and pending.exists():
            # A fixed pending name makes each interrupted rename resumable under
            # the same writer lock. Never discard an ambiguous or partial copy.
            if latest.exists() and previous.exists():
                raise ValueError(f"Ambiguous backup rotation; all copies retained: {pending}")
            unlinked(pending)
            with closing(sqlite3.connect(pending.as_uri() + "?mode=rw", uri=True)) as recovery:
                if (recovery.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID
                        or recovery.execute("PRAGMA user_version").fetchone()[0] != SCHEMA_VERSION
                        or recovery.execute("PRAGMA integrity_check").fetchall() != [("ok",)]
                        or recovery.execute("PRAGMA foreign_key_check").fetchall()):
                    raise ValueError(f"Incomplete backup rotation; partial copy retained: {pending}")
            snapshot, added = self._extend_backup(pending)
            for reserved in (latest, previous):
                unlinked(reserved)
                if reserved.exists():
                    with closing(Workspace(self.repo, reserved).connect()) as old, closing(self.connect()) as source:
                        headers = old.execute("SELECT * FROM snapshot ORDER BY id").fetchall()
                        last = headers[-1][0] if headers else 0
                        if headers != source.execute("SELECT * FROM snapshot WHERE id<=? ORDER BY id", (last,)).fetchall():
                            raise ValueError(f"Backup rotation history mismatch; copies retained: {reserved}")
            if latest.exists():
                replace_busy_backup(latest, previous)
            replace_busy_backup(pending, latest)
            return {"status": "BACKED_UP", "mode": "recovered-rotation", "destination": str(latest),
                    "latestSnapshotId": snapshot[0], "snapshots": snapshot[1], "addedSnapshots": added}
        if automatic and latest.exists() and previous.exists():
            # Each generation remains a complete SQLite database. Append only the
            # delta to the older one; the latest stays untouched until commit.
            for reserved in (latest, previous):
                unlinked(reserved)
                # mode=rw lets SQLite recover an interrupted rollback journal,
                # but never creates or initializes an unrelated reserved file.
                with closing(sqlite3.connect(reserved.as_uri() + "?mode=rw", uri=True)) as old:
                    if (old.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID
                            or old.execute("PRAGMA user_version").fetchone()[0] != SCHEMA_VERSION):
                        raise ValueError(f"Refusing to replace an unrelated backup: {reserved}")
            snapshot, added = self._extend_backup(previous)
            replace_busy_backup(previous, pending)
            replace_busy_backup(latest, previous)
            replace_busy_backup(pending, latest)
            return {"status": "BACKED_UP", "mode": "append-only", "destination": str(latest),
                    "latestSnapshotId": snapshot[0], "snapshots": snapshot[1], "addedSnapshots": added}
        if destination is None:
            destination = pending
        destination = unlinked(destination)
        if (destination.is_relative_to(self.repo) and not destination.is_relative_to(backup_root)) or destination == self.database:
            raise ValueError("Backup must be in data/local/catalog-authoring/backups or outside the repository, separate from the database")
        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("xb"):
            pass
        with closing(self.connect()) as source, closing(sqlite3.connect(destination)) as target:
            source.backup(target)
            if target.execute("PRAGMA integrity_check").fetchall() != [("ok",)] or target.execute("PRAGMA foreign_key_check").fetchall():
                raise ValueError(f"Backup integrity failure; partial file retained: {destination}")
            snapshot = target.execute("SELECT max(id),count(*) FROM snapshot").fetchone()
        if automatic:
            # All logical versions live inside each backup; keep two physical generations.
            for reserved in (latest, previous):
                unlinked(reserved)
                if reserved.exists():
                    with closing(sqlite3.connect(reserved.as_uri() + "?mode=ro", uri=True)) as old:
                        if old.execute("PRAGMA application_id").fetchone()[0] != APPLICATION_ID:
                            raise ValueError(f"Refusing to replace an unrelated backup: {reserved}")
            if latest.exists():
                replace_busy_backup(latest, previous)
            replace_busy_backup(destination, latest)
            destination = latest
        return {"status": "BACKED_UP", "mode": "full", "destination": str(destination), "latestSnapshotId": snapshot[0], "snapshots": snapshot[1]}

    def _extend_backup(self, destination: Path) -> tuple[tuple, int]:
        """Extend a verified append-only generation atomically, without rescanning history.

        Full audits remain available through verify; all blobs referenced by new
        snapshots are checked here, and restore always checks original hashes.
        """
        with closing(Workspace(self.repo, destination).connect(write=True)) as target:
            target.execute("ATTACH DATABASE ? AS origin", (self.database.as_uri() + "?mode=ro",))
            try:
                # The caller holds the source writer lock. A deferred transaction
                # writes only main, leaving the read-only attachment unlocked.
                target.execute("BEGIN")
                schema = "SELECT type,name,tbl_name,sql FROM {}.sqlite_master ORDER BY type,name"
                if target.execute(schema.format("main")).fetchall() != target.execute(schema.format("origin")).fetchall():
                    raise ValueError("Backup schema differs from append-only source")
                headers = target.execute("SELECT * FROM snapshot ORDER BY id").fetchall()
                last = headers[-1][0] if headers else 0
                if headers != target.execute("SELECT * FROM origin.snapshot WHERE id<=? ORDER BY id", (last,)).fetchall():
                    raise ValueError("Backup history is not a prefix of the source")
                if target.execute("SELECT count(*) FROM entry").fetchone()[0] != sum(row[4] for row in headers):
                    raise ValueError("Backup snapshot membership count mismatch")
                new_headers = target.execute("SELECT * FROM origin.snapshot WHERE id>? ORDER BY id", (last,)).fetchall()
                referenced = target.execute("SELECT DISTINCT sha256 FROM origin.entry WHERE snapshot_id>?", (last,)).fetchall()
                target.executemany("""INSERT INTO blob SELECT b.* FROM origin.blob b
                    WHERE b.sha256=? AND NOT EXISTS (SELECT 1 FROM blob old WHERE old.sha256=b.sha256)""", referenced)
                for (sha,) in referenced:
                    self.read_blob(target, sha)
                target.execute("INSERT INTO snapshot SELECT * FROM origin.snapshot WHERE id>?", (last,))
                target.execute("INSERT INTO entry SELECT * FROM origin.entry WHERE snapshot_id>?", (last,))
                for row in new_headers:
                    entries = target.execute("SELECT path,sha256 FROM entry WHERE snapshot_id=?", (row[0],)).fetchall()
                    for path, _ in entries:
                        key_path(path)
                    if len(entries) != row[4] or manifest_digest(entries) != row[5]:
                        raise ValueError(f"Backup snapshot manifest mismatch: {row[0]}")
                target.commit()
            except BaseException:
                target.rollback()
                raise
        with closing(Workspace(self.repo, destination).connect()) as readback:
            snapshot = readback.execute("SELECT max(id),count(*) FROM snapshot").fetchone()
            expected = ((new_headers or headers)[-1][0] if new_headers or headers else None, len(headers) + len(new_headers))
            if snapshot != expected:
                raise ValueError("Backup commit readback failed")
        return snapshot, len(new_headers)


def recorded_run(command: list[str], inputs: list[Path], outputs: list[Path], label: str,
                 workspace: Workspace | None = None, *, input_discovery_seconds: float = 0,
                 receipt_out: dict | None = None) -> int:
    """Persist before execution and before reporting success, including failed outputs."""
    workspace = workspace or Workspace()
    if not inputs:
        raise ValueError("Run requires explicit inputs")
    started = perf_counter()
    receipt_root = unlinked(workspace.repo / "data/local/catalog-authoring/operations" / uuid.uuid4().hex)
    workspace.key(receipt_root)
    receipt_root.mkdir(parents=True, exist_ok=False)
    receipt_path = receipt_root / "command.json"
    receipt = {"argv": command, "cwd": os.getcwd(), "status": "PREPARED", "preparedAt": utc_now()}
    receipt_path.write_text(json.dumps(receipt, ensure_ascii=True), encoding="utf-8")
    before = workspace.save([*inputs, receipt_root], label + ":input")
    saved_input = perf_counter()
    workspace.backup()
    backed_up_input = perf_counter()
    child_env = {**os.environ, "KONOCOMICS_AUTHORING_RECORDED": "1", "PYTHONDONTWRITEBYTECODE": "1"}
    receipt.update(inputSnapshot=before["snapshotId"], startedAt=utc_now(), status="RUNNING")
    receipt_path.write_text(json.dumps(receipt, ensure_ascii=True), encoding="utf-8")
    stdout_path, stderr_path = receipt_root / "stdout.bin", receipt_root / "stderr.bin"
    with stdout_path.open("xb") as stdout, stderr_path.open("xb") as stderr:
        try:
            # subprocess.run kills and waits for its child on a handled interrupt.
            # File-backed logs also survive an abrupt loss of this parent process.
            exit_code = subprocess.run(command, env=child_env, stdout=stdout, stderr=stderr).returncode
        except (OSError, KeyboardInterrupt) as error:
            exit_code = 130 if isinstance(error, KeyboardInterrupt) else 127
            receipt["executionError"] = f"{type(error).__name__}: {error}"
            stderr.write((receipt["executionError"] + "\n").encode("utf-8"))
        finally:
            for stream in (stdout, stderr):
                stream.flush()
                os.fsync(stream.fileno())
    command_finished = perf_counter()
    receipt.update(status="EXITED", exitCode=exit_code, finishedAt=utc_now())
    receipt_path.write_text(json.dumps(receipt, ensure_ascii=True), encoding="utf-8")
    after_roots = [path for path in outputs if path.exists()]
    after, output_error = None, None
    try:
        after = workspace.save(after_roots, label + (":output" if exit_code == 0 else ":failed-output")) if after_roots else None
    except Exception as error:
        # A rejected partial SQLite must not prevent durable logs and exit state.
        output_error = error
        receipt.update(status="OUTPUT_SAVE_FAILED", outputStorageError=f"{type(error).__name__}: {error}")
    saved_output = perf_counter()
    timings = {"inputDiscovery": input_discovery_seconds, "inputSave": saved_input - started, "inputBackup": backed_up_input - saved_input,
               "command": command_finished - backed_up_input, "outputSave": saved_output - command_finished}
    receipt.update(outputSnapshot=after["snapshotId"] if after else None, timingsSeconds=timings)
    receipt_path.write_text(json.dumps(receipt, ensure_ascii=True), encoding="utf-8")
    operation = workspace.save([receipt_root], label + ":exit-" + str(exit_code))
    saved_operation = perf_counter()
    backup = workspace.backup()
    backed_up_output = perf_counter()
    timings.update(operationSave=saved_operation - saved_output, outputBackup=backed_up_output - saved_operation,
                   total=input_discovery_seconds + backed_up_output - started)
    # Publication PASS is not emitted until its actual result is saved and backed up.
    for path, stream in ((stdout_path, sys.stdout.buffer), (stderr_path, sys.stderr.buffer)):
        if path == stdout_path and output_error is not None:
            continue
        with path.open("rb") as content:
            shutil.copyfileobj(content, stream)
    print(json.dumps({"authoringStorage": {"input": before, "output": after, "operation": operation, "backup": backup, "timingsSeconds": timings}}, ensure_ascii=True), file=sys.stderr)
    if output_error is not None:
        raise output_error
    if receipt_out is not None:
        receipt_out.update(input=before, output=after, operation=operation, backup=backup,
                           timingsSeconds=timings)
    return exit_code


def authoring_inputs(paths: list[Path], workspace: Workspace | None = None) -> list[Path]:
    """Capture known job/lineage dependencies without interpreting evidence or claims."""
    workspace = workspace or Workspace()
    pending, visited, expanded = [(path, True) for path in paths], set(), set()
    while pending:
        item, expand = pending.pop()
        root = unlinked(artifact_path(item, workspace.repo))
        if root in expanded or (root in visited and not expand):
            continue
        workspace.key(root)
        visited.add(root)
        if not expand:
            continue
        expanded.add(root)
        tools_root = workspace.repo / "scripts/catalog_authoring"
        if root.resolve() == workspace.repo / "scripts/catalog_workspace.py":
            pending.append((workspace.repo / "scripts/workspace_paths.py", False))
        if root.resolve() == tools_root / "collect_factor_evidence.mjs":
            pending.append((tools_root / "validate_factor_collection_batch.mjs", False))
        if root.resolve() == workspace.repo / "scripts/readback-catalog-authoring.mts":
            from catalog_readback_identity import execution_inputs
            pending.extend((path, False) for path in execution_inputs(workspace.repo))
        if root.resolve() == workspace.repo / "scripts/catalog_authoring_runner.py":
            pending.extend((path, True) for path in (tools_root / "prepare_factor_batch.py", workspace.repo / "scripts/readback-catalog-authoring.mts"))
        if root.resolve() == tools_root or (root.resolve().parent == tools_root and root.name in {
            "prepare_factor_batch.py", "publish_factor_batch.py", "correct_factor_registry.py",
            "validate_factor_panel.py", "plan_factor_backlog.py", "prepare_factor_rescue_004.py",
        }):
            # Factor operators use these helpers. A collector does not read them
            # and must remain usable when publication inputs are unavailable.
            backend = tools_root / "legacy"
            runtime_inputs = [
                *(tools_root / name for name in (
                    "prepare_factor_batch.py", "publish_factor_batch.py", "validate_factor_panel.py", "correct_factor_registry.py",
                    "factor_recovery.py", "factor_single_pass.py", "factor_model_input.py", "prepare_factor_rescue_004.py", "prepare_ready_safety.py", "authoring_paths.py",
                )),
                backend / "followup-panel-tools/publish_authorized_followup.py",
                backend / "followup-panel-tools/validate_panel_results.py",
                backend / "integration-publisher-v1/integrate.py",
                backend / "safety-recheck-v1/tools/validate_safety_recheck.py",
                workspace.repo / "docs/catalog-expansion/factor-panel-request.md",
                workspace.repo / "data/staging/catalog-expansion/gold-set-manifest.json",
                workspace.repo / "data/source/catalog.sqlite",
            ]
            pending.extend((path, False) for path in runtime_inputs)
        for path in workspace.files([root]):
            if path.suffix != ".json" or (path != root and not path.name.startswith("records") and path.name not in {"authoring-job.json", "external-prior-authority.json", "external-lineage.json", "recovery-epoch.json", "recovery-declaration.json"}):
                continue
            try:
                value = json.loads(path.read_bytes())
            except (ValueError, UnicodeError):
                continue  # Preserve invalid raw input; the original validator reports its error.
            if not isinstance(value, dict):
                continue
            references = []
            if value.get("schemaVersion") in {"factor-loss-recovery-v1", "factor-loss-recovery-epoch-v1"}:
                for field in ("epochPath", "scopePath", "policyPath"):
                    if isinstance(value.get(field), str):
                        references.append(artifact_path(value[field], workspace.repo))
            if value.get("schemaVersion") in {"factor-authoring-job-v3", "factor-authoring-job-v4"}:
                for work in value.get("works", []) if isinstance(value.get("works"), list) else []:
                    refs = work.get("researchRefs", [work.get("researchRef", {})]) if isinstance(work, dict) else []
                    for reference in refs if isinstance(refs, list) else []:
                        if isinstance(reference, dict) and isinstance(reference.get("path"), str):
                            references.append(path.parent / reference["path"])
            if path.name == "external-prior-authority.json":
                for bundle in value.get("bundles", []) if isinstance(value.get("bundles"), list) else []:
                    if isinstance(bundle, dict) and isinstance(bundle.get("root"), str):
                        references.append(artifact_path(bundle["root"], workspace.repo))
            if path.name == "external-lineage.json":
                for field in ("baselineRoot", "registryPath"):
                    if isinstance(value.get(field), str):
                        references.append(artifact_path(value[field], workspace.repo))
                # The fully frozen v2 packet does not depend on later draft changes.
                bindings = value.get("sourceInputBindings", {})
                if isinstance(bindings, dict):
                    references.extend(artifact_path(item, workspace.repo) for item in bindings if isinstance(item, str) and artifact_path(item, workspace.repo).is_file())
            for reference in references:
                workspace.key(reference)
                # Lineage points to provenance, not an instruction to re-ingest
                # every ancestor. Capture its direct bundle in full; historical
                # versions remain in the workspace. Explicit prior authority and
                # job/recovery dependencies still expand normally.
                pending.append((reference.parent if reference.suffix == ".sqlite" else reference,
                                path.name != "external-lineage.json"))
    return existing_parents(list(visited))


def record_arguments(script: Path, args: argparse.Namespace, argv: list[str] | None = None) -> int | None:
    """Persistence hook for existing parsed authoring CLIs; their core stays unchanged."""
    if os.environ.get("KONOCOMICS_AUTHORING_RECORDED") == "1":
        return None
    workspace = Workspace()
    inputs, outputs = [script.resolve()], []

    def paths(value):
        if isinstance(value, Path):
            yield value.resolve()
        elif isinstance(value, (list, tuple)):
            for item in value:
                yield from paths(item)

    for field, value in vars(args).items():
        for path in paths(value):
            if field in {"output_root", "publication_root", "output_dir", "result_output_root"}:
                outputs.append(path)
                if path.exists():
                    inputs.append(path)
            else:
                inputs.append(path.parent if path.suffix == ".sqlite" else path)
                if field in {"job", "ledger", "decisions", "changes", "research"} and path.is_file():
                    inputs.append(path.parent)
    for name in ("docs/factors", "docs/catalog-expansion", "docs/planning/09-catalog-authoring-authority.md", "scripts/catalog_workspace.py", "scripts/workspace_paths.py"):
        inputs.append(workspace.repo / name)
    label = script.stem + ":" + getattr(args, "action", "run")
    discovery_started = perf_counter()
    inputs = authoring_inputs(inputs, workspace)
    return recorded_run([sys.executable, str(script.resolve()), *(sys.argv[1:] if argv is None else argv)], inputs, outputs, label, workspace,
                        input_discovery_seconds=perf_counter() - discovery_started)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path)
    sub = parser.add_subparsers(dest="command", required=True)
    save = sub.add_parser("save", help="Save exact current bytes as an immutable revision")
    save.add_argument("--label", required=True)
    save.add_argument("paths", type=Path, nargs="+")
    sub.add_parser("verify", help="Verify all blob bytes and snapshot memberships")
    sub.add_parser("list", help="List saved snapshots")
    backup = sub.add_parser("backup", help="Make a consistent backup in data/local/catalog-authoring/backups or an explicit external destination")
    backup.add_argument("--destination", type=Path)
    restore = sub.add_parser("restore", help="Restore an exact snapshot under a NEW directory, never overwrite")
    restore.add_argument("--snapshot", type=int, required=True)
    restore.add_argument("--destination", type=Path, required=True)
    restore.add_argument("--prefix")
    checkout = sub.add_parser("checkout", help="Recover one ABSENT working-copy path from an exact snapshot")
    checkout.add_argument("--snapshot", type=int, required=True)
    checkout.add_argument("--prefix", required=True)
    run = sub.add_parser("run", help="Persist inputs and outputs around an existing authoring command")
    run.add_argument("--label", required=True)
    run.add_argument("--input", type=Path, action="append", required=True)
    run.add_argument("--output", type=Path, action="append", default=[])
    run.add_argument("argv", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    workspace = Workspace(database=args.database)
    if args.command == "save":
        result = workspace.save(args.paths, args.label)
        result["backup"] = workspace.backup()
    elif args.command == "verify":
        result = workspace.verify()
    elif args.command == "list":
        with closing(workspace.connect()) as db:
            result = [dict(zip(("id", "createdAt", "label", "files", "manifestSha256"), row)) for row in db.execute("SELECT id,created_at,label,file_count,manifest_sha256 FROM snapshot ORDER BY id")]
    elif args.command == "backup":
        result = workspace.backup(args.destination)
    elif args.command == "restore":
        result = workspace.restore(args.snapshot, args.destination, args.prefix)
    elif args.command == "checkout":
        result = workspace.checkout(args.snapshot, args.prefix)
    else:
        command = args.argv[1:] if args.argv[:1] == ["--"] else args.argv
        if not command:
            parser.error("run requires an existing command after --")
        discovery_started = perf_counter()
        inputs = authoring_inputs(args.input, workspace)
        return recorded_run(command, inputs, args.output, args.label, workspace,
                            input_discovery_seconds=perf_counter() - discovery_started)
    print(json.dumps(result, ensure_ascii=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, sqlite3.Error, zlib.error) as error:
        print(json.dumps({"status": "STORAGE_FAILED", "error": str(error)}, ensure_ascii=True), file=sys.stderr)
        raise SystemExit(1)
