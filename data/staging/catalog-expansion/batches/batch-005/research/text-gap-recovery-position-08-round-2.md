# Batch 005 text-gap recovery — position 08 round 2

## Scope and non-repetition guard

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
- Existing accepted values remain closed: `progression=2`, `pacing=2`,
  `mysteryReveal=2`, `worldBuilding=2`, `characterArcWeight=2`, `darkness=2`,
  and `emotionalWarmth=2`.
- The prior rejection boundaries remain closed unless this packet has new
  direct evidence. In particular, one escape plan is not `problemSolving` or
  `strategy`; changing companions are not automatically a fixed party; death
  or pain alone is not `mentalStress`; and no entry-range romance has been
  identified.
- Current Tone unknowns before this round were `relationshipStructure`,
  `comedy`, `mentalStress`, and `romance`. At most two are proposed here.

## Binding state and exact current terminal rows

Current terminal text was read from
`data/staging/catalog-expansion/batches/batch-005/adjudication/text-final-chunk-01.csv`.
The position-8 rows are unchanged from the independent round-1 QA:

| axis | state | value | confidence | evidenceId |
| --- | --- | ---: | ---: | --- |
| `progression` | `known` | 2 | 0.88 | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `problemSolving` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `strategy` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `pacing` | `known` | 2 | 0.78 | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `mysteryReveal` | `known` | 2 | 0.76 | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `worldBuilding` | `known` | 2 | 0.84 | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `characterArcWeight` | `known` | 2 | 0.78 | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `relationshipStructure` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `comedy` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `darkness` | `known` | 2 | 0.72 | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `mentalStress` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `romance` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `emotionalWarmth` | `known` | 2 | 0.72 | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `artRealism` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `artDensity` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `visualSoftness` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |
| `motionImpact` | `unknown` | — | — | `ev-batch-005-a-work-0ede6921b81169dc2dda` |

Binding hashes at research time:

| file | SHA-256 |
| --- | --- |
| repository HEAD | `7c23eaf23297c0e0dc042b632c48f0fc77d9d047` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| terminal `text-final-chunk-01.csv` | `9937a3c0dee8325b3dcd550597f594d37750a6eb3be6f6d6a1cb8e746dac295c` |
| batch `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| round-1 packet | `dcb63ba296ff6b85f06b08dae4595d79955c1bf9e4322f40c30cb05cb5e50d5c` |

## Official source ledger

The first two sources are rightsholder product/metadata pages. The third is
the official Kodansha trial reader opened from the volume-3 product page. The
reader route is undated; its paper edition date is recorded separately. No
later volume, anime material, or broad series synopsis is used as a numeric
anchor.

| id | sourceName | URL | publishedAt / route date | accessedAt | bounded use |
| --- | --- | --- | --- | --- | --- |
| `8-R2-O1` | 講談社公式商品ページ — 不滅のあなたへ（３） | https://www.kodansha.co.jp/comic/products/0000020013 | `2017-06-16` | `2026-08-25` | Volume-3 entry synopsis: Gugu calls himself a monster, wants to become someone other than himself, is treated by Fushi as a younger brother, and lives/works around Booze's household. |
| `8-R2-O2` | 講談社マンガIPサーチ公式 — 不滅のあなたへ（３） | https://cstation.kodansha.co.jp/mangaip/database/0000020013 | page `undated`; paper edition `2017-06-16` | `2026-08-25` | Rightsholder corroboration of the same volume-3 Gugu/Fushi household and identity-conflict entry arc. |
| `8-R2-O3` | 講談社公式 volume-3 trial reader, chapter `#14 変わりたい少年` | https://www.kodansha.co.jp/comic/products/0000020013/trial | route `undated`; paper edition `2017-06-16` | `2026-08-25` | The stable route redirected to the observed reader `https://www.kodansha.co.jp/comic/products/0000020013/trial/reader?cid=08802ad54d87b5df01bdb89b72294cd47b83ca61c1b3b132b721c293c7194b59`. The sampled reader pages show repeated Gugu/Fushi sibling dialogue, shared household work/food, Gugu's surrounding acquaintances, and the chapter's self-change pressure. |

The trial reader was inspected as image content, not treated as a text API
guess. Temporary screenshots were not added to the repository. The visible
sample is bounded to the official volume-3 opening chapter and does not import
later family or faction material.

## Provisional Tone proposals

Both proposals are provisional and require independent adjudication. They are
not terminal CSV mutations.

### `relationshipStructure=2` — provisional

| field | value |
| --- | --- |
| proposedState | `known` |
| proposedValue | `2` |
| confidence | `0.80` |
| evidenceIds | `8-R2-O1`, `8-R2-O2`, `8-R2-O3` |
| dictionary anchor | Fixed core relationship / recurring supporting characters, rather than a solo protagonist or a complex ensemble. |

The official volume-3 synopsis explicitly makes Gugu Fushi's younger-brother
relationship and the Booze-household life part of the entry arc. The official
trial's `#14 変わりたい少年` pages add direct scene evidence: Fushi repeatedly
addresses Gugu as `兄ちゃん`, the two share household work and food, and the
surrounding acquaintances recur around that domestic core. This is enough for
the conservative middle level 2: a fixed core/supporting relationship is
visibly repeated within the sampled major arc. It is not level 4; the bounded
sample does not establish a complex multi-faction ensemble or many interlocking
relationships.

This is new direct evidence relative to round 1: the prior packet had the
volume-3 synopsis but did not use the official trial pages' repeated household
interactions as an anchor. The prior boundary that changing companions alone
do not prove a fixed party remains intact; no permanent party is inferred from
the March/Parona material.

### `mentalStress=2` — provisional

| field | value |
| --- | --- |
| proposedState | `known` |
| proposedValue | `2` |
| confidence | `0.72` |
| evidenceIds | `8-R2-O1`, `8-R2-O2`, `8-R2-O3` |
| dictionary anchor | Tension/frustration and psychological pressure are present, but sustained anxiety, breakdown, or a level-4 pressure structure is not established. |

The official volume-3 product copy directly describes Gugu as `自らを怪物と
自嘲する` and says he wants to become someone other than himself. The official
trial chapter is titled `変わりたい少年` and places that self-change pressure
inside repeated scenes of work, food scarcity, social contact, and sibling
conversation. This is direct psychological conflict rather than an inference
from death or physical pain, and it supports level 2 conservatively.

The packet does not propose level 4. The official entry-range sample does not
show persistent anxiety, psychological collapse, or pressure sustained across
the whole first three volumes. The existing `darkness=2` and
`emotionalWarmth=2` decisions are not reused as numeric evidence.

## Explicit exhaustion / no-proposal cells

| axis | disposition | reason |
| --- | --- | --- |
| `comedy` | remain `unknown` | The trial contains light domestic exchanges and a small food/animal gag, but no recurring comedy mechanism or core comedic reward. A single humorous beat is below dictionary level 2. |
| `romance` | remain `unknown` | No direct romantic subplot, courtship, or romance-driven entry event appears in the official volume-1–3 sources used here. Genre or relationship warmth is not romance evidence. |
| `problemSolving` | remain `unknown` | Round-1 boundary retained: Parona's single escape plan is not a repeated constraint-analysis/solution structure. This round found no new direct evidence. |
| `strategy` | remain `unknown` | Round-1 boundary retained: the same escape plan does not establish recurring short-term tactics or long-term resource operation. This round found no new direct evidence. |

Independent user reviews were not used as primary evidence. The previously
checked direct BookLive records remain supplemental only and do not add a new,
entry-bounded recurring comedy or romance anchor. No review observation is
copied into product UI or converted into a terminal value here.

## Coverage handoff

If both provisional cells are independently accepted, position 8 would count
as Narrative `4/6`, Tone `5/7`, and Art `3/4`; its text and Art coverage gates
would then pass. This packet itself authorizes no terminal mutation, blocker,
eligibility change, promotion, or source/generated update.

Independent adjudication should verify:

1. the volume-3 trial route is the official reader for the same Kodansha
   edition and remains bounded to chapter `#14` / entry range;
2. the repeated sibling/household scenes meet `relationshipStructure=2`
   without being inflated to level 4;
3. Gugu's explicit self-description and desire to change meet
   `mentalStress=2` without duplicating `darkness` or `characterArcWeight`;
4. `comedy` and `romance` remain unknown absent a repeated direct mechanism.

## Verification

```text
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-08-round-2.md
sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-08-round-2.md
```
