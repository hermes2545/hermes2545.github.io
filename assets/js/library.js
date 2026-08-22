(() => {
  "use strict";

  const search = document.querySelector("#book-search");
  const buttons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".book-card")];
  const shelves = [...document.querySelectorAll(".shelf")];
  const status = document.querySelector("#result-status");
  const empty = document.querySelector("#empty-state");
  const isAudio = document.body.classList.contains("audio-page");
  const itemName = isAudio ? "หนังสือเสียง" : "หนังสือ";
  const itemUnit = isAudio ? "รายการ" : "เล่ม";
  let activeCategory = "ทั้งหมด";

  const normalize = (value) => value.toLocaleLowerCase("th").normalize("NFKC").trim();

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
})();
