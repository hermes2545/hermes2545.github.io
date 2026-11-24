import hashlib
import json
import re
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "hermes-installation-manual"
PDF_PATH = ROOT / "Hermes-installation-manual.pdf"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
PDF_SOURCE_SHA256 = "baf44008dfadadd6b23a6084a1146f67a20b82554a3795d4f56642c4a24b2b18"
COVER_SOURCE_SHA256 = "7b0f666a42f24e1e627c3cc6a93ca887e09e2ec32584a6273fbdadd4b032e021"
PROHIBITED_TEXT_RE = re.compile(
    "|".join(
        [
            "/" + "home" + "/" + "p2544",
            r"doc_[A-Za-z0-9]{6,}",
            r"img_[A-Za-z0-9]{6,}",
            r"(?<![A-Za-z0-9_-])ghp_[A-Za-z0-9]{16,}",
            r"(?<![A-Za-z0-9_-])github_pat_[A-Za-z0-9_]{16,}",
            r"(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{16,}",
            r"BEGIN [A-Z ]*PRIVATE KEY",
        ]
    ),
    flags=re.I,
)


class HermesInstallationManualReadingTests(unittest.TestCase):
    def test_catalog_contains_pdf_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "Hermes installation manual — การติดตั้ง Hermes บนเครื่องของคุณ")
        self.assertEqual(book["short_title"], "Hermes installation manual")
        self.assertEqual(book["href"], "Hermes-installation-manual.pdf")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Installation Guide")
        self.assertEqual(book["published_at"], "2026-11-23T17:41:27+07:00")
        self.assertIn("26 หน้า", book["summary"])
        self.assertEqual(book["accent"], "#F5B82E")
        self.assertEqual(books[1]["id"], BOOK_ID)

    def test_owner_supplied_pdf_is_preserved_and_public_safe(self):
        self.assertTrue(PDF_PATH.is_file())
        pdf_bytes = PDF_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(pdf_bytes).hexdigest(), PDF_SOURCE_SHA256)
        self.assertTrue(pdf_bytes.startswith(b"%PDF-1.7"))
        self.assertEqual(PDF_PATH.stat().st_size, 444_397)

        provenance = ROOT / "templates" / "hermes-installation-manual-pdf.template.md"
        self.assertTrue(provenance.is_file())
        provenance_text = provenance.read_text(encoding="utf-8")
        self.assertIn(PDF_SOURCE_SHA256, provenance_text)
        self.assertIn("26 A4 pages", provenance_text)
        self.assertIn("not encrypted", provenance_text)
        self.assertIn("no attachments, JavaScript, OpenAction, or AcroForm", provenance_text)
        self.assertNotRegex(provenance_text, PROHIBITED_TEXT_RE)

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
        template = ROOT / "templates" / "hermes-installation-manual-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn(hashlib.sha256(COVER_PATH.read_bytes()).hexdigest(), template_text)
        self.assertIn("project-owner supplied final cover image attachment", template_text)
        self.assertIn("aspect-preserving containment", template_text)
        self.assertIn("906×1280", template_text)
        self.assertIn("600×900", template_text)


if __name__ == "__main__":
    unittest.main()
