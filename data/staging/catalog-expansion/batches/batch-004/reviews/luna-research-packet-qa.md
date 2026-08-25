# Batch 004 research packet independent QA

- reviewer: Luna subagent
- reviewedByHuman: false
- reviewedAt: 2026-08-25
- scope: `research/chunk-01.md` through `research/chunk-05.md`
- comparison inputs: `frozen-work-set.csv`, `data/source/works.csv`
- policy: read-only QA; no web re-collection and no source packet edits

## QA method

The following checks were performed against the five research packets:

1. The frozen manifest contains 50 works and every work appears in exactly one `## workId` section.
2. Each section's `workId` and canonical title match the frozen manifest and `data/source/works.csv`.
3. No canonical heading contains decorative `『` or `』` characters.
4. Every source record has `sourceName`, an HTTP(S) `sourceUrl`, `publishedAt`, `retrievedAt: 2026-08-25`, `evaluatedRange`, `provenanceFactorClassification`, and `supportedClaims`.
5. Every record documents an entry range, or explicitly documents a one-shot/single-volume exception or a source whose scope is only identity/provenance.
6. `factor-evidence-primary`, `factor-evidence-secondary-lead`, `identity-edition-lead-only`, and `selection-provenance-only` are explicitly separated. Selection-only and identity-only records state that they must not be used as Factor/Genre/Theme evidence.

## Aggregate result

| check | result |
| --- | ---: |
| frozen works | 50 |
| research headings | 50 |
| unique research works | 50 |
| duplicate or missing work sections | 0 |
| `workId`/title mismatch against frozen set or source works | 0 |
| decorated canonical headings | 0 |
| source records | 184 |
| source records with required metadata | 184 |
| source records missing `retrievedAt: 2026-08-25` | 0 |
| works with an explicit range/exception record | 50 |
| provenance/factor classification boundary failures | 0 |
| works PASS | 50 |
| works with hard QA failure | 0 |

The source classification counts are: `factor-evidence-primary` 132, `factor-evidence-secondary-lead` 21, `identity-edition-lead-only` 10, and `selection-provenance-only` 21. The latter two classifications are accompanied by limitations that keep them out of direct Factor evidence; the selection records in chunk 05 state that they only establish inclusion/selection provenance.

## Work-level results

`PASS` means the packet satisfies this QA's structural and provenance contract. Notes are bounded limitations for the next annotation/identity/safety pass, not QA failures.

| pos | workId | canonical title | result | observed limitation or follow-up |
| ---: | --- | --- | --- | --- |
| 1 | `work-025c8ab93483a39c9330` | ホストと社畜 | PASS | 3권 내용이 직접 확인되고 1–2권은 공식 링크/서지로 식별됨; 범위를 과장하지 않음. |
| 2 | `work-098b1781e14365eea667` | うるわしの宵の月 | PASS | 공식 1–3권 권별 소개. |
| 3 | `work-0f3a44f5dcab9623d1be` | 応天の門 | PASS | 공식 1–3권 권별 소개. |
| 4 | `work-11d23966f22f777e95d0` | のらみみ | PASS | 공식 동적 e-comic 페이지의 권별 날짜/ISBN 미노출을 `undated`와 limitation으로 명시. |
| 5 | `work-132ce7172750a3b1fa53` | ヒナまつり | PASS | 공식 1–3권 소개; 작품 내 야쿠자/초능력은 안전 검토 신호로만 기록. |
| 6 | `work-15dba4fdb46308ab45d7` | 駅から5分 | PASS | 1권 직접, 1–2권 재수록 소개, 3권 서지 보조로 범위 역할을 분리. |
| 7 | `work-188ba092c6195603bb3f` | つらつらわらじ | PASS | 1권 primary, 2권 secondary, 3권 identity로 분리. |
| 8 | `work-19c2017b33c07f48634e` | ふうらい姉妹 | PASS | 공식 1–3권 권별 소개. |
| 9 | `work-1a6ad6771865b43c8516` | それでも町は廻っている | PASS | 1·3권 primary와 시리즈/심사 보조를 분리; 2권은 identity 보강 범위. |
| 10 | `work-1cdc6c5cca7c33fafe51` | 青空にとおく酒浸り | PASS | 1–3권은 공인 서지로 identity를 확정하고 내용 근거 부족을 명시; 심사 코멘트는 1–3권에 소급하지 않음. |
| 11 | `work-23077ad33a2066bef5a6` | Sunny | PASS | 공식 1–3권 소개와 심사 코멘트; 심사자의 비균일 독서 범위 제한을 기록. |
| 12 | `work-2356050c72240569e1c5` | すみれファンファーレ | PASS | 공식 1–3권 소개; 전자 재출간일과 원 인쇄본 발매일을 구분. |
| 13 | `work-2c4fe00df5255fc082f9` | ヒーローカンパニー | PASS | 공식 도입/1권과 후속 심사 코멘트의 범위가 1–3권과 완전히 일치하지 않음을 명시. |
| 14 | `work-2d385ad0525742330e70` | ねずみの初恋 | PASS | 공식 1–3권 상품 소개. |
| 15 | `work-2df743e085adef5e9bd3` | キルアオ | PASS | 공식 1–3권 상품/시리즈 소개. |
| 16 | `work-2f1d1c3ad0f943f1562f` | 尾守つみきと奇日常。 | PASS | 후속 권 홍보·시리즈 개요는 entry 1–3권 밖의 근거로 사용하지 않도록 제한. |
| 17 | `work-3713ab561de583d709bc` | アリスと蔵六 | PASS | 1–3권 identity/내용과 수상 선정 provenance가 분리됨. |
| 18 | `work-39c1a2b6791238827ed5` | とろける鉄工所 | PASS | 공식 1–3권, 판본 lead, 심사 lead의 역할이 구분됨. |
| 19 | `work-3ad85a2ffdc026007d61` | 新しい上司はど天然 | PASS | 1권 내용 및 identity만 확인; 공식 2–3권 미확인은 명시적 제한으로 기록. |
| 20 | `work-44d0000353478596369e` | 環と周 | PASS | 단권 완결본 전체를 범위로 명시; 심사 코멘트는 독립 관찰 lead. |
| 21 | `work-53fb816835ab36e40a1f` | アンデッドアンラック | PASS | 공식 일반판 1–3권; 전투/사망 신호를 안전 lead로만 기록. |
| 22 | `work-62fbc6b2253b895e3a66` | 俺物語！！ | PASS | 공식 일반판 1–3권; 구조 장면을 안전 판정으로 확대하지 않음. |
| 23 | `work-634f34830600e07d8f17` | お茶にごす。 | PASS | 공식 전자 1–3권과 판본/장르 metadata lead를 분리. |
| 24 | `work-65f856a6fa2078f21d2f` | 黒月のイェルクナハト | PASS | 공식 일반판 1–3권; representative ISBN은 1권으로 고정. |
| 25 | `work-741deb03d9f59e723929` | ルックバック | PASS | 2·3권이 없는 one-shot의 단권 전체 범위를 명시. |
| 26 | `work-7c8931bc010e2f28f7ec` | 夢中さ、きみに。 | PASS | 연속 1–3권이 아닌 단권 단편집 범위를 명시. |
| 27 | `work-7d4568dcc8e9175d35ba` | 異世界おじさん | PASS | 공식 일반판 1–3권. |
| 28 | `work-7f0f63c5d80083f2be7f` | 思い、思われ、ふり、ふられ | PASS | 공식 일반판 1–3권. |
| 29 | `work-80a2f62ce5073ade2ec2` | 式の前日 | PASS | 2·3권이 없는 단편집의 단권 범위를 명시. |
| 30 | `work-8733067e6afcaeadbd8d` | さんすくみ | PASS | 공식 전자 1–3권; 장르 표기는 metadata lead로만 제한. |
| 31 | `work-925f371723beac5227f7` | 邪神の弁当屋さん | PASS | 공식 1–3권과 심사 코멘트; 심사 독서 범위 비균일성을 명시. |
| 32 | `work-961a49798df191311f42` | 働かないふたり | PASS | 공식 1–3권과 심사 코멘트; 심사 독서 범위 비균일성을 명시. |
| 33 | `work-9bd00739b995d84e2494` | あした死ぬには、 | PASS | 공식 에피소드와 1–3권 화수 매핑을 기록. |
| 34 | `work-a3d922576a1a1ecc8e3e` | ドカ食いダイスキ！ もちづきさん | PASS | 공식 1–3권과 심사 코멘트; 과식 표현은 안전/내용 lead로만 제한. |
| 35 | `work-aa85b65d02f367e76a07` | ディグイット | PASS | 공식 1–3권과 권리자 시리즈 공지. |
| 36 | `work-af3443bab1c30d470a76` | 坂本ですが? | PASS | 공식 1–3권과 심사 코멘트; 심사 범위 비균일성을 명시. |
| 37 | `work-bd5c323a3dbc9f3a04d4` | 来世は他人がいい | PASS | 공식 1–3권과 2권 전후 편집 기사의 제한된 보조 범위를 분리. |
| 38 | `work-c2df32661c0b925ff74f` | カラオケ行こ！ | PASS | 2·3권이 없는 단권; 영화/홍보 자료는 원작 단권 근거와 구분. |
| 39 | `work-c2f3864045578cebb590` | となりの猫と恋知らず | PASS | 공식 1–3권; 영상화 시즌 시놉시스는 원작 범위와 동일시하지 않음. |
| 40 | `work-c5c2695ad33fd05af945` | カッコウの許嫁 | PASS | 공식 1–3권; 애니메이션 1–3화 시놉시스는 원작 내용 근거에서 분리. |
| 41 | `work-c7280f9dcc2754d3f864` | 鵺の陰陽師 | PASS | 공식 1–3권과 선정 provenance 2건을 분리. |
| 42 | `work-d63a83030a8819ff553c` | モテキ | PASS | 공식 1–3권과 선정 provenance 2건을 분리. |
| 43 | `work-d8a87d01c1f35d58e791` | 八雲さんは餌づけがしたい。 | PASS | 공식 1–3권과 선정 provenance 2건; 미성년/연령차 신호는 후속 safety로 전달. |
| 44 | `work-e2f095e08fc5e08d5a2b` | 高嶺と花 | PASS | 공식 1–3권과 선정 provenance 2건; 연령차/권력 비대칭은 후속 safety로 전달. |
| 45 | `work-e81955a9fc5c4d84580f` | ここは今から倫理です。 | PASS | 공식 1–3권과 선정 provenance 2건; 정신건강 신호를 안전 검토 대상으로만 기록. |
| 46 | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | PASS | 단권 one-shot 전체 범위; 편집/선정 레코드는 내용 Factor 근거에서 분리. |
| 47 | `work-f8cb26831612e0c6ece5` | 極楽街 | PASS | 공식 1–3권과 선정 provenance 2건을 분리. |
| 48 | `work-fc53cb5669aa4099ee4a` | アオハライド | PASS | 공식 1–3권과 선정 provenance 2건; 따돌림/고립은 후속 safety 신호. |
| 49 | `work-fd2a957c501c36047ed0` | 青の祓魔師 | PASS | 공식 1–3권과 선정 provenance 2건; 폭력/사망 신호는 안전 검토로 한정. |
| 50 | `work-ff9b025f58d7e12f3cb1` | LOVE SO LIFE | PASS | 공식 1–3권과 선정 provenance 2건; 미성년 돌봄/복지 배경은 후속 safety 검토로 전달. |

## Handoff

All 50 research packets are structurally ready for the next identity/safety and annotation passes. This QA does not approve any Factor, Theme, Art, safety, recommendation eligibility, or promotion state. In particular, records marked `unknown`, limited-range, identity-only, or selection-only must retain those limits downstream.
