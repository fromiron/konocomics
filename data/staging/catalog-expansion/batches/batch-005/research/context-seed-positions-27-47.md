# Batch 005 recommendation context seed — positions 27 and 47

- 기준일 및 조회일: `2026-08-25` (Asia/Tokyo)
- 대상: Batch 005 frozen positions `27` and `47`
- 범위: recommendation context 후보 필드만 조사; source CSV, generated artifact, final-overlay, promotion registry는 변경하지 않음
- `reviewedByHuman`: `false`
- canonical title: frozen title copied without Japanese book-title brackets

## 판정 원칙

1. `catalogRole`은 인기도 점수가 아니라 추천 다양성 역할이다. `anchor`는 대비되는 취향 축을 선명하게 판독하는 작품, `bridge`는 서로 다른 취향 군을 연결하는 작품으로 판정했다.
2. `volumeCount`는 2026-08-25까지 확인한 일본어 일반 단행본 본편 권수다. 특장판, 팬북, 문고판, 세트, 컬러판과 별도 파생 상품은 더하지 않았다.
3. `reviewAverage`와 `reviewCount`는 동결된 대표 ISBN의 Rakuten Books 정확 ISBN 검색 결과가 재현하는 사용자 평가와 건수만 기록했다. 판매량, 수상, 다른 권의 평가, 리뷰 문장의 요약으로 대체하지 않았다.
4. `seriesGroupId`는 현재 frozen set 또는 existing canonical context 안에서 직접적인 같은 프랜차이즈·속편 관계가 확인될 때만 부여한다. 두 대상에는 그런 동시 참여 Work가 없어 공란으로 유지한다.

## 결과

| Position | Work | Role | seriesGroupId | volumeCount | reviewAverage | reviewCount |
| -------: | ---- | ---- | ------------- | ----------: | ------------: | -----------: |
| 27 | 女王の花 | bridge | _(blank)_ | 15 | 4.25 | 65 |
| 47 | デッドデッドデーモンズデデデデデストラクション | anchor | _(blank)_ | 12 | 4.16 | 52 |

## 권수 provenance

### Position 27 — 女王の花

- [小学館 書籍 女王の花 15](https://www.shogakukan.co.jp/books/09139124)는 표준 フラワーコミックス 제15권, ISBN `9784091391247`, 출시일 `2017-03-24`, 완결권임을 표시한다.
- [小学館eコミック스토어 제15권 페이지](https://e-comi.shogakukan.co.jp/books/091391240000d0000000)는 제15권을 `完結`, 시리즈를 `全15巻完結`으로 표시한다. 페이지의 전자판 판매일 `2017-04-07`은 별도 전자판 provenance로만 보며 표준 권수에 더하지 않았다.
- [小学館 공식 제1권 페이지](https://shogakukan-comic.jp/book?isbn=9784091320094)는 동결 대표 ISBN `9784091320094`와 작품명·저자 和泉かねよし를 확인한다.
- [小学館 書籍 女王の花 1](https://www.shogakukan.co.jp/books/09132009)은 frozen 대표 ISBN `9784091320094`를 직접 재현한다.
- 따라서 표준 본편은 `volumeCount=15`, 상태는 `complete`로 확정했다. 青徹外伝은 현재 frozen set에 별도 Work로 참여하지 않는 외전이며, 전자판·제15권 스페셜 팬북付き限定版·세트 상품은 본편 권수에 포함하지 않았다.

### Position 47 — デッドデッドデーモンズデデデデデストラクション

- [小学館 공식 제12권 페이지](https://shogakukan-comic.jp/book?isbn=9784098612932)는 `デッドデッドデーモンズデデデデデストラクション 12`, ISBN `9784098612932`, 출시일 `2022/03/30`을 표시하고 `堂々完結`, `極限の完結巻`으로 명시한다.
- [小学館 공식 제1권 페이지](https://shogakukan-comic.jp/book?isbn=9784091865007)는 동결 대표 ISBN `9784091865007`, 작품명·저자 浅野いにお, 출시일 `2014/09/30`을 확인한다.
- 공식 [小学館コミック 목록](https://shogakukan-comic.jp/booklist?genre_list=990001&mag_daihyo_cd=24659&order=desc&pageno=3&sort=title)은 표준 제1권부터 제12권과 한정판·DX COMPLETE BOX를 별도 항목으로 구분한다.
- 따라서 표준 본편은 `volumeCount=12`, 상태는 `complete`로 확정했다. 한정판, DX COMPLETE BOX, 전자판·재출판은 표준 본편 권수에 포함하지 않았다.

## 역할 및 그룹 판정

- `女王の花`: 중심 로맨스와 왕국·인질·궁정의 정치 축이 함께 작동해 관계 중심 독자와 역사·정치 드라마 독자 사이를 연결하는 `bridge`로 둔다. 동일 시리즈의 외전은 현재 frozen set에 동시 참여하지 않으므로 `seriesGroupId`는 공란이다.
- `デッドデッドデーモンズデデデデデストラクション`: 외계 모함·침략이라는 SF 위협과 여고생의 학교·일상 청춘을 병치하는 독특한 축이 선명해 `anchor`로 둔다. 현재 frozen set 및 existing canonical context에 직접 속편 Work가 없어 `seriesGroupId`는 공란이다.

## Review market signal provenance

- [楽天ブックス ISBN 검색 — 9784091320094](https://books.rakuten.co.jp/search?g=001&sitem=9784091320094)는 `女王の花（1）`, ISBN `9784091320094`, `2008年08月26日発売`과 사용자 평가 `4.25`, `レビュー65件`을 같은 정확 ISBN 검색 결과 행에 표시한다.
- [楽天ブックス ISBN 검색 — 9784091865007](https://books.rakuten.co.jp/search?g=001&sitem=9784091865007)는 `デッドデッドデーモンズデデデデデストラクション（1）`, ISBN `9784091865007`, `2014年09月30日発売`과 사용자 평가 `4.16`, `レビュー52件`을 같은 정확 ISBN 검색 결과 행에 표시한다.
- 두 값은 대표권의 변동 가능한 market snapshot이며 작품 Factor Evidence나 선정 provenance로 사용하지 않는다. 검색 결과에서 같은 정확 ISBN의 평점 또는 건수가 재현되지 않는 시점에는 두 review 필드를 함께 공란으로 되돌린다.
- 두 대표권 모두 review count가 0이 아니므로 `reviewAverage`와 `reviewCount`를 공란 또는 `0`으로 종결하지 않았다.

## 적용 경계

이 파일은 조사 draft다. `recommendation-context-final.csv`로 승격할 때는 이 CSV의 6개 context 필드를 사용한다. 기존 Gold row, source CSV, generated artifact, promotion registry와 terminal data는 변경하지 않는다.
