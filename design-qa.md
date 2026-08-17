# Design QA — dark-only TanStack Start redesign

## Evidence

- Approved sources: `docs/planning/redesign/visual-targets/01-home.png` through
  `07-settings.png`
- Same-state comparisons: `.qa/review/current-v6/comparisons/`
- Desktop viewport and full-page captures: `.qa/review/current-v6/desktop-viewport/`
  and `.qa/review/current-v6/desktop-full/`
- Mobile viewport and full-page captures: `.qa/review/current-v6/mobile-viewport/`
  and `.qa/review/current-v6/mobile-full/`
- Interaction states: desktop hover expansion, mobile Quick Preview sheet, and
  reduced motion under `.qa/review/current-v6/states/`
- Capture details: `.qa/review/current-v6/CAPTURE_METADATA.md`
- Browser: signed-in Codex in-app browser against the production Nitro server at
  `http://127.0.0.1:3101`
- Product state: completed local profile, five Catalog records, Japanese UI, and
  a dark-only root

Each comparison places the approved source and a current browser render together
at the source CSS viewport: 1024 × 1536 for Home and 948 × 1659 for the other six
screens. The in-app-browser raster excludes a narrow browser-owned strip, so the
current side is padded, never stretched. Separate 1440 × 900 and 390 × 844
captures verify responsive behavior. Full-page captures are supporting evidence;
viewport captures are authoritative where browser stitching repeats sticky or
fixed elements.

The source images' Korean copy, fake percentages, social/account controls,
generated cover art, unsupported settings, reviews, and memos are not product
requirements. Current captures use real catalog/provider data and supported
fallbacks. The accepted development-only one-request-per-second provider throttle
can briefly expose placeholders.

## Seven-screen result

1. Home preserves the dark cinematic hero, Catalog showcase, neutral Top 10,
   discovery shelf, and footer hierarchy.
2. Onboarding preserves search-first selection, typed genre/shelf URL state,
   five-to-ten selection semantics, tray, and responsive navigation.
3. Manga DNA preserves the radar/evidence relationship, qualitative confidence,
   summary/adjust URL modes, persisted adjustments, and deterministic preview.
4. Recommendations preserves canonical plan order, compact criteria/filters,
   contribution-backed reasons, shared shelves, Top 10, 200 ms fine-pointer
   expansion, and touch Quick Preview without inline expansion.
5. Work detail keeps the title, reading state, and reason in the mobile first
   viewport, plus qualitative compatibility evidence and provider separation.
6. Library keeps IndexedDB counts, typed query/sort/view/state URL state, grouped
   records, shelves, editor/search dialogs, and no document-level overflow.
7. Settings keeps typed section tabs, the four supported policies, Manga DNA and
   local-data panels, Base UI controls, compatible import/export, and destructive
   confirmation.

## Component, token, and interaction result

- Screen styling uses Tailwind CSS v4 utilities. `src/styles/globals.css` is
  limited to semantic dark tokens/theme mapping, base rules, shared keyframes,
  reduced-motion defaults, and one shared portal-overlay exception.
- Generated shadcn Base UI primitives live under `src/components/ui` and are
  consumed through tokenized wrappers under `src/components/design-system`.
- Shared media and detail contracts own shelves, expansion, preview, reasons,
  confidence, state actions, cover/backdrop behavior, and work-detail layout.
- Desktop GNB and mobile bottom navigation are mutually exclusive. All seven
  routes were inspected at 1440 × 900 and 390 × 844 with no document overflow.
- The first recommendation card expands to 352 px after hover intent and opens
  its details. On a coarse pointer it remains compact and opens
  `?preview=horimiya` as a bottom sheet ending at the viewport bottom.
- With `prefers-reduced-motion: reduce`, the inspected Home viewport had no
  computed running CSS animation.
- Keyboard expansion and Back/Forward/focus restoration are present in the fixed
  five-scenario E2E contract, but that suite has not been executed in this
  session and is not claimed as runtime evidence here.

## Independent review

The signed-in in-app-browser Oracle reviewed the v6 Repomix and image bundle with
GPT-5.6 Sol at High reasoning and returned `GO WITH DISCLOSED VERIFICATION GAP`
with no P0/P1 blockers. Its single P2 pointer-only hover inconsistency was fixed;
the response is preserved at `.qa/review/oracle-final-review-v6.md`. The paired
Gemini 3.7 Flash High review returned the same verdict with no P0/P1 blockers at
`.qa/review/agy-final-review-v6.md`.

## Verification status

- Visual QA: passed for the seven same-viewport comparisons, desktop/mobile
  responsive captures, hover, touch preview, and reduced-motion evidence.
- Local gates: format, typecheck, lint, 83 files / 704 tests, Catalog validation
  (150 works / 154 volumes / 0 errors), 157-page production build, and
  `git diff --check` passed.
- Production-local smoke: `/` returned 200, unknown route/work returned 404, and
  both malformed Rakuten endpoints returned 400 JSON.
- TanStack root pending, error, and not-found boundaries are localized and
  registered.
- Fixed-five Playwright E2E: not run; the mandatory release gate remains open.
- M10 production deployment/readback: not performed and requires separate user
  approval.
- Unchecked manual and performance rows in `07-acceptance-test-plan.md` are not
  claimed as passed.

visual QA result: passed

M10 release result: pending
