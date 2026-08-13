# Local G2 validity and evidence summary

## Conclusion

- Formal vote: `REVISE`.
- Formal response: `/tmp/konocomics-g2-product-direction-cycle-1-0382c60-local-response.txt`.
- Bundle validity: mechanically valid and identity-consistent; the vote changes because of one product-direction blocker in the rendered explanation semantics, not because of archive, test, pilot, or identity failure.

## Archive and identity

- Original ZIP SHA-256 independently recomputed as `523bc95f4c1dcdd6439d3791d66053ccabb0b1c44fa962f7e18fc81f51ed7f3e` (1,463,485 bytes).
- Safe inspection found one archive root, 174 unique regular files, no absolute/traversal/backslash paths, symlinks, special files, duplicate names, or encrypted entries; archive integrity testing passed.
- Fresh extraction was performed under `/tmp/konocomics-g2-local-review.9S1YrQ/konocomics-g2-product-direction-cycle-1`.
- `manifests/PAYLOAD.sha256` contains 173 unique entries; 173/173 extracted bytes verified. The only additional regular file is the intentionally self-excluded ledger itself.
- Identity readback: repository `fromiron/konocomics`, branch `agent/promote-approved-catalog`, HEAD/upstream/remote HEAD `0382c60c32a4eee32a3333149a3a746d96d1d0d7`, tree `511fcfa3c6277ce31e6aae479ff4ab0146087be9`.
- The pilot code head differs from final HEAD only by `.prettierignore` and the 18 committed pilot evidence paths listed in `identity/identity.json`; no application, engine, catalog, or context path changed, so the pilot-to-final identity difference is immaterial to the inspected behavior.

## Evidence inspected

- Read the complete embedded `repository/AGENTS.md`, product specification, factor dictionary, annotation guide, architecture, implementation plan, acceptance plan, bundle README, source README, and pilot README.
- Inspected the 101-file exact repository snapshot and the 38-path, 32,469-line implementation patch (23,911 insertions, 3,097 deletions), including G2 domain, recommendation/baseline/explanation logic, aggregator boundaries, harness source, catalog promotion and validation, configuration, and all 10 embedded test files.
- Inspected all 35 built-harness files, all 18 pilot files, all six 1440x1000 screenshots, full pre/after DOM and ARIA captures, the browser runner, server ledger, original profile, unedited result, both aggregate outputs, recomputed aggregate, all 15 validation artifacts, and the identity record.

## Catalog and implementation readback

- Catalog `v1-83f85ca42c87`: 150 recommendation-eligible works, 154 volumes, role counts Anchor 30 / Bridge 30 / Discovery 90.
- Catalog SHA-256 `d3f9d97a5d659fd7a6972b833e0fd0092a09089acf103709fa0bdb9968b64fe8`; recommendation-context SHA-256 `2e1faa38a07a1f4ffd0f465fcf597d682162eea9433b175fd8a1af84d7ce282e`; `data/` and `src/data/` copies are byte-identical.
- Source cardinalities independently checked: 150 works, 154 volumes, 2,550 factor rows (150 x 17), 462 theme rows, 177 aliases, 150 context rows, 416 evidence rows, and 600 Art-manifest rows (150 x 4). Axis states total 2,412 known and 138 unknown, with no not-applicable value used as data.
- All 150 works retain `reviewedByHuman=false` evidence and `authorizedModelPanel` annotation provenance. This is reported as model-panel evidence, not human annotation validation.
- Ten recorded final checks all exited 0: typecheck, lint, 40 test files / 351 tests, catalog validate/build/coverage, root build, harness build, format check, and diff check. Catalog validation reports 0 errors and 566 explicit non-human/model-panel warnings.
- The root build exposes only `/` and `/_not-found`; the separate harness build exposes `/`, `/human`, and `/synthetic-pilot`. The implementation patch has no Slice 5 product paths.

## Browser and authoritative readback

- The preserved runner uses real text/file inputs, radio `check`, button `click`, and the browser download event; it does not inject React state, directly assign checked state, edit the result, use storage, or make external requests. Its `page.evaluate` calls are read-only audits.
- Pre capture: 20 A/B occurrences, 16 distinct works, four overlaps; native slot/rank/title order matches the downloaded result. Searches of visible text, attributes, accessible output, URL/query/hash, JSON-LD, storage, and intermediate controls found no forbidden engine/score/confidence/anchor/contribution/penalty/market/maturity/catalog-role disclosure.
- After capture preserves the same lists and has 20/20 explanation occurrences and 20/20 response occurrences while still withholding the A/B mapping until final submit.
- Independent SHA recomputation confirms downloaded result `98429bdd94a864cc2e29a2edf48971ed0ab38983fa4f6b98c01d60d0806bddb8`; its holdout is deterministically `fullmetal-alchemist`, Taste maps to slot A, pre order is 16/16 exact, and post order is 20/20 exact.
- The two pilot reports and exact-head recomputation are byte-identical at SHA-256 `98db33b126521e3bce9f7ce58bed76f08e4175149ed0f147d06585061f6c3e60`.
- Authoritative aggregate remains Human 0, Synthetic pilot 1, verdict `INCOMPLETE`; every human GO criterion is `NOT_RUN`, every aggregate human fraction is `0/0 (null)`, and the pilot row appears only as a diagnostic participant row.

## Product-direction assessment

- The exact Taste list is qualitatively more aligned with the supplied mystery/strategy/investigation profile than the Baseline: its first four are `my-dearest-self-with-malice-aforethought`, `the-summer-hikaru-died`, `20th-century-boys`, and `promised-neverland`, and the held-out `fullmetal-alchemist` returns at Taste rank 6 while it does not enter the Baseline Top 10.
- Blocking defect: the profile sets `comedy: less`; source factors set comedy=0 for `promised-neverland`, `vinland-saga`, and `vagabond`; yet the exact after-stage Taste copy for ranks 4, 9, and 10 says `「ギャグ・コメディ」があなたの好みに合う作品です。`. The implementation correctly scores low comedy as aligned, but its single positive-without-anchor template does not convey that lower quantity/absence is the matching direction. A reader can reasonably understand the sentence as endorsing comedy presence, so it is not adequate evidence for the product's core explainability claim.
- Non-blocking observation: every card uses the explicit `表紙画像なし` placeholder. Although the G2 prose names a cover in the pre surface, the architecture explicitly permits a placeholder when Rakuten is unavailable, Slice 4 forbids network/provider dependencies and excludes harness visual policy, and this model-path pilot contributes no human preference measurement. I therefore did not make the placeholder the reason for REVISE.

## Boundary preservation

- `humanValidation: not-run` remains unchanged.
- `decisionBasis: user-authorized-model-panel` remains unchanged.
- Human metrics remain null/not-run; no ten-human or statistical-superiority claim is made.
- The synthetic pilot remains human 0 / synthetic 1 / `INCOMPLETE` and is not used as authority for the vote.
- One `REVISE` keeps G2 and Slice 5 closed; the next review must bind a newly frozen bundle after the explanation correction and refreshed pilot evidence.
