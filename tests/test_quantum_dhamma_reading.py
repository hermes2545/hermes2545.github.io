import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "quantum-dhamma-series"
HTML_PATH = ROOT / "quantum" / "index.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
MIRRORED_INDEX_SHA256 = "c0f110f7c2881d250c40d339797b7b0142986a9c4a3e82a3de72ff049391bf22"
COVER_SOURCE_SHA256 = "03880d327498a782932236a4d20586b4350ebec891bff942c2c6b008cc1fac6b"
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


class QuantumDhammaReadingTests(unittest.TestCase):
    def test_catalog_contains_quantum_dhamma_series_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "ธรรมะกับควอนตัม")
        self.assertEqual(book["short_title"], "ธรรมะกับควอนตัม")
        self.assertEqual(book["href"], "quantum/index.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Dhamma & Quantum")
        self.assertEqual(book["published_at"], "2026-10-05T23:30:45+07:00")
        self.assertIn("หนังสือชุด 9 เล่ม", book["summary"])
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_mirrored_quantum_site_is_public_safe_and_complete(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), MIRRORED_INDEX_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("คู่มือเดินทางแบบโต้ตอบ · หนังสือชุด 9 เล่ม", html)
        self.assertIn("หนังสือชุดโดย สิรวิชญ์ รัตน์จินดา", html)
        self.assertEqual(html.count('class="bookcard ready"'), 9)
        self.assertIn("trilaksana-quantum", html)
        self.assertIn("quantum-cell-to-nibbana-2", html)
        self.assertTrue((ROOT / "quantum" / "assets" / "js" / "app.js").is_file())
        for module_name in (
            "nav.js",
            "terms.js",
            "ask.js",
            "progress.js",
            "source-footer.js",
            "exercise.js",
            "interactive.js",
            "glossary.js",
            "components.js",
            "term-sheet.js",
            "byok.js",
            "context.js",
        ):
            self.assertTrue((ROOT / "quantum" / "assets" / "js" / module_name).is_file(), module_name)
        self.assertTrue((ROOT / "quantum" / "assets" / "css" / "base.css").is_file())
        self.assertEqual(len(list((ROOT / "quantum" / "pdf").glob("*.pdf"))), 9)
        self.assertGreaterEqual(len(list((ROOT / "quantum" / "b").rglob("*.html"))), 140)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)
        script = (ROOT / "quantum" / "assets" / "js" / "app.js").read_text(encoding="utf-8")
        result = subprocess.run(
            ["node", "--input-type=module", "--check"],
            input=script,
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
        template = ROOT / "templates" / "quantum-dhamma-series-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("project-owner supplied", template_text)
        self.assertIn("resized and center-cropped", template_text)


if __name__ == "__main__":
    unittest.main()
