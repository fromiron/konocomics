# Batch 005 Art preflight 독립 재-QA — chunk 02

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent post-correction QA
- reviewedByHuman: `false`
- scope: frozen positions `11–20`
- overallVerdict: `PASS`
- work-level results: `PASS 10 / FAIL 0`
- Art values assigned: `none`

## 교정 후 독립 검증

- 현재 root는 manifest와 같은 `main@a423c20add1162b7cdf71342a721ffcd7191d3c2`다. `pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`가 통과했고 candidate `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`가 독립 재산출됐다.
- manifest SHA-256 `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`, `PAYLOAD.sha256` SHA-256 `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`, frozen-work-set SHA-256 `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`와 세 정책 SHA-256이 manifest/ledger 선언값에 일치한다.
- 현재 preflight SHA-256은 `6b629ffda6d0335fad773b630b5fb2769462e93b93ca653f936ba19f965fbcf7`, ledger SHA-256은 `50ad286e0987be958a401f3731c6c4028dba5c9e8afdbf3a77ea781e2b8261f1`다. ledger의 `preflightCsvSha256`도 현재 CSV와 일치한다.
- preflight는 정확히 17열·10행이며 frozen positions 11–20과 순서·`workId`·canonical title이 모두 일치한다. canonical title에 장식용 `『`·`』`가 없다.
- 현재 CSV에는 접근 가능 6작품마다 5개, 합계 30개의 고유 `pageRef=SHA-256` pair가 있다. `/tmp/konocomics-batch005-art-chunk02`의 대응 PNG에서 전부 다시 계산해 `30/30` 일치했고, 30개를 모두 원본 `1850x1937` 픽셀로 다시 열어 직접 검사했다.
- retained 30개는 모두 판독 가능한 내부 서사 본문이다. 표지·목차·광고·순수 chapter/title splash가 retained 표본에 없으며, 각 ref는 현재 작품·공식 reader·초반 판본에 계속 결속된다.
- 이전 QA가 식별한 non-body 6개 pair는 CSV의 `pageRefs`와 `temporarySampleSha256`에서 모두 제거됐다. ledger에는 audit trace로만 남고 선택 표본 수에 포함되지 않는다.
- 접근 가능 6작품의 교정된 page/context 카운트는 각각 `5/3`, `5/2`, `5/3`, `5/3`, `5/2`, `5/3`이며 원본 픽셀과 일치한다. route 제한 4작품은 `0/0`이다.
- 10행 모두 `staticGateAttemptable=false`, `motionGateAttemptable=false`, `stateEligibility=unknown-ready`다. 5페이지 또는 0페이지는 6페이지 static 최소선에 미달하므로 이 종결이 정확하다.
- retained 표본에는 하나의 연속 동작에 대한 start·development/impact·resolved endpoint가 exact refs로 모두 고정된 사례가 없다. 고립된 이동·열차 출발·행동 장면만으로 motion gate를 열지 않은 것이 정확하다.
- 모든 limitation은 실제 제외 ref 또는 route 실패, 남은 page/context 수, 6페이지 미달에 따른 nonblocking `unknown-ready`, motion 미개방을 구체적으로 기록한다. Art 값·confidence·promotion blocker는 추가하지 않았다.

## 작품별 판정

| Pos | workId | 작품 | Pages / contexts | State | 재-QA | 근거 |
| --: | --- | --- | ---: | --- | --- | --- |
| 11 | `work-151b456508f78852b002` | ヨルムンガンド | 5 / 3 | unknown-ready | **PASS** | 小学館 vol.1 ISBN `9784091570697`과 official tameshiyo `4091570690`의 제목·高橋慶太郎·권 결속이 유지된다. refs 06–10은 interior introduction, group/action, vehicle/official 맥락의 본문이다. 목차/opening인 ref 05를 제외한 5페이지와 limitation이 정확하다. |
| 12 | `work-1550d4a52c3fe6d9f94c` | ボクラノキセキ | 0 / 0 | unknown-ready | **PASS** | 一迅社 공식 vol.1 상품은 frozen ISBN `9784758053945`와 일치하지만 registry에 trusted preview route가 없다. generic reader를 대체하지 않은 0/0 종결과 limitation이 정확하다. |
| 13 | `work-15d6508605fbd4a266fc` | おまかせ精霊 | 0 / 0 | unknown-ready | **PASS** | KADOKAWA product `201216022042`가 青本もあ·vol.1 ISBN `9784840116626`과 일치한다. `pre_trial_reading_flg=0`, 빈 `bw_url`로 product-linked preview가 없다는 0/0 limitation이 정확하다. |
| 14 | `work-18e08fe95968a6537773` | ニラメッコ | 0 / 0 | unknown-ready | **PASS** | 白泉社 공식 vol.1 상품은 久世岳·ISBN `9784592166610`에 결속되지만 白泉社 trusted route가 registry에 없다. unregistered preview를 쓰지 않은 0/0 종결이 정확하다. |
| 15 | `work-19b578d0e828242f14f3` | 恋愛ラボ | 0 / 0 | unknown-ready | **PASS** | 芳文社 공식 series page는 1–3권과 작품을 확인하지만 frozen ISBN-bound internal preview가 없고 trusted route도 registry에 없다. 0/0 종결과 limitation이 정확하다. |
| 16 | `work-1b3afe12c434a9cf7603` | 銀のスプーン | 5 / 2 | unknown-ready | **PASS** | 講談社 product `0000044784`과 trial이 小沢真理·vol.1 ISBN `9784063760231`에 결속된다. retained refs 06–10은 domestic meal/family와 hospital의 2맥락 본문이다. `Recipe 1` splash ref 03이 제거됐고 5/2·static false limitation이 정확하다. |
| 17 | `work-1b7c4ed54d7761cd242b` | おかめ日和 | 5 / 3 | unknown-ready | **PASS** | 講談社 product `0000043658`과 trial이 入江喜和·vol.1 ISBN `9784063722802`에 결속된다. refs 04와 06–09는 bedroom/waking, neighborhood exterior, domestic/family의 3맥락 본문이다. title splash ref 05 제거와 5/3 limitation이 정확하다. |
| 18 | `work-1bce95b6c02673e59bcf` | 新黒沢 最強伝説 | 5 / 3 | unknown-ready | **PASS** | Big Comic Bros vol.1 ISBN `9784091856883`과 exact tameshiyo reader의 제목·福本伸行·권 결속이 유지된다. refs 06–10은 hospital/night, fireworks, outdoor/social의 3맥락 본문이다. 목차/opening ref 05 제거와 5/3 limitation이 정확하다. |
| 19 | `work-1d5a3158e78e639f1973` | カレチ | 5 / 2 | unknown-ready | **PASS** | 講談社 product `0000013990`과 trial이 池田邦彦·vol.1 ISBN `9784063728644`에 결속된다. refs 05–09는 station/platform과 train interior의 2맥락 본문이다. title splash ref 04 제거와 5/2 limitation이 정확하다. |
| 20 | `work-1e9c4852863a22bba058` | GREEN WORLDZ | 5 / 3 | unknown-ready | **PASS** | 講談社 product `0000019152`와 trial이 大沢祐輔·vol.1 ISBN `9784063950717`에 결속된다. refs 04와 06–09는 city/news, transit/home-call, school/park의 3맥락 본문이다. title opening ref 05 제거와 5/3 limitation이 정확하다. |

## 제외 6건 재확인

| Pos | 제외 pair | 교정 상태 |
| --: | --- | --- |
| 11 | `reader-step-05=d02d0a0855b9d78cd3738c8be906f646754a5e6c1110e414221923241d24b42a` | CSV에서 제거, ledger audit trace에만 존재 |
| 16 | `reader-step-03=363ec3c92da9c6352500a6ee6388ddd43a784b3c26ce1b1885d906fd696ea488` | CSV에서 제거, ledger audit trace에만 존재 |
| 17 | `reader-step-05=ce260283f9fdc7db212ac5284191e9345f7fb90509661c9d3c52ae54f8fb47ec` | CSV에서 제거, ledger audit trace에만 존재 |
| 18 | `reader-step-05=f75d26b6ba56f77a50e6b09a8051de79ac4fc76be622911285d29e2f57aae7a6` | CSV에서 제거, ledger audit trace에만 존재 |
| 19 | `reader-step-04=47ade91292f4fddef48e13639a91b3174ca5715250c63a082ff9fbd85b2ae2d7` | CSV에서 제거, ledger audit trace에만 존재 |
| 20 | `reader-step-05=04fbdc29f89c603fac8ebdb0c9034ab4cc2540ce9fc2e871015671e4f30936db` | CSV에서 제거, ledger audit trace에만 존재 |

## 종합 판정

**PASS.** 교정된 chunk 02는 current candidate/frozen root, 17열·10행 schema, 30/30 retained 해시, 30개 원본 본문 픽셀, six-ref exclusion, truthful page/context counts, terminal `unknown-ready`, static/motion gate, limitation 계약을 모두 충족한다. 이 판정은 Art 값을 부여하지 않으며 `reviewedByHuman=false`를 유지한다. annotation·promotion·commit은 수행하지 않았다.
