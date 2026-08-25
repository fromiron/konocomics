# Batch 005 text gap recovery round 5 — chunk 02

- 조사일 및 조회일: `2026-08-25`
- 대상: `batch-005/frozen-work-set.csv` positions `11–20`
- 평가 범위: `entry_1_3_volumes`
- `reviewedByHuman=false`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- terminal text SHA-256 before this round: `4de81646f0f479ab390505f41e087c34cb8adf3713d11817b423fcc290b853ed`
- terminal Genre SHA-256: `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de`
- terminal Theme SHA-256: `b833210238186abd46c6ff638ebbcd63fd39e681b1ad604952eb2e1c3f30e4dc`
- terminal Art SHA-256: `a579386129fe3754c15d083d1f1ad6e262bab3039eacb8c6814da26a71b0caff`

## 처리 경계

round 2–4 연구와 독립 QA, 최종 blocker adjudication, 현재 terminal CSV를 먼저 대조했다. 이전 `ACCEPT`, `REJECT`, `UNKNOWN`, 이미 known인 셀은 재제안하지 않았다. 이번 라운드는 blocker adjudication이 지목한 공식·정식 유통 권 1–3 경로의 텍스트와 서지 요약만 재조사했다. Genre 또는 작품 직업명으로 Axis를 자동 생성하지 않았고, 수상·플랫폼 장르 태그는 Factor 근거로 사용하지 않았다. Art 페이지는 존재 여부와 판본 연결 경로만 기록했으며 픽셀·페이지 표본을 만들거나 Art 값을 부여하지 않았다.

## 조사한 미사용 경로와 결과

| Pos | Work | 새로 확인한 경로 | 결과 |
| ---: | --- | --- | --- |
| 11 | ヨルムンガンド | [小学館eコミックストア 2巻](https://e-comi.shogakukan.co.jp/books/091570890000d0000000), [公式 reader](https://sc-portal.tameshiyo.me/9784091570895), published `2007-04-19` | 권 2의 휴가 중 암살자 습격과 총격은 기존 combat/darkness/pacing 범위와 겹친다. 잔여 progression/problemSolving/strategy 또는 comedy/mentalStress/romance/warmth의 Dictionary anchor를 직접 반복하지 않아 새 셀 없음. Reader는 JS 초기화 화면까지 확인했으나 본문 표본·Art는 열지 않음. |
| 12 | ボクラノキセキ | [BookLive 1巻 browser trial](https://booklive.jp/product/index/title_id/176973/vol_no/001), published `2012-08-31` (전자판) | 전쟁으로 멸망한 나라의 왕녀 전생 기억과 학교 부적응이라는 권 1 요약을 재확인했다. 이는 기존 mysteryReveal/darkness/mentalStress/characterArc 범위이며, 이전 QA에서 거부한 progression 재제안이나 warmth 재제안을 하지 않음. 전자판 말미의 추가 일러스트는 평가에서 제외. |
| 13 | おまかせ精霊 | [Renta 작품·권 1–3](https://renta.papy.co.jp/renta/sc/frm/item/4991/), metadata `2011-05-24` | 권 1의 정령연구회 권유·느슨한 활동과 권 2의 신규 회원·고문, 권 3의 다섯 번째 회원·부실 목표를 다시 확인했다. 이는 이미 accepted progression/pacing/relationshipStructure와 겹치며, 이전 rejected characterArc/comedy를 재제안하지 않음. 본문 구매는 앱 전용이라 Art 표본은 만들지 않음. |
| 14 | ニラメッコ | [BookLive 1巻](https://booklive.jp/product/index/title_id/20033480/vol_no/001), [白泉社 1巻](https://www.hakusensha.co.jp/comicslist/60421/), [白泉社 2巻](https://www.hakusensha.co.jp/comicslist/62179/), published `2021-06-16`, `2022-01-28` | 권 1의 5인 셰어하우스·상대방을 웃기려는 순수한 동기와 권 2의 직업적 자존심·온라인 비난·상대의 미래 걱정을 대조했다. 이 반복되는 유대와 직업 압박은 mixed warmth 후보를 만들지만 healing-core 4는 아니므로 `emotionalWarmth=2`를 제안한다. BookLive의 2022-02-15 みちゃみん·2022-02-06 はむぞう 리뷰와 Cmoa의 권 1 리뷰 페이지([Cmoa](https://www.cmoa.jp/title/223338/vol/1/), publishedAt not stated)는 공식 요약과 같은 “웃음과 무대 뒤 고뇌” 관찰을 보조 확인했으며, 리뷰만으로 값을 만들지 않았다. |
| 15 | 恋愛ラボ | [芳文社 まんがタイム 권 1–3](https://manga-time.com/comics/cart/mru.html), published `2008-03-07`, `2009-01-07`, `2009-07-07`; [권 3 trial](https://manga-time.com/comics/tameshiyomi/mru/c_03_1/) | 권 1의 학생회 비밀 연애 레슨, 권 2의 5인 연구 활동과 남학생 접촉, 권 3의 학생회 최대 위기라는 권간 목표·상황 변화를 확인했다. 이는 빠른 전개가 아닌 일반적인 Arc 변화이므로 `pacing=2`를 제안한다. 연애·개그·학생회는 이미 known Genre/Theme/Tone과 겹치며, solving/strategy/mystery/worldBuilding은 새로 만들지 않았다. |
| 16 | 銀のスプーン | [講談社 2巻](https://www.kodansha.co.jp/comic/products/0000044817), published `2011-06-13` | 어머니 입원 중 어려운 메뉴에 도전하고 고생하면서 요리에 익숙해지는 과정이 공식 권 소개에 직접 적혀 있다. 반복되는 제약 대응은 확인되지만 제약 분석·판단·해결 절차가 충분히 보이지 않으므로 `problemSolving=1`을 보수적 후보로 제안한다. 이전 rejected `worldBuilding`은 재제안하지 않는다. |
| 17 | おかめ日和 | [講談社 2巻](https://www.kodansha.co.jp/comic/products/0000043712), published `2007-11-13`; [권 1](https://www.kodansha.co.jp/comic/products/0000043658), published `2007-04-13` | 같은 침구 치료원에 만성 적자가 있고 야스코가 운영 자금을 마련하려 애쓴다는 권 2의 구체적인 문제와 목차를 확인했다. 반복되는 재정 문제에 대한 직접 대응은 `problemSolving=2` 후보, 단기 운영 자금 조정은 `strategy=2` 후보로 각각 기록한다. 둘 모두 하나의 연결된 공식 업무 상황에서 나온 낮은 범위 제안이며, worldBuilding은 단순 배경과 혼동하지 않아 제안하지 않았다. |
| 18 | 新黒沢 最強伝説 | [小学館 Big Comic BROS. 2巻](https://bigcomicbros.net/comics/30137/), published `2014-05-30`; [작품 소개](https://bigcomicbros.net/work/6183/) | 병원에서 아무도 모르게 퇴원한 뒤 혼자 거리로 나가고, 54세 무직·병후 상태에서 생존할 수 있는지가 공식 권 2에 명시된다. 이전 QA가 생존·무직을 mentalStress 또는 darkness로 바꾸지 않은 경계를 유지한다. 잔여 Narrative/ Tone anchor를 새로 직접 지지하지 않아 새 셀 없음. |
| 19 | カレチ | [講談社 2巻](https://www.kodansha.co.jp/comic/products/0000014109), published `2011-03-23` | 10개의 단편과 `誤乗`, `列車指令`, `車内巡回` 등 반복 업무 사건을 확인했다. 이미 accepted problemSolving=2와 workplace/historicalReconstruction Theme에 반영된 관찰이며, 단편의 승객·직원 다수가 복잡한 관계망이나 comedy/romance/mentalStress를 뜻하지 않는다. 새 셀 없음. |
| 20 | GREEN WORLDZ | [BookLive 2巻](https://booklive.jp/product/index/title_id/260905/vol_no/002), [Renta 2巻](https://renta.papy.co.jp/renta/sc/frm/item/70363/title/288866/), published `2014-08-08` | 유이를 향한 약속을 지키기 위해 싸우기로 결정하고 무기를 찾아 이와토비 일행과 지상으로 가는 목표, 식물이 밤에 멈추는 규칙과 그때의 위협을 확인했다. 직접 행동과 제약 대응은 `problemSolving=2`, 밤의 활동 규칙을 고려한 단기 이동·무기 탐색은 `strategy=2`, 반복되는 이와토비 일행은 고정 동료 구조로 `relationshipStructure=2`를 제안한다. 단, 공포·생존·전투는 기존 known darkness/mentalStress/Theme과 겹쳐 별도 Tone 값을 만들지 않았다. |

## 제안 셀

| Pos | Work | Axis | Proposed value | Confidence | Dictionary anchor와 bounded reasoning |
| ---: | --- | --- | ---: | ---: | --- |
| 14 | ニラメッコ | `emotionalWarmth` | 2 | 0.64 | 상대를 웃기려는 반복 동기, 5인 공동생활, 직업적 고뇌 속의 동료 관계가 mixed warmth를 지지한다. 직업 압박이 함께 있어 4가 아니다. 공식 권 요약이 주근거이고 두 독립 reviewer page는 보조 관찰이다. |
| 15 | 恋愛ラボ | `pacing` | 2 | 0.70 | 권 1–3에서 비밀 연구→대인 접촉→학생회 위기로 목표·상황이 Arc 단위로 변한다. 짧은 간격의 큰 상태 전환을 입증하지 못해 4가 아니다. |
| 16 | 銀のスプーン | `problemSolving` | 1 | 0.56 | 어려운 메뉴에 도전하고 고생하는 직접 대응은 0보다 높지만, 제약을 분석하고 해결하는 반복 절차는 공식 요약만으로 부족하다. 2로 올리지 않고 1 후보로 제한한다. 독립 QA가 부족하다고 판단하면 unknown 유지가 맞다. |
| 17 | おかめ日和 | `problemSolving` | 2 | 0.63 | 치료원의 만성 적자라는 반복 문제에 대해 야스코가 운영 자금을 마련하려는 직접 대응이 있다. 추상적 가정생활이 아니라 업무 운영 문제로 범위를 제한한다. |
| 17 | おかめ日和 | `strategy` | 2 | 0.58 | 단기 운영자금 조정이라는 전술적 계획 상황을 공식 권 소개가 직접 제시한다. 장기 정치·자원 운영 중심의 4는 아니다. |
| 20 | GREEN WORLDZ | `problemSolving` | 2 | 0.67 | 식물 지배 환경에서 싸우기로 결정하고 무기를 찾는 제약 대응이 권 2의 중심 행동으로 반복된다. 단순 전투 존재가 아니라 목표와 수단 선택을 근거로 했다. |
| 20 | GREEN WORLDZ | `strategy` | 2 | 0.58 | 식물의 활동 정지 시간이라는 규칙과 지상 이동·무기 탐색 목표를 함께 고려하는 단기 전술 범위다. 장기 계획이 확인되지 않아 4가 아니다. |
| 20 | GREEN WORLDZ | `relationshipStructure` | 2 | 0.60 | 권 2가 “イワトビ達”“アキラ達”라는 반복 집단과 함께 움직이는 고정 동료 구조를 명시한다. 복잡한 군상극 4는 제안하지 않는다. |

이 표는 연구 제안이며 terminal CSV에 반영하지 않았다. 기존 `known` 셀, 이전 accepted/rejected/unknown 셀, Genre/Theme 파일을 변경하지 않았다.

## 미확정 유지 및 소진 판단

- 11 ヨルムンガンド: 새 권 2 route는 공격·전투와 기존 값만 반복한다. `mentalStress=2`와 `emotionalWarmth=2`는 이전 QA에서 직접 반복 근거 부족으로 UNKNOWN이므로 재제안하지 않는다.
- 12 ボクラノキセキ: 권 1 전자판 route는 기존 mystery/darkness/mentalStress와 겹친다. progression 또는 warmth를 재제안하지 않는다.
- 13 おまかせ精霊: Renta의 권 1–3 줄거리는 이미 accepted progression/pacing/relationshipStructure와 동일하고, 플랫폼 comedy label은 Axis 근거가 아니다. characterArc/comedy를 재제안하지 않는다.
- 18 新黒沢 最強伝説: 병후·무직·노숙 생존은 이전 QA가 mentalStress/darkness 승격 근거로 인정하지 않은 범위다. 동일 셀을 재제안하지 않는다.
- 19 カレチ: 10개 단편의 업무 사건은 accepted problemSolving=2와 workplace Theme에 이미 반영됐다. 관계 수·직업 수를 relationshipStructure나 Tone 값으로 확장하지 않는다.

제안이 모두 독립 QA에서 거부되면 해당 셀은 기존 `unknown`을 유지한다. 아직 Art를 확인하지 않았으므로 Art unknown만으로 blocker를 만들지 않는다. source exhaustion 또는 `FACTOR_MODEL_INCOMPATIBLE` 결론도 이번 라운드에서 내리지 않는다.

## Gate recount (변경 전 terminal)

| Pos | Narrative | Tone | Genre | Theme | Art | Remaining text gap |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 11 | 3/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+1, T+2 |
| 12 | 3/6 | 4/7 | 1/1 | 1/1 | 0/4 | N+1, T+1 |
| 13 | 2/6 | 1/7 | 1/1 | 1/1 | 0/4 | N+2, T+4 |
| 14 | 0/6 | 4/7 | 1/1 | 1/1 | 0/4 | N+4, T+1 |
| 15 | 0/6 | 5/7 | 1/1 | 1/1 | 0/4 | N+4 |
| 16 | 3/6 | 5/7 | 1/1 | 1/1 | 0/4 | N+1 |
| 17 | 1/6 | 5/7 | 1/1 | 1/1 | 0/4 | N+3 |
| 18 | 1/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+3, T+2 |
| 19 | 4/6 | 2/7 | 1/1 | 1/1 | 0/4 | T+3 |
| 20 | 2/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+2, T+2 |

이번 라운드에는 terminal CSV를 변경하지 않았으므로 gate는 위와 동일하다. 모든 proposed value는 독립 QA와 adjudication 후에만 반영 가능하다.

## 경계와 무결성

- `data/staging/catalog-expansion/batches/batch-005/adjudication/text-final-chunk-02.csv`는 변경하지 않았다.
- Genre, Theme, Art, Pass A, source/provenance, overlay, registry, generated catalog, safety, identity, recommendation formula, Dictionary, Gold data는 변경하지 않았다.
- Art 표본·이미지 파일·픽셀 판정은 생성하지 않았다.
- 리뷰 원문은 사용자 UI에 복사하지 않았고, 제안에 사용한 경우에도 구체적 관찰만 요약했다.
- 이 문서는 모델 연구 기록이며 human validation이 아니다. `reviewedByHuman=false`를 유지한다.
