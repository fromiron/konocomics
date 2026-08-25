# Batch 005 text recovery QA — position 47 round 1

## Scope and attestation

- reviewer: Daybreak independent non-Art QA
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- branch / HEAD: `main` / `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`
- frozen position / work: `47` / `work-f31a42ea4ad724acefa5`
- canonical title: `デッドデッドデーモンズデデデデデストラクション`
- evaluation scope: `entry_1_3_volumes`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation guide SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- round-1 recovery packet SHA-256: `add3ace8dc836a755d22d32a5aa7dd57adb51cd0d8c1677e4de543ba1bcd4e13`

This review did not inherit the proposal's conclusion. It reread the Dictionary,
the current terminal matrices, and every cited volume 1–3 product, retailer, and
edition-bound reader route. Genre and the existing `war` Theme were not used to
create the Axis value. Art, source, generated catalog, overlay, registry,
eligibility, and promotion state remained closed.

## Official source recheck

All seven cited routes returned successfully on `2026-08-25`.

| source | evaluated range | result / SHA-256 | bounded observation |
| --- | --- | --- | --- |
| [小学館コミック volume 1](https://shogakukan-comic.jp/book?isbn=9784091865007) | volume 1, ISBN `9784091865007` | HTTP `200`; response `6d0eb48213bc0da6fd0ac9d52f46923fcead3dc40833e15b28b8c13fa86c8183` | Confirms the post-invasion daily-life premise. The editor's war-game wording was not used as a strategy anchor. |
| [小学館コミック volume 2](https://shogakukan-comic.jp/book?isbn=9784091868572) | volume 2, ISBN `9784091868572` | HTTP `200`; response `a2e7c7ffb523795f28babccb4b42401b2b5f75f96f258af292db9538bf1e9f2d` | The publisher explicitly places a weapons factory for killing invaders in the same entry volume as the girls' daily life. |
| [小学館コミック volume 3](https://shogakukan-comic.jp/book?isbn=9784091872609) | volume 3, ISBN `9784091872609` | HTTP `200`; response `ff6baa04bcd9a412a00e191e1900cdeeb7099c1e467bb3f0a562e5eaed89a890` | Confirms the medium-ship crash as the event that breaks the prior daily equilibrium. |
| [コミックシーモア volume 3](https://www.cmoa.jp/title/87508/vol/3/) | volume 3 only | HTTP `200`; response `2b8da365949b7fd472ee1668ecb5aede0ddb27a2229d4f933f41a4280ab4b2a3` | Independently repeats the bounded crash description. The page's later-volume lineup, tags, and reviews were excluded. |
| [小学館 reader volume 1 page 41](https://sc-portal.tameshiyo.me/images/9784091865007?base64=1&trgCode=41&hash=a66a90848d70d3f20fd7093af42d36dd) | volume 1 BODY | HTTP success; decoded image `82024f14c964dd02d02ddb1f27f4ed25807d1485c6ed24747f615f2531e3e778` | A news display states that the Self-Defense Forces are on alert in Kawasaki. This page alone is only a preliminary posture, not a strategy value. |
| [小学館 reader volume 2 page 12](https://sc-portal.tameshiyo.me/images/9784091868572?base64=1&trgCode=12&hash=a66a90848d70d3f20fd7093af42d36dd) | volume 2 BODY | HTTP success; decoded image `81ebdf392c0aaee289c65ccef5492288bcc218f9390114f96f4d3e9046ac843d` | News narration directly links Japan's military-strengthening policy, the US-Japan diplomatic cost, and the government's decision point three years after 8/31. |
| [小学館 reader volume 3 page 11](https://sc-portal.tameshiyo.me/images/9784091872609?base64=1&trgCode=11&hash=07a253af92238af2a5179c94f63c1f58) | volume 3 BODY | HTTP success; decoded image `77dbfa9f9d1843808464b5359f659e79b9a0fa95f532112517ab8c47ce3d89aa` | After the crash, a large suppression operation begins; S.E.S. supplies same-day small craft for ground combat and is constructing giant artillery to attack the mothership's shield. |

The three decoded reader hashes exactly reproduce the packet hashes. Temporary
responses and images were inspected under `/tmp` and were not committed.

## Independent decision

| proposal | QA | confidence | Dictionary-bound reason |
| --- | --- | ---: | --- |
| `strategy=2` | `ACCEPT` | `0.80` | Volume 1 establishes an alert posture, volume 2 advances it to an explicit military-policy choice and weapons production, and volume 3 converts that response into a named suppression operation with purpose-built ground and anti-mothership assets. The value does not rest on military vocabulary or static worldbuilding: the threat response changes across the entry volumes and culminates in an executable operation with objectives, timing, and resource deployment. This meets `전술·단기 계획 존재`. |
| `strategy=4` | `REJECT` | — | The entry evidence does not make long-range war command, politics, or resource management the work's central reward. |
| `problemSolving` | `RETAIN unknown` | — | Institutional planning does not establish a recurring character-led constraint-analysis and ingenious-solution loop. |

The accepted midpoint is independent of Genre `scienceFiction;sliceOfLife` and
Theme `war:1`. No later S.E.S. control, parallel-world, or time-travel material
was used. The retailer page exposed a full-series lineup, but only its exact
volume-3 block was admitted.

Exactly one terminal row changed and its existing evidence ID was preserved:

```csv
work-f31a42ea4ad724acefa5,strategy,known,2,0.80,ev-batch-005-a-work-f31a42ea4ad724acefa5
```

## Hash, schema, and gate audit

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-05.csv` | `170` | `ffbef1b703a2298be829caff980fb94db429aeaa9b2eeb5cfa69b4879f8cfac0` | `d99c3ea738a3dff5de2c63629eafdfec07b0a22d509de61cdf1122ab00cbc2e8` |
| `adjudication/genres-final-chunk-05.csv` | `10` | `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` | unchanged |
| `adjudication/themes-final-chunk-05.csv` | `16` | `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa` | unchanged |
| `art-review/chunk-05/final-art.csv` | `40` | `8e9687ff8d951965eda03bfb78bf496c9f1b33f25cbfe658721068848e010ea8` | unchanged |

The text matrix remains `10 × 17 = 170` rows in frozen-work and Dictionary Axis
order. It now contains `69` known and `101` unknown rows. Reverse-substituting
only the accepted strategy row reproduced the before hash exactly.

Coverage minima are Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`,
and Art `>=2/4`.

| state | Genre | Theme | Narrative | Tone | Art | full coverage gate |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| position 47 before | `2/1` | `2/1` | `3/6` | `7/7` | `3/4` | fail: Narrative `+1` |
| position 47 after | `2/1` | `2/1` | `4/6` | `7/7` | `3/4` | pass |
| chunk 05 after | — | — | — | — | — | `2/10` works pass all five gates |

This closes the coverage deficit only. It does not authorize promotion or any
non-coverage state change.

## Verification

- cited routes: `7/7` HTTP success
- edition-bound reader assets: `3/3 HASH_MATCH`
- terminal delta: exactly one existing strategy row
- reverse substitution: `PASS`
- schema/order/value shape: `PASS — rows=170 works=10 known=69 unknown=101`
- position 47 gate: `G=2/1 Th=2/1 N=4/6 T=7/7 A=3/4 PASS`
- reviewedByHuman: `false`
