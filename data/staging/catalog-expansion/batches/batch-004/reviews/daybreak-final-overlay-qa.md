# Batch 004 final overlay — superseding terminal QA

## Verdict

- QA date: `2026-08-26`
- `reviewedByHuman=false`; human validation remains `NOT_RUN`.
- Verdict: **PASS for partial terminal application**.
- Authorized terminal outcomes: 11 `recommendationVerified`, 1 `promotionBlocked`, 38 `pending`.

This report supersedes the 2026-08-25 FAIL. The shared overlay builder no longer converts every coverage-deficient work into `SOURCE_INFORMATION_UNAVAILABLE`. When a batch supplies an explicit blocker-adjudication file, a deficient work without an exact authorized blocker now remains pending. The exact 50-work cardinality is checked as verified + blocked + pending.

## Terminal identity

- Verified positions: `3, 14, 17, 18, 20, 21, 41, 43, 44, 47, 49`.
- Blocked position: `42` / `work-d63a83030a8819ff553c` / モテキ.
- Position 42 retains the exact compound order `FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE` and the independently adjudicated two blocker rows.
- All other deficient works remain pending; no quota fill, inferred low value, or synthetic source exhaustion was introduced.

## Evidence boundary

Luna Max independently checked official volumes, Japanese community material, and Korean discovery routes for the disputed positions. Position 41's two Tone values are retained; position 45's proposed strategy/mystery additions are rejected; positions 23/24/31 remain unresolved and unblocked. Recommendation and Art context rows are descriptors and metadata only, not substitute Factor evidence.

## Required checks

The deterministic overlay check must reproduce `11 verified / 1 blocked / 38 pending`, exact frozen order, all source hashes, Art evidence gates, recommendation context rows, and `reviewedByHuman=false`. Promotion may mutate only those 12 terminal works; the 38 pending registry/source entries must remain byte-identical.
