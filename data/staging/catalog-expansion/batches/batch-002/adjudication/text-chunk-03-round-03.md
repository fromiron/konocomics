# Batch 002 text adjudication — chunk 03, round 03

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Date: 2026-08-23
- Scope: frozen positions 21, 22, 23, 24, 25, 27, and 30 after the final finite text search
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: no averaging or vote count; official scope, edition mapping, independent scoped corroboration, and the Factor Dictionary determine each value.

## Frozen inputs

| Input                                                   | SHA-256                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `research/text-gap-chunk-03-round-02.md`                | `2d8236f39f0bcbe75b87a4092273fc2b28d6b01540db4845c9abff587d9c5d78` |
| `reviews/text-gap-review-chunk-03-round-02.md`          | `d06c3f500a83697fd4ad7da19691ae15cc67476c5c56a0621c980962fa0c3a9a` |
| `adjudication/text-final-chunk-03.csv` before this pass | `b224257c6460525d36847279bed65db452fe33973d322776785b2f8545ddd281` |
| `art-review/chunk-03/final-art.csv`                     | `9b1f2084a52526fd8a63a5511f0e97a89343fb1d7052a09e2694eb5200845add` |

## Pass C decisions

All 20 `ACCEPT` decisions and both reviewer revisions are adopted. The two
revisions are `機動警察パトレイバー relationshipStructure=2` and
`風と木の詩 relationshipStructure=2`; an entry-range core relationship is
supported, while a complex ensemble reward is not. Exact confidence values in
the final matrix express claim-level evidence strength, not a probability that
the series has the trait.

The newly materialized terminal claims are:

- `機動警察パトレイバー`: progression 3, problemSolving 2, pacing 3,
  worldBuilding 4, characterArcWeight 3, relationshipStructure 2, comedy 2,
  mentalStress 1, emotionalWarmth 2.
- `あさひなぐ`: problemSolving 0.
- `高台家の人々`: mysteryReveal 2.
- `怪物事変`: problemSolving 2.
- `SAKAMOTO DAYS`: problemSolving 3.
- `風と木の詩`: problemSolving 0, pacing 2, mysteryReveal 2, worldBuilding 3,
  characterArcWeight 4, relationshipStructure 2, darkness 4, mentalStress 4,
  romance 4.
- `聖☆おにいさん`: no new known Axis. Its unresolved Narrative axes remain
  `unknown`; episodic comedy and source silence do not establish zero.

Known zero is used only where exact entry observations positively show the
repeated response mode. Genre labels do not supply either zero. No Art value,
identity, safety result, or source eligibility is changed here.

## Terminal coverage and handoff

| Pos | Work                 | Narrative known | Tone known | Text result | Combined result                                |
| --: | -------------------- | --------------: | ---------: | ----------- | ---------------------------------------------- |
|  21 | 機動警察パトレイバー |             4/6 |        5/7 | pass        | blocker candidate: Art 0/4, Genre 0, Theme 0   |
|  22 | あさひなぐ           |             4/6 |        5/7 | pass        | promotion candidate                            |
|  23 | 高台家の人々         |             3/6 |        6/7 | fail        | blocker candidate: finite text route exhausted |
|  24 | 怪物事変             |             4/6 |        5/7 | pass        | promotion candidate                            |
|  25 | SAKAMOTO DAYS        |             4/6 |        5/7 | pass        | promotion candidate                            |
|  27 | 聖☆おにいさん        |             3/6 |        5/7 | fail        | blocker candidate: Narrative 3/6 and Theme 0   |
|  30 | 風と木の詩           |             4/6 |        5/7 | pass        | blocker candidate: Art 0/4, Genre 0, Theme 0   |

Art `unknown` is not a low value and is not itself a blocker. Positions 21 and
30 become blocker candidates because their explicit Art known coverage is 0,
below the unchanged 0.30 promotion gate after the eligible official-preview
route was exhausted; both also lack a directly supported final Genre and Theme.
Position 23 fails terminal Narrative coverage. Position 27 fails both terminal
Narrative coverage and the Theme gate after the finite official-first route was
exhausted.

All four use `SOURCE_INFORMATION_UNAVAILABLE`. Their blocker ledger rows must
preserve the exact combined evidence packet and every failed-gate recheck path:
mapped official internal pages satisfying the Art sample contract plus direct
Genre and Theme evidence for positions 21 and 30; exact entry-range material
establishing one remaining Narrative Axis for position 23; and one remaining
Narrative Axis plus a central Theme for position 27.

## Outcome

| Outcome                              | Works |
| ------------------------------------ | ----: |
| Promotion candidates                 |     3 |
| Combined hard-blocker candidates     |     4 |
| Pending or adjudication remaining    |     0 |
| Human validation represented as done |     0 |

No canonical title contains decorative title delimiters.
