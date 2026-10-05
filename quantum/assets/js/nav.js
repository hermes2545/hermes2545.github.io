/**
 * nav.js — ChapterRail / MobileTopbar (§D.2, §E.1 ของสัญญาระหว่างโมดูล)
 * ไม่ทำ SPA routing — ทุกลิงก์เป็น full navigation ปกติของเบราว์เซอร์ หน้าที่ของไฟล์นี้มีแค่สองอย่าง:
 *   1) #mobnav (select ของ MobileTopbar ที่ ≤860px) เปลี่ยนค่า -> ไปหน้านั้นด้วย location.assign
 *   2) Esc ปิด TermSheet และ AskPanel ถ้าเปิดอยู่ (เรียก terms.close()/ask.close() ตรงชื่อสัญญา)
 */
import { close as closeTerm } from './terms.js';
import { close as closeAsk } from './ask.js';

export function init() {
  const mobnav = document.getElementById('mobnav');
  if (mobnav) {
    mobnav.addEventListener('change', () => {
      const url = mobnav.value;
      if (url) window.location.assign(url);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    // close() ของทั้งสองโมดูลเช็ค hidden ก่อนทำงานอยู่แล้ว เรียกซ้ำได้อย่างปลอดภัยแม้อีกฝั่งไม่ได้เปิดอยู่
    closeTerm();
    closeAsk();
  });
}
