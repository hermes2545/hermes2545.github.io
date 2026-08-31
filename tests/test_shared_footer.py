import unittest
from pathlib import Path

from PIL import Image

from scripts.build_app_library import load_apps, render_app_library
from scripts.build_audio_library import load_audio_books, render_audio_library
from scripts.build_catalog import load_books, render_homepage
from scripts.build_gallery import load_gallery, render_gallery

ROOT = Path(__file__).resolve().parents[1]
FACEBOOK_URL = "https://www.facebook.com/octagon2544"
FOOTER_COPY = "Knowledge for Humans. Structured for AI."
FOOTER_MODES = "READ · LISTEN · SEE · USE"
FOOTER_ASSET = "assets/icons/facebook-f.webp"


class SharedFooterTests(unittest.TestCase):
    def setUp(self):
        self.pages = {
            "index.html": render_homepage(load_books(ROOT / "data" / "books.json")),
            "audio-library.html": render_audio_library(load_audio_books(ROOT / "data" / "audio-books.json")),
            "gallery.html": render_gallery(load_gallery(ROOT / "data" / "gallery.json")),
            "app-library.html": render_app_library(load_apps(ROOT / "data" / "apps.json")),
        }

    def test_all_collection_pages_use_selected_pill_dock_footer(self):
        for name, page in self.pages.items():
            with self.subTest(page=name):
                self.assertEqual(page.count('<footer class="library-footer'), 1)
                self.assertIn(FOOTER_COPY, page)
                self.assertIn(FOOTER_MODES, page)
                self.assertIn('class="footer-copy"', page)
                self.assertIn('class="footer-modes"', page)
                self.assertIn('class="footer-facebook-link"', page)
                self.assertIn(f'href="{FACEBOOK_URL}"', page)
                self.assertIn(f'src="{FOOTER_ASSET}"', page)
                self.assertIn('aria-label="Facebook: Octagon 2544"', page)
                self.assertNotIn(f'>{FACEBOOK_URL}<', page)
                self.assertNotIn('facebook.com/octagon2544</', page)

    def test_footer_asset_is_owner_supplied_webp_icon_safe(self):
        path = ROOT / FOOTER_ASSET
        self.assertTrue(path.is_file())
        with Image.open(path) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (500, 500))
            self.assertEqual(image.mode, "RGBA")
            self.assertEqual(len(image.getexif()), 0)

    def test_shared_footer_css_defines_pill_dock_and_mobile_layout(self):
        shared = (ROOT / "assets" / "css" / "library.css").read_text(encoding="utf-8")
        gallery = (ROOT / "assets" / "css" / "gallery.css").read_text(encoding="utf-8")
        for stylesheet in (shared, gallery):
            with self.subTest(stylesheet=stylesheet[:20]):
                self.assertIn(".library-footer", stylesheet)
                self.assertIn(".footer-facebook-link", stylesheet)
                self.assertIn("border-radius: 999px;", stylesheet)
                self.assertIn(".footer-social-icon", stylesheet)
                self.assertIn("@media (max-width: 650px)", stylesheet)

    def test_checked_in_pages_match_generators_after_footer_change(self):
        for filename, generated in self.pages.items():
            with self.subTest(page=filename):
                self.assertEqual((ROOT / filename).read_text(encoding="utf-8"), generated)
                self.assertNotIn("/home/", generated)


if __name__ == "__main__":
    unittest.main()
