# Batch 005 text recovery round 4 — chunk 02 independent QA

## Scope and binding

- reviewer: Daybreak independent QA/adjudicator
- reviewDate: `2026-08-25`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- frozen scope: positions `11–20`, `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- round-4 recovery input SHA-256: `cd10bb5a6f655730bbf64eebb0a7c2145b5ec7b90d73a6d83da31441f62fb30f`
- prior terminal text SHA-256: `d43545494520719d5f6b7042f89ea8ff05298ba6adc509a83539362c162baad3`
- prior terminal Genre SHA-256: `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de`
- prior terminal Theme SHA-256: `671539087a1958781e9d11a9e9bc67e057f009846f0ba5e6f2203a18d1ad7cf9`

초기 chunk-02 연구, Pass C, round 2·3 연구와 독립 QA, 현재 terminal CSV를 먼저 읽고 두 새 제안을 독립적으로 재판정했다. 이전 결론을 상속하지 않았고 작품명·Genre·직업명만으로 값을 만들지 않았다. Art는 검토하거나 변경하지 않았다.

## Reproduced official evidence

| Pos | Source | Published | Evaluated range | Direct observation |
| --: | --- | --- | --- | --- |
| 12 | 一迅社WEB, [ボクラノキセキ (1)](https://data.ichijinsha.co.jp/detail/75805394) | `2009-02-25` | volume 1 | 베로니카의 기억을 지닌 미나미가 학교생활에 적응하지 못하는 도입 상태. |
| 12 | 一迅社WEB, [ボクラノキセキ (2)](https://data.ichijinsha.co.jp/detail/75805477) | `2010-01-25` | volume 2 | 반 친구들이 차례로 전생 기억을 되찾고 히로키가 베로니카라고 주장하면서 상황과 정체 갈등이 바뀜. |
| 12 | 一迅社WEB, [ボクラノキセキ 3巻](https://data.ichijinsha.co.jp/detail/75805543) | `2010-09-25` | volume 3 | 오토모가 기억 보유자를 모으고, 현재 생활을 중시하는 미나미와 의견 충돌을 시작함. |
| 17 | 講談社, [おかめ日和](https://www.kodansha.co.jp/comic/products/0000043658) | `2007-04-13` | volume 1 | 남편의 침구 업무가 소개되고 목차의 세 번째 초반 에피소드가 `亀田健康道場ですぅ`로 명시됨. |
| 17 | 講談社, [おかめ日和（2）](https://www.kodansha.co.jp/comic/products/0000043712) | `2007-11-13` | volume 2 | 같은 亀田健康道場（鍼灸治療院）의 만성 적자와 야스코의 운영 자금 고민이 권 소개와 `今月も赤字だヮ` 목차에 직접 제시됨. |
| 17 | LINEマンガ, [おかめ日和](https://manga.line.me/product/periodic?id=S116501) | page date not stated | early episodes 1–3 | 출판사 `講談社`, 연재지 `BE・LOVE`, 제3화 `亀田健康道場ですぅ`를 정식 유통 메타데이터로 보조 확인함. |

모든 URL은 `2026-08-25`에 다시 열었다. 講談社 volume 2의 현재 공식 발매일은 `2007-11-13`이며, 초기 연구에 적힌 `2007-10-25`는 재현되지 않는다. round 4 연구의 날짜는 현재 공식 페이지와 일치한다.

## Cell decisions

| Pos | Work | Proposed cell | QA | Exact rationale |
| --: | --- | --- | --- | --- |
| 12 | ボクラノキセキ | `pacing=2` | `ACCEPT` | 권 1의 개인적 기억과 학교 고립, 권 2의 복수 동급생 기억 회복과 새로운 정체 주장, 권 3의 기억 보유자 집결과 현재/전생 지향 대립은 세 권에 걸쳐 목표·상황·관계 상태가 순차적으로 바뀌는 일반적인 Arc 변화를 직접 보여준다. 이는 기억 공개 자체를 다시 수치화한 것이 아니라 권간 상태 전환의 빈도 판정이다. 짧은 간격의 큰 목표·장소 전환은 확인되지 않아 4가 아닌 2다. |
| 17 | おかめ日和 | Theme `workplace:1` | `ACCEPT` | 단순히 남편이 침구사라는 직업명만 사용하지 않았다. 권 1의 독립 초반 치료원 에피소드와 권 2의 같은 치료원 재정·운영 갈등이 반복되므로 업무 공간과 운영이 일부 에피소드의 서브 소재라는 centrality 1 기준을 충족한다. 가족·부부 생활이 중심이므로 centrality 2는 지지되지 않는다. |

두 제안 모두 `ACCEPT`했다. 그 밖의 terminal known/unknown, Genre, Art, 기존 Theme는 재개방하지 않았다.

## Materialized delta and hashes

| File | Old SHA-256 | New SHA-256 | Change |
| --- | --- | --- | --- |
| `adjudication/text-final-chunk-02.csv` | `d43545494520719d5f6b7042f89ea8ff05298ba6adc509a83539362c162baad3` | `4de81646f0f479ab390505f41e087c34cb8adf3713d11817b423fcc290b853ed` | exactly `work-1550d4a52c3fe6d9f94c:pacing` changed from unknown to `known,2,0.67` |
| `adjudication/genres-final-chunk-02.csv` | `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de` | `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de` | byte-identical |
| `adjudication/themes-final-chunk-02.csv` | `671539087a1958781e9d11a9e9bc67e057f009846f0ba5e6f2203a18d1ad7cf9` | `b833210238186abd46c6ff638ebbcd63fd39e681b1ad604952eb2e1c3f30e4dc` | exactly one `work-1b7c4ed54d7761cd242b,workplace,1,0.82` row added |

두 변경만 역치환한 SHA-256은 각각 기존 text `d4354549…`와 Theme `67153908…`에 정확히 일치했다. Text는 header 제외 `170`행, `10`작품 × `17`축과 사전 순서를 보존한다. Theme는 합법적인 dictionary ID와 centrality `1`을 사용하며 header 제외 `18`행이다.

## Gate recount

| Pos | Canonical title | Narrative | Tone | Genre | Theme | Art | Remaining text gap |
| --: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 11 | ヨルムンガンド | 3/6 | 3/7 | pass | pass | 0/4 | N+1, T+2 |
| 12 | ボクラノキセキ | 3/6 | 4/7 | pass | pass | 0/4 | N+1, T+1 |
| 13 | おまかせ精霊 | 2/6 | 1/7 | pass | pass | 0/4 | N+2, T+4 |
| 14 | ニラメッコ | 0/6 | 4/7 | pass | pass | 0/4 | N+4, T+1 |
| 15 | 恋愛ラボ | 0/6 | 5/7 | pass | pass | 0/4 | N+4 |
| 16 | 銀のスプーン | 3/6 | 5/7 | pass | pass | 0/4 | N+1 |
| 17 | おかめ日和 | 1/6 | 5/7 | pass | pass | 0/4 | N+3 |
| 18 | 新黒沢 最強伝説 | 1/6 | 3/7 | pass | pass | 0/4 | N+3, T+2 |
| 19 | カレチ | 4/6 | 2/7 | pass | pass | 0/4 | T+3 |
| 20 | GREEN WORLDZ | 2/6 | 3/7 | pass | pass | 0/4 | N+2, T+2 |

Chunk-02 totals after round 4: Genre `10/10`, Theme `10/10`, Narrative `1/10`, Tone `3/10`, Art `0/10`, all non-Art text gates `0/10`. 두 작품 모두 일부 부족분만 줄었으며 승격되거나 blocker로 판정되지 않았다.

## Boundary

- No source, Pass A, frozen packet, provenance, promotion, overlay, generated catalog, eligibility, safety, identity, formula, dictionary, or Gold data was changed.
- All 40 Art cells remain `unknown`; no Art evidence or model vote was used.
- `git diff --check` and the terminal row/schema/order check passed.
- This is model-panel QA, not human validation; `reviewedByHuman=false` remains explicit.
