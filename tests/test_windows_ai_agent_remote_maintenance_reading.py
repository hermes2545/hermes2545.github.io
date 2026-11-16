import base64
import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "windows-ai-agent-remote-maintenance-guide"
HTML_PATH = ROOT / "Windows_AI_Agent_Remote_Maintenance_Guide.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
FINAL_HTML_SHA256 = "26db6fb1d75a5ec7f297332a1c04270e789cd13ec94b4c0e0868f79ece300184"
EMBEDDED_ART_SHA256 = "f6d4ef4ece640dc84588dcd5ce93145262cb2540421745c2e61ae9f52f9198ce"
OWNER_COVER_SOURCE_SHA256 = "a3657e69d33bf1845415b03a70894c2d0a57e9e23beda5fe8358676e49ce13ab"
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


class WindowsAiAgentRemoteMaintenanceReadingTests(unittest.TestCase):
    def test_catalog_contains_guide_once_as_newest(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "ขีดความสามารถในการดูแลระบบ Windows ระยะไกลด้วย AI Agent")
        self.assertEqual(book["short_title"], "ดูแล Windows ระยะไกลด้วย AI")
        self.assertEqual(book["href"], "Windows_AI_Agent_Remote_Maintenance_Guide.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "AI Operations")
        self.assertEqual(book["published_at"], "2026-11-16T14:00:13+07:00")
        self.assertIn("22 บท", book["summary"])
        self.assertEqual(book["accent"], "#177963")
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_owner_supplied_html_is_preserved_interactive_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html_bytes = HTML_PATH.read_bytes()
        self.assertEqual(hashlib.sha256(html_bytes).hexdigest(), FINAL_HTML_SHA256)
        html = html_bytes.decode("utf-8")
        self.assertIn("Windows Remote Maintenance · AI Agent Field Guide", html)
        self.assertIn("Read-only First", html)
        self.assertIn("Human Approval", html)
        self.assertIn("Rollback Ready", html)
        self.assertIn("navigator.clipboard", html)
        self.assertIn("@media print", html)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)

        data_match = re.search(
            r'<script type="application/json" id="manual-data">(.*?)</script>',
            html,
            flags=re.S,
        )
        self.assertIsNotNone(data_match)
        assert data_match is not None
        chapters = json.loads(data_match.group(1))
        self.assertEqual(len(chapters), 23)
        self.assertEqual([item["number"] for item in chapters], list(range(1, 24)))
        self.assertEqual(chapters[0]["id"], "chapter-01")
        self.assertEqual(chapters[-1]["id"], "summary")

        embedded_match = re.search(
            r'<img[^>]+src="data:image/webp;base64,([A-Za-z0-9+/=]+)"',
            html,
            flags=re.S | re.I,
        )
        self.assertIsNotNone(embedded_match)
        assert embedded_match is not None
        embedded_cover = base64.b64decode(embedded_match.group(1))
        self.assertEqual(hashlib.sha256(embedded_cover).hexdigest(), EMBEDDED_ART_SHA256)

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

    def test_final_owner_cover_replaces_embedded_art_without_cropping(self):
        self.assertTrue(COVER_PATH.is_file())
        with Image.open(COVER_PATH) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(getattr(image, "n_frames", 1), 1)
            self.assertEqual(dict(image.getexif()), {})
            self.assertNotIn("exif", {str(key).lower() for key in image.info})
            self.assertNotIn("icc_profile", {str(key).lower() for key in image.info})
        self.assertGreater(COVER_PATH.stat().st_size, 20_000)
        template = ROOT / "templates" / "windows-ai-agent-remote-maintenance-guide-cover.template.md"
        self.assertTrue(template.is_file())
        template_text = template.read_text(encoding="utf-8")
        self.assertIn(OWNER_COVER_SOURCE_SHA256, template_text)
        self.assertIn(hashlib.sha256(COVER_PATH.read_bytes()).hexdigest(), template_text)
        self.assertIn("project-owner supplied final cover image attachment", template_text)
        self.assertIn("aspect-preserving containment", template_text)
        self.assertIn("906×1280", template_text)
        self.assertIn("600×900", template_text)


if __name__ == "__main__":
    unittest.main()
