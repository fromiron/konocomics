"""Independent, indexed expected Catalog state derived from sealed publish plans.

This module does not import the SQL materializers. A batch constructs one state
from its baseline, applies validated plans, and compares the final full snapshot
with the candidate. Ordinary plans visit only their rows; whole-table projection
renumbering is required only by snapshot replacement and correction demotion.
"""
from __future__ import annotations

import csv
import hashlib
import heapq
import io
import json


_KEYS = {
    "source_works": ("id",), "source_evidence": ("id",),
    "source_factors": ("workId", "axisId"),
    "source_themes": ("workId", "themeId"),
    "source_recommendation_context": ("workId",),
}
_FACTOR_VALUES = ("state", "value", "confidence", "evidenceId")
_RECOVERY_TABLES = (
    "source_works", "source_aliases", "source_volumes", "source_factors",
    "source_themes", "source_evidence", "source_recommendation_context",
    "source_art_evidence_manifest",
)


def _json(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


class _Table:
    def __init__(self, name, columns, rows):
        self.name, self.columns = name, tuple(columns)
        self.positions = {key: i for i, key in enumerate(columns)}
        self.owner = "id" if name == "source_works" else "workId"
        self.keys = _KEYS.get(name, ("sourceOrdinal",))
        self.rows, self.by_key, self.owners = {}, {}, {}
        self.ordinals, self.lines = [], []
        for values in rows:
            self.put(tuple(values))

    def put(self, values):
        ordinal = values[self.positions["sourceOrdinal"]]
        key = tuple(values[self.positions[k]] for k in self.keys)
        if ordinal in self.rows or key in self.by_key:
            raise ValueError(f"Duplicate expected Catalog row: {self.name} {key}")
        self.rows[ordinal], self.by_key[key] = values, ordinal
        if self.owner in self.positions:
            self.owners.setdefault(values[self.positions[self.owner]], set()).add(ordinal)
        heapq.heappush(self.ordinals, -ordinal)
        heapq.heappush(self.lines, (-values[self.positions["sourceLine"]], ordinal))

    def row(self, *key):
        if key not in self.by_key:
            raise ValueError(f"Expected Catalog row missing: {self.name} {key}")
        return dict(zip(self.columns, self.rows[self.by_key[key]]))

    def update(self, key, changes):
        old = self.row(*key)
        if any(k not in self.positions or k in self.keys or k in {"sourceOrdinal", "sourceLine"}
               for k in changes):
            raise ValueError(f"Invalid expected Catalog update fields: {self.name}")
        old.update(changes)
        self.rows[old["sourceOrdinal"]] = tuple(old[k] for k in self.columns)

    def owned(self, ids):
        ordinals = set().union(*(self.owners.get(wid, set()) for wid in ids)) if ids else set()
        return tuple(self.rows[i] for i in sorted(ordinals))

    def delete_owner(self, wid):
        for ordinal in self.owners.pop(wid, ()):
            values = self.rows.pop(ordinal)
            del self.by_key[tuple(values[self.positions[k]] for k in self.keys)]

    def append(self, row):
        while self.ordinals and -self.ordinals[0] not in self.rows:
            heapq.heappop(self.ordinals)
        while self.lines and (self.lines[0][1] not in self.rows or
                self.rows[self.lines[0][1]][self.positions["sourceLine"]] != -self.lines[0][0]):
            heapq.heappop(self.lines)
        row = {**row, "sourceOrdinal": (-self.ordinals[0] if self.ordinals else 0) + 1,
               "sourceLine": (-self.lines[0][0] if self.lines else 1) + 1}
        self.put(tuple(row[k] for k in self.columns))

    def reindex(self):
        rows, line = [], 1
        for ordinal, row in enumerate(self.all_rows(), 1):
            stream = io.StringIO(newline="")
            csv.writer(stream, lineterminator="\n").writerow([str(value) for value in row[2:]])
            line += stream.getvalue().count("\n")
            rows.append((ordinal, line, *row[2:]))
        self.__init__(self.name, self.columns, rows)

    def all_rows(self):
        return tuple(self.rows[i] for i in sorted(self.rows))


class CatalogState:
    """Mutable expected state; discard it if ``apply`` raises or SQL rolls back.

    ``scope`` retains every table's columns but omits unowned global rows. Only
    ``snapshot`` includes globals, for the final full-state comparison. Gold and
    all owners outside ``targetIds`` are immutable apart from the projection
    ordinals that a declared snapshot replacement must renumber.
    """
    def __init__(self, snapshot, gold_ids=()):
        self.tables = {name: _Table(name, *value) for name, value in snapshot.items()}
        self.gold_ids = set(gold_ids)
        self.changed = set()

    def snapshot(self):
        return {name: (table.columns, table.all_rows()) for name, table in self.tables.items()}

    def scope(self, work_ids):
        ids = set(work_ids)
        return {name: (table.columns, table.owned(ids)) for name, table in self.tables.items()}

    def _permit(self, wid):
        if wid in self.gold_ids:
            raise ValueError(f"Expected plan changes Gold work: {wid}")
        if wid not in self.targets:
            raise ValueError(f"Expected plan changes non-target work: {wid}")

    def _update(self, table, key, changes):
        target = self.tables[table]
        self._permit(target.row(*key)[target.owner])
        target.update(key, changes)
        self.changed.add(table)

    def _append(self, table, row):
        self._permit(row[self.tables[table].owner])
        self.tables[table].append(row)
        self.changed.add(table)

    def _delete(self, table, wid):
        self._permit(wid)
        self.tables[table].delete_owner(wid)
        self.changed.add(table)

    def _factor(self, after, before=None):
        key = (after["workId"], after["axisId"])
        current = self.tables["source_factors"].row(*key)
        if before is None:
            if current["state"] != "unknown":
                raise ValueError(f"Expected factor lost unknown baseline: {key}")
        elif any(current[field] != before[field] for field in _FACTOR_VALUES):
            raise ValueError(f"Expected factor lost exact baseline: {key}")
        self._update("source_factors", key, {field: after[field] for field in _FACTOR_VALUES})

    def _semantic_target(self, wid):
        result = {}
        for name in _RECOVERY_TABLES:
            if name not in self.tables:
                continue
            table = self.tables[name]
            result[name] = sorted((dict(zip(table.columns[2:], row[2:]))
                                  for row in table.owned({wid})), key=_json)
        return result

    def _status(self, wid, active, reviewed_at, reference, *, recovery=False):
        self._update("source_works", (wid,), {
            "onboardingEligible": "true" if active else "false",
            "recommendationEligible": "true" if active else "false",
            "libraryOnly": "false" if active else "true",
            "annotationReviewMethod": "authorizedEvidencePanel" if active or recovery else "unreviewed",
            "annotationReviewedAt": reviewed_at if active or recovery else "",
            "annotationReviewReference": reference if active or recovery else "",
        })

    def apply(self, plan):
        """Derive the exact row result without consulting the writer's result."""
        self.targets, self.changed = set(plan.get("targetIds", ())), set()
        if self.targets & self.gold_ids:
            raise ValueError("Expected plan targets Gold")
        if plan.get("scopeCorrections"):
            from scope_correction import digest, snapshot_from_rows, FLAGS
            if set(plan["scopeCorrections"]) != self.targets:
                raise ValueError("Expected scope correction target mismatch")
            for wid, correction in plan["scopeCorrections"].items():
                before = snapshot_from_rows(self.scope({wid}), wid)
                if before != correction["beforeSnapshot"] or digest(before["tables"]) != correction["beforeSnapshotSha256"]:
                    raise ValueError("Expected scope correction lost frozen before snapshot")
                if correction["afterEligibility"] != FLAGS:
                    raise ValueError("Expected scope correction flags mismatch")
                self._update("source_works", (wid,), {key: str(value).lower() for key, value in FLAGS.items()})
            for eid, row in sorted(plan["newEvidence"].items()):
                if row["id"] != eid:
                    raise ValueError("Expected scope evidence identity mismatch")
                self._append("source_evidence", row)
            return set(self.changed)
        fresh, recovery = plan.get("freshSnapshots", {}), plan.get("recoverySnapshots", {})
        if set(fresh) & set(recovery):
            raise ValueError("Overlapping expected fresh/recovery snapshots")
        for wid, snapshot in recovery.items():
            self._permit(wid)
            digest = hashlib.sha256(_json(self._semantic_target(wid)).encode("utf-8")).hexdigest()
            if digest != snapshot["bindingSha256"]:
                raise ValueError(f"Expected recovery target binding changed: {wid}")
        corrections = plan.get("priorCorrections", [])
        correction_keys = {(r["after"]["workId"], r["after"]["axisId"]) for r in corrections}
        replaced = set(fresh) | set(recovery)
        context_only = plan.get("contextOnlyWorkUpdates", {})

        for eid, row in sorted(plan.get("newEvidence", {}).items()):
            if row["id"] != eid:
                raise ValueError("Expected evidence ID mismatch")
            self._append("source_evidence", row)
        for field in ("evidenceNormalizations", "evidenceUpdates"):
            for eid, row in sorted(plan.get(field, {}).items()):
                self._update("source_evidence", (eid,), {k: row[k] for k in ("sourceType", "notes")})
        for row in plan.get("factorUpdates", []):
            if row["workId"] not in replaced and (row["workId"], row["axisId"]) not in correction_keys:
                self._factor(row, row.get("candidateBefore"))
        for row in plan.get("themeInserts", []):
            if row["workId"] not in replaced:
                self._append("source_themes", row)
        for wid, genres in sorted(plan.get("genreUpdates", {}).items()):
            if wid not in replaced:
                self._update("source_works", (wid,), {"genres": genres})
        for row in plan.get("contextInserts", []):
            if row["workId"] not in recovery:
                self._append("source_recommendation_context", row)
        for row in plan.get("workUpdates", []):
            wid = row["id"]
            if wid not in recovery and wid not in context_only:
                self._status(wid, True, row["annotationReviewedAt"], row["annotationReviewReference"])
        for wid in plan.get("legacyPassIds", []):
            work = self.tables["source_works"].row(wid)
            if (work["annotationReviewMethod"], work["recommendationEligible"], work["libraryOnly"]) != ("authorizedEvidencePanel", "true", "false"):
                raise ValueError(f"Expected legacy PASS baseline mismatch: {wid}")
            self._update("source_works", (wid,), {"onboardingEligible": "true"})

        for correction in corrections:
            self._factor(correction["after"], correction["before"])
        for wid, snapshot in sorted(fresh.items()):
            for item in snapshot["factorRows"]:
                self._factor(item["after"], item["before"])
            if self.tables["source_works"].row(wid)["genres"] != snapshot["beforeGenres"]:
                raise ValueError(f"Expected fresh genres baseline mismatch: {wid}")
            fields = ("workId", "themeId", "centrality", "confidence", "evidenceId")
            themes = self.tables["source_themes"]
            current = [dict(zip(themes.columns, row)) for row in themes.owned({wid})]
            if sorted(({k: row[k] for k in fields} for row in current), key=lambda r: r["themeId"]) != sorted(snapshot["beforeThemes"], key=lambda r: r["themeId"]):
                raise ValueError(f"Expected fresh themes baseline mismatch: {wid}")
            self._update("source_works", (wid,), {"genres": snapshot["afterGenres"]})
            self._delete("source_themes", wid)
            for row in snapshot["afterThemes"]:
                self._append("source_themes", row)
        if fresh:
            self.tables["source_themes"].reindex()
        corrected = {wid for wid, _axis in correction_keys}
        blocked = set(plan.get("correctionBlockedIds", []))
        for wid in sorted(corrected):
            actual = {row["axisId"]: {k: row[k] for k in ("state", "value")}
                      for values in self.tables["source_factors"].owned({wid})
                      for row in (dict(zip(self.tables["source_factors"].columns, values)),)}
            if actual != plan["correctionAxisSnapshot"][wid]:
                raise ValueError(f"Expected correction Axis snapshot mismatch: {wid}")
            self._status(wid, wid not in blocked, plan["correctionReviewedAt"], plan["correctionReviewReference"])
            if wid in blocked:
                self._delete("source_recommendation_context", wid)
        if blocked:
            self.tables["source_recommendation_context"].reindex()
        for row in plan.get("workUpdates", []):
            wid = row["id"]
            if wid in context_only and wid not in recovery:
                current = self.tables["source_works"].row(wid)
                if any(current[k] != context_only[wid][k] for k in ("annotationReviewedAt", "annotationReviewReference")):
                    raise ValueError(f"Expected context-only baseline mismatch: {wid}")
                self._update("source_works", (wid,), {k: row[k] for k in ("annotationReviewedAt", "annotationReviewReference")})

        for wid, snapshot in sorted(recovery.items()):
            for item in snapshot["factorRows"]:
                self._factor(item["after"], item["before"])
            self._delete("source_themes", wid)
            for row in snapshot["afterThemes"]:
                self._append("source_themes", row)
            self._delete("source_recommendation_context", wid)
            contexts = [row for row in plan.get("contextInserts", []) if row["workId"] == wid]
            active = plan["recoveryPromotions"][wid]["panelOutcome"] == "PASS"
            if len(contexts) != int(active):
                raise ValueError(f"Expected recovery context membership mismatch: {wid}")
            for row in contexts:
                self._append("source_recommendation_context", row)
            self._update("source_works", (wid,), {"genres": snapshot["afterGenres"]})
            self._status(wid, active, plan["recoveryReviewedAt"], plan["recoveryReviewReference"], recovery=True)
        if recovery:
            for name in ("source_themes", "source_recommendation_context"):
                self.tables[name].reindex()
        return set(self.changed)
