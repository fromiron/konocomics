# #56 검색·추가·선택 버튼 개선 근거

2026-10-09 JST. 담당 이슈: #64, #65, #66, #76, 연결 #25. 제품 계약은 `03-ux-screen-contracts.md` §7의 2026-10-09 검색 개선 계약이다.

## 변경과 확인

- #64: 추가 시트, 온보딩, 저장 목록, URL schema, Rakuten title schema는 `WORK_QUERY_MAX_LENGTH=100`을 공유한다. HTML maxlength와 연결된 일본어 안내, 100 초과 값의 검색 전 거부를 함께 적용했다. 입력 draft는 유지하고 IME 확정 뒤 검색하며 지우기 버튼을 제공한다. 32 unit 초과는 정확/접두/부분 일치만 수행해 Fuse의 긴 패턴 chunk 비용을 제거했다.
- #65: 명시적 검색만 공급자를 호출한다. 요청 중/오프라인/길이 초과/IME 중 버튼 가용성을 맞추고 실패 뒤 문구를 재시도로 바꾼다. query 변경·닫기 abort와 request sequence로 늦은 응답을 무시한다. 검색의 10초 제한은 표지 요청 slot 대기에도 적용한다. 정상 0건, generic failure, offline은 구별하며 quota를 추정하지 않는다. 로컬 결과는 보존한다.
- #66: 공통 인덱스를 재사용하며 제목/가나/별칭 정확 일치 → 제목/작가 접두 → 부분 → 퍼지 순으로 정렬한다. 동급은 Catalog 순서다. 원문 표기와 external identity는 변경하지 않는다. 추가 시트의 명시적 장르 선택은 기존 10개 장르만 사용한다. BL은 제목/작가 문자열 검색으로 남으며 UI에 BL 분류 미제공을 명시한다. BL 분류가 해결됐다고 주장하지 않는다.
- #25: 새 작품은 `読みたい`/`読んでいる`/`読んだ`를 명시적으로 선택해 추가한다. Catalog와 external 모두 기존 insert-only API로 전달하며 버튼과 성공 안내가 선택 상태와 일치한다. 기존 record 덮어쓰기·검색 미리보기는 추가하지 않았다.
- #76: 공용 Button의 pressed foreground는 accent 위의 어두운 글씨인데 outline/ghost hover가 어두운 surface로 바뀌던 공통 원인을 수정했다. pressed hover는 accent-hover + on-accent를 유지한다. Library 즐겨찾기와 grid/list는 aria-pressed 외에 체크 아이콘도 제공한다. 정상 ChoiceChip 구현은 수정하지 않았다.

## 수정 지점 검증

`VITE_CONFIG_NATIVE_IGNORE_WARNING=true pnpm exec vitest run tests/unit/library/search.test.ts tests/unit/library/work-search-sheet.test.tsx tests/unit/library/library-flow.test.tsx tests/unit/onboarding/search.test.tsx tests/unit/infrastructure/rakuten/client.test.ts`

**5 files / 40 tests PASS** (2026-10-09 15:54 JST). 이후 초과 IME 값을 URL에 보내지 않는 회귀 1건을 추가하고 온보딩 검색 9/9 PASS (15:56 JST). 최종 묶음에 포함된 대상은 총 41건이다. 주요 근거:

- `ONE PIECE`, `ワンピース` 정확/별칭 → 접두 → 부분 → 퍼지 순위; `BL`의 제목 prefix; `capeta`/`ｃａｐｅｔａ`; `藤本タツキ`/`藤本 タツキ`.
- 기존 가나·반각·별칭 검색, 빈 문자열, 100/101/220 unit, 이모지 초과 입력, IME 확정 전후.
- 제한 초과에서 provider 미호출·버튼 disabled·지우기, offline→online, stale result 무시, 실패→재시도→정상 0건.
- active fetch abort와 4개 cover request 뒤에 대기 중인 search abort 모두 UI promise를 종료하며 취소된 요청을 새로 보내지 않음.
- Catalog/external 각각 planned/reading/completed insert-only 전달. 기존 persistence overwrite 방지 계약은 재사용한다.

수정 파일 ESLint PASS. React best practices 점검: memoized index/genre subset, 요청 취소/순서 검사, IME committed query, label/상태 연결, 신규 의존성 없음.

## 검색 계산 분리 측정

Node 24/tsx, HEAD의 동일한 3,309 작품 입력, 각 7회 중앙값(ms). 수정 전 Fuse 옵션/검색용 문자열과 수정 후 공통 검색을 같은 프로세스에서 비교했다. 공급자 호출은 **0회**이며 아래 수치는 로컬 매칭만 측정한다.

| 검색어 | 이전 ms | 이후 ms |
| --- | ---: | ---: |
| ONE PIECE | 13.797 | 11.010 |
| ワンピース | 6.537 | 6.496 |
| BL | 3.524 | 0.156 |
| capeta | 8.584 | 10.113 |
| 藤本 タツキ | 8.430 | 8.230 |
| あ × 100 | 160.651 | 0.072 |
| あ × 220 | 283.605 | 0.00019 (입력 거부) |

리뷰의 30초 멈춤 자체는 정확 입력·기기 조건이 없어 재현하지 못했다. 관찰된 로컬 긴 Fuse 패턴 비용을 줄였으며 이 수치를 모든 기기의 UI 응답시간으로 일반화하지 않는다. 실제 provider HTTP 502/provider_unavailable 관찰은 root의 브라우저 검증에 별도로 기록한다. 공급자 실패를 로컬 계산 시간 또는 quota로 해석하지 않는다.

## 최종 통합 확인에 넘긴 항목

- #76 실제 렌더링 default/hover/focus-visible/disabled × selected/unselected 대비 수치, 키보드/터치/확대: root의 마지막 브라우저 확인에서 측정한다.
- 시트 닫기/포커스 복귀 및 모바일 overflow, URL/정렬 회귀는 기존 최종 통합 E2E에서 한 번 검증한다.
- 여기서는 전체 suite/CI/build/E2E를 반복하지 않았다. 실제 Rakuten 정상/장애 복구는 provider 상태에 따라 달라지며 mock 성공을 live-provider 성공으로 보고하지 않는다.
