# Batch 005 Art preflight 독립 재-QA — chunk 04 round 3

- 검수 범위: frozen positions `31–40`
- 검수일: `2026-08-25`
- reviewedByHuman: `false`
- 작품별 판정: **PASS 10 / FAIL 0**
- 결속 판정: **FAIL 1**
- 전체 판정: **FAIL — downstream Art panel 보류**
- Art 값 부여: `none`
- 입력 `preflight.csv` SHA-256:
  `a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7`
- 입력 `ledger.md` SHA-256:
  `d93f0eb918bee949bd536d98b24eba1ce0c9a336de0d8a0722e51e9e690ca983`
- round 2 QA SHA-256:
  `74d85ad070cc482529b998498e3591441e55367a7894bfd98675f9e9674a5c9d`
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
- 검수 root: `main@a423c20add1162b7cdf71342a721ffcd7191d3c2`
- 임시 원본 루트: `/tmp/konocomics-batch005-art-chunk04`

## 결속과 해시 재검증

`pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`는
50 works와 위 candidate SHA로 통과했다. Batch 디렉터리의
`sha256sum -c PAYLOAD.sha256`는 17개 항목 모두 `OK`였다.

CSV는 17열·10행이며 frozen positions 31–40의 순서, workId, canonical
title과 일치한다. canonical title의 `『`·`』` 잔존은 없다.

CSV가 선언한 임시 원본 **48개 전부**를 다시 읽어 SHA-256을 계산했다.
`pageRefs`와 `temporarySampleSha256` 양쪽은 서로 동일하고 실제 파일과
**48/48 일치**한다. 누락 `0`, mismatch `0`, 중복 hash `0`이다. Round 2가
확인한 기존 47개뿐 아니라 position 35의 motion-only 원본도 다시 계산했다.

- position 35 `reader-page-010` 실제 SHA-256:
  `a4dafabef698ded2500aaea28819fc2827010e6e4d5459c4fec0de48e0f7dc4a`
- CSV 양쪽에 기록된 SHA-256: 동일
- 실제 파일:
  `/tmp/konocomics-batch005-art-chunk04/highscore/10.jpg`

## Position 35 정책 검증

`reader-page-002`–`007`은 읽을 수 있는 BODY 6쪽이지만 같은 오락실 대면
흐름 한 맥락이다. 따라서 `staticGateAttemptable=false`,
`stateEligibility=unknown-ready`가 맞다. 이는 정적 Art 세 축을 unknown으로
종결한다는 뜻이며 낮은 값으로 취급하지 않는다.

별도 원본 `reader-page-010`은 한 페이지 안에서 다음 연속 패널을 정확히
고정한다.

1. 소년이 기기를 조작하는 시작
2. 소녀가 접근하며 발을 옮기는 전개
3. 얼굴에 주먹이 닿는 impact
4. 코피가 난 aftermath와 두 인물의 정지 상태

따라서 exact start→development→impact→resolved endpoint가 있고
`motionGateAttemptable=true`는 감사 가능하다. motion-only 근거는 정적
6쪽·2맥락 요건을 우회하지 않으므로 `static=false`, `motion=true`,
`unknown-ready` 조합은 내부적으로 일관된다. CSV limitation과 ledger 본문도
round 2의 모순 문장을 제거하고 이 경계를 동일하게 기록한다.

## 작품별 판정

| Pos | 작품 | 상태 | round 3 판정 |
| --: | --- | --- | --- |
| 31 | デストロ２４６ | sample-ready `6/2`, motion false | **PASS** |
| 32 | 夢の雫、黄金の鳥籠 | sample-ready `6/2`, motion false | **PASS** |
| 33 | 日常 | unknown-ready `5/1`, motion false | **PASS** |
| 34 | ひらやすみ | sample-ready `6/3`, motion false | **PASS** |
| 35 | ハイスコアガール | unknown-ready `6/1`, motion true | **PASS** |
| 36 | WOMBS | sample-ready `6/3`, motion false | **PASS** |
| 37 | ママはテンパリスト | sample-ready `6/3`, motion false | **PASS** |
| 38 | 僕らはみんな河合荘 | unknown-ready `0/0`, motion false | **PASS** |
| 39 | かよちゃんの荷物 | unknown-ready `0/0`, motion false | **PASS** |
| 40 | 脳内ポイズンベリー | sample-ready `6/2`, motion false | **PASS** |

## 남은 단일 결속 실패

현재 `ledger.md` 6행은 다음 수정 전 SHA를 기록한다.

```text
preflightCsvSha256: 406b754f22acf55971ceaa93caefde3589fceb72d389c33b926665d737f8f6e9
```

하지만 round 2의 position 35 limitation 교정 뒤 실제 `preflight.csv` SHA는
다음이다.

```text
a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7
```

즉, 작품·픽셀·게이트 판정은 10/10 통과했지만 ledger가 현재 입력을
암호학적으로 결속하지 않는다. 최소 교정은 `ledger.md`의
`preflightCsvSha256` 한 줄을 현재 SHA로 바꾸는 것이다. 그 변경으로 생기는
새 ledger SHA만 다시 확인하면 되고 픽셀 재수집이나 작품 판정 재실행은
필요하지 않다. 이 결속이 고쳐지기 전에는 Local/Gemini Art panel에 chunk
04를 넘기지 않는다.

이 QA는 source, preflight, ledger, promotion, terminal Factor를 수정하지
않았고 `reviewedByHuman=false`를 유지한다. `git diff --check`는 통과했다.
