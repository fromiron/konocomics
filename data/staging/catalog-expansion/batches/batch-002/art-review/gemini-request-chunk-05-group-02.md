# Batch 002 Art review — chunk 05 Gemini group 02

Act as an independent Art reviewer. Do not open, inspect, infer, or reproduce
Local Codex conclusions or either chunk-05 Local review file. Use exact model
`gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, and effort
`high`. Set `completionStatus=completed` only after opening every listed image,
recomputing every SHA-256, and completing every requested row without
rate-limit, timeout, truncated context, or degraded output.

Policy:

- Method is `promotion-evidence-v2`; scope is volume 1 or the first official
  episode only.
- The static gate is satisfied only because each listed work has six readable
  internal pages, three scene contexts, and an official entry-edition mapping.
- A known static axis must cite at least two supplied page groups.
- `artRealism`: 0 strong deformation/simple, 2 normally stylized, 4 realistic
  anatomy/background/proportion.
- `artDensity`: 0 simple/open, 2 balanced, 4 dense line/background/information.
- `visualSoftness`: 0 rough/angular, 2 neutral, 4 soft/polished.
- Use 1 or 3 only when pixels clearly fall between anchors. Use `unknown`, not
  a guessed midpoint, if the supplied pixels do not support a value.
- `motionImpact` requires exact refs for one continuous action's start,
  development/impact, and endpoint. Preflight found no qualifying sequence in
  this packet, so return `motionImpact=unknown` with null value/confidence and
  explain the missing bound; poses, gestures, peril, and discontinuous pages do
  not qualify.
- Unknown is not zero and Art unknown is not a promotion blocker.
- Covers, animation, synopsis, genre, title, reputation, user opinion, memory,
  and Local conclusions are forbidden evidence.
- `reviewedByHuman` is false.

Packet bindings:

- Frozen work-set SHA-256:
  `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6`.
- Factor Dictionary SHA-256:
  `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Preflight source:
  `data/staging/catalog-expansion/batches/batch-002/art-preflight/chunk-05/preflight.csv`.
- Preflight SHA-256:
  `24f97e6b79806d66a9a3051f7ab0cd65bba47d70b944deac3d863da1f5cae480`.

Works and exact temporary samples:

1. `work-daf65c6f2cce3e076dfa` 凪のお暇 — official frozen volume 1 ISBN
   `9784253156370` product `https://arc.akitashoten.co.jp/comics/nagi/1`
   directly links the ARC chapter 1 preview; six internal pages, three
   contexts: workplace, relationship apartment, new apartment; refs
   `reader-screen-04`, `reader-screen-09`, `reader-screen-14`.
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/nagi-reader-step03.png`
     `73117867bff2af8a68ef53e37622f1f7441488dfe3047a2bf8d1ce0eb729d024`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/nagi-reader-step08.png`
     `f08a112e22a4c198b5036869abb73f381c736a1fe3b35a662ea744d3cdaddfd8`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/nagi-reader-step13.png`
     `c5127ea9e92756285c9e5a8afa59c4f3334380feea3c3dfc885bd9e5f7ca0ffe`
2. `work-db80d94709b62aa8823f` 逃げ上手の若君 — official volume 1 reader
   `https://www.shueisha.co.jp/books/reader/main.php?cid=9784088827100`
   is keyed by frozen ISBN `9784088827100`; six internal pages, three
   contexts: ceremonial procession, prophecy encounter, burning estate; refs
   `p010-p011`, `p024-p025`, `p038-p039`.
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/nigejozu-reader-step05.png`
     `09a7da5777fe61ee4de4a4b2a036a52ff0ce51c012ef91197523e3c5fcf58934`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/nigejozu-reader-step12.png`
     `d1994dd696255c16a40e5706a8936971793ec777ce62429861f51f6e0182180b`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/nigejozu-reader-step19.png`
     `495433bf890012d06347d14c55674b08d3aa16bb03c32f8c13942bf5c13bc91c`
3. `work-ef1bdac46a0956a87f7f` タコピーの原罪 — official upper-volume
   reader `https://www.shueisha.co.jp/books/reader/main.php?cid=9784088830490`
   is keyed by frozen ISBN `9784088830490`; six internal pages, three
   contexts: schoolyard meeting, home and dog, solitary search; refs
   `p010-p011`, `p024-p025`, `p038-p039`.
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/takopi-reader-step05.png`
     `9a2f10f93e3986f038d0320f6ced8ceb3f93a8ea0319f02be4e6612161eb845d`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/takopi-reader-step12.png`
     `fd8b94fbf3f33dde3cc9f8e24adb1b980c64a7b3e3767a1b20a301a48a3f98d5`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/takopi-reader-step19.png`
     `777b8bb47aeda033af297bd7a3b42fed63522694ad1b0459658344a4e2acb1bc`

Transport constraint: return minified JSON with no indentation or line breaks.
Keep every `observation`, `limitation`, and `reason` at 24 words or fewer and
every context label at 8 words or fewer. Brevity may not omit or weaken any
required field, file, hash, work, axis, ref, mapping, or gate.

Return exactly one JSON object, no Markdown fence, with:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`,
`frozenWorkSetSha256`, `preflightSha256`, `files` (path, expectedSha256,
recomputedSha256, hashMatches, observation), `works` (workId, canonicalTitle,
officialUrl, samplePageCount, distinctContextCount, contexts, editionMapping,
pageRefs, axes containing all four axis IDs; each axis has state, value or
null, confidence or null, refs, observation, limitation; plus `motionSequence`
with qualified, startRef, developmentRef, endpointRef, reason), `issues`,
`hardBlockers`, and `reviewedByHuman:false`. If any pixel or hash cannot be
verified, set `fullPixelAccess=false`, do not fabricate values, and report it
in `issues`.
