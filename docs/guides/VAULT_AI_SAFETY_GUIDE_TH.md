---
title: "VAULT: คู่มือออกแบบระบบ AI ที่ตรวจสอบได้และควบคุมความเสี่ยง"
visibility: public
language: th
status: final
source_url: "https://www.youtube.com/watch?v=ZzHsJW10iq4"
sources:
  - "https://www.youtube.com/watch?v=ZzHsJW10iq4"
  - "https://www.goldmansachs.com/insights/articles/what-will-it-take-for-companies-to-capitalize-on-the-rise-of-ai"
  - "https://www.goldmansachs.com/careers/blog/five-questions-with-marco-argenti"
  - "https://www.goldmansachs.com/insights/articles/fortune-we-must-prepare-ai-natives-to-shape-the-future-of-work"
  - "https://www.goldmansachs.com/insights/articles/a-new-generation-of-ai-tools-and-models-is-emerging"
  - "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf"
  - "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf"
  - "https://learn.microsoft.com/en-us/azure/logic-apps/agent-workflows-concepts"
tags:
  - ai-safety
  - ai-governance
  - responsible-ai
  - human-in-the-loop
  - verification
  - vault
---

# VAULT: คู่มือออกแบบระบบ AI ที่ตรวจสอบได้และควบคุมความเสี่ยง

> **คำชี้แจงสำคัญ:** VAULT เป็นคำช่วยจำที่ **Nate Herk สร้างขึ้นเอง** และนำเสนอในวิดีโอต้นทาง ไม่ใช่กรอบ นโยบาย มาตรฐาน หรือการรับรองอย่างเป็นทางการของ Goldman Sachs เนื้อหาบางส่วนสอดคล้องกับแนวคิดสาธารณะของ Goldman Sachs, Marco Argenti, NIST และ Microsoft แต่การจัดคำเป็น V-A-U-L-T เป็นผลงานของผู้สร้างวิดีโอ

คู่มือนี้เรียบเรียงใหม่เพื่อใช้เป็นแนวทางเชิงปฏิบัติ ตัดโฆษณา ช่องทางติดต่อ เรื่องเล่าที่ยืนยันไม่ได้ และคำกล่าวเชิงส่งเสริมการขายออกทั้งหมด ชื่อ **Marco Argenti** ใช้การสะกดที่ถูกต้องตลอดเอกสาร

## สรุปสำหรับผู้บริหาร

AI สามารถสร้างผลลัพธ์ที่ดูสมบูรณ์ได้เร็ว แต่ความลื่นไหลของภาษาไม่ใช่หลักฐานความถูกต้อง ระบบที่น่าเชื่อถือจึงต้องออกแบบให้:

1. เริ่มจากปัญหาและผลลัพธ์ที่วัดได้ ไม่เริ่มจากชื่อเครื่องมือ
2. เลือก deterministic automation เมื่อกฎและคำตอบนิยามได้ชัด
3. ใช้ AI เฉพาะขั้นที่ต้องตีความภาษา บริบท หรือข้อมูลไร้โครงสร้าง
4. ตรวจข้อมูลเข้า ข้ออ้าง ตัวเลข และการกระทำด้วยแหล่งจริงและการทดสอบ
5. จัดระดับความเสี่ยงและวางมนุษย์ไว้ก่อนการกระทำที่มีผลกระทบสูง
6. เก็บหลักฐานที่ตรวจย้อนหลังได้ โดยไม่เก็บ secret หรือข้อมูลส่วนบุคคลเกินจำเป็น
7. อ่านสถานะปลายทางกลับหลังการเขียนหรือการส่งทุกครั้ง ก่อนนับว่าสำเร็จ

ลำดับออกแบบที่ใช้งานได้จริงคือ **Understand → เลือกวิธี → Augment → Verify → Loop Humans In → Transparency** แม้คำย่อจะเรียง VAULT

---

# View 1 — ระบบ AI ที่น่าเชื่อถือหน้าตาอย่างไร

## แยกห้าคุณสมบัติออกจากกัน

- **น่าอ่าน:** ภาษาและรูปแบบชัดเจน
- **สมเหตุผล:** คำอธิบายเชื่อมโยงกัน
- **ถูกต้อง:** ตรงกับข้อมูล กฎ และหลักฐานที่เปิดตรวจได้
- **ปลอดภัยในการลงมือทำ:** ความผิดพลาดไม่ขยายเป็นผลร้ายวงกว้าง
- **ตรวจย้อนหลังได้:** รู้ว่าใช้ข้อมูลใด ทำอะไร ผ่านการตรวจใด และใครอนุมัติ

ผลลัพธ์ที่น่าอ่านและสมเหตุผลอาจยังผิดได้ ระบบจึงไม่ควรฝากความน่าเชื่อถือไว้กับโมเดลเพียงชั้นเดียว

## แผนที่ VAULT

| ตัวอักษร | หลักช่วยจำ | คำถามสำคัญ |
|---|---|---|
| V | Verify | อินพุต ข้ออ้าง ตัวเลข และการกระทำตรวจจากอะไร |
| A | Augment, Don’t Replace | AI เสริมขั้นใด โดยไม่ทำลายส่วนที่เชื่อถือได้ |
| U | Understand the Why | ปัญหา ผลลัพธ์ และข้อห้ามคืออะไร |
| L | Loop Humans In | จุดใดต้องมีคนตรวจหรืออนุมัติ |
| T | Transparency | บุคคลอื่นตรวจย้อน ส่งต่อ หยุด และแก้ระบบได้หรือไม่ |

AI เป็นตัวขยายทั้งความเร็วและความผิดพลาด เมื่อเชื่อมโมเดลกับสิทธิ์ส่งข้อความ แก้ข้อมูล ใช้เงิน หรือเผยแพร่ ต้องประเมิน **รัศมีผลกระทบ** ของการตีความผิด ไม่ดูเฉพาะคุณภาพข้อความ

### Checklist เริ่มต้น

- [ ] ระบุการกระทำจริงที่ระบบทำได้
- [ ] ระบุผลกระทบสูงสุดของแต่ละการกระทำ
- [ ] แยก confidence ของภาษาออกจากหลักฐาน
- [ ] ยืนยันว่า VAULT เป็นคำช่วยจำของ Nate Herk ไม่ใช่กรอบทางการของ Goldman Sachs

---

# View 2 — U: Understand the Why

Goldman Engineering ใช้แนวคิด **“Build with purpose”** โดย Marco Argenti อธิบายว่าควรให้ความสำคัญกับ “why” ไม่ใช่เพียง “how” แนวคิดนี้รองรับการเริ่มจากวัตถุประสงค์ แต่ไม่ได้ทำให้ตัวอักษร U หรือ VAULT กลายเป็นหลักทางการของ Goldman Sachs

## Problem statement

เติมข้อความให้ครบก่อนเลือกเครื่องมือ:

> ปัญหาที่ต้องแก้คือ `<PROBLEM>`<br>
> ผู้ได้รับผลกระทบคือ `<STAKEHOLDERS>`<br>
> สภาพปัจจุบันวัดด้วย `<BASELINE>`<br>
> ผลลัพธ์ที่ดีคือ `<TARGET>`<br>
> สิ่งที่ห้ามเกิดคือ `<GUARDRAILS>`<br>
> ผู้รับผิดชอบการตัดสินใจสุดท้ายคือ `<OWNER>`

ตัวอย่างที่อ่อน: “ต้องการสร้าง AI agent สำหรับทีม”

ตัวอย่างที่ใช้งานได้: “ลดเวลารวมรายงานประจำสัปดาห์จาก 90 นาทีเหลือต่ำกว่า 20 นาที โดยตัวเลขสำคัญต้องตรงกับแหล่งต้นทาง และรายงานต้องไม่ถูกส่งก่อนเจ้าของข้อมูลอนุมัติ”

## Outcome Card

| ช่อง | คำถาม |
|---|---|
| Problem | อะไรช้า แพง ผิดบ่อย หรือขัดขวางการตัดสินใจ |
| Users | ใครทำ ใครรับผล ใครอนุมัติ |
| Baseline | สภาพปัจจุบันวัดได้อย่างไร |
| Target | ผลที่ดีต้องเป็นเท่าใดและภายในเมื่อใด |
| Guardrails | ข้อมูล สิทธิ์ การกระทำ หรือผลใดห้ามเกิด |
| Owner | ใครรับผิดชอบผลสุดท้าย |

### Gate ก่อนพัฒนา

- [ ] ปัญหาเขียนได้ในหนึ่งหรือสองประโยค
- [ ] มี baseline และ target ที่วัดได้
- [ ] มี owner และ guardrails
- [ ] พิจารณา checklist, form validation, rule engine หรือ script แล้ว
- [ ] อธิบายได้ว่าทำไม AI จึงจำเป็นในขั้นที่เลือก

---

# View 3 — เลือก Deterministic, AI หรือ Hybrid

## คำจำกัดความ

**Deterministic automation** ใช้กฎที่ระบุไว้ล่วงหน้า เมื่อ logic, input, state และ environment คงที่ ระบบควรให้พฤติกรรมเดิม แต่ deterministic ไม่ได้แปลว่าถูกเสมอ กฎผิดก็ทำให้ระบบทำผิดซ้ำได้ และ API หรือข้อมูลภายนอกอาจเปลี่ยน

**AI-assisted step** เหมาะกับการสรุป จัดหมวด ตีความภาษา หรือร่างข้อความที่ไม่สามารถเขียนกฎได้ครบ ผลลัพธ์มีความแปรผัน จึงต้องมีขอบเขต schema และวิธีตรวจ

**Hybrid workflow** ให้ code หรือระบบกฎดูแลข้อเท็จจริง การคำนวณ สิทธิ์ และ hard limits ส่วน AI ดูแลงานตีความหรือการสื่อสาร

## Decision guide

1. นิยามคำตอบที่ถูกด้วยกฎครบได้หรือไม่ → ได้: เริ่มจาก deterministic
2. ต้องตีความภาษา ภาพ หรือข้อมูลยุ่งเหยิงหรือไม่ → ใช่: พิจารณา AI
3. ผลลัพธ์ตรวจด้วยกฎหรือแหล่งจริงได้หรือไม่ → ได้: AI + deterministic validation
4. ถ้าตรวจอัตโนมัติไม่ได้และผลกระทบสูง → human review หรือจำกัดขอบเขต
5. การกระทำย้อนกลับยาก ส่งภายนอก ใช้เงิน หรือแก้ข้อมูลสำคัญ → preview + explicit approval

| ลักษณะงาน | วิธีเริ่มต้น |
|---|---|
| คำนวณ ตรวจ schema ตรวจสิทธิ์ | Deterministic |
| สรุปข้อความไร้โครงสร้าง | AI-assisted |
| อธิบายตัวเลขที่ตรวจแล้ว | Hybrid |
| จ่ายเงิน เปลี่ยนสิทธิ์ ลบถาวร | Deterministic controls + Human decision |
| ส่งข้อความถึงคนจำนวนมาก | Draft + validation + Human approval |

หลักเลือกคือ **ระบบที่ง่ายที่สุดซึ่งผ่านเกณฑ์คุณภาพและความปลอดภัย** ไม่ใช่ระบบที่ใช้ AI มากที่สุด

---

# View 4 — V: Verify

Goldman กล่าวถึงกระบวนการที่ต้อง verifiable และผลลัพธ์ที่ provable ขณะที่ NIST AI RMF และ NIST Generative AI Profile เน้นการวัด จัดการ และกำกับความเสี่ยงตลอดวงจรชีวิต

## ตรวจข้อมูลเข้า

- แหล่งที่มา เจ้าของ และสิทธิ์การใช้
- วันอัปเดตล่าสุดและ freshness requirement
- missing values, duplicates, conflicts และ schema version
- หน่วย เวลา สกุลเงิน และ timezone
- ข้อมูลต้องห้ามหรือข้อมูลเกินสิทธิ์

## ตรวจผลลัพธ์ออก

- ตัวเลขสำคัญตรง source of truth
- การคำนวณรันด้วย code/test แยกจากคำอธิบายของโมเดล
- ทุกข้ออ้างสำคัญเปิดถึงหลักฐานได้
- output ผ่าน schema, allowlist และ policy checks
- action payload ตรงกับ preview ที่อนุมัติ
- หลัง execute อ่านสถานะเป้าหมายจริงกลับมาเทียบ

## Verification Pyramid

1. **Automated checks:** schema, ranges, totals, duplicates, permissions
2. **Evidence checks:** source snapshot, record reference, claim-to-source mapping
3. **Human judgment:** บริบท ความเหมาะสม ผลกระทบ และข้อยกเว้น

โมเดลอีกตัวช่วยชี้จุดผิดได้ แต่ “โมเดลสองตัวเห็นตรงกัน” ไม่ใช่หลักฐานอิสระหากใช้ข้อมูลผิดชุดเดียวกัน อย่าพึ่งคำสั่งให้โมเดล “ตรวจตัวเอง” หรือสร้าง citation เพียงอย่างเดียว

### Verification Plan

| รายการสำคัญ | ผลเสียหากผิด | แหล่งจริง | วิธีตรวจ | ผู้รับผิดชอบ | เกณฑ์ผ่าน |
|---|---|---|---|---|---|
| ยอดรวม | สูง | query ที่อนุมัติ | คำนวณซ้ำด้วย code | data owner | ตรง 100% |
| สรุปแนวโน้ม | กลาง | ตารางที่ตรวจแล้ว | ผูกทุกข้ออ้างกับค่า | analyst | ไม่มีข้ออ้างไร้หลักฐาน |
| รูปแบบ | ต่ำ | schema | parser test | ระบบ | ช่องบังคับครบ |

---

# View 5 — A: Augment, Don’t Replace

Marco Argenti กล่าวในแหล่ง Goldman ว่า AI สามารถ augment ความสามารถมนุษย์และควรถูกกำกับโดยมนุษย์ ไม่ใช่กลไกอัตโนมัติที่ไร้การควบคุม แนวคิดนี้สอดคล้องกับ A แต่ชื่อ VAULT ยังคงเป็นคำช่วยจำของ Nate Herk

## แยกกระบวนการก่อนเพิ่ม AI

วาดลำดับตั้งแต่ trigger → input → transformation → validation → decision → action → read-back แล้วระบุแต่ละขั้นเป็น **Deterministic / AI / Human**

| ขั้น | งาน | วิธี | การตรวจ |
|---|---|---|---|
| ดึงข้อมูล | กฎชัด | API/script | row count, checksum |
| คำนวณ | กฎชัด | code | unit tests |
| ตีความ | ต้องใช้ภาษา/บริบท | AI-assisted | evidence mapping |
| ส่งผล | มีผลภายนอก | human-approved action | exact preview + read-back |

## รูปแบบที่ปลอดภัย

```text
Source → deterministic extraction → validation
       → AI explanation → human review → publish → read-back
```

```text
Input → AI proposal → schema/allowlist/policy check
      → preview → approval → action → receipt
```

### Anti-pattern

- ให้ AI สร้างตัวเลขที่ควรดึงจากระบบจริง
- เชื่อม agent กับเครื่องมือจำนวนมากตั้งแต่รุ่นแรก
- ไม่มี manual fallback เมื่อโมเดลหรือ API ใช้งานไม่ได้
- รื้อ source of truth ก่อนพิสูจน์วิธีใหม่
- เปลี่ยนหลายขั้นพร้อมกันจนวัดผลไม่ได้

---

# View 6 — L: Loop Humans In

Marco Argenti เตือนว่าความคลาดเคลื่อนและ hallucination อาจถูก agent ขยายเป็นการกระทำอันตราย และเสนอให้รักษามนุษย์ไว้ในวงจร การกำหนด tier ต่อไปนี้เป็นการประยุกต์เชิงปฏิบัติของคู่มือ ไม่ใช่ tier ทางการของ Goldman Sachs

## ประเมินห้ามิติ

- **Reach:** กระทบคนหรือรายการจำนวนเท่าใด
- **Reversibility:** ย้อนกลับง่ายเพียงใด
- **Sensitivity:** เกี่ยวกับข้อมูลอ่อนไหวหรือไม่
- **Authority:** ระบบส่ง เผยแพร่ ใช้เงิน หรือแก้ระบบจริงได้หรือไม่
- **Detectability:** ตรวจพบก่อนหรือหลังเกิดผล

| Tier | ลักษณะ | ค่าเริ่มต้น |
|---|---|---|
| 0 Sandbox | ข้อมูลสังเคราะห์ ไม่มีผลภายนอก | อัตโนมัติได้ เก็บ log ขั้นพื้นฐาน |
| 1 Low | ผลส่วนตัว ย้อนกลับง่าย | auto ภายใต้ limit พร้อม undo |
| 2 Moderate | กระทบทีม/ข้อมูลภายใน | preview, validation, sampled review |
| 3 High | สื่อสารภายนอกหรือแก้ข้อมูลสำคัญ | human approval, batch limit, rollback |
| 4 Critical | เงิน สิทธิ์ ความปลอดภัย ลบถาวร | แยกหน้าที่ อนุมัติสองชั้น hard limits; AI ไม่ตัดสินสุดท้าย |

## Safe defaults

- Draft, not send
- Preview, not mutate
- Read-only first
- Small batch first
- Allowlist, rate limit และ spend cap
- Approval ผูกกับ exact payload/version
- Kill switch และ rollback path

หน้าจออนุมัติต้องแสดง action, target, จำนวนรายการ, exact diff/payload, หลักฐาน, validation, ความไม่แน่ใจ และวิธีย้อนกลับ ปุ่มอนุมัติที่ไม่มีข้อมูลเหล่านี้ไม่ใช่ human-in-the-loop ที่มีคุณภาพ

---

# View 7 — T: Transparency

Goldman กล่าวถึง safety, accuracy, controls, transparency และ governance ในบริบท AI แต่รายการ log ในคู่มือนี้เป็นข้อเสนอเชิงปฏิบัติ ไม่ใช่ข้อกำหนดทางการของ Goldman Sachs

ความโปร่งใสที่ใช้ตรวจสอบได้คือ **หลักฐาน** ไม่ใช่การขอ chain-of-thought หรือความคิดภายในของโมเดล

## Minimal Execution Log

```json
{
  "run_id": "<RUN_ID>",
  "workflow_version": "<VERSION>",
  "started_at": "<ISO_TIMESTAMP>",
  "input_refs": ["<SOURCE_REF>"],
  "input_snapshot_hash": "<HASH>",
  "model_or_method": "<MODEL_OR_RULESET>",
  "tools_called": ["<TOOL_NAME>"],
  "validation_results": [
    {"check": "<CHECK_NAME>", "status": "pass|fail", "evidence": "<REF>"}
  ],
  "risk_tier": "Tier 0-4",
  "approval": {
    "required": true,
    "status": "pending|approved|rejected",
    "actor": "<ROLE_OR_ID>",
    "timestamp": "<ISO_TIMESTAMP>"
  },
  "execution_status": "not_run|success|partial|failed|rolled_back",
  "output_refs": ["<OUTPUT_REF>"]
}
```

อย่าใส่ secret, token, password หรือข้อมูลส่วนบุคคลเกินจำเป็นลงใน log ใช้ hash, pointer, redaction และ access control

## Evidence Bundle

1. source snapshot
2. transformation/workflow version
3. validation report
4. approval/decision record
5. output หรือ exact diff
6. execution receipt และ read-back result
7. rollback status เมื่อเกิดข้อผิดพลาด

ผู้รับช่วงต้องหา source of truth, จุด AI, จุด validation, จุดอนุมัติ, owner, วิธี replay และวิธีหยุดระบบได้จากเอกสาร

---

# View 8 — ออกแบบ End-to-End Workflow

## Reference Architecture

```text
Trigger
  ↓
Authenticate + authorize
  ↓
Fetch source snapshot
  ↓
Deterministic validation ── fail ──→ Quarantine + notify owner
  ↓ pass
AI step (เฉพาะงานตีความ)
  ↓
Schema + policy + evidence checks ── fail ──→ Draft/repair queue
  ↓ pass
Risk classification
  ├─ Tier 0–1 → Execute within limits
  └─ Tier 2–4 → Preview + human approval
                     ↓ approved
                  Execute
                     ↓
            Read-back verification
                     ↓
           Receipt + log + monitoring
```

## Workflow Canvas

- **Purpose:** problem, stakeholders, baseline, target, guardrails
- **Inputs:** source of truth, owner, freshness, required/sensitive fields
- **Steps:** ประเภท Deterministic / AI / Human, input, output, validation
- **Actions:** reach, reversibility, tier, approval, limits
- **Evidence:** snapshot, tests, approval, receipt
- **Failure:** unavailable, validation fail, timeout, partial execution, rollback, escalation owner

## Read-back verification

การตอบจาก API ว่า success ยังไม่พอ หลังเปลี่ยนสถานะภายนอกต้องอ่านเป้าหมายจริงและยืนยันว่า record ถูกต้อง ค่าตรง payload จำนวนตรง preview ไม่มี partial failure และสถานะปลายทางตรงความต้องการ

| Failure | Safe response |
|---|---|
| ข้อมูลเก่าหรือ schema เปลี่ยน | หยุดและ quarantine |
| output ผิด schema | retry แบบจำกัดหรือส่ง manual queue |
| หลักฐานไม่ครบ | ห้าม publish/execute |
| approval timeout | ให้คำขอหมดอายุ ไม่ execute |
| สำเร็จบางส่วน | หยุด batch, reconcile, rollback |
| ปริมาณหรือต้นทุนพุ่ง | circuit breaker |

---

# View 9 — ตัวอย่างใช้งาน

## 1. รายงานประจำสัปดาห์

Script ดึงข้อมูล → code ตรวจและคำนวณ → AI อธิบายจากตัวเลขที่ตรวจแล้ว → owner อนุมัติ draft → ส่ง → read-back receipt

**ข้อควบคุม:** AI ไม่สร้างตัวเลข ไม่ดึงข้อเท็จจริงจากความจำ และไม่มีสิทธิ์ส่งก่อนอนุมัติ

## 2. คัดแยกคำร้องภายใน

กฎตายตัวจัดประเภทที่ชัด AI ช่วยอ่านข้อความอิสระ รายการ confidence ต่ำหรือหมวดเสี่ยงเข้าคิวมนุษย์ ระบบแนะนำหมวดแต่ไม่ปิดคำร้องเอง

**ตัวชี้วัด:** false positive/false negative แยกตามหมวด, unknown rate, human override rate

## 3. ร่างการสื่อสารกลุ่มใหญ่

AI ร่างข้อความเท่านั้น รายชื่อมาจาก query ที่กำหนด code ตรวจจำนวน ผู้อนุมัติเห็น exact message และ recipient count การเปลี่ยนเนื้อหาหรือกลุ่มเป้าหมายทำให้ approval เดิมหมดอายุ

**ข้อควบคุม:** test segment, allowlist, rate limit, kill switch และอนุมัติใหม่ก่อนขยายเต็มชุด

## 4. แก้ข้อมูลจำนวนมาก

AI เสนอ mapping → code สร้าง exact diff → dry run → ตรวจ protected targets และ batch size → backup/transaction → approval → small batches → read-back ทุก batch

สถานการณ์ทั้งหมดเป็นตัวอย่างออกแบบ ไม่ใช่เหตุการณ์จริงหรือคำรับรองผลลัพธ์

---

# View 10 — ทดสอบ เปิดใช้ และรับมือเหตุผิดปกติ

## Test Stack

1. **Unit tests:** calculations, date/unit conversion, schema, permissions, tier rules
2. **Golden cases:** ตัวอย่างที่ owner ยอมรับ ครอบคลุมปกติ ขอบเขต และคลุมเครือ
3. **Adversarial/failure tests:** stale/duplicate input, prompt injection, timeout, partial API success, payload version drift, unauthorized target
4. **End-to-end dry run:** validation → approval → execute ใน sandbox → read-back → log

## Rollout Ladder

Offline evaluation → Shadow mode → Internal draft → Small batch → Expanded rollout → Routine operation

อย่าข้ามจาก prototype ไป autonomous production เพราะ demo ผ่านครั้งเดียว

## Metrics

- คุณภาพ: validation pass, evidence coverage, false positive/negative, override
- ความปลอดภัย: blocked actions, approval bypass, limit triggers, rollback, incidents
- ประสิทธิภาพ: time per item, queue time, cost per successful outcome
- ความน่าเชื่อถือ: API failure, partial completion, stale input, recovery time

## Incident Playbook

1. **Contain:** หยุด workflow หรือปิดสิทธิ์
2. **Preserve evidence:** เก็บ run ID, payload, log และสถานะปลายทาง
3. **Assess:** ระบุคน รายการ และข้อมูลที่ได้รับผล
4. **Rollback/remediate:** ทำตาม runbook
5. **Notify owner:** ส่งต่อผู้รับผิดชอบตามระดับเหตุ
6. **Find control gap:** หา validation, approval, limit หรือ monitoring ที่พลาด
7. **Add regression test:** แปลงเหตุการณ์เป็นกรณีทดสอบ
8. **Reopen gradually:** กลับมาตาม rollout ladder

---

# View 11 — Quick Reference และ Definition of Done

## 60-Second Decision Card

- มีกฎครบและคำตอบรู้ล่วงหน้า → **Deterministic**
- ต้องตีความภาษา/ข้อมูลยุ่งเหยิง → **AI-assisted**
- ต้องใช้ข้อเท็จจริงสำคัญและสร้างคำอธิบาย → **Hybrid**
- ผลกระทบต่ำและย้อนกลับง่าย → อัตโนมัติภายใต้ limits
- ส่งภายนอก แก้ข้อมูลสำคัญ ใช้เงิน เปลี่ยนสิทธิ์ หรือลบ → exact preview + human approval
- ไม่มีหลักฐานหรือ source of truth → หยุดและขอข้อมูล ไม่เดา
- execute แล้ว → read back เป้าหมายจริงก่อนนับว่าสำเร็จ

## Task Brief สำหรับผู้ช่วย AI

```text
เป้าหมาย: <OUTCOME>
ข้อมูลที่อนุญาต: <SOURCE_LIST>
ข้อห้าม: <GUARDRAILS>
งาน: <TASK>
รูปแบบผลลัพธ์: <SCHEMA_OR_TEMPLATE>
การตรวจที่ต้องผ่าน: <VALIDATION_RULES>
หากข้อมูลไม่พอ: ระบุ missing evidence และหยุด
สิทธิ์การกระทำ: <DRAFT_ONLY | PREVIEW_ONLY | APPROVED_ACTIONS>
หลักฐานที่ต้องคืน: source refs, assumptions, validation, exact diff และ unresolved risks
```

## Definition of Done

### Purpose
- [ ] มี problem statement, baseline, target, owner และ guardrails
- [ ] อธิบายได้ว่าทำไมไม่ใช้วิธีที่ง่ายกว่า

### Architecture
- [ ] ทุกขั้นติดป้าย Deterministic / AI / Human
- [ ] ข้อเท็จจริง การคำนวณ สิทธิ์ และ hard limits ไม่ฝากไว้กับ AI อย่างเดียว
- [ ] มี fallback และ manual path

### Verification
- [ ] input มี source, freshness และ schema checks
- [ ] claims/metrics สำคัญย้อนถึงหลักฐานได้
- [ ] tests ครอบคลุม edge cases และ partial failure
- [ ] external writes มี read-back verification

### Human Control
- [ ] ทุก action มี Risk Tier
- [ ] Tier 3–4 ใช้ exact preview และ explicit approval
- [ ] approval ผูกกับ payload/version
- [ ] มี rate/batch/spend limits, timeout, rollback และ kill switch ตามความเสี่ยง

### Transparency & Operations
- [ ] ทุก run มี ID, version, source refs, validation และสถานะที่ถูกต้อง
- [ ] logs ไม่เก็บ secret หรือข้อมูลเกินจำเป็น
- [ ] แยก success, partial, failed และ rolled_back
- [ ] rollout, monitoring, incident drill และ periodic review ผ่านเกณฑ์

> **ระบบเสร็จเมื่อผลลัพธ์จริงผ่านเกณฑ์และตรวจย้อนหลังได้ ไม่ใช่เมื่อ workflow รันจบโดยไม่มี error**

---

# แหล่งอ้างอิงและขอบเขตข้อเท็จจริง

1. **วิดีโอต้นทางของ Nate Herk — ที่มาของคำช่วยจำ VAULT**<br>
   https://www.youtube.com/watch?v=ZzHsJW10iq4
2. **Goldman Sachs — กระบวนการที่ตรวจสอบได้และผลลัพธ์ที่พิสูจน์ได้**<br>
   https://www.goldmansachs.com/insights/articles/what-will-it-take-for-companies-to-capitalize-on-the-rise-of-ai
3. **Goldman Sachs — Five Questions with Marco Argenti: Build with purpose, human guidance, transparency**<br>
   https://www.goldmansachs.com/careers/blog/five-questions-with-marco-argenti
4. **Goldman Sachs — Marco Argenti: miscommunication, hallucination และ humans in the loop**<br>
   https://www.goldmansachs.com/insights/articles/fortune-we-must-prepare-ai-natives-to-shape-the-future-of-work
5. **Goldman Sachs — safety, accuracy, controls, transparency และ governance**<br>
   https://www.goldmansachs.com/insights/articles/a-new-generation-of-ai-tools-and-models-is-emerging
6. **NIST AI 600-1 — Artificial Intelligence Risk Management Framework: Generative AI Profile**<br>
   https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
7. **NIST AI 100-1 — Artificial Intelligence Risk Management Framework 1.0**<br>
   https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf
8. **Microsoft Learn — Agent workflows และความต่างจาก deterministic workflows**<br>
   https://learn.microsoft.com/en-us/azure/logic-apps/agent-workflows-concepts

## หมายเหตุการใช้แหล่ง

- แหล่ง Goldman ใช้ยืนยันแนวคิดที่ระบุโดยตรง ไม่ได้ใช้ยืนยันว่า VAULT เป็นกรอบทางการ
- NIST และ Microsoft ใช้ขยายหลักการบริหารความเสี่ยง การวัดผล และการแยก deterministic/agentic workflow
- เรื่องเล่า ตัวเลขความเสียหาย ประสบการณ์ภายใน และข้อกล่าวอ้างที่ไม่มีแหล่งอิสระจากบทถอดเสียงไม่นำมาใช้เป็นข้อเท็จจริง
- ก่อนใช้กับกฎหมาย การเงิน สุขภาพ ความปลอดภัย หรือข้อมูลอ่อนไหว ต้องเพิ่มข้อกำหนดเฉพาะสาขาและให้ผู้เชี่ยวชาญที่มีอำนาจรับผิดชอบตรวจทาน
