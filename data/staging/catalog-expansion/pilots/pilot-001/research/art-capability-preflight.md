# Pilot 001 art-capability preflight

- 실행일: 2026-08-22
- 목적: 모델 이름만으로 시각 판독 능력을 가정하지 않고, 공식 내부 만화 페이지의 실제 픽셀을 읽을 수 있는 판정원만 Art 축에 참여시킨다.
- 작품: ゴルゴ13
- 공식 뷰어: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091794010001d0000000
- 표본: 공식 뷰어 내부 페이지 4~11, 4개 스프레드, 8쪽, 복수 장면과 연속 동작 포함
- 보존 원칙: 스크린샷은 임시 검수 입력이며 저장소에는 복제하지 않는다. 아래 SHA-256과 공식 URL·페이지 참조만 보존한다.

| 임시 입력      | SHA-256                                                            |
| -------------- | ------------------------------------------------------------------ |
| `golgo-04.png` | `0daea7b31ab42f347987d5975bca06e6653d1dbb9443918b1ba1d0ef86f39f06` |
| `golgo-05.png` | `97d9d7c83ce7119c3891e8f731d7537d4389ebce67981af77d2a6a1052af0938` |
| `golgo-06.png` | `d1f812b0a952d01e065de692196cc922f8d3a8c3b4a43432f1bbb35604195156` |
| `golgo-07.png` | `3981d988902751c04dd94977d3c40c0eca5fdaa87dd8a65dbad8ca8d4cd6d66e` |

## 결과

| 판정원               | 실행 identity                                               | 실제 픽셀 판독 | 정적 Art 3축 | `motionImpact` | Pilot 운용              |
| -------------------- | ----------------------------------------------------------- | -------------- | ------------ | -------------- | ----------------------- |
| Local Codex subagent | GPT-5 family, isolated task                                 | 통과           | 판정 가능    | 판정 가능      | Art 최소 정족수         |
| Gemini               | `gemini-3.7-flash-high`, effort `high`                      | 통과           | 판정 가능    | 판정 가능      | Art 최소 정족수         |
| Muse                 | `opencode/muse-spark-1.2-contributor-free`, variant `xhigh` | 통과           | 판정 가능    | 판정 가능      | 안정할 때만 보조 판정원 |
| Cursor Grok          | `cursor-grok-4.6-high`, non-fast, plan mode                 | 실패           | 기권         | 기권           | 비작화 판정에는 참여    |

### Local Codex subagent

- 독립 작업에서 네 PNG를 `view_image` original detail로 직접 열었다.
- 페이지 4~11과 6개 장면 맥락을 식별했고, 창문 반복 구도·침실 대화·타격 속도선·실내 난투·계단실 원근·외부 추격을 페이지별로 구분했다.
- `artRealism`, `artDensity`, `visualSoftness`, `motionImpact` 모두 판정 가능으로 응답했다.
- 한계: 네 스프레드만 본 표본이며 장기 연재 전체를 대표하지 않는다. 작은 대사 텍스트와 색 재현은 근거로 사용하지 않는다.

### Gemini

- 실행: `agy --model gemini-3.7-flash-high --effort high --mode plan --sandbox --dangerously-skip-permissions --output-format json --add-dir output/playwright/pilot-art --prompt <preflight-request>`
- conversation ID: `12aa860b-1766-49f1-a1e2-a5b6aebaa5d5`
- 네 입력 파일의 페이지 4~11을 실제 시각 판독했다고 응답했고, 4개 장면 맥락과 구체적 선·명암·패널·동세 관찰을 제시했다.
- 네 Art 축 모두 판정 가능으로 응답했다.

### Muse

- 실행: `opencode run <preflight-request> --pure --agent plan --model opencode/muse-spark-1.2-contributor-free --variant xhigh --format json --dir /home/bell/Toys/konocomics -f <four-images>`
- session ID prefix recorded by the preflight: `ses_fd656a`
- 네 입력 파일을 실제 시각 판독했다고 응답했고, 페이지 4~11, 6개 장면 맥락, 해칭·패널·동세 관찰을 제시했다.
- 네 Art 축 모두 판정 가능으로 응답했다.
- 무료 무제한 플랜의 불안정성을 고려해 필수 정족수에는 넣지 않는다.

### Cursor Grok

- 실행: `agent --print --output-format json --mode plan --sandbox enabled --trust --workspace /home/bell/Toys/konocomics --model cursor-grok-4.6-high <preflight-request>`
- session ID: `9b5434de-e8dd-4166-a7b6-802bb3fe7489`
- 로컬 PNG 경로는 열었지만 환경이 생성한 설명만 전달받아 실제 픽셀을 보지 못했다고 명시했다.
- `visuallyInspected=false`와 네 Art 축 판정 불가를 반환했으므로 Art에서는 기권시킨다. 비작화 Factor·Theme·identity·safety 독립 검수에는 계속 참여한다.

## 정족수와 안정성 규칙

- Art 최소 정족수는 실제 픽셀 판독을 입증한 Local Codex subagent와 Gemini 두 판정원이다.
- Muse는 정확한 모델 identity, 성공 종료, 모든 입력 접근, 완결된 응답, rate-limit·timeout·degraded output 부재를 모두 만족할 때만 보조 판정원으로 포함한다.
- Muse가 위 조건 중 하나라도 실패하면 해당 batch에서 제외하고 batch review 원장에 사유를 기록한다. 다른 모델로 조용히 대체하지 않는다.
- Cursor Grok은 비작화 판정원으로 유지하지만 Art 결과에는 표를 넣거나 다수결 표로 계산하지 않는다.
- 모델 간 값이 다르면 자동 평균이나 단순 다수결을 하지 않고 Factor Dictionary, 공식 페이지 근거, 판본·범위 일치 여부로 adjudication한다.
- 이 preflight는 능력 확인일 뿐 작품 Factor 승인이나 사람 검수로 간주하지 않는다.
