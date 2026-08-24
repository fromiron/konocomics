# Batch 003 chunk 05 Daybreak recovery A2 verification

- reviewDate: 2026-08-25
- reviewer: `gpt-daybreak-blue-latest`
- agent: `/root/daybreak_verify_art_a2`
- reviewedByHuman: `false`
- scope: frozen positions 45 and 46 only
- mode: independent edition, gate, original-pixel, and hash verification; no Art values assigned
- result: `REJECT`
- findings: 1
- repositoryEditsByReviewer: this report only

## Frozen input and hash verification

- Frozen Work identities match position 45 `work-df29832c2155775e0e7c` / `となりの関くん` and position 46 `work-ea41ee65245a0dbdc4a8` / `男子高校生の日常` in `frozen-work-set.csv`.
- The operational amendment permits directly bridged official samples from entry volumes 1–3 while retaining the minimum of six readable internal body pages and two materially distinct scene contexts.
- Recovery A2 preflight SHA-256: `c2254ac36737444b769f74849037b55a417880bd05f7023d78c3f0aee927dd8c`.
- Recovery A2 ledger SHA-256: `325ee52099cdb47df404a2ab9af2214a839265a6b7c3e183394ad484168c4d12`.
- Every retained file was opened at original pixels and independently rehashed: `13/13 HASH_MATCH`; position 45 `6/6`, position 46 `7/7`.
- All 13 retained files are readable internal body pages. No retained file is a cover, title splash, table of contents, blank, decorative page, or adjacent-page fragment.

| Pos | Ref                  | Temporary file          | Original pixels | Computed SHA-256                                                   | Result |
| --: | -------------------- | ----------------------- | --------------: | ------------------------------------------------------------------ | ------ |
|  45 | `vol2-P005`          | `seki2-page05.png`      |     `1233x1291` | `bed7d824eb68c7018f817a17c8c5a11da724e81332db2c7ff365974dab55e778` | match  |
|  45 | `vol2-P006`          | `seki2-page06.png`      |     `1233x1291` | `0d0ddef24f8c80f57e9083e56f18e8c2deb118f013dc17a7090c6596a6766b8f` | match  |
|  45 | `vol2-P007`          | `seki2-page07.png`      |     `1233x1291` | `72fd3eeda60b5dfa80fc9079e8d293ef969098c8560d8117595f5ef2e16961fd` | match  |
|  45 | `vol2-P010`          | `seki2-page10.png`      |     `1233x1291` | `7a595e0c9cd3f4a1e64172196fc7104b0360fe33bd36ac2e4bb6fc55beebf0a5` | match  |
|  45 | `vol2-P011`          | `seki2-page11.png`      |     `1233x1291` | `a2aed4b951f3da5a6f23e6154176eb046aa3bd6734bcac646b8923f06f3d0efc` | match  |
|  45 | `vol2-P012`          | `seki2-page12.png`      |     `1233x1291` | `e5748a2681d61046e35c9003215e2d4d7e7803115ea9cb829118638c53a81428` | match  |
|  46 | `episode-01-page-01` | `danshi-p01.webp`       |      `960x1365` | `e0c51fd083419907dfa41ed3e832ba85704de0cfed78ed62ba78241c2a21b6d2` | match  |
|  46 | `episode-01-page-02` | `danshi-p02.webp`       |      `960x1365` | `15a51f2bdec04808257fbab20861dc26ab4bcb8d9d1486d3dc8db748931d9906` | match  |
|  46 | `episode-01-page-03` | `danshi-p03.webp`       |      `960x1365` | `80a9adf76dcd9f9c57ed95e0c8c6c1f3c0fd976943ee2bfd2839fc16495328e5` | match  |
|  46 | `episode-01-page-04` | `danshi-p04.webp`       |      `960x1365` | `74d547ad0ecec8509290e34bfec096a7c5610c2ea41ea93aef1fcea1389c2b4c` | match  |
|  46 | `episode-01-page-05` | `danshi-p05.webp`       |      `960x1365` | `370aafc5816edb7d335d5c767585c224f33d139b56bde47f2fb6179f2805bb95` | match  |
|  46 | `episode-02-page-01` | `danshi2-p01-clean.png` |      `960x1365` | `4a2c19c85dfc333ba12c801f1e504f9bf0bdebbbb2f84cbd2a74a20d26b9fbaa` | match  |
|  46 | `episode-02-page-02` | `danshi2-p02-clean.png` |      `960x1365` | `c82149c58bf1d23105b981e2865aaff28c9a104b4827313c3ee062f61bc46078` | match  |

## Per-work result

| Pos | Work             | Result                   | Exact reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --: | ---------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  45 | となりの関くん   | **REJECT**               | The entry-volume bridge is exact: KADOKAWA products `301401001834`, `301401001835`, and `301401001836` identify volumes 1–3 / ISBNs `9784040665177`, `9784040665184`, and `9784040665191`; the volume-2 product directly links BOOK☆WALKER product `deb0063cc9-79d9-40fd-bc5c-8be3f6b607f8`, whose trial redirects to viewer CID `b0063cc9-79d9-40fd-bc5c-8be3f6b607f8`. All six retained hashes match exact volume-2 body pages. The scene gate nevertheless fails: `P005-P007` and `P010-P012` are one continuous classroom lesson and one continuous fukuwarai activity at Seki's desk. The unretained bridge pages `P008-P009` explicitly continue the same face parts, teacher interruption, and desk play into `P010`; the later family/baby arrangement is development of that same activity, not a materially distinct scene. Context count is `1`, below the required `2`. No retained refs form an exact bounded start-development-impact-resolved physical sequence, so motion abstention is correct.              |
|  46 | 男子高校生の日常 | **PASS (unknown-ready)** | SQUARE ENIX products identify entry volumes 1–3 / ISBNs `9784757528062`, `9784757529052`, and `9784757530317`. The volume-1 record directly links official chapter `7961` as `第1話 試し読み`; the volume-2 and volume-3 records also point to chapter `7961`, not chapter `7958`. No inspected official product record maps chapter `7958` / episode 2 to any frozen entry ISBN. All seven retained hashes match readable body pages, and the episode-1 boys' room and episode-2 after-school classroom are materially distinct real scenes, not an angle, doorway continuation, or imagined insert. However, only the five episode-1 pages have an exact frozen-volume bridge; the second context and pages 6–7 are unbridged. The eligible bridged subset therefore has only `5` pages and `1` context, so static Art must remain unknown. The `unknown-ready` abstention is correct. Neither episode supplies an exact bounded start-development-impact-resolved physical sequence, so motion abstention is also correct. |

## Boundary

Position 45 must not be treated as static `sample-ready` from Recovery A2 because it still has only one materially distinct scene. Position 46 correctly closes `unknown-ready`: same-title official episode provenance does not substitute for an exact volume bridge. This verification assigns no Art values, recommends no promotion, and does not constitute human review.
