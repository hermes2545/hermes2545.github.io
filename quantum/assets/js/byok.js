/**
 * byok.js — ผู้ช่วยแบบ "ใช้ API key ของผู้อ่านเอง" สำหรับเว็บโหมด static (GitHub Pages ไม่มี proxy)
 *
 * - key ของผู้อ่านเก็บในเบราว์เซอร์นี้เท่านั้น (sessionStorage หรือ localStorage ถ้าผู้อ่านเลือก "จำไว้")
 *   และส่งตรงไปที่ api.anthropic.com — ไม่มีเซิร์ฟเวอร์ของเว็บนี้อยู่กลางทาง เจ้าของเว็บไม่เห็น key และไม่จ่ายค่าใช้งาน
 * - context ประกอบด้วย context.js ตัวเดียวกับ proxy (build.js คัดลอกมา) กติกา system prompt จึงมีที่เดียว
 * - เรียก Messages API ด้วย fetch ตรง ไม่ใช้ SDK เพราะหน้าเว็บไม่มี bundler และไม่อยากให้มีโค้ดภายนอกอยู่ข้าง key
 * - stream(kind, body, handlers) เรียก handlers.onEvent('delta'|'error', data) รูปเดียวกับ streamSSE ของ proxy
 */

import { getPageData } from './components.js';
import { buildAskContext, buildFeedbackContext } from './context.js';

const API_URL = 'https://api.anthropic.com/v1/messages';
const KEY_NAME = 'tq.anthropicKey';
const MODEL_NAME = 'tq.model';
const MAX_TOKENS = 2000; // คำตอบสั้น 6-8 ประโยค แต่ thinking นับรวมใน max_tokens จึงเผื่อไว้

export const MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 (แนะนำ)' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (ราคาครึ่งหนึ่ง)' },
];

/* ---------- key / model ---------- */

function storageGet(store, name) {
  try {
    return store.getItem(name);
  } catch {
    return null;
  }
}

export function getKey() {
  return storageGet(sessionStorage, KEY_NAME) || storageGet(localStorage, KEY_NAME) || '';
}

export function setKey(key, remember) {
  clearKey();
  try {
    (remember ? localStorage : sessionStorage).setItem(KEY_NAME, key);
  } catch {
    /* เบราว์เซอร์ปิด storage — key ใช้ไม่ได้ข้ามหน้า ผู้อ่านต้องใส่ใหม่ */
  }
}

export function clearKey() {
  try {
    sessionStorage.removeItem(KEY_NAME);
    localStorage.removeItem(KEY_NAME);
  } catch {
    /* ไม่มีอะไรต้องลบ */
  }
}

export function getModel() {
  const m = storageGet(localStorage, MODEL_NAME);
  return MODELS.some((x) => x.id === m) ? m : MODELS[0].id;
}

export function setModel(id) {
  try {
    localStorage.setItem(MODEL_NAME, id);
  } catch {
    /* ใช้ค่า default */
  }
}

/* ---------- store สำหรับ context.js (อ่านไฟล์ที่ build.js เขียนไว้ใน assets/data) ---------- */

let cache = null;

function createStore(pageData) {
  const base = pageData.api.data;
  const getJSON = async (path) => {
    const res = await fetch(`${base}/${path}`);
    if (!res.ok) throw new Error('โหลดข้อมูลหนังสือไม่สำเร็จ');
    return res.json();
  };
  if (!cache) cache = { index: getJSON('index.json'), lite: getJSON('lite.json'), full: new Map() };
  const currentBook = pageData.book ? pageData.book.slug : null;
  const currentChapter = pageData.chapter ? pageData.chapter.slug : null;
  return {
    loadIndex: () => cache.index,
    async loadBook(bookSlug) {
      return (await cache.lite)[bookSlug] || null;
    },
    async loadChapter(bookSlug, chapterSlug) {
      // บทที่กำลังอ่านต้องใช้ฉบับเต็ม ที่เหลือใช้ข้อมูลย่อ (summary/keyPoints/keywords) ก็พอตาม context.js
      if (bookSlug === currentBook && chapterSlug === currentChapter) {
        const k = `${bookSlug}/${chapterSlug}`;
        if (!cache.full.has(k)) cache.full.set(k, getJSON(`ch/${bookSlug}/${chapterSlug}.json`));
        return cache.full.get(k);
      }
      const book = (await cache.lite)[bookSlug];
      return book ? book.chapters.find((c) => c.slug === chapterSlug) || null : null;
    },
  };
}

/* ---------- เรียก API ---------- */

function errorMessage(status, body) {
  const type = body && body.error && body.error.type;
  const msg = (body && body.error && body.error.message) || '';
  if (status === 401 || type === 'authentication_error') {
    clearKey();
    return 'API key ใช้ไม่ได้ ลองตรวจแล้วใส่ใหม่อีกครั้ง';
  }
  if (/credit balance|billing/i.test(msg)) return 'เครดิตในบัญชี Anthropic ของคุณไม่พอ เติมได้ที่ console.anthropic.com';
  if (status === 429) return 'บัญชีของคุณถามถี่เกินกำหนด รอสักครู่แล้วลองใหม่';
  if (status === 529 || type === 'overloaded_error') return 'ระบบของ Anthropic งานล้นอยู่ ลองใหม่อีกครั้งในอีกสักครู่';
  if (status === 403) return 'key นี้ไม่มีสิทธิ์ใช้โมเดลที่เลือก ลองเปลี่ยนโมเดล';
  return 'ตอบไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง';
}

async function callClaude({ system, messages }, onText) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': getKey(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'anthropic-beta': 'server-side-fallback-2026-07-01',
    },
    body: JSON.stringify({
      model: getModel(),
      max_tokens: MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'low' },
      fallbacks: 'default',
      system,
      messages,
      stream: true,
    }),
  });
  if (!res.ok) {
    let body = null;
    try {
      body = await res.json();
    } catch {
      /* ไม่ใช่ JSON */
    }
    throw new Error(errorMessage(res.status, body));
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let stopReason = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let cut;
    while ((cut = buf.indexOf('\n\n')) >= 0) {
      const chunk = buf.slice(0, cut);
      buf = buf.slice(cut + 2);
      const dataLine = chunk.split('\n').find((l) => l.startsWith('data:'));
      if (!dataLine) continue;
      let ev;
      try {
        ev = JSON.parse(dataLine.slice(5));
      } catch {
        continue;
      }
      if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') {
        onText(ev.delta.text);
      } else if (ev.type === 'message_delta' && ev.delta) {
        stopReason = ev.delta.stop_reason || stopReason;
      } else if (ev.type === 'error') {
        const t = ev.error && ev.error.type;
        throw new Error(errorMessage(t === 'overloaded_error' ? 529 : 0, ev));
      }
    }
  }
  return stopReason;
}

/** รูปเดียวกับ streamSSE(url, body, handlers) — kind = 'ask' | 'feedback' */
export async function stream(kind, body, handlers) {
  const pageData = getPageData();
  const store = createStore(pageData);
  const ctx = kind === 'ask' ? await buildAskContext(store, body) : await buildFeedbackContext(store, body);
  if (!ctx) throw new Error('บทนี้ไม่มีแบบฝึก');
  const stopReason = await callClaude(ctx, (text) => handlers.onEvent('delta', { text }));
  if (stopReason === 'refusal') {
    handlers.onEvent('error', { message: 'ผู้ช่วยตอบคำถามนี้ไม่ได้ ลองถามด้วยถ้อยคำอื่น' });
  } else if (stopReason === 'max_tokens') {
    handlers.onEvent('error', { message: 'คำตอบยาวเกินและถูกตัด ลองถามให้แคบลง' });
  }
}
