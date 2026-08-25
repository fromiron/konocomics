# Batch 005 Art preflight 독립 QA — chunk 04 position 39 recovery round 2

- 대상: frozen position `39`, `work-aa6018249b7fe7e92d95`, `かよちゃんの荷物`
- 검수일 / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- 원본 판정: **FAIL** — `sample-ready 6/2`는 직접 픽셀 상태와 불일치
- 교정 후 판정: **PASS** — `unknown-ready 0/0`, static false, motion false
- 임시 원본 루트: `/tmp/konocomics-batch005-pos39-recovery-round2`
- Art 값 부여 / source·generated·promotion 변경: 없음

## 결속과 identity·edition

Batch 005 candidate, manifest, payload ledger, frozen work-set은 각각
`8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`,
`3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`,
`50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`,
`ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`로
동결값과 일치한다. final blocker adjudication SHA-256은
`8fbfabc6f39d01400241c411d75dcb6160c8b61834a071d117a0f8dba805d73e`다.

BookLive lower product, reader shell, manifest 응답 SHA-256은 각각
`57d9c94e62854df6699dce9deeb62cf86c5c17f1c80abc632d9d2c659ae0bf09`,
`944920726ab9c257d44d488f375f52a35885dcd8fbd4216676e8b5c46bbc3022`,
`fcab73d8bc9bb4620505aaefce8bac3f06e69df7ef287a1fa2f007108f2a3a22`다.
Product metadata는 `かよちゃんの荷物 新装版 下`, `雁須磨子`, `竹書房`,
ISBN `9784801959255`, `2017-04-27`을 식별한다. Manifest도 같은 제목·저자·
출판사를 식별한다. frozen canonical은 장식 괄호와 판본 접미사가 없는
`かよちゃんの荷物`, 대표 ISBN은 원판 1권 `9784812465752`로 유지된다.
따라서 identity와 same-work 신장판 bridge는 **PASS**다.

## 12개 manifest 원본 픽셀 재검수

`P0000`–`P0011`에 대응하는 12개 JPEG를 모두 원본 해상도
`1189×1664`로 다시 열었다. 12/12 파일의 직접 픽셀은 BookLive reader가
클라이언트에서 복원하기 전의 tile-scrambled 상태다. `reader.png`는 복원된
표지만 보여 주며 BODY 페이지 캡처는 아니다.

| Ref | SHA-256 | Manifest 분류 | 직접 픽셀 판정 | Count |
| --- | --- | --- | --- | ---: |
| `P0000` | `9b0bcefdb87ec8420a9dbfb8fd41a416ab535b32b47080b3b74d9bde31252e6c` | cover | 표지, tile-scrambled | 0 |
| `P0001` | `6fdcbb2cbadd3d1922747385984218caf5d5eda761e87c34b29e8040615a6305` | blank front matter | 백지 | 0 |
| `P0002` | `e6931e28a4de63585f3e51201cb780b405f594d8b2d73efeadadf61d48831970` | title/colour front matter | 타이틀 전면, tile-scrambled | 0 |
| `P0003` | `d83a0abb78be2e35cc083ed9b50ee53e4f55209865ca53cbbbc23cca3ce4b178` | illustration gallery | 갤러리, tile-scrambled | 0 |
| `P0004` | `e25d67b84a189c80ea03ce3e414080b162d5a606c1f291328c19aae6e929e5fb` | illustration gallery | 갤러리, tile-scrambled | 0 |
| `P0005` | `803db2b6c240d1c08a87999a9406e1f8cc428cf783f92d7b25da8daf8e9a0314` | illustration gallery | 갤러리/목차, tile-scrambled | 0 |
| `P0006` | `c70c9518ef30e2efca298a6d19cb1825b852ea4078d3c88265e9b8d3943089b8` | BODY candidate | tile-scrambled, 완전한 페이지 판독 불가 | 0 |
| `P0007` | `1d6eb3fd7d6302e78896b8f50b22ac70067c9b3019c65838b5aeab49765d5922` | BODY candidate | tile-scrambled, 완전한 페이지 판독 불가 | 0 |
| `P0008` | `5bee41954f2b5c97ee81f5d2e26469ae094e8dacfce2d4331539ac04f0c11fac` | BODY candidate | tile-scrambled, 완전한 페이지 판독 불가 | 0 |
| `P0009` | `1b1d87e53c218afe1a1ec1f41b72fd9740f7207be7e2a785f0c7fe7140c64325` | BODY candidate | tile-scrambled, 완전한 페이지 판독 불가 | 0 |
| `P0010` | `faef78011c5020ee9389e37e3155143677b9bfc6bbe1ec9ad10b93076b98e35e` | BODY candidate | tile-scrambled, 완전한 페이지 판독 불가 | 0 |
| `P0011` | `6b11807a7bb66f79f2bde88ab4dd380d244ef47c58fec6eabd66483f888027bf` | BODY candidate | tile-scrambled, 완전한 페이지 판독 불가 | 0 |

Manifest의 `<t-contents>`가 `P0000` 표지, `P0003`–`P0005` 갤러리,
`P0006`부터 `baggage22 かよちゃんと遊ぼう` BODY 시작을 지정하는 것은 맞다.
그러나 manifest상 BODY ref와 Art 정책의 “판독 가능한 내부 페이지”는 같은
개념이 아니다. 난독화된 조각에서 이동·실내·식사·거리 요소가 보이더라도
완전한 페이지 맥락을 확정할 수 없으므로 `6 pages / 2 contexts`로 세면 안 된다.

## Gate 판정과 교정

| Gate | 교정 전 | 독립 판정 | 교정 후 |
| --- | --- | --- | --- |
| identity / edition | pass | pass | pass |
| readable BODY pages | `6` | `0` | `0` |
| distinct contexts | `2` | `0` admissible | `0` |
| static Art | attemptable | fail | `false`, `unknown-ready` |
| motion Art | false | pass | `false`, `unknown` |

연속된 시작·전개·impact·resolved endpoint를 복원된 페이지로 고정한 표본이
없으므로 motion false는 맞다. Art unknown은 낮은 값이나 promotion blocker가
아니다. Local/Gemini Art 판정은 이 패킷에서 시작하면 안 된다.

다음 파일을 최소 교정했다.

- `art-preflight/chunk-04/recovery-pos39-round-2-preflight.csv`
- `art-preflight/chunk-04/recovery-pos39-round-2-ledger.md`
- `research/art-route-recovery-pos39-round-2.md`
- `reviews/art-preflight/chunk-04-pos39-recovery-round-2/input-ledger.md`
- `reviews/art-preflight/chunk-04-pos39-recovery-round-2/output-ledger.md`
- `reviews/art-preflight/chunk-04-pos39-recovery-round-2/root-identity.json`

교정 후 SHA-256은 preflight
`fe40d63532ff62488b3a89445f7652a6f7442f021ac950d4abf09aeaaf6c2c68`,
recovery ledger
`76ad175a1c7602d49cd9d23d028ca116ee88fe63370b4caf6d458dc276d46e03`,
research
`03263a43d50927ad068f640b7657f3f396d90fe5081128edb3eeddc73f71b295`,
input ledger
`51e101f1d0f30d873e8edc01bf0037d942e3fbfdcb942bc9deda89502c9206a1`,
output ledger
`f0bbd055a0fc3cb0d837b4f71f02979e6fc6722e9d3d4761e6f0d6fb7943671c`,
root identity
`85821936a28661c07f5fb18f1aa66ca6989d0ca93272a4ef540b3acbce68790c`다.
Root identity의 내부 결속 해시는 모두 현재 파일과 일치한다.

## 재개방 경로

공식 BookLive reader가 클라이언트에서 복원한 `P0006`–`P0011` BODY 전체를
각 페이지별로 캡처하고 새 SHA-256을 보존한 뒤, 6쪽 모두 판독 가능하고 완전한
장면 맥락이 최소 2개인지 다시 독립 QA해야 한다. 그 전에는 Art 전축을
`unknown`으로 명시 종결한다.

```text
reviewedByHuman=false
artAssigned=false
terminalOrPromotionMutation=false
temporaryImagesCommitted=false
finalState=unknown-ready
```
