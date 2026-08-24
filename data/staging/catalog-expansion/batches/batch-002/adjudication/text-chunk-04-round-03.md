# Batch 002 text adjudication — chunk 04, round 03

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Date: 2026-08-23
- Scope: final finite text route for positions 31, 34, and 39
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`

## Frozen inputs

| Input                                                   | SHA-256                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `research/text-gap-chunk-04-round-02.md`                | `50cbce599600ec4272c36e9f2bbb5670ceb0baff8d46ee22778e39d97482aff7` |
| `reviews/text-gap-review-chunk-04-round-02.md`          | `dd001bd0c99ce4a10b0eda9f2b4bdf9e37c6349cd579d72bda3d9dd02e82d0b4` |
| `adjudication/text-final-chunk-04.csv` before this pass | `3fb67d62ae703f717f8a7fca65c220dd2214a9115305cff87bbd682304db9689` |
| `art-review/chunk-04/final-art.csv`                     | `ebae920c3e15c041d43ed8a1d7aaeae1578ffabf75103318ddf4309e64f61fdd` |

## Decision

`屍鬼 romance=2`, confidence `0.86`, is accepted. The official volume-1
internal viewer directly repeats 清水恵's one-sided attachment, idealization,
and approach within the entry episode. The official volume-2 description
continues the same attachment after her death as a motive and threat line, and
volume 3 retains the related incident. Death and investigation remain the main
plot reward, so this is a recurring subplot at anchor 2 rather than central
romance at anchor 4.

`comedy` and `emotionalWarmth` remain `unknown`. An isolated comic beat does
not establish frequency, and attachment or obsession is not warmth. No value
is inferred from the horror Genre.

Positions 31 and 34 receive no new text value. Their captured text material is
retained for audit, but both had already exhausted the eligible official Art
route with 0/4 known Art axes. Art unknown remains explicit and is not treated
as value zero.

## Terminal handoff

| Pos | Work             | Narrative known | Tone known | Text result | Combined result                                      |
| --: | ---------------- | --------------: | ---------: | ----------- | ---------------------------------------------------- |
|  31 | 軍靴のバルツァー |             4/6 |        4/7 | fail        | blocker candidate: Art 0/4 known and text below gate |
|  34 | ケロロ軍曹       |             4/6 |        4/7 | fail        | blocker candidate: Art 0/4 known and text below gate |
|  39 | 屍鬼             |             4/6 |        5/7 | pass        | promotion candidate                                  |

Positions 31 and 34 use `SOURCE_INFORMATION_UNAVAILABLE`; the reproducible
recheck path is an official entry-edition internal preview meeting six readable
pages and two scene contexts, followed by a fresh Local/Gemini pixel quorum,
plus direct entry-range evidence for one additional Tone axis. The current
blocker is not the semantic fact that an axis is unknown; it is the unchanged
Art and Tone coverage contract after both finite routes were exhausted.

## Outcome

| Outcome                              | Works |
| ------------------------------------ | ----: |
| Promotion candidates                 |     1 |
| Combined hard-blocker candidates     |     2 |
| Pending or adjudication remaining    |     0 |
| Human validation represented as done |     0 |

No canonical title contains decorative title delimiters.
