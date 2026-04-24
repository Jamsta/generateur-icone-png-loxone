/* ════════════════════════════════════════════
   LOXONE ICON GENERATOR — APP.JS
   ════════════════════════════════════════════ */

'use strict';

// ─── STATE ───────────────────────────────────
const state = {
  svgRaw: null,          // SVG string original
  svgColored: null,      // SVG string après colorisation
  colorMode: 'solid',    // 'solid' | 'gradient' | 'original'
  iconColor: '#6DBE45',
  iconOpacity: 1,
  bgColor: '#FFFFFF',
  bgOpacity: 0,
  gradColor1: '#6DBE45',
  gradColor2: '#1A7D37',
  gradDirection: 90,
  padding: 10,
  cornerRadius: 0,
  rotation: 0,
  previewBg: '#F5F5F5',
  history: [],
};

// ─── DOM ─────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ─── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initColorTabs();
  initColorInputs();
  initSliders();
  initDropZone();
  initPreviewBg();
  initExport();
  initHistory();
  updateSizeCount();
});

// ════════════════════════════════════════════
// TABS
// ════════════════════════════════════════════
function initTabs() {
  // Source tabs
  $$('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('active'));
      $$('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      $('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // URL suggestions
  $$('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      $('svg-url').value = pill.dataset.url;
      loadFromUrl(pill.dataset.url);
    });
  });

  // Load URL button
  $('btn-load-url').addEventListener('click', () => {
    const url = $('svg-url').value.trim();
    if (!url) return showToast('Entrez une URL SVG', 'error');
    loadFromUrl(url);
  });
  $('svg-url').addEventListener('keydown', e => {
    if (e.key === 'Enter') $('btn-load-url').click();
  });

  // Load code button
  $('btn-load-code').addEventListener('click', () => {
    const code = $('svg-code').value.trim();
    if (!code) return showToast('Collez le code SVG', 'error');
    processSvg(code);
  });

  // File input
  $('file-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) readFile(file);
  });
}

// ════════════════════════════════════════════
// SVG LOADING
// ════════════════════════════════════════════
async function loadFromUrl(url) {
  showLoading(true);
  try {
    // Essai direct
    let res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text.includes('<svg') && !text.includes('<SVG')) throw new Error('Le fichier ne semble pas être un SVG valide');
    processSvg(text);
  } catch (err) {
    // Essai via proxy CORS public
    try {
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const res2 = await fetch(proxy);
      const text2 = await res2.text();
      if (!text2.includes('<svg') && !text2.includes('<SVG')) throw new Error('Format SVG invalide');
      processSvg(text2);
    } catch (err2) {
      showLoading(false);
      showToast('Impossible de charger le SVG : ' + err.message, 'error');
    }
  }
}

function readFile(file) {
  if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
    return showToast('Veuillez sélectionner un fichier SVG', 'error');
  }
  const reader = new FileReader();
  reader.onload = e => processSvg(e.target.result);
  reader.onerror = () => showToast('Erreur de lecture du fichier', 'error');
  reader.readAsText(file);
}

function processSvg(svgString) {
  showLoading(false);
  // Nettoyage basique
  svgString = svgString.trim();
  // Supprimer éventuel DOCTYPE / XML header
  svgString = svgString.replace(/<\?xml[^?]*\?>/gi, '').trim();
  svgString = svgString.replace(/<!DOCTYPE[^>]*>/gi, '').trim();

  // Vérifier que c'est un SVG
  if (!svgString.match(/<svg[\s>]/i)) {
    return showToast('Format SVG invalide', 'error');
  }

  state.svgRaw = svgString;
  applyColors();
  showToast('SVG chargé avec succès !', 'success');
}

// ════════════════════════════════════════════
// DROP ZONE
// ════════════════════════════════════════════
function initDropZone() {
  const zone = $('drop-zone');

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  });
}

// ════════════════════════════════════════════
// COLOR TABS
// ════════════════════════════════════════════
function initColorTabs() {
  $$('.color-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.color-tab').forEach(t => t.classList.remove('active'));
      $$('.color-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      state.colorMode = btn.dataset.mode;
      $('panel-' + btn.dataset.mode).classList.add('active');
      applyColors();
    });
  });
}

// ════════════════════════════════════════════
// COLOR INPUTS
// ════════════════════════════════════════════
function initColorInputs() {
  // ── Icône color ──
  syncColorPair($('icon-color'), $('icon-color-hex'), val => {
    state.iconColor = val;
    applyColors();
  });

  // ── Icône opacité ──
  $('icon-opacity').addEventListener('input', e => {
    state.iconOpacity = e.target.value / 100;
    $('icon-opacity-val').textContent = e.target.value + '%';
    applyColors();
  });

  // ── Fond color ──
  syncColorPair($('bg-color'), $('bg-color-hex'), val => {
    state.bgColor = val;
    applyColors();
  });

  // ── Fond opacité ──
  $('bg-opacity').addEventListener('input', e => {
    state.bgOpacity = e.target.value / 100;
    $('bg-opacity-val').textContent = e.target.value + '%';
    applyColors();
  });

  // ── Gradient ──
  syncColorPair($('grad-color1'), $('grad-color1-hex'), val => {
    state.gradColor1 = val;
    applyColors();
  });
  syncColorPair($('grad-color2'), $('grad-color2-hex'), val => {
    state.gradColor2 = val;
    applyColors();
  });
  $('grad-direction').addEventListener('change', e => {
    state.gradDirection = parseInt(e.target.value);
    applyColors();
  });

  // ── Presets ──
  $$('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      $('icon-color').value = color;
      $('icon-color-hex').value = color;
      state.iconColor = color;
      $$('.preset-btn').forEach(b => b.classList.remove('active-preset'));
      btn.classList.add('active-preset');
      applyColors();
    });
  });
}

function syncColorPair(colorEl, hexEl, onChange) {
  colorEl.addEventListener('input', () => {
    hexEl.value = colorEl.value.toUpperCase();
    onChange(colorEl.value);
  });
  hexEl.addEventListener('input', () => {
    const val = hexEl.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      colorEl.value = val;
      onChange(val);
    }
  });
  hexEl.addEventListener('blur', () => {
    let val = hexEl.value;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      hexEl.value = val.toUpperCase();
      colorEl.value = val;
      onChange(val);
    } else {
      hexEl.value = colorEl.value.toUpperCase();
    }
  });
}

// ════════════════════════════════════════════
// SLIDERS
// ════════════════════════════════════════════
function initSliders() {
  $('padding').addEventListener('input', e => {
    state.padding = parseInt(e.target.value);
    $('padding-val').textContent = e.target.value + '%';
    applyColors();
  });

  $('corner-radius').addEventListener('input', e => {
    state.cornerRadius = parseInt(e.target.value);
    $('corner-val').textContent = e.target.value + '%';
    applyColors();
  });

  $('rotation').addEventListener('input', e => {
    state.rotation = parseInt(e.target.value);
    $('rotation-val').textContent = e.target.value + '°';
    applyColors();
  });

  // Size checkboxes
  $$('input[name="size"]').forEach(cb => {
    cb.addEventListener('change', updateSizeCount);
  });
}

function updateSizeCount() {
  const checked = [...$$('input[name="size"]:checked')].length;
  $('selected-sizes-label').textContent = `${checked} taille(s) sélectionnée(s)`;
}

// ════════════════════════════════════════════
// COLOR APPLICATION
// ════════════════════════════════════════════
function applyColors() {
  if (!state.svgRaw) return;

  let svg = state.svgRaw;

  if (state.colorMode === 'solid') {
    svg = colorSvgSolid(svg, state.iconColor, state.iconOpacity);
  } else if (state.colorMode === 'gradient') {
    svg = colorSvgGradient(svg, state.gradColor1, state.gradColor2, state.gradDirection);
  } else {
    // original — on garde tel quel
    svg = state.svgRaw;
  }

  state.svgColored = svg;
  renderPreview();
}

function colorSvgSolid(svg, color, opacity) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return svg;

  // Appliquer la couleur sur tous les éléments dessinables
  const elements = svgEl.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, line, text, use');
  elements.forEach(el => {
    // Ne pas coloriser les éléments avec fill="none"
    const fill = el.getAttribute('fill');
    const stroke = el.getAttribute('stroke');
    const style = el.getAttribute('style') || '';

    if (fill !== 'none' && !style.includes('fill:none')) {
      el.setAttribute('fill', color);
      el.removeAttribute('fill-opacity');
    }
    if (stroke && stroke !== 'none') {
      el.setAttribute('stroke', color);
    }
  });

  // Si aucun attribut fill n'est sur les enfants, appliquer sur le SVG lui-même
  if (elements.length === 0) {
    svgEl.setAttribute('fill', color);
  }

  // Opacité globale
  if (opacity < 1) {
    svgEl.setAttribute('opacity', opacity);
  } else {
    svgEl.removeAttribute('opacity');
  }

  return new XMLSerializer().serializeToString(doc);
}

function colorSvgGradient(svg, color1, color2, angle) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return svg;

  // Calculer x1/y1/x2/y2 depuis l'angle
  const rad = (angle * Math.PI) / 180;
  const x2 = 50 + 50 * Math.cos(rad - Math.PI / 2);
  const y2 = 50 + 50 * Math.sin(rad - Math.PI / 2);
  const x1 = 100 - x2;
  const y1 = 100 - y2;

  // Créer le defs + linearGradient
  let defs = svgEl.querySelector('defs');
  if (!defs) {
    defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgEl.insertBefore(defs, svgEl.firstChild);
  }

  // Supprimer ancien gradient loxgen
  const oldGrad = defs.querySelector('#loxgen-grad');
  if (oldGrad) defs.removeChild(oldGrad);

  const grad = doc.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  grad.setAttribute('id', 'loxgen-grad');
  grad.setAttribute('x1', x1 + '%');
  grad.setAttribute('y1', y1 + '%');
  grad.setAttribute('x2', x2 + '%');
  grad.setAttribute('y2', y2 + '%');

  const stop1 = doc.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', color1);

  const stop2 = doc.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', color2);

  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);

  // Appliquer
  const elements = svgEl.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, line, text, use');
  elements.forEach(el => {
    const fill = el.getAttribute('fill');
    const style = el.getAttribute('style') || '';
    if (fill !== 'none' && !style.includes('fill:none')) {
      el.setAttribute('fill', 'url(#loxgen-grad)');
    }
  });

  if (elements.length === 0) {
    svgEl.setAttribute('fill', 'url(#loxgen-grad)');
  }

  return new XMLSerializer().serializeToString(doc);
}

// ════════════════════════════════════════════
// RENDER — CANVAS
// ════════════════════════════════════════════
async function renderToCanvas(canvas, size) {
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  // ── Fond ──
  if (state.bgOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = state.bgOpacity;
    if (state.cornerRadius > 0) {
      const r = (state.cornerRadius / 100) * (size / 2);
      roundRect(ctx, 0, 0, size, size, r);
      ctx.fillStyle = state.bgColor;
      ctx.fill();
    } else {
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, size, size);
    }
    ctx.restore();
  }

  // ── SVG ──
  const svg = state.svgColored || state.svgRaw;
  if (!svg) return;

  const pad = (state.padding / 100) * size;
  const drawSize = size - 2 * pad;

  // Injecter width/height dans le SVG pour l'image
  let svgForRender = ensureSvgDimensions(svg, drawSize, drawSize);

  const blob = new Blob([svgForRender], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((state.rotation * Math.PI) / 180);
      ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      ctx.restore();
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Erreur de rendu SVG'));
    };
    img.src = url;
  });
}

function ensureSvgDimensions(svg, w, h) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return svg;

  svgEl.setAttribute('width', w);
  svgEl.setAttribute('height', h);

  // Si pas de viewBox, en créer un depuis width/height originaux
  if (!svgEl.getAttribute('viewBox')) {
    const ow = svgEl.getAttribute('width') || '24';
    const oh = svgEl.getAttribute('height') || '24';
    const numW = parseFloat(ow) || 24;
    const numH = parseFloat(oh) || 24;
    svgEl.setAttribute('viewBox', `0 0 ${numW} ${numH}`);
  }

  return new XMLSerializer().serializeToString(doc);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ════════════════════════════════════════════
// PREVIEW
// ════════════════════════════════════════════
async function renderPreview() {
  if (!state.svgRaw) return;

  const previewCanvas = $('preview-canvas');
  const previewWrapper = $('preview-wrapper');
  const previewEmpty = $('preview-empty');

  try {
    await renderToCanvas(previewCanvas, 256);

    previewEmpty.hidden = true;
    previewCanvas.hidden = false;
    $('preview-sizes').hidden = false;
    $('preview-info').hidden = false;

    // Mini previews
    await renderToCanvas($('mini-48'), 48);
    await renderToCanvas($('mini-64'), 64);
    await renderToCanvas($('mini-128'), 128);

    // Info
    $('info-size').textContent = '256×256';

  } catch (err) {
    console.error('Erreur preview:', err);
    showToast('Erreur de prévisualisation', 'error');
  }
}

// ════════════════════════════════════════════
// PREVIEW BACKGROUND
// ════════════════════════════════════════════
function initPreviewBg() {
  $$('.bg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.bg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.previewBg = btn.dataset.bg;
      $('preview-wrapper').style.background = btn.dataset.bg;
    });
  });
}

// ════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════
function initExport() {
  $('btn-export-single').addEventListener('click', exportSingle);
  $('btn-export-all').addEventListener('click', exportAll);
}

async function exportSingle() {
  if (!state.svgRaw) return showToast('Chargez un SVG d\'abord', 'error');

  // Taille principale sélectionnée (la plus grande cochée)
  const sizes = getSelectedSizes();
  if (!sizes.length) return showToast('Sélectionnez au moins une taille', 'error');
  const size = sizes[sizes.length - 1];

  const canvas = $('render-canvas');
  await renderToCanvas(canvas, size);

  const filename = buildFilename(size);
  downloadCanvas(canvas, filename);
  addToHistory(canvas, filename, size);
  showToast(`${filename}.png téléchargé !`, 'success');
}

async function exportAll() {
  if (!state.svgRaw) return showToast('Chargez un SVG d\'abord', 'error');

  const sizes = getSelectedSizes();
  if (!sizes.length) return showToast('Sélectionnez au moins une taille', 'error');

  showToast('Génération du ZIP...', 'info');

  if (typeof JSZip === 'undefined') {
    return showToast('Erreur: JSZip non chargé', 'error');
  }

  const zip = new JSZip();
  const canvas = $('render-canvas');
  const loxoneNames = $('opt-loxone-names').checked;
  const includeSvg = $('opt-include-svg').checked;

  for (const size of sizes) {
    await renderToCanvas(canvas, size);
    const blob = await canvasToBlob(canvas);
    const name = loxoneNames
      ? buildLoxoneFilename($('filename').value || 'icon', size)
      : buildFilename(size);
    zip.file(name + '.png', blob);
  }

  if (includeSvg && state.svgColored) {
    const svgBlob = new Blob([state.svgColored], { type: 'image/svg+xml' });
    zip.file(($('filename').value || 'icon') + '.svg', svgBlob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(zipBlob);
  a.download = ($('filename').value || 'loxone-icons') + '.zip';
  a.click();
  URL.revokeObjectURL(a.href);

  showToast(`ZIP avec ${sizes.length} taille(s) téléchargé !`, 'success');

  // Ajouter la dernière taille dans l'historique
  await renderToCanvas(canvas, sizes[sizes.length - 1]);
  addToHistory(canvas, buildFilename(sizes[sizes.length - 1]), sizes[sizes.length - 1]);
}

function getSelectedSizes() {
  return [...$$('input[name="size"]:checked')]
    .map(cb => parseInt(cb.value))
    .sort((a, b) => a - b);
}

function buildFilename(size) {
  const base = $('filename').value.trim() || 'loxone-icon';
  return `${base}_${size}x${size}`;
}

function buildLoxoneFilename(base, size) {
  // Format Loxone: nom_WxH (ex: home_48x48)
  const clean = base.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  return `${clean}_${size}x${size}`;
}

function downloadCanvas(canvas, filename) {
  canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename + '.png';
    a.click();
    URL.revokeObjectURL(a.href);
  }, 'image/png');
}

function canvasToBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

// ════════════════════════════════════════════
// HISTORY
// ════════════════════════════════════════════
function initHistory() {
  $('btn-clear-history').addEventListener('click', () => {
    state.history = [];
    renderHistory();
  });
}

function addToHistory(canvas, name, size) {
  const thumb = canvas.toDataURL('image/png');
  const ts = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  state.history.unshift({ thumb, name, size, ts, dataUrl: thumb });

  // Max 12 items
  if (state.history.length > 12) state.history.pop();

  renderHistory();
}

function renderHistory() {
  const list = $('history-list');
  const empty = $('history-empty');
  const countBadge = $('history-count');
  const clearBtn = $('btn-clear-history');

  countBadge.textContent = state.history.length;

  if (!state.history.length) {
    if (empty) empty.hidden = false;
    clearBtn.hidden = true;
    list.innerHTML = '<p class="hint" id="history-empty">Aucune icône générée pour le moment.</p>';
    return;
  }

  clearBtn.hidden = false;

  list.innerHTML = state.history.map((item, i) => `
    <div class="history-item" data-index="${i}">
      <img class="history-thumb" src="${item.thumb}" alt="${item.name}" />
      <div class="history-info">
        <div class="history-name">${item.name}.png</div>
        <div class="history-meta">${item.size}×${item.size} px · ${item.ts}</div>
      </div>
      <button class="history-dl" title="Re-télécharger" data-index="${i}">⬇</button>
    </div>
  `).join('');

  // Listeners
  $$('.history-dl').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const item = state.history[parseInt(btn.dataset.index)];
      const a = document.createElement('a');
      a.href = item.dataUrl;
      a.download = item.name + '.png';
      a.click();
      showToast(`${item.name}.png re-téléchargé`, 'success');
    });
  });
}

// ════════════════════════════════════════════
// LOADING
// ════════════════════════════════════════════
function showLoading(show) {
  const wrapper = $('preview-wrapper');
  let overlay = wrapper.querySelector('.loading-overlay');
  if (show) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = '<div class="spinner"></div>';
      wrapper.appendChild(overlay);
    }
  } else {
    if (overlay) overlay.remove();
  }
}

// ════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════
let toastTimer;
function showToast(msg, type = 'success') {
  const el = $('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 3000);
}
