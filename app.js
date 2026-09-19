const BASE_CATEGORIES = [
  {id:'pasajes',   name:'Pasajes',   icon:'🚌', base:true},
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
  amarillo:{label:'Amarillo',bg:'#1c1808', card:'#282011', line:'#43371a', bone:'#faf6e6', muted:'#c7b071', accent:'#f5c518', accentDim:'#5c4810', chip:'#1e1a0a', swatch:'#f5c518'},
  gris:    {label:'Gris',    bg:'#16181c', card:'#20242b', line:'#333a44', bone:'#eef1f5', muted:'#8a94a3', accent:'#aab4c2', accentDim:'#3a424e', chip:'#181b20', swatch:'#aab4c2'},
  marino:  {label:'Azul Marino', bg:'#080c1a', card:'#0f1730', line:'#1e2a52', bone:'#e9eefc', muted:'#7b88b5', accent:'#3b56f0', accentDim:'#16205c', chip:'#0a0f22', swatch:'#3b56f0'},
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
let viewYear = new Date().getFullYear();  // mes que se está viendo en la pantalla principal
let viewMonth = new Date().getMonth();    // (no siempre es el mes real de hoy: se puede navegar)
const STORAGE_KEY = 'timeless_expenses_log';
const THEME_KEY = 'timeless_expenses_theme';
const CUSTOM_CAT_KEY = 'timeless_custom_categories';
const ACCENT_THEME_KEY = 'timeless_accent_theme';
const CAT_COLOR_KEY = 'timeless_category_colors';
const BUDGET_KEY = 'timeless_category_budgets';
const GROUPS_KEY = 'timeless_cat_groups';
const RECURRING_KEY = 'timeless_recurring';
const GENERAL_BUDGET_KEY = 'timeless_general_budget'; // legado: presupuesto recurrente (pre-migración a por-mes)
const GROUP_BUDGET_KEY = 'timeless_group_budgets'; // legado: igual que arriba, por grupo
const MONTH_BUDGET_KEY = 'timeless_month_budgets';
const REMINDERS_KEY = 'timeless_reminders';
const CAT_OVERRIDE_KEY = 'timeless_cat_overrides';
const DELETED_BASE_KEY = 'timeless_deleted_base_cats';
const CAT_ORDER_KEY = 'timeless_cat_order'; // orden personalizado de la grilla de categorías (ids)
const SHOW_CAT_COMPARE_KEY = 'timeless_show_cat_compare';
const CASHBACK_KEY = 'timeless_cashback';
const CASHBACK_EXCLUDE_KEY = 'timeless_cashback_exclude'; // id del grupo "negocio" que NO recibe cashback
const AVOIDABLE_KEY = 'timeless_avoidable'; // ids de gastos marcados "evitables" para el simulador de ahorro
const SIM_AUTO_AVOID_KEY = 'timeless_sim_auto_avoid_cats'; // categorías "siempre innecesaria" (simulador)
const AVOIDABLE_EXCEPT_KEY = 'timeless_avoidable_exceptions'; // gastos marcados a mano como necesarios pese a la regla
const RANGE_GOAL_KEY = 'timeless_range_goal'; // meta puntual de gasto entre dos fechas (puede cruzar de un mes a otro)
const FREQ_NOTE_KEY = 'timeless_freq_notes'; // nota frecuente por categoría, para llenar la Nota de un toque
// (En el repo de amigos este flag va en false — diferencia intencional:
// no se pre-crea ningún grupo, el usuario los crea si quiere.)
const PRECREATE_GROUPS = false;
const EYEBROW_KEY = 'timeless_eyebrow_text';
const EYEBROW_DEFAULT = 'Timeless · Control personal';

// Temas "neutros": solo cambian fondo/tarjetas, conservan el ultimo acento elegido.
const NEUTRAL_THEMES = ['negro', 'blanco'];
let lastAccentTheme = 'azul';

let catOverrides = {};   // {catId: {name, icon}} — ediciones sobre categorías base o personalizadas
let deletedBaseCats = []; // ids de BASE_CATEGORIES que el usuario eliminó en este dispositivo
let catFrequentNotes = {}; // {catId: texto} — nota frecuente por categoría (botón rápido al agregar un gasto)

function loadFrequentNotes(){
  try{ catFrequentNotes = JSON.parse(localStorage.getItem(FREQ_NOTE_KEY)) || {}; }
  catch(e){ catFrequentNotes = {}; }
}
function saveFrequentNotes(){
  try{ localStorage.setItem(FREQ_NOTE_KEY, JSON.stringify(catFrequentNotes)); }catch(e){}
}

function loadCatOverrides(){
  try{ catOverrides = JSON.parse(localStorage.getItem(CAT_OVERRIDE_KEY)) || {}; }
  catch(e){ catOverrides = {}; }
}
function saveCatOverrides(){
  try{ localStorage.setItem(CAT_OVERRIDE_KEY, JSON.stringify(catOverrides)); }catch(e){}
}
function loadDeletedBaseCats(){
  try{ deletedBaseCats = JSON.parse(localStorage.getItem(DELETED_BASE_KEY)) || []; }
  catch(e){ deletedBaseCats = []; }
}
function saveDeletedBaseCats(){
  try{ localStorage.setItem(DELETED_BASE_KEY, JSON.stringify(deletedBaseCats)); }catch(e){}
}

let catOrder = []; // ids en el orden que el usuario acomodó (arrastrando en modo Editar)
function loadCatOrder(){
  try{ catOrder = JSON.parse(localStorage.getItem(CAT_ORDER_KEY)) || []; }
  catch(e){ catOrder = []; }
}
function saveCatOrder(){
  try{ localStorage.setItem(CAT_ORDER_KEY, JSON.stringify(catOrder)); }catch(e){}
}

let showCatCompare = false; // oculto por defecto; el botón 📊 activa los indicadores ▲/▼ vs. mes anterior
function loadShowCatCompare(){
  try{ showCatCompare = localStorage.getItem(SHOW_CAT_COMPARE_KEY) === '1'; }
  catch(e){ showCatCompare = false; }
}
function saveShowCatCompare(){
  try{ localStorage.setItem(SHOW_CAT_COMPARE_KEY, showCatCompare ? '1' : '0'); }catch(e){}
}

function allCategories(){
  const base = BASE_CATEGORIES.filter(c => deletedBaseCats.indexOf(c.id) === -1);
  const list = base.concat(customCategories).map(c=>{
    const ov = catOverrides[c.id];
    return ov ? Object.assign({}, c, ov) : c;
  });
  // Aplica el orden personalizado si existe; lo que no esté en catOrder queda al
  // final en su orden natural (Array.sort es estable). Así categorías nuevas
  // aparecen al final hasta que las muevas.
  if(catOrder.length){
    list.sort((a,b)=>{
      let ia = catOrder.indexOf(a.id); if(ia === -1) ia = Infinity;
      let ib = catOrder.indexOf(b.id); if(ib === -1) ib = Infinity;
      return ia - ib;
    });
  }
  return list;
}
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

// ---------- Respaldo de datos: exportar / importar ----------
// Descarga/restaura gastos, categorías personalizadas y preferencias.
const BACKUP_KEYS = [STORAGE_KEY, THEME_KEY, CUSTOM_CAT_KEY, ACCENT_THEME_KEY, CAT_COLOR_KEY, EYEBROW_KEY, BUDGET_KEY, GROUPS_KEY, RECURRING_KEY, GENERAL_BUDGET_KEY, GROUP_BUDGET_KEY, MONTH_BUDGET_KEY, REMINDERS_KEY, CAT_OVERRIDE_KEY, DELETED_BASE_KEY, SHOW_CAT_COMPARE_KEY, CASHBACK_KEY, CASHBACK_EXCLUDE_KEY, AVOIDABLE_KEY, CAT_ORDER_KEY, SIM_AUTO_AVOID_KEY, AVOIDABLE_EXCEPT_KEY, RANGE_GOAL_KEY, FREQ_NOTE_KEY];

function exportBackup(){
  const data = {};
  BACKUP_KEYS.forEach(k=>{
    const v = localStorage.getItem(k);
    if(v !== null) data[k] = v;
  });
  const payload = { app: 'mis-gastos', exportedAt: new Date().toISOString(), data: data };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mis-gastos-backup-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

function importBackupFile(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    let parsed;
    try{ parsed = JSON.parse(reader.result); }
    catch(e){ alert('El archivo no es un respaldo válido.'); return; }
    const data = (parsed && typeof parsed.data === 'object') ? parsed.data : parsed;
    if(!data || typeof data !== 'object'){ alert('El archivo no es un respaldo válido.'); return; }

    const ok = window.confirm('Esto reemplazará los gastos, categorías y preferencias actuales de este dispositivo con los del archivo.\n\n¿Continuar?');
    if(!ok) return;

    BACKUP_KEYS.forEach(k=>{
      if(Object.prototype.hasOwnProperty.call(data, k)){
        try{ localStorage.setItem(k, data[k]); }catch(e){}
      }
    });
    location.reload();
  };
  reader.readAsText(file);
}

document.getElementById('exportBtn').addEventListener('click', exportBackup);
document.getElementById('importBtn').addEventListener('click', ()=>{
  document.getElementById('importFile').click();
});
document.getElementById('importFile').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(file) importBackupFile(file);
  e.target.value = '';
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

let catFormEditId = null; // null = modo crear categoría; id = editando esa categoría
let catsEditMode = false; // true = muestra ✎/✕ en cada categoría (evita ruido/misclicks al agregar gastos)

function renderCats(){
  const grid = document.getElementById('catGrid');
  grid.innerHTML = '';
  grid.classList.toggle('editing', catsEditMode);

  allCategories().forEach(cat=>{
    const btn = document.createElement('div');
    btn.className = 'cat-btn' + (selectedCat===cat.id ? ' selected' : '');
    btn.dataset.id = cat.id;
    btn.innerHTML = '<span class="icon">' + cat.icon + '</span>' + cat.name;
    // Toggle: un toque selecciona, otro toque sobre la misma la deselecciona.
    // Deshabilitado mientras se editan categorías, para no mezclar "elegir categoría del gasto" con "gestionar categorías".
    btn.onclick = ()=>{
      if(catsEditMode) return;
      selectedCat = (selectedCat === cat.id) ? null : cat.id;
      renderCats();
      validateForm();
    };

    const edit = document.createElement('div');
    edit.className = 'cat-edit';
    edit.textContent = '✎';
    edit.onclick = (ev)=>{ ev.stopPropagation(); openCatForm(cat); };
    btn.appendChild(edit);

    const del = document.createElement('div');
    del.className = 'cat-del';
    del.textContent = '✕';
    del.onclick = (ev)=>{
      ev.stopPropagation();
      // "Otros" es el destino de respaldo para gastos reasignados: no se puede borrar.
      if(cat.id === 'otros'){ alert('"Otros" no se puede eliminar: es la categoría de respaldo para gastos reasignados.'); return; }
      // Confirmación antes de borrar; si tiene gastos, ofrecer moverlos a "Otros".
      const catExpenses = expenses.filter(e=>e.category === cat.id);
      if(catExpenses.length > 0){
        const ok = window.confirm('⚠️ "' + cat.name + '" tiene ' + catExpenses.length + ' gasto(s) registrado(s).\n\nAceptar: eliminar la categoría y mover esos gastos a "Otros" (no se pierden).\nCancelar: no borrar nada.');
        if(!ok) return;
        expenses.forEach(e=>{ if(e.category === cat.id) e.category = 'otros'; });
        saveExpenses();
      } else {
        const ok = window.confirm('¿Eliminar la categoría "' + cat.name + '"?');
        if(!ok) return;
      }
      if(cat.base){
        if(deletedBaseCats.indexOf(cat.id) === -1) deletedBaseCats.push(cat.id);
        saveDeletedBaseCats();
        if(catOverrides[cat.id]){ delete catOverrides[cat.id]; saveCatOverrides(); }
      } else {
        customCategories = customCategories.filter(c=>c.id !== cat.id);
        saveCustomCategories();
      }
      if(selectedCat === cat.id) selectedCat = null;
      renderCats();
      validateForm();
      renderAll(); // refleja los gastos movidos a "Otros"
    };
    btn.appendChild(del);

    if(catsEditMode) attachCatDrag(btn, cat.id);
    grid.appendChild(btn);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'cat-btn add-new';
  addBtn.innerHTML = '<span class="icon">➕</span>Nueva';
  addBtn.onclick = ()=> openCatForm(null);
  grid.appendChild(addBtn);

  const toggleBtn = document.getElementById('catsEditToggle');
  toggleBtn.textContent = catsEditMode ? '✓ Listo' : '✎ Editar';
  toggleBtn.classList.toggle('active', catsEditMode);

  const dragHint = document.getElementById('catsDragHint');
  if(dragHint) dragHint.style.display = catsEditMode ? '' : 'none';

  updateCatNoteHint();
  renderFreqNoteBtn();
}

/* ---------- Arrastrar para reordenar categorías (solo en modo Editar) ----------
   Mantén presionada una categoría ~0.3s para "agarrarla", luego arrástrala a su
   nuevo lugar y suelta. El orden se guarda en CAT_ORDER_KEY. Usa Pointer Events
   (sirve para toque y mouse). En modo Editar los tiles llevan touch-action:none
   para que arrastrar no haga scroll de la página. */
let catDrag = null; // {node, clone, offsetX, offsetY}

function attachCatDrag(node, id){
  node.addEventListener('pointerdown', (e)=>{
    // No arrancar arrastre si tocaste el lápiz o la X (esos son tap).
    if(e.target.closest('.cat-edit') || e.target.closest('.cat-del')) return;
    const startX = e.clientX, startY = e.clientY;
    let grabbed = false;
    const timer = setTimeout(()=>{ grabbed = true; beginCatDrag(node, startX, startY); }, 300);
    const move = (ev)=>{
      if(!grabbed){
        // Si mueve el dedo antes de "agarrar", cancela (fue un toque/deslizar).
        if(Math.abs(ev.clientX - startX) > 10 || Math.abs(ev.clientY - startY) > 10){ clearTimeout(timer); end(); }
        return;
      }
      ev.preventDefault();
      dragCatMove(ev);
    };
    const up = ()=>{ clearTimeout(timer); if(grabbed) endCatDrag(); end(); };
    const end = ()=>{
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
}

let catDragPrevOrder = null; // orden ANTES de este arrastre, para poder deshacer
function beginCatDrag(node, x, y){
  catDragPrevOrder = allCategories().map(c=> c.id);
  const rect = node.getBoundingClientRect();
  const clone = node.cloneNode(true);
  clone.className = 'cat-btn cat-drag-clone';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.left = rect.left + 'px';
  clone.style.top = rect.top + 'px';
  document.body.appendChild(clone);
  node.classList.add('dragging');
  catDrag = { node: node, clone: clone, offsetX: x - rect.left, offsetY: y - rect.top };
  if(navigator.vibrate) { try{ navigator.vibrate(15); }catch(e){} }
}

function dragCatMove(ev){
  if(!catDrag) return;
  catDrag.clone.style.left = (ev.clientX - catDrag.offsetX) + 'px';
  catDrag.clone.style.top = (ev.clientY - catDrag.offsetY) + 'px';
  const el = document.elementFromPoint(ev.clientX, ev.clientY);
  if(!el) return;
  const tile = el.closest('.cat-btn');
  if(!tile || tile === catDrag.node) return;
  const grid = catDrag.node.parentNode;
  if(tile.parentNode !== grid) return;
  if(tile.classList.contains('add-new')){
    grid.insertBefore(catDrag.node, tile); // soltar al final (antes del botón "Nueva")
    return;
  }
  const nodes = Array.from(grid.children);
  if(nodes.indexOf(tile) < nodes.indexOf(catDrag.node)) grid.insertBefore(catDrag.node, tile);
  else grid.insertBefore(catDrag.node, tile.nextSibling);
}

function endCatDrag(){
  if(!catDrag) return;
  const grid = catDrag.node.parentNode;
  if(catDrag.clone && catDrag.clone.parentNode) catDrag.clone.parentNode.removeChild(catDrag.clone);
  catDrag.node.classList.remove('dragging');
  catDrag = null;
  // Guarda el nuevo orden a partir del DOM (los tiles reales tienen data-id; "Nueva" no).
  const newOrder = Array.from(grid.querySelectorAll('.cat-btn[data-id]')).map(el=> el.dataset.id);
  const prev = catDragPrevOrder;
  const changed = !prev || prev.join('|') !== newOrder.join('|');
  catOrder = newOrder;
  saveCatOrder();
  renderCats();
  // Botón "Deshacer" para volver al orden anterior (solo si de verdad cambió).
  if(changed && prev){
    showUndoToast('Categoría movida', ()=>{
      catOrder = prev.slice();
      saveCatOrder();
      renderCats();
    });
  }
}

// Quita tildes/mayúsculas para comparar nombres de categoría sin depender del acento exacto.
function normalizeCatName(s){
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Marca visualmente cuál pill está elegida ('product'/'other') en un selector
// Producto/Otro (reutilizado por el form de agregar y el de editar).
function renderStockOnlyOpts(containerId, value){
  const box = document.getElementById(containerId);
  if(!box) return;
  box.querySelectorAll('.gt-opt').forEach(el=>{
    el.classList.toggle('selected', el.getAttribute('data-v') === value);
  });
}

let selectedStockOnly = null; // 'product' | 'other' — solo aplica si la categoría es Canjes/Reposición
let lastNoteHintCat = undefined; // detecta cambio real de categoría para no pisar la elección del usuario

// Aviso sobre cómo escribir la Nota + selector Producto/Otro cuando la categoría
// elegida es "Canjes" o "Reposición": el dashboard de Timeless usa esa Nota para
// calcular qué queda pendiente por llegar de cada producto (ver timeless-crm-proyecto),
// y "Producto" hace que este gasto no cuente en ningún total de esta app (no es
// plata real, es stock que sale) — ver [[timeless-crm-proyecto]].
function updateCatNoteHint(){
  const hint = document.getElementById('catNoteHint');
  if(!hint) return;
  const cat = selectedCat ? catById(selectedCat) : null;
  const isStockCat = cat ? isCashbackExemptCategory(cat.id) : false;
  hint.style.display = isStockCat ? '' : 'none';
  if(selectedCat !== lastNoteHintCat){
    lastNoteHintCat = selectedCat;
    selectedStockOnly = isStockCat ? 'product' : null;
  }
  renderStockOnlyOpts('stockOnlyOpts', selectedStockOnly);
}
document.querySelectorAll('#stockOnlyOpts .gt-opt').forEach(el=>{
  el.addEventListener('click', (ev)=>{
    ev.stopPropagation();
    selectedStockOnly = el.getAttribute('data-v');
    renderStockOnlyOpts('stockOnlyOpts', selectedStockOnly);
  });
});

// Botón rápido para llenar la Nota con el texto frecuente de la categoría
// elegida (ej: "ISIL" en Pasajes) — se configura en "editar categoría".
function renderFreqNoteBtn(){
  const btn = document.getElementById('freqNoteBtn');
  if(!btn) return;
  const cat = selectedCat ? catById(selectedCat) : null;
  const note = cat ? catFrequentNotes[cat.id] : null;
  if(note){
    document.getElementById('freqNoteBtnText').textContent = note;
    btn.style.display = '';
  } else {
    btn.style.display = 'none';
  }
}
document.getElementById('freqNoteBtn').addEventListener('click', ()=>{
  document.getElementById('noteInput').value = document.getElementById('freqNoteBtnText').textContent;
  validateForm();
});

document.getElementById('catsEditToggle').addEventListener('click', ()=>{
  catsEditMode = !catsEditMode;
  renderCats();
});

// Grupo elegido en el form de categoría (crear/editar). Selección ÚNICA (a
// diferencia del "Grupo" de un gasto, que permite varios): una categoría vive
// en un solo grupo desde acá. null = Ninguno.
let catFormGroupId = null;
function renderCatFormGroupTag(){
  renderGroupTagOpts('catGroupTagOpts', 'catGroupTagRow', catFormGroupId ? [catFormGroupId] : [], (g)=>{
    catFormGroupId = g; // siempre reemplaza (no alterna) para que sea selección única
    renderCatFormGroupTag();
  });
}

function openCatForm(editCat){
  const form = document.getElementById('newCatForm');
  const nameInp = document.getElementById('newCatName');
  const emojiInp = document.getElementById('newCatEmoji');
  const freqNoteInp = document.getElementById('newCatFreqNote');
  const confirmBtn = document.getElementById('confirmNewCat');
  if(editCat){
    catFormEditId = editCat.id;
    nameInp.value = editCat.name;
    emojiInp.value = editCat.icon;
    freqNoteInp.value = catFrequentNotes[editCat.id] || '';
    confirmBtn.textContent = 'Guardar cambios';
    const g = catGroups.find(x=> x.cats.indexOf(editCat.id) !== -1);
    catFormGroupId = g ? g.id : null;
  } else {
    catFormEditId = null;
    nameInp.value = '';
    emojiInp.value = '';
    freqNoteInp.value = '';
    confirmBtn.textContent = 'Crear categoría';
    catFormGroupId = null;
  }
  renderCatFormGroupTag();
  form.classList.add('open');
  nameInp.focus();
}

function closeCatForm(){
  catFormEditId = null;
  catFormGroupId = null;
  document.getElementById('newCatForm').classList.remove('open');
  document.getElementById('newCatName').value = '';
  document.getElementById('newCatEmoji').value = '';
  document.getElementById('newCatFreqNote').value = '';
  document.getElementById('confirmNewCat').textContent = 'Crear categoría';
}

document.getElementById('cancelNewCat').addEventListener('click', closeCatForm);

document.getElementById('confirmNewCat').addEventListener('click', ()=>{
  const name = document.getElementById('newCatName').value.trim();
  const emoji = document.getElementById('newCatEmoji').value.trim() || '🏷️';
  if(!name) return;

  let catId = catFormEditId;
  if(catFormEditId){
    const cat = allCategories().find(c=>c.id === catFormEditId);
    if(cat && cat.base){
      catOverrides[catFormEditId] = {name: name, icon: emoji};
      saveCatOverrides();
    } else {
      const idx = customCategories.findIndex(c=>c.id === catFormEditId);
      if(idx !== -1){
        customCategories[idx].name = name;
        customCategories[idx].icon = emoji;
        saveCustomCategories();
      }
    }
  } else {
    const newCat = { id: 'custom_' + Date.now(), name: name, icon: emoji, base: false };
    customCategories.push(newCat);
    saveCustomCategories();
    catId = newCat.id;
  }

  // Sincroniza el grupo de la categoría: la saca de cualquier grupo donde
  // estuviera y la mete en el elegido (si eligió alguno) — así también se
  // puede cambiar de grupo desde acá, sin tener que ir al editor del grupo.
  let groupsChanged = false;
  catGroups.forEach(g=>{
    const i = g.cats.indexOf(catId);
    if(i !== -1 && g.id !== catFormGroupId){ g.cats.splice(i, 1); groupsChanged = true; }
  });
  if(catFormGroupId){
    const g = catGroups.find(x=>x.id === catFormGroupId);
    if(g && g.cats.indexOf(catId) === -1){ g.cats.push(catId); groupsChanged = true; }
  }
  if(groupsChanged) saveCatGroups();

  const freqNote = document.getElementById('newCatFreqNote').value.trim();
  if(freqNote) catFrequentNotes[catId] = freqNote; else delete catFrequentNotes[catId];
  saveFrequentNotes();

  closeCatForm();
  renderCats();
  renderAll(); // refleja el nombre/ícono editado en otras vistas (donut, movimientos, etc.)
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

// Aviso breve tipo "toast" que aparece y se desvanece solo.
function showToast(msg, kind){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.className = 'toast show' + (kind ? ' ' + kind : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>{ t.className = 'toast'; }, 2600);
}

// Toast con botón "Deshacer": aparece solo, dura ~6s, y al tocar Deshacer
// ejecuta onUndo (revierte el cambio) y desaparece.
function showUndoToast(msg, onUndo){
  const t = document.getElementById('undoToast');
  if(!t) return;
  t.innerHTML = '<span class="undo-msg"></span><button class="undo-btn" type="button">Deshacer</button>';
  t.querySelector('.undo-msg').textContent = msg;
  t.className = 'undo-toast show';
  clearTimeout(t._timer);
  const hide = ()=>{ t.className = 'undo-toast'; clearTimeout(t._timer); };
  t.querySelector('.undo-btn').onclick = ()=>{ hide(); if(typeof onUndo === 'function') onUndo(); };
  t._timer = setTimeout(hide, 6000);
}

/* ---------- Grupos de categorías (filtro pantalla principal) ---------- */
let catGroups = [];        // [{id, name, cats:[catIds]}]
let activeGroup = null;    // null = Predeterminado (todas)

function defaultGroups(){
  const otras = allCategories().map(c=>c.id).filter(id=> id!=='ads' && id!=='inversion');
  return [
    {id:'g_timeless', name:'Timeless', cats:['ads','inversion']},
    {id:'g_personal', name:'Personal', cats:otras}
  ];
}
function loadCatGroups(){
  let stored = null;
  try{ stored = JSON.parse(localStorage.getItem(GROUPS_KEY)); }catch(e){ stored = null; }
  if(Array.isArray(stored)){
    catGroups = stored;
  } else {
    // Primera vez: pre-crear grupos por defecto solo si corresponde a esta app.
    catGroups = PRECREATE_GROUPS ? defaultGroups() : [];
    saveCatGroups();
  }
}
function saveCatGroups(){
  try{ localStorage.setItem(GROUPS_KEY, JSON.stringify(catGroups)); }catch(e){}
}
// Categorías del grupo activo (o null = todas).
function activeGroupCats(){
  if(!activeGroup) return null;
  const g = catGroups.find(x=>x.id === activeGroup);
  return g ? g.cats : null;
}
// Ids de grupo etiquetados manualmente en un gasto (soporta el formato viejo
// de un solo grupo `group` y el nuevo de varios `groups`, para compatibilidad).
function expenseGroupIds(e){
  if(Array.isArray(e.groups)) return e.groups;
  if(e.group) return [e.group];
  return [];
}

// Grupos EFECTIVOS de un gasto para filtrar:
//  - Si tiene grupo(s) forzado(s) a mano, esos MANDAN y REEMPLAZAN al grupo de
//    su categoría (ej: un pago a SUNAT en categoría "Servicios" —que vive en
//    "Personal"— forzado a "Timeless" cuenta solo en Timeless, no en Personal).
//  - Si no forzó nada ("Ninguno"), cae al grupo al que pertenece su categoría.
function effectiveGroupIds(e){
  const tags = expenseGroupIds(e);
  if(tags.length) return tags;
  return catGroups.filter(g=> g.cats.indexOf(e.category) !== -1).map(g=> g.id);
}

// ¿Un gasto pertenece (efectivamente) a un grupo?
function expenseInGroup(e, groupId){
  if(!groupId) return false;
  return effectiveGroupIds(e).indexOf(groupId) !== -1;
}

// Filtra una lista de gastos por el grupo activo. Usa los grupos EFECTIVOS: un
// gasto con grupo forzado se sale del grupo de su categoría y aparece solo en
// el(los) grupo(s) que forzaste.
function applyGroupFilter(list){
  return filterByGroupId(list, activeGroup);
}

// Igual que applyGroupFilter pero para un grupo cualquiera (no solo el activo);
// lo usa el filtro secundario del feed para segmentar en modo Predeterminado.
function filterByGroupId(list, groupId){
  if(!groupId) return list;
  return list.filter(e=> effectiveGroupIds(e).indexOf(groupId) !== -1);
}

// Pills de "Grupo (opcional)" en un formulario (agregar/editar). Multi-selección:
// cada pill se alterna independientemente; "Ninguno" limpia toda la selección.
function renderGroupTagOpts(optsId, rowId, current, onToggle){
  const row = document.getElementById(rowId);
  const box = document.getElementById(optsId);
  if(!row || !box) return;
  if(catGroups.length === 0){ row.classList.add('hidden'); box.innerHTML = ''; return; }
  row.classList.remove('hidden');
  let html = '<div class="gt-opt' + (current.length === 0 ? ' selected' : '') + '" data-g="">Ninguno</div>';
  catGroups.forEach(g=>{
    const sel = current.indexOf(g.id) !== -1;
    html += '<div class="gt-opt' + (sel ? ' selected' : '') + '" data-g="' + g.id + '">' + g.name + '</div>';
  });
  box.innerHTML = html;
  box.querySelectorAll('.gt-opt').forEach(el=>{
    el.onclick = ()=> onToggle(el.getAttribute('data-g') || null);
  });
}

let selectedGroupTags = [];   // ids de grupo del formulario de agregar (varios permitidos)
function renderAddGroupTag(){
  renderGroupTagOpts('groupTagOpts', 'groupTagRow', selectedGroupTags, (g)=>{
    if(!g){ selectedGroupTags = []; }
    else{
      const i = selectedGroupTags.indexOf(g);
      if(i === -1) selectedGroupTags.push(g); else selectedGroupTags.splice(i,1);
    }
    renderAddGroupTag();
  });
}

// Pestañas de grupos + link de editar el grupo activo.
function renderCatGroups(){
  const box = document.getElementById('catGroups');
  if(!box) return;
  let html = '<button class="cg-tab' + (!activeGroup ? ' active' : '') + '" data-g="">Predeterminado</button>';
  catGroups.forEach(g=>{
    html += '<button class="cg-tab' + (activeGroup === g.id ? ' active' : '') + '" data-g="' + g.id + '">' + g.name + '</button>';
  });
  html += '<button class="cg-tab cg-add" data-g="__add">+ Grupo</button>';
  box.innerHTML = html;
  box.querySelectorAll('.cg-tab').forEach(t=>{
    t.onclick = ()=>{
      const g = t.getAttribute('data-g');
      if(g === '__add'){ openGroupEditor(null); return; }
      activeGroup = g || null;
      feedGroupFilter = null; // al cambiar de pestaña, el filtro secundario del feed se resetea
      renderCatGroups();
      renderMonthTotal(); renderDonut(); renderBreakdown(); renderSim(); renderFeed();
    };
  });
  // Link de editar (solo cuando hay un grupo custom activo)
  const link = document.getElementById('cgEditLink');
  if(link){
    const g = activeGroup ? catGroups.find(x=>x.id === activeGroup) : null;
    if(g){
      link.innerHTML = '<button type="button">✏️ Editar "' + g.name + '"</button>';
      link.querySelector('button').onclick = ()=> openGroupEditor(g.id);
    } else {
      link.innerHTML = '';
    }
  }
  renderAddGroupTag(); // mantener el selector de grupo del formulario al día
}

/* ----- Editor de grupo (crear/editar, página completa) ----- */
let editingGroupId = null;
let groupSelCats = [];

function renderGroupCatGrid(){
  const grid = document.getElementById('groupCatGrid');
  grid.innerHTML = '';
  allCategories().forEach(cat=>{
    const sel = groupSelCats.indexOf(cat.id) !== -1;
    const btn = document.createElement('div');
    btn.className = 'cat-btn' + (sel ? ' selected' : '');
    btn.innerHTML = '<span class="icon">' + cat.icon + '</span>' + cat.name;
    btn.onclick = ()=>{
      const i = groupSelCats.indexOf(cat.id);
      if(i === -1) groupSelCats.push(cat.id); else groupSelCats.splice(i,1);
      renderGroupCatGrid();
    };
    grid.appendChild(btn);
  });
}

function openGroupEditor(gid){
  editingGroupId = gid;
  const g = gid ? catGroups.find(x=>x.id === gid) : null;
  document.getElementById('groupPageTitle').textContent = g ? 'Editar grupo' : 'Nuevo grupo';
  document.getElementById('groupName').value = g ? g.name : '';
  groupSelCats = g ? g.cats.slice() : [];
  document.getElementById('groupDeleteBtn').style.display = g ? '' : 'none';
  renderGroupCatGrid();
  const page = document.getElementById('groupPage');
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cd-open');
  page.scrollTop = 0;
}

function closeGroupEditor(){
  const page = document.getElementById('groupPage');
  page.classList.remove('open');
  page.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cd-open');
  editingGroupId = null;
}

function saveGroup(){
  const name = document.getElementById('groupName').value.trim() || 'Grupo';
  if(groupSelCats.length === 0){ alert('Elige al menos una categoría para el grupo.'); return; }
  if(editingGroupId){
    const g = catGroups.find(x=>x.id === editingGroupId);
    if(g){ g.name = name; g.cats = groupSelCats.slice(); }
  } else {
    const id = 'grp_' + Date.now();
    catGroups.push({id:id, name:name, cats:groupSelCats.slice()});
    activeGroup = id;
  }
  saveCatGroups();
  closeGroupEditor();
  renderCatGroups(); renderMonthTotal(); renderDonut(); renderBreakdown(); renderSim();
}

function deleteGroup(){
  if(!editingGroupId) return;
  if(!window.confirm('¿Eliminar este grupo? (no borra tus gastos, solo el filtro)')) return;
  catGroups = catGroups.filter(x=>x.id !== editingGroupId);
  if(activeGroup === editingGroupId) activeGroup = null;
  saveCatGroups();
  closeGroupEditor();
  renderCatGroups(); renderMonthTotal(); renderDonut(); renderBreakdown(); renderSim();
}

function renderAll(){
  renderMonthSwitch();
  renderCatGroups();
  renderMonthTotal();
  renderDonut();
  renderBreakdown();
  renderSimLauncher();
  renderRangeGoal();
  renderMonths();
  renderFeed();
}

function currentMonthExpenses(){
  return expenses.filter(e=>{
    const d = new Date(e.date);
    return d.getMonth()===viewMonth && d.getFullYear()===viewYear;
  });
}

/* ---------- Cashback ----------
   El cashback se registra como una lista simple de retiros (monto + fecha).
   Se consume cronológicamente contra TODOS los gastos (sin filtro de grupo: es
   plata real, no depende de cómo organices tus categorías), así que "retirar 17
   soles" recupera automáticamente los próximos 17 soles de gasto que ocurran después,
   sin importar el mes (siempre hacia adelante, nunca retroactivo).
   Se toma como plata RECUPERADA: baja el total general y los gastos personales, pero
   NO los del grupo marcado como "negocio" (cashbackExcludeGroup), que se muestran en
   bruto — porque su cashback conviene dejarlo fuera de los números del negocio. */
let cashback = []; // [{id, amount, date (ISO), note}]
let cashbackExcludeGroup = null; // id del grupo "negocio": sus gastos NO reciben cashback

function loadCashback(){
  try{ cashback = JSON.parse(localStorage.getItem(CASHBACK_KEY)) || []; }
  catch(e){ cashback = []; }
}
function saveCashback(){
  try{ localStorage.setItem(CASHBACK_KEY, JSON.stringify(cashback)); }catch(e){}
}
function loadCashbackExclude(){
  try{ cashbackExcludeGroup = localStorage.getItem(CASHBACK_EXCLUDE_KEY) || null; }
  catch(e){ cashbackExcludeGroup = null; }
}
function saveCashbackExclude(){
  try{
    if(cashbackExcludeGroup) localStorage.setItem(CASHBACK_EXCLUDE_KEY, cashbackExcludeGroup);
    else localStorage.removeItem(CASHBACK_EXCLUDE_KEY);
  }catch(e){}
}

// En esta app (amigos) NO existe el concepto de "producto"/stock: no venden nada,
// así que ningún gasto es "movimiento de stock" — todo cuenta como gasto real.
// (En la app personal esto detecta Canjes/Reposición para no contar productos, y
// además sincroniza el cashback a Google Sheets para el dashboard.)
function isCashbackExemptCategory(catId){ return false; }
function isStockMovement(e){ return false; }

// Cuánto cashback se retiró en un mes/año dado (suma simple de retiros de ese mes).
function cashbackInMonth(year, month){
  return cashback.reduce((s,c)=>{
    const d = new Date(c.date);
    return (d.getFullYear() === year && d.getMonth() === month) ? s + c.amount : s;
  }, 0);
}

// El cashback resta del total del MISMO mes en que se retiró — no se reparte gasto
// a gasto ni se arrastra a otro mes: si lo que gastaste ese mes (en efectivo real)
// no alcanza para "absorber" todo el retiro, el resto simplemente no se refleja en
// ningún mes (para eso existía el crédito acumulado, y Alberto prefiere que no).
// `list` debe ser de un solo mes (year, month). Los productos que salen de stock
// (isStockMovement) no pesan en nada; los del grupo "negocio" cuentan pero el
// cashback nunca los cubre.
function netTotalDetailed(list, year, month){
  let coverable = 0, excluded = 0;
  list.forEach(e=>{
    if(isStockMovement(e)) return;
    const isBusiness = cashbackExcludeGroup && expenseInGroup(e, cashbackExcludeGroup);
    if(isBusiness) excluded += e.amount; else coverable += e.amount;
  });
  const cb = cashbackInMonth(year, month);
  const recovered = Math.min(cb, coverable);
  return {net: excluded + (coverable - recovered), recovered: recovered, gross: excluded + coverable};
}

function netTotal(list, year, month){
  return netTotalDetailed(list, year, month).net;
}

// Cuánto cashback se recuperó (se reflejó en el total) dentro de un mes/año específico.
function cashbackUsedInMonth(year, month){
  const monthExp = expenses.filter(e=>{
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  return netTotalDetailed(monthExp, year, month).recovered;
}

// Cuánto cashback se recuperó en TODA la historia (suma de lo recuperado mes a mes).
// El cashback sigue restando solo dentro de su propio mes; esto es solo para VER
// el acumulado histórico, no cambia ningún total.
function cashbackUsedAllTime(){
  const seen = new Set();
  cashback.forEach(c=>{ const d = new Date(c.date); seen.add(d.getFullYear() + '-' + d.getMonth()); });
  let total = 0;
  seen.forEach(key=>{
    const [y, m] = key.split('-').map(Number);
    total += cashbackUsedInMonth(y, m);
  });
  return total;
}

function renderMonthTotal(){
  const monthExp = applyGroupFilter(currentMonthExpenses());
  const {net: total, recovered} = netTotalDetailed(monthExp, viewYear, viewMonth);
  const s = fmt(total);
  document.getElementById('monthValue').textContent = s;
  // Escala el tamaño para montos grandes (4-5 dígitos) sin desbordar.
  const valEl = document.querySelector('.month-total .value');
  if(valEl){
    valEl.classList.toggle('compact', s.length > 9 && s.length <= 12);
    valEl.classList.toggle('mini', s.length > 12);
  }
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('es-PE', {month:'long'});
  document.getElementById('monthLabel').textContent = monthName.charAt(0).toUpperCase()+monthName.slice(1);
  // Línea de cashback recuperado (solo si esta vista tuvo recuperación este mes).
  const cbEl = document.getElementById('mtCashback');
  if(cbEl){
    if(recovered > 0.005){
      cbEl.textContent = '💰 Recuperaste S/ ' + fmt(recovered) + ' de cashback';
      cbEl.style.display = '';
    } else {
      cbEl.textContent = '';
      cbEl.style.display = 'none';
    }
  }
  renderMtBudgetPanel();
  renderMtBudgetBar(total);
  renderMtCompare();
}

// Total gastado (con el filtro de grupo activo y neto de cashback si aplica) en
// un mes, limitado a los días 1..upToDay.
function groupFilteredTotalUpTo(year, month, upToDay){
  const monthExp = applyGroupFilter(expenses.filter(e=>{
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() <= upToDay;
  }));
  return netTotal(monthExp, year, month);
}

// Indicador ▲/▼ + % del total del mes (general/grupo) vs el mismo tramo de días del
// mes anterior. Igual criterio de "hasta qué día" que updateCategoryCompare.
function renderMtCompare(){
  const el = document.getElementById('mtCompare');
  if(!el) return;
  if(!showCatCompare){
    el.textContent = '';
    el.className = 'mt-compare';
    return;
  }
  const prev = new Date(viewYear, viewMonth - 1, 1);
  const prevYear = prev.getFullYear(), prevMonth = prev.getMonth();
  const prevName = prev.toLocaleDateString('es-PE', {month:'long'});
  const cutoff = compareCutoffDay(viewYear, viewMonth, prevYear, prevMonth);
  const viewedTotal = groupFilteredTotalUpTo(viewYear, viewMonth, cutoff);
  const prevTotalCapped = groupFilteredTotalUpTo(prevYear, prevMonth, cutoff);
  const fullPrevTotal = groupFilteredTotalUpTo(prevYear, prevMonth, Infinity);
  const result = buildCompareResult(viewedTotal, prevTotalCapped, fullPrevTotal);

  if(result === null){
    el.textContent = '';
    el.className = 'mt-compare';
  } else if(result.noWindowData){
    el.textContent = 'Sin gasto en los primeros ' + cutoff + ' días de ' + prevName;
    el.className = 'mt-compare';
  } else {
    el.textContent = (result.up ? '▲' : '▼') + ' ' + Math.abs(Math.round(result.diff)) + '% vs ' + prevName + ' (hasta el día ' + cutoff + ')';
    el.className = 'mt-compare ' + (result.up ? 'up' : 'down');
  }
}

// Tope para navegar meses hacia ADELANTE: se puede ver/presupuestar hasta
// diciembre del año en curso (para eso sirve poder adelantarse de mes). No se
// habilita año próximo todavía; eso se revisa cuando de verdad llegue diciembre.
function isMaxViewMonth(year, month){
  const now = new Date();
  return year === now.getFullYear() && month === 11;
}

// Etiqueta y flechas de navegación de mes, al costado de "Mis gastos".
function renderMonthSwitch(){
  const label = document.getElementById('monthSwitchLabel');
  const nextBtn = document.getElementById('monthNextBtn');
  if(!label || !nextBtn) return;
  let full = new Date(viewYear, viewMonth, 1).toLocaleDateString('es-PE', {month:'long', year:'numeric'});
  full = full.charAt(0).toUpperCase() + full.slice(1);
  label.textContent = full;
  nextBtn.disabled = isMaxViewMonth(viewYear, viewMonth);
}

document.getElementById('monthPrevBtn').addEventListener('click', ()=>{
  viewMonth--;
  if(viewMonth < 0){ viewMonth = 11; viewYear--; }
  renderAll();
});
document.getElementById('monthNextBtn').addEventListener('click', ()=>{
  if(isMaxViewMonth(viewYear, viewMonth)) return;
  viewMonth++;
  if(viewMonth > 11){ viewMonth = 0; viewYear++; }
  renderAll();
});

// Totales por categoría del mes actual (ordenados desc)
function currentMonthByCategory(){
  const monthExp = applyGroupFilter(currentMonthExpenses());
  const totals = {};
  monthExp.forEach(e=>{ if(isStockMovement(e)) return; totals[e.category] = (totals[e.category]||0) + e.amount; });
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
      'stroke="' + categoryDotColor(row.id) + '" stroke-width="14" ' +
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

// Muestra "S/" pegado al monto (compacto) y escala el tamaño según los dígitos,
// para que siempre quepa limpio dentro del círculo del donut sin tocar el anillo.
function fitDonutValue(el, numStr, isCategory){
  el.innerHTML = 'S/<span class="dc-num">' + numStr + '</span>';
  const L = numStr.length; // "999.99"=6 · "1,461.19"=8 · "10,000.00"=9 · "100,000.00"=10
  let size;
  if(L >= 10)     size = isCategory ? 12 : 14;
  else if(L >= 9) size = isCategory ? 13 : 15;
  else if(L >= 8) size = isCategory ? 14 : 17;
  else if(L >= 7) size = isCategory ? 15 : 18;
  else            size = isCategory ? 16 : 20;
  el.style.fontSize = size + 'px';
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
      fitDonutValue(value, fmt(row.total), true);
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
  fitDonutValue(value, fmt(grandTotal), false);
  if(pctEl) pctEl.textContent = '';
}

// A diferencia del donut (que solo dibuja categorías CON gasto), esta lista
// siempre incluye TODAS las categorías, aunque no tengan gasto este mes —
// así se puede entrar a cualquiera (aunque esté en S/ 0.00) para configurar
// o editar su presupuesto, incluso en meses futuros sin datos todavía.
function currentMonthByCategoryFull(){
  const {rows, grandTotal} = currentMonthByCategory();
  const withData = {};
  rows.forEach(r=>{ withData[r.id] = r; });
  // Si hay un grupo activo (Timeless/Personal/etc.), el "completo" debe ser
  // completo DENTRO de ese grupo (sus categorías), no todas las de la app —
  // si no, al filtrar por grupo se mezclaban categorías de otros grupos.
  // Se incluye también cualquier categoría que YA tenga gasto en `rows` (por
  // si un gasto quedó etiquetado a mano a este grupo sin que su categoría
  // esté oficialmente en group.cats), para no perder ese dato.
  let catIds;
  if(activeGroup){
    const g = catGroups.find(x=>x.id === activeGroup);
    catIds = g ? g.cats.slice() : [];
    Object.keys(withData).forEach(id=>{ if(catIds.indexOf(id) === -1) catIds.push(id); });
  } else {
    catIds = allCategories().map(c=>c.id);
  }
  const all = catIds.map(id=>{
    if(withData[id]) return withData[id];
    const cat = catById(id) || {id:id, icon:'🗂️', name:'Otros'};
    return {id:id, icon:cat.icon, name:cat.name, total:0, color:catColor(id)};
  }).sort((a,b)=> b.total - a.total);
  return {rows: all, grandTotal};
}

function renderBreakdown(){
  const {rows, grandTotal} = currentMonthByCategoryFull();
  const container = document.getElementById('breakdown');

  // Mes anterior al que se está viendo, para el indicador ▲/▼ por categoría.
  // Compara solo el mismo tramo de días en ambos meses (ver compareCutoffDay).
  const prev = new Date(viewYear, viewMonth - 1, 1);
  const prevYear = prev.getFullYear(), prevMonth = prev.getMonth();
  const cutoff = compareCutoffDay(viewYear, viewMonth, prevYear, prevMonth);

  container.innerHTML = rows.map(c=>{
    const pct = grandTotal>0 ? (c.total/grandTotal*100) : 0;
    let compareHtml = '';
    if(showCatCompare){
      const cappedTotal = categoryTotalForMonth(c.id, viewYear, viewMonth, cutoff);
      const prevTotalCapped = categoryTotalForMonth(c.id, prevYear, prevMonth, cutoff);
      const fullPrevTotal = categoryTotalForMonth(c.id, prevYear, prevMonth);
      const result = buildCompareResult(cappedTotal, prevTotalCapped, fullPrevTotal);
      if(result && !result.noWindowData){
        compareHtml = '<span class="bd-compare ' + (result.up ? 'up' : 'down') + '">' + (result.up ? '▲' : '▼') + ' ' + Math.abs(Math.round(result.diff)) + '%</span>';
      }
    }
    return '<div class="bd-row clickable" data-cat="' + c.id + '"><span class="icon">' + c.icon + '</span><span class="name">' + c.name + '</span>' + compareHtml + '<span class="amt">S/ ' + fmt(c.total) + '</span><span class="chevron">›</span></div><div class="bd-bar"><div class="bd-bar-fill" style="width:' + pct + '%"></div></div>';
  }).join('');

  container.querySelectorAll('.bd-row[data-cat]').forEach(row=>{
    row.addEventListener('click', ()=> openCategoryDetail(row.getAttribute('data-cat')));
  });
}

/* ---------- Simulador de ahorro ----------
   Página completa aparte (se abre desde la tarjeta entre "Por categoría" y
   "Comparar meses"). Deja marcar qué gastos del mes eran EVITABLES para calcular
   cuánto se pudo ahorrar, con donut de gasto necesario por categoría y un gráfico
   de barras de ahorro mes a mes. Es 100% local y separado: NO toca los totales
   reales, ni Sheets, ni el dashboard. El marcado se guarda por gasto (persiste
   entre sesiones y meses). Los productos (reposición/canjes) nunca cuentan aquí. */
let avoidableIds = [];       // ids de gastos marcados evitables a mano (categorías SIN la regla automática)
let simAutoAvoidCats = [];   // ids de categoría marcadas "siempre innecesaria": todo gasto (existente o nuevo) es evitable por defecto
let avoidableExceptions = []; // ids de gastos que SÍ son necesarios pese a la regla automática de su categoría
let simScope = null;         // grupo elegido DENTRO de la página del simulador (null = Todos)
let simGraphMode = 'necesario'; // 'necesario' | 'evitable' — qué muestran el donut, las barras y (en modo Ver) la lista
let simActiveCat = null;        // categoría seleccionada en el donut del simulador (null = ninguna)
let simListMode = 'marcar';     // 'marcar' = marcar lo evitable | 'ver' = solo ver la lista de gastos necesarios/evitables
const simOpenCats = new Set(); // categorías EXPANDIDAS en la lista de marcado (por defecto todas cerradas)

function loadAvoidable(){
  try{ avoidableIds = JSON.parse(localStorage.getItem(AVOIDABLE_KEY)) || []; }
  catch(e){ avoidableIds = []; }
}
function saveAvoidable(){
  try{ localStorage.setItem(AVOIDABLE_KEY, JSON.stringify(avoidableIds)); }catch(e){}
}
function loadSimAutoAvoidCats(){
  try{ simAutoAvoidCats = JSON.parse(localStorage.getItem(SIM_AUTO_AVOID_KEY)) || []; }
  catch(e){ simAutoAvoidCats = []; }
}
function saveSimAutoAvoidCats(){
  try{ localStorage.setItem(SIM_AUTO_AVOID_KEY, JSON.stringify(simAutoAvoidCats)); }catch(e){}
}
function loadAvoidableExceptions(){
  try{ avoidableExceptions = JSON.parse(localStorage.getItem(AVOIDABLE_EXCEPT_KEY)) || []; }
  catch(e){ avoidableExceptions = []; }
}
function saveAvoidableExceptions(){
  try{ localStorage.setItem(AVOIDABLE_EXCEPT_KEY, JSON.stringify(avoidableExceptions)); }catch(e){}
}

// Si la categoría del gasto tiene la regla "siempre innecesaria" activa, es
// evitable por defecto salvo que esté en la lista de excepciones (lo marcaste
// como necesario a mano). Si no tiene la regla, funciona como antes: solo es
// evitable si lo marcaste a mano (avoidableIds).
function isAvoidableExpense(e){
  if(simAutoAvoidCats.indexOf(e.category) !== -1) return avoidableExceptions.indexOf(e.id) === -1;
  return avoidableIds.indexOf(e.id) !== -1;
}

function toggleAvoidable(id){
  const e = expenses.find(x=>x.id===id);
  if(e && simAutoAvoidCats.indexOf(e.category) !== -1){
    // Categoría con regla automática: tocar un gasto puntual lo excluye (o lo
    // vuelve a incluir) de esa regla, sin apagar la regla para el resto.
    const i = avoidableExceptions.indexOf(id);
    if(i === -1) avoidableExceptions.push(id); else avoidableExceptions.splice(i, 1);
    saveAvoidableExceptions();
  } else {
    const i = avoidableIds.indexOf(id);
    if(i === -1) avoidableIds.push(id); else avoidableIds.splice(i, 1);
    saveAvoidable();
  }
  renderSim();
}

// Activa/desactiva la regla "toda esta categoría es innecesaria". Al activar,
// todo gasto de esa categoría (los de ahora Y los que agregues después) se
// marca evitable solo; si desmarcas uno a mano queda como excepción (no vuelve
// a marcarse por más gastos nuevos que entren). Al desactivar, se "congela" el
// estado actual (lo que era evitable por la regla pasa a marcado a mano) para
// no perder nada de golpe, y la categoría vuelve al modo manual de siempre.
function simToggleAutoAvoidCat(catId){
  const idx = simAutoAvoidCats.indexOf(catId);
  if(idx === -1){
    simAutoAvoidCats.push(catId);
    // El modo automático se basa solo en la lista de excepciones; limpia
    // marcas manuales sueltas de esta categoría para no dejar datos huérfanos.
    avoidableIds = avoidableIds.filter(id=>{
      const e = expenses.find(x=>x.id===id);
      return !e || e.category !== catId;
    });
    saveAvoidable();
  } else {
    simAutoAvoidCats.splice(idx, 1);
    expenses.forEach(e=>{
      if(e.category !== catId) return;
      const wasAvoidable = avoidableExceptions.indexOf(e.id) === -1; // regla activa = evitable salvo excepción
      if(wasAvoidable && avoidableIds.indexOf(e.id) === -1) avoidableIds.push(e.id);
    });
    avoidableExceptions = avoidableExceptions.filter(id=>{
      const e = expenses.find(x=>x.id===id);
      return !e || e.category !== catId;
    });
    saveAvoidable();
    saveAvoidableExceptions();
  }
  saveSimAutoAvoidCats();
  renderSim();
}

// Gastos del mes que se está viendo, en el scope del simulador, sin productos.
function simScopeExpenses(){
  return filterByGroupId(currentMonthExpenses(), simScope).filter(e=> !isStockMovement(e));
}

// Gastos de un mes concreto en el scope, sin productos (base para los totales mes a mes).
function simMonthList(year, month){
  return filterByGroupId(expenses.filter(e=>{
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  }), simScope).filter(e=> !isStockMovement(e));
}
// Suma evitable de un mes concreto (respetando el scope), para el gráfico mes a mes.
function avoidableForMonth(year, month){
  return simMonthList(year, month).filter(isAvoidableExpense).reduce((s,e)=> s + e.amount, 0);
}
// Suma NECESARIA de un mes concreto (lo que NO se marcó evitable).
function necessaryForMonth(year, month){
  return simMonthList(year, month).filter(e=> !isAvoidableExpense(e)).reduce((s,e)=> s + e.amount, 0);
}

// Teaser de la tarjeta lanzadora (usa el grupo activo de la pantalla principal).
function renderSimLauncher(){
  const t = document.getElementById('simTease');
  if(!t) return;
  const list = applyGroupFilter(currentMonthExpenses()).filter(e=> !isStockMovement(e));
  const avoid = list.filter(isAvoidableExpense).reduce((s,e)=> s + e.amount, 0);
  t.textContent = avoid > 0.005
    ? ('Este mes marcaste S/ ' + fmt(avoid) + ' como evitable')
    : 'Marca tus gastos evitables y mira cuánto pudiste ahorrar';
}

function openSimPage(){
  simScope = activeGroup; // arranca con el grupo que tengas activo en la pantalla principal
  const page = document.getElementById('simPage');
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cd-open');
  page.scrollTop = 0;
  renderSim();
}
function closeSimPage(){
  const page = document.getElementById('simPage');
  page.classList.remove('open');
  page.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cd-open');
  renderSimLauncher(); // refresca el teaser por si marcaron cosas
}

// Flechitas de mes dentro de la página del simulador (‹ Mes ›).
function renderSimMonthNav(){
  const label = document.getElementById('simMonthLabel');
  const nextBtn = document.getElementById('simMonthNext');
  if(!label || !nextBtn) return;
  label.textContent = cap(new Date(viewYear, viewMonth, 1).toLocaleDateString('es-PE', {month:'long', year:'numeric'}));
  nextBtn.disabled = isMaxViewMonth(viewYear, viewMonth);
}

// Chips "Ver: Todos / Timeless / Personal" dentro de la página.
function renderSimScope(){
  const box = document.getElementById('simScopeOpts');
  const row = document.getElementById('simScopeRow');
  if(!box || !row) return;
  if(catGroups.length === 0){ row.style.display = 'none'; box.innerHTML = ''; return; }
  row.style.display = '';
  let html = '<div class="gt-opt' + (!simScope ? ' selected' : '') + '" data-g="">Todos</div>';
  catGroups.forEach(g=>{
    html += '<div class="gt-opt' + (simScope === g.id ? ' selected' : '') + '" data-g="' + g.id + '">' + g.name + '</div>';
  });
  box.innerHTML = html;
  box.querySelectorAll('.gt-opt').forEach(el=>{
    el.onclick = ()=>{ simScope = el.getAttribute('data-g') || null; renderSim(); };
  });
}

// Chips "Necesario / Evitable" que cambian qué muestran el donut y las barras.
function renderSimGraphToggle(){
  document.querySelectorAll('#simGraphToggle .gt-opt').forEach(el=>{
    el.classList.toggle('selected', el.getAttribute('data-mode') === simGraphMode);
  });
  const evit = simGraphMode === 'evitable';
  document.getElementById('simDonutTitle').textContent = evit ? 'Gasto evitable por categoría' : 'Gasto necesario por categoría';
  document.getElementById('simDonutLabel').textContent = evit ? 'Evitable' : 'Necesario';
  document.getElementById('simMonthsTitle').textContent = evit ? 'Cuánto pudiste ahorrar mes a mes' : 'Gasto necesario mes a mes';
}

// Donut por categoría: modo 'necesario' (lo que quedaría) o 'evitable' (lo que se pudo ahorrar).
// Segmentos y leyenda clickeables (igual que el donut principal): al elegir una
// categoría, el centro muestra su monto y qué % es de lo necesario/evitable.
function renderSimDonut(list){
  const svg = document.getElementById('simDonutSvg');
  const legend = document.getElementById('simDonutLegend');
  const value = document.getElementById('simDonutValue');
  const labelEl = document.getElementById('simDonutLabel');
  const pctEl = document.getElementById('simDonutPct');
  if(!svg) return;
  const evit = simGraphMode === 'evitable';
  const byCat = {};
  list.forEach(e=>{
    const marked = isAvoidableExpense(e);
    if(evit ? !marked : marked) return; // en 'evitable' solo los marcados; en 'necesario' solo los no marcados
    byCat[e.category] = (byCat[e.category]||0) + e.amount;
  });
  const rows = Object.keys(byCat)
    .map(id=>{ const c = catById(id) || {id:id, icon:'🗂️', name:'Otros'}; return {id:id, icon:c.icon, name:c.name, total:byCat[id]}; })
    .filter(r=>r.total > 0)
    .sort((a,b)=> b.total - a.total);
  const grand = rows.reduce((s,r)=> s + r.total, 0);

  // Si la categoría elegida ya no está (cambió mes/scope/modo), limpiar selección.
  if(simActiveCat && !rows.some(r=>r.id===simActiveCat)) simActiveCat = null;

  const setCenter = ()=>{
    if(simActiveCat){
      const row = rows.find(r=>r.id===simActiveCat);
      labelEl.textContent = row.icon + ' ' + row.name;
      fitDonutValue(value, fmt(row.total), true);
      if(pctEl) pctEl.textContent = (row.total/grand*100).toFixed(1) + '% de lo ' + (evit ? 'evitable' : 'necesario');
    } else {
      labelEl.textContent = evit ? 'Evitable' : 'Necesario';
      fitDonutValue(value, fmt(grand), false);
      if(pctEl) pctEl.textContent = '';
    }
  };

  if(grand === 0){
    svg.innerHTML = '';
    legend.innerHTML = '<div class="sim-donut-empty">' + (evit ? 'No marcaste gastos evitables este mes.' : 'Marca gastos para ver el necesario.') + '</div>';
    labelEl.textContent = evit ? 'Evitable' : 'Necesario';
    fitDonutValue(value, fmt(0), false);
    if(pctEl) pctEl.textContent = '';
    return;
  }

  const cx = 60, cy = 60, r = 46, C = 2 * Math.PI * r;
  let offset = 0, segs = '';
  rows.forEach(row=>{
    const len = row.total / grand * C;
    const active = simActiveCat === row.id;
    segs += '<circle class="seg' + (active ? ' active' : '') + '" data-cat="' + row.id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + categoryDotColor(row.id) + '" stroke-width="14" stroke-dasharray="' + len + ' ' + (C - len) + '" stroke-dashoffset="' + (-offset) + '"></circle>';
    offset += len;
  });
  svg.innerHTML = segs;
  legend.innerHTML = rows.map(row=>{
    const active = simActiveCat === row.id;
    return '<div class="leg' + (active ? ' active' : '') + '" data-cat="' + row.id + '"><span class="dot" style="background:' + categoryDotColor(row.id) + '"></span>' + row.name + ' <span class="leg-amt">S/ ' + fmt(row.total) + '</span></div>';
  }).join('');
  setCenter();

  const pick = (id)=>{ simActiveCat = (simActiveCat === id) ? null : id; renderSimDonut(list); };
  svg.querySelectorAll('.seg').forEach(el=> el.addEventListener('click', ()=> pick(el.getAttribute('data-cat'))));
  legend.querySelectorAll('.leg').forEach(el=> el.addEventListener('click', ()=> pick(el.getAttribute('data-cat'))));
}

// Barras mes a mes: 'evitable' = cuánto pudiste ahorrar cada mes; 'necesario' = gasto necesario cada mes.
function renderSimMonths(){
  const barsBox = document.getElementById('simMonthsBars');
  if(!barsBox) return;
  const evit = simGraphMode === 'evitable';
  const now = new Date();
  let earliest = new Date(now.getFullYear(), now.getMonth(), 1);
  expenses.forEach(e=>{ const d = new Date(e.date); const f = new Date(d.getFullYear(), d.getMonth(), 1); if(f < earliest) earliest = f; });
  const series = [];
  const cur = new Date(earliest);
  let guard = 0;
  while(cur <= now && guard < 240){
    const y = cur.getFullYear(), m = cur.getMonth();
    const v = evit ? avoidableForMonth(y, m) : necessaryForMonth(y, m);
    let full = cur.toLocaleDateString('es-PE', {month:'long', year:'numeric'});
    full = full.charAt(0).toUpperCase() + full.slice(1);
    series.push({ year:y, month:m, label: cur.toLocaleDateString('es-PE', {month:'short'}).replace('.',''), full:full, v:v, current: (y === viewYear && m === viewMonth) });
    cur.setMonth(cur.getMonth() + 1); guard++;
  }
  const shown = series.slice(-12);
  const maxV = Math.max(...shown.map(s=>s.v), 1);
  barsBox.innerHTML = shown.map(s=>{
    const h = s.v > 0 ? Math.max(s.v / maxV * 100, 4) : 2;
    return '<div class="mbar sim-mbar' + (evit ? ' evit' : '') + (s.current ? ' current' : '') + '" data-year="' + s.year + '" data-month="' + s.month + '">' +
             '<div class="col" style="height:' + h + '%"></div>' +
             '<div class="mlbl">' + s.label + '</div>' +
           '</div>';
  }).join('');

  // Lista abajo (mes por mes con su monto), más reciente primero — así el monto
  // siempre se ve claro y escala bien cuando se acumulan meses.
  const listBox = document.getElementById('simMonthsList');
  if(listBox){
    listBox.innerHTML = [...shown].reverse().map(s=>
      '<div class="ml-row' + (s.current ? ' current' : '') + '" data-year="' + s.year + '" data-month="' + s.month + '">' +
        '<span class="ml-name">' + s.full + '</span>' +
        '<span class="ml-amt">S/ ' + fmt(s.v) + '</span>' +
      '</div>'
    ).join('');
  }

  const goMonth = (el)=>{
    viewYear = parseInt(el.getAttribute('data-year'), 10);
    viewMonth = parseInt(el.getAttribute('data-month'), 10);
    renderAll();   // la pantalla principal detrás también sigue el mes
    renderSim();   // y el simulador se recalcula para ese mes
  };
  barsBox.querySelectorAll('.sim-mbar').forEach(el=> el.addEventListener('click', ()=> goMonth(el)));
  if(listBox) listBox.querySelectorAll('.ml-row').forEach(el=> el.addEventListener('click', ()=> goMonth(el)));
}

function renderSim(){
  const page = document.getElementById('simPage');
  if(!page || !page.classList.contains('open')) return;
  renderSimMonthNav();
  renderSimScope();

  const list = simScopeExpenses();
  const real = list.reduce((s,e)=> s + e.amount, 0);
  const avoidable = list.filter(isAvoidableExpense).reduce((s,e)=> s + e.amount, 0);
  const necesario = real - avoidable;
  const scopeName = simScope ? ((catGroups.find(x=>x.id===simScope)||{}).name || 'grupo') : 'Todos';
  const monthName = cap(new Date(viewYear, viewMonth, 1).toLocaleDateString('es-PE', {month:'long', year:'numeric'}));

  // Resumen
  document.getElementById('simSummary').innerHTML =
    '<div class="sim-scope">Simulación · ' + scopeName + ' · ' + monthName + '</div>' +
    '<div class="sim-save">Pudiste ahorrar <span>S/ ' + fmt(avoidable) + '</span></div>' +
    '<div class="sim-totals">' +
      '<span>Gastaste: <b>S/ ' + fmt(real) + '</b></span>' +
      '<span>Necesario: <b>S/ ' + fmt(necesario) + '</b></span>' +
    '</div>';

  // Desglose por categoría (cuánto de evitable hay en cada una)
  const byCat = {};
  list.forEach(e=>{
    const k = e.category;
    if(!byCat[k]) byCat[k] = {total:0, avoid:0};
    byCat[k].total += e.amount;
    if(isAvoidableExpense(e)) byCat[k].avoid += e.amount;
  });
  const catRows = Object.keys(byCat)
    .map(id=>{ const c = catById(id) || {id:id, icon:'🗂️', name:'Otros'}; return {id:id, icon:c.icon, name:c.name, total:byCat[id].total, avoid:byCat[id].avoid}; })
    .sort((a,b)=> b.avoid - a.avoid || b.total - a.total);
  document.getElementById('simCats').innerHTML = catRows.map(c=>{
    const pct = c.total > 0 ? (c.avoid / c.total * 100) : 0;
    const avoidLabel = c.avoid > 0.005 ? '<span class="sim-cat-avoid">−S/ ' + fmt(c.avoid) + '</span>' : '<span class="sim-cat-none">todo necesario</span>';
    return '<div class="sim-cat-row"><span class="icon">' + c.icon + '</span><span class="sim-cat-name">' + c.name + '</span>' + avoidLabel + '<span class="sim-cat-total">de S/ ' + fmt(c.total) + '</span></div>' +
           '<div class="sim-cat-bar"><div class="sim-cat-bar-fill" style="width:' + pct + '%"></div></div>';
  }).join('');

  // Gráficos (donut + barras mes a mes, según el modo Necesario/Evitable)
  renderSimGraphToggle();
  renderSimDonut(list);
  renderSimMonths();

  // Lista de gastos marcables — agrupada por categoría, COLAPSABLE (arranca cerrada).
  const grouped = {};
  const order = [];
  [...list].sort((a,b)=> new Date(b.date) - new Date(a.date)).forEach(e=>{
    if(!grouped[e.category]){ grouped[e.category] = []; order.push(e.category); }
    grouped[e.category].push(e);
  });
  const itemsHtml = order.map(catId=>{
    const c = catById(catId) || {icon:'🗂️', name:'Otros'};
    const items = grouped[catId];
    const catTotal = items.reduce((s,e)=> s + e.amount, 0);
    const catAvoid = items.filter(isAvoidableExpense).reduce((s,e)=> s + e.amount, 0);
    const open = simOpenCats.has(catId);
    const isAuto = simAutoAvoidCats.indexOf(catId) !== -1;
    const allMarked = items.every(isAvoidableExpense);
    const rows = items.map(e=>{
      const marked = isAvoidableExpense(e);
      const d = new Date(e.date);
      const dateStr = d.toLocaleDateString('es-PE', {day:'2-digit', month:'short'});
      const label = (e.note ? e.note : c.name) + ' · ' + dateStr;
      return '<div class="sim-item' + (marked ? ' avoid' : '') + '" data-id="' + e.id + '">' +
               '<div class="sim-check">' + (marked ? '✕' : '') + '</div>' +
               '<div class="sim-item-info">' + label + '</div>' +
               '<div class="sim-item-amt">S/ ' + fmt(e.amount) + '</div>' +
             '</div>';
    }).join('');
    // Sin la regla automática: "Marcar/Quitar todos" (de un solo golpe, solo lo
    // que hay AHORA) + botón para activar la regla. Con la regla activa: un
    // solo badge que la muestra prendida y permite apagarla; los gastos NUEVOS
    // de esta categoría se marcarán solos mientras siga activa.
    const actions = isAuto
      ? '<button class="sim-auto-btn on" type="button" data-cat="' + catId + '">🔁 Categoría innecesaria — toca para quitar la regla</button>'
      : '<button class="sim-selall" type="button" data-cat="' + catId + '">' + (allMarked ? 'Quitar todos' : 'Marcar todos') + '</button>' +
        '<button class="sim-auto-btn" type="button" data-cat="' + catId + '">🔁 Toda esta categoría es innecesaria</button>';
    const avoidTag = catAvoid > 0.005 ? '<span class="sim-cat-hd-avoid">−S/ ' + fmt(catAvoid) + '</span>' : '';
    return '<div class="sim-cat-group' + (open ? ' open' : '') + '" data-cat="' + catId + '">' +
             '<div class="sim-cat-head">' +
               '<span class="sim-caret">▸</span>' +
               '<span class="icon">' + c.icon + '</span>' +
               '<span class="sim-cat-hd-name">' + c.name + ' <span class="sim-cat-hd-count">(' + items.length + ')</span></span>' +
               avoidTag +
               '<span class="sim-cat-hd-total">S/ ' + fmt(catTotal) + '</span>' +
             '</div>' +
             '<div class="sim-cat-items">' +
               (isAuto ? '<div class="sim-auto-hint">Los gastos nuevos de esta categoría se marcan evitables solos. Toca uno abajo si alguno sí fue necesario.</div>' : '') +
               '<div class="sim-cat-actions">' + actions + '</div>' + rows +
             '</div>' +
           '</div>';
  }).join('');

  // Modo VER: lista plana de solo lectura con los gastos del bucket elegido en
  // los chips (Necesario/Evitable), dentro del grupo seleccionado, ordenados de
  // mayor a menor — para revisar rápido "cuáles son" sin entrar categoría por categoría.
  const verEvit = simGraphMode === 'evitable';
  const verItems = [...list]
    .filter(e=> verEvit ? isAvoidableExpense(e) : !isAvoidableExpense(e))
    .sort((a,b)=> b.amount - a.amount);
  const verTotal = verItems.reduce((s,e)=> s + e.amount, 0);
  const verRows = verItems.map(e=>{
    const c = catById(e.category) || {icon:'🗂️', name:'Otros'};
    const d = new Date(e.date);
    const dateStr = d.toLocaleDateString('es-PE', {day:'2-digit', month:'short'});
    const label = e.note ? e.note : c.name;
    return '<div class="sim-ver-item" data-id="' + e.id + '">' +
             '<span class="icon">' + c.icon + '</span>' +
             '<span class="sim-ver-info"><span class="sim-ver-note">' + label + '</span>' +
               '<span class="sim-ver-sub">' + c.name + ' · ' + dateStr + '</span></span>' +
             '<span class="sim-ver-amt">S/ ' + fmt(e.amount) + '</span>' +
           '</div>';
  }).join('');

  // Cabecera con el toggle Marcar / Ver (siempre visible si hay gastos).
  const modeToggle =
    '<div class="sim-list-modes">' +
      '<button class="sim-list-mode-btn' + (simListMode === 'marcar' ? ' active' : '') + '" type="button" data-lmode="marcar">✍️ Marcar</button>' +
      '<button class="sim-list-mode-btn' + (simListMode === 'ver' ? ' active' : '') + '" type="button" data-lmode="ver">👁️ Ver</button>' +
    '</div>';

  const listBox = document.getElementById('simList');
  if(list.length === 0){
    listBox.innerHTML = '<div class="empty">No hay gastos que simular en ' + monthName + (simScope ? ' para ' + scopeName : '') + '.</div>';
  } else if(simListMode === 'ver'){
    const verTitle = 'Gastos ' + (verEvit ? 'evitables' : 'necesarios') + ' · ' + scopeName;
    const verBody = verItems.length
      ? ('<div class="sim-ver-subtotal">' + verItems.length + ' gasto(s) · <b>S/ ' + fmt(verTotal) + '</b></div>' + verRows)
      : '<div class="empty">No hay gastos ' + (verEvit ? 'evitables' : 'necesarios') + ' en ' + monthName + '.</div>';
    listBox.innerHTML = modeToggle + '<div class="sim-list-title">' + verTitle + '</div>' + verBody;
    listBox.querySelectorAll('.sim-ver-item').forEach(el=>{
      el.addEventListener('click', ()=> jumpToExpense(el.getAttribute('data-id')));
    });
  } else {
    listBox.innerHTML = modeToggle + '<div class="sim-list-title">Marca lo que pudiste evitar</div>' + itemsHtml;
    listBox.querySelectorAll('.sim-cat-group').forEach(group=>{
      group.querySelector('.sim-cat-head').addEventListener('click', ()=>{
        const id = group.getAttribute('data-cat');
        group.classList.toggle('open');
        if(group.classList.contains('open')) simOpenCats.add(id); else simOpenCats.delete(id);
      });
    });
    listBox.querySelectorAll('.sim-item').forEach(el=>{
      el.addEventListener('click', ()=> toggleAvoidable(el.getAttribute('data-id')));
    });
    listBox.querySelectorAll('.sim-selall').forEach(btn=>{
      btn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const group = btn.closest('.sim-cat-group');
        const ids = Array.from(group.querySelectorAll('.sim-item')).map(el=>el.getAttribute('data-id'));
        simSelectAllCat(ids);
      });
    });
    listBox.querySelectorAll('.sim-auto-btn').forEach(btn=>{
      btn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        simToggleAutoAvoidCat(btn.getAttribute('data-cat'));
      });
    });
  }
  // Toggle Marcar/Ver (presente en ambos modos mientras haya gastos).
  listBox.querySelectorAll('.sim-list-mode-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{ simListMode = btn.getAttribute('data-lmode'); renderSim(); });
  });
}

// Marca (o desmarca, si ya estaban todos) TODOS los gastos de una categoría de golpe.
function simSelectAllCat(ids){
  const allMarked = ids.every(id=> avoidableIds.indexOf(id) !== -1);
  if(allMarked){
    avoidableIds = avoidableIds.filter(id=> ids.indexOf(id) === -1);
  } else {
    ids.forEach(id=>{ if(avoidableIds.indexOf(id) === -1) avoidableIds.push(id); });
  }
  saveAvoidable();
  renderSim();
}

document.getElementById('simOpenBtn').addEventListener('click', openSimPage);
document.querySelectorAll('#simGraphToggle .gt-opt').forEach(el=>{
  el.addEventListener('click', ()=>{ simGraphMode = el.getAttribute('data-mode'); simActiveCat = null; renderSim(); });
});
document.getElementById('simBack').addEventListener('click', closeSimPage);
document.getElementById('simMonthPrev').addEventListener('click', ()=>{
  viewMonth--;
  if(viewMonth < 0){ viewMonth = 11; viewYear--; }
  renderAll();  // la pantalla principal detrás también sigue el mes
  renderSim();
});
document.getElementById('simMonthNext').addEventListener('click', ()=>{
  if(isMaxViewMonth(viewYear, viewMonth)) return;
  viewMonth++;
  if(viewMonth > 11){ viewMonth = 0; viewYear++; }
  renderAll();
  renderSim();
});

/* ---------- Detalle diario por categoría (página completa) ---------- */
// Suma por día del mes actual, solo para una categoría.
function dailyTotalsForCategory(catId){
  const year = viewYear, month = viewMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totals = new Array(daysInMonth + 1).fill(0); // index 1..daysInMonth
  expenses.forEach(e=>{
    if(e.category !== catId) return;
    if(isStockMovement(e)) return;
    const d = new Date(e.date);
    if(d.getFullYear() === year && d.getMonth() === month){
      totals[d.getDate()] += e.amount;
    }
  });
  return {totals, daysInMonth, year, month};
}

// Movimientos de producto (que NO gastan efectivo: canjes/reposición marcados como
// Producto) de una categoría en el mes que se está viendo, del más reciente al más
// antiguo. Sirve para la vista "Productos que salieron" dentro de la categoría —
// no entran en ningún total de efectivo, pero el usuario quiere poder verlos.
function stockMovementsForCategory(catId){
  const year = viewYear, month = viewMonth;
  return expenses
    .filter(e=>{
      if(e.category !== catId || !isStockMovement(e)) return false;
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a,b)=> new Date(b.date) - new Date(a.date));
}

function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// Total de una categoría en un mes/año dados. `upToDay` (opcional) limita la suma
// a los días 1..upToDay del mes (para comparar "lo que va del mes" contra el mismo
// tramo de días del mes anterior, en vez de mes completo vs mes a medias).
function categoryTotalForMonth(catId, year, month, upToDay){
  const cap = (upToDay == null) ? Infinity : upToDay;
  let t = 0;
  expenses.forEach(e=>{
    if(e.category !== catId) return;
    if(isStockMovement(e)) return;
    const d = new Date(e.date);
    if(d.getFullYear() === year && d.getMonth() === month && d.getDate() <= cap) t += e.amount;
  });
  return t;
}

// Día límite para comparar el mes (yearA,monthA) contra (yearB,monthB): si A es el
// mes real en curso, hasta hoy; si A ya terminó, hasta su último día. Nunca más
// allá de los días que tenga B (ej: comparar contra febrero corta en el día 28/29).
function compareCutoffDay(yearA, monthA, yearB, monthB){
  const now = new Date();
  const isOngoing = (yearA === now.getFullYear() && monthA === now.getMonth());
  const daysInA = new Date(yearA, monthA + 1, 0).getDate();
  const daysInB = new Date(yearB, monthB + 1, 0).getDate();
  const cutoff = isOngoing ? now.getDate() : daysInA;
  return Math.min(cutoff, daysInB);
}

// Decide qué mostrar en un indicador de comparación:
// - null: el mes anterior no tuvo NINGÚN gasto (ni siquiera fuera del tramo) -> ocultar del todo.
// - {noWindowData:true}: el mes anterior sí tuvo gasto, pero no dentro del mismo tramo de días
//   (ej: recién el día 20) -> avisar que no hay con qué comparar en ese tramo, en vez de
//   desaparecer sin explicación (eso es lo que hacía parecer que el indicador estaba roto).
// - {diff, up}: hay datos comparables en ambos tramos -> mostrar el % normal.
function buildCompareResult(cappedNow, cappedPrev, fullPrev){
  if(fullPrev <= 0) return null;
  if(cappedPrev <= 0) return {noWindowData:true};
  const diff = (cappedNow - cappedPrev) / cappedPrev * 100;
  return {diff:diff, up: diff >= 0};
}

// Indicador ▲/▼ + % vs el mismo tramo de días del mes anterior, y el total (completo,
// sin recortar) del mes anterior en la esquina. Ambos solo si showCatCompare está activo.
function updateCategoryCompare(catId, monthTotal, year, month){
  const el = document.getElementById('cdCompare');
  const prevEl = document.getElementById('cdPrevTotal');
  if(!el) return;
  const prev = new Date(year, month - 1, 1);
  const prevYear = prev.getFullYear(), prevMonth = prev.getMonth();
  const prevName = prev.toLocaleDateString('es-PE', {month:'long'});

  if(!showCatCompare){
    el.textContent = '';
    el.className = 'cd-compare';
    if(prevEl) prevEl.textContent = '';
    return;
  }

  const fullPrevTotal = categoryTotalForMonth(catId, prevYear, prevMonth);
  if(prevEl){
    prevEl.textContent = 'Total ' + cap(prevName) + ': S/ ' + fmt(fullPrevTotal);
  }

  const cutoff = compareCutoffDay(year, month, prevYear, prevMonth);
  const monthTotalCapped = categoryTotalForMonth(catId, year, month, cutoff);
  const prevTotalCapped = categoryTotalForMonth(catId, prevYear, prevMonth, cutoff);
  const result = buildCompareResult(monthTotalCapped, prevTotalCapped, fullPrevTotal);

  if(result === null){
    el.textContent = '';
    el.className = 'cd-compare';
  } else if(result.noWindowData){
    el.textContent = 'Sin gasto en los primeros ' + cutoff + ' días de ' + prevName;
    el.className = 'cd-compare';
  } else {
    el.textContent = (result.up ? '▲' : '▼') + ' ' + Math.abs(Math.round(result.diff)) + '% vs ' + prevName + ' (hasta el día ' + cutoff + ')';
    el.className = 'cd-compare ' + (result.up ? 'up' : 'down');
  }
}

// Estado del gráfico de detalle
let cdDays = [];            // [{day, total, label}] solo días con gasto
let cdDaysInMonth = 30;     // días del mes actual (eje = línea de tiempo completa)
let cdSlot = 46;            // px por día en el eje (controla zoom/separación)
let cdSlotMin = 12;         // zoom mínimo: el mes completo cabe en pantalla
let cdSlotMax = 84;         // zoom máximo
let cdBarW = 34;            // ancho de barra actual (px) — fijo, solo cambia con zoom
let cdActiveIndex = -1;     // barra con tooltip visible
let cdCatId = null;         // categoría abierta actualmente
let cdYear = null;
let cdMonth = null;
let cdListSort = 'oldest';  // orden de "Días con gasto": oldest|recent|amountAsc|amountDesc

// `cdDays` siempre queda en orden cronológico ascendente (lo necesita el
// gráfico de barras, alineado a los días reales del mes). Esta función solo
// reordena una COPIA para la lista "Días con gasto".
function sortedCdDays(){
  const arr = cdDays.slice();
  if(cdListSort === 'recent') return arr.reverse();
  if(cdListSort === 'amountAsc') return arr.sort((a,b)=> a.total - b.total);
  if(cdListSort === 'amountDesc') return arr.sort((a,b)=> b.total - a.total);
  return arr; // 'oldest' (por defecto): ya viene ascendente
}

// Dibuja la lista "Días con gasto" (expandible) según cdListSort actual.
function renderCdList(){
  let listHtml = '';
  sortedCdDays().forEach(x=>{
    const dayItems = expenses.filter(e=>{
      if(e.category !== cdCatId) return false;
      const d = new Date(e.date);
      return d.getFullYear()===cdYear && d.getMonth()===cdMonth && d.getDate()===x.day;
    }).sort((a,b)=> new Date(a.date) - new Date(b.date));

    let itemsHtml = '';
    dayItems.forEach(it=>{
      const note = (it.note && it.note.trim()) ? it.note : 'Sin nota';
      itemsHtml +=
        '<div class="cd-li-item" data-eid="' + it.id + '">' +
          '<span class="cd-li-note">' + note + '</span>' +
          '<span class="cd-li-iamt">S/ ' + fmt(it.amount) + '</span>' +
          '<span class="cd-li-edit" data-eid="' + it.id + '" title="Editar">✏️</span>' +
        '</div>';
    });

    listHtml +=
      '<div class="cd-li-wrap">' +
        '<div class="cd-li" role="button" tabindex="0">' +
          '<span class="cd-li-date">' + x.label + '</span>' +
          '<span class="cd-li-r">' +
            '<span class="cd-li-amt">S/ ' + fmt(x.total) + '</span>' +
            '<span class="cd-li-caret">▼</span>' +
          '</span>' +
        '</div>' +
        '<div class="cd-li-detail">' + itemsHtml + '</div>' +
      '</div>';
  });
  if(!listHtml){ listHtml = '<div class="empty">Sin gastos en esta categoría este mes.</div>'; }
  const cdListEl = document.getElementById('cdList');
  cdListEl.innerHTML = listHtml;
  // Expandir/colapsar cada fila de forma independiente (varias abiertas a la vez).
  cdListEl.querySelectorAll('.cd-li-wrap').forEach(wrap=>{
    const head = wrap.querySelector('.cd-li');
    head.addEventListener('click', ()=> wrap.classList.toggle('open'));
    head.addEventListener('keydown', (ev)=>{
      if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); wrap.classList.toggle('open'); }
    });
  });
  // Tocar un gasto individual -> ir a esa transacción en "Movimientos recientes".
  cdListEl.querySelectorAll('.cd-li-item').forEach(item=>{
    item.addEventListener('click', (ev)=>{
      ev.stopPropagation();
      jumpToExpense(item.getAttribute('data-eid'));
    });
  });
  // Lápiz -> editar ese gasto (página completa).
  cdListEl.querySelectorAll('.cd-li-edit').forEach(p=>{
    p.addEventListener('click', (ev)=>{
      ev.stopPropagation();
      openEditExpense(p.getAttribute('data-eid'));
    });
  });
}

// Panel "Productos que salieron" — solo en Canjes/Reposición y solo si este mes
// hubo movimientos de producto. Desde afuera la categoría sigue en S/0 (esto no
// es efectivo); aquí adentro se ven esos productos, con su valor total, marcado
// claramente como que NO cuenta como gasto en efectivo.
function renderCdStockPanel(catId){
  const panel = document.getElementById('cdStockPanel');
  if(!panel) return;
  if(!isCashbackExemptCategory(catId)){
    panel.style.display = 'none';
    panel.innerHTML = '';
    return;
  }
  const items = stockMovementsForCategory(catId);
  if(items.length === 0){
    panel.style.display = 'none';
    panel.innerHTML = '';
    return;
  }
  const total = items.reduce((s,e)=> s + e.amount, 0);
  let rows = '';
  items.forEach(e=>{
    const note = (e.note && e.note.trim()) ? e.note : 'Sin nota';
    const dLabel = cap(new Date(e.date).toLocaleDateString('es-PE', {day:'2-digit', month:'short'}));
    rows +=
      '<div class="cd-stock-item" data-eid="' + e.id + '">' +
        '<span class="cd-stock-note">📦 ' + note + '</span>' +
        '<span class="cd-stock-r">' +
          '<span class="cd-stock-amt">S/ ' + fmt(e.amount) + '</span>' +
          '<span class="cd-stock-date">' + dLabel + '</span>' +
        '</span>' +
      '</div>';
  });
  panel.innerHTML =
    '<div class="cd-stock-head">' +
      '<span class="cd-stock-title">📦 Productos que salieron</span>' +
      '<span class="cd-stock-total">S/ ' + fmt(total) + '</span>' +
    '</div>' +
    '<div class="cd-stock-sub">No cuenta como gasto en efectivo — es el valor de lo que saliste de stock (canjes, reposición, pérdidas).</div>' +
    '<div class="cd-stock-list">' + rows + '</div>';
  panel.style.display = '';
  panel.querySelectorAll('.cd-stock-item').forEach(item=>{
    item.addEventListener('click', ()=> jumpToExpense(item.getAttribute('data-eid')));
  });
}

document.getElementById('cdListSortBtn').addEventListener('click', (e)=>{
  e.stopPropagation();
  document.getElementById('cdListSortMenu').classList.toggle('open');
});
document.querySelectorAll('#cdListSortMenu .fs-opt').forEach(opt=>{
  opt.addEventListener('click', ()=>{
    cdListSort = opt.getAttribute('data-mode');
    document.querySelectorAll('#cdListSortMenu .fs-opt').forEach(o=>{
      o.classList.toggle('active', o === opt);
    });
    document.getElementById('cdListSortMenu').classList.remove('open');
    renderCdList();
  });
});
document.addEventListener('click', (e)=>{
  if(!e.target.closest('#cdListSortWrap')) document.getElementById('cdListSortMenu').classList.remove('open');
});

function openCategoryDetail(catId){
  const cat = catById(catId) || {id:catId, icon:'🗂️', name:'Otros'};
  const {totals, daysInMonth, year, month} = dailyTotalsForCategory(catId);
  const monthTotal = totals.reduce((a,b)=>a+b, 0);
  cdCatId = catId;
  cdYear = year;
  cdMonth = month;
  cdDaysInMonth = daysInMonth;
  // El orden de "Días con gasto" no se persiste: cada vez que se abre una
  // categoría vuelve al orden por defecto (más antiguo primero).
  cdListSort = 'oldest';
  document.querySelectorAll('#cdListSortMenu .fs-opt').forEach(o=>{
    o.classList.toggle('active', o.getAttribute('data-mode') === 'oldest');
  });

  document.getElementById('cdIcon').textContent = cat.icon;
  document.getElementById('cdName').textContent = cat.name;
  document.getElementById('cdTotal').textContent = fmt(monthTotal);
  // Escala el tamaño para montos grandes sin desbordar.
  const cdValWrap = document.querySelector('.cd-total-val');
  if(cdValWrap){
    const sLen = fmt(monthTotal).length;
    cdValWrap.classList.toggle('compact', sLen > 9 && sLen <= 12);
    cdValWrap.classList.toggle('mini', sLen > 12);
  }

  // Comparativo vs mes anterior (solo si hubo gasto el mes pasado en esta categoría).
  document.getElementById('cdCompareToggleBtn').classList.toggle('active', showCatCompare);
  updateCategoryCompare(catId, monthTotal, year, month);

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

  // Lista de días con gasto: cada fila se puede expandir para ver sus gastos.
  renderCdList();

  // Productos que salieron sin gastar efectivo (solo Canjes/Reposición).
  renderCdStockPanel(catId);

  // Color propio de la categoría (o acento del tema si no tiene).
  applyCdAccent(catId);
  renderCdColorSwatches(catId);
  document.getElementById('cdColorPanel').classList.remove('open');

  // Presupuesto de la categoría — POR MES. Ojo: 0 es un presupuesto real ("no
  // gastar nada en esta categoría"), no lo mismo que no tener presupuesto — no usar `|| ''`.
  const catBudget = catBudgetOf(catId, cdYear, cdMonth);
  document.getElementById('cdBudgetInput').value = (catBudget != null) ? catBudget : '';
  const cdBudgetTitle = document.getElementById('cdBudgetTitle');
  if(cdBudgetTitle){
    const mName = cap(new Date(cdYear, cdMonth, 1).toLocaleDateString('es-PE', {month:'long'}));
    cdBudgetTitle.textContent = 'Presupuesto de ' + mName + ' (opcional)';
  }
  document.getElementById('cdFreqNoteInput').value = catFrequentNotes[catId] || '';
  renderBudgetBar(catId, monthTotal);

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
  // Iniciar mostrando la barra del PRIMER día con gasto pegada al borde izquierdo
  // (no el día 1). Se fuerza en varios momentos porque el navegador puede
  // reposicionar el scroll después del primer layout.
  scrollGraphToFirstDay();
  requestAnimationFrame(scrollGraphToFirstDay);
  setTimeout(scrollGraphToFirstDay, 120);
}

// Alinea el gráfico para que la primera barra (día más antiguo con gasto)
// quede cerca del borde izquierdo del contenedor visible.
function scrollGraphToFirstDay(){
  const graph = document.getElementById('cdGraph');
  if(!graph) return;
  const firstCol = document.querySelector('#cdGraphInner .cd-vcol');
  graph.scrollLeft = firstCol ? Math.max(0, firstCol.offsetLeft - 12) : 0;
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

/* ----- Presupuesto mensual por categoría (opcional) ----- */
// Presupuesto por categoría, POR MES: { 'YYYY-MM': { catId: monto } }. Antes era
// plano { catId: monto } (un solo valor para todos los meses); ese formato viejo
// se migra una sola vez al mes actual, igual que se hizo con el presupuesto general.
let categoryBudgets = {};
function loadCategoryBudgets(){
  try{ categoryBudgets = JSON.parse(localStorage.getItem(BUDGET_KEY)) || {}; }
  catch(e){ categoryBudgets = {}; }
  migrateLegacyCategoryBudgets();
}
function saveCategoryBudgets(){
  try{ localStorage.setItem(BUDGET_KEY, JSON.stringify(categoryBudgets)); }catch(e){}
}
// Si el objeto guardado está en el formato viejo (llaves = ids de categoría, no
// 'YYYY-MM'), se mete tal cual bajo el mes actual y se conserva desde ahí por mes.
function migrateLegacyCategoryBudgets(){
  const keys = Object.keys(categoryBudgets);
  if(keys.length === 0) return;
  const isMonthKey = (k)=> /^\d{4}-\d{2}$/.test(k);
  if(keys.every(isMonthKey)) return; // ya está en formato por-mes
  const now = new Date();
  const mk = budgetMonthKey(now.getFullYear(), now.getMonth());
  const legacy = {};
  keys.forEach(k=>{ if(!isMonthKey(k)){ legacy[k] = categoryBudgets[k]; delete categoryBudgets[k]; } });
  categoryBudgets[mk] = Object.assign({}, legacy, categoryBudgets[mk] || {});
  saveCategoryBudgets();
}
// Presupuesto de una categoría en el mes que se está viendo (o null si no tiene).
function catBudgetOf(catId, year, month){
  const bucket = categoryBudgets[budgetMonthKey(year, month)];
  if(!bucket) return null;
  const v = bucket[catId];
  return (v != null) ? v : null;
}
function setCatBudget(catId, year, month, v){
  const mk = budgetMonthKey(year, month);
  if(v == null){
    if(categoryBudgets[mk]) delete categoryBudgets[mk][catId];
  } else {
    if(!categoryBudgets[mk]) categoryBudgets[mk] = {};
    categoryBudgets[mk][catId] = v;
  }
  if(categoryBudgets[mk] && Object.keys(categoryBudgets[mk]).length === 0) delete categoryBudgets[mk];
  saveCategoryBudgets();
}

/* ----- Presupuesto general del mes y por grupo (opcional) -----
   Es POR MES: lo que pongas viendo septiembre solo aplica a septiembre. Cada
   mes guarda su propio valor (general y por grupo) en monthBudgets, bajo una
   llave 'YYYY-MM'. Antes era un solo valor recurrente para todos los meses;
   ese valor legado se migra una sola vez al mes real en que se cargue la app
   (ver migrateLegacyRecurringBudgets). */
let monthBudgets = {}; // { 'YYYY-MM': { general: monto, [groupId]: monto } }

function budgetMonthKey(year, month){
  return year + '-' + String(month + 1).padStart(2, '0');
}
function loadMonthBudgets(){
  try{ monthBudgets = JSON.parse(localStorage.getItem(MONTH_BUDGET_KEY)) || {}; }
  catch(e){ monthBudgets = {}; }
  migrateLegacyRecurringBudgets();
}
function saveMonthBudgets(){
  try{ localStorage.setItem(MONTH_BUDGET_KEY, JSON.stringify(monthBudgets)); }catch(e){}
}
// Migración única: el presupuesto recurrente viejo (un solo valor para todos
// los meses) se traslada al mes real de hoy, y se borran las llaves viejas
// para que esto no se repita en cada carga.
function migrateLegacyRecurringBudgets(){
  const legacyGeneral = parseFloat(localStorage.getItem(GENERAL_BUDGET_KEY));
  let legacyGroups = null;
  try{ legacyGroups = JSON.parse(localStorage.getItem(GROUP_BUDGET_KEY)); }catch(e){ legacyGroups = null; }
  const hasLegacyGroups = legacyGroups && Object.keys(legacyGroups).length > 0;
  if(!(legacyGeneral > 0) && !hasLegacyGroups) return;
  const now = new Date();
  const mk = budgetMonthKey(now.getFullYear(), now.getMonth());
  if(!monthBudgets[mk]) monthBudgets[mk] = {};
  if(legacyGeneral > 0 && monthBudgets[mk].general === undefined) monthBudgets[mk].general = legacyGeneral;
  if(hasLegacyGroups){
    Object.keys(legacyGroups).forEach(gid=>{
      if(legacyGroups[gid] > 0 && monthBudgets[mk][gid] === undefined) monthBudgets[mk][gid] = legacyGroups[gid];
    });
  }
  saveMonthBudgets();
  try{ localStorage.removeItem(GENERAL_BUDGET_KEY); localStorage.removeItem(GROUP_BUDGET_KEY); }catch(e){}
}
// El presupuesto que aplica según la pestaña activa: general (Predeterminado)
// o el del grupo activo.
function currentBudgetContext(){
  if(activeGroup){
    const g = catGroups.find(x=>x.id === activeGroup);
    return {isGroup:true, key:activeGroup, label: g ? g.name : 'grupo'};
  }
  return {isGroup:false, key:null, label:'general'};
}
// Siempre lee/escribe en el mes que se está viendo (viewYear/viewMonth).
function currentBudgetValue(){
  const ctx = currentBudgetContext();
  const bucket = monthBudgets[budgetMonthKey(viewYear, viewMonth)];
  if(!bucket) return null;
  const key = ctx.isGroup ? ctx.key : 'general';
  return (bucket[key] > 0) ? bucket[key] : null;
}
function setCurrentBudgetValue(v){
  const ctx = currentBudgetContext();
  const mk = budgetMonthKey(viewYear, viewMonth);
  const key = ctx.isGroup ? ctx.key : 'general';
  if(!monthBudgets[mk]) monthBudgets[mk] = {};
  if(v > 0) monthBudgets[mk][key] = v;
  else delete monthBudgets[mk][key];
  if(Object.keys(monthBudgets[mk]).length === 0) delete monthBudgets[mk];
  saveMonthBudgets();
}
// Sincroniza el título/valor del panel con el contexto actual (general o grupo)
// y el mes que se está viendo, para que quede claro que el presupuesto es solo
// para ESE mes.
function renderMtBudgetPanel(){
  const ctx = currentBudgetContext();
  const title = document.getElementById('mtBudgetTitle');
  const input = document.getElementById('mtBudgetInput');
  const monthName = cap(new Date(viewYear, viewMonth, 1).toLocaleDateString('es-PE', {month:'long'}));
  const base = ctx.isGroup ? ('Presupuesto de "' + ctx.label + '"') : 'Presupuesto general';
  if(title) title.textContent = base + ' de ' + monthName + ' (opcional)';
  if(input) input.value = currentBudgetValue() || '';
}
// Barra de progreso gastado/límite para el contexto actual (reusa el estilo de
// la barra de presupuesto por categoría). Se puede tocar para alternar entre
// "gastado de límite" y "cuánto queda en efectivo" — vuelve a la vista normal
// si cambias de mes o de grupo, para no dejarlo en un estado raro sin querer.
let mtBudgetShowRemaining = false;
let lastMtBudgetCtxKey = undefined;
function renderMtBudgetBar(spent){
  const bar = document.getElementById('mtBudgetBar');
  if(!bar) return;
  const ctx = currentBudgetContext();
  const ctxKey = (ctx.isGroup ? ctx.key : 'general') + '|' + viewYear + '-' + viewMonth;
  if(ctxKey !== lastMtBudgetCtxKey){
    lastMtBudgetCtxKey = ctxKey;
    mtBudgetShowRemaining = false;
  }
  const limit = currentBudgetValue();
  if(!(limit > 0)){
    bar.classList.remove('show');
    bar.innerHTML = '';
    bar.onclick = null;
    return;
  }
  const pct = spent / limit * 100;
  const clamped = Math.min(pct, 100);
  let state = '';
  if(pct >= 100) state = 'over';
  else if(pct >= 80) state = 'warn';
  bar.className = 'cd-budget-bar show clickable ' + state;
  if(mtBudgetShowRemaining){
    const remaining = limit - spent;
    const labelHtml = remaining >= 0
      ? '<span class="bb-remaining">💵 Puedes gastar S/ ' + fmt(remaining) + ' más este mes</span>'
      : '<span class="bb-remaining">⚠️ Te pasaste por S/ ' + fmt(Math.abs(remaining)) + '</span>';
    bar.innerHTML =
      '<div class="bb-label">' + labelHtml + '</div>' +
      '<div class="bb-track"><div class="bb-fill" style="width:' + clamped + '%"></div></div>';
  } else {
    const statusTxt = pct >= 100
      ? 'Superado (' + Math.round(pct) + '%)'
      : Math.round(pct) + '%';
    bar.innerHTML =
      '<div class="bb-label"><span>Presupuesto: S/ ' + fmt(spent) + ' de S/ ' + fmt(limit) + '</span>' +
      '<span class="bb-status">' + statusTxt + '</span></div>' +
      '<div class="bb-track"><div class="bb-fill" style="width:' + clamped + '%"></div></div>';
  }
  bar.onclick = ()=>{ mtBudgetShowRemaining = !mtBudgetShowRemaining; renderMtBudgetBar(spent); };
}
document.getElementById('mtBudgetBtn').addEventListener('click', ()=>{
  document.getElementById('mtBudgetPanel').classList.toggle('open');
});
document.getElementById('mtBudgetSave').addEventListener('click', ()=>{
  const v = parseFloat(document.getElementById('mtBudgetInput').value);
  setCurrentBudgetValue(v > 0 ? v : null);
  document.getElementById('mtBudgetPanel').classList.remove('open');
  renderMonthTotal();
});
document.getElementById('mtBudgetClear').addEventListener('click', ()=>{
  setCurrentBudgetValue(null);
  document.getElementById('mtBudgetInput').value = '';
  renderMonthTotal();
});

/* ----- Límite por rango de fechas (opcional) -----
   A diferencia del presupuesto general/por categoría (siempre mes calendario),
   este es un LÍMITE PUNTUAL entre dos fechas cualquiera, aunque crucen de un
   mes a otro (ej. ciclo de tarjeta: 25 de un mes al 12 del siguiente). Solo
   uno activo a la vez; se reemplaza/borra cuando ya no aplica. Cuenta el gasto
   real (sin productos), sin importar el grupo activo. Además, el usuario puede
   EXCLUIR gastos puntuales del rango (ej. comida, un gasto fijo) para que no
   sumen a este límite: sus ids se guardan en `excluded`. */
let rangeGoal = null; // {from:'YYYY-MM-DD', to:'YYYY-MM-DD', amount:Number, excluded:[ids]} | null
let rgDraftExcluded = new Set(); // borrador de ids excluidos mientras se edita la página
function loadRangeGoal(){
  try{ rangeGoal = JSON.parse(localStorage.getItem(RANGE_GOAL_KEY)) || null; }
  catch(e){ rangeGoal = null; }
  if(rangeGoal && !Array.isArray(rangeGoal.excluded)) rangeGoal.excluded = [];
}
function saveRangeGoal(){
  try{
    if(rangeGoal) localStorage.setItem(RANGE_GOAL_KEY, JSON.stringify(rangeGoal));
    else localStorage.removeItem(RANGE_GOAL_KEY);
  }catch(e){}
}
// Gastos reales (sin productos) dentro de una ventana de fechas, del más nuevo
// al más viejo. Sirve tanto para el cálculo del total como para la lista editable.
function rangeExpensesInWindow(fromStr, toStr){
  if(!fromStr || !toStr) return [];
  const from = new Date(fromStr + 'T00:00:00');
  const to = new Date(toStr + 'T23:59:59');
  return expenses
    .filter(e=>{ const d = new Date(e.date); return d >= from && d <= to && !isStockMovement(e); })
    .sort((a,b)=> new Date(b.date) - new Date(a.date));
}
function rangeGoalSpent(){
  if(!rangeGoal) return 0;
  const excluded = rangeGoal.excluded || [];
  return rangeExpensesInWindow(rangeGoal.from, rangeGoal.to)
    .filter(e=> excluded.indexOf(e.id) === -1)
    .reduce((s,e)=> s + e.amount, 0);
}
function renderRangeGoal(){
  const tease = document.getElementById('rangeGoalTease');
  const bar = document.getElementById('rangeGoalBar');
  const mtBar = document.getElementById('mtRangeGoalBar');
  if(!tease) return;
  document.getElementById('rgFrom').value = rangeGoal ? rangeGoal.from : '';
  document.getElementById('rgTo').value = rangeGoal ? rangeGoal.to : '';
  document.getElementById('rgAmount').value = rangeGoal ? rangeGoal.amount : '';
  renderRgExpList();
  if(!rangeGoal){
    tease.textContent = 'Pon un límite de gasto para un rango puntual (ej. tu ciclo de tarjeta, aunque cruce de un mes a otro)';
    if(bar){ bar.className = 'cd-budget-bar'; bar.innerHTML = ''; }
    if(mtBar){
      mtBar.style.display = 'block';
      mtBar.className = 'cd-budget-bar mt-range-bar show';
      mtBar.innerHTML = '<div class="bb-label"><span>📅 Límite por rango de fechas</span>' +
        '<span class="bb-status">✎ Configurar</span></div>';
    }
    return;
  }
  const spent = rangeGoalSpent();
  const fromLbl = new Date(rangeGoal.from + 'T12:00:00').toLocaleDateString('es-PE', {day:'2-digit', month:'short'});
  const toLbl = new Date(rangeGoal.to + 'T12:00:00').toLocaleDateString('es-PE', {day:'2-digit', month:'short'});
  tease.textContent = 'Del ' + fromLbl + ' al ' + toLbl + ': S/ ' + fmt(spent) + ' de S/ ' + fmt(rangeGoal.amount);
  if(bar){
    const pct = Math.min(spent / rangeGoal.amount * 100, 100);
    const over = spent > rangeGoal.amount;
    let state = ''; if(over) state = 'over'; else if(pct >= 80) state = 'warn';
    const statusTxt = over ? 'Superado (S/ ' + fmt(spent - rangeGoal.amount) + ' de más)' : Math.round(pct) + '%';
    bar.className = 'cd-budget-bar show ' + state;
    bar.innerHTML =
      '<div class="bb-label"><span>S/ ' + fmt(spent) + ' de S/ ' + fmt(rangeGoal.amount) + '</span>' +
      '<span class="bb-status">' + statusTxt + '</span></div>' +
      '<div class="bb-track"><div class="bb-fill" style="width:' + pct + '%"></div></div>';
  }
  // Espejo bajo el total del mes: no depende del mes que se esté viendo (viewYear/
  // viewMonth), siempre muestra el MISMO límite de rango sin importar a qué mes navegue.
  if(mtBar){
    const pct = Math.min(spent / rangeGoal.amount * 100, 100);
    const over = spent > rangeGoal.amount;
    let state = ''; if(over) state = 'over'; else if(pct >= 80) state = 'warn';
    const statusTxt = over ? 'Superado (S/ ' + fmt(spent - rangeGoal.amount) + ' de más)' : Math.round(pct) + '%';
    mtBar.style.display = 'block';
    mtBar.className = 'cd-budget-bar mt-range-bar show ' + state;
    mtBar.innerHTML =
      '<div class="bb-label"><span>📅 ' + fromLbl + '–' + toLbl + ': S/ ' + fmt(spent) + ' de S/ ' + fmt(rangeGoal.amount) + '</span>' +
      '<span class="bb-status">✎ ' + statusTxt + '</span></div>' +
      '<div class="bb-track"><div class="bb-fill" style="width:' + pct + '%"></div></div>';
  }
}
// Lista editable de gastos dentro del rango que se está configurando (lee las
// fechas de los inputs, no del rangeGoal guardado, para que se actualice en vivo
// al cambiar fechas). Cada gasto tiene un check: marcado = cuenta al límite,
// desmarcado = excluido. Muestra abajo el subtotal de lo que sí cuenta.
function renderRgExpList(){
  const block = document.getElementById('rgExpBlock');
  const listEl = document.getElementById('rgExpList');
  if(!block || !listEl) return;
  const from = document.getElementById('rgFrom').value;
  const to = document.getElementById('rgTo').value;
  const valid = from && to && new Date(from + 'T00:00:00') <= new Date(to + 'T00:00:00');
  if(!valid){ block.style.display = 'none'; listEl.innerHTML = ''; return; }
  const list = rangeExpensesInWindow(from, to);
  block.style.display = 'block';
  if(list.length === 0){
    listEl.innerHTML = '<div class="rg-exp-empty">No hay gastos en este rango todavía.</div>';
    return;
  }
  // Lógica invertida a propósito: MARCAR una fila la EXCLUYE (no cuenta). Como
  // casi todo suele contar, es menos trabajo marcar solo lo poco que no debe sumar.
  let included = 0;
  const rows = list.map(e=>{
    const excluded = rgDraftExcluded.has(e.id);
    if(!excluded) included += e.amount;
    const cat = catById(e.category) || {icon:'🗂️', name:'Otros'};
    const dateStr = new Date(e.date).toLocaleDateString('es-PE', {day:'2-digit', month:'short'});
    return '<label class="rg-exp-item' + (excluded ? ' off' : '') + '">' +
      '<input type="checkbox" class="rg-exp-check" data-id="' + e.id + '"' + (excluded ? ' checked' : '') + '>' +
      '<span class="rg-exp-icon">' + cat.icon + '</span>' +
      '<span class="rg-exp-info"><span class="rg-exp-cat">' + cat.name + '</span>' +
      (e.note ? '<span class="rg-exp-note">' + e.note + '</span>' : '') + '</span>' +
      '<span class="rg-exp-right"><span class="rg-exp-amt">S/ ' + fmt(e.amount) + '</span>' +
      '<span class="rg-exp-date">' + dateStr + '</span></span></label>';
  }).join('');
  const excludedCount = list.filter(e=> rgDraftExcluded.has(e.id)).length;
  const subtotal = '<div class="rg-exp-subtotal">Cuentan: <b>S/ ' + fmt(included) + '</b>' +
    (excludedCount > 0 ? ' <span class="rg-exp-excnt">(' + excludedCount + ' marcados fuera)</span>' : '') + '</div>';
  listEl.innerHTML = rows + subtotal;
  listEl.querySelectorAll('.rg-exp-check').forEach(chk=>{
    chk.addEventListener('change', ()=>{
      const id = chk.getAttribute('data-id');
      if(chk.checked) rgDraftExcluded.add(id); else rgDraftExcluded.delete(id);
      renderRgExpList();
    });
  });
}
function openRangeGoalPage(){
  const page = document.getElementById('rangeGoalPage');
  // El borrador de excluidos arranca desde lo que ya estaba guardado.
  rgDraftExcluded = new Set(rangeGoal && rangeGoal.excluded ? rangeGoal.excluded : []);
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cd-open');
  page.scrollTop = 0;
  renderRangeGoal();
}
function closeRangeGoalPage(){
  const page = document.getElementById('rangeGoalPage');
  page.classList.remove('open');
  page.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cd-open');
}
document.getElementById('mtRangeGoalBar').addEventListener('click', openRangeGoalPage);
document.getElementById('rgBack').addEventListener('click', closeRangeGoalPage);
// Al cambiar las fechas, refresca la lista de gastos del rango en vivo.
document.getElementById('rgFrom').addEventListener('change', renderRgExpList);
document.getElementById('rgTo').addEventListener('change', renderRgExpList);
document.getElementById('rgSave').addEventListener('click', ()=>{
  const from = document.getElementById('rgFrom').value;
  const to = document.getElementById('rgTo').value;
  const amount = parseFloat(document.getElementById('rgAmount').value);
  if(!from || !to || !(amount > 0)){ alert('Completa fecha inicio, fecha fin y un monto válido.'); return; }
  if(new Date(from + 'T00:00:00') > new Date(to + 'T00:00:00')){ alert('La fecha de inicio debe ser antes que la fecha final.'); return; }
  // Solo guardamos como excluidos los ids que de verdad caen en la ventana final.
  const idsInWindow = rangeExpensesInWindow(from, to).map(e=>e.id);
  const excluded = idsInWindow.filter(id=> rgDraftExcluded.has(id));
  rangeGoal = {from: from, to: to, amount: amount, excluded: excluded};
  rgDraftExcluded = new Set(excluded);
  saveRangeGoal();
  renderRangeGoal();
});
document.getElementById('rgClear').addEventListener('click', ()=>{
  rangeGoal = null;
  rgDraftExcluded = new Set();
  saveRangeGoal();
  renderRangeGoal();
});

// Compartido por el botón 📊 del header y el de dentro de cada categoría.
function toggleShowCatCompare(){
  showCatCompare = !showCatCompare;
  saveShowCatCompare();
  document.getElementById('mtCompareToggleBtn').classList.toggle('active', showCatCompare);
  document.getElementById('cdCompareToggleBtn').classList.toggle('active', showCatCompare);
  renderMtCompare();
  renderBreakdown();
  // Si hay una categoría abierta, refresca su comparativo también.
  if(cdCatId){
    const monthTotal = parseFloat(document.getElementById('cdTotal').textContent) || 0;
    updateCategoryCompare(cdCatId, monthTotal, cdYear, cdMonth);
  }
}

document.getElementById('mtCompareToggleBtn').addEventListener('click', toggleShowCatCompare);
document.getElementById('cdCompareToggleBtn').addEventListener('click', toggleShowCatCompare);

// Dibuja la barra de progreso gastado/límite (o la oculta si no hay presupuesto
// configurado). Un límite de 0 SÍ es un presupuesto real ("no gastar nada en
// esta categoría"): se distingue de "sin presupuesto" (undefined), y se dibuja
// sin dividir entre cero.
function renderBudgetBar(catId, spent){
  const bar = document.getElementById('cdBudgetBar');
  if(!bar) return;
  const limit = catBudgetOf(catId, cdYear, cdMonth);
  if(limit == null){
    bar.classList.remove('show');
    bar.innerHTML = '';
    return;
  }
  const over = spent > limit;
  const pct = limit > 0 ? Math.min(spent / limit * 100, 100) : (spent > 0 ? 100 : 0);
  let state = '';
  if(over) state = 'over';
  else if(limit > 0 && pct >= 80) state = 'warn';
  const statusTxt = over
    ? 'Superado (S/ ' + fmt(spent - limit) + ' de más)'
    : Math.round(pct) + '%';
  bar.className = 'cd-budget-bar show ' + state;
  bar.innerHTML =
    '<div class="bb-label"><span>Presupuesto: S/ ' + fmt(spent) + ' de S/ ' + fmt(limit) + '</span>' +
    '<span class="bb-status">' + statusTxt + '</span></div>' +
    '<div class="bb-track"><div class="bb-fill" style="width:' + pct + '%"></div></div>';
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
  // El engranaje de ajustes de la categoría se pinta con su color.
  const gear = document.getElementById('cdGearIcon');
  if(gear) gear.style.color = hex;
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

// Guardar / quitar presupuesto de la categoría abierta.
function currentCdMonthTotal(){
  const {totals} = dailyTotalsForCategory(cdCatId);
  return totals.reduce((a,b)=>a+b, 0);
}
document.getElementById('cdBudgetSave').addEventListener('click', ()=>{
  if(!cdCatId) return;
  const raw = document.getElementById('cdBudgetInput').value;
  // Campo vacío = sin presupuesto (usa "Quitar" para eso). Un número válido
  // ≥ 0 se guarda tal cual: poner 0 es un tope real de "no gastar nada".
  // Se guarda SOLO para el mes que se está viendo (cdYear/cdMonth).
  if(raw.trim() === ''){ setCatBudget(cdCatId, cdYear, cdMonth, null); }
  else {
    const v = parseFloat(raw);
    if(!isNaN(v) && v >= 0) setCatBudget(cdCatId, cdYear, cdMonth, v);
  }
  renderBudgetBar(cdCatId, currentCdMonthTotal());
  document.getElementById('cdColorPanel').classList.remove('open');
});
document.getElementById('cdBudgetClear').addEventListener('click', ()=>{
  if(!cdCatId) return;
  setCatBudget(cdCatId, cdYear, cdMonth, null);
  document.getElementById('cdBudgetInput').value = '';
  renderBudgetBar(cdCatId, currentCdMonthTotal());
});

// Guardar / quitar la nota frecuente desde el panel de ajustes de la categoría
// (misma nota que se configura en "editar categoría" — quedan sincronizadas).
document.getElementById('cdFreqNoteSave').addEventListener('click', ()=>{
  if(!cdCatId) return;
  const note = document.getElementById('cdFreqNoteInput').value.trim();
  if(note) catFrequentNotes[cdCatId] = note; else delete catFrequentNotes[cdCatId];
  saveFrequentNotes();
  document.getElementById('cdColorPanel').classList.remove('open');
});
document.getElementById('cdFreqNoteClear').addEventListener('click', ()=>{
  if(!cdCatId) return;
  delete catFrequentNotes[cdCatId];
  saveFrequentNotes();
  document.getElementById('cdFreqNoteInput').value = '';
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
    if(!isStockMovement(e)) totals[k] = (totals[k]||0) + e.amount;
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    if(first < earliest) earliest = first;
  });

  const series = [];
  const cur = new Date(earliest);
  const selectedKey = monthKey(new Date(viewYear, viewMonth, 1)); // mes que se está viendo (resaltado)
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
      year: cur.getFullYear(),
      month: cur.getMonth(),
      total: totals[k] || 0,
      current: k === selectedKey
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
    return '<div class="mbar' + (s.current ? ' current' : '') + '" data-year="' + s.year + '" data-month="' + s.month + '">' +
             '<div class="col" style="height:' + h + '%">' + valLabel + '</div>' +
             '<div class="mlbl">' + s.label + '</div>' +
           '</div>';
  }).join('');

  // Lista (más reciente primero)
  listBox.innerHTML = [...series].reverse().map(s=>{
    return '<div class="ml-row' + (s.current ? ' current' : '') + '" data-year="' + s.year + '" data-month="' + s.month + '">' +
             '<span class="ml-name">' + s.full + '</span>' +
             '<span class="ml-amt">S/ ' + fmt(s.total) + '</span>' +
           '</div>';
  }).join('');

  // Tocar una barra o una fila de la lista -> ver ese mes en la pantalla principal.
  const selectMonth = (y, m)=>{
    viewYear = y;
    viewMonth = m;
    renderAll();
  };
  barsBox.querySelectorAll('.mbar').forEach(el=>{
    el.addEventListener('click', ()=> selectMonth(parseInt(el.getAttribute('data-year'), 10), parseInt(el.getAttribute('data-month'), 10)));
  });
  listBox.querySelectorAll('.ml-row').forEach(el=>{
    el.addEventListener('click', ()=> selectMonth(parseInt(el.getAttribute('data-year'), 10), parseInt(el.getAttribute('data-month'), 10)));
  });
}

// Modo de orden de "Movimientos recientes": 'default' (cronológico) o 'category'.
// Siempre inicia en 'default' al abrir la app (no se persiste).
let feedSortMode = 'default';
let feedGroupFilter = null; // filtro secundario del feed en Predeterminado (null = Todos)
const feedOpenGroups = new Set(); // grupos expandidos en el modo por categoría
const feedClosedDayGroups = new Set(); // días CERRADOS en el modo "Por día" (por defecto todos abiertos)
let feedSearch = {text:'', min:null, max:null, from:'', to:''}; // filtros del buscador

// Fila de chips "Ver: Todos / Timeless / Personal" para segmentar SOLO el feed
// cuando estás en Predeterminado (sin grupo activo). Cuando ya hay un grupo
// activo en las pestañas de arriba, el feed ya viene filtrado por ese grupo, así
// que esta fila se oculta (sería redundante).
function renderFeedGroupFilter(){
  const row = document.getElementById('feedGroupFilter');
  const box = document.getElementById('feedGroupFilterOpts');
  if(!row || !box) return;
  if(activeGroup || catGroups.length === 0){ row.style.display = 'none'; return; }
  row.style.display = '';
  let html = '<div class="gt-opt' + (!feedGroupFilter ? ' selected' : '') + '" data-g="">Todos</div>';
  catGroups.forEach(g=>{
    html += '<div class="gt-opt' + (feedGroupFilter === g.id ? ' selected' : '') + '" data-g="' + g.id + '">' + g.name + '</div>';
  });
  box.innerHTML = html;
  box.querySelectorAll('.gt-opt').forEach(el=>{
    el.onclick = ()=>{
      feedGroupFilter = el.getAttribute('data-g') || null;
      renderFeedGroupFilter();
      renderFeed();
    };
  });
}

// Markup de una transacción del feed (compartido por ambos modos).
function txHtml(e){
  const cat = catById(e.category) || {icon:'🗂️', name:'Otros'};
  const d = new Date(e.date);
  const dateStr = d.toLocaleDateString('es-PE', {day:'2-digit', month:'short'});
  const stockTag = isStockMovement(e) ? '<span class="tx-stock-tag">📦 no cuenta</span>' : '';
  return '<div class="tx" data-id="' + e.id + '"><div class="icon">' + cat.icon + '</div><div class="info"><div class="cat-name">' + cat.name + stockTag + '</div>' + (e.note ? '<div class="note">' + e.note + '</div>' : '') + '</div><div class="right"><div class="amt">S/ ' + fmt(e.amount) + '</div><div class="date">' + dateStr + '</div></div><div class="edit" data-id="' + e.id + '" title="Editar">✏️</div><div class="del" data-id="' + e.id + '" title="Borrar">✕</div></div>';
}

// Filtra el feed según el buscador (nota/categoría, rango de monto, rango de fechas).
function filterFeedExpenses(list){
  const f = feedSearch;
  const text = (f.text || '').trim().toLowerCase();
  return list.filter(e=>{
    if(text){
      const note = (e.note || '').toLowerCase();
      const catName = ((catById(e.category) || {name:''}).name || '').toLowerCase();
      if(note.indexOf(text) === -1 && catName.indexOf(text) === -1) return false;
    }
    if(f.min != null && e.amount < f.min) return false;
    if(f.max != null && e.amount > f.max) return false;
    if(f.from && new Date(e.date) < new Date(f.from + 'T00:00:00')) return false;
    if(f.to && new Date(e.date) > new Date(f.to + 'T23:59:59')) return false;
    return true;
  });
}

function renderFeed(){
  const feed = document.getElementById('feed');
  renderFeedGroupFilter();

  if(expenses.length === 0){
    feed.innerHTML = '<div class="empty">Agrega tu primer gasto arriba 👆</div>';
    return;
  }

  // Movimientos recientes muestra solo el mes que se está viendo (igual que el
  // total y el donut) y respeta el grupo: la pestaña activa manda; si estás en
  // Predeterminado, el chip secundario "Ver:" segmenta solo el feed.
  const effGroup = activeGroup || feedGroupFilter;
  const monthExpenses = filterByGroupId(currentMonthExpenses(), effGroup);
  if(monthExpenses.length === 0){
    const gName = effGroup ? ((catGroups.find(x=>x.id===effGroup)||{}).name) : null;
    feed.innerHTML = '<div class="empty">' + (gName ? 'No tienes movimientos de ' + gName + ' en este mes.' : 'No tienes movimientos en este mes.') + '</div>';
    return;
  }

  const base = filterFeedExpenses(monthExpenses);
  if(base.length === 0){
    feed.innerHTML = '<div class="empty">Ningún movimiento coincide con la búsqueda.</div>';
    return;
  }

  if(feedSortMode === 'category'){
    // Agrupar por categoría (TODOS los gastos filtrados, sin límite), expandibles.
    const sorted = [...base].sort((a,b)=> new Date(b.date) - new Date(a.date));
    const groups = {};
    sorted.forEach(e=>{ (groups[e.category] = groups[e.category] || []).push(e); });
    const orderedIds = allCategories().map(c=>c.id).filter(id=>groups[id]);
    Object.keys(groups).forEach(id=>{ if(orderedIds.indexOf(id) === -1) orderedIds.push(id); });

    feed.innerHTML = orderedIds.map(id=>{
      const cat = catById(id) || {icon:'🗂️', name:'Otros'};
      const items = groups[id];
      const total = items.reduce((s,e)=> s + (isStockMovement(e) ? 0 : e.amount), 0);
      const open = feedOpenGroups.has(id);
      return '<div class="feed-group' + (open ? ' open' : '') + '" data-cat="' + id + '">' +
               '<div class="fg-head">' +
                 '<span class="fg-icon">' + cat.icon + '</span>' +
                 '<span class="fg-name">' + cat.name + ' <span class="fg-count">(' + items.length + ')</span></span>' +
                 '<span class="fg-right"><span class="fg-amt">S/ ' + fmt(total) + '</span><span class="fg-caret">▼</span></span>' +
               '</div>' +
               '<div class="fg-body">' + items.map(txHtml).join('') + '</div>' +
             '</div>';
    }).join('');

    feed.querySelectorAll('.feed-group').forEach(group=>{
      group.querySelector('.fg-head').addEventListener('click', ()=>{
        const id = group.getAttribute('data-cat');
        group.classList.toggle('open');
        if(group.classList.contains('open')) feedOpenGroups.add(id);
        else feedOpenGroups.delete(id);
      });
    });
  } else if(feedSortMode === 'day'){
    // Agrupar TODOS los gastos filtrados (todas las categorías juntas) por día,
    // día más reciente primero, con el total de cada día — para ver de un vistazo
    // cuánto se gastó en un día puntual, sin importar la categoría.
    const sorted = [...base].sort((a,b)=> new Date(b.date) - new Date(a.date));
    const groups = {};
    const order = [];
    sorted.forEach(e=>{
      const d = new Date(e.date);
      const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      if(!groups[key]){ groups[key] = []; order.push(key); }
      groups[key].push(e);
    });

    feed.innerHTML = order.map(key=>{
      const items = groups[key];
      const total = items.reduce((s,e)=> s + (isStockMovement(e) ? 0 : e.amount), 0);
      const d = new Date(key + 'T12:00:00');
      const label = d.toLocaleDateString('es-PE', {weekday:'long', day:'2-digit', month:'long'});
      const open = !feedClosedDayGroups.has(key);
      return '<div class="feed-group' + (open ? ' open' : '') + '" data-day="' + key + '">' +
               '<div class="fg-head">' +
                 '<span class="fg-icon">📅</span>' +
                 '<span class="fg-name">' + cap(label) + ' <span class="fg-count">(' + items.length + ')</span></span>' +
                 '<span class="fg-right"><span class="fg-amt">S/ ' + fmt(total) + '</span><span class="fg-caret">▼</span></span>' +
               '</div>' +
               '<div class="fg-body">' + items.map(txHtml).join('') + '</div>' +
             '</div>';
    }).join('');

    feed.querySelectorAll('.feed-group').forEach(group=>{
      group.querySelector('.fg-head').addEventListener('click', ()=>{
        const key = group.getAttribute('data-day');
        group.classList.toggle('open');
        if(group.classList.contains('open')) feedClosedDayGroups.delete(key);
        else feedClosedDayGroups.add(key);
      });
    });
  } else {
    // Predeterminado: por fecha (más reciente arriba). "Más antiguo": fecha ascendente.
    const ordered = [...base].sort((a,b)=> new Date(b.date) - new Date(a.date));
    if(feedSortMode === 'oldest') ordered.reverse();
    feed.innerHTML = ordered.map(txHtml).join('');
  }

  // Borrado (misma lógica en ambos modos).
  feed.querySelectorAll('.del').forEach(btn=>{
    btn.onclick = (ev)=>{
      ev.stopPropagation();
      const id = btn.getAttribute('data-id');
      if(!window.confirm('¿Seguro que quieres borrar este gasto?')) return;
      expenses = expenses.filter(e=>e.id !== id);
      saveExpenses();
      renderAll();
    };
  });
  // Editar (misma lógica en ambos modos).
  feed.querySelectorAll('.edit').forEach(btn=>{
    btn.onclick = (ev)=>{
      ev.stopPropagation();
      openEditExpense(btn.getAttribute('data-id'));
    };
  });
}

function setFeedSortMode(mode){
  feedSortMode = mode;
  document.querySelectorAll('#feedSortMenu .fs-opt').forEach(o=>{
    o.classList.toggle('active', o.getAttribute('data-mode') === mode);
  });
  renderFeed();
}

document.getElementById('feedSortBtn').addEventListener('click', (e)=>{
  e.stopPropagation();
  document.getElementById('feedSortMenu').classList.toggle('open');
});
document.querySelectorAll('#feedSortMenu .fs-opt').forEach(opt=>{
  opt.addEventListener('click', ()=>{
    setFeedSortMode(opt.getAttribute('data-mode'));
    document.getElementById('feedSortMenu').classList.remove('open');
  });
});
document.addEventListener('click', (e)=>{
  if(!e.target.closest('.feed-sort')) document.getElementById('feedSortMenu').classList.remove('open');
});

// Buscador y filtros de Movimientos.
document.getElementById('feedSearchText').addEventListener('input', (e)=>{ feedSearch.text = e.target.value; renderFeed(); });
document.getElementById('ffMin').addEventListener('input', (e)=>{ feedSearch.min = e.target.value !== '' ? parseFloat(e.target.value) : null; renderFeed(); });
document.getElementById('ffMax').addEventListener('input', (e)=>{ feedSearch.max = e.target.value !== '' ? parseFloat(e.target.value) : null; renderFeed(); });
document.getElementById('ffFrom').addEventListener('input', (e)=>{ feedSearch.from = e.target.value; renderFeed(); });
document.getElementById('ffTo').addEventListener('input', (e)=>{ feedSearch.to = e.target.value; renderFeed(); });
document.getElementById('feedFilterToggle').addEventListener('click', ()=>{
  const open = document.getElementById('feedFilters').classList.toggle('open');
  document.getElementById('feedFilterToggle').classList.toggle('active', open);
});
document.getElementById('ffClear').addEventListener('click', ()=>{
  feedSearch = {text:'', min:null, max:null, from:'', to:''};
  document.getElementById('feedSearchText').value = '';
  ['ffMin','ffMax','ffFrom','ffTo'].forEach(id=>{ document.getElementById(id).value = ''; });
  renderFeed();
});

// Salta desde un gasto individual (detalle de categoría) hasta esa
// transacción en "Movimientos recientes", con highlight temporal.
function jumpToExpense(id){
  closeCategoryDetail();
  if(feedSortMode !== 'default') setFeedSortMode('default');
  setTimeout(()=>{
    const tx = document.querySelector('#feed .tx[data-id="' + id + '"]');
    const target = tx || document.getElementById('feed');
    target.scrollIntoView({behavior:'smooth', block:'center'});
    if(tx){
      tx.classList.remove('highlight');
      void tx.offsetWidth; // reinicia la animación si se repite
      tx.classList.add('highlight');
      setTimeout(()=>{ tx.classList.remove('highlight'); }, 3100);
    }
  }, 80);
}

/* ---------- Editar un gasto existente (página completa) ---------- */
let editingId = null;
let editSelectedCat = null;
let editSelectedGroups = [];
let editSelectedStockOnly = null; // 'product' | 'other'
let lastEditNoteHintCat = undefined;

function updateEditCatNoteHint(){
  const hint = document.getElementById('editCatNoteHint');
  if(!hint) return;
  const isStockCat = editSelectedCat ? isCashbackExemptCategory(editSelectedCat) : false;
  hint.style.display = isStockCat ? '' : 'none';
  if(editSelectedCat !== lastEditNoteHintCat){
    lastEditNoteHintCat = editSelectedCat;
    editSelectedStockOnly = isStockCat ? 'product' : null;
  }
  renderStockOnlyOpts('editStockOnlyOpts', editSelectedStockOnly);
}
document.querySelectorAll('#editStockOnlyOpts .gt-opt').forEach(el=>{
  el.addEventListener('click', (ev)=>{
    ev.stopPropagation();
    editSelectedStockOnly = el.getAttribute('data-v');
    renderStockOnlyOpts('editStockOnlyOpts', editSelectedStockOnly);
  });
});
function renderEditGroupTag(){
  renderGroupTagOpts('editGroupTagOpts', 'editGroupTagRow', editSelectedGroups, (g)=>{
    if(!g){ editSelectedGroups = []; }
    else{
      const i = editSelectedGroups.indexOf(g);
      if(i === -1) editSelectedGroups.push(g); else editSelectedGroups.splice(i,1);
    }
    renderEditGroupTag();
  });
}

function renderEditCats(){
  const grid = document.getElementById('editCatGrid');
  grid.innerHTML = '';
  allCategories().forEach(cat=>{
    const btn = document.createElement('div');
    btn.className = 'cat-btn' + (editSelectedCat === cat.id ? ' selected' : '');
    btn.innerHTML = '<span class="icon">' + cat.icon + '</span>' + cat.name;
    btn.onclick = ()=>{ editSelectedCat = cat.id; renderEditCats(); updateEditCatNoteHint(); validateEditForm(); };
    grid.appendChild(btn);
  });
}

function validateEditForm(){
  const amount = parseFloat(document.getElementById('editAmount').value);
  document.getElementById('editSaveBtn').disabled = !(amount > 0 && editSelectedCat);
}

function openEditExpense(id){
  const e = expenses.find(x=>x.id === id);
  if(!e) return;
  editingId = id;
  editSelectedCat = e.category;
  document.getElementById('editAmount').value = e.amount;
  document.getElementById('editNote').value = e.note || '';
  const d = new Date(e.date);
  const localISO = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,10);
  const di = document.getElementById('editDate');
  di.value = localISO;
  di.max = new Date().toISOString().slice(0,10);
  editSelectedGroups = expenseGroupIds(e);
  editSelectedStockOnly = isStockMovement(e) ? 'product' : 'other';
  lastEditNoteHintCat = editSelectedCat; // evita que updateEditCatNoteHint pise el valor real con el default
  renderEditCats();
  renderEditGroupTag();
  updateEditCatNoteHint();
  validateEditForm();
  const page = document.getElementById('editPage');
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cd-open');
  page.scrollTop = 0;
}

function closeEditExpense(){
  const page = document.getElementById('editPage');
  page.classList.remove('open');
  page.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cd-open');
  editingId = null;
}

function saveEditExpense(){
  const amount = parseFloat(document.getElementById('editAmount').value);
  if(!(amount > 0) || !editSelectedCat) return;
  const e = expenses.find(x=>x.id === editingId);
  if(!e){ closeEditExpense(); return; }
  e.amount = amount;
  e.note = document.getElementById('editNote').value.trim();
  e.category = editSelectedCat;
  delete e.group; // formato viejo (un solo grupo), reemplazado por `groups`
  if(editSelectedGroups.length) e.groups = editSelectedGroups.slice(); else delete e.groups;
  if(isCashbackExemptCategory(editSelectedCat)) e.stockOnly = (editSelectedStockOnly === 'product'); else delete e.stockOnly;
  const dv = document.getElementById('editDate').value;
  if(dv){ const dd = new Date(dv + 'T12:00:00'); if(!isNaN(dd.getTime())) e.date = dd.toISOString(); }
  saveExpenses();
  // Si el detalle de categoría quedó abierto detrás, refrescarlo con los datos nuevos.
  const catPageOpen = document.getElementById('catDetailPage').classList.contains('open');
  const openCat = cdCatId;
  closeEditExpense();
  renderAll();
  if(catPageOpen && openCat) openCategoryDetail(openCat);
}

document.getElementById('editBack').addEventListener('click', closeEditExpense);
document.getElementById('editSaveBtn').addEventListener('click', saveEditExpense);
document.getElementById('groupBack').addEventListener('click', closeGroupEditor);
document.getElementById('groupSaveBtn').addEventListener('click', saveGroup);
document.getElementById('groupDeleteBtn').addEventListener('click', deleteGroup);

/* ---------- Gastos recurrentes (suscripciones/servicios fijos) ----------
   dayFrom/dayTo: rango de días de pago (ambos null = sin fecha fija; dayTo
   null = un solo día). Antes existía un único campo "day"; se migra abajo. */
let recurring = [];        // [{id, name, amount, dayFrom, dayTo, category, paid:{'YYYY-MM': expenseId|true}}]
let recEditingId = null;
let recSelCat = null;

function loadRecurring(){
  try{ recurring = JSON.parse(localStorage.getItem(RECURRING_KEY)) || []; }
  catch(e){ recurring = []; }
  recurring.forEach(r=>{
    if(r.dayFrom === undefined){
      r.dayFrom = (typeof r.day === 'number' && r.day >= 1 && r.day <= 31) ? r.day : null;
      r.dayTo = null;
      delete r.day;
    }
  });
}

// true si hoy cae dentro del rango de pago del recurrente (o es su único día).
function isRecurringDue(r, now){
  if(r.dayFrom == null) return false;
  const d = now.getDate();
  const from = r.dayFrom;
  const to = (r.dayTo != null) ? r.dayTo : r.dayFrom;
  return d >= from && d <= to;
}
function hasPendingRecurringAlert(){
  const mk = monthKey(new Date());
  const now = new Date();
  return recurring.some(r => !r.paid[mk] && isRecurringDue(r, now));
}
function renderRecAlertBadge(){
  const badge = document.getElementById('recAlertBadge');
  if(!badge) return;
  badge.style.display = hasPendingRecurringAlert() ? '' : 'none';
}
function saveRecurring(){
  try{ localStorage.setItem(RECURRING_KEY, JSON.stringify(recurring)); }catch(e){}
}

function openRecurringPage(){
  // Siempre abre en la pestaña "Fijos".
  document.querySelectorAll('#recSubtabs .cg-tab').forEach(b=>b.classList.remove('active'));
  const fixedTab = document.querySelector('#recSubtabs .cg-tab[data-tab="fixed"]');
  if(fixedTab) fixedTab.classList.add('active');
  document.getElementById('recFixedSection').style.display = '';
  document.getElementById('remSection').style.display = 'none';
  document.getElementById('recTitle').textContent = 'Gastos fijos';
  showRecList();
  renderRecurringList();
  const page = document.getElementById('recurringPage');
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cd-open');
  page.scrollTop = 0;
}
function closeRecurringPage(){
  const page = document.getElementById('recurringPage');
  page.classList.remove('open');
  page.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cd-open');
}
function showRecList(){
  document.getElementById('recListWrap').style.display = '';
  document.getElementById('recFormWrap').style.display = 'none';
  document.getElementById('recTitle').textContent = 'Gastos fijos';
}

function renderRecurringList(){
  const box = document.getElementById('recurringList');
  const mk = monthKey(new Date());
  if(recurring.length === 0){
    box.innerHTML = '<div class="empty">Aún no tienes recurrentes. Crea uno con el botón de abajo.</div>';
    return;
  }
  const now = new Date();
  box.innerHTML = recurring.map(r=>{
    const cat = catById(r.category) || {icon:'🗂️', name:'Otros'};
    const paid = !!r.paid[mk];
    const due = !paid && isRecurringDue(r, now);
    const dayLbl = r.dayFrom == null ? 'sin fecha fija'
      : (r.dayTo != null && r.dayTo !== r.dayFrom) ? ('días ' + r.dayFrom + '–' + r.dayTo)
      : ('día ' + r.dayFrom);
    return '<div class="rec-item" data-id="' + r.id + '">' +
             '<div class="rec-info"><div class="rec-name">' + cat.icon + ' ' + r.name + (due ? ' <span class="rec-due-flag" title="Pendiente de pago">⚠️</span>' : '') + '</div>' +
               '<div class="rec-meta">S/ ' + fmt(r.amount) + ' · ' + dayLbl + ' · ' + cat.name + '</div></div>' +
             '<div class="rec-actions">' +
               '<span class="rec-edit" data-id="' + r.id + '" title="Editar">✏️</span>' +
               '<button class="rec-toggle' + (paid ? ' paid' : '') + '" data-id="' + r.id + '" type="button">' + (paid ? '✓ Pagado' : 'Pendiente') + '</button>' +
             '</div>' +
           '</div>';
  }).join('');
  box.querySelectorAll('.rec-toggle').forEach(b=>{
    b.addEventListener('click', ()=> toggleRecurringPaid(b.getAttribute('data-id')));
  });
  box.querySelectorAll('.rec-edit').forEach(b=>{
    b.addEventListener('click', ()=> openRecForm(b.getAttribute('data-id')));
  });
  renderRecAlertBadge();
}

function renderRecCatGrid(){
  const grid = document.getElementById('recCatGrid');
  grid.innerHTML = '';
  allCategories().forEach(cat=>{
    const btn = document.createElement('div');
    btn.className = 'cat-btn' + (recSelCat === cat.id ? ' selected' : '');
    btn.innerHTML = '<span class="icon">' + cat.icon + '</span>' + cat.name;
    btn.onclick = ()=>{ recSelCat = cat.id; renderRecCatGrid(); autoSaveRecItem(); };
    grid.appendChild(btn);
  });
}

function openRecForm(id){
  recEditingId = id;
  const r = id ? recurring.find(x=>x.id === id) : null;
  document.getElementById('recTitle').textContent = r ? 'Editar recurrente' : 'Nuevo recurrente';
  document.getElementById('recName').value = r ? r.name : '';
  document.getElementById('recAmount').value = r ? r.amount : '';
  document.getElementById('recDayFrom').value = (r && r.dayFrom != null) ? r.dayFrom : '';
  document.getElementById('recDayTo').value = (r && r.dayTo != null) ? r.dayTo : '';
  recSelCat = r ? r.category : null;
  renderRecCatGrid();
  document.getElementById('recDeleteBtn').style.display = r ? '' : 'none';
  document.getElementById('recListWrap').style.display = 'none';
  document.getElementById('recFormWrap').style.display = '';
}

// Guarda automáticamente en cuanto nombre, monto y categoría son válidos
// (no hay botón "Guardar"). Si aún falta algo, no hace nada ni avisa,
// para no interrumpir mientras el usuario sigue llenando el formulario.
function autoSaveRecItem(){
  if(document.getElementById('recFormWrap').style.display === 'none') return;
  const name = document.getElementById('recName').value.trim();
  const amount = parseFloat(document.getElementById('recAmount').value);
  let dayFrom = parseInt(document.getElementById('recDayFrom').value, 10);
  let dayTo = parseInt(document.getElementById('recDayTo').value, 10);
  dayFrom = (dayFrom >= 1 && dayFrom <= 31) ? dayFrom : null;
  dayTo = (dayTo >= 1 && dayTo <= 31) ? dayTo : null;
  if(dayFrom == null){ dayTo = null; }
  else if(dayTo != null && dayTo < dayFrom){ const t = dayFrom; dayFrom = dayTo; dayTo = t; }
  if(!name || !(amount > 0) || !recSelCat) return;
  if(recEditingId){
    const r = recurring.find(x=>x.id === recEditingId);
    if(r){ r.name = name; r.amount = amount; r.dayFrom = dayFrom; r.dayTo = dayTo; r.category = recSelCat; }
  } else {
    recEditingId = 'rec_' + Date.now();
    recurring.push({id:recEditingId, name:name, amount:amount, dayFrom:dayFrom, dayTo:dayTo, category:recSelCat, paid:{}});
    document.getElementById('recDeleteBtn').style.display = '';
  }
  saveRecurring();
  renderRecAlertBadge();
}

function deleteRecItem(){
  if(!recEditingId) return;
  if(!window.confirm('¿Eliminar este recurrente? (no borra los gastos ya registrados)')) return;
  recurring = recurring.filter(x=>x.id !== recEditingId);
  saveRecurring();
  showRecList();
  renderRecurringList();
}

function toggleRecurringPaid(id){
  const r = recurring.find(x=>x.id === id);
  if(!r) return;
  const mk = monthKey(new Date());
  if(r.paid[mk]){
    // Estaba pagado -> volver a pendiente. Si había gasto registrado, ofrecer quitarlo.
    const linked = r.paid[mk];
    delete r.paid[mk];
    saveRecurring();
    if(typeof linked === 'string'){
      if(window.confirm('¿Quitar también el gasto que se había registrado en tus movimientos?')){
        expenses = expenses.filter(e=>e.id !== linked);
        saveExpenses();
        renderAll();
      }
    }
    renderRecurringList();
  } else {
    // Marcar pagado; ofrecer registrarlo como gasto real.
    const cat = catById(r.category) || {name:'Otros'};
    const registrar = window.confirm('Marcaste "' + r.name + '" como pagado este mes.\n\n¿Registrarlo también como gasto real de S/ ' + fmt(r.amount) + ' en ' + cat.name + '?');
    if(registrar){
      const now = new Date();
      const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      let day;
      if(r.dayFrom == null){
        day = now.getDate(); // sin fecha fija: usa el día real en que se marca pagado
      } else if(isRecurringDue(r, now)){
        day = now.getDate(); // hoy cae dentro de su rango: usa la fecha real
      } else {
        day = Math.min(r.dayFrom, dim);
      }
      const gasto = {
        id: Date.now().toString(),
        amount: r.amount,
        category: r.category,
        note: r.name,
        date: new Date(now.getFullYear(), now.getMonth(), day, 12, 0, 0).toISOString()
      };
      expenses.push(gasto);
      saveExpenses();
      r.paid[mk] = gasto.id;
      renderAll();
    } else {
      r.paid[mk] = true; // pagado sin registrar gasto
    }
    saveRecurring();
    renderRecurringList();
  }
}

/* ---------- Gastos recurrentes (monto variable, ej: pelo/skincare) ----------
   Viven en la misma página que los gastos fijos (🔁), en la pestaña "Recurrentes".
   A diferencia de los gastos fijos, no tienen monto ni día: al marcar
   "Hecho" se abre el formulario de "Agregar gasto" con la categoría ya puesta
   para que el usuario escriba el monto real de esa vez. */
let reminders = [];            // [{id, name, category, done:{'YYYY-MM': expenseId|true}}]
let remEditingId = null;
let remSelCat = null;
let pendingReminderId = null;  // recordatorio que se está registrando como gasto ahora

function loadReminders(){
  try{ reminders = JSON.parse(localStorage.getItem(REMINDERS_KEY)) || []; }
  catch(e){ reminders = []; }
}
function saveReminders(){
  try{ localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders)); }catch(e){}
}

function renderRemindersList(){
  const box = document.getElementById('remindersList');
  if(!box) return;
  const mk = monthKey(new Date());
  if(reminders.length === 0){
    box.innerHTML = '<div class="empty">Aún no tienes recordatorios. Crea uno con el botón de abajo.</div>';
    return;
  }
  box.innerHTML = reminders.map(r=>{
    const cat = catById(r.category) || {icon:'🗂️', name:'Otros'};
    const done = !!r.done[mk];
    return '<div class="rec-item" data-id="' + r.id + '">' +
             '<div class="rec-info"><div class="rec-name">' + cat.icon + ' ' + r.name + '</div>' +
               '<div class="rec-meta">' + cat.name + '</div></div>' +
             '<div class="rec-actions">' +
               '<span class="rec-edit" data-id="' + r.id + '" title="Editar">✏️</span>' +
               '<button class="rec-toggle' + (done ? ' paid' : '') + '" data-id="' + r.id + '" type="button">' + (done ? '✓ Hecho' : 'Pendiente') + '</button>' +
             '</div>' +
           '</div>';
  }).join('');
  box.querySelectorAll('.rec-toggle').forEach(b=>{
    b.addEventListener('click', ()=> toggleReminderDone(b.getAttribute('data-id')));
  });
  box.querySelectorAll('.rec-edit').forEach(b=>{
    b.addEventListener('click', ()=> openRemForm(b.getAttribute('data-id')));
  });
}

function renderRemCatGrid(){
  const grid = document.getElementById('remCatGrid');
  grid.innerHTML = '';
  allCategories().forEach(cat=>{
    const btn = document.createElement('div');
    btn.className = 'cat-btn' + (remSelCat === cat.id ? ' selected' : '');
    btn.innerHTML = '<span class="icon">' + cat.icon + '</span>' + cat.name;
    btn.onclick = ()=>{ remSelCat = cat.id; renderRemCatGrid(); };
    grid.appendChild(btn);
  });
}

function showRemList(){
  document.getElementById('remListWrap').style.display = '';
  document.getElementById('remFormWrap').style.display = 'none';
}

function openRemForm(id){
  remEditingId = id;
  const r = id ? reminders.find(x=>x.id === id) : null;
  document.getElementById('remName').value = r ? r.name : '';
  remSelCat = r ? r.category : null;
  renderRemCatGrid();
  document.getElementById('remDeleteBtn').style.display = r ? '' : 'none';
  document.getElementById('remListWrap').style.display = 'none';
  document.getElementById('remFormWrap').style.display = '';
}

function saveRemItem(){
  const name = document.getElementById('remName').value.trim();
  if(!name || !remSelCat){ alert('Completa nombre y categoría.'); return; }
  if(remEditingId){
    const r = reminders.find(x=>x.id === remEditingId);
    if(r){ r.name = name; r.category = remSelCat; }
  } else {
    reminders.push({id:'rem_' + Date.now(), name:name, category:remSelCat, done:{}});
  }
  saveReminders();
  showRemList();
  renderRemindersList();
}

function deleteRemItem(){
  if(!remEditingId) return;
  if(!window.confirm('¿Eliminar este recordatorio? (no borra los gastos ya registrados)')) return;
  reminders = reminders.filter(x=>x.id !== remEditingId);
  saveReminders();
  showRemList();
  renderRemindersList();
}

function showRemPendingBanner(name){
  const b = document.getElementById('remPendingBanner');
  if(!b) return;
  document.getElementById('remPendingText').textContent = '🔔 Registrando: ' + name;
  b.style.display = '';
}
function hideRemPendingBanner(){
  const b = document.getElementById('remPendingBanner');
  if(b) b.style.display = 'none';
}
document.getElementById('remPendingCancel').addEventListener('click', ()=>{
  pendingReminderId = null;
  hideRemPendingBanner();
});

function toggleReminderDone(id){
  const r = reminders.find(x=>x.id === id);
  if(!r) return;
  const mk = monthKey(new Date());
  if(r.done[mk]){
    // Estaba hecho -> volver a pendiente. Si había gasto registrado, ofrecer quitarlo.
    const linked = r.done[mk];
    delete r.done[mk];
    saveReminders();
    if(typeof linked === 'string'){
      if(window.confirm('¿Quitar también el gasto que se había registrado en tus movimientos?')){
        expenses = expenses.filter(e=>e.id !== linked);
        saveExpenses();
        renderAll();
      }
    }
    renderRemindersList();
  } else {
    // Monto variable: llevar al formulario de "Agregar gasto" con la categoría
    // ya puesta, para que el usuario escriba el monto real de esta vez.
    pendingReminderId = id;
    closeRecurringPage();
    selectedCat = r.category;
    document.getElementById('noteInput').value = r.name;
    renderCats();
    validateForm();
    showRemPendingBanner(r.name);
    window.scrollTo({top:0, behavior:'smooth'});
    document.getElementById('amountInput').focus();
  }
}

document.getElementById('recurringBtn').addEventListener('click', openRecurringPage);
document.getElementById('recBack').addEventListener('click', closeRecurringPage);
document.getElementById('recurringAddBtn').addEventListener('click', ()=> openRecForm(null));
document.getElementById('recDeleteBtn').addEventListener('click', deleteRecItem);
document.getElementById('recCancelBtn').addEventListener('click', ()=>{ autoSaveRecItem(); showRecList(); renderRecurringList(); });
['recName','recAmount','recDayFrom','recDayTo'].forEach(fid=>{
  document.getElementById(fid).addEventListener('change', autoSaveRecItem);
});
document.getElementById('remAddBtn').addEventListener('click', ()=> openRemForm(null));
document.getElementById('remSaveBtn').addEventListener('click', saveRemItem);
document.getElementById('remDeleteBtn').addEventListener('click', deleteRemItem);
document.getElementById('remCancelBtn').addEventListener('click', ()=>{ showRemList(); renderRemindersList(); });
document.querySelectorAll('#recSubtabs .cg-tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('#recSubtabs .cg-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.getAttribute('data-tab');
    document.getElementById('recFixedSection').style.display = tab === 'fixed' ? '' : 'none';
    document.getElementById('remSection').style.display = tab === 'reminders' ? '' : 'none';
    document.getElementById('recTitle').textContent = tab === 'fixed' ? 'Gastos fijos' : 'Gastos recurrentes';
    if(tab === 'fixed'){ showRecList(); renderRecurringList(); }
    else{ showRemList(); renderRemindersList(); }
  });
});
/* ---------- Página de Cashback ---------- */
let cbEditingId = null;

// Pills para elegir el grupo "negocio" que NO recibe cashback.
function renderCbScope(){
  const box = document.getElementById('cbScopeOpts');
  if(!box) return;
  if(catGroups.length === 0){
    box.innerHTML = '<span class="cb-scope-none">Aún no tienes grupos creados.</span>';
    return;
  }
  let html = '<div class="gt-opt' + (!cashbackExcludeGroup ? ' selected' : '') + '" data-g="">Ninguno</div>';
  catGroups.forEach(g=>{
    html += '<div class="gt-opt' + (cashbackExcludeGroup === g.id ? ' selected' : '') + '" data-g="' + g.id + '">' + g.name + '</div>';
  });
  box.innerHTML = html;
  box.querySelectorAll('.gt-opt').forEach(el=>{
    el.onclick = ()=>{
      cashbackExcludeGroup = el.getAttribute('data-g') || null;
      saveCashbackExclude();
      renderCbScope();
      renderCashbackList();
      renderAll();
    };
  });
}

function renderCashbackList(){
  const box = document.getElementById('cashbackList');
  const balanceEl = document.getElementById('cbBalance');
  const totalRegistered = cashback.reduce((s,c)=>s+c.amount, 0);
  const withdrawnThisMonth = cashbackInMonth(viewYear, viewMonth);
  const usedThisMonth = cashbackUsedInMonth(viewYear, viewMonth);
  const usedAllTime = cashbackUsedAllTime();
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('es-PE', {month:'long'});

  let html = 'Recuperado en ' + cap(monthName) + ': S/ ' + fmt(usedThisMonth) +
    '<span class="cb-used">Retirado en ' + cap(monthName) + ': S/ ' + fmt(withdrawnThisMonth) + '</span>' +
    '<span class="cb-hist-title">Histórico (toda la app)</span>' +
    '<span class="cb-used">Retirado en total: S/ ' + fmt(totalRegistered) + '</span>' +
    '<span class="cb-used">Recuperado en total: S/ ' + fmt(usedAllTime) + '</span>';
  if(withdrawnThisMonth - usedThisMonth > 0.005){
    html += '<span class="cb-used">El cashback se refleja solo dentro de ' + monthName + ' — lo que no alcanzó a cubrirse con gastos de ese mes no pasa al siguiente.</span>';
  }
  balanceEl.innerHTML = html;

  renderCbScope();

  if(cashback.length === 0){
    box.innerHTML = '<div class="empty">Aún no registras cashback. Agrega tu primer retiro con el botón de abajo.</div>';
    return;
  }
  const sorted = [...cashback].sort((a,b)=> new Date(b.date) - new Date(a.date));
  box.innerHTML = sorted.map(c=>{
    const d = new Date(c.date);
    const dateStr = d.toLocaleDateString('es-PE', {day:'2-digit', month:'short', year:'numeric'});
    return '<div class="rec-item" data-id="' + c.id + '">' +
             '<div class="rec-info"><div class="rec-name">💰 S/ ' + fmt(c.amount) + '</div>' +
               '<div class="rec-meta">' + dateStr + (c.note ? ' · ' + c.note : '') + '</div></div>' +
             '<div class="rec-actions">' +
               '<span class="rec-edit" data-id="' + c.id + '" title="Editar">✏️</span>' +
             '</div>' +
           '</div>';
  }).join('');
  box.querySelectorAll('.rec-edit').forEach(b=>{
    b.addEventListener('click', ()=> openCbForm(b.getAttribute('data-id')));
  });
}

function showCbList(){
  document.getElementById('cbListWrap').style.display = '';
  document.getElementById('cbFormWrap').style.display = 'none';
}

function openCbForm(id){
  cbEditingId = id;
  const c = id ? cashback.find(x=>x.id === id) : null;
  document.getElementById('cbAmount').value = c ? c.amount : '';
  document.getElementById('cbNote').value = c ? (c.note || '') : '';
  document.getElementById('cbDate').value = c ? c.date.slice(0,10) : '';
  document.getElementById('cbDeleteBtn').style.display = c ? '' : 'none';
  document.getElementById('cbListWrap').style.display = 'none';
  document.getElementById('cbFormWrap').style.display = '';
}

function resolveCbDate(){
  const dv = document.getElementById('cbDate').value;
  if(dv){
    const d = new Date(dv + 'T12:00:00');
    if(!isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function saveCbItem(){
  const amount = parseFloat(document.getElementById('cbAmount').value);
  if(!(amount > 0)){ alert('Ingresa un monto válido.'); return; }
  const note = document.getElementById('cbNote').value.trim();
  const date = resolveCbDate();
  if(cbEditingId){
    const c = cashback.find(x=>x.id === cbEditingId);
    if(c){ c.amount = amount; c.note = note; c.date = date; }
  } else {
    cashback.push({id:'cb_' + Date.now(), amount:amount, note:note, date:date});
  }
  saveCashback();
  showCbList();
  renderCashbackList();
  renderAll(); // el total general puede haber cambiado
}

function deleteCbItem(){
  if(!cbEditingId) return;
  if(!window.confirm('¿Eliminar este registro de cashback?')) return;
  cashback = cashback.filter(x=>x.id !== cbEditingId);
  saveCashback();
  showCbList();
  renderCashbackList();
  renderAll();
}

function openCashbackPage(){
  cbEditingId = null;
  showCbList();
  renderCashbackList();
  const page = document.getElementById('cashbackPage');
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cd-open');
  page.scrollTop = 0;
}
function closeCashbackPage(){
  const page = document.getElementById('cashbackPage');
  page.classList.remove('open');
  page.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cd-open');
}

document.getElementById('cashbackBtn').addEventListener('click', openCashbackPage);
document.getElementById('cashbackBack').addEventListener('click', closeCashbackPage);
document.getElementById('cashbackAddBtn').addEventListener('click', ()=> openCbForm(null));
document.getElementById('cbSaveBtn').addEventListener('click', saveCbItem);
document.getElementById('cbDeleteBtn').addEventListener('click', deleteCbItem);
document.getElementById('cbCancelBtn').addEventListener('click', showCbList);
(function(){
  const di = document.getElementById('cbDate');
  if(di) di.max = new Date().toISOString().slice(0,10);
})();

document.getElementById('editAmount').addEventListener('input', validateEditForm);
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && document.getElementById('editPage').classList.contains('open')) closeEditExpense();
});

document.getElementById('amountInput').addEventListener('input', validateForm);

// Fecha del gasto: la elegida en el selector (si hay) o ahora mismo.
// Se usa mediodía local para evitar corrimientos de día por zona horaria.
function resolveGastoDate(){
  const dv = document.getElementById('dateInput').value; // "YYYY-MM-DD" o ""
  if(dv){
    const d = new Date(dv + 'T12:00:00');
    if(!isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

document.getElementById('saveBtn').addEventListener('click', ()=>{
  const amount = parseFloat(document.getElementById('amountInput').value);
  const note = document.getElementById('noteInput').value.trim();
  if(!(amount>0) || !selectedCat) return;

  const gasto = {
    id: Date.now().toString(),
    amount: amount,
    category: selectedCat,
    note: note,
    date: resolveGastoDate()
  };
  if(selectedGroupTags.length) gasto.groups = selectedGroupTags.slice();
  if(isCashbackExemptCategory(selectedCat)) gasto.stockOnly = (selectedStockOnly === 'product');
  expenses.push(gasto);

  saveExpenses();

  if(pendingReminderId){
    const r = reminders.find(x=>x.id === pendingReminderId);
    if(r){ r.done[monthKey(new Date())] = gasto.id; saveReminders(); }
    pendingReminderId = null;
    hideRemPendingBanner();
  }

  document.getElementById('amountInput').value = '';
  document.getElementById('noteInput').value = '';
  document.getElementById('dateInput').value = '';
  selectedCat = null;
  selectedGroupTags = [];
  selectedStockOnly = null;
  lastNoteHintCat = undefined;
  renderCats();
  validateForm();
  renderAll();
});

// Evita elegir fechas futuras.
(function(){
  const di = document.getElementById('dateInput');
  if(di) di.max = new Date().toISOString().slice(0,10);
})();

let savedTheme = 'azul';
try{ savedTheme = localStorage.getItem(THEME_KEY) || 'azul'; }catch(e){ savedTheme = 'azul'; }
try{ lastAccentTheme = localStorage.getItem(ACCENT_THEME_KEY) || (NEUTRAL_THEMES.indexOf(savedTheme) === -1 ? savedTheme : 'azul'); }catch(e){ lastAccentTheme = 'azul'; }
if(!THEMES[lastAccentTheme] || NEUTRAL_THEMES.indexOf(lastAccentTheme) !== -1){ lastAccentTheme = 'azul'; }
initEyebrow();
try{ applyTheme(savedTheme); }catch(e){}
loadCustomCategories();
loadCatOverrides();
loadFrequentNotes();
loadDeletedBaseCats();
loadCatOrder();
loadCategoryColors();
loadCategoryBudgets();
loadMonthBudgets();
loadCatGroups();
loadRecurring();
renderRecAlertBadge();
loadReminders();
loadCashback();
loadCashbackExclude();
loadAvoidable();
loadSimAutoAvoidCats();
loadAvoidableExceptions();
loadRangeGoal();
loadShowCatCompare();
document.getElementById('mtCompareToggleBtn').classList.toggle('active', showCatCompare);
document.getElementById('cdCompareToggleBtn').classList.toggle('active', showCatCompare);
renderCats();
loadExpenses();
