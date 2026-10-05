/**
 * term-sheet.js — TermSheet (§6 ตาราง Interaction/state, §D.2, §E.1 ในสัญญาระหว่างโมดูล ที่นั่นตั้งชื่อไฟล์ว่า
 * "terms.js" แต่งานนี้มอบหมายให้เขียนที่ไฟล์ชื่อ term-sheet.js — คง export ชื่อเดียวกัน (init/open/close)
 * และมี web/src/js/terms.js เป็นไฟล์ re-export ชื่อตรงสัญญาให้ import ตามชื่อ §E.4/nav.js ได้จริง (แก้ตาม
 * code review major #5 — ไฟล์ชื่อ terms.js ขาดไปทำให้ import chain ของ nav.js/app.js resolve ไม่ได้)
 *
 * พฤติกรรม: กด <dfn data-term> เปิด bottom sheet ทันทีจากข้อมูลที่ฝังอยู่ใน #page-data แล้ว (ไม่มี network)
 * ปิดด้วยปุ่ม × / กดพื้นหลัง / Esc — ปุ่ม "ถามเพิ่มเกี่ยวกับคำนี้" ปิด sheet แล้วเปิด AskPanel พร้อมส่งคำถาม
 * อัตโนมัติตามข้อความคงที่ใน §6 / §J
 */

import { getPageData } from './components.js';
import { open as openAsk } from './ask.js';

let sheetEl = null;
let bgEl = null;
let kindEl = null;
let termEl = null;
let altEl = null;
let defEl = null;
let askBtn = null;
let closeBtn = null;
let lastFocused = null;
let termsCache = null;

function findTerm(term) {
  if (!termsCache) {
    try {
      termsCache = getPageData().terms || [];
    } catch (_e) {
      termsCache = [];
    }
  }
  return termsCache.find((t) => t && t.term === term) || null;
}

/** เปิด sheet ด้วยชื่อศัพท์ (ต้องอยู่ใน page-data.terms ของหน้านี้ ตามสัญญา A.2/A.3 — terms.py เป็นคนรับประกัน) */
export function open(term) {
  if (!sheetEl) return;
  const data = findTerm(term);
  if (!data) return; // ไม่ควรเกิดถ้า pipeline/validate.mjs ทำตามสัญญา แต่กันพลาดแบบเงียบๆ ดีกว่าโชว์ sheet ว่าง

  kindEl.textContent = 'ศัพท์' + data.kind;
  sheetEl.dataset.kind = data.kind;
  termEl.textContent = data.term;
  altEl.textContent = data.alt || '';
  altEl.hidden = !data.alt;
  defEl.textContent = data.def || '';
  askBtn.dataset.term = data.term;

  lastFocused = document.activeElement;
  bgEl.hidden = false;
  sheetEl.hidden = false;
  closeBtn.focus();
}

export function close() {
  if (!sheetEl || sheetEl.hidden) return;
  sheetEl.hidden = true;
  bgEl.hidden = true;
  if (lastFocused && typeof lastFocused.focus === 'function') {
    try {
      lastFocused.focus();
    } catch (_e) {
      /* element อาจถูกถอดออกจาก DOM ไปแล้ว เพิกเฉย */
    }
  }
  lastFocused = null;
}

export function init() {
  sheetEl = document.getElementById('sheet');
  bgEl = document.getElementById('sheetbg');
  if (!sheetEl || !bgEl) return; // หน้านี้ไม่มี partial sheet (ไม่ควรเกิดตาม D.2)
  kindEl = document.getElementById('sh-kind');
  termEl = document.getElementById('sh-term');
  altEl = document.getElementById('sh-alt');
  defEl = document.getElementById('sh-def');
  askBtn = document.getElementById('sh-ask');
  closeBtn = document.getElementById('sh-close');

  // ทำให้ <dfn> กดด้วยคีย์บอร์ดได้ (dfn ไม่ interactive โดยธรรมชาติ ต้องเติม role/tabindex เอง)
  document.querySelectorAll('dfn[data-term]').forEach((d) => {
    if (!d.hasAttribute('tabindex')) d.setAttribute('tabindex', '0');
    if (!d.hasAttribute('role')) d.setAttribute('role', 'button');
  });

  // คลิก: dfn ในเนื้อหา, .gloss-item ในหน้าศัพท์รวม, หรือพื้นหลัง sheet เพื่อปิด
  document.addEventListener('click', (e) => {
    const bg = e.target === bgEl;
    if (bg) {
      close();
      return;
    }
    const el = e.target.closest('dfn[data-term], .gloss-item[data-term]');
    if (el) open(el.dataset.term);
  });

  // คีย์บอร์ด: Esc ปิด sheet เสมอ, Enter/Space เปิด sheet เมื่อโฟกัสอยู่ที่ dfn
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    const dfnEl = e.target.closest('dfn[data-term]');
    if (dfnEl) {
      e.preventDefault();
      open(dfnEl.dataset.term);
    }
  });

  closeBtn.addEventListener('click', close);

  askBtn.addEventListener('click', () => {
    const term = askBtn.dataset.term;
    close();
    // ข้อความอัตโนมัติตรงตาม §6/§J — ต้องเรียกหลัง close() เพราะ AskPanel กับ TermSheet ซ้อนกันไม่ได้บนมือถือ
    openAsk(`ช่วยอธิบายคำว่า "${term}" ให้ละเอียดขึ้น พร้อมตัวอย่างในชีวิตประจำวัน`);
  });
}
