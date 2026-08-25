# Batch 005 text-gap recovery QA — position 08 round 1

## Scope and attestation

- reviewer: Daybreak independent recovery QA
- reviewDate: `2026-08-25`
- retrievedAt: `2026-08-25`
- frozen position: `8`
- workId: `work-0ede6921b81169dc2dda`
- canonicalTitle: `不滅のあなたへ`
- evaluatedRange: `entry_1_3_volumes`
- reviewedByHuman: `false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- recovery packet SHA-256: `dcb63ba296ff6b85f06b08dae4595d79955c1bf9e4322f40c30cb05cb5e50d5c`

This review did not inherit a Luna verdict. The two cells were checked against
the Factor Dictionary and independently reopened rightsholder pages, exact
volume trial readers, and the official award-comment archive. Later character,
entity, faction, and setting material was excluded. Positions `1–7`, `9–10`,
all other text cells, and every Art decision remain closed.

## Independent official-source check

All pages were reopened on `2026-08-25`. The SHA-256 values below identify the
HTTP response captured during this review; they are not hashes of repository
files. A C-station page does not publish a page date, so its matching paper
edition date is recorded separately.

| sourceName | sourceUrl | publishedAt | evaluated range | response SHA-256 | bounded observation |
| --- | --- | --- | --- | --- | --- |
| 講談社公式商品ページ — 不滅のあなたへ（１） | https://www.kodansha.co.jp/comic/products/0000019901 | `2017-01-17` | volume 1 | `525f8c73bc54d6c61f80a08bf9fb19150705ad79c27dc73c13ac26d0dd05cfb4` | The entity gathers information, changes form, survives death, and begins acquiring a self through the first encounter and separation. |
| 講談社公式商品ページ — 不滅のあなたへ（２） | https://www.kodansha.co.jp/comic/products/0000019946 | `2017-03-17` | volume 2 | `e15281d14635a0449c042fb00c236334606306daaedef29c1fe2208f163f532b` | March's sacrifice, Fushi's naming and growth through stimuli, Yanome captivity, and Parona's escape attempt form one functional entry arc. |
| 講談社公式商品ページ — 不滅のあなたへ（３） | https://www.kodansha.co.jp/comic/products/0000020013 | `2017-06-16` | volume 3 | `f1c1e33282a039980b05b4e618db09da0f6c0fe9f13f6c8a00a198fa269071a3` | After a first enemy encounter, the entry moves to Gugu, the Booze estate, sibling care, and an attempted human life. |
| 講談社マンガIPサーチ公式 — 不滅のあなたへ（１） | https://cstation.kodansha.co.jp/mangaip/database/0000019901 | page `undated`; edition `2017-01-17` | volume 1 | `1f6d787560384fc6f821de4e3555450b52f99cd5dea0befe6388a65d93ca7c87` | Rightsholder corroboration of the volume-1 premise and identity. |
| 講談社マンガIPサーチ公式 — 不滅のあなたへ（２） | https://cstation.kodansha.co.jp/mangaip/database/0000019946 | page `undated`; edition `2017-03-17` | volume 2 | `10611f04b2dae68b3442b081239e30532af6cd930ff1e15acdf337ee1af0236c` | Rightsholder copy binds Ninnananna, the Oniguma offering, Yanome custody, named actors, and escape to the entry arc. |
| 講談社マンガIPサーチ公式 — 不滅のあなたへ（３） | https://cstation.kodansha.co.jp/mangaip/database/0000020013 | page `undated`; edition `2017-06-16` | volume 3 | `77a6f744cc2ead6129d7d2d07c5bd6d44da266aeb7d5ce90c59bb3d80db4a8ca` | Rightsholder corroboration of the bounded Gugu/Booze-estate context. |
| 週刊少年マガジン公式 — 不滅のあなたへ | https://shonenmagazine.com/special_page/fumetsu/ | `undated` | series premise only | `cf192be4c2ee5e4d3afd032d67fdaa5366a0df7c34e232e4f0c1018f68c17fbb` | Corroborates that stimuli/information drive acquired forms; the later character list was not used. |
| マンガ大賞2018 選考コメント | https://www.mangataisho.com/data/2018/comment2018.pdf | `2018-03-22` | corroboration only | `8c1a52b4de404dee5372b01c75268f6c2662efd4dae7aee22ee9e9f908338299` | An official selection comment says the story becomes clear gradually and that Fushi's transformation conditions are disclosed little by little. Broader long-series comments were not used as numeric anchors. |

### Exact official trial-reader check

- Volume 2 trial: https://www.kodansha.co.jp/comic/products/0000019946/trial
  (`ContentID=0b8ec346-8072-4e4b-ad83-955a654cb144`)
- Volume 3 trial: https://www.kodansha.co.jp/comic/products/0000020013/trial
  (`ContentID=1cbae9e3-db02-470f-8bfe-5d6a3f032666`)

The official volume-2 reader's recap makes the previously concealed mechanism
operational: the initial sphere passes through acquired forms, and stimuli allow
Fushi to copy encountered forms. The same bounded pages establish the
Ninnananna sacrifice custom and Yanome's official intervention, material-policy
goal, detention, and control of the old rite. The volume-3 reader and product
copy continue the acquired-form/enemy premise into a different social setting.
This is evidence of sustained functional rules and institutions, not merely a
fantasy label.

The reader render was inspected interactively. Temporary screenshots were not
committed; direct protected image bytes were not treated as readable evidence.

## Cell decisions

| axis | proposal | QA | confidence | bounded rationale |
| --- | --- | --- | ---: | --- |
| `mysteryReveal` | `known=2` | `ACCEPT` | `0.76` | Volumes 1–2 stage the entity from unexplained sphere through observable acquired forms and then make the stimulus/transformation rule explicit in the official recap. Volume 3 adds the first enemy encounter. The award archive independently corroborates gradual disclosure of the transformation conditions. This meets level 2, but not level 4: the bounded evidence does not establish a recurring clue/deduction/payoff structure. |
| `worldBuilding` | `known=2` | `ACCEPT` | `0.84` | Entry events repeatedly depend on functional supernatural rules and social institutions: acquisition/transformation, the Oniguma sacrifice, Yanome authority and policy, captivity, then the Gugu/Booze-estate setting. This meets functional-setting level 2, but not level 4: volumes 1–3 do not establish sufficiently broad, sustained history/culture/faction exposition. |

The award PDF is corroborative only because its comments can reflect material
beyond volume 3. Each accepted value is independently anchored in the official
volume 1–3 descriptions and readers. No later-series entity or faction was
imported, and no value was transferred to `problemSolving`, `strategy`,
`relationshipStructure`, `comedy`, `mentalStress`, or `romance`.

Exactly two terminal rows changed:

```csv
work-0ede6921b81169dc2dda,mysteryReveal,known,2,0.76,ev-batch-005-a-work-0ede6921b81169dc2dda
work-0ede6921b81169dc2dda,worldBuilding,known,2,0.84,ev-batch-005-a-work-0ede6921b81169dc2dda
```

No Genre, Theme, Art, source, generated catalog, registry, blocker,
eligibility, or promotion state was changed.

## Hash and schema audit

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | 170 | `625fb4975a5a92f6c903aa8ec09e4c4e35479741c5ab13fc21955a602a961d98` | `9937a3c0dee8325b3dcd550597f594d37750a6eb3be6f6d6a1cb8e746dac295c` |
| `adjudication/genres-final-chunk-01.csv` | 10 | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | unchanged |
| `adjudication/themes-final-chunk-01.csv` | 11 | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | unchanged |
| `art-review/chunk-01/final-art.csv` | 40 | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` | unchanged |

The text matrix remains exactly `10 × 17 = 170` rows in frozen-work and Factor
Dictionary order. It contains `48` known and `122` unknown rows. Known values
remain legal integers in `0–4`; unknown rows retain empty value/confidence
fields; all rows retain the existing work-bound evidence ID. The canonical
title contains no decorative `『』` delimiters.

## Gate recount

Operational row thresholds are Genre `>=1`, Theme `>=1`, Narrative `>=4/6`,
Tone `>=5/7`, and Art `>=2/4`. Art is a read-only recount of the existing
terminal Art file.

| scope | Genre | Theme | Narrative | Tone | Art | all non-Art text gates | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| position 8 before | 1/1 | 1/1 | 2/6 | 3/7 | 3/4 | fail: N+2, T+2 | fail |
| position 8 after | 1/1 | 1/1 | 4/6 | 3/7 | 3/4 | fail: T+2 | fail |
| chunk 01 after | 9/10 | 8/10 | 3/10 | 1/10 | 3/10 | 1/10 | 1/10 |

The accepted cells close position 8's Narrative gate. Tone remains `3/7`, so
the work is not promotion-eligible and this review authorizes no blocker or
promotion mutation.

## Verification

- schema/order audit: `PASS — 170 rows, 10 frozen works, 17 dictionary-ordered axes per work`
- terminal state counts: `known=48`, `unknown=122`
- position 8 gates: `G 1/1`, `Th 1/1`, `N 4/6`, `T 3/7`, `A 3/4`, all gates `FAIL`
- chunk 01 gates: Genre `9/10`, Theme `8/10`, Narrative `3/10`, Tone `1/10`, Art `3/10`, all non-Art text `1/10`, all gates `1/10`
- `git diff --check` on the terminal CSV and this report: pass
