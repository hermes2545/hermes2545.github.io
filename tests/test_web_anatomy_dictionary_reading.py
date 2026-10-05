import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "web-anatomy-dictionary"
HTML_PATH = ROOT / "web-anatomy-dictionary.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "8d917f2840a8396f2b9581c570cc70320356c9f3df80b96961dd5f5f99ed8e53"
COVER_SOURCE_SHA256 = "e631a037f15353ce1b4c3f1636793037d852eb0a944916e58dcb82e69c8dc46d"
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


class WebAnatomyDictionaryReadingTests(unittest.TestCase):
    def test_catalog_contains_web_anatomy_dictionary_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "Web Anatomy — Interactive Reference Manual")
        self.assertEqual(book["short_title"], "Web Anatomy")
        self.assertEqual(book["href"], "web-anatomy-dictionary.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Web Design")
        self.assertEqual(book["published_at"], "2026-09-27T13:29:36+07:00")
        self.assertIn("ศัพท์เรียกส่วนประกอบเว็บไซต์", book["summary"])
        self.assertEqual(books[1]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("Web Anatomy <span>ศัพท์เรียกส่วนประกอบเว็บไซต์ & เว็บแอป</span>", html)
        self.assertIn("ภาพรวม: กายวิภาคของหน้าเว็บ", html)
        self.assertIn("Navigation", html)
        self.assertEqual(html.count('class="side-link'), 7)
        self.assertEqual(len(re.findall(r'<section class="sec(?: show)?"', html)), 7)
        self.assertGreaterEqual(html.count('class="card'), 110)
        self.assertIn("localStorage", html)
        self.assertIn("@media print", html)
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
        template = ROOT / "templates" / "web-anatomy-dictionary-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("project-owner supplied", template_text)
        self.assertIn("aspect-preserving containment", template_text)


if __name__ == "__main__":
    unittest.main()
