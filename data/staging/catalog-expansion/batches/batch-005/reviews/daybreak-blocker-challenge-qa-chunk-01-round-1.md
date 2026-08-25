# Batch 005 blocker challenge QA — chunk 01 round 1

## Scope and attestation

- reviewer: Daybreak independent challenge QA
- reviewDate: `2026-08-25`
- retrievedAt for every URL below: `2026-08-25`
- frozen position: `4` only
- work: `work-0cf463005cc77eeded8e` — 黄泉のツガイ
- evaluation scope: `entry_1_3_volumes`; accepted observation is bounded to volume 1 / episode 1
- challenge packet SHA-256: `e6e42c99ca4653053f61d2883fe5b5ed7fd1664e70676db0ae5453b3466802e5`
- prior blocker round-2 SHA-256: `ff8776fc05ef728c6012912af2ecfd307a03cfd2123528eac6b4f4e35dcd4a94`
- reviewedByHuman: `false`

This review did not inherit the challenge conclusion. It reopened the two named
BookLive entries, checked their rendered entry metadata and raw HTML identities,
searched for copied distribution, and independently read the exact Square Enix
episode-1 pages already bound to the frozen volume-1 product. No Art value was
reviewed or changed.

## Source and independence audit

| source | URL | publishedAt | bounded result |
| --- | --- | --- | --- |
| Square Enix official volume 1 | https://magazine.jp.square-enix.com/top/comics/detail/9784757579620/ | `2022-06-10` | Binds title, author, ISBN `9784757579620`, release, and the official episode-1 reader. |
| Square Enix official episode 1 | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/ | `undated` | Exact rightsholder internal pages provide the primary text/content anchor described below. The route links back to the frozen volume-1 product. |
| BookLive bookseller review — 書店員すず木 | https://booklive.jp/review/list/title_id/20045746/vol_no/001 | `undated` | A named BookLive staff editorial, bounded to volume 1, describes jokes and comic character interactions recurring amid the hard opening. |
| BookLive purchaser review — エマ | https://booklive.jp/review/list/title_id/20045746/vol_no/001 | `2024-01-12` | A separately named purchaser review independently reports both tempo and humor and names the entry-range 左右様 scene. |
| BookLive staff identity | https://booklive.jp/review/staff-list/staff/2 | `undated` | Confirms 書店員すず木 is a BookLive staff reviewer, distinct from the purchaser profile. |
| BookLive purchaser identity | https://booklive.jp/review/user/id/76118444 | `undated` | Confirms the separate エマ profile linked from the review entry. |
| Bookkomi copy-distribution check | https://sp.handycomic.jp/product/index/title_id/20045746 | `undated` | Repeats the BookLive staff editorial verbatim. It is syndication of that one editorial and is not counted as a third review. |

The two counted BookLive entries are independently authored: one is a named staff
editorial and the other is a named purchaser entry with its own profile, date, and
purchase marker. They use different wording and different concrete examples. Neither
entry is marked `Posted by ブクログ`; that marker appears on other, separate entries
later on the same review page. The staff editorial is distributed verbatim on
Bookkomi, so that copy is explicitly de-duplicated. It is not a copy of the エマ
entry.

## Official primary observation

The official episode-1 sample itself supplies stronger evidence than either review:

| page ref | SHA-256 | direct entry-range observation |
| --- | --- | --- |
| `official-fotorama-005` | `26e377482f71d52c810f3d8071da50c980794f430e4415167170e3bd447af5f7` | The contrail is called a beautiful dragon's fart, a clear verbal joke. |
| `official-fotorama-008` | `e90708b08126b297f536b1246143dc00669b3e5a80c8eb2f561fdc1fc76394f9` | A separate domestic exchange uses exaggerated scolding and reaction staging as a comic beat. |
| `official-fotorama-015` | `7d0af0507c0cbc46d12f01bb31efb885aa09eabc30893d6de617486903def446` | A separate marketplace exchange turns the gift into a playful high-resale-value remark. |
| `official-fotorama-017` | `f2166e8745fb78231974a073ee7c3ce5ed115509ff65f143fdbb414a71c401d9` | The earlier dragon-fart line returns as an explicit callback before the hard turn. |

These are multiple separated comic beats within the first official episode, not a
genre inference or a reader-preference statement. They directly meet the dictionary's
`comedy=2` boundary, intermittent gags. They do not support `comedy=4`: comedy is not
the episode's constant or central reward. The staff editorial's repeated-interaction
observation and the purchaser's separate humor observation corroborate this direct
official content; neither review is used as the sole anchor.

## Decision and terminal mutation

| proposal | QA verdict | confidence | reason |
| --- | --- | ---: | --- |
| `comedy=2` | `ACCEPT` | `0.86` | Exact official episode-1 content shows several separated jokes and a callback; two separately authored volume-1 BookLive entries agree as supplemental evidence. |

Exactly one terminal row changed:

```csv
work-0cf463005cc77eeded8e,comedy,known,2,0.86,ev-batch-005-a-work-0cf463005cc77eeded8e
```

`progression`, `problemSolving`, `strategy`, `characterArcWeight`, `mentalStress`,
`romance`, and `emotionalWarmth` remain `unknown`. No Genre, Theme, Art, source,
generated, registry, eligibility, overlay, promotion, or blocker file was changed.

## Blocker disposition

The existing round-2 `SOURCE_INFORMATION_UNAVAILABLE` record does **not** remain
valid as written: its assertion that the available material cannot close comedy and
its `Tone 2/7` snapshot are now disproved. The challenge therefore defeats that exact
blocker record.

The work is not promotion-eligible after this cell. Its live gates are still
Narrative `3/6` and Tone `3/7`, so it remains short by one Narrative and two Tone
cells. A replacement hard blocker may be issued only by a fresh remaining-axis
adjudication; this QA neither promotes the work nor silently carries forward the
stale blocker.

## Hash, schema, and gate audit

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | 170 | `930896b683110c6bd3f3a0c43a64ade38bf32a770b71493459523b89e949365f` | `b8f5122e1c295b232c277e80c3fd949842eda3bf9566632f0a3ae9f1af0d7e1f` |
| `adjudication/genres-final-chunk-01.csv` | 10 | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | unchanged |
| `adjudication/themes-final-chunk-01.csv` | 11 | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | unchanged |
| `art-review/chunk-01/final-art.csv` | 40 | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` | unchanged |

The text matrix remains exactly `10 × 17 = 170` rows in frozen work and dictionary
order, with `42` known and `128` unknown rows. All state/value/confidence shapes and
work-bound evidence IDs pass.

| scope | Genre | Theme | Narrative | Tone | Art | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| position 4 before | 1/1 | 1/1 | 3/6 | 2/7 | 3/4 | fail |
| position 4 after | 1/1 | 1/1 | 3/6 | 3/7 | 3/4 | fail |
| chunk 01 after | 9/10 | 8/10 | 1/10 | 0/10 | 3/10 | 0/10 |

Verification: schema/order audit passed; canonical title has no decorative `『』`;
`git diff --check` passed.
