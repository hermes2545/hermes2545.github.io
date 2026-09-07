const MAX_FILE_SIZE_BYTES = 80 * 1024 * 1024;

const state = {
  files: [],
  rows: new Map(),
  results: [],
  zipReady: false,
  busy: false,
};

const els = {
  dropzone: document.getElementById('dropzone'),
  fileInput: document.getElementById('fileInput'),
  pickFilesBtn: document.getElementById('pickFilesBtn'),
  clearBtn: document.getElementById('clearBtn'),
  convertBtn: document.getElementById('convertBtn'),
  downloadZipBtn: document.getElementById('downloadZipBtn'),
  fileList: document.getElementById('fileList'),
  template: document.getElementById('fileRowTemplate'),
  countStat: document.getElementById('countStat'),
  readyStat: document.getElementById('readyStat'),
  doneStat: document.getElementById('doneStat'),
  progressFill: document.getElementById('progressFill'),
  statusText: document.getElementById('statusText'),
};

const isHeic = (file) => /\.(heic|heif)$/i.test(file.name) || /image\/(heic|heif)/i.test(file.type);
const bytes = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 1 });

function formatSize(size) {
  if (!size) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${bytes.format(value)} ${units[idx]}`;
}

function setStatus(text) {
  els.statusText.textContent = text;
}

function updateStats() {
  els.countStat.textContent = state.files.length;
  els.readyStat.textContent = state.files.filter((f) => !f.error && !f.resultUrl).length;
  els.doneStat.textContent = state.results.length;
  els.clearBtn.disabled = state.files.length === 0 || state.busy;
  els.convertBtn.disabled = state.files.length === 0 || state.busy;
  els.downloadZipBtn.disabled = state.results.length === 0 || state.busy;
}

function setProgress(done, total) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  els.progressFill.style.width = `${pct}%`;
}

function clearRows() {
  els.fileList.innerHTML = '';
  state.rows.clear();
}

function resetApp() {
  state.files = [];
  state.results = [];
  state.zipReady = false;
  state.busy = false;
  els.fileInput.value = '';
  clearRows();
  els.fileList.classList.add('empty');
  els.fileList.innerHTML = `
    <div class="empty-state">
      <div class="empty-emoji">🖼️</div>
      <h3>ยังไม่มีไฟล์</h3>
      <p>เลือกรูป HEIC/HEIF หลายไฟล์ได้เลยค่ะ</p>
    </div>
  `;
  setProgress(0, 1);
  setStatus('ยังไม่ได้เลือกไฟล์ค่ะ');
  updateStats();
}

function ensureListVisible() {
  els.fileList.classList.remove('empty');
  if (els.fileList.querySelector('.empty-state')) els.fileList.innerHTML = '';
}

function createRow(file, index) {
  const clone = els.template.content.firstElementChild.cloneNode(true);
  const fileName = clone.querySelector('.file-name');
  const fileInfo = clone.querySelector('.file-info');
  const fileError = clone.querySelector('.file-error');
  const convertBtn = clone.querySelector('.convert-one');
  const downloadOne = clone.querySelector('.download-one');

  fileName.textContent = file.name;
  fileInfo.textContent = `${formatSize(file.size)} • ไฟล์ที่ ${index + 1}`;
  convertBtn.addEventListener('click', () => convertSingle(file.id));
  downloadOne.addEventListener('click', (e) => {
    if (!downloadOne.href) e.preventDefault();
  });

  els.fileList.appendChild(clone);
  state.rows.set(file.id, {
    root: clone,
    fileName,
    fileInfo,
    fileError,
    convertBtn,
    downloadOne,
  });
}

function addFiles(fileList) {
  const heicFiles = [...fileList].filter(isHeic);
  const incoming = heicFiles.filter((file) => file.size <= MAX_FILE_SIZE_BYTES);
  const oversizedCount = heicFiles.length - incoming.length;
  if (heicFiles.length === 0) {
    setStatus('ไฟล์ที่เลือกยังไม่ใช่ HEIC/HEIF ค่ะ');
    return;
  }
  if (incoming.length === 0) {
    setStatus('ไฟล์ HEIC/HEIF ใหญ่เกิน 80 MB ค่ะ กรุณาเลือกไฟล์ที่เล็กลง');
    return;
  }

  ensureListVisible();

  for (const file of incoming) {
    const id = `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`;
    const item = { id, file, resultUrl: '', resultBlob: null, error: '' };
    state.files.push(item);
    createRow(item, state.files.length - 1);
  }

  const skipped = oversizedCount ? ` ข้ามไฟล์ใหญ่เกิน 80 MB ${oversizedCount} ไฟล์ค่ะ` : '';
  setStatus(`เพิ่มไฟล์แล้ว ${incoming.length} ไฟล์ค่ะ${skipped}`);
  updateStats();
}

function markError(id, message) {
  const item = state.files.find((f) => f.id === id);
  if (!item) return;
  item.error = message;
  const row = state.rows.get(id);
  if (!row) return;
  row.fileError.textContent = message;
  row.fileError.classList.remove('hidden');
  row.convertBtn.disabled = false;
}

function markConverted(id, blob) {
  const item = state.files.find((f) => f.id === id);
  if (!item) return;
  item.resultBlob = blob;
  item.resultUrl = URL.createObjectURL(blob);
  const base = item.file.name.replace(/\.(heic|heif)$/i, '');
  const jpgName = `${base}.jpg`;
  const row = state.rows.get(id);
  if (!row) return;
  row.downloadOne.href = item.resultUrl;
  row.downloadOne.download = jpgName;
  row.downloadOne.classList.remove('hidden');
  row.convertBtn.textContent = 'แปลงแล้ว';
  row.convertBtn.disabled = true;
  row.fileInfo.textContent = `${formatSize(item.file.size)} • JPG พร้อมดาวน์โหลด`;
}

async function convertBlobToJpg(file) {
  if (typeof heic2any !== 'function') {
    throw new Error('โหลดตัวแปลง HEIC ไม่สำเร็จ กรุณาเช็กอินเทอร์เน็ตหรือรีเฟรชหน้าใหม่ค่ะ');
  }
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.92,
  });
  return converted;
}

async function convertSingle(id) {
  if (state.busy) return;
  const item = state.files.find((f) => f.id === id);
  const row = state.rows.get(id);
  if (!item || !row) return;

  row.convertBtn.disabled = true;
  row.convertBtn.textContent = 'กำลังแปลง...';
  row.fileError.classList.add('hidden');
  setStatus(`กำลังแปลง ${item.file.name} ...`);

  try {
    const blob = await convertBlobToJpg(item.file);
    const jpgBlob = blob instanceof Blob ? blob : blob[0];
    markConverted(id, jpgBlob);
    state.results = state.files.filter((f) => f.resultBlob).map((f) => ({ name: f.file.name.replace(/\.(heic|heif)$/i, '.jpg'), blob: f.resultBlob }));
    setStatus(`แปลงเสร็จ: ${item.file.name}`);
  } catch (error) {
    row.convertBtn.disabled = false;
    row.convertBtn.textContent = 'แปลงไฟล์นี้';
    markError(id, error?.message || 'แปลงไฟล์ไม่สำเร็จค่ะ');
    setStatus(`แปลงไม่สำเร็จ: ${item.file.name}`);
  } finally {
    updateStats();
  }
}

async function convertAll() {
  if (state.busy || state.files.length === 0) return;
  state.busy = true;
  els.convertBtn.disabled = true;
  els.clearBtn.disabled = true;
  els.downloadZipBtn.disabled = true;

  const queue = state.files.filter((f) => !f.resultBlob && !f.error);
  const total = queue.length;
  if (total === 0) {
    state.busy = false;
    updateStats();
    return;
  }

  setStatus(`เริ่มแปลงทั้งหมด ${total} ไฟล์ค่ะ`);
  setProgress(0, total);

  let done = 0;
  for (const item of queue) {
    const row = state.rows.get(item.id);
    if (row) {
      row.convertBtn.disabled = true;
      row.convertBtn.textContent = 'กำลังแปลง...';
      row.fileError.classList.add('hidden');
    }

    try {
      const converted = await convertBlobToJpg(item.file);
      const jpgBlob = converted instanceof Blob ? converted : converted[0];
      markConverted(item.id, jpgBlob);
      done += 1;
      state.results = state.files.filter((f) => f.resultBlob).map((f) => ({ name: f.file.name.replace(/\.(heic|heif)$/i, '.jpg'), blob: f.resultBlob }));
      setStatus(`แปลงแล้ว ${done}/${total} ไฟล์ค่ะ`);
    } catch (error) {
      markError(item.id, error?.message || 'แปลงไฟล์ไม่สำเร็จค่ะ');
      if (row) {
        row.convertBtn.disabled = false;
        row.convertBtn.textContent = 'แปลงไฟล์นี้';
      }
    }

    setProgress(done, total);
    updateStats();
  }

  state.busy = false;
  updateStats();
  setStatus(state.results.length > 0 ? 'แปลงครบแล้วค่ะ กดดาวน์โหลด ZIP ได้เลย' : 'ยังไม่มีไฟล์ที่แปลงสำเร็จค่ะ');
}

async function downloadZip() {
  if (!state.results.length) return;
  if (typeof JSZip !== 'function') {
    setStatus('โหลดตัวทำ ZIP ไม่สำเร็จค่ะ');
    return;
  }

  setStatus('กำลังสร้าง ZIP ...');
  els.downloadZipBtn.disabled = true;
  try {
    const zip = new JSZip();
    const folder = zip.folder('jpg-output');
    for (const item of state.results) {
      folder.file(item.name, item.blob);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heic-to-jpg-${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus('ดาวน์โหลด ZIP แล้วค่ะ');
  } catch (error) {
    setStatus(error?.message || 'สร้าง ZIP ไม่สำเร็จค่ะ');
  } finally {
    updateStats();
  }
}

function bindEvents() {
  els.pickFilesBtn.addEventListener('click', () => els.fileInput.click());
  els.fileInput.addEventListener('change', (event) => addFiles(event.target.files));
  els.clearBtn.addEventListener('click', () => {
    state.files.forEach((item) => {
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    resetApp();
  });
  els.convertBtn.addEventListener('click', convertAll);
  els.downloadZipBtn.addEventListener('click', downloadZip);

  ['dragenter', 'dragover'].forEach((type) => {
    els.dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      event.stopPropagation();
      els.dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((type) => {
    els.dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      event.stopPropagation();
      els.dropzone.classList.remove('dragover');
    });
  });

  els.dropzone.addEventListener('drop', (event) => {
    addFiles(event.dataTransfer.files);
  });
}

function init() {
  bindEvents();
  resetApp();
  setProgress(0, 1);
  if (typeof heic2any !== 'function') {
    setStatus('กำลังโหลดตัวแปลงไฟล์... ถ้าไม่ขึ้น ให้รีเฟรชหรือเช็กเน็ตค่ะ');
  }
}

init();
