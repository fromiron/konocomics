# 슬라이스 1 샘플 주석 독립 판정 요청

## 역할

당신은 konocomics의 독립 주석 검토자다. 파일을 수정하지 말고, 다른 검토자의 결론을 보지 않은 상태에서 아래 동일 증거만 심사한다. 이 검토는 사용자가 부재 중 사람 판단 게이트를 대체하도록 명시적으로 승인한 모델 패널의 한 표다. 모델 검토는 사람 검수를 뜻하지 않으며, 승인돼도 `reviewedByHuman=false`는 유지된다.

## 판정 대상

슬라이스 1의 11작품 샘플:

1. ダンジョン飯
2. キングダム
3. 鋼の錬金術師
4. DEATH NOTE
5. SPY×FAMILY
6. 葬送のフリーレン
7. チェンソーマン
8. ブルーロック
9. MONSTER
10. よつばと！
11. BLAME!

## 단일 증거 번들

저장소 루트 `/home/bell/Toys/konocomics`에서 다음 파일을 모두 읽는다.

- `docs/factors/factor-dictionary.md` — 팩터 정의의 단일 진실 원천
- `docs/planning/02-product-spec.md` §5 — Work/Volume 및 evidence 계약
- `data/source/works.csv`
- `data/source/aliases.csv`
- `data/source/volumes.csv`
- `data/source/themes.csv`
- `data/source/factors.csv`
- `data/source/evidence/evidence.csv`
- `data/source/evidence/seed-annotations.md`

번들 SHA-256:

```text
0612a10e654c5d973154b1a2113ee0b11128b51ec24e8f3e7ccd142f53c5af07  data/source/works.csv
6a018c9732688a6dc101ad28715242aa58115f84b11f34f9591db1b0d1fef21e  data/source/aliases.csv
2e38a0c246058648e28a9eca12b2beadd4e737263b8c56b0e30d8f7f3b04f114  data/source/volumes.csv
ebf9e159017b6e2bec5acc6a9d502dca3157093cb2da79724b312f1941a9efcb  data/source/themes.csv
fa52c6bfa5b9a3e3b7f912dc23db2bcfe72175519794539da59e6624175a4094  data/source/factors.csv
50afa6fd014ae68ed1170f1033084e307119fadeb476036628443f74b0b40390  data/source/evidence/evidence.csv
a8fe7324b255ddd2600e00c6b20ca002aafe8a6a3d5f19681d85b64a58533e58  data/source/evidence/seed-annotations.md
a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be  docs/factors/factor-dictionary.md
```

공식 URL은 필요할 때 원문을 확인해도 된다. 비공식 위키·검색 스니펫으로 공식 근거를 덮어쓰지 않는다.

## 검토 기준

각 작품에 대해 다음을 모두 확인한다.

1. 대표 1권 ISBN 체크섬·판형·발매일, 작가·출판사·연재 상태가 근거와 맞는가.
2. `factorScope=entry_1_3_volumes`를 지키며 후반 전개를 섞지 않았는가.
3. Genre와 Theme가 사전의 허용 목록·중심성 정의를 따르는가.
4. 17개 Axis가 0/2/4 기준과 일치하고, 1·3은 경계값으로 납득 가능한가.
5. 관찰 근거가 부족하면 0이 아니라 `unknown`을 사용했는가.
6. `motionImpact`에서 동적 장면이 없을 때만 `notApplicable`을 쓰며, 줄거리나 표지만으로 확정하지 않았는가.
7. 서로 혼동하기 쉬운 `darkness`/`mentalStress`, Theme/Genre, `progression`/`characterArcWeight`가 분리됐는가.
8. 11작품이 빠름↔느림, 밝음↔어두움, 전략↔직접 행동, 단독↔고정 파티↔군상, 현실적↔스타일화 대비를 샘플로 제공하는가.
9. 모델 provenance와 불확실성을 정직하게 보존했는가. `reviewedByHuman=false` 자체는 결함이 아니다.

현재 `catalog:validate`는 모든 작품을 `unreviewed`로 두었기 때문에 정확히 작품당 `UNREVIEWED_ELIGIBILITY` 1건과 `EVIDENCE_NOT_HUMAN_REVIEWED` 경고 1건을 내도록 설계되어 있다. 패널 만장일치 전의 이 의도된 오류·경고를 데이터 결함으로 판정하지 않는다. 그 밖의 오류가 있으면 반드시 지적한다.

## 엄격한 판정 규칙

- `GO`: 11작품 모두 슬라이스 1 샘플·초기 anchor/recommendation 후보로 사용할 만큼 근거가 충분하며, 수정 필수인 메타데이터·Theme·Axis가 없다.
- `REVISE`: 한 항목이라도 공식 근거와 충돌하거나, known 값이 근거 부족이거나, 사전 기준과 2단계 이상 어긋나거나, 샘플 대비가 치명적으로 비어 있다. 정확한 `workId.field`, 현재값, 제안값, 근거를 적는다.
- `NO-GO`: 증거 번들 또는 주석 방법 자체가 판정 불가능할 정도로 신뢰할 수 없다.

사소한 confidence ±0.05 취향 차이나 1단계 경계 이견만으로 REVISE하지 않는다. 반대로 만장일치를 만들기 위해 불확실성을 숨기지 않는다.

## 출력 형식

```text
VERDICT: GO | REVISE | NO-GO

WORK CHECKS:
- <workId>: PASS | REVISE — 한 문장 근거

BLOCKERS:
- none
또는
- <workId.field>: <현재값> -> <제안값> — <공식/사전 근거>

PROVENANCE CHECK: PASS | FAIL — 한 문장
COVERAGE CHECK: PASS | FAIL — 한 문장
```

최종 첫 줄은 반드시 위의 단일 verdict 중 하나여야 한다.
