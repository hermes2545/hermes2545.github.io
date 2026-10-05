/**
 * app.js — entry point (§E.1 ของสัญญาระหว่างโมดูล) โหลดโดย layout.html เป็น
 * `<script type="module" src="/assets/js/app.js">` ท้าย body (§D.2)
 *
 * อ่าน document.body.dataset.page แล้ว boot โมดูลตามตาราง §E.1:
 *   ทุกหน้า: nav.init(), terms.init(), ask.init(), progress.init()
 *   page=chapter: เพิ่ม exercise.init(), interactive.init()
 *   page=glossary: เพิ่ม glossary.init()
 * และเรียก source-footer.init() ทุกหน้าด้วย (SourceFooter render อยู่ทุกหน้าตาม §D.2/D.8 แม้ตารางไฟล์ใน
 * §E.1 จะไม่ได้แยกแถวไว้ — ไม่มี boot อื่นใดเรียก init ของไฟล์นี้ ถ้าขาดไปจะไม่มีผลใดๆ เกิดขึ้นกับ SourceFooter เลย)
 */
import { init as navInit } from './nav.js';
import { init as termsInit } from './terms.js';
import { init as askInit } from './ask.js';
import { init as progressInit } from './progress.js';
import { init as sourceFooterInit } from './source-footer.js';
import { init as exerciseInit } from './exercise.js';
import { init as interactiveInit } from './interactive.js';
import { init as glossaryInit } from './glossary.js';

function boot() {
  const page = document.body.dataset.page;

  navInit();
  termsInit();
  askInit();
  progressInit();
  sourceFooterInit();

  // exercise.js/interactive.js/glossary.js เอง no-op เงียบๆ เมื่อ element ที่ต้องการไม่มีอยู่ในหน้า
  // (ดู guard clause ในแต่ละไฟล์) แต่ยังเรียกเฉพาะหน้าที่ตารางสัญญา §E.1 ระบุไว้ตรงๆ เพื่อไม่ผูก event
  // โดยไม่จำเป็นบนหน้าที่ไม่เกี่ยวข้องเลย
  if (page === 'chapter') {
    exerciseInit();
    interactiveInit();
  }

  if (page === 'glossary') {
    glossaryInit();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
