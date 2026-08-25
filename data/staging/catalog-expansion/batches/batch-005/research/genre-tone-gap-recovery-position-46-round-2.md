# Batch 005 Genre/Tone gap recovery — position 46 round 2

## Scope and terminal boundary

- `position`: `46`
- `workId`: `work-e906b3eaa9ef9eafe23c`
- `canonicalTitle`: `トリリオンゲーム`
- `retrievedAt`: `2026-08-25`
- `evaluatedRange`: `entry_1_3_volumes`
- `reviewedByHuman=false`
- Current terminal coverage: Narrative `4/6`, Tone `4/7`, Art `3/4`.
- Current terminal Theme: `workplace:2`; current Genre row is empty.
- Current unknown Tone cells: `darkness`, `mentalStress`, `romance`.
- The prior independent QA rejected `mentalStress=2`; this round does not
  reopen that value. Only one other Tone proposal is permitted here.
- This is a research-only packet. It does not modify terminal text, Genre,
  Theme, Art, source/provenance, registry, eligibility, promotion, generated
  catalog, or recommendation code.

## Binding inputs

| file | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| current terminal `adjudication/text-final-chunk-05.csv` | `d99c3ea738a3dff5de2c63629eafdfec07b0a22d509de61cdf1122ab00cbc2e8` |
| current terminal `adjudication/genres-final-chunk-05.csv` | `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` |
| current terminal `adjudication/themes-final-chunk-05.csv` | `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa` |
| current terminal `art-review/chunk-05/final-art.csv` | `8e9687ff8d951965eda03bfb78bf496c9f1b33f25cbfe658721068848e010ea8` |
| prior round-1 report | `984cefcd50dd1603ecc7a4ae2359efb6cde7f5415340cd753d5164c8db55cd00` |
| prior round-1 independent QA | `061830097ff914d79a0d31fefafb434c61a25e4d7f420ac5c386647658f11d98` |

The Dictionary's legal Genre union is `action`, `fantasy`, `historical`,
`scienceFiction`, `mystery`, `sports`, `comedy`, `horror`, `sliceOfLife`, and
`romance`. Its Tone anchor for `darkness=2` is serious danger or tragedy being
present; `darkness=4` requires cruel, bleak, or tragic events to be central.
`mentalStress` is separate and requires psychological pressure rather than
external stakes or violence.

## Direct official source ledger

All routes below were checked on `2026-08-25`. Publisher dates are kept
separate from retrieval date. The volume-1 reader page observations are used
only as bounded first-arc evidence; no later-series material is imported.

| evidenceId | source | URL | publishedAt | direct bounded support |
| --- | --- | --- | --- | --- |
| `p46-r2-o1` | 小学館公式商品ページ・トリリオンゲーム 1 | https://shogakukan-comic.jp/book?isbn=9784098610105 | `2021-03-30` | The official volume page binds title, creators, ISBN, and the zero-to-startup premise. Its linked exact reader is the same edition. |
| `p46-r2-o1-reader` | 小学館公式試し読み・トリリオンゲーム 1 | https://sc-portal.tameshiyo.me/9784098610105 | same edition | The first-arc reader's exact image refs `trgCode=14,15,16` show an urban night assault: a bloodied fist over a beaten thug, Haru standing over bloodied knocked-out delinquents, and Haru pulling Gaku away after the incident. The retained image hashes are `2e0c1353ddb571b74a3c4afe2720679c2f05e54012481f8e52f4fd2f83cf5563`, `6f63a1bd318c5ecd03a03ce174ddae80b1a19fba8177fa7dfecd1b869cbae533`, and `e10b2c4292305dd39f730803ed3d9c1014f3fe5035ec16dd43a8408a5aa189a9`. |
| `p46-r2-o2` | 小学館公式商品ページ・トリリオンゲーム 2 | https://shogakukan-comic.jp/book?isbn=9784098611133 | `2021-08-04` | The official synopsis states that Haru and Gaku pursue conditional investment through a Dragon Bank hacker contest; winning brings funding, while losing means a slave contract in a stated `デスゲーム`, against an elite team. |
| `p46-r2-o3` | 小学館公式商品ページ・トリリオンゲーム 3 | https://shogakukan-comic.jp/book?isbn=9784098612284 | `2022-01-04` | The official synopsis moves the pair to a new human-powered-AI/flower-business roadmap and a host-role change. This confirms continuation across volume 3 while keeping the entry range business-forward rather than a sustained bleak or tragic core. |
| `p46-r2-g1` | 小学館eコミックストア・トリリオンゲーム 1 | https://e-comi.shogakukan.co.jp/books/098610100000d0000000 | same edition; retrieved `2026-08-25` | The publisher storefront assigns category `少年・青年マンガ` and genre `ヒューマンドラマ`. Neither is a legal Dictionary Genre ID; the category is a demographic/category label and is not used as Genre. |
| `p46-r2-g2` | 小学館eコミックストア・トリリオンゲーム 2 | https://e-comi.shogakukan.co.jp/books/098611130000d0000000 | same edition; retrieved `2026-08-25` | The volume-2 storefront repeats `ジャンル: ヒューマンドラマ`, while its official copy repeats the hacker-contest/death-game premise. |
| `p46-r2-g3` | 小学館eコミックストア・トリリオンゲーム 3 | https://e-comi.shogakukan.co.jp/books/098612280000d0000000 | same edition; retrieved `2026-08-25` | The volume-3 storefront repeats `ジャンル: ヒューマンドラマ`; its official copy repeats the AI/flower/host roadmap. |

No review was needed to make the Tone proposal. Existing independent review
material was treated only as supplemental context and was not used to create a
second proposal.

## Genre disposition — exhausted, no legal proposal

The direct publisher classification across volumes 1–3 is `ヒューマンドラマ`,
which is not one of the ten legal Genre IDs. The official bounded content is a
startup/workplace structure (already represented by `workplace:2`), a hacker
contest with a coercive penalty, and later AI/flower/host business expansion.
The volume-1 assault is a short first-arc event and does not establish
`action` as the work's recurring genre; the hacker contest is not a legal
Genre conversion. The storefront's `少年・青年マンガ` category is a
demographic/category label, not a Genre. The accepted `comedy=2` Axis is not
reused as `comedy` Genre, and no Genre is inferred from any Axis or Theme.

Therefore no legal Genre tag is proposed in this round. The Genre gap remains
exhausted for the bounded official route; the terminal Genre row must remain
empty pending genuinely new qualifying evidence.

## Single provisional Tone proposal

### `darkness=2`

| field | value |
| --- | --- |
| `proposedState` | `known` |
| `proposedValue` | `2` |
| `confidence` | `0.82` |
| `evidenceIds` | `p46-r2-o1-reader`, `p46-r2-o2`, `p46-r2-o3` |
| `accessedAt` | `2026-08-25` |

The first-volume official reader contains a concrete assault with bloodied
victims across a bounded page sequence. The second-volume official synopsis
independently introduces a contest whose loss is a slave contract framed as a
death game. These are two distinct serious-danger observations across the
entry range, so `darkness=0` is not supported. Volume 3 continues with a
business/host roadmap rather than a cruel or tragic central premise, so the
evidence supports the Dictionary midpoint but not `darkness=4`.

This is a darkness judgment only. It does not convert external danger into
`mentalStress`: the prior independent QA rejected `mentalStress=2`, and no
new repeated psychological-pressure observation is claimed here.

## Explicit non-proposals

| item | disposition | reason |
| --- | --- | --- |
| `mentalStress` | remain `unknown` | Prior independent QA rejection is binding; external assault and a contractual death-game penalty do not establish sustained psychological pressure or breakdown. |
| `romance` | remain `unknown` | The official volume-1–3 summaries and inspected first-arc reader do not establish a recurring romance-driven subplot. Female characters, hearts, or partnership alone are not romance evidence. |
| Genre | remain empty | `ヒューマンドラマ`, `少年・青年マンガ`, startup/business, and the brief assault do not map to a legal Genre ID. |
| Theme | unchanged | `workplace:2` already captures the recurring company/business mechanism; no new Theme is proposed. |
| Art | unchanged | Existing Art terminal values were not re-adjudicated. |

If independently accepted, this one Tone proposal changes Tone coverage from
`4/7` to `5/7`. Genre remains `0/1`, so position 46 still fails the complete
promotion gate even if the Tone proposal is accepted. No promotion decision is
made by this report.

## Verification boundary

- Official Shogakukan volume routes checked: `1/1`, `2/2`, `3/3`.
- Exact first-volume reader identity and page-image hashes checked: pass.
- Entry-range bound: pass; no volume-4 or later material used.
- Demographic/category exclusion: pass; `少年・青年マンガ` was not treated as Genre.
- Genre-to-Axis inference: pass; `comedy=2` and `workplace:2` were not reused to fill Genre.
- Prior `mentalStress=2` rejection preserved: pass.
- No terminal CSV, source CSV, Theme, Art, registry, eligibility, promotion,
  generated catalog, or recommendation file was changed. Only this research
  report is created by this round.
