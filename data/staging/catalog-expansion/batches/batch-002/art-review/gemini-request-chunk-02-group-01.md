# Batch 002 Art review — chunk 02 Gemini group 01

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

1. `work-29d4300ad9d3358fb67a` 外天楼 — official single-volume product mapped
   to ISBN 9784063761597; six pages, two contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/getenrou-reader-step05.png`
     `ee9acad550c01a9341697c80c9f23c5d919a25b241fdeb79dccce1d441d178ce`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/getenrou-reader-step12.png`
     `6605c10369ab010a72441ae021a428163d61b90456b87bdc292f5441536f1ef0`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/getenrou-reader-step22.png`
     `264c680c35dbe85ce8a06797d21490e34855e5149b374fd74dde9f0926ffb967`
2. `work-3dfaf6231e21133620c6` 忍者と極道 — official volume 1 mapped to ISBN
   9784065193655; six pages, two contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ninja-gokudo-reader-step05.png`
     `3e23def13222a5f474653f4f190ca3bc549faefe0c3c5a74049ce3a654b9ec43`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ninja-gokudo-reader-step12.png`
     `2d7c34c657bfa5f00ef9e5796eeb1947226f0a49fb7c048681bad51ffa0e208f`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/ninja-gokudo-reader-backstep05.png`
     `b7facfadee3652b4133735be60bb2928828934af251625d9ab99a03cf08988a1`
3. `work-3e725951eb9c49771087` 嘘解きレトリック — official digital volume 1
   mapped to ISBN 9784592196334; six pages, three contexts.
   - `/tmp/batch002-art-preflight-chunk02.polhkX/usotoki-p006-p007.png`
     `feb7999339cf0313ba35dc9a98f57fb549a7821a87d39294582bcf366f8d3bb5`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/usotoki-reader-index21.png`
     `5de8711e1043feb6436828cc47087e050ec51d2757833ffda3f4553752d0d63a`
   - `/tmp/batch002-art-preflight-chunk02.polhkX/usotoki-p034-p035.png`
     `71dd75aa0ca37753d6ade9fcf96da835ffcfca2b301902971d222474426f5e20`

Return exactly one JSON object, no Markdown fence, with:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`,
`preflightSha256`, `files` (path, recomputedSha256, hashMatches, observation),
`works` (workId, samplePageCount, contexts, editionMapping, axes with all four
axis IDs; each axis has state, value or null, confidence or null, refs,
observation, limitation; plus motionSequence with qualified, startRef,
developmentRef, endpointRef, reason), `issues`, `hardBlockers`, and
`reviewedByHuman:false`.
