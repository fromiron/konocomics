# Design QA — `temp/design` component-fidelity redesign

## Verdict

The latest bounded build is the Featured recommendation card expansion in
`あなたのために選んだ作品`. No actionable P0, P1, or P2 defect remains in its
rendered right-expansion, left-expansion, caution, no-caution, Quick Preview,
or mobile states.

This scoped pass does not erase the broader evidence limits for first-run
onboarding and populated Library reading/favorite/editor states; those states
still cannot be captured without changing the user's persisted browser data.

`final result: passed`

Deployment was not requested or performed.

## Evidence identity

- Canonical design bundle: `temp/design/`.
- `temp/design/MANIFEST.sha256`: all 18 entries match their files.
- Targets: `temp/design/visual-targets/01-home.png` through
  `07-settings.png`, plus the user's two focused Top 10/poster references.
- Fresh Oracle review:
  `.qa/review/current-redesign/oracle-component-delta-round-3.md`.
  It returned `수정 필요`, not the earlier blocker-only all-pass.
- Oracle conversation:
  `https://chatgpt.com/c/6a82b080-d3b4-83ee-870f-3da5bd49b0e8`.
- Oracle payload:
  `.qa/review/konocomics-component-delta-round-3.zip`, SHA-256
  `4fbb721ab119db2fb51060b4663b9448a148144b1d2ff1e7b7327eb35628d037`.
- Final live captures:
  `.qa/review/current-redesign/live-2026-08-17/`.
- Target/current composites:
  `.qa/review/current-redesign/live-2026-08-17/comparisons/`.
- Browser: the user-selected Codex in-app browser using
  `http://localhost:3000` with the project's Rakuten environment.

Home was measured at a 1024 × 1536 CSS viewport. The other desktop routes used
948 × 1659, and mobile checks used 390 × 844. The in-app browser removes its
scrollbar strip from some saved images, so 1009 × 1514 and 933 × 1633 captures
were padded only for comparison and never resized.

The target's generated Korean copy, fake match percentages, invented counts,
reviews, memos, account controls, and generated cover text are visual context,
not product capabilities. The implementation keeps Japanese strings, real
Catalog/provider covers, contribution-backed reasons, qualitative confidence,
and persisted local records.

## Latest scoped comparison — expanded recommendation card

### Source and implementation identity

- Source visual truth:
  `temp/design/visual-targets/04-recommendations.png` (948 × 1659 px) for the
  page system, plus the user's focused before-state
  `C:/Users/Bell/AppData/Local/Temp/codex-clipboard-0351bd1c-913e-4a92-9e49-80f1b3f144d0.png`
  (570 × 587 px) and the accepted 352 × 364 component contract.
- Final implementation screenshot:
  `.qa/review/current-density/recommendations-caution-expanded-948x1659.png`
  (933 × 1633 px captured from a 948 × 1659 CSS viewport at 1× density; the
  in-app browser omits its 15 px scrollbar strip and 26 px browser-owned band).
- Left-expansion implementation screenshot:
  `.qa/review/current-density/recommendations-left-expanded-1366x720.png`
  (1351 × 1095 px from the user's desktop browser window).
- Focused same-input comparison:
  `.qa/review/current-density/expanded-card-before-after.png` (720 × 404 px).
  The source and final card crops were normalized to the same 352 × 364 frame;
  only the source crop was downsampled.
- State: real `宝石の国` provider cover, `好みと異なる点` present, shelf scrolled
  to the card, fine-pointer expansion, dark-only theme.

### Full-view and focused findings

- **Spacing and layout:** the final card is 352 × 364 px with a 44 px action
  row, 152 px identity rail, and 198 px evidence rail. The evidence heading is
  fixed at the top, one support plus caution is centered in the flexible middle,
  and the 44 px truthful disclosure is fixed at the bottom. The former single
  unfinished lower void is replaced by balanced upper/lower breathing room.
- **Typography:** identity copy keeps its 144 px measure. Evidence uses the
  existing Japanese UI family, 14 px / 1.45 body copy, a 14 px accent heading,
  and a 12 px disclosure label. Real title, status, creator, confidence, reason,
  and caution copy remain readable without scaling the text layer.
- **Colors and tokens:** the existing canvas/surface/line/accent/warn semantic
  tokens are preserved. The warning remains an opaque, bounded semantic surface;
  no translucent layer lets identity text bleed through.
- **Image quality:** one unchanged provider `CoverImage` DOM node is used in
  both states. It measures 104 × 149.06 px when expanded, remains object-contain,
  and moves to the right rail only for left expansion. No duplicate backdrop,
  crop, generated cover, or capture-only opacity adjustment was added.
- **Copy and content:** the identity rail retains the contribution-backed lead
  reason. Caution cards show one additional reason and the caution; no-caution
  cards show two additional reasons. `理由をもっと見る` reaches all three real
  reasons, the full caution, and the same reading actions in Quick Preview.
- **Motion and position:** at a sampled transition midpoint the article was
  283.70 px wide and the cover 118.03 px wide, while the title remained at
  x=104.00 px. Final right expansion also kept title/meta/lead x unchanged;
  final left expansion differed by only the 0.67 px border coordinate. Text now
  moves on the block axis only instead of drifting diagonally with a variable
  inline measure.
- **Responsiveness:** at 948 px the document measured 933 / 933 and the caution
  card had no internal overflow (`article 363 / 363`, evidence `319 / 319`). At
  390 × 844 the document measured 375 / 375; cards were 132.77 × 288.01 px,
  about 2.54 lanes were visible, and desktop evidence/hover expansion stayed
  hidden.
- **Accessibility and interaction:** the disclosure target is 44 px high. After
  Quick Preview closes, focus returns to the stable identity link for `宝石の国`.
  A focused expanded card owns its shelf, so the pointer position under the
  dismissed dialog cannot expand a second card simultaneously. The final fresh
  browser cycle logged only Vite debug/info messages and no runtime error.

### Comparison history

1. **P2 — unfinished empty lower region:** the before-state placed the caution
   and one reason at the top of a narrow column and left most of the card empty.
   Fixed with the top/center/bottom evidence structure. Post-fix evidence is the
   focused comparison and 948 px capture above.
2. **P2 — diagonal copy drift:** creator text was inserted before status during
   expansion and changed the existing inline position. It now appends after the
   stable status/volume prefix; title and lead remain in the same 152 px rail.
   Post-fix runtime coordinates are recorded above.
3. **P2 — disclosure focus loss:** closing Quick Preview attempted to restore a
   hidden disclosure button and could also hover-expand a second card. Focus now
   returns after dialog teardown to the persistent identity link, and shelf
   ownership prevents the second expansion. Browser readback found one expanded
   card and the expected focused link.

No P3 follow-up is required for this bounded component pass.

## Component-level result

### Shared media components

- `ShowcaseCard` now uses full-area layered cover treatment, compound scrims,
  ordinal, title, creator, and truthful catalog metadata.
- `RankingCard` owns the real crown, stacked `TOP` / `10` plate, separate large
  rank numeral, first-rank gold boundary, lower scrim, title, and truthful meta.
  A raster PNG/WebP plate was unnecessary.
- `MediaPosterCard` preserves the source cover ratio, overlays readable content,
  uses 160 px from `sm` upward, and computes 139.1667 px at 390 px so exactly
  2.4 cards occupy the padded mobile shelf viewport.
- `MediaShelf` keeps scrolling local. Final inspected documents had no root
  horizontal overflow.
- Fine-pointer lift is 2 px and is disabled when reduced motion is requested.
- Standard `CoverImage` roots are `span.block`, making them valid phrasing
  content inside native onboarding buttons. Hero roots remain structural `div`s.

### Home

- The hero, showcase, Top 10, discovery, how-it-works, trust, and footer regions
  use role-specific components rather than one generic poster card.
- The 1024 × 1536 final render had 38 loaded provider images, zero failures,
  document width 1009 / 1009, and document height 1701.
- Only actual first-viewport Hero/Showcase media remains eager. The below-fold
  Home Top 10 priority request was removed.
- The final mobile render had document width 375 / 375. Showcase cards expose
  about 2.58 lanes; poster cards expose exactly 2.4 lanes.

### Onboarding

- Selection covers are 104 px mobile / 128 px desktop with cover-overlay text,
  selected check, separate 44 px favorite action, genre state, collections,
  selected-tray empty slot, and guidance icons.
- Standard cover markup inside 27 native buttons was inspected live: every root
  was `SPAN`, computed `display:block`, document width 948 / 948, console errors
  zero.
- The current persisted session is add mode. Deleting or rewriting the user's
  profile only to reproduce first-run visual evidence was not authorized.

### Manga DNA

- The summary keeps exactly three evidence-backed preferences, larger radar,
  real anchor covers and text, and landscape evidence cards.
- All 49 factors remain directly available with all five 44 px adjustment
  choices. Desktop rows use a meter plus inline segmented choices.
- The page is intentionally longer than the compact target because the higher
  contract forbids replacing the full controls with a Top 5, three choices, or
  an accordion.

### Recommendations

- Criteria, filters, collapsed confidence, 200 ms fine-pointer expansion,
  same-cover atmosphere, grouped reasons, icon actions, auxiliary landscape
  cards, and the dense Top 10 are implemented as dedicated components.
- The final 948 × 1659 render had a 352 px expanded card and document width
  933 / 933.
- Fine-pointer expansion keeps the original foreground `CoverImage` node and
  removes the former duplicate backdrop image. The card remains 364 px high;
  the closed article boundary and cover frame animate on the signature curve,
  while identity copy receives only a block-axis position FLIP and never scales.
- Expansion direction is chosen from the card and Shelf viewport geometry. A
  right expansion keeps the cover on the left; a left expansion mirrors the
  anatomy so the description is on the left and the same 104 px cover is on the
  right. The inspected left-expansion card was 352 × 364 px and remained fully
  inside its Shelf, with document width 1351 / 1351.
- Expansion now animates the actual closed article boundary from 154 px to
  352 px over the 240 ms signature curve. Its inner content canvas is a stable
  350 px, while the cover/title identity rail stays 152 px on either side.
  Runtime midpoint inspection measured a 283.70 px article and 118.03 px cover
  with the title at the same x coordinate as its collapsed state; only its
  block-axis position compressed with the cover. The mirrored left state
  measured a 198 px evidence panel and 152 px identity rail, one cover image,
  and root width 1351 / 1351.
- When `好みと異なる点` is present, the fixed-height card prioritizes the lead
  reason in the identity rail and centers one additional reason plus caution in
  an opaque evidence summary. The existing `理由をもっと見る` control opens
  Quick Preview with every reason, the full caution, and the same reading-state
  actions. The inspected card had no content overflow
  (`scrollHeight === clientHeight`).
- Focused interaction evidence is in
  `.qa/review/current-redesign/interaction/recommendation-left-expansion-after.png`,
  `.qa/review/current-redesign/interaction/recommendation-caution-after.png`, and
  `.qa/review/current-redesign/interaction/recommendation-caution-before-after.png`.
- Anchor 6/6, Completed 5/5, and five of six Discovery cards loaded real provider
  images. `あしたのジョー` truthfully used the approved provider-failure/no-image
  placeholder. Console errors were zero.

### Work detail

- The hero keeps a 208 × 298 object-contain cover, provider facts, qualitative
  compatibility, contribution-backed evidence, the contracted status select
  plus planned toggle, and shared 160 px related cards.
- The real 600 px Rakuten cover settled in the inspected flow; document width
  was 933 / 933.
- Target-only reviews, community, fake score, generated art, and four direct
  state buttons were rejected because they conflict with product truth.

### Library

- Overview, recent, reading-progress, planned/completed, favorite, and management
  presentations are role-specific components backed only by real local records.
- The inspected state truthfully contained five completed records; document
  width was 948 / 948 and the shared footer stayed bottom-aligned.
- The target's fictional count of 410 and unsupported memo/sync content were not
  copied. Reading/favorite/editor visuals remain an evidence limit because the
  user's current records do not contain those states.

### Settings

- Existing capabilities are grouped into recommendation, DNA, local privacy,
  data, destructive, and app-info panels.
- Static panels use flat hairline surfaces; destructive hierarchy remains
  separate. Exactly three user-visible policy switches are shown while the
  hidden compatibility state is preserved for import/export truth.
- Target-only recommendation-strength, diversity, cloud, and account controls
  were not invented.

## Functional and semantic defects fixed during visual QA

1. Genre filtering could hide the canonical first recommendation while the
   resolver waited for that hidden item. The first actually visible item now
   opens the sequential cover gate.
2. The resolver previously truncated its targets to 18 before auxiliary shelves
   were derived, leaving rendered cards as permanent placeholders. It now uses
   every actually displayed featured, ranking, anchor, discovery, completed,
   and preview ID in visible-first order with stable de-duplication. Ranking,
   scoring, and shelf membership are unchanged.
3. An offscreen `sr-only` recommendation summary propagated shelf geometry to
   the document. Its positioned owner now contains that visual overflow while
   preserving local shelf scrolling.
4. Standard `CoverImage` used a `div` inside native selection buttons. The
   standard real/placeholder roots are now `span.block`; Hero structure is
   unchanged.

## Independent review

Gemini 3.7 Flash High was consulted component by component through Windows-native
`agy`. The accepted/rejected ledger is
`.qa/review/current-redesign/AGY_COMPONENT_REVIEW.md`. Gemini independently
accepted the final cover-target fix. It remained advisory; suggestions that
conflicted with higher product/UX contracts were rejected.

The fresh ChatGPT.com Oracle review intentionally prohibited a global GO verdict
and required per-component `PASS` / `DRIFT` / `UNKNOWN` evidence. Its valid
findings drove the shared card, onboarding, DNA, recommendations, Library, and
Settings detail passes. Oracle suggestions that would add unsupported features
or override the five-choice/expansion/status contracts were rejected as authority
inversions.

## Verification

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Latest expanded-card focused suite: 2 files / 28 tests passed.
- Final focused recommendation/media suite: 9 files / 55 tests passed.
- Production build: passed; 157 pages prerendered.
- Full Vitest: 85 files / 717 tests; 74 files and 701 tests passed, 11 files and
  16 tests failed. The failures are in unchanged Windows path/mode/CRLF fixtures,
  unchanged landing-logo session-storage mocks, and one domain-lint timeout;
  the redesign-focused suites are green.
- `git diff --check`: passed with Git's expected LF-to-CRLF checkout warnings.
- Scoped Prettier checks: passed.
- Fixed-five Playwright E2E was not run because this design workflow was limited
  to the user's chosen in-app browser; no standalone browser permission was
  inferred.
- No commit, push, PR, or deployment was performed.

## Remaining evidence limits

- A post-fix first-run onboarding capture would require a safe disposable origin
  or explicit permission to back up, clear, and restore the user's local data.
- Populated Library reading/favorite/editor captures require corresponding real
  persisted records.
- These are `UNKNOWN` visual states, not evidence of an observed product defect.

release result: pending explicit release/deployment authorization

---

# 2026-08-18 Top 10 first-place card addendum

- Source visual truth: `.qa/top-ten-first-card-reference.png`
- Rendered implementation: `.qa/top-ten-first-card-implementation.png`
- Full landing capture: `.qa/top-ten-landing-viewport.png`
- Normalized full-card comparison: `.qa/top-ten-first-card-pixel-comparison.png` (reference left, implementation right)
- Normalized background zoom: `.qa/top-ten-first-card-background-comparison.png` (reference left, implementation right)
- Route and state: `http://localhost:3000/?landing=1`, resolved landing, first Top 10 item
- Browser viewport: 1366 x 1077 CSS px at device pixel ratio 1.5
- Source pixels: 284 x 341; card crop 263 x 313 at x=10, y=14
- Implementation pixels: 112 x 133; rendered card CSS size 112 x 133.33
- Density normalization: source crop downsampled at its natural 21:25 ratio to 112 x 133; the browser capture was converted from viewport CSS coordinates to screenshot pixels before the 112 x 133 element crop

## Comparison evidence

The component-level comparison shows the source on the left and implementation on the right. The original yellow-body edge was sampled every two normalized pixels and traced into the external SVG. On the final capture, the sampled body-edge mean absolute error is 1.28 px and the maximum sampled error is 5 px. The edge now descends gradually from the upper right, turns sharply through the 30-34 px rows, and finishes against a source-matched warm dark shadow rather than a second opaque yellow wedge. The rank glyph bounding box is 13,48-25,76 in the source and 13,48-25,75 in the implementation. Crown, stacked `TOP` / `10`, surface colors, and the full card ratio were also measured from the normalized source.

## Fidelity surfaces

- Typography: existing product fonts remain; the library crown is 18 px, the crown-label inset is 8 px by 5 px, and the landing rank is horizontally condensed to the measured source glyph box.
- Layout: the traced surface occupies 58% of card width with a square mask box, the first card uses the source-derived 21:25 ratio, and the rank is positioned at x=10 px and y=28 px before glyph metrics.
- Color: measured semantic tokens separate the 0.79-lightness yellow surface, saturated rank number, ochre badge ink, and warm dark shadow.
- Imagery: the supplied design uses a different work; the product keeps the real catalog cover and its established image contract.
- Copy: rank, title, metadata, and accessible link label remain data-driven.

## Comparison history

1. P1: rectangular plate, undersized crown, and high rank position. Fixed with an external curved SVG mask, a 20 px library crown, and lower rank placement.
2. P2: first curved pass covered 72% of the card width. Reduced to 64% so the upper-right artwork remains exposed.
3. P1: enlarged review showed that the reference is an S-like two-layer shape, while the first SVG remained a single C-like sweep. Rebuilt the SVG as an opaque S-curve body plus a blurred 48% alpha lower tail, changed its ratio to 6:5, and reduced its final width to 58%.
4. P1: user review rejected the hand-tuned result. Investigation found that the implementation crop used document coordinates against viewport pixels, cutting the card about 8 px low, while the 263 x 313 source crop had been vertically compressed to 112 x 130. Replaced that invalid comparison with CSS-to-screenshot coordinate conversion and natural-ratio 112 x 133 crops.
5. P1: the corrected comparison showed the hand-tuned SVG sweeping inward too late, an extra yellow tail, an over-bright surface and border, a dark oversized badge, and a rank glyph nine pixels low and too wide. Traced the source body edge row by row, removed the yellow tail and special gold border, restored the 21:25 card ratio, sampled dedicated semantic colors, resized/repositioned the badge, and matched the rank glyph box.
6. Post-fix normalized full-card and focused background comparisons have no actionable P0, P1, or P2 differences. Body-edge MAE is 1.28 px; the remaining maximum 5 px sample occurs within the antialiased 30-34 px turn.

## Interaction and runtime checks

- Card navigation reached `/works/a-silent-voice`; Back restored the landing shelf.
- Browser console errors: none.
- Focused component tests, typecheck, lint, production build, formatting, and `git diff --check`: passed.

P3: the supplied visual uses different cover artwork, so the warm shadow's perceived luminance differs over the two underlying images; the measured SVG contour, shadow token, and opacity are shared independently of catalog content.

final result: passed
