# Batch 005 text-gap recovery QA — position 04 round 3

## Scope and attestation

- reviewer: Daybreak independent recovery QA
- reviewDate: `2026-08-25`
- retrievedAt for every external URL below: `2026-08-25`
- frozen position: `4`
- work: `work-0cf463005cc77eeded8e` — 黄泉のツガイ
- evaluation scope: `entry_1_3_volumes`; direct page review is bounded to official episodes 1–2
- `reviewedByHuman=false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- round-3 recovery packet SHA-256: `dc342b414224fe8108bd2d49943866e82e6ffce31c5dd4b1840be4ca98c1d021`
- prior position-4 round-2 QA SHA-256: `cd9227ea82da41a1cdac3c285e49ba795f45dc75bca0d9c77bc998b082bd94e3`

This QA did not inherit the Luna proposal. The Factor Dictionary, current terminal
matrix, and all position-4/chunk-01 research, recovery, challenge, QA, blocker, and
Art records were read before the official pages were reopened. No Art value was
adjudicated.

## Independently reopened official sources

All routes returned HTTP `200` on the retrieval date.

| sourceName | sourceUrl | publishedAt | bounded use |
| --- | --- | --- | --- |
| SQUARE ENIX official product — 黄泉のツガイ 2 | https://magazine.jp.square-enix.com/top/comics/detail/9784757581005/ | `2022-09-12` | volume-2 identity and entry synopsis |
| SQUARE ENIX official product — 黄泉のツガイ 3 | https://magazine.jp.square-enix.com/top/comics/detail/9784757584013/ | `2023-02-10` | volume-3 identity and entry synopsis |
| SQUARE ENIX official series introduction | https://magazine.jp.square-enix.com/gangan/introduction/yomitsuga/ | `undated` | rightsholder bridge to official episode readers |
| SQUARE ENIX official episode-1 reader | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/ | `undated`; linked volume-1 edition `2022-06-10` | direct episode-1 body-page observations |
| SQUARE ENIX official episode-2 reader | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/ | issue publication `2022-01-12` | direct episode-2 body-page observations; HTML reproduced `fr_pagenum=47`, `fr_ad_free=[true,45]`, `fr_imgval=250212`, and `fr_dir=img/` |
| SQUARE ENIX official Gangan February 2022 issue | https://magazine.jp.square-enix.com/top/magazines/gg/?p=5 | `2022-01-12` | identifies the episode-2 issue and entry range |

### Exact page and hash reproduction

Every listed image was downloaded again from the rightsholder route. All hashes
match the recovery or earlier independently accepted position-4 ledger. Temporary
files remained under `/tmp` and were not committed.

| pageRefs | official direct URLs | reproduced SHA-256 |
| --- | --- | --- |
| episode 1 `012`, `014`, `015`, `016`, `020` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/NNN.jpg?241217` | `012=f1b5557a7bc0aeeaed893352b3870bfe6cc8e50b257f2b4cb0383bc69e288421`; `014=a4fe2128dd8ee379d5b963ac1a98d78245be3d44cf82696eac09ceb3286c2e29`; `015=7d0af0507c0cbc46d12f01bb31efb885aa09eabc30893d6de617486903def446`; `016=a0d9a1880fdfd9ce298ec20caee20dd4bd29d137afea1118baf4c5f726d55c3e`; `020=4b5ee11af2e3a7fe1f51d47bcb3b24793e5b0bc22314ae5412d40ef9a877ed40` |
| episode 2 `010–011` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/010.jpg?250212`; `.../011.jpg?250212` | `010=c7a3130627e37555e3bb99fb88ef5da2f01974278ac443d0716e27d9d888e829`; `011=c93b7899f41014ca9479642ab2b13d376ce88b671f765795325d06f6b7c02503` |
| episode 2 `013–015` | same official template with `013.jpg` through `015.jpg` | `013=94ef6a04cdf40aaace6a7993a40a9d4a8995d5e34381cfa6d533ad16f1a34811`; `014=366ce147a546c6cc0ad1f1ac586d4a8a547334a8b3275aee2f820a488d137997`; `015=1ee307753419685466b407708ed5494348822feedd946a21fec2ccc5f1d6d360` |
| episode 2 `020–022` | same official template with `020.jpg` through `022.jpg` | `020=9af8a98c88c027c4c0076afbad3b98d7f74ff6171aca81ef0cffadf585fde1c3`; `021=72d80373608a5a88132099581b49c6a4342be51c89b83c2fd0603340f17b93ec`; `022=7e472bb218a31ac136daaf803c3e72ec2be6d208ce9702a36fc8c876bef99c14` |
| episode 2 `025–030` | same official template with `025.jpg` through `030.jpg` | `025=37c17ab3c0e835d39102057425091244aee6475368851753defc6b3f176a5a92`; `026=abdf89e151f6e35a5f8b68820dc09be3acd203e536a601e3456dd2f18802bb0b`; `027=11ba58ff081cea3770dd6bcedfe0e941a0bed067c6e9c41b8035dce694ac7529`; `028=6757e7a3ea531e18ff82470420effc5d8a5c8e7cc8b205ad61389000125ebf25`; `029=2995fee94a9cd747350a963e402866cfe6ee7c97fbcaf4691dfa5257445ab551`; `030=a5ecea124b4f444021316c7d7bdb2c6fa1b94faf40a1ddcb4ee15ee6346d3b63` |

## Cell-by-cell independent decision

| proposal | QA | confidence | dictionary-bound reason |
| --- | --- | ---: | --- |
| `strategy=2` | `REJECT — keep unknown` | — | Episode-2 pages `010–015` establish the master/command rule and immediate objectives. Pages `020–022` are a reactive catch, injury check, and evacuation; pages `025–030` are a reactive combat/rescue sequence containing one immediate “do not fight now” command. The evidence does not show a deliberate tactical plan, choice among constrained alternatives, sequenced coordination, or recurrence beyond commands inside one crisis. Commands and role assignment alone do not satisfy “전술·단기 계획 존재.” |
| `emotionalWarmth=2` | `ACCEPT` | `0.82` | Episode 1 separately establishes Yuru's promise to protect Asa and repeated village reciprocity. Episode 2 then repeats enacted care in distinct contexts: Yuru orders protection of surviving villagers (`014–015`), adults check and evacuate children (`021–022`), and Asa physically supports the injured Yuru (`030`). Care is recurrent but coexists with massacre, coercive command rules, and combat, so the mixed midpoint `2` fits; warmth/healing is not dominant enough for `4`. |

The accepted value is not inferred from sibling identity, Genre, or a rescue label.
It depends on separately enacted protection, reciprocal community care, child safety,
and physical support across two official entry episodes. No user review or Art page
was needed for this decision.

Exactly one terminal row changed:

```csv
work-0cf463005cc77eeded8e,emotionalWarmth,known,2,0.82,ev-batch-005-a-work-0cf463005cc77eeded8e
```

`strategy` remains `unknown`. No Genre, Theme, Art, source, generated catalog,
registry, blocker, eligibility, overlay, or promotion file changed.

## Hash and schema audit

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | 170 | `af7d58d16d5ec96792fbd854beaf37c015c783cb1a48c981e54f7d93f86dc44d` | `fdcd0c5ad8d2eeb880a648df53ecac580d25d002acf0b8b4fcb6c99194daf6d0` |
| `adjudication/genres-final-chunk-01.csv` | 10 | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | unchanged |
| `adjudication/themes-final-chunk-01.csv` | 11 | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | unchanged |
| `art-review/chunk-01/final-art.csv` | 40 | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` | unchanged |

The text matrix remains exactly `10 × 17 = 170` rows in frozen work and Factor
Dictionary order. It now contains `44` known and `126` unknown rows. Known values
retain valid value, confidence, and work-bound evidence IDs; unknown rows retain
empty value and confidence fields. The canonical title contains no decorative
`『』` delimiters.

## Full promotion-gate recount with terminal Art `A=3`

Frozen minima remain Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`, and
Art `2/4` (`0.30` coverage).

| scope | Genre | Theme | Narrative | Tone | Art | all non-Art text gates | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| position 4 before | 1/1 | 1/1 | 3/6 | 4/7 | 3/4 | fail: N+1, T+1 | fail |
| position 4 after | 1/1 | 1/1 | 3/6 | 5/7 | 3/4 | fail: N+1 | fail |
| chunk 01 after | 9/10 | 8/10 | 1/10 | 1/10 | 3/10 | 0/10 | 0/10 |

The accepted cell closes position 4's Tone gate. Narrative remains `3/6`, so this
QA does not authorize promotion or a blocker decision.

## Verification

- official source routes: HTTP `200` on `2026-08-25`
- episode images: `19/19 HASH_MATCH`
- schema/order audit: `SCHEMA_ORDER_OK rows=170 works=10`
- terminal state counts: `known=44`, `unknown=126`
- `git diff --check`: pass
