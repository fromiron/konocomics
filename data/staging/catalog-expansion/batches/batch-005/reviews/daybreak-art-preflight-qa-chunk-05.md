# Batch 005 Art preflight 독립 QA — chunk 05

- 검수 범위: frozen positions 41–50
- 검수일: `2026-08-25`
- reviewedByHuman: `false`
- 입력 `preflight.csv` SHA-256: `925587ccdfe9dc9b97880aa07a42541faac5d7930bc0a4206f8bf1ebf3d17545`
- batch manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- 판정: **PASS 3 / FAIL 7 — chunk 05를 현재 상태로 downstream Art panel에 제공하면 안 됨**

## 검수 방법과 공통 결과

`docs/factors/annotation-guide.md`와 `docs/catalog-expansion/01-promotion-method.md`의 Art gate를 적용했다. `pageRefs`가 가리키는 임시 원본 30개를 `/tmp/konocomics-batch005-art-chunk05`에서 원본 해상도로 열었고 SHA-256을 다시 계산했다. 기록된 30개 개별 해시는 현재 파일 바이트와 모두 일치하며, 46·47·50의 기록된 set hash도 각 절대 경로를 포함한 `sha256sum` 출력의 SHA-256과 일치한다. 해시 일치는 픽셀 판독 가능성이나 BODY 자격을 보증하지 않는다.

공식 1–3권 경로도 다시 열어 제목·권수·작가를 확인했다. frozen Work/대표 ISBN과 공식 1권 연결은 10작품 모두 유지되고, 기록된 1–3권 경로의 작품·권수 연결도 확인된다. 공식 페이지 제목의 장식용 `『』`, 전각 `！！`·`／`는 canonical title에 유입되지 않았다.

픽셀 판독 결과는 다음과 같다.

- 41은 `reader-trg-05`가 순수 chapter/title opener라 BODY가 5쪽뿐이다.
- 43의 6개 원본은 모두 tile-scrambled 상태라 한 쪽도 판독 가능한 페이지가 아니다.
- 46은 05–10 중 opening montage·chapter/title splash가 포함돼 BODY 6쪽을 충족하지 않는다.
- 47은 05가 타 작품 광고이고 06이 작품 title page라 BODY가 4쪽뿐이며 기록된 `disaster or landscape` 맥락도 표본에 없다.
- 50은 여섯 쪽 자체는 유효하지만 실제 맥락은 역사 전투/부상 장면과 현대 karaoke/실내 장면의 2개다. 기록된 `village`·`mythic` 맥락은 해당 refs에서 확인되지 않는다.
- 42·48의 보존 원본은 난독화 또는 빈 렌더이며 6쪽 미만이라 `unknown-ready`가 정확하다.
- 44·49 공식 reader를 재시도하면 metadata와 각각 52·59개의 commercial `content.js` page ref가 반환된다. 그러나 직접 취득되는 `M_L.jpg` 바이트는 tile-scrambled 상태이고 decoded BODY 원본이 보존되지 않았다. Art 상태는 계속 `unknown-ready`여야 하지만 현재 실패 사유는 사실에 맞게 고쳐야 한다.

## 작품별 판정

| Pos | Work | 현재 상태 | 판정 | 독립 확인과 필요한 교정 |
| --: | --- | --- | --- | --- |
| 41 | `work-c50ea94bb66f72c679a2` 機械仕掛けの愛 | sample-ready 6/3 | **FAIL** | `reader-trg-05`는 `1 ペットロボ`만 제시하는 순수 title opener다. 이를 제외하고 BODY인 `reader-trg-06`–`11`로 교체하면 amusement park, robot shop, home의 3맥락과 6쪽을 충족한다. 교정 해시는 아래에 고정한다. motion은 exact start-development-impact-resolved sequence가 없어 `false` 유지. |
| 42 | `work-c7e065f61bb7a176ee56` 臨死!!江古田ちゃん | unknown-ready 0/0 | **PASS** | 공식 1권 및 공식 catalog의 2·3권 연결을 확인했다. 보존된 5개 렌더는 난독화/빈 페이지이고 판독 가능한 BODY 6쪽이 아니다. `0/0`, static false, motion false 종결이 정확하다. |
| 43 | `work-c8243866b7c8a6d9a2f8` 町でうわさの天狗の子 | sample-ready 6/3 | **FAIL** | `reader-page-0006`–`0011`의 개별 SHA는 맞지만 여섯 파일 모두 tile-scrambled다. `accessible`·6/3·pageRefs·set hash·sample-ready를 제거하고 `preview-obfuscated`, `0/0`, static false, motion false, `unknown-ready`로 닫아야 한다. decoded 원본 6쪽을 새로 보존하고 해시를 다시 만들기 전에는 재개방 금지. |
| 44 | `work-db4a0ec451d7f4ffd8b8` 万福児 | unknown-ready 0/0 | **FAIL** | 1–3권 JDCN bridge는 정확하다. 현재 reader metadata API는 정상 응답하고 commercial `content.js`에는 52개 page ref가 있으므로 `reader-metadata-failed`와 `ERR_NETWORK_CHANGED` 종결 사유는 재현되지 않는다. 직접 page bytes는 tile-scrambled이고 decoded BODY 표본은 없으므로 상태는 `preview-obfuscated`, `0/0`, `unknown-ready`로 유지하되 limitation을 이 사실로 교체해야 한다. |
| 45 | `work-e658d3aee2e33c17aa38` スピリットサークル | unknown-ready 0/0 | **PASS** | 少年画報社 상품 7155–7157이 정확히 1–3권과 작가를 연결한다. product-linked 내부 preview가 보존되지 않았고 대체 표본도 없으므로 `0/0` nonblocking `unknown-ready`가 정확하다. |
| 46 | `work-e906b3eaa9ef9eafe23c` トリリオンゲーム | sample-ready 6/3 | **FAIL** | 05–10에는 opening recap/montage와 chapter/title splash가 여러 장 포함된다. BODY인 `reader-trg-11`–`16`으로 전부 교체하면 coastal luxury residence와 urban flashback/assault의 2맥락·6쪽을 충족한다. 교정 해시와 set hash는 아래와 같다. motion은 완전한 시작·전개·impact·resolved endpoint가 고정되지 않아 `false` 유지. |
| 47 | `work-f31a42ea4ad724acefa5` デッドデッドデーモンズデデデデデストラクション | sample-ready 6/3 | **FAIL** | 05는 다른 작품 광고, 06은 title page이며 `disaster or landscape`도 05–10에 없다. BODY인 07–12로 교체하면 household, street/bicycle, school의 3맥락·6쪽을 충족한다. 교정 해시와 set hash는 아래와 같다. motion은 연속 sequence의 완결 참조가 없어 `false` 유지. |
| 48 | `work-f4bfc29a5e0a9b5148d0` 月に吠えらんねえ | unknown-ready 0/0 | **PASS** | 講談社 공식 products 0000047330·7363·7407이 1–3권을 정확히 연결한다. 보존된 5개 렌더는 난독화/빈 페이지이고 6쪽 미만이므로 `0/0`, static false, motion false가 정확하다. |
| 49 | `work-fb89f119251610cf1648` 1/11 じゅういちぶんのいち | unknown-ready 0/0 | **FAIL** | 1–3권 JDCN bridge는 정확하다. reader metadata와 commercial `content.js`에는 59개 page ref가 있어 `only three commercial-page assets`는 사실이 아니다. 다만 직접 page bytes는 tile-scrambled이고 decoded BODY 표본은 없으므로 상태는 `preview-obfuscated`, `0/0`, `unknown-ready`로 유지하고 limitation만 교체해야 한다. |
| 50 | `work-fe35a5f01946f5153eb4` シュトヘル | sample-ready 6/3 | **FAIL** | 09–14는 모두 판독 가능한 BODY이고 개별·set 해시도 일치한다. 그러나 실제 장면은 09–11의 역사 전투/부상·구출과 12–14의 현대 karaoke/실내 대화, 총 2맥락이다. `distinctContextCount=2`로 고치고 `village or human`, `mythic or landscape` 문구를 제거하면 sample-ready를 유지할 수 있다. motion false는 보수적으로 유지 가능하다. |

## 정확한 표본 교정값

### Position 41

`pageRefs`와 `temporarySampleSha256`를 같은 다음 문자열로 교체한다.

```text
reader-trg-06=fbc9f9dc270b66a435a526d84dbeb93a88dd9f0389ec3412a7803f8fd77928a1;reader-trg-07=ccafd38278befc7684b8bcf887db077875e9ddfd05fa64e225f5bd2acd8106a8;reader-trg-08=ba432d5308b1d386cef89e61aa47d94c1d85e3688e18a0090df9e950405336ee;reader-trg-09=367bc7191aa05c9db2f7016206bdf326379a1815a18c6324eceb97de6ab06d4b;reader-trg-10=4dcc25a66e680c854f9d8b8ce5b5252ce86d6bb93d5f59e7e0d066aaeb1cf0da;reader-trg-11=4c38d6f4f203ed63bedb03d08f93a39824e88b6a1be81dd89f5c4ed0f6b2c8ed
```

### Position 46

```text
reader-trg-11=e7a9995fd19e8e95034c0b97497121d0e9120800dd0d424ebac275fd4d7362bf;reader-trg-12=afafdd292b4379e79eb5857cb2c7c6155fd17b01c4ecbe8190263a9d207b92ae;reader-trg-13=6425fe2b8fa114f43bede76715763dedbeca4eb96f230c37ccc9889ba8011804;reader-trg-14=2e0c1353ddb571b74a3c4afe2720679c2f05e54012481f8e52f4fd2f83cf5563;reader-trg-15=6f63a1bd318c5ecd03a03ce174ddae80b1a19fba8177fa7dfecd1b869cbae533;reader-trg-16=e10b2c4292305dd39f730803ed3d9c1014f3fe5035ec16dd43a8408a5aa189a9
temporarySampleSetSha256=1ccbf4ed045983b49a3cbe7c610b6182322fa0ec9b7f22438afc9ab54c8b47c6
```

### Position 47

```text
reader-trg-07=8c052552e3ed87a25d6e70a518df1cdbbf7461ab5da7bddfe77db0088de330f5;reader-trg-08=26ec82bc57c28aedf59d2b25c78b5e02f6d1e268372ea10a650c53c2024aecfd;reader-trg-09=1f5f1c6e3a8a83d5374939a66e2b2647246fbb2e2786634cfeddb36a84e186ba;reader-trg-10=b21b3f8293c663deb99f2adbfe1b708495091b503e3692c58687211b9a42b741;reader-trg-11=ca323453185022b57924b89803891471b9fa4c81512ddfebe6127bdae3395360;reader-trg-12=c719d47840525bddb65069b5fa6293f658e853eca6e68fd20a9efd829d0e44fa
temporarySampleSetSha256=d2b1a145193601ac8f4a1e9e27aa44af4961e8b13ecc78f86e2a575b88ca89ca
```

## 종결 조건

41·46·47의 BODY 교체, 43의 unknown 종결, 44·49의 실제 난독화 사유 반영, 50의 맥락 교정 뒤 `preflight.csv`·ledger·review bundle의 SHA 결속을 다시 만든다. 그 뒤 새 원본 픽셀로 독립 재-QA를 통과해야 한다. 현재 FAIL 항목에서 Art 값을 생성하거나 model quorum으로 넘겨서는 안 된다.
