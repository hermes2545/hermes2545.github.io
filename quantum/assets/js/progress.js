/**
 * progress.js — ความคืบหน้าผู้ใช้ฝั่ง client เท่านั้น (§9.6, §9.7, §E.1/E.2 ของสัญญาระหว่างโมดูล)
 * ทุกการอ่าน/เขียน localStorage/sessionStorage ต้องไม่ทำหน้าเว็บพังใน private mode — ห่อ try/catch ทุกจุด
 * (readJSON/writeJSON ใน components.js ทำ try/catch ให้แล้วสำหรับ localStorage; sessionStorage ทำเองในไฟล์นี้)
 */

import { readJSON, writeJSON, PROGRESS_KEY, getPageData } from './components.js';

/* ตัด "/" ท้าย pathname เสมอก่อนเทียบ/เก็บ — กันปัญหา Caddy อาจเสิร์ฟทั้งแบบมี/ไม่มี slash ท้าย
   (ความเสี่ยงข้อ 8 ของสัญญาระหว่างโมดูล) */
function normalizeRoute(p) {
  if (!p) return p;
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

function emptyProgress() {
  return { lastRoute: null, chapters: {} };
}

export function getProgress() {
  const p = readJSON(PROGRESS_KEY, null);
  if (p && typeof p === 'object' && p.chapters && typeof p.chapters === 'object') {
    return p;
  }
  return emptyProgress();
}

function saveProgress(p) {
  writeJSON(PROGRESS_KEY, p);
}

function setLastRoute(pathname) {
  const p = getProgress();
  p.lastRoute = normalizeRoute(pathname);
  saveProgress(p);
}

/** key = `${bookSlug}/${chapterSlug}` ตาม §9.6 */
export function markOpened(route) {
  if (!route) return;
  const p = getProgress();
  const prev = p.chapters[route];
  p.chapters[route] = { opened: Date.now(), finished: prev ? prev.finished || null : null };
  saveProgress(p);
}

export function markFinished(route) {
  if (!route) return;
  const p = getProgress();
  const prev = p.chapters[route];
  p.chapters[route] = { opened: prev ? prev.opened || Date.now() : Date.now(), finished: Date.now() };
  saveProgress(p);
}

function bookChapterRoute(pd) {
  if (!pd.book || !pd.chapter) return null;
  return `${pd.book.slug}/${pd.chapter.slug}`;
}

/** หน้าแผนที่เล่ม: เติม class "done" + เปลี่ยนป้าย .st เป็น "✓ อ่านจบ" ให้บทที่ finished แล้ว */
function paintBookPage(pd) {
  if (!pd.book) return;
  const progress = getProgress();
  document.querySelectorAll('.maprow[data-chapter]').forEach((row) => {
    const key = `${pd.book.slug}/${row.dataset.chapter}`;
    const entry = progress.chapters[key];
    if (entry && entry.finished) {
      row.classList.add('done');
      const st = row.querySelector('.st');
      if (st) st.textContent = '✓ อ่านจบ';
    }
  });
}

/** หน้าชั้นหนังสือ: เติมข้อความ "อ่านจบ n/m บท" ต่อการ์ด (ซ่อนเองถ้าว่างเพราะ CSS .bc-progress:empty) */
function paintShelfPage(pd) {
  if (!pd.shelf) return;
  const progress = getProgress();
  document.querySelectorAll('.bookcard[data-book]').forEach((card) => {
    const slug = card.dataset.book;
    const shelfBook = pd.shelf.find((b) => b.slug === slug);
    if (!shelfBook) return;
    const ready = shelfBook.readyChapters || [];
    if (!ready.length) return;
    let finished = 0;
    ready.forEach((ch) => {
      const entry = progress.chapters[`${slug}/${ch}`];
      if (entry && entry.finished) finished += 1;
    });
    const el = card.querySelector('[data-progress]');
    if (el && finished > 0) el.textContent = `อ่านจบ ${finished}/${ready.length} บท`;
  });
}

/** กฎ §9.7: ChapterNav เข้า viewport >=50% ค้าง >=2 วินาที ถึงนับว่า "อ่านจบ" — เฉพาะหน้า chapter จริง
   (หน้า soon ไม่นับ ตามความเสี่ยงข้อ 12 ห้ามเปลี่ยน target เป็น source-footer ที่อยู่ถัดจาก #chnav) */
function watchFinished(route) {
  const chnav = document.getElementById('chnav');
  if (!chnav || typeof IntersectionObserver === 'undefined') return;
  let timer = null;
  let done = false;
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        if (!timer && !done) {
          timer = setTimeout(() => {
            done = true;
            markFinished(route);
            observer.disconnect();
          }, 2000);
        }
      } else if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
    { threshold: [0, 0.5, 1] }
  );
  observer.observe(chnav);
}

export function init() {
  let pageData;
  try {
    pageData = getPageData();
  } catch (_e) {
    return; // ไม่มี #page-data — ไม่ควรเกิดตาม D.2 แต่กันพลาด
  }

  const page = pageData.page;
  const pathname = normalizeRoute(window.location.pathname);

  if (page === 'shelf') {
    // เด้งไปบทล่าสุดเฉพาะครั้งแรกของ session บนหน้า "/" เท่านั้น (§E.2)
    let visitedThisSession = true;
    try {
      visitedThisSession = sessionStorage.getItem('dsl.session') === '1';
    } catch (_e) {
      visitedThisSession = true; // เข้าถึง sessionStorage ไม่ได้ (private mode) — ปลอดภัยไว้ก่อน ไม่เด้ง
    }
    if (!visitedThisSession) {
      try {
        sessionStorage.setItem('dsl.session', '1');
      } catch (_e) {
        /* เพิกเฉย */
      }
      const progress = getProgress();
      if (progress.lastRoute && progress.lastRoute !== pathname) {
        window.location.replace(progress.lastRoute);
        return; // กำลังจะออกจากหน้านี้แล้ว ไม่ต้องทำอย่างอื่นต่อ
      }
    }
    paintShelfPage(pageData);
    return;
  }

  try {
    sessionStorage.setItem('dsl.session', '1');
  } catch (_e) {
    /* เพิกเฉย */
  }

  if (page === 'chapter' || page === 'soon' || page === 'book') {
    setLastRoute(pathname);
  }

  if (page === 'chapter' || page === 'soon') {
    const route = bookChapterRoute(pageData);
    if (route) markOpened(route);
  }

  if (page === 'chapter') {
    const route = bookChapterRoute(pageData);
    if (route) watchFinished(route);
  }

  if (page === 'book') {
    paintBookPage(pageData);
  }
}
