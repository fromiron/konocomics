"""Separate tracked authoring code from durable local artifacts."""
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ROOT = REPO / "data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902"
LEGACY = Path(__file__).resolve().parent / "legacy"

import sys
sys.path.insert(0, str(REPO / "scripts"))
from workspace_paths import artifact_path
