# Batch 005 text-gap recovery — position 47 round 1

- 조사일 및 모든 URL 조회일(`accessedAt`): `2026-08-25`
- 대상: position `47`, `work-f31a42ea4ad724acefa5`, `デッドデッドデーモンズデデデデデストラクション`
- 평가 범위: `entry_1_3_volumes`; 공식 1–3권 및 그 권에 연결된 첫 주요 사건 구간
- `reviewedByHuman=false`
- 기존 terminal text/Genre/Theme/Art, source, generated catalog, promotion, registry 파일은 변경하지 않음
- `unknown`을 수치로 대체하지 않으며, Genre 추론이나 표지·작화 인상은 사용하지 않음

## Current terminal gap

현재 terminal row와 Art adjudication을 다시 확인했다. 기존 known 값은 재판정하지 않는다.

| group | current terminal | minimum | residual |
| --- | --- | ---: | --- |
| Genre | `2/1` | `1/1` | 없음 |
| Theme | `2/1` | `1/1` | 새 Theme 불필요 |
| Narrative | `pacing=2`, `mysteryReveal=2`, `worldBuilding=2` (`3/6`) | `4/6` | `progression`, `problemSolving`, `strategy` 중 1개 |
| Tone | 7 known (`7/7`) | `5/7` | 없음 |
| Art | `artRealism=2`, `artDensity=4`, `visualSoftness=2` (`3/4`) | `2/4` | `motionImpact` unknown은 비차단 |

이번 round의 유일한 승격 후보는 `strategy=2` 하나다. 제안은 독립 adjudication 전까지 terminal 값이 아니다.

## Official source ledger

| evidenceId | sourceName | direct URL | publishedAt | accessedAt | bounded direct support |
| --- | --- | --- | --- | --- | --- |
| `r1-47-v1` | 小学館コミック 공식 1권, ISBN `9784091865007` | https://shogakukan-comic.jp/book?isbn=9784091865007 | `2014-09-30` | `2026-08-25` | 침략 이후에도 일상이 지속되는 entry premise와 1권 판본을 확인한다. 편집자 추천의 전쟁게임·도시 위협 언급은 배경 확인에만 사용한다. |
| `r1-47-v2` | 小学館コミック 공식 2권, ISBN `9784091868572` | https://shogakukan-comic.jp/book?isbn=9784091868572 | `2015-02-27` | `2026-08-25` | 고3의 일상과 함께 외계인 대응 병기 공장이 배치된다고 명시한다. 편집자 추천의 `兵器工場`은 반복되는 국가·기업 대응 자원의 공식 서술로 사용한다. |
| `r1-47-v3` | 小学館コミック 공식 3권, ISBN `9784091872609` | https://shogakukan-comic.jp/book?isbn=9784091872609 | `2015-08-28` | `2026-08-25` | 침략자의 중형선 추락사고가 일상을 깨는 첫 주요 사건이라고 명시한다. 발행일과 대표판은 frozen work의 1–3권 범위 확인에 사용한다. |
| `r1-47-store-v3` | コミックシーモア 공식 판매 페이지 3권 | https://www.cmoa.jp/title/87508/vol/3/ | `2015-09-25` (配信開始日) | `2026-08-25` | 공식 3권 줄거리·ISBN `4091872603`·동일한 중형선 추락사고를 서점 레코드에서 교차 확인한다. 리뷰 평점·자동 태그는 Factor 근거로 사용하지 않는다. |

## Edition-bound reader evidence

아래 URL은 각 공식 상품 페이지의 무료 시험읽기에서 같은 판본의 BODY를 직접 호출한 것이다. 임시 이미지의 SHA-256은 재현 식별자이며 이미지는 커밋하지 않는다.

| evidenceId | direct reader/body URL | page ref / SHA-256 | direct observation |
| --- | --- | --- | --- |
| `r1-47-v1-alert` | https://sc-portal.tameshiyo.me/images/9784091865007?base64=1&trgCode=41&hash=a66a90848d70d3f20fd7093af42d36dd | `reader-trg-41` / `82024f14c964dd02d02ddb1f27f4ed25807d1485c6ed24747f615f2531e3e778` | 1권 본문 뉴스에 `川崎市で自衛隊、警戒態勢`가 등장한다. 침략 위협을 국가 경계태세가 처리하는 첫 단계이며, 이 한 장만으로는 전략 값으로 확정하지 않는다. |
| `r1-47-v2-policy` | https://sc-portal.tameshiyo.me/images/9784091868572?base64=1&trgCode=12&hash=a66a90848d70d3f20fd7093af42d36dd | `reader-trg-12` / `81ebdf392c0aaee289c65ccef5492288bcc218f9390114f96f4d3e9046ac843d` | 2권 본문 뉴스가 일본 군사력 증강 방침, 미일 관계의 균열, 8·31 이후 정부가 큰 기로에 선 상황을 함께 다룬다. 단순한 위협 존재가 아니라 대응 정책의 선택이 제시된다. |
| `r1-47-v3-operation` | https://sc-portal.tameshiyo.me/images/9784091872609?base64=1&trgCode=11&hash=07a253af92238af2a5179c94f63c1f58 | `reader-trg-11` / `77dbfa9f9d1843808464b5359f659e79b9a0fa95f532112517ab8c47ce3d89aa` | 3권의 중형선 추락 뒤 본문이 대규모 제압작전의 시작을 말하고, S.E.S.가 주택·건물 내부 지상전을 상정한 소형기를 당일 자위대에 제공하며, 대형선 방어용 거대 포대도 건설 중이라고 설명한다. 위협에 맞춘 전술·자원 배치가 직접 제시된다. |

## Direct Narrative proposal

### `strategy=2` — provisional

| field | value |
| --- | --- |
| axisId | `strategy` |
| proposedState / value | `known / 2` |
| confidence | `0.80` |
| evidenceIds | `r1-47-v1-alert`, `r1-47-v2-policy`, `r1-47-v3-operation`, `r1-47-v2`, `r1-47-v3` |
| dictionary mapping | 1권의 자위대 경계태세에서 2권의 군사력 증강·대응 정책으로, 3권의 추락사고 뒤 제압작전·지상전용 소형기·대형선 방어 포대 배치로 이어진다. 위협에 대응하는 단기 전술과 자원 운용이 본문에서 구체화되므로 `strategy=0`의 즉흥 대응보다 높고, `strategy=4`의 장기 계획·전쟁·정치·자원 운영이 작품 전체의 중심이라는 주장까지는 하지 않는 보수적 `2`다. |
| factor boundary | `war=1` Theme의 존재를 재사용해 수치를 만든 것이 아니다. `strategy`의 근거는 군사·기업 주체가 위협에 맞춰 경계→정책→작전·장비를 선택하고 배치하는 서사적 계획 구조다. |
| entry boundary | 1–3권 공식 상품 설명과 각 권의 edition-bound reader 본문만 사용했다. 후반권의 S.E.S. 지배·평행세계·타임 트래블 설명은 제외했다. |

이 제안은 `4`가 아니다. 1–3권에서 계획의 존재와 전술적 대응은 확인되지만, 장기 전쟁 지휘나 정치·자원 운영 자체가 주인공의 지속 보상 구조라는 근거는 없다.

## Non-proposals and exhaustion

| axisId | disposition | exact reason |
| --- | --- | --- |
| `progression` | remain `unknown` | 3권의 추락·사상·일상 붕괴는 상황의 escalation이지 성장·획득·숙련 보상 반복이 아니다. 기존 adjudication의 거절 경계를 유지한다. |
| `problemSolving` | remain `unknown` | 공식 본문은 국가·기업의 대응 계획을 보여주지만, 인물이 제약을 분석해 기발하게 해결하는 반복 퍼즐/문제 해결 루프는 직접 제시하지 않는다. 위 evidence는 `strategy`에만 제안한다. |
| `pacing` | retain known `2` | 3권의 “결정적 사건·이야기가 크게 움직인다”는 기존 pacing 근거를 재사용하거나 상향하지 않는다. |
| Tone / Art | unchanged | Tone 7/7과 Art 3/4를 다시 채우거나 `motionImpact`를 추론하지 않는다. |

## Handoff

`strategy=2`가 독립 검수에서 채택되면 Narrative가 `4/6`이 되어 현재 Tone `7/7`, Art `3/4`, Genre/Theme 통과 상태와 함께 promotion coverage가 충족된다. 이는 승격 결정이 아니며, 거부 시 `strategy`는 `unknown`으로 남는다. 이 문서는 새 terminal/source/generated/promotion 행을 승인하지 않는다.

```bash
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-47-round-1.md
sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-47-round-1.md
```
