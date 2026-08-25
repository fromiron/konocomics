# Batch 005 text-gap recovery — position 46 round 1

## Scope and terminal boundary

- `position`: `46`
- `workId`: `work-e906b3eaa9ef9eafe23c`
- `canonicalTitle`: `トリリオンゲーム`
- `retrievedAt`: `2026-08-25`
- `accessedAt`: `2026-08-25`
- `evaluatedRange`: `entry_1_3_volumes`
- `reviewedByHuman=false`
- Current terminal coverage: Narrative `4/6`, Tone `4/7`, Art `3/4`.
- Current unknown Tone cells: `darkness`, `mentalStress`, `romance`.
- This is a research-only packet. It does not modify terminal text, Genre,
  Theme, Art, source/provenance, registry, eligibility, promotion, generated
  catalog, or recommendation code.
- No genre-based inference is used. Business/startup labels remain outside the
  ten legal Genre IDs and are not reused as Tone evidence.

## Binding inputs

| file | SHA-256 |
| --- | --- |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| current terminal `text-final-chunk-05.csv` | `ffbef1b703a2298be829caff980fb94db429aeaa9b2eeb5cfa69b4879f8cfac0` |
| current terminal `final-art.csv` | `8e9687ff8d951965eda03bfb78bf496c9f1b33f25cbfe658721068848e010ea8` |

## Official source ledger

All sources below were checked on `2026-08-25`. The source publication date is
kept separate from `accessedAt`.

| evidenceId | source | URL | publishedAt | direct bounded support |
| --- | --- | --- | --- | --- |
| `p46-r1-o1` | 小学館公式商品ページ トリリオンゲーム 2 | https://shogakukan-comic.jp/book?isbn=9784098611133 | `2021-08-04` | The volume-2 entry synopsis states that Haru and Gaku obtain conditional investment, enter a hacker contest, and face a binary condition: winning brings funding while losing brings a slave contract framed as a death game. It also names an elite opponent and a concrete response plan. |
| `p46-r1-o2` | 小学館公式商品ページ トリリオンゲーム 3 | https://shogakukan-comic.jp/book?isbn=9784098612284 | `2022-01-04` | The volume-3 entry synopsis moves the pair into a new roadmap, human-powered AI and flower business, and a host transformation. This confirms continued high-stakes business reversals after the volume-2 contest rather than a one-page isolated premise. |
| `p46-r1-o3` | マンガ大賞2022 選考員コメント（公式PDF）, pp.33–34 | https://www.mangataisho.com/data/2022/comment2022.pdf | `2022` | Official award commentary bounded to the then-current entry release describes repeated difficult obstacles, deception and direct confrontation, a business being taken away, and the pair continuing to advance. The same pages also describe the work as forward-facing and entertaining, which limits the proposal to mixed pressure rather than extreme darkness or psychological collapse. |

The publisher's volume-1 page was also rechecked for identity and entry scope:
[小学館公式商品ページ トリリオンゲーム 1](https://shogakukan-comic.jp/book?isbn=9784098610105),
published `2021-03-30`, accessed `2026-08-25`. It establishes the zero-to-startup
premise and the fixed Haru/Gaku pair already represented by terminal values; it
is not used as a new Tone claim.

## Single provisional Tone proposal

### `mentalStress=2`

| field | value |
| --- | --- |
| `proposedState` | `known` |
| `proposedValue` | `2` |
| `confidence` | `0.78` |
| `evidenceIds` | `p46-r1-o1`, `p46-r1-o2`, `p46-r1-o3` |
| `accessedAt` | `2026-08-25` |

The exact volume-2 condition makes failure personally consequential for the
protagonists: losing the contest means a slave contract presented as a death
game, while the pair must face an elite team. The volume-3 publisher synopsis
then continues the entry range through a new business roadmap and further
role/business reversals. The official award comments independently describe
multiple difficult obstacles, deception/confrontation, and a business loss
followed by continued attempts. Together these are direct, entry-bounded
observations of recurring tension and pressure, matching the Dictionary's
level-2 mixed-tension anchor.

This is not `mentalStress=4`: the same official award material describes a
forward-facing, entertaining work and does not establish sustained anxiety,
psychological breakdown, or prolonged oppressive pressure. It is also not a
genre conversion or a consequence of the `workplace` Theme.

## Explicit non-proposals

| axis | disposition | reason |
| --- | --- | --- |
| `darkness` | remain `unknown` | Bright/entertaining wording does not safely prove a sustained low endpoint, and business loss/deception are not enough to assign a darkness value. |
| `romance` | remain `unknown` | No direct volume-1–3 romantic subplot is established by the official sources. |
| Genre | remain unchanged | `スタートアップ`, `職業・ビジネス`, and `ヒューマンドラマ` do not map to a legal Genre ID; no Genre is inferred. |
| Art | unchanged | Art was not researched in this packet. |

If independently accepted, this one proposal changes Tone coverage from `4/7`
to `5/7`; with the current Narrative `4/6` and Art `3/4`, it is the only
coverage change proposed here that would make the position promotion-eligible.
The proposal is not a terminal CSV mutation and requires independent
adjudication before any promotion decision.

## Verification boundary

No source, annotation, terminal, Art, promotion, registry, generated catalog,
eligibility, or recommendation file was changed. Only this research report is
created by this round.
