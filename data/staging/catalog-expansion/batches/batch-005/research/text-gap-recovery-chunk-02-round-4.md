# Batch 005 text gap recovery round 4 — chunk 02

- 조사일 및 조회일: `2026-08-25`
- 대상: `batch-005/frozen-work-set.csv` positions `11–20`
- 평가 범위: `entry_1_3_volumes` (권 1–3 또는 그에 대응하는 초반 범위)
- `reviewedByHuman=false`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- current terminal text SHA-256: `d43545494520719d5f6b7042f89ea8ff05298ba6adc509a83539362c162baad3`
- current terminal Genre SHA-256: `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de`
- current terminal Theme SHA-256: `671539087a1958781e9d11a9e9bc67e057f009846f0ba5e6f2203a18d1ad7cf9`

## 처리 경계

round 2·3 연구 보고서, round 2·3 Daybreak 독립 QA, 초기 chunk-02 연구, chunks 01–02 Pass C adjudication, 현재 terminal CSV를 먼저 대조했다. 이미 `ACCEPT`, `REJECT`, `UNKNOWN`으로 종결된 제안은 재제안하지 않았다. Genre가 Axis를 결정하지 않으며, 작품명·잡지/독자층·직업명·수상·단일 사건을 수치 Axis로 바꾸지 않았다. 리뷰는 새 값을 만들지 않았고, Art는 조사하지 않았다.

이번 라운드에는 기존 보고서에 보존되지 않았던 초반 권의 공식 상세 문장과 새 공식 권 페이지를 추가로 확인했다. 연구 결과는 제안일 뿐이며 terminal CSV·Pass A·source/provenance·overlay·promotion 상태를 변경하지 않았다.

## 새로 확인된 제안

### Position 12 — ボクラノキセキ (`work-1550d4a52c3fe6d9f94c`)

#### 새 공식 1차 출처

1. **一迅社WEB — ボクラノキセキ 3巻**
   URL: `https://data.ichijinsha.co.jp/detail/75805543`
   publishedAt: `2010-09-25` (ISBN 9784758055437)
   retrievedAt: `2026-08-25`
   evaluatedRange: volume 3
   observation: 공식 소개는 전쟁으로 멸망한 제레스트리아의 왕녀 베로니카의 기억을 가진 미나미, 기억 보유자를 모으기 시작하는 오토모, 현재의 생활을 중시하는 미나미와의 의견 충돌을 함께 명시한다.

#### 제안

- `pacing=2`, confidence `0.67`
- dictionary anchor: 첫 3권에서 목표·상황·관계 상태가 일반적인 Arc 단위로 변화하는 경우.
- bounded reasoning: 권 1의 개인적 기억과 학교 고립, 권 2의 동급생들의 연속적인 기억 회복과 베로니카 정체 주장, 새로 확인한 권 3의 기억 보유자 집결과 현재 지향/전생 지향의 대립은 초반 범위에서 상태와 갈등 단위가 순차적으로 바뀌는 구조를 보여준다. 이는 단순히 `mysteryReveal`을 다시 값으로 바꾸는 제안이 아니다. 빠른 목표·장소 전환의 4는 근거가 없으므로 2로 제한한다.
- confidence basis: 권 3의 새 공식 페이지와 기존 권 1·2 공식 페이지를 권별로 대조했다. `progression=2`는 round 3에서 기억 공개와 중복된다는 이유로 거부됐으므로 재제안하지 않는다.

#### 남은 미확정

`problemSolving`, `strategy`, `comedy`, `romance`, `emotionalWarmth`는 이 새 권 소개만으로 사전의 직접 관찰 기준을 충족하지 않는다. `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `relationshipStructure`, `darkness`, `mentalStress` 및 Art 값은 기존 terminal 값을 재개방하지 않는다.

### Position 17 — おかめ日和 (`work-1b7c4ed54d7761cd242b`)

#### 새로 보존한 공식 상세 근거

1. **講談社 — おかめ日和**
   URL: `https://www.kodansha.co.jp/comic/products/0000043658`
   publishedAt: `2007-04-13` (ISBN 9784063722802)
   retrievedAt: `2026-08-25`
   evaluatedRange: volume 1
   observation: 공식 목차에 `亀田健康道場ですぅ`가 별도 초반 에피소드로 있고, 작품 소개에도 남편의 鍼灸 업무가 명시된다. 이전 연구 기록은 가족·부부 맥락만 보존했으므로 이 구체적인 업무 에피소드 근거를 새로 기록한다.

2. **講談社 — おかめ日和（2）**
   URL: `https://www.kodansha.co.jp/comic/products/0000043712`
   publishedAt: `2007-11-13` (ISBN 9784063723861)
   retrievedAt: `2026-08-25`
   evaluatedRange: volume 2
   observation: 공식 소개가 남편의 亀田健康道場（鍼灸治療院）을 평판은 좋지만 만성 재정 적자 상태로 묘사하고, 야스코가 운영 자금을 마련하려 애쓰는 상황을 제시한다. 목차에도 `今月も赤字だヮ`가 있다.

3. **LINEマンガ — 3話無料 おかめ日和** (licensed distributor, publisher metadata: 講談社 / magazine: BE・LOVE)
   URL: `https://manga.line.me/product/periodic?id=S116501`
   publishedAt: not stated on page
   retrievedAt: `2026-08-25`
   evaluatedRange: early episodes 1–3
   observation: 권리자·출판사 메타데이터를 확인할 수 있는 정식 유통 페이지가 초반 3화를 열거하고, 제3화를 `亀田健康道場ですぅ`로 명시한다. 작품 소개는 남편의 鍼灸 직업을 반복 전제한다. 이 자료는 보조 확인으로만 사용한다.

#### 제안

- Theme `workplace`, centrality `1`, confidence `0.82`
- dictionary anchor: 반복되는 일부 에피소드 또는 서브 소재로서의 직장·업무 구조. 작품 전체의 중심 보상으로 확인되지 않으므로 centrality `2`가 아니다.
- bounded reasoning: 권 1에 치료원 업무 에피소드가 독립적으로 있고 권 2에서 같은 치료원의 재정 운영이 주요 갈등으로 재등장한다. 따라서 단순한 남편의 직업명이나 한 장면이 아니라, 초반 1–2권에 걸쳐 반복되는 업무 공간·운영 문제가 확인된다.
- 이 제안은 기존의 `foundFamily` 거부를 재개방하지 않는다. 이미 존재하는 가족은 found family가 아니며, `workplace`를 제외한 새 Axis·Genre는 제안하지 않는다.

## 새 근거가 값을 만들지 못한 작품

아래 작품은 새로 조사한 공식 경로가 기존 근거를 반복하거나, 확인된 문장이 잔여 Dictionary construct를 직접 지지하지 않아 새 cell을 제안하지 않았다. 이는 기존 `UNKNOWN`을 낮은 값으로 바꾸는 근거가 아니다.

| position | work | 새로 확인한 범위 | 새 cell을 만들지 않은 이유 |
| ---: | --- | --- | --- |
| 11 | ヨルムンガンド | 小学館 권 1–3/시리즈 경로와 초반 시험읽기 연결 | 무기 거래·전투·과거 공개는 기존 combat/darkness/mystery 범위와 겹친다. 잔여 progression/problemSolving/strategy/comedy/romance/warmth를 직접 반복하지 않는다. |
| 13 | おまかせ精霊 | KADOKAWA Comic Alive 권 목록과 정식 유통 권 소개 재확인 | 권 1–3의 회원·클럽 목표 관찰은 기존 progression/pacing/relationshipStructure 판정으로 소진됐다. 잔여 solving/strategy/mystery/world/darkness/stress/romance/warmth를 지지하는 새 공식 상세는 확보하지 못했다. |
| 14 | ニラメッコ | 白泉社 권 1–2 및 Young Animal 작품 경로 | 개그맨 공동생활·무대·직업 불안은 기존 comedy/workplace/stress 범위다. 잔여 Narrative, darkness, romance, warmth에 대한 새 반복 근거가 없다. |
| 15 | 恋愛ラボ | 芳文社의 권 1–3 목록과 정식 시험읽기 연결 | 연애 연습·학생회 위기·5인 상호작용은 기존 Genre/Theme/Tone 판정과 겹친다. 새 독립 공식 페이지에서 잔여 Narrative construct를 추가로 확인하지 못했으며 pacing을 같은 페이지의 반복 문장으로 재제안하지 않았다. |
| 16 | 銀のスプーン | 講談社 권 1–3 및 정정된 정식 유통 리뷰 경로 | 조리와 가족 제약은 기존 Theme와 warmth/character 판정이다. strategy나 문제 해결 절차를 새로 확인하지 못했다. round 3에서 문제 해결 제안은 `UNKNOWN`으로 남았으므로 재제안하지 않았다. |
| 18 | 新黒沢 最強伝説 | 小学館 Big Comic BROS. 권 1–3 | 귀환·무직·노숙·생존 사건은 기존 survival/comedy/stress 범위다. hardship를 darkness나 strategy/problemSolving으로 바꾸지 않았다. |
| 19 | カレチ | 講談社 권 1–3와 작가 인터뷰의 초반 범위 재대조 | 승객 대응의 반복은 기존 `problemSolving=2`에 반영됐다. 잔여 relationship/comedy/darkness/mentalStress/romance를 직접 지지하는 새 공식 근거는 없다. |
| 20 | GREEN WORLDZ | 講談社 권 1–3의 식물 위협·야간 이동·무기 탐색 경로 | 생존·전투·규칙·암울함은 기존 Theme/Axis 값에 반영됐다. 새 공식 문장은 잔여 strategy, relationship, comedy, romance, warmth 또는 추가 narrative 값을 사전 기준으로 확정할 정도로 반복적이지 않다. |

## Art 및 리뷰 경계

- 모든 10작품의 Art 4축은 계속 `unknown`이다. 공식 내부 페이지 6쪽·2장면 맥락을 충족하는 판본 연결 표본을 이번 연구에서 생성하지 않았다.
- 유저 리뷰는 사용하지 않았다. 새 cell은 공식 출판사 1차 자료와 한 건의 정식 유통 메타데이터만으로 제안했다.
- 선정 provenance를 Factor Evidence로 사용하지 않았다.

## 결론 및 다음 판정 경계

- 독립 adjudicator 검토 후보: `work-1550d4a52c3fe6d9f94c:pacing=2`, `work-1b7c4ed54d7761cd242b:Theme workplace centrality=1`.
- 두 후보 모두 terminal CSV에는 아직 반영하지 않았다.
- 나머지 잔여 cell은 현재 범위에서 새로운 공식 상세가 확인되지 않아 `unknown`으로 유지한다. 추가 재개방은 새로운 exact entry-range source 또는 사전 construct를 직접 관찰하는 독립 근거가 생길 때만 허용한다.
- 최종 상태는 `reviewedByHuman=false`이며, promotion·eligibility·generated catalog·source CSV·commit은 변경하지 않았다.
