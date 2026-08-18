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

# 2026-08-18 Manga DNA radar-axis addendum

- Source visual truth:
  `C:/Users/Bell/AppData/Local/Temp/codex-clipboard-fee05894-6013-4ec6-82c2-21c63cf3f714.png`
  (435 x 313 px).
- Rendered implementation: `.qa/taste-radar-implementation.png`.
- Full route capture: `.qa/taste-radar-after.png`.
- Same-state comparison input: `.qa/taste-radar-comparison.png` (reference left,
  implementation right).
- Route and state: `http://localhost:3000/taste`, persisted Manga DNA profile,
  seven highest confirmed deterministic profile axes.
- Browser viewport: 1366 x 1077 CSS px at device pixel ratio 1.5.
- Rendered radar card: 472.49 x 437.29 CSS px.

## Comparison evidence

The reference's useful contract is now present: every polygon direction ends in
an outer leader and point, followed immediately by its real Japanese factor name
and current qualitative value. Long labels wrap at a semantic separator or a
stable midpoint, so the displayed text remains the factor-dictionary label. The
implementation intentionally keeps seven data-backed axes rather than copying the
reference's six fictional axes.

The dotted overall-average polygon and both legend rows from the reference were
excluded. Raw numeric values were also excluded because the higher `/taste`
contract requires the existing qualitative labels (`ほどほど`, `強め`,
`とても強め`) instead of percentages or profile numbers.

## Accessibility and runtime checks

- The chart SVG remains decorative with `aria-hidden="true"`.
- The same factor/value pairs remain available as a semantic screen-reader list;
  only its former visual table presentation was removed.
- The final browser DOM contained seven visible `.taste-radar__label` nodes,
  seven accent value points, no overall-average label or legend, and no root
  horizontal overflow (`1351 / 1351`).
- Every measured label stayed within the radar card boundary. The card itself had
  equal client and scroll dimensions (`471 / 471` wide, `436 / 436` high).
- The fresh route cycle logged Vite debug/info messages and no runtime error or
  warning.

## Verification

- Focused TasteFlow suite: 1 file / 14 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Scoped Prettier check: passed.
- Production build: passed; 157 pages prerendered.

final result: passed

---

# 2026-08-18 Manga DNA top-preferences addendum

- Source visual truth:
  `C:/Users/Bell/AppData/Local/Temp/codex-clipboard-671e269a-23e8-4660-9afa-4f6e3e67849d.png`
  (854 x 325 px).
- Rendered implementation: `.qa/taste-top-preferences-implementation.png`.
- Full route capture: `.qa/taste-top-preferences-after.png`.
- Focused comparison input: `.qa/taste-top-preferences-comparison.png`
  (reference's first three cards left, real product Top 3 right).
- Route and state: `http://localhost:3000/taste`, persisted Manga DNA profile,
  real deterministic Top 3 preferences.
- Browser viewport: 1366 x 1077 CSS px at device pixel ratio 1.5.
- Source focus crop: 520 x 315 px, normalized to 428 x 259 px.
- Implementation section: 427.5 x 241.46 CSS px; comparison crop 428 x
  242 px.

## Comparison evidence

The useful hierarchy from the reference is present in all three product cards:
a large semantic icon, centered factor name, prominent strength, and a quieter
supporting line. The previous 28 px cover thumbnails were removed because their
subjects were not legible at this card width. The actual anchor titles remain in
the supporting line, so explanation provenance is still visible.

The implementation intentionally keeps the domain's Top 3 rather than copying
the reference's fictional Top 5. It also keeps the contracted qualitative
strength (`とても強め`) instead of inventing percentages or percentile ranks.

## Fidelity surfaces

- **Typography:** the section heading, 14 px factor label, responsive 16/20 px
  strength, and 12 px evidence copy preserve the reference's four-level
  hierarchy without unsupported numeric emphasis.
- **Spacing and layout:** the three cards are equal at 128.72 x 182.13 CSS px,
  with centered icon/name/value anatomy and bottom-aligned evidence copy. The
  section and document have no horizontal overflow.
- **Colors and tokens:** existing canvas, surface, line, accent, strong-text, and
  muted-text tokens are preserved. The source's isolated green icon was not
  introduced into the product's single-accent semantic system.
- **Image and icon quality:** no unreadable raster cover remains in the cards.
  Existing Lucide assets provide factor-specific Zap, Gauge, and Paintbrush
  icons in the captured state; all are decorative because the adjacent heading
  supplies the accessible name.
- **Copy and content:** factor-dictionary names, qualitative profile values, and
  real anchor work titles remain data-driven. No source-only score or percentile
  copy was added.

## Runtime and verification

- Browser DOM readback: three cards, three icons, zero card cover images, and
  root width `1351 / 1351`.
- Browser console: no error or warning in the final route cycle.
- Focused TasteFlow suite: 1 file / 14 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Scoped Prettier check: passed.
- Production build: passed; 157 pages prerendered.

The first focused side-by-side comparison found no actionable P0, P1, or P2
differences. P3: the source icons use stronger glow and mixed cyan/green accents;
the implementation uses the closest existing icon library and the product's
single semantic accent.

final result: passed

---

# 2026-08-18 Manga DNA header-spacing addendum

- Source visual truth:
  `C:/Users/Bell/AppData/Local/Temp/codex-clipboard-2ddefe8c-1dd6-4b61-bc3c-721096007089.png`
  (1412 x 694 px, 144 dpi).
- Rendered implementation: `.qa/taste-spacing-after-viewport.png`
  (1351 x 1065 px browser capture).
- Focused comparison input: `.qa/taste-spacing-comparison.png` (reported
  state left, corrected state right).
- Route and state: `http://localhost:3000/taste`, persisted Manga DNA profile.
- Browser viewport: 1366 x 1077 CSS px at device pixel ratio 1.5.
- Comparison normalization: source crop 642 x 684 px; implementation crop
  423 x 451 px resized to 642 x 684 px so the same left-column region and the
  beginning of `選んだマンガ` can be judged together.

## Finding and comparison history

- **P2 spacing/layout rhythm:** the desktop header row was sized by the taller
  radar card. The left stack used `content-start`, leaving 16.92 px unused below
  `あなたの上位の好み`. Together with the intended 8 px section gap, the
  measured distance to `選んだマンガ` was 24.92 px.
- **Fix:** the desktop left stack now uses explicit `auto 1fr` rows, and the top
  preference section uses `auto 1fr` internally. The preference card row fills
  the available height instead of leaving an anonymous gap. The change is
  desktop-only; the existing mobile content-sized flow remains unchanged.
- **Post-fix evidence:** the top-preference and radar cards now share the same
  509.29 px bottom edge. `選んだマンガ` begins at 517.29 px, leaving exactly
  the intended 8 px gap. The focused comparison shows no remaining actionable
  P0, P1, or P2 spacing difference.

## Fidelity surfaces and verification

- Typography, colors/tokens, icons/image quality, and Japanese copy are
  unchanged; this correction affects only the desktop grid track sizing.
- Root width remains `1351 / 1351`, with no horizontal overflow.
- Browser console contains no error or warning after the hot update.
- Focused TasteFlow suite: 1 file / 14 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Production build: passed; 157 pages prerendered.

final result: passed

---

# 2026-08-18 Manga DNA adjustment-editor addendum

- Source visual truth:
  `C:/Users/Bell/AppData/Local/Temp/codex-clipboard-bd58022a-230e-48e4-b84e-f72116427d57.png`
  (763 x 752 px, 144 dpi).
- Before capture: `.qa/taste-workspace-before.png`.
- Rendered collapsed state: `.qa/taste-workspace-after-collapsed.png`.
- Rendered expanded state: `.qa/taste-workspace-after-expanded.png`.
- Focused side-by-side comparison: `.qa/taste-workspace-comparison.jpg`.
- Route and state: `http://localhost:3000/taste`, persisted Manga DNA profile.
- Browser viewport: 1366 x 1077 CSS px at device pixel ratio 1.5; captured
  bitmap 1351 x 1065 px.

## Finding and comparison history

- **P1 information density:** the old editor exposed 49 factor rows and 195
  adjustment choices at once. Its workspace was 3012.31 CSS px tall, so the
  category model was not scannable before the user encountered fine-grained
  controls.
- **P1 duplicated navigation:** six group-filter buttons repeated the same
  classification already represented by the five group cards.
- **P2 surface hierarchy:** a rounded workspace card wrapped five more rounded
  group cards, making the outer container an unnecessary visual boundary.
- **Fix:** the editor now starts with five data-derived category summaries in
  the reference order. Each row has a semantic category icon, real strongest
  factors, truthful adjustment/analysis status, and an explicit detail
  disclosure. Only one category can be open. The duplicated filter and outer
  card boundary were removed.
- **Post-fix evidence:** the collapsed workspace is 493.06 CSS px tall with five
  groups, five disclosures, zero visible detail panels, zero visible adjustment
  buttons, zero duplicate filter buttons, and zero horizontal overflow. All 49
  factor rows and 195 adjustment choices remain mounted behind the disclosures.

The implementation intentionally does not copy the reference's three-state
category control, reset button, or save button. Those controls do not exist in
the accepted product contract: individual factors retain the real five-state
preference model and save immediately. Copying the source controls would create
false behavior.

## Fidelity surfaces

- **Typography:** one action-oriented heading, quiet auto-save explanation,
  category heading, factor summary, state summary, and detail action form a
  deliberate hierarchy without dashboard-style numeric emphasis.
- **Spacing and layout:** the reference's five full-width category rows replace
  the repeated matrix. The row itself is the component boundary; the workspace
  no longer adds a second same-radius container.
- **Colors and tokens:** existing canvas, surface, line, accent, strong-text,
  and muted-text tokens are preserved. No new arbitrary color or decorative
  gradient was introduced.
- **Image and icon quality:** existing Lucide icons distinguish the five
  categories and are decorative because the adjacent heading supplies the
  accessible name. No raster asset or generated image was needed.
- **Copy and content:** every factor name, strength, count, and adjustment state
  comes from the deterministic profile or current persisted settings. No mock
  preference, percentile, or source-only action was added.

## Interaction, accessibility, and verification

- Each disclosure is a native button with a contextual accessible name,
  `aria-expanded`, `aria-controls`, a controlled panel, and a measured 44 px
  target. Closed panels use the native `hidden` state.
- Opening the narrative category exposed one panel and six real radiogroups.
  Opening the theme category set `?group=theme`; a full reload restored the same
  one open panel and its 22 radiogroups with no error or warning.
- The old all-expanded presentation assertion was test drift after the current
  accepted layout decision. It now verifies all five summaries, initial
  collapse, one-open-at-a-time behavior, and preservation of every factor row.
- Fresh browser reload: no error or warning; root horizontal overflow 0.
- Focused TasteFlow suite: 1 file / 14 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Scoped Prettier check: passed.
- `git diff --check`: passed.
- Production build: passed; 157 pages prerendered.
- Full Vitest suite: 712/728 passed. The 16 failures are outside the changed
  files and reproduce Windows line-ending/path, frozen artifact, permission,
  npm-spawn, timeout, and pre-existing landing-logo expectations; none exercise
  this editor. This is a full-suite verification limit, not evidence for the
  scoped UI result.

final result: passed for the scoped Manga DNA adjustment-editor change

---

# 2026-08-18 Manga DNA genre-detail layout addendum

## Source and comparison evidence

- User-reported current state: `.qa/genre-layout-review/02-user-report.png`
- Browser reproduction before the change: `.qa/genre-layout-review/01-current-browser.png`
- Original editor direction reference: `.qa/genre-layout-review/03-original-editor-reference.png`
- Gemini 3.7 Flash High evidence package: `.qa/genre-layout-review/gemini-evidence/`
- Gemini consultation result: `.qa/genre-layout-review/gemini-consultation.md`
- Browser result after the change: `.qa/genre-layout-review/02-after-browser.png`
- Cropped result card: `.qa/genre-layout-review/02-after-card.jpg`
- Side-by-side review: `.qa/genre-layout-review/genre-before-after.jpg`
- Verified route and viewport: `/taste?group=genre`, 1366 x 1077 CSS px, DPR 1.5

## Finding and decision

- **P1 structural defect:** the analysis-only genre group inherited the adjustable
  groups' desktop two-column row template. Its meter occupied 329.5 px of an
  886.67 px row while the absent adjustment control left 557.17 px, or about
  62.8%, unused.
- Gemini 3.7 Flash High independently verified the 11-file payload ledger and
  repository root identity, then selected the same direction: a desktop
  two-column by five-row meter grid that collapses to one column on mobile.
- Full-width meters were rejected because an approximately 886 px meter would
  remain visually overextended and retain ten rows. Chip or tag presentation was
  rejected because it would weaken the continuous 0-4 strength meaning and the
  explicit `まだ分析中` state.
- The other four groups keep their one-column FactorBar plus real five-state
  adjustment controls. No genre control or unsupported behavior was invented.

## After evidence

- Genre now renders two equal 435.33 px columns and five visual rows on desktop.
- The detail panel height decreased from 390.63 px to 195.31 px.
- All ten genre meters remain present with their qualitative labels and existing
  `role="meter"` semantics; visible genre radiogroups remain 0.
- Root horizontal overflow remains 0.
- The theme group still uses one detail column, the existing 329.5 / 549.17 px
  meter-control split, and all 22 visible radiogroups.
- Mobile one-column behavior is covered by responsive source and the component
  contract test; no separate live mobile capture was taken for this addendum.

## Verification

- Fresh browser reload: no error or warning; genre query state restored.
- Focused TasteFlow suite: 1 file / 14 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Production build: passed; 157 pages prerendered.

final result: passed for the scoped genre-detail layout change
