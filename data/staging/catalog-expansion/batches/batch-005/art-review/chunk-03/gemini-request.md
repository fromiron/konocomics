# Batch 005 chunk 03 independent Gemini Art review request

## Execution contract

- Exact model: `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`, read-only `plan` mode.
- `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.
- Use only the canonical uncompressed directory supplied with this request. Recompute every declared SHA-256 and open every supplied image at original pixels.
- Do not inspect Local reviewer conclusions, covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, or model memory.
- If an input/hash/model differs, a pixel cannot be opened, or execution is truncated, rate-limited, timed out, degraded, substituted, or abnormal, return only `INPUT_OR_CAPABILITY_FAILURE`.

## Frozen work order and gate

| Position | workId | Canonical title | State |
| ---: | --- | --- | --- |
| 21 | `work-1ec3d48e64b228bb8a92` | 娚の一生 | sample-ready |
| 22 | `work-238c04ae3a3a61451078` | リューシカ・リューシカ | unknown-ready |
| 23 | `work-43ebf010a490cfd4bb50` | 千年万年りんごの子 | sample-ready |
| 24 | `work-4b4bbe8c10859c46e726` | 百舌谷さん逆上する | sample-ready |
| 25 | `work-5ad62e6413f67d351f1d` | 天にひびき | unknown-ready |
| 26 | `work-5b7cf2105a4bc6f6b46c` | クジラの子らは砂上に歌う | unknown-ready |
| 27 | `work-5e30ab3c7e3fb43e51f2` | 女王の花 | sample-ready |
| 28 | `work-62fb5d8e9f6c6bbbeba9` | 血潜り林檎と金魚鉢男 | unknown-ready |
| 29 | `work-6c6341781c12b590864f` | 鉄楽レトラ | sample-ready |
| 30 | `work-77008e04537e3fd889e2` | ジョジョリオン | sample-ready |

For sample-ready works, independently judge `artRealism`, `artDensity`, and `visualSoftness` from the Factor Dictionary anchors across all six frozen body pages and all recorded contexts. Positions 22, 25, 26, and 28 must be `U/U/U/U`. `motionImpact` may be known only for position 27's exact `reader-step-05→06→07` sequence and position 30's exact within-`reader-step-05` sequence; every other motion cell is `U`. Endpoint 0 or 4 is allowed only when every selected context supports it. `U` means unknown, never low or a blocker.

## Required response

Return one complete Markdown document only:

1. Attest exact model/effort/mode, normal completion, all frozen inputs and 36 pixels opened at original pixels, no fallback/edit, `reviewedByHuman=false`, and no Local conclusion access.
2. Echo every frozen input hash and give a 36-row table: file, expected SHA, computed SHA, `openedAtOriginalPixels=yes`, unique visible cue.
3. Give the exact positions 21–30 table with four cells in `artRealism/artDensity/visualSoftness/motionImpact` order; exactly 10 works and 40 cells.
4. For each known cell cite at least two exact refs, a Dictionary-anchored observation, limitation, and confidence. For unknown, state the unmet gate.
5. Audit all proposed 0/4 values across every context and the two authorized motion sequences against exact start/development/impact/resolved requirements.
6. Confirm no temporary or repository file was copied, moved, deleted, edited, or committed by the review.

Do not recommend promotion, compare Local values, or adjudicate.
