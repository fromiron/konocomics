# Batch 005 Art preflight independent QA — chunk 03 position 26 recovery

- scope: frozen Batch 005 position 26 only
- workId: `work-5b7cf2105a4bc6f6b46c`
- canonicalTitle: `クジラの子らは砂上に歌う`
- reviewer: Daybreak independent Art preflight QA
- reviewedAt: `2026-08-25`
- reviewedByHuman: `false`
- result: `PASS_AFTER_CORRECTION`
- FactorValuesAssigned: `false`
- finalArtEdited: `false`
- promotionPerformed: `false`
- temporaryImagesCommitted: `false`

## 결론

공식 제1권 상품에서 직접 연결되는 ARC 제1화는 frozen 작품과 제목·작가·권·판본이 정확히 일치한다. 원본 45쪽을 전부 다시 열어 45/45 픽셀을 독립 판독했고, 1쪽만 컬러 홍보/표지 non-body이며 2–45쪽 44쪽은 읽을 수 있는 본문이다. `arc-page-04`–`09`는 6/6 본문이고 세 개의 실질 맥락을 제공하므로 정적 Art preflight를 통과한다.

다만 기존 `motionGateAttemptable=false`는 원본 전수 판독과 충돌했다. `arc-page-15`–`17`은 잎 절단 요청과 투척 준비 → 원반 투척·비행 → 절단 impact, 낙엽, 인물의 즉시 반응 endpoint가 연속되는 정확한 bounded sequence다. recovery CSV·ledger와 review input/output/root binding을 최소 교정해 `motionGateAttemptable=true`로 만들었다. 이는 후속 Local + Gemini 픽셀 판정을 열 뿐이며 이 QA는 `motionImpact` 또는 다른 Art 값을 부여하지 않는다.

## Frozen identity와 공식 판본 bridge

| 검증 항목 | 독립 재검증 결과 |
| --- | --- |
| frozen position | `frozen-work-set.csv` position 26, `work-5b7cf2105a4bc6f6b46c` |
| canonical title | `クジラの子らは砂上に歌う` exact |
| creator | 상품 1–3권과 ARC JSON 모두 `梅田阿比` exact |
| vol. 1 | 공식 상품 `クジラの子らは砂上に歌う 第1巻`, ISBN `978-4-253-26101-2` |
| vol. 2 | 공식 상품 동일 작품/작가 제2권, ISBN `978-4-253-26102-9` |
| vol. 3 | 공식 상품 동일 작품/작가 제3권, ISBN `978-4-253-26103-6` |
| product → reader | 제1권 공식 상품 HTML이 `https://arc.akitashoten.co.jp/comics/kojiranoko/1`을 직접 링크 |
| ARC JSON | title exact, author `["梅田阿比"]`, `volume=1`, `page_count=45` |
| page ordering | `episode_pages=45`, `order_index=1..45` 연속, 누락·중복 0 |
| edition rejection | 특장판·세트·후속 판본 사용 없음; frozen 표준 제1권 ISBN 유지 |
| route registry | 등록된 Akita 기본 route는 Champion Cross지만, 본 recovery는 exact 상품이 직접 연결한 동일 출판사 ARC route이므로 운영 정책의 공식 product-linked route를 충족 |

## Canonical uncompressed binding 재계산

재검증 root는 `/tmp/konocomics-batch005-pos26-recovery`의 압축되지 않은 canonical directory다. ZIP이나 contact sheet만으로 판정하지 않았다.

사전 문맥으로 publisher route registry SHA `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28`, 기존 chunk-03 preflight SHA `8379215c7c1ddcde7c4d3bfe2848b974a2200f5a95b5c7758e6778b9436f38f0`, 기존 chunk-03 final-Art SHA `be73736121f53fd0286ee8cf334776f507f00bb8a40c3c007f8a1b6baec35f8d`, blocker-challenge SHA `8ca6480e82556554bf41a478b12bbaa77b1b6fb30a3a944fdad13330965d6b3c`도 읽고 고정했다. 기존 final-Art의 position 26 unknown 행은 이번 preflight QA에서 수정하지 않았다.

| Binding | SHA-256 | 결과 |
| --- | --- | --- |
| Batch manifest | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | match |
| `PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | match |
| frozen work set | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | match |
| vol. 1 product HTML | `d59e16689410d166df9f1578a5ed1c15295b32f2df684b92ce90951521665fb3` | match |
| vol. 2 product HTML | `40ab6ad11c7fd23d4ad2d09412be587b364b3c22981c080a7171c3fc1d502c8c` | match |
| vol. 3 product HTML | `7bd3a72f99ad7e8019bf2fcc9cf0129c3b9ba634c4dc593d02f33e2c012a20b7` | match |
| ARC reader HTML | `8d5cdd3c4b1b306683c97cf65487a02b0aeb7a275c7622521f76db0cd01dc98f` | match |
| ARC episode JSON | `8569535d979bc9f4a5368c46e692ff1133dba0ace2b3d27a180934925989dcf2` | match |
| page/JSON hash ledger | `ce6a037aad93b86a5fb76f88a2db0011eec032412e29deca56d8ecccaab552b6` | 46/46 entries `sha256sum -c` OK (JSON 1 + pages 45) |
| product route screenshot | `6a3cc0c4b4bd3a85f5d686fa218cbfcab737d9d8e71e1a0ff290b08c788339d8` | match; route proof only |
| reader route screenshot | `6abb79ef1a9cae6978fde579608f70a1e6a6bff8dd1b71ac6134fbe065bfe557` | match; route proof only |
| contact sheet | `3d926380adebb4259184108bdc4d0b01e21f53e585009c90a46df0a91d2ef361` | match; navigation aid only |

## 45/45 original-pixel 판독

| 지표 | 결과 |
| --- | ---: |
| 원본을 직접 연 페이지 | 45/45 |
| 유효 JPEG와 동일 해상도 | 45/45 |
| 원본 해상도 | 각 `1450 × 2057` |
| 쪽당 픽셀 | `2,982,650` |
| 판독한 전체 픽셀 | `134,219,250` |
| body | 44/45, `131,236,600` pixels |
| non-body | 1/45, `2,982,650` pixels |
| static retained sample | 6쪽, `17,895,900` pixels |
| motion retained sample | 3쪽, `8,947,950` pixels |
| 전체 retained sample | 9쪽, `26,843,850` pixels |

`arc-page-01`은 작품명·작가·신연재 홍보와 별도 단행본 광고를 포함하는 컬러 promotional/title page라서 non-body로 거절했다. `arc-page-02`–`45`는 모두 패널·대사·서사 진행을 가진 본문이다. 장식·목차·광고·frontmatter를 본문으로 승격한 항목은 0이다.

## Static sample 확인

| page refs | 본문 판독 | 맥락 |
| --- | --- | --- |
| `arc-page-04`, `05` | 2/2 readable BODY | 부유 정착지/선박 건축과 사막 풍경 |
| `arc-page-06`, `07`, `08` | 3/3 readable BODY | 장례·매장·집단 애도와 인물 반응 |
| `arc-page-09` | 1/1 readable BODY | 정착지 일상과 인물 상호작용 |

합계는 6/6 readable BODY, 실질 맥락 3개다. 요구치 `>=6 pages`, `>=2 contexts`를 모두 충족한다.

## Motion correction

| phase | exact ref | 관찰 |
| --- | --- | --- |
| start / preparation | `arc-page-15` | 잎을 몇 장 잘라 달라는 요청, 도구를 든 인물의 준비 |
| development | `arc-page-16` | 원반 release와 공중 비행, 잎 사이의 경로가 연속 패널로 보존 |
| impact / resolved endpoint | `arc-page-17` | 잎이 절단돼 떨어지고, 요청 인물의 외침과 상대의 정지 반응으로 동작 종료 |

세 원본 hash는 각각 `908d4cfecfe0de5596c970a8626a6fa1a10816369922c61cbe0a9321ad6e0d6d`, `07b965fd34519558fdd755b2df065ff2dc4154bdf66e7472b74dc8d686aae3ad`, `4b7adc8d48d893be7855a67d291405a14e929e9e69024cf2defd1f8b68358053`이다. 전후 맥락을 생략한 단일 효과 컷이나 불완전한 순간이 아니므로 `motionGateAttemptable=true`가 맞다. 수치 판정은 후속 model panel의 책임이다.

## 교정 후 repository bindings

| Artifact | SHA-256 |
| --- | --- |
| recovery preflight CSV | `f517ac72fd97468fbca6bd75225ce66584f4b1ba1cb13281a4dbd8d8b3a750dd` |
| recovery ledger | `de737e1fa421cfdefed8371b3040792450a94ea4d5db1b45122865e6ddbc4d07` |
| review input ledger | `51126fe90206b6c50f9745db7da11418127e31e8c192cdcddee14231a133ea72` |
| review output ledger | `cc827070d3cfedf4cdc98b052e4f7b32519380a5842f061caaf6d108d6db924e` |
| review request | `bf5d75e68d7002c6d155365205acc097054753e66b8b2e0c66ef9d0e60780728` |
| corrected root identity | `5c67a0e8a483af252a02ed5bc8fc3779ceda5726b1250db12b6495d03c0f350f` |

`pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`는 `50 works`와 candidate SHA `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`로 통과했다. 이 QA는 recovery preflight/ledger와 그 review binding만 교정했다. source, generated catalog, promotion registry, eligibility, 기존 `final-art.csv`, Factor Dictionary, 추천 산식, Gold 데이터는 변경하지 않았다.
