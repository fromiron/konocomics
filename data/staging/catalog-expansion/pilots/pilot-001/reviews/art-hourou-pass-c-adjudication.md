# 放浪息子 — independent Art Pass C adjudication

## 0. Scope and blind-order ledger

- Work ID: `work-0bec5d8d9474a2197312`
- Canonical title: `放浪息子`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Review date / source access date: `2026-08-23`
- Reviewer: Local Codex independent Pass C
- `reviewedByHuman=false`
- Art scope: official standard electronic volumes 1–3, opening-story pages only
- Repository mutation: none

The Factor Dictionary was read before any proposed model values. All twelve exact PNGs were then opened at original resolution and independently judged. Sections 1–4, including the blind vector, were written before either `/tmp/pilot-art-hourou-local.md` or `/tmp/pilot-art-hourou-gemini.md` was opened. No cover, synopsis, animation image, remembered style, genre inference, or model vote was used.

## 1. Edition and source mapping

The official routes establish a standard-volume chain rather than a special, complete, bunko, or limited edition:

- KADOKAWA standard paper volume 1: <https://store.kadokawa.co.jp/shop/g/g200700002446/> — `放浪息子 1`, 志村貴子, Beam Comics, released `2003-07-25`, ISBN `9784757715226`.
- Official BOOK WALKER series index: <https://bookwalker.jp/series/162/> — connects the completed KADOKAWA/Beam Comics series and its numbered volumes.
- Volume 1 product / official trial: <https://bookwalker.jp/de4bd52269-b4b6-43d8-a916-9cf8c2437a09/> / <https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=4bd52269-b4b6-43d8-a916-9cf8c2437a09>
- Volume 2 product / official trial: <https://bookwalker.jp/de446e1436-912e-4738-bba9-5916bcd3faff/> / <https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=446e1436-912e-4738-bba9-5916bcd3faff>
- Volume 3 product / official trial: <https://bookwalker.jp/de028c9d22-530c-4728-b4d4-f45038f05b0b/> / <https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=028c9d22-530c-4728-b4d4-f45038f05b0b>

The numbered product pages identify `放浪息子 1`, `放浪息子 2`, and `放浪息子 3`, all by 志村貴子, while their distinct official trial CIDs render the corresponding opening pages. The visible printed-page mapping is volume 1 pp. 8–17 and volumes 2–3 pp. 6–18. The adjudicated packet uses four pages from each volume within those ranges. Edition-mapping caveat: the pixel packet is from the official standard **electronic** editions, whereas ISBN `9784757715226` identifies the representative standard **paper** volume 1; the official publisher/store series chain supports work and numbered-volume equivalence, but this review does not claim byte-identical paper printing.

## 2. Exact-pixel integrity and observations

All files are readable internal manga pages at `1850×1937`. Recomputed hashes:

| Official page ref | SHA-256 | Pixel-specific observation |
|---|---|---|
| `v1-p009.png` | `8b5ad01a07e47b421978191139f8f406950b520db0836ca778c02d16f27cbee9` | Home-to-school transition: suited father with children, then teacher/classroom panels with desk/furniture; rounded faces and large clear whitespace areas. |
| `v1-p013.png` | `7b110b796671622cb88feca2ecd328d4f5a43866fbe002062bf1bf72b9b96c01` | Self-introduction sequence with raised hand, windows/ceiling and close face; stipple and solid-black tonal fields replace detailed backgrounds in major panels. |
| `v1-p016.png` | `7fcebbba80f654dcd73468b87e721ae853dd6a27ead657fb450c92b725314443` | Domestic conversation: face close-ups, dining table/cup/chairs and window/door geometry; no depicted physical-action development. |
| `v1-p017.png` | `06250a80889f44881e27788ac3d1e1e7aac9f0d99de3844403680dff854c38c4` | Kitchen/fridge conversation followed by reaction portraits and a separate exterior bicycle-crash **aftermath** tableau; collision start, development and impact are not shown. |
| `v2-p006.png` | `fd863e31daaa4d7b49f56168ff42ffac5e259c5f626276def16e15e0cef64d38` | Winter gift/scarf conversation with family figures, knitted clothing lines and screen tones; simplified figure modelling, little environmental detail. |
| `v2-p010.png` | `a2f35388032489fb7cb1e94748b6548afcd71b795e699a53fcb42fbb60661e52` | School-arrival conversation with noticeboard, building, sky/clouds and utility lines, ending in three frontal reaction portraits. |
| `v2-p015.png` | `3b6e82682539e11c523d772020d81c05191e0e8a70cbaafc36d6adbd57c17995` | Posed character images: paired headshots, full-length sailor uniform and a small three-person view against mostly flat tone/white fields. |
| `v2-p018.png` | `aa022ba47571fcbcc099c716ab36253f82ca6ea3c946bd049ac938056ece0926` | Café conversation with table, chairs, server, drinks and plant; blush/comic reaction and a single motion-smear accent, but no bounded action sequence. |
| `v3-p006.png` | `e790112fa936994f944151278dbfdc5666e5bd7438fa79f59a5d14d02c6981b5` | School telephone/hallway scene with shelves, doorway and tiled/walled corridor; calm talk and walking transition. |
| `v3-p009.png` | `ed2dc6cf8435bb4721d66233a88628f28f2f644b3b8ce5245dfb3a800e2b34f8` | Large venue façade and streetlamp, two walking figures, doorway exchange and floor/event sign; clean perspective but sparse surface rendering. |
| `v3-p014.png` | `0464ca7e963fcbf28d2c78ff843532077f0b9661baf83b0e0cd662f8059146f3` | High-angle building/balcony geometry over conversational seated-group panels; restrained gestures and large unfilled areas. |
| `v3-p018.png` | `cf7619d13c325f135ce2beabd35835bfbc71ad08c533187df2a760498c373d01` | Keyboard/mouse close-up, `コンピュータ室` sign and quiet group dialogue; object contours are clear but lightly rendered. |

Portable packet SHA-256: `84605afa84139ed2d6281846828b2f7435ff40222bcab6445f5986358623e384` (stable basename sort; `basename NUL lowercase-file-sha256 LF`; concatenated byte stream SHA-256). This matches the supplied manifest. The contact sheet was not used as a substitute for the twelve originals.

Static sample gate:

- Readable internal pages: `12/12`
- Volumes represented: `3/3`, four pages each
- Conservative distinct context count: `8` — classroom/school interior; home dining/kitchen; outdoor street/crash aftermath; winter gift/family interior; school exterior/arrival; café; venue exterior/hall; computer room
- Static-axis evidence gate: **PASS** (well above six pages and two contexts)

## 3. Dictionary anchors used

The decision began at anchors 0/2/4; an intermediate value is used only where the sustained sample genuinely lies between adjacent anchors.

- `artRealism`: 0 strong deformation/simplification; 2 ordinary stylization; 4 realistic anatomy/background/proportion.
- `artDensity`: 0 simple with much whitespace; 2 balanced; 4 high line/background/information density.
- `visualSoftness`: 0 rough/angular; 2 neutral; 4 soft/beautiful.
- `motionImpact`: 0 static/restrained; 2 ordinary; 4 strong speed/impact/action; known only from a contiguous physical-action sequence with exact start, development/impact, and endpoint.

## 4. Blind independent vector (frozen before model reports)

| Axis | State/value | Independent anchor finding |
|---|---:|---|
| `artRealism` | **known 2** | Bodies and locations remain spatially coherent, but enlarged eyes, rounded simplified faces, minimal nose/mouth modelling and selective backgrounds are sustained ordinary manga stylization. This is neither the strong deformation of 0 nor the anatomy/surface realism of 4. |
| `artDensity` | **known 1** | The packet repeatedly uses white/flat-tone fields, isolated figures and omitted background detail, while selected establishing panels provide enough classroom, domestic, café and building geometry to rise above anchor 0. Across all twelve pages it remains below balanced anchor 2, so the between-anchor value 1 is warranted. |
| `visualSoftness` | **known 4** | Rounded facial silhouettes, large rounded eyes, fine clean contours, light screen tones, gentle hair/clothing curves and near-absence of rough or angular mark-making persist across all three volumes and contexts. This directly reaches the soft-expression anchor. |
| `motionImpact` | **unknown** | No exact packet interval contains start → development/impact → endpoint of one physical action. `v1-p016`→`v1-p017` are consecutive pages, but they move from domestic dialogue to a bicycle-crash aftermath without depicting the collision; `v2-p018` contains only an isolated smear accent. A low numeric value would incorrectly turn missing conditional evidence into “static.” |

Blind vector: **`[artRealism=2, artDensity=1, visualSoftness=4, motionImpact=unknown]`**.

The motion evidence gate is **not met**, so its correct terminal state is `unknown`; this is not a low score and not by itself a promotion blocker.

<!-- Pass C comparison is appended only after the blind vector above has been frozen. -->

Blind pre-comparison whole-file SHA-256: `8c33d14f2c66d6fe1e39ce65c1f988686b899d56f197cb3d26f339a45a246834` (computed after Sections 0–4 were written and before either model report was opened; the final report necessarily has a different hash after this appendix).

## 5. Model reports opened after the freeze

### Local Codex Pass

- Exact candidate and packet hashes: match.
- Pixel access: reports original-resolution inspection of all twelve files with file-specific observations.
- Proposed vector: `artRealism=1`, `artDensity=1`, `visualSoftness=4`, `motionImpact=unknown`.
- Art hard blocker: none.

### Gemini Pass

- Exact model: `gemini-3.7-flash-high`; resolved label `Gemini 3.7 Flash (High)`; effort `high`.
- Outer run: `SUCCESS`, exit `0`, normal completion; no rate-limit, timeout, incomplete-output, or degraded-output signal recorded.
- Pixel access: proven by all twelve exact hashes and distinct page observations.
- Exact candidate and packet hashes: match.
- Proposed vector: `artRealism=2`, `artDensity=2`, `visualSoftness=4`, `motionImpact=unknown`.
- Art hard blocker: none.

Disagreements are therefore bounded to `artRealism` (1 vs 2) and `artDensity` (1 vs 2). They are resolved below from the Dictionary and exact pixels, not by averaging or majority count.

## 6. Conflict adjudication

### `artRealism`: final **known 2**

- Local `1`: **corrected**.
- Gemini `2`: **accepted**.
- Reason: the 0 anchor requires strong deformation/simplification. The sample does simplify eyes, noses, mouths and some hands, but figures retain ordinary human limb/trunk proportions, clothing drape and stable scale; the school, domestic, café and commercial-building spaces also use coherent ordinary perspective. Those are the sustained markers of **ordinary stylization (2)**. Large eyes and spare facial modelling alone do not place otherwise ordinary manga stylization between strong deformation and 2. The sample is plainly far from realistic anatomy/surface treatment (4), so 2 is the direct anchor rather than an intermediate compromise.

Controlling refs: `v1-p009.png`, `v1-p016.png`, `v2-p010.png`, `v2-p015.png`, `v3-p009.png`, `v3-p018.png`.

### `artDensity`: final **known 1**

- Local `1`: **accepted**.
- Gemini `2`: **corrected**.
- Reason: density is the sustained amount of linework, background and visual information, not merely whether a page is legible or compositionally balanced. Across the packet, close-ups and conversations repeatedly omit settings in favour of white, stipple or solid-tone fields (`v1-p013`, `v1-p016`, `v2-p006`, `v2-p015`), and even pages with establishing geometry commonly return to lightly rendered figure panels (`v2-p010`, `v3-p006`, `v3-p014`, `v3-p018`). The café and venue/building panels supply real environmental information, so anchor 0 (“simple with much whitespace”) is too low as a whole. But those selective details do not make the twelve-page sample sustain balanced background/information density at 2. The observed result is genuinely between 0 and 2, hence **1**; this is not an average of reviewers.

Controlling refs: `v1-p013.png`, `v1-p016.png`, `v2-p006.png`, `v2-p015.png`, `v2-p018.png`, `v3-p009.png`, `v3-p014.png`, `v3-p018.png`.

### Agreed axes checked for consistency

- `visualSoftness=known 4`: **confirmed**. Thin and rounded contours, gentle facial/eye construction, light screentone and curved hair/clothes treatment recur through every volume. Dark hair and clothing masses are tonal contrast, not rough/angular mark-making.
- `motionImpact=unknown`: **confirmed**. The only consecutive listed pair, `v1-p016`→`v1-p017`, omits the bicycle collision itself and shows only its aftermath; `v2-p018` has an isolated smear/reaction accent. Neither supplies exact action start, development/impact and endpoint. No unlisted page may be borrowed.

## 7. Final Pass C disposition

Final Art vector:

```text
artRealism=known 2
artDensity=known 1
visualSoftness=known 4
motionImpact=unknown
```

- Static sample gate: **PASS** — 12 readable official internal pages, 3 entry volumes, 8 conservative contexts.
- Motion sequence gate: **NOT MET** — closed as `unknown`, not pending and not numeric 0.
- Edition identity: **verified with caveat** — official standard electronic volumes 1–3 are mapped to the work and representative standard paper volume-1 ISBN, but electronic-render/paper-print byte identity is not asserted.
- Adjudication status: **resolved**; no remaining Art conflict.
- Art promotion status: **no Art hard blocker**. The three static Art axes may be recorded as known; the conditional motion axis terminates as unknown. Final promotion remains subject to the separate non-Art promotion gates.
- `reviewedByHuman=false`.
- Repository/source/matrix edits: none.
