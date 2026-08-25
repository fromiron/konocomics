# Batch 005 chunk 01 independent Gemini Art review request

## Execution contract

- Exact model: `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`, read-only `plan` mode.
- `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.
- Use only the canonical uncompressed directory supplied with this request. Recompute every declared SHA-256 and open every supplied image at original pixels.
- Do not inspect Local reviewer conclusions, covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, or model memory.
- If an input/hash/model differs, a pixel cannot be opened, or execution is truncated, rate-limited, timed out, degraded, substituted, or abnormal, return only `INPUT_OR_CAPABILITY_FAILURE`.

## Frozen work order and gate

| Position | workId | Canonical title | State |
| ---: | --- | --- | --- |
| 1 | `work-060a72fe10cf6ba9cbfc` | チェーザレ 破壊の創造者 | unknown-ready |
| 2 | `work-076beb86f844b642beef` | くーねるまるた | sample-ready |
| 3 | `work-091d231d37f037fb07e8` | インベスターZ | unknown-ready |
| 4 | `work-0cf463005cc77eeded8e` | 黄泉のツガイ | sample-ready |
| 5 | `work-0d1ad77728a44df56508` | ラーメン大好き小泉さん | unknown-ready |
| 6 | `work-0dabd1d17e5fcf2992b9` | 忘却のサチコ | unknown-ready |
| 7 | `work-0ebf010ac12b9b60d80e` | 機動旅団八福神 | unknown-ready |
| 8 | `work-0ede6921b81169dc2dda` | 不滅のあなたへ | sample-ready |
| 9 | `work-0eff8190c0c6ff604527` | よるくも | unknown-ready |
| 10 | `work-12b484cd79bfe6852ea1` | 高校球児 ザワさん | unknown-ready |

For sample-ready works, independently judge `artRealism`, `artDensity`, and `visualSoftness` from the Factor Dictionary anchors across all six frozen body pages and all recorded contexts. Positions 1, 3, 5, 6, 7, 9, and 10 must be `U/U/U/U`. Every `motionImpact` cell must be `U` because no exact bounded continuous start-development-impact-resolved sequence passed preflight. Endpoint 0 or 4 is allowed only when every selected context supports it. `U` means unknown, never low or a blocker.

## Required response

Return one complete Markdown document only:

1. Attest exact model/effort/mode, normal completion, all frozen inputs and 18 pixels opened at original pixels, no fallback/edit, `reviewedByHuman=false`, and no Local conclusion access.
2. Echo every frozen input hash and give an 18-row table: file, expected SHA, computed SHA, `openedAtOriginalPixels=yes`, unique visible cue.
3. Give the exact positions 1–10 table with four cells in `artRealism/artDensity/visualSoftness/motionImpact` order; exactly 10 works and 40 cells.
4. For each known cell cite at least two exact refs, a Dictionary-anchored observation, limitation, and confidence. For unknown, state the unmet gate.
5. Audit all proposed 0/4 values across every context and confirm every motion cell is unknown.
6. Confirm no temporary or repository file was copied, moved, deleted, edited, or committed by the review.

Do not recommend promotion, compare Local values, or adjudicate.
