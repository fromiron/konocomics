# #56 독서 기록 묶음 — #67 · #75 · #81

2026-10-09. 공개 배포·실제 Rakuten 응답과 별개인 로컬 구현/계약 검증이다.

## 계약과 변경

- #67: 관심 없음은 추천 제외 상태만 바꾸며 새 disliked/negativeReasons를 만들지 않는다. 기존 명시적 감상과 진도를 보존한다. 숨김 이유 선택을 제거하고 숨김·평가 차이, 즉시 Undo, Library 관심 없음 목록에서의 추후 편집을 안내한다. 「普通」와 미평가 차이는 기록 편집기에 표시한다. 기존 숨김 레코드의 사용자 감상을 추측해 지우는 마이그레이션은 하지 않는다.
- Catalog 상세의 상태/감상, Library Catalog/외부 편집, 외부 상세의 편집은 화면에서 읽은 updatedAt을 전달한다. 저장은 그 버전과 일치할 때만 실행하며 다른 탭 변경과 실패를 구분해 알린다. 외부 작품은 nested record만 조건부 수정해 최신 ISBN/metadata를 보존한다. 변경 없음은 편집기에서 알리고 저장 버튼을 비활성화한다.
- Catalog 상세의 상태 변경은 Undo를 제공한다. 추천 Undo는 기존 기록이 있으면 원래 상태·감상·진도를 한 조건부 저장으로 복원한다. 삭제 후 재삽입 사이에 다른 쓰기가 개입할 틈을 없앴다. 신규 기록일 때만 조건부 삭제한다.
- #75: 기존 Catalog 상세의 선택 상태 재클릭 취소/Undo 구현을 재사용하고 「この作品の登録を取り消す」를 명시적으로 노출한다. 현재 제목 아래 독서 상태·감상·진도 삭제 범위와 Undo를 안내한다. Library의 상세 링크에도 등록 취소를 표시한다. Catalog 원본은 수정하지 않는다. 외부의 기존 확인 삭제는 유지한다.
- #81: 미독 응답은 질문을 닫고, 표지·제목만 소개를 연다. 미독/건너뛰기로 기록·반응을 쓰지 않는다. 편집 취소는 응답으로 기록하지 않는다. 실제 추가/이미 있음/확인 불가를 구분하며 신규 저장은 조건부 Undo를 제공한다. 성공은 기존 자동 종료 Snackbar로 표시한다.
- 질문 응답·X 건너뛰기·저장 후 해당 세션의 질문을 닫는다. 응답한 Catalog ID/외부 ISBN 최근 1,000개는 장치별 localStorage UI 선호로 보존한다. Zod 배열/문자열 크기 및 파싱 전 총크기 제한을 적용한다. 다른 탭 storage 변경을 읽고, 전체 데이터 삭제 성공 시 이 키와 세션 닫기 키도 삭제한다. Export의 독서 데이터에는 포함하지 않는다. 저장소 접근 거부 시 메모리 상태로만 유지한다.

## 제보 작품과 재현 경계

현재 Catalog의 「ひぐらしのなく頃に解　祭囃し編」은 `work-17515acc6e90eec79270`이다. 이 ID에 planned + liked + 2권 진행을 주입한 상세 컴포넌트에서 관심 없음→원래 상태 Undo를 확인한다. 보고자가 가진 정확한 예전 상태·탭·배포 SHA는 제공되지 않아 과거 무반응을 그대로 재현했다고 주장하지 않는다.

## 수용 기준별 근거

| 이슈 | 확인 항목 | 구현/검증 근거 |
| --- | --- | --- |
| #67 | 숨김과 감상 분리 | recommendation-feedback mapping: 숨김 사유 입력에도 reaction을 생성하지 않음; feedback flow의 이전 감상·사유·진도 보존 |
| #67 | 상태 결과·안내 | 편집기 busy/변경 없음/저장/실패; CAS 충돌 안내; 상세 저장/삭제/Undo Snackbar |
| #67 | 즉시·나중 복구 | 상세/추천 Undo, 기존 Library 관심 없음 목록 링크와 편집기 |
| #67 | 타 탭 데이터 보존 | Memory/Dexie stale external edit 거부, 상세 snapshot CAS, 추천 충돌/Undo tests |
| #75 | 삭제와 관심 없음 구분 | 명시적 Catalog 등록 취소와 삭제 범위, Library 상세 링크 |
| #75 | 원본·다른 자료 보존 | 기존 removeUserWorkIfUnchanged/addUserWorkIfAbsent 재사용, 충돌·복원 회귀 tests |
| #75 | 최소 수 미달 | #58 담당 변경의 기존 프로필 복구 경로와 통합 확인 대상 |
| #81 | 응답별 상태 | unread 무기록 닫기, preview 무기록, 명시 저장, 저장 확인 불가 시 편집기 유지 |
| #81 | 재방문·다른 탭 | persisted answered IDs와 storage listener, 새 세션 같은 작품 억제 regression |
| #81 | 완료·Undo | 자동 종료 Snackbar 재사용, 최신 기록이 있으면 Undo 삭제 거부 regression |
| #81 | 전체 삭제 | context의 applied full-delete가 두 질문 상태 키를 제거하는 regression |

## 검증

- 기록 매핑·편집기·배너·Library·persistence·context·상세의 관련 7개 테스트 파일 집중 실행: **153 PASS** (`/tmp/records-final.log`).
- 추천 흐름 중 feedback/stale conflict/Undo 선택 실행: 8 PASS, 37 unrelated skipped (`/tmp/records-feedback-final.log`).
- 담당 domain/feedback dialog/banner/editor/DB 파일 ESLint PASS (`/tmp/records-eslint.log`). `git diff --check` PASS.
- 전체 suite/CI/build/E2E는 이 묶음에서 실행하지 않았으며 조정자의 최종 통합 검증으로 남긴다. 공개 배포·실공급자·실제 모바일 검증은 이 단위 테스트로 대체하지 않는다.
