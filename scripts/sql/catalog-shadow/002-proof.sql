CREATE TABLE source_import (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  baseline_commit TEXT NOT NULL,
  raw_source_tree_digest TEXT NOT NULL,
  source_manifest_digest TEXT NOT NULL,
  node_version TEXT NOT NULL,
  sqlite_version TEXT NOT NULL,
  os TEXT NOT NULL,
  architecture TEXT NOT NULL
) STRICT;

CREATE TABLE source_file (
  path TEXT PRIMARY KEY,
  file_role TEXT NOT NULL CHECK (file_role IN ('tableCsv', 'opaqueFile')),
  raw_bytes BLOB NOT NULL,
  raw_sha256 TEXT NOT NULL CHECK (length(raw_sha256) = 64),
  byte_length INTEGER NOT NULL CHECK (byte_length >= 0)
) STRICT;

CREATE TABLE source_table (
  path TEXT PRIMARY KEY REFERENCES source_file(path),
  table_name TEXT NOT NULL UNIQUE
) STRICT;

CREATE TABLE model_attempt (
  attempt_id TEXT PRIMARY KEY CHECK (
    length(attempt_id) = 64 AND attempt_id NOT GLOB '*[^0-9a-f]*'
  ),
  provider TEXT NOT NULL CHECK (length(trim(provider)) > 0),
  model TEXT NOT NULL CHECK (length(trim(model)) > 0),
  source_manifest_digest TEXT NOT NULL CHECK (
    length(source_manifest_digest) = 64 AND source_manifest_digest NOT GLOB '*[^0-9a-f]*'
  ),
  request_sha256 TEXT NOT NULL CHECK (
    length(request_sha256) = 64 AND request_sha256 NOT GLOB '*[^0-9a-f]*'
  ),
  response_sha256 TEXT NOT NULL CHECK (
    length(response_sha256) = 64 AND response_sha256 NOT GLOB '*[^0-9a-f]*'
  )
) STRICT;

CREATE TABLE claim_candidate (
  attempt_id TEXT NOT NULL REFERENCES model_attempt(attempt_id) ON DELETE CASCADE,
  claim_ordinal INTEGER NOT NULL CHECK (claim_ordinal >= 1),
  fact_key TEXT NOT NULL CHECK (length(trim(fact_key)) > 0),
  candidate_value TEXT NOT NULL CHECK (length(trim(candidate_value)) > 0),
  confidence TEXT CHECK (confidence IS NULL OR length(trim(confidence)) > 0),
  citations_json TEXT NOT NULL CHECK (
    json_valid(citations_json)
    AND json_type(citations_json) = 'array'
    AND json_array_length(citations_json) > 0
    AND json(citations_json) = citations_json
  ),
  PRIMARY KEY (attempt_id, claim_ordinal)
) STRICT;

CREATE TABLE fact_resolution (
  fact_key TEXT PRIMARY KEY CHECK (length(trim(fact_key)) > 0),
  state TEXT NOT NULL CHECK (
    state IN ('accepted', 'explicitUnknown', 'notApplicable', 'rejected', 'manualReview')
  ),
  value_type TEXT NOT NULL CHECK (value_type IN ('integer', 'boolean', 'none')),
  lexical_value TEXT NOT NULL,
  authority_kind TEXT NOT NULL CHECK (authority_kind = 'legacySnapshot'),
  authority_artifact_digest TEXT NOT NULL CHECK (
    authority_artifact_digest = 'adf3f21c1be5ce6cb5691bd97cb4a03dc1bfd828c76697445621c9bf12171542'
    AND length(authority_artifact_digest) = 64
    AND authority_artifact_digest NOT GLOB '*[^0-9a-f]*'
  ),
  citation_set_digest TEXT NOT NULL CHECK (
    citation_set_digest = '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945'
    AND length(citation_set_digest) = 64
    AND citation_set_digest NOT GLOB '*[^0-9a-f]*'
  ),
  reason_code TEXT NOT NULL CHECK (reason_code = 'LEGACY_SNAPSHOT_CUTOFF'),
  CHECK (
    (
      fact_key GLOB 'work:*:factor:*'
      AND (
        (state = 'accepted' AND value_type = 'integer' AND lexical_value IN ('0', '1', '2', '3', '4'))
        OR (state <> 'accepted' AND value_type = 'none' AND lexical_value = '')
      )
    )
    OR (
      fact_key GLOB 'work:*:theme:*'
      AND (
        (state = 'accepted' AND value_type = 'integer' AND lexical_value IN ('1', '2'))
        OR (state <> 'accepted' AND state <> 'notApplicable' AND value_type = 'none' AND lexical_value = '')
      )
    )
    OR (
      fact_key GLOB 'work:*:genre:*'
      AND (
        (state = 'accepted' AND value_type = 'boolean' AND lexical_value = 'true')
        OR (state <> 'accepted' AND state <> 'notApplicable' AND value_type = 'none' AND lexical_value = '')
      )
    )
  ),
  CHECK (state <> 'notApplicable' OR fact_key GLOB 'work:*:factor:motionImpact')
) STRICT;

CREATE TABLE judgment_run (
  target_type TEXT NOT NULL CHECK (target_type = 'promotion'),
  target_id TEXT NOT NULL,
  judgment_input_digest TEXT NOT NULL UNIQUE CHECK (
    length(judgment_input_digest) = 64
    AND judgment_input_digest NOT GLOB '*[^0-9a-f]*'
  ),
  current_status TEXT NOT NULL CHECK (
    current_status IN ('libraryOnly', 'annotationDraft', 'recommendationVerified', 'gold')
  ),
  verdict TEXT NOT NULL CHECK (
    verdict IN ('pending', 'recommendationVerified', 'promotionBlocked', 'gold')
  ),
  reason_codes_json TEXT NOT NULL CHECK (
    json_valid(reason_codes_json) AND json_type(reason_codes_json) = 'array'
  ),
  blocker_codes_json TEXT NOT NULL CHECK (
    json_valid(blocker_codes_json) AND json_type(blocker_codes_json) = 'array'
  ),
  decision_digest TEXT NOT NULL UNIQUE CHECK (
    length(decision_digest) = 64
    AND decision_digest NOT GLOB '*[^0-9a-f]*'
  ),
  PRIMARY KEY (target_type, target_id)
) STRICT;
