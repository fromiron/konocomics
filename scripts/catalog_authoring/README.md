# Offline Catalog authoring

실행 코드와 필요한 기존 발행 backend를 이 디렉터리에서 추적한다. 원문·동결 입력·판정·후보·작업 DB는 Git에 포함하지 않는다.

- 일반 진입점: `python -X utf8 scripts/catalog_authoring_runner.py run --run-root <영구 planning 경로> --job <job.json> --decisions <판정.json>`
- 기본 실행은 제공되거나 RUN에 저장된 판정만 사용한다. 판정 누락 시 모델을 자동 호출하지 않는다. 별도 승인된 Sol medium 실행만 `--allow-model`로 명시한다. `--model-session`·`--retry-model`도 이 옵션이 필요하며, `--decisions`와 함께 사용할 수 없다.
- 수집: `node scripts/catalog_authoring/collect_factor_evidence.mjs`
- 독립 준비/발행: `python -X utf8 scripts/catalog_authoring/prepare_factor_batch.py --help`
- 영구 자료: `data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/`
- 저장 DB와 백업: `data/local/catalog-authoring/workspace.sqlite`, `backups/`
- 임시 출력: `.workspace/`. 호환 링크·심링크는 생성하지 않는다.

과거 동결본의 경로 문자열은 변경하지 않는다. `workspace_paths.artifact_path()`는 읽기 경계에서 해당 자료의 현재 위치를 찾으며, 원래 manifest·SHA 검증은 유지한다. `legacy/`는 현재 발행 경로가 사용하는 기존 backend이며 검증 우회 경로가 아니다.

회귀 검사:

```powershell
python -B -X utf8 -m unittest discover -s scripts -p test_catalog_authoring_runner.py
python -B -X utf8 -m unittest discover -s scripts -p test_catalog_workspace.py
python -B -X utf8 -m unittest discover -s scripts/catalog_authoring -p test_factor_single_pass_artifacts.py
```

실제 보존 artifact 검사는 로컬 원본이 필요하다. 원본이 없는 checkout의 skip이나 mock 모델 검사는 실제 판정·승격의 증거가 아니다. Node 24와 기존 로그인된 Codex CLI가 실행 전제다.
