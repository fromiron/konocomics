# 06 — 라이브러리 (`/library`)

2026-09-11 사용자 승인 개선안과 리뷰를 반영한다. 기존 이미지의 색·표지·빈 상태는 재사용하며 상태 매트릭스와 반복 Shelf 구조는 아래 계약으로 대체한다.

## 목표와 구조

내 책 찾기 → 상태 확인 → 기록 수정이 주 작업이다.

1. 간결한 제목과 `作品を追加`
2. `ライブラリ内の作品・作者を検索`
3. 전체 등록 건수가 있는 `すべて`+상태 5종 wrapping 탭
4. `お気に入りのみ` 조건, 정렬, 보기 전환, 현재 표시 건수
5. 단일 grid/list 컬렉션과 24개 단위 페이지네이션
6. 검색어가 없고 표시 결과가 있을 때 본문 전체 폭 데이터 안내 → 기존 Settings 링크
7. 기록 편집/작품 추가 ModalSurface와 앱 셸의 footer/navigation

최근·상태·favorite Shelf와 count matrix는 제거한다. 최근 업데이트는 정렬, favorite는 reaction 조건이 담당한다. 두 보기는 같은 필터·정렬 배열을 사용한다. mobile grid는 두 열이며 horizontal Shelf가 아니다. mobile 검색을 탭 위에 두고 탭 높이를 44px 이상으로 유지한다.

## 데이터와 카드

- Catalog/external/catalog-missing record union, 상태 5종, reaction, volume/chapter progress, updatedAt을 유지한다. identity/DB schema/추천 입력을 바꾸지 않는다.
- 표지 → 제목 → 상태·감상 → 있는 진행 값 → 작은 `記録を編集` 문구 순서의 버튼이다. 상태 단독 필터에서는 같은 상태를 반복하지 않으며 external/missing 배지는 보존한다.
- 읽는 중 progress bar는 저장된 volume과 Catalog 총 권수가 있을 때만 표시한다. 없는 수치·자유 메모·페이지·시간·cloud sync·활동 이력은 만들지 않는다.
- list는 작은 표지와 옆의 기록 정보로 구성하며 긴 제목은 내용에 따라 높이가 늘어난다.
- updatedAt은 편집창의 업데이트 날짜로만 표시한다. 목록/편집창은 같은 표지 요청 URL·크기와 200px fallback을 사용한다.

## 필터·편집·추가

- q/state/favorite를 AND로 적용하고 잘못된 URL 값은 기존 zod 경계에서 버린다. favorite는 선택 시에만 `favorite=1`로 쓴다. back/forward와 새로고침으로 조건을 복원한다.
- 전체 결과를 정렬한 뒤 페이지당 최대 24개를 표시한다. 2페이지부터 `page`를 URL에 저장하며 검색·필터·정렬 변경 시 초기화하고 grid/list 변경은 유지한다. 범위를 넘는 page는 마지막 페이지로 replace한다. 이전/페이지 선택/다음은 기존 Button·NativeSelect로 만들고 조작 뒤 목록에 포커스·스크롤을 옮긴다. 현재 페이지와 열린 편집/추가 결과만 기존 cover resolver의 대상에 포함한다.
- 탭 수는 전체 등록 수, 결과 수는 현재 표시 수다. 전체 빈 서재·검색 0건·빈 상태/favorite 조건을 구분한다. 검색 해제는 q만, 조건 해제는 state/favorite만 지우며 sort/view를 유지한다.
- 기존 기록은 실제 변경이 있을 때만 저장한다. 원복은 무변경이며 진행 입력 접기는 값을 삭제하지 않는다. 신규 판매순 기록의 기본 상태 확인·저장은 유지한다.
- 편집창 제목에 초기 포커스, Tab으로 필드 진입, Escape와 원래 카드/활성 탭 복귀를 유지한다.
- 추가 검색은 `追加する作品名・作者名`과 입력 초기 포커스를 사용한다. 로컬 결과 ID를 기존 cover resolver/cache에 연결하고 실제로 보이는 결과를 요청한다.
- 추가/외부 ISBN 대조·중복 상태 보존·실패·저장 readback은 기존 제품 경로를 사용한다. 판매순 배너 노출은 상위 `03` §5의 현재 승인 범위를 따른다.

## 검증

상위 `03-ux-screen-contracts.md` §7 수용 기준을 항목별로 기록한다. 현재 사용자 기록은 변경하지 않고, 저장·데이터 규모 확인은 별도 개발 origin에서 기존 추가/편집/Import를 통해 검증한다. 기존 unit 파일의 union·정렬·external·이유 정규화는 보존하고 반복 Shelf를 요구하던 검사는 단일 컬렉션 동작으로 바꾼다. 새 E2E 시나리오나 검증 전용 진입점을 추가하지 않는다.
