# Library Session Handoff

Updated: 2026-09-23T00:05:00+07:00

## Current state

- Project: The Knowledge Shelf at `https://hermes2545.github.io/`.
- Branch: `main`.
- Latest published CMS shell commit: `aa035fc` pushed to both public and private remotes; GitHub Pages run `35756058926` completed successfully and live `admin.html` matched local at that commit.
- Current unpushed security/UX fix: owner CMS Google sign-in now requires backend owner verification via `GET /api/session` before the browser stores the ID token or shows the upload panel.
- Backend service `knowledge-shelf-cms.service` is active on loopback `127.0.0.1:8123`.

## CMS security model

- Public `admin.html` contains only the OAuth Web Client ID and loopback API URL; it does not contain the owner email, Google secret, OAuth refresh token, or GitHub token.
- Backend `cms_backend.auth.verify_owner_id_token` verifies Google ID tokens against `GOOGLE_OAUTH_CLIENT_ID`, requires `email_verified`, and compares the token email to private env `CMS_ALLOWED_EMAIL`.
- Non-owner Google accounts may be able to complete the generic Google Sign-In browser step depending on Google OAuth consent/test-user configuration, but they are not authorized by the CMS backend.
- The latest local fix prevents the confusing UI state: `assets/js/admin-cms.js` calls `/api/session` first; if backend rejects the token, `idToken` is cleared and `#cms-panel` stays hidden.

## Files changed in current unpushed fix

- `cms_backend/server.py`: added `GET /api/session` after owner verification.
- `assets/js/admin-cms.js`: waits for `/api/session` before revealing upload controls.
- `tests/test_cms_backend.py`: added regression coverage for `/api/session` and frontend owner-verification flow.
- `docs/wiki/runbooks/owner-cms-backend.md`: clarified sign-in vs authorization.
- `docs/wiki/log.md` and this handoff updated.

## Verification completed for current unpushed fix

- `python -m unittest tests.test_cms_backend -v` → OK, 9 tests.
- `python -m unittest discover -s tests -v` → OK, 163 tests.
- `python scripts/build_catalog.py --check` → `index.html is current (38 books)`.
- `python scripts/build_audio_library.py --check` → `audio-library.html is current (60 audio books)`.
- `python scripts/build_app_library.py --check` → `app-library.html is current (9 apps)`.
- `python scripts/build_gallery.py --check` → `gallery.html is current (8 artworks)`.
- `git diff --check` → OK.
- Restarted `knowledge-shelf-cms.service`; health returned `{"ok": true, "service": "knowledge-shelf-cms"}`.
- `GET /api/session` with no token returned `400` / `missing bearer token`.
- `GET /api/session` with invalid token returned `400` / invalid Google ID token.

## Remaining / next actions

- Commit the current CMS auth-hardening fix locally after final scan.
- Ask the owner before pushing the fix to public GitHub Pages/private backup, because this current turn has not explicitly said `push` for this new fix.
- After approved push, verify remote HEADs, GitHub Pages deployment, and live `admin.html`/`assets/js/admin-cms.js` hash/read-back.
- `.hermes/` remains untracked/private and must not be committed.
