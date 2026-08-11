# G1 replacement selection Oracle follow-up

- Date: 2026-08-11
- Repository: `fromiron/konocomics`
- Base branch: `main`
- Required model: ChatGPT `5.6 Pro`
- Prior verdict: `REVISE`

## Exact correction

The only reported blocker was freeze-byte drift. The two previously approved artifacts are now restored byte-for-byte:

- `original-cohort-freeze.json`: `5f970ead7bf0fddf5c96b58d7efeab6f96cb3ea32b04e94231bb2f3331b75eb3`
- `replacement-pool-freeze.json`: `efbc3b19e7018d07b7e1b9e2674c82a95a481fb4cd99fb480326ea99a0255c39`

`build-g1-replacement.ts` now reads `policyVersion` only from the approved pool freeze. It accepts the approved original freeze's four-signal tuple, while the approved pool's distance-exclusion tuple still includes `review`. The selector input projection remains limited to non-Art Axis, Genre, and Theme values, so reviews are not read.

Two unreachable checks already guaranteed by literal Zod schemas were removed; no selection behavior changed.

The regenerated manifest is `800692c4905988723a2e773d4a8d1ac842538d8e8b943fe56d9953c5f9ced82c`. All 25 pair rows, distances, diversity decisions, selected pair, and rank remain byte-identical apart from the restored input hashes:

- `beyond-the-clouds`
- `noragami-stray-god`
- combined distance `0.8967307692307692`
- selected rank `1` of `25`

Verification passed:

- `pnpm catalog:g1-replacement`
- `pnpm catalog:g1-replacement -- --check`
- selector/source-schema focused tests: 14/14
- `pnpm typecheck`
- `pnpm lint`

## Requested verdict

Start with exactly `GO` or `REVISE`. Review only whether the freeze-byte blocker is resolved and the prior selected-replacement checkpoint may now proceed. `GO` does not approve the final cohort or G1.
