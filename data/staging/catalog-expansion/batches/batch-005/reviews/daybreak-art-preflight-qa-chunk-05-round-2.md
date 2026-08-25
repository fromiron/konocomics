# Batch 005 Art preflight 독립 재-QA — chunk 05 round 2

- 검수 범위: frozen positions `41–50`
- 검수일: `2026-08-25`
- reviewedByHuman: `false`
- 판정: **PASS 10 / FAIL 0**
- 입력 `preflight.csv` SHA-256: `57ef95da4593b94895e053c686cb316bde2a83259b071b474456ab7fefb1c8f9`
- 입력 `ledger.md` SHA-256: `6a2758d0180d3793fd9fb6ac54892ec164f6ac09ee1e7bdc122a63b8d598d0a2`
- 이전 QA SHA-256: `11354fcee62a168d6db9900b09e6df40880e09fe2712a2539a3933926b08c4e7`
- batch manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- 임시 원본 루트: `/tmp/konocomics-batch005-art-chunk05`

## 결속·검수 방법

`pnpm exec tsx scripts/build-promotion-batch-packet.ts --check --batch-id batch-005`를 실행해 현재 canonical live input, 50작품 frozen packet, manifest 정책 해시, payload ledger, work-set, candidate identity를 재검증했다. 결과는 `batch-005 packet check: 50 works; candidate 8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695.`로 성공했다. `PAYLOAD.sha256`의 18개 항목도 모두 `OK`였다.

CSV는 17열·10행이며 frozen positions 41–50의 `workId`와 장식 괄호 없는 canonical title이 행 순서대로 모두 일치한다. 네 `sample-ready` 작품의 선언 페이지 24개를 `/tmp` 원본에서 다시 SHA-256 계산해 **24/24 일치**를 확인했다. 46·47·50의 집합 해시는 ledger에 기록된 절대 경로 순서의 `sha256sum <selected files> | sha256sum`으로 각각 다음과 같이 재현했다.

- 46: `1ccbf4ed045983b49a3cbe7c610b6182322fa0ec9b7f22438afc9ab54c8b47c6`
- 47: `d2b1a145193601ac8f4a1e9e27aa44af4961e8b13ecc78f86e2a575b88ca89ca`
- 50: `41e6a97643bcc710adfda9ce43ab7c95c78f8bdaaea12d0377305882bbae67d0`

41은 별도 집합 해시 대신 `pageRefs`의 여섯 개별 해시 문자열을 `temporarySampleSha256`에 그대로 보존하며, 6/6 원본과 일치한다. ledger의 position 41 설명 중 “set hash”라는 표현은 부정확하지만 같은 문서의 verification boundary와 CSV의 실제 직렬화가 개별 해시 보존임을 명시하므로 eligibility를 바꾸는 결함은 아니다.

선택 원본을 픽셀로 열어 BODY 여부와 장면 범위를 다시 확인했다. 표지, 백지, 목차, 광고, title/chapter splash는 네 표본에서 제외됐다. 43·44·49의 직접 취득 페이지는 tile-scrambled이고 42·48은 난독화·사용 불가 렌더뿐이므로 어떤 페이지도 BODY 표본으로 세지 않은 것이 맞다.

## 작품별 판정

| Pos | Work | 선언 상태 | 판정 | 근거와 downstream 경계 |
| --: | --- | --- | --- | --- |
| 41 | `work-c50ea94bb66f72c679a2` 機械仕掛けの愛 | sample-ready 6/3 | **PASS** | 교정된 `reader-trg-06`–`11`은 6/6 읽을 수 있는 BODY다. amusement park, robot shop, home의 3맥락이 확인된다. 정적 Art 판정 개시 가능, 완결 동작 시퀀스가 없어 motion은 개시 불가. |
| 42 | `work-c7e065f61bb7a176ee56` 臨死!!江古田ちゃん | unknown-ready 0/0 | **PASS** | 공식 product-linked reader와 1–3권 bridge는 유지되지만 보존 렌더 5개는 난독화 또는 사용 불가다. 6쪽·2맥락 미달이므로 Art 전축 unknown 종결이 맞다. |
| 43 | `work-c8243866b7c8a6d9a2f8` 町でうわさの天狗の子 | unknown-ready 0/0 | **PASS** | 이전의 잘못된 6쪽 표본을 제거했다. 공식 exact-JDCN reader 자산은 tile-scrambled이며 decoded BODY가 없으므로 page ref·context·sample hash 없이 unknown 종결이 맞다. |
| 44 | `work-db4a0ec451d7f4ffd8b8` 万福児 | unknown-ready 0/0 | **PASS** | 1–3권 JDCN bridge와 52개 commercial `content.js` refs는 확인되지만 직접 `M_L.jpg` 바이트는 tile-scrambled다. 실패 사유가 실제 상태로 교정됐고 decoded BODY가 없어 unknown 종결이 맞다. |
| 45 | `work-e658d3aee2e33c17aa38` スピリットサークル | unknown-ready 0/0 | **PASS** | 공식 products 7155–7157이 1–3권을 연결하지만 product-linked readable internal preview가 없다. nonblocking unknown 종결이 맞다. |
| 46 | `work-e906b3eaa9ef9eafe23c` トリリオンゲーム | sample-ready 6/2 | **PASS** | 교정된 `reader-trg-11`–`16`은 6/6 BODY다. coastal luxury residence와 urban flashback/assault의 2맥락이 확인된다. 정적 Art 판정 개시 가능, 완결 동작 시퀀스가 없어 motion은 개시 불가. |
| 47 | `work-f31a42ea4ad724acefa5` デッドデッドデーモンズデデデデデストラクション | sample-ready 6/3 | **PASS** | 광고·title page를 뺀 `reader-trg-07`–`12`는 6/6 BODY다. household, street/bicycle, school의 3맥락이 확인된다. 정적 Art 판정 개시 가능, 완결 동작 시퀀스가 없어 motion은 개시 불가. |
| 48 | `work-f4bfc29a5e0a9b5148d0` 月に吠えらんねえ | unknown-ready 0/0 | **PASS** | 공식 product-linked reader와 1–3권 bridge는 유지되지만 보존 렌더 5개는 난독화 또는 사용 불가다. 6쪽·2맥락 미달이므로 Art 전축 unknown 종결이 맞다. |
| 49 | `work-fb89f119251610cf1648` 1/11 じゅういちぶんのいち | unknown-ready 0/0 | **PASS** | 1–3권 JDCN bridge와 59개 commercial `content.js` refs는 확인되지만 직접 `M_L.jpg` 바이트는 tile-scrambled다. 실패 사유가 실제 상태로 교정됐고 decoded BODY가 없어 unknown 종결이 맞다. |
| 50 | `work-fe35a5f01946f5153eb4` シュトヘル | sample-ready 6/2 | **PASS** | `reader-trg-09`–`14`는 6/6 BODY다. 09–11의 역사 전투·부상/구출과 12–14의 현대 karaoke·실내 대화, 정확히 2맥락이다. 정적 Art 판정 개시 가능, 완결 동작 시퀀스가 없어 motion은 개시 불가. |

## 종결 판정

정적 Art model panel은 positions **41, 46, 47, 50**의 보존된 24개 원본에만 개시할 수 있다. 이 승인 자체는 known 값을 부여하지 않는다. positions **42, 43, 44, 45, 48, 49**는 표본 기준 미달을 재현 가능하게 기록했으므로 Art 전축을 `unknown`으로 종결하며, 이것만으로 promotion blocker가 되지 않는다.

모든 position에서 `motionGateAttemptable=false`가 맞다. 시작·전개·impact·resolved endpoint가 정확한 연속 참조로 고정된 표본이 없으므로 `motionImpact` known 판정은 어느 작품에서도 시작할 수 없다.
