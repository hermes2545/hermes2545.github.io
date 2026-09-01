import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "grokrouter-interactive-reference-manual"
HTML_PATH = ROOT / "GrokRouter_Interactive_Reference_Manual_TH.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
APPROVED_HTML_SHA256 = "12ad8451b29c3b83003a3c037f76b9bdca4f2dd2fdb2377e5a3661c64510e64f"


class GrokRouterReadingGuideTests(unittest.TestCase):
    def test_catalog_contains_grokrouter_manual_once(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "GrokRouter — Interactive Reference Manual (TH)")
        self.assertEqual(book["short_title"], "GrokRouter ทำงานอย่างไร")
        self.assertEqual(book["href"], "GrokRouter_Interactive_Reference_Manual_TH.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "AI Agent Architecture")
        self.assertEqual(book["published_at"], "2026-09-01T00:38:48+07:00")
        self.assertIn("Grok Bot", book["summary"])
        self.assertIn("provider", book["summary"].lower())
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_grokrouter_html_is_byte_preserved_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertEqual(hashlib.sha256(HTML_PATH.read_bytes()).hexdigest(), APPROVED_HTML_SHA256)
        self.assertEqual(html.count('<section class="page"'), 22)
        self.assertEqual(html.count('<button class="nav-item"'), 22)
        for marker in (
            "GrokRouter คืออะไร?",
            "Interactive Reference Manual",
            "Codex SDK",
            "OpenRouter",
            "Fresh-Bot Acceptance",
            "License และนโยบายการอัปเดต",
            "localStorage",
            "navigator.clipboard",
            "@media print",
            "ROBUST DOCUMENT SCROLL FIX",
            "window.scrollTo(0,0)",
        ):
            self.assertIn(marker, html)
        self.assertNotIn("ค่ะ", html)
        self.assertNotRegex(
            html,
            r"/" + "home" + r"/p2544|doc_" + "998723c56b55" + r"|img_" + "b5bd125f248c",
        )
        self.assertNotRegex(
            html,
            r"AI" + r"za|ya29\\.|ghp" + r"_|github" + r"_pat_|sk-[A-Za-z0-9]|BEGIN [A-Z ]*PRIVATE KEY",
        )

        scripts = "\n".join(re.findall(r"<script>(.*?)</script>", html, flags=re.S))
        result = subprocess.run(
            ["node", "--check"],
            input=scripts,
            text=True,
            cwd=ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_owner_supplied_cover_is_normalized_for_reading_shelf(self):
        self.assertTrue(COVER_PATH.is_file())
        with Image.open(COVER_PATH) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(getattr(image, "n_frames", 1), 1)
            self.assertEqual(len(image.getexif()), 0)
        self.assertGreater(COVER_PATH.stat().st_size, 50_000)


if __name__ == "__main__":
    unittest.main()
