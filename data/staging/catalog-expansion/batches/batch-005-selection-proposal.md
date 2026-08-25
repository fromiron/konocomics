# Batch 005 selection proposal

## 상태

- 제안 상태: `selection-proposal` (아직 freeze하지 않음)
- 제안일: 2026-08-25
- reviewedByHuman: `false`
- 대상: 기존 Gold, `recommendationVerified`, `promotionBlocked`, pilot-001 및 batch-002~004 frozen set을 제외한 유효 `libraryOnly`
- 제안 수: 50
- 제안 전 eligible pool: 1,264
- 선정 후 잔여 eligible pool: 1,214

이 문서는 처리 순서 제안일 뿐이다. registry, source membership, canonical mapping, safety, ISBN, source/generated 파일을 변경하지 않았고, 이 문서만으로 `plannedBatch`를 지정하거나 작품을 freeze하지 않는다.

## 선별 기준

현재 남은 후보에는 DCInside·FMKorea `included` membership가 없다. DC 월간 목록은 현재 `unresolved`, FMKorea 오덕양성소 목록은 `canonicalMappingCount=0`인 상태이므로, 이번 제안에서 해당 provenance가 있다고 추정하지 않았다. 두 커뮤니티 원천의 정규화가 완료되면 다음 selection에서 최우선으로 반영해야 한다.

현재 확인 가능한 priority signal은 다음 순서로 적용했다.

1. 유효한 일본 공식 만화상·공식 편집 랭킹·서점원 추천 provenance
2. `sourceCount`가 큰 항목 우선(동일 source type 내에서 반복 확인된 항목)
3. 기존 batch의 범위를 보완하는 시대 분포: 1989년 이전 8, 1990년대 6, 2000년대 16, 2010년대 12, 2020년대 8
4. award 일변도를 줄이는 bookseller 15, editorial 4를 포함하고, 나머지는 공식 award로 채움
5. 장르·독자층은 현재 selection 데이터에 확정 필드가 없으므로 제목만으로 추정하지 않고, annotation 단계에서 별도 검증

선정 50개는 `sourceCount` 합계 68이다. source type 분포는 `award=31`, `bookseller=15`, `editorial=4`다. 현재 eligible pool에는 sourceTypes 복수 조합 항목이 남아 있지 않아, “복수 source type” 우선순위는 이번 표본에서 충족 가능한 범위가 없음을 명시한다.

## 제안 작품

`safety / canonical / representative ISBN`은 promotion registry에서 각각 `safe / verified / verified`로 확인한 값이다. ISBN 자체는 selection 근거로만 기재하며, 실제 batch freeze 시점에 standard edition 및 작품-저자 일치 여부를 재검증한다.

| position | workId                    | title                                          | first year | priority evidence                                        | current gate status        | selection reason                                                                   |
| -------: | ------------------------- | ---------------------------------------------- | ---------: | -------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------- |
|        1 | work-db2dcc1ea0999bd3c12b | あさりちゃん                                   |       1980 | shogakukan-manga-award-31 (award, n=2)                   | safe / verified / verified | 1989년 이전 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상      |
|        2 | work-9b486df34cdf8853a038 | 釣りバカ日誌                                   |       1980 | shogakukan-manga-award-28 (award, n=1)                   | safe / verified / verified | 1989년 이전 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상      |
|        3 | work-1d9c4fcacb0b35e9fa5a | みゆき                                         |       1981 | shogakukan-manga-award-28 (award, n=1)                   | safe / verified / verified | 1989년 이전 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상      |
|        4 | work-c5bfedbb9ee87b8dea2b | ファンシィダンス                               |       1985 | shogakukan-manga-award-34 (award, n=1)                   | safe / verified / verified | 1989년 이전 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상      |
|        5 | work-b73dec44c4920042dcae | B・B                                           |       1985 | shogakukan-manga-award-34 (award, n=1)                   | safe / verified / verified | 1989년 이전 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상      |
|        6 | work-5924760a1dde711fff88 | キャプテン                                     |       1986 | shogakukan-manga-award-22 (award, n=1)                   | safe / verified / verified | 1989년 이전 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상      |
|        7 | work-03d7687838b304cde377 | つるピカハゲ丸                                 |       1986 | shogakukan-manga-award-33 (award, n=1)                   | safe / verified / verified | 1989년 이전 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상      |
|        8 | work-b016fb45e3491836d5ce | 冬物語                                         |       1987 | shogakukan-manga-award-33 (award, n=1)                   | safe / verified / verified | 1989년 이전 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상      |
|        9 | work-e7654f6737cf01051e67 | 薔薇のために                                   |       1992 | shogakukan-manga-award-39 (award, n=1)                   | safe / verified / verified | 1990년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       10 | work-1dc5eed44438268f78cd | あすなろ白書                                   |       1992 | shogakukan-manga-award-37 (award, n=1)                   | safe / verified / verified | 1990년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       11 | work-40e18fd954b5dff1eb7d | ワン・モア・ジャンプ                           |       1993 | shogakukan-manga-award-39 (award, n=1)                   | safe / verified / verified | 1990년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       12 | work-a83fea90f846cb4acd9d | みどりのマキバオー                             |       1995 | shogakukan-manga-award-42 (award, n=1)                   | safe / verified / verified | 1990년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       13 | work-312aa7f134372423fce0 | め組の大吾                                     |       1996 | shogakukan-manga-award-42 (award, n=1)                   | safe / verified / verified | 1990년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       14 | work-4041eac49a3884db9248 | 天使な小生意気                                 |       1999 | shogakukan-manga-award-46 (award, n=1)                   | safe / verified / verified | 1990년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       15 | work-db48ea2327eb5a3ddc09 | チーズスイートホーム                           |       2004 | nippan-bookseller-recommendations-2006 (bookseller, n=1) | safe / verified / verified | 2000년대 시대 공백 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상         |
|       16 | work-93a7507ad6a0965f4491 | 働きマン                                       |       2004 | nippan-bookseller-recommendations-2006 (bookseller, n=1) | safe / verified / verified | 2000년대 시대 공백 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상         |
|       17 | work-1c1cf67a3118c01ffaad | クロサギ                                       |       2004 | shogakukan-manga-award-53 (award, n=1)                   | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       18 | work-504b8583675a177bd69b | 砂時計                                         |       2003 | shogakukan-manga-award-50 (award, n=1)                   | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       19 | work-d208dd6060ad71a6703c | ぼくらの                                       |       2004 | mangataisho-2008 (award, n=1)                            | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       20 | work-0d894a02becb714986db | 闇金ウシジマくん                               |       2004 | shogakukan-manga-award-56 (award, n=1)                   | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       21 | work-a8aaeb4f15aad02d9e79 | LIAR GAME                                      |       2005 | mangataisho-2008 (award, n=2)                            | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       22 | work-e5998ca4f3e0f450bb74 | へうげもの                                     |       2005 | mangataisho-2008 (award, n=2)                            | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       23 | work-aa6018249b7fe7e92d95 | かよちゃんの荷物                               |       2007 | mangataisho-2008 (award, n=3)                            | safe / verified / verified | 2000년대 시대 공백 보완; 반복 확인 sourceCount 우선; 공식 만화상 provenance        |
|       24 | work-982bb79e03193ebbafcd | ママはテンパリスト                             |       2008 | mangataisho-2009 (award, n=3)                            | safe / verified / verified | 2000년대 시대 공백 보완; 반복 확인 sourceCount 우선; 공식 만화상 provenance        |
|       25 | work-5e30ab3c7e3fb43e51f2 | 女王の花                                       |       2008 | mangataisho-2011 (award, n=3)                            | safe / verified / verified | 2000년대 시대 공백 보완; 반복 확인 sourceCount 우선; 공식 만화상 provenance        |
|       26 | work-d57fec7e1e61ff8809f2 | 青い花                                         |       2006 | mangataisho-2010 (award, n=2)                            | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       27 | work-74c058bfce839d93e3c5 | 東京アリス                                     |       2006 | mangataisho-2008 (award, n=1)                            | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       28 | work-66a2488ed4f6bdd480e1 | 嘘喰い                                         |       2006 | mangataisho-2008 (award, n=1)                            | safe / verified / verified | 2000년대 시대 공백 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상         |
|       29 | work-c2564ae48ae5e689ea66 | バクマン。                                     |       2009 | nippan-bookseller-recommendations-2010 (bookseller, n=1) | safe / verified / verified | 2000년대 시대 공백 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상         |
|       30 | work-86f88e23bba7eaa71afd | 黒子のバスケ                                   |       2009 | nippan-bookseller-recommendations-2010 (bookseller, n=1) | safe / verified / verified | 2000년대 시대 공백 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상         |
|       31 | work-d130ae58f0d7c0b64d36 | うそつきリリィ                                 |       2010 | nippan-bookseller-recommendations-2011 (bookseller, n=1) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       32 | work-1f853c16f6cebca63ffc | 学園ベビーシッターズ                           |       2010 | nippan-bookseller-recommendations-2011 (bookseller, n=1) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       33 | work-fb89f119251610cf1648 | 1/11 じゅういちぶんのいち                      |       2010 | mangataisho-2012 (award, n=3)                            | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 반복 확인 sourceCount 우선; 공식 만화상 provenance |
|       34 | work-1998a3621df8e8cb4b95 | 暁のヨナ                                       |       2010 | mangataisho-2012 (award, n=1)                            | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상  |
|       35 | work-2f6ab113628039681849 | GANGSTA.                                       |       2011 | nippan-bookseller-recommendations-2012 (bookseller, n=1) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       36 | work-19f7ccc2693b36d742e4 | グラゼニ                                       |       2011 | nippan-bookseller-recommendations-2012 (bookseller, n=1) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       37 | work-1ce4c2c1010c1442593d | 図書館の主                                     |       2011 | nippan-bookseller-recommendations-2013 (bookseller, n=1) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       38 | work-c14e82937201df34495d | ワンパンマン                                   |       2012 | nippan-bookseller-recommendations-2013 (bookseller, n=2) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       39 | work-cc64c0784ed6b3bae423 | 私がモテてどうすんだ                           |       2013 | nippan-bookseller-recommendations-2015 (bookseller, n=1) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       40 | work-c1304bfa319ba318368e | 田中くんはいつもけだるげ                       |       2014 | nippan-bookseller-recommendations-2015 (bookseller, n=1) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       41 | work-acd21b368e5f8056c433 | 恋と嘘                                         |       2015 | nippan-bookseller-recommendations-2016 (bookseller, n=1) | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상  |
|       42 | work-f31a42ea4ad724acefa5 | デッドデッドデーモンズデデデデデストラクション |       2014 | tsugimanga-2015-comics (award, n=3)                      | safe / verified / verified | 2010년대 시대·독자층 분산 보완; 반복 확인 sourceCount 우선; 공식 만화상 provenance |
|       43 | work-75114a2ee2082b4f4630 | パリピ孔明                                     |       2020 | nippan-bookseller-recommendations-2021 (bookseller, n=1) | safe / verified / verified | 2020년대 최신·발견형 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상       |
|       44 | work-dd82b7e95c3acd11d5b9 | ダンピアのおいしい冒険                         |       2020 | konomanga-2021-ranking (editorial, n=1)                  | safe / verified / verified | 2020년대 최신·발견형 보완; 공식 편집·랭킹 provenance; ISBN·scope 후속 검증 대상    |
|       45 | work-540d5788c906bfcc7234 | 後ハッピーマニア                               |       2020 | konomanga-2021-ranking (editorial, n=1)                  | safe / verified / verified | 2020년대 최신·발견형 보완; 공식 편집·랭킹 provenance; ISBN·scope 후속 검증 대상    |
|       46 | work-9f01ddaef8d3525c771f | ふたりエスケープ                               |       2020 | tsugimanga-2021-comics (award, n=2)                      | safe / verified / verified | 2020년대 최신·발견형 보완; 공식 만화상 provenance; ISBN·scope 후속 검증 대상       |
|       47 | work-88cb26a0229ad7b83263 | ひらやすみ                                     |       2021 | mangataisho-2022 (award, n=3)                            | safe / verified / verified | 2020년대 최신·발견형 보완; 반복 확인 sourceCount 우선; 공식 만화상 provenance      |
|       48 | work-56e45e2dd0d00d5f24a8 | ブランクスペース                               |       2021 | konomanga-2022-ranking (editorial, n=1)                  | safe / verified / verified | 2020년대 최신·발견형 보완; 공식 편집·랭킹 provenance; ISBN·scope 후속 검증 대상    |
|       49 | work-50afa45b590e1bd55fa1 | 東京ヒゴロ                                     |       2021 | konomanga-2022-ranking (editorial, n=1)                  | safe / verified / verified | 2020년대 최신·발견형 보완; 공식 편집·랭킹 provenance; ISBN·scope 후속 검증 대상    |
|       50 | work-364e62bd7dfd73149d14 | ホテル・メッツァペウラへようこそ               |       2022 | nippan-bookseller-recommendations-2024 (bookseller, n=1) | safe / verified / verified | 2020년대 최신·발견형 보완; 서점원 추천 provenance; ISBN·scope 후속 검증 대상       |

## provenance·재현성 근거

각 `priority evidence`의 원문 URL·기관·발표일·조회일은 `data/staging/catalog-expansion/source-registry.csv`와 매핑 CSV에서 다시 확인한다. 대표 source URL의 예시는 다음과 같다.

- 小学館漫画賞 archive: https://shogakukan-comic.jp/shogakukan-mangasho-archives
- マンガ大賞 archive: https://www.mangataisho.com/archives/2008.html (연도별 archive ID로 교체)
- 全国書店員が選んだおすすめコミック: https://hon-hikidashi.jp/event/104714/ (연도별 source ID로 교체)
- このマンガがすごい！ 공식 발표: https://sugoiweb.jp/column/4868/ (연도별 source ID로 교체)
- 次にくるマンガ大賞 comics: https://tsugimanga.jp/winner/2021/comics (연도별 source ID로 교체)

검증 입력 count:

| input                         |                                             count | SHA-256                                                          |
| ----------------------------- | ------------------------------------------------: | ---------------------------------------------------------------- |
| promotion-registry.csv        |                                        1,614 rows | 4058421824d4135959cdc19df2eb63027addd645a74465ca82949578f5df22f4 |
| candidates.csv                |                                        1,541 rows | ad9fcafe3ca85ffab4e29a6b0aecc86e0134eecc3615b7faeaae53d62d2e1294 |
| source-membership.csv         |                                        9,009 rows | 187b2981a2fdc0c57e0c3bfbca1f92542371b5a8acf906d32dbbf460f26cfc1d |
| canonical-mapping.csv         |                                        2,239 rows | 426d6aea72c7609f6ed828921b07c2832981447e7b41f18c4381c733b0fa9d8d |
| safety-review.csv             |                            1,541 rows; safe 1,541 | 965bce7bcf842ee7005c80a86efc0c36776a59acc2f71eaa55a3f8b7bba82bb7 |
| rakuten-matches.csv           | 1,541 rows; matched standard representative 1,541 | 70052da5afd94fa6428237d01916d04a8882af9e63c6e2dc047a90b0494cc824 |
| source-registry.csv           |                          source registry snapshot | f9b707fa6931cbe7e00924d055abd9c004d0344563929888df668fcb32413f62 |
| batch-ledger.csv              |   200 rows (pilot-001 and batch-002–004, 50 each) | 57e8627b7d06267b636173029769cac82c7030d651a1b04ac9b3fa4b6a603b7c |
| batch-002/frozen-work-set.csv |                                           50 rows | 80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6 |
| batch-003/frozen-work-set.csv |                                           50 rows | ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd |
| batch-004/frozen-work-set.csv |                                           50 rows | a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1 |

검증 결과: frozen unique 200, registry `libraryOnly + pending` 1,314, frozen 제외 eligible 1,264, 제안 50, 제안 행의 `safe / verified / verified` 50/50/50. 다음 단계에서만 이 제안을 재검증하고 실제 batch-005 frozen-work-set을 생성한다.
