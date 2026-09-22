---
title: Owner CMS Backend
type: runbook
status: active
visibility: public
created: 2026-09-18
updated: 2026-09-18
sources: [admin.html, assets/js/admin-cms.js, cms_backend/ingest.py, cms_backend/server.py, data/books.json]
tags: [library, cms, google-oauth, github-pages]
---

# Owner CMS Backend

This runbook describes the owner-only CMS path for adding public collection items without asking an AI agent to edit files manually.

## Security model

- The public static page `admin.html` never stores GitHub credentials, Google secrets, OAuth refresh tokens, or owner email addresses.
- Google Sign-In produces an ID token in the browser.
- The private backend verifies the ID token against the configured OAuth Web Client ID.
- The backend enforces the allowed owner account from the environment variable `CMS_ALLOWED_EMAIL`.
- GitHub write credentials must live only in Google Secret Manager or another backend-only secret store.
- Every collection write still modifies the existing catalog source of truth rather than creating a second inventory.

## Collection model

The backend registry covers all public shelves with one shared auth/publish stack:

| Collection | Catalog | Generator | Output | Upload mode |
| --- | --- | --- | --- | --- |
| Reading | `data/books.json` | `scripts/build_catalog.py` | `index.html` | HTML guide + cover |
| Audio | `data/audio-books.json` | `scripts/build_audio_library.py` | `audio-library.html` | YouTube/audio metadata + cover |
| Gallery | `data/gallery.json` | `scripts/build_gallery.py` | `gallery.html` | Artwork image + metadata |
| App | `data/apps.json` | `scripts/build_app_library.py` | `app-library.html` | App HTML/runtime + sticker/provenance |

Reading upload is implemented first in `cms_backend.ingest.stage_reading_book_upload`. Audio, Gallery, and App should reuse the same backend authentication and GitHub publication path, but need collection-specific validators before enabling write buttons.

## Google OAuth setup

Google Login itself does not require Google Cloud Billing. The only Google Cloud item required for the owner CMS is an OAuth 2.0 Web Client ID:

1. Create or select the owner-controlled Google Cloud project.
2. Configure the OAuth consent screen for the owner-controlled application.
3. Create an OAuth 2.0 Client ID:
   - Application type: Web application.
   - Authorized JavaScript origin: `https://hermes2545.github.io`.
   - Add local test origins only when needed, for example `http://localhost:8000`.
4. Do not store the OAuth client secret in public files. The static frontend needs only the Web Client ID; the backend verifies the signed ID token server-side.

Avoid Cloud Run, Cloud Build, Secret Manager, and Artifact Registry for the default owner-only deployment unless the owner explicitly wants Google-hosted infrastructure. Those services trigger Google Cloud Billing and are unnecessary when an owner-controlled server is available.

## No-billing deploy shape

The default deployment runs the private backend on the owner-controlled workstation/server where the owner opens the CMS browser. It avoids reusing existing Tailscale Serve domains or ports:

- `admin.html` remains a static public shell on GitHub Pages.
- Google Identity Services signs the owner into the static page from `https://hermes2545.github.io`.
- The static page calls the private backend at `http://127.0.0.1:8123` on the same machine/browser session.
- `cms_backend.server` verifies the token and owner allowlist.
- The backend writes the existing catalog/source files and publishes changed paths to GitHub using backend-only GitHub credentials.
- Existing Tailscale Serve paths/ports on the server must not be reused for the CMS unless the owner explicitly allocates a dedicated URL/port for it.

Runtime configuration lives outside the public repository:

- `GOOGLE_OAUTH_CLIENT_ID` = the Web client ID.
- `CMS_ALLOWED_EMAIL` = the owner Google account.
- `CMS_ALLOWED_ORIGIN=https://hermes2545.github.io`.
- `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`, and `GITHUB_BRANCH` select the write target.
- GitHub credentials come from backend-only environment variables or the owner-authorized `gh auth token`; never place them in `admin.html` or checked-in docs.

The repository includes:

- `Dockerfile.cms` and `requirements-cms.txt` for optional container packaging.
- `cms_backend/server.py` exposing:
  - `GET /api/health`.
  - `GET /api/collections` after Google auth.
  - `POST /api/reading/stage` after Google auth.
  - `POST /api/reading/publish` after Google auth, which stages the Reading upload and creates one GitHub commit for the changed paths.

## Verification

Before publishing CMS changes:

```bash
python -m unittest discover -s tests -v
python scripts/build_catalog.py --check
python scripts/build_audio_library.py --check
python scripts/build_app_library.py --check
python scripts/build_gallery.py --check
git diff --check
```

Also verify:

- No personal account, OAuth secret, GitHub token, signed URL, or local absolute path is present in public files.
- `admin.html` renders a Google Sign-In shell and collection tabs.
- Backend `/api/health` returns JSON.
- Unauthorized requests cannot access collection metadata or staging endpoints.
- A Reading test upload writes only the intended HTML, cover, catalog, and generated `index.html` paths.
