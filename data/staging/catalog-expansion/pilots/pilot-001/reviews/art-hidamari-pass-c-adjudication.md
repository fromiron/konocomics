# Pilot 001 — 陽だまりの樹 independent Art Pass C adjudication

## 0. Blind pixel pass (fixed before opening Local or Gemini conclusions)

I first reread `docs/factors/factor-dictionary.md`, including the rule that `1` and `3` are used only between the explicit `0 / 2 / 4` anchors. I then verified and inspected the six exact official-viewer captures below at their native `1280×720` resolution. I had not read either model's value/reason section when fixing this decision.

| Official viewer capture | Viewer / printed pages | SHA-256 |
|---|---|---|
| `render-03.png` | `7/63`; pp.8–9 | `cf666381b31e8c3cb65a80b519ecbe122aba90ce48aaab99cea88a0c2f923419` |
| `render-04.png` | `9/63`; pp.10–11 | `1eb1af2a780f1780469ecb864450b223516a5e3cefd74a9e025e32f9c43070aa` |
| `render-08.png` | `17/63`; pp.18–19 | `e5a0e31cebaf3d41ddc3f1bca57cce8d5a946ff534e8caaae74ea0283f1faa94` |
| `render-12.png` | `25/63`; pp.26–27 | `e375dc177a324a9f8419f9e7f59d6db1d0fab57d86749194eb51387d6219e14b` |
| `render-13.png` | `27/63`; pp.28–29 | `8e706ea18c70169513a2fd630d9b4cb3945c6f8f39040b0bad4a98427f92ff19` |
| `render-18.png` | `37/63`; pp.38–39 | `64057dc5df675db2abceb01427c91a945110544b2bf05b409b78148296710e6b` |

The exact pp.26–29 motion packet is `render-12.png` followed by `render-13.png`. I also inspected boundary control `render-14.png` (`fd33936275cbf16d1ede8346594b73f5d5e38bfb014039b4551b457778bb882b`), whose pp.30–31 interior conversation establishes the sequence change.

### Blind `artDensity` anchor decision

**`artDensity=known(3)`**, fixed before model comparison.

- pp.8–9 are exceptionally dense: the historical map fills almost the entire two-page content area with fine street/parcel lines, labels, waterways, boundary strokes, and explanatory text.
- pp.10–11 sustain high architectural and informational load through a wide Edo roofscape, detailed façades and interiors, procession figures, clothing patterns, shadows, repeated panels, and narration.
- pp.18–19 and pp.38–39 remain information-rich through numerous panels, faces, garments, furnishings, floor/window structure, screentone/crosshatching, balloons, and physical-comedy marks.
- pp.26–29 use many close panels, heavy blacks, speed-line fields, blade trails, texture, impact marks, lettering, and shattered wood. This is active visual information, not merely empty action silhouettes.
- However, the packet is not consistently at anchor `4`: the dialogue spreads repeatedly simplify or omit backgrounds, leave open white fields around figures and balloons, and use broad flat speed/black areas rather than fine drawing throughout. The map/city peaks reach `4`, while several character panels sit near balanced `2`. The sustained packet therefore falls between the anchors, at `3`.

### Blind consistency anchors for the other Art axes

- `artRealism=known(2)`: historically legible buildings, map, props, clothing, and spatial perspective coexist with sustained ordinary manga stylization, simplified anatomy, and strongly caricatured faces. This is the general-stylization anchor, not realistic anatomy `4`.
- `visualSoftness=known(2)`: rounded facial construction is offset by crisp heavy contour, angular action shapes, strong black masses, crosshatching, and hard speed/impact marks. The packet is neutral overall rather than rough `0` or consistently soft/polished `4`.
- `motionImpact=known(4)`: the continuous pp.26–29 duel escalates from positioning and draw through sweeping blade trails and evasion to a large diagonal airborne strike, dense converging speed lines, radiating impact treatment, and shattered wood. It directly satisfies the dictionary's strong speed/impact/action-emphasis anchor. `render-14.png` confirms the endpoint by switching contexts.

Blind full vector fixed before comparison: **`2 / 3 / 2 / 4`** in `artRealism / artDensity / visualSoftness / motionImpact` order.

## 1. Frozen identity, source route, and scope

- Repository branch / HEAD: `main` / `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Pilot candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work: `work-671e3453cf9e1df2ee87`
- Canonical title: `陽だまりの樹`
- Retrieval/review date: `2026-08-23`
- Canonical source: 手塚治虫 TEZUKA OSAMU OFFICIAL work page, serialization `1981-04-25`–`1986-12-25`: <https://tezukaosamu.net/jp/manga/380.html>
- Pixel source: 楽天ブックス Kobo instant preview, `陽だまりの樹 1`, viewer `1/63`–`63/63`: <https://books.rakuten.co.jp/instantpreview/8b71f80fbe1f33b7b647282fefb98f2d?viewmode=2&scid=wi_tzktokobo_0001_1>
- Mapping corroboration only: 小学館コミック, `陽だまりの樹〔小学館文庫〕 1`, ISBN `9784091920515`, released `1995-05-17`: <https://shogakukan-comic.jp/book?isbn=9784091920515>
- Sample range: volume 1, chapter 1 `三百坂`; all counted evidence is printed pp.8–39, before chapter 2 begins at p.53.
- Sample manifest SHA-256: `586d9d9d60f395b051871d0260acdd7a9e2db2df4b4d617ff10d43548817c426` (the documented ordered GNU `sha256sum` serialization of the six captures).
- Exact motion-pair manifest SHA-256 independently recomputed with the same serialization: `f94959d7bf2badcf0a83eef9dfcd85e9266e908e11a968b7387d7d5f53bd82df` (`render-12.png`, then `render-13.png`).
- Nine-file mapping/sample/boundary audit-packet SHA-256: `d3dd84fd9559cb4be2d2ed6f15f2b14593af02e07b339f5fffea605adc5b879e`.
- Derived Gemini navigation sheets, not substituted for source-pixel inspection: static `8c1eef2cab7770cabc7595a8d4458b4e20a464ef848c025bb1eea21173a6f19a`; motion `4ee127c4dcec33f7e3dad213a7ce20e7f2a120b45f303d92a6e66148f41fb7cd`.
- Scope: Art only. Cover, title/contents pixels, synopsis, animation, and user opinion did not contribute to values.
- `reviewedByHuman=false`.

### Edition-mapping caveat

The rights-holder work page directly links the Kobo item as volume 1; the viewer identifies `陽だまりの樹 1`, and its contents locate chapter 1 `三百坂`. This is sufficient to qualify the pixels as official canonical entry-volume / first-episode content for this Art judgment.

The opaque Kobo token is **not** proven SKU-identical to the frozen representative physical volume-1 ISBN `9784091806017`, and pagination equivalence to that physical edition is not asserted. This adjudication neither replaces that ISBN nor silently supplies the missing token-to-ISBN crosswalk. An exact-frozen-SKU gate, if separately required, would retain that caveat.

## 2. Model comparison after blind freeze

Only after writing the blind decision above did I read the Local and Gemini value sections.

| Axis | Local Codex | Gemini 3.7 Flash High | Pass C result |
|---|---:|---:|---|
| `artRealism` | `2` | `2` | agreement confirmed against pixels |
| `artDensity` | `3` | `4` | conflict resolved below |
| `visualSoftness` | `2` | `2` | agreement confirmed against pixels |
| `motionImpact` | `4` | `4` | agreement confirmed against bounded pixels |

Both reviews prove access to the frozen packet and satisfy the model-validity requirements. The following resolution is based on the Dictionary and page-level observations, not averaging, majority vote, confidence arithmetic, or reviewer preference. My independently frozen value happens to match Local; that is provenance for the decision process, not an extra vote.

## 3. `artDensity` conflict adjudication

### Decision: **accept Local `known=3`; correct Gemini `4 -> 3`**

Gemini is correct that the packet repeatedly rises well above balanced density. In particular:

- `render-03`, pp.8–9: fine cartographic parcels, roads, moats, labels, boundaries, narrative text, and solid landmarks cover nearly the whole spread.
- `render-04`, pp.10–11: the Edo roof panorama, façades, courtyard/procession, garments, shadows, and multiple inset views create a dense architectural/historical presentation.
- `render-13`, pp.28–29: panel subdivision, facial detail, blade trails, hatching, converging speed lines, impact marks, lettering, and shattered wood create a high-information action peak.

Those peaks justify moving above the Dictionary's balanced `2`, but the full cross-context packet does not sustain the high `4` anchor:

- `render-08`, pp.18–19, repeatedly places single or small groups of figures against unfilled shoji/tatami fields; several panels omit environmental backgrounds, and the large seiza panel is deliberately open.
- `render-12`, pp.26–27, alternates pebble/water or horizontal-speed fields with isolated figures, close faces, balloons, and broad flat black/white regions. Graphic intensity is high, but fine line/background/information density is not uniformly high.
- `render-18`, pp.38–39, has a high panel count and clear story information, yet many panels use cropped figures, simple interiors, white balloon/ground areas, or abbreviated backgrounds rather than dense drawing throughout.
- Even `render-04` combines its dense city panorama with a large open courtyard/procession field, so its peak does not define every page in the packet.

The Dictionary explicitly permits `3` only between anchors. Here the packet repeatedly exceeds balanced `2`, while its dialogue and action staging repeatedly falls short of sustained high-density `4`. `3` is therefore the direct fit. The decision does not discount text, panels, speed marks, or historical detail; it weighs them across all six pages/contexts instead of allowing the map and city peaks to determine the whole sample.

## 4. Agreed-axis consistency checks

- `artRealism=known(2)`: the map, architecture, garments, props, adult bodies, and perspective are structurally credible, but faces, expressions, and anatomy retain unmistakable ordinary manga caricature. The evidence supports general stylization, neither strong simplification `0` nor sustained realism `4`.
- `visualSoftness=known(2)`: rounded face and drapery curves coexist with heavy contours, hard black masses, architectural straight lines, crosshatching, angular blades, speed lines, and impact effects. Across contexts the treatment is neutral, not predominantly rough/angular `0` or soft/polished `4`.
- `motionImpact=known(4)`: `render-12` pp.26–27 starts and advances the duel with blade draws, trails, and speed treatment; `render-13` pp.28–29 continues without a scene break into evasive movement, a large diagonal airborne strike, converging/radiating speed marks, impact, and shattered wood. The sequence repeatedly foregrounds strong speed and force, directly matching anchor `4`. `render-14` pp.30–31 switches to an interior conversation and confirms the physical endpoint.

## 5. Final Art result and gate closure

| Axis | Final state | Final value | Resolution |
|---|---|---:|---|
| `artRealism` | `known` | `2` | Local/Gemini agreement independently confirmed |
| `artDensity` | `known` | `3` | Local accepted; Gemini corrected |
| `visualSoftness` | `known` | `2` | Local/Gemini agreement independently confirmed |
| `motionImpact` | `known` | `4` | Local/Gemini agreement independently confirmed |

Final Art vector: **`2 / 3 / 2 / 4`**.

- Static gate: **qualified** — 12 readable internal printed pages, six two-page captures, and at least four distinct contexts.
- Motion gate: **qualified** — one exact continuous pp.26–29 sequence with a physical endpoint and a pp.30 context-switch control.
- Canonical entry-content mapping: **qualified**.
- Exact frozen-SKU identity: **not asserted**, per the explicit caveat above.
- Art adjudication: **resolved**; no Art axis remains pending or unknown.
- Remaining official-content route for Art: **none required**. The frozen entry-content packet is sufficient for these four axes.
- Art hard blocker: **none**. The unresolved Kobo-token-to-representative-ISBN crosswalk is a separate edition/SKU caveat, not an Art evidence failure.
- Promotion boundary: this closes Art only and does not independently authorize promotion or decide any separate representative-ISBN gate.
- Repository mutation: **none**.
