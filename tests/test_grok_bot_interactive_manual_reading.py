import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "grok-bot-interactive-manual"
HTML_PATH = ROOT / "grok-bot-interactive-manual.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "9500ea5cbb70cf89108c6f97f5193907fe108eb017c2a386b4bed0bd4257f669"
COVER_SOURCE_SHA256 = "b6df3224db73f0caa9d3fb7d52a28725e2b87ad93a468de5b13e426a60dfc658"
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


class GrokBotInteractiveManualReadingTests(unittest.TestCase):
    def test_catalog_contains_grok_bot_manual_once(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "17 ขั้นตอนการใช้ Grok Bot อย่างมืออาชีพ — Interactive Reference Manual")
        self.assertEqual(book["short_title"], "ใช้ Grok Bot อย่างมืออาชีพ")
        self.assertEqual(book["href"], "grok-bot-interactive-manual.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Grok Bot")
        self.assertEqual(book["published_at"], "2026-09-07T18:56:56+07:00")
        self.assertIn("17 ขั้นตอน", book["summary"])
        self.assertEqual(books[2]["id"], BOOK_ID)

    def test_owner_supplied_html_content_is_preserved_with_mobile_overflow_containment(self):
        self.assertTrue(HTML_PATH.is_file())
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertEqual(hashlib.sha256(HTML_PATH.read_bytes()).hexdigest(), FINAL_HTML_SHA256)
        self.assertIn("Grok Bot — Bilingual Interactive Reference Manual", html)
        self.assertIn("How to Master Grok Bot in 17 Steps", html)
        self.assertIn("จาก Prompting", html)
        self.assertEqual(html.count('<article class="manual-page"'), 33)
        self.assertEqual(html.count('<button class="nav-item"'), 33)
        self.assertIn('html{scroll-behavior:smooth;background:var(--bg);overflow-x:hidden}', html)
        for marker in (
            "Persistent role",
            "shared cloud computer",
            "skills",
            "routines",
            "approvals",
            "Bot Teams",
            "localStorage",
            "navigator.clipboard",
            "@media print",
            "langBtn",
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
        template = ROOT / "templates" / "grok-bot-interactive-manual-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("owner-supplied", template_text)


if __name__ == "__main__":
    unittest.main()
