# Batch 005 recommendation context seed — positions 4 and 45

- 기준일 및 조회일: `2026-08-25` (Asia/Tokyo)
- 대상: Batch 005 frozen positions `4` and `45`
- 범위: recommendation context 후보 필드만 조사; source CSV, generated artifact, final-overlay, promotion registry는 변경하지 않음
- `reviewedByHuman`: `false`
- canonical title: 동결된 제목을 사용했으며 `『`와 `』`를 추가하지 않음

## 판정 원칙

1. `catalogRole`은 인기도 점수가 아니라 추천 다양성 역할이다. `anchor`는 독립적인 취향 축을 선명하게 보여 주는 작품, `bridge`는 서로 다른 취향 군을 연결하는 작품으로 판정했다.
2. `volumeCount`는 2026-08-25까지 확인한 일본어 일반 단행본 본편 권수다. 특장판, 팬북, 문고판, 세트, 컬러판과 별도 파생 상품은 더하지 않았다.
3. `reviewAverage`와 `reviewCount`는 동결된 대표 ISBN의 Rakuten Books 정확 ISBN 검색 결과가 재현하는 사용자 평가와 건수만 기록했다. 판매량, 수상, 다른 권의 평가, 리뷰 문장의 요약으로 대체하지 않았다.
4. 두 작품 모두 독립적인 속편·동일 프랜차이즈 Work가 Batch 005 및 기존 canonical context에서 확인되지 않아 `seriesGroupId`는 공란이다. 작가의 다른 작품이나 장르적 유사성만으로 시리즈 그룹을 만들지 않았다.

## 결과

| Position | Work | Role | seriesGroupId | volumeCount | reviewAverage | reviewCount |
| -------: | ---- | ---- | ------------- | ----------: | ------------: | -----------: |
| 4 | 黄泉のツガイ | anchor | _(blank)_ | 13 | 4.55 | 60 |
| 45 | スピリットサークル | bridge | _(blank)_ | 6 | 4.35 | 23 |

## 권수 provenance

### Position 4 — 黄泉のツガイ

- [SQUARE ENIX 공식 제13권 페이지](https://magazine.jp.square-enix.com/top/comics/detail/9784301006343/)는 `黄泉のツガイ 13`, 저자 荒川弘, ISBN `9784301006343`, 출시일 `2026年7月10日`을 표시한다.
- 같은 공식 페이지의 작품 목록은 일반판 제1권부터 제13권까지를 순서대로 표시하고, 제6권 특장판은 일반판 제6권과 별도 항목으로 분리한다.
- 따라서 일반판 본편은 2026-08-25 현재 `volumeCount=13`으로 확정했다. 제6권 특장판, 1–13권 세트, 디지털 재출판은 권수에 더하지 않았다.

### Position 45 — スピリットサークル

- [少年画報社 공식 시리즈 검색](https://www.shonengahosha.co.jp/book_Search.php?bookTag=%E3%82%B9%E3%83%94%E3%83%AA%E3%83%83%E3%83%88%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB)은 표준 `第1巻`부터 `第6巻`까지를 표시한다.
- [少年画報社 공식 제6권 페이지](https://www.shonengahosha.co.jp/book_Info.php?id=5310)는 ISBN `9784785957933`, 출시일 `2016-06-10`과 함께 `輪廻転生スペクタクル感動の完結`라고 표시한다.
- 따라서 표준 본편은 `volumeCount=6`으로 확정했다. 전자판·재출판·세트 상품은 별도 권으로 세지 않았다.

## 역할 및 그룹 판정

- `黄泉のツガイ`: `action;fantasy` 장르와 `combat` 중심 Theme, 세계관·미스터리·전투 축이 entry range에서 뚜렷하게 분리된다. 이 조합은 추천 엔진에서 선명한 대비 기준점이 되므로 `anchor`로 둔다. 작품 자체의 후속 canonical Work가 확인되지 않아 `seriesGroupId`는 공란이다.
- `スピリットサークル`: 환생·학교·미스터리와 두 주인공의 관계, 감정적 결과가 함께 작동한다. 고전적 판타지/미스터리 축과 관계·감정 중심 독자군 사이를 연결하는 역할이므로 `bridge`로 둔다. 작가의 다른 작품과 직접적인 속편 관계는 확인되지 않아 `seriesGroupId`는 공란이다.

## Review market signal provenance

- [楽天ブックス ISBN検索 黄泉のツガイ（1）](https://books.rakuten.co.jp/search?g=001&sitem=9784757579620)은 대표 ISBN `9784757579620`, 제목·저자·출판사와 함께 사용자 평가 `4.55`, `レビュー60件`을 표시한다. 상품 출시일은 `2022年06月10日`이다.
- [楽天ブックス ISBN検索 スピリットサークル（01）](https://books.rakuten.co.jp/search?g=001&sitem=9784785939830)은 대표 ISBN `9784785939830`, 제목·저자·출판사와 함께 사용자 평가 `4.35`, `レビュー23件`을 표시한다. 상품 출시월은 `2012年12月`이다.
- 두 값은 작품 Factor Evidence나 선정 provenance가 아닌 대표권의 변동 가능한 market snapshot이다. 종전 직접 상품 URL 두 개는 조회 시점에 동일한 공통 not-found 문서를 반환하므로 Evidence에서 제외했다.
- 두 대표권 모두 review count가 0이 아니므로 `reviewAverage`와 `reviewCount`를 공란 또는 0으로 종결하지 않았다. 미래 빌드에서 같은 정확 ISBN 검색 결과가 해당 값을 재현하지 못하면 두 필드를 함께 공란으로 되돌려야 한다.

## 적용 경계

이 파일은 조사 draft다. `recommendation-context-final.csv`로 승격할 때는 이 CSV의 context 필드를 사용한다. `seriesGroupId`는 두 작품 모두 공란으로 유지하며, 기존 Gold row나 다른 source/generated row는 변경하지 않는다.
