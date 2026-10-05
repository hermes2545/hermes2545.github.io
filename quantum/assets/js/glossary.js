/**
 * glossary.js — หน้าศัพท์รวม `/glossary` (§D.6, §E.1 ของสัญญาระหว่างโมดูล)
 * กรอง/ค้นหารายการ .gloss-item ที่ P4 render เป็น static HTML มาแล้วทั้งหมด — ทำงานฝั่ง client ล้วนๆ
 * ไม่มี network เลย (ไม่ fetch อะไรเพิ่ม) สลับการแสดงผลด้วย [hidden] เท่านั้น
 */
export function init() {
  const list = document.getElementById('gloss-list');
  if (!list) return; // ไม่ใช่หน้า glossary หรือ template ไม่มีส่วนนี้ (ไม่ควรเกิดตาม D.6)

  const input = document.getElementById('gloss-q');
  const filterGroup = document.querySelector('.gloss-filter');
  const empty = document.querySelector('.gloss-empty');
  const items = Array.from(list.querySelectorAll('.gloss-item'));

  let activeKind = 'all';

  function apply() {
    const query = input ? input.value.trim() : '';
    let anyVisible = false;
    items.forEach((item) => {
      const term = item.dataset.term || '';
      const kind = item.dataset.kind || '';
      const matchesKind = activeKind === 'all' || kind === activeKind;
      // ค้นหาแบบ substring case-sensitive ไทยเหมือน keyword retrieval ฝั่ง proxy (§B.1 ขั้น 2) เพื่อความสม่ำเสมอ
      const matchesQuery = !query || term.indexOf(query) !== -1;
      const visible = matchesKind && matchesQuery;
      item.hidden = !visible;
      if (visible) anyVisible = true;
    });
    if (empty) empty.hidden = anyVisible;
  }

  if (input) input.addEventListener('input', apply);

  if (filterGroup) {
    filterGroup.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-kind]');
      if (!b) return;
      activeKind = b.dataset.kind || 'all';
      Array.from(filterGroup.querySelectorAll('button[data-kind]')).forEach((btn) => {
        btn.setAttribute('aria-pressed', btn === b ? 'true' : 'false');
      });
      apply();
    });
  }

  apply();
}
