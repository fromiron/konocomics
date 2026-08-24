# Pilot 001 conflict adjudication: ふつうの軽音部

## 0. 결론

- Work: `work-268e1fa3599955359969`
- Canonical title: `ふつうの軽音部`
- HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Scope: `entry_1_3_volumes`
- RetrievedAt: `2026-08-23`
- Final adjudication: **ACCEPT `problemSolving=1`; CORRECT Grok의 `unknown` 판정**.
- Final Narrative: `2 / 1 / U / 3 / U / 2` = **4/6, PASS**.
- Final Tone: `2 / 3 / 2 / U / 3 / U / 2` = **5/7, PASS**, 변경 없음.
- Genre: `sliceOfLife`, nonempty.
- Theme: `school:2`, nonempty.
- Identity conflict: 없음.
- Safety conflict: 없음.
- Hard blocker: 없음.
- Art: **ART_ABSTAIN**. 이 조사에서는 Art 축을 판정하지 않았다.
- Repository edits: 없음. 페이지와 HTML은 `/tmp`에서만 조사했으며 커밋 대상이 아니다.

Grok의 기각은 당시 공식 1~4화 묶음에서 확인한 기타 구매 한 건만을 전제로 했으므로 타당한 보수적 이의 제기였다. 그러나 이번에 표준 3권 공식 내부 미리보기를 직접 확인한 결과, 별개의 밴드 인원 제약에 대해 사실을 정리하고 후보 적합성과 원인을 비교한 다음 대상에게 연락·설득하는 두 번째 저강도 제약 대응 구조가 확인됐다. 따라서 `한 번뿐인 구매`라는 전제는 더 이상 유지되지 않는다.

다만 3권 장면은 작중 인물이 명시적으로 `여기서부터는 대책이 없다`고 말하고, 얕은 방책을 버린 뒤 하토노의 기적에 맡긴다고 판단한다. 이는 Dictionary의 값 2인 지략과 직접 행동의 반복적 혼합까지는 가지 못하며, 오히려 값 0의 감정적 결단도 섞인다는 반대 근거다. 두 권에 걸친 낮은 빈도의 실무 비교·직접 행동을 기록하는 **중간값 1**이 가장 좁고 책임 있는 판정이다.

## 1. 독립 검수 계약

직접 다시 읽은 현재-SHA 자료:

- `AGENTS.md`
- `docs/factors/factor-dictionary.md`
- `docs/catalog-expansion/01-promotion-method.md`
- `data/staging/catalog-expansion/pilots/pilot-001/manifest.json`
- `data/staging/catalog-expansion/pilots/pilot-001/reviews/text-pass-bc-chunk-05.md`
- `data/staging/catalog-expansion/pilots/pilot-001/reviews/text-coverage-followup-f.md`
- `data/staging/catalog-expansion/pilots/pilot-001/reviews/text-coverage-followup-f-review.md`
- `data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt`
- `/tmp/pilot-text-gap-f.md`
- `/tmp/pilot-text-gap-f-review.md`

적용한 Dictionary 경계:

- 먼저 `0 / 2 / 4` 앵커를 판정하고 `1 / 3`은 그 사이일 때만 사용한다.
- `problemSolving=0`: 우연·힘·감정적 결단 중심.
- `problemSolving=2`: 지략과 직접 행동 혼합.
- `problemSolving=4`: 제약 분석과 기발한 해결이 핵심.
- known은 관찰 가능한 상태·빈도·반복 구조를 필요로 한다.
- Genre 또는 Theme에서 Axis를 자동 추론하지 않는다.
- 시놉시스의 생략은 0이 아니다.
- Narrative gate는 known `>=4/6`, Tone gate는 known `>=5/7`이다. 게이트를 맞추기 위해 값을 만들지 않는다.

검수 전 Grok 누적값은 Narrative `2 / U / U / 3 / U / 2` = 3/6, Tone `2 / 3 / 2 / U / 3 / U / 2` = 5/7이었다. 충돌 대상은 `problemSolving` 하나다.

## 2. 공식 출처와 판본·범위

모든 외부 출처의 조회일은 `2026-08-23`이다.

### 2.1 기존 1권 공식 1~4화 묶음

- Source: 集英社 少年ジャンプ＋
- URL: <https://shonenjumpplus.com/episode/16457717013869519536>
- Published: `2024-01-13T15:00:00Z`; 공식 표시일 `2024-01-14` JST.
- Edition/range: 표준 1권에 연결된 공식 1~4화 묶음, 본문 53쪽; 검수 렌더 스프레드 `keion-01.png`~`keion-27.png`.
- 직접 대응: `keion-03`~`keion-06`은 가격·선호 제약, 중고 기타의 비교와 시주, 구매를 보여 준다.
- Boundary: 1~4화 전체이지만 표준 2·3권은 포함하지 않는다.

### 2.2 표준 2권

- Source: 集英社 Books / 集英社 공식 미리보기
- Product URL: <https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884082-6>
- Reader URL: <https://www.shueisha.co.jp/books/reader/main.php?cid=9784088840826>
- Content metadata URL: <https://mangabroadcast.jp/contents/9784088840826/commercial/content.js>
- Standard paper edition: volume 2, ISBN `9784088840826`, B6, 200 pages.
- Released: `2024-06-04`.
- Official sample metadata: `ContentDate=20240530214653`, page IDs `P0000`~`P0026`, `SmlImageCnt=27`.
- Inspected range: cover/front matter/contents and the public volume-2 interior sample, rendered content states `vol2-state-00`~`vol2-state-26`. The purchase screen `state-27` and identical later navigation captures were excluded.
- Direct observation: contents and interior pages expose chapter 13 material. Hatono is suddenly made to sing at karaoke, performs, and the ensuing pages develop Momo's reaction and their relationship. This is performance and interpersonal decision evidence; it does **not** show a second explicit constraint analysis and solution loop.
- Official synopsis boundary: Hatono is unexpectedly asked to sing and Momo, after hearing her, makes a major decision. That copy does not independently establish analytical problem solving.

### 2.3 표준 3권

- Source: 集英社 Books / 集英社 공식 미리보기
- Product URL: <https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884238-7>
- Reader URL: <https://www.shueisha.co.jp/books/reader/main.php?cid=9784088842387>
- Content metadata URL: <https://mangabroadcast.jp/contents/9784088842387/commercial/content.js>
- Standard paper edition: volume 3, ISBN `9784088842387`, B6, 192 pages.
- Released: `2024-09-04`.
- Official sample metadata: `ContentDate=20240830184651`, page IDs `P0000`~`P0024`, `SmlImageCnt=25`.
- Inspected range: cover/front matter/contents and public chapter-22 interior sample, rendered content states `vol3-state-00`~`vol3-state-19`. The purchase screen `state-20` and identical later navigation captures were excluded.
- Boundary: this is the official public internal sample, not a claim that all pages of volume 3 or every intervening chapter were exposed.

Direct text observations:

1. `state-08`: the group explicitly says it will organize the current situation. A new-member candidate joined another band; SNS indicates Fujii is considering leaving the club. The stated objective is to prevent that departure and bring Fujii into their band.
2. `state-09`~`state-10`: they ask why Fujii is the candidate, compare Fujii with Momo, identify shared traits, and identify Ayame's prior mistreatment as the causal obstacle behind the possible withdrawal.
3. `state-11`: after discussing how to bring Ayame/Fujii into the band, the leader explicitly says there is no plan from this point onward.
4. `state-12`: the leader says she had considered several measures but discards them as shallow, choosing instead to entrust the result to Hatono's miracle. This is strong negative evidence against value 2 or higher.
5. `state-13`~`state-16`: despite that irrational element, the group selects immediate direct responses: speak at school the next day, check attendance, and send a concrete message asking to discuss the band after school.
6. The official volume-3 product description independently confirms that the group acts to stop Ayame's departure and recruit her, with Momo and Rin attempting persuasion. It corroborates that the pages are not merely an abstract discussion with no response.

### 2.4 후속 Jump+ 경로 확인

- Source: 集英社 少年ジャンプ＋
- URL: <https://shonenjumpplus.com/episode/11990162089556168573>
- Official title/range: episodes 5~7, band formation / befriending a senior / failing an audition.
- Published: `2024-01-21`.
- HTML metadata confirms the route is readable and belongs to the same official series.
- Use in this adjudication: route identity and date만 확인했다. 내부 페이지를 이번 값의 근거로 사용하지 않았다. 표준 2·3권 공식 내부 샘플만으로 현재 충돌을 해결할 수 있었기 때문이다.

## 3. 재현 가능한 페이지 패킷 해시

### 3.1 해시 직렬화

기존 F 보고서의 아홉 legacy 값은 다음과 같은 절대경로 의존 명령의 산출물이었다.

```text
sha256sum <absolute page paths> | sha256sum
```

따라서 `stable filename manifest`라는 기존 표현은 **기각**한다. 이 보고서의 portable 값은 정확한 파일 범위를 basename byte order로 정렬하고, 각 파일에 대해 다음 레코드를 만든 뒤 전체 스트림을 다시 SHA-256 한 것이다.

```text
<basename><NUL><file SHA-256 lowercase hex><LF>
```

임시 파일의 절대경로는 레코드에 들어가지 않는다.

| Packet | Exact range | Count | Portable SHA-256 |
|---|---|---:|---|
| vol.1 reviewed spreads | `keion-01.png`~`keion-27.png` | 27 | `5cd345dc8a8ba7d637b7201be8fa03fc4b2bdc8e3d891e411cb4b1c0fa82c21b` |
| vol.2 official raw M_L assets | content.js order `P0000.jpg`~`P0026.jpg` | 27 | `c07a31098e340228241b773b11b62cada9c5aa9faa821dfff4bcc75df8847d40` |
| vol.2 rendered content states | `vol2-state-00.png`~`vol2-state-26.png` | 27 | `9f392e45094932101638631dbb57cb6295586d423d5b112986ab0fe0a10e53bb` |
| vol.3 official raw M_L assets | content.js order `P0000.jpg`~`P0024.jpg` | 25 | `c12787e61c29c43aa008038a1b0c237113e6cd8123e4f21520baed2fd801abb0` |
| vol.3 rendered content states | `vol3-state-00.png`~`vol3-state-19.png` | 20 | `df0637528a8101ca25e29f787cc6d6bf960c24c2ab334c7e0cfddabdf73018c0` |

Raw asset names above are normalized stable page IDs in `content.js` order. The exact random remote stems are bound by each `content.js` snapshot. The rendered state count can differ from raw asset count because the official reader presents landscape spreads. Terminal purchase screens are not source pages and are excluded.

Additional exact snapshot hashes:

| Snapshot | SHA-256 |
|---|---|
| vol.2 product HTML | `32579d3bf4918e6532d2cc7cd56f5d542a87c25a38a24dfdf42fe5fe65dced76` |
| vol.2 content.js | `c273bb398d6c4149ff5636406bdc32a593ac5d15542af0e6706a02983b0c9b56` |
| vol.3 product HTML | `ed2f59d6f175ef6d002029f638a36dc28dd62b6306c8c8450d03e622ccb58d2c` |
| vol.3 content.js | `2edbc1e9504c0cf65b337e84b1066d3d189914ab5c30eecd71f65daf48420828` |
| Jump+ episodes 5~7 HTML | `a77c0655d52575a07b070bf38e143bf0e52153b2b967337f6848397b0e5cdb78` |

### 3.2 직접 인용한 렌더 상태의 개별 해시

기존 1권 구매 장면:

| Ref | SHA-256 |
|---|---|
| `keion-03.png` | `c86ced4efe6a98f3e9efb8e250a409bfd29f881523548f23e5bacd2b2451763e` |
| `keion-04.png` | `3748e79b44ff4494f815f20173267da002680567541bdfb0fdf03e33a1d3fcb9` |
| `keion-05.png` | `30931d4d0ed2d03f3e475b9fe54de27b36664ad52dcd6d63538e0f70b42ea92e` |
| `keion-06.png` | `76d1f9591818c707c57285c2a25bee35203ac28c1c05985863be296f26cec229` |

새로 확인한 3권 제약 정리·비교·응답 장면:

| Ref | SHA-256 |
|---|---|
| `vol3-state-08.png` | `facd58c8e26f2caf1c34125d7218c429f9307bab62695fce76a6d7489fd92709` |
| `vol3-state-09.png` | `19f8eeed21c61e7f5ec872a362061b75fc1c61735003d4061806490033dba7e1` |
| `vol3-state-10.png` | `574b5e2487ff29bb19e13912b2548972da9f823ce05d995f2262cff6189b1eec` |
| `vol3-state-11.png` | `2294a6bab5a7d5a69340ef9ef8512f38663a375e2499fcfe8d9eba365627b705` |
| `vol3-state-12.png` | `4140994b4fbe93bb2e1e40b4adc0cd16cba82b0cc5b51591a780b8df1f6e8395` |
| `vol3-state-13.png` | `e77dff5eb14e2f54a2326e5516148468d0e07367cc3dd5bce12ff4812b0b8f0b` |
| `vol3-state-14.png` | `e4ce66c9db1f6810333d0cd97c1131acba5022e7d45dbaa3c9a79dd20e9feffb` |
| `vol3-state-15.png` | `2d48c0b30016d9599f5c61858d7ec51f68755ce27768c1c493e9ec9970d7e169` |
| `vol3-state-16.png` | `456c9da42a28b33cfa773948788f3188f3ae35fb8e8d79c63a06d888384ff082` |

## 4. 충돌 판정

### 4.1 반복 여부

**YES, 낮은 강도의 constraint → reasoning/response 구조가 entry volumes 1~3 안에서 반복된다.**

- Mechanism A, volume 1: 가격과 선호 제약 → 이용 가능한 중고 기타 비교·시주 → 구매.
- Mechanism B, volume 3: 새 멤버 이탈과 기존 부원의 탈퇴 위험 → SNS 사실 정리·후보 특성 비교·갈등 원인 확인 → 다음 날 대화와 직접 연락·설득.

두 번째 구조는 밴드 또는 학교 Genre를 Axis로 바꾼 것이 아니다. 페이지에 제약, 정보, 비교, 원인, 선택한 행동이 직접 존재한다. 따라서 Grok의 `single purchase only` 전제는 새 공식 근거로 반증된다.

### 4.2 왜 값 1인가

- 두 구조 모두 복잡하거나 기발한 해법은 아니다.
- 1권은 일상적인 상품 비교·구매다.
- 3권은 사실 정리와 후보 비교를 하지만, 해결 담당자는 계획이 없다고 명시하고 감정적 믿음에 맡긴다.
- 직접 행동은 존재하나 지략이 반복적 핵심 보상이라는 값 2에는 미치지 않는다.
- 반대로 전부 우연·힘·감정만으로 흘러간다는 값 0보다 실제 비교·원인 파악·접촉 행동이 더 많이 관찰된다.

따라서 `0`과 `2` 사이의 **known 1**이 적합하다. 이 값은 Narrative gate를 정확히 통과시키지만, gate가 판정 이유는 아니다. 2권의 비지지 근거와 3권의 명시적 무계획 장면까지 함께 기록한 뒤 나온 결론이다.

### 4.3 인접 축 경계

- `strategy`: `U` 유지. 3권 한 장면의 무계획은 entry 전체에 계획 보상이 거의 없다는 긍정적 비교가 아니며, 다음 날 대화·연락 한 번도 반복되는 전술 구조를 만들지 않는다.
- `mysteryReveal`: `U` 유지.
- `worldBuilding=2`: 기존 현재-SHA 판정 유지. 이번 충돌에서 재개방하지 않았다.
- Genre와 Theme: 변경 없음.
- Art: 전부 범위 밖이며 기권.

## 5. 최종 게이트와 blocker 경계

| Group | Vector | Known count | Result |
|---|---|---:|---|
| Narrative | `2 / 1 / U / 3 / U / 2` | 4/6 | PASS |
| Tone | `2 / 3 / 2 / U / 3 / U / 2` | 5/7 | PASS |
| Genre | `sliceOfLife` | nonempty | PASS |
| Theme | `school:2` | nonempty | PASS |

Identity:

- Representative standard volume 1 ISBN: `9784088840192`.
- Supplemental standard editions: volume 2 `9784088840826`, volume 3 `9784088842387`.
- 모든 공식 route의 작가·시리즈·연속 권 매핑이 같은 canonical Work와 일치한다.
- 세트·특장판·중복판본을 대표권으로 사용하지 않았다.

Safety/scope:

- 공식 일본 페이지 만화와 표준 단행본이다.
- 웹툰·세로 스크롤 원작, 비일본 만화, 비만화 상품, fan work, R18 분류 충돌이 없다.
- 현재 packet의 `safe` 판정을 뒤집는 공식 근거가 없다.

Required remaining route: **없음**. 표준 2·3권의 현재 공개 내부 샘플을 조사해 현재 `problemSolving=1`과 N/T gate를 독립적으로 닫았다.

Optional re-review route:

- 값 2 이상을 제안하거나 반복 빈도를 더 정밀하게 산정할 경우, 공식 Jump+ episodes 5~7 route <https://shonenjumpplus.com/episode/11990162089556168573>와 entry 2·3권에 속하는 이후 공식 회차의 전체 내부 페이지를 확인한다.
- 이 optional route는 현재 pending이나 blocker가 아니다.

Hard-blocker boundary:

- 값 충돌 하나는 `promotionBlocked` 사유가 아니다.
- 접근 가능한 공식 판본·후속 route가 있고 identity와 safety도 해결됐으므로 `SOURCE_INFORMATION_UNAVAILABLE`, `IDENTITY_UNRESOLVED`, `SAFETY_UNRESOLVED` 어느 코드도 적용되지 않는다.
- 현재 최종 hard blocker 수: `0`.

## 6. 최종 disposition

- Grok `problemSolving=U`: **OVERRULE; CORRECT TO `1`**.
- Local `problemSolving=1`: **ACCEPT**, 단 근거를 기존의 1권 단일 구매에서 1권+3권의 두 독립 저강도 구조로 교체·강화한다.
- `problemSolving=2` 이상: **REJECT**.
- Final text gate: **PASS**.
- Remaining required official routes: `0`.
- Optional re-review routes: `1` 계열.
- Hard blocker: `0`.
- Repository files changed: `0`.
