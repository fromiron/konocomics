# Independent Art review packet — YAWARA！

You are Gemini 3.7 Flash High acting as an independent visual reviewer. Inspect all attached PNGs at original pixels. Do not infer from title, genre, synopsis, cover, animation, or reputation, and do not use any prior reviewer conclusion.

## Identity/input

- exact CLI model `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort `high`
- candidateSha256 `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- workId `work-14e489bf1afd1587c44a`; canonicalTitle `YAWARA！`
- official product URL `https://e-comi.shogakukan.co.jp/books/091813410000d0000000`
- official Shogakukan e-comi internal preview, `ＹＡＷＡＲＡ！ 完全版 デジタル Ver. 1`, JDCN `091813410000d0000000`
- edition mapping: Shogakukan's official endpoint for representative ISBN `9784091813411` redirects to this exact JDCN body. The product nevertheless states that it derives from the 2014–15 complete edition with additions/corrections and full color restoration, re-edited from 20 into 29 digital volumes. Treat observations as official digital-entry-sample evidence, not proof of identical paper reproduction.

## Exact files

1. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/yawara/pages-8-9.png` — `9263e39d58e55e6907405025bb621cdd612d6c7bd47d9667ddce36d13bfb080e`
2. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/yawara/pages-14-15.png` — `10019c36357d8a976a3e90797de7cfe13b1514c9e02d7a3782fc05d024ce3fef`
3. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/yawara/pages-22-23.png` — `fe88678ab2bf6991bd12011fa3b1568c91066e2328b86ed79edaa84b1d8b1e9a`

Recompute hashes if shell is available. Full-pixel access requires every file and a falsifiable page-specific observation per file.

## Dictionary/policy

- `artRealism`: 0 strong deformation/simplification; 2 ordinary stylization; 4 realistic anatomy/background/proportion.
- `artDensity`: 0 simple/much whitespace; 2 balanced; 4 high line/background/information density.
- `visualSoftness`: 0 rough/angular; 2 neutral; 4 soft/beautiful.
- `motionImpact`: 0 static/restrained dynamic expression; 2 ordinary; 4 strong speed/impact/action emphasis.
- Anchor at 0/2/4; use 1/3 only when between anchors.
- Static known needs six readable pages and >=2 contexts.
- Motion known requires an exact continuous start→development/impact→endpoint passage in the packet. Identify exact refs/phases; isolated running/pose is insufficient. If no qualifying range, unknown.
- unknown is not low; Art unknown alone is not a hard blocker. Edition-specific restoration/re-editing must lower confidence or cause unknown where responsible mapping is impossible.

Return exactly one JSON object, no fence: `exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`, `candidateSha256`, `workId`, `officialUrlChecked`, `files` (path/recomputedSha256/hashMatches/observation), `editionMapping`, `samplePageCount`, `contexts`, `axes` (four axis objects with state/value/confidence/refs/reason/limitation), `motionSequence` (qualified/startRef/developmentRef/endpointRef/reason), `disagreementsOrUncertainty`, `hardBlocker`, `reviewedByHuman:false`. Identify the invoked model exactly as `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort `high`, and completionStatus `completed` only if true.
