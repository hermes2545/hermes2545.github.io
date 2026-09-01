import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "human-ai-communication-framework"
HTML_PATH = ROOT / "Human_AI_Communication_Framework_Interactive_Reference_Manual.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
APPROVED_HTML_SHA256 = "95de03e50046b439a5a7deb2793359cf4da887001fe893d2e1be53fec5dc1fb9"


class HumanAICommunicationFrameworkReadingTests(unittest.TestCase):
    def test_catalog_contains_human_ai_communication_framework_once(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "Human–AI Communication Framework")
        self.assertEqual(book["short_title"], "Human–AI Communication Framework")
        self.assertEqual(book["href"], "Human_AI_Communication_Framework_Interactive_Reference_Manual.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "Human–AI Interaction")
        self.assertEqual(book["published_at"], "2026-09-01T18:41:33+07:00")
        self.assertIn("กรอบการออกแบบการสื่อสารระหว่างมนุษย์กับ AI", book["summary"])
        self.assertIn("bilingual", book["summary"].lower())
        self.assertEqual(books[1]["id"], BOOK_ID)

    def test_html_is_byte_preserved_and_public_safe(self):
        self.assertTrue(HTML_PATH.is_file())
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertEqual(hashlib.sha256(HTML_PATH.read_bytes()).hexdigest(), APPROVED_HTML_SHA256)
        self.assertEqual(html.count('<section class="home-page"'), 1)
        self.assertEqual(html.count('<section class="content-page"'), 15)
        self.assertEqual(len(re.findall(r'<button class="nav-btn(?: active)?"', html)), 16)
        for marker in (
            "Human ↔ AI Communication Manual",
            "Interactive Reference · M3 Edition",
            "กรอบคิดสำหรับออกแบบระบบที่ทำให้มนุษย์กับ AI เข้าใจกัน",
            "Human learns the software",
            "System learns the human’s intent",
            "Conversation",
            "Ambient AI",
            "Delegation",
            "Agent-to-Agent",
            "Generated UI",
            "Physical / Spatial",
            "M3 Edition",
            "localStorage",
        ):
            self.assertIn(marker, html)
        self.assertNotIn("ค่ะ", html)
        self.assertNotRegex(
            html,
            r"/" + "home" + r"/p2544|doc_" + "cd59dc3a55fc" + r"|img_" + "d6fbdd4aa54a",
        )
        secret_pattern = (
            r"AI" + r"za|ya29\\.|ghp" + r"_|github" + r"_pat_|sk-[A-Za-z0-9]{16,}|BEGIN [A-Z ]*PRIVATE KEY"
        )
        self.assertNotRegex(html, secret_pattern)

        scripts = "\n".join(re.findall(r"<script>(.*?)</script>", html, flags=re.S))
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
        self.assertGreater(COVER_PATH.stat().st_size, 50_000)


if __name__ == "__main__":
    unittest.main()
