# Batch 002 Art review — chunk 03 Gemini group 03

Act as an independent Art reviewer. Do not inspect or infer Local Codex
conclusions. Use exact model `gemini-3.7-flash-high`, resolved label
`Gemini 3.7 Flash (High)`, and effort `high`. Set `completionStatus=completed`
only after opening every listed image, recomputing every SHA-256, and completing
all requested rows without rate-limit, timeout, or degraded output.

Policy:

- Scope is the opening of volume 1 or the first official episode only.
- Static Art axes may be known only because each work below has six readable
  internal pages and at least two contexts in an edition-mapped official
  preview. Each known static axis must cite at least two supplied page groups.
- `artRealism`: 0 strong deformation/simple, 2 normally stylized, 4 realistic
  anatomy/background/proportion.
- `artDensity`: 0 simple/open, 2 balanced, 4 dense line/background/information.
- `visualSoftness`: 0 rough/angular, 2 neutral, 4 soft/polished.
- Use 1 or 3 only when the pixels clearly fall between anchors.
- `motionImpact` may be known only if the supplied pages prove one continuous
  action with exact start, development/impact, and endpoint refs. Otherwise it
  is `unknown`; a dramatic pose or speed line alone is insufficient.
- Unknown is not zero and Art unknown is not a promotion blocker.
- Covers, animation, synopsis, genre, title, reputation, and remembered art are
  not evidence.
- `reviewedByHuman` is false.

Preflight source:
`data/staging/catalog-expansion/batches/batch-002/art-preflight/chunk-03/preflight.csv`
SHA-256 `1f5444994829de49ad00b2a60281f3514e336c16e5160edf431c51dea11067ae`.

Works and exact temporary samples:

1. `work-8147aefccc365b0ecb4d` 黒執事 — official volume 1 product ISBN
   9784757519633 directly links the first-episode preview; six pages, three
   contexts.
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kuro-reader-page04.png`
     `e8d33a281d2479de2d4749071853a052acb92ed1279e7de0ed8cc9e018edce2f`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kuro-reader-page11.png`
     `d52d0ef27f970b3ed11ff11bc6821eef3f666e055ca5d6ddf9d895c7e84820e2`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kuro-reader-page18.png`
     `899b26719e0a5a2aab64fb00decd572dd86a8aee59e5ccbe8b2051271c6a0927`
2. `work-838a6f0ad2d1ef487588` 信長協奏曲 — official digital volume 1
   mapped to ISBN 9784091221001; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/nobunaga-reader-step05.png`
     `360532373112c0004ad43d583c18f1abea43349d51442de26a6b6538d79a9ffb`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/nobunaga-reader-step12.png`
     `2579796ccf3e86c5955da408f4acfd2f42dde29e0b0effb366193e59ca6020f4`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/nobunaga-reader-step19.png`
     `2bb025c00725f2fafd9dba2dbde630c366e1071b8b2c1c325c2ee58d91eedaec`

Transport constraint: return minified JSON with no indentation or line breaks.
Keep every `observation`, `limitation`, and `reason` at 24 words or fewer and
every context label at 8 words or fewer. This brevity does not permit omitting
or weakening any required field, file, hash, work, axis, reference, or gate.

Return exactly one JSON object, no Markdown fence, with:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`,
`preflightSha256`, `files` (path, recomputedSha256, hashMatches, observation),
`works` (workId, samplePageCount, contexts, editionMapping, axes with all four
axis IDs; each axis has state, value or null, confidence or null, refs,
observation, limitation; plus motionSequence with qualified, startRef,
developmentRef, endpointRef, reason), `issues`, `hardBlockers`, and
`reviewedByHuman:false`.
