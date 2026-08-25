# Batch 004 text-gap recovery — chunk 05, round 5

- 대상: non-gate positions `41`, `45`, `46`, `48`, `49`, `50`
- 조사 제외: position `42` モテキ의 compound blocker 및 text-gate를 통과한 `43`, `44`, `47`
- 조사일 및 모든 `retrievedAt`: `2026-08-25`
- reviewer: `luna-text-recovery-round-5`
- `reviewedByHuman`: `false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68f1`
- terminal text CSV SHA-256 at read: `ccb7e51c60ba966f65a77855483847b31d32e34436ce2caa3c1ec95a67156fa6`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- 이전 recovery QA SHA-256: `1f61f1b8dabff8de05ad0cdfd01b68f4aaed22d0656bb9e0a17059fdf1c5caf6`
- blocker adjudication SHA-256: `c4be3b24ae4b9b9a3f1b1e8f4dff4531a3400dcb2e7e1fe77306a8425666abb1`

이 문서는 연구 전용이다. terminal text CSV, source row, Genre, Theme, Art, safety, identity,
ISBN, promotion registry, blocker, generated artifact, runtime 설명은 변경하지 않았다. Art 값은
제안하지 않았고, canonical title에는 장식용 `『`·`』`를 사용하지 않았다.

## 판정 경계

이번 라운드는 이전에 사용하지 않은 공식 출판사 권별 product/reader 경로를 우선 확인했다.
集英社 reader는 `SpeedBinb`가 표시한 실제 본문을 브라우저로 렌더링해 reader current와 인쇄
페이지가 함께 확인되는 범위만 기록했다. 표지·목차·요약·장르명·관계의 감정 이동만으로
Narrative 축을 새로 만들지 않았다. 유저 리뷰는 기존 accepted/rejected 셀을 재개방하지 않고,
직접 본문으로 생긴 후보를 보조할 때만 사용한다. 추정·다수결·중간값 채움은 하지 않았다.

특히 `アオハライド`의 `mysteryReveal=2`는 round 3에서 이미 기각되어 round 5에서도 재제안하지
않았다. vol.1–3 본문을 추가 확인했지만, 기각 사유를 뒤집을 정도의 새 recurring reveal 구조는
확인되지 않았다. 따라서 이 라운드에서 アオハライド에 새 Narrative 셀 두 개를 만들 수 없으며,
두 셀을 quota 목적으로 생성하지 않는다.

## 현재 terminal 기준과 no-reopen ledger

| position | workId | title | current text coverage | round-5 decision |
|---:|---|---|---|---|
| 41 | `work-c7280f9dcc2754d3f864` | 鵺の陰陽師 | `N4/6 · T3/7` | 기존 N4와 `comedy=1`을 재제안하지 않음; 추가 Narrative/Tone 없음 |
| 45 | `work-e81955a9fc5c4d84580f` | ここは今から倫理です。 | `N2/6 · T5/7` | `mysteryReveal`·`progression` 기각 유지; 추가 Narrative 없음 |
| 46 | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | `N2/6 · T4/7` | round-4 `emotionalWarmth=2` 기각 유지; 새 Narrative 없음 |
| 48 | `work-fc53cb5669aa4099ee4a` | アオハライド | `N2/6 · T5/7` | accepted `progression=2`, `emotionalWarmth=1` 및 rejected `mysteryReveal=2` 재개방 없음 |
| 49 | `work-fd2a957c501c36047ed0` | 青の祓魔師 | `N3/6 · T5/7` | 새 `mysteryReveal=2` 후보 1건만 Pass C로 제안 |
| 50 | `work-ff9b025f58d7e12f3cb1` | LOVE SO LIFE | `N1/6 · T4/7` | Hakusensha reader body 미접근; 새 셀 없음 |

## Position 49 — 青の祓魔師: new Pass C candidate

### Candidate: `mysteryReveal=2`, confidence `0.68`

이 셀은 이전 packet에서 제안·기각된 적이 없는 잔여 Narrative 셀이다. 集英社 vol.1
reader의 새로 확인한 본문 `reader current 35–41`(인쇄 페이지 표기 약 `35–41`)에서, 부모의
정체와 주인공의 출생이 대화 속에서 단계적으로 공개된다. 특히 current 37 화면에는
`悪魔の子供だ`와 `魔神の落胤だ`라는 직접적인 혈통 공개가 함께 표시되고, 직전 장면에는
그 사실을 확인하는 인물 간 대화가 있다. 이는 단순히 “악마와 싸운다”는 장르·Theme 근거가
아니라 주인공 정체에 관한 비밀의 공개다.

Dictionary anchor: `mysteryReveal=2`는 “비밀·반전이 일부 존재”; `4`의 “단서·추리·진실
공개가 주요 보상”까지는 입증하지 않는다. 따라서 단일 entry reveal을 이유로 4를 부여하지
않으며, `2`만 Pass C 후보로 남긴다. volume 2–3에서 확인한 훈련·임무·전투는 이 후보를
강화하는 추가 reveal이 아니므로 과대 확장하지 않는다.

**Official evidence**

| source | publication date | retrievedAt | exact bounded observation |
|---|---:|---:|---|
| [集英社 青の祓魔師 1 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874709-5) | `2009-08-04` | `2026-08-25` | vol.1 entry identity and exorcist premise; edition bridge for the reader. |
| [集英社 licensed reader, ISBN 9784088747095](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088747095) | edition route; date inherited from product | `2026-08-25` | Rendered body current `35–41`; direct “悪魔の子供だ / 魔神の落胤だ” parentage disclosure and surrounding confirmation dialogue. |
| [集英社 青の祓魔師 2 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874757-6) | `2009-11-04` | `2026-08-25` | volume 2 reader route checked through current `5–27`; training and camp attack, no additional secret/reversal used. |
| [集英社 青の祓魔師 3 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-870016-8) | `2010-03-04` | `2026-08-25` | volume 3 reader route checked through current `5–31`; mission, power loss and recovery context, no additional reveal used. |

The candidate is not terminal data. Pass C must decide whether one explicit entry-range identity
disclosure satisfies the `2` anchor or whether the work requires a repeated reveal pattern. If the
latter is required, retain `unknown`. Existing `problemSolving=2` rejection remains closed; danger,
training and mission action were not relabeled as problem solving.

## Position 48 — アオハライド: direct route exhaustion, no new Narrative

The three official readers were actually rendered beyond the prior Art sample:

| edition | official product | official reader | publication date | retrievedAt | checked body |
|---|---|---|---:|---:|---|
| vol.1, `9784088466477` | [product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846647-7) | [reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088466477) | `2011-04-13` | `2026-08-25` | reader current `7–20`: reunion, recognition, first-love tension, social/group conversation |
| vol.2, `9784088466903` | [product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846690-3) | [reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088466903) | `2011-08-25` | `2026-08-25` | reader current `7–18`: new class relationships, leadership-training context, friendship and social friction |
| vol.3, `9784088467313` | [product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846731-3) | [reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088467313) | `2011-12-22` | `2026-08-25` | reader current `9–18`: friendship disclosures, romantic triangle pressure, interpersonal choices |

These pages confirm the already-known relationship/romance/character context and the accepted
`progression=2` boundary. They do not show a recurring constraint-analysis process (`problemSolving`),
short-term tactical planning (`strategy`), repeated rules/factions (`worldBuilding`), or a new
secret/reversal reward. The round-3 `mysteryReveal=2` proposal remains rejected; the current
`emotionalWarmth=1` was accepted in the preceding adjudication and is not re-proposed. No two new
Narrative cells are authorized for this work.

## Position 41 — 鵺の陰陽師: route checked, no new cell

The [official vol.1 reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088836874)
(`978-4-08-883687-4`, product published `2023-10-04`) was rendered at reader current `5–20` on
`2026-08-25`. The exposed pages show the school occult-club premise, a recurring 幻妖 encounter,
the protagonist's reaction and the 鵺 relationship. This is consistent with existing
`progression=2`, `problemSolving=2`, `pacing=2`, and `worldBuilding=2`; it does not affirm a new
strategy, mystery-reveal, darkness, mental-stress, romance, or warmth anchor. The accepted
`comedy=1` is not reopened. Official vol.2 and vol.3 product records remain the bounded route:
[vol.2](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883788-8), published
`2023-12-04`, and [vol.3](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883820-5),
published `2024-02-02`; both retrieved `2026-08-25`.

## Position 45 — ここは今から倫理です。: route checked, no new cell

The [official vol.1 reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088907918),
ISBN `9784088907918`, product published `2017-11-22`, was rendered at reader current `5–18` on
`2026-08-25`. The entry pages show school cases, a student's burden, and the ethics teacher's
dialogue/intervention. This directly corroborates the existing case/pacing/darkness/stress/warmth
context but does not make the case disclosures a mystery-reveal structure or a progression reward.
The prior `mysteryReveal=2` and `progression` rejections remain closed. Vol.2 and vol.3 official
reader/product routes were also checked as the already bounded continuation:
[vol.2](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088910567), published `2018-06-19`,
and [vol.3](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088912615), published
`2019-04-19`; retrieved `2026-08-25`. No new Narrative anchor survived the Dictionary boundary.

## Position 46 — さよなら絵梨: complete one-shot route exhausted, no new cell

The [official complete-one-shot product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1)
(`9784088831671`, published `2022-07-04`) and its [licensed reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088831671)
were rendered through the exposed body current `3–17` on `2026-08-25`. The pages show the mother
requesting filming, repeated recording, illness/death, and Yuta reviewing the footage. These are
already represented by `pacing=3`, `mysteryReveal=2`, `characterArcWeight=4`, `darkness=3`, and
`mentalStress=3`; film-making is already the `crafting` Theme. They do not affirm a separate
constraint-solving process, strategic planning, world-building system, or growth-reward loop.

Round-4 `emotionalWarmth=2` was rejected by Daybreak and is not reopened. The complete one-shot
route plus the previously recorded independent reviews therefore yield no new safe cell in this
round; this is text-gap exhaustion, not a blocker.

## Position 50 — LOVE SO LIFE: Hakusensha route exhaustion, no new cell

The first three official product records were rechecked on `2026-08-25`: [vol.1](https://www.hakusensha.co.jp/comicslist/44745/),
published `2009-05-19`; [vol.2](https://www.hakusensha.co.jp/comicslist/44747/), published `2009-09-18`;
and [vol.3](https://www.hakusensha.co.jp/comicslist/44749/), published `2010-01-19`. The official
[vol.1 trial route](https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59218734lovesol00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D44745)
reached the reader shell/cover but provider resources did not expose a readable body in this
environment. The vol.2/3 product pages expose childcare and family context, but not a recurring
problem-analysis process, strategy, mystery, or world rule. Existing `romance=1` and `emotionalWarmth=4`
remain unchanged; previously rejected `problemSolving`/`comedy` are not re-proposed. This is route
exhaustion, not a safety, identity, or source-information blocker.

## Disposition and Pass C handoff

| position | result | blocker change | terminal write authorized |
|---:|---|---|---|
| 41 | no new cell; direct reader confirms existing context | none | no |
| 45 | no new cell; case disclosures are not mystery/progression | none | no |
| 46 | no new cell; complete one-shot route exhausted | none | no |
| 48 | no new cell; two new Narrative cells not supported | none | no |
| 49 | `mysteryReveal=2`, confidence `0.68`, Pass C only | none | no |
| 50 | no new cell; Hakusensha body unavailable | none | no |

Pass C should independently check only the position-49 candidate against the exact page range and
the `mysteryReveal=2` anchor. The conservative fallback is `unknown`; do not infer from genre,
danger, training, relationship movement, or the existence of a secret alone if the reviewer requires
a repeated reward structure. No row in the terminal CSV may be changed by this packet.

## Integrity

`git diff --check` was run after writing this packet. Only this research report is added by round 5;
all terminal/source/generated/promotion files remain untouched by this agent.
