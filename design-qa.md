# Design QA — FactorBar B

## Comparison target

- Source visual truth: `/tmp/konocomics-factor-label-comparison/b-compact-intensity-mobile.png`
- Rendered implementation: `/tmp/konocomics-b-option-verification/factorbar-b-mobile.png`
- Side-by-side comparison: `/tmp/konocomics-b-option-verification/factorbar-b-comparison.png`
- Focused implementation region: `/tmp/konocomics-b-option-verification/factorbar-b-first-group.png`
- Viewport and density: 390 × 844 CSS px, 390 × 844 source/implementation pixels, deviceScaleFactor 1
- Browser state: Japanese locale, `prefers-reduced-motion: reduce`, production build

The selected source is a comparison-only mock: its first five values are fixed to 0–4, it contains a reviewer annotation, and it shows the reveal CTA. The implementation capture uses a real six-work profile after add-mode completion and therefore has different factor values and correctly omits the reveal CTA. The fidelity target is the FactorBar B copy, typography, spacing, track, adjustment controls, and responsive composition—not the mock annotation or synthetic values.

## Full-view comparison

The side-by-side image shows the same mobile column width, row rhythm, label/value alignment, track treatment, five adjustment controls, divider spacing, and bottom navigation. The implementation uses the selected exact B labels:

`ごく控えめ / 控えめ / ほどほど / 強め / とても強め`

No horizontal document overflow was measured. The missing reveal CTA in the implementation is an expected state difference because add-mode completion must return to steady `/taste` without replaying reveal.

## Focused-region comparison

The first-group capture makes all row labels and B values readable. It confirms the qualitative value remains on one line, every adjustment target remains at least 44 px, and long real catalog labels do not collide with the value. No separate raster assets are part of FactorBar, so image-quality fidelity is not applicable to this component.

## Required fidelity surfaces

- Fonts and typography: aligned. Existing Japanese product fonts, weights, sizes, line heights, and nowrap value treatment are unchanged.
- Spacing and layout rhythm: aligned. Row padding, track spacing, dividers, chip gaps, radii, and mobile width match the selected target.
- Colors and visual tokens: aligned. Neutral factor fill, line track, accent-soft selected adjustment, accent focus/selection, and paper surface use the established semantic tokens.
- Image quality and assets: not applicable to FactorBar; no product imagery or custom icon was introduced.
- Copy and content: aligned. Numeric `n / 4` was replaced by the selected five B labels at the documented thresholds. Visible text and `aria-valuetext` are identical.
- Accessibility and states: aligned in DOM inspection. Known values expose the axis as the meter name, exact numeric `aria-valuenow`, and only the qualitative label as `aria-valuetext`; unknown remains a named nonnumeric group with `まだ分析中`.

## Comparison history

1. Earlier implementation drift: visible and accessible values used numeric `n / 4`, so the selected B target was not implemented.
2. Fix: added the exact five labels and threshold mapping, removed duplicated axis text from `aria-valuetext`, and retained honest unknown semantics and reveal/update timing.
3. Post-fix evidence: the side-by-side and focused captures show the selected wording and unchanged component geometry. Unit, DOM, responsive, and production-flow checks pass.

## Findings

No actionable P0, P1, or P2 visual mismatch remains within the selected FactorBar scope.

A single browser console resource 404 string was observed, while the response ledger recorded no HTTP response at 400 or above and no page error. It did not affect the rendered component or primary flow.

## Interaction verification

- First-run onboarding: five positive works → optional Step 2 skipped → `/taste`.
- Existing-profile add mode: one new work → `/taste` without reveal.
- Add draft ordinary return, restoration, explicit discard, completion, and two-tab conflict recovery passed through the production UI and IndexedDB.
- Existing rows and the first `onboardingCompletedAt` remained unchanged; work counts read back as 5 → 6 → 7 across the intended scenarios.
- All 49 rendered FactorBars used B labels with visible/accessible parity; mobile overflow was 0 px.
- Browser page errors and failed HTTP responses were 0.

## Final result

final result: passed
