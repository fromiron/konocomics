# Authorized Evidence Panel follow-up request

## 2026-09-21 수집 범위: 전권 확인 금지

모든 권을 순서대로 확인하거나 전체 권수·완결권·전권 독해를 승격 완료 조건으로 삼지 않는다. 대표 ISBN과 해당 판본의 서지를 확인하고, 확보된 작품 소개·리뷰로 필요한 관찰이 충분하면 수집을 종료한다. 구체적인 필수 판정 gap을 해결할 가능성이 있는 특정 권 소개·리뷰만 선택적으로 추가 확인한다. `whole_work`는 주장의 범위이며 모든 권을 읽었다는 증명 요구가 아니다. 실제 읽은 범위와 한계는 정확히 남기되 전권 미확인 자체는 HOLD·재시도·추가 수집 사유가 아니다.

대표 ISBN이 3권·6권 등 중간 권이면 그 권의 제목·권수·URL을 정확히 결속하면 충분하며 1권으로 교체하지 않는다. 기존 ISBN과 권수의 연결이 틀렸다면 새 수집 revision과 배치 summary에 정정 근거·경로·SHA를 남기고 다음 동결에 반영한다. 과거 원문·동결·판정은 보존한다.

## 2026-09-21 현재 배치: Art 작업 전면 제외

사용자 지시로 이번 수집·승격 작업에서 Art 4축(`artRealism`, `artDensity`, `visualSoftness`, `motionImpact`)은 조사·판정 대상에서 제외한다. Art용 이미지 확인, 리뷰 근거 평가, 독립 출처/정족수 확인, 추가 검색, 신규 known claim을 수행하지 않는다. 기존 원문에 Art 서술이 있어도 별도 분석하지 않는다. 스키마가 요구하는 새 Art 축 표기는 `unknown`으로 유지하고 이번 범위 제외임을 기록한다. 기존 accepted prior·동결 입력·판정은 보존만 하며 변경하지 않는다. Art gap은 추가 수집 목록·재시도 조건·승격 차단·미완료 사유에 넣지 않는다. 이미 완료된 유효 결과는 이 지시만으로 재판정하지 않는다. 향후 Art 작업은 별도 사용자 요청 때 진행한다.

## 2026-09-21 사용자 확정: 포르노 작품만 제외

Catalog의 성적 콘텐츠 제외 기준은 **porn / non-porn**이다. 성인등급, 폭력·출혈·잔혹 묘사, 노출·성적 장면의 존재 자체는 제외 사유가 아니다. 『베르세르크』처럼 성인등급인 비포르노 서사 만화는 허용한다. 작품의 주된 성격이 포르노인지 확인하며 별도의 비성인·일반 독자 등급 증명 수집은 요구하지 않는다. 해당 작품의 출판사·레이블 분류로 비포르노임이 확인되면 충분하며 그 확인으로 종료한다. 여러 레이블을 가진 출판사는 해당 작품의 레이블만 확인한다. 성적 소재·노출·성적 장면은 작품적 표현으로 허용하며, 에피소드별 표현 강도·무해성·전연령 적합성을 추가 조사하거나 미확인 gap/HOLD 사유로 삼지 않는다. 실제 포르노 분류 충돌이나 작품/레이블 식별 불가가 있을 때만 그 분류를 좁게 확인한다. 추천 선정 맥락과 팩터 근거는 별도 계약이다.

새 판정은 `non-pornographic-work` → `non-porn` / `SAFE`, `pornographic-work` → `porn` / `BLOCKED_SAFETY` (`SAFETY_PORNOGRAPHIC_WORK`)를 사용한다. 판단 불명은 `classification-unresolved`로 보존한다. SAFE는 아동 적합성이나 무폭력 인증이 아니다. 기존 `non-adult` 등 분류는 과거 artifact 호환용으로 유지하며 성인등급만으로 차단한 HOLD는 새 계약을 동결한 revision에서 재검토한다. 과거 frozen·판정은 수정하지 않는다.

## Version-specific execution: followup-v3

### 2026-09-24 clarification for new frozen inputs

The source need not literally print the internal enum `non-pornographic-work` or a declaration of “non-porn.” Assess the actual publisher/imprint classification bound to this Work. Preserving accepted prior claims does not prohibit adding an unsupported-as-yet Genre or Theme when eligible observations support it; preserve existing values and adjudicate only the missing fact. A volume product page can contain reviews of different scopes: assess each review's stated scope and observations instead of excluding the entire page. Do not infer a Theme such as school or foundFamily merely from classmates or a romantic relationship. N/T exhaustion requires actual group-specific investigation and stopping reasons; an empty remainingGaps list or a recommendation-URL correction is not an exhaustion record.

For `panel-input.json.schemaVersion=authorized-evidence-panel-followup-v3`, this paragraph replaces the older preparation/output sequence below. The input already contains raw observations, identity/ISBN/source-registry facts and the frozen `DECISION-SCHEMA.json`; `contextEvidenceId:null` explicitly means unjudged. The assigned fixed Luna session makes the source-use, identity, safety, context and Factor decisions together once after freeze, returning `factor-adjudication-v3` only. No pre-freeze semantic approval, numeric draft, second source review or manual seal is required. Source decisions name the adopted uses (`identity`, `safety`, `context`, `factor`); unlisted sources are not adopted. Source references must remain within the same Work. Context chooses exactly one source whose URL is in the frozen packet's support URLs. Identity/safety/context cannot be inferred from old generated model claims. A work that cannot establish these gates returns `disposition:hold`, a concrete reason and retryCondition, without inventing 17 axes or SAFE. An adjudicated work retains the coverage, evidence and unknown rules below. The runner creates and validates the derived ledger, context, safety and publication artifacts from this exact decision; the raw input is never rewritten. Legacy v2 execution and existing frozen requests keep their original meaning.

## 2026-09-14 single adjudication

The assigned fixed Luna session owns preparation, post-freeze adjudication and seal completion. The coordinator executes the assigned freeze/seal commands that use shared storage and returns their receipts immediately. This is command execution, not another semantic review or approval. Keep model and source waits outside the shared run. Reuse validated unchanged prior rows with their exact original semantics instead of retyping them; the final complete ledger and existing prior checks remain required.

Prepare source identity/safety and assess whether the required groups have plausible evidence, then freeze. Write one complete adjudication input after freeze (structured decisions or the existing ledger); do not produce a numerical draft followed by an identical final ledger or duplicate preparation/adjudication reports. Review all bound original and supplemental observations together. A prohibition on searching old URLs again does not exclude their preserved valid evidence. Collector candidate/gap labels are navigation, not a limit on supported claims. Keep explicit unknowns and actual source scope; do not impose first-three-volume, all-volume, or optional-Art quorum requirements on ordinary text claims. A concrete prior interpretation error warrants targeted reconsideration; unchanged valid Sol judgments do not need coordinator review.

Leave the two binding digest fields empty for new unbound claims; seal serializes the evidence/citation sets and binds the digests. Bound prior/correction rows remain unchanged. Use seal-result with output-root and ledger; the frozen pair is read from lineage. No separate numeric draft, freeform PASS report or hand-written result manifest is required.

Before preparing or returning new work, read the section `반복 오류 예방 — Luna·Sol 반환 전 확인` in docs/catalog-expansion/01a-promotion-method-operational-amendment.md. Apply its observed-error fixes through existing checks; do not add duplicate review gates.

Current review adjustment (2026-09-13): apply docs/catalog-expansion/01a-promotion-method-operational-amendment.md, section 사용자 승인 검토 조정. Reuse completed unchanged review; require only the actual anchor and missing coverage, and separate bibliography/authority repair from evidence collection.

Current assignments (2026-09-24): one assigned fixed GPT-6 Luna/xhigh session collects and adjudicates its Work; the coordinator handles publication. Use whole_work for new assessments under docs/factors/annotation-guide.md: no first-1–3-volume restriction or mandatory full-series reading. Preserve actual source scope, existing approved confidence and eligibility; the scope-policy change alone is not a reason to reassess or demote prior approved data. Early/late changes are optional observations in existing factors only when acquired reviews explicitly support them.

Adjudicate only your frozen chunk. A prior ledger is not self-authorizing: each retained accepted claim must match its manifest-bound original adjudication and original same-work evidence. Database labels, extractor names, and generated correction notes are insufficient. Re-derive every new claim from `supplemental-evidence.csv` and the copied work packet. Collector claim candidates are navigation hints, never authority.

Preserve old artifacts as history, not as an obligation to preserve an incorrect value. Axis REPLACE/WITHDRAW requires a separately frozen decision binding the exact prior claim, current database row, and result semantic digests. The publisher applies these decisions copy-on-write, verifies the corrected work's complete Axis snapshot, and leaves insufficient-coverage works libraryOnly. It may demote a corrected previously eligible AEP work; Gold and legacy authorizedModelPanel remain protected. A ledger-only Genre/Theme REPLACE/WITHDRAW is supported when that exact membership is absent from both frozen and current databases, bound with baseline_absent_tag_digest(workId, factKey). WITHDRAW omits the result row; REPLACE follows ordinary PASS publication. Stored Genre/Theme REPLACE is also supported when its full storage/provenance binding is identical in frozen and current databases and the new accepted result preserves the exact membership/value, using baseline_stored_tag_digest(workId, factKey, row). Existing stored rows and old evidence remain unchanged; the corrected claim and evidence are separately bound. Stored membership/value changes or withdrawals remain an implementation limit to report, not a policy prohibition. Never rewrite old input or silently omit prior claims.

Recommendation expansion is the first priority. Use the verified current candidate and latest work-specific research/HOLD/publication records for assignment; old planner queues are historical navigation only. Review already collected, unconsumed required-gap observations before ordering more collection. Blocked works without new relevant same-work observations remain in the backlog with a concrete retry condition, not permanently excluded. Source hints and coverage distance are not promotion forecasts or claim authority. Resolve retained claims against their original authority once; do not repeat an unchanged completed semantic review without new evidence, a concrete error or an applicable contract change. Art work is excluded from the current batch; resume it only on a separate user request.

For each work output exactly 17 Axis rows plus any accepted Genre and Theme rows. Apply the Factor Dictionary 0/2/4 anchors first and 1/3 only for genuine intermediate cases. Missing evidence is `unknown`, never zero. Only `motionImpact` may be `notApplicable`. Do not average conflicts.

Stop further searches when evidence is sufficient, but include every valid Genre/Theme already supported by the material read; the minimum is not a reason to discard observations.

PASS requires Genre ≥1, Theme ≥1, Narrative known ≥4/6, Tone/Relationship known ≥5/7. Art is excluded from this batch and is not a PASS requirement. PASS also requires the frozen recommendation-context condition. Otherwise return `BLOCKED_FACTOR`; this is evidence incompleteness, not rejection of audience support.

Every newly known claim must cite same-work supplemental evidence with an exact HTTP(S) URL, concrete observation, limitation, entry scope, and finite canonical decimal confidence in `[0,1]`. Do not use model evidence for a new known claim. Prior accepted claims may retain evidence only after exact original claim/evidence resolution, including the original manifest-bound correction chain where applicable. Source verification does not replace semantic review against the Factor Dictionary. Corrected BLOCKED works persist their validated final Axis values, but new Genre/Theme and ordinary non-correction BLOCKED claims remain in the ledger until the existing publication gates permit them; report panel and database coverage separately.

Required flags: `authorityKind=authorizedEvidencePanelV1`, `candidateOnly=true`, `reviewedByHuman=false`. Grok and paid sources are excluded; AniList cannot authorize a claim.

Current authoring CLI path: write the assigned job's `decisions.json` (factor-adjudication-v2, documented in AUTHORING.md; existing v1 remains supported) or the existing `adjudicated-ledger.csv`, not both. Explicit new claims, frozen retained-claim references and unknown groups must cover all 17 axes and all accepted tags. The seal tool projects structured input into the existing ledger without choosing values. In v2, unknownGroups omit evidenceIds; the tool emits empty evidence/citation/value/confidence fields only for the explicitly named unknown axes. For a result retry, keep the original frozen input and supply a new --result-output-root to seal-result and the same path to publish. Do not refreeze or rebind an unchanged input merely because result encoding failed. `authorityArtifactDigest` and `citationSetDigest` may be blank as allowed by the existing tool; other required decisions must be explicit. Pass `seal-result --decisions <file>` or `seal-result --ledger <file>` and the assigned frozen output to the coordinator for immediate serial execution. Do not manually create the panel-result directory or its promotion ledger, summary, review, or manifests: the seal tool generates them without choosing claim values. The files below remain required final artifacts, not six separate model-writing tasks. Historical frozen requests and their artifacts remain unchanged.

Required final files in the assigned output chunk:

- `evidence-panel-ledger.csv`
- `promotion-ledger.csv`
- `evidence-panel-summary.json`
- `authorized-evidence-panel-v1.md`
- copied `PANEL-INPUT.sha256`
- `PANEL-RESULT.sha256` binding the preceding five files

Use the field layouts defined in `docs/catalog-expansion/02-authorized-evidence-panel-v1.md` and the frozen request. All semicolon lists must be code-unit sorted and duplicate-free.

## N/T 부족 예외 — 2026-09-23

동결 입력에 `narrativeToneExhaustion`과 `narrative-tone-exhaustion-v1` 계약이 있을 때는 그 기록의 그룹에 승격 자격 예외가 적용된다. source/identity/safety/context가 성립하면 N/T 부족만으로 disposition=hold를 쓰지 말고, 실제 supported claim과 unknownGroups를 제출한다. Genre/Theme 및 나머지 차단은 유지한다. 예외는 0/2/4 값의 근거가 아니며 기존 값·unknown 의미를 바꾸지 않는다. 해당 선언이 없는 과거 동결 입력에는 소급 적용하지 않는다.
