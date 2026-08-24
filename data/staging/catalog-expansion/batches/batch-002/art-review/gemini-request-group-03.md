# Batch 002 Art review — Gemini group 03

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

1. `work-1e27731b880d0d9012f8` 吉祥天女 — official digital volume 1 mapped
   to ISBN 9784091313010; six pages, three contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/kichijo-sample-step05.png`
     `5ae4c01cc93cd89f885f62dba5d82fd196201c9ac6ce6c56729c53405a97b218`
   - `/tmp/batch002-art-preflight.DZG1uL/kichijo-sample-step06.png`
     `f888ddf6461d5f4c29f2df4840187586155203688e9cb14841cbdbb5d5fcd77e`
   - `/tmp/batch002-art-preflight.DZG1uL/kichijo-sample-step07.png`
     `69dbc1327c9420d160be26b5e32730c90e9649542d71c15918fc95534a1c58b9`
2. `work-207bb1ca28b7472fbe1d` 六三四の剣 — official digital volume 1 mapped
   to ISBN 9784091206312; six pages, three contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/musashi-sample-step05.png`
     `694e6108f011aee83ca9114a69df18b54b30e93a55a921000c1bbbc1f14b0e4b`
   - `/tmp/batch002-art-preflight.DZG1uL/musashi-sample-step06.png`
     `b653472dad22aaa2ac88b64ddc0a5270d3b00fa5d0d6f3abf93ec37ed56063e9`
   - `/tmp/batch002-art-preflight.DZG1uL/musashi-sample-step07.png`
     `2e06569fb3eab745b58cd5d4f3e72474ad13f8f89cfe45dd09c5cd4e4a419edf`
3. `work-23851cd7ccf1d0c676cc` 怪獣8号 — official volume 1 reader keyed by
   ISBN 9784088825250; six pages, three contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/kaiju8-deep-02.png`
     `4c19bcdd2a5cc57a3195aa5f7539a0519963e5449c0056e0a1e16b83c4ef09fa`
   - `/tmp/batch002-art-preflight.DZG1uL/kaiju8-deep-03.png`
     `ebabcb2a7f0e4a362b0eae72fd745c1c71d694699124326d3b288755443ee9f6`
   - `/tmp/batch002-art-preflight.DZG1uL/kaiju8-story-02.png`
     `756e2787083e44c8aea3821eb8328f87141409e700ad8113624961e3129b651e`

Return exactly one JSON object, no Markdown fence, with:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`,
`preflightSha256`, `files` (path, recomputedSha256, hashMatches, observation),
`works` (workId, samplePageCount, contexts, editionMapping, axes with all four
axis IDs; each axis has state, value or null, confidence or null, refs,
observation, limitation; plus motionSequence with qualified, startRef,
developmentRef, endpointRef, reason), `issues`, `hardBlockers`, and
`reviewedByHuman:false`.
