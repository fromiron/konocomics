# G1 replacement selection Oracle request

- Date: 2026-08-11
- Repository: `fromiron/konocomics`
- Base branch: `main`
- Required model: ChatGPT `5.6 Pro`
- Review type: selected replacement and pre-final-cohort checkpoint
- Previous pool verdict: `GO — the 5+5 pool and protocol may be frozen and blind non-Art annotation may start.`

## Requested verdict

Return exactly one leading verdict, `GO` or `REVISE`, then evidence. `GO` means all five items below may be frozen and integrated. It does not approve G1 itself.

1. The deterministic selector and its 25-pair audit trail implement the frozen contract.
2. The selected pair is `beyond-the-clouds` for the general/discovery/non-onboarding slot and `noragami-stray-god` for the shonen/anchor/onboarding slot.
3. The eight proposed Art rows meet the six-page, two-context, edition-crosswalk, and continuous-motion requirements.
4. The Japanese Kodansha standard editions may be canonical catalog volumes even though the already-frozen admission readers use licensed Kodansha USA editions.
5. A representative volume with zero reviews remains in the cohort with prior-only market behavior; it must not cause market-driven reselection.

## Frozen inputs and selector result

| Artifact                       | SHA-256                                                            |
| ------------------------------ | ------------------------------------------------------------------ |
| `original-cohort-freeze.json`  | `2a3b57bd3db3675ca575f3e1451c501d1713f15fa9bb24871d0acae26f1bf5be` |
| `replacement-pool-freeze.json` | `f30f47669c86195b75c8f98bec726ed8d6738f077131d6102b328bc0ff3e5c66` |
| reconciled non-Art factors     | `2664d6ea7e64ab85e51012b3b6652324ff63b2c0d48131b0911c8575c548adf8` |
| reconciled Genre               | `0c2546a2d70f05115c3f0285c7650095ba47c7e7aafa708c32df9a672b59fbb1` |
| reconciled Theme               | `742579f45e6fee74fa001bfe4b847155abb373d6db330bf380bf484ed480e86c` |
| generated replacement manifest | `93d40f2eb6358d4b30e671d039f44e95427879e85e81f70e13fedc60728397b2` |

The selector evaluated all 25 combinations without reading Art, market, popularity, review, or recommendation output.

| Slot           | Candidate            | Shared non-Art axes |         Axis distance |        Genre distance |       Theme distance |    Weighted distance |
| -------------- | -------------------- | ------------------: | --------------------: | --------------------: | -------------------: | -------------------: |
| Nausicaa slot  | `beyond-the-clouds`  |                  13 | `0.38461538461538464` | `0.33333333333333337` | `0.9333333333333333` | `0.4592307692307692` |
| Slam Dunk slot | `noragami-stray-god` |                  12 |                `0.25` |                `0.75` |                  `1` |             `0.4375` |

Combined distance is `0.8967307692307692`, rank 1 of 25. The demographic, role, onboarding, Genre, central Theme, non-Art extrema, and occupied-bin guards all pass. Rank 2 is `0.9113141025641025`.

## Proposed Art rows

Both licensed readers are embedded from official Kodansha USA series pages and map to the frozen entry volumes 1–3. Cover art and translated lettering are excluded.

- Beyond reader envelope: `publisherAuthorizedPlatform` / `manual`, `https://kodansha.us/series/beyond-the-clouds/`, Omoi chapter `8fe4ea10-de87-4f81-8ad3-bf1d51f1f7ee`, English v1 ISBN `9781632369574`.
- Noragami reader envelope: `publisherAuthorizedPlatform` / `manual`, `https://kodansha.us/series/noragami-stray-god/`, Omoi chapter `d3cc16e6-ea58-4dd7-87cc-d4b97454264f`, English v1 ISBN `9781612629063`.

| Work                 | Axis             | State/value/confidence | Distinct reader refs             | Contexts                                                | Bounded observation                                                                     |
| -------------------- | ---------------- | ---------------------- | -------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `beyond-the-clouds`  | `artRealism`     | known / 1 / 0.88       | p9, p16, p17, p24, p25, p30, p31 | bedroom/storybook; industrial city/workshop; junkyard   | stylized child proportions with functional hands, tools, bicycle, room, and perspective |
| `beyond-the-clouds`  | `artDensity`     | known / 3 / 0.92       | same 7                           | same 3                                                  | machinery, shelves, hatching, and junkyard detail balanced by dialogue whitespace       |
| `beyond-the-clouds`  | `visualSoftness` | known / 4 / 0.95       | same 7                           | same 3                                                  | fine contours, light hatching, rounded faces, gentle expressions, airy whites           |
| `beyond-the-clouds`  | `motionImpact`   | unknown                | same 7                           | same 3                                                  | no bounded readable action sequence in the frozen refs                                  |
| `noragami-stray-god` | `artRealism`     | known / 2 / 0.90       | p8, p9, p16, p17, p24, p25       | rooftop phone; classroom/school; supernatural far shore | stylized faces with consistent anatomy, hands, props, furniture, and perspective        |
| `noragami-stray-god` | `artDensity`     | known / 2 / 0.90       | same 6                           | same 3                                                  | open dialogue close-ups balance classroom, crowd, tones, and creatures                  |
| `noragami-stray-god` | `visualSoftness` | known / 2 / 0.88       | same 6                           | same 3                                                  | fine hair and face contours balanced by hard blacks and sharp supernatural forms        |
| `noragami-stray-god` | `motionImpact`   | known / 2 / 0.86       | same 6 plus p24 panels 2–5       | same 3                                                  | p24 panels 2–5 are a bounded creature-contact/recoil sequence                           |

Coverage is 0.75 and 1.00 respectively. The original-cohort audit remains a separate exact 200-row artifact until this checkpoint passes.

## Proposed canonical bibliography

The pool freeze used licensed English volumes because those editions supplied the admission readers. The catalog convention uses Japanese standard volumes, so the final records would use:

- `beyond-the-clouds`: title `Ｂｅｙｏｎｄ　ｔｈｅ　Ｃｌｏｕｄｓ　空から落ちた少女`, Nicke, Kodansha, completed, original publication year 2018, 5 volumes. Japanese v1–v3 ISBN/date: `9784065291962` / 2022-10-20, `9784065291979` / 2023-01-19, `9784065291993` / 2023-04-20. Licensed-reader v1 crosswalk: `9781632369574`.
- `noragami-stray-god`: title `ノラガミ`, あだちとか, Kodansha, shonen, completed, first publication year 2011, 27 volumes. Japanese v1–v3 ISBN/date: `9784063712940` / 2011-07-15, `9784063713084` / 2011-10-17, `9784063713237` / 2012-02-17. Licensed-reader v1 crosswalk: `9781612629063`.

Official bibliography URLs and exact CSV rows are included in the attached proposal/diff context. No ISBN is inferred from the reader edition.

- Beyond official sources: `https://www.ki-oon.com/mangas/tomes-1035-beyond-the-clouds.html`, `https://www.kodansha.co.jp/comic/products/0000369210`, `https://www.kodansha.co.jp/comic/products/0000369211`, `https://www.kodansha.co.jp/comic/products/0000369212`, `https://www.kodansha.co.jp/comic/products/0000379102`.
- Noragami official sources: `https://gmaga.co/c/noragami.html`, `https://www.kodansha.co.jp/comic/products/0000043308`, `https://www.kodansha.co.jp/comic/products/0000043321`, `https://www.kodansha.co.jp/comic/products/0000043336`, `https://www.kodansha.co.jp/comic/products/0000384705`.

## Market boundary and minimal code change

- Exact representative ISBN `9784063712940` on the public Rakuten Books search result shows Noragami paper v1 at `3.82` from `76` reviews. Provenance URL: `https://books.rakuten.co.jp/search?sitem=9784063712940`.
- Exact representative ISBN `9784065291962` on the public Rakuten Books detail shows Beyond the Clouds at 0 reviews and explicitly says no reviews exist. Provenance URL: `https://books.rakuten.co.jp/rb/17287851/`.
- The existing SSOT already makes `reviewAverage` and `reviewCount` optional and defines no-review as `n=0`, yielding the catalog prior. The prior-only work must remain an explicit context entry.
- Proposed row values are Noragami `3.82,76` and Beyond `blank,0`. The Kobo Noragami value is a different edition and is not used.
- `catalogAverageRating` is the equal-weight mean of representative-volume averages with `reviewCount>0`; the prior-only row is excluded from the denominator. The builder still requires exactly 50 context rows and at least one reviewed work, and rejects a positive count without an average.
- The proposed final observed set is 49 works: original sum `219.57` minus Nausicaa `4.56` minus Slam Dunk `4.80` plus Noragami `3.82`, giving `214.03 / 49 = 4.367959183673469`. Beyond uses that prior.

Do not recommend a different candidate merely because it has reviews: market and review signals were explicitly excluded from replacement selection.

## Verification already completed

- selector generation and byte `--check`
- selector focused tests 5/5
- candidate/selector focused tests 15/15 after the prior-only builder fix
- full test suite 280/280 before the small prior-only regression addition
- typecheck and lint after that addition
- original Art manifest schema, exact 50×4 set, factor/evidence joins, and builder assertion

If `REVISE`, name the exact contract or evidence failure and the smallest correction. Do not expand this checkpoint into G1 approval or UI work.
