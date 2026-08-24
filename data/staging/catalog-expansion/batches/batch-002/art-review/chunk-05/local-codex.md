# Batch 002 Art review chunk 05 — Local Codex blind pass

- Reviewer: Local Codex subagent with direct access to the selected pixels
- Assessed: 2026-08-23
- Scope: frozen Batch 002 positions 41–50 and entry volumes 1–3 or the first major episode
- Frozen manifest SHA-256: `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6`
- Preflight SHA-256: `24f97e6b79806d66a9a3051f7ab0cd65bba47d70b944deac3d863da1f5cae480`
- Inputs: Factor Dictionary v1; Batch 002 annotation/review/adjudication request; chunk-05 preflight; and the 24 selected pixel captures only
- Blindness: no Gemini request; result; conclusion; or later adjudication was opened
- Human provenance: `reviewedByHuman=false`
- Temporary root: `/tmp/batch002-art-preflight-chunk05.aOTBj4`

## Pixel and hash verification

Every selected capture was opened at original pixel detail. The preflight's 24 selected SHA-256 values were independently recomputed immediately before review: `24 recomputed / 24 matched / 0 missing / 0 mismatched`. Only those captures were interpreted. Covers; animation; synopsis material; user opinion; and unselected exploratory captures were excluded.

| Work                                             | Evidence ID             | Selected captures                 | Hash result |
| ------------------------------------------------ | ----------------------- | --------------------------------- | ----------- |
| work-ccf0ddff9c6410c4de14 サンキューピッチ       | art-b002-c05-w41-pixels | p010-p011 p024-p025 and p038-p039 | 3 of 3      |
| work-cdef8cfd678998a51447 うさぎドロップ         | art-b002-c05-w42-pixels | p008-p009 p014-p015 and p022-p023 | 3 of 3      |
| work-ced7a8e6d9c3b8147702 水は海に向かって流れる | art-b002-c05-w43-pixels | p010-p011 p016-p017 and p024-p025 | 3 of 3      |
| work-daf65c6f2cce3e076dfa 凪のお暇               | art-b002-c05-w44-pixels | reader screens 04 09 and 14       | 3 of 3      |
| work-db80d94709b62aa8823f 逃げ上手の若君         | art-b002-c05-w45-pixels | p010-p011 p024-p025 and p038-p039 | 3 of 3      |
| work-ef1bdac46a0956a87f7f タコピーの原罪         | art-b002-c05-w46-pixels | p010-p011 p024-p025 and p038-p039 | 3 of 3      |
| work-f5847c45d30753150364 闇のパープル・アイ     | art-b002-c05-w47-pixels | p008-p009 p022-p023 and p026-p027 | 3 of 3      |
| work-fabc7f5d853e361acaf3 YAIBA                  | art-b002-c05-w48-pixels | p008-p009 p022-p023 and p036-p037 | 3 of 3      |

No pixel was opened for the two `unknown-ready` works. Their edition or sample prerequisite failed before visual interpretation.

## Static Art decisions

Values follow the Dictionary's 0 and 2 and 4 anchors. Values 1 and 3 are used only between anchors.

| Work                                             | Contexts | `artRealism` | `artDensity` | `visualSoftness` | Static refs                       |
| ------------------------------------------------ | -------: | -----------: | -----------: | ---------------: | --------------------------------- |
| work-ccf0ddff9c6410c4de14 サンキューピッチ       |        3 |    3 at 0.91 |    3 at 0.90 |        1 at 0.89 | p010-p011 p024-p025 and p038-p039 |
| work-cdef8cfd678998a51447 うさぎドロップ         |        3 |    2 at 0.88 |    2 at 0.85 |        3 at 0.85 | p008-p009 p014-p015 and p022-p023 |
| work-ced7a8e6d9c3b8147702 水は海に向かって流れる |        3 |    2 at 0.87 |    2 at 0.86 |        3 at 0.88 | p010-p011 p016-p017 and p024-p025 |
| work-daf65c6f2cce3e076dfa 凪のお暇               |        3 |    2 at 0.85 |    2 at 0.86 |        3 at 0.87 | reader screens 04 09 and 14       |
| work-db80d94709b62aa8823f 逃げ上手の若君         |        3 |    2 at 0.87 |    4 at 0.93 |        1 at 0.88 | p010-p011 p024-p025 and p038-p039 |
| work-ef1bdac46a0956a87f7f タコピーの原罪         |        3 |    1 at 0.89 |    2 at 0.84 |        2 at 0.82 | p010-p011 p024-p025 and p038-p039 |
| work-f5847c45d30753150364 闇のパープル・アイ     |        3 |    2 at 0.86 |    1 at 0.87 |        3 at 0.88 | p008-p009 p022-p023 and p026-p027 |
| work-fabc7f5d853e361acaf3 YAIBA                  |        3 |    0 at 0.94 |    2 at 0.85 |        1 at 0.88 | p008-p009 p022-p023 and p036-p037 |

## Edition and Evidence ledger

Axis order in vectors is `artRealism / artDensity / visualSoftness / motionImpact`. `U` means `unknown` and is never a low score.

| Work                                             | Evidence ID             | Official URL and edition mapping                                                                                                                                                    | Pages / contexts | Scene contexts                                            | Local gate and vector         |
| ------------------------------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------: | --------------------------------------------------------- | ----------------------------- |
| work-ccf0ddff9c6410c4de14 サンキューピッチ       | art-b002-c05-w41-pixels | <https://www.shueisha.co.jp/books/reader/main.php?cid=9784088843056>; official volume 1 reader maps directly to frozen ISBN `9784088843056`                                         |            6 / 3 | pitching trial; classroom recruitment; batting test       | static pass; `3 / 3 / 1 / 4`  |
| work-cdef8cfd678998a51447 うさぎドロップ         | art-b002-c05-w42-pixels | <https://shodensha.tameshiyo.me/3967638000000000001E>; official MangaJam first episode maps to frozen volume 1 ISBN `9784396763800`                                                 |            6 / 3 | kitchen arrival; memorial hall; family negotiation        | static pass; `2 / 2 / 3 / U`  |
| work-ced7a8e6d9c3b8147702 水は海に向かって流れる | art-b002-c05-w43-pixels | <https://www.kodansha.co.jp/comic/products/0000319530/trial>; official volume 1 product maps to frozen ISBN `9784065144510`                                                         |            6 / 3 | rainy arrival; room introduction; family memory           | static pass; `2 / 2 / 3 / U`  |
| work-daf65c6f2cce3e076dfa 凪のお暇               | art-b002-c05-w44-pixels | <https://arc.akitashoten.co.jp/comics/nagi/1>; official frozen volume 1 ISBN `9784253156370` product links the ARC chapter 1 preview                                                |            6 / 3 | workplace; relationship apartment; new apartment          | static pass; `2 / 2 / 3 / U`  |
| work-db80d94709b62aa8823f 逃げ上手の若君         | art-b002-c05-w45-pixels | <https://www.shueisha.co.jp/books/reader/main.php?cid=9784088827100>; official volume 1 reader maps directly to frozen ISBN `9784088827100`                                         |            6 / 3 | ceremonial procession; prophecy encounter; burning estate | static pass; `2 / 4 / 1 / U`  |
| work-ef1bdac46a0956a87f7f タコピーの原罪         | art-b002-c05-w46-pixels | <https://www.shueisha.co.jp/books/reader/main.php?cid=9784088830490>; official upper-volume reader maps directly to frozen ISBN `9784088830490`                                     |            6 / 3 | schoolyard meeting; home and dog; solitary search         | static pass; `1 / 2 / 2 / U`  |
| work-f5847c45d30753150364 闇のパープル・アイ     | art-b002-c05-w47-pixels | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091316510000d0000000>; digital standard volume 1 JDCN maps to frozen paper ISBN `9784091316516`                                   |            6 / 3 | rooftop injury; domestic fever; nighttime eye change      | static pass; `2 / 1 / 3 / U`  |
| work-fabc7f5d853e361acaf3 YAIBA                  | art-b002-c05-w48-pixels | <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091222710000d0000000>; digital standard volume 1 JDCN maps to frozen paper ISBN `9784091222718`                                   |            6 / 3 | jungle tiger encounter; city meeting; sword sparring      | static pass; `0 / 2 / 1 / 4`  |
| work-fb7a0ed6a88db7d7bc71 夢の碑                 | none                    | <https://shogakukan-comic.jp/book?jdcn=091912210000d0000000>; current Flower Comics alpha collection has no official bridge to frozen 1984 Petit Flower Comics ISBN `9784091785015` |            0 / 0 | none                                                      | edition fail; `U / U / U / U` |
| work-fd88144bf7334c4aae39 おそ松くん             | none                    | <https://www.kodansha.co.jp/comic/products/0000120298>; exact official volume 1 product maps to ISBN `9784061005099` but exposes no internal preview or reader                      |            0 / 0 | none                                                      | sample fail; `U / U / U / U`  |

## Motion gate result

Only `サンキューピッチ` and `YAIBA` passed the separate motion sequence gate.

- `サンキューピッチ` p010–p011 preserves wind-up; release; ball travel; and the catcher-reception endpoint. Converging speed lines and forceful impact emphasis support `motionImpact=known 4` at confidence `0.95`.
- `YAIBA` p036–p037 preserves the declared attack; repeated exchanges; a parry; and a separated endpoint. Repeated speed lines and strong contact emphasis support `motionImpact=known 4` at confidence `0.94`.

The other six sampled works remain `motionImpact=unknown` because none of their selected refs preserves an exact continuous start-development-impact-end sequence. The two no-sample works remain four-axis `unknown`. No `notApplicable` state was inferred from a six-page sample.

## Extrema and uncertainty

- `逃げ上手の若君 artDensity=4` is supported by repeated ornate armor; patterned clothing; crowds; compact paneling; flames; and dense hatching across all three contexts.
- `YAIBA artRealism=0` is supported by strong deformation in child figures; animals; and adults across jungle; comedy; and sparring contexts.
- `サンキューピッチ motionImpact=4` and `YAIBA motionImpact=4` are each bounded to the exact sequence named above. No genre expectation or isolated impact was converted into a motion score.
- No other axis received 0 or 4. Intermediate values 1 and 3 mean the complete six-page sample visibly falls between adjacent Dictionary anchors. They are not averages.
- Output totals are 40 terminal axis rows: 26 known and 14 unknown. The unknown total consists of six motion rows plus eight rows for the two no-sample works.
- Art `unknown` is not a low value. Sample shortage or unresolved edition mapping alone is not a promotion blocker.
- No temporary image was copied into the repository. No source catalog; Factor Dictionary; Gold row; non-Art annotation; Gemini artifact; or adjudication artifact was changed.
