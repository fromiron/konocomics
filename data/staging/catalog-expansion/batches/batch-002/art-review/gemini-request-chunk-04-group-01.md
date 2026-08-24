# Batch 002 Art review — chunk 04 Gemini group 01

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

1. `work-9072892a767332254f00` flat — official first episode
   `https://magcomi.com/episode/13933686331605684933` identifies 青桐ナツ
   and links standard volume 1 ISBN `9784861275333`; six internal pages, three
   contexts; refs `reader-step-01`, `reader-step-07`, `reader-step-14`.
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/flat-reader-step01.png`
     `0d8947d8fa15e9bd46fbd2ab2096d425c8f9f6d187558127b22881254cad75ab`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/flat-reader-step07.png`
     `941802b172d239366f134d853023882c69af2104352c78b44b65455bccff3805`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/flat-reader-step14.png`
     `3c16587217534b463d67d911c871097d063d5b9b825d68d6c5a8b5c4d14373d4`
2. `work-98b7d2ef065bde405972` スーパーの裏でヤニ吸うふたり — official
   introduction and first-episode preview
   `https://magazine.jp.square-enix.com/biggangan/introduction/yanisuu/`
   list standard volume 1 ISBN `9784757580947`; six internal pages, three
   contexts; refs `preview-slide-02`, `preview-slide-05`, `preview-slide-08`.
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/yanisuu-slide02.png`
     `4175c07a282221d9d5c9a2ad4448f332e2f040ceae9d5ccfa8912b8865f309e6`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/yanisuu-slide05.png`
     `2e0830778c651c337ac9e444b064132deccf214c3fb864eb7252291ac2bb817f`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/yanisuu-slide08.png`
     `e242d3fc174b3f8f73fd7fe60b9a25014f377a730844ed1d8497268881c8ca7d`
3. `work-a8349445836546a82934` 百姓貴族 — official volume 1 viewer
   `https://www.shinshokan.com/comic/tameshiyomi/67085-5/html5.html#page=1`
   and product identifier `67085-5` map to standard volume 1 ISBN
   `9784403670855`; six internal pages, three contexts; refs `p004-p005`,
   `p006-p007`, `p010-p011`.
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/hyakusho-p003.png`
     `b563ccfcd8e7a664958245b4a0cb3641fc26c3e3be72c953f7216e46dd860499`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/hyakusho-p004.png`
     `f42373030ad7b3084a4591eb3e46925f396e3ef766dc41a42541d45a397bce12`
   - `/tmp/batch002-art-preflight-chunk04.7n26GY/hyakusho-spread-11-fixed.png`
     `c5c6b7cc6b01f62ff4749e5a966f1d925c3e06ab6a9273b666c19d74588b8b4f`

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
