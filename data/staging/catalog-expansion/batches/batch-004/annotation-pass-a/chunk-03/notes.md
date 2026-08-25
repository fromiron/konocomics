# Batch 004 Pass A annotation notes — chunk 03

## Binding and review boundary

- pass: `annotation-pass-a`
- chunk: `03`
- scope: `entry_1_3_volumes`; one-shot and collection works retain their single-book scope
- annotator: Local Codex subagent
- reviewedByHuman: `false`
- candidateSha256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`
- manifest.json SHA-256: `6471599e70992b42b7be29380133be8275c6f187724eedd4a67c954d2ee3bdef`
- PAYLOAD.sha256 ledger SHA-256: `e3df630b24b826ce1a926129961a2cbd7d00f8e59fd0b34580a87f90da314178`
- frozen-work-set.csv SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- annotation-review-adjudication-request.md SHA-256: `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513`
- research/chunk-03.md SHA-256: `2df04cf22b36b484e91e2c0a213857751d2666b25aef9dac8d7cab8303148f14`
- factor-dictionary.md SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation-guide.md SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`

Pass A는 동결된 chunk-03의 공식 우선 Evidence만 사용했다. `genres.csv`와 `themes.csv`는 작품의 초반 범위에서 직접 확인되는 사전 항목만 기록했으며, 선정 목록·추천·수상·identity/safety 결과는 Factor 근거로 사용하지 않았다. Factor 행은 이 Pass에서 독립적으로 판정했으며 다른 작품의 Factor·Theme 벡터를 복사하지 않았다.

공식 내부 미리보기 audit는 열 작품 모두 `readableInternalPages=0`, `distinctSceneContexts=0`, SHA-256 `not-generated`이다. 따라서 `artRealism`, `artDensity`, `visualSoftness`, `motionImpact`는 모두 명시적 `unknown`이다. 표지, 줄거리, 안전 lead, 작가 인상으로 Art 값을 추정하지 않았고 `motionImpact=notApplicable`도 사용하지 않았다.

## work-53fb816835ab36e40a1f — アンデッドアンラック

- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882310-2
  - 1권 claim bound: 불운 때문에 고립된 風子가 Andy를 만나고, 접촉이 그를 끝낼 수 있다는 조건으로 동행을 시작한다.
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882330-0
  - 2권 claim bound: 두 주인공이 추적 조직에 들어가 10명의 Negator 자리를 얻기 위해 적을 쓰러뜨리려 한다.
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882404-8
  - 3권 claim bound: Andy 안의 Victor가 드러나고 조직원이 모이며, 風子가 Unluck을 사용해 Andy를 되돌리려는 대결이 이어진다.
- Known text: `pacing=2`는 만남·조직 가입·구출 목표/대결로 초반 권별 목표와 상태가 바뀌는 근거에 한정했다. `worldBuilding=2`는 능력 조건과 Negator 조직/10자리 규칙이 1~~3권 사건에 기능적으로 반복되는 범위다. `relationshipStructure=2`는 2~~3권의 두 주인공과 조직 동료가 고정 핵심군으로 확장되는 범위다. `combat` Theme centrality `2`는 2~3권의 적 격파와 격렬한 대결이 공동 목표의 반복 구조인 데 근거한다.
- Unknown: 성장·숙련 보상, 분석적 해결, 장기 전략, 단서형 미스터리, comedy·darkness·mentalStress·romance·warmth는 상품 개요만으로 반복량/체감을 확정하지 않았다. 사망·부상·능력 표현은 safety lead로만 남겼다.
- Genre: `action;fantasy`는 1~3권에 직접 제시된 능력 기반 대결과 비현실적 Negator 설정에 한정한다.
- Art: 공식 내부 페이지 0쪽/0맥락, known Art 없음.

## work-62fbc6b2253b895e3a66 — 俺物語！！

- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-846756-6
  - 1권 claim bound: 剛田猛男가 전철에서 大和凛子를 구한 뒤 砂川誠을 포함한 관계가 시작된다.
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846817846756315501
  - 2권 claim bound: 猛男와 凛子가 사귀는 가운데 친구 모임과 돌발 사건에 함께 대응한다.
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-846896-9
  - 3권 claim bound: 커플의 소풍과 고립, 귀가를 둘러싼 첫날 밤의 긴장과 설렘이 다뤄진다.
- Known text: `pacing=2`는 만남→교제→데이트 중 위기라는 초반 관계 상태 변화에 한정했다. `characterArcWeight=2`는 인물 관계가 매권 중심에 있으나 사건/상황과 균형인 범위다. `relationshipStructure=2`는 猛男·凛子·砂川의 반복 핵심 관계다. `romance=4`는 1권의 관계 시작, 2권의 교제, 3권의 커플 친밀감이 전개 중심이라는 직접 근거다.
- Unknown: 구조 장면을 문제 해결 축으로, 친구 수를 군상극 4로, 성적 괴롭힘·힘의 대응을 darkness/mentalStress로 확장하지 않았다. comedy는 공식 장르 표기만으로 빈도 축을 확정하지 않았다.
- Genre: `comedy;romance`는 3권 공식 소개의 작품 장르 표기와 1~3권의 연애 전개에 한정한다.
- Art: 공식 내부 페이지 0쪽/0맥락, known Art 없음.

## work-634f34830600e07d8f17 — お茶にごす。

- sourceUrl: https://e-comi.shogakukan.co.jp/books/091211680000d0000000
  - 전자 1권 claim bound: 폭력에서 벗어나 평온해지려는 불량 학생이 다도부에 들어간다.
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091212160000d0000000
  - 전자 2권 claim bound: 차 마시는 법·미닫이문·정좌를 익히고 부장과 보내는 시간이 늘며 폭력 없는 생활이 이어진다.
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091212900000d0000000
  - 전자 3권 claim bound: 라이벌 樫沢가 등장하고 다도부장 姉崎를 둘러싼 충돌 가능성이 제시된다.
- Known text: `pacing=2`는 입부·기술 습득·라이벌 등장으로 초반 권별 상태가 바뀌는 범위다. `characterArcWeight=4`는 폭력에서 벗어나 친절해지려는 목표와 감정 변화가 1~~3권 소개의 중심 동력인 데 근거한다. `relationshipStructure=2`는 다도부장·동료·라이벌이 반복 핵심군으로 확장되는 범위다. `romance=2`는 3권의 부장에 대한 동경과 라이벌 충돌이 연애 서브 플롯으로 나타나는 범위다. `school` Theme centrality `2`는 고교 다도부 가입·다도 활동·부원 관계가 1~~3권의 반복 무대인 데 근거한다.
- Unknown: 공식 `ギャグ` metadata는 Genre에만 사용하고 comedy Axis로 변환하지 않았다. 폭력 전제와 ‘폭력 없는’ 홍보 표현만으로 darkness/mentalStress를 수치화하지 않았다. 전자판과 frozen 종이 대표판의 내부 페이지 동일성은 이전하지 않았다.
- Genre: `comedy;sliceOfLife`는 공식 페이지의 `ギャグ` 표기와 다도부 일상/동아리 사건의 직접 범위에 한정한다.
- Art: 전자 상품 페이지 0쪽/0맥락, known Art 없음.

## work-65f856a6fa2078f21d2f — 黒月のイェルクナハト

- sourceUrl: https://www.kodansha.co.jp/comic/products/0000415577
  - 1권 claim bound: 18세 戌亦しのぎ가 인간이 아닌 Yerkunacht를 만나 결혼 또는 죽음의 선택을 요구받고 전투 로맨스가 시작된다.
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000419091
  - 2권 claim bound: Noa를 쓰러뜨린 뒤 힘의 부족을 깨닫고 Noa와 실전 훈련을 시작한다.
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000424213
  - 3권 claim bound: Yerkunacht·Noa·Brigid와의 공동생활, 납치, 구출 전투와 가사 루틴이 이어진다.
- Known text: `pacing=2`는 만남/선택→훈련→납치·구출로 초반 권별 목표와 상태가 바뀌는 범위다. `characterArcWeight=2`는 힘의 한계 인식과 관계가 사건과 함께 나타나는 균형에 한정했다. `relationshipStructure=2`는 3권에 반복 동거 집단이 형성되는 고정 핵심군에 근거한다. `romance=4`는 1권의 결혼/죽음 선택과 공식 ‘전투 로맨스’ 전제가 도입의 중심이라는 직접 근거다. `combat` Theme centrality `2`는 1권의 전투 전제, 2권 승패/훈련, 3권 구출 전투에 한정한다.
- Unknown: 판촉 개요만으로 전투·관계·공동생활의 비중, 동의 맥락, 지속적 darkness/mentalStress/warmth, 전략·세계관 규칙을 확정하지 않았다. 결혼/죽음 선택, 피투성이 전투, 목욕·봉사 표현은 safety lead로만 남겼다.
- Genre: `action;fantasy;romance`는 공식 1권의 신화적 전투 로맨스 전제와 1~3권의 비현실적 적대/전투 범위에 한정한다.
- Art: 공식 내부 페이지 0쪽/0맥락, known Art 없음.

## work-741deb03d9f59e723929 — ルックバック

- sourceUrl: https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000016342800
  - one-shot claim bound: 藤野와 방에 틀어박힌 京本이 만화 그리기로 연결되고, 시간이 흐르며 한 사람이 다른 사람을 뒤에서 지지한다.
- Known text: `characterArcWeight=4`는 두 창작자의 연결과 상호 지지가 단편의 핵심 보상으로 직접 제시된 범위다. `relationshipStructure=1`은 복잡한 군상이나 고정 파티가 아닌 중심 두 사람 관계에 한정했다. `emotionalWarmth=2`는 한 사람이 다른 사람을 지지한다는 관계 보상이 있으나 단일 줄거리만으로 전반적 따뜻함을 4로 올리지 않은 판정이다.
- Unknown: 단편의 시간 경과만으로 pacing/progression을, 만화 제작만으로 crafting·workplace를, 공식 개요의 압축된 관계만으로 romance·darkness·mentalStress를 확정하지 않았다. 공식 개요에 없는 비극과 안전 내용을 추정하지 않았다.
- Genre: `sliceOfLife`는 두 창작자의 일상적 관계와 만화 제작을 직접 설명한 단편 범위에 한정한다.
- Theme: dictionary Theme 중 작품 전체를 대표할 반복 중심 구조를 직접 확인할 수 없어 비워 두었다.
- Art: 공식 단편 페이지 0쪽/0맥락, known Art 없음.

## work-7c8931bc010e2f28f7ec — 夢中さ、きみに。

- sourceUrl: https://www.kadokawa.co.jp/product/321904000716/
  - collection claim bound: 1~3권 연속물이 아닌 168쪽 단권 단편집이며 웹 공개 단편을 묶었다.
- sourceUrl: https://group.kadokawa.co.jp/documents/topics/20200428_k43ef.pdf
  - press claim bound: 8개 단편과 二階堂 관련 4편, 고교생 남자들의 학교 일상, 자연스러운 태도와 엉뚱한 유머를 설명한다.
- Known text: `comedy=2`는 보도자료가 여러 단편의 ‘엉뚱한 유머’를 반복적으로 직접 설명하는 중간 수준에 한정했다. `school` Theme centrality `2`는 8개 단편 전반의 고교생 학교 일상이라는 편집 범위에 근거한다.
- Unknown: 단권 컬렉션의 이질적인 단편을 하나의 progression/pacing/relationship 구조로 합치지 않았다. romance·warmth·darkness·mentalStress와 문제 해결/미스터리는 보도자료만으로 확정하지 않았다.
- Genre: `comedy;sliceOfLife`는 공식 보도자료의 유머와 고교생 일상 단편집이라는 직접 범위에 한정한다.
- Art: 상품/보도 페이지 0쪽/0맥락, known Art 없음.

## work-7d4568dcc8e9175d35ba — 異世界おじさん

- sourceUrl: https://www.kadokawa.co.jp/product/321808000769/
  - 1권 claim bound: 17년 혼수상태에서 깨어난 삼촌이 조카 高文과 살며 이세계 경험을 들려주는 문화 간 코미디의 도입이다.
- sourceUrl: https://www.kadokawa.co.jp/product/321901000234/
  - 2권 claim bound: 삼촌이 YouTube로 돈을 벌고 高文·藤宮가 함께 등장하며 정기 등장인물과 황당한 상황이 늘어난다.
- sourceUrl: https://www.kadokawa.co.jp/product/321906000326/
  - 3권 claim bound: 삼촌이 이세계에 간 첫날을 회상하고 충격적 사실과 이세계 여성 인물 이야기가 드러난다.
- Known text: `pacing=2`는 귀환 후 동거→온라인 활동/고정 출연 확장→이세계 첫날 회상으로 초반 권별 반복 단위가 바뀌는 범위다. `worldBuilding=2`는 현재 생활과 이세계 경험/문화 차이가 1~3권의 기능적 배경으로 반복되는 범위다. `relationshipStructure=2`는 삼촌·조카·藤宮의 반복 핵심군 확장에 근거한다. `comedy=2`는 1권의 공식 문화 간 코미디 전제와 2권의 황당한 상황 반복에 한정했다. `romance=2`는 2권에서 藤宮의 호감이 명시되는 서브 플롯에 한정한다.
- Unknown: YouTube를 progression/workplace로, 3권의 ‘충격적 사실’을 mysteryReveal로, 혼수/이세계 위험을 darkness/mentalStress로 확장하지 않았다. 이세계 경험의 세부 장면과 전략은 상품 개요만으로 확정하지 않았다.
- Genre: `fantasy;comedy;sliceOfLife`는 이세계 경험, 공식 코미디 전제, 삼촌·조카의 현재 동거 일상에 한정한다.
- Art: 공식 내부 페이지 0쪽/0맥락, known Art 없음.

## work-7f0f63c5d80083f2be7f — 思い、思われ、ふり、ふられ

- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-845467-2
  - 1권 claim bound: 由奈와 朱里가 친구가 되고 理央·和臣이 더해져 네 사람의 청춘과 본심을 부딪치는 연애가 시작된다.
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845528845467315501&rf=hr
  - 2권 claim bound: 由奈의 理央에 대한 감정, 理央의 비밀, 그 변화가 朱里의 행동에 파급된다.
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-845596-9&mode=1
  - 3권 claim bound: 朱里·和臣·理央·由奈의 서로 얽힌 감정과 괴로움이 이어진다.
- Known text: `pacing=2`는 네 사람의 감정 방향과 행동이 권별로 변화하는 일반적인 Arc 단위 변화에 한정했다. `characterArcWeight=4`는 감정·동기 변화가 사건의 핵심 보상이다. `relationshipStructure=4`는 네 중심 인물의 상호 감정 방향과 파급이 복잡한 관계망 자체를 반복 보상으로 만든다는 직접 근거다. `mentalStress=2`는 2~~3권의 비밀·복잡한 감정·괴로움이 있으나 지속적 붕괴를 입증하지 않는 혼합 수준이다. `romance=4`는 네 사람의 연애와 본심이 1~~3권 전개 중심이다. `emotionalWarmth=2`는 친구 관계와 감정적 연결이 있으나 상호 짝사랑의 부담도 함께 제시되는 혼합 수준이다.
- Unknown: 학교 Theme는 source summaries가 반복 학교 무대를 직접 확정하지 않아 비워 두었고, progression·strategy·mysteryReveal·darkness는 감정 비밀/괴로움만으로 확정하지 않았다.
- Genre: `sliceOfLife;romance`는 네 청춘 인물의 일상 관계와 공식적인 연애 전개 범위에 한정한다.
- Art: 공식 내부 페이지 0쪽/0맥락, known Art 없음.

## work-80a2f62ce5073ade2ec2 — 式の前日

- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091345850000d0000000
  - collection claim bound: 2·3권이 없는 단편집이며 쌍둥이, 부모·자녀, 결혼을 앞둔 남녀 등 두 사람의 순간을 따뜻하고 선명하게 다룬다.
- Unknown: 단일 편집 개요만으로 각 단편의 emotionalWarmth, characterArcWeight, relationshipStructure, romance 중심성, pacing, progression, problemSolving, mysteryReveal, darkness, mentalStress를 합산하지 않았다. 공식 ‘따뜻한’ 수식어도 정서 강도 축으로 확정하지 않았고, 결혼 소재가 있다는 사실만으로 romance를 확정하지 않았다.
- Genre: `sliceOfLife`는 가족·결혼 전후의 두 사람 순간을 다루는 단편집 범위에 한정한다.
- Theme: dictionary Theme 중 반복 중심 구조를 직접 확인할 수 없어 비워 두었다.
- Art: 공식 전자 페이지 0쪽/0맥락이며 frozen 종이 대표판으로 시각 근거를 이전하지 않았다.

## work-8733067e6afcaeadbd8d — さんすくみ

- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091334600000d0000000
  - 전자 1권 claim bound: 신사·사찰·교회 후계자 세 명이 종교법인의 일상, 후계 압박, 실패할 수 없는 의식을 겪는다.
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091338140000d0000000
  - 전자 2권 claim bound: 세 후계자의 우정·업무를 중심으로 雅楽·お祓い, 사슴, 성격 차이에서 생기는 곤란이 제시된다.
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091341120000d0000000
  - 전자 3권 claim bound: 지진제, 지옥 시주 순회, 교회 연수라는 세 직업별 사건이 이어진다.
- Known text: `pacing=2`는 권별로 종교 업무/의식 사건과 장소가 바뀌는 일반적인 Arc 단위 변화다. `worldBuilding=2`는 신사·사찰·교회의 업무와 의식 규칙이 1~~3권 사건에 기능적으로 반복된다. `characterArcWeight=2`는 세 사람의 성격 차이와 우정이 업무 사건과 함께 작동하는 균형이다. `relationshipStructure=2`는 세 후계자 친구 집단이 1~~3권에 반복된다. `romance=2`는 2권의 ‘연애는 적다’는 직접 서술과 3권의 만남이 확인하는 서브 플롯이다. `workplace` Theme centrality `2`는 종교법인의 일과 후계 업무가 1~3권의 반복 핵심 구조인 데 근거한다.
- Unknown: 공식 `comedy` metadata와 코미디 생활 표현은 Genre에만 사용하고 comedy Axis의 빈도/체감으로 확정하지 않았다. 의식 곤란을 problemSolving으로, 세 사람의 우정을 emotionalWarmth로, 후계 압박과 의식 실패를 darkness/mentalStress로 확장하지 않았다.
- Genre: `comedy;sliceOfLife`는 공식 코미디 표기와 종교법인 일상 업무 사건의 직접 범위에 한정한다.
- Art: 전자 상품 페이지 0쪽/0맥락이며 frozen 종이 대표판으로 시각 근거를 이전하지 않았다.

## Closure

- Factor matrix: 10 works × 17 dictionary-order axes = 170 rows; all Art axes are explicit `unknown`.
- `reviewedByHuman=false` is preserved. This Pass A output assigns no catalog role, recommendation context, eligibility, promotion, or human-validation result.
