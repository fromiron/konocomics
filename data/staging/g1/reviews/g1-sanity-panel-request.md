# konocomics G1 sanity gate decision

Review commit `37f7934d7e3c18bc04d537b529cb7b6c5ec7c7e6` on base branch `main`. This is the final G1 sanity decision for the frozen 50-work candidate. It is not G2 approval and does not authorize UI work. Read every supplied file in full and judge only the fixed G1 contract; do not invent a new metric or tune a scoring constant merely to prefer Taste over Baseline.

## Frozen evidence

- Cohort: exactly 50 unique `recommendationEligible` works. `cohort-manifest.json` SHA-256: `065e5b972cddd53367682fedf0ff1ced95b57358216f0c553cb65252f0cd97c8`.
- Art evidence: exact 50 works × 4 Art axes. `art-evidence-manifest.csv` SHA-256: `099caa89c566693e64c3abd8f2ac31ed314658479aba80064ad82978bfe77642`.
- Blind sample: deterministic 9/50, followed by a full official-entry-scope adjudication of all 117 sampled non-Art fields and all sampled Genre/Theme work-sets. `adjudicated/manifest.json` SHA-256: `e5f5bf0bba6dcb35cb8acc879b04e83ea5697a7347a50ffbb1e35e4cfe70d554`.
- Final generated catalog SHA-256: `eeb66d02fe74092c31b187c0b6b495c37f39ec979fa88ecc785377bfc547a6a4`.
- Final generated recommendation context SHA-256: `b1134d9638dec358816a05162873cffa16adce05039f66e881d54674b4409528`.
- Taste-vs-Baseline report SHA-256: `22f9dd5f1401f22f648392c4729157928fcc266f821d89b285460c46bff9513e`.
- The report was regenerated from the same catalog/context and compared byte-for-byte; both runs had the same SHA-256.

## Evidence-backed revision before this rerun

- A rank-blind official-publisher audit corrected only `ghost-in-the-shell`: `darkness=2` (unchanged value, confidence `0.90`), `mentalStress=1` (from `0`, confidence `0.80`), and `emotionalWarmth=1` (from `0`, confidence `0.72`). The audit did not inspect recommendation output, and no value was raised to a penalty threshold merely to change rank.
- The directionless positive-adjustment copy now says that a factor matches the user's preference instead of claiming the user likes the factor's high direction. The contribution identity, score, and scoring contract are unchanged.
- The cohort, factor dictionary, Art audit, ranking formula, thresholds, and list constraints did not change. `ghost-in-the-shell` remains `warm-exploration` rank 10, so this rerun must judge it and the whole report on the fixed G1 contract rather than inherit any prior panel verdict.

## Structural and data checks

- The candidate builder completed twice with byte-identical output.
- The final candidate has 50 works, complete recommendation context, and zero coverage failures.
- Catalog validation has the expected 50 `UNREVIEWED_ELIGIBILITY` errors and 115 `EVIDENCE_NOT_HUMAN_REVIEWED` warnings: the data remains explicitly unreviewed until this authorized panel reaches unanimous GO. No record is falsely marked as human-reviewed.
- The full repository gate passed: 291 tests, typecheck, lint, formatting, Next production build, and diff check.
- Art adjudication and recommendation-context semantics were preserved while the 9-work non-Art adjudication was applied; the context bytes changed only because the joint `catalogVersion` digest changed.
- The three synthetic profiles are fixed Slice 3 fixtures, not selected after viewing the rankings. Every Taste and Baseline list contains 10 results. Taste has zero SHRUNK groups; PARTIAL group counts are 13, 16, and 15.

## G1 contract

Per `02-product-spec.md` §7 and `06-implementation-plan.md` G1, GO requires all of the following on the attached Top 10 report:

1. No obviously wrong Top 10 result for any of the three profiles.
2. A minority taste survives rather than being erased by the majority anchors.
3. Works with much unknown data are not visibly overvalued.
4. Negative reasons affect only the intended factor and do not create obvious disliked leakage.

G1 does **not** require Taste to beat Baseline; that comparative decision belongs to the 150-work G2 blind test. A surprising result is not automatically wrong if the contribution ledger and profile inputs support it.

## Required verdict

Start with exactly `GO` or `REVISE`, then answer all items.

1. Review each profile (`kinetic-competition`, `tactical-mystery`, `warm-exploration`) and identify any obviously wrong Taste Top 10 result. Cite the exact profile, rank, work, and decisive contribution/penalty evidence.
2. Decide whether each profile preserves its distinctive minority taste. Cite concrete Taste-vs-Baseline differences.
3. Decide whether any unknown-heavy work appears overvalued. Distinguish `PARTIAL` coverage from `SHRUNK`; do not treat every partial group as a failure.
4. Audit the negative-reason behavior, especially `vagueDislike`, `tooSlow`, `tooDark`, `tooStressful`, and `artStyleDislike`. State any disliked leakage or factor mismatch.
5. Decide whether the frozen 50-work candidate passes G1 exactly as-is.
6. If `REVISE`, give the smallest evidence-backed correction and state whether it changes the cohort, factor dictionary, scoring contract, or only data. Do not propose G2 or UI work.

Only an unqualified `GO` means the final candidate may be marked as approved by this user-authorized model panel and G1 may close. Any material uncertainty is `REVISE`.
