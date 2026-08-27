---
title: App Import Source and Privacy Audit
type: report
status: active
visibility: public
created: 2026-08-25
updated: 2026-08-27
sources:
  - https://github.com/p2544/battle-tank
  - https://github.com/p2544/bakery-center
  - https://github.com/p2544/loderunner
  - https://github.com/p2544/tumngern
tags: [library, app, import, provenance, privacy]
---

# App Import Source and Privacy Audit

## Scope

ตรวจ Source และ Runtime สำหรับ App Collection ก่อน Public push:

- Battle Tank
- Bakery Center
- Lode Runner
- Pac-Man
- PDF Password Remover
- ตุ่มเงิน

Metadata และ Commit ที่ใช้จริงอยู่ใน `data/apps.json` ซึ่งเป็น Source of truth; รายงานนี้อธิบายผลตรวจและเหตุผลการนำเข้าโดยไม่สร้าง Inventory ซ้ำ

## Source verification

**Passed:** URL ที่ผู้ใช้ระบุตรงกับ Repository ที่ Clone, Entry point เปิดผ่าน Static HTTP ได้ และ Commit เป็น SHA 40 ตัวอักษรที่บันทึกใน Catalog

### Battle Tank

- Source เป็น Single-file HTML; เสียงหลัก Embed อยู่ในไฟล์
- ไม่ต้องใช้ Build step, Login, Server หรือ API key
- นำเข้าเป็น `app/battle-tank.html` โดยรักษา SHA256 ของ Source HTML

### Bakery Center

- Source เป็น Single-file HTML; ใช้ IndexedDB สำหรับสูตร บันทึก และการตั้งค่าใน Browser
- ไม่พบ Login, Server-side API, Credential หรือการส่งข้อมูลผู้ใช้ไป Backend
- ตัด Google Fonts network dependency และใช้ Local system-font fallbacks เพื่อไม่ส่งข้อมูลเครือข่ายไป Third party
- Upstream SHA256 ถูกบันทึกใน `data/apps.json`; ไฟล์ `app/bakery-center.html` เป็น Library-hardened derivative จึงตั้ง `import_mode: hardened-derivative` และไม่อ้างว่า Byte-identical
- เพิ่ม Schema/size validation สำหรับ Backup และ AI import, Safe ID, Icon text escaping, JPEG-only photo data URLs, Stored-data migration และ Browser regression ที่ยิง Malicious payload จริง

### Lode Runner

- Source เป็น Multi-file HTML5/CreateJS runtime พร้อม JavaScript, ภาพ, เสียง และ LocalStorage
- Entry point ต้นฉบับคงอยู่ที่ `app/loderunner/lodeRunner.html`
- `app/loderunner.html` เป็น Same-origin fullscreen wrapper เพื่อรักษา Public launcher URL ที่กำหนด
- ไม่พบ Login, Credential หรือ Backend API
- เก็บ Attribution และ Source comments จาก Runtime ต้นฉบับไว้
- ตัด `.git`, README, Native executable tools, C++ utilities และ source disk images ซึ่งไม่จำเป็นต่อ Browser runtime

### Pac-Man

- รักษา `index.htm` และ `pacman.js` ตาม Source commit; เก็บ GPL-3.0 `COPYING`, PII-free `UPSTREAM.md`, Font license และ Runtime icon/font ที่จำเป็น
- ไม่ใช้ Backend หรือ External runtime service; Canvas รองรับ Keyboard และ Touch ตาม Source

### ตุ่มเงิน

- Source เป็น Multi-file React/PWA runtime จาก commit `fa43333cf0e73a2d2812e326644f0b9c960852da`; วันเผยแพร่ใน Catalog ใช้วันที่ที่เจ้าของกำหนด 30 กรกฎาคม 2026
- เก็บ runtime bundle, CSS, ภาพ, icons, manifest, service worker และ Workbox ที่จำเป็นไว้ใต้ `app/tumngern/`; ตัด `.git`, README และภาพประกอบ README ที่ไม่จำเป็นต่อ runtime
- เนื่องจาก upstream build ตรึง path `/tumngern/` จึงนำเข้าเป็น `path-adjusted-derivative`: เปลี่ยนเฉพาะ deployment base เป็น `/app/tumngern/` และอัปเดต Workbox revision ของไฟล์ที่เปลี่ยน
- `app/tumngern.html` เป็น stable launcher ที่ส่งต่อไปยัง PWA runtime; Browser QA ยืนยัน launcher redirect, manifest, JavaScript, CSS, splash, icon และ service worker assets ตอบ 200
- ข้อมูลหลักใช้ Browser storage และไม่มี network request อัตโนมัติบน splash/onboarding; ระบบ Sync เป็นทางเลือกที่ผู้ใช้ต้องตั้ง server และยืนยันเอง
- Runtime แสดงคำเตือนว่า Sync payload ยังไม่เข้ารหัสแบบ end-to-end และไม่เปิดใช้งาน Sync โดยปริยาย


## Privacy and metadata scan

- ไม่พบ API key, token, password, private key, OAuth credential, Telegram token, local absolute path หรือ private service ID ใน Public App runtime
- ตุ่มเงินมี Email ติดต่อผู้สร้างหนึ่งรายการในหน้า About; เป็นข้อมูลติดต่อที่เจ้าของเผยแพร่ไว้แล้วใน Public upstream และคงไว้ตามคำสั่งนำเข้า
- ภาพ Runtime จำนวน 74 ไฟล์ไม่มี EXIF metadata
- Raw binary scan พบ Email-like byte sequence ใน GIF หนึ่งไฟล์ แต่การตรวจ GIF metadata พบเฉพาะ Animation control data และไม่มี Comment/Author field จึงจัดเป็น Compressed-binary false positive

## License note

GitHub License API ไม่พบ License file ที่ประกาศชัดเจนใน Battle Tank, Bakery Center, Lode Runner และ Tumngern ณ Commit ที่นำเข้า; Lode Runner ระบุผู้สร้าง/แหล่ง Source ดั้งเดิมใน Runtime comments และ Tumngern เก็บ license headers ของ bundled dependencies ไว้ การนำเข้าครั้งนี้ทำตามคำสั่งตรงของเจ้าของโครงการและรักษา Attribution เดิม แต่ควรถือสถานะ License ของ Source ที่ไม่ประกาศว่า **not declared in source** จนกว่าจะมี License file อย่างเป็นทางการ

- Battle Tank มี Embedded MP3 metadata ระบุ “Gamemaster Audio”; ต้องยืนยันสิทธิ์เสียงหรือเปลี่ยน/ตัดเสียงก่อน Public push หากไม่มีหลักฐานสิทธิ์
- Lode Runner upstream, game source, sprites, audio และ level data ไม่มี Redistribution license ที่ตรวจพบ แม้ CreateJS vendor files จะมี MIT headers; Public push ต้องอาศัยการยืนยันฐานสิทธิ์จากผู้ใช้
- Pac-Man มี GPL-3.0 และนำ License/Corresponding browser source ไปพร้อม Runtime

## Decision

- Local preparation: approved by current user instruction
- Public push: approved by the current user instruction for the scoped Agent Reach and Tumngern additions
- Imported scope: runtime-only, source-provenance recorded, no destructive change to source repositories
- Withdrawn scope: Galaga, RL Battle City, and New Rally-X are no longer present in the active catalog or public runtime tree
