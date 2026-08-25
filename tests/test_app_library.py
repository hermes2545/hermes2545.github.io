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
            "published_at", "source_repository", "source_commit", "label",
        }
        self.assertEqual(len(self.apps), 3)
        self.assertEqual(
            {app["id"] for app in self.apps},
            {"battle-tank", "bakery-center", "loderunner"},
        )
        self.assertEqual(len({app["href"] for app in self.apps}), 3)
        for app in self.apps:
            self.assertTrue(required <= app.keys(), app)
            self.assertRegex(app["published_at"], r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$")
            self.assertRegex(app["source_commit"], r"^[0-9a-f]{40}$")
            self.assertTrue(app["source_repository"].startswith("https://github.com/p2544/"))
            self.assertEqual(set(app["label"]), {"kicker", "mark", "version", "primary", "accent", "ink"})
            for color in ("primary", "accent", "ink"):
                self.assertRegex(app["label"][color], r"^#[0-9A-Fa-f]{6}$")

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
        }
        actual = {app["id"]: app for app in self.apps}
        for app_id, (href, source_repository, source_commit) in expected.items():
            self.assertEqual(actual[app_id]["href"], href)
            self.assertEqual(actual[app_id]["source_repository"], source_repository)
            self.assertEqual(actual[app_id]["source_commit"], source_commit)
            self.assertTrue((ROOT / unquote(urlparse(href).path)).is_file())

    def test_single_file_apps_preserve_source_bytes(self):
        expected_hashes = {
            "app/battle-tank.html": "a331e2df6ec36ec28ddc03f7c28d299aab09198599a1524fef6bf2ea9cc15b53",
            "app/bakery-center.html": "1e7a593f7ecc030f4bac5647036c947a5547f5d329b09e0d4253156f8db24f36",
        }
        for relative_path, expected in expected_hashes.items():
            digest = hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative_path)

    def test_loderunner_keeps_upstream_runtime_unchanged_behind_stable_wrapper(self):
        wrapper = (ROOT / "app" / "loderunner.html").read_text(encoding="utf-8")
        runtime = ROOT / "app" / "loderunner" / "lodeRunner.html"
        self.assertIn('src="loderunner/lodeRunner.html"', wrapper)
        self.assertIn('title="Lode Runner — Total Recall"', wrapper)
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
        self.assertEqual(self.apps[0]["id"], "bakery-center")

    def test_page_renders_each_app_as_a_three_and_half_inch_diskette(self):
        self.assertEqual(self.page.count('class="app-card"'), 3)
        self.assertEqual(self.page.count('class="diskette"'), 3)
        self.assertEqual(self.page.count('class="diskette-shutter"'), 3)
        self.assertEqual(self.page.count('class="diskette-label"'), 3)
        self.assertEqual(self.page.count('class="diskette-hub"'), 3)
        self.assertEqual(self.page.count('target="_blank"'), 3)
        self.assertEqual(self.page.count('rel="noopener"'), 3)
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
        self.assertIn("function layoutShelves()", script)
        self.assertIn("function columnsForViewport()", script)
        self.assertIn('itemName = "App"', script)

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
            self.assertEqual(text.count('class="nav-icon"'), 3)


if __name__ == "__main__":
    unittest.main()
