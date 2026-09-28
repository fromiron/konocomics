"""One-time generation-preserving prune of the authoring workspace store.

Keeps the current per-Work curation head, the small control/completion heads,
and the retained raw-evidence collection, together with the previous-revision
and dependency closure needed to keep those heads valid. Drops redundant
publication copies (the ``migration-working-sets`` catch-all and every
``artifact``/``execution`` revision) and the retired ``legacy-pin`` lineage.

The generation and every kept revision/blob byte are preserved so existing
receipts keep validating. This does not rewrite catalog.sqlite, run models, or
resume any session. Build into a new file, verify, then activate explicitly.
"""
from __future__ import annotations

import argparse
from contextlib import closing
from pathlib import Path
import sqlite3
import sys
import uuid

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "scripts"))

from catalog_revision_store import SCHEMA, V4_SCHEMA, change_triggers, RevisionWorkspace  # noqa: E402
from catalog_workspace import APPLICATION_ID  # noqa: E402

VERSION = 4
DROP_HEAD_KINDS = {"legacy-pin", "artifact", "execution"}
DROP_ACTIVE_SUBJECTS = {"migration-working-sets"}


def kept_heads(src):
    heads = []
    for kind, subject, rid in src.execute("SELECT kind,subject,revision_id FROM head"):
        if kind in DROP_HEAD_KINDS:
            continue
        if kind == "active" and subject in DROP_ACTIVE_SUBJECTS:
            continue
        heads.append((kind, subject, rid))
    return heads


def closure(src, seed):
    """Revisions reachable from kept heads via previous_id and dependency edges."""
    seen, stack = set(), list(seed)
    while stack:
        rid = stack.pop()
        if rid in seen:
            continue
        seen.add(rid)
        row = src.execute("SELECT previous_id FROM revision WHERE id=?", (rid,)).fetchone()
        if row and row[0]:
            stack.append(row[0])
        for (target,) in src.execute("SELECT target_id FROM revision_dependency WHERE owner_id=?", (rid,)):
            stack.append(target)
    return seen


def build(source_path: Path, dest_path: Path):
    if dest_path.exists():
        raise SystemExit(f"Destination already exists: {dest_path}")
    with closing(sqlite3.connect(f"file:{source_path}?mode=ro", uri=True)) as src:
        if src.execute("PRAGMA user_version").fetchone()[0] != VERSION:
            raise SystemExit("Source must be a v4 authoring store")
        meta = dict(src.execute("SELECT key,value FROM store_meta"))
        heads = kept_heads(src)
        keep = closure(src, {rid for _, _, rid in heads})
        print(f"kept heads={len(heads)} kept revisions={len(keep)} of {src.execute('SELECT count(*) FROM revision').fetchone()[0]}")

        dest_path.parent.mkdir(parents=True, exist_ok=True)
        with dest_path.open("xb"):
            pass
        with closing(sqlite3.connect(dest_path)) as dst:
            # Create the schema without change triggers so the bulk copy does not
            # populate change_log; a fresh backup re-initializes from cursor 0.
            dst.executescript(
                f"BEGIN IMMEDIATE;{SCHEMA}{V4_SCHEMA}"
                f"PRAGMA application_id={APPLICATION_ID};PRAGMA user_version={VERSION};COMMIT;")
            dst.execute("PRAGMA foreign_keys=OFF")
            dst.execute("BEGIN IMMEDIATE")
            dst.executemany("INSERT INTO store_meta VALUES (?,?)", [
                ("generation", meta["generation"]),
                ("policy", meta.get("policy", "curation-evidence-active-v1")),
                ("journal_origin", str(uuid.uuid4())),
                ("legacy_revision_max_rowid", "0"),
            ])

            keep_tuple = [(rid,) for rid in keep]
            dst.execute("CREATE TEMP TABLE keep(id TEXT PRIMARY KEY)")
            dst.executemany("INSERT INTO keep VALUES (?)", keep_tuple)
            src.execute("CREATE TEMP TABLE keep(id TEXT PRIMARY KEY)")
            src.executemany("INSERT INTO keep VALUES (?)", keep_tuple)

            # Blobs: payloads and members of kept revisions.
            src.execute("CREATE TEMP TABLE keepblob(sha TEXT PRIMARY KEY)")
            src.execute("INSERT OR IGNORE INTO keepblob SELECT payload_sha256 FROM revision WHERE id IN (SELECT id FROM keep)")
            src.execute("INSERT OR IGNORE INTO keepblob SELECT sha256 FROM revision_blob WHERE revision_id IN (SELECT id FROM keep)")
            nblob = 0
            for sha, byte_length, content in src.execute(
                    "SELECT b.sha256,b.byte_length,b.content FROM blob b JOIN keepblob k ON k.sha=b.sha256"):
                dst.execute("INSERT INTO blob VALUES (?,?,?)", (sha, byte_length, content))
                nblob += 1

            # Revisions: null out previous_id that points outside the kept set.
            nrev = 0
            for row in src.execute("SELECT id,kind,subject,payload_sha256,previous_id,created_at,terminal,pinned FROM revision WHERE id IN (SELECT id FROM keep)"):
                rid, kind, subject, payload, previous, created, terminal, pinned = row
                if previous is not None and previous not in keep:
                    previous = None
                dst.execute("INSERT INTO revision VALUES (?,?,?,?,?,?,?,?)",
                            (rid, kind, subject, payload, previous, created, terminal, pinned))
                nrev += 1

            for row in src.execute("SELECT revision_id,path,sha256 FROM revision_blob WHERE revision_id IN (SELECT id FROM keep)"):
                dst.execute("INSERT INTO revision_blob VALUES (?,?,?)", row)

            for kind, subject, rid in heads:
                dst.execute("INSERT INTO head VALUES (?,?,?)", (kind, subject, rid))

            # Dependency edges where both endpoints survive.
            for owner, target in src.execute("SELECT owner_id,target_id FROM revision_dependency WHERE owner_id IN (SELECT id FROM keep)"):
                if target in keep:
                    dst.execute("INSERT INTO revision_dependency VALUES (?,?)", (owner, target))

            # execution_artifact only where both revisions survive (executions are
            # dropped as heads but may remain as dependency targets).
            for execution, artifact in src.execute("SELECT execution_id,artifact_id FROM execution_artifact WHERE execution_id IN (SELECT id FROM keep)"):
                if artifact in keep:
                    dst.execute("INSERT INTO execution_artifact VALUES (?,?)", (execution, artifact))

            dst.execute("COMMIT")
            # executescript first commits any open transaction; triggers are added
            # after the bulk copy so change_log stays empty for a fresh backup.
            dst.executescript(change_triggers())
            dst.execute("PRAGMA foreign_keys=ON")
            fk = dst.execute("PRAGMA foreign_key_check").fetchall()
            if fk:
                raise SystemExit(f"Foreign key violations in lean build: {fk[:10]}")
            if dst.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                raise SystemExit("Integrity check failed on lean build")
            dst.execute("VACUUM")
            print(f"blobs={nblob} revisions={nrev} bytes={dest_path.stat().st_size}")

    result = RevisionWorkspace(REPO, dest_path).verify()
    print("verify:", result)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", default=str(REPO / "data/local/catalog-authoring/workspace.sqlite"))
    parser.add_argument("--dest", required=True)
    args = parser.parse_args()
    build(Path(args.source), Path(args.dest))


if __name__ == "__main__":
    main()
