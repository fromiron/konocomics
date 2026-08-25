# Batch 005 Art preflight 독립 재검수 — chunk 03 round 2

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions `21–30`
- overallVerdict: `FAIL`
- work-level results: `PASS 9 / FAIL 1`
- downstream Art panel authorization: `DENIED`
- Art values assigned: `none`

## 결론

이전 QA가 요구한 세 내용 교정은 원본 픽셀과 일치한다. Position 24의 맥락은 실제로 `classroom; school corridor/exterior; school assembly/library`이며, position 27의 `reader-step-05→06→07`과 position 30의 `reader-step-05`는 각각 기록된 bounded motion sequence를 보존한다. 여섯 `sample-ready` 작품은 선택 표본에서 판독 가능한 본문 6쪽과 실제 장면 맥락 2개 이상을 충족하고, 네 `unknown-ready` 작품의 `0/0` 종결도 유지된다.

그러나 선택 PNG 36개의 SHA-256을 임시 원본에서 독립 재계산한 결과 `35/36`만 CSV와 일치했다. Position 27 `reader-step-09`의 실제 SHA-256은 다음과 같다.

```text
actual: 7fe5491aaf1ed6d0797625def24cfa41b2d72ef8cd894c8b0d4a94a6f9afa06e
CSV:    7fe5491aaf1ed6d0797625def24cfa41b2d72ef8cd894c8b0d4a6f9afa06e
```

CSV 값에는 실제 해시의 `94a`가 누락돼 있다. 같은 review bundle의 `input-ledger.md`에는 actual 값이 정확히 기록되어 있어, 표본 파일이 바뀐 것이 아니라 canonical/review `preflight.csv`의 전사 오류임을 재현할 수 있다. 이 무결성 불일치 때문에 position 27과 chunk 전체는 현재 downstream Art panel 입력으로 승인할 수 없다.

## 재현된 packet identity

- repository root: `main@a423c20add1162b7cdf71342a721ffcd7191d3c2`
- candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozen-work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- research chunk 03 SHA-256: `92f9a69121128aa2668898bdb70a112492bda8958247cd0e9c8202128e533191`
- current canonical preflight CSV SHA-256: `806916c58d127f7564a74539c8aa13b87d6de5c4597deb5f352a899f3d56faac`
- current canonical preflight ledger SHA-256: `4e3185268aa1f13a018f8de00d4c423e17c8b91073e38411c402be6656f642aa`
- `pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`: pass, 50 works, same candidate
- canonical/review `preflight.csv`: byte-identical, 17 columns, 10 rows, frozen order preserved
- selected temporary originals: `1280x720` each, repository image mutation 없음

## 작품별 판정

| Pos | workId | 작품 | Pages / contexts | State | QA | 근거 |
| --: | --- | --- | ---: | --- | --- | --- |
| 21 | `work-1ec3d48e64b228bb8a92` | 娚の一生 | 6 / 3 | sample-ready | **PASS** | 공식 小学館 volume 1 JDCN과 frozen ISBN 결속이 유지된다. `reader-step-04`의 오른쪽 chapter-title 면은 세지 않고 왼쪽 서사 본문 면만 포함해도 refs 04–09에서 판독 가능한 본문 6쪽과 domestic/funeral group, river/outdoor 등 2개 이상의 맥락이 남는다. 선택 해시 `6/6` 일치, bounded motion 없음. |
| 22 | `work-238c04ae3a3a61451078` | リューシカ・リューシカ | 0 / 0 | unknown-ready | **PASS** | 공식 Square Enix 1–3권과 frozen ISBN은 결속되지만 exact product-linked registered Gangan Online sample이 없다. 다른 reader를 대체하지 않은 static false, motion false, nonblocking `unknown-ready` 종결이 정확하다. |
| 23 | `work-43ebf010a490cfd4bb50` | 千年万年りんごの子 | 6 / 3 | sample-ready | **PASS** | 공식 講談社 volume 1 linked trial과 2–3권 bridge가 유지된다. 선택 refs 04–09는 모두 본문이며 temple/domestic conversation, outdoor/landscape, family/wedding group의 서로 다른 맥락을 보존한다. 선택 해시 `6/6` 일치, bounded motion 없음. |
| 24 | `work-4b4bbe8c10859c46e726` | 百舌谷さん逆上する | 6 / 3 | sample-ready | **PASS** | 이전 오류였던 `family or home scenes`가 제거됐다. 원본 refs 04–09는 교정된 기록대로 classroom, school corridor/exterior, school assembly/library를 보존한다. 모두 본문이고 선택 해시 `6/6` 일치하며 static gate를 충족한다. bounded motion 없음. |
| 25 | `work-5ad62e6413f67d351f1d` | 天にひびき | 0 / 0 | unknown-ready | **PASS** | 공식 少年画報社 1–3권과 frozen ISBN 결속은 유지되지만 등록된 product/topic trial을 frozen edition에 연결할 수 없다. 대체 표본 없이 `0/0` nonblocking `unknown-ready`로 닫은 것이 정확하다. |
| 26 | `work-5b7cf2105a4bc6f6b46c` | クジラの子らは砂上に歌う | 0 / 0 | unknown-ready | **PASS** | 공식 秋田書店 1–3권과 frozen ISBN은 결속된다. 관찰된 ARC reader는 이 batch registry의 Champion Cross route가 아니므로 사용하지 않은 `0/0` 종결이 정확하다. |
| 27 | `work-5e30ab3c7e3fb43e51f2` | 女王の花 | 6 / 3 | sample-ready | **FAIL** | 원본 refs 04–09는 본문 6쪽과 3맥락을 충족한다. `reader-step-05→06→07`도 도주 시작 → 추적·벽 위 도약/하강 → 착지·대면 endpoint를 보존하므로 교정된 motion true는 정확하다. 그러나 `reader-step-09` actual SHA-256과 canonical/review CSV 값이 다르다. 이 한 건을 제외한 선택 해시는 `5/6` 일치한다. |
| 28 | `work-62fb5d8e9f6c6bbbeba9` | 血潜り林檎と金魚鉢男 | 0 / 0 | unknown-ready | **PASS** | 공식 KADOKAWA 1–3권과 frozen ISBN은 결속되지만 exact product-linked distributor preview가 확인되지 않는다. 추정 표본을 사용하지 않은 `0/0` 종결이 정확하다. |
| 29 | `work-6c6341781c12b590864f` | 鉄楽レトラ | 6 / 3 | sample-ready | **PASS** | 공식 小学館 volume 1 JDCN과 frozen ISBN bridge가 유지된다. refs 04–09는 home/grandfather, transit/urban, school/basketball 본문 맥락을 보존하며 선택 해시 `6/6`이 일치한다. bounded motion 없음. |
| 30 | `work-77008e04537e3fd889e2` | ジョジョリオン | 6 / 3 | sample-ready | **PASS** | ref 04 title splash는 선택에서 제외됐고 refs 05–10은 ruined street fall, city/landscape exposition, investigation/interaction의 본문 맥락을 보존한다. `reader-step-05` 안에 실족 시작 → 낙하·충돌 → 쓰러진 aftermath·일어나는 endpoint가 연속 패널로 존재하므로 교정된 motion true는 정확하다. 선택 해시 `6/6` 일치. |

## downstream 승인 조건

새 표본 수집이나 장면 재판독은 필요하지 않다. 다음 무결성 교정과 재결속이 완료된 뒤에만 chunk 03을 downstream Art panel에 제공할 수 있다.

1. canonical 및 review bundle `preflight.csv`의 position 27 `reader-step-09` 해시를 actual 값으로 교정한다.
2. 변경된 CSV SHA-256을 두 ledger, `input-ledger.md`, `output-ledger.md`, `root-identity.json`에 재결속하고, ledger 자체 SHA-256도 해당 참조에 맞춰 갱신한다.
3. 임시 원본에서 선택 해시를 다시 계산해 `36/36` 일치와 두 CSV의 byte identity를 확인한다.

위 조건 전까지 downstream Art panel authorization은 **DENIED**다. 이 QA는 preflight·Factor·source·promotion 데이터를 수정하지 않았고, Art 값을 부여하지 않았으며, `reviewedByHuman=false`를 유지한다.
