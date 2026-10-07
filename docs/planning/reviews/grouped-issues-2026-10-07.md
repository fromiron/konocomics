# GitHub 이슈 묶음 개선과 검증

2026년 10월 7일 열린 이슈 28개를 원인과 수정 영역에 따라 6개로 분류했다. GitHub 원문과 열린 상태를 유지하고 각 이슈에 영역 라벨 하나와 bug/enhancement, 처리 가능/추가 검증 상태를 적용했다. 현재 브랜치는 `fix/grouped-issue-improvements`이며 24개 이슈를 로컬에서 수정했다. 3개는 검증 조건을 충족하지 않아 보류했고 1개는 현재 공통 구현에서 재현되지 않았다. 커밋·PR·배포 완료를 뜻하지 않는다.

## 함께 수정한 영역

| 영역 라벨 | 이슈 | 공통 수정 경계 |
| --- | --- | --- |
| `area:data-integrity` | #26 #31 #32 #49 | 원자적 쓰기, 백업 사본의 명시적 충돌 복구, 외부 작품의 조건부 삭제 |
| `area:library-metadata` | #25 #33 #36 #44 #45 #50 | 검색 정규화, 총권수 출처, 서재 목록과 URL |
| `area:recommendation-explanation` | #22 #23 #24 #42 #46 #54 | 실제 분석 입력, 추천 조정, 설명과 후보 안내 |
| `area:navigation-accessibility` | #39 #41 #43 #48 #52 #53 | 공통 선반, 선택 칩, 대화상자, 스크롤과 포커스 |
| `area:responsive-discovery` | #37 #38 #51 | 첫 작품 가시성, 선택 가능한 액션, 좁은 화면 정책 |
| `area:content-provider` | #27 #40 #47 | 제공 데이터 조건, 대체 문구, 공유 URL 안내 |

GitHub readback에서 28개 모두 영역 라벨이 정확히 하나임을 확인했다. #24·#25·#27은 `needs-info`이며 나머지는 검토 가능한 수정 또는 확인 근거가 있다.

## 이슈별 결과

| 이슈 | 결과와 수용 기준 확인 |
| --- | --- |
| [22](https://github.com/fromiron/konocomics/issues/22) | DNA 헤더·휠·공유의 분석 수를 실제 `analyzedWorkIds`로 통일. 미평가 읽음은 분석 수에서 제외하고 좋아요 변경 시 갱신하는 회귀 검사 통과. |
| [23](https://github.com/fromiron/konocomics/issues/23) | 제외/약화 축을 현재 추천의 긍정 키워드에서 제거하고 조정 상태를 표시. 원래 DNA와 산식은 유지. 설정 변경·해제 회귀 검사 통과. |
| [24](https://github.com/fromiron/konocomics/issues/24) | 보류. 현재 첫 이유 문장과 후속 태그는 명세에 맞으며 실제 오해가 확인되지 않았다. 상세 구조와 태그 설명 확장을 임의로 추가하지 않았다. |
| [25](https://github.com/fromiron/konocomics/issues/25) | 보류. planned 기본 추가는 현재 계약이며 오등록·반복 수정 관찰을 먼저 요구하는 가설이다. 미리보기와 등록 상태 선택을 함께 확대하지 않았다. |
| [26](https://github.com/fromiron/konocomics/issues/26) | 파일 선택 전 전체 교체·병합 없음·먼저 백업·선택만으로 변경되지 않음을 안내. 기존 검증·최종 확인 경로 유지. |
| [27](https://github.com/fromiron/konocomics/issues/27) | 보류. 실제 로컬 Rakuten item 응답에서 宝石の国 1권 ISBN 9784063879063과 新装版 回転銀河 5권 ISBN 9784065113653 모두 `chirayomiUrl` 없음. URL 추측 생성 없음. |
| [31](https://github.com/fromiron/konocomics/issues/31) | planned는 insert-only, read/hidden·후속 감상은 관찰 버전 조건부 저장. 두 탭 UI에서 최신 completed/favorite/updatedAt 전부 보존. 추가 fixture에서 progress 권3/화10도 보존. 잘못된 이전 사유만 제거하고 새 상태에 맞는 실제 파서 검증을 통과. |
| [32](https://github.com/fromiron/konocomics/issues/32) | UI로 만든 Dr.STONE/チェンソーマン 초안 충돌을 정확한 작품·감상으로 안내. 취소 우선. 명시 확인 후 백업 사본에서 승인된 겹친 선택만 제외. 실제 다운로드와 제품 Import 검증 통과. 브라우저 원본 초안·저장 기록·나머지 선택 불변. Import의 모순 거부 유지. |
| [33](https://github.com/fromiron/konocomics/issues/33) | 원판 ISBN을 공식 1권/6권·완결 작품 목록에 결속하여 回転銀河 총권수 1→6 정정. 새 writer는 수집 판본 수를 총권수로 쓰지 않고 미확인 0 사용. 상세 fallback과 미확인 문구 수정. DB/context readback 통과. |
| [36](https://github.com/fromiron/konocomics/issues/36) | 추가 검색과 동일 가나·폭 정규화/별칭으로 저장 목록 검색. 실제 ハンター 검색과 즐겨찾기 AND 조건 확인. |
| [37](https://github.com/fromiron/konocomics/issues/37) | 짧은 desktop에서 안내를 압축. 1280×720 첫 카드 y531.17–712.89로 표지·제목·선택 버튼 모두 표시. 1165×747·1366×768 동일, 약160px 앞당김. 최소/최대 수·선택 단계·로컬 저장 안내 유지. |
| [38](https://github.com/fromiron/konocomics/issues/38) | 선택 0개는 native disabled, 남은 개수 안내 유지. 1~4개 부족 안내와 선택 가능한 STEP2의 0개 진행 유지. |
| [39](https://github.com/fromiron/konocomics/issues/39) | desktop 선반 버튼을 카드 바깥 gutter로 이동. 1440px 실측 트랙/버튼 사이 8px 간격, 겹침 없음. |
| [40](https://github.com/fromiron/konocomics/issues/40) | 현재 코드에서는 CoverImage의 두 fallback 모두 `coverStrings.placeholderLabel` 하나 사용. 보고된 두 문구 혼재 재현 근거 없음; 불필요한 문자열 수정 없음. 배포 상태의 해결을 주장하지 않음. |
| [41](https://github.com/fromiron/konocomics/issues/41) | hover 배경 변경을 미선택 칩에만 적용. 선택 読んだ hover 실제 렌더 색상 대비 7.92:1. 공통 radio/checkbox·disabled·focus 의미 유지. |
| [42](https://github.com/fromiron/konocomics/issues/42) | 대표 추천 0건과 모든 후보 0건 안내 분리. 아래 다른 선반의 장르 일치 후보를 없는 것으로 표현하지 않음. |
| [43](https://github.com/fromiron/konocomics/issues/43) | 실제 넘침만 루프 처리. 2개가 들어가는 desktop에서 복제 폭0, clientWidth=scrollWidth=998. 모바일 경계는 원본 링크/버튼을 보이는 슬롯으로 이동, 복제 inert·비노출 유지. 0/1/2/3/5·resize·유한 선반 끝·원본 키보드 검증. |
| [44](https://github.com/fromiron/konocomics/issues/44) | 상세와 동일 검증된 총권수 사용. HUNTER12/39=31%, native progress value12/max39. 미상/0/초과 입력/외부 작품은 근거 없는 퍼센트 없이 기록만 유지. |
| [45](https://github.com/fromiron/konocomics/issues/45) | 리스트의 도장을 본문 상태 행으로 옮기고 상태·감상 접근 설명 추가. grid 도장 유지. 320/390/1280px 제목·작가와 겹침 없음. |
| [46](https://github.com/fromiron/konocomics/issues/46) | 보조 선반 후보 제거와 Top10 부족을 구분. Top10이 그대로 가득 차 있으면 부족 알림을 내지 않음. |
| [47](https://github.com/fromiron/konocomics/issues/47) | About·공유·설정에서 일반 로컬 저장과 자발적 DNA query 공유를 구분. 작품명 해제 후에도 남는 요약/축/분석 수/추천을 설명. 확인하지 않은 서버 로그 보관은 단정하지 않음. |
| [48](https://github.com/fromiron/konocomics/issues/48) | 공유 기록 편집 footer의 호스트 밖 음수 여백 제거. 실제 대화상자 clientWidth=scrollWidth: 1165px에서745, 582px에서519, 390px에서327. 사유·진행 펼침 및 키보드 저장/DB readback 확인. 공급자 응답은 mock. |
| [49](https://github.com/fromiron/konocomics/issues/49) | 외부 상세의 개별 삭제와 제목·범위 확인 추가. 취소는 원래 버튼, 성공은 서재 본문으로 포커스 복귀. 격리된 실제 IndexedDB에서 대상만 제거, 다른 작품 전체 행·설정 불변. 최신 전체 row 충돌/불확실 결과는 단위 검사. Undo 대신 취소 우선 확인 사용. |
| [50](https://github.com/fromiron/konocomics/issues/50) | 검색 draft/IME 중 stale page 보정을 막고 최신 URL updater 사용. 26건 page2→검색→reload, 0건/지우기, 초과 page, Back/Forward 모두 확인. |
| [51](https://github.com/fromiron/konocomics/issues/51) | 좁은 화면에서 native details 정책 접기. 활성 조건·pending/저장 상태는 밖에 표시. 375/390/400×606에서 첫 카드 y460.875, 가로 넘침 없음, summary44px. Enter/Space·숨은 checkbox Tab 제외 확인. 동일 로컬 before 수치와 실제 브라우저 확대는 미확보. |
| [52](https://github.com/fromiron/konocomics/issues/52) | 실제 수정 전 scrollY1169.33→451.33 clamp 재현. 수정 후1140.67→1140.67. Router 저장 높이를 로딩 중 유지하며 늦은 강제 scroll 없음. 응답2개를2.5초 늦춘 경우와 반복 왕복 통과. 최종 Router 수정 후에도 상세 왕복의 동일 위치와 포커스 보존을 다시 확인했고 새로고침 지정 선반 이동도 확인. loading 중 새 wheel 입력은 미검증. |
| [53](https://github.com/fromiron/konocomics/issues/53) | 미리보기→상세→Back→Escape/X 후 해당 현재 원본 BUTTON 복귀, inert 배제, scrollY 동일. 원래 버튼 없는 경우 제목 fallback 회귀 검사. 대표 카드의 숨은 action은 카드에 먼저 포커스를 주어 노출한 뒤 원래 버튼으로 복귀한다. |
| [54](https://github.com/fromiron/konocomics/issues/54) | 같은 factor/anchor의 반복 긍정 설명을 건너뛰고 실제 다른 기여로 보충. 근거가 적으면 적게 표시. 다른 anchor·다른 factor·주의 의미와 원본 contributions/순위는 유지. |

## 데이터와 검증 근거

回転銀河 근거는 [원판 1권](https://www.kodansha.co.jp/comic/products/0000035910), [원판 6권](https://www.kodansha.co.jp/comic/products/0000036217), [완결 작품 목록](https://www.kodansha.co.jp/titles/1000001437)이다. `.workspace/issue-33-volume-repair/`에 원문·SHA·receipt·원본 DB/생성물 백업을 보존했다. 독립 DB 비교에서 context1행 및 evidence1행 외 기존 행은 모두 동일했다. Catalog 검증은 3309작품·3313판본·오류0, 기존 경고55120이며 authority integrity도 통과했다. 총권수가 수집 판본1개와 같은2640건은 조사 후보이지 오류 확정 수가 아니다. 자동 일괄 정정하지 않았다.

로컬 3031 서버가 이번 체크아웃에서 실행되는 것을 확인했다. 기존3030은 다른 작업 트리 서버이므로 건드리지 않았다. 실제 브라우저 검증은 별도 세션의 QA 데이터로 실행했다. 일부 Rakuten 실응답502는 로컬 검증 중 관찰했으며 제품 수정이나 mock 성공을 공급자 전체 정상 증거로 취급하지 않는다.

- 타입 검사 및 대상 린트 통과. 전체 lint는 기존 `.claude` 작업 트리와 무관한 untracked 자료를 제외해 실행한다.
- 빌드는 기존3000포트 서비스 때문에 기본 preview가 충돌했다. 기존 Vite 설정에 검증용 preview포트3041만 덧씌워 동일 제품을 빌드했고3318개 prerender를 완료했다. 제품 설정과 기존 서비스는 변경하지 않았다.
- 전체 단위/통합 테스트 첫 실행1127개 중1121개 통과. 실패6개는 카탈로그 테스트120초 초과2개, Catalog version golden3개, 동시 수정 중 삭제 포커스1개였다. golden은 Catalog version만 바뀌었고 fixture 순위/점수 변화 없음. 최종 재검증 결과는 아래에 기록한다.
- 기존 고정5개 E2E를 desktop/mobile에서 유지한다. 현재 UI 계약과 다른 과거 combobox/상태별 목록/판매순 provider mock/접힌 정책 접근을 갱신하며 DB·Export·동시성·실제 API 경계 검증은 유지한다.

## 최종 실행 결과

| 검증 | 결과 |
| --- | --- |
| 전체 단위·통합 | 135파일 1127개 실행. 초기 실패6개를 아래의 해당 검사로 재검증. 전체 한 번의 무실패 실행으로 표시하지 않음. |
| Catalog 복구·authority 회귀 | `--maxWorkers 1`로2파일19개 PASS. 120초 임계값과 데이터 검증을 바꾸지 않음. |
| 수정 영역 재검증 | `pnpm test`로 설명 golden·CLI·외부 상세·추천·선반·설정6파일95개 PASS. |
| 마지막 스크롤 수정 회귀 | 추천43개 PASS. 새로고침/직접진입/PUSH와 Back/Forward/GO를 실제 Router history action으로 구분. SSR에는 브라우저 구독을 만들지 않음. 마지막 숨은 대표 카드 버튼 포커스 보완 후에도 추천43개 PASS. |
| Catalog | authority·validate·registry check PASS. registry는 새 출판사 근거의 수집 시각1필드만 재생성, 원본 DB SHA 불변. |
| 정적 검사 | 타입 검사, src/tests/scripts 전체 ESLint 및 작업 대상 포맷·diff 검사 PASS. |
| 최종 제품 빌드 | 검증용 preview포트3041에서3318페이지 prerender PASS. |
| 제품 E2E | 고정5시나리오×desktop/mobile을 분할 실행해10개 PASS. 통합 실행9개 PASS 뒤 desktop core의 정책 poll 전체DB 조회와 포커스 복귀를 보완해 재검증했다. 최종 core desktop29.0초 PASS, mobile도 마지막 제품 빌드에서 PASS. 10개 전체 한 번의 무실패 실행으로 표시하지 않으며 분할 재검증을 포함한다. |

E2E에서 단일 기록·정책 저장 poll은 필요한 한 행을 실제 IndexedDB로 조회한다. 전체7store의 약27.5MB를 매번 읽던 검사를272~275바이트의 정확한 row 조회로 바꾸어6~13ms에 검증하며, Export/Import의 전체 상태 비교는 유지했다. stable scrollbar gutter의 경우 scrollWidth가 clientWidth보다 작을 수 있으므로 가로 넘침은 `<=`로 검사한다. 타임아웃이나 데이터 보존 assert는 완화하지 않았다.

Context7 호출 도구가 노출되지 않아 Router API는 설치된 패키지 타입/구현과 [공식 Router context 문서](https://tanstack.com/router/latest/docs/framework/react/guide/router-context)를 확인했다. 새 의존성은 추가하지 않았다.

## UX 수용 기준과 남은 범위

`03-ux-screen-contracts.md` §2 온보딩, §3 DNA, §6 추천, §7 서재, §8 데이터 및 §8.1 About 중 위 변경의 해당 기준을 이슈별 표에서 확인했다. 미변경 화면 전체를 새 디자인으로 재승인하거나 과거 완료 기록을 이번 PASS로 재사용하지 않는다. 실제 배포·모든 공급자 URL·사람 이해도 검증은 포함하지 않는다. #24·#25는 실제 과제 검증, #27은 정확한 판본의 provider URL이 있어야 다시 진행할 수 있다.

실행 로그는 `.workspace/issue-verification/evidence/`, UI 캡처와 실제 QA 백업은 `output/playwright/`에 보존했다. 이 문서는 로컬 개선 작업의 검증 기록이다. 후속 사용자 요청으로 커밋·PR을 준비하며, 이번 PR 작성에서는 사용자가 추가 테스트와 act 실행을 생략하도록 명시했다. 배포·이슈 종료는 수행하지 않았다.
