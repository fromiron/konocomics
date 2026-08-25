# Batch 005 position 4 final blocker adjudication

## Scope and attestation

- reviewer: Daybreak independent final blocker adjudicator
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- branch / HEAD: `main` / `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen position / work: `4` / `work-0cf463005cc77eeded8e`
- canonical title: `黄泉のツガイ`
- evaluation scope: `entry_1_3_volumes`
- candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`

This adjudication independently re-read the initial position-4 packet, all four
recovery rounds, blocker challenges, independent QA, current terminal matrices,
and final Art output. It then re-opened the exact Square Enix volumes 1–3 and
official episode routes. It changes no terminal, source, generated, promotion,
registry, eligibility, or blocker data.

## Bound terminal inputs and exact gate recount

| Input | SHA-256 |
| --- | --- |
| terminal Text | `fdcd0c5ad8d2eeb880a648df53ecac580d25d002acf0b8b4fcb6c99194daf6d0` |
| terminal Genre | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` |
| terminal Theme | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` |
| final Art | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` |
| position-4 round-4 recovery | `994345753c9393adeff0398bde0ace14f1247eb63e20a4e8d92a081677b9423a` |
| position-4 round-3 QA | `092cc340068f216b5d9c89df357e5c9653d612a2aae9e0b38d65422581bf37f0` |

The unchanged minima are Genre `1/1`, Theme at least one legal row,
Narrative `4/6`, Tone `5/7`, and Art `2/4` under the runtime `0.30` Art
coverage threshold.

| Gate | Current terminal values | Count | Result |
| --- | --- | ---: | --- |
| Genre | `action`; `fantasy` | `1/1` | pass |
| Theme | `adventure:1`; `combat:2` | `2` legal rows | pass |
| Narrative | `pacing=3`; `mysteryReveal=2`; `worldBuilding=2` | `3/6` | fail by 1 |
| Tone | `relationshipStructure=2`; `comedy=2`; `darkness=2`; `mentalStress=2`; `emotionalWarmth=2` | `5/7` | pass |
| Art | `artRealism=2`; `artDensity=3`; `visualSoftness=2`; `motionImpact=unknown` | `3/4` | pass |

Unknown cells were not converted to zero or a midpoint. The sole current
coverage failure is Narrative `3/6`; coverage failure alone does not authorize
a hard blocker.

## Prior residual-axis decisions

The prior decisions remain correctly bounded to the evidence then reviewed:

- `progression=2` remains rejected. Status change, travel, reunion, becoming a
  Tsugai user, and plot movement do not establish a repeated
  acquisition/mastery/reward loop. The newly found route below adds no such
  loop and does not reopen this axis.
- `problemSolving=2` remains rejected on the currently adjudicated material.
  Commands, ability constraints, combat, escape, and rescue do not by
  themselves establish repeated obstacle analysis followed by a non-obvious
  demonstrated solution. The new material is better tested as `strategy`, not
  double-counted into this axis.
- The episode-2-only rejection of `strategy=2` remains correct for that packet:
  reactive commands, catching, evacuation, and rescue during one crisis did
  not show deliberate planning or recurrence. It is not, however, a permanent
  rejection against materially different entry evidence.

## Exact official-route recheck

All routes below were retrieved on `2026-08-25`.

| Route | PublishedAt | Live result | Finding |
| --- | --- | --- | --- |
| [Square Enix series hub](https://magazine.jp.square-enix.com/gangan/introduction/yomitsuga/) | undated | HTTP `200` | Links the already-reviewed official episodes 1 and 2 only. |
| [Square Enix volume 3](https://magazine.jp.square-enix.com/top/comics/detail/9784757584013/) | `2023-02-10` | HTTP `200` | Product remains exact, but its visible trial link returns to episode 1. |
| guessed Gangan episode-3 route `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_03/` | undated | HTTP `404` | Confirms that this guessed URL is not a usable route. |
| [MANGA UP title 901](https://www.manga-up.com/titles/901) | undated | HTTP `200` | Official Square Enix title route, not recorded in the four recovery rounds. |
| [MANGA UP chapter 3, part 1](https://www.manga-up.com/titles/901/chapters/191003) — `デラとハナ - ①` | undated | HTTP `200` | Six readable official manga pages. |
| [MANGA UP chapter 3, part 2](https://www.manga-up.com/titles/901/chapters/191006) — `デラとハナ - ②` | undated | HTTP `200` | Six further readable official manga pages. |

The MANGA UP pages identify `黄泉のツガイ 第3話` and Square Enix, so they are
title-, rightsholder-, chapter-, and entry-scope bound. They are not an app-only
shell: the browser pages expose 12 readable internal pages. Temporary images
were inspected outside the repository and were not committed.

### Retained reproducibility hashes

| Chapter segment | Official asset page refs | SHA-256 in page order |
| --- | --- | --- |
| `191003` | `1163d3730_8_001`–`006.webp` | `a6095d2e92e1b8469e7d0a77798ebb9c5cd47aef038e135b3a3cbfb0d5ce2ed1`; `24ac956feee4a861e0dfb74a3dc51f72c16afcb22f12d3ab931d11176bd7f769`; `5d7acb96adc9578c55ff84fc08237f363944337801df7f3169ef8adcc70c7ed6`; `d856eca6ee7c50a70437e745a18116b2b71d007b630279f0698666002e0aa3c1`; `356769d88082468215422a801eefb59565e777e9348ed645e0bd188408a78153`; `32ee3e0d617fa23dd41bc3a64393be4610a94da8ee20a0dc6da74f856f63d65a` |
| `191006` | source refs `023`–`028` | `c800da3e052641a9d0cf1021ab5af6bc54663447d6b23d646b9c5e660cd03c06`; `8bd1ebea8aa17344e5cb07c98764fa4644c074e5f89a1661a98bb0f3dc4a9158`; `88f7fb46ac8d025ec91ec3ecfd3381a28ed2a7e01f6273b6b7abcfffda0fb6d1`; `5f75473e469a8762bd241e15c08eedb21dc1fc98200079d270b18fe1cf048a4a`; `d201df67fa353ff0db3844898ea981a5df373d48f8c6d9de27873114c02507f8`; `3571d9050b6f4060e0fc9702ace50c6d757890172a4e04970cc3d75d880ce73c` |

## Why the new route is capable of one Narrative cell

The chapter-3 pages add a distinct multi-step protective plan rather than a
repeat of episode-2 crisis commands:

1. Dera attributes the threat to the Kagemori family and treats renewed pursuit
   as likely; the group detects that it is being followed.
2. They choose relocation to a more populated place instead of remaining in a
   rumor-prone rural setting.
3. Dera assigns Hana to escort and protect Yuru.
4. To rent and live inconspicuously, he proposes a false household cover and
   specifies the roles: Yuru as his stepchild and Hana as his young second wife.

This is concrete unused official evidence capable of supporting the Dictionary
anchor `strategy=2` (`전술·단기 계획 존재`). It does not itself
authorize a terminal value: an independent non-Art review must still verify
that the plan is sufficiently textually established within the entry scope and
that it is not merely an isolated premise. If accepted, Narrative becomes
`4/6` and every coverage gate passes. If rejected, terminal unknown remains;
the value must not be forced to satisfy coverage.

## Final decision

```text
decision=NO_FINAL_BLOCKER
blockerCode=none
reviewedByHuman=false
retrievedAt=2026-08-25
```

- `SOURCE_INFORMATION_UNAVAILABLE`: **not authorized**. The prior source-route
  exhaustion claim is false because official MANGA UP chapter IDs `191003` and
  `191006` were unused and expose material capable of filling the sole missing
  Narrative cell.
- `FACTOR_MODEL_INCOMPATIBLE`: **not authorized**. The Dictionary directly has
  a potentially applicable strategy anchor.
- identity, safety, scope, duplicate, ISBN, and Art blocker: **none**.
- promotion authorization: **none yet**. `NO_FINAL_BLOCKER` only reopens the
  bounded evidence pipeline; it is not `recommendationVerified`.

### Recheck path

1. Bind MANGA UP title `901`, chapter IDs `191003` and `191006`, the 12 page
   refs, hashes, `publishedAt=undated`, and `retrievedAt=2026-08-25` to frozen
   position 4 / work `work-0cf463005cc77eeded8e` / `entry_1_3_volumes`.
2. Create a narrow `strategy=2` recovery packet from the threat assessment,
   relocation choice, escort assignment, and false-household cover plan. Do not
   reopen `progression`; do not duplicate the same plan into `problemSolving`.
3. Run the existing independent non-Art review and adjudication flow. Preserve
   `unknown` if the recurrence or anchor requirement is not met.
4. If accepted, update the authorized terminal through the normal pipeline and
   recompute all five gates: expected coverage is Genre `1/1`, Theme `2` legal
   rows, Narrative `4/6`, Tone `5/7`, and Art `3/4`.
5. Then run the remaining non-coverage promotion gates and overlay. If the
   strategy claim is rejected, inspect any further exact MANGA UP entry-scope
   chapter segments before reconsidering `SOURCE_INFORMATION_UNAVAILABLE`.

## Verification

```text
reviewedByHuman=false
terminalOrSourceMutation=false
temporaryImagesCommitted=false
git diff --check -- data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-blocker-adjudication-position-04-final.md  # PASS
```
