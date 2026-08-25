---
title: App Import Source and Privacy Audit
type: report
status: active
visibility: public
created: 2026-08-25
updated: 2026-08-25
sources:
  - https://github.com/p2544/battle-tank
  - https://github.com/p2544/bakery-center
  - https://github.com/p2544/loderunner
tags: [library, app, import, provenance, privacy]
---

# App Import Source and Privacy Audit

## Scope

ตรวจ Source และ Runtime สำหรับ App Collection ใหม่สามรายการก่อน Public push:

- Battle Tank
- Bakery Center
- Lode Runner

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

## Privacy and metadata scan

- ไม่พบ API key, token, password, private key, OAuth credential, Telegram token, local absolute path หรือ private service ID ใน Public App runtime
- ไม่พบ Email address ใน Text/HTML/JavaScript ที่นำเข้า
- ภาพ Runtime จำนวน 74 ไฟล์ไม่มี EXIF metadata
- Raw binary scan พบ Email-like byte sequence ใน GIF หนึ่งไฟล์ แต่การตรวจ GIF metadata พบเฉพาะ Animation control data และไม่มี Comment/Author field จึงจัดเป็น Compressed-binary false positive

## License note

GitHub License API ไม่พบ License file ที่ประกาศชัดเจนใน Source repositories ทั้งสาม ณ Commit ที่นำเข้า และ Lode Runner ระบุผู้สร้าง/แหล่ง Source ดั้งเดิมใน Runtime comments อยู่แล้ว การนำเข้าครั้งนี้ทำตามคำสั่งตรงของเจ้าของโครงการและรักษา Attribution เดิม แต่ควรถือสถานะ License ว่า **not declared in source** จนกว่าจะมี License file อย่างเป็นทางการ

- Battle Tank มี Embedded MP3 metadata ระบุ “Gamemaster Audio”; ต้องยืนยันสิทธิ์เสียงหรือเปลี่ยน/ตัดเสียงก่อน Public push หากไม่มีหลักฐานสิทธิ์
- Lode Runner upstream, game source, sprites, audio และ level data ไม่มี Redistribution license ที่ตรวจพบ แม้ CreateJS vendor files จะมี MIT headers; Public push ต้องอาศัยการยืนยันฐานสิทธิ์จากผู้ใช้

## Decision

- Local preparation: approved by current user instruction
- Public push: not yet approved
- Imported scope: runtime-only, source-provenance recorded, no destructive change to source repositories
