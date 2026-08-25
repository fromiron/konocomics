# Batch 005 text recovery independent QA — position 02 round 1

## Scope and attestation

- reviewer: Daybreak independent recovery QA
- reviewDate: `2026-08-25`
- retrievedAt for every external URL below: `2026-08-25`
- frozen position: `2`
- work: `work-076beb86f844b642beef` — くーねるまるた
- evaluation scope: `entry_1_3_volumes`
- reviewedByHuman: `false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- recovery proposal SHA-256: `682e514c68af9e239f74e9c0566c2f5b8b730fee9f6f189ae29c2ecd3888b6a1`
- prior terminal text SHA-256: `fdcd0c5ad8d2eeb880a648df53ecac580d25d002acf0b8b4fcb6c99194daf6d0`
- terminal Art SHA-256: `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67`

The recovery proposal was not inherited. The Factor Dictionary, terminal chunk-01
matrices, and all earlier position-2 research, annotation, adjudication, recovery,
blocker, and Art records were read first. The exact official volume 1–3 descriptions
and the cited review surfaces were then reopened independently. No Art value was
adjudicated.

## Reopened official source ledger

Every route returned HTTP `200` on the retrieval date.

| sourceName | sourceUrl | publishedAt / route date | bounded observation |
| --- | --- | --- | --- |
| 小学館 ビッグコミックBROS — くーねるまるた | https://bigcomicbros.net/category/a1146w10092/ | `undated` | Rightsholder synopsis identifies the 70-year-old apartment, low-budget food preparation, and named recurring residents and occupations. |
| 小学館 eコミックストア — くーねるまるた 1 | https://e-comi.shogakukan.co.jp/books/091848470000d0000000 | `2014-04-02` | Volume-1 identity; limited money is paired with several concrete preparations and careful everyday living. |
| 小学館 eコミックストア — くーねるまるた 2 | https://e-comi.shogakukan.co.jp/books/091853050000d0000000 | `undated` | Volume-2 identity; named dishes, seasonal/Japanese observations, and an inventive food-sharing example recur. |
| 小学館 eコミックストア — くーねるまるた 3 | https://e-comi.shogakukan.co.jp/books/091857280000d0000000 | `undated` | Volume-3 identity; neighbours and friends recur around several named preparations in Tokyo. |
| BOOK☆WALKER official licensed series page — くーねるまるた 1–3 | https://bookwalker.jp/series/125948/ | page `undated`; volume-1 delivery `2017-12-14` | Edition-bound licensed reproduction of the three volume descriptions. It corroborates the mapping but is not counted as editorially independent from the Shogakukan text. |

The official entry descriptions repeatedly establish food preparation under limited
money or available ingredients. They also establish a recurring apartment cast and
Tokyo/seasonal milieu. They do not describe a persistent social rule, institutional
system, faction, or setting constraint that drives the episodes.

## Reopened supplemental review ledger and independence

Reviews are secondary only. No popularity score, recommendation membership, or review
wording is copied into product explanations.

| sourceName | sourceUrl | publishedAt | independence and bounded use |
| --- | --- | --- | --- |
| コミックシーモア review — まなみん | https://www.cmoa.jp/title/71299/ | `2017-10-07` | Named author on the Cmoa retail domain. The page aggregates the series rather than proving a volume-1-only review, so its general low-money/know-how observation is supplemental only and is not treated as sole entry-range evidence. |
| コミックシーモア review — jurak | https://www.cmoa.jp/title/71299/ | `2021-11-04` | Different named author. Short everyday episodes, food recurrence, old-Tokyo life, and literary references corroborate milieu, not a setting system. |
| BookLive review — 夏人, volume 2 | https://booklive.jp/review/list/title_id/241730/vol_no/002 | `2025-07-03` | Different retail domain and exact volume-2 record. Tokyo places, seasonal customs, and a flea-market episode corroborate setting texture only. |
| BookLive review — anonymous / ブクログ, volume 3 | https://booklive.jp/review/list/title_id/241730/vol_no/003?spoiler=1 | `2022-11-04` | Exact volume-3 record on a different retail domain from Cmoa. It gives concrete ingredient/problem-to-method chains: discounted mix plus a gifted ingredient becomes a rice-cooker preparation, and obtained straw is used for a seared dish. |

Cmoa and BookLive are separate retailer domains and the retained records are separately
authored and dated. The two BookLive records are not counted as independent of each
other for a numeric claim merely because their volume pages differ. The accepted
`problemSolving` cell instead uses the Shogakukan entry record as primary evidence and
the independently authored Cmoa and exact-volume BookLive observations as secondary
cross-checks.

## Cell-by-cell independent decision

| proposal | QA | confidence | Dictionary-bound reason |
| --- | --- | ---: | --- |
| `problemSolving=2` | `ACCEPT` | `0.80` | The entry record shows a repeated obstacle/process/result pattern, not merely the `cooking:2` label: limited money or a specific available ingredient prompts an adaptive preparation, which produces a meal or shared result. This recurs across the official volume 1–3 descriptions and is made concrete by independent reviews. The mechanism mixes ingenuity with direct preparation, matching the midpoint `2`; it is not the `4` anchor where constraint analysis and clever solution are the work's primary puzzle reward. |
| `worldBuilding=2` | `REJECT — keep unknown` | — | The apartment, named residents, Tokyo neighbourhoods, seasonal customs, and cultural references form a recurring milieu. The reopened sources do not show sustained rules, institutions, factions, or another setting system that constrains and drives the entry episodes. Cast recurrence belongs to the already-known relationship structure, and Tokyo atmosphere alone cannot establish the Dictionary's functional-setting anchor. The evidence is also insufficient for a confident `0`, so the terminal state remains `unknown`. |

The `problemSolving` decision does not infer an Axis from the cooking Genre/Theme. It
depends on repeated constrained input, adaptive method, and concrete result. The
`worldBuilding` rejection prevents named locations, occupations, and seasonal detail
from being counted twice as a functional world system.

## Terminal patch and invariants

Exactly one existing terminal row changed:

```text
work-076beb86f844b642beef,problemSolving,unknown,,,ev-batch-005-a-work-076beb86f844b642beef
→ work-076beb86f844b642beef,problemSolving,known,2,0.80,ev-batch-005-a-work-076beb86f844b642beef
```

`worldBuilding` remains `unknown`. No Genre, Theme, Art, source, generated catalog,
registry, blocker, eligibility, overlay, promotion, Gold work, Factor Dictionary, or
recommendation-formula file changed.

## Hash, schema, and gate audit

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | 170 | `fdcd0c5ad8d2eeb880a648df53ecac580d25d002acf0b8b4fcb6c99194daf6d0` | `5f31fa426b8e7959f0208c35baef4b0da3889fbf698e814c80282f7e0c784674` |
| `adjudication/genres-final-chunk-01.csv` | 10 | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | unchanged |
| `adjudication/themes-final-chunk-01.csv` | 11 | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | unchanged |
| `art-review/chunk-01/final-art.csv` | 40 | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` | unchanged |

The text matrix remains exactly `10 × 17 = 170` rows in frozen work and Factor
Dictionary order. It now contains `45` known and `125` unknown rows. Known rows retain
valid values, confidence, and work-bound evidence IDs; unknown rows retain empty value
and confidence fields. The canonical title contains no decorative `『』` delimiters.

Frozen coverage minima are Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`, and
Art `2/4`.

| scope | Genre | Theme | Narrative | Tone | Art | all non-Art text gates | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| position 2 before | 1/1 | 1/1 | 1/6 | 4/7 | 3/4 | fail: N+3, T+1 | fail |
| position 2 after | 1/1 | 1/1 | 2/6 | 4/7 | 3/4 | fail: N+2, T+1 | fail |
| chunk 01 after | 9/10 | 8/10 | 1/10 | 1/10 | 3/10 | 0/10 | 0/10 |

The accepted cell narrows the Narrative deficit but does not authorize promotion or a
blocker decision.

## Verification

- official and review routes: `8/8 HTTP 200` on `2026-08-25`
- schema/order audit: `SCHEMA_ORDER_OK rows=170 works=10 axesPerWork=17`
- terminal state counts: `known=45`, `unknown=125`
- changed terminal cells: `1`
- `git diff --check`: pass
