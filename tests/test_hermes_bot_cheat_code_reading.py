import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "hermes-bot-cheat-code-practical-guide"
HTML_PATH = ROOT / "hermes-bot-cheat-code-practical-guide.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "2a2aa8ede49d4750e34f6f26c72759bfdf2d589ed5ebb881634895d2f0e373cb"
COVER_SOURCE_SHA256 = "abc4533b68c6d493103681fa845d4fd59bf48ebe82d31038371ffd5095b29f16"
PROHIBITED_PUBLIC_RE = re.compile(
    "|".join(
        [
            "/" + "home" + "/" + "p2544",
            r"\." + "hermes",
            r"doc_[A-Za-z0-9]",
            r"img_[A-Za-z0-9]",
            "gh" + "p_",
            "github" + "_pat_",
            "sk" + r"-[A-Za-z0-9]{16,}",
            r"BEGIN [A-Z ]*PRIVATE KEY",
        ]
    )
)


class HermesBotCheatCodeReadingTests(unittest.TestCase):
    def test_catalog_contains_hermes_bot_cheat_code_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "Hermes Bot Cheat Code — Practical Guide / Playbook")
        self.assertEqual(book["short_title"], "Hermes Bot Cheat Code")
        self.assertEqual(book["href"], "hermes-bot-cheat-code-practical-guide.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Hermes Guide")
        self.assertEqual(book["published_at"], "2026-09-22T22:58:39+07:00")
        self.assertIn("สร้างทีม AI Agent", book["summary"])
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("Hermes Bot Cheat Code", html)
        self.assertIn("สูตรโกงสร้างทีม AI ให้ทำงานแทนคุณ", html)
        self.assertIn("เข้าใจ Bot Mode ก่อนสร้างทีม", html)
        self.assertEqual(html.count('<section class="page'), 11)
        self.assertEqual(html.count('data-target="'), 11)
        self.assertEqual(html.count('class="nav-btn'), 11)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)
        scripts = "\n".join(
            body
            for attrs, body in re.findall(r"<script([^>]*)>(.*?)</script>", html, flags=re.S | re.I)
            if "application/ld+json" not in attrs and "application/json" not in attrs
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
            self.assertEqual(dict(image.getexif()), {})
            self.assertNotIn("exif", {str(key).lower() for key in image.info})
            self.assertNotIn("icc_profile", {str(key).lower() for key in image.info})
        self.assertGreater(COVER_PATH.stat().st_size, 30_000)
        template = ROOT / "templates" / "hermes-bot-cheat-code-practical-guide-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("project-owner supplied", template_text)


if __name__ == "__main__":
    unittest.main()
