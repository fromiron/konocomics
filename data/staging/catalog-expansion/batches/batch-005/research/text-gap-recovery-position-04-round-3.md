# Batch 005 text-gap recovery — position 04 round 3

## Scope and guardrails

- 조사일: `2026-08-25`
- 대상: position `4`, `work-0cf463005cc77eeded8e`, `黄泉のツガイ`
- 평가 범위: `entry_1_3_volumes`; 공식 제1화에 이어 공식 제2화 시험읽기까지 확인
- `reviewedByHuman=false`
- 현재 gate: Narrative `3/6`, Tone `4/7`, Art `3/4`
- 이 라운드의 목적: 이전 라운드에서 미확정으로 남은 서로 다른 Narrative 1축과 Tone 1축에 대해, 공식 entry-range의 반복적인 직접 앵커를 추가 조사
- 기존 `progression=2`와 `characterArcWeight=2`는 독립 QA에서 기각됐다. 이 문서에서는 재제안하지 않는다.
- 기존에 승인된 `mentalStress=2`는 재심하지 않는다.
- `Art`, terminal CSV, source, generated, registry, promotion 파일은 변경하지 않는다.
- 모든 외부 자료의 `retrievedAt`: `2026-08-25`

### Frozen review identity

- repository HEAD at packet preparation: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`

## Official route opened in this round

The volume-2 and volume-3 publisher pages remain useful for bounded volume identity
and synopsis, but both link to the same volume-1 episode reader. They do not expose
a volume-specific internal reader. The additional direct page evidence below is the
publisher's official Gangan Online series route for episode 2, which is an entry-range
episode and was listed in the official February 2022 issue page.

| source | URL | publishedAt | retrievedAt | bounded use |
| --- | --- | --- | --- | --- |
| SQUARE ENIX official product — 黄泉のツガイ 2 | https://magazine.jp.square-enix.com/top/comics/detail/9784757581005/ | `2022-09-12` | `2026-08-25` | Volume-2 identity and synopsis: the village attack ends Yuru's quiet life; he descends with Dera and Hana while searching for Asa and clashes with the Kagemori family. |
| SQUARE ENIX official product — 黄泉のツガイ 3 | https://magazine.jp.square-enix.com/top/comics/detail/9784757584013/ | `2023-02-10` | `2026-08-25` | Volume-3 identity and synopsis: Yuru enters the Kagemori residence, reunites with Asa, repels an attack, and confronts the death/survival mystery. |
| SQUARE ENIX official series introduction | https://magazine.jp.square-enix.com/gangan/introduction/yomitsuga/ | undated | `2026-08-25` | Official series hub linking the first and second episode readers and the character/story pages. |
| SQUARE ENIX official Gangan episode 2 reader | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/ | `2022-01-12` issue publication | `2026-08-25` | Exact publisher reader route. The HTML exposes `fr_pagenum=47`, `fr_ad_free=[true,45]`, `fr_imgval=250212`, and `fr_dir=img/`. Pages `003–044` are body pages; `045–047` are social/blank/sales material. |
| SQUARE ENIX official Gangan February 2022 issue | https://magazine.jp.square-enix.com/top/magazines/gg/?p=5 | `2022-01-12` | `2026-08-25` | Official issue listing identifies the episode-2 publication as `少年ガンガン 2022年2月号` and labels it the second episode of the new series. |

The exact body-page URL template is:

`https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/NNN.jpg?250212`

The page images were inspected only from this rightsholder route. The temporary
inspection files live under `/tmp/konocomics-yomitsuga-episode02/` and are not part
of the repository or this packet.

## Exact repeated entry-range observations

The following page ranges are deliberately bounded to episode 2. They are direct
observations, not genre-to-factor inference. The hashes attest to the downloaded
temporary samples; they are not committed image assets.

| pageRef | direct URL | SHA-256 | bounded observation | possible factor use |
| --- | --- | --- | --- | --- |
| `official-episode02-010-011` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/010.jpg?250212` and `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/011.jpg?250212` | p010 `c7a3130627e37555e3bb99fb88ef5da2f01974278ac443d0716e27d9d888e829`; p011 `c93b7899f41014ca9479642ab2b13d376ce88b671f765795325d06f6b7c02503` | Dera and Hana state the immediate objective of descending safely, then establish that Yuru is the master and that they follow his commands. | A concrete short-term objective, role assignment, and command constraint. |
| `official-episode02-013-015` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/013.jpg?250212` through `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/015.jpg?250212` | p013 `94ef6a04cdf40aaace6a7993a40a9d4a8995d5e34381cfa6d533ad16f1a34811`; p014 `366ce147a546c6cc0ad1f1ac586d4a8a547334a8b3275aee2f820a488d137997`; p015 `1ee307753419685466b407708ed5494348822feedd946a21fec2ccc5f1d6d360` | The group identifies Asa/Yuru stakes, repeats the master/command relationship, and Yuru gives a bounded protection request: secure surviving villagers and do not touch his bird. | Repeated direct protection/care and a bounded tactical instruction; mixed with threat and combat pressure. |
| `official-episode02-020-022` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/020.jpg?250212` through `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/022.jpg?250212` | p020 `9af8a98c88c027c4c0076afbad3b98d7f74ff6171aca81ef0cffadf585fde1c3`; p021 `72d80373608a5a88132099581b49c6a4342be51c89b83c2fd0603340f17b93ec`; p022 `7e472bb218a31ac136daaf803c3e72ec2be6d208ce9702a36fc8c876bef99c14` | During the Tsugai attack, the characters identify and try to catch the target, assess whether a child is injured, and move children/survivors toward safety. | A second, distinct short-term response chain; direct care and evacuation are repeated. |
| `official-episode02-025-030` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/025.jpg?250212` through `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/030.jpg?250212` | p025 `37c17ab3c0e835d39102057425091244aee6475368851753defc6b3f176a5a92`; p030 `a5ecea124b4f444021316c7d7bdb2c6fa1b94faf40a1ddcb4ee15ee6346d3b63` | An explicit ability/user constraint and command (“do not attack now”) is followed by confrontation and a rescue endpoint in which Asa holds Yuru and tells him not to move. | A third bounded tactical/command sequence; care is enacted at the end of a dangerous sequence. |

These ranges are separate scene clusters within the same official entry episode. The
repetition is therefore not a single isolated line: command/constraint/action appears
in `010–015`, target/assessment/evacuation appears in `020–022`, and constraint/
confrontation/rescue appears in `025–030`.

## New Narrative proposal — `strategy=2`

**Provisional value:** `known`, value `2`, confidence `0.78`
**Proposal evidence ID:** `ev-batch-005-a-work-0cf463005cc77eeded8e-r3-strategy`

| requirement | evidence |
| --- | --- |
| Dictionary anchor | `strategy=2` is “전술·단기 계획 존재”: a bounded plan or command is visible, without evidence that long-term planning, war, politics, or resource management is the central reward. |
| Direct repeated anchor A | `010–011`: safe descent is the immediate objective; Dera/Hana establish a master/command hierarchy. |
| Direct repeated anchor B | `014–015`: Yuru gives a concrete protection instruction for surviving villagers and a no-interference constraint concerning his bird. |
| Direct repeated anchor C | `020–022`: the group identifies/catches an attacking Tsugai, checks a survivor, and moves children/survivors to safety. |
| Direct repeated anchor D | `025–030`: an ability and command constraint governs whether to attack; the sequence ends in coordinated confrontation and rescue. |
| Official synopsis corroboration | Volume 2 gives the repeated route objective of descending while searching for Asa/parents and clashing with Kagemori; volume 3 gives the changed route into the Kagemori residence, reunion, and response to an attack. These are corroboration only; the value rests on the exact episode-page commands and bounded actions. |
| Boundary | This is not `strategy=4`: no long-term plan, war/political operation, or resource-management loop is directly established in the entry range. It is not `progression` (already rejected), and it is not a claim that all combat scenes are strategic. `problemSolving` remains unconfirmed because the observed solutions are primarily command/action and rescue rather than a clearly central analytic puzzle-solving process. |

The proposal is intentionally a midpoint. The page sequence supports tactical
commands and short-term objectives, but does not justify an extreme value or a
long-horizon planning claim. Independent QA must accept, lower to `unknown`, or
request adjudication.

## New Tone proposal — `emotionalWarmth=2`

**Provisional value:** `known`, value `2`, confidence `0.80`
**Proposal evidence ID:** `ev-batch-005-a-work-0cf463005cc77eeded8e-r3-emotional-warmth`

| requirement | evidence |
| --- | --- |
| Dictionary anchor | `emotionalWarmth=2` is the mixed middle: warmth and care are repeatedly present, but they are not the sole or dominant reward of the entry range. |
| Direct repeated anchor A | `013–015`: the sibling stakes are explicit; Yuru asks Dera/Hana to protect villagers who may still be alive and gives a direct no-harm constraint. |
| Direct repeated anchor B | `021–022`: a survivor's condition is checked, the child is reassured, and children/survivors are directed to a safe place. The exchange also raises an explicit responsibility toward children. |
| Direct repeated anchor C | `030`: after the dangerous sequence, Asa physically supports Yuru and tells him not to move. This is an enacted care response, not only a relationship label. |
| Official synopsis corroboration | Volume 2 names Dera/Hana as Yuru's travelling collaborators; volume 3 explicitly brings Yuru and Asa to a reunion. These details corroborate recurring bonds but do not replace the direct page anchors. |
| Boundary | The same entry range contains threats, attack, death/survival uncertainty, and faction pressure. Therefore `4` (“warmth/healing as the core reward”) is not supported. Sibling/faction care is not romance; `romance` remains `unknown`. This proposal does not revisit the rejected `characterArcWeight`. |

The proposal uses the midpoint because care/protection appears in multiple separate
clusters, while danger and coercion remain co-present. Independent QA must verify
that the care is sufficiently recurring and not merely a relationship annotation.

## Closed cells and exhaustion after round 3

| axis | terminal handling | reason |
| --- | --- | --- |
| `progression` | `unknown` — **rejected; do not reopen** | Round-2 independent QA found status/plot movement but no repeated growth, acquisition, or mastery reward. |
| `characterArcWeight` | `unknown` — **rejected; do not reopen** | Round-2 independent QA found initial motives and forced events, not repeated enacted character change as the entry reward. |
| `mentalStress` | `known=2` — **accepted; do not re-propose** | Round-2 independent QA accepted repeated psychological pressure with mixed tone. |
| `comedy` | existing terminal `known=2` | Not part of this recovery round. |
| `strategy` | **new provisional proposal `2`** | Exact episode-2 command/constraint/action clusters above. |
| `emotionalWarmth` | **new provisional proposal `2`** | Exact episode-2 care/protection/evacuation clusters above. |
| `problemSolving` | remain `unknown` | The new pages show action under commands and constraints, but not a clearly central analytic problem-solving process. |
| `romance` | remain `unknown` | Sibling and faction bonds are not romantic evidence. |

No additional unused official episode-2 page cluster was found that would responsibly
support `progression`, `characterArcWeight`, `problemSolving`, or `romance` under the
dictionary definitions. The volume-2/3 product pages do not add a separate reader,
so no volume-specific page claim is made. Art remains unchanged and is not used to
support either proposal.

## Expected gate effect

If both proposals pass independent QA, the position would move from Narrative `3/6`
to `4/6` and Tone `4/7` to `5/7`; neither result alone establishes promotion because
the frozen text gates still require the repository's configured coverage thresholds.
This packet is research only and does not mutate the terminal matrix or eligibility.

## Verification and change boundary

- direct official routes were checked on `2026-08-25`
- temporary episode-2 page samples were fetched from the exact publisher URL template
- page SHA-256 values are recorded above
- no terminal/source/generated/promotion/Art file was edited
- the only intended repository change is this research packet
- `git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-04-round-3.md` must pass before handoff
