import hashlib
import json
import re
import subprocess
import unittest
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BOOK_ID = "podcast-visual-storyboard-ai-prompting"
HTML_PATH = ROOT / "Podcast_Visual_Storyboard_AI_Prompting_Manual.html"
COVER_PATH = ROOT / "assets" / "covers" / "custom" / f"{BOOK_ID}.webp"
SOURCE_MD = ROOT / "docs" / "guides" / "PODCAST_VISUAL_STORYBOARD_AI_PROMPTING.md"
SOURCE_SHA256 = "a866790b1b889bae2e0b6a4afa0e0940c08c7bf4dde614c33b1e6ee04dfb94ba"
SUPPLIED_HTML_SHA256 = "145ffc4cf7d08a74b78ebb6ab8d11b41931a00533b49d04699c6ad5f066fc4fc"
COVER_SOURCE_SHA256 = "473cd73f7637df4167369e98c82994115c31172534dfdc818bd19ae1549ad047"
PROHIBITED_PUBLIC_RE = re.compile(
    "|".join(
        [
            "/" + "home" + "/" + "p2544",
            r"drive\.google",
            "1RI" + "mkE1",
            r"doc_[A-Za-z0-9]",
            r"img_[A-Za-z0-9]",
            "AI" + "za",
            "ya" + r"29\.",
            "gh" + "p_",
            "github" + "_pat_",
            "sk" + r"-[A-Za-z0-9]{16,}",
            r"BEGIN [A-Z ]*PRIVATE KEY",
        ]
    )
)


class PodcastVisualStoryboardAIPromptingReadingTests(unittest.TestCase):
    def test_catalog_contains_podcast_visual_storyboard_manual_once(self):
        books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        matches = [book for book in books if book["id"] == BOOK_ID]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "Podcast Visual Storyboard & AI Image Prompting")
        self.assertEqual(book["short_title"], "Podcast Visual Storyboard")
        self.assertEqual(book["href"], "Podcast_Visual_Storyboard_AI_Prompting_Manual.html")
        self.assertEqual(book["cover"], f"assets/covers/custom/{BOOK_ID}.webp")
        self.assertEqual(book["category"], "AI Design Workflow")
        self.assertRegex(book["published_at"], r"^2026-09-0[12]T\d{2}:\d{2}:\d{2}\+07:00$")
        self.assertIn("podcast", book["summary"].lower())
        self.assertIn("storyboard", book["summary"].lower())
        self.assertEqual(books[0]["id"], BOOK_ID)

    def test_source_markdown_is_public_safe_and_preserved(self):
        self.assertTrue(SOURCE_MD.is_file())
        source = SOURCE_MD.read_text(encoding="utf-8")
        self.assertEqual(hashlib.sha256(SOURCE_MD.read_bytes()).hexdigest(), SOURCE_SHA256)
        self.assertIn("Podcast Visual Storyboard & AI Image Prompting", source)
        self.assertIn("Default negative prompt", source)
        self.assertIn("Numbered preset style library", source)
        self.assertIn("Style bible", source)
        self.assertNotRegex(source, PROHIBITED_PUBLIC_RE)

    def test_html_uses_owner_supplied_interactive_manual_v2(self):
        self.assertTrue(HTML_PATH.is_file())
        html = HTML_PATH.read_text(encoding="utf-8")
        self.assertEqual(hashlib.sha256(HTML_PATH.read_bytes()).hexdigest(), SUPPLIED_HTML_SHA256)
        self.assertEqual(html.count('<section class="view'), 23)
        self.assertEqual(html.count('<button class="nav-item'), 23)
        for marker in (
            "Interactive Reference Manual · v2.0.0",
            "Podcast Visual Storyboard",
            "AI Image Prompting",
            "27 style presets",
            "Manual chapters",
            "Narration/transcript → story beats",
            "Default Negative Prompt",
            "Numbered Preset Style Library",
            "Blueprint Systems Visualization",
            "Quiet Luxury Business Documentary",
            "Master Prompt to Give Another AI",
            "Recommended Production Pipeline",
            "localStorage",
            "navigator.clipboard",
            "@media print",
        ):
            self.assertIn(marker, html)
        self.assertIn('data-target="section-22"', html)
        self.assertIn('id="mobileSearchBtn"', html)
        self.assertNotIn("ค่ะ", html)
        self.assertNotRegex(html, PROHIBITED_PUBLIC_RE)
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
        template = ROOT / "templates" / "podcast-visual-storyboard-ai-prompting-cover.template.md"
        self.assertTrue(template.is_file())
        self.assertIn(COVER_SOURCE_SHA256, template.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
