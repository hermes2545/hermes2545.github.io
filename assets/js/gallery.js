(() => {
  "use strict";

  const gallery = document.querySelector("#gallery-grid");
  if (!gallery) return;

  const cards = [...gallery.querySelectorAll(".art-card")];
  const chips = [...document.querySelectorAll(".chip")];
  const sort = document.querySelector("#gallery-sort");
  const result = document.querySelector("#gallery-result");
  const empty = document.querySelector("#gallery-empty");
  const dialog = document.querySelector("#gallery-viewer");
  const viewerImage = document.querySelector("#viewer-image");
  const viewerTitle = document.querySelector("#viewer-title");
  const viewerMeta = document.querySelector("#viewer-meta");
  const viewerFrame = dialog.querySelector(".lightbox-media");
  const zoomOut = document.querySelector("#zoom-out");
  const zoomReset = document.querySelector("#zoom-reset");
  const zoomIn = document.querySelector("#zoom-in");
  const zoomLevel = document.querySelector("#zoom-level");
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.25;
  let activeFilter = "All";
  let currentIndex = 0;
  let returnFocus = null;
  let zoom = MIN_ZOOM;
  let panX = 0;
  let panY = 0;
  let dragging = false;
  let dragOriginX = 0;
  let dragOriginY = 0;

  const visibleCards = () => cards.filter((card) => !card.hidden);

  function applyGalleryState() {
    cards.forEach((card) => {
      card.hidden = activeFilter !== "All" && card.dataset.category !== activeFilter;
    });
    const shown = visibleCards();
    result.textContent = `แสดง ${shown.length} จาก ${cards.length} ผลงาน`;
    empty.hidden = shown.length !== 0;
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      chips.forEach((item) => item.setAttribute("aria-pressed", String(item === chip)));
      applyGalleryState();
    });
  });

  sort.addEventListener("change", () => {
    const ordered = [...cards];
    if (sort.value === "newest") {
      ordered.sort((a, b) => b.dataset.date.localeCompare(a.dataset.date));
    } else if (sort.value === "title") {
      ordered.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title, "en"));
    } else {
      ordered.sort((a, b) => Number(a.dataset.featured) - Number(b.dataset.featured));
    }
    ordered.forEach((card) => gallery.append(card));
  });

  function setView(listMode) {
    gallery.classList.toggle("list", listMode);
    document.querySelector("#grid-view").setAttribute("aria-pressed", String(!listMode));
    document.querySelector("#list-view").setAttribute("aria-pressed", String(listMode));
  }

  document.querySelector("#grid-view").addEventListener("click", () => setView(false));
  document.querySelector("#list-view").addEventListener("click", () => setView(true));

  function clampPan() {
    const maxX = Math.max(0, (viewerImage.offsetWidth * zoom - viewerFrame.clientWidth) / 2);
    const maxY = Math.max(0, (viewerImage.offsetHeight * zoom - viewerFrame.clientHeight) / 2);
    panX = Math.max(-maxX, Math.min(maxX, panX));
    panY = Math.max(-maxY, Math.min(maxY, panY));
  }

  function renderViewport() {
    clampPan();
    viewerImage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
    zoomOut.disabled = zoom <= MIN_ZOOM;
    zoomIn.disabled = zoom >= MAX_ZOOM;
    viewerFrame.classList.toggle("can-pan", zoom > MIN_ZOOM);
  }

  function setZoom(nextZoom) {
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
    if (zoom === MIN_ZOOM) {
      panX = 0;
      panY = 0;
    }
    renderViewport();
  }

  function resetViewport() {
    zoom = MIN_ZOOM;
    panX = 0;
    panY = 0;
    dragging = false;
    viewerFrame.classList.remove("dragging");
    renderViewport();
  }

  function showCurrent() {
    const shown = visibleCards();
    if (!shown.length) return;
    currentIndex = (currentIndex + shown.length) % shown.length;
    const card = shown[currentIndex];
    const image = card.querySelector("img");
    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
    viewerTitle.textContent = card.dataset.title;
    viewerMeta.textContent = `${card.dataset.category} · ${card.querySelector(".format").textContent} · ${card.querySelector("time").textContent}`;
    resetViewport();
  }

  function openViewer(card, trigger) {
    currentIndex = visibleCards().indexOf(card);
    returnFocus = trigger;
    showCurrent();
    dialog.showModal();
    dialog.querySelector(".lightbox-close").focus();
  }

  function closeViewer() {
    dialog.close();
    resetViewport();
    viewerImage.removeAttribute("src");
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
  }

  cards.forEach((card) => {
    card.querySelectorAll(".art-button, .view-link").forEach((trigger) => {
      trigger.addEventListener("click", () => openViewer(card, trigger));
    });
  });

  dialog.querySelector(".lightbox-close").addEventListener("click", closeViewer);
  dialog.querySelector(".lightbox-prev").addEventListener("click", () => { currentIndex -= 1; showCurrent(); });
  dialog.querySelector(".lightbox-next").addEventListener("click", () => { currentIndex += 1; showCurrent(); });
  zoomOut.addEventListener("click", () => setZoom(zoom - ZOOM_STEP));
  zoomReset.addEventListener("click", resetViewport);
  zoomIn.addEventListener("click", () => setZoom(zoom + ZOOM_STEP));
  viewerImage.addEventListener("load", resetViewport);
  viewerFrame.addEventListener("pointerdown", (event) => {
    if (zoom <= MIN_ZOOM || (event.pointerType === "mouse" && event.button !== 0)) return;
    dragging = true;
    dragOriginX = event.clientX - panX;
    dragOriginY = event.clientY - panY;
    viewerFrame.classList.add("dragging");
    viewerFrame.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  viewerFrame.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    panX = event.clientX - dragOriginX;
    panY = event.clientY - dragOriginY;
    renderViewport();
  });
  function stopDragging(event) {
    if (!dragging) return;
    dragging = false;
    viewerFrame.classList.remove("dragging");
    if (viewerFrame.hasPointerCapture(event.pointerId)) viewerFrame.releasePointerCapture(event.pointerId);
  }
  viewerFrame.addEventListener("pointerup", stopDragging);
  viewerFrame.addEventListener("pointercancel", stopDragging);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeViewer(); });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeViewer(); });
  document.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); currentIndex -= 1; showCurrent(); }
    if (event.key === "ArrowRight") { event.preventDefault(); currentIndex += 1; showCurrent(); }
    if (event.key === "+" || event.key === "=") { event.preventDefault(); setZoom(zoom + ZOOM_STEP); }
    if (event.key === "-") { event.preventDefault(); setZoom(zoom - ZOOM_STEP); }
    if (event.key === "0") { event.preventDefault(); resetViewport(); }
    if (event.key === "Escape") { event.preventDefault(); closeViewer(); }
  });

  window.addEventListener("resize", () => { if (dialog.open) renderViewport(); });

  applyGalleryState();
})();
