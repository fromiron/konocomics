# Batch 005 Genre/Tone recovery independent QA — position 46 round 2

## Scope and attestation

- reviewer: Daybreak independent Genre/Tone recovery QA
- reviewDate / external retrieval date: `2026-08-25`
- position: `46`
- workId: `work-e906b3eaa9ef9eafe23c`
- canonicalTitle: `トリリオンゲーム`
- evaluatedRange: `entry_1_3_volumes`
- reviewedByHuman: `false`
- repository HEAD: `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- recovery packet SHA-256: `3e8fa59e212a0f3c73fc4189e04f1677fb260716ffc9a21af174a23c657c25b5`
- pre-review terminal Text / Genre / Theme SHA-256:
  `d99c3ea738a3dff5de2c63629eafdfec07b0a22d509de61cdf1122ab00cbc2e8` /
  `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` /
  `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa`
- terminal Art SHA-256: `8e9687ff8d951965eda03bfb78bf496c9f1b33f25cbfe658721068848e010ea8`

The packet conclusion was not inherited. The Dictionary, current terminal
rows, prior position-46 QA, and the prior final blocker route were read first.
The official Shogakukan volume 1–3 product pages, first-party storefront rows,
and exact volume-1 reader were then reopened. The reader endpoint returned the
same edition identity and the three cited page hashes were reproduced from the
current payload.

## Reopened official evidence

| source | URL | verified date | independent bounded observation |
| --- | --- | --- | --- |
| 小学館コミック — トリリオンゲーム 1 | https://shogakukan-comic.jp/book?isbn=9784098610105 | edition `2021-03-30`; retrieved `2026-08-25` | Title, creators, volume, and ISBN match. The official description establishes the Haru/Gaku zero-to-startup premise and links the exact reader. |
| 小学館公式試し読み — トリリオンゲーム 1 | https://sc-portal.tameshiyo.me/9784098610105 | same edition; retrieved `2026-08-25` | The current reader returned book code `9784098610105`. Direct refs `trgCode=14,15,16` reproduce hashes `2e0c1353ddb571b74a3c4afe2720679c2f05e54012481f8e52f4fd2f83cf5563`, `6f63a1bd318c5ecd03a03ce174ddae80b1a19fba8177fa7dfecd1b869cbae533`, and `e10b2c4292305dd39f730803ed3d9c1014f3fe5035ec16dd43a8408a5aa189a9`. They show a bloodied beaten man, bloodied unconscious delinquents, and Haru pulling Gaku away after the assault. |
| 小学館コミック — トリリオンゲーム 2 | https://shogakukan-comic.jp/book?isbn=9784098611133 | edition `2021-08-04`; retrieved `2026-08-25` | The official description places the pair in a hacker contest where victory yields investment and defeat yields a slave contract, expressly framed as a `デスゲーム`, against an elite team. |
| 小学館コミック — トリリオンゲーム 3 | https://shogakukan-comic.jp/book?isbn=9784098612284 | edition `2022-01-04`; retrieved `2026-08-25` | The official description returns to a new business roadmap: human-powered AI, flowers, and host work. It does not establish a cruel, bleak, or tragic central experience. |
| 小学館eコミックストア — volumes 1–3 | https://e-comi.shogakukan.co.jp/books/098610100000d0000000 | editions `2021–2022`; retrieved `2026-08-25` | All three exact first-party volume records classify the work as `ジャンル: ヒューマンドラマ`; `少年・青年マンガ` is separately presented as category. The volume-2 and volume-3 exact routes are `https://e-comi.shogakukan.co.jp/books/098611130000d0000000` and `https://e-comi.shogakukan.co.jp/books/098612280000d0000000`. |

## Independent decisions

### Tone — `darkness=2`: ACCEPT

The Dictionary midpoint requires serious danger or tragedy to be present. The
exact reader provides direct physical aftermath rather than a synopsis-only
inference: visible blood and several beaten, unconscious people. The separate
volume-2 publisher description adds a coercive slave-contract loss condition
framed as a death game. These are sufficient to rule out the bright/light
endpoint `0` within the entry range.

The same official range remains an energetic startup/business story, and
volume 3 returns to AI, flower, and host-business maneuvers. Cruel, bleak, or
tragic events are not the central repeated experience, so `darkness=4` is not
supported. The accepted terminal value is therefore exactly:

```csv
work-e906b3eaa9ef9eafe23c,darkness,known,2,0.82,ev-batch-005-a-work-e906b3eaa9ef9eafe23c
```

This does not reopen `mentalStress=2`. The prior rejection remains binding:
external violence and contractual stakes do not by themselves establish
sustained psychological pressure.

### Genre — no legal tag: ACCEPT empty terminal row

The direct publisher Genre is `ヒューマンドラマ`, outside the Dictionary's
ten-tag union. `少年・青年マンガ` is a demographic/category label. The bounded
negative audit found no responsible legal conversion:

- the volume-1 assault is a backstory event, not a recurring `action` genre;
- startup, investment, hacking, AI, flowers, and host work do not directly
  establish `fantasy`, `historical`, `scienceFiction`, `mystery`, `sports`,
  `horror`, `romance`, or `sliceOfLife`;
- accepted Axis `comedy=2` and the publisher's entertaining copy do not create
  a `comedy` Genre classification;
- Theme `workplace:2` cannot be copied into Genre.

The terminal Genre row therefore remains empty. No demographic label,
human-drama label, Axis, or Theme was forced into the union.

## Gate recount and blocker-code disposition

The unchanged minimums are Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone
`5/7`, and Art `2/4`.

| state | Genre | Theme | Narrative | Tone | Art | result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| before | 0/1 | 1/1 | 4/6 | 4/7 | 3/4 | fail: Genre, Tone |
| after accepted darkness | 0/1 | 1/1 | 4/6 | 5/7 | 3/4 | fail: Genre only |

`SOURCE_INFORMATION_UNAVAILABLE` is **not authorized**. Usable direct work and
Factor evidence is available: the exact publisher range and reader are
reachable, edition-bound, and informative. They consistently establish a
business/human-drama work while ruling out a responsible conversion to the
current legal Genre union. Calling that evidence unavailable would misstate
the reproduced provenance.

The finite route now satisfies the prior adjudication's condition for
`FACTOR_MODEL_INCOMPATIBLE`: every other numeric gate passes, the mandatory
non-empty Genre gate remains, and the directly supported publisher Genre cannot
be represented by the current Dictionary without quota filling. This QA
therefore authorizes that code for a later blocker materialization step, but
does not modify any blocker, promotion, eligibility, registry, or overlay file.

Exact authorized blocker record for downstream use:

- blockerCode: `FACTOR_MODEL_INCOMPATIBLE`
- blockerDetails: `The frozen promotion contract requires at least one legal Dictionary Genre, but the exhausted official Shogakukan volume 1–3 route and exact volume-1 reader establish a startup/business human drama classified by the first-party storefront as ヒューマンドラマ. That publisher Genre and the separate 少年・青年マンガ demographic category are outside the ten-tag union. The bounded assault is not a recurring action genre, and comedy=2 or workplace:2 cannot be copied from Axis or Theme to fill the Genre quota. After the accepted darkness=2 row, unchanged coverage is Genre 0/1, Theme 1/1, Narrative 4/6, Tone 5/7, and Art 3/4; every gate except mandatory Genre passes.`
- evidenceName: `小学館eコミックストア — トリリオンゲーム 1`
- evidenceUrl: `https://e-comi.shogakukan.co.jp/books/098610100000d0000000`
- evidencePublishedAt: `2021-03-30` (bound edition date from the exact official product; the storefront page itself shows no separate publication timestamp)
- retrievedAt: `2026-08-25`
- recheckPath: `Reopen only if the Factor Dictionary gains a directly applicable business or human-drama Genre, the mandatory non-empty Genre promotion gate changes, or new direct official volume 1–3 evidence establishes one of the existing ten legal Genres as a recurring work classification. Do not map 少年・青年マンガ, ヒューマンドラマ, comedy=2, or workplace:2 into the current union by inference; rerun all five coverage gates after any qualifying change.`

## Materialized delta and verification

Only the position-46 `darkness` row changed from `unknown` to `known,2,0.82`.

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-05.csv` | 170 | `d99c3ea738a3dff5de2c63629eafdfec07b0a22d509de61cdf1122ab00cbc2e8` | `123613a11a3cc550305480a1434fd000108aaf3f9a859443bad82363e0edcfa7` |
| `adjudication/genres-final-chunk-05.csv` | 10 | `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` | unchanged |
| `adjudication/themes-final-chunk-05.csv` | 16 | `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa` | unchanged |
| `art-review/chunk-05/final-art.csv` | 40 | `8e9687ff8d951965eda03bfb78bf496c9f1b33f25cbfe658721068848e010ea8` | unchanged |

The terminal Text matrix remains 170 rows in frozen order and now contains 70
known and 100 unknown rows. Reverse-substituting the one accepted row reproduces
the exact pre-review Text SHA-256. No source/generated/promotion/blocker CSV,
Genre, Theme, Art, registry, eligibility, Gold, formula, recommendation, or
code file was changed.
