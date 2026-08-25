# Batch 004 text-gap recovery — chunk 04, round 4

- 대상: frozen positions `31–40`, `entry_1_3_volumes` (position 38은 단권)
- 조사일·`retrievedAt`: `2026-08-25`
- reviewer: `luna-text-recovery-round-4`
- repository root: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- round-3 recovery SHA-256: `a99a3dd810dd2ed9f608f7bc4c98fa361bfd250dc6b2cd6b942d4c7077f6b7b8`
- bound terminal text CSV SHA-256 (읽기 전): `2355627202f24e773bfbbece478756f0026a1f75340f58919175e745d414eba0`
- bound terminal themes CSV SHA-256 (읽기 전): `752dfbca2584d4255be57f2adc6ad68fa1d0847a2008d3248a23bd20e09098e5`
- bound terminal genres CSV SHA-256 (읽기 전): `e0c501bf7575d0e5c02c98741a4637b3090b8b46a67eab3a2fdbb68990236acd`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be8`
- `reviewedByHuman`: `false`

## 범위와 변경 경계

이번 라운드는 round 3 이후 새로 발견된 권리자·출판사 원문 경로가 실제로 남아 있는 Narrative/Tone 또는 Genre/Theme 셀을 채우는지 재검토했다. 기존에 ACCEPT, REJECT, FROZEN_NO_OP 또는 EXACT_EXHAUSTION으로 닫힌 셀은 다시 제안하지 않았다. 특히 pos31·pos33의 `emotionalWarmth`, pos34의 `workplace` Theme, pos38의 `mentalStress`는 이미 승인됐으므로 재제안하지 않는다.

공식 자료를 먼저 같은 entry range에 맞춰 확인하고, 그 관찰이 Factor Dictionary의 축과 직접 맞물릴 때만 서로 독립된 사용자 리뷰를 보조 근거로 대조했다. 리뷰는 구체적 관찰만 사용했고 평점·인기·추천 목록 등재·표지 인상·막연한 호불호는 제외했다. 공식 미리보기의 본문 페이지가 충분히 판독되지 않은 작품은 값으로 채우지 않고 exhaustion으로 종결했다. 이 보고서는 연구 제안만 담으며 terminal CSV, source CSV, generated artifact, promotion/overlay, Art 자료를 수정하지 않는다. canonical title은 장식용 괄호 없이 기록했다.

## 신규 자료 ledger

| pos | 작품 | 이번 라운드의 새 공식 경로·발표일 | entry-range에서 확인한 사실 | disposition |
|---:|---|---|---|---|
| 31 | 邪神の弁当屋さん | 講談社 News editorial, [圧倒的反響のお弁当ファンタジー！ 謹慎中の「神」が始めた弁当屋さん](https://news.kodansha.co.jp/comics/20151239), `2025-02-16`; 講談社 공식 권 소개 [1권](https://www.kodansha.co.jp/comic/products/0000404585) `2025-01-20`, [2권](https://www.kodansha.co.jp/comic/products/0000415367) `2025-06-19`, [3권](https://www.kodansha.co.jp/comic/products/0000420295) `2025-11-20` | 새 Kodansha editorial은 전쟁 뒤 벌을 받아 인간으로 사는 Rainey와 도시락 가게의 반복 일상을 설명하면서, 그 일상 아래 전쟁 책임·공백·어두운 면·상처 입은 말과 신으로서의 위협성이 교차한다고 구체적으로 다룬다. 공식 1–3권 소개는 인간에 대한 두려움, 각 인물의 결핍, 비밀이 가게·손님·공동체 에피소드로 이어짐을 유지한다. | `mentalStress=2`만 신규 proposal. `darkness=4`나 `mentalStress=4`로 확대하지 않으며, 이미 ACCEPT된 warmth는 재제안하지 않는다. editorial은 본문 전 페이지 ledger가 아니라 권리자 해설이므로 midpoint 보조 근거로만 사용한다. |
| 33 | あした死ぬには、 | 太田出版 공식 [series page](https://webcomic.ohtabooks.com/ashita/), retrieved `2026-08-25`; first episode `34577`, volume-2 episode `42476`, volume-3 episode `46571` | 공식 series map은 40대의 몸·건강·폐경·피로·미용·돈·생활계획을 entry 1–3권에 걸쳐 배치하고 편집자 소개는 여성의 고민을 동행하는 따뜻한 이야기로 설명한다. 새 route map은 기존 evidence의 범위와 회차 연결을 명확히 하지만 반복적인 제약 분석·해결 절차나 새 Genre/Theme를 추가하지 않는다. | 이미 ACCEPT된 warmth를 재제안하지 않고 exact exhaustion. 남은 Narrative unknown은 새 직접 anchor가 없어 유지한다. |
| 34 | ドカ食いダイスキ！ もちづきさん | [ヤングアニマルWeb series](https://younganimal.com/series/5194e06f961ab/1), episode route IDs `b9a3ec5171c8c`, `900bf844e8dc2`, `5cebac592e611`, `ea4ef09f856f8`, `145a1bf23834d`, `bb407e6ae3b26`, dates `2024-05-09`–`2024-09-09` | 공식 series/episode map은 21세 `営業事務` 주인공과 사무직·동료 맥락, 반복되는 과식 개그를 entry episodes 1–6에 걸쳐 동일하게 유지한다. 새 값으로 바꿀 만한 인물 변화·분석적 해결·심리 압박은 공개된 직접 자료에서 확인되지 않았다. | 이미 ACCEPT된 `workplace=1`과 기존 comedy/pacing을 재제안하지 않고 exact exhaustion. 음식 섭취를 `cooking`으로 바꾸지 않는다. |
| 38 | カラオケ行こ！ | KADOKAWA/ Kadocomi 공식 [작품 route](https://comic-walker.com/detail/KC_002925_S), retrieved `2026-08-25`, volume/one-shot date `2020-09-12`, episode code `KC_0029250000100012_E`, `pageCount=18`, update `2020-12-10` | 새 Kadocomi route는 합창부장 Satomi가 야쿠자 Kyoji에게 매주 노래를 가르치도록 강요받고, 그 관계가 이상한 우정으로 이동한다는 단권 synopsis와 episode metadata를 제공한다. 그러나 공개 HTML에 연속적인 clue→investigation→truth release의 본문 ledger는 없고, 새 Narrative/Tone cell도 없다. | 이미 ACCEPT된 `mentalStress=2`를 재제안하지 않고 exact exhaustion. 이전 mystery 후보를 되살리지 않는다. 영화·애니메이션의 각색 자료는 원작 만화 Factor 근거에서 제외한다. |

## 독립 리뷰 대조

모든 URL은 `2026-08-25`에 조회했다. 아래는 이번 라운드의 신규 p31 proposal을 검토하기 위해 사용한 보조 관찰이다. 두 review system 모두 공식 자료의 entry 범위를 넘어서는 결말·후속권 평가를 값에 반영하지 않았다.

| pos | sourceName / URL / 게시일 또는 노출일 | 구체적 관찰 | 사용 범위 |
|---:|---|---|---|
| 31 | Comic Cmoa title reviews — [title_id/311981](https://www.cmoa.jp/title/customer_review/title_id/311981/), 페이지 노출 reviewer dates `2025-03-06`–`2026-01-25` | 서로 다른 reviewer들이 도시락 가게의 일상과 인물들의 과거·전쟁 책임·진지하고 무서운 장면이 함께 존재한다고 기록하고, 관계의 온기와 불안·의문이 교차한다고 구체적으로 관찰한다. | Kodansha 공식 1–3권 및 새 editorial의 결핍·전쟁·공백 관찰과 일치하는 보조 근거. 평점·인기·추천 여부는 제외했다. |
| 31 | honto volume-1 reviews — [pd-review_0633848015](https://honto.jp/ebook/pd-review_0633848015.html?srt=2), exposed dates including `2026-01-28`, `2026-07-24`, `2026-08-16` | 서로 다른 reviewer들이 평범한 도시락 일상의 안도감과 함께 전쟁의 숨은 사정, 신과 인간의 충돌, 인간/신 사이에서 흔들리는 마음을 언급한다. | Cmoa와 별도 review system의 반복 관찰로 `mentalStress=2`의 혼합 압박을 보조한다. 단일 평자의 감상이나 최고값 판단으로 사용하지 않았다. |
| 33 | Comic Cmoa — [title_id/177415](https://www.cmoa.jp/title/customer_review/title_id/177415/?site_kbn=1), exposed dates including `2022-11-06`, `2026-04-02`, `2026-04-16`; Sony Reader Store vol.1 — [LT000115468000927872](https://ebookstore.sony.jp/review/title/10426205/id/LT000115468000927872/), exposed dates `2020-01-27`, `2020-08-18`, `2022-03-27`, `2022-10-22` | 두 독립 시스템에서 건강·일·가족·생활 압박과 주변의 지지/공감이 함께 관찰된다. | 이미 승인된 `emotionalWarmth=2`를 재제안하지 않기 위한 cross-check에만 사용했다. 새 Narrative/Theme 값은 만들지 않았다. |
| 34 | Comic Cmoa vol.1 — [title/304902](https://www.cmoa.jp/title/304902/), review `2025-04-29`; BookLive vol.3 — [title_id/20100867/vol_no/003](https://booklive.jp/review/list/title_id/20100867/vol_no/003), exposed dates `2026-01-12`–`2026-03-06` | 사무실·동료와 반복 과식 개그의 결합이 두 별도 권/페이지에서 확인된다. 건강 위험을 심리 축의 최고값으로 읽을 만한 독립 반복은 없다. | 이미 승인된 `workplace=1`을 재제안하지 않고 exact exhaustion의 보조 확인으로만 기록했다. |
| 38 | Meg Note — [nce6b3d5bbeb8](https://note.com/suki_oshinikki/n/nce6b3d5bbeb8), `2025-08-23`; えとうまこ Note — [n263a35851d29](https://note.com/ue_nm_5o/n/n263a35851d29), `2024-07-20` | 두 독립 완독 리뷰는 주간 레슨·대회 압박과 코미디에서 긴장으로의 이동을 기록하지만, Kadocomi synopsis 이상의 반복 clue/reveal 구조를 제시하지 않는다. | 이미 승인된 `mentalStress=2`의 범위 확인. 신규 cell로 확장하지 않았다. |

## 신규 proposal

| pos | workId | 제안 | 공식 1차 근거 | 독립 review 수렴 | Dictionary anchor / confidence / guardrail |
|---:|---|---|---|---|---|
| 31 | `work-925f371723beac5227f7` | `mentalStress=2` | Kodansha 1–3권 공식 소개는 전쟁 뒤 처벌·인간에 대한 두려움·인물별 결핍·비밀을 반복한다. 새 Kodansha editorial (`2025-02-16`)은 도시락 가게의 안정적인 루틴과 그 아래의 전쟁 책임, 공백·어둠, 상처 입은 말, 신으로서의 위협성을 함께 명시한다. | Cmoa와 honto의 서로 다른 reviewer들이 심각·무서운 장면, 전쟁/신-인간 충돌, 숨은 사정과 불안을 도시락 일상의 안도감과 함께 기록한다. | Dictionary의 `mentalStress=2`(혼합된 긴장·좌절·압박)에 맞는다. `0.65`; mixed pressure만 허용한다. 지속적 심리 붕괴가 직접 확인되지 않으므로 `4`와 `darkness=4`는 금지한다. 이 proposal은 새 공식 editorial과 entry-bound volume evidence에 의해 만들어진 것이며, round 3의 warmth acceptance를 반복하지 않는다. |

`problemSolving`, `strategy`, `progression` 및 p31의 `characterArcWeight`는 이번에도 proposal하지 않는다. 공식 자료가 인물의 결핍·관계·압박을 설명하더라도 제약 분석을 거쳐 해결하는 반복 구조나 장기 성장 보상을 직접 보여주지 않는다.

## 위치별 exact exhaustion

- **32 働かないふたり**: round 3에서 exact exhaustion. 새로 본 자료가 없으며, 기존 official entry와 독립 리뷰가 이미 일상 반복·관계·개그 범위를 덮는다. `progression=0`의 부재 조건을 synopsis 침묵으로 확정하지 않고 새 Theme도 만들지 않는다.
- **33 あした死ぬには、**: Ohta series map의 episode-to-volume 연결과 편집자 설명은 기존 warmth evidence의 범위를 명확히 할 뿐 새 값이 아니다. 반복적인 문제 해결·전략·mystery·세계관 구조는 직접 확인되지 않는다. 이미 ACCEPT된 `emotionalWarmth=2`는 닫힌 채 유지한다.
- **34 ドカ食いダイスキ！ もちづきさん**: Young Animal의 exact episode IDs와 날짜는 직장 맥락·과식 개그를 재확인한다. 이미 ACCEPT된 `workplace=1` 및 기존 comedy/pacing 외 새 Narrative/Tone 셀은 없다. `/bulk/` 로그인 제한을 근거 부족의 해결로 우회하지 않는다.
- **35 ディグイット**: round 3 exact exhaustion. 공식 배구 premise와 독립 리뷰는 목표·훈련·팀 관계를 재확인하지만 전략/새 Tone을 직접 채울 bounded sequence가 없다.
- **36 坂本ですが?**: round 3 exact exhaustion. 공식 상품/reader와 독립 리뷰는 학교 사건·문제 처리·개그 범위를 보강할 뿐 성장·전략·mystery·새 Tone을 만들지 않는다.
- **37 来世は他人がいい**: round 3 exact exhaustion. 조직·가족 관계와 위협은 기존 world/relationship/romance/darkness/stress를 넘지 않는다. 야쿠자 설정을 combat이나 반복 mystery로 바꾸지 않는다.
- **38 カラオケ行こ！**: Kadocomi의 새 route는 weekly lesson과 관계의 우정 이동을 직접 보여주지만 이미 승인된 stress와 기존 relation/comedy/school만 보강한다. 본문 pageCount만으로 mystery/strategy/progression을 확정하지 않으며 각색 자료도 사용하지 않는다.
- **39 となりの猫と恋知らず**: round 3 exact exhaustion. 기존 SQUARE ENIX entry와 독립 리뷰가 학교에서의 느린 관계 시도·고양이 접점을 이미 포괄한다. 새 comedy/stress/progression/mystery 값은 리뷰가 직접 일치하지 않는다.
- **40 カッコウの許嫁**: round 3 exact exhaustion. 공식 1–3권 route는 출생 교체·약혼·동거의 premise를 확인하지만 단일 비밀은 반복 clue/reveal 보상이 아니며 동거는 Dictionary의 progression이 아니다.

## 상태·변경 경계

- 신규 proposal은 독립 adjudication 입력일 뿐 terminal CSV에 쓰지 않았다.
- bound terminal text CSV는 `10` works × `17` unique axes = `170` rows이며 duplicate work/axis key `0`을 유지한다.
- 이번 라운드에서 이 보고서 외의 `data/source/**`, terminal text/themes/genres CSV, Art review, promotion registry/overlay, blocker, generated artifact를 수정하지 않았다.
- 이 보고서는 `mentalStress=2` 한 건만 신규 adjudication 후보로 남기며, 최종 recommendation 상태·eligibility·hard blocker를 결정하지 않는다.
- `reviewedByHuman=false`를 유지한다.

## Closure

새로 발견된 Kodansha 권리자 editorial이 pos31의 entry-range 안에서 반복되는 전쟁 책임·공백·어두운 면과 일상적 회복의 혼합을 직접 보강했으므로 `mentalStress=2` 한 건만 제출한다. 나머지 위치는 이미 승인·거절·무변경·소진된 셀을 존중해 exact exhaustion으로 닫았다. Art 판정, safety/identity, Genre 자동 추론, promotion 승격은 이 연구 라운드의 범위가 아니다.
