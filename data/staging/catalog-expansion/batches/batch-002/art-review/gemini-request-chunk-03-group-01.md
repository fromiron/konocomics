# Batch 002 Art review — chunk 03 Gemini group 01

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

1. `work-5e20323e014d6d390aaf` あさひなぐ — official digital volume 1
   mapped to ISBN 9784091837981; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/asahinagu-reader-step05.png`
     `2945e6f740be9437cec8b3edbe1b3aa8040d092ed70af1f1efc6b3459f133fc9`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/asahinagu-reader-step12.png`
     `2edf1fd34817f1d7a8d83fa09970d2231462ef0fa0be1785b72d4662a18fda0e`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/asahinagu-reader-step19.png`
     `34a3cdc1659eb09e42e7c36d31f5d53f82fb8ffd37207dec745c99ccb205d0d9`
2. `work-5ebbc9bede841d2faf7b` 高台家の人々 — official digital volume 1
   mapped to ISBN 9784088451091; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kodai-reader-step05.png`
     `edb7b08972fb129601aad43487fdb14a6f6596bdc61ff62a1ebb2dcc418d1553`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kodai-reader-step12.png`
     `7ecb185430f201a0c8a918740b187260265ef0cfb21ba21487de02160cc889d1`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kodai-reader-step19.png`
     `5aa1ddff7b3805cc658a77a982139074087d9a2b38cd05ab74fb9a600be6f922`
3. `work-6f849a8e785deee3d5dc` 怪物事変 — official volume 1 reader keyed
   by ISBN 9784088810966; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kemonojihen-reader-step05.png`
     `9b8f85e2533af6e493a6425aa01f677e61b636998bce666182afe1fca22f914b`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kemonojihen-reader-step12.png`
     `d56a8ec1b4469ecd40160cc2380df64b797e32d4e8a1e63006d3e269922b9a5e`
   - `/tmp/batch002-art-preflight-chunk03.6Zlsbu/kemonojihen-reader-step19.png`
     `96d18608c9e6731b282ef127f8f2ae99ab7881e9bdb24db71df838283382a749`

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
