(() => {
  "use strict";

  const search = document.querySelector("#app-search");
  const cards = [...document.querySelectorAll(".app-card")];
  const room = document.querySelector(".app-store");
  let shelves = [...document.querySelectorAll(".app-shelf")];
  const status = document.querySelector("#result-status");
  const empty = document.querySelector("#empty-state");
  const itemName = "App";
  const marquee = document.querySelector(".app-marquee-message");
  const ledColors = ["#ff3b30", "#20b548", "#ffd20a", "#2b6cff"];
  let ledColorIndex = 0;
  let activeCategory = "";
  let currentColumns = 0;
  let resizeTimer;

  const normalize = (value) => value.toLocaleLowerCase("th").normalize("NFKC").trim();

  function columnsForViewport() {
    if (window.matchMedia("(max-width: 480px)").matches) return 2;
    if (window.matchMedia("(max-width: 760px)").matches) return 3;
    return 4;
  }

  function buildShelfLabels(plank, shelfCards) {
    const labelGrid = document.createElement("div");
    labelGrid.className = "app-label-grid";
    shelfCards.forEach((card) => {
      const plaque = document.createElement("button");
      plaque.className = "app-category-plaque";
      plaque.type = "button";
      plaque.dataset.categoryFilter = card.dataset.category;
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
      shelf.className = "app-shelf";
      shelf.setAttribute("aria-label", `ชั้น App ที่ ${number}`);
      const shelfCards = cards.slice(start, start + columns);
      const grid = document.createElement("div");
      grid.className = "app-grid";
      shelfCards.forEach((card) => grid.appendChild(card));
      const plank = document.createElement("div");
      plank.className = "app-shelf-plank";
      buildShelfLabels(plank, shelfCards);
      shelf.append(grid, plank);
      fragment.appendChild(shelf);
    }
    room.insertBefore(fragment, empty);
    shelves = [...room.querySelectorAll(".app-shelf")];
    currentColumns = columns;
    updateCatalog();
  }

  function updateCatalog() {
    const query = normalize(search.value);
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = !activeCategory || card.dataset.category === activeCategory;
      const matchesQuery = !query || normalize(card.dataset.search).includes(query);
      card.hidden = !(matchesCategory && matchesQuery);
      if (!card.hidden) visible += 1;
    });
    shelves.forEach((shelf) => {
      shelf.hidden = !shelf.querySelector(".app-card:not([hidden])");
      const shelfCards = [...shelf.querySelectorAll(".app-card")];
      const plaques = [...shelf.querySelectorAll(".app-category-plaque")];
      shelfCards.forEach((card, index) => {
        if (!plaques[index]) return;
        plaques[index].hidden = card.hidden;
        plaques[index].setAttribute(
          "aria-pressed",
          String(Boolean(activeCategory) && plaques[index].dataset.categoryFilter === activeCategory),
        );
      });
    });
    empty.hidden = visible !== 0;
    status.textContent = visible === cards.length
      ? `แสดง ${itemName} ทั้ง ${visible} รายการ`
      : `พบ ${itemName} ${visible} รายการ จากทั้งหมด ${cards.length} รายการ`;
  }

  search.addEventListener("input", updateCatalog);
  if (marquee) {
    marquee.style.setProperty("--led-color", ledColors[ledColorIndex]);
    marquee.addEventListener("animationiteration", () => {
      ledColorIndex = (ledColorIndex + 1) % ledColors.length;
      marquee.style.setProperty("--led-color", ledColors[ledColorIndex]);
    });
  }
  room.addEventListener("click", (event) => {
    const plaque = event.target.closest(".app-category-plaque[data-category-filter]");
    if (!plaque) return;
    const selected = plaque.dataset.categoryFilter;
    activeCategory = activeCategory === selected ? "" : selected;
    updateCatalog();
  });
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
      updateCatalog();
    }
  });
  layoutShelves();
})();
