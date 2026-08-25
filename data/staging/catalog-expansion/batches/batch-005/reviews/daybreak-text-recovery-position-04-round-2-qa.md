# Batch 005 text-gap recovery QA — position 04 round 2

## Scope and attestation

- reviewer: Daybreak independent recovery QA
- reviewDate: `2026-08-25`
- retrievedAt for every external URL below: `2026-08-25`
- frozen position: `4`
- work: `work-0cf463005cc77eeded8e` — 黄泉のツガイ
- evaluation scope: `entry_1_3_volumes`, plus the official volume-1 episode-1 reader
- `reviewedByHuman=false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- recovery packet SHA-256: `65dffc724fb362ea7fdd4dd8513b6c9dfba4a07117e3f7c5c97c8de9b6ca6358`
- blocker-challenge packet SHA-256: `e6e42c99ca4653053f61d2883fe5b5ed7fd1664e70676db0ae5453b3466802e5`
- blocker-challenge QA SHA-256: `b0f35b9d0bdb2517455c5554d6713c9e901af2c09fccd36622be181ee669c1bc`

This QA did not inherit the recovery proposals. The current terminal chunk-01
matrix, the earlier official-first research, every chunk-01 recovery and blocker
challenge decision, and the existing Art result were checked before the exact
position-4 routes were reopened. Art was read only for the final gate recount; no
Art cell was re-adjudicated.

## Reopened official sources

All four official routes returned HTTP `200` on `2026-08-25`. The publisher pages
bind the work, author, ISBN, volume, release date, and episode-1 reader. Volumes 2
and 3 link to the same episode-1 route rather than exposing separate internal
samples.

| sourceName | sourceUrl | publishedAt | evaluated range | independent bounded result |
| --- | --- | --- | --- | --- |
| SQUARE ENIX 공식 — 黄泉のツガイ 1 | https://magazine.jp.square-enix.com/top/comics/detail/9784757579620/ | `2022-06-10` | volume 1 | Yuru's quiet village life, Asa's confined duty, the village secret, and the opening battle are stated directly. |
| SQUARE ENIX 공식 — 黄泉のツガイ 2 | https://magazine.jp.square-enix.com/top/comics/detail/9784757581005/ | `2022-09-12` | volume 2 | The attack ends Yuru's quiet life; he becomes a Tsugai user, descends with Dera and Hana, searches for Asa to ask about his parents, and clashes with the Kagemori family. |
| SQUARE ENIX 공식 — 黄泉のツガイ 3 | https://magazine.jp.square-enix.com/top/comics/detail/9784757584013/ | `2023-02-10` | volume 3 | Yuru follows Jin's invitation, reunites with Asa, repels an unidentified attack, and confronts the shocking fact that Asa died once and is now alive. |
| SQUARE ENIX 공식 ガンガンオンライン — 제1화 시험읽기 | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/ | `undated` (linked volume-1 edition date `2022-06-10`) | episode 1 | The exact rightsholder body pages below were independently opened and read. |

### Exact episode-1 page audit

The image bytes reproduced the recovery packet's hashes exactly. These temporary
inspection files were not added to the repository.

| pageRef | official URL | SHA-256 | independent observation |
| --- | --- | --- | --- |
| `official-fotorama-012` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/012.jpg?241217 | `f1b5557a7bc0aeeaed893352b3870bfe6cc8e50b257f2b4cb0383bc69e288421` | Yuru says he will not leave the village and will protect Asa while she remains there. This establishes an entry motive, not an accomplished character change. |
| `official-fotorama-014` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/014.jpg?241217 | `a4fe2128dd8ee379d5b963ac1a98d78245be3d44cf82696eac09ceb3286c2e29` | Villagers exchange medicine and goods; this is a bounded community interaction. |
| `official-fotorama-015` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/015.jpg?241217 | `7d0af0507c0cbc46d12f01bb31efb885aa09eabc30893d6de617486903def446` | Yuru receives a gift and thanks the visitor; the page also contains the already-adjudicated comic resale remark. |
| `official-fotorama-016` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/016.jpg?241217 | `a0d9a1880fdfd9ce298ec20caee20dd4bd29d137afea1118baf4c5f726d55c3e` | Asked about leaving, Yuru says it would be acceptable if he could go with his sister. This qualifies his stated preference but is not an enacted or repeated arc. |
| `official-fotorama-020` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/020.jpg?241217 | `4b5ee11af2e3a7fe1f51d47bcb3b24793e5b0bc22314ae5412d40ef9a877ed40` | An aircraft abruptly breaks the village calm and a character displays an immediate fear/shock response. |

The BookLive volume-1 and Sony volume-3 observations in the recovery packet remain
supplemental only. No review, rating, or retailer label was used as the sole anchor
for a terminal value.

## Cell-by-cell decision

| proposal | QA | confidence | dictionary-bound reason |
| --- | --- | ---: | --- |
| `progression=2` | `REJECT — keep unknown` | — | Becoming a Tsugai user once and moving through a search, clash, reunion, and new facts are status and plot changes. The official entry record does not show gradual growth or a recurring acquisition/mastery reward. Treating sequential events as progression would duplicate the already-known `pacing=3`. |
| `characterArcWeight=2` | `REJECT — keep unknown` | — | Pages 012 and 016 establish Yuru's initial protective motive and a conditional preference; they do not show an enacted, repeated character change. Volumes 2–3 describe forced circumstances, searching, conflict, reunion, and revelation, but do not establish character change as a balanced entry reward rather than event-driven plotting. |
| `mentalStress=2` | `ACCEPT` | `0.82` | The official entry range repeatedly applies psychological pressure: Asa's confinement and village secret, the episode-1 shock response, the attack that ends Yuru's quiet life, continued faction clashes, and the volume-3 death/survival revelation described as shocking. Intermittent comedy and the absence of sustained breakdown keep the value at the mixed-pressure midpoint, not `4`. |

`mentalStress` is not inferred from `darkness`. The accepted value depends on direct
fear/shock and repeated uncertainty across volumes 1–3; `darkness=2` continues to
represent the serious danger and violence separately.

Exactly one terminal row changed:

```csv
work-0cf463005cc77eeded8e,mentalStress,known,2,0.82,ev-batch-005-a-work-0cf463005cc77eeded8e
```

`progression` and `characterArcWeight` remain `unknown`. No Genre, Theme, Art,
source, generated catalog, registry, blocker, eligibility, overlay, or promotion
file was changed.

## Hash and schema audit

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | 170 | `b8f5122e1c295b232c277e80c3fd949842eda3bf9566632f0a3ae9f1af0d7e1f` | `af7d58d16d5ec96792fbd854beaf37c015c783cb1a48c981e54f7d93f86dc44d` |
| `adjudication/genres-final-chunk-01.csv` | 10 | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | unchanged |
| `adjudication/themes-final-chunk-01.csv` | 11 | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | unchanged |
| `art-review/chunk-01/final-art.csv` | 40 | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` | unchanged |

The text matrix remains exactly `10 × 17 = 170` rows in frozen work and Factor
Dictionary order. It contains `43` known and `127` unknown rows. Every known row
retains value, confidence, and the work-bound evidence ID; every unknown row retains
empty value and confidence fields. The canonical title contains no decorative
`『』` delimiters.

## Full promotion-gate recount

Frozen thresholds remain Genre `0.8`, Theme `0.6`, Narrative `0.6`, Tone `0.6`,
and Art `0.3`. The Art count is the already-terminal three-static-axis result and
was not changed by this text QA.

| scope | Genre | Theme | Narrative | Tone | Art | all non-Art text gates | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| position 4 before | 1/1 | 1/1 | 3/6 | 3/7 | 3/4 | fail: N+1, T+2 | fail |
| position 4 after | 1/1 | 1/1 | 3/6 | 4/7 | 3/4 | fail: N+1, T+1 | fail |
| chunk 01 after | 9/10 | 8/10 | 1/10 | 0/10 | 3/10 | 0/10 | 0/10 |

The accepted cell reduces the Tone deficit by one. Position 4 remains ineligible
because both Narrative and Tone coverage still fail; this QA neither promotes the
work nor restores the stale blocker.

## Verification

- exact official routes: HTTP `200` on `2026-08-25`
- episode image SHA-256: all five exact matches
- schema/order audit: `SCHEMA_ORDER_OK rows=170 works=10`
- terminal state counts: `known=43`, `unknown=127`
- `git diff --check`: pass
