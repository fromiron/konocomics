# Pilot 001 Text coverage gap B 독립 검수

- 대상 Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- 검수일·외부 출처 조회일: `2026-08-23`
- Factor 범위: `entry_1_3_volumes` 또는 첫 주요 에피소드
- 기준: `docs/factors/factor-dictionary.md`의 0/2/4 anchor, Narrative `>= 4/6`, Tone `>= 5/7`
- 입력 기준선: 현재 Pass B/C인 `text-pass-bc-chunks-01-02.md`
- 독립성: `/tmp/pilot-text-gap-b.md`의 결론을 정답으로 전제하지 않고, 사전·현행 gate·공식 판본 URL·보존 표본을 다시 확인했다.
- 변경 범위: 저장소를 수정하지 않았다. 이 문서는 `/tmp` 검수 산출물일 뿐 registry 승격이나 blocker 확정이 아니다.

표기 순서는 다음과 같다.

- Narrative: `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`
- Tone: `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`
- `U`: `unknown`. 낮은 값이나 0의 대용이 아니다.
- `ACCEPT`: 현재 Pass B/C 값을 근거와 함께 유지한다.
- `CORRECT`: 현재 Pass B/C의 값 또는 `unknown`을 새 근거로 정정한다.
- `UNKNOWN`: 확인 범위로는 0까지도 입증할 수 없어 `unknown`으로 종결한다.

## 결론

| workId | canonicalTitle | Narrative | Tone | Text disposition | hard blocker |
|---|---|---:|---:|---|---|
| `work-1fc61ddbeb429b4a2c15` | エマ | `1 / 0 / U / 2 / U / 4` = **4/6 통과** | `4 / 2 / U / 1 / 3 / 4 / U` = **5/7 통과** | text-ready | 없음 |
| `work-303d0a9d67a606a817af` | ギャラリーフェイク | `U / 4 / U / 2 / 4 / 3` = **4/6 통과** | `1 / U / 1 / 2 / 1 / 0 / 2` = **6/7 통과** | text-ready | 없음 |
| `work-440f93a4e60ef906685b` | バラ色の明日 | `0 / 0 / 0 / U / 0 / 0` = **5/6 통과** | `4 / U / U / 2 / 2 / 4 / 1` = **5/7 통과** | N/T-ready, Theme-adjudication | 없음 |

핵심 정정은 세 가지다.

1. エマ는 BOOK WALKER viewer 한 경로가 실패했어도, 정확한 3권에 대응하는 공식 권 소개와 정식 영문판 3권 소개가 남아 있다. `progression=1`을 입증해 Narrative gate가 닫힌다. `SOURCE_INFORMATION_UNAVAILABLE`은 성립하지 않는다.
2. ギャラリーフェイク는 보존된 공식 1권 preview가 첫 주요 에피소드의 시작과 끝을 모두 포함한다. 새 Tone 4축은 완결 표본의 관찰로 재현되며 양 gate가 닫힌다.
3. バラ色の明日は 1권 한 경로만 본 뒤 정보 고갈로 판정할 수 없다. 동결 standard 2·3권의 구 集英社 공식 product archive를 ISBN으로 다시 열어 entry 1~3권 모든 story item의 공식 소개와 재편집판 mapping을 확인했다. 각 item의 지배적 갈등·보상이 일관되게 관계극이고 다른 Narrative 보상이 거의 없다는 positive comparison으로 Narrative 5/6, Tone 5/7에 도달한다. Theme는 별도 adjudication이 필요하다.

축 판정 합계는 `ACCEPT 17`, `CORRECT 12`, `UNKNOWN 10`, 총 39축이다. Narrative 통과 3/3, Tone 통과 3/3, 양쪽 동시 통과 3/3, 이번 text 검수에서 확정할 hard blocker는 0개다.

## 계약 재확인

### known 0과 unknown

`known 0`은 자료가 없다는 뜻이 아니라 평가 범위에서 해당 보상 또는 특성이 거의 없다는 positive observation이 있어야 한다. 요약문에 언급되지 않았거나 장르가 아니라는 사유만으로 0을 만들지 않았다. 반대로 `unknown`은 값이 낮다는 뜻이 아니며 거리·감점에 수치로 들어가면 안 된다.

이번 검수에서 새로 유지하는 0은 ギャラリーフェイク의 `romance=0`뿐이다. 이는 장르나 synopsis 누락이 아니라, 완결된 첫 주요 에피소드 전체에서 연애 관계·flirtation·연애 payoff가 작동하지 않았다는 직접 관찰이다.

### 현재 gate

`src/domain/catalog/constants.ts`와 `scripts/build-promotion-registry.ts`를 다시 확인했다.

- Narrative: known 비율 `>= 0.6`, 6축 중 최소 4축
- Tone: known 비율 `>= 0.6`, 7축 중 최소 5축
- Art: known 비율 `>= 0.3`; `notApplicable`이 없어 분모가 4인 경우 최소 2축
- `annotationStatus=complete`: 17축 행, Genre 1개 이상, Theme 1개 이상, 세 coverage, recommendation context를 함께 요구한다.

따라서 이 문서의 `text-ready`는 전체 promotion 승인과 같지 않다. 현행 Art final matrix에서 エマ와 バラ色の明日は Art 0/4, ギャラリーフェイク는 Art 3/4다. 또한 バラ色の明日は 책임 있게 확정된 Theme가 아직 0개다.

## 출처 원장

모든 URL은 2026-08-23에 다시 확인했다. 페이지 자체 발표일이 없으면 `undated`로 기록하고, 페이지가 명시한 책 발매일은 별도로 남겼다.

### エマ

| ID | 출처 | 발표일·연도 | 판본·범위 | URL |
|---|---|---|---|---|
| E01 | KADOKAWA 공식 product | 1권 발매 `2002-08-30` | 1권, ISBN `9784047298804` | https://www.kadokawa.co.jp/product/301407000933/ |
| E02 | KADOKAWA 공식 product | 2권 발매 `2003-02-24` | 2권, ISBN `9784047302884` | https://www.kadokawa.co.jp/product/301502000864/ |
| E03 | KADOKAWA 공식 product | 3권 발매 `2003-11-25` | 3권, ISBN `9784047302891` | https://www.kadokawa.co.jp/product/301502000865/ |
| E04 | BOOK WALKER 공식 series/product descriptions | undated; 1권 전자 배포 `2014-01-14` 표기 | 일본어 단행본 1~3권 소개, 10권 series identity | https://bookwalker.jp/series/11626/ |
| E05 | Yen Press 정식 라이선스판 product | `2018-11-27` | digital single-volume 3권, ISBN `9781975356583` | https://yenpress.com/titles/9781975356583-emma-vol-3 |

E05 한 페이지에는 digital single-volume 메타데이터와 2015년 hardcover omnibus 메타데이터가 함께 표시된다. 이번 검수는 10권 digital series의 3권 ISBN `9781975356583`과 해당 synopsis만 썼다. 372쪽 hardcover ISBN `9780316304450`은 entry 3권 mapping 근거로 쓰지 않았다. E05의 새 저택 이동·가사 노동 적응 사건은 E04 일본어 3권의 런던 이탈 이후 국면과 일치한다.

### ギャラリーフェイク

| ID | 출처 | 발표일·연도 | 판본·범위 | URL |
|---|---|---|---|---|
| G01 | 小学館 eコミックストア 공식 product | undated | 1권, JDCN `091830210000d0000000`, 동결 ISBN `9784091830210` 대응 | https://e-comi.shogakukan.co.jp/books/091830210000d0000000 |
| G02 | 小学館 eコミックストア 공식 reader | undated | 같은 JDCN의 reader pp.2~28, ART.1 완결 및 ART.2 시작 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091830210000d0000000 |

G02는 URL·JDCN·목차·에피소드 경계가 재현되는 1차 근거다. 이전 packet의 honto와 LOMICO는 범위가 첫 에피소드로 고정되지 않아 새 값에 사용하지 않았다.

### バラ色の明日

| ID | 출처 | 발표일·연도 | 판본·범위 | URL |
|---|---|---|---|---|
| B01 | 集英社 구 공식 product의 Internet Archive 보존본 | 책 발매 `1997-09-25`; capture `2004-08-20` | 동결 standard 1권, ISBN-10 `4-08-848709-5`, ISBN-13 `9784088487090`, 네 story 소개 | https://web.archive.org/web/20040820212024id_/http://books.shueisha.co.jp:80/CGI/search/syousai_put.cgi?isbn_cd=4-08-848709-5&mode=1 |
| B01-2 | 集英社 구 공식 product의 Internet Archive 보존본 | 책 발매 `1998-01-23`; 같은 archive endpoint | 동결 standard 2권, ISBN-10 `4-08-848760-5`, ISBN-13 `9784088487601`, 제5화 네 연재분과 1권 제4화의 연속성 소개 | https://web.archive.org/web/20040820212024id_/http://books.shueisha.co.jp:80/CGI/search/syousai_put.cgi?isbn_cd=4-08-848760-5&mode=1 |
| B01-3 | 集英社 구 공식 product의 Internet Archive 보존본 | 책 발매 `1998-08-25`; 같은 archive endpoint | 동결 standard 3권, ISBN-10 `4-08-848850-4`, ISBN-13 `9784088488509`, 제6~8화 item별 소개 | https://web.archive.org/web/20040820212024id_/http://books.shueisha.co.jp:80/CGI/search/syousai_put.cgi?isbn_cd=4-08-848850-4&mode=1 |
| B02 | 集英社 공식 product | 종이 `2009-07-24`; 전자 `2013-04-09` | 재편집 1권, JDCN `08782229848709315501`, 네 story 제목·순서 | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782229848709315501 |
| B03R | 集英社 공식 reader | undated | 재편집 1권 | https://www.shueisha.co.jp/books/reader/main.php?cid=08782229848709315501 |
| B03M | 集英社 공식 reader manifest | undated | 재편집 1권, 노출 `P0000`~`P0051`, 이후 p.52~214 미노출 | https://mangabroadcast.jp/contents/08782229848709315501/commercial/content.js |
| B04 | 集英社 공식 product | 종이 `2009-07-24`; 전자 `2013-04-09` | 재편집 2권, 제5화 단일 장편 수록, JDCN `08782230848709315501` | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782230848709315501 |
| B05 | 集英社 공식 reader | undated | 재편집 2권 | https://www.shueisha.co.jp/books/reader/main.php?cid=08782230848709315501 |
| B06 | 集英社 공식 reader manifest | undated | 재편집 2권, `P0000`~`P0025`, `AddressList [[0,25,0,25],[-1,-1,26,210]]` | https://mangabroadcast.jp/contents/08782230848709315501/commercial/content.js |
| B07 | 集英社 공식 product | 종이 `2009-08-25`; 전자 `2013-04-09` | 재편집 3권, 세 story 수록, JDCN `08782231848709315501` | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782231848709315501 |
| B08 | 集英社 공식 reader | undated | 재편집 3권 | https://www.shueisha.co.jp/books/reader/main.php?cid=08782231848709315501 |
| B09 | 集英社 공식 reader manifest | undated | 재편집 3권, `P0000`~`P0025`, `AddressList [[0,25,0,25],[-1,-1,26,182]]` | https://mangabroadcast.jp/contents/08782231848709315501/commercial/content.js |
| B10 | 紀伊國屋書店 product가 제공하는 読書メーター review | `2012-05-16`, `2017-06-13` | 완전판 1권 ISBN `9784087822298`; 무거움·미종결감에 대한 서로 다른 reviewer | https://www.kinokuniya.co.jp/f/dsg-01-9784087822298 |
| B11 | コミックシーモア reader review | `2026-01-25` | reviewer가 1권을 읽었다고 범위를 명시; 괴로움·어두움·잔여 온기 관찰 | https://www.cmoa.jp/title/customer_review/title_id/62532/?site_kbn=1 |
| B12 | あずきv2의 권·story별 감상 | `2023-12-21` | standard 1권 네 story와 1~3권을 명시; 비극적 일상 갈등·열린 결말·온기 관찰 | https://ameblo.jp/azukiv2omame/entry-12833363858.html |
| B13 | 集英社 S-MANGA 공식 선집 product | 전자 `2013-10-25` | 작품에서 고른 네 episode와 인터뷰가 있는 보조 경로; entry 판본 권 대응 전에는 보조로만 사용 | https://www.s-manga.net/items/contents.html?jdcn=08C00014T00005305501 |

B01 계열은 live HTML의 Shift_JIS를 UTF-8로 변환해 ISBN·발매일·수록화·소개를 대조했다. B01의 권 선택 목록 자체가 standard 2권 ISBN `4-08-848760-5`와 3권 ISBN `4-08-848850-4`를 연결하고, 각 ISBN endpoint가 200 응답과 해당 권 정보를 돌려준다.

B10~B12는 서로 다른 domain·account이고 동일 문장을 복제하지 않는다. 별점이나 호불호가 아니라 scoped observation의 일치만 보조 Evidence로 썼다. 리뷰 원문은 사용자 설명으로 전용하지 않는다.

## 작품별 축 판정

### エマ — `work-1fc61ddbeb429b4a2c15`

#### Narrative

| axis | decision | final | 근거 |
|---|---|---:|---|
| `progression` | **CORRECT** | `known 1` | E05는 정확한 digital 3권에서 Emma가 새 저택의 복잡한 가사 노동을 배우고 노력으로 적응하는 과정을 하나의 도전으로 명시한다. 성장·획득이 거의 없는 0보다는 높지만, 1~3권 전체에서 반복적 숙련 보상이 중심인 2까지는 입증하지 못해 중간값 1이다. 관계 변화 자체를 progression으로 중복 계산한 것이 아니다. |
| `problemSolving` | **ACCEPT** | `known 0` | E04의 1~3권 사건 전개는 계급 장벽 아래의 감정적 선택·이별·이동으로 해결된다. 제약 분석과 기발한 해결이 보상인 구조가 아님을 세 권 순차 소개에서 확인한다. |
| `strategy` | **UNKNOWN** | `U` | 장기 계획·정치·자원 운영 또는 반복 전술을 직접 입증할 자료가 없다. 계급 사회라는 소재만으로 값을 만들지 않는다. |
| `pacing` | **ACCEPT** | `known 2` | 만남과 관계 진전, 계급 충돌, 이별, 런던 이탈, 새 저택 이동은 일반적인 arc 단위 상태 변화다. 짧은 간격의 대폭 변화 4는 아니다. |
| `mysteryReveal` | **UNKNOWN** | `U` | 비밀·단서·추리·진실 공개가 entry 보상이라는 직접 근거가 없다. synopsis 누락만으로 0을 만들지 않는다. |
| `worldBuilding` | **ACCEPT** | `known 4` | 빅토리아 시대의 계급·가사 노동·사회 규칙이 관계와 선택을 반복적으로 제약한다. 단순 배경이 아니라 entry 사건을 구동한다. |

Final Narrative: `1 / 0 / U / 2 / U / 4` = **4/6, 통과**.

#### Tone

| axis | decision | final | 근거 |
|---|---|---:|---|
| `characterArcWeight` | **ACCEPT** | `known 4` | Emma와 William의 동기·감정·선택 변화가 entry의 핵심 보상이다. |
| `relationshipStructure` | **ACCEPT** | `known 2` | 두 주인공과 계급 장벽을 매개하는 핵심 주변 인물이 반복되지만 복잡한 군상극 4는 아니다. |
| `comedy` | **UNKNOWN** | `U` | entry 전체의 gag 빈도를 판정할 scoped 근거가 없다. |
| `darkness` | **ACCEPT** | `known 1` | 죽음·계급 모욕·이별이 있으나 비극 자체가 중심인 2 이상보다는 낮다. |
| `mentalStress` | **ACCEPT** | `known 3` | 이룰 수 없는 사랑, 계급 압박, 상실과 이별이 여러 권에서 이어져 혼합 2보다 강하지만 심리 붕괴 지속 4까지는 아니다. |
| `romance` | **ACCEPT** | `known 4` | 신분 차 연애가 주요 관계와 전개의 중심이다. |
| `emotionalWarmth` | **UNKNOWN** | `U` | 애정의 존재와 힐링·따뜻함이 핵심 보상인지는 별도 축이다. 현재 소개만으로 빈도와 중심성을 확정하지 않는다. |

Final Tone: `4 / 2 / U / 1 / 3 / 4 / U` = **5/7, 통과**.

#### Genre, Theme, blocker

- Genre: **ACCEPT** `historical;romance`.
- Theme: **ACCEPT** `workplace=2; historicalReconstruction=2`. 새 저택의 domestic-service 적응은 workplace가 단순 직함만이 아님을 보강하고, 시대의 계급·생활 규칙은 반복 핵심이다.
- Text blocker: **없음**. `/tmp/pilot-text-gap-b.md`의 `SOURCE_INFORMATION_UNAVAILABLE` 후보를 **기각**한다. BOOK WALKER trial viewer의 내부 image 로딩 실패는 한 delivery route의 실패일 뿐이고, E04와 E05에 판본이 연결된 사용 가능한 공식 설명이 있다.
- 남은 전체 promotion 경계: 현재 Art 0/4이므로 이 text 판정만으로 전체 승격을 승인하지 않는다. 정식 digital 1~3권 sample의 다른 배포처 또는 라이선스판 내부 preview를 판본 매핑 후 재검수하는 경로가 남는다.

### ギャラリーフェイク — `work-303d0a9d67a606a817af`

G02의 목차와 보존 sample에서 ART.1은 reader pp.6~27에 시작·종결하고 ART.2는 p.28에서 시작한다. 따라서 첫 주요 에피소드 전체를 평가 범위로 쓸 수 있다.

#### Narrative

| axis | decision | final | 근거 |
|---|---|---:|---|
| `progression` | **UNKNOWN** | `U` | Fujita가 사건을 해결하지만 성장·획득·숙련 보상이 반복되는지는 첫 episode와 공식 소개만으로 확정할 수 없다. |
| `problemSolving` | **ACCEPT** | `known 4` | 위작 장치, 감정·복원·진품 판별을 통해 제약을 분석하고 사건을 해결하는 과정이 핵심이다. |
| `strategy` | **UNKNOWN** | `U` | 한 case의 속임수는 장기 계획·전쟁·정치·자원 운영 중심 구조를 입증하지 않는다. |
| `pacing` | **ACCEPT** | `known 2` | 독립 case 단위로 목표와 상태가 바뀌는 일반적인 episode cadence다. |
| `mysteryReveal` | **ACCEPT** | `known 4` | 위작 아래 숨은 진품과 그 판별·공개가 첫 episode의 주요 보상이고 공식 1권 case 소개도 같은 구조를 반복한다. |
| `worldBuilding` | **ACCEPT** | `known 3` | 감정, 위작, 복원, 거래 규칙이 사건을 반복 구동해 기능적 2보다 높지만 최대 4의 광범위한 역사·세력 체계까지는 아니다. |

Final Narrative: `U / 4 / U / 2 / 4 / 3` = **4/6, 통과**.

#### Tone

| axis | decision | final | 근거 |
|---|---|---:|---|
| `characterArcWeight` | **ACCEPT** | `known 1` | case의 판단과 미술품 정체가 주된 보상이며 Fujita의 장기 변화는 낮다. 다만 마지막 인간적 선택이 있어 완전한 0은 아니다. |
| `relationshipStructure` | **UNKNOWN** | `U` | Sakai가 첫 episode에 반복 등장해도 여러 case를 관통하는 고정 party·핵심 조연 반복은 입증되지 않는다. |
| `comedy` | **CORRECT** | `known 1` | pp.6~15와 결말부에 과장 반응 gag가 반복되지만 사건 해결에 종속된다. 거의 없음 0과 중간중간 개그 2 사이의 값이다. |
| `darkness` | **ACCEPT** | `known 2` | 총기 위협·사기·범죄 위험이 실제로 존재하지만 암울함 자체가 중심은 아니다. |
| `mentalStress` | **CORRECT** | `known 1` | pp.16~19의 총기 위협과 명시적 공포는 pressure의 positive evidence다. 다만 같은 episode 안에서 짧게 해소되어 혼합 긴장 2보다 낮다. |
| `romance` | **CORRECT** | `known 0` | 완결된 첫 주요 episode 전체에 연애 관계·flirtation·연애 payoff가 없다. synopsis 생략이 아닌 평가 범위 전체의 positive absence다. |
| `emotionalWarmth` | **CORRECT** | `known 2` | pp.20~27에서 진품을 발견한 뒤, 진심으로 작품을 이해하는 평범한 사람에게 낮은 가격으로 넘기는 인간적 선택이 episode의 중심 정서적 payoff다. 범죄 위험과 공존하므로 따뜻함 중심 4는 아니다. |

Final Tone: `1 / U / 1 / 2 / 1 / 0 / 2` = **6/7, 통과**.

#### Genre, Theme, blocker

- Genre: **ACCEPT** `mystery`.
- Theme: **ACCEPT** `investigation=2; workplace=2`. 미술품 진위 조사와 Gallery Fake의 직업적 거래·복원이 반복 사건 구조다.
- Text blocker: **없음**. 공식 완결 episode로 양 coverage가 재현된다.
- Art 경계: 현행 final matrix의 `artRealism=3`, `artDensity=3`, `visualSoftness=1`, `motionImpact=U`는 별도 Local+Gemini quorum 산출물이다. 이 text 검수는 Art 값을 재판정하지 않았지만 Art 3/4 coverage가 현재 gate를 통과함은 확인했다.

### バラ色の明日 — `work-440f93a4e60ef906685b`

B01과 B02는 standard 1권과 2009 재편집 1권의 첫 네 story 제목과 순서를 item-for-item으로 일치시킨다. 전각·반각 느낌표 차이는 동일 위치의 표기 변형이다. B01-2는 standard 2권이 1권 제4화의 후속인 제5화 네 연재분임을 밝히며, B04의 재편집 2권도 같은 제5화의 네 부분을 같은 순서로 싣는다. B01-3은 standard 3권의 제6~8화를 item별로 소개하고, B07의 재편집 3권 목차가 같은 제6~8화를 같은 순서로 싣는다. 따라서 **동결 standard 1~3권과 재편집 1~3권의 entry mapping은 모두 resolved**다.

B03M의 1권 내부 표본은 첫 story 일부에서 끝난다. B06과 B09의 2·3권 manifest는 각각 26쪽을 공개하지만, raw `M_H.jpg`는 tile-scrambled 상태라 이번 text 값에 사용하지 않았다. 이는 browser-rendered preview 경로가 남아 있다는 뜻이지 정보가 없다는 뜻이 아니다. Narrative의 low anchor는 내부 page 부재가 아니라, 아래처럼 original standard 1~3권 공식 소개가 entry 제1~8화를 빠짐없이 특정하고 각 item의 지배적 갈등·보상을 관계극으로 설명한다는 positive comparison으로 판정했다.

#### Narrative

| axis | decision | final | 근거 |
|---|---|---:|---|
| `progression` | **CORRECT** | `known 0` | B01~B01-3은 entry 제1~8화의 보상을 연애·가족·관계 선택으로 일관되게 열거한다. 숙련·획득·훈련 보상은 반복되지 않는다. 연애 관계의 진전을 이 축의 성장으로 중복 계산하지 않는다. |
| `problemSolving` | **CORRECT** | `known 0` | 같은 연속 공식 소개에서 갈등의 보상은 고백·재회·이별·감정적 선택이다. 제약 분석과 기발한 해결 과정이 핵심인 2/4와 positive contrast를 이룬다. 단순 synopsis keyword 누락이 아니다. |
| `strategy` | **CORRECT** | `known 0` | 제1~8화 전체 공식 소개에서 전술·장기 계획·정치·자원 운영이 보상으로 작동하지 않고 관계 속 직접·감정적 대응이 반복된다. anthology라는 label만으로 0을 만든 것이 아니다. |
| `pacing` | **UNKNOWN** | `U` | cast/story 교체는 각 story 내부의 목표·장소·상태 변화 cadence와 다르다. B12의 비극적이지 않은 일상 순간이라는 관찰만으로 값까지 확정하지 않는다. |
| `mysteryReveal` | **CORRECT** | `known 0` | B01~B01-3이 제1~8화의 명시적 payoff를 관계 감정으로 모두 열거하며, 단서·추리·진실 공개를 보상으로 삼는 episode가 없다. review의 열린 결말 주장으로 0을 만든 것이 아니다. |
| `worldBuilding` | **CORRECT** | `known 0` | 세 권의 모든 item별 공식 소개에서 현대 일상 배경은 관계를 담는 무대이며, 역사·문화·규칙·세력이 결정을 반복 제약하지 않는다. Genre label이 아니라 item-complete entry description과 2/4 anchor의 positive comparison이다. |

Final Narrative: `0 / 0 / 0 / U / 0 / 0` = **5/6, 통과**.

#### Tone

| axis | decision | final | 근거 |
|---|---|---:|---|
| `characterArcWeight` | **ACCEPT** | `known 4` | B01~B01-3은 제1~8화 모두 인물의 감정·관계 선택을 핵심으로 소개하고, B12의 story별 범위가 이를 교차 확인한다. |
| `relationshipStructure` | **UNKNOWN** | `U` | 서로 무관한 anthology cast는 단독 주인공 0, 고정 party 2, 복잡한 군상극 4 중 어느 하나로 자동 변환되지 않는다. |
| `comedy` | **UNKNOWN** | `U` | 한 story의 우스운 장면이나 한 reviewer의 표현만으로 entry 전체 gag 빈도를 확정하지 않는다. |
| `darkness` | **CORRECT** | `known 2` | B01의 금지된 사랑·재회와 이별, B01-3의 연인 상실과 비련, B12의 1권 story별 갈등과 신체적 폭력, B10~B11의 독립적인 무거움·어두움 관찰이 `진지한 위험·비극 존재` anchor를 충족한다. 따뜻함과 전향적 framing도 공존하므로 4는 아니다. |
| `mentalStress` | **CORRECT** | `known 2` | 첫 story 보존 sample의 감정 은폐·가족 갈등, B01-2의 막힌 관계, B01-3의 상실·복잡한 관계, B12의 1권 story별 갈등, B10~B11의 괴로움·미종결감이 혼합 압박을 반복 입증한다. 심리 붕괴가 지속되는 4 또는 그에 가까운 3은 과하다. |
| `romance` | **ACCEPT** | `known 4` | B01~B01-3의 제1~8화 대부분이 연애·가족 관계를 주된 전개와 보상으로 삼는다. |
| `emotionalWarmth` | **ACCEPT** | `known 1` | B01의 따뜻한 관찰·전향적 framing, B01-2의 애정 중심 framing, B11~B12의 잔여 온기가 positive evidence다. 다만 괴로움과 열린 결말 속 작은 잔여라 혼합 2보다 낮다. |

Final Tone: `4 / U / U / 2 / 2 / 4 / 1` = **5/7, 통과**.

#### Genre, Theme, blocker

- Genre: **ACCEPT** `sliceOfLife;romance`.
- Theme: **UNKNOWN**, 최종 행 `[]` 유지. 22개 vocabulary에는 관계 anthology 자체를 표현하는 Theme가 없다. B01의 세 번째 story가 영어학교 접수원의 연애라는 사실만으로 `workplace`를 만들면 직장 배경과 직업 mechanic을 혼동한다.
- N/T disposition: **text-ready**. Theme와 Art는 별도 gate다.
- `/tmp/pilot-text-gap-b.md`의 `SOURCE_INFORMATION_UNAVAILABLE` 후보를 **기각**한다. 1권 reader 한 경로가 부분 표본이라는 사실과 작품 정보가 실질적으로 존재하지 않는다는 사실은 다르다. B01~B01-3에 정확한 original entry 공식 설명이 있고, B04~B09의 공식 browser-rendered preview 및 B13 경로도 남아 있다.
- `FACTOR_MODEL_INCOMPATIBLE`도 아직 확정할 수 없다. Theme 0개와 registry의 `themeCount > 0` 충돌은 adjudication 항목이다. 증거 없이 `workplace=1`을 넣거나 validator를 약화해서는 안 된다.
- 현행 Art final matrix의 종료 사유 `edition-gate-failed`는 이번 standard 1~3권 item mapping으로 전제가 해소됐다. Art 값 자체가 생긴 것은 아니므로 0/4 상태는 유지하되, 해당 행은 공식 browser-rendered 2·3권 표본으로 재검수해야 한다.

#### 재현 가능한 남은 검수 경로

1. Theme는 1권 세 번째 story 또는 다른 entry episode에서 직업 mechanics가 실제 서사 보상으로 작동할 때만 `workplace=1`을 검토한다. B13의 선집은 해당 episode가 original entry 1~3권과 item mapping될 때만 보조하며, 선집 자체를 representative edition으로 바꾸지 않는다.
2. 끝내 canonical Theme가 없으면 `themeCount > 0` 계약과 `FACTOR_MODEL_INCOMPATIBLE` 여부를 Pass C에서 명시적으로 판정한다. 약한 Theme를 붙이거나 validator를 완화하지 않는다.
3. Art 재검수에는 mapping이 끝난 B06과 B09의 `P0000`~`P0025`를 **공식 browser viewer로 렌더링**한다. raw `M_H.jpg`는 tile-scrambled이므로 시각 근거로 쓰지 않는다. URL, 판본, page, scene context, SHA-256만 보존하고 임시 이미지는 커밋하지 않는다.
4. `motionImpact`는 정확한 연속 동작 시작·끝이 확보될 때만 known으로 만들고, 그 외에는 unknown 또는 조건이 맞으면 `notApplicable`을 사전 정의대로 판단한다.

## 보존 내부 표본 검증

임시 파일은 커밋 대상이 아니다. 아래 hash는 이번 독립 검수에서 실제 파일을 다시 계산한 값이다.

### ギャラリーフェイク

- 경로: `/tmp/pilot-gallery-preview.Sy5SHY/`
- 공식 원본: G02
- 범위: `spread-02.png`~`spread-28.png`, 목차와 ART.1 전체 및 ART.2 시작
- 판정에 직접 쓴 구간: pp.6~15 gag/위작 거래, pp.16~19 총기 위협, pp.20~23 진품 공개, pp.24~27 인간적 선택, p.28 다음 episode 시작

```text
spread-02.png a0ce666918b2512bff201afc7a545e537e45080d9f7a811337fd835be3245cce
spread-04.png 075f79de4005c1cd9127d492153a375a733d464bdfc7acc899f375ff11a7f8a2
spread-06.png 51810ad4bb460192b40b41ef4e111306b4ab4205c868124073ba75825805beef
spread-08.png c34917566bb9d9fec26021d2182940014a0462ad70ca475a5b5454ce3b1eed1e
spread-10.png b1871930acbd85929a9a27363257211ab0c1726a70839b3262fea1faccafde83
spread-12.png 0ea10a2c134338237bea2b7fd5645bb0413ebf39d49e7f64a832784d600c167c
spread-14.png 8514dfc8dfde057f16dbe519449fab3f0c1e8f6c040260cced635450ce153d07
spread-16.png 2b8b43b2303bb1868306377bca859ed2095c221dc61b28625d08fb04578071ea
spread-18.png 50a63b62e811ac68adea7efc16268f3cc8e659a5d39f843f802d16ce8d16903d
spread-20.png 89043c27e33dcda3e1893590ada6ccfe5662722b5296b25bf8c379ba4c65b584
spread-22.png 1a7cc5fba653d991cabf10c62500dcb035ac20a3daac8ddeb38d96ccc0b101dd
spread-24.png f278dc2e1fac0fa37dc0bef1dd8d241a9fea3b6c9293815fdb2356f1ef09fdee
spread-26.png 9005e6aa22d1549e8c6d787ceeef3a570ceb02eb511e785c615406b3a5b221e0
spread-28.png 06c8acee1d43de1d5827d575316679ddd1581b364816a401fbb80c0a05059607
```

### バラ色の明日

- 경로: `/tmp/pilot-barairo-preview.sSAEH9/`
- 공식 원본: B03R·B03M
- 유효 corrected capture: `real-spread-40.png`~`real-spread-52.png`
- 범위 한계: 첫 story 후반 일부뿐이다. 여러 story 표본이나 1권 완결 표본으로 취급하지 않았다.

```text
real-spread-40.png 629408a1a904486c96b05b91f8c301ec1fe7e8ff84fb09728c78757c655bc9a6
real-spread-42.png ab6499eb8c2f48b5f3811ee5b17b1e5b508951c98362278fe36ae39349a6ff5e
real-spread-44.png f66d477a0405fbadafa6dd81012c571ba4d983fd7faffd608602a84f45aea295
real-spread-46.png 0f3617025226cd8965253f06b38854aa236262bff78d06ef5bd396677178c18f
real-spread-48.png 73aff441edd4489a96c8b9980880fe8368b10fb1547eab8f14238d37df7d7b56
real-spread-50.png cef5d4418ed3d9c86d9d357d4b9864e3acc54ed61761040afa15ff7e9095ba07
real-spread-52.png 626d57d46ead9d36aa9b0e48ba7e25315c3f735f65b5d1a8f530f03ed64b87e7
```

エマ에는 판정 가능한 내부 page 표본이 보존되어 있지 않다. 이 사실은 Art 축을 unknown으로 두는 이유지만, 판본이 연결된 공식 text까지 없다는 뜻은 아니다.

## strict hard-blocker audit

현행 `PROMOTION_HARD_BLOCKERS` 12개를 그대로 적용했다.

| blocker code | 이번 3작품 판정 |
|---|---|
| `ADULT_CONTENT` | 해당 증거 없음 |
| `VERTICAL_WEBTOON` | 해당 증거 없음 |
| `NON_JAPANESE` | 해당 증거 없음 |
| `NON_MANGA` | 해당 증거 없음 |
| `FAN_WORK` | 해당 증거 없음 |
| `NON_WORK_MATERIAL` | 세 작품 모두 canonical work이며, 검토한 재편집·라이선스판은 Evidence mapping에만 사용 |
| `DUPLICATE_WORK` | 이번 검수에서 새 충돌 없음 |
| `IDENTITY_UNRESOLVED` | 세 canonical identity는 유지; バラ色の明日 standard 1~3권과 re-edition 1~3권 item mapping도 resolved |
| `SAFETY_UNRESOLVED` | 이번 text 검수에서 기존 safety를 뒤집는 증거 없음 |
| `SOURCE_INFORMATION_UNAVAILABLE` | 세 작품 모두 현재 **불성립**. 특히 エマ와 バラ色の明日に 대한 후보를 기각 |
| `FACTOR_MODEL_INCOMPATIBLE` | 현재 확정 없음. バラ色の明日の Theme 0개만 Pass C 명시적 adjudication 필요 |
| `PRODUCT_CONTRACT_INCOMPATIBLE` | 해당 증거 없음 |

정보 부족은 실제 조사 경로가 소진되고도 계약을 충족할 수 없을 때만 blocker가 된다. 한 viewer의 shell/image 로딩 실패, 한 권의 부분 preview, 또는 현재 `unknown` 개수만으로는 재현 가능한 hard blocker가 아니다.

## handoff counts

- reviewed works: `3`
- axes reviewed: `39`
- `ACCEPT`: `17`
- `CORRECT`: `12`
- `UNKNOWN`: `10`
- Narrative gate pass: `3/3`
- Tone gate pass: `3/3`
- both text gates pass: `3/3`
- N/T-ready: `3`
- Theme-adjudication: `1`
- hard blockers confirmed: `0`
- `SOURCE_INFORMATION_UNAVAILABLE` candidates rejected: `2`
- canonical titles containing decorative title brackets: `0`

