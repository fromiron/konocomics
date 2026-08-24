# Batch 003 chunk 04 identity, safety, and edition review

- reviewDate: 2026-08-24
- reviewer: Local Codex independent review
- reviewedByHuman: `false`
- reviewedRange: frozen positions 31–40
- scope: canonical identity, safety and scope, representative ISBN, edition mapping, and source metadata
- excluded: Factor values, Genre, Theme, Art values, recommendation context, and promotion
- sourceMutation: none

The review compares the frozen set and official-first research with current `works.csv`, `volumes.csv`, canonical staging, safety staging, promotion staging, the accepted Cursor Grok non-Art review, and chunk-04 Art preflight edition bridges. Every representative ISBN-13 passes checksum validation, has exactly one representative row, and occurs once in `data/source/volumes.csv`. Every scoped Work ID and exact canonical title occurs once in `data/source/works.csv`.

Rakuten does not expose a reliable nationality or original-format field, so no nationality-inference test is added. Japanese manga scope is established from Japanese publisher or rightsholder records, creator and imprint bindings, and matched standard editions. Safety means the matched Work is not sold as R18, 成人向け, 成年コミック, adult-only BL/TL, or equivalent restricted material. Violence, extinction stakes, relationship conflict, kidnapping, disappearance, or smoking are content leads rather than automatic adult blocks.

## Summary

| Pos | workId | canonicalTitle | representative ISBN | identity / edition | safety / scope | Verdict |
| --: | --- | --- | --- | --- | --- | --- |
| 31 | `work-a7413b6e35e0d316a538` | となりの怪物くん | `9784063655407` | 講談社 original standard volume 1; later collector/reconstituted products remain edition variants | ordinary デザートKC school romance; family trouble is not adult-only | PASS |
| 32 | `work-a7e0062c7153978fc6fe` | 失恋ショコラティエ | `9784091322609` | 小学館 original paper standard volume 1; official JDCN preview maps to the same original volume | married-person pursuit and smoking are content leads, not adult-only sales | PASS |
| 33 | `work-a960372ed5efa4031896` | シルバーマウンテン | `9784098542420` | 小学館 original standard volume 1 and exact-ISBN official trial | combat, kidnapping, and magic attacks are violence leads | PASS |
| 34 | `work-aa6d796e2e04a55b94b1` | 惑星のさみだれ | `9784785926052` | 少年画報社 original standard volume 1; current official first episode identifies the same original Work | world-destruction stakes and attacks are violence leads | PASS |
| 35 | `work-ae0ac8a5acfc5fbb7dd6` | 終末のワルキューレ | `9784199804953` | original ノース・スターズ・ピクチャーズ standard volume 1; current Coamix `z_R0123` bridge; vertical full-color remake excluded | lethal duels and human-extinction stakes are not adult-only classification | PASS |
| 36 | `work-b2be97620643b3342637` | アオイホノオ | `9784091512680` | 小学館 original paper standard volume 1; official JDCN preview maps to the same original volume | ordinary ゲッサン manga; no adult-only lead | PASS |
| 37 | `work-b708734262fb9b67f948` | ねこだらけ | `9784063728262` | 講談社 unnumbered single collected standard volume | ordinary commercial four-panel cat manga | PASS |
| 38 | `work-bd42208a660912d9d95d` | 路地恋花 | `9784063106282` | 講談社 standard volume 1; rotating episode leads retain one series identity | wedding and relationship conflict are not adult-only | PASS |
| 39 | `work-c5e8c957903bf1832dc5` | 日々ロック | `9784088790343` | 集英社 original paper standard volume 1; official electronic reader maps the same original volume | bullying, property damage, and assault are violence leads | PASS |
| 40 | `work-c805c5b70111f75d6fb5` | 海獣の子供 | `9784091883681` | 小学館 original paper standard volume 1; official JDCN preview maps the same original volume | whaling, disappearance, and apparent death are content leads | PASS |

## Edition-sensitive cases

### 終末のワルキューレ

- The frozen ISBN `9784199804953` is the 2018 original standard volume 1 issued by ノース・スターズ・ピクチャーズ under the ゼノンコミックス line. It is not the later `終末のワルキューレ 総天然色` full-color vertical remake.
- Coamix's current catalog identifies the original as Work `z_R0123`, lists the original serialization from 2017-11-25, and exposes the original first episode and collected series.
- Coamix's official merger notice states that ノース・スターズ・ピクチャーズ merged into surviving company Coamix on 2020-04-01 and that its publishing and rights-management businesses continue at Coamix. This resolves the original-publisher/current-rightsholder chain raised by Cursor Grok.
- Verdict: retain one canonical original Work and the frozen standard ISBN. Keep all full-color vertical-remake material outside its Factor, Art, and identity Evidence.

### Paper-to-digital preview bridges

- `失恋ショコラティエ`, `アオイホノオ`, and `海獣の子供` use official 小学館 ISBN/JDCN redirects that preserve title, creator, volume, and original edition identity.
- `日々ロック` uses 集英社's official electronic reader for the same title, creator, and original volume. The format difference does not create a second Work.
- These bridges support bounded entry-edition review. They do not authorize transferring unrelated later-edition, special-edition, or remake material.

## Evidence

- 講談社 となりの怪物くん 1: https://www.kodansha.co.jp/comic/products/0000041905 — 2009-01-13; retrieved 2026-08-24
- 小学館eコミックストア 失恋ショコラティエ 1: https://e-comi.shogakukan.co.jp/books/091322600000d0000000 — paper release 2009-01-09; retrieved 2026-08-24
- 小学館 シルバーマウンテン 1: https://shogakukan-comic.jp/book?isbn=9784098542420 — 2025-09-18; retrieved 2026-08-24
- 少年画報社 惑星のさみだれ 1: https://www.shonengahosha.co.jp/book_Info.php?id=7347 — 2006-01-27; retrieved 2026-08-24
- Coamix 終末のワルキューレ original-series page: https://catalog.coamix.co.jp/record-of-ragnarok/ — series start 2017-11-25; retrieved 2026-08-24
- Coamix merger notice: https://corp.coamix.co.jp/nsp/ — merger effective 2020-04-01; retrieved 2026-08-24
- Coamix 終末のワルキューレ 総天然色 remake page: https://catalog.coamix.co.jp/valktennen/ — 2023; retrieved 2026-08-24; identity-exclusion evidence only
- 小学館eコミックストア アオイホノオ 1: https://e-comi.shogakukan.co.jp/books/091512680000d0000000 — paper release 2008-02-05; retrieved 2026-08-24
- 講談社 ねこだらけ: https://www.kodansha.co.jp/comic/products/0000013952 — 2009-08-21; retrieved 2026-08-24
- 講談社 路地恋花 1: https://www.kodansha.co.jp/comic/products/0000029686 — 2010-02-05; retrieved 2026-08-24
- 集英社 日々ロック 1: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08879034879034315501 — paper release 2010-10-19; retrieved 2026-08-24
- 小学館eコミックストア 海獣の子供 1: https://e-comi.shogakukan.co.jp/books/091883680000d0000000 — paper release 2007-07-30; retrieved 2026-08-24

No canonical title, Work ID, representative ISBN, publisher field, safety row, source row, or eligibility state is changed by this review. `『』` is absent from all ten canonical titles and remains an external prose delimiter. No scoped ISBN, Work ID, exact title, or normalized edition identity collides with another current catalog Work.
