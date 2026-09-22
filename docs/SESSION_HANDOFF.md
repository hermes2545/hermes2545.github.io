# Library Session Handoff

Updated: 2026-09-22T23:25:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published Reading work before this CMS commit: **Hermes Bot Cheat Code — Practical Guide / Playbook**.
- Publication state of that Reading work: content commit `17d580cd4a64bedc0a385a3dd3a9a790962c655c` pushed to both public and private remotes and production-verified.
- GitHub Pages deployment for that Reading work: run `35751673424` completed successfully.
- Current CMS work is approved for commit/push by the owner in the current turn (`push ได้`).
- The owner-only CMS has been pivoted away from Cloud Run/Billing and away from reusing existing Tailscale Serve URLs. Google Login/OAuth remains in use; the public admin page loads from GitHub Pages and calls the private loopback backend at `http://127.0.0.1:8123` on the same machine where the owner opens the browser.

## CMS work completed

- Added `admin.html` as a public-safe owner CMS shell with Google Identity Services login UI and collection tabs for Reading, Audio, Gallery, and App.
- Added a small hidden `🔐` entry link in the Reading page template and regenerated `index.html`.
- Added `assets/js/admin-cms.js` for Google credential handling, file-to-base64 upload payloads, collection tab UI, and Reading publish calls.
- Added `cms_backend/`:
  - `ingest.py`: shared collection registry, slug/path validation, public-safety scan, 600×900 EXIF-free WebP cover normalization, and Reading book staging.
  - `auth.py`: Google ID token verification with `GOOGLE_OAUTH_CLIENT_ID` and backend-only `CMS_ALLOWED_EMAIL`.
  - `publish.py`: GitHub Git API publication helper that creates one commit for explicit changed paths and can obtain a backend-only token from environment or the owner-authorized GitHub CLI.
  - `server.py`: API with `/api/health`, `/api/collections`, `/api/reading/stage`, and `/api/reading/publish`.
- Added `Dockerfile.cms` and `requirements-cms.txt` for optional container packaging; the default owner-only deployment no longer depends on Google Cloud Billing.
- Added tests in `tests/test_cms_backend.py` and `tests/test_cms_publish.py`; updated `tests/test_catalog.py` to recognise `admin.html` as an intentional utility page.
- Added/updated runbook `docs/wiki/runbooks/owner-cms-backend.md`, linked it from `docs/wiki/index.md`, and appended durable context to `docs/wiki/log.md`.

## No-billing runtime deployment

- Backend runs as user service `knowledge-shelf-cms.service` and is enabled.
- Backend binds only to loopback on port `8123`.
- No CMS route is exposed on the existing Tailscale Serve URL, because that URL belongs to other services on this server.
- The intended production admin flow is `https://hermes2545.github.io/admin.html` calling `http://127.0.0.1:8123` from the same RDP/browser machine.
- Verified health endpoint on loopback returned `{"ok": true, "service": "knowledge-shelf-cms"}`.
- Runtime configuration and OAuth/GitHub credential material are not committed to the public repository. GitHub write access uses the already-authorized CLI token on the backend side, not the static page.

## Design decisions / scope

- One backend/auth/publish stack should serve all collections.
- Reading is implemented first because it maps directly to owner-supplied HTML + cover + `data/books.json`.
- Audio, Gallery, and App should not be separate CMS products; they should be separate collection validators/forms using the same Google-authenticated backend and GitHub publication path.
- The public static files intentionally do not contain the owner email. The real owner account is configured privately via `CMS_ALLOWED_EMAIL` on the backend.
- Do not return to Cloud Run/Cloud Build/Secret Manager/Artifact Registry for this owner-only CMS unless the owner explicitly asks for Google-hosted public backend infrastructure and accepts Billing.

## Verification completed before CMS push

- TDD RED: CMS backend tests initially failed before implementation; publish-helper token fallback test failed before implementation and passed after adding the `gh auth token` fallback.
- Full suite: `python -m unittest discover -s tests -v` → OK, 158 tests.
- Generated-page checks: Reading current at 38 books, Audio current at 60 audio books, App current at 9 apps, Gallery current at 8 artworks.
- `git diff --check` → OK.
- Pre-share scan found no owner email, real OAuth secret, real GitHub token, signed URL, or local absolute path in the new CMS public files. Remaining matches are intentional fake/test scanner strings in tests or older guide examples.
- Local UI screenshots were produced at `/tmp/library-cms-preview/admin-latest-desktop.png` and `/tmp/library-cms-preview/admin-latest-mobile.png` for owner review.

## Remaining / next actions after push

- Verify public `https://hermes2545.github.io/admin.html` loads the CMS shell.
- Verify local backend remains active on the owner's RDP machine before using the CMS.
- Test a real owner-supplied Reading upload through the CMS when the owner provides the next HTML + cover.
- `.hermes/` remains untracked/private and must not be committed.
