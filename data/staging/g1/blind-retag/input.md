# G1 blind retag input

- Policy: `g1-replacement-v1`
- Cohort SHA-256: `065e5b972cddd53367682fedf0ff1ced95b57358216f0c553cb65252f0cd97c8`
- Cohort work-ID SHA-256: `306711f19cba4b3d9c755d411ee0649b563083437fad986e167618135b2aea6a`
- Factor dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- Annotation policy SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- Sample: 9/50 (18%)
- Factor definitions: `docs/factors/factor-dictionary.md`

## Isolation rules

Use only this file, the factor dictionary, and the linked official sources. Do not open `docs/factors/annotation-guide.md`: its named examples and prior judgments leak the hidden labels. Do not inspect prior annotations, candidate factors or themes, recommendation context, catalog outputs, or recommendation outputs. They contain the original values and genre, theme, role, market, or review signals that this blind pass must not expose.

## Scope and Art evidence minimum

- Evaluate only the entry experience in volumes 1–3 or the first major episode (`entry_1_3_volumes`). Do not mix in later twists, endings, or long-run changes.
- Insufficient evidence means `unknown`, not a low value. Use `notApplicable` only where the factor dictionary permits it.
- Inspect at least six distinct readable internal pages or equivalent still frames across at least two contexts, with the edition and entry-scope relationship recorded.
- Each known static Art axis must cite at least two distinct non-cover pages or frames. Known `motionImpact` requires one continuous action sequence with exact start and end references.
- If an Art minimum is not met, keep that axis `unknown`; lack of evidence is not grounds for `notApplicable`.

## Selected works

| workId                 | title                | creators                           | publisher | first published | representative ISBN | official work evidence                                                                                                                             |
| ---------------------- | -------------------- | ---------------------------------- | --------- | --------------: | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| jojo-bizarre-adventure | ジョジョの奇妙な冒険 | 荒木飛呂彦                         | 集英社    |            1986 | 9784088511269       | <https://books.shueisha.co.jp/items/contents.html?isbn=4-08-851126-3>                                                                              |
| berserk                | ベルセルク           | 三浦建太郎 / スタジオ我画 / 森恒二 | 白泉社    |            1989 | 9784592135746       | <https://www.hakusensha.co.jp/comicslist/40773/>                                                                                                   |
| dr-stone               | Dr.STONE             | Boichi / 稲垣理一郎                | 集英社    |            2017 | 9784088811840       | <https://books.shueisha.co.jp/items/contents_amp.html?isbn=978-4-08-881184-0>                                                                      |
| 20th-century-boys      | 20世紀少年           | 浦沢直樹                           | 小学館    |            1999 | 9784091855312       | <https://shogakukan-comic.jp/book?isbn=9784091855312>                                                                                              |
| dungeon-meshi          | ダンジョン飯         | 九井諒子                           | KADOKAWA  |            2014 | 9784047301535       | <https://www.kadokawa.co.jp/product/301411000826/>                                                                                                 |
| kingdom                | キングダム           | 原泰久                             | 集英社    |            2006 | 9784088770796       | <https://www.s-manga.net/items/contents.html?isbn=4-08-877079-X>                                                                                   |
| bocchi-the-rock        | ぼっち・ざ・ろっく！ | はまじあき                         | 芳文社    |            2018 | 9784832270725       | <https://houbunsha.co.jp/comics/detail.php?p=%25A4%25DC%25A4%25C3%25A4%25C1%25A1%25A6%25A4%25B6%25A1%25A6%25A4%25ED%25A4%25C3%25A4%25AF%25A1%25AA> |
| monster                | MONSTER              | 浦沢直樹                           | 小学館    |            1994 | 9784091836519       | <https://shogakukan-comic.jp/book?isbn=9784091817907>                                                                                              |
| blue-lock              | ブルーロック         | 金城宗幸 / ノ村優介                | 講談社    |            2018 | 9784065134009       | <https://www.kodansha.co.jp/r/comic/product?item=0000314505>                                                                                       |

## Required output

Write exactly four files in the output directory assigned by the runner:

- `factors.csv`: header `workId,axisId,state,value,confidence,evidenceId`; exactly 9 × 17 = 153 rows covering every Axis ID in this canonical order: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`, `artRealism`, `artDensity`, `visualSoftness`, `motionImpact`. Use `known` with value 0–4 and confidence 0–1, or `unknown` with blank value and confidence; `notApplicable` also has blank value and confidence and is allowed only by the factor dictionary. Use evidence ID `blind-retag-g1-v1-{workId}`.
- `themes.csv`: header `workId,themeId,centrality,confidence,evidenceId`; canonical Theme IDs only, centrality 1 or 2, confidence 0–1, and the same per-work evidence ID.
- `genres.csv`: header `workId,genres`; exactly 9 rows, one per selected work, with semicolon-separated canonical Genre IDs only.
- `notes.md`: for every work, record the official URLs and inspected volume/chapter/page or time ranges, observable repeated patterns supporting each judgment, Art source authority and edition/scope mapping, every `unknown` limitation, and an explicit isolation attestation listing only this input, the factor dictionary, and official sources used.

Sort every file by the selected-work order above, then by the canonical factor-dictionary order where applicable. Do not add files, compare against prior labels, or include recommendations. CSV files must use the exact headers above and end with one final newline.
