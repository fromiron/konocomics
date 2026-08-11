# konocomics G1 blind-retag integration decision

Review commit `6a4bc1a70a661824e2498445f5de6db0becbdb84` for `fromiron/konocomics` on base branch `main`. This is a pre-G1 data decision, not G1/G2/UI approval. Read every attached file in full. Do not inspect recommendation outputs or market/review signals, and do not tune any threshold or scoring constant.

## Fixed facts

- Final cohort: 50 unique `recommendationEligible` works; cohort manifest SHA-256 `065e5b972cddd53367682fedf0ff1ced95b57358216f0c553cb65252f0cd97c8`.
- Current 50-work candidate rebuilds byte-identically and passes every structural/Art/context check, leaving exactly 50 expected `UNREVIEWED_ELIGIBILITY` errors.
- The 9-work blind sample, A/B model outputs, and GPT-5.6 Pro reconciliation were frozen before the original labels were reopened.
- Reconciled file SHA-256:
  - factors `8ee2e1d4b0e319ae464f9c2049cd4030891c28fc65853d341896913ebe308953`
  - genres `644cac39e1243b8971c8a0e718fb85032f735465534b96e1bc5ab075234d05bd`
  - themes `59556a4f5d31523faffd4192452738fe2214e45145a6e6750fa61e7a1d89d923`
- Oracle previously approved those bytes as a conservative blind reconciliation only; it explicitly did not approve G1.
- The current candidate builder does not consume this main blind reconciliation.

## Post-freeze comparison

A full authoritative merge would replace every sampled non-Art row, including `unknown`, and replace every sampled Genre/Theme work-set.

- Factors: 153 total; 135 current `known` rows become `unknown` (105 non-Art + 30 Art), five retained known values change, six retained equal values lower confidence.
- Art is separately governed by the exact 200-row official-interior evidence audit (manifest SHA-256 `099caa89c566693e64c3abd8f2ac31ed314658479aba80064ad82978bfe77642`). The blind input did not expose those Art URLs. Preserving the separately audited Art rows is therefore the only currently evidence-complete Art path.
- With Art preserved but all 117 reconciled non-Art rows applied, catalog validation produces exactly 23 `COVERAGE_BELOW_THRESHOLD` errors across all nine sampled works:
  - 20th Century Boys, Berserk, Blue Lock, Dr.STONE, Dungeon Meshi, Kingdom: Narrative and Tone.
  - JoJo: Theme, Narrative, and Tone.
  - Bocchi the Rock and MONSTER: Genre, Theme, Narrative, and Tone.
- A sparse-known merge is not the reconciliation: it would silently preserve 105 unresolved current known non-Art values and 28 extra Theme rows.
- Direct full merge also needs nine missing `blind-retag-g1-v1-*` evidence rows.
- Current source hashes:
  - works `e7a93a87f3d89acae577f8b028e15644328ca15e633698507e0a284cfd1e8732`
  - factors `eafad1475b722d86bd5f88a97ce7f8b2076adcd0c64876f8da1b856b0d343397`
  - themes `d6ab4fd05bfeab7e0bb0e783a1851ddc34a7c9cb84f0217f25179e0baacc6749`
  - evidence `5a4ce737fe04d283cd0200e83b07c26b44b5cfe8fac668cc2557a9d317f8a53f`

The product contract says insufficient evidence is `unknown`, coverage must not be bypassed, and accepted blind differences must be adjusted before the final atomic candidate build. It does not say whether the narrow-source blind reconciliation is itself the final authoritative dataset or a diagnostic that must be adjudicated against the full original official evidence.

## Required decision

Start with exactly `GO` or `REVISE`, then answer all items.

1. Choose exactly one integration policy and justify it from the attached contracts:
   - `FULL_OVERRIDE`: apply every reconciled non-Art row/Genre/Theme now; G1 remains REVISE until evidence is added or works are replaced.
   - `SPARSE_RETAIN`: apply only the 11 retained known rows and retained tags while keeping all other current values.
   - `FULL_EVIDENCE_ADJUDICATION`: treat the blind result as a diagnostic; independently re-adjudicate every sampled non-Art field and tag against the full official entry-scope evidence, then create one complete final 9-work dataset. Any unresolved field remains unknown and may force remediation/replacement.
2. Decide whether the separately audited 200-row Art result must remain authoritative instead of the blind Art unknowns.
3. State whether the present 23 coverage failures make G1 REVISE and forbid publishing/approving a final candidate.
4. Specify the smallest exact durable artifact and builder rule needed. Prefer existing schemas and helpers; do not add a general framework.
5. If any existing candidate value/tag may be retained, require an exact evidence-based disposition rather than silent sparse fallback.
6. State the decisive next step and whether the cohort/blind sample must be rerun before that step.

This decision must preserve the frozen cohort, unknown semantics, coverage thresholds, deterministic build, and the rule that G2/UI cannot begin before G1 passes.
