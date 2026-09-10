(() => {
  "use strict";

  const search = document.querySelector("#book-search");
  const cards = [...document.querySelectorAll(".book-card")];
  const room = document.querySelector(".bookshelf-room");
  let shelves = [...document.querySelectorAll(".shelf")];
  const status = document.querySelector("#result-status");
  const empty = document.querySelector("#empty-state");
  const isAudio = document.body.classList.contains("audio-page");
  const itemName = isAudio ? "หนังสือเสียง" : "หนังสือ";
  const itemUnit = isAudio ? "รายการ" : "เล่ม";
  const audioControls = document.querySelector(".audio-disclosure-controls");
  const audioShowMore = document.querySelector("#audio-show-more");
  const audioShowAll = document.querySelector("#audio-show-all");
  const audioCollapse = document.querySelector("#audio-collapse");
  const audioYearToggle = document.querySelector("#audio-year-toggle");
  const audioYearFilters = document.querySelector("#audio-year-filters");
  const AUDIO_INITIAL_LIMIT = 10;
  const AUDIO_BATCH_SIZE = 10;
  let audioVisibleLimit = AUDIO_INITIAL_LIMIT;
  let activeAudioYear = "";
  let audioArchiveOpen = false;
  let previousAudioQuery = "";
  let activeCategory = "";
  let currentColumns = 0;
  let resizeTimer;

  const normalize = (value) => value.toLocaleLowerCase("th").normalize("NFKC").trim();

  function columnsForViewport() {
    if (window.matchMedia("(max-width: 480px)").matches) return 2;
    if (window.matchMedia("(max-width: 650px)").matches) return 3;
    if (window.matchMedia("(max-width: 900px)").matches) return 4;
    return 5;
  }

  function buildShelfLabels(plank, shelfCards) {
    if (isAudio) {
      plank.setAttribute("aria-hidden", "true");
      return;
    }

    const labelGrid = document.createElement("div");
    labelGrid.className = "shelf-label-grid";
    shelfCards.forEach((card) => {
      const plaque = document.createElement("button");
      plaque.className = "shelf-category-plaque";
      plaque.type = "button";
      plaque.setAttribute("data-category-filter", card.dataset.category);
      plaque.setAttribute("aria-pressed", "false");
      plaque.textContent = card.dataset.category;
      labelGrid.appendChild(plaque);
    });
    plank.appendChild(labelGrid);
  }

  function layoutShelves() {
    const columns = columnsForViewport();
    if (columns === currentColumns) return;

    cards.forEach((card) => card.remove());
    shelves.forEach((shelf) => shelf.remove());
    const fragment = document.createDocumentFragment();

    for (let start = 0, number = 1; start < cards.length; start += columns, number += 1) {
      const shelf = document.createElement("section");
      shelf.className = "shelf";
      shelf.setAttribute("aria-label", `${isAudio ? "ชั้นหนังสือเสียง" : "ชั้นหนังสือ"}ที่ ${number}`);

      const shelfCards = cards.slice(start, start + columns);
      const grid = document.createElement("div");
      grid.className = "book-grid";
      shelfCards.forEach((card) => grid.appendChild(card));

      const plank = document.createElement("div");
      plank.className = "shelf-plank";
      buildShelfLabels(plank, shelfCards);
      shelf.append(grid, plank);
      fragment.appendChild(shelf);
    }

    room.insertBefore(fragment, empty);
    shelves = [...room.querySelectorAll(".shelf")];
    currentColumns = columns;
    updateCatalog();
  }

  function audioYearForCard(card) {
    const time = card.querySelector("time[datetime]");
    return time ? time.getAttribute("datetime").slice(0, 4) : "";
  }

  function matchesAudioDisclosure(card, index) {
    if (activeAudioYear) return audioYearForCard(card) === activeAudioYear;
    return index < audioVisibleLimit;
  }

  function buildAudioYearFilters() {
    if (!isAudio || !audioYearFilters) return;
    const counts = new Map();
    cards.forEach((card) => {
      const year = audioYearForCard(card);
      if (year) counts.set(year, (counts.get(year) || 0) + 1);
    });

    const latest = document.createElement("button");
    latest.type = "button";
    latest.dataset.audioYear = "";
    latest.setAttribute("aria-pressed", "true");
    latest.textContent = "รายการล่าสุด";
    audioYearFilters.appendChild(latest);

    [...counts].sort(([a], [b]) => b.localeCompare(a)).forEach(([year, count]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.audioYear = year;
      button.setAttribute("aria-pressed", "false");
      button.textContent = `${year} · ${count} รายการ`;
      audioYearFilters.appendChild(button);
    });
  }

  function updateAudioControls(query, visible) {
    if (!isAudio || !audioControls) return;
    const searching = Boolean(query);
    const browsingYear = Boolean(activeAudioYear);
    audioShowMore.hidden = searching || browsingYear || audioVisibleLimit >= cards.length;
    audioShowAll.hidden = searching || browsingYear || audioVisibleLimit >= cards.length;
    audioCollapse.hidden = searching || browsingYear || audioVisibleLimit <= AUDIO_INITIAL_LIMIT;
    audioYearToggle.hidden = searching;
    audioYearToggle.setAttribute("aria-expanded", String(audioArchiveOpen && !searching));
    audioYearFilters.hidden = !audioArchiveOpen || searching;
    const remaining = Math.max(0, cards.length - visible);
    audioShowMore.textContent = `แสดงเพิ่มอีก ${Math.min(AUDIO_BATCH_SIZE, remaining)} รายการ`;
    [...audioYearFilters.querySelectorAll("button[data-audio-year]")].forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.audioYear === activeAudioYear));
    });
  }

  function updateCatalog() {
    const query = normalize(search.value);
    let visible = 0;

    cards.forEach((card, index) => {
      const matchesCategory = !activeCategory || card.dataset.category === activeCategory;
      const matchesQuery = !query || normalize(card.dataset.search).includes(query);
      const matchesDisclosure = !isAudio || Boolean(query) || matchesAudioDisclosure(card, index);
      card.hidden = !(matchesCategory && matchesQuery && matchesDisclosure);
      if (!card.hidden) visible += 1;
    });

    shelves.forEach((shelf) => {
      shelf.hidden = !shelf.querySelector(".book-card:not([hidden])");
      if (!isAudio) {
        const shelfCards = [...shelf.querySelectorAll(".book-card")];
        const plaques = [...shelf.querySelectorAll(".shelf-category-plaque")];
        shelfCards.forEach((card, index) => {
          if (plaques[index]) {
            plaques[index].hidden = card.hidden;
            plaques[index].setAttribute(
              "aria-pressed",
              String(Boolean(activeCategory) && plaques[index].dataset.categoryFilter === activeCategory),
            );
          }
        });
      }
    });

    empty.hidden = visible !== 0;
    if (isAudio && !query && !activeAudioYear) {
      status.textContent = `กำลังแสดง${itemName} ${visible} ${itemUnit} จากทั้งหมด ${cards.length} ${itemUnit}`;
    } else if (isAudio && !query && activeAudioYear) {
      status.textContent = `แสดง${itemName}ปี ${activeAudioYear} ทั้ง ${visible} ${itemUnit}`;
    } else {
      status.textContent = visible === cards.length
        ? `แสดง${itemName}ทั้ง ${visible} ${itemUnit}`
        : `พบ${itemName} ${visible} ${itemUnit} จากทั้งหมด ${cards.length} ${itemUnit}`;
    }
    updateAudioControls(query, visible);
  }

  search.addEventListener("input", () => {
    const query = normalize(search.value);
    if (isAudio && query) activeAudioYear = "";
    if (isAudio && !query && previousAudioQuery) {
      audioVisibleLimit = AUDIO_INITIAL_LIMIT;
      activeAudioYear = "";
    }
    previousAudioQuery = query;
    updateCatalog();
  });

  room.addEventListener("click", (event) => {
    const plaque = event.target.closest(".shelf-category-plaque[data-category-filter]");
    if (!plaque || isAudio) return;
    const selected = plaque.dataset.categoryFilter;
    activeCategory = activeCategory === selected ? "" : selected;
    updateCatalog();
  });

  if (isAudio && audioControls) {
    audioShowMore.addEventListener("click", () => {
      audioVisibleLimit += AUDIO_BATCH_SIZE;
      updateCatalog();
    });
    audioShowAll.addEventListener("click", () => {
      audioVisibleLimit = cards.length;
      updateCatalog();
    });
    audioCollapse.addEventListener("click", () => {
      audioVisibleLimit = AUDIO_INITIAL_LIMIT;
      activeAudioYear = "";
      updateCatalog();
      audioControls.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    audioYearToggle.addEventListener("click", () => {
      audioArchiveOpen = !audioArchiveOpen;
      audioYearToggle.textContent = audioArchiveOpen ? "ซ่อนคลังตามปี" : "ดูคลังตามปี";
      updateCatalog();
    });
    audioYearFilters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-audio-year]");
      if (!button) return;
      activeAudioYear = button.dataset.audioYear;
      audioVisibleLimit = activeAudioYear ? cards.length : AUDIO_INITIAL_LIMIT;
      updateCatalog();
    });
  }


  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layoutShelves, 120);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      search.blur();
      if (isAudio) {
        audioVisibleLimit = AUDIO_INITIAL_LIMIT;
        activeAudioYear = "";
        previousAudioQuery = "";
      }
      updateCatalog();
    }
  });

  if (isAudio && audioControls) {
    buildAudioYearFilters();
    audioControls.hidden = false;
  }
  layoutShelves();
})();
