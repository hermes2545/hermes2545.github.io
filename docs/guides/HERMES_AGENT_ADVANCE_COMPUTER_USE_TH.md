---
title: คู่มือ Hermes Agent Advance Computer Use
type: guide
status: active
visibility: public
language: th
created: 2026-08-27
updated: 2026-08-27
version: 1.0
sources:
  - https://hermes-agent.nousresearch.com/docs/user-guide/features/computer-use
  - https://hermes-agent.nousresearch.com/docs/reference/cli-commands
  - https://cua.ai/docs/explanation/the-no-foreground-contract
tags: [hermes-agent, computer-use, cua-driver, desktop-automation, public-guide]
---

# คู่มือ Hermes Agent Advance Computer Use

เอกสารนี้เป็นคู่มือเชิงลึกสำหรับการใช้ **Computer Use** กับ **Hermes Agent** เพื่อให้ Hermes ควบคุมเดสก์ท็อปจริงแบบ *background desktop control* บน **Windows, macOS, และ Linux** ได้อย่างเป็นระบบ เหมาะสำหรับเอาไปทำคู่มือใช้งานจริงต่อค่ะ

---

## 1) สรุปสั้นที่สุด

**Computer Use** ใน Hermes คือความสามารถที่ให้เอเจนต์:
- จับภาพหน้าจอหรือหน้าต่าง
- อ่าน accessibility tree
- คลิก / พิมพ์ / เลื่อน / ลาก / กดคีย์
- ทำงานกับแอปจริงบนเดสก์ท็อป
- โดย **ไม่ย้ายเมาส์จริงของผู้ใช้**, **ไม่แย่งโฟกัสคีย์บอร์ด**, และ **ไม่สลับ Space/virtual desktop** เป็นค่าเริ่มต้น

Hermes ทำสิ่งนี้ผ่าน toolset ชื่อ `computer_use` โดยคุยกับ backend ชื่อ **cua-driver** ซึ่งเป็นตัวทำงานระดับระบบปฏิบัติการให้ค่ะ [1][2]

จุดเด่นสำคัญ:
- ใช้ได้กับ **macOS / Windows / Linux** [1]
- ไม่ผูกกับ Anthropic schema แบบเฉพาะเจ้า แต่ทำงานกับ **tool-capable model** ทั่วไป เช่น Claude, GPT, Gemini, หรือโมเดล vision ที่รัน local ได้ [1][2]
- เหมาะกับงานที่ต้องแตะ **แอปจริงของผู้ใช้** เช่น Finder/Explorer, Mail, native app, browser ที่ล็อกอินอยู่, หรือแอป GUI อื่น ๆ
- ถ้าเป็นงานเว็บล้วน ๆ มักควรใช้ `browser_*` ก่อน เพราะเสถียรกว่าและไม่ต้องชนข้อจำกัดของ OS desktop [2][3]

---

## 2) Hermes Computer Use ทำงานอย่างไร

สถาปัตยกรรมโดยย่อ:

```text
ผู้ใช้ → Hermes Agent → toolset: computer_use → cua-driver → OS accessibility + input stack
```

Hermes ใช้ `computer_use` เป็นชั้น abstraction ส่วน backend ที่คุยกับระบบจริงคือ `cua-driver` [1][2]

### 2.1 กลไกระดับ OS

| OS | Accessibility tree | วิธีส่ง input |
|---|---|---|
| macOS | AX | SkyLight/CoreGraphics แบบ pid-scoped, ไม่ warp cursor [1] |
| Windows | UI Automation (UIA) | `SendInput` + `PostMessage` และเส้นทางที่เหมาะกับ target [1][8] |
| Linux | AT-SPI | X11: XTest/XSendEvent, Wayland: virtual keyboard/AT-SPI ตามข้อจำกัด compositor [1][10] |

สิ่งสำคัญคือ **Hermes ไม่ได้แค่ดูภาพอย่างเดียว** แต่ใช้ทั้ง:
1. **ภาพหน้าจอ**
2. **accessibility tree**
3. **action policy** ที่พยายามทำแบบ background ก่อน

นี่คือหัวใจของแนวคิดที่ Cua เรียกว่า **best-effort background** หรือ **no-foreground contract** ค่ะ [4]

---

## 3) แนวคิดสำคัญ: Best-effort background / no-foreground contract

ค่าเริ่มต้นของ Computer Use คือพยายามทำงานแบบ:
- ไม่เอาหน้าต่างขึ้นหน้า
- ไม่ย้ายเมาส์จริง
- ไม่ดึง focus จากแอปที่ผู้ใช้กำลังใช้อยู่

แต่คำว่า *best-effort* แปลว่า **ทำได้เกือบตลอด ไม่ใช่ 100% ทุกแอปทุกสถานการณ์** เพราะบางแอปหรือบาง surface ของ OS รับ input ได้เฉพาะตอนอยู่ foreground เท่านั้น [4]

ลำดับการทำงานที่ปลอดภัยที่สุดคือ [4][2]:
1. ทำผ่าน **element index** ใน background
2. ถ้ายืนยันผลไม่ได้หรือ element path ใช้ไม่ได้ ให้ลองแบบ **pixel / coordinate**
3. ถ้ายังไม่สำเร็จ ให้ **escalate เฉพาะ action นั้น** ไปเป็น `foreground`

ข้อคิดสำคัญ:
- **foreground ไม่ใช่ค่าเริ่มต้น**
- ควรใช้เมื่อ driver ส่งสัญญาณว่าจำเป็นจริง
- อย่าเดาว่าแอปไหนต้อง foreground ตั้งแต่แรก

---

## 4) เมื่อไรควรใช้ Computer Use และเมื่อไรไม่ควรใช้

### เหมาะกับ
- คุม native app จริง เช่น Mail, Finder, Explorer, Notes, Settings, desktop app ต่าง ๆ [2]
- งานที่ต้องแตะ browser profile จริงของผู้ใช้ หรือหน้าต่าง browser ที่เปิดอยู่ [1]
- งาน GUI ที่ browser automation ปกติทำไม่ได้ เช่น permission UI, native dialog, app ที่ไม่ใช่เว็บ [2]

### ไม่เหมาะกับ
- งานเว็บล้วน ๆ ที่ทำผ่าน headless browser ได้ → ใช้ `browser_*` จะดีกว่า [2][3]
- งานแก้ไฟล์ → ใช้ `read_file` / `write_file` / `patch` [2]
- งาน shell command → ใช้ `terminal` ไม่ใช่ `computer_use(action='type')` พิมพ์ลง Terminal [2]

---

## 5) การติดตั้ง Hermes สำหรับใช้งาน Computer Use

## 5.1 ติดตั้ง Hermes

### macOS / Linux / WSL2
```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (native)
```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

ตัว installer ของ Hermes จะติดตั้ง dependency หลักให้เอง และในเอกสารระบุชัดว่า installer รุ่นปัจจุบัน **pre-install `cua-driver` แบบ best-effort** ด้วย เว้นแต่จะเลือกข้ามด้วย `--skip-computer-use` หรือ `-SkipComputerUse` ค่ะ [1][5][7]

### Hermes Desktop
บน macOS/Windows มีตัวติดตั้ง Desktop ที่หน้าเว็บ Hermes และถ้าติดตั้ง CLI ไว้แล้วก็สั่งเปิด desktop ได้ด้วย:

```bash
hermes desktop
```

Desktop app ใช้ **agent core เดียวกัน** กับ CLI/gateway/config/sessions/skills/memory ไม่ใช่คนละระบบค่ะ [6]

---

## 5.2 เปิดใช้ toolset `computer_use`

หลังติดตั้ง ให้เปิดใช้งาน toolset ด้วยหนึ่งในวิธีนี้:

### วิธี interactive
```bash
hermes tools
```
แล้วเลือก `Computer Use` [1][3]

### วิธีตรงด้วย CLI
```bash
hermes tools enable computer_use
```
ชื่อนี้ตรวจสอบได้จาก `hermes tools enable --help` และ `hermes tools list` บน CLI ปัจจุบันค่ะ

### ใช้เฉพาะ session นั้น
```bash
hermes -t computer_use chat
```
เอกสาร feature page แนะนำรูปแบบนี้ตรง ๆ สำหรับเริ่ม session ที่มี Computer Use เปิดอยู่ [1]

> หมายเหตุ: เอกสาร configuration/skill ของ Hermes ระบุว่า การเปลี่ยน toolset จะมีผลกับ **session ใหม่**; ถ้าเปิดใช้แล้วในบาง surface อาจต้องเริ่ม session ใหม่หรือ `/reset` ก่อนค่ะ [3]

---

## 5.3 คำสั่งจัดการ backend Computer Use

จาก CLI ปัจจุบันมี subcommand ดังนี้:

```bash
hermes computer-use install
hermes computer-use status
hermes computer-use doctor
hermes computer-use permissions   # macOS
```

รายละเอียดที่ตรวจสอบได้จาก `hermes computer-use --help`:
- `install` = ติดตั้งหรือ repair `cua-driver`
- `status` = เช็คว่าติดตั้งแล้วหรือยัง
- `doctor` = รัน health report ของ cua-driver
- `permissions` = เช็ค/ขอสิทธิ์บน macOS [local CLI verification]

ตัวอย่าง:
```bash
hermes computer-use status
hermes computer-use install
hermes computer-use doctor
```

ถ้าต้องการบังคับอัปเกรด driver:
```bash
hermes computer-use install --upgrade
```

---

## 6) การตั้งค่า prerequisite แยกตามระบบปฏิบัติการ

## 6.1 macOS

บน macOS ต้องให้สิทธิ์อย่างน้อย 2 อย่าง [1]:
- **Accessibility**
- **Screen Recording**

เอกสาร Hermes ระบุให้ grant กับ identity ที่ `hermes computer-use doctor` บอกไว้ โดยใน standard mode มักใช้ **CuaDriver.app** ส่วน bounded/unrestricted อาจใช้ identity ของ Hermes host แทน [1]

### คำสั่งช่วยบน macOS
```bash
hermes computer-use permissions status
hermes computer-use permissions grant
```

`grant` จะเปิด flow ขอสิทธิ์ให้กับ **CuaDriver** โดยตรงตาม help ของ CLI ปัจจุบันค่ะ

### เรื่องสำคัญบน macOS
- อย่าใช้ `open -a ...` หรือวิธี launch ที่ไป foreground แอป ถ้าโจทย์ต้องการ background control จริง ๆ — ฝั่ง Cua ถือว่านี่ผิด no-foreground contract [9]
- บาง surface เช่น SwiftUI บางกรณี, game/canvas หรือหน้าต่างบนอีก Space อาจอ่าน AX ได้ไม่ครบ หรือรับ routed input ไม่ดี ต้องใช้ fallback หรือยอม foreground เฉพาะ action [4][9]

---

## 6.2 Windows (native)

Hermes รองรับ Windows 10/11 แบบ native ไม่ต้องพึ่ง WSL เสมอไป [7]

### ติดตั้ง
```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```
หรือใช้ Hermes Desktop installer ก็ได้ [7]

### prerequisite ฝั่ง Computer Use
เอกสาร Hermes บอกว่า **ไม่มี permission พิเศษตอนติดตั้ง** แบบ macOS [1] แต่มีข้อจำกัดสำคัญ 3 เรื่อง:

#### 1) Session 0 เมื่อรันผ่าน SSH
ถ้าคุณ SSH เข้า Windows ด้วย OpenSSH, process จะอยู่ใน **Session 0** ซึ่งไม่มี interactive desktop ทำให้เครื่องมือพวก `EnumWindows`, UIA, screenshot/click กับหน้าต่างผู้ใช้ ใช้งานไม่ได้ [4][11]

อาการคือ:
- `list_windows` ได้ค่าว่าง
- จับภาพ/คลิกไม่เจอหน้าต่างของ user session

วิธีแก้ตาม Cua docs [11]:
1. จาก session แบบ RDP/console ที่เป็น interactive ให้รัน
   ```powershell
   cua-driver autostart enable
   cua-driver autostart kick
   ```
2. ตรวจสอบ
   ```powershell
   cua-driver status
   ```
3. ให้ฝั่ง SSH คุยกับ daemon ที่อยู่ session interactive นั้น

สำหรับคู่มือ Hermes ควรสรุปง่าย ๆ ว่า:
- **ถ้าจะคุม Windows desktop จริง ให้รัน Hermes ใน interactive session ของ Windows จะง่ายสุด**
- ถ้าจำเป็นต้องใช้ SSH ให้ทำตามรูปแบบ autostart daemon ของ Cua ค่ะ [1][11]

#### 2) Elevated / Administrator windows
บน Windows ถ้า Hermes รันเป็น process ปกติ (medium integrity) จะ **คุมหน้าต่างที่รันแบบ Administrator ไม่ได้ตามปกติ** เพราะโดนบล็อกด้วย **UIPI** [1]

อาการคือ:
- screenshot เห็นหน้าต่างได้
- แต่ `capture(mode='som')` อาจไม่มี element
- click ดูเหมือนสำเร็จแต่ไม่เกิดผล

ถ้าต้องคุมหน้าต่าง elevated จริง ๆ ต้องรัน Hermes เองใน context ที่มีสิทธิ์สูงพอค่ะ [1]

#### 3) Native Windows vs WSL2
Hermes docs แนะนำว่า native Windows ใช้ได้ดีสำหรับ interactive chat, gateway, browser tool, MCP และฟีเจอร์ส่วนใหญ่ [7][12] ส่วน WSL2 เหมาะเมื่อคุณต้องการโลก POSIX, terminal pane ใน dashboard, หรือ dev workflow ฝั่ง Linux มากกว่า [12]

สำหรับงาน **Computer Use ที่จะคุมแอป Windows จริง** คู่มือควรแนะนำว่า **native Windows ตรงกว่า** เพราะแอป Windows และ browser profile ของผู้ใช้อยู่ฝั่ง Windows เองค่ะ [7][12]

---

## 6.3 Linux

บน Linux prerequisite สำคัญที่สุดคือ **ต้องมี display server ที่เข้าถึงได้** [1]

Hermes ระบุว่า [1]:
- X11 → ต้องมี `DISPLAY`
- Wayland → ต้องมี `XDG_SESSION_TYPE=wayland`
- Wayland ต้องมี **XWayland bridge** สำหรับ capture
- AT-SPI ต้องเปิดใช้งาน (โดยปกติ desktop อย่าง GNOME/KDE/Xfce มักมีอยู่แล้ว)

### ถ้าเป็น headless Linux
เอกสาร Hermes ระบุว่า headless server ต้องมี Xvfb ก่อน เช่น [1]:
```bash
Xvfb :99 -screen 0 1920x1080x24
```

### ข้อแตกต่าง X11 vs Wayland
จาก Cua docs [10]:
- **X11**: เส้นทาง background ค่อนข้างสมบูรณ์กว่า ทั้ง capture, pixel action, window-addressed input
- **Wayland**: ปลอดภัยกว่าแต่จำกัด synthetic input มากกว่า โดยเฉพาะ raw keyboard shortcuts หรือ input ที่ไม่ผ่าน AT-SPI

สรุปแบบใช้งานจริง:
- ถ้าต้องการความนิ่งสุดสำหรับ GUI automation บน Linux → **X11 ง่ายกว่า**
- ถ้าใช้ Wayland อยู่แล้ว งานที่เป็น element/action ผ่าน accessibility ยังไปได้ดี แต่ shortcut/raw key บางแบบอาจตัน ต้อง foreground หรือมี compositor path เพิ่ม [4][10]

---

## 7) Workflow มาตรฐานของ Hermes Computer Use

นี่คือ workflow ที่ควรสอนในคู่มือ เพราะทั้ง skill และ docs ใช้แนวนี้ตรงกัน [1][2][4]

## 7.1 Step 1: Capture ก่อนเสมอ

```python
computer_use(action="capture", mode="som", app="Chrome")
```

`mode="som"` จะได้:
- screenshot
- overlay หมายเลขบน element ที่กดได้
- accessibility tree index

นี่เป็นค่าเริ่มต้นที่ดีที่สุดค่ะ [2]

### capture mode ที่สำคัญ
| mode | ใช้เมื่อไร |
|---|---|
| `som` | โหมดหลัก เห็นทั้งภาพและหมายเลข element [2] |
| `vision` | อยากดูภาพล้วน ๆ ไม่ให้ overlay บัง [2] |
| `ax` | ใช้ tree อย่างเดียว เหมาะกับ text-only model หรืออยากลดการพึ่งภาพ [2] |

---

## 7.2 Step 2: คลิกด้วย element index ก่อน coordinate

```python
computer_use(action="click", element=14)
```

เหตุผล:
- เสถียรกว่า coordinate มาก
- ลดโอกาสคลิกพลาด
- เข้ากับ accessibility path ที่ driver ยืนยันผลได้ดีกว่า [2][4]

ใช้ coordinate เมื่อ:
- element หาไม่เจอ
- tree ว่างหรือ degraded
- driver แนะนำให้เปลี่ยน rung [2][10]

---

## 7.3 Step 3: หลัง action ให้ verify

หลังคลิก/พิมพ์/ลาก/กดคีย์ ควร capture ใหม่ หรือใช้ `capture_after=true` ใน action เดียว [2]

ตัวอย่าง:
```python
computer_use(action="click", element=14, capture_after=True)
```

---

## 7.4 Step 4: อ่านผลของ action อย่างมีวินัย

Hermes/Cua จะส่ง verdict พวกนี้กลับมา [2]:
- `effect: "confirmed"` = driver ยืนยันผลได้แล้ว
- `effect: "unverifiable"` = ส่ง input แล้ว แต่ให้ capture/check state ใหม่ก่อนสรุป
- `effect: "suspected_noop"` = น่าจะไม่เกิดอะไรขึ้น
- `code: "background_unavailable"` = background path ใช้ไม่ได้กับ action/target นี้

และอาจมี:
- `escalation.recommended: "px"`
- `escalation.recommended: "page"`
- `escalation.recommended: "foreground"`

นี่คือหัวใจของการใช้ Computer Use ให้ถูก ไม่ใช่คลิกซ้ำมั่ว ๆ ค่ะ [2][4][8][10]

---

## 8) Verify → Escalate ladder ที่ควรสอนในคู่มือ

ลำดับที่แนะนำ:

### ระดับ 1: background + element
```python
computer_use(action="click", element=7)
```

### ระดับ 2: ถ้า `unverifiable`
- capture ใหม่
- ดูสภาพล่าสุดก่อน
- อย่าเพิ่ง retry เดิมอัตโนมัติ [2]

### ระดับ 3: ถ้า `suspected_noop` หรือ driver แนะนำ `px`
```python
computer_use(action="click", coordinate=[x, y])
```

### ระดับ 4: ถ้า driver แนะนำ `page`
ให้ใช้ typed browser rung (`cua_browser_*`) แทนการไป foreground ทันที เมื่อเป็น browser page content และ binding exact พิสูจน์ได้ [2]

### ระดับ 5: foreground เฉพาะ action นั้น
```python
computer_use(action="click", element=7, delivery_mode="foreground")
```

หลักจำง่าย:
- **background-first**
- **escalate only when signaled**
- **verify after mutation**

---

## 9) Typed browser rung: กรณี browser page ที่ต้องแม่นกว่า native click

Hermes มีทางแยกพิเศษสำหรับ browser page content ผ่าน action ตระกูล `cua_browser_*` ภายใน `computer_use` [2]

ใช้เมื่อ:
- target เป็น page content ใน browser ที่รองรับ
- driver แนะนำ `page`
- หรือคุณต้องการ semantic ref ที่ผูกกับ DOM/page state โดยตรง

แนวทางย่อ [2]:
1. bind browser state ด้วย `(pid, window_id)` ให้ได้ exact
2. ตรวจ `binding_quality="exact"` และ `mutation_allowed=true`
3. เอา `tab_id`
4. ขอ snapshot ใหม่
5. ใช้ ref ล่าสุดเท่านั้น
6. หลังทุก mutation ต้อง refresh state ใหม่

ข้อดี:
- แม่นกว่าคลิกแบบ native กับ page content บางชนิด
- เหมาะกับ browser จริงของผู้ใช้ในกรณีที่ headless browser ใช้ไม่ได้

ข้อควรจำ:
- สำหรับ **browser chrome / permission UI / native dialog / OS prompt** ยังต้องใช้ native path อยู่ดี [2]

---

## 10) การแนบกับ browser profile ที่ล็อกอินอยู่แล้ว

Hermes docs มีประเด็นสำคัญมากเรื่องนี้ [1][13]:
- เอเจนต์สามารถไปขับ Chrome/Edge ที่เปิดอยู่แล้วได้
- รวมถึง profile ที่ล็อกอินอยู่จริง
- แต่เพราะสิ่งนี้เปิดทางให้เข้าถึง cookie / storage / live pages ได้ จึงต้องมี **explicit launch grant**

การ opt-in ฝั่ง Hermes คือเปิดค่า `computer_use.grant_existing_profile` ตัวอย่างเช่น:

```bash
hermes config set computer_use.grant_existing_profile true
```

เชิงแนวคิดค่าที่ต้องการคือ:

```yaml
computer_use:
  grant_existing_profile: true
```

ถ้าไม่เปิด ค่า default คือ **fail closed** สำหรับ existing-profile attach [1]

นี่เป็นหัวข้อที่ควรเขียนไว้ในคู่มือแบบชัดมาก เพราะหลายคนจะคิดว่า “YOLO แล้วแปลว่าแนบ profile ได้เลย” แต่เอกสารระบุว่า **YOLO ไม่ได้แทน explicit existing-profile grant** ค่ะ [1]

---

## 11) Permission modes: standard / bounded / unrestricted

Hermes map approval ของตัวเองไปยัง permission modes ของ cua-driver [1][13]

| โหมด Hermes/Cua | ใช้เมื่อไร | พฤติกรรม |
|---|---|---|
| `standard` | ใช้งานทั่วไป | อนุญาตงาน routine ส่วนใหญ่ แต่ boundary สำคัญยังต้อง grant ตอน launch [1][13] |
| `bounded` | งาน unattended / cron / automation ซ้ำ ๆ | ต้องมี capability manifest และนอก scope จะ fail closed [1][13] |
| `unrestricted` | sandbox/เครื่องที่ยอมรับความเสี่ยงเต็ม | bypass approval ของ Cua หลัง acknowledge ความเสี่ยง [1][13] |

### ตัวอย่าง bounded mode ใน Hermes
ตั้งค่าด้วยคำสั่งจะปลอดภัยกว่า เช่น:
```bash
hermes config set computer_use.permission_mode bounded
hermes config set computer_use.capability_manifest ~/.hermes/cua-manifest.yaml
```

เชิงแนวคิดค่าที่ได้คือ:
```yaml
computer_use:
  permission_mode: bounded
  capability_manifest: ~/.hermes/cua-manifest.yaml
```

### ตัวอย่าง config พื้นฐาน
```bash
hermes config set computer_use.permission_mode standard
hermes config set computer_use.grant_existing_profile false
```

เชิงแนวคิด:
```yaml
computer_use:
  permission_mode: standard
  capability_manifest: ""
  grant_existing_profile: false
```

### คำแนะนำเชิงคู่มือ
- ผู้ใช้ทั่วไป: เริ่มที่ `standard`
- งาน cron/agent อัตโนมัติที่ต้องคุมขอบเขตชัด: `bounded`
- งานทดลองใน VM หรือเครื่อง disposable: ค่อยพิจารณา `unrestricted`

> เอกสาร Cua เตือนชัดว่า unrestricted ไม่ป้องกัน prompt injection หรือ unintended model actions ค่ะ [1][13]

---

## 12) ตัวอย่างการใช้งานจริง

## 12.1 ค้นหาอีเมลในแอป Mail

ตัวอย่าง pattern ที่ docs ให้ไว้ [1]:
1. `capture` แอป Mail
2. `click` ช่องค้นหา
3. `type` คำค้น
4. `key: return`
5. คลิกผลลัพธ์แรก
6. อ่านและสรุป

รูปแบบนี้ใช้ได้เหมือนกันกับ Outlook, Notes, Finder/Explorer, browser search ในระบบจริงค่ะ

## 12.2 เปิด browser แล้วทำงานในเว็บที่ล็อกอินอยู่

แนวทางที่แนะนำ:
1. ถ้าเว็บล้วนและไม่ต้องใช้ profile จริง → ใช้ `browser_*`
2. ถ้าต้องใช้ browser จริงของผู้ใช้ → ใช้ `computer_use`
3. ถ้าเป็น page content และ driver แนะนำ → สลับไป `cua_browser_*`
4. ถ้าไปเจอ native dialog/permission UI → กลับมา native `computer_use`

## 12.3 ส่ง screenshot จริงกลับผู้ใช้

Computer Use สามารถมีไฟล์ screenshot ที่ส่งกลับผ่านช่องทางอย่าง Telegram/Discord/Desktop ได้เมื่อผู้ใช้ร้องขอ [1][2]

เหมาะกับ use case เช่น:
- “ส่งภาพหน้าจอปัจจุบันมาให้ดูหน่อย”
- “แคปสิ่งที่ Hermes กำลังเห็นให้หน่อย”

---

## 13) ความต่างระหว่าง Windows / macOS / Linux แบบใช้งานจริง

| หัวข้อ | macOS | Windows | Linux |
|---|---|---|---|
| สิทธิ์เริ่มต้น | ต้องให้ Accessibility + Screen Recording [1] | ไม่มี permission แบบเดียวกับ macOS [1] | ต้องมี display server/AT-SPI [1] |
| ปัญหายอดฮิต | TCC/permission, Space, custom canvas [1][9] | Session 0 ผ่าน SSH, UIPI, admin windows [1][11] | X11/Wayland ต่างกันมาก, headless ต้อง Xvfb [1][10] |
| background maturity | ดีมาก | ดีมาก แต่ติด integrity/session boundary | X11 ดี, Wayland มีข้อจำกัดเพิ่ม [4][8][10] |
| browser profile จริง | ทำได้ แต่ต้อง explicit grant [1][13] | ทำได้ แต่ต้องระวัง session/integrity | ทำได้ แต่ environment display/browser ต้องพร้อม |
| เหมาะกับงาน unattended | ได้ ถ้าจัดการ permission/manifest ดี | ได้ แต่ต้องระวัง session desktop | ได้ โดยเฉพาะ X11/VM/local desktop |

---

## 14) Troubleshooting ที่ควรอยู่ในคู่มือ

## 14.1 ใช้คำสั่งนี้ก่อนเสมอ
```bash
hermes computer-use doctor
```

นี่คือ first triage stop ที่ Hermes docs แนะนำชัดที่สุด [1]

### exit code
- `0` = ok
- `1` = degraded / failed
- `2` = หา `cua-driver` ไม่เจอหรือเรียกไม่ได้ [1]

### flags ที่ useful
```bash
hermes computer-use doctor --json
hermes computer-use doctor --include tcc_accessibility
hermes computer-use doctor --skip bundle_identity
```

---

## 14.2 ปัญหายอดนิยม

### macOS: กดไม่ไป / capture ได้แต่ action เพี้ยน
เช็ค:
- Accessibility granted หรือยัง
- Screen Recording granted หรือยัง
- grant ถูกผูกกับ identity ที่ doctor บอกหรือเปล่า [1]

### Windows: หา window ไม่เจอเลยตอน SSH
เช็ค Session 0 ก่อนเลย [11]
- รันใน interactive session แทน
- หรือใช้ `cua-driver autostart enable` + `kick` ตามเอกสาร Cua [11]

### Windows: เห็นหน้าต่างแต่คลิกไม่เกิดผล
เช็คว่าหน้าต่างนั้นรันแบบ Administrator หรือไม่ เพราะ UIPI อาจบล็อกอยู่ [1]

### Linux: capture/action ไม่ได้บน headless server
เช็ค display server และลอง Xvfb [1]

### Linux Wayland: shortcut หรือ raw key ไม่เข้า
เป็นข้อจำกัดของ native Wayland หลายกรณี ให้พยายามผ่าน AT-SPI ก่อน หรือใช้ foreground เฉพาะ action นั้นถ้าจำเป็น [4][10]

### element หาย / stale
capture ใหม่ก่อน เพราะ element index ใช้ได้กับ snapshot ล่าสุดเท่านั้น [2]

### background click ไม่เกิดผล
อย่าสรุปทันทีว่าใช้ไม่ได้ ให้ทำตาม ladder:
1. ดู verdict
2. capture ใหม่ถ้า `unverifiable`
3. ลอง coordinate ถ้า driver แนะนำ
4. ไป foreground เฉพาะ action เมื่อได้สัญญาณ [2][4][8][10]

---

## 15) Best practices สำหรับเขียนคู่มือหรือสอนทีม

### 15.1 สอน 3 หลักนี้ก่อน
1. **Capture first**
2. **Click by element, not coordinate**
3. **Verify → escalate, never guess**

### 15.2 แยก “web-only” ออกจาก “desktop-real”
- ถ้าเป็นเว็บล้วน ใช้ `browser_*`
- ถ้าต้องแตะแอปจริงหรือ browser จริงของผู้ใช้ ใช้ `computer_use`

### 15.3 ทำ runbook แยกตาม OS
เพราะ pain point ไม่เหมือนกันเลย:
- macOS → permission/TCC
- Windows → Session 0/UIPI
- Linux → display server/X11 vs Wayland

### 15.4 ทำ checklist ก่อนเปิดใช้ใน production
- Hermes ติดตั้งแล้ว
- `computer_use` toolset เปิดแล้ว
- `hermes computer-use status` ผ่าน
- `hermes computer-use doctor` ผ่าน
- permission/prereq ของ OS ครบ
- เข้าใจขอบเขต `standard` / `bounded` / `unrestricted`
- ถ้าจะใช้ browser profile จริง เปิด `grant_existing_profile` แบบตั้งใจ

---

## 16) ตัวอย่าง checklist พร้อมใช้งาน แยกตาม OS

## macOS checklist
- [ ] ติดตั้ง Hermes แล้ว
- [ ] เปิด `computer_use` toolset แล้ว
- [ ] `hermes computer-use status` ผ่าน
- [ ] `hermes computer-use permissions status` เช็คแล้ว
- [ ] ให้ Accessibility แล้ว
- [ ] ให้ Screen Recording แล้ว
- [ ] `hermes computer-use doctor` ผ่าน
- [ ] เข้าใจว่า app บางแบบอาจต้อง foreground เฉพาะ action

## Windows checklist
- [ ] ติดตั้ง Hermes native แล้ว
- [ ] เปิด `computer_use` toolset แล้ว
- [ ] `hermes computer-use status` ผ่าน
- [ ] ใช้งานจาก interactive session ไม่ใช่ Session 0
- [ ] ถ้าใช้ SSH ตั้งค่า Cua daemon ตาม windows-ssh guide แล้ว
- [ ] ไม่ได้พยายามคุมหน้าต่าง Administrator จาก Hermes ปกติ
- [ ] `hermes computer-use doctor` ผ่าน

## Linux checklist
- [ ] ติดตั้ง Hermes แล้ว
- [ ] เปิด `computer_use` toolset แล้ว
- [ ] `hermes computer-use status` ผ่าน
- [ ] มี `DISPLAY` หรือ `XDG_SESSION_TYPE=wayland`
- [ ] AT-SPI พร้อม
- [ ] ถ้า Wayland เข้าใจข้อจำกัดเรื่อง raw keyboard
- [ ] ถ้า headless มี Xvfb หรือ equivalent
- [ ] `hermes computer-use doctor` ผ่าน

---

## 17) คำแนะนำเชิงสถาปัตยกรรมสำหรับใช้งานจริง

ถ้าจะเอา Hermes Computer Use ไปทำงานจริงในองค์กรหรือระบบอัตโนมัติ ควรแยกเป็น 3 ระดับ:

### ระดับ A: ผู้ใช้ส่วนบุคคล
- ใช้ `standard`
- อนุมัติ action ตามปกติ
- คุมแอปจริงบนเครื่องตัวเอง

### ระดับ B: งานซ้ำ ๆ แบบควบคุมขอบเขต
- ใช้ `bounded`
- มี capability manifest
- ระบุ browser origin / app / file scope ให้ชัด
- เหมาะกับ recurring automation และ cron [1][13]

### ระดับ C: sandbox/VM สำหรับงานเสี่ยง
- ใช้ `unrestricted`
- ใช้กับ environment disposable เท่านั้น
- อย่าใช้กับเครื่องทำงานหลักหรือ browser profile สำคัญ ถ้าไม่ยอมรับความเสี่ยงเต็ม ๆ [1][13]

---

## 18) คำสั่งอ้างอิงที่ควรใส่ในภาคผนวก

### ติดตั้ง
```bash
# macOS / Linux / WSL2
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# Windows
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

### เปิดใช้ toolset
```bash
hermes tools
hermes tools enable computer_use
hermes -t computer_use chat
```

### ตรวจสถานะ
```bash
hermes computer-use status
hermes computer-use doctor
hermes computer-use doctor --json
```

### macOS permissions
```bash
hermes computer-use permissions status
hermes computer-use permissions grant
```

### อัปเกรด driver
```bash
hermes computer-use install --upgrade
```

### Linux headless example
```bash
Xvfb :99 -screen 0 1920x1080x24
```

### Windows SSH / interactive daemon (Cua side)
```powershell
cua-driver autostart enable
cua-driver autostart kick
cua-driver status
```

---

## 19) สรุปสุดท้าย

ถ้าจะสรุป Computer Use ของ Hermes ให้สั้นแต่ครบที่สุด:

1. **Hermes ใช้ `computer_use` toolset คุยกับ `cua-driver`** เพื่อควบคุมเดสก์ท็อปจริงแบบ background [1][2]
2. **ติดตั้ง Hermes แล้วเปิด toolset ให้ถูก**; installer ปัจจุบันมัก preinstall driver มาแล้ว [1][5]
3. **ใช้งานตาม workflow มาตรฐาน**: capture → element click → verify → escalate [2][4]
4. **macOS ติดเรื่อง permission**, **Windows ติดเรื่อง session/integrity**, **Linux ติดเรื่อง display/X11/Wayland** [1][4][10][11]
5. ถ้าจะใช้ browser profile จริงที่ล็อกอินอยู่ ต้อง **opt-in แบบ explicit** ไม่ใช่เปิด YOLO แล้วถือว่าได้เอง [1][13]
6. ถ้างานเป็นเว็บล้วน ให้คิดถึง `browser_*` ก่อน; ถ้างานเป็น desktop จริงหรือ native app ให้ใช้ `computer_use` [2][3]

พูดแบบบ้าน ๆ คือ:

> Hermes Computer Use เก่งตรงที่ “ช่วยทำงานบนคอมจริงของเรา โดยไม่แย่งคอมเราไปทั้งเครื่อง” ค่ะ

---

## Sources

[1] Hermes Agent docs — Computer Use
https://hermes-agent.nousresearch.com/docs/user-guide/features/computer-use

[2] Hermes bundled skill — `computer-use`
`skills/autonomous-ai-agents/computer-use/SKILL.md` (bundled skill content loaded locally)

[3] Hermes docs — Tools & Toolsets / Built-in Tools Reference / CLI references
https://hermes-agent.nousresearch.com/docs/user-guide/features/tools
https://hermes-agent.nousresearch.com/docs/reference/tools-reference
https://hermes-agent.nousresearch.com/docs/reference/cli-commands

[4] Cua docs — Best-effort background / no-foreground contract
https://cua.ai/docs/explanation/the-no-foreground-contract

[5] Hermes docs — Installation
https://hermes-agent.nousresearch.com/docs/getting-started/installation

[6] Hermes docs — Desktop
https://hermes-agent.nousresearch.com/docs/user-guide/desktop

[7] Hermes docs — Windows (Native) Guide
https://hermes-agent.nousresearch.com/docs/user-guide/windows-native

[8] Cua skill pack — Windows deep dive
`libs/cua-driver/rust/Skills/cua-driver/WINDOWS.md` in trycua/cua

[9] Cua skill pack — macOS deep dive
`libs/cua-driver/rust/Skills/cua-driver/MACOS.md` in trycua/cua

[10] Cua skill pack — Linux deep dive
`libs/cua-driver/rust/Skills/cua-driver/LINUX.md` in trycua/cua

[11] Cua docs — Drive a Windows app over SSH
https://cua.ai/docs/how-to-guides/driver/windows-ssh.md

[12] Hermes docs — Windows (WSL2) Guide
https://hermes-agent.nousresearch.com/docs/user-guide/windows-wsl-quickstart

[13] Cua docs — Permission modes
https://cua.ai/docs/reference/cua-driver/permission-modes.md

---

## Research method note

เอกสารนี้อ้างอิงจาก:
- official Hermes docs
- official Cua docs
- bundled Hermes skills ที่มากับระบบ
- การตรวจสอบคำสั่ง CLI จริงใน environment ปัจจุบัน เช่น `hermes --help`, `hermes computer-use --help`, `hermes computer-use doctor --help`, `hermes tools list`, และ `hermes computer-use status`

ดังนั้นคู่มือฉบับนี้ตั้งใจให้เป็น **practical + grounded** มากกว่าการสรุปจากความจำค่ะ
