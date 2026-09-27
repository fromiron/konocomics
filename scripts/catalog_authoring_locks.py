"""Bounded process locks shared by Python and Node authoring writers."""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import errno
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import uuid

from workspace_paths import artifact_path


@contextmanager
def child_lifetime():
    """On Windows, broker death kills its descendants before releasing authority."""
    if os.name != "nt":
        yield
        return
    import ctypes
    from ctypes import wintypes

    class BasicLimits(ctypes.Structure):
        _fields_ = [("processTime", ctypes.c_int64), ("jobTime", ctypes.c_int64),
                    ("flags", wintypes.DWORD), ("minWorkingSet", ctypes.c_size_t),
                    ("maxWorkingSet", ctypes.c_size_t), ("activeProcesses", wintypes.DWORD),
                    ("affinity", ctypes.c_size_t), ("priority", wintypes.DWORD),
                    ("scheduling", wintypes.DWORD)]

    class IoCounters(ctypes.Structure):
        _fields_ = [(name, ctypes.c_uint64) for name in ("readOps", "writeOps", "otherOps", "readBytes", "writeBytes", "otherBytes")]

    class ExtendedLimits(ctypes.Structure):
        _fields_ = [("basic", BasicLimits), ("io", IoCounters),
                    ("processMemory", ctypes.c_size_t), ("jobMemory", ctypes.c_size_t),
                    ("peakProcessMemory", ctypes.c_size_t), ("peakJobMemory", ctypes.c_size_t)]

    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.CreateJobObjectW.argtypes = [ctypes.c_void_p, wintypes.LPCWSTR]
    kernel.CreateJobObjectW.restype = wintypes.HANDLE
    kernel.GetCurrentProcess.restype = wintypes.HANDLE
    kernel.SetInformationJobObject.argtypes = [wintypes.HANDLE, ctypes.c_int, ctypes.c_void_p, wintypes.DWORD]
    kernel.AssignProcessToJobObject.argtypes = [wintypes.HANDLE, wintypes.HANDLE]
    kernel.CloseHandle.argtypes = [wintypes.HANDLE]
    job = kernel.CreateJobObjectW(None, None)
    if not job:
        raise ctypes.WinError(ctypes.get_last_error())
    limits = ExtendedLimits()
    limits.basic.flags = 0x2000  # JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
    completed = False
    try:
        if not kernel.SetInformationJobObject(job, 9, ctypes.byref(limits), ctypes.sizeof(limits)):
            raise ctypes.WinError(ctypes.get_last_error())
        if not kernel.AssignProcessToJobObject(job, kernel.GetCurrentProcess()):
            raise ctypes.WinError(ctypes.get_last_error())
        yield
        completed = True
    finally:
        # This path runs only while the broker is alive. A hard kill instead
        # closes the handle with KILL_ON_JOB_CLOSE still enabled.
        if completed:
            limits.basic.flags = 0
            kernel.SetInformationJobObject(job, 9, ctypes.byref(limits), ctypes.sizeof(limits))
        kernel.CloseHandle(job)


def _contended(error):
    winerror = getattr(error, "winerror", None)
    if winerror is not None:
        return winerror in (33, 36)
    # The CRT locking API reports contention as EACCES without a winerror.
    # A native access-denied error above must not become a five-minute retry.
    return error.errno in (errno.EACCES, errno.EAGAIN, errno.EDEADLK)


def assert_no_pending(repo, *, recovery=None):
    """A partial directory publication must be recovered before another mutation."""
    repo = Path(repo).resolve()
    marker = repo / "data/local/catalog-authoring/locks/publication.pending.json"
    if not marker.is_file():
        return
    pending = json.loads(marker.read_text(encoding="utf-8"))
    if recovery is None or artifact_path(pending["preparedPath"], repo).resolve() != Path(recovery).resolve():
        raise ValueError(f"Recover the pending canonical publication before another write: {marker}")


@contextmanager
def acquire(path, *, wait=True, timeout=300, metadata=None):
    """Only contention is retried. Death releases the OS lock, not a time lease."""
    path = Path(path).resolve()
    path.parent.mkdir(parents=True, exist_ok=True)
    started = time.perf_counter()
    marker = path.with_suffix(path.suffix + ".owner.json")
    with path.open("a+b") as handle:
        if handle.tell() == 0:
            handle.write(b"0")
            handle.flush()
        while True:
            handle.seek(0)
            try:
                if os.name == "nt":
                    import msvcrt
                    msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
                else:
                    import fcntl
                    fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except OSError as error:
                if not _contended(error) or not wait:
                    raise
                if time.perf_counter() - started >= timeout:
                    raise TimeoutError(f"Authoring lock timed out after {timeout}s: {path}") from error
                time.sleep(min(0.05, max(0.001, timeout - (time.perf_counter() - started))))
        acquired = time.perf_counter()
        owner = {"path": str(path), "pid": os.getpid(), "nonce": uuid.uuid4().hex,
                 "startedAt": time.time(), "metadata": metadata or {}}
        try:
            marker.write_text(json.dumps(owner) + "\n", encoding="utf-8")
            yield owner
        finally:
            if marker.is_file():
                try:
                    if json.loads(marker.read_text(encoding="utf-8")).get("nonce") == owner["nonce"]:
                        marker.unlink()
                except (OSError, ValueError):
                    pass
            handle.seek(0)
            if os.name == "nt":
                msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(handle, fcntl.LOCK_UN)
            if metadata is not None:
                print(json.dumps({"authoringLock": str(path), "waitSeconds": acquired - started,
                                  "heldSeconds": time.perf_counter() - acquired,
                                  "metadata": metadata}), file=sys.stderr, flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    command = sub.add_parser("exec")
    command.add_argument("--repo", type=Path, required=True)
    command.add_argument("--name", choices=("publication.lock", "publication-owner.lock"), required=True)
    command.add_argument("--timeout", type=float, default=300)
    command.add_argument("--recovery", type=Path)
    command.add_argument("command", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    argv = args.command[1:] if args.command[:1] == ["--"] else args.command
    if not argv:
        parser.error("A child command is required")
    path = args.repo.resolve() / "data/local/catalog-authoring/locks" / args.name
    with acquire(path, timeout=args.timeout, metadata={"command": Path(argv[0]).name}) as owner:
        if args.name == "publication.lock":
            assert_no_pending(args.repo, recovery=args.recovery)
        environment = dict(os.environ, CATALOG_COMMIT_LOCK_HELD=json.dumps(owner))
        with child_lifetime():
            return subprocess.run(argv, env=environment).returncode


if __name__ == "__main__":
    sys.exit(main())
