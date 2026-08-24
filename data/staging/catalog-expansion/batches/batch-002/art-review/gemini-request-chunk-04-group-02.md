# Batch 002 Art review — chunk 04 Gemini group 02

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

1. `work-ab95f4d4997113e0687a` 月刊少女野崎くん — official opening
   chapter `https://www.ganganonline.com/title/6/chapter/284` and official
   product route map to standard volume 1 ISBN `9784757535664`; six internal
   pages, three contexts; refs `reader-step-01`, `reader-step-03`,
   `reader-step-06`.
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/nozaki-step01.png`
     `20816d211162275f939d9b979ee440eb8e1463700de446933c8a1902bb735b98`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/nozaki-step03.png`
     `c02f296b0a5db79be0690908ebd8ba919e9cdb85228d6f468a7c436e9cd94724`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/nozaki-step06.png`
     `c1464234ca80eb11e0ca5f2e29e6c3c2d029dbfb793b811ac2fa0b2851752d3b`
2. `work-ad32c71b07fd13c65a79` 私の推しは悪役令嬢。 — official first
   episode `https://ichicomi.com/episode/2550912965923202772` identifies the
   manga creators and links standard volume 1 ISBN `9784758021937`; six
   internal pages after excluding the color chapter-title splash, three
   contexts; refs `p008-p009`, `p010-p011`, `p018-p019`.
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/wataoshi-step03.png`
     `0e7e695678945d6590ddd2b0c74cf09c9dcadf173885b335a207de8f6213ec2b`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/wataoshi-step07.png`
     `660b8668aa3cde12c92ff444a187903efa2872e28a46c8c8beeccb9aae3924ce`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/wataoshi-step14.png`
     `6a06fb4e213bf1c7cc8e29558a5cf3f8f1a1e75d8d0d3ffcee91304171d71159`
3. `work-bbeeaad9e37ab267dc29` 僕とロボコ — official reader
   `https://www.shueisha.co.jp/books/reader/main.php?cid=9784088825090`
   uses the exact standard volume 1 ISBN `9784088825090`; six internal pages
   after excluding title and cover pages, three contexts; refs
   `reader-step-05`, `reader-step-07`, `reader-step-09`.
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/roboco-step05.png`
     `c3377b8c70d2234af5dce14ddb15f9b04822582eb97cf5f26892281342520dca`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/roboco-step07.png`
     `a3af60046761a29647561ba0e02932f9fdca3613db5df61c33a6fc0e8cd99dc5`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/roboco-step09.png`
     `d2b252e35c646da85a949a75f39d5ddb6c43c276df51aee753335814ded0f0f3`

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
