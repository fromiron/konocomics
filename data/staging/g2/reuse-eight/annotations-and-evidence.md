# G2 재사용 8작품 주석·근거 기록

## 상태와 범위

이 디렉터리는 G1 교체 후보 동결 자료에서 재사용 가능한 8작품만 완성한 독립 스테이징 패킷이다. data/source와 생성 카탈로그에는 반영하지 않았다. 사람 검수나 사용자 승인 패널을 수행한 것으로 간주하지 않으며, works.csv의 8작품은 모두 annotationReviewMethod=unreviewed, onboardingEligible=false, recommendationEligible=false, libraryOnly=true로 고정했다.

intended-eligibility.csv는 최종 입장 심사를 통과했을 때의 역할과 자격 의도만 별도로 기록한다. 이 파일은 승인 증거가 아니며 작품 자격을 활성화하지 않는다.

## 산출물과 행 수

| 파일                               | 행 수 | 의미                                      |
| ---------------------------------- | ----: | ----------------------------------------- |
| works.csv                          |     8 | 일본어 정식명·서지·현재 비자격 상태       |
| aliases.csv                        |     9 | 영문 라이선스명과 도쿄 리벤저스 표기 별칭 |
| volumes.csv                        |     8 | 작품별 일본어판 대표 1권                  |
| factors.csv                        |   136 | 8작품 × 17축; G1 13축 재사용 + Art 4축    |
| themes.csv                         |    24 | G1 블라인드 조정 결과 재사용              |
| recommendation-context.csv         |     8 | 의도 역할·총 권수; 시장 리뷰는 결측 유지  |
| evidence/evidence.csv              |    24 | 서지 8 + 비Art 8 + Art 8                  |
| evidence/art-evidence-manifest.csv |    32 | 축별 판정·페이지 참조·판본 연결·한계      |
| intended-eligibility.csv           |     8 | 승인 후 의도 상태; 런타임 입력 아님       |

## 동결 입력의 재사용 경계

다음 파일의 값을 재태깅하지 않고 사용했다.

- replacement-pool-freeze.json SHA-256 efbc3b19e7018d07b7e1b9e2674c82a95a481fb4cd99fb480326ea99a0255c39
- reconciled/factors.csv SHA-256 2664d6ea7e64ab85e51012b3b6652324ff63b2c0d48131b0911c8575c548adf8
- reconciled/genres.csv SHA-256 0c2546a2d70f05115c3f0285c7650095ba47c7e7aafa708c32df9a672b59fbb1
- reconciled/themes.csv SHA-256 742579f45e6fee74fa001bfe4b847155abb373d6db330bf380bf484ed480e86c

재사용한 필드는 13개 비Art 축의 state/value/confidence/evidenceId, genres, themes의 centrality/confidence/evidenceId, 동결 슬롯의 catalogRole과 onboarding 의도, 정식 라이선스 미리보기의 장면·페이지 참조다. 일본어 정식명, 작가, 출판사, 상태, 발행연도, 대표 1권 ISBN·발매일은 강담사 일본 공식 상품 페이지로 보강했다.

## 작품별 역할·서지

| 작품 ID                  | 일본어 정식명                      | 분류 / 의도 역할    | 총 권수 | 대표 1권 근거          |
| ------------------------ | ---------------------------------- | ------------------- | ------: | ---------------------- |
| chis-sweet-adventures    | 今日のこねこのチー                 | general / Discovery |       4 | 강담사 일본 0000048116 |
| lovely-muco              | いとしのムーコ                     | general / Discovery |      17 | 강담사 일본 0000038806 |
| penguin-and-house        | ペンとハウス～ペンは飼い主が好き～ | general / Discovery |       3 | 강담사 일본 0000328349 |
| sheetas-little-big-world | こびとのシイタと狩りぐらしの森     | general / Discovery |       3 | 강담사 일본 0000366420 |
| fairy-tail               | ＦＡＩＲＹ　ＴＡＩＬ               | shonen / Anchor     |      63 | 강담사 일본 0000012163 |
| fire-force               | 炎炎ノ消防隊                       | shonen / Anchor     |      34 | 강담사 일본 0000019629 |
| the-seven-deadly-sins    | 七つの大罪                         | shonen / Anchor     |      41 | 강담사 일본 0000017583 |
| tokyo-revengers          | 東京卍リベンジャーズ               | shonen / Anchor     |      31 | 강담사 일본 0000019996 |

Lovely Muco의 동결 volumeCount=4는 당시 강담사 USA 라이선스 가용 권수다. 추천 문맥의 maturity 입력은 일본 원작의 완결 총 권수 17로 정규화했다. 이 변경은 주석 점수 변경이 아니며 최종 합류 전 데이터 담당자가 기준을 승인해야 한다.

volumes.csv는 현행 source 계약과 같이 작품당 대표 1권만 싣는다. 따라서 今日のこねこのチー도 일본어판 1권만 사용하며 혼합 판본 문제를 만들지 않는다.

## Art 4축 판정

모든 표본은 강담사 USA가 제공하는 정식 라이선스 1권 미리보기다. 원본 이미지는 저장소에 복제하지 않았고, 동결된 뷰어 페이지 참조와 판정만 기록했다. 영문 레터링은 artDensity 판정에서 제외했다.

| 작품                     | artRealism | artDensity | visualSoftness | motionImpact | 근거 요약                                                              |
| ------------------------ | ---------: | ---------: | -------------: | ------------ | ---------------------------------------------------------------------- |
| chis-sweet-adventures    |          0 |          1 |              4 | 2            | 6쪽, 주방·공놀이·다른 고양이; page 8 연속 공놀이                       |
| lovely-muco              |          0 |          1 |              3 | 2            | 8쪽, 유리 공방·정원·용광로; page 10 연속 회전/물 튀김                  |
| penguin-and-house        |          0 |          1 |              3 | 2            | 6쪽, 욕실·주방·식사; pages 10–11 조리 동작                             |
| sheetas-little-big-world |          2 |          4 |              2 | unknown      | 6쪽, 숲·통나무 마을·야간 대화; 전체 진입 범위의 동세를 확정하기에 부족 |
| fairy-tail               |          2 |          3 |              2 | unknown      | 6쪽, 도시·열차·숙소; 대표 연속 액션 표본 부족                          |
| fire-force               |          2 |          3 |              1 | 4            | 6쪽, 열차·화재 도시·소방대; pages 32–33 진압/폭발 연속                 |
| the-seven-deadly-sins    |          2 |          3 |              1 | unknown      | 6쪽, 숲속 주점·충돌·식사; 대표 연속 액션 표본 부족                     |
| tokyo-revengers          |          3 |          2 |              1 | unknown      | 6쪽, 시부야·공원 집회·폭행 후; 대표 연속 액션 표본 부족                |

unknown은 낮은 값이 아니다. こびとのシイタと狩りぐらしの森, FAIRY TAIL, 七つの大罪, 東京卍リベンジャーズ의 motionImpact는 현재 참조가 전체 진입 범위의 연속 동작 최소선을 충족하지 않아 수치화하지 않았다.

## 비Art 주석

13개 Narrative/Tone 축과 Genre/Theme은 G1 교체 후보의 블라인드 출력 A/B/C를 조정한 reconciled 결과를 그대로 옮겼다. evidenceId도 보존했다. 이 값들은 모델 간 조정 결과이지 사람 검수가 아니므로 evidence.csv에서 reviewedByHuman=false이고 작품은 비자격 상태다.

## 아직 필요한 입장 작업

1. 8작품 각각에 대해 사람 검수 또는 사용자 승인 authorizedModelPanel 검수와 리뷰 보고서가 필요하다.
2. Art 32행의 축별 판정, 판본 연결, 페이지 참조를 검수하고 こびとのシイタと狩りぐらしの森·FAIRY TAIL·七つの大罪·東京卍リベンジャーズ motionImpact의 연속 동작 표본을 추가하거나 unknown을 승인해야 한다.
3. Lovely Muco volumeCount 17 정규화를 승인해야 한다.
4. reviewAverage/reviewCount의 권위 있는 1권 시장 스냅샷을 수집해야 한다. 현재는 값을 만들지 않고 빈칸으로 유지했다.
5. 승인 뒤에만 annotationReviewMethod, annotationReviewedAt, annotationReviewReference와 eligibility를 갱신하고 data/source에 승격할 수 있다.
6. 8작품은 Anchor 4 + Discovery 4를 추가한다. 현재 동결 50작품의 역할 수는 Anchor 18 / Bridge 20 / Discovery 12이며, 승격 후 58작품은 22 / 20 / 16이다. 최종 150작품 역할 목표를 Anchor 30 / Bridge 30 / Discovery 90으로 잡으면 남은 92작품은 Anchor 8 + Bridge 10 + Discovery 74다.

## 검증 해석

이 패킷은 source loader가 요구하는 파일 구성을 갖추되, 비자격 상태를 의도적으로 유지한다. CSV 스키마와 ISBN 체크섬, 17축 완전성, 근거 참조 무결성은 기계 검증 대상이다. EVIDENCE_NOT_HUMAN_REVIEWED 경고는 예상된 정직한 상태이며 오류로 숨기거나 검수 완료로 바꾸지 않는다.
