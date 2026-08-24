# Oracle review: review-language signal policy

- Repository: `fromiron/konocomics`
- Surface: ChatGPT in-app browser, Chat tab
- Model preset: `Pro`
- Conversation: `https://chatgpt.com/c/6a8c5626-2648-83e8-8d25-4a1142ea825d`
- Oracle CLI version checked before fallback: `0.18.0`
- Context SHA-256: `8402b41ccdadc1eecc23d3fba12d8a1cc3126c5b996d163412966b010ed3c9db`
- Input contract: read-only review; GitHub tool allowed; local working-tree context authoritative
- Final disposition: policy decision acceptable; current edited section FAIL; PASS after exact corrections and staging isolation invariant

## Raw response

12m 29s 동안 처리함
1. Verdict

FAIL as written. The underlying decision is sound and can become contract-safe without changing the frozen Factor Dictionary, 17 axes, coverage rules, Gold 150, or recommendation formula. However, the new section currently contains two contract-level omissions and several ambiguities:

The “decompose into softness/density/proportion/motion” sentence can be read as allowing user-review language to produce Art values.

The future-model sentence requires human blind validation but omits the required separate versioned schema.

“Review signals do not affect scores” is not scoped tightly enough to distinguish review-language signals from existing reviewAverage/reviewCount market metadata and explicit user feedback.

“현재 batch” is factually ambiguous inside the Pilot 001 report.

The claimed three-model consensus is not substantiated by review artifacts in the supplied packet.

The SSOT itself supports the intended policy: user-review text may be secondary evidence only for concrete entry-scope text observations, never establishes an Art value, and staging is outside the product runtime. 

붙여넣은 텍스트 (1)(20260824-143028) +1

 The edited section does not yet express those boundaries precisely enough. 

붙여넣은 텍스트 (1)

2. Exact corrections required
A. Correct the Art “decomposition” sentence

Current wording:

실제 관찰이 있으면 선의 부드러움·밀도·비례·동세처럼 현재 사전의 비성별 표현으로 분해한다.

This is unsafe for two reasons:

선의 부드러움, 비례, and 동세 are not independent dictionary features. The canonical entities are exactly artRealism, artDensity, visualSoftness, and motionImpact.

“실제 관찰” does not identify who observed what source. In context, it can be interpreted as a concrete observation made by a reviewer, even though user art opinions can never establish Art values.

The dictionary defines the four Art axes and their exact rubrics; notably, motionImpact concerns speed, impact, and emphasized movement—not generic “dynamic posing.” 

붙여넣은 텍스트 (1)(20260824-143028)

 The promotion contract additionally requires an entry-scope edition bridge, at least six readable internal pages, two scene contexts, and a continuous sequence for motionImpact. A user art opinion is expressly insufficient. 

붙여넣은 텍스트 (1)(20260824-143028)

Replace the sentence with:

여성향/남성향 그림체 같은 성별 코딩 표현은 work-level trait로 정규화하거나 저장하지 않고, source-scoped 감사 문구와 공식 내부 페이지 재검사 가설로만 보존한다. 해당 문구 자체를 Art 값으로 변환하지 않는다. 재검사 후 Art 값을 판정하려면 기존과 동일하게 entry-scope 판본 연결, 판독 가능한 공식 내부 페이지 6쪽 이상, 서로 다른 장면 맥락 2개 이상을 충족해야 하며, motionImpact는 연속 동작의 시작·전개 또는 타격·끝을 직접 확인해야 한다. 이 조건을 통과한 직접 픽셀 관찰만 artRealism, artDensity, visualSoftness, motionImpact의 기존 0/2/4 기준으로 주석할 수 있고, 유저평 문구는 state·value·confidence를 만들거나 변경하지 않는다.

This preserves the requested non-gendered decomposition while ensuring that decomposition happens from qualifying pixels, not from the review label.

B. Distinguish bare evaluative phrases from permitted concrete text observations

Immediately before the new section, the method permits repeated, concrete, entry-scope observations from multiple independent user reviews as secondary evidence for eight text axes. 

붙여넣은 텍스트 (1)(20260824-143028)

 The new paragraph can be misread as overriding that policy because 감동적 could superficially resemble emotionalWarmth or characterArcWeight.

Add:

여기서 비점수 신호로 취급하는 대상은 감동적, 예쁘다, 액션이 좋다처럼 축 기준·반복 구조·entry scope를 확정하지 못하는 평가적 문구 자체다. 복수 독립 리뷰에서 확인된 구체적 entry-scope 관찰을 기존 §3의 텍스트 Factor 보조 Evidence로 검토하는 절차는 별개이며, 평가적 문구를 Axis 이름이나 값으로 직접 매핑해서는 안 된다.

This distinction is necessary because:

감동적 is not synonymous with emotionalWarmth.

액션이 좋다 cannot become motionImpact, nor can it create the nonexistent actionIntensity axis. The dictionary explicitly excludes actionIntensity; combat is an existing Theme with its own centrality contract. 

붙여넣은 텍스트 (1)(20260824-143028)

C. Narrow “review signals do not affect scores”

The statement is correct only when “signals” means text-derived review-language staging signals. It is not correct as a broad statement that review-derived data never affects the system:

reviewAverage and reviewCount are frozen market signals used in Taste tie-breaking. 

붙여넣은 텍스트 (1)(20260824-143028)

The experimental G1/G2 Baseline assigns 30% to the Bayesian market score. 

붙여넣은 텍스트 (1)(20260824-143028)

The implementation reads reviewAverage and reviewCount into baselineScore and its market contribution. 

붙여넣은 텍스트 (1)(20260824-143028)

reviewCount determines the popular-work set used by the hidden-work policy. 

붙여넣은 텍스트 (1)(20260824-143028)

Explicit user feedback artStyleDislike remains a scored negative reason using the already-known Art-group similarity. It is not an aggregated review-language feature. 

붙여넣은 텍스트 (1)(20260824-143028)

Add this qualification:

이 금지는 외부 유저평의 문구에서 추출한 review-language staging signal에만 적용한다. 기존의 수치형 reviewAverage·reviewCount 시장 계약과 사용자가 직접 선택한 artStyleDislike 등 profile reason 계약은 변경하지 않는다. 다만 review-language signal을 이들 market/profile 필드로 변환하거나 자동 입력해서는 안 된다.

D. Add the missing versioned-schema requirement

Current ending:

…사람 블라인드 검증을 통과하기 전에는 별도 review-signal 모델을 열지 않는다.

“별도 모델” is not enough. It could still reuse AxisId, mutate Work.axes, or feed new contributions into the v1 engine.

Replace it with:

향후 review-signal을 점수화하려면 현재 v1 Factor Dictionary·Work axes·추천 산식과 분리된 새 versioned schema와 engine version을 먼저 정의해야 한다. 해당 schema는 Gold 150, 현재 Axis·Genre·Theme, coverage, eligibility, contribution, explanation 계약을 변경하거나 재해석해서는 안 된다. 점수·순위·설명에 사용하기 전 실제 사람 블라인드 검증을 통과해야 하며, model-panel 승인이나 synthetic pilot은 이 human gate를 대체하지 않는다.

That last sentence is required because the current product specification treats human validation and the user-authorized model-panel path as different, non-substitutable decision bases. 

붙여넣은 텍스트 (1)(20260824-143028)

E. Replace the ambiguous batch scope

현재 batch is unclear because the section appears under Pilot 001, while the surrounding report also documents Batch 002 and Batch 003.

Use one of these exact scopes:

For a global policy: promotion-evidence-v2가 적용되는 모든 catalog-expansion batch의 staging

For a historical Batch 003 decision: Batch 003 staging

For a global rule, the normative wording should also appear in docs/catalog-expansion/01-promotion-method.md or data/staging/catalog-expansion/README.md; the quality report should only state which batch applied it. The method document already declares itself applicable from Pilot through all batches and freezes the existing contracts. 

붙여넣은 텍스트 (1)(20260824-143028)

F. Correct or substantiate the three-model consensus claim

The supplied packet contains the assertion that Gemini, Grok, and Local Codex agreed, but it does not contain the three underlying review outputs, their verdict text, or their output hashes. The packet summary lists only the SSOT documents and selected domain files. 

붙여넣은 텍스트 (1)

Therefore, either:

remove the named-consensus sentence and state the rule directly from the SSOT; or

add the exact artifact paths, common input SHA-256, exact model identities, independent verdicts, and output SHA-256 values.

This is an evidence/provenance correction, not a reason to reject the policy itself.

3. Boundary required to prevent accidental scoring

Add a staging isolation contract with these enforceable invariants.

3.1 Storage isolation

A review-language signal must live in a dedicated staging-only artifact. The signal row itself must never be copied into:

factors.csv, genres.csv, or themes.csv

data/source Factor values or confidence

promotion overlays or recommendation context

marketSnapshot.reviewAverage / reviewCount

UserWorkRecord.positiveReasons

any NegativeReasonId, including artStyleDislike

contribution or explanation lexicons

generated runtime catalog output

The existing staging contract already states that staging is not loaded by the runtime. 

붙여넣은 텍스트 (1)(20260824-143028)

3.2 Search-priority isolation

A signal may only:

enqueue or reorder a qualifying official-source reinspection; or

raise a conflict warning requiring reinspection.

It must not:

determine whether a work receives the standard research procedure;

change evidence authority, page-count, scene-count, scope, or quorum requirements;

satisfy or fail coverage;

create a blocker;

change catalog role or eligibility;

stop research earlier because a signal is absent.

Any eventual Factor change must be supported independently by qualifying evidence and remain reproducible after removing the original review-language signal.

3.3 Deterministic no-op check

Add a validation invariant:

With Factor/Evidence/adjudication inputs held constant, adding, removing, or reordering review-language signal rows must leave the Gold manifest, promotion registry, generated catalog, recommendation context, coverage result, score snapshots, contributions, and explanations byte-identical.

The current scorer already has the correct runtime shape: only known axis pairs are observed, and contributions are produced only from the frozen Genre, Theme, Narrative, Tone, and Art groups. Unknown pairs produce no observations or contributions. 

붙여넣은 텍스트 (1)(20260824-143028)

 Explanations are likewise restricted to actual contribution identities. 

붙여넣은 텍스트 (1)(20260824-143028)

3.4 No direct phrase mapping

Validation should reject any rule equivalent to:

"예쁜 그림"       → visualSoftness = 4
"감동적"          → emotionalWarmth = 4
"액션이 좋다"     → motionImpact = 4
"여성향 그림체"   → any work-level boolean/tag/axis

A signal can initiate inspection, but it cannot be an annotation rule.

Final disposition

Policy decision: acceptable.
Current edited section: FAIL.
After the corrections and staging-isolation invariant above: PASS.

No change to the frozen dictionary, Gold 150, coverage thresholds, or recommendation formula is warranted. The included runtime recommendation code already respects the intended scoring boundary; the remaining risk is the staging-to-source/promotion ingestion boundary, whose validator and promotion implementation were not included in this Repomix subset.

출처

