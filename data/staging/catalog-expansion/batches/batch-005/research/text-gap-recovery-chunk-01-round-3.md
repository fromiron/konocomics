# Batch 005 text-gap recovery — chunk 01 round 3

- 조사일: `2026-08-25`
- 대상: `batch-005/frozen-work-set.csv` positions `1, 2, 5, 6, 7, 8, 9, 10`
- 제외: position `3` (`インベスターZ`)와 position `4` (`黄泉のツガイ`)는
  `reviews/daybreak-text-blocker-adjudication-chunk-01.md`에서 이미
  `SOURCE_INFORMATION_UNAVAILABLE`로 확정되었으므로 이 회차에서 재개방하지 않았다.
- 평가 범위: representative edition에 매핑 가능한 entry volume 1–3의 공식
  작품·권 소개와 허가된 preview route. 설명이 특정 권에 한정되지 않으면 그
  권의 반복 메커니즘으로 승격하지 않았다.
- `reviewedByHuman=false`
- current candidate root SHA-256:
  `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256:
  `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256:
  `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- current terminal text CSV SHA-256 (read-only attestation):
  `dde01a78cb4ddfc5b51805e8828bc45ba83ab9f9d6ff77342ce504a7524369e7`
- Pass A factors SHA-256:
  `d49ca60fc5ebe84c5ca0b7665be613f3fd66682c0d25459edce9189254251511`
- PAYLOAD.sha256 SHA-256:
  `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- 외부 자료의 `retrievedAt`: `2026-08-25`

## Recovery contract

이번 회차는 Daybreak가 지목한 정확한 미확인 공식 route만 재조사했다. 순서는
publisher/rightsholder의 volume 1–3 소개와 authorized preview, 그에 연결된
bookseller/distributor route, 그 다음에 이미 수집된 bounded user-review
보조 관찰이다. 유저평은 새 독립 판정으로 사용하지 않았고, 공식 자료와
충돌하는 경우 값을 만들지 않았다.

이 문서는 연구 packet이며 terminal CSV, source, registry, overlay,
promotion 상태를 변경하지 않는다. 아래 `observation`은 adjudicator가
Factor Dictionary의 정의와 해당 범위를 다시 대조할 수 있는 관찰이지 terminal
known 값이 아니다. 침묵·누락은 `0`으로 변환하지 않았으며, 기존 known 셀을
재판정하지 않았다.

`『』`·`「」` 같은 일본어 괄호는 canonical title에 포함하지 않았다. 이 문서의
canonical title도 장식 괄호 없이 쓴다. Art 축, 이미지 픽셀 판정, motion 판정은
이번 텍스트 회차의 범위가 아니다. 임시 이미지 파일은 만들거나 커밋하지 않았다.

## Route result summary

| pos | workId | canonical title | exact route result | terminal effect |
| ---: | --- | --- | --- | --- |
| 1 | `work-060a72fe10cf6ba9cbfc` | チェーザレ 破壊の創造者 | Kodansha volume 2/3 product-linked trials reached; reader API returned `result=1` and content identifiers | residual Narrative/Tone cells remain `unknown`; no blocker |
| 2 | `work-076beb86f844b642beef` | くーねるまるた | Shogakukan JDCN volume 2/3 viewers redirected to BinB Speed Reader; metadata API returned `result=1` with volume descriptions and body image requests | residual Narrative/Tone cells remain `unknown`; no blocker |
| 5 | `work-0d1ad77728a44df56508` | ラーメン大好き小泉さん | BookLive licensed alternate-edition volume 1–3 product routes reached; each page explicitly maps to the corresponding frozen Takeshobo edition | residual Theme/Narrative/Tone cells remain `unknown`; no blocker |
| 6 | `work-0dabd1d17e5fcf2992b9` | 忘却のサチコ | Shogakukan Tameshiyo volume 2/3 HTML metadata and preview image routes reached; edition hash and volume descriptions observed | residual Narrative/Tone cells remain `unknown`; no blocker |
| 7 | `work-0ebf010ac12b9b60d80e` | 機動旅団八福神 | Exact BOOK☆WALKER volume 2/3 routes redirected to viewer shells; KADOKAWA volume-2 product description and edition map independently confirmed | no terminal change; residual cells remain `unknown`; no blocker |
| 8 | `work-0ede6921b81169dc2dda` | 不滅のあなたへ | Kodansha volume 2/3 product-linked trials reached; reader API returned `result=1`, and volume 2 loaded 19 body images | residual Narrative/Tone cells remain `unknown`; no blocker |
| 9 | `work-0eff8190c0c6ff604527` | よるくも | Shogakukan JDCN volume 2/3 viewers and direct book pages reached; metadata API returned `result=1` | residual Theme/Narrative/Tone cells remain `unknown`; no blocker |
| 10 | `work-12b484cd79bfe6852ea1` | 高校球児 ザワさん | Shogakukan JDCN volume 2/3 viewers and direct book pages reached; official volume descriptions were available | residual Narrative/Tone cells remain `unknown`; no blocker |

`exact route reached` does not mean that an Axis was automatically resolved. A
preview is admissible only for a bounded, recurring textual observation that the
independent adjudicator can map to the dictionary. Reader shells, metadata, title
lists, or image availability alone are not Factor evidence.

## Per-position source ledger and bounded observations

### Position 1 — チェーザレ 破壊の創造者

| id | sourceName | URL | publishedAt | route / bounded claim |
| --- | --- | --- | --- | --- |
| `1-R3-O1` | 講談社公式商品ページ — volume 2 | https://www.kodansha.co.jp/comic/products/0000013470 | `2006-10-23` | Medici, the Pisa archbishop, and the Dominicans are placed in secular/religious power conflict; Cesare pursues a papal plan and encounters another exceptional figure. |
| `1-R3-O2` | 講談社公式試し読み — volume 2 | https://www.kodansha.co.jp/comic/products/0000013470/trial | `2006-10-23` | Product-linked official trial; reader API returned `result=1`, ContentID `0977fdc0-9b26-4997-a767-97a132f20f7b`; no page-level text value was materialized here. |
| `1-R3-O3` | 講談社公式商品ページ — volume 3 | https://www.kodansha.co.jp/comic/products/0000013493 | `2007-04-23` | Machiavelli appears, papal succession approaches, cardinals maneuver, and another strategist approaches Cesare. |
| `1-R3-O4` | 講談社公式試し読み — volume 3 | https://www.kodansha.co.jp/comic/products/0000013493/trial | `2007-04-23` | Product-linked official trial; reader API returned `result=1`, ContentID `ca29bb99-6a32-47ed-b877-9d2e4656be2d`; no page-level text value was materialized here. |

Admissible bounded observations are political/religious conflict, succession
manoeuvring, and the introduction of a new strategist in volumes 2–3. Those claims
may be considered against the residual Narrative cells, but a plot event is not
automatically `progression`, `problemSolving`, or `mysteryReveal`. Serious political
stakes are not by themselves `darkness` or `mentalStress`; a historical genius
encounter is not a romance or comedy observation.

Rejection: the API/content route proves edition and preview availability, not a
recurring Axis. No page-level panel reading was asserted, and no value was promoted.

Route boundary: the volume-2 and volume-3 official trials named by Daybreak are now
checked. Paid/full-reader pages, later volumes, and unbounded historical recollection
were not used. Residual cells remain terminal `unknown` pending independent
adjudication of the bounded claims; this is not a final source blocker.

### Position 2 — くーねるまるた

| id | sourceName | URL | publishedAt | route / bounded claim |
| --- | --- | --- | --- | --- |
| `2-R3-O1` | 小学館 eコミック公式 viewer — volume 2 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091853050000d0000000 | `undated` (JDCN `091853050000d0000000`) | BinB Speed Reader route; API returned `result=1`, title `くーねるまるた 2`, publisher 小学館. Description covers seasonal food, neighbours, sharing, and named dishes including 石狩鍋 and dried-fish rice. |
| `2-R3-O2` | 小学館 eコミック公式 viewer — volume 3 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091857280000d0000000 | `undated` (JDCN `091857280000d0000000`) | API returned `result=1`, title `くーねるまるた 3`, publisher 小学館. Description covers neighbours/friends, Tokyo daily life, and recipes including bonito tataki, milk soup, and eel-style rice. |
| `2-R3-O3` | 小学館 eコミック official API route — volume 2 | https://e-comi.shogakukan.co.jp/sws/apis/bibGetCntntInfo?cid=091853050000d0000000 | `undated` | Network route observed from the exact viewer; `ContentsServer` was returned and 16 body image blobs loaded. No local image or visual Art judgement was retained. |
| `2-R3-O4` | 小学館 eコミック official API route — volume 3 | https://e-comi.shogakukan.co.jp/sws/apis/bibGetCntntInfo?cid=091857280000d0000000 | `undated` | Network route observed from the exact viewer; metadata and title were returned. |

The two official descriptions establish recurring food/recipe, seasonal, and
neighbour-sharing observations within volumes 2–3. They can be considered for the
existing Theme and relationship/tone gates, but `food` is not automatically a legal
Theme and a recipe mention is not automatically a problem-solving Axis. Gentle
neighbourhood setting is not automatically `worldBuilding`; the absence of a reveal
or romance mention remains unknown rather than zero.

Rejection: the BinB shell and body-image count do not establish Art or motion. No
Axis was inferred from the genre or from “愉快で美味しい” promotional language alone.

Route boundary: exact official volume-2/3 viewers and their metadata API routes were
checked. Later volumes and paid/full pages were not used. The five residual Narrative
cells and three residual Tone cells remain `unknown` until an adjudicator maps a
recurring mechanism; no blocker is established.

### Position 5 — ラーメン大好き小泉さん

| id | sourceName | URL | publishedAt | route / bounded claim |
| --- | --- | --- | --- | --- |
| `5-R3-O1` | BookLive licensed alternate edition — volume 1 | https://booklive.jp/product/index/title_id/1657125/vol_no/001 | `2024-10-08` | BookLive page identifies 秋田書店版 and explicitly says content overlaps the frozen 竹書房版 volume 1. Synopsis is a ramen-focused school-girl outing/consumption premise; tags include `ギャグ・コメディ` and `グルメ`. |
| `5-R3-O2` | BookLive licensed alternate edition — volume 2 | https://booklive.jp/product/index/title_id/1657125/vol_no/002 | `2024-10-08` | Explicitly maps to frozen 竹書房版 volume 2. Synopsis ranges over early-morning entertainment districts, food parks, convenience stores, and trips; the endpoint is always ramen. |
| `5-R3-O3` | BookLive licensed alternate edition — volume 3 | https://booklive.jp/product/index/title_id/1657125/vol_no/003 | `2024-10-08` | Explicitly maps to frozen 竹書房版 volume 3. Synopsis describes mountain trips, food destinations, and ramen-focused travel/consumption; tags again include comedy and gourmet. |

The BookLive records are licensed distributor evidence and their explicit overlap
notes bind the alternate edition to the frozen representative work. They support a
recurring ramen-seeking, destination, and consumption subject across volumes 1–3.
They do not show a recurring preparation/crafting process. `グルメ`, `少年マンガ`,
or the presence of a schoolgirl cannot be copied into a legal Theme or Axis without
the dictionary's direct criterion.

Rejection: ramen consumption is not `cooking`; restaurant/travel destinations are
not `worldBuilding`; school identity is not automatically a school Theme; tags and
“笑える” user language do not, by themselves, establish a repeated `comedy` Axis.
No internal page payload was deterministically extracted from the alternate-edition
product routes in this packet, so no terminal value was created.

Route boundary: all three Daybreak-named edition-mapped BookLive routes were
checked. The licensed product pages establish identity mapping but not a complete
page-level 1–3 reader audit. Paid/full pages and later volumes were not used. Theme,
all Narrative cells, and all Tone cells remain `unknown`; the work is not blocked.

### Position 6 — 忘却のサチコ

| id | sourceName | URL | publishedAt | route / bounded claim |
| --- | --- | --- | --- | --- |
| `6-R3-O1` | 小学館公式 Tameshiyo preview — volume 2 | https://sc-portal.tameshiyo.me/9784091868800 | `2015-04-30` | Official metadata describes editorial travel to Osaka, an encounter with the former fiancé, and eating Osaka food/Sanuki udon as a “forgetting” response. HTML exposed `bookHash=beaf9f6bcc11f058b5c6a2cd1ce5d6ec`, `maxPageNum=22`, and official image requests. |
| `6-R3-O2` | 小学館公式 Tameshiyo preview — volume 3 | https://sc-portal.tameshiyo.me/9784091871756 | `2015-08-28` | Official metadata describes a sleeper-train reporting assignment, pressure from rail fans and schedule, and food/travel seeking across Kyoto, Hiroshima, and Hida Takayama. The route uses the same edition mapping/book hash as volume 1. |
| `6-R3-O3` | 小学館公式 book record — volume 2 | https://shogakukan-comic.jp/book?isbn=9784091868800 | `2015-04-30` | Publisher identity and volume date corroborate the Tameshiyo edition. |
| `6-R3-O4` | 小学館公式 book record — volume 3 | https://shogakukan-comic.jp/book?isbn=9784091871756 | `2015-08-28` | Publisher identity and volume date corroborate the Tameshiyo edition. |

Bounded claims are recurring work/travel assignments, food as a local recovery/
forgetting device, and external schedule/assignment pressure. These may be weighed
against the residual Narrative/Tone cells, but a former fiancé is not automatically
an active romance axis; travel location is not a fictional world-building rule; and
food relief is not automatically bond-centred emotional warmth.

Rejection: metadata and image endpoints establish an authorized preview and edition,
not an Art or motion judgement. No page image was retained in the repository and no
new Factor was materialized. The prior provisional comedy/warmth observations remain
provisional and are not silently promoted by this route.

Route boundary: exact official volume-2/3 Tameshiyo routes and publisher records were
checked. Full paid reader and later-series evidence were not used. Residual Narrative
and Tone cells remain `unknown` pending adjudication; no blocker is established.

### Position 7 — 機動旅団八福神

| id | sourceName | URL | publishedAt | route / bounded claim |
| --- | --- | --- | --- | --- |
| `7-R3-O1` | KADOKAWA公式商品ページ — volume 2 paper | https://www.kadokawa.co.jp/product/200700002920/ | `2005-06-25` | Official volume-2 description identifies the eight protagonists' battle machine “福神,” its absolute-defense premise, and the arrival of eighth protagonist Akira; it says the story begins to accelerate. |
| `7-R3-O2` | KADOKAWA公式商品ページ — volume 2 electronic | https://www.kadokawa.co.jp/product/301312001355/ | `2014-02-06` | Electronic edition repeats the volume-2 identity/description and binds the same work to the rightsholder record. |
| `7-R3-O3` | BOOK☆WALKER official preview — volume 2 | https://bookwalker.jp/ded06fa6ff-4c2c-46be-b64c-75a5b94adb34/?sample=1&from=1 | `undated` (KADOKAWA-linked route) | HTTP 302 reached the trial viewer shell (`viewer-trial.bookwalker.jp`); shell returned 200, but no deterministic text/payload was extracted. |
| `7-R3-O4` | BOOK☆WALKER official preview — volume 3 | https://bookwalker.jp/ded58267a8-f4c8-4751-9065-aae9e8b46aaa/?sample=1&from=1 | `undated` (KADOKAWA/rightsholder-linked route) | HTTP 302 reached the trial viewer shell; no deterministic text/payload was extracted. |
| `7-R3-O5` | Sony Reader licensed volume-3 record | https://ebookstore.sony.jp/title/10102361/id/LT000016409000340695/ | `2014-03-08` | Licensed volume-3 synopsis remains a secondary edition/range corroboration; frozen representative is volume 9, so it is not used to replace the work's representative ISBN. |

The official volume-2 description supports bounded observations of an eight-person
cast, a named battle-machine rule, defensive technology, new-character introduction,
and narrative acceleration language. Those observations may be considered for
`worldBuilding`, `relationshipStructure`, or Narrative cells only after dictionary
review; a war setting or weapon name is not automatically `strategy` or
`problemSolving`.

Rejection: the BookWalker shell's reachability is not page content. “Absolute
defense” is not an Art/motion value, and a serious war premise is not sufficient for
`mentalStress` or `darkness` beyond the already accepted cells. No value was
materialized from the shell.

Route boundary: exact volume-2/3 BookWalker routes, KADOKAWA volume-2 records, and
the licensed volume-3 corroboration were checked. A deterministic panel/text payload
was not available from BookWalker in this run; paid/full readers and later volumes
were not used. Residual Narrative/Tone cells remain `unknown`, and no blocker is
established because the named rightsholder routes were reached.

### Position 8 — 不滅のあなたへ

| id | sourceName | URL | publishedAt | route / bounded claim |
| --- | --- | --- | --- | --- |
| `8-R3-O1` | 講談社公式商品ページ — volume 2 | https://www.kodansha.co.jp/comic/products/0000019946 | `2017-03-17` | Official description bounds Fushi's Janome imprisonment with girls, March's naming of Fushi, and Parona's escape plan to save March. |
| `8-R3-O2` | 講談社公式試し読み — volume 2 | https://www.kodansha.co.jp/comic/products/0000019946/trial | `2017-03-17` | Reader API returned `result=1`, ContentID `0b8ec346-8072-4e4b-ad83-955a654cb144`; 19 reader images loaded. No local image or Art judgement was retained. |
| `8-R3-O3` | 講談社公式商品ページ — volume 3 | https://www.kodansha.co.jp/comic/products/0000020013 | `2017-06-16` | Official description introduces the first enemy encounter, masked boy Gugu, a younger-brother relationship, and Gugu's flight from Booze's estate. |
| `8-R3-O4` | 講談社公式試し読み — volume 3 | https://www.kodansha.co.jp/comic/products/0000020013/trial | `2017-06-16` | Product-linked official trial reached; reader route was available, but no page-level textual claim was materialized in this packet. |

The volume-2/3 descriptions provide bounded encounter, protection/escape, and
caregiver/sibling observations. They may be useful to adjudicate residual
relationship or warmth cells, but a new companion is not automatically a fixed-party
structure, and an enemy encounter is not automatically `mysteryReveal`,
`problemSolving`, or `strategy`.

Rejection: official premise phrases such as evolution, loss, or family are not
themselves recurring Axis values. The reader API and image count establish route and
edition only; no Art or motion judgement was made. Unknown remains unknown when the
description does not meet a dictionary threshold.

Route boundary: exact official volume-2/3 product-linked trials were reached. Full
reader and later volumes were not used. Residual Narrative/Tone cells remain
`unknown` pending independent mapping; no blocker is established.

### Position 9 — よるくも

| id | sourceName | URL | publishedAt | route / bounded claim |
| --- | --- | --- | --- | --- |
| `9-R3-O1` | 小学館公式 e-comic viewer — volume 2 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091885600000d0000000 | `undated` (JDCN `091885600000d0000000`) | BinB route/API returned `result=1`; metadata title `よるくも 2`. Description binds Kiyoko's mother, Kiyoko/Kotatsu intimacy, the City/Forest class system, and an imminent tragedy. |
| `9-R3-O2` | 小学館公式 book page — volume 2 | https://shogakukan-comic.jp/book?jdcn=091885600000d0000000 | `2013-01-01` (e-comic page display; round-2 record showed `2013-07-18`) | Direct JDCN identity and official volume description corroborate the viewer route. |
| `9-R3-O3` | 小学館公式 e-comic viewer — volume 3 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091885980000d0000000 | `undated` (JDCN `091885980000d0000000`) | BinB route/API returned `result=1`; metadata title `よるくも 3`. Description bounds Kiyoko's diner/family burden, Kotatsu's disposable-killer role, and the murder/abduction/escape/family-claim progression. |
| `9-R3-O4` | 小学館公式 book page — volume 3 | https://shogakukan-comic.jp/book?jdcn=091885980000d0000000 | `2013-01-01` (e-comic page display; round-2 record showed `2013-07-18`) | Direct JDCN identity and official volume description corroborate the viewer route. |

The exact routes strengthen bounded observations of a stratified social system,
disposable status, violence, abduction/escape, diner care, and family claims. A
recurring survival Theme remains an adjudication question, not a terminal value:
danger, murder, or escape alone do not satisfy a survival-mechanism definition.

Rejection: intimacy and “愛” wording do not automatically establish active romance;
tragedy does not automatically add comedy or emotional warmth; a class system may
already support the accepted world-building observation but does not auto-fill
other Narrative cells. Existing Genre leads are not changed by this packet.

Route boundary: exact official volume-2/3 viewers and direct JDCN book pages were
checked. Paid/full readers and later volumes were not used. Theme and residual
Narrative/Tone cells remain `unknown` pending adjudication; no blocker is
established.

### Position 10 — 高校球児 ザワさん

| id | sourceName | URL | publishedAt | route / bounded claim |
| --- | --- | --- | --- | --- |
| `10-R3-O1` | 小学館公式 e-comic viewer — volume 2 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091826690000d0000000 | `undated` (JDCN `091826690000d0000000`) | Exact BinB viewer route reached; direct JDCN metadata is bound to volume 2. |
| `10-R3-O2` | 小学館公式 book page — volume 2 | https://shogakukan-comic.jp/book?jdcn=091826690000d0000000 | `2013-01-01` (e-comic page display) | Official description covers Sawa's smell/voice/smile, class and club interaction, Christmas, and a repeated “dokidoki” promotional framing. |
| `10-R3-O3` | 小学館公式 e-comic viewer — volume 3 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091828640000d0000000 | `undated` (JDCN `091828640000d0000000`) | Exact BinB viewer route reached; direct JDCN metadata is bound to volume 3. |
| `10-R3-O4` | 小学館公式 book page — volume 3 | https://shogakukan-comic.jp/book?jdcn=091828640000d0000000 | `2013-01-01` (e-comic page display) | Official description states that Sawa cannot play official games because she is female, nevertheless trains seriously, and contrasts the training context with absent-minded everyday expressions. |

The bounded descriptions support recurring baseball-club/daily-life contrast and a
gender-based restriction on official play. They may be reviewed for character,
comedy, or emotional observations only if the dictionary's recurrence threshold is
met. “Dokidoki” promotional wording is not by itself romance; training is not by
itself progression; school-club setting is not load-bearing world-building.

Rejection: the exact viewer route was reached, but no page-level textual payload was
deterministically extracted in this packet. The official descriptions therefore
remain the admissible claims, and no value was promoted from route reachability or
from a promotional adjective.

Route boundary: exact official volume-2/3 viewers and direct JDCN book pages were
checked. Paid/full reader and later volumes were not used. Residual Narrative/Tone
cells remain `unknown` pending adjudication; no blocker is established.

## Residual terminal state

The following are the residual cells from the untouched terminal CSV. This packet
does not write any of them:

| pos | residual terminal cells |
| ---: | --- |
| 1 | `progression`, `problemSolving`, `mysteryReveal`, `characterArcWeight`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth` |
| 2 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `comedy`, `romance` |
| 5 | Theme; `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth` |
| 6 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `relationshipStructure`, `darkness`, `emotionalWarmth` (`comedy` remains only a prior provisional proposal) |
| 7 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `characterArcWeight`, `comedy`, `mentalStress`, `romance`, `emotionalWarmth` |
| 8 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `relationshipStructure`, `comedy`, `mentalStress`, `romance` |
| 9 | Theme; `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `comedy`, `romance`, `emotionalWarmth` (Genre/Theme leads remain unmaterialized) |
| 10 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `comedy`, `mentalStress`, `romance`, `emotionalWarmth` (`comedy` remains only a prior provisional proposal) |

All route observations above are candidates for the next independent adjudication
request. Until then, every listed cell is still `unknown`; no proposal, lead, or
route status is a promotion decision.

## Route exhaustion and re-open conditions

| pos | bounded routes checked this round | remaining boundary / re-open condition |
| ---: | --- | --- |
| 1 | Kodansha official volume-2/3 product pages and their exact trials | Re-open for a new page-level, edition-bound observation or a new official route; paid/full and later-volume material remains outside this entry-range pass. |
| 2 | Shogakukan official JDCN volume-2/3 viewers, metadata API, and body-image request route | Re-open for a deterministic page/text packet or a new official publisher description; no later volume or Art inference. |
| 5 | BookLive licensed alternate-edition volume-1/2/3 product routes and explicit overlap mapping | Re-open only with a deterministic internal sample or publisher source; consumption remains distinct from cooking. |
| 6 | Shogakukan Tameshiyo volume-2/3 pages, metadata, hashes, and official publisher records | Re-open for page-level text or directly recurring dictionary mechanism; no local image retention, no Art. |
| 7 | KADOKAWA volume-2 paper/electronic records, exact BookWalker volume-2/3 shells, licensed volume-3 record | Re-open when viewer payload is deterministic or a rightsholder volume-3 record binds to the same route; shell reachability alone is insufficient. |
| 8 | Kodansha official volume-2/3 product pages and exact trials | Re-open for bounded page/text mechanism or new official route; premise phrases remain insufficient alone. |
| 9 | Shogakukan official JDCN volume-2/3 viewers, metadata API, and direct book pages | Re-open for a bounded recurring Theme/Narrative/Tone mechanism; danger/escape alone is not survival. |
| 10 | Shogakukan official JDCN volume-2/3 viewers and direct book pages | Re-open for deterministic page/text observations; “dokidoki” is not a romance value without a recurring active subplot. |

No position in this packet is `SOURCE_INFORMATION_UNAVAILABLE`. The routes are
either newly reachable or have a publisher description that can still be evaluated
by the independent adjudicator. This round therefore does not authorize a blocker,
promotion, registry update, or commit.

## Non-mutation attestation

- `adjudication/text-final-chunk-01.csv` was not edited.
- `adjudication/themes-final-chunk-01.csv` was not edited.
- `adjudication/genres-final-chunk-01.csv` was not edited.
- Pass A, research source chunks, source registry, overlay, status, promotion, and
  catalog files were not edited.
- No Art value, Art source, preview pixel judgment, or motion judgment was created.
- No `known`/`unknown` terminal cell was changed by this packet.
