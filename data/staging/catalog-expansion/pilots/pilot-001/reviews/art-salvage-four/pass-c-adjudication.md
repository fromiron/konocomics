# Pilot Art 0/4 salvage — four-work independent review and Pass C adjudication

## 1. Result

- Date/accessedAt: `2026-08-23` (Asia/Tokyo)
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Dictionary: current `docs/factors/factor-dictionary.md` Art anchors (`0/2/4`, with `1/3` only between anchors)
- Static gate: six readable official internal pages and at least two distinct contexts per work
- Motion gate: `known` only for an exact continuous start → development/impact → endpoint passage
- Local blind freeze: completed before any valid Gemini result was read; SHA-256 `b5adf60dae4cf103aa703824a12ef97b6882ace5cb087f302b7a1bd0839d691b`
- Independent Gemini: exact `gemini-3.7-flash-high`, resolved `Gemini 3.7 Flash (High)`, effort `high`; only outer `SUCCESS` runs count
- `reviewedByHuman=false`
- Repository/source/matrix edits: none; all artifacts are under `/tmp`

| Work | Final Art vector (`realism/density/softness/motion`) | Gate | Art hard blocker |
|---|---|---|---|
| 漂流教室 | `3 / 4 / 0 / 4` | static pass; motion pass | none |
| 11人いる！ | `2 / 3 / 3 / unknown` | static pass; motion explicitly closed unknown | none |
| うる星やつら | `1 / 2 / 2 / 4` | static pass; motion pass | none |
| YAWARA！ | `3 / 2 / 2 / 1` | static pass; motion pass | none |

The CSV sibling `/tmp/pilot-art-salvage-4-adjudication.csv` contains one machine-readable row per work/axis, including exact confidence for every known value.

## 2. Blind sequence and model provenance

1. The current Factor Dictionary was read first.
2. Local Codex inspected the twelve requested `1280×900` screenshots at original resolution and froze its values, page-specific observations, motion bounds, and edition limitations in `/tmp/pilot-art-salvage-4-local-freeze.md`.
3. No Local values were supplied to Gemini. Each Gemini request received only its work packet, exact hashes, official product URL, edition/scope statement, and frozen dictionary/gate rules.
4. Pass C was performed only after the valid Gemini responses were complete. Conflicts were resolved against pixels, dictionary anchors, and edition/range scope—never by averaging or vote.

### Execution ledger

| Attempt | Route/model | Outer result | Disposition |
|---|---|---|---|
| 漂流教室 direct attempt 1 | `opencode run -m opencode/gemini-3.7-flash --variant high` | shell exit `1`; variadic `--file` consumed trailing message | invalid; no model response |
| 漂流教室 direct attempt 2 | same direct OpenCode model | shell exit `1`; HTTP `401 CreditsError`, no payment method | invalid; model never started |
| 漂流教室 `agy` attempt 1 | `gemini-3.7-flash-high`, effort high | outer `ERROR`; sandbox connection reset | excluded in full despite generated text |
| 漂流教室 `agy` retry | exact model above | outer `SUCCESS`; conversation `910d0f1b-0000-4da1-a867-1ebe9ac91990`; 33.989 s | counted |
| 11人いる！ | exact model above | outer `SUCCESS`; conversation `35ecb579-a565-4582-84a9-8b7cb4aa8ad2`; 64.810 s | counted |
| うる星やつら | exact model above | outer `SUCCESS`; conversation `8c6ef5a4-b6c7-43cb-a383-d5c7d96cd799`; 77.869 s | counted |
| YAWARA！ | exact model above | outer `SUCCESS`; conversation `2fd75286-e76c-49cd-b662-0b8a253c1c7d`; 61.358 s | counted |

The approved project route is `agy --model gemini-3.7-flash-high --effort high`. Every counted response returns the exact model identity and resolved label, `completionStatus=completed`, the frozen candidate/work identity, all three correct hashes, three distinct image observations, `reviewedByHuman=false`, and no timeout/rate-limit/degraded-output signal.

Two object-level Gemini details are discarded: the 漂流教室 response calls the mother's pointing arm on printed p.18 a knife, but original pixels show no knife; the 11人いる！ response calls the grayscale airlock/corridor rendering orange lighting, although no color is visible in the supplied PNG. The remaining page-specific structures/actions and all hashes are correct and non-generic, so direct pixel access remains demonstrated, but neither false detail is used as evidence.

## 3. Source and edition registry

All product pages are undated live official listings unless a year is stated below; access date is `2026-08-23`.

| Work | Official source | Product/edition | Entry mapping and limitation |
|---|---|---|---|
| 漂流教室 | 小学館eコミックストア, <https://e-comi.shogakukan.co.jp/books/091931710000d0000000> | `漂流教室〔文庫版〕 1`, JDCN `091931710000d0000000` | Official title/author and entry opening map to the canonical work, but this is a bunko alternate edition, not frozen representative standard ISBN `9784091200013`. Values are broad entry-volume traits only. |
| 11人いる！ | 小学館eコミックストア, <https://e-comi.shogakukan.co.jp/books/091910110000d0000000> | official one-volume `11人いる!`, JDCN `091910110000d0000000` | Mapping-only official TOC places original story at p.3, sequel at p.125, and `スペース ストリート` at p.285. Requested pages 8–13 are the original opening. |
| うる星やつら | 小学館eコミックストア, <https://e-comi.shogakukan.co.jp/books/091207160000d0000000> | `うる星やつら 〔新装版〕 1`, JDCN `091207160000d0000000` | Official new-edition volume, not frozen representative standard ISBN `9784091204417`; packet visibly starts the original first story. Broad line/panel traits only; restoration/reproduction may be edition-specific. |
| YAWARA！ | 小学館eコミックストア, <https://e-comi.shogakukan.co.jp/books/091813410000d0000000>; ISBN endpoint <https://shogakukan-comic.jp/book?isbn=9784091813411> | `ＹＡＷＡＲＡ！ 完全版 デジタル Ver. 1`, JDCN `091813410000d0000000` | Frozen ISBN endpoint returns HTTP 301 to this JDCN. Official description says the 2014–2015 20-volume complete edition had additions/corrections and full color restoration, then was re-edited into 29 digital volumes. Values describe this official entry sample, not identical paper reproduction. |

## 4. Exact pixel packet

### 漂流教室 — `work-98d513b70560f2f96a38`

| Viewer refs | SHA-256 | Context |
|---|---|---|
| `pages-8-9.png` (printed pp.6–7) | `e8769145972c62659ff5b0c502e92ff46a729fdcfb78a85031a96d255c297b18` | toy display and city crossing |
| `pages-20-21.png` (printed pp.18–19) | `73803487f2b6c82f42a4d2f305eb09cef9038bcca247f3dc22474d4ea001c05d` | domestic conflict, tablecloth/dishes, stairs, desk drawers |
| `pages-32-33.png` | `6769033ea8fe29cbf29042ee1a87a0acac29c014e44b67386849eba74edbad99` | exterior anomaly/catastrophe spread |

Pass C:

- `artRealism=known 3`, confidence `0.83`: Local `3`, Gemini `2`. Characters retain visibly stylized large eyes and dramatic faces, but natural body proportions plus consistently perspective-accurate streets, shop windows, interiors, hands and props place the packet between ordinary stylization `2` and realistic anatomy/background/proportion `4`.
- `artDensity=known 4`, confidence `0.90`: agreement. Toy shelves, street surfaces, drawer contents, repeated hatching/tones and the anomaly spread sustain the high-density anchor.
- `visualSoftness=known 0`, confidence `0.94`: agreement. Hard contours, heavy blacks and jagged hatching anchor at rough/angular `0`.
- `motionImpact=known 4`, confidence `0.89`: agreement after factual correction. Exact sequence is printed p.18 in `pages-20-21.png`: start—mother argues/points and the boy grasps/pulls the tablecloth; development/impact—dishes and objects are launched/fall with radiating speed emphasis; endpoint—the boy runs upstairs while the mother reacts and fallen items remain. The p.32–33 anomaly spread independently confirms strong motion/impact rendering. No knife is present.

### 11人いる！ — `work-f50fa290eb4116a7078e`

| Viewer refs | SHA-256 | Context |
|---|---|---|
| `pages-8-9.png` | `a29efba575dc7ab660ddc5d1e603f08ffeebb9ceec5bd27533bb2ede15e28c20` | capsule examination hall and terminals |
| `pages-10-11.png` | `db6f872bf3f796dc41c549550209088a6fd783c87ba34379c02a2eb5e937b9c4` | B63 briefing and ship reveal |
| `pages-12-13.png` | `b7bf8706baf3b83768e198ed3d6dc510cc5de63418591e8e3e3a79e04c435dbc` | zero-gravity ship exterior and airlock entry |

Pass C:

- `artRealism=known 2`, confidence `0.86`: Local `3`, Gemini `2`. Perspective and body staging are controlled, but elongated figures, facial simplification, large eyes and lyrical shōjo rendering remain the dominant overall treatment; ordinary stylization `2` is the responsible packet anchor.
- `artDensity=known 3`, confidence `0.87`: agreement. Complex pod geometry, checkerboard perspective, machinery and starfields exceed balanced `2`, while dialogue/briefing panels prevent a sustained `4`.
- `visualSoftness=known 3`, confidence `0.86`: agreement. Fine curved contours, flowing hair, atmospheric washes and rounded structures sit between neutral `2` and soft/beautiful `4`.
- `motionImpact=unknown`: Local proposed known `0`, Gemini unknown. The full-page exterior shows candidates already mid-flight; following panels show approach and hatch entry, but the packet does not show the initiation/start of that same movement. Because the strict gate needs all three phases, this closes as unknown rather than using a restrained-motion value. Art unknown is not a blocker.

### うる星やつら — `work-a089c0eef91d1213da38`

| Viewer refs | SHA-256 | Context |
|---|---|---|
| `pages-6-7.png` | `e881869776d3349967c4110ab1d188df5ca0786cf8fdd8c7a1933a5c0c6ada2f` | neighborhood/bridge argument and river fall |
| `pages-14-15.png` | `3778c15d7e99505aa4c87b64f94337dde2845a503e0ab567b0fef81f21fb9106` | public tag-match start, leap and landing |
| `pages-22-23.png` | `be08f55007986956d11b60f001e2101878504041fa442ccfd62e130b4f82a8a6` | eaves struggle/fall and next tag attempt |

Pass C:

- `artRealism=known 1`, confidence `0.90`: agreement. Natural base proportions are repeatedly pulled toward elastic bodies, caricature faces and slapstick deformation, between strong simplification `0` and ordinary stylization `2`.
- `artDensity=known 2`, confidence `0.82`: Local `3`, Gemini `1`. Blank comedy/dialogue backgrounds coexist with crowded stadiums, legible architecture, many panels, SFX and full fields of speed lines. Across all six pages the balanced `2` anchor fits better than either sparse `1` or high `3`.
- `visualSoftness=known 2`, confidence `0.86`: agreement. Rounded clean contours are neutral—neither rough/angular nor delicate/ethereal.
- `motionImpact=known 4`, confidence `0.91`: Local `4`, Gemini `2`. Exact pp.14–15 sequence: start—starter signal and Ataru's sprint; development/impact—Lum launches into a large diagonal speed-line field while Ataru lunges through; endpoint—Lum lands and Ataru skids/turns to continue pursuit. The full-page scale, radiating lines and strong body diagonals reach the strong-emphasis `4` anchor; independent bridge splash and eaves/tag sequences support that packet-level treatment.

### YAWARA！ — `work-14e489bf1afd1587c44a`

| Viewer refs | SHA-256 | Context |
|---|---|---|
| `pages-8-9.png` (printed pp.4–5) | `9263e39d58e55e6907405025bb621cdd612d6c7bd47d9667ddce36d13bfb080e` | color-restored city/reporting/purse-snatcher setup |
| `pages-14-15.png` (printed pp.10–11) | `10019c36357d8a976a3e90797de7cfe13b1514c9e02d7a3782fc05d024ce3fef` | dojo dialogue, newspaper and magazine reveal |
| `pages-22-23.png` (printed pp.16 and 19 visible) | `fe88678ab2bf6991bd12011fa3b1568c91066e2328b86ed79edaa84b1d8b1e9a` | gate opening; street surveillance/confrontation |

Pass C:

- `artRealism=known 3`, confidence `0.83`: agreement. Natural anatomy/clothing plus accurate city, dojo and street perspective sit above ordinary stylization, while comic faces keep it below `4`.
- `artDensity=known 2`, confidence `0.84`: agreement. Selective architectural detail and screentone balance clean negative space.
- `visualSoftness=known 2`, confidence `0.82`: agreement. Controlled rounded contours and smooth tones are neutral.
- `motionImpact=known 1`, confidence `0.72`: Local `1`, Gemini unknown. Printed p.16 within `pages-22-23.png` contains a complete mechanical motion: start—Jigoro grasps/pulls the hanging chain; development—repeated `ギリギリ` marks accompany the rising/sliding gate; endpoint—the gate is fully open and the empty dojo is revealed. The movement is clearly bounded but restrained, so it lies between static/restrained `0` and ordinary `2`. The disconnected purse-snatcher and arm-grab setups are not used.

## 5. Final gate and limits

- Static sample gate: `PASS` for all four.
- Motion state: three known (`漂流教室=4`, `うる星やつら=4`, `YAWARA！=1`), one explicitly closed unknown (`11人いる！`).
- Edition mapping: qualified with explicit alternate/digital-edition limitations; no packet is silently treated as identical to a different print edition.
- Art hard blockers: `0`.
- `reviewedByHuman=false` for every row. This is model-panel evidence, not human validation.
- These files do not authorize promotion, edit the source catalog, or mutate the Art matrix.

## 6. Immutable execution artifacts

| Artifact | SHA-256 |
|---|---|
| Local blind freeze | `b5adf60dae4cf103aa703824a12ef97b6882ace5cb087f302b7a1bd0839d691b` |
| 漂流 prompt | `216549d175a88319177c69881aebdd2b9dd4060ac9163044565c08cfed015d8d` |
| 11人 prompt | `9e1983307e6b3384a2aa1aae50d5e2b9c2870057f0ed6343d1a7d82c0f738601` |
| うる星 prompt | `6d295f90c294fe322bec0d7792ecfb0d95e4f49df4305f989e6b638b46f0d304` |
| YAWARA prompt | `315e69c781726d3dfe97ae04c6d55b802f2988acd1452b49a76b23d74117797a` |
| direct OpenCode argument-error stdout | `45db726a3660e9bf7fa74e5200b6d25db1c858b62c8ed6e985fb9a882c638175` |
| direct OpenCode 401 stdout | `23407f019cc14f488f10c6fb39afbf11192a1b78c00fc34116f74fe15f3804fd` |
| excluded 漂流 `agy` stdout | `2d09607a7c4f5479d200d0f7e2327730724adff4c432c4e6cb92afe5db79ba61` |
| counted 漂流 `agy` stdout | `5c975ee3946b2d73d9c84036ae9cc620639479ffba547cbf445bb4779d60e7fd` |
| counted 11人 `agy` stdout | `be64030a36e24e290ba5dc5c24b8d7df607d5e2fe5f781cbb3876892f2290db0` |
| counted うる星 `agy` stdout | `8aedbdc0a90099660b2c38adb29a87a9beb3111796c7fa056c71cfdecc2296c4` |
| counted YAWARA `agy` stdout | `dfe94f740a730e79080d02855191aea52f3d36c34ef9f8e374ace3cd29581d65` |
| counted 漂流 CLI log | `1314073351a0bbfb453213b4b27411a7f9038c8197636cce2cb0d0214edd1646` |
| counted 11人 CLI log | `6c66afbaf1f729b61115ec2179a0dc750bd743f56b4d5b38dad7b8263fada211` |
| counted うる星 CLI log | `5229643cd03f81dc6c97af0efe8156e8da4ff340f1960ae32fd1bd2eea28ae37` |
| counted YAWARA CLI log | `9a7cdd0ee4cbff4fbc2d160a0c8f18cf047426d302b48e82345e958e9318389f` |
