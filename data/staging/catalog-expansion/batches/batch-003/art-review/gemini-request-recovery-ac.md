# Batch 003 recovery AC independent Gemini Art review

## Execution contract

- Use exact model `gemini-3.7-flash-high`, effort `high`, read-only mode.
- `reviewedByHuman=false`; scope is frozen positions 41, 47, 48, and 50 only.
- Independently open all 24 payload PNGs at original pixels. Do not read Local Art conclusions, Gold data, Genre, text Factor, reviews, covers, anime, or model memory.
- The Daybreak reports are gate verification only: positions 41, 47, 48, and 50 pass the static sample gate; position 50 has exactly two contexts. Every `motionImpact` cell is `U`.
- Muse is `NOT_USED`; Cursor Grok is `ART_ABSTAIN`.

## Frozen inputs

| Path                                                                                                       | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                                        | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                                         | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md`               | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv`                                     | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-05/recovery-a-preflight.csv`         | `49575cd19c74142185905ce40eecc7b221e9f04889769409bf4e62169e5bcc9a` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-05/recovery-a-ledger.md`             | `b4f9023d664bd37e73fced21f51057c4736fd9f7e7c5a44769ca1108cfd4afe2` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/recovery-c-preflight.csv`                  | `765a3a5085cabdd99a6c84d591c145598dd291678780390c251fa0699d1eb31c` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/recovery-c-ledger.md`                      | `25b6248eeff4f450ab51ad15c535b2488df7a1fdee488a5e04809c2a9664b0d2` |
| `data/staging/catalog-expansion/batches/batch-003/art-review/chunk-05/daybreak-recovery-a-verification.md` | `26119a831737fac878f361c010fcc4bd3359ed0200eafc1ac11c685fabca96a3` |
| `data/staging/catalog-expansion/batches/batch-003/art-review/daybreak-recovery-c-verification.md`          | `aa65b4ad35e5b50603562ce2803c22ebc8e0948d25885e785e4cd473a6f35f7c` |

## Exact payload manifest

Each line is `position/file=expected SHA-256` in canonical order.

```text
41/p41-01.png=9538a3079b4c557067db396381ace20c2d30c6172e4ae0a957d7d5edae17bdb4
41/p41-02.png=a3e157ce083889b371c6f55e4268dfde9e162cda404daf21ac41fba22727074e
41/p41-03.png=686f68db68710d6baf27d2e1569903b2fb7cc36d8de32c0fd71b395b26bb30f1
41/p41-04.png=0950bea6d0149f3559b96ad8b9c268956854792dfb2bb5e477d057998fc21148
41/p41-05.png=30fd14fdd9ecfba0ecb50ba4ea0822514eb4c45de99e4768255df5a5782f1031
41/p41-06.png=9df8fba0f8c0f7e2a785637c303506f5479f6bb3810e00f0020269c4f5f0366b
47/p47-01.png=34871d86c766042020c4db5855c9c38f4e261001bb25ffd00dd86ed5da2736fb
47/p47-02.png=8eda5785ff40823f1d745c186f585eeaadeca6e64c9c9175f637bfe8ef0d683e
47/p47-03.png=e6da388780acf294c0ab6ed70e9a2de6f13b71b0ed579daeb4b93f1f572b0a06
47/p47-04.png=b2fedbbfdbab116acac9c9435a796675e4f406e72b5095ae57fcd60eb3e2ba9d
47/p47-05.png=4dc5d14c51f8258a0f978d99abb2338f5ca23197b545c8fdc2cbc25578cd7f7a
47/p47-06.png=502fa764050f93004c69f5a3ac5d0f7e7c3973db854d1b6b0356fad4dbb585d1
48/p48-01.png=68aeb03ec5342791fe8a358dfec71576513f80f99773a0a3eaf819ac88110a5d
48/p48-02.png=ebc1650d131e595c3659834d55206172f3e7a9c1fb2511956fe8048cf1211951
48/p48-03.png=9dededb97de0b15495d93613679d17834b84d4f825d137c539b84f3baaabb3af
48/p48-04.png=cb07a5f9e8064c27c52d2e08e702a884968e1fc3b2d10bf8e314e5a36c6ae2d7
48/p48-05.png=fc05d9800420ec2e5e069858f03b5f079d0bd7e9f0c36fd7a47e2e07d531b8a3
48/p48-06.png=026fb77c2bc10256c58370b8f54680e64425fa56ac52f1b80e509bfbae584620
50/p50-01.png=183bd1275489338ba4acee84a819098fa32b96d5264e6611b34035963edfbdc8
50/p50-02.png=6e4604c5218c2e9bb21c93bc449358f804c9d3862fe921cef010d7af6be05f4b
50/p50-03.png=8f7533b0b7eefcd5f75443a4837fcd533e8d443bfc0db7dd68f1252296c5c413
50/p50-04.png=652b977d84d40b83b90925ae8fe5df6a991745a1d97a493b1aa645c96c55fc89
50/p50-05.png=109e006070bd7ec1f27fe8662c57571c712fca8138e9a8b010953de28dc007fb
50/p50-06.png=f18bc6a7e2806e544438b6124aa728fd37280751fd7866efe56ad7b56e5c3f44
```

## Required response

Return one complete Markdown document only.

1. Attest exact model/effort, normal completion, full input and original-pixel access, no timeout/rate-limit/degradation/fallback, and `reviewedByHuman=false`.
2. Echo all ten frozen hashes; give a 24-row computed-hash and unique-visible-cue proof.
3. Give exact-order matrix: `position, workId, artRealism, artDensity, visualSoftness, motionImpact`; cells are `U` or 0–4. Work IDs: 41 `work-c9e32218e26c6c6292f9`, 47 `work-ec6767cc7d294c2b0d67`, 48 `work-f59be454d59478f33914`, 50 `work-f6fa4c2d3a7e1dc5257b`.
4. Every known static cell needs at least two exact payload refs, dictionary-anchor observation, limitation, and confidence. Audit every 0/4 across all contexts.
5. Every motion cell must be `U`. Do not recommend promotion or compare with Local values.
6. Confirm no file was edited and no temporary image was copied, moved, deleted, or committed.

If any hash/input/model/capability/completion condition fails, return `INPUT_OR_CAPABILITY_FAILURE` with the exact reason instead of values.
