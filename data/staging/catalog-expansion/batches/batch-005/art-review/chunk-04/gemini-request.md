# Batch 005 chunk 04 independent Gemini Art review request

## Execution contract

- Exact model: `gemini-3.7-flash-high`, effort `high`, read-only `plan` mode.
- `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.
- Use only the supplied canonical uncompressed directory. Recompute every SHA-256 and open every image at original pixels.
- Do not inspect Local conclusions, covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, or model memory.
- On any input/hash/model/capability mismatch or abnormal completion, return only `INPUT_OR_CAPABILITY_FAILURE`.

## Frozen gate

Static sample-ready positions are 31, 32, 34, 36, 37, and 40. Independently judge only `artRealism`, `artDensity`, and `visualSoftness` across each work's six body pages and all contexts. Positions 33, 35, 38, and 39 have all static Art cells `U`. Position 35 alone has one authorized motion-only image, `reader-page-010`, containing a bounded continuous start-development-impact-resolved punch sequence; judge only its `motionImpact`. Every other motion cell is `U`. Endpoint 0 or 4 requires support across every selected context. `U` means unknown, never low or a blocker.

The frozen order is positions 31–40 in `frozen-work-set.csv`; do not reorder or infer from title.

## Required response

Return one complete Markdown document only:

1. Attest exact model/effort/mode, normal completion, all 10 inputs and 37 images opened at original pixels, no fallback/edit, `reviewedByHuman=false`, and no Local conclusion access.
2. Echo every input hash and give a 37-row pixel table: file, expected SHA, computed SHA, `openedAtOriginalPixels=yes`, unique visible cue.
3. Give exactly positions 31–40 and 40 terminal cells in `artRealism/artDensity/visualSoftness/motionImpact` order.
4. For every known cell cite at least two exact refs, Dictionary-anchored observation, limitation, confidence. Position 35 motion may cite exact subpanels within its single authorized image; static unknowns name their unmet gate.
5. Audit every 0/4 and the position35 motion endpoint; confirm all other motion cells unknown.
6. Confirm no file mutation or promotion recommendation.

Do not compare Local values or adjudicate.
