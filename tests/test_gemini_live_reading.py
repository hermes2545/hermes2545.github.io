import json
import re
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "gemini-live-api-guide"
HTML_PATH = ROOT / "Gemini_Live_API_Guide_TH.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / "gemini-live-api-guide.webp"


class GeminiLiveReadingGuideTests(unittest.TestCase):
    def setUp(self):
        self.books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))

    def test_catalog_contains_gemini_live_reading_guide_once(self):
        matches = [book for book in self.books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["short_title"], "Gemini Live API")
        self.assertEqual(book["href"], "Gemini_Live_API_Guide_TH.html")
        self.assertEqual(book["cover"], "assets/covers/custom/gemini-live-api-guide.webp")
        self.assertEqual(book["category"], "AI Voice Agents")
        self.assertRegex(book["published_at"], r"^2026-08-30T\d{2}:\d{2}:\d{2}\+07:00$")
        self.assertIn("voice agent", book["summary"].lower())

    def test_html_guide_contains_expected_sections_and_public_sources(self):
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertIn("Gemini Live API", html)
        self.assertIn("คู่มือสร้าง Voice Agent แบบ Real-Time", html)
        for section in (
            "เอาไปทำอะไรได้บ้าง",
            "ต่างจากของเดิมยังไง",
            "สิ่งที่คลิปสอน",
            "โค้ดเดโม voicedemo1",
            "ข้อควรระวังจากเดโม",
            "Sources",
        ):
            self.assertIn(section, html)
        self.assertEqual(html.count('<section class="sec'), 10)
        self.assertEqual(html.count('class="nav-item"'), 10)
        self.assertNotIn("gemini-live-api-guide.webp", html)
        for marker in (
            "localStorage",
            "navigator.clipboard",
            "@media print",
            "searchResults",
            "data-copy",
            "data-theme",
            "data-fs",
            "stateful WebSocket",
            "send_realtime_input",
            "session.receive()",
        ):
            self.assertIn(marker, html)
        for url in (
            "https://ai.google.dev/gemini-api/docs/live-api",
            "https://www.youtube.com/watch?v=pFc-HcUgFgY",
            "https://github.com/cuppibla/live-dj",
            "https://raw.githubusercontent.com/cuppibla/live-dj/main/backend/raw_minimal.py",
            "https://raw.githubusercontent.com/cuppibla/live-dj/main/backend/raw_server.py",
            "https://raw.githubusercontent.com/cuppibla/live-dj/main/backend/tools.py",
        ):
            self.assertIn(url, html)
        self.assertNotIn("ค่ะ", html)
        self.assertNotIn("/" + "home" + "/", html)
        self.assertNotIn("ca" + "che/", html)
        credential_pattern = "AI" + "za|ya" + "29\\.|gh" + "p_|github" + "_pat_"
        self.assertNotRegex(html, re.compile(credential_pattern))

    def test_owner_supplied_cover_is_normalized_for_reading_shelf(self):
        self.assertTrue(COVER_PATH.is_file())
        with Image.open(COVER_PATH) as cover:
            self.assertEqual(cover.size, (600, 900))
            self.assertEqual(cover.mode, "RGB")
            self.assertEqual(cover.format, "WEBP")
        self.assertGreater(COVER_PATH.stat().st_size, 100_000)


if __name__ == "__main__":
    unittest.main()
