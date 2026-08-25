# Batch 005 Art preflight 독립 QA — chunk 03

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions `21–30`
- overallVerdict: `FAIL`
- work-level results: `PASS 7 / FAIL 3`
- Art values assigned: `none`

## 독립 검증 결과

- 현재 root는 manifest와 같은 `main@a423c20add1162b7cdf71342a721ffcd7191d3c2`다. `pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`가 통과했고 candidate `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`가 독립 재산출됐다.
- manifest SHA-256 `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`, `PAYLOAD.sha256` SHA-256 `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`, frozen-work-set SHA-256 `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`, research chunk 03 SHA-256 `92f9a69121128aa2668898bdb70a112492bda8958247cd0e9c8202128e533191`가 manifest/PAYLOAD 선언값과 일치한다. factor dictionary·annotation guide·promotion method의 세 정책 해시도 manifest와 일치한다.
- canonical preflight SHA-256은 `34fa56e4edde337c70a4703207405dd20b666d1b098a0ded33c2979650376bd4`, canonical ledger SHA-256은 `dd1cd3b69d7a4b1b4dfe6b473081f949bd733a9956039f36a14703240e9e42ca`다. review bundle의 `preflight.csv`는 canonical CSV와 byte-identical이며 request/input/output/root identity의 candidate·manifest·payload·frozen·canonical output binding도 일치한다.
- preflight는 정확히 17열·10행이며 frozen positions 21–30과 순서·`workId`·canonical title이 모두 일치한다. Art 값·confidence·promotion blocker는 없다.
- `/tmp/konocomics-batch005-art-chunk03`에서 선택된 36개 `pageRef=SHA-256` pair를 다시 계산해 `36/36` 일치했다. 36개를 모두 원본 `1280x720` 픽셀로 열어 직접 판독했다.
- 공식 1–3권 상품과 대표 ISBN/JDCN 연결은 10작품 모두 유지된다. 22·25·26·28번은 registry의 유한 route를 소진한 뒤 `0/0`, static false, nonblocking `unknown-ready`로 닫은 것이 정확하다. 26번의 product-linked ARC reader는 관찰됐지만 Batch 005 registry의 Champion Cross route가 아니므로 표본으로 대체하지 않은 것이 요청 계약과 일치한다.
- 21번 `reader-step-04`는 오른쪽 chapter-title splash를 포함하지만 왼쪽에는 대사·열쇠 인계·장례식장 배경의 판독 가능한 서사 본문 면이 있다. title 면은 세지 않고 왼쪽 본문 면만 1페이지로 계산해도 선택 refs 전체에서 본문 6쪽 이상과 2맥락 이상이 남으므로 static `sample-ready`는 유지된다.
- 23·24·27·29·30번의 선택 표본도 표지·목차·광고·순수 opening/title splash를 세지 않고 각각 판독 가능한 본문 6쪽 이상과 실제로 구별되는 장면 2개 이상을 충족한다. 다만 24번의 기록된 context 설명은 실제 표본과 다르고, 27·30번은 motion gate가 잘못 닫혀 있다.

## 작품별 판정

| Pos | workId | 작품 | Pages / contexts | State | QA | 근거 |
| --: | --- | --- | ---: | --- | --- | --- |
| 21 | `work-1ec3d48e64b228bb8a92` | 娚の一生 | 6 / 3 | sample-ready | **PASS** | 小学館eコミックストア vol.1 JDCN `091322690000d0000000`이 frozen ISBN `9784091322692`와 제목·西炯子·권을 결속하고 공식 2–3권 JDCN도 entry 범위를 잇는다. ref 04의 오른쪽 chapter-title 면은 제외하고 왼쪽 서사 면만 세며, refs 05–09의 domestic/funeral group·river/outdoor 본문을 합치면 static 최소선을 넘는다. bounded motion sequence는 없다. |
| 22 | `work-238c04ae3a3a61451078` | リューシカ・リューシカ | 0 / 0 | unknown-ready | **PASS** | スクウェア・エニックス 공식 1–3권이 ISBN `9784757529083`·`9784757532311`·`9784757534155`를 결속하지만 vol.1 상품이 exact product-linked Gangan Online sample을 노출하지 않는다. generic/unregistered route를 쓰지 않은 0/0 종결이 정확하다. |
| 23 | `work-43ebf010a490cfd4bb50` | 千年万年りんごの子 | 6 / 3 | sample-ready | **PASS** | 講談社 product `0000046459`·linked trial이 vol.1 ISBN `9784063805789`에 결속되고 products `0000046505`·`0000046557`이 2–3권을 확인한다. refs 04–09는 전부 본문이며 temple/domestic conversation, outdoor/landscape, family/wedding group의 서로 다른 맥락을 보존한다. bounded motion sequence는 없다. |
| 24 | `work-4b4bbe8c10859c46e726` | 百舌谷さん逆上する | 6 / 3 | sample-ready | **FAIL** | 講談社 product `0000029330`·trial과 ISBN `9784063145120`, 공식 2–3권 결속 및 6개 해시는 맞고 static gate도 충족한다. 그러나 refs 04–09는 classroom, school corridor/exterior, assembly/library 맥락이며 CSV/ledger가 주장하는 `family or home scenes`는 선택 픽셀에 없다. 3맥락 count는 유지할 수 있지만 limitation과 ledger의 장면 설명은 사실과 다르다. |
| 25 | `work-5ad62e6413f67d351f1d` | 天にひびき | 0 / 0 | unknown-ready | **PASS** | 少年画報社 공식 products `6719`·`6369`·`6619`가 1–3권과 frozen ISBN `9784785932909` 범위를 결속하지만 exact product/topic-linked internal trial이 없다. 0/0 finite failure가 정확하다. |
| 26 | `work-5b7cf2105a4bc6f6b46c` | クジラの子らは砂上に歌う | 0 / 0 | unknown-ready | **PASS** | 秋田書店 공식 1–3권 ISBN `9784253261012`·`9784253261029`·`9784253261036`은 정확하다. 상품의 ARC reader는 Batch 005 registry에 등록된 Champion Cross episode bridge가 아니므로 표본에 쓰지 않은 0/0 종결이 요청의 unregistered-route 금지와 일치한다. |
| 27 | `work-5e30ab3c7e3fb43e51f2` | 女王の花 | 6 / 3 | sample-ready | **FAIL** | 小学館 vol.1 JDCN `091320090000d0000000`과 frozen ISBN `9784091320094`, 공식 2–3권 결속 및 6개 해시는 맞다. 그러나 refs `reader-step-05`→`06`→`07`은 도주 시작, 추적·벽 위 도약과 하강, 착지 후 대면이라는 하나의 연속되고 해결된 endpoint를 보존한다. `motionGateAttemptable=false`와 “sequence was not isolated” limitation은 원본 픽셀과 충돌한다. |
| 28 | `work-62fb5d8e9f6c6bbbeba9` | 血潜り林檎と金魚鉢男 | 0 / 0 | unknown-ready | **PASS** | KADOKAWA 공식 1–3권이 ISBN `9784048860499`·`9784048863377`·`9784048911818`을 결속하지만 vol.1 상품은 exact product-linked BOOK WALKER sample을 제공하지 않는다. distributor preview를 추정하지 않은 0/0 종결이 정확하다. |
| 29 | `work-6c6341781c12b590864f` | 鉄楽レトラ | 6 / 3 | sample-ready | **PASS** | 小学館eコミックストア vol.1 JDCN `091234450000d0000000`이 frozen ISBN `9784091234452`와 제목·佐原ミズ·권을 결속하고 공식 2–3권 JDCN도 entry 범위를 확인한다. refs 04–09는 home/grandfather, transit/urban, school/basketball 본문을 보존하며 bounded motion endpoint는 없다. |
| 30 | `work-77008e04537e3fd889e2` | ジョジョリオン | 6 / 3 | sample-ready | **FAIL** | 集英社 vol.1 exact ISBN reader `9784088703114`와 공식 2–3권 ISBN `9784088704135`·`9784088705262`, 6개 해시는 맞고 ref 04 title splash도 선택에서 빠졌다. 그러나 `reader-step-05` 한 spread 안에 보행/실족 시작, 낙하·충돌, 바닥에 쓰러진 aftermath와 일어나는 endpoint가 연속 패널로 고정돼 있다. motion gate를 false로 닫은 기록은 policy의 bounded fall-sequence 기준과 충돌한다. |

## 정확한 교정 지시

1. Position 24의 두 `preflight.csv` 사본에서 limitation의 `family or home scenes`를 삭제하고 실제 refs에 맞춰 `classroom; school corridor/exterior; school assembly/library`로 기록한다. canonical/review ledger의 position 24 route note도 같은 세 맥락으로 맞춘다. `readableInternalPageCount=6`, `distinctContextCount=3`, static/state 및 hashes는 바꾸지 않는다.
2. Position 27의 두 `preflight.csv` 사본에서 `motionGateAttemptable=true`로 바꾸고 limitation에 exact bounded sequence `reader-step-05→reader-step-06→reader-step-07`의 도주 → 도약/하강 → 착지·대면 endpoint를 기록한다. page refs·hashes·static/state는 그대로 둔다.
3. Position 30의 두 `preflight.csv` 사본에서 `motionGateAttemptable=true`로 바꾸고 limitation에 `reader-step-05`의 실족 시작 → 낙하/충돌 → 쓰러짐·일어남 endpoint를 기록한다. page refs·hashes·static/state는 그대로 둔다.
4. canonical ledger, review-bundle ledger, `output-ledger.md`의 “motion true 0 / none” 및 전 행 motion false 문구를 positions `27, 30`의 `2`건으로 고친다. `input-ledger.md`, `output-ledger.md`, `root-identity.json`, 두 ledger의 canonical output SHA-256을 새 CSV/ledger bytes에 맞춰 재계산한다. request·candidate·manifest·PAYLOAD·frozen·research identity는 변경하지 않는다.

## 종합 판정

**FAIL.** current candidate/frozen root, 17열·10행 schema, official authority/edition bridge, 36/36 선택 해시, static page/context 최소선과 네 unknown-ready finite route는 재현됐다. 그러나 position 24의 context 기록과 positions 27·30의 motion gate가 원본 픽셀과 불일치하므로 현재 chunk 03을 downstream Art review 입력으로 승인할 수 없다. 이 QA는 Art 값을 부여하지 않았고 `reviewedByHuman=false`를 유지한다. annotation·promotion·commit은 수행하지 않았다.
