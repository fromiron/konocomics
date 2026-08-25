### ACCESS Table

| filename | dimensions | openedAtOriginalPixels | scene |
| :--- | :--- | :--- | :--- |
| `page-666.jpg` | 985×1400 | true | 야외 이동·긴장: 야간 이동, 조류 묘사, 헤이안쿄 저택 조감도 (`kurage-page-666`) |
| `page-674.jpg` | 985×1400 | true | 문턱·인물 대면: 우차 수레바퀴 디테일, 문간 대화, 아리와라노 나리히라 대면 (`kurage-page-674`) |
| `page-682.jpg` | 985×1400 | true | 평안경 건축·경로 설명: 대내리, 조명문, 자신전, 청량전, 응천문 궁정 조감도 및 설명 (`kurage-page-682`) |
| `page-690.jpg` | 985×1400 | true | 복수 인물 문답: 격자창, 스가와라노 미치자네 서책 및 인물 대화 (`kurage-page-690`) |
| `page-698.jpg` | 985×1400 | true | 관복 인물 대화: 관복·에보시 차림 관리들과 미치자네의 대면 문답 (`kurage-page-698`) |
| `page-703.jpg` | 985×1400 | true | 근접 인물 문답: 미치자네 자기소개, 서책 바구니, 근접 인물 묘사 (`kurage-page-703`) |

---

### Factor Evaluation (CSV)

```csv
workId,axisId,state,value,confidence,refs,observation,limitation
work-0f3a44f5dcab9623d1be,artRealism,known,3,0.90,kurage-page-666;kurage-page-674;kurage-page-682;kurage-page-690;kurage-page-698;kurage-page-703,"Realistic anatomical proportions and bone structures for Heian-era characters, combined with accurate historical court attire (sokutai, kariginu, eboshi) and rigorous architectural perspective. Conservative interpolation 3 between standard stylization (2) and realistic anatomy/background/proportions (4).",Evaluated from 6 body pages of chapter 1 entry sample; excludes excluded opening page 663 and cover art.
work-0f3a44f5dcab9623d1be,artDensity,known,3,0.90,kurage-page-666;kurage-page-674;kurage-page-682;kurage-page-690;kurage-page-698;kurage-page-703,"High line density and architectural information density (detailed bird's-eye views of Heian-kyo imperial compound, roof tiles, lattice screens, textured fabric patterns, screentones). Conservative interpolation 3.",Evaluated from 6 body pages of chapter 1 entry sample.
work-0f3a44f5dcab9623d1be,visualSoftness,known,3,0.85,kurage-page-666;kurage-page-674;kurage-page-682;kurage-page-690;kurage-page-698;kurage-page-703,"Refined, delicate, and elegant inking for flowing hair strands, drapery, and facial contours, presenting a classical and graceful aesthetic tone. Conservative interpolation 3 between neutral (2) and soft/elegant (4).",Evaluated from 6 body pages of chapter 1 entry sample.
work-0f3a44f5dcab9623d1be,motionImpact,unknown,,0.0,kurage-page-666;kurage-page-674;kurage-page-682;kurage-page-690;kurage-page-698;kurage-page-703,Static excerpt sample captures atmospheric movement and dialogue; no exact continuous start-development-impact-resolution sequence is established.,motionGateAttemptable=false; continuous dynamic action sequence absent from retained sample.
```

---

### Conflict / Extreme Note

- **Extreme Value Check**: No extreme ratings of `0` or `4` were assigned. All static factor evaluations remain at conservative interpolation value `3`.
- **Consistency & Conflict Check**: No conflicts detected across axes. High visual realism, dense architectural/costume information density, and delicate aesthetic linework are mutually consistent across all 6 examined body pages.
- **Motion Gate**: `motionImpact` correctly remains `unknown` (confidence `0.0`) in accordance with the gate specification due to the absence of a continuous bounded action sequence in the static sample.

---

### Attestations

- `model=gemini-3.7-flash-high`
- `completionStatus=completed`
- `reviewedByHuman=false`
- `Grok=ART_ABSTAIN`
- `Muse=NOT_USED`
- `openedOriginalPixels=6/6`
