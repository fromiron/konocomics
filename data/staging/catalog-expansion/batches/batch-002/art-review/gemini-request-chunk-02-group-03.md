# Batch 002 Art review — chunk 02 Gemini group 03

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

1. `work-5915d6d7601377fcc75f` 赤髪の白雪姫 — official digital volume 1
   mapped to ISBN 9784592183730; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/akagami-reader-index09.png`
     `2f73e07e5a47b6c0d7adaff6a18a794884306f7a761ffc762ac772970a8f7070`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/akagami-reader-index21.png`
     `53c69323d8f87f77ee6b2295628883c1b852cedda53b51adfe016cf3fbd65512`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/akagami-reader-index37.png`
     `079c5f9ed4a959a6a1913d54236802465f20ecb3607257b4cffd4f980b937dc7`
2. `work-5b4dc4e6e966436b2990` 人形芝居 — official digital volume 1 mapped
   to ISBN 9784592177098; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ningyo-reader-index09.png`
     `9e6e4dc1828dbc14d595a3d7761896c70fdc082fc1f22cbeb7cd52256cc99a80`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ningyo-reader-index21.png`
     `7b6c447984af22625c77d80952cc21d9a20b82c76234e9d85fddc82ed5988678`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ningyo-reader-index37.png`
     `f4b6650c138b6cc3c2da37d54cb2d2053a94d3cf11daf9c593a7628e766df7ef`
3. `work-5b9a3ec60ac5fc90f444` 魔法使いの嫁 — official first episode mapped
   to former Mag Garden ISBN 9784800002846 by the official unchanged-content
   bridge; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/mahoyome-reader-step05.png`
     `e69ac0bde9392e7f308e57844ce197a96fc99ddf6f16a286a64c941aa56d209a`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/mahoyome-reader-step10.png`
     `42a4919c49139769985c14dcd8c81fc93699df488521a9647fc42b673e8e70e5`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/mahoyome-reader-step15.png`
     `d853e0aa9e387c8ed0940169e6fcb85475d2cf73587a57f8da557936574b1619`

Return exactly one JSON object, no Markdown fence, with:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`,
`preflightSha256`, `files` (path, recomputedSha256, hashMatches, observation),
`works` (workId, samplePageCount, contexts, editionMapping, axes with all four
axis IDs; each axis has state, value or null, confidence or null, refs,
observation, limitation; plus motionSequence with qualified, startRef,
developmentRef, endpointRef, reason), `issues`, `hardBlockers`, and
`reviewedByHuman:false`.
