# Batch 004 Art preflight recovery QA — chunk 05 position 44

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen Batch 004 position 44 only
- workId: `work-e2f095e08fc5e08d5a2b`
- canonicalTitle: `高嶺と花`
- overallVerdict: `PASS`
- Art values assigned: none
- final/source/generated/promotion edits: none

## Identity and edition bridge

The frozen row is position 44, `work-e2f095e08fc5e08d5a2b`, `高嶺と花`. The current source work and representative-volume rows identify 師走ゆき, 白泉社, volume 1, and ISBN `9784592213512`.

The live first-party product page at <https://www.hakusensha.co.jp/comicslist/46600/> independently returned all of the following on 2026-08-25:

- title: `高嶺と花 1`
- creator: `師走ゆき`
- ISBN: `9784592213512`
- imprint: `花とゆめコミックス`
- release date: `2015.03.20`
- direct official preview JDCN: `59221351takaneX00111`

The linked 白泉社 e-net URL redirects first to `reader.api.hakusensha-e.net/v1/external/keys/59221351takaneX00111` and then to the official `bsreader.hakusensha-e.net` trial. The retained `face.xml` reports `TotalPage=193`, cover at page 0, first story at page 4, and trial `0_49`. This is an exact title/creator/ISBN/volume-1 bridge rather than a series-level or later-edition inference.

The route registry SHA-256 observed by the recovery ledger was independently reproduced as `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28`. The registry still has no 白泉社 row. This QA therefore validates only this product-linked route and does not generalize it to other 白泉社 works.

## Temporary-original verification

`SHA256SUMS` passed for every file in `/tmp/konocomics-batch004-art-recovery-pos44-round1`. All six retained originals were opened at original resolution. Each is a `1280 × 720` RGB PNG (`921,600` pixels); the six-file total is `5,529,600` pixels.

| Ref | SHA-256 | Pixel inspection | Eligible context |
| --- | --- | --- | --- |
| `hakusensha-reader-page-07` | `8c80ef213245f7b96c338b05bbcf316ba24eeea2f61ed352f7c7ff001ee10aab` | PASS — left leaf is readable story body; the adjacent right-hand author introduction is frontmatter and was excluded | formal omiai/restaurant introduction |
| `hakusensha-reader-page-09` | `07bcdcfe2074e38c40bb70f19e71d53be536abebb6f0b2139f79b0839a066997` | PASS — readable sequential manga body | character/family setup leading into the meeting |
| `hakusensha-reader-page-11` | `ab12a0518883042c1cadbbcecd8d2eef229a4d083cb9a39680dea865d78a2185` | PASS — readable sequential manga body | formal meeting-table dialogue |
| `hakusensha-reader-page-13` | `cd7ae3904292865167c3035cf338e54564d5b58c9e788fc0ed578283a33c2fd8` | PASS — readable sequential manga body | meeting escalation with a school recollection |
| `hakusensha-reader-page-15` | `950eaca334d28f65d98a4e3f5543262e5b86e79e657012df57fb42a9377e186c` | PASS — readable sequential manga body | school/classroom dialogue and car transit |
| `hakusensha-reader-page-17` | `d1946f0d29b76100d259fc68b3129a91c1a603d945af50fc3dd8693896204cd6` | PASS — readable sequential manga body | restaurant exchange and home/clothing preparation |

The conservative count is six eligible body refs: every retained original contains at least one unambiguous readable story-body leaf. The non-body author-introduction leaf visible beside ref 07 is not counted. The eligible material spans at least two genuine scene contexts — the formal restaurant meeting and the school/classroom sequence — with transit and home/preparation material providing additional context. Cover, title, contents, advertisement, and animation imagery are not used.

## Gate result

- `readableInternalPageCount=6`: **PASS**
- `distinctContextCount=3`: **PASS**; at least two independent real settings are directly visible
- `staticGateAttemptable=true`: **PASS**
- `motionGateAttemptable=false`: **PASS**
- `stateEligibility=sample-ready`: **PASS**

The six refs are spaced snapshots, not one exact bounded action sequence. Isolated gestures and reactions do not establish a continuous start-development-impact-resolved chain, so motion remains unopened. This QA assigns no `artRealism`, `artDensity`, `visualSoftness`, or `motionImpact` value and preserves `reviewedByHuman=false`.
