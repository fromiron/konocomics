# Batch 003 Art recovery A+C — Local Codex review

- reviewDate: `2026-08-25`
- reviewer: Local Codex
- agent: `/root/local_art_recovery_ac`
- reviewedByHuman: `false`
- mode: independent static-Art proposal after direct original-pixel inspection
- scope: frozen positions 41, 47, 48, and 50 only
- sourceMutation: `none`
- temporaryImagesCommitted: `false`
- blind boundary: no prior Local or Gemini Art conclusion for these works was read

## Decision matrix

| Pos | Work                 | workId                      | artRealism | artDensity | visualSoftness | motionImpact |
| --: | -------------------- | --------------------------- | ---------: | ---------: | -------------: | ------------ |
|  41 | ファントムバスターズ | `work-c9e32218e26c6c6292f9` |   1 (0.88) |   2 (0.87) |       1 (0.89) | `unknown`    |
|  47 | 僕の小規模な生活     | `work-f1d22b68efa7fbd501ee` |   0 (0.95) |   1 (0.92) |       3 (0.89) | `unknown`    |
|  48 | ハクメイとミコチ     | `work-f59be454d59478f33914` |   2 (0.87) |   4 (0.96) |       2 (0.86) | `unknown`    |
|  50 | ワカコ酒             | `work-f6fa4c2d3a7e1dc5257b` |   1 (0.91) |   2 (0.88) |       4 (0.93) | `unknown`    |

Values follow the Factor Dictionary's 0/2/4 anchors; intermediate values are used only where the directly inspected treatment falls between anchors. Each known axis cites at least two exact reader refs and records a separate observable pixel claim in `local-art-recovery-ac.csv`. Position 48's density value reaches the extreme anchor because high line, background, and texture density persists across all six forest and town pages. Position 50's softness value reaches the extreme anchor because rounded, clean treatment persists across exactly two distinct episodes: salmon-restaurant P007-P010 and yakitori P012-P013.

All four `motionImpact` states remain `unknown`. Daybreak accepted no bounded start-development-impact-resolved sequence for these four works, so isolated gestures, an owl reveal, eating, and transition panels were not converted into numeric motion evidence.

## Direct-pixel and gate verification

All 24 retained body pages were opened individually at original detail from the canonical temporary directories. Position 41 uses exact official Shueisha volume 2; position 47 uses exact official Kodansha volume 2; position 48 uses exact KADOKAWA-linked BOOK WALKER volumes 2-3; position 50 uses the accepted Coamix/Cmoa volume 1 body bridge. Covers, title-only pages, contents, blanks, and contact sheets were not used for values.

Daybreak's corrected context boundary is preserved: position 50 has exactly two contexts, salmon restaurant and yakitori episode. The street-to-counter transition remains within the yakitori context and is not counted as a third.

## Recomputed hashes

| Pos | Ref                | SHA-256                                                            |
| --: | ------------------ | ------------------------------------------------------------------ |
|  41 | `vol2-P0011`       | `9538a3079b4c557067db396381ace20c2d30c6172e4ae0a957d7d5edae17bdb4` |
|  41 | `vol2-P0012`       | `a3e157ce083889b371c6f55e4268dfde9e162cda404daf21ac41fba22727074e` |
|  41 | `vol2-P0013`       | `686f68db68710d6baf27d2e1569903b2fb7cc36d8de32c0fd71b395b26bb30f1` |
|  41 | `vol2-P0014`       | `0950bea6d0149f3559b96ad8b9c268956854792dfb2bb5e477d057998fc21148` |
|  41 | `vol2-P0015`       | `30fd14fdd9ecfba0ecb50ba4ea0822514eb4c45de99e4768255df5a5782f1031` |
|  41 | `vol2-P0020`       | `9df8fba0f8c0f7e2a785637c303506f5479f6bb3810e00f0020269c4f5f0366b` |
|  47 | `vol2-reader-P007` | `34871d86c766042020c4db5855c9c38f4e261001bb25ffd00dd86ed5da2736fb` |
|  47 | `vol2-reader-P008` | `8eda5785ff40823f1d745c186f585eeaadeca6e64c9c9175f637bfe8ef0d683e` |
|  47 | `vol2-reader-P009` | `e6da388780acf294c0ab6ed70e9a2de6f13b71b0ed579daeb4b93f1f572b0a06` |
|  47 | `vol2-reader-P010` | `b2fedbbfdbab116acac9c9435a796675e4f406e72b5095ae57fcd60eb3e2ba9d` |
|  47 | `vol2-reader-P011` | `4dc5d14c51f8258a0f978d99abb2338f5ca23197b545c8fdc2cbc25578cd7f7a` |
|  47 | `vol2-reader-P012` | `502fa764050f93004c69f5a3ac5d0f7e7c3973db854d1b6b0356fad4dbb585d1` |
|  48 | `vol2-P008`        | `68aeb03ec5342791fe8a358dfec71576513f80f99773a0a3eaf819ac88110a5d` |
|  48 | `vol2-P009`        | `ebc1650d131e595c3659834d55206172f3e7a9c1fb2511956fe8048cf1211951` |
|  48 | `vol2-P010`        | `9dededb97de0b15495d93613679d17834b84d4f825d137c539b84f3baaabb3af` |
|  48 | `vol3-P009`        | `cb07a5f9e8064c27c52d2e08e702a884968e1fc3b2d10bf8e314e5a36c6ae2d7` |
|  48 | `vol3-P010`        | `fc05d9800420ec2e5e069858f03b5f079d0bd7e9f0c36fd7a47e2e07d531b8a3` |
|  48 | `vol3-P011`        | `026fb77c2bc10256c58370b8f54680e64425fa56ac52f1b80e509bfbae584620` |
|  50 | `cmoa-74548-P007`  | `183bd1275489338ba4acee84a819098fa32b96d5264e6611b34035963edfbdc8` |
|  50 | `cmoa-74548-P008`  | `6e4604c5218c2e9bb21c93bc449358f804c9d3862fe921cef010d7af6be05f4b` |
|  50 | `cmoa-74548-P009`  | `8f7533b0b7eefcd5f75443a4837fcd533e8d443bfc0db7dd68f1252296c5c413` |
|  50 | `cmoa-74548-P010`  | `652b977d84d40b83b90925ae8fe5df6a991745a1d97a493b1aa645c96c55fc89` |
|  50 | `cmoa-74548-P012`  | `109e006070bd7ec1f27fe8662c57571c712fca8138e9a8b010953de28dc007fb` |
|  50 | `cmoa-74548-P013`  | `f18bc6a7e2806e544438b6124aa728fd37280751fd7866efe56ad7b56e5c3f44` |

The recomputed set matches the preflight and Daybreak verification `24/24`. No temporary image was copied into the repository.
