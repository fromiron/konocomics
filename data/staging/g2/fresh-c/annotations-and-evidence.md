# G2 fresh-c 주석 및 근거 기록

> 스냅샷 기준일: 2026-08-12. 이 묶음은 G2 패널 전 입후보 staging이며 최종 catalog 승인이 아니다.

## 운영 상태

- 정확히 30작품이며 역할은 Anchor 2, Bridge 3, Discovery 25다. 현재 50작품, reuse-eight, fresh-a, fresh-b, Slam Dunk·Nausicaa 보류 목록과 중복이 없다.
- 30작품 모두 annotationReviewMethod=unreviewed, reviewedByHuman=false다. onboardingEligible=false, recommendationEligible=false, libraryOnly=true로 유지했다.
- intended-eligibility.csv는 승인 뒤의 슬롯 의도만 기록하며 현재 자격을 활성화하지 않는다. Anchor 2작품만 intendedOnboardingEligible=true이고, 30작품 모두 intendedRecommendationEligible=true다.
- Narrative/Tone/Theme는 1차 출판사 서지·공식 소개와 초반 1~3권 또는 라이선스 제1화 미리보기를 대조한 오프라인 모델 초벌이다.
- Art는 Microsoft Edge remote CDP로 Kodansha USA가 연결한 Omoi 리더의 서로 다른 내부 페이지 6쪽, 2개 이상 맥락을 작품마다 관찰했다. 페이지 번호·판본 연결·한계는 evidence/art-evidence-manifest.csv가 정본이다.
- motionImpact는 30작품 모두 unknown이다. 정지 페이지에서 동작이 없다고 단정하거나 notApplicable로 치환하지 않았으며, 대표 연속 물리 동작 시퀀스를 별도로 확정하지 않았기 때문이다.
- reviewAverage와 reviewCount는 권위 있는 동시점 관찰값이 없어 비웠다. catalogAverageRating은 현재 소스 패킷과 동일한 4.367959183673469를 유지했다.

## 파일과 행 수

| 파일                               | 데이터 행 | 의미                                   |
| ---------------------------------- | --------: | -------------------------------------- |
| works.csv                          |        30 | 비활성·미검수 작품 메타데이터          |
| volumes.csv                        |        30 | 일본어 표준 대표 1권                   |
| factors.csv                        |       510 | 작품당 17축; motionImpact 30건 unknown |
| themes.csv                         |       102 | 초벌 Theme centrality                  |
| aliases.csv                        |        30 | 영문 검색 별칭                         |
| recommendation-context.csv         |        30 | 역할·본편 권수; 평점 비움              |
| evidence/evidence.csv              |        90 | 작품당 서지·비-Art·Art 근거            |
| evidence/art-evidence-manifest.csv |       120 | 작품당 Art 4축 판정과 exact refs       |
| intended-eligibility.csv           |        30 | 승인 후 의도 상태; 런타임 입력 아님    |

## 권수와 연재 상태 스냅샷

| 작품                                     | 본편 권수 | 상태      | 1차 출판사 확인 경로                                                    |
| ---------------------------------------- | --------: | --------- | ----------------------------------------------------------------------- |
| cardcaptor-sakura                        |        12 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000031602) |
| initial-d                                |        48 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000006854) |
| cells-at-work                            |         6 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000045249) |
| xxxholic                                 |        19 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000008128) |
| sailor-moon                              |        18 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000027190) |
| showa-genroku-rakugo-shinju              |        10 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000046395) |
| wave-listen-to-me                        |        12 | ongoing   | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000047417) |
| police-in-a-pod                          |        23 | hiatus    | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000115816) |
| the-fable                                |        22 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000014927) |
| ace-of-the-diamond                       |        47 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000012120) |
| days                                     |        42 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000017679) |
| all-rounder-meguru                       |        19 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000038657) |
| perfect-world                            |        12 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000036407) |
| tokyo-tarareba-girls                     |         9 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000036394) |
| flying-witch                             |        15 | ongoing   | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000019074) |
| witchcraft-works                         |        17 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000029770) |
| my-home-hero                             |        26 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000023007) |
| beck                                     |        34 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000035236) |
| gto                                      |        25 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000005708) |
| tomorrows-joe                            |        20 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000002420) |
| parasyte                                 |        10 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000029944) |
| princess-jellyfish                       |        17 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000036206) |
| life-lessons-with-uramichi-oniisan       |        12 | ongoing   | [1차 출판사 근거](https://www.ichijinsha.co.jp/pr/uramichi/)            |
| shangri-la-frontier                      |        27 | ongoing   | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000345557) |
| rent-a-girlfriend                        |        46 | ongoing   | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000023140) |
| inuyashiki                               |        10 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000039011) |
| island-in-a-puddle                       |         5 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000338457) |
| mf-ghost                                 |        23 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000052840) |
| my-dearest-self-with-malice-aforethought |        11 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000313244) |
| the-golden-sheep                         |         3 | completed | [1차 출판사 근거](https://www.kodansha.co.jp/comic/products/0000115420) |

권수는 2026-08-12 현재 일본어 본편 단행본만 세며 특장판·전자 합본·외전·팬북·소설판을 합산하지 않았다. 2026-08-12 이후 발매 예정권은 세지 않았다.

## 작품별 초벌 판단

13개 비-Art 축은 factor-dictionary 순서와 0~4 값을 그대로 적었다. Art 값은 artRealism/artDensity/visualSoftness 순서다.

| 작품                                                                | 역할      | Narrative/Tone 13축                                                                                                                | Theme                                                                                     | Art                   | 초벌 판단 근거                                                                                                           |
| ------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| cardcaptor-sakura / カードキャプターさくら                          | anchor    | 성장 3 / 문제해결 2 / 전략 1 / 속도 3 / 미스터리 2 / 세계관 3 / 인물 3 / 관계 3 / 코미디 3 / 어둠 1 / 압박 1 / 로맨스 2 / 따뜻함 4 | adventure(2), combat(1), school(2), foundFamily(2)                                        | 1/3/4, motion unknown | 카드 탐색과 마법 사건 해결, 학교 관계가 병행되어 성장·관계·따뜻함을 높이고 어둠과 압박은 낮게 두었다.                    |
| initial-d / 頭文字Ｄ                                                | anchor    | 성장 4 / 문제해결 2 / 전략 2 / 속도 3 / 미스터리 1 / 세계관 3 / 인물 3 / 관계 2 / 코미디 2 / 어둠 1 / 압박 2 / 로맨스 2 / 따뜻함 3 | adventure(1), tournament(1), school(1), sportsCompetition(2), foundFamily(1)              | 3/3/1, motion unknown | 주행 기술의 숙련과 반복 대결이 핵심 보상이라 성장·경쟁을 높이고, 차량·도로 규칙이 세계 이해를 보조한다고 판정했다.       |
| cells-at-work / はたらく細胞                                        | bridge    | 성장 2 / 문제해결 2 / 전략 1 / 속도 4 / 미스터리 1 / 세계관 4 / 인물 2 / 관계 3 / 코미디 3 / 어둠 2 / 압박 1 / 로맨스 0 / 따뜻함 3 | combat(2), workplace(2), foundFamily(1), exploration(1)                                   | 2/4/2, motion unknown | 신체 기관을 직장과 전장으로 치환한 에피소드형 구조라 속도·세계 규칙·전투·직장을 높이고 로맨스는 없음으로 판정했다.       |
| xxxholic / ×××ＨＯＬｉＣ                                            | bridge    | 성장 1 / 문제해결 3 / 전략 1 / 속도 2 / 미스터리 4 / 세계관 4 / 인물 4 / 관계 3 / 코미디 2 / 어둠 3 / 압박 3 / 로맨스 1 / 따뜻함 2 | investigation(2), school(1), foundFamily(1), exploration(1)                               | 2/4/3, motion unknown | 소원과 대가를 둘러싼 괴이 사례가 단서를 누적하고 인물 내면을 드러내므로 미스터리·세계관·인물 변화를 높게 두었다.         |
| sailor-moon / 美少女戦士セーラームーン                              | bridge    | 성장 4 / 문제해결 2 / 전략 2 / 속도 4 / 미스터리 3 / 세계관 4 / 인물 4 / 관계 3 / 코미디 2 / 어둠 3 / 압박 3 / 로맨스 4 / 따뜻함 4 | adventure(2), combat(2), school(2), foundFamily(2)                                        | 1/2/4, motion unknown | 변신 전투, 동료 집결, 과거 정체와 연애가 함께 진행 보상이어서 성장·세계관·인물·로맨스·따뜻함을 높게 두었다.              |
| showa-genroku-rakugo-shinju / 昭和元禄落語心中                      | discovery | 성장 3 / 문제해결 2 / 전략 1 / 속도 2 / 미스터리 2 / 세계관 3 / 인물 4 / 관계 4 / 코미디 2 / 어둠 2 / 압박 3 / 로맨스 3 / 따뜻함 3 | workplace(2), foundFamily(1), historicalReconstruction(2)                                 | 2/2/3, motion unknown | 낙어 수련과 사제·세대 관계, 쇼와 시대 예능사의 변화가 중심이어서 인물·군상·직업·역사 맥락을 높게 두었다.                 |
| wave-listen-to-me / 波よ聞いてくれ                                  | discovery | 성장 1 / 문제해결 2 / 전략 1 / 속도 3 / 미스터리 1 / 세계관 3 / 인물 4 / 관계 4 / 코미디 4 / 어둠 1 / 압박 2 / 로맨스 2 / 따뜻함 2 | workplace(2), foundFamily(1)                                                              | 3/3/1, motion unknown | 즉흥 라디오 방송과 직장·인간관계의 충돌이 보상이라 인물·군상·코미디·직장을 높이고 장기 성장 수치는 낮게 두었다.          |
| police-in-a-pod / ハコヅメ～交番女子の逆襲～                        | discovery | 성장 2 / 문제해결 3 / 전략 2 / 속도 3 / 미스터리 2 / 세계관 3 / 인물 4 / 관계 4 / 코미디 4 / 어둠 2 / 압박 2 / 로맨스 1 / 따뜻함 3 | investigation(2), workplace(2), foundFamily(1)                                            | 2/2/3, motion unknown | 교번 업무와 사건 대응을 동료 군상 코미디로 풀어 문제해결·인물·관계·직장·조사를 높게 두었다.                              |
| the-fable / ザ・ファブル                                            | discovery | 성장 2 / 문제해결 4 / 전략 4 / 속도 4 / 미스터리 2 / 세계관 3 / 인물 3 / 관계 3 / 코미디 4 / 어둠 4 / 압박 2 / 로맨스 1 / 따뜻함 2 | combat(2), investigation(1), workplace(1), foundFamily(1)                                 | 4/3/1, motion unknown | 전문 암살자가 살인을 금지당한 채 위기를 계산하고 은폐하는 구조라 문제해결·전략·속도·어둠과 역설적 코미디를 높게 두었다.  |
| ace-of-the-diamond / ダイヤのＡ                                     | discovery | 성장 4 / 문제해결 3 / 전략 3 / 속도 3 / 미스터리 1 / 세계관 3 / 인물 4 / 관계 4 / 코미디 3 / 어둠 1 / 압박 3 / 로맨스 1 / 따뜻함 4 | tournament(2), school(2), sportsCompetition(2), foundFamily(2)                            | 2/2/2, motion unknown | 투수 기술 습득, 팀 내 경쟁과 대회가 반복되어 성장·전략·인물·군상·경쟁·따뜻함을 높게 두었다.                              |
| days / ＤＡＹＳ                                                     | discovery | 성장 4 / 문제해결 2 / 전략 2 / 속도 3 / 미스터리 1 / 세계관 2 / 인물 4 / 관계 4 / 코미디 2 / 어둠 1 / 압박 3 / 로맨스 1 / 따뜻함 4 | tournament(2), school(2), sportsCompetition(2), foundFamily(2)                            | 2/3/3, motion unknown | 초보의 축구 입문과 팀 훈련·대회가 중심이라 성장·인물·군상·경쟁·발견된 가족의 온기를 높게 두었다.                         |
| all-rounder-meguru / オールラウンダー廻                             | discovery | 성장 4 / 문제해결 3 / 전략 3 / 속도 2 / 미스터리 1 / 세계관 3 / 인물 4 / 관계 3 / 코미디 2 / 어둠 2 / 압박 3 / 로맨스 2 / 따뜻함 3 | combat(2), martialArts(2), tournament(2), school(1), sportsCompetition(2), foundFamily(1) | 3/2/1, motion unknown | 종합격투기 기술 수련과 실전 전술, 과거 관계가 함께 축적되어 성장·문제해결·전략·인물·무술 경쟁을 높게 두었다.             |
| perfect-world / パーフェクトワールド                                | discovery | 성장 2 / 문제해결 2 / 전략 1 / 속도 2 / 미스터리 1 / 세계관 2 / 인물 4 / 관계 3 / 코미디 2 / 어둠 2 / 압박 4 / 로맨스 4 / 따뜻함 3 | workplace(1), foundFamily(1)                                                              | 2/2/4, motion unknown | 장애와 접근성, 재회한 성인들의 관계 선택이 중심이어서 인물·정신적 압박·로맨스를 높이고 사건 속도는 낮게 두었다.          |
| tokyo-tarareba-girls / 東京タラレバ娘                               | discovery | 성장 1 / 문제해결 2 / 전략 1 / 속도 3 / 미스터리 1 / 세계관 2 / 인물 4 / 관계 4 / 코미디 4 / 어둠 1 / 압박 3 / 로맨스 4 / 따뜻함 3 | workplace(1), foundFamily(2)                                                              | 2/2/3, motion unknown | 성인 여성 친구들의 일·연애 선택과 자기반성이 반복되어 인물·군상·코미디·로맨스·발견된 가족을 높게 두었다.                 |
| flying-witch / ふらいんぐうぃっち                                   | discovery | 성장 1 / 문제해결 2 / 전략 1 / 속도 2 / 미스터리 2 / 세계관 4 / 인물 4 / 관계 3 / 코미디 4 / 어둠 0 / 압박 0 / 로맨스 1 / 따뜻함 4 | school(1), foundFamily(2), exploration(1)                                                 | 1/2/4, motion unknown | 농촌 일상 속 작은 마법과 가족·이웃 관계가 핵심이어서 세계관·인물·코미디·따뜻함을 높이고 어둠과 압박은 없음으로 판정했다. |
| witchcraft-works / ウィッチクラフトワークス                         | discovery | 성장 3 / 문제해결 2 / 전략 2 / 속도 4 / 미스터리 3 / 세계관 4 / 인물 3 / 관계 3 / 코미디 3 / 어둠 3 / 압박 2 / 로맨스 2 / 따뜻함 3 | adventure(1), combat(2), school(2), foundFamily(1)                                        | 2/3/2, motion unknown | 학교를 무대로 한 마녀 세력과 규칙, 빠른 전투·정체 단서가 반복되어 속도·세계관·전투·학교를 높게 두었다.                   |
| my-home-hero / マイホームヒーロー                                   | discovery | 성장 2 / 문제해결 4 / 전략 4 / 속도 4 / 미스터리 4 / 세계관 3 / 인물 4 / 관계 3 / 코미디 1 / 어둠 4 / 압박 4 / 로맨스 1 / 따뜻함 2 | combat(1), survival(2), investigation(2), revenge(1), foundFamily(2)                      | 3/3/1, motion unknown | 가족을 지키기 위한 살인 은폐와 범죄 조직의 추적이 맞물려 문제해결·전략·미스터리·어둠·압박을 높게 두었다.                 |
| beck / ＢＥＣＫ                                                     | discovery | 성장 4 / 문제해결 2 / 전략 2 / 속도 3 / 미스터리 1 / 세계관 3 / 인물 4 / 관계 4 / 코미디 3 / 어둠 2 / 압박 3 / 로맨스 3 / 따뜻함 4 | school(1), workplace(1), foundFamily(2)                                                   | 2/2/2, motion unknown | 밴드 결성과 연주 숙련, 동료·연애·공연 압박이 성장 보상이라 성장·인물·군상·따뜻함을 높게 두었다.                          |
| gto / ＧＴＯ                                                        | discovery | 성장 2 / 문제해결 2 / 전략 2 / 속도 4 / 미스터리 1 / 세계관 2 / 인물 4 / 관계 4 / 코미디 4 / 어둠 2 / 압박 2 / 로맨스 3 / 따뜻함 3 | combat(1), school(2), workplace(2), foundFamily(1)                                        | 3/4/1, motion unknown | 교사가 학생 문제에 파격적으로 개입하는 에피소드가 빠르게 전개되어 속도·인물·군상·코미디·학교·직장을 높게 두었다.         |
| tomorrows-joe / あしたのジョー                                      | discovery | 성장 4 / 문제해결 2 / 전략 3 / 속도 3 / 미스터리 1 / 세계관 3 / 인물 4 / 관계 4 / 코미디 2 / 어둠 3 / 압박 4 / 로맨스 1 / 따뜻함 3 | combat(2), martialArts(2), tournament(2), sportsCompetition(2), foundFamily(1)            | 2/3/1, motion unknown | 복싱 수련·대결과 빈곤·자기파괴가 함께 누적되어 성장·전략·인물·정신적 압박·무술 경쟁을 높게 두었다.                       |
| parasyte / 寄生獣                                                   | discovery | 성장 3 / 문제해결 3 / 전략 2 / 속도 4 / 미스터리 3 / 세계관 4 / 인물 4 / 관계 3 / 코미디 1 / 어둠 4 / 압박 4 / 로맨스 2 / 따뜻함 2 | combat(2), survival(2), investigation(2), school(1)                                       | 3/3/1, motion unknown | 기생 생물의 규칙을 알아내며 생존·전투하고 인간성을 재검토하므로 속도·세계관·인물·어둠·압박을 높게 두었다.                |
| princess-jellyfish / 海月姫                                         | discovery | 성장 2 / 문제해결 3 / 전략 2 / 속도 3 / 미스터리 2 / 세계관 3 / 인물 4 / 관계 4 / 코미디 4 / 어둠 1 / 압박 3 / 로맨스 4 / 따뜻함 4 | crafting(2), workplace(1), foundFamily(2)                                                 | 1/3/4, motion unknown | 공동주택의 여성들과 패션 제작·재개발 대응, 연애가 얽혀 인물·군상·코미디·로맨스·발견된 가족을 높게 두었다.                |
| life-lessons-with-uramichi-oniisan / うらみちお兄さん               | discovery | 성장 1 / 문제해결 1 / 전략 1 / 속도 2 / 미스터리 1 / 세계관 2 / 인물 4 / 관계 4 / 코미디 4 / 어둠 2 / 압박 3 / 로맨스 1 / 따뜻함 2 | workplace(2), foundFamily(1)                                                              | 2/2/3, motion unknown | 어린이 방송의 밝은 표면과 출연진의 피로·냉소가 대비되어 인물·군상·코미디·직장과 정신적 압박을 높게 두었다.               |
| shangri-la-frontier / シャングリラ・フロンティア                    | discovery | 성장 4 / 문제해결 4 / 전략 3 / 속도 4 / 미스터리 3 / 세계관 4 / 인물 3 / 관계 3 / 코미디 3 / 어둠 2 / 압박 2 / 로맨스 1 / 따뜻함 3 | adventure(2), combat(2), exploration(2)                                                   | 2/3/2, motion unknown | 게임 규칙 분석, 빌드와 보스 공략이 반복 보상이라 성장·문제해결·속도·세계관·모험·전투·탐사를 높게 두었다.                 |
| rent-a-girlfriend / 彼女、お借りします                              | discovery | 성장 1 / 문제해결 2 / 전략 1 / 속도 3 / 미스터리 2 / 세계관 2 / 인물 4 / 관계 4 / 코미디 4 / 어둠 1 / 압박 4 / 로맨스 4 / 따뜻함 2 | school(2), workplace(1), foundFamily(1)                                                   | 2/2/3, motion unknown | 대여 연애의 거짓말과 다중 관계가 반복적으로 긴장을 만들므로 인물·군상·코미디·압박·로맨스를 높게 두었다.                  |
| inuyashiki / いぬやしき                                             | discovery | 성장 3 / 문제해결 2 / 전략 2 / 속도 4 / 미스터리 2 / 세계관 4 / 인물 4 / 관계 3 / 코미디 1 / 어둠 4 / 압박 4 / 로맨스 1 / 따뜻함 3 | combat(2), survival(1)                                                                    | 4/4/1, motion unknown | 기계 신체를 얻은 두 인물의 상반된 선택과 폭력이 확대되어 속도·세계관·인물·어둠·압박·전투를 높게 두었다.                  |
| island-in-a-puddle / 水溜まりに浮かぶ島                             | discovery | 성장 1 / 문제해결 4 / 전략 3 / 속도 4 / 미스터리 4 / 세계관 3 / 인물 4 / 관계 3 / 코미디 1 / 어둠 4 / 압박 4 / 로맨스 1 / 따뜻함 2 | survival(2), investigation(2), foundFamily(2)                                             | 2/3/2, motion unknown | 몸이 뒤바뀐 아이와 범죄자의 생존·추적이 핵심이라 문제해결·전략·속도·미스터리·어둠·압박을 높게 두었다.                    |
| mf-ghost / ＭＦゴースト                                             | discovery | 성장 4 / 문제해결 3 / 전략 4 / 속도 3 / 미스터리 2 / 세계관 4 / 인물 3 / 관계 4 / 코미디 2 / 어둠 2 / 압박 3 / 로맨스 2 / 따뜻함 3 | tournament(2), sportsCompetition(2)                                                       | 3/3/1, motion unknown | 차량 성능 차이를 주행 전략과 코스 이해로 극복하는 경주가 중심이라 성장·전략·세계관·군상·경쟁을 높게 두었다.              |
| my-dearest-self-with-malice-aforethought / 親愛なる僕へ殺意をこめて | discovery | 성장 1 / 문제해결 4 / 전략 3 / 속도 4 / 미스터리 4 / 세계관 3 / 인물 4 / 관계 4 / 코미디 1 / 어둠 4 / 압박 4 / 로맨스 3 / 따뜻함 1 | investigation(2), revenge(2), school(1)                                                   | 3/3/1, motion unknown | 기억 공백과 연쇄살인·정체 단서를 추적하는 구조라 문제해결·미스터리·속도·군상·어둠·압박·복수를 높게 두었다.               |
| the-golden-sheep / 金のひつじ                                       | discovery | 성장 1 / 문제해결 2 / 전략 1 / 속도 2 / 미스터리 2 / 세계관 2 / 인물 4 / 관계 4 / 코미디 2 / 어둠 2 / 압박 4 / 로맨스 2 / 따뜻함 3 | school(2), foundFamily(2)                                                                 | 2/2/4, motion unknown | 고향에 돌아온 청소년들의 우정 균열과 회복이 중심이어서 인물·군상·정신적 압박·학교·발견된 가족을 높게 두었다.             |

## 근거 경계와 남은 검수

1. works.csv와 volumes.csv의 제목·저자·출판사·대표 ISBN·초판일은 ev-g2-fresh-c-bib-*에 연결했다.
2. 13개 비-Art 축과 Theme는 작품별 ev-g2-fresh-c-annotation-*에 연결했다. 승인 패널은 factor-dictionary의 0/2/4 기준과 경계값 1/3을 다시 판정해야 한다.
3. 정적 Art 3축과 motionImpact=unknown은 ev-g2-fresh-c-art-*에 연결했다. 각 정적 축은 art-evidence-manifest.csv의 exact ref 6개와 2개 이상 맥락을 공동 근거로 삼는다.
4. 번역 글자는 artDensity에서 제외했다. 표지·홍보 이미지·영상 프레임은 내부 페이지 근거로 사용하지 않았다.
5. 합법적 미리보기 제공 범위는 바뀔 수 있으므로 승격 직전 URL·chapterId·page count를 다시 확인해야 한다.
6. 현재 패킷은 source loader 호환 staging이다. 로더·검증 통과는 사람 또는 사용자 승인 모델 패널의 주석 승인을 대신하지 않는다.
7. 승인 뒤에만 annotationReviewMethod·annotationReviewedAt·annotationReviewReference와 eligibility를 갱신하고 data/source 승격을 검토할 수 있다.
