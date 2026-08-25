# Batch 005 Art preflight 독립 QA — chunk 04 position 35 recovery

- 대상: frozen position `35`, `work-8a7846af8ead1797e6a2`, `ハイスコアガール`
- 검수일 / round-2 live 재검증일: `2026-08-25`
- reviewedByHuman: `false`
- 최종 판정: **PASS — SAMPLE_READY**
- 픽셀 최소선: **PASS** — readable BODY `6`, distinct contexts `>=2`
- 공식 route·판본 bridge: **PASS**
- normal browser render / no bypass·tile reconstruction: **PASS**
- exact official URL/ref/hash/file mapping: **PASS, `6/6`**
- motion gate: **PASS** — 이 recovery는 `motionGateAttemptable=false`
- Art 값 판정 / terminal·source·generated·promotion 변경: 없음

## 결론

Round 2가 이전 QA에서 찾은 세 adjacent ref/hash reversal을 같은 공식 bytes로
정확히 교정했다. 현재 packet의 `his02-p002.jpg`–`p007.jpg`는 각각 공식
Square Enix `/img/002.jpg`–`007.jpg`와 `6/6` byte-identical이고, recovery
CSV·ledger·request·input/output ledger·correction ledger·root identity의 모든
종속 SHA도 현재 bytes와 일치한다.

여섯 원본을 다시 original detail로 열어 전부 `870x1236`의 판독 가능한 내부
BODY 페이지임을 확인했다. 표지·chapter opener·frontmatter는 없고,
street/shop social interaction과 cabinet/gameplay 분석이라는 최소 두 맥락을
보존한다. 일부 페이지가 두 맥락을 함께 담지만 전체 표본의 두 context는
명확하다. 선택 표본에는 bounded start→development→impact→resolved sequence가
없으므로 이 recovery의 motion 미주장도 맞다. 따라서 정적 Art model-panel에
넘길 수 있는 `SAMPLE_READY`다. 이 QA는 Art 값을 판정하지 않는다.

## Frozen identity와 공식 판본 bridge

| 검증 항목 | 독립 재검증 | 결과 |
| --- | --- | --- |
| frozen identity | position 35, `work-8a7846af8ead1797e6a2`, `ハイスコアガール` | pass |
| repository representative | standard volume 1, ISBN `9784757535121`, creator `押切蓮介`, publisher `スクウェア・エニックス` | pass |
| official series identity | title `ハイスコアガール`, author `押切蓮介` | pass |
| official preview links | series HTML이 `/his01/`, `/his02/`, `/his03/`를 직접 링크 | pass |
| standard volume 1 | `ハイスコアガール 1巻`, cover `/top/shoei/9784757535121.jpg` | pass |
| standard volume 2 | `ハイスコアガール 2巻`, cover `/top/shoei/9784757536425.jpg` | pass |
| standard volume 3 | `ハイスコアガール 3巻`, cover `/top/shoei/9784757538412.jpg` | pass |
| historical detail paths | 세 slash URL 모두 같은 404 body; 판본 근거로 사용하지 않음 | pass |
| reissue rejection | CONTINUE 1–3권은 별도 entry이며 recovery 표본에 사용되지 않음 | pass |

현재 live 응답 SHA-256은 packet 선언과 일치한다.

| Official route | HTTP | SHA-256 |
| --- | ---: | --- |
| series page | 200 | `7c43d81e47e206c40c92c9cca2e3aaa612d6a14a9cfd25f559425d4f7567b9c6` |
| 第2話 `/his02/` | 200 | `9d96b2366381370988e53cfded2fe8231ec5e2c23886e97e45a50eac5dbdae05` |
| 第3話 `/his03/` | 200 | `2a51ee08e66486af1311b6dd05364fdcfca7a02ec87bde9773a78ab1bd42c490` |
| 각 표준 ISBN detail slash URL | 404 | `44e79f2b4b84f6322582feacc7daece661a91f3c3f1fe39ce05d83bb4da2e1ee` |

## 정상 browser-rendered 경로

제2화 HTML은 title, `fr_pagenum=8`, `fr_indexpage="left"`, 상대 `img/`
resource를 선언한다. 공용 Fotorama script는 정상 route에서 single-page
`<img>`와 desktop spread `background-image:url(img/NNN.jpg)`를 생성한다.
Packet 여섯 파일은 현재 이 public first-party JPEG와 번호별로 byte-identical한
완전한 non-interlaced sRGB JPEG다. scrambled tile, crop, 합성, contact sheet,
raw tile reconstruction 또는 보호 우회 근거는 없다.

## Round-2 exact mapping 재검증

| Packet/ref | exact official URL | SHA-256 | live URL ↔ file |
| --- | --- | --- | --- |
| `his02-p002` / `reader-his02-p002` | `/his02/img/002.jpg` | `0161e58893499257746ad7bd1cba7e6e07d7591711e3edd406044e176c3c4966` | pass |
| `his02-p003` / `reader-his02-p003` | `/his02/img/003.jpg` | `a5c3d1c83994934c193101fd0d10d676a462a48d28bda4421b65069349da803f` | pass |
| `his02-p004` / `reader-his02-p004` | `/his02/img/004.jpg` | `6ec72f8e4fcb9c0ab0ffec6b2f0b13176210e71b3b355486e01a61c95155d487` | pass |
| `his02-p005` / `reader-his02-p005` | `/his02/img/005.jpg` | `112acb66d9bf6b5f8f9842982ced40fc5f90836127522d98312e8716927f61b5` | pass |
| `his02-p006` / `reader-his02-p006` | `/his02/img/006.jpg` | `44de76624bfaf4c4421794c8d670693d2ec5f8c1a2d4fe21c8861a09d26fbb9f` | pass |
| `his02-p007` / `reader-his02-p007` | `/his02/img/007.jpg` | `aee2737299e01a69175e69d013b95f82589aac058cd67f8ace6cca05dbd72de2` | pass |

CSV의 `pageRefs`와 `temporarySampleSha256`, recovery ledger의 exact URL table,
input/output/correction ledger의 map, root identity의 `readerCaptureSha256`가 모두
위 mapping과 동일하다.

## 6/6 원본 픽셀 직접 판독

ZIP·contact sheet가 아니라 review packet의 모든 JPEG를 `original` detail로
다시 열었다. 모두 `870x1236`, 유효 JPEG, sRGB, non-interlaced다.

| Exact ref | 원본 픽셀 판정 | 표본 count |
| --- | --- | ---: |
| `reader-his02-p002` | readable BODY; 상점 외부에서 인물·게임 취향을 설정하는 social scene | 1 |
| `reader-his02-p003` | readable BODY; cabinet/button gameplay와 두 인물의 상호작용 | 1 |
| `reader-his02-p004` | readable BODY; 상점 외부 social interaction과 다음 gameplay 동기 | 1 |
| `reader-his02-p005` | readable BODY; button layout·kick·control 분석 중심 gameplay | 1 |
| `reader-his02-p006` | readable BODY; shop counter의 cabinet repair와 대화 | 1 |
| `reader-his02-p007` | readable BODY; 상점 외부의 game-centered social interaction | 1 |

현재 ledger의 `p002`–`p004` street/social, `p005`–`p007` arcade/gameplay grouping은
dominant context 기준으로 성립한다. `p003`과 `p007`처럼 두 요소를 함께 담는
페이지가 있어도, 외부 social/shop interaction과 cabinet/control gameplay라는
서로 다른 두 맥락이 6장 전체에 반복되어 요구치 `>=2`를 충족한다.

## Motion 경계

선택 여섯 장에는 gameplay 설명과 자세 도해가 있으나 하나의 동작에 대한
start→development→impact→resolved endpoint가 연속해서 결속된 표본은 없다.
따라서 이 recovery의 `motionGateAttemptable=false`는 맞다. 기존 제1화
motion-only evidence와 terminal `motionImpact=4`는 이 QA 범위 밖이며 재판정하지
않았다.

## Repository binding 재검산

| Artifact | SHA-256 | 결과 |
| --- | --- | --- |
| recovery preflight CSV | `976c4a6dc54470b6fdfc56dd23dd16a8161200f9599a0d88a940e915a13db79b` | match |
| recovery ledger | `967fa34a1babc9f4ae987d386973db4084bb74bebaf7ed918d537e91856d8d51` | match |
| correction ledger | `1fc6295023d9b22a5131d8e9dffd66047cdf5767e485c8b37fcd88de9ed15178` | match |
| request | `992167e8773d261ffdd83d587ae595754134fdd659ccdd346916de71def2dab7` | match |
| input ledger | `c631d0a5fe7b350b51d8e2b27c7fb78905ee73fabecb7c8cf2b69e39708ab57a` | match |
| output ledger | `ab8a4728df2f9266cd188ce053f0214befdfffff1bab3788d2b6a594a2834d59` | match |
| root identity current bytes | `d54f35f6a1038c5c921f895522fe1be6cade3a0ddf23645929655a0bfa82c733` | recorded by this QA |
| batch manifest | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | match |
| payload ledger | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | match |
| frozen work set | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | match |
| route registry | `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28` | match |
| prior chunk preflight | `a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7` | match |

`pnpm --silent catalog:promotion:batch-packet --check --batch-id batch-005`는
50 works와 candidate SHA
`8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`로
통과했다. 이 확인은 promotion을 수행하지 않았다.

## Gate 판정

| Gate | 판정 |
| --- | --- |
| canonical work / standard vols. 1–3 / 第2話 bridge | pass |
| normal browser render, no reconstruction/bypass | pass |
| exact official URL/ref/hash/file mapping | pass, `6/6` |
| readable internal BODY pages | pass, `6/6` |
| distinct contexts | pass, `>=2` |
| cover/frontmatter exclusion | pass |
| motion non-assertion | pass, `false` |
| dependent repository/root bindings | pass |
| final packet state | **PASS — SAMPLE_READY** |

```text
reviewedByHuman=false
artAssigned=false
motionImpactAssigned=false
terminalOrSourceOrGeneratedOrPromotionMutation=false
temporaryImagesCommitted=false
finalState=SAMPLE_READY
round2ExactMapping=PASS
```
