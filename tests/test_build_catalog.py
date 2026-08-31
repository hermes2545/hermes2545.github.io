import html
import json
import unittest
from html.parser import HTMLParser
from pathlib import Path

from scripts.build_catalog import SHELF_SIZE, load_books, render_homepage

ROOT = Path(__file__).resolve().parents[1]


class AnchorNestingParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.nested = 0

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            if self.depth:
                self.nested += 1
            self.depth += 1

    def handle_endtag(self, tag):
        if tag == "a" and self.depth:
            self.depth -= 1


class HomepageBuildTests(unittest.TestCase):
    def setUp(self):
        self.books = load_books(ROOT / "data" / "books.json")
        self.html = render_homepage(self.books)

    def test_homepage_renders_every_book_once(self):
        self.assertEqual(self.html.count('class="book-card"'), len(self.books))
        for book in self.books:
            self.assertEqual(self.html.count(f'href="{book["href"]}"'), 3)
            self.assertIn(html.escape(book["short_title"]), self.html)

    def test_books_open_in_a_new_tab_with_safe_rel(self):
        self.assertEqual(self.html.count('target="_blank"'), len(self.books) * 2 + 1)
        self.assertEqual(self.html.count('rel="noopener"'), len(self.books) * 2 + 1)
        self.assertIn('class="footer-facebook-link"', self.html)

    def test_reading_books_have_glass_circle_html_download_after_date(self):
        self.assertEqual(self.html.count('class="book-download-html book-download-html--glass"'), len(self.books))
        self.assertEqual(self.html.count(" download "), len(self.books))
        self.assertEqual(self.html.count('title="ดาวน์โหลด HTML"'), len(self.books))
        parser = AnchorNestingParser()
        parser.feed(self.html)
        self.assertEqual(parser.nested, 0)

        cards = self.html.split('<article class="book-card"')[1:]
        self.assertEqual(len(cards), len(self.books))
        for book, card in zip(self.books, cards):
            href = html.escape(book["href"])
            title = html.escape(book["title"])
            self.assertIn('class="book-date-line"', card)
            self.assertIn(
                f'<a class="book-download-html book-download-html--glass" href="{href}" download '
                f'aria-label="ดาวน์โหลด HTML: {title}" title="ดาวน์โหลด HTML">',
                card,
            )
            self.assertLess(card.index('class="publish-date"'), card.index('class="book-download-html book-download-html--glass"'))
            self.assertLess(card.index('class="book-download-html book-download-html--glass"'), card.index('class="book-summary"'))

        stylesheet = (ROOT / "assets" / "css" / "reading-library.css").read_text(encoding="utf-8")
        self.assertIn(".book-download-html--glass", stylesheet)
        self.assertIn("border-radius: 999px;", stylesheet)
        self.assertIn("backdrop-filter: blur(12px) saturate(1.16);", stylesheet)

    def test_reading_text_is_above_each_book_cover(self):
        cards = self.html.split('<article class="book-card"')[1:]
        self.assertEqual(len(cards), len(self.books))
        for card in cards:
            self.assertLess(card.index('class="book-meta"'), card.index('class="book-cover-wrap"'))

    def test_reading_categories_are_metal_plaques_on_shelf_edges(self):
        self.assertNotIn('class="book-category"', self.html)
        self.assertNotIn('class="filters"', self.html)
        self.assertNotIn('class="filter-button"', self.html)
        expected_shelves = (len(self.books) + SHELF_SIZE - 1) // SHELF_SIZE
        self.assertEqual(self.html.count('class="shelf-label-grid"'), expected_shelves)
        self.assertEqual(self.html.count('class="shelf-category-plaque"'), len(self.books))
        for book in self.books:
            plaque = (
                f'class="shelf-category-plaque" type="button" '
                f'data-category-filter="{html.escape(book["category"])}" aria-pressed="false">'
                f'{html.escape(book["category"])}</button>'
            )
            self.assertIn(plaque, self.html)
        stylesheet = (ROOT / "assets" / "css" / "library.css").read_text(encoding="utf-8")
        self.assertIn(".shelf-category-plaque", stylesheet)
        self.assertIn('.shelf-category-plaque[aria-pressed="true"]', stylesheet)
        script = (ROOT / "assets" / "js" / "library.js").read_text(encoding="utf-8")
        self.assertIn("function buildShelfLabels", script)
        self.assertIn("data-category-filter", script)
        self.assertIn('room.addEventListener("click"', script)

    def test_books_are_sorted_newest_first_and_show_publish_date(self):
        timestamps = [book["published_at"] for book in self.books]
        self.assertEqual(timestamps, sorted(timestamps, reverse=True))
        raw_books = json.loads((ROOT / "data" / "books.json").read_text(encoding="utf-8"))
        expected_first = max(raw_books, key=lambda book: (book["published_at"], book["title"]))
        self.assertEqual(self.books[0]["short_title"], expected_first["short_title"])
        published = expected_first["published_at"][:10].split("-")
        self.assertIn(f'publish on {published[2]}/{published[1]}/{published[0]}', self.html)
        first_card = self.html.index('class="book-card"')
        first_title = self.html.index(html.escape(expected_first["short_title"]))
        self.assertGreater(first_title, first_card)

    def test_homepage_is_semantic_accessible_and_progressive(self):
        required = [
            '<html lang="th">',
            '<main id="main-content">',
            'class="skip-link"',
            'aria-label="ค้นหาหนังสือ"',
            'aria-live="polite"',
            '<noscript>',
            'assets/css/library.css',
            'assets/js/library.js',
        ]
        for marker in required:
            self.assertIn(marker, self.html)

    def test_new_brand_navigation_icons_and_library_favicon(self):
        self.assertIn("Coffee and Books", self.html)
        self.assertIn("Curated Guides, Ideas &amp; Audio", self.html)
        self.assertIn('href="assets/icons/shelfkeeper-librarian.webp"', self.html)
        self.assertIn('src="assets/icons/shelfkeeper-librarian.webp"', self.html)
        self.assertEqual(self.html.count('class="nav-icon"'), 4)
        self.assertIn('href="app-library.html"', self.html)
        self.assertIn('href="gallery.html"', self.html)

    def test_reading_room_uses_bright_garden_glass_and_text_only_book_metadata(self):
        template = (ROOT / "templates" / "index.template.html").read_text(encoding="utf-8")
        stylesheet_path = ROOT / "assets" / "css" / "reading-library.css"
        self.assertTrue(stylesheet_path.is_file())
        stylesheet = stylesheet_path.read_text(encoding="utf-8")
        garden = ROOT / "assets" / "reading-room" / "garden-sunlight.webp"
        header = ROOT / "assets" / "reading-room" / "retouched-coffee-header.webp"
        old_latte = ROOT / "assets" / "reading-room" / "latte-art-leaf.webp"
        attribution = ROOT / "docs" / "reports" / "READING_ROOM_IMAGE_ATTRIBUTION.md"
        self.assertIn("<h1>Coffee and Books</h1>", template)
        self.assertNotIn('class="latte-title-art"', template)
        self.assertNotIn('src="assets/reading-room/latte-art-leaf.webp"', template)
        self.assertNotIn('class="collection-seal"', template)
        self.assertTrue(garden.is_file())
        self.assertTrue(header.is_file())
        self.assertFalse(old_latte.exists())
        self.assertGreater(garden.stat().st_size, 100000)
        self.assertGreater(header.stat().st_size, 100000)
        for asset in (garden, header):
            data = asset.read_bytes()
            self.assertEqual(data[:4], b"RIFF")
            self.assertEqual(data[8:12], b"WEBP")
        self.assertTrue(attribution.is_file())
        self.assertIn("Ran Ding", attribution.read_text(encoding="utf-8"))
        self.assertIn("User-supplied approved header", attribution.read_text(encoding="utf-8"))
        self.assertIn('url("../reading-room/garden-sunlight.webp")', stylesheet)
        self.assertIn('url("../reading-room/retouched-coffee-header.webp")', stylesheet)
        self.assertIn("backdrop-filter: blur(34px)", stylesheet)
        self.assertIn(".book-meta {", stylesheet)
        self.assertIn("background: transparent;", stylesheet)
        self.assertIn("border: 0;", stylesheet)
        self.assertIn("box-shadow: none;", stylesheet)
        self.assertIn("backdrop-filter: none;", stylesheet)

    def test_reading_panels_share_one_width_and_garden_keeps_natural_color(self):
        stylesheet_path = ROOT / "assets" / "css" / "reading-library.css"
        self.assertTrue(stylesheet_path.is_file())
        stylesheet = stylesheet_path.read_text(encoding="utf-8")
        self.assertIn("--reading-panel-width: min(1180px, calc(100% - 1rem));", stylesheet)
        self.assertIn(".site-nav {\n  width: var(--reading-panel-width);", stylesheet)
        self.assertIn('background: #dce6d5 url("../reading-room/retouched-coffee-header.webp") center / cover no-repeat;', stylesheet)
        self.assertIn("background: url(\"../reading-room/garden-sunlight.webp\") center 39% / cover no-repeat;", stylesheet)
        self.assertIn("filter: none;", stylesheet)
        self.assertIn("body::after { content: none; }", stylesheet)

    def test_coffee_theme_is_loaded_only_by_the_reading_collection(self):
        reading = (ROOT / "templates" / "index.template.html").read_text(encoding="utf-8")
        audio = (ROOT / "templates" / "audio-library.template.html").read_text(encoding="utf-8")
        app = (ROOT / "templates" / "app-library.template.html").read_text(encoding="utf-8")
        shared = (ROOT / "assets" / "css" / "library.css").read_text(encoding="utf-8")
        self.assertIn('href="assets/css/reading-library.css"', reading)
        self.assertNotIn("reading-library.css", audio)
        self.assertNotIn("reading-library.css", app)
        self.assertNotIn("Coffee and Books — bright garden glass reading room", shared)
        self.assertNotIn("garden-sunlight.webp", shared)
        self.assertNotIn("retouched-coffee-header.webp", shared)

    def test_all_collections_load_one_shared_sticky_library_dock_last(self):
        templates = {
            "reading": (ROOT / "templates" / "index.template.html").read_text(encoding="utf-8"),
            "audio": (ROOT / "templates" / "audio-library.template.html").read_text(encoding="utf-8"),
            "app": (ROOT / "templates" / "app-library.template.html").read_text(encoding="utf-8"),
        }
        self.assertIn('<body class="reading-page">', templates["reading"])
        for name, template in templates.items():
            self.assertEqual(template.count('href="assets/css/library-dock.css"'), 1, name)
            self.assertGreater(template.index('href="assets/css/library-dock.css"'), template.rindex('rel="stylesheet"'), name)
        dock = (ROOT / "assets" / "css" / "library-dock.css").read_text(encoding="utf-8")
        for marker in (
            "position: sticky;",
            "top: 12px;",
            "width: min(720px, calc(100% - 24px));",
            "grid-template-columns: repeat(4, minmax(0, 1fr));",
            "backdrop-filter: blur(24px) saturate(1.65);",
            ".reading-page { --dock-accent: #2f6f50;",
            ".audio-page { --dock-accent: #0071e3;",
            ".app-page { --dock-accent: #00758a;",
            ".gallery-page { --dock-accent:",
            "@media (max-width: 650px)",
            "min-height: 46px;",
        ):
            self.assertIn(marker, dock)

    def test_homepage_escapes_catalog_text(self):
        book = dict(self.books[0])
        book["title"] = '<script>alert("x")</script>'
        escaped = render_homepage([book])
        self.assertNotIn('<script>alert("x")</script>', escaped)
        self.assertIn('&lt;script&gt;', escaped)

    def test_checked_in_index_matches_generator(self):
        index = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertEqual(index, self.html)
        self.assertNotIn("/home/", index)


if __name__ == "__main__":
    unittest.main()
