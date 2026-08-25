# Batch 004 Art preflight recovery — position 44

- scope: frozen Batch 004 position 44 only
- workId: `work-e2f095e08fc5e08d5a2b`
- canonicalTitle: `高嶺と花`
- creator: `師走ゆき`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- promotionPerformed: `false`
- acquisition boundary: 白泉社 official product page, the publisher-linked 白泉社 e-net official internal preview, and the linked `bsreader.hakusensha-e.net` reader/API only

## Frozen identity and edition bridge

| Item | Value |
| --- | --- |
| frozen representative ISBN | `9784592213512` |
| official product | https://www.hakusensha.co.jp/comicslist/46600/ |
| product title / creator | `高嶺と花 1` / `師走ゆき` |
| product series | `花とゆめコミックス` |
| product release date | `2015-03-20` |
| official publisher preview | https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59221351takaneX00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D46600 |
| preview JDCN | `59221351takaneX00111` |
| reader trial | `0_49` (50 reader pages exposed by the entry-volume trial) |

The live 白泉社 product HTML contains the exact title, creator, ISBN, release date, and a direct `hakusensha-e.net/hakusensha_otameshi` link with the matching product return URL. The official reader redirected to `bsreader.hakusensha-e.net` and returned `face.xml` with `TotalPage=193`, a first story TOC entry at page 4, and the ordered internal page XML/image requests. No retailer, fan scan, animation frame, or unregistered preview was substituted.

The existing finite route registry did not list 白泉社 as a trusted preview route. This recovery records the publisher-linked route discovery; it does not modify the registry or any catalog/source file.

## Official route and capture verification

The browser network ledger records the publisher product, reader key redirect, `face.xml`, page XML, and rendered image requests. The selected frames were rendered by the official reader in Chromium and copied to the temporary-only bundle:

`/tmp/konocomics-batch004-art-recovery-pos44-round1/`

The bundle is uncompressed and contains the product HTML, sample entry HTML, reader `face.xml`, static network request ledger, URL/reference notes, and six temporary rendered reader frames. `SHA256SUMS` binds every bundle file. The route-registry hash observed during recovery was `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28`.

## Selected internal sample

All six selected refs are within the first entry-volume trial window and are rendered reader frames after the cover/title/contents material. They show readable Japanese manga body imagery. The sample spans at least three distinct contexts: formal omiai/restaurant interior, school/public outing, and home/office/meal interaction.

| reader ref | temporary capture SHA-256 | bounded observation |
| --- | --- | --- |
| `hakusensha-reader-page-07` | `8c80ef213245f7b96c338b05bbcf316ba24eeea2f61ed352f7c7ff001ee10aab` | opening omiai-related character interaction and formal interior |
| `hakusensha-reader-page-09` | `07bcdcfe2074e38c40bb70f19e71d53be536abebb6f0b2139f79b0839a066997` | formal meeting, character exchange, and social setting |
| `hakusensha-reader-page-11` | `ab12a0518883042c1cadbbcecd8d2eef229a4d083cb9a39680dea865d78a2185` | family/social conversation and interior interaction |
| `hakusensha-reader-page-13` | `cd7ae3904292865167c3035cf338e54564d5b58c9e788fc0ed578283a33c2fd8` | relationship dialogue and office/home-adjacent interaction |
| `hakusensha-reader-page-15` | `950eaca334d28f65d98a4e3f5543262e5b86e79e657012df57fb42a9377e186c` | school/public outing and group conversation |
| `hakusensha-reader-page-17` | `d1946f0d29b76100d259fc68b3129a91c1a603d945af50fc3dd8693896204cd6` | meal/shopping and interpersonal exchange |

The six-frame sample makes the static Art gate attemptable. It does not itself assign `artRealism`, `artDensity`, or `visualSoftness`; the independent Art panel must inspect this same uncompressed bundle before any value is considered. `motionImpact` remains unknown-ready because the selected frames do not establish one exact continuous start-development-impact-resolved sequence.

## Closure

This recovery supersedes the earlier product-only `unknown-ready` preflight for position 44 by documenting an exact publisher-linked internal preview route and a six-frame, multi-context entry-volume sample. It does not modify `final-art.csv`, `source`, generated catalog, promotion registry, or any Factor value. `reviewedByHuman=false`, `temporaryImagesCommitted=false`, and `FactorValuesAssigned=false` remain explicit.
