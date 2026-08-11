REVISE

동결된 블라인드 조정본은 최종 권위 데이터가 아니라, 좁은 entry-scope URL만으로 한 진단이다. 이를 그대로 후보에 넣거나(sparse로 원값을 남기거나) 해서는 안 된다.

1. **정책: `FULL_EVIDENCE_ADJUDICATION`**

- `annotation-guide.md` §6·`factor-dictionary.md` 자기편향 방지: 블라인드는 차이를 드러내고, **평균·자동 대체가 아니라 정의·근거·작품 범위를 다시 확인**한다. 2단계 이상 차이는 기준/데이터 불안정 신호다.
- `06` G1 5→6: 블라인드 후 **차이를 조정**하고, **수용한 조정만** 반영해 원자적 재빌드한다. “수용”은 좁은 URL 교집합을 그대로 쓰는 것이 아니다.
- `02`·주석 가이드: 근거 부족은 `unknown`. 블라인드 `unknown`의 대부분은 “허용된 한 URL에 노출되지 않음”이지, G1 전축 evidence audit이 요구하는 **공식 entry-scope 전체 근거 부재**가 아니다. Oracle도 synopsis만으로는 equal-value를 버렸다.
- **`FULL_OVERRIDE` 기각:** 진단용 unknown을 최종으로 쓰면 Art 보존 시에도 9작품 전부에서 coverage가 깨진다. coverage 우회 금지·원자적 게시 실패 계약과 충돌한다.
- **`SPARSE_RETAIN` 기각:** 미처분 105 non-Art known·여분 Theme를 침묵 보존하는 것은 “차이를 조정”이 아니며, known마다 근거를 요구하는 체크리스트와도 충돌한다.

2. **Art: 200행 공식 내부 근거 audit이 권위다.** 블라인드 Art unknown으로 덮지 않는다. 블라인드 입력은 Art URL/내부 페이지를 노출하지 않았고, Art 최소선·`07` G1.2·`art-evidence-manifest`가 유일한 근거완결 경로다.

3. **예. 지금 보고된 23 `COVERAGE_BELOW_THRESHOLD`는 G1을 REVISE로 두고, 그 상태의 최종 후보 게시·승인을 금지한다.** `catalog:validate` 실패는 빌드/게시 불가이며, coverage를 근거 완료나 예외로 우회할 수 없다. (G1 본통과·CLI 육안은 그 다음이다.)

4. **최소 산출물·빌더 규칙**

- **산출물:** `sample-manifest`의 9 `workId`에 대해, 기존 스키마만으로 완결된 1세트  
  - `factors.csv`: non-Art 13축 × 9행 전부(unknown 허용), `factorSourceRowSchema`  
  - `themes.csv`: 작품별 완결 work-set, `themeSourceRowSchema`  
  - `genres.csv`(또는 works `genres`): 작품당 1행  
  - 인용 `evidenceId`용 `evidence.csv` 행  
  - (권장) 짧은 disposition 기록: 필드별 confirm / change / unknown — 새 프레임워크 없이 기존 CSV+노트
- **빌더:** `replacement-blind/reconciled`와 같이 **샘플 9작품 non-Art만** `mergeOverrides`(factors=row, themes=workSet, genres=works 셀)로 소비. Art는 `art-evidence-manifest`로 검증된 현재 행 유지. 샘플 non-Art 키가 누락되면 실패(원후보로 침묵 폴백 금지). validate 실패 시 기존 후보/source 불변.

5. **원후보 값/태그 유지는 명시적 근거 disposition만 허용.** 생략=유지 금지. 블라인드 known 11·태그도 전체 공식 entry-scope 근거로 재확인 후에만 채택·수정·unknown. 미처분이면 unknown이며, coverage 붕괴 시 근거 보강 또는 replacement 계약으로 교체.

6. **다음 단계:** 9작품 non-Art·Genre·Theme를 전체 공식 entry-scope 근거로 재 adjudicate → 위 완결 세트 동결 → 원자적 candidate rebuild/validate. **cohort·블라인드 표본은 재실행하지 않는다**(동결 hash·정책 유지; `06`은 cohort/정책 변경 시에만 2단계부터 재실행). validate 통과 후에만 G1 6단계(CLI 육안)로 진행. coverage를 깨는 unknown이 남으면 교체 시 cohort/블라인드 무효화 후 재실행. **G2/UI는 G1 통과 전 시작 불가.**
