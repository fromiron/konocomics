# Batch 005 text recovery independent QA — position 08 round 2

## 범위와 attestation

- reviewer: Daybreak independent recovery QA
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- frozen position: `8`
- workId: `work-0ede6921b81169dc2dda`
- canonicalTitle: `不滅のあなたへ`
- evaluatedRange: `entry_1_3_volumes`
- repository HEAD: `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- round-2 recovery proposal SHA-256: `76f5261b3a380773fd2306d8a1665696e621bdb7d0b20b19b66d5cd0c54c9877`
- round-1 QA SHA-256: `c17ef425fa5fc6f37464ae3c2b30aa7328212bb10807a1ee535a1751be2b2a63`
- prior terminal Text SHA-256: `9937a3c0dee8325b3dcd550597f594d37750a6eb3be6f6d6a1cb8e746dac295c`

제안의 결론을 상속하지 않고 두 Tone 셀을 각각 판정했다. 진입 범위는
1–3권으로 고정했고, 후속 권·애니메이션·장르·작품의 넓은 전제는 수치
근거로 사용하지 않았다. 기존 Narrative `4/6`, Tone `3/7`, Art `3/4`와
round-1에서 닫힌 셀은 재심하지 않았다.

## 공식 자료 재개방

아래 HTTP SHA-256은 이번 검토에서 `Mozilla/5.0` user agent로 받은 현재
응답 바이트의 해시다. C-station은 같은 권의 권리자 설명을 재게시하므로
별도 편집 증거로 중복 계산하지 않았다.

| 범위 | 공식 URL | 판/날짜 | response SHA-256 | 제한된 관찰 |
| --- | --- | --- | --- | --- |
| volume 1 | https://www.kodansha.co.jp/comic/products/0000019901 | paper `2017-01-17` | `f3e5ef0cd91e02f8c6b73c3eff612e8b42a4d22fc1ed4f8c394257fa63899dbc` | 구체가 소년을 만나고 헤어지는 도입이다. volume 3의 고정 관계를 이 권으로 소급하지 않았다. |
| volume 1 C-station | https://cstation.kodansha.co.jp/mangaip/database/0000019901 | same edition | `125f2e9d7eb0a6680336dcf4f9be87dd9bac241940dea6ed33c8f7612f71f67e` | 동일한 권리자 설명의 일치 확인만 했다. |
| volume 2 | https://www.kodansha.co.jp/comic/products/0000019946 | paper `2017-03-17` | `b7f590c9dd050e3cfd2decf095bff3e51333bbd2e6f9b1b76f7268b3d5ba95f5` | March·Parona·Yanome 진입 arc이며 volume 3의 Gugu 관계와 다른 배치다. |
| volume 2 C-station | https://cstation.kodansha.co.jp/mangaip/database/0000019946 | same edition | `5b078997f724e068f2af72672e55d237e4d908695c1574c58b9da9ea94d18cf0` | 동일 entry arc의 권리자 보강 설명이다. |
| volume 3 | https://www.kodansha.co.jp/comic/products/0000020013 | paper `2017-06-16`; ISBN `9784063959550` | `85bfc6dee1e7efb6b7d2080d404b8e475d9e7c52f767208dbe5585646d84b47a` | Gugu가 자신을 괴물로 낮춰 부르고 다른 누군가가 되기를 원한다. Fushi를 동생처럼 대하고 Booze의 집에서 생활하는 volume-3 관계도 명시한다. |
| volume 3 C-station | https://cstation.kodansha.co.jp/mangaip/database/0000020013 | page undated; same paper edition | `21134444a0ce90c047aa6e832c41fb31155704a5aa6fb66bb5140ef3a6f3a0bf` | 같은 volume-3 설명과 작품·저자·게재지 identity를 확인했다. |

### exact volume-3 trial / episode 14

- stable route: https://www.kodansha.co.jp/comic/products/0000020013/trial
- observed reader route:
  `https://www.kodansha.co.jp/comic/products/0000020013/trial/reader?cid=08802ad54d87b5df01bdb89b72294cd47b83ca61c1b3b132b721c293c7194b59`
- observed reader title: `『不滅のあなたへ（３）』 試し読み｜講談社`
- observed bounded pages: cover, title, table of contents, then `#14 変わりたい少年`
  pages `3–8`

리더를 이미지로 다시 열어 페이지를 순서대로 확인했다. 3쪽은 Gugu의
자기 정체성 질문으로 시작하고, 4–8쪽은 그의 일·시장·형·주변 인물·음식과
관련된 과거 도입을 보여 준다. 이는 제안서가 적은 “Gugu와 Fushi가 형제로
대화하고 함께 가사·식사를 반복한다”는 장면이 아니다. 해당 6쪽은 Fushi와
Gugu의 동거 장면이 아니라 Gugu의 과거다. 임시 스크린샷이나 보호된 이미지
바이트는 저장소에 남기지 않았다.

## 셀별 독립 판정

| axis | proposal | QA | confidence | 제한된 근거 |
| --- | --- | --- | ---: | --- |
| `relationshipStructure` | `known=2` | **REJECT; retain `unknown`** | — | Dictionary의 2는 고정 파티 또는 반복 핵심 조연 구조를 요구한다. 1–2권은 서로 다른 동행 arc이고, volume-3 상품 설명 하나가 Fushi–Gugu 관계를 명시하더라도 exact trial의 새 장면은 그 관계의 반복을 보여 주지 않는다. 제안의 핵심 신규 근거가 인물·시점 오인이므로 지속 구조를 확정할 수 없다. |
| `mentalStress` | `known=2` | **ACCEPT** | `0.72` | 14화 3쪽의 Gugu 자기 정체성 질문과, 같은 volume의 공식 설명에 나타난 부상 후 자기비하 및 다른 사람이 되고 싶은 욕구가 시간적으로 이어진다. 죽음·통증·`darkness=2`가 아니라 반복되는 자아 불만과 심리 압박을 근거로 하므로 혼합 긴장·답답함의 2에 해당한다. entry 범위 전체의 붕괴·지속 불안을 입증하지 않으므로 4는 아니다. |

`mentalStress`는 기존 `characterArcWeight=2`와 같은 숫자를 복사한 것이
아니다. 전자는 자기 수용 실패에서 오는 체감 압박, 후자는 인물 변화의
서사 비중이다. 반대로 관계의 온기나 형제 호칭은
`relationshipStructure`의 고정성 증거로 자동 변환하지 않았다.

## terminal patch

거절된 관계 행은 그대로 두고, 승인된 한 행만 변경했다.

```text
work-0ede6921b81169dc2dda,mentalStress,unknown,,,ev-batch-005-a-work-0ede6921b81169dc2dda
→ work-0ede6921b81169dc2dda,mentalStress,known,2,0.72,ev-batch-005-a-work-0ede6921b81169dc2dda
```

Genre, Theme, Art, source/provenance, generated catalog, registry, blocker,
eligibility, promotion은 변경하지 않았다.

## 해시·스키마 감사

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | 170 | `9937a3c0dee8325b3dcd550597f594d37750a6eb3be6f6d6a1cb8e746dac295c` | `c1f666d6c876a8b9309a30c41c10793592f39d99bf027f7314c0f3baf002c84d` |
| `adjudication/genres-final-chunk-01.csv` | 10 | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | unchanged |
| `adjudication/themes-final-chunk-01.csv` | 11 | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | unchanged |
| `art-review/chunk-01/final-art.csv` | 40 | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` | unchanged |

Text matrix는 header와 행 순서를 보존한 정확한 `10 × 17 = 170`행이다.
모든 work가 Factor Dictionary 순서의 17축을 가지며, 상태 수는
`known=49`, `unknown=121`이다. unknown 행의 값·confidence 공란과 기존
work-bound evidence ID도 유지됐다.

## gate 재계산

운영 기준은 Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`,
Art `>=2/4`다.

| scope | Genre | Theme | Narrative | Tone | Art | all non-Art text gates | all gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| position 8 before | 1/1 | 1/1 | 4/6 | 3/7 | 3/4 | fail: T+2 | fail |
| position 8 after | 1/1 | 1/1 | 4/6 | 4/7 | 3/4 | fail: T+1 | fail |
| chunk 01 after | 9/10 | 8/10 | 3/10 | 1/10 | 3/10 | 1/10 | 1/10 |

승인 셀은 Tone 결손을 하나 줄이지만 position 8은 여전히 promotion
coverage를 통과하지 않는다. 관계 행을 gate 충족용으로 제조하지 않았고,
이 검토는 blocker 또는 promotion mutation을 승인하지 않는다.

## 검증

- schema/order audit: `PASS — 170 rows, 10 works, 17 dictionary-ordered axes per work`
- exact terminal mutation: `PASS — one accepted position-8 row only`
- position 8 gates: `G 1/1`, `Th 1/1`, `N 4/6`, `T 4/7`, `A 3/4`, all gates `FAIL`
- chunk 01 all-gate work: `work-0cf463005cc77eeded8e` only
- whitespace audit on terminal CSV and this report: `PASS`
