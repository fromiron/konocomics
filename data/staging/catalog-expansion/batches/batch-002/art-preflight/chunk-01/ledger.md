# Batch 002 Art preflight chunk 01

Retrieved on 2026-08-23. Scope is the first ten frozen Batch 002 works in manifest order. This is access and sampling preflight only: no Art axis value or confidence was inferred.

## Efficiency rule

- Resolve an official publisher internal preview within volume 1 to 3 or the first major episode and map it to the source representative edition.
- Stop sampling after six readable internal pages across at least two distinct contexts. Covers, synopsis material, animation, and user opinion are excluded.
- Static review is attemptable only at that threshold. Motion review is attemptable only when the inspected pages expose an exact continuous start-development-impact-end sequence.
- A below-threshold work ends as `unknown-ready`, without an Art value. Qualifying access ends as `sample-ready`; this is not an annotation decision.
- Temporary captures live only under `/tmp/batch002-art-preflight.DZG1uL`. They are not staged or committed. The CSV records SHA-256 for each capture actually used.

## Results

| Work                                       | Official edition mapping                 | Access            | Internal pages | Contexts | Page refs                 | Static | Motion | State         |
| ------------------------------------------ | ---------------------------------------- | ----------------- | -------------: | -------: | ------------------------- | ------ | ------ | ------------- |
| work-017446dd1a9039d9839b サンダー３       | first episode to vol1 ISBN 9784065289280 | accessible        |              6 |        2 | p010-p015                 | yes    | no     | sample-ready  |
| work-02d5d329c9ef85e481cb のたり松太郎     | digital vol1 JDCN 091800710000d0000000   | accessible        |              6 |        3 | reader steps 05 to 07     | yes    | no     | sample-ready  |
| work-089947c5303024841fef デカワンコ       | digital vol1 JDCN 08865501865501315501   | accessible        |              6 |        2 | p006-p007 and p010-p013   | yes    | no     | sample-ready  |
| work-0e036724913c69bb937a ファイアパンチ   | digital vol1 JDCN 08880731880731315501   | accessible        |              6 |        2 | p004-p009                 | yes    | no     | sample-ready  |
| work-1012948f5de799831da4 RED              | digital vol1 JDCN 0634601200100011000B   | product page only |              0 |        0 | none                      | no     | no     | unknown-ready |
| work-1088a1dc00a3b0d22201 邪眼は月輪に飛ぶ | standard one-volume ISBN 9784091811974   | accessible        |              6 |        3 | p010-p015                 | yes    | no     | sample-ready  |
| work-19a26f01512166856a6a 銀河鉄道999      | digital vol1 JDCN 091880010000d0000000   | accessible        |              6 |        2 | p016-p021                 | yes    | no     | sample-ready  |
| work-1e27731b880d0d9012f8 吉祥天女         | digital vol1 JDCN 091313010000d0000000   | accessible        |              6 |        3 | p018-p023                 | yes    | no     | sample-ready  |
| work-207bb1ca28b7472fbe1d 六三四の剣       | digital vol1 JDCN 091206310000d0000000   | accessible        |              6 |        3 | p018-p023                 | yes    | no     | sample-ready  |
| work-23851cd7ccf1d0c676cc 怪獣8号          | vol1 ISBN 9784088825250                  | accessible        |              6 |        3 | reader steps 12 14 and 18 | yes    | no     | sample-ready  |

## Limitations

The six-page count is the exact qualifying sample inspected rather than the total length of each publisher preview. Three Shogakukan pages did not expose a release date; those `publishedAt` cells are explicitly `undated`. RED resolves to the official volume-1 product and JDCN but exposes no official internal reader route, so it is explicitly `unknown-ready`. No inspected sample established the bounded continuous sequence required even to attempt the motion gate.
