import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "hermes-bot-mode-interactive-manual"
HTML_PATH = ROOT / "hermes-bot-mode-interactive-manual.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
SUPPLIED_HTML_SHA256 = "c7724865fe16653fe4156810138693e4e836ece4d45636be38e1f8d50db12258"
COVER_SOURCE_SHA256 = "4a18827d9bc397ad32ea09857f3b6c4bc7d935e5984f7e87416b9d1b753b231b"
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


class HermesBotModeReadingTests(unittest.TestCase):
    def test_catalog_contains_hermes_bot_mode_manual_once(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "Hermes Bot Mode · Interactive Reference Manual")
        self.assertEqual(book["short_title"], "Hermes Bot Mode")
        self.assertEqual(book["href"], "hermes-bot-mode-interactive-manual.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Hermes Guide")
        self.assertEqual(book["published_at"], "2026-09-07T14:29:47+07:00")
        self.assertIn("Bot Mode", book["summary"])
        self.assertEqual(books[2]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_byte_for_byte(self):
        self.assertTrue(HTML_PATH.is_file())
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertEqual(hashlib.sha256(HTML_PATH.read_bytes()).hexdigest(), SUPPLIED_HTML_SHA256)
        self.assertIn("Hermes Bot Mode · Interactive Reference Manual", html)
        self.assertIn("Research Note: “Is Hermes Bot Mode Worth It?", html)
        self.assertEqual(html.count("<h2"), 14)
        self.assertEqual(html.count("<h3"), 23)
        self.assertEqual(html.count("<section"), 15)
        for marker in (
            "Bot Mode คืออะไร",
            "Team Design ในคลิป",
            "Orchestrator",
            "Researcher",
            "Librarian",
            "Communication Modes",
            "Practical Setup Checklist",
            "Suggested “Ideal Architecture”",
            "localStorage",
            "navigator.clipboard",
            "@media print",
        ):
            self.assertIn(marker, html)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)
        scripts = "\n".join(re.findall(r"<script[^>]*>(.*?)</script>", html, flags=re.S))
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
        template = ROOT / "templates" / "hermes-bot-mode-interactive-manual-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("fill scale", template_text)
        self.assertIn("center-crop", template_text)
        self.assertIn("no padding", template_text)
        self.assertIn("no added white border", template_text)


if __name__ == "__main__":
    unittest.main()
