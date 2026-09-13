import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "grok-bot-cli-usage-router-manual"
HTML_PATH = ROOT / "grok-bot-cli-usage-router-manual.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "0f6d6dc41924416f3276d1251ee7cf74a803a22be2f17c03bb3704405f431c95"
COVER_SOURCE_SHA256 = "7399ce9b73740c3bda6b2849ca70380b4c10f11679d50a552ff7c9aa87309ccf"
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


class GrokBotCliUsageRouterReadingTests(unittest.TestCase):
    def test_catalog_contains_usage_router_manual_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "ใช้ Grok Bot ให้คุ้มกว่าเดิม — CLI Usage Router")
        self.assertEqual(book["short_title"], "ใช้ Grok Bot ให้คุ้มกว่าเดิม")
        self.assertEqual(book["href"], "grok-bot-cli-usage-router-manual.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Grok Bot")
        self.assertEqual(book["published_at"], "2026-09-13T20:57:04+07:00")
        self.assertIn("CLI Usage Router", book["summary"])
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("Grok Bot CLI Usage Router", html)
        self.assertIn("คู่มือใช้ Grok Build CLI เพื่อย้ายงานหนักออกจาก Grok Bot", html)
        self.assertIn("AI EXECUTION INSTRUCTIONS", html)
        self.assertIn("GROK_BUILD_OK", html)
        self.assertEqual(html.count('<section class="chapter'), 11)
        self.assertEqual(html.count('data-target="'), 11)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)
        scripts = "\n".join(
            body
            for attrs, body in re.findall(r"<script([^>]*)>(.*?)</script>", html, flags=re.S | re.I)
            if "application/ld+json" not in attrs
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
            self.assertNotIn("exif", {key.lower() for key in image.info})
            self.assertNotIn("icc_profile", {key.lower() for key in image.info})
        self.assertGreater(COVER_PATH.stat().st_size, 30_000)
        template = ROOT / "templates" / "grok-bot-cli-usage-router-manual-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("project-owner supplied", template_text)


if __name__ == "__main__":
    unittest.main()
