# Pilot 001 final text overlay report

## Boundary

- Frozen Pilot: `pilot-001`, 50 non-Gold works, manifest HEAD `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`.
- Output scope: 13 text axes, Genres, Themes, and consolidated text Evidence only. Art is excluded.
- Repository and source CSVs were not modified. All artifacts are under `/tmp`.
- Review provenance remains model-panel only: `reviewedByHuman=false`.

## Precedence applied

1. Exact current-SHA terminal adjudication.
2. Current-SHA Cursor Grok follow-up/review.
3. Independently accepted follow-up.
4. Baseline Pass B/C.
5. Pass A only as fallback.

The five terminal overrides are applied exactly: the Hidamari, Kakukaku/Mashiro, Golden Gold, and Keion follow-up reports replace conflicting lower-precedence claims. Umimachi `strategy=1` is retained from the current-SHA review. No average or majority vote was used.

## Confidence decisions

- A Pass A confidence is retained only when the terminal current-SHA review explicitly retained the same state, value, and underlying entry evidence. The final Evidence ID is a new overlay foreign key, not a claim change.
- Every changed/new known claim has an explicit static confidence in the decision ledger. Scores were adjudicated against the Factor Dictionary and the named official entry-range evidence; there is no source-class score, confidence averaging, vote, or Evidence-confidence copy.
- Exact `0.92` for Hidamari `romance=2` is stated by its terminal report.
- Exact `0.73` for Mashiro `mysteryReveal=1` resolves the report's approximate range without averaging: one direct subordinate disclosure is supported, while full-volume access is incomplete.
- Repeated numeric values are calibration anchors, not automatic rules. The ledger records a claim-specific basis and precedence file on every changed row.
- Each work-level Evidence confidence is the minimum of that work's final known text/Theme claim confidences. This aggregation is deterministic and never feeds claim confidence back into a Factor or Theme.

## Counts and gates

| Metric | Result |
|---|---:|
| Works | 50 |
| Factor rows | 650 |
| Known Factor rows | 474 |
| Unknown Factor rows | 176 |
| Changed/new known Factor claims | 238 |
| Retained known Factor claims | 236 |
| Corrected known-to-unknown Factor claims | 2 |
| Genre rows | 50 |
| Changed Genre rows | 3 |
| Theme rows | 78 |
| Changed/new Theme claims | 9 |
| Retained Theme claims | 69 |
| Evidence rows | 50 |
| Narrative gate | PASS for all 50, at least 4/6 known |
| Tone gate | PASS for all 50, at least 5/7 known |
| Nonempty Genre/Theme | PASS for all 50 |
| Canonical enum/order | PASS |
| Decorative title quote check | PASS |
| Repository source-schema parse | PASS — factor, Theme, and Evidence rows were parsed by the repository source Zod schemas; Genre rows were checked against canonical enums. |

## Final-value source files

| workId | Authoritative final file | Primary official URL |
|---|---|---|
| work-0153a125c5a56225b06c | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://www.shodensha.co.jp/ikokunikki/ |
| work-0262dcaa820443c3185d | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt | https://www.leed.co.jp/9784845800018 |
| work-07b11ec79f10c7eb7e05 | data/staging/catalog-expansion/pilots/pilot-001/reviews/text-coverage-followup-g-review.md | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782457-5 |
| work-07dc759bd91e1cffb2df | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://www.akitashoten.co.jp/comics/4253160824 |
| work-07ff2a01ef593ce2f809 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-867520-6 |
| work-081e75d8bbc53ac64713 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-892767-1 |
| work-0bec5d8d9474a2197312 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://store.kadokawa.co.jp/shop/g/g200700002446/ |
| work-112589a161d1596ec97f | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://shogakukan-comic.jp/book?isbn=9784098535439 |
| work-11296a590b885cb73b66 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://www.kodansha.co.jp/comic/products/0000036416 |
| work-14e489bf1afd1587c44a | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt | https://shogakukan-comic.jp/book?isbn=9784091922816 |
| work-192cbecc59e9c028142b | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://store.kadokawa.co.jp/shop/g/g322405000881/ |
| work-1cf7a0bb5f55e0d69b27 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://e-comi.shogakukan.co.jp/books/091251610000d0000000 |
| work-1fc61ddbeb429b4a2c15 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://www.kadokawa.co.jp/product/301407000933/ |
| work-205e576ef057e3aed1ab | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-03-response.txt | https://e-comi.shogakukan.co.jp/books/091316700000d0000000 |
| work-222504590507d3ab8093 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://www.kadokawa.co.jp/product/321811000381/ |
| work-268e1fa3599955359969 | data/staging/catalog-expansion/pilots/pilot-001/reviews/text-coverage-followup-keion.md | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884238-7 |
| work-2f39795212f5ad8db155 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://e-comi.shogakukan.co.jp/books/091835410000d0000000 |
| work-303d0a9d67a606a817af | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://e-comi.shogakukan.co.jp/books/091830210000d0000000 |
| work-34bba03e2a127ef29cd7 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://www.kadokawa.co.jp/product/321706000806/ |
| work-3588928ab8f6a2520923 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://www.akitashoten.co.jp/comics/4253265219 |
| work-37ecced0b2392d7af9b2 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://shogakukan-comic.jp/book?isbn=9784098625420 |
| work-3823ff0766f67c015c53 | data/staging/catalog-expansion/pilots/pilot-001/reviews/text-coverage-followup-g-review.md | https://www.kodansha.co.jp/comic/products/0000043275/trial |
| work-39555fe7402dada0d79f | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt | https://websunday.net/work/720/ |
| work-440f93a4e60ef906685b | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt + data/staging/catalog-expansion/pilots/pilot-001/reviews/theme-gap-pass-c-review.md | https://web.archive.org/web/20040820212024id_/http://books.shueisha.co.jp:80/CGI/search/syousai_put.cgi?isbn_cd=4-08-848709-5&mode=1 |
| work-464322afcd10013437b9 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://www.hakusensha.co.jp/comicslist/40895/ |
| work-4a8a22fc766bf9bc4c59 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt | https://e-comi.shogakukan.co.jp/books/091365010000d0000000 |
| work-5e7eef6cc23d9738e034 | data/staging/catalog-expansion/pilots/pilot-001/reviews/text-coverage-followup-golden-gold.md | https://comic-days.com/episode/13932016480030208354 |
| work-61f2b70ee9f8217b3604 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-03-response.txt | https://shogakukan-comic.jp/book?isbn=9784091231802 |
| work-671e3453cf9e1df2ee87 | data/staging/catalog-expansion/pilots/pilot-001/reviews/text-coverage-followup-hidamari.md | https://shogakukan-comic.jp/book?isbn=9784091920515 |
| work-76c038b398f4b28b7748 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://e-comi.shogakukan.co.jp/books/091363540000d0000000 |
| work-7730845c9cf7ba0cccc8 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://www.kodansha.co.jp/titles/1000045255 |
| work-8716f80d9b988bd0d055 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://shogakukan-comic.jp/book?isbn=9784091867285 |
| work-98d513b70560f2f96a38 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt | https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/ |
| work-9d04c47e7efbbbd8aca6 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://www.hakusensha.co.jp/comicslist/46806/ |
| work-9d5d64262dbc2893acd4 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt + data/staging/catalog-expansion/pilots/pilot-001/reviews/theme-gap-pass-c-review.md | https://e-comi.shogakukan.co.jp/books/091300010000d0000000 |
| work-a089c0eef91d1213da38 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt | https://adpocket.shogakukan.co.jp/adnews/13902/ |
| work-a7a1e0666169f1b2e8c0 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-03-response.txt | https://shogakukan-comic.jp/book?isbn=9784091670250 |
| work-ad2b80b81b7bc9b602a3 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt + data/staging/catalog-expansion/pilots/pilot-001/reviews/theme-gap-pass-c-review.md | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501 |
| work-b2c37bdb52e2a78dfd41 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://www.akitashoten.co.jp/comics/4253264468 |
| work-b4b21d2ebe5b8efc84ea | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://e-comi.shogakukan.co.jp/books/091525010000d0000000 |
| work-c4abbc1b44fa5706bce3 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-02-followup-response.txt | https://e-comi.shogakukan.co.jp/books/091373510000d0000000 |
| work-cdf549d4b1888153e146 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882599-1 |
| work-d489f5a2229689aa5115 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-04-response.txt | https://www.shodensha.co.jp/onnanosononohoshi/ |
| work-d7e64b0b5479ca943edd | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-03-response.txt | https://shogakukan-comic.jp/book?isbn=9784091817075 |
| work-e049c9aaf92ba31da8b0 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-05-response.txt | https://shogakukan-comic.jp/book?isbn=9784098511433 |
| work-ebe399258f28460b8f9b | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-03-response.txt | https://www.j-mediaarts.jp/award/single/suzuki-sensei/index.html |
| work-ef7106f6a387c9860877 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-03-response.txt | https://e-comi.shogakukan.co.jp/books/091850240000d0000000 |
| work-f391e591282e435a3c1d | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-03-response.txt | https://bigcomicbros.net/work/6114/ |
| work-f50fa290eb4116a7078e | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-01-followup-response.txt | https://shogakukan-comic.jp/news/17107 |
| work-f5f0ee0b0ff16bc146e0 | data/staging/catalog-expansion/pilots/pilot-001/reviews/grok-current-chunk-03-response.txt | https://magazine.jp.square-enix.com/top/comics/detail/9784757526167/ |

## Artifact SHA-256

| Artifact | SHA-256 |
|---|---|
| /tmp/pilot-001-text-factors-final.csv | fa3cb840912c3ac88f53c025c07b57da16a02edaf681d0a8f9af95aecd541653 |
| /tmp/pilot-001-genres-final.csv | e23d3d94d7ca0d16510046c052f0b8c06e292efbb5585c8f9f2f2f5f5f5206ee |
| /tmp/pilot-001-themes-final.csv | eca46a480cafe8117247954ad66ba7ec3ef65c9d96899e17f346e95a57fa0dec |
| /tmp/pilot-001-text-evidence-final.csv | 42d6a6a68b21ad886eb27e10342dcd6e9bf9a0ac7d200acfef64ecfd93022622 |
| /tmp/pilot-001-text-decision-ledger.csv | cb4e783b33cf16be04d119d3671ff49eee2eb34d08b6973826e2fdbcde84fd24 |

The report's own SHA-256 is intentionally reported externally after the report is written.
