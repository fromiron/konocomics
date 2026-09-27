"""Frozen adjudication survives unrelated canonical growth, never a conflict."""
from contextlib import closing
import csv
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

import canonical_rebase as rebase
import policy_compatibility as compatibility
from catalog_workspace import Workspace

SOURCE_REPO = rebase.REPO


class CanonicalRebaseTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.repo = Path(self.directory.name)
        self.patch = patch.object(rebase, "REPO", self.repo)
        self.patch.start()
        self.addCleanup(self.patch.stop)
        self.catalog = self.repo / rebase.CANONICAL
        self.catalog.parent.mkdir(parents=True)
        with closing(sqlite3.connect(self.catalog)) as db:
            db.executescript("""
                CREATE TABLE source_works(sourceOrdinal integer primary key, sourceLine integer, id text, title text, evidenceId text);
                CREATE TABLE source_volumes(sourceOrdinal integer primary key,workId text,id text,isbn text,isRepresentative text);
                CREATE TABLE source_aliases(sourceOrdinal integer primary key,workId text,alias text);
                CREATE TABLE source_factors(sourceOrdinal integer primary key,workId text,axisId text,value text,evidenceId text);
                CREATE TABLE source_evidence(sourceOrdinal integer primary key,id text,workId text,notes text);
                CREATE TABLE source_recommendation_config(sourceOrdinal integer primary key,catalogAverageRating text);
                INSERT INTO source_works VALUES(1,2,'target','Target','cross'),(2,3,'other','Other','other-e'),(3,4,'gold','Gold','gold-e');
                INSERT INTO source_volumes VALUES(1,'target','volume-target','9780000000002','true'),(2,'other','volume-other','9780000000019','true');
                INSERT INTO source_aliases VALUES(1,'target','Target Alias'),(2,'other','Other Alias');
                INSERT INTO source_factors VALUES(1,'target','pacing','2','target-e'),(2,'other','pacing','4','other-e');
                INSERT INTO source_evidence VALUES(1,'target-e','target','Target prior'),(2,'other-e','other','Other prior'),(3,'gold-e','gold','Gold prior'),(4,'cross','prior-owner','Cross-owned target evidence');
                INSERT INTO source_recommendation_config VALUES(1,'4.2');
            """)
        self.original = self.catalog.read_bytes()
        self.original_sha = rebase.digest(self.original)
        self.workspace = Workspace(self.repo)
        self.workspace.save([self.catalog], "original canonical")
        gold = self.repo / rebase.GOLD
        gold.parent.mkdir(parents=True)
        gold.write_text(json.dumps({"workIds": ["gold"]}), encoding="utf-8")
        policies = {}
        for name, relative in rebase.POLICIES.items():
            path = self.repo / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(name, encoding="utf-8")
            policies[name] = rebase.digest(path.read_bytes())
        self.input = self.repo / "input"
        (self.input / "contracts").mkdir(parents=True)
        for relative in rebase.POLICIES.values():
            (self.input / "contracts" / Path(relative).name).write_bytes((self.repo / relative).read_bytes())
        (self.input / "chunks/chunk-01").mkdir(parents=True)
        with (self.input / "chunks/chunk-01/targets.csv").open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=["workId", "representativeIsbn"])
            writer.writeheader()
            writer.writerow({"workId": "target", "representativeIsbn": "9780000000002"})
        self.panel = {"canonicalSha256": self.original_sha, "targetCount": 1,
                      "goldManifestSha256": rebase.digest(gold.read_bytes()), "policyDigests": policies}
        (self.input / "panel-input.json").write_text(json.dumps(self.panel), encoding="utf-8")
        (self.input / "PANEL-INPUT.sha256").write_text("frozen manifest supplied by caller\n", encoding="utf-8")

    def mutate(self, query, params=()):
        with closing(sqlite3.connect(self.catalog)) as db, db:
            db.execute(query, params)

    def validate(self, sha=None):
        return rebase.validate_rebase(self.input, sha or rebase.digest(self.catalog.read_bytes()), canonical_path=self.catalog)

    def test_unchanged_canonical_needs_no_rebase(self):
        self.assertIsNone(self.validate())

    def test_unrelated_growth_and_ordinal_changes_keep_frozen_identity(self):
        frozen_bytes = (self.input / "panel-input.json").read_bytes()
        self.mutate("UPDATE source_factors SET value='0' WHERE workId='other'")
        self.mutate("INSERT INTO source_aliases VALUES(3,'other','Another unrelated alias')")
        self.mutate("UPDATE source_works SET sourceOrdinal=10,sourceLine=11 WHERE id='target'")
        receipt = self.validate()
        self.assertEqual(receipt["schemaVersion"], rebase.FORMAT)
        self.assertEqual(receipt["originalCanonicalSha256"], self.original_sha)
        self.assertNotEqual(receipt["currentCanonicalSha256"], self.original_sha)
        self.assertEqual(receipt["originalCanonical"]["sha256"], self.original_sha)
        self.assertEqual(receipt["targetIds"], ["target"])
        self.assertEqual((self.input / "panel-input.json").read_bytes(), frozen_bytes)
        self.assertEqual(receipt, self.validate())

    def test_relevant_source_changes_are_rejected(self):
        queries = [
            "UPDATE source_works SET title='Changed' WHERE id='target'",
            "UPDATE source_works SET title='Changed' WHERE id='gold'",
            "UPDATE source_factors SET value='4' WHERE workId='target'",
            "UPDATE source_volumes SET isbn='9780000000026' WHERE workId='target'",
            "UPDATE source_aliases SET alias='Changed' WHERE workId='target'",
            "UPDATE source_evidence SET notes='Changed' WHERE id='target-e'",
            "UPDATE source_evidence SET notes='Changed' WHERE id='cross'",
            "UPDATE source_recommendation_config SET catalogAverageRating='4.9'",
        ]
        for query in queries:
            with self.subTest(query=query):
                self.catalog.write_bytes(self.original)
                self.mutate(query)
                with self.assertRaisesRegex(ValueError, "relevant source changed"):
                    self.validate()

    def test_identity_collision_from_other_work_is_rejected(self):
        for query in (
            "INSERT INTO source_aliases VALUES(3,'other','Target Alias')",
            "UPDATE source_volumes SET isbn='9780000000002' WHERE workId='other'",
            "UPDATE source_volumes SET id='volume-target' WHERE workId='other'",
        ):
            with self.subTest(query=query):
                self.catalog.write_bytes(self.original)
                self.mutate(query)
                with self.assertRaisesRegex(ValueError, "binding changed"):
                    self.validate()

    def test_policy_and_gold_changes_require_new_frozen_input(self):
        self.mutate("UPDATE source_works SET title='Unrelated' WHERE id='other'")
        for relative, message in ((rebase.GOLD, "Gold manifest changed"),
                                  (Path(rebase.POLICIES["factorDictionary"]), "policy changed")):
            path = self.repo / relative
            original = path.read_bytes()
            path.write_bytes(original + b"\nchanged")
            with self.assertRaisesRegex(ValueError, message):
                self.validate()
            path.write_bytes(original)

    def test_schema_and_racing_canonical_are_rejected(self):
        self.mutate("ALTER TABLE source_factors ADD COLUMN newAuthority TEXT")
        with self.assertRaisesRegex(ValueError, "schema changed"):
            self.validate()
        with self.assertRaisesRegex(ValueError, "Canonical changed before"):
            self.validate("0" * 64)

    def test_missing_original_cannot_be_replaced_by_current_baseline(self):
        self.mutate("UPDATE source_works SET title='Unrelated' WHERE id='other'")
        self.workspace.database.unlink()
        with self.assertRaisesRegex(ValueError, "exact retained original"):
            self.validate()
        restored = self.repo / "data/local/catalog-authoring/restored-versions" / self.original_sha
        restored.parent.mkdir(parents=True)
        restored.write_bytes(self.original)
        self.assertEqual(self.validate()["originalCanonical"]["sha256"], self.original_sha)
        restored.write_bytes(self.catalog.read_bytes())
        with self.assertRaisesRegex(ValueError, "exact retained original"):
            self.validate()

    def test_historical_replay_uses_verified_bytes_and_stable_content_receipt(self):
        self.mutate("UPDATE source_works SET title='Unrelated' WHERE id='other'")
        historical = self.catalog.read_bytes()
        receipt = self.validate()
        # The real catalog may have moved further by the time audit replays.
        self.mutate("UPDATE source_factors SET value='4' WHERE workId='target'")
        actual = rebase.validate_rebase(self.input, rebase.digest(historical), canonical_bytes=historical)
        self.assertEqual(actual, receipt)
        with self.assertRaisesRegex(ValueError, "Canonical changed before"):
            rebase.validate_rebase(self.input, rebase.digest(historical), canonical_bytes=self.catalog.read_bytes())
        # Physical restoration does not change the proof's content identity.
        self.workspace.database.unlink()
        restored = self.repo / "data/local/catalog-authoring/restored-versions" / self.original_sha
        restored.parent.mkdir(parents=True)
        restored.write_bytes(self.original)
        self.assertEqual(rebase.validate_rebase(self.input, rebase.digest(historical), canonical_bytes=historical), receipt)

    def test_batch_cache_reads_exact_databases_once_and_does_not_escape_its_scope(self):
        self.mutate("UPDATE source_works SET title='Unrelated' WHERE id='other'")
        sha = rebase.digest(self.catalog.read_bytes())
        opened = []
        database = rebase._database
        def record_database(*args):
            connection = database(*args)
            opened.append(connection)
            return connection
        with patch.object(rebase, "_saved_original", wraps=rebase._saved_original) as recover, \
                patch.object(rebase, "_database", side_effect=record_database), \
                patch.object(rebase, "_schema", wraps=rebase._schema) as schema:
            with rebase.validation_cache():
                first = self.validate(sha)
                for _ in range(49):
                    self.assertEqual(self.validate(sha), first)
                self.assertEqual(recover.call_count, 1)
                self.assertEqual(len(opened), 2)
                self.assertEqual(schema.call_count, 2)
                with self.assertRaises(sqlite3.OperationalError):
                    opened[0].execute("DELETE FROM source_works")
            for connection in opened:
                with self.assertRaises(sqlite3.ProgrammingError):
                    connection.execute("SELECT 1")
        # A later batch must actually reread, even for the same caller SHA.
        self.mutate("UPDATE source_works SET title='Moved again' WHERE id='other'")
        with self.assertRaisesRegex(ValueError, "Canonical changed before"):
            self.validate(sha)

    def test_batch_cache_does_not_accept_different_bytes_under_a_cached_hash(self):
        self.mutate("UPDATE source_works SET title='Unrelated' WHERE id='other'")
        body = self.catalog.read_bytes()
        with rebase.validation_cache():
            rebase.validate_rebase(self.input, rebase.digest(body), canonical_bytes=body)
            with self.assertRaisesRegex(ValueError, "Canonical changed before"):
                rebase.validate_rebase(self.input, rebase.digest(body), canonical_bytes=self.original)

    def real_policies(self, publication_additions=None):
        """Use the reviewed policy clauses, with all earlier core rules intact."""
        documents = {}
        for name, relative in rebase.POLICIES.items():
            text = (SOURCE_REPO / relative).read_text(encoding="utf-8")
            frozen = text
            current = text
            for rule in compatibility.APPROVED_ADDITIONS:
                if rule["policy"] != name:
                    continue
                self.assertIn(rule["text"], text)
                frozen = frozen.replace(rule["text"] + "\n", "")
                if publication_additions is not None and rule["id"] not in publication_additions:
                    current = current.replace(rule["text"] + "\n", "")
            frozen_bytes, current_bytes = frozen.encode("utf-8"), current.encode("utf-8")
            (self.input / "contracts" / Path(relative).name).write_bytes(frozen_bytes)
            (self.repo / relative).write_bytes(current_bytes)
            self.panel["policyDigests"][name] = rebase.digest(frozen_bytes)
            documents[name] = current_bytes
        (self.input / "panel-input.json").write_text(json.dumps(self.panel), encoding="utf-8")
        return documents

    def test_approved_additions_produce_separate_proof_without_retroactive_exception(self):
        import coverage_exception as nt
        self.real_policies()
        frozen_bytes = (self.input / "panel-input.json").read_bytes()
        proof = self.validate()  # Policy checking also applies to unchanged canonical.
        self.assertEqual(proof["policyDigests"], self.panel["policyDigests"])
        self.assertEqual({item["policy"] for item in proof["policyCompatibility"]},
                         {"authorizedEvidencePanel", "authoringAuthority"})
        self.assertTrue(all(item["newCapabilitiesGranted"] == [] for item in proof["policyCompatibility"]))
        self.assertEqual((self.input / "panel-input.json").read_bytes(), frozen_bytes)
        job = {"schemaVersion": "factor-authoring-observations-v1", "works": []}
        (self.input / "authoring-job.json").write_text(json.dumps(job) + "\n", encoding="utf-8", newline="\n")
        self.assertEqual(nt.from_input(self.input), {})
        self.assertEqual(nt.filter_blockers(sorted(nt.NT_BLOCKERS), None), sorted(nt.NT_BLOCKERS))
        url = "https://example.test/source"
        record = {"policy": nt.POLICY, "workId": "target", "representativeIsbn": "9780000000002",
                  "attempts": [{"sourceUrl": url, "gap": "tone", "outcome": "insufficient",
                                "observation": "No observed tone in this test source"}], "stopReason": "No further source"}
        job["works"] = [{"workId": "target", "representativeIsbn": record["representativeIsbn"],
                         "research": {"sources": [{"url": url}]}, "narrativeToneExhaustion": record}]
        (self.input / "authoring-job.json").write_text(json.dumps(job) + "\n", encoding="utf-8", newline="\n")
        (self.input / "panel-input.json").write_text(json.dumps({**self.panel, "schemaVersion": "authorized-evidence-panel-followup-v3"}) + "\n", encoding="utf-8", newline="\n")
        with self.assertRaisesRegex(ValueError, "absent from frozen policy"):
            nt.from_input(self.input)

    def test_unknown_policy_edits_removed_or_moved_amendments_are_rejected(self):
        documents = self.real_policies()
        path = self.repo / rebase.POLICIES["authorizedEvidencePanel"]
        original = documents["authorizedEvidencePanel"].decode("utf-8")
        rule = next(item for item in compatibility.APPROVED_ADDITIONS if item["id"] == "aep-nt-exhaustion-20260923")
        for changed in (original.replace("known 4개 이상", "known 1개 이상"),
                        original + "\n\nNew exception: all unsupported decisions may pass.\n",
                        original.replace("Gold 인증을 부여하지 않는다.", "Gold 인증을 부여한다."),
                        original.replace(rule["text"], "") + "\n\n" + rule["text"]):
            with self.subTest(changed=changed[-80:]):
                path.write_text(changed, encoding="utf-8")
                with self.assertRaises(ValueError):
                    self.validate()
        path.write_bytes(documents["authorizedEvidencePanel"])
        # A previously frozen amendment cannot be removed by compatibility.
        frozen_path = self.input / "contracts" / path.name
        frozen_path.write_bytes(documents["authorizedEvidencePanel"])
        self.panel["policyDigests"]["authorizedEvidencePanel"] = rebase.digest(frozen_path.read_bytes())
        (self.input / "panel-input.json").write_text(json.dumps(self.panel), encoding="utf-8")
        path.write_text(original.replace(rule["text"], ""), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "policy changed"):
            self.validate()

    def test_policy_cache_rechecks_frozen_and_current_bytes(self):
        self.real_policies()
        current = self.repo / rebase.POLICIES["factorDictionary"]
        frozen = self.input / "contracts" / current.name
        with rebase.validation_cache():
            self.validate()
            before = current.read_bytes()
            current.write_bytes(before + b"\nUnapproved new meaning")
            with self.assertRaisesRegex(ValueError, "policy changed"):
                self.validate()
            current.write_bytes(before)
            frozen.write_bytes(frozen.read_bytes() + b"\nTampered frozen bytes")
            with self.assertRaisesRegex(ValueError, "frozen policy digest mismatch"):
                self.validate()

    def test_markdown_table_layout_does_not_waive_cell_or_alignment_changes(self):
        frozen = b"Rules\n\n| Criterion | Minimum |\n| --- | ---: |\n| Tone | 5 |\n"
        padded = b"Rules\n\n| Criterion    | Minimum       |\n| ------------ | ------------: |\n| Tone         | 5             |\n"
        proof = compatibility.prove_compatibility("annotationGuide", frozen, padded)
        self.assertEqual(proof["approvedAdditions"], [])
        for changed in (padded.replace(b"| 5 ", b"| 1 "), padded.replace(b"------------:", b":------------")):
            with self.assertRaisesRegex(ValueError, "policy changed"):
                compatibility.prove_compatibility("annotationGuide", frozen, changed)

    def test_fenced_policy_examples_preserve_layout_as_content(self):
        for fence in (b"```", b"~~~~"):
            frozen = b"Rules\n\n" + fence + b"text\nexact\n\n\nspacing\n| Key | Value |\n| --- | --- |\n| a | 4 |\n" + fence + b"\n"
            for changed in (frozen.replace(b"exact\n\n\nspacing", b"exact\n\nspacing"),
                            frozen.replace(b"| a | 4 |", b"| a     | 4 |")):
                with self.assertRaisesRegex(ValueError, "policy changed"):
                    compatibility.prove_compatibility("annotationGuide", frozen, changed)

    def test_compact_policy_sources_keep_historical_proof_stable_after_docs_advance(self):
        import compact_publication as compact
        published = self.real_policies({"aep-retention-20260926", "authority-workspace-v4-20260926"})
        self.mutate("UPDATE source_works SET title='Unrelated' WHERE id='other'")
        expected = self.validate()
        self.workspace.save([self.repo / path for path in rebase.POLICIES.values()], "publication policies")
        with patch.object(compact, "REPO", self.repo):
            sources = {"policy-" + name: compact.stored_reference(self.repo / relative)
                       for name, relative in rebase.POLICIES.items()}
            current = self.real_policies()  # Another approved additive transition.
            self.assertNotEqual(self.validate(), expected)
            archived = compact.publication_policies(sources)
            self.assertEqual(archived, published)
            self.assertEqual(rebase.validate_rebase(self.input, rebase.digest(self.catalog.read_bytes()),
                             canonical_path=self.catalog, policy_documents=archived), expected)
            path = self.repo / rebase.POLICIES["factorDictionary"]
            path.write_bytes(current["factorDictionary"] + b"\nUnapproved new policy")
            with self.assertRaisesRegex(ValueError, "policy changed"):
                self.validate()  # New publication still checks actual current docs.
            self.assertEqual(rebase.validate_rebase(self.input, rebase.digest(self.catalog.read_bytes()),
                             canonical_path=self.catalog, policy_documents=archived), expected)
            with self.assertRaisesRegex(ValueError, "incomplete"):
                compact.publication_policies({key: value for key, value in sources.items() if key != "policy-factorDictionary"})
            sources["policy-factorDictionary"]["sha256"] = "0" * 64
            with self.assertRaises(ValueError):
                compact.publication_policies(sources)


if __name__ == "__main__":
    unittest.main()
