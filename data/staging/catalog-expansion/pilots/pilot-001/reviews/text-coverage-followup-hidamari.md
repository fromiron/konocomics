# Pilot 001 chunk-01 `陽だまりの樹` 독립 충돌 판정

- Work: `work-671e3453cf9e1df2ee87`
- Canonical title: `陽だまりの樹`
- HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- 평가 범위: `entry_1_3_volumes`
- 조회일: `2026-08-23`
- Art: `ART_ABSTAIN`
- 저장소 변경: 없음

## 1. 독립 결론

- Narrative: **`2 / 2 / U / 2 / U / 4` = 4/6, PASS**
- Tone: **`4 / 2 / U / 2 / U / 2 / 2` = 5/7, PASS**
- Genre: `historical`
- Themes: `historicalReconstruction=2`, `politics=1`
- Text blocker: **없음**
- Hard blocker: **없음**

핵심 충돌은 `romance=2`로 종결한다. Grok의 `U`는 공식 entry 자료와 맞지 않는다. 공식 小学館 문고 1권 소개가 제2화에서 두 주인공이 같은 여성에게 각자 마음을 전한다고 직접 설명하고, 권리자 사이트가 연결한 전자 1권 내부 미리보기 인쇄면 60–65쪽은 그 구애와 경쟁을 실제 장면으로 보여 준다. 문고 2권 소개에서도 같은 관계선이 혼인 조건, 약속 위반, 양보로 이어진다. 이는 whole-work synopsis의 한 문장을 entry에 억지로 투사한 판정이 아니다.

다만 연애는 의학·신분·외교·정치와 두 주인공의 진로를 압도하는 중심 보상이 아니다. Dictionary의 “서브 플롯”인 2가 맞고, 3 또는 4로 올리지 않는다.

## 2. 재검수 입력

다음 current-SHA 자료를 결론으로 상속하지 않고 대조했다.

- `docs/factors/factor-dictionary.md`
- `annotation-pass-a/chunk-01/factors.csv`, `genres.csv`, `themes.csv`, `notes.md`
- `research/chunk-01.md`
- `reviews/coverage-gap-chunks-01-02.md`
- `reviews/text-pass-bc-chunks-01-02.md`
- `reviews/text-coverage-followup-a.md`
- `reviews/text-coverage-followup-a-review.md`
- `reviews/grok-current-chunk-01-response.txt`
- `reviews/grok-current-chunk-01-followup-response.txt`

Dictionary 기준은 다음과 같이 적용했다.

- 0은 공식 소개의 단순 누락으로 만들지 않는다.
- 2는 `romance`의 서브 플롯 anchor다.
- entry 1–3권 또는 첫 주요 에피소드만 사용한다.
- Narrative known 4/6, Tone known 5/7을 맞추기 위해 값을 생성하지 않는다.
- 내부 페이지는 사건·대화·관계만 판독했다. Art 4축은 모두 기권한다.

## 3. 공식 출처 원장

모든 행의 `retrievedAt`은 `2026-08-23`이다.

| id | sourceName | publishedAt / year | 판본·범위 | URL | 직접 확인 |
|---|---|---|---|---|---|
| H-00 | 手塚治虫 TEZUKA OSAMU OFFICIAL `陽だまりの樹` | page undated; serial 1981-04-25–1986-12-25 | 권리자 작품 페이지와 전자책 1–11권 링크 | https://tezukaosamu.net/jp/manga/380.html | 두 주인공의 반대되는 진로, 우정, 같은 여성에 대한 마음, 막부 말기 의학·역사 사건을 명시. 이 페이지가 K-01~K-03을 직접 연결한다. |
| S-00 | 小学館コミック `陽だまりの樹〔小学館文庫〕` series | undated | 문고 1–8권 series index | https://shogakukan-comic.jp/book-series?cd=16938 | B-01~B-03을 동일 공식 연속 판본 1–3권으로 연결한다. |
| B-01 | 小学館コミック `陽だまりの樹〔小学館文庫〕 1` | page undated; edition release 1995-05-17 | ISBN `9784091920515`, 328쪽, 제1–9화 | https://shogakukan-comic.jp/book?isbn=9784091920515 | 제2화에서 良庵과万次郎가 모두 おせき를 만나러 와 각자 마음을 전하고 혼인 답을 듣는다고 명시. おせき는 제2·8화에 등장한다. |
| B-02 | 小学館コミック `陽だまりの樹〔小学館文庫〕 2` | page undated; edition release 1995-05-17 | ISBN `9784091920522`, 332쪽, entry 연속권 | https://shogakukan-comic.jp/book?isbn=9784091920522 | 제1화에서 おせき가 살생하지 않으면 万次郎와 혼인하고 싶다고 답하고, 그가 약속을 어긴 뒤 良庵을 남편으로 맞으라고 물러서는 관계선을 명시. |
| B-03 | 小学館コミック `陽だまりの樹〔小学館文庫〕 3` | page undated; edition release 1995-05-17 | ISBN `9784091920539`, 336쪽, entry 연속권 | https://shogakukan-comic.jp/book?isbn=9784091920539 | おせき가 제3화에 다시 등장하며, 제7화는 良庵의 혼인 관계를 다룬다. 본권의 중심 특징은 万次郎의 50석 가증과 종두소 지지 확대다. |
| K-01 | 楽天ブックス Kobo instant preview `陽だまりの樹 1` | undated | 권리자 페이지가 직접 연결한 전자 1권; viewer 63/63 전체 | https://books.rakuten.co.jp/instantpreview/8b71f80fbe1f33b7b647282fefb98f2d?viewmode=2&scid=wi_tzktokobo_0001_1 | 표지·목차를 포함한 공개 범위 전체를 직접 넘겼다. 인쇄면 60–65쪽이 같은 여성에 대한 구애·경쟁을 직접 보여 준다. |
| K-02 | 楽天ブックス Kobo instant preview `陽だまりの樹 2` | undated | 권리자 페이지가 직접 연결한 전자 2권; viewer 56/56 전체 | https://books.rakuten.co.jp/instantpreview/4d4b19cd999b3f71b50c6dbe0a59b084?viewmode=2&scid=wi_tzktokobo_0001_2 | 공개 범위 전체를 직접 넘겼다. 의료·암살 위기·정치 사건을 확인했으나 이 opening 표본에서 새로운 おせき 장면은 만들지 않았다. |
| K-03 | 楽天ブックス Kobo instant preview `陽だまりの樹 3` | undated | 권리자 페이지가 직접 연결한 전자 3권; viewer 56/56 전체 | https://books.rakuten.co.jp/instantpreview/8d80c767b20f36b2aebcfa7c2f9f8c4b?viewmode=2&scid=wi_tzktokobo_0001_3 | 공개 범위 전체를 직접 넘겼다. 의학·정치·가족·폭력 사건을 확인했으며, 제한된 opening만으로 comedy나 mentalStress를 추가 확정하지 않았다. |

### 판본 경계

- frozen representative ISBN은 일반판 1권 `9784091806017`이다.
- B-01~B-03은 alternate 문고판이고 대표 ISBN을 교체하지 않는다.
- K-01~K-03은 권리자 사이트가 연결한 별도 전자판이다. 전자권과 문고권의 권차가 1:1이라고 가정하지 않았다.
- `romance=2`는 K-01 내부 페이지 자체와 B-01·B-02의 명시적 chapter 설명이 각각 독립적으로 entry 범위를 확정하므로, 판본 권차의 1:1 대응을 필요로 하지 않는다.

## 4. `romance` 직접 판정

### 내부 페이지 관찰

K-01의 viewer counter 59/63–63/63은 인쇄면 60–65쪽을 표시한다.

1. 인쇄면 60쪽: 良庵이 おせきを 알아보고 강한 관심을 보인다.
2. 인쇄면 61쪽: 万次郎가 출행 전 그녀에게 분명한 답을 요구한다.
3. 인쇄면 62–63쪽: 良庵은 자신이 절을 찾는 이유가 그녀라고 밝히고, 두 사람 중 하나를 선택하라고 요구한다.
4. 인쇄면 64–65쪽: おせき의 혼인 조건과 두 남자의 상반된 대응이 이어진다.

이는 단순 미모 반응이나 한 컷의 호감이 아니다. 관계 선택이 대화와 행동을 움직이는 완결된 제2화 서브 플롯이다. B-02가 다음 entry 권에서 혼인 조건과 약속 위반의 결과를 다시 명시하므로 반복성도 확인된다.

### 값 결정

| 후보 | 결정 | 이유 |
|---:|---|---|
| `U` | **REJECT** | “문고 1–3권에 연애 사건이 없다”는 전제가 B-01·B-02와 K-01 실제 페이지에 반한다. |
| `1` | **REJECT** | 한 번의 암시가 아니라 공식 제2화 전체와 다음 권 사건 결과까지 이어지는 명시적 관계선이다. |
| `2` | **ACCEPT** | Dictionary의 서브 플롯 anchor와 정확히 맞는다. |
| `3`/`4` | **REJECT** | 각 권의 중심 특징은 두 진로, 의학 제도, 신분 획득, 외교·정치다. 연애가 주요 전개 전체를 지배하지 않는다. |

권고 confidence는 `0.92`다.

## 5. 최종 Axis 판정

### Narrative

| Axis | 결정 | 최종 | 독립 근거 |
|---|---|---:|---|
| `progression` | ACCEPT | 2 | B-01의 진로 시작, B-02의 공식 역할 발탁, B-03의 50석 가증·종두소 지지 확대가 단계적으로 이어진다. |
| `problemSolving` | ACCEPT | 2 | entry는 직접 결투·행동과 의료 처치·제도 대응을 함께 사용한다. 지략이 핵심인 4는 아니다. |
| `strategy` | UNKNOWN | U | 암살·외교·정치 계획의 존재와 주인공의 반복적인 장기 계획 보상을 구분했다. |
| `pacing` | ACCEPT | 2 | 만남, 결투, 치료, 지진, 임무, 발탁, 조약·종두소가 일반 arc 단위로 변한다. 최대 속도 4는 아니다. |
| `mysteryReveal` | UNKNOWN | U | B-03의 부친 사망 진상은 bounded reveal이며 반복 보상으로 일반화할 수 없다. |
| `worldBuilding` | ACCEPT | 4 | 의학 인가, 종두소, 신분, 외교 사절, 통상조약이 반복적으로 사건과 선택을 규정한다. |

### Tone / Relationship

| Axis | 결정 | 최종 | 독립 근거 |
|---|---|---:|---|
| `characterArcWeight` | ACCEPT | 4 | 공식 권리자 framing과 B-01~B-03은 두 주인공의 진로·선택·관계 변화를 핵심 보상으로 둔다. |
| `relationshipStructure` | ACCEPT | 2 | dual leads와 반복 조연 관계는 확인되지만 level-4 다중 군상 구조까지는 entry 근거가 부족하다. |
| `comedy` | UNKNOWN | U | 공개 페이지에 희극적 표정·slapstick이 보이지만, 세 권 전체의 반복 빈도와 보상 중심성을 공개 opening만으로 확정하지 않았다. |
| `darkness` | ACCEPT | 2 | 죽음, 질병, 살생, 암살 위기와 정치 위험이 반복되지만 암울함이 모든 보상을 지배하지 않는다. |
| `mentalStress` | UNKNOWN | U | 물리적 위험과 비극이 있다는 사실만으로 지속적 심리 압박 값을 만들지 않았다. |
| `romance` | **CORRECT Grok** | **2** | B-01·B-02와 K-01 인쇄면 60–65쪽의 직접 근거. |
| `emotionalWarmth` | ACCEPT | 2 | 치료, 우정, 친절과 경쟁·폭력·상실이 공존하는 혼합 anchor다. |

다른 Tone 축을 coverage용으로 추가하지 않았다. `romance=2`가 직접 입증되므로 comedy와 mentalStress는 그대로 unknown으로 종결해도 Tone gate를 충족한다.

## 6. Genre / Theme

- Genre `historical`: 유지. 공식 권리자와 B-01~B-03이 막부 말기의 실제 제도·인물·사건을 직접 연결한다.
- `historicalReconstruction=2`: 유지. 서양의학·종두소·외교 사절·통상조약·신분 제도가 세 entry 권에서 반복적으로 사건을 제약한다. Genre에서 자동 변환한 값이 아니다.
- `politics=1`: 유지. 정치가 일부 주요 사건을 움직이지만 모든 entry episode의 반복 중심은 아니다.
- `romance` Genre는 추가하지 않는다. Axis 2의 서브 플롯을 Genre 중심성으로 자동 승격하지 않는다.

## 7. 표본 해시와 재현성

임시 파일은 `/tmp/hidamari/`에만 있으며 커밋 대상이 아니다. 화면 캡처는 1280×720 PNG이고 공식 viewer UI를 포함한다.

| ref | viewer / printed range | SHA-256 |
|---|---|---|
| `/tmp/hidamari/vol1/render-29.png` | viewer 59/63; printed 60–61 | `a47061155529fd279f11796c1e78a3e524040934aecfa39dc0b953f9cef365eb` |
| `/tmp/hidamari/vol1/render-30.png` | viewer 61/63; printed 62–63 | `c87e6ac347c9d62a8313dea47cfddd7088d7da9af2938aabadac12ac3a3afb58` |
| `/tmp/hidamari/vol1/render-31.png` | viewer 63/63; printed 64–65 | `936809658f56ea7378c12efb96e4b4c003b556a1576638ed4e2940a204a226e9` |

전체 render manifest digest:

| packet | files | aggregate SHA-256 |
|---|---:|---|
| K-01 | `render-00.png` … `render-31.png` (32) | `8e4c6c34a55fff374425dcaf43105b433fd1629b384750961a793b692b937d82` |
| K-02 | `render-00.png` … `render-28.png` (29) | `bb1d3768626618d9b351887991230aa69fb6ebc3f46848498f28741630cec49a` |
| K-03 | `render-00.png` … `render-28.png` (29) | `7e8df314b7764b32d962fade8f3b7133e56e4c79cecb05cc8a7aa85f667ab8bf` |

aggregate는 각 디렉터리에서 다음 명령으로 만들었다.

```sh
(cd /tmp/hidamari/vol1 && sha256sum render-*.png) | sha256sum
(cd /tmp/hidamari/vol2 && sha256sum render-*.png) | sha256sum
(cd /tmp/hidamari/vol3 && sha256sum render-*.png) | sha256sum
```

inner serialization은 파일명 오름차순으로 `<64 lowercase hex><두 ASCII space><basename><LF>`이며 절대 경로를 포함하지 않는다.

## 8. 경로 소진, blocker, 재검토 경로

이번 충돌에 지정된 공개 공식 경로는 소진했다.

1. 권리자 작품 페이지와 해당 페이지가 직접 연결한 전자 1–3권 공개 viewer 전체를 확인했다.
2. 小学館 문고 series index와 1–3권의 서지·수록화·권 소개 전체를 확인했다.
3. whole-work synopsis와 entry-specific chapter 설명을 분리했다.
4. alternate edition을 frozen representative ISBN로 바꾸지 않았다.

`romance=2`와 현재 N/T coverage에는 남은 blocker가 없다. 성인물, 웹툰, 비일본 만화, 비만화, 동인지, 중복판 Work, identity unresolved, safety unknown, 실질 자료 부재, 제품 계약 비호환 중 어느 hard-blocker 코드에도 해당하지 않는다.

향후 comedy 또는 mentalStress를 known으로 만들거나 romance를 2보다 높일 필요가 생기면, frozen 일반판 또는 정식 전자판의 entry 1–3권 전체를 합법적으로 확보해 장면의 시작·끝과 권별 반복 빈도를 다시 세는 것이 재검토 경로다. 이 추가 경로는 현재 promotion을 막지 않으며, 공개 opening에서 값을 억지로 만들 이유도 아니다.
