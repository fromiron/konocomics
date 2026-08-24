# Independent Art review packet — 11人いる！

You are Gemini 3.7 Flash High acting as an independent visual reviewer. Do not infer from title, genre, synopsis, cover, animation, or reputation. Open and inspect all three attached PNG files at original pixels. Do not use any prior reviewer conclusion.

## Identity and frozen input

- exact CLI model: `gemini-3.7-flash-high`; resolved label: `Gemini 3.7 Flash (High)`; effort: `high`
- candidateSha256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- workId: `work-f50fa290eb4116a7078e`; canonicalTitle: `11人いる！`
- official product URL: `https://e-comi.shogakukan.co.jp/books/091910110000d0000000`
- source type: official Shogakukan e-comi internal preview
- edition: official single digital volume `11人いる!`, JDCN `091910110000d0000000`
- scope/mapping: the volume TOC contains original `11人いる！` from p.3, sequel `続・11人いる！ 東の地平・西の永遠` from p.125, and `スペース ストリート` from p.285. The attached viewer pages 8–13 are therefore the original story opening only. Judge only this entry range.

## Exact attached pixels

1. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/eleven/pages-8-9.png` — `a29efba575dc7ab660ddc5d1e603f08ffeebb9ceec5bd27533bb2ede15e28c20`
2. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/eleven/pages-10-11.png` — `db6f872bf3f796dc41c549550209088a6fd783c87ba34379c02a2eb5e937b9c4`
3. `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi-alt/eleven/pages-12-13.png` — `b7bf8706baf3b83768e198ed3d6dc510cc5de63418591e8e3e3a79e04c435dbc`

Recompute hashes if a shell tool is available. Full-pixel access requires every PNG plus at least one page-specific falsifiable observation per file.

## Dictionary/policy

- `artRealism`: 0 strong deformation/simplification; 2 ordinary stylization; 4 realistic anatomy/background/proportion.
- `artDensity`: 0 simple/much whitespace; 2 balanced; 4 high line/background/information density.
- `visualSoftness`: 0 rough/angular; 2 neutral; 4 soft/beautiful.
- `motionImpact`: 0 static/restrained dynamic expression; 2 ordinary; 4 strong speed/impact/action emphasis.
- Anchor at 0/2/4 first; 1/3 only between anchors.
- Static known requires six readable pages and >=2 contexts.
- Motion known requires one exact continuous start→development/impact→endpoint sequence, with exact file/page refs. A restrained but genuinely continuous movement may anchor at 0; without a complete sequence return unknown.
- unknown is not low and Art unknown alone is not a blocker. Edition/range uncertainty must be explicit.

Return exactly one JSON object, no fence, with: `exactModel`, `resolvedLabel`, `effort`, `completionStatus`, `fullPixelAccess`, `candidateSha256`, `workId`, `officialUrlChecked`, `files` (path/recomputedSha256/hashMatches/observation), `editionMapping`, `samplePageCount`, `contexts`, `axes` (all four; state/value/confidence/refs/reason/limitation), `motionSequence` (qualified/startRef/developmentRef/endpointRef/reason), `disagreementsOrUncertainty`, `hardBlocker`, `reviewedByHuman:false`. Identify the invoked model exactly as `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort `high`, and completionStatus `completed` only if true.
