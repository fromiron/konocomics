# Batch 003 Art corrective recovery A2

- retrievedAt: 2026-08-25
- scope: frozen Batch 003 positions 45 and 46 only
- reviewedByHuman: `false`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- acquisition boundary: reuse of `/tmp/konocomics-batch003-art-recovery-a` plus the already-established official/product-linked routes only; no broad re-crawl
- gate rule: at least six readable internal body pages and at least two genuinely distinct scene contexts for static recovery; motion remains attemptable only for one exact continuous start-development-impact-resolved sequence

## Recovery result

| Pos | Work | Exact edition bridge | Eligible body pages | Contexts | Static | Motion | State | Residual |
| --: | --- | --- | ---: | ---: | --- | --- | --- | --- |
| 45 | となりの関くん | KADOKAWA products 301401001834 / ISBN 9784040665177, 301401001835 / ISBN 9784040665184, and 301401001836 / ISBN 9784040665191; BookWalker product `deb0063cc9-79d9-40fd-bc5c-8be3f6b607f8` and viewer CID `b0063cc9-79d9-40fd-bc5c-8be3f6b607f8` are the exact vol2 licensed preview route | 6: vol2 P005-P007 and P010-P012 | classroom lesson gag; separate family and baby commemorative-photo gag | yes | no | sample-ready | No exact bounded motion sequence; cover/title/contents/blank pages excluded |
| 46 | 男子高校生の日常 | SQUARE ENIX vol1 product ISBN 9784757528062 directly links Gangan Online chapter 7961; vol2 ISBN 9784757529052 and vol3 ISBN 9784757530317 product pages checked; chapter 7958 is the same official title route without an explicit ISBN-to-volume bridge | 7: episode 1 pages 1-5 and episode 2 pages 1-2 | episode-1 boys-room interaction; episode-2 after-school classroom interaction | closed | no | unknown-ready | The seven body pages and two contexts are readable, but only episode 1 is directly ISBN bridged; close all Art static axes unknown rather than infer frozen-volume provenance |

## Position 45 — となりの関くん

Official product and licensed-viewer bridges:

- `https://www.kadokawa.co.jp/product/301401001834/` — vol1 ISBN `9784040665177`
- `https://www.kadokawa.co.jp/product/301401001835/` — vol2 ISBN `9784040665184`
- `https://www.kadokawa.co.jp/product/301401001836/` — vol3 ISBN `9784040665191`
- `https://bookwalker.jp/deb0063cc9-79d9-40fd-bc5c-8be3f6b607f8/?sample=1&from=1` — product-linked vol2 BOOK☆WALKER trial
- `https://viewer-trial.bookwalker.jp/03/21/viewer.html?cid=b0063cc9-79d9-40fd-bc5c-8be3f6b607f8&cty=1` — exact vol2 viewer

Eligible page refs and SHA-256:

- `vol2-P005=bed7d824eb68c7018f817a17c8c5a11da724e81332db2c7ff365974dab55e778`
- `vol2-P006=0d0ddef24f8c80f57e9083e56f18e8c2deb118f013dc17a7090c6596a6766b8f`
- `vol2-P007=72fd3eeda60b5dfa80fc9079e8d293ef969098c8560d8117595f5ef2e16961fd`
- `vol2-P010=7a595e0c9cd3f4a1e64172196fc7104b0360fe33bd36ac2e4bb6fc55beebf0a5`
- `vol2-P011=a2aed4b951f3da5a6f23e6154176eb046aa3bd6734bcac646b8923f06f3d0efc`
- `vol2-P012=e5748a2681d61046e35c9003215e2d4d7e7803115ea9cb829118638c53a81428`

P005-P007 are readable internal body pages from one classroom lesson gag. P010-P012 are a separate narrative gag about a family and baby commemorative photograph, not the rejected vol3 desk-fossil excavation continuation. Covers, title, contents, and blank material are excluded. The six pages meet the static gate. No exact continuous start-development-impact-resolved physical sequence was retained, so motion is not attemptable and no Art value is assigned.

## Position 46 — 男子高校生の日常

Official product and episode bridges:

- `https://magazine.jp.square-enix.com/top/comics/detail/9784757528062/` — vol1 ISBN `9784757528062`, product-linked to `https://www.ganganonline.com/title/92/chapter/7961`
- `https://magazine.jp.square-enix.com/top/comics/detail/9784757529052/` — vol2 ISBN `9784757529052`
- `https://magazine.jp.square-enix.com/top/comics/detail/9784757530317/` — vol3 ISBN `9784757530317`
- `https://www.ganganonline.com/title/92/chapter/7961` — official episode 1
- `https://www.ganganonline.com/title/92/chapter/7958` — official episode 2, same title route

Eligible page refs and SHA-256:

- `episode-01-page-01=e0c51fd083419907dfa41ed3e832ba85704de0cfed78ed62ba78241c2a21b6d2`
- `episode-01-page-02=15a51f2bdec04808257fbab20861dc26ab4bcb8d9d1486d3dc8db748931d9906`
- `episode-01-page-03=80a9adf76dcd9f9c57ed95e0c8c6c1f3c0fd976943ee2bfd2839fc16495328e5`
- `episode-01-page-04=74d547ad0ecec8509290e34bfec096a7c5610c2ea41ea93aef1fcea1389c2b4c`
- `episode-01-page-05=370aafc5816edb7d335d5c767585c224f33d139b56bde47f2fb6179f2805bb95`
- `episode-02-page-01=4a2c19c85dfc333ba12c801f1e504f9bf0bdebbbb2f84cbd2a74a20d26b9fbaa`
- `episode-02-page-02=c82149c58bf1d23105b981e2865aaff28c9a104b4827313c3ee062f61bc46078`

Episode 1 page 0 is a title splash and is excluded. Pages 1-5 are readable body pages in the boys-room interaction. Episode 2 pages 1-2 are readable body pages in a different after-school classroom interaction. This produces seven body pages and two genuine contexts, but the official evidence inspected does not state which frozen ISBN/volume contains episode 2. The reproducible conservative closure is `unknown-ready`: static Art axes remain unknown, with no value inferred from the same-title route. The sampled pages do not show an exact bounded start-development-impact-resolved sequence, so motion is not attemptable.

## Closure

Position 45 is restored to `sample-ready` with six exact vol2 body pages and two separate narrative contexts. Position 46 has the requested seven readable body pages and two contexts, but its second episode lacks an explicit frozen-volume bridge; all Art static axes therefore close unknown. No Art values were assigned, and no temporary images were added to the repository.
