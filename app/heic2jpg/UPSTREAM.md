# HEIC to JPG Batch Converter upstream provenance

- Source repository: https://github.com/starlink2569/heic2jpg
- Source commit: 05b42790a39316d0232a25650b9940b757de8916
- Commit date: 2026-09-07 17:07:09 +0700
- Upstream index.html SHA-256: 925e0b4a6952c459546f43f8c6fb917ccc1d87c845502646e7dffdca0a6c86c5
- Upstream app icon SHA-256: 46de51a2ecdac7bfa4acdbf9f9de0ea2e9c4b68c36c8ff80df54505cd2b58dda
- Import mode: hardened-derivative

## Library changes

- Removed external Google Fonts requests from `index.html` for public-site privacy and offline-friendly loading.
- Kept the upstream app icon at `assets/app-icon.png` and referenced it from the runtime HTML.
- Retained the existing Library 80 MB per-file input guard before HEIC conversion to reduce browser memory blow-ups on the shared Library origin.
- Kept vendor libraries local under `vendor/`.
- Excluded non-runtime files such as `test-sample.heic`, `server.cjs`, `package.json`, `package-lock.json`, and `.git`.

## License / dependency notes

No repository LICENSE file was present at the pinned source commit. Do not publicly push/publish this imported app until redistribution scope is explicitly accepted by the project owner or upstream license status is clarified.

Vendored browser libraries identified from npm metadata:

- heic2any 0.0.4 — MIT — https://github.com/alexcorvi/heic2any
- JSZip 3.10.1 — MIT OR GPL-3.0-or-later — https://github.com/Stuk/jszip
