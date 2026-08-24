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
            and path.relative_to(ROOT) not in {Path("index.html"), Path("audio-library.html")}
        }
        catalog_targets = {unquote(urlparse(book["href"]).path) for book in self.books}
        # The root token guide and folder token guide are byte-identical aliases.
        allowed_aliases = {"hermes-token-guide.html"}
        self.assertEqual(html_files - allowed_aliases, catalog_targets)

    def test_required_fields_and_unique_ids_and_links(self):
        required = {"id", "title", "short_title", "href", "cover", "category", "summary", "accent", "published_at"}
        self.assertTrue(self.books)
        self.assertEqual(len(self.books), 15)
        self.assertEqual(len({book["id"] for book in self.books}), len(self.books))
        self.assertEqual(len({book["href"] for book in self.books}), len(self.books))
        for book in self.books:
            self.assertTrue(required <= book.keys(), book)
            self.assertFalse(book["href"].startswith(("http://", "https://", "/")))
            self.assertRegex(book["accent"], r"^#[0-9A-Fa-f]{6}$")
            self.assertRegex(book["published_at"], r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$")

    def test_every_reading_book_uses_an_approved_custom_cover(self):
        self.assertEqual(len(self.books), 15)
        for book in self.books:
            self.assertEqual(book["cover"], f'assets/covers/custom/{book["id"]}.webp')
            self.assertEqual(Path(book["cover"]).suffix, ".webp")
        self.assertTrue((ROOT / "templates" / "reading-cover-designs.template.html").is_file())
        self.assertTrue((ROOT / "templates" / "mega-prompt-business-book-cover.template.html").is_file())

    def test_targets_and_covers_exist_and_are_nonempty(self):
        for book in self.books:
            target = ROOT / unquote(urlparse(book["href"]).path)
            cover = ROOT / book["cover"]
            self.assertTrue(target.is_file(), target)
            self.assertTrue(cover.is_file(), cover)
            self.assertGreater(cover.stat().st_size, 100, cover)
            self.assertIn(cover.suffix.lower(), {".svg", ".webp", ".png", ".jpg", ".jpeg"})

    def test_dedicated_library_agent_profile_is_published(self):
        book = next((book for book in self.books if book["id"] == "dedicated-library-agent-profile"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "DEDICATED_LIBRARY_AGENT_PROFILE_BLUEPRINT.html")
        self.assertEqual(book["cover"], "assets/covers/custom/dedicated-library-agent-profile.webp")
        self.assertEqual(book["published_at"], "2026-08-23T15:22:54+07:00")

    def test_all_reading_books_use_approved_thai_titles(self):
        expected = {
            "dedicated-library-agent-profile": "สร้าง AI Agent ดูแลห้องสมุด",
            "grok-vs-hermes": "Grok หรือ Hermes เลือกแบบไหนดี",
            "buzz-vs-hermes": "Buzz หรือ Hermes เหมาะกับงานแบบไหน",
            "network-guardian": "AI ผู้พิทักษ์เครือข่ายบ้าน",
            "headless-browser-redesigned": "เลือก Headless Browser สำหรับ AI — ฉบับใหม่",
            "handoff-context": "ส่งต่องานโดยไม่เสียบริบท",
            "hermes-token-guide": "ใช้ Hermes ให้ประหยัด Token",
            "personal-infrastructure-wiki": "วิกิ HomeOps และ Homelab",
            "headless-browser-original": "เลือก Headless Browser สำหรับ AI — ต้นฉบับ",
            "hermes-unstoppable": "Hermes Agent ทำงานลื่นขึ้นอย่างไร",
            "buzz-hermes-acp": "Buzz คือหน้ากาก Hermes คือสมอง",
            "hermes-mega-prompt": "สร้างทีม AI สำหรับธุรกิจคนเดียว",
            "hermes-memory-kb": "Hermes จำอย่างไรให้เก่งขึ้น",
            "hermes-profile-guardian": "ระบบเฝ้าระวังและซ่อม Hermes",
            "hermes-trustworthy-autonomy": "Hermes ทำงานเองอย่างไว้ใจได้",
        }
        actual = {book["id"]: book["short_title"] for book in self.books}
        self.assertEqual(actual, expected)

    def test_trustworthy_autonomy_manual_is_catalogued(self):
        book = next((book for book in self.books if book["id"] == "hermes-trustworthy-autonomy"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "Hermes_Trustworthy_Autonomy_Manual.html")
        self.assertEqual(book["cover"], "assets/covers/custom/hermes-trustworthy-autonomy.webp")
        self.assertEqual(book["published_at"], "2026-08-24T12:43:56+07:00")
        self.assertTrue((ROOT / "templates" / "hermes-trustworthy-autonomy-cover.template.html").is_file())

    def test_imported_repository_guides_preserve_provenance(self):
        registry = json.loads((ROOT / "data" / "imported-sources.json").read_text(encoding="utf-8"))
        expected = {
            "hermes-memory-kb": {
                "source_repository": "https://github.com/hermes2545/hermes-memory",
                "imported_path": "hermes-memory/hermes-memory-kb.html",
            },
            "hermes-profile-guardian": {
                "source_repository": "https://github.com/hermes2545/hermes-guardian",
                "imported_path": "hermes-guardian/index.html",
            },
        }
        actual = {item["book_id"]: item for item in registry}
        for book_id, fields in expected.items():
            self.assertIn(book_id, actual)
            for key, value in fields.items():
                self.assertEqual(actual[book_id][key], value)
            self.assertTrue(actual[book_id]["source_commit"])
            self.assertTrue((ROOT / fields["imported_path"]).is_file())

    def test_duplicate_audit_exists_for_imported_guides(self):
        report = ROOT / "docs" / "reports" / "IMPORTED_CONTENT_DUPLICATE_AUDIT.md"
        self.assertTrue(report.is_file())


if __name__ == "__main__":
    unittest.main()
