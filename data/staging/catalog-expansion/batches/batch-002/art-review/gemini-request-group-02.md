# Batch 002 Art review — Gemini group 02

Act as an independent Art reviewer. Do not inspect or infer Local Codex
conclusions. Use exact model `gemini-3.7-flash-high`, resolved label
`Gemini 3.7 Flash (High)`, and effort `high`. Set `completionStatus=completed`
only after opening every listed image, recomputing every SHA-256, and completing
all requested rows without rate-limit, timeout, or degraded output.

Apply the current Factor Dictionary anchors: `artRealism` 0 strongly
deformed/simple, 2 normally stylized, 4 realistic anatomy/background/proportion;
`artDensity` 0 simple/open, 2 balanced, 4 dense line/background/information;
`visualSoftness` 0 rough/angular, 2 neutral, 4 soft/polished. Intermediate 1 or
3 requires pixel support. Static known requires six internal pages, two
contexts, and at least two supplied page-group refs per axis. `motionImpact`
known additionally requires one continuous action with exact start,
development/impact, and endpoint; otherwise use `unknown`. Unknown is not zero
and is not itself a blocker. Do not use covers, animation, synopsis, genre,
title, reputation, or memory. `reviewedByHuman` is false.

Preflight source:
`data/staging/catalog-expansion/batches/batch-002/art-preflight/chunk-01/preflight.csv`
SHA-256 `f3cc4aebbf6000513ca229474ab862f7ada5dc15a3c02a5b3a289a9a0b6e8043`.

Works and exact temporary samples:

1. `work-0e036724913c69bb937a` ファイアパンチ — official digital volume 1
   mapped to ISBN 9784088807317; six pages, two contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/.playwright-cli/page-2026-08-22T20-18-34-769Z.png`
     `4a53def0072410f4af3461f3173b46f52346dc07d31fcb95873dc0bba1c6fa13`
   - `/tmp/batch002-art-preflight.DZG1uL/.playwright-cli/page-2026-08-22T20-18-37-114Z.png`
     `70671376f055bc7354368706c1c58580075aa646d0c66404bb81b69fe6b4a1b8`
   - `/tmp/batch002-art-preflight.DZG1uL/.playwright-cli/page-2026-08-22T20-17-23-793Z.png`
     `e4a6dc03f61fe87df665b08e83a70dd886fb55e2b1672be54f81dae563888b57`
2. `work-1088a1dc00a3b0d22201` 邪眼は月輪に飛ぶ — official digital single
   volume mapped to ISBN 9784091811974; six pages, three contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/jagan-sample-step05.png`
     `120884a7b7b4412872570c6beac3e3e448cc5ba87da12c6d96fb763bd003e03a`
   - `/tmp/batch002-art-preflight.DZG1uL/jagan-sample-step06.png`
     `a6050e7b43e79898e683ebe70874f0cb594067b936b17de6ed6551bfaf210f3f`
   - `/tmp/batch002-art-preflight.DZG1uL/jagan-sample-step07.png`
     `c289429deaf403bf73c311e536ef4d57e669a439b06d00a988e3baff1f8a3687`
3. `work-19a26f01512166856a6a` 銀河鉄道999 — official digital volume 1
   mapped to the later representative ISBN 9784091880017; six pages, two
   contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/galaxy999-sample-step05.png`
     `0ff6c5d54f42789fd11d68c696ae4f30b1b3f41632c14c4f5c4cdec69b360346`
   - `/tmp/batch002-art-preflight.DZG1uL/galaxy999-sample-step06.png`
     `cd117d881ea8a749e876b0540c2752d63dade3010b625be6815fba876be08dd1`
   - `/tmp/batch002-art-preflight.DZG1uL/galaxy999-sample-step07.png`
     `57c6c9d87c58feb20d7b16236054b735180ac0d835b3a329ef66265a9201e88c`
4. `work-1012948f5de799831da4` RED — the official product and edition are
   resolved, but the official page exposes no internal preview: zero readable
   pages, zero contexts, and no temporary image. Close all four Art axes as
   `unknown`; do not invent a visual judgment and do not make this a blocker.

Return exactly one JSON object, no Markdown fence, with:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`,
`preflightSha256`, `files` (path, recomputedSha256, hashMatches, observation),
`works` (workId, samplePageCount, contexts, editionMapping, axes with all four
axis IDs; each axis has state, value or null, confidence or null, refs,
observation, limitation; plus motionSequence with qualified, startRef,
developmentRef, endpointRef, reason), `issues`, `hardBlockers`, and
`reviewedByHuman:false`.
