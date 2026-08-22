import html
import json
import unittest
from pathlib import Path

from scripts.build_catalog import load_books, render_homepage

ROOT = Path(__file__).resolve().parents[1]


class HomepageBuildTests(unittest.TestCase):
    def setUp(self):
        self.books = load_books(ROOT / "data" / "books.json")
        self.html = render_homepage(self.books)

    def test_homepage_renders_every_book_once(self):
        self.assertEqual(self.html.count('class="book-card"'), len(self.books))
        for book in self.books:
            self.assertEqual(self.html.count(f'href="{book["href"]}"'), 1)
            self.assertIn(html.escape(book["short_title"]), self.html)

    def test_books_open_in_a_new_tab_with_safe_rel(self):
        self.assertEqual(self.html.count('target="_blank"'), len(self.books))
        self.assertEqual(self.html.count('rel="noopener"'), len(self.books))

    def test_books_are_sorted_newest_first_and_show_publish_date(self):
        timestamps = [book["published_at"] for book in self.books]
        self.assertEqual(timestamps, sorted(timestamps, reverse=True))
        expected_first = 'Grok vs Hermes'
        self.assertEqual(self.books[0]["short_title"], expected_first)
        self.assertIn('publish on 22/08/2026', self.html)
        first_card = self.html.index('class="book-card"')
        first_title = self.html.index(expected_first)
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
        self.assertIn("The Knowledge Shelf", self.html)
        self.assertIn("Curated Guides, Ideas &amp; Audio", self.html)
        self.assertIn('href="assets/icons/library.svg"', self.html)
        self.assertEqual(self.html.count('class="nav-icon"'), 2)

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
