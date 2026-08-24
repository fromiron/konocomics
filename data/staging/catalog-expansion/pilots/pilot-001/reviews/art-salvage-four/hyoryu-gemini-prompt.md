# Independent Art review packet — 漂流教室

You are Gemini 3.7 Flash High acting as an independent visual reviewer. Do not infer from title, genre, synopsis, cover, animation, or reputation. Open and inspect all three attached PNG files at their original pixels. Do not use any prior reviewer conclusion.

## Identity and frozen input

- exact CLI model: `gemini-3.7-flash-high`
- resolved label: `Gemini 3.7 Flash (High)`
- effort: `high`
- candidateSha256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- workId: `work-98d513b70560f2f96a38`
- canonicalTitle: `漂流教室`
- official product URL: `https://e-comi.shogakukan.co.jp/books/091931710000d0000000`
- source type: official Shogakukan e-comi internal preview
- edition: `漂流教室〔文庫版〕 1`, JDCN `091931710000d0000000`, official bunko volume 1
- canonical/edition limitation: title and author map to the same canonical work, but this is an alternate bunko edition rather than representative standard-edition ISBN `9784091200013`; judge only broad entry-volume traits visible in this packet.
- scope: entry volume; attached viewer refs `pages-8-9`, `pages-20-21`, `pages-32-33`; exactly six internal pages and three contexts.

## Exact attached pixels

1. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/hyoryu/pages-8-9.png` — SHA-256 `e8769145972c62659ff5b0c502e92ff46a729fdcfb78a85031a96d255c297b18`
2. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/hyoryu/pages-20-21.png` — SHA-256 `73803487f2b6c82f42a4d2f305eb09cef9038bcca247f3dc22474d4ea001c05d`
3. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/hyoryu/pages-32-33.png` — SHA-256 `6769033ea8fe29cbf29042ee1a87a0acac29c014e44b67386849eba74edbad99`

Recompute each hash with a shell tool if available. Full-pixel access is valid only if you inspect every PNG and give at least one page-specific, falsifiable visual observation for each.

## Frozen dictionary and policy

- `artRealism`: 0 strong deformation/simplification; 2 ordinary stylization; 4 realistic anatomy/background/proportion.
- `artDensity`: 0 simple/much whitespace; 2 balanced; 4 high line/background/information density.
- `visualSoftness`: 0 rough/angular; 2 neutral; 4 soft/beautiful.
- `motionImpact`: 0 static/restrained dynamic expression; 2 ordinary; 4 strong speed/impact/action emphasis.
- Judge anchors 0/2/4 first; use 1/3 only when demonstrably between anchors.
- Static axes can be known only because six readable internal pages and at least two contexts are present. Otherwise return unknown.
- `motionImpact=known` only if one exact continuous sequence has a start, development/impact, and endpoint all visible in the packet. Name exact file/page bounds and each phase. An isolated pose, splash page, synopsis, or genre is insufficient. If no qualifying sequence exists, return unknown, not a guessed value.
- Alternate-edition uncertainty lowers confidence or yields unknown if the visual trait cannot responsibly map; do not silently treat editions as identical.
- unknown is not a low score. Art unknown alone is not a hard blocker.

Return exactly one JSON object, no Markdown fence, with keys:
`exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`, `candidateSha256`, `workId`, `officialUrlChecked`, `files` (array of path, recomputedSha256, hashMatches, observation), `editionMapping`, `samplePageCount`, `contexts`, `axes` (four exact axis keys, each with state known|unknown, value integer 0..4 or null, confidence 0..1 or null, refs array, reason, limitation), `motionSequence` (qualified boolean, startRef, developmentRef, endpointRef, reason), `disagreementsOrUncertainty`, `hardBlocker`, `reviewedByHuman` (must be false). Identify the invoked model exactly as `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort `high`, and completionStatus `completed` only if those are true.
