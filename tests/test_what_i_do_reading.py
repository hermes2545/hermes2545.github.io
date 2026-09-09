import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "what-i-do"
HTML_PATH = ROOT / "WHAT-I-DO-final.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
SUPPLIED_HTML_SHA256 = "d81ba5282a99e4089e57721f0e3e5b5524d653cf05ba1ec4da4644bbe5389051"
COVER_SOURCE_SHA256 = "4c2192a83b4162ba169bc99046c00a7ecd7f828976024e3c06b6acb123a5714c"
PROHIBITED_PUBLIC_RE = re.compile(
    "|".join(
        [
            "/" + "home" + "/" + "p2544",
            r"\." + "hermes",
            r"doc_[A-Za-z0-9]",
            r"img_[A-Za-z0-9]",
            "AI" + "za",
            "gh" + "p_",
            "github" + "_pat_",
            "sk" + r"-[A-Za-z0-9]{16,}",
            r"BEGIN [A-Z ]*PRIVATE KEY",
        ]
    )
)


class WhatIDoReadingTests(unittest.TestCase):
    def test_catalog_contains_what_i_do_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "งานของผม")
        self.assertEqual(book["short_title"], "งานของผม")
        self.assertEqual(book["href"], "WHAT-I-DO-final.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Work System")
        self.assertEqual(book["published_at"], "2026-09-09T00:00:00+07:00")
        self.assertIn("งานขาย", book["summary"])
        self.assertIn("AI Agent", book["summary"])
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_owner_supplied_html_content_is_preserved(self):
        self.assertTrue(HTML_PATH.is_file())
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertEqual(hashlib.sha256(HTML_PATH.read_bytes()).hexdigest(), SUPPLIED_HTML_SHA256)
        self.assertIn("<title>งานของผม</title>", html)
        self.assertIn("งานที่ดูแลในองค์กร", html)
        self.assertIn("AI Agent และระบบ Multi-Agent", html)
        self.assertIn("Storyboard, Podcast, Audio และ Video", html)
        self.assertEqual(html.count('<section class="page-section'), 21)
        self.assertEqual(html.count('<button class="nav-item"'), 20)
        self.assertEqual(html.count('<article class="detail-card"'), 60)
        for marker in (
            "mobile-menu",
            "langToggle",
            "searchBtn",
            "fontUp",
            "themeBtn",
            "coverArtBtn",
            "localStorage",
            "@media print",
        ):
            self.assertIn(marker, html)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)
        scripts = "\n".join(
            body
            for attrs, body in re.findall(r"<script([^>]*)>(.*?)</script>", html, flags=re.S | re.I)
            if "application/json" not in attrs
        )
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
        self.assertGreater(COVER_PATH.stat().st_size, 30_000)
        template = ROOT / "templates" / "what-i-do-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("owner-supplied", template_text)


if __name__ == "__main__":
    unittest.main()
