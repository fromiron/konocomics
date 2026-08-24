# Pilot 001 review ledger

- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Method: `promotion-evidence-v2`
- Review scope: entry volumes 1–3 or first major episode; Pass B is isolated from Pass A and Gold annotations.
- Human review: not run (`reviewedByHuman=false`). Model-panel review is not human validation.

## Art state closure

All 50 Pilot works have a terminal Art state in `art-final-matrix.csv`.

| Result                        | Works |                                          Axis states |
| ----------------------------- | ----: | ---------------------------------------------------: |
| Edition/sample gate qualified |    50 | 150 static known; 13 motion known; 37 motion unknown |
| Gate not qualified            |     0 |                                            0 pending |
| Total                         |    50 |                     163 known; 37 unknown; 0 pending |

Every Pilot work now has at least three known static Art axes and passes unchanged Art coverage. Later official-viewer salvage resolved the earlier edition, access, or sample gaps without weakening the six-page/two-context gate. `motionImpact` remains unknown where an exact bounded sequence was not available. Art unknown is not a low value and was not treated as a blocker.

Temporary page samples remain under ignored `output/playwright/**` or temporary directories and are not committed. The final manifest preserves official URL, edition, page reference, sample count, context, limitation, and review status; Local and Gemini records preserve sampled-file SHA-256 values.

Local evidence:

- `art-capability-preflight.md`
- `art-local-ecomi-audit.md`
- `art-local-other-audit.md`
- `art-local-chunk-04.md`
- `art-local-chunk-05.md`
- `art-local-remaining.md`
- `art-local-barairo-recheck.md`
- `art-local-hourou-salvage.md`
- `art-local-emma-salvage.md`
- `art-local-dr-coto-salvage.md`
- `art-local-mashiro-salvage.md`
- `art-local-barakamon-salvage.md`
- `art-local-hidamari-salvage.md`
- `art-salvage-four/local-codex-blind-freeze.md`
- `art-pass-c-adjudication.md`

## Gemini 3.7 Flash High Art quorum

All authorizing current-SHA runs resolved to `Gemini 3.7 Flash (High)` with exact model argument `gemini-3.7-flash-high`, effort `high`, direct local-PNG access, normal `SUCCESS`, complete input access, and no rate limit, timeout, or degraded output.

| Scope                               | Conversation IDs                                                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| e-comi Pass C                       | `2cce433f-1c85-4333-847f-5a290696b176`, `969f6000-b45d-4e23-abc0-69934d1bcf47`, `3554a684-067f-4c1a-933f-2fea4247865f`, `d9211ee7-893d-454b-9f52-0ef348f956c0`, `f687f513-8003-4367-a0fd-de5f73582452` |
| other-viewer Pass C                 | `b5d2af7c-68f2-4d63-bfcc-0f41881a2de7`, `79b1ac11-b557-4836-bce5-74388c06c859`                                                                                                                         |
| chunk 04                            | `fe9dd0e1-42dd-4649-a86c-8bf5a10d19a2`, `1d78391e-6a92-4ea4-b1e7-37630d015f7d`, `0f829e47-e5f0-4698-8df6-0faa3af0b409`, `889072ee-6d22-4b9a-92be-3601d3bbc07e`                                         |
| chunk 05                            | `e8c5229f-0460-4648-874b-a134b5223fe8`, `16f3f1d7-c0b4-4c5c-8c2c-18ed2a9eb504`, `039be9ed-61d4-49b6-b940-043a203e8876`                                                                                 |
| final direct recheck                | `58e9d827-2efd-4d02-be2a-ef220a055d61`                                                                                                                                                                 |
| `バラ色の明日` edition-gate recheck | `71474700-ea62-4434-a61a-48c18037f3ea`                                                                                                                                                                 |

Initial successful pixel runs `95fe95e1-0ad9-4347-8e96-4bb95de4c597`, `1fea6178-5b58-4349-bbfe-0a5ed41b7898`, `f9bc0fb9-b01e-498f-918c-a24272052782`, `46340b5d-c912-4eda-a4da-e6ef45778565`, `945f2ca1-5666-4154-840a-d67504a9051a`, and `3d91e371-aaeb-4c4c-99ad-1f7bf1049f08` are historical inputs only; their conclusions are authorizing only where a current-SHA Pass C response and adjudication adopted them.

The following sessions returned content but ended with a sandbox connection reset and are excluded: `307e1203-7550-48cb-9d46-637bd7159833`, `f41e73b6-23fe-42dd-87a1-66e40f3e0816`, `229bf6c1-d8fb-474d-a55c-19a59401b364`, and `8bc5bf6a-bbc1-4d5b-a866-1a35b26b7114`. They were not counted and were not silently replaced under the same identity.

## Art adjudication

Local–Gemini differences were re-anchored against the Factor Dictionary and exact pixels in `art-pass-c-adjudication.md`; no averaging or majority vote was used. Two late corrections are material:

- `妖しのセレス/motionImpact` is `unknown`: the sampled fall ends in psychological memory shards, not a verifiable physical endpoint.
- `これ描いて死ね/artRealism` is `1`: repeated simplified/chibi character treatment places it between strong deformation 0 and ordinary stylization 2 despite credible environments.

Final `motionImpact=known` is limited to 13 works with exact bounded sequences: `ゴルゴ13`, `ダイヤモンドの功罪`, `YAWARA！`, `モンキーターン`, `エマ`, `名探偵コナン`, `銀の匙 Silver Spoon`, `陽だまりの樹`, `恋は雨上がりのように`, `漂流教室`, `うる星やつら`, `風光る`, and `ばらかもん`.

## Cursor Grok 4.6 High non-fast

The Art preflight proved that `cursor-grok-4.6-high` did not receive actual pixels, so it records `ART_ABSTAIN` and is not part of Art quorum. The older text responses in `chunk-01-grok-response.txt`, `chunks-02-03-grok-response.txt`, and `chunks-04-05-grok-response.txt` are historical and do not authorize the current SHA. Current-SHA non-fast reviews completed for all five chunks in `grok-current-chunk-01-response.txt` through `grok-current-chunk-05-response.txt`. Each binds the frozen candidate SHA, records `fast=false`, completed after rejecting incomplete first responses where applicable, checks identity and safety, and abstains from Art. Their disagreements and initial coverage misses were resolved only through the narrow official follow-ups and independent Pass C records, not by majority vote.

## Muse Spark 1.2 xhigh

Not invoked for Pilot 001. Muse is optional, no quorum depends on it, and no substitute model is recorded in its place.

## Text Pass B/C closure

- All 50 works now pass Narrative `4/6` and Tone `5/7` coverage after official-first follow-ups A–G, targeted work follow-ups, and independent review.
- Final text axes: 650 rows, 474 known and 176 explicit unknown; no pending state.
- Final Theme set: 78 rows, with at least one canonical Theme for every work.
- Final promotion Evidence: 250 unique URL-backed rows, comprising 50 text and 200 Art records; all record `reviewedByHuman=false`.
- Hard blockers: 0. Unresolved adjudication: 0.

Values rejected during review remain `unknown`, not numeric midpoints. The final combined matrix contains 850 rows: 637 known and 213 unknown. All 50 works pass Genre, Theme, Narrative, Tone, and Art promotion coverage without changing the dictionary, coverage thresholds, recommendation math, or Gold 150.
