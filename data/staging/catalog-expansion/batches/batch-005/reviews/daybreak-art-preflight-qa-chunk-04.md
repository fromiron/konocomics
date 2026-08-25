# Batch 005 Art preflight 독립 QA — chunk 04

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions `31–40`
- overallVerdict: `FAIL`
- work-level results: `PASS 3 / FAIL 7`
- Art values assigned: `none`

## 독립 검증 결과

- 현재 root는 manifest와 같은 `main@a423c20add1162b7cdf71342a721ffcd7191d3c2`다. `pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`가 통과했고 candidate `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`가 독립 재산출됐다.
- manifest SHA-256 `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`, `PAYLOAD.sha256` SHA-256 `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`, frozen-work-set SHA-256 `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`, research chunk 04 SHA-256 `46e6b37d07f4b2baee839dca05331e9c870a6d158c392e3d77ad77419a5b76a3`가 manifest/PAYLOAD 선언값과 일치한다.
- 현재 `preflight.csv` SHA-256은 `b382ec3c49f70748c1222e8b6ccfc14a1e57550c0aff98b61a82ce9e5b88f5cd`, `ledger.md` SHA-256은 `334d3af5716e754a1be4cfb3e525ffd7c9a136c6d58e21366065b8d765aaf8e7`다. CSV는 정확히 17열·10행이고 frozen positions 31–40과 순서·`workId`·canonical title이 일치하며 `『`·`』`를 title에 포함하지 않는다.
- `/tmp/konocomics-batch005-art-chunk04`의 retained 42개 파일을 원본 픽셀로 모두 열어 판독했고 SHA-256을 다시 계산했다. CSV의 두 hash 열과 `42/42` 일치하며 중복 hash는 없다. 다만 hash 정합은 본문 적격성을 보장하지 않는다. retained set에는 순수 title/chapter splash 3개와 contents 1개가 섞여 있다.
- 31·37번은 exact vol.1 공식 reader, 판독 가능한 본문 6쪽 이상, 서로 다른 장면 2개 이상을 충족하며 bounded motion sequence가 없다. 38번은 少年画報社 vol.1 공식 상품과 frozen ISBN을 결속한 뒤 등록 route에 internal preview가 없음을 확인한 `0/0 unknown-ready`가 정확하다.
- 32·34·40번은 exact 공식 reader와 판본 결속 자체는 맞지만 선택 6쪽 중 한 쪽씩이 제외 대상인 title/chapter splash다. 동일 공식 reader에서 이미 확보한 genuine body page로 교체 가능하므로 현재 행만 실패하며 장기 pending이나 blocker 사유는 아니다.
- 33번은 `reader-page-06`이 목차다. `reader-page-07`–`12`는 모두 하나의 병원 앞/주택가 샤케 사건 장면이어서 6쪽으로 늘려도 두 번째 genuinely distinct context가 생기지 않는다.
- 35번의 refs 002–007은 모두 같은 오락실 대면 장면이어서 context `3`이 아니라 `1`이다. 반면 동일 공식 first-episode asset `10.jpg`에는 플레이 시작/접근, 주먹 타격 impact, 코피가 난 aftermath라는 하나의 연속되고 해결된 sequence가 한 페이지에 고정돼 있어 `motionGateAttemptable=false`도 사실과 다르다.
- 36번의 `0/0 unknown-ready`는 finite route exhaustion이 아니다. route registry가 명시적으로 허용한 exact JDCN URL `https://e-comi.shogakukan.co.jp/books/091884940000d0000000`이 `ＷＯＭＢＳ １`과 같은 JDCN을 표시하고 공식 `試し読み` viewer `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091884940000d0000000`을 노출한다.
- 39번은 竹書房 route가 registry에 없으므로 현재 승인 route 집합 안에서 `0/0 unknown-ready`로 닫는 상태 자체는 보수적이다. 그러나 “authorized internal preview exists하지 않는다”는 전역 부재 주장은 조사 범위를 넘는다. 확인된 사실은 “현재 registry에 승인된 竹書房 route가 없어 sampling하지 않았다”뿐이다.

## 작품별 판정

| Pos | workId | 작품 | 선언 → 원본 재계산 | State | QA | 근거 |
| --: | --- | --- | --- | --- | --- | --- |
| 31 | `work-79c18b26dfde8a532f73` | デストロ２４６ | `6/2 → 6/2`, motion `false` | sample-ready | **PASS** | 小学館 ISBN `9784091573254` vol.1과 exact tameshiyo bridge가 맞다. refs 05–08, 10–11은 전부 body이며 violent mansion/interior와 restaurant/group conversation이라는 두 장면을 보존한다. gun 준비·aftermath만 있고 하나의 exact start→development→impact→resolved sequence는 없다. |
| 32 | `work-7b6eb2b48ac06ffa26eb` | 夢の雫、黄金の鳥籠 | `6/3 → 5/2`, motion `false` | sample-ready | **FAIL** | 小学館 ISBN `9784091340108` vol.1 bridge와 6개 hash는 맞지만 `reader-trg-03`은 작품명·권·작가가 전면에 놓인 순수 title splash다. 남는 refs 04–08은 genuine body 5쪽뿐이고 선언한 palace/interior context도 없다. 같은 reader의 `reader-trg-09`는 genuine bedroom/attack body page라 교체하면 `6/2`를 충족한다. |
| 33 | `work-8037856e7703fdaf4324` | 日常 | `6/3 → 5/1`, motion `false` | sample-ready | **FAIL** | KADOKAWA product `200879000105`, frozen ISBN `9784047139497`, linked BOOK☆WALKER trial bridge는 맞다. `reader-page-06`은 화 목록과 page number가 적힌 contents라 제외해야 한다. refs 07–11은 병원 앞/주택가의 같은 샤케 사건 한 장면이며 classroom·home은 없다. body `reader-page-12`를 추가해도 `6/1`이라 static minimum을 회복하지 못한다. |
| 34 | `work-88cb26a0229ad7b83263` | ひらやすみ | `6/3 → 5/3`, motion `false` | sample-ready | **FAIL** | 小学館 ISBN `9784098611188` vol.1 exact bridge는 맞지만 `reader-trg-07`은 `1日目／ヒロトとなつみ`가 놓인 chapter-title splash다. refs 05·06·08–10은 genuine body 5쪽이다. 같은 reader의 `reader-trg-11`은 shop/neighbor conversation body page라 교체하면 `6/3` static sample을 복구한다. |
| 35 | `work-8a7846af8ead1797e6a2` | ハイスコアガール | `6/3 → 6/1`, motion `false → true` | sample-ready | **FAIL** | Square Enix 공식 series page가 title·押切蓮介·ISBN `9784757535121` 1巻과 第1話 trial을 결속한다. refs 002–007은 모두 같은 오락실 대면이므로 classroom을 포함한 3맥락 주장은 틀리고 static gate는 실패한다. 그러나 official `10.jpg`에는 플레이/접근 → 얼굴 타격 impact → 코피가 난 aftermath가 연속 패널로 고정돼 motion gate는 true다. |
| 36 | `work-8ff141505b0a27f8d630` | WOMBS | `0/0` 선언은 route 미소진 | unknown-ready | **FAIL** | ISBN `9784091884947`·JDCN `091884940000d0000000` identity는 맞다. 같은 JDCN의 registry-approved 小学館eコミックストア book page가 official viewer를 직접 노출하므로 “product only/no preview” 종결은 재현되지 않는다. viewer를 실제 sampling한 뒤에만 page/context gate 또는 bounded unknown을 결정할 수 있다. |
| 37 | `work-982bb79e03193ebbafcd` | ママはテンパリスト | `6/3 → 6/3`, motion `false` | sample-ready | **PASS** | 集英社 ISBN `9784087821888` vol.1 reader bridge가 맞고 refs 07–11·13은 모두 genuine body다. pregnancy/domestic work, hospital birth, postnatal family/street의 서로 다른 맥락을 보존하며 complete bounded action sequence는 없다. |
| 38 | `work-9e98119539f60465ce66` | 僕らはみんな河合荘 | `0/0 → 0/0`, motion `false` | unknown-ready | **PASS** | 少年画報社 product `6776`이 vol.1·宮原るり·frozen ISBN `9784785936310`을 결속한다. vol.1과 확인한 vol.3 공식 상품 모두 registered internal preview를 노출하지 않아 승인 route를 generic reader로 대체하지 않은 `0/0` 종결이 재현된다. Art unknown은 blocker가 아니다. |
| 39 | `work-aa6018249b7fe7e92d95` | かよちゃんの荷物 | `0/0 → 0/0`, 문구 과대 주장 | unknown-ready | **FAIL** | official マンガ大賞 jury PDF는 identity/provenance만 제공하고 Art pixel은 제공하지 않는다. 竹書房은 현재 route registry에 없어 approved sampling을 하지 않은 상태 자체는 맞지만, 그 사실로 authorized preview의 전역 부재를 확정할 수는 없다. limitation과 ledger를 registry-bounded statement로 좁혀야 한다. |
| 40 | `work-ab9331f7fed1990f7dc6` | 脳内ポイズンベリー | `6/3 → 5/2`, motion `false` | sample-ready | **FAIL** | 集英社 JDCN `08865626865626315501`과 paper ISBN `9784088656267` vol.1 bridge는 맞지만 `reader-page-05`는 작품명과 `第1話`가 전면에 놓인 chapter/title splash다. refs 06–10은 body 5쪽이고 real-world station과 brain meeting의 두 맥락이다. 같은 reader의 `reader-page-11`은 genuine body라 교체하면 `6/2`를 충족한다. |

## 정확한 교정 지시

1. Position 32: `reader-trg-03`과 hash `d1a8e580...`를 제거하고 동일 reader의 `reader-trg-09`를 추가한다. 현재 임시 파일의 독립 hash는 `5ca088f603d370bf82f6823e18c61f8f3a00934910f2bc0055f247097f516fcd`다. page/context는 `6/2`, static `true`, motion `false`, state `sample-ready`로 기록하고 contexts를 village/landscape·bedroom/attack으로 한정한다.
2. Position 33: `reader-page-06`과 hash `dc7a20b7...`를 제거한다. `reader-page-12` (`d33d2f91bb79dbee2a4734f75db46ccc9ad7f6800f02952c1854839ffd3ccc28`)은 body page지만 같은 장면이므로 context minimum을 해결하지 못한다. exact official viewer에서 genuinely distinct later scene을 추가로 고정하지 못하면 `5/1`, static `false`, state `unknown-ready`, 네 Art 축 terminal unknown으로 닫는다.
3. Position 34: `reader-trg-07`과 hash `ecf4f39e...`를 제거하고 동일 reader의 `reader-trg-11` (`ee948b0b925da7dabea896680091ab84ab5bd0502ccdbded2c073b739ac9cd86`)로 교체한다. `6/3`, static `true`, motion `false`, `sample-ready`를 유지한다.
4. Position 35: current six refs는 genuine body지만 context를 `3→1`, static을 `true→false`로 고친다. official `reader-page-010`을 capture/hash해 refs에 추가하고 raw official asset hash `a4dafabef698ded2500aaea28819fc2827010e6e4d5459c4fec0de48e0f7dc4a`와 함께 exact panel sequence를 보존한 뒤 motion을 `false→true`로 고친다. state는 static에 대해 `unknown-ready`로 닫되 downstream review가 explicit `motionGateAttemptable=true`를 무시해 U/U/U/U로 일괄 처리하지 않도록 motion-only 판정 경계를 적는다.
5. Position 36: registry-approved `https://e-comi.shogakukan.co.jp/books/091884940000d0000000` → `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091884940000d0000000`을 따라 exact vol.1 body를 sampling한다. cover/title/contents/ads를 제외해 실제 counts·contexts·hashes를 만든 다음에만 `sample-ready` 또는 bounded `unknown-ready`를 결정한다.
6. Position 39: state/count는 유지하되 limitation과 ledger의 “no authorized internal preview exists”를 삭제한다. “竹書房 is absent from the current approved route registry; no edition-bound internal preview was sampled, so Art closes unknown-ready within that finite registry”로 좁힌다.
7. Position 40: `reader-page-05`와 hash `da2a9f29...`를 제거하고 동일 reader의 `reader-page-11` (`52b97c9e551621d2dee1ef034f30a1976e9f0ad6b9f7658f42b57d6c7c1c98f1`)로 교체한다. page/context는 `6/2`, static `true`, motion `false`, state `sample-ready`로 고친다.
8. 위 변경 뒤 canonical preflight/ledger와 review bundle 사본이 존재하면 모두 같은 bytes로 맞추고 output/input ledger의 counts, motion summary, output SHA-256을 다시 계산한다. candidate·manifest·PAYLOAD·frozen-work-set identity는 바꾸지 않는다.

## 종합 판정

**FAIL.** candidate/frozen root, 17열·10행 schema, canonical titles, 42/42 retained-file hashes와 positions 31·37·38의 gate는 재현됐다. 그러나 positions 32·33·34·40의 non-body 포함, position 35의 context·motion 오판, position 36의 승인 route 미소진, position 39의 범위를 넘은 부재 주장이 남아 있어 현재 chunk 04를 downstream Art review 입력으로 승인할 수 없다. 이 QA는 Art 값을 부여하지 않았고 `reviewedByHuman=false`를 유지한다. preflight·terminal·promotion·source·commit은 변경하지 않았다.
