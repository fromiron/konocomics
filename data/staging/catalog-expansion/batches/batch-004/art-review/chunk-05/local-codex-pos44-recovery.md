# Batch 004 Art recovery — chunk 05 position 44 — Local Codex

- reviewDate: `2026-08-25`
- reviewer: Local Codex independent original-pixel review
- reviewedByHuman: `false`
- workId: `work-e2f095e08fc5e08d5a2b`
- canonicalTitle: `高嶺と花`
- scope: Factor Dictionary static Art axes on the corrected six-frame recovery sample
- Gemini / Grok / other model Art values: not consulted
- promotion: not performed
- adjudication: not performed
- image root: `/tmp/konocomics-batch004-art-recovery-pos44-round1`
- repository image mutation: none

## Input bindings

| Input                                                  | SHA-256                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                    | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `frozen-work-set.csv`                                  | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `recovery-pos44-preflight.csv`                         | `88505a92f3253ca1c2aadaeca2fcc6daa973e91a3cebc13a23f63985449dc334` |
| `recovery-pos44-ledger.md`                             | `083c57069da586dcbeb7ff63255f957b7c36587ec6c225cac959b635b1c81151` |
| `daybreak-art-preflight-qa-chunk-05-pos44-recovery.md` | `c26efe6524c8b50575fbb2adb52ef870f4c91d939b9940d1b193dde02e53b134` |
| official Hakusensha product HTML                       | `8967761b4a43e529cef253cde583cca5f4f6458cb35cb18b96561d95d27e6389` |
| official reader `face.xml`                             | `084f549a10edc520b4be1f502512dc247ef59830cb49a592a10fab823346656a` |

The frozen work identity is `高嶺と花` by `師走ゆき`. The retained Hakusensha product HTML identifies standard volume 1, ISBN `9784592213512`, release date `2015-03-20`, and directly links preview JDCN `59221351takaneX00111`. The linked official reader's `face.xml` reports 193 pages and the first story at reader page 4. No special edition, set, retailer sample, cover, or animation image supplied an Art value.

Official references:

- product: https://www.hakusensha.co.jp/comicslist/46600/
- internal preview: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221351takaneX00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D46600
- retrieval and review date: `2026-08-25`

## Original-pixel access proof

`SHA256SUMS` passed for the complete temporary bundle. All six exact RGB PNGs were opened directly at original `1280 × 720` detail. Each frame contains at least one readable story-body leaf. The right-hand author-introduction leaf in `hakusensha-reader-page-07` was explicitly excluded; only its left-hand story leaf was evaluated.

| Ref                         | SHA-256                                                            | Direct pixel observation                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hakusensha-reader-page-07` | `8c80ef213245f7b96c338b05bbcf316ba24eeea2f61ed352f7c7ff001ee10aab` | Eligible left leaf shows the restaurant introduction with formal clothing, faces, furniture, patterned kimono, and small comic-reaction figures; adjacent right frontmatter leaf excluded. |
| `hakusensha-reader-page-09` | `07bcdcfe2074e38c40bb70f19e71d53be536abebb6f0b2139f79b0839a066997` | Character introductions and family setup show full-body proportion, clothing, flowers, domestic geometry, chibi inserts, and broad white fields.                                           |
| `hakusensha-reader-page-11` | `ab12a0518883042c1cadbbcecd8d2eef229a4d083cb9a39680dea865d78a2185` | Formal meeting-table dialogue combines furniture and observed adult bodies with clean close-ups, screentone, sparkle, and compressed comic reactions.                                      |
| `hakusensha-reader-page-13` | `cd7ae3904292865167c3035cf338e54564d5b58c9e788fc0ed578283a33c2fd8` | Meeting escalation and school recollection show patterned dress, flowing hair, dark facial modeling, classroom cues, emphasis lines, and simplified background fields.                     |
| `hakusensha-reader-page-15` | `950eaca334d28f65d98a4e3f5543262e5b86e79e657012df57fb42a9377e186c` | School and car scenes provide uniforms, full figures, vehicle rendering, house exterior, smooth facial lines, decorative fields, and deliberately open panels.                             |
| `hakusensha-reader-page-17` | `d1946f0d29b76100d259fc68b3129a91c1a603d945af50fc3dd8693896204cd6` | Restaurant and clothing-preparation pages show interiors, a phone, outfits, a house, strong black masses, screentone, and rounded expressive faces.                                        |

The eligible sample spans the formal restaurant meeting, school/classroom and transit, and restaurant/home preparation contexts. It satisfies the static six-page and two-context gate.

## Independent Art decision

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`. `U` means `unknown`, not a low value.

| Art vector      | Confidence               | Pixel-grounded decision                                                                                                                                                                                                                                 |
| --------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2 / 2 / 3 / U` | `0.90 / 0.88 / 0.89 / —` | General stylization persists despite coherent bodies and spaces; panel information stays balanced between decorated detail and open dialogue fields; clean rounded linework and polished shoujo rendering lean soft without reaching a uniform extreme. |

The Factor Dictionary `0 / 2 / 4` anchors were applied first. `artRealism=2` is supported because plausible bodies, hands, clothing, vehicles, and interiors coexist with enlarged eyes, idealized figures, simplified facial planes, and recurring chibi deformation. `artDensity=2` is supported because clothing patterns, screentone, flowers, furniture, exteriors, and emphasis marks repeatedly balance wide white fields, close-ups, and simplified backgrounds. `visualSoftness=3` is between neutral and fully soft: tapered lines, flowing hair, floral decoration, and smooth tones persist, while angular male hair, hard blacks, and sharp comic emphasis reject value 4.

## Motion boundary

The independently verified preflight sets `motionGateAttemptable=false`. The selected frames are spaced snapshots and do not preserve an exact continuous start, development, impact, and resolved endpoint. Isolated gestures, comic effects, or a car image were not converted into a numeric value. `motionImpact` remains `unknown`.

## Output boundary

- output CSV rows: `4` plus header
- known static rows: `3`
- unknown motion rows: `1`
- reviewedByHuman: `false`
- source, generated catalog, aggregate `final-art.csv`, and promotion state: unchanged
- temporary images committed: `false`
