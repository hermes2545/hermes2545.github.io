---
title: Gemini Live API — คู่มือสร้าง Voice Agent แบบ Real-Time
type: guide
status: draft
visibility: public
created: 2026-08-30
updated: 2026-08-30
sources: [Gemini Live API docs, YouTube episode pFc-HcUgFgY, cuppibla/live-dj]
tags: [gemini, live-api, voice-agent, realtime, ai]
---

# Gemini Live API: เอาไปทำอะไรได้บ้าง และต่างจากของเดิมยังไง

อ้างอิงจากเอกสาร Gemini Live API, วิดีโอที่หัวหน้าแนบมา, และโค้ดเดโม `live-dj` ค่ะ

## สรุปสั้น

Gemini Live API คือ API สำหรับทำ **ผู้ช่วยเสียง/วิดีโอแบบโต้ตอบสด** ไม่ใช่แค่รับข้อความแล้วค่อยแปลงเป็นเสียงทีหลัง โดยเอกสารระบุว่าเป็นการโต้ตอบแบบ **low-latency, real-time** รับสตรีม **เสียง + ภาพ + ข้อความ** ต่อเนื่อง และตอบกลับได้แบบใกล้เคียงการคุยจริงผ่าน **stateful WebSocket**.[1]

## เอาไปทำอะไรได้บ้าง

### 1) ทำ voice agent / call assistant
ใช้ทำบอทคุยเสียงที่ฟังผู้ใช้และตอบกลับแบบสดได้ เหมาะกับผู้ช่วยโทรศัพท์, call bot, customer support, concierge และงานที่ต้องคุยโต้ตอบต่อเนื่องค่ะ.[1]

### 2) ทำผู้ช่วยขาย / support / retail assistant
เอกสารยก use case ด้าน e-commerce และ retail โดยตรง เช่น ผู้ช่วยแนะนำสินค้า, ตอบคำถามลูกค้า, ช่วยปิดการขาย, หรือช่วยแก้ปัญหาเบื้องต้นค่ะ.[1]

### 3) ทำ live transcription / caption
ใช้ถอดเสียงสด ทำซับสด, voice dictation, meeting transcription, customer call logging ได้ เพราะเอกสารมีความสามารถด้าน **Live Transcription** โดยตรงค่ะ.[1]

### 4) ทำ live translation
ใช้แปลเสียงสดแบบคุยกันคนละภาษาได้ โดย docs ระบุ **real-time voice-to-voice translation** และรองรับ **70+ ภาษา** ค่ะ.[1]

### 5) ทำเกม / NPC / avatar / smart device
เหมาะกับตัวละครในเกม, NPC, assistant ในรถ, หุ่นยนต์, แว่นอัจฉริยะ หรืออุปกรณ์ที่ต้องสื่อสารด้วยเสียงและ/หรือวิดีโอแบบทันทีค่ะ.[1]

### 6) ทำ agent ที่ “ลงมือทำ” ได้ ไม่ใช่แค่พูด
Gemini Live รองรับ **tool use / function calling** ทำให้โมเดลคุยไปพร้อมกับสั่ง action ในระบบเราได้ เดโม `live-dj` ใช้จุดนี้ให้ผู้ช่วยเสียงสั่ง **เล่นเพลง, ข้ามเพลง, pause เพลง** ได้จริงค่ะ.[1][5][7][8]

### 7) ทำระบบที่ผู้ใช้พูดแทรกกลางคันได้
จุดเด่นคือทำ UX แบบ “คุยจริง” เช่นผู้ใช้พูดขัดกลางประโยคแล้วระบบหยุดเพื่อฟังใหม่ เหมาะกับงาน call assistant, in-car assistant, kiosk, และ conversational UI ค่ะ.[1][4][5]

## ต่างจาก “ของเดิม” ยังไง

จากคลิปนี้ เขาเทียบชัดกับ **TTS / AI voice แบบเดิม** ค่ะ

### 1) เดิมเป็นทางเดียว แต่ Live เป็นสองทาง
TTS ปกติคือ **ใส่ข้อความ → ได้เสียงกลับมา** เป็นทางเดียว แต่ Gemini Live เป็น **audio-to-audio สองทาง** คือรับเสียงผู้ใช้เป็นเสียงจริง และตอบกลับเป็นเสียงจริงค่ะ.[4]

### 2) เดิมต้องรอคำตอบเสร็จก่อน แต่ Live ตอบแบบสตรีม
Gemini Live สามารถ **เริ่มพูดได้ตั้งแต่ยังสร้างคำตอบไม่เสร็จ** ไม่ต้องรอ response เต็มก้อนก่อนค่อยเล่นเสียง จึงรู้สึกสดและลื่นกว่าระบบ voice แบบเดิมค่ะ.[1][4]

### 3) เดิม interrupt ยาก แต่ Live พูดแทรกได้
Live รองรับ **barge-in** คือผู้ใช้พูดแทรกกลางประโยคได้ แล้วโมเดลหยุดและฟังใหม่ คลิปกับ repo เดโมย้ำเรื่องนี้มากค่ะ.[1][4][5]

### 4) เดิมมักต้องประกอบหลายระบบเอง แต่ Live มีของสำคัญมาในตัว
เอกสารระบุฟีเจอร์สำคัญที่ช่วยให้ทำระบบเสียงสดง่ายขึ้น เช่น:[1]

- built-in **VAD** (voice activity detection)
- **audio transcriptions** ทั้งฝั่งผู้ใช้และโมเดล
- **tool use** / function calling
- **proactive audio**
- **affective dialog**

### 5) เดิมมักเป็น request/response แต่ Live เป็น session ค้างไว้
ระบบเรียก LLM ปกติมักถาม-ตอบเป็นรอบๆ แล้วจบ แต่ Live ใช้ **stateful WebSocket connection** ที่เปิดค้างไว้ เพื่อให้สตรีมเสียง/ภาพ/ข้อความต่อเนื่องสองทางได้ค่ะ.[1]

### 6) เดิมแค่ “พูด” แต่ Live เป็น “agent” ได้
ความต่างสำคัญคือไม่ใช่แค่ตอบเสียงเพราะๆ แต่เป็น **interactive live agent** ที่เรียก tool ไปทำงานในระบบจริงได้ เช่นในเดโม `live-dj` ค่ะ.[5][7][8]

## สิ่งที่คลิปสอน

จาก metadata และ subtitle ของคลิป วิดีโอนี้ตั้งใจสอน 3 เรื่องหลักค่ะ.[4]

1. **ทำไม live voice ต่างจาก AI voice / TTS แบบปกติ**
2. **สถาปัตยกรรมและ core loop** ของระบบ
3. **3 แนวคิดที่ทำให้ agent รู้สึกเหมือนมีชีวิต**

### ใจความสำคัญจากคลิป

- TTS คือ “พูดได้ แต่ฟังเราไม่ได้” ส่วน Gemini Live คือ **ฟังและพูดแบบสดทั้งสองทาง**.[4]
- มันจับ **tone, pauses, energy, และวิธีที่เราพูด** ได้ ไม่ได้อ่านแค่ข้อความล้วนค่ะ.[4]
- มัน **stream** คำตอบได้ จึงเริ่มพูดก่อนคำตอบจะสร้างเสร็จทั้งหมดค่ะ.[4]
- สถาปัตยกรรมพื้นฐานมี 3 ส่วน: **browser**, **Gemini Live**, และ **backend ขนาดเล็ก** ที่ถือ connection แล้วส่งผ่าน audio ค่ะ.[4]
- loop หลักมี 4 ขั้น: **open → send → receive → play**.[4][6][7]
- Gemini Live มี **VAD ในตัว** เพื่อรู้ว่าผู้ใช้เริ่มพูด/หยุดพูดตอนไหนค่ะ.[4]
- การ interrupt ให้รู้สึกไว ควร **หยุดเสียงฝั่ง client/local ทันที** ที่ไมค์จับว่าเราพูด ไม่ควรรอสัญญาณข้าม network ก่อนค่ะ.[4][5]
- ถ้าจะให้ agent “ทำอะไรได้” ต้องให้ **tools/functions** และระวังว่า **ถ้า tool ช้า เสียงจะเงียบระหว่างรอ** ค่ะ.[4][8]

## โค้ดเดโม `voicedemo1` คืออะไร

ลิงก์ `https://g.dev/cloud/voicedemo1` ตอนตรวจแล้ว redirect ไปที่ repo `cuppibla/live-dj` ค่ะ.[5]

repo นี้เป็นตัวอย่างสร้างผู้ช่วยเสียงชื่อ **Mira** ที่ทำตัวเหมือน DJ คุยกับผู้ใช้ เล่นเพลง ข้ามเพลง และโดนพูดแทรกได้ค่ะ.[5]

## โครงสร้างสำคัญใน repo

### `backend/raw_minimal.py`
ไฟล์นี้เป็นตัวอย่าง **primitive แบบสั้นมาก** ของ Live API แกนจริงมีแค่:

- เปิด live session
- ส่ง mic audio ขึ้นไป
- รับ audio กลับมา
- ส่งกลับไปเล่นใน browser

และกำหนด `response_modalities` เป็น `AUDIO` พร้อมใช้เสียง `Aoede` ค่ะ.[6]

### `backend/raw_server.py`
ไฟล์นี้คือเวอร์ชันเต็มของแอป โดยเพิ่ม:

- persona/system instruction ของ Mira
- input/output transcription
- tool declarations
- การจัดการ `interrupted`
- รับ function call แล้วส่ง tool response กลับเข้า session

พูดง่ายๆ คือ `raw_minimal.py` เป็นแกนสดๆ ส่วน `raw_server.py` คือแกนเดียวกันที่ต่อให้เป็นโปรดักต์เดโมใช้งานได้จริงขึ้นค่ะ.[7]

### `backend/tools.py`
ไฟล์นี้ประกาศ tools เช่น:

- `play_playlist`
- `play_track`
- `skip`
- `pause`

และมีข้อคิดสำคัญว่าใน live session นั้น **function calls เป็น synchronous** ถ้า tool ตอบช้า เสียง agent จะเงียบระหว่างรอ จึงควรให้ handler **return ให้ไวที่สุด** แล้วค่อยให้ฝั่งอื่นไปจัดการต่อค่ะ.[8]

## ข้อควรระวังจากเดโม

repo นี้มีจุดสอนที่สำคัญมาก 2 อย่างค่ะ

### 1) `session.receive()` เป็น per-turn async generator
ถ้าเขียนวนอ่านแค่ครั้งเดียว agent จะตอบได้แค่หนึ่งช่วงแล้วเงียบ ต้องมี `while True` ครอบเพื่อให้คุยต่อเนื่องทั้ง session ค่ะ.[5][6][7]

### 2) ต้องส่ง mic ผ่าน `send_realtime_input`
repo เตือนว่าถ้าส่งผิดวิธี เช่นใช้ `send_client_content` แทนในจุดที่ควรเป็น mic realtime โมเดลจะไม่ได้ยินเสียงแบบที่ต้องการค่ะ.[5]

## ถ้าหมายถึง “Gemini Live ในแอป” vs “Gemini Live API”

ถ้าตีความคำว่า “ของเดิม” ว่า Gemini Live ที่ผู้ใช้คุยในแอป Gemini ความต่างจะประมาณนี้ค่ะ

- **Gemini Live ในแอป** = ฟีเจอร์สำเร็จรูปสำหรับผู้ใช้ปลายทาง
- **Gemini Live API** = เครื่องมือให้นักพัฒนาเอาไปสร้างแอป/บริการของตัวเอง

ดังนั้น API ตัวนี้ไม่ได้แค่ให้เรา “ใช้ Live” แต่ให้เรา **สร้าง product ของเราเองบน primitive เดียวกัน** ค่ะ.[1][4]

## สรุปสุดท้าย

Gemini Live API เหมาะกับงานที่ต้องการ **การคุยด้วยเสียงแบบสดจริง**, **ตอบไว**, **พูดแทรกได้**, **ฟังน้ำเสียงได้**, และ **เรียก tools ไปลงมือทำงานต่อได้** ค่ะ.[1][4][5]

ถ้าเทียบกับ voice/TTS แบบเดิม ความต่างหลักคือ:

- เดิม: ข้อความ → เสียง, ทางเดียว
- Live: เสียง ↔ เสียง, สองทางแบบสด
- เดิม: รอคำตอบเสร็จก่อน
- Live: stream คำตอบได้
- เดิม: interrupt ยาก
- Live: barge-in ได้
- เดิม: มักเป็นแค่เสียงพูด
- Live: เป็น **agent** ที่ต่อ tool แล้วสั่งงานจริงได้

## Sources

[1] https://ai.google.dev/gemini-api/docs/live-api — Gemini Live API overview
[4] https://www.youtube.com/watch?v=pFc-HcUgFgY — YouTube episode
[5] https://github.com/cuppibla/live-dj — live-dj repo
[6] https://raw.githubusercontent.com/cuppibla/live-dj/main/backend/raw_minimal.py — raw_minimal.py
[7] https://raw.githubusercontent.com/cuppibla/live-dj/main/backend/raw_server.py — raw_server.py
[8] https://raw.githubusercontent.com/cuppibla/live-dj/main/backend/tools.py — tools.py
