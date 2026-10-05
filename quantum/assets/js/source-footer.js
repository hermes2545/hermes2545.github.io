/**
 * source-footer.js — SourceFooter (A-01 ใน spec-addendum.md, §D.8 ของสัญญาระหว่างโมดูล)
 *
 * รายการเล่ม+ลิงก์ PDF ถูก render เป็น static HTML แล้วโดย build.js (P4) จาก content/index.json ตอน build
 * (เรียงเล่มที่กำลังอ่านขึ้นก่อนและใส่ class .sf-current ให้แล้ว) — ไฟล์นี้จึง "ไม่ fetch" อะไรเพิ่มเลย
 * มีหน้าที่แค่เสริมพฤติกรรมฝั่ง client ตามที่สัญญาอนุญาต (optional): ใส่ class .sf-opened ให้ความรู้สึก
 * ตอบสนองหลังคลิก และกันพลาดกรณี template ไม่ได้ใส่ target/rel มาให้ (ป้องกัน tab ใหม่โดนควบคุมจากหน้าเก่า)
 *
 * ข้อห้ามที่ต้องเคารพ: ห้าม preventDefault (ต้องให้เบราว์เซอร์เปิดลิงก์เองตามปกติ),
 * ห้าม fetch/HEAD ล่วงหน้าก่อนคลิก (ไม่เรียก API ตอนโหลดหน้า / ไม่ preload)
 */

export function init() {
  const footer = document.getElementById('source-footer');
  if (!footer) return;

  footer.querySelectorAll('a.sf-item[href]').forEach((a) => {
    if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
    if (!a.hasAttribute('rel')) a.setAttribute('rel', 'noopener');
    a.addEventListener('click', () => {
      a.classList.add('sf-opened');
    });
  });
}
