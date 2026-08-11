# G1 replacement selection Oracle review

- Date: 2026-08-11
- Conversation: https://chatgpt.com/c/6a7a6f34-c3f8-83e8-af26-c6d7476f0f01
- Model: ChatGPT 5.6 Pro, Pro reasoning
- Repository: `fromiron/konocomics`
- Base branch: `main`
- Scope: selected replacement and pre-final-cohort checkpoint only

## Round 1

- Patch SHA-256: `a69229b71190760eae561d96b7e5be2e01a4b432bcb28f9f178300024bdca18e`
- Request SHA-256: `f6027bbc8f21e132eec0e2278de05213028b3d15d73946da9a306b1113deeba8`
- Verdict: `REVISE`
- Blocker: the selection used freeze files whose bytes differed from the exact artifacts approved at the preceding pool checkpoint.

The Oracle required restoration of the approved freeze files without changing candidates, blind annotations, Art rows, edition crosswalks, market data, or selection inputs.

## Round 2

- Correction patch SHA-256: `04959239cecd1899f458fd761a635e0ef958b70c6bb461a332c7cfd4be74a206`
- Follow-up request SHA-256: `247d1a39ec2453b415a76e7bddf1bbeaa7482d0a6fc0a48e845c1e316a868004`
- Restored original cohort freeze SHA-256: `5f970ead7bf0fddf5c96b58d7efeab6f96cb3ea32b04e94231bb2f3331b75eb3`
- Restored replacement pool freeze SHA-256: `efbc3b19e7018d07b7e1b9e2674c82a95a481fb4cd99fb480326ea99a0255c39`
- Regenerated replacement manifest SHA-256: `800692c4905988723a2e773d4a8d1ac842538d8e8b943fe56d9953c5f9ced82c`
- Verdict: `GO`

The Oracle reconstructed both approved freeze hashes and the regenerated manifest from the uploaded correction. It confirmed that all 25 pair rows, distances, diversity results, selected pair, combined distance, and rank were unchanged outside the restored input hashes.

Approved selection for final-cohort integration:

- `beyond-the-clouds`
- `noragami-stray-god`
- combined distance: `0.8967307692307692`
- selected rank: `1` of `25`

This GO does not approve the final cohort or G1.
