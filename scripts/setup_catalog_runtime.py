"""Install the private Catalog runtime without changing system Python."""
from pathlib import Path
import hashlib
import json
import os
import platform
import shutil
import subprocess
import sys
import urllib.request
import uuid
import zipfile

REPO = Path(__file__).resolve().parents[1]
PYTHON_URL = "https://www.python.org/ftp/python/3.13.15/python-3.13.15-embed-amd64.zip"
PYTHON_SHA256 = "d1f04d990aee1253d8569e8e5104e30fa9f5fa830899f14843448872d936a2cf"
SQLITE_URL = "https://www2.sqlite.org/2026/sqlite-dll-win-x64-3530400.zip"
SQLITE_SHA3 = "deddee963c810d1eeac3ce5e15c7c41da21a1c54d7a39cf54fbf577d2f50de3a"
SQLITE_SOURCE_URL = "https://www.sqlite.org/2026/sqlite-amalgamation-3530400.zip"
SQLITE_SOURCE_SHA3 = "628a44cfe82c66aed1ccbbe85a562d2e33ebe64b3288981ed76285612227934e"
SQLITE_VERSION = "3.53.4"
PROBE = """import json,sqlite3,subprocess,sys
database=sqlite3.connect(':memory:')
database.execute('CREATE TABLE runtime_probe(value INTEGER)')
database.execute('INSERT INTO runtime_probe VALUES (1)')
copy=sqlite3.connect(':memory:')
copy.deserialize(database.serialize())
assert copy.execute('SELECT value FROM runtime_probe').fetchone()==(1,)
child=subprocess.check_output([sys.executable,'-B','-c','import sqlite3; print(sqlite3.sqlite_version)'],text=True).strip()
print(json.dumps({'pythonVersion':sys.version.split()[0],'sqliteVersion':sqlite3.sqlite_version,
 'childSqliteVersion':child,'sourceId':database.execute('select sqlite_source_id()').fetchone()[0]}))
"""


def download(url, destination, algorithm, expected):
    if destination.is_file() and hashlib.new(algorithm, destination.read_bytes()).hexdigest() == expected:
        return
    with urllib.request.urlopen(url, timeout=60) as source:
        body = source.read()
    if hashlib.new(algorithm, body).hexdigest() != expected:
        raise ValueError(f"Official runtime archive checksum mismatch: {url}")
    destination.write_bytes(body)


def windows_runtime(root, archives):
    target = root / "python-3.13.15-sqlite-3.53.4"
    pyzip, sqlzip = archives / "python.zip", archives / "sqlite.zip"
    if not target.exists():
        download(PYTHON_URL, pyzip, "sha256", PYTHON_SHA256)
        download(SQLITE_URL, sqlzip, "sha3_256", SQLITE_SHA3)
        staging = root / (".install-" + uuid.uuid4().hex)
        staging.mkdir()
        with zipfile.ZipFile(pyzip) as archive:
            archive.extractall(staging)
        with zipfile.ZipFile(sqlzip) as archive:
            body = archive.read("sqlite3.dll")
        (staging / "sqlite3.dll").write_bytes(body)
        # Relative paths keep the installed bundle usable when the repository moves.
        (staging / "python313._pth").write_text("python313.zip\n.\n../../../../../scripts\n../../../../../scripts/catalog_authoring\nimport site\n", encoding="utf-8")
        os.replace(staging, target)
    return target / "python.exe", target / "sqlite3.dll", "3.13.15", [
        {"url": PYTHON_URL, "sha256": PYTHON_SHA256}, {"url": SQLITE_URL, "sha3_256": SQLITE_SHA3}]


def linux_runtime(root, archives):
    if sys.version_info < (3, 12):
        raise SystemExit("Linux Catalog bootstrap requires Python 3.12 or newer")
    compiler = shutil.which("gcc")
    if compiler is None:
        raise SystemExit("Linux Catalog bootstrap requires gcc; system packages are not installed automatically")
    version = platform.python_version()
    target = root / f"python-{version}-sqlite-{SQLITE_VERSION}-linux-{platform.machine()}"
    if not target.exists():
        archive_path = archives / "sqlite-amalgamation-3530400.zip"
        download(SQLITE_SOURCE_URL, archive_path, "sha3_256", SQLITE_SOURCE_SHA3)
        staging = root / (".install-" + uuid.uuid4().hex)
        staging.mkdir()
        library = staging / "lib/libsqlite3.so.0"
        library.parent.mkdir()
        with zipfile.ZipFile(archive_path) as archive:
            # Read only known release members; no archive paths become targets.
            (staging / "sqlite3.c").write_bytes(archive.read("sqlite-amalgamation-3530400/sqlite3.c"))
        subprocess.run([compiler, "-shared", "-fPIC", "-O2", "-DSQLITE_THREADSAFE=1",
                        "-DSQLITE_ENABLE_FTS5", "-DSQLITE_ENABLE_RTREE", "-DSQLITE_ENABLE_MATH_FUNCTIONS",
                        "-Wl,-soname,libsqlite3.so.0", "-o", str(library), str(staging / "sqlite3.c"),
                        "-lm", "-ldl", "-pthread"], check=True)
        subprocess.run([sys.executable, "-m", "venv", "--without-pip", "--copies", str(staging / "venv")], check=True)
        # A wrapper binds both the private library and repository imports. The
        # environment survives ordinary sys.executable child calls and Node's
        # existing Python bridge; no system interpreter/library is replaced.
        wrapper = staging / "python"
        wrapper.write_text(
            '#!/bin/sh\n'
            'runtime_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 1\n'
            'export LD_LIBRARY_PATH="$runtime_dir/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"\n'
            'export PYTHONPATH="$runtime_dir/../../../../../scripts:$runtime_dir/../../../../../scripts/catalog_authoring${PYTHONPATH:+:$PYTHONPATH}"\n'
            'export KONOCOMICS_CATALOG_PYTHON="$runtime_dir/python"\n'
            'exec "$runtime_dir/venv/bin/python3" "$@"\n', encoding="utf-8", newline="\n")
        wrapper.chmod(0o755)
        os.replace(staging, target)
    return target / "python", target / "lib/libsqlite3.so.0", version, [
        {"url": SQLITE_SOURCE_URL, "sha3_256": SQLITE_SOURCE_SHA3}]


def main():
    if sys.maxsize <= 2**32 or (os.name != "nt" and sys.platform != "linux"):
        raise SystemExit("Catalog bootstrap supports Windows x64 and Linux 64-bit")
    root = REPO / "data/local/catalog-authoring/runtime"
    root.mkdir(parents=True, exist_ok=True)
    archives = root / "downloads"
    archives.mkdir(exist_ok=True)
    executable, library, expected_python, sources = (windows_runtime(root, archives) if os.name == "nt"
                                                     else linux_runtime(root, archives))
    probe = subprocess.run([str(executable), "-B", "-c", PROBE],
                           check=True, capture_output=True, text=True)
    version = json.loads(probe.stdout)
    if (version["pythonVersion"] != expected_python or version["sqliteVersion"] != SQLITE_VERSION
            or version["childSqliteVersion"] != SQLITE_VERSION):
        raise ValueError("Installed runtime did not load its pinned SQLite")
    receipt = {"schemaVersion": "catalog-python-runtime-v1", **version,
               "platform": sys.platform,
               "python": executable.relative_to(REPO).as_posix(),
               "sqliteLibrary": library.relative_to(REPO).as_posix(),
               "sqliteLibrarySha256": hashlib.sha256(library.read_bytes()).hexdigest(),
               "sources": sources}
    if os.name == "nt":
        receipt["sqliteDllSha256"] = receipt["sqliteLibrarySha256"]
    (root / "runtime.json").write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt))


if __name__ == "__main__":
    main()
