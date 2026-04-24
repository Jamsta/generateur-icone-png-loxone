/* ════════════════════════════════════════════
   LOXONE ICON GENERATOR — APP.JS v3
   Colorisation : fill sur les paths uniquement
   (fill="none" préservé pour les découpes)
   Iconify API : https://api.iconify.design
   ════════════════════════════════════════════ */
'use strict';

// ─── COULEURS LOXONE CONFIG OFFICIEL ────────
// Exactement les couleurs du sélecteur Loxone Config
const LOXONE_COLORS = [
  { hex: '#85FF66', name: 'Vert Loxone'  },
  { hex: '#FF1B66', name: 'Rose vif'     },
  { hex: '#FF6E33', name: 'Orange'       },
  { hex: '#FFD93A', name: 'Jaune'        },
  { hex: '#6EDFFF', name: 'Cyan'         },
  { hex: '#FF5AD6', name: 'Magenta'      },
  { hex: '#9B6CFF', name: 'Violet'       },
  { hex: '#2D8BFF', name: 'Bleu'         },
  { hex: '#888888', name: 'Gris'         },
];

// ─── PALETTE ÉTENDUE ─────────────────────────
const EXT_COLORS = [
  // Blancs / Noirs / Gris
  { hex: '#FFFFFF', name: 'Blanc'        },
  { hex: '#F5F5F5', name: 'Gris clair'  },
  { hex: '#BDBDBD', name: 'Gris'        },
  { hex: '#616161', name: 'Gris foncé'  },
  { hex: '#212121', name: 'Noir'        },
  // Verts Loxone
  { hex: '#6DBE45', name: 'Loxone vert' },
  { hex: '#4CAF50', name: 'Vert'        },
  { hex: '#1A7D37', name: 'Vert foncé'  },
  { hex: '#A5D6A7', name: 'Vert pastel' },
  // Oranges / Rouges
  { hex: '#FF5722', name: 'Rouge-Orange' },
  { hex: '#F44336', name: 'Rouge'        },
  { hex: '#FF9800', name: 'Orange vif'   },
  { hex: '#FFC107', name: 'Ambre'        },
  // Bleus / Cyan
  { hex: '#2196F3', name: 'Bleu'         },
  { hex: '#03A9F4', name: 'Bleu clair'   },
  { hex: '#00BCD4', name: 'Cyan'         },
  { hex: '#009688', name: 'Teal'         },
  // Violets / Roses
  { hex: '#9C27B0', name: 'Violet'       },
  { hex: '#673AB7', name: 'Indigo foncé' },
  { hex: '#E91E63', name: 'Rose'         },
  { hex: '#795548', name: 'Brun'         },
];

// ─── STATE ───────────────────────────────────
const state = {
  svgRaw: null,
  svgColored: null,
  iconColor: '#85FF66',  // Vert Loxone par défaut
  iconOpacity: 1,
  bgColor: '#FFFFFF',
  bgOpacity: 0,
  padding: 0,
  cornerRadius: 0,
  rotation: 0,
  previewBg: '#F0F2F5',
  currentIconName: null,
  colorSelected: false,  // false = noir au 1er chargement, true = couleur choisie
  history: [],
  // Iconify
  ifyResults: [],
  ifyPage: 0,
  ifyPageSize: 36,
  ifyQuery: '',
  ifyPrefix: '',
};

const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);

// ════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  buildLoxonePalette();
  buildExtPalette();
  buildLoxGrid();
  initTabs();
  initColorInputs();
  initSliders();
  initDropZone();
  initPreviewBg();
  initExport();
  initHistory();
  initIconify();
  updateSizeLabel();
  // Sélectionner le vert Loxone par défaut
  $$('.lox-color-btn')[0]?.classList.add('active');
});

// ════════════════════════════════════════════
// PALETTES COULEURS
// ════════════════════════════════════════════
function buildLoxonePalette() {
  const el = $('loxone-palette');
  el.innerHTML = '';
  LOXONE_COLORS.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'lox-color-btn' + (i === 0 ? ' active' : '');
    btn.style.background = c.hex;
    btn.title = `${c.name} — ${c.hex}`;
    btn.dataset.color = c.hex;
    btn.addEventListener('click', () => {
      $$('.lox-color-btn, .ext-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setIconColor(c.hex);
    });
    el.appendChild(btn);
  });
}

function buildExtPalette() {
  const el = $('ext-palette');
  el.innerHTML = '';
  EXT_COLORS.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'ext-color-btn';
    btn.style.background = c.hex;
    btn.title = `${c.name} — ${c.hex}`;
    btn.dataset.color = c.hex;
    if (c.hex === '#FFFFFF') btn.style.border = '2px solid #ddd';
    btn.addEventListener('click', () => {
      $$('.lox-color-btn, .ext-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setIconColor(c.hex);
    });
    el.appendChild(btn);
  });
}

function setIconColor(hex) {
  state.iconColor = hex;
  state.colorSelected = true;  // L'utilisateur a choisi une couleur → afficher dans la prévisualisation
  $('icon-color').value = hex;
  $('icon-color-hex').value = hex.toUpperCase();
  applyAndRender();
}

// ════════════════════════════════════════════
// BIBLIOTHÈQUE LOXONE LOCALE (615 icônes)
// ════════════════════════════════════════════
function buildLoxGrid(filter = '') {
  const grid = $('lox-grid');
  const countEl = $('lox-count');
  const term = filter.toLowerCase().trim();
  const list = term
    ? LOXONE_ICONS.filter(n => n.toLowerCase().includes(term))
    : LOXONE_ICONS;

  countEl.textContent = list.length;
  grid.innerHTML = '';

  if (!list.length) {
    grid.innerHTML = '<p class="hint" style="padding:8px;grid-column:1/-1">Aucun résultat</p>';
    return;
  }

  const frag = document.createDocumentFragment();
  list.forEach(name => {
    const item = createIconItem(name, `icons/${name}.svg`, () => {
      $$('#lox-grid .icon-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      state.currentIconName = name;
      $('filename').value = name;
      loadIconFromLibrary(name);
    });
    if (state.currentIconName === name) item.classList.add('selected');
    frag.appendChild(item);
  });
  grid.appendChild(frag);
}

function createIconItem(name, imgSrc, onClick) {
  const item = document.createElement('div');
  item.className = 'icon-item';
  item.dataset.name = name;
  item.title = name;

  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = name;
  img.loading = 'lazy';
  img.onerror = () => { img.style.opacity = '0.15'; };
  // Grille toujours en noir — la couleur ne s'applique qu'au rendu PNG
  img.style.filter = 'none';

  const label = document.createElement('span');
  label.className = 'icon-label';
  label.textContent = name.replace(/-/g, ' ');

  item.appendChild(img);
  item.appendChild(label);
  item.addEventListener('click', onClick);
  return item;
}

// Colorisation des img SVG dans les grilles via CSS filter
// Les icônes Loxone sont noires → on applique un filtre pour les colorer
function applyImgFilter(img, hexColor) {
  const hex = hexColor.toUpperCase();
  if (hex === '#000000' || hex === '#212121' || hex === '#1A1A1A') {
    img.style.filter = 'none';
    return;
  }
  if (hex === '#FFFFFF' || hex === '#F5F5F5') {
    img.style.filter = 'invert(1)';
    return;
  }
  // Pour les couleurs Loxone connues → filtres CSS pré-calculés précis
  const knownFilters = {
    '#85FF66': 'brightness(0) saturate(100%) invert(84%) sepia(40%) saturate(600%) hue-rotate(65deg) brightness(1.1)',
    '#FF1B66': 'brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(700%) hue-rotate(315deg) brightness(1.0)',
    '#FF6E33': 'brightness(0) saturate(100%) invert(55%) sepia(80%) saturate(500%) hue-rotate(345deg) brightness(1.0)',
    '#FFD93A': 'brightness(0) saturate(100%) invert(90%) sepia(50%) saturate(600%) hue-rotate(10deg) brightness(1.0)',
    '#6EDFFF': 'brightness(0) saturate(100%) invert(85%) sepia(30%) saturate(500%) hue-rotate(170deg) brightness(1.0)',
    '#FF5AD6': 'brightness(0) saturate(100%) invert(55%) sepia(70%) saturate(500%) hue-rotate(270deg) brightness(1.0)',
    '#9B6CFF': 'brightness(0) saturate(100%) invert(50%) sepia(60%) saturate(500%) hue-rotate(230deg) brightness(1.0)',
    '#2D8BFF': 'brightness(0) saturate(100%) invert(45%) sepia(80%) saturate(500%) hue-rotate(200deg) brightness(1.0)',
    '#888888': 'brightness(0) saturate(100%) invert(55%) sepia(0%) saturate(0%) brightness(1.0)',
    '#6DBE45': 'brightness(0) saturate(100%) invert(65%) sepia(50%) saturate(500%) hue-rotate(65deg) brightness(0.9)',
  };
  if (knownFilters[hex]) {
    img.style.filter = knownFilters[hex];
    return;
  }
  // Calcul générique pour les autres couleurs
  img.style.filter = computeCssFilter(hexColor);
}

function computeCssFilter(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0;
  const l = (max+min)/2;
  if (max !== min) {
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break;
      case g: h = ((b-r)/d + 2)/6; break;
      case b: h = ((r-g)/d + 4)/6; break;
    }
  }
  const hDeg = Math.round(h*360);
  const sat  = Math.round(s*100);
  const lum  = Math.round(l*100);
  const bri  = Math.max(0.4, l*1.5).toFixed(2);
  return `brightness(0) saturate(100%) invert(${Math.round(l*80)}%) sepia(80%) saturate(${Math.max(200,sat*8)}) hue-rotate(${hDeg-30}deg) brightness(${bri})`;
}

async function loadIconFromLibrary(name) {
  showLoading(true);
  try {
    const res = await fetch(`icons/${name}.svg`);
    if (!res.ok) throw new Error('Icône introuvable : ' + name);
    const text = await res.text();
    processSvg(text, name);
  } catch(e) {
    showLoading(false);
    showToast('Erreur : ' + e.message, 'err');
  }
}

$('lox-search').addEventListener('input', e => buildLoxGrid(e.target.value));

// ════════════════════════════════════════════
// ICONIFY — API PUBLIQUE
// ════════════════════════════════════════════
function initIconify() {
  $('btn-ify-search').addEventListener('click', iconifySearch);
  $('ify-search').addEventListener('keydown', e => { if (e.key === 'Enter') iconifySearch(); });
}

async function iconifySearch() {
  const query = $('ify-search').value.trim();
  const prefix = $('ify-prefix').value;
  if (!query) return showToast('Entrez un terme de recherche', 'err');
  if (!prefix) return showToast('Choisissez une collection', 'err');

  state.ifyQuery = query;
  state.ifyPrefix = prefix;

  const grid = $('ify-grid');
  grid.innerHTML = '<div class="ify-loading"><div class="spinner"></div></div>';
  $('ify-result-count').hidden = true;

  try {
    // Recherche dans la collection choisie sans aucun filtre de variante
    const url = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=999&prefixes=${prefix}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Iconify indisponible');
    const data = await res.json();

    // Garder uniquement les résultats de la collection choisie
    state.ifyResults = (data.icons || []).filter(id => id.startsWith(prefix + ':'));

    if (!state.ifyResults.length) {
      // Fallback : recherche globale puis filtre
      const url2 = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=999`;
      const res2 = await fetch(url2);
      const data2 = await res2.json();
      state.ifyResults = (data2.icons || []).filter(id => id.startsWith(prefix + ':'));
    }

    if (!state.ifyResults.length) {
      grid.innerHTML = '<p class="hint ify-placeholder">Aucun résultat trouvé.<br><small>Essayez un autre terme.</small></p>';
      return;
    }
    renderIconifyAll();
  } catch(e) {
    grid.innerHTML = `<p class="hint ify-placeholder" style="color:#E03C31">❌ Erreur: ${e.message}</p>`;
  }
}

function renderIconifyAll() {
  const grid = $('ify-grid');
  const countEl = $('ify-result-count');
  const total = state.ifyResults.length;

  grid.innerHTML = '';
  countEl.hidden = false;
  countEl.textContent = `${total} icône${total > 1 ? 's' : ''} trouvée${total > 1 ? 's' : ''}`;

  const frag = document.createDocumentFragment();
  state.ifyResults.forEach(iconId => {
    const [prefix, ...rest] = iconId.split(':');
    const name = rest.join(':');
    const svgUrl = `https://api.iconify.design/${prefix}/${name}.svg`;

    const item = document.createElement('div');
    item.className = 'icon-item ify-item';
    item.title = iconId;
    item.dataset.iconId = iconId;

    const img = document.createElement('img');
    // On force color=000000 dans l'URL pour que l'icône s'affiche en noir dans la grille
    img.src = svgUrl + '?color=%23000000';
    img.alt = name;
    img.loading = 'lazy';
    img.onerror = () => { img.style.opacity = '0.15'; };
    img.style.filter = 'none';

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
      loadIconifyIcon(prefix, name);
    });

    frag.appendChild(item);
  });
  grid.appendChild(frag);
}

async function loadIconifyIcon(prefix, name) {
  showLoading(true);
  try {
    const url = `https://api.iconify.design/${prefix}/${name}.svg`;
    let text;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      text = await res.text();
    } catch {
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const r2 = await fetch(proxy);
      text = await r2.text();
    }
    if (!text.includes('<svg')) throw new Error('SVG invalide');
    processSvg(text, `${prefix}-${name}`);
  } catch(e) {
    showLoading(false);
    showToast('Impossible de charger depuis Iconify', 'err');
  }
}

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
  $('svg-url').addEventListener('keydown', e => { if (e.key === 'Enter') $('btn-load-url').click(); });

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
    if (!text.includes('<svg') && !text.includes('<SVG')) throw new Error('Pas un SVG valide');
    processSvg(text);
  } catch(e) {
    showLoading(false);
    showToast('Impossible de charger le SVG', 'err');
  }
}

// Normalise un SVG en remplaçant currentColor, inherit, etc. par black
// Indispensable pour les SVG Iconify qui utilisent currentColor
function normalizeSvgToBlack(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return svgString;

  // Racine SVG : si fill="currentColor" ou pas de fill → mettre black
  const rootFill = svgEl.getAttribute('fill');
  if (!rootFill || rootFill === 'currentColor' || rootFill === 'inherit') {
    svgEl.setAttribute('fill', 'black');
  }

  // Tous les éléments enfants
  svgEl.querySelectorAll('*').forEach(el => {
    const fill = el.getAttribute('fill');
    const stroke = el.getAttribute('stroke');
    const style = el.getAttribute('style') || '';

    // fill="currentColor" ou fill="inherit" → black
    if (fill === 'currentColor' || fill === 'inherit') {
      el.setAttribute('fill', 'black');
    }
    // stroke="currentColor" → black (pour les icônes mixtes)
    if (stroke === 'currentColor' || stroke === 'inherit') {
      el.setAttribute('stroke', 'black');
    }
    // Style inline avec currentColor
    if (style.includes('currentColor') || style.includes('inherit')) {
      el.setAttribute('style',
        style
          .replace(/fill\s*:\s*currentColor/gi, 'fill:black')
          .replace(/fill\s*:\s*inherit/gi, 'fill:black')
          .replace(/stroke\s*:\s*currentColor/gi, 'stroke:black')
          .replace(/stroke\s*:\s*inherit/gi, 'stroke:black')
      );
    }
  });

  // S'assurer que viewBox est présent
  if (!svgEl.getAttribute('viewBox')) {
    const w = parseFloat(svgEl.getAttribute('width')) || 24;
    const h = parseFloat(svgEl.getAttribute('height')) || 24;
    svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }

  return new XMLSerializer().serializeToString(doc);
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
  // Normaliser currentColor → black avant stockage
  svg = normalizeSvgToBlack(svg);
  state.svgRaw = svg;
  state.colorSelected = false;  // Nouvelle icône chargée → prévisualisation en noir
  if (name) {
    state.currentIconName = name;
    $('current-icon-name').textContent = name;
    $('current-icon-name').hidden = false;
    $('filename').value = name;
  } else {
    $('current-icon-name').hidden = true;
  }
  applyAndRender();
  showToast(name ? `"${name}" chargé !` : 'SVG chargé !', 'ok');
}

// ════════════════════════════════════════════
// DROP ZONE
// ════════════════════════════════════════════
function initDropZone() {
  const zone = $('drop-zone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
  });
}

// ════════════════════════════════════════════
// COLOR INPUTS
// ════════════════════════════════════════════
function initColorInputs() {
  syncColor($('icon-color'), $('icon-color-hex'), val => {
    state.iconColor = val;
    state.colorSelected = true;  // Saisie manuelle = couleur choisie
    syncPaletteActive(val);
    applyAndRender();
  });
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
  });
  hexEl.addEventListener('input', () => {
    const v = hexEl.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) { colorEl.value = v; cb(v); }
  });
  hexEl.addEventListener('blur', () => {
    let v = hexEl.value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      hexEl.value = v.toUpperCase(); colorEl.value = v; cb(v);
    } else { hexEl.value = colorEl.value.toUpperCase(); }
  });
}

function syncPaletteActive(hex) {
  const norm = hex.toUpperCase();
  $$('.lox-color-btn').forEach(b => b.classList.toggle('active', b.dataset.color.toUpperCase() === norm));
  $$('.ext-color-btn').forEach(b => b.classList.toggle('active', b.dataset.color.toUpperCase() === norm));
  // Pas de mise à jour des filtres de la grille — icônes toujours en noir
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
// SVG COLORISATION — FIDÈLE AUX SPECS LOXONE
// ════════════════════════════════════════════
// Principe : on colore uniquement les éléments avec fill ≠ "none"
// fill="none" est préservé (découpes, transparences dans les icônes)
// Le SVG Loxone utilise fill=black sur les paths → on remplace par la couleur choisie
function coloriseSvg(svgString, color, opacity) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return svgString;

  // ── Traitement de la balise <svg> racine ──
  const rootFill = svgEl.getAttribute('fill');
  // Si le SVG racine a fill="none", on le garde (pattern typique Loxone)
  // Si fill est absent ou black/currentColor, on met la couleur
  if (!rootFill || rootFill === 'none') {
    // On ne touche pas à fill="none" sur la racine
    // mais on met fill sur la racine pour hériter sur les paths sans fill
    if (!rootFill) svgEl.setAttribute('fill', color);
  } else if (rootFill !== 'none') {
    svgEl.setAttribute('fill', color);
  }

  // ── Traitement de tous les éléments enfants ──
  svgEl.querySelectorAll('*').forEach(el => {
    const tag = el.tagName.toLowerCase();
    // Ne pas toucher aux éléments de définition/structure
    if (tag === 'defs' || tag === 'clippath' || tag === 'lineargradient' ||
        tag === 'radialgradient' || tag === 'pattern' || tag === 'mask') return;

    const fill = el.getAttribute('fill');
    const style = el.getAttribute('style') || '';

    // Colorer uniquement si fill est défini et ≠ "none"
    // → préserve les trous/découpes (fill="none")
    if (fill !== null && fill !== 'none') {
      // fill="black", fill="white", fill="currentColor", fill="#000", etc.
      // → on remplace par la couleur choisie
      if (fill === 'white' || fill === '#fff' || fill === '#ffffff' || fill === '#FFF' || fill === '#FFFFFF') {
        // Les fills blancs dans les icônes Loxone sont des trous internes
        // → on les garde blancs (ou on les rend légèrement transparents)
        // NE PAS COLORER — c'est une découpe visuelle
        // (les 7 icônes avec fill=white ont des trous internes)
      } else {
        el.setAttribute('fill', color);
      }
    }

    // Style inline avec fill
    if (style) {
      let newStyle = style;
      // Remplacer fill: xxx sauf fill: none
      newStyle = newStyle.replace(/fill\s*:\s*(?!none\b)([^;]+)/gi, `fill:${color}`);
      if (newStyle !== style) el.setAttribute('style', newStyle);
    }
  });

  // Opacité globale
  if (opacity < 1) svgEl.setAttribute('opacity', opacity.toFixed(2));
  else svgEl.removeAttribute('opacity');

  // ViewBox standard Loxone si absent
  if (!svgEl.getAttribute('viewBox')) {
    const w = parseFloat(svgEl.getAttribute('width')) || 24;
    const h = parseFloat(svgEl.getAttribute('height')) || 24;
    svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }

  return new XMLSerializer().serializeToString(doc);
}

// ════════════════════════════════════════════
// APPLY + RENDER
// ════════════════════════════════════════════
function applyAndRender() {
  if (!state.svgRaw) return;
  // svgColored = version colorisée (couleur choisie) pour l'export ET la prévisualisation
  state.svgColored = coloriseSvg(state.svgRaw, state.iconColor, state.iconOpacity);
  // svgPreview = noir uniquement au 1er chargement (avant toute sélection de couleur)
  state.svgPreview = state.colorSelected
    ? state.svgColored
    : coloriseSvg(state.svgRaw, '#000000', state.iconOpacity);
  renderAll();
}

async function renderAll() {
  if (!state.svgRaw) return;
  try {
    await renderToCanvas($('preview-canvas'), 256, true);
    $('preview-empty').hidden = true;
    $('preview-canvas').hidden = false;
    $('mini-strip').hidden = false;
    await renderToCanvas($('mini-48'),  48,  true);
    await renderToCanvas($('mini-64'),  64,  true);
    await renderToCanvas($('mini-128'), 128, true);
    showLoading(false);
  } catch(e) {
    showLoading(false);
    console.error('Rendu échoué:', e);
  }
}

// ─── MOTEUR DE RENDU CANVAS ──────────────────
// preview=true → noir (prévisualisation)  |  preview=false → couleur choisie (export)
async function renderToCanvas(canvas, size, preview = false) {
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

  // Choisir le SVG selon le mode
  const svg = preview
    ? (state.svgPreview || state.svgRaw)
    : (state.svgColored || state.svgRaw);
  if (!svg) return;

  const pad = Math.round((state.padding / 100) * size);
  const drawSize = size - 2 * pad;

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
  svgEl.setAttribute('width', size);
  svgEl.setAttribute('height', size);
  if (!svgEl.getAttribute('viewBox')) {
    const w = parseFloat(svgEl.getAttribute('width')) || 24;
    const h = parseFloat(svgEl.getAttribute('height')) || 24;
    svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }
  if (!svgEl.getAttribute('xmlns')) svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
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
  const size = sizes[sizes.length - 1];
  const canvas = $('render-canvas');
  await renderToCanvas(canvas, size, false); // false = couleur choisie pour l'export
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
    await renderToCanvas(canvas, size, false); // false = couleur choisie pour l'export
    const blob = await canvasBlob(canvas);
    const name = useLoxNames ? loxFilename(size) : buildFilename(size);
    zip.file(name + '.png', blob);
  }

  if (inclSvg && state.svgColored) {
    zip.file(baseName() + '_colored.svg', new Blob([state.svgColored], { type: 'image/svg+xml' }));
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(zipBlob);
  a.download = baseName() + '_loxone.zip';
  a.click();
  URL.revokeObjectURL(a.href);

  await renderToCanvas(canvas, sizes[sizes.length - 1], false);
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
  const badge = $('hist-count');
  const clearBtn = $('btn-clear-hist');
  badge.textContent = state.history.length;
  clearBtn.hidden = state.history.length === 0;

  if (!state.history.length) {
    grid.innerHTML = '<p class="hint">Aucune icône générée.</p>';
    return;
  }

  grid.innerHTML = state.history.map((item, i) => `
    <div class="hist-item" title="${item.name} — ${item.size}px">
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
// LOADING / TOAST
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

let toastTimer;
function showToast(msg, type = 'ok') {
  const el = $('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}
