# Batch 004 final overlay — independent terminal QA

## Verdict and attestation

- QA date: `2026-08-25`
- Reviewer: Daybreak independent terminal QA
- Repository HEAD observed: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- `reviewedByHuman=false`; this is model-panel QA, not human validation.
- Verdict: **FAIL**
- Promotion authorization: **NO**
- Scope boundary: this QA changed only this report. It did not edit an overlay, terminal matrix, research packet, source row, registry, generated catalog, script, or promotion state.

The deterministic overlay is structurally self-consistent, but 46 of its 47 blocked works lack the required terminal hard-blocker adjudication. Coverage failure was mechanically converted into `SOURCE_INFORMATION_UNAVAILABLE` despite the bound independent terminal review explicitly classifying those works as evidence/research gaps rather than established hard blockers. Position 42 is the sole blocked work whose final blocker codes are independently established by a later bounded adjudication.

## Frozen identity and binding checks

| Check | Result |
| --- | --- |
| Frozen work set | **PASS** — 50 rows, 50 unique Work IDs, positions 1–50 in exact order |
| Frozen work-set SHA-256 | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| Exact batch request SHA-256 | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` |
| Bound inputs | **PASS** — 142/142 declared files recomputed to the hashes in `final-overlay-validation.json` |
| Binding categories | frozen 1; request 1; research 11; annotation 20; reviews 35; adjudication 15; Art preflight 10; Art review 45; context research 4 |
| Combined input/review SHA-256 | **PASS** — `722ddd6f022de7b9a2ca94cdc5013955c97439da6a81a82f1171775ece64fa41` |
| Validation-file SHA-256 | `ff5674ca660c9d4a0416a9e6844fb4d3bd506ddb9d3313a0926d06cfa3f6dbff` |
| Position-42 round-2 research SHA-256 | `9133ab09911347e874e15d76b10908ee6d9c2b9a18b09e267907b0465a7abda4` |
| Position-42 final adjudication SHA-256 | `8bb960c54e8c2d574290242870df9a21a21246c683d9c200c92f8ed10a4a5a39` |
| Canonical title delimiters | **PASS** — no frozen/source/registry/research/overlay title contains decorative `『` or `』` |

All eight output hashes recompute exactly to the validation ledger:

| Output | SHA-256 |
| --- | --- |
| `promotion-decisions.csv` | `f2abb52fca767c3d875defcaac492e1ba870e624cc54c5e71575f8b2cfacd1cc` |
| `works-final.csv` | `4fc36319f1e3bc6494da164539563e94ff083a7c89d5c2f6cf604dbc0c2b63a6` |
| `factors-final.csv` | `5928474052ed12b6581c114212b6ed2c405192baf68cfad51e69e092ba7cf69c` |
| `themes-final.csv` | `180eeb6f41f02613b72cd7659b862cba3fbe918d13ba98c020977d61c226d0af` |
| `evidence-final.csv` | `1164ca3b7ce6e9d8a1f08e145e93bd29f381825ff01073f59318c93d86944471` |
| `art-evidence-manifest-final.csv` | `26bae895880db763f6c080cf39359560548ebef478070ae23d14149bd4a8368e` |
| `recommendation-context-final.csv` | `1670eadefea5287edc95d70133332f71e2a17555962f1a18c99d400bdefd9938` |
| `promotion-blockers-final.csv` | `c23f9e4a82e6038ad8bfa0ea358cffe683b103852136123fd50dadab69851ab1` |

## Structural outcome and gate math

- `promotion-decisions.csv`: 50 exact frozen identities and titles in frozen order.
- Structurally emitted outcomes: positions `14`, `17`, and `20` are `recommendationVerified`; 47 other positions are `promotionBlocked`.
- Blocker output: 48 rows, 47 unique blocked Work IDs, in exact blocked-work order.
- Position 42 is `work-d63a83030a8819ff553c` / モテキ and correctly has two rows in the required order:
  1. `FACTOR_MODEL_INCOMPATIBLE`
  2. `SOURCE_INFORMATION_UNAVAILABLE`
- Its decision code is exactly `FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE`; the two exact details and recheck paths match `daybreak-blocker-adjudication-position-42-final.md`.
- Recomputed terminal Genre, Theme, Narrative, Tone, and Art counts match all 50 decision rows with zero mismatches. Applying the unchanged gates independently reproduces only positions 14/17/20 as coverage-complete.
- Position 42 recomputes to Genre `1`, Theme `0`, Narrative `1/6`, Tone `5/7`, Art `3/4`, exactly matching the final compound adjudication.

Verified-only overlay cardinalities are internally exact:

| Artifact | Rows |
| --- | ---: |
| works | 3 |
| factors | 51 (`17 × 3`) |
| themes | 4 |
| evidence | 15 (`5 × 3`) |
| Art manifest | 12 (`4 × 3`) |
| recommendation context | 3 |

Known/unknown accounting also matches the validation ledger: text `28/11`, Art `9/3`. All three verified works have at least one Genre and Theme and satisfy Narrative `>=0.60`, Tone `>=0.60`, and Art `>=0.30` without changing an `unknown` to a numeric value.

## Provenance, Art, and model-panel checks

- Every emitted blocker row has a named source, parseable URL, publication date/year, retrieval date `2026-08-25`, non-empty detail, and non-empty recheck path. This is a syntactic provenance pass; it does not cure the semantic blocker defect below.
- Every emitted Evidence row and the validation file preserve `reviewedByHuman=false`; `humanValidation=NOT_RUN` is unchanged.
- The five Cursor Grok ledgers record requested `cursor-grok-4.6-high`, resolved Cursor Grok 4.6 High, non-fast read-only mode, success, exit code 0, `ART_ABSTAIN`, Muse `NOT_USED`, and `reviewedByHuman=false`.
- Each Art chunk binds Local Codex and an authorizing exact `gemini-3.7-flash-high` run with original-pixel/hash access and successful completion. Failed or provider-blocked attempts are explicitly excluded. Grok did not participate in Art; Muse was not silently substituted.
- The three promoted Art samples each retain at least six readable official internal pages, at least two genuine scene contexts, exact page references, edition mapping, URL, observations, limitations, and six unique SHA-256 values. Their nine static cells are known; all three `motionImpact` cells remain `unknown` because no exact continuous start-development-impact-resolved sequence was established.
- No generated overlay CSV contains `/tmp/`, `temporaryImageRoot`, or `output/playwright` paths. Temporary images are not catalog assets.

## Blocking defect — 46 hard blockers were not adjudicated

The overlay assigns `SOURCE_INFORMATION_UNAVAILABLE` to all coverage-deficient works unless a code override exists (`scripts/catalog/promotion-overlay.ts:680-733`). The default detail also asserts `Finite official-first routes exhausted` solely from numeric/Theme coverage deficiency. That mapping is not supported by the bound terminal adjudication for positions `1–13`, `15–16`, `18–19`, `21–41`, and `43–50` except position 42 — 46 works total.

The conflicting bound evidence is explicit:

1. `daybreak-text-adjudication.md:23-24` says a `TEXT_GATE_FAIL` is not a schema hard blocker unless a permitted blocker candidate is explicitly named.
2. `daybreak-text-adjudication.md:137-141` records only three text-gate passes, withdraws the position-10 source blocker, and states that no other permitted hard blocker was established; the remaining results are evidence-coverage failures.
3. `daybreak-text-recovery-qa-chunks-01-03.md:133-135` specifically classifies position 10 as an evidence-gap case and positions 8, 26, and 29 as narrow research/adjudication gaps whose official sources exist, not hard blockers.
4. Position 42 is different: the later exact volume-1–3 recovery and `daybreak-blocker-adjudication-position-42-final.md:13-24,52-84` independently establish the two specific blocker codes, details, recheck paths, and required compound representation. The overlay implements that disposition correctly.

Therefore the 47/48 blocked cardinality is structurally reproduced but is not truthfully authorized. A coverage failure may trigger more bounded research or a blocker **candidate**; it cannot by itself prove `SOURCE_INFORMATION_UNAVAILABLE`. Applying the current overlay would turn explicitly non-blocker/pending research dispositions into terminal hard blockers, contrary to the promotion method's evidence-first rule.

## Required remediation before promotion

1. Do not apply or commit this Batch 004 promotion overlay.
2. Preserve the terminal vectors and the verified outcomes at positions 14/17/20; no value or threshold change is justified.
3. Preserve the independently adjudicated compound position-42 blocker rows.
4. For the other 46 positions, continue the recorded narrow recovery/re-adjudication path. A terminal independent adjudication must either establish a permitted work-specific hard blocker with exhausted routes and a truthful recheck path, or retain the work in the active pipeline until that determination is possible.
5. Regenerate the overlay and rerun this terminal QA after those dispositions are bound. The deterministic checks listed below must remain green.

## Read-only checks executed

```text
pnpm catalog:promotion:batch-004-overlay --check
  PASS — verified 3; blocked 47

pnpm typecheck
  PASS

git diff --check
  PASS

independent CSV/hash parser
  PASS — identities, order, output hashes, 142 input hashes, combined binding,
         terminal gate math, verified-only cardinality, Art sample gates,
         reviewedByHuman=false, and temporary-path exclusion
```

Final authorization remains **NO** until the 46 unestablished blocker dispositions are independently resolved and rebound.
