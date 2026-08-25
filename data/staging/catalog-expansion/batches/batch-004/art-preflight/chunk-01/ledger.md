# Batch 004 Art preflight chunk 01

- retrievedAt: 2026-08-25
- scope: frozen Batch 004 positions 1–10 in manifest order
- reviewedByHuman: `false`
- preflightCsvSha256: `51862c41c9f15af4a2780aeed27db95c976b8e01c705efef9019425ec84f7a81`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`

## Route and model boundary

Publisher access began with `art-source-route-registry.csv` and the supplied
research packet. The registered product-to-preview routes were used for
Kodansha, Shogakukan, Shueisha, KADOKAWA/BOOK WALKER, Shinchosha, and Shonen
Gahosha. Futabasha's exact product-linked reader was accepted because the
publisher product exposed the edition-specific preview directly. No general
image search was used. Position 10 stopped at the bounded route check because
the route registry has no Tokuma route and the supplied sources provide only
retail/distributor identity evidence.

This is a local Art preflight only. No human or model reviewer assigned Art
Factor values. The six-readable-body-page and two-distinct-context gates were
applied after excluding covers, contents, chapter/title splashes, blank pages,
and other non-story material. `motionGateAttemptable` is true only when a
continuous start/development/impact/resolved sequence is directly retained;
none of these ten entries met that stricter condition.

## Result

| Pos | Work                   | Eligible pages | Contexts | Static | Motion | State         | Decisive boundary                                                                           |
| --: | ---------------------- | -------------: | -------: | ------ | ------ | ------------- | ------------------------------------------------------------------------------------------- |
|   1 | ホストと社畜           |              6 |        4 | yes    | no     | sample-ready  | Exact Futabasha vol1 product-linked reader; breakfast, work/home, train, and phone contexts |
|   2 | うるわしの宵の月       |              6 |        3 | yes    | no     | sample-ready  | Exact Kodansha ISBN vol1 reader; school, stair, and dialogue contexts                       |
|   3 | 応天の門               |              0 |        0 | no     | no     | unknown-ready | Exact Shinchosha product only; generic publisher trial catalog is not work-specific         |
|   4 | のらみみ               |              6 |        5 | yes    | no     | sample-ready  | Exact Shogakukan e-comi vol1 JDCN; frozen ISBN retained as identity metadata                |
|   5 | ヒナまつり             |              6 |        2 | yes    | no     | sample-ready  | Exact KADOKAWA product-linked BOOK WALKER vol1; chapter-title page removed; car/arrival and apartment contexts |
|   6 | 駅から5分              |              6 |        1 | no     | no     | unknown-ready | Exact Shueisha JDCN reader retained; independent QA did not accept two distinct scene contexts |
|   7 | つらつらわらじ         |              5 |        2 | no     | no     | unknown-ready | Exact Kodansha ISBN vol1 reader; chapter-title page removed, leaving five genuine body pages |
|   8 | ふうらい姉妹           |              5 |        3 | no     | no     | unknown-ready | Exact KADOKAWA product-linked BOOK WALKER vol1; opening page removed, leaving five genuine body pages |
|   9 | それでも町は廻っている |              0 |        0 | no     | no     | unknown-ready | Exact Shonen Gahosha product/ISBN, with no work-specific preview route                      |
|  10 | 青空にとおく酒浸り     |              0 |        0 | no     | no     | unknown-ready | Tokuma publisher route unresolved; retail/distributor records are identity-only             |

All ten `motionImpact` gates close `unknown`. No retained sample contains exact
start, development, impact, and resolved-end references for one continuous
action sequence. The qualifying static sample count is therefore independent
of any Art value assignment.

## Acquisition notes

- Position 1's publisher was not listed in the current route registry, but the
  exact Futabasha product linked the same-volume reader and exposed the frozen
  ISBN identity; no fallback image search was needed.
- Position 3's Shinchosha product had only the generic `/tryme/` catalog; that
  catalog was explicitly excluded because it does not bridge this volume to a
  work-specific preview.
- Position 5's BOOK WALKER reader initially showed a non-story/blank early
  page; the chapter-title page at `reader-step-06` was excluded and
  `reader-step-05` plus steps 7–11 now provide six genuine body pages across
  car/arrival and apartment contexts. Only those six captures were hashed.
- Position 6 retains six exact-edition body-page hashes, but the independent
  QA did not accept the bounded set as two truly distinct scene contexts; it is
  therefore closed `unknown-ready` without a replacement capture.
- Position 7 removes `reader-step-07`, the chapter-title/opening page. Five
  genuine body pages remain, so the static gate is closed `unknown-ready`.
- Position 8 removes `reader-step-05`, the chapter-title/opening page. Five
  genuine body pages remain, so the static gate is closed `unknown-ready`.
- Positions 4 and 6 retain frozen print ISBNs while sampling the exact official
  digital JDCN readers; the title/creator/volume bridges are explicit in the
  editionMapping field.
- Position 10 preserves the exact Rakuten identity URL for auditability while
  marking the source as `licensedRetailerBibliographicIdentity`; it is not
  treated as official internal preview evidence.

## Verification boundary

The corrected preflight has four `sample-ready` and six terminal
`unknown-ready` Works, 40 retained hashes (24 sample-ready captures and 16
unknown-ready diagnostic captures), and no motion-attemptable Work. Every hash
in `preflight.csv` was recomputed from its eligible temporary file under
`/tmp/konocomics-batch004-art-chunk01` after exclusions. No image or temporary
filesystem path is stored in the repository. Unknown is not a low value and an
Art sample shortage is not a promotion blocker.
