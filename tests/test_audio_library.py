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
        self.assertEqual(len(self.items), 56)
        self.assertEqual(len({item["video_id"] for item in self.items}), 56)
        self.assertEqual(len({item["youtube_url"] for item in self.items}), 56)

    def test_catalog_is_sorted_newest_first_with_playlist_order_as_tiebreak(self):
        expected = sorted(
            self.items,
            key=lambda item: (-item["published_epoch_ms"], item["playlist_position"]),
        )
        self.assertEqual(self.items, expected)
        self.assertEqual(self.items[0]["video_id"], "wTrLXC427hg")

    def test_latest_ai_clone_identity_storyboard_podcast_metadata(self):
        item = self.items[0]
        self.assertEqual(item["video_id"], "wTrLXC427hg")
        self.assertEqual(item["title"], "เมื่อ AI โคลนตัวตนเรามาสวมรอย: บอทสแกมและโลกอินเทอร์เน็ตหลังความจริง")
        self.assertEqual(item["youtube_url"], "https://www.youtube.com/watch?v=wTrLXC427hg&list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl")
        self.assertEqual(item["cover"], "assets/audio-covers/wTrLXC427hg.jpg")
        self.assertEqual(item["duration_seconds"], 1414)
        self.assertEqual(item["published_epoch_ms"], 1788550771986)
        self.assertEqual(item["published_at"], "2026-09-05T02:39:31+07:00")
        self.assertEqual(item["playlist_position"], 1)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_hermes_agent_business_automation_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "6EOEMjBM6HU")
        self.assertEqual(item["video_id"], "6EOEMjBM6HU")
        self.assertEqual(item["title"], "รันธุรกิจอัตโนมัติด้วย Hermes Agent: จาก Chatbot สู่ระบบธุรกิจที่ทำงานเอง")
        self.assertEqual(item["youtube_url"], "https://www.youtube.com/watch?v=6EOEMjBM6HU&list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl")
        self.assertEqual(item["cover"], "assets/audio-covers/6EOEMjBM6HU.jpg")
        self.assertEqual(item["duration_seconds"], 1422)
        self.assertEqual(item["published_epoch_ms"], 1788516294000)
        self.assertEqual(item["published_at"], "2026-09-04T17:04:54+07:00")
        self.assertEqual(item["playlist_position"], 2)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_demand_collapse_storyboard_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "sKC0mlraNPo")
        self.assertEqual(item["video_id"], "sKC0mlraNPo")
        self.assertEqual(item["title"], "เมื่อ AI ทำงานแทนจนเงินไร้ค่า: Demand Collapse และโลกหลังทุนนิยม")
        self.assertEqual(item["youtube_url"], "https://www.youtube.com/watch?v=sKC0mlraNPo&list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl")
        self.assertEqual(item["cover"], "assets/audio-covers/sKC0mlraNPo.jpg")
        self.assertEqual(item["duration_seconds"], 701)
        self.assertEqual(item["published_epoch_ms"], 1788287042000)
        self.assertEqual(item["published_at"], "2026-09-02T01:24:02+07:00")
        self.assertEqual(item["playlist_position"], 3)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_human_ai_communication_v1_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "AJ4cLr7A4Rc")
        self.assertEqual(item["video_id"], "AJ4cLr7A4Rc")
        self.assertEqual(item["title"], "ระบบการสื่อสารระหว่างมนุษย์กับ Ai V1.0")
        self.assertEqual(item["youtube_url"], "https://www.youtube.com/watch?v=AJ4cLr7A4Rc&list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl")
        self.assertEqual(item["cover"], "assets/audio-covers/AJ4cLr7A4Rc.jpg")
        self.assertEqual(item["duration_seconds"], 1335)
        self.assertEqual(item["published_epoch_ms"], 1788272261000)
        self.assertEqual(item["published_at"], "2026-09-01T21:17:41+07:00")
        self.assertEqual(item["playlist_position"], 4)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_grok_ai_beginner_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "YivD8OO85TM")
        self.assertEqual(item["video_id"], "YivD8OO85TM")
        self.assertEqual(item["title"], "Grok AI ทางลัดสำหรับมือใหม่: ต่างจาก Claude, ChatGPT และ DeepSeek อย่างไร?")
        self.assertEqual(item["youtube_url"], "https://www.youtube.com/watch?v=YivD8OO85TM&list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl")
        self.assertEqual(item["cover"], "assets/audio-covers/YivD8OO85TM.jpg")
        self.assertEqual(item["duration_seconds"], 1127)
        self.assertEqual(item["published_epoch_ms"], 1787947245000)
        self.assertEqual(item["published_at"], "2026-08-29T03:00:45+07:00")
        self.assertEqual(item["playlist_position"], 5)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_alex_finn_ai_army_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "oe3zUOLrLF4")
        self.assertEqual(item["video_id"], "oe3zUOLrLF4")
        self.assertEqual(item["title"], "Alex Finn: ใช้ Grok Bot คุมกองทัพ AI ให้บริหารงานแทนเรา")
        self.assertEqual(item["youtube_url"], "https://www.youtube.com/watch?v=oe3zUOLrLF4&list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl")
        self.assertEqual(item["cover"], "assets/audio-covers/oe3zUOLrLF4.jpg")
        self.assertEqual(item["duration_seconds"], 753)
        self.assertEqual(item["published_epoch_ms"], 1787944693000)
        self.assertEqual(item["published_at"], "2026-08-29T02:18:13+07:00")
        self.assertEqual(item["playlist_position"], 6)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_agent_reach_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "UtzEjC9G3Dg")
        self.assertEqual(item["video_id"], "UtzEjC9G3Dg")
        self.assertEqual(item["title"], "Agent Reach: มอบดวงตาให้ AI ทะลวง Social Platform")
        self.assertEqual(item["youtube_url"], "https://www.youtube.com/watch?v=UtzEjC9G3Dg&list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl")
        self.assertEqual(item["cover"], "assets/audio-covers/UtzEjC9G3Dg.jpg")
        self.assertEqual(item["duration_seconds"], 1375)
        self.assertEqual(item["published_epoch_ms"], 1787830592000)
        self.assertEqual(item["published_at"], "2026-08-27T18:36:32+07:00")
        self.assertEqual(item["playlist_position"], 7)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_grok_claude_codex_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "VQdCzVNhTmI")
        self.assertEqual(item["video_id"], "VQdCzVNhTmI")
        self.assertEqual(item["title"], "Grok Bot vs Claude Code & Codex: AI Teammate ถาวรต่างจาก Spawn Agents อย่างไร")
        self.assertEqual(item["youtube_url"], "https://www.youtube.com/watch?v=VQdCzVNhTmI&list=PLiC0CkxoTk9TKjqaZG8n_1EXaiHKTOxFl")
        self.assertEqual(item["cover"], "assets/audio-covers/VQdCzVNhTmI.jpg")
        self.assertEqual(item["duration_seconds"], 1223)
        self.assertEqual(item["published_epoch_ms"], 1787812109000)
        self.assertEqual(item["published_at"], "2026-08-27T13:28:29+07:00")
        self.assertEqual(item["playlist_position"], 8)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_hermes_inside_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "4zmH_6gM4h4")
        self.assertEqual(item["title"], "ในหัวของ Hermes มีอะไร? แกะระบบ AI Agent ให้คนทั่วไปเข้าใจ | ฉบับแก้ไข")
        self.assertEqual(item["duration_seconds"], 2029)
        self.assertEqual(item["playlist_position"], 10)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_latest_vault_ai_safety_podcast_metadata(self):
        item = next(item for item in self.items if item["video_id"] == "lL2eb4GeoAU")
        self.assertEqual(item["video_id"], "lL2eb4GeoAU")
        self.assertEqual(item["title"], "คุม AI ไม่ให้พลาด: กรอบ VAULT สำหรับระบบที่ตรวจสอบได้และควบคุมความเสี่ยง")
        self.assertEqual(item["duration_seconds"], 1592)
        self.assertEqual(item["playlist_position"], 9)
        self.assertEqual(item["uploader"], "manny calavara")

    def test_dead_air_replacement_supersedes_old_public_video(self):
        self.assertNotIn("KtHYNnLM_Dk", {item["video_id"] for item in self.items})

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
        self.assertEqual(self.page.count('class="book-card audio-card"'), 56)
        self.assertEqual(self.page.count('target="_blank"'), 58)  # 56 items + playlist button + footer social link
        self.assertEqual(self.page.count('rel="noopener"'), 58)
        self.assertIn('class="footer-facebook-link"', self.page)
        self.assertEqual(self.page.count('publish on '), 56)
        self.assertEqual(self.page.count('class="audio-duration"'), 56)
        self.assertIn('publish on 24/08/2026', self.page)
        self.assertIn('25:42', self.page)

    def test_audio_progressive_disclosure_starts_at_ten_and_supports_year_archive(self):
        template = (ROOT / "templates" / "audio-library.template.html").read_text(encoding="utf-8")
        script = (ROOT / "assets" / "js" / "library.js").read_text(encoding="utf-8")
        stylesheet = (ROOT / "assets" / "css" / "audio-library.css").read_text(encoding="utf-8")
        for marker in (
            'id="audio-show-more"',
            'id="audio-show-all"',
            'id="audio-collapse"',
            'id="audio-year-toggle"',
            'id="audio-year-filters"',
            'aria-controls="audio-year-filters"',
        ):
            self.assertIn(marker, template)
        for marker in (
            "const AUDIO_INITIAL_LIMIT = 10",
            "const AUDIO_BATCH_SIZE = 10",
            "audioVisibleLimit += AUDIO_BATCH_SIZE",
            "audioVisibleLimit = cards.length",
            "audioVisibleLimit = AUDIO_INITIAL_LIMIT",
            "function buildAudioYearFilters()",
            "card.querySelector(\"time[datetime]\")",
            "Boolean(query) || matchesAudioDisclosure(card, index)",
        ):
            self.assertIn(marker, script)
        self.assertIn(".audio-disclosure-controls", stylesheet)
        self.assertIn(".audio-year-filters", stylesheet)
        self.assertEqual(self.page.count('class="book-card audio-card"'), 56)
        self.assertNotIn('class="book-card audio-card" hidden', self.page)

    def test_audio_covers_show_full_four_by_three_thumbnail_over_play_panel(self):
        self.assertEqual(self.page.count('class="audio-thumbnail-frame"'), 56)
        self.assertEqual(self.page.count('class="audio-play-panel"'), 56)
        self.assertEqual(self.page.count('class="audio-play-button"'), 56)

    def test_audio_cards_are_ipods_without_audio_book_kickers(self):
        self.assertNotIn("AUDIO BOOK", self.page)
        self.assertEqual(self.page.count('class="book-cover-wrap audio-cover-wrap audio-ipod"'), 56)
        self.assertEqual(self.page.count('class="audio-click-wheel"'), 56)
        stylesheet = (ROOT / "assets" / "css" / "audio-library.css").read_text(encoding="utf-8")
        self.assertIn(".audio-ipod", stylesheet)
        self.assertIn("aspect-ratio: 2 / 3;", stylesheet)
        self.assertIn(".audio-card .book-cover-wrap::before", stylesheet)

    def test_audio_room_uses_a_fifth_avenue_inspired_retail_material_system(self):
        stylesheet = (ROOT / "assets" / "css" / "audio-library.css").read_text(encoding="utf-8")
        template = (ROOT / "templates" / "audio-library.template.html").read_text(encoding="utf-8")
        for marker in (
            "--apple-stone: #f5f5f7;",
            "--apple-ink: #1d1d1f;",
            "--apple-blue: #0071e3;",
            "--maple: #d6aa73;",
            ".audio-page .site-nav",
            "backdrop-filter: saturate(180%) blur(20px)",
            ".audio-library-mark::before",
            ".audio-bookshelf::before",
            ".audio-bookshelf .shelf-plank",
            "linear-gradient(180deg, #e4bf8d, var(--maple))",
            "font-family: system-ui, -apple-system",
        ):
            self.assertIn(marker, stylesheet)
        self.assertIn("FIFTH AVENUE LISTENING ROOM", template)
        self.assertIn("A bright gallery for sound and ideas", template)
        self.assertIn("<h1>The Audio Shelf</h1>", template)
        self.assertNotIn("<h1>The Knowledge Shelf</h1>", template)

    def test_audio_room_uses_owner_supplied_retail_wallpaper_and_liquid_glass_shelves(self):
        stylesheet = (ROOT / "assets" / "css" / "audio-library.css").read_text(encoding="utf-8")
        wallpaper = ROOT / "assets" / "audio-room" / "owner-supplied-retail-listening-room.webp"
        attribution = ROOT / "docs" / "reports" / "AUDIO_ROOM_IMAGE_ATTRIBUTION.md"
        self.assertTrue(wallpaper.is_file())
        self.assertGreater(wallpaper.stat().st_size, 150000)
        data = wallpaper.read_bytes()
        self.assertEqual(data[:4], b"RIFF")
        self.assertEqual(data[8:12], b"WEBP")
        self.assertNotIn(b"EXIF", data.upper())
        self.assertNotIn(("/" + "home" + "/").encode(), data)
        self.assertTrue(attribution.is_file())
        attribution_text = attribution.read_text(encoding="utf-8")
        self.assertIn("Project-owner supplied", attribution_text)
        self.assertIn("owner-supplied-retail-listening-room.webp", attribution_text)
        self.assertNotIn("Seasider53", attribution_text)
        self.assertIn('url("../audio-room/owner-supplied-retail-listening-room.webp")', stylesheet)
        self.assertIn(".audio-bookshelf {", stylesheet)
        self.assertIn("backdrop-filter: blur(30px) saturate(1.35)", stylesheet)
        self.assertIn(".audio-bookshelf .shelf-plank", stylesheet)
        self.assertIn("backdrop-filter: blur(24px) saturate(1.4)", stylesheet)

    def test_duration_is_in_the_lower_panel_above_play(self):
        cards = self.page.split('<article class="book-card audio-card"')[1:]
        self.assertEqual(len(cards), 56)
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
        self.assertEqual(self.page.count('class="audio-play-label">PLAY'), 56)

    def test_audio_text_is_above_each_book_cover(self):
        cards = self.page.split('<article class="book-card audio-card"')[1:]
        self.assertEqual(len(cards), 56)
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
        self.assertIn('href="assets/icons/shelfkeeper-librarian.webp"', self.page)
        self.assertIn('src="assets/icons/shelfkeeper-librarian.webp"', self.page)
        self.assertEqual(self.page.count('class="nav-icon"'), 4)
        self.assertIn('href="app-library.html"', self.page)
        self.assertIn('href="gallery.html"', self.page)

    def test_publish_badge_is_visibly_larger_on_both_pages(self):
        stylesheet = (ROOT / "assets" / "css" / "library.css").read_text(encoding="utf-8")
        self.assertIn("font-size: .62rem;", stylesheet)

    def test_checked_in_audio_page_matches_generator(self):
        checked_in = (ROOT / "audio-library.html").read_text(encoding="utf-8")
        self.assertEqual(checked_in, self.page)
        self.assertNotIn("/" + "home" + "/", checked_in)

    def test_search_status_uses_audio_book_noun(self):
        script = (ROOT / "assets" / "js" / "library.js").read_text(encoding="utf-8")
        self.assertIn('"หนังสือเสียง"', script)

    def test_navigation_connects_all_library_pages(self):
        homepage = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn('href="audio-library.html"', homepage)
        self.assertIn('href="app-library.html"', homepage)
        self.assertIn('href="gallery.html"', homepage)
        self.assertIn('href="index.html"', self.page)
        self.assertIn('href="app-library.html"', self.page)
        self.assertIn('href="gallery.html"', self.page)
        self.assertIn('aria-current="page"', self.page)


if __name__ == "__main__":
    unittest.main()
