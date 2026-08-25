# Batch 005 Art preflight 독립 QA — chunk 04 position 39 recovery round 3

- 대상: frozen position `39`, `work-aa6018249b7fe7e92d95`, `かよちゃんの荷物`
- 검수일 / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- 최종 판정: **REJECTED — SAMPLE_READY 아님**
- 픽셀 최소선: **PASS** — readable BODY `6`, distinct contexts `>=3`
- motion gate: **PASS** — `motionGateAttemptable=false`
- Art 값 판정 / terminal·source·generated·promotion 변경: 없음
- 임시 원본 루트: `/tmp/konocomics-batch005-pos39-recovery-round3`

## 결론

선택된 BookLive 캡처 6장은 정상 브라우저가 최종 렌더링한 판독 가능한
BODY 페이지다. 표지·frontmatter·title-only splash는 없고, 집/전화,
식당/식사, 이동/도시/상점의 세 가지 이상 맥락이 보인다. 원본은 모두
`1850x1937` PNG이며 CSV·ledger·root identity의 선택 hash와 6/6 일치한다.
고립된 pose가 아닌 start-development-impact-resolved endpoint 연속 동작은
없으므로 motion false도 맞다.

그러나 패킷은 다른 판본의 정확한 내용 관계를 입증하지 못했다. frozen
representative는 원판 1권 ISBN `9784812465752`인데, 표본은 신장판 하권
ISBN `9784801959255`의 `baggage22 かよちゃんと遊ぼう`다. 공식 BookLive
설명은 신장판 하권에 `新規エピソードとおまけページ`가 들어간다고 명시한다.
Product와 manifest는 작품·작가·출판사 및 신장판 하권 identity를 결속하지만,
`baggage22`가 원판 1–3권 중 어느 권의 어떤 동일 내용인지 결속하지 않는다.
따라서 다른 판본이 대표 평가 범위와 같은 내용을 담는지 확인해야 한다는
`docs/factors/annotation-guide.md` Art 정책을 충족하지 못한다.

또한 input ledger가 지정한 선행 adjudication 파일 SHA-256이 현재 bytes와
불일치한다. 이 두 문제가 해결되기 전에는 픽셀 수만으로 packet-level
`sample-ready`를 열 수 없다.

## 공식 route와 identity

| 항목 | 독립 확인 | 결과 |
| --- | --- | --- |
| frozen identity | position 39, `work-aa6018249b7fe7e92d95`, canonical `かよちゃんの荷物`, representative ISBN `9784812465752` | pass |
| BookLive product | `https://booklive.jp/product/index/title_id/439092/vol_no/002`; `かよちゃんの荷物 新装版 下`, `雁須磨子`, `竹書房`, ISBN `9784801959255`, `2017-04-27` | pass |
| licensed reader | `https://booklive.jp/bviewer/s/?cid=439092_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F439092%2Fvol_no%2F002` | pass |
| reader manifest | title/author/publisher와 ordered `P0000`–`P0011`; `P0006` 앞에 `baggage22 かよちゃんと遊ぼう` heading | pass |
| exact edition-content bridge | `baggage22`와 원판 1–3권의 exact overlap 미제시; product는 신규 에피소드 포함을 명시 | **fail** |

Product HTML SHA-256
`acbf6c740579971973c82f8347aa14b48e1eaba0a6758e394f594b2459e29c0d`와
manifest response SHA-256
`fcab73d8bc9bb4620505aaefce8bac3f06e69df7ef287a1fa2f007108f2a3a22`는
input ledger와 일치한다. 이는 BookLive 하권 route identity를 증명하지만
원판과의 exact contents overlap을 대신하지 않는다.

## 원본 PNG 8/8 직접 판독

ZIP·contact sheet를 판정 근거로 쓰지 않고 임시 루트의 PNG 8개를 모두 원본
픽셀로 열었다. 모두 `1850x1937`, 8-bit RGB, non-interlaced PNG다.

| 파일 | SHA-256 | 직접 픽셀 판정 | 표본 count |
| --- | --- | --- | ---: |
| `product.png` | `44bad93127fe94d858cb78225f3521b8c5d9233dbca558e130a86bb703f0b8bf` | 공식 하권 상품 화면; route/edition proof only | 0 |
| `reader-p-0006.png` | `7aac7dfc487db3a776d8459a87b24f8266adf6aee486a93eebd9f0252bda1e0d` | 판독 가능한 대사·패널 BODY; 도착/역·실내 맥락 | 1 |
| `reader-p-0007.png` | `a71753bb45c3b06c5df50b9d3e9859654b440e495dfc5894e41303761a420f06` | `baggage22` heading과 함께 서사 패널이 있는 BODY; 식당/식사 | 1 |
| `reader-p-0008.png` | `e050a7718dfb38895979af1ea34d81a15eba677186f106bbcf6094b119e4c450` | 판독 가능한 대사·패널 BODY; 집/전화 | 1 |
| `reader-p-0009.png` | `598261c00c4a8a2d9b2d0e3b89f2dfa96adf2851f98898f435367e92aa52a5dc` | 판독 가능한 대사·패널 BODY; 전화/열차/도시 상점 | 1 |
| `reader-p-0010.png` | `9491eadf38183c01319cb9efe5bf732ca4ee1d473d71b53968931a909acb5813` | 판독 가능한 대사·패널 BODY; 외출/식사/지도 | 1 |
| `reader-p-0011.png` | `699418e32d8757cc9eb742856896cd7827b8c21d21ee9c86d4a3ba33137fa651` | 판독 가능한 동일 P0011 BODY지만 왼쪽 margin에 transient reader hint; 비선택 원본 | 0 |
| `reader-p-0011-clean.png` | `389e177c77f22782da23cd5d3af624a1f73f1989319eb47b930a80a5d79f9ce9` | hint가 사라진 선택 recapture; 꽃/상점/retail BODY | 1 |

선택 6장은 서로 다른 완전한 화면이며 duplicate hash는 없다. P0011 두 장은
페이지 내용이 같고 reader hint 유무만 다르므로 clean recapture만 count한 것이
맞다. P0007의 heading은 title-only 화면이 아니라 같은 페이지의 서사 패널과
대사를 동반하므로 BODY 제외 사유가 아니다.

## 정상 browser-rendered 경로

캡처에는 BookLive reader의 여백·세로 watermark와 P0011 최초 캡처의 표준
조작 hint가 남아 있다. 각 화면은 완전한 viewport PNG이며 scrambled tile,
재조립 contact sheet, crop, raw image reconstruction 결과가 아니다. Packet의
절차도 cover에서 normal left-edge page-turn UI를 사용했다고 기록한다. 따라서
`no tile reconstruction / no bypass / normal browser rendering` 항목은 pass다.

## Hash·page-ref 결속

| Artifact | 선언 SHA-256 | 실제 SHA-256 | 결과 |
| --- | --- | --- | --- |
| recovery preflight CSV | `3a4570dd770f2afef0cef0c4663331aaeff0fd8f72a54e357ef8da0f03d00fd3` | same | pass |
| recovery ledger | `387ebc9e61889f97068f8d889c17cee05fc87c0cc51893c0dfb98a26d22e55c0` | same | pass |
| request | `52e32e8172c42f3ec76e7cd8017e7a74f2a055e9957a5905beee578e666cb8f2` | same | pass |
| input ledger | `32c83c2f9f4a5e008ee21a09105407d7851d6318f29500ecf4994b93b0fbb7e0` | same | pass |
| output ledger | `bca312ad20a3631ec2c570f61112b4ac31d99b14c2f6bf466bbe7110b5132611` | same | pass |
| prior adjudication at declared path | `8fbfabc6f39d01400241c411d75dcb6160c8b61834a071d117a0f8dba805d73e` | `4bfc8cad06750e19d32f41ff58e4e1f9e0229fc9ddf5c0db301ad0c45d9e1018` | **fail** |

CSV의 `pageRefs`, `temporarySampleSha256`, root identity의 `P0006`–`P0011`
hash는 선택 원본 6/6과 일치한다. Manifest ordered refs도 `P0006`–`P0011`이며
CSV의 여섯 reader ref와 같은 순서다. 실패는 image binding이 아니라 input
ledger 내부에서 지정 경로와 선행 adjudication hash가 맞지 않는 결속 오류다.

## Gate 판정

| Gate | 판정 |
| --- | --- |
| canonical work / BookLive lower identity | pass |
| normal browser render, no reconstruction/bypass | pass |
| readable internal BODY pages | pass, `6/6` |
| distinct contexts | pass, `>=3` |
| cover/frontmatter/title-only exclusion | pass |
| motion attemptability | pass, `false` |
| exact original-to-new-edition content mapping | **fail** |
| frozen input hash binding | **fail** |
| final packet state | **REJECTED** |

## 재개방 조건

1. `baggage22 かよちゃんと遊ぼう`가 원판 1–3권 중 어느 권에 실린 동일
   에피소드인지 공식 목차·publisher record·동일 판본 preview로 정확히 결속한다.
2. input ledger의 선행 adjudication path/hash를 현재 canonical bytes에 맞추고,
   그 변경으로 달라지는 input/output/root SHA를 다시 결속한다.
3. 같은 선택 PNG 6장의 hash와 dimensions를 유지한 새 packet을 재-QA한다.

```text
reviewedByHuman=false
artAssigned=false
motionImpactAssigned=false
terminalOrSourceOrGeneratedOrPromotionMutation=false
temporaryImagesCommitted=false
finalState=REJECTED
```
