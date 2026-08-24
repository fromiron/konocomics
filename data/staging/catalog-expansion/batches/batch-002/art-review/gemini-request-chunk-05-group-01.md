# Batch 002 Art review — chunk 05 Gemini group 01

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
  development/impact, and endpoint. Only `サンキューピッチ` p010-p011 is
  preflight-attemptable in this packet. Inspect it independently and return a
  known value only if exact panel-level bounds are visible; otherwise return
  `unknown`. The other works must return `motionImpact=unknown` with null
  value/confidence and the missing bound explained.
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

1. `work-ccf0ddff9c6410c4de14` サンキューピッチ — official volume 1 reader
   `https://www.shueisha.co.jp/books/reader/main.php?cid=9784088843056`
   is keyed by frozen ISBN `9784088843056`; six internal pages, three
   contexts: pitching trial, classroom recruitment, batting test; refs
   `p010-p011`, `p024-p025`, `p038-p039`. Motion is attemptable only within
   `p010-p011`; record exact start, development/impact, and endpoint bounds.
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/thankyou-reader-step05.png`
     `7e1862f099f6ac69a58da862fa1edf30de90e9355ca4856743ba0260dac7fc96`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/thankyou-reader-step12.png`
     `a52e97fa248f741b8ae4381e9b2c6b3ca311ea916a30c782e6b2f18ef71842c2`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/thankyou-reader-step19.png`
     `0ae7b327f18286c1ab5bfe51d6de375906494e9191cfdb27ea6afc26cec1d39d`
2. `work-cdef8cfd678998a51447` うさぎドロップ — official MangaJam first
   episode `https://shodensha.tameshiyo.me/3967638000000000001E` is linked by
   the official series route to frozen original volume 1 ISBN `9784396763800`;
   six internal pages, three contexts: kitchen arrival, memorial hall, family
   negotiation; refs `p008-p009`, `p014-p015`, `p022-p023`.
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/usagi-reader-ref03.png`
     `cee943168b97b032b9bea19794941cd77a6406a13a9eb2df982f651cf21e0317`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/usagi-reader-ref06.png`
     `66a01ec979c4274f74a14a9430a0bcbfa110edcfebedd1d395bbb18c3b398076`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/usagi-reader-ref10.png`
     `b9c62827b13757b55c2fc39b1b6fd040d1bb3c4333727a0b8db8a21fbb55471b`
3. `work-ced7a8e6d9c3b8147702` 水は海に向かって流れる — official volume 1
   trial `https://www.kodansha.co.jp/comic/products/0000319530/trial` maps
   product `0000319530` to frozen ISBN `9784065144510`; six internal pages,
   three contexts: rainy arrival, room introduction, family memory; refs
   `p010-p011`, `p016-p017`, `p024-p025`.
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/water-reader-step05.png`
     `d354615afe5fee1637b869ae8935620e440782c9e5aedbdff9534b4d8979f7c0`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/water-reader-step08.png`
     `b6fbadea12f4eb4438a4390b8d57cb9bbd89b14ea7db65a71556139d76fb322c`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/water-reader-step12.png`
     `cc69d4df0eb81b227134a1977f45fff61db8dcf93b6a6eb97a330a8f6c07237b`

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
