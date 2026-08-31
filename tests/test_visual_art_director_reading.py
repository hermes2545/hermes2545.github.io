import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path
from urllib.parse import unquote, urlparse

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "visual-art-director-agent"
HTML_PATH = ROOT / "Visual_Art_Director_Agent_Interactive_Manual.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
APPROVED_HTML_SHA256 = "299fd37972df359c99d4c0ffda8487315d7e2907f2500e3303c6dc07bc5d521a"


class VisualArtDirectorReadingGuideTests(unittest.TestCase):
    def test_catalog_contains_visual_art_director_manual_once(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "Visual Art Director Agent — Interactive Reference Manual")
        self.assertEqual(book["short_title"], "Visual Art Director Agent")
        self.assertEqual(book["href"], "Visual_Art_Director_Agent_Interactive_Manual.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "AI Design Workflow")
        self.assertRegex(book["published_at"], r"^2026-08-30T\d{2}:\d{2}:\d{2}\+07:00$")
        self.assertIn("Art Director", book["summary"])
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_visual_art_director_html_is_public_safe_and_matches_approved_sidebar_fix(self):
        self.assertTrue(HTML_PATH.is_file())
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertEqual(hashlib.sha256(HTML_PATH.read_bytes()).hexdigest(), APPROVED_HTML_SHA256)
        self.assertEqual(html.count('<button class="nav-item'), 11)
        self.assertEqual(html.count('<article class="chapter"'), 11)
        for marker in (
            "Visual Art Director Agent",
            "Interactive Reference Manual",
            "Tool Policy และ Hybrid Pipeline",
            "Image Generation",
            "Thai Typography",
            "Master Prompt ฉบับเต็ม",
            "localStorage",
            "navigator.clipboard",
            "@media print",
        ):
            self.assertIn(marker, html)
        self.assertNotIn("ค่ะ", html)
        self.assertNotRegex(
            html,
            r"/" + "home" + r"/|doc_" + "be3e90a011c9" + r"|img_" + "77ca0b7222ae",
        )
        self.assertNotRegex(html, r"AIza|ya29\.|ghp_|github_pat_|sk-[A-Za-z0-9]|BEGIN [A-Z ]*PRIVATE KEY")

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

    def test_sidebar_has_close_control_when_mobile_menu_is_open(self):
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertIn('id="sidebarClose"', html)
        self.assertIn('aria-label="ปิดเมนู"', html)
        self.assertRegex(html, r"\.sidebar-close\s*\{[^}]*display\s*:\s*none")
        self.assertRegex(html, r"@media \(max-width: 820px\)[\s\S]*body\.mobile-nav-open \.sidebar\s*\{[^}]*transform\s*:\s*translateX\(0\)\s*!important")
        self.assertRegex(html, r"@media \(max-width: 820px\)[\s\S]*\.sidebar-close\s*\{[^}]*display\s*:\s*inline-flex")
        self.assertIn('$("#sidebarClose").addEventListener("click", closeNavigation);', html)
        self.assertIn('function closeNavigation(options={})', html)
        self.assertIn('document.body.classList.remove("mobile-nav-open");', html)
        self.assertIn('document.body.classList.remove("sidebar-collapsed");', html)

    def test_owner_supplied_cover_is_normalized_for_reading_shelf(self):
        self.assertTrue(COVER_PATH.is_file())
        with Image.open(COVER_PATH) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(len(image.getexif()), 0)
        self.assertGreater(COVER_PATH.stat().st_size, 80_000)


if __name__ == "__main__":
    unittest.main()
