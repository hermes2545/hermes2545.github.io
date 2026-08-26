import hashlib
import html
import json
import unittest
from pathlib import Path
from urllib.parse import unquote, urlparse

from scripts.build_app_library import load_apps, render_app_library

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "apps.json"


class AppLibraryTests(unittest.TestCase):
    def setUp(self):
        self.apps = load_apps(CATALOG)
        self.page = render_app_library(self.apps)

    def test_catalog_has_three_unique_apps_with_required_metadata(self):
        required = {
            "id", "title", "short_title", "href", "category", "summary",
            "published_at", "source_repository", "source_commit", "source_sha256",
            "import_mode", "sticker", "label",
        }
        self.assertEqual(len(self.apps), 4)
        self.assertEqual(
            {app["id"] for app in self.apps},
            {"battle-tank", "bakery-center", "loderunner", "pacman"},
        )
        self.assertEqual(len({app["href"] for app in self.apps}), 4)
        for app in self.apps:
            self.assertTrue(required <= app.keys(), app)
            self.assertRegex(app["published_at"], r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$")
            self.assertRegex(app["source_commit"], r"^[0-9a-f]{40}$")
            self.assertRegex(app["source_sha256"], r"^[0-9a-f]{64}$")
            self.assertTrue(app["source_repository"].startswith("https://github.com/"))
            self.assertEqual(set(app["label"]), {"kicker", "mark", "version", "primary", "accent", "ink"})
            for color in ("primary", "accent", "ink"):
                self.assertRegex(app["label"][color], r"^#[0-9A-Fa-f]{6}$")
            if app["id"] == "bakery-center":
                self.assertIsNone(app["sticker"])
            else:
                self.assertEqual(app["sticker"], f'assets/app-stickers/{app["id"]}.webp')
                sticker = ROOT / app["sticker"]
                self.assertTrue(sticker.is_file(), sticker)
                self.assertGreater(sticker.stat().st_size, 1000, sticker)

    def test_catalog_owns_exact_source_provenance_and_public_urls(self):
        expected = {
            "battle-tank": (
                "app/battle-tank.html",
                "https://github.com/p2544/battle-tank",
                "1ee3598a5ba84348915cf1cf6b140f52cc2e7bf2",
            ),
            "bakery-center": (
                "app/bakery-center.html",
                "https://github.com/p2544/bakery-center",
                "53320b6f4a51d1cad62f302857f9aebd8afd5cdb",
            ),
            "loderunner": (
                "app/loderunner.html",
                "https://github.com/p2544/loderunner",
                "cceca5d5a15a21f724836654a46bf2501968e142",
            ),
            "pacman": (
                "app/pacman.html",
                "https://github.com/shaunlebron/pacman",
                "51048a29df603391be1d12cd4118699fb0a38790",
            ),
        }
        actual = {app["id"]: app for app in self.apps}
        for app_id, (href, source_repository, source_commit) in expected.items():
            self.assertEqual(actual[app_id]["href"], href)
            self.assertEqual(actual[app_id]["source_repository"], source_repository)
            self.assertEqual(actual[app_id]["source_commit"], source_commit)
            self.assertTrue((ROOT / unquote(urlparse(href).path)).is_file())

    def test_battle_tank_preserves_source_bytes(self):
        app = next(app for app in self.apps if app["id"] == "battle-tank")
        digest = hashlib.sha256((ROOT / app["href"]).read_bytes()).hexdigest()
        self.assertEqual(app["import_mode"], "preserved")
        self.assertEqual(digest, app["source_sha256"])

    def test_bakery_center_is_a_hardened_derivative_of_the_pinned_source(self):
        app = next(app for app in self.apps if app["id"] == "bakery-center")
        source = (ROOT / app["href"]).read_text(encoding="utf-8")
        digest = hashlib.sha256((ROOT / app["href"]).read_bytes()).hexdigest()
        self.assertEqual(app["import_mode"], "hardened-derivative")
        self.assertNotEqual(digest, app["source_sha256"])
        self.assertIn("LIBRARY SECURITY HARDENING", source)
        self.assertNotIn("fonts.googleapis.com", source)
        self.assertNotIn("fonts.gstatic.com", source)
        for marker in (
            "function safeId(",
            "function safePhoto(",
            "function normalizeRecipe(",
            "function normalizeLog(",
            "function normalizeBackup(",
            "const clean=normalizeBackup(j);",
            "${esc(r.icon||ICONS[r.cat]||'🧁')}",
        ):
            self.assertIn(marker, source)
        self.assertNotIn("for(const r of j.recipes||[])await dbPut('recipes',r);", source)

    def test_loderunner_keeps_upstream_runtime_unchanged_behind_stable_wrapper(self):
        wrapper = (ROOT / "app" / "loderunner.html").read_text(encoding="utf-8")
        runtime = ROOT / "app" / "loderunner" / "lodeRunner.html"
        self.assertIn('src="loderunner/lodeRunner.html"', wrapper)
        self.assertIn('title="Lode Runner — Total Recall"', wrapper)
        self.assertIn('referrerpolicy="no-referrer"', wrapper)
        self.assertIn('sandbox="allow-scripts allow-same-origin allow-downloads allow-modals allow-pointer-lock"', wrapper)
        self.assertEqual(
            hashlib.sha256(runtime.read_bytes()).hexdigest(),
            "057606d27ce1490592a44b707f34469854b22e9d23b1e23bd4d75dfe07f6c974",
        )
        for required in (
            "lodeRunner.main.js", "lodeRunner.preload.js", "lib/easeljs-0.7.1.min.js",
            "image/lodeRunner.png", "sound/beep.mp3",
        ):
            self.assertTrue((ROOT / "app" / "loderunner" / required).is_file(), required)
        self.assertFalse((ROOT / "app" / "loderunner" / "tools").exists())

    def test_apps_sort_newest_first(self):
        timestamps = [app["published_at"] for app in self.apps]
        self.assertEqual(timestamps, sorted(timestamps, reverse=True))
        self.assertEqual(self.apps[0]["id"], "pacman")

    def test_pacman_preserves_browser_runtime_and_gpl_license(self):
        app = next(app for app in self.apps if app["id"] == "pacman")
        wrapper = (ROOT / app["href"]).read_text(encoding="utf-8")
        runtime = ROOT / "app" / "pacman"
        self.assertEqual(app["import_mode"], "wrapper-preserved-runtime")
        self.assertEqual(app["source_sha256"], "46dd569754c3e73c93f814388db1a9846abe2cf5779cadc053836d7051fa6647")
        self.assertIn('src="pacman/index.htm"', wrapper)
        self.assertEqual(hashlib.sha256((runtime / "index.htm").read_bytes()).hexdigest(), app["source_sha256"])
        self.assertEqual(
            hashlib.sha256((runtime / "pacman.js").read_bytes()).hexdigest(),
            "b6dff005b89d8abff3f0f774550ac8a659fb89be759186fb473738ac3e88fce8",
        )
        for required in ("COPYING", "UPSTREAM.md", "font/ARCADE_R.TTF", "font/LICENSE.txt", "icon/favicon.png"):
            self.assertTrue((runtime / required).is_file(), required)

    def test_withdrawn_game_ports_and_stickers_are_absent(self):
        for app_id in ("galaga", "rl-battle-city", "new-rally-x"):
            self.assertFalse((ROOT / "app" / f"{app_id}.html").exists(), app_id)
            self.assertFalse((ROOT / "app" / app_id).exists(), app_id)
            self.assertFalse((ROOT / "assets" / "app-stickers" / f"{app_id}.webp").exists(), app_id)

    def test_page_renders_each_app_as_a_three_and_half_inch_diskette(self):
        self.assertEqual(self.page.count('class="app-card"'), 4)
        self.assertEqual(self.page.count('class="diskette"'), 4)
        self.assertEqual(self.page.count('class="diskette-shutter"'), 4)
        self.assertEqual(self.page.count('class="diskette-label'), 4)
        self.assertEqual(self.page.count('class="diskette-hub"'), 4)
        self.assertEqual(self.page.count('class="diskette-sticker"'), 3)
        self.assertEqual(self.page.count('target="_blank"'), 4)
        self.assertEqual(self.page.count('rel="noopener"'), 4)
        for app in self.apps:
            self.assertEqual(self.page.count(f'href="{app["href"]}"'), 1)
            self.assertIn(html.escape(app["short_title"]), self.page)
            self.assertIn(html.escape(app["label"]["kicker"]), self.page)

    def test_diskette_design_and_responsive_shelves_are_present(self):
        stylesheet = (ROOT / "assets" / "css" / "app-library.css").read_text(encoding="utf-8")
        script = (ROOT / "assets" / "js" / "app-library.js").read_text(encoding="utf-8")
        self.assertIn(".diskette", stylesheet)
        self.assertIn("aspect-ratio: 90 / 94", stylesheet)
        self.assertIn(".diskette-label", stylesheet)
        self.assertIn("--app-paper: #ece8dd;", stylesheet)
        self.assertIn("--app-wall: #d8d5ca;", stylesheet)
        self.assertIn("background-color: var(--app-paper);", stylesheet)
        self.assertIn("function layoutShelves()", script)
        self.assertIn("function columnsForViewport()", script)
        self.assertIn('itemName = "App"', script)

    def test_pantip_title_logo_and_led_marquee_scroll_left_with_loop_colors(self):
        template = (ROOT / "templates" / "app-library.template.html").read_text(encoding="utf-8")
        stylesheet = (ROOT / "assets" / "css" / "app-library.css").read_text(encoding="utf-8")
        script = (ROOT / "assets" / "js" / "app-library.js").read_text(encoding="utf-8")
        logo = ROOT / "assets" / "icons" / "pantip-logo.webp"
        message = "ซอฟท์แวร์, โปรแกรม, CD เถื่อน ทุกประเภท, MP3 ประเทืองล่าสุด, ปลอมแท้ต้อง Vampire, รับ copy แผ่น, หนังญี่ปุ่น, ฝรั่ง, สะกิดคนขายได้  😎😎😎"
        self.assertIn("<h1>พันธุ์ทิพย์พลาซ่า</h1>", template)
        self.assertIn('class="pantip-logo"', template)
        self.assertIn('src="assets/icons/pantip-logo.webp"', template)
        self.assertNotIn("<span>3½</span>", template)
        self.assertTrue(logo.is_file())
        logo_bytes = logo.read_bytes()
        self.assertGreater(len(logo_bytes), 5000)
        self.assertEqual(logo_bytes[:4], b"RIFF")
        self.assertEqual(logo_bytes[8:12], b"WEBP")
        self.assertIn(".pantip-logo", stylesheet)
        self.assertIn(message, template)
        self.assertIn('class="app-marquee-message"', template)
        self.assertIn("@keyframes app-led-scroll-left", stylesheet)
        self.assertIn("animation: app-led-scroll-left 28s linear infinite", stylesheet)
        self.assertIn("from { left: 100%; transform: translate(0, -50%); }", stylesheet)
        self.assertIn("to { left: 0; transform: translate(-100%, -50%); }", stylesheet)
        self.assertIn('const ledColors = ["#ff3b30", "#20b548", "#ffd20a", "#2b6cff"]', script)
        self.assertIn('marquee.addEventListener("animationiteration"', script)
        self.assertIn("@media (prefers-reduced-motion: reduce)", stylesheet)
        self.assertIn(".app-page .app-marquee-message", stylesheet)
        self.assertIn("animation-duration: 28s !important", stylesheet)
        self.assertIn("animation-iteration-count: infinite !important", stylesheet)

    def test_app_page_is_semantic_searchable_and_generated(self):
        required = [
            '<html lang="th">', '<main id="main-content">', 'class="skip-link"',
            'aria-label="ค้นหา App"', 'aria-live="polite"', '<noscript>',
            'assets/css/app-library.css', 'assets/js/app-library.js',
        ]
        for marker in required:
            self.assertIn(marker, self.page)
        checked_in = (ROOT / "app-library.html").read_text(encoding="utf-8")
        self.assertEqual(checked_in, self.page)
        self.assertNotIn("/home/", checked_in)

    def test_all_collection_pages_have_three_way_navigation(self):
        for relative_path in (
            "templates/index.template.html",
            "templates/audio-library.template.html",
            "templates/app-library.template.html",
        ):
            text = (ROOT / relative_path).read_text(encoding="utf-8")
            self.assertIn('href="index.html"', text)
            self.assertIn('href="audio-library.html"', text)
            self.assertIn('href="app-library.html"', text)
            self.assertIn('href="assets/icons/shelfkeeper-librarian.webp"', text)
            self.assertEqual(text.count('class="nav-icon"'), 3)
        icon = ROOT / "assets" / "icons" / "shelfkeeper-librarian.webp"
        self.assertTrue(icon.is_file())
        data = icon.read_bytes()
        self.assertGreater(len(data), 20000)
        self.assertEqual(data[:4], b"RIFF")
        self.assertEqual(data[8:12], b"WEBP")


if __name__ == "__main__":
    unittest.main()
