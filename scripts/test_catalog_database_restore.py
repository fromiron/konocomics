"""The existing restore command recovers a database, not all artifact folders."""
from contextlib import closing
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import unittest
from unittest.mock import patch

import catalog_retention as retention
from catalog_revision_store import RevisionWorkspace
from catalog_workspace import digest
import test_catalog_retention as fixtures


class DatabaseRestoreTest(unittest.TestCase):
    recovery_fixture = fixtures.RetentionCutoverTest.recovery_fixture

    def restore_checkout(self, repo, name, *, git=True):
        target = repo / name
        scripts = Path(__file__).resolve().parent
        command = target / "scripts/catalog_workspace.py"
        command.parent.mkdir(parents=True)
        shutil.copyfile(scripts / command.name, command)
        code = target / "src/checkout-sentinel.ts"
        code.parent.mkdir()
        code.write_bytes(b"export const originalCheckout = true;\n")
        canonical = target / "data/source/catalog.sqlite"
        canonical.parent.mkdir(parents=True)
        shutil.copyfile(repo / retention.BASE / "pair/catalog-expanded.candidate.sqlite", canonical)
        runtime = target / retention.BASE / "runtime/runtime.json"
        runtime.parent.mkdir(parents=True)
        runtime.write_bytes(b'{"fixture":"existing platform runtime"}\n')
        (runtime.parent / "runtime-sentinel.bin").write_bytes(b"Existing runtime bytes\x00\xff")
        if git:
            for arguments in (("init", "--quiet"), ("add", "."), ("commit", "--quiet", "-m", "Restore fixture checkout")):
                result = subprocess.run(["git", "-C", str(target), "-c", "core.autocrlf=false",
                    "-c", "core.hooksPath=.git/no-hooks", "-c", "commit.gpgsign=false",
                    "-c", "user.name=Restore Fixture", "-c", "user.email=restore@example.invalid",
                    *arguments], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        return target

    def checkout_restore_cli(self, target, backup, *, destination=None, arguments=()):
        scripts = Path(__file__).resolve().parent
        return subprocess.run([sys.executable, "-B", str(target / "scripts/catalog_workspace.py"),
            "--database", str(backup), "restore", "--destination", str(destination or target),
            "--into-checkout", *arguments], cwd=target, capture_output=True, text=True,
            env={**os.environ, "PYTHONPATH": os.pathsep.join((str(scripts), str(scripts / "catalog_authoring"))),
                 "PYTHONDONTWRITEBYTECODE": "1"})

    @staticmethod
    def checkout_tree_state(root):
        return {path.relative_to(root).as_posix():
                ("file", digest(path.read_bytes()), path.stat().st_mtime_ns) if path.is_file() else ("directory",)
                for path in root.rglob("*")}

    def assert_checkout_restore_rejected(self, target, backup, *, destination=None, arguments=(), error):
        before = self.checkout_tree_state(target)
        source_sha = digest(backup.read_bytes())
        result = self.checkout_restore_cli(target, backup, destination=destination, arguments=arguments)
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn(error, result.stderr)
        self.assertEqual(self.checkout_tree_state(target), before)
        self.assertEqual(digest(backup.read_bytes()), source_sha)

    def test_restore_into_checkout_cli_preserves_code_catalog_runtime_and_database_identity(self):
        repo, store, _, curation, _, _, _, _ = self.recovery_fixture()
        store.backup()
        backup = repo / retention.BASE / "backups/latest.sqlite"
        source_before = {path: digest(path.read_bytes()) for path in (store.database, backup)}
        target = self.restore_checkout(repo, "existing-checkout")
        before = self.checkout_tree_state(target)
        result = self.checkout_restore_cli(target, backup)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(report["status"], "DATABASE_RESTORED")
        self.assertEqual(report["artifactFiles"], 0)
        self.assertFalse(report["workersResumed"])
        after = self.checkout_tree_state(target)
        self.assertEqual({name: after[name] for name in before}, before)
        self.assertEqual({name for name in after.keys() - before.keys() if after[name][0] == "file"},
            {".catalog-restore.json", retention.BASE + "/workspace.sqlite", retention.BASE + "/CURRENT-RESTORE.json"})
        recovered = RevisionWorkspace(target, target / retention.BASE / "workspace.sqlite")
        self.assertEqual(recovered.get_revision(curation), store.get_revision(curation))
        with closing(store.connect()) as source, closing(recovered.connect()) as restored:
            for query in ("SELECT id FROM revision ORDER BY id", "SELECT * FROM head ORDER BY kind,subject",
                          "SELECT * FROM revision_blob ORDER BY revision_id,path", "SELECT * FROM change_log ORDER BY seq"):
                self.assertEqual(source.execute(query).fetchall(), restored.execute(query).fetchall())
            self.assertEqual(restored.execute("PRAGMA integrity_check").fetchall(), [("ok",)])
            self.assertEqual(restored.execute("PRAGMA foreign_key_check").fetchall(), [])
        self.assertEqual({path: digest(path.read_bytes()) for path in source_before}, source_before)
        self.assert_checkout_restore_rejected(target, backup, error="already contains authoring data")

    def test_restore_into_checkout_rejects_every_partial_authoring_state_before_writing(self):
        repo, store, _, _, _, _, _, _ = self.recovery_fixture()
        store.backup()
        backup = repo / retention.BASE / "backups/latest.sqlite"
        conflicts = {
            "workspace": retention.BASE + "/workspace.sqlite",
            "wal": retention.BASE + "/workspace.sqlite-wal",
            "shm": retention.BASE + "/workspace.sqlite-shm",
            "journal": retention.BASE + "/workspace.sqlite-journal",
            "report": retention.BASE + "/CURRENT-RESTORE.json",
            "mapping": ".catalog-restore.json",
            "empty-artifacts": retention.BASE + "/artifacts",
        }
        for label, name in conflicts.items():
            with self.subTest(conflict=label):
                target = self.restore_checkout(repo, "checkout-" + label)
                conflict = target / name
                if label == "empty-artifacts":
                    conflict.mkdir()
                else:
                    conflict.write_bytes(b"Preserve existing partial authoring state")
                self.assert_checkout_restore_rejected(target, backup, error="already contains authoring data")

    def test_restore_into_checkout_rejects_subdirectory_and_non_git_root_without_writing(self):
        repo, store, _, _, _, _, _, _ = self.recovery_fixture()
        store.backup()
        backup = repo / retention.BASE / "backups/latest.sqlite"
        target = self.restore_checkout(repo, "checkout-root")
        child = target / "child"
        child.mkdir()
        self.assert_checkout_restore_rejected(target, backup, destination=child, error="exact existing Git checkout root")
        non_git = self.restore_checkout(repo, "plain-directory", git=False)
        self.assert_checkout_restore_rejected(non_git, backup, error="exact existing Git checkout root")

    def test_restore_into_checkout_rejects_historical_snapshot_or_prefix_before_writing(self):
        repo, store, _, curation, _, _, _, _ = self.recovery_fixture()
        store.backup()
        backup = repo / retention.BASE / "backups/latest.sqlite"
        target = self.restore_checkout(repo, "checkout-options")
        for arguments in (("--snapshot", curation["revisionId"]), ("--prefix", "research"),
                          ("--snapshot", curation["revisionId"], "--prefix", "research")):
            with self.subTest(arguments=arguments):
                self.assert_checkout_restore_rejected(target, backup, arguments=arguments,
                    error="cannot be combined with --snapshot or --prefix")

    def test_existing_restore_cli_copies_only_database_and_preserves_identity(self):
        repo, store, basis, curation, registration, _, _, _ = self.recovery_fixture()
        store.backup()
        backup = repo / retention.BASE / "backups/latest.sqlite"
        source_sha = digest(backup.read_bytes())
        scripts = Path(__file__).resolve().parent
        command = repo / "scripts/catalog_workspace.py"
        command.parent.mkdir()
        shutil.copyfile(scripts / command.name, command)
        (repo / retention.CONTINUATION).rename(repo / "unavailable-originals")
        basis.rename(repo / "unavailable-basis")
        registration.parent.rename(repo / "unavailable-notifications")
        destination = repo / "database-only-restored"
        result = subprocess.run([sys.executable, "-B", str(command), "--database", str(backup),
            "restore", "--destination", str(destination)], cwd=repo, capture_output=True, text=True,
            env={**os.environ, "PYTHONPATH": os.pathsep.join((str(scripts), str(scripts / "catalog_authoring"))),
                 "PYTHONDONTWRITEBYTECODE": "1"})
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(report["status"], "DATABASE_RESTORED")
        self.assertEqual(report["artifactFiles"], 0)
        self.assertFalse(report["workersResumed"])
        self.assertEqual({path.relative_to(destination).as_posix() for path in destination.rglob("*") if path.is_file()},
            {".catalog-restore.json", retention.BASE + "/workspace.sqlite", retention.BASE + "/CURRENT-RESTORE.json"})
        recovered = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
        self.assertEqual(recovered.get_revision(curation), store.get_revision(curation))
        with closing(store.connect()) as source, closing(recovered.connect()) as target:
            for query in ("SELECT id FROM revision ORDER BY id", "SELECT * FROM head ORDER BY kind,subject",
                          "SELECT * FROM revision_blob ORDER BY revision_id,path", "SELECT * FROM change_log ORDER BY seq"):
                self.assertEqual(source.execute(query).fetchall(), target.execute(query).fetchall())
            self.assertEqual(target.execute("PRAGMA integrity_check").fetchall(), [("ok",)])
            self.assertEqual(target.execute("PRAGMA foreign_key_check").fetchall(), [])
        self.assertEqual(digest(backup.read_bytes()), source_sha)
        self.assertFalse((destination / retention.BASE / "backups/latest.sqlite").exists())

    def test_database_restore_never_enumerates_artifact_scopes_or_overwrites_destination(self):
        repo, store, _, _, _, _, _, _ = self.recovery_fixture()
        store.backup()
        backup = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        destination = repo / "bounded-database"
        with patch.object(retention._RecoveryFiles, "__init__", side_effect=AssertionError("No artifact scope selection in DB restore")):
            retention.restore_current(backup, destination)
        with self.assertRaisesRegex(ValueError, "new non-canonical"):
            retention.restore_current(backup, destination)

    def test_sparse_backup_cli_preserves_absent_controls_and_commits_only_explicit_control_change(self):
        repo, store, _, _, registration, collection, _, _ = self.recovery_fixture()
        store.backup()
        source = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        original_control = source.current_revision("active", "current-recovery-controls")
        original_value = source.get_revision(original_control)
        destination = repo / "sparse-backup"
        retention.restore_current(source, destination)
        scripts = Path(__file__).resolve().parent
        command = destination / "scripts/catalog_workspace.py"
        command.parent.mkdir()
        shutil.copyfile(scripts / command.name, command)
        environment = {**os.environ, "PYTHONPATH": os.pathsep.join((str(scripts), str(scripts / "catalog_authoring"))),
                       "PYTHONDONTWRITEBYTECODE": "1"}

        def cli(*arguments):
            result = subprocess.run([sys.executable, "-B", str(command), *map(str, arguments)],
                cwd=destination, env=environment, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            return json.loads(result.stdout)

        def logical_controls(database):
            workspace = RevisionWorkspace(destination, database)
            receipt = workspace.current_revision("active", "current-recovery-controls")
            return receipt, workspace.get_revision(receipt)

        recovered_path = destination / retention.BASE / "workspace.sqlite"
        latest_path = destination / retention.BASE / "backups/latest.sqlite"
        first = cli("backup")
        self.assertEqual(first["mode"], "revision-generation")
        self.assertEqual(logical_controls(recovered_path)[0]["revisionId"], original_control["revisionId"])
        self.assertEqual(logical_controls(latest_path)[1], original_value)
        self.assertFalse((destination / retention.CONTINUATION).exists())
        state_name = original_value["payload"]["statePath"]
        cli("checkout", "--snapshot", original_control["revisionId"], "--prefix", state_name)
        collection_receipt = store.file_reference(collection / "capture.body")
        cli("checkout", "--snapshot", collection_receipt["snapshot"]["revisionId"], "--prefix", store.key(collection))
        second = cli("backup")
        self.assertEqual(second["mode"], "reused")
        self.assertEqual(logical_controls(recovered_path)[1], original_value)
        self.assertEqual(logical_controls(latest_path)[1], original_value)
        self.assertFalse((destination / registration.relative_to(repo)).exists())
        cli("checkout", "--snapshot", original_control["revisionId"], "--prefix", store.key(registration))
        changed_path = destination / registration.relative_to(repo)
        changed = json.loads(changed_path.read_bytes())
        changed["suspended"] = False
        retention.write(changed_path, changed)
        cli("save", "--label", "explicit-registration-update", changed_path)
        changed_value = logical_controls(recovered_path)[1]
        self.assertEqual(changed_value["payload"], original_value["payload"])
        self.assertEqual(changed_value["members"], {**original_value["members"], store.key(registration): digest(changed_path.read_bytes())})
        third = cli("backup")
        self.assertEqual(third["mode"], "revision-incremental")
        self.assertEqual(logical_controls(latest_path)[1], changed_value)
        self.assertEqual(logical_controls(latest_path)[0]["revisionId"], logical_controls(recovered_path)[0]["revisionId"])
        self.assertEqual(source.get_revision(original_control), original_value)

    def test_sparse_control_cas_rolls_back_stale_artifact_and_explicit_delete_keeps_tombstone(self):
        repo, store, _, _, registration, _, _, _ = self.recovery_fixture()
        store.backup()
        source = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        destination = repo / "sparse-conflict"
        retention.restore_current(source, destination)
        recovered = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
        original = recovered.current_revision("active", "current-recovery-controls")
        name = store.key(registration)
        recovered.checkout(original["revisionId"], name)
        path = destination / name
        value = json.loads(path.read_bytes())
        stale = {**value, "stoppedTurnId": "stale-write"}
        newer = {**value, "stoppedTurnId": "newer-stop"}
        retention.write(path, stale)
        stale_sha = digest(path.read_bytes())
        competitor = RevisionWorkspace(destination, recovered.database)
        original_assert = recovered._assert_inventory
        injected = False

        def competing_control(roots, inventory):
            nonlocal injected
            original_assert(roots, inventory)
            if not injected:
                injected = True
                competitor.save_bytes({name: json.dumps(newer).encode()}, "newer-control")

        with patch.object(recovered, "_assert_inventory", side_effect=competing_control):
            with self.assertRaisesRegex(ValueError, "head advanced"):
                recovered.save([path], "stale-control")
        current = recovered.current_revision("active", "current-recovery-controls")
        current_value = recovered.get_revision(current)
        self.assertNotEqual(current["revisionId"], original["revisionId"])
        self.assertEqual(current_value["members"][name], digest(json.dumps(newer).encode()))
        with closing(recovered.connect()) as db:
            self.assertIsNone(db.execute("SELECT 1 FROM head WHERE subject LIKE 'stale-control:%'").fetchone())
            self.assertIsNone(db.execute("SELECT 1 FROM blob WHERE sha256=?", (stale_sha,)).fetchone())
        path.unlink()
        result = retention.record_restored_operation(destination, {"status": "MATERIALIZED",
            "generation": current["generation"], "controlBase": current}, [], [path])
        self.assertEqual(result["controlPersistence"], "PERSISTED")
        deleted = recovered.get_revision(result["controls"])
        self.assertNotIn(name, deleted["members"])
        self.assertNotIn(name, deleted["payload"]["registrations"])
        self.assertEqual(deleted["payload"]["deletedPaths"][name], current_value["members"][name])
        recovered.backup()
        latest = RevisionWorkspace(destination, destination / retention.BASE / "backups/latest.sqlite")
        self.assertEqual(latest.get_revision(result["controls"]), deleted)
        again = destination / "recovered-again"
        retention.restore_current(latest, again)
        final = RevisionWorkspace(again, again / retention.BASE / "workspace.sqlite")
        self.assertEqual(final.get_revision(result["controls"]), deleted)
        self.assertFalse((again / name).exists())

    def test_explicit_consumed_private_directory_stays_deleted_until_new_explicit_save(self):
        repo, store, _, _, _, _, _, _ = self.recovery_fixture()
        private = repo / ".workspace/owned-publication/publish"
        private.mkdir(parents=True)
        first, second = private / "one.json", private / "two.json"
        first.write_bytes(b"original first source")
        second.write_bytes(b"original second source")
        saved = store.save([private], "prepared-owned-publication")
        original_members = store.get_revision(saved)["members"]
        store.backup()
        source = RevisionWorkspace(repo, repo / retention.BASE / "backups/latest.sqlite")
        destination = repo / "private-deletion"
        retention.restore_current(source, destination)
        recovered = RevisionWorkspace(destination, destination / retention.BASE / "workspace.sqlite")
        recovered.checkout(saved["revisionId"], store.key(private))
        target = destination / private.relative_to(repo)
        for name in ("one.json", "two.json"):
            (target / name).unlink()
        target.rmdir()
        current = recovered.current_revision("active", "current-recovery-controls")
        preparation = {"status": "MATERIALIZED", "generation": current["generation"], "controlBase": current}
        result = retention.record_restored_operation(destination, preparation, [], [target])
        deleted = recovered.get_revision(result["controls"])
        self.assertEqual(deleted["payload"]["deletedPaths"], original_members)
        repeated = retention.record_restored_operation(destination, preparation, [], [target])
        self.assertEqual(repeated["controls"], result["controls"])
        target.mkdir()
        (target / "one.json").write_bytes(b"new explicitly prepared source")
        recovered.save([target / "one.json"], "new-private-preparation")
        current = recovered.get_revision(recovered.current_revision("active", "current-recovery-controls"))
        self.assertNotIn(store.key(first), current["payload"]["deletedPaths"])
        self.assertIn(store.key(second), current["payload"]["deletedPaths"])
        self.assertEqual(recovered.get_revision(saved)["members"], original_members)


if __name__ == "__main__":
    unittest.main()
