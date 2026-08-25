# Batch 005 position 08 text-exhaustion QA — round 3

## Scope and independent attestation

- reviewer: Daybreak independent exhaustion QA
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- position / workId: `8` / `work-0ede6921b81169dc2dda`
- canonical title: `不滅のあなたへ`
- evaluated range: `entry_1_3_volumes`
- reviewed packet:
  `research/text-gap-recovery-position-08-round-3.md`
- packet SHA-256:
  `bc854e9b141205627d0717d4b1fb93cc342843254b26cdf1e35512387222ba74`

This QA independently read the Factor Dictionary, promotion method, frozen
identity and provenance, every position-8 original/recovery research and text
QA decision, the current terminal Text/Genre/Theme rows, and final Art rows. It
then reopened the three Kodansha products and exact trials, the enumerated
BookLive records, and an exact-volume independent-review route omitted from the
round-3 packet. It changes no terminal, source, generated, registry, blocker,
eligibility, promotion, or Art data.

Ponytail's minimum-change rule was applied: this file records the one surviving
route and does not manufacture a quota-closing value.

## Binding and gate recount

| Input | SHA-256 |
| --- | --- |
| repository HEAD | `7c23eaf23297c0e0dc042b632c48f0fc77d9d047` |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| terminal `adjudication/text-final-chunk-01.csv` | `c1f666d6c876a8b9309a30c41c10793592f39d99bf027f7314c0f3baf002c84d` |
| terminal `adjudication/genres-final-chunk-01.csv` | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` |
| terminal `adjudication/themes-final-chunk-01.csv` | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` |
| final `art-review/chunk-01/final-art.csv` | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` |
| prior position-8 round-2 QA | `94a55c039e08e087e097015e86d902e440764487937b93e1be8ea1e4c595fc86` |

| Gate | Current terminal evidence | Count | Result |
| --- | --- | ---: | --- |
| Genre | `fantasy` | `1/1` | pass |
| Theme | `exploration:2` | `1/1` | pass |
| Narrative | `progression=2`, `pacing=2`, `mysteryReveal=2`, `worldBuilding=2` | `4/6` | pass |
| Tone | `characterArcWeight=2`, `darkness=2`, `mentalStress=2`, `emotionalWarmth=2` | `4/7` | fail by 1 |
| Art | `artRealism=3`, `artDensity=1`, `visualSoftness=3`; `motionImpact=unknown` | `3/4` | pass |

The residual Tone axes are `relationshipStructure`, `comedy`, and `romance`.
The prior independent QA rejected `relationshipStructure=2`; that decision is
not reopened. The round-3 packet claims the other two routes are exhausted.

## Official products and exact trial recheck

All routes below were reopened in isolated live-browser sessions on
`2026-08-25`. The protected reader pages were inspected visually in order;
temporary screenshots and provider image bytes were not retained in the
repository.

| Source | Edition / exact route | Bounded result |
| --- | --- | --- |
| [講談社 不滅のあなたへ（１）](https://www.kodansha.co.jp/comic/products/0000019901) | paper `2017-01-17`, ISBN `9784063958423`; [trial](https://www.kodansha.co.jp/comic/products/0000019901/trial) resolved to reader `cid=ee1489018c070fead376a4b3bdfbfbaeadeb4bca8fd68d84aec30e33705dffda` | The product and `#1 最後のひとり` opening show the sphere/wolf/boy encounter and isolated light animal/human reactions. No romantic event or recurring gag mechanism is established. |
| [講談社 不滅のあなたへ（２）](https://www.kodansha.co.jp/comic/products/0000019946) | paper `2017-03-17`, ISBN `9784063958874`; [trial](https://www.kodansha.co.jp/comic/products/0000019946/trial) resolved to reader `cid=86b30b62d2f3c75fa05fc8deff50a140bb04546527bf3fc351525f28bfb89ae3` | The product and `#5 追想の旅路` opening remain centered on March, Parona, travel/captivity, care, and escape pressure. No courtship or repeated comedy structure is shown. |
| [講談社 不滅のあなたへ（３）](https://www.kodansha.co.jp/comic/products/0000020013) | paper `2017-06-16`, ISBN `9784063959550`; [trial](https://www.kodansha.co.jp/comic/products/0000020013/trial) resolved to reader `cid=08802ad54d87b5df01bdb89b72294cd47b83ca61c1b3b132b721c293c7194b59` | The product synopsis centers Gugu's identity pressure and life with Fushi. The exact `#14 変わりたい少年` sample exposes body pages 3–8 and directly shows Gugu's work/market past and first named encounter with Rean. The sample alone is an attraction/relationship lead, not enough to assign a numeric romance value, but it is a valid official entry-bound anchor for review corroboration. Light food/animal reactions remain one short sequence, not recurring comedy evidence. |

The first two trial findings support the packet's negative boundaries. The
volume-3 finding does not support its statement that no romance route remains:
the official sample supplies the exact entry scene to which independent
volume-3 observations can be bound.

## Independent-review route omitted by the packet

The round-3 packet rechecked direct BookLive reviews and correctly excluded
rows marked `Posted by ブクログ`. Those records discuss pain, changing
companions, maternal care, sibling-like companionship, and desired happiness;
they do not independently establish comedy or romance.

However, the packet did not exhaust the exact-volume DokushoMeter route:

| Provenance | Range / independence | Bounded observation |
| --- | --- | --- |
| [読書メーター — 不滅のあなたへ 3巻](https://bookmeter.com/books/11823036) | Exact Kodansha volume 3 page: title/creator/publisher, `208` pages, and ASIN/ISBN-10 `4063959554`, which maps to frozen entry ISBN-13 `9784063959550`; page itself undated; retrieved `2026-08-25` | The page contains separately authored account records tied to this volume, not an aggregate later-series review. |
| reviewer `kei-os`, [review `103486900`](https://bookmeter.com/reviews/103486900), `2022-01-03` | Direct account and exact volume-3 record; the individual URL redirects logged-out users to login, but the exact book page exposes reviewer, date, review ID, and text together | Describes Gugu and Rean as the volume's boy-meets-girl structure: a transformed boy and the girl he saved. This is concrete relationship structure, not a star/rank signal. |
| reviewer `章敬`, [review `97593613`](https://bookmeter.com/reviews/97593613), `2021-04-14` | Different direct account, date, and review ID on the same exact-volume page; detailed event sequence demonstrates actual volume-3 reading | States that the volume begins with Gugu/Rean's meeting and that Gugu saves Rean toward whom he has affection. This independently repeats the romantic motive. |

The two records are not copies: their authors, dates, wording, and surrounding
volume observations differ. They also satisfy the promotion-method review
boundary: exact reading range, URL, reviewer/date, independent authorship, and
a concrete `romance` observation. They corroborate the official volume-3 trial
rather than replace it.

## Residual Tone decision

### `relationshipStructure` — retain `unknown`

The prior rejection stands. Volumes 1–2 use changing companion arcs, and the
volume-3 trial does not establish a fixed party or recurring multi-character
configuration across the entry range.

### `comedy` — exhaustion supported; retain `unknown`

The reopened trials show isolated light reactions, not intermittent gags as a
recurring entry reward. BookLive and DokushoMeter provide no two independent,
entry-bound observations of recurring comedy. Silence cannot become
`comedy=0`.

### `romance` — exhaustion rejected; legal route remains

The exact volume-3 trial plus two independent exact-volume reviews form a legal
candidate route for `romance=2` (subplot), not `4` (central romance). This QA
does not write a terminal value or confidence, but the route must receive a
narrow independent cell adjudication before any information-unavailable
blocker can be considered.

## Final decision

```text
packetVerdict=FAIL_EXHAUSTION_NOT_PROVEN
decision=NO_FINAL_BLOCKER_YET
blockerCode=none
remainingRoute=romance
reviewedByHuman=false
retrievedAt=2026-08-25
```

- `SOURCE_INFORMATION_UNAVAILABLE`: **not authorized**. A qualifying,
  exact-entry, independently authored review route remains and directly maps to
  the sole missing Tone cell. Coverage failure alone is not a blocker.
- `FACTOR_MODEL_INCOMPATIBLE`: **not authorized**. `romance=2` already models
  the observed subplot without changing the Dictionary.
- Identity, safety, scope, duplicate, ISBN, Genre, Theme, Narrative, and Art
  blockers: **none**.
- Current files remain unchanged at Tone `4/7`. If `romance=2` is independently
  accepted, Tone becomes `5/7` and all five annotation coverage gates pass;
  that counterfactual is not a terminal or promotion mutation.

### Exact finite recheck path

1. Reopen Kodansha volume 3 product/ISBN and its exact `#14` trial reader above;
   confirm the Gugu/Rean meeting remains within body pages 3–8.
2. Reopen DokushoMeter book `11823036`; confirm the exact volume identity and
   locate `kei-os` / `2022-01-03` / review `103486900` and `章敬` /
   `2021-04-14` / review `97593613`. Treat the book page as the reproducible
   logged-out surface because individual review URLs currently require login.
3. Adjudicate only `romance`: test the two independent observations plus the
   official scene against `0/2/4`, require a separately justified confidence,
   and do not transfer the result to `relationshipStructure`, `comedy`, or
   `emotionalWarmth`.
4. If the candidate is accepted, rerun the unchanged five gates. If rejected,
   record the exact evidence-to-definition reason, check for any newly
   available non-syndicated exact-volume review, and only then rerun a strict
   `SOURCE_INFORMATION_UNAVAILABLE` adjudication. Do not block for elapsed time.

## Verification boundary

```text
terminalOrSourceMutation=false
blockerMutation=false
temporaryReaderImagesCommitted=false
```
