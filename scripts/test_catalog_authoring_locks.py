"""Exercise real OS contention and the canonical recovery boundary."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

from catalog_authoring_locks import acquire, assert_no_pending


class AuthoringLocksTest(unittest.TestCase):
    @unittest.skipUnless(os.name == "nt", "Windows lock error classification")
    def test_native_access_denied_is_not_retried_as_contention(self):
        import ctypes
        with tempfile.TemporaryDirectory() as folder:
            error = ctypes.WinError(5)
            with patch("msvcrt.locking", side_effect=error) as locking, patch("catalog_authoring_locks.time.sleep") as sleep:
                with self.assertRaises(PermissionError):
                    with acquire(Path(folder) / "publication.lock"):
                        self.fail("Denied lock was acquired")
            self.assertEqual(locking.call_count, 1)
            sleep.assert_not_called()

    def test_live_owner_times_out_then_releases_for_another_process(self):
        with tempfile.TemporaryDirectory() as folder:
            lock = Path(folder) / "publication.lock"
            command = [sys.executable, "-B", "-c",
                       "from pathlib import Path; from catalog_authoring_locks import acquire; "
                       "import sys;\nwith acquire(Path(sys.argv[1]),timeout=0.15): print('acquired')", str(lock)]
            environment = dict(os.environ, PYTHONPATH=str(Path(__file__).parent))
            with acquire(lock):
                result = subprocess.run(command, capture_output=True, text=True, env=environment)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("TimeoutError", result.stderr)
            result = subprocess.run(command, capture_output=True, text=True, env=environment)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.strip(), "acquired")

    def test_partial_publication_only_allows_same_prepared_recovery(self):
        with tempfile.TemporaryDirectory() as folder:
            repo = Path(folder)
            pending = repo / "data/local/catalog-authoring/locks/publication.pending.json"
            pending.parent.mkdir(parents=True)
            prepared = repo / "prepared.json"
            pending.write_text(json.dumps({"preparedPath": str(prepared), "nonce": "original"}), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "pending"):
                assert_no_pending(repo)
            with self.assertRaisesRegex(ValueError, "pending"):
                assert_no_pending(repo, recovery=repo / "other.json")
            assert_no_pending(repo, recovery=prepared)

    def test_restored_pending_only_allows_its_declared_origin(self):
        for declared in (True, False):
            with self.subTest(declared=declared), tempfile.TemporaryDirectory() as folder:
                repo = Path(folder) / "restored"
                original = Path(folder) / "original"
                relative = Path("data/local/catalog-authoring/prepared/prepared.json")
                pending = repo / "data/local/catalog-authoring/locks/publication.pending.json"
                pending.parent.mkdir(parents=True)
                body = json.dumps({"preparedPath": str(original / relative), "nonce": "original"}, indent=2).encode() + b"\n"
                pending.write_bytes(body)
                (repo / ".catalog-restore.json").write_text(json.dumps({
                    "schemaVersion": "catalog-restored-workspace-v1",
                    "originalRepositories": [str(original if declared else Path(folder) / "unrelated")],
                }), encoding="utf-8")
                if declared:
                    assert_no_pending(repo, recovery=repo / relative)
                else:
                    with self.assertRaisesRegex(ValueError, "pending"):
                        assert_no_pending(repo, recovery=repo / relative)
                for recovery in (None, repo / "other.json", Path(folder) / "redirected" / relative):
                    with self.assertRaisesRegex(ValueError, "pending"):
                        assert_no_pending(repo, recovery=recovery)
                self.assertEqual(pending.read_bytes(), body)

    def test_restored_broker_uses_new_repo_lock_with_unavailable_origin(self):
        with tempfile.TemporaryDirectory() as folder:
            repo = Path(folder) / "restored"
            original = Path(folder) / "original"
            # A file occupies the old repository path: every child access fails.
            original.write_bytes(b"Original repository is unavailable.\n")
            relative = Path("data/local/catalog-authoring/prepared/prepared.json")
            prepared = repo / relative
            prepared.parent.mkdir(parents=True)
            prepared.write_bytes(b"{}\n")
            pending = repo / "data/local/catalog-authoring/locks/publication.pending.json"
            pending.parent.mkdir(parents=True)
            body = json.dumps({"preparedPath": str(original / relative)}, indent=2).encode() + b"\n"
            pending.write_bytes(body)
            (repo / ".catalog-restore.json").write_text(json.dumps({
                "schemaVersion": "catalog-restored-workspace-v1",
                "originalRepositories": [str(original)],
            }), encoding="utf-8")
            lock = pending.with_name("publication.lock")
            child = (
                "import json,os,sys; from pathlib import Path; "
                "owner=json.loads(os.environ['CATALOG_COMMIT_LOCK_HELD']); "
                "expected=Path(sys.argv[1]).resolve(); "
                "assert Path(owner['path']) == expected and owner['pid'] == os.getppid(); "
                "assert expected.is_file(); "
                "assert json.loads(expected.with_suffix('.lock.owner.json').read_text()) == owner; "
                "print('restored-lock-acquired')"
            )
            command = [sys.executable, "-B", str(Path(__file__).with_name("catalog_authoring_locks.py")),
                       "exec", "--repo", str(repo), "--name", "publication.lock", "--recovery", str(prepared),
                       "--", sys.executable, "-B", "-c", child, str(lock)]
            result = subprocess.run(command, capture_output=True, text=True, timeout=15)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.strip(), "restored-lock-acquired")
            self.assertTrue(lock.is_file())
            self.assertFalse(lock.with_suffix(".lock.owner.json").exists())
            self.assertEqual(pending.read_bytes(), body)
            self.assertEqual(prepared.read_bytes(), b"{}\n")
            self.assertEqual(original.read_bytes(), b"Original repository is unavailable.\n")

    @unittest.skipUnless(os.name == "nt", "Windows broker lifetime")
    def test_killed_broker_terminates_its_writer_child(self):
        import ctypes
        from ctypes import wintypes
        with tempfile.TemporaryDirectory() as folder:
            repo = Path(folder)
            child_pid = repo / "child.txt"
            command = [sys.executable, "-B", str(Path(__file__).with_name("catalog_authoring_locks.py")),
                       "exec", "--repo", str(repo), "--name", "publication.lock", "--",
                       sys.executable, "-B", "-c",
                       "import os,time,sys; from pathlib import Path; Path(sys.argv[1]).write_text(str(os.getpid())); time.sleep(30)", str(child_pid)]
            broker = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
            try:
                deadline = time.monotonic() + 5
                while not child_pid.exists() and time.monotonic() < deadline and broker.poll() is None:
                    time.sleep(0.02)
                self.assertTrue(child_pid.exists(), broker.stderr.read().decode() if broker.poll() is not None else "child did not start")
                kernel = ctypes.WinDLL("kernel32", use_last_error=True)
                kernel.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
                kernel.OpenProcess.restype = wintypes.HANDLE
                kernel.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
                kernel.CloseHandle.argtypes = [wintypes.HANDLE]
                child = kernel.OpenProcess(0x00100000, False, int(child_pid.read_text()))
                self.assertTrue(child)
                try:
                    broker.kill()
                    broker.wait(timeout=5)
                    self.assertEqual(kernel.WaitForSingleObject(child, 5000), 0, "writer survived its lock broker")
                finally:
                    kernel.CloseHandle(child)
            finally:
                if broker.poll() is None:
                    broker.kill()
                broker.wait(timeout=5)
                broker.stderr.close()


if __name__ == "__main__":
    unittest.main()
