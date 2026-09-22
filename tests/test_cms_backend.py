import base64
import json
import re
import tempfile
import unittest
from pathlib import Path

from PIL import Image

from cms_backend import ingest


ROOT = Path(__file__).resolve().parents[1]


class CmsBackendTests(unittest.TestCase):
    def make_png_bytes(self, size=(900, 1200), color=(20, 120, 80)):
        import io

        image = Image.new("RGB", size, color)
        out = io.BytesIO()
        image.save(out, format="PNG")
        return out.getvalue()

    def test_collection_registry_covers_all_public_shelves(self):
        registry = ingest.collection_registry()
        self.assertEqual(set(registry), {"reading", "audio", "gallery", "app"})
        self.assertEqual(registry["reading"].catalog_path, Path("data/books.json"))
        self.assertEqual(registry["audio"].catalog_path, Path("data/audio-books.json"))
        self.assertEqual(registry["gallery"].catalog_path, Path("data/gallery.json"))
        self.assertEqual(registry["app"].catalog_path, Path("data/apps.json"))
        self.assertEqual(registry["reading"].generator_command, ["python", "scripts/build_catalog.py"])
        self.assertEqual(registry["audio"].generator_command, ["python", "scripts/build_audio_library.py"])
        self.assertEqual(registry["gallery"].generator_command, ["python", "scripts/build_gallery.py"])
        self.assertEqual(registry["app"].generator_command, ["python", "scripts/build_app_library.py"])

    def test_slug_and_public_path_validation_rejects_traversal_absolute_and_unknown_extensions(self):
        self.assertEqual(ingest.clean_slug("  My New Book!! "), "my-new-book")
        self.assertEqual(ingest.safe_public_html_name("My New Book!!"), "my-new-book.html")
        for bad in ("../secret", "/admin", "book.php", "a/b", "", ".env"):
            with self.subTest(bad=bad):
                with self.assertRaises(ingest.CmsValidationError):
                    ingest.safe_public_html_name(bad)

    def test_public_safety_scan_blocks_credentials_private_paths_and_signed_urls(self):
        safe = "<html><title>คู่มือ</title><body>public guide</body></html>"
        self.assertEqual(ingest.scan_public_safety(safe.encode("utf-8")), [])
        unsafe = b"github_pat_123456 " + b"/" + b"home/example/.hermes?X-Amz-Signature=abc BEGIN PRIVATE KEY"
        findings = ingest.scan_public_safety(unsafe)
        self.assertIn("github token pattern", findings)
        self.assertIn("local absolute path", findings)
        self.assertIn("signed URL pattern", findings)
        self.assertIn("private key block", findings)

    def test_normalize_cover_outputs_exif_free_600_by_900_webp(self):
        webp = ingest.normalize_cover_to_webp(self.make_png_bytes())
        self.assertGreater(len(webp), 100)
        import io

        with Image.open(io.BytesIO(webp)) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(len(image.getexif()), 0)

    def test_stage_reading_book_upload_writes_expected_files_catalog_and_generated_index(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            (repo / "data").mkdir()
            (repo / "assets" / "covers" / "custom").mkdir(parents=True)
            (repo / "templates").mkdir()
            (repo / "data" / "books.json").write_text("[]\n", encoding="utf-8")
            (repo / "templates" / "index.template.html").write_text(
                "<html><body>{{BOOK_COUNT}} {{BOOKSHELVES}}</body></html>", encoding="utf-8"
            )
            result = ingest.stage_reading_book_upload(
                repo,
                html_bytes=b"<!doctype html><html><head><title>CMS Test</title></head><body>OK</body></html>",
                cover_bytes=self.make_png_bytes(),
                metadata={
                    "id": "cms-test-book",
                    "title": "CMS Test Book",
                    "short_title": "CMS Test",
                    "category": "CMS",
                    "summary": "หนังสือทดสอบ CMS",
                    "accent": "#123ABC",
                    "published_at": "2026-09-18T10:00:00+07:00",
                },
            )
            self.assertEqual(result.book["href"], "cms-test-book.html")
            self.assertEqual(result.book["cover"], "assets/covers/custom/cms-test-book.webp")
            self.assertEqual(result.changed_paths, [
                Path("cms-test-book.html"),
                Path("assets/covers/custom/cms-test-book.webp"),
                Path("data/books.json"),
                Path("index.html"),
            ])
            self.assertEqual((repo / "cms-test-book.html").read_bytes(), b"<!doctype html><html><head><title>CMS Test</title></head><body>OK</body></html>")
            catalog = json.loads((repo / "data" / "books.json").read_text(encoding="utf-8"))
            self.assertEqual(catalog, [result.book])
            self.assertIn("CMS Test", (repo / "index.html").read_text(encoding="utf-8"))

    def test_server_cors_allows_github_pages_to_call_loopback_backend(self):
        from cms_backend import server

        captured = {}

        def start_response(status, headers):
            captured["status"] = status
            captured["headers"] = dict(headers)

        list(server.application({"REQUEST_METHOD": "OPTIONS", "PATH_INFO": "/api/reading/publish"}, start_response))

        self.assertEqual(captured["status"], "204 No Content")
        self.assertEqual(captured["headers"]["Access-Control-Allow-Origin"], "https://hermes2545.github.io")
        self.assertEqual(captured["headers"]["Access-Control-Allow-Private-Network"], "true")

    def test_admin_page_contains_hidden_entry_google_login_and_collection_tabs(self):
        admin = (ROOT / "admin.html").read_text(encoding="utf-8")
        self.assertIn("Google Identity Services", admin)
        self.assertIn("Google Identity Services", admin)
        self.assertIn("CMS_ALLOWED_EMAIL", admin)
        self.assertIn('apiBaseUrl: "http://127.0.0.1:8123"', admin)
        self.assertRegex(admin, r'data-client_id="60954178981-[^"]+\.apps\.googleusercontent\.com"')
        self.assertNotIn('REPLACE_WITH_GOOGLE_OAUTH_WEB_CLIENT_ID', admin)
        self.assertNotRegex(admin, re.compile(r"[A-Za-z0-9._%+-]+@gmail\\.com", re.IGNORECASE))
        self.assertIn('data-collection="reading"', admin)
        self.assertIn('data-collection="audio"', admin)
        self.assertIn('data-collection="gallery"', admin)
        self.assertIn('data-collection="app"', admin)
        template = (ROOT / "templates" / "index.template.html").read_text(encoding="utf-8")
        self.assertIn('href="admin.html"', template)
        self.assertIn('class="cms-entry-link"', template)


if __name__ == "__main__":
    unittest.main()
