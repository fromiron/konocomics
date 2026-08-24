# Pilot 001 Text coverage gap 재조사 B

- 대상 Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- 조사일·조회일: `2026-08-23`
- 범위: `entry_1_3_volumes` 또는 첫 주요 에피소드
- 대상: エマ, ギャラリーフェイク, バラ色の明日
- 판정 기준: `docs/factors/factor-dictionary.md`의 0/2/4 anchor와 현재 coverage gate(Narrative `>=4/6`, Tone `>=5/7`)
- 방법: `text-pass-bc-chunks-01-02.md`, `coverage-gap-chunks-01-02.md`, Pass A를 기준선으로 삼고, 그 원장에 남아 있던 공식 미소진 경로만 이어서 조사했다. 전체 후보·출처 재수집은 하지 않았다.

표기 순서는 다음과 같다.

- Narrative: `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`
- Tone: `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`
- `U`: 근거 부족으로 종결된 `unknown`; 낮은 값이 아니다.

## 결론

| workId | 작품 | Narrative | Tone | 이번 좁은 재조사 결과 |
|---|---|---:|---:|---|
| `work-1fc61ddbeb429b4a2c15` | エマ | `U / 0 / U / 2 / U / 4` = **3/6 실패** | `4 / 2 / U / 1 / 3 / 4 / U` = **5/7 통과** | 기록된 공식 1~3권 preview 경로를 실제로 끝까지 시도했으나 내부 페이지를 확보하지 못했다. Narrative의 `SOURCE_INFORMATION_UNAVAILABLE` blocker 후보 조건을 충족한다. |
| `work-303d0a9d67a606a817af` | ギャラリーフェイク | `U / 4 / U / 2 / 4 / 3` = **4/6 통과** | `1 / U / 1 / 2 / 1 / 0 / 2` = **6/7 통과** | 공식 1권 preview의 완결된 첫 에피소드를 직접 확인해 Tone gate를 닫았다. Text blocker 없음. |
| `work-440f93a4e60ef906685b` | バラ色の明日 | `U / U / U / U / U / U` = **0/6 실패** | `4 / U / U / U / U / 4 / 1` = **3/7 실패** | 1997년 동결판과 2009년 재편집판의 story title/order 매핑은 입증했지만 공식 reader가 첫 story 일부만 제공했다. 복수 story 표본 요건을 충족하지 못해 양쪽 gate의 `SOURCE_INFORMATION_UNAVAILABLE` blocker 후보 조건을 충족한다. |

여기서 blocker는 **Pass C에 넘길 후보**다. 이 문서만으로 작품 상태를 `promotionBlocked`로 확정하거나 registry를 수정하지 않는다.

## 출처 원장

모든 출처는 2026-08-23에 조회했다. `undated`는 페이지 자체에 게시일이 없다는 뜻이며, 페이지에 별도 발매일이 있으면 함께 적었다.

### エマ

| ID | 출처·발표일/연도 | 판본·범위 | URL | 이번 사용 |
|---|---|---|---|---|
| E01 | KADOKAWA, product page; 발매일 `2002-08-30` | 1권, ISBN `9784047298804` | https://www.kadokawa.co.jp/product/301407000933/ | 동결 representative 1권과 공식 sample route 연결 확인 |
| E02 | KADOKAWA, product page; 발매일 `2003-02-24` | 2권, ISBN `9784047302884` | https://www.kadokawa.co.jp/product/301502000864/ | 공식 2권 sample route 연결 확인 |
| E03 | KADOKAWA, product page; 발매일 `2003-11-25` | 3권, ISBN `9784047302891` | https://www.kadokawa.co.jp/product/301502000865/ | 공식 3권 sample route 연결 확인 |
| E04 | BOOK☆WALKER official trial, undated | 1권 UUID `dee971444a-72e5-4aab-a1fe-979347425373` | https://bookwalker.jp/dee971444a-72e5-4aab-a1fe-979347425373/?sample=1&from=1 | 공식 viewer 접근 시도 |
| E05 | BOOK☆WALKER official trial, undated | 2권 UUID `de6f554b9b-1148-4042-a598-227448530b06` | https://bookwalker.jp/de6f554b9b-1148-4042-a598-227448530b06/?sample=1&from=1 | 공식 viewer 접근 시도 |
| E06 | BOOK☆WALKER official trial, undated | 3권 UUID `de434a2335-0802-468e-8cb6-e4331e40418a` | https://bookwalker.jp/de434a2335-0802-468e-8cb6-e4331e40418a/?sample=1&from=1 | 공식 viewer 접근 시도 |

### ギャラリーフェイク

| ID | 출처·발표일/연도 | 판본·범위 | URL | 이번 사용 |
|---|---|---|---|---|
| G01 | 小学館 eコミックストア product page, undated | 1권, JDCN `091830210000d0000000`; 동결 ISBN `9784091830210`에 대응 | https://e-comi.shogakukan.co.jp/books/091830210000d0000000 | 정확한 1권 reader identity 확인 |
| G02 | 小学館 eコミックストア official reader, undated | 1권 preview, reader pp.2–28; 첫 에피소드 `贋作画廊` 완결과 둘째 에피소드 시작까지 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091830210000d0000000 | Tone 직접 판정의 1차 근거 |
| G03 | honto, `ギャラリーフェイク １` review; 저자 `ｔｏｍｏ`, `2001-03-31 16:54` | 1권 상품 container이나 문장 자체의 범위는 series-wide일 가능성 있음 | https://honto.jp/ebook/pdseries-review_06C-MDO-285548-S9784091830210.html | S24 저자·시각·상품 범위 재현. 축 값에는 사용하지 않음 |
| G04 | LOMICO, 藤田 智美; 발표 `2020-09-03`, 수정 `2023-08-05` | 작품 전체 성격을 다룬 보조 비평; 1권 링크는 있으나 ART.1 전용 범위 아님 | https://lomico.jp/review/121/ | 공식 페이지 관찰과 방향이 일치하는지 확인만 함. 축 값에는 필요하지 않음 |

### バラ色の明日

| ID | 출처·발표일/연도 | 판본·범위 | URL | 이번 사용 |
|---|---|---|---|---|
| B01 | 集英社 공식 구 product page의 Internet Archive 보존본; 발매 `1997-09-25`, archive capture `2004-08-20` | 동결 standard 1권, 구 ISBN `4-08-848709-5` = ISBN-13 `9784088487090` | https://web.archive.org/web/20040820212024id_/http://books.shueisha.co.jp:80/CGI/search/syousai_put.cgi?isbn_cd=4-08-848709-5&mode=1 | 1997년 1권의 네 story 제목·순서와 별책마가렛 1997년 1~4월 수록 범위 확인 |
| B02 | 集英社 2009 re-edition product page; 종이판 `2009-07-24`, 전자판 `2013-04-09` | 2009 재편집 1권, JDCN `08782229848709315501` | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782229848709315501 | 네 story 제목·순서·시작 페이지 확인 |
| B03 | 集英社 official reader, undated | 2009 재편집 1권 | https://www.shueisha.co.jp/books/reader/main.php?cid=08782229848709315501 | viewer identity와 실제 노출 범위 확인 |
| B04 | 集英社 reader content manifest, undated | 같은 JDCN; 노출 이미지 `P0000`–`P0051`, `AddressList [[0,51,0,51],[-1,-1,52,214]]` | https://mangabroadcast.jp/contents/08782229848709315501/commercial/content.js | preview가 story 2 시작 전 종료한다는 재현 가능한 경계 확인 |
| B05 | 集英社文庫 product page; 발매 `2005-07-15` | 문고 1권, ISBN `4-08-618341-2`; 첫 네 story 외 추가 수록 있음 | https://www.shueisha.co.jp/books/items/contents.html?isbn=4-08-618341-2 | 첫 네 제목 순서의 독립 공식 cross-check만 사용 |
| B06 | 別冊マーガレット 1997년 1월호 archive, `1997` | 연재 시작호 | https://betsuma.shueisha.co.jp/memories/magazine/1995_1999/1997/01.html | 작품·작가·연재 시작 범위 cross-check만 사용 |

## 작품별 판정

### 1. エマ — `work-1fc61ddbeb429b4a2c15`

#### 남아 있던 공식 경로의 실행 결과

E01–E03의 product page가 가리키는 E04–E06을 각각 실제로 열었다. 세 URL 모두 해당 UUID를 유지한 채 `viewer-trial.bookwalker.jp`의 공식 trial viewer shell로 이동했다. HTTP 응답과 viewer HTML/CSS/loader는 도달했지만, 평가에 사용할 viewer configuration, 내부 페이지 image, 본문 text가 로드되지 않았다. 별도 명시적 권 소개도 E01–E02에는 없고, E03에서 확인되는 이용자 comment는 이번 미달 축을 책임 있게 판정할 공식 권별 사건 자료가 아니다.

따라서 이번 좁은 경로에서는 내부 페이지 번호·장면을 기록할 수 없다. 단순히 sample 링크가 존재한다는 사실을 Factor evidence로 쓰지 않았다.

#### 축 판정

- `progression=U`: 이미 확인된 관계 진전·이별·이동은 `characterArcWeight`, `romance`, `pacing` 근거다. 이를 성장·획득·숙련 보상으로 다시 세면 Dictionary의 progression과 관계 변화가 이중 계산된다.
- `strategy=U`: 1~3권에서 전술·계획이 반복 보상이라는 직접 장면을 얻지 못했다.
- `mysteryReveal=U`: 1~3권에서 단서·추리·진실 공개가 주요 또는 일부 보상이라는 직접 장면을 얻지 못했다.
- 이번 세 축은 허용된 supplemental user-review 축에도 포함되지 않는다. 이용자 평으로 공식 preview 부재를 우회하지 않았다.

#### 최종 벡터와 gate

- Narrative: `U / 0 / U / 2 / U / 4` = **3/6, 실패**
- Tone: `4 / 2 / U / 1 / 3 / 4 / U` = **5/7, 통과**
- 변경: 없음

#### blocker 후보 요건

- 후보 코드: `SOURCE_INFORMATION_UNAVAILABLE`
- 적용 범위: Narrative coverage
- 재현 조건: E01–E03은 도달하지만 권별 공식 설명이 미달 축을 다루지 않고, E04–E06은 공식 viewer shell 이후 내부 page corpus를 제공하지 않는다. progression/strategy/mysteryReveal은 user review로 보강할 수 없는 축이다.
- 재개 조건: 정확한 1~3권 판본에 연결된 공식 내부 page 또는 공식 권별 사건 설명이 새로 접근 가능해져, 성장·획득/계획/단서·공개 중 하나의 반복 구조를 직접 검증할 수 있을 때만 재개한다.

### 2. ギャラリーフェイク — `work-303d0a9d67a606a817af`

#### 공식 1권 preview의 직접 관찰

G01의 JDCN과 G02가 일치한다. reader pp.2–3에서 1권·첫 story identity를, pp.4–5 목차에서 ART.1 `贋作画廊`이 인쇄면 p.3에 시작하고 ART.2가 인쇄면 p.27에 시작함을 확인했다. 따라서 reader pp.6–27은 첫 주요 에피소드의 시작·종결을 포함하는 완결 표본이다.

저작권 문장을 전재하지 않고 사건만 요약하면 다음과 같다.

- reader pp.6–9: 정치가 Kaji의 Monet 요구, Fujita의 lighter/fake 장치, 반복되는 과장 반응이 나타난다.
- pp.10–15: curator Sakai의 판매 저지 요청, 거래·위작 판별이 이어지고 과장된 반응 gag가 다시 나오지만 사건 해결보다 우위에 있지는 않다.
- pp.16–19: Sakai가 총기로 위협받고 뚜렷한 공포를 보이나, blank/camera 장치로 위협이 짧게 해소된다.
- pp.20–23: 복원 작업과 숨겨진 진품 Monet 공개가 사건 해결을 이끈다.
- pp.24–27: Fujita가 진품의 가치를 진심으로 이해하는 평범한 노인에게 5만 엔에 작품을 넘기는 인간적 선택이 에피소드의 정서적 결말이 된다. 그 뒤에야 ART.2가 시작한다.

#### 축 판정

- `relationshipStructure=U`: Sakai가 한 에피소드 안에서 반복 등장한다는 사실만으로 여러 case를 관통하는 고정 party·핵심 조연 반복을 증명할 수 없다.
- `comedy=1`: 첫 에피소드 전반에 반응 gag가 여러 차례 있으므로 거의 없음 0보다는 높다. 다만 감정·거래·위작 해결에 종속되어 `중간중간 개그` anchor 2에는 못 미친다.
- `mentalStress=1`: 총기 위협과 공포는 직접 관찰되지만 짧고 에피소드 안에서 해소된다. 거의 없음 0과 혼합 긴장 2 사이의 bounded pressure다.
- `romance=0`: 완결된 첫 주요 에피소드 전체에서 연애 관계·flirtation·연애 보상이 작동하지 않는다. 장르 label이나 줄거리 누락이 아니라 완결 표본에 대한 positive absence다.
- `emotionalWarmth=2`: 범죄·위협과 공존하면서도 작품을 진심으로 대하는 평범한 사람을 택하는 인간적 선택이 사건의 중심 payoff다. 차가움 0도, 유대·힐링 중심 4도 아닌 혼합 anchor 2다.
- 기존 `characterArcWeight=1`, `darkness=2`는 현재 Pass B/C 결론을 유지한다.

G03은 과거 S24의 저자·timestamp·1권 상품 container를 정확히 재현했지만, 리뷰 claim의 실제 시간 범위가 1권 ART.1로 한정되지 않아 값 근거에서 제외했다. G04도 작품 전체 비평이므로 같은 이유로 보조 cross-check에만 두었다. 이번 known 값들은 G02만으로 직접 성립하며 user-review 다수결에 의존하지 않는다.

#### 최종 벡터와 gate

- Narrative: `U / 4 / U / 2 / 4 / 3` = **4/6, 통과**
- Tone: `1 / U / 1 / 2 / 1 / 0 / 2` = **6/7, 통과**
- 새로 종결한 값: `comedy=1`, `mentalStress=1`, `romance=0`, `emotionalWarmth=2`
- Text gate: **닫힘**
- Text blocker 후보: 없음

### 3. バラ色の明日 — `work-440f93a4e60ef906685b`

#### 1997 standard 1권 ↔ 2009 re-edition 1권 매핑

B01은 동결 ISBN `9784088487090`의 ISBN-10 `4-08-848709-5`, 발매일 `1997-09-25`를 명시하고 다음 네 story를 이 순서로 싣는다.

1. `狸ばやしがきこえる`
2. `巷に雪の降る如く`
3. `fight！`
4. `お日さまの日々`

B02의 2009 re-edition 1권 목차는 다음과 같다.

1. `狸ばやしがきこえる` — p.7
2. `巷に雪の降る如く` — p.59
3. `fight!` — p.107
4. `お日さまの日々` — p.159
5. 작가 commentary — p.210

첫 네 story의 제목과 순서가 item-for-item으로 일치한다. `fight！`와 `fight!`의 전각/반각 punctuation 차이는 동일 위치의 표기 변형이며 별개 story를 뜻하지 않는다. 제목 비교에는 바깥 인용 기호를 포함하지 않았다. B05의 문고판 목차도 첫 네 제목 순서를 독립적으로 뒷받침한다. 따라서 **story title/order mapping 자체는 성공**이다.

#### reader 표본 경계

B03이 로드하는 B04는 같은 JDCN의 image를 `P0000`부터 `P0051`까지만 노출하고, 이후 p.52–214는 미노출로 표시한다. B02 목차상 둘째 story는 인쇄면 p.59에 시작한다. 따라서 공식 reader 표본은 첫 story의 일부만 포함하며 둘째 story에 도달하지 않는다.

노출된 첫 story 일부에서는 Rika와 언니의 약혼자를 둘러싼 금지된 감정, 언니의 과거 파혼·출산 관련 상처, 감정 은폐와 가족 갈등을 직접 확인했다. 그러나 첫 story 자체도 끝까지 제공되지 않고, 나머지 세 story의 실제 내부 page는 0쪽이다. 이는 요청된 `여러 story 표본`이 아니다.

#### 축 판정

- `pacing=U`: anthology에서 cast가 바뀐다는 목차 사실은 각 story 내부의 목표·상태 변화 cadence를 증명하지 않는다.
- `progression=U`, `mysteryReveal=U`, `worldBuilding=U`: 판본 매핑은 해결했지만, 네 story의 반복 reward 또는 0 anchor를 판정할 내부 표본은 없다. B01의 한 문장 synopsis 네 개만으로 부재를 확정하지 않았다.
- `relationshipStructure=U`: 서로 무관한 anthology cast는 Dictionary의 고정 party·핵심 조연 반복이나 복잡한 군상극으로 자동 변환되지 않는다. story-level 관계 topology가 필요하다.
- `mentalStress=U`: 첫 story 일부의 압박은 관찰되지만, entry 전체에서의 빈도·지속성을 대표하지 못한다.
- 기존 `characterArcWeight=4`, `romance=4`, `emotionalWarmth=1`은 현재 Pass B/C 결론을 유지한다.

#### 최종 벡터와 gate

- Narrative: `U / U / U / U / U / U` = **0/6, 실패**
- Tone: `4 / U / U / U / U / 4 / 1` = **3/7, 실패**
- 변경: 없음. edition mapping만 `resolved`로 닫혔다.

#### blocker 후보 요건

- 후보 코드: `SOURCE_INFORMATION_UNAVAILABLE`
- 적용 범위: Narrative와 Tone coverage
- 재현 조건: 1997↔2009 story title/order는 B01–B02로 입증되지만, B03–B04의 공식 내부 표본은 story 1 일부에서 종료한다. 여러 story의 cadence, 0 anchor, relationship topology, stress 빈도를 직접 비교할 수 없다. 현재 확보한 scoped user review도 복수·독립·story 대응 요건을 충족하지 않는다.
- 재개 조건: standard판 또는 매핑된 재편집판의 story 2–4 공식 내부 page가 추가 공개되거나, 같은 story들에 직접 대응하는 충분히 상세한 공식 설명이 확보될 때 재개한다. 단순 목차·한 줄 synopsis·anthology 형식만으로 0을 채우지 않는다.

## 원장 반영을 위한 최소 handoff

- エマ: 공식 1~3권 preview route를 `attempted-exhausted`로 기록하고, N/T는 변경하지 않는다. Narrative blocker candidate를 Pass C에 보낸다.
- ギャラリーフェイク: Tone의 `comedy=1`, `mentalStress=1`, `romance=0`, `emotionalWarmth=2`를 G02의 정확한 page observation에 연결한다. `relationshipStructure`는 `unknown` 유지한다. N 4/6, T 6/7로 text gate를 닫는다.
- バラ色の明日: 1997 standard 1권과 2009 re-edition 1권의 title/order mapping은 resolved로 기록한다. preview sample은 `1 story partial / 4 stories`이므로 Factor는 변경하지 않고 양 gate blocker candidate를 Pass C에 보낸다.
- 임시 viewer capture나 image 파일은 source artifact로 커밋하지 않는다. 이 조사에서는 URL, 판본/JDCN·ISBN, page 범위, 직접 관찰, 조회일만 보존 대상으로 삼았다.
- 이 보고서는 `/tmp` 산출물이며 저장소 파일을 수정하지 않는다.
