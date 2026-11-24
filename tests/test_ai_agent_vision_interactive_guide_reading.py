import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "ai-agent-vision-interactive-guide-th"
HTML_PATH = ROOT / "AI-Agent-Vision-Interactive-Guide-TH.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "bcb48cd24a68b7e807fa9b09013805a691ac91a99e75a1f978f3ecf30e8187f1"
COVER_SOURCE_SHA256 = "4acddc778b9e3192f13faa4686c51f3d5a276a9f94b96e366bec4ca7e67e6cec"
COVER_DERIVATIVE_SHA256 = "c876348db2c5c14883d59bc3b9c7b1bdd908247453639b80d7b976d46079a03f"
PROHIBITED_PUBLIC_RE = re.compile(
    "|".join(
        [
            "/" + "home" + "/" + "p2544",
            r"\." + "hermes/(?:profiles|cache|projects)/",
            r"doc_[A-Za-z0-9]{6,}",
            r"img_[A-Za-z0-9]{6,}",
            "gh" + r"[pousr]_[A-Za-z0-9_]{16,}",
            "github" + r"_pat_[A-Za-z0-9_]{16,}",
            "sk" + r"-[A-Za-z0-9_-]{20,}",
            r"BEGIN [A-Z ]*PRIVATE KEY",
            r"[?&](?:X-Amz-Signature|Signature|sig|token)=[^&\s\"']+",
        ]
    ),
    flags=re.I,
)


class AiAgentVisionInteractiveGuideReadingTests(unittest.TestCase):
    def test_catalog_contains_guide_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "คู่มือให้ AI Agent มองเห็นและตรวจจับวัตถุ")
        self.assertEqual(book["short_title"], "AI Agent Vision")
        self.assertEqual(book["href"], "AI-Agent-Vision-Interactive-Guide-TH.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Home Assistant")
        self.assertEqual(book["published_at"], "2026-11-24T10:08:22+07:00")
        self.assertIn("Home Assistant", book["summary"])
        self.assertIn("Frigate", book["summary"])
        self.assertEqual(book["accent"], "#36C9F4")
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_interactive_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("คู่มือให้ <em>AI Agent</em><br/>มองเห็นและตรวจจับวัตถุ", html)
        self.assertIn("Home Assistant + กล้อง Tapo + Frigate + เสียงแจ้งเตือนบน Android", html)
        self.assertEqual(len(re.findall(r'<section class="page"', html)), 23)
        self.assertEqual(len(re.findall(r"data-go=", html)), 23)
        self.assertIn("navigator.clipboard", html)
        self.assertIn("localStorage", html)
        self.assertIn("@media print", html)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)

        scripts = "\n".join(re.findall(r"<script[^>]*>(.*?)</script>", html, flags=re.S | re.I))
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

    def test_owner_supplied_cover_is_normalized_without_cropping(self):
        self.assertTrue(COVER_PATH.is_file())
        with Image.open(COVER_PATH) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(getattr(image, "n_frames", 1), 1)
            self.assertEqual(dict(image.getexif()), {})
            self.assertNotIn("exif", {str(key).lower() for key in image.info})
            self.assertNotIn("icc_profile", {str(key).lower() for key in image.info})
        self.assertGreater(COVER_PATH.stat().st_size, 50_000)
        self.assertEqual(hashlib.sha256(COVER_PATH.read_bytes()).hexdigest(), COVER_DERIVATIVE_SHA256)

        template = ROOT / "templates" / f"{BOOK_ID}-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn(COVER_DERIVATIVE_SHA256, template_text)
        self.assertIn("project-owner supplied final cover image attachment", template_text)
        self.assertIn("aspect-preserving containment", template_text)
        self.assertIn("1055×1491", template_text)
        self.assertIn("600×900", template_text)
        self.assertNotRegex(template_text, PROHIBITED_PUBLIC_RE)


if __name__ == "__main__":
    unittest.main()
