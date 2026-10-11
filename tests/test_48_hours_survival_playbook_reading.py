import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "48-hours-survival-playbook"
HTML_PATH = ROOT / "48-hours-survival-playbook.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "427a7e4af42cb63a671ce0f7192203bc3755007803d19b787f8b776ecaf5228d"
COVER_SOURCE_SHA256 = "2f3d3ef1ca92d89d09587d86736cf73f4a872f55221967c62938b7eeea89640e"
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


class FortyEightHoursSurvivalPlaybookReadingTests(unittest.TestCase):
    def test_catalog_contains_48_hours_survival_playbook_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "48 HOURS — เมื่อระบบล่ม เราจะดูแลกันอย่างไร")
        self.assertEqual(book["short_title"], "48 Hours เอาตัวรอด")
        self.assertEqual(book["href"], "48-hours-survival-playbook.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Emergency Preparedness")
        self.assertEqual(book["published_at"], "2026-10-11T12:50:53+07:00")
        self.assertIn("48 ชั่วโมงแรก", book["summary"])
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("เมื่อระบบล่ม เราจะดูแลกันอย่างไร", html)
        self.assertIn("48 HOURS — 15 ภารกิจเมื่อระบบล่ม", html)
        self.assertIn("Checklist ทุกภารกิจ", html)
        self.assertEqual(len(re.findall(r"<section\b", html, flags=re.I)), 9)
        self.assertEqual(len(re.findall(r"<article\b", html, flags=re.I)), 15)
        self.assertEqual(len(re.findall(r"<button\b", html, flags=re.I)), 32)
        self.assertIn("localStorage", html)
        self.assertIn("navigator.clipboard", html)
        self.assertIn("@media print", html)
        self.assertNotIn("ค่ะ", html)
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
        template = ROOT / "templates" / "48-hours-survival-playbook-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("project-owner supplied image attachment", template_text)
        self.assertIn("resized from 1024×1536 to 600×900", template_text)


if __name__ == "__main__":
    unittest.main()
