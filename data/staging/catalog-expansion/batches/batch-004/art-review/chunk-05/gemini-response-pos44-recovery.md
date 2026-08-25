### ACCESS Table

| Filename | Dimensions | OpenedAtOriginalPixels | Scene |
| :--- | :--- | :--- | :--- |
| `images/reader-page-07.png` | 1280 × 720 | true | Formal omiai (arranged meeting) setting: Hana in formal kimono with traditional hairdo seated next to her anxious father in a Japanese-style private room, facing formal introduction (right-hand author introduction leaf strictly excluded). |
| `images/reader-page-09.png` | 1280 × 720 | true | Omiai room character entrance: Brief comedic flashback explaining Hana substituting for her sister Yukari, followed by the dramatic full-body entrance of Takane Saibara in a business suit with shoujo floral tones. |
| `images/reader-page-11.png` | 1280 × 720 | true | Formal meeting table exchange: Takane delivering arrogant and disparaging remarks regarding Hana's makeup and attire while Hana maintains a strained, comical smile and the father attempts mediation. |
| `images/reader-page-13.png` | 1280 × 720 | true | Meeting confrontation and transition: High-tension dramatic shaded close-up of Takane insulting Hana's motives, followed by scene transition to Hana resting on her classroom desk at school. |
| `images/reader-page-15.png` | 1280 × 720 | true | Restaurant flashback and classroom dialogue: Hana recalling her genuine laugh at Takane and his sports car escort, interspersed with classroom discussion with female classmates about Takane's elite background. |
| `images/reader-page-17.png` | 1280 × 720 | true | Casual outing meetup: Phone message exchange prompting Hana to dress down in casual flannel and shorts, meeting Takane outside an upscale sushi restaurant where he smirks at her casual appearance. |

---

### Evaluation CSV

```csv
workId,axisId,state,value,confidence,refs,observation,limitation
work-e2f095e08fc5e08d5a2b,artRealism,known,2,0.90,hakusensha-reader-page-07;hakusensha-reader-page-09;hakusensha-reader-page-11;hakusensha-reader-page-13;hakusensha-reader-page-15;hakusensha-reader-page-17,"Standard stylized shoujo manga proportions and anatomy featuring large expressive eyes, slender figures, and frequent super-deformed chibi comedic reaction faces alongside stylized architectural backgrounds.",Evaluated strictly on official volume 1 internal body leaves without external material.
work-e2f095e08fc5e08d5a2b,artDensity,known,2,0.90,hakusensha-reader-page-07;hakusensha-reader-page-09;hakusensha-reader-page-11;hakusensha-reader-page-13;hakusensha-reader-page-15;hakusensha-reader-page-17,"Balanced information and line density with clear panel layouts, moderate interior and environmental detailing (tatami room, classroom, vehicles, sushi restaurant), clean hatching, and selective screentone accents.",Evaluated strictly on official volume 1 internal body leaves without external material.
work-e2f095e08fc5e08d5a2b,visualSoftness,known,2,0.90,hakusensha-reader-page-07;hakusensha-reader-page-09;hakusensha-reader-page-11;hakusensha-reader-page-13;hakusensha-reader-page-15;hakusensha-reader-page-17,"Neutral manga linework balancing delicate rounded facial features, soft decorative floral screentones, and gentle hair highlights with crisp, angular jawlines and sharp comedic scowls.",Evaluated strictly on official volume 1 internal body leaves without external material.
work-e2f095e08fc5e08d5a2b,motionImpact,unknown,,,hakusensha-reader-page-07;hakusensha-reader-page-09;hakusensha-reader-page-11;hakusensha-reader-page-13;hakusensha-reader-page-15;hakusensha-reader-page-17,"The inspected frames capture conversational, comedic, and social interaction scenes across discrete settings rather than a continuous dynamic motion sequence.",Continuous start-development-impact-resolved motion sequence not established in sample.
```

---

### Conflict and Extreme Value Notes

- **No Extreme Values (0 or 4)**: All three evaluated static axes (`artRealism`, `artDensity`, `visualSoftness`) sit stably at the defined anchor value `2` (stylized, balanced density, neutral softness). No extreme deformation (0) or photographic realism (4), sparse void (0) or hyper-dense saturation (4), or harsh rough inking (0) or purely painterly softness (4) was observed.
- **No Conflicting Signals**: Linework, screen-tone usage, and anatomical stylization remain consistent across all six body leaves spanning three distinct contexts (formal omiai interior, high school classroom, casual street/restaurant setting).
- **Frontmatter Exclusion**: On `reader-page-07.png`, the adjacent right-hand author introduction/frontmatter leaf was excluded from scoring; only the canonical body leaf on the left was evaluated.

---

### Attestations

- `model=gemini-3.7-flash-high`
- `completionStatus=completed`
- `reviewedByHuman=false`
- `Grok=ART_ABSTAIN`
- `Muse=NOT_USED`
- `openedOriginalPixels=6/6`
