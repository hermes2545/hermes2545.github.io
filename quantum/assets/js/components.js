/**
 * components.js — ยูทิลิตี้กลางที่ใช้ร่วมกันในไฟล์ที่แพ็กเกจนี้ (web-js) เป็นเจ้าของ
 * (term-sheet.js, ask.js, exercise.js, progress.js, source-footer.js, interactives/particles.js)
 *
 * หมายเหตุ (แก้ตาม code review): สัญญาระหว่างโมดูล §E.1 ตั้งชื่อไฟล์ tokens.js / store.js / pagedata.js /
 * sse.js / canvas.js / terms.js ไว้ตายตัว — ห้ามเบี่ยง เนื้อจริงของฟังก์ชันเหล่านี้ยังคงรวมไว้ที่ไฟล์นี้
 * (คงชื่อ/ลายเซ็นตรงตามสัญญาทุกจุด) แต่ตอนนี้มีไฟล์ชื่อตรงสัญญาแยกอยู่แล้วที่ re-export จากที่นี่
 * (web/src/js/tokens.js, store.js, pagedata.js, sse.js, canvas.js, terms.js) เพื่อให้ import ตามชื่อสัญญา
 * เป๊ะๆ resolve ได้จริง — ดูไฟล์เหล่านั้นสำหรับรายละเอียด ไฟล์อื่นนอกเจ้าของยัง import จาก components.js
 * ตรงๆ ได้เหมือนเดิมเพราะเป็นแค่การอ่าน ไม่ใช่การแก้ไฟล์ที่ไม่ใช่ของตัวเอง
 */

/* ============================================================ */
/* tokens.js equivalent                                          */
/* ============================================================ */

/** อ่านค่า CSS custom property จาก element (ดีฟอลต์ = :root) ตามสัญญา §C — ห้ามมี hex ในโค้ด JS ที่ไหนเลย */
export function cssVar(name, el) {
  try {
    return getComputedStyle(el || document.documentElement).getPropertyValue(name).trim();
  } catch (_e) {
    return '';
  }
}

export function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_e) {
    return false;
  }
}

/* ============================================================ */
/* pagedata.js equivalent                                         */
/* ============================================================ */

let _pageDataCache = null;

/** parse #page-data ครั้งเดียวแล้ว cache (§D.7) — โยน Error ถ้าไม่พบ (ไม่ควรเกิดเพราะ layout.html ของ P4 ใส่มาให้ทุกหน้า) */
export function getPageData() {
  if (_pageDataCache) return _pageDataCache;
  const el = document.getElementById('page-data');
  if (!el) throw new Error('ไม่พบ #page-data ในหน้านี้');
  _pageDataCache = JSON.parse(el.textContent);
  return _pageDataCache;
}

/* ============================================================ */
/* store.js equivalent                                           */
/* ============================================================ */

export const PROGRESS_KEY = 'dsl.progress';

export function turnsKey(bookSlug) {
  return `dsl.turns.${bookSlug || '_shelf'}`;
}

/** อ่าน localStorage แบบปลอดภัย — private mode / quota เต็ม / ปิด storage ต้องไม่ทำหน้าเว็บพัง (§9.6) */
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (_e) {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_e) {
    return false;
  }
}

/* ============================================================ */
/* ตัวช่วย HTML: escape ข้อความ / กรองแท็กที่อนุญาต                 */
/* ============================================================ */

/** ใส่คอมมาคั่นหลักพัน — ใช้ประกอบข้อความ "…ยาวเกิน 1,000/2,000 ตัวอักษร" ให้ตรงตาม §J ทุกตัวอักษร
 *  (ไม่ใช้ Number.toLocaleString เพราะพฤติกรรมของตัวคั่นหลักพันต่างกันไปตาม locale ของเบราว์เซอร์ผู้ใช้) */
export function formatThousands(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function escapeHtml(s) {
  return String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * sanitizeInlineHtml — อนุญาตเฉพาะแท็กใน allowedTags (ดีฟอลต์ ['b']) ตัดแท็ก/attribute อื่นทิ้งหมด
 * แต่คงเนื้อความ (text) ไว้ ใช้กับ HTML ที่มาจาก config ของ interactive (เช่น particles lenses, zoom.q)
 * ซึ่งสัญญา §E.4/ความเสี่ยงข้อ 11 บังคับว่าต้องผ่าน allowlist เดียวกับ build.js (<b> เท่านั้น) ก่อน render
 * ด้วย innerHTML — ป้องกัน XSS ถ้าเนื้อหาจาก pipeline หลุด tag แปลกมา
 */
export function sanitizeInlineHtml(html, allowedTags) {
  const allowed = new Set((allowedTags || ['b']).map((t) => String(t).toLowerCase()));
  const src = String(html === null || html === undefined ? '' : html);
  // parse ใน <template> แทน <div> ปกติ — template.content เป็นเอกสาร inert (ไม่ผูกกับ document หลัก)
  // ดังนั้น element อย่าง <img>/<video>/<object> ที่หลุดเข้ามาจะไม่เริ่มโหลด resource หรือรัน handler ใดๆ
  // ก่อนถูก strip ทิ้ง (document.createElement('div') + innerHTML แบบเดิมไม่ inert — element ถูก parse
  // เข้าสู่ document ที่มีชีวิตทันที ทำให้ onerror/onload ของ <img src=x onerror=...> ยิงได้จริงแบบ async
  // แม้จะ strip ออกไปแล้วก็ตาม) ถ้าเบราว์เซอร์ไม่รองรับ <template> (ไม่มีเคสนี้ใน target ของสัญญา แต่กันพลาด)
  // จะ fallback ไปใช้ div เดิม
  const tmp = document.createElement('template');
  if ('content' in tmp) {
    tmp.innerHTML = src;
    stripDisallowed(tmp.content, allowed);
    const out = document.createElement('div');
    out.appendChild(tmp.content.cloneNode(true)); // fragment ไม่ใช่ element เดี่ยว จึงไม่ห่อ tag เกินมา
    return out.innerHTML;
  }
  // fallback: เบราว์เซอร์ไม่รองรับ <template>.content (ไม่ควรเกิดกับ target ตามสัญญา แต่กันพลาดไว้)
  const div = document.createElement('div');
  div.innerHTML = src;
  stripDisallowed(div, allowed);
  return div.innerHTML;
}

function stripDisallowed(node, allowed) {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === 1) {
      const tag = child.tagName.toLowerCase();
      if (allowed.has(tag)) {
        while (child.attributes.length) child.removeAttribute(child.attributes[0].name);
        stripDisallowed(child, allowed);
      } else {
        // แท็กไม่อนุญาต: รีเคิร์สลูกก่อน (เผื่อมีแท็กที่อนุญาตซ้อนอยู่ข้างใน) แล้วดันลูกออกมาแทนตัวมันเอง
        stripDisallowed(child, allowed);
        while (child.firstChild) node.insertBefore(child.firstChild, child);
        node.removeChild(child);
      }
    } else if (child.nodeType !== 3) {
      // ไม่ใช่ text node และไม่ใช่ element ที่อนุญาต (เช่น comment) — ตัดทิ้ง
      node.removeChild(child);
    }
  });
}

/* ============================================================ */
/* sse.js equivalent — ถอด stream ตามรูปแบบ §B.1 ที่ proxy นิยามเอง  */
/* ============================================================ */

/**
 * statusFallback(status, res) — ข้อความไทย/code ดีฟอลต์ตาม HTTP status เมื่อ body ไม่ใช่ JSON ที่ parse ได้
 * (เช่น Caddy คืน error page ของตัวเอง) ยึดตาราง error code ของสัญญาระหว่างโมดูล §B ตรงๆ ไม่ใช่เดา "upstream"
 * ทุกกรณีเหมือนเดิม — สำคัญโดยเฉพาะ 429 ที่ผู้ใช้ต้องรู้ว่าโดนจำกัดจริง ไม่ใช่แค่ "ตอบไม่ได้ในตอนนี้"
 */
function statusFallback(status, res) {
  if (status === 429) {
    // แยกนาที/วันจาก Retry-After ถ้ามี (วินาทีน้อย ≈ ติดโควตานาที; มากถึงเที่ยงคืน ≈ ติดโควตาวัน) —
    // เป็นการตีความโดยตั้งใจตามความเสี่ยงข้อ 7 ของสัญญา เมื่อ proxy ไม่ได้ส่ง JSON body มาให้แยกตรงๆ
    let retryAfter = NaN;
    try {
      retryAfter = parseInt(res.headers.get('Retry-After'), 10);
    } catch (_e) {
      retryAfter = NaN;
    }
    if (!isNaN(retryAfter) && retryAfter <= 90) {
      return { code: 'rate_limited_minute', message: 'ถามถี่ไปนิด รอสักครู่แล้วลองใหม่' };
    }
    return { code: 'rate_limited_day', message: 'วันนี้ถามครบโควตาแล้ว พรุ่งนี้ถามต่อได้' };
  }
  if (status === 503) return { code: 'no_key', message: 'ระบบยังไม่ได้ตั้งค่า key' };
  if (status === 504) return { code: 'timeout', message: 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง' };
  if (status === 502) return { code: 'upstream', message: 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง' };
  if (status === 400) return { code: 'bad_request', message: 'คำถามไม่ถูกต้อง ลองพิมพ์ใหม่อีกครั้ง' };
  if (status === 404) return { code: 'not_found', message: 'ไม่พบไฟล์ต้นฉบับของเล่มนี้' };
  if (status === 403) return { code: 'disabled', message: 'ยังไม่เปิดให้ดาวน์โหลดต้นฉบับ' };
  return { code: 'upstream', message: 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง' };
}

export class AskError extends Error {
  constructor(code, message, status) {
    super(message);
    this.name = 'AskError';
    this.code = code;
    this.status = status;
  }
}

/**
 * streamSSE(url, body, { onEvent(name, data), signal }) — ไม่มี retry อัตโนมัติเด็ดขาด (กฎ 7)
 * โยน AskError({code,message}) เมื่อ HTTP ไม่ ok ก่อนเริ่ม stream หรือเมื่อ fetch ล้มเหลว (เช่น ออฟไลน์)
 * เมื่อ HTTP ok แล้ว จะไม่ throw อีกแม้ proxy ส่ง `event: error` มา — ปล่อยให้ผู้เรียกจัดการผ่าน onEvent เอง
 * (เพราะ error ระหว่าง stream ไม่ใช่ exception ของ fetch แต่เป็น event ปกติตามสัญญา §B.1)
 */
export async function streamSSE(url, body, handlers) {
  const opts = handlers || {};
  const onEvent = opts.onEvent;
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: opts.signal,
    });
  } catch (err) {
    if (err && err.name === 'AbortError') throw err; // ยกเลิกโดยตั้งใจ ไม่ใช่ error เครือข่าย
    throw new AskError('network', 'ไม่มีอินเทอร์เน็ต');
  }

  if (!res.ok) {
    const fallback = statusFallback(res.status, res);
    let code = fallback.code;
    let message = fallback.message;
    try {
      const j = await res.json();
      if (j && j.error) {
        code = j.error.code || code;
        message = j.error.message || message;
      }
    } catch (_e) {
      // parse JSON ไม่ได้ (เช่น proxy/Caddy ตอบ HTML หรือ body ว่าง) — ใช้ fallback ตาม HTTP status
      // ที่คำนวณไว้แล้วข้างบน ตามตาราง error code ↔ status ของสัญญาระหว่างโมดูล §B แทนการเหมาเป็น "upstream" เสมอ
    }
    throw new AskError(code, message, res.status);
  }

  if (!res.body || typeof res.body.getReader !== 'function') {
    // เบราว์เซอร์ที่ไม่รองรับ streaming body เลย — ไม่มีอะไรอ่านต่อได้
    throw new AskError('upstream', 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buf = '';
  for (;;) {
    let chunk;
    try {
      chunk = await reader.read();
    } catch (_e) {
      break; // stream ถูกตัดกลางทาง (เช่นเน็ตหลุด) — จบเงียบๆ ผู้เรียกจะเห็นว่าไม่มี "done" ตามมา
    }
    if (chunk.done) break;
    buf += decoder.decode(chunk.value, { stream: true });
    let idx = buf.indexOf('\n\n');
    while (idx !== -1) {
      parseSSEFrame(buf.slice(0, idx), onEvent);
      buf = buf.slice(idx + 2);
      idx = buf.indexOf('\n\n');
    }
  }
  if (buf.trim()) parseSSEFrame(buf, onEvent); // เผื่อก้อนสุดท้ายไม่มี \n\n ปิดท้าย
}

function parseSSEFrame(raw, onEvent) {
  const lines = raw.split('\n');
  let eventName = 'message';
  const dataLines = [];
  for (const line of lines) {
    if (!line || line.startsWith(':')) continue; // comment / ping ตาม §B.1 ("`: ping` ทุก 15 วินาที")
    if (line.startsWith('event:')) eventName = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }
  if (!dataLines.length) return;
  let data;
  try {
    data = JSON.parse(dataLines.join('\n'));
  } catch (_e) {
    return; // proxy การันตีรูปแบบ JSON บรรทัดเดียวตามสัญญา ถ้า parse ไม่ได้ให้ข้ามเงียบๆ
  }
  if (typeof onEvent === 'function') onEvent(eventName, data);
}

/* ============================================================ */
/* canvas.js equivalent                                           */
/* ============================================================ */

/**
 * fitCanvas(canvas, aspect) — ตั้งขนาด canvas ตามความกว้างจริงของ container (.stage) คูณ dpr (≤2)
 * aspect = สัดส่วนกว้าง:สูง (เช่น 2.5 สำหรับ 900:360 ของต้นแบบ) คืนขนาดหน่วย CSS px ให้วาดแบบสัมพัทธ์เสมอ
 * (§5 ข้อ 2 — ห้ามวาดด้วยเลขตายตัวแบบ 900×360 ต้อง re-fit ตอน resize ด้วย)
 */
export function fitCanvas(canvas, aspect) {
  const parent = canvas.parentElement || canvas;
  const cssWidth = Math.max(1, Math.round(parent.clientWidth || canvas.clientWidth || 300));
  const ratio = aspect && aspect > 0 ? aspect : 2.5;
  const cssHeight = Math.max(1, Math.round(cssWidth / ratio));
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { W: cssWidth, H: cssHeight, dpr, ctx };
}

/** debounce ด้วย rAF แล้วเรียก cb เมื่อขนาดจอเปลี่ยน คืนฟังก์ชันสำหรับยกเลิกการฟัง (ไม่ใช้ ResizeObserver
 *  เพื่อความเข้ากันได้กับ Safari iOS 15 ที่รองรับแต่ยังไม่เสถียรทุกเวอร์ชันตอนเขียนสเปกนี้) */
export function onResize(cb) {
  let raf = null;
  const handler = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      cb();
    });
  };
  window.addEventListener('resize', handler);
  window.addEventListener('orientationchange', handler);
  return function unsubscribe() {
    window.removeEventListener('resize', handler);
    window.removeEventListener('orientationchange', handler);
    if (raf) cancelAnimationFrame(raf);
  };
}
