# Batch 005 text-gap recovery QA — chunk 01 round 4

## Scope and attestation

- reviewer: Daybreak independent recovery QA
- reviewDate: `2026-08-25`
- frozen positions: `1–10`; this adjudication reopens only position `8`
- scope: `entry_1_3_volumes`, with the accepted observation bounded to volume 2
- `reviewedByHuman=false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- round-4 recovery packet SHA-256: `c3a959055dd73ac17711caf70ee38bf7f923f34b3700bcaaf4c31efeaa28af02`
- prior round-3 QA SHA-256: `37ea9b06f1560851e9581503bf351714e3748dfee2b27cd30a60ebe8847a5d8e`
- prior blocker adjudication SHA-256: `e02c9a6b7a9ce7d2602b8f802a051d12770905f64e3be6a8e2f4c3ce57889c4c`

The frozen position/work/title order matches the terminal factor, Genre, Theme,
and existing Art files. Positions `1–7`, `9`, and `10`, all prior accepted or
rejected cells, and every Art decision remain closed.

## Independent source check

Both pages below were independently reopened on `2026-08-25`. Neither page
exposes its own publication date, so the matching paper-edition date is recorded
separately rather than presented as a web-page publication date.

| sourceName | sourceUrl | publishedAt | edition date | evaluated range | result |
| --- | --- | --- | --- | --- | --- |
| 講談社マンガIPサーチ公式 — 不滅のあなたへ（１） | https://cstation.kodansha.co.jp/mangaip/database/0000019901 | `undated` | `2017-01-17` | volume 1 | The common series synopsis describes a story of acquiring a self. This is corroboration only, not the sole terminal anchor. |
| 講談社マンガIPサーチ公式 — 不滅のあなたへ（２） | https://cstation.kodansha.co.jp/mangaip/database/0000019946 | `undated` | `2017-03-17` | volume 2 | The volume-specific continuation states that Fushi grows through stimuli beside March and asks what he will acquire from the girls. |

The distinction is material. The shared long-series synopsis alone would not
prove a bounded progression value. The volume-2-specific continuation describes
ongoing growth and acquisition inside the first major arc, rather than merely
using “growth” as a series tagline or naming one isolated reward. This directly
anchors the dictionary's `progression=2` definition, “gradual growth.” It does not
prove the repeated explicit growth/acquisition/mastery rewards required for
`progression=4`.

The same synopsis mentions one escape plan, but one plan is not a recurring
constraint-solving or long-term strategy structure. No value is transferred to
`problemSolving`, `strategy`, `relationshipStructure`, or any other Axis.

## Decision

| pos | workId | canonical title | proposal | QA | confidence | reason |
| ---: | --- | --- | --- | --- | ---: | --- |
| 8 | `work-0ede6921b81169dc2dda` | 不滅のあなたへ | `progression=2` | `ACCEPT` | `0.88` | Official rightsholder, volume-specific, entry-range text directly describes gradual growth and acquisition; it does not support value `4`. |

Exactly one terminal row changed:

```csv
work-0ede6921b81169dc2dda,progression,known,2,0.88,ev-batch-005-a-work-0ede6921b81169dc2dda
```

No Genre, Theme, Art, source, generated catalog, registry, blocker, eligibility,
or promotion state was changed.

## Hash and schema audit

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | 170 | `dde01a78cb4ddfc5b51805e8828bc45ba83ab9f9d6ff77342ce504a7524369e7` | `930896b683110c6bd3f3a0c43a64ade38bf32a770b71493459523b89e949365f` |
| `adjudication/genres-final-chunk-01.csv` | 10 | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | unchanged |
| `adjudication/themes-final-chunk-01.csv` | 11 | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | unchanged |

The text matrix remains exactly `10 × 17 = 170` rows in frozen work and Factor
Dictionary order. It now contains `41` known and `129` unknown rows. Known values
remain in `0–4`, unknown rows retain empty value/confidence fields, and all rows
retain the existing work-bound evidence ID. Canonical titles contain no decorative
`『』` delimiters.

## Gate recount

Frozen thresholds remain Genre `0.8`, Theme `0.6`, Narrative `0.6`, Tone `0.6`,
and Art `0.3`. Art below is a read-only recount of the already-terminal chunk-01
file, not an Art review.

| scope | Genre | Theme | Narrative | Tone | Art | all non-Art text gates | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| position 8 before | 1/1 | 1/1 | 1/6 | 3/7 | 3/4 | fail: N+3, T+2 | fail |
| position 8 after | 1/1 | 1/1 | 2/6 | 3/7 | 3/4 | fail: N+2, T+2 | fail |
| chunk 01 after | 9/10 | 8/10 | 1/10 | 0/10 | 3/10 | 0/10 | 0/10 |

The accepted cell reduces position 8's Narrative deficit by one but does not make
the work promotion-eligible and does not authorize a blocker or promotion change.

## Verification

- schema/order audit: `SCHEMA_OK rows=170 works=10`
- terminal state counts: `known=41`, `unknown=129`
- `git diff --check`: pass
