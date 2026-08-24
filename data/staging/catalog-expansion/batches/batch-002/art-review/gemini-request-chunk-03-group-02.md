# Batch 002 Art review — chunk 03 Gemini group 02

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

1. `work-71e824df2e6bc2125294` SAKAMOTO DAYS — official volume 1 reader
   keyed by ISBN 9784088826578; six pages, three contexts. The p010–p011 spread
   in `reader-step05` is the only motion candidate: inspect attack start,
   evasive development, impact, and visible aftermath with exact sub-page refs.
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/sakamoto-reader-step05.png`
     `eb94753c2524fa6d310d7821c4f7183e49929888bb732aa9125899a8271b12fd`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/sakamoto-reader-step12.png`
     `d88532b6e4af7edfddc6988dc03a73093b80166a87fef8d2c4834eafb63878e5`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/sakamoto-reader-step19.png`
     `1a4b911d113f3f748ab5134bf530171c6bd20d0348324b22225168c8e252bcb8`
2. `work-7975d62582a89492a35f` 図書館の大魔術師 — official volume 1
   product mapped to ISBN 9784065112434; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/toshokan-reader-step05.png`
     `b78cf553f5e58c61d5fda80c2392012b8b5bce407e16d868b29504195fd6843d`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/toshokan-reader-step09.png`
     `178269e8597b18a4f3382e45923de96c1be89198de09966f13fb49d3c2dd03f2`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/toshokan-reader-step12.png`
     `629d8417fac33e7b2279943a3062b60a1d3495970d895b3c96587688ee183d74`
3. `work-7d259c925286a9f91310` 聖☆おにいさん — official volume 1 product
   mapped to ISBN 9784063726626; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/saint-reader-step06.png`
     `fa42ff2c9495ddd5051f21b36ec8dbcfc709327aa2883622e9c84b4b8617bfb2`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/saint-reader-step08.png`
     `2597c1f5b99ba3ecadb99f6a39bb3f2444b9c03cf89f1f433bb8b21453837165`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/saint-reader-step10.png`
     `197d62a89314f460c067f440fb71c2a0ded0c8aeb9770068454bd03d4a113eaf`

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
