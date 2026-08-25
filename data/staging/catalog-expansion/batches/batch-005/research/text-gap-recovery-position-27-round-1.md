# Batch 005 position 27 Narrative gap recovery — round 1

## Scope and current state

- 조사일 / `accessedAt`: `2026-08-25` (Asia/Tokyo)
- 대상: position `27`, `work-5e30ab3c7e3fb43e51f2`, 女王の花
- 평가 범위: `entry_1_3_volumes` (공식 1–3권 및 그 초반 전개)
- `reviewedByHuman=false`
- 현재 terminal coverage: Narrative `3/6`, Tone `6/7`, Art `4/4` (terminal/adjudication 파일은 이 조사에서 수정하지 않음)
- 목적: 현재 미확인 Narrative 축에서 **최대 하나**의 독립 adjudication 후보를 제시하는 research-only packet

이 파일은 terminal adjudication/source/generated/promotion 파일을 변경하지 않는다. 기존에 기각된
`progression` 제안은 재개하지 않는다. 작품명에는 장식용 `『』`를 붙이지 않았다.

## Source ledger and range binding

| ID | Source | Published / edition date | `accessedAt` | Direct URL | Use |
| --- | --- | --- | --- | --- | --- |
| `27-R1-O1` | 小学館 official volume 1 | `2008-08-26` (frozen representative paper volume, ISBN `9784091320094`) | `2026-08-25` | [volume 1 product](https://shogakukan-comic.jp/book?jdcn=091320090000d0000000) | Entry opening: 亜国の姫・亜姫と奴隷の少年・薄星の出会いと bond setup |
| `27-R1-O2` | 小学館 official volume 2 | `2010-07-26` (ISBN `9784091333834`) | `2026-08-25` | [volume 2 product](https://shogakukan-comic.jp/book?jdcn=091333830000d0000000) | Mother’s poisoning, hostage transfer, and support by 薄星/青徹; confirms the entry’s political-military setting |
| `27-R1-O3` | 小学館 official volume 2 speed reader | same volume as `27-R1-O2` | `2026-08-25` | [volume 2 official reader](https://shogakukan-comic.jp/reader/speed.php?cid=091333830000d0000000_582&u0=1&u1=https%3A%2F%2Fshogakukan-comic.jp%2Fbook%3Fjdcn%3D091333830000d0000000) | Reader position `40`: direct bounded tactical assessment and short-plan evidence |
| `27-R1-O4` | 小学館 official volume 3 | `2011-01-26` (ISBN `9784091336545`) | `2026-08-25` | [volume 3 product](https://shogakukan-comic.jp/book?jdcn=091336540000d0000000) | First-arc continuation: relationship change and 青徹’s crisis; closes the 1–3 volume boundary |
| `27-R1-B1` | 楽天ブックス exact product match | ISBN `9784091320094`, volume 1 | `2026-08-25` (match recorded `2026-08-22`) | [Rakuten Books volume 1](https://books.rakuten.co.jp/rb/5807326/) | Bookstore/edition identity only; not used as factor evidence |
| `27-R1-A1` | マンガ大賞 official 2011 archive | `2011` selection | `2026-08-25` | [Manga Taisho 2011 archive](https://www.mangataisho.com/archives/2011.html) | Award/source identity corroboration only; not used to assign a Narrative value |
| `27-R1-A2` | マンガ大賞 official 2014 comments | `2014` comment page | `2026-08-25` | [Manga Taisho 2014 comments PDF](https://www.mangataisho.com/data/2014/comment2014.pdf) | Series-level context only; later than entry scope and excluded from numeric support |

The official volume pages bind the first three published volumes: volume 1 opens with the
亜国/亜姫/薄星 setup; volume 2 describes the poisoning and hostage transfer; volume 3 describes
the changing relationship and the danger to 青徹. The official editor copy on the volume 3 page
calls the work a fictional historical drama and a conquest/growth story, but that broad label is
not reused to reopen the previously rejected `progression` value.

## Single proposed axis

| workId | axisId | proposed state | value | confidence | evidence ID |
| --- | --- | --- | ---: | ---: | --- |
| `work-5e30ab3c7e3fb43e51f2` | `strategy` | `known` | `2` | `0.86` | `ev-batch-005-a-work-5e30ab3c7e3fb43e51f2` |

### Exact bounded support

The rendered official volume 2 reader at position `40` shows one continuous tactical
assessment rather than a generic battle label:

- a map marks `黄` upstream and `土`, then the character compares the force counts:
  `土軍10万に対し黄軍5万`;
- the dialogue asks why the 土軍 keeps its position by the river despite that force
  difference, and explicitly asks why it ignored `兵法の初歩`;
- the map then marks `対岸 敵 土軍・拠点` (the enemy 土 army/base on the opposite bank),
  with the river direction and terrain in the same panel.

This is direct publisher-reader text and map annotation, not an inference from the work’s
historical/romance genre. It identifies a short tactical situation: compare forces, inspect
terrain and river position, and question the opponent’s placement. The official volume 2
synopsis supplies the same bounded political setting (poisoning, hostage transfer, merchant
support), while volume 3 confirms that this is still the opening arc; neither later-volume
material nor a user review is needed for the proposed value.

### Dictionary mapping and limit

The Factor Dictionary’s `strategy=2` anchor is “tactical/short plan exists.” The reader scene
meets that midpoint anchor through explicit force/terrain/position analysis. It does **not** meet
`strategy=4`: the reviewed entry evidence does not establish a recurring long-term war plan,
multi-step resource operation, or politics/war as a sustained planning system. The value should
therefore be `2`, not `4`.

This is also not a proposal for `problemSolving`: the page provides tactical analysis but does not
show the repeated mixed wits/direct-action solution loop required for that axis. `progression`
remains `unknown`; the earlier broad “conquest/growth story” proposal was rejected and is not
reintroduced here. No Tone, Theme, Genre, or Art value is proposed.

## Adjudication handoff

An independent adjudicator should verify the official reader route and position `40`, including
the visible count comparison, river/terrain map, `対岸 敵 土軍・拠点`, and `兵法の初歩` wording.
If the reader position cannot be reproduced, retain `strategy=unknown` rather than downgrading
the scene to a value inferred from synopsis or genre. This packet contains exactly one candidate
axis and does not authorize materialization or promotion.

## Non-mutation check

- No terminal adjudication CSV was edited.
- No source/provenance, generated catalog, Art, eligibility, or promotion file was edited.
- No user-review wording was used as factor support.
- No decorative title wrappers were added.
