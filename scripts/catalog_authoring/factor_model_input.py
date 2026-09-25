"""Deterministic reading view; never choose sources, values or source truth."""
from pathlib import Path
from authoring_paths import REPO, ROOT, LEGACY, artifact_path
from html.parser import HTMLParser
import re
import validate_factor_panel as panel


# A transport budget, never a source count, reading limit, or quality gate.
INLINE_READING_BYTES = 128 * 1024


class _HtmlReadingText(HTMLParser):
    """Mechanical navigation only; not a rendered page or a source verdict."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.excluded = None
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if self.excluded is None and tag in {"script", "style"}:
            self.excluded = tag

    def handle_endtag(self, tag):
        if tag == self.excluded:
            self.excluded = None

    def handle_data(self, value):
        if self.excluded is None and value.strip():
            self.parts.append(value.strip())


def reading_text(body, metadata):
    """Return complete decoded text or a labelled HTML text projection."""
    kind = metadata.get("kind")
    content_type = metadata.get("contentType") or ""
    html = kind == "http-body" and content_type.lower().split(";", 1)[0].strip() == "text/html"
    if not html and kind not in {"browser-text", "search-snippet", "document-text", "web-tool-response"}:
        return None
    declared = re.search(r"charset\s*=\s*[\"']?([^;\s\"']+)", content_type, re.I)
    if declared and declared.group(1).lower() not in {"utf-8", "utf8"}:
        return None
    try:
        text = body.decode("utf-8")
    except UnicodeDecodeError:
        return None
    if html:
        parser = _HtmlReadingText()
        parser.feed(text)
        parser.close()
        text = "\n".join(parser.parts)
    if not text:
        return None
    return {
        "representation": "html-text-navigation-v1" if html else "verbatim-utf8-capture",
        "text": text,
        "sha256": panel.sha256_bytes(text.encode("utf-8")),
        "bytes": len(text.encode("utf-8")),
        "isRenderedPage": False,
        "limitation": "HTML text nodes only; no scripts, styles, comments or attributes. Hidden nodes may remain. Consult the original for omitted content/metadata; absence here proves nothing." if html else "Exact text of this capture, not proof of complete source access or reading.",
    }


def reading_view(input_root: Path) -> dict:
    job = panel.read_json(input_root / "authoring-job.json")
    captures = []
    for receipt_path in sorted((input_root / "provenance").rglob("*.json")):
        if not receipt_path.name.startswith(("capture-", "web-response-")):
            continue
        receipt = panel.read_json(receipt_path)
        if not receipt.get("rawPath"):
            continue
        raw = panel._safe_child(receipt_path.parent, receipt["rawPath"])
        body = raw.read_bytes()
        if panel.sha256_bytes(body) != receipt["sha256"] or len(body) != receipt["bytes"]:
            raise panel.ValidationError(f"raw capture/receipt mismatch: {receipt_path}")
        captures.append((body, {
            "path": raw.relative_to(input_root).as_posix(),
            "receiptPath": receipt_path.relative_to(input_root).as_posix(),
            **{key: receipt[key] for key in ("kind", "url", "resolvedUrl", "request", "complete", "status", "contentType", "sha256", "bytes") if key in receipt},
        }))
    remaining = INLINE_READING_BYTES
    included = {}
    for body, metadata in captures:
        key = (metadata["sha256"], metadata.get("kind"), metadata.get("contentType"))
        if key in included:
            metadata["readingTextRef"] = included[key]
            continue
        text = reading_text(body, metadata)
        if text is not None and text["bytes"] <= remaining:
            metadata["readingText"] = text
            included[key] = metadata["path"]
            remaining -= text["bytes"]
        else:
            metadata["readingTextNotInlined"] = "unsupported encoding/type or empty text" if text is None else "whole text exceeds remaining prompt budget; use rawLookupPaths"
    works = []
    for row in job["works"]:
        wid = row["workId"]
        packet_path = f"chunks/chunk-01/packets/{wid}/packet.json"
        observations = row["research"]["sources"]
        sources = []
        for source in [*row["evidence"], *row["supplementalEvidence"]]:
            url = source["sourceUrl"]
            audits = [s for s in observations if s.get("url", s.get("sourceUrl")) == url]
            projected = {k: v for k, v in source.items() if k not in {
                "claimCandidateKeys", "claimCandidateAnchors", "collectorPass", "collectorChunk"}}
            projected["collectorReadAudits"] = [s.get("readAudit", {}) for s in audits]
            projected["collectorMetadata"] = [{k: v for k, v in s.items()
                if k not in {"claimCandidates", "observation", "limitation", "readAudit"} and (k not in projected or projected[k] != v)} for s in audits]
            differences = [{k: v for k, v in s.items() if k != "claimCandidates"} for s in audits
                           if s.get("observation") != source.get("observation")
                           or s.get("limitation") != source.get("limitation")]
            if differences:
                projected["originalCollectorObservations"] = differences
            # Exact URL occurrence is navigation, not evidence of claim support.
            projected["rawLookupPaths"] = [item["path"] for body, item in captures
                if url and (url in (item.get("url"), item.get("resolvedUrl")) or url.encode("utf-8") in body)]
            projected["rawAccess"] = "frozen-raw-available" if projected["rawLookupPaths"] else "observations-only"
            sources.append(projected)
        bound_urls = {s["sourceUrl"] for s in sources}
        works.append({
            "packet": panel.read_json(input_root / packet_path), "packetPath": packet_path,
            "sources": sources,
            "unboundCollectorObservations": [{k: v for k, v in s.items() if k != "claimCandidates"}
                for s in observations if s.get("url", s.get("sourceUrl")) not in bound_urls],
            "priorClaims": row["priorClaims"], "priorDecisions": row["priorDecisions"],
            **({"narrativeToneExhaustion": row["narrativeToneExhaustion"]} if "narrativeToneExhaustion" in row else {}),
        })
    indexed_paths = {item[key] for _, item in captures for key in ("path", "receiptPath")}
    routine = {"draft.mjs", "collection-session.json", "collection-events.jsonl", "research.jsonl"}
    additional = [{"path": p.relative_to(input_root).as_posix(), "bytes": p.stat().st_size}
        for p in sorted((input_root / "provenance").rglob("*")) if p.is_file()
        and p.relative_to(input_root).as_posix() not in indexed_paths and p.name not in routine
        and not p.name.endswith(".publisher-receipt.json")]
    contracts = {name: (input_root / "contracts" / name).read_text(encoding="utf-8") for name in
                 ("factor-dictionary.md", "annotation-guide.md", "02-authorized-evidence-panel-v1.md")}
    return {
        "schemaVersion": "factor-model-read-view-v2",
        "inputManifestSha256": panel.sha256(input_root / "PANEL-INPUT.sha256"),
        "contracts": contracts, "works": works,
        "rawCaptures": [item for _, item in captures],
        "inputAccess": {
            "rawCaptureCount": len(captures),
            "sourcesWithoutRawLookup": sum(not source["rawLookupPaths"] for work in works for source in work["sources"]),
            "limitation": "Observations-only means no indexed raw lookup in this input. It does not invalidate the observation, prove evidence absence or automatically require HOLD.",
        },
        "additionalProvenanceFiles": additional,
        "authorityContractPath": "contracts/09-catalog-authoring-authority.md",
        "priorAuthorityPaths": [name for name in ("prior-authority.json", "external-prior-authority.json") if (input_root / name).is_file()],
        "scope": "Navigation only. readingText is a mechanical display, not a rendered page or added evidence; HTML omissions never prove absence. Full capture bytes remain at rawLookupPaths. readingTextRef reuses only an identical display, not another source's authority. Read relevant rawLookupPaths when needed; URL/receipt matches do not authorize claims. Unbound observations can reveal contradictions but are not citable bound evidence. additionalProvenanceFiles are unclassified legacy files, not certified raw sources. Inspect a relevant file when no indexed capture matches. Missing raw lookup is an access limitation, never permission to invent evidence.",
    }
