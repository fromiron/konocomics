# Design QA — `temp/design` component-fidelity redesign

## 2026-08-20 recommendations full-fidelity follow-up — final

This cycle supersedes the recommendation findings immediately below while
preserving their history. The target composition, current repository contracts,
real Catalog/provider data, and the rendered route were reviewed together. The
recommendation formula, plan order, stored actions, and explanation provenance
were not changed.

### Source and comparison evidence

- Visual target: `docs/planning/redesign/visual-targets/04-recommendations.png`
  at 948 × 1659.
- Final implementation capture:
  `.qa/recommendations-implementation-2026-08-20/18-desktop-final.png` at the
  same 948 × 1659 viewport and initial state.
- Required same-size combined comparison input:
  `.qa/recommendations-implementation-2026-08-20/19-target-vs-implementation.png`.
- Final mobile capture:
  `.qa/recommendations-implementation-2026-08-20/20-mobile-final.png` at a
  390 × 844 CSS viewport.
- Browser: the user-selected Codex in-app browser at
  `http://localhost:3000/recommendations`, with the real saved profile,
  deterministic recommendation plan, Catalog covers, and provider responses.

### Findings and resolution

1. **P1 — the first recommendation no longer communicated the target's lead
   hierarchy.** The first card now enters expanded at 352 px, while the second
   and third remain 242 px and all three reserve the same 212 px height. The
   separate selected-work evidence panel remains directly below, with the real
   cover used both as an uncropped foreground image and as its decorative
   same-URL backdrop.
2. **P1 — expansion ownership allowed two cards to be open at once.** Expansion
   is now synchronized by the featured shelf. Pointer or keyboard focus moving
   to another card collapses the prior card, selects the new work, and updates
   the evidence panel. Runtime focus on rank two produced widths 231 / 352 /
   231, one expanded article, and matching selected/detail work IDs.
3. **P1 — the card actions still resembled an equal segmented control.** The
   action row now uses three separated controls with an explicit hierarchy:
   `読みたい` is the accent action, `読んだ` is neutral, and `興味なし` only
   gains destructive color on intent. Desktop labels fit without clipping;
   mobile uses named icon controls with 44 px targets.
4. **P1 — the filter read as generic form scaffolding.** It remains a single
   integrated evidence rail with two native disclosure menus, truthful fixed
   sort copy, explicit policy checkboxes, and one update action. There are no
   `select` elements or decorative fake controls. The mobile rail collapses to
   one named 44 px disclosure; opening and closing it produced correct
   `aria-expanded` and display state.
5. **P2 — shelves were too sparse for the source density.** The anchor shelf no
   longer truncates its eligible candidate pool before grouping. It now shows
   eight grounded items, followed by six discovery items, six completed items,
   and all ten canonical ranking items without recalculating or reordering any
   recommendation score.
6. **P2 — paging and detail selection could diverge.** `MediaShelf` now reports
   the first visible card after a page move. The featured next control moved the
   track to the fourth work and changed both the selected card and detail panel
   to that same work ID.
7. **P2 — page rhythm ended below the reference frame.** Recommendation-only
   footer padding now uses the existing 20 px spacing token. At 948 × 1659 the
   footer begins at 1493.07 px, measures 165.45 px, and the document is exactly
   1659 px high with no horizontal overflow.
8. **Pruning and authenticity.** Removed passive motion from the action styling,
   retained only the contracted 200 ms hover intent / 240 ms card transition,
   and did not add generated key art, percentages, review counts, search,
   notification controls, or runtime AI copy from the concept image. Those
   target-only elements are intentionally omitted rather than simulated.

### Rendered interaction and accessibility readback

- Initial desktop state: one expanded card; widths 352 / 242 / 242 px; heights
  212 / 212 / 212 px; no root overflow.
- Keyboard focus on rank two: exactly one expanded card, selected work, and
  detail panel, all for `a-condition-called-love`.
- Featured page advance: detail and selection moved together from `dorohedoro`
  to `jojo-bizarre-adventure`.
- Mobile: three 133 px portrait cards remain visually unexpanded; all three
  reading actions are 44 px high; the filter is initially collapsed; root
  horizontal overflow is zero.
- Filter menus use native `details`/`summary`; policies remain named checkboxes;
  identity regions remain real links; decorative backdrop images remain hidden
  from accessibility APIs. Reduced-motion behavior is retained by the existing
  component contract and focused tests.

### Verification

- `pnpm typecheck`: passed.
- `pnpm lint`: passed with zero warnings.
- Focused recommendation contracts: 5 files / 38 tests passed, including
  initial expansion, one-open-at-a-time keyboard behavior, MediaShelf paging,
  dense shelf cards, and recommendation flow state.
- `pnpm build`: passed and prerendered 157 pages.
- Repository-wide Vitest: 76 files / 718 tests passed; 10 files / 15 tests
  failed in pre-existing Windows path/LF, frozen catalog/G2 artifact,
  permission/spawn, experiment golden, and landing-logo fixtures. No
  recommendation test remains failing. This is a `VERIFICATION LIMIT`, not a
  substitute for the passing rendered recommendation flow.
- Scoped Prettier, `git diff --check`, and final status inspection are recorded
  with this cycle's handoff.

`final result: passed for the scoped recommendations fidelity pass` — the
same-state comparison contains no remaining P0, P1, or P2 defect that can be
fixed without inventing unavailable product data or violating the real-cover
and capability-truth contracts.

## 2026-08-20 recommendation filter and action hierarchy — final

The recommendation pass was reopened after user review identified two remaining
AI-slop signals: three box-like select controls in `絞り込み` and an equal,
rounded three-button group repeated below every personalized card. Both were
composition defects rather than product-capability gaps.

### Source and comparison evidence

- Visual target: `docs/planning/redesign/visual-targets/04-recommendations.png`.
- Before desktop/mobile captures:
  `.qa/leeskills-global-pass-2026-08-20/before/04-recommendations-948x1659.png`
  and `04-recommendations-390x844.png`.
- Final desktop expanded state:
  `.qa/leeskills-global-pass-2026-08-20/after/04-recommendations-expanded-final-948x1659.png`.
- Final mobile state:
  `.qa/leeskills-global-pass-2026-08-20/after/04-recommendations-actions-390x844.png`.
- Same-viewport source/current input:
  `.qa/leeskills-global-pass-2026-08-20/comparisons/04-recommendations-target-after.png`.
- Browser: the user-selected Codex in-app browser at
  `http://localhost:3000/recommendations`, using the real saved profile,
  recommendation plan, Catalog, and provider covers.

### Findings and resolution

1. **P1 — filter controls read as generated dashboard selects.** Replaced the
   three independent boxes with one integrated rail. Genre and shelf use native
   `details`/`summary` disclosure semantics with named option buttons; the fixed
   recommendation order is rendered as information rather than a fake control.
   Existing policy checkboxes remain actual checkboxes but lose pill styling.
2. **P1 — card actions implied false equality.** The collapsed footer now gives
   `読みたい` the broad accent cell and reduces `読んだ` / `興味なし` to
   quieter icon actions. On card expansion, labels reveal and the controls gain
   separation. The desktop evidence panel uses compact text actions with the
   same callbacks and no content overflow.
3. **P2 — accent text contrast inherited the generic button foreground.** The
   primary action now forces the contracted dark `--on-accent` token. Live
   computed readback was `oklch(0.15 0.02 250)` over
   `oklch(0.7525 0.1382 236.09)`.
4. **P2 — desktop filter labels wrapped and mobile update alignment drifted.**
   The rail now reserves a non-wrapping heading and policy span at desktop; on
   mobile the update action aligns to the trailing edge after the policy rows.
5. **Pruning.** Removed the unused forced-card-label presentation path. No new
   design-system primitive or dependency was introduced.

### Runtime and accessibility readback

- Recommendation route contains zero `select` elements and two native filter
  disclosures.
- Selecting `アクション` closed the disclosure, wrote `?genre=action`, and
  reduced the live personalized result count from 10 to 6.
- At 948 × 1659 the active card measured approximately 351 px and adjacent
  cards approximately 241 px, preserving the accepted expanded/collapsed
  contract. All detail action `scrollWidth` values fit their rendered widths.
- At 390 × 844 the filter reflowed without native select boxes, card actions
  retained the 44 px minimum, and the recommendation shelf remained reachable
  in the first viewport.
- Hidden compact labels retain explicit `aria-label` values; expanded labels are
  the visible names. Filter option selection is keyboard-operable through
  native disclosure and button behavior.

### Leeskills and mechanical verification

- All ten leeskills outputs were refreshed and their validators passed: content
  grounding, anti-slop score, slop signals, structure, specificity, component
  contract/interaction governance, visual entropy, motion necessity,
  accessibility, and prune-and-verify. The remediation-oriented score is
  94/100 with no hard failure; it is not treated as proof by itself.
- `pnpm typecheck`, `pnpm lint`, scoped Prettier, `git diff --check`, and the
  production build passed. The build prerendered 157 pages.
- Focused recommendation contracts passed: 3 files / 33 tests.
- Repository-wide Vitest completed 76 passing / 10 failing files and 706
  passing / 25 failing tests. The failures are outside the touched
  recommendation files and reproduce Windows path/LF, frozen artifact,
  permission/spawn, deterministic golden, and landing-logo fixture problems.
  The isolated unchanged landing-logo suite is 16/20. This remains a
  `VERIFICATION LIMIT`; it does not replace the passing focused product path.

`final result: passed for the recommendation filter and action-hierarchy scope`

## 2026-08-18 expansion restoration and settings density — final

This pass corrects the preceding equal-card decision. Treating the user's large
number-one card as a replacement for the existing expansion contract was
`AUTHORITY INVERSION`, and rewriting the flow tests around that replacement was
`TEST DRIFT`. The accepted composition is an expanded lead card plus collapsed
neighbors, followed by the selected-work evidence panel shown in the visual
target.

### Source and implementation identity

- Personalized recommendation target:
  `C:/Users/Bell/AppData/Local/Temp/codex-clipboard-1df9584a-3f58-4f58-b35c-411bbea786ea.png`
  (974 × 491 px), with the full-screen target at
  `docs/planning/redesign/visual-targets/04-recommendations.png`.
- Settings target: `docs/planning/redesign/visual-targets/07-settings.png`.
- Final same-state comparison inputs:
  `.qa/leeskills-full-pass/comparisons/personalized-recommendations-target-current.png`,
  `recommendations-target-current.png`, and `settings-target-current.png`.
- Browser: the user-selected Codex in-app browser using the real local profile,
  recommendation plan, Catalog, and provider covers at
  `http://localhost:3000/recommendations` and `/settings`.
- Scope: `ExpandableMediaCard`, `MediaShelf`, the personalized recommendation
  card/detail composition, SettingsFlow/DataSettings composition, and their
  focused contract tests. Recommendation calculation, ordering, persistence,
  and deletion readback semantics are unchanged.

### Findings and resolution

1. **P1 — the real card-expansion path had been removed.** Restored
   `ExpandableMediaCard` as the width, pointer-intent, focus, touch-preview, and
   reduced-motion owner. The first hovered/focused card expands while adjacent
   cards remain collapsed; the selected evidence panel remains a separate,
   explicit layer rather than replacing expansion.
2. **P1 — tests had stopped exercising the product path.** Restored assertions
   around `data-expanded`, the identity link, expansion callbacks, cover
   geometry, actual detail trigger, and opener focus. The unused-primitive-only
   success condition no longer defines the flow contract.
3. **P1 — `すべて削除` inherited another panel's height.** `DataSettings`
   returned two `h-full` roots into a stretching two-column parent. The delete
   action is now the third compact row inside the single full-width `データ`
   panel, matching both the screen contract and target hierarchy. Its typed
   confirmation, session-only/indeterminate states, authoritative readback, and
   destructive button remain intact.
4. **P2 — the personalized block was too loose and its controls were misplaced.**
   Desktop cards now reserve 209 px height, the evidence panel resolves to
   220 px, card-to-detail spacing is 12 px, and the whole 974 px comparison
   composition is 493 px high versus the 491 px target. Shelf arrows moved from
   the heading action cluster to 44 px card-center overlays; the next-card sliver
   is masked by the forward control surface.
5. **P2 — the detail panel read as four equal table cells.** Its columns now
   follow the target's cover / identity / evidence / hero proportions. Internal
   padding and caution typography were tightened without hiding the
   contribution-backed explanation or qualitative confidence.
6. **P2 — provider artwork cannot be substituted with generated key art.** Real
   portrait covers remain object-contained. The same URL supplies the decorative
   atmosphere and informative cover; no crop, synthesized landscape artwork,
   percentage, review count, or runtime AI copy was introduced.
7. **Accessibility and motion.** The work identity remains a real link; all
   reading and shelf controls retain 44 px targets. The panel no longer places
   its full changing contents in an atomic live region. The explicit reason
   trigger owns `aria-expanded`/`aria-controls`, and close restores focus to that
   trigger. Touch keeps the fixed portrait-card/Quick Preview contract, while
   fine-pointer expansion retains the 200 ms intent and reduced-motion fallback.

### Render verification

- 974 × 900, fine pointer: first four card widths are 352 / 242 / 242 / 242 px;
  the first card is expanded, every card is 209 px high, the evidence panel is
  220 px high, its gap is 12 px, and root horizontal overflow is 0.
- 948 × 1659: the first expanded card, two collapsed cards, centered overlay
  controls, selected-work panel, and following Shelf were inspected together
  against the full target.
- 390 × 844: cards use a portrait stack (132.77 × 404.43 px with a
  131.44 × 188.39 px cover), remain unexpanded, hide desktop overlay controls,
  and produce 0 root horizontal overflow. The first three provider covers
  settled successfully.
- Settings at 948 px: the single `データ` panel is 868.67 × 429.72 px and owns
  `エクスポート`, `インポート`, and `すべて削除`; no standalone delete heading
  remains. At 390 px it is 342.67 px wide, the delete action remains 44 px high,
  and root overflow is 0.

### Mechanical verification

- Focused contracts: 6 files / 45 tests passed, covering the expandable card,
  MediaShelf, recommendation flow/motion list, Settings flow, and policy
  persistence.
- `pnpm typecheck`, `pnpm lint`, scoped Prettier, `git diff --check`, and
  `pnpm build` passed. The production build prerendered 157 pages.
- Playwright discovers all 10 fixed desktop/mobile E2E scenarios after adding
  the Node 26 JSON import attribute. The run cannot start in this environment
  because its configured `chromium_headless_shell-1234` executable is absent;
  this is a `VERIFICATION LIMIT`, not an observed product-flow failure. The
  rendered desktop/mobile states and primary expansion/detail interactions were
  verified through the user-selected in-app browser instead.
- All ten leeskills reports in `.qa/leeskills-full-pass/reports/` pass their
  structural validators: content grounding, copy specificity, structure,
  component contract, visual entropy, motion necessity, accessibility,
  anti-slop, interaction governance, and prune-and-verify.
- No Catalog source or generated artifact changed; Catalog regeneration was not
  part of this component-fidelity pass.

`final result: passed` — the original expansion contract, the target's selected
detail composition, and the compact settings danger row now coexist without
changing recommendation or persistence semantics.

## 2026-08-18 seven-screen fidelity pass — final

### Source and baseline identity

- Source visual truth: `docs/planning/redesign/visual-targets/01-home.png` through
  `07-settings.png`.
- Current branch: `redesign-fidelity-pass` from `a99c47e`.
- Browser: the user-selected Codex in-app browser at `http://localhost:3000`.
- Reference/current captures use the same CSS viewport: Home 1024 × 1536, all
  other routes 948 × 1659. Current renders use the user's real Catalog/provider
  data; target-only generated copy, artwork, percentages, and controls remain
  visual context rather than product requirements.
- Baseline captures: `.qa/redesign-fidelity/baseline/`.
- Combined comparison inputs: `.qa/redesign-fidelity/comparisons/`.
- First implementation round: `.qa/redesign-fidelity/round-1/`.
- Final desktop captures: `.qa/redesign-fidelity/final/01-home.png` through
  `07-settings.png`.
- Final unscaled side-by-side inputs:
  `.qa/redesign-fidelity/final-comparisons/01-home-comparison.png` through
  `07-settings-comparison.png`.
- Final 390 × 844 mobile captures: `.qa/redesign-fidelity/final/mobile/`.

### Baseline findings

1. **P1 — Library state grids broke the Shelf composition.** The 11 completed
   records wrapped to a second row, extending the document to 2035 px and
   replacing the reference's one-row media scan with a catalog grid. Fixed by
   reusing `MediaShelf` for overview states. The current 948 px document is
   1757 px, the completed Shelf is 885 / 1632 px, and root overflow is 0.
2. **P2 — Recommendation criteria and filters read as table controls rather
   than the reference's evidence strip.** Fixed with a title/description row,
   three truthful icon-backed metrics, and a segmented filter rail. No new
   metric, match score, or unsupported filter was invented.
3. **P2 — Manga DNA evidence works were thumbnail rows.** Fixed as five
   168 × 176 media cards using the same provider covers, real factor labels,
   and unchanged work links. Every cover remains object-contain and all five
   loaded successfully in the live browser.
4. **P2 — Work-detail compatibility was a generic chip block.** Fixed with
   three group-derived Lucide icon cards while keeping the exact generated
   contribution sentences, caution, anchor work, and qualitative confidence.
   Synopsis and factors now share one bounded information surface instead of
   two equal-height floating cards.
5. **P2 — Home/detail backdrops and the Settings header lacked the reference's
   visual anchor.** The existing provider cover backdrop is now right-weighted
   and legible behind a left-to-right scrim. Settings uses a decorative Lucide
   gear cluster; no generated feature, handcrafted SVG, or false control was
   added.

### Final verification

- All seven final desktop captures were inspected beside their source target in
  one combined input per screen. No actionable P0, P1, or P2 component-fidelity
  defect remains after the final pass.
- At 948 px the final document heights are DNA 2086 px, recommendations 1995 px,
  work detail 2057 px, Library 1757 px, and Settings 1812 px. Every route has
  `clientWidth === scrollWidth`; no root horizontal overflow remains.
- At 390 × 844, all seven routes have a 375 px client/scroll width. Home and
  onboarding remain immersive with no bottom navigation; DNA,
  recommendations, detail, Library, and Settings expose only the mobile bottom
  navigation. The desktop navigation is hidden on every mobile route.
- Live interaction checks passed for the Featured recommendation card's 200 ms
  hover expansion, evidence reveal, Quick Preview URL/dialog lifecycle, Library
  Shelf forward movement (0 → 351.33 px), and Grid/List URL plus pressed-state
  switching. The in-app browser's responsive viewport does not emulate a touch
  pointer, so the touch-specific Quick Preview gesture remains covered by the
  focused component/flow tests rather than claimed as a live touch run.
- Focused UI tests: 12 files / 104 tests passed. `pnpm typecheck`, `pnpm lint`,
  `git diff --check`, and the production build passed; the build prerendered 157
  pages. Scoped Prettier checks pass.
- The repository-wide Prettier command remains red on 372 unchanged historical
  files. The accidental full Vitest run completed 76 passing / 10 failing files
  and 713 passing / 15 failing tests; the failures reproduce unchanged Windows
  path, permission, LF/CRLF, frozen-artifact, npm-spawn, and landing-logo fixture
  issues. They do not exercise the changed fidelity components.
- `pnpm catalog:validate` remains red because the three existing generated
  Catalog copies are stale/not byte-identical (`data/generated/catalog-v1.json`,
  `src/data/generated/catalog-v1.json`, and
  `public/catalog/catalog-v1.v1-83f85ca42c87.json`), alongside 566 review
  warnings. This fidelity pass changed no Catalog source or generated artifact,
  so no out-of-scope Catalog rebuild was performed.
- First-run onboarding cannot be captured in the user's populated browser
  without mutating persisted profile data. Add mode is the live visual evidence;
  the first-run state remains covered by the existing onboarding tests.

`final result: passed` — seven-screen fidelity and cross-viewport QA are complete.

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
- Fine-pointer feedback uses border, background, shadow, or a component-specific state; generic hover Y-axis lift is not used.
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

## 2026-08-21 landing shelf size balance — final

This pass implements the reviewed size relationship between the editorial
Top 10 and discovery shelves without changing their component roles or adding a
carousel dependency.

### Comparison target and normalization

- Source visual truth:
  `docs/planning/redesign/visual-targets/01-home.png` (1024 × 1536 px).
- Before implementation:
  `C:\Users\Bell\AppData\Local\Temp\konocomics-size-review-20260821\01-current-landing.png`.
- Browser-rendered implementation:
  `C:\Users\Bell\AppData\Local\Temp\konocomics-size-review-20260821\03-implemented-112-152.png`
  (1497 × 1066 px output). Live browser readback during measurement was
  1512 × 1077 CSS px at device pixel ratio 1.5.
- Combined focused comparison:
  `C:\Users\Bell\AppData\Local\Temp\konocomics-size-review-20260821\05-source-implementation-shelves.png`
  (2000 × 804 px). The source media region was cropped to 945 × 760 px and
  scaled to 1000 × 804; the implementation media region was cropped to
  1160 × 840 px, scaled to 1000 × 724, and bottom-padded to the same comparison
  height. Container widths are normalized, while the different source and live
  viewport states are kept explicit rather than treated as pixel-identical.
- State: dark landing route with the editorial accessory on rank one and the
  Top 10 track at its initial position.

### Earlier finding, fix, and post-fix evidence

- **P2 — shelf roles had an excessive size contrast and the Top 10 did not
  read as horizontally navigable.** The earlier desktop widths were 96px for
  editorial Top 10 and 160px for discovery, an area contrast of about 2.86×;
  all ten Top 10 cards fit with unused track space.
- **Fix:** the existing variants now own the responsive contract directly:
  `editorial-ranking` is 96px on mobile and 112px from `sm`; discovery
  `cover-overlay` retains the 2.4-card mobile formula and becomes 152px from
  `sm`. Standard posters and personalized ranking cards are unchanged.
- **Post-fix browser evidence:** Top 10 cards measure 112 × 155.55 CSS px;
  the 1152px track has 1228px scroll width, nine complete cards plus a partial
  tenth card, and 76px overflow. Both named controls appear and the next/prev
  sequence moved the track 0 → 76 → 0. Discovery cards measure
  152 × 217.28 CSS px; all seven fit the same 1152px track with no unnecessary
  controls.

### Required fidelity surfaces

- Fonts and typography: unchanged. The approved Japanese headings, card title
  scale, shared editorial numeral typography, truncation, and optical weights
  remain stable; the revised widths introduce no new wrapping collision.
- Spacing and layout rhythm: the combined comparison shows a restrained
  hierarchy—discovery remains larger than Top 10, but the previous 2.86× area
  disparity is removed. Existing shelf gaps, section spacing, radii, borders,
  and 1200px media-container contract are unchanged.
- Colors and tokens: unchanged. The cyan accent, semantic dark surfaces,
  ranking gold, borders, and shadows continue to use the existing tokens.
- Image quality and asset fidelity: unchanged. Real Catalog/Rakuten covers
  continue filling the card frames with the existing top-aligned cover crop;
  no replacement art, placeholder shape, or new asset was introduced.
- Copy and content: unchanged and still truthful. Editorial ranking,
  non-personalized showcase, and discovery descriptions remain distinct.
- Interaction and accessibility: `MediaShelf` keeps CSS scroll-snap, touch
  scrolling, ArrowLeft/ArrowRight focus movement, `ResizeObserver` overflow
  detection, and accessible previous/next labels. The browser console contained
  no errors. Generic Y-axis lift remains absent.
- Responsive evidence: the changed desktop utilities resolve to the measured
  112px and 152px widths. The mobile values themselves were not changed and are
  protected by the component tests (96px Top 10 and the existing 2.4-card
  discovery formula). The in-app browser surface did not expose an exact 390px
  viewport control, and the source target has no matching mobile frame, so no
  false mobile pixel-parity claim is made.

### Verification

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Focused Vitest run: 4 files, 17 tests passed.
- `pnpm build`: passed; 157 routes prerendered.
- Scoped `git diff --check`: passed; only existing CRLF normalization warnings
  were reported.

No actionable P0/P1/P2 finding remains in this scoped shelf-size pass.

final result: passed

## 2026-08-21 ranking variants and editorial spotlight — final

This cycle is scoped to the shared `RankingCard` / `RankingShelf` contract used
by the landing editorial Top 10 and the personalized recommendation Top 10. It
preserves the recommendation engine, Catalog data, cover-image policy, and the
existing S-shaped ranking asset.

### Source and comparison evidence

- Visual source of truth:
  `docs/planning/redesign/visual-targets/01-home.png` at 1024 × 1536 px.
- Default landing capture:
  `.qa/ranking-variants/04-landing-normal-default.png`.
- Pointer state:
  `.qa/ranking-variants/02-landing-rank-2-hover.png`.
- Keyboard state:
  `.qa/ranking-variants/03-landing-rank-3-focus.png`.
- Personalized variant:
  `.qa/ranking-variants/05-recommendations-personalized.png`.
- Direct source/implementation comparison input:
  `.qa/ranking-variants/06-ranking-comparison.png`.

### Comparison history and fixes

1. **P1 — the same visual card role had two implicit ranking meanings.** The
   shared contract now requires either `editorial-ranking` or
   `personalized-ranking`; landing owns an explicit ten-ID editorial order,
   while `/recommendations` retains canonical personalized order.
2. **P2 — the S-shaped crown appeared only during first-card hover, leaving the
   shelf visually anonymous at rest.** Rank one is now the default spotlight.
   Fine-pointer hover moves the single accessory to the explored rank and
   restores rank one on exit. Keyboard focus follows the same rule.
3. **P2 — the previous shelf wrapper could create nested list items.**
   `RankingShelf` now delegates its children directly to the ordered
   `MediaShelf` track and declares the ranking variant on that track.

### Required fidelity surfaces

- Typography and copy: Japanese labels remain routed through `strings.ts`;
  landing says this is an editorial recommendation order rather than market
  popularity or a personalized result.
- Spacing and layout: all landing ranking cards stay at 96 × 133.33 CSS px in
  the inspected desktop state. Accessory movement is opacity-only and does not
  resize the card or shelf.
- Colors and assets: the existing yellow S-shaped SVG mask, crown icon, rank
  ink, cover overlay, and semantic dark tokens are retained.
- Interaction: default rank one, rank-two pointer hover, and rank-three
  keyboard focus were captured in the in-app browser. Only one editorial
  accessory is visible in each state.
- Accessibility: the ordered-list structure has direct `li` children; landing
  links expose `おすすめN位`, personalized links expose `N位`, and the visual
  accessory remains decorative.
- Personalized distinction: `/recommendations` keeps a persistent compact
  first-place crown and gold border without the editorial S plate.

### Verification

- Fresh landing and recommendations loads: no browser console warning or
  error.
- Focused ranking/landing/recommendations regression set: 5 files / 36 tests
  passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Production build: passed; 157 pages prerendered.
- Full repository Vitest run: 725/740 passed. The 15 failures are outside this
  scope and reproduce existing Windows EOL/golden, process-spawn, frozen data,
  and `LandingLogoReveal` worktree failures; the ranking regression set above
  is clean after the final interaction change.

No scoped P0/P1/P2 finding remains.

final result: passed

## 2026-08-21 landing showcase intrinsic cover frame — final

This closeout supersedes the contained-cover geometry described immediately
above. The reported hover wobble and dark side gutters had two concrete causes:
featured state changed the foreground width/rotation and requested image size,
while the fixed `30/43` wrapper did not match every provider image's intrinsic
ratio. Radius was applied to that wrapper rather than to the visible artwork.

### Final implementation

- Both backdrop and foreground keep `requestedSize={400}` in every state, so
  hover does not replace the image URL or DOM node.
- The foreground uses one state-independent height, right inset, and four-degree
  angle. It shrink-wraps the uncropped image's intrinsic ratio instead of
  reserving a fixed-ratio opaque frame.
- The wrapper is transparent, borderless, radius-free, and overflow-visible.
  `--radius-cover` and the token-derived drop shadow are applied directly to the
  actual `img`, so the visible book and its rounded corners share one boundary.
- The decorative same-URL backdrop remains `object-fit: cover`; the informative
  foreground remains `object-fit: contain` with no crop or distortion.

### Browser comparison evidence

- User bug reference:
  `C:/Users/Bell/AppData/Local/Temp/codex-clipboard-d6269cea-3281-4e27-8d16-2aad12644318.png`.
- Final first-card capture:
  `.qa/landing-showcase-review/08-intrinsic-cover-radius.jpg`.
- Final real-hover capture:
  `.qa/landing-showcase-review/09-intrinsic-cover-hover.jpg`.
- Before the intrinsic fix, the first cover's wrapper/image box was
  144.65 x 197.64 CSS px while its natural 265:400 artwork occupied only
  130.94 px of that width, creating about 6.86 px of empty space per side;
  the image itself had `border-radius: 0`.
- After the fix, the first wrapper and image both measure
  138.02 x 197.18 CSS px. The wrapper computes to transparent, border 0,
  radius 0, and the actual image computes to radius 4 px.
- A real pointer hover on the second card changes only the card width from
  224 to 320 CSS px. Its wrapper and image remain
  134.10 x 196.90 CSS px and the source remains `_ex=400x400` before and
  after expansion. Browser error and warning logs are empty.
- Gemini 3.7 Flash High independently returned PASS with no P0-P3 findings for
  wrapper/image alignment, side gutters, hover stability, image integrity, or
  regressions. The primary review independently confirmed the same rendered
  behavior and did not rely on the external verdict as authority.

### Verification

- `pnpm exec vitest run tests/unit/components/media-cards.test.tsx tests/unit/components/cover-image.test.tsx --reporter=verbose`:
  2 files and 16 tests passed.
- The regression test rerenders featured to collapsed and confirms the same
  foreground image node and `_ex=400x400` source are retained.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed; 157 pages prerendered.
- Scoped `git diff --check`: no whitespace errors; only the existing Windows
  CRLF-to-LF warning was reported.

No actionable P0/P1/P2/P3 finding remains in this scoped review.

final result: passed

## 2026-08-21 landing showcase contained portrait cover — final

This cycle replaces the landscape pseudo-key-art crop in
`まず出会いたい作品` with a contained portrait book treatment. It keeps
the existing shelf, hover/focus controller, real provider URLs, Japanese copy,
and dark missing-cover fallback.

### Source and comparison evidence

- User concept:
  `C:/Users/Bell/AppData/Local/Temp/codex-clipboard-3e0ec49f-b5b1-47b7-a45c-776b0aafc622.png`
  at 638 × 472 px.
- Official page target:
  `docs/planning/redesign/visual-targets/01-home.png` at 1024 × 1536 px.
- Before browser capture:
  `.qa/landing-showcase-review/03-current-before-diagonal-concept.jpg`
  at 1497 × 1066 px.
- Final desktop capture:
  `.qa/landing-showcase-review/04-muse-contained-tilt.jpg`
  at 1497 × 1066 px.
- Real pointer expansion capture:
  `.qa/landing-showcase-review/05-muse-second-card-expanded.jpg`
  at 1497 × 1066 px.
- Combined source and focused implementation comparison:
  `.qa/landing-showcase-review/06-concept-and-implementation.png`
  at 1486 × 300 px. The supplied concept and the final rendered shelf were
  opened together in this single comparison input.
- Mobile capture:
  `.qa/landing-showcase-review/07-mobile-390.jpg` at 390 × 844 px.
- Desktop browser state: Codex in-app browser,
  `http://localhost:3000/?landing=1`, 1512 × 1077 CSS px, DPR 1.5.
  Mobile used a temporary 390 × 844 viewport override which was reset after
  capture.

The sketch is a geometric concept rather than a pixel-complete target. Its
physical-book idea is authoritative, while the reviewed implementation
intentionally reduces the extreme angle and keeps the full informative cover
inside the existing rounded card and text-safe layout.

### Comparison history and fixes

1. **P1 — the before state cropped the portrait cover into landscape
   pseudo-key-art.** Visible cover typography and artwork were cut at the card
   edges. The foreground now uses the unchanged Rakuten image with
   `object-fit: contain`, a cover frame, semantic border/radius, and the
   existing raised shadow. Only the same-URL decorative backdrop uses
   `object-fit: cover`.
2. **P2 — the literal 35–45 degree sketch would consume the text rail or
   require outside-card bleed.** Muse Spark and Gemini independently rejected
   that literal geometry. The shipped interpretation uses a static 6 degree
   featured angle and 1.5 degree collapsed angle, with no rotation animation
   and no mask.
3. **P2 — the first Muse pass updated the component but failed while writing
   regression tests.** A second scoped Muse pass updated only the existing
   behavior tests. Parent review corrected stale test wording and re-ran both
   media-card and CoverImage suites.

### Required fidelity surfaces

- Fonts and typography: unchanged Japanese title, creator, and metadata styles;
  desktop and 390 px captures keep the text hierarchy readable without cover
  typography being cropped.
- Spacing and layout rhythm: desktop featured card remains 320 × 216 CSS px and
  collapsed cards remain 224 × 216 CSS px. The featured rotated foreground
  bounding box is 159.19 × 202.53 px with 6.74 px top/bottom clearance and
  3.18 px right clearance. Collapsed foreground is 131.82 × 192.16 px with
  11.92 px top/bottom clearance and 10.22 px right clearance.
- Colors and tokens: existing canvas/surface/accent gradients, semantic spacing,
  radius, line, and shadow tokens are reused; no hex color or new visual token
  was introduced.
- Image quality and asset fidelity: the 397 × 600 featured provider cover
  computes to `object-fit: contain` in the foreground, with no distortion,
  crop, text synthesis, or duplicate asset. The blurred backdrop retains
  `object-fit: cover` as a decorative atmosphere layer.
- Copy and content: unchanged real Japanese Catalog title, creator, genre, and
  status data. Missing artwork continues to show the dark semantic fallback and
  never requests `placehold.co` or displays `TEST`.

### Interaction and responsive evidence

- A real in-app-browser pointer move onto the second card changed card 1 from
  320 to 224 px and card 2 from 224 to 320 px after the existing hover intent.
  The newly featured second cover changed to the 6 degree/44% composition.
- The 390 × 844 capture keeps both portrait covers entirely inside their
  139.17 × 104.38 px cards. Featured foreground clearance is 3.93 px vertically
  and 8.09 px on the right; collapsed clearance is 5.84 px vertically and
  11.49 px on the right.
- The interaction controller in `home-showcase.tsx` was not changed. Keyboard
  focus expansion, coarse-pointer suppression, pointer cancel, and reset
  behavior retain their existing product path.
- Browser console readback reported no errors or warnings in desktop hover and
  mobile states.

### Independent and parent review

- Gemini 3.7 Flash High reviewed the source, component, tests, before/after
  captures, live metrics, and responsive contract. Verdict: **PASS**, no
  P0/P1/P2 findings. Its only P3 note is acceptable coupling of regression
  tests to the approved Tailwind geometry values.
- Parent review confirmed the computed cover fit, source dimensions, rotated
  bounding boxes, card containment, real pointer expansion, mobile containment,
  unchanged fallback, and absence of browser console errors.

### Verification

- `pnpm vitest run tests/unit/components/media-cards.test.tsx tests/unit/components/cover-image.test.tsx --reporter=verbose`:
  2 files / 15 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed; 157 pages prerendered.
- `git diff --check` on the scoped files: no whitespace errors; only the
  existing Windows CRLF-to-LF warning was reported.

No actionable P0/P1/P2 finding remains in the contained portrait-cover change.
No commit was created.

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

## 2026-08-21 landing showcase backdrop, fallback, and blend — final

This cycle is scoped to the expanded/featured card in `まず出会いたい作品`.
It preserves the existing landing composition, real Catalog/provider data,
Japanese copy, responsive card dimensions, and interaction contract.

### Source and comparison evidence

- Visual source of truth:
  `docs/planning/redesign/visual-targets/01-home.png` at 1024 × 1536 px.
- Before focused capture:
  `.qa/landing-showcase-review/01-before-focused.png` at 336 × 232 px.
- Final browser capture:
  `.qa/landing-showcase-review/02-after-browser.png` at 1497 × 1066 px.
- Browser state: Codex in-app browser at `http://localhost:3000/?landing=1`,
  1512 × 1077 CSS px, DPR 1.5, first showcase card featured/expanded.
- The source and final capture were opened together in the same comparison
  input. The component was compared structurally rather than by whole-page
  pixel overlay because the source uses illustrative Korean content at a
  different page viewport while the product must retain Japanese copy and real
  Catalog/provider artwork.

### Comparison history and fixes

1. **P1 — the background wrapper overflowed the card but its image remained
   `object-fit: contain`, leaving a dark strip at the right edge.** The initial
   attempted descendant selector generated `.cover-image image` because
   Tailwind interpreted underscores as spaces; the unit assertion was a false
   positive. Live-browser computed style caught the failure. The final scoped
   selector is `[&>img]:!object-cover`, which compiles to a direct-child rule and
   leaves the global informative `CoverImage` default at `object-contain`.
2. **P1 — missing provider artwork was replaced by a red remote `TEST`
   placeholder.** `HomeShowcaseShelf` no longer constructs the `placehold.co`
   URL. It passes the nullable real cover value, allowing the existing dark
   semantic fallback to retain the actual title, creator, ordinal, and metadata
   without an external image request.
3. **P2 — the right foreground cover still read as a separate panel.** Its left
   mask widened from a 22% fade (`black 78%` to transparent) to a 52% fade
   (`black 48%` to transparent), and the seam-emphasizing shadow was removed.
   The subject remains opaque on the right while the left edge blends into the
   blurred full-card backdrop.

### Required fidelity surfaces

- Typography and copy: unchanged; the real Japanese title, creator, and
  metadata remain visible. No mock-only copy was introduced.
- Spacing and layout: card remains 320 × 216 CSS px in the verified state;
  card width, shelf rhythm, and expansion behavior were not changed.
- Colors and tokens: the no-cover branch uses the existing dark semantic
  surfaces and accent-derived treatment; the red debug placeholder is gone.
- Image quality: browser readback reports both backdrop and foreground images
  as `object-fit: cover`. The 363.28 px scaled backdrop extends beyond the
  320 px card before clipping, and the foreground right edge reaches the card
  boundary. The foreground mask computes to
  `linear-gradient(to left, black 48%, transparent 100%)` with `box-shadow:
none`.
- Interaction and accessibility: featured state, link naming, real image
  semantics, and the global contain/no-crop cover contract are unchanged.

### Verification

- Fresh browser reload: no console errors; no `TEST` text or `placehold.co`
  image source in the showcase cards.
- Live computed style: backdrop `object-fit: cover`; foreground `object-fit:
cover`; widened left mask present; foreground shadow `none`.
- `pnpm vitest run tests/unit/components/media-cards.test.tsx`: 7 passed.
- `pnpm vitest run tests/unit/components/cover-image.test.tsx`: 8 passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Production build: passed; 157 pages prerendered.
- The full repository test command was not a clean gate in this Windows
  worktree because existing unrelated EOL golden mismatches, an `npm` spawn
  environment failure, and landing-logo tests failed. The focused component
  suites above pass and reproduce the changed contracts.

No P0/P1/P2 finding remains in this scoped card review. The naturally missing
cover branch was verified by the component and shelf tests; the current live
Catalog response supplied artwork for all four visible cards, so that fallback
could not be captured naturally without altering runtime data.

final result: passed

## 2026-08-21 landing showcase contained portrait cover — superseding closeout

This closeout supersedes the historical foreground-cover/mask state immediately
above. The current foreground is an uncropped, contained portrait cover with a
static 6 degree featured angle and 1.5 degree collapsed angle; only the
same-URL blurred backdrop remains `object-fit: cover`.

The complete source/implementation comparison, desktop and 390 px metrics,
pointer expansion evidence, Gemini PASS review, required fidelity surfaces, and
verification ledger are recorded in the earlier
`landing showcase contained portrait cover — final` section of this file.
No actionable P0/P1/P2 finding remains.

final result: passed

## 2026-08-21 landing showcase intrinsic cover frame — superseding closeout

This is the current closeout and supersedes the six-degree/1.5-degree geometry
described immediately above. The final foreground has one stable four-degree
angle and one intrinsic-ratio geometry in both featured and collapsed states.
Its wrapper and visible image have identical dimensions; the wrapper has no
frame or radius, while `--radius-cover` is applied directly to the `img`.
Hover changes only the card width and keeps the image node, dimensions, and
`_ex=400x400` source stable. The detailed pixel evidence, Gemini PASS review,
and final verification ledger are recorded in the earlier
`landing showcase intrinsic cover frame — final` section.

final result: passed

## 2026-08-21 editorial ranking numeral consistency — final

This pass is scoped to the visible rank numeral before and after the editorial
Top 10 spotlight moves between cards.

### Evidence

- Source visual truth: `docs/planning/redesign/visual-targets/01-home.png`
  (1024 × 1536 px).
- Before capture: `.qa/ranking-font-consistency/01-before-default.png`.
- Final default state:
  `.qa/ranking-font-consistency/03-after-default-focused.png`.
- Final rank-two hover state:
  `.qa/ranking-font-consistency/04-after-rank-2-hover.png`.
- Combined focused comparison:
  `.qa/ranking-font-consistency/05-source-default-hover-comparison.png`
  (960 × 602 px). The source, default implementation, and hover
  implementation are normalized to the same 960 px comparison width.
- Implementation browser capture: 1265 × 712 px viewport screenshot, dark
  theme, landing route, default and fine-pointer hover states.

### Finding and fix

- **P2 — active numerals appeared to switch typefaces.** The two nodes already
  declared Space Grotesk at weight 900, but the spotlight version used 40 px
  type plus horizontal scale `0.65 1`, while the resting numeral used 32 px
  without distortion. The apparent font change was therefore real optical
  drift. Both states now consume one shared typography contract: Space
  Grotesk, 32 px, weight 900, tabular numerals, no geometric scaling.

### Fidelity surfaces and verification

- Fonts/typography: the default and spotlight numbers now have identical
  family, size, weight, line-height, tabular setting, and glyph proportions.
- Spacing/layout: the S-shaped plate and state-specific numeral positions are
  unchanged; card and shelf geometry do not move.
- Colors/tokens: inactive white and active gold semantic colors remain as the
  only intended visual state difference.
- Images/assets: covers and the existing S-shaped SVG mask are unchanged.
- Copy/content: rank values, Japanese accessible labels, title, and metadata
  are unchanged.
- Browser interaction: rank one default and rank-two hover were captured; the
  accessory still transfers to one card only. Console errors/warnings: none.
- `pnpm typecheck`, `pnpm lint`, focused 2-file/10-test Vitest run, and
  production build all passed; 157 routes prerendered.

No scoped P0/P1/P2 finding remains.

final result: passed

## 2026-08-21 landing shelf size balance — current closeout

The full source/implementation comparison, normalization method, before/after
finding, 112px/152px browser measurements, carousel interaction evidence,
responsive limit, required fidelity surfaces, and verification ledger are
recorded in the earlier `landing shelf size balance — final` section. No
actionable P0/P1/P2 finding remains in this scoped shelf-size pass.

final result: passed

## 2026-08-21 landing shelf genre metadata contract — final

This pass is scoped to the metadata line shared by
`最初におすすめしたい Top 10` and `まだ知らない一冊へ`. It replaces the two
unrelated icon treatments with one always-visible, text-only catalog contract.

### Source and comparison evidence

- Source visual truth: `docs/planning/redesign/visual-targets/01-home.png`
  (1024 × 1536 px).
- Final browser capture:
  `.qa/landing-genre-metadata-review/04-desktop-final.jpg`
  (1497 × 1066 px), captured from the Codex in-app browser at
  `http://localhost:3000/?landing=1` with a 1512 × 1077 CSS px viewport and
  DPR 1.5.
- Normalized side-by-side evidence:
  `.qa/landing-genre-metadata-review/05-target-vs-implementation.png`
  (1200 × 1159 px). The source shelf crop was scaled from 950 × 480 px to
  1200 × 606 px; the implementation crop was scaled from 1180 × 540 px to
  1200 × 549 px, separated by a 4 px accent rule.
- State: landing-page default state. The first Top 10 card was also inspected
  under fine-pointer hover to confirm that its metadata neither changes nor
  moves.

### Findings and fixes

1. **P2 — identical catalog facts used unrelated decorations.** Editorial
   ranking used a muted circle while discovery used an accent book icon. Both
   now use the shared `MediaMetaLine` text treatment. Personalized ranking
   keeps its circle because that line represents confidence rather than catalog
   genre metadata.
2. **P2 — the first compact format truncated in the 95 px Top 10 content
   width.** `アクション · 連載中` measured about 107.51 px. The final compact
   form is `アクション +2`, measured at about 75.42 px, while the wider
   discovery card uses `アクション ほか2 · 完結`.
3. **P2 — compact visual text could otherwise discard useful catalog detail.**
   Each card link now preserves the complete genre list and publication state
   in its accessible name, for example
   `ジャンル アクション、ファンタジー、ホラー。刊行状況 完結`.

### Required fidelity surfaces

- Typography: both shelves use the existing caption-size and line-height
  tokens through one component; the narrow card uses a compact count suffix
  rather than a different font or icon grammar.
- Spacing and layout: no card or shelf dimensions changed in this pass. The
  metadata remains one stable line and does not introduce a hover expansion.
- Colors and tokens: both lines use `text-text-muted`. The current token pair
  (`--text-muted` on `--canvas`) computes to approximately 6.79:1 contrast.
- Images/assets: cover rendering and ranking accessories are unchanged by this
  pass. No new icon or generated asset was introduced.
- Copy/content: visible values come from the Catalog genre/status data and
  centralized Japanese strings. Unsupported affinity percentages from the
  reference were not fabricated.
- Interaction and accessibility: no genre information is hover-only. Both
  shelves expose the complete metadata through the card link, decorative genre
  icons are absent, the first Top 10 hover keeps `transform: none`, and the
  metadata text remains unchanged.

### Verification

- Fresh in-app browser reload: no console errors or warnings; all inspected
  desktop metadata lines fit without truncation.
- Compact width check: the 75.42 px final string fits the approximately 80 px
  mobile content width implied by the existing 96 px card contract. The
  in-app browser did not expose a viewport-resize capability, so a fresh live
  390 px capture was not taken in this scoped pass.
- `pnpm vitest run tests/unit/components/media-cards.test.tsx`: 11 passed.
- `pnpm vitest run tests/unit/components/media-cards.test.tsx tests/unit/landing/landing-flow.test.tsx`:
  15 passed before the final compact-copy shortening; the focused 11-test run
  above was repeated afterward.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- Scoped component/source Prettier check: passed. The existing `design-qa.md`
  file remains outside that formatting claim.
- Production build after the final compact-copy shortening: passed; 157 pages
  prerendered.

No scoped P0/P1/P2 finding remains. The live 390 px viewport capture remains a
documented verification limit; the compact string is bounded by direct text and
content-width measurement rather than an unverified visual claim.

final result: passed
