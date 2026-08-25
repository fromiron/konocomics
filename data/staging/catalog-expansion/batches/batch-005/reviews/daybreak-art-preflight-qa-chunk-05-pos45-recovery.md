# Batch 005 Art preflight 독립 QA — chunk 05 position 45 recovery

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent edition, pixel, and hash QA
- reviewedByHuman: `false`
- scope: frozen position `45`, `work-e658d3aee2e33c17aa38`, `スピリットサークル`
- temporary image root: `/tmp/konocomics-spirit45-recovery-v2`
- Art values assigned: `false`
- promotion performed: `false`
- source/generated/final-art mutation: `false`

## 결론

**PASS after one provenance correction.** BOOK☆WALKER volume 2 trial의
`actual-p-006.jpeg`–`actual-p-011.jpeg`은 모두 `853×1200`의 판독 가능한 내부
BODY 페이지이며, 엄격하게 합쳐도 `(1)` fantasy/travel-memory와 `(2)` present-day
school corridor/classroom의 서로 다른 2맥락을 이룬다. 따라서 recovery row의
`accessible`, `6`, `2`, `staticGateAttemptable=true`, `sample-ready`는 정확하다.

`p006`의 팔을 드는 단일 패널과 `p007`–`p011`의 보행·대화는 정확한
start-development-impact-resolved endpoint를 가진 하나의 연속 동작 시퀀스가
아니다. `motionGateAttemptable=false`가 맞다. 이 QA는 Art 값을 부여하지 않으며,
기존 `final-art.csv`의 position 45 `U/U/U/U`도 수정하지 않았다.

## canonical·판본·상품 bridge 재검산

Frozen work-set position 45는 `work-e658d3aee2e33c17aa38` /
`スピリットサークル`이다. Batch source는 creator `水上悟志`, publisher
`少年画報社`, entry scope `entry_1_3_volumes`를 기록하고, representative volume은
standard volume 1 ISBN `9784785939830`이다.

| Volume | 少年画報社 공식 상품 | Title / creator | ISBN | Release |
| ---: | --- | --- | --- | --- |
| 1 | https://www.shonengahosha.co.jp/book_Info.php?id=7155 | `スピリットサークル 第1巻` / `水上悟志` | `9784785939830` | `2012-12-10` |
| 2 | https://www.shonengahosha.co.jp/book_Info.php?id=7156 | `スピリットサークル 第2巻` / `水上悟志` | `9784785950972` | `2013-07-30` |
| 3 | https://www.shonengahosha.co.jp/book_Info.php?id=7157 | `スピリットサークル 第3巻` / `水上悟志` | `9784785952556` | `2014-04-03` |

세 공식 상품을 다시 열어 title, creator, ISBN, release date를 확인했다.
BOOK☆WALKER products 1–3도 각각 exact volume title, creator `水上悟志`, publisher
`少年画報社`를 반환하고, 각 `?sample=1` route는 HTTP 200으로 두 번 redirect한 뒤
아래 exact trial viewer CID로 종결됐다.

| Volume | BOOK☆WALKER product | Final viewer CID |
| ---: | --- | --- |
| 1 | https://bookwalker.jp/ded91ce5bd-eb14-46e5-938c-f27e4a0203c2/?sample=1 | `d91ce5bd-eb14-46e5-938c-f27e4a0203c2` |
| 2 | https://bookwalker.jp/de10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/?sample=1 | `10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df` |
| 3 | https://bookwalker.jp/de110df35f-cfc9-40cc-98e4-be4ce5ec9584/?sample=1 | `110df35f-cfc9-40cc-98e4-be4ce5ec9584` |

따라서 선택 이미지 경로의 volume-2 CID는 동일 title·creator·publisher·volume인
정식 전자판과 직접 결속되고, 공식 1–3권 상품 및 frozen representative ISBN과의
entry-range bridge도 재현된다.

## 11/11 원본 픽셀·해시 재검산

아래 11개를 모두 original detail로 다시 열었다. 표지·blank·opening/title material을
BODY에서 제외한 뒤 `p006`–`p011`만 선택한 것이 맞다.

| Ref | SHA-256 | Bytes | Pixel classification |
| --- | --- | ---: | --- |
| `actual-p-001.jpeg` | `f8e4973d4d4fe282c0bbd670bf538ca67f6a98345e63d9791ff63aed37789ce5` | 190237 | volume 2 cover; excluded |
| `actual-p-002.jpeg` | `7c63161c8fa5e7343bb4abb5e08d7740aa42afb3f959971730e972576d1928b3` | 16827 | blank/frontmatter; excluded |
| `actual-p-003.jpeg` | `9b26a62630bcb174a5b9107177e24b7fb38f700e81582b1f77d87d24dd0d28af` | 191487 | colour `8輪目` opener; excluded conservatively |
| `actual-p-004.jpeg` | `897d9ad1030555cd7629ed65fa33b1be0c70e3f32aeb43b3e818b02ea268c2ef` | 225937 | chapter/title-credit opener; excluded |
| `actual-p-005.jpeg` | `f696728f1d6426438ede1c921a2529e24c6b9bd68c797c301277bee78f263cf9` | 260061 | title-logo opening illustration; excluded |
| `actual-p-006.jpeg` | `54ea32927502dd995b0952d77a64e726f3f03441f84e8f2927cb85677bacd9ad` | 225119 | printed page 4; readable BODY, fantasy/travel-memory context |
| `actual-p-007.jpeg` | `6e572900e5e33c863c26e2f87b5d574f2b38b41e5c7a7f48c4af0108903b41a4` | 221818 | readable BODY, present-day school corridor interaction |
| `actual-p-008.jpeg` | `65a6e3949dd6e08d4b724497b0673d96f3f1acbcd29a890213eac7752dfe938c` | 222683 | printed page 6; readable BODY, corridor/school transition |
| `actual-p-009.jpeg` | `39dd198ac1d80541b03abd9faa1f01c94a070532b0cad4f913e3f7a6722dcfc4` | 256045 | printed page 7; readable BODY, classroom interaction |
| `actual-p-010.jpeg` | `0d37650396712882c4147ef87c7334fc4cbd244c09a981b94d33a771fef26dd5` | 207264 | printed page 8; readable BODY, classroom causal discussion |
| `actual-p-011.jpeg` | `e2b97fdebf7d8b483136615e770e87470bc437f14153e0b62d85b58811c23ed4` | 239113 | printed page 9; readable BODY, classroom discussion continuation |

선택된 6개 파일에 대해 exact root의 정렬된 `sha256sum` 출력을 다시 SHA-256으로
계산한 manifest hash는
`17d9246b0ea04ecd2af200225ca0f20de318f906f3006bf644ccacc30bdccead`이며,
recovery preflight의 `temporarySampleSha256`과 일치한다. 여섯 개별 page hash도
preflight row와 `6/6` 일치한다.

## 교정과 입력 결속

독립 redirect 재검산에서 volume 1의 실제 CID는
`d91ce5bd-eb14-46e5-938c-f27e4a0203c2`인데 recovery research와 ledger에
`d91bd7b7-8ffe-4faf-bb14-e5ea8a6d18df`로 전사된 것을 발견했다. 두 문서의 세
occurrence만 교정했다. 선택된 volume-2 CID·page bytes·preflight row·Art terminal에는
영향이 없다.

| Input after correction | SHA-256 |
| --- | --- |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `recovery-pos45-preflight.csv` | `3231c03511f68373204addd118e1a89c6f8bc1253ea829f2336ae066f29e4fd7` |
| `recovery-pos45-ledger.md` | `9f2a0f9e7e37a50d9142ea89581d76ceb8cc8b2258d8b37aeb9d3762674ae31f` |
| `art-route-recovery-pos45-round-1.md` | `5bd77b2ed231d13345bc246b2bdfb4f0e4a9fadbf7a2248cc61bb092077da5b0` |
| `daybreak-blocker-challenge-qa-chunk-05-round-1.md` | `222da5df9c2c9f7de131c25fca35d4f3253ea59fe00c32cdc5bdbebdbc740f4b` |
| unchanged `art-review/chunk-05/final-art.csv` | `d37620879b365a826cd4e835e63136f2152bdb8a043c616e3a0f9d9daeb87093` |

## Handoff

Position 45는 정적 Art에 한해 기존 Local Codex + exact Gemini 3.7 Flash High
model-panel로 넘길 수 있다. 이 QA는 그 값이나 최종 adjudication을 선행하지 않는다.
`motionImpact`는 이번 표본으로는 계속 `unknown`이다.

```text
reviewedByHuman=false
temporaryImagesCommitted=false
staticGateAttemptable=true
motionGateAttemptable=false
ArtValuesAssigned=false
promotionPerformed=false
```
