# Batch 004 position 15 round-1 text recovery — independent QA

## 범위와 결론

- Reviewer: Daybreak independent QA; `reviewedByHuman=false`.
- 대상: frozen position `15`, `work-2df743e085adef5e9bd3`, `キルアオ`.
- 검토일: `2026-08-25`; 범위는 공식 1–3권만이다.
- 결론: 제안된 `progression=known 2`, confidence `0.76`을 **REJECT**한다. terminal의 `progression=unknown`을 유지한다.
- 이유: 공식 trial에서 확인되는 것은 1권의 단일 학업 흥미 발견, 2권의 남자친구 역할·약혼자 승부, 3권의 위기 대응·관계 대화다. 권차가 진행되고 학교·팀 역할이 이어지는 사실은 확인되지만, Dictionary의 성장·획득·숙련 보상이 entry 범위에서 반복된다는 근거는 아니다.
- terminal/source/generated/Genre/Theme/Art/overlay/blocker/registry/promotion 파일은 수정하지 않았다.

## 입력 바인딩

- Repository HEAD: `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`.
- Candidate-set SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Manifest SHA-256: `6471599e70992b42b7be29380133be8275c6f187724eedd4a67c954d2ee3bdef`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Recovery note SHA-256: `2255d4039521175b85b0e2e6dc65acdfb1ef370e3e810f87f44d87d10bcc8279`.
- Terminal text CSV before/after SHA-256: `0baabb3833eb2c4551eac5b97a8211b773d9bb59a1073c5b2bebc4622cd21c60` / `0baabb3833eb2c4551eac5b97a8211b773d9bb59a1073c5b2bebc4622cd21c60` — **PASS, no mutation**.
- Genre terminal SHA-256: `05c7f1678e6089dbcc7a2076a96157bae0fc3702028a4e482b1f80f43f44cfc9`.
- Theme terminal SHA-256: `bb5a08ec02e6b06399086de9c27b5eb3ef944a5d62c29c45daef89478cf107ac`.
- Art terminal SHA-256: `f2a9deaed403d6f90e10404043a2e805a29c21c356a2c7856f75b67ed17929e0`.

## 공식 집영사 재검증

공식 S-MANGA 상품 1–3권과 각 exact reader를 모두 다시 열었다. 상품 페이지는 title/creator/edition/release를 일치시켰고, reader의 stable page ID를 직접 확인했다. page pixels는 텍스트 판정에만 사용했으며 Art를 재검토하거나 임시 이미지를 커밋하지 않았다.

| 공식 근거 | 직접 확인한 범위 | progression 판정 |
|---|---|---|
| [1권 상품](https://www.s-manga.net/items/contents.html?isbn=978-4-08-883686-7) / [1권 trial](https://www.s-manga.net/reader/main.php?cid=9784088836867) | 상품 설명은 생물병기로 중학생이 되어 학교에 들어가는 premise다. `P0038`·`P0040`은 十三이 학교는 공부하는 곳이라고 인식하고 수업이 즐거웠다고 말하는 한 묶음의 발견을 보여준다. `P0044`·`P0046`은 학교 위기와 즉시 행동이다. | 학업 흥미 한 번은 직접 관찰되지만, 습득 결과나 성장 보상이 반복되지 않는다. 위기 행동은 기존 `problemSolving` 근거이지 progression 반복이 아니다. |
| [2권 상품](https://www.s-manga.net/items/contents.html?jdcn=08X10000000032350600) / [2권 trial](https://www.s-manga.net/reader/main.php?cid=08X10000000032350600) | 상품 설명과 목차는 남자친구 역할, 약혼자 자리를 건 승부, 중간고사, 풋살을 열거한다. `P0008`은 역할 부여, `P0014`는 교실의 전학생/사회 상황, `P0020`은 고백 관련 대화, `P0026`은 승부 설정이다. | 역할·사건·경연의 연속이지 十三의 능력 획득, 숙련 단계, 성장 보상은 아니다. 중간고사 목차만으로 학습 성취를 추론하지 않는다. |
| [3권 상품](https://www.s-manga.net/items/contents.html?isbn=978-4-08-883797-0) / [3권 trial](https://www.s-manga.net/reader/main.php?cid=9784088837970) | 상품 설명은 W데이트 중 성인화, ノレン 재납치, 十三·天馬의 추적/탈환 시도다. `P0010`·`P0015`는 위기 연락과 팀 대응, `P0020`은 관계 갈등 뒤 사과와 앞으로 노력하겠다는 대화다. | 팀 행동은 성장 보상이 아니다. `P0020`의 노력 의사도 한 번의 관계/character beat이며, entry 범위에 걸친 획득·숙련 결과를 성립시키지 않는다. |

Recovery note가 묶은 “학교 진입 → 사회 역할 조정 → 팀 추적”은 사건의 시간순 연결이다. 세 요소 사이에 성장 목표, 반복 시도, 획득/숙련 결과가 이어지는 인과 사슬이 없으므로 sustained progression으로 바꿀 수 없다. 이전 independent QA의 `UNKNOWN` 판정과 round-3의 “mastery ladder 없음” 경계도 새 direct pages로 뒤집히지 않는다.

## Dictionary 판정

| 후보 | 결정 | 근거 |
|---|---|---|
| `progression=2` | **REJECT** | `2 = 서서히 성장`은 단순 상태 변화나 학교·관계 역할의 지속이 아니라 성장/획득 보상이 관찰되어야 한다. 공식 pages는 학업 흥미 한 번과 별개의 역할·위기 사건만 보여주며 보상의 반복을 확인하지 못한다. |
| `progression=4` | **REJECT** | 반복적으로 명확한 성장·획득·숙련 보상, 단계, 성취가 없다. |
| `progression=unknown` | **RETAIN** | `unknown`은 낮은 값이 아니며 coverage를 채우기 위해 추론하지 않는다. |
| `strategy`, `mysteryReveal` | `UNKNOWN` 유지 | 단기 계획/자원 운영이나 clue-to-truth 보상은 위 페이지에서 확인되지 않는다. |

## Terminal 무변경과 gate 재계산

- Exact retained row: `work-2df743e085adef5e9bd3,progression,unknown,,,ev-batch-004-a-work-2df743e085adef5e9bd3`.
- Structure: `170` data rows, `10` work IDs, work마다 `17` unique axes, six-column header와 row order 유지 — **PASS**.
- Gate thresholds: Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`, Art `>=3/4`.

| Gate | Before | After | Result |
|---|---:|---:|---|
| Genre | `1` | `1` | pass |
| Theme | `2` | `2` | pass |
| Narrative | `3/6` | `3/6` | **fail — N+1** |
| Tone | `6/7` | `6/7` | pass |
| Art | `3/4` | `3/4` | pass |

- Chunk 02 all-gate set는 positions `14, 17, 18, 20`의 `4/10`으로 변하지 않는다.
- 현재 Batch 004 all-gate set는 positions `3, 14, 17, 18, 20, 21, 43, 44, 47, 49`의 `10/50`으로 변하지 않는다.
- 이 기각은 blocker 또는 promotion 결정을 승인하지 않는다.
