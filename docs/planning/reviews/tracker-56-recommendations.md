# #56 추천 묶음 — #61 / #68 / #69 / #70

2026-10-09. 로컬 작업 트리의 생성 Catalog와 현재 엔진을 사용했다. 리뷰어의 비공개 프로필 복제가 아니라 재현 가능한 네 고정 입력이다. 라이브 배포 해결·실공급자 검증·사람 사용자 과제 성공을 이 기록으로 주장하지 않는다.

## 구현과 경계

- #61: 기존 설명 선택기가 고른 최대 3개 유효 positive 안에서 카드별 첫 이유를 분산한다. 앞 카드에서 덜 사용한 factor, 동률이면 anchor 노출, 다시 동률이면 원래 기여 순서다. 순위·점수·contributions를 수정하지 않는다. 첫 이유를 바꾼 뒤 템플릿을 다시 생성하여 `も` 문장이 첫 문장이 되지 않게 한다. 카드·Quick Preview·관점 선반은 같은 선택을 공유하고, 상세의 같은 요인은 기존 정도 비교 의미를 유지한다. 대안이 없는 작품에는 설명을 발명하지 않는다. 기존 lens 후보 한도는 장르/무드 필터 적용 후 사용하며 미캐시 후보는 기존 설명 생성으로 복구한다.
- #68: 긍정 분석 수는 DNA `analyzedWorkIds`, 전체 기록 수는 모든 저장 레코드, 부정 입력 수는 추천 input projection의 distinct negativeRecords, 기록 기반 후보 제외 수는 anchors와 eligibilityExclusions의 합집합이다. `読みたい`만 추가(긍정 반응 없음), 미평가, neutral, 외부 작품을 긍정 분석 수로 세지 않는다. 이미 보존된 favorite/liked가 있는 경우는 독서 상태와 독립된 기존 반응 계약을 따른다. footer는 reading/completed/dropped/hidden을 각각 실제 Library 필터와 연결한다. 따라서 footer 상태 수와 적격 Catalog 후보 제외 수는 의도적으로 다를 수 있다. #60의 reading 복구를 rank/input hash 제외에 함께 반영했다.
- #69: 입력 변경 후 수동 갱신 버튼을 스크롤과 무관한 고정 알림 스택에 표시한다. pending/완료 안내/Undo는 하나의 fixed flex column의 static 자식으로 쌓아 모바일에서도 실제 높이에 따라 배치한다. 완료해도 Top 10 ID/순서가 같으면 변경은 반영됐지만 목록은 같다고 알린다. `preferHidden`은 대표 권 리뷰 수 상위 20%(동률 포함) 바깥을 가까운 취향 cohort에서 우선하는 기존 정책이다. 유명도 보장이나 전체 목록 교체를 하지 않는다. cache key는 의미 있는 입력 projection의 SHA-256이며 기록/정책에 따라 바뀐다. planned 추가만으로는 기존 점수를 재계산하지 않는다.
- #70: `mood=lowStress|warm|fastPaced`를 URL schema/route/flow에 연결했다. 선택 변경은 나머지 query를 보존하고 새 history entry를 만든다. Back/Forward·상세 왕복·새로고침에 같은 URL 조건을 복구한다. invalid mood는 없음이다. 임시 `今日はパス`만 기존 탭 메모리에 남으며 개인 프로필을 URL에 넣지 않는다. mood는 모든 추천 선반의 hard filter, genre는 대표/보조 선반의 hard filter이고 Top 10은 기존 전체 장르 계약을 유지한다. 장르 대표는 전체 plan에서 채워 Top 10 밖의 단일 적격 후보도 볼 수 있다. 기본 Top 10이 그대로면 조건을 이미 만족한다고 알린다.

## 고정 입력과 진단

`tests/unit/recommendation/tracker-56-diagnostics.test.ts`와 인접 snapshot에 입력 변경 기록, SHA-256 전/후, Top 10 ID/순서, 후보 점수·bestAnchor·원래 첫 factor·실제 선택 이유·관련 Axis 원값을 보존한다. 기존 kinetic/tactical/warm JSON을 재사용하고 네 번째는 액션 9작품 + `違国日記`를 고정한 혼합 입력이다. 변경은 첫 추천을 `completed + favorite`로 저장한 경우이며 시간도 고정했다.

| 입력 | favorite 저장 뒤 기존 Top 10 잔류 | 숨은 정책 전후 기존 Top 10 잔류 | 첫 이유 진단 |
| --- | ---: | ---: | --- |
| kinetic-competition / 스포츠·액션 | 9/10 | 10/10 | sports 반복 대신 progression·sportsCompetition·darkness의 실제 기여를 표시 |
| tactical-mystery / 미스터리 | 6/10 | 9/10 | investigation 반복 대신 artDensity·artRealism의 실제 기여를 표시 |
| warm-exploration / 힐링 | 6/10 | 10/10 | fantasy/foundFamily 반복에서 emotionalWarmth·adventure·comedy의 실제 기여를 선택 |
| action-nine-and-drama / 액션·판타지 중심 혼합 | 6/10 | 8/10 | foundFamily 반복 중 sliceOfLife 및 pacing의 낮은 정도 공통점(1↔1)을 사용 |

같은 목록은 미반영의 증거가 아니다. favorite는 anchor 입력과 hash를 바꾸고 기록한 대상은 후보에서 제외된다. dropped/hidden 제외 projection도 확인했다. 이미 즉시 제거·백필한 목록을 입력 갱신한 경우 순위가 그대로일 수 있다.

혼합 입력 상위 5개 중 3개(うさぎドロップ·千と万·弟の夫)의 bestAnchor가 `違国日記`인 현상은 실제 점수에서도 확인했다(각 .734940476190, .715304878049, .732518703242). 엔진은 선택 장르의 다수결이 아니라 후보마다 가장 가까운 긍정 anchor를 사용하는 §6.3 계약이다. 설명 앵커를 다른 작품으로 바꾸면 가짜 근거가 된다. 이번에는 사실대로 유지하고 UI에 장르 선택 비율과 추천 비율이 같지 않음을 안내했다. 다수 장르 비중으로 산식을 바꾸는 안은 별도 제품 판단이며 이번 수정을 위해 임의 가중치/anchor cap을 도입하지 않았다.

## 제보 작품 데이터 대조

현재 bundled Catalog에서 직접 읽었다. 판정 데이터를 임의로 수정하지 않았다.

| 작품 | 확인 값 | 해석 |
| --- | --- | --- |
| ドロヘドロ | genres에 horror 포함, mentalStress=2 | horror 선택 일치는 현재 데이터 계약상 정상, lowStress에는 불일치 |
| ONE PIECE | mentalStress=1, warmth=4, pacing=4 | lowStress/warm/fastPaced 조건 모두 충족. 어두운 장면이 없다는 보장은 아님 |
| 転生したらスライムだった件 | mentalStress=1, warmth=3, pacing=4 | 위와 동일한 조건 충족 |
| DRAGON BALL | mentalStress=0, warmth=2, pacing=4 | lowStress/fastPaced 충족, warm 미충족 |
| 呪術廻戦 | visualSoftness=0 | 낮음끼리의 similarity를 부드러운 그림이 강하다고 표현하면 안 됨. 제품 template은 `度合いが近い`이며 기존 실제 데이터 낮은 Axis 회귀 검사 유지 |

## 수용 기준과 검증

- [x] 원 contributions·score·rank 불변, 실제 유효 이유만 선택, 단일 이유 카드의 비발명 검증.
- [x] 네 취향의 실제 엔진 입력/정책/피드백·hash·후보·앵커·선택 이유 trace와 deterministic snapshot.
- [x] planned·미평가·neutral·긍정·부정·dropped·hidden·외부를 함께 둔 집계 행렬과 추천 헤더/상태별 링크 검증.
- [x] controlled mood 초기값/변경/history 재입력/해제와 저장 부작용 없음, URL invalid parsing과 다른 query 보존 구조.
- [x] 전체 plan의 후순위 장르 후보를 대표에 노출하고 Top 10 계약 유지. mood 경계값·unknown·점수 보존 기존 단위 검사.
- [x] cache hit, 입력 hash 변화, stale 계산 억제, 업데이트 완료/변화 없음·포커스 복원, immediate 제거/backfill/Undo/실패 관련 flow 검사.
- [x] 대상 8파일 115 테스트 PASS (`/tmp/recommendations-final-focused.log`). #67 피드백 변경 및 #77 유한 선반과 함께 실행했다. 추가 snapshot hash·기록 trace 4개 재검사 PASS, 변경 파일 ESLint·diff check PASS.
- [x] 알림 스택 변경 후 flow/filter 47 tests PASS. 동시 pending·feedback·Undo를 하나의 스택에 유지하고 1개의 更新 ref/포커스를 보존한다.
- [ ] 브라우저 Back/Forward/새로고침·390px/200%·키보드·실제 다음 작품 선택은 루트 최종 통합 browser 검증에서 확인한다.
- [ ] 라이브 배포 식별자와 실공급자 결과는 이 로컬 단위 검사로 확정하지 않는다.

전체 CI/CD·build·E2E는 이 묶음에서 실행하지 않았다. 최종 통합 시 한 번 실행한다.

## 2026-10-12 최종 리뷰 보완 — 외부 기록 수

`userWorks`와 `externalWorks`가 별도 저장소인 실제 영속성 구조로 집계를 정정했다. 헤더 전체 수를 두 배열 길이의 합으로 명시 전달하고, footer 상태 링크 수도 외부 작품의 embedded record를 포함한다. 추천 입력·DNA 긍정·부정·후보 제외 집합은 기존 Catalog 입력 그대로다. 잘못된 userWorks의 가짜 외부 fixture를 실제 externalWorks fixture로 교체했다.

집중 회귀 2개 PASS: Catalog 긍정 5 + 외부 2에서 전체 7/분석 5/기록 제외 5, 외부 1개 삭제 뒤 전체 6/분석 5를 확인했다. footer의 읽음/숨김 수가 함께 갱신되고 외부만 바뀌면 추천 hash 재계산이 일어나지 않는다. 변경 파일 ESLint 및 diff 검사 PASS. 전체 suite/build/E2E는 다시 실행하지 않았다.
