import base64
import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "hermes-full-disaster-recovery"
HTML_PATH = ROOT / "Hermes_Full_Disaster_Recovery_Interactive_Manual.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "179e91a7037e89a4c0dc86771f9d7272e13d27a7ee35ee5aeb561ce5cdb41f16"
COVER_SOURCE_SHA256 = "503446a87d9f03ae8e4dc5c32b8ae265c3e099ce19f6c8a06add5bb39e74cb6f"
EMBEDDED_HERO_SHA256 = "1c56b77b766f65f4234e36a4c8bf29daa72add403960664a65e5620cf23d1a0d"
PROHIBITED_PUBLIC_RE = re.compile(
    "|".join(
        [
            "/" + "home" + "/" + "p2544",
            r"doc_[A-Za-z0-9]{6,}",
            r"img_[A-Za-z0-9]{6,}",
            r"(?<![A-Za-z0-9_-])ghp_[A-Za-z0-9]{16,}",
            r"(?<![A-Za-z0-9_-])github_pat_[A-Za-z0-9_]{16,}",
            r"(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{16,}",
            r"BEGIN [A-Z ]*PRIVATE KEY",
            r"[?&](?:X-Amz-Signature|Signature|sig|token)=[^&\s\"']+",
        ]
    ),
    flags=re.I,
)


class HermesFullDisasterRecoveryReadingTests(unittest.TestCase):
    def test_catalog_contains_manual_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "คู่มือสร้างระบบ Hermes Full Disaster Recovery Backup")
        self.assertEqual(book["short_title"], "Hermes Full Disaster Recovery")
        self.assertEqual(book["href"], "Hermes_Full_Disaster_Recovery_Interactive_Manual.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Disaster Recovery")
        self.assertEqual(book["published_at"], "2026-11-23T00:52:34+07:00")
        self.assertIn("30 ภาค", book["summary"])
        self.assertEqual(book["accent"], "#EF352C")
        self.assertEqual(books[3]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_interactive_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("HERMES | Full Disaster Recovery — Interactive Manual", html)
        self.assertIn("คู่มือสร้างระบบ Hermes Full Disaster Recovery Backup", html)
        self.assertIn("30 PARTS · COMPLETE SOURCE · OFFLINE READY", html)
        self.assertIn("Restore Completion Report Template", html)
        self.assertIn("navigator.clipboard", html)

        public_text = re.sub(
            r"data:image/[^;]+;base64,[A-Za-z0-9+/=]+",
            "[EMBEDDED_IMAGE]",
            html,
            flags=re.I | re.S,
        )
        self.assertNotRegex(public_text, PROHIBITED_PUBLIC_RE)
        self.assertEqual(len(re.findall(r'<button class="nav-item"', html)), 31)
        self.assertEqual(len(re.findall(r'<section class="chapter"', html)), 31)
        self.assertEqual(len(re.findall(r'class="copy-code"', html)), 57)
        self.assertEqual(len(re.findall(r'<pre><code', html)), 57)
        self.assertEqual(len(re.findall(r'task-list-item-checkbox', html)), 33)

        embedded_match = re.search(
            r'data:image/png;base64,([A-Za-z0-9+/=]+)', html, flags=re.S | re.I
        )
        self.assertIsNotNone(embedded_match)
        assert embedded_match is not None
        embedded_hero = base64.b64decode(embedded_match.group(1))
        self.assertEqual(hashlib.sha256(embedded_hero).hexdigest(), EMBEDDED_HERO_SHA256)

        scripts = "\n".join(
            body for _attrs, body in re.findall(r"<script([^>]*)>(.*?)</script>", html, flags=re.S | re.I)
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
        template = ROOT / "templates" / "hermes-full-disaster-recovery-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn(hashlib.sha256(COVER_PATH.read_bytes()).hexdigest(), template_text)
        self.assertIn("project-owner supplied final cover image attachment", template_text)
        self.assertIn("aspect-preserving containment", template_text)
        self.assertIn("1086×1448", template_text)
        self.assertIn("600×900", template_text)


if __name__ == "__main__":
    unittest.main()
