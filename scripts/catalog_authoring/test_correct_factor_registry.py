import copy
from contextlib import ExitStack, closing, redirect_stdout
import io
import json
import sqlite3
import tempfile
from types import SimpleNamespace
import unittest
from pathlib import Path, PureWindowsPath
from unittest.mock import patch

import correct_factor_registry as correction
import publish_factor_batch as publisher


def write_json(path, value):
    path.write_bytes((json.dumps(value, ensure_ascii=False) + '\n').encode('utf-8'))


def support_inputs(root):
    """Use actual collection bytes and hashes; no capture or binding mocks."""
    collection = root / 'collection'
    collection.mkdir()
    work_id = 'work-aaaaaaaaaaaaaaaaaaaa'
    old_urls = ['https://awards.example.test/archive', 'https://awards.example.test/2026']
    url = 'https://awards.example.test/2026/selected-work'
    observation = 'The official selection page names the same Work in the 2026 selection.'
    raw = collection / 'capture-selection.body'
    raw.write_bytes(f'<h1>2026 selection</h1><p>作品A</p><a href="{url}">作品A</a>'.encode('utf-8'))
    receipt = collection / 'capture-selection.json'
    write_json(receipt, {
        'kind': 'http-body', 'url': url, 'resolvedUrl': url, 'status': 200,
        'complete': True, 'error': None, 'rawPath': raw.name,
        'sha256': correction.sha256(raw), 'bytes': raw.stat().st_size,
    })
    session = collection / 'collection-session.json'
    write_json(session, {'workId': work_id})
    record = {
        'workId': work_id, 'status': 'EVIDENCE_FOUND',
        'sources': [{
            'url': url, 'workOwned': True, 'observation': observation,
            'readAudit': {'access': 'full-body', 'coveredSections': ['2026 selection']},
        }],
    }
    research = collection / 'research.jsonl'
    write_json(research, record)
    job_value = {
        'schemaVersion': 'factor-authoring-job-v4',
        'works': [{
            'workId': work_id,
            'researchRef': {'path': 'collection/research.jsonl', 'sha256': correction.sha256(research)},
            'sourceBindings': [{'evidenceId': 'selection-evidence-a', 'sourceUrl': url}],
        }],
    }
    job = root / 'job.json'
    write_json(job, job_value)
    row = {
        'sourceRowId': 'source-a', 'canonicalWorkId': work_id, 'representativeIsbn': '9784063460124',
        'supportEvidenceUrls': ' | '.join(old_urls),
        'sourceIds': 'award-2026', 'sourceFamilies': 'award', 'cohortKeys': '2026-selection',
        'notes': 'Original selection membership remains unchanged.',
    }
    request = {
        'schemaVersion': correction.SUPPORT_REQUEST,
        'sourceRegistrySha256': '0' * 64, 'catalogSha256': '1' * 64, 'jobSha256': correction.sha256(job),
        'changes': [{
            'sourceRowId': row['sourceRowId'],
            'expectedBefore': {'supportEvidenceUrls': row['supportEvidenceUrls']},
            'updates': {'supportEvidenceUrls': ' | '.join([*old_urls, url])},
            'evidenceUrl': url, 'observation': observation,
            'supportEvidence': {
                'researchPath': str(research.resolve()), 'researchSha256': correction.sha256(research),
                'evidenceId': 'selection-evidence-a', 'receiptPath': str(receipt.resolve()),
                'receiptSha256': correction.sha256(receipt),
                **{key: row[key] for key in correction.SELECTION_FIELDS},
            },
        }],
    }
    return {
        'job': job, 'job_value': job_value, 'record': record, 'research': research,
        'raw': raw, 'receipt': receipt, 'session': session, 'row': row, 'request': request,
        'before': {'tables': {'registry_source_rows': {'rows': [row]}}},
        'representatives': {work_id: {'isbn': row['representativeIsbn']}}, 'targets': {work_id},
    }


def bind_support_inputs(fixture):
    """Rebind changed records so semantic failures cannot pass as stale-SHA failures."""
    write_json(fixture['research'], fixture['record'])
    digest = correction.sha256(fixture['research'])
    fixture['job_value']['works'][0]['researchRef']['sha256'] = digest
    fixture['request']['changes'][0]['supportEvidence']['researchSha256'] = digest
    write_json(fixture['job'], fixture['job_value'])
    fixture['request']['jobSha256'] = correction.sha256(fixture['job'])


class SupportEvidenceCorrectionTest(unittest.TestCase):
    def test_restored_windows_research_reference_binds_job_capture_and_support(self):
        import prepare_factor_batch as prepare
        from workspace_paths import artifact_path
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            fixture = support_inputs(root)
            origin = PureWindowsPath('C:/Toys/konocomics')
            write_json(root / '.catalog-restore.json', {'schemaVersion': 'catalog-restored-workspace-v1',
                'originalRepositories': [str(origin)]})
            saved = str(origin / 'collection/research.jsonl')
            work = fixture['job_value']['works'][0]
            work['researchRef']['path'] = saved
            fixture['record'].update(schemaVersion='factor-evidence-collector-v1', candidateOnly=True,
                reviewedByHuman=False, paidSourceUsed=False)
            bind_support_inputs(fixture)
            protected = {path: path.read_bytes() for path in (fixture['job'], fixture['research'], fixture['receipt'])}
            with patch.object(prepare, 'artifact_path', side_effect=lambda value: artifact_path(value, root)), \
                    patch.object(correction, 'artifact_path', side_effect=lambda value: artifact_path(value, root)):
                raw = {key: [] for key in prepare.WORK_KEYS - {'research', 'supplementalEvidence'}}
                raw.update(work, title='作品A', representativeIsbn=fixture['row']['representativeIsbn'], sourceBindings=[])
                bindings = {}
                expanded = prepare.expand_compact_job({'schemaVersion': 'factor-authoring-job-v3',
                    'works': [raw]}, fixture['job'].parent, bindings)
                self.assertEqual(expanded['works'][0]['research']['workId'], work['workId'])
                self.assertEqual(bindings[fixture['research']], work['researchRef']['sha256'])
                captured = prepare.capture_bindings(fixture['job'])
                self.assertEqual(captured[0]['researchBindings'], {str(fixture['research']): work['researchRef']['sha256']})
                self.assertEqual(correction.support_additions(fixture['job'], fixture['request'], fixture['before']), {'source-a'})
                self.assertEqual(prepare.job_reference(root / 'jobs', '../collection/research.jsonl').resolve(), fixture['research'])
            self.assertEqual({path: path.read_bytes() for path in protected}, protected)

    def test_support_proof_rejects_relative_research_and_receipt_paths(self):
        for field, relative in (
            ('researchPath', 'collection/research.jsonl'),
            ('receiptPath', 'collection/capture-selection.json'),
        ):
            with self.subTest(field=field), tempfile.TemporaryDirectory() as directory:
                fixture = support_inputs(Path(directory))
                fixture['request']['changes'][0]['supportEvidence'][field] = relative
                with self.assertRaisesRegex(ValueError, 'Support evidence paths must be absolute'):
                    correction.validate_request(fixture['request'])

    def test_v5_appends_one_bound_same_origin_source_and_preserves_selection(self):
        with tempfile.TemporaryDirectory() as directory:
            fixture = support_inputs(Path(directory))
            before = copy.deepcopy(fixture['before'])
            request = correction.validate_request(fixture['request'])
            verified = correction.support_additions(fixture['job'], request, fixture['before'])

            after, changes = correction.plan(
                fixture['before'], request, fixture['representatives'], fixture['targets'],
                verified_support=verified,
            )

            expected_row = {**fixture['row'], **request['changes'][0]['updates']}
            self.assertEqual(verified, {'source-a'})
            self.assertEqual(after['tables']['registry_source_rows']['rows'], [expected_row])
            self.assertEqual(fixture['before'], before)
            self.assertEqual(changes, [{
                'sourceRowId': 'source-a', 'workId': fixture['row']['canonicalWorkId'],
                'field': 'supportEvidenceUrls', 'before': fixture['row']['supportEvidenceUrls'],
                'after': expected_row['supportEvidenceUrls'],
            }])

    def test_v5_plan_rejects_support_that_has_not_passed_file_binding(self):
        with tempfile.TemporaryDirectory() as directory:
            fixture = support_inputs(Path(directory))
            with self.assertRaisesRegex(ValueError, 'Support addition was not bound'):
                correction.plan(
                    fixture['before'], correction.validate_request(fixture['request']),
                    fixture['representatives'], fixture['targets'],
                )

    def test_changed_capture_research_receipt_or_job_is_rejected(self):
        for member, message in (
            ('raw', 'raw capture/receipt mismatch'),
            ('research', 'Support research SHA mismatch'),
            ('receipt', 'Support receipt is outside the bound collection or changed'),
            ('job', 'Support job changed during readback'),
        ):
            with self.subTest(member=member), tempfile.TemporaryDirectory() as directory:
                fixture = support_inputs(Path(directory))
                path = fixture[member]
                path.write_bytes(path.read_bytes() + b'\n')
                with self.assertRaisesRegex(ValueError, message):
                    correction.support_additions(fixture['job'], fixture['request'], fixture['before'])

    def test_another_work_research_session_or_evidence_cannot_authorize_support(self):
        for member, message in (
            ('research', 'Support research Work/status mismatch'),
            ('session', 'Support collection belongs to another Work'),
            ('evidence', 'Support evidence ID is not bound to the same Work'),
            ('job', 'Support evidence Work is outside job'),
        ):
            with self.subTest(member=member), tempfile.TemporaryDirectory() as directory:
                fixture = support_inputs(Path(directory))
                other_work = 'work-bbbbbbbbbbbbbbbbbbbb'
                if member == 'research':
                    fixture['record']['workId'] = other_work
                elif member == 'session':
                    write_json(fixture['session'], {'workId': other_work})
                elif member == 'evidence':
                    bindings = fixture['job_value']['works'][0]['sourceBindings']
                    fixture['job_value']['works'][0]['sourceBindings'] = []
                    fixture['job_value']['works'].append({'workId': other_work, 'sourceBindings': bindings})
                else:
                    fixture['job_value']['works'][0]['workId'] = other_work
                bind_support_inputs(fixture)
                with self.assertRaisesRegex(ValueError, message):
                    correction.support_additions(fixture['job'], fixture['request'], fixture['before'])

    def test_selection_metadata_and_source_observation_must_match(self):
        for member in ('sourceIds', 'sourceFamilies', 'cohortKeys', 'notes', 'observation', 'workOwned', 'readAudit'):
            with self.subTest(member=member), tempfile.TemporaryDirectory() as directory:
                fixture = support_inputs(Path(directory))
                if member in correction.SELECTION_FIELDS:
                    fixture['request']['changes'][0]['supportEvidence'][member] += '-different-selection'
                    message = 'Support selection metadata changed'
                else:
                    source = fixture['record']['sources'][0]
                    source[member] = {
                        'observation': 'A different selection is described.',
                        'workOwned': False,
                        'readAudit': {'access': 'full-body', 'coveredSections': []},
                    }[member]
                    message = 'lacks the bound official source observation'
                bind_support_inputs(fixture)
                with self.assertRaisesRegex(ValueError, message):
                    correction.support_additions(fixture['job'], fixture['request'], fixture['before'])

    def test_http_receipt_requires_successful_complete_same_origin_response(self):
        for update in (
            {'status': 404}, {'complete': False}, {'error': 'connection interrupted'},
            {'kind': 'web-tool-response'},
            {'url': 'https://awards.example.test/different-page'},
            {'resolvedUrl': 'https://unrelated.example.test/selection'},
        ):
            with self.subTest(update=update), tempfile.TemporaryDirectory() as directory:
                fixture = support_inputs(Path(directory))
                receipt = json.loads(fixture['receipt'].read_text(encoding='utf-8'))
                write_json(fixture['receipt'], {**receipt, **update})
                fixture['request']['changes'][0]['supportEvidence']['receiptSha256'] = correction.sha256(fixture['receipt'])
                with self.assertRaisesRegex(ValueError, 'HTTP receipt does not bind the official source'):
                    correction.support_additions(fixture['job'], fixture['request'], fixture['before'])

    def test_support_cannot_replace_reorder_add_two_urls_or_change_origin(self):
        for operation in ('replace', 'reorder', 'two-additions', 'other-origin'):
            with self.subTest(operation=operation), tempfile.TemporaryDirectory() as directory:
                fixture = support_inputs(Path(directory))
                request = fixture['request']
                change = request['changes'][0]
                if operation == 'other-origin':
                    url = 'https://unrelated.example.test/selection'
                    change['evidenceUrl'] = url
                    fixture['record']['sources'][0]['url'] = url
                    fixture['job_value']['works'][0]['sourceBindings'][0]['sourceUrl'] = url
                    receipt = json.loads(fixture['receipt'].read_text(encoding='utf-8'))
                    write_json(fixture['receipt'], {**receipt, 'url': url, 'resolvedUrl': url})
                    change['supportEvidence']['receiptSha256'] = correction.sha256(fixture['receipt'])
                    bind_support_inputs(fixture)
                verified = correction.support_additions(fixture['job'], request, fixture['before'])
                old_urls = correction.url_members(fixture['row']['supportEvidenceUrls'])
                proposed = {
                    'replace': [old_urls[0], change['evidenceUrl']],
                    'reorder': [*reversed(old_urls), change['evidenceUrl']],
                    'two-additions': [*old_urls, change['evidenceUrl'], 'https://awards.example.test/extra'],
                    'other-origin': [*old_urls, change['evidenceUrl']],
                }[operation]
                change['updates']['supportEvidenceUrls'] = ' | '.join(proposed)
                message = 'same source origin' if operation == 'other-origin' else 'preserve old URLs and append exactly'
                with self.assertRaisesRegex(ValueError, message):
                    correction.plan(
                        fixture['before'], correction.validate_request(request),
                        fixture['representatives'], fixture['targets'], verified_support=verified,
                    )

    def test_v2_does_not_gain_permission_to_add_support_urls(self):
        with tempfile.TemporaryDirectory() as directory:
            fixture = support_inputs(Path(directory))
            request = fixture['request']
            request['schemaVersion'] = 'factor-registry-correction-request-v2'
            del request['changes'][0]['supportEvidence']
            request = correction.validate_request(request)
            self.assertEqual(correction.support_additions(fixture['job'], request, fixture['before']), set())
            with self.assertRaisesRegex(ValueError, 'URL membership/order changed'):
                correction.plan(fixture['before'], request, fixture['representatives'], fixture['targets'])


class SharedRegistryCorrectionTest(unittest.TestCase):
    def test_validate_only_rebases_corrected_frozen_registry_without_changing_current_pair(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            baseline, corrected, _, changes = self.shared_inputs(root)
            baseline.parent.mkdir()
            baseline.write_bytes(b"Immutable retained baseline")
            current = baseline.parent / 'catalog-source-registry.candidate.sqlite'
            with closing(sqlite3.connect(current)) as db, db:
                db.execute('create table registry_meta(key text primary key,value text)')
                db.execute('create table registry_research_attempts(attemptId text primary key)')
                db.execute('create table registry_source_rows(sourceRowId text primary key,canonicalWorkId text,supportEvidenceUrls text)')
                for change in changes:
                    db.execute('insert into registry_source_rows values(?,?,?)',
                               (change['sourceRowId'], change['workId'], change['before']))
            protected = {path: path.read_bytes() for path in (baseline, current, corrected.parent / 'correction-ledger.json')}
            input_root = root / 'input'
            input_root.mkdir()
            write_json(input_root / 'panel-input.json', {'batchId': 'requested', 'registrySha256': 'frozen'})
            projected = []
            def preflight(*args):
                registry = args[3]
                self.assertNotEqual(registry, current)
                with closing(sqlite3.connect(registry)) as db:
                    rows = db.execute('select supportEvidenceUrls from registry_source_rows order by sourceRowId').fetchall()
                self.assertEqual(rows, [(changes[0]['after'],), (changes[1]['before'],)])
                projected.append(registry)
                return {'panelResult': {}}, None
            with ExitStack() as stack, redirect_stdout(io.StringIO()):
                from workspace_paths import artifact_path
                stack.enter_context(patch.object(publisher, 'artifact_path', side_effect=lambda value: artifact_path(value, root)))
                replacements = {
                    'validate_input': (None, [input_root], None), 'read_csv': [{'workId': 'work-a'}],
                    '_validate_axis_corrections': {}, '_validate_fresh_unreviewed_snapshots': {},
                    '_load_conflict_adjudication': ({}, None), '_verify_current_input_identities': (None, None),
                    '_publication_safety': {'validation': {}, 'artifactDigest': 'safety'},
                    '_backend_module': SimpleNamespace(preflight=preflight),
                }
                for name, value in replacements.items():
                    stack.enter_context(patch.object(publisher, name, return_value=value))
                stack.enter_context(patch.object(publisher.panel_validation, 'load_prior_authority', return_value={'evidence': {}}))
                stack.enter_context(patch.object(publisher.factor_recovery, 'validate_publish', return_value=None))
                stack.enter_context(patch.object(correction, 'verify_correction', return_value=corrected))
                import factor_single_pass
                stack.enter_context(patch.object(factor_single_pass, 'install_backend'))
                self.assertEqual(publisher.main(['--validate-only', '--input-root', str(input_root),
                    '--panel-output-root', str(root / 'result'), '--previous-catalog', str(baseline),
                    '--previous-registry', str(current), '--frozen-registry', str(corrected),
                    '--safety-root', str(root / 'safety'), '--output-root', str(root / 'unused')]), 0)
            self.assertEqual({path: path.read_bytes() for path in protected}, protected)
            self.assertEqual(len(projected), 1)
            self.assertFalse(projected[0].exists())

    def shared_inputs(self, root):
        baseline = root / 'frozen' / 'catalog.candidate.sqlite'
        corrected = root / 'correction' / 'catalog-source-registry.candidate.sqlite'
        corrected.parent.mkdir()
        rows = [{
            'sourceRowId': f'source-{suffix}', 'canonicalWorkId': f'work-{suffix}',
            'supportEvidenceUrls': f'https://awards.example.test/{suffix}/archive',
        } for suffix in ('a', 'b')]
        changes = [{
            'sourceRowId': row['sourceRowId'], 'workId': row['canonicalWorkId'],
            'field': 'supportEvidenceUrls', 'before': row['supportEvidenceUrls'],
            'after': row['supportEvidenceUrls'] + f' | https://awards.example.test/{index}/selection',
        } for index, row in enumerate(rows)]
        write_json(corrected.parent / 'correction-ledger.json', {'changes': changes})
        return baseline, corrected, {'tables': {'registry_source_rows': {'rows': rows}}}, changes

    def test_shared_full_ledger_is_verified_then_applied_only_to_target_work(self):
        with tempfile.TemporaryDirectory() as directory:
            baseline, corrected, before, changes = self.shared_inputs(Path(directory))
            original = copy.deepcopy(before)
            with patch.object(correction, 'verify_correction', return_value=corrected) as verify:
                selected = publisher.registry_correction_changes(baseline, corrected, {'work-a'})
                verify.assert_called_once_with(
                    corrected.parent, baseline.parent / 'catalog-source-registry.candidate.sqlite', baseline,
                )

            after, pending = publisher.plan_registry_correction(selected, before)

            self.assertEqual(selected, changes[:1])
            self.assertEqual(pending, changes[:1])
            self.assertEqual(after['tables']['registry_source_rows']['rows'], [
                {**before['tables']['registry_source_rows']['rows'][0], 'supportEvidenceUrls': changes[0]['after']},
                before['tables']['registry_source_rows']['rows'][1],
            ])
            self.assertEqual(before, original)

            with patch.object(correction, 'verify_correction', return_value=corrected) as verify:
                next_work = publisher.registry_correction_changes(baseline, corrected, {'work-b'})
                verify.assert_called_once_with(
                    corrected.parent, baseline.parent / 'catalog-source-registry.candidate.sqlite', baseline,
                )
            completed, next_pending = publisher.plan_registry_correction(next_work, after)
            self.assertEqual(next_pending, changes[1:])
            self.assertEqual(completed['tables']['registry_source_rows']['rows'], [
                after['tables']['registry_source_rows']['rows'][0],
                {**before['tables']['registry_source_rows']['rows'][1], 'supportEvidenceUrls': changes[1]['after']},
            ])
            resumed, retry_pending = publisher.plan_registry_correction(selected, completed)
            self.assertEqual(retry_pending, [])
            self.assertEqual(resumed, completed)

    def test_other_work_only_ledger_still_requires_full_verification(self):
        with tempfile.TemporaryDirectory() as directory:
            baseline, corrected, _, _ = self.shared_inputs(Path(directory))
            with patch.object(correction, 'verify_correction', return_value=corrected) as verify:
                self.assertEqual(publisher.registry_correction_changes(baseline, corrected, {'work-c'}), [])
                verify.assert_called_once_with(
                    corrected.parent, baseline.parent / 'catalog-source-registry.candidate.sqlite', baseline,
                )

    def test_full_verification_failure_cannot_be_bypassed_by_work_subset(self):
        with tempfile.TemporaryDirectory() as directory:
            baseline, corrected, _, _ = self.shared_inputs(Path(directory))
            with patch.object(correction, 'verify_correction', side_effect=ValueError('full correction is invalid')) as verify:
                with self.assertRaisesRegex(ValueError, 'full correction is invalid'):
                    publisher.registry_correction_changes(baseline, corrected, {'work-a'})
                verify.assert_called_once_with(
                    corrected.parent, baseline.parent / 'catalog-source-registry.candidate.sqlite', baseline,
                )

    def test_malformed_unrelated_change_is_never_hidden_by_work_filter(self):
        for defect in ('missing-field', 'extra-field', 'non-string-value', 'non-object'):
            with self.subTest(defect=defect), tempfile.TemporaryDirectory() as directory:
                baseline, corrected, _, changes = self.shared_inputs(Path(directory))
                if defect == 'missing-field':
                    del changes[1]['after']
                elif defect == 'extra-field':
                    changes[1]['unexpected'] = 'not allowed'
                elif defect == 'non-string-value':
                    changes[1]['after'] = None
                else:
                    changes[1] = ['not a change object']
                write_json(corrected.parent / 'correction-ledger.json', {'changes': changes})
                with patch.object(correction, 'verify_correction', return_value=corrected) as verify:
                    with self.assertRaisesRegex(ValueError, 'malformed change'):
                        publisher.registry_correction_changes(baseline, corrected, {'work-a'})
                    verify.assert_called_once_with(
                        corrected.parent, baseline.parent / 'catalog-source-registry.candidate.sqlite', baseline,
                    )


class ResolvedIdentityMappingCorrectionTest(unittest.TestCase):
    def test_restores_proven_wrong_resolved_mapping_without_changing_source_provenance(self):
        row = {
            'sourceRowId': 'source-red', 'rawTitle': 'RED', 'rawCreator': '山本直樹',
            'candidateOnly': 'true', 'reviewedByHuman': 'false',
            'sourceIds': 'mangataisho-2010', 'supportEvidenceUrls': 'https://example.com/2010',
            'canonicalWorkId': 'work-red', 'canonicalTitleJa': 'RED', 'canonicalCreatorsJa': '村枝賢一',
            'existingCatalogWorkId': 'work-red', 'identityEvidenceUrls': 'https://example.com/book',
            'representativeIsbn': '9784063460124', 'terminalStatus': 'MAPPED_EXISTING_CATALOG', 'blocker': '',
            'identityResearchAttemptId': 'attempt-red',
        }
        attempt = {
            'attemptId': 'attempt-red', 'sourceRowId': 'source-red', 'rawTitle': 'RED', 'rawCreator': '山本直樹',
            'originalTerminalStatus': 'UNRESOLVED_IDENTITY', 'sourceItemIds': 'mangataisho-2010-166',
            'attemptedUrls': 'https://example.com/2010', 'matchOutcome': 'RESOLVED_TO_EXISTING_OR_V3_CANDIDATE',
            'matchBasis': 'rakuten-isbn+title+creator', 'resolvedWorkId': 'work-red', 'mismatchReason': '',
            'finalTerminalStatus': 'MAPPED_EXISTING_CATALOG',
        }
        before = {'tables': {'registry_source_rows': {'rows': [row]}, 'registry_research_attempts': {'rows': [attempt]}}}
        updates = {
            'canonicalWorkId': '', 'canonicalTitleJa': 'RED', 'canonicalCreatorsJa': '山本直樹',
            'existingCatalogWorkId': '', 'identityEvidenceUrls': '', 'representativeIsbn': '',
            'terminalStatus': 'UNRESOLVED_IDENTITY', 'blocker': 'IDENTITY_EVIDENCE_REQUIRED',
        }
        request = {
            'schemaVersion': correction.IDENTITY_MAPPING_RESOLVED_REQUEST,
            'sourceRegistrySha256': '0' * 64, 'catalogSha256': '1' * 64,
            'changes': [{
                'sourceRowId': 'source-red', 'rawIdentity': {'rawTitle': 'RED', 'rawCreator': '山本直樹'},
                'actualSourceProof': {'sourceId': 'mangataisho-2010', 'sourceItemId': 'mangataisho-2010-166', 'supportEvidenceUrl': 'https://example.com/2010', 'attemptedUrl': 'https://example.com/2010'},
                'expectedAttempt': copy.deepcopy(attempt),
                'expectedBefore': {key: row[key] for key in correction.IDENTITY_MAPPING_FIELDS},
                'updates': updates,
                'resolvedMismatchProof': {'sourceUrl': 'https://example.com/2010', 'sourceTitle': 'RED', 'sourceCreators': '山本直樹', 'mappedIdentityUrl': 'https://example.com/book', 'mappedTitle': 'RED', 'mappedCreators': '村枝賢一', 'mappedIsbn': '9784063460124', 'observation': 'Same title, different creators.'},
                'observation': 'Restore the raw source row after a same-title creator mismatch.',
            }],
        }

        after, changes = correction.identity_mapping_plan(before, correction.validate_identity_mapping_request(request))

        corrected = after['tables']['registry_source_rows']['rows'][0]
        self.assertEqual({key: corrected[key] for key in updates}, updates)
        self.assertEqual(corrected['supportEvidenceUrls'], 'https://example.com/2010')
        self.assertEqual(before['tables']['registry_source_rows']['rows'][0], row)
        self.assertEqual(len(changes), 7)

        tampered = copy.deepcopy(request)
        tampered['changes'][0]['expectedAttempt']['matchBasis'] = 'title-only'
        with self.assertRaisesRegex(ValueError, 'Preserved research attempt mismatch'):
            correction.identity_mapping_plan(before, correction.validate_identity_mapping_request(tampered))


if __name__ == '__main__':
    unittest.main()
