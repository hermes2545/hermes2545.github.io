---
title: Dedicated Library AI Agent Profile Blueprint
type: blueprint
status: active
visibility: public
language: th
created: 2026-08-23
updated: 2026-08-23
version: 1.0
sources:
  - Hermes Agent profile architecture
  - Agent-readable project knowledge systems
  - Static library website operations
tags:
  - ai-agent
  - hermes-profile
  - knowledge-library
  - project-agent
  - telegram-bot
  - google-drive
  - github-pages
  - public-safe
---

# Dedicated Library AI Agent Profile Blueprint

> คู่มือออกแบบ AI Agent แบบแยก Profile สำหรับดูแลเว็บไซต์ห้องสมุดความรู้ คู่มือ HTML หนังสือเสียง เอกสารโครงการ และกระบวนการเผยแพร่ โดยเขียนให้เป็น Public-safe และนำไปใช้เป็น Prompt ในระบบ AI อื่นได้ค่ะ

---

## 1. จุดประสงค์

เมื่อโครงการหนึ่งมี Website, Source files, Catalog, Covers, Documentation, Git repositories, Cloud documents และงานดูแลต่อเนื่อง การใช้ AI Agent ตัวเดียวกับงานทุกประเภทมักทำให้เกิดปัญหาค่ะ

- Context ของหลายโครงการปะปนกันค่ะ
- Agent อาจเลือก Tool หรือ Skill ที่ไม่เกี่ยวข้องค่ะ
- Memory อาจเก็บข้อมูลที่ล้าสมัยหรือข้ามขอบเขตค่ะ
- Credentials และสิทธิ์เข้าถึงกว้างเกินความจำเป็นค่ะ
- การสั่ง Publish หรือ Delete อาจกระทบระบบอื่นค่ะ
- Session ใหม่ต้องใช้เวลาค้นหาว่าไฟล์ใดเป็น Source of truth ค่ะ

แนวทางที่เหมาะสมคือสร้าง **Dedicated AI Agent Profile** แยกสำหรับโครงการ Library โดยเฉพาะค่ะ

เป้าหมายหลักของ Profile นี้คือค่ะ

1. แยก Identity, Context, Skills, Credentials, Sessions และ Gateway ออกจาก Agent อื่นค่ะ
2. ให้ Agent เข้าใจ Project จากเอกสารที่ตรวจสอบย้อนกลับได้ แทนการพึ่ง Memory ค่ะ
3. ให้ Agent ทำงาน Routine ที่ปลอดภัยได้เอง แต่ให้มนุษย์ควบคุม Public และ Destructive actions ค่ะ
4. ทำให้การเพิ่มหนังสือ สร้างปก ตรวจเว็บไซต์ และ Publish เป็น Workflow ที่ทำซ้ำได้ค่ะ
5. ทำให้ Project สามารถย้ายไปยังเครื่องหรือระบบ AI อื่นได้โดยมี Blueprint และ Runbooks ชัดเจนค่ะ

---

## 2. แนวคิดหลัก

### 2.1 Profile คือขอบเขต ไม่ใช่แค่ชื่อ Agent ค่ะ

Profile ควรเป็นขอบเขตของค่ะ

- Model และ Provider ค่ะ
- System persona หรือ `SOUL.md` ค่ะ
- Skills ค่ะ
- Sessions ค่ะ
- Memory policy ค่ะ
- Cron policy ค่ะ
- Messaging credentials ค่ะ
- Google OAuth ค่ะ
- Working directory ค่ะ
- Gateway service ค่ะ

ส่วน Agent คือบทบาทที่ทำงานอยู่ภายใน Profile ค่ะ

```text
Profile: <PROFILE_NAME>
└── Agent: <AGENT_NAME>
```

ไม่ควรสร้างหลาย Profile หากมี Agent หลักเพียงตัวเดียวที่ดูแล Project เดียวกัน เพราะจะทำให้ Catalog, Credentials และ Documentation แยกเป็นหลายชุดโดยไม่จำเป็นค่ะ

### 2.2 Project documents แทน Persistent memory ค่ะ

สำหรับโครงการที่มี Git และเอกสาร Agent ไม่จำเป็นต้องใช้ Persistent memory เสมอไปค่ะ

การใช้ `PROJECT.md`, `AGENTS.md`, Wiki index, Decisions, Runbooks และ Session handoff มีข้อดีกว่าค่ะ

- Review ได้ค่ะ
- Version control ได้ค่ะ
- แก้ไขและย้อนกลับได้ค่ะ
- ระบุ Source ได้ค่ะ
- ไม่หายจาก Context compression ค่ะ
- ย้ายไปให้ AI ระบบอื่นอ่านต่อได้ค่ะ

Memory ควรปิดหรือใช้เฉพาะ Routing facts ที่สั้นมากเท่านั้นค่ะ

### 2.3 หนึ่งข้อมูลมี Source of truth เพียงแห่งเดียวค่ะ

ตัวอย่างการแบ่ง Source of truth ค่ะ

| ข้อมูล | Source of truth |
|---|---|
| Website code | Git repository ค่ะ |
| Reading catalog | `data/books.json` ค่ะ |
| Audio catalog | `data/audio-books.json` ค่ะ |
| Public covers | Git repository ค่ะ |
| Architecture/Decisions/Runbooks | Markdown Wiki ค่ะ |
| User-facing project documents | Google Drive mirror ค่ะ |
| Deployment history | Git history ค่ะ |
| Session continuity | Handoff document ค่ะ |
| Disaster recovery | Profile export/backup system ค่ะ |

ไม่ควรสร้าง YAML หรือ Spreadsheet ซ้ำกับ JSON Catalog เพราะจะเกิด Source of truth สองแห่งค่ะ

### 2.4 Manual-first ก่อน Automation ค่ะ

ในระยะแรกควรให้ Agent ทำงานเมื่อได้รับคำสั่งค่ะ

- เพิ่ม Content ค่ะ
- ตรวจเว็บไซต์ค่ะ
- สร้างปกค่ะ
- Sync เอกสารค่ะ
- เตรียม Publish ค่ะ

ยังไม่ควรเปิด Cron หรือ Auto-publish จนกว่าจะมี Workflow ที่นิ่ง มี Test และมี Rollback ชัดเจนค่ะ

### 2.5 Human approval สำหรับ Public และ Destructive actions ค่ะ

Agent ควรแบ่งอำนาจเป็นสามระดับค่ะ

#### ทำเองได้ค่ะ

- อ่านและวิเคราะห์ไฟล์ค่ะ
- แก้ Working tree ค่ะ
- อัปเดต Catalog และ Wiki ค่ะ
- สร้างปกและ Generated pages ค่ะ
- รัน Tests และ Local preview ค่ะ
- ตรวจ Privacy และ Broken links ค่ะ
- Sync เอกสาร Private ไปยัง Folder ที่กำหนดค่ะ

#### ต้องรายงานก่อนทำค่ะ

- เปลี่ยน Schema ค่ะ
- เปลี่ยน Sorting policy ค่ะ
- Rename Public content ค่ะ
- เปลี่ยน Architecture หรือ Folder structure ค่ะ
- Commit การเปลี่ยนแปลงขนาดใหญ่ค่ะ

#### ต้องได้รับอนุมัติชัดเจนค่ะ

- Push Public repository ค่ะ
- Publish Website ค่ะ
- Delete หรือ Trash ไฟล์ค่ะ
- เปลี่ยน Drive permissions ค่ะ
- Force-push หรือ Rewrite history ค่ะ
- เปลี่ยน Credentials ค่ะ
- เปิด Cron, Memory หรือ Group access ค่ะ

---

## 3. สถาปัตยกรรมระบบ

```text
User
  │
  ▼
Dedicated Telegram Bot
  │
  ▼
Hermes Profile: <PROFILE_NAME>
  │
  └── Agent: <AGENT_NAME>
        │
        ├── Project repository
        ├── Reading catalog
        ├── Audio catalog
        ├── Cover assets
        ├── Project Wiki / Runbooks
        ├── Public Git repository
        ├── Private Git mirror
        └── Google Drive project folder
```

### หน้าที่ของแต่ละระบบค่ะ

#### Local Project ค่ะ

- Working tree ค่ะ
- Catalog และ Source files ค่ะ
- Generators และ Tests ค่ะ
- Agent-readable Wiki ค่ะ
- Private local registry ค่ะ

#### Public Git ค่ะ

- Website code ค่ะ
- Public Catalog ค่ะ
- Public-safe Covers ค่ะ
- Tests ค่ะ
- Public Architecture, Decisions และ Runbooks ค่ะ

#### Private Git mirror ค่ะ

- Mirror ของ Committed Git history ค่ะ
- ใช้เป็น Redundant backup ค่ะ
- ไม่ควรใช้แทน Profile backup หรือ Credential backup ค่ะ

#### Google Drive ค่ะ

- Project overview ค่ะ
- Private Architecture notes ค่ะ
- Decisions และ Runbooks สำหรับคนอ่านค่ะ
- Session handoffs ค่ะ
- Incident reports ค่ะ
- Private references ค่ะ

#### Telegram Bot ค่ะ

- ช่องทางรับคำสั่งและไฟล์ค่ะ
- แยก Session จาก Agent อื่นค่ะ
- DM-only และ Allowlist เฉพาะผู้ใช้ที่กำหนดค่ะ
- ใช้ Bot Token แยกจาก Profile อื่นค่ะ

---

## 4. โครงสร้าง Project ที่แนะนำ

```text
<PROJECT_PATH>/
├── AGENTS.md
├── PROJECT.md
├── README.md
├── data/
│   ├── books.json
│   └── audio-books.json
├── docs/
│   ├── SESSION_HANDOFF.md
│   └── wiki/
│       ├── SCHEMA.md
│       ├── index.md
│       ├── log.md
│       ├── architecture/
│       ├── decisions/
│       ├── runbooks/
│       └── incidents/
├── _meta/
│   ├── document-registry.json
│   └── sync-manifest.json
├── assets/
├── scripts/
├── templates/
└── tests/
```

Private local files สามารถเก็บไว้ใต้ `.hermes/` และต้องไม่ Commit เข้า Public repository ค่ะ

```text
.hermes/
├── project-links.json
├── document-registry.json
├── private-references/
└── working-notes/
```

---

## 5. เอกสารสำคัญ

### `AGENTS.md` ค่ะ

ใช้กำหนดค่ะ

- Agent identity ค่ะ
- ลำดับการอ่านเอกสารค่ะ
- Source of truth ค่ะ
- สิ่งที่ Agent ทำเองได้ค่ะ
- Approval gates ค่ะ
- Verification commands ค่ะ
- Privacy rules ค่ะ

### `PROJECT.md` ค่ะ

ใช้สรุปค่ะ

- เป้าหมาย Project ค่ะ
- ระบบภายนอกที่เชื่อมต่อค่ะ
- Collections และ Content policy ค่ะ
- Knowledge system ค่ะ
- Resume phrase ค่ะ

### `SCHEMA.md` ค่ะ

ควรกำหนด Frontmatter เช่นค่ะ

```yaml
---
title: <DOCUMENT_TITLE>
type: architecture | runbook | decision | incident | meta
status: draft | active | superseded | archived
visibility: public | private | confidential
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources:
  - <SOURCE_FILE_OR_URL>
tags:
  - <TAG>
---
```

### `index.md` ค่ะ

เป็น Knowledge map ที่ Agent ใช้ค้น Topic ที่เกี่ยวข้อง โดยไม่ต้องอ่านทุกไฟล์ค่ะ

### `log.md` ค่ะ

เป็น Append-only durable change log ใช้อธิบายว่าเกิดการเปลี่ยนแปลงสำคัญอะไรและเพราะเหตุใดค่ะ

### Runbooks ค่ะ

ควรมีอย่างน้อยค่ะ

- Add a reading book ค่ะ
- Add an audio book ค่ะ
- Generate a cover ค่ะ
- Verify the site ค่ะ
- Publish the site ค่ะ
- Sync Drive documents ค่ะ
- Close/resume session ค่ะ
- Restore the project ค่ะ

---

## 6. การสร้าง Profile

> คำสั่งเป็นตัวอย่าง ให้ตรวจ Version และ Help ของระบบก่อนใช้งานค่ะ

### 6.1 สร้าง Profile แบบสะอาดค่ะ

```bash
hermes profile create <PROFILE_NAME> --no-skills \
  --description "Dedicated agent for <PROJECT_NAME>"
```

ไม่ควร Clone `.env`, OAuth token, Telegram token, Memory หรือ Cron จาก Profile อื่นโดยอัตโนมัติค่ะ

### 6.2 ตั้งค่า Model และ Working directory ค่ะ

```bash
hermes -p <PROFILE_NAME> config set model.default <MODEL_ID>
hermes -p <PROFILE_NAME> config set model.provider <PROVIDER>
hermes -p <PROFILE_NAME> config set terminal.cwd <PROJECT_PATH>
hermes -p <PROFILE_NAME> config set approvals.mode smart
```

### 6.3 ปิด Memory ค่ะ

```bash
hermes -p <PROFILE_NAME> config set memory.memory_enabled false
hermes -p <PROFILE_NAME> config set memory.user_profile_enabled false
```

### 6.4 ตรวจ Cron ค่ะ

```bash
hermes -p <PROFILE_NAME> cron list --all
```

ผลที่ต้องการในระยะแรกคือไม่มี Scheduled jobs ค่ะ

### 6.5 สร้าง Agent persona ค่ะ

เขียน Profile `SOUL.md` ให้มีค่ะ

- ชื่อ Agent ค่ะ
- Project mission ค่ะ
- Systems ที่เชื่อมต่อค่ะ
- Source-of-truth order ค่ะ
- Authority levels ค่ะ
- Session start/close workflow ค่ะ
- Privacy และ Security rules ค่ะ

---

## 7. การเลือก Skills

อย่าติดตั้ง Skills ทุกประเภทให้ Dedicated Agent ค่ะ

ควรเลือกเฉพาะความสามารถที่เกี่ยวข้อง เช่นค่ะ

- GitHub repository management ค่ะ
- GitHub authentication/workflow ค่ะ
- Static web design ค่ะ
- HTML/CSS/JavaScript verification ค่ะ
- Test-driven development ค่ะ
- Image editing/generation ค่ะ
- Public source/visual reference collection ค่ะ
- YouTube metadata/content workflow ค่ะ
- Google Workspace Drive ค่ะ
- Pre-share scan ค่ะ
- Session handoff ค่ะ
- Project knowledge system ค่ะ

ไม่ควรให้ Skills ของระบบบัญชี CRM, Email automation, Smart home หรือระบบอื่นที่ไม่เกี่ยวกับ Project ค่ะ

---

## 8. Telegram Bot แยก

### 8.1 สร้างผ่าน BotFather ค่ะ

ขั้นตอนทั่วไปค่ะ

```text
/newbot
```

จากนั้นกำหนดค่ะ

- Display name: `<BOT_DISPLAY_NAME>` ค่ะ
- Username: ต้องลงท้ายด้วย `bot` หรือ `Bot` ตามกฎ Telegram ค่ะ

BotFather จะคืน Token ซึ่งเป็นข้อมูลลับค่ะ

### 8.2 จัดเก็บ Token อย่างปลอดภัยค่ะ

- ห้ามส่ง Token ใน Group หรือ Public chat ค่ะ
- ใช้ Hidden prompt ใน Terminal ค่ะ
- Validate ด้วย Telegram `getMe` ก่อนบันทึกค่ะ
- บันทึกใน Profile `.env` เท่านั้นค่ะ
- ตั้ง Permission เป็น `0600` ค่ะ
- ห้ามพิมพ์ Token กลับใน Output ค่ะ

### 8.3 Access policy ค่ะ

ตัวอย่างค่ะ

```text
TELEGRAM_ALLOWED_USERS=<TELEGRAM_USER_ID>
TELEGRAM_ALLOW_ALL_USERS=false
TELEGRAM_HOME_CHANNEL=<TELEGRAM_USER_ID>
```

สำหรับ DM-only ควรเพิ่ม Config ค่ะ

```yaml
platforms:
  telegram:
    allowed_chats:
      - "<NON_MATCHING_GROUP_SENTINEL>"
    group_allowed_chats: []
    guest_mode: false
    require_mention: true
    observe_unmentioned_group_messages: false
```

Telegram Bot อาจยังถูกเพิ่มเข้า Group ได้ แต่ Hermes จะไม่ประมวลผล Group messages ค่ะ หากต้องการปิดจาก Telegram โดยสมบูรณ์สามารถตั้ง Group membership ผ่าน BotFather เพิ่มได้ค่ะ

### 8.4 Foreground test ก่อน Service ค่ะ

```bash
hermes -p <PROFILE_NAME> gateway run
```

ตรวจให้เห็นค่ะ

```text
Active profile: <PROFILE_NAME>
Telegram connected
Gateway running with 1 platform
```

จากนั้นทดสอบ DM เข้าและออกจริงค่ะ

### 8.5 Persistent service ค่ะ

หยุด Foreground process ก่อน แล้วจึงติดตั้ง Service ค่ะ

```bash
hermes -p <PROFILE_NAME> gateway install
hermes -p <PROFILE_NAME> gateway start
hermes -p <PROFILE_NAME> gateway status
```

ตรวจค่ะ

- Service active/running ค่ะ
- Main PID ตรงกับ Profile ค่ะ
- Systemd linger เปิดค่ะ
- ไม่มี Duplicate poller ค่ะ
- Telegram polling healthy ค่ะ
- Shutdown timeout มากกว่า Agent drain timeout ค่ะ

---

## 9. Google OAuth แยก

### หลักการค่ะ

- Copy ได้เฉพาะ OAuth client configuration ค่ะ
- ห้าม Copy `google_token.json` จาก Profile อื่นค่ะ
- Authorize ใหม่โดยให้ `HERMES_HOME` ชี้ไปที่ Profile เป้าหมายค่ะ
- ตรวจ Account identity หลัง Auth ค่ะ
- ตั้ง Token และ Client Secret เป็น `0600` ค่ะ

ตัวอย่างค่ะ

```bash
export HERMES_HOME="$HOME/.hermes/profiles/<PROFILE_NAME>"
python <GOOGLE_SETUP_SCRIPT> --check
python <GOOGLE_SETUP_SCRIPT> --auth-url
```

หลังอนุญาต Browser อาจ Redirect ไป `http://localhost:1` และแสดง Error ซึ่งเป็นพฤติกรรมปกติของ Manual callback ค่ะ

ให้นำ Redirect URL ไป Exchange ด้วยค่ะ

```bash
python <GOOGLE_SETUP_SCRIPT> --auth-code "<FULL_REDIRECT_URL>"
```

Callback URL ที่มี `code=` เป็นข้อมูลลับและควรใช้เพียงครั้งเดียวค่ะ

หลัง Auth ต้องตรวจค่ะ

- OAuth account ถูกบัญชีค่ะ
- Token อยู่ใน Profile ที่ถูกต้องค่ะ
- Drive folder อ่าน/เขียนได้ค่ะ
- Folder capabilities อนุญาตให้ Add children ค่ะ
- Agent สามารถ Upload และ Read-back เอกสารทดสอบได้ค่ะ

---

## 10. Git Public และ Private Mirror

### Public repository ค่ะ

ใช้สำหรับ Code และ Public-safe project knowledge ค่ะ

### Private mirror ค่ะ

เพิ่ม Remote แยกค่ะ

```bash
git remote add backup <PRIVATE_REPOSITORY_URL>
```

หลังได้รับอนุมัติ Publish ค่ะ

```bash
git push origin main
git push backup main
git push backup --tags
```

ตรวจว่า Local, Public และ Private HEAD ตรงกันค่ะ

```bash
git rev-parse HEAD
git ls-remote origin refs/heads/main
git ls-remote backup refs/heads/main
```

Private mirror ไม่ควรเก็บ Credentials หรือ Browser profiles ค่ะ

---

## 11. Google Drive Document Registry

ใช้ Local private registry เชื่อม Relative path กับ Drive file ID ค่ะ

```json
{
  "schema_version": 1,
  "drive_parent_id": "<DRIVE_FOLDER_ID>",
  "documents": {
    "docs/example.md": {
      "visibility": "private",
      "drive_file_id": "<DRIVE_FILE_ID>",
      "status": "active",
      "sync_policy": "update-existing"
    }
  }
}
```

Workflow Sync ค่ะ

1. Search exact filename ใน exact parent ค่ะ
2. Update/Copy ไฟล์เดิมแทน Upload ซ้ำค่ะ
3. Verify ID, Name, MIME type, Parent และ `trashed=false` ค่ะ
4. Update registry หลัง Verification สำเร็จเท่านั้นค่ะ
5. การย้ายใช้ Copy → Verify → Trash source ค่ะ

---

## 12. Agent Operating Workflow

### ตอนเปิด Session ค่ะ

```text
1. Read AGENTS.md
2. Read PROJECT.md
3. Read docs/wiki/index.md
4. Read recent docs/wiki/log.md
5. Run git status --short --branch
6. Read only the relevant decision/runbook/catalog
```

### ตอนทำงานค่ะ

```text
1. Gather primary evidence
2. Write a failing test for behavior changes
3. Edit source/catalog/template
4. Regenerate artifacts
5. Run focused tests
6. Run full tests
7. Preview desktop/mobile
8. Run privacy scan
9. Prepare scoped commit
10. Request approval before public push
```

### ตอนปิด Session ค่ะ

```text
1. Run full verification
2. Update wiki index/log
3. Update SESSION_HANDOFF.md
4. Sync approved private docs to Drive
5. Report uncommitted files and background processes
6. Push only when explicitly approved
7. Verify remote and production state
```

---

## 13. ตัวอย่างการใช้งาน

### เพิ่มคู่มือ HTML ค่ะ

```text
เพิ่ม HTML นี้เป็นหนังสือใหม่ ตรวจ Privacy สร้างปกและ Preview ให้ดูก่อน แต่ยังไม่ Push
```

### เพิ่มหนังสือเสียงค่ะ

```text
เพิ่มรายการใหม่จาก Playlist นี้ ดาวน์โหลดปกไว้ Local เรียงจากวันที่ใหม่ไปเก่า และรัน Tests ทั้งหมด
```

### ตรวจ Website ค่ะ

```text
ตรวจ Reading และ Audio pages บน Desktop กับ Mobile เช็ก Broken links, Missing covers, Shelf layout และ Search interaction
```

### Publish ค่ะ

```text
ตรวจทั้งหมดแล้ว Commit และ Push Public repository พร้อม Private mirror จากนั้นตรวจ Production URL
```

### ปิด Session ค่ะ

```text
ปิด Session Project นี้ อัปเดต Wiki, Log, Handoff และสรุป Verification ให้ครบ
```

---

## 14. Verification Checklist

### Profile ค่ะ

- [ ] Profile path ถูกต้องค่ะ
- [ ] Working directory ถูกต้องค่ะ
- [ ] Memory ปิดค่ะ
- [ ] Cron ว่างค่ะ
- [ ] Skills เป็น Project-specific ค่ะ
- [ ] Agent persona และ Approval contract ถูกต้องค่ะ

### Telegram ค่ะ

- [ ] Token ผ่าน `getMe` ค่ะ
- [ ] Token ไม่ถูกพิมพ์ค่ะ
- [ ] `.env` เป็น `0600` ค่ะ
- [ ] User allowlist ถูกต้องค่ะ
- [ ] Allow-all ปิดค่ะ
- [ ] Group processing ปิดค่ะ
- [ ] DM round trip ผ่านค่ะ
- [ ] Persistent Service active ค่ะ
- [ ] ไม่มี Duplicate poller ค่ะ

### Google ค่ะ

- [ ] OAuth เป็น Profile-specific ค่ะ
- [ ] Account identity ถูกต้องค่ะ
- [ ] Token เป็น `0600` ค่ะ
- [ ] Target Drive folder อ่าน/เขียนได้ค่ะ
- [ ] Upload และ Read-back ผ่านค่ะ

### Project ค่ะ

- [ ] Catalog validation ผ่านค่ะ
- [ ] Generated pages ไม่ Drift ค่ะ
- [ ] Wiki frontmatter และ Index ผ่านค่ะ
- [ ] Public pre-share scan ผ่านค่ะ
- [ ] Desktop/Mobile preview ผ่านค่ะ
- [ ] Git diff check ผ่านค่ะ

### Publication ค่ะ

- [ ] ได้รับ Approval ค่ะ
- [ ] Public remote HEAD ตรงค่ะ
- [ ] Private mirror HEAD ตรงค่ะ
- [ ] Deployment build สำเร็จค่ะ
- [ ] Production read-back ผ่านค่ะ

---

## 15. ประโยชน์

### Context isolation ค่ะ

Agent เข้าใจเฉพาะ Project ที่รับผิดชอบและไม่ปะปนกับงานอื่นค่ะ

### Security ค่ะ

Credentials, Bot Token, OAuth และ Sessions แยกจาก Profile อื่นค่ะ

### Token efficiency ค่ะ

Agent อ่าน Index และ Topic ที่เกี่ยวข้องแทนการโหลดประวัติทั้งหมดค่ะ

### Repeatability ค่ะ

งานเพิ่ม Content, สร้างปก, Test และ Publish มี Runbook เดียวกันทุกครั้งค่ะ

### Human control ค่ะ

Agent ทำงาน Routine ได้เอง แต่มนุษย์ยังควบคุม Public และ Destructive actions ค่ะ

### Portability ค่ะ

Project สามารถย้ายไป Agent หรือ AI system อื่นได้ เพราะ Knowledge อยู่ในไฟล์ที่อ่านได้ค่ะ

### Auditability ค่ะ

Git history, Decision log, Incident notes และ Verification output ตรวจสอบย้อนหลังได้ค่ะ

### Recovery ค่ะ

Public Git, Private mirror, Drive documents และ Profile backup ทำหน้าที่คนละชั้นและช่วยลด Single point of failure ค่ะ

---

## 16. ข้อจำกัดและสิ่งที่ต้องระวัง

- Public repository เป็น World-readable ค่ะ
- Private Git ไม่ใช่ที่เก็บ Credentials ค่ะ
- Google OAuth อาจมี Scope กว้างกว่าหน้าที่ Agent จึงต้องมี Agent policy จำกัดการใช้งานค่ะ
- Telegram Bot Username ค้นเจอได้ แม้ Hermes จะปฏิเสธผู้ใช้ที่ไม่อยู่ใน Allowlist ค่ะ
- Memory ที่ปิดทำให้ Documentation ต้องทันสมัยเสมอค่ะ
- Cron ที่ปิดหมายความว่า Agent ไม่ทำงานเองจนกว่าจะได้รับข้อความค่ะ
- Agent policy เป็น Logical boundary ไม่ใช่ OS sandbox ค่ะ
- ระบบต้องตรวจ Live state ก่อน External operations เสมอค่ะ

---

# 17. Portable Master Prompt

คัดลอก Prompt ด้านล่างไปใช้กับ AI system อื่น แล้วแทนค่า Placeholder ก่อนเริ่มค่ะ

```text
You are an expert AI agent architect, documentation engineer, static-site maintainer, and security-conscious automation operator.

Your task is to design and initialize a dedicated AI agent profile for a knowledge-library project.

Project variables:
- Profile name: <PROFILE_NAME>
- Agent name: <AGENT_NAME>
- Project name: <PROJECT_NAME>
- Local project path: <PROJECT_PATH>
- Public site URL: <PUBLIC_SITE_URL>
- Public Git repository: <PUBLIC_REPOSITORY_URL>
- Private Git mirror: <PRIVATE_MIRROR_URL>
- Google Drive project folder: <DRIVE_FOLDER_ID>
- Telegram bot username: <TELEGRAM_BOT_USERNAME>
- Allowed Telegram user ID: <TELEGRAM_USER_ID>
- Model/provider: <MODEL_AND_PROVIDER>

Goals:
1. Isolate the project from unrelated agents, credentials, sessions, memory, cron jobs, tools, and business contexts.
2. Create one dedicated agent persona inside one clean profile.
3. Use project documents as durable knowledge instead of persistent memory.
4. Maintain one source of truth per data type.
5. Allow safe, reversible project work autonomously.
6. Require explicit user approval for public publishing, deletion, permission changes, credential changes, cron, memory, group access, and destructive Git operations.
7. Provide a DM-only Telegram interface with a single-user allowlist.
8. Use profile-scoped Google OAuth and verify the actual account identity.
9. Keep public code/docs in public Git, mirror committed history privately, and keep human-facing private project docs in a dedicated Drive folder.
10. Verify every external write by reading the exact target back.

Required profile policies:
- Persistent memory: disabled
- User-profile memory: disabled
- Cron: none
- Telegram allow-all: false
- Telegram groups: denied
- Public push: explicit approval required
- Credentials: profile-scoped and file permissions 0600
- Public files: pre-share scan required

Create these artifacts:
- Agent SOUL/persona document
- AGENTS.md operating contract
- PROJECT.md project overview
- docs/wiki/SCHEMA.md
- docs/wiki/index.md
- docs/wiki/log.md
- architecture overview
- decisions for autonomy, source of truth, and public/private boundaries
- runbooks for adding reading content, adding audio content, verifying/publishing, syncing Drive docs, closing/resuming sessions, and restoring the project
- local-only project-links registry
- local-only Drive document registry
- deterministic knowledge validator
- regression tests

Agent startup sequence:
1. Read AGENTS.md
2. Read PROJECT.md
3. Read wiki index
4. Read recent durable log
5. Inspect Git status/remotes
6. Load only relevant topic pages, catalogs, and runbooks

Agent work sequence:
1. Gather primary evidence
2. Write failing tests for behavior changes
3. Edit source/catalog/template
4. Regenerate outputs
5. Run focused and full tests
6. Verify desktop/mobile behavior
7. Run privacy scan
8. Prepare scoped commit
9. Ask approval before public push
10. Verify public/private remotes and production after approved push

Telegram setup rules:
- Guide the user one manual step at a time through BotFather
- Never ask the user to paste the bot token into chat
- Provide a hidden terminal prompt to validate and store the token
- Print only safe bot metadata
- Test foreground gateway before persistent service
- Verify one active poller only
- Keep DM-only access and single-user allowlist

Google OAuth rules:
- Copy only OAuth client configuration if reuse is approved
- Never copy an existing profile token
- Generate a fresh profile-scoped OAuth session
- Treat callback URLs containing code= as sensitive
- Verify account identity, token path, file mode, folder capabilities, upload, and read-back

Git rules:
- Public repository contains only public-safe artifacts
- Local/private registries are never staged publicly
- Private mirror receives the same approved commit
- Public push always requires explicit user approval

Verification requirements:
- Profile config check passes
- Selected project skills are enabled
- Memory remains disabled
- Cron remains empty
- Agent persona smoke test passes
- Telegram DM round trip passes
- Google Drive write/read-back passes
- Project tests pass
- Generated pages match source generators
- Knowledge validator passes
- Pre-share scan has zero sensitive hits
- Git remotes match after approved publication
- Persistent service is active, Telegram polling healthy, and shutdown timeout is safe

Do not invent credentials, tokens, account IDs, folder IDs, or URLs. Ask the user for missing external inputs one step at a time. Do not claim completion without real execution and verification evidence.
```

---

## 18. บทสรุป

Dedicated Library Agent Profile เหมาะกับโครงการที่มี Content, Website, Media assets, Documentation และ Publication workflow ต่อเนื่องค่ะ

หัวใจของระบบไม่ใช่การสร้าง Bot หรือ Profile เพียงอย่างเดียว แต่คือการสร้างขอบเขตที่ชัดเจนระหว่างค่ะ

- Identity ค่ะ
- Knowledge ค่ะ
- Credentials ค่ะ
- Tools ค่ะ
- Authority ค่ะ
- Verification ค่ะ
- Publication ค่ะ

เมื่อองค์ประกอบเหล่านี้ถูกแยกและเขียนเป็นเอกสาร AI Agent จะสามารถรับงานต่อใน Session ใหม่ ทำงานซ้ำได้อย่างเป็นระบบ และย้ายไปใช้กับ AI platform อื่นได้โดยไม่ต้องพึ่ง Conversation history เดิมค่ะ
