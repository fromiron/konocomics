# 放浪息子 — Gemini 3.7 Flash High independent Art review ledger

## 1. Frozen request

- Date: `2026-08-23`
- Repository HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Work: `work-0bec5d8d9474a2197312`
- Canonical title: `放浪息子`
- Requested reviewer: `gemini-3.7-flash-high`
- Requested resolved label: `Gemini 3.7 Flash (High)`
- Requested effort: `high`
- Scope: exactly the 12 official-rendered entry pages listed in `/tmp/pilot-hourou-art.caD9EV/review-prompt.md`; Art only.
- Local values were withheld from the request.
- Repository mutation: none.

## 2. Exact packet and request artifacts

- Pixel packet root: `/tmp/pilot-hourou-art.caD9EV/packet/`
- Page count: `12`
- Volumes: official electronic volumes `1`, `2`, `3`
- Portable packet SHA-256: `84605afa84139ed2d6281846828b2f7435ff40222bcab6445f5986358623e384`
- Derived navigation contact: `/tmp/pilot-hourou-art.caD9EV/hourou-contact.jpg`, SHA-256 `62dacf0d0bf3c8acad82328b906d24248ed752dc6f509feb864c91482eda4bea`
- Exact request: `/tmp/pilot-hourou-art.caD9EV/review-prompt.md`, SHA-256 `b7703c589d45ae085354be3a4b0d06b988ab4e195f4826534d9b7a1524ada0cf`
- JSON schema: `/tmp/pilot-hourou-art.caD9EV/review-schema.json`, SHA-256 `53a43b2c0fddd7012cde8dd27022343b9a1d9af8d53f11d034253f3f15cc2564`
- Complete CLI log: `/tmp/pilot-hourou-art.caD9EV/agy.log`, SHA-256 `e770f2ba5714c3ad4a97200c87c9a1a8f079c725407fc0d17d9ffce08c0179cc`

The stable per-file hashes are reproduced inside the decoded response below. Gemini returned all 12 correct values and a distinct page-specific observation for every image; local recomputation matched every returned hash.

## 3. Counted run provenance

- Command route: `agy --print`
- Model argument: `gemini-3.7-flash-high`
- Effort argument: `high`
- Permission mode: `--dangerously-skip-permissions`
- Structured-output schema: supplied and registered successfully
- Start: `2026-08-23T03:37:10+09:00`
- Stream completion: `2026-08-23T03:39:13+09:00`
- Shell exit code: `0`
- Outer conversation: `31f48423-e8db-4a0f-beae-a5f332e4e502`
- Outer status: **`SUCCESS`**
- Outer duration: `116.78217516s`
- Outer turns: `1`
- Usage: input `112698`, output `17449`, thinking `7233`, cache-read `585724`, total `130147`
- Exact model proof: CLI log starts print mode with model `gemini-3.7-flash-high` and repeatedly propagates label `Gemini 3.7 Flash (High)`.
- Completion proof: stream completed normally; inner `completionStatus=completed`.
- Full pixel access: **proven** by all 12 exact hashes plus non-generic, page-specific visible observations.
- Rate-limit, timeout, context-cancel, connection-reset, degraded-output, or incomplete-response signal: **none**.

Startup log lines about unauthenticated experiment polling are followed by successful silent authentication, model propagation, conversation creation, schema registration, generation, and normal stream completion. They did not degrade or interrupt this counted run.

## 4. Independent result and Local comparison

Gemini independently passes the gate at `12` pages and `7` contexts.

| Axis | Local Codex | Gemini | disposition |
|---|---:|---:|---|
| `artRealism` | `known=1` | `known=2` | **CONFLICT** — simplified faces/body treatment versus ordinary stylization boundary; Pass C required |
| `artDensity` | `known=1` | `known=2` | **CONFLICT** — selective backgrounds/whitespace versus balanced page-composition boundary; Pass C required |
| `visualSoftness` | `known=4` | `known=4` | **AGREEMENT** |
| `motionImpact` | `unknown` | `unknown` | **AGREEMENT** — no exact bounded continuous action sequence in the frozen packet |

No averaging or vote-count decision is made here. `artRealism` and `artDensity` must enter independent Pass C against the same pixels and dictionary anchors. No Art hard blocker exists.

## 5. Full decoded Gemini structured output

```json
{
  "candidateSha256": "aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529",
  "workId": "work-0bec5d8d9474a2197312",
  "canonicalTitle": "放浪息子",
  "exactModel": "gemini-3.7-flash-high",
  "resolvedLabel": "Gemini 3.7 Flash (High)",
  "effort": "high",
  "completionStatus": "completed",
  "pixelAccessProven": true,
  "pixelFiles": [
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v1-p009.png",
      "sha256": "8b5ad01a07e47b421978191139f8f406950b520db0836ca778c02d16f27cbee9",
      "visibleObservation": "Father in suit talks with children at home before leaving through front door; lower panel introduces teacher Nakazawa seated at desk."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v1-p013.png",
      "sha256": "7b110b796671622cb88feca2ecd328d4f5a43866fbe002062bf1bf72b9b96c01",
      "visibleObservation": "Teacher introduces transfer student Nitori in classroom; Takatsuki raises hand from desk to indicate the empty adjacent seat."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v1-p016.png",
      "sha256": "7fcebbba80f654dcd73468b87e721ae853dd6a27ead657fb450c92b725314443",
      "visibleObservation": "Close-up profile comparison between Nitori and Takatsuki against black tone; bottom panel shifts to family dining table with father reading newspaper."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v1-p017.png",
      "sha256": "06250a80889f44881e27788ac3d1e1e7aac9f0d99de3844403680dff854c38c4",
      "visibleObservation": "Mother looking inside open refrigerator; lower panels show flashback scene of injured sister collapsed by front door beside fallen bicycle."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v2-p006.png",
      "sha256": "fd863e31daaa4d7b49f56168ff42ffac5e259c5f626276def16e15e0cef64d38",
      "visibleObservation": "Shuichi and sister Maho holding gift money envelopes with surprised expressions and thanking visiting grandmother wearing knit sweater."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v2-p010.png",
      "sha256": "a2f35388032489fb7cb1e94748b6548afcd71b795e699a53fcb42fbb60661e52",
      "visibleObservation": "Shuichi walking outdoors under cloudy sky; bottom panel presents three-way front-facing bust portraits of Saori, Yoshino, and Shuichi."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v2-p015.png",
      "sha256": "3b6e82682539e11c523d772020d81c05191e0e8a70cbaafc36d6adbd57c17995",
      "visibleObservation": "Tall vertical panel of Yoshino wearing sailor uniform; left panels depict smiling pairs and Saori photographing Shuichi and Yoshino with digital camera."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v2-p018.png",
      "sha256": "aa022ba47571fcbcc099c716ab36253f82ca6ea3c946bd049ac938056ece0926",
      "visibleObservation": "Fast-food restaurant booth where Shuichi and Yoshino sit; older sister carrying drink tray approaches and teases Shuichi about his cute girlfriend."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v3-p006.png",
      "sha256": "e790112fa936994f944151278dbfdc5666e5bd7438fa79f59a5d14d02c6981b5",
      "visibleObservation": "Shuichi talking on corded home landline telephone, Maho pointing finger at him, and both standing together at apartment front entrance facing tiled hallway."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v3-p009.png",
      "sha256": "ed2dc6cf8435bb4721d66233a88628f28f2f644b3b8ce5245dfb3a800e2b34f8",
      "visibleObservation": "Maho and Shuichi walking past commercial building exterior; bottom right panel shows wheeled whiteboard listing 2F/3F/4F/5F audition rooms."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v3-p014.png",
      "sha256": "0464ca7e963fcbf28d2c78ff843532077f0b9661baf83b0e0cd662f8059146f3",
      "visibleObservation": "High-angle view of house balcony eaves with slippers; family members seated around living room table laughing and discussing audition experience."
    },
    {
      "path": "/tmp/pilot-hourou-art.caD9EV/packet/v3-p018.png",
      "sha256": "cf7619d13c325f135ce2beabd35835bfbc71ad08c533187df2a760498c373d01",
      "visibleObservation": "Close-up of hand clicking mouse by keyboard under Computer Room (コンピュータ室) sign; students conversing around school computer terminals."
    }
  ],
  "editionMapping": "KADOKAWA's standard-volume product connects the work/representative volume; BOOK WALKER's official series index connects distinct named volumes 1-3 and distinct trial CIDs. Independent browser verification mapped the visible printed story ranges as volume 1 pp.8-17 and volumes 2-3 pp.6-18. These are not special, complete, bunko, or limited editions.",
  "sampleGate": {
    "pageCount": 12,
    "contextCount": 7,
    "contexts": [
      "Nitori residence (kitchen, dining table, front entryway)",
      "Elementary and middle school classroom interiors",
      "Outdoor streets and urban commute routes",
      "Private room dress-up and photography session",
      "Fast-food restaurant / cafe dining booth",
      "Audition facility exterior and directory whiteboard",
      "School computer room with terminals"
    ],
    "qualified": true
  },
  "axes": {
    "artRealism": {
      "state": "known",
      "value": 2,
      "refs": ["v1-p009.png", "v1-p013.png", "v2-p010.png", "v2-p015.png", "v3-p009.png"],
      "reason": "Characters feature standard manga stylization with simplified facial features (clean nose dots, large expressive eyes, simplified mouths) paired with natural human body proportions and grounded architectural perspectives. Proportions avoid extreme deformation/caricature (anchor 0) and do not use hyper-realistic gekiga anatomy (anchor 4), aligning consistently with ordinary stylization (anchor 2)."
    },
    "artDensity": {
      "state": "known",
      "value": 2,
      "refs": ["v1-p009.png", "v1-p016.png", "v2-p010.png", "v3-p006.png", "v3-p018.png"],
      "reason": "Panels exhibit a balanced composition (anchor 2) with clear linework, moderate screentone shading, and sensible background detail (e.g., apartment interiors, classroom furniture, urban streets) contrasted with generous speech-bubble and character whitespace, avoiding both sparse emptiness (anchor 0) and excessive clutter or hyper-dense hatching (anchor 4)."
    },
    "visualSoftness": {
      "state": "known",
      "value": 4,
      "refs": ["v1-p013.png", "v2-p006.png", "v2-p010.png", "v2-p015.png", "v3-p014.png"],
      "reason": "Linework is distinctly delicate, curved, and gentle, complemented by subtle, fine-gradient screentones and soft character contours (anchor 4). The visual presentation consistently creates a gentle, tender, and soft aesthetic across all pages rather than neutral (anchor 2) or rough/angular (anchor 0) expression."
    },
    "motionImpact": {
      "state": "unknown",
      "value": null,
      "refs": ["v1-p009.png", "v1-p013.png", "v1-p016.png", "v1-p017.png", "v2-p006.png", "v2-p010.png", "v2-p015.png", "v2-p018.png", "v3-p006.png", "v3-p009.png", "v3-p014.png", "v3-p018.png"],
      "reason": "The sampled pages across volumes 1-3 depict conversational, domestic, and slice-of-life scenes without any contiguous physical-action sequence having a verifiable start, development/impact, and endpoint. Per the evaluation rules, motionImpact cannot be inferred and must be marked unknown."
    }
  },
  "issues": []
}
```
