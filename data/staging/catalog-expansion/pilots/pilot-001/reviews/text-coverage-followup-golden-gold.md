# Pilot 001 chunk-04 독립 재판정 — ゴールデンゴールド

## 1. 고정 범위와 결론

- Work: `work-5e7eef6cc23d9738e034`
- Canonical title: `ゴールデンゴールド` (장식용 `『』` 없음)
- Repository HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Evaluation scope: entry 1–3권과 첫 주요 에피소드만
- Retrieved at: `2026-08-23`
- Art: `ART_ABSTAIN` — 내부 페이지는 텍스트·사건·관계 구조 확인에만 사용했고 Art 4축은 재판정하지 않았다.

독립 결론은 다음과 같다.

- Final Narrative: `U / 1 / U / 1 / 4 / 2` = **4/6, PASS**
- Final Tone: `2 / 4 / U / 4 / 4 / 2 / U` = **5/7, PASS**
- Genre: `fantasy; mystery; horror`
- Theme: `investigation=1`
- Hard blocker: **없음**

Grok의 `problemSolving=U` 판정은 “3권 포획 작전 한 번뿐”이라는 전제가 공식 2권 내부 페이지와 맞지 않아 수정한다. 2권 시작부에도 별도의 은닉·동선 조정·잠금 검토가 이어진다. 다만 이 작품이 지략 해결 중심은 아니므로 값은 `1`에 그친다. `relationshipStructure=2`도 공식 3권의 2쪽짜리 인물상관도와 1–2권 관계 변화 근거 때문에 `4`로 수정한다. 이는 등장인물 수만 센 결과가 아니라 여러 관계 묶음이 실제 갈등을 운반한다는 직접 근거에 따른다.

## 2. 선행 판정과 독립 검토 기준

검토한 current-SHA 자료:

- `docs/factors/factor-dictionary.md`
- `data/staging/catalog-expansion/pilots/pilot-001/manifest.json`
- `data/staging/catalog-expansion/pilots/pilot-001/annotation-pass-a/chunk-04/{factors,genres,themes}.csv`
- `data/staging/catalog-expansion/pilots/pilot-001/annotation-pass-a/chunk-04/notes.md`
- `data/staging/catalog-expansion/pilots/pilot-001/reviews/coverage-gap-chunks-03-04.md`
- `data/staging/catalog-expansion/pilots/pilot-001/reviews/text-pass-bc-chunks-03-04.md`
- `data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt`
- `data/staging/catalog-expansion/pilots/pilot-001/research/chunk-04.md`

Dictionary의 직접 기준을 적용했다.

- `problemSolving`: 0은 우연·힘·감정적 결단 중심, 2는 지략과 직접 행동의 혼합, 4는 제약 분석과 기발한 해결이 핵심이다. `1`은 관찰 가능한 반복 구조가 0과 2 사이일 때만 가능하다.
- `relationshipStructure`: 2는 고정 핵심 조연 반복, 4는 복잡한 군상 또는 다중 관계 구조다.
- Theme centrality 1은 일부 에피소드·서브 소재, 2는 반복 핵심이다.
- 자료가 짧아 지속성을 확정하지 못한 축은 `unknown`이며, synopsis 누락을 값 0으로 쓰지 않았다.

비교 기준:

- Pass A: N `U/U/U/U/4/2`, T `2/4/U/4/4/U/U`, Theme empty.
- Local Pass B/C: N `U/1/U/1/4/2`, T `2/4/U/4/4/2/U`, Theme empty.
- Grok: N `U/U/U/1/4/2`, T `2/2/U/4/4/2/U`, Theme empty.

## 3. 소진한 공식 경로

### 3.1 Comic DAYS — GOLDEN 001

- Source: コミックDAYS, モーニング・ツー
- URL: https://comic-days.com/episode/13932016480030208354
- Episode title: `ＧＯＬＤＥＮ　００１`
- Published at: 화면 표기 `2018-03-09`; embedded payload `2018-03-08T15:00:00Z`
- Edition/range: episode id `13932016480030208354`, `main` 54쪽 전부
- Payload image digest: `317ecf79e4b099abc447b6e9aa89c33e7dd62fdf`
- Direct observation:
  - 도입의 유혈 역사 장면과 섬 일상, 루카·오이카와·할머니·민박 관계, 후쿠노카미 출현까지 전부 확인했다.
  - 루카는 물건을 씻고 인터넷에서 후쿠노카미·제례 이미지를 찾아 비교하고, 지역 노인에게 물은 뒤 사당에 옮긴다. 이는 낮은 강도의 정보 탐색과 직접 행동이지만 그 자체만으로 반복적인 문제 해결을 확정하지는 않는다.
  - 소원은 오이카와가 섬을 떠나지 않게 하려는 감정적 동기이며, 이를 `problemSolving`의 높은 값으로 바꾸지 않았다.
  - episode 하나 안에서는 성장·숙련 보상이 반복되지 않는다.
- Limitation: 한 에피소드만으로 3권 전체의 해결·전략·성장 빈도를 확정할 수 없다. 따라서 아래 2–3권 공식 자료와 교차했다.

### 3.2 講談社 1권

- Source: 講談社 ゴールデンゴールド（1） 제품 및 공식 trial
- Product URL: https://www.kodansha.co.jp/comic/products/0000018813
- Trial URL: https://www.kodansha.co.jp/comic/products/0000018813/trial
- Published at: `2016-06-23`
- ISBN: `9784063886153`
- Edition/range: Morning KC 일반판 1권; trial `content-p01`–`content-p13`, `content-p15`(표지·백지·속표지·목차 및 본문 인쇄 3–13쪽). 본문은 Comic DAYS 001의 시작부와 동일하다.
- Direct observation: 첫 에피소드의 유혈 도입과 루카·오이카와의 관계, 섬으로의 귀환을 교차 확인했다. 별개의 두 번째 해결 구조는 추가되지 않았다.
- Limitation: 1권 trial은 에피소드 후반 전부를 보여 주지 않지만 Comic DAYS 001이 같은 에피소드 54 main pages를 완전 공개하므로 해당 누락은 위 경로로 보완됐다.

### 3.3 講談社 2권

- Source: 講談社 ゴールデンゴールド（2） 제품 및 공식 trial
- Product URL: https://www.kodansha.co.jp/comic/products/0000018886
- Trial URL: https://www.kodansha.co.jp/comic/products/0000018886/trial
- Published at: `2017-01-23`
- ISBN: `9784063886894`
- Edition/range: Morning KC 일반판 2권; trial `content-p01`–`content-p10`, 본문 인쇄 3–8쪽(`GOLDEN 007` 시작)
- Product observation: 후쿠노카미의 힘으로 하야사카 상점이 번성하지만 할머니가 계속 이상해진다고 명시한다.
- Internal-page observation:
  - 본문 3–8쪽에서 민박 손님이 있는 동안 후쿠노카미를 보이지 않게 해야 하는 제약이 생긴다.
  - 루카는 후쿠노카미가 식사 시간에 방에서 나온다는 패턴을 관찰하고, 그 전에 반대편에서 식사를 가져오게 하자는 동선 대응을 세운다.
  - 아이가 문을 열어 노출될 뻔한 뒤 잠금장치를 검토한다.
  - 사업 확장과 친구 관계를 지렛대로 쓰는 후쿠노카미의 말이 자기 약점을 아는 것인지 분석한다.
- Meaning: 이것은 3권 포획 작전과 다른 별도의 제약 분석·직접 대응 시퀀스다. 따라서 “포획 작전 한 번뿐”은 사실이 아니다. 다만 미리보기 범위 안에서 완결된 영리한 해결 결과까지 확인되지는 않는다.

### 3.4 講談社 3권

- Source: 講談社 ゴールデンゴールド（3） 제품 및 공식 trial
- Redirect URL: https://www.kodansha.co.jp/r/comic/product?isbn=9784065102022
- Canonical product URL: https://www.kodansha.co.jp/comic/products/0000023098
- Trial URL: https://www.kodansha.co.jp/comic/products/0000023098/trial
- Published at: `2017-10-23`
- ISBN: `9784065102022`
- Edition/range: Morning KC 일반판 3권; trial `content-p01`–`content-p10`, 권두 줄거리·인물상관도 2쪽·목차 및 `GOLDEN 015` 본문 인쇄 5–8쪽
- Product observation: 살인 사건을 조사하러 온 형사 酒巻, 할머니의 변화를 본 黒蓮·琉花의 후쿠노카미 포획 작전, 중3 소녀의 연정과 급전개를 직접 명시한다.
- Internal-page observation:
  - 권두 줄거리는 후쿠노카미의 영향으로 할머니가 편의점 운영과 섬 경제 단체를 확장하고, 영업 방해와 살인이 새 방문자를 부른 흐름을 요약한다.
  - 공식 2쪽 인물상관도는 루카–어머니–할머니의 가족 관계, 루카–오이카와의 호감·친구 관계, 후쿠노카미–할머니·경제 단체의 신봉·조종 관계, 할머니–梶刈/岩奈의 적대·위기 관계, 黒蓮–편집자·역사가–후쿠노카미의 관찰 관계, 酒巻–살인 사건의 조사 관계를 각각 연결한다.
  - 본문 5–8쪽은 구급·경찰·피의자 이송과 피해자 대화 확인을 보여 주며, 살인 조사가 실제 서브 에피소드로 진행됨을 확인한다.
- Meaning: 공식 관계도와 여러 갈등 묶음은 “주민이 많다”가 아니라 실제 다중 관계 구조의 직접 근거다. 살인 조사는 제품 소개의 한 문장에 그치지 않고 관계도와 내부 본문에서도 확인된다.

### 3.5 기존 공식 보조 근거

- モーニング 공식 작품 페이지: https://morning.kodansha.co.jp/c/goldengold (날짜 미표기, retrieved `2026-08-23`). 섬의 중학생 루카, 후쿠노카미형 이형, 금과 피의 위협을 직접 소개한다.
- マンガ大賞2017 공식 심사평: https://www.mangataisho.com/archives/2017/01/post-1013.html (`2017`, retrieved `2026-08-23`). 1–2권에서 일상이 서서히 침식되는 pacing, 단서·복선과 정체불명 존재, 섬 사람들의 인간관계 변화, 루카를 포함한 소수만 공유하는 불안을 반복 관찰한다. 선정 사실은 Factor Evidence로 쓰지 않고 구체적 심사평만 보조로 사용했다.

## 4. 페이지 표본과 SHA-256

임시 파일은 `/tmp/golden-gold/` 아래에만 두었고 저장소에는 커밋하지 않았다. Comic DAYS 원본 asset은 타일 셔플 상태라 직접 판독에 쓰지 않고, 공식 viewer가 복원한 화면 캡처를 직접 판독했다.

| packet | exact files | aggregate SHA-256 |
|---|---|---|
| Comic DAYS raw payload | `episode001/page-001.jpg` … `page-054.jpg` | `dde58f62e3758854faaf56b07c2b17aa85887a64a74f71a273454357f99db786` |
| Comic DAYS rendered viewer sequence | `render-00.png` … `render-27.png` | `7937ab35c8989c8318f450aa6b81f38a9e4d0f36adb4fc4b1be0f79f26074631` |
| Kodansha vol.1 trial | `vol1-preview/p01.png` … `p13.png`, `p15.png` (14 files; `p14` is viewer blank and excluded) | `5e3d6cba35ba615b26971ff29aaac411b7cb906124fdabdb689974b283833762` |
| Kodansha vol.2 trial | `vol2-preview/p01.png` … `p10.png` | `a5717a67080c0346c85888d414bfedc25f152e65bf48d92790ea583beace25ea` |
| Kodansha vol.3 trial | `vol3-preview/p01.png` … `p10.png` | `f7b2a61139708dbbb5efa1dd1874542bde106284252fad4c3d0d6a02ebf18f39` |

Aggregate serialization은 각 디렉터리에서 아래 명령이 생성하는 byte stream이다.

```sh
(cd /tmp/golden-gold/episode001 && sha256sum page-*.jpg) | sha256sum
(cd /tmp/golden-gold && sha256sum render-*.png) | sha256sum
(cd /tmp/golden-gold/vol1-preview && sha256sum p*.png) | sha256sum
(cd /tmp/golden-gold/vol2-preview && sha256sum p*.png) | sha256sum
(cd /tmp/golden-gold/vol3-preview && sha256sum p*.png) | sha256sum
```

각 inner manifest line은 정확히 `<64 lowercase hex><두 ASCII space><basename><LF>`이다. 절대 경로는 직렬화에 포함하지 않는다. `render-00`은 첫 main page와 빈 slot, `render-01`–`render-26`은 이후 main pages의 2쪽 spread, `render-27`은 마지막 main page와 survey/back-matter를 함께 담는다. 이 시퀀스가 main pages 54쪽 전체를 덮는다. 아래 관찰은 추정한 인쇄 페이지 번호 대신 재현 가능한 render 파일명을 참조한다.

판정에 특히 사용한 샘플:

| ref | direct content | SHA-256 |
|---|---|---|
| `render-18.png` (exact viewer render) | 물건 세척·관찰 시작 | `0f5dae0f126911691d23112e6868e1f66882e8468402c848885ba2f13ae791b7` |
| `render-19.png` (exact viewer render) | 인터넷 검색·후쿠노카미 이미지 비교 | `ab8d2165206e66a4fef79af827e6bed153922e93ce6a541bede7ed0da22f22df` |
| `render-20.png` (exact viewer render) | 지역 인물에게 물건을 문의 | `aa1a530e957106924796dfe0aa6e434f94a43b3e699b241e75744fa863cd5e21` |
| `render-21.png` (exact viewer render) | 사당에 두라는 조언 뒤 이동 | `a27ec6b1fbb5446803434724b212d331df193803d2d539e01a0af1e84febc0ac` |
| `vol2-preview/p07.png` (인쇄 5쪽) | 외부 손님·식사 시간 제약 분석과 동선 대응 | `55b1a77439fd90cad07591818728981287bdda8274aa02602a90da5928b47bf6` |
| `vol2-preview/p08.png` (인쇄 6쪽) | 노출 위험 뒤 잠금 검토 | `63f93dff5f6161e4a2f6e876c6ce22048760e49ac856b12b8b3e5ee3a6c98b73` |
| `vol2-preview/p09.png` (인쇄 7쪽) | 번성 뒤 발언·상황 변화 우려 | `c5e433679260b231582505a58d5bef9693084df89abfece4d84d464c401515bf` |
| `vol2-preview/p10.png` (인쇄 8쪽) | 돈·친구를 지렛대로 쓰는 존재의 의도 분석 | `b52371c3ffac03a4c9f294739d86c3415e3009754317713deb00eee5e23bdba2` |
| `vol3-preview/p04.png` | 1–2권 줄거리와 관계도 1/2 | `3b4d275c58a698367013c5a5d4917a2b746f1a3035eda87b3c61d00f509abcbe` |
| `vol3-preview/p05.png` | 관계도 2/2, 조사·관찰·적대 관계 | `838cf8a9ea1a20e03a92ea3bf11f978d74fc43e4df1dd13aa5099caa725026cb` |
| `vol3-preview/p08.png` (인쇄 6쪽) | 경찰 이송과 사건 전개 | `84e2debfa2cdf2cfb78f932cd337870f70a990956812d254f34baaa0e905262e` |
| `vol3-preview/p09.png` (인쇄 7쪽) | 형사의 피해자 대화 조사 | `1df60e7184215d66b1a0168e559236e65f4f3af603da9419d0a07005146da06a` |
| `vol3-preview/p10.png` (인쇄 8쪽) | 피해자 응접실 확인 | `73232ec1ea32ff990b63dba1ae4e4d301c8a05abdfb8797be81b8cfc2012e176` |

제품 HTML 자체는 응답마다 CSP nonce가 달라지므로 안정된 페이지 sample hash로 주장하지 않았다. 제품 URL, ISBN, 발매일, 소개문과 trial의 복원된 내부 페이지 hash를 기록했다.

## 5. Axis 독립 판정

### 5.1 Narrative

| axis | disposition | final | reason |
|---|---|---:|---|
| `progression` | UNKNOWN | U | 학년 변화와 상황 악화는 확인되지만 성장·획득·숙련의 반복 보상은 확인되지 않았다. |
| `problemSolving` | **CORRECT Grok** | **1** | 3권 포획 작전 외에도 2권에서 관찰→동선 조정→잠금 검토라는 독립 제약 대응이 있고, 1화에서도 조사·문의·직접 행동이 있다. 반복은 확인되지만 영리한 해결이 핵심이거나 결과가 반복 성취되는 수준은 아니므로 2가 아니라 1이다. |
| `strategy` | UNKNOWN | U | 2권 은닉/동선 대응과 3권 포획은 모두 짧은 반응형 조치다. 같은 장면을 problemSolving과 전략에 이중 사용해 지속적 계획 보상을 만들지 않는다. 장기 계획·자원 운영은 확인되지 않았다. |
| `pacing` | ACCEPT | 1 | 1–2권의 느린 일상 침식과 3권 급전개가 공식 자료에서 교차 확인된다. entry 평균은 0과 2 사이의 느린 쪽이다. |
| `mysteryReveal` | ACCEPT | 4 | 후쿠노카미의 정체·규칙과 제시된 복선/단서를 다시 확인하게 만드는 구조가 초기 1–2권의 주요 보상으로 공식 심사평에 반복된다. |
| `worldBuilding` | ACCEPT | 2 | 섬 공동체, 섬 안/밖에서 다르게 인식되는 존재, 신봉·경제 확장의 기능적 규칙이 사건과 관계를 조직한다. |

### 5.2 Tone / Relationship

| axis | disposition | final | reason |
|---|---|---:|---|
| `characterArcWeight` | ACCEPT | 2 | 할머니·루카·주민 변화와 초자연 사건이 균형을 이룬다. |
| `relationshipStructure` | **CORRECT Grok** | **4** | 3권 공식 2쪽 인물상관도가 가족·친구/연정·신봉/조종·경제적 적대·창작자 관찰·경찰 조사라는 여러 관계 묶음을 직접 연결한다. 공식 심사평도 섬 인간관계가 서서히 변한다고 본다. 단순 cast count가 아니라 Dictionary의 “다중 관계 구조”에 해당한다. |
| `comedy` | UNKNOWN | U | 공식 심사평에서 장르가 코미디인지 호러인지 모호하다는 반응은 있지만 개그 빈도·지속성을 확정하지 못한다. |
| `darkness` | ACCEPT | 4 | 첫 화의 유혈 도입, 3권의 살인, 돈·욕망·관계 침식이 중심 사건이다. |
| `mentalStress` | ACCEPT | 4 | 루카와 일부 인물만 공유하는 불안, 할머니의 변모와 통제 상실이 지속된다. |
| `romance` | ACCEPT | 2 | 오이카와를 붙잡고 싶은 첫 화의 소원과 3권 공식 소개의 연정은 물질적인 서브플롯이지만 주 플롯은 아니다. |
| `emotionalWarmth` | UNKNOWN | U | 가족·친구 유대가 존재해도 유대·힐링이 entry의 핵심 보상이라고 확정할 수 없다. |

## 6. Genre와 Theme

- `fantasy`: 후쿠노카미형 이형과 소원·초자연 영향이 직접 확인된다. **ACCEPT**.
- `mystery`: 정체·규칙·복선과 살인 조사가 반복된다. **ACCEPT**.
- `horror`: 유혈 도입, 불가해한 존재, 점진적 일상 침식, 살인이 중심이다. **ACCEPT**.
- `investigation=1`: **CORRECT empty Theme**. 3권 제품 소개, 2쪽 인물상관도, 본문 5–8쪽이 살인 수사를 실제 서브 에피소드로 직접 확인한다. 이는 Dictionary의 “일부 에피소드·서브 소재”인 centrality 1과 일치한다. 1–3권 전체의 반복 핵심이라고 볼 수 없으므로 2로 올리지 않는다. Theme는 N/T coverage 수를 채우지 않으므로 gate gaming도 아니다.

## 7. Identity, safety, blocker

- Identity: **verified**. 堀尾省太, Morning KC 일반판 1–3권, ISBN `9784063886153` / `9784063886894` / `9784065102022`, 동일 title series가 공식 제품·trial·Comic DAYS에서 일치한다. 판본·중복 충돌 없음.
- Safety: **approved/no conflict**. 講談社의 일반 소비자용 Morning KC 제품과 공개 trial/Comic DAYS 에피소드다. 피·살인·공포는 content tone이며 성인 전용 판매 근거가 아니다. candidate packet의 `safe`와 충돌하지 않는다.
- Hard blocker: **NO**. 성인물, 웹툰, 비일본 만화, 비만화, 동인지, 중복 판본, identity unresolved, safety unknown, 실질 자료 부재, 제품 계약 비호환 중 어느 코드에도 해당하지 않는다.
- Promotion gate: Narrative 4/6, Tone 5/7로 immutable coverage를 충족한다. Art unknown/abstain은 blocker가 아니다.

## 8. 경로 소진과 재검수 경로

Grok이 지정한 공개 공식 경로는 소진했다.

- Comic DAYS `GOLDEN 001`: 54 main pages 전부 직접 판독.
- 講談社 1권: 제품 소개와 공개 trial 전 범위 판독; 동일 에피소드의 나머지는 Comic DAYS 완전 공개로 보완.
- 講談社 2권: 제품 소개와 공개 trial 전 범위 판독.
- 講談社 3권: 제품 소개, canonical redirect, 공개 trial의 권두 요약·관계도·본문 전 범위 판독.

공개 trial 바깥의 2–3권 전체 본문은 “경로가 존재하지 않음”이 아니라 유료 정식판으로 재검수할 수 있는 범위다. 향후 `strategy` 또는 `progression`을 known으로 올리려는 경우에는 정식 2–3권의 `GOLDEN 007`–`022`를 합법적으로 확보해 각 계획의 시작·실행·결과와 성장 보상 빈도를 다시 세면 된다. 현재 판정은 그 추가 자료 없이도 coverage와 Theme를 직접 근거로 닫을 수 있고, 미소진 경로를 이유로 blocker를 만들지 않는다.
