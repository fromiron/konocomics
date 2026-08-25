# Batch 004 Art recovery 독립 preflight QA — chunk 01 position 3

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent preflight QA
- reviewedByHuman: `false`
- workId: `work-0f3a44f5dcab9623d1be`
- canonicalTitle: `応天の門`
- verdict: `PASS_AFTER_CORRECTION`
- Art values assigned: `none`
- motionGateAttemptable: `false`

## 독립 검산 결과

`art-source-route-registry.csv`의 新潮社 기본 경로는 exact 상품 페이지에서
작품별 trial을 찾지 못하면 Art를 unknown으로 닫는다. 이번 recovery는 그 행을
완화하지 않는다. 新潮社의 공식 보도자료가 직접 연결한 publisher-operated
Comic Bunch Kai 제1화 경로를 별도 보충 경로로 사용했다.

- frozen position 3은 `応天の門`, `灰原薬`, workId
  `work-0f3a44f5dcab9623d1be`로 일치한다.
- 新潮社 공식 상품은 표준판 1권 `9784107717429` (`2014-04-09`), 2권
  `9784107717771` (`2014-10-09`), 3권 `9784107718105` (`2015-04-09`)이며
  모두 `応天の門`·`灰原薬`·`BUNCH COMICS`를 표시한다.
- Comic Bunch Kai payload는 `series_id=13933686331620138638`,
  `content_id=outennomon_001`, `series_title=応天の門`, `can_read=true`,
  `isPublic=true`를 표시하며 vol.1–3 상품으로 연결된다. 42개의 `type=main`
  ref는 page id `316112896951684662`–`316112896951684703`이다.
- 新潮社의 `2023-11-09` 보도자료는 정확한 위 제1화 URL을 연결한다.
- 보조 bridge인 BOOK☆WALKER exact vol.1은 제목·권차·작가·新潮社 및
  `p-outen_01_000`–`p-outen_01_048` trial 식별자를 표시한다. 이 retailer
  픽셀은 Art 표본에 사용하지 않았다.

## 픽셀 재검과 교정

기존 recovery가 보존한 공식 CDN 원본 7개를 모두 원본 해상도
`985x1400`으로 열었다. 같은 URL을 다시 받아 비교한 결과 **7/7 byte match**다.
그러나 `kurage-page-663`은 화면에 `第一話`를 명시한 장면형 chapter opening이므로
BODY에서 제외해야 한다. 해당 파일은 review 입력 디렉터리에서
`/tmp/konocomics-batch004-art01-recovery-pos03-excluded/page-663.jpg`로 분리했고,
CSV·ledger·input manifest에서 retained ref를 제거했다.

| ref | 분류 | 맥락 | SHA-256 |
| --- | --- | --- | --- |
| `kurage-page-663` | **excluded** | `第一話` chapter opening | `f204f5239e1add475af9ac10b1617f39ff65257fc2986e5849c6a7c4b12ac768` |
| `kurage-page-666` | BODY | 야외 이동·긴장 | `641c81e47c48f60f0436bc25f77e03721f15c594df11dbd4ca4c760731e6eeab` |
| `kurage-page-674` | BODY | 문턱·인물 대면 | `d9384fe969953f9f76bc31f3b28dea48066937db68a0874417d0c97e4076a189` |
| `kurage-page-682` | BODY | 평안경 건축·경로 설명 | `13d4a9e45e079a502bc4748bf5035bc9ded984a5f53b32a2ba9ab57db7eb8974` |
| `kurage-page-690` | BODY | 복수 인물 문답 | `479a89dbe21d157b7c87b35dbfca17501e12f7432d5d2b33acd79f09556e3b7d` |
| `kurage-page-698` | BODY | 관복 인물 대화 | `1ae0f8b5745d9efff18df749280f4c90a79a36498a79c2dadb2a014e764b3e4d` |
| `kurage-page-703` | BODY | 근접 인물 문답 | `6ddb6b65c143e69ccd1b5f579b6572c943181248a50444e3a838e8ad57d8ae13` |

교정 후 판독 가능한 BODY는 **6쪽**, 실제 장면 맥락은 **4개**다. 보수적으로
마지막 세 쪽을 하나의 문답 맥락으로 묶어도 야외 이동, 문턱 대면, 도시 건축
설명과 구별되므로 2맥락 최소 gate를 충분히 넘는다. 표지·홍보·frontmatter·광고는
retained set에 없다. 따라서 `staticGateAttemptable=true`,
`stateEligibility=sample-ready`가 유지된다.

선택 refs는 서로 떨어진 정적 excerpt이고 단일 동작의
start→development→impact→resolved endpoint를 연속 참조로 보존하지 않는다.
따라서 `motionGateAttemptable=false`가 정확하다.

## 검산 해시

### live payload

| artifact | SHA-256 |
| --- | --- |
| Comic Bunch Kai episode HTML | `d17c3f39614064fcf5e79254d3e810331c46e73151ae041d59615ce61045e11e` |
| Shinchosha vol.1 HTML | `aa9235ae0ba8b9cbcf8882a0219ddcdcf7e391301fdf9f6ca2f35c5c8b3087bd` |
| Shinchosha vol.2 HTML | `63e4dbd27e5e5d670faa71722043ce3bd2ac178e97b6f9637fe592654393873d` |
| Shinchosha vol.3 HTML | `1f85d4b8013e6535e0f86c20482ab2e7b2e64756ba48aedf5d70fd7f848e89fa` |
| Shinchosha PR Times HTML | `6dcd3509b3dcf29356c203dcf78b06a886fca4bb47b0ed0e0bc1e4b7b7e3d706` |
| BOOK☆WALKER vol.1 HTML | `5cd3cc9655bcd146d2e95a42f83c3f7f60f32841ddec3a438847a7f08a41fa06` |

### bound repository artifacts

| artifact | SHA-256 |
| --- | --- |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `art-source-route-registry.csv` | `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28` |
| `art-route-recovery-pos03-round-1.md` | `6874e1f0ef8e31b2813f1dbc8f3e6bf805ba17a63a8a7a965e74e8f476b524a0` |
| `recovery-pos03-preflight.csv` | `01e7a7c7c80e6d9dc552e190caff3846352d0bef010bc6846233d31fb2f33da8` |
| `recovery-pos03-ledger.md` | `e50216651b98700395a61224ea8318e0c19f0c38192df95d4e56c234a047c54d` |
| `recovery-pos03-input-manifest.md` | `7b1761bf1f9502070ca6bcc4ec14114943e73e6aac389af3c0b7b8f1f9d356cc` |

CSV는 헤더 포함 17열, 데이터 1행, retained refs 6개, retained hashes 6개로
재파싱했다. `final-art.csv`, source/generated/promotion 파일은 수정하지 않았다.
기존 terminal Art 행은 별도 Local + exact Gemini review와 adjudication이
완료될 때까지 계속 권위를 가지며, 이 QA 자체는 어떤 Art 값도 배정하지 않는다.
