# Batch 005 Art preflight 독립 재-QA — chunk 04 round 2

- 검수 범위: frozen positions `31–40`
- 검수일: `2026-08-25`
- reviewedByHuman: `false`
- 전체 판정: **FAIL 1 / PASS 9**
- downstream Art panel 승인: **보류**
- Art 값 부여: `none`
- 입력 `preflight.csv` SHA-256:
  `406b754f22acf55971ceaa93caefde3589fceb72d389c33b926665d737f8f6e9`
- 입력 `ledger.md` SHA-256:
  `a8141c70fb52ae8fc8535b4c61c482268a5f3187b59a09ba3f5e2b7d8396e64b`
- 이전 QA SHA-256:
  `04adf79e961fe66a02afeb0bef7b6619ba2ee61822a47b5a35102204b1d8c621`
- batch manifest SHA-256:
  `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c662b79a7da`
- candidate SHA-256:
  `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- `PAYLOAD.sha256` SHA-256:
  `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozen work-set SHA-256:
  `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- research chunk 04 SHA-256:
  `46e6b37d07f4b2baee839dca05331e9c870a6d158c392e3d77ad77419a5b76a3`
- 임시 원본 루트: `/tmp/konocomics-batch005-art-chunk04`

## 결속과 해시 검증

`pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`는
50 works, candidate
`8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`로
통과했다. batch 디렉터리에서 `sha256sum -c PAYLOAD.sha256`를 실행한
결과 17개 항목이 모두 `OK`였다. 검수 root는
`main@a423c20add1162b7cdf71342a721ffcd7191d3c2`다.

CSV는 정확히 17열·10행이고 frozen positions 31–40의 순서, `workId`,
canonical title과 모두 일치한다. canonical title에 `『` 또는 `』`를 포함한
행은 없다.

CSV가 선언한 48개 원본을 `/tmp`에서 다시 SHA-256 계산했다. `pageRefs`와
`temporarySampleSha256` 양쪽에 대해 **48/48 일치**, mismatch `0`, 중복
hash `0`이다. 원본 픽셀도 다시 열어 BODY 여부, 장면 맥락, 동작 시퀀스를
확인했다.

## 작품별 판정

| Pos | 작품 | 선언 상태 | 재검수 판정 | 근거와 downstream 경계 |
| --: | --- | --- | --- | --- |
| 31 | `work-79c18b26dfde8a532f73` デストロ２４６ | sample-ready `6/2`, motion false | **PASS** | exact vol.1 tameshiyo bridge와 6개 hash가 맞다. refs 05–08, 10–11은 BODY이고 습격 저택과 식당·대화의 2맥락을 보존한다. impact가 포함된 완결 연속 동작은 고정되지 않아 static만 판정 가능하다. |
| 32 | `work-7b6eb2b48ac06ffa26eb` 夢の雫、黄金の鳥籠 | sample-ready `6/2`, motion false | **PASS** | 교체된 refs 04–09는 모두 BODY다. 마을·회상 흐름과 침실 습격의 2맥락을 보존한다. 시작·전개·impact·resolved endpoint가 모두 있는 연속 동작은 없어 static만 판정 가능하다. |
| 33 | `work-8037856e7703fdaf4324` 日常 | unknown-ready `5/1`, motion false | **PASS** | 목차를 제거한 refs 07–11은 BODY 5쪽이지만 병원 앞·주택가의 같은 샤케 사건 한 맥락이다. 6쪽·2맥락을 충족하지 않으므로 Art 네 축을 unknown으로 종결하는 것이 맞다. |
| 34 | `work-88cb26a0229ad7b83263` ひらやすみ | sample-ready `6/3`, motion false | **PASS** | chapter splash를 제거한 refs 05·06·08–11은 모두 BODY다. 집·거리·가게/이웃 대화의 3맥락이 확인된다. 완결 연속 동작은 없어 static만 판정 가능하다. |
| 35 | `work-8a7846af8ead1797e6a2` ハイスコアガール | unknown-ready `6/1`, motion true | **FAIL** | refs 002–007이 같은 오락실 대면 한 맥락이므로 static unknown 종결은 맞다. `reader-page-010`은 소년이 기기를 조작하는 시작, 소녀의 접근·발 이동, 얼굴 타격 impact, 코피가 난 aftermath를 한 페이지의 연속 패널로 고정하므로 **start→development→impact→resolved를 충족**하고 motion-only 판정이 가능하다. 그러나 CSV limitation은 이를 “continuous punch sequence”라고 기록한 직후 “no exact bounded continuous start-development-impact-resolved sequence was isolated”라고 부정한다. motion provenance가 서로 모순되므로 현재 입력은 승인할 수 없다. |
| 36 | `work-8ff141505b0a27f8d630` WOMBS | sample-ready `6/3`, motion false | **PASS** | exact ISBN/JDCN의 등록 e-comi viewer bridge와 refs 08, 10–14가 맞고 모두 BODY다. 행성 풍경, 관제실, 전송 터널·군중의 3맥락이다. 11–14는 카운트다운 도중에 끝나 resolved endpoint가 없으므로 motion false가 맞다. |
| 37 | `work-982bb79e03193ebbafcd` ママはテンパリスト | sample-ready `6/3`, motion false | **PASS** | exact ISBN reader의 refs 07–11·13은 모두 BODY다. 임신·가정, 출산, 산후 육아의 3맥락을 보존하고 완결 동작 시퀀스는 없다. static만 판정 가능하다. |
| 38 | `work-9e98119539f60465ce66` 僕らはみんな河合荘 | unknown-ready `0/0`, motion false | **PASS** | exact vol.1 상품과 frozen ISBN은 결속되지만 등록 route의 해당 판본 internal preview가 없다. 다른 권을 대체하지 않은 `0/0` unknown 종결이 맞고 blocker가 아니다. |
| 39 | `work-aa6018249b7fe7e92d95` かよちゃんの荷物 | unknown-ready `0/0`, motion false | **PASS** | limitation이 전역 부재 주장을 제거하고 현재 승인 route registry에 竹書房 route가 없어 edition-bound sampling을 하지 않았다는 유한 범위로 교정됐다. `0/0` unknown 종결이 맞고 blocker가 아니다. |
| 40 | `work-ab9331f7fed1990f7dc6` 脳内ポイズンベリー | sample-ready `6/2`, motion false | **PASS** | title splash를 제거한 refs 06–11은 모두 BODY다. 현실 역·대면과 뇌내 회의의 2맥락을 보존한다. 완결 연속 동작은 없어 static만 판정 가능하다. |

## 최소 교정과 종결

Position 35의 pixel·hash·boolean·state는 바꿀 필요가 없다. CSV
`limitation`과 ledger의 마지막 부정 문장만 제거하고, 예를 들어 다음처럼
한 문장으로 일치시키면 된다.

> Exact official reader-page-010 contains a bounded continuous
> start-development-impact-resolved punch sequence and is retained as
> motion-only evidence; static Art remains unknown-ready because the six BODY
> pages cover only one context.

이 문구 교정으로 `preflight.csv`와 `ledger.md`의 SHA가 바뀌므로 두 binding을
다시 기록한 뒤 짧은 round 3 무결성 QA가 필요하다. 그 전까지 chunk 04 전체를
Local/Gemini Art panel에 넘기지 않는다. 그 외 positions 31, 32, 34, 36, 37,
40은 static sample-ready이고 positions 33, 38, 39는 Art 전축 unknown으로
종결한다. Position 35는 static 세 축 unknown, `motionImpact`만 model-panel
판정 대상으로 남는다.

이 QA는 source, preflight, promotion, terminal Factor를 수정하지 않았고
`reviewedByHuman=false`를 유지한다.
