# エマ — Gemini 3.7 Flash High independent Art review ledger

## 1. Frozen request

- Date: `2026-08-23`
- Repository HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Pilot candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work: `work-1fc61ddbeb429b4a2c15`
- Canonical title: `エマ`
- Requested model: `gemini-3.7-flash-high`
- Resolved label: `Gemini 3.7 Flash (High)`
- Effort: `high`
- Scope: exactly the 15 frozen official-rendered volume-1 pages `p.005–019`; Art only.
- Local values were withheld from the request.
- Repository mutation: none.

## 2. Exact packet and request artifacts

- Pixel packet: `/tmp/pilot-emma-art.xpEjuI/packet/`
- Page count: `15`
- Entry edition: KADOKAWA standard volume 1, ISBN `9784047298804`
- Portable packet SHA-256: `2bfa13ca6316c9d3cbfb34a6d5d00eb2bf1c1b0c4b70798fd6f2b4d4b4baf69a`
- Contact sheet: `/tmp/pilot-emma-art.xpEjuI/emma-contact.jpg`, SHA-256 `d7b2b891f61b354ff294e37c44b73755fe35172ad4f5ab75104f52ea3385717c`
- Exact request: `/tmp/pilot-emma-art.xpEjuI/review-prompt.md`, SHA-256 `e6dc2e12ee5acba72728abccdccb609dd43ee9bfbdf377efdc9a9bbd6305559f`
- JSON schema: `/tmp/pilot-emma-art.xpEjuI/review-schema.json`, SHA-256 `eec2e650f4e8a71005eda49ab9601235ba2a48e08f18bca5daf4a5aa5b9831f6`
- Complete CLI log: `/tmp/pilot-emma-art.xpEjuI/agy.log`, SHA-256 `b1531e67a9ab0ad17cb40428883e74a4129d569e524f90a4c397d480b35d2e5c`
- Decoded structured output: `/tmp/pilot-emma-art.xpEjuI/gemini-structured-output.json`, SHA-256 `072b033f906459c85d89897467846a05ec39840290fadc1bd7dea7e714545c68`

Local recomputation matched every one of the 15 SHA-256 values returned in `pixelFiles`. Gemini supplied a distinct, non-generic visible observation for every page, including the maps/St. Paul's view, cat and carriage, house number 29, outward-opening door impact, Emma's round glasses, tea service, sash curtains, bookshelf, mantel clock, oval mirror, and ornate picture frame.

## 3. Counted run provenance

- Route: `agy --print`
- Model argument: `gemini-3.7-flash-high`
- Effort argument: `high`
- Permission mode: `--dangerously-skip-permissions`
- Structured-output schema: supplied and accepted
- Start: `2026-08-23T04:06:29+09:00`
- Stream completion: `2026-08-23T04:08:53+09:00`
- Shell exit code: `0`
- Outer conversation: `fca89418-52cc-4906-9214-c8b4e0d9c95c`
- Outer status: **`SUCCESS`**
- Outer duration: `137.642897818s`
- Outer turns: `1`
- Usage: input `185626`, output `21949`, thinking `12411`, cache-read `711646`, total `207575`
- Exact identity proof: the CLI log starts print mode with `model="gemini-3.7-flash-high"` and repeatedly propagates `label="Gemini 3.7 Flash (High)"`.
- Completion proof: the stream completed normally and the inner response says `completionStatus=completed`.
- Full pixel access: **proven** by 15 correct recomputed hashes and 15 page-specific observations.
- Rate-limit, timeout, context cancellation, connection reset, degraded response, or incomplete-response signal: **none**.

The initial unauthenticated experiment-poll messages are followed by explicit auth success, model propagation, conversation creation, generation, and normal stream completion; they did not interrupt or degrade this counted run.

## 4. Independent result

Gemini passed the sample gate at `15` pages and `2` contexts:

1. Victorian London streetscape and exterior approach (`p.005–008`).
2. Mrs. Stowner's townhouse/parlour, tea table, and fireplace mantel (`p.010–019`).

| Axis | Gemini result | Core basis |
|---|---:|---|
| `artRealism` | `known=4` | realistic anatomy/proportion, period clothing, architecture, and interior perspective |
| `artDensity` | `known=4` | cross-hatching, masonry/maps/cobbles, books, mouldings, drapery, and mantel objects |
| `visualSoftness` | `known=4` | delicate contours, gentle shading, smooth tone, hair/glasses, and Emma's expressions |
| `motionImpact` | `unknown` | `p.007–009` contains a door-bump incident but not a qualifying bounded athletic/combat/action sequence under the strict policy |

Gemini vector: `4 / 4 / 4 / unknown`. Static Art gate: **PASS**. Motion: **unknown-closed**. Art hard blocker: **none**.

## 5. Local comparison and Pass C queue

| Axis | Local Codex | Gemini | Disposition |
|---|---:|---:|---|
| `artRealism` | `known=3` | `known=4` | **CONFLICT** — enlarged eyes and simplified facial construction versus realistic-anchor boundary |
| `artDensity` | `known=3` | `known=4` | **CONFLICT** — close-up/speech-bubble whitespace versus sustained high-density boundary |
| `visualSoftness` | `known=3` | `known=4` | **CONFLICT** — hard architecture/high-contrast clothing versus uniformly soft-anchor boundary |
| `motionImpact` | `unknown` | `unknown` | **AGREEMENT** |

No averaging, voting, or automatic winner is applied. The three one-step static-axis conflicts enter Pass C against the same exact pixels and Factor Dictionary anchors. The conflict itself is not a promotion blocker; the packet has enough direct evidence to adjudicate.

## 6. Model-panel exclusions

- Cursor Grok 4.6 High non-fast: Art abstention; no direct-pixel capability proof was supplied for this task.
- Muse Spark 1.2 xhigh: not invoked.
- No silent model substitution occurred.

The complete schema-valid Gemini response, including all 15 page hashes and observations, is preserved in `gemini-structured-output.json` at the path and hash above.
