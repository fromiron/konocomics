# konocomics G2 product-direction review request

Review exactly `konocomics-g2-product-direction-cycle-1-0382c60.zip`.

- Required ZIP SHA-256: `523bc95f4c1dcdd6439d3791d66053ccabb0b1c44fa962f7e18fc81f51ed7f3e`
- Repository: `fromiron/konocomics`
- Branch: `agent/promote-approved-catalog`
- Final HEAD: `0382c60c32a4eee32a3333149a3a746d96d1d0d7`
- Final tree: `511fcfa3c6277ce31e6aae479ff4ab0146087be9`
- Slice 4 contract base: `94d2ac803844ce39e884326d523afa9516f7d7ab`
- Catalog version: `v1-83f85ca42c87`
- Payload ledger entries: `173` plus the self-excluded ledger

## Required procedure

1. Hash the original ZIP bytes and require the exact SHA-256 above.
2. Extract it and recompute every entry in `manifests/PAYLOAD.sha256` from extracted bytes.
3. Read the normative G2 contract, current catalog/context, implementation patch and exact source, G2 tests, built harness, browser pilot captures/screenshots/download/aggregate, final validation logs, and identity record.
4. Independently assess whether the evidence supports opening G2 under the already user-authorized model-panel path. Do not treat prior reviews, manifest prose, passing hashes, tests alone, or the synthetic pilot as a substitute for product reasoning.
5. Preserve the declared boundary: `humanValidation: not-run`, `decisionBasis: user-authorized-model-panel`, human metrics null/not-run, browser pilot human 0 / synthetic 1 / verdict INCOMPLETE. Do not claim ten-human validation or statistical significance.
6. Check that the intended browser flow is reachable, blinding holds before final submit, the unedited browser download is accepted by the authoritative aggregator, pilot rows are excluded from human metrics, catalog identity is exact, and no Slice 5 implementation started before the gate.

## Vote

Line 1 must be exactly `GO` or `REVISE`.

Then include:

- `Bundle SHA-256: 523bc95f4c1dcdd6439d3791d66053ccabb0b1c44fa962f7e18fc81f51ed7f3e`
- `Final HEAD: 0382c60c32a4eee32a3333149a3a746d96d1d0d7`
- `Human validation: not-run`
- `Decision basis: user-authorized-model-panel`
- inspection summary;
- blocking findings (`None.` for GO, otherwise exact archive paths and the smallest complete correction);
- concise rationale.

A GO must be unconditional for this exact bundle and identity. A conditional GO is invalid; use REVISE. One REVISE keeps G2 and Slice 5 closed.
