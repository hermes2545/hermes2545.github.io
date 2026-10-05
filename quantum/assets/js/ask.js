/**
 * ask.js — AskPanel + FAB (§6, §9.4, §9.5, §E.1/E.3 ของสัญญาระหว่างโมดูล)
 * อ่าน SSE จาก /api/ask ตามรูปแบบ §B.1 (meta/delta/done/error) — ห้าม retry อัตโนมัติ ห้ามเรียก API ตอนโหลดหน้า
 * บับเบิล "กำลังคิด…" เอียง เปลี่ยนเป็นตัวปกติเมื่อเริ่มมี delta / จบ stream, busy flag กันส่งซ้ำ
 */

import { getPageData, readJSON, writeJSON, turnsKey, streamSSE, formatThousands } from './components.js';
import * as byok from './byok.js';

/* คำถามแนะนำเมื่ออยู่หน้าที่ไม่มีบทเฉพาะ (shelf/book/glossary) — คัดลอกจาก SUGG.home ของ prototype-artifact.html
   เนื่องจาก PageData (§D.7) มี suggestions ให้เฉพาะ page=chapter|soon เท่านั้น หน้าอื่นสัญญาระบุให้ใช้ชุดนี้ตรงๆ */
const HOME_SUGGESTIONS = [
  'หนังสือเล่มนี้ต่างจากหนังสือธรรมะทั่วไปยังไง',
  'ต้องเชื่อพุทธก่อนไหมถึงจะอ่านได้',
  'ควรอ่านบทไหนก่อนถ้ามีเวลาน้อย',
];

let pageData = null;
let bookSlug = null;
let chapterSlug = null;
let turns = [];
let busy = false;

let elFab = null;
let elAsk = null;
let elClose = null;
let elLog = null;
let elSugg = null;
let elForm = null;
let elInput = null;
let elSubmitBtn = null;

function addMsg(cls, text) {
  const d = document.createElement('div');
  d.className = 'msg ' + cls;
  d.textContent = text; // ห้าม innerHTML เด็ดขาด (ข้อความจากผู้ช่วย/ผู้ใช้ไม่ใช่ HTML ที่เชื่อถือได้)
  elLog.appendChild(d);
  scrollLog();
  return d;
}

function scrollLog() {
  elLog.scrollTop = elLog.scrollHeight;
}

function renderHistory() {
  elLog.innerHTML = '';
  turns.forEach((t) => {
    if (t && (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string') {
      addMsg(t.role === 'user' ? 'u' : 'a', t.content);
    }
  });
}

function renderSuggestions() {
  let list;
  const page = pageData.page;
  if ((page === 'chapter' || page === 'soon') && pageData.chapter) {
    const s = pageData.chapter.suggestions || [];
    list = page === 'soon' ? s.slice(0, 2) : s.slice(0, 3);
  } else {
    list = HOME_SUGGESTIONS;
  }
  elSugg.innerHTML = '';
  list.forEach((q) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = q;
    elSugg.appendChild(btn);
  });
}

function setBusy(v) {
  busy = v;
  if (elSubmitBtn) elSubmitBtn.disabled = v;
}

function isByok() {
  return !!(pageData.api && !pageData.api.ask && pageData.api.data);
}

/** ฟอร์มใส่ API key ของผู้อ่าน — สร้างด้วย DOM ล้วน ไม่ใช้ innerHTML */
function showKeyForm(pendingQuestion) {
  const old = document.getElementById('keyform');
  if (old) old.remove();
  const box = document.createElement('form');
  box.className = 'msg a keyform';
  box.id = 'keyform';

  const p1 = document.createElement('p');
  p1.textContent =
    'ผู้ช่วยนี้ใช้ API key ของ Anthropic ของคุณเอง ค่าใช้งานเรียกเก็บจากบัญชีของคุณ ' +
    'ประมาณ 0.1–0.3 ดอลลาร์ต่อคำถามแรกของแต่ละหน้า คำถามต่อเนื่องถูกกว่ามาก';
  const p2 = document.createElement('p');
  p2.textContent =
    'key เก็บไว้ในเบราว์เซอร์นี้เท่านั้น และส่งตรงไปที่ api.anthropic.com ไม่ผ่านเซิร์ฟเวอร์ของเว็บนี้ ' +
    'แนะนำให้สร้าง key แยกไว้ใช้กับเว็บนี้และตั้งวงเงินไว้';
  const link = document.createElement('a');
  link.href = 'https://console.anthropic.com/settings/keys';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'สร้าง key ที่ console.anthropic.com';

  const input = document.createElement('input');
  input.type = 'password';
  input.placeholder = 'วาง API key ที่นี่';
  input.autocomplete = 'off';
  input.required = true;
  input.setAttribute('aria-label', 'API key ของ Anthropic');

  const model = document.createElement('select');
  model.setAttribute('aria-label', 'โมเดล');
  byok.MODELS.forEach((m) => {
    const o = document.createElement('option');
    o.value = m.id;
    o.textContent = m.label;
    if (m.id === byok.getModel()) o.selected = true;
    model.appendChild(o);
  });

  const rememberLabel = document.createElement('label');
  const remember = document.createElement('input');
  remember.type = 'checkbox';
  rememberLabel.appendChild(remember);
  rememberLabel.appendChild(document.createTextNode(' จำไว้ในเครื่องนี้ (ไม่ติ๊ก = ลืมเมื่อปิดแท็บ)'));

  const save = document.createElement('button');
  save.type = 'submit';
  save.textContent = 'บันทึกแล้วถาม';

  [p1, p2, link, input, model, rememberLabel, save].forEach((el) => box.appendChild(el));
  box.addEventListener('submit', (e) => {
    e.preventDefault();
    const key = input.value.trim();
    if (!key) return;
    byok.setKey(key, remember.checked);
    byok.setModel(model.value);
    box.remove();
    renderKeyNote();
    if (pendingQuestion) {
      // คำถามถูกแสดงไปแล้วตอนกดส่ง ลบบับเบิลเดิมออกก่อนส่งใหม่ จะได้ไม่ซ้ำ
      const last = elLog.querySelector('.msg.u:last-of-type');
      if (last && last.textContent === pendingQuestion) last.remove();
      send(pendingQuestion);
    }
  });
  elLog.appendChild(box);
  // เลื่อนให้เห็นหัวฟอร์ม (ย่อหน้าค่าใช้จ่าย) ก่อน ไม่ใช่ท้ายฟอร์ม — ผู้อ่านต้องรู้ว่าใครจ่ายก่อนใส่ key
  elLog.scrollTop = box.offsetTop - elLog.offsetTop - 8;
  input.focus({ preventScroll: true });
}

/** แถบหมายเหตุใต้แชต: โหมด byok บอกว่าใช้ key ของใคร พร้อมปุ่มเปลี่ยน/ลบ key */
function renderKeyNote() {
  const note = elAsk.querySelector('.note');
  if (!note || !isByok()) return;
  note.textContent = 'ผู้ช่วยตอบจากเนื้อหาในหนังสือ โดยใช้ API key ของคุณเอง · ';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'linkbtn';
  if (byok.getKey()) {
    btn.textContent = 'ลบ key ออกจากเครื่องนี้';
    btn.addEventListener('click', () => {
      byok.clearKey();
      renderKeyNote();
    });
  } else {
    btn.textContent = 'ใส่ key';
    btn.addEventListener('click', () => showKeyForm(null));
  }
  note.appendChild(btn);
}

export function open(prefill) {
  if (!elAsk) return;
  elAsk.hidden = false;
  if (elFab) elFab.hidden = true;
  if (prefill) {
    send(prefill);
  } else if (elInput) {
    elInput.focus();
  }
}

export function close() {
  if (!elAsk) return;
  elAsk.hidden = true;
  if (elFab) elFab.hidden = false;
}

/** ส่งคำถามเข้า /api/ask — busy flag กันกดซ้ำระหว่างรอ, ไม่มี retry อัตโนมัติเด็ดขาด (กฎ 7) */
export async function send(question) {
  if (busy) return;
  const q = String(question || '').trim();
  if (!q) return;

  const maxLen = (pageData.limits && pageData.limits.question) || 1000;
  if (q.length > maxLen) {
    addMsg('a', `คำถามยาวเกิน ${formatThousands(maxLen)} ตัวอักษร`);
    return;
  }

  addMsg('u', q);

  // build แบบ static (GitHub Pages) ไม่มี proxy — ผู้อ่านใช้ API key ของตัวเอง (byok.js)
  // ยังไม่มี key: แสดงฟอร์มใส่ key แล้วส่งคำถามนี้ต่อให้เองเมื่อบันทึก
  if (isByok() && !byok.getKey()) {
    showKeyForm(q);
    return;
  }

  const thinkEl = addMsg('a think', 'กำลังคิด…');
  setBusy(true);

  const requestTurns = turns.slice(-16).concat([{ role: 'user', content: q }]);
  let finalText = '';
  let streamOk = true;

  try {
    const body = { bookSlug, chapterSlug, turns: requestTurns };
    await (isByok() ? byok.stream.bind(null, 'ask') : streamSSE.bind(null, pageData.api.ask))(
      body,
      {
        onEvent(name, data) {
          if (name === 'delta' && data && typeof data.text === 'string') {
            finalText += data.text;
            thinkEl.className = 'msg a'; // ตัดตัวเอียงทิ้งทันทีที่เริ่มมีเนื้อความจริง
            thinkEl.textContent = finalText;
            scrollLog();
          } else if (name === 'error') {
            streamOk = false;
            if (finalText) {
              thinkEl.className = 'msg a';
              thinkEl.textContent = finalText;
            } else {
              thinkEl.remove();
            }
            addMsg('a err', (data && data.message) || 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง');
          }
          // event "meta"/"done" ไม่มีผลต่อ UI โดยตรงในเฟส 1 (meta คือ context ที่ proxy ใช้, done ปิด stream ปกติ)
        },
      }
    );
  } catch (err) {
    streamOk = false;
    const message = (err && err.message) || 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง';
    if (finalText) {
      thinkEl.className = 'msg a';
      thinkEl.textContent = finalText;
    } else {
      thinkEl.remove();
    }
    addMsg('a err', message);
  }

  if (streamOk && finalText) {
    turns.push({ role: 'user', content: q });
    turns.push({ role: 'assistant', content: finalText });
    if (turns.length > 40) turns = turns.slice(turns.length - 40);
    writeJSON(turnsKey(bookSlug), turns);
  }

  setBusy(false);
  scrollLog();
}

export function init() {
  pageData = getPageData();
  bookSlug = pageData.book ? pageData.book.slug : null;
  chapterSlug = pageData.chapter ? pageData.chapter.slug : null;

  elFab = document.getElementById('fab');
  elAsk = document.getElementById('ask');
  if (!elFab || !elAsk) return;
  elClose = document.getElementById('askclose');
  elLog = document.getElementById('asklog');
  elSugg = document.getElementById('asksugg');
  elForm = document.getElementById('askform');
  elInput = document.getElementById('askin');
  elSubmitBtn = elForm ? elForm.querySelector('button[type="submit"]') : null;

  turns = readJSON(turnsKey(bookSlug), []);
  if (!Array.isArray(turns)) turns = [];
  renderHistory();
  renderSuggestions();
  renderKeyNote();

  elFab.addEventListener('click', () => open());
  if (elClose) elClose.addEventListener('click', () => close());

  if (elForm) {
    elForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!elInput) return;
      const q = elInput.value.trim();
      if (!q) return;
      elInput.value = '';
      send(q);
    });
  }

  if (elSugg) {
    elSugg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) send(b.textContent);
    });
  }

  // ".qlist button" ปรากฏได้หลายจุดในหน้า (คำถามท้ายบท, หน้ารอสร้าง) — ผูก event รวมที่ document ตาม §E.3
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.qlist button');
    if (b) open(b.textContent);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elAsk.hidden) close();
  });
}
