# G2 Catalog annotation Cycle 7 v3 Grok validity

## Conclusion

`VALID_FROZEN_V3_GROK_ROW`.

## Artifact identity

- Original ZIP: /tmp/konocomics-g2-four-path-v3.zip
- Isolated byte-identical copy: /tmp/konocomics-grok-v3.K87xiv/konocomics-g2-four-path-v3.zip
- ZIP bytes: 122649860
- ZIP SHA-256: cee690a0b2a35b12c5cdfd655bdf84b13e7d1a22470e46a6d690cdb908d818c4
- Required HEAD recorded by the frozen bundle: cc71d38d573cd24c520cbef62c607ee7a876490f

## Fresh Grok execution identity

- Launcher pipeline: /home/bell/.local/bin/agent -p --output-format stream-json --model cursor-grok-4.6-high --sandbox disabled --trust -f --workspace /tmp/konocomics-grok-v3.K87xiv '<one literal prompt argument recorded as the transcript user event>' 2>&1 | tee /tmp/konocomics-grok-v3.K87xiv/grok-v3-transcript.stream.jsonl
- Literal prompt UTF-8 SHA-256: 67484b9804568af0fd39797c4286f3e1e8a1b22c16d824d6f79eda6d24df3bd8
- Model flag: cursor-grok-4.6-high
- System init model: Cursor Grok 4.6 High
- Non-fast proof: `agent --list-models` distinguishes `cursor-grok-4.6-high-fast - Cursor Grok 4.6 Fast` from selected `cursor-grok-4.6-high - Cursor Grok 4.6`; the selected command contains no fast flag/model.
- Fresh workspace: /tmp/konocomics-grok-v3.K87xiv
- Fresh session: ec606c4c-2573-4599-b8c8-d1a1a1d7f754
- Request ID: a7f9a8e2-4520-4909-8957-ac5f03749f72
- Result: success, is_error=false, process exit 0
- Duration: 1193513 ms

## Durable evidence

- Exact final assistant text: /tmp/konocomics-grok-v3-response.txt
- Exact final assistant UTF-8 bytes: 4494
- Exact final assistant SHA-256: 105d58ca518530ca6074e6552b5f7dcd25ffe2e7737827fb8d845ddb1caea551
- Repository response recording: `g2-catalog-annotation-cycle-7-v3-grok-response.txt`; the 4,494 canonical assistant bytes above plus exactly one terminal LF; recorded SHA-256 `8d775a830fc2e965fcc59dea34e00c3475b3e11ac03fc39e3cd04a8a43b1ce4d`.
- Stream transcript: /tmp/konocomics-grok-v3.K87xiv/grok-v3-transcript.stream.jsonl
- Stream transcript bytes: 621753
- Stream transcript SHA-256: a8358e65328aec694d4b14c8650dbb510096c895a51629a410814077a58ca701

## Exact response-contract audit

- The final assistant event begins with the single line `GO`.
- The following 17 required fields match REQUEST.md exactly, each occurs once, and their order is exact.
- Runtime/path/token set is Grok-only: `Grok panel row: GO`; `Reviewed runtime: Cursor Grok 4.6 High non-fast`; `RECORD_GROK_GO_ROW`; `NOT_GRANTED_BY_GROK_ALONE`.
- No Oracle panel/token, Local/Gemini panel label, or `REVISE` token occurs in the final response.
- The four required headings occur exactly once and in exact order: Inspection ledger summary; Candidate identity and normative checks; Blocking findings; Vote rationale.
- Blocking findings is exactly `None.`.
- There is one vote-bearing final assistant event. It is stream line 1253; no assistant event follows it. Stream line 1254 is the single successful result event. Eight assistant progress events precede the formal final event; the CLI aggregate `result` concatenates those pre-final updates, so the authoritative exact response is the final assistant event saved above, not the aggregate `result` string. There is no postscript or second final verdict.

## Transcript direct-original audit

- Static manifest expected paths: 100 unique.
- Static successful direct read-tool original paths: 100 unique; set equality with static-index.csv is true; missing 0; extra 0.
- Motion manifest expected paths: 6 unique.
- Motion successful direct read-tool original paths: 6 unique; set equality with known-motion-index.csv is true; missing 0; extra 0.
- Direct original attempts: static 103, motion 6. `baby-steps.png`, `beck.png`, and `blood-on-the-tracks.png` were each reopened once; this does not double-count the 100 unique static paths.
- Direct read failures: 0. `exceededLimit=true`: 0. Empty image results: 0.
- No derivative/crop/re-encode path was used for the 106-path count.
- Current original wave path opened directly once and succeeded once: fileSize 443533, isEmpty=false, exceededLimit=false, dataBlob returned. Independent byte audit finds terminal IEND end at byte 443533 and 0 trailing bytes.
- Required original paths: 106. Unique image byte hashes: 103. The three duplicate-hash groups each contain one static and one motion path as disclosed by REQUEST.md.

## Independence and tool-scope audit

- Tool starts: 131 total = 119 read, 9 shell, 2 grep, 1 glob; every matching completion exists.
- All read-tool absolute paths are inside /tmp/konocomics-grok-v3.K87xiv/extracted/konocomics-oracle-g2-vote.
- Read-tool paths outside the isolated workspace: 0.
- Read-tool paths named transcript, response, validity, panel report, prior model response, or an actual reviews directory: 0.
- All shell/grep/glob absolute path literals are inside the isolated workspace. No live repository, GitHub, network, browser, connector, or prior-session tool call appears.
- The first shell listed the isolated workspace (and therefore could list the current in-progress transcript filename), but no transcript content was read or searched. It was not a prior transcript.
- Current candidate fields may contain references to historical review-document paths, but no referenced review document was bundled, opened, searched, or used.

## Independent mechanical reproduction

- ZIP: 203 entries = 180 files + 23 directories; exact single root `konocomics-oracle-g2-vote/`.
- Unsafe/absolute/dot-dot/backslash paths 0; symlinks 0; duplicate members 0; case collisions 0; encrypted members 0; `ZipFile.testzip()` bad member none.
- Complete file ledger: 179/179 matched, missing 0, unique ledger paths 179.
- Four critical candidate hashes independently matched 4/4:
  - catalog-v1.json 8695c5646a388f049dc25dcd6af5b5db06437ea82d8755b6b008ea4b97b27abb
  - recommendation-context-v1.json a802af6c04d5d3c81668493ff4af7eec5fba5169dc38578e3013f4a71752c171
  - factors.csv 4a0e3dc5450ac96250d23e84302ecd5554413f007adb751670ad59c4fb58973f
  - art-evidence-manifest.csv 356e1d2eba63bca92340860f06d3f94bd8049ae6000c1d3dd91461d2fee5fc8e
- Original member counts are static 100 and motion 6; Pillow full decode succeeded for all 106.
- The exact-HEAD CI conclusion was not live-corroborated because the isolation prompt forbade live GitHub. The final response accurately says the frozen identity records bind run 31682502622 to expected `success` and that live GitHub was not used. REQUEST.md makes live corroboration optional.
- Visual/normative suitability is the Grok reviewer's judgment after successful data-blob delivery for every direct original path; the mechanized audit validates path coverage, tool success, hashes, decodability, manifests, and contract claims, but does not replace that model judgment.

## Repository side effects

- /home/bell/konocomics remained clean (`git status --short` empty) at HEAD cc71d38d573cd24c520cbef62c607ee7a876490f.
- No repository file was edited.
