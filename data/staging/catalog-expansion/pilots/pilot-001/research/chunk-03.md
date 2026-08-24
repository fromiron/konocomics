# Pilot 001 공식 Evidence 조사 — chunk 03

- Batch ledger 행: 물리 CSV 행 22–31
- 조회일: 2026-08-22
- 범위: 공식 출판사·작품 페이지, 공식 내부 미리보기, 유용한 공식 수상 또는 심사 자료
- 주석 경계: `supportedClaims`에는 출처가 이후 검토에서 뒷받침할 수 있는 내용만 기록한다. Factor 값, confidence, Theme centrality, safety 판정 또는 promotion 상태를 부여하지 않는다.
- Art 경계: 미리보기 제공 여부는 확인했지만 이번 패스에서는 내부 페이지를 시각적으로 검토하지 않았다. 표지 또는 검토하지 않은 미리보기는 Art Axis Evidence가 아니다.
- Provenance 경계: 추천 목록과 수상 결과는, 함께 제공된 공식 시놉시스나 심사평이 주장을 직접 뒷받침하는 경우가 아니면 선정 provenance만 설명한다.

## work-ebe399258f28460b8f9b — 鈴木先生

- `canonicalTitle`: 鈴木先生
- `creator`: 武富健治
- `publisher`: 双葉社
- `representativeIsbn`: 9784575940237

### 출처 1

- `sourceName`: 双葉社 book_details 공식 API
- `sourceUrl`: <https://book-api.futabasha.co.jp/book_details?media=1&jdcn_code=97845759402370000000&image_size=330%2055%201000&grouping_media=0>
- `publishedAt`: 2006-08-11 (`release_dt`)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-product-api`
- `supportedClaims`: Theme `school`과 `workplace` 존재 검토 후보, Axis `problemSolving` 검토 후보.
- `observation`: 1권, ISBN 9784575940237, 武富健治, `コミック`, `アクションコミックス`를 식별한다. 시놉시스에는 젊은 교사가 사소한 문제와 중대한 시련을 모두 마주한다고 적혀 있다. `trial_url=https://reader.futabasha.co.jp/97845759402370000000`과 `age_verification=0`을 제공한다.
- `limitation`: `age_verification=0`은 출판사 리더가 연령 확인을 요구하지 않는다는 뜻이며, 콘텐츠의 강도가 낮음을 증명하지는 않는다. 시놉시스만으로 Axis 수치, Theme centrality 또는 Art Axis를 확정할 수 없다.

### 출처 2

- `sourceName`: 文化庁メディア芸術祭 第11回マンガ部門 優秀賞 鈴木先生
- `sourceUrl`: <https://www.j-mediaarts.jp/award/single/suzuki-sensei/index.html>
- `publishedAt`: 2007 회계연도
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer-jury`
- `supportedClaims`: Theme `school`, Axis `problemSolving`, `mentalStress`, `characterArcWeight`, `relationshipStructure` 검토 후보.
- `observation`: 공식 시놉시스는 학생 문제로 고뇌하며 이를 해결하려는 중학교 교사를 설명한다. 심사평은 불안을 유발하는 교실, 혼란스러운 학생들, 통상적인 화해에 도달하지 못한 채 계속 괴로워하는 교사를 강조한다.
- `limitation`: 심사 자료는 작품을 폭넓게 평가한다. 진입 범위에서의 반복성과 모든 수치는 여전히 1–3권의 근거가 필요하다.

### 출처 3

- `sourceName`: 双葉社 공식 내부 리더
- `sourceUrl`: <https://reader.futabasha.co.jp/97845759402370000000>
- `publishedAt`: 날짜 미표기(출처에 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: 출판사 API가 이 URL을 시험 읽기 리더로 제공하며, 조회일에 공식 리더 리디렉션을 거쳐 HTTP 200을 반환했다.
- `limitation`: 내부 페이지를 시각적으로 검토하지 않았으므로 이 미리보기는 아직 어떤 Art Axis도 뒷받침하지 않는다.

### 안전 / 범위

- `safetyScope`: 출판사 메타데이터는 일반 상업 만화임을 식별하고 `age_verification=0`을 명시하며, 공식 수상 페이지는 일본 스토리 만화임을 확인한다. 이는 비성인 일본 만화 범위를 뒷받침한다.
- `safetyScopeLimitation`: 교실, 교육, 심리적 또는 성적·사회적 문제는 여전히 민감할 수 있다. 연령 제한이 없다는 것이 콘텐츠의 강도가 낮다는 뜻은 아니며, 최종 `safety approved`는 별도 게이트로 남는다.

## work-f391e591282e435a3c1d — アイアムアヒーロー

- `canonicalTitle`: アイアムアヒーロー
- `creator`: 花沢健吾
- `publisher`: 小学館
- `representativeIsbn`: 9784091825803

### 출처 1

- `sourceName`: 小学館 Big Comic BROS アイアムアヒーロー 第1集
- `sourceUrl`: <https://bigcomicbros.net/comics/30630/>
- `publishedAt`: 2009-08-28
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-volume-page`
- `supportedClaims`: Axis `mentalStress`, `darkness`, `characterArcWeight` 검토 후보, Theme `workplace` 존재 검토 후보.
- `observation`: 1권 시놉시스는 어둠을 두려워하고 불안과 불만을 느끼며 무너지는 현실의 시작을 마주하는 35세 만화 어시스턴트를 다룬다. 발매일은 저장소의 권 identity와 일치한다.
- `limitation`: 1권 시놉시스만으로 이후 감염 세계의 `worldBuilding`, `postApocalypse` centrality 또는 어떤 수치도 확정할 수 없다.

### 출처 2

- `sourceName`: 小学館 Big Comic BROS 작품 페이지
- `sourceUrl`: <https://bigcomicbros.net/work/6114/>
- `publishedAt`: 날짜 미표기(출처에 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-work-page`
- `supportedClaims`: Genre `horror`, Theme `survival`과 `postApocalypse`, Axis `mentalStress`, `darkness`, `worldBuilding` 검토 후보.
- `observation`: 공식 캐릭터 자료는 ZQN을 원인 불명의 감염으로 생긴 살아 있는 시체로 정의하고, 함께 도망치며 이동하는 사람들을 소개한다. 또한 花沢健吾의 小学館漫画賞 수상 이력을 기록한다.
- `limitation`: 작품 페이지에는 시리즈 전체 범위의 캐릭터 정보가 포함된다. 진입 범위에서의 반복성은 1–3권과 대조해 확인해야 한다. 노골적인 호러와 폭력은 성인 전용 유통과 같은 뜻이 아니다.

### 출처 3

- `sourceName`: 小学館 공식 1권 미리보기
- `sourceUrl`: <https://shogakukan.tameshiyo.me/9784091825803>
- `publishedAt`: 날짜 미표기(2018-07-27자 출판사 기사에서 링크됨)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: ISBN이 대표 권과 일치하며 공식 리더가 HTTP 200을 반환했다.
- `limitation`: 내부 패널을 시각적으로 검토하지 않았으므로 아직 어떤 Art Axis도 뒷받침하지 않는다.

### 출처 4

- `sourceName`: 第58回小学館漫画賞 보도자료
- `sourceUrl`: <https://www.shogakukan.co.jp/st/files/20130123pressrelease.pdf>
- `publishedAt`: 2013-01-23
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer`
- `supportedClaims`: 선정 provenance와 제목·작가·잡지 identity만 해당.
- `observation`: ビッグコミックスピリッツ의 花沢健吾 작 アイアムアヒーロー를 일반 부문 수상작으로 명시한다.
- `limitation`: Factor별 심사 근거가 없으므로 Factor Evidence로 사용해서는 안 된다.

### 안전 / 범위

- `safetyScope`: 공식 小学館 페이지는 週刊スピリッツ에 연재된 일본 상업 만화임을 식별하고 연령 제한이 없는 1권 리더를 제공한다. 성인 전용 또는 R18 판매 표시는 발견되지 않았다.
- `safetyScopeLimitation`: 감염, 살아 있는 시체, 총기, 노골적인 공포는 콘텐츠 민감도 검토가 필요하지만, 그러한 요소만으로 성인 전용 상태가 확정되지는 않는다.

## work-205e576ef057e3aed1ab — 坂道のアポロン

- `canonicalTitle`: 坂道のアポロン
- `creator`: 小玉ユキ
- `publisher`: 小学館
- `representativeIsbn`: 9784091316707

### 출처 1

- `sourceName`: 小学館 eコミックストア 坂道のアポロン 1
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/books/091316700000d0000000>
- `publishedAt`: 날짜 미표기(출처에 페이지 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-product-work-page`
- `supportedClaims`: Genre `historical`과 `romance`, Theme `school`, Axis `mentalStress`, `characterArcWeight`, `relationshipStructure`, `romance` 검토 후보.
- `observation`: 공식 시놉시스는 학교가 괴로운 전학생 薫이 등장하는 1966년 초여름에서 시작하며, 한 만남이 그의 고등학교 생활을 바꾼다고 설명한다. 페이지는 작품을 `少女・女性マンガ`, `月刊flowers`, `歴史モノ / 音楽・芸術 / ヒューマンドラマ / 恋愛`로 분류하고 완결된 9권 시리즈임을 식별한다.
- `limitation`: 음악은 현재 Factor Dictionary의 Theme가 아니다. 현재 小学館 ISBN 경로는 날짜가 2013-01-01인 JDCN 전자판 페이지로 리디렉션된다. 이 전자판 날짜가 저장소의 종이책 2008-04-25 날짜를 대체해서는 안 된다.

### 출처 2

- `sourceName`: 小学館 eコミ 공식 내부 미리보기
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091316700000d0000000>
- `publishedAt`: 날짜 미표기(출처에 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: URL이 HTTP 200을 반환하고 공식 BinB 리더로 리디렉션됐다.
- `limitation`: 미리보기 제공 여부만으로 Art Axis가 뒷받침되지는 않는다.

### 출처 3

- `sourceName`: 第57回小学館漫画賞 보도자료
- `sourceUrl`: <https://www.shogakukan.co.jp/st/files/mangasho.pdf>
- `publishedAt`: 2012-01-23
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer`
- `supportedClaims`: 선정 provenance와 제목·작가·잡지 identity만 해당.
- `observation`: flowers의 小玉ユキ 작 坂道のアポロン을 일반 부문 수상작으로 명시한다.
- `limitation`: 보도자료는 Factor별 심사 근거를 제공하지 않는다.

### 안전 / 범위

- `safetyScope`: 공식 스토어는 작품을 표준 `少女・女性マンガ` 카테고리에 배치하고 flowers 연재작임을 식별하며, 성인 전용 게이트나 표시는 없다.
- `safetyScopeLimitation`: 카테고리 배치는 반증을 보강하는 근거이지 명시적인 전연령 등급이 아니다. 학교생활의 고통과 관계 갈등은 여전히 민감도를 고려한 주석이 필요하다.

## work-f5f0ee0b0ff16bc146e0 — ばらかもん

- `canonicalTitle`: ばらかもん
- `creator`: ヨシノサツキ
- `publisher`: スクウェア・エニックス
- `representativeIsbn`: 9784757526167

### 출처 1

- `sourceName`: SQUARE ENIX ばらかもん 1권 페이지
- `sourceUrl`: <https://magazine.jp.square-enix.com/top/comics/detail/9784757526167/>
- `publishedAt`: 2009-07-22
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-volume-page`
- `supportedClaims`: Genre `comedy`와 `sliceOfLife`, Axis `comedy`와 `problemSolving` 검토 후보.
- `observation`: 작가, ISBN, 발매일을 식별한다. 시놉시스는 섬으로 옮겨가 낯선 트랙터, 아이들, 주민들을 마주하는 젊은 서예가를 설명하며 작품을 따뜻한 섬 코미디라고 부른다. 공식 1화를 링크한다.
- `limitation`: 어려움을 마주한다는 사실만으로 `problemSolving`의 방식이나 값을 확정할 수 없다. 일반 출판 레이블과 연령 제한이 없는 페이지는 safety를 뒷받침하지만 명시적인 전연령 진술은 아니다.

### 출처 2

- `sourceName`: 月刊少年ガンガン ばらかもん 공식 작품 페이지
- `sourceUrl`: <https://magazine.jp.square-enix.com/gangan/introduction/barakamon/>
- `publishedAt`: 날짜 미표기(현재 작품 페이지)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-work-page`
- `supportedClaims`: Genre `comedy`와 `sliceOfLife`, Axis `progression`, `characterArcWeight`, `relationshipStructure`, `emotionalWarmth`, `comedy` 검토 후보.
- `observation`: 페이지는 주인공이 주민 및 아이들과 함께하는 낯선 섬 생활을 통해 서예가로서, 한 인간으로서 서서히 성장한다고 설명하며 작품을 마음 따뜻한 섬 일상 코미디라고 부른다.
- `limitation`: 마음 따뜻함이나 성장 같은 홍보 문구만으로 수치 또는 Theme centrality를 결정할 수 없다.

### 출처 3

- `sourceName`: ガンガンONLINE 공식 1화
- `sourceUrl`: <https://www.ganganonline.com/title/868/chapter/33142>
- `publishedAt`: 날짜 미표기(출처에 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: 권 상품 페이지가 이 1화를 링크하며 URL이 HTTP 200을 반환했다.
- `limitation`: 내부 페이지를 시각적으로 검토하지 않았다. 표지와 목록 섬네일은 Art Evidence가 아니다.

### 안전 / 범위

- `safetyScope`: 공식 SQUARE ENIX와 ガンガンONLINE 페이지는 일반 잡지의 일본 상업 페이지 만화임을 확인하고 연령 제한이 없는 1화를 제공한다.
- `safetyScopeLimitation`: 명시적인 연령 등급은 발견되지 않았으므로 이 반증은 별도의 safety 검토와 함께 사용해야 한다.

## work-a7a1e0666169f1b2e8c0 — 海街diary

- `canonicalTitle`: 海街diary
- `creator`: 吉田秋生
- `publisher`: 小学館
- `representativeIsbn`: 9784091670250

### 출처 1

- `sourceName`: 小学館コミック 海街diary 1
- `sourceUrl`: <https://shogakukan-comic.jp/book?isbn=9784091670250>
- `publishedAt`: 2007-04-26
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-volume-page`
- `supportedClaims`: Axis `relationshipStructure`, `characterArcWeight`, `mentalStress`, `emotionalWarmth` 검토 후보.
- `observation`: 페이지는 ISBN과 발매일을 식별하고, 가마쿠라에서 아버지의 부고를 접한 세 자매와 가족의 유대, 슬픔, 온화함을 설명한다. 무료 공식 미리보기를 링크한다.
- `limitation`: 공식 `ヒューマンドラマ` 레이블을 Genre `sliceOfLife`로 기계적으로 변환해서는 안 된다. 가족의 유대만으로 Theme `foundFamily` centrality를 확정할 수 없다.

### 출처 2

- `sourceName`: 小学館 eコミックストア 海街diary 1
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/books/091670250000d0000000>
- `publishedAt`: 날짜 미표기(출처에 페이지 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-product-work-page`
- `supportedClaims`: 관계·캐릭터·정서 검토 후보와 비성인 범위를 뒷받침한다.
- `observation`: 작품을 `少女・女性マンガ`, `月刊flowers`, `ヒューマンドラマ`에 배치하고, 별도의 `オトナマンガ` 카테고리가 아니라 완결된 9권 시리즈임을 식별한다.
- `limitation`: 표준 카테고리 배치는 보강 근거이지 절대적인 safety 보장은 아니다.

### 출처 3

- `sourceName`: 小学館 eコミ 공식 내부 미리보기
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091670250000d0000000>
- `publishedAt`: 날짜 미표기(출처에 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: 공식 BinB 리더가 HTTP 200을 반환했다.
- `limitation`: 내부 페이지를 시각적으로 검토하지 않았으므로 어떤 Art Axis도 뒷받침하지 않는다.

### 출처 4

- `sourceName`: 小学館漫画賞 역대 수상작 아카이브
- `sourceUrl`: <https://shogakukan-comic.jp/shogakukan-mangasho-archives>
- `publishedAt`: 날짜 미표기(아카이브는 第61回를 식별하지만 페이지 날짜는 없음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer`
- `supportedClaims`: 선정 provenance와 제목·작가·잡지 identity만 해당.
- `observation`: 海街diary, flowers, 吉田秋生을 第61回 수상작·잡지·작가로 열거한다.
- `limitation`: Factor별 근거를 제공하지 않는다.

### 안전 / 범위

- `safetyScope`: 공식 小学館 페이지는 작품을 표준 여성 만화 카테고리와 flowers에 배치하고 일반 상업 ISBN과 연령 제한이 없는 미리보기를 제공한다.
- `safetyScopeLimitation`: 성인 전용 유통 표시는 발견되지 않았지만 사별과 가족 해체는 정서적으로 민감하다.

## work-d7e64b0b5479ca943edd — 深夜食堂

- `canonicalTitle`: 深夜食堂
- `creator`: 安倍夜郎
- `publisher`: 小学館
- `representativeIsbn`: 9784091817075

### 출처 1

- `sourceName`: 小学館コミック 深夜食堂 1
- `sourceUrl`: <https://shogakukan-comic.jp/book?isbn=9784091817075>
- `publishedAt`: 2007-12-26
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-volume-page`
- `supportedClaims`: Theme `cooking`과 `workplace`, Axis `relationshipStructure`와 `emotionalWarmth` 검토 후보.
- `observation`: ISBN과 날짜, 반복해서 등장하는 심야 식당, 주문에 맞춘 음식, 음식 이름을 제목으로 삼은 14편의 에피소드, 향수를 자아내는 분위기를 식별한다.
- `limitation`: 에피소드 구조는 `cooking`과 `workplace`의 존재를 강하게 뒷받침하지만 centrality와 `emotionalWarmth` 값은 내부 에피소드 검토가 필요하다. `ヒューマンドラマ / グルメ`를 Genre `sliceOfLife`로 기계적으로 매핑해서는 안 된다.

### 출처 2

- `sourceName`: 小学館 eコミックストア 深夜食堂 1
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/books/091817070000d0000000>
- `publishedAt`: 날짜 미표기(출처에 페이지 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-product-work-page`
- `supportedClaims`: Theme `cooking`과 `workplace`, 표준 만화 범위를 뒷받침한다.
- `observation`: 작품을 `少年・青年マンガ`, `ビッグコミックオリジナル`, `ヒューマンドラマ / グルメ / 映像化・受賞作`에 배치한다.
- `limitation`: 유흥가와 늦은 영업 시간만으로 성인 전용 콘텐츠가 확정되지는 않는다. 표준 카테고리 배치만으로 safety 검토가 완료되지는 않는다.

### 출처 3

- `sourceName`: 小学館 eコミ 공식 내부 미리보기
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091817070000d0000000>
- `publishedAt`: 날짜 미표기(출처에 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: 공식 BinB 리더가 HTTP 200을 반환했다.
- `limitation`: 내부 페이지를 시각적으로 검토하지 않았으므로 어떤 Art Axis도 뒷받침하지 않는다.

### 출처 4

- `sourceName`: 小学館漫画賞 역대 수상작 아카이브
- `sourceUrl`: <https://shogakukan-comic.jp/shogakukan-mangasho-archives>
- `publishedAt`: 날짜 미표기(아카이브는 第55回를 식별하지만 페이지 날짜는 없음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer`
- `supportedClaims`: 선정 provenance와 제목·작가·잡지 identity만 해당.
- `observation`: 深夜食堂, ビッグコミックオリジナル, 安倍夜郎를 第55回 수상작·잡지·작가로 열거한다.
- `limitation`: Factor별 심사 근거가 없다.

### 안전 / 범위

- `safetyScope`: 공식 상품 및 스토어 페이지는 표준 일본 청년 만화, 주류 잡지 연재, 연령 제한이 없는 미리보기를 식별한다.
- `safetyScopeLimitation`: 성인 등장인물과 유흥가는 성인 전용 판정 기준이 아니다. 개별 이야기는 여전히 술, 범죄, 슬픔 또는 그 밖의 민감한 소재를 다룰 수 있다.

## work-3823ff0766f67c015c53 — ましろのおと

- `canonicalTitle`: ましろのおと
- `creator`: 羅川真里茂
- `publisher`: 講談社
- `representativeIsbn`: 9784063712612

### 출처 1

- `sourceName`: 講談社 ましろのおと（1） 상품 페이지
- `sourceUrl`: <https://www.kodansha.co.jp/comic/products/0000043275>
- `publishedAt`: 2010-10-15
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-volume-page`
- `supportedClaims`: Axis `progression`, `characterArcWeight`, `relationshipStructure`, `mentalStress` 검토 후보.
- `observation`: ISBN, 날짜, 月刊少年マガジン, 최초 출판 순서를 식별한다. 시놉시스에는 雪이 할아버지이자 스승을 잃고 자신의 소리도 잃은 뒤 여러 사람을 만나 그 소리를 찾는 여정을 시작한다고 적혀 있다.
- `limitation`: 자동 직접 조회는 403을 반환했지만 공식 출판사 검색 인덱스에서 페이지 콘텐츠가 노출됐다. 음악은 현재 Theme가 아니며, 여정이라는 단어만으로 Theme `adventure`가 자동으로 확정되지는 않는다.

### 출처 2

- `sourceName`: 講談社 今日のおすすめ 1화 특별 공개
- `sourceUrl`: <https://news.kodansha.co.jp/comics/9461>
- `publishedAt`: 2022-10-14
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-editorial-and-internal-preview`
- `supportedClaims`: 진입 범위의 Axis `progression`과 `characterArcWeight`를 뒷받침함. 이번 패스에서 Art Axis는 없음.
- `observation`: 작품을 쓰가루 샤미센 청춘 이야기라고 부르고 주인공의 여정이 여기서 시작된다고 설명하며, 다수의 공식 1화 페이지를 삽입한다.
- `limitation`: 완결 캠페인 기사이므로 이후 시리즈 요약이 진입 값에 섞여서는 안 된다. 이번 패스에서는 삽입된 페이지를 시각적으로 검토하지 않았다.

### 출처 3

- `sourceName`: 講談社漫画賞 역대 수상 이력
- `sourceUrl`: <https://www.kodansha.co.jp/awards/comics/histories>
- `publishedAt`: 2012년(第36回 / 平成24年)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer`
- `supportedClaims`: 선정 provenance와 제목·작가 identity만 해당.
- `observation`: 第36回 수상자·수상작 가운데 羅川真里茂와 ましろのおと를 열거한다.
- `limitation`: Factor별 심사 설명을 제공하지 않는다.

### 안전 / 범위

- `safetyScope`: 공식 講談社 자료는 月刊少年マガジン의 일본 상업 만화임을 식별하고 연령 제한 없이 1화를 제공한다.
- `safetyScopeLimitation`: 슬픔과 상실은 민감한 테마다. 잡지 레이블과 연령 제한이 없다는 사실은 비성인 유통을 뒷받침하지만 명시적인 연령 등급은 아니다.

## work-61f2b70ee9f8217b3604 — 銀の匙 Silver Spoon

- `canonicalTitle`: 銀の匙 Silver Spoon
- `creator`: 荒川弘
- `publisher`: 小学館
- `representativeIsbn`: 9784091231802

### 출처 1

- `sourceName`: 小学館コミック 銀の匙 Silver Spoon 1
- `sourceUrl`: <https://shogakukan-comic.jp/book?isbn=9784091231802>
- `publishedAt`: 2011-07-15
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-volume-page`
- `supportedClaims`: Theme `school`, Axis `progression`, `characterArcWeight`, `relationshipStructure`, `emotionalWarmth` 검토 후보.
- `observation`: ISBN과 발매일을 식별한다. 시놉시스는 농업고등학교 입학, 낯선 실습과 가축, 동료와 동물의 도움, 계속되는 고군분투, 생명의 소중함을 배우는 과정을 설명한다.
- `limitation`: 낯선 과제를 마주한다는 사실만으로 `problemSolving` 값이 자동으로 확정되지는 않는다. 농업 실습만으로 Theme `workplace` centrality가 확정되지는 않는다.

### 출처 2

- `sourceName`: 小学館 eコミックストア 銀の匙 Silver Spoon 1
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/books/091231800000d0000000>
- `publishedAt`: 날짜 미표기(출처에 페이지 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-product-work-page`
- `supportedClaims`: Theme `school`, 관계와 성장 검토 후보, 표준 만화 범위를 뒷받침한다.
- `observation`: 작품을 `少年・青年マンガ`와 `少年サンデー`에 배치하고 완결된 15권 시리즈임을 식별한다. 조회 당시 2026-08-23까지 한시적으로 무료였다.
- `limitation`: 캠페인 제공 여부는 시간에 따라 변하며 그 자체로 safety를 확정하지 않는다.

### 출처 3

- `sourceName`: 小学館 eコミ 공식 내부 리더
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091231800000d0000000>
- `publishedAt`: 날짜 미표기(출처에 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: HTTP 200을 반환했으며 현재 확장된 캠페인 리더가 열렸다.
- `limitation`: 캠페인이 끝나면 제공 페이지가 줄어들 수 있으며, Art Axis 판단을 위해 페이지를 시각적으로 검토하지 않았다.

### 출처 4

- `sourceName`: 第58回小学館漫画賞 보도자료
- `sourceUrl`: <https://www.shogakukan.co.jp/st/files/20130123pressrelease.pdf>
- `publishedAt`: 2013-01-23
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer`
- `supportedClaims`: 선정 provenance와 제목·작가·잡지 identity만 해당.
- `observation`: 週刊少年サンデー의 荒川弘 작 銀の匙 Silver Spoon을 소년 부문 수상작으로 명시한다.
- `limitation`: Factor Evidence가 아니다.

### 안전 / 범위

- `safetyScope`: 공식 小学館 페이지는 작품을 표준 소년·청년 유통과 週刊少年サンデー에 배치하고 연령 제한이 없는 리더를 제공한다.
- `safetyScopeLimitation`: 농업, 도축, 동물의 죽음, 가족 또는 학교 스트레스는 성인 전용 유통 신호는 아니지만 민감할 수 있다.

## work-07b11ec79f10c7eb7e05 — かくかくしかじか

- `canonicalTitle`: かくかくしかじか
- `creator`: 東村アキコ
- `publisher`: 集英社
- `representativeIsbn`: 9784087824575

### 출처 1

- `sourceName`: 集英社 かくかくしかじか 1권 상품 페이지
- `sourceUrl`: <https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782457-5&mode=1>
- `publishedAt`: 2012-07-25(종이책), 2014-04-25(전자판)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-volume-page`
- `supportedClaims`: Theme `school`, Axis `progression`, `characterArcWeight`, `relationshipStructure`, `mentalStress` 검토 후보.
- `observation`: ISBN, 작가, 종이책 날짜, 전자판 날짜, `少女・女性`, Cocohana를 식별한다. 진입 시놉시스는 자신감 넘치는 고등학교 3학년 林明子, 엄격한 미술 교사 日高, 순정 만화가가 되려는 꿈을 중심으로 한다. 공식 미리보기를 링크한다.
- `limitation`: 짧은 시놉시스와 제목만으로 Art Axis를 확정할 수 없다. 진입 근거 없이 이후의 직업 생활을 진입 Theme `workplace`로 가져와서는 안 된다.

### 출처 2

- `sourceName`: 集英社 공식 내부 미리보기
- `sourceUrl`: <https://www.shueisha.co.jp/books/reader/main.php?cid=9784087824575>
- `publishedAt`: 날짜 미표기(출처에 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: ISBN이 일치하며 공식 리더가 HTTP 200을 반환했다.
- `limitation`: 내부 페이지를 시각적으로 검토하지 않았으므로 어떤 Art Axis도 뒷받침하지 않는다.

### 출처 3

- `sourceName`: マンガ大賞2015 공식 보도자료
- `sourceUrl`: <https://www.mangataisho.com/data/2015/press20150324.pdf>
- `publishedAt`: 2015-03-24
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer`
- `supportedClaims`: 선정 provenance만 해당.
- `observation`: 東村アキコ 작 かくかくしかじか를 대상 작품으로 명시한다.
- `limitation`: 순위 데이터는 Factor Evidence가 아니다.

### 출처 4

- `sourceName`: マンガ大賞2015 공식 선정위원 코멘트 모음
- `sourceUrl`: <https://www.mangataisho.com/data/2015/comment2015.pdf>
- `publishedAt`: 2015-03-24
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-jury-commentary`
- `supportedClaims`: Axis `progression`, `characterArcWeight`, `relationshipStructure`, `comedy`, `mentalStress`, `emotionalWarmth` 검토 후보.
- `observation`: 여러 선정위원이 자전적인 미술 수련, 엄격한 사제 관계, 꿈을 이루는 과정, 유머, 슬픔, 후회, 따뜻함을 논한다.
- `limitation`: 이는 개별 선정위원의 의견이며 작품 전체를 포함한다. 각 주장은 진입 페이지와 다시 대조해야 하며, 하나의 코멘트를 여러 Factor의 일반적인 근거로 재사용해서는 안 된다.

### 안전 / 범위

- `safetyScope`: 공식 集英社 메타데이터는 Cocohana의 표준 여성 만화 유통을 식별하고 연령 제한이 없는 내부 리더를 제공하며, 공식 수상 자료는 주류 일본 만화 identity를 확인한다.
- `safetyScopeLimitation`: 엄격한 지도, 슬픔, 후회는 민감하지만 성인 전용 판매를 뜻하지 않는다. 명시적인 연령 등급은 발견되지 않았다.

## work-ef7106f6a387c9860877 — その女、ジルバ

- `canonicalTitle`: その女、ジルバ
- `creator`: 有間しのぶ
- `publisher`: 小学館
- `representativeIsbn`: 9784091850249

### 출처 1

- `sourceName`: 小学館 eコミックストア その女、ジルバ 1
- `sourceUrl`: <https://e-comi.shogakukan.co.jp/books/091850240000d0000000>
- `publishedAt`: 날짜 미표기(출처에 페이지 날짜가 기재되지 않음)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-product-work-page`
- `supportedClaims`: Theme `workplace`, Axis `progression`, `characterArcWeight`, `relationshipStructure`, `mentalStress`, `emotionalWarmth` 검토 후보.
- `observation`: 구조조정 이후 창고와 고령 호스티스 바에서 일하며 저축도 노후 대책도 없는 40세 여성이 웃고 노래하고 춤추며 잃었던 것을 되찾기 시작하는 모습을 설명한다. 작품을 `少年・青年マンガ`, `ビッグコミックオリジナル`, `ヒューマンドラマ`에 배치하고 완결된 5권을 식별한다.
- `limitation`: 바와 호스티스 설정은 성인 전용 유통과 같은 뜻이 아니다. 표준 카테고리 배치는 safety를 뒷받침하지만 명시적인 전연령 보장은 아니다.

### 출처 2

- `sourceName`: 小学館コミック 전자판 상품
- `sourceUrl`: <https://shogakukan-comic.jp/book?jdcn=091850240000d0000000>
- `publishedAt`: 2014-11-03(전자판)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-digital-product`
- `supportedClaims`: Theme `workplace`와 캐릭터 변화 검토 후보를 뒷받침한다.
- `observation`: 동일한 시놉시스와 JDCN을 확인한다.
- `limitation`: 저장소 대표 종이책 ISBN의 날짜는 2013-02-28이다. 출판사 페이지의 2014-11-03 날짜는 전자판에 해당하며 identity 충돌이 아니라 판본 차이로 기록해야 한다.

### 출처 3

- `sourceName`: 小学館 공식 작품·TV 기사
- `sourceUrl`: <https://shogakukan-comic.jp/news/28579>
- `publishedAt`: 2021-01-09
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-editorial`
- `supportedClaims`: Theme `workplace`와 `historicalReconstruction`, Axis `progression`, `relationshipStructure`, `mentalStress`, `emotionalWarmth` 검토 후보.
- `observation`: 2011–2018년 연재를 명시하고, 불안해하는 40세 주인공이 전시와 전후의 고난을 견딘 60세 이상 여성들이 일하는 바에 들어가는 이야기를 설명한다. 공식 1권 가로형 리더를 직접 링크한다.
- `limitation`: 기사는 시리즈 전체를 요약하므로 Theme `historicalReconstruction` centrality와 모든 값은 진입 범위에서 확인해야 한다.

### 출처 4

- `sourceName`: 朝日新聞社 第23回手塚治虫文化賞 발표
- `sourceUrl`: <https://book.asahi.com/article/12302977>
- `publishedAt`: 2019-04-21
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-award-organizer-editorial`
- `supportedClaims`: Theme `workplace`와 `historicalReconstruction`, Axis `progression`, `characterArcWeight`, `relationshipStructure` 검토 후보.
- `observation`: 대상을 확인하고, 주인공이 고령 여성들이 일하는 바에서 근무하며 세상을 떠난 브라질 이민자 ジルバ와 다른 종업원들의 역사를 접하고 자신의 삶을 다시 세우기 시작한다고 설명한다.
- `limitation`: 수상 시놉시스는 작품 전체를 다룬다. 진입 centrality와 수치는 미리보기 검토가 필요하다.

### 출처 5

- `sourceName`: 小学館 공식 1권 내부 미리보기
- `sourceUrl`: <https://shogakukan.tameshiyo.me/9784091850249>
- `publishedAt`: 날짜 미표기(2021-01-09자 출판사 기사에서 링크됨)
- `retrievedAt`: 2026-08-22
- `authorityClass`: `official-publisher-internal-preview`
- `supportedClaims`: 이번 패스에서는 없음.
- `observation`: HTTP 200을 반환하고 공식 리더로 리디렉션됐다.
- `limitation`: 내부 페이지를 시각적으로 검토하지 않았으므로 어떤 Art Axis도 뒷받침하지 않는다.

### 안전 / 범위

- `safetyScope`: 공식 小学館 분류는 작품을 별도의 성인 카테고리가 아니라 표준 `少年・青年マンガ`와 ビッグコミックオリジナル에 배치하며, 1권 리더에는 연령 제한이 없다.
- `safetyScopeLimitation`: 유흥가, 호스티스 노동, 경제적 불안정, 전쟁, 이주는 성숙한 소재이지만 성인 전용 판매의 증거는 아니다. 최종 safety 승인은 별도 검토로 남는다.
