# Batch 004 text-gap recovery — position 24 round 2

## 조사 범위와 변경 경계

- 조사일 / `retrievedAt`: `2026-08-25`
- 대상: frozen position `24`, `work-65f856a6fa2078f21d2f`, `黒月のイェルクナハト`
- 평가 범위: Factor Dictionary `entry_1_3_volumes`; 공식 講談社 1–3권 상품 문구와 QA가 지정한 2·3권 공식 내부 시험읽기에서 실제로 노출된 순서만 확인했다.
- 판정 경계: research only, `reviewedByHuman=false`
- 변경 경계: 이 문서만 생성한다. terminal/adjudication/source/generated/Genre/Theme/Art/overlay/promotion/blocker/registry 파일은 수정하지 않는다.
- 제목·장르·상품 태그·기존 값·기억으로 Narrative 값을 만들지 않는다. 사용자 리뷰는 이번 라운드에서 사용하지 않았다.

## 입력 바인딩과 현재 게이트

| input | value |
|---|---|
| frozen work set | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| Factor Dictionary | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be8` |
| round-1 research | `df99989021d98e4a9cee0e424920dc9dc113840fd4f68b1299e137b63ddc9f76` |
| round-1 independent QA | `ab6ba104651eee0998df40837eb4030739741d6c4eee0b757cc400ba9a8f9d48` |
| current terminal text CSV (`adjudication/text-final-chunk-03.csv`) | `764e5d582cf45e6e85278087394098d4f0ce601a2973785b3b25734fe607bc32` |

Current position-24 state is Narrative `3/6`: `progression=2`, `pacing=2`, `worldBuilding=2`; `problemSolving`, `strategy`, and `mysteryReveal` remain `unknown`. Tone is `5/7` after the independently accepted `darkness=2`. Round-1 QA specifically left the official volume-2 and volume-3 trial bodies open for `strategy` and `mysteryReveal`; `problemSolving` was already rejected and is not reopened by synopsis repetition.

## Official route access ledger

All routes were opened through the official 講談社 product page first and then its own `試し読み` link. The reader redirects to a session-bound URL with a `cid`; the stable product/trial URLs below are the provenance URLs. Page images rendered in the browser as decrypted reader pages. No image was copied into the repository.

| source | exact stable URL | sourcePublishedAt | access result and direct observation |
|---|---|---:|---|
| 講談社 `黒月のイェルクナハト（2）` product | https://www.kodansha.co.jp/comic/products/0000419091 | `2025-10-17` | Official page rendered with matching title/creator, volume-2 copy, and a `試し読み` link. Copy repeats Noa's defeat, recognition of power shortage, practical training, and bloody battle; it does not describe a plan, deduction, or reveal. |
| 講談社 volume-2 official trial | https://www.kodansha.co.jp/comic/products/0000419091/trial | `2025-10-17` | Session-bound reader rendered the exposed sequence in order: cover/title/contents, the opening of chapter 7 `Mです`, then a bedroom/cohabitation sequence, and the reader end card. No rescue, tactical operation, clue chain, or truth reveal is exposed. |
| 講談社 `黒月のイェルクナハト（3）` product | https://www.kodansha.co.jp/comic/products/0000424213 | `2026-02-17` | Official page rendered with matching title/creator, volume-3 copy, and a `試し読み` link. Copy names cohabitation, abduction by Mad Dead Company, a rescue fight, and later bath/laundry/stew routines, but gives no plan or reveal sequence. |
| 講談社 volume-3 official trial | https://www.kodansha.co.jp/comic/products/0000424213/trial | `2026-02-17` | Session-bound reader rendered the exposed sequence in order: cover/title/contents, the opening of chapter 18 `ベッド・イズ・戦場`, then a domestic/intimacy sequence, and the reader end card. The exposed body contains no abduction/rescue event, tactical plan, clue chain, or truth reveal. |

## Bounded trial observations

### Volume 2 trial

The rendered body begins after the contents with chapter 7 `Mです`. The visible pages show the characters returning from an earlier off-panel incident, sleeping, and continuing a bedroom interaction. One page contains a short exchange about what to do next, but it is an intimate/comedic hesitation rather than a described constraint analysis followed by a successful solution. The sequence has no visible training or mastery reward, no tactical counter-plan, and no clue-to-truth progression.

This is direct page observation only. The earlier volume-2 product synopsis remains the bounded source for the already-known `progression=2` and `worldBuilding=2` decisions; the trial does not add an independent Narrative cell.

### Volume 3 trial

The rendered body begins with chapter 18 `ベッド・イズ・戦場`. The visible pages show the protagonist and cohabiting characters negotiating an intimate domestic situation, including hesitation, a proposed next step, and immediate reactions. The exchange is a situational/comedic relationship scene. It does not expose the volume-3 product synopsis' later abduction or rescue, and it contains no tactical operation, persistent problem-solving method, clue accumulation, or truth reveal.

The one moment of choosing how to proceed is not enough for `problemSolving=2`: the Dictionary requires a mixture of ingenuity and direct action, not any dialogue containing a choice. It is also not `strategy=2`: no tactical objective, counter-plan, or resource operation is described.

## Narrative decision

No new Narrative proposal is defensible from the named official routes in this round.

| residual axis | disposition | exact reason |
|---|---|---|
| `problemSolving` | `unknown` retained | Round-1 QA had already rejected the volume-2 defeat/training synopsis as a process ledger. The newly rendered trial pages show bedroom hesitation only; they do not reopen that rejection or establish analysis-plus-action. |
| `strategy` | `unknown` retained | Volume-2/3 product copy names fights, training, abduction, and rescue, while the rendered trial bodies show domestic scenes. No short tactical plan, counter-plan, long-range plan, or resource operation is directly exposed. |
| `mysteryReveal` | `unknown` retained | The product phrase `謎の組織` is only an unresolved label. Neither rendered trial body contains clues, deductions, or a truth-reveal reward. |

Therefore no terminal value, evidence ID, confidence, or gate state is changed. Narrative remains `3/6`; no blocker is authorized by this research note.

## Bounded recheck path

If the official sample changes or a fresh session exposes additional body pages, reopen the stable product links first and then traverse the complete currently exposed volume-2 and volume-3 trial bodies in order. Record page/sequence observations only when they directly match one of these anchors:

1. `problemSolving=2`: a constraint or problem is analyzed and direct action is used to solve it;
2. `strategy=2`: a concrete tactical or short-term plan/counter-plan is executed;
3. `mysteryReveal=2`: a bounded secret/reversal is supported by clues or a visible reveal.

If the routes continue to expose only the chapter-7/18 domestic samples, retain all three cells as `unknown`. A later independent-review pass may only supplement a directly bounded official event and cannot convert the current absence into `0` or authorize `SOURCE_INFORMATION_UNAVAILABLE`.

## Handoff

- official volume-2 and volume-3 trial routes: technically reachable and rendered; qualifying Narrative evidence not present in the exposed bodies
- new Narrative proposal: none
- `problemSolving`, `strategy`, `mysteryReveal`: `unknown` retained
- current terminal text CSV and all adjudication/source/generated/registry/overlay/promotion/blocker files: unchanged
- `reviewedByHuman=false`
