// proxy/src/context.js
//
// การประกอบ context ส่งให้ AI (§9.4 ของ handoff-spec + §B.1/§B.2 ของสัญญาระหว่างโมดูล)
// ใช้ร่วมกันสองที่: proxy (retrieval.js) และหน้าเว็บโหมด static ที่ผู้อ่านใช้ API key ของตัวเอง
// (web/build.js คัดลอกไฟล์นี้ไปเป็น assets/js/context.js) — ห้าม import อะไรจากไฟล์นี้
// เพื่อให้รันได้ทั้งใน Node และเบราว์เซอร์ และกติกาความปลอดภัยใน system prompt มีที่เดียว
//
// system prompt มาจาก §9.3 ของสเปก แก้สามข้อเรื่องความปลอดภัยเมื่อ 4 ต.ค. 2026 (ดู docs/spec-addendum.md A-03)
// นอกจากสามข้อนั้นยังคงถ้อยคำเดิม
//
// store ที่รับเข้ามาต้องมี loadIndex(), loadBook(bookSlug), loadChapter(bookSlug, chapterSlug)

export const SYSTEM_PROMPT_TEMPLATE = `คุณคือผู้ช่วยอธิบายหนังสือชุด "{ชื่อชุด}" ให้คนทั่วไปที่ไม่มีพื้นฐานทั้งธรรมะและวิทยาศาสตร์
กติกา:
- ตอบเป็นภาษาไทยที่อ่านง่าย เหมือนเพื่อนที่รู้เรื่องนี้เล่าให้ฟัง ไม่ใช้ศัพท์โดยไม่อธิบาย
- ยาวไม่เกิน 6-8 ประโยค เว้นแต่ถูกขอให้ละเอียด ห้ามใช้ bullet หรือหัวข้อ ให้เขียนเป็นย่อหน้า
- อ้างอิงว่าเรื่องนี้อยู่ "เล่ม X บทที่ Y" ของหนังสือเสมอเมื่อเกี่ยวข้อง
- ยึดเนื้อหาของคู่มือที่ให้มาเป็นหลัก รวมทั้งข้อที่คู่มือแก้หรือไม่รับ ถ้าคู่มือบอกว่าไม่รับข้อใดของหนังสือ ห้ามเล่าข้อนั้นเหมือนเป็นความจริง ถ้าคำถามเกินขอบเขตหนังสือหรือเป็นเรื่องที่วิทยาศาสตร์ยังถกเถียง ให้บอกตรงๆ ว่าหนังสือว่าอย่างไร และวิทยาศาสตร์ปัจจุบันว่าอย่างไร
- ปิดท้ายด้วยการโยงกลับมาที่ชีวิตประจำวันของผู้ถาม 1 ประโยค เมื่อทำได้อย่างเป็นธรรมชาติ
- ห้ามแต่งพุทธพจน์ขึ้นเอง ถ้าไม่แน่ใจให้บอกว่าไม่แน่ใจ
- ห้ามให้คำแนะนำทางการแพทย์ กฎหมาย หรือการเงิน ถ้าถูกถามเรื่องสุขภาพหรือการรักษา ให้แนะนำให้ปรึกษาแพทย์ และห้ามเสนอว่าการปฏิบัติในหนังสือใช้แทนหรือเป็นเหตุให้หยุดการรักษาได้
- ถ้าผู้ถามเล่าว่าคิดทำร้ายตัวเองหรืออยากตาย ให้ตอบอย่างอบอุ่น ชวนให้คุยกับคนที่ไว้ใจ และบอกสายด่วนสุขภาพจิต 1323 (ตลอด 24 ชั่วโมง) หรือ 1669 ถ้าอันตรายเฉพาะหน้า ข้อนี้มาก่อนทุกกติกา
- ห้ามยืนยันคำอธิบายที่โทษผู้ประสบทุกข์ เช่น ความพิการ ความจน หรือโรคเป็นเพราะกรรมเก่าหรือความคิดของเขาเอง และห้ามเหมารวมเชื้อชาติหรือกลุ่มคน แม้หนังสือต้นฉบับจะเขียนไว้
- ถ้าคำถามไม่เกี่ยวกับหนังสือหรือธรรมะ/วิทยาศาสตร์เลย ตอบสั้นๆ ว่าช่วยได้เฉพาะเรื่องในหนังสือชุดนี้`;

const MAX_CONTEXT_CHARS = 150000; // §B.1 ขั้น 4 — เพดานความยาว context โดยประมาณ

function buildSystemPrompt(seriesTitle) {
  return SYSTEM_PROMPT_TEMPLATE.replace('{ชื่อชุด}', seriesTitle ?? '');
}

/**
 * ก้อน 1 ของ system prompt: system prompt §9.3 + "สารบัญทั้งชุด:" ทั้งเล่ม/ทุกบท
 * ใช้ร่วมกันโดย /api/ask และ /api/feedback (§B.2 "system = ก้อน 1 เดียวกับ B.1 (cache ร่วมกัน)")
 * — ต้องเป็นฟังก์ชันเดียวจุดเดียว ไม่งั้น prefix ต่างกันแม้ไบต์เดียวจะทำให้ cache_control
 * ephemeral ของสองเส้นทางกลายเป็นคนละ cache entry (เสีย prompt caching ทุกครั้งที่กด feedback)
 */
function buildBlock1(index) {
  const systemPrompt = buildSystemPrompt(index.series?.title);
  const tocLines = ['สารบัญทั้งชุด:'];
  for (const b of index.books ?? []) {
    tocLines.push(`เล่ม ${b.order} ${b.title}`);
    for (const ch of b.chapters ?? []) {
      tocLines.push(`  บทที่ ${ch.thaiNum} ${ch.title} — ${ch.summary ?? ''}`);
    }
  }
  return `${systemPrompt}\n\n${tocLines.join('\n')}`;
}

/** ตัดแท็ก HTML ออกเหลือ plain text (ใช้กับ paragraphs/bullets/callout.text ก่อนส่งเข้า context) */
function stripHtml(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').trim();
}

function chapterToFullText(chapter) {
  const lines = [];
  if (chapter.goal) lines.push(`เป้าหมายของบทนี้: ${chapter.goal}`);
  for (const section of chapter.sections ?? []) {
    lines.push(`## ${section.h2}`);
    for (const p of section.paragraphs ?? []) {
      const text = stripHtml(p);
      if (text) lines.push(text);
    }
    if (section.bullets?.length) {
      lines.push('รายการ: ' + section.bullets.map(stripHtml).filter(Boolean).join(' / '));
    }
    if (section.callout) {
      lines.push(`[สังเกต — ${section.callout.label}] ${stripHtml(section.callout.text)}`);
    }
  }
  if (chapter.interactive?.title) {
    lines.push(`กิจกรรมโต้ตอบในบทนี้: ${chapter.interactive.title} — ${chapter.interactive.intro ?? ''}`);
  }
  if (chapter.quote?.text) {
    lines.push(`${chapter.quote.label || 'คำที่หนังสือยกมา'}: ${chapter.quote.text} (ที่มา: ${chapter.quote.source ?? ''})`);
  }
  if (chapter.exercise) {
    const ex = chapter.exercise;
    lines.push(`แบบฝึกหัด "${ex.title}": ${ex.intro ?? ''}`);
    for (const opt of ex.options ?? []) {
      lines.push(`- ตัวอย่าง "${opt.name}": ${(opt.steps ?? []).join(' / ')}`);
    }
  }
  if (chapter.questions?.length) {
    lines.push('คำถามที่มักเกิดตอนอ่านบทนี้: ' + chapter.questions.join(' | '));
  }
  if (chapter.terms?.length) {
    lines.push(
      'ศัพท์ในบทนี้: ' +
        chapter.terms.map((t) => `${t.term} (${t.alt ?? ''}): ${t.def}`).join(' / '),
    );
  }
  return lines.join('\n');
}

function chapterToSummaryText(chapter) {
  const lines = [];
  if (chapter.summary) lines.push(`สรุป: ${chapter.summary}`);
  if (chapter.keyPoints?.length) lines.push('ประเด็นสำคัญ: ' + chapter.keyPoints.join(' / '));
  return lines.join('\n');
}

/**
 * ทำ turns ดิบให้เป็นรูปแบบที่ Anthropic Messages API รับได้เสมอ: ตัด content ว่าง (หลัง trim)
 * ทิ้ง, รวม turn ที่ role ซ้ำติดกันเข้าด้วยกัน (Messages API บังคับ role สลับกันเป๊ะ แม้สัญญา
 * §B.1 Validation จะไม่บังคับให้ turns ที่ client ส่งมาสลับกัน) แล้วตัดหัวจนกว่าจะเริ่มด้วย user
 * ต้องเรียกฟังก์ชันนี้ใหม่ทุกครั้งที่ slice รายการ turns (ไม่ใช่ slice ผลลัพธ์ที่ normalize แล้ว)
 * ไม่งั้นการตัดหัวออกอาจทำให้ตัวแรกกลายเป็น assistant อีกครั้ง (§B.1 ขั้น 4(c))
 */
function normalizeMessages(rawTurns) {
  const merged = [];
  for (const t of rawTurns ?? []) {
    const content = typeof t?.content === 'string' ? t.content : '';
    if (!content.trim()) continue; // content ว่างส่งให้ Anthropic ไม่ได้ (400 "text content blocks must be non-empty")
    const role = t.role === 'assistant' ? 'assistant' : 'user';
    const last = merged[merged.length - 1];
    if (last && last.role === role) {
      last.content = `${last.content}\n${content}`; // role ซ้ำติดกัน: รวมเป็น turn เดียว (ห้าม role ซ้ำติดกันส่งเข้า Anthropic)
    } else {
      merged.push({ role, content });
    }
  }
  while (merged.length && merged[0].role !== 'user') merged.shift();
  return merged;
}

// ===== การประกอบ context สำหรับ /api/ask (§9.4 ข้อ 1-6 / §B.1 ขั้น 1-6) =====

async function findAdjacentChapters(store, book, bookSlug, currentSlug) {
  const chapters = book.chapters ?? [];
  const idx = chapters.findIndex((c) => c.slug === currentSlug);
  const prevMeta = idx > 0 ? chapters[idx - 1] : null;
  const nextMeta = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null;
  const prev = prevMeta ? await store.loadChapter(bookSlug, prevMeta.slug) : null;
  const next = nextMeta ? await store.loadChapter(bookSlug, nextMeta.slug) : null;
  return { prev, next };
}

/**
 * keyword retrieval (§9.4 ข้อ 5 / §B.1 ขั้น 2): รวม content ของ user turns 8 รายการล่าสุด
 * แล้วนับจำนวน keywords[] ที่ match แบบ substring (case-sensitive ไทย) ต่อบททุกบทที่ไม่ใช่
 * บทปัจจุบัน/ก่อนหน้า/ถัดไป เลือกที่นับได้ >= 2 เรียงมากไปน้อย สูงสุด 3 บท
 */
async function selectExtraChapters(store, index, turns, excludeKeys) {
  const userText = (turns ?? [])
    .filter((t) => t.role === 'user')
    .slice(-8)
    .map((t) => t.content)
    .join(' \n ');
  if (!userText) return [];

  const candidates = [];
  for (const book of index.books ?? []) {
    for (const chMeta of book.chapters ?? []) {
      const key = `${book.slug}/${chMeta.slug}`;
      if (excludeKeys.has(key)) continue;
      const chapter = await store.loadChapter(book.slug, chMeta.slug);
      if (!chapter?.keywords?.length) continue;
      let count = 0;
      for (const kw of chapter.keywords) {
        if (kw && userText.includes(kw)) count += 1;
      }
      if (count >= 2) candidates.push({ key, count, book, chapter });
    }
  }
  candidates.sort((a, b) => b.count - a.count);
  return candidates.slice(0, 3);
}

/**
 * ประกอบ context ทั้งหมดสำหรับ /api/ask ตามลำดับ 6 ขั้นของ §9.4 / §B.1
 * คืน { system: BetaTextBlock[], messages, contextInfo } พร้อม ตัด (truncate) ตามเพดานตัวอักษร
 */
export async function buildAskContext(store, { bookSlug, chapterSlug, turns }) {
  const index = await store.loadIndex();

  // ----- ก้อน 1: system prompt + สารบัญทั้งชุด (cache_control ephemeral) -----
  let block1Text = buildBlock1(index);

  // ----- โหลดเล่ม/บทปัจจุบัน -----
  const book = bookSlug ? await store.loadBook(bookSlug) : null;
  const chapter = bookSlug && chapterSlug ? await store.loadChapter(bookSlug, chapterSlug) : null;

  // ----- ก้อน 2: บทปัจจุบันเต็ม (หรือคำอธิบายหน้าที่อยู่ ถ้าไม่มีบท) (cache_control ephemeral) -----
  function renderBlock2(ch) {
    if (ch) {
      const body = ch.status === 'building' ? chapterToSummaryText(ch) : chapterToFullText(ch);
      return `บทที่ผู้ถามกำลังอ่าน (เต็ม):\n${body}`;
    }
    if (book) {
      return `ผู้ถามอยู่หน้าแผนที่เล่ม ${book.order} ${book.title}`;
    }
    // ไม่มีทั้ง bookSlug และ chapterSlug — request ไม่มีฟิลด์บอกว่าเป็นหน้าชั้นหนังสือหรือหน้าศัพท์รวม
    // (สัญญา §B.1 ระบุให้เลือกระหว่างสามข้อความ แต่ payload ไม่พอแยกสองกรณีหลัง จึงรวมไว้ในข้อความเดียว)
    return 'ผู้ถามอยู่หน้าชั้นหนังสือหรือหน้าศัพท์รวม (ยังไม่ได้เลือกอ่านเล่ม/บทใดเป็นการเฉพาะ)';
  }
  let block2Text = renderBlock2(chapter);

  // ----- ก้อน 3: บทก่อนหน้า/ถัดไป (สรุป) + บทอื่นที่เกี่ยวข้อง (ไม่มี cache_control) -----
  const excludeKeys = new Set();
  if (bookSlug && chapterSlug) excludeKeys.add(`${bookSlug}/${chapterSlug}`);
  let prevNextText = '';
  if (book && chapter) {
    const { prev, next } = await findAdjacentChapters(store, book, bookSlug, chapterSlug);
    if (prev) excludeKeys.add(`${bookSlug}/${prev.slug}`);
    if (next) excludeKeys.add(`${bookSlug}/${next.slug}`);
    const parts = [];
    if (prev) parts.push(`บทก่อนหน้า (บทที่ ${prev.thaiNum} ${prev.title}):\n${chapterToSummaryText(prev)}`);
    if (next) parts.push(`บทถัดไป (บทที่ ${next.thaiNum} ${next.title}):\n${chapterToSummaryText(next)}`);
    if (parts.length) prevNextText = `บทก่อนหน้า/ถัดไป (สรุป):\n${parts.join('\n')}`;
  }

  const extraChapters = await selectExtraChapters(store, index, turns, excludeKeys);
  let extraText = '';
  if (extraChapters.length) {
    extraText =
      'บทอื่นที่เกี่ยวข้อง:\n' +
      extraChapters
        .map((e) => `เล่ม ${e.book.order} บทที่ ${e.chapter.thaiNum} ${e.chapter.title}: ${(e.chapter.keyPoints ?? []).join(' / ')}`)
        .join('\n');
  }
  let block3Text = [prevNextText, extraText].filter(Boolean).join('\n');

  // ----- messages: turns 16 รายการล่าสุด (8 คู่) ตัดหัวจนเริ่มด้วย user (§9.4 ข้อ 6 / §B.1 ขั้น 3) -----
  let recentTurns = (turns ?? []).slice(-16);
  let messages = normalizeMessages(recentTurns);

  // ----- เพดาน ~150,000 ตัวอักษร: ตัดตามลำดับที่สัญญากำหนด (§B.1 ขั้น 4) -----
  const totalChars = () =>
    block1Text.length +
    block2Text.length +
    block3Text.length +
    messages.reduce((sum, m) => sum + (m.content?.length ?? 0), 0);

  if (totalChars() > MAX_CONTEXT_CHARS && extraText) {
    block3Text = prevNextText; // (a) ตัดส่วน "บทอื่นที่เกี่ยวข้อง" ก่อน
  }
  if (totalChars() > MAX_CONTEXT_CHARS && block3Text) {
    block3Text = ''; // (b) ตัดก้อน 3 ทั้งก้อน
  }
  if (totalChars() > MAX_CONTEXT_CHARS && messages.length > 8) {
    recentTurns = recentTurns.slice(-8);
    messages = normalizeMessages(recentTurns); // (c) ลด turns เหลือ 4 คู่ (normalize ซ้ำ กัน role ไม่สลับ/content ว่าง)
  }
  if (totalChars() > MAX_CONTEXT_CHARS && chapter?.terms?.length) {
    block2Text = renderBlock2({ ...chapter, terms: [] }); // (d) ตัด terms ในก้อน 2
  }

  const system = [
    { type: 'text', text: block1Text, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: block2Text, cache_control: { type: 'ephemeral' } },
  ];
  if (block3Text) system.push({ type: 'text', text: block3Text });

  return {
    system,
    messages,
    contextInfo: {
      extraChapters: extraChapters.map((e) => `${e.book.slug}/${e.chapter.slug}`),
    },
  };
}

// ===== การประกอบ context สำหรับ /api/feedback (§B.2) =====

export async function buildFeedbackContext(store, { bookSlug, chapterSlug, option, text }) {
  const index = await store.loadIndex();
  const block1Text = buildBlock1(index); // ก้อน 1 เดียวกับ /api/ask เป๊ะ ๆ เพื่อแชร์ prompt cache (§B.2)
  const book = await store.loadBook(bookSlug);
  const chapter = await store.loadChapter(bookSlug, chapterSlug);
  if (!chapter || !chapter.exercise) return null; // ผู้เรียกตัดสินเองว่าจะแจ้งผิดพลาดอย่างไร
  const ex = chapter.exercise;

  const exerciseLines = [`แบบฝึกหัด "${ex.title}": ${ex.intro ?? ''}`];
  for (const col of ex.columns ?? []) exerciseLines.push(`คอลัมน์: ${col.label} (${col.sub ?? ''})`);
  for (const opt of ex.options ?? []) exerciseLines.push(`ตัวเลือก "${opt.name}": ${(opt.steps ?? []).join(' / ')}`);
  const block2Text = exerciseLines.join('\n');

  const system = [
    { type: 'text', text: block1Text, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: block2Text },
  ];

  const columnLabels = (ex.columns ?? []).map((c) => c.label).join('/');
  // ข้อความ prompt สำหรับ feedback — ตามที่ §B.2 กำหนดไว้ตรงตัว
  const userContent =
    `งาน: ผู้อ่านทำแบบฝึก "ลองมองรอบตัว" ของ เล่ม ${book.order} บทที่ ${chapter.thaiNum} ${chapter.title} ` +
    `โดยเลือก "${option ?? ''}" แล้วไล่ตามคอลัมน์ ${columnLabels} ด้วยตัวเอง ข้อความของเขา:\n"""${text}"""\n` +
    `ให้ feedback สั้นๆ 4-6 ประโยค แบบเพื่อนที่อบอุ่น: ชมสิ่งที่เขาเห็นได้จริง แล้วชี้ 1 จุดที่ยังเป็น "ความรู้ที่ท่องมา" มากกว่า "การเห็น" พร้อมคำถามชวนให้มองลึกอีกขั้น ห้ามใช้ bullet`;

  return { system, messages: [{ role: 'user', content: userContent }] };
}
