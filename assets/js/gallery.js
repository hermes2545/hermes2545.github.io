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
  let activeFilter = "All";
  let currentIndex = 0;
  let returnFocus = null;

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
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeViewer(); });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeViewer(); });
  document.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); currentIndex -= 1; showCurrent(); }
    if (event.key === "ArrowRight") { event.preventDefault(); currentIndex += 1; showCurrent(); }
    if (event.key === "Escape") { event.preventDefault(); closeViewer(); }
  });

  applyGalleryState();
})();
