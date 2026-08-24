---
title: คู่มือสำรองและกู้คืน Hermes Profile แบบตรวจสอบได้
type: guide
status: active
visibility: public
language: th
created: 2026-08-24
updated: 2026-08-24
version: 1.0
sources:
  - user-provided backup guideline, sanitized and reorganized
  - Hermes profile disaster-recovery workflow concepts
tags:
  - hermes-agent
  - profile-backup
  - disaster-recovery
  - restore
  - checksum
  - google-drive
  - notification
  - public-safe
---

# คู่มือสำรองและกู้คืน Hermes Profile แบบตรวจสอบได้

> คู่มือออกแบบระบบ Disaster Recovery สำหรับ Hermes Profiles ที่คนและ AI Agent สามารถนำไปปรับใช้บนเครื่องของตนเองได้ โดยใช้ Placeholder แทนข้อมูลเฉพาะระบบ และถือว่า Archive ของ Profile เป็นข้อมูลลับเสมอ

---

## 1. คู่มือนี้แก้ปัญหาอะไร

Hermes Profile อาจประกอบด้วย Config, Skills, OAuth state, Bot integration, Scheduled jobs, Session metadata และไฟล์ Environment ที่จำเป็นต่อการทำงานต่อเนื่อง หากเครื่องเสีย ถูกแทนที่ หรือ Profile เสียหาย การมีเพียง Source code หรือ Git repository อาจไม่เพียงพอสำหรับกู้ระบบกลับมา

ระบบที่ดีต้องตอบคำถามต่อไปนี้ได้

1. มี Profile อะไรอยู่บนเครื่อง
2. ไฟล์ Backup ล่าสุดสร้างเมื่อใด
3. Archive ครบและไม่เสียหายหรือไม่
4. ข้อมูลลับถูกจัดเก็บไว้ที่ใดและใครเข้าถึงได้
5. ไฟล์ถูกอัปโหลดไป Remote storage จริงหรือไม่
6. Restore ได้โดยไม่เปิด Gateway หรือ Scheduled jobs โดยไม่ได้ตั้งใจหรือไม่
7. ระบบแจ้งเตือนได้หรือไม่เมื่อ Backup ล้มเหลว

เป้าหมายไม่ใช่เพียง “สร้างไฟล์ `.tar.gz`” แต่คือสร้างชุดหลักฐานที่พิสูจน์ได้ว่า Backup ใช้งานได้และ Restore อย่างปลอดภัยได้

---

## 2. ผลลัพธ์ที่ต้องได้

ระบบประกอบด้วยงานหลัก 2 ชั้น

### 2.1 Profile DR Pack producer

ต่อ Hermes Profile หนึ่งรายการ ต้องสร้าง

- Archive `.tar.gz`
- Manifest `.json`
- Restore runbook / AI handoff `.md`
- Checksum `.sha256`
- ชุดไฟล์แบบลงวันที่ใน Remote storage
- ชุดไฟล์ชื่อคงที่สำหรับเวอร์ชันล่าสุด
- State file ที่บันทึกผลและ Remote file IDs

### 2.2 Backup status notifier

Notifier ต้องทำงานหลัง Producer และตรวจหลักฐานก่อนแจ้งสถานะ

- อ่าน State file ล่าสุด
- ยืนยันว่า Backup เป็นของวันปัจจุบันตาม Timezone ที่กำหนด
- ตรวจว่า Profile results ไม่ว่าง
- ตรวจ Local artifacts
- ตรวจ SHA256 ทุก Profile
- ตรวจ Remote upload records
- ตรวจสถานะ Scheduled job ถ้ามีข้อมูล
- ส่งข้อความสั้นไป Notification channel
- ถ้าส่งสำเร็จ ให้ stdout ว่างเพื่อป้องกันการส่งซ้ำ

### 2.3 เลือก Native backup primitive ให้ถูก

Hermes ปัจจุบันมี Backup สองระดับที่วัตถุประสงค์ต่างกัน

| ระดับ | คำสั่ง | ขอบเขต | Credentials |
|---|---|---|---|
| Full Hermes-home backup | `hermes backup` / `hermes import` | Config, Skills, Sessions, State และข้อมูลทั้ง Hermes home โดยไม่รวม Codebase | รวม Critical credentials/state ตามโหมด Full/Quick จึงเป็นข้อมูลลับสูง |
| Single-profile export | `hermes profile export <PROFILE>` / `hermes profile import <ARCHIVE>` | Snapshot ของ Profile เดียวสำหรับย้ายหรือกู้เป็น Profile ใหม่ | `.env` และ `auth.json` ถูกตัดออกโดยออกแบบ ต้อง Re-authorize ภายหลัง |

DR Pack ในคู่มือนี้เป็นชั้น Orchestration ที่เพิ่ม Manifest, Runbook, SHA256, Remote verification, State และ Notifier รอบ Native artifact ที่เลือก

- ถ้าต้องการกู้ทั้งเครื่องและ Credentials ใช้ `hermes backup` เป็นฐาน
- ถ้าต้องการกู้ Profile เดียวแบบแยกชื่อ ใช้ `hermes profile export` เป็นฐาน
- อย่าอ้างว่า Profile export เพียงไฟล์เดียวคือ Full credential backup

---

## 3. สถาปัตยกรรมระบบ

```text
Hermes profiles
      │
      ▼
Discovery + validation
      │
      ▼
Per-profile export / package
      │
      ├── archive.tar.gz         (confidential)
      ├── manifest.json          (redacted)
      ├── restore-runbook.md     (human + AI)
      └── checksum.sha256
      │
      ├──────────────► Local retention
      │
      ▼
Private remote storage
      ├── daily/YYYY-MM-DD/
      └── latest/
      │
      ▼
State file + upload IDs
      │
      ▼
Independent notifier
      └── success / failure summary
```

หลักสำคัญคือ Producer, State และ Notifier แยกหน้าที่กัน

- Producer สร้างและตรวจ Backup
- State เป็นหลักฐาน Machine-readable
- Notifier อ่านหลักฐาน ไม่เชื่อเพียง Exit code ของ Producer

---

## 4. Threat model และข้อมูลที่ต้องปกป้อง

Archive จาก Custom raw packaging หรือ Full Hermes-home backup อาจมีข้อมูลต่อไปนี้

- `.env`
- OAuth access/refresh token
- Bot token
- Provider API key
- Gateway configuration
- Session/connection metadata
- Private routing information
- Scheduled job definitions

ดังนั้นต้องถือ Archive เป็น **Confidential**

สำหรับ `hermes profile export` อย่างเป็นทางการ `.env` และ `auth.json` จะถูกตัดออก แต่ Archive ยังอาจมี Memories, Sessions, Persona และข้อมูลผู้ใช้ จึงยังต้องถือเป็นข้อมูลลับและตรวจเนื้อหาก่อนแบ่งปัน

### 4.1 ห้ามทำ

- ห้าม Hard-code Token, Password, OAuth secret, Chat ID หรือ Passphrase ใน Script
- ห้ามพิมพ์ Secret เต็มใน Log, Manifest หรือข้อความแจ้งเตือน
- ห้ามอัปโหลด Archive ไป Public folder
- ห้าม Share แบบ Anyone-with-link โดยไม่ได้รับอนุมัติ
- ห้ามถือว่า Local archive เพียงอย่างเดียวคือ Backup ที่สำเร็จ
- ห้าม Restore แล้ว Start Gateway หรือ Enable cron ทันที
- ห้ามให้ Server เดิมและ Server ใหม่ Poll Telegram Bot เดียวกันพร้อมกัน

### 4.2 หากยังไม่มี Encryption

- ใช้ Private folder ที่จำกัดสิทธิ์
- ระบุ `encrypted: false`
- ระบุ `confidential: true`
- แสดง Warning ในรายงานและ Notification
- วางแผนเพิ่ม `age` หรือ `gpg` ภายหลัง

---

## 5. Placeholder ที่ผู้ติดตั้งต้องกำหนด

```text
<HERMES_HOME>                 Hermes home ของเครื่องเป้าหมาย
<REMOTE_BACKUP_ROOT_ID>       Private remote folder สำหรับ DR packs
<NOTIFICATION_DESTINATION>    ปลายทางแจ้งเตือนที่ได้รับอนุญาต
<BACKUP_SCHEDULE>             เวลา Backup รายวัน
<NOTIFIER_SCHEDULE>           เวลา Notifier หลัง Backup
<TIMEZONE>                    Timezone ของเครื่อง
<LOCAL_RETENTION_DAYS>        จำนวนวันที่เก็บ Local staging
```

ตัวอย่างค่าทั่วไป

```text
<TIMEZONE> = Asia/Bangkok
<LOCAL_RETENTION_DAYS> = 30
<BACKUP_SCHEDULE> = 40 3 * * *
<NOTIFIER_SCHEDULE> = 50 3 * * *
```

ค่าตัวอย่างไม่ใช่ค่าบังคับ ต้องตรวจสภาพแวดล้อมจริงก่อนใช้

---

## 6. Discovery ก่อนสร้างระบบ

ห้ามเดา Profile, Path, Scheduler หรือ Credential location

### 6.1 ตรวจ Hermes

```bash
hermes --version
hermes profile list
hermes profile show default || true
hermes cron status || true
hermes cron list --all || true
hermes config path
```

### 6.2 ตรวจ Filesystem

```bash
printf '%s\n' "$HOME"
ls -la <HERMES_HOME>/profiles || true
ls -la <HERMES_HOME>/scripts || true
```

### 6.3 ตรวจ Google Workspace authentication

```bash
python <GOOGLE_WORKSPACE_SETUP_SCRIPT> --check || true
```

### 6.4 ตรวจเฉพาะชื่อ Environment keys

ห้ามพิมพ์ค่า

```python
from pathlib import Path

path = Path("<HERMES_ENV_FILE>")
for line in path.read_text(errors="ignore").splitlines() if path.exists() else []:
    if "=" not in line or line.lstrip().startswith("#"):
        continue
    key = line.split("=", 1)[0].strip()
    if any(term in key.upper() for term in ["TELEGRAM", "GOOGLE", "DRIVE", "ALERT"]):
        print(key)
```

---

## 7. Profile discovery ที่ทนต่อความคลาดเคลื่อน

ค้น Profile จากอย่างน้อย 2 แหล่ง

1. Output ของ `hermes profile list`
2. Directory `<HERMES_HOME>/profiles/*`

ขั้นตอน

1. Parse รายชื่อจาก CLI
2. Enumerate directory ที่เข้าเงื่อนไข
3. รวม `default` หากมีจริง
4. Dedupe
5. Sort เพื่อให้ผลลัพธ์ Deterministic
6. ตัด Directory ที่เป็น Cache, Temp หรือไม่ใช่ Profile
7. Verify Profile ด้วย CLI หรือโครงสร้างไฟล์ก่อน Backup

อย่าพึ่งแหล่งเดียว เพราะ CLI และ Filesystem อาจไม่ตรงกันหลัง Migration หรือการติดตั้งที่ไม่สมบูรณ์

---

## 8. โครงสร้างไฟล์ DR Pack

ต่อ Profile หนึ่งรายการ

```text
<PROFILE>-profile-<TIMESTAMP>.tar.gz
<PROFILE>-profile-<TIMESTAMP>.manifest.json
<PROFILE>-profile-<TIMESTAMP>.restore-runbook.md
<PROFILE>-profile-<TIMESTAMP>.sha256
```

Timestamp ควรมี Timezone

```text
YYYY-MM-DDTHHMMSS+ZZZZ
```

Local staging

```text
<HERMES_HOME>/profile-dr-backups/
  <TIMESTAMP>_profile-dr-pack/
    <PROFILE>/
      archive
      manifest
      restore runbook
      checksum
```

ไฟล์ของแต่ละ Run ต้องอยู่ใน Directory ใหม่ ไม่เขียนทับ Run ก่อนหน้า

---

## 9. Archive design

Archive ต้องสร้างจาก Profile ที่ตรวจพบจริง และต้องมี Boundary ชัดเจน

แนวทางที่แนะนำสำหรับ Profile เดียวคือใช้ Native export เป็น Artifact หลัก

```bash
hermes profile export <PROFILE> -o <ARCHIVE_FILE>
```

หากใช้ Custom raw archive ต้องระบุชัดว่าไม่ใช่ Native export, บันทึก Inclusion policy และพิสูจน์ว่า Restore tool รองรับ Format นั้น ห้ามนำไฟล์ `.tar.gz` ที่สร้างเองไปใช้กับ `hermes profile import` โดยไม่ทดสอบ Compatibility

### 9.1 คุณสมบัติที่ควรมี

- ชื่อไฟล์ Deterministic
- ไม่มี Path traversal
- ไม่ตาม Symlink ออกนอก Scope โดยไม่ตั้งใจ
- บันทึกรายการ Included/Excluded paths
- ตรวจว่า Archive เปิดอ่านได้หลังสร้าง
- บันทึก Size และ SHA256
- กำหนด Permission จำกัดก่อน Upload

### 9.2 สิ่งที่ต้องระวัง

- Absolute paths ที่ผูกกับเครื่องเดิม
- Cron workdir นอก Profile
- Script ที่เรียกไฟล์นอก Hermes home
- OAuth callback state ที่หมดอายุ
- Bot/Gateway token ที่อาจทำให้เกิด Duplicate poller
- Log ขนาดใหญ่หรือ Cache ที่ไม่จำเป็นต่อ Restore

---

## 10. Manifest ที่คนและ AI อ่านได้

Manifest ต้อง Redacted และ Machine-readable

```json
{
  "profile": "<PROFILE>",
  "backup_timestamp": "<ISO_TIMESTAMP>",
  "host": {
    "hostname": "<REDACTED_OR_PLACEHOLDER>",
    "platform": "<OS>",
    "home": "<HOME_PLACEHOLDER>",
    "hermes_home": "<HERMES_HOME>",
    "profile_home": "<PROFILE_HOME>"
  },
  "archive": {
    "filename": "<ARCHIVE_NAME>",
    "size_bytes": 0,
    "sha256": "<SHA256>",
    "encrypted": false,
    "confidential": true
  },
  "hermes": {
    "version": "<REDACTED_OUTPUT>",
    "profile_show": "<REDACTED_OUTPUT>",
    "config_check": "<REDACTED_OUTPUT>",
    "skills_list": "<REDACTED_OUTPUT>",
    "cron_list": "<REDACTED_OUTPUT>"
  },
  "credential_presence": {
    "google_oauth": "present_redacted|absent|must_verify",
    "telegram": "present_redacted|absent|must_verify",
    "task_system": "present_redacted|absent|must_verify",
    "line": "present_redacted|absent|must_verify",
    "google_chat": "present_redacted|absent|must_verify"
  },
  "restore_safety_flags": {
    "do_not_start_gateway_until_reviewed": true,
    "do_not_enable_cron_until_reviewed": true,
    "do_not_run_side_effect_jobs_without_approval": true,
    "do_not_run_duplicate_messaging_poller": true
  },
  "external_dependencies": {
    "needs_google_oauth": true,
    "needs_task_system_token": false,
    "needs_messaging_gateway": true,
    "needs_line": false,
    "needs_google_chat": false
  },
  "path_audit": {
    "cron_scripts": [],
    "workdirs": [],
    "absolute_paths_outside_profile": []
  }
}
```

### 10.1 Redaction rules

ถ้าชื่อ Field มีคำต่อไปนี้ ให้ Redact ค่า

```text
token
secret
password
passwd
api_key
client_secret
private_key
authorization
bearer
refresh_token
access_token
```

รูปแบบที่อนุญาต

```text
<REDACTED>
present_redacted
absent
must_verify
```

ห้าม Hash Secret แล้วเผยแพร่ใน Manifest สาธารณะ เพราะ Hash อาจกลายเป็น Identifier และไม่จำเป็นต่อการ Restore

---

## 11. Restore runbook ต่อ Profile

Restore runbook ต้องใช้ได้ทั้งโดยคนและ AI Agent

ต้องมี

1. รายชื่อไฟล์ทั้งหมด
2. คำสั่งตรวจ Checksum
3. วิธี Import เป็น Test profile
4. Verification commands
5. Integration checks ที่ต้องทำ
6. Safety warnings
7. Approval points
8. Rollback/abort conditions

### 11.1 ตรวจ Checksum

```bash
sha256sum -c <PROFILE>-profile-<TIMESTAMP>.sha256
```

### 11.2 Import เป็น Test profile

```bash
hermes profile import <PROFILE>-profile-<TIMESTAMP>.tar.gz --name migrated-test
```

### 11.3 ตรวจหลัง Import

```bash
hermes profile list
hermes profile show migrated-test
hermes -p migrated-test config check
hermes -p migrated-test doctor
hermes -p migrated-test skills list
hermes -p migrated-test cron list --all
```

คำสั่งจริงอาจต่างตาม Hermes version ต้องตรวจ `--help` ของระบบเป้าหมายก่อน Run

### 11.4 ห้ามเปิดใช้งานทันที

หลัง Import ต้องยังไม่

- Start Gateway
- Enable Scheduled jobs
- Run job ที่ส่งข้อความ/อีเมล
- Run job ที่แก้ External system
- ใช้ Bot token เดียวกับ Server เดิมพร้อมกัน

---

## 12. Checksum design

Checksum file ต้องครอบคลุมอย่างน้อย

```text
archive.tar.gz
manifest.json
restore-runbook.md
```

ตัวอย่าง

```bash
cd <LOCAL_PROFILE_BACKUP_DIR>
sha256sum \
  <ARCHIVE_FILE> \
  <MANIFEST_FILE> \
  <RUNBOOK_FILE> \
  > <CHECKSUM_FILE>
sha256sum -c <CHECKSUM_FILE>
```

ห้าม Upload ก่อน Checksum ผ่าน

หลัง Download เพื่อ Restore ควรตรวจ Checksum ซ้ำก่อน Import

---

## 13. Remote storage layout

ใช้ Private root ที่แยกจากเอกสารทั่วไป

```text
Hermes profile backup/
  <PROFILE>/
    daily/
      YYYY-MM-DD/
        archive.tar.gz
        manifest.json
        restore-runbook.md
        checksum.sha256
    latest/
      <PROFILE>-profile-latest.tar.gz
      <PROFILE>-profile-latest.manifest.json
      <PROFILE>-profile-latest.restore-runbook.md
      <PROFILE>-profile-latest.sha256
```

### 13.1 Daily

- Immutable ตามวันที่
- ใช้สำหรับ Audit และย้อนกลับหลาย Version
- ไม่เขียนทับไฟล์เดิม

### 13.2 Latest

- Stable filename
- ใช้ค้นหา Restore set ล่าสุดได้ง่าย
- Update ไฟล์เดิมถ้า API รองรับ
- ถ้า API ไม่รองรับ ให้ Copy/Upload ใหม่ ตรวจสอบ แล้วค่อย Trash ไฟล์เก่า

### 13.3 Upload verification

ตรวจทุกไฟล์ด้วย

- Exact filename
- Exact parent folder
- Remote file ID
- MIME type
- `trashed=false`
- Size ถ้าระบบรองรับ

ห้ามยืนยันจากชื่อคล้ายกันทั่ว Drive

---

## 14. State file

State file เป็น Source of truth ของ Run ล่าสุด

```json
{
  "remote_root_folder_id": "<REMOTE_BACKUP_ROOT_ID>",
  "last_success_at": "<ISO_TIMESTAMP>",
  "last_profiles": ["default"],
  "last_run_root": "<LOCAL_RUN_ROOT>",
  "local_retention_days": 30,
  "last_results": [
    {
      "profile": "default",
      "local_dir": "<LOCAL_PROFILE_BACKUP_DIR>",
      "archive": "<ARCHIVE_PATH>",
      "manifest": "<MANIFEST_PATH>",
      "runbook": "<RUNBOOK_PATH>",
      "checksum": "<CHECKSUM_PATH>",
      "remote_profile_folder_id": "<REMOTE_FOLDER_ID>",
      "remote_daily_folder_id": "<REMOTE_FOLDER_ID>",
      "remote_latest_folder_id": "<REMOTE_FOLDER_ID>",
      "uploads": [
        {
          "name": "<FILENAME>",
          "local_path": "<LOCAL_PATH>",
          "remote_id": "<REMOTE_FILE_ID>",
          "parent_id": "<REMOTE_PARENT_ID>",
          "web_view_link": "<REMOTE_LINK>"
        }
      ]
    }
  ],
  "removed_local": []
}
```

State file ต้องเขียนแบบ Atomic เช่นเขียน Temporary file แล้ว Rename เพื่อป้องกัน JSON เสียหาก Process ถูกหยุดกลางทาง

---

## 15. Local retention

เก็บ Staging ตามจำนวนวันที่กำหนด

กฎการลบ

- ลบเฉพาะ Directory ใต้ `<HERMES_HOME>/profile-dr-backups/`
- ตรวจ Prefix/Resolved path ก่อนลบ
- ห้าม Follow symlink ออกนอก Root
- ห้ามลบ Run ล่าสุด
- บันทึกรายการที่ลบใน `removed_local`
- Dry-run retention ก่อนเปิดใช้งานจริง

---

## 16. Backup script validation

ลำดับบังคับ

```bash
python3 -m py_compile <HERMES_HOME>/scripts/backup_profile_dr_pack.py
python3 <HERMES_HOME>/scripts/backup_profile_dr_pack.py --dry-run
python3 <HERMES_HOME>/scripts/backup_profile_dr_pack.py
```

หลัง Manual run ตรวจ State

```python
import json
from pathlib import Path

state = json.loads(Path("<STATE_FILE>").read_text())
print(state["last_success_at"])
print(state["last_profiles"])
for result in state["last_results"]:
    print(result["profile"], len(result.get("uploads", [])), result["archive"])
```

ตรวจ Checksum ทุก Profile

```bash
cd <LOCAL_PROFILE_BACKUP_DIR>
sha256sum -c <CHECKSUM_FILE>
```

Manual run ต้องผ่านก่อนสร้าง Scheduled job

---

## 17. Scheduled backup job

ตัวอย่าง Configuration

```text
Name: Hermes Profile DR Pack
Schedule: <BACKUP_SCHEDULE>
Mode: script-only / no-agent
Script: backup_profile_dr_pack.py
Delivery: local
```

เหตุผลที่ Delivery เป็น Local

- Producer อาจพิมพ์ JSON/Log ยาว
- ไม่ต้องการส่งรายละเอียด Confidential
- Notifier แยกเป็นผู้ส่ง Summary สั้น

หลังสร้าง Job

```bash
hermes cron list --all
hermes cron run <BACKUP_JOB_ID>
hermes cron list --all
```

ต้องตรวจ `last_status: ok` และหลักฐานใน State ไม่ใช่ตรวจ Status อย่างเดียว

---

## 18. Independent notifier

Notifier ต้องตรวจอย่างน้อย

1. State file อ่านได้
2. `last_success_at` เป็นวันปัจจุบันใน `<TIMEZONE>`
3. มี `last_results` อย่างน้อย 1 Profile
4. Artifacts ล่าสุดยังอยู่
5. SHA256 ผ่าน
6. Upload records ครบตาม Layout
7. Remote IDs/Parents ถูกบันทึก
8. Producer job Enabled และ Last status ปกติถ้าตรวจได้

### 18.1 Success message

```text
✅ Hermes Profile Backup
สถานะ: สำเร็จ
เวลาแจ้ง: <TIMESTAMP>
Backup ล่าสุด: <TIMESTAMP>
Profiles: <COUNT>
Remote uploads: <COUNT>
Checksum: ผ่าน
หมายเหตุ: Archive เป็นข้อมูลลับและยังไม่เข้ารหัส
```

### 18.2 Failure message

```text
🚨 Hermes Profile Backup
สถานะ: ไม่สำเร็จ
เวลาแจ้ง: <TIMESTAMP>
Backup ล่าสุด: <TIMESTAMP_OR_UNKNOWN>
Profiles: <COUNT>
สาเหตุ: <SHORT_REASON>
ตรวจ Log: <LOG_PATH_PLACEHOLDER>
```

### 18.3 Output contract

เมื่อส่ง Notification สำเร็จ

```text
exit code = 0
stdout = empty
stderr = empty
log contains sent=true and message identifier
```

ถ้าส่งไม่สำเร็จ ต้องคืน Non-zero หรือเขียน Error ที่ Scheduler เก็บหลักฐานได้ โดยไม่เปิดเผย Secret

---

## 19. Notifier validation

```bash
python3 -m py_compile <HERMES_HOME>/scripts/profile_backup_notifier.py
python3 <HERMES_HOME>/scripts/profile_backup_notifier.py --dry-run
```

หลัง Dry-run ถูกต้อง ให้ส่งทดสอบจริงหนึ่งครั้งโดยได้รับอนุมัติ

```bash
python3 <HERMES_HOME>/scripts/profile_backup_notifier.py \
  > /tmp/profile_backup_notifier_stdout.txt \
  2> /tmp/profile_backup_notifier_stderr.txt

printf 'stdout_bytes='; wc -c < /tmp/profile_backup_notifier_stdout.txt
printf 'stderr_bytes='; wc -c < /tmp/profile_backup_notifier_stderr.txt
```

อย่า Log Token หรือ Full API URL

---

## 20. Scheduled notifier job

```text
Name: Hermes Profile Backup notifier
Schedule: <NOTIFIER_SCHEDULE>
Mode: script-only / no-agent
Script: profile_backup_notifier.py
Delivery: local
```

ตั้งเวลาให้หลัง Producer เพียงพอ เช่น 10 นาที แต่ต้องอิงระยะเวลาจริงของ Backup

หลังสร้าง

```bash
hermes cron list --all
```

ตรวจว่า Job active และ Next run ถูกต้อง

---

## 21. Restore drill ที่ปลอดภัย

ควรทำ Restore drill เป็นระยะ โดยใช้ Test profile เท่านั้น

### 21.1 ขั้นตอน

1. ดาวน์โหลด DR pack จาก Private storage
2. ตรวจ Exact filenames และ Parent
3. ตรวจ SHA256
4. อ่าน Manifest และ Safety flags
5. Import เป็นชื่อใหม่
6. ตรวจ Config/Skills/Cron
7. ตรวจ Absolute paths
8. ตรวจ OAuth/Integrations แบบ Read-only ก่อน
9. ห้าม Start Gateway
10. ห้าม Enable jobs
11. บันทึกผล Drill
12. ลบ Test profile เมื่อได้รับอนุมัติและไม่ต้องใช้งานแล้ว

### 21.2 Stop conditions

หยุดทันทีเมื่อ

- Checksum ไม่ผ่าน
- Archive แตกไม่ได้
- Manifest ไม่ตรงกับ Archive
- พบ Secret ใน Log/Runbook
- พบ Absolute paths ที่ยังชี้เครื่องเดิมและมี Side effect
- พบ Bot/Gateway ที่อาจทำงานซ้ำ
- Version incompatibility ยังไม่ถูกประเมิน

---

## 22. Troubleshooting

### Backup สร้าง Archive ได้แต่ Upload ไม่ครบ

**ตรวจ**

- OAuth status
- Remote folder permissions
- Exact parent IDs
- File size/API limits
- Upload records ใน State

**แก้**

- Retry เฉพาะไฟล์ที่ขาดโดยใช้ Idempotency
- ห้ามประกาศ Success จน Verify Remote ครบ

### Checksum ไม่ผ่าน

**ตรวจ**

- ไฟล์ถูกแก้หลังสร้าง Checksum หรือไม่
- Download ถูกตัดกลางทางหรือไม่
- Working directory ตรงหรือไม่

**แก้**

- Reject ชุดนั้น
- สร้าง Run ใหม่
- อย่าแก้ Checksum ให้ตรงกับไฟล์ที่สงสัย

### Notifier บอกว่า Backup เก่า

**ตรวจ**

- Timezone
- `last_success_at`
- Producer schedule
- State file เขียนสำเร็จหรือไม่

### Restore แล้ว Path ผิด

**ตรวจ**

- `path_audit.absolute_paths_outside_profile`
- Cron workdir
- Script paths
- User home ของเครื่องใหม่

**แก้**

- แก้ใน Test profile
- Verify ก่อน Promote

### Telegram หรือ Messaging bot ชนกัน

**อาการ**

- Polling conflict
- Duplicate messages
- Unauthorized/Conflict error

**แก้**

- หยุด Gateway ฝั่งหนึ่ง
- ยืนยัน Owner ของ Bot token
- ทดสอบ Foreground ก่อนติดตั้ง Service

---

## 23. Acceptance checklist

### Producer

- [ ] Profile discovery จาก CLI และ Filesystem
- [ ] Dedupe/Sort Profiles
- [ ] Archive ครบทุก Profile
- [ ] Manifest Redacted
- [ ] Restore runbook ครบ
- [ ] SHA256 ผ่าน
- [ ] Remote daily/latest ครบ
- [ ] State มี IDs และ Last success
- [ ] Retention จำกัด Root

### Notifier

- [ ] ตรวจ Backup age
- [ ] ตรวจ Local artifacts
- [ ] ตรวจ Checksum
- [ ] ตรวจ Upload count/IDs
- [ ] Dry-run ผ่าน
- [ ] Test notification ผ่าน
- [ ] Success stdout ว่าง
- [ ] Log ไม่มี Secret

### Restore

- [ ] Download จาก Private storage
- [ ] SHA256 ผ่าน
- [ ] Import เป็น Test profile
- [ ] Gateway ยังไม่ Start
- [ ] Cron ยังไม่ Enable
- [ ] Integrations ตรวจแบบ Read-only
- [ ] Absolute paths ได้รับการ Review
- [ ] Rollback/Abort plan ชัดเจน

---

## 24. Hardening roadmap

1. Encrypt Archive ด้วย `age` หรือ `gpg`
2. เก็บ Key ใน Secret manager
3. เพิ่ม Remote retention policy
4. ทำ Restore drill รายเดือน
5. Alert ถ้า Archive ยังไม่เข้ารหัส
6. เพิ่ม Dashboard สำหรับ Backup age, Last success, Profile count และ Upload count
7. เพิ่ม Off-site storage อีก Provider สำหรับเหตุการณ์ที่ Provider หลักใช้ไม่ได้
8. เพิ่ม Immutable/WORM policy หากเหมาะกับ Risk model
9. เพิ่ม Recovery Time Objective (RTO) และ Recovery Point Objective (RPO)
10. ทดสอบการกู้คืนเมื่อ Hermes version ต่างกัน

---

## 25. Quick command reference

```bash
# Full Hermes-home backup / restore
hermes backup -o <FULL_BACKUP_ZIP>
hermes import <FULL_BACKUP_ZIP>

# Single-profile export / import (credentials excluded)
hermes profile export <PROFILE> -o <PROFILE_ARCHIVE>
hermes profile import <PROFILE_ARCHIVE> --name migrated-test

# Manual backup
python3 <HERMES_HOME>/scripts/backup_profile_dr_pack.py

# Verify checksum
cd <LOCAL_PROFILE_BACKUP_DIR>
sha256sum -c <CHECKSUM_FILE>

# Import as test profile
hermes profile import <ARCHIVE_FILE> --name migrated-test

# Verify test profile
hermes profile show migrated-test
hermes -p migrated-test config check
hermes -p migrated-test doctor
hermes -p migrated-test skills list
hermes -p migrated-test cron list --all

# Dry-run notifier
python3 <HERMES_HOME>/scripts/profile_backup_notifier.py --dry-run

# Inspect scheduler
hermes cron list --all
```

---

## 26. AI implementation brief

ให้ AI ที่นำคู่มือนี้ไปใช้ทำตามลำดับ

1. อ่านคู่มือทั้งหมด
2. Discover ค่าจริงโดยไม่เปิดเผย Secret
3. แสดง Plan และ Placeholder mapping ให้มนุษย์ตรวจ
4. สร้าง Tests ก่อน Script จริง
5. สร้าง Producer แบบ Dry-run ได้
6. รัน Syntax/Test/Dry-run
7. ขออนุมัติก่อน Manual side effects
8. รัน Manual backup
9. Verify Local + SHA256 + Remote
10. สร้าง Notifier และ Dry-run
11. ขออนุมัติก่อนส่งข้อความจริง
12. ทดสอบ Notification
13. สร้าง Scheduled jobs หลัง Manual verification
14. Run ผ่าน Scheduler หนึ่งครั้ง
15. รายงานหลักฐานจริงและข้อจำกัด

AI ห้าม Claim success ถ้ายังไม่ได้ Read-back Artifact, Checksum, Remote state และ Scheduler state

---

## 27. Definition of Done

ระบบถือว่าเสร็จเมื่อ

- Backup ครบทุก Profile ที่ตรวจพบ
- Artifacts ครบ 4 ชนิดต่อ Profile
- Checksum ผ่าน
- Remote daily/latest ผ่าน Exact-name/Parent verification
- State file ครบและอ่านได้
- Producer schedule Run ผ่าน
- Notifier ตรวจหลักฐานจริง
- Notification test สำเร็จ
- Success stdout ว่าง
- Restore runbook ใช้ Import Test profile ได้
- Safety flags ป้องกัน Gateway/Cron/Side effects
- ข้อจำกัด Encryption ถูกระบุ

หากข้อใดไม่ผ่าน ต้องรายงานว่า “ยังไม่เสร็จ” พร้อมหลักฐานและขั้นตอนแก้ไข

---

## 28. แหล่งอ้างอิงคำสั่ง Hermes

- Profile commands: https://hermes-agent.nousresearch.com/docs/reference/profile-commands
- CLI backup/import: https://hermes-agent.nousresearch.com/docs/reference/cli-commands
- Profiles: https://hermes-agent.nousresearch.com/docs/user-guide/profiles
- Scheduled tasks: https://hermes-agent.nousresearch.com/docs/user-guide/features/cron

คู่มือนี้ตรวจคำสั่งกับ Hermes Agent CLI `v0.20.4 (2026.8.18)` เมื่อจัดทำ ผู้ใช้ต้องตรวจ `--help` และ Documentation เวอร์ชันปัจจุบันก่อนนำไปใช้จริง
