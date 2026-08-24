# Batch 002 Art review — chunk 05 Gemini group 03

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
  development/impact, and endpoint. Only `YAIBA` p036-p037 is
  preflight-attemptable in this packet. Inspect it independently and return a
  known value only if exact panel-level bounds are visible; otherwise return
  `unknown`. `闇のパープル・アイ` must return `motionImpact=unknown` with null
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

1. `work-f5847c45d30753150364` 闇のパープル・アイ — official digital
   standard volume 1 JDCN `091316510000d0000000` reader
   `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091316510000d0000000`
   maps to frozen paper ISBN `9784091316516`; six internal pages, three
   contexts: rooftop injury, domestic fever, nighttime eye change; refs
   `p008-p009`, `p022-p023`, `p026-p027`.
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/purple-eye-reader-step05.png`
     `407d341abcc32327399b859aac0be9cdb87cafb65d2cee1806a0bdbb52b687ee`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/purple-eye-reader-step12.png`
     `40b1d4de267ae42af529c4da1256b0c29e677a51fde6a4a5e9d968c6a76b1820`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/purple-eye-reader-step14.png`
     `2ac2346ad4f7ea0849f6488a55ecdd35d4816dc7c6fe8e4a0b014a45eb545eef`
2. `work-fabc7f5d853e361acaf3` YAIBA — official digital standard volume 1
   JDCN `091222710000d0000000` reader
   `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091222710000d0000000`
   maps to frozen paper ISBN `9784091222718`; six internal pages, three
   contexts: jungle tiger encounter, city meeting, sword sparring; refs
   `p008-p009`, `p022-p023`, `p036-p037`. Motion is attemptable only within
   `p036-p037`; record exact start, development/impact, and endpoint bounds.
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/yaiba-reader-step05.png`
     `1ebebec4d53975d110a3d3eb1f7858422ab0fb1b583ff6555f872b5071e5b412`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/yaiba-reader-step12.png`
     `3b3395d411394f86286a31ea2dc21e10f26f221ec9e6c2ba4605a00437f15536`
   - `/tmp/batch002-art-preflight-chunk05.aOTBj4/yaiba-reader-step19.png`
     `f47276b8a606fbeff643012611609863c5298aaec6985b624a2e392fa3cf36fa`

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
