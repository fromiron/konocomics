# Batch 003 Art preflight chunk 01 — bounded recovery

- recoveryDate: 2026-08-23
- reviewedByHuman: `false`
- scope: the four chunk-01 works that previously closed Art as `unknown-ready`
- mutation boundary: access and sampling evidence only; no Art value, promotion state, source row, or Gold row is changed

## Why the recovery is admissible

The initial pass stopped at publisher-only access. This finite recovery found licensed internal readers with explicit edition relationships. It does not reopen the other six works or repeat collection.

| Work                       | Stable licensed page              | Edition bridge                                                                                                                                                            | Selected internal refs           | Pages | Contexts | Static                         | Motion |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----: | -------: | ------------------------------ | ------ |
| 大東京トイボックス         | https://www.cmoa.jp/title/190848/ | same frozen ISBN; digital remaster made from original manuscript data; added end material excluded                                                                        | steps 04 05 06; printed pp. 9–14 |     6 |        3 | yes, with reproduction ceiling | no     |
| デトロイト・メタル・シティ | https://www.cmoa.jp/title/330983/ | same frozen ISBN; listing explicitly says body is unchanged except added commentary and color-enhancement pages                                                           | steps 04 12 20                   |     6 |        3 | yes                            | no     |
| 私の少年                   | https://www.cmoa.jp/title/150282/ | current Kodansha listing states the prior sold edition has unchanged contents and only a renewed cover; catalog identity binds the prior edition to frozen Futabasha vol1 | steps 09 10 12                   |     6 |        3 | yes, body only                 | no     |
| ドリフターズ               | https://www.cmoa.jp/title/40289/  | direct frozen ISBN match                                                                                                                                                  | steps 03 04 05; printed pp. 3–8  |     6 |        2 | yes                            | no     |

The source-page distribution dates are 2019-12-27, 2025-08-08, 2018-06-01, and 2013-03-29 respectively. All pages and readers were retrieved on 2026-08-23.

## Selected content hashes

| Work and ref                              | SHA-256                                                            |
| ----------------------------------------- | ------------------------------------------------------------------ |
| 大東京トイボックス reader-step-04         | `eb34b21c695f990b94ba207e7ccc0b945d10d99ee3d90c6f1ad244715241f39f` |
| 大東京トイボックス reader-step-05         | `cda001cf504d883560b2516f17981ba676bf5c9736108734808ebad3e68859ec` |
| 大東京トイボックス reader-step-06         | `5c5b49239661b91d7f5c81c4ba2ef4d6f0dbf26ee7c233ae265ab46b7aed4af1` |
| デトロイト・メタル・シティ reader-step-04 | `7a2e1d42be7d738b938a8bf8706266749c846fe233fa5119812e24366ef7661b` |
| デトロイト・メタル・シティ reader-step-12 | `fbf6a740ffe97f1de9e174c1a5bf5b33aef407c1a70a67fa99b7310663a782c9` |
| デトロイト・メタル・シティ reader-step-20 | `28bf800ff41c9bb19dae5b850e85abc2c96ffa8e7e4cb32e59f6177f82a8890b` |
| 私の少年 reader-step-09                   | `bd27cd8fe7afa5fa7c44599be5b470b09550b861e530e9b14311d24070cfaefd` |
| 私の少年 reader-step-10                   | `b54115c494f284989fd4a7e6bd7a067e0f03ba36b6bcce3c0a7504ddf99fff33` |
| 私の少年 reader-step-12                   | `9efa70142f6ba133a49435e492a51ca5b5d64fd37f95e4a4d61b5b213125a0e8` |
| ドリフターズ reader-step-03               | `55e78f45acd1050ee4e02cb259ed991a9aae51bdd8e57ea5d32db5643137b57f` |
| ドリフターズ reader-step-04               | `980d8d311ee25caa3c64900cad8dbfa37bb21e21e6f85eafb5a0f1616c323b8c` |
| ドリフターズ reader-step-05               | `408e550410c27d5a94cacf6b465681e53371e3f2539fc0b5bcb10e6d3bcb09b7` |

All twelve hashes were recomputed after capture. Each capture is a readable 1440×1000 internal-page spread. No selected image, contact sheet, HTML response, or temporary path is committed.

## Motion boundary

All four works remain `motionGateAttemptable=false`. Static poses, walking, or an unresolved combat continuation do not establish an exact start-development-impact-resolved-end sequence. Reviewers must return `motionImpact=unknown` unless a separate eligible sequence is collected; no such sequence is part of this recovery.

## Next review

These four samples require a blind Local Codex Art pass and an independent Gemini 3.7 Flash High Art pass. Neither reviewer may see the other's values. Differences go to primary adjudication against the exact pixels and Factor Dictionary; no average or vote is permitted. Muse remains optional only if stable, and Cursor Grok remains `ART_ABSTAIN` without proven pixel access.

Decorative `『』` does not appear in any canonical title. Meaningful punctuation in other frozen titles is unaffected.
