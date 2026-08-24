# Batch 002 Art review — Gemini group 01

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
`data/staging/catalog-expansion/batches/batch-002/art-preflight/chunk-01/preflight.csv`
SHA-256 `f3cc4aebbf6000513ca229474ab862f7ada5dc15a3c02a5b3a289a9a0b6e8043`.

Works and exact temporary samples:

1. `work-017446dd1a9039d9839b` サンダー３ — official first episode mapped to
   volume 1; six pages, two contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/thunder-sample-01.png`
     `d764131a1787b67e71e55ab5856b7a11e965c6cc952c9aaaaae813113e5f24dd`
   - `/tmp/batch002-art-preflight.DZG1uL/thunder-sample-02.png`
     `6b7855bc48ad40457db4023704f46c13ebd71b00d5e83c97ef889270ad036615`
   - `/tmp/batch002-art-preflight.DZG1uL/thunder-sample-03.png`
     `bdb0763f79db3371dca015068feafc0341078533749ceb0ece4db5d3e475f1ef`
2. `work-02d5d329c9ef85e481cb` のたり松太郎 — official digital volume 1
   mapped to ISBN 9784091800718; six pages, three contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/notari-sample-step05.png`
     `e9244590ce5fa604b8716085f13633fdf2e78cfbdf79d9214bb4fe1ddf3b3ae4`
   - `/tmp/batch002-art-preflight.DZG1uL/notari-sample-step06.png`
     `4b46b3ca753a3d3a7f6056181ee038b0b20cbc275e1e75ead1db583b100d4d65`
   - `/tmp/batch002-art-preflight.DZG1uL/notari-sample-step07.png`
     `a563ce13f1fb9e494759e7c021627e2d9d067c3758c7e49f661318fc4ab8361a`
3. `work-089947c5303024841fef` デカワンコ — official digital volume 1
   mapped to ISBN 9784088655017; six pages, two contexts.
   - `/tmp/batch002-art-preflight.DZG1uL/deka-deep-02.png`
     `e70c28b902d74b708308a69c4123de3280d37f663d8da220ca1c6d4b4be951e6`
   - `/tmp/batch002-art-preflight.DZG1uL/deka-story-01.png`
     `f40c202aec15c1c55064c5538bd5468e04f418115e4a5002ebba8c2b82c774e6`
   - `/tmp/batch002-art-preflight.DZG1uL/deka-story-02.png`
     `7c1fe91e9d1e0ae7dd80274c179d942cb40f3f2f89cdbf4b83c5b4fd14468384`

Return exactly one JSON object, no Markdown fence, with:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`,
`preflightSha256`, `files` (path, recomputedSha256, hashMatches, observation),
`works` (workId, samplePageCount, contexts, editionMapping, axes with all four
axis IDs; each axis has state, value or null, confidence or null, refs,
observation, limitation; plus motionSequence with qualified, startRef,
developmentRef, endpointRef, reason), `issues`, `hardBlockers`, and
`reviewedByHuman:false`.
