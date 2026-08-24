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
    status.textContent = visible === cards.length
      ? `แสดง${itemName}ทั้ง ${visible} ${itemUnit}`
      : `พบ${itemName} ${visible} ${itemUnit} จากทั้งหมด ${cards.length} ${itemUnit}`;
  }

  search.addEventListener("input", updateCatalog);

  room.addEventListener("click", (event) => {
    const plaque = event.target.closest(".shelf-category-plaque[data-category-filter]");
    if (!plaque || isAudio) return;
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
