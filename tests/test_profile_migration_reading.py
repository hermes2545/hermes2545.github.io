import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "hermes-profile-migration-linux-server-guide"
HTML_PATH = ROOT / "Hermes_Profile_Migration_Linux_Server_Guide_TH.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"


class ProfileMigrationReadingGuideTests(unittest.TestCase):
    def test_catalog_contains_profile_migration_guide_once(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "คู่มือย้าย Hermes Profile ไปยัง Linux Server เครื่องใหม่")
        self.assertEqual(book["short_title"], "Hermes Profile Migration")
        self.assertEqual(book["href"], "Hermes_Profile_Migration_Linux_Server_Guide_TH.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Hermes Guide")
        self.assertRegex(book["published_at"], r"^2026-08-30T\d{2}:\d{2}:\d{2}\+07:00$")
        self.assertIn("secrets", book["summary"])
        self.assertIn("gateway", book["summary"])

    def test_html_uses_interactive_manual_pattern_and_owner_header_correction(self):
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertEqual(html.count('<section class="sec'), 10)
        self.assertEqual(html.count('class="nav-item"'), 10)
        # The large title/hero must appear only in the Overview view, not above every menu.
        self.assertEqual(html.count('<h1 class="disp">'), 1)
        overview_start = html.index('id="overview"')
        first_other = html.index('id="placeholders-intake"')
        self.assertIn('<h1 class="disp">', html[overview_start:first_other])
        self.assertNotIn('id="hero"', html)
        self.assertNotIn('PREVIEW ·', html)
        for marker in (
            "localStorage",
            "navigator.clipboard",
            "@media print",
            "searchResults",
            "data-copy",
            "data-theme",
            "data-fs",
            "Hermes Profile Migration Intake Worksheet",
            "Hermes Profile Migration Plan",
            "Hermes Profile Migration Handoff",
            "Final Definition of Done",
            "&lt;OLD_HOST&gt;",
            "&lt;NEW_HOST&gt;",
            "&lt;PROFILE_NAME&gt;",
            "token เดียวไม่ควรมี gateway/poller ซ้ำสองเครื่อง",
            "sha256sum -c &lt;PROFILE_NAME&gt;-migration.tar.gz.sha256",
        ):
            self.assertIn(marker, html)
        self.assertNotIn("ค่ะ", html)
        self.assertNotRegex(html, r"/" + "home" + r"/p2544|\.hermes/projects/Library|1rUSrGF4" + r"IVx7PDYwzvY9lzesChPglFTc_")
        self.assertNotRegex(html, r"AIza|ya29\.|ghp_|github_pat_|sk-[A-Za-z0-9]|BEGIN [A-Z ]*PRIVATE KEY")

        scripts = "\n".join(re.findall(r"<script>(.*?)</script>", html, flags=re.S))
        script_path = ROOT / ".hermes" / "previews" / "profile-migration-guide" / "profile-migration-public-inline.js"
        script_path.parent.mkdir(parents=True, exist_ok=True)
        script_path.write_text(scripts, encoding="utf-8")
        result = subprocess.run(["node", "--check", str(script_path)], text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)

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
