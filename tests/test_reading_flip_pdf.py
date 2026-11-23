import html
import json
import subprocess
import unittest
from pathlib import Path

from scripts.build_catalog import load_books, render_book

ROOT = Path(__file__).resolve().parents[1]
PDF_ID = "hermes-installation-manual"
PDF_HREF = "Hermes-installation-manual.pdf"
VIEWER_HREF = f"flip-viewer.html?id={PDF_ID}"


class ReadingFlipPdfTests(unittest.TestCase):
    def setUp(self):
        self.books = load_books(ROOT / "data" / "books.json")
        self.pdf_book = next(book for book in self.books if book["id"] == PDF_ID)
        self.html_book = next(book for book in self.books if book["href"].lower().endswith(".html"))

    def test_generator_routes_pdf_read_links_through_flip_viewer(self):
        card = render_book(self.pdf_book)
        self.assertEqual(card.count(f'href="{VIEWER_HREF}"'), 2)
        self.assertEqual(card.count(f'href="{PDF_HREF}"'), 1)
        self.assertIn(
            f'class="book-download-html book-download-html--glass" href="{PDF_HREF}" download',
            card,
        )
        self.assertIn('aria-label="ดาวน์โหลด PDF:', card)
        self.assertIn('title="ดาวน์โหลด PDF"', card)

    def test_generator_keeps_html_books_on_existing_direct_flow(self):
        card = render_book(self.html_book)
        href = html.escape(self.html_book["href"])
        self.assertEqual(card.count(f'href="{href}"'), 3)
        self.assertNotIn("flip-viewer.html?id=", card)
        self.assertIn('aria-label="ดาวน์โหลด HTML:', card)
        self.assertIn('title="ดาวน์โหลด HTML"', card)

    def test_static_viewer_uses_catalog_lookup_and_local_dependencies(self):
        viewer = (ROOT / "flip-viewer.html").read_text(encoding="utf-8")
        script = (ROOT / "assets" / "flip-viewer" / "viewer.js").read_text(encoding="utf-8")
        style = (ROOT / "assets" / "flip-viewer" / "viewer.css").read_text(encoding="utf-8")

        for marker in (
            'id="status"', 'id="book"', 'id="previous"', 'id="next"',
            'id="page-number"', 'id="fullscreen"', 'id="download-pdf"',
        ):
            self.assertIn(marker, viewer)
        self.assertIn("assets/flip-viewer/vendor/page-flip.browser.js", viewer)
        self.assertIn("assets/flip-viewer/viewer.js", viewer)
        self.assertIn("fetch('data/books.json'", script)
        self.assertIn("export function parseBookId", script)
        self.assertIn("export function findCatalogPdf", script)
        self.assertIn("./vendor/pdfjs/pdf.mjs", script)
        self.assertIn("./vendor/pdfjs/pdf.worker.mjs", script)
        self.assertIn("isEvalSupported: false", script)
        self.assertIn("window.St.PageFlip", script)
        self.assertIn("pagehide", script)
        self.assertIn("destroy", script)
        self.assertIn("หมุนล้อเมาส์เพื่อซูม", script)
        self.assertIn("คลิกซ้ายค้างเพื่อลาก", script)
        self.assertIn("touch-action: none", style)

    def test_viewer_id_and_pdf_path_validation_fail_closed(self):
        script_path = ROOT / "assets" / "flip-viewer" / "viewer.js"
        program = f"""
          import {{parseBookId, findCatalogPdf}} from {json.dumps(script_path.resolve().as_uri())};
          const bad = ['', '../../private', '/absolute', 'https://example.invalid/x', 'A', 'ภาษาไทย', 'ok/id'];
          for (const value of bad) {{
            let rejected = false;
            try {{ parseBookId(new URLSearchParams({{id: value}})); }} catch (_) {{ rejected = true; }}
            if (!rejected) process.exit(10);
          }}
          let duplicateRejected = false;
          try {{ parseBookId(new URLSearchParams('id=book&id=other')); }} catch (_) {{ duplicateRejected = true; }}
          if (!duplicateRejected) process.exit(11);
          const id = parseBookId(new URLSearchParams({{id: 'book-1'}}));
          const book = findCatalogPdf([{{id:'book-1', href:'safe-book.pdf', title:'Safe'}}], id);
          if (book.href !== 'safe-book.pdf') process.exit(12);
          for (const href of ['guide.html', '../private.pdf', '/absolute.pdf', 'https://example.invalid/x.pdf']) {{
            let rejected = false;
            try {{ findCatalogPdf([{{id:'book-1', href}}], id); }} catch (_) {{ rejected = true; }}
            if (!rejected) process.exit(13);
          }}
          let unknownRejected = false;
          try {{ findCatalogPdf([], id); }} catch (_) {{ unknownRejected = true; }}
          if (!unknownRejected) process.exit(14);
        """
        subprocess.run(
            ["node", "--input-type=module", "--eval", program],
            check=True,
            capture_output=True,
            text=True,
        )

    def test_mouse_wheel_zoom_and_left_button_pan_are_bounded(self):
        viewer = (ROOT / "flip-viewer.html").read_text(encoding="utf-8")
        script_path = ROOT / "assets" / "flip-viewer" / "viewer.js"
        script = script_path.read_text(encoding="utf-8")
        style = (ROOT / "assets" / "flip-viewer" / "viewer.css").read_text(encoding="utf-8")

        self.assertIn('id="interaction-mode"', viewer)
        self.assertIn("'wheel', onWheel, {passive: false}", script)
        self.assertIn("event.button !== 0", script)
        self.assertIn("setPointerCapture", script)
        self.assertIn("classList.toggle('pan-mode'", script)
        self.assertIn(".flip-stage.pan-mode", style)
        self.assertIn(".flip-stage.pan-mode.is-dragging", style)
        program = f"""
          import {{nextZoom, clampPan}} from {json.dumps(script_path.resolve().as_uri())};
          if (nextZoom(1, -100) !== 1.1) process.exit(10);
          if (nextZoom(2.5, -100) !== 2.5) process.exit(11);
          if (nextZoom(1.1, 100) !== 1) process.exit(12);
          const pan = clampPan({{x: 500, y: -500}}, {{x: 120, y: 80}});
          if (pan.x !== 120 || pan.y !== -80) process.exit(13);
        """
        subprocess.run(
            ["node", "--input-type=module", "--eval", program],
            check=True,
            capture_output=True,
            text=True,
        )

    def test_viewer_runtime_and_licenses_are_vendored(self):
        vendor = ROOT / "assets" / "flip-viewer" / "vendor"
        self.assertTrue((vendor / "page-flip.browser.js").is_file())
        self.assertTrue((vendor / "licenses" / "page-flip-LICENSE").is_file())
        self.assertTrue((vendor / "licenses" / "pdfjs-LICENSE").is_file())
        self.assertTrue((vendor / "pdfjs" / "pdf.mjs").is_file())
        self.assertTrue((vendor / "pdfjs" / "pdf.worker.mjs").is_file())
        for directory in ("cmaps", "standard_fonts", "wasm"):
            self.assertTrue((vendor / "pdfjs" / directory).is_dir())
        self.assertGreaterEqual(sum(1 for path in vendor.rglob("*") if path.is_file()), 204)


if __name__ == "__main__":
    unittest.main()
