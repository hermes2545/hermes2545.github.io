import hashlib
import json
import unittest
from pathlib import Path
from urllib.parse import unquote, urlparse

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "books.json"


class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.books = json.loads(CATALOG.read_text(encoding="utf-8"))

    def test_catalog_contains_every_distinct_existing_guide(self):
        generated_collection_pages = {
            Path("index.html"),
            Path("audio-library.html"),
            Path("app-library.html"),
            Path("gallery.html"),
        }
        html_files = {
            str(path.relative_to(ROOT))
            for path in ROOT.rglob("*.html")
            if ".git" not in path.parts
            and ".hermes" not in path.relative_to(ROOT).parts
            and "templates" not in path.relative_to(ROOT).parts
            and "app" not in path.relative_to(ROOT).parts
            and path.relative_to(ROOT) not in generated_collection_pages
        }
        catalog_targets = {unquote(urlparse(book["href"]).path) for book in self.books}
        # The root token guide and folder token guide are byte-identical aliases.
        allowed_aliases = {"hermes-token-guide.html"}
        self.assertEqual(html_files - allowed_aliases, catalog_targets)

    def test_required_fields_and_unique_ids_and_links(self):
        required = {"id", "title", "short_title", "href", "cover", "category", "summary", "accent", "published_at"}
        self.assertTrue(self.books)
        self.assertEqual(len(self.books), 29)
        self.assertEqual(len({book["id"] for book in self.books}), len(self.books))
        self.assertEqual(len({book["href"] for book in self.books}), len(self.books))
        for book in self.books:
            self.assertTrue(required <= book.keys(), book)
            self.assertFalse(book["href"].startswith(("http://", "https://", "/")))
            self.assertRegex(book["accent"], r"^#[0-9A-Fa-f]{6}$")
            self.assertRegex(book["published_at"], r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$")

    def test_every_reading_book_uses_an_approved_custom_cover(self):
        self.assertEqual(len(self.books), 29)
        for book in self.books:
            self.assertEqual(book["cover"], f'assets/covers/custom/{book["id"]}.webp')
            self.assertEqual(Path(book["cover"]).suffix, ".webp")
        self.assertTrue((ROOT / "templates" / "reading-cover-designs.template.html").is_file())
        self.assertTrue((ROOT / "templates" / "mega-prompt-business-book-cover.template.html").is_file())

    def test_targets_and_covers_exist_and_are_nonempty(self):
        for book in self.books:
            target = ROOT / unquote(urlparse(book["href"]).path)
            cover = ROOT / book["cover"]
            self.assertTrue(target.is_file(), target)
            self.assertTrue(cover.is_file(), cover)
            self.assertGreater(cover.stat().st_size, 100, cover)
            self.assertIn(cover.suffix.lower(), {".svg", ".webp", ".png", ".jpg", ".jpeg"})

    def test_dedicated_library_agent_profile_is_published(self):
        book = next((book for book in self.books if book["id"] == "dedicated-library-agent-profile"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "DEDICATED_LIBRARY_AGENT_PROFILE_BLUEPRINT.html")
        self.assertEqual(book["cover"], "assets/covers/custom/dedicated-library-agent-profile.webp")
        self.assertEqual(book["published_at"], "2026-08-23T15:22:54+07:00")

    def test_all_reading_books_use_approved_thai_titles(self):
        expected = {
            "grokrouter-interactive-reference-manual": "GrokRouter ทำงานอย่างไร",
            "visual-art-director-agent": "Visual Art Director Agent",
            "hermes-profile-migration-linux-server-guide": "Hermes Profile Migration",
            "gemini-live-api-guide": "Gemini Live API",
            "dedicated-library-agent-profile": "สร้าง AI Agent ดูแลห้องสมุด",
            "grok-vs-hermes": "Grok หรือ Hermes เลือกแบบไหนดี",
            "buzz-vs-hermes": "Buzz หรือ Hermes เหมาะกับงานแบบไหน",
            "network-guardian": "AI ผู้พิทักษ์เครือข่ายบ้าน",
            "headless-browser-redesigned": "เลือก Headless Browser สำหรับ AI — ฉบับใหม่",
            "handoff-context": "ส่งต่องานโดยไม่เสียบริบท",
            "hermes-token-guide": "ใช้ Hermes ให้ประหยัด Token",
            "personal-infrastructure-wiki": "วิกิ HomeOps และ Homelab",
            "headless-browser-original": "เลือก Headless Browser สำหรับ AI — ต้นฉบับ",
            "hermes-unstoppable": "Hermes Agent ทำงานลื่นขึ้นอย่างไร",
            "buzz-hermes-acp": "Buzz คือหน้ากาก Hermes คือสมอง",
            "hermes-mega-prompt": "สร้างทีม AI สำหรับธุรกิจคนเดียว",
            "hermes-memory-kb": "Hermes จำอย่างไรให้เก่งขึ้น",
            "hermes-profile-guardian": "ระบบเฝ้าระวังและซ่อม Hermes",
            "hermes-trustworthy-autonomy": "Hermes ทำงานเองอย่างไว้ใจได้",
            "ai-chatbot-beyond-chatgpt": "สร้าง AI Chatbot ให้เหนือกว่า ChatGPT",
            "hermes-profile-backup-restore": "สำรองและกู้คืน Hermes Profile",
            "hermes-concepts-for-everyone": "เข้าใจ Hermes Agent สำหรับคนทั่วไป",
            "agent-reach-comparison": "Agent Reach หรือดึง Transcript ตรง",
            "vault-ai-safety": "คุม AI ไม่ให้พลาดด้วย VAULT",
            "claude-prompt-caching": "Claude Prompt Caching",
            "claude-interactive-manual": "Claude Interactive Manual",
            "grok-bot-vs-claude-codex": "Grok Bot vs Claude Code vs Codex",
            "hermes-agent-advance-computer-use": "คู่มือ Hermes Agent Advance Computer Use",
            "agent-reach-thai-guide": "Agent Reach คู่มือฉบับไทย",
        }
        actual = {book["id"]: book["short_title"] for book in self.books}
        self.assertEqual(actual, expected)

    def test_hermes_profile_backup_restore_guide_is_catalogued(self):
        book = next((book for book in self.books if book["id"] == "hermes-profile-backup-restore"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "Hermes_Profile_Backup_Restore_Public_Guide.html")
        self.assertEqual(book["cover"], "assets/covers/custom/hermes-profile-backup-restore.webp")
        self.assertEqual(book["published_at"], "2026-08-24T21:18:48+07:00")
        self.assertTrue((ROOT / "templates" / "hermes-profile-backup-restore-cover.template.html").is_file())
        logo = ROOT / "templates" / "reading-cover-assets" / "hermes-girl-logo.jpg"
        self.assertTrue(logo.is_file())
        template = (ROOT / "templates" / "hermes-profile-backup-restore-cover.template.html").read_text(encoding="utf-8")
        self.assertIn("reading-cover-assets/hermes-girl-logo.jpg", template)
        guide_html = (ROOT / "Hermes_Profile_Backup_Restore_Public_Guide.html").read_text(encoding="utf-8")
        self.assertIn('<img class="brand-logo" src="data:image/jpeg;base64,', guide_html)
        self.assertTrue((ROOT / "docs" / "guides" / "HERMES_PROFILE_BACKUP_RESTORE_PUBLIC_GUIDE.md").is_file())

    def test_hermes_concepts_for_everyone_guide_is_catalogued(self):
        book = next((book for book in self.books if book["id"] == "hermes-concepts-for-everyone"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "Hermes_Agent_Concepts_for_Everyone_TH.html")
        self.assertEqual(book["cover"], "assets/covers/custom/hermes-concepts-for-everyone.webp")
        self.assertEqual(book["category"], "AI Fundamentals")
        self.assertEqual(book["published_at"], "2026-08-25T01:23:50+07:00")
        self.assertTrue((ROOT / "templates" / "hermes-concepts-for-everyone-cover.template.html").is_file())
        self.assertTrue((ROOT / "docs" / "guides" / "HERMES_AGENT_CONCEPTS_FOR_EVERYONE_TH.md").is_file())

    def test_agent_reach_comparison_is_catalogued(self):
        book = next((book for book in self.books if book["id"] == "agent-reach-comparison"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "AgentReach_comparison-vs-onepage.html")
        self.assertEqual(book["cover"], "assets/covers/custom/agent-reach-comparison.webp")
        self.assertEqual(book["category"], "AI Research Tools")
        self.assertEqual(book["published_at"], "2026-08-25T12:37:40+07:00")
        self.assertTrue((ROOT / "templates" / "agent-reach-comparison-cover.template.html").is_file())

    def test_vault_ai_safety_guide_is_catalogued(self):
        book = next((book for book in self.books if book["id"] == "vault-ai-safety"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "VAULT_AI_Safety_Interactive_Guide_TH.html")
        self.assertEqual(book["cover"], "assets/covers/custom/vault-ai-safety.webp")
        self.assertEqual(book["category"], "AI Governance")
        self.assertTrue((ROOT / "templates" / "vault-ai-safety-cover.template.html").is_file())
        self.assertTrue((ROOT / "docs" / "guides" / "VAULT_AI_SAFETY_GUIDE_TH.md").is_file())

    def test_ai_chatbot_beyond_chatgpt_manual_is_catalogued(self):
        book = next((book for book in self.books if book["id"] == "ai-chatbot-beyond-chatgpt"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "AI_Chatbot_Beyond_ChatGPT_Interactive_Reference_Manual.html")
        self.assertEqual(book["cover"], "assets/covers/custom/ai-chatbot-beyond-chatgpt.webp")
        self.assertEqual(book["published_at"], "2026-08-24T13:46:16+07:00")
        self.assertTrue((ROOT / "templates" / "ai-chatbot-beyond-chatgpt-cover.template.html").is_file())

    def test_trustworthy_autonomy_manual_is_catalogued(self):
        book = next((book for book in self.books if book["id"] == "hermes-trustworthy-autonomy"), None)
        self.assertIsNotNone(book)
        assert book is not None
        self.assertEqual(book["href"], "Hermes_Trustworthy_Autonomy_Manual.html")
        self.assertEqual(book["cover"], "assets/covers/custom/hermes-trustworthy-autonomy.webp")
        self.assertEqual(book["published_at"], "2026-08-24T12:43:56+07:00")
        self.assertTrue((ROOT / "templates" / "hermes-trustworthy-autonomy-cover.template.html").is_file())

    def test_claude_prompt_caching_guide_is_catalogued_with_branded_cover(self):
        matches = [book for book in self.books if book["id"] == "claude-prompt-caching"]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["short_title"], "Claude Prompt Caching")
        self.assertEqual(book["href"], "claude-prompt-caching.html")
        self.assertEqual(book["cover"], "assets/covers/custom/claude-prompt-caching.webp")
        self.assertEqual(book["published_at"], "2026-06-21T00:00:00+07:00")
        self.assertEqual(book["category"], "Claude Code")
        source = ROOT / book["href"]
        self.assertTrue(source.is_file())
        self.assertEqual(
            hashlib.sha256(source.read_bytes()).hexdigest(),
            "c7e6cbda30a8a9931176549df1388ecb1e006fdce9e31a541eae5b959cfe3e7a",
        )
        cover = ROOT / book["cover"]
        self.assertTrue(cover.is_file())
        with Image.open(cover) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(len(image.getexif()), 0)
        design = (ROOT / "templates" / "claude-prompt-caching-cover.template.html").read_text(encoding="utf-8")
        self.assertIn("✳", design)
        self.assertIn("Claude Prompt Caching", design)
        self.assertIn("Independent guide · Not affiliated with Anthropic", design)

    def test_grok_bot_vs_claude_codex_guide_is_catalogued_with_transparent_brand_assets(self):
        matches = [book for book in self.books if book["id"] == "grok-bot-vs-claude-codex"]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["short_title"], "Grok Bot vs Claude Code vs Codex")
        self.assertEqual(book["href"], "grok-bot-vs-claude-code-vs-codex.html")
        self.assertEqual(book["cover"], "assets/covers/custom/grok-bot-vs-claude-codex.webp")
        self.assertEqual(book["category"], "AI Agent Architecture")
        self.assertEqual(book["published_at"], "2026-08-27T13:33:44+07:00")
        source = ROOT / book["href"]
        self.assertTrue(source.is_file())
        source_text = source.read_text(encoding="utf-8")
        self.assertEqual(
            hashlib.sha256(source.read_bytes()).hexdigest(),
            "9148d20a809867224563fd325d7dfe3e3120e28c05903e4220c324c30dc5dbaf",
        )
        self.assertEqual(source_text.count('class="view'), 11)
        self.assertEqual(source_text.count("data:image/png;base64,"), 3)
        self.assertEqual(source_text.count('class="sources"'), 1)
        self.assertNotIn("ค่ะ", source_text)
        self.assertNotIn("หนูมองว่า", source_text)
        cover = ROOT / book["cover"]
        self.assertTrue(cover.is_file())
        with Image.open(cover) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(len(image.getexif()), 0)
        design = (ROOT / "templates" / "grok-bot-vs-claude-codex-cover.template.html").read_text(encoding="utf-8")
        self.assertIn("Independent comparison · Not affiliated with xAI, Anthropic, or OpenAI", design)
        for brand in ("grok", "claude", "codex"):
            logo = ROOT / "templates" / "reading-cover-assets" / f"{brand}-transparent.png"
            self.assertTrue(logo.is_file(), logo)
            with Image.open(logo) as image:
                self.assertEqual(image.format, "PNG")
                self.assertEqual(image.mode, "RGBA")
                self.assertEqual(image.size, (1600, 1600))
                self.assertEqual(image.getchannel("A").getextrema(), (0, 255))
                self.assertEqual(len(image.getexif()), 0)
            self.assertIn(f"reading-cover-assets/{brand}-transparent.png", design)

    def test_hermes_agent_advance_computer_use_manual_is_catalogued(self):
        matches = [book for book in self.books if book["id"] == "hermes-agent-advance-computer-use"]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "คู่มือ Hermes Agent Advance Computer Use")
        self.assertEqual(book["short_title"], "คู่มือ Hermes Agent Advance Computer Use")
        self.assertEqual(book["href"], "Hermes_Agent_Advance_Computer_Use_Guide_TH.html")
        self.assertEqual(book["cover"], "assets/covers/custom/hermes-agent-advance-computer-use.webp")
        self.assertEqual(book["category"], "Hermes Guide")
        self.assertEqual(book["published_at"], "2026-08-27T16:34:23+07:00")

        source = ROOT / book["href"]
        self.assertTrue(source.is_file())
        source_text = source.read_text(encoding="utf-8")
        self.assertEqual(
            hashlib.sha256(source.read_bytes()).hexdigest(),
            "1ff59d838fc50843f964c71ab3757051b2eeabd5f0701fc515794ac00ddf9581",
        )
        self.assertEqual(source_text.count('<article class="panel'), 13)
        self.assertEqual(source_text.count('class="nav-btn'), 13)
        self.assertEqual(source_text.count("data:image/jpeg;base64,"), 1)
        self.assertIn('aria-label="Hermes Agent logo"', source_text)
        self.assertIn('id="sources"', source_text)
        for marker in (
            "hermes computer-use doctor",
            "computer_use.grant_existing_profile",
            "background-first",
            "Session 0",
            "UIPI",
            "Xvfb :99",
            "localStorage",
            "copy-btn",
            "@media print",
            "data-tabs",
            "searchResults",
        ):
            self.assertIn(marker, source_text)
        self.assertNotIn("ค่ะ", source_text)

        markdown_source = ROOT / "docs" / "guides" / "HERMES_AGENT_ADVANCE_COMPUTER_USE_TH.md"
        self.assertTrue(markdown_source.is_file())
        cover = ROOT / book["cover"]
        self.assertTrue(cover.is_file())
        with Image.open(cover) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(len(image.getexif()), 0)

    def test_agent_reach_thai_guide_is_catalogued_byte_for_byte(self):
        matches = [book for book in self.books if book["id"] == "agent-reach-thai-guide"]
        self.assertEqual(len(matches), 1)
        book = matches[0]
        self.assertEqual(book["title"], "Agent Reach คู่มือฉบับไทย — ให้ AI Agent มองเห็นทั้งอินเทอร์เน็ต")
        self.assertEqual(book["short_title"], "Agent Reach คู่มือฉบับไทย")
        self.assertEqual(book["href"], "AgentReach_Thai_Guide.html")
        self.assertEqual(book["cover"], "assets/covers/custom/agent-reach-thai-guide.webp")
        self.assertEqual(book["category"], "AI Research Tools")
        self.assertEqual(book["published_at"], "2026-08-27T18:45:37+07:00")

        source = ROOT / book["href"]
        self.assertTrue(source.is_file())
        source_text = source.read_text(encoding="utf-8")
        self.assertEqual(
            hashlib.sha256(source.read_bytes()).hexdigest(),
            "e3c92f5eafafdf8b498a593fc825f11c1f2bb78cb479a6d6e94ea436bd1bad90",
        )
        self.assertEqual(source_text.count('<section class="sec'), 10)
        self.assertEqual(source_text.count('class="nav-item"'), 10)
        for marker in ("localStorage", "@media(max-width:1000px)", "navigator.clipboard", "Agent Reach คู่มือฉบับไทย"):
            self.assertIn(marker, source_text)

        cover = ROOT / book["cover"]
        self.assertTrue(cover.is_file())
        with Image.open(cover) as image:
            self.assertEqual(image.format, "WEBP")
            self.assertEqual(image.size, (600, 900))
            self.assertEqual(image.mode, "RGB")
            self.assertEqual(len(image.getexif()), 0)

    def test_imported_repository_guides_preserve_provenance(self):
        registry = json.loads((ROOT / "data" / "imported-sources.json").read_text(encoding="utf-8"))
        expected = {
            "hermes-memory-kb": {
                "source_repository": "https://github.com/hermes2545/hermes-memory",
                "imported_path": "hermes-memory/hermes-memory-kb.html",
            },
            "hermes-profile-guardian": {
                "source_repository": "https://github.com/hermes2545/hermes-guardian",
                "imported_path": "hermes-guardian/index.html",
            },
        }
        actual = {item["book_id"]: item for item in registry}
        for book_id, fields in expected.items():
            self.assertIn(book_id, actual)
            for key, value in fields.items():
                self.assertEqual(actual[book_id][key], value)
            self.assertTrue(actual[book_id]["source_commit"])
            self.assertTrue((ROOT / fields["imported_path"]).is_file())

    def test_duplicate_audit_exists_for_imported_guides(self):
        report = ROOT / "docs" / "reports" / "IMPORTED_CONTENT_DUPLICATE_AUDIT.md"
        self.assertTrue(report.is_file())


if __name__ == "__main__":
    unittest.main()
