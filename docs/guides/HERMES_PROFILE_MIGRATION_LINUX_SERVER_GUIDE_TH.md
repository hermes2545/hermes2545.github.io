---
title: "คู่มือย้าย Hermes Profile ไปยัง Linux Server เครื่องใหม่"
type: guide
status: published
visibility: public
created: 2026-08-30
updated: 2026-08-30
language: th
scope: generic
---

# คู่มือย้าย Hermes Profile ไปยัง Linux Server เครื่องใหม่

คู่มือนี้เป็นเอกสารกลางสำหรับใช้ย้าย **Hermes Agent profile** จาก Linux server เครื่องเดิมไปยัง Linux server เครื่องใหม่ โดยออกแบบให้ใช้ได้กับหลายสถานการณ์ เช่น ย้าย profile ส่วนตัว, profile งาน, profile bot, profile ที่มี skills, cron jobs, project repositories, messaging gateway, dashboard, OAuth provider และเอกสาร handoff

เอกสารนี้ตั้งใจให้เป็น **คู่มือสอนคนอื่น** และ **prompt/template สำหรับใช้งานครั้งต่อไป** จึงไม่ควรใส่ข้อมูลจริงของระบบใดระบบหนึ่งลงไป ให้ใช้ placeholder แทนเสมอ

> หลักสำคัญ: ย้ายให้ปลอดภัยก่อน ย้ายให้ครบถ้วนทีหลัง และอย่าเปิด gateway/cron ซ้ำสองเครื่องพร้อมกันโดยไม่ตั้งใจ

---

## 0. ขอบเขตและหลักการ

### 0.1 เป้าหมาย

เมื่อทำตามคู่มือนี้จนจบ ควรได้ผลลัพธ์ดังนี้

- เครื่องใหม่มี Hermes Agent พร้อมใช้งาน
- มี profile เป้าหมายบนเครื่องใหม่ เช่น `<PROFILE_NAME>`
- profile ใหม่มี persona/config/skills/project files ที่จำเป็น
- secrets และ OAuth ถูกตั้งอย่างปลอดภัย ไม่คัดลอกมั่ว ๆ จากเครื่องเดิม
- messaging gateway ใช้งานได้บนเครื่องใหม่
- cron jobs ถูกย้ายหรือสร้างใหม่ตามแผน โดยไม่รันซ้ำกับเครื่องเดิม
- มี verification log หรือ evidence ว่าระบบตอบได้จริง
- มี handoff document สรุปว่าทำอะไรไปแล้ว อะไรยังเหลือ และ rollback อย่างไร

### 0.2 สิ่งที่คู่มือนี้ไม่ทำ

คู่มือนี้ไม่ใช่คู่มือกู้ทั้งเครื่องแบบ image backup และไม่ใช่คู่มือย้ายทุกข้อมูลแบบ blind copy ทั้ง home directory แต่เป็นแนวทางย้าย **Hermes profile อย่างมีการคัดเลือกและตรวจสอบ**

ไม่ควรใช้คู่มือนี้เพื่อ

- คัดลอก credentials ระหว่างคน/ทีมโดยไม่ได้รับอนุญาต
- แชร์ bot token, API key, OAuth token หรือ browser cookies
- เปิด gateway สองเครื่องด้วย token เดียวกันโดยไม่ได้ตั้งใจ
- เปิด cron เดิมสองชุดพร้อมกัน
- เผยแพร่ไฟล์ `.env`, `auth.json`, logs, browser profile หรือ local-only files

### 0.3 Placeholder ที่ใช้ในเอกสารนี้

ให้แทนค่าต่อไปนี้ด้วยค่าจริงเฉพาะตอนปฏิบัติงาน และอย่าใส่ค่าจริงลงในคู่มือสาธารณะ

```text
<OLD_HOST>              เครื่องเดิม
<NEW_HOST>              เครื่องใหม่
<PROFILE_NAME>          ชื่อ Hermes profile ที่จะย้าย
<OLD_HERMES_HOME>       Hermes home ของ profile เดิม
<NEW_HERMES_HOME>       Hermes home ของ profile ใหม่
<PROJECT_DIR>           โฟลเดอร์โปรเจกต์ที่ profile ใช้
<BACKUP_DIR>            โฟลเดอร์เก็บ backup ชั่วคราว
<DRIVE_OR_ARCHIVE_PATH> ที่เก็บ archive หรือเอกสารส่งต่อ
<DISCORD_BOT_TOKEN>     Discord bot token — ห้ามใส่ในเอกสาร
<TELEGRAM_BOT_TOKEN>    Telegram bot token — ห้ามใส่ในเอกสาร
<ALLOWED_USER_ID>       user ID ที่อนุญาตให้คุยกับ bot
<HOME_CHANNEL_ID>       channel/chat ID ปลายทาง
<MODEL_PROVIDER>        provider/model ที่ใช้
```

---

## 1. Phase 0 — User Interview และ Intake Document

ก่อนเริ่มย้ายจริง ให้สัมภาษณ์ผู้ใช้หรือเจ้าของระบบก่อนเสมอ เป้าหมายคือแยกให้ชัดว่าอะไรต้องย้าย อะไรต้องสร้างใหม่ อะไรต้องปิด และอะไรห้ามย้าย

### 1.1 เลือกวิธีสัมภาษณ์

มี 3 วิธีหลัก

#### วิธี A: สัมภาษณ์ในแชท

เหมาะสำหรับงานที่มี operator คนเดียวหรืองานที่ต้องทำเร็ว

ขั้นตอน

1. Agent ถามคำถามทีละชุด
2. ผู้ใช้ตอบในแชท
3. Agent สรุป requirement กลับให้ผู้ใช้ตรวจ
4. Agent สร้าง migration plan
5. ผู้ใช้อนุมัติ scope
6. Agent ลงมือย้ายและ verify

ข้อดี

- เร็ว
- ใช้ได้ผ่าน CLI, Telegram, Discord หรือ dashboard
- เหมาะกับ prompt reuse
- ไม่ต้องตั้ง permission Google Docs

ข้อควรระวัง

- ข้อมูลอาจกระจัดกระจายในแชท
- ต้องสรุปเป็นเอกสารก่อนลงมือจริง
- ห้ามให้ผู้ใช้ paste secrets ในแชท

#### วิธี B: Markdown Worksheet

เหมาะสำหรับใช้ซ้ำหรือเก็บใน repo/private docs

ขั้นตอน

1. สร้างไฟล์ intake เช่น `migration-intake.md`
2. ให้ผู้ใช้กรอกหรือเลือก checkbox
3. Agent อ่าน worksheet
4. Agent สร้าง migration plan
5. ลงมือหลัง scope ชัดเจน

ข้อดี

- version control ได้
- ใช้เป็น template ซ้ำได้
- แปลงเป็น prompt ได้ง่าย
- เหมาะกับ automation

ข้อควรระวัง

- ถ้าไฟล์อยู่ใน repo public ต้องห้ามมี secrets หรือข้อมูลเฉพาะที่ไม่ควรเผยแพร่
- ควรแยก `private` กับ `public` ให้ชัด

#### วิธี C: Google Docs Worksheet

เหมาะสำหรับงานที่มีหลายคนร่วมตรวจหรือใช้สอนทีม

ขั้นตอน

1. สร้าง Google Doc จาก intake template
2. ผู้ใช้กรอกตัวเลือกและคำตอบ
3. Agent อ่านเอกสารกลับมา
4. Agent สรุป migration plan
5. หลังจบงาน สร้าง final handoff

ข้อดี

- อ่านง่ายสำหรับคนทั่วไป
- แชร์ให้ reviewer ได้
- เหมาะกับ training และ checklist

ข้อควรระวัง

- Google Docs เป็นทางเลือก ไม่ใช่ข้อบังคับ
- ห้ามใส่ token, password, API key, OAuth refresh token หรือ private key ใน Google Docs
- ต้องระวัง permission และ sharing scope
- ให้เก็บเฉพาะชื่อ secret เช่น `DISCORD_BOT_TOKEN` ไม่ใช่ค่าจริง

### 1.2 Intake Worksheet Template

ใช้ template นี้ก่อนเริ่มย้าย

```markdown
# Hermes Profile Migration Intake Worksheet

## A. Basic Information

- Migration date:
- Operator:
- Old host: <OLD_HOST>
- New host: <NEW_HOST>
- Profile name: <PROFILE_NAME>
- Is this profile currently in production?
  - [ ] Yes
  - [ ] No
  - [ ] Not sure

## B. Migration Goal

Choose one:

- [ ] Move existing profile to a new server
- [ ] Rebuild profile cleanly on a new server
- [ ] Clone profile for staging/test only
- [ ] Split one profile into multiple profiles
- [ ] Consolidate multiple profiles into one server

## C. Migration Strategy

Choose one:

- [ ] Clean rebuild with selected files only
- [ ] Selective copy of profile files
- [ ] Full profile restore from backup
- [ ] Hybrid: clone project repos, copy skills/config, recreate secrets

Recommended default: Hybrid migration

## D. Components to Migrate

- [ ] `SOUL.md` / persona
- [ ] `config.yaml` settings
- [ ] profile-specific skills
- [ ] project repositories or worktrees
- [ ] runbooks / handoff docs
- [ ] cron jobs / scheduled jobs
- [ ] messaging gateway settings
- [ ] dashboard settings
- [ ] OAuth provider credentials
- [ ] memory files
- [ ] session history
- [ ] cache/artifacts
- [ ] logs

## E. Components to Recreate Instead of Copying

- [ ] API keys
- [ ] bot tokens
- [ ] OAuth login
- [ ] dashboard password
- [ ] browser login/cookies
- [ ] system service unit
- [ ] network binding / ports

## F. Messaging Platforms

Platforms used:

- [ ] Telegram
- [ ] Discord
- [ ] Slack
- [ ] LINE
- [ ] Matrix
- [ ] Mattermost
- [ ] Webhook/API only
- [ ] None

For each platform:

- Existing bot or new bot?
- Token owner:
- Allowed users or roles:
- Home channel/chat:
- Should old server be stopped before new server starts?

## G. Cron Jobs

- Does the profile have scheduled jobs?
  - [ ] Yes
  - [ ] No
  - [ ] Not sure

Cron migration strategy:

- [ ] Do not migrate cron
- [ ] Migrate cron but keep paused
- [ ] Recreate cron manually
- [ ] Migrate and enable after full verification

## H. Secrets

Do not paste secret values here. List secret names only.

Examples:

- `DISCORD_BOT_TOKEN`
- `TELEGRAM_BOT_TOKEN`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `DASHBOARD_BASIC_AUTH_PASSWORD`
- `OAUTH_PROVIDER_LOGIN`

## I. Success Criteria

The migration is successful when:

- [ ] profile exists on new server
- [ ] model/provider works
- [ ] `hermes status` is healthy enough
- [ ] profile responds locally
- [ ] gateway responds from messaging platform
- [ ] cron jobs are correct and not duplicated
- [ ] project commands/tests pass
- [ ] old gateway/cron are paused or retired if needed
- [ ] handoff document is complete

## J. Rollback Plan

- How to stop the new gateway:
- How to restart the old gateway:
- Where backup is stored:
- Who approves rollback:
```

### 1.3 Interview Questions สำหรับ Agent

ถ้าใช้แชทแทน worksheet ให้ Agent ถามเป็นชุด ๆ ดังนี้

#### ชุดที่ 1: เป้าหมาย

1. ต้องการย้าย profile ไหนไปเครื่องใหม่
2. เครื่องใหม่จะเป็น production ทันทีหรือ staging ก่อน
3. เครื่องเดิมจะปิด, เก็บเป็น backup, หรือยังใช้งานต่อ
4. ต้องการ downtime ได้หรือไม่
5. เกณฑ์ที่ถือว่าสำเร็จคืออะไร

#### ชุดที่ 2: ข้อมูลที่จะย้าย

1. ต้องย้าย persona/SOUL.md หรือสร้างใหม่
2. ต้องย้าย config.yaml หรือสร้างใหม่
3. ต้องย้าย skills ทั้งหมดหรือเฉพาะบาง skill
4. มี project repo/worktree ที่ profile ใช้หรือไม่
5. ต้องย้าย session history หรือไม่
6. ต้องย้าย memory หรือไม่
7. ต้องย้าย logs/cache/artifacts หรือไม่

#### ชุดที่ 3: Secrets และ OAuth

1. ใช้ provider อะไร
2. ใช้ OAuth หรือ API key
3. จะ login ใหม่บนเครื่องใหม่ได้หรือไม่
4. มี bot token หรือ webhook secret อะไรที่ต้องตั้งใหม่
5. ใครเป็นคนถือ secret
6. ใช้วิธีใส่ secret แบบใด: terminal, form ชั่วคราว, secret manager, หรือ manual edit

#### ชุดที่ 4: Gateway และ messaging

1. ใช้ Telegram, Discord, Slack, LINE หรือ platform อื่น
2. จะใช้ bot เดิมหรือสร้าง bot ใหม่
3. ต้องตั้ง allowed users/roles หรือไม่
4. ต้องตั้ง home channel/chat ใหม่หรือไม่
5. เครื่องเดิมมี active poller อยู่หรือไม่
6. ต้องหยุด gateway เครื่องเดิมก่อนเปิดเครื่องใหม่หรือไม่

#### ชุดที่ 5: Cron และ automation

1. มี cron jobs หรือ scheduled jobs หรือไม่
2. job ใดห้ามรันซ้ำสองเครื่อง
3. job ใดต้อง pause ก่อน cutover
4. delivery target ต้องเปลี่ยนหรือไม่
5. job ใช้ path/token/host-specific value หรือไม่

#### ชุดที่ 6: Verification

1. จะทดสอบ local chat อย่างไร
2. จะทดสอบ messaging อย่างไร
3. จะทดสอบ project-specific build/test อย่างไร
4. ต้องทดสอบ reboot หรือ service autostart หรือไม่
5. ต้องทำ handoff ให้ใครอ่าน

### 1.4 หลังสัมภาษณ์ต้องสร้างเอกสารอะไร

หลังสัมภาษณ์เสร็จ ควรสร้างเอกสาร 2 ฉบับ

#### เอกสารที่ 1: Migration Plan

สร้างก่อนลงมือ ใช้ยืนยัน scope

```markdown
# Hermes Profile Migration Plan

## Scope

## Out of Scope

## Source Environment

## Target Environment

## Data to Migrate

## Data to Recreate

## Secrets Handling Plan

## Gateway Cutover Plan

## Cron Migration Plan

## Verification Checklist

## Rollback Plan

## Approval Needed Before Cutover
```

#### เอกสารที่ 2: Migration Handoff

สร้างหลังทำเสร็จ ใช้เป็นหลักฐานและคู่มือดูแลต่อ

```markdown
# Hermes Profile Migration Handoff

## Summary

## What Was Migrated

## What Was Recreated

## What Was Not Migrated

## New Server Status

## Gateway Status

## Cron Status

## Auth/Provider Status

## Verification Evidence

## Remaining Optional Hardening

## Rollback Notes

## Day-2 Operations
```

---

## 2. Phase 1 — Pre-Migration Inventory บนเครื่องเดิม

ทำ inventory ก่อน copy อะไรทั้งสิ้น เพื่อรู้ว่าระบบเดิมมีอะไรอยู่จริง

### 2.1 ตรวจ Hermes และ profile

บนเครื่องเดิม `<OLD_HOST>`

```bash
hermes --version || true
hermes profile list
hermes -p <PROFILE_NAME> status
hermes -p <PROFILE_NAME> config check
```

บันทึกผลลัพธ์เฉพาะสถานะ ไม่บันทึก secret values

ควรระบุ

- profile มีอยู่หรือไม่
- model/provider ใช้อะไร
- gateway running หรือ stopped
- messaging platforms configured หรือไม่
- cron jobs มีหรือไม่
- auth provider logged in หรือไม่

### 2.2 ตรวจ Hermes home ของ profile

โดยทั่วไป profile จะอยู่ที่

```text
~/.hermes/profiles/<PROFILE_NAME>/
```

แต่ห้าม assume เสมอ ให้ตรวจจาก environment หรือ Hermes status

```bash
echo "HERMES_HOME=${HERMES_HOME:-$HOME/.hermes}"
hermes -p <PROFILE_NAME> status
```

### 2.3 สำรวจไฟล์ใน profile

ตัวอย่างโครงสร้างที่มักพบ

```text
<OLD_HERMES_HOME>/
  SOUL.md
  config.yaml
  .env
  auth.json
  skills/
  cron/
  sessions/
  logs/
  cache/
  memories/
  projects/ or project links
```

ใช้คำสั่งสำรวจแบบไม่เปิดเผย secrets

```bash
find <OLD_HERMES_HOME> -maxdepth 2 -type f | sort
find <OLD_HERMES_HOME>/skills -maxdepth 3 -type f | sort
```

### 2.4 ตรวจ Git/project directories

ถ้า profile ใช้ project repository ให้ตรวจ

```bash
cd <PROJECT_DIR>
git status --short --branch
git remote -v
git branch --show-current
git log -1 --oneline
```

หลักการ

- ถ้าเป็น project ที่อยู่ใน Git ให้ clone จาก remote บนเครื่องใหม่ดีกว่า copy working tree ทั้งหมด
- ถ้ามี local-only files ให้แยก backup ต่างหาก
- อย่า commit `.env`, credentials, cookies, local cache หรือ private registry ลง public repo

### 2.5 ตรวจ skills

```bash
hermes -p <PROFILE_NAME> skills list
find <OLD_HERMES_HOME>/skills -maxdepth 3 -type f | sort
```

บันทึก

- skill ใดเป็น global/bundled/local
- skill ใดถูกแก้เฉพาะ profile
- skill ใดมี scripts/templates/references ที่ต้องย้าย

### 2.6 ตรวจ cron jobs

```bash
hermes -p <PROFILE_NAME> cron list
```

สำหรับแต่ละ job ให้บันทึก

- job name
- schedule
- enabled/paused
- prompt หรือ script ที่ใช้
- delivery target
- dependencies
- secrets ที่ต้องใช้ โดยบันทึกแค่ชื่อ secret ไม่บันทึกค่า

### 2.7 ตรวจ gateway และ messaging

```bash
hermes gateway list
hermes -p <PROFILE_NAME> gateway status
hermes -p <PROFILE_NAME> status
```

บันทึก

- platform ที่ใช้ เช่น Telegram/Discord/Slack/LINE
- home channel/chat configured หรือไม่
- allowed users/roles configured หรือไม่
- gateway เป็น manual process หรือ service
- มี active process บนเครื่องเดิมหรือไม่

### 2.8 ตรวจ service และ process

```bash
ps -ef | grep -i hermes | grep -v grep
systemctl --user list-units | grep -i hermes || true
systemctl list-units | grep -i hermes || true
```

ถ้าใช้ systemd service ให้บันทึก unit name แต่ไม่คัดลอก unit แบบ blind copy เพราะ path/user/environment อาจต่างกัน

---

## 3. Phase 2 — จัดประเภทข้อมูลก่อนย้าย

### 3.1 ข้อมูลที่มักย้ายได้

ย้ายได้หลัง review

```text
SOUL.md
config.yaml
skills/
project runbooks
project docs
non-secret templates
non-secret scripts
selected cron definitions
selected session handoff documents
```

### 3.2 ข้อมูลที่ควรสร้างใหม่หรือ re-authenticate

```text
.env
API keys
bot tokens
OAuth auth.json
browser profiles/cookies
dashboard password
systemd units
network binding
home channel ID
allowed user/role IDs
```

อธิบายเพิ่มเติม

- `.env` มี secrets จึงไม่ควรส่งผ่าน chat หรือเก็บในเอกสารทั่วไป
- `auth.json` เป็น OAuth credential ควร login ใหม่บนเครื่องใหม่ ถ้าเป็นไปได้
- bot token ควรใส่เองผ่าน secure terminal/form/secret manager
- channel IDs อาจเปลี่ยนเมื่อย้าย workspace/server/channel

### 3.3 ข้อมูลที่ไม่ควรย้ายเว้นแต่มีเหตุผลชัดเจน

```text
cache/
logs/
state.db WAL files
browser cookies
unrelated profile data
other user's memories
active process state
large generated artifacts
old temporary files
```

### 3.4 นโยบาย secrets

กฎพื้นฐาน

1. Secrets ต้องอยู่ใน `.env` หรือ secret manager เท่านั้น
2. Settings ที่ไม่ใช่ secret ต้องอยู่ใน `config.yaml`
3. ห้ามใส่ secret ใน Google Docs, Markdown guide, public repo, issue tracker หรือ chat
4. ถ้าต้องระบุ ให้ระบุชื่อ key เท่านั้น เช่น `DISCORD_BOT_TOKEN`
5. ก่อนแชร์เอกสาร ต้อง scan หา secret และข้อมูลเฉพาะระบบ

---

## 4. Phase 3 — เตรียมเครื่องใหม่

### 4.1 ตรวจ OS และ dependency พื้นฐาน

บนเครื่องใหม่ `<NEW_HOST>`

```bash
uname -a
cat /etc/os-release
python3 --version
git --version
ssh -V
```

ถ้าใช้ Node/Playwright/browser automation/project build ให้ตรวจเพิ่ม

```bash
node --version || true
npm --version || true
google-chrome --version || chromium --version || true
```

### 4.2 ติดตั้ง Hermes Agent

ติดตั้งตาม official docs ของ Hermes Agent เวอร์ชันปัจจุบัน

ตัวอย่าง generic

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

หลังติดตั้ง

```bash
hermes doctor
hermes --help
```

### 4.3 สร้างหรือเตรียม profile ใหม่

ถ้าเป็น clean rebuild

```bash
hermes profile create <PROFILE_NAME> --description "<PROFILE_PURPOSE>"
```

ถ้าต้องการไม่ seed bundled skills

```bash
hermes profile create <PROFILE_NAME> --no-skills --description "<PROFILE_PURPOSE>"
```

ตรวจ profile

```bash
hermes profile list
hermes -p <PROFILE_NAME> status
```

### 4.4 ตั้ง model/provider

ใช้คำสั่ง Hermes ไม่แก้ config ด้วยมือถ้าไม่จำเป็น

```bash
hermes -p <PROFILE_NAME> model
```

หรือถ้ารู้ key/value ที่ถูกต้อง

```bash
hermes -p <PROFILE_NAME> config set model <MODEL_NAME>
```

สำหรับ OAuth provider ให้ login ใหม่บนเครื่องใหม่

```bash
hermes -p <PROFILE_NAME> auth add <PROVIDER_NAME>
hermes -p <PROFILE_NAME> auth status <PROVIDER_NAME>
```

---

## 5. Phase 4 — Backup เครื่องเดิม

### 5.1 สร้าง backup directory

บนเครื่องเดิม

```bash
mkdir -p <BACKUP_DIR>/<PROFILE_NAME>-migration
```

### 5.2 Backup แบบ allowlist

แนะนำให้ copy เฉพาะไฟล์ที่ตั้งใจย้าย

```bash
rsync -av \
  <OLD_HERMES_HOME>/SOUL.md \
  <OLD_HERMES_HOME>/config.yaml \
  <OLD_HERMES_HOME>/skills/ \
  <BACKUP_DIR>/<PROFILE_NAME>-migration/profile/
```

ถ้ามี docs/runbooks/private handoff ที่ต้องย้าย

```bash
rsync -av \
  <OLD_HERMES_HOME>/docs/ \
  <BACKUP_DIR>/<PROFILE_NAME>-migration/docs/ \
  --exclude '.env' \
  --exclude 'auth.json' \
  --exclude 'cache/' \
  --exclude 'logs/'
```

### 5.3 Backup แบบ broader copy พร้อม exclude

ใช้เฉพาะเมื่อเข้าใจโครงสร้าง profile ดีแล้ว

```bash
rsync -av \
  <OLD_HERMES_HOME>/ \
  <BACKUP_DIR>/<PROFILE_NAME>-migration/profile/ \
  --exclude '.env' \
  --exclude 'auth.json' \
  --exclude 'google_token.json' \
  --exclude 'cache/' \
  --exclude 'logs/' \
  --exclude '*.sock' \
  --exclude 'state.db-wal' \
  --exclude 'state.db-shm'
```

### 5.4 สร้าง checksum

```bash
cd <BACKUP_DIR>
tar -czf <PROFILE_NAME>-migration.tar.gz <PROFILE_NAME>-migration
sha256sum <PROFILE_NAME>-migration.tar.gz > <PROFILE_NAME>-migration.tar.gz.sha256
```

### 5.5 ตรวจ backup ไม่มี secrets

ตัวอย่าง scan เบื้องต้น

```bash
grep -RInE "(api[_-]?key|token|secret|password|refresh_token|client_secret|private_key)" \
  <BACKUP_DIR>/<PROFILE_NAME>-migration \
  --exclude-dir cache \
  --exclude-dir logs || true
```

ถ้าพบ secret ให้ลบหรือ redact ก่อนส่งต่อ

---

## 6. Phase 5 — Copy ไปเครื่องใหม่

### 6.1 ใช้ rsync ผ่าน SSH

```bash
rsync -avz \
  <BACKUP_DIR>/<PROFILE_NAME>-migration/ \
  <NEW_USER>@<NEW_HOST>:<BACKUP_DIR>/<PROFILE_NAME>-migration/
```

หรือ copy archive

```bash
scp <BACKUP_DIR>/<PROFILE_NAME>-migration.tar.gz \
    <BACKUP_DIR>/<PROFILE_NAME>-migration.tar.gz.sha256 \
    <NEW_USER>@<NEW_HOST>:<BACKUP_DIR>/
```

### 6.2 Verify checksum บนเครื่องใหม่

```bash
cd <BACKUP_DIR>
sha256sum -c <PROFILE_NAME>-migration.tar.gz.sha256
tar -xzf <PROFILE_NAME>-migration.tar.gz
```

---

## 7. Phase 6 — Restore profile บนเครื่องใหม่

### 7.1 ระบุตำแหน่ง profile ใหม่

```bash
hermes -p <PROFILE_NAME> status
```

โดยทั่วไป

```text
<NEW_HERMES_HOME>=~/.hermes/profiles/<PROFILE_NAME>
```

### 7.2 Restore persona และ config

```bash
cp <BACKUP_DIR>/<PROFILE_NAME>-migration/profile/SOUL.md <NEW_HERMES_HOME>/SOUL.md
```

สำหรับ `config.yaml` ให้ระวัง host-specific paths และ settings

ทางเลือกที่ปลอดภัยกว่า

1. เปิดดู config เดิม
2. ย้ายเฉพาะ settings ที่ต้องใช้
3. ตั้งค่าด้วยคำสั่ง `hermes config set`

ตัวอย่าง

```bash
hermes -p <PROFILE_NAME> config set stt.enabled true
hermes -p <PROFILE_NAME> config set tts.provider edge
```

> หลีกเลี่ยงการ hand-edit `config.yaml` ถ้าไม่จำเป็น เพราะ YAML ผิด indent แล้ว profile อาจพังได้

### 7.3 Restore skills

```bash
rsync -av \
  <BACKUP_DIR>/<PROFILE_NAME>-migration/profile/skills/ \
  <NEW_HERMES_HOME>/skills/
```

ตรวจ

```bash
hermes -p <PROFILE_NAME> skills list
```

ถ้า skill มี setup script ให้รันตามคู่มือของ skill นั้น ๆ

### 7.4 Restore project repository

ถ้า project มี remote Git ให้ clone ใหม่

```bash
git clone <PROJECT_REPOSITORY_URL> <PROJECT_DIR>
cd <PROJECT_DIR>
git status --short --branch
```

ถ้า project มี local-only files ให้ copy แยกหลัง scan แล้ว

```bash
rsync -av <OLD_PROJECT_LOCAL_ONLY_DIR>/ <PROJECT_DIR>/<LOCAL_ONLY_DIR>/
```

อย่า copy local-only secrets เข้า public repo

### 7.5 Restore docs/runbooks/handoffs

```bash
rsync -av \
  <BACKUP_DIR>/<PROFILE_NAME>-migration/docs/ \
  <NEW_HERMES_HOME>/docs/
```

ถ้าเอกสารมีข้อมูลเฉพาะระบบ ให้ตั้ง visibility เป็น private/confidential และอย่าเผยแพร่

---

## 8. Phase 7 — Secrets และ OAuth

### 8.1 สร้าง `.env` ใหม่

สร้าง `.env` บนเครื่องใหม่โดยใส่เฉพาะ secrets ที่ต้องใช้จริง

```bash
nano <NEW_HERMES_HOME>/.env
```

ตัวอย่าง key names เท่านั้น

```dotenv
DISCORD_BOT_TOKEN=<SECRET>
DISCORD_ALLOWED_USERS=<ALLOWED_USER_ID>
TELEGRAM_BOT_TOKEN=<SECRET>
TELEGRAM_ALLOWED_USERS=<ALLOWED_USER_ID>
```

ห้าม commit `.env`

### 8.2 ใช้ temporary form ถ้าผู้ใช้ไม่ถนัด terminal

สำหรับ remote server อาจสร้าง form ชั่วคราวที่ bind เฉพาะ private network/VPN แล้วให้ผู้ใช้ paste token เอง

กฎของ temporary form

- URL ต้องเป็นชั่วคราว
- ใช้ nonce/random path
- รับเฉพาะ POST
- บันทึกลง `.env` เท่านั้น
- ไม่ log token
- ปิดตัวเองหลัง submit สำเร็จ
- ลบ script หลังใช้งานถ้าไม่ต้องเก็บ

### 8.3 OAuth provider

ถ้า provider ใช้ OAuth ให้ login ใหม่บนเครื่องใหม่

```bash
hermes -p <PROFILE_NAME> auth add <PROVIDER_NAME>
hermes -p <PROFILE_NAME> auth status <PROVIDER_NAME>
```

หากเป็น device flow

1. Agent สร้าง authorization URL/code
2. ผู้ใช้เปิด URL และ authorize เอง
3. Agent ตรวจ status หลังผู้ใช้บอกว่า authorized

ห้ามให้ Agent ดู password, 2FA code หรือ recovery code

---

## 9. Phase 8 — Messaging Gateway Migration

### 9.1 หลักการสำคัญ

- token เดียวไม่ควรมี gateway/poller ซ้ำสองเครื่อง
- ถ้าย้าย production ให้หยุด gateway เครื่องเดิมก่อนเปิดเครื่องใหม่
- ถ้าทดสอบ staging ให้ใช้ bot token แยกหรือ channel แยก
- ตั้ง allowed users/roles เสมอ
- ตั้ง home channel/chat ใหม่ถ้าจำเป็น

### 9.2 Telegram

Telegram bot token เดียวควรมี active poller เพียงชุดเดียว

Cutover ทั่วไป

```bash
# บนเครื่องเดิม
hermes -p <PROFILE_NAME> gateway stop
hermes -p <PROFILE_NAME> gateway status

# บนเครื่องใหม่
hermes -p <PROFILE_NAME> gateway run
```

ถ้าใช้ service

```bash
hermes -p <PROFILE_NAME> gateway install
hermes -p <PROFILE_NAME> gateway start
```

### 9.3 Discord

ขั้นตอนทั่วไป

1. สร้าง Discord Application/Bot หรือใช้ bot เดิมตามแผน
2. เปิด privileged intents ที่จำเป็น เช่น Server Members Intent และ Message Content Intent
3. Invite bot เข้า server ด้วย permissions ที่เหมาะสม
4. ตั้ง `DISCORD_BOT_TOKEN` ใน `.env`
5. ตั้ง `DISCORD_ALLOWED_USERS` หรือ roles
6. Start gateway
7. ใน channel ปลายทาง ใช้ `/sethome` ถ้าต้องการ home channel
8. ทดสอบ DM และ server mention

ตัวอย่างการทดสอบ

```text
@<BOT_NAME> hello
@<BOT_NAME> run a safe status check
```

### 9.4 Discord voice

ถ้าจะใช้ voice channel ต้องมี dependency เพิ่ม เช่น FFmpeg, Opus, PyNaCl/discord voice support และ STT/TTS provider

ตรวจเบื้องต้น

```bash
ffmpeg -version
python -c "import discord, nacl; print('discord voice deps ok')"
```

ทดสอบ text gateway ให้ผ่านก่อน แล้วค่อยทดสอบ voice

### 9.5 Slack/LINE/Matrix/Mattermost

หลักการเหมือนกัน

- สร้าง app/bot หรือ token ตาม platform
- ใส่ secret ใน `.env`
- ตั้ง allowlist
- ตั้ง home/default channel
- start gateway
- ส่งข้อความทดสอบ
- ตรวจ log ถ้าไม่ตอบ

---

## 10. Phase 9 — Cron Jobs Migration

### 10.1 Inventory cron บนเครื่องเดิม

```bash
hermes -p <PROFILE_NAME> cron list
```

### 10.2 ตัดสินใจ strategy

เลือกหนึ่งแบบ

```text
A. ไม่ย้าย cron
B. ย้ายแต่ pause ไว้
C. recreate ด้วยมือบนเครื่องใหม่
D. ย้ายและ enable หลัง verification
```

แนะนำ: ย้ายแบบ pause ไว้ก่อน แล้วค่อย enable หลัง gateway/provider/delivery verified

### 10.3 ห้าม cron ซ้ำ

ก่อน enable บนเครื่องใหม่ ให้ปิดหรือ pause บนเครื่องเดิม

```bash
hermes -p <PROFILE_NAME> cron list
hermes -p <PROFILE_NAME> cron pause <JOB_ID>
```

หลังย้าย

```bash
hermes -p <PROFILE_NAME> cron list
hermes -p <PROFILE_NAME> cron run <JOB_ID>
```

### 10.4 ตรวจ job-specific dependencies

สำหรับแต่ละ cron job ตรวจ

- script path ยังมีอยู่ไหม
- working directory ถูกต้องไหม
- env vars ครบไหม
- delivery target เปลี่ยนไหม
- job เขียนไฟล์ไปที่ path เดิมที่ไม่มีในเครื่องใหม่หรือไม่
- job ไปเรียก service ภายในเครื่องเดิมหรือไม่

---

## 11. Phase 10 — Verification

### 11.1 ตรวจ Hermes health

```bash
hermes doctor
hermes -p <PROFILE_NAME> config check
hermes -p <PROFILE_NAME> status
hermes profile list
```

### 11.2 ตรวจ provider

```bash
hermes -p <PROFILE_NAME> auth status <PROVIDER_NAME>
```

หรือทดสอบ chat สั้น ๆ

```bash
hermes -p <PROFILE_NAME> chat -q "Reply with OK and the active profile name."
```

### 11.3 ตรวจ gateway

```bash
hermes gateway list
hermes -p <PROFILE_NAME> gateway status
```

ถ้า gateway ไม่ตอบ ให้ดู log โดย redact secrets ก่อนแชร์

```bash
tail -n 200 <NEW_HERMES_HOME>/logs/gateway.log
```

### 11.4 ตรวจ messaging

สำหรับแต่ละ platform

- ส่งข้อความใน DM
- ส่งข้อความใน server/channel พร้อม mention ถ้าจำเป็น
- ทดสอบ allowed user
- ทดสอบ `/sethome` หรือ equivalent
- ตรวจว่า bot ไม่ตอบ user ที่ไม่ได้รับอนุญาต ถ้าตั้ง allowlist

### 11.5 ตรวจ project-specific commands

ถ้า profile ผูกกับ project ให้รันคำสั่งของ project นั้น เช่น

```bash
cd <PROJECT_DIR>
git status --short --branch
<PROJECT_TEST_COMMAND>
<PROJECT_BUILD_COMMAND>
```

### 11.6 ตรวจ cron

```bash
hermes -p <PROFILE_NAME> cron list
```

ถ้ามี job ที่ควรทำงาน ให้ run แบบ manual หนึ่งครั้งก่อน enable schedule จริง

```bash
hermes -p <PROFILE_NAME> cron run <JOB_ID>
```

### 11.7 ตรวจ reboot resilience

ถ้าต้องการให้ระบบอยู่รอดหลัง reboot ให้ติดตั้ง gateway เป็น service แล้วทดสอบ

```bash
hermes -p <PROFILE_NAME> gateway install
hermes -p <PROFILE_NAME> gateway start
hermes -p <PROFILE_NAME> gateway status
```

หลัง reboot

```bash
hermes gateway list
hermes -p <PROFILE_NAME> status
```

---

## 12. Phase 11 — Cutover Plan

### 12.1 Staging test

1. สร้าง profile บนเครื่องใหม่
2. copy persona/config/skills/project
3. ตั้ง secrets ใหม่
4. login OAuth ใหม่
5. ทดสอบ local chat
6. ทดสอบ project commands
7. ยังไม่เปิด production gateway/cron ถ้า token เดียวกับเครื่องเดิม

### 12.2 Production cutover

1. แจ้งช่วง cutover
2. backup เครื่องเดิม
3. pause cron เครื่องเดิม
4. stop gateway เครื่องเดิม
5. start gateway เครื่องใหม่
6. ตั้ง home channel/chat ใหม่ถ้าจำเป็น
7. ส่งข้อความทดสอบจาก user ที่อนุญาต
8. ตรวจ response และ log
9. enable cron เครื่องใหม่ทีละ job
10. เก็บเครื่องเดิมเป็น cold backup

### 12.3 Rollback

ถ้าเครื่องใหม่ fail

1. stop gateway เครื่องใหม่
2. pause cron เครื่องใหม่
3. start gateway เครื่องเดิม
4. unpause cron เครื่องเดิมเฉพาะ job ที่จำเป็น
5. บันทึก incident ว่า fail เพราะอะไร
6. อย่าปล่อยทั้งสองเครื่อง active ด้วย token/cron เดียวกัน

---

## 13. Phase 12 — Handoff หลังย้ายเสร็จ

สร้าง handoff document หลัง verification

### 13.1 Handoff Template

```markdown
# Hermes Profile Migration Handoff

## Summary

Profile `<PROFILE_NAME>` was migrated from `<OLD_HOST>` to `<NEW_HOST>`.

## Final Status

- Profile exists on new server: Yes/No
- Gateway running: Yes/No
- Messaging verified: Yes/No
- Provider verified: Yes/No
- Cron migrated: Yes/No/Not applicable
- Old gateway stopped: Yes/No/Not applicable
- Old cron paused: Yes/No/Not applicable

## Migrated Items

- [ ] SOUL.md
- [ ] config settings
- [ ] skills
- [ ] project repository
- [ ] project docs/runbooks
- [ ] selected cron jobs

## Recreated Items

- [ ] `.env` secrets
- [ ] OAuth login
- [ ] bot tokens
- [ ] home channel/chat
- [ ] service unit

## Not Migrated

- [ ] cache
- [ ] logs
- [ ] browser cookies
- [ ] unrelated profiles
- [ ] old active process state

## Verification Evidence

Paste safe command outputs only. Redact secrets and private IDs if the document will be shared.

```text
hermes profile list: ...
hermes gateway list: ...
hermes -p <PROFILE_NAME> status: ...
messaging test: ...
project tests: ...
```

## Remaining Work

- [ ] install service autostart
- [ ] harden dashboard access
- [ ] rotate old tokens
- [ ] remove old server after retention period
- [ ] document operator runbook

## Rollback Notes

Describe how to restore old server operation if needed.
```

---

## 14. Security and Privacy Checklist

ก่อนส่งเอกสารออกหรือ upload ไปยัง Drive/repo ให้ตรวจสิ่งเหล่านี้

### 14.1 ห้ามมีข้อมูลเหล่านี้

- API keys
- bot tokens
- OAuth access/refresh tokens
- passwords
- private keys
- session cookies
- signed URLs
- real personal chat IDs ถ้าเอกสารจะใช้สอนคนอื่น
- real server IP/hostname ถ้าโยงตัวตนหรือระบบจริงได้
- real project names ถ้าเป็น private
- customer/company identifiers
- emails/phone numbers
- absolute local paths ที่เปิดเผย user/organization ถ้าเอกสารจะเผยแพร่
- private Drive IDs หรือ internal repo URLs

### 14.2 Scan command ตัวอย่าง

```bash
grep -RInE "(api[_-]?key|token|secret|password|passwd|pwd|refresh_token|client_secret|private_key|BEGIN [A-Z ]*PRIVATE KEY|xox[baprs]-|gh[pousr]_|sk-[A-Za-z0-9])" \
  <DOCUMENT_OR_FOLDER> || true
```

### 14.3 ตรวจ placeholder

เอกสาร reusable ควรใช้ placeholder เช่น

```text
<PROFILE_NAME>
<OLD_HOST>
<NEW_HOST>
<PROJECT_DIR>
<BOT_TOKEN>
<ALLOWED_USER_ID>
<HOME_CHANNEL_ID>
```

ไม่ควรมีค่าจริง

### 14.4 ตรวจ metadata

ถ้าเป็นไฟล์รูป/PDF/Office ให้ล้าง metadata ถ้าจะแชร์ภายนอก

Markdown ปกติไม่มี EXIF แต่ยังอาจมีข้อมูลเฉพาะในเนื้อหาได้ จึงต้อง scan ข้อความด้วย

---

## 15. Troubleshooting

### 15.1 Bot ไม่ตอบหลังย้าย

ตรวจตามลำดับ

```bash
hermes gateway list
hermes -p <PROFILE_NAME> status
hermes -p <PROFILE_NAME> gateway status
tail -n 200 <NEW_HERMES_HOME>/logs/gateway.log
```

สาเหตุที่พบบ่อย

- gateway ไม่ได้รัน
- token ไม่ถูกต้อง
- allowed user ไม่ตรง
- bot ไม่มี permission ใน channel
- Discord ต้อง mention bot ใน server channel
- Telegram token มี poller อีกเครื่องใช้อยู่
- provider auth ไม่พร้อม
- rate limit ชั่วคราว

### 15.2 Provider authentication failed

ตรวจ

```bash
hermes -p <PROFILE_NAME> status
hermes -p <PROFILE_NAME> auth status <PROVIDER_NAME>
```

แก้โดย login ใหม่

```bash
hermes -p <PROFILE_NAME> auth add <PROVIDER_NAME>
```

### 15.3 Cron ไม่ทำงาน

ตรวจ

```bash
hermes -p <PROFILE_NAME> cron list
hermes -p <PROFILE_NAME> cron run <JOB_ID>
```

ดู

- job paused หรือไม่
- script path ถูกไหม
- env vars ครบไหม
- delivery target ใช้ได้ไหม
- old server ยัง run job เดียวกันอยู่ไหม

### 15.4 Dashboard เปิดผ่าน network ไม่ได้

หลักทั่วไป

- Dashboard ที่ bind non-loopback ควรมี auth
- ถ้าไม่มี auth ให้ใช้ SSH tunnel หรือ bind `127.0.0.1`
- อย่าเปิด unauthenticated dashboard บน public/VPN interface

### 15.5 Config พังหลังแก้ YAML

ถ้า `config.yaml` ผิด ให้ restore จาก backup หรือใช้ `hermes config set` แทนการแก้ด้วยมือ

```bash
hermes -p <PROFILE_NAME> config check
```

---

## 16. Reusable Prompt Template

ใช้ prompt นี้ในครั้งต่อไปเมื่อต้องให้ Agent ช่วยย้าย profile

```text
You are helping me migrate one Hermes Agent profile from <OLD_HOST> to <NEW_HOST>.

Goal:
- Migrate profile <PROFILE_NAME> safely to a Linux server.
- Do not expose or copy secrets blindly.
- Inventory first, plan second, execute third, verify before declaring done.

Rules:
1. Ask or create an intake worksheet before making changes.
2. Do not include real credentials, tokens, OAuth refresh tokens, cookies, or private keys in chat or documents.
3. Use placeholders in documentation.
4. Separate settings from secrets: config.yaml for settings, .env or a secret manager for secrets.
5. Prefer OAuth re-login on the new server instead of copying auth.json.
6. Do not start a messaging gateway on the new server while the old server is still polling with the same token, unless this is explicitly a staging bot/token.
7. Do not enable cron jobs on the new server until old jobs are paused or the duplication risk is accepted.
8. Verify profile status, provider auth, gateway connection, messaging response, cron status, and project tests.
9. Create a migration handoff after completion.
10. Before sharing any document, scan for credentials and environment-specific identifiers.

Interview me first using these sections:
- Migration goal
- Source and target hosts
- Profile and project scope
- Skills to migrate
- Cron strategy
- Messaging gateway strategy
- Secrets/OAuth handling
- Cutover and rollback plan
- Success criteria

After the interview, produce:
1. Hermes Profile Migration Plan
2. Step-by-step execution checklist
3. Final handoff template

Do not begin irreversible actions until I approve the cutover.
```

---

## 17. Quick Execution Checklist

ใช้เป็น checklist สั้น ๆ ตอนทำงานจริง

```text
[ ] Interview user / fill intake worksheet
[ ] Generate migration plan
[ ] User approves scope
[ ] Inventory old profile
[ ] Inventory skills
[ ] Inventory cron jobs
[ ] Inventory messaging gateway
[ ] Backup selected files
[ ] Scan backup for secrets
[ ] Prepare new server
[ ] Create new profile
[ ] Restore SOUL.md
[ ] Restore reviewed config settings
[ ] Restore selected skills
[ ] Clone/copy project files
[ ] Recreate .env secrets safely
[ ] Re-auth OAuth provider
[ ] Test local Hermes response
[ ] Stop/pause old gateway or use separate staging token
[ ] Start new gateway
[ ] Set home channel/chat if needed
[ ] Test messaging response
[ ] Migrate cron paused
[ ] Run cron manual tests
[ ] Enable cron only after duplication risk is cleared
[ ] Run project tests/build checks
[ ] Verify logs and status
[ ] Create final handoff
[ ] Keep old server as cold backup for retention period
```

---

## 18. Recommended Default Migration Pattern

ถ้าไม่มีเหตุผลพิเศษ ให้ใช้ pattern นี้

```text
Hybrid migration:
1. Interview first
2. Clone project repositories fresh on the new server
3. Copy SOUL.md and selected skills
4. Recreate config through hermes config set where possible
5. Recreate .env secrets manually or through a secure temporary form
6. Re-auth OAuth on the new server
7. Migrate cron paused
8. Stop old gateway before starting production gateway on the new server
9. Verify end-to-end
10. Keep old server as cold backup
```

เหตุผลที่แนะนำ

- ลดการ copy ขยะและ cache
- ลดโอกาส secret หลุด
- ลด path mismatch
- ลด duplicate poller/cron
- ทำ rollback ง่าย
- เหมาะกับ Linux server migration ส่วนใหญ่

---

## 19. Final Definition of Done

ถือว่างานย้ายสำเร็จเมื่อมีหลักฐานครบทุกข้อที่อยู่ใน scope

```text
[ ] New profile exists
[ ] Persona/config/skills restored or recreated
[ ] Provider auth works
[ ] Local chat works
[ ] Messaging gateway works
[ ] Bot responds from intended user/channel
[ ] Cron state matches migration plan
[ ] Project repo/tests/build pass if applicable
[ ] Old gateway/cron are stopped or intentionally left active with documented reason
[ ] No secrets leaked into docs/repo/chat
[ ] Handoff document completed
```

ถ้าข้อใดเป็น optional หรือ out of scope ให้ระบุชัดเจนใน handoff ไม่ควรสรุปว่า “100%” โดยไม่บอกขอบเขต
