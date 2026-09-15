# Factor evidence collection — non-authorizing input

## 현재 실행 — 2026-09-15

수집자는 공개된 동일 만화 자료를 읽고 원문·출처별 관찰을 남긴다. 판정·승격은 별도 동결 뒤 Sol High의 권한이다. 현재 배정은 Luna Max, 활성 수집·판정 모델 합계 최대 5명이며 수집자가 다시 위임하지 않는다. 일반 작업은 이 파일과 배정 brief/researchRefs를 읽는다. 이전 실험 대화·전체 STATE·planner·완료한 판정 보고서를 새 작품 맥락으로 넘기거나 반복해서 읽지 않는다.

조정자는 새로운 독립 배정에 `fork_turns="none"`을 사용하고 현재 작품의 ID·정체/ISBN·gap·기존 research/HOLD 경로·담당 출력 경로만 전달한다. 연결된 미소비 관찰·반대 근거·최신 HOLD는 생략하지 않으며 필요하면 원본 경로로 읽는다. 동일 자료의 국소 보정은 원래 담당자가 계속할 수 있다. 의미 있는 맥락을 자르는 토큰 상한이나 출처 제한은 만들지 않는다.

현재 candidate에서 이미 eligible인 작품을 제외하고 최신 work별 기록을 확인한 후 배정한다. 옛 backlog는 위치 안내이며 현재 미수집의 증거가 아니다. 기존 `evidence-review`는 관찰 검토, `gate-review`는 남은 승격 조건, `metadata-review`는 정체/서지 보완으로 보내며 일괄 재수집하지 않는다. 변하지 않은 HOLD는 구체적 새 관찰·접근 변화·확인된 오류가 있을 때만 재개한다.

## 원문은 도구 반환값에서 바로 저장

공통 진입점은 `scripts/catalog_authoring/collect_factor_evidence.mjs`다. 코드 경로는 저장소 루트 기준이며 작업 자료는 `data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/`에 둔다. 실제 검색 전에 `startCollection(directory, workId)` 또는 `node scripts/catalog_authoring/collect_factor_evidence.mjs start <assigned-dir> <workId>`로 시작한다.

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
- 영화/애니 사건·AniList·유료 자료는 만화 근거가 아니다. Grok은 사용하지 않는다. 매체를 먼저 확인하며 도메인/키워드만으로 해당 글을 배제하지 않는다. 무효 자료는 탐색 이력으로만 보존한다. 만화 이미지에서 서사 관찰을 채택하는 경로는 AUTHORING.md의 별도 제한을 유지한다.
- HTTP가 적합하면 `fetchSelectedSources(directory, selectedUrls)` 또는 기존 fetch CLI를 사용한다. 알려진 독립 URL마다 shell 명령을 나누지 않는다. 도구는 실행당 2개·host당 1개로 처리하며 전역 제한은 아니다. 공개 비인증 GET만, 기본 15초/8 MiB, 일시 오류는 최대 1회 재시도한다. 긴 Retry-After·실패/부분 bytes를 보존하며 인증·차단 우회는 하지 않는다.
- JS/뷰어 셸은 본문 독해가 아니다. 도움이 되는 미시도 정상 browser/CUA·문서 접근으로 바로 전환할 수 있으며 HTTP 실패가 선행 조건은 아니다. 유료·로그인·종료·접근 제한은 같은 요청을 반복하거나 숨겨진 URL/API로 우회하지 않고 다른 공개 자료를 찾는다.
- 실제 source에서 확인한 작성자·날짜·사건만 source에 귀속한다. 다른 페이지의 정보로 readAudit를 채우지 않는다. 작성자 미확인은 author="" / authorRole="unknown". search-snippet·partial-body·full-body·blocked를 실제 읽은 범위로 구분한다. 읽지 못한 뷰어 본문은 excludedSections에 남긴다.
- readAudit는 실제 접근 가능한 관련 구간을 한 번 읽은 기록이고 capture는 보존 기록이다. bytes/complete로 전체 독해를 증명하지 않는다. blocked는 coveredSections와 claimCandidates가 비어야 한다. 실제 절·권/회차·제목·작성자·날짜 정밀도를 유지하고 모르는 날짜를 만들거나 기존 날짜를 새 날짜로 바꾸지 않는다.
- whole_work가 목표이며 초반 1~3권·전권·직접 패널·선택적 Art를 추가 의무로 만들지 않는다. Genre ≥1, Theme ≥1, Narrative known ≥4/6, Tone known ≥5/7은 후속 판정 기준이다. collector의 충분성 예상은 판정이 아니다.
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
    language: "ja", // or ko / en
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

identity·candidateOnly=true·reviewedByHuman=false·grokUsed=false·paidSourceUsed=false·elapsedSeconds는 helper가 넣는다. 명시한 값은 그대로 검증하고 workId 불일치를 거부한다. source의 independentFrom/claimCandidates는 생략하면 빈 배열이다. 필요한 짧은 힌트만 {targetType, targetId, anchor}로 쓰며 수치 판정은 넣지 않는다. 독립성을 확인하지 못하면 independentFrom은 비운다. publisher의 workOwned=true는 동일 작품이라는 뜻이지 작성자 역할 인증이 아니다.

remainingGaps는 필수 판단을 막는 실제 부족분만, 한계·미독해 권·선택적 Art는 limitation에 적는다. EVIDENCE_FOUND는 관찰이 있다는 뜻이며 전체 coverage PASS가 아니다. 날짜는 readAudit에 한 번만 기록하고 관측 정밀도/소수초를 임의 변경하지 않는다.

write는 기존 구조 검사를 한 번 수행하고 성공 JSONL을 덮어쓰지 않는다. 실패하면 기존 응답·객체를 유지해 해당 필드만 고치고 새 원문을 쓰지 않는다. 보존 원본의 정정은 새 배정 디렉터리에 원본 참조와 함께 남긴다.

## 완료·영구 보존

helper의 research-written 이벤트가 완료 통지다. 성공 경로/SHA를 즉시 반환하고 별도 REPORT·전체 저장소 감사·추가 메시지를 기다리지 않는다. 닫힌 디렉터리에 append하지 않는다. 조정자는 실제 파일/이벤트 SHA를 대조한 뒤 기존 direct collection CLI로 짧은 구조 확인·SQLite 저장/백업을 수행한다. 수집자는 공유 writer·freeze·seal·publish를 실행하지 않는다.

실제 접근/독해/작성 전환에만 `recordProgress(directory, phase, note?)`를 쓸 수 있다. phase는 access-started/access-changed/reading-finished/writing-started다. 의무 검증 단계가 아니며 과거 시각을 추정하지 않는다. 동시 작업 elapsed를 합산 worker 시간으로 보고하지 않는다.

출판사 판본 페이지를 취득했다면 같은 응답의 소개 원문·정확한 Work/ISBN·서지 입력을 함께 보존한다. 완전한 HTTPS 200 HTTP bytes와 실제 시각의 기존 publisher receipt만 사용하고 browser 발췌를 그 receipt로 바꾸지 않는다. 해당 시각/응답 결속이 없으면 서지 미완료 한계를 적고 Factor를 다시 수집하지 않는다. 상세 필드가 필요할 때만 docs/catalog-expansion/03-local-authoring-storage.md의 출판사 소개 절을 읽는다. 서지 반영은 조정자가 기존 직렬 importer로 수행한다.

자료는 source 밖 로컬 작업 SQLite에 영구 저장·백업하며 `.workspace`에는 임시 출력만 두고 원본은 `data/local/catalog-authoring/`에 보존한다. 호환 링크를 생성하지 않는다. 변경 전 원문·실패본·형식·시각을 보존한다. 현재 원본/보충 raw 전체는 기존 provenance-root로 동결 입력에 전달할 수 있다. 보존 성공·구조 PASS는 출처의 진실성이나 판정 권한이 아니다.
