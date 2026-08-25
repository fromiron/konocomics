# Batch 005 position 39 Art route recovery — round 1

## 조사 경계

- 대상: frozen work-set position `39`, `work-aa6018249b7fe7e92d95`, `かよちゃんの荷物`
- 조회일: `2026-08-25`
- `reviewedByHuman=false`
- 평가 범위: canonical entry `entry_1_3_volumes`에 대응하는 권 1–3 및 동일 작품의 신장판 상·하
- current branch / HEAD: `main` / `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Art gate: readable internal BODY pages at least 6개, genuinely distinct contexts at least 2개. `motionImpact=known`은 별도의 연속 시퀀스 gate를 통과해야 한다.

이 recovery는 route 조사만 수행한다. Art 값을 배정하지 않았고, 기존
`art-preflight/chunk-04/preflight.csv`, `art-preflight/chunk-04/ledger.md`,
`art-review/chunk-04/final-art.csv`, source/generated/promotion 파일을 수정하지
않았다. 임시 이미지도 저장소에 추가하지 않았다. 표본 부족은 낮은 값이 아니라
`unknown-ready`로 종결한다.

## canonical identity와 edition bridge

현재 canonical record는 다음과 같다.

| 항목 | 확인값 |
| --- | --- |
| canonical title | `かよちゃんの荷物` |
| creator | `雁須磨子` |
| publisher | `竹書房` |
| frozen representative ISBN | `9784812465752` (standard, original volume 1) |
| selection identity | [マンガ大賞2010 作品コメント](https://www.mangataisho.com/data/2010/comment2010.pdf) (2010, retrieved 2026-08-25) |
| current approved route registry | `data/staging/catalog-expansion/art-source-route-registry.csv` |

`works.csv`, `volumes.csv`, Rakuten match, and the BookWalker/BookLive product
metadata all agree on the clean title `かよちゃんの荷物` and creator `雁須磨子`.
The BookWalker and BookLive entries are a 2017 Takeshobo `新装版` split into
上・下, not the frozen original standard ISBN. They are therefore usable only as
an explicitly bridged same-work edition candidate; they must not silently replace
the frozen representative ISBN.

## finite route ledger

All routes below were checked on `2026-08-25`. The counts are Art-gate counts,
not product page counts. Covers, title pages, contents, advertisements, and
non-body metadata are never counted.

| route | edition / identity evidence | access result | BODY pages / contexts | gate result |
| --- | --- | --- | ---: | --- |
| Approved publisher registry lookup | Registry contains nine approved publisher rows; no `竹書房` row or Takeshobo product/preview route | No registered route to sample | `0 / 0` | `unknown-ready`; this is registry-bounded, not a global claim that no preview exists |
| BookLive [新装版 上](https://booklive.jp/product/index/title_id/439092/vol_no/001) | HTML title identifies `かよちゃんの荷物 新装版 上`, `雁須磨子`, `竹書房`; product has `bl-bviewer` trial control for `title_id=439092`, `vol_no=001`; listed release is 2017 | Accessible licensed product/trial. Existing trial measurement is retained unchanged | `4 / 1` | **insufficient**, and must remain insufficient |
| BookLive [新装版 下](https://booklive.jp/product/index/title_id/439092/vol_no/002) | HTML title identifies `かよちゃんの荷物 新装版 下`, same creator/publisher; `vol_no=002` | Product/trial route accessible, but no new compliant 6-page/2-context capture was retained in this recovery | `0 / 0` retained here | Does not reopen the existing insufficient upper result |
| BOOK☆WALKER [新装版 上](https://bookwalker.jp/de823a2c37-d79e-4358-82e2-c84b8acc9d33/) | Product identifies same title/creator, `バンブーコミックス`, `竹書房`, copyright `(C)雁須磨子/竹書房`; product date `2017/4/28`; ABJ mark identifies a rights-holder-authorized distribution service. The linked trial redirects to `https://viewer-trial.bookwalker.jp/03/21/viewer.html?cid=823a2c37-d79e-4358-82e2-c84b8acc9d33&cty=1` | Final viewer document HTTP 200, but static HTML only loads `viewer_loader_2.0.29_2025-03-12.js`; direct curl and Chrome DevTools observed no internal page image/API requests. Playwright and DevTools did not materialize a readable page | `0 / 0` | **not attemptable**; no page refs or hashes |
| BOOK☆WALKER [新装版 下](https://bookwalker.jp/de90e7d72e-1f81-40ad-904b-9e0c6ed2de25/) | Product identifies same title/creator, `バンブーコミックス`, `竹書房`, copyright `(C)雁須磨子/竹書房`; product is marked `最終巻`; series page says two books. The linked trial redirects to `https://viewer-trial.bookwalker.jp/03/21/viewer.html?cid=90e7d72e-1f81-40ad-904b-9e0c6ed2de25&cty=1` | Same viewer behavior: HTTP 200 loader document but no internal page image/API requests or readable page material | `0 / 0` | **not attemptable**; no page refs or hashes |
| Official award comment PDF | Identifies the work and provenance only; no product-linked internal pages | Accessible PDF, not an Art preview | `0 / 0` | Provenance only; never a pixel source |

### BookLive insufficiency is preserved

The existing BookLive upper trial was measured as exactly **4 readable BODY pages
and 1 context**. This recovery does not upgrade, merge, or reinterpret those
captures. It remains below both static thresholds. The lower product is an
identity/edition lead only in this round because no new retained capture was made.

### BookWalker route behavior

The BookWalker products are useful identity and authorization evidence: both pages
show the same work, creator, Takeshobo copyright, and a free-trial link; the site
also displays the ABJ authorization statement. They are not in the current
approved publisher route registry, so they were treated as a licensed-distributor
fallback, not silently promoted into the registry.

For both upper and lower products, the `?sample=1&from=1` link redirected through
the BookWalker trial endpoint to the `/03/21/viewer.html` document. The final
document returned HTTP 200 and loaded the common stylesheet plus the dated loader
script, but neither `curl` nor a browser session produced page-image, XHR, fetch,
or other internal-page requests. The browser page remained without readable body
content; therefore there is no defensible page reference, context count, or
SHA-256 capture to put in a preflight row.

## conclusion

No attempted route yielded the required `>=6` readable BODY pages and `>=2`
distinct contexts. The only existing sample (BookLive upper, `4/1`) remains
insufficient. The current approved registry is finite and lacks Takeshobo; the
BookWalker fallback is identity-valid but its viewer did not expose sample pixels.

Accordingly:

- no recovery `preflight.csv` or recovery `ledger.md` was created;
- existing chunk-04 position 39 remains `unknown-ready`, `0/0`, with no Art values;
- no Art axis, confidence, motion evidence, or promotion decision was assigned;
- no temporary images or hashes are claimed;
- further work requires a newly approved Takeshobo route or a functioning
  product-linked reader that exposes edition-bound internal pages.

## verification

```text
reviewedByHuman=false
retrievedAt=2026-08-25
temporaryImagesCommitted=false
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/art-route-recovery-pos39-round-1.md  # PASS
```
