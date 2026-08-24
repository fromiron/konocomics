# Dr.コトー診療所 — independent Art Pass C adjudication

## 0. Identity, scope, and blind-order ledger

- Work ID: `work-b4b21d2ebe5b8efc84ea`
- Canonical title: `Dr.コトー診療所`
- Pilot candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Review and official-route access date: `2026-08-23`
- Evaluation scope: official volume-1 opening pages, within `entry_1_3_volumes`
- Representative ISBN: `9784091525017`
- Reviewer: Local Codex independent Pass C
- `reviewedByHuman=false`
- Repository mutation: none

The current Factor Dictionary was read first. The three exact screenshot originals were then hash-checked and opened at original `1280×900` pixels. Sections 1–4, including the four-axis decision, were written before opening `reviews/art-local-dr-coto-salvage.md` or `reviews/gemini-art-dr-coto-salvage-response.md`. The task envelope disclosed that a softness dispute existed; therefore “blind” here means the model reports, rationales, and evidence treatment remained unopened and unused until the independent pixel decision was frozen. It is not a claim that the existence of candidate values was information-theoretically hidden.

No cover, animation image, synopsis, genre inference, remembered style, or user opinion was used for Art.

## 1. Official edition mapping

The representative paper-volume route and electronic product converge on the same title/JDCN:

- Official 小学館コミック ISBN endpoint: <https://shogakukan-comic.jp/book?isbn=9784091525017>
  - Live HTTP chain on `2026-08-23`: `301 Location: /book?jdcn=091525010000d0000000`, then `200`.
  - Resolved page title: `Dr.コトー診療所 公式版 1`; author 山田貴敏.
- Official 小学館eコミックストア product: <https://e-comi.shogakukan.co.jp/books/091525010000d0000000>
  - Live response: `200`; canonical `og:url` repeats that product URL.
  - HTML title and product heading: `Dr.コトー診療所 公式版 1`.
  - Cart and viewer links repeat JDCN `091525010000d0000000`, including <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091525010000d0000000>.

Thus the official ISBN lookup maps representative ISBN `9784091525017` to JDCN `091525010000d0000000`, and the e-comi product/viewer use the same JDCN and title. The sampled pages are the official electronic “公式版 1” opening content of that mapped work. Edition caveat: this verifies publisher-controlled identity and volume mapping; it does not assert that an electronic render is byte-for-byte identical to the physical printing.

## 2. Exact packet integrity and original-pixel observations

| Frozen official screenshot | Recomputed SHA-256 | Page / pixel-specific observation |
|---|---|---|
| `pages-8-9.png` | `e2b845328ae98993a42d1160841e5bd20c16f0afa1ac1773218b7523caa1b47f` | Two readable pages: a doctor bent over a working fishing boat amid a heavily rendered rough sea, then coastal harbour/seawall arrival with boats, gear, villagers and large sound effects. Water, rock and sky use dense stipple/hatching; faces and posture remain recognizably proportioned but manga-stylized. |
| `pages-14-15.png` | `169d1a188cdd4b5fe5d5dfc12a879e3ce567ef7f7e4cab81dd64c720ce840c39` | Two readable pages spanning clinic exterior/arrival and interior introduction: crosshatched building walls/roof, vehicle and perspective lines contrast with nurse full figure, face close-ups, door/interior panels and the doctor's loose comic posture. |
| `pages-22-23.png` | `02cef0e4436b84f1f4d2152f621d926ea06202e2d77a6bac8008442fd90a4acb` | Two readable pages: children and doctor converse beside a high-contrast cave/tree setting, followed by a dark night domestic/medical scene with medicine drawer, timber façade, sweating faces, villagers and an isolated forceful step/sound-effect panel. No one physical action is shown from start through impact to endpoint. |

Portable three-file packet SHA-256: `d3f484fab2bde8eab38874380f84ca7a39de983915ea7a3ba13609f26b9feedb` using stable basename sort and `basename NUL lowercase-file-sha256 LF` records.

Sample gate:

- Exact screenshots: `3/3`, all readable at original pixels
- Readable internal manga pages: `6/6`
- Conservative distinct scene contexts: `6` — rough-sea fishing boat; harbour arrival; clinic exterior/entry; clinic interior/introduction; cave/tree conversation; night domestic/medical scene
- Static-axis gate: **PASS** (`6 >= 6` pages and `6 >= 2` contexts)

## 3. Dictionary anchors and conditional rule

The decision began at anchors 0/2/4; 1 or 3 is permitted only when the sustained sample genuinely lies between adjacent anchors.

- `artRealism`: 0 strong deformation/simplification; 2 ordinary stylization; 4 realistic anatomy/background/proportion.
- `artDensity`: 0 simple with much whitespace; 2 balanced; 4 high line/background/information density.
- `visualSoftness`: 0 rough/angular expression; 2 neutral; 4 soft/beautiful expression.
- `motionImpact`: 0 static/restrained; 2 ordinary; 4 strong speed/impact/action emphasis. Under the current Art policy it may be known only from an exact contiguous physical-action sequence with verifiable start, development/impact, and endpoint.

## 4. Independent procedural-blind vector (frozen before reports)

| Axis | State/value | Pixel-to-anchor decision |
|---|---:|---|
| `artRealism` | **known 3** | Adult anatomy, body weight, varied facial structure, boat/harbour scale, clinic perspective and building construction are more realistic than ordinary stylization 2. Expressive facial distortion, simplified eyes/noses and comic posing keep the sample short of realistic anchor 4. It persistently lies between 2 and 4. |
| `artDensity` | **known 3** | Sea, rock, boat hardware, harbour, clinic masonry, timber façade, cave/tree texture, clothing and facial shading carry sustained line/background information above balanced 2. Speech areas and some figure panels retain open space, so the sample does not consistently reach maximal high-density anchor 4. |
| `visualSoftness` | **known 1** | Coarse crosshatching, jagged water/rock contours, hard black masses, angular architecture, scratch-like shadows and rugged male-face marks repeatedly pull the packet toward rough/angular anchor 0. The doctor's and nurse's cleaner curved facial/figure contours prevent a full 0, but the sustained page treatment remains below neutral 2; the between-anchor value is 1. |
| `motionImpact` | **unknown** | The three packets are discontinuous spreads. Within each consecutive pair there is no single physical action whose start, development/impact and endpoint are all visible: seasickness/arrival are state changes, and the `pages-22-23` step/sound-effect panel is isolated. A numeric low value would convert absent conditional evidence into a style claim. |

Blind vector: **`[artRealism=3, artDensity=3, visualSoftness=1, motionImpact=unknown]`**.

The motion sample is explicitly closed as `unknown`; it is neither 0 nor a promotion blocker.

<!-- Model reports are opened and Pass C comparison is appended only after the vector above is frozen. -->

Blind pre-comparison whole-file SHA-256: `43fa2690be8d33e91edc9dcda5c633aeb1af77db9df6a03c917952f818e098e7` (computed after Sections 0–4 and before opening the two model reports; the final appended report necessarily has a different hash).

## 5. Model review provenance opened after the freeze

The short `reviews/...` paths named in the task did not exist. The corresponding Pilot ledgers were read in full at:

- `data/staging/catalog-expansion/pilots/pilot-001/reviews/art-local-dr-coto-salvage.md`
- `data/staging/catalog-expansion/pilots/pilot-001/reviews/gemini-art-dr-coto-salvage-response.md`

Their candidate SHA, work ID, ISBN, JDCN, page refs and all three per-file hashes match the independent audit above.

### Local result

Local reports original-pixel access and proposes `3 / 3 / 1 / unknown`, with no Art hard blocker.

### Counted Gemini result and outer-SUCCESS audit

Gemini proposes `3 / 3 / 2 / unknown`. The ledger excludes two prior outer-`ERROR` attempts and counts only attempt 3:

- Exact model: `gemini-3.7-flash-high`
- Resolved label: `Gemini 3.7 Flash (High)`
- Effort: `high`
- Conversation: `d13ec7dc-2b03-4555-9f46-4dd52b2670d6`
- Time: `2026-08-23 03:46:57–03:47:43 JST`
- Outer status / shell: **`SUCCESS` / exit 0**
- Duration: `40.38703546s`
- Completion: `completed`; all three exact hashes and distinct pixel observations returned
- Rate-limit, timeout, context cancellation, incomplete response, or degraded-output signal: none recorded

The surviving counted log exists at `/tmp/pilot-art-dr-coto-gemini.91Q8p8/agy-plain.log`; its independently recomputed SHA-256 is `b0e9d95d727b0da2692ddc709de6d5bdc5ad9bd5cbf6a65a0e568a118f135942`, matching the ledger. Spot-checking that log confirms the requested exact model, repeated propagation of label `Gemini 3.7 Flash (High)`, the same conversation ID, and normal `Stream completed` termination. The outer `SUCCESS`/exit result is explicitly preserved in the Pilot ledger. The two failed schema attempts do not contribute a value.

| Axis | Local | Counted Gemini | Pass C scope |
|---|---:|---:|---|
| `artRealism` | `known 3` | `known 3` | agreement consistency check |
| `artDensity` | `known 3` | `known 3` | agreement consistency check |
| `visualSoftness` | `known 1` | `known 2` | conflict adjudicated below |
| `motionImpact` | `unknown` | `unknown` | agreement consistency check |

No value is averaged, confidence-weighted, or selected by vote.

## 6. `visualSoftness` conflict adjudication

### Decision: accept Local `known 1`; correct Gemini `2 -> 1`

The Dictionary's relevant boundary is rough/angular `0` versus neutral `2`; a `1` requires a sustained sample that is visibly rougher than neutral without reaching the fully rough/angular endpoint.

Roughness is not confined to one dramatic establishing panel:

- `pages-8-9.png` sustains scratchy sea/sky/coast texture, jagged wave and rock shapes, heavy black water, hard sound-effect strokes, sweat and coarse face/clothing shading across both maritime and harbour pages.
- `pages-14-15.png` continues dense crosshatching on weathered clinic masonry/roof and hard architectural planes; the doctor's creased, sweating comic face and clothing shadows retain firmer, rougher marks even beside the cleaner nurse figure.
- `pages-22-23.png` again uses hard cave/tree silhouettes, deep night blacks, timber crosshatching, sick-face sweat/shadow, distressed expressions and an abrupt high-force line field. The rough treatment therefore recurs in natural, architectural and character contexts.

Gemini's counter-observation is real: the doctor's and nurse's principal contours are controlled and often curved, and several faces use clean conventional manga lines. Those signals keep the packet above the fully rough/angular 0 anchor. They do **not** establish neutral 2 across the bounded sample. Technical control or crispness is not itself softness; disciplined hatching can still create a persistently rough visual surface. Here the rough environmental and facial-shadow treatment dominates all three spreads, while smooth character contours act as the counterweight that places the result **between** 0 and 2.

Accordingly `visualSoftness=1` is a direct intermediate-anchor judgment, not an average of the two reviewers. The independent pre-comparison value happens to match Local and is process evidence, not an extra vote.

## 7. Agreed-axis consistency checks

- `artRealism=known 3`: grounded adult/child anatomy, facial variation, posture, maritime scale, clinic/interior perspective and object construction repeatedly exceed ordinary stylization 2. Manga eyes, expression distortion and simplified features prevent 4.
- `artDensity=known 3`: the sea/coast, boat, clinic, cave, timber interior, clothing and faces sustain more line/background information than balanced 2, while balloons, open sky/sea and simpler figure panels prevent a consistent 4.
- `motionImpact=unknown`: none of the exact consecutive page pairs shows one physical action with an observable start, kinematic development/impact and endpoint. Boat travel, illness, walking and the isolated force-line/step panel cannot be combined into a synthetic sequence.

## 8. Final Pass C disposition

```text
artRealism=known 3
artDensity=known 3
visualSoftness=known 1
motionImpact=unknown
```

- Static evidence gate: **PASS** — six readable official internal pages and six conservative contexts.
- Motion evidence gate: **NOT MET** — explicitly closed as `unknown`, not pending, 0, or `notApplicable`.
- Edition/content mapping: **qualified** — the publisher ISBN endpoint maps `9784091525017` to the same JDCN/title used by e-comi product and viewer. The earlier `公式版` mismatch objection is unsupported and may be retired for this Art scope.
- Remaining official route for Art: **none required**; the exact volume-1 packet is sufficient for the three static axes, and motion is properly terminated as unknown.
- Adjudication status: **resolved**; no Art conflict remains.
- Art hard blocker: **none**. Final promotion still depends on separate non-Art gates.
- `reviewedByHuman=false`.
- Repository/source/matrix edits: none.
