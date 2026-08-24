# Batch 002 Art review — chunk 02 Gemini group 02

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
`data/staging/catalog-expansion/batches/batch-002/art-preflight/chunk-02/preflight.csv`
SHA-256 `56e6a1d4bc74e0e074cdaec6973a54b2fe49697dc2cbdbfeae4f1d812de2bdf1`.

Works and exact temporary samples:

1. `work-4c784fc78dfd9b139c3f` 正反対な君と僕 — official digital volume 1
   mapped to ISBN 9784088831251; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/seihantai-reader-step05.png`
     `09c087922e4d06b6add5f11c533570daeb73d6c938a4b87f23e845558f876155`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/seihantai-reader-step12.png`
     `2a1214b3786677822dd2d2d217eff75b35c9d1d9ceab7f95252bed0920b734c7`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/seihantai-reader-step19.png`
     `cb9aff359194fc662a50aee3e8e7a06a2b1e4470bf67802b0ef2032b6f458b82`
2. `work-518d7ed42dd9253679c3` 墨攻 — official digital volume 1 mapped to ISBN
   9784091830418; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/bokko-reader-step06.png`
     `2b3ca1d02ec16fd19e2fed8b16863b5a2ddbcca7dd6f7641a4f40a255c2eb458`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/bokko-reader-step10.png`
     `5a8e20f038615d844408b3cf7f1439c24836ee4a5f96754f6c30f0ec623d0d30`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/bokko-reader-step14.png`
     `521798a688c8ad15b39e6b18574ba7f6cb379e85b613159cec2a7655c31115d5`
3. `work-53e54c95f637b66c4fb2` がんばれ元気 — official digital volume 1
   mapped to ISBN 9784091202116; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ganbare-genki-reader-step06.png`
     `f1c7dfe24ab50fc79cc82bccd357e662a08678f8498001d1bd6fd09a9478d205`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ganbare-genki-reader-step12.png`
     `236f0dfe4ec2de5c3e2e5423a736e6f8e5f966c41195ebadc14f2e9c7dac2314`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ganbare-genki-reader-step18.png`
     `c5ed40dd8df680d868f2eba5f5fbdc23e615943ffc319f079d4b1d9af47ce447`

Return exactly one JSON object, no Markdown fence, with:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`,
`preflightSha256`, `files` (path, recomputedSha256, hashMatches, observation),
`works` (workId, samplePageCount, contexts, editionMapping, axes with all four
axis IDs; each axis has state, value or null, confidence or null, refs,
observation, limitation; plus motionSequence with qualified, startRef,
developmentRef, endpointRef, reason), `issues`, `hardBlockers`, and
`reviewedByHuman:false`.
