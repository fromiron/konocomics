# Factor evidence collection — non-authorizing input

현재 확정 사양 · 갱신일: 2026-09-27

이 문서는 수집 단계의 실행·원문·관찰 계약이다. 사전 리드의 JSON 규격·자료 적격성은 [사전 수집 리드 규격](user-source-leads.md)에 정의한다. 과거 규칙은 Git 이력에서 확인한다.

## 수집 범위

모든 권을 순서대로 확인하거나 전체 권수·완결권·전권 독해를 승격 완료 조건으로 삼지 않는다. 대표 ISBN과 해당 판본의 서지를 확인하고, 확보된 작품 소개·리뷰로 필요한 관찰이 충분하면 수집을 종료한다. 구체적인 필수 판정 gap을 해결할 가능성이 있는 특정 권 소개·리뷰만 선택적으로 추가 확인한다. `whole_work`는 주장의 범위이며 모든 권을 읽었다는 증명 요구가 아니다. 실제 읽은 범위와 한계는 정확히 남기되 전권 미확인 자체는 HOLD·재시도·추가 수집 사유가 아니다.

대표 ISBN이 3권·6권 등 중간 권이면 그 권의 제목·권수·URL을 정확히 결속하면 충분하며 1권으로 교체하지 않는다. 기존 ISBN과 권수의 연결이 틀렸다면 새 수집 revision과 배치 summary에 정정 근거·경로·SHA를 남기고 다음 동결에 반영한다. 과거 원문·동결·판정은 보존한다.

## Art 제외 범위

사용자 지시로 이번 수집·승격 작업에서 Art 4축(`artRealism`, `artDensity`, `visualSoftness`, `motionImpact`)은 조사·판정 대상에서 제외한다. Art용 이미지 확인, 리뷰 근거 평가, 독립 출처/정족수 확인, 추가 검색, 신규 known claim을 수행하지 않는다. 기존 원문에 Art 서술이 있어도 별도 분석하지 않는다. 스키마가 요구하는 새 Art 축 표기는 `unknown`으로 유지하고 이번 범위 제외임을 기록한다. 기존 accepted prior·동결 입력·판정은 보존만 하며 변경하지 않는다. Art gap은 추가 수집 목록·재시도 조건·승격 차단·미완료 사유에 넣지 않는다. 이미 완료된 유효 결과는 이 지시만으로 재판정하지 않는다. 향후 Art 작업은 별도 사용자 요청 때 진행한다.

## 안전 분류

Catalog의 성적 콘텐츠 제외 기준은 **porn / non-porn**이다. 성인등급, 폭력·출혈·잔혹 묘사, 노출·성적 장면의 존재 자체는 제외 사유가 아니다. 『베르세르크』처럼 성인등급인 비포르노 서사 만화는 허용한다. 작품의 주된 성격이 포르노인지 확인하며 별도의 비성인·일반 독자 등급 증명 수집은 요구하지 않는다. 해당 작품의 출판사·레이블 분류로 비포르노임이 확인되면 충분하며 그 확인으로 종료한다. 여러 레이블을 가진 출판사는 해당 작품의 레이블만 확인한다. 성적 소재·노출·성적 장면은 작품적 표현으로 허용하며, 에피소드별 표현 강도·무해성·전연령 적합성을 추가 조사하거나 미확인 gap/HOLD 사유로 삼지 않는다. 실제 포르노 분류 충돌이나 작품/레이블 식별 불가가 있을 때만 그 분류를 좁게 확인한다. 추천 선정 맥락과 팩터 근거는 별도 계약이다.

새 판정은 `non-pornographic-work` → `non-porn` / `SAFE`, `pornographic-work` → `porn` / `BLOCKED_SAFETY` (`SAFETY_PORNOGRAPHIC_WORK`)를 사용한다. 판단 불명은 `classification-unresolved`로 보존한다. SAFE는 아동 적합성이나 무폭력 인증이 아니다. 기존 `non-adult` 등 분류는 과거 artifact 호환용으로 유지하며 성인등급만으로 차단한 HOLD는 새 계약을 동결한 revision에서 재검토한다. 과거 frozen·판정은 수정하지 않는다.

## 역할과 배치 경계

반복 작업은 [catalog-worker 스킬](../../.agents/skills/catalog-worker/SKILL.md)과 [배치 계약](01c-catalog-batch-promotion-plan.md)을 따른다. 특정 모델·고정 세션 지정은 요구하지 않으며 역할·실행 추적은 배치 계약 §3을 따른다. 배치 전체 수집·검증·명시적 저장/백업 뒤 승인 범위에서 판정으로 전환하고 작품별 frozen 판정을 진행한다. 작품마다 수집·판정을 교차하거나 정상 작품마다 부모 응답을 기다리지 않는다.

수집자의 책임은 자료 선택·실제 독해·출처별 관찰·불확실성이다. 경로·시각·receipt·JSON 직렬화는 기존 helper에 맡긴다. 현재 작품의 brief·미소비 research·반대 근거·최신 HOLD·원문/receipt를 읽으며 전체 STATE·과거 대화·다른 작품 판정을 근거로 넘기지 않는다. 동일 관찰의 국소 보정은 담당자가 계속할 수 있다.

대상 선정은 조정자가 최신 canonical/candidate·registry·유효 미발행 READY·활성 배정을 대조해 수행한다. 옛 backlog는 위치 안내일 뿐 현재 미수집의 증거가 아니다. 이미 출처를 소진한 HOLD는 새 관찰·접근 변화·확인된 오류가 있을 때 해당 부분만 재개한다. 지침 갱신은 사용자 중단 큐의 재개 승인이 아니다.

## 로컬 원문·사전 수집 자료 우선

기존 유효 raw·research·receipt를 먼저 재사용한다. `.workspace/user-sources/<workId>.json`이 있으면 그 다음으로 제공 URL을 검증한다. [정식 리드 규격](user-source-leads.md)은 작성 형식을 정하며 JSON의 요약·서지 값 자체가 판정 근거나 현재 Catalog 정체성을 대체하지 않는다.

- 해당 작품 파일과 기존 유효 수집만 읽고, 알려진 URL을 직접 열어 실제 본문·대상 작품·권/판본·리뷰 독립성과 읽은 범위를 확인한다. 기존 helper로 실제 반환 원문과 관찰을 보존한다. 기존 유효 캡처를 다시 취득하지 않는다.
- 공식 서지·안전 분류와 registry의 정확한 support URL 문맥을 먼저 확인하고, 제공된 리뷰 중 필요한 근거를 읽는다. 자료가 충분하면 목록 전체를 소진하거나 더 좋은 리뷰를 찾지 않고 종료한다. Art·전권 독해·출처 수 늘리기는 추가 조사 사유가 아니다.
- 추가 검색 횟수·쿼리 수 상한은 없다. 제공 URL 접근 실패, 다른 작품/판본, 실제 필수 사실·관찰 누락 등 구체적 gap을 확인하면 같은 세션에서 검색 방향을 바꾸며 보충할 수 있다. 새 독립 관찰·서지 확인·반대 근거를 얻을 가능성이 있으면 계속하고, gap이 해결되거나 같은 내용만 반복되거나 접근 가능한 관련 경로가 소진되면 종료한다. 근거 소진은 HOLD와 재개 조건, 시간/쿼터/사용자 중단은 중단 사유로 구분한다. 부모의 매 검색 재승인이나 횟수를 채우는 탐색을 요구하지 않는다.
- ISBN·저자 불일치는 공식 원문으로 확인해 서지 관찰에 남기며 조용히 1권/일반판으로 치환하거나 공유 DB를 수정하지 않는다. 원문 확인 없는 points 복사, 근거 부족을 채우는 추정·수치 작성은 금지한다.
- research의 기존 gap 기록에 제공 자료 사용 여부와 추가 검색 사유·횟수를 간단히 남긴다. 별도 중복 보고서를 만들지 않는다. 이 자료에 대한 원문 검증·저장·동결·판정·승격 게이트는 그대로 유지한다.
- 동결 후 추가 근거를 발견하면 기존 입력·결과를 보존하고 새 research revision을 저장·동결한다. live 조사 내용을 기존 판정 입력에 끼워 넣지 않는다. 과거 횟수 제한은 종료됐지만 의미 없는 반복 검색·이번 범위에서 제외된 Art·전권 확보를 위한 연장은 하지 않는다.

수집 종료는 수치 판정이나 coverage 충족 예상으로 결정하지 않는다. 읽은 자료의 고유 관찰·반대 근거·실제 범위를 보존하고, 남은 제공 자료나 허용 검색으로 해결할 구체적 사실 gap이 있을 때만 계속한다. 자료 부족·접근 한계로 종료해도 정상이며 기존 gap에 부족한 사실과 재개 조건을 남긴다. 예를 들어 개그 템포와 목표·상황 변화, 관계 변화와 능력·획득 보상을 구별해 기록하되 이를 필수 조사 항목으로 만들지 않는다.

## 원문은 도구 반환값에서 바로 저장

공통 진입점은 `scripts/catalog_authoring/collect_factor_evidence.mjs`다. 코드 경로는 저장소 루트 기준이며 작업 자료는 `data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/`에 둔다. 실제 검색 전에 `startCollection(directory, workId)` 또는 `node scripts/catalog_authoring/collect_factor_evidence.mjs start <assigned-dir> <workId>`로 시작한다.

session 없는 사용자 제공 PDF·메모·raw는 `start <assigned-dir> <workId> --input <정확한-파일>`에 파일별 `--input`을 반복해 해당 Work collection에 결속한다. helper는 선택한 파일의 원본 바이트·SHA·길이를 보존하고 새 freeze에서 읽을 수 있게 한다. 이것이 실제 독해·관찰·HTTP 응답을 대신하지 않으며 source별 근거와 한계는 기존 절차로 기록한다. 큰 공유 디렉터리 전체를 매 작품 복사하거나 선택하지 않은 사용자 자료를 삭제하지 않는다. 정식 `.workspace/user-sources/` 리드 루트는 새 freeze에서 해당 Work JSON만 사용한다.

**웹 도구의 검색·open·click 반환값은 다음 같은 실행에서 저장한다.** 모델이 원문을 patch·shell·별도 텍스트 파일로 다시 쓰지 않는다. 여러 출처가 든 검색 결과도 한 응답으로 보존하며 개별 source의 원문/독해 범위로 자동 인정하지 않는다. 현재 functions.exec에서 로컬 연결 코드를 **한 번만 등록**한다. directory는 배정된 실제 절대 경로다.

```js
const setup = await tools.mcp__node_repl__js({
  code:
    'var evidence = await import("file:///C:/Toys/konocomics/scripts/catalog_authoring/collect_factor_evidence.mjs");' +
    "nodeRepl.write(JSON.stringify({code: evidence.webCollectorCode(" +
    JSON.stringify(directory) +
    ")}));",
});
if (setup.isError) throw new Error("Collection bridge initialization failed");
store(
  "collector-web",
  JSON.parse(
    setup.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n"),
  ).code,
);
```

이후 검색·open·click 호출은 **요청 객체만** 전달한다:

```js
await eval(load("collector-web"))({
  search_query: [{ q: "현재 작품과 필요한 자료" }],
  response_length: "short",
});
```

평가되는 코드는 위 로컬 helper가 생성한 고정 연결 코드이며 웹 응답을 코드로 실행하지 않는다. 연결 함수가 요청 전후 시각·실제 반환값 저장·응답 출력을 담당한다. 원문 저장 코드를 매번 다시 작성하거나 `text(JSON.stringify(response))`로 이스케이프된 원문을 추가 출력하지 않는다. Node REPL을 도구 목록에서 확인하고 사용한다.

저장이 실패하면 인자 없이 `await eval(load("collector-web"))()`를 실행한다. 메모리에 남은 같은 응답을 저장하므로 네트워크를 다시 호출하지 않는다. pending 응답이 있는 동안 다른 요청을 거부한다. 독립 자료는 web 요청 객체의 배열로 묶고 source를 읽는 동안 shared DB writer를 잡지 않는다. 파일/쉘 스크립트를 생성할 필요는 없다.

`recordWebResponse`는 실제 문자열 bytes 또는 JSON 응답을 `web-response-*.body`에 보존하고 원래 request·형식·SHA·도구 시각을 receipt에 기록한다. 그 시각은 원 서버의 갱신/HTTP 취득 시각이 아니며 publisher receipt를 생성하지 않는다. 캐시·발췌·오류·다른 매체가 섞인 응답도 그대로 보존한다. 의미 관찰에는 실제 확인한 source URL과 읽은 범위를 별도로 적는다.

브라우저·문서 등 이 연결이 없는 도구의 기존 자료는 `recordCapture(dir, {kind, url, ...}, body)`로 보존한다. kind는 http-body/browser-text/search-snippet/document-text다. HTTP는 실제 Buffer/Uint8Array만, 텍스트는 실제 도구 원문만 받는다. 관측하지 않은 시각/status/완결 여부는 null이며 요약·번역을 원문으로 쓰지 않는다. 캡처 불가능한 자료는 한계를 적고 확인한 내용만 사용한다. 연결 미지원이 일반 수집을 막는 새 게이트가 되어서는 안 된다.

## 자료 선택과 기록

- 현재 gap에 가장 유용한 동일 만화 자료부터 읽는다. 지정 URL·언어·출처 종류는 순회 목록이 아니다. 알려진 URL은 다시 검색하지 않는다. 독립 검색/열람은 한 호출에 묶고, 상세 결과가 필요할 때만 출력 범위를 늘린다. 한 페이지의 미반환 구간을 읽는 요청과 같은 구간의 중복 요청을 구분한다.
- 첫 3개 출처는 시작 예산이며 최소 개수·최대 조사량·승격 조건이 아니다. 필요한 관찰이 충분하면 끝내고 추가 검색은 구체적 gap에만 한다. 새 자료가 없으면 INSUFFICIENT와 재개 조건을 남긴다. 충분한 자료나 반대 근거를 보고 분량 때문에 숨기지 않는다.
- 도구 반환 원문을 읽은 뒤 **source마다 관찰을 한 번만 작성**한다. 구체적 사건·관계·톤·반대 근거와 실제 범위를 보존하되, 원문 재전사·별도 독해 보고서·17축 사전 판정·관찰을 반복한 notes/claimCandidates는 쓰지 않는다. 의미 관찰만 새로 생성하고 나머지 원문은 저장된 파일을 전달한다.
- 같은 소개가 반복되면 기존 원문과 실제 추가 정보만 남긴다. 소개 개수로 사건·반복·부재를 추론하지 않는다. 공식 소개·편집 자료·독서 범위가 명확한 독립 리뷰·구체적 선정 평문은 실제 내용에 따라 사용할 수 있다. 선정 명단만으로 Factor를 판정하지 않는다.
- 영화/애니 사건·AniList·유료 자료는 만화 근거가 아니다. 매체를 먼저 확인하며 도메인/키워드만으로 해당 글을 배제하지 않는다. 무효 자료는 탐색 이력으로만 보존한다. 만화 이미지에서 서사 관찰을 채택하는 경로는 AUTHORING.md의 별도 제한을 유지한다.
- HTTP가 적합하면 `fetchSelectedSources(directory, selectedUrls)` 또는 기존 fetch CLI를 사용한다. 알려진 독립 URL마다 shell 명령을 나누지 않는다. 도구는 실행당 2개·host당 1개로 처리하며 전역 제한은 아니다. 공개 비인증 GET만, 기본 15초/8 MiB, 일시 오류는 최대 1회 재시도한다. 긴 Retry-After·실패/부분 bytes를 보존하며 인증·차단 우회는 하지 않는다.
- JS/뷰어 셸은 본문 독해가 아니다. 도움이 되는 미시도 정상 browser/CUA·문서 접근으로 바로 전환할 수 있으며 HTTP 실패가 선행 조건은 아니다. 유료·로그인·종료·접근 제한은 같은 요청을 반복하거나 숨겨진 URL/API로 우회하지 않고 다른 공개 자료를 찾는다.
- 실제 source에서 확인한 작성자·날짜·사건만 source에 귀속한다. 다른 페이지의 정보로 readAudit를 채우지 않는다. 작성자 미확인은 author="" / authorRole="unknown". search-snippet·partial-body·full-body·blocked를 실제 읽은 범위로 구분한다. 읽지 못한 뷰어 본문은 excludedSections에 남긴다.
- readAudit는 실제 접근 가능한 관련 구간을 한 번 읽은 기록이고 capture는 보존 기록이다. bytes/complete로 전체 독해를 증명하지 않는다. blocked는 coveredSections와 claimCandidates가 비어야 한다. 실제 절·권/회차·제목·작성자·날짜 정밀도를 유지하고 모르는 날짜를 만들거나 기존 날짜를 새 날짜로 바꾸지 않는다.
- whole_work가 목표이며 초반 1~3권·전권·직접 패널·이번 범위에서 제외된 Art를 추가 의무로 만들지 않는다. Genre ≥1, Theme ≥1, Narrative known ≥4/6, Tone known ≥5/7은 후속 판정 기준이다. collector의 충분성 예상은 판정이 아니다.
- 근거 없음은 unknown이지 0이 아니다. 목표만으로 strategy, 나이/환경 변화만으로 progression, 교훈만으로 mysteryReveal을 만들지 않는다. Theme 1에는 실제 에피소드·부소재가 가능하며 반복 핵심만 요구하지 않는다. strategy 2의 구체적 단기 계획·mentalStress 2의 혼합 압박에 4점의 장기성·반복·성공을 추가하지 않는다.
- 기존 researchRefs의 관찰과 보충 자료는 누적 전달한다. 동일 URL·범위·내용의 재서술은 새 근거가 아니다. 보존한 유효 원문을 다시 취득하지 않으며 실제 새로 읽은 내용은 차이를 남긴다. 옛 entry_1_3/HOLD 문구가 현행 whole_work 계약보다 우선하지 않는다.

## 관찰 객체 한 번 → 기존 JSONL

`writeResearchSnapshot(directory, draft)`를 Node REPL에서 직접 호출한다. 파일이 필요한 환경은 기존 `draft.mjs` 객체 하나와 `node scripts/catalog_authoring/collect_factor_evidence.mjs write <assigned-dir> draft.mjs`를 사용한다. 새로운 메모/스크립트 묶음을 조립하지 않는다. 외부 웹페이지 코드를 실행하지 않는다.

최소 객체 형태이며 각 값은 실제 독해로 작성한다:

```js
{
  status: "EVIDENCE_FOUND", // or INSUFFICIENT
  sources: [{
    url: "https://실제-출처",
    sourceFamily: "publisher", // or independent-review / other
    language: "ja", // or ko / en / zh
    entryScope: "whole_work", // 실제 source의 권/회차 범위는 아래에 보존
    workOwned: true,
    observation: "해당 source에서 확인한 구체적 내용 한 번",
    limitation: "이 자료가 확립하지 못하는 부분",
    readAudit: {
      access: "partial-body",
      scopeLocator: "실제로 읽은 절·권·회차",
      coveredSections: ["읽은 구간"],
      excludedSections: ["실제로 읽지 못한 구간"],
      pageTitle: "표시된 제목",
      author: "",
      authorRole: "unknown",
      publishedAt: "",
      retrievedAt: "실제 관측 날짜·시각"
    }
  }],
  remainingGaps: [],
  retryCondition: ""
}
```

identity·candidateOnly=true·reviewedByHuman=false·paidSourceUsed=false·elapsedSeconds는 helper가 넣는다. 새 수집에는 모델별 사용·제외 필드를 생성하지 않는다. 명시한 값은 그대로 검증하고 workId 불일치를 거부한다. source의 independentFrom/claimCandidates는 생략하면 빈 배열이다. 필요한 짧은 힌트만 {targetType, targetId, anchor}로 쓰며 수치 판정은 넣지 않는다. 독립성을 확인하지 못하면 independentFrom은 비운다. publisher의 workOwned=true는 동일 작품이라는 뜻이지 작성자 역할 인증이 아니다.

remainingGaps는 필수 판단을 막는 실제 부족분만, 한계·미독해 권·이번 범위에서 제외된 Art는 limitation에 적는다. EVIDENCE_FOUND는 관찰이 있다는 뜻이며 전체 coverage PASS가 아니다. 날짜는 readAudit에 한 번만 기록하고 관측 정밀도/소수초를 임의 변경하지 않는다.

write는 기존 구조 검사를 한 번 수행하고 성공 JSONL을 덮어쓰지 않는다. 실패하면 기존 응답·객체를 유지해 해당 필드만 고치고 새 원문을 쓰지 않는다. 보존 원본의 정정은 새 배정 디렉터리에 원본 참조와 함께 남긴다.

## 완료·영구 보존

helper의 research-written 이벤트는 해당 collection 작성 완료다. 실제 경로·SHA를 확인하고 별도 REPORT·전체 저장소 감사를 추가 게이트로 만들지 않는다. 닫힌 디렉터리에 append하지 않고 보충/정정은 새 revision에 남긴다. 작업자는 기존 direct collection/저장 helper로 원본·관찰·receipt를 즉시 PERSISTED로 보존한다. 수집 배치 완료·종료/부분 중단에서 실제 BACKED_UP을 확인하고 현재 채팅에 결과와 receipt를 보고한다. hook·부모 통지·ACK는 사용하지 않는다. 수집 단계에서는 수치 판정·seal·publish를 하지 않는다. 승인된 판정 단계로 전환한 뒤 작업자가 prepare/check를 수행한다.

실제 접근/독해/작성 전환에만 `recordProgress(directory, phase, note?)`를 쓸 수 있다. phase는 access-started/access-changed/reading-finished/writing-started다. 의무 검증 단계가 아니며 과거 시각을 추정하지 않는다. 동시 작업 elapsed를 합산 worker 시간으로 보고하지 않는다.

출판사 판본 페이지를 취득했다면 같은 응답의 소개 원문·정확한 Work/ISBN·서지 입력을 함께 보존한다. 완전한 HTTPS 200 HTTP bytes와 실제 시각의 기존 publisher receipt만 사용하고 browser 발췌를 그 receipt로 바꾸지 않는다. 해당 시각/응답 결속이 없으면 서지 미완료 한계를 적고 Factor를 다시 수집하지 않는다. 상세 필드가 필요할 때만 [저장 계약의 출판사 소개 절](03-local-authoring-storage.md#출판사-소개를-수집과-함께-저장)을 읽는다. 서지 반영은 조정자가 기존 직렬 importer로 수행한다.

자료는 source 밖 로컬 작업 SQLite에 즉시 저장하고 [저장 계약](03-local-authoring-storage.md)의 명시적 단계 경계에서 백업한다. 원본은 `data/local/catalog-authoring/`에 보존하며 `.workspace/user-sources/`의 사용자 제공 자료도 보호한다. 호환 링크를 생성하지 않는다. 변경 전 원문·실패본·형식·시각을 보존한다. 현재 Work collection에 결속된 원본·보충 raw는 기존 `--provenance-root`로 동결 입력에 전달한다. session 없는 임의 공유 디렉터리는 전체 복사나 무시 대신 `NEEDS_PROVENANCE_BINDING`으로 거부하므로 먼저 위 명시적 파일 입력을 사용한다. 보존 성공·구조 PASS는 출처의 진실성이나 판정 권한이 아니다.

## N/T 추가 조사 종료 기록

N/T만 근거가 부족하여 추가 조사를 종료한 경우, 실제 확인한 출처와 결과를 보존하고 새 job의 `narrativeToneExhaustion`으로 전달한다. [AEP 계약](02-authorized-evidence-panel-v1.md)의 필드를 사용한다. 해당 그룹을 조사한 기록이 있어야 예외가 적용된다. 승격을 위해 exhausted 상태를 꾸미거나, 추가 확인 없이 기존 URL 목록만 복사하지 않는다. 판정 값은 부여하지 않으며 최종 unknown은 유지한다.
