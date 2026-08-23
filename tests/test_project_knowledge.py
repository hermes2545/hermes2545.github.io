import unittest
from pathlib import Path

from scripts.verify_project_knowledge import validate_project_knowledge

ROOT = Path(__file__).resolve().parents[1]


class ProjectKnowledgeTests(unittest.TestCase):
    def test_wiki_schema_index_and_registry_are_consistent(self):
        errors = validate_project_knowledge(ROOT)
        self.assertEqual(errors, [], "\n".join(errors))

    def test_private_project_registry_is_not_a_public_catalog(self):
        self.assertTrue((ROOT / ".hermes" / "project-links.json").is_file())
        self.assertTrue((ROOT / ".hermes" / "document-registry.json").is_file())


if __name__ == "__main__":
    unittest.main()
