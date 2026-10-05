/**
 * exercise.js — ReflectExercise (§6, §9.5, §B.2, §E.1/E.3 ของสัญญาระหว่างโมดูล)
 * เปลี่ยนตัวเลือก (ชิป 4 ตัว) -> render 3 ขั้นใหม่ทันที ไม่มี animation (ข้อมูลอยู่ใน page-data แล้ว ไม่ต้อง network)
 * ปุ่ม "ให้ผู้ช่วยช่วยดู" -> ถ้า textarea ว่างแสดงข้อความชวนเขียนโดยไม่เรียก API, ไม่งั้น stream feedback จาก /api/feedback
 */

import { getPageData, streamSSE, formatThousands } from './components.js';
import * as byok from './byok.js';

let pageData = null;
let exercise = null;
let elPick = null;
let elSteps = null;
let feedbackBusy = false;

function renderSteps(idx) {
  const opt = exercise.options[idx];
  if (!opt) return;
  elSteps.innerHTML = '';
  (exercise.columns || []).forEach((col, k) => {
    const step = document.createElement('div');
    step.className = 'step';

    const lab = document.createElement('div');
    lab.className = 'lab';
    lab.textContent = col.label || '';
    const small = document.createElement('small');
    small.textContent = col.sub || '';
    lab.appendChild(small);

    const txt = document.createElement('div');
    txt.className = 'txt';
    txt.textContent = (opt.steps && opt.steps[k]) || '';

    step.appendChild(lab);
    step.appendChild(txt);
    elSteps.appendChild(step);
  });
}

function onPickClick(e) {
  const b = e.target.closest('button[data-i]');
  if (!b) return;
  const idx = Number(b.dataset.i);
  Array.from(elPick.querySelectorAll('button')).forEach((btn) => {
    btn.setAttribute('aria-pressed', btn === b ? 'true' : 'false');
  });
  renderSteps(idx); // ไม่มี animation ตามสัญญา §6 — สลับเนื้อหาทันที
}

async function handleFeedback(btn) {
  if (feedbackBusy) return;
  const taId = btn.dataset.aiFeedback;
  const ta = taId ? document.getElementById(taId) : null;
  const reflectBox = btn.closest('.reflect');
  const out = reflectBox ? reflectBox.querySelector('.feedback') : null;
  if (!ta || !out) return;

  const text = ta.value.trim();
  const maxLen = (pageData.limits && pageData.limits.reflection) || 2000;

  if (!text) {
    out.hidden = false;
    out.textContent = 'ลองเขียนสักสองสามบรรทัดก่อน แล้วค่อยกดให้ช่วยดู'; // ไม่เรียก API ตามสัญญา
    return;
  }
  if (text.length > maxLen) {
    out.hidden = false;
    out.textContent = `ข้อความยาวเกิน ${formatThousands(maxLen)} ตัวอักษร`;
    return;
  }

  const pressed = elPick ? elPick.querySelector('button[aria-pressed="true"]') : null;
  const option = pressed ? pressed.textContent : '';

  feedbackBusy = true;
  btn.disabled = true;
  out.hidden = false;
  out.textContent = 'กำลังอ่าน…';

  let finalText = '';
  try {
    const useByok = !pageData.api.feedback && pageData.api.data;
    if (useByok && !byok.getKey()) {
      out.textContent = 'ใส่ API key ของคุณที่ปุ่ม "ถามตรงนี้" ก่อน แล้วค่อยกดให้ช่วยดูอีกครั้ง';
      feedbackBusy = false;
      btn.disabled = false;
      return;
    }
    await (useByok ? byok.stream.bind(null, 'feedback') : streamSSE.bind(null, pageData.api.feedback))(
      {
        bookSlug: pageData.book ? pageData.book.slug : null,
        chapterSlug: pageData.chapter ? pageData.chapter.slug : null,
        option,
        text,
      },
      {
        onEvent(name, data) {
          if (name === 'delta' && data && typeof data.text === 'string') {
            finalText += data.text;
            out.textContent = finalText;
          } else if (name === 'error') {
            const msg = (data && data.message) || 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง';
            // เก็บข้อความที่ stream มาแล้วไว้ตามสัญญา §B.1 แทนที่จะลบทิ้งเวลา error กลางทาง
            out.textContent = finalText ? finalText + '\n\n' + msg : msg;
          }
        },
      }
    );
  } catch (err) {
    const msg = (err && err.message) || 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง';
    out.textContent = finalText ? finalText + '\n\n' + msg : msg;
  }

  feedbackBusy = false;
  btn.disabled = false;
}

export function init() {
  pageData = getPageData();
  const exerciseSection = document.getElementById('ex');
  exercise = pageData.chapter && pageData.chapter.exercise;
  elPick = document.getElementById('ex-pick');
  elSteps = document.getElementById('ex-steps');
  // หน้าที่ไม่มีแบบฝึก (เช่น soon) จะไม่มี element พวกนี้เลย — ไม่มีอะไรต้องทำ
  if (!exerciseSection || !exercise || !elPick || !elSteps) return;

  elPick.addEventListener('click', onPickClick);

  // ปุ่ม "ให้ผู้ช่วยช่วยดู" ผูกที่ document เผื่อมีมากกว่าหนึ่งจุดในอนาคต (ตอนนี้มีจุดเดียวต่อบท)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ai-feedback]');
    if (btn) handleFeedback(btn);
  });
}
