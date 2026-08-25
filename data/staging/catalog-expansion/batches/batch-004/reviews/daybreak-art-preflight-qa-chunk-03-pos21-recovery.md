# Batch 004 Art recovery preflight QA — chunk 03 position 21

- workId: `work-53fb816835ab36e40a1f`
- canonicalTitle: `アンデッドアンラック`
- reviewer: Daybreak independent preflight QA
- reviewDate: `2026-08-25`
- reviewedByHuman: `false`
- result: `PASS_WITH_CORRECTION`
- staticGateAttemptable: `true`
- motionGateAttemptable: `false`
- ArtValuesAssigned: `false`
- sourceOrGeneratedDataChanged: `false`
- finalArtChanged: `false`
- temporaryImagesCommitted: `false`

## Correction

Two bounded corrections were required. The recovery packet counted three scene contexts, while original-detail pixel review shows exactly two: the vol. 2 barrier battle and aftermath exchange, and the vol. 3 outdoor confrontation and battle. The recovery preflight, ledger, and research note were corrected from `3` to `2`; this does not change the static gate because the frozen minimum is two contexts. The recorded `shueisha-vol2-adr12` hash was also missing its final `d`; the preflight and ledger now contain the independently recomputed 64-character SHA-256. No other recovery claim required correction.

## Policy and repository bindings

| Input | SHA-256 |
| --- | --- |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `source/works.csv` | `1f684c84eadec277039ea70748307e196b7dcc59f6a2938eb07f5ccd045344fd` |
| `source/volumes.csv` | `daec9d3315c40256fa808618db327dc2219ff204c647ef6a524604ee0c558274` |
| `art-source-route-registry.csv` | `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28` |
| original `art-preflight/chunk-03/preflight.csv` | `cfea3c57b84331d9255dabf652aef7c2b9ef48031d2db31e64b5aaca569a7eee` |
| corrected `recovery-pos21-preflight.csv` | `39ad64056fb4510a4bc35b69652377c0bcab39a670c9ddcebec91b3a62051432` |
| corrected `recovery-pos21-ledger.md` | `927e89162c5564d68d862b456b4a085acc1b8e9a35d43860149abe72911b4c5d` |
| corrected `art-route-recovery-pos21-round-1.md` | `0bba89bea239655b086651b48e95b80776e411f120c20ca6854c5da86f4eb165` |
| unchanged `art-review/chunk-03/final-art.csv` | `90e7a0fb8d306d919029608cd0ee6d4b3ae83f15d9aeff7d8aceafd682bc0f83` |

The registered 集英社 route requires an exact product ISBN to official reader `cid` bridge with matching title, creator, volume, and ISBN. The recovery uses that route and no retailer or unregistered reader.

## Identity and edition verification

The frozen work is `アンデッドアンラック`, creator `戸塚 慶文`, and representative standard vol. 1 ISBN `9784088823102`. The official product payloads bind the same series and creator to standard `新書判` volumes 1–3, with `set_flg=0` and valid ISBN-13 checksums:

| Vol. | ISBN | Release | Product-to-reader bridge |
| ---: | --- | --- | --- |
| 1 | `9784088823102` | `2020-04-03` | official product links `cid=9784088823102` and next ISBN `9784088823300` |
| 2 | `9784088823300` | `2020-06-04` | previous ISBN `9784088823102`, next ISBN `9784088824048`, reader `cid=9784088823300` |
| 3 | `9784088824048` | `2020-09-04` | previous ISBN `9784088823300`, reader `cid=9784088824048` |

The reader identity JSON independently returns matching `ContentID`, `アンデッドアンラック 2` or `3`, `戸塚 慶文`, and `集英社`. The vol. 2 and vol. 3 content payloads declare 29 and 25 ordered reader pages respectively.

| Transient identity artifact | SHA-256 |
| --- | --- |
| vol. 1 product HTML | `a5138303bd5818723a64e3766084d4d5efc2bef7481b0b3cb7f06c52f314f496` |
| vol. 2 product HTML | `1d75f4fdc96e02606ba5d3d7274848f1aa7bde13bf8a1b8373a2bca63ced6aef` |
| vol. 3 product HTML | `9c45f8638c3a67c08da841649f38db53185a71ae90ffb4df3220e926b6f09cfe` |
| vol. 2 reader identity JSON | `190ef147b24da1e84ce73e421b4726e098aa0e031afe707f22db44c434777c9f` |
| vol. 3 reader identity JSON | `51f7f3d5aa427264c14f20e426f352b268c4b51ebafd52dc794033883c25538c` |
| vol. 2 content payload | `7b3bee8dadba7b07e684244dc11b5c1f600c5fcd819c0b90cb248cb62a0cd2af` |
| vol. 3 content payload | `665deb37207e8b0df094cba2d71e446c6e4876f644cae8ad351fa802df085100` |

## Original-pixel review

All six retained official reader frames were reopened at original `1280×1200` detail. Each frame contains a readable numbered body spread; none is a cover, title page, chapter splash, synopsis, character profile, or animation image. The exact SHA-256 values match the recovery preflight.

| Ref | BODY | Context | SHA-256 |
| --- | --- | --- | --- |
| `shueisha-vol2-adr08` | yes | vol. 2 barrier battle | `54bd7a74527d6dabb8ee4fb303661cb6d1f3e262f722b1d736258dd5e7a79090` |
| `shueisha-vol2-adr12` | yes | vol. 2 barrier battle | `e0584d9fe82425db2c5210d31ec920de5f317dc937600ec54dd4d0a474a0a93d` |
| `shueisha-vol2-adr14` | yes | vol. 2 battle aftermath | `59d32287740794112af36811d8507a8bf4ac7a27a9be7a88a7f820ae7bcafac5` |
| `shueisha-vol2-adr16` | yes | vol. 2 aftermath exchange | `9d9ee0f6d157b51429d0ce448886d89bee2c60979c36ddb7a17d4d4e20e55034` |
| `shueisha-vol3-adr16` | yes | vol. 3 outdoor confrontation | `659b8692cec31290069445f3033981a861a7d17aae53372db08ffb8c4e5aa7b9` |
| `shueisha-vol3-adr18` | yes | vol. 3 outdoor confrontation and battle | `07fcd3a1b2a5b4153ee28b8f73809cb82061ad503d97955e8cc8c552db9956f4` |

Thus the static preflight has six readable official body-page frames across exactly two contexts and may proceed to the separate Local Codex plus exact Gemini static Art review. This QA assigns no Art value.

## Motion boundary

The frames contain movement and impact imagery, but they do not preserve one exact, gap-free sequence with a documented start or preparation, development, impact, and resolved endpoint. Vol. 2 `adr08` to `adr12` has an unretained gap; the contiguous `adr12`–`adr16` subset begins after the initiating action. Vol. 3 `adr16`–`adr18` does not establish a resolved impact sequence. `motionGateAttemptable=false` is therefore upheld; action presence was not converted to a score.

## Closure

The original one-context terminal Art rows remain untouched and `unknown`; this recovery only opens a new independent static review. No repository image exists under the Batch 004 directory. `unknown` remains a non-numeric state, no promotion occurred, and all review provenance remains model-only with `reviewedByHuman=false`.
