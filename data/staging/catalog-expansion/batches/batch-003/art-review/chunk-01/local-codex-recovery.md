# Batch 003 Art review chunk 01 — Local Codex bounded recovery

- reviewDate: 2026-08-23
- reviewer: Local Codex
- reviewedByHuman: false
- scope: the four works and twelve original PNG captures listed in the bounded recovery preflight
- blind boundary: no existing chunk-01 Art decision, Gemini artifact, Pass A text, recommendation output, or prior proposed value was read
- mutation boundary: this report and local-art-recovery.csv only; no promotion, source, Gold, or image-repository change

## Decision matrix

| Work                       | workId                    | artRealism | artDensity | visualSoftness | motionImpact |
| -------------------------- | ------------------------- | ---------: | ---------: | -------------: | ------------ |
| 大東京トイボックス         | work-048a39f42bd18cb0823e |   3 (0.86) |   3 (0.91) |       2 (0.86) | unknown      |
| デトロイト・メタル・シティ | work-04f35b4c99514d50231d |   1 (0.91) |   3 (0.88) |       0 (0.94) | unknown      |
| 私の少年                   | work-07faf4019b12de5e877d |   3 (0.88) |   1 (0.91) |       4 (0.94) | unknown      |
| ドリフターズ               | work-171b262b7ad72871f795 |   3 (0.89) |   4 (0.97) |       0 (0.96) | unknown      |

Numeric cells are value followed by confidence. Exact viewer or printed-page refs, pixel observations, and per-axis edition/sample ceilings are recorded in local-art-recovery.csv. All four motion values are unknown because every recovery row has motionGateAttemptable=false; visible isolated poses or unresolved combat were not promoted into motion evidence.

## Edition and sample ceilings

| Work                       | Static evidence boundary                                                                                                                                                                                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 大東京トイボックス         | Licensed digital-remaster volume 1 uses the frozen ISBN and original manuscript data. Remastering may change reproduction and tone; only opening body pages 9-14 were reviewed and added end matter was excluded.                                                                 |
| デトロイト・メタル・シティ | Licensed complete-edition volume 1 uses the frozen ISBN and states that the body is unchanged. Added commentary and color-enhancement material were excluded; six monochrome opening body pages across three contexts were reviewed.                                              |
| 私の少年                   | The current Kodansha volume 1 is bridged to the frozen Futabasha volume through unchanged prior body content and a cover-only renewal. The bridge supports body Art, not identical pagination, publisher design, or metadata; six body pages across three contexts were reviewed. |
| ドリフターズ               | Licensed standard volume 1 directly matches the frozen ISBN. Only opening pages 3-8 across command and battlefield contexts were reviewed; the sampled battle continues beyond the refs.                                                                                          |

## Recomputed capture hashes

| Capture               | SHA-256                                                          |
| --------------------- | ---------------------------------------------------------------- |
| toybox-step-04.png    | eb34b21c695f990b94ba207e7ccc0b945d10d99ee3d90c6f1ad244715241f39f |
| toybox-step-05.png    | cda001cf504d883560b2516f17981ba676bf5c9736108734808ebad3e68859ec |
| toybox-step-06.png    | 5c5b49239661b91d7f5c81c4ba2ef4d6f0dbf26ee7c233ae265ab46b7aed4af1 |
| dmc-step-04.png       | 7a2e1d42be7d738b938a8bf8706266749c846fe233fa5119812e24366ef7661b |
| dmc-step-12.png       | fbf6a740ffe97f1de9e174c1a5bf5b33aef407c1a70a67fa99b7310663a782c9 |
| dmc-step-20.png       | 28bf800ff41c9bb19dae5b850e85abc2c96ffa8e7e4cb32e59f6177f82a8890b |
| watashino-step-09.png | bd27cd8fe7afa5fa7c44599be5b470b09550b861e530e9b14311d24070cfaefd |
| watashino-step-10.png | b54115c494f284989fd4a7e6bd7a067e0f03ba36b6bcce3c0a7504ddf99fff33 |
| watashino-step-12.png | 9efa70142f6ba133a49435e492a51ca5b5d64fd37f95e4a4d61b5b213125a0e8 |
| drifters-step-03.png  | 55e78f45acd1050ee4e02cb259ed991a9aae51bdd8e57ea5d32db5643137b57f |
| drifters-step-04.png  | 980d8d311ee25caa3c64900cad8dbfa37bb21e21e6f85eafb5a0f1616c323b8c |
| drifters-step-05.png  | 408e550410c27d5a94cacf6b465681e53371e3f2539fc0b5bcb10e6d3bcb09b7 |

All twelve recomputed hashes match recovery-preflight.csv and recovery-ledger.md. Each inspected capture is a readable 1440×1000 internal-page spread. No image or temporary path is committed.
