import hashlib
import json
import unittest
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "codex-claude-shared-project-folder-manual"
HTML_PATH = ROOT / "codex-claude-shared-project-folder-manual-th-v4-complete.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
EXPECTED_HTML_SHA256 = "39bac142899520970330ce1909bf0f0b09e18f9c7fb59ccb3d3f859a98ac04e4"



class HeadingCounter(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current = None
        self.headings = {"h1": [], "h2": []}
        self.nav_buttons = 0

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag in self.headings:
            self.current = tag
        if tag == "button" and "navbtn" in attrs_dict.get("class", ""):
            self.nav_buttons += 1

    def handle_endtag(self, tag):
        if tag == self.current:
            self.current = None

    def handle_data(self, data):
        if self.current:
            text = " ".join(data.split())
            if text:
                self.headings[self.current].append(text)


class CodexClaudeSharedProjectFolderReadingTests(unittest.TestCase):
    def setUp(self):
        self.books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        self.book = next((book for book in self.books if book["id"] == BOOK_ID), None)

    def test_catalog_entry_points_to_owner_supplied_manual_and_cover(self):
        self.assertIsNotNone(self.book)
        book = self.book
        assert book is not None
        self.assertEqual(book["title"], "One Project. Any AI. — คู่มือใช้ Codex และ Claude ร่วมกัน")
        self.assertEqual(book["short_title"], "One Project. Any AI.")
        self.assertEqual(book["href"], HTML_PATH.name)
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "AI Collaboration")
        self.assertEqual(book["published_at"], "2026-09-13T15:15:48+07:00")

    def test_owner_supplied_html_is_preserved_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        data = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(data).hexdigest(), EXPECTED_HTML_SHA256)
        text = data.decode("utf-8")
        self.assertIn("Shared Project Folder Manual", text)
        self.assertIn("หนึ่ง Project Folder", text)
        self.assertIn("Codex", text)
        self.assertIn("Claude", text)
        self.assertNotIn("/home/", text)
        self.assertNotIn(".hermes/", text)
        self.assertNotIn("doc_" + "8498", text)
        self.assertNotIn("img_" + "fae", text)

        parser = HeadingCounter()
        parser.feed(text)
        self.assertEqual(parser.headings["h1"], ["Shared Project Folder Manual"])
        self.assertGreaterEqual(len(parser.headings["h2"]), 10)
        self.assertGreaterEqual(parser.nav_buttons, 10)

    def test_owner_cover_is_normalized_for_reading_shelf_without_metadata(self):
        self.assertTrue(COVER_PATH.is_file())
        self.assertGreater(COVER_PATH.stat().st_size, 100000)
        with Image.open(COVER_PATH) as image:
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(getattr(image, "n_frames", 1), 1)
            self.assertEqual(dict(image.getexif()), {})
            self.assertNotIn("exif", {key.lower() for key in image.info})
            self.assertNotIn("icc_profile", {key.lower() for key in image.info})

    def test_reading_shelf_hover_reveal_has_hybrid_mouse_fallback_selector(self):
        stylesheet = (ROOT / "assets" / "css" / "reading-library.css").read_text(encoding="utf-8")
        template = (ROOT / "templates" / "index.template.html").read_text(encoding="utf-8")
        self.assertIn("@media (hover: hover), (any-hover: hover) {", stylesheet)
        self.assertNotIn(".reading-page .book-card:hover .book-cover", stylesheet)
        self.assertIn(".reading-page .book-card.is-hovering .book-cover", stylesheet)
        self.assertIn(".reading-page .book-cover-wrap:hover .book-cover", stylesheet)
        self.assertIn(".reading-page .book-cover-link:hover .book-cover", stylesheet)
        self.assertIn("rotateY(-24deg)", stylesheet)
        self.assertIn("1.05s cubic-bezier(.42, 0, .2, 1)", stylesheet)
        self.assertIn("z-index: -1;", stylesheet)
        self.assertIn("position: relative;", stylesheet)
        self.assertNotIn("object-fit: cover;", stylesheet)
        self.assertIn("border-radius: 1px 6px 6px 1px;", stylesheet)
        self.assertIn("border-radius: 1px 3px 3px 1px;", stylesheet)
        self.assertNotIn("rotateY(-42deg)", stylesheet)
        script = (ROOT / "assets" / "js" / "library.js").read_text(encoding="utf-8")
        self.assertIn("function bindReadingCoverHoverFallback", script)
        self.assertIn("is-hovering", script)
        self.assertNotIn("is-open", script)
        self.assertIn('document.addEventListener("mousemove"', script)
        self.assertIn('href="assets/css/reading-library.css?v=reading-cover-hover-v12"', template)
        self.assertIn('src="assets/js/library.js?v=reading-cover-hover-v12"', template)


if __name__ == "__main__":
    unittest.main()
