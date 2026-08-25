# Batch 004 text-gap recovery — position 18 round 1

- 조사일 / `accessedAt`: `2026-08-25`
- 대상: `work-39c1a2b6791238827ed5` / `とろける鉄工所` / 野村宗弘
- 범위: Factor Dictionary의 `entry_1_3_volumes`; 공식 1~3권 상품 설명과 첫 주요 아크만 사용
- 판정 경계: research only, `reviewedByHuman=false`
- 변경 경계: 이 문서만 생성한다. terminal/source/generated/Genre/Theme/Art/promotion/blocker 파일은 수정하지 않는다.

## Current gate and bounded proposal

현재 terminal은 Narrative `3/6`, Tone `5/7`, Art `3/4`이며 Genre `sliceOfLife`, Theme `crafting:2; workplace:2`가 이미 존재한다. Narrative 미지축은 `progression`, `strategy`, `mysteryReveal`이다. 이 라운드에서는 아래 한 축만 제안한다.

| axis | proposed state | value | confidence | Dictionary anchor | gate effect |
|---|---|---:|---:|---|---|
| `progression` | `known` | `2` | `0.76` | `0 = 성장 보상 거의 없음`, `2 = 서서히 성장`, `4 = 성장·획득·숙련 보상이 반복적으로 명확함` | Narrative `4/6 = 0.667`; Tone `5/7 = 0.714`; Art `3/4 = 0.750` |

이 제안은 terminal 값이 아니다. `progression=2`를 별도 adjudication에서 채택하면 세 coverage gate를 모두 넘지만, 이 노트가 CSV·overlay·promotion 결과를 승인하지 않는다.

## Direct official evidence

모든 URL은 `2026-08-25`에 확인했다. 발매일은 각 講談社 상품 페이지의 종이판 `発売日`이다. 목차 제목은 단독으로 Axis를 만들지 않고 entry-range 문맥 확인에만 사용한다.

| source | sourcePublishedAt | accessedAt | direct bounded observation | use |
|---|---:|---:|---|---|
| [講談社 とろける鉄工所（1）](https://www.kodansha.co.jp/comic/products/0000038640) | `2008-11-21` | `2026-08-25` | 작은 철공소에서 노동자들이 용접하고 로봇 발판을 만들며, `新人っていつまで新人なのかしら？`와 3부 구성 `競技会へようこそ`가 목차에 있다. | 현재 작업 상태와 초반의 신입/경쟁 문맥 확인. 목차만으로 progression 수치를 만들지 않음. |
| [講談社 とろける鉄工所（2）](https://www.kodansha.co.jp/comic/products/0000038651) | `2009-03-23` | `2026-08-25` | 공식 소개가 여름의 용접 공장, 가을의 작업장 사건, 겨울의 가족 동반 사원여행을 entry-range의 연속 일상으로 제시한다. | 1권 이후에도 같은 직업 세계와 생활이 이어지는 bounded context. 이 설명만으로 성장·전략을 과장하지 않음. |
| [講談社 とろける鉄工所（3）](https://www.kodansha.co.jp/comic/products/0000038677) | `2009-10-23` | `2026-08-25` | 공식 소개가 북(北)이 결혼을 원해 `手に職を得るため` 직업훈련센터로 가고, 용접공이 되기 위해 넘어야 할 벽을 다루는 `ポリテクセンター編`을 완전 수록한다고 명시한다. | 목표(결혼) → 기술 습득 경로(직업훈련) → 용접공이 되기 위한 장벽이라는 직접적인 성장·획득 아크. |

## Axis decision

### Proposed: `progression=known:2`, confidence `0.76`

Dictionary의 `progression=2`인 “서서히 성장”에 한정한다. 3권의 공식 소개는 단순히 직업이 존재한다고 말하는 것이 아니라, 북이 결혼을 위해 기술을 얻으려 하고, 직업훈련센터를 거쳐 용접공이 되기 위한 장벽을 넘는 명시적 인과 아크를 제시한다. 1~2권의 공식 소개는 그 아크가 합류하는 현재의 용접 작업장·직장 생활을 고정한다. 따라서 entry 범위 안에 최소 하나의 직접적인 기술 획득/성장 아크가 있어 `unknown`보다 `2`가 방어 가능하다.

`4`는 제안하지 않는다. 공식 1~3권 상품 설명만으로 여러 차례의 숙련 단계와 반복적인 성장 보상, 또는 주인공의 명확한 mastery ladder를 확인할 수 없다. 1권/2권 목차 제목과 작업 지식의 존재를 누적해 고값으로 만들지 않는다.

### Rejected residual Narrative axes

- `strategy`: 공식 1~3권 설명에 장기 계획·대응 계획·자원 운용의 반복 구조가 없다. 직업훈련을 전략으로 재분류하지 않는다.
- `mysteryReveal`: 공식 설명에 단서 수집 후 진실이 공개되는 구조가 없다. 북의 과거 아크를 미스터리로 재분류하지 않는다.

Genre/Theme, Tone, Art와 기존 `problemSolving=2`, `pacing=2`, `worldBuilding=2`는 이 노트에서 재판정하지 않는다. 독립 사용자 리뷰는 신규 Axis의 직접 근거로 사용하지 않았다.

## Access limitation and handoff

이 라운드는 공식 상품 페이지의 설명·목차만 사용했다. 앞선 라운드에서 확인된 volume-2 trial redirect loop는 이 문서에서 본문 접근으로 포장하지 않는다. 따라서 위 `progression=2`는 3권 상품 설명에 직접 쓰인 훈련·기술 획득 아크에만 근거한 보수적 후보이며, `reviewedByHuman=false` 상태에서 Pass C/adjudication이 채택 여부를 결정해야 한다.

No terminal CSV, source row, generated catalog, promotion decision, or blocker row is changed by this note.
