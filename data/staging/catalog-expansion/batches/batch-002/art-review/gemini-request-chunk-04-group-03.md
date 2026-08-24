# Batch 002 Art review — chunk 04 Gemini group 03

Act as an independent Art reviewer. Do not open, inspect, infer, or reproduce
Local Codex conclusions. Use exact model `gemini-3.7-flash-high`, resolved
label `Gemini 3.7 Flash (High)`, and effort `high`. Set
`completionStatus=completed` only after opening every listed image,
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
  these packets, so return `motionImpact=unknown` with null value/confidence and
  explain the missing bound; poses, gestures, and discontinuous pages do not
  qualify.
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
  `data/staging/catalog-expansion/batches/batch-002/art-review/chunk-04/preflight.csv`.
- Preflight SHA-256:
  `c2737cd4fa27e9d9239f5bb15f3a78ed0fbffc885e77955cb1a7af01801736a3`.

Works and exact temporary samples:

1. `work-c221a17d6b962b17c9f4` 屍鬼 — official reader
   `https://www.shueisha.co.jp/books/reader/main.php?cid=08874549874549315501`
   is the original-volume digital JDCN entry sample. The official record
   preserves the original volume order and paper release date but does not
   display frozen paper ISBN `9784088745497`; static judgments must retain this
   edition caveat. Six internal pages, three contexts; refs `reader-step-05`,
   `reader-step-09`, `reader-step-13`.
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/shiki-step05.png`
     `0314513a707995c7a70c042b737834447f255608ce41779e1e125736a057cc4f`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/shiki-step09.png`
     `9674ab4178f76ef0b26aa7aadb389a80af2219dc3310fb897a075f141b72d5c5`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/shiki-step13.png`
     `0bdc77903fc8a2403ff5b9527fcbfe0358d4f55ab85df145d667b8df1e7d430e`
2. `work-c55467873ec70e670484` 大ダーク — official trial reader
   `https://sc-portal.tameshiyo.me/9784091294869` embeds exact standard volume
   1 ISBN `9784091294869`; six body pages after excluding cover, color plate,
   and tutorial-obscured captures, three contexts; refs `p008-p009`,
   `p016-p017`, `p024-p025`.
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/dai-dark-spread-06.png`
     `1319e29f58481907bb79ce323788647faee770bd7ceadfc35fb35062a9fc254f`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/dai-dark-spread-10.png`
     `64aeeba5650537fe417ca94cd4b5508405e29d18d23b674672362224618b7e8b`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/dai-dark-spread-14.png`
     `1195fe19d32ac9c27e4edab021a0d06a0151009bcdd71db9087615dd6dfd2a32`

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
