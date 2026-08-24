---
title: เข้าใจ Hermes Agent สำหรับคนทั่วไป
type: guide
status: active
visibility: public
language: th
created: 2026-08-25
updated: 2026-08-25
version: 1.0
sources:
  - https://www.youtube.com/watch?v=lGtBPrSrnjY
  - https://hermes-agent.nousresearch.com/docs
tags: [hermes-agent, ai-fundamentals, agent-harness, public-guide]
---

# เข้าใจ Hermes Agent สำหรับคนทั่วไป

> คู่มืออธิบาย 15 แนวคิดหลัก ตั้งแต่ Model, Context และ Tools ไปจนถึง Profiles, Cron, Kanban และระบบความปลอดภัย

## วิธีใช้คู่มือนี้

หนังสือเล่มนี้เหมาะกับผู้ที่เพิ่งเริ่มใช้ AI Agent และต้องการเห็นว่าองค์ประกอบต่าง ๆ เชื่อมกันอย่างไร ไม่จำเป็นต้องมีพื้นฐานเขียนโปรแกรม

แนวทางการอ่านมี 3 แบบ

1. **อ่านตามลำดับ** เพื่อสร้างภาพรวมตั้งแต่รับคำขอจนงานเสร็จ
2. **เปิดเฉพาะคู่คำที่สับสน** เช่น Memory กับ Skills หรือ Subagents กับ Kanban
3. **ใช้แผนติดตามคำขอท้ายเล่ม** เพื่อตรวจว่างานหนึ่งผ่านระบบใดและเก็บผลไว้ที่ไหน

คำสั่งและความสามารถของ Hermes เปลี่ยนได้ตามเวอร์ชัน ให้ตรวจ `--help` และเอกสารทางการก่อนใช้คำสั่งที่มีผลต่อระบบจริง

---

## ภาพรวมในหนึ่งนาที

Hermes Agent ไม่ใช่ Model และไม่ใช่แค่หน้าต่างแชต แต่เป็น **Agent harness** หรือระบบควบคุมงานที่ประกอบด้วย

- Interface สำหรับรับคำขอ
- Instructions และ Context สำหรับบอกกรอบงาน
- Model สำหรับให้เหตุผลและตัดสินใจ
- Tools สำหรับลงมือทำภายนอก Model
- Session, Memory และ Skills สำหรับความต่อเนื่อง
- Profiles สำหรับแยกบทบาทและ State
- Hooks, Cron และ Kanban สำหรับงานอัตโนมัติและงานระยะยาว
- Permissions, Approvals และ Sandbox สำหรับจำกัดความเสียหาย

เส้นทางพื้นฐานของหนึ่งคำขอคือ

```text
ผู้ใช้ / ระบบภายนอก
        ↓
Interface หรือ Messaging Gateway
        ↓
Profile + Instructions + Context
        ↓
Model คิดและเลือกการกระทำ
        ↓
Tools / MCP / Files / Browser / APIs
        ↓
ตรวจผลและวนซ้ำเมื่อจำเป็น
        ↓
คำตอบ + Artifact + State ที่บันทึกไว้
```

หัวใจสำคัญคือ **Model ให้เหตุผล แต่ Harness จัดบริบท เครื่องมือ กฎ และวงจรการทำงาน**

---

## 1. Hermes กับ Model ต่างกันอย่างไร

### คำอธิบายแบบง่าย

ให้นึกถึงรถยนต์

- **Model คือเครื่องยนต์** — สร้างพลังในการคิด ภาษา และการตัดสินใจ
- **Hermes คือรถทั้งคัน** — มีโครงรถ พวงมาลัย เบรก เซนเซอร์ กฎ ผู้ขับ และเส้นทาง

มีเครื่องยนต์ที่ดีไม่ได้แปลว่ารถจะปลอดภัยหรือไปถึงปลายทาง หากไม่มีเบรก เครื่องมือ หรือกฎควบคุม

### Hermes จัดการอะไรบ้าง

- รวบรวม System instructions, SOUL และ Project instructions
- เลือก Context ที่เกี่ยวข้อง
- ส่ง Prompt ไปยัง Model/Provider
- เปิด Tool schemas ให้ Model เลือกใช้
- ดำเนิน Tool calls และส่งผลกลับให้ Model
- จัด Session, Compression และ Handoff
- บังคับ Approval, Hook และ Sandbox policy
- ส่งผลกลับ Interface ที่เริ่มงาน

### เปลี่ยน Model ได้โดยไม่สร้าง Harness ใหม่หรือไม่

โดยหลักทำได้ เพราะ Model และ Harness เป็นคนละชั้น แต่ต้องตรวจ

- Provider รองรับ Model นั้นหรือไม่
- Context window และ Tool calling ต่างกันหรือไม่
- ค่าใช้จ่ายและ Rate limit
- ความสามารถด้านภาษา ภาพ เสียง หรือ Reasoning
- Policy และการเก็บข้อมูลของ Provider

**ข้อควรจำ:** เปลี่ยน Model อาจเปลี่ยนพฤติกรรม แม้ Instructions และ Tools เหมือนเดิม จึงต้องทดสอบ Workflow สำคัญใหม่

---

## 2. Model กับ Provider

### Model คืออะไร

Model คือระบบ AI ที่รับ Context แล้วสร้างคำตอบหรือการตัดสินใจ เช่น จะตอบข้อความ เรียก Tool หรือขอข้อมูลเพิ่ม

### Provider คืออะไร

Provider คือช่องทางที่ Hermes ใช้เข้าถึง Model อาจเป็น

- Subscription-based provider
- API provider
- Model router
- Local/OpenAI-compatible endpoint
- Nous Portal หรือบริการ Tool/Model gateway ที่รองรับ

Model ชื่อเดียวกันอาจเข้าถึงได้ผ่าน Provider ต่างกัน และมี Authentication, ราคา, Rate limit หรือ Policy ต่างกัน

### เลือก Model อย่างไร

พิจารณา 5 เรื่อง

1. **คุณภาพงาน** — Reasoning, Coding, Writing, Vision
2. **ความเร็ว** — งาน Interactive ต้องตอบเร็วแค่ไหน
3. **Context** — งานต้องอ่านข้อมูลมากเพียงใด
4. **Tool reliability** — เรียก Tool ตาม Schema ได้แม่นหรือไม่
5. **ต้นทุนและ Quota** — คิดตาม Token, Request หรือ Subscription

### อย่ายึดตัวเลข Context จากวิดีโอหรือบทความเก่า

ขนาด Context และชื่อ Model เปลี่ยนตาม Provider/Version ให้ตรวจจากหน้าตั้งค่าปัจจุบันหรือ Documentation ของ Provider ไม่ควร Hard-code ตัวเลขจากตัวอย่างในคู่มือ

### คำสั่งสำรวจ

```bash
hermes model
hermes setup
hermes config show
```

ใช้คำสั่งแบบ Read-only ก่อนเปลี่ยน Provider หรือ Credentials

---

## 3. Interfaces: เราคุยกับ Hermes ทางไหน

Interface คือจุดที่คำขอเข้าระบบและคำตอบออกจากระบบ

ตัวอย่าง

- Terminal / CLI
- Desktop application
- Web dashboard
- Telegram, Discord, Slack, WhatsApp หรือ Platform gateway ที่เปิดใช้
- ACP, TUI Gateway JSON-RPC และ OpenAI-compatible HTTP API
- Python integration เมื่อ Application import `AIAgent` โดยตรง
- Voice interface เมื่อ Runtime และ Provider รองรับ

### Interface ไม่ใช่ Agent คนละตัวเสมอไป

Telegram และ Terminal อาจส่งงานเข้า Profile เดียวกัน แต่มี

- Session key ต่างกัน
- Permission/Allowlist ต่างกัน
- Delivery format ต่างกัน
- ข้อจำกัดไฟล์และข้อความต่างกัน

### คำถามที่ต้องตอบก่อนเปิด Interface ใหม่

- ใครส่งข้อความเข้ามาได้
- ใช้ Profile ใด
- Group/Channel เปิดหรือปิด
- ไฟล์แนบเก็บที่ไหน
- ข้อมูลลับอาจปรากฏใน Notification หรือไม่
- Bot token มี Poller มากกว่าหนึ่งตัวหรือไม่

### หลักปฏิบัติ

เปิดเฉพาะ Interface ที่จำเป็น ใช้ Allowlist และแยก Profile เมื่อบทบาทหรือข้อมูลต่างกันอย่างมีนัยสำคัญ

---

## 4. Prompt, SOUL.md และ Project instructions

สามชั้นนี้ตอบคนละคำถาม

| ชั้น | ตอบคำถาม | ตัวอย่าง |
|---|---|---|
| Prompt | รอบนี้ต้องทำอะไร | “ตรวจ Link แล้วสร้างรายงาน” |
| SOUL.md | Agent ควรเป็นใครและทำงานแบบไหน | บทบาท น้ำเสียง หลักตัดสินใจ |
| Project instructions | ใน Project นี้ต้องทำตามกฎอะไร | Tests, Source of truth, Approval policy |

### Prompt

เป็นคำขอปัจจุบัน ควรมี

- เป้าหมาย
- Input/Source
- Output ที่ต้องการ
- Constraint
- Acceptance criteria

### SOUL.md

กำหนด Identity และ Working style ระดับ Profile เช่น

- บทบาท
- วิธีสื่อสาร
- หลักความปลอดภัย
- วิธีตัดสินใจเมื่อข้อมูลไม่ครบ

ไม่ควรใช้ SOUL.md เป็นที่เก็บรายละเอียด Project จำนวนมาก

### Project instructions

มักอยู่ในไฟล์อย่าง `AGENTS.md`, `PROJECT.md`, `CLAUDE.md` หรือกฎเฉพาะ Workspace ตาม Runtime ที่รองรับ

Hermes มีลำดับค้น Context files ที่รองรับ เช่น `.hermes.md`/`HERMES.md`, `AGENTS.override.md`, `AGENTS.md`, `CLAUDE.md` และ Cursor rules ตามตำแหน่ง Workspace ไฟล์ที่ตั้งชื่อเองอย่าง `context.md`, `voice.md` หรือ `corrections.md` จะไม่ถูกโหลดอัตโนมัติเพียงเพราะมีอยู่ ต้องถูกอ้างถึงจาก Instructions หรือให้ Agent เปิดอ่านอย่างชัดเจน

เหมาะกับ

- โครงสร้าง Repository
- Test commands
- Source-of-truth files
- Coding conventions
- Deploy/Publish gates

### จะบันทึกคำแก้ไว้ชั้นไหน

- ผิดเฉพาะงานนี้ → แก้ Prompt
- ผิดทุกงานของ Profile → แก้ SOUL/Skill/Policy
- ผิดเฉพาะ Project → แก้ Project instructions หรือ Runbook
- เป็นวิธีทำซ้ำ → สร้างหรือปรับ Skill

---

## 5. Context, Session และ Compression

### Context คืออะไร

Context คือข้อมูลที่ Model เห็นในรอบการคิด เช่น

- System/developer instructions
- Prompt
- ประวัติ Session
- Memory snapshot
- Skill ที่โหลด
- เนื้อหาไฟล์หรือ Web ที่อ่าน
- Tool schemas และ Tool results

Model ไม่ได้เห็นทุกไฟล์ในเครื่องโดยอัตโนมัติ Hermes ต้องโหลดหรือส่งข้อมูลนั้นเข้า Context

### Session คืออะไร

Session คือบทสนทนาและ State ของงานต่อเนื่องหนึ่งสาย แต่ละ Interface/Profile อาจมี Session แยกกัน

Session ช่วยให้

- อ้างถึงสิ่งที่คุยก่อนหน้า
- ต่อ Tool workflow
- รักษาเป้าหมายและการตัดสินใจ

### Context window มีขีดจำกัด

เมื่อ Context ใหญ่ขึ้น ระบบอาจ

- ตัดข้อมูลบางส่วน
- สรุป/Compress บทสนทนา
- เปิด Session ใหม่พร้อม Handoff
- โหลดข้อมูลกลับเมื่อจำเป็น

### Compression ไม่ใช่ความจำสมบูรณ์

Compression คือการสรุปเพื่อลดขนาด จึงอาจเสียรายละเอียด เช่น

- เหตุผลย่อย
- ค่าที่ไม่ถูกเลือก
- ลำดับ Tool calls
- Caveat ที่ไม่ได้ถูกสรุป

ใน Hermes v0.20.4 การบีบอัดแบบ Built-in ใช้ `compression.in_place: true` เป็นค่าเริ่มต้น จึงมักย่อ Active message list ภายใต้ Session ID เดิม ไม่ได้สร้าง Session ใหม่เสมอ ประวัติ Session ถูกเก็บใน `state.db` และสามารถค้นคืนได้ แต่ข้อมูลที่ Model เห็นหลังบีบอัดยังเป็น Summary ที่ Lossy

สำหรับงานยาวควรมี Durable project documents, Decision log และ `SESSION_HANDOFF.md` แทนการฝากทุกอย่างไว้ใน Chat

### สัญญาณว่าควร Handoff

- เริ่มจำข้อกำหนดผิด
- ต้องย้อนหา Tool result เก่าบ่อย
- Project มีหลาย Phase
- Context usage สูง
- กำลังจะเปลี่ยน Agent/Model/Session

---

## 6. Agent loop

Agent loop คือวงจรที่ทำให้งานมากกว่าการตอบครั้งเดียว

```text
รับเป้าหมาย
  ↓
คิดว่าต้องรู้อะไร
  ↓
อ่าน/ค้น/เรียก Tool
  ↓
ตรวจผล
  ↓
ยังไม่ครบ? → วนต่อ
  ↓
ครบและตรวจแล้ว → ตอบ/บันทึก/ส่งมอบ
```

### วงจรที่ดีต้องมี

1. **Prerequisite discovery** — หา Source/State ก่อนลงมือ
2. **Plan** — แยกขั้นตอนและ Dependency
3. **Act** — ใช้ Tool ที่เหมาะสม
4. **Observe** — อ่านผลจริง ไม่เดา
5. **Correct** — เปลี่ยนวิธีเมื่อผลไม่ครบ
6. **Verify** — Read-back หรือ Tests
7. **Report** — แยกสิ่งที่ทำสำเร็จและข้อจำกัด

### จุดที่มักผิด

- หยุดหลังเขียน Code แต่ไม่ Run
- เชื่อ Exit code โดยไม่ตรวจ Artifact
- ทำ Side effect ก่อนอ่าน State
- Retry วิธีเดิมซ้ำโดยไม่เปลี่ยน Strategy
- บอกว่า “สำเร็จ” จาก Tool call แต่ไม่ Read-back

### Definition of Done

งานถือว่าเสร็จเมื่อ Acceptance criteria ผ่านจากหลักฐานจริง ไม่ใช่เมื่อ Agent เดินครบ Checklist ที่ตัวเองเขียน

---

## 7. Tools, Toolsets, Tool Gateway, MCP และ Plugins

คำเหล่านี้คล้ายกันแต่ไม่เหมือนกัน

### Tool

Action หนึ่งอย่างที่ Model ขอให้ Harness ทำ เช่น

- อ่านไฟล์
- ค้นเว็บ
- รันคำสั่ง
- คลิก Browser
- เรียก API

Tool มี Schema บอก Input/Output และ Policy ควบคุม

### Toolset

กลุ่ม Tools ที่เปิดหรือปิดร่วมกัน เช่น Web, Terminal, File หรือ Computer Use การปิด Toolset ลดทั้ง Attack surface และ Context จาก Tool schemas

```bash
hermes tools list
hermes tools --summary
```

### Nous Tool Gateway

Nous Tool Gateway เป็นบริการของ Nous ที่ Route เครื่องมือ เช่น Web search/extract, Image, Speech และ Cloud browser ผ่าน Nous Portal โดยไม่ใช่ Generic registry ของ Tool ทุกชนิด และอาจขึ้นกับ Subscription/Quota บริการนี้ไม่ใช่ช่องรับข้อความจาก Telegram/Slack

### MCP

Model Context Protocol เป็นมาตรฐานเชื่อม Agent กับ Tool servers แต่ละ Server ประกาศ Tools/Resources/Prompts ที่รองรับ

MCP ไม่ได้ทำให้ Tool ปลอดภัยโดยอัตโนมัติ ต้องตรวจ

- Source ของ Server
- Permissions/Scopes
- Command/Network access
- Credentials ที่ใช้
- Output ที่ Model จะเห็น

### Plugin

Package เสริมที่อาจรวมหลายส่วน เช่น Tools, Skills, Hooks, Commands หรือ Provider integration ควรตรวจ Source และ Manifest ก่อนติดตั้ง

### ตารางจำง่าย

| คำ | หน่วยที่ใกล้ที่สุด |
|---|---|
| Tool | ปุ่มหรือคำสั่งหนึ่งงาน |
| Toolset | กล่องเครื่องมือ |
| MCP server | ช่างภายนอกที่นำเครื่องมือมาให้ |
| Nous Tool Gateway | บริการ Nous สำหรับ Route เครื่องมือที่รองรับ |
| Plugin | ชุดติดตั้งที่อาจรวมหลายระบบ |

---

## 8. Memory กับ Skills

### Memory ตอบว่า “ควรจำอะไร”

Persistent memory ของ Hermes เป็นข้อมูลคัดสรรและมีขนาดจำกัด โดยแยกตาม Profile

ตัวอย่าง

- Preference การสื่อสาร
- Convention ที่ใช้บ่อย
- ข้อเท็จจริงเกี่ยวกับ Environment
- การตัดสินใจที่ควรใช้ข้าม Session

Memory ถูกโหลดเป็น Snapshot ตอนเริ่ม Session การแก้ Memory ระหว่าง Session จะบันทึกลง Disk แต่ System prompt ปัจจุบันอาจยังใช้ Snapshot เดิมจนเริ่ม Session ใหม่

### Skills ตอบว่า “ควรทำอย่างไร”

Skill คือคู่มือ On-demand สำหรับงานประเภทหนึ่ง เช่น

- วิธีเปิด Pull Request
- วิธีทำ Pre-share scan
- วิธีสร้างหนังสือ Public
- วิธีตรวจ YouTube upload

Skill ที่ดีมี

- Trigger
- ขั้นตอน
- Commands/Tools
- Pitfalls
- Verification checklist

### เปรียบเทียบ

| ถ้าต้องการ… | ใช้ |
|---|---|
| จำว่าผู้ใช้ชอบคำตอบสั้น | Memory/User profile |
| ทำ Release ตามขั้นตอนเดิม | Skill |
| บังคับ Policy ใน Project | Project instructions |
| ทำอัตโนมัติเมื่อ Event เกิด | Hook |

### อย่าเก็บทุกอย่างใน Memory

ข้อมูล Project ขนาดใหญ่ควรอยู่ใน Wiki/Docs/Repository แล้วให้ Agent ค้นเมื่อจำเป็น Memory ควรเป็น Index หรือ Preference ที่กระชับ

---

## 9. Hooks

Hook คือ Code ที่ทำงานเมื่อ Event ตรงเงื่อนไข แต่ใน Hermes ปัจจุบันไม่ได้มี Hook แบบเดียว

ระบบหลักมี 4 กลุ่ม

1. **Gateway hooks** — Event ใน Messaging gateway
2. **Plugin hooks** — Plugin ลงทะเบียน Lifecycle/Tool interception
3. **Shell hooks** — Script ที่ประกาศใน Config
4. **Outbound webhooks** — ส่ง Lifecycle events ไป HTTP endpoint

### Hook ทำอะไรได้

- Logging/Audit
- Notification
- Auto-format
- Context injection
- Tool guardrail
- Block การกระทำแบบ Fail-closed
- ส่ง Event ไป CI/Dashboard

### Hook ไม่ได้ “ไม่กิน Context” เสมอไป

Hook บางชนิดทำงานภายนอก Model และไม่เพิ่ม Context แต่ Hook ที่ Inject/Transform content ย่อมเปลี่ยนข้อมูลที่ Model เห็น ต้องดูชนิดและ Event จริง

### Hook ต่างจาก Skill

- Skill โหลดเมื่อ Agent/ผู้ใช้เลือกใช้
- Hook ทำงานเพราะ Event ตรง Matcher

### ความเสี่ยง

Hook มีสิทธิ์รัน Code จึงต้องมี

- First-use consent/Allowlist
- Timeout
- Input validation
- Secret redaction
- Log ที่ไม่เปิดเผย Payload ลับ
- Doctor/Test ก่อนเปิดจริง

```bash
hermes hooks list
hermes hooks doctor
```

---

## 10. Profiles

Profile คือ Hermes home แยกชุด แต่ละ Profile มี State ของตัวเอง เช่น

- Config และ Environment
- SOUL.md
- Memory
- Sessions
- Skills
- Cron jobs
- Gateway state

### ใช้ Profile เมื่อใด

- บทบาทต่างกันระยะยาว
- Credentials/Provider ต่างกัน
- Messaging bot ต่างกัน
- Memory/Skills ต่างกัน
- ต้องการลด Context ปะปน

### กฎสำคัญ

อย่าให้ Agent processes สองตัวเขียน Hermes home เดียวกันพร้อมกัน เพราะ Memory/State อาจปะปน ควรใช้หนึ่ง Profile ต่อ Agent process ที่มีการเขียน State

### Profile ไม่ใช่ Security sandbox

Profile แยก Hermes state แต่ Process บน Host อาจยังเข้าถึง Files/Network/Credentials ของ OS user เดียวกันได้ ถ้า Tools และ Sandbox อนุญาต

Security boundary ต้องมาจาก

- OS user/container
- Filesystem permissions
- Tool restrictions
- Sandbox
- Network egress policy
- Approval/Hook controls

### คำสั่งสำรวจ

```bash
hermes profile list
hermes profile show <PROFILE>
hermes profile describe <PROFILE>
```

---

## 11. Messaging Gateway กับ Tool Gateway

### Messaging Gateway

รับ–ส่งข้อความระหว่าง Platform กับ Hermes เช่น Telegram, Discord, Slack หรือ WhatsApp

หน้าที่หลัก

- รับ Event/Message
- ตรวจ Allowlist/Group policy
- Map ผู้ส่งและ Thread ไป Session
- Route ไป Profile
- ส่งคำตอบ/Media กลับ Platform

### Tool Gateway

เชื่อม Hermes ไปยัง Tools หรือ Runtime ภายนอก ไม่ได้ทำหน้าที่เป็น Inbox ของผู้ใช้

### จำง่าย

- Messaging Gateway: **คนส่งงานเข้า Agent**
- Tool Gateway: **Agent ส่งงานออกไปหาเครื่องมือ**

### Checklist ก่อนเปิด Messaging

- Bot token เก็บที่ใด
- DM/Group policy
- Allowed users/channels
- One token–one poller
- Media size/retention
- Session/thread mapping
- Rate limit และ Error handling

---

## 12. Local, VPS และ Cloud

ตำแหน่งติดตั้งกำหนดว่า Code, Files และ Commands ทำงานที่ใด

### Local

เหมาะเมื่อ

- ต้องเข้าถึงไฟล์บนเครื่อง
- ต้องการ Latency ต่ำ
- ผู้ใช้ควบคุม Hardware/Network

ข้อจำกัด

- ปิดเครื่องแล้ว Gateway/Cron หยุด
- User-level tools อาจเห็นข้อมูลกว้างเกินจำเป็น
- ต้องดูแล Update/Backup เอง

### VPS

เหมาะเมื่อ

- ต้องทำงาน 24/7
- มี Gateway/Cron ต่อเนื่อง
- ต้องการ IP/Environment คงที่

ข้อจำกัด

- ต้อง Patch OS และ Service
- ต้องจัด Secrets, Firewall และ Backup
- Files ในเครื่อง Local ไม่ได้เข้าถึงเอง เว้นแต่มีช่องเชื่อมที่ตั้งใจ

### Cloud/Managed service

เหมาะเมื่อ

- ไม่ต้องดูแล Infrastructure มาก
- ต้อง Scale หรือใช้ Managed tools/models

ข้อจำกัด

- Data policy/Region/Retention ของ Provider
- Vendor dependency
- Cost และ Quota

### รันเองไม่ได้แปลว่า Private โดยอัตโนมัติ

แม้ Hermes อยู่ Local แต่ข้อมูลอาจออกไปยัง

- Model provider
- Search provider
- MCP/API service
- Browser cloud
- Telemetry/Logging
- Messaging platform

ให้ทำ Data-flow map ว่าข้อมูลชนิดใดส่งไปที่ใด

---

## 13. Scheduled tasks, Scripts และ Webhooks

### Scheduled task / Cron

เริ่มงานตามเวลาโดยไม่รอ Prompt ใหม่ งานต้อง Self-contained เพราะไม่มีผู้ใช้อยู่ตอบคำถาม

ควรกำหนด

- Prompt/Skill ที่ครบ
- Timezone
- Timeout
- Delivery target
- Retry/idempotency
- Approval policy
- State/continuity
- Failure alert

```bash
hermes cron list
hermes cron status
hermes cron runs <JOB_ID>
```

### Script-only job

เหมาะกับงาน Deterministic เช่น

- เช็ก Disk threshold
- Hash/Compare files
- Poll API ตาม Schema คงที่
- ส่งข้อความ Fixed format

ข้อดีคือไม่ต้องให้ Model ตีความทุกครั้ง

### Agent-driven scheduled job

เหมาะกับงานที่ต้อง

- สรุปข้อมูล
- คัดเลือก
- ให้เหตุผล
- เขียนข้อความ
- ตัดสินใจจากหลาย Source

### Webhook

Webhook เริ่มงานจาก Event ภายนอกแทนเวลา ต้องตรวจ Signature/Auth, Replay, Rate limit และ Payload size

### หลักสำคัญ

Automation ที่ดีต้องมี

- Idempotency
- Durable state
- Read-back verification
- Silent success/Explicit failure ตาม Contract
- Manual run ผ่านก่อนตั้ง Schedule

---

## 14. Subagents กับ Kanban

### Subagent

Subagent เป็นผู้ช่วยชั่วคราวแบบ Fork → Work → Return

เหมาะกับ

- Research หลาย Source แบบขนาน
- Review แยกมุม
- งานที่ Parent รอผลรวมใน Session เดียว

คุณสมบัติทั่วไป

- อายุสั้น
- Context แยก
- ผลกลับ Parent
- Top-level delegation ปัจจุบันเริ่มแบบ Background และคืน Handle ให้ Caller ก่อน ผลจะกลับภายหลัง
- ไม่ใช่ Durable worker queue

### Kanban

Hermes Kanban เป็น Durable task board ที่เก็บในฐานข้อมูลร่วมระหว่าง Profiles

เหมาะกับ

- งานหลายวัน/หลาย Stage
- Named profiles ที่รับงานตามบทบาท
- Retry/Review/Block/Dependency
- Human approval stage
- งานที่ต้อง Resume หลัง Process หยุด

### ตารางเปรียบเทียบ

| | Subagent | Kanban |
|---|---|---|
| รูปแบบ | RPC fork/join | Durable queue + state machine |
| Identity | ผู้ช่วยชั่วคราว | Named Profile |
| Caller | ได้ Handle และรับผลภายหลัง | สร้างงานแล้วแยกทำต่อได้ |
| Resume | จำกัด | ออกแบบเพื่อ Resume/Retry |
| Human review | Parent จัดการ | มี Review/Block/Comment state |

### อย่าใช้ Kanban แทนทุกอย่าง

งานสั้นที่จบใน Session เดียวใช้ Subagent ง่ายกว่า ส่วนงาน Durable ที่มีหลายบทบาทและสถานะใช้ Kanban

```bash
hermes kanban boards list
hermes kanban list
hermes kanban stats
```

---

## 15. Permissions, Approvals และ Sandboxing

ความปลอดภัยของ AI Agent ต้องมีหลายชั้น เพราะไม่มี Control เดียวครอบคลุมทุกความเสี่ยง

### ชั้นที่ 1: User authorization

กำหนดว่าใครส่งคำขอได้ เช่น Allowlist, DM-only หรือ Channel policy

### ชั้นที่ 2: Tools/Toolsets

ถ้า Agent ไม่มี Tool นั้น ก็ขอทำ Action นั้นไม่ได้ ลด Toolset ให้เหลือเท่าที่งานจำเป็น

### ชั้นที่ 3: Approvals

หยุดรอมนุษย์ก่อน Side effect สำคัญ เช่น Publish, Delete, Share permissions หรือเปลี่ยน Credentials

Built-in command approval ของ Hermes เน้นคำสั่ง Terminal ที่เข้าข่ายอันตรายและมีโหมดอย่าง `smart`, `manual` และ `off`; ไม่ได้แปลว่าทุก File edit หรือ External side effect จะถูกถามโดยอัตโนมัติ Project/Skill จึงต้องประกาศ Approval policy สำหรับ Publish, Delete, Permission และ Credential changes เพิ่มเอง

### ชั้นที่ 4: Hooks/Policy

บล็อกหรือแปลง Action อัตโนมัติตามกฎ เช่น ป้องกัน Secret ใน Output หรือจำกัด Command

### ชั้นที่ 5: Sandbox และ OS isolation

จำกัด Filesystem, Process, Network และ Credentials ที่ Runtime เข้าถึง

### ชั้นที่ 6: Verification/Audit

บันทึกว่าใครขออะไร Tool ใดทำอะไร และ State หลัง Action เป็นอย่างไร

### หลัก Least privilege

ให้ Agent เห็นและทำได้เฉพาะสิ่งที่จำเป็นต่อบทบาท

- Profile เฉพาะงาน
- Toolset เฉพาะงาน
- Directory/Network allowlist
- Credentials scopes ต่ำสุด
- Approval สำหรับ Irreversible action
- Read-back หลัง External write

### Approval ไม่ใช่ความปลอดภัยทั้งหมด

ถ้าผู้ใช้กดยืนยันโดยไม่เห็น Scope ที่ชัด Approval ก็ไม่มีคุณค่า ระบบต้องแสดง Target, Payload, Visibility และผลกระทบก่อนขออนุมัติ

---

## ตารางแยกคำที่มักสับสน

| คำ A | คำ B | ความต่างสั้นที่สุด |
|---|---|---|
| Hermes | Model | Harness คุมงาน; Model คิด |
| Model | Provider | Model คือความสามารถ; Provider คือช่องทางเข้าถึง |
| Prompt | SOUL.md | งานรอบนี้; ตัวตน/วิธีทำงานระยะยาว |
| SOUL.md | Project instructions | ระดับ Profile; ระดับ Workspace |
| Context | Memory | สิ่งที่ Model เห็นรอบนี้; สิ่งคัดสรรที่เก็บข้าม Session |
| Memory | Skills | จำอะไร; ทำอย่างไร |
| Skill | Hook | เรียกเมื่อต้องทำงาน; ทำเมื่อ Event ตรง |
| Tool | MCP | Action หนึ่งงาน; Protocol/server ที่นำ Tools มาให้ |
| Messaging Gateway | Tool Gateway | คนคุยกับ Agent; Agent คุยกับ Tools |
| Profile | Subagent | บทบาทถาวร; ผู้ช่วยชั่วคราว |
| Subagent | Kanban | Fork/join ในงานเดียว; Durable multi-stage board |
| Cron | Webhook | เริ่มตามเวลา; เริ่มจาก Event ภายนอก |
| Approval | Hook guard | รอคนตัดสินใจ; ใช้กฎอัตโนมัติ |
| Profile isolation | Sandbox | แยก Hermes state; จำกัดสิทธิ์ระดับ Runtime/OS |

---

## วิธีติดตามคำขอหนึ่งงานตั้งแต่ต้นจนจบ

เมื่ออยากรู้ว่า “งานนี้เกิดอะไรขึ้น” ให้ตอบคำถามตามลำดับ

1. **เข้าจากไหน** — Terminal, Desktop, API หรือ Messaging platform
2. **ใครส่งมา** — ผ่าน Allowlist/Authorization หรือไม่
3. **Profile ใดรับงาน** — Config, Memory และ Skills ชุดไหน
4. **Session ใด** — มี Context/Handoff เดิมอะไรบ้าง
5. **Instructions อะไรโหลด** — System, SOUL, Project, Skill
6. **Model/Provider ใดคิด** — Context/Quota/Policy แบบไหน
7. **Tool ใดถูกเรียก** — Local, MCP, Browser, API หรือ Script
8. **Approval/Hook ใดควบคุม** — อนุมัติหรือบล็อกตรงไหน
9. **ผลถูกตรวจอย่างไร** — Test, Read-back, Hash หรือ Live verification
10. **อะไรถูกบันทึก** — File, Git, State, Memory, Session, Kanban หรือ External system
11. **ส่งผลไปที่ไหน** — Chat, Drive, GitHub, Email หรือ Dashboard

ถ้าตอบไม่ได้ข้อใด แสดงว่าระบบยังขาด Observability หรือ Documentation ตรงจุดนั้น

---

## Blueprint สำหรับเริ่มต้นแบบปลอดภัย

### Phase 1 — ใช้แบบ Interactive

- เลือก Profile เดียว
- เปิด Tools น้อยชุด
- ใช้ Manual approval
- ทำงาน Read-only ก่อน
- บันทึก Project instructions

### Phase 2 — ทำ Workflow ซ้ำด้วย Skill

- ทำงานหนึ่งรอบกับมนุษย์
- เขียน Skill จากขั้นตอนที่พิสูจน์แล้ว
- ใส่ Pitfalls และ Verification
- ทดสอบกับ Input ใหม่

### Phase 3 — เพิ่ม Automation แบบจำกัด

- Manual run ก่อน
- กำหนด State/Idempotency
- ตั้ง Cron หรือ Webhook
- ส่ง Alert เมื่อ Failure
- ห้าม Auto-publish/Delete หากยังไม่มี Policy

### Phase 4 — แยก Profile/Kanban เมื่อจำเป็น

- แยกบทบาทระยะยาว
- กำหนด Profile description
- สร้าง Durable task stages
- เพิ่ม Human review
- ตรวจ Isolation จริงที่ Tool/OS level

---

## Checklist ก่อนให้ Hermes ทำงานเอง

- [ ] Source of truth ชัดเจน
- [ ] Profile/Role ชัดเจน
- [ ] Tools เท่าที่จำเป็น
- [ ] Credentials scopes ต่ำสุด
- [ ] Prompt/Skill Self-contained
- [ ] Timeout/Retry จำกัด
- [ ] Idempotency และ Durable state
- [ ] Approval สำหรับ Public/Destructive action
- [ ] Pre-share/Secret scan
- [ ] Read-back verification
- [ ] Failure alert
- [ ] Restore/Rollback path
- [ ] Audit log ที่ไม่เปิดเผย Secret

---

## Quick reference

```bash
# Version และสุขภาพระบบ
hermes --version
hermes doctor

# Model / Provider / Config
hermes model
hermes setup
hermes config show

# Tools
hermes tools list
hermes tools --summary

# Profiles
hermes profile list
hermes profile show <PROFILE>
hermes profile describe <PROFILE>

# Hooks
hermes hooks list
hermes hooks doctor

# Scheduled tasks
hermes cron list
hermes cron status

# Durable multi-agent work
hermes kanban boards list
hermes kanban list
hermes kanban stats
```

ตรวจ `--help` ของ Subcommand ก่อนใช้คำสั่ง Create/Edit/Delete/Publish

---

## AI implementation brief

หาก AI Agent ใช้คู่มือนี้เพื่อออกแบบ Hermes setup ให้ทำตามลำดับ

1. ระบุ Interface, User และ Profile
2. วาด Data-flow map
3. ระบุ Instructions/Context sources
4. เลือก Model/Provider ตามงาน
5. เปิด Toolsets เท่าที่จำเป็น
6. แยก Memory, Skills, Hooks และ Project docs ให้ถูกชั้น
7. เลือก Subagent หรือ Kanban ตามอายุงาน
8. ออกแบบ Cron/Webhook แบบ Idempotent
9. วาง Permissions, Approvals, Sandbox และ Egress
10. ทำ Manual test และ Read-back
11. บันทึก Runbook/Handoff
12. จึงเปิด Automation ตาม Scope ที่อนุมัติ

AI ห้ามสรุปว่า Profile เป็น Security boundary และห้ามอ้างว่า Local deployment ทำให้ข้อมูล Private โดยอัตโนมัติ

---

## Definition of Done

ผู้อ่านถือว่าเข้าใจระบบเมื่อสามารถ

- อธิบาย Hermes กับ Model แยกกันได้
- บอกได้ว่าคำแก้ควรอยู่ Prompt, SOUL, Project instruction, Memory หรือ Skill
- แยก Tool, MCP, Gateway และ Plugin ได้
- เลือก Profile, Subagent หรือ Kanban ได้เหมาะกับงาน
- อธิบายว่า Cron/Webhook เริ่มงานอย่างไร
- ระบุ Security controls มากกว่าหนึ่งชั้น
- ติดตามคำขอจาก Interface ถึง Artifact/State สุดท้ายได้

---

## แหล่งอ้างอิง

### Source video

- Every Hermes Agent Concept Explained for Normal People
  https://www.youtube.com/watch?v=lGtBPrSrnjY

### Official Hermes Agent documentation

- Documentation home: https://hermes-agent.nousresearch.com/docs
- Profiles: https://hermes-agent.nousresearch.com/docs/user-guide/profiles
- Context files: https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files
- Sessions: https://hermes-agent.nousresearch.com/docs/user-guide/sessions
- Context compression: https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching
- Tools and toolsets: https://hermes-agent.nousresearch.com/docs/user-guide/features/tools
- Nous Tool Gateway: https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway
- MCP: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp
- Persistent memory: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
- Skills: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- Event hooks: https://hermes-agent.nousresearch.com/docs/user-guide/features/hooks
- Scheduled tasks: https://hermes-agent.nousresearch.com/docs/user-guide/features/cron
- Webhooks: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks
- Subagent delegation: https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation
- Kanban: https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban
- Security: https://hermes-agent.nousresearch.com/docs/user-guide/security

เนื้อหาโปรโมชัน ส่วนลด Affiliate การขายบริการ และกรณีศึกษาที่ไม่จำเป็นต่อความเข้าใจทางเทคนิคถูกตัดออกจากฉบับ Public นี้
