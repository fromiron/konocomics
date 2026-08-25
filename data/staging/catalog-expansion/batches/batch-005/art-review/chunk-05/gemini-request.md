# Batch 005 chunk 05 independent Gemini Art review request

## Execution contract

- Exact model: `gemini-3.7-flash-high`, effort `high`, read-only `plan` mode.
- `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.
- Use only the supplied canonical uncompressed directory. Recompute every SHA-256 and open every image at original pixels.
- Do not inspect Local conclusions, covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, or model memory.
- On any input/hash/model/capability mismatch or abnormal completion, return only `INPUT_OR_CAPABILITY_FAILURE`.

## Frozen work order and gate

| Position | workId | Canonical title | State |
| ---: | --- | --- | --- |
| 41 | `work-c50ea94bb66f72c679a2` | 機械仕掛けの愛 | sample-ready |
| 42 | `work-c7e065f61bb7a176ee56` | 臨死!!江古田ちゃん | unknown-ready |
| 43 | `work-c8243866b7c8a6d9a2f8` | 町でうわさの天狗の子 | unknown-ready |
| 44 | `work-db4a0ec451d7f4ffd8b8` | 万福児 | unknown-ready |
| 45 | `work-e658d3aee2e33c17aa38` | スピリットサークル | unknown-ready |
| 46 | `work-e906b3eaa9ef9eafe23c` | トリリオンゲーム | sample-ready |
| 47 | `work-f31a42ea4ad724acefa5` | デッドデッドデーモンズデデデデデストラクション | sample-ready |
| 48 | `work-f4bfc29a5e0a9b5148d0` | 月に吠えらんねえ | unknown-ready |
| 49 | `work-fb89f119251610cf1648` | 1/11 じゅういちぶんのいち | unknown-ready |
| 50 | `work-fe35a5f01946f5153eb4` | シュトヘル | sample-ready |

For sample-ready works, independently judge `artRealism`, `artDensity`, and `visualSoftness` across all six frozen body pages and contexts. Positions 42–45, 48, and 49 must be `U/U/U/U`. Every `motionImpact` cell must be `U`; no exact bounded sequence passed preflight. Endpoint 0 or 4 requires support across every selected context. `U` is unknown, never low or a blocker.

## Required response

Return one complete Markdown document only:

1. Attest exact model/effort/mode, normal completion, all 10 inputs and 24 images opened at original pixels, no fallback/edit, `reviewedByHuman=false`, and no Local conclusion access.
2. Echo every input hash and give a 24-row pixel table: file, expected SHA, computed SHA, `openedAtOriginalPixels=yes`, unique visible cue.
3. Give exactly positions 41–50 and 40 terminal cells in `artRealism/artDensity/visualSoftness/motionImpact` order.
4. For every known cell cite at least two exact refs, Dictionary-anchored observation, limitation, confidence; unknown states must name the unmet gate.
5. Audit every 0/4 and confirm every motion cell is unknown.
6. Confirm no file mutation or promotion recommendation.

Do not compare Local values or adjudicate.
