(() => {
  "use strict";

  const search = document.querySelector("#book-search");
  const buttons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".book-card")];
  const room = document.querySelector(".bookshelf-room");
  let shelves = [...document.querySelectorAll(".shelf")];
  const status = document.querySelector("#result-status");
  const empty = document.querySelector("#empty-state");
  const isAudio = document.body.classList.contains("audio-page");
  const itemName = isAudio ? "หนังสือเสียง" : "หนังสือ";
  const itemUnit = isAudio ? "รายการ" : "เล่ม";
  let activeCategory = "ทั้งหมด";
  let currentColumns = 0;
  let resizeTimer;

  const normalize = (value) => value.toLocaleLowerCase("th").normalize("NFKC").trim();

  function columnsForViewport() {
    if (window.matchMedia("(max-width: 480px)").matches) return 2;
    if (window.matchMedia("(max-width: 650px)").matches) return 3;
    if (window.matchMedia("(max-width: 900px)").matches) return 4;
    return 5;
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

      const grid = document.createElement("div");
      grid.className = "book-grid";
      cards.slice(start, start + columns).forEach((card) => grid.appendChild(card));

      const plank = document.createElement("div");
      plank.className = "shelf-plank";
      plank.setAttribute("aria-hidden", "true");
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
      const matchesCategory = activeCategory === "ทั้งหมด" || card.dataset.category === activeCategory;
      const matchesQuery = !query || normalize(card.dataset.search).includes(query);
      card.hidden = !(matchesCategory && matchesQuery);
      if (!card.hidden) visible += 1;
    });

    shelves.forEach((shelf) => {
      shelf.hidden = !shelf.querySelector(".book-card:not([hidden])");
    });

    empty.hidden = visible !== 0;
    status.textContent = visible === cards.length
      ? `แสดง${itemName}ทั้ง ${visible} ${itemUnit}`
      : `พบ${itemName} ${visible} ${itemUnit} จากทั้งหมด ${cards.length} ${itemUnit}`;
  }

  search.addEventListener("input", updateCatalog);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      updateCatalog();
    });
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
