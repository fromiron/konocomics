# Independent Art review packet — うる星やつら

You are Gemini 3.7 Flash High acting as an independent visual reviewer. Inspect every attached PNG at original pixels. Do not infer from title, genre, synopsis, cover, animation, or reputation, and do not use any prior reviewer conclusion.

## Identity/input

- exact CLI model `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort `high`
- candidateSha256 `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- workId `work-a089c0eef91d1213da38`; canonicalTitle `うる星やつら`
- official product URL `https://e-comi.shogakukan.co.jp/books/091207160000d0000000`
- official Shogakukan e-comi internal preview, `うる星やつら 〔新装版〕 1`, JDCN `091207160000d0000000`
- mapping limitation: official new-edition volume 1 maps to the canonical work and visibly begins with its original first story, but is not frozen representative standard-edition ISBN `9784091204417`; restrict claims to broad entry-volume visual traits in this packet.

## Exact files

1. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/urusei/pages-6-7.png` — `e881869776d3349967c4110ab1d188df5ca0786cf8fdd8c7a1933a5c0c6ada2f`
2. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/urusei/pages-14-15.png` — `3778c15d7e99505aa4c87b64f94337dde2845a503e0ab567b0fef81f21fb9106`
3. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/urusei/pages-22-23.png` — `be08f55007986956d11b60f001e2101878504041fa442ccfd62e130b4f82a8a6`

Recompute hashes if shell is available. Full-pixel access requires every file and a falsifiable visual observation per file.

## Dictionary/policy

- `artRealism`: 0 strong deformation/simplification; 2 ordinary stylization; 4 realistic anatomy/background/proportion.
- `artDensity`: 0 simple/much whitespace; 2 balanced; 4 high line/background/information density.
- `visualSoftness`: 0 rough/angular; 2 neutral; 4 soft/beautiful.
- `motionImpact`: 0 static/restrained dynamic expression; 2 ordinary; 4 strong speed/impact/action emphasis.
- Start at 0/2/4, 1/3 only between.
- Static known requires all six internal pages across >=2 contexts.
- Motion known only with an exact continuous start→development/impact→endpoint range identified from these files. Do not infer from isolated action or genre. Otherwise unknown.
- unknown is not low; Art unknown alone is not a blocker. Explicitly bound alternate-edition claims.

Return exactly one JSON object, no fence: `exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`, `candidateSha256`, `workId`, `officialUrlChecked`, `files` (path/recomputedSha256/hashMatches/observation), `editionMapping`, `samplePageCount`, `contexts`, `axes` (four axis objects with state/value/confidence/refs/reason/limitation), `motionSequence` (qualified/startRef/developmentRef/endpointRef/reason), `disagreementsOrUncertainty`, `hardBlocker`, `reviewedByHuman:false`. Identify the invoked model exactly as `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort `high`, and completionStatus `completed` only if true.
