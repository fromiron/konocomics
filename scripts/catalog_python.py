"""Launch Catalog tools with the repository's verified private Python runtime."""
from pathlib import Path
import json
import os
import shutil
import subprocess
import sys

REPO = Path(__file__).resolve().parents[1]


def executable():
    override = os.environ.get("KONOCOMICS_CATALOG_PYTHON")
    if override:
        target = Path(shutil.which(override) or override).resolve()
        if not target.is_file():
            raise SystemExit("Explicit Catalog Python executable is missing")
        return str(target)
    receipt = REPO / "data/local/catalog-authoring/runtime/runtime.json"
    if not receipt.is_file():
        raise SystemExit("Run python scripts/setup_catalog_runtime.py before using the Catalog runtime")
    runtime = json.loads(receipt.read_text(encoding="utf-8"))
    if runtime.get("platform", "win32") != sys.platform:
        raise SystemExit("Catalog runtime belongs to another platform; run scripts/setup_catalog_runtime.py on this host")
    target = (REPO / runtime["python"]).resolve()
    if not target.is_file():
        raise SystemExit("Catalog runtime executable is missing")
    return str(target)


if __name__ == "__main__":
    command = [executable(), "-B", "-X", "utf8", *sys.argv[1:]]
    environment = dict(os.environ, KONOCOMICS_CATALOG_PYTHON=command[0])
    sys.exit(subprocess.run(command, env=environment).returncode)
