# Batch 005 Art preflight 독립 QA — chunk 01

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions `1–10`
- overallVerdict: `FAIL`
- work-level results: `PASS 3 / FAIL 7`
- Art values assigned: `none`

## 결속·무결성 검증

- 현재 root는 manifest와 같은 `main@a423c20add1162b7cdf71342a721ffcd7191d3c2`다. `pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`가 통과했고 candidate `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`가 독립 재산출됐다.
- manifest SHA-256 `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`, `PAYLOAD.sha256` SHA-256 `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`, frozen-work-set SHA-256 `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`가 현재 packet과 일치한다. `PAYLOAD.sha256`의 모든 항목도 `sha256sum -c`를 통과했다.
- 현재 preflight SHA-256은 `2cf619360ef059310ec432e369cb832c3f97bf48bc84984a95e197eb90ac2665`, ledger SHA-256은 `ed3ef4abce9bdf5e485007dc08baeabe0a2027a51a9f6cf29001e746f694b041`이며 ledger의 `preflightCsvSha256`과 일치한다.
- preflight는 정확히 17열·10행이고 frozen positions 1–10과 순서·`workId`가 모두 일치한다. 44개의 `pageRef=SHA-256` pair는 모두 고유하며 `/tmp/konocomics-batch005-art-chunk01`의 대응 파일에서 재계산한 값과 `44/44` 일치한다.
- 선택된 44개 캡처를 모두 원본 픽셀로 열어 검사했다. 그중 genuine readable body page는 39개이고, front matter 1개·홍보/blank/title opening 4개는 표본에서 제외해야 한다.
- 공식 출판사 상품, 상품이 직접 연결한 정식 reader, research의 초반 1–3권 ISBN/JDCN을 frozen 대표판과 대조했다. position 7만 공식 vol.1 reader와 frozen 대표 vol.9가 달라 exact frozen-edition bridge가 없고, 나머지 접근 작품의 authority/edition bridge는 기록과 일치한다.
- 어느 retained 표본에도 하나의 연속 동작에 대한 exact start·development/impact·resolved endpoint가 모두 보존돼 있지 않다. 10행 모두 `motionGateAttemptable=false`인 것은 정확하다.

## 작품별 판정

| Pos | workId | 작품 | 선언 pages / contexts | 검증 pages / contexts | 검증 state | QA | 근거 |
| --: | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | `work-060a72fe10cf6ba9cbfc` | チェーザレ 破壊の創造者 | 6 / 3 | 5 / 3 | `unknown-ready` | **FAIL** | 講談社 vol.1과 ISBN `9784063722017`, 초반 1–3권 결속은 맞다. 그러나 `reader-step-07`은 `PREMESSA` 전면 산문 front matter로 manga body page가 아니다. 나머지 5장은 bedroom/interior, street, courtyard의 3맥락 본문이므로 6쪽 gate를 통과하지 못한다. |
| 2 | `work-076beb86f844b642beef` | くーねるまるた | 6 / 4 | 6 / 2 | `sample-ready` | **FAIL** | 小学館 vol.1 JDCN과 frozen ISBN `9784091848475`, vols.1–3 결속 및 6개 본문 ref는 맞다. 픽셀은 delivery의 temple/residential approach와 apartment interior/threshold 두 장면뿐이다. ledger의 restaurant·food-preparation은 존재하지 않아 context `4`가 허위다. |
| 3 | `work-091d231d37f037fb07e8` | インベスターZ | 0 / 0 | 0 / 0 | `unknown-ready` | **PASS** | 講談社 vol.1 product ISBN `9784063872576`과 vols.1–3은 공식 결속되지만 matched product의 `trial_links`가 비어 있어 작품별 internal preview가 없다. generic route를 대체하지 않은 0/0 terminal unknown이 정확하다. |
| 4 | `work-0cf463005cc77eeded8e` | 黄泉のツガイ | 6 / 4 | 6 / 4 | `sample-ready` | **PASS** | スクウェア・エニックス vol.1 ISBN `9784757579620`과 공식 첫 화, vols.1–3 bridge가 맞다. 001–003은 제외됐고 004–009는 birth chamber, mountain/forest, village/workyard, dungeon을 포함한 genuine body pages다. |
| 5 | `work-0d1ad77728a44df56508` | ラーメン大好き小泉さん | 0 / 0 | 0 / 0 | `unknown-ready` | **PASS** | フジテレビ 페이지는 adaptation promotion이고 Animate는 frozen ISBN `9784812487983`의 bibliographic identity만 확인한다. 등록된 竹書房 publisher/product-linked preview route가 없어 Art에 쓰지 않은 0/0 terminal unknown이 정확하다. |
| 6 | `work-0dabd1d17e5fcf2992b9` | 忘却のサチコ | 6 / 4 | 6 / 1 | `unknown-ready` | **FAIL** | 小学館 vol.1 ISBN `9784091866707`과 tameshiyo, vols.1–3 결속 및 6개 본문 ref는 맞다. 선택된 05–10은 모두 하나의 wedding reception/bridal preparation 연속 장면이다. office·home·street·meal/restaurant 네 맥락 주장은 픽셀과 불일치한다. |
| 7 | `work-0ebf010ac12b9b60d80e` | 機動旅団八福神 | 6 / 3 | 6 / 2 | `unknown-ready` | **FAIL** | KADOKAWA product가 연결한 BOOK☆WALKER vol.1 ISBN `9784757720923` reader와 6개 body ref는 유효하지만 frozen 대표판은 vol.9 ISBN `9784757746954`라 exact frozen-edition bridge가 없다. 선택 표본은 ceremony/interior와 orbital strike cutaway의 2맥락이지 3맥락이 아니다. edition mismatch에 따른 static false·unknown 종결 자체는 맞다. |
| 8 | `work-0ede6921b81169dc2dda` | 不滅のあなたへ | 5 / 3 | 2 / 1 | `unknown-ready` | **FAIL** | 講談社 vol.1 ISBN `9784063958423`이 연결한 マガポケ 첫 화와 vols.1–3 bridge는 맞다. `canvas-4`는 작품 홍보 이미지, `canvas-5`는 blank/logo, `canvas-6`은 `第1話 最後のひとり` title opening이라 제외 대상이다. retained 가능 표본은 canvas 7–8의 snowy orb/wolf 한 맥락 2장뿐이다. 같은 공식 episode의 후속 body canvas가 임시 root에 존재하므로 “sixth body page unavailable”도 입증되지 않았다. |
| 9 | `work-0eff8190c0c6ff604527` | よるくも | 6 / 3 | 6 / 1 | `unknown-ready` | **FAIL** | 小学館 vol.1 JDCN과 frozen ISBN `9784091885388`, vols.1–3 결속 및 6개 body ref는 맞다. steps 10–15는 모두 같은 restaurant closing/meal conversation의 연속 장면이다. exterior establishing panel과 같은 공간의 interior를 별도 scene context로 중복 계산할 수 없다. |
| 10 | `work-12b484cd79bfe6852ea1` | 高校球児 ザワさん | 3 / 2 | 2 / 2 | `unknown-ready` | **FAIL** | 小学館 vol.1 JDCN과 frozen ISBN `9784091825377`, vols.1–3 결속은 맞다. `reader-step-04`는 `第1話 岡山` chapter opening이라 제외 대상이고, step 05–06의 stadium/broadcast와 field/dugout 두 본문만 남는다. unknown 종결은 유지된다. |

## 제외해야 할 retained pair

| Pos | pair | 사유 |
| --: | --- | --- |
| 1 | `reader-step-07=7b9c3b583cb54bf0f664be110519a59ec70dedc0b2580ea2aa4ed44935f9be88` | `PREMESSA` 산문 front matter, manga body page 아님 |
| 8 | `episode-1-canvas-4=2d9446d285688eed5bc48e6f25b3446d0d7198b2ca7c3f9d0e623896337da587` | 작품 홍보 이미지/advertorial splash |
| 8 | `episode-1-canvas-5=318aacc247b63f18f89ca2f445c961af67860369a6e3a113576042e31cd518d0` | blank page + マガジン pocket logo |
| 8 | `episode-1-canvas-6=54cfcf6985e41e630827f4755c5026206a7bd8eee5467810b2608f763ec7ed6b` | chapter/title opening |
| 10 | `reader-step-04=5798748abd29e84c89e917b56693d817483b4a457983e3cf5de58bc9e15587aa` | `第1話 岡山` chapter opening |

## 정확한 교정 지시

1. Position 1: `reader-step-07` pair를 `pageRefs`와 `temporarySampleSha256`에서 제거하고 count를 `5/3`, static을 `false`, state를 `unknown-ready`로 바꾼다. 같은 exact Kodansha reader에서 excluded category가 아닌 추가 body page를 다시 고정해 6쪽을 채우지 못하면 unknown으로 닫는다.
2. Position 2: refs와 sample-ready는 유지하되 context count를 `4→2`로 고치고 restaurant·food-preparation 문구를 temple/residential approach·apartment interior/threshold로 교체한다.
3. Position 6: refs는 유지하되 context count를 `4→1`, static을 `true→false`, state를 `sample-ready→unknown-ready`로 바꾼다. 같은 exact tameshiyo route에서 genuinely distinct later scene을 고정하지 못하면 1-context unknown으로 닫는다.
4. Position 7: 6개 refs와 edition-mismatch unknown은 유지하되 context count를 `3→2`로 고친다. limitation은 official vol.1 sample의 authority와 frozen vol.9 exact-bridge 부재, ceremony/orbit 두 맥락을 분리해 기록한다.
5. Position 8: canvas 4–6의 세 pair를 제거하고 count를 `2/1`로 고친다. “no sixth body page” 문구를 삭제하고, 같은 exact Pocket episode의 후속 lazy-loaded canvas를 끝까지 유한 탐색해 genuine body page 6장·2맥락을 충족하거나 실제 route endpoint에서 unknown으로 닫는다. 선택 ref를 바꾸면 새 SHA-256을 기록한다.
6. Position 9: refs는 유지하되 context count를 `3→1`, static을 `true→false`, state를 `sample-ready→unknown-ready`로 바꾼다. 같은 exact JDCN reader에서 두 번째 genuine scene을 고정하지 못하면 1-context unknown으로 닫는다.
7. Position 10: `reader-step-04` pair를 제거하고 count를 `2/2`로 고친다. static false·unknown-ready는 유지하고, limitation에 title-opening exclusion과 official reader endpoint를 명시한다.
8. 위 변경 후 chunk-01 CSV의 SHA-256을 ledger에 갱신하고 작품별 summary/acquisition notes의 pages·contexts·state·decisive boundary를 동일하게 맞춘다. retained pair는 전부 다시 해시한다. Art 값·confidence·promotion blocker는 추가하지 않는다.

## 종합 판정

**FAIL.** Root·packet·frozen order와 44개 선택 해시는 유효하지만, 5개 non-body ref가 retained됐고 5작품의 context count가 픽셀보다 부풀려졌다. 그 결과 positions 1, 6, 9의 static/state가 잘못 열려 있으며 position 8의 route-exhaustion 설명도 사실과 다르다. 이 QA는 Art 값을 부여하지 않았고 `reviewedByHuman=false`를 유지했다. annotation·promotion·commit은 수행하지 않았다.
