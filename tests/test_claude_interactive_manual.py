import json
import re
import subprocess
import unittest
from pathlib import Path
from urllib.parse import unquote, urlparse

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "claude-interactive-manual"
BOOK_DIR = ROOT / "claude-interactive-manual"
HTML_PATH = BOOK_DIR / "index.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"


class ClaudeInteractiveManualReadingTests(unittest.TestCase):
    def setUp(self):
        self.books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        self.matches = [book for book in self.books if book["id"] == BOOK_ID]

    def test_catalog_contains_claude_interactive_manual_once(self):
        self.assertEqual(len(self.matches), 1)
        book = self.matches[0]
        self.assertEqual(book["title"], "Claude Interactive Manual")
        self.assertEqual(book["short_title"], "Claude Interactive Manual")
        self.assertEqual(book["href"], "claude-interactive-manual/index.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Claude Code")
        self.assertEqual(book["published_at"], "2026-07-06T00:00:00+07:00")
        self.assertEqual(BOOK_ID, self.books[[book["id"] for book in self.books].index("hermes-mega-prompt") + 1]["id"])

    def test_static_course_artifact_is_present_and_public_safe(self):
        book = self.matches[0]
        target = ROOT / unquote(urlparse(book["href"]).path)
        self.assertEqual(target, HTML_PATH)
        self.assertTrue(HTML_PATH.is_file())
        html = HTML_PATH.read_text(encoding="utf-8")
        for marker in (
            "เรียน Claude แบบ Interactive",
            "assets/index-",
            "id=\"root\"",
        ):
            self.assertIn(marker, html)
        self.assertTrue((BOOK_DIR / "manual500p.pdf").is_file())
        self.assertGreater((BOOK_DIR / "manual500p.pdf").stat().st_size, 2_000_000)
        assets = list((BOOK_DIR / "assets").glob("*.js")) + list((BOOK_DIR / "assets").glob("*.css"))
        self.assertGreaterEqual(len(assets), 10)
        bundled_text = html + "\n" + "\n".join(asset.read_text(encoding="utf-8") for asset in assets if asset.suffix in {".js", ".css"})
        self.assertIn("manual500p.pdf", bundled_text)
        self.assertIn("Workflows W1", bundled_text)
        self.assertIn("Prompt Cookbook", bundled_text)
        secret_pattern = r"/home/|git" + r"hub_pat_|ghp_|sk-[A-Za-z0-9]{16,}|AIza|ya29\\.|BEGIN [A-Z ]*PRIVATE KEY"
        self.assertNotRegex(bundled_text, secret_pattern)

    def test_built_course_javascript_is_syntax_valid_and_relative(self):
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertNotIn('src="/assets/', html)
        self.assertNotIn('href="/assets/', html)
        for script in sorted((BOOK_DIR / "assets").glob("*.js")):
            result = subprocess.run(
                ["node", "--check", str(script)],
                cwd=ROOT,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, f"{script}: {result.stderr}")

    def test_ai_generated_cover_option_three_is_normalized_for_shelf(self):
        self.assertTrue(COVER_PATH.is_file())
        with Image.open(COVER_PATH) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(len(image.getexif()), 0)
        self.assertGreater(COVER_PATH.stat().st_size, 50_000)
        source = (ROOT / "templates" / "claude-interactive-manual-cover.template.md")
        self.assertTrue(source.is_file())
        source_text = source.read_text(encoding="utf-8")
        self.assertIn("Option 3 — Course Object", source_text)
        self.assertIn("Visual Art Director", source_text)
        self.assertIn("gpt-image-2-medium", source_text)


if __name__ == "__main__":
    unittest.main()
