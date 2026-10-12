# Tracker #56 — 온보딩·분석 자격·독서 상태·DNA 조정

2026-10-09 현재 canonical SQLite 및 소스 경로 확인. 완료 판단은 최종 통합 테스트와 브라우저 검증 결과를 함께 본다.

## #59 작품별 확인

| 작품 | canonical ID | 별칭 | 추천 적격 | 기존 온보딩 flag | known non-Art 축 | 제한/근거 |
|---|---|---|---|---|---|---|
| 呪術廻戦 | jujutsu-kaisen | Jujutsu Kaisen | true | false | 13 | authorizedModelPanel; ev-jujutsu-kaisen |
| 鬼滅の刃 | demon-slayer | Demon Slayer / 귀멸의 칼날 | true | false | 13 | authorizedModelPanel; ev-demon-slayer |
| SLAM DUNK | work-5aaa689fe80174423ad4 | 없음 | false | false | 11 | authorizedEvidencePanel; ev-v4-work-5aaa689fe80174423ad4-work |
| ハイキュー!! | haikyu | Haikyu!! / ハイキュー | true | false | 13 | authorizedModelPanel; ev-g1c-haikyu |
| ダイヤのＡ | ace-of-the-diamond | Ace of the Diamond | true | false | 13 | authorizedModelPanel; ev-g2-fresh-c-bib-ace-of-the-diamond |
| あしたのジョー | tomorrows-joe | Ashita no Joe / 내일의 죠 | true | false | 13 | authorizedModelPanel; ev-g2-fresh-c-bib-tomorrows-joe |
| MAJOR（メジャー） | work-c1ab3f526b37a071a876 | 없음 | false | false | 0 | unreviewed; ev-identity-library-work-c1ab3f526b37a071a876 |
| スキップとローファー | skip-and-loafer | Skip and Loafer / スキロー | true | false | 13 | authorizedModelPanel; ev-g1c-skip-and-loafer |
| 銀魂―ぎんたま― | work-527c45f3ae21c5b5ade3 | 銀魂 / ぎんたま | false | false | 0 | unreviewed; ev-publisher-library-work-527c45f3ae21c5b5ade3 |
| ハチミツとクローバー | work-0bfd1cd17ce207473ec2 | 없음 | false | false | 0 | unreviewed; ev-publisher-library-work-0bfd1cd17ce207473ec2 |

- 온보딩 선택은 추천 적격과 동일한 검증된 작품만 사용한다. 기존 onboarding flag는 discovery 우선순위로 유지한다. 원래 비적격 작품을 데이터 근거 없이 승격하지 않았다.
- 상세→DNA와 온보딩 기준 차이가 있었던 呪術廻戦·鬼滅の刃·ハイキュー!!·ダイヤのＡ·あしたのジョー·スキップとローファー를 선택할 수 있다. 등록 작품은 중복 선택 대신 Library 링크가 유지된다.
- SLAM DUNK·MAJOR는 실제 수록이며 libraryOnly다. 銀魂·ハチミツとクローバー의 기존 미수록은 metadata 담당의 정확한 판본/출판사 근거 신규 libraryOnly 보강으로 검색·등록할 수 있다(`tracker-56-metadata.md`, 최종 generated version `v1-bf43e2765bf2`). 신규 unknown 팩터는 DNA에 사용하지 않는다.

## #58·#60 동작과 보존

- 온보딩 이력 없는 적격 선호 5개는 기존 guard로 진입한다. 미평가/읽고싶음 41개와 4/5개 선호, 미지원 혼합을 따로 검증했다.
- 기존 기록 수(외부 포함), 적격 선호 수, 추가 필요 수, Library 수정 링크를 표시한다. 5→4 복구의 닫기는 Library로 돌아가며 초안을 보존한다. 최소 미달 상태에서 선명도 목표를 중복 표시하지 않는다.
- 최초 실행의 기존 4개+신규 1개는 완료 경계에서 저장 기록을 다시 읽고 적격 ID로 계산해 처리한다. 신규 기록은 insert-only이며 중복 전체 거부를 유지한다.
- 선택만으로 completed를 저장하지 않는다. 탐색 grid 다음의 명시적 일괄 확인과 작품별 select를 사용하며, 미확인 次へ는 확인 fieldset에 focus한다. 모바일 고정 tray를 늘리지 않는다.
- reading/completed를 구분하고 planned는 감상을 만들지 않는다. planned는 minimum에 포함하지 않는다. 기존 미확인 draft는 보존 후 STEP1에서 확인하며 기존 completed 기록의 재분류는 하지 않는다.
- reading은 stored record/URL/Export v1에서 보존된다. 상세·Library의 상태 변경·감상 편집·진도 표시와 추천 제외도 같은 상태를 사용한다.

## #78 분석과 조정

- 설정의 「手動調整はありません」를 현재 자동 반영 상태로 명시했다. DNA의 장르는 분석 전용 설명이며 감상 조정 컨트롤이 없다.
- 기존 그룹/전체 reset의 disabled, 성공 live 알림, 실패 rollback, 원본 meter 불변 테스트를 유지하고 no-change를 추가했다. 새 저장 시작 때 오래된 성공 알림을 비운다.

## 검증

- focused 10 files / 227 tests PASS: profile/onboarding·catalog-profile, onboarding/submission, taste/taste-flow, infrastructure/db/export-v1·persistence·context, work-detail/work-detail-flow, library/record-editor·library-view ; 후속 no-change·experiment-schema·Dexie data sovereignty·route-boundary 4 files / 61 tests PASS.
- 변경 범위 eslint PASS. React best-practices 점검: 기존 wrapper 재사용, hook 순서 보존, 확인 fieldset/label·focus·disabled 유지, 새 전역 상태 없음. 새 의존성·서버·런타임 DB 없음. 기존 house NativeSelect/Button과 persistence schema 사용.
- 전체 CI/build/E2E는 반복하지 않고 root의 최종 통합 단계에 위임했다. 실제 Rakuten live·배포 성공을 이 결과로 주장하지 않는다.


## 2026-10-12 최종 리뷰 보완 — 복원과 동시 편집

기존 적격 선호 4개와 신규 1개로 STEP2에 진입한 초안은 새로고침 후에도 STEP2를 유지한다. 복원 시 신규 선택만 세던 경계를 기존 적격 선호 수와 함께 계산하도록 수정했다.

완료 시 최소 5개 판정은 Dexie의 기록 읽기·신규 insert·완료 marker·초안 삭제와 같은 쓰기 transaction 안에서 수행한다. Memory backend도 동일 판정을 적용한다. 다른 탭이 선호를 먼저 삭제해 최소 수가 부족해지면 typed validation error를 반환하고 신규 기록·marker·초안을 변경하지 않는다. 이 오류는 메모리 fallback을 유발하지 않는다. 성공한 primary snapshot으로 mirror를 동기화한다. 기존 명시적 긍정 기록의 분석 의미는 보존하고, 새 planned 선택에는 긍정 감상을 합성하지 않는다.

4파일 132테스트 및 변경 파일 ESLint PASS. 별도 검토에서 primary의 기존 선호가 4→3으로 줄고 mirror에는 4개가 남은 경쟁을 확인했다. 실패 후 indexeddb 모드 유지, 신규 row/marker 없음, 두 backend의 draft 보존을 확인했다.
