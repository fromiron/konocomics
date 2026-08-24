# Batch 002 Art preflight chunk 02

Retrieved on 2026-08-23. Scope is frozen Batch 002 positions 11–20 in manifest order. This is access and sampling preflight only: no Art axis value or confidence was inferred. `reviewedByHuman=false`.

## Efficiency rule

- Resolve an official publisher internal preview within volume 1 to 3 or the first major episode and map it to the frozen representative edition.
- Stop sampling after six readable internal pages across at least two distinct contexts. Covers, synopsis material, animation, and user opinion are excluded.
- Static review is attemptable only after both the edition and sample gates pass. Motion review is attemptable only when the inspected pages expose an exact continuous start-development-impact-end sequence.
- A failed prerequisite ends as `unknown-ready`, without an Art value. Qualifying access ends as `sample-ready`; this is not an annotation decision.
- Temporary captures live only under `/tmp/batch002-art-preflight-chunk02.polhkX`. They are not staged or committed. The CSV records SHA-256 for every capture actually selected.

## Results

| Work                                       | Official edition mapping                                            | Access             | Internal pages | Contexts | Page refs                          | Static | Motion | State         |
| ------------------------------------------ | ------------------------------------------------------------------- | ------------------ | -------------: | -------: | ---------------------------------- | ------ | ------ | ------------- |
| work-29d4300ad9d3358fb67a 外天楼           | product 0000223170 to ISBN 9784063761597                            | accessible         |              6 |        2 | p006-p007 p020-p021 p040-p041      | yes    | no     | sample-ready  |
| work-3dfaf6231e21133620c6 忍者と極道       | product 0000339844 to ISBN 9784065193655                            | accessible         |              6 |        2 | reader steps 05 12 and backstep 05 | yes    | no     | sample-ready  |
| work-3e725951eb9c49771087 嘘解きレトリック | JDCN 59219633rhetori00111 to ISBN 9784592196334                     | accessible         |              6 |        3 | reader indexes 09 21 and 37        | yes    | no     | sample-ready  |
| work-40b8c35b1d8c9a90144c orange           | Futabasha preview to earlier Shueisha ISBN unresolved               | edition unresolved |              6 |        3 | reader steps 04 14 and 24          | no     | no     | unknown-ready |
| work-4c784fc78dfd9b139c3f 正反対な君と僕   | JDCN 08X10000000022198000 to ISBN 9784088831251                     | accessible         |              6 |        3 | reader steps 05 12 and 19          | yes    | no     | sample-ready  |
| work-518d7ed42dd9253679c3 墨攻             | JDCN 091830410000d0000000 to ISBN 9784091830418                     | accessible         |              6 |        3 | reader steps 06 10 and 14          | yes    | no     | sample-ready  |
| work-53e54c95f637b66c4fb2 がんばれ元気     | JDCN 091202110000d0000000 to ISBN 9784091202116                     | accessible         |              6 |        3 | reader steps 06 12 and 18          | yes    | no     | sample-ready  |
| work-5915d6d7601377fcc75f 赤髪の白雪姫     | JDCN 59218373akagami00111 to ISBN 9784592183730                     | accessible         |              6 |        3 | reader indexes 09 21 and 37        | yes    | no     | sample-ready  |
| work-5b4dc4e6e966436b2990 人形芝居         | JDCN 59217709ninsiba00111 to ISBN 9784592177098                     | accessible         |              6 |        3 | reader indexes 09 21 and 37        | yes    | no     | sample-ready  |
| work-5b9a3ec60ac5fc90f444 魔法使いの嫁     | Bushiroad episode to unchanged former Mag Garden ISBN 9784800002846 | accessible         |              6 |        3 | reader steps 05 10 and 15          | yes    | no     | sample-ready  |

## Limitations

The six-page count is the exact selected sample rather than the total preview length. `orange` met the page and context thresholds, but the official Futabasha preview could not be linked to the frozen Shueisha representative edition by an official content-equivalence statement; its Art state therefore closes `unknown-ready`. The `魔法使いの嫁` publisher transfer does have an official bridge: KADOKAWA states that its Bushiroad edition has no manga-content change from the former Mag Garden edition. No selected sample establishes the exact bounded sequence required to attempt `motionImpact`.
