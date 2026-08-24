# Batch 002 text adjudication — chunk 02, round 03

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Date: 2026-08-23
- Scope: frozen positions 11, 12, 15, 16, 17, 18, 19, and 20 after the final finite text search, plus the independent Theme gap review for positions 19–20.
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`; at least one directly supported Theme.
- Rule: no averaging or vote count; official range, exact edition mapping, independent scoped corroboration, and the Factor Dictionary determine each value.

## Frozen inputs

| Input                                            | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `research/text-gap-chunk-02-round-02.md`         | `5e3ab431af2f51907f9f50739f77f6644a0548d53b7749588fe3a3ee3e85698f` |
| `reviews/text-gap-review-chunk-02-round-02.md`   | `9c8ddb93a389d304f8f86ba6f9d28106fd93888ea73e2ca6d8eb2a00fa41af10` |
| `reviews/theme-gap-review-chunk-02-round-02.md`  | `b4daf23664d7a5435d73c4ffca30736fd292326913bdc7d070ad53030ec98977` |
| `adjudication/text-final-chunk-02.csv` after C   | `4ffa62ccf0b01e01d2b2e78d95da7a52ac7d00c5ee936a0fb4842fffce5b5fd5` |
| `adjudication/genres-final-chunk-02.csv` after C | `ec67b6066b0f820e59d30e404707a14cea4c9c1cc8af4bd6073b6e04e1aa5eea` |
| `adjudication/themes-final-chunk-02.csv` after C | `c7937dda485566fd9a69fb0e246a373227a9ec9e70ba5837fcd9e09d787abe88` |

## Pass C decisions

All final Pass B text decisions are adopted. 赤髪の白雪姫 uses the reviewer revision `problemSolving=2` at confidence `0.80`, not the Pass A value 3: one scoped medical case is analytical but does not establish problem solving as the entry range's dominant reward. The other accepted additions retain their reviewed values, including explicit known-zero claims only where the entry packet positively establishes direct force, immediate emotional response, or active absence rather than mere source silence.

The Theme review is resolved separately from text coverage:

- 人形芝居 remains with no Theme. The official first three volumes repeatedly cover human-and-doll attachment, loneliness, separation, and forms of love, but none maps responsibly to the current Theme Dictionary without stretching `foundFamily` beyond the evidenced relationship forms. No Theme is invented to pass the gate.
- 魔法使いの嫁 adds `workplace:1` at confidence `0.74`. The official unchanged-content volume 1–3 bridge repeatedly establishes an apprentice role, assigned church tasks, professional magical roles, and task performance. The work is not reduced to a workplace story, so centrality remains 1.

正反対な君と僕 adds Genre `comedy` from all three official romantic-comedy descriptions without creating a numeric `comedy` Axis. 魔法使いの嫁 adds Genre `romance` from recurring official bride, marriage, and learning-love framing. Previous removals remain closed: 外天楼 is `mystery`, 忍者と極道 does not add `war`, 嘘解きレトリック does not add `workplace`, and 人形芝居 does not add `crafting`.

## Terminal coverage

| Pos | Work             | Narrative | Tone | Theme | Combined terminal result                            |
| --: | ---------------- | --------: | ---: | ----: | --------------------------------------------------- |
|  11 | 外天楼           |       4/6 |  3/7 |     1 | `SOURCE_INFORMATION_UNAVAILABLE` — T+2              |
|  12 | 忍者と極道       |       4/6 |  5/7 |     2 | promotion candidate                                 |
|  13 | 嘘解きレトリック |       4/6 |  5/7 |     1 | promotion candidate                                 |
|  14 | orange           |       0/6 |  0/7 |     0 | `SOURCE_INFORMATION_UNAVAILABLE` — edition/Art/text |
|  15 | 正反対な君と僕   |       5/6 |  5/7 |     1 | promotion candidate                                 |
|  16 | 墨攻             |       5/6 |  4/7 |     3 | `SOURCE_INFORMATION_UNAVAILABLE` — T+1              |
|  17 | がんばれ元気     |       4/6 |  5/7 |     2 | promotion candidate                                 |
|  18 | 赤髪の白雪姫     |       4/6 |  6/7 |     2 | promotion candidate                                 |
|  19 | 人形芝居         |       4/6 |  5/7 |     0 | `SOURCE_INFORMATION_UNAVAILABLE` — Theme gate       |
|  20 | 魔法使いの嫁     |       4/6 |  6/7 |     1 | promotion candidate                                 |

The finite routes for positions 11, 16, and 19 are exhausted. Their unsupported states remain `unknown` or empty. Position 14 also retains explicit four-axis Art `unknown` because the accessible official preview edition is not bridged to the frozen representative edition. That state is not low; the unchanged Art coverage gate is what blocks promotion.

## Outcome

| Outcome                              | Works |
| ------------------------------------ | ----: |
| Promotion candidates                 |     6 |
| Hard-blocker candidates              |     4 |
| Pending or adjudication remaining    |     0 |
| Human validation represented as done |     0 |

No canonical title contains decorative `『』` delimiters.
