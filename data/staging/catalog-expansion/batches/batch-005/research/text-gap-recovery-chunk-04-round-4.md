# Batch 005 text gap recovery round 4 — chunk 04

## 조사 범위와 불변 조건

- 조사일·모든 외부 URL 조회일: `2026-08-25`
- 대상: frozen work-set positions `31–40`만
- 평가 범위: `entry_1_3_volumes` (권 1–3 또는 이에 직접 대응하는 초반 에피소드)
- `reviewedByHuman=false`
- branch / HEAD at packet creation: `main` / `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- prior round-3 packet SHA-256: `6cf07902145ee1337aa8e9960d021fc5772f6eb64da47d949b0554f186cabc46`
- current terminal Text / Genre / Theme SHA-256:
  `c8a92dc507a6caf4dc54ef7e2d602cb99d904e2c8493d3e9174c6ad85f333877` /
  `74b97438f9d055f7f283826ddcb3f1d16cc0a7ebcd2efe0f4271664bdbf78fff` /
  `8583aa7367ce234f0c2ae14a561dc2cd4c06f1262035a292b754feb2ee53bf50`

이 파일은 조사 packet만 추가한다. terminal Text/Genre/Theme, Pass A,
source/provenance, Art packet, promotion overlay, generated catalog는 수정하지
않았다. 아래의 `provisional`은 독립 adjudication의 입력일 뿐 런타임 known 값이
아니다.

판정은 Factor Dictionary의 0/2/4 anchor와 기존 coverage 계약을 그대로 따른다.
제목·Genre·단일 사건·별점·추천 등재만으로 Axis나 Theme을 부여하지 않는다.
`unknown`을 0으로 바꾸지 않았고, Art 값은 전혀 판정하지 않았다. 유저 리뷰는
서로 다른 출처의 구체적이고 entry 범위가 확인되는 관찰만 보조 근거로 사용했다.
리뷰 원문은 사용자 UI 설명에 복사하지 않는다.

## 실행한 finite route ledger

모든 응답은 HTTP `200`, 최종 URL과 작품 식별자는 직접 확인했다. `publishedAt`
은 페이지에 표시된 발행일·연도이며, 페이지가 연도를 노출하지 않는 경우
`not displayed`로 기록한다. 모든 URL의 `retrievedAt`은 `2026-08-25`이다.

| Pos | 작품 | 실행한 공식/라이선스 route | publishedAt | 직접 확인한 결과 |
| ---: | --- | --- | --- | --- |
| 31 | デストロ２４６ | [小学館 vol.2](https://sc-portal.tameshiyo.me/9784091573483) → `https://sc-portal.tameshiyo.me/091573480000d0000000`; [vol.3](https://sc-portal.tameshiyo.me/9784091573650) → `https://sc-portal.tameshiyo.me/091573650000d0000000` | `2013-05-17` / `2013-12-19` | 권리자 `title`과 `og:description`이 확인됨. 여러 암살자·조직·총격·배신의 확대를 반복하지만 남은 Tone anchor는 새로 닫지 못함. |
| 32 | 夢の雫、黄金の鳥籠 | [小学館 vol.2](https://sc-portal.tameshiyo.me/9784091342164); [vol.3](https://sc-portal.tameshiyo.me/9784091346834) | `2012-03-09` / `2012-11-09` | 후궁 신분, 질투·음모·생존, 사랑과 분리를 다시 확인. 강제 신분 변화나 궁정 배경을 `progression`·`strategy`로 재계산할 새 근거는 아님. |
| 33 | 日常 | [KADOKAWA vol.2](https://www.kadokawa.co.jp/product/200879000106/); [vol.3](https://www.kadokawa.co.jp/product/200805000029/) | `2007-10-24` / `2008-07-24` | `contents_intro`, 권차, BookWalker trial control을 확인. vol.2는 학교 주변 인물·로봇, vol.3은 로봇·개·수수께끼 존재와 포스트모던 개그를 설명하지만, 이전 round-3에서 거절된 `worldBuilding=2`를 반복 제안할 정도의 규칙·역사·세력 근거는 아님. |
| 34 | ひらやすみ | [小学館 vol.2](https://sc-portal.tameshiyo.me/9784098612048); [vol.3](https://sc-portal.tameshiyo.me/9784098612994) | `2021-12-10` / `2022-04-28` | 집에 서로 다른 고민을 가진 사람이 모이고 축제·미술제·연애 위기가 이어지는 공식 소개를 확인. 혈연 친척·친구·이웃의 동거만으로 `foundFamily`를 만들지 않았고, 남은 Narrative 3칸을 닫지 못함. |
| 35 | ハイスコアガール | [공식 제2화](https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/); [공식 제3화](https://magazine.jp.square-enix.com/biggangan/tachiyomi/his03/) | 페이지 연도 `not displayed`; 공식 시리즈 페이지의 copyright `2021` | 두 route 모두 HTTP 200, 정확한 제목, Fotorama `fr_pagenum=8`, `fr_ad=false`, 상대 `img/` route를 확인. 이는 Art-route availability metadata일 뿐이며 이미지 요청·픽셀 판독·Art 값 배정은 하지 않음. |
| 36 | WOMBS | [小学館 eコミック vol.3](https://e-comi.shogakukan.co.jp/books/091885830000d0000000) | `2015-11-27` digital release | 실전 후 마나가 전이에 필요한 지점을 만드는 개척자 역할을 받고, 전이부대의 기원과 능력의 영향이 드러난다는 권리자 설명을 재확인. round-3에서 채택된 `characterArcWeight=3` 이외의 남은 Tone 값을 새로 닫지 못함. |
| 37 | ママはテンパリスト | [集英社 reader vol.2](https://www.shueisha.co.jp/books/reader/main.php?cid=9784087822403); [reader vol.3](https://www.shueisha.co.jp/books/reader/main.php?cid=9784087822731) | `2009-06-19` / `2010-03-19` | vol.2는 육아 에세이의 반복과 제2탄, vol.3은 네 살 아이의 언어·행동 변화와 육아 소동을 설명. 사전의 `parenting` Theme은 없고, 자연스러운 성장이나 보호자의 대응을 `progression`·`problemSolving`으로 세지 않음. |
| 38 | 僕らはみんな河合荘 | [BookLive exact vol.1](https://booklive.jp/product/index/title_id/175276/vol_no/001) | `2013-10-11` digital release | 정확한 title/creator와 `ラブ3:コメ7` 작품 소개, 기숙사 거주자·동경하는 선배·사춘기 코미디를 확인. 공유 주거·호감·개그는 기존 관계/Tone 값과 겹치며 `foundFamily` 또는 남은 Narrative를 새로 닫지 않음. |
| 39 | かよちゃんの荷物 | [BookLive 新装版 上](https://booklive.jp/product/index/title_id/439092/vol_no/001); [新装版 下](https://booklive.jp/product/index/title_id/439092/vol_no/002) | `2017-04-27` / `2017-05-03` digital release | 동일 제목·작가의 신장판 상·하 2권과 `試し読み` control을 확인. 상권은 실업·체중 변화·재취업·잡화점·연하 미용사, 하권은 꽃놀이·축제·크리스마스·발렌타인과 친구 관계를 직접 설명. round-3 이후 새로 확인된 entry 내용 근거가 있음. |
| 40 | 脳内ポイズンベリー | [BookLive licensed vol.2](https://booklive.jp/product/index/title_id/293660/vol_no/002); [集英社 reader vol.3](https://www.shueisha.co.jp/books/reader/main.php?cid=08865666865626315501) | `2014-12-25` / `2013-08-23` | vol.2는 연인이 된 뒤 메일 한 통과 내부 회의의 파문, vol.3은 전 약혼자·키스·메일·삼각 긴장을 설명. 기존 `problemSolving`·`characterArcWeight`·`mentalStress`·`romance` 범위를 재확인할 뿐 새 Theme/Narrative를 만들지 않음. |

## 작품별 결과

### 31 — デストロ２４６ (`work-79c18b26dfde8a532f73`)

새 route의 공식 vol.2 설명은 두 소녀가 주인의 가족을 독살한 인물을 찾기 위해
다른 암살자에게 접촉하고, vol.3 설명은 조직과 세츠나의 야망·총격·배신으로
확대되는 entry 범위를 직접 제공한다. 이는 이미 terminal에 있는
`investigation`, `revenge`, `mysteryReveal=2`, `strategy=2`, `darkness=4`의
근거를 보강하지만, 남은 Tone(캐릭터 변화·관계·개그·정신적 압박·로맨스·온기)을
새로 닫을 구체적인 반복 관찰은 없다.

**결론:** 새 proposal 없음. 남은 Tone gap은 미충족으로 유지한다. 공식 body
trial이 별도 이미지 route라는 사실만으로 Axis를 추정하지 않는다.

### 32 — 夢の雫、黄金の鳥籠 (`work-7b6eb2b48ac06ffa26eb`)

vol.2의 후궁·질투·음모·친구의 죽음 뒤 생존, vol.3의 사랑·삼각 감정과 원정에
따른 분리를 직접 확인했으나, 이는 기존 `romance=4`, `mentalStress=2`,
`relationshipStructure=2`, `survival=1`, `politics=1` 범위와 일치한다. 신분
상승은 자율적인 성장 보상으로, 궁정 배경은 계획·자원 운영으로 자동 환산하지
않는다.

**결론:** 새 proposal 없음. 남은 Narrative 2칸은 `unknown` 후보이며, 이
route들은 더 이상 유효한 잔여 cell을 제공하지 않는다.

### 33 — 日常 (`work-8037856e7703fdaf4324`)

KADOKAWA vol.2의 `contents_intro`는 마이·로봇 東雲なの·사사하라·나카노조 등
여러 인물이 유코 주변에서 생활한다고 설명한다. vol.3은 로봇·개·수수께끼
존재와 포스트모던 개그를 직접 언급한다. 두 권 모두 작품 식별과 권차는 확정했지만,
이 문장들은 초현실적 소재가 있다는 사실을 말할 뿐 역사·문화·규칙·세력이
반복적으로 중요하다는 Dictionary의 `worldBuilding=2` anchor를 충족하지 않는다.

**결론:** round-3에서 독립 검수로 거절된 `worldBuilding=2`를 재제안하지 않는다.
`progression`, `problemSolving`, `strategy`, `mysteryReveal`, Tone의 새 known
값도 없음. 남은 route는 Art sample route일 뿐 text gate를 닫지 않는다.

### 34 — ひらやすみ (`work-88cb26a0229ad7b83263`)

vol.2는 집 주변에 히데키의 출산 준비, 부동산 회사원 요모기, 아카리와 축제
소동이 모이는 흐름을, vol.3은 소설가 이시카와와 나츠미의 연애 위기를 설명한다.
이는 기존 `emotionalWarmth=2`, `characterArcWeight=3`, `relationshipStructure=2`,
`romance=2`, `mentalStress=2`의 보조 근거다. 그러나 친척·친구·이웃이 같은 집에
모인다는 사실은 선택 가족 형성의 반복 mechanic이 아니며, 직업·축제·미술제는
각각 workplace나 별도 Theme으로 승격할 수 없다.

**결론:** 새 Theme/Narrative proposal 없음. `foundFamily`와 남은 Narrative는
`unknown` 후보로 유지한다.

### 35 — ハイスコアガール (`work-8a7846af8ead1797e6a2`)

제2·제3화 공식 페이지는 각각 HTTP 200으로 응답하고, 정확한 작품/화 제목과
Fotorama 초기화 정보(`fr_pagenum=8`, `fr_ad=false`, `img/` 상대 경로)를 노출한다.
따라서 권리자의 추가 초반 episode route가 실제로 살아 있고, 최소 8개 표본
페이지를 제공하도록 설계된 경로임을 확인했다.

이 라운드는 사용자 지시대로 해당 `img/*.jpg`를 요청하지 않았고, 장면을 읽거나
`artRealism`, `artDensity`, `visualSoftness`, `motionImpact`를 배정하지 않았다.
Text 쪽은 round-3에서 이미 `comedy;romance`, `tournament=1`,
`strategy=2`, `pacing=3`, `progression=2`가 독립 검수로 채택되어 변경하지
않는다.

**결론:** Art-route metadata는 유효. Art 판정은 별도 Art packet의 exact
edition/sample/quorum 절차에서만 수행한다. 새 Text proposal 없음.

### 36 — WOMBS (`work-8ff141505b0a27f8d630`)

小学館 eコミック vol.3은 실전 후 마나가 전이에 필요한 포인트를 만드는
`開拓者`가 되고, 전이병의 기원과 능력의 영향이 점차 밝혀진다고 명시한다. 이는
vol.1의 징집·훈련·출격과 연결되는 인물 역할 변화이며, round-3의
`characterArcWeight=3` 채택 근거를 직접 재확인한다. 반면 사랑하는 사람을
남겼다는 초기 설정은 반복 Romance가 아니고, vol.3 소개에도 따뜻함·개그·관계
회복의 직접 관찰은 없다.

**결론:** 이미 채택된 `characterArcWeight=3` 외 새 Tone proposal 없음. 남은
Tone gap은 유지한다.

### 37 — ママはテンパリスト (`work-982bb79e03193ebbafcd`)

集英社 reader vol.2는 시리즈 제2탄으로 육아 소동을 계속하고, vol.3은 네 살
아이의 언어 습득과 행동 변화, 어머니의 당황을 설명한다. 이 자료는 기존
`pacing=3`, `characterArcWeight=2`, `relationshipStructure=2`, `comedy=3`,
`emotionalWarmth=2`, `mentalStress=2`를 보조하지만, 아이의 자연스러운 연령
변화는 주인공의 반복적인 성장·획득 보상 loop가 아니다. 양육 문제의 즉흥 대응도
제약 분석형 `problemSolving`이 아니며 Dictionary에 parenting Theme은 없다.

**결론:** 새 proposal 없음. Theme과 남은 Narrative는 `unknown` 후보로
유지한다. 이 route는 해당 유한 범위의 negative Theme audit를 완료한다.

### 38 — 僕らはみんな河合荘 (`work-9e98119539f60465ce66`)

BookLive의 exact vol.1 route는 `親の転勤`으로 독립하게 된 우사, 기숙사의
기이한 거주자들, 동경하는 리츠 선배, `ラブ3:コメ7`이라는 작품 소개와
`試し読み` control을 제공한다. 이 자료는 이미 terminal인
`characterArcWeight=2`, `relationshipStructure=2`, `comedy=3`, `romance=3`,
`emotionalWarmth=2`와 호환된다.

**결론:** 공동 거주를 `foundFamily`로, 선배에 대한 호감을 `progression`이나
새 Theme으로 바꾸지 않는다. 새 Narrative/Tone/Theme proposal 없음.

### 39 — かよちゃんの荷物 (`work-aa6018249b7fe7e92d95`)

이번 라운드에서 처음으로 신장판 상·하의 직접 본문 범위 설명을 확인했다.
BookLive 상권은 주인공의 실업·체중 변화·재취업·잡화점 근무·연하 미용사와의
만남을 설명하고, 하권은 꽃놀이·축제·크리스마스·발렌타인과 친구 관계, 삶의
방향을 계속 다룬다고 명시한다. 신장판임은 title에 명시되며, 작품명/작가가
동일하고 원판과의 관계를 리뷰에서도 직접 확인할 수 있다.

독립 보조 자료도 같은 entry 관찰을 구체화한다.

- [webDICE](https://www.webdice.jp/dice/detail/2068/index.html), `2009-11-07`:
  1권의 친구 대화·등산·데이트, 잡화점 근무, 점장·미용사와의 관계가 반복된다고
  설명한다.
- [のんのんの部屋](https://nonnon4u.com/post-9413/), `2018-12-14`:
  직장 이동·잡화점·동료/점장·친구·미용사와의 오해와 크리스마스 에피소드,
  관계가 배려로 정리되는 초반 생활 관찰을 제공한다.
- [コミックナタリー](https://natalie.mu/comic/news/227415), `2017-04-04`:
  2005–2011 연재작의 신장판 상·하와 신작 에피소드 수록 관계를 확인한다.

**독립 adjudication용 provisional proposal:**

| 종류 | 제안 | confidence | 근거와 경계 |
| --- | --- | ---: | --- |
| Theme | `workplace=1` | 0.76 | 잡화점·점장·동료·재취업이 공식 상권 설명과 두 독립 리뷰에 반복된다. 직장만으로 작품 전체의 중심성을 2로 올리지는 않음. |
| Narrative | `pacing=2` | 0.68 | 실업→재취업, 계절 행사와 친구/직장/데이트 장소의 이동이 권 설명과 리뷰에 반복된다. 단순히 8쪽 단편이라는 이유로 3 이상을 주지 않음. |
| Narrative | `characterArcWeight=2` | 0.72 | 실업·신체 변화·재취업·관계 선택이 주인공의 생활 변화를 중심으로 연결된다. 성장 보상인 `progression`으로 중복하지 않음. |
| Tone | `romance=2` | 0.70 | 연하 미용사와의 만남·데이트·관계의 가능성이 공식 상권과 리뷰에 반복되지만 중심 연애 4는 아님. |
| Tone | `relationshipStructure=2` | 0.70 | 친구들, 점장, 동료, 미용사와의 반복적 상호작용이 확인된다. 군상극 4는 아님. |
| Tone | `darkness=0` | 0.62 | webDICE가 entry를 비극보다 밝고 따뜻한 일상으로 관찰하고, 독립 리뷰도 가벼운 생활·관계 착지를 반복한다. 단일 홍보 문구만으로 확정하지 말고 adjudication에서 보수적으로 검토. |

`progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`,
`mentalStress`는 위 자료만으로 제안하지 않는다. 실업과 체중 변화는
`mentalStress`의 지속적 압박 anchor가 아니며, 재취업은 progression의 반복 보상
구조가 아니다.

### 40 — 脳内ポイズンベリー (`work-ab9331f7fed1990f7dc6`)

BookLive vol.2는 연애 시작 후 메일 한 통을 둘러싸고 내부 회의가 소란스러워지는
흐름을, 集英社 vol.3은 전 약혼자·키스·메일로 현재 관계가 불안정해지는 흐름을
직접 설명한다. 둘 다 기존 `problemSolving=2`, `characterArcWeight=4`,
`mentalStress=3`, `romance=4`, `comedy=2`와 맞지만, 내부 회의라는 장치를
`strategy`, `worldBuilding`, 또는 사전의 Theme으로 중복 계산하지 않는다.

**결론:** 새 proposal 없음. Theme gap과 남은 Narrative는 `unknown` 후보로
유지한다.

## Round-4 conclusion

| 구분 | 수량 |
| --- | ---: |
| 실행한 position | 10/10 |
| 신규 provisional cell/Theme proposal | 6 cells + 1 Theme, 모두 pos39 |
| 새 proposal 없이 route 소진 또는 기존 거절 유지 | 9/10 |
| Art 값 배정 | 0 |
| terminal/source/generated/promotion/Art 파일 수정 | 0 |
| human review | `not run` (`reviewedByHuman=false`) |

Pos39의 provisional은 아직 독립 검수·adjudication 전이며, 이 packet만으로
terminal CSV나 promotion gate를 변경할 수 없다. 다른 9개는 지정된 공식/라이선스
route에서 새 Dictionary anchor를 확인하지 못했으며, 기존 rejection/unknown
경계를 유지한다. 특히 `foundFamily`, `progression`, `problemSolving`,
`worldBuilding`을 제목·설정·공동 거주·자연 연령 변화만으로 채우지 않았다.

## 읽기 전용 검증 기록

```text
$ sha256sum data/staging/catalog-expansion/batches/batch-005/adjudication/text-final-chunk-04.csv \
    data/staging/catalog-expansion/batches/batch-005/adjudication/genres-final-chunk-04.csv \
    data/staging/catalog-expansion/batches/batch-005/adjudication/themes-final-chunk-04.csv
c8a92dc507a6caf4dc54ef7e2d602cb99d904e2c8493d3e9174c6ad85f333877  text-final-chunk-04.csv
74b97438f9d055f7f283826ddcb3f1d16cc0a7ebcd2efe0f4271664bdbf78fff  genres-final-chunk-04.csv
8583aa7367ce234f0c2ae14a561dc2cd4c06f1262035a292b754feb2ee53bf50  themes-final-chunk-04.csv

$ git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-chunk-04-round-4.md
PASS
```
