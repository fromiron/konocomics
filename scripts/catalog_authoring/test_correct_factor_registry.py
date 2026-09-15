import copy
import unittest

import correct_factor_registry as correction


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
