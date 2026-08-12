# Slice 4 harness prune-and-verify 기록

- 기준 HEAD: `94d2ac803844ce39e884326d523afa9516f7d7ab`
- 대상: 별도 정적 `harness/`의 `/human/`, `/synthetic-pilot/`과 공용 wizard
- 사용자: 가명 ID와 로컬 `ExperimentProfileV1`을 가진 G2 참가자 또는 수동 synthetic pilot 운영자
- 주 작업: profile import → 설명 전 블라인드 응답 → 설명 후 응답 → debrief → canonical JSON download
- 성공 조건: auth/network/storage 없이 실제 browser flow가 결과 파일을 만들고 aggregator가 동일 catalog/context로 재검산할 수 있음

## 검증 결과

| check | status | evidence |
| --- | --- | --- |
| deletion | pass | 계정·이메일·원격 표지·영속 draft·analytics·제품 route를 넣지 않았다. participant ID, profile file, 2단 설문, debrief, download는 각각 identity/input/cardinality/blinding/result 전달에 필요해 유지했다. |
| substitution | pass | 문구가 리ストA/B, 설명 전후, 익명 participant ID, 로컬 JSON, 결과 download에 구체적으로 결합돼 일반 제품 랜딩 copy로 치환되지 않는다. |
| semantic structure | pass | `main` → header/progress → 단계별 `h1` → 실제 list/fieldset/legend/radio/button 순서이며 error는 `role=alert`, download status는 `aria-live`다. |
| glance hierarchy | pass | 각 단계의 단일 `h1`, 리ストA/B heading, 하단의 단일 primary progression action으로 다음 행동이 분리된다. |
| primary task | pass | 50-work current catalog에서 실제 도메인 왕복이 A 10/B 10, distinct pre 15, post 20, canonical 9,060 bytes+LF를 생성했다. 최종 150-work browser pilot은 catalog 동결 뒤 수행한다. |
| growth | pass | native list는 계약상 slot당 최대 10으로 고정되며 overlap은 공유 응답 안내를 표시한다. 150작품은 후보 풀 크기일 뿐 화면의 응답 카드 수를 늘리지 않는다. |
| reflow | unknown | CSS는 320px부터 단일 column, 920px부터 two-column list로 정의되고 overflow 표가 없지만 실제 Edge viewport/zoom 표본은 최종 pilot 전에 남아 있다. |
| keyboard and visible focus | unknown | native controls, 44px 이상 choice/48px buttons, `:focus-visible` ring, 단계 전환 heading focus가 구현됐지만 실제 Edge keyboard 완주는 최종 pilot 전에 남아 있다. |
| reduced motion | not-applicable | 애니메이션과 transition을 추가하지 않았다. |
| provenance | pass | 작품 title/creator는 frozen catalog에서만 읽고 표지 정보가 없을 때 `04` §4.3의 명시적 placeholder를 쓴다. 결과나 UI에 사람 검증을 합성하지 않는다. |
| nested-radius-coherence | pass | 독립 card/fieldset/action surface에만 4–8px radius를 쓰며 focus를 자르는 nested shared contour가 없다. |
| affordance-mapping | pass | link는 entry 이동, radio label은 선택, primary button은 단계 확정/download, secondary button은 restart로 역할과 표현이 일치한다. |
| action-hierarchy | pass | 단계당 진행 action 하나만 primary이며 완료 단계의 restart는 secondary다. |
| action-visibility | pass | 필수 진행/download/restart가 overflow나 hover에 숨지 않는다. |
| grouping-cues | pass | 작품 card, 질문 fieldset, A/B section이 occurrence·질문·list 경계를 각각 전달한다. overlap 재등장 card는 공유 응답 문구를 표시한다. |

## 삭제·유지·복원 판단

- 삭제: 로그인/더미 이메일, remote cover, browser storage, 뒤로 가기, 설명 전 engine 정보, 임의 자유서술.
- 유지: 단계 progress, 표지 placeholder, overlap 공유 안내, 응답 완료 전 disabled progression, final-only debrief.
- 복원: 처음 구현에서 overlap의 두 번째 occurrence가 빈 card로 보이던 점을 `この作品の回答は、先に表示されたリストと共有されています。`로 보완했다.

## 현재 판정

`release_ready=false`. 코드·정적 build·도메인 왕복은 통과했지만 이 하니스는 배포 대상이 아니며, 150-work catalog identity를 동결한 뒤 Edge에서 primary task/reflow/keyboard를 실제 수행해야 한다. 미검증 위험은 `reflow:unknown`, `keyboard and visible focus:unknown`이다. 수용된 위험은 없다.
