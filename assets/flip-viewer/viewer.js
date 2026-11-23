const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;
const PDF_PATTERN = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[a-z0-9][a-z0-9._\/-]*\.pdf$/i;

export function parseBookId(params) {
  const values = params.getAll('id');
  if (values.length !== 1 || !ID_PATTERN.test(values[0])) {
    throw new Error('รหัสหนังสือไม่ถูกต้อง');
  }
  return values[0];
}

export function findCatalogPdf(catalog, id) {
  if (!Array.isArray(catalog)) throw new Error('ข้อมูลชั้นหนังสือไม่ถูกต้อง');
  const book = catalog.find(item => item && item.id === id);
  if (!book || typeof book.href !== 'string' || !PDF_PATTERN.test(book.href)) {
    throw new Error('ไม่พบหนังสือที่เผยแพร่แล้ว');
  }
  return book;
}

export function nextZoom(current, deltaY) {
  const direction = deltaY < 0 ? 1 : -1;
  return Math.max(1, Math.min(2.5, Math.round((current + direction * 0.1) * 10) / 10));
}

export function clampPan(position, bounds) {
  return {
    x: Math.max(-bounds.x, Math.min(bounds.x, position.x)),
    y: Math.max(-bounds.y, Math.min(bounds.y, position.y)),
  };
}

export function pinchZoom(startZoom, startDistance, currentDistance) {
  if (startDistance <= 0 || currentDistance <= 0) return Math.max(1, Math.min(2.5, startZoom));
  return Math.max(1, Math.min(2.5, Math.round(startZoom * currentDistance / startDistance * 100) / 100));
}

export function panForPinch(startPan, startCenter, currentCenter, stageCenter, startZoom, currentZoom) {
  const contentX = (startCenter.x - stageCenter.x - startPan.x) / startZoom;
  const contentY = (startCenter.y - stageCenter.y - startPan.y) / startZoom;
  return {
    x: currentCenter.x - stageCenter.x - currentZoom * contentX,
    y: currentCenter.y - stageCenter.y - currentZoom * contentY,
  };
}

let session = null;
let generation = 0;

function elements() {
  return {
    reader: document.querySelector('#reader'),
    stage: document.querySelector('#stage'),
    status: document.querySelector('#status'),
    statusText: document.querySelector('#status-copy'),
    back: document.querySelector('#back-shelf'),
    original: document.querySelector('#download-pdf'),
    previous: document.querySelector('#previous'),
    next: document.querySelector('#next'),
    go: document.querySelector('#go'),
    input: document.querySelector('#page-number'),
    total: document.querySelector('#total'),
    fullscreen: document.querySelector('#fullscreen'),
    mode: document.querySelector('#interaction-mode'),
    pageTurnSound: document.querySelector('#page-turn-sound'),
  };
}

function createBookContainer(stage) {
  stage.replaceChildren();
  const viewport = document.createElement('div');
  viewport.id = 'book-viewport';
  viewport.className = 'book-viewport';
  const book = document.createElement('div');
  book.id = 'book';
  book.setAttribute('aria-label', 'หน้าหนังสือแบบพลิกหน้า');
  viewport.append(book);
  stage.append(viewport);
  return {book, viewport};
}

function setStatus(ui, message, error = false) {
  const loading = !error && message.startsWith('กำลัง');
  ui.statusText.textContent = message;
  ui.status.classList.toggle('is-loading', loading);
  ui.status.classList.toggle('error', error);
  ui.status.classList.toggle('ready', !error && message.startsWith('ลาก'));
}

function isCancelled(error) {
  return error?.name === 'RenderingCancelledException' || error?.name === 'AbortException';
}

async function dispose() {
  const active = session;
  session = null;
  generation += 1;
  if (!active || active.disposed) return;
  active.disposed = true;
  for (const task of active.renderTasks.values()) {
    try { task.cancel(); } catch (_) { /* already complete */ }
  }
  active.renderTasks.clear();
  for (const cleanup of active.cleanupListeners.splice(0)) {
    try { cleanup(); } catch (_) { /* listener already gone */ }
  }
  for (const url of active.objectUrls.values()) URL.revokeObjectURL(url);
  active.objectUrls.clear();
  try { active.flip?.destroy(); } catch (_) { /* partial initialization */ }
  try { await active.loadingTask?.destroy(); } catch (_) { /* page is closing */ }
  try { await active.pdf?.destroy(); } catch (_) { /* page is closing */ }
}

async function initialize() {
  await dispose();
  const token = ++generation;
  const ui = elements();
  const active = {
    token,
    disposed: false,
    pdf: null,
    loadingTask: null,
    flip: null,
    renderTasks: new Map(),
    objectUrls: new Map(),
    pages: [],
    cleanupListeners: [],
  };
  session = active;
  const current = () => session === active && generation === token && !active.disposed;

  try {
    const id = parseBookId(new URLSearchParams(window.location.search));
    setStatus(ui, 'กำลังอ่านข้อมูลหนังสือ…');
    const response = await fetch('data/books.json', {headers: {'Accept': 'application/json'}});
    if (!response.ok) throw new Error('โหลดข้อมูลชั้นหนังสือไม่สำเร็จ');
    const book = findCatalogPdf(await response.json(), id);
    if (!current()) return;

    document.title = `${book.title} · The Knowledge Shelf`;
    ui.original.href = book.href;
    ui.original.hidden = false;

    setStatus(ui, 'กำลังโหลด PDF และตัวพลิกหน้า…');
    const pdfjs = await import('./vendor/pdfjs/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.mjs', import.meta.url).href;
    if (!window.St || !window.St.PageFlip) throw new Error('โหลด StPageFlip ไม่สำเร็จ');

    active.loadingTask = pdfjs.getDocument({
      url: book.href,
      isEvalSupported: false,
      cMapUrl: new URL('./vendor/pdfjs/cmaps/', import.meta.url).href,
      cMapPacked: true,
      standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', import.meta.url).href,
      wasmUrl: new URL('./vendor/pdfjs/wasm/', import.meta.url).href,
    });
    active.pdf = await active.loadingTask.promise;
    if (!current()) return;
    if (active.pdf.numPages > 600) throw new Error('หนังสือเกิน 600 หน้า กรุณาเปิด PDF ต้นฉบับ');

    const first = await active.pdf.getPage(1);
    const firstViewport = first.getViewport({scale: 1});
    const ratio = firstViewport.height / firstViewport.width;
    const {book: bookElement, viewport: bookViewport} = createBookContainer(ui.stage);
    active.pages = Array.from({length: active.pdf.numPages}, (_, index) => {
      const pageElement = document.createElement('div');
      pageElement.className = 'page';
      const label = document.createElement('span');
      label.className = 'page-loading';
      label.textContent = `หน้า ${index + 1}`;
      const image = new Image();
      image.alt = `หน้า ${index + 1}`;
      image.hidden = true;
      pageElement.append(label, image);
      bookElement.append(pageElement);
      return pageElement;
    });

    async function renderPage(index) {
      if (!current() || index < 0 || index >= active.pdf.numPages || active.objectUrls.has(index)) return;
      if (active.renderTasks.has(index)) return active.renderTasks.get(index).promise;
      const page = await active.pdf.getPage(index + 1);
      if (!current()) return;
      const base = page.getViewport({scale: 1});
      const viewport = page.getViewport({scale: Math.min(1.7, 1200 / base.width)});
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const renderTask = page.render({canvas, canvasContext: canvas.getContext('2d'), viewport});
      active.renderTasks.set(index, renderTask);
      try {
        await renderTask.promise;
        if (!current()) return;
        const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('สร้างภาพหน้าไม่สำเร็จ')), 'image/jpeg', 0.9));
        if (!current()) return;
        const old = active.objectUrls.get(index);
        if (old) URL.revokeObjectURL(old);
        const url = URL.createObjectURL(blob);
        active.objectUrls.set(index, url);
        const image = active.pages[index].querySelector('img');
        image.src = url;
        image.hidden = false;
        active.pages[index].querySelector('.page-loading')?.remove();
      } catch (error) {
        if (!isCancelled(error) && current()) throw error;
      } finally {
        active.renderTasks.delete(index);
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }
    }

    let prefetchToken = 0;
    async function renderNearby(index) {
      const nearToken = ++prefetchToken;
      for (let pageIndex = Math.max(0, index - 2); pageIndex <= Math.min(active.pdf.numPages - 1, index + 4); pageIndex += 1) {
        if (!current() || nearToken !== prefetchToken) return;
        await renderPage(pageIndex);
      }
      for (const [pageIndex, url] of [...active.objectUrls]) {
        if (Math.abs(pageIndex - index) > 8) {
          URL.revokeObjectURL(url);
          active.objectUrls.delete(pageIndex);
          const image = active.pages[pageIndex].querySelector('img');
          image.removeAttribute('src');
          image.hidden = true;
        }
      }
    }

    await renderPage(0);
    if (active.pdf.numPages > 1) await renderPage(1);
    if (!current()) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = matchMedia('(pointer: coarse)').matches;
    const availableHeight = Math.max(300, ui.stage.clientHeight - 40);
    const widthByHeight = Math.floor(availableHeight / ratio);
    const widthByStage = ui.stage.clientWidth < 720
      ? ui.stage.clientWidth - 24
      : Math.floor((ui.stage.clientWidth - 32) / 2);
    const maxPageWidth = Math.max(240, Math.min(680, widthByHeight, widthByStage));
    const initialWidth = Math.min(420, maxPageWidth);
    active.flip = new window.St.PageFlip(bookElement, {
      width: initialWidth,
      height: Math.round(initialWidth * ratio),
      size: 'stretch',
      minWidth: Math.min(240, maxPageWidth),
      maxWidth: maxPageWidth,
      minHeight: Math.min(300, Math.round(maxPageWidth * ratio)),
      maxHeight: Math.round(maxPageWidth * ratio),
      autoSize: true,
      usePortrait: true,
      showCover: true,
      flippingTime: reduceMotion ? 220 : 650,
      maxShadowOpacity: reduceMotion ? 0.08 : 0.28,
      mobileScrollSupport: false,
      disableFlipByClick: coarsePointer,
    });
    active.flip.loadFromHTML(active.pages);

    const baseRect = bookElement.getBoundingClientRect();
    bookViewport.style.width = `${baseRect.width}px`;
    bookViewport.style.height = `${baseRect.height}px`;
    let zoom = 1;
    let pan = {x: 0, y: 0};
    let drag = null;
    let pinch = null;
    let lastTap = null;
    const touchPointers = new Map();
    const touchStarts = new Map();
    const touchGuards = new Map();
    const DOUBLE_TAP_DELAY = 320;
    const point = event => ({x: event.clientX, y: event.clientY});
    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const midpoint = (a, b) => ({x: (a.x + b.x) / 2, y: (a.y + b.y) / 2});
    const stageCenter = () => {
      const rect = ui.stage.getBoundingClientRect();
      return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
    };
    const panBounds = () => ({
      x: Math.max(0, baseRect.width * (zoom - 1) / 2),
      y: Math.max(0, baseRect.height * (zoom - 1) / 2),
    });
    const applyView = () => {
      pan = clampPan(pan, panBounds());
      bookViewport.style.transform = `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`;
      const panning = zoom > 1;
      ui.stage.classList.toggle('pan-mode', panning);
      ui.mode.classList.toggle('pan-mode', panning);
      ui.mode.setAttribute('aria-label', panning ? `โหมดเลื่อนเอกสาร ${Math.round(zoom * 100)} เปอร์เซ็นต์` : 'ซูมเอกสาร');
      ui.mode.title = panning ? `เลื่อนเอกสาร · ${Math.round(zoom * 100)}% · แตะเพื่อกลับ 100%` : 'แตะเพื่อซูม หรือถ่างสองนิ้ว';
    };
    const setZoom = (next, anchor = stageCenter()) => {
      const previous = zoom;
      zoom = Math.max(1, Math.min(2.5, Math.round(next * 100) / 100));
      pan = zoom === 1 ? {x: 0, y: 0} : panForPinch(pan, anchor, anchor, stageCenter(), previous, zoom);
      applyView();
    };
    const onWheel = event => {
      event.preventDefault();
      setZoom(nextZoom(zoom, event.deltaY), point(event));
    };
    const beginDrag = (pointerId, position) => {
      try { ui.stage.setPointerCapture(pointerId); } catch (_) { /* capture can move between elements */ }
      ui.stage.classList.add('is-dragging');
      drag = {pointerId, x: position.x, y: position.y, origin: {...pan}};
    };
    const onTouchStartGuard = event => {
      for (const touch of event.changedTouches) {
        touchGuards.set(touch.identifier, {x: touch.clientX, y: touch.clientY, moved: false});
      }
    };
    const onTouchMoveGuard = event => {
      for (const touch of event.changedTouches) {
        const start = touchGuards.get(touch.identifier);
        if (start && Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 12) start.moved = true;
      }
    };
    const onTouchEndGuard = event => {
      let tap = false;
      for (const touch of event.changedTouches) {
        const start = touchGuards.get(touch.identifier);
        tap ||= Boolean(start && !start.moved);
        touchGuards.delete(touch.identifier);
      }
      if (tap) {
        event.stopPropagation();
        event.preventDefault();
      }
    };
    const onPointerDown = event => {
      const position = point(event);
      if (event.pointerType === 'touch') {
        touchPointers.set(event.pointerId, position);
        touchStarts.set(event.pointerId, position);
        if (touchPointers.size === 2) {
          event.preventDefault();
          const [first, second] = [...touchPointers.values()];
          pinch = {
            startDistance: distance(first, second),
            startZoom: zoom,
            startPan: {...pan},
            startCenter: midpoint(first, second),
            stageCenter: stageCenter(),
          };
          drag = null;
          lastTap = null;
          ui.stage.classList.add('is-dragging');
          for (const pointerId of touchPointers.keys()) {
            try { ui.stage.setPointerCapture(pointerId); } catch (_) { /* first pointer may be owned by PageFlip */ }
          }
          return;
        }
        if (zoom > 1) {
          event.preventDefault();
          beginDrag(event.pointerId, position);
        }
        return;
      }
      if (zoom === 1 || (event.button !== 0 && event.button !== 1)) return;
      event.preventDefault();
      beginDrag(event.pointerId, position);
    };
    const onPointerMove = event => {
      if (event.pointerType === 'touch' && touchPointers.has(event.pointerId)) {
        touchPointers.set(event.pointerId, point(event));
      }
      if (pinch && touchPointers.size >= 2) {
        event.preventDefault();
        const [first, second] = [...touchPointers.values()];
        const center = midpoint(first, second);
        const next = pinchZoom(pinch.startZoom, pinch.startDistance, distance(first, second));
        pan = panForPinch(pinch.startPan, pinch.startCenter, center, pinch.stageCenter, pinch.startZoom, next);
        zoom = next;
        applyView();
        return;
      }
      if (!drag || drag.pointerId !== event.pointerId) return;
      pan = clampPan({
        x: drag.origin.x + event.clientX - drag.x,
        y: drag.origin.y + event.clientY - drag.y,
      }, panBounds());
      applyView();
    };
    const onPointerUp = event => {
      const wasPinching = Boolean(pinch);
      const released = point(event);
      const touchStart = touchStarts.get(event.pointerId);
      const isTap = event.pointerType === 'touch' && touchStart && distance(touchStart, released) <= 12;
      if (event.pointerType === 'touch') {
        touchPointers.delete(event.pointerId);
        touchStarts.delete(event.pointerId);
      }
      if (pinch && touchPointers.size < 2) {
        pinch = null;
        ui.stage.classList.remove('is-dragging');
        const remaining = [...touchPointers.entries()][0];
        if (remaining && zoom > 1) beginDrag(remaining[0], remaining[1]);
      } else if (drag?.pointerId === event.pointerId) {
        drag = null;
        ui.stage.classList.remove('is-dragging');
      }
      try { ui.stage.releasePointerCapture(event.pointerId); } catch (_) { /* already released */ }

      if (event.type === 'pointerup' && isTap && !wasPinching && touchPointers.size === 0) {
        event.stopPropagation();
        event.preventDefault();
        const now = performance.now();
        if (lastTap && now - lastTap.time <= DOUBLE_TAP_DELAY && distance(lastTap, released) <= 28) {
          event.preventDefault();
          setZoom(zoom > 1 ? 1 : 2, released);
          lastTap = null;
        } else {
          lastTap = {...released, time: now};
        }
      }
    };
    const resetZoom = () => setZoom(1);
    const toggleZoom = () => zoom === 1 ? setZoom(1.5) : resetZoom();
    applyView();

    ui.input.max = active.pdf.numPages;
    ui.total.textContent = `/ ${active.pdf.numPages}`;
    const update = index => {
      if (!current()) return;
      ui.input.value = String(index + 1);
      ui.previous.disabled = index <= 0;
      ui.next.disabled = index >= active.pdf.numPages - 1;
      renderNearby(index).catch(error => { if (current()) setStatus(ui, error.message, true); });
    };
    let currentPage = 0;
    ui.pageTurnSound.volume = 0.18;
    active.flip.on('flip', event => {
      if (event.data !== currentPage) {
        currentPage = event.data;
        ui.pageTurnSound.currentTime = 0;
        ui.pageTurnSound.play().catch(() => { /* browser may block audio before interaction */ });
      }
      update(event.data);
    });

    const onPrevious = () => active.flip?.flipPrev();
    const onNext = () => active.flip?.flipNext();
    const onBack = () => {
      if (window.parent !== window) {
        window.parent.postMessage({type: 'bookshelf-close-viewer'}, window.location.origin);
      } else {
        window.location.href = './';
      }
    };
    const onGo = async () => {
      const requested = Number(ui.input.value);
      if (!Number.isInteger(requested)) return;
      const index = Math.min(active.pdf.numPages - 1, Math.max(0, requested - 1));
      await renderPage(index);
      await renderPage(index + 1);
      if (!current()) return;
      active.flip.turnToPage(index);
      update(index);
    };
    const onFullscreen = async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await ui.reader.requestFullscreen();
      } catch (_) {
        setStatus(ui, 'เบราว์เซอร์นี้ไม่อนุญาตโหมดเต็มจอ', true);
      }
    };
    const onKey = event => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === 'ArrowLeft') onPrevious();
      if (event.key === 'ArrowRight') onNext();
    };
    for (const [target, name, listener, options] of [
      [ui.back, 'click', onBack],
      [ui.previous, 'click', onPrevious], [ui.next, 'click', onNext],
      [ui.go, 'click', onGo], [ui.fullscreen, 'click', onFullscreen],
      [ui.mode, 'click', toggleZoom], [ui.stage, 'wheel', onWheel, {passive: false}],
      [ui.stage, 'touchstart', onTouchStartGuard, {capture: true, passive: false}],
      [ui.stage, 'touchmove', onTouchMoveGuard, {capture: true, passive: false}],
      [ui.stage, 'touchend', onTouchEndGuard, {capture: true, passive: false}],
      [ui.stage, 'touchcancel', onTouchEndGuard, {capture: true, passive: false}],
      [ui.stage, 'pointerdown', onPointerDown, {capture: true}],
      [ui.stage, 'pointermove', onPointerMove, {capture: true}],
      [ui.stage, 'pointerup', onPointerUp, {capture: true}],
      [ui.stage, 'pointercancel', onPointerUp, {capture: true}],
      [document, 'keydown', onKey],
    ]) {
      target.addEventListener(name, listener, options);
      active.cleanupListeners.push(() => target.removeEventListener(name, listener, options));
    }
    ui.go.disabled = false;
    setStatus(ui, 'ลากมุมเพื่อพลิกหน้า · หมุนล้อเมาส์เพื่อซูม · เมื่อซูมแล้วคลิกซ้ายค้างเพื่อลาก · มือถือถ่างสองนิ้ว');
    update(0);
  } catch (error) {
    if (!current()) return;
    setStatus(ui, `${error.message} — ยังสามารถเปิด PDF ต้นฉบับได้`, true);
    ui.previous.disabled = true;
    ui.next.disabled = true;
    ui.go.disabled = true;
  }
}

if (typeof document !== 'undefined') {
  window.addEventListener('pagehide', () => { dispose(); });
  window.addEventListener('pageshow', event => { if (event.persisted) initialize(); });
  initialize();
}
