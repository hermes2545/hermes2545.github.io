import html
import json
import unittest
from pathlib import Path

from scripts.build_audio_library import load_audio_books, render_audio_library

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "audio-books.json"


class AudioLibraryTests(unittest.TestCase):
    def setUp(self):
        self.items = load_audio_books(CATALOG)
        self.page = render_audio_library(self.items)

    def test_playlist_catalog_is_complete_and_unique(self):
        self.assertEqual(len(self.items), 47)
        self.assertEqual(len({item["video_id"] for item in self.items}), 47)
        self.assertEqual(len({item["youtube_url"] for item in self.items}), 47)

    def test_catalog_is_sorted_newest_first_with_playlist_order_as_tiebreak(self):
        expected = sorted(
            self.items,
            key=lambda item: (-item["published_epoch_ms"], item["playlist_position"]),
        )
        self.assertEqual(self.items, expected)
        self.assertEqual(self.items[0]["video_id"], "KtHYNnLM_Dk")

    def test_latest_hermes_inside_podcast_metadata(self):
        item = self.items[0]
        self.assertEqual(item["title"], "ในหัวของ Hermes มีอะไร? แกะระบบ AI Agent ให้คนทั่วไปเข้าใจ")
        self.assertEqual(item["duration_seconds"], 2070)
        self.assertEqual(item["playlist_position"], 1)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_every_audio_book_has_a_local_cover_and_required_metadata(self):
        required = {
            "video_id", "title", "youtube_url", "cover", "duration_seconds",
            "published_epoch_ms", "published_at", "playlist_position", "uploader",
        }
        for item in self.items:
            self.assertTrue(required <= item.keys(), item)
            cover = ROOT / item["cover"]
            self.assertTrue(cover.is_file(), cover)
            self.assertGreater(cover.stat().st_size, 500, cover)

    def test_page_renders_all_items_with_dates_durations_and_new_tabs(self):
        self.assertEqual(self.page.count('class="book-card audio-card"'), 47)
        self.assertEqual(self.page.count('target="_blank"'), 48)  # 47 items + playlist button
        self.assertEqual(self.page.count('rel="noopener"'), 48)
        self.assertEqual(self.page.count('publish on '), 47)
        self.assertEqual(self.page.count('class="audio-duration"'), 47)
        self.assertIn('publish on 24/08/2026', self.page)
        self.assertIn('25:42', self.page)

    def test_audio_covers_show_full_four_by_three_thumbnail_over_play_panel(self):
        self.assertEqual(self.page.count('class="audio-thumbnail-frame"'), 47)
        self.assertEqual(self.page.count('class="audio-play-panel"'), 47)
        self.assertEqual(self.page.count('class="audio-play-button"'), 47)

    def test_audio_cards_are_ipods_without_audio_book_kickers(self):
        self.assertNotIn("AUDIO BOOK", self.page)
        self.assertEqual(self.page.count('class="book-cover-wrap audio-cover-wrap audio-ipod"'), 47)
        self.assertEqual(self.page.count('class="audio-click-wheel"'), 47)
        stylesheet = (ROOT / "assets" / "css" / "audio-library.css").read_text(encoding="utf-8")
        self.assertIn(".audio-ipod", stylesheet)
        self.assertIn("aspect-ratio: 2 / 3;", stylesheet)
        self.assertIn(".audio-card .book-cover-wrap::before", stylesheet)

    def test_duration_is_in_the_lower_panel_above_play(self):
        cards = self.page.split('<article class="book-card audio-card"')[1:]
        self.assertEqual(len(cards), 47)
        for card in cards:
            for marker in (
                'class="audio-play-panel"',
                'class="audio-duration"',
                'class="audio-click-wheel"',
                'class="audio-play-label"',
            ):
                self.assertIn(marker, card)
            panel = card.index('class="audio-play-panel"')
            duration = card.index('class="audio-duration"')
            wheel = card.index('class="audio-click-wheel"')
            play = card.index('class="audio-play-label"')
            self.assertLess(panel, duration)
            self.assertLess(duration, wheel)
            self.assertLess(wheel, play)
        self.assertEqual(self.page.count('class="audio-play-label">PLAY'), 47)

    def test_audio_text_is_above_each_book_cover(self):
        cards = self.page.split('<article class="book-card audio-card"')[1:]
        self.assertEqual(len(cards), 47)
        for card in cards:
            self.assertLess(card.index('class="book-meta audio-meta"'), card.index('class="book-cover-wrap audio-cover-wrap audio-ipod"'))

    def test_book_bottoms_keep_small_clearance_above_the_shelf(self):
        stylesheet = (ROOT / "assets" / "css" / "library.css").read_text(encoding="utf-8")
        self.assertIn("padding: 0 clamp(.3rem, 1.4vw, 1rem) 1.25rem;", stylesheet)
        self.assertIn(".book-cover-wrap {\n  position: relative;\n  width: 100%;", stylesheet)

    def test_responsive_layout_rebuilds_one_shelf_per_visual_row(self):
        script = (ROOT / "assets" / "js" / "library.js").read_text(encoding="utf-8")
        self.assertIn("function layoutShelves()", script)
        self.assertIn("function columnsForViewport()", script)

    def test_new_brand_navigation_icons_and_library_favicon(self):
        self.assertIn("The Knowledge Shelf", self.page)
        self.assertIn("Curated Guides, Ideas &amp; Audio", self.page)
        self.assertIn('href="assets/icons/library.svg"', self.page)
        self.assertEqual(self.page.count('class="nav-icon"'), 2)

    def test_publish_badge_is_visibly_larger_on_both_pages(self):
        stylesheet = (ROOT / "assets" / "css" / "library.css").read_text(encoding="utf-8")
        self.assertIn("font-size: .62rem;", stylesheet)

    def test_checked_in_audio_page_matches_generator(self):
        checked_in = (ROOT / "audio-library.html").read_text(encoding="utf-8")
        self.assertEqual(checked_in, self.page)
        self.assertNotIn("/home/", checked_in)

    def test_search_status_uses_audio_book_noun(self):
        script = (ROOT / "assets" / "js" / "library.js").read_text(encoding="utf-8")
        self.assertIn('"หนังสือเสียง"', script)

    def test_navigation_connects_both_library_pages(self):
        homepage = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn('href="audio-library.html"', homepage)
        self.assertIn('href="index.html"', self.page)
        self.assertIn('aria-current="page"', self.page)


if __name__ == "__main__":
    unittest.main()
