/* ════════════════════════════════════════════
   LOXONE ICON GENERATOR — APP.JS v2
   Specs Loxone : viewBox 0 0 24 24, fill=black,
   fill-rule=evenodd, clip-rule=evenodd, no stroke
   ════════════════════════════════════════════ */
'use strict';

// ─── COULEURS LOXONE CONFIG EXACTES ─────────
// Extraites de l'interface Loxone Config (sélecteur de couleur officiel)
const LOXONE_COLORS = [
  { hex: '#85FF66', name: 'Vert Loxone'    },
  { hex: '#FF1B66', name: 'Rose vif'       },
  { hex: '#FF6E33', name: 'Orange'         },
  { hex: '#FFD93A', name: 'Jaune'          },
  { hex: '#6EDFFF', name: 'Cyan'           },
  { hex: '#FF5AD6', name: 'Magenta'        },
  { hex: '#9B6CFF', name: 'Violet'         },
  { hex: '#2D8BFF', name: 'Bleu'           },
  { hex: '#888888', name: 'Gris'           },
];

// ─── PALETTE ÉTENDUE ─────────────────────────
const EXT_COLORS = [
  '#FFFFFF','#F5F5F5','#E0E0E0','#9E9E9E','#616161','#212121',
  '#6DBE45','#1A7D37','#388E3C','#A5D6A7',
  '#FF5722','#FF9800','#FFC107','#FFEB3B',
  '#2196F3','#03A9F4','#00BCD4','#009688',
  '#9C27B0','#673AB7','#3F51B5','#E91E63',
  '#F44336','#795548','#607D8B','#455A64',
];

// ─── STATE ───────────────────────────────────
const state = {
  svgRaw: null,
  svgColored: null,
  iconColor: '#6DBE45',
  iconOpacity: 1,
  bgColor: '#FFFFFF',
  bgOpacity: 0,
  padding: 0,
  cornerRadius: 0,
  rotation: 0,
  previewBg: '#F0F2F5',
  currentIconName: null,
  history: [],
};

// ─── DOM ─────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);

// ════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  buildLoxonePalette();
  buildExtPalette();
  buildIconGrid();
  initTabs();
  initColorInputs();
  initSliders();
  initDropZone();
  initPreviewBg();
  initExport();
  initHistory();
  updateSizeLabel();
});

// ════════════════════════════════════════════
// PALETTES
// ════════════════════════════════════════════
function buildLoxonePalette() {
  const el = $('loxone-palette');
  el.innerHTML = '';
  LOXONE_COLORS.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'lox-color-btn' + (i === 0 ? ' active' : '');
    btn.style.background = c.hex;
    btn.title = c.name + ' — ' + c.hex;
    btn.dataset.color = c.hex;
    btn.addEventListener('click', () => {
      $$('.lox-color-btn').forEach(b => b.classList.remove('active'));
      $$('.ext-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setIconColor(c.hex);
    });
    el.appendChild(btn);
  });
}

function buildExtPalette() {
  const el = $('ext-palette');
  el.innerHTML = '';
  EXT_COLORS.forEach(hex => {
    const btn = document.createElement('button');
    btn.className = 'ext-color-btn';
    btn.style.background = hex;
    btn.style.border = hex === '#FFFFFF' ? '2px solid #ddd' : '2px solid transparent';
    btn.title = hex;
    btn.dataset.color = hex;
    btn.addEventListener('click', () => {
      $$('.lox-color-btn').forEach(b => b.classList.remove('active'));
      $$('.ext-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setIconColor(hex);
    });
    el.appendChild(btn);
  });
}

function setIconColor(hex) {
  state.iconColor = hex;
  $('icon-color').value = hex;
  $('icon-color-hex').value = hex.toUpperCase();
  applyAndRender();
}

// ════════════════════════════════════════════
// BIBLIOTHÈQUE D'ICÔNES
// ════════════════════════════════════════════
function buildIconGrid(filter = '') {
  const grid = $('icon-grid');
  const countEl = $('search-count');
  const term = filter.toLowerCase().trim();
  const list = term
    ? LOXONE_ICONS.filter(n => n.toLowerCase().includes(term))
    : LOXONE_ICONS;

  countEl.textContent = list.length;
  grid.innerHTML = '';

  // Rendu virtuel : on crée les éléments par batch
  const frag = document.createDocumentFragment();
  list.forEach(name => {
    const item = document.createElement('div');
    item.className = 'icon-item' + (state.currentIconName === name ? ' selected' : '');
    item.dataset.name = name;
    item.title = name;

    // Utilise une img avec src vers icons/
    const img = document.createElement('img');
    img.src = `icons/${name}.svg`;
    img.alt = name;
    img.loading = 'lazy';
    img.onerror = () => { img.style.opacity = '0.2'; };
    // Coloriser via CSS filter (pour la preview dans la grille)
    applyImgColor(img, state.iconColor);

    const label = document.createElement('span');
    label.className = 'icon-label';
    label.textContent = name.replace(/-/g, ' ');

    item.appendChild(img);
    item.appendChild(label);

    item.addEventListener('click', () => {
      $$('.icon-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      state.currentIconName = name;
      $('filename').value = name;
      loadIconFromLibrary(name);
    });

    frag.appendChild(item);
  });
  grid.appendChild(frag);
}

// Applique une couleur à une img SVG via CSS filter
function applyImgColor(img, hexColor) {
  if (hexColor === '#000000' || hexColor === '#212121') {
    img.style.filter = '';
    return;
  }
  if (hexColor === '#FFFFFF' || hexColor === '#F5F5F5') {
    img.style.filter = 'invert(1)';
    return;
  }
  // Convertir hex → filtre CSS approximatif via hue-rotate
  const filter = hexToFilter(hexColor);
  img.style.filter = filter;
}

// Conversion hex → CSS filter pour coloriser les SVG noirs
// Méthode : on applique la couleur cible via un filtre CSS précis
function hexToFilter(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  // Luminosité perçue
  const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
  // HSL
  const rn=r/255, gn=g/255, bn=b/255;
  const max=Math.max(rn,gn,bn), min=Math.min(rn,gn,bn);
  let h=0, s=0, l=(max+min)/2;
  if(max!==min){
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){
      case rn: h=((gn-bn)/d+(gn<bn?6:0))/6; break;
      case gn: h=((bn-rn)/d+2)/6; break;
      case bn: h=((rn-gn)/d+4)/6; break;
    }
  }
  const hDeg=Math.round(h*360);
  const sat=Math.round(s*100);
  const bri=Math.round(lum*200);
  return `brightness(0) saturate(100%) invert(1) sepia(1) saturate(5) hue-rotate(${hDeg-30}deg) brightness(${Math.max(0.3, lum*1.8).toFixed(2)})`;
}

async function loadIconFromLibrary(name) {
  showLoading(true);
  try {
    const res = await fetch(`icons/${name}.svg`);
    if (!res.ok) throw new Error('Icône introuvable');
    const text = await res.text();
    processSvg(text, name);
  } catch(e) {
    showLoading(false);
    showToast('Erreur chargement icône', 'err');
  }
}

// Recherche
$('icon-search').addEventListener('input', e => {
  buildIconGrid(e.target.value);
});

// ════════════════════════════════════════════
// TABS
// ════════════════════════════════════════════
function initTabs() {
  $$('#source-tabs .tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#source-tabs .tab').forEach(t => t.classList.remove('active'));
      $$('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      $('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  $('btn-load-url').addEventListener('click', () => {
    const url = $('svg-url').value.trim();
    if (!url) return showToast('Entrez une URL SVG', 'err');
    loadFromUrl(url);
  });
  $('svg-url').addEventListener('keydown', e => { if(e.key==='Enter') $('btn-load-url').click(); });

  $('btn-load-code').addEventListener('click', () => {
    const code = $('svg-code').value.trim();
    if (!code) return showToast('Collez du code SVG', 'err');
    processSvg(code);
  });

  $('file-input').addEventListener('change', e => {
    if (e.target.files[0]) readFile(e.target.files[0]);
  });
}

// ════════════════════════════════════════════
// SVG LOADING
// ════════════════════════════════════════════
async function loadFromUrl(url) {
  showLoading(true);
  try {
    let text;
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error();
      text = await r.text();
    } catch {
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const r2 = await fetch(proxy);
      text = await r2.text();
    }
    if (!text.includes('<svg') && !text.includes('<SVG')) throw new Error('Pas un SVG');
    processSvg(text);
  } catch(e) {
    showLoading(false);
    showToast('Impossible de charger le SVG', 'err');
  }
}

function readFile(file) {
  if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml')
    return showToast('Fichier SVG requis', 'err');
  const reader = new FileReader();
  reader.onload = e => processSvg(e.target.result);
  reader.readAsText(file);
}

function processSvg(raw, name = null) {
  let svg = raw.trim()
    .replace(/<\?xml[^?]*\?>/gi, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .trim();
  if (!svg.match(/<svg[\s>]/i)) {
    showLoading(false);
    return showToast('SVG invalide', 'err');
  }
  state.svgRaw = svg;
  if (name) {
    state.currentIconName = name;
    $('current-icon-name').textContent = name;
    $('current-icon-name').hidden = false;
    $('filename').value = name;
  }
  applyAndRender();
  showToast(name ? `Icône "${name}" chargée` : 'SVG chargé !', 'ok');
}

// ════════════════════════════════════════════
// DROP ZONE
// ════════════════════════════════════════════
function initDropZone() {
  const zone = $('drop-zone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
  });
}

// ════════════════════════════════════════════
// COLOR INPUTS
// ════════════════════════════════════════════
function initColorInputs() {
  syncColor($('icon-color'), $('icon-color-hex'), val => { state.iconColor = val; applyAndRender(); });
  syncColor($('bg-color'), $('bg-color-hex'), val => { state.bgColor = val; applyAndRender(); });

  $('icon-opacity').addEventListener('input', e => {
    state.iconOpacity = e.target.value / 100;
    $('icon-opacity-val').textContent = e.target.value + '%';
    applyAndRender();
  });
  $('bg-opacity').addEventListener('input', e => {
    state.bgOpacity = e.target.value / 100;
    $('bg-opacity-val').textContent = e.target.value + '%';
    applyAndRender();
  });
}

function syncColor(colorEl, hexEl, cb) {
  colorEl.addEventListener('input', () => {
    hexEl.value = colorEl.value.toUpperCase();
    cb(colorEl.value);
    syncPaletteActive(colorEl.value);
  });
  hexEl.addEventListener('input', () => {
    const v = hexEl.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) { colorEl.value = v; cb(v); syncPaletteActive(v); }
  });
  hexEl.addEventListener('blur', () => {
    let v = hexEl.value;
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      hexEl.value = v.toUpperCase(); colorEl.value = v; cb(v); syncPaletteActive(v);
    } else { hexEl.value = colorEl.value.toUpperCase(); }
  });
}

function syncPaletteActive(hex) {
  const norm = hex.toUpperCase();
  $$('.lox-color-btn').forEach(b => b.classList.toggle('active', b.dataset.color.toUpperCase() === norm));
  $$('.ext-color-btn').forEach(b => b.classList.toggle('active', b.dataset.color.toUpperCase() === norm));
  // Mettre à jour les imgs de la grille
  $$('.icon-item img').forEach(img => applyImgColor(img, hex));
}

// ════════════════════════════════════════════
// SLIDERS
// ════════════════════════════════════════════
function initSliders() {
  $('padding').addEventListener('input', e => {
    state.padding = +e.target.value; $('padding-val').textContent = e.target.value + '%'; applyAndRender();
  });
  $('corner-radius').addEventListener('input', e => {
    state.cornerRadius = +e.target.value; $('corner-val').textContent = e.target.value + '%'; applyAndRender();
  });
  $('rotation').addEventListener('input', e => {
    state.rotation = +e.target.value; $('rotation-val').textContent = e.target.value + '°'; applyAndRender();
  });
  $$('input[name="size"]').forEach(cb => cb.addEventListener('change', updateSizeLabel));
}

function updateSizeLabel() {
  const n = [...$$('input[name="size"]:checked')].length;
  $('sizes-label').textContent = `${n} taille(s) sélectionnée(s)`;
}

// ════════════════════════════════════════════
// SVG COLORISATION (fidèle aux specs Loxone)
// ════════════════════════════════════════════
function coloriseSvg(svgString, color, opacity) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return svgString;

  // Supprimer couleurs existantes inline pour repartir propre
  const allEls = svgEl.querySelectorAll('*');
  allEls.forEach(el => {
    const fill = el.getAttribute('fill');
    const style = (el.getAttribute('style') || '');
    // On colorise uniquement les éléments qui ne sont pas fill=none
    if (fill && fill !== 'none') {
      el.setAttribute('fill', color);
    }
    if (!fill && el.tagName !== 'defs' && el.tagName !== 'clipPath') {
      // Hérite : pas besoin de toucher
    }
    // Si fill est dans le style inline
    if (style.includes('fill:') && !style.includes('fill:none')) {
      el.setAttribute('style', style.replace(/fill:[^;]*/g, `fill:${color}`));
    }
  });

  // Le SVG lui-même
  svgEl.setAttribute('fill', color);

  // Opacité
  if (opacity < 1) svgEl.setAttribute('opacity', opacity.toFixed(2));
  else svgEl.removeAttribute('opacity');

  // S'assurer que viewBox est présent (standard Loxone : 0 0 24 24)
  if (!svgEl.getAttribute('viewBox')) {
    svgEl.setAttribute('viewBox', '0 0 24 24');
  }

  return new XMLSerializer().serializeToString(doc);
}

// ════════════════════════════════════════════
// APPLY + RENDER
// ════════════════════════════════════════════
function applyAndRender() {
  if (!state.svgRaw) return;
  state.svgColored = coloriseSvg(state.svgRaw, state.iconColor, state.iconOpacity);
  renderAll();
}

async function renderAll() {
  if (!state.svgRaw) return;
  try {
    // Preview principale 256px
    await renderToCanvas($('preview-canvas'), 256);
    $('preview-empty').hidden = true;
    $('preview-canvas').hidden = false;
    $('mini-strip').hidden = false;

    // Mini previews
    await renderToCanvas($('mini-48'), 48);
    await renderToCanvas($('mini-64'), 64);
    await renderToCanvas($('mini-128'), 128);

    showLoading(false);
  } catch(e) {
    showLoading(false);
    console.error(e);
  }
}

// ─── MOTEUR DE RENDU CANVAS ──────────────────
// Conforme aux specs Loxone : carré, fond transparent par défaut,
// fill-rule=evenodd, viewBox 0 0 24 24
async function renderToCanvas(canvas, size) {
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  // Fond
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

  // SVG colorisé
  const svg = state.svgColored || state.svgRaw;
  if (!svg) return;

  const pad = Math.round((state.padding / 100) * size);
  const drawSize = size - 2 * pad;

  // Injecter les dimensions dans le SVG
  const svgReady = prepareSvgForCanvas(svg, drawSize);

  const blob = new Blob([svgReady], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      if (state.rotation !== 0) ctx.rotate((state.rotation * Math.PI) / 180);
      ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      ctx.restore();
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Rendu SVG échoué')); };
    img.src = url;
  });
}

function prepareSvgForCanvas(svg, size) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return svg;

  // Forcer les dimensions
  svgEl.setAttribute('width', size);
  svgEl.setAttribute('height', size);

  // Assurer viewBox (standard Loxone 24x24)
  if (!svgEl.getAttribute('viewBox')) {
    const w = parseFloat(svgEl.getAttribute('width')) || 24;
    const h = parseFloat(svgEl.getAttribute('height')) || 24;
    svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }

  // Ajouter xmlns si manquant
  if (!svgEl.getAttribute('xmlns')) {
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
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
// PREVIEW BACKGROUND
// ════════════════════════════════════════════
function initPreviewBg() {
  $$('.bg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.bg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const stage = $('preview-stage');
      if (btn.dataset.bg === 'checker') {
        stage.style.background = '';
        stage.classList.add('checker-bg');
      } else {
        stage.classList.remove('checker-bg');
        stage.style.background = btn.dataset.bg;
      }
    });
  });
}

// ════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════
function initExport() {
  $('btn-export-single').addEventListener('click', exportSingle);
  $('btn-export-all').addEventListener('click', exportZip);
}

async function exportSingle() {
  if (!state.svgRaw) return showToast('Chargez une icône d\'abord', 'err');
  const sizes = getSelectedSizes();
  if (!sizes.length) return showToast('Sélectionnez au moins une taille', 'err');
  // Télécharger la taille la plus grande sélectionnée
  const size = sizes[sizes.length - 1];
  const canvas = $('render-canvas');
  await renderToCanvas(canvas, size);
  const fname = buildFilename(size);
  dlCanvas(canvas, fname);
  addToHistory(canvas, fname, size);
  showToast(`${fname}.png téléchargé !`, 'ok');
}

async function exportZip() {
  if (!state.svgRaw) return showToast('Chargez une icône d\'abord', 'err');
  if (typeof JSZip === 'undefined') return showToast('JSZip non disponible', 'err');
  const sizes = getSelectedSizes();
  if (!sizes.length) return showToast('Sélectionnez au moins une taille', 'err');

  showToast('Génération ZIP…', 'info');
  const zip = new JSZip();
  const canvas = $('render-canvas');
  const useLoxNames = $('opt-lox-names').checked;
  const inclSvg = $('opt-svg').checked;

  for (const size of sizes) {
    await renderToCanvas(canvas, size);
    const blob = await canvasBlob(canvas);
    const name = useLoxNames ? loxFilename(size) : buildFilename(size);
    zip.file(name + '.png', blob);
  }

  if (inclSvg && state.svgColored) {
    zip.file(baseName() + '.svg', new Blob([state.svgColored], { type: 'image/svg+xml' }));
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(zipBlob);
  a.download = baseName() + '_loxone.zip';
  a.click();
  URL.revokeObjectURL(a.href);

  // Historique avec la dernière taille
  await renderToCanvas(canvas, sizes[sizes.length - 1]);
  addToHistory(canvas, buildFilename(sizes[sizes.length - 1]), sizes[sizes.length - 1]);

  showToast(`ZIP (${sizes.length} taille${sizes.length > 1 ? 's' : ''}) téléchargé !`, 'ok');
}

function getSelectedSizes() {
  return [...$$('input[name="size"]:checked')].map(c => +c.value).sort((a, b) => a - b);
}
function baseName() { return ($('filename').value.trim() || 'icon').replace(/[^a-z0-9_\-]/gi, '_'); }
function buildFilename(size) { return `${baseName()}_${size}x${size}`; }
function loxFilename(size) { return `${baseName().toLowerCase()}_${size}x${size}`; }
function dlCanvas(canvas, name) {
  canvas.toBlob(b => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = name + '.png';
    a.click();
    URL.revokeObjectURL(a.href);
  }, 'image/png');
}
function canvasBlob(canvas) {
  return new Promise(res => canvas.toBlob(res, 'image/png'));
}

// ════════════════════════════════════════════
// HISTORY
// ════════════════════════════════════════════
function initHistory() {
  $('btn-clear-hist').addEventListener('click', () => {
    state.history = [];
    renderHistory();
  });
}

function addToHistory(canvas, name, size) {
  state.history.unshift({ dataUrl: canvas.toDataURL('image/png'), name, size });
  if (state.history.length > 24) state.history.pop();
  renderHistory();
}

function renderHistory() {
  const grid = $('history-grid');
  const empty = $('hist-empty');
  const badge = $('hist-count');
  const clearBtn = $('btn-clear-hist');

  badge.textContent = state.history.length;
  clearBtn.hidden = state.history.length === 0;

  if (!state.history.length) {
    grid.innerHTML = '<p class="hint" id="hist-empty">Aucune icône générée.</p>';
    return;
  }

  grid.innerHTML = state.history.map((item, i) => `
    <div class="hist-item" title="${item.name} — ${item.size}px" data-i="${i}">
      <img src="${item.dataUrl}" alt="${item.name}" />
      <div class="hist-dl" data-i="${i}">⬇</div>
    </div>
  `).join('');

  $$('.hist-dl').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const item = state.history[+btn.dataset.i];
      const a = document.createElement('a');
      a.href = item.dataUrl;
      a.download = item.name + '.png';
      a.click();
    });
  });
}

// ════════════════════════════════════════════
// LOADING
// ════════════════════════════════════════════
function showLoading(show) {
  const stage = $('preview-stage');
  let ov = stage.querySelector('.spinner-overlay');
  if (show) {
    if (!ov) {
      ov = document.createElement('div');
      ov.className = 'spinner-overlay';
      ov.innerHTML = '<div class="spinner"></div>';
      stage.appendChild(ov);
    }
  } else {
    if (ov) ov.remove();
  }
}

// ════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════
let toastTimer;
function showToast(msg, type = 'ok') {
  const el = $('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}
