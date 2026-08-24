# Pilot 001 — 陽だまりの樹 Art-only salvage audit

- Work: `work-671e3453cf9e1df2ee87`
- Canonical title: `陽だまりの樹`
- Repository HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Pilot candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Scope: official chronological entry volume 1 / first episode only
- Retrieved at: `2026-08-23`
- Reviewer: Local Codex, independent pixel inspection
- Repository edits: none

## 1. Result

The requested gate passes at the **canonical entry-content** level.

- Canonical work / volume mapping: **PASS**
- Exact frozen representative ISBN-to-viewer-token mapping: **not asserted**
- Viewer access: **PASS**
- Static sample: **PASS**, 12 readable internal printed pages across at least four scene contexts
- Motion sample: **PASS**, one exact continuous action sequence bounded to printed pp.26–29
- Local Art vector (`artRealism / artDensity / visualSoftness / motionImpact`): **`2 / 3 / 2 / 4`**
- Art hard blocker: **none**

This is a Local proposal for the required independent Art panel. It is not by itself Local–Gemini quorum or final promotion approval.

## 2. Official sources and edition/content mapping

Every row was retrieved on `2026-08-23`.

| id | source | publishedAt / year | edition and range | URL | direct verification |
|---|---|---|---|---|---|
| H-00 | 手塚治虫 TEZUKA OSAMU OFFICIAL work page | page undated; serialization `1981-04-25`–`1986-12-25` | canonical work; rights-holder links digital volumes 1–11 | https://tezukaosamu.net/jp/manga/380.html | The first linked Kobo item is volume 1. This is the authoritative route to K-01. |
| K-01 | 楽天ブックス Kobo instant preview `陽だまりの樹 1` | page undated; electronic-edition release date not exposed | official digital volume 1; viewer counter `1/63`–`63/63`; actual pixel source | https://books.rakuten.co.jp/instantpreview/8b71f80fbe1f33b7b647282fefb98f2d?viewmode=2&scid=wi_tzktokobo_0001_1 | Viewer header and internal title identify `陽だまりの樹 1`. Its contents page begins chapter 1 `三百坂` at printed p.7 and chapter 2 at p.53. All Art evidence is printed pp.8–39, therefore inside the first canonical episode. |
| B-01 | 小学館コミック `陽だまりの樹〔小学館文庫〕 1` | page undated; edition release `1995-05-17` | official alternate volume 1; ISBN `9784091920515`; 328 pages; chapters 1–9 | https://shogakukan-comic.jp/book?isbn=9784091920515 | Independently corroborates that volume 1 starts with chapter 1 `三百坂`. It is mapping evidence only; no pixels were taken from this page. |

### Mapping adjudication

The earlier `edition-gate-failed` closure treated the opaque Kobo token's lack of an ISBN as if no edition/content mapping existed. That is too broad for this requested entry-content audit:

1. The rights holder directly links K-01 as volume 1 of the same canonical work.
2. K-01 itself names the work and volume and exposes an internal contents page.
3. K-01 and the official Shogakukan alternate volume 1 both begin with the identically named first chapter `三百坂`.
4. Every sampled page is within K-01 chapter 1, before chapter 2 begins at printed p.53.

Therefore the pixels are unambiguously official **canonical entry-volume / first-episode content**, which is sufficient for this Art scope. This audit does **not** claim that the opaque Kobo token is SKU-identical to the frozen representative standard volume 1 ISBN `9784091806017`, does not claim pagination equivalence, and does not replace that representative ISBN. If a later gate is defined as exact frozen-SKU identity rather than canonical entry-content identity, the unresolved token-to-ISBN crosswalk must remain explicit instead of being silently inferred.

## 3. Pixel gate

All captures are temporary 1280×720 RGB PNG screenshots under `/tmp/hidamari/vol1/`; they include the official viewer chrome. Cover, title page, contents page, synopsis, animation, and user opinion were excluded from the Art values. Title and contents screenshots were used only for mapping.

### Counted internal sample

| temporary file | viewer counter | printed pages | context | gate use |
|---|---:|---:|---|---|
| `render-03.png` | `7/63` | 8–9 | chapter-opening historical map and spatial exposition | static |
| `render-04.png` | `9/63` | 10–11 | Edo exterior, streets, architecture, and procession | static |
| `render-08.png` | `17/63` | 18–19 | indoor dojo/social dialogue | static |
| `render-12.png` | `25/63` | 26–27 | outdoor duel setup and first blade action | static + motion start |
| `render-13.png` | `27/63` | 28–29 | continued duel, leap, strike, and impact | static + motion end |
| `render-18.png` | `37/63` | 38–39 | interior dialogue and comic physical interaction | static |

The sample contains 12 readable internal pages. It exceeds the six-page gate and contains at least four distinct contexts: map/spatial exposition, city/procession, indoor social scene, outdoor duel, and later interior interaction.

### Exact motion bounds

`motionImpact` uses only the continuous printed pp.26–29 sequence:

- p.26: confrontation and spatial positioning establish the action start.
- p.27: the blade is drawn and a first sweeping strike is shown with blade trails and speed treatment.
- p.28: the opponents remain in the same confrontation; sword movement, evasive movement, and a renewed attack continue without a scene change.
- p.29: a large diagonal leaping strike, dense speed lines, radiating impact marks, and shattered wood complete the exchange.
- p.30 (`render-14.png`, boundary control) switches to a building/interior conversation, so it is excluded and proves the sequence endpoint.

No disconnected panel was combined with this sequence.

## 4. Local Codex independent values

The comparison anchors are exactly the Factor Dictionary's 0 / 2 / 4 definitions; intermediate values are used only where the observed sample lies between anchors.

| Axis | State/value | Confidence | Pixel-grounded reason | Rejected anchors |
|---|---|---:|---|---|
| `artRealism` | **known 2** | `0.91` | Stable, readable bodies and carefully constructed period environments coexist with pronounced Tezuka-style facial caricature, enlarged features, and comic deformation across both dialogue and action contexts. This matches general stylization. | Not 0 because anatomy, props, architecture, and perspective are consistently functional and detailed. Not 4 because character anatomy and faces are deliberately stylized rather than predominantly realistic. |
| `artDensity` | **known 3** | `0.90` | Fine-lined map information, crowded architecture, costume texture, repeated backgrounds, multi-panel dialogue pages, speed lines, and impact debris recur. Open action fields and some larger close-ups prevent an unconditional high-density 4 across the full sample. | Not 0 or 1 because sparse/white-space-led pages do not dominate. Above balanced 2, but below consistent 4. |
| `visualSoftness` | **known 2** | `0.84` | Rounded faces and clean curves are repeatedly balanced by heavy black masses, firm contours, hatching, angular architecture, and sharp action effects. The cross-context result is neutral. | Not 0 because rough/angular treatment does not dominate the rounded character design. Not 4 because delicate, soft, or polished-miyabi treatment does not dominate. |
| `motionImpact` | **known 4** | `0.93` | The bounded pp.26–29 duel repeatedly emphasizes movement through broad blade trails, radiating speed lines, a large diagonal airborne strike, impact bursts, and broken wood. These are direct strong speed/impact/motion cues, not an inference from genre or synopsis. | Not 0 or 2 because the sequence is neither restrained nor merely ordinary staging; it repeatedly foregrounds speed and impact. |

Final Local vector:

```text
artRealism=2
artDensity=3
visualSoftness=2
motionImpact=4
```

## 5. Hash ledger

### Counted Art files

| file | SHA-256 |
|---|---|
| `render-03.png` | `cf666381b31e8c3cb65a80b519ecbe122aba90ce48aaab99cea88a0c2f923419` |
| `render-04.png` | `1eb1af2a780f1780469ecb864450b223516a5e3cefd74a9e025e32f9c43070aa` |
| `render-08.png` | `e5a0e31cebaf3d41ddc3f1bca57cce8d5a946ff534e8caaae74ea0283f1faa94` |
| `render-12.png` | `e375dc177a324a9f8419f9e7f59d6db1d0fab57d86749194eb51387d6219e14b` |
| `render-13.png` | `8e706ea18c70169513a2fd630d9b4cb3945c6f8f39040b0bad4a98427f92ff19` |
| `render-18.png` | `64057dc5df675db2abceb01427c91a945110544b2bf05b409b78148296710e6b` |

Counted six-file sample-manifest SHA-256: `586d9d9d60f395b051871d0260acdd7a9e2db2df4b4d617ff10d43548817c426`.

### Mapping and sequence-boundary controls

| file | role | SHA-256 |
|---|---|---|
| `render-01.png` | internal title / volume mapping; not Art evidence | `df97826ef1753ed5b6581b7bc7575727ebfd50e327591ca5301a9d1edafd912b` |
| `render-02.png` | contents / chapter and page-range mapping; not Art evidence | `dfa3f0776a4dfbfbebef933cef3f5c416e8cdb1d8579aa6ad6799d82c5b5f795` |
| `render-14.png` | p.30–31 scene-switch boundary control; not counted in motion value | `fd33936275cbf16d1ede8346594b73f5d5e38bfb014039b4551b457778bb882b` |

Nine-file audit-packet SHA-256: `d3dd84fd9559cb4be2d2ed6f15f2b14593af02e07b339f5fffea605adc5b879e`.

Both aggregate digests are hashes of `sha256sum` output, not hashes of concatenated image bytes. Reproduction:

```sh
(cd /tmp/hidamari/vol1 && \
  sha256sum render-03.png render-04.png render-08.png render-12.png render-13.png render-18.png) \
  | sha256sum

(cd /tmp/hidamari/vol1 && \
  sha256sum render-01.png render-02.png render-03.png render-04.png render-08.png \
    render-12.png render-13.png render-14.png render-18.png) \
  | sha256sum
```

The inner serialization is exactly one GNU `sha256sum` line per file in the displayed explicit order:

```text
<64 lowercase hexadecimal characters><two ASCII spaces><basename><LF>
```

No absolute path, NUL byte, or extra manifest header is included.

## 6. Reproducible review route and limits

1. Open H-00 and follow its first Kobo preview link for volume 1.
2. Confirm the K-01 header/internal title says `陽だまりの樹 1`.
3. At viewer counter `5/63`, confirm chapter 1 `三百坂` begins on printed p.7 and chapter 2 begins on p.53.
4. In two-page mode, inspect counters `7/63`, `9/63`, `17/63`, `25/63`, `27/63`, and `37/63` at original readable resolution.
5. For motion only, inspect printed pp.26–29, then p.30 to confirm the scene boundary.
6. Recompute the explicit manifests above and compare both aggregate SHA-256 values.

Limits:

- The Kobo electronic-edition publication date and opaque-token-to-frozen-ISBN crosswalk are not exposed; neither is invented.
- The Art values describe the official first episode / early volume-1 sample, not later-volume stylistic evolution.
- Viewer chrome is present, but every counted printed page is fully readable and the chrome was excluded from judgment.
- No cover, synopsis, animation image, or user review contributed to any value.
- Temporary screenshots must not be committed.

## 7. Promotion/blocker boundary

Art is not a hard blocker. This Local audit supplies four known Art axes, but the project policy still requires Gemini 3.7 Flash High to inspect the same exact hashed pixel packet for quorum. Any disagreement must be adjudicated against the Factor Dictionary and exact page range; values must not be averaged or forced for coverage.

