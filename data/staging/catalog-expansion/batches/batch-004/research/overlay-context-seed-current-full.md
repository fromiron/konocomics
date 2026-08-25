# Batch 004 current full-gate scene-context seed

- reviewedAt: `2026-08-25`
- reviewedByHuman: `false`
- scope: current Batch 004 works that pass the terminal narrative, tone, and Art coverage gates
- source of truth: current `adjudication/text-final-chunk-*.csv`, terminal `art-review/chunk-*/final-art.csv`, and recovery Art overrides where present
- scene-context rule: semicolon-separated, at least two concrete contexts, derived from the edition-mapped Art preflight/adjudication record
- motion rule: no `motionReference` is emitted because all nine current full-gate works have terminal `motionImpact=unknown`; no exact start-development-impact-resolved sequence was established
- all canonical titles were checked for decorative `『` or `』` delimiters; none are present

## Central gate result

The current terminal matrices produce exactly nine full-gate positions:

`03, 14, 17, 20, 21, 43, 44, 47, 49`

The unchanged coverage thresholds are Narrative `0.6` over 6 axes, Tone `0.6` over 7 axes, and Art `0.3` over 4 axes. Every row below is `4/6` Narrative, `5/7` or `6/7` Tone, and `3/4` Art. The Art vector is three known static axes plus terminal-unknown `motionImpact`; unknown is not treated as a numeric low value.

## Existing overlay comparison

The existing final-overlay recommendation-context CSVs contain rows only for positions `14`, `17`, and `20`. The existing builder scene-context map contains those same three works. Positions `17` and `20` match the current Art preflight wording. Position `14` is present but omits `thriller` from the third current Art context. Positions `03`, `21`, `43`, `44`, `47`, and `49` have no existing final-overlay context row or scene-context map entry; their seeds are therefore recorded here for the later overlay update. This file intentionally does not modify the builder or generated overlay.

| Position | Work | Art sample contexts | Existing overlay | Basis |
| ---: | --- | --- | --- | --- |
| 03 | 応天の門 | outdoor movement; indoor characters; Heian-kyō architecture; multi-person dialogue | missing | corrected official first-episode recovery preflight, four accepted context groups |
| 14 | ねずみの初恋 | school and store; food interaction; apartment kitchen thriller | present but not an exact current Art-context match | Kodansha entry-volume official preview |
| 17 | アリスと蔵六 | city street; convenience store; home restaurant | present and matching | COMICリュウ entry-chapter official preview |
| 20 | 環と周 | apartment family; workplace; restaurant group | present and matching | Shueisha single-volume official preview |
| 21 | アンデッドアンラック | vol2 barrier battle and aftermath exchange; vol3 outdoor confrontation and battle | missing | corrected Shueisha vol2/vol3 recovery preflight |
| 43 | 八雲さんは餌づけがしたい。 | apartment entry/hallway; kitchen/dining meal interaction | missing | Square Enix entry-episode official preview |
| 44 | 高嶺と花 | formal meeting; school/transit; restaurant/home-preparation | missing | corrected Hakusensha entry-volume recovery and final original-pixel adjudication |
| 47 | 極楽街 | office and urban streets; interior action | missing | Shueisha electronic volume 1 official preview |
| 49 | 青の祓魔師 | supernatural threat; town and interior group | missing | Shueisha volume 1 official preview |

## Binding notes

The CSV preserves the exact page-reference tokens used by the terminal Art rows and identifies the recovery preflight files for positions `03`, `21`, and `44`. It is a research seed only: no recommendation context, scene map, source, generated artifact, promotion decision, or blocker was changed. Positions with a missing existing row remain candidates for the parent overlay builder after the other terminal gates and independent blocker adjudication are complete.
