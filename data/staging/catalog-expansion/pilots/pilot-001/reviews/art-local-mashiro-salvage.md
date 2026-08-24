# Pilot 001 Art salvage audit — ましろのおと

- Audit date / retrieval date: 2026-08-23 (Asia/Tokyo)
- Repository HEAD inspected: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Work ID: `work-3823ff0766f67c015c53`
- Canonical title: `ましろのおと`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Scope: Art-only Local Codex salvage re-audit; no repository files were edited.
- Pixel access: **YES**. A real browser opened the official reader, and Local Codex directly inspected the rendered PNGs at original resolution with `view_image(original)`.
- Prohibited inputs: no cover, animation image, synopsis, or user Art opinion was used to assign an Art value. The cover and front matter were observed only to establish reader order and were excluded from the sample.

## 1. Prior state and controlling gate

The current-SHA `art-final-matrix.csv` closes all four Art axes as `unknown` because the earlier packet did not contain an official internal-page preview URL. The current-SHA local audit explicitly allows reopening when Kodansha supplies a volume-1/entry preview. The newly supplied official trial removes that factual access blocker.

The gate applied here is the current `promotion-evidence-v2` contract:

- static Art requires at least 6 readable official internal pages and at least 2 distinct scene contexts;
- `motionImpact=known` additionally requires an exact, bounded start-to-end continuous action sequence;
- a value may not be inferred from a cover, animation, synopsis, or user review;
- Local output is only one side of the Local/Gemini Art quorum and does not by itself authorize a source-data or final-matrix change.

## 2. Official edition and entry-window mapping

### Stable official routes

| Volume | Official Kodansha route | Official title | Paper ISBN | Paper release | Edition finding |
|---|---|---|---|---|---|
| 1 | <https://www.kodansha.co.jp/comic/products/0000043275> | `ましろのおと（１）` | `9784063712612` | 2010-10-15 | normal paper product, format `新書`; no special-edition descriptor |
| 2 | <https://www.kodansha.co.jp/comic/products/0000043280> | `ましろのおと（２）` | `9784063712667` | 2010-12-17 | normal paper product; official previous/next chain links volumes 1 and 3 |
| 3 | <https://www.kodansha.co.jp/comic/products/0000043295> | `ましろのおと（３）` | `9784063712810` | 2011-04-15 | normal paper product; official previous link is volume 2 |

The Pilot source row independently identifies volume 1 ISBN `9784063712612` as the representative standard edition and sets the evaluation range to `entry_1_3_volumes`. The official product chain therefore establishes a standard volume-1–3 sequence, not a special, complete, bunko, or limited edition.

### Trial route and reader identity

- Stable trial URL: <https://www.kodansha.co.jp/comic/products/0000043275/trial>
- Reader URL reached during this audit: <https://www.kodansha.co.jp/comic/products/0000043275/trial/reader?cid=cc7f20445b26bf1544c736ab4ac89f048542935ff53849ab6e84f253c6074ef4>
- Official content endpoint observed in the reader: <https://dvs-ebook-provider.kodansha.co.jp/files/0637126100100011000N/a561a271-d363-4bc5-929d-f3cc8602ad8d/data/content>
- Reader bibliography response identifies the product as `ましろのおと（１）`, content ID `a561a271-d363-4bc5-929d-f3cc8602ad8d`, and the same Kodansha content server.
- The content response identifies title `ましろのおと（１）`, author `羅川真里茂`, publisher `講談社`, leftward page progression, `IsTateyomi=false`, `SmlImageCnt=51`, content date `20250314190519`, and source dimensions `1070×1600` in the TTX. Its table of contents identifies `Track 0` as the displayed entry episode.
- The content path stem `0637126100100011000N`, product route, reader title/creator/publisher, and official product ISBN jointly bind this reader to standard volume 1. It is within the declared first-1–3-volume evaluation range.

Retrieved source-response hashes (exact bytes fetched in this audit; HTML includes request-specific material and is not claimed as a cross-request stable digest):

```text
c1d65719ecb0255cc343b75bcb44d381f96c2105160bfdb8f1b32733a7093590  bib-info-response.json
ab0b02aaddbbdad523afc82272f1d78daa5806c2adfd6d5f8d9ae8fb6325186f  content-response.txt
bc26af7a9351d5da7ab30173c8a200357c03cc65f6f30254f45cce22556f9716  content.ttx
8f5f478c9a910178a89238495b06d2e3f5366075cd04d5ce0311d30cec139e80  vol1-product.html
522ca48ec27005490aa3fe86ca5bc82bf6a7fc305d28ca04cf720052df97bf0f  vol2-product.html
16456bf0be3d0801c47711bc0f53b604b3690869dfd9d1253605122ef4388166  vol3-product.html
```

## 3. Reader states, sample, and reproducibility

The browser viewport was `1280×720`. `state-000` is the cover. Subsequent state numbers are the exact number of leftward reader transitions from that initial cover. The official reader displays two full internal pages per selected state. The TTX page IDs corresponding to the observed reader order are included below.

| Reader state | TTX page IDs | Included? | Directly observed context |
|---|---|---|---|
| `state-004` | `P0009–P0010` | yes | urban exterior/night architecture and character interaction |
| `state-006` | `P0013–P0014` | yes | full-body street/storefront scene, clothing and city detail |
| `state-009` | `P0019–P0020` | yes | Tsugaru-shamisen playing, older body/hand/instrument detail, comic reaction |
| `state-013` | `P0027–P0028` | yes | shamisen close-ups and apartment/interior staging |
| `state-018` | `P0037–P0038` | yes | outdoor movement/conversation, clothing texture and close-ups |
| `state-024` | `P0049–P0050` | yes | dawn apartment/private emotional scene, kneeling body, room perspective and hand close-up |

- Static adjudication sample: **12 readable internal pages** (6 two-page states).
- Distinct scene contexts: **at least 3**: urban/exterior movement and conversation; shamisen performance/instrument handling; domestic/interior emotional staging.
- Static gate result: **PASS** (`12 >= 6`, `3 >= 2`).
- Broader reader verification: 25 distinct rendered content states were captured as `state-000` through `state-024`; the next transition reaches Kodansha's purchase/end screen and is excluded.

Individual selected-state SHA-256:

```text
994fff430ac28b3d0a5d1c6c87258fc7f52eb121fe762b8f3ddce39dbfa60130  mashiro-state-004.png
7ecc0cbfa124a00666b206ca447b7d4731fd970a7e6bd12a5e1bfc2b4db04c20  mashiro-state-006.png
591fc5820b981072500790180047d053b86a3664ac9237fe1ace635dbdf92dff  mashiro-state-009.png
3de7c139df3b99bb6e5c8e2439c6e8b46ac8d57364fd86b8220fc94b322789c2  mashiro-state-013.png
8b8c71c58ab98be2cc3bf9a9174c95ac581e5939a3b67ee3b8e0526a6f8d84e4  mashiro-state-018.png
10706cd51b3a0874bc54d986987aae51e775783c3ece8d85f6170a6bc2d0440c  mashiro-state-024.png
```

Portable packet algorithm: sort by stable basename; for each file emit UTF-8 `basename`, one NUL byte, its lowercase 64-hex file SHA-256, then LF; concatenate the six records and SHA-256 that byte stream. Absolute paths and timestamps are not included.

```text
b35252362427e4636a3b417261271e748816c9ab50d2b63dbbc3390b1dee4872  selected 6-state / 12-page adjudication packet
dcdb416a672b2a5257c85a458bcf8d88876f5720f6c723e972ec6e4fac35808e  state-000..state-024 full render-state packet
```

Temporary packet location for the current session only: `/tmp/pilot-mashiro.0lIwd8/`. It is outside the repository and must not be committed.

## 4. Local static-Art decisions

### `artRealism=known 3`

Direct observations across all six selected states:

- adolescent and adult anatomy, aging, hands, seated/kneeling poses, clothing folds, room perspective, storefronts/buildings, and the shamisen's body/strings/bridge are consistently constructed with plausible proportion and material detail;
- the work still repeatedly uses enlarged stylized eyes, expressive face deformation, and comic/chibi interruption.

This is more realistic than the dictionary's ordinary-style anchor `2`, but the sustained stylization prevents the fully realistic `4` anchor. Value `3` is the supported between-anchor result.

### `artDensity=known 3`

Direct observations:

- urban architecture, furniture, clothing patterns, instrument hardware, screentone, snow/atmosphere, and multi-panel information frequently exceed a merely balanced page;
- performance and emotional pages deliberately use large white or black negative-space fields, so density is not consistently maximal.

This is between balanced `2` and high line/background/information density `4`: value `3`.

### `visualSoftness=known 3`

Direct observations:

- fine flowing hair and facial lines, delicate gray/screentone transitions, snow/light effects, and elegant emotional close-ups repeatedly make the rendering softer than neutral;
- bold black blocks, speed hatching, angular accents, and comic deformation remain substantial, so the sample does not sustain the dictionary's strongest soft/beautiful anchor `4`.

This is between neutral `2` and soft/beautiful `4`: value `3`.

## 5. `motionImpact` recheck

Additional original-resolution inspection covered contiguous reader states `012–015` and `021–024`. The exact portable packet digest for those eight state files is:

```text
a97eb62b0e5d2ab6a557d079787b6a1b48af18c98a94568b8bc4e6c7282e988e  motion recheck states 012,013,014,015,021,022,023,024
```

Observed dynamic material includes an isolated forceful grab/lunge panel (`state-013`), a later stand/exit pose transition (`state-022`), and an isolated running panel (`state-023`). These do not provide one representative action with a clearly bounded visual start, continuous development, and resolved end from which speed/impact can be responsibly rated. A sequence of conversational pose changes is not promoted into a motion value merely because adjacent pages exist.

- Local result: **`motionImpact=unknown`**.
- This is not value `0`, and it is not a promotion blocker.
- Reopen only if an official standard-edition volume-1–3 interior supplies a clearly bounded continuous playing, running, confrontation, or other dynamic sequence with exact start/end refs.

## 6. Final Local result and authorization boundary

| Axis | Local state | Local value | Gate outcome |
|---|---|---:|---|
| `artRealism` | `known` | 3 | static sample qualified |
| `artDensity` | `known` | 3 | static sample qualified |
| `visualSoftness` | `known` | 3 | static sample qualified |
| `motionImpact` | `unknown` | — | no adequately bounded continuous dynamic sequence |

The former `preview-unavailable` reason is factually obsolete because the official volume-1 trial is accessible and qualified. This Local pass nevertheless **does not authorize** changing `art-final-matrix.csv`: the same six-image packet still requires an independent Gemini 3.7 Flash High pixel review and any disagreement must be adjudicated against the Factor Dictionary and exact refs. Grok is outside the Art quorum unless it proves actual pixel access.

Art contributes no hard blocker here. Static Art now has an evidence-backed Local candidate; `motionImpact` is explicitly and terminally `unknown` for this packet. Repository modifications made by this audit: **none**.
