# Batch 005 recommendation context seed — positions 26 and 30

- 기준일 및 조회일: `2026-08-25` (Asia/Tokyo)
- 대상: Batch 005 frozen positions `26` and `30`
- 범위: recommendation context 후보 필드만 조사; source CSV, generated artifact, final-overlay, promotion registry는 변경하지 않음
- `reviewedByHuman`: `false`
- canonical title: 동결된 제목을 그대로 사용했으며 `『`와 `』`를 추가하지 않음

## 판정 원칙

1. `catalogRole`은 인기도 점수가 아니라 추천 다양성 역할이다. `anchor`는 대비되는 취향 축을 선명하게 판독하는 작품, `bridge`는 서로 다른 취향 군을 연결하는 작품으로 판정했다.
2. `volumeCount`는 2026-08-25까지 확인한 일본어 일반 단행본 본편 권수다. 특장판, 팬북, 문고판, 세트, 컬러판과 별도 파생 상품은 더하지 않았다.
3. `reviewAverage`와 `reviewCount`는 대표 ISBN에 직접 연결된 Rakuten Books 상품 페이지의 사용자 평가와 건수만 기록했다. 판매량, 수상, 다른 권의 평가, 리뷰 문장의 요약으로 대체하지 않았다.
4. `seriesGroupId`는 직접적인 같은 프랜차이즈·속편 관계가 확인될 때만 부여한다. 추천 엔진의 유효 시리즈 key는 `seriesGroupId ?? workId`다. `ジョジョリオン`은 집영사 공식 서지에서 `ジョジョの奇妙な冒険 第8部`로 식별되므로 새 행에 기존 Gold Work ID인 `jojo-bizarre-adventure`를 지정한다. 기존 Gold 행은 공란이어도 fallback key가 이미 `jojo-bizarre-adventure`이므로 수정하지 않는다.

## 결과

| Position | Work                     | Role   | seriesGroupId            | volumeCount | reviewAverage | reviewCount |
| -------: | ------------------------ | ------ | ------------------------ | ----------: | ------------: | ----------: |
|       26 | クジラの子らは砂上に歌う | bridge | _(blank)_                |          23 |          4.17 |          23 |
|       30 | ジョジョリオン           | anchor | `jojo-bizarre-adventure` |          27 |          4.38 |         217 |

## 권수 provenance

### Position 26 — クジラの子らは砂上に歌う

- [秋田書店 공식 시리즈 페이지](https://www.akitashoten.co.jp/series/3463)는 `既刊23巻`을 표시한다.
- [秋田書店 제23권 페이지](https://www.akitashoten.co.jp/comics/4253263933)는 본편 시리즈, 저자 梅田阿比, ISBN `978-4-253-26393-1`, 출시일 `2023.03.16`을 표시하고, 작품을 `ついにフィナーレ`로 설명한다.
- 따라서 표준 Bonita Comics 본편은 `volumeCount=23`으로 확정했다. 공식 팬북과 별도 전자판·특장판은 작품 권수에 더하지 않았다.

### Position 30 — ジョジョリオン

- [ウルトラジャンプ 공식 제27권 페이지](https://ultra.shueisha.co.jp/comics/comics-3938/)는 제목을 `ジョジョリオン 第27巻（完）`, 저자를 荒木飛呂彦, 출시일을 `2021年9月17日`로 표시한다.
- [集英社 공식 서지 페이지](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000016953800)는 `ジョジョの奇妙な冒険 第8部 ジョジョリオン 27`로 작품을 Part 8에 연결한다.
- 따라서 표준 ジャンプコミックス 본편은 `volumeCount=27`으로 확정했다. 컬러판·디지털 재출판은 별도 권으로 세지 않았다.

## 역할 및 그룹 판정

- `クジラの子らは砂上に歌う`: 생존·탐험 판타지와 공동체·인물 관계를 함께 연결하는 작품이므로 `bridge`로 둔다. 현재 Batch 005 안에서 직접 속편·동일 프랜차이즈 Work가 확인되지 않아 `seriesGroupId`는 공란이다.
- `ジョジョリオン`: 액션·미스터리·초현실적 사건과 높은 시각적 개성이 뚜렷한 대비 기준점이므로 `anchor`로 둔다. 공식 제목의 Part 8 표기와 기존 canonical `jojo-bizarre-adventure`의 직접 프랜차이즈 관계를 반영해 새 행에 `seriesGroupId=jojo-bizarre-adventure`를 사용한다. 기존 Gold 행은 수정하지 않아도 두 행의 유효 시리즈 key가 같아진다.

## Review market signal provenance

- [楽天ブックス ISBN 검색 — 9784253261012](https://books.rakuten.co.jp/search?g=001&sitem=9784253261012)는 대표 ISBN과 제목·저자, 사용자 평가 `4.17`, `レビュー23件`, `2013年12月発売`을 같은 검색 결과 행에 표시한다.
- [楽天ブックス ISBN 검색 — 9784088703114](https://books.rakuten.co.jp/search?g=001&sitem=9784088703114)는 대표 ISBN과 제목·저자, 사용자 평가 `4.38`, `レビュー217件`, `2011年12月発売`을 같은 검색 결과 행에 표시한다.
- 두 기존 direct product URL은 2026-08-25 현재 동일 SHA-256의 공통 `お探しのページが見つかりません` 문서를 반환한다. 따라서 변동 가능한 market snapshot은 현재 재현되는 정확한 ISBN 검색 URL에 귀속했다. 검색 결과에서 값이 재현되지 않는 시점에는 두 review 필드를 함께 공란으로 종결한다.
- 두 값 모두 `retrievedAt=2026-08-25`로 기록했다. 평점·건수는 변할 수 있는 시장 snapshot이므로 작품의 Factor Evidence나 선정 provenance로 사용하지 않는다.
- `reviewCount`가 확인된 두 대표권은 0건 예외가 아니므로 두 필드를 공란으로 만들거나 `0`으로 바꾸지 않았다.

## 적용 경계

이 파일은 조사 draft다. `recommendation-context-final.csv`로 승격할 때는 이 CSV의 6개 context 필드를 사용한다. `ジョジョリオン`의 새 행만 `seriesGroupId=jojo-bizarre-adventure`로 기록하면 기존 Gold 행의 fallback key와 일치하므로 Gold context는 변경하지 않는다.
