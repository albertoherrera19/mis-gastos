const BASE_CATEGORIES = [
  {id:'inversion', name:'Inversión', icon:'📈', base:true},
  {id:'pasajes',   name:'Pasajes',   icon:'🚌', base:true},
  {id:'ads',       name:'Ads',       icon:'📣', base:true},
  {id:'salidas',   name:'Salidas',   icon:'🎉', base:true},
  {id:'comida',    name:'Comida',    icon:'🍔', base:true},
  {id:'servicios', name:'Servicios', icon:'💡', base:true},
  {id:'ropa',      name:'Ropa',      icon:'👟', base:true},
  {id:'otros',     name:'Otros',     icon:'🗂️', base:true},
];

const THEMES = {
  negro:   {label:'Negro',   bg:'#141414', card:'#1c1c1c', line:'#2c2c2c', bone:'#f2f0ea', muted:'#8a8680', accent:'#e8442c', accentDim:'#5c2016', chip:'#111111', swatch:'#141414'},
  azul:    {label:'Azul',    bg:'#0d1420', card:'#141d2b', line:'#233047', bone:'#eef3fa', muted:'#7c93ad', accent:'#2f7dd8', accentDim:'#173a63', chip:'#0f1621', swatch:'#2f7dd8'},
  celeste: {label:'Celeste', bg:'#0c1a1f', card:'#12242b', line:'#1f3843', bone:'#eaf6f9', muted:'#7fa8b3', accent:'#22b8e8', accentDim:'#0f4a5c', chip:'#0e1c21', swatch:'#22b8e8'},
  morado:  {label:'Morado',  bg:'#160f22', card:'#201533', line:'#33234c', bone:'#f2ecfa', muted:'#9c85bd', accent:'#9b4de0', accentDim:'#3f2064', chip:'#180f24', swatch:'#9b4de0'},
  rojo:    {label:'Rojo',    bg:'#1c0f0f', card:'#2a1414', line:'#432020', bone:'#faeeee', muted:'#c08a8a', accent:'#e8302f', accentDim:'#5c1414', chip:'#1e1010', swatch:'#e8302f'},
  rosado:  {label:'Rosado',  bg:'#1f0f18', card:'#2b1421', line:'#472034', bone:'#faeef5', muted:'#c98aae', accent:'#ec4899', accentDim:'#5c1d3c', chip:'#20101a', swatch:'#ec4899'},
  verde:   {label:'Verde',   bg:'#0f1a11', card:'#16261a', line:'#26402c', bone:'#eefaf0', muted:'#8fb897', accent:'#4ade80', accentDim:'#1c4d2c', chip:'#101c13', swatch:'#4ade80'},
  turquesa:{label:'Turquesa',bg:'#08201f', card:'#0e2c2a', line:'#1d443f', bone:'#e9faf7', muted:'#7db8ae', accent:'#1de9b6', accentDim:'#0c4d43', chip:'#0a2321', swatch:'#1de9b6'},
  naranja: {label:'Naranja', bg:'#1f130a', card:'#2c1c0e', line:'#472c15', bone:'#faf0e6', muted:'#c9986b', accent:'#f5851f', accentDim:'#5c360f', chip:'#20140a', swatch:'#f5851f'},
  blanco:  {label:'Blanco',  bg:'#f7f5f1', card:'#ffffff', line:'#e3e0d8', bone:'#181614', muted:'#8a8680', accent:'#e8442c', accentDim:'#fbdad4', chip:'#efece6', swatch:'#ffffff'},
};

// Paleta de colores distintivos para el gráfico circular (independiente del tema)
const CAT_PALETTE = [
  '#e8442c', '#2f7dd8', '#22b8e8', '#9b4de0', '#4ade80',
  '#f5851f', '#f2c94c', '#ec4899', '#14b8a6', '#a3623b',
  '#64d2ff', '#c084fc', '#84cc16', '#fb7185', '#38bdf8',
];

let expenses = [];
let customCategories = [];
let selectedCat = null;
let activeDonutCat = null;
const STORAGE_KEY = 'timeless_expenses_log';
const THEME_KEY = 'timeless_expenses_theme';
const CUSTOM_CAT_KEY = 'timeless_custom_categories';
const ACCENT_THEME_KEY = 'timeless_accent_theme';
const CAT_COLOR_KEY = 'timeless_category_colors';
const EYEBROW_KEY = 'timeless_eyebrow_text';
const EYEBROW_DEFAULT = 'Timeless · Control personal';

// Temas "neutros": solo cambian fondo/tarjetas, conservan el ultimo acento elegido.
const NEUTRAL_THEMES = ['negro', 'blanco'];
let lastAccentTheme = 'azul';

function allCategories(){ return BASE_CATEGORIES.concat(customCategories); }
function catById(id){ return allCategories().find(c=>c.id===id); }
function fmt(n){ return Number(n).toLocaleString('es-PE', {minimumFractionDigits:2, maximumFractionDigits:2}); }

// Color estable por id de categoría (hash simple -> índice de paleta)
function catColor(id){
  let h = 0;
  for(let i=0;i<id.length;i++){ h = (h*31 + id.charCodeAt(i)) >>> 0; }
  return CAT_PALETTE[h % CAT_PALETTE.length];
}

// Color del punto/bolita de una categoría: usa su color personalizado si tiene,
// si no, el color estable por hash. (categoryColors se define más abajo.)
function categoryDotColor(id){
  const key = (typeof categoryColors !== 'undefined') ? categoryColors[id] : null;
  if(key && THEMES[key]) return THEMES[key].accent;
  return catColor(id);
}

function applyTheme(name){
  const t = THEMES[name] || THEMES.negro;

  // Color de acento: si el tema es neutro (Negro/Blanco), conservamos el ultimo
  // acento no-neutro elegido; si no, este tema pasa a ser el acento de referencia.
  let accentSrc = t;
  if(NEUTRAL_THEMES.indexOf(name) !== -1){
    accentSrc = THEMES[lastAccentTheme] || THEMES.azul;
  } else {
    lastAccentTheme = name;
    try{ localStorage.setItem(ACCENT_THEME_KEY, name); }catch(e){}
  }

  const root = document.documentElement.style;
  root.setProperty('--bg', t.bg);
  root.setProperty('--card', t.card);
  root.setProperty('--line', t.line);
  root.setProperty('--bone', t.bone);
  root.setProperty('--muted', t.muted);
  root.setProperty('--accent', accentSrc.accent);
  root.setProperty('--accent-dim', accentSrc.accentDim);
  root.setProperty('--chip', t.chip);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', t.bg);
  try{ localStorage.setItem(THEME_KEY, name); }catch(e){}
  renderSwatches(name);
}

function renderSwatches(activeName){
  const box = document.getElementById('swatches');
  box.innerHTML = '';
  Object.keys(THEMES).forEach(key=>{
    const t = THEMES[key];
    const el = document.createElement('div');
    el.className = 'swatch' + (key===activeName ? ' active' : '');
    el.innerHTML = '<div class="dot" style="background:' + t.swatch + '"></div><div class="lbl">' + t.label + '</div>';
    el.onclick = ()=> applyTheme(key);
    box.appendChild(el);
  });
}

document.getElementById('gearBtn').addEventListener('click', ()=>{
  document.getElementById('themeDrawer').classList.toggle('open');
});

// ---------- Titulo (eyebrow) editable, persistido en localStorage ----------
function initEyebrow(){
  const box = document.getElementById('eyebrow');
  const txt = document.getElementById('eyebrowText');
  if(!box || !txt) return;

  try{ const s = localStorage.getItem(EYEBROW_KEY); if(s) txt.textContent = s; }catch(e){}

  let editing = false;

  function startEdit(){
    if(editing) return;
    editing = true;
    txt.setAttribute('contenteditable', 'true');
    txt.spellcheck = false;
    txt.focus();
    const range = document.createRange();
    range.selectNodeContents(txt);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function commit(){
    if(!editing) return;
    editing = false;
    txt.setAttribute('contenteditable', 'false');
    let v = txt.textContent.replace(/\s+/g, ' ').trim();
    if(!v){ v = EYEBROW_DEFAULT; }
    txt.textContent = v;
    try{ localStorage.setItem(EYEBROW_KEY, v); }catch(e){}
  }

  box.addEventListener('click', startEdit);
  txt.addEventListener('blur', commit);
  txt.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){ e.preventDefault(); txt.blur(); }
    else if(e.key === 'Escape'){
      e.preventDefault();
      try{ txt.textContent = localStorage.getItem(EYEBROW_KEY) || EYEBROW_DEFAULT; }catch(err){ txt.textContent = EYEBROW_DEFAULT; }
      txt.blur();
    }
  });
}

function loadCustomCategories(){
  try{
    const raw = localStorage.getItem(CUSTOM_CAT_KEY);
    customCategories = raw ? JSON.parse(raw) : [];
  }catch(e){
    customCategories = [];
  }
}

function saveCustomCategories(){
  try{
    localStorage.setItem(CUSTOM_CAT_KEY, JSON.stringify(customCategories));
  }catch(e){}
}

function renderCats(){
  const grid = document.getElementById('catGrid');
  grid.innerHTML = '';

  allCategories().forEach(cat=>{
    const btn = document.createElement('div');
    btn.className = 'cat-btn' + (selectedCat===cat.id ? ' selected' : '');
    btn.innerHTML = '<span class="icon">' + cat.icon + '</span>' + cat.name;
    btn.onclick = ()=>{ selectedCat = cat.id; renderCats(); validateForm(); };

    if(!cat.base){
      const del = document.createElement('div');
      del.className = 'cat-del';
      del.textContent = '✕';
      del.onclick = (ev)=>{
        ev.stopPropagation();
        customCategories = customCategories.filter(c=>c.id !== cat.id);
        if(selectedCat === cat.id) selectedCat = null;
        saveCustomCategories();
        renderCats();
        validateForm();
      };
      btn.appendChild(del);
    }

    grid.appendChild(btn);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'cat-btn add-new';
  addBtn.innerHTML = '<span class="icon">➕</span>Nueva';
  addBtn.onclick = ()=>{
    document.getElementById('newCatForm').classList.add('open');
    document.getElementById('newCatName').focus();
  };
  grid.appendChild(addBtn);
}

document.getElementById('cancelNewCat').addEventListener('click', ()=>{
  document.getElementById('newCatForm').classList.remove('open');
  document.getElementById('newCatName').value = '';
  document.getElementById('newCatEmoji').value = '';
});

document.getElementById('confirmNewCat').addEventListener('click', ()=>{
  const name = document.getElementById('newCatName').value.trim();
  const emoji = document.getElementById('newCatEmoji').value.trim() || '🏷️';
  if(!name) return;

  customCategories.push({
    id: 'custom_' + Date.now(),
    name: name,
    icon: emoji,
    base: false
  });

  saveCustomCategories();
  document.getElementById('newCatForm').classList.remove('open');
  document.getElementById('newCatName').value = '';
  document.getElementById('newCatEmoji').value = '';
  renderCats();
});

function validateForm(){
  const amount = parseFloat(document.getElementById('amountInput').value);
  document.getElementById('saveBtn').disabled = !(amount > 0 && selectedCat);
}

function loadExpenses(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    expenses = raw ? JSON.parse(raw) : [];
  }catch(e){
    expenses = [];
  }
  renderAll();
}

function saveExpenses(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }catch(e){}
}

function renderAll(){
  renderMonthTotal();
  renderDonut();
  renderBreakdown();
  renderMonths();
  renderFeed();
}

function currentMonthExpenses(){
  const now = new Date();
  return expenses.filter(e=>{
    const d = new Date(e.date);
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  });
}

function renderMonthTotal(){
  const monthExp = currentMonthExpenses();
  const total = monthExp.reduce((s,e)=>s+e.amount,0);
  document.getElementById('monthValue').textContent = fmt(total);
  const monthName = new Date().toLocaleDateString('es-PE', {month:'long'});
  document.getElementById('monthLabel').textContent = monthName.charAt(0).toUpperCase()+monthName.slice(1);
}

// Totales por categoría del mes actual (ordenados desc)
function currentMonthByCategory(){
  const monthExp = currentMonthExpenses();
  const totals = {};
  monthExp.forEach(e=>{ totals[e.category] = (totals[e.category]||0) + e.amount; });
  const grandTotal = Object.values(totals).reduce((a,b)=>a+b,0);
  const rows = Object.keys(totals)
    .map(id=>{
      const cat = catById(id) || {id:id, icon:'🗂️', name:'Otros'};
      return {id:id, icon:cat.icon, name:cat.name, total:totals[id], color:catColor(id)};
    })
    .filter(c=>c.total>0)
    .sort((a,b)=>b.total-a.total);
  return {rows, grandTotal};
}

/* ---------- Gráfico circular (donut) ---------- */
function renderDonut(){
  const card = document.getElementById('donutCard');
  const svg = document.getElementById('donutSvg');
  const legend = document.getElementById('donutLegend');
  const {rows, grandTotal} = currentMonthByCategory();

  if(grandTotal === 0){
    card.classList.remove('has-data');
    svg.innerHTML = '';
    legend.innerHTML = '';
    activeDonutCat = null;
    return;
  }
  card.classList.add('has-data');

  // Si la categoría activa ya no existe este mes, limpiar selección
  if(activeDonutCat && !rows.some(r=>r.id===activeDonutCat)) activeDonutCat = null;

  const cx = 60, cy = 60, r = 46;
  const C = 2 * Math.PI * r;
  let offset = 0;
  let segs = '';

  rows.forEach(row=>{
    const frac = row.total / grandTotal;
    const len = frac * C;
    const isActive = activeDonutCat === row.id;
    segs +=
      '<circle class="seg' + (isActive ? ' active' : '') + '" data-cat="' + row.id + '" ' +
      'cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" ' +
      'stroke="' + row.color + '" stroke-width="14" ' +
      'stroke-dasharray="' + len + ' ' + (C - len) + '" ' +
      'stroke-dashoffset="' + (-offset) + '"></circle>';
    offset += len;
  });
  svg.innerHTML = segs;

  // Leyenda (el punto usa el color personalizado de la categoría si tiene)
  legend.innerHTML = rows.map(row=>{
    const isActive = activeDonutCat === row.id;
    return '<div class="leg' + (isActive ? ' active' : '') + '" data-cat="' + row.id + '">' +
           '<span class="dot" style="background:' + categoryDotColor(row.id) + '"></span>' + row.name + '</div>';
  }).join('');

  // Clicks (segmentos + leyenda) -> alternar categoría activa
  const pick = (id)=>{ activeDonutCat = (activeDonutCat === id) ? null : id; renderDonut(); };
  svg.querySelectorAll('.seg').forEach(el=>{
    el.addEventListener('click', ()=> pick(el.getAttribute('data-cat')));
  });
  legend.querySelectorAll('.leg').forEach(el=>{
    el.addEventListener('click', ()=> pick(el.getAttribute('data-cat')));
  });

  updateDonutCenter(rows, grandTotal);
}

function updateDonutCenter(rows, grandTotal){
  const label = document.getElementById('donutCenterLabel');
  const value = document.getElementById('donutCenterValue');
  let pctEl = document.getElementById('donutCenterPct');

  if(activeDonutCat){
    const row = rows.find(r=>r.id===activeDonutCat);
    if(row){
      const pct = (row.total/grandTotal*100);
      label.textContent = row.icon + ' ' + row.name;
      value.textContent = 'S/ ' + fmt(row.total);
      value.classList.add('small');
      if(!pctEl){
        pctEl = document.createElement('div');
        pctEl.id = 'donutCenterPct';
        pctEl.className = 'donut-center-pct';
        value.parentNode.appendChild(pctEl);
      }
      pctEl.textContent = pct.toFixed(1) + '% del mes';
      return;
    }
  }
  label.textContent = 'Total mes';
  value.textContent = 'S/ ' + fmt(grandTotal);
  value.classList.remove('small');
  if(pctEl) pctEl.textContent = '';
}

function renderBreakdown(){
  const {rows, grandTotal} = currentMonthByCategory();
  const container = document.getElementById('breakdown');
  if(grandTotal === 0){
    container.innerHTML = '<div class="empty">Aún no registras gastos este mes.</div>';
    return;
  }

  container.innerHTML = rows.map(c=>{
    const pct = grandTotal>0 ? (c.total/grandTotal*100) : 0;
    return '<div class="bd-row clickable" data-cat="' + c.id + '"><span class="icon">' + c.icon + '</span><span class="name">' + c.name + '</span><span class="amt">S/ ' + fmt(c.total) + '</span><span class="chevron">›</span></div><div class="bd-bar"><div class="bd-bar-fill" style="width:' + pct + '%"></div></div>';
  }).join('');

  container.querySelectorAll('.bd-row[data-cat]').forEach(row=>{
    row.addEventListener('click', ()=> openCategoryDetail(row.getAttribute('data-cat')));
  });
}

/* ---------- Detalle diario por categoría (página completa) ---------- */
// Suma por día del mes actual, solo para una categoría.
function dailyTotalsForCategory(catId){
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totals = new Array(daysInMonth + 1).fill(0); // index 1..daysInMonth
  expenses.forEach(e=>{
    if(e.category !== catId) return;
    const d = new Date(e.date);
    if(d.getFullYear() === year && d.getMonth() === month){
      totals[d.getDate()] += e.amount;
    }
  });
  return {totals, daysInMonth, year, month};
}

function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// Estado del gráfico de detalle
let cdDays = [];            // [{day, total, label}] solo días con gasto
let cdDaysInMonth = 30;     // días del mes actual (eje = línea de tiempo completa)
let cdSlot = 46;            // px por día en el eje (controla zoom/separación)
let cdSlotMin = 12;         // zoom mínimo: el mes completo cabe en pantalla
let cdSlotMax = 84;         // zoom máximo
let cdBarW = 34;            // ancho de barra actual (px) — fijo, solo cambia con zoom
let cdActiveIndex = -1;     // barra con tooltip visible
let cdCatId = null;         // categoría abierta actualmente

function openCategoryDetail(catId){
  const cat = catById(catId) || {id:catId, icon:'🗂️', name:'Otros'};
  const {totals, daysInMonth, year, month} = dailyTotalsForCategory(catId);
  const monthTotal = totals.reduce((a,b)=>a+b, 0);
  cdCatId = catId;
  cdDaysInMonth = daysInMonth;

  document.getElementById('cdIcon').textContent = cat.icon;
  document.getElementById('cdName').textContent = cat.name;
  document.getElementById('cdTotal').textContent = fmt(monthTotal);

  const monthName = new Date(year, month, 1).toLocaleDateString('es-PE', {month:'long'});
  document.getElementById('cdSub').textContent = 'Gasto por día — ' + cap(monthName);

  // Solo días CON gasto (orden cronológico).
  cdDays = [];
  for(let day = 1; day <= daysInMonth; day++){
    if(totals[day] > 0){
      const label = new Date(year, month, day).toLocaleDateString('es-PE', {weekday:'short', day:'2-digit', month:'short'});
      cdDays.push({day: day, total: totals[day], label: cap(label)});
    }
  }
  const maxTotal = cdDays.reduce((m,x)=>Math.max(m, x.total), 0) || 1;

  const inner = document.getElementById('cdGraphInner');
  cdActiveIndex = -1;

  if(cdDays.length === 0){
    inner.innerHTML = '<div class="cd-graph-empty">Sin gastos en esta categoría este mes.</div>';
  } else {
    // Barras verticales de ANCHO FIJO, ubicadas en su día real dentro del mes.
    let barsHtml = '';
    cdDays.forEach((x, i)=>{
      const h = Math.max(4, Math.round(x.total / maxTotal * 165));
      barsHtml +=
        '<button class="cd-vcol" data-i="' + i + '" data-day="' + x.day + '" type="button">' +
          '<div class="cd-vbar" style="height:' + h + 'px"></div>' +
          '<div class="cd-vday">' + x.day + '</div>' +
        '</button>';
    });
    barsHtml += '<div class="cd-tip" id="cdTip"></div>';
    inner.innerHTML = barsHtml;
    inner.querySelectorAll('.cd-vcol').forEach(col=>{
      col.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        showCdTip(parseInt(col.getAttribute('data-i'), 10));
      });
    });
  }

  // Lista de texto (sin cambios): solo días con gasto.
  let listHtml = '';
  cdDays.forEach(x=>{
    listHtml +=
      '<div class="cd-li">' +
        '<span class="cd-li-date">' + x.label + '</span>' +
        '<span class="cd-li-amt">S/ ' + fmt(x.total) + '</span>' +
      '</div>';
  });
  if(!listHtml){ listHtml = '<div class="empty">Sin gastos en esta categoría este mes.</div>'; }
  document.getElementById('cdList').innerHTML = listHtml;

  // Color propio de la categoría (o acento del tema si no tiene).
  applyCdAccent(catId);
  renderCdColorSwatches(catId);
  document.getElementById('cdColorPanel').classList.remove('open');

  const page = document.getElementById('catDetailPage');
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cd-open');
  page.scrollTop = 0;

  // Calcular tamaños tras el layout real.
  requestAnimationFrame(initCdZoom);
}

// Define los límites de zoom y abre en un "zoom base" cómodo.
function initCdZoom(){
  if(cdDays.length === 0) return;
  const graph = document.getElementById('cdGraph');
  const pad = 12;
  const fitSlot = (graph.clientWidth - pad * 2) / cdDaysInMonth; // mes completo cabe
  cdSlotMin = Math.max(6, fitSlot);
  cdSlotMax = 84;
  const base = 46; // barra ≈ 34px en zoom base
  if(cdSlotMax < cdSlotMin) cdSlotMax = cdSlotMin;
  cdSlotBase = Math.min(Math.max(base, cdSlotMin), cdSlotMax);
  setCdSlot(cdSlotBase);
  graph.scrollLeft = 0;
}
let cdSlotBase = 46;

// Reposiciona las barras en la línea de tiempo según el slot (px por día) actual.
function layoutCdBars(){
  const inner = document.getElementById('cdGraphInner');
  const cols = inner.querySelectorAll('.cd-vcol');
  if(!cols.length) return;
  const pad = 12;
  cdBarW = Math.max(6, cdSlot * 0.75);
  inner.style.width = (cdDaysInMonth * cdSlot + pad * 2) + 'px';
  cols.forEach(col=>{
    const day = parseInt(col.getAttribute('data-day'), 10);
    const centerX = pad + (day - 0.5) * cdSlot;
    col.style.width = cdBarW + 'px';
    col.style.left = (centerX - cdBarW / 2) + 'px';
  });
  if(cdActiveIndex >= 0) positionCdTip(cdActiveIndex);
}

function setCdSlot(s){
  cdSlot = Math.max(cdSlotMin, Math.min(cdSlotMax, s));
  layoutCdBars();
}

function showCdTip(i){
  const inner = document.getElementById('cdGraphInner');
  inner.querySelectorAll('.cd-vcol.active').forEach(c=>c.classList.remove('active'));
  const col = inner.querySelectorAll('.cd-vcol')[i];
  if(!col) return;
  col.classList.add('active');
  cdActiveIndex = i;
  positionCdTip(i);
}

function positionCdTip(i){
  const inner = document.getElementById('cdGraphInner');
  const tip = document.getElementById('cdTip');
  const col = inner.querySelectorAll('.cd-vcol')[i];
  if(!tip || !col) return;
  tip.textContent = cdDays[i].label + ' · S/ ' + fmt(cdDays[i].total);
  tip.style.left = (col.offsetLeft + col.offsetWidth / 2) + 'px';
  tip.classList.add('show');
}

function hideCdTip(){
  const tip = document.getElementById('cdTip');
  if(tip) tip.classList.remove('show');
  document.querySelectorAll('#cdGraphInner .cd-vcol.active').forEach(c=>c.classList.remove('active'));
  cdActiveIndex = -1;
}

/* ----- Color propio por categoría (independiente del tema general) ----- */
let categoryColors = {}; // { catId: themeKey }

function loadCategoryColors(){
  try{ categoryColors = JSON.parse(localStorage.getItem(CAT_COLOR_KEY)) || {}; }
  catch(e){ categoryColors = {}; }
}
function saveCategoryColors(){
  try{ localStorage.setItem(CAT_COLOR_KEY, JSON.stringify(categoryColors)); }catch(e){}
}
function themeAccentHex(){
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e8442c';
}
// Color a usar en el gráfico de esa categoría: el propio, o el acento del tema.
function categoryColorHex(catId){
  const key = categoryColors[catId];
  if(key && THEMES[key]) return THEMES[key].accent;
  return themeAccentHex();
}
function applyCdAccent(catId){
  const page = document.getElementById('catDetailPage');
  const hex = categoryColorHex(catId);
  page.style.setProperty('--cd-accent', hex);
  const dot = document.getElementById('cdColorDot');
  if(dot) dot.style.background = hex;
}
function renderCdColorSwatches(catId){
  const box = document.getElementById('cdColorSwatches');
  if(!box) return;
  const activeKey = categoryColors[catId] || null;
  box.innerHTML = '';
  Object.keys(THEMES).forEach(key=>{
    const t = THEMES[key];
    const el = document.createElement('div');
    el.className = 'cd-swatch' + (key === activeKey ? ' active' : '');
    el.innerHTML = '<div class="dot" style="background:' + t.swatch + '"></div><div class="lbl">' + t.label + '</div>';
    el.onclick = ()=> chooseCategoryColor(catId, key);
    box.appendChild(el);
  });
}
function chooseCategoryColor(catId, key){
  const dupId = Object.keys(categoryColors).find(id => id !== catId && categoryColors[id] === key);
  const applyIt = ()=>{
    categoryColors[catId] = key;
    saveCategoryColors();
    applyCdAccent(catId);            // barras del gráfico de esta categoría
    renderCdColorSwatches(catId);    // marca el swatch activo
    renderDonut();                   // punto de color en la lista "Por categoría"
  };
  if(dupId){
    const dupCat = catById(dupId);
    const dupName = dupCat ? dupCat.name : 'Otra categoría';
    const ok = window.confirm('⚠️ ' + dupName + ' ya tiene este color asignado.\n¿Seguro que quieres usar este color de todas formas?');
    if(ok) applyIt();
  } else {
    applyIt();
  }
}

document.getElementById('cdColorBtn').addEventListener('click', ()=>{
  document.getElementById('cdColorPanel').classList.toggle('open');
});

function closeCategoryDetail(){
  const page = document.getElementById('catDetailPage');
  page.classList.remove('open');
  page.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cd-open');
  document.getElementById('cdColorPanel').classList.remove('open');
  hideCdTip();
}

document.getElementById('cdBack').addEventListener('click', closeCategoryDetail);
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && document.getElementById('catDetailPage').classList.contains('open')) closeCategoryDetail();
});

// Tocar fuera de una barra oculta el tooltip.
document.getElementById('cdGraph').addEventListener('click', (e)=>{
  if(!e.target.closest('.cd-vcol')) hideCdTip();
});

// Pinch-to-zoom: solo cambia el ancho/separación de las barras (el slot por día).
(function attachCdPinch(){
  const graph = document.getElementById('cdGraph');
  if(!graph) return;
  let startDist = 0, startSlot = 0;
  function dist(t){
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx, dy);
  }
  graph.addEventListener('touchstart', (e)=>{
    if(e.touches.length === 2){
      startDist = dist(e.touches);
      startSlot = cdSlot;
      hideCdTip();
      e.preventDefault();
    }
  }, {passive:false});
  graph.addEventListener('touchmove', (e)=>{
    if(e.touches.length === 2 && startDist > 0){
      e.preventDefault();
      setCdSlot(startSlot * dist(e.touches) / startDist);
    }
  }, {passive:false});
  graph.addEventListener('touchend', (e)=>{ if(e.touches.length < 2) startDist = 0; });
})();

/* ---------- Comparar meses ---------- */
function monthKey(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0'); }

// Devuelve un rango continuo de meses desde el gasto más antiguo hasta el mes actual.
// Así, al cambiar de mes, la barra del mes nuevo aparece sola aunque no haya gastos.
function monthlySeries(){
  const now = new Date();
  const totals = {};
  let earliest = new Date(now.getFullYear(), now.getMonth(), 1);

  expenses.forEach(e=>{
    const d = new Date(e.date);
    const k = monthKey(d);
    totals[k] = (totals[k]||0) + e.amount;
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    if(first < earliest) earliest = first;
  });

  const series = [];
  const cur = new Date(earliest);
  const currentKey = monthKey(now);
  let guard = 0;
  while(cur <= now && guard < 240){
    const k = monthKey(cur);
    const label = cur.toLocaleDateString('es-PE', {month:'short'}).replace('.','');
    let full = cur.toLocaleDateString('es-PE', {month:'long', year:'numeric'});
    full = full.charAt(0).toUpperCase() + full.slice(1);
    series.push({
      key:k,
      label:label,
      full:full,
      total: totals[k] || 0,
      current: k === currentKey
    });
    cur.setMonth(cur.getMonth()+1);
    guard++;
  }
  // Mostramos como máximo los últimos 12 meses en el gráfico
  return series.slice(-12);
}

function renderMonths(){
  const series = monthlySeries();
  const barsBox = document.getElementById('monthsBars');
  const listBox = document.getElementById('monthsList');
  const maxTotal = Math.max(...series.map(s=>s.total), 1);

  barsBox.innerHTML = series.map(s=>{
    const h = s.total > 0 ? Math.max((s.total/maxTotal*100), 4) : 2;
    const valLabel = s.total > 0 ? ('<span class="val">' + Math.round(s.total) + '</span>') : '';
    return '<div class="mbar' + (s.current ? ' current' : '') + '">' +
             '<div class="col" style="height:' + h + '%">' + valLabel + '</div>' +
             '<div class="mlbl">' + s.label + '</div>' +
           '</div>';
  }).join('');

  // Lista (más reciente primero)
  listBox.innerHTML = [...series].reverse().map(s=>{
    return '<div class="ml-row' + (s.current ? ' current' : '') + '">' +
             '<span class="ml-name">' + s.full + '</span>' +
             '<span class="ml-amt">S/ ' + fmt(s.total) + '</span>' +
           '</div>';
  }).join('');
}

function renderFeed(){
  const feed = document.getElementById('feed');
  const sorted = [...expenses].sort((a,b)=> new Date(b.date) - new Date(a.date)).slice(0,30);

  if(sorted.length===0){
    feed.innerHTML = '<div class="empty">Agrega tu primer gasto arriba 👆</div>';
    return;
  }

  feed.innerHTML = sorted.map(e=>{
    const cat = catById(e.category) || {icon:'🗂️', name:'Otros'};
    const d = new Date(e.date);
    const dateStr = d.toLocaleDateString('es-PE', {day:'2-digit', month:'short'});
    return '<div class="tx"><div class="icon">' + cat.icon + '</div><div class="info"><div class="cat-name">' + cat.name + '</div>' + (e.note ? '<div class="note">' + e.note + '</div>' : '') + '</div><div class="right"><div class="amt">S/ ' + fmt(e.amount) + '</div><div class="date">' + dateStr + '</div></div><div class="del" data-id="' + e.id + '">✕</div></div>';
  }).join('');

  feed.querySelectorAll('.del').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.getAttribute('data-id');
      expenses = expenses.filter(e=>e.id !== id);
      saveExpenses();
      renderAll();
    };
  });
}

document.getElementById('amountInput').addEventListener('input', validateForm);

document.getElementById('saveBtn').addEventListener('click', ()=>{
  const amount = parseFloat(document.getElementById('amountInput').value);
  const note = document.getElementById('noteInput').value.trim();
  if(!(amount>0) || !selectedCat) return;

  expenses.push({
    id: Date.now().toString(),
    amount: amount,
    category: selectedCat,
    note: note,
    date: new Date().toISOString()
  });

  saveExpenses();

  document.getElementById('amountInput').value = '';
  document.getElementById('noteInput').value = '';
  selectedCat = null;
  renderCats();
  validateForm();
  renderAll();
});

let savedTheme = 'azul';
try{ savedTheme = localStorage.getItem(THEME_KEY) || 'azul'; }catch(e){ savedTheme = 'azul'; }
try{ lastAccentTheme = localStorage.getItem(ACCENT_THEME_KEY) || (NEUTRAL_THEMES.indexOf(savedTheme) === -1 ? savedTheme : 'azul'); }catch(e){ lastAccentTheme = 'azul'; }
if(!THEMES[lastAccentTheme] || NEUTRAL_THEMES.indexOf(lastAccentTheme) !== -1){ lastAccentTheme = 'azul'; }
initEyebrow();
try{ applyTheme(savedTheme); }catch(e){}
loadCustomCategories();
loadCategoryColors();
renderCats();
loadExpenses();
