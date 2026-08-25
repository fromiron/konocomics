# Batch 005 text recovery round 3 — chunk 02 independent QA and adjudication

## Scope and binding

- reviewer: Daybreak independent QA/adjudicator
- reviewDate: `2026-08-25`
- reviewedByHuman: `false`
- frozen scope: positions `11–20`, exact `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- round-3 recovery input SHA-256: `91f0ab5a96c2ad62a62d72f90a8333be0888332ca634d38e98a657a9dcd34198`
- prior terminal text SHA-256: `18bed6d698d409dedcb041c00e8d07cd5b2b2ed417f3bfc4f6e226e48e95d5b7`
- prior round-2 QA SHA-256: `be50998324fc4414ad0ba6d5fe0801e81b3d32ef29243a4ea4fe4ba2fd0ee60e`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation guide SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`

`PAYLOAD.sha256` passed for every frozen packet file. Existing known cells were not reopened. The five proposed residual-unknown cells were checked independently against the exact source identity, stated publication date or year, `2026-08-25` retrieval date, entry-range fit, and the Dictionary's observable 0/2/4 anchors. Genre and Theme terminal files were read but not changed.

## Material source audit

| Pos | Reproduced source identity | Published | Bounded use |
| --: | --- | --- | --- |
| 11 | 小学館eコミックストア `ヨルムンガンド 3`; マンガ大賞2010 comment collection | publisher page not stated; `2010` | volume 3 supplies the entry-range past/revenge disclosure; selector prose is supplemental only |
| 12 | 一迅社WEB `ボクラノキセキ (2)` | `2010-01-25` | volume 2 supplies successive memory recovery, not a progression loop |
| 13 | Renta! `おまかせ精霊` volumes 2–3; Manga Taisho 2008/2009 comment collections and 2009 archive | Renta page not stated; `2008`; `2009` | licensed volume copy is bounded to 2–3; the 2009 selector comment covers all four volumes and cannot anchor an entry-only value |
| 16 | 講談社 `銀のスプーン` volumes 1–3; BookLive volume-1 review route | `2011-02-10`; `2011-06-13`; `2011-12-13`; BookLive page not stated | publisher copy and clearly volume-1 reviews only |
| 19 | 講談社 `カレチ（3）`; ITmedia interview page 4; BookLive `カレチ（1）` | `2012-02-23`; `2017-10-13`; BookLive page not stated | volume-3 recurring incident list, author-described episode engine, and volume-1 identity/format corroboration |

All routes above were retrieved `2026-08-25`. Unbounded later-series observations were excluded from numeric decisions.

### Corrected BookLive identity

- [`title_id=243606/vol_no/001`](https://booklive.jp/review/list/title_id/243606/vol_no/001) identifies `銀のスプーン（1）`, 小沢真理, 講談社 and lists the volume-1 recipes. It is the valid position-16 review route.
- [`title_id=217009/vol_no/001`](https://booklive.jp/review/list/title_id/217009/vol_no/001) identifies `カレチ（1）`, 池田邦彦. It is a valid position-19 route and remains invalid for position 16.
- The corrected identity removes the round-2 mismatch, but identity correction alone does not prove a numeric `problemSolving` value.

### おまかせ精霊 Manga Taisho status and comment correction

- The [official 2009 archive](https://www.mangataisho.com/archives/2009.html) places `おまかせ精霊` under `マンガ大賞2009一次選考作品リスト`; it is not listed among the nominees.
- The [2008 comment collection](https://www.mangataisho.com/data/2008/comment.pdf), published `2008`, contains one selector comment about attractive characters, loose development, and hints for living easily. It does **not** contain the claimed “became a growth story” observation for this work.
- The [2009 comment collection](https://www.mangataisho.com/data/2009/comment090324.pdf), published `2009`, contains one selector's statement that the work became a solid growth story and explicitly evaluates all four volumes. It is one whole-series selector observation, not a second independent entry-range reading sample and not an award-institution Factor finding.
- Therefore the round-3 statement that both 2008 and 2009 records describe growth is not reproducible. The licensed volume-2/3 descriptions establish member acquisition and club goals, but not recurring motivation or character change at the `characterArcWeight=2` anchor.

## Cell decisions

| Pos | Work | Proposed cell | QA | Exact rationale |
| --: | --- | --- | --- | --- |
| 11 | ヨルムンガンド | `mysteryReveal=2` | `ACCEPT` | The official volume-3 page directly reveals the earlier landmine incident and its connection to Yona's revenge within the entry boundary. The 2010 selector comment only supplements this by describing gradual disclosure of character pasts/background. This establishes “some secret/past disclosure” at 2, not clue-solving or truth disclosure as the dominant reward at 4. |
| 12 | ボクラノキセキ | `progression=2` | `REJECT` | The official volume-2 description says classmates successively recover past-life memories, but that observation is knowledge/revelation already represented by `mysteryReveal=3`. It does not independently establish growth, acquisition, or mastery as a progression reward loop. |
| 13 | おまかせ精霊 | `characterArcWeight=2` | `REJECT` | The claimed 2008 growth comment is absent, the 2009 comment covers all four volumes and is one selector opinion, and the bounded volume-2/3 copy describes group expansion/goals rather than recurring character motivation or change. Existing `progression=2` and `relationshipStructure=2` already represent the direct bounded observations. |
| 16 | 銀のスプーン | `problemSolving=1` | `UNKNOWN` | The corrected route independently confirms repeated recipes and practical cooking under a family constraint. It still does not expose recurring constraint analysis, judgment, or a solution process distinct from carrying out recipes. Value 1 cannot be used merely because activity lies between the 0 and 2 wording. |
| 19 | カレチ | `problemSolving=2` | `ACCEPT` | The official volume-3 contents establish recurring service incidents. In the author interview published `2017-10-13`, Ikeda states that a person has trouble onboard and how it is resolved is the manga's basic construction, including imperfect resolutions and a concrete connection dilemma. This directly matches mixed judgment and action at 2, not ingenious constraint analysis as the core at 4. |

Positions 14, 15, 17, 18, and 20 proposed no new cell. Their terminal values remain unchanged. All unaccepted proposals remain `unknown`, never zero or a synthetic midpoint.

## Materialized cell delta

Only the two `ACCEPT` rows were overlaid. Row order and evidence IDs are unchanged.

| Work | Axis | Old terminal row | New terminal row |
| --- | --- | --- | --- |
| `work-151b456508f78852b002` | `mysteryReveal` | `work-151b456508f78852b002,mysteryReveal,unknown,,,ev-batch-005-a-work-151b456508f78852b002` | `work-151b456508f78852b002,mysteryReveal,known,2,0.68,ev-batch-005-a-work-151b456508f78852b002` |
| `work-1d5a3158e78e639f1973` | `problemSolving` | `work-1d5a3158e78e639f1973,problemSolving,unknown,,,ev-batch-005-a-work-1d5a3158e78e639f1973` | `work-1d5a3158e78e639f1973,problemSolving,known,2,0.70,ev-batch-005-a-work-1d5a3158e78e639f1973` |

## Hash and reverse-substitution audit

| File | Old SHA-256 | New SHA-256 | Change |
| --- | --- | --- | --- |
| `adjudication/text-final-chunk-02.csv` | `18bed6d698d409dedcb041c00e8d07cd5b2b2ed417f3bfc4f6e226e48e95d5b7` | `d43545494520719d5f6b7042f89ea8ff05298ba6adc509a83539362c162baad3` | exactly two unknown rows became known |
| `adjudication/genres-final-chunk-02.csv` | `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de` | `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de` | byte-identical |
| `adjudication/themes-final-chunk-02.csv` | `671539087a1958781e9d11a9e9bc67e057f009846f0ba5e6f2203a18d1ad7cf9` | `671539087a1958781e9d11a9e9bc67e057f009846f0ba5e6f2203a18d1ad7cf9` | byte-identical |

Reverse-substituting only the two accepted rows in the new text CSV produced SHA-256 `18bed6d698d409dedcb041c00e8d07cd5b2b2ed417f3bfc4f6e226e48e95d5b7`, exactly matching the prior terminal file. A direct unified diff also contained only those two rows.

## Gate recount

| Pos | Canonical title | Narrative | Tone | Genre | Theme | Art | Remaining text gap |
| --: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 11 | ヨルムンガンド | 3/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+1, T+2 |
| 12 | ボクラノキセキ | 2/6 | 4/7 | 1/1 | 1/1 | 0/4 | N+2, T+1 |
| 13 | おまかせ精霊 | 2/6 | 1/7 | 1/1 | 1/1 | 0/4 | N+2, T+4 |
| 14 | ニラメッコ | 0/6 | 4/7 | 1/1 | 1/1 | 0/4 | N+4, T+1 |
| 15 | 恋愛ラボ | 0/6 | 5/7 | 1/1 | 1/1 | 0/4 | N+4 |
| 16 | 銀のスプーン | 3/6 | 5/7 | 1/1 | 1/1 | 0/4 | N+1 |
| 17 | おかめ日和 | 1/6 | 5/7 | 1/1 | 0/1 | 0/4 | Theme+1, N+3 |
| 18 | 新黒沢 最強伝説 | 1/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+3, T+2 |
| 19 | カレチ | 4/6 | 2/7 | 1/1 | 1/1 | 0/4 | T+3 |
| 20 | GREEN WORLDZ | 2/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+2, T+2 |

Chunk-02 gate totals after round 3: Genre `10/10`, Theme `9/10`, Narrative `1/10`, Tone `3/10`, Art `0/10`, and all non-Art text gates `0/10`. Position 19 now passes the Narrative gate but remains `TEXT_GATE_FAIL` because Tone is `2/7`. No work was promoted.

## Recheck path and boundary

- Reopen a rejected or unknown cell only with a new official/rightsholder entry-range source or at least two independent range-matched observations that directly describe the missing Dictionary construct; a title, occupation, recipe list, award-list membership, or whole-series selector impression is insufficient.
- All 40 Art rows remain `unknown`; no Art inference or model panel was run.
- No Genre, Theme, Pass A, source, provenance, packet, overlay, registry, generated artifact, eligibility, safety, identity, recommendation formula, or Gold data was changed.
- No promotion, commit, deployment, or human-review claim was made.
