# Pilot 001 recommendation context final-overlay provenance

- 작성 시각 기준: 2026-08-23 (Asia/Tokyo)
- 대상: `data/staging/catalog-expansion/pilots/pilot-001/manifest.json`에 동결된 50개 Work
- 산출물: `/tmp/pilot-001-recommendation-context-final.csv`
- 상태: source-shaped 초안. `data/source/**`, Gold 150, generated artifact에는 적용하지 않았다.
- 제목 규칙: canonical title은 동결 packet의 값을 그대로 대조했으며 장식 인용부호 `『`와 `』`를 추가하지 않았다.

## 계약과 판정 원칙

1. `docs/planning/02-product-spec.md` §2와 §6.8에 따라 `catalogRole`은 `anchor | bridge | discovery`, `seriesGroupId`는 선택, `volumeCount`는 필수 정수다. Anchor는 인기도가 아니라 대비되는 취향 축을 판독하는 기능 역할이다.
2. `data/source/README.md`의 현행 계약에 따라 `reviewAverage`와 `reviewCount`는 둘 다 결측 가능하다. 저장된 확장 Rakuten 응답에는 재현 가능한 대표 1권 리뷰 snapshot이 없으므로 50행 모두 두 필드를 공란으로 유지했다. 0건을 확인하지 않았으므로 `reviewCount=0`도 만들지 않았다.
3. `volumeCount`는 2026-08-23까지 실제 발매된 일본어 일반 단행본 본편의 수다. 세트, 특장판, 완전판, 문고판, 애장판, 공식 가이드, 팬북, 소설, 스핀오프, 별도 속편은 제외했다. 전자판이 다른 재편집 권수를 쓰면 원래 일반 단행본 본편 권수를 택했다.
4. 저장 응답 근거는 `data/staging/catalog-expansion/rakuten-search-results.jsonl`의 `retrievedAt=2026-08-22` 레코드다. 표의 Rakuten URL과 `salesDate`를 해당 JSONL에서 대조했다. 미래 발매 예약은 집계하지 않았다.
5. `seriesGroupId` 공란은 스키마상 허용된다. Pilot 50 안에는 동시에 추천 참여하는 직접 속편 쌍이 없다. `ポーの一族 ユニコーン`은 전체 library catalog에 별도 Work로 존재하지만 Pilot 밖 `libraryOnly`이므로, 기존 `data/staging/g1/context-curation.md` 관례대로 그 작품이 승격될 때 원작과 양쪽 행에 동일 그룹을 함께 부여한다. 한쪽에만 선행 그룹을 만들지 않았다.
6. 역할은 Pilot annotation/evidence packet의 초반 1~3권 범위와 기존 Gold role 관례를 보고 작품별로 판정했다. 목표 비율을 역산하지 않았다. 결과는 Anchor 12, Bridge 14, Discovery 24다.

## 역할 판정 원장

| workId | canonical title | role | 기능 판정 근거 |
|---|---|---|---|
| `work-0153a125c5a56225b06c` | 違国日記 | bridge | 가족 상실·동거·대화 중심의 관계극으로 일상/가족 취향과 내면 성장 취향을 연결한다. |
| `work-0262dcaa820443c3185d` | ゴルゴ13 | anchor | 국제 범죄·의뢰 수행·전략적 문제 해결의 장기 에피소드형 극단을 분명히 가른다. |
| `work-07b11ec79f10c7eb7e05` | かくかくしかじか | bridge | 창작·사제관계·회고 성장담이 직업/예술 취향과 인물 성장 취향을 잇는다. |
| `work-07dc759bd91e1cffb2df` | しあわせは食べて寝て待て | bridge | 음식·건강·생활 재건의 저강도 서사가 일상/치유 취향과 사회생활 취향을 연결한다. |
| `work-07ff2a01ef593ce2f809` | さよならミニスカート | discovery | 아이돌 경험과 젠더·학교 관계를 다루는 비교적 좁고 중단 이력이 있는 주제를 발견 슬롯에서 제시한다. |
| `work-081e75d8bbc53ac64713` | ダイヤモンドの功罪 | bridge | 야구 재능의 압박과 팀 관계를 통해 스포츠 경쟁 취향과 심리·인물극 취향을 잇는다. |
| `work-0bec5d8d9474a2197312` | 放浪息子 | discovery | 젠더 정체성과 성장 관계를 장기적으로 다루는 특화된 인물극을 발견 슬롯에서 제시한다. |
| `work-112589a161d1596ec97f` | 写らナイんです | discovery | 학교 괴이와 코미디가 결합된 최신작으로, 주류 배틀과 다른 호러-코미디 변형을 발견시킨다. |
| `work-11296a590b885cb73b66` | 透明なゆりかご | bridge | 산부인과 현장의 사례극이 의료·직업 취향과 감정·사회문제 취향을 연결한다. |
| `work-14e489bf1afd1587c44a` | YAWARA！ | anchor | 유도 경쟁, 일상 코미디, 성장과 로맨스가 함께 있어 스포츠 중심 취향의 대비 판독력이 크다. |
| `work-192cbecc59e9c028142b` | 本なら売るほど | discovery | 헌책방 직업·책 문화의 조용한 에피소드형 소재를 발견 슬롯에서 제시한다. |
| `work-1cf7a0bb5f55e0d69b27` | モンキーターン | discovery | 경정이라는 특수 직업 스포츠의 기술·경쟁 구조를 주류 구기 스포츠 밖에서 발견시킨다. |
| `work-1fc61ddbeb429b4a2c15` | エマ | discovery | 빅토리아 시대 계급과 로맨스를 정교하게 결합한 역사 연애극을 발견 슬롯에서 제시한다. |
| `work-205e576ef057e3aed1ab` | 坂道のアポロン | bridge | 재즈·우정·청춘 관계가 음악 취향과 성장/로맨스 취향을 잇는다. |
| `work-222504590507d3ab8093` | 王様ランキング | bridge | 동화적 판타지 외형과 성장·관계·모험을 함께 가져 판타지 독자와 인물극 독자를 연결한다. |
| `work-268e1fa3599955359969` | ふつうの軽音部 | bridge | 밴드 활동·학교 관계·자기표현이 음악/코미디/성장 취향을 연결한다. |
| `work-2f39795212f5ad8db155` | あずみ | anchor | 역사 배경의 전투·생존·임무와 높은 어둠/압박의 대비를 명확히 판독한다. |
| `work-303d0a9d67a606a817af` | ギャラリーフェイク | discovery | 미술 시장·진위 감정·사건 해결이라는 전문 직업물을 발견 슬롯에서 제시한다. |
| `work-34bba03e2a127ef29cd7` | 北北西に曇と往け | discovery | 아이슬란드 생활·여행·미스터리의 독특한 조합을 발견 슬롯에서 제시한다. |
| `work-3588928ab8f6a2520923` | 海が走るエンドロール | discovery | 노년의 영화 제작 도전이라는 드문 연령·창작 관점을 발견 슬롯에서 제시한다. |
| `work-37ecced0b2392d7af9b2` | 路傍のフジイ | discovery | 평범한 중년 직장인을 관찰하는 저자극 인간극을 발견 슬롯에서 제시한다. |
| `work-3823ff0766f67c015c53` | ましろのおと | bridge | 전통 음악의 수련·경쟁과 청춘 성장담이 음악/스포츠형 성취 취향을 잇는다. |
| `work-39555fe7402dada0d79f` | 名探偵コナン | anchor | 반복 가능한 사건 수사·추리·미스터리 공개 구조가 문제 해결 취향을 강하게 판독한다. |
| `work-440f93a4e60ef906685b` | バラ色の明日 | discovery | 여러 관계와 삶을 다루는 단편 연작형 소녀만화를 발견 슬롯에서 제시한다. |
| `work-464322afcd10013437b9` | 大奥 | anchor | 대체 역사·정치·젠더·권력 관계의 결합이 역사/사회/관계 취향을 뚜렷하게 가른다. |
| `work-4a8a22fc766bf9bc4c59` | 天は赤い河のほとり | discovery | 고대 역사 판타지·궁정 정치·로맨스를 결합한 장편 소녀만화를 발견 슬롯에서 제시한다. |
| `work-5e7eef6cc23d9738e034` | ゴールデンゴールド | discovery | 섬 공동체와 초자연적 불안이 결합된 비정형 사회 호러를 발견 슬롯에서 제시한다. |
| `work-61f2b70ee9f8217b3604` | 銀の匙 Silver Spoon | anchor | 농업학교·노동·음식·성장의 따뜻한 직업 일상극이 액션/어둠 축과 강한 대비를 만든다. |
| `work-671e3453cf9e1df2ee87` | 陽だまりの樹 | discovery | 막부 말기 의사와 무사의 병렬 생애라는 역사·의료 결합을 발견 슬롯에서 제시한다. |
| `work-76c038b398f4b28b7748` | 妖しのセレス | discovery | 가족 갈등·초자연 비극·로맨스가 결합된 1990년대 소녀 판타지를 발견시킨다. |
| `work-7730845c9cf7ba0cccc8` | 君と宇宙を歩くために | bridge | 학교 적응과 상호 보조의 관계극이 청춘/일상 취향과 사회 적응 주제를 잇는다. |
| `work-8716f80d9b988bd0d055` | 恋は雨上がりのように | bridge | 나이 차 관계를 단순 로맨스보다 진로·회복의 인물극으로 연결한다. |
| `work-98d513b70560f2f96a38` | 漂流教室 | discovery | 폐쇄된 학교 집단의 재난·생존·SF 호러라는 고강도 고전을 발견 슬롯에서 제시한다. |
| `work-9d04c47e7efbbbd8aca6` | かげきしょうじょ!! | bridge | 공연예술 수련·학교 경쟁·앙상블 관계가 예술/성장/직업 취향을 잇는다. |
| `work-9d5d64262dbc2893acd4` | ポーの一族 | discovery | 세기를 넘는 뱀파넬 관계극과 고딕 판타지라는 고전적 형식을 발견 슬롯에서 제시한다. |
| `work-a089c0eef91d1213da38` | うる星やつら | anchor | 외계 SF 소동·고밀도 코미디·러브코미디 관계 구조가 코미디/로맨스 취향을 강하게 판독한다. |
| `work-a7a1e0666169f1b2e8c0` | 海街diary | anchor | 자매 가족·상실·일상의 따뜻한 관계극이 가족/감정온기 중심 취향을 분명히 판독한다. |
| `work-ad2b80b81b7bc9b602a3` | Papa told me | discovery | 부녀 가족과 도시 생활을 다루는 장기 여성만화 일상극을 발견 슬롯에서 제시한다. |
| `work-b2c37bdb52e2a78dfd41` | 天幕のジャードゥーガル | bridge | 몽골 제국의 역사·궁정 정치와 여성 지식인의 생존을 역사/전략 취향에 연결한다. |
| `work-b4b21d2ebe5b8efc84ea` | Dr.コトー診療所 | discovery | 도서 의료 현장의 사례와 공동체 관계라는 전문 직업물을 발견 슬롯에서 제시한다. |
| `work-c4abbc1b44fa5706bce3` | 風光る | discovery | 신선조 역사·성별 위장·장기 로맨스를 결합한 시대 소녀만화를 발견시킨다. |
| `work-cdf549d4b1888153e146` | ダンダダン | anchor | 초자연 배틀·빠른 코미디·청춘 로맨스의 동시 고강도가 현대 장르 혼합 취향을 판독한다. |
| `work-d489f5a2229689aa5115` | 女の園の星 | discovery | 여고 교사들의 관찰형 일상 코미디를 저자극 발견 슬롯에서 제시한다. |
| `work-d7e64b0b5479ca943edd` | 深夜食堂 | anchor | 음식과 손님의 삶을 잇는 에피소드형 인간극이 요리/직업/온기 취향을 강하게 판독한다. |
| `work-e049c9aaf92ba31da8b0` | これ描いて死ね | bridge | 만화 창작·동아리·사제 관계가 예술/학교/성장 취향을 잇는다. |
| `work-ebe399258f28460b8f9b` | 鈴木先生 | discovery | 교실 윤리와 교사의 숙고를 밀도 있게 다루는 학교 사회극을 발견 슬롯에서 제시한다. |
| `work-ef7106f6a387c9860877` | その女、ジルバ | discovery | 중년 여성의 재출발·직장·세대 관계라는 드문 관점을 발견 슬롯에서 제시한다. |
| `work-f391e591282e435a3c1d` | アイアムアヒーロー | anchor | 감염 재난·생존 호러·불안정한 인물 시점이 어둠/압박/생존 취향을 강하게 판독한다. |
| `work-f50fa290eb4116a7078e` | 11人いる！ | discovery | 폐쇄 우주선의 인원 불일치 미스터리라는 단권 고전 SF를 발견 슬롯에서 제시한다. |
| `work-f5f0ee0b0ff16bc146e0` | ばらかもん | anchor | 섬 공동체·서예·코미디·회복 성장의 높은 온기가 일상/치유 취향을 판독한다. |

## 권수 provenance

표의 `source date`는 상품 발매일 또는 공식 페이지 게시일이며, 페이지에 날짜가 없으면 `undated`로 명시했다. `retrieved`는 실제 확인일이다.

| workId | title | volumeCount | 판본 범위 | source | source date | retrieved |
|---|---|---:|---|---|---|---|
| `work-0153a125c5a56225b06c` | 違国日記 | 11 | 일반 단행본 1~11, 세트 제외 | [Rakuten 11권](https://books.rakuten.co.jp/rb/17546482/) | 2023-08-08 | 2026-08-22 |
| `work-0262dcaa820443c3185d` | ゴルゴ13 | 221 | リイド社 SPコミックス 본편, 문고·선집 제외 | [リイド社 시리즈 검색 221건](https://www.leed.co.jp/?cond=series&s=%E3%82%B4%E3%83%AB%E3%82%B4%EF%BC%91%EF%BC%93) | undated | 2026-08-23 |
| `work-07b11ec79f10c7eb7e05` | かくかくしかじか | 5 | 일반 단행본 1~5 완결 | [Rakuten 5권](https://books.rakuten.co.jp/rb/13116299/) | 2015-03-25 | 2026-08-22 |
| `work-07dc759bd91e1cffb2df` | しあわせは食べて寝て待て | 6 | 일반 단행본 1~6, 2026-08-23까지 발매분 | [Rakuten 6권](https://books.rakuten.co.jp/rb/18296566/) | 2025-10-16 | 2026-08-22 |
| `work-07ff2a01ef593ce2f809` | さよならミニスカート | 4 | 일반 단행본 1~4 | [Rakuten 4권](https://books.rakuten.co.jp/rb/18216556/) | 2025-06-25 | 2026-08-22 |
| `work-081e75d8bbc53ac64713` | ダイヤモンドの功罪 | 10 | 일반 단행본 1~10, 2026-08-23까지 발매분 | [Rakuten 10권](https://books.rakuten.co.jp/rb/18508766/) | 2026-07-17 | 2026-08-22 |
| `work-0bec5d8d9474a2197312` | 放浪息子 | 15 | 일반 단행본 1~15 완결 | [Rakuten 15권](https://books.rakuten.co.jp/rb/12382944/) | 2013-08 | 2026-08-22 |
| `work-112589a161d1596ec97f` | 写らナイんです | 9 | 일반 단행본 1~9, 2026-08-23까지 발매분 | [Rakuten 9권](https://books.rakuten.co.jp/rb/18691893/) | 2026-08-18 | 2026-08-22 |
| `work-11296a590b885cb73b66` | 透明なゆりかご | 9 | 일반 단행본 1~9 | [Rakuten 9권](https://books.rakuten.co.jp/rb/16672882/) | 2021-04-13 | 2026-08-22 |
| `work-14e489bf1afd1587c44a` | YAWARA！ | 29 | 원 일반 단행본 1~29; e-comi 20권 재편집판은 제외 | [Rakuten 원판 29권](https://books.rakuten.co.jp/rb/621374/) | 1993-10-29 | 2026-08-22 |
| `work-192cbecc59e9c028142b` | 本なら売るほど | 3 | 일반 단행본 1~3, 2026-08-23까지 발매분 | [Rakuten 3권](https://books.rakuten.co.jp/rb/18477487/) | 2026-04-15 | 2026-08-22 |
| `work-1cf7a0bb5f55e0d69b27` | モンキーターン | 30 | 원 일반 단행본 1~30 완결, 재편집판 제외 | [Rakuten 30권](https://books.rakuten.co.jp/rb/1765042/) | 2005-02 | 2026-08-22 |
| `work-1fc61ddbeb429b4a2c15` | エマ | 10 | KADOKAWA 공식 시리즈 1~10; 8~10의 후일담 권도 같은 공식 시리즈 본편 권차로 포함 | [KADOKAWA 10권 최종권](https://www.kadokawa.co.jp/product/301502000872/) | 2008-04-25 | 2026-08-23 |
| `work-205e576ef057e3aed1ab` | 坂道のアポロン | 9 | 일반 본편 1~9; BONUS TRACK·fan book 제외 | [Rakuten 9권](https://books.rakuten.co.jp/rb/11604053/) | 2012-04-26 | 2026-08-22 |
| `work-222504590507d3ab8093` | 王様ランキング | 22 | 2026-08-23까지 발매된 본편; 예약 23권(2026-10-09)은 제외 | [KADOKAWA 22권](https://www.kadokawa.co.jp/product/322602000682/) | 2026-06-12 | 2026-08-23 |
| `work-268e1fa3599955359969` | ふつうの軽音部 | 11 | 2026-08-23까지 발매된 본편; 예약 12권(2026-10-02)은 제외 | [集英社 11권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-885108-2) | 2026-07-03 | 2026-08-23 |
| `work-2f39795212f5ad8db155` | あずみ | 48 | 원 일반 본편 1~48 완결; 별도 속편 AZUMI 제외 | [小学館 e-comi 본편 시리즈](https://e-comi.shogakukan.co.jp/books/091835410000d0000000) | undated | 2026-08-23 |
| `work-303d0a9d67a606a817af` | ギャラリーフェイク | 40 | 같은 본편 시리즈 1~40; 타테읽기 파생작 제외 | [小学館 e-comi 시리즈 40권](https://e-comi.shogakukan.co.jp/books/098607980000d0000000) | undated | 2026-08-23 |
| `work-34bba03e2a127ef29cd7` | 北北西に曇と往け | 7 | 기존 본편 1~7; ワイド版 중복과 별도 `続の1` 제외 | [Rakuten 일반판 7권](https://books.rakuten.co.jp/rb/17740752/) | 2024-02-19 | 2026-08-22 |
| `work-3588928ab8f6a2520923` | 海が走るエンドロール | 9 | 일반 단행본 1~9, 2026-08-23까지 발매분 | [Rakuten 9권](https://books.rakuten.co.jp/rb/18525992/) | 2026-05-15 | 2026-08-22 |
| `work-37ecced0b2392d7af9b2` | 路傍のフジイ | 6 | 2026-08-23까지 발매된 본편; 예약 7권(2026-09-30)은 제외 | [小学館 e-comi 6권](https://e-comi.shogakukan.co.jp/books/098637810000d0000000) | undated | 2026-08-23 |
| `work-3823ff0766f67c015c53` | ましろのおと | 31 | 일반 본편 1~31 완결; 특장판·소설 제외 | [講談社 31권](https://www.kodansha.co.jp/comic/products/0000369873) | 2022-10-17 | 2026-08-23 |
| `work-39555fe7402dada0d79f` | 名探偵コナン | 108 | 일반 본편 1~108; 특별편·fan book 제외 | [小学館 e-comi 108권](https://e-comi.shogakukan.co.jp/books/098545320000d0000000) | undated | 2026-08-23 |
| `work-440f93a4e60ef906685b` | バラ色の明日 | 6 | 원 일반 단행본 1~6; 完全版 중복 제외 | [Rakuten 원판 6권](https://books.rakuten.co.jp/rb/1141656/) | 2000-03-24 | 2026-08-22 |
| `work-464322afcd10013437b9` | 大奥 | 19 | 일반 본편 1~19 완결; 특장판·공식 fan book 제외 | [白泉社 19권](https://www.hakusensha.co.jp/comicslist/59479/) | 2021-02-26 | 2026-08-23 |
| `work-4a8a22fc766bf9bc4c59` | 天は赤い河のほとり | 28 | 원 일반 단행본 1~28 완결; fan book·애장판 제외 | [Rakuten 28권](https://books.rakuten.co.jp/rb/1467955/) | 2002-07 | 2026-08-22 |
| `work-5e7eef6cc23d9738e034` | ゴールデンゴールド | 9 | 일반 단행본 1~9 | [Rakuten 9권](https://books.rakuten.co.jp/rb/16883808/) | 2021-11-22 | 2026-08-22 |
| `work-61f2b70ee9f8217b3604` | 銀の匙 Silver Spoon | 15 | 일반 본편 1~15 완결; 특장판 중복 제외 | [Rakuten 15권](https://books.rakuten.co.jp/rb/16184430/) | 2020-02-18 | 2026-08-22 |
| `work-671e3453cf9e1df2ee87` | 陽だまりの樹 | 11 | 원 일반 단행본 1~11; 6권 재편집 collection 제외 | [Rakuten 원판 11권](https://books.rakuten.co.jp/rb/9325024/) | 1987-04 | 2026-08-22 |
| `work-76c038b398f4b28b7748` | 妖しのセレス | 14 | 원 일반 단행본 1~14 완결 | [Rakuten 14권](https://books.rakuten.co.jp/rb/1142019/) | 2000-03-25 | 2026-08-22 |
| `work-7730845c9cf7ba0cccc8` | 君と宇宙を歩くために | 6 | 일반 단행본 1~6, 2026-08-23까지 발매분 | [Rakuten 6권](https://books.rakuten.co.jp/rb/18608115/) | 2026-05-22 | 2026-08-22 |
| `work-8716f80d9b988bd0d055` | 恋は雨上がりのように | 10 | 원 일반 단행본 1~10 완결; 신장판 5권 재편집 제외 | [Rakuten 원판 10권](https://books.rakuten.co.jp/rb/15385898/) | 2018-04-27 | 2026-08-22 |
| `work-98d513b70560f2f96a38` | 漂流教室 | 11 | 원 일반 단행본 1~11; e-comi 6권 재편집판 제외 | [Rakuten 원판 11권](https://books.rakuten.co.jp/rb/376219/) | 1975-04-25 | 2026-08-22 |
| `work-9d04c47e7efbbbd8aca6` | かげきしょうじょ!! | 16 | `!!` 본편 1~16; 전신작·シーズンゼロ·guide book 제외 | [Rakuten 16권](https://books.rakuten.co.jp/rb/18319260/) | 2025-09-05 | 2026-08-22 |
| `work-9d5d64262dbc2893acd4` | ポーの一族 | 5 | 원작 본편 1~5; 복각판 중복·현대 후속 시리즈 제외 | [小学館 e-comi 원작 5권](https://e-comi.shogakukan.co.jp/books/091300010000d0000000) | undated | 2026-08-23 |
| `work-a089c0eef91d1213da38` | うる星やつら | 34 | 원 일반 단행본 1~34 완결; 문고·신장·애니판 제외 | [小学館 e-comi 시리즈](https://e-comi.shogakukan.co.jp/books/091207160000d0000000) | undated | 2026-08-23 |
| `work-a7a1e0666169f1b2e8c0` | 海街diary | 9 | 일반 본편 1~9 완결; recipe book 제외 | [Rakuten 9권](https://books.rakuten.co.jp/rb/15701173/) | 2018-12-10 | 2026-08-22 |
| `work-ad2b80b81b7bc9b602a3` | Papa told me | 27 | 원 일반 단행본 1~27; 完全版과 후속 테마 단행본 제외 | [Rakuten 원판 27권](https://books.rakuten.co.jp/rb/1634345/) | 2004-01 | 2026-08-22 |
| `work-b2c37bdb52e2a78dfd41` | 天幕のジャードゥーガル | 6 | 일반 본편 1~6; companion `もっと！` 제외 | [Rakuten 6권](https://books.rakuten.co.jp/rb/18626213/) | 2026-07-15 | 2026-08-22 |
| `work-b4b21d2ebe5b8efc84ea` | Dr.コトー診療所 | 25 | 小学館 공식판 본편 1~25; 특별편·애장판 제외 | [小学館 e-comi 공식판 25권](https://e-comi.shogakukan.co.jp/books/091514950000d0000000) | undated | 2026-08-23 |
| `work-c4abbc1b44fa5706bce3` | 風光る | 45 | 원 일반 본편 1~45 완결 | [小学館 e-comi 45권](https://e-comi.shogakukan.co.jp/books/098712990000d0000000) | undated | 2026-08-23 |
| `work-cdf549d4b1888153e146` | ダンダダン | 24 | 2026-08-23까지 발매된 본편; [차기 25권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-885188-4)은 2026-09-04 발매 예정이라 제외 | [集英社 24권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-885125-9) | 2026-06-04 | 2026-08-23 |
| `work-d489f5a2229689aa5115` | 女の園の星 | 4 | 2026-08-23까지 발매된 본편; 예약 5권(2026-09-08)은 제외 | [祥伝社 공식 작품 페이지](https://www.shodensha.co.jp/onnanosononohoshi/) | 2024-10-08 | 2026-08-23 |
| `work-d7e64b0b5479ca943edd` | 深夜食堂 | 30 | 일반 본편 1~30, 2026-08-23까지 발매분 | [小学館 e-comi 30권](https://e-comi.shogakukan.co.jp/books/098635980000d0000000) | undated | 2026-08-23 |
| `work-e049c9aaf92ba31da8b0` | これ描いて死ね | 10 | 일반 단행본 1~10, 2026-08-23까지 발매분 | [Rakuten 10권](https://books.rakuten.co.jp/rb/18661042/) | 2026-07-10 | 2026-08-22 |
| `work-ebe399258f28460b8f9b` | 鈴木先生 | 11 | 일반 본편 1~11 완결; 세트·外典 제외 | [Rakuten 11권](https://books.rakuten.co.jp/rb/11130277/) | 2011-04-28 | 2026-08-22 |
| `work-ef7106f6a387c9860877` | その女、ジルバ | 5 | 일반 본편 1~5 완결 | [Rakuten 5권](https://books.rakuten.co.jp/rb/15580216/) | 2018-09-28 | 2026-08-22 |
| `work-f391e591282e435a3c1d` | アイアムアヒーロー | 22 | 일반 본편 1~22 완결; 소설·공식 영화책·지역 스핀오프 제외 | [Rakuten 22권](https://books.rakuten.co.jp/rb/14666889/) | 2017-03-30 | 2026-08-22 |
| `work-f50fa290eb4116a7078e` | 11人いる！ | 1 | 단권 본편; 후속 `続・11人いる！`과 합본·재편집판 제외 | [小学館 e-comi 단권](https://e-comi.shogakukan.co.jp/books/091910110000d0000000) | undated | 2026-08-23 |
| `work-f5f0ee0b0ff16bc146e0` | ばらかもん | 19 | 번호 본편 1~18과 공식 추가 본편 `18+1` 1권; 특장판·spin-off 제외 | [Rakuten 18+1](https://books.rakuten.co.jp/rb/15699615/) | 2018-12-12 | 2026-08-22 |

## 현재 차단 여부와 의도적으로 비운 필드

- `volumeCount`: 50/50 모두 양의 정수로 확정했다. 대표권=1이나 0 fallback을 사용한 행은 없다.
- `reviewAverage`, `reviewCount`: 50/50 모두 선택 필드로 의도적으로 공란이다. 이는 승격 blocker가 아니며, 대표 1권 ISBN과 정확히 결합된 별도 market snapshot을 나중에 만들 때만 채워야 한다.
- `seriesGroupId`: 50/50 공란이다. 현재 Pilot 추천 후보끼리 직접 속편 pair가 없으므로 유효하다. `ポーの一族` 계열의 Pilot 밖 Work가 승격될 때 양쪽을 원자적으로 갱신해야 한다.
- 현재 overlay 자체에는 hard blocker가 없다. 다만 ongoing 5작품의 미래 예약권을 제외한 기준일 수량(`王様ランキング=22`, `ふつうの軽音部=11`, `路傍のフジイ=6`, `ダンダダン=24`, `女の園の星=4`)은 적용 직전에 기준일이 바뀌면 다시 조회해야 한다.
