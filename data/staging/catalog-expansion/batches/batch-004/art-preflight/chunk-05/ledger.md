# Batch 004 Art preflight chunk 05

- retrievedAt: 2026-08-25
- scope: frozen Batch 004 positions 41–50 in manifest order
- reviewedByHuman: `false`
- preflightCsvSha256: `7b012de84db4bba279b343960183b5f36885575bf31d6949b4c28f156988a81e`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`

## Route and evidence boundary

Acquisition was limited to publisher-specific routes registered in
`data/staging/catalog-expansion/art-source-route-registry.csv`. Shueisha
reader URLs used the exact frozen ISBN except for position 47, where the
official Shueisha JDCN reader is bridged to the frozen paper volume. The
Kodansha product-linked reader and Square Enix product-linked first episode
were retained only after the exact title, creator, entry volume, and frozen
edition bridge was confirmed. Hakusensha has no registered trusted preview
route in the registry, so positions 44 and 50 close terminal `unknown-ready`
without sampling. Temporary images remain only under
`/tmp/konocomics-batch004-art-chunk05`; no image path or asset was committed.

## Result

| Pos | Work                       | Eligible pages | Contexts | Static | Motion | State         | Decisive boundary                                                                                                          |
| --: | -------------------------- | -------------: | -------: | ------ | ------ | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
|  41 | 鵺の陰陽師                 |              6 |        3 | yes    | no     | sample-ready  | Exact Shueisha ISBN reader; six body pages across supernatural action and school/public contexts                           |
|  42 | モテキ                     |              6 |        2 | yes    | no     | sample-ready  | Exact Kodansha product-linked reader; chapter-title/frontispiece pages 06–07 excluded; body pages 09–12 and 18–19 retained |
|  43 | 八雲さんは餌づけがしたい。 |              6 |        2 | yes    | no     | sample-ready  | Exact Square Enix ISBN product links the first-episode image sequence                                                      |
|  44 | 高嶺と花                   |              0 |        0 | no     | no     | unknown-ready | No registered Hakusensha trusted preview route; no sampling                                                                |
|  45 | ここは今から倫理です。     |              6 |        2 | yes    | no     | sample-ready  | Exact Shueisha ISBN reader; six body pages retained after excluding non-body/blank pages                                   |
|  46 | さよなら絵梨               |              6 |        3 | yes    | no     | sample-ready  | Exact Shueisha ISBN reader for the complete one-shot                                                                       |
|  47 | 極楽街                     |              6 |        3 | yes    | no     | sample-ready  | Official Shueisha JDCN reader 08X10000000024865900 bridged to frozen paper ISBN 9784088827407                              |
|  48 | アオハライド               |              6 |        2 | yes    | no     | sample-ready  | Exact Shueisha ISBN reader; school and outdoor contexts                                                                    |
|  49 | 青の祓魔師                 |              6 |        3 | yes    | no     | sample-ready  | Exact Shueisha ISBN reader; supernatural threat and town/interior contexts                                                 |
|  50 | LOVE SO LIFE               |              0 |        0 | no     | no     | unknown-ready | No registered Hakusensha trusted preview route; no sampling                                                                |

## Static gate

Eight works meet the preflight gate with an exact edition/entry-volume bridge,
at least six readable body pages, and at least two materially distinct
contexts. Each retained hash in `preflight.csv` was recomputed from the
corresponding temporary PNG/JPG after excluding title splashes, covers,
contents, and blank assets. Two works remain terminal `unknown-ready` solely
because the trusted publisher route required by the registry is unavailable.

Position 42 was rechecked after independent QA rejected its first two selected
pages. `reader-page-06` and `reader-page-07` are the chapter-title/frontispiece
opening and are excluded. Genuine body pages `reader-page-09` through
`reader-page-12` plus `reader-page-18` and `reader-page-19` provide six pages
across domestic room/meal and outdoor festival/people contexts; their six
temporary hashes are the only position-42 hashes retained in the CSV.

## Motion boundary

All ten `motionGateAttemptable` values are `false`. No retained pages establish
one exact continuous start, development, impact, and resolved sequence. No Art
values were assigned; `unknown` is not a low value and the sample shortage is
not a promotion blocker.

## Verification boundary

`reviewedByHuman` remains `false`, `temporaryImagesCommitted` remains `false`,
and `FactorValuesAssigned` remains `false`. The CSV schema, row order,
eligibility states, and all selected SHA-256 values were validated locally.
