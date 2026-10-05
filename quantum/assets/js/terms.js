/**
 * terms.js — ชื่อไฟล์ตายตัวตามสัญญาระหว่างโมดูล §E.1 (TermSheet, export: init, open, close)
 * เนื้อจริงถูกเขียนไว้ที่ term-sheet.js ในงานนี้ (ดูหมายเหตุที่หัวไฟล์นั้น) ไฟล์นี้ re-export ให้ชื่อไฟล์
 * ตรงตามสัญญา §E.1 เป๊ะ เพื่อไม่ให้โมดูลอื่น (เช่น app.js/nav.js ที่ import ตามชื่อสัญญาโดยตรง) resolve
 * ไม่เจอแล้วทำให้ ES module chain ทั้งหน้าพังตามที่ reviewer พบ (blocker #2 / major #5)
 */
export { init, open, close } from './term-sheet.js';
