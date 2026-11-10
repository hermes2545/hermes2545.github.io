import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "hermes-at-work"
HTML_PATH = ROOT / "hermes-at-work-public-edition.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "47aa69c361243ae90f73ead84ca9cfeb119850b25761a0986993fc201b7c74a6"
COVER_SOURCE_SHA256 = "72aa60d54d8ebb463f1402124de3c70784d13068530b93a9860c17ecca805d45"
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


class HermesAtWorkReadingTests(unittest.TestCase):
    def test_catalog_contains_hermes_at_work_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "HERMES AT WORK — คู่มือเครื่องมือและการทำงานของทีม AI 5 แผนก")
        self.assertEqual(book["short_title"], "HERMES AT WORK")
        self.assertEqual(book["href"], "hermes-at-work-public-edition.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Hermes Guide")
        self.assertEqual(book["published_at"], "2026-11-10T12:50:27+07:00")
        self.assertIn("27 เครื่องมือ", book["summary"])
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_interactive_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("HERMES AT WORK", html)
        self.assertIn("ทีม AI <em>5 แผนก</em>", html)
        self.assertIn("MASTER EXECUTION PROMPT", html)
        self.assertIn("navigator.clipboard", html)
        self.assertIn("@media print", html)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)

        data_match = re.search(
            r'<script id="book-data" type="application/json">(.*?)</script>',
            html,
            flags=re.S,
        )
        self.assertIsNotNone(data_match)
        assert data_match is not None
        data = json.loads(data_match.group(1))
        self.assertEqual(len(data["pages"]), 11)
        self.assertEqual(len(data["tools"]), 27)
        self.assertEqual(set(data["prompts"]), {"th", "en"})

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

    def test_embedded_owner_cover_is_normalized_without_cropping(self):
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
        template = ROOT / "templates" / "hermes-at-work-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("project-owner supplied image attachment", template_text)
        self.assertIn("byte-identical to the cover embedded in the supplied HTML", template_text)
        self.assertIn("aspect-preserving containment", template_text)
        self.assertIn("1086×1448", template_text)
        self.assertIn("600×900", template_text)


if __name__ == "__main__":
    unittest.main()
