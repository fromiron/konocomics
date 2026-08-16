# Local G2 Cycle 2 recovered-vote execution and claim validity

## Verdict

- Recovered historical Local vote: **GO**
- Recovery and claim validity: **VALID**
- This record contributes no additional vote. It validates the already completed Local vote.
- Human validation: **not-run**
- Decision basis: **user-authorized-model-panel**
- Blocking findings: **none**

## Exact request and response recovery

- Original frozen request was recovered byte-for-byte from the completed builder-session output at `2026-08-13T13:42:24.193Z` and persisted as `original-frozen-request.md`.
- Request size: `3,658` bytes, `49` lines.
- Request SHA-256: `a64c1f1f04d876f8300d41eba3fb6fc12a6230e3c6afdff126d40383d099b6de`.
- Original Local response was recovered byte-for-byte from the completed Local session event at `2026-08-13T14:01:45.769Z` and persisted as `local-response.txt`.
- Response size: `1,888` bytes, `14` lines.
- Response SHA-256: `31fae7989961f17e8ca73a7c2bcbcb0aa4329d3dad35500a52d3365ae967648b`.
- The historical validity artifact had SHA-256 `3b61dcafeaab1ce13f9de5266139db439342e4e68c2c068be764b39b762e1530`; its archived session output records the original ZIP/extraction checks.
- The historical vote was produced independently before it was exposed to other route results. During this recovery, one broad session-log lookup displayed unrelated reviewer text; it was excluded from every evidence check and did not alter the already fixed response bytes or this validity conclusion.

## Transport boundary for this recovery

- Per the current user instruction, this recovery did **not** create, extract, test, or otherwise use a ZIP.
- Canonical uncompressed root: `/home/bell/.cache/konocomics/g2-cycle2-canonical.8Jfgba/konocomics-g2-product-direction-cycle-2`.
- Corresponding original Oracle ZIP binding, as stated by the exact request and recovered vote: `680836440acc3275c03f7fb3466d4ed917d05ebc2b3979edec957088d165be38`.
- The ZIP hash was not recomputed in this recovery. Current byte-level verification starts at the uncompressed payload ledger.

## Uncompressed payload integrity

- `manifests/PAYLOAD.sha256` SHA-256: `9d66dd76fbbc6e68cdb0abe80d4ada965de6fb97228e537def3ae7b59c8c6e8a`.
- All `184/184` declared payload hashes recomputed successfully.
- Actual regular files: `185` = `184` declared payload files plus the self-excluded ledger.
- Missing files: `0`; extra files: `0`; symlinks: `0`.
- Absolute ledger paths: `0`; `..` path components: `0`.
- Prior response/report/validity paths and the Cycle 1 pilot are absent from the payload.

## Artifact identity and complete source/patch binding

- Repository: `fromiron/konocomics`.
- Branch: `agent/promote-approved-catalog`.
- Final HEAD: `ce3bf4fca9dd5ba3f4bba371c9ae83407224ebc3`.
- Final tree: `d169a602b99599578aca8a1fd4ba0ffdcf0a371c`.
- Slice 4 base: `94d2ac803844ce39e884326d523afa9516f7d7ab`.
- Current checkout, upstream, and frozen identity all resolve to the exact final HEAD/tree; worktree was clean after replay.
- All `108` repository snapshot files were compared byte-for-byte with their exact `HEAD:path` Git objects; mismatches: `0`.
- `implementation/slice4.patch`: `33,135` lines, `929,275` bytes, SHA-256 `c2895ab91baa0b1c10222e6f98c19d512668c9e5332cb1a85344fc55dcce15bc`.
- Its `48` diff headers exactly match `implementation/changed-files.txt`, and the bytes exactly equal `git diff --full-index <base> <head> -- <48 paths>`.
- The patch has no product path under `src/app`, `src/features`, `src/infrastructure`, or `src/components`. The root production build exposes only `/` and `/_not-found`; Slice 5 is not present.
- Pilot code HEAD is `1de02b59f11999f49f646ce905fa4e330c9bceb2`. Its complete path delta to final HEAD exactly matches `identity.json`, and runtime-affecting paths after the pilot: `0`.

## Direction-preserving correction

- `src/domain/recommendation/adjustment.ts` maps Axis `less` to `axisPreferenceDirection: "lower"` and `like|veryLike` to `"higher"`, attaching direction only to nonzero known Axis adjustments.
- `src/domain/explanation/generate.ts` fails closed for Axis adjustments without direction and for direction on non-Axis adjustment or other contribution sources. Positive lower-Axis adjustments use only `positiveLowerAxisAdjustment`.
- `src/lib/strings.ts` defines `「{factorLabel}」が控えめな点が、あなたの好みに合う作品です。`.
- Structured explanation identity and recommendation sorting preserve the direction field deterministically.
- Included adjustment, explanation, runner, G2, result-boundary, report, golden, promotion, and Art-evidence tests were inspected. The focused regression asserts the exact lower sentence, exact direction provenance, fail-closed missing direction, and three pilot occurrences.

## Catalog and provenance readback

- Catalog version: `v1-83f85ca42c87`.
- Catalog: `150` unique works and `154` unique volumes/ISBNs.
- Axis rows: `2,550/2,550` unique Work × Axis pairs; `2,412` known and `138` unknown.
- Theme rows: `462/462` unique; aliases: `177/177` unique; recommendation-context rows: `150`.
- Roles: Anchor `30`, Bridge `30`, Discovery `90`; eligibility: onboarding+recommendation `40`, recommendation-only `110`.
- Evidence: `416/416` unique rows, all `reviewedByHuman=false`; every work, volume, factor, and Theme evidence reference resolves.
- Art manifest: `600/600` unique Work × Art-axis pairs, with state/value/confidence equal to final factors.
- Catalog SHA-256: `d3f9d97a5d659fd7a6972b833e0fd0092a09089acf103709fa0bdb9968b64fe8`.
- Recommendation-context SHA-256: `2e1faa38a07a1f4ffd0f465fcf597d682162eea9433b175fd8a1af84d7ce282e`.
- `data/generated` and `src/data/generated` copies are byte-identical.

## Browser source, captures, and screenshots

- The complete runner uses real browser `fill`, `setInputFiles`, radio `check`, button `click`, and Playwright download-event interactions. It does not inject wizard state or answers.
- The complete shared wizard source preserves input → before → after → complete, locks response cardinality, hides engine identity until debrief, serializes canonical JSON, and does not persist draft state.
- All six PNGs were opened directly at original `1440 × 1000` detail:
  1. `01-input.png`: anonymous local profile input and privacy boundary.
  2. `02-before-top.png`: two blinded native lists and pre questions.
  3. `03-before-complete.png`: completed pre responses and list tie selection.
  4. `04-after-top.png`: unchanged ranks/titles with explanations, still blinded.
  5. `05-after-complete.png`: completed post responses and visible restrained-comedy explanation.
  6. `06-complete.png`: post-submit A = Taste Engine, B = Baseline debrief and JSON download.
- Every stage recorded focused H1 identity. Before/after list and rank identity is exact.
- Browser evidence: `20` recommendation occurrences, `16` distinct pre-response works, `20` occurrence-specific post responses, external requests `0`, page errors `0`, request failures `0`.
- Before HTML SHA-256 `1474c38c24503932e9e7556f848abc3e17bc8f85a9aada2b92014ed040ebe46d`; before ARIA SHA-256 `3e342a666ed3b7c56b4563a8d23d659cb72301309d6d4a65ff48ba48c5784a0b`.
- After HTML SHA-256 `40b65a39f06797a51c47c612caa041dc2215ece117213d0df7fb9827cdd6793d`; after ARIA SHA-256 `d4d38840d22ec12d3160c3c3700076e71681cc0c1f3715b28f46bbe0515985dc`.
- Correct lower-comedy sentence counts: before HTML `0`, before ARIA `0`, after HTML `3`, after ARIA `3`.
- Old directionless sentence counts: `0` in all four captures.
- Both raw before and after captures contain `0` forbidden engine/score/context/role tokens from the runner's complete token list.

## Download, aggregate, and human boundary

- Unedited result: `9,022` bytes, canonical pretty JSON with exactly one final LF, SHA-256 `98429bdd94a864cc2e29a2edf48971ed0ab38983fa4f6b98c01d60d0806bddb8`.
- Respondent: exact `syntheticPilot:manual-round-trip`; participant/profile IDs match; slots contain `10` Taste and `10` Baseline occurrences; pre responses `16`; post responses `20`; holdout `fullmetal-alchemist`.
- Post-response slot/rank/work identity exactly equals the frozen list occurrences.
- `aggregate-1.md`, `aggregate-2.md`, and `evidence/validation/pilot-aggregate-recomputed.md` are byte-identical, SHA-256 `98db33b126521e3bce9f7ce58bed76f08e4175149ed0f147d06585061f6c3e60`.
- Fresh authoritative exact-HEAD replay using the canonical catalog, context, and result bytes produced the same aggregate SHA and byte equality. An initial invocation inherited an unsupported Windows temporary socket path and failed before product code; rerunning with the frozen validation environment `TEMP=/tmp TMP=/tmp TMPDIR=/tmp` exited successfully.
- Aggregate boundary: human `0`, synthetic pilot `1`, verdict `INCOMPLETE`, all five human criteria `NOT_RUN`, all human numerators/denominators `0/0`, all human rates `null`.
- Identity boundary: `humanValidation: "not-run"`, `decisionBasis: "user-authorized-model-panel"`, `humanMetrics: null`. No human-validation or statistical-superiority claim is made.

## Validation-log and fresh-check audit

- Frozen `validation-summary.json` SHA-256: `b651d3d2d42edb3cf829479da0adc9524b5298dc422d5e5fb4705c4b485c65c1`.
- All `18/18` declared validation-log hashes recomputed; mismatches: `0`; all recorded checks have exit `0`; overall `PASS`.
- Frozen test readback: `40` files, `355` tests passed. Catalog validate: `150` works, `154` volumes, `0` errors, `566` expected warnings = `416 EVIDENCE_NOT_HUMAN_REVIEWED` + `150 AUTHORIZED_MODEL_PANEL_REVIEW`.
- Fresh exact-HEAD checks during this recovery: typecheck `0`, lint `0`, full Vitest `40/40` files and `355/355` tests, catalog validation `0` with the same `566` warnings.

## Final claim assessment

The exact historical Local response is an unconditional `GO` bound to the exact original request, original ZIP identity, final HEAD, not-run human boundary, and user-authorized model-panel basis. The uncompressed canonical payload independently reproduces every material source, test, browser, download, aggregate, catalog, boundary, and identity claim made in that response. No blocker or conditional qualification was found.

This is one valid Local vote only. It cannot by itself open G2 or authorize Slice 5; the remaining route votes and the final recorded 4/4 decision remain separate.
