import html
import json
import unittest
from pathlib import Path

from PIL import Image

from scripts.build_gallery import load_gallery, render_gallery

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "gallery.json"


class GalleryTests(unittest.TestCase):
    def setUp(self):
        self.items = load_gallery(CATALOG)
        self.page = render_gallery(self.items)

    def test_catalog_has_ten_unique_minimal_records(self):
        required = {
            "id", "title", "category", "format", "published_at",
            "image", "alt", "featured_order",
        }
        self.assertEqual(len(self.items), 10)
        self.assertEqual(len({item["id"] for item in self.items}), 10)
        self.assertEqual({item["category"] for item in self.items}, {"AI", "Data", "Security", "Development"})
        self.assertEqual({item["featured_order"] for item in self.items}, set(range(1, 11)))
        for item in self.items:
            self.assertEqual(set(item), required, item)
            self.assertRegex(item["published_at"], r"^\d{4}-\d{2}-\d{2}$")
            self.assertTrue(item["alt"].strip())
            self.assertRegex(item["image"], r"^assets/gallery/artworks/[a-z0-9-]+\.(?:png|webp)$")

    def test_user_supplied_gallery_images_are_first_and_local(self):
        expected = (
            (
                "hermes-home-assistant",
                "Hermes x Home Assistant",
                "Development",
                "A4",
                "assets/gallery/artworks/09-hermes-home-assistant.webp",
            ),
            (
                "ai-agent-web-access-barriers",
                "ทำไม AI Agent ถึงเข้าเว็บนี้ไม่ได้?",
                "Security",
                "16:9",
                "assets/gallery/artworks/10-ai-agent-web-access-barriers.webp",
            ),
        )
        for item, values in zip(self.items[:2], expected):
            self.assertEqual(
                (item["id"], item["title"], item["category"], item["format"], item["image"]),
                values,
            )
            self.assertEqual(item["published_at"], "2026-08-26")

    def test_catalog_images_are_ten_local_gallery_assets(self):
        expected_sizes = {
            "09-hermes-home-assistant.webp": (906, 1280),
            "10-ai-agent-web-access-barriers.webp": (1280, 720),
            "01-how-ai-agents-work-16x9.png": (1600, 900),
            "02-rag-architecture-4x3.png": (1200, 900),
            "03-cloud-vs-on-premise-square.png": (1080, 1080),
            "04-system-design-overview-16x9.png": (1600, 900),
            "05-cybersecurity-checklist-square.png": (1080, 1080),
            "06-git-workflow-4x3.png": (1200, 900),
            "07-evolution-of-ai-tall-poster.png": (900, 1600),
            "08-linux-command-cheat-sheet-a4.png": (1240, 1754),
        }
        self.assertEqual({Path(item["image"]).name for item in self.items}, set(expected_sizes))
        for item in self.items:
            image_path = ROOT / item["image"]
            self.assertTrue(image_path.is_file(), image_path)
            with Image.open(image_path) as image:
                expected_format = "WEBP" if image_path.suffix == ".webp" else "PNG"
                self.assertEqual(image.format, expected_format)
                self.assertEqual(image.mode, "RGB")
                self.assertEqual(image.size, expected_sizes[image_path.name])
                self.assertEqual(len(image.getexif()), 0)

    def test_user_supplied_hero_is_public_exif_free_webp(self):
        hero = ROOT / "assets" / "gallery" / "gallery-hero.webp"
        self.assertTrue(hero.is_file())
        with Image.open(hero) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(image.size, (1280, 559))
            self.assertEqual(len(image.getexif()), 0)
        self.assertIn('src="assets/gallery/gallery-hero.webp"', self.page)
        self.assertNotIn("/home/", self.page)

    def test_page_renders_accessible_controls_and_all_artworks(self):
        self.assertEqual(self.page.count('class="art-card"'), len(self.items))
        for item in self.items:
            self.assertEqual(self.page.count(f'src="{item["image"]}"'), 1)
            self.assertIn(html.escape(item["title"]), self.page)
            self.assertIn(html.escape(item["alt"]), self.page)
        for marker in (
            '<html lang="th">',
            '<main id="main-content">',
            'class="skip-link"',
            'aria-live="polite"',
            'data-filter="All"',
            'id="gallery-sort"',
            'id="grid-view"',
            'id="list-view"',
            '<dialog id="gallery-viewer"',
            'aria-label="ปิดภาพเต็ม"',
            'aria-label="ภาพก่อนหน้า"',
            'aria-label="ภาพถัดไป"',
            '<noscript>',
            'assets/css/gallery.css',
            'assets/css/library-dock.css',
            'assets/js/gallery.js',
        ):
            self.assertIn(marker, self.page)

    def test_gallery_styles_support_four_two_one_columns_and_shared_dock(self):
        stylesheet = (ROOT / "assets" / "css" / "gallery.css").read_text(encoding="utf-8")
        self.assertIn("grid-template-columns: repeat(4, minmax(0, 1fr));", stylesheet)
        self.assertIn("grid-template-columns: repeat(2, minmax(0, 1fr));", stylesheet)
        self.assertIn("grid-template-columns: 1fr;", stylesheet)
        self.assertIn("@media (prefers-reduced-motion: reduce)", stylesheet)
        dock = (ROOT / "assets" / "css" / "library-dock.css").read_text(encoding="utf-8")
        self.assertIn("width: min(720px, calc(100% - 24px));", dock)
        self.assertIn("grid-template-columns: repeat(4, minmax(0, 1fr));", dock)
        self.assertIn(".gallery-page { --dock-accent:", dock)
        self.assertIn("min-height: 46px;", dock)

    def test_gallery_script_supports_filter_sort_views_and_keyboard_lightbox(self):
        script = (ROOT / "assets" / "js" / "gallery.js").read_text(encoding="utf-8")
        for marker in (
            "function applyGalleryState()",
            "function setView(",
            "function openViewer(",
            "function closeViewer(",
            'event.key === "ArrowLeft"',
            'event.key === "ArrowRight"',
            'event.key === "Escape"',
            "returnFocus.focus()",
            "aria-pressed",
        ):
            self.assertIn(marker, script)

    def test_lightbox_supports_button_zoom_keyboard_zoom_and_pointer_pan(self):
        for marker in (
            'id="zoom-out"',
            'id="zoom-reset"',
            'id="zoom-in"',
            'id="zoom-level"',
            'aria-label="ซูมออก"',
            'aria-label="รีเซ็ตการซูม"',
            'aria-label="ซูมเข้า"',
        ):
            self.assertIn(marker, self.page)

        script = (ROOT / "assets" / "js" / "gallery.js").read_text(encoding="utf-8")
        for marker in (
            "const MIN_ZOOM = 1",
            "const MAX_ZOOM = 4",
            "const ZOOM_STEP = 0.25",
            "function setZoom(",
            "function resetViewport()",
            "function clampPan()",
            'addEventListener("pointerdown"',
            'addEventListener("pointermove"',
            'addEventListener("pointerup"',
            'event.key === "+" || event.key === "="',
            'event.key === "-"',
            'event.key === "0"',
            "setPointerCapture",
        ):
            self.assertIn(marker, script)

        stylesheet = (ROOT / "assets" / "css" / "gallery.css").read_text(encoding="utf-8")
        for marker in (
            ".zoom-toolbar",
            "cursor: grab;",
            "cursor: grabbing;",
            "touch-action: none;",
            "transform-origin: center;",
        ):
            self.assertIn(marker, stylesheet)

    def test_lightbox_separates_the_pan_viewport_from_the_caption(self):
        self.assertIn('<div class="lightbox-media"><img id="viewer-image" alt=""></div>', self.page)
        self.assertIn('<figcaption class="lightbox-caption">', self.page)
        self.assertNotIn('<figure class="lightbox-figure"><img id="viewer-image"', self.page)

        script = (ROOT / "assets" / "js" / "gallery.js").read_text(encoding="utf-8")
        self.assertIn('const viewerFrame = dialog.querySelector(".lightbox-media")', script)
        self.assertIn("viewerImage.offsetWidth * zoom - viewerFrame.clientWidth", script)
        self.assertIn("viewerImage.offsetHeight * zoom - viewerFrame.clientHeight", script)

        stylesheet = (ROOT / "assets" / "css" / "gallery.css").read_text(encoding="utf-8")
        self.assertIn(".lightbox-media {", stylesheet)
        self.assertIn(".lightbox-figure {", stylesheet)
        self.assertIn("grid-template-rows: minmax(0, 1fr) auto;", stylesheet)

    def test_all_four_templates_have_four_way_navigation(self):
        templates = (
            "index.template.html",
            "audio-library.template.html",
            "app-library.template.html",
            "gallery.template.html",
        )
        for name in templates:
            text = (ROOT / "templates" / name).read_text(encoding="utf-8")
            for href in ("index.html", "audio-library.html", "app-library.html", "gallery.html"):
                self.assertIn(f'href="{href}"', text, name)
            self.assertEqual(text.count('class="nav-icon"'), 4, name)

    def test_all_collection_docks_put_gallery_before_app_with_thai_label(self):
        for name in (
            "index.template.html",
            "audio-library.template.html",
            "app-library.template.html",
            "gallery.template.html",
        ):
            text = (ROOT / "templates" / name).read_text(encoding="utf-8")
            self.assertLess(text.index('href="gallery.html"'), text.index('href="app-library.html"'), name)
            gallery_link = text.split('href="gallery.html"', 1)[1].split("</a>", 1)[0]
            self.assertTrue(gallery_link.endswith("แกลอรี่"), name)

    def test_gallery_attribution_is_public_safe(self):
        report = ROOT / "docs" / "reports" / "GALLERY_IMAGE_ATTRIBUTION.md"
        self.assertTrue(report.is_file())
        text = report.read_text(encoding="utf-8")
        self.assertIn("user/project-owner supplied", text)
        self.assertIn("original project assets", text)
        self.assertNotIn("/home/", text)
        self.assertNotIn(".hermes/", text)

    def test_gallery_escapes_catalog_text(self):
        item = dict(self.items[0])
        item["title"] = '<script>alert("x")</script>'
        rendered = render_gallery([item])
        self.assertNotIn('<script>alert("x")</script>', rendered)
        self.assertIn("&lt;script&gt;", rendered)

    def test_checked_in_gallery_matches_generator(self):
        checked_in = (ROOT / "gallery.html").read_text(encoding="utf-8")
        self.assertEqual(checked_in, self.page)
        self.assertNotIn("/home/", checked_in)


if __name__ == "__main__":
    unittest.main()
