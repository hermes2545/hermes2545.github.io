import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "xiaomi-legacy-camera-local-rtsp"
HTML_PATH = ROOT / "xiaomi-legacy-camera-local-rtsp-interactive-manual.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "5f561d60ef634b55e0ba7ac87d992186bad6a6b96e283c9c26670526238bd062"
COVER_SOURCE_SHA256 = "d4cc445cf3b7d8593ce084357206023e31f51e68c5b65ea3a63ae3860fa8b35a"
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


class XiaomiLegacyCameraLocalRtspReadingTests(unittest.TestCase):
    def test_catalog_contains_xiaomi_camera_manual_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "แก้ภาพดีเลย์กล้อง Xiaomi ด้วย Local RTSP Bridge")
        self.assertEqual(book["short_title"], "ปลุกกล้อง Xiaomi เก่า")
        self.assertEqual(book["href"], "xiaomi-legacy-camera-local-rtsp-interactive-manual.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Home Assistant")
        self.assertEqual(book["published_at"], "2026-09-16T23:07:54+07:00")
        self.assertIn("Local RTSP Bridge", book["summary"])
        self.assertIn("go2rtc", book["summary"])
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("Xiaomi Legacy Camera Low-Latency Guide", html)
        self.assertIn("แก้ปัญหากล้อง Xiaomi รุ่นเก่าภาพดีเลย์ด้วย Local RTSP Bridge", html)
        self.assertIn("go2rtc", html)
        self.assertEqual(len(re.findall(r'<section[^>]+class="content-section', html)), 22)
        self.assertEqual(html.count('class="nav-item'), 22)
        self.assertEqual(html.count('data-target="'), 22)
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
            self.assertNotIn("exif", {key.lower() for key in image.info})
            self.assertNotIn("icc_profile", {key.lower() for key in image.info})
        self.assertGreater(COVER_PATH.stat().st_size, 30_000)
        template = ROOT / "templates" / f"{BOOK_ID}-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(COVER_SOURCE_SHA256, template_text)
        self.assertIn("project-owner supplied", template_text)


if __name__ == "__main__":
    unittest.main()
