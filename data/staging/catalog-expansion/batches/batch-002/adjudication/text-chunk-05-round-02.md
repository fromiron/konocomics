# Batch 002 text adjudication — chunk 05, round 02

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 41–50, first 1–3 volumes or complete two-volume scope
- Date: 2026-08-23
- Coverage gate: Narrative known `>=4/6`; Tone known `>=5/7`
- Decision rule: no averaging or vote count. Claims are resolved from the Factor Dictionary, direct source scope, edition mapping, and independent review.

## Bound inputs

| Input                                          | SHA-256                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `research/text-gap-chunk-05-round-02.md`       | `2adfb967e2e794395dc790a46c73fb9d049f421139aee51924a50bb5ad05090d` |
| `reviews/text-gap-review-chunk-05-round-02.md` | `a20f68f26151f65ab68bec52eb2ad4f18245f120045e5ec839950a6231b435a5` |
| `adjudication/text-final-chunk-05.csv`         | `ceb3cdbfdda037425138c7dc5af9b2d66657c6e75b07a8ce984384fa6de6a200` |
| `adjudication/genres-final-chunk-05.csv`       | `d1b5fde7f897b6d816bc1a98244168f72b02f9de5ca256bf630d6c37190bc292` |
| `adjudication/themes-final-chunk-05.csv`       | `f5445d69013ddd74011d19786b77b92efdd3c89b4cd397eb98d9154068ecbf32` |

## Pass C decisions

1. タコピーの原罪 `emotionalWarmth=1` at confidence `0.86` is accepted. Official complete-scope material and independent secondary families agree on a limited relational opening while severe pressure remains dominant. Narrative is `4/6`; Tone is `5/7`.
2. 闇のパープル・アイ `progression=1` is rejected to `unknown`. Awakening and plot escalation do not establish repeated growth, acquisition, or mastery as a reward structure. Narrative remains `3/6`; Tone is `5/7`.
3. YAIBA `mysteryReveal=1` at confidence `0.80` is accepted. Volumes 2–3 contain one bounded sword-related recontextualization, below the repeated reveal anchor. Narrative is `4/6`; Tone is `5/7`.

## Terminal outcomes

| Position | Work                   | Text gate | Batch outcome dependency                                                                 |
| -------: | ---------------------- | --------- | ---------------------------------------------------------------------------------------- |
|       41 | サンキューピッチ       | PASS      | promotion candidate                                                                      |
|       42 | うさぎドロップ         | PASS      | promotion candidate                                                                      |
|       43 | 水は海に向かって流れる | PASS      | promotion candidate                                                                      |
|       44 | 凪のお暇               | PASS      | promotion candidate                                                                      |
|       45 | 逃げ上手の若君         | PASS      | promotion candidate                                                                      |
|       46 | タコピーの原罪         | PASS      | promotion candidate                                                                      |
|       47 | 闇のパープル・アイ     | FAIL      | `SOURCE_INFORMATION_UNAVAILABLE`; finite eligible text route exhausted                   |
|       48 | YAIBA                  | PASS      | promotion candidate                                                                      |
|       49 | 夢の碑                 | PASS      | Art coverage separately fails after the eligible official-preview route was exhausted    |
|       50 | おそ松くん             | FAIL      | text, Art, and Theme gates fail after the eligible edition-specific routes are exhausted |

Final chunk-05 text count is 8 PASS and 2 FAIL. The two text failures remain explicit `unknown` states; no replacement value is fabricated. Art is adjudicated in its separate Local Codex plus Gemini quorum and is not inferred here. Muse is `NOT_USED`; this panel is not human validation.
