#!/usr/bin/env python3
"""Copy-on-write registry correction using the existing six-file publisher contract.

--changes is a JSON file with exactly: schemaVersion
('factor-registry-correction-request-v1'), sourceRegistrySha256,
catalogSha256, panelInputManifestSha256, and a nonempty changes list.
Each change has sourceRowId, expectedBefore, updates, evidenceUrl, observation.
The before/update maps name the same allowed fields. Identity/support URL fields
may only normalize separators and duplicate URLs, preserving first-seen membership.
Bibliography URLs may only add the named evidenceUrl; representative volume and
edition must match the unchanged catalog. Identity IDs and ISBN are immutable.

No publishing, canonical/STATE writes, implicit fetch, or overwrite is performed.
The request is embedded in correction-ledger.json; the generic executable is
copied byte-for-byte under the two names required by the existing contract.
Before freeze, --job replaces --input-root. Its v2 request replaces
panelInputManifestSha256 with jobSha256; no panel manifest is synthesized.
The job-only v3 request adds per-row rejectedIdentityUrls and
remainingIdentityEvidence attestations. Only explicitly disproven URLs may be
removed; no identity URL additions, last-source deletion, or reordering is allowed.
Job-only v4 consumes the v2 job's explicit registryVolumeProofs. ISBN and row/Work
IDs remain immutable; bibliography updates follow the row's proved own volume,
not necessarily the Catalog representative. Existing bibliography URLs survive.

Oricon discovery --changes uses factor-registry-oricon-discovery-request-v1 with
current sourceRegistrySha256/catalogSha256, sourceCorrection (root,
manifestSha256, original sourceRegistry and catalog paths), and existingRawJoins
(rawTitle, rawCreator, sourceRowId). Only exact bound raw-key joins are accepted;
other records append as unresolved source rows. The verified correction supplies
the complete raw events. No Factor job, legacy import, or canonical identity is
inferred, and repeat event receipts are preserved without duplicate insertion.

Identity wrong-mapping --changes uses
factor-registry-identity-mapping-correction-request-v1 without a Factor job or
panel. It restores only the unresolved status already preserved by the row's
exact research attempt after binding raw identity, actual source membership,
expectedBefore, registry, and catalog. No new identity is adjudicated.
"""
from __future__ import annotations

import argparse
import copy
import csv
import hashlib
import importlib
import importlib.util
import json
import re
import shutil
import sqlite3
import sys
from collections import Counter
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

# The publisher contract also preserves this executable inside correction artifacts.
repository = next(parent for parent in Path(__file__).resolve().parents if (parent / 'scripts/catalog_workspace.py').is_file())
sys.path.insert(0, str(repository / 'scripts/catalog_authoring'))
from authoring_paths import artifact_path

sys.dont_write_bytecode = True
ALLOWED = {'volumeNumber', 'editionKind', 'bibliographyEvidenceUrls', 'identityEvidenceUrls', 'supportEvidenceUrls', 'canonicalCreatorsJa'}
MEMBERS = {'build_registry_correction.py', 'preflight_registry_correction.py', 'catalog-source-registry.candidate.sqlite', 'source-registry.csv', 'correction-ledger.json', 'preflight-report.json'}
REQUEST_KEYS = {'schemaVersion', 'sourceRegistrySha256', 'catalogSha256', 'panelInputManifestSha256', 'changes'}
CHANGE_KEYS = {'sourceRowId', 'expectedBefore', 'updates', 'evidenceUrl', 'observation'}
LEGACY_REQUEST = 'factor-registry-legacy-import-request-v1'
LEGACY_LEDGER = 'factor-registry-legacy-import-v1'
LEGACY_COHORT_RULE_SHA256 = '37c50a264e04ae05e7dcd8b61a15b8edeeaa755bdc9490ad2cbbcc14bd160733'
ORICON_REQUEST = 'factor-registry-oricon-correction-request-v1'
ORICON_LEDGER = 'factor-registry-oricon-correction-v1'
DISCOVERY_REQUEST = 'factor-registry-oricon-discovery-request-v1'
DISCOVERY_LEDGER = 'factor-registry-oricon-discovery-v1'
IDENTITY_MAPPING_REQUEST = 'factor-registry-identity-mapping-correction-request-v1'
IDENTITY_MAPPING_LEDGER = 'factor-registry-identity-mapping-correction-v1'
IDENTITY_MAPPING_PREFLIGHT = 'factor-registry-identity-mapping-correction-preflight-v1'
IDENTITY_MAPPING_FIELDS = {
    'canonicalWorkId', 'canonicalTitleJa', 'canonicalCreatorsJa',
    'existingCatalogWorkId', 'identityEvidenceUrls', 'representativeIsbn',
    'terminalStatus', 'blocker',
}
IDENTITY_ATTEMPT_PROOF_FIELDS = {
    'attemptId', 'sourceRowId', 'rawTitle', 'rawCreator',
    'originalTerminalStatus', 'sourceItemIds', 'attemptedUrls', 'matchOutcome',
    'matchBasis', 'resolvedWorkId', 'mismatchReason', 'finalTerminalStatus',
}
DISCOVERY_MARKER = 'oriconSourceDiscoveryV1='
ORICON_SOURCE = 'oricon-reader-survey-2026'
ORICON_INPUTS = {'cohortRule', 'normalizer', 'oriconHtml', 'sourceRegistry', 'sourceMembership', 'rawSourceItems', 'identityQueue'}
LEGACY_FIELDS = {
    'canonical-mapping.csv': 'mappingId,sourceItemId,candidateId,workId,mappingType,canonicalTitleJa,confidence,evidenceName,evidenceUrl,evidencePublishedAt,retrievedAt,notes'.split(','),
    'source-membership.csv': 'sourceItemId,sourceId,status,candidateId,workId,decisionRef'.split(','),
    'source-registry.csv': 'sourceId,sourceKind,organization,title,url,publishedAt,retrievedAt,listNature,registryStatus,snapshotUrl,snapshotSha256,originalItemCount,japaneseMangaItemCount,excludedWebtoonCount,excludedAdultCount,excludedNonJapaneseCount,excludedNonMangaCount,duplicateCount,canonicalMappingCount,unresolvedCount,notes'.split(','),
    'raw-source-items.csv': 'sourceItemId,sourceId,sourceRowNumber,rawPublicationClass,rawTitle,rawCreator,rawMainGenre,rawSubgenre,rawRating,rawNotes,rawUpdatedAt'.split(','),
}
LEGACY_SOURCE_FIELDS = 'sourceOrdinal,sourceRowId,rawTitle,rawCreator,queueStatus,bestScore,sourceIds,sourceFamilies,cohortKeys,supportEvidenceUrls,canonicalWorkId,canonicalTitleJa,canonicalCreatorsJa,existingCatalogWorkId,identityEvidenceUrls,representativeIsbn,volumeNumber,editionKind,bibliographyEvidenceUrls,aliasOfWorkId,duplicateOfWorkId,pilot,passStatus,narrativeKnown,toneKnown,factorCoverage,terminalStatus,blocker,candidateOnly,reviewedByHuman,notes,identityResearchStatus,identityResearchAttemptId,identityResearchOutcome,identityResearchSourceFamilies,identityResearchUrls,identityResearchQuery,identityResearchMismatchReason,reviewMethod,externalReviewRequired'.split(',')
LEGACY_ATTEMPT_FIELDS = 'sourceOrdinal,attemptId,sourceRowId,rawTitle,rawCreator,originalTerminalStatus,searchQuery,attemptedSourceFamilies,attemptedUrls,offlineSnapshotRefs,sourceItemIds,rakutenOutcome,ndlOutcome,matchOutcome,matchBasis,resolvedWorkId,mismatchReason,checkedAt,candidateOnly,reviewedByHuman,grokUsed,paidSourceUsed,finalTerminalStatus'.split(',')


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def json_sha(value: object) -> str:
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def read_only(path: Path):
    require(path.is_file() and not path.is_symlink(), f'Not a regular SQLite input: {path}')
    require(not any(Path(str(path) + suffix).exists() for suffix in ('-wal', '-shm', '-journal')), f'SQLite sidecar exists: {path}')
    return sqlite3.connect(path.resolve().as_uri() + '?mode=ro', uri=True)


def snapshot(path: Path) -> dict:
    """Compare all registry data and schema, including unrelated rows and metadata."""
    with closing(read_only(path)) as db:
        require(db.execute('pragma integrity_check').fetchone()[0] == 'ok' and not db.execute('pragma foreign_key_check').fetchall(), 'Registry integrity failure')
        schema = db.execute('select type,name,tbl_name,sql from sqlite_schema order by type,name').fetchall()
        names = [row[1] for row in schema if row[0] == 'table']
        require(set(names) == {'registry_meta', 'registry_research_attempts', 'registry_source_rows'}, 'Unexpected registry table set')
        tables = {}
        for name in names:
            columns = [r[1] for r in db.execute(f'pragma table_info("{name}")')]
            tables[name] = {'columns': columns, 'rows': [dict(zip(columns, r)) for r in db.execute(f'select * from "{name}" order by "{columns[0]}"')]}
        return {'schema': schema, 'userVersion': db.execute('pragma user_version').fetchone()[0], 'applicationId': db.execute('pragma application_id').fetchone()[0], 'tables': tables}


def valid_url(value: object) -> bool:
    if not isinstance(value, str) or value != value.strip() or any(c.isspace() for c in value):
        return False
    try:
        parsed = urlsplit(value)
        return parsed.scheme == 'https' and bool(parsed.hostname) and not parsed.username and not parsed.password
    except ValueError:
        return False


def url_members(value: str) -> list[str]:
    return [part.strip() for part in re.split(r'[;|]', value) if part.strip()]


def text_members(value: str) -> list[str]:
    return [part.strip() for part in re.split(r'[;|]', value) if part.strip()]


def validate_identity_mapping_request(value: object) -> dict:
    require(isinstance(value, dict) and set(value) == {'schemaVersion', 'sourceRegistrySha256', 'catalogSha256', 'changes'} and value.get('schemaVersion') == IDENTITY_MAPPING_REQUEST, 'Invalid identity mapping correction request')
    for key in ('sourceRegistrySha256', 'catalogSha256'):
        require(isinstance(value[key], str) and re.fullmatch('[0-9a-f]{64}', value[key]) is not None, f'Invalid hash: {key}')
    require(isinstance(value['changes'], list) and bool(value['changes']), 'Empty identity mapping corrections')
    ids = set()
    for change in value['changes']:
        require(isinstance(change, dict) and set(change) == {'sourceRowId', 'rawIdentity', 'actualSourceProof', 'expectedAttempt', 'expectedBefore', 'updates', 'observation'}, 'Unexpected identity mapping change fields')
        rid = change['sourceRowId']
        require(isinstance(rid, str) and bool(rid) and rid not in ids, 'Duplicate or empty sourceRowId')
        ids.add(rid)
        raw = change['rawIdentity']
        require(isinstance(raw, dict) and set(raw) == {'rawTitle', 'rawCreator'} and all(isinstance(v, str) for v in raw.values()) and bool(raw['rawTitle']), 'Invalid raw identity proof')
        source = change['actualSourceProof']
        require(isinstance(source, dict) and set(source) == {'sourceId', 'sourceItemId', 'supportEvidenceUrl', 'attemptedUrl'}, 'Invalid actual source proof')
        require(all(isinstance(v, str) and bool(v.strip()) for v in source.values()) and valid_url(source['supportEvidenceUrl']) and valid_url(source['attemptedUrl']), 'Incomplete actual source proof')
        attempt = change['expectedAttempt']
        require(isinstance(attempt, dict) and set(attempt) == IDENTITY_ATTEMPT_PROOF_FIELDS and all(isinstance(v, str) for v in attempt.values()), 'Invalid expected research attempt')
        require(attempt['sourceRowId'] == rid and attempt['attemptId'] and attempt['rawTitle'] and attempt['mismatchReason'].strip(), 'Incomplete expected research attempt')
        before, updates = change['expectedBefore'], change['updates']
        require(isinstance(before, dict) and isinstance(updates, dict) and set(before) == set(updates) == IDENTITY_MAPPING_FIELDS, 'Identity mapping reset must bind every mutable mapping field')
        require(all(isinstance(v, str) for v in [*before.values(), *updates.values()]), 'Identity mapping values must be strings')
        require(any(before[k] != updates[k] for k in updates), 'Identity mapping reset is a no-op')
        require(isinstance(change['observation'], str) and bool(change['observation'].strip()), 'Missing wrong-mapping observation')
    return value


def identity_mapping_plan(before: dict, request: dict) -> tuple[dict, list[dict]]:
    """Restore only a demonstrably preserved unresolved identity decision."""
    expected = copy.deepcopy(before)
    rows = {row['sourceRowId']: row for row in expected['tables']['registry_source_rows']['rows']}
    attempts = expected['tables']['registry_research_attempts']['rows']
    require(len(rows) == len(expected['tables']['registry_source_rows']['rows']), 'Nonunique registry sourceRowId')
    changes = []
    for item in request['changes']:
        rid = item['sourceRowId']
        require(rid in rows, f'Unknown sourceRowId: {rid}')
        row = rows[rid]
        raw = item['rawIdentity']
        require(row['rawTitle'] == raw['rawTitle'] and row['rawCreator'] == raw['rawCreator'], f'Raw identity mismatch: {rid}')
        require(row['candidateOnly'] == 'true' and row['reviewedByHuman'] == 'false', f'Identity mapping correction cannot overwrite reviewed authority: {rid}')
        require(row['terminalStatus'] == 'MAPPED_EXISTING_CATALOG' and row['canonicalWorkId'] and row['existingCatalogWorkId'] == row['canonicalWorkId'], f'Row is not an exact existing-catalog mapping: {rid}')
        require(row['canonicalTitleJa'] != row['rawTitle'] or row['canonicalCreatorsJa'] != row['rawCreator'], f'No raw/canonical identity mismatch: {rid}')
        attempt_id = row['identityResearchAttemptId']
        matched = [attempt for attempt in attempts if attempt['attemptId'] == attempt_id and attempt['sourceRowId'] == rid]
        require(attempt_id and len(matched) == 1, f'Missing unique preserved research attempt: {rid}')
        attempt = matched[0]
        require(all(attempt[field] == value for field, value in item['expectedAttempt'].items()), f'Preserved research attempt mismatch: {rid}')
        require(attempt['rawTitle'] == row['rawTitle'] and attempt['rawCreator'] == row['rawCreator'], f'Research attempt raw identity mismatch: {rid}')
        require(attempt['originalTerminalStatus'] == attempt['finalTerminalStatus'] == 'UNRESOLVED_IDENTITY' and attempt['matchOutcome'] == 'NO_EXACT_IDENTITY_AFTER_FINITE_CHECK' and not attempt['matchBasis'] and not attempt['resolvedWorkId'], f'Research attempt did not preserve unresolved identity: {rid}')
        proof = item['actualSourceProof']
        require(proof['sourceId'] in text_members(row['sourceIds']), f'Actual source id absent from row: {rid}')
        require(proof['sourceItemId'] in text_members(attempt['sourceItemIds']), f'Actual source item absent from attempt: {rid}')
        require(proof['supportEvidenceUrl'] in url_members(row['supportEvidenceUrls']), f'Actual source URL absent from row: {rid}')
        require(proof['attemptedUrl'] in url_members(attempt['attemptedUrls']), f'Attempted source URL absent from research attempt: {rid}')
        require(proof['supportEvidenceUrl'] == proof['attemptedUrl'], f'Row and attempt do not bind the same actual source: {rid}')
        require(all(row[field] == value for field, value in item['expectedBefore'].items()), f'expectedBefore mismatch: {rid}')
        derived = {
            'canonicalWorkId': '',
            'canonicalTitleJa': row['rawTitle'],
            'canonicalCreatorsJa': row['rawCreator'],
            'existingCatalogWorkId': '',
            'identityEvidenceUrls': '',
            'representativeIsbn': '',
            'terminalStatus': attempt['finalTerminalStatus'],
            'blocker': 'IDENTITY_EVIDENCE_REQUIRED',
        }
        require(item['updates'] == derived, f'Request does not restore the preserved unresolved identity exactly: {rid}')
        for field in sorted(IDENTITY_MAPPING_FIELDS):
            if row[field] != derived[field]:
                changes.append({'sourceRowId': rid, 'workId': row['canonicalWorkId'], 'field': field, 'before': row[field], 'after': derived[field]})
            row[field] = derived[field]
    return expected, changes


def validate_request(value: object) -> dict:
    require(isinstance(value, dict), 'Unexpected request fields')
    schema = value.get('schemaVersion')
    require(schema in {'factor-registry-correction-request-v1', 'factor-registry-correction-request-v2', 'factor-registry-correction-request-v3', 'factor-registry-correction-request-v4'}, 'Unsupported request schema')
    removal_mode = schema.endswith('-v3')
    binding_key = 'panelInputManifestSha256' if schema.endswith('-v1') else 'jobSha256'
    keys = (REQUEST_KEYS - {'panelInputManifestSha256'}) | {binding_key}
    require(set(value) == keys, 'Unexpected request fields')
    for key in ('sourceRegistrySha256', 'catalogSha256', binding_key):
        require(isinstance(value[key], str) and re.fullmatch('[0-9a-f]{64}', value[key]) is not None, f'Invalid hash: {key}')
    require(isinstance(value['changes'], list) and bool(value['changes']), 'Empty changes')
    ids = set()
    for change in value['changes']:
        change_keys = CHANGE_KEYS | ({'rejectedIdentityUrls', 'remainingIdentityEvidence'} if removal_mode else set())
        require(isinstance(change, dict) and set(change) == change_keys, 'Unexpected change fields')
        rid, before, updates = change['sourceRowId'], change['expectedBefore'], change['updates']
        require(isinstance(rid, str) and bool(rid) and rid not in ids, 'Duplicate or empty sourceRowId')
        ids.add(rid)
        require(isinstance(before, dict) and isinstance(updates, dict) and bool(updates) and set(before) == set(updates) and set(updates) <= ALLOWED, 'Unsupported fields or incomplete expectedBefore')
        require(all(isinstance(v, str) for v in [*before.values(), *updates.values()]), 'Correction values must be strings')
        require(all(before[k] != v for k, v in updates.items()), 'No-op change')
        require(valid_url(change['evidenceUrl']), 'Invalid evidence URL')
        require(isinstance(change['observation'], str) and bool(change['observation'].strip()), 'Missing evidence observation')
        if removal_mode:
            require('identityEvidenceUrls' in updates, 'Removal requires identity expectedBefore and update')
            rejected = change['rejectedIdentityUrls']
            require(isinstance(rejected, list) and bool(rejected), 'Missing rejected identity evidence')
            urls = []
            for proof in rejected:
                require(isinstance(proof, dict) and set(proof) == {'url', 'observedTitle', 'observedIsbn', 'observation'}, 'Invalid rejected identity evidence')
                require(valid_url(proof['url']), 'Invalid rejected identity URL')
                require(all(isinstance(proof[k], str) and proof[k].strip() for k in ('observedTitle', 'observedIsbn', 'observation')), 'Missing mismatch observation')
                require(re.fullmatch(r'\d{13}', proof['observedIsbn']) is not None, 'Invalid observed ISBN')
                urls.append(proof['url'])
            require(len(set(urls)) == len(urls), 'Duplicate rejected identity URL')
            proof = change['remainingIdentityEvidence']
            require(isinstance(proof, dict) and set(proof) == {'url', 'workId', 'title', 'creators', 'observation'}, 'Invalid remaining identity evidence')
            require(valid_url(proof['url']) and all(isinstance(proof[k], str) and proof[k].strip() for k in ('workId', 'title', 'creators', 'observation')), 'Missing remaining identity evidence')
    return value


def creator_names(value: str) -> list[str]:
    """Only the explicitly authorized known trailing roles are insignificant."""
    tokens = [re.sub(r'\s+', '', token) for token in value.split(';')]
    require(all(tokens), 'Empty creator token')
    names = [re.sub(r'（(?:漫画|脚本|漫画企画構成|原作)）$', '', token) for token in tokens]
    require(all(name and not any(c in name for c in '（）()') for name in names), 'Unknown creator role')
    return names


def plan(before: dict, request: dict, representatives: dict, target_ids: set[str], volume_proofs: dict | None = None) -> tuple[dict, list[dict]]:
    expected = copy.deepcopy(before)
    indexed = {r['sourceRowId']: r for r in expected['tables']['registry_source_rows']['rows']}
    require(len(indexed) == len(expected['tables']['registry_source_rows']['rows']), 'Nonunique registry sourceRowId')
    proof_mode = request['schemaVersion'].endswith('-v4')
    require(not proof_mode or bool(volume_proofs), 'v4 requires explicit job registry volume proofs')
    require(proof_mode or not volume_proofs, 'Volume proofs require v4 correction request')
    changes = []
    for item in request['changes']:
        rid = item['sourceRowId']
        require(rid in indexed and indexed[rid]['canonicalWorkId'] in target_ids, f'Row outside input targets: {rid}')
        row = indexed[rid]
        volume = representatives[row['canonicalWorkId']]
        if proof_mode:
            proof = (volume_proofs or {}).get(rid)
            require(proof is not None, f'Missing changed-row volume proof: {rid}')
            require(proof['workId'] == row['canonicalWorkId'] and proof['title'] == row['canonicalTitleJa'] and proof['creators'] == row['canonicalCreatorsJa'], f'Volume proof ownership mismatch: {rid}')
            volume = {**proof, 'catalogCreators': volume.get('catalogCreators')}
        require(row['representativeIsbn'] == volume['isbn'], f'Existing representative ISBN mismatch: {rid}')
        for field in sorted(item['updates']):
            value = item['updates'][field]
            require(row[field] == item['expectedBefore'][field], f'expectedBefore mismatch: {rid}.{field}')
            if field in {'volumeNumber', 'editionKind'}:
                require(value == volume[field], f'Catalog representative mismatch: {rid}.{field}')
            elif field == 'canonicalCreatorsJa':
                require(value == volume.get('catalogCreators'), f'Catalog creator mismatch: {rid}')
                require(creator_names(row[field]) == creator_names(value), f'Creator names/order changed: {rid}')
            else:
                previous, proposed = url_members(row[field]), url_members(value)
                require(proposed and all(valid_url(url) for url in proposed), f'Invalid URL field: {rid}.{field}')
                require(len(set(proposed)) == len(proposed), f'Duplicate URL: {rid}.{field}')
                require(value == ' | '.join(proposed), f'URL field must use canonical pipe separators: {rid}.{field}')
                if field == 'bibliographyEvidenceUrls':
                    require([url for url in proposed if url in previous] == previous and set(proposed) - set(previous) <= {item['evidenceUrl']}, f'Unproved bibliography URL change: {rid}')
                elif field == 'identityEvidenceUrls' and request['schemaVersion'].endswith('-v3'):
                    rejected = {proof['url'] for proof in item['rejectedIdentityUrls']}
                    require(rejected <= set(previous), f'Rejected URL not in original row: {rid}')
                    require(proposed == [url for url in dict.fromkeys(previous) if url not in rejected], f'Unauthorized identity membership/order change: {rid}')
                    for proof in item['rejectedIdentityUrls']:
                        require(proof['observedIsbn'] != row['representativeIsbn'] and proof['observedTitle'] != row['canonicalTitleJa'], f'No identity mismatch: {rid}')
                    proof = item['remainingIdentityEvidence']
                    require(proof['url'] in proposed and proof['workId'] == row['canonicalWorkId'] and proof['title'] == row['canonicalTitleJa'] and proof['creators'] == row['canonicalCreatorsJa'], f'Remaining evidence ownership mismatch: {rid}')
                else:
                    require(list(dict.fromkeys(previous)) == proposed, f'URL membership/order changed: {rid}.{field}')
            changes.append({'sourceRowId': rid, 'workId': row['canonicalWorkId'], 'field': field, 'before': row[field], 'after': value})
            row[field] = value
    for rid, proof in (volume_proofs or {}).items():
        require(rid in indexed and indexed[rid]['canonicalWorkId'] in target_ids, f'Volume proof row outside input targets: {rid}')
        row = indexed[rid]
        fields = {'workId': 'canonicalWorkId', 'title': 'canonicalTitleJa', 'creators': 'canonicalCreatorsJa', 'isbn': 'representativeIsbn', 'volumeNumber': 'volumeNumber', 'editionKind': 'editionKind'}
        require(all(proof[key] == row[field] for key, field in fields.items()), f'Corrected row volume proof mismatch: {rid}')
        require(proof['evidenceUrl'] in url_members(row['bibliographyEvidenceUrls']), f'Volume proof URL absent from corrected bibliography: {rid}')
    return expected, changes


def packet_volume_proofs(packets: dict, request: dict, backend) -> dict | None:
    if not request['schemaVersion'].endswith('-v4'):
        return None
    proofs = {}
    for wid, packet in packets.items():
        for rid, proof in backend.validate_registry_volume_proofs(packet.get('registryVolumeProofs', []), wid).items():
            require(rid not in proofs, f'Duplicate job registry volume proof: {rid}')
            proofs[rid] = proof
    require(bool(proofs), 'v4 requires explicit job registry volume proofs')
    return proofs


def preservation(before: dict, after: dict, expected: dict, changes: list[dict]) -> dict:
    require(after == expected, 'Registry changed outside the exact authorized correction')
    removals = [{'sourceRowId': r['sourceRowId'], 'url': url} for r in changes if r['field'] == 'identityEvidenceUrls' for url in dict.fromkeys(url_members(r['before'])) if url not in url_members(r['after'])]
    return {'schemaUnchanged': before['schema'] == after['schema'], 'tableSetUnchanged': True, 'allRowsAndColumnsCompared': True, 'onlyAuthorizedFieldsChanged': True, 'identityAndSupportUrlMembershipAndOrderPreserved': not removals, **({'explicitlyRejectedIdentityUrlsRemoved': removals, 'survivingIdentityUrlOrderPreserved': True} if removals else {}), 'changedRowCount': len({r['sourceRowId'] for r in changes}), 'changedFieldCount': len(changes), 'tables': [{'table': name, 'beforeRowCount': len(table['rows']), 'afterRowCount': len(after['tables'][name]['rows']), 'beforeSha256': json_sha(table), 'afterSha256': json_sha(after['tables'][name]), 'unchanged': table == after['tables'][name]} for name, table in before['tables'].items()]}


def verify_packet_delta(original: dict, corrected: dict, expected_registry: dict, request: dict) -> dict:
    """Only v3's validated source-identity projection may differ before freeze."""
    expected = copy.deepcopy(original)
    if request['schemaVersion'].endswith('-v3'):
        for wid, packet in expected.items():
            urls = {url for row in expected_registry['tables']['registry_source_rows']['rows'] if row['canonicalWorkId'] == wid for url in url_members(row['identityEvidenceUrls'])}
            packet['sourceIdentity'] = ' | '.join(sorted(urls, key=lambda value: value.encode('utf-16-be')))
    require(corrected == expected, 'Correction changed operator packet identity or provenance')
    return corrected


def load_publisher(input_root: Path):
    return importlib.import_module('publish_factor_batch')


def write_json(path: Path, value: dict) -> None:
    with path.open('x', encoding='utf-8', newline='\n') as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + '\n')


def job_binding(job_path: Path, catalog: Path, registry_path: Path, expected_job_sha: str):
    """Use the real prepare entry point's packet builder, without recursive preflight."""
    require(job_path.is_file() and not job_path.is_symlink() and sha256(job_path) == expected_job_sha, 'Operator job hash mismatch')
    publisher = load_publisher(job_path.parent)
    prepare = importlib.import_module('prepare_factor_batch')
    job = prepare.read_job(job_path)
    publisher._verify_result_manifest(catalog.parent)
    require(catalog.name == 'catalog-expanded.candidate.sqlite', 'Job mode needs the actual publication catalog')
    backend = publisher._backend_module()
    targets = {row['workId'] for row in job['works']}
    gold = prepare.panel.read_json(prepare.REPO / 'data/staging/catalog-expansion/gold-set-manifest.json')['workIds']
    require(not targets.intersection(gold), 'Protected Gold work')
    facts = backend._baseline_facts(catalog)
    registry = backend.ensure_registry(registry_path, targets, sha256(catalog))
    registry = {**registry, 'frozenRowsByWork': registry['rowsByWork']}
    packets = prepare.build_packets(job, facts, registry)
    require(set(packets) == targets, 'Operator job packet membership mismatch')
    return publisher, backend, job, packets, facts, registry


def validate_legacy_request(value: object) -> dict:
    keys = {'schemaVersion', 'sourceRegistrySha256', 'catalogSha256', 'inputSha256', 'workIds', 'sourceItemIds', 'checkedAt', 'cohortRule'}
    require(isinstance(value, dict) and set(value) == keys and value['schemaVersion'] == LEGACY_REQUEST, 'Invalid legacy import request')
    hashes = value['inputSha256']
    require(isinstance(hashes, dict) and set(hashes) == set(LEGACY_FIELDS), 'Legacy import requires exactly four original CSV hashes')
    require(all(isinstance(d, str) and re.fullmatch('[0-9a-f]{64}', d) for d in [value['sourceRegistrySha256'], value['catalogSha256'], *hashes.values()]), 'Invalid legacy input hash')
    for key, pattern in (('workIds', r'work-[0-9a-f]{20}'), ('sourceItemIds', r'[A-Za-z0-9][A-Za-z0-9_-]*')):
        items = value[key]
        require(isinstance(items, list) and bool(items) and all(isinstance(item, str) and re.fullmatch(pattern, item) for item in items), f'Invalid legacy {key}')
        require(items == sorted(set(items)), f'Legacy {key} must be unique and sorted')
    stamp = value['checkedAt']
    require(isinstance(stamp, str) and re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ', stamp), 'Invalid legacy local-check timestamp')
    datetime.fromisoformat(stamp.replace('Z', '+00:00'))
    rule = value['cohortRule']
    require(isinstance(rule, dict) and set(rule) == {'path', 'sha256'} and isinstance(rule['path'], str) and bool(rule['path']) and rule['sha256'] == LEGACY_COHORT_RULE_SHA256, 'Unsupported legacy cohort rule identity')
    return value


def legacy_inputs(root: Path, request: dict) -> dict:
    require(root.is_dir() and not root.is_symlink(), 'Legacy source root is not a regular directory')
    rule = artifact_path(request['cohortRule']['path'])
    require(rule.is_file() and not rule.is_symlink() and sha256(rule) == request['cohortRule']['sha256'], 'Legacy cohort rule hash mismatch')
    tables = {}
    for name, fields in LEGACY_FIELDS.items():
        path = root / name
        require(path.is_file() and not path.is_symlink() and sha256(path) == request['inputSha256'][name], f'Legacy immutable input hash mismatch: {name}')
        with path.open(encoding='utf-8-sig', newline='') as stream:
            reader = csv.DictReader(stream)
            require(reader.fieldnames == fields, f'Legacy CSV schema mismatch: {name}')
            rows = list(reader)
        require(all(set(row) == set(fields) and all(isinstance(v, str) for v in row.values()) for row in rows), f'Malformed legacy CSV: {name}')
        key = fields[0]
        require(all(row[key] for row in rows) and len({r[key] for r in rows}) == len(rows), f'Nonunique legacy {key}: {name}')
        tables[name] = rows
    return tables


def legacy_cohort(raw: dict, source: dict) -> tuple[str, str]:
    """Only the five original source_score cohort projections; scores are not read."""
    sid, organization = source['sourceId'], source['organization']
    if sid.startswith(('konomanga-', 'tsugimanga-')):
        require(bool(raw['rawPublicationClass']) and raw['rawPublicationClass'] != 'unknown', 'Unclassified legacy publication cohort')
        return ('professional-panel', 'konomanga:' + raw['rawPublicationClass']) if sid.startswith('konomanga-') else ('reader-vote', 'tsugimanga:' + raw['rawPublicationClass'])
    if '小学館漫画賞' in organization:
        return 'professional-panel', 'professional-manga-jury'
    if '全国書店員' in organization or 'マンガ大賞実行委員会' in organization:
        return 'professional-panel', 'bookseller-panel'
    raise ValueError(f'Unclassified legacy source cohort: {sid}')


def legacy_plan(before: dict, request: dict, tables: dict, facts: dict, gold_ids: set[str]) -> tuple[dict, dict]:
    """Project explicit stored joins only; never infer fresh identity or Factor authority."""
    targets, item_ids = set(request['workIds']), set(request['sourceItemIds'])
    require(not targets.intersection(gold_ids), 'Protected Gold work in legacy import')
    source_table = before['tables']['registry_source_rows']
    attempt_table = before['tables']['registry_research_attempts']
    require(source_table['columns'] == LEGACY_SOURCE_FIELDS and attempt_table['columns'] == LEGACY_ATTEMPT_FIELDS, 'Unsupported legacy destination schema')
    require(before['tables']['registry_meta']['columns'] == ['key', 'value'], 'Unsupported legacy metadata schema')
    require(not targets.intersection(r['canonicalWorkId'] for r in source_table['rows']), 'Legacy target already mapped; partial or repeated imports are not allowed')
    mappings = [r for r in tables['canonical-mapping.csv'] if r['workId'] in targets or r['sourceItemId'] in item_ids]
    require(len(mappings) == len(item_ids) and {r['sourceItemId'] for r in mappings} == item_ids, 'Legacy mapping membership is incomplete or duplicated')
    require({r['workId'] for r in mappings} == targets, 'Legacy target lacks canonical mapping')
    members = {r['sourceItemId']: r for r in tables['source-membership.csv']}
    raw_rows = {r['sourceItemId']: r for r in tables['raw-source-items.csv']}
    sources = {r['sourceId']: r for r in tables['source-registry.csv']}
    require({r['sourceItemId'] for r in members.values() if r['workId'] in targets} == item_ids, 'Legacy membership has missing or extra same-work rows')
    require(all(sum(r['mappingType'] == 'included' for r in mappings if r['workId'] == wid) == 1 for wid in targets), 'Legacy target needs exactly one included mapping')
    expected = copy.deepcopy(before)
    appended_sources, appended_attempts = [], []
    source_start = max((r['sourceOrdinal'] for r in source_table['rows']), default=0)
    attempt_start = max((r['sourceOrdinal'] for r in attempt_table['rows']), default=0)
    existing_row_ids = {r['sourceRowId'] for r in source_table['rows']}
    existing_attempt_ids = {r['attemptId'] for r in attempt_table['rows']}
    require(not item_ids.intersection(item.strip() for r in attempt_table['rows'] for item in re.split(r'[;|]', r['sourceItemIds']) if item.strip()), 'Legacy sourceItemId already has registry provenance')
    for index, mapping in enumerate(sorted(mappings, key=lambda r: r['sourceItemId']), 1):
        sid, wid = mapping['sourceItemId'], mapping['workId']
        member, raw, work = members.get(sid), raw_rows.get(sid), facts['works'].get(wid)
        require(member is not None and raw is not None and work is not None, f'Legacy join missing: {sid}')
        require(mapping['mappingType'] in {'included', 'duplicate'} and member['status'] == mapping['mappingType'], f'Legacy membership status mismatch: {sid}')
        require(member['workId'] == wid and member['candidateId'] == mapping['candidateId'] and member['decisionRef'] == mapping['mappingId'], f'Legacy mapping/member ownership mismatch: {sid}')
        require(raw['sourceId'] == member['sourceId'], f'Legacy raw/member source mismatch: {sid}')
        source = sources.get(member['sourceId'])
        require(source is not None, f'Legacy source registry join missing: {sid}')
        require(mapping['canonicalTitleJa'] == work['title'], f'Legacy canonical title mismatch: {sid}')
        require(work['libraryOnly'] == 'true' and work['recommendationEligible'] == 'false' and work['annotationReviewMethod'] == 'unreviewed', f'Legacy target is not unreviewed library-only: {wid}')
        volumes = [v for v in facts['volumeRows'].get(wid, []) if v['isRepresentative'] == 'true']
        require(len(volumes) == 1, f'Legacy representative count mismatch: {wid}')
        volume = volumes[0]
        require((volume['volumeNumber'] == '' or (volume['volumeNumber'].isdigit() and int(volume['volumeNumber']) > 0)) and bool(volume['editionKind']) and re.fullmatch(r'\d{13}', volume['isbn']), f'Legacy representative bibliography missing: {wid}')
        evidence = facts['evidence'].get(volume['evidenceId'])
        require(evidence is not None and evidence['workId'] == wid and valid_url(evidence['sourceUrl']), f'Legacy representative evidence ownership mismatch: {wid}')
        note_parts = mapping['notes'].removesuffix('.').split('; ')
        require(all('=' in part for part in note_parts), f'Unsupported legacy mapping notes: {sid}')
        note_pairs = [part.split('=', 1) for part in note_parts]
        note = dict(note_pairs)
        require(len(note) == len(note_pairs) and {'sourceOfficialUrl', 'rakutenProductUrl', 'normalizedTitle', 'matchedRakutenAuthor', 'isbn'} <= set(note), f'Incomplete legacy identity proof: {sid}')
        require(note['isbn'] == volume['isbn'] and note['rakutenProductUrl'] == evidence['sourceUrl'], f'Legacy ISBN/product evidence mismatch: {sid}')
        require(note['sourceOfficialUrl'] == source['url'] == mapping['evidenceUrl'], f'Legacy selection URL mismatch: {sid}')
        require(all(valid_url(source[k]) for k in ('url', 'snapshotUrl')) and re.fullmatch('[0-9a-f]{64}', source['snapshotSha256']), f'Invalid legacy snapshot binding: {sid}')
        require(mapping['retrievedAt'] and source['retrievedAt'] and raw['rawTitle'] and raw['rawCreator'] and source['sourceKind'], f'Missing legacy provenance field: {sid}')
        identity_urls = [evidence['sourceUrl']]
        if note.get('canonicalTitleEvidenceUrl'):
            require(valid_url(note['canonicalTitleEvidenceUrl']), f'Invalid legacy canonical-title URL: {sid}')
            identity_urls.append(note['canonicalTitleEvidenceUrl'])
        rid, aid = 'legacy:' + sid, 'legacy-check:' + sid
        require(rid not in existing_row_ids and aid not in existing_attempt_ids, f'Legacy identifier collision: {sid}')
        terminal = 'MAPPED_EXISTING_CATALOG' if member['status'] == 'included' else 'DUPLICATE_OF'
        cohort_class, cohort_key = legacy_cohort(raw, source)
        payload = {'schemaVersion': LEGACY_LEDGER, 'inputSha256': request['inputSha256'], 'mapping': mapping, 'membership': member, 'source': source, 'raw': raw, 'checkedAt': request['checkedAt'], 'cohortRule': request['cohortRule'], 'cohortClass': cohort_class, 'cohortKey': cohort_key, 'verificationScope': 'Stored canonical mapping/representative bibliography join and original cohort-key projection only; scores discarded; no remote replay, safety, or Factor adjudication.'}
        row = dict.fromkeys(LEGACY_SOURCE_FIELDS, '')
        row.update(sourceOrdinal=source_start + index, sourceRowId=rid, rawTitle=raw['rawTitle'], rawCreator=raw['rawCreator'], queueStatus='legacy-stored-provenance', sourceIds=source['sourceId'], sourceFamilies=source['organization'] or source['sourceKind'], supportEvidenceUrls=source['url'], canonicalWorkId=wid, canonicalTitleJa=work['title'], canonicalCreatorsJa=work['creators'], existingCatalogWorkId=wid, identityEvidenceUrls=' | '.join(dict.fromkeys(identity_urls)), representativeIsbn=volume['isbn'], volumeNumber=volume['volumeNumber'], editionKind=volume['editionKind'], bibliographyEvidenceUrls=evidence['sourceUrl'], duplicateOfWorkId=wid if member['status'] == 'duplicate' else '', terminalStatus=terminal, candidateOnly='true', reviewedByHuman='false', notes=json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(',', ':')), identityResearchStatus='stored-provenance-join-verified', identityResearchAttemptId=aid, identityResearchOutcome='stored-canonical-match', reviewMethod='legacy-stored-provenance-join', externalReviewRequired='false')
        row['cohortKeys'] = cohort_key
        attempt = dict.fromkeys(LEGACY_ATTEMPT_FIELDS, '')
        attempt.update(sourceOrdinal=attempt_start + index, attemptId=aid, sourceRowId=rid, rawTitle=raw['rawTitle'], rawCreator=raw['rawCreator'], offlineSnapshotRefs=json.dumps({'inputSha256': request['inputSha256'], 'snapshotUrl': source['snapshotUrl'], 'snapshotSha256': source['snapshotSha256'], 'snapshotReplayed': False}, sort_keys=True, separators=(',', ':')), sourceItemIds=sid, rakutenOutcome='not-requeried', ndlOutcome='not-queried', matchOutcome='stored-canonical-match', matchBasis='Exact stored mapping/member/raw/source joins plus unchanged Catalog representative ISBN/evidence', resolvedWorkId=wid, checkedAt=request['checkedAt'], candidateOnly='true', reviewedByHuman='false', grokUsed='false', paidSourceUsed='false', finalTerminalStatus=terminal)
        appended_sources.append(row)
        appended_attempts.append(attempt)
    expected['tables']['registry_source_rows']['rows'].extend(appended_sources)
    expected['tables']['registry_research_attempts']['rows'].extend(appended_attempts)
    meta = {r['key']: r for r in expected['tables']['registry_meta']['rows']}
    require(meta.get('sourceRows', {}).get('value') == str(len(source_table['rows'])), 'Legacy sourceRows metadata mismatch')
    meta['sourceRows']['value'] = str(len(expected['tables']['registry_source_rows']['rows']))
    return expected, {'appendedSources': appended_sources, 'appendedAttempts': appended_attempts, 'counts': {'workCount': len(targets), 'sourceItemCount': len(item_ids), 'sourceCount': len({r['sourceIds'] for r in appended_sources}), **dict(Counter(m['mappingType'] for m in mappings))}}


def legacy_preservation(before: dict, after: dict, expected: dict, detail: dict) -> dict:
    require(after == expected, 'Legacy import changed schema, existing rows, metadata, or exact appended provenance')
    return {'schemaUnchanged': before['schema'] == after['schema'], 'allRowsAndColumnsCompared': True, 'existingSourceRowsUnchanged': True, 'existingAttemptsUnchanged': True, 'metadataChanges': [{'key': 'sourceRows', 'before': str(len(before['tables']['registry_source_rows']['rows'])), 'after': str(len(after['tables']['registry_source_rows']['rows']))}], 'appendedSourcesSha256': json_sha(detail['appendedSources']), 'appendedAttemptsSha256': json_sha(detail['appendedAttempts']), 'beforeSnapshotSha256': json_sha(before), 'afterSnapshotSha256': json_sha(after), **detail['counts']}


def legacy_binding(root: Path, source_registry: Path, catalog: Path, request: dict, source_root: Path):
    require(sha256(source_registry) == request['sourceRegistrySha256'] and sha256(catalog) == request['catalogSha256'], 'Legacy catalog/source registry hash mismatch')
    publisher = load_publisher(root)
    publisher._verify_result_manifest(catalog.parent)
    require(catalog.name == 'catalog-expanded.candidate.sqlite', 'Legacy import needs the actual publication catalog')
    backend = publisher._backend_module()
    backend.ensure_baseline(catalog)
    tables = legacy_inputs(source_root, request)
    facts = backend._baseline_facts(catalog)
    gold = json.loads((publisher._repo_root() / 'data/staging/catalog-expansion/gold-set-manifest.json').read_text(encoding='utf-8'))['workIds']
    before = snapshot(source_registry)
    expected, detail = legacy_plan(before, request, tables, facts, set(gold))
    return publisher, backend, before, expected, detail


def verify_legacy_import(root: Path, source_registry: Path, catalog: Path, ledger: dict, report: dict) -> Path:
    require(ledger.get('schemaVersion') == LEGACY_LEDGER and ledger.get('candidateOnly') is True and ledger.get('reviewedByHuman') is False, 'Legacy ledger authority mismatch')
    request = validate_legacy_request(ledger.get('request'))
    require(json_sha(request) == ledger.get('requestCanonicalSha256'), 'Legacy request digest mismatch')
    require(isinstance(ledger.get('legacySourceRoot'), str), 'Missing legacy input root')
    for name in ('build_registry_correction.py', 'preflight_registry_correction.py'):
        require(sha256(root / name) == ledger.get('genericToolSha256'), 'Frozen legacy tool digest mismatch')
    publisher, backend, before, expected, detail = legacy_binding(root, source_registry, catalog, request, artifact_path(ledger['legacySourceRoot']))
    output = root / 'catalog-source-registry.candidate.sqlite'
    proof = legacy_preservation(before, snapshot(output), expected, detail)
    require(ledger.get('preservation') == report.get('preservation') == proof, 'Legacy full-table preservation differs from ledger/preflight')
    with (root / 'source-registry.csv').open(encoding='utf-8', newline='') as stream:
        reader = csv.DictReader(stream)
        actual = list(reader)
        require(reader.fieldnames == LEGACY_SOURCE_FIELDS and actual == [{k: str(v) for k, v in r.items()} for r in detail['appendedSources']], 'Legacy slice readback mismatch')
    common = {'sourceRegistrySha256': sha256(source_registry), 'baselineSha256': sha256(catalog), 'correctedRegistrySha256': sha256(output), 'correctedRegistrySliceSha256': sha256(root / 'source-registry.csv')}
    require(all(ledger.get(k) == report.get(k) == v for k, v in common.items()), 'Legacy artifact binding mismatch')
    require(report.get('schemaVersion') == 'factor-registry-legacy-import-preflight-v1' and report.get('status') == 'PASS' and report.get('counts') == detail['counts'], 'Legacy preflight report mismatch')
    registry = backend.ensure_registry(output, set(request['workIds']), sha256(catalog))
    require(sum(len(registry['rowsByWork'][wid]) for wid in request['workIds']) == len(detail['appendedSources']), 'Existing publisher lost legacy same-work rows')
    require(sha256(source_registry) == request['sourceRegistrySha256'] and sha256(catalog) == request['catalogSha256'], 'Legacy immutable inputs changed during verification')
    legacy_inputs(artifact_path(ledger['legacySourceRoot']), request)
    return output


def import_legacy(source_registry: Path, catalog: Path, source_root: Path, changes_path: Path, output_root: Path) -> dict:
    request = validate_legacy_request(json.loads(changes_path.read_text(encoding='utf-8')))
    source_registry, catalog, source_root, output_root = (p.resolve() for p in (source_registry, catalog, source_root, output_root))
    require(not output_root.exists(), f'Refusing to overwrite output: {output_root}')
    require(not any(output_root.is_relative_to(p) for p in (source_registry.parent, catalog.parent, source_root, changes_path.resolve().parent)), 'Legacy output cannot be inside immutable input')
    publisher, _, before, expected, detail = legacy_binding(output_root.parent, source_registry, catalog, request, source_root)
    output_root.mkdir(parents=True)
    for name in ('build_registry_correction.py', 'preflight_registry_correction.py'):
        shutil.copyfile(Path(__file__).resolve(), output_root / name)
    output = output_root / 'catalog-source-registry.candidate.sqlite'
    shutil.copy2(source_registry, output)
    with closing(sqlite3.connect(output)) as db:
        with db:
            for table, rows, fields in (('registry_source_rows', detail['appendedSources'], LEGACY_SOURCE_FIELDS), ('registry_research_attempts', detail['appendedAttempts'], LEGACY_ATTEMPT_FIELDS)):
                columns = ','.join(f'"{f}"' for f in fields)
                db.executemany(f'insert into {table} ({columns}) values ({",".join("?" for _ in fields)})', [[r[f] for f in fields] for r in rows])
            cursor = db.execute('update registry_meta set value=? where key=? and value=?', (str(len(expected['tables']['registry_source_rows']['rows'])), 'sourceRows', str(len(before['tables']['registry_source_rows']['rows']))))
            require(cursor.rowcount == 1, 'Legacy count update did not affect one metadata row')
    proof = legacy_preservation(before, snapshot(output), expected, detail)
    with (output_root / 'source-registry.csv').open('x', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=LEGACY_SOURCE_FIELDS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(detail['appendedSources'])
    common = {'sourceRegistrySha256': request['sourceRegistrySha256'], 'baselineSha256': request['catalogSha256'], 'correctedRegistrySha256': sha256(output), 'correctedRegistrySliceSha256': sha256(output_root / 'source-registry.csv')}
    write_json(output_root / 'correction-ledger.json', {'schemaVersion': LEGACY_LEDGER, 'candidateOnly': True, 'reviewedByHuman': False, **common, 'legacySourceRoot': str(source_root), 'request': request, 'requestSha256': sha256(changes_path), 'requestCanonicalSha256': json_sha(request), 'genericToolSha256': sha256(Path(__file__).resolve()), 'preservation': proof})
    report = {'schemaVersion': 'factor-registry-legacy-import-preflight-v1', 'status': 'PASS', **common, 'counts': detail['counts'], 'preservation': proof, 'verificationLimit': 'Stored legacy provenance/registry ingestion only. No remote snapshot replay, safety or Factor adjudication, real authoring job, publication, canonical or STATE mutation.'}
    write_json(output_root / 'preflight-report.json', report)
    require({p.name for p in output_root.iterdir()} == MEMBERS, 'Unexpected legacy output membership')
    with (output_root / 'MANIFEST.sha256').open('x', encoding='ascii', newline='\n') as stream:
        stream.write(''.join(f'{sha256(output_root / name)}  {name}\n' for name in sorted(MEMBERS)))
    publisher.verify_manifest(output_root, output_root / 'MANIFEST.sha256', MEMBERS)
    require(verify_correction(output_root, source_registry, catalog) == output, 'Independent legacy import readback failed')
    return report


def oricon_plan(source_registry: Path, catalog: Path, request: dict) -> tuple[dict, dict, list[dict], dict]:
    """Replay the corrected source reader; never accept operator-supplied cohort values."""
    require(isinstance(request, dict) and set(request) == {'schemaVersion', 'sourceRegistrySha256', 'catalogSha256', 'inputs', 'sourceRowIds'} and request['schemaVersion'] == ORICON_REQUEST, 'Invalid Oricon correction request')
    require(sha256(source_registry) == request['sourceRegistrySha256'] and sha256(catalog) == request['catalogSha256'], 'Oricon baseline hash mismatch')
    inputs = request['inputs']
    require(isinstance(inputs, dict) and set(inputs) == ORICON_INPUTS, 'Incomplete Oricon source bindings')
    paths = {}
    for key, binding in inputs.items():
        require(isinstance(binding, dict) and set(binding) == {'path', 'sha256'} and isinstance(binding['path'], str), 'Invalid Oricon input binding')
        path = artifact_path(binding['path']).resolve()
        require(path.is_file() and not path.is_symlink() and sha256(path) == binding['sha256'], f'Oricon source hash mismatch: {key}')
        paths[key] = path
    rule = paths['cohortRule']
    require(paths['normalizer'] == rule.parent / 'build_targets.py', 'Oricon normalizer must be beside reader')
    staging = paths['sourceRegistry'].parent
    require(all(paths[key] == staging / name for key, name in (('sourceRegistry', 'source-registry.csv'), ('sourceMembership', 'source-membership.csv'), ('rawSourceItems', 'raw-source-items.csv'))), 'Oricon original source layout mismatch')
    previous = sys.modules.pop('build_targets', None)
    search_path = list(sys.path)
    try:
        spec = importlib.util.spec_from_file_location('_bound_oricon_reader', rule)
        require(spec is not None and spec.loader is not None, 'Cannot load bound Oricon reader')
        reader = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(reader)
        require(Path(reader.bt.__file__).resolve() == paths['normalizer'], 'Wrong Oricon normalizer loaded')
        reader.ROOT, reader.ORICON_HTML = staging.parents[2], paths['oriconHtml']
        events = reader.load_repo_events() + reader.load_oricon_events()
        key_of = lambda title, creator: (reader.bt.normalize_title(title), reader.bt.creator_key(creator))
        records = {key_of(r['title'], r['creator']): r['events'] for r in reader.aggregate_identity_events(events)}
        with paths['identityQueue'].open(encoding='utf-8-sig', newline='') as stream:
            original_rows = list(csv.DictReader(stream))
        original = {key_of(r['rawTitle'], r['rawCreator']): r for r in original_rows}
        require(len(original) == len(original_rows), 'Duplicate original source identity')
        before = snapshot(source_registry)
        expected = copy.deepcopy(before)
        affected = [r for r in expected['tables']['registry_source_rows']['rows'] if ORICON_SOURCE in url_members(r['sourceIds'])]
        ids = request['sourceRowIds']
        require(isinstance(ids, list) and ids == sorted(set(ids)) and ids == sorted(r['sourceRowId'] for r in affected) and bool(ids), 'Oricon correction must cover every affected row exactly')
        changes, unsupported = [], []
        fields = {'cohortKeys': 'cohortKeys', 'sourceIds': 'sourceIds', 'sourceFamilies': 'sourceFamilies', 'supportEvidenceUrls': 'evidenceUrls', 'bestScore': 'bestScore'}
        original_keys = set()
        for row in affected:
            identity = key_of(row['rawTitle'], row['rawCreator'])
            require(identity in original, f'Missing original Oricon identity: {row["sourceRowId"]}')
            old = original[identity]
            original_keys.add(identity)
            require(ORICON_SOURCE in url_members(old['sourceIds']), 'Original identity is not Oricon sourced')
            require(all(set(url_members(row[field])) == set(url_members(old[column])) for field, column in fields.items()), f'Original selection fields changed: {row["sourceRowId"]}')
            require(row['notes'].startswith(old['notes']), f'Original selection notes changed: {row["sourceRowId"]}')
            selected = records.get(identity, [])
            retained = [e for e in selected if e['sourceId'] != ORICON_SOURCE]
            require({e['sourceId'] for e in retained} == set(url_members(old['sourceIds'])) - {ORICON_SOURCE}, 'Non-Oricon source membership cannot be reconstructed')
            require({e['cohortKey'] for e in retained} == {c for c in url_members(old['cohortKeys']) if not c.startswith('oricon:')}, 'Non-Oricon cohorts changed')
            old_other_notes = {n for n in old['notes'].split(' | ') if not re.fullmatch(r'votes=\d+;n=\d+;wilson90=\d+\.\d+;sales-preselected universe=131', n)}
            require({e['note'] for e in retained} == old_other_notes, 'Non-Oricon observations changed')
            join = lambda key: ' | '.join(sorted({e[key] for e in selected if e[key]}))
            updates = {'cohortKeys': join('cohortKey'), 'sourceIds': join('sourceId'), 'sourceFamilies': join('family'), 'supportEvidenceUrls': join('url'), 'bestScore': str(max((e['score'] for e in selected), default=0)), 'notes': join('note') + row['notes'][len(old['notes']):]}
            if not selected:
                unsupported.append(row['sourceRowId'])
                updates.update(queueStatus='missing-source', notes='Oricon age/gender cohort unsupported; overall/category discovery retained in correction ledger, not counted as zero votes.' + row['notes'][len(old['notes']):])
            for field, value in sorted(updates.items()):
                if row[field] != value:
                    changes.append({'sourceRowId': row['sourceRowId'], 'workId': row['canonicalWorkId'], 'field': field, 'before': row[field], 'after': value})
                    row[field] = value
        oricon_events = [e for e in events if e['sourceId'] == ORICON_SOURCE]
        discoveries = [e for e in oricon_events if key_of(e['title'], e['creator']) not in original_keys]
        detail = {'affectedRowCount': len(affected), 'sourceEventCount': len(oricon_events), 'unsupportedSourceRowIds': sorted(unsupported), 'newSourceIdentities': reader.aggregate_identity_events(discoveries), 'correctedEvents': oricon_events, 'preservedNonOriconEventCount': sum(e['sourceId'] != ORICON_SOURCE for identity in original_keys for e in records.get(identity, []))}
    finally:
        sys.path[:] = search_path
        sys.modules.pop('build_targets', None)
        if previous is not None:
            sys.modules['build_targets'] = previous
    require(all(sha256(path) == inputs[key]['sha256'] for key, path in paths.items()), 'Oricon source changed during replay')
    require(sha256(source_registry) == request['sourceRegistrySha256'] and sha256(catalog) == request['catalogSha256'], 'Oricon baseline changed during replay')
    return before, expected, changes, detail


def verify_oricon_correction(root: Path, source_registry: Path, catalog: Path, ledger: dict, report: dict) -> Path:
    require(ledger.get('candidateOnly') is True and ledger.get('reviewedByHuman') is False and report.get('status') == 'PASS', 'Oricon correction authority mismatch')
    request = ledger.get('request')
    require(json_sha(request) == ledger.get('requestCanonicalSha256'), 'Oricon request digest mismatch')
    require(all(sha256(root / name) == ledger.get('genericToolSha256') for name in ('build_registry_correction.py', 'preflight_registry_correction.py')), 'Oricon correction tool hash mismatch')
    before, expected, changes, detail = oricon_plan(source_registry, catalog, request)
    output = root / 'catalog-source-registry.candidate.sqlite'
    proof = preservation(before, snapshot(output), expected, changes)
    require(ledger.get('changes') == changes and ledger.get('detail') == detail and ledger.get('preservation') == report.get('preservation') == proof, 'Oricon correction replay differs')
    with (root / 'source-registry.csv').open(encoding='utf-8', newline='') as stream:
        csv_reader = csv.DictReader(stream)
        actual = list(csv_reader)
    rows = [r for r in expected['tables']['registry_source_rows']['rows'] if r['sourceRowId'] in request['sourceRowIds']]
    require(csv_reader.fieldnames == expected['tables']['registry_source_rows']['columns'] and actual == [{k: str(v) for k, v in r.items()} for r in rows], 'Oricon corrected slice mismatch')
    common = {'sourceRegistrySha256': sha256(source_registry), 'baselineSha256': sha256(catalog), 'correctedRegistrySha256': sha256(output), 'correctedRegistrySliceSha256': sha256(root / 'source-registry.csv')}
    require(all(ledger.get(k) == report.get(k) == v for k, v in common.items()) and report.get('schemaVersion') == ORICON_LEDGER and report.get('affectedRowCount') == len(rows), 'Oricon artifact binding mismatch')
    return output


def correct_oricon(source_registry: Path, catalog: Path, changes_path: Path, output_root: Path) -> dict:
    source_registry, catalog, changes_path, output_root = (p.resolve() for p in (source_registry, catalog, changes_path, output_root))
    require(not output_root.exists(), f'Refusing to overwrite output: {output_root}')
    request = json.loads(changes_path.read_text(encoding='utf-8'))
    require(not any(output_root.is_relative_to(p) for p in (source_registry.parent, catalog.parent, changes_path.parent)), 'Oricon output cannot be inside immutable input')
    publisher = load_publisher(output_root.parent)
    publisher._verify_result_manifest(catalog.parent)
    before, expected, changes, detail = oricon_plan(source_registry, catalog, request)
    output_root.mkdir(parents=True)
    for name in ('build_registry_correction.py', 'preflight_registry_correction.py'):
        shutil.copyfile(Path(__file__).resolve(), output_root / name)
    output = output_root / 'catalog-source-registry.candidate.sqlite'
    shutil.copy2(source_registry, output)
    with closing(sqlite3.connect(output)) as db:
        with db:
            for change in changes:
                cursor = db.execute(f'update registry_source_rows set "{change["field"]}"=? where sourceRowId=? and "{change["field"]}"=?', (change['after'], change['sourceRowId'], change['before']))
                require(cursor.rowcount == 1, 'Oricon update did not affect exactly one row')
    proof = preservation(before, snapshot(output), expected, changes)
    with (output_root / 'source-registry.csv').open('x', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=before['tables']['registry_source_rows']['columns'], lineterminator='\n')
        writer.writeheader()
        writer.writerows(r for r in expected['tables']['registry_source_rows']['rows'] if r['sourceRowId'] in request['sourceRowIds'])
    common = {'sourceRegistrySha256': sha256(source_registry), 'baselineSha256': sha256(catalog), 'correctedRegistrySha256': sha256(output), 'correctedRegistrySliceSha256': sha256(output_root / 'source-registry.csv')}
    write_json(output_root / 'correction-ledger.json', {'schemaVersion': ORICON_LEDGER, 'candidateOnly': True, 'reviewedByHuman': False, **common, 'request': request, 'requestCanonicalSha256': json_sha(request), 'genericToolSha256': sha256(Path(__file__).resolve()), 'changes': changes, 'detail': detail, 'preservation': proof})
    report = {'schemaVersion': ORICON_LEDGER, 'status': 'PASS', **common, 'affectedRowCount': len(request['sourceRowIds']), 'preservation': proof, 'verificationLimit': 'Source cohort correction only; no Factor adjudication, existing-context correction, Catalog or canonical mutation. Newly discovered identities require ordinary identity resolution.'}
    write_json(output_root / 'preflight-report.json', report)
    require({p.name for p in output_root.iterdir()} == MEMBERS, 'Unexpected Oricon correction output')
    with (output_root / 'MANIFEST.sha256').open('x', encoding='ascii', newline='\n') as stream:
        stream.write(''.join(f'{sha256(output_root / name)}  {name}\n' for name in sorted(MEMBERS)))
    require(verify_correction(output_root, source_registry, catalog) == output, 'Oricon independent readback failed')
    return report


def discovery_source(request: dict) -> tuple[list[dict], object]:
    """Read discoveries only from an independently replayed, hash-bound correction."""
    require(isinstance(request, dict) and set(request) == {'schemaVersion', 'sourceRegistrySha256', 'catalogSha256', 'sourceCorrection', 'existingRawJoins'} and request['schemaVersion'] == DISCOVERY_REQUEST, 'Invalid Oricon discovery request')
    require(all(isinstance(request[k], str) and re.fullmatch('[0-9a-f]{64}', request[k]) for k in ('sourceRegistrySha256', 'catalogSha256')), 'Invalid discovery input hash')
    binding = request['sourceCorrection']
    require(isinstance(binding, dict) and set(binding) == {'root', 'manifestSha256', 'sourceRegistry', 'catalog'} and all(isinstance(v, str) and v for v in binding.values()), 'Invalid discovery correction binding')
    root = artifact_path(binding['root']).resolve()
    require(sha256(root / 'MANIFEST.sha256') == binding['manifestSha256'], 'Discovery correction manifest changed')
    ledger = json.loads((root / 'correction-ledger.json').read_text(encoding='utf-8'))
    require(ledger.get('schemaVersion') == ORICON_LEDGER, 'Discovery source must be an Oricon correction, not legacy or identity adjudication')
    verify_correction(root, artifact_path(binding['sourceRegistry']), artifact_path(binding['catalog']))
    records = ledger['detail']['newSourceIdentities']
    require(isinstance(records, list) and bool(records), 'No source discoveries')
    normalizer = ledger['request']['inputs']['normalizer']
    path = artifact_path(normalizer['path'])
    require(sha256(path) == normalizer['sha256'], 'Discovery normalizer changed')
    spec = importlib.util.spec_from_file_location('_discovery_raw_key', path)
    require(spec is not None and spec.loader is not None, 'Cannot load bound raw-key normalizer')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return records, module


def discovery_plan(before: dict, request: dict, records: list[dict], normalizer: object) -> tuple[dict, dict]:
    """Append source membership, never infer work identity or overwrite raw spellings."""
    require(before['tables']['registry_source_rows']['columns'] == LEGACY_SOURCE_FIELDS and before['tables']['registry_research_attempts']['columns'] == LEGACY_ATTEMPT_FIELDS, 'Unsupported discovery registry schema')
    key_of = lambda title, creator: (normalizer.normalize_title(title), normalizer.creator_key(creator))
    identities = {}
    event_owner = {}
    for record in records:
        require(isinstance(record, dict) and set(record) == {'title', 'creator', 'events'} and isinstance(record['title'], str) and bool(record['title']) and isinstance(record['creator'], str) and isinstance(record['events'], list) and bool(record['events']), 'Invalid raw discovery record')
        key = key_of(record['title'], record['creator'])
        require(key not in identities, 'Duplicate raw discovery identity')
        identities[key] = record
        for event in record['events']:
            require(isinstance(event, dict) and event.get('sourceId') == ORICON_SOURCE and key_of(event['title'], event['creator']) == key and valid_url(event.get('url')) and isinstance(event.get('sourceHash'), str) and re.fullmatch('[0-9a-f]{64}', event['sourceHash']) and type(event.get('score')) is int and event['score'] >= 0, 'Invalid same-raw-identity discovery event')
            digest = json_sha(event)
            require(digest not in event_owner, 'Duplicate discovery source event')
            event_owner[digest] = key
    joins = request['existingRawJoins']
    require(isinstance(joins, list), 'Invalid existing raw joins')
    explicit = {}
    source_rows = before['tables']['registry_source_rows']['rows']
    by_id = {row['sourceRowId']: row for row in source_rows}
    require(len(by_id) == len(source_rows), 'Duplicate registry source IDs')
    for join in joins:
        require(isinstance(join, dict) and set(join) == {'rawTitle', 'rawCreator', 'sourceRowId'} and all(isinstance(value, str) for value in join.values()), 'Invalid explicit raw join')
        key = key_of(join['rawTitle'], join['rawCreator'])
        require(key in identities and key not in explicit and (join['rawTitle'], join['rawCreator']) == (identities[key]['title'], identities[key]['creator']), 'Unknown or duplicate discovery join')
        target = by_id.get(join['sourceRowId'])
        require(target is not None and key_of(target['rawTitle'], target['rawCreator']) == key, 'Explicit join is not the same raw title/creator key; variant identity needs separate proof')
        explicit[key] = join['sourceRowId']
    # Exact event receipts are part of source notes, not a new authority table.
    receipts = {}
    decoder = json.JSONDecoder()
    for row in source_rows:
        for fragment in row['notes'].split(DISCOVERY_MARKER)[1:]:
            try:
                payload, end = decoder.raw_decode(fragment)
            except (ValueError, TypeError) as error:
                raise ValueError('Malformed discovery receipt') from error
            require(not fragment[end:] or fragment[end:].startswith(' | '), 'Malformed discovery receipt suffix')
            require(isinstance(payload, dict) and set(payload) == {'sourceCorrectionManifestSha256', 'events'} and isinstance(payload['sourceCorrectionManifestSha256'], str) and re.fullmatch('[0-9a-f]{64}', payload['sourceCorrectionManifestSha256']) and isinstance(payload['events'], list) and bool(payload['events']), 'Invalid discovery receipt')
            for event in payload['events']:
                digest = json_sha(event)
                require(digest not in receipts and key_of(event['title'], event['creator']) == key_of(row['rawTitle'], row['rawCreator']), 'Duplicate or cross-raw-identity stored discovery event')
                receipts[digest] = row['sourceRowId']
    expected = copy.deepcopy(before)
    destination = expected['tables']['registry_source_rows']['rows']
    projected = {r['sourceRowId']: r for r in destination}
    appended, changes, accepted = [], [], []
    next_ordinal = max((r['sourceOrdinal'] for r in source_rows), default=0)
    for key, record in sorted(identities.items()):
        events = sorted(record['events'], key=json_sha)
        prior_owners = {receipts[json_sha(e)] for e in events if json_sha(e) in receipts}
        require(len(prior_owners) <= 1, 'Same raw discovery was split across registry rows')
        previous = next(iter(prior_owners), None)
        rid = explicit.get(key, previous)
        require(previous is None or rid == previous, 'Explicit join conflicts with stored event receipt')
        same_key = [r['sourceRowId'] for r in source_rows if key_of(r['rawTitle'], r['rawCreator']) == key]
        require(rid is not None or not same_key, 'Existing same raw key requires an explicit sourceRowId join')
        fresh = [e for e in events if json_sha(e) not in receipts]
        if rid is None:
            next_ordinal += 1
            row = dict.fromkeys(LEGACY_SOURCE_FIELDS, '')
            row.update(sourceOrdinal=next_ordinal, rawTitle=record['title'], rawCreator=record['creator'], queueStatus='source-qualified-unmapped-identity', bestScore=str(max(e['score'] for e in events)), sourceIds=' | '.join(sorted({e['sourceId'] for e in events})), sourceFamilies=' | '.join(sorted({e['family'] for e in events})), cohortKeys=' | '.join(sorted({e['cohortKey'] for e in events})), supportEvidenceUrls=' | '.join(sorted({e['url'] for e in events})), terminalStatus='UNRESOLVED_IDENTITY', blocker='IDENTITY_EVIDENCE_REQUIRED', candidateOnly='true', reviewedByHuman='false')
            # Historical build_v3_checkpoint.source_row_id convention; ordinal is append-only.
            raw = '\0'.join(row[field] for field in ('rawTitle', 'rawCreator', 'sourceIds', 'cohortKeys'))
            rid = f'source-{next_ordinal:05d}-{hashlib.sha256(raw.encode()).hexdigest()[:10]}'
            require(rid not in projected, 'Discovery stable source ID collision')
            row['sourceRowId'] = rid
            projected[rid] = row
            destination.append(row)
            appended.append(row)
        row = projected[rid]
        if fresh:
            updates = {}
            for field, source in (('sourceIds', 'sourceId'), ('sourceFamilies', 'family'), ('cohortKeys', 'cohortKey'), ('supportEvidenceUrls', 'url')):
                values = list(dict.fromkeys(url_members(row[field]) + sorted({e[source] for e in fresh})))
                updates[field] = ' | '.join(values)
            require(row['bestScore'] == '' or row['bestScore'].isdigit(), 'Invalid existing discovery score')
            updates['bestScore'] = str(max(int(row['bestScore'] or 0), *(e['score'] for e in fresh)))
            payload = {'sourceCorrectionManifestSha256': request['sourceCorrection']['manifestSha256'], 'events': fresh}
            marker = DISCOVERY_MARKER + json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
            updates['notes'] = row['notes'] + (' | ' if row['notes'] else '') + marker
            for field, value in sorted(updates.items()):
                if row[field] != value:
                    if rid in by_id:
                        changes.append({'sourceRowId': rid, 'field': field, 'before': row[field], 'after': value})
                    row[field] = value
        accepted.append({'rawTitle': record['title'], 'rawCreator': record['creator'], 'sourceRowId': rid, 'eventSha256': [json_sha(e) for e in events], 'newEventCount': len(fresh)})
    meta = {r['key']: r for r in expected['tables']['registry_meta']['rows']}
    require(meta.get('sourceRows', {}).get('value') == str(len(source_rows)), 'Discovery sourceRows metadata mismatch')
    meta['sourceRows']['value'] = str(len(destination))
    return expected, {'appendedSources': appended, 'changes': changes, 'sourceIdentities': records, 'joins': accepted, 'counts': {'sourceIdentityCount': len(records), 'eventCount': len(event_owner), 'newEventCount': sum(r['newEventCount'] for r in accepted), 'appendedSourceCount': len(appended), 'updatedSourceCount': len({r['sourceRowId'] for r in changes})}}


def discovery_binding(root: Path, source_registry: Path, catalog: Path, request: dict) -> tuple[dict, dict, dict]:
    require(sha256(source_registry) == request.get('sourceRegistrySha256') and sha256(catalog) == request.get('catalogSha256'), 'Discovery current input hash mismatch')
    publisher = load_publisher(root)
    publisher._verify_result_manifest(catalog.parent)
    publisher._verify_result_manifest(source_registry.parent)
    records, normalizer = discovery_source(request)
    before = snapshot(source_registry)
    expected, detail = discovery_plan(before, request, records, normalizer)
    require(sha256(source_registry) == request['sourceRegistrySha256'] and sha256(catalog) == request['catalogSha256'], 'Discovery inputs changed during planning')
    return before, expected, detail


def verify_discovery(root: Path, source_registry: Path, catalog: Path, ledger: dict, report: dict) -> Path:
    require(ledger.get('candidateOnly') is True and ledger.get('reviewedByHuman') is False and report.get('status') == 'PASS', 'Discovery authority mismatch')
    request = ledger.get('request')
    require(json_sha(request) == ledger.get('requestCanonicalSha256'), 'Discovery request digest mismatch')
    require(all(sha256(root / name) == ledger.get('genericToolSha256') for name in ('build_registry_correction.py', 'preflight_registry_correction.py')), 'Discovery tool binding mismatch')
    before, expected, detail = discovery_binding(root, source_registry, catalog, request)
    output = root / 'catalog-source-registry.candidate.sqlite'
    require(snapshot(output) == expected, 'Discovery changed rows or schema outside exact append/support plan')
    require(ledger.get('detail') == detail and ledger.get('afterSnapshotSha256') == json_sha(expected), 'Discovery event/projection replay differs')
    ids = {r['sourceRowId'] for r in detail['joins']}
    rows = [r for r in expected['tables']['registry_source_rows']['rows'] if r['sourceRowId'] in ids]
    with (root / 'source-registry.csv').open(encoding='utf-8', newline='') as stream:
        reader = csv.DictReader(stream)
        require(reader.fieldnames == LEGACY_SOURCE_FIELDS and list(reader) == [{k: str(v) for k, v in r.items()} for r in rows], 'Discovery source slice mismatch')
    common = {'schemaVersion': DISCOVERY_LEDGER, 'sourceRegistrySha256': sha256(source_registry), 'baselineSha256': sha256(catalog), 'correctedRegistrySha256': sha256(output), 'correctedRegistrySliceSha256': sha256(root / 'source-registry.csv'), 'beforeSnapshotSha256': json_sha(before), 'afterSnapshotSha256': json_sha(expected), 'counts': detail['counts']}
    require(all(ledger.get(k) == report.get(k) == value for k, value in common.items()), 'Discovery readback binding mismatch')
    return output


def ingest_discoveries(source_registry: Path, catalog: Path, changes_path: Path, output_root: Path) -> dict:
    source_registry, catalog, changes_path, output_root = (p.resolve() for p in (source_registry, catalog, changes_path, output_root))
    require(not output_root.exists(), f'Refusing to overwrite output: {output_root}')
    request = json.loads(changes_path.read_text(encoding='utf-8'))
    immutable = (source_registry.parent, catalog.parent, changes_path.parent, artifact_path(request['sourceCorrection']['root']).resolve())
    require(not any(output_root.is_relative_to(p) for p in immutable), 'Discovery output cannot be inside immutable input')
    before, expected, detail = discovery_binding(output_root.parent, source_registry, catalog, request)
    output_root.mkdir(parents=True)
    for name in ('build_registry_correction.py', 'preflight_registry_correction.py'):
        shutil.copyfile(Path(__file__).resolve(), output_root / name)
    output = output_root / 'catalog-source-registry.candidate.sqlite'
    shutil.copy2(source_registry, output)
    with closing(sqlite3.connect(output)) as db:
        with db:
            for row in detail['appendedSources']:
                db.execute(f'insert into registry_source_rows values ({",".join("?" for _ in LEGACY_SOURCE_FIELDS)})', [row[f] for f in LEGACY_SOURCE_FIELDS])
            for change in detail['changes']:
                cursor = db.execute(f'update registry_source_rows set "{change["field"]}"=? where sourceRowId=? and "{change["field"]}"=?', (change['after'], change['sourceRowId'], change['before']))
                require(cursor.rowcount == 1, 'Discovery support update lost exact before row')
            if detail['appendedSources']:
                cursor = db.execute('update registry_meta set value=? where key=? and value=?', (str(len(expected['tables']['registry_source_rows']['rows'])), 'sourceRows', str(len(before['tables']['registry_source_rows']['rows']))))
                require(cursor.rowcount == 1, 'Discovery source count update lost exact before value')
    require(snapshot(output) == expected, 'Discovery materialization mismatch')
    ids = {row['sourceRowId'] for row in detail['joins']}
    with (output_root / 'source-registry.csv').open('x', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=LEGACY_SOURCE_FIELDS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(r for r in expected['tables']['registry_source_rows']['rows'] if r['sourceRowId'] in ids)
    common = {'schemaVersion': DISCOVERY_LEDGER, 'sourceRegistrySha256': request['sourceRegistrySha256'], 'baselineSha256': request['catalogSha256'], 'correctedRegistrySha256': sha256(output), 'correctedRegistrySliceSha256': sha256(output_root / 'source-registry.csv'), 'beforeSnapshotSha256': json_sha(before), 'afterSnapshotSha256': json_sha(expected), 'counts': detail['counts']}
    write_json(output_root / 'correction-ledger.json', {**common, 'candidateOnly': True, 'reviewedByHuman': False, 'request': request, 'requestCanonicalSha256': json_sha(request), 'genericToolSha256': sha256(Path(__file__).resolve()), 'detail': detail})
    report = {**common, 'status': 'PASS', 'verificationLimit': 'Raw Oricon source membership only. Existing identities/history and Catalog untouched; new rows remain unresolved, not eligible. Variant or canonical identity joins require ordinary identity resolution.'}
    write_json(output_root / 'preflight-report.json', report)
    require({p.name for p in output_root.iterdir()} == MEMBERS, 'Unexpected discovery output')
    with (output_root / 'MANIFEST.sha256').open('x', encoding='ascii', newline='\n') as stream:
        stream.write(''.join(f'{sha256(output_root / name)}  {name}\n' for name in sorted(MEMBERS)))
    require(verify_correction(output_root, source_registry, catalog) == output, 'Discovery independent readback failed')
    return report


def verify_identity_mapping_correction(root: Path, source_registry: Path, catalog: Path, ledger: dict, report: dict) -> Path:
    require(ledger.get('schemaVersion') == IDENTITY_MAPPING_LEDGER and ledger.get('candidateOnly') is True and ledger.get('reviewedByHuman') is False, 'Identity mapping correction authority mismatch')
    require(report.get('schemaVersion') == IDENTITY_MAPPING_PREFLIGHT and report.get('status') == 'PASS', 'Identity mapping correction preflight is not PASS')
    request = validate_identity_mapping_request(ledger.get('request'))
    require(json_sha(request) == ledger.get('requestCanonicalSha256'), 'Embedded identity mapping request digest mismatch')
    for name in ('build_registry_correction.py', 'preflight_registry_correction.py'):
        require(sha256(root / name) == ledger.get('genericToolSha256'), 'Identity mapping correction tool hash mismatch')
    source_sha, catalog_sha = sha256(source_registry), sha256(catalog)
    require(source_sha == request['sourceRegistrySha256'] == ledger.get('sourceRegistrySha256'), 'Identity mapping source registry mismatch')
    require(catalog_sha == request['catalogSha256'] == ledger.get('baselineSha256'), 'Identity mapping catalog mismatch')
    before = snapshot(source_registry)
    expected, changes = identity_mapping_plan(before, request)
    output, output_csv = root / 'catalog-source-registry.candidate.sqlite', root / 'source-registry.csv'
    proof = preservation(before, snapshot(output), expected, changes)
    require(ledger.get('changes') == changes and ledger.get('preservation') == report.get('preservation') == proof, 'Identity mapping full-table readback differs')
    with output_csv.open(encoding='utf-8', newline='') as stream:
        reader = csv.DictReader(stream)
        actual = list(reader)
        require(reader.fieldnames == before['tables']['registry_source_rows']['columns'], 'Identity mapping corrected slice columns mismatch')
    corrected = {row['sourceRowId']: row for row in expected['tables']['registry_source_rows']['rows']}
    ids = [change['sourceRowId'] for change in request['changes']]
    require(actual == [{key: str(value) for key, value in corrected[rid].items()} for rid in ids], 'Identity mapping corrected slice mismatch')
    common = {
        'sourceRegistrySha256': source_sha,
        'baselineSha256': catalog_sha,
        'correctedRegistrySha256': sha256(output),
        'correctedRegistrySliceSha256': sha256(output_csv),
        'beforeSnapshotSha256': json_sha(before),
        'afterSnapshotSha256': json_sha(expected),
        'changedRowCount': len(ids),
    }
    require(all(ledger.get(key) == report.get(key) == value for key, value in common.items()), 'Identity mapping artifact binding mismatch')
    require(sha256(source_registry) == source_sha and sha256(catalog) == catalog_sha, 'Read-only identity mapping inputs changed')
    return output


def correct_identity_mapping(source_registry: Path, catalog: Path, changes_path: Path, output_root: Path) -> dict:
    request = validate_identity_mapping_request(json.loads(changes_path.read_text(encoding='utf-8')))
    source_registry, catalog, changes_path, output_root = (path.resolve() for path in (source_registry, catalog, changes_path, output_root))
    require(not output_root.exists(), f'Refusing to overwrite output: {output_root}')
    require(not any(output_root.is_relative_to(root) for root in (source_registry.parent, catalog.parent, changes_path.parent)), 'Output cannot be inside an immutable input or source run')
    protected = {source_registry: request['sourceRegistrySha256'], catalog: request['catalogSha256']}
    def verify_sources():
        for path, digest in protected.items():
            require(sha256(path) == digest, f'Immutable input hash mismatch: {path}')
    verify_sources()
    before = snapshot(source_registry)
    expected, changes = identity_mapping_plan(before, request)
    output_root.mkdir(parents=True)
    for name in ('build_registry_correction.py', 'preflight_registry_correction.py'):
        shutil.copyfile(Path(__file__).resolve(), output_root / name)
    output, output_csv = output_root / 'catalog-source-registry.candidate.sqlite', output_root / 'source-registry.csv'
    shutil.copy2(source_registry, output)
    with closing(sqlite3.connect(output)) as db:
        with db:
            for change in changes:
                cursor = db.execute(f'update registry_source_rows set "{change["field"]}"=? where sourceRowId=? and "{change["field"]}"=?', (change['after'], change['sourceRowId'], change['before']))
                require(cursor.rowcount == 1, 'Bounded identity mapping update did not affect exactly one row')
    proof = preservation(before, snapshot(output), expected, changes)
    corrected = {row['sourceRowId']: row for row in expected['tables']['registry_source_rows']['rows']}
    columns = before['tables']['registry_source_rows']['columns']
    with output_csv.open('x', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=columns, lineterminator='\n')
        writer.writeheader()
        writer.writerows(corrected[change['sourceRowId']] for change in request['changes'])
    verify_sources()
    common = {
        'sourceRegistrySha256': request['sourceRegistrySha256'],
        'baselineSha256': request['catalogSha256'],
        'correctedRegistrySha256': sha256(output),
        'correctedRegistrySliceSha256': sha256(output_csv),
        'beforeSnapshotSha256': json_sha(before),
        'afterSnapshotSha256': json_sha(expected),
        'changedRowCount': len(request['changes']),
    }
    write_json(output_root / 'correction-ledger.json', {
        'schemaVersion': IDENTITY_MAPPING_LEDGER,
        'candidateOnly': True,
        'reviewedByHuman': False,
        **common,
        'request': request,
        'requestCanonicalSha256': json_sha(request),
        'genericToolSha256': sha256(Path(__file__).resolve()),
        'changes': changes,
        'preservation': proof,
        'scope': 'Exact request-bound restoration of a preserved unresolved identity decision. Raw/source/research provenance, non-target rows, Catalog, and all other fields are unchanged.',
    })
    report = {
        'schemaVersion': IDENTITY_MAPPING_PREFLIGHT,
        'status': 'PASS',
        **common,
        'preservation': proof,
        'verificationLimit': 'Registry identity mapping correction only; no new identity authority, Factor adjudication, Catalog, STATE, or shared-run mutation.',
    }
    write_json(output_root / 'preflight-report.json', report)
    require({path.name for path in output_root.iterdir()} == MEMBERS, 'Unexpected identity mapping correction output')
    with (output_root / 'MANIFEST.sha256').open('x', encoding='ascii', newline='\n') as stream:
        stream.write(''.join(f'{sha256(output_root / name)}  {name}\n' for name in sorted(MEMBERS)))
    require(verify_correction(output_root, source_registry, catalog) == output, 'Identity mapping independent readback failed')
    verify_sources()
    return report


def verify_correction(root: Path, source_registry: Path, catalog: Path) -> Path:
    """Revalidate an existing correction and its original input; never require a new input."""
    root, source_registry, catalog = (p.resolve() for p in (root, source_registry, catalog))
    require(root.is_dir() and not root.is_symlink(), 'Correction root is not a regular directory')
    require({p.name for p in root.iterdir()} == MEMBERS | {'MANIFEST.sha256'}, 'Unexpected correction membership')
    require(all((root / name).is_file() and not (root / name).is_symlink() for name in MEMBERS | {'MANIFEST.sha256'}), 'Correction contains nonregular files')
    require((root / 'MANIFEST.sha256').read_text(encoding='ascii') == ''.join(f'{sha256(root / name)}  {name}\n' for name in sorted(MEMBERS)), 'Correction manifest mismatch')
    ledger = json.loads((root / 'correction-ledger.json').read_text(encoding='utf-8'))
    report = json.loads((root / 'preflight-report.json').read_text(encoding='utf-8'))
    if ledger.get('schemaVersion') == DISCOVERY_LEDGER:
        return verify_discovery(root, source_registry, catalog, ledger, report)
    if ledger.get('schemaVersion') == ORICON_LEDGER:
        return verify_oricon_correction(root, source_registry, catalog, ledger, report)
    if ledger.get('schemaVersion') == LEGACY_LEDGER:
        return verify_legacy_import(root, source_registry, catalog, ledger, report)
    if ledger.get('schemaVersion') == IDENTITY_MAPPING_LEDGER:
        return verify_identity_mapping_correction(root, source_registry, catalog, ledger, report)
    require(ledger.get('schemaVersion') == 'batch010-registry-identity-correction-v1' and ledger.get('candidateOnly') is True and ledger.get('reviewedByHuman') is False, 'Correction ledger authority mismatch')
    require(report.get('schemaVersion') == 'batch010-registry-correction-preflight-v1' and report.get('status') == 'PASS', 'Correction preflight is not PASS')
    request = validate_request(ledger.get('request'))
    require(json_sha(request) == ledger.get('requestCanonicalSha256'), 'Embedded request digest mismatch')
    for name in ('build_registry_correction.py', 'preflight_registry_correction.py'):
        require(sha256(root / name) == ledger.get('genericToolSha256'), 'Frozen generic tool digest mismatch')
    source_sha, catalog_sha = sha256(source_registry), sha256(catalog)
    require(source_sha == request['sourceRegistrySha256'] == ledger['sourceRegistrySha256'], 'Correction source registry mismatch')
    require(catalog_sha == request['catalogSha256'] == ledger['baselineSha256'], 'Correction catalog mismatch')
    job_mode = not request['schemaVersion'].endswith('-v1')
    output_db, output_csv = root / 'catalog-source-registry.candidate.sqlite', root / 'source-registry.csv'
    if job_mode:
        require(ledger.get('bindingMode') == report.get('bindingMode') == 'operator-job', 'Operator binding mode mismatch')
        require(isinstance(ledger.get('jobPath'), str), 'Missing original operator job path')
        job_path = artifact_path(ledger['jobPath']).resolve()
        publisher, backend, spec, packets, baseline, _ = job_binding(job_path, catalog, source_registry, request['jobSha256'])
        digest, binding_key = request['jobSha256'], 'jobSha256'
        require(ledger.get(binding_key) == digest, 'Original operator job binding mismatch')
    else:
        require(isinstance(ledger.get('inputRoot'), str), 'Missing original correction input root')
        input_root = artifact_path(ledger['inputRoot']).resolve()
        publisher = load_publisher(input_root)
        spec, chunks, digest = publisher.validate_input(input_root)
        binding_key = 'panelInputManifestSha256'
        require(digest == request[binding_key] == ledger[binding_key], 'Original panel input mismatch')
        require(spec['baselineCandidateSha256'] == catalog_sha and spec['registrySha256'] == source_sha, 'Original panel is not bound to correction sources')
        packets = {}
        for chunk in chunks:
            for row in publisher.read_csv(chunk / 'targets.csv', publisher.TARGET_FIELDS):
                require(row['workId'] not in packets, 'Duplicate input target')
                packets[row['workId']] = json.loads((chunk / row['packetPath'] / 'packet.json').read_text(encoding='utf-8'))
        backend = publisher._backend_module()
        baseline = backend._baseline_facts(catalog)
    publisher.verify_manifest(root, root / 'MANIFEST.sha256', MEMBERS)
    targets = set(packets)
    representatives = {}
    for wid in targets:
        volumes = [r for r in baseline['volumeRows'][wid] if r['isRepresentative'] == 'true']
        require(len(volumes) == 1, 'Original catalog representative mismatch')
        representatives[wid] = {**volumes[0], 'catalogCreators': baseline['works'][wid]['creators']}
    before = snapshot(source_registry)
    expected, changes = plan(before, request, representatives, targets, packet_volume_proofs(packets, request, backend))
    preserved = preservation(before, snapshot(output_db), expected, changes)
    require(ledger.get('changes') == changes and ledger.get('preservation') == preserved and report.get('preservation') == preserved, 'Correction full-table readback differs from ledger/preflight')
    if job_mode:
        original_rows = sorted([r for r in before['tables']['registry_source_rows']['rows'] if r['canonicalWorkId'] in targets], key=lambda r: int(r['sourceOrdinal']))
        require(json_sha(original_rows) == ledger.get('sourceRegistryRowsSha256'), 'Original operator registry rows changed')
    else:
        require(sha256(input_root / 'source-registry.csv') == ledger['sourceRegistrySliceSha256'], 'Original registry slice changed')
    expected_report = {'sourceRegistrySha256': source_sha, 'correctedRegistrySha256': sha256(output_db), 'baselineSha256': catalog_sha, binding_key: digest, 'correctedRegistrySliceSha256': sha256(output_csv), 'batchId': str(spec['batchId']), 'packetCount': len(targets), 'passedCount': len(targets), 'blockedCount': 0, 'blocked': []}
    for key, value in expected_report.items():
        require(report.get(key) == value, f'Correction preflight binding mismatch: {key}')
        if key in {'correctedRegistrySha256', 'correctedRegistrySliceSha256'}:
            require(ledger.get(key) == value, f'Correction ledger binding mismatch: {key}')
    if job_mode:
        _, _, _, corrected_packets, _, registry = job_binding(job_path, catalog, output_db, digest)
        packets = verify_packet_delta(packets, corrected_packets, expected, request)
        with output_csv.open(encoding='utf-8', newline='') as stream:
            reader = csv.DictReader(stream)
            actual_slice = list(reader)
            require(set(reader.fieldnames or ()) == set(before['tables']['registry_source_rows']['columns']), 'Corrected registry slice columns mismatch')
        expected_slice = sorted([r for r in expected['tables']['registry_source_rows']['rows'] if r['canonicalWorkId'] in targets], key=lambda r: int(r['sourceOrdinal']))
        require(actual_slice == [{k: str(v) for k, v in r.items()} for r in expected_slice], 'Corrected operator registry slice mismatch')
        backend._validate_packet_baseline_binding(packets, baseline, registry)
        require(sha256(job_path) == digest, 'Operator job changed during readback')
    else:
        backend._bind_frozen_registry(input_root, targets, backend.ensure_registry(source_registry, targets, catalog_sha))
        registry = backend._bind_frozen_registry(input_root, targets, backend.ensure_registry(output_db, targets, catalog_sha), output_csv)
        backend._validate_packet_baseline_binding(packets, baseline, registry)
        require(publisher._verify_input_identities(input_root, catalog, output_db, publisher._repo_root()) == output_csv, 'Existing publisher rejected correction slice')
    require(sha256(source_registry) == source_sha and sha256(catalog) == catalog_sha, 'Read-only verification inputs changed')
    return output_db


def correct(source_registry: Path, catalog: Path, input_root: Path | None, changes_path: Path, output_root: Path, *, job: Path | None = None) -> dict:
    request = validate_request(json.loads(changes_path.read_text(encoding='utf-8')))
    require((input_root is None) != (job is None), 'Choose exactly one of --input-root and --job')
    job_mode = job is not None
    require(request['schemaVersion'] in ({'factor-registry-correction-request-v2', 'factor-registry-correction-request-v3', 'factor-registry-correction-request-v4'} if job_mode else {'factor-registry-correction-request-v1'}), 'Request schema does not match binding mode')
    source_registry, catalog, output_root = (p.resolve() for p in (source_registry, catalog, output_root))
    binding_path = job.resolve() if job_mode else input_root.resolve()
    input_root = None if job_mode else binding_path
    require(not output_root.exists(), f'Refusing to overwrite output: {output_root}')
    require(not any(output_root.is_relative_to(protected_root) for protected_root in (binding_path.parent if job_mode else binding_path, source_registry.parent, catalog.parent)), 'Output cannot be inside an immutable input or source run')
    binding_key = 'jobSha256' if job_mode else 'panelInputManifestSha256'
    protected = {source_registry: request['sourceRegistrySha256'], catalog: request['catalogSha256'], binding_path if job_mode else input_root / 'PANEL-INPUT.sha256': request[binding_key]}
    def verify_sources():
        for path, digest in protected.items():
            require(sha256(path) == digest, f'Immutable input hash mismatch: {path}')
    verify_sources()
    if job_mode:
        publisher, backend, spec, packets, baseline, _ = job_binding(binding_path, catalog, source_registry, request[binding_key])
        digest = request[binding_key]
    else:
        publisher = load_publisher(input_root)
        spec, chunks, digest = publisher.validate_input(input_root)
        require(spec['baselineCandidateSha256'] == request['catalogSha256'] and spec['registrySha256'] == request['sourceRegistrySha256'], 'Panel input is not bound to source catalog/registry')
        require(digest == request[binding_key], 'Panel input manifest mismatch')
        packets = {}
        for chunk in chunks:
            for target in publisher.read_csv(chunk / 'targets.csv', publisher.TARGET_FIELDS):
                wid = target['workId']
                require(wid not in packets, f'Duplicate input work: {wid}')
                packets[wid] = json.loads((chunk / target['packetPath'] / 'packet.json').read_text(encoding='utf-8'))
        backend = publisher._backend_module()
        backend._bind_frozen_registry(input_root, set(packets), backend.ensure_registry(source_registry, set(packets), request['catalogSha256']))
        baseline = backend._baseline_facts(catalog)
    targets = set(packets)
    baseline_meta = backend.ensure_baseline(catalog)
    representatives = {}
    for wid in targets:
        volumes = [r for r in baseline['volumeRows'][wid] if r['isRepresentative'] == 'true']
        require(len(volumes) == 1, f'Representative count mismatch: {wid}')
        representatives[wid] = {**volumes[0], 'catalogCreators': baseline['works'][wid]['creators']}
    before = snapshot(source_registry)
    expected, changes = plan(before, request, representatives, targets, packet_volume_proofs(packets, request, backend))
    original_rows = {r['sourceRowId']: r for r in before['tables']['registry_source_rows']['rows'] if r['canonicalWorkId'] in targets}
    if job_mode:
        columns = before['tables']['registry_source_rows']['columns']
        ordered_original = sorted(original_rows.values(), key=lambda r: int(r['sourceOrdinal']))
        frozen_rows = [{k: str(v) for k, v in r.items()} for r in ordered_original]
    else:
        with (input_root / 'source-registry.csv').open(encoding='utf-8', newline='') as stream:
            reader = csv.DictReader(stream)
            columns, frozen_rows = reader.fieldnames, list(reader)
    require(columns is not None and set(columns) == set(before['tables']['registry_source_rows']['columns']), 'Frozen registry columns mismatch')
    require(len(frozen_rows) == len(original_rows) and {r['sourceRowId'] for r in frozen_rows} == set(original_rows), 'Frozen registry row set mismatch')
    for row in frozen_rows:
        require(row == {k: str(v) for k, v in original_rows[row['sourceRowId']].items()}, f'Frozen registry row mismatch: {row["sourceRowId"]}')
    output_root.mkdir(parents=True)
    for name in ('build_registry_correction.py', 'preflight_registry_correction.py'):
        shutil.copyfile(Path(__file__).resolve(), output_root / name)
    output_db, output_csv = output_root / 'catalog-source-registry.candidate.sqlite', output_root / 'source-registry.csv'
    shutil.copy2(source_registry, output_db)
    with closing(sqlite3.connect(output_db)) as db:
        with db:
            for change in changes:
                field = change['field']  # Already restricted to the explicit allowlist.
                cursor = db.execute(f'update registry_source_rows set "{field}"=? where sourceRowId=? and "{field}"=?', (change['after'], change['sourceRowId'], change['before']))
                require(cursor.rowcount == 1, 'Bounded update did not affect exactly one row')
    proof = preservation(before, snapshot(output_db), expected, changes)
    corrected_rows = {r['sourceRowId']: r for r in expected['tables']['registry_source_rows']['rows']}
    with output_csv.open('x', encoding='utf-8', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=columns, lineterminator='\n')
        writer.writeheader()
        writer.writerows(corrected_rows[r['sourceRowId']] for r in frozen_rows)
    if job_mode:
        _, _, _, corrected_packets, _, registry = job_binding(binding_path, catalog, output_db, digest)
        packets = verify_packet_delta(packets, corrected_packets, expected, request)
    else:
        registry = backend._bind_frozen_registry(input_root, targets, backend.ensure_registry(output_db, targets, request['catalogSha256']), output_csv)
    blocked = []
    for wid in sorted(targets):
        try:
            backend._validate_packet_baseline_binding({wid: packets[wid]}, baseline, registry)
        except backend.PublishError as error:
            blocked.append({'workId': wid, 'error': str(error)})
    verify_sources()
    common = {'sourceRegistrySha256': request['sourceRegistrySha256'], 'correctedRegistrySha256': sha256(output_db), 'baselineSha256': baseline_meta['sha256'], binding_key: digest, 'correctedRegistrySliceSha256': sha256(output_csv)}
    origin = {'bindingMode': 'operator-job', 'jobPath': str(binding_path), 'sourceRegistryRowsSha256': json_sha(ordered_original)} if job_mode else {'inputRoot': str(input_root), 'sourceRegistrySliceSha256': sha256(input_root / 'source-registry.csv')}
    write_json(output_root / 'correction-ledger.json', {'schemaVersion': 'batch010-registry-identity-correction-v1', 'candidateOnly': True, 'reviewedByHuman': False, 'verifiedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'), **common, **origin, 'requestSha256': sha256(changes_path), 'requestCanonicalSha256': json_sha(request), 'request': request, 'changes': changes, 'preservation': proof, 'genericToolSha256': sha256(Path(__file__).resolve()), 'scope': 'Exact requested bibliography fields, URL normalization, and v3 explicitly disproven identity URL removal only. All tables, other fields, work/row/ISBN identities and source files preserved; only a new registry copy was written.'})
    report = {'schemaVersion': 'batch010-registry-correction-preflight-v1', 'status': 'PASS' if not blocked else 'BLOCKED', 'batchId': str(spec['batchId']), 'packetCount': len(targets), 'passedCount': len(targets) - len(blocked), 'blockedCount': len(blocked), 'blocked': blocked, **common, 'preservation': proof, 'bindingEntryPoint': 'publish_authorized_followup._validate_packet_baseline_binding', 'verificationLimit': 'Registry correction/binding only; no Factor publication, canonical, STATE, or runtime mutation.'}
    if job_mode:
        report['bindingMode'] = 'operator-job'
    write_json(output_root / 'preflight-report.json', report)
    require({p.name for p in output_root.iterdir()} == MEMBERS, 'Unexpected output membership')
    with (output_root / 'MANIFEST.sha256').open('x', encoding='ascii', newline='\n') as stream:
        stream.write(''.join(f'{sha256(output_root / name)}  {name}\n' for name in sorted(MEMBERS)))
    publisher.verify_manifest(output_root, output_root / 'MANIFEST.sha256', MEMBERS)
    if not blocked:
        require(verify_correction(output_root, source_registry, catalog) == output_db, 'Independent correction readback failed')
    verify_sources()
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-registry', type=Path, required=True)
    parser.add_argument('--catalog', type=Path, required=True)
    binding = parser.add_mutually_exclusive_group()
    binding.add_argument('--input-root', type=Path)
    binding.add_argument('--job', type=Path)
    binding.add_argument('--legacy-source-root', type=Path, help='Explicit legacy import mode; four hash-bound original provenance CSVs, no job or panel substitution')
    parser.add_argument('--changes', type=Path)
    parser.add_argument('--output-root', type=Path, required=True)
    parser.add_argument('--verify-only', action='store_true', help='Read-only verification of the original sealed correction; no new input required')
    args = parser.parse_args()
    if not args.verify_only:
        repository = next(parent for parent in Path(__file__).resolve().parents if (parent / 'scripts/catalog_workspace.py').is_file())
        sys.path.insert(0, str(repository / 'scripts'))
        from catalog_workspace import record_arguments
        recorded = record_arguments(Path(__file__), args)
        if recorded is not None:
            raise SystemExit(recorded)
    if args.verify_only:
        verified = verify_correction(args.output_root, args.source_registry, args.catalog)
        print(json.dumps({'status': 'PASS', 'correctedRegistry': str(verified), 'correctedRegistrySha256': sha256(verified)}))
        return
    if args.legacy_source_root is not None:
        require(args.changes is not None, 'Legacy import requires --changes')
        print(json.dumps(import_legacy(args.source_registry, args.catalog, args.legacy_source_root, args.changes, args.output_root), ensure_ascii=False, separators=(',', ':')))
        return
    if args.changes is not None and json.loads(args.changes.read_text(encoding='utf-8')).get('schemaVersion') == ORICON_REQUEST:
        require(args.input_root is None and args.job is None, 'Oricon source replay does not use a Factor job or panel')
        print(json.dumps(correct_oricon(args.source_registry, args.catalog, args.changes, args.output_root), ensure_ascii=False, separators=(',', ':')))
        return
    if args.changes is not None and json.loads(args.changes.read_text(encoding='utf-8')).get('schemaVersion') == DISCOVERY_REQUEST:
        require(args.input_root is None and args.job is None, 'Source discovery ingestion does not use a Factor job or panel')
        print(json.dumps(ingest_discoveries(args.source_registry, args.catalog, args.changes, args.output_root), ensure_ascii=False, separators=(',', ':')))
        return
    if args.changes is not None and json.loads(args.changes.read_text(encoding='utf-8')).get('schemaVersion') == IDENTITY_MAPPING_REQUEST:
        require(args.input_root is None and args.job is None, 'Identity mapping correction does not use a Factor job or panel')
        print(json.dumps(correct_identity_mapping(args.source_registry, args.catalog, args.changes, args.output_root), ensure_ascii=False, separators=(',', ':')))
        return
    require((args.input_root is not None or args.job is not None) and args.changes is not None, 'Choose --input-root or --job and provide --changes to create a correction')
    report = correct(args.source_registry, args.catalog, args.input_root, args.changes, args.output_root, job=args.job)
    print(json.dumps(report, ensure_ascii=False, separators=(',', ':')))
    if report['status'] != 'PASS':
        raise SystemExit(1)


if __name__ == '__main__':
    main()
