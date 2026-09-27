"""Saved path identities remain portable while all I/O stays in the restore."""
from contextlib import closing
import json
from pathlib import Path
import tempfile
import unittest

from catalog_revision_store import RevisionWorkspace
from catalog_workspace import digest, unlinked
import catalog_retention as retention
from workspace_paths import absolute_identity, artifact_path, restored_origins


class RestoredPathIdentityTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.repo = Path(directory.name)
        self.marker = self.repo / ".catalog-restore.json"
        self.marker.write_text(json.dumps({"schemaVersion": "catalog-restored-workspace-v1",
            "originalRepositories": [r"C:\Archived\konocomics", r"C:\Archived\konocomics\restore",
                                     "/srv/archived/konocomics", r"\\archive\share\konocomics"]}), encoding="utf-8")
        self.addCleanup(restored_origins.cache_clear)

    def test_windows_posix_and_unc_origins_map_without_rewriting(self):
        before = self.marker.read_bytes()
        for saved in (r"c:\ARCHIVED\konocomics\data\source\catalog.sqlite",
                      "C:/Archived/konocomics/data/source/catalog.sqlite",
                      r"C:\Archived\konocomics\restore\data\source\catalog.sqlite",
                      "/srv/archived/konocomics/data/source/catalog.sqlite",
                      r"\\ARCHIVE\share\konocomics\data\source\catalog.sqlite"):
            with self.subTest(saved=saved):
                self.assertEqual(artifact_path(saved, self.repo), self.repo / "data/source/catalog.sqlite")
        self.assertEqual(artifact_path(r"data\source\catalog.sqlite", self.repo), Path("data/source/catalog.sqlite"))
        self.assertEqual(self.marker.read_bytes(), before)
        self.assertEqual(list(self.repo.iterdir()), [self.marker])

    def test_unknown_roots_traversal_and_ambiguous_identities_are_rejected(self):
        for saved in (r"D:\Archived\konocomics\file", r"C:\Archived\konocomics-other\file",
                      "/srv/Archived/konocomics/file", "/other/file", r"C:\Archived\konocomics\..\file",
                      r"C:relative", r"\root-relative", r"\\?\C:\Archived\konocomics\file", "bad\0file"):
            with self.subTest(saved=saved), self.assertRaises(ValueError):
                artifact_path(saved, self.repo)
        for origin in ("relative", r"C:relative", "/srv/../other"):
            with self.subTest(origin=origin), self.assertRaises(ValueError):
                absolute_identity(origin)

    def test_mapped_symlink_is_rejected_without_following_it(self):
        outside = self.repo.parent / (self.repo.name + "-missing-outside")
        link = self.repo / "linked"
        try:
            link.symlink_to(outside, target_is_directory=True)
        except OSError as error:
            self.skipTest("This host cannot create a symlink: " + str(error))
        with self.assertRaisesRegex(ValueError, "Linked"):
            unlinked(artifact_path(r"C:\Archived\konocomics\linked\file", self.repo))
        self.assertFalse(outside.exists())

    def test_small_database_restore_preserves_windows_receipts_and_extracts_only_requested_output(self):
        store = RevisionWorkspace.create(self.repo, self.repo / retention.BASE / "workspace.sqlite")
        relative = retention.BASE + "/artifacts/cross-os/completed"
        output = self.repo / relative
        candidate = output / "candidate/data/generated/catalog-v1.json"
        candidate.parent.mkdir(parents=True)
        candidate.write_bytes(b"preserved generated artifact")
        old_output = "C:\\Archived\\konocomics\\" + relative.replace("/", "\\")
        prepared = output / "prepared.json"
        retention.write(prepared, {"root": r"C:\Archived\konocomics", "output": old_output, "kind": "metadata",
            "artifacts": [{"path": r"data\generated\catalog-v1.json", "sha256": digest(candidate.read_bytes())}]})
        completion = output / "completion.json"
        retention.write(completion, {"preparedSha256": digest(prepared.read_bytes())})
        store.save([output], "exact cross-OS completion")
        store.put_revision("active", "current-recovery-controls", {
            "originalRepositories": [r"C:\Archived\konocomics", "/srv/archived/konocomics"]}, {})
        store.backup()
        before = {path.name: path.read_bytes() for path in (prepared, completion)}
        destination = self.repo / "second-restore"
        report = retention.restore_current(RevisionWorkspace(self.repo, self.repo / retention.BASE / "backups/latest.sqlite"), destination)
        self.assertEqual(report["status"], "DATABASE_RESTORED")
        self.assertEqual(report["artifactFiles"], 0)
        restored = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
        with closing(restored.connect()) as db:
            identity = list(db.execute("SELECT id,payload_sha256 FROM revision ORDER BY id"))
        result = retention.prepare_restored_operation(destination, {"operation": "canonical", "action": "verify",
            "outputRoot": old_output, "inputPath": old_output + r"\completion.json"})
        self.assertEqual(result["status"], "MATERIALIZED")
        self.assertEqual((destination / relative / "candidate/data/generated/catalog-v1.json").read_bytes(), candidate.read_bytes())
        for name, body in before.items():
            self.assertEqual((destination / relative / name).read_bytes(), body)
        self.assertFalse((destination / "data/source").exists())
        self.assertFalse((destination / "data/generated").exists())
        with closing(restored.connect()) as db:
            self.assertEqual(list(db.execute("SELECT id,payload_sha256 FROM revision ORDER BY id")), identity)


if __name__ == "__main__":
    unittest.main()
