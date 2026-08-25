# Batch 005 text recovery QA — position 04 round 5

## Scope and attestation

- reviewer: Daybreak independent non-Art QA
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- branch / HEAD: `main` / `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen position / work: `4` / `work-0cf463005cc77eeded8e`
- canonical title: `黄泉のツガイ`
- evaluation scope: `entry_1_3_volumes`; direct review bounded to official MANGA UP episode 3
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- `PAYLOAD.sha256` SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- round-5 recovery packet SHA-256: `852b48ab55a4b368109f06f88c95065ae6e86b352950790e5a5c43182ac439f8`

This QA did not inherit the proposal. It reread the Factor Dictionary, the prior
episode-2 rejection, the final blocker report that identified the unused episode-3
route, and the current terminal matrices. It then downloaded and opened all twelve
exact rightsholder body pages again. No episode-2 observation was reused to support
the decision, and no Art cell was reconsidered.

## Official source and exact page verification

| sourceName | sourceUrl | publishedAt | retrievedAt | result |
| --- | --- | --- | --- | --- |
| SQUARE ENIX official MANGA UP — 黄泉のツガイ | https://www.manga-up.com/titles/901 | undated | `2026-08-25` | exact work and rightsholder route |
| SQUARE ENIX official MANGA UP episode 3 part 1 — デラとハナ | https://www.manga-up.com/titles/901/chapters/191003 | undated | `2026-08-25` | exact chapter `1163d3730_8`, six readable body pages |
| SQUARE ENIX official MANGA UP episode 3 part 2 — デラとハナ | https://www.manga-up.com/titles/901/chapters/191006 | undated | `2026-08-25` | exact chapter `1163d3730_9`, six readable body pages |

All twelve direct assets returned successfully and reproduced the packet hashes.
Temporary images remained under `/tmp` and were not committed.

| pageRef | exact official URL | reproduced SHA-256 |
| --- | --- | --- |
| `official-mangaup-episode03-001` | https://ja-img.manga-up.com/secure/1652418365/manga/high/1163d3730_8/1163d3730_8_001.webp?hash=WSawtXhokjCT_gzf3Ied3g&expires=1787695200 | `a6095d2e92e1b8469e7d0a77798ebb9c5cd47aef038e135b3a3cbfb0d5ce2ed1` |
| `official-mangaup-episode03-002` | https://ja-img.manga-up.com/secure/1652418368/manga/high/1163d3730_8/1163d3730_8_002.webp?hash=88rH9--rsYlko6hd5IvYvg&expires=1787695200 | `24ac956feee4a861e0dfb74a3dc51f72c16afcb22f12d3ab931d11176bd7f769` |
| `official-mangaup-episode03-003` | https://ja-img.manga-up.com/secure/1652418370/manga/high/1163d3730_8/1163d3730_8_003.webp?hash=kIhV75jVnIC1uobxKbuYqw&expires=1787695200 | `5d7acb96adc9578c55ff84fc08237f363944337801df7f3169ef8adcc70c7ed6` |
| `official-mangaup-episode03-004` | https://ja-img.manga-up.com/secure/1652418373/manga/high/1163d3730_8/1163d3730_8_004.webp?hash=qboaWE40sh_DSnP1uuq_bg&expires=1787695200 | `d856eca6ee7c50a70437e745a18116b2b71d007b630279f0698666002e0aa3c1` |
| `official-mangaup-episode03-005` | https://ja-img.manga-up.com/secure/1652418376/manga/high/1163d3730_8/1163d3730_8_005.webp?hash=HO3pjRXFKhoyKUXGCdCTMQ&expires=1787695200 | `356769d88082468215422a801eefb59565e777e9348ed645e0bd188408a78153` |
| `official-mangaup-episode03-006` | https://ja-img.manga-up.com/secure/1652418379/manga/high/1163d3730_8/1163d3730_8_006.webp?hash=Mw3P9R54zY1DXNlRWLWBkA&expires=1787695200 | `32ee3e0d617fa23dd41bc3a64393be4610a94da8ee20a0dc6da74f856f63d65a` |
| `official-mangaup-episode03-023` | https://ja-img.manga-up.com/secure/1652418425/manga/high/1163d3730_9/1163d3730_9_023.webp?hash=T0KW2fsHbFITQzl3amnXRg&expires=1787695200 | `c800da3e052641a9d0cf1021ab5af6bc54663447d6b23d646b9c5e660cd03c06` |
| `official-mangaup-episode03-024` | https://ja-img.manga-up.com/secure/1652418427/manga/high/1163d3730_9/1163d3730_9_024.webp?hash=0WAi9s2ajK-_YVM-eM6bgQ&expires=1787695200 | `8bd1ebea8aa17344e5cb07c98764fa4644c074e5f89a1661a98bb0f3dc4a9158` |
| `official-mangaup-episode03-025` | https://ja-img.manga-up.com/secure/1652418430/manga/high/1163d3730_9/1163d3730_9_025.webp?hash=FS71Vnh8FXvHSmP__M7EKA&expires=1787695200 | `88f7fb46ac8d025ec91ec3ecfd3381a28ed2a7e01f6273b6b7abcfffda0fb6d1` |
| `official-mangaup-episode03-026` | https://ja-img.manga-up.com/secure/1652418433/manga/high/1163d3730_9/1163d3730_9_026.webp?hash=gHPY03QbXWY3XAJpL0kg4w&expires=1787695200 | `5f75473e469a8762bd241e15c08eedb21dc1fc98200079d270b18fe1cf048a4a` |
| `official-mangaup-episode03-027` | https://ja-img.manga-up.com/secure/1652418436/manga/high/1163d3730_9/1163d3730_9_027.webp?hash=WcFAdNPLAK8c5U_iZsyEiw&expires=1787695200 | `d201df67fa353ff0db3844898ea981a5df373d48f8c6d9de27873114c02507f8` |
| `official-mangaup-episode03-028` | https://ja-img.manga-up.com/secure/1652418438/manga/high/1163d3730_9/1163d3730_9_028.webp?hash=zGSpmC6znuqzZB_1EJFYJA&expires=1787695200 | `3571d9050b6f4060e0fc9702ace50c6d757890172a4e04970cc3d75d880ce73c` |

## Independent decision

| proposal | QA | confidence | dictionary-bound reason |
| --- | --- | ---: | --- |
| `strategy=2` | `ACCEPT` | `0.88` | Pages `001–006` form an immediate threat process: the group identifies Yuru as the target, checks for a nearby Tsugai user, chooses a more populated destination, detects pursuit, identifies the Kagemori risk, and updates the plan to relocation. Pages `025–026` form a distinct concealment process: Dera compares rural-rumor, housing, social-trust, marriage, and room-sharing constraints before assigning an executable false-household cover. The two bounded processes establish repeated short tactical planning rather than one command, exposition block, or reactive fight. This matches “전술·단기 계획 존재.” |
| `problemSolving` | `RETAIN unknown` | — | The household cover is one clever logistical solution, but these pages do not add a second repeated obstacle-analysis/non-obvious-solution loop. Reusing it for two axes would double-count the same evidence. |

The immediate relocation process alone includes terse commands, but it is not accepted
on those commands alone. Its threat check, destination choice, pursuit monitoring, and
relocation update are followed by a separate constraint-comparison and role-assignment
process. The evidence therefore supports the midpoint while remaining insufficient for
`strategy=4`, which requires long-term planning, war, politics, or resource operation as
a core mechanism.

Exactly one terminal row changed; its canonical work-bound evidence ID is preserved:

```csv
work-0cf463005cc77eeded8e,strategy,known,2,0.88,ev-batch-005-a-work-0cf463005cc77eeded8e
```

No Genre, Theme, Art, source, generated catalog, registry, blocker, overlay, eligibility,
or promotion file changed.

## Hash, schema, and gate audit

| file | rows excluding header | before SHA-256 | after SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-01.csv` | `170` | `5f31fa426b8e7959f0208c35baef4b0da3889fbf698e814c80282f7e0c784674` | `625fb4975a5a92f6c903aa8ec09e4c4e35479741c5ab13fc21955a602a961d98` |
| `adjudication/genres-final-chunk-01.csv` | `10` | `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1` | unchanged |
| `adjudication/themes-final-chunk-01.csv` | `11` | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | unchanged |
| `art-review/chunk-01/final-art.csv` | `40` | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` | unchanged |

The text matrix remains exactly `10 × 17 = 170` rows in frozen work and Factor
Dictionary order. It now contains `46` known and `124` unknown rows. All unknown
cells retain empty value and confidence fields; no unknown was treated as zero.

| state | Genre | Theme | Narrative | Tone | Art | full gate |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| position 4 before | `1/1` | `2` legal rows | `3/6` | `5/7` | `3/4` | fail: N+1 |
| position 4 after | `1/1` | `2` legal rows | `4/6` | `5/7` | `3/4` | pass |

This QA closes the coverage deficit only. It does not itself authorize promotion;
the remaining non-coverage promotion gates and overlay still apply.

## Verification

- official direct assets: `12/12 HTTP success`, `12/12 HASH_MATCH`
- schema/order: `SCHEMA_ORDER_OK rows=170 works=10 known=46 unknown=124`
- gate recount: `N=4/6 T=5/7 A=3/4`, Genre pass, Theme pass, full coverage pass
- reviewedByHuman: `false`
- `git diff --check`: pass
