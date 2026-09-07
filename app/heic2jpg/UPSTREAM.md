# HEIC to JPG Batch Converter upstream provenance

- Source repository: https://github.com/starlink2569/heic2jpg
- Source commit: ee777bc671d7e5bb351ca31f4b9e7b7605a74207
- Commit date: 2026-09-07 16:54:49 +0700
- Upstream index.html SHA-256: 15a05341a7125bfbc3bc77ea0da446efcdd00e1e840f9db211581033d45c2307
- Import mode: hardened-derivative

## Library changes

- Removed external Google Fonts requests from `index.html` for public-site privacy and offline-friendly loading.
- Added an 80 MB per-file input guard before HEIC conversion to reduce browser memory blow-ups on the shared Library origin.
- Kept vendor libraries local under `vendor/`.
- Excluded non-runtime files such as `test-sample.heic`, `server.cjs`, `package.json`, `package-lock.json`, and `.git`.

## License / dependency notes

No repository LICENSE file was present at the pinned source commit. Do not publicly push/publish this imported app until redistribution scope is explicitly accepted by the project owner or upstream license status is clarified.

Vendored browser libraries identified from npm metadata:

- heic2any 0.0.4 — MIT — https://github.com/alexcorvi/heic2any
- JSZip 3.10.1 — MIT OR GPL-3.0-or-later — https://github.com/Stuk/jszip
