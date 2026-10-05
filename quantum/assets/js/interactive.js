/**
 * interactive.js — loader ของ UniverseWindow (§E.4, §E.1 ของสัญญาระหว่างโมดูล)
 * หา #ix[data-module] -> IntersectionObserver (threshold 0.1, rootMargin 200px) -> ตอนเข้าจอครั้งแรก:
 * data-state="loading", dynamic import(`/assets/js/interactives/${module}.js`), mount() แล้ว resume(),
 * data-state="ready" -> ออกจากจอ: pause() -> กลับเข้าจอ: resume() -> import ล้มเหลว: data-state="error"
 * พร้อม fallback <p class="ix-fallback"> (ห้าม retry อัตโนมัติ) -> document.hidden: pause() -> pagehide: unmount()
 *
 * โหลดด้วย dynamic import() เป็น static asset ธรรมดา ไม่ใช่การเรียก API ตอนโหลดหน้า (ได้รับอนุญาตตาม §E.1)
 */
import { getPageData, cssVar, prefersReducedMotion, fitCanvas, onResize } from './components.js';

export function init() {
  const el = document.getElementById('ix');
  if (!el) return; // บทที่ไม่มี interactive (เช่น soon) ไม่มี element นี้อยู่แล้ว
  const moduleName = el.dataset.module;
  const root = document.getElementById('ix-root');
  if (!moduleName || !root) return;

  let pageData = null;
  try {
    pageData = getPageData();
  } catch (_e) {
    pageData = null;
  }

  const chapter = pageData && pageData.chapter;
  const opts = {
    config: (chapter && chapter.interactive && chapter.interactive.config) || {},
    reducedMotion: prefersReducedMotion(),
    chapter: {
      book: pageData && pageData.book ? pageData.book.slug : null,
      slug: chapter ? chapter.slug : null,
      thaiNum: chapter ? chapter.thaiNum : null,
      title: chapter ? chapter.title : null,
    },
    cssVar: (name) => cssVar(name, el),
    fitCanvas,
    onResize,
  };

  let mod = null;
  let started = false;
  let visible = false;

  function setState(v) {
    el.dataset.state = v;
  }

  async function start() {
    started = true;
    setState('loading');
    try {
      const base = (pageData && pageData.base) || '';
      mod = await import(`${base}/assets/js/interactives/${moduleName}.js`);
      mod.mount(root, opts);
      if (visible) mod.resume();
      setState('ready');
    } catch (_e) {
      // โหลดไม่สำเร็จ (404/network) — ห้าม retry อัตโนมัติ (กฎ 7) แสดง fallback ให้ผู้อ่านทราบเฉยๆ
      setState('error');
      const p = document.createElement('p');
      p.className = 'ix-fallback';
      p.textContent = 'โหลดส่วนโต้ตอบไม่สำเร็จ';
      root.appendChild(p);
    }
  }

  const io =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (!entry) return;
            visible = entry.isIntersecting;
            if (visible) {
              if (!started) start();
              else if (mod && mod.resume) mod.resume();
            } else if (mod && mod.pause) {
              mod.pause();
            }
          },
          { threshold: 0.1, rootMargin: '200px' }
        )
      : null;

  if (io) io.observe(el);
  else {
    // เบราว์เซอร์เก่ามากไม่มี IntersectionObserver — โหลดตรงๆ แทนไม่แสดงอะไรเลย
    visible = true;
    start();
  }

  document.addEventListener('visibilitychange', () => {
    if (!mod) return;
    if (document.hidden) {
      if (mod.pause) mod.pause();
    } else if (visible && mod.resume) {
      mod.resume();
    }
  });

  window.addEventListener('pagehide', () => {
    if (mod && mod.unmount) mod.unmount(root);
  });
}
