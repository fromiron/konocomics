"""The cutover must resume after DB replacement without exposing writable mixed state."""
from contextlib import closing
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

import catalog_authoring_runner as runner
import catalog_retention as retention
from catalog_revision_store import RevisionWorkspace
from catalog_workspace import Workspace, digest


class RetentionCutoverTest(unittest.TestCase):
    def test_interrupted_state_swap_resumes_and_old_writer_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            base, continuation = repo / retention.BASE, repo / retention.CONTINUATION
            pair = continuation / "initial"
            pair.mkdir(parents=True)
            for name in ("catalog-expanded.candidate.sqlite", "catalog-source-registry.candidate.sqlite"):
                with closing(sqlite3.connect(pair / name)) as db, db:
                    db.execute("CREATE TABLE preserved(value TEXT)")
                    db.execute("INSERT INTO preserved VALUES ('original')")
                    db.execute("CREATE TABLE source_works(annotationReviewReference TEXT)")
                    db.execute("INSERT INTO source_works VALUES ('reviews/test.md')")
            review = pair / "data/source/reviews/test.md"
            review.parent.mkdir(parents=True)
            review.write_bytes(b"Original referenced review")
            old = Workspace(repo)
            original = old.save([pair], "original")
            old.backup()
            state_path = continuation / "STATE.json"
            retention.write(state_path, {"latestCandidate": {"root": "initial",
                "catalogSha256": digest((pair / "catalog-expanded.candidate.sqlite").read_bytes()),
                "registrySha256": digest((pair / "catalog-source-registry.candidate.sqlite").read_bytes())}})
            original_state = state_path.read_bytes()
            new = RevisionWorkspace.create(repo, base / "workspace.next.sqlite")
            anchor = base / "retained/basis"
            retention.create_anchor(new, anchor, pair, {}, provenance={"sourceSnapshot": {
                "lastSnapshotId": original["snapshotId"], "lastSnapshotFiles": original["files"],
                "lastSnapshotManifestSha256": original["manifestSha256"]}})
            self.assertEqual((anchor / "data/source/reviews/test.md").read_bytes(), review.read_bytes())
            new.backup(base / "backups/retention-next.sqlite")
            build = {"generation": new._generation, "anchor": str(anchor),
                     "protectedFiles": {state_path.relative_to(repo).as_posix(): digest(original_state)}}
            verified = {"status": "VERIFIED_NOT_ACTIVATED", "generation": new._generation,
                        "databaseSha256": retention.file_sha(new.database),
                        "anchorManifestSha256": retention.file_sha(anchor / "MANIFEST.sha256")}
            original_write = retention.write

            def interrupted(path, value):
                if path == state_path:
                    raise OSError("simulated interruption before STATE replace")
                return original_write(path, value)

            with patch.object(runner, "REPO", repo), patch.object(runner, "ROOT", continuation):
                with patch.object(retention, "write", side_effect=interrupted):
                    with self.assertRaisesRegex(OSError, "interruption"):
                        retention.activate_store(build, verified)
                self.assertEqual(state_path.read_bytes(), original_state)
                self.assertTrue((base / "RETENTION-MAINTENANCE.json").is_file())
                with self.assertRaisesRegex(ValueError, "cutover"):
                    Workspace(repo).connect(write=True)
                result = retention.activate_store(build, verified, resume=True)
                self.assertEqual(result["status"], "ACTIVATED")
                self.assertFalse((base / "RETENTION-MAINTENANCE.json").exists())
                self.assertEqual(runner.current()[1], anchor)
                # An object loaded before the schema switch must not initialize
                # or append v2 history to the new generation.
                with self.assertRaisesRegex(ValueError, "supported"):
                    old.connect(write=True)
                self.assertEqual(json.loads(state_path.read_bytes())["authoringStore"]["generation"], new._generation)
                self.assertTrue((base / "workspace.retired-v2.sqlite").exists())


if __name__ == "__main__":
    unittest.main()
