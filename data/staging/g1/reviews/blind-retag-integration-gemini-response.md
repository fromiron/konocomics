REVISE

### 1. Integration Policy Selection & Justification

**Selected Policy:** `FULL_EVIDENCE_ADJUDICATION`

**Justification:**
- **Failure of `FULL_OVERRIDE`:** The blind re-tagging run operated on a restricted single-source input (`input.md`), causing conservative reconciliation to collapse 105 non-Art factor rows to `unknown` and triggering 23 `COVERAGE_BELOW_THRESHOLD` validation errors across all 9 sampled works. Directly applying `FULL_OVERRIDE` accepts a restricted-input artifact as authoritative, permanently breaking catalog validation (`catalog:validate`) and keeping G1 in `REVISE` status.
- **Failure of `SPARSE_RETAIN`:** Silently retaining 105 unverified legacy non-Art rows and 28 theme rows without evidence disposition violates Product Principles 2, 5, and 10 in [`02-product-spec.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/planning/02-product-spec.md#L28-L43) ("insufficient evidence is `unknown`", "do not recommend low-confidence works") and bypasses required catalog evidence contracts.
- **Compliance of `FULL_EVIDENCE_ADJUDICATION`:** Aligns with [`02-product-spec.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/planning/02-product-spec.md#L171-L186) §5.1/§6.2, [`annotation-guide.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/factors/annotation-guide.md), and [`06-implementation-plan.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/planning/06-implementation-plan.md#L61-L73) Gate G1 Steps 5–6. It treats the conservative blind reconciliation as a diagnostic signal. Each sampled non-Art field/tag is adjudicated against full official entry-scope evidence: values supported by evidence are confirmed with human review records, while values lacking evidence remain `unknown`. If coverage remains below threshold after full evidence review, the work is remediated or replaced via the deterministic replacement rule ([`06-implementation-plan.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/planning/06-implementation-plan.md#L70)).

---

### 2. Authority of Official Art Evidence Audit

**Decision:** **Yes.** The separately audited 200-row Art evidence result (`art-evidence-manifest.csv`, SHA-256 `099caa89c566693e64c3abd8f2ac31ed314658479aba80064ad82978bfe77642`) **must remain authoritative**.

**Rationale:** The blind input (`input.md`) deliberately excluded official interior visual sample URLs and page/panel reference annotations. Overriding the audited Art evidence with blind `unknown`s would violate Art evidence completeness requirements in [`build-g1-candidate.ts`](file:///tmp/konocomics-gemini-panel.Dba9mV/scripts/build-g1-candidate.ts#L589-L600) (`assertG1ArtEvidence`) and [`06-implementation-plan.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/planning/06-implementation-plan.md#L63) Gate G1 Step 1.

---

### 3. Impact of 23 Coverage Failures on G1 Gate

**Decision:** **Yes.** The 23 `COVERAGE_BELOW_THRESHOLD` validation errors make G1 **`REVISE`** and strictly forbid publishing or approving a candidate build.

**Rationale:** Per [`02-product-spec.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/planning/02-product-spec.md#L256-L257) §6.2 and [`06-implementation-plan.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/planning/06-implementation-plan.md#L71) Gate G1, coverage thresholds (Genre 0.80, Theme 0.60, Narrative 0.60, Tone 0.60, Art 0.30) are strict validation requirements (`catalog:validate`). Coverage shrink is a scoring fallback for runtime evaluation, not a license to bypass catalog validation gates. Gate G2 and UI implementation (Slice 5+) cannot proceed while catalog validation errors exist.

---

### 4. Smallest Durable Artifact and Builder Rule

- **Durable Artifact:** 
  An evidence-backed adjudication override file (e.g., `data/staging/g1/adjudicated-blind-sample.csv`) paired with corresponding evidence records appended to `data/source/evidence/evidence.csv`, referencing explicit `evidenceId`s (e.g. `evidence-g1-adjudicated-{workId}`).
- **Builder Rule:**
  In [`build-g1-candidate.ts`](file:///tmp/konocomics-gemini-panel.Dba9mV/scripts/build-g1-candidate.ts):
  1. Retain the authoritative 200-row Art evidence manifest (`art-evidence-manifest.csv`).
  2. Overlay the evidence-adjudicated non-Art factor, genre, and theme datasets for the 9 sampled works onto the candidate source.
  3. Ensure every active `known` row references a valid, human-reviewed record in `evidence.csv`.
  4. Run `runCatalogPipeline()` to enforce full structural validation, threshold compliance, and deterministic JSON generation.

---

### 5. Explicit Disposition Requirement for Retained Values

- **Requirement:** Retaining any existing candidate value or tag requires an **explicit, audited disposition** in `data/source/evidence/evidence.csv` with `reviewedByHuman: true`, valid official `sourceUrl`, and non-zero `confidence` matching [`annotation-guide.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/factors/annotation-guide.md).
- **Prohibition:** Silent fallback (retaining legacy candidate values without evidence when a blind difference is flagged) is strictly prohibited. Any value lacking full official evidence disposition must be set to `unknown` (or omitted for tags).

---

### 6. Decisive Next Step and Cohort Status

- **Decisive Next Step:** Execute `FULL_EVIDENCE_ADJUDICATION` on the 9 sampled works using full official entry-scope evidence, update `data/source/evidence/evidence.csv` with verified dispositions, re-run candidate source compilation, and verify clean passing via `npm run catalog:validate`.
- **Rerun Cohort / Sample?:** **No.** The 50-work cohort manifest (`cohort-manifest.json`, SHA-256 `065e5b972cddd53367682fedf0ff1ced95b57358216f0c553cb65252f0cd97c8`) and 9-work blind sample manifest (`sample-manifest.json`) remain frozen and valid. Re-sampling is required only if the core cohort composition or factor dictionary policy changes ([`06-implementation-plan.md`](file:///tmp/konocomics-gemini-panel.Dba9mV/docs/planning/06-implementation-plan.md#L67) Gate G1 Step 5).
