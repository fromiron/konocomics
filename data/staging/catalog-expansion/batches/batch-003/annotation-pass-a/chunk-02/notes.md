# Batch 003 Pass A 주석 메모 — chunk 02

## 초안 경계

- 주석자: Local Codex subagent `batch003_annotation_02`
- 단계: Pass A 주석 초안만 수행
- 범위: 동결 순번 11–20, `entry_1_3_volumes`
- 방법: `promotion-evidence-v2`, 공식 텍스트 우선
- `reviewedByHuman`: `false`
- 기존 Gold, source Factor 행, recommendation context, 추천 결과는 보지 않았다.
- catalog role, recommendation context, eligibility, promotion, safety, identity 결론은 내리지 않았다.
- 동결 research가 요구하는 조건을 충족한 보조 유저평 packet이 없으므로 유저평은 이 초안에 반영하지 않았다.
- 봉인된 Batch 003 generic packet에 재결속했다. `candidateSha256`은 `2277f22c0c0f4b04815801059a4faca0db316d9de5efe1027cb3221725c9c410`, manifest SHA-256은 `2425deaaa1672ba12f089d3a4633b2cef86bb610980fb41506c8f73e4fe5bdb3`, PAYLOAD SHA-256은 `b9e33aafa0456e2cc863a1230de7173eb24ae268a8a50d08a3c9b37ccfac8bdf`다.

## 동결 입력 식별자

| 입력                                        | SHA-256                                                            |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `frozen-work-set.csv`                       | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `factor-dictionary.md`                      | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `annotation-guide.md`                       | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `research/chunk-02.md`                      | `7c59174ec97cc10922aabc09208f19e04e74ea6a852734cb9dbdf77ebdc5add5` |

## Art 상태 종결

동결 research에는 판본과 연결된 공식 내부 페이지 표본이 없다. 아래 모든 작품은 판독 가능 표본 0쪽, 서로 다른 장면 맥락 0개이며 페이지 참조와 이미지 SHA-256도 없다. 미리보기 접근 불가를 추론한 것이 아니라, 기준을 충족하는 표본 packet으로 판독하지 않은 상태다. 따라서 `motionImpact`를 포함한 Art 4축을 모두 명시적 `unknown`으로 종결했다. 초반 내부 페이지를 확인하지 않았으므로 `notApplicable`도 판단하지 않았다.

| workId                      | 작품                       | 시도 범위와 공식 URL                                                                                                                       | 판독 쪽수 | 장면 맥락 | 표본 SHA-256 | 결과              |
| --------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------: | --------: | ------------ | ----------------- |
| `work-29806fe5f9633b940747` | 暗殺教室                   | 1권 ISBN `9784088705965`, [集英社](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870596-5)                            |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-319e39a597d16251efc9` | 乱と灰色の世界             | 1권 ISBN `9784047261457`, [KADOKAWA](https://www.kadokawa.co.jp/product/200908000223/)                                                     |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-3ba6e8e3cfdec674eae3` | 劇光仮面                   | 1권 ISBN `9784098613632`, [小学館](https://www.shogakukan.co.jp/books/09861363)                                                            |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-40ea287aae6305289cf6` | その着せ替え人形は恋をする | 1권 ISBN `9784757559202`, [スクウェア・エニックス](https://magazine.jp.square-enix.com/top/comics/detail/9784757559202/)                   |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-550854424fc9cc94d585` | 高杉さん家のおべんとう     | 1권 ISBN `9784040661001`; 판본 계보 미확정, [KADOKAWA](https://comic-walker.com/detail/KC_000801_S)                                        |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-5baea1ce0e7e74df34b9` | 刻刻                       | 1권 ISBN `9784063728224`, [講談社](https://www.kodansha.co.jp/comic/products/0000013948)                                                   |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-672862529a341488245b` | BUTTER！！！               | 1권 ISBN `9784063106824`, [講談社](https://www.kodansha.co.jp/comic/products/0000029740)                                                   |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-680837b0db4ec9d2932c` | トクサツガガガ             | 1권 ISBN `9784091866066`, [小学館](https://www.shogakukan.co.jp/books/09186606)                                                            |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-724c064d491faf4c7414` | もやしもん                 | 원판 1권 ISBN `9784063521061`; 신장판과 본편이 같다는 edition lead만 존재, [講談社](https://www.kodansha.co.jp/comic/products/0000038500)  |         0 |         0 | 없음         | Art 4축 `unknown` |
| `work-78d44d381562e37dd94a` | きょうは会社休みます。     | 종이 1권 ISBN과 JDCN record의 직접 재결속 미완료, [集英社](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846769846769315501) |         0 |         0 | 없음         | Art 4축 `unknown` |

임시 이미지는 만들거나 커밋하지 않았다. Local Codex는 픽셀 판정을 하지 않았고, 이 텍스트 전용 초안에는 Gemini Art 정족수를 호출하지 않았다.

## URL 기반 주석 근거

### `work-29806fe5f9633b940747` — 暗殺教室

- 공식 [1권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870596-5), [2권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870604-7), [3권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870633-7)이 교실 암살 임무, 외부 암살자, 수학여행 구출 사건을 반복해 보여 준다. 일반적인 Arc 변화인 `pacing=2`, 기능적 전제인 `worldBuilding=2`, 반복되는 교사·학급 집단인 `relationshipStructure=2`, 진지한 위험인 `darkness=2`, school·combat Theme를 지지한다.
- [공식 수상 심사평](https://www.mangataisho.com/data/2013/comment2013.pdf)이 코믹한 제시와 학생을 돌보는 교사를 반복해 `comedy=3`, 균형 잡힌 인물 비중과 혼합된 온기를 보조한다. 지속적 정신 압박, 로맨스, 성장 보상, 전략, 미스터리 구조는 확정하지 못해 `unknown`으로 남겼다.

### `work-319e39a597d16251efc9` — 乱と灰色の世界

- 공식 [1권](https://www.kadokawa.co.jp/product/200908000223/)과 [2권](https://www.kadokawa.co.jp/product/201008000181/)은 한 문장짜리 시리즈 소개다. [3권](https://www.kadokawa.co.jp/product/301709000036/)만 마법 가족, 아이의 규칙 위반, 가족의 비밀을 추가한다. 따라서 기능적 마법 설정과 고정 가족 관계 구조만 지지한다.
- [공식 수상 심사평](https://www.mangataisho.com/data/2012/mantai_comment2012.pdf)이 아이 시점, 마법 가족, 코미디를 반복해 중간 수준의 인물 비중과 코미디를 보조한다. 심사위원별 범위가 일정하지 않아 Theme, 극단값, pacing, darkness, romance, warmth는 확정하지 않았다.

### `work-3ba6e8e3cfdec674eae3` — 劇光仮面

- 공식 [1권](https://www.shogakukan.co.jp/books/09861363), [2권](https://www.shogakukan.co.jp/books/09861506), [3권](https://www.shogakukan.co.jp/books/09861744)이 주인공의 자기인식, 과거 의상 제작 집단, 현재 재판, 새 가면 도전자를 연결한다. 반복적인 상태 전환은 `pacing=3`, 책임과 집념은 `characterArcWeight=3`, 범죄와 재판은 중간 수준의 darkness와 mentalStress를 지지한다.
- [공식 수상 심사평](https://www.mangataisho.com/data/2023/comment2023.pdf)이 특촬 역사, 의상 제작 집념, 현실·허구 경계, 고립, 2권의 급전개를 반복한다. `worldBuilding=3`, crafting centrality 2를 지지하며, 범죄 대응과 도전은 combat centrality 1까지만 지지한다. 단서·공개 구조나 안정된 집단 구도는 드러나지 않아 `unknown`이다.

### `work-40ea287aae6305289cf6` — その着せ替え人形は恋をする

- 공식 [1권](https://magazine.jp.square-enix.com/top/comics/detail/9784757559202/), [2권](https://magazine.jp.square-enix.com/top/comics/detail/9784757559219/), [3권](https://magazine.jp.square-enix.com/top/comics/detail/9784757561380/)이 의상 제작, 두 사람의 협업, 행사, 감정 변화, 새 협력자를 반복한다. 점진적 progression, 일반적 Arc pacing, 핵심 두 사람, 높은 인물·관계 보상, romance·warmth, crafting centrality 2를 지지한다.
- [공식 수상 심사평](https://www.mangataisho.com/archives/2019/01/085.html)이 대비되는 두 학생, 공동 제작, 상호 호감, 관계 변화를 교차 확인한다. comedy, darkness, 지속적 mentalStress, strategy, mystery는 확정하지 않는다.

### `work-550854424fc9cc94d585` — 高杉さん家のおべんとう

- [공식 작품 페이지](https://comic-walker.com/detail/KC_000801_S)가 보호자 관계, 서툰 동거, 도시락을 통한 소통을 밝힌다. 정식 유통 [1–3권 페이지](https://www.cmoa.jp/title/31428/vol/1/)는 대학 취업, 사회 적응, 출생 비밀을 추가하지만 출판사 권 페이지에 줄거리가 없어 보조 근거로만 썼다.
- [공식 수상 심사평](https://www.mangataisho.com/archives/2013/01/post-23.html)이 음식으로 전달되는 감정과 관계 거리 변화를 반복하지만 4권이 섞였을 수 있다. 공식 작품 전제만으로 높은 characterArcWeight, 핵심 두 사람, warmth, cooking centrality 2, 새 가정 형성인 foundFamily centrality 2를 지지한다. 3권 출생 비밀은 `mysteryReveal=2`까지만 지지하며 pacing과 romance는 확정하지 않는다.

### `work-5baea1ce0e7e74df34b9` — 刻刻

- 공식 [1권](https://www.kodansha.co.jp/comic/products/0000013948), [2권](https://www.kodansha.co.jp/comic/products/0000013949), [3권](https://www.kodansha.co.jp/comic/products/0000014049)이 시간 제한 구출, 정지 세계 규칙, 서로 다른 능력, 가족·종교 집단 대립, 추격, 기원, 실험을 반복한다. 중간 수준 progression·problemSolving, 제한된 단기 strategy, 빠른 pacing, 강한 reveal·worldBuilding, 여러 집단 관계, darkness·mentalStress, combat·survival을 지지한다.
- [공식 수상 심사평](https://www.mangataisho.com/archives/2011/12/194.html)이 점차 공개되는 규칙과 빠르고 예측하기 어려운 긴장을 교차 확인한다. comedy와 romance는 판단하지 않으며, 구출 동기는 혼합된 warmth까지만 지지한다.

### `work-672862529a341488245b` — BUTTER！！！

- 공식 [1권](https://www.kodansha.co.jp/comic/products/0000029740), [2권](https://www.kodansha.co.jp/comic/products/0000029780), [3권](https://www.kodansha.co.jp/comic/products/0000029838)이 춤 연습, 파트너 향상, 공개 공연 공포, 체형 조롱, 여러 부원의 대인 장애를 반복한다. 높은 progression·characterArcWeight, 일반적 Arc pacing, 고정 동아리, 지속적 mentalStress와 warmth, school centrality 2를 지지한다. `problemSolving=1`은 분석·전략보다 감정적·직접 대응이 중심이고 일부 실무 대응이 섞인 경계값이다.
- [공식 수상 심사평](https://www.mangataisho.com/data/2012/mantai_comment2012.pdf)이 노력, 우정, 몰입을 교차 확인한다. comedy, romance, mystery 또는 초반 sportsCompetition은 확정하지 않았다.

### `work-680837b0db4ec9d2932c` — トクサツガガガ

- 공식 [1권](https://www.shogakukan.co.jp/books/09186606), [2권](https://www.shogakukan.co.jp/books/09186810), [3권](https://www.shogakukan.co.jp/books/09187060)이 직장에서 숨기는 팬 정체성, 노출 공포, 작은 일상 팬 활동, 늘어나는 팬 관계, 영웅의 말을 일상 문제에 적용하는 구조를 반복한다. 점진적 사회 progression, 직접·유추 혼합 problemSolving, 낮은 상태 변화 pacing, 팬 문화 worldBuilding, 높은 characterArcWeight, 고정 관계 집단, 지속적 mentalStress, workplace centrality 2를 지지한다.
- [공식 수상 심사평](https://www.mangataisho.com/data/2016/comment2016.pdf)이 팬 경험과 일상 문제 구조를 교차 확인하지만 1–3권을 넘을 수 있다. Art 값에는 쓰지 않았고 comedy, darkness, romance도 추론하지 않았다. 팬 공동 활동은 혼합된 warmth까지만 지지한다.

### `work-724c064d491faf4c7414` — もやしもん

- 공식 [1권](https://www.kodansha.co.jp/comic/products/0000038500)이 균을 보는 학생, 농업대학, 연구실, 동료, 캠퍼스 생활을 밝힌다. [2권](https://www.kodansha.co.jp/comic/products/0000038520)과 [3권](https://www.kodansha.co.jp/comic/products/0000038545)은 독립 사건 대신 같은 시리즈 개요를 반복한다. 따라서 기능적 과학·비현실 설정, 고정 연구실 집단, school centrality 2만 지지한다.
- [공식 수상 심사평](https://www.mangataisho.com/data/2008/comment.pdf)은 발효, 음식 지식, 여러 인물을 언급하지만 초반 범위를 넘는다. pacing, comedy, problemSolving, 인물 변화, cooking centrality에는 쓰지 않았다. 신장판 [공식 작품 페이지](https://www.kodansha.co.jp/titles/1000000069)는 판본 lead일 뿐이다.

### `work-78d44d381562e37dd94a` — きょうは会社休みます。

- 공식 [1권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846769846769315501), [2권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846820846769315501), [3권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845002846769315501)이 첫 관계 경험, 깊어지는 교제, 직장 접점, 새로운 관계 변수를 반복한다. 높은 progression·characterArcWeight, 일반적 Arc pacing, 핵심 커플, 중간 수준 mentalStress·warmth, workplace centrality 2를 지지한다.
- 이 chunk의 유일한 값 4는 `romance=4`다. 공식 3개 권 소개가 모두 관계와 관계 변화를 전개의 중심으로 직접 반복하기 때문이다. [공식 수상 심사평](https://www.mangataisho.com/archives/2013/02/post-366.html)은 첫 연애와 나이 차이 전제를 교차 확인하지만 comedy, darkness, strategy, mystery는 확정하지 않는다.

## Pass B 전달 한계

- `candidateSha256`은 봉인된 generic manifest에 재결속됐으며 Pass B가 이 동일 식별자를 검증해야 한다.
- 乱と灰色の世界에 Theme 행이 없는 것은 의도적이다. 현재 마법·가족 관찰을 canonical Theme로 직접 대응하면 중심성을 부풀리게 된다.
- 값 0은 배정하지 않았다. 유일한 극단값은 초반 공식 3개 권 소개가 직접 반복하는 きょうは会社休みます。의 `romance=4`다.
- 모든 Art 축은 `unknown`으로 종결했다. 적격 페이지 표본 부족만으로 blocker나 pending을 만들지 않았다.
- Pass B는 낮은 confidence 값, 특히 劇光仮面의 `combat`, 高杉さん家のおべんとう의 `mysteryReveal`·`workplace`, きょうは会社休みます。의 `mentalStress`를 독립적으로 재검토해야 한다.
