"""Host runtime selection must survive moves without silently changing Python."""
import hashlib
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

import catalog_python as launcher
import setup_catalog_runtime as installer


class CatalogRuntimeTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.repo = Path(directory.name) / "moved checkout with spaces"
        self.runtime = self.repo / "data/local/catalog-authoring/runtime"
        self.runtime.mkdir(parents=True)
        self.target = self.runtime / ("python.exe" if os.name == "nt" else "python")
        self.target.write_bytes(b"Runtime identity selection does not execute this file")
        self.receipt = {"python": self.target.relative_to(self.repo).as_posix(), "platform": sys.platform}
        override = patch.dict(os.environ, {"KONOCOMICS_CATALOG_PYTHON": ""})
        repository = patch.object(launcher, "REPO", self.repo)
        override.start()
        repository.start()
        self.addCleanup(override.stop)
        self.addCleanup(repository.stop)

    def write_receipt(self):
        (self.runtime / "runtime.json").write_text(json.dumps(self.receipt), encoding="utf-8")

    def test_relative_receipt_resolves_against_current_checkout(self):
        self.write_receipt()
        self.assertEqual(Path(launcher.executable()), self.target.resolve())

    def test_another_platform_requires_setup_instead_of_launching_foreign_binary(self):
        self.receipt["platform"] = "linux" if sys.platform == "win32" else "win32"
        self.write_receipt()
        with self.assertRaisesRegex(SystemExit, "another platform"):
            launcher.executable()

    def test_original_windows_receipt_without_platform_is_still_supported(self):
        self.receipt.pop("platform")
        self.write_receipt()
        with patch.object(launcher.sys, "platform", "win32"):
            self.assertEqual(Path(launcher.executable()), self.target.resolve())

    def test_missing_runtime_requires_explicit_setup(self):
        with self.assertRaisesRegex(SystemExit, "setup_catalog_runtime"):
            launcher.executable()
        self.write_receipt()
        self.target.unlink()
        with self.assertRaisesRegex(SystemExit, "missing"):
            launcher.executable()

    def test_runtime_archive_hash_mismatch_never_writes_an_installed_source(self):
        archive = self.runtime / "source.zip"
        with self.assertRaisesRegex(ValueError, "checksum mismatch"):
            installer.download("data:application/octet-stream;base64,d3Jvbmc=", archive,
                               "sha3_256", hashlib.sha3_256(b"official bytes").hexdigest())
        self.assertFalse(archive.exists())

    def test_bootstrap_rejects_python_without_the_required_path_api(self):
        with patch.object(installer.sys, "version_info", (3, 11, 9)):
            with self.assertRaisesRegex(SystemExit, "3.12"):
                installer.linux_runtime(self.runtime, self.runtime / "downloads")
        self.assertEqual(set(self.runtime.iterdir()), {self.target})


if __name__ == "__main__":
    unittest.main()
