# Batch 002 text adjudication — chunk 01, round 03

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Date: 2026-08-23
- Scope: frozen positions 1, 2, 3, 4, 6, 7, and 8 after the final finite text search; position 5 retains its earlier text state and upstream Art closure.
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: no averaging or vote count; official range, exact edition mapping, independent scoped corroboration, and the Factor Dictionary determine each value.

## Frozen inputs

| Input                                          | SHA-256                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `research/text-gap-chunk-01-round-02.md`       | `baa1a95202c5b97442240f0fd818b96768250e634a8915abfb9f0a2c6a67f7ed` |
| `reviews/text-gap-review-chunk-01-round-02.md` | `6fb81035887c9d99d21f9bd1af542a646b3206051eab9989ce3eb1756eb9d33d` |
| `adjudication/text-final-chunk-01.csv` after C | `2d8a3e1f71300161c4e9c275a92a2eaf33496be89d609e365ab77097776149a6` |
| `adjudication/text-chunk-01-round-01.md`       | `4441b0502877f175ad5498d4b253675b23145fea7aadd7636ddae64f37240672` |
| `adjudication/text-chunk-01-round-02.md`       | `504e44329f1958ad484cddd1a518c42471bebcc062e82ff77fa63a31c0d40748` |

## Pass C decisions

The 13 independently accepted candidate claims are adopted without changing their values: サンダー３ `characterArcWeight=2`, `emotionalWarmth=1`; のたり松太郎 `romance=2`; デカワンコ `emotionalWarmth=2`; ファイアパンチ `mysteryReveal=2`; 邪眼は月輪に飛ぶ `problemSolving=3`, `mysteryReveal=2`, `characterArcWeight=2`, `emotionalWarmth=2`; 銀河鉄道999 `emotionalWarmth=2`; 吉祥天女 `characterArcWeight=2`, `relationshipStructure=2`, `emotionalWarmth=1`.

The values remain bounded to the official first 1–3 volumes or the complete single-volume entry. Multiple user-review families are supplemental only where the official range is fixed. No review sentence is copied into product copy, no Genre supplies an Axis, and no shortage supplies a value. Existing prior-round decisions remain materialized, including the six Narrative and five Tone values for 六三四の剣 and the four Narrative and five Tone values for 怪獣8号.

邪眼は月輪に飛ぶ closes Genre as `action;horror` because the complete official volume repeatedly centers pursuit, mass lethal threat, and the final confrontation. This Genre decision does not determine its `darkness`, `problemSolving`, or Art values. 吉祥天女 retains no final Genre because the scoped packet does not establish a recurring Genre contract beyond its setting-level `school:1` Theme.

## Terminal coverage

| Pos | Work             | Narrative | Tone | Combined terminal result                                      |
| --: | ---------------- | --------: | ---: | ------------------------------------------------------------- |
|   1 | サンダー３       |       3/6 |  4/7 | `SOURCE_INFORMATION_UNAVAILABLE` — N+1, T+1                   |
|   2 | のたり松太郎     |       6/6 |  5/7 | promotion candidate                                           |
|   3 | デカワンコ       |       4/6 |  5/7 | promotion candidate                                           |
|   4 | ファイアパンチ   |       4/6 |  5/7 | promotion candidate                                           |
|   5 | RED              |       2/6 |  4/7 | `SOURCE_INFORMATION_UNAVAILABLE` — text and Art coverage fail |
|   6 | 邪眼は月輪に飛ぶ |       4/6 |  5/7 | promotion candidate                                           |
|   7 | 銀河鉄道999      |       2/6 |  4/7 | `SOURCE_INFORMATION_UNAVAILABLE` — N+2, T+1                   |
|   8 | 吉祥天女         |       0/6 |  5/7 | `SOURCE_INFORMATION_UNAVAILABLE` — N+4 and no final Genre     |
|   9 | 六三四の剣       |       6/6 |  5/7 | promotion candidate                                           |
|  10 | 怪獣8号          |       4/6 |  5/7 | promotion candidate                                           |

The finite entry-range routes for positions 1, 7, and 8 are exhausted. Their missing values stay `unknown`. Position 5 also retains four explicit Art `unknown` states after the official product route yielded no eligible internal sample. Art `unknown` is not low and becomes part of a blocker only because the unchanged Art coverage gate fails.

## Outcome

| Outcome                              | Works |
| ------------------------------------ | ----: |
| Promotion candidates                 |     6 |
| Hard-blocker candidates              |     4 |
| Pending or adjudication remaining    |     0 |
| Human validation represented as done |     0 |

No canonical title contains decorative `『』` delimiters.
