# Batch 002 Art preflight chunk 03

Retrieved on 2026-08-23. Scope is frozen Batch 002 positions 21–30 in manifest order. This is access and sampling preflight only: no Art axis value or confidence was inferred. `reviewedByHuman=false`.

## Efficiency rule

- Resolve an official publisher internal preview within volume 1 to 3 or the first major episode and map it to the frozen representative edition.
- Stop sampling after six readable internal pages across at least two distinct contexts. Covers, synopsis material, animation, and user opinion are excluded.
- Static review is attemptable only after both the edition and sample gates pass. Motion review is attemptable only when the inspected pages expose an exact continuous start-development-impact-end sequence.
- A failed prerequisite ends as `unknown-ready`, without an Art value or promotion blocker. Qualifying access ends as `sample-ready`; this is not an annotation decision.
- Temporary captures live only under `/tmp/batch002-art-preflight-chunk03.6Zlsbu`. They are not staged or committed. The CSV records SHA-256 for every capture actually selected.

## Results

| Work                                           | Official edition mapping                                                 | Access                       | Internal pages | Contexts | Page refs                     | Static | Motion | State         |
| ---------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------- | -------------: | -------: | ----------------------------- | ------ | ------ | ------------- |
| work-5cafd57db6b870a71a05 機動警察パトレイバー | standard vol1 to frozen wide ISBN unresolved                             | edition unresolved no sample |              0 |        0 | none                          | no     | no     | unknown-ready |
| work-5e20323e014d6d390aaf あさひなぐ           | JDCN 091837980000d0000000 to ISBN 9784091837981                          | accessible                   |              6 |        3 | reader steps 05 12 and 19     | yes    | no     | sample-ready  |
| work-5ebbc9bede841d2faf7b 高台家の人々         | JDCN 08845109845109315501 to ISBN 9784088451091                          | accessible                   |              6 |        3 | reader steps 05 12 and 19     | yes    | no     | sample-ready  |
| work-6f849a8e785deee3d5dc 怪物事変             | official reader keyed by ISBN 9784088810966                              | accessible                   |              6 |        3 | reader steps 05 12 and 19     | yes    | no     | sample-ready  |
| work-71e824df2e6bc2125294 SAKAMOTO DAYS        | official reader keyed by ISBN 9784088826578                              | accessible                   |              6 |        3 | p010-p011 p024-p025 p038-p039 | yes    | yes    | sample-ready  |
| work-7975d62582a89492a35f 図書館の大魔術師     | product 0000115710 to ISBN 9784065112434                                 | accessible                   |              6 |        3 | reader steps 05 09 and 12     | yes    | no     | sample-ready  |
| work-7d259c925286a9f91310 聖☆おにいさん        | product 0000013790 to ISBN 9784063726626                                 | accessible                   |              6 |        3 | reader steps 06 08 and 10     | yes    | no     | sample-ready  |
| work-8147aefccc365b0ecb4d 黒執事               | official first-episode preview linked by ISBN 9784757519633 product      | accessible                   |              6 |        3 | reader controls 04 11 and 18  | yes    | no     | sample-ready  |
| work-838a6f0ad2d1ef487588 信長協奏曲           | JDCN 091221000000d0000000 to ISBN 9784091221001                          | accessible                   |              6 |        3 | p006-p007 p020-p021 p034-p035 | yes    | no     | sample-ready  |
| work-83fc3c4366e51b35b821 風と木の詩           | Hakusensha bunko vol1 to frozen Shogakukan Flower Comics ISBN unresolved | edition unresolved no sample |              0 |        0 | none                          | no     | no     | unknown-ready |

## Limitations

The six-page count is the exact selected sample rather than the total preview length. `機動警察パトレイバー` and `風と木の詩` were stopped before pixel access because the official previewable edition was not connected to the frozen representative edition by an official chapter or page bridge; both close `unknown-ready` without becoming promotion blockers. `SAKAMOTO DAYS` alone exposes an exact bounded sequence in p010–p011: attack start, evasive development, impact, and visible aftermath. Its motion gate is therefore attemptable, but this preflight assigns no Art value. The p034–p035 action in `信長協奏曲` lacks a conclusively bounded endpoint and does not open its motion gate.
