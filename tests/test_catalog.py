import json
import unittest
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "books.json"


class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.books = json.loads(CATALOG.read_text(encoding="utf-8"))

    def test_catalog_contains_every_distinct_existing_guide(self):
        html_files = {
            str(path.relative_to(ROOT))
            for path in ROOT.rglob("*.html")
            if ".git" not in path.parts
            and "templates" not in path.relative_to(ROOT).parts
            and path.relative_to(ROOT) != Path("index.html")
        }
        catalog_targets = {unquote(urlparse(book["href"]).path) for book in self.books}
        # The root token guide and folder token guide are byte-identical aliases.
        allowed_aliases = {"hermes-token-guide.html"}
        self.assertEqual(html_files - allowed_aliases, catalog_targets)

    def test_required_fields_and_unique_ids_and_links(self):
        required = {"id", "title", "short_title", "href", "cover", "category", "summary", "accent", "order"}
        self.assertTrue(self.books)
        self.assertEqual(len(self.books), 11)
        self.assertEqual(len({book["id"] for book in self.books}), len(self.books))
        self.assertEqual(len({book["href"] for book in self.books}), len(self.books))
        for book in self.books:
            self.assertTrue(required <= book.keys(), book)
            self.assertFalse(book["href"].startswith(("http://", "https://", "/")))
            self.assertRegex(book["accent"], r"^#[0-9A-Fa-f]{6}$")

    def test_targets_and_covers_exist_and_are_nonempty(self):
        for book in self.books:
            target = ROOT / unquote(urlparse(book["href"]).path)
            cover = ROOT / book["cover"]
            self.assertTrue(target.is_file(), target)
            self.assertTrue(cover.is_file(), cover)
            self.assertGreater(cover.stat().st_size, 100, cover)
            self.assertIn(cover.suffix.lower(), {".svg", ".webp", ".png", ".jpg", ".jpeg"})


if __name__ == "__main__":
    unittest.main()
