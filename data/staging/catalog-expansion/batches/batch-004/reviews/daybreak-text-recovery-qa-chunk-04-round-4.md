# Batch 004 text-gap recovery independent QA — chunk 04, round 4

## Scope and bound inputs

- Reviewer: Daybreak independent QA
- Review date / `retrievedAt`: `2026-08-25`
- Scope: frozen position `31`, `work-925f371723beac5227f7` — 邪神の弁当屋さん, exact `entry_1_3_volumes`
- Proposal reviewed: `mentalStress=2`; no Art, identity, safety, blocker, source, promotion, registry, overlay, or generated-artifact change
- `reviewedByHuman=false`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- Round-4 recovery SHA-256: `5f0092e4ebfaa141284e8f2b49231f12dacfee07f203dc02e66a2fd53181d23f`
- Terminal text SHA-256 before review: `2355627202f24e773bfbbece478756f0026a1f75340f58919175e745d414eba0`

## Independent evidence reopening

The round-4 conclusion was not inherited. The official volume descriptions, the new rights-holder editorial, and the exact review records were reopened on `2026-08-25`. Plot danger alone was not treated as `mentalStress`: the accepted construct requires repeated reader-facing tension or pressure mixed into the entry experience.

| source | publishedAt | exact entry-range observation | use and limit |
| --- | --- | --- | --- |
| 講談社 [volume 1](https://www.kodansha.co.jp/comic/products/0000404585), [volume 2](https://www.kodansha.co.jp/comic/products/0000415367), [volume 3](https://www.kodansha.co.jp/comic/products/0000420295) | `2025-01-20` / `2025-06-19` / `2025-11-20` | The three descriptions keep punishment after war, Daria's fear of humans, a disease god seeking Rainey's power, secrets, and each character's unresolved “gap” inside the same shop/community entry. | Establishes recurrence and exact volumes, but danger and deprivation in synopsis form do not alone authorize the Axis. |
| 講談社 News editorial, [圧倒的反響のお弁当ファンタジー！ 謹慎中の「神」が始めた弁当屋さん](https://news.kodansha.co.jp/comics/20151239) | `2025-02-16` | The rights-holder review describes Rainey's orderly bento routine repeatedly interrupted by an apparent void/darkness, fierce divine turns, painful words, and a reader experience of having seen something forbidden and being unable to relax fully before daily life resumes. | This is a direct volume-1 reading observation, not a plot-label inference. It supports mixed recurring tension, not sustained collapse or maximum darkness. |
| Comic Cmoa [title reviews](https://www.cmoa.jp/title/customer_review/title_id/311981/), reviewer ひこうき | `2025-03-11` | The volume-1 review separately observes a continuing foreboding atmosphere while explicitly saying the gentle/cute relief comes first. | Concrete same-entry corroboration for a mixed, not dominant, pressure state; rating and recommendation language excluded. |
| honto [volume-1 review page](https://honto.jp/ebook/pd-review_0633848015.html?srt=2), Booklog-origin record | `2025-08-06` | A separate review system records relaxed, comforting characters with unsettling elements recurring intermittently. | Independent convergence on repeated low-to-mid tension; no Art or level-4 inference. |

## Decision

**ACCEPT `mentalStress=2` at confidence `0.65`.**

The prior rejection correctly refused to equate war, secrets, or a serious tone with mental stress. The new Kodansha editorial closes that construct gap: it reports recurring reader unease and pressure alternating with the stable bento routine, while two independent review systems repeat the same mixed pattern. This matches the Dictionary midpoint, `긴장과 답답함이 혼합`, rather than `0` or `4`.

Guardrails:

- This does not authorize `mentalStress=4`: the official observation repeatedly returns to ordinary life, and the reviews describe warmth or calm as at least equally prominent.
- This does not authorize `darkness`, `characterArcWeight`, comedy, or any Narrative cell.
- War, a disease god, secrets, and threats remain plot facts unless paired with the reader-experience observations above.

## Terminal mutation

Exactly one row changed:

```text
work-925f371723beac5227f7,mentalStress,unknown,,,ev-batch-004-a-work-925f371723beac5227f7
→ work-925f371723beac5227f7,mentalStress,known,2,0.65,ev-batch-004-a-work-925f371723beac5227f7
```

Genres and Themes were not modified. The terminal text CSV remains `10` works × `17` unique axes (`170` rows, `0` duplicate work/axis keys).

## Gate result and hashes

| gate | before | after |
| --- | ---: | ---: |
| Genre | 10/10 | 10/10 |
| Theme | 8/10 | 8/10 |
| Narrative | 0/10 | 0/10 |
| Tone | 4/10 | 4/10 |
| all four text gates | 0/10 | 0/10 |

Position 31 moves from `3 Narrative / 2 Tone` known axes to `3 Narrative / 3 Tone`; it still fails both required `4 Narrative / 5 Tone` coverage thresholds. This QA therefore authorizes no promotion or blocker status.

- Updated terminal text SHA-256: `8b8a99757c29b85eb0cf78e647fa10e086218dbeb2695ab53f8cdafcd67bc706`
- Unchanged genres SHA-256: `e0c501bf7575d0e5c02c98741a4637b3090b8b46a67eab3a2fdbb68990236acd`
- Unchanged themes SHA-256: `752dfbca2584d4255be57f2adc6ad68fa1d0847a2008d3248a23bd20e09098e5`
- Structural check: `works=10 text_rows=170 duplicate_text_keys=0`
- `reviewedByHuman=false`

This review authorizes no Art, source, blocker, overlay, promotion, registry, generated-catalog, or commit change.
