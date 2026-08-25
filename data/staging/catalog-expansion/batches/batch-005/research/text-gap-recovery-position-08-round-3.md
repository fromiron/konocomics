# Batch 005 text-gap recovery — position 08 round 3

## Scope and decision

- `position`: `8`
- `workId`: `work-0ede6921b81169dc2dda`
- `canonicalTitle`: `不滅のあなたへ`
- `retrievedAt`: `2026-08-25`
- `accessedAt`: `2026-08-25` for every source below
- `evaluatedRange`: `entry_1_3_volumes`
- `reviewedByHuman=false`
- This is a research-only packet. It changes no terminal text, Genre, Theme,
  Art, source/provenance, registry, eligibility, promotion, generated catalog,
  or recommendation code.
- The current position-8 coverage is Narrative `4/6`, Tone `4/7`, and Art
  `3/4`. `mentalStress=2` was accepted in round 2. The independent round-2 QA
  rejected `relationshipStructure`; that axis is not reopened here.
- This is the final focused pass over the two remaining Tone unknowns. **Both
  `comedy` and `romance` are exhausted for the bounded evidence and remain
  `unknown`. No legal axis/value/confidence proposal is made.**

The factor dictionary requires `comedy=2` to be recurring occasional gags
(`중간중간 개그`) and `romance=2` to be a subplot. It also requires unknown when
the evidence is insufficient. A light reaction, a single gag, kinship, or
relationship warmth is not promoted to either value.

## Binding state

The current terminal rows were read without mutation from
`data/staging/catalog-expansion/batches/batch-005/adjudication/text-final-chunk-01.csv`:

| axis | state | value | confidence |
| --- | --- | ---: | ---: |
| `relationshipStructure` | `unknown` | — | — |
| `comedy` | `unknown` | — | — |
| `mentalStress` | `known` | `2` | `0.72` |
| `romance` | `unknown` | — | — |

Binding hashes at research time:

| file | SHA-256 |
| --- | --- |
| repository HEAD | `7c23eaf23297c0e0dc042b632c48f0fc77d9d047` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| terminal `text-final-chunk-01.csv` | `c1f666d6c876a8b9309a30c41c10793592f39d99bf027f7314c0f3baf002c84d` |
| batch `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| round-2 packet | `76f5261b3a380773fd2306d8a1665696e621bdb7d0b20b19b66d5cd0c54c9877` |
| round-2 independent QA | `94a55c039e08e087e097015e86d902e440764487937b93e1be8ea1e4c595fc86` |

## Official rightsholder source ledger

The product pages establish the edition and entry-range synopsis. The linked
trial routes were opened in the official Kodansha reader. Because the reader
renders protected page images, the pages were inspected as reconstructed
viewer images; raw provider JPEG bytes and temporary screenshots were not
used as repository evidence.

| id | source | URL | publishedAt / route | accessedAt | direct bounded observation |
| --- | --- | --- | --- | --- | --- |
| `8-R3-O1` | 講談社公式商品ページ — volume 1 | https://www.kodansha.co.jp/comic/products/0000019901 | `2017-01-17` | `2026-08-25` | The opening synopsis is the sphere's first encounter and separation from the boy, followed by its learning journey. The official trial route `https://www.kodansha.co.jp/comic/products/0000019901/trial` (observed reader: `https://www.kodansha.co.jp/comic/products/0000019901/trial/reader?cid=ee1489018c070fead376a4b3bdfbfbaeadeb4bca8fd68d84aec30e33705dffda`) opens the bounded opening chapter `#1 最後のひとり`: sphere/wolf/boy/animal encounters and occasional light reactions are visible, but no courtship or romance-driven event and no repeated comedy mechanism. |
| `8-R3-O2` | 講談社公式商品ページ — volume 2 | https://www.kodansha.co.jp/comic/products/0000019946 | `2017-03-17` | `2026-08-25` | The synopsis centers on March naming Fushi, the Yanome captivity, and Parona's escape plan. The official trial route `https://www.kodansha.co.jp/comic/products/0000019946/trial` (observed reader: `https://www.kodansha.co.jp/comic/products/0000019946/trial/reader?cid=86b30b62d2f3c75fa05fc8deff50a140bb04546527bf3fc351525f28bfb89ae3`) opens `#5 追想の旅路`: transport/captivity, March and Parona's exchanges, and escape pressure are shown. There is no romantic motive or subplot; any light domestic/food beat is isolated rather than a recurring gag structure. |
| `8-R3-O3` | 講談社公式商品ページ — volume 3 | https://www.kodansha.co.jp/comic/products/0000020013 | `2017-06-16` | `2026-08-25` | The synopsis centers on Gugu's self-described monstrosity, his wish to become someone else, and life around Booze's household. The official trial route `https://www.kodansha.co.jp/comic/products/0000020013/trial` (observed reader: `https://www.kodansha.co.jp/comic/products/0000020013/trial/reader?cid=08802ad54d87b5df01bdb89b72294cd47b83ca61c1b3b132b721c293c7194b59`) opens `#14 変わりたい少年`: the sampled pages show Gugu's identity pressure, work/market/food material, and surrounding people. They do not show courtship or a romance-driven event, and the domestic/light moments do not persist as a comedy mechanism. |

### Direct persistence result

Across the three official product/trial pairs, the repeated entry mechanisms are
encounter and learning (volume 1), sacrifice/captivity and escape pressure
(volume 2), and identity/work/domestic life (volume 3). The direct sample does
not preserve a recurring gag device from one bounded episode/volume to the
next, and it does not preserve a romantic subplot or romance-driven objective
in any of the three. This is negative evidence for both candidate axes, not a
numeric zero assignment: the dictionary's evidence threshold for a known value
is not met.

## Supplemental independent-review ledger

These are corroborative observations only; they cannot override the direct
bounded source rule. The records below are individual BookLive reviews, not
the site's syndicated `Posted by ブクログ` records.

| source | URL | reviewer / review date | independence and bounded observation |
| --- | --- | --- | --- |
| BookLive volume-1 reviews | https://booklive.jp/review/list/title_id/60005607/vol_no/001 | `SJPJ`, `2019-11-24` | Direct purchased review describes the unusual world, encounters, and character pain. It does not identify recurring gags or a romantic subplot. |
| BookLive volume-1 reviews | https://booklive.jp/review/list/title_id/60005607/vol_no/001 | `フラッシュ`, `2017-12-18` | Direct review describes the changing forms, successive encounters, and unpredictable setting. “Interesting” refers to the premise/plot, not comedy; no romance is described. |
| BookLive volume-2 reviews | https://booklive.jp/review/list/title_id/60005607/vol_no/002 | `1055`, `2026-01-07` | Direct free-edition review describes March teaching manners and Fushi following her affectionately. This is child/guardian care and is not romantic evidence; no recurring comedy is reported. |
| BookLive volume-2 reviews | https://booklive.jp/review/list/title_id/60005607/vol_no/002 | `フシになりたい！`, `2021-04-21` | Direct purchased review treats March and Fushi's hoped-for future as a tearful thought, not a courtship subplot; it supplies no recurring comedy mechanism. |
| BookLive volume-3 reviews | https://booklive.jp/review/list/title_id/60005607/vol_no/003 | `匿☆名`, `2024-08-01` | Direct free-edition review focuses on Fushi and Gugu's precious time and uses emotional/dark tags. The bond is companionship/kinship, not romance, and no recurring comedy is identified. |
| BookLive volume-3 reviews | https://booklive.jp/review/list/title_id/60005607/vol_no/003 | `とま`, `2022-03-28` | Direct purchased review wishes the characters could remain happy. It provides no comedy or romantic-subplot evidence. |

The one tempting volume-2 phrase describing a “コミカルなキャラ” is in a
record explicitly marked `Posted by ブクログ` on the BookLive page, so it is a
syndicated review and is excluded. It would still be only a character
descriptor and one event, not evidence of recurring level-2 comedy. Likewise,
the Cmoa aggregate review page
`https://www.cmoa.jp/title/customer_review/title_id/124889/?site_kbn=1` was
checked only as a supplementary cross-check: its series-wide/later-volume
observations are not entry-bounded and are not used for a value.

## Axis adjudication

| axis | disposition | confidence | reason |
| --- | --- | ---: | --- |
| `comedy` | **remain `unknown`; no proposal** | — | Official volume-1, volume-2, and volume-3 trial samples show at most isolated light animal/food/domestic reactions. No recurring gag mechanism or comedy-as-reward persists across the bounded entry range. The independent reviews above do not supply that missing persistence; a syndicated “comical character” descriptor is excluded and would not meet the dictionary anchor anyway. |
| `romance` | **remain `unknown`; no proposal** | — | None of the three official product synopses or trial samples shows courtship, romantic motivation, or a romance-driven event. The reviews describe maternal care, sibling-like companionship, and grief/warmth; those are explicitly not romance. No independent review supplies an entry-range romantic subplot. |

Both unknowns are therefore exhausted under the allowed evidence. There is no
legal axis/value/confidence to propose, despite the outstanding Tone coverage
requirement.

## Gate handoff and non-mutation statement

- Position 8 remains Narrative `4/6`, Tone `4/7`, Art `3/4`; the Tone gate is
  still below `5/7`.
- `relationshipStructure` remains rejected/unknown and was not reopened.
- No terminal, source, generated, promotion, eligibility, or registry file was
  edited by this packet. The requested output is this report only.

## Verification

```text
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-08-round-3.md
sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-08-round-3.md
```
