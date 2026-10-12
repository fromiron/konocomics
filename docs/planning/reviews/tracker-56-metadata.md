# #56 메타데이터·소개·시리즈 관계 개선

2026-10-09 JST. 대상 #62, #63, #80 및 #59의 누락 작품 2건. 실행 체크아웃 `/home/bell/Toys/konocomics`, 수정 후 Catalog `v1-bf43e2765bf2`. 배포 검증과 로컬 증거를 구분한다.

## #62: 작품/판본/시리즈 의미

| 작품 / canonical ID | 확인한 판본과 오류 | 반영 |
| --- | --- | --- |
| 狼と香辛料 / `work-1ffb6ba18b9d7c2daeda` | 小梅けいと 작화·支倉凍砂 원작 코믹스. 대표 ISBN `9784048666961`은 1권. [KADOKAWA 원판 16권](https://www.kadokawa.co.jp/product/321709000776/) ISBN `9784048935968`은 완결을 명시하며 같은 시리즈의 해당 1권도 결속한다. 소설 및 애장판과 구분. | 총권수 1→16, 상태 unknown→completed. 대표 ISBN/표지·구매 권 번호1 보존. |
| こころの一番暗い部屋 / `work-31b4dc55b32d1b29be08` | [대표 2권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884737-5) ISBN `9784088847375`는 기존 표지·소개 대상. [원판 최종 3권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884881-5) 출판사에 완결 명시. | 총권수1→3, unknown→completed. 대표 2권과 그 소개 그대로 보존. |
| 違国日記 / `work-0153a125c5a56225b06c` | ISBN `9784396767174`, source SQLite와 생성 JSON 모두 `ヤマシタ トモコ` 존재. [출판사 특설](https://www.shodensha.co.jp/ikokunikki/)과 작가 일치. 상세는 creators를 바로 표시. | 누락 데이터 정정 없음. 현재 원본→변환→렌더 경로에 작가가 있으며 과거 리뷰의 배포/프로필 조건은 불명. |

- 상세에 `シリーズの巻数`와 간행 상태를 항상 표시한다. 미확인 값은 `巻数未確認`/`刊行状況不明`이다. 표지·소개·구매 링크의 대상 권도 별도 명시하고 가격은 `掲載版の価格`로 표시한다.
- 카드/서재는 기존 공통 Work.status 및 recommendation context.volumeCount를 소비하므로 같은 정정값을 받는다. 현재 발매 권수와 완결 총권수를 임의 교환하거나 수집 판본 수로 대체하지 않는다.
- 다른 historical 1권 레코드를 일괄 수정하지 않았다. 추천 factor/theme, 기존 ISBN/work ID/독서 기록은 변경하지 않았다.

## #63: 실제 공급자 응답과 소개 fallback

- 名探偵コナン `work-39555fe7402dada0d79f`, ISBN `9784091233714`: [小学館 판본 페이지](https://www.shogakukan.co.jp/books/09123371)의 동일 ISBN JSON에 category2는 실제 소개, category3는 회차목록이다. 수입기는 기존 ISBN·publisher category 결속을 유지하면서 category2도 수용하도록 수정했다. category2 원문을 출판사 metadata로 저장하고 publisher-first 계약으로 표시한다. 줄거리 생성 없음.
- 실제 로컬 Rakuten `/api/rakuten/item?isbn=9784091233714`는 첫 호출502 후 재시도200에서 `▼第1話…▼第9話…`만 반환했다. 이를 목차만 있는 소개로 식별하며, 실제 publisher 소개가 있으면 정상 fallback한다.
- 屍鬼 `work-c221a17d6b962b17c9f4`, ISBN `9784088745497`: 같은 로컬 API HTTP200에 title/author/image/item URL은 있으나 `itemCaption`이 없다. canonical publisher metadata도 없다. 이때 소개 없음 상태를 표시하고 서지·링크·독서 기록은 유지한다. 확인되지 않은 줄거리를 수집했다고 표시하지 않는다.
- runtime 확인: 2026-10-09 15:54 JST, `localhost:3030`, PID1197561, cwd 이 저장소, `vite dev`. 이는 실제 Rakuten 응답을 받은 로컬 개발 서버 증거이며 공개 배포 검증은 아니다.
- 소개 영역은 로딩/공급자 실패/소개 없음/회차목록만 존재를 구분한다. 문장부호가 있는 정상 소개까지 장 번호 언급만으로 거부하지 않는 보수적 판별이다.
- CoverImage의 기존 큰 이미지→200px→제목/작가 placeholder 경로를 유지한다. hydration 전 캐시 실패도 처리하여 이미 끝난 오류에 skeleton이 계속 남는 경우를 수정했다.

## #80: 관계 검토 및 최소안 결정

| 항목 | canonical ID / 대표 ISBN | 확인한 관계 |
| --- | --- | --- |
| ジョジョの奇妙な冒険 | `jojo-bizarre-adventure` / `9784088511269` | 원래 목록 항목. |
| ジョジョリオン | `work-77008e04537e3fd889e2` / `9784088703114` | [출판사 작품 페이지](https://ultra.shueisha.co.jp/manga/manga-574/)에 시리즈 제8부 명시. 기존 context.seriesGroupId도 원작 그룹을 가리킨다. 동일 권의 재판/색채판 중복이 아니다. |
| ザ・ファブル | `the-fable` / `9784063825633` | [출판사 목록](https://www.kodansha.co.jp/titles/1000025267)에서 제1부와 후속부를 구분. |
| ザ・ファブル The third secret | `work-3979ca1df0523fa19990` / `9784065398586` | [출판사 목록](https://www.kodansha.co.jp/titles/1000048804)에 제3부 명시. 제2부 The second contact와도 별도 항목이다. |

검토 결론: 제보 항목은 별개 파트/속편이므로 자동 병합하지 않는다. 향후 최소 표시안은 출처로 확인된 관계만 `シリーズ第8部`/`シリーズ第3部` 보조문구와 별도 작품 링크로 표현하는 것이다. `seriesGroupId`만으로 읽는 순서나 판본 동일성을 추론하지 않는다. 같은 ISBN/판본 중복이 실제 확인될 때만 별도 정정한다. 검색 미리보기 추가는 이 관계 표시에 필수적이지 않으며 #25의 등록 의도 개선과 분리한다. 현재 canonical ID와 감상·진도는 보존하고, 상세의 구매 권 표시만 이번 #62에서 구체화했다. 광범위한 시리즈 데이터 모델은 만들지 않았다.

## 저장·검증

- 기존 authority projection→candidate build→sealed canonical publication을 재사용. 반영 전 DB/생성물 백업, source manifest 비교, 테이블별 정확한 예상 변경 비교, 원자적 반영 및 생성물 readback PASS.
- #59의 `銀魂―ぎんたま―` (`work-527c45f3ae21c5b5ade3`)와 `ハチミツとクローバー` (`work-0bfd1cd17ce207473ec2`)는 출판사 ISBN/작가 원문을 결속해 **libraryOnly/unreviewed**로 추가했다. 모든 축 unknown, 추천/온보딩 자격 false. 수집 근거만으로 취향 분석 자격을 부여하지 않는다.
- 새 Catalog 3311작품, 3315판본, 오류0, 경고55125. 추천 적격2860 그대로. 경고를 새 PASS로 숨기지 않는다.
- 원문 HTTP receipts/SHA/입력/correction script/이전 DB는 `.workspace/tracker-56-metadata`와 누락작품 폴더에서 workspace SQLite에 저장했고 `BACKED_UP` cursor6983786 readback 검증. 후속 실제 공급자 응답은 별도 저장 후 cursor6983795까지 백업했다. canonical evidence는 URL·SHA와 변경 이유를 보존한다.
- 실공급자 응답 파일은 로컬 증거. 순수 helper, 출판사 intake, cached cover failure 회귀는 모의/단위 검증이며 라이브 검증과 구분한다.
- baseline golden 재생성 비교는 Catalog version 한 줄만 변경, 점수/상대순위/metrics 변화 없음. 전체 CI/E2E는 최종 통합 단계에서 한 번 실행한다.

- 변경 지점 검증: work-detail-data + cover-image 24/24 PASS. 출판사 intake/정확 ISBN/category 경계 포함 importer 통합 및 helper/cover 33/33 PASS. promotion registry 3311작품 재생성 및 --check PASS.

## #59 후속 별칭 결속

`SLAM DUNK` (`work-5aaa689fe80174423ad4`, ISBN9784088716114)에 `スラムダンク` 별칭1개만 추가했다. [작가 공식 1권 페이지](https://itplanning.co.jp/works/sd_1/)가 영문·일본어 이름을 함께 명시하고 [출판사 원판1권](https://www.shueisha.co.jp/books/items/contents.html?isbn=4-08-871611-6)으로 동일 판본을 대조했다. sourceType manual은 출처에 근거한 서지 매핑을 뜻하며 사람 annotation 검수라고 표시하지 않는다. MAJOR는 기존 제목 `MAJOR（メジャー）`로 이미 검색 가능하여 수정하지 않았다. 원문/receipt/이전DB/반영 결과는 workspace SQLite에 저장 후 `BACKED_UP` cursor6985725 검증. 최종 Catalog `v1-bf43e2765bf2`, 3311작품·3315판본·오류0·경고55125. スラムダンク/すらむだんく/メジャー/銀魂/ハチミツとクローバー 실제 생성 Catalog 검색 및 libraryOnly 보존 회귀를 포함해 library search 6/6 PASS.
