# Batch 004 Art adjudication chunk 04

- adjudicationDate: `2026-08-25`
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: `false`
- method: original-pixel Factor Dictionary adjudication; no averaging or vote
- Muse: `NOT_USED`
- Cursor Grok: `ART_ABSTAIN`
- temporaryImagesCommitted: `false`
- hardBlockers: `0`

## Counted inputs

| Input | SHA-256 | Result |
| --- | --- | --- |
| Preflight CSV | `f0574f648a2318121bf7750e7151cb0000d3928a09657273991bf2d1309ed765` | one sample-ready and nine unknown-ready works |
| Preflight ledger | `dc427da1b1f95602fa5ccfc91d9a842d0faf740907a00843e9ffabbce9a542f0` | official edition, refs, and six image hashes frozen |
| Local Art CSV | `d8b8cd4f402d6d6391e52d5b3ff5ffcd7c297a1ce066b34fbb5fcd221e90fe85` | 40 terminal cells; completed before Gemini |
| Local report | `be0267ddbebff07644ed1a5fda8c75c835d5a4c517f75960641637f94cddca69` | independent Local pixel observations |
| Gemini request | `96af631354c3489bf11637e79261b92506e7a24a8bef8edb3e0802e6d5ce7dda` | exact independent frozen request |
| Gemini response | `c82a7442d207a2bfcae7eb9d04d31be59e39149a78d08a74b2693729e3a8cabf` | exact model, outer success, 6/6 original pixels |
| Gemini execution ledger | `ad3c0d7f65a43eea78c2a0e5a729e932d765f0aaf2e7ec4354752e205b6b259a` | failed attempts excluded; one exact successful run counted |

The authorizing Gemini run resolved `gemini-3.7-flash-high`, effort `high`,
matched every frozen hash, inspected all six original PNGs, returned 40
terminal cells, and ended `SUCCESS`. Local conclusions were hidden from
Gemini. No user review, cover, synopsis, animation, Genre, or text Factor was
used for Art.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal unknown, never low or an Art-only blocker.

| Work | Local | Gemini | Final | Dictionary and pixel decision |
| --- | --- | --- | --- | --- |
| 邪神の弁当屋さん | `1/1/3/U` | `0/0/4/U` | `1/1/3/U` | Deformation is strong for the heroine and chicken but not uniform for the elongated customer, so realism falls between 0 and 2. Masonry, stalls, fortifications, props, and screentone add real information while wide portrait/dialogue fields remain sparse, so density falls between 0 and 2. Rounded clean contours dominate, but the customer's angular construction, monument, and architecture keep softness below the all-context endpoint 4. No exact continuous action sequence opens motion. |
| 働かないふたり | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | No eligible internal sample. |
| あした死ぬには、 | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The linked reader route was outside the trusted registry. |
| ドカ食いダイスキ！ もちづきさん | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The linked reader route was outside the trusted registry. |
| ディグイット | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | One body page fails the six-page and two-context gate. |
| 坂本ですが? | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The exact product-linked viewer timed out in bounded preflight. |
| 来世は他人がいい | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | One body canvas fails the six-page and two-context gate. |
| カラオケ行こ！ | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The exact product-linked viewer timed out in bounded preflight. |
| となりの猫と恋知らず | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | No product-linked entry chapter bridge was exposed. |
| カッコウの許嫁 | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | One body page fails the six-page and two-context gate. |

## Resolution

The final matrix contains 3 known and 37 unknown cells. No endpoint is retained:
the selected contexts support intermediate `1/1/3` more precisely than
Gemini's `0/0/4`. All motion cells are unknown. No Art unknown became a
blocker, and no temporary image, source row, generated artifact, recommendation
formula, validator, Factor Dictionary, or Gold value was changed.
