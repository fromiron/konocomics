"""Reviewed additive policy transitions; never replaces the frozen policy.

Each exact excerpt is a separately reviewed amendment, not a whole-document hash
allowlist. Unknown changes, removals, edits, or movement outside the reviewed
core context require a new compatibility decision or a new frozen input.
"""
from __future__ import annotations

import hashlib
import json
import re

FORMAT = "catalog-policy-compatibility-v1"

# Approved additions are fixed source text, never inferred from live documents.
# Optional N/T and handoff amendments apply only when present in frozen input;
# coverage_exception and immutable-input validation continue to enforce that.
APPROVED_ADDITIONS = ({'id': 'aep-retention-20260926',
  'policy': 'authorizedEvidencePanel',
  'scope': 'operational',
  'text': '## 2026-09-26 보존 기준점 전환\n'
          '\n'
          '[저장 정책](03-local-authoring-storage.md)의 schema v3에서는 검증된 현재 큐레이션 revision을 prior 권한의 읽기 기준점으로 '
          '사용한다. 기존 입력/결과 manifest·원래 claim·동일 Work 원문과 현재 SQL 값의 결속을 이관 때 대조하며, 숫자에서 승인 판정을 역으로 만들지 않는다. '
          'legacy·Gold·미검토 구분과 원래 관찰·한계·unknown을 유지한다. 미완료 frozen/판정은 기존 SHA와 필요한 기준 pair를 그대로 pin한다. 과거 전체 '
          '실행 사본의 영구 보존 요구는 이 보존 정책으로 대체하며, 새 판정의 근거·정족수·안전·승격 계약은 바꾸지 않는다. `PERSISTED`는 내부 영구 저장이고 '
          '`BACKED_UP`은 명시적 단계 경계에서 별도 백업과 readback을 마친 상태다.',
  'before': '# Authorized Evidence Panel V1',
  'after': '## 2026-09-21 사용자 확정: 포르노 작품만 제외'},
 {'id': 'aep-nt-exhaustion-20260923',
  'policy': 'authorizedEvidencePanel',
  'scope': 'new-frozen-input-only',
  'text': '## 2026-09-23 추가 조사 후 N/T 승격 예외 — narrative-tone-exhaustion-v1\n'
          '\n'
          '추가 조사·출처 소진 후에도 Narrative/Tone만 부족하면 해당 축을 `unknown`으로 유지하며 추천 승격할 수 있다. Genre/Theme, 작품·대표 ISBN '
          '식별, 추천 맥락, porn/non-porn, 기존 권한·Gold 보호와 입력 결속은 그대로 검사한다. 아래 기본 N≥4/T≥5 규칙에 대한 작품별 예외이며, 추천 엔진의 '
          'coverage 임계·0.5 수축·고정 가중치는 바꾸지 않는다. Gold 인증을 부여하지 않는다.\n'
          '\n'
          '새 v4 job의 해당 work에 선택 필드 `narrativeToneExhaustion`을 넣는다. `policy`, `workId`, '
          '`representativeIsbn`, `attempts`, `stopReason`을 기록한다. 각 attempt는 실제 추가 조사한 동결 research의 '
          '`sourceUrl`, `gap`(`narrative` 또는 `tone`), '
          '`outcome`(`insufficient`/`unavailable`/`duplicate`/`resolved`), 구체적 `observation`이다. 조사한 그룹만 예외 '
          '대상이다. 횟수·검색 키워드·문구 자동 매칭으로 완료를 추정하거나 실제 조사 없이 기록을 만들지 않는다. 기존 기록이 있으면 그 실제 결과를 재사용한다. Art·전권·성적 '
          '표현강도는 조사 대상으로 추가하지 않는다.\n'
          '\n'
          '예외는 이 정책이 동결된 새 입력 revision에서만 유효하다. 이전 frozen/PREPARED/판정 SHA를 바꾸거나 새 입력에 옛 판정의 SHA만 교체하지 않는다. '
          '기본 기준이 충족되면 `COVERAGE_COMPLETE`, 예외로 승격하면 `NARRATIVE_TONE_RESEARCH_EXHAUSTED`를 기록한다. 별도 '
          '`disposition=hold`는 자동으로 PASS로 바꾸지 않는다.\n'
          '\n'
          '검사·발행은 동일 결속 기록을 읽는다. 발행은 기존 `source_evidence`에 `narrativeToneExhaustionV1` 기록을 추가하여 실제 조사 기록·입력 '
          'SHA·조사 SHA·review reference를 보존한다. 빌드는 현재 AEP review·대표 ISBN·기록 해시가 일치할 때만 '
          '`eligibility.narrativeToneException`을 생성한다. 과거 review의 예외는 새 review에 자동 승계되지 않는다. SQL '
          'schema/table 추가는 없다. 최종 readback은 unknown 보존 및 예외 메타데이터 유무에 따른 추천 산식 동일성을 확인한다.',
  'before': '# Authorized Evidence Panel V1',
  'after': '## 2026-09-21 사용자 확정: 포르노 작품만 제외'},
 {'id': 'aep-evidence-id-provenance',
  'policy': 'authorizedEvidencePanel',
  'scope': 'existing-evidence-binding',
  'text': '같은 리뷰·수상/선정 페이지 URL은 출처 주소이므로 여러 작품이나 새 판정에서 다시 인용할 수 있다. 다만 각 작품이 그 페이지에 실제 등장하는지, 인용한 관찰·범위를 '
          '작품별로 확인한다. `evidenceId`는 URL 자체가 아니라 저장된 근거 행의 식별자다. 기존 ID는 Work·source URL/유형과 저장된 추천 문맥 '
          '결속(`factKey`, citation, scope, observation, limitation 등)이 동일할 때만 그대로 쓴다. 같은 URL이어도 새 판정이 다른 결속을 '
          '만들거나 기존 ID가 선정 provenance 등 다른 용도로 저장돼 있으면 새 ID와 입력 revision을 만들고 기존 행·동결·판정을 보존한다. URL 재인용만으로 새 '
          'raw capture가 생긴 것으로 기록하지 않는다.',
  'before': '선정 근거는 작품이 Catalog에 들어갈 이유를 증명한다. 해당 자료에 실제 사건 구조·빈도·반복 관찰이 없으면 Axis나 Theme 값 근거로 재사용하지 않는다.',
  'after': '## 3. Panel 판정'},
 {'id': 'aep-collection-handoff-20260925',
  'policy': 'authorizedEvidencePanel',
  'scope': 'new-frozen-input-only',
  'text': '2026-09-25 수집 인계 형식: 새 수집 helper는 조사자가 작성한 기존 `narrative-tone-exhaustion-v1` 기록을 선택 sidecar '
          '`COLLECTION-HANDOFF.json`으로 전달한다. `schemaVersion=factor-collection-handoff-v1`, 정확한 '
          '`researchSha256`, `narrativeToneExhaustion` 세 필드를 가진다. Work·대표 ISBN·실제 source '
          'URL·attempt/stopReason은 기존 계약 그대로 검증한다. 신규 v4 research ref의 선택 `handoffSha256`과 frozen '
          'sourceInputBindings/provenance가 원본을 보존하며 기록 충돌이나 SHA 불일치는 준비 오류다. 이 형식은 소진 사실이나 판정 권한을 생성하지 않고 과거 '
          'collector/frozen/HOLD를 변경하지 않는다. 중국어 원문 언어는 `zh`로 기록한다.',
  'before': '## 3. Panel 판정',
  'after': 'Panel은 작품마다 다음 순서로 처리한다.'},
 {'id': 'aep-collection-receipt-binding',
  'policy': 'authorizedEvidencePanel',
  'scope': 'new-frozen-input-only',
  'text': '수집 완료 receipt의 `handoffSha256`은 최초 조립 전에도 예상 sidecar 원본을 식별한다. `collection-events.jsonl`의 같은 '
          'research 완료 기록을 `collectionReceiptSha256`으로 결속하며, 예상 sidecar 누락/변경은 입력 복구 대상이다. 과거 sidecar 없는 '
          '수집분을 자동 조사 소진으로 해석하지 않는다.',
  'before': '중복·별칭·실제 비만화·포르노·비일본 작품은 별도 추천 Work로 만들지 않는다. 근거를 끝내 확보하지 못한 작품은 지지도 탈락으로 삭제하지 않고 코드·근거·재검토 경로가 '
            '있는 `promotionBlocked`로 보존한다.',
  'after': None},
 {'id': 'authority-workspace-v4-20260926',
  'policy': 'authoringAuthority',
  'scope': 'operational',
  'text': '- 2026-09-26 사용자 승인: 작업 저장소 v4의 변경 순번·증분 백업·workspace WAL은 작업 저장 경계에만 적용한다. canonical/registry '
          'pair의 DELETE transaction과 정적 런타임 경계는 유지한다. 완료 배치의 `--apply-canonical`은 기존 권한 검사를 통과한 대상과 필요한 근거만 '
          '정식 DB·생성 데이터에 반영한다. candidate 전체 복사·권한 재분류·GitHub 쓰기·배포를 허용하는 변경이 아니다. schema 전환과 정식 반영 완료는 각각 실제 '
          'receipt/readback으로 확인한다.',
  'before': '- 2026-09-09 사용자 승인: source 밖의 로컬 작업용 SQLite는 조사·후보·동결 판정·실패 이력의 영구 보존에 별도로 사용한다. tracked '
            'canonical authority를 추가하는 것이 아니며 저장 성공은 accepted authority가 아니다. 저장·백업·복원 계약은 '
            '`docs/catalog-expansion/03-local-authoring-storage.md`를 따른다.',
  'after': '## 2. 권한 계약'},
 {'id': 'authority-shared-commit-recovery',
  'policy': 'authoringAuthority',
  'scope': 'operational',
  'text': '- private 준비·검사·빌드는 공유 commit 락 밖에서 수행하고 교체 직전 현재 canonical·registry·STATE 기준을 다시 확인한다. 정식 DB·생성 '
          'artifact를 함께 반영하는 intent의 미완료 상태는 같은 intent로 복구하며 다른 shared writer는 완료까지 차단한다. 원래 frozen '
          'identity와 실제 관련 의존을 보존하는 rebase receipt 없이 새 기준으로 판정을 재결속하지 않는다.',
  'before': '- legitimate writer는 현재 DB를 candidate로 복사하고 `BEGIN IMMEDIATE` 안에서 table을 교체한 뒤 전체 '
            'schema·Catalog 검증을 수행한다. commit·close 뒤 read-only exact readback과 sidecar 부재를 확인한 candidate만 '
            'canonical DB와 원자적으로 교체한다. 검증 실패 전에는 현재 DB가 바뀌지 않는다.',
  'after': '- 원시 model-candidate writer는 파일 I/O 전에 계속 실패한다. 전용 `authorizedEvidencePanelV1` publisher만 frozen '
           'evidence manifest·claim ledger·review reference·coverage·ownership 검사를 통과한 accepted resolution을 '
           '쓸 수 있다. candidate 입력의 provider·model·attempt·순서·수·confidence는 accepted fact나 판정 digest에 포함되지 '
           '않는다.'})


def _digest(body: bytes) -> str:
    return hashlib.sha256(body).hexdigest()


APPROVED_ADDITIONS += ({'id': 'aep-lean-retention-20260928', 'policy': 'authorizedEvidencePanel', 'scope': 'operational', 'text': '## 2026-09-28 경량 보존과 prior 검증\n\n작업 DB 경량 보존은 [저장 계약](03-local-authoring-storage.md)의 현재 head 선택이다. `load_prior_authority`의 manifest 계보 검증은 유지한다. 한 발행 배치 안에서는 기존 `manifest_verification_cache`가 같은 불변 입력을 다시 풀지 않는다. 이 변경은 claim 재판정·정족수·safety 계약을 바꾸지 않는다.', 'before': '# Authorized Evidence Panel V1', 'after': '## 2026-09-21 사용자 확정: 포르노 작품만 제외'}, {'id': 'authority-lean-retention-20260928', 'policy': 'authoringAuthority', 'scope': 'operational', 'text': '- 2026-09-28: 작업 DB의 경량 보존은 중복 publication 사본과 실행 이력을 현재 head에서 빼며, accepted authority의 원천은 계속 `data/source/catalog.sqlite`다. prior authority의 manifest 결속 검증은 그대로다.', 'before': '- 2026-09-09 사용자 승인: source 밖의 로컬 작업용 SQLite는 조사·후보·동결 판정·실패 이력의 영구 보존에 별도로 사용한다. tracked canonical authority를 추가하는 것이 아니며 저장 성공은 accepted authority가 아니다. 저장·백업·복원 계약은 `docs/catalog-expansion/03-local-authoring-storage.md`를 따른다.', 'after': '## 2. 권한 계약'})


def _fence_state(line: str, fence):
    match = re.match(r"^ {0,3}(`{3,}|~{3,})(.*)$", line)
    if match is None:
        return fence
    marker, suffix = match.groups()
    if fence is None:
        return marker[0], len(marker)
    if marker[0] == fence[0] and len(marker) >= fence[1] and not suffix.strip():
        return None
    return fence


def _normalize(text: str) -> str:
    # Line endings and repeated empty separators are Markdown formatting only.
    # Preserve single blank lines, indentation, spaces, and every nonempty line.
    lines = text.replace("\r\n", "\n").split("\n")
    fenced = None
    index = 0
    while index < len(lines):
        fenced = _fence_state(lines[index], fenced)
        if not fenced and index + 1 < len(lines):
            header, divider = lines[index], lines[index + 1]
            if all(line.startswith("|") and line.endswith("|") and "\\|" not in line for line in (header, divider)):
                cells = [cell.strip() for cell in divider[1:-1].split("|")]
                if cells and len(header[1:-1].split("|")) == len(cells) and all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
                    # Pipe-table padding and rule width do not change cell text
                    # or alignment. Never normalize tables within fenced code.
                    lines[index] = "|" + "|".join(cell.strip() for cell in header[1:-1].split("|")) + "|"
                    lines[index + 1] = "|" + "|".join((":" if cell.startswith(":") else "") + "---" +
                        (":" if cell.endswith(":") else "") for cell in cells) + "|"
                    index += 2
                    while index < len(lines) and lines[index].startswith("|") and lines[index].endswith("|") and "\\|" not in lines[index]:
                        values = lines[index][1:-1].split("|")
                        if len(values) != len(cells):
                            break
                        lines[index] = "|" + "|".join(cell.strip() for cell in values) + "|"
                        index += 1
                    continue
        index += 1
    normalized = []
    fenced = None
    for line in lines:
        if fenced is None and not line and (not normalized or not normalized[-1]):
            continue
        normalized.append(line)
        fenced = _fence_state(line, fenced)
    if fenced is None and normalized and not normalized[-1]:
        normalized.pop()
    return "\n".join(normalized)


APPROVED_REPLACEMENTS = ({'id': 'authorizedEvidencePanel-provider-restriction-removal-20261001', 'policy': 'authorizedEvidencePanel', 'scope': 'operational', 'before': '- Grok은 수집·판정·교차검증에서 전면 제외한다.', 'text': ''}, {'id': 'authoringAuthority-provider-restriction-removal-20261001', 'policy': 'authoringAuthority', 'scope': 'operational', 'before': '- Grok은 이 권한의 조사·판정·교차검증에 사용하지 않는다. AniList는 사용자가 허용한 1회성 참고조사만 가능하고, 유료 API·과금 자료는 금지한다.', 'text': '- AniList는 사용자가 허용한 1회성 참고조사만 가능하고, 유료 API·과금 자료는 금지한다.'})


def _project(policy: str, body: bytes) -> tuple[str, set[str]]:
    text = _normalize(body.decode("utf-8"))
    if "\0" in text:
        raise ValueError("Policy contains an invalid control character")
    replacement_ids = set()
    for rule in APPROVED_REPLACEMENTS:
        if rule["policy"] != policy:
            continue
        before, after = _normalize(rule["before"]), _normalize(rule["text"])
        lines = text.splitlines()
        if lines.count(before) > 1:
            raise ValueError("Duplicate historical provider restriction")
        if before in lines:
            text = re.sub(r"(?m)^" + re.escape(before) + r"$", lambda _: after, text)
        else:
            replacement_ids.add(rule["id"])
    found = {}
    for rule in APPROVED_ADDITIONS:
        if rule["policy"] != policy:
            continue
        block = _normalize(rule["text"])
        # Matching is on complete lines, never a prefix or substring waiver.
        expression = re.compile(r"(?m)^" + re.escape(block) + r"$")
        matches = list(expression.finditer(text))
        if len(matches) > 1:
            raise ValueError("Policy contains a duplicate approved amendment")
        if matches:
            marker = "\0" + rule["id"] + "\0"
            text = expression.sub(lambda _: marker, text, count=1)
            found[marker] = rule
    lines = [line for line in text.splitlines() if line]
    for index, line in enumerate(lines):
        if line not in found:
            continue
        before = next((value for value in reversed(lines[:index]) if value not in found), None)
        after = next((value for value in lines[index + 1:] if value not in found), None)
        rule = found[line]
        if (before, after) != (rule["before"], rule["after"]):
            raise ValueError("Approved policy amendment moved outside its reviewed context")
    for marker in found:
        text = re.sub(r"(?m)^" + re.escape(marker) + r"\n?", "", text)
    return _normalize(text), {rule["id"] for rule in found.values()} | replacement_ids


def prove_compatibility(policy: str, frozen: bytes, current: bytes) -> dict | None:
    """Prove only reviewed additions; optional new policy is never retroactive."""
    if frozen == current:
        return None
    before, previous = _project(policy, frozen)
    after, present = _project(policy, current)
    if before != after or not previous <= present:
        raise ValueError(f"Canonical rebase policy changed: {policy}")
    additions = [
        {"id": rule["id"], "scope": rule["scope"],
         "textSha256": _digest(rule["text"].encode("utf-8"))}
        for rule in (*APPROVED_ADDITIONS, *APPROVED_REPLACEMENTS) if rule["id"] in present - previous
    ]
    receipt = {"schemaVersion": FORMAT, "policy": policy,
               "frozenSha256": _digest(frozen), "currentSha256": _digest(current),
               "commonPolicySha256": _digest(before.encode("utf-8")),
               "effectivePolicy": "frozen-input", "newCapabilitiesGranted": [],
               "approvedAdditions": additions}
    encoded = json.dumps(receipt, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return {**receipt, "receiptSha256": _digest(encoded)}
