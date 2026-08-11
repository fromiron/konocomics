# G1 Recommendation Context 조정 기록

## 시장 스냅샷

- 기준 시점: 2026-08-11 (Asia/Tokyo)
- 대상: recommendation eligible G1 후보 50작품의 일본어 종이 표준판 대표 1권
- 출처: 대표 1권 ISBN과 일치하는 Rakuten Books 공개 상품 상세 또는 exact-ISBN 공개 검색 결과에 표시된 사용자 평가와 평가 건수
- API 한계: `.env` 자격 증명을 노출하지 않는 단일 스모크에서 Rakuten Books API가 `503 Authentication service error`를 반환했다. 반복 호출하지 않았고 공개 화면과 ISBN을 대조한 정적 스냅샷만 사용했다.
- 49행은 양의 `reviewCount`와 화면의 두 자리 `reviewAverage`를 기록했다. `beyond-the-clouds`는 대표 1권 상세에서 리뷰 0건을 확인해 `reviewAverage` 공란, `reviewCount=0`으로 기록했다. 관측 평균 합은 `214.03`, 평가 건수 합은 `10080`이다.
- `noragami-stray-god`는 exact-ISBN 검색 결과에서 종이 표준판 1권 `9784063712940`과 함께 표시된 `3.82 / 76`만 사용했다. 다른 판본인 Kobo 값은 사용하지 않았다.

`catalogAverageRating`은 관측된 작품별 평균을 동일 가중으로 산술평균한 `4.367959183673469`다.

```text
214.03 / 49 = 4.367959183673469
```

평가 건수 가중 평균은 사용하지 않는다. Bayesian tie-break가 후보별 `reviewCount`를 이미 반영하므로 catalog prior까지 건수 가중하면 리뷰가 많은 작품을 이중 가중한다. 리뷰 0건 작품은 명시적 context 행을 유지하되 평균 분모에서 제외하며, 이 경계는 제품 사양 §6.4와 source README에 동일하게 기록되어 있다.

## 역할 curation

`catalogRole`은 작품의 사실 annotation이나 인기 등급이 아니라 10개 추천 리스트의 구조 실험용 curation 값이다. G1에서 특정 demographic이 Discovery 정책의 효과와 섞이지 않도록 다음 3쌍을 교환했다.

| workId                               | 이전      | 최종      |
| ------------------------------------ | --------- | --------- |
| `skip-and-loafer`                    | discovery | bridge    |
| `kimi-ni-todoke`                     | bridge    | discovery |
| `pluto`                              | discovery | bridge    |
| `haikyu`                             | bridge    | discovery |
| `land-of-the-lustrous`               | discovery | bridge    |
| `nausicaa-of-the-valley-of-the-wind` | bridge    | discovery |

전역 역할 수는 교환 전후 모두 `anchor 18 / bridge 20 / discovery 12`다. 전체 후보 demographic은 `shonen 23 / seinen 19 / shojo 3 / general 1 / unknown 4`이고, 최종 Discovery 12작품은 `shonen 2 / seinen 6 / shojo 2 / general 1 / unknown 1`이다. 기존 Discovery 12작품 중 seinen 9작품이던 구성을 6작품으로 낮췄다.

최종 교체에서 `beyond-the-clouds`는 Nausicaa의 `general / discovery / onboardingEligible=false` 슬롯을, `noragami-stray-god`는 SLAM DUNK의 `shonen / anchor / onboardingEligible=true` 슬롯을 그대로 상속했다. 따라서 위 histogram은 변하지 않는다.

이 50% non-seinen Discovery 구성은 G1 confound control이며 제품의 영구 demographic quota가 아니다. G2 150작품에서는 더 넓은 catalog 자체의 coverage와 블라인드 결과로 다시 평가한다.

## 구조 메타데이터

- `volumeCount`는 각 annotations의 공식 출판사 최신/완결 권수와 판본 경계를 따른다.
- 현재 후보에는 같은 직접 속편·스핀오프를 별도 Work로 동시에 넣지 않아 `seriesGroupId`는 50행 모두 공란이다. 후속 확장에서 같은 시리즈 그룹의 별도 Work가 들어오면 그때 필수로 채운다.
- 최종 후보 role 수와 demographic 교차표, 50개 market 행 완전성(49개 관측 + 1개 prior-only), `catalogAverageRating=4.367959183673469`는 G1 annotation panel 요청에 함께 첨부한다.
