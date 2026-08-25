# Batch 005 text-gap recovery independent QA — position 46 round 1

## Scope and attestation

- reviewer: Daybreak independent recovery QA
- reviewDate: `2026-08-25`
- retrievedAt for every external URL below: `2026-08-25`
- frozen position: `46`
- workId: `work-e906b3eaa9ef9eafe23c`
- canonicalTitle: `トリリオンゲーム`
- evaluatedRange: `entry_1_3_volumes`
- reviewedByHuman: `false`
- repository HEAD: `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- Luna recovery packet SHA-256: `984cefcd50dd1603ecc7a4ae2359efb6cde7f5415340cd753d5164c8db55cd00`

The Luna conclusion was not inherited. The Factor Dictionary, current terminal
text, Genre, Theme, and Art rows were read first. All four official URLs cited
by the packet were then reopened, and the complete `トリリオンゲーム`
comment section in the award PDF was checked rather than only the favorable
sentences selected by the packet. No Art value was adjudicated.

## Reopened official source and date audit

| sourceName | sourceUrl | verified date | bounded observation |
| --- | --- | --- | --- |
| 小学館コミック — トリリオンゲーム 1 | https://shogakukan-comic.jp/book?isbn=9784098610105 | edition `2021-03-30` | The exact title, creators, ISBN, and volume number match the frozen work. The synopsis establishes the Haru/Gaku zero-to-startup premise, but it does not establish psychological pressure. |
| 小学館コミック — トリリオンゲーム 2 | https://shogakukan-comic.jp/book?isbn=9784098611133 | edition `2021-08-04` | The pair enter a hacker contest under a win/funding versus lose/slave-contract condition and face an elite team. This directly establishes external stakes for one contest, not sustained anxiety, frustration, breakdown, or pressure. |
| 小学館コミック — トリリオンゲーム 3 | https://shogakukan-comic.jp/book?isbn=9784098612284 | edition `2022-01-04` | The synopsis introduces a new roadmap, human-powered AI, flower business, and a host-role switch. It contains no direct mental-pressure observation and therefore cannot independently support `mentalStress=2`. |
| マンガ大賞2022 official selection comments | https://www.mangataisho.com/data/2022/comment2022.pdf | archive year `2022`; first-round comments complete `2022-03-25`; result announced `2022-03-27` | The work section describes hard problems, deception, confrontation, and a flower business being taken away, but repeatedly frames the experience as forward-facing, bright, cathartic, and entertaining. It also expressly describes the known-success structure as stress-free and says the interest is in how success occurs rather than suspense over whether it occurs. |

The official volume-4 page was checked only as a scope boundary. Volume 4 was
released on `2022-07-04`, after the award result, and its media-empire,
entertainment-agency, and social-game material was not used. The cited award
details used by Luna map to the hacker-contest and flower-business entry arcs;
no later-volume detail was imported. The award archive is corroborative rather
than a substitute for exact-volume publisher evidence.

## Independent decision

| proposal | QA | confidence | Dictionary-bound reason |
| --- | --- | ---: | --- |
| `mentalStress=2` | `REJECT — keep unknown` | — | The Dictionary requires mixed tension and psychological heaviness, not merely high external stakes. Volume 2 supplies one binary contest condition, while volume 3 supplies no pressure claim. The complete official award section describes obstacles followed by rapid, cathartic reversals and explicitly characterizes the known-success reading experience as stress-free. That evidence does not support sustained entry-range pressure at level 2. It is also insufficient to force a numeric `0`, so `unknown` remains correct. |

No value was inferred from the startup/business labels or the existing
`workplace` Theme. `darkness`, `romance`, and Genre remain unchanged. The
packet's statement that this Tone cell alone would make the work
promotion-eligible is also incorrect: the current Genre row is empty, so the
Genre gate would still fail even if Tone reached `5/7`.

## Terminal boundary, hashes, and gates

The rejected row remains exactly:

```csv
work-e906b3eaa9ef9eafe23c,mentalStress,unknown,,,ev-batch-005-a-work-e906b3eaa9ef9eafe23c
```

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-05.csv` | 170 | `ffbef1b703a2298be829caff980fb94db429aeaa9b2eeb5cfa69b4879f8cfac0` | `ffbef1b703a2298be829caff980fb94db429aeaa9b2eeb5cfa69b4879f8cfac0` |
| `adjudication/genres-final-chunk-05.csv` | 10 | `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` | unchanged |
| `adjudication/themes-final-chunk-05.csv` | 16 | `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa` | unchanged |
| `art-review/chunk-05/final-art.csv` | 40 | `8e9687ff8d951965eda03bfb78bf496c9f1b33f25cbfe658721068848e010ea8` | unchanged |

Operational minima are Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone
`>=5/7`, and Art `>=2/4`.

| scope | Genre | Theme | Narrative | Tone | Art | text gates | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| position 46 before | 0/1 | 1/1 | 4/6 | 4/7 | 3/4 | fail: Genre, Tone | fail |
| position 46 after | 0/1 | 1/1 | 4/6 | 4/7 | 3/4 | fail: Genre, Tone | fail |

The terminal text matrix remains exactly 170 rows with `known=68` and
`unknown=102`. No source, terminal, Genre, Theme, Art, registry, blocker,
eligibility, promotion, generated catalog, Gold work, or recommendation file
was changed.

## Verification

- cited official routes reopened: `4/4`
- exact volume identity and edition dates: pass
- later-series leakage check: pass; volume-4-only material excluded
- genre-inference check: pass
- terminal before/after SHA-256 equality: pass
- terminal row count and state counts: pass
- reviewedByHuman boundary: `false`
