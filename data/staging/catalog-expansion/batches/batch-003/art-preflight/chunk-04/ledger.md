# Batch 003 Art preflight chunk 04

Retrieved on 2026-08-24. Scope is frozen Batch 003 positions 31–40 in manifest order. This is access and sampling preflight only: no Art axis value or confidence was inferred. `reviewedByHuman=false`.

## Route-first efficiency rule

- Publisher access began with the verified product and preview patterns in `data/staging/catalog-expansion/art-source-route-registry.csv`; title-level exception research ran only when a registered route missed.
- Resolve an official publisher or rights-holder internal preview within volume 1–3 or the first major episode and map it to the frozen representative edition.
- Stop sampling after six readable internal pages across at least two distinct contexts. Covers, advertisements, contents pages, animation, synopsis material, and user opinion are excluded.
- Static review is attemptable only after both the edition and sample gates pass. Motion review is attemptable only when exact start, development, impact, and resolved-end references are visible in one continuous sequence.
- A failed prerequisite ends as `unknown-ready`, without an Art value or promotion blocker. Qualifying access ends as `sample-ready`; this is not an annotation decision.
- Temporary captures remain outside the repository. Only official URL, edition mapping, page ref, count, context, limitation, and selected-file SHA-256 are retained.

The simple official-route discovery for 惑星のさみだれ and 終末のワルキューレ was delegated to two Luna xhigh workers. Primary Local Codex independently checked the returned URLs, edition boundaries, hashes, and pixels before accepting the rows. The workers did not edit repository files and their output is not human review.

## Results

| Work                                         | Official edition mapping                                  | Access                | Internal pages | Contexts | Page refs                                      | Static | Motion | State         |
| -------------------------------------------- | --------------------------------------------------------- | --------------------- | -------------: | -------: | ---------------------------------------------- | ------ | ------ | ------------- |
| work-a7413b6e35e0d316a538 となりの怪物くん   | original vol1 ISBN 9784063655407 direct trial             | accessible            |              6 |        3 | reader steps 04 08 and 15                      | yes    | no     | sample-ready  |
| work-a7e0062c7153978fc6fe 失恋ショコラティエ | original vol1 JDCN to ISBN 9784091322609                  | accessible            |              6 |        3 | reader steps 04 08 and 15                      | yes    | no     | sample-ready  |
| work-a960372ed5efa4031896 シルバーマウンテン | product-linked exact ISBN 9784098542420 trial             | accessible            |              6 |        3 | reader displays 04 06 and 09                   | yes    | no     | sample-ready  |
| work-aa6d796e2e04a55b94b1 惑星のさみだれ     | original vol1 ISBN and official first-episode series ID   | accessible            |              6 |        3 | episode slots 08 09 10 14 15 and 16            | yes    | no     | sample-ready  |
| work-ae0ac8a5acfc5fbb7dd6 終末のワルキューレ | original series ID z_R0123 to standard ISBN 9784199804953 | accessible            |              6 |        3 | reader steps 02 03 and 04 left and right pages | yes    | no     | sample-ready  |
| work-b2be97620643b3342637 アオイホノオ       | original vol1 JDCN to ISBN 9784091512680                  | accessible            |              6 |        3 | reader steps 04 08 and 15                      | yes    | no     | sample-ready  |
| work-b708734262fb9b67f948 ねこだらけ         | standard collected ISBN 9784063728262 product only        | official product only |              0 |        0 | none                                           | no     | no     | unknown-ready |
| work-bd42208a660912d9d95d 路地恋花           | original vol1 ISBN 9784063106282 direct trial             | accessible            |              6 |        3 | reader steps 08 15 and 20                      | yes    | no     | sample-ready  |
| work-c5e8c957903bf1832dc5 日々ロック         | electronic original vol1 to print ISBN 9784088790343      | accessible            |              6 |        3 | reader steps 04 08 and 15                      | yes    | no     | sample-ready  |
| work-c805c5b70111f75d6fb5 海獣の子供         | original vol1 JDCN to ISBN 9784091883681                  | accessible            |              6 |        3 | reader steps 04 08 and 15                      | yes    | yes    | sample-ready  |

## Selected content hashes

| Work and ref                            | SHA-256                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| となりの怪物くん reader-step-04         | `08dbf05ad61aba2069261b93fb64d32fdbe6d88d3822e0bd2db8bff40bd5b087` |
| となりの怪物くん reader-step-08         | `e65ff7f8d09276d366e1248fa9b08adbd2890364ea2d17053244f7f5bc18c1e9` |
| となりの怪物くん reader-step-15         | `2355cd0d8b9c8b5d4188d2c34640e26cdefcab4d6e73b5d94242c273165935c2` |
| 失恋ショコラティエ reader-step-04       | `7835452ef35e7d664e2d65b0ef59fc3fd387e66efb5c35c75806e104e4b93500` |
| 失恋ショコラティエ reader-step-08       | `5865eaba41276bda10a0e12628897ab7ddc39464ef744107f2ae11d484f7bfca` |
| 失恋ショコラティエ reader-step-15       | `82e0766b55f6b3ef717656177a7c088a542128f4af95a9a3f8048025db673b8b` |
| シルバーマウンテン reader-display-04    | `0684081b5c50bbebaa957ada97b908accf003cce3bbe47fc76f74e5120921e36` |
| シルバーマウンテン reader-display-06    | `cb7c4d0b70c49291b441072c10b34b12b9a6664a1163c47a793ec1369e791190` |
| シルバーマウンテン reader-display-09    | `5d0ecc4fc0a8eeb06563695d0a534a207bcd196c673d3f5484aa7ab4df98bede` |
| 惑星のさみだれ episode-slot-08          | `0495bc94723b9645e77b432c39e1d755b9962131f78717197c30c371778a220e` |
| 惑星のさみだれ episode-slot-09          | `76766547156ce8815adea1b5d317fbd5f4396d226937d3c007a028a7d59e1e63` |
| 惑星のさみだれ episode-slot-10          | `b80956f5e3612eae1f6a692a3baa97177f201684b34e56889617107a2b34c6fd` |
| 惑星のさみだれ episode-slot-14          | `523f5960647e54f211db83a779be2fa2f97fd031ac59253e676eca03c355cbae` |
| 惑星のさみだれ episode-slot-15          | `22938423582bdb747e8003aeab1d1c6f097f5eda20a70c28a263d9ade4580cc2` |
| 惑星のさみだれ episode-slot-16          | `8317c0be1a45dbe8b4456d5afe83adb9514bba6091005bc72cd1b3c6cc29b164` |
| 終末のワルキューレ reader-step-02-left  | `c22d97ffd823763a6eabbc515f48d85bd517af2aad0270322a9f8000ea1d8dc1` |
| 終末のワルキューレ reader-step-02-right | `1907a95a3694a40d8620173b5363942ee6013dfd8e11262c92512057aacafe5c` |
| 終末のワルキューレ reader-step-03-left  | `060f83e5790406b2ed3eee7f282e44585f5daa372ddff285033ad302116d9f3e` |
| 終末のワルキューレ reader-step-03-right | `bb049234d0abc0725ec938d22cdec5559bfeea99bb63d5aa88f3cd39eb11b6a5` |
| 終末のワルキューレ reader-step-04-left  | `61765cc989e49e12f5588eb135f80227f594c4b4401f878699067b63e20a337e` |
| 終末のワルキューレ reader-step-04-right | `020a7ccde0f5704c2f180751cde62933821244480f132003868d35e1b4d2a9c1` |
| アオイホノオ reader-step-04             | `f1af297d160e3c4111956699f2e01c73748eaa02a32db5212ade5e1d5188abff` |
| アオイホノオ reader-step-08             | `499f1385911d0b0c263b30ccbed364013c9731f8f9c50430e7949ad4cb418122` |
| アオイホノオ reader-step-15             | `ddc1d02ca416c5c0fdad322694abdacf32ae67684ebc28b12688aaaa5cff4a54` |
| 路地恋花 reader-step-08                 | `ac2ed714f7d2d225a286330a105985b953a08170dd43aa823d8cb1f200f55284` |
| 路地恋花 reader-step-15                 | `af9e40aa42c615a4ce3fc46187707912ddc654dae6d7cd0d0e549e1651c3d12f` |
| 路地恋花 reader-step-20                 | `cd4d94071e81ffc3974c15ed55970c0fed852cacba9b169c6cf56574cb081753` |
| 日々ロック reader-step-04               | `5be2869ed13b750255b75ad9d97e6156728d5f4d920b8222bc0e45a1bbffc5bb` |
| 日々ロック reader-step-08               | `d544a0913020697a2f51ac838f8acd73e71380d4634aca819a104c06ddc835ff` |
| 日々ロック reader-step-15               | `03aa4e8df2a78fd14ec5fb95a05e936155cea868142f42a76e487e898a5e95b8` |
| 海獣の子供 reader-step-04               | `87f746d6f679103cfa0400b37716d6c26f7e4f3a9ddb87a8e85ac9ea1a870cc4` |
| 海獣の子供 reader-step-08               | `beafedd8fca6ee082231bae17850bb698faf1ccf2e51ccc5123292870ab7cf9c` |
| 海獣の子供 reader-step-15               | `0c29c294793e96a402eddd8a7c7581dc6b848ac8fb08e38c197c3acbd3335bbb` |

## Finite-stop and edition decisions

- `ねこだらけ`: the exact official unnumbered collected-volume product confirms frozen ISBN `9784063728262`, but its direct `/trial` route returns to the product and exposes no internal reader. All four Art axes close `unknown-ready`, without a promotion blocker.
- `惑星のさみだれ`: the current official 少年画報社 web-manga route identifies `第1話`, author 水上悟志, and content ID `hoshinosamidare_001`. The exact frozen standard volume-one product confirms ISBN `9784785926052`; web-to-print page equivalence is not asserted, but both official records bind the same original Work and entry episode.
- `終末のワルキューレ`: only original series ID `z_R0123`, original volume asset `z_R0123_001`, and its official first episode were sampled. The separate Whomor-made full-color vertical remake page and assets were excluded from Art and Work identity evidence.
- `路地恋花`: the decorative one-page opening spread was excluded. Later reader steps supply six readable body pages across three contexts.

## Motion boundary

Only `海獣の子供` opens motion review. `reader-step-15`, printed pages 016–017, shows the same gym action from run initiation through collision or trip, fall, and the resolved seated reaction. This exact bounded ref may be judged by the Art quorum. Every other work lacks a complete start-development-impact-resolved-end set and closes `motionImpact=unknown` at preflight.

## Verification boundary

Nine works are `sample-ready`, one is `unknown-ready`, and only one has `motionGateAttemptable=true`. Thirty-three selected hashes were recomputed after capture or verified against the delegated immutable files. No image exists under the repository chunk directory; only this ledger and `preflight.csv` are retained. The frozen order, exact work IDs, representative ISBNs, and decorative-title delimiter rule were checked before writing.
