(function(){
if(!window.storage){
  window.storage = {
    async get(key){
      try{
        const value = localStorage.getItem(key);
        return value == null ? null : { key: key, value: value };
      }catch(e){
        return null;
      }
    },
    async set(key, value){
      localStorage.setItem(key, value);
      return { key: key, value: value };
    }
  };
}


/* ===================== ICONS ===================== */
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="15" y2="15"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.3 2.1a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1L11 21h4l.3-2.1a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4z"/>',
  users: '<circle cx="8.5" cy="8" r="3.2"/><path d="M2.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2c2.6.3 4.5 2.5 4.5 5.2"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><line x1="20" y1="20" x2="15.3" y2="15.3"/>',
  sliders: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  play: '<circle cx="12" cy="12" r="9"/><polygon points="10 8 16 12 10 16"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  edit: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"/><line x1="14" y1="7" x2="17" y2="10"/>',
  trash: '<polyline points="4 7 20 7"/><path d="M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
  camera: '<path d="M4 8h3l2-2h6l2 2h3v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z"/><circle cx="12" cy="13.5" r="3.3"/>',
  volume: '<polygon points="4 9 8 9 12 5 12 19 8 15 4 15"/><path d="M16 8.5a5 5 0 0 1 0 7"/>',
  volumeMute: '<polygon points="4 9 8 9 12 5 12 19 8 15 4 15"/><line x1="16" y1="9" x2="21" y2="14"/><line x1="21" y1="9" x2="16" y2="14"/>',
  sync: '<path d="M4 12a8 8 0 0 1 14-5.3L20 8"/><polyline points="20 3 20 8 15 8"/><path d="M20 12a8 8 0 0 1-14 5.3L4 16"/><polyline points="4 21 4 16 9 16"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  qrscan: '<path d="M4 8V5a1 1 0 0 1 1-1h3"/><path d="M20 8V5a1 1 0 0 0-1-1h-3"/><path d="M4 16v3a1 1 0 0 0 1 1h3"/><path d="M20 16v3a1 1 0 0 1-1 1h-3"/><rect x="9" y="9" width="6" height="6"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="8" y1="7.5" x2="8" y2="7.51"/><line x1="12" y1="7.5" x2="12" y2="7.51"/><line x1="16" y1="7.5" x2="16" y2="7.51"/><line x1="8" y1="11.5" x2="8" y2="11.51"/><line x1="12" y1="11.5" x2="12" y2="11.51"/><line x1="16" y1="11.5" x2="16" y2="11.51"/><line x1="9" y1="21" x2="9" y2="15"/><line x1="15" y1="21" x2="15" y2="15"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16 9"/>',
  alertTriangle: '<path d="M12 3 2 21h20L12 3z"/><line x1="12" y1="9.5" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17.01"/>',
  helmet: '<path d="M4 15a8 8 0 0 1 16 0v1H4v-1z"/><path d="M11 3.2A8 8 0 0 0 4.3 12"/><line x1="2" y1="16" x2="22" y2="16"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.5 4.9L3 17.5 5.5 20l6.3-6.2a4 4 0 0 0 4.9-5.5l-2.7 2.7-2-2z"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="7.5" x2="12" y2="7.51"/>',
  printer: '<path d="M7 8V3h10v5"/><rect x="4" y="8" width="16" height="9" rx="1.5"/><path d="M7 13h10v8H7z"/><line x1="8" y1="17" x2="16" y2="17"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.2 3.8"/><path d="M6.1 6.1C3.6 7.8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.2-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5"/><path d="M4 16h16"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  message: '<path d="M4 6h16v10H7l-3 3V6z"/>'
};
function icon(name, size, extraClass){
  size = size || 18;
  return '<svg class="icon ' + (extraClass||'') + '" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name]||'') + '</svg>';
}

/* ===================== STATE & STORAGE ===================== */
const STORAGE_KEY = 'prodfy_data_v7_cracha';
let state = {
  employees: [], products: [], orders: [], punches: [], resources: [],
  nextOrderNum: 1, nextEmployeeNum: 1
};
let activeTab = 'dashboard';
let clockTimer = null;
let soundEnabled = true;
let lastSyncAt = null;
let dashSearch = '';
let dashSetor = 'Todos';
let apFuncionarioId = '';
let apRecurso = '';
let apRecursoCustom = '';
let apEmpFilterQuery = '';
let finEmpFilterQuery = '';

const AVATAR_COLORS = ['#2F6FED','#17A056','#F5A524','#8B5CF6','#EF4444','#0EA5B7','#D6409F'];
const CACHE_KEY = 'prodfy_sync_v1';
const LEGACY_KEY = 'prodfy_data_v7_cracha';
const PRODUCTION_COLLECTIONS = [
  ['employee', 'employees', item => item.id],
  ['product', 'products', item => item.codigo],
  ['order', 'orders', item => item.id],
  ['punch', 'punches', item => item.id],
  ['resource', 'resources', item => item.id],
  ['group', 'groups', item => item.id],
  ['family', 'families', item => item.id],
  ['equipment', 'equipments', item => item.id],
  ['setor', 'setores', item => item.id],
  ['operacao', 'operacoes', item => item.id]
];
let fingerprints = {};
let pendingDeletes = [];
let syncLabel = 'Neste aparelho';
let syncError = false;
let mutationEpoch = 0;
let syncTimer = null;
let syncing = false;
function colorForName(name){ let h=0; for(let i=0;i<name.length;i++){ h = name.charCodeAt(i) + ((h<<5)-h); } return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]; }
function initials(nome, sobrenome){ return ((nome[0]||'')+(sobrenome[0]||'')).toUpperCase(); }
function productCodeTaken(codigo, exceptIndex){
  const key = String(codigo || '').trim().toLowerCase();
  if(!key) return false;
  return state.products.some(function(product, index){
    if(exceptIndex !== undefined && index === exceptIndex) return false;
    const erp = String(product.codigoErp || '').trim().toLowerCase();
    const code = String(product.codigo || '').trim().toLowerCase();
    return code === key || erp === key;
  });
}
function genErpCode(classificacao){
  const mid = classificacao==='PI' ? '2000' : '3000';
  const used = {};
  state.products.forEach(function(product){
    [product.codigo, product.codigoErp].forEach(function(value){
      const parts = String(value || '').split('.');
      if(parts[0]==='30' && parts[1]===mid && /^\d{4}$/.test(parts[2] || '')) used[parts[2]] = true;
    });
  });
  for(let n = 1; n <= 9999; n++){
    const last4 = String(n).padStart(4, '0');
    if(!used[last4]) return '30.' + mid + '.' + last4;
  }
  return '30.' + mid + '.' + String(Date.now()).slice(-4);
}
function formatOrderNumber(n){ const s = String(n).padStart(6,'0'); return s.slice(0,3) + '.' + s.slice(3); }
function formatEmployeeNumber(n){ return String(n).padStart(4,'0'); }
function parsePositiveInt(value){
  const digits = String(value || '').replace(/\D/g, '');
  if(!digits) return 0;
  const number = Number(digits);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}
function employeeNumberTaken(numero, exceptId){
  const key = String(numero);
  return state.employees.some(function(employee){
    if(exceptId && employee.id === exceptId) return false;
    return String(employee.numero) === key;
  });
}
function assignEmployeeNumber(raw, exceptId){
  const parsed = parsePositiveInt(raw);
  const value = parsed || state.nextEmployeeNum;
  const numero = formatEmployeeNumber(value);
  if(employeeNumberTaken(numero, exceptId)) return { error: 'Este número de funcionário já existe.' };
  if(value >= state.nextEmployeeNum) state.nextEmployeeNum = value + 1;
  return { numero: numero };
}
function orderNumberTaken(numero){
  return state.orders.some(function(order){ return String(order.numero) === String(numero); });
}
function assignOrderNumber(raw){
  const typed = String(raw || '').trim();
  const numero = typed || formatOrderNumber(state.nextOrderNum);
  if(orderNumberTaken(numero)) return { error: 'Já existe uma ordem com este número.' };
  const parsed = parsePositiveInt(numero);
  if(parsed >= state.nextOrderNum) state.nextOrderNum = parsed + 1;
  else if(!typed) state.nextOrderNum += 1;
  return { numero: numero };
}
function nextResourceCode(){
  let max = 0;
  state.resources.forEach(function(resource){
    const match = String(resource.nome || '').match(/(\d+)\s*$/);
    if(match) max = Math.max(max, Number(match[1]));
  });
  return 'C' + String(max + 1).padStart(4, '0');
}

function openEmployeePhoto(employeeId, evt){
  if(evt){ evt.preventDefault(); evt.stopPropagation(); }
  const e = state.employees.find(x=>x.id===employeeId);
  if(!e) return;
  const overlay = document.getElementById('employeePhotoZoom');
  const image = document.getElementById('employeePhotoLarge');
  const letters = initials(e.nome||'', e.sobrenome||'');
  image.removeAttribute('src');
  image.alt = `${e.nome} ${e.sobrenome}`;
  image.style.display = 'none';
  const wrap = image.parentElement;
  if(wrap){
    wrap.style.background = colorForName((e.nome||'')+(e.sobrenome||''));
    wrap.style.color = '#fff';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    wrap.style.fontSize = '64px';
    wrap.style.fontWeight = '800';
    wrap.setAttribute('data-letters', letters);
  }
  document.getElementById('employeePhotoName').textContent = `${e.nome} ${e.sobrenome}`;
  document.getElementById('employeePhotoRole').textContent = `${e.funcao} • ${e.turno}`;
  document.getElementById('employeePhotoMeta').textContent = `Funcionário ${e.numero}`;
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeEmployeePhoto(evt){
  if(evt && evt.target && evt.target.id !== 'employeePhotoZoom') return;
  const overlay = document.getElementById('employeePhotoZoom');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeEmployeePhoto(); });
function employeeAvatarHTML(e, className){
  if(!e) return '';
  const color = colorForName((e.nome||'')+(e.sobrenome||''));
  const letters = initials(e.nome||'', e.sobrenome||'');
  return `<span class="${className} worker-avatar" role="button" tabindex="0" title="${e.nome} ${e.sobrenome}" aria-label="${e.nome} ${e.sobrenome}" onclick="openEmployeePhoto('${e.id}', event)" onkeydown="if(event.key==='Enter'||event.key===' '){openEmployeePhoto('${e.id}',event)}" style="background:${color};color:#fff;">${letters}</span>`;
}
function employeeIdentityHTML(id, compact){
  const e = state.employees.find(x=>x.id===id);
  if(!e) return '—';
  return `<span class="employee-inline">${employeeAvatarHTML(e, compact ? 'inline-avatar-small' : 'inline-avatar')}<span>${e.nome} ${e.sobrenome}</span></span>`;
}
function employeeMiniChipHTML(id){
  const e = state.employees.find(x=>x.id===id);
  if(!e) return '';
  return `<span class="employee-mini-chip">${employeeAvatarHTML(e,'inline-avatar-small')}<span>${e.nome} ${e.sobrenome}</span></span>`;
}
function emptyState(){
  return { employees:[], products:[], orders:[], punches:[], resources:[], groups:[], families:[], equipments:[], setores:[], operacoes:[], nextOrderNum:1, nextEmployeeNum:1 };
}
function activeCompanyId(){
  if(sessionUser && sessionUser.companyId) return sessionUser.companyId;
  try { return localStorage.getItem('prodfy_company') || ''; } catch(e){ return ''; }
}
function cacheStorageKey(){
  return CACHE_KEY + '_' + (activeCompanyId() || 'local');
}
function companyHeaders(){
  const headers = {};
  const companyId = activeCompanyId();
  if(companyId) headers['x-company-id'] = companyId;
  return headers;
}
function authToken(){
  try { return localStorage.getItem('prodfy_jwt') || ''; } catch(e){ return ''; }
}
function apiBase(){
  return (window.PRODIFY_CONFIG && window.PRODIFY_CONFIG.apiUrl) || '';
}
function recordBody(item){
  const clone = Object.assign({}, item);
  delete clone.updatedAt;
  return clone;
}
function stampChanges(){
  const seen = new Set();
  const now = new Date().toISOString();
  PRODUCTION_COLLECTIONS.forEach(([kind, key, idOf])=>{
    state[key].forEach(item=>{
      const id = String(idOf(item) || '');
      if(!id) return;
      const mapKey = kind + ':' + id;
      seen.add(mapKey);
      const json = JSON.stringify(recordBody(item));
      if(fingerprints[mapKey] !== json){
        item.updatedAt = now;
        fingerprints[mapKey] = json;
      }
    });
  });
  Object.keys(fingerprints).forEach(mapKey=>{
    if(seen.has(mapKey)) return;
    const splitAt = mapKey.indexOf(':');
    pendingDeletes.push({ kind: mapKey.slice(0, splitAt), id: mapKey.slice(splitAt + 1), updatedAt: now });
    delete fingerprints[mapKey];
  });
}
function rebuildFingerprints(){
  fingerprints = {};
  PRODUCTION_COLLECTIONS.forEach(([kind, key, idOf])=>{
    state[key].forEach(item=>{
      const id = String(idOf(item) || '');
      if(!id) return;
      fingerprints[kind + ':' + id] = JSON.stringify(recordBody(item));
    });
  });
}
function saveCache(){
  try{
    localStorage.setItem(cacheStorageKey(), JSON.stringify({ state, fingerprints, pendingDeletes }));
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem(STORAGE_KEY);
  }catch(e){
    console.error('Erro ao guardar a fila local', e);
  }
}
function loadCache(){
  try{
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem(STORAGE_KEY);
  }catch(e){}
  state = emptyState();
  fingerprints = {};
  pendingDeletes = [];
  try{
    const raw = localStorage.getItem(cacheStorageKey());
    if(raw){
    const parsed = JSON.parse(raw);
    state = Object.assign(emptyState(), parsed.state || {});
    PRODUCTION_COLLECTIONS.forEach(([, key])=>{ if(!Array.isArray(state[key])) state[key] = []; });
    fingerprints = parsed.fingerprints || {};
    pendingDeletes = Array.isArray(parsed.pendingDeletes) ? parsed.pendingDeletes : [];
    }
  }catch(e){
    state = emptyState();
  }
  normalizeState();
  stripLegacyCatalog();
}
let sectorHold = null;
function sectorKey(value){
  return String(value || '').trim().toLowerCase();
}
function allowedSectorKeys(){
  if(!sessionUser || sessionUser.role === 'administrador_suporte') return null;
  const sectors = sessionUser.permissions && sessionUser.permissions.sectors;
  if(!Array.isArray(sectors) || !sectors.length) return null;
  const keys = sectors.map(sectorKey).filter(Boolean);
  return keys.length ? keys : null;
}
function restoreSectorHold(){
  if(!sectorHold) return;
  ['groups','families','products','orders','punches','resources','equipments','setores','operacoes'].forEach(function(key){
    state[key] = (state[key] || []).concat(sectorHold[key] || []);
  });
  sectorHold = null;
}
function normalizeState(){
  let changed = false;
  const now = new Date().toISOString();
  function ensureArray(item, key){
    if(!item || Array.isArray(item[key])) return;
    item[key] = [];
    item.updatedAt = now;
    changed = true;
  }
  state.setores = state.setores || [];
  state.operacoes = state.operacoes || [];
  (state.resources || []).forEach(function(resource){
    ensureArray(resource, 'funcionarios');
    ensureArray(resource, 'operacoes');
    ensureArray(resource, 'grupos');
  });
  (state.families || []).forEach(function(family){ ensureArray(family, 'itens'); });
  (state.equipments || []).forEach(function(equipment){ ensureArray(equipment, 'itens'); });
  (state.products || []).forEach(function(product){
    ensureArray(product, 'maquinas');
    ensureArray(product, 'rota');
  });
  if(changed) mutationEpoch++;
}
function queueCatalogDelete(kind, id){
  const now = new Date().toISOString();
  delete fingerprints[kind + ':' + id];
  const existing = pendingDeletes.find(function(item){ return item.kind === kind && item.id === id; });
  if(existing){ existing.updatedAt = now; return; }
  pendingDeletes.push({ kind: kind, id: id, updatedAt: now });
}
function stripLegacyCatalog(){
  let changed = false;
  function drop(kind, key, idOf, legacy){
    state[key] = (state[key] || []).filter(function(item){
      if(!legacy(item)) return true;
      const id = String(idOf(item) || '');
      if(id) queueCatalogDelete(kind, id);
      changed = true;
      return false;
    });
  }
  drop('group', 'groups', function(item){ return item.id; }, function(item){ return !String(item.codigo || '').trim(); });
  drop('family', 'families', function(item){ return item.id; }, function(item){ return !String(item.codigo || '').trim(); });
  drop('product', 'products', function(item){ return item.codigo; }, function(item){
    return !String(item.codigoErp || '').trim() && String(item.codigo || '').indexOf('.') >= 0;
  });
  drop('equipment', 'equipments', function(item){ return item.id; }, function(item){ return !String(item.codigo || '').trim(); });
  drop('resource', 'resources', function(item){ return item.id; }, function(item){ return !String(item.codigo || '').trim(); });
  (state.employees || []).forEach(function(employee){
    if(String(employee.codigo || '').trim()) return;
    employee.codigo = nextAlphaCode((state.employees || []).map(function(item){ return item.codigo; }));
    employee.updatedAt = new Date().toISOString();
    changed = true;
  });
  if(changed) mutationEpoch++;
}
function restrictStateToSectors(){
  restoreSectorHold();
  const allowed = allowedSectorKeys();
  if(!allowed) return;
  const hold = { groups:[], families:[], products:[], orders:[], punches:[], resources:[], equipments:[], setores:[], operacoes:[] };
  const setorOk = {};
  (state.setores || []).forEach(function(setor){
    setorOk[setor.id] = allowed.indexOf(sectorKey(recordLabel(setor))) >= 0;
  });
  function sectorVisible(id){
    if(!id || !Object.prototype.hasOwnProperty.call(setorOk, id)) return true;
    return !!setorOk[id];
  }
  state.setores = state.setores.filter(function(setor){
    if(setorOk[setor.id]) return true;
    hold.setores.push(setor);
    return false;
  });
  state.products = state.products.filter(function(product){
    const ids = [product.setorId].concat((product.rota || []).map(function(step){ return step.setorId; })).filter(Boolean);
    const visible = !ids.length || ids.some(sectorVisible);
    if(visible) return true;
    hold.products.push(product);
    return false;
  });
  state.resources = state.resources.filter(function(resource){
    if(sectorVisible(resource.setorId)) return true;
    if(!resource.setorId && resource.setor && resource.setor !== 'Geral'){
      const visible = String(resource.setor).split(',').some(function(name){ return allowed.indexOf(sectorKey(name)) >= 0; });
      if(visible) return true;
    }
    if(!resource.setorId && (!resource.setor || resource.setor === 'Geral')) return true;
    hold.resources.push(resource);
    return false;
  });
  state.equipments = state.equipments.filter(function(equipment){
    const parts = (equipment.itens || []).map(function(part){ return part.setorId; }).filter(Boolean);
    const visible = !parts.length || parts.some(sectorVisible);
    if(visible) return true;
    hold.equipments.push(equipment);
    return false;
  });
  const orderOk = {};
  state.orders = state.orders.filter(function(order){
    const items = order.itens || [];
    let visible = true;
    if(items.length){
      visible = items.some(function(item){
        if(item.setorId) return sectorVisible(item.setorId);
        if(item.setorNome) return allowed.indexOf(sectorKey(item.setorNome)) >= 0;
        return true;
      });
    } else if(order.setor) visible = allowed.indexOf(sectorKey(order.setor)) >= 0;
    if(visible){ orderOk[order.id] = true; return true; }
    hold.orders.push(order);
    return false;
  });
  state.punches = state.punches.filter(function(punch){
    if(orderOk[punch.ordemId]) return true;
    hold.punches.push(punch);
    return false;
  });
  sectorHold = hold;
}
function buildChanges(){
  restoreSectorHold();
  let changes;
  try{ changes = collectChanges(); }
  finally{ restrictStateToSectors(); }
  return changes;
}
function collectChanges(){
  const records = [];
  PRODUCTION_COLLECTIONS.forEach(([kind, key, idOf])=>{
    state[key].forEach(item=>{
      const id = String(idOf(item) || '');
      if(!id || !item.updatedAt) return;
      records.push({ kind, id, payload: recordBody(item), updatedAt: item.updatedAt, deletedAt: null });
    });
  });
  pendingDeletes.forEach(tomb=>{
    records.push({ kind: tomb.kind, id: tomb.id, payload: {}, updatedAt: tomb.updatedAt, deletedAt: tomb.updatedAt });
  });
  return { records, nextOrderNum: state.nextOrderNum, nextEmployeeNum: state.nextEmployeeNum };
}
function applySnapshot(data){
  restoreSectorHold();
  const tomb = new Map((data.tombstones || []).map(item => [item.kind + ':' + item.id, item.updatedAt]));
  const next = emptyState();
  next.nextOrderNum = Math.max(state.nextOrderNum || 1, data.nextOrderNum || 1);
  next.nextEmployeeNum = Math.max(state.nextEmployeeNum || 1, data.nextEmployeeNum || 1);
  PRODUCTION_COLLECTIONS.forEach(([kind, key, idOf])=>{
    const serverItems = Array.isArray(data[key]) ? data[key] : [];
    const serverById = new Map(serverItems.map(item => [String(idOf(item)), item]));
    const localById = new Map((state[key] || []).map(item => [String(idOf(item) || ''), item]));
    const merged = [];
    const seen = new Set();
    serverById.forEach((serverItem, id)=>{
      const local = localById.get(id);
      const deletion = pendingDeletes.find(item => item.kind === kind && item.id === id);
      if(deletion && deletion.updatedAt > (serverItem.updatedAt || '')) return;
      if(local && local.updatedAt && local.updatedAt > (serverItem.updatedAt || '')) merged.push(local);
      else merged.push(serverItem);
      seen.add(id);
    });
    localById.forEach((local, id)=>{
      if(!id || seen.has(id)) return;
      const tombAt = tomb.get(kind + ':' + id);
      if(tombAt && tombAt >= (local.updatedAt || '')) return;
      merged.push(local);
    });
    next[key] = merged;
  });
  pendingDeletes = pendingDeletes.filter(item => {
    const tombAt = tomb.get(item.kind + ':' + item.id);
    return !(tombAt && tombAt >= item.updatedAt);
  });
  state = next;
  state.groups.forEach(function(item){ delete item.imagem; });
  state.families.forEach(function(item){ delete item.imagem; });
  normalizeState();
  stripLegacyCatalog();
  rebuildFingerprints();
  restrictStateToSectors();
}
function scheduleSync(){
  clearTimeout(syncTimer);
  syncTimer = setTimeout(()=>{ syncNow(); }, 1500);
}
async function syncNow(){
  if(syncing) return;
  if(!navigator.onLine){
    setSyncPill('Offline — alterações neste aparelho', true);
    return;
  }
  const token = authToken();
  if(!token){
    setSyncPill('Entre na conta para sincronizar', true);
    return;
  }
  const epoch = mutationEpoch;
  syncing = true;
  setSyncPill('Sincronizando…');
  try{
    const viewing = sessionUser && permissionList(sessionUser).edit.length === 0;
    if(sessionUser && sessionUser.role === 'administrador_suporte' && !activeCompanyId()){
      setSyncPill('Escolha a empresa em Configurações', true);
      return;
    }
    const response = await fetch(apiBase() + (viewing ? '/api/production' : '/api/production/sync'), {
      method: viewing ? 'GET' : 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, companyHeaders()),
      body: viewing ? undefined : JSON.stringify(buildChanges())
    });
    if(response.status === 401){
      setSyncPill('Entre de novo para sincronizar', true);
      return;
    }
    if(!response.ok){
      let payload = null;
      try{ payload = await response.json(); }catch(err){ payload = null; }
      const failure = new Error(payload && payload.error ? payload.error.message : 'Falha ao sincronizar');
      failure.code = payload && payload.error ? payload.error.code : '';
      if(kickIfCompanyClosed(failure)) return;
      if(failure.code === 'COMPANY_BLOCKED' || failure.code === 'COMPANY_EXPIRED'){
        setSyncPill(failure.message, true);
        return;
      }
      throw failure;
    }
    const body = await response.json();
    applySnapshot(body.data || {});
    saveCache();
    lastSyncAt = nowBR();
    setSyncPill('Sincronizado');
    if(mutationEpoch !== epoch) scheduleSync();
    else refreshAfterSync();
  }catch(e){
    setSyncPill('Sem conexão — dados guardados neste aparelho', true);
  }finally{
    syncing = false;
  }
}
function refreshAfterSync(){
  if(typeof renderNav === 'function') renderNav();
  if(activeTab==='dashboard' && typeof renderDashboard === 'function') renderDashboard();
  if(activeTab==='ordens' && typeof renderOrdens === 'function') renderOrdens();
  if(activeTab==='apontamento' && typeof renderApontamento === 'function') renderApontamento();
  if(activeTab==='recursos' && typeof renderRecursos === 'function') renderRecursos();
  if(activeTab==='cadastro' && typeof renderCadastro === 'function') renderCadastro();
  if(activeTab==='engenharia' && typeof renderEngenharia === 'function') renderEngenharia();
  if(activeTab==='funcionarios' && typeof renderFuncionarios === 'function') renderFuncionarios();
  if(activeTab==='acompanhamento' && typeof renderAcompanhamento === 'function') renderAcompanhamento();
}
async function loadData(){
  loadCache();
  window.addEventListener('online', ()=>{
    toast('Internet voltou. Enviando o que foi feito neste aparelho.', 'success');
    syncNow();
  });
  window.addEventListener('offline', ()=>{
    setSyncPill('Offline — alterações neste aparelho', true);
  });
  setInterval(()=>{ if(navigator.onLine) syncNow(); }, 30000);
  await syncNow();
}
async function persist(){
  mutationEpoch++;
  try{
    stampChanges();
    saveCache();
    lastSyncAt = nowBR();
    if(!navigator.onLine) setSyncPill('Offline — alterações neste aparelho', true);
    else if(!authToken()) setSyncPill('Entre na conta para sincronizar', true);
    else setSyncPill('Sincronizando…');
    scheduleSync();
  }catch(e){
    console.error('Erro ao salvar dados', e);
    setSyncPill('Falha ao salvar', true);
    toast('Não foi possível guardar os dados neste aparelho.', 'error');
  }
}
function uid(){ return 'id-' + Math.random().toString(36).slice(2,10) + Date.now().toString(36); }

/* ===================== TIME (Brasil) ===================== */
function nowBR(){ return new Date(new Date().toLocaleString('en-US', {timeZone:'America/Sao_Paulo'})); }
function fmtTime(d){ return d.toLocaleTimeString('pt-BR', {timeZone:'America/Sao_Paulo', hour:'2-digit', minute:'2-digit', second:'2-digit'}); }
function fmtDate(d){ return d.toLocaleDateString('pt-BR', {timeZone:'America/Sao_Paulo', weekday:'short', day:'2-digit', month:'short', year:'numeric'}); }
function fmtDateShort(d){ return d.toLocaleDateString('pt-BR', {timeZone:'America/Sao_Paulo'}); }
function fmtDateTime(iso){ if(!iso) return '—'; return new Date(iso).toLocaleString('pt-BR', {timeZone:'America/Sao_Paulo', day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit'}); }
function todayISODate(){ return new Date().toLocaleDateString('en-CA', {timeZone:'America/Sao_Paulo'}); }
function isTodayBR(iso){ if(!iso) return false; return new Date(iso).toLocaleDateString('en-CA', {timeZone:'America/Sao_Paulo'}) === todayISODate(); }
function nowISO(){ return new Date().toISOString(); }
function minutesBetween(iso1, iso2){ return (new Date(iso2) - new Date(iso1)) / 60000; }
function brDate(iso){ if(!iso) return ''; const p=iso.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }
function elapsedLabel(iso){
  const mins = Math.max(0, Math.round(minutesBetween(iso, nowISO())));
  if(mins < 60) return 'há ' + mins + ' min';
  const h = Math.floor(mins/60), m = mins%60;
  return 'há ' + h + 'h ' + m + 'min';
}

function startClock(){
  function tick(){
    const d = nowBR();
    const foot = document.getElementById('footClock');
    if(foot) foot.innerHTML = '<b>Horário:</b> ' + fmtTime(d).slice(0,5) + ' (BR)';
    const pc = document.getElementById('apClockDisplay');
    if(pc) pc.innerHTML = fmtTime(d) + '<small>' + fmtDate(d) + '</small>';
  }
  tick();
  if(clockTimer) clearInterval(clockTimer);
  clockTimer = setInterval(tick, 1000);
}

/* ===================== SOUND SIGNALS ===================== */
let audioCtx = null;
function getAudioCtx(){ if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } return audioCtx; }
function beep(freq, duration, delay, type){
  if(!soundEnabled) return;
  try{
    const ctx = getAudioCtx();
    const t0 = ctx.currentTime + (delay||0);
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.28, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + duration + 0.02);
  }catch(e){}
}
function beepStart(){ beep(880, 0.16, 0, 'square'); beep(1180, 0.18, 0.14, 'square'); }
function beepEnd(){ beep(700, 0.16, 0, 'square'); beep(420, 0.22, 0.15, 'square'); }
function beepError(){ beep(220, 0.3, 0, 'sawtooth'); }
function toggleSound(){ soundEnabled = !soundEnabled; renderTopbarPills(); if(soundEnabled) beepStart(); }

/* ===================== TOASTS ===================== */
function toast(msg, kind){
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' '+kind : '');
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(), 300); }, 3200);
}

/* ===================== TOPBAR PILLS ===================== */
function setSyncPill(text, isError){
  syncLabel = text;
  syncError = !!isError;
  const el = document.getElementById('pillSync');
  if(!el) return;
  el.innerHTML = icon('sync',13) + ' ' + syncLabel;
  el.className = 'pill ' + (syncError ? 'pill-red' : 'pill-green');
}
function renderTopbarPills(){
  const holder = document.getElementById('topbarPills');
  if(!holder) return;
  const produzindo = state.resources.filter(r=>r.status==='Produzindo').length;
  const parada = state.resources.filter(r=>r.status!=='Produzindo').length;
  let statusLabel = 'Sem células';
  if(state.resources.length){
    if(produzindo && parada) statusLabel = 'Produzindo / Parada';
    else if(produzindo) statusLabel = 'Produzindo';
    else statusLabel = 'Parada';
  }
  holder.innerHTML = `
    <div class="pill clickable" onclick="toggleSound()">${icon(soundEnabled?'volume':'volumeMute',14)} ${soundEnabled?'Som ativado':'Som desativado'}</div>
    <div class="pill ${syncError ? 'pill-red' : 'pill-green'}" id="pillSync">${icon('sync',13)} ${syncLabel}</div>
    <div class="pill pill-blue"><span class="pill-dot"></span>Status: ${statusLabel}</div>
    <div class="pill">${icon('clock',13)} Atualizado: ${fmtDateShort(lastSyncAt || nowBR())}</div>
  `;
}

/* ===================== NAV ===================== */
const NAV = [
  {id:'dashboard', module:'monitoramento', path:'/monitoramento', label:'Monitoramento', icn:'grid'},
  {id:'ordens', module:'ordens', path:'/ordens_producao', label:'Ordens de Produção', icn:'clipboard'},
  {id:'apontamento', module:'apontamento', path:'/apontamento', label:'Apontamento', icn:'clock'},
  {id:'recursos', module:'recursos', path:'/recursos', label:'Recursos', icn:'wrench'},
  {id:'cadastro', module:'engenharia', path:'/cadastro', label:'Cadastro', icn:'plus'},
  {id:'engenharia', module:'engenharia', path:'/engenharia', label:'Engenharia de Produto', icn:'gear'},
  {id:'funcionarios', module:'funcionarios', path:'/funcionarios', label:'Funcionários', icn:'users'},
  {id:'acompanhamento', module:'acompanhamento', path:'/acompanhamento', label:'Acompanhamento', icn:'search'},
  {id:'suporte', module:'suporte', path:'/suporte', label:'Suporte', icn:'message'},
  {id:'configuracoes', module:'configuracoes', path:'/configuracoes', label:'Configurações', icn:'sliders'}
];
const ROLE_LABELS = {
  visualizador:'Visualizador',
  operador:'Operador',
  administrador:'ADM',
  administrador_suporte:'Administrador suporte'
};
const SESSION_KEY = 'prodfy_session';
let sessionUser = null;
let supportTickets = [];
let notifications = [];
let notifOpen = false;
let unreadNotified = -1;
let returnPath = '';
function escapeHtml(value){
  return String(value == null ? '' : value).replace(/[&<>"']/g, function(char){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char];
  });
}
function readSessionCache(){
  try{ return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }catch(e){ return null; }
}
function rememberSession(user){
  if(!user || !sessionUser || user.id !== sessionUser.id) sectorHold = null;
  sessionUser = user;
  if(user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}
function moduleOf(id){
  const item = NAV.find(function(entry){ return entry.id === id; });
  return item ? item.module : id;
}
function permissionList(user){
  const all = [];
  NAV.filter(function(entry){ return entry.module !== 'configuracoes' && entry.module !== 'suporte'; }).forEach(function(entry){
    if(all.indexOf(entry.module) < 0) all.push(entry.module);
  });
  if(!user) return { view: [], edit: [] };
  const stored = user.permissions || {};
  const view = Array.isArray(stored.view) ? stored.view : all;
  const edit = Array.isArray(stored.edit) ? stored.edit : (user.role === 'visualizador' ? [] : all);
  return { view: view, edit: edit };
}
function canView(module){
  if(module === 'configuracoes') return canManageUsers();
  if(module === 'suporte') return true;
  return permissionList(sessionUser).view.indexOf(module) >= 0;
}
function canEdit(module){
  if(!sessionUser) return false;
  return permissionList(sessionUser).edit.indexOf(module) >= 0;
}
function canManageUsers(){
  return !!sessionUser && (sessionUser.role === 'administrador' || sessionUser.role === 'administrador_suporte');
}
function deny(module){
  if(canEdit(module)) return false;
  toast('Seu perfil não altera esta área.', 'error');
  return true;
}
function firstVisibleTab(){
  const found = NAV.find(function(entry){ return entry.module !== 'configuracoes' && canView(entry.module); });
  return found ? found.id : 'configuracoes';
}
function tabFromPath(pathname){
  const path = (pathname || '/').replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
  if(path === '/' || path === '/login') return null;
  const item = NAV.find(function(entry){ return entry.path === path; });
  return item ? item.id : null;
}
function applyAccess(){
  document.querySelectorAll('[data-edit]').forEach(function(el){
    const allowed = canEdit(el.getAttribute('data-edit'));
    if(el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') el.disabled = !allowed;
    else el.style.display = allowed ? '' : 'none';
  });
}
function navBadge(id){
  if(id==='ordens') return state.orders.filter(o=>!orderIsClosed(o)).length;
  if(id==='apontamento') return state.punches.filter(p=>p.status==='Aberto').length;
  if(id==='funcionarios') return state.employees.length;
  if(id==='recursos') return state.resources.length;
  if(id==='suporte') return supportTickets.filter(function(ticket){
    if(sessionUser && sessionUser.role === 'administrador_suporte') return ticket.status !== 'resolvido';
    return ticket.authorId === (sessionUser && sessionUser.id) && ticket.status !== 'resolvido';
  }).length;
  return 0;
}
function renderNav(){
  const nav = document.getElementById('navList');
  nav.innerHTML = NAV.filter(function(n){ return canView(n.module); }).map(n=>{
    const badge = navBadge(n.id);
    return `<div class="nav-item ${n.id===activeTab?'active':''}" onclick="setTab('${n.id}')">
      <span class="ic">${icon(n.icn,16)}</span><span class="nlabel">${n.label}</span>
      ${badge>0?`<span class="nav-badge">${badge}</span>`:''}
    </div>`;
  }).join('');
  const foot = document.getElementById('sessionFoot');
  if(foot && sessionUser){
    foot.innerHTML = `<div style="color:#fff; font-weight:700;">${escapeHtml(sessionUser.name)}</div><div>${escapeHtml(ROLE_LABELS[sessionUser.role] || sessionUser.role)}</div><button class="btn btn-sm" style="margin-top:8px;" type="button" onclick="logout()">Sair</button>`;
  }
  const version = document.getElementById('versionFoot');
  if(version) version.textContent = 'Versão ' + ((window.PRODIFY_CONFIG && window.PRODIFY_CONFIG.version) || '');
  renderCompanyFoot();
  if(sessionUser && !companyListLoaded){
    companyListLoaded = true;
    refreshCompanyFoot();
  }
  updateCsvActions();
}
let knownCompanies = [];
let companyListLoaded = false;
let companyListReady = false;
function companiesByName(list){
  return (list || []).slice().sort(function(a, b){
    return String(a.name || '').localeCompare(String(b.name || ''), 'pt', { sensitivity: 'base' });
  });
}
function renderCompanyFoot(){
  const foot = document.getElementById('companyFoot');
  if(!foot) return;
  if(!sessionUser){
    foot.innerHTML = '<b>Empresa:</b> —';
    return;
  }
  if(!companyListReady){
    foot.innerHTML = '<b>Empresa:</b> …';
    return;
  }
  if(sessionUser.role === 'administrador_suporte'){
    const selected = activeCompanyId();
    const options = knownCompanies.map(function(company){
      return `<option value="${company.id}" ${company.id===selected?'selected':''}>${escapeHtml(company.name)}${company.blocked ? ' — bloqueada' : ''}</option>`;
    }).join('');
    foot.innerHTML = `<b>Empresa</b><select class="company-switch" onchange="selectCompany(this.value)"><option value="" ${selected?'':'selected'} disabled>Escolha a empresa</option>${options}</select>`;
    return;
  }
  const mine = knownCompanies.find(function(company){ return company.id === sessionUser.companyId; });
  foot.innerHTML = `<b>Empresa:</b> ${escapeHtml(mine ? mine.name : 'Sem empresa')}`;
}
async function refreshCompanyFoot(){
  try{ knownCompanies = companiesByName((await accountApi('/api/companies')).data || []); }
  catch(e){ knownCompanies = []; }
  companyListReady = true;
  renderCompanyFoot();
}
function setTab(id, options){
  options = options || {};
  if(!canView(moduleOf(id))) id = firstVisibleTab();
  activeTab = id;
  renderNav();
  const meta = NAV.find(n=>n.id===id);
  document.getElementById('topTitle').textContent = meta.label;
  document.getElementById('topEyebrow').textContent = 'SOSystem · Soluções Inteligentes';
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  const panel = document.getElementById('panel-'+id);
  if(panel) panel.classList.add('active');
  closeSidebar();
  renderActiveTab();
  applyAccess();
  if(!options.quiet && meta && location.pathname !== meta.path){
    history[options.replace ? 'replaceState' : 'pushState']({ tab:id }, '', meta.path);
  }
}
function renderActiveTab(){
  renderTopbarPills();
  if(activeTab==='dashboard') renderDashboard();
  else if(activeTab==='ordens') renderOrdens();
  else if(activeTab==='apontamento') renderApontamento();
  else if(activeTab==='recursos') renderRecursos();
  else if(activeTab==='cadastro') renderCadastro();
  else if(activeTab==='engenharia') renderEngenharia();
  else if(activeTab==='funcionarios') renderFuncionarios();
  else if(activeTab==='acompanhamento') renderAcompanhamento();
  else if(activeTab==='suporte') renderSuporte();
  else if(activeTab==='configuracoes') renderConfiguracoes();
}
function openSidebar(){ document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarScrim').classList.add('open'); }
function closeSidebar(){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarScrim').classList.remove('open'); }
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }

/* ===================== HELPERS ===================== */
function employeeName(id){ const e = state.employees.find(x=>x.id===id); return e ? (e.nome+' '+e.sobrenome) : '—'; }
function productByCode(codigo){
  const key = String(codigo || '');
  return state.products.find(function(product){ return product.codigo === key || product.codigoErp === key; });
}
function recordLabel(item){ return String((item && (item.descricao || item.nome)) || '').trim(); }
function setorById(id){ return (state.setores || []).find(function(item){ return item.id === id; }) || null; }
function operacaoById(id){ return (state.operacoes || []).find(function(item){ return item.id === id; }) || null; }
function familyById(id){ return state.families.find(function(item){ return item.id === id; }) || null; }
function groupById(id){ return state.groups.find(function(item){ return item.id === id; }) || null; }
function itemSetorLabel(item){
  if(!item) return '';
  const setor = setorById(item.setorId);
  if(setor) return recordLabel(setor);
  if(item.setorNome) return String(item.setorNome);
  const group = groupById(item.grupoId);
  return group ? recordLabel(group) : '';
}
function routeFlags(rota){
  const names = (rota || []).map(function(step){
    const op = step && step.operacaoId ? operacaoById(step.operacaoId) : null;
    return String((op && recordLabel(op)) || (step && step.nome) || '').toLowerCase();
  }).join(' ');
  return { pintura: names.indexOf('pint') >= 0, montagem: names.indexOf('mont') >= 0 };
}
function nextNumericCode(list){
  let max = 0;
  (list || []).forEach(function(item){
    const number = parsePositiveInt(item && item.codigo);
    if(number > max) max = number;
  });
  return String(max + 1);
}
function suggestAlpha(list){
  return nextAlphaCode((list || []).map(function(item){ return item && item.codigo; }));
}
function orderLabel(order){ return (order && (order.numero || order.id)) || ''; }
function orderById(id){ return state.orders.find(o=>o.id===id || o.numero===id); }
function punchOrderLabel(punch){ const order = orderById(punch && punch.ordemId); return order ? orderLabel(order) : ((punch && punch.ordemId) || ''); }
function resourceById(id){ return state.resources.find(r=>r.id===id); }
function orderProducedQty(orderId){ return state.punches.filter(p=>p.ordemId===orderId).reduce((s,p)=>s+(Number(p.quantidadeProduzida)||0), 0); }
function orderProgress(order){
  const items = orderItems(order);
  if(orderUsesRoute(order)){
    const totals = items.reduce(function(sum, item){
      const qty = itemPlanned(item);
      let planned = qty;
      let done = Math.min(itemProduced(item), qty);
      if(item.pintura){ planned += qty; done += Math.min(itemPainted(item), qty); }
      if(item.montagem){ planned += qty; done += Math.min(itemAssembled(item), qty); }
      return { planned: sum.planned + planned, done: sum.done + done };
    }, { planned: 0, done: 0 });
    const pct = totals.planned > 0 ? Math.round((totals.done / totals.planned) * 1000) / 10 : 0;
    return { planned: totals.planned, produced: totals.done, pct: pct };
  }
  const planned = items.reduce(function(sum, item){ return sum + (Number(item.quantidade) || 0); }, 0) || Number(order.quantidadePlanejada) || 0;
  const marked = items.reduce(function(sum, item){ return sum + (Number(item.produzida) || 0); }, 0);
  const produced = Math.max(orderProducedQty(order.id), marked);
  const pct = planned > 0 ? Math.round((produced / planned) * 1000) / 10 : 0;
  return { planned: planned, produced: produced, pct: pct };
}
function orderScrapQty(orderId){ return state.punches.filter(p=>p.ordemId===orderId).reduce((s,p)=>s+(Number(p.quantidadeRefugada)||0), 0); }
const ORDER_STATUSES = ['Não iniciado','Iniciado/Parado','Bloqueado','Finalizado/Em Pintura','Finalizado/Em montagem','Finalizado','Encaminhado Expedição'];
function normalizeOrderStatus(status){
  if(status==='Aberta') return 'Não iniciado';
  if(status==='Em Produção') return 'Iniciado/Parado';
  if(status==='Concluída') return 'Finalizado';
  return ORDER_STATUSES.indexOf(status) >= 0 ? status : 'Não iniciado';
}
function orderIsClosed(order){
  const status = normalizeOrderStatus(order && order.status);
  return status === 'Finalizado' || status === 'Encaminhado Expedição';
}
function orderStatusTone(status){
  const label = normalizeOrderStatus(status);
  if(label === 'Não iniciado') return 'gray';
  if(label === 'Bloqueado') return 'red';
  if(orderIsClosed({status:label})) return 'green';
  return 'amber';
}
function orderStatusSelect(order){
  const current = normalizeOrderStatus(order.status);
  const options = ORDER_STATUSES.map(function(status){
    return `<option value="${escapeHtml(status)}" ${status===current?'selected':''}>${escapeHtml(status)}</option>`;
  }).join('');
  const detail = (current === 'Iniciado/Parado' || current === 'Bloqueado') && order.motivo
    ? `<div style="font-size:10.5px; color:var(--text-faint); margin-top:4px;">${escapeHtml(order.motivo)}</div>`
    : '';
  return `<select class="status-select tone-${orderStatusTone(current)}" data-edit="ordens" onchange="changeOrderStatus('${order.id}', this.value, this)">${options}</select>${detail}`;
}
function orderStatusBadge(status){
  const label = normalizeOrderStatus(status);
  const tone = label === 'Não iniciado' ? 'badge-gray' : (label === 'Bloqueado' ? 'badge-red' : (orderIsClosed({status:label}) ? 'badge-green' : 'badge-amber'));
  const extra = label === 'Iniciado/Parado' || label === 'Bloqueado' ? '' : '';
  return '<span class="badge '+tone+'"><span class="dot"></span>'+escapeHtml(label)+extra+'</span>';
}
function orderItems(order){
  if(order.itens && order.itens.length) return order.itens;
  return [{ id: order.id + '-item', descricao: order.descricao || order.codigo, grupoId: order.grupoId || '', familiaId: order.familiaId || '', quantidade: Number(order.quantidadePlanejada)||0, produzida: orderProducedQty(order.id) }];
}
function groupProgress(order){
  const buckets = {};
  orderItems(order).forEach(function(item){
    const name = itemSetorLabel(item) || 'Sem setor';
    if(!buckets[name]) buckets[name] = { quantidade: 0, produzida: 0 };
    buckets[name].quantidade += Number(item.quantidade) || 0;
    buckets[name].produzida += Number(item.produzida) || 0;
  });
  return Object.keys(buckets).map(function(name){
    const row = buckets[name];
    const pct = row.quantidade > 0 ? Math.round((row.produzida / row.quantidade) * 1000) / 10 : 0;
    return { name: name, pct: pct, quantidade: row.quantidade, produzida: row.produzida };
  });
}
function itemPlanned(item){ return Number(item && item.quantidade) || 0; }
function itemProduced(item){ return Number(item && item.produzida) || 0; }
function itemPainted(item){ return Number(item && item.pintada) || 0; }
function itemAssembled(item){ return Number(item && item.montada) || 0; }
function orderUsesRoute(order){
  return !!(order && Array.isArray(order.equipamentos) && order.equipamentos.length);
}
function equipmentFabricated(item, order){
  if(!order || !item.equipamentoId) return itemProduced(item) >= itemPlanned(item);
  return orderItems(order).filter(function(other){ return other.equipamentoId === item.equipamentoId; }).every(function(other){
    return itemProduced(other) >= itemPlanned(other);
  });
}
function itemOpenStage(item, order){
  const qty = itemPlanned(item);
  if(qty <= 0) return null;
  const rota = Array.isArray(item.rota) ? item.rota : [];
  if(rota.length){
    for(let index = 0; index < rota.length; index++){
      const step = rota[index];
      const done = Number(step.feita) || 0;
      if(done < qty) return { key: 'etapa', index: index, nome: step.nome || step.setorNome || 'Operação', falta: qty - done };
    }
  } else if(itemProduced(item) < qty){
    return { key: 'fabricacao', nome: itemSetorLabel(item) || 'Fabricação', falta: qty - itemProduced(item) };
  }
  if(!equipmentFabricated(item, order)) return null;
  if(item.pintura && itemPainted(item) < qty) return { key: 'pintura', nome: 'Pintura', falta: qty - itemPainted(item) };
  if(item.montagem && itemAssembled(item) < qty) return { key: 'montagem', nome: 'Montagem', falta: qty - itemAssembled(item) };
  return null;
}
function applyItemQty(item, qty, order){
  let left = Math.max(0, Number(qty) || 0);
  while(left > 0){
    const stage = itemOpenStage(item, order);
    if(!stage){
      item.produzida = itemProduced(item) + left;
      return;
    }
    const take = Math.min(left, stage.falta);
    if(take <= 0) return;
    if(stage.key === 'etapa'){
      const step = item.rota[stage.index];
      step.feita = (Number(step.feita) || 0) + take;
      const planned = itemPlanned(item);
      const finished = item.rota.every(function(entry){ return (Number(entry.feita) || 0) >= planned; });
      item.produzida = finished ? planned : Math.min.apply(null, item.rota.map(function(entry){ return Number(entry.feita) || 0; }));
    } else if(stage.key === 'fabricacao') item.produzida = itemProduced(item) + take;
    else if(stage.key === 'pintura') item.pintada = itemPainted(item) + take;
    else item.montada = itemAssembled(item) + take;
    left -= take;
  }
}
function routeStatus(order){
  const items = orderItems(order);
  if(!items.length) return 'Não iniciado';
  const any = items.some(function(item){ return itemProduced(item) > 0 || itemPainted(item) > 0 || itemAssembled(item) > 0; });
  const fabDone = items.every(function(item){ return itemProduced(item) >= itemPlanned(item); });
  const paintLeft = items.some(function(item){ return item.pintura && itemPainted(item) < itemPlanned(item); });
  const assemblyLeft = items.some(function(item){ return item.montagem && itemAssembled(item) < itemPlanned(item); });
  if(fabDone && !paintLeft && !assemblyLeft && any) return 'Encaminhado Expedição';
  if(fabDone && paintLeft) return 'Finalizado/Em Pintura';
  if(fabDone && !paintLeft && assemblyLeft) return 'Finalizado/Em montagem';
  return 'Não iniciado';
}
function routeHint(order){
  if(!orderUsesRoute(order)) return '';
  const status = routeStatus(order);
  if(status === 'Encaminhado Expedição') return '100% fabricado, pintado e montado';
  if(status === 'Finalizado/Em Pintura') return 'Fabricação pronta · pintura em andamento';
  if(status === 'Finalizado/Em montagem') return 'Pintura pronta · montagem em andamento';
  const names = Array.from(new Set(orderItems(order).map(function(item){ return itemOpenStage(item, order); }).filter(Boolean).map(function(stage){ return stage.nome; })));
  return names.length ? ('Nos setores: ' + names.join(', ')) : '';
}
function recalcOrderStatus(order){
  const current = normalizeOrderStatus(order.status);
  if(!orderUsesRoute(order) || current === 'Bloqueado' || current === 'Iniciado/Parado'){
    order.status = current;
    return;
  }
  order.status = routeStatus(order);
}
function recalcAllOrderStatuses(){ state.orders.forEach(recalcOrderStatus); }
function isOnVacation(emp){
  if(!emp.ferias || !emp.ferias.inicio) return false;
  const today = todayISODate();
  if(today < emp.ferias.inicio) return false;
  if(emp.ferias.fim && today > emp.ferias.fim) return false;
  return true;
}
function employeeMachines(empId){
  return state.resources.filter(function(resource){ return (resource.funcionarios || []).indexOf(empId) >= 0; });
}
function employeeLocation(empId){
  const names = employeeMachines(empId).map(function(resource){ return resource.nome; });
  return names.length ? names.join(', ') : null;
}
function syncEmployeeMachines(empId, resourceIds){
  state.resources.forEach(function(resource){
    if(!Array.isArray(resource.funcionarios)) resource.funcionarios = [];
    const linked = resource.funcionarios.indexOf(empId) >= 0;
    const should = resourceIds.indexOf(resource.id) >= 0;
    if(should && !linked) resource.funcionarios.push(empId);
    if(!should && linked) resource.funcionarios = resource.funcionarios.filter(function(id){ return id !== empId; });
  });
}
function renderGroupChoices(containerId, selectedIds){
  const box = document.getElementById(containerId);
  if(!box) return;
  if(!state.groups.length){
    box.innerHTML = '<div class="section-sub">Nenhum grupo cadastrado.</div>';
    return;
  }
  box.innerHTML = state.groups.map(function(group){
    const checked = selectedIds.indexOf(group.id) >= 0 ? 'checked' : '';
    return `<label class="checkbox-row" style="margin:0 12px 8px 0;"><input type="checkbox" value="${group.id}" ${checked}>${escapeHtml(group.nome)}</label>`;
  }).join('');
}
function resourceGroupIds(resource){
  if(resource.grupos && resource.grupos.length) return resource.grupos.slice();
  if(!resource.setor || resource.setor === 'Geral') return [];
  return String(resource.setor).split(',').map(function(name){
    const group = state.groups.find(function(item){ return item.nome === name.trim(); });
    return group ? group.id : '';
  }).filter(Boolean);
}
function resourceGroupNames(resource){
  const setor = setorById(resource.setorId);
  if(setor) return [recordLabel(setor)];
  if(resource.setor && resource.setor !== 'Geral') return String(resource.setor).split(',').map(function(name){ return name.trim(); }).filter(Boolean);
  return (resource.grupos || []).map(function(id){
    const group = state.groups.find(function(item){ return item.id === id; });
    return group ? recordLabel(group) : '';
  }).filter(Boolean);
}
function orderSector(order){
  return Array.from(new Set(orderItems(order).map(itemSetorLabel).filter(Boolean))).join(', ');
}
function renderMachineChoices(containerId, selectedIds){
  const box = document.getElementById(containerId);
  if(!box) return;
  if(!state.resources.length){
    box.innerHTML = '<div class="section-sub">Nenhuma máquina cadastrada.</div>';
    return;
  }
  box.innerHTML = state.resources.map(function(resource){
    const checked = selectedIds.indexOf(resource.id) >= 0 ? 'checked' : '';
    return `<label class="checkbox-row" style="margin:0 12px 8px 0;"><input type="checkbox" value="${resource.id}" ${checked}>${escapeHtml(resource.nome)}</label>`;
  }).join('');
}

/* ===================== RENDER SHELL ===================== */
function renderShell(){
  document.getElementById('content').innerHTML = `
    <div class="tab-panel" id="panel-dashboard"></div>
    <div class="tab-panel" id="panel-ordens"></div>
    <div class="tab-panel" id="panel-apontamento"></div>
    <div class="tab-panel" id="panel-recursos"></div>
    <div class="tab-panel" id="panel-cadastro"></div>
    <div class="tab-panel" id="panel-engenharia"></div>
    <div class="tab-panel" id="panel-funcionarios"></div>
    <div class="tab-panel" id="panel-acompanhamento"></div>
    <div class="tab-panel" id="panel-suporte"></div>
    <div class="tab-panel" id="panel-configuracoes"></div>
  `;
  document.getElementById('panel-'+activeTab).classList.add('active');
}

/* ===================== DASHBOARD (Monitoramento) ===================== */
function renderDashboard(){
  recalcAllOrderStatuses();
  const el = document.getElementById('panel-dashboard');
  const totalCelulas = state.resources.length;
  const produzindo = state.resources.filter(r=>r.status==='Produzindo').length;
  const emAndamento = state.orders.filter(o=>!orderIsClosed(o) && normalizeOrderStatus(o.status)!=='Não iniciado').length;
  const todaysPunchesKpi = state.punches.filter(p=>isTodayBR(p.inicio));
  const producedKpi = todaysPunchesKpi.reduce((s,p)=>s+(Number(p.quantidadeProduzida)||0),0);
  const scrapKpi = todaysPunchesKpi.reduce((s,p)=>s+(Number(p.quantidadeRefugada)||0),0);
  const scrapRateKpi = (producedKpi+scrapKpi) > 0 ? (scrapKpi/(producedKpi+scrapKpi)*100) : 0;

  el.innerHTML = `
    <div class="section-title">Monitoramento da Produção</div>
    <div class="section-sub">Visão geral das células, funcionários alocados e indicadores — ${fmtDateShort(nowBR())}</div>

    <div class="kpi-row">
      <div class="kpi-card kpi-blue"><div class="kpi-icon">${icon('building',19)}</div><div class="kpi-label">Células</div><div class="kpi-value">${totalCelulas}</div><div class="kpi-note">recursos monitorados</div></div>
      <div class="kpi-card kpi-green"><div class="kpi-icon">${icon('play',19)}</div><div class="kpi-label">Produzindo</div><div class="kpi-value">${produzindo}</div><div class="kpi-note">células em produção</div></div>
      <div class="kpi-card kpi-purple"><div class="kpi-icon">${icon('clipboard',19)}</div><div class="kpi-label">Em Andamento</div><div class="kpi-value">${emAndamento}</div><div class="kpi-note">ordens em produção</div></div>
      <div class="kpi-card kpi-pink"><div class="kpi-icon">${icon('alertTriangle',19)}</div><div class="kpi-label">Taxa de Refugo</div><div class="kpi-value">${scrapRateKpi.toFixed(1)}<span style="font-size:16px;">%</span></div><div class="kpi-note">${scrapKpi} peças hoje</div></div>
    </div>

    <div class="card" style="margin-bottom:18px;">
      <div class="filter-bar">
        <div class="field grow">
          <label>Buscar célula / funcionário</label>
          <input id="dashSearchInput" placeholder="Busque por célula, grupo ou funcionário" value="${dashSearch}" oninput="dashSearch=this.value; renderDashLists();">
        </div>
        <div class="field fixed">
          <label>Grupo</label>
          <select id="dashSetorSelect" onchange="dashSetor=this.value; renderDashLists();"></select>
        </div>
        <button class="btn btn-ghost" onclick="clearDashFilters()">Limpar filtros</button>
        <button class="btn btn-danger" data-edit="monitoramento" onclick="zerarAlocacoes()">Zerar</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:18px;">
      <div class="toolbar" style="margin-bottom:10px;">
        <div>
          <div class="section-title" style="font-size:15px; margin-bottom:2px;">${icon('users',17)} Funcionários</div>
          <div class="section-sub" style="margin-bottom:0;" id="empCountLabel"></div>
        </div>
        <button class="btn btn-primary btn-sm" data-edit="funcionarios" onclick="openEmployeeModal()">${icon('plus',13)} Adicionar Funcionário</button>
      </div>
      <div class="emp-scroll" id="empScrollList"></div>
    </div>

    <div class="toolbar">
      <div class="section-title" style="font-size:15px; margin-bottom:0;">${icon('building',17)} Células de Produção</div>
      <button class="btn btn-primary btn-sm" data-edit="recursos" onclick="openResourceModal()">${icon('plus',13)} Nova Célula</button>
    </div>
    <div class="grid grid-3" id="resourceGrid" style="margin-bottom:20px;"></div>

    <div class="grid grid-2" style="align-items:stretch;">
      <div class="card">
        <div class="section-title" style="font-size:14px;">Ranking de Recursos por Tempo Apontado</div>
        <div class="section-sub">Máquinas/recursos com mais tempo total registrado</div>
        <div id="rankingHolder"></div>
      </div>
      <div class="card">
        <div class="section-title" style="font-size:14px;">Produção por Hora (hoje)</div>
        <div class="section-sub">Peças concluídas, por hora do dia (BR)</div>
        <div class="hbar-chart" id="hbarHolder"></div>
      </div>
    </div>

    <div class="grid grid-3" style="align-items:stretch; margin-top:18px;">
      <div class="card">
        <div class="section-title" style="font-size:14px;">Aderência ao Plano</div>
        <div class="section-sub">Tempo padrão ÷ tempo real apontado (hoje)</div>
        <div id="aderenciaHolder"></div>
      </div>
      <div class="card">
        <div class="section-title" style="font-size:14px;">Ordens por Status</div>
        <div class="section-sub">Distribuição geral das ordens</div>
        <div id="statusDonutHolder"></div>
      </div>
      <div class="card">
        <div class="section-title" style="font-size:14px;">Máquina Parada (hoje)</div>
        <div class="section-sub">Sem apontamento aberto desde o 1º registro</div>
        <div id="paradaHolder"></div>
      </div>
    </div>
  `;

  populateSetorSelect();
  renderDashLists();
  renderRankingAndCharts();
}

function populateSetorSelect(){
  const sel = document.getElementById('dashSetorSelect');
  if(!sel) return;
  const names = (state.setores || []).map(recordLabel).filter(Boolean);
  state.resources.forEach(function(resource){
    resourceGroupNames(resource).forEach(function(name){
      if(names.indexOf(name) < 0) names.push(name);
    });
  });
  names.sort();
  sel.innerHTML = ['Todos', ...names].map(s=>`<option value="${s}" ${s===dashSetor?'selected':''}>${s}</option>`).join('');
}
function clearDashFilters(){
  dashSearch=''; dashSetor='Todos';
  document.getElementById('dashSearchInput').value='';
  document.getElementById('dashSetorSelect').value='Todos';
  renderDashLists();
}
async function zerarAlocacoes(){
  if(deny('monitoramento')) return;
  if(!confirm('Isso vai remover todos os funcionários alocados de todas as células. Confirmar?')) return;
  state.resources.forEach(r=>r.funcionarios=[]);
  await persist();
  renderDashLists();
  toast('Alocações zeradas.', 'success');
}
function renderDashLists(){ renderEmpScroll(); renderResourceGrid(); applyAccess(); }
function renderEmpScroll(){
  const holder = document.getElementById('empScrollList');
  if(!holder) return;
  const q = dashSearch.trim().toLowerCase();
  const list = state.employees.filter(e => !q || (e.nome+' '+e.sobrenome).toLowerCase().includes(q) || e.funcao.toLowerCase().includes(q) || (e.numero||'').includes(q) || String(e.codigo || '').toLowerCase().includes(q));
  const onVacationCount = state.employees.filter(isOnVacation).length;
  document.getElementById('empCountLabel').textContent = `${state.employees.length - onVacationCount} disponíveis · ${onVacationCount} férias`;
  holder.innerHTML = list.length ? list.map(e=>{
    const vac = isOnVacation(e);
    const color = colorForName(e.nome+e.sobrenome);
    if(vac){
      return `<div class="emp-card vacation">
        <div class="emp-tag" style="background:#FBDCDB; color:var(--red-dark);">Férias</div>
        ${employeeAvatarHTML(e,'emp-avatar')}
        <div class="emp-name">${e.nome.toUpperCase()} ${e.sobrenome.toUpperCase()}</div>
        <div class="emp-vac-dates">Nº ${e.numero||'—'} · ${e.ferias.fim ? (brDate(e.ferias.inicio)+' a '+brDate(e.ferias.fim)) : ('a partir de '+brDate(e.ferias.inicio))}</div>
      </div>`;
    }
    const loc = employeeLocation(e.id);
    return `<div class="emp-card" draggable="true" ondragstart="onEmpDragStart(event,'${e.id}')" title="Arraste para uma célula">
      <div class="emp-tag" style="background:${e.vinculo==='Terceiro'?'#FEF3E0':'#EAF1FE'}; color:${e.vinculo==='Terceiro'?'var(--amber-dark)':'var(--blue-dark)'};">${e.vinculo}</div>
      ${employeeAvatarHTML(e,'emp-avatar')}
      <div class="emp-name">${e.nome.toUpperCase()} ${e.sobrenome.toUpperCase()}</div>
      <div class="emp-turno">Nº ${e.numero||'—'} · ${e.turno}</div>
      ${loc?`<div class="emp-vac-dates" style="color:var(--blue-dark);">em ${loc}</div>`:''}
    </div>`;
  }).join('') : `<div class="empty-state" style="padding:20px;">Nenhum funcionário encontrado.</div>`;
}
function renderResourceGrid(){
  const holder = document.getElementById('resourceGrid');
  if(!holder) return;
  const q = dashSearch.trim().toLowerCase();
  const list = state.resources.filter(r=>{
    const names = resourceGroupNames(r);
    const matchesSearch = !q || r.nome.toLowerCase().includes(q) || r.descricao.toLowerCase().includes(q) || names.join(' ').toLowerCase().includes(q);
    const matchesSetor = dashSetor==='Todos' || names.indexOf(dashSetor) >= 0;
    return matchesSearch && matchesSetor;
  });
  holder.innerHTML = list.length ? list.map(r=>{
    const chips = r.funcionarios.map(empId=>{
      const e = state.employees.find(x=>x.id===empId);
      if(!e) return '';
      return `<div class="chip">${employeeAvatarHTML(e,'chip-avatar')}${e.nome}<span class="chip-x" data-edit="recursos" onclick="unassignEmployee('${r.id}','${empId}')">×</span></div>`;
    }).join('');
    return `<div class="res-card" id="rescard-${r.id}" ondragover="event.preventDefault(); this.classList.add('drop-hover');" ondragleave="this.classList.remove('drop-hover');" ondrop="onResourceDrop(event,'${r.id}')">
      <div class="res-head">
        <div class="res-code">${r.nome}</div>
        <div style="display:flex; align-items:center; gap:2px;">
          <button class="res-icon-btn" data-edit="recursos" title="Editar célula" onclick="openResourceModal('${r.id}')">${icon('edit',14)}</button>
          <button class="res-icon-btn danger" data-edit="recursos" title="Remover célula" onclick="removeResource('${r.id}')">${icon('trash',14)}</button>
        </div>
      </div>
      <div class="res-desc">${r.descricao}</div>
      <div class="res-tags">
        ${resourceGroupNames(r).length ? resourceGroupNames(r).map(function(name){ return `<span class="badge badge-gray">${escapeHtml(name)}</span>`; }).join('') : ''}
        <span class="badge badge-gray">${r.funcionarios.length} funcionário(s)</span>
      </div>
      <select class="status-select st-${r.status}" data-edit="recursos" onchange="changeResourceStatus('${r.id}', this.value)">
        <option ${r.status==='Produzindo'?'selected':''}>Produzindo</option>
        <option ${r.status==='Parada'?'selected':''}>Parada</option>
        <option ${r.status==='Manutenção'?'selected':''}>Manutenção</option>
      </select>
      <div style="height:10px;"></div>
      <div class="dropzone ${chips?'has-people':''}">
        ${chips || '<span class="dropzone-hint">Arraste funcionários para esta célula</span>'}
      </div>
      <button class="btn btn-ghost btn-block btn-sm" data-edit="recursos" onclick="openAssignModal('${r.id}')">${icon('plus',13)} Adicionar funcionário</button>
    </div>`;
  }).join('') : `<div class="empty-state" style="grid-column:1/-1;"><div class="ic">${icon('building',30)}</div>Nenhuma célula encontrada. Clique em "Nova Célula" para começar.</div>`;
}

function renderRankingAndCharts(){
  const recMap = {};
  state.punches.forEach(p=>{
    const end = p.fim ? p.fim : nowISO();
    recMap[p.recurso] = (recMap[p.recurso]||0) + minutesBetween(p.inicio, end);
  });
  const recRanking = Object.entries(recMap).sort((a,b)=>b[1]-a[1]);
  const rHolder = document.getElementById('rankingHolder');
  const maxRec = recRanking.length ? recRanking[0][1] : 1;
  if(rHolder) rHolder.innerHTML = recRanking.length ? recRanking.slice(0,6).map((r,i)=>`
    <div class="rank-row">
      <div class="rank-num">${i+1}</div>
      <div class="rank-name">${r[0]}</div>
      <div class="rank-val">${r[1].toFixed(0)} min</div>
      <div class="rank-bar-track"><div class="rank-bar-fill" style="width:${Math.max(4,(r[1]/maxRec)*100)}%;"></div></div>
    </div>`).join('')
    : '<div class="empty-state" style="padding:24px;">Nenhum apontamento registrado ainda.</div>';

  const todaysPunches = state.punches.filter(p=>isTodayBR(p.inicio));
  const closedToday = todaysPunches.filter(p=>p.status==='Fechado');
  const hourBuckets = new Array(24).fill(0);
  closedToday.forEach(p=>{
    const h = new Date(new Date(p.fim).toLocaleString('en-US',{timeZone:'America/Sao_Paulo'})).getHours();
    hourBuckets[h] += Number(p.quantidadeProduzida)||0;
  });
  const maxBucket = Math.max(1, ...hourBuckets);
  const activeHours = hourBuckets.map((v,i)=>({h:i,v})).filter(x=>x.v>0);
  const hoursToShow = activeHours.length ? activeHours : hourBuckets.map((v,i)=>({h:i,v})).slice(6,19);
  const hb = document.getElementById('hbarHolder');
  if(hb) hb.innerHTML = hoursToShow.map(x=>`<div class="hbar-col"><div class="hbar" style="height:${Math.max(3,(x.v/maxBucket)*120)}px;" title="${x.v} peças"></div><div class="hbar-label">${String(x.h).padStart(2,'0')}h</div></div>`).join('');

  const tempoRealizadoHoje = closedToday.reduce((s,p)=>s+minutesBetween(p.inicio,p.fim),0);
  const tempoEstimadoProduzidoHoje = closedToday.reduce((s,p)=>{
    const order = orderById(p.ordemId);
    const prod = order ? productByCode(order.codigo) : null;
    return s + ((prod?prod.tempoFabricacaoMin:0) * (Number(p.quantidadeProduzida)||0));
  },0);
  const aderencia = tempoRealizadoHoje > 0 ? Math.min(100, (tempoEstimadoProduzidoHoje/tempoRealizadoHoje)*100) : 0;
  const ah = document.getElementById('aderenciaHolder');
  if(ah) ah.innerHTML = `
    <div class="gauge-wrap">${gaugeSVG(aderencia, 'gaugeAderencia')}</div>
    <div class="kpi-note" style="color:var(--text-faint); text-align:center; margin-top:6px;">Padrão: ${tempoEstimadoProduzidoHoje.toFixed(0)} min · Real: ${tempoRealizadoHoje.toFixed(0)} min</div>`;

  const allResources = Array.from(new Set(state.punches.map(p=>p.recurso)));
  let paradaMin = 0;
  allResources.forEach(r=>{
    const rp = todaysPunches.filter(p=>p.recurso===r);
    if(!rp.length) return;
    const firstStart = rp.reduce((min,p)=> new Date(p.inicio) < new Date(min) ? p.inicio : min, rp[0].inicio);
    const windowMin = minutesBetween(firstStart, nowISO());
    const busyMin = rp.reduce((s,p)=> s + minutesBetween(p.inicio, p.fim || nowISO()), 0);
    paradaMin += Math.max(0, windowMin - busyMin);
  });
  const ph = document.getElementById('paradaHolder');
  if(ph) ph.innerHTML = `<div style="font-size:32px; font-weight:800; color:#FF4D6A;">${paradaMin.toFixed(0)}<span style="font-size:13px; color:var(--text-muted); font-weight:600; margin-left:4px;">min acumulados</span></div>
    <div class="kpi-note" style="color:var(--text-faint); margin-top:6px;">somado entre ${allResources.length} recurso(s) monitorado(s)</div>`;

  const dh = document.getElementById('statusDonutHolder');
  if(dh){
    const abertas = state.orders.filter(o=>normalizeOrderStatus(o.status)==='Não iniciado').length;
    const andamento = state.orders.filter(o=>!orderIsClosed(o) && normalizeOrderStatus(o.status)!=='Não iniciado').length;
    const concluidas = state.orders.filter(orderIsClosed).length;
    dh.innerHTML = donutSVG(abertas, andamento, concluidas);
  }
}
function gaugeSVG(pct, gradId){
  const r = 52, cx=64, cy=64, c = 2*Math.PI*r;
  const offset = c - (Math.max(0,Math.min(100,pct))/100)*c;
  return `<svg width="150" height="150" viewBox="0 0 128 128">
    <defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F8CFF"/><stop offset="55%" stop-color="#8B5CF6"/><stop offset="100%" stop-color="#FF4D9E"/>
    </linearGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="13"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#${gradId})" stroke-width="13" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}" transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy+9}" text-anchor="middle" font-size="27" font-weight="800" fill="var(--text)" font-family="inherit">${pct.toFixed(0)}%</text>
  </svg>`;
}
function donutSVG(abertas, andamento, concluidas){
  const total = abertas+andamento+concluidas;
  const colors = { aberta:'#818CF8', andamento:'#FFB020', concluida:'#22C168' };
  let seg = '';
  if(total>0){
    const p1 = abertas/total*100;
    const p2 = andamento/total*100;
    seg = `conic-gradient(${colors.aberta} 0% ${p1}%, ${colors.andamento} ${p1}% ${p1+p2}%, ${colors.concluida} ${p1+p2}% 100%)`;
  } else {
    seg = `conic-gradient(var(--surface-3) 0% 100%)`;
  }
  return `
    <div class="donut-row">
      <div class="donut-outer" style="background:${seg};">
        <div class="donut-inner"><div class="donut-total">${total}</div><div class="donut-sub">ordens</div></div>
      </div>
      <div class="donut-legend">
        <div class="donut-legend-row"><span class="donut-legend-dot" style="background:${colors.aberta};"></span>Não iniciado<span class="donut-legend-val">${abertas}</span></div>
        <div class="donut-legend-row"><span class="donut-legend-dot" style="background:${colors.andamento};"></span>Em andamento<span class="donut-legend-val">${andamento}</span></div>
        <div class="donut-legend-row"><span class="donut-legend-dot" style="background:${colors.concluida};"></span>Finalizado<span class="donut-legend-val">${concluidas}</span></div>
      </div>
    </div>`;
}

/* --- resource CRUD & assignment --- */
function fillResourceSetor(selectedId){
  const select = document.getElementById('resSetor');
  if(!select) return;
  const options = (state.setores || []).map(function(setor){
    return `<option value="${setor.id}" ${setor.id === selectedId ? 'selected' : ''}>${escapeHtml(recordLabel(setor))}</option>`;
  }).join('');
  select.innerHTML = `<option value="">Selecione o setor</option>` + options;
}
function openResourceModal(id){
  if(deny('recursos')) return;
  document.getElementById('resId').value = id || '';
  if(id){
    const r = resourceById(id);
    document.getElementById('resModalTitle').textContent = 'Editar Máquina';
    document.getElementById('resNome').value = r.codigo || r.nome;
    document.getElementById('resDescricao').value = r.descricao;
    document.getElementById('resRestricao').value = r.restricao || '';
    fillResourceSetor(r.setorId || '');
  } else {
    document.getElementById('resModalTitle').textContent = 'Nova Máquina';
    document.getElementById('resNome').value = suggestAlpha(state.resources);
    document.getElementById('resDescricao').value = '';
    document.getElementById('resRestricao').value = '';
    fillResourceSetor('');
  }
  openModal('modalResource');
}
async function saveResource(){
  if(deny('recursos')) return;
  const id = document.getElementById('resId').value;
  let nome = document.getElementById('resNome').value.trim().toUpperCase();
  const descricao = document.getElementById('resDescricao').value.trim();
  const restricao = document.getElementById('resRestricao').value.trim();
  const setorId = document.getElementById('resSetor') ? document.getElementById('resSetor').value : '';
  const setorRecord = setorById(setorId);
  const setor = setorRecord ? recordLabel(setorRecord) : '';
  if(!nome) nome = suggestAlpha(state.resources);
  if(!descricao){ toast('Preencha a descrição.', 'error'); return; }
  if(!setorId){ toast('Escolha o setor da máquina.', 'error'); return; }
  if(state.resources.some(function(resource){ return resource.id !== id && String(resource.codigo || resource.nome).toLowerCase() === nome.toLowerCase(); })){
    toast('Já existe uma máquina com este código.', 'error');
    return;
  }
  if(id){ Object.assign(resourceById(id), {codigo:nome, nome:nome, descricao:descricao, setor:setor, setorId:setorId, restricao:restricao, grupos:[]}); }
  else{ state.resources.push({id:uid(), codigo:nome, nome:nome, descricao:descricao, setor:setor, setorId:setorId, restricao:restricao, status:'Parada', funcionarios:[], operacoes:[], grupos:[]}); }
  await persist();
  closeModal('modalResource');
  populateSetorSelect();
  renderDashLists();
  renderRecursosTable();
  toast('Célula salva com sucesso.', 'success');
}
async function removeResource(id){
  if(deny('recursos')) return;
  if(!confirm('Remover esta célula? Os funcionários alocados serão liberados.')) return;
  state.resources = state.resources.filter(r=>r.id!==id);
  await persist();
  populateSetorSelect();
  renderDashLists();
  renderRecursosTable();
}
async function changeResourceStatus(id, status){
  if(deny('recursos')) return;
  resourceById(id).status = status;
  await persist();
  renderResourceGrid();
  renderTopbarPills();
}
function onEmpDragStart(ev, empId){ ev.dataTransfer.setData('text/plain', empId); }
async function onResourceDrop(ev, resId){
  if(deny('recursos')) return;
  ev.preventDefault();
  ev.currentTarget.classList.remove('drop-hover');
  const empId = ev.dataTransfer.getData('text/plain');
  if(!empId) return;
  await assignEmployeeToResource(resId, empId);
}
async function assignEmployeeToResource(resId, empId){
  if(deny('recursos')) return;
  const emp = state.employees.find(e=>e.id===empId);
  if(!emp){ return; }
  if(isOnVacation(emp)){ toast('Este funcionário está de férias.', 'error'); return; }
  const target = resourceById(resId);
  if(!target) return;
  if(target.funcionarios.indexOf(empId) >= 0){
    toast(emp.nome + ' já está em ' + target.nome + '.', 'success');
    return;
  }
  target.funcionarios.push(empId);
  await persist();
  renderDashLists();
  toast(emp.nome + ' alocado em ' + target.nome + '.', 'success');
}
async function unassignEmployee(resId, empId){
  if(deny('recursos')) return;
  const r = resourceById(resId);
  r.funcionarios = r.funcionarios.filter(id=>id!==empId);
  await persist();
  renderDashLists();
}
function openAssignModal(resId){
  if(deny('recursos')) return;
  document.getElementById('assignResId').value = resId;
  const sel = document.getElementById('assignEmpSelect');
  const available = state.employees.filter(e=>!isOnVacation(e));
  if(!available.length){ toast('Nenhum funcionário disponível para alocar.', 'error'); return; }
  sel.innerHTML = available.map(e=>`<option value="${e.id}">${e.nome} ${e.sobrenome}${employeeLocation(e.id)?' (em '+employeeLocation(e.id)+')':''}</option>`).join('');
  openModal('modalAssign');
}
async function confirmAssign(){
  const resId = document.getElementById('assignResId').value;
  const empId = document.getElementById('assignEmpSelect').value;
  closeModal('modalAssign');
  await assignEmployeeToResource(resId, empId);
}

/* ===================== RECURSOS (cadastro) ===================== */
let recSearch = '';
function renderRecursos(){
  const el = document.getElementById('panel-recursos');
  el.innerHTML = `
    <div class="section-title">${icon('wrench',19)} Recursos</div>
    <div class="section-sub">Cadastro das máquinas, células e recursos utilizados no apontamento de produção e no monitoramento.</div>
    <div class="toolbar">
      <div class="search-box"><span class="search-ic">${icon('search',15)}</span><input placeholder="Buscar código, descrição ou grupo..." oninput="recSearch=this.value; renderRecursosTable();"></div>
      <button class="btn btn-primary" data-edit="recursos" onclick="openResourceModal()">${icon('plus',14)} Novo Recurso</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Código</th><th>Descrição</th><th>Setor</th><th>Status</th><th>Operadores</th><th style="width:110px;"></th></tr></thead>
        <tbody id="recTbody"></tbody>
      </table>
    </div>
  `;
  renderRecursosTable();
}
function renderRecursosTable(){
  const tbody = document.getElementById('recTbody');
  if(!tbody) return;
  const q = recSearch.trim().toLowerCase();
  const list = state.resources.filter(r => {
    const names = resourceGroupNames(r).join(' ').toLowerCase();
    return !q || r.nome.toLowerCase().includes(q) || r.descricao.toLowerCase().includes(q) || names.includes(q);
  });
  tbody.innerHTML = list.length ? list.map(r=>{
    const statusBadgeClass = r.status==='Produzindo' ? 'badge-green' : (r.status==='Manutenção' ? 'badge-amber' : 'badge-red');
    const nomes = r.funcionarios.map(id=>{ const e=state.employees.find(x=>x.id===id); return e ? (e.nome+' '+e.sobrenome) : null; }).filter(Boolean);
    return `<tr>
      <td style="font-weight:700;">${r.nome}</td>
      <td>${r.descricao}</td>
      <td>${resourceGroupNames(r).map(function(name){ return `<span class="badge badge-gray">${escapeHtml(name)}</span>`; }).join(' ') || '—'}</td>
      <td><span class="badge ${statusBadgeClass}"><span class="dot"></span>${r.status}</span></td>
      <td>${nomes.length ? nomes.join(', ') : '<span style="color:var(--text-faint);">Nenhum</span>'}</td>
      <td>
        <button class="icon-btn" data-edit="recursos" onclick="openResourceModal('${r.id}')" title="Editar">${icon('edit',14)}</button>
        <button class="icon-btn danger" data-edit="recursos" onclick="removeResourceFromRecursos('${r.id}')" title="Remover">${icon('trash',14)}</button>
      </td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="6">Nenhum recurso cadastrado. Clique em "Novo Recurso" para começar.</td></tr>`;
  applyAccess();
}
async function removeResourceFromRecursos(id){
  await removeResource(id);
  renderRecursosTable();
}

/* ===================== ORDENS DE PRODUÇÃO ===================== */
let ordensSearch = '';
function renderOrdens(){
  recalcAllOrderStatuses();
  const el = document.getElementById('panel-ordens');
  el.innerHTML = `
    <div class="section-title">${icon('clipboard',19)} Ordens de Produção</div>
    <div class="section-sub">O pedido vincula equipamentos já cadastrados. Cada peça segue a rota do item e o setor definido no equipamento. Pintura e montagem abrem no fim quando a rota pede. Com 100%, o pedido vai para expedição.</div>
    <div class="toolbar">
      <div class="search-box"><span class="search-ic">${icon('search',15)}</span><input placeholder="Buscar por OP ou código..." oninput="ordensSearch=this.value; renderOrdensTable();"></div>
      <button class="btn btn-primary" data-edit="ordens" onclick="openOrderModal()">${icon('plus',14)} Nova Ordem de Produção</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Pedido</th><th>Setor</th><th>Itens</th><th>Qtd.</th><th>Produzido</th><th>Status</th><th></th></tr></thead>
        <tbody id="ordensTbody"></tbody>
      </table>
    </div>
  `;
  renderOrdensTable();
}
function renderOrdensTable(){
  const tbody = document.getElementById('ordensTbody');
  if(!tbody) return;
  const q = ordensSearch.trim().toLowerCase();
  const list = state.orders.filter(o => !q || orderLabel(o).toLowerCase().includes(q) || o.codigo.toLowerCase().includes(q)).sort((a,b)=> b.criadoEm.localeCompare(a.criadoEm));
  tbody.innerHTML = list.length ? list.map(o=>{
    const progress = orderProgress(o);
    const items = orderItems(o);
    const groupNames = Array.from(new Set(items.map(itemSetorLabel).filter(Boolean)));
    const machines = (o.equipamentos || []).map(function(item){
      const times = Number(item.quantidade) || 1;
      return item.nome + (times > 1 ? ' × ' + times : '');
    });
    const hint = routeHint(o);
    return `<tr>
      <td>
        <div style="color:var(--blue); font-weight:700;">${orderLabel(o)}</div>
        <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(machines.join(', ') || o.descricao || '')}</div>
      </td>
      <td>${escapeHtml(groupNames.join(', ') || '—')}</td>
      <td>${items.length}</td>
      <td class="mono">${progress.planned}</td>
      <td style="min-width:120px;">
        <div class="progress-track" style="margin-bottom:4px;"><div class="progress-fill" style="width:${Math.min(progress.pct, 100)}%;"></div></div>
        <div style="font-size:10.5px; color:var(--text-faint);">${progress.pct}% · ${progress.produced}/${progress.planned}</div>
        ${hint ? `<div style="font-size:10.5px; color:var(--text-muted); margin-top:2px;">${escapeHtml(hint)}</div>` : ''}
      </td>
      <td>${orderStatusSelect(o)}</td>
      <td style="white-space:nowrap;">
        <button class="btn btn-sm btn-ghost" onclick="showOrderQR('${o.id}')">${icon('qrscan',13)} QR Code</button>
        <button class="icon-btn" onclick="printOrder('${o.id}')" title="Imprimir Ordem">${icon('printer',15)}</button>
      </td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="7">Nenhum pedido encontrado. Clique em "Nova Ordem de Produção" para começar.</td></tr>`;
}
let orderDraftEquipments = [];
function equipmentById(id){ return state.equipments.find(function(item){ return item.id === id; }); }
function explodeEquipment(equipment, times){
  const count = Math.max(1, Number(times) || 1);
  return (equipment.itens || []).map(function(part){
    const product = productByCode(part.codigo);
    const setor = setorById(part.setorId || (product && product.setorId));
    const rota = ((product && product.rota) || []).map(function(step){
      const operation = operacaoById(step.operacaoId);
      const stepSetor = setorById(step.setorId) || setor;
      return {
        operacaoId: step.operacaoId || '',
        nome: operation ? recordLabel(operation) : 'Operação',
        setorId: stepSetor ? stepSetor.id : '',
        setorNome: stepSetor ? recordLabel(stepSetor) : '',
        feita: 0
      };
    });
    const flags = routeFlags(rota);
    const each = Math.max(0, Number(part.quantidade) || 0);
    return {
      id: uid(),
      codigo: product ? product.codigo : part.codigo,
      codigoErp: product ? (product.codigoErp || '') : '',
      descricao: product ? product.descricao : part.codigo,
      grupoId: product ? (product.grupoId || '') : '',
      familiaId: product ? (product.familiaId || '') : (equipment.familiaId || ''),
      setorId: setor ? setor.id : '',
      setorNome: setor ? recordLabel(setor) : '',
      quantidade: each * count,
      produzida: 0,
      pintada: 0,
      montada: 0,
      pintura: flags.pintura || !!(product && product.pintura),
      montagem: flags.montagem || !!(product && product.montagem),
      rota: rota,
      equipamentoId: equipment.id,
      equipamentoNome: recordLabel(equipment),
      tempo: Number(product && product.tempoFabricacaoMin) || 0
    };
  }).filter(function(item){ return item.quantidade > 0; });
}
function openOrderModal(){
  if(deny('ordens')) return;
  if(!state.equipments.length){
    toast('Cadastre um equipamento antes de abrir o pedido.', 'error');
    return;
  }
  orderDraftEquipments = [];
  const select = document.getElementById('ordEquipamento');
  select.innerHTML = state.equipments.map(function(item){
    return `<option value="${item.id}">${escapeHtml(recordLabel(item))}</option>`;
  }).join('');
  document.getElementById('ordQtd').value = 1;
  const numeroField = document.getElementById('ordNumero');
  if(numeroField) numeroField.value = formatOrderNumber(state.nextOrderNum);
  const geradoSel = document.getElementById('ordGeradoPor');
  geradoSel.innerHTML = state.employees.length ? state.employees.map(e=>`<option value="${e.nome} ${e.sobrenome}">${e.nome} ${e.sobrenome}</option>`).join('') : '<option value="">Nenhum funcionário cadastrado</option>';
  renderOrderPreview();
  renderOrderDraft();
  openModal('modalOrder');
}
function renderOrderPreview(){
  const equipment = equipmentById(document.getElementById('ordEquipamento') && document.getElementById('ordEquipamento').value);
  const qtd = Number(document.getElementById('ordQtd') && document.getElementById('ordQtd').value) || 0;
  const prev = document.getElementById('ordPreview');
  if(!prev) return;
  if(!equipment){ prev.innerHTML = 'Escolha um equipamento cadastrado.'; return; }
  const lines = explodeEquipment(equipment, qtd).map(function(item){
    const flags = [item.pintura ? 'pintura no fim' : '', item.montagem ? 'montagem no fim' : ''].filter(Boolean).join(' · ');
    const route = (item.rota || []).map(function(step){ return step.nome; }).filter(Boolean).join(' → ');
    return `<div>${escapeHtml(itemSetorLabel(item) || 'Sem setor')} · ${escapeHtml(item.descricao)} · ${item.quantidade}${route ? ' · ' + escapeHtml(route) : ''}${flags ? ' · ' + escapeHtml(flags) : ''}</div>`;
  }).join('');
  prev.innerHTML = `<div><b>${escapeHtml(recordLabel(equipment))}</b> × ${qtd || 0}</div><div style="margin-top:6px;">${lines || 'Este equipamento ainda não tem peças.'}</div>`;
}
function addOrderEquipment(){
  const equipment = equipmentById(document.getElementById('ordEquipamento').value);
  const qtd = Number(document.getElementById('ordQtd').value);
  if(!equipment || !qtd || qtd <= 0){ toast('Escolha o equipamento e a quantidade.', 'error'); return; }
  if(!(equipment.itens || []).length){ toast('Este equipamento não tem peças cadastradas.', 'error'); return; }
  const existing = orderDraftEquipments.find(function(item){ return item.equipmentId === equipment.id; });
  if(existing) existing.quantidade += qtd;
  else orderDraftEquipments.push({ id: uid(), equipmentId: equipment.id, nome: equipment.nome, quantidade: qtd });
  renderOrderDraft();
}
function removeOrderDraftItem(id){
  orderDraftEquipments = orderDraftEquipments.filter(function(item){ return item.id !== id; });
  renderOrderDraft();
}
function renderOrderDraft(){
  const box = document.getElementById('ordItemList');
  if(!box) return;
  box.innerHTML = orderDraftEquipments.length ? orderDraftEquipments.map(function(item){
    const equipment = equipmentById(item.equipmentId);
    const parts = equipment ? explodeEquipment(equipment, item.quantidade) : [];
    const detail = parts.map(function(part){
      const group = state.groups.find(function(entry){ return entry.id === part.grupoId; });
      return `<div style="font-size:12px; color:var(--text-muted);">${escapeHtml(group ? group.nome : 'Sem setor')} · ${escapeHtml(part.descricao)} · ${part.quantidade}</div>`;
    }).join('');
    return `<div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;margin-top:8px;">
      <div><b>${escapeHtml(item.nome)}</b> × ${item.quantidade}${detail}</div>
      <button class="icon-btn danger" type="button" onclick="removeOrderDraftItem('${item.id}')" title="Tirar equipamento">${icon('trash',14)}</button>
    </div>`;
  }).join('') : '<div class="section-sub">Nenhum equipamento vinculado.</div>';
}
async function saveOrder(shouldPrint){
  if(deny('ordens')) return;
  const geradoPor = document.getElementById('ordGeradoPor').value || 'Não informado';
  if(!orderDraftEquipments.length){ toast('Vincule ao menos um equipamento ao pedido.', 'error'); return; }
  const opId = uid();
  const equipamentos = orderDraftEquipments.map(function(item){
    return { id: item.equipmentId, nome: item.nome, quantidade: item.quantidade };
  });
  const itens = [];
  let tempo = 0;
  orderDraftEquipments.forEach(function(item){
    const equipment = equipmentById(item.equipmentId);
    if(!equipment) return;
    explodeEquipment(equipment, item.quantidade).forEach(function(part){
      tempo += part.tempo * part.quantidade;
      itens.push(part);
    });
  });
  if(!itens.length){ toast('Os equipamentos vinculados não têm peças.', 'error'); return; }
  const assignedNumber = assignOrderNumber(document.getElementById('ordNumero') ? document.getElementById('ordNumero').value : '');
  if(assignedNumber.error){ toast(assignedNumber.error, 'error'); return; }
  const numero = assignedNumber.numero;
  const quantidade = itens.reduce(function(sum, item){ return sum + item.quantidade; }, 0);
  const nomes = equipamentos.map(function(item){ return item.nome + (item.quantidade > 1 ? ' × ' + item.quantidade : ''); });
  state.orders.push({ id: opId, numero, codigo: itens[0].codigo, descricao: nomes.join(', '), quantidadePlanejada: quantidade, tempoEstimadoTotalMin: tempo, status:'Não iniciado', setor:'', motivo:'', criadoEm: nowISO(), geradoPor, equipamentos: equipamentos, itens: itens });
  orderDraftEquipments = [];
  await persist();
  closeModal('modalOrder');
  toast('Ordem ' + numero + ' gerada com sucesso.', 'success');
  renderOrdensTable();
  refreshApontamentoDatalist();
  if(shouldPrint) printOrder(opId);
}
function showOrderInfo(orderId){
  const order = orderById(orderId);
  if(!order) return;
  const apontadores = Array.from(new Set(state.punches.filter(p=>p.ordemId===orderId).map(p=>p.funcionarioId)));
  document.getElementById('orderInfoBody').innerHTML = `
    <div style="margin-bottom:14px;">
      <div style="font-size:20px; font-weight:800;">${orderLabel(order)}</div>
      <div style="color:var(--text-muted); font-size:13px;">${order.codigo} — ${order.descricao}</div>
      <div style="margin-top:8px;">${orderStatusBadge(order.status)} ${order.motivo ? `<span class="section-sub">${escapeHtml(order.motivo)}</span>` : ''}</div>
      <div style="margin-top:10px; font-weight:700;">Andamento: ${orderProgress(order).pct}%</div>
      ${routeHint(order) ? `<div style="margin-top:4px; color:var(--text-muted);">${escapeHtml(routeHint(order))}</div>` : ''}
      <div style="margin-top:6px;">${orderItems(order).map(function(item){
        const family = familyById(item.familiaId);
        const stage = itemOpenStage(item, order);
        const waitingEquipment = !stage && itemProduced(item) >= itemPlanned(item) && (item.pintura || item.montagem) && !equipmentFabricated(item, order);
        const flags = [item.pintura ? ('pintura ' + itemPainted(item) + '/' + itemPlanned(item)) : '', item.montagem ? ('montagem ' + itemAssembled(item) + '/' + itemPlanned(item)) : ''].filter(Boolean).join(' · ');
        const machine = item.equipamentoNome ? item.equipamentoNome + ' · ' : '';
        const where = stage ? (' · agora: ' + stage.nome) : (waitingEquipment ? ' · aguarda o equipamento' : ' · pronto');
        return `<div>${escapeHtml(machine)}${escapeHtml(itemSetorLabel(item) || 'Sem setor')} · ${escapeHtml(family ? recordLabel(family) : 'Sem família')} · ${escapeHtml(item.descricao || item.codigo || '')} · fabricado ${itemProduced(item)}/${itemPlanned(item)}${flags ? ' · ' + escapeHtml(flags) : ''}${escapeHtml(where)}</div>`;
      }).join('')}</div>
    </div>
    <div class="card" style="box-shadow:none; background:var(--surface-2); margin-bottom:14px;">
      <div class="grid grid-2" style="gap:14px;">
        <div><label style="margin-bottom:3px;">Data de Geração</label><div style="font-weight:700; font-size:13.5px;">${fmtDateTime(order.criadoEm)}</div></div>
        <div><label style="margin-bottom:3px;">Gerado por</label><div style="font-weight:700; font-size:13.5px;">${order.geradoPor || 'Não informado'}</div></div>
      </div>
    </div>
    <div>
      <label style="margin-bottom:7px;">Quem Apontou</label>
      ${apontadores.length ? `<div style="display:flex; flex-wrap:wrap; gap:7px;">${apontadores.map(id=>employeeMiniChipHTML(id)).join('')}</div>` : '<div style="color:var(--text-faint); font-size:13px;">Nenhum apontamento registrado ainda.</div>'}
    </div>
  `;
  openModal('modalOrderInfo');
}
function showOrderQR(orderId){
  const order = orderById(orderId);
  if(!order) return;
  document.getElementById('qrOpLabel').textContent = orderLabel(order) + '  ·  ' + order.codigo;
  const holder = document.getElementById('qrCanvasHolder');
  holder.innerHTML = '';
  if(window.QRCode){ new QRCode(holder, { text: orderLabel(order), width:200, height:200, colorDark:'#111', colorLight:'#fff' }); }
  else{ holder.innerHTML = `<div style="padding:40px; border:2px dashed #999; font-weight:700;">${orderLabel(order)}</div>`; }
  openModal('modalQR');
}
function printOrder(orderId){
  const order = orderById(orderId);
  if(!order) return;
  const prod = productByCode(order.codigo);
  const printArea = document.getElementById('printArea');
  const qrHolderId = 'printQr_' + Date.now();
  const blankRows = Array.from({length:5}).map(()=>'<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>').join('');
  printArea.innerHTML = `
    <div class="print-page">
      <div class="print-top-row">
        <div>
          <div class="print-brand">SOSYSTEM</div>
          <div class="print-doc-title">Ordem de Produção</div>
          <div class="print-op-number">${orderLabel(order)}</div>
        </div>
        <div class="print-qr-block">
          <div id="${qrHolderId}"></div>
          <div class="print-qr-label">${orderLabel(order)}</div>
        </div>
      </div>
      <div class="print-info-grid">
        <div><span class="print-label">Código da Peça</span><span class="print-value">${order.codigo}</span></div>
        <div><span class="print-label">Classificação</span><span class="print-value">${prod?prod.classificacao:'—'}</span></div>
        <div><span class="print-label">Nome / Descrição</span><span class="print-value">${order.descricao}</span></div>
        <div><span class="print-label">Quantidade Planejada</span><span class="print-value">${order.quantidadePlanejada} peças</span></div>
        <div><span class="print-label">Tempo Estimado Total</span><span class="print-value">${order.tempoEstimadoTotalMin.toFixed(0)} min</span></div>
        <div><span class="print-label">Status</span><span class="print-value">${order.status}</span></div>
        <div><span class="print-label">Gerado por</span><span class="print-value">${order.geradoPor||'—'}</span></div>
        <div><span class="print-label">Data de Geração</span><span class="print-value">${fmtDateTime(order.criadoEm)}</span></div>
        <div><span class="print-label">Data de Impressão</span><span class="print-value">${fmtDateTime(nowISO())}</span></div>
      </div>
      <div class="print-section-title">Composição do pedido</div>
      <table class="print-table">
        <thead><tr><th>Equipamento</th><th>Setor</th><th>Peça</th><th>Qtd.</th><th>Pintura</th><th>Montagem</th></tr></thead>
        <tbody>${orderItems(order).map(function(item){
          const route = (item.rota || []).map(function(step){ return step.nome; }).filter(Boolean).join(' → ');
          return `<tr><td>${escapeHtml(item.equipamentoNome || '—')}</td><td>${escapeHtml(itemSetorLabel(item) || '—')}${route ? '<div>' + escapeHtml(route) + '</div>' : ''}</td><td>${escapeHtml(item.descricao || item.codigo || '')}</td><td>${itemPlanned(item)}</td><td>${item.pintura ? 'Sim' : 'Não'}</td><td>${item.montagem ? 'Sim' : 'Não'}</td></tr>`;
        }).join('')}</tbody>
      </table>
      <div class="print-section-title">Apontamento de Produção — preenchimento manual</div>
      <table class="print-table">
        <thead><tr><th>Funcionário</th><th>Recurso</th><th>Início</th><th>Fim</th><th>Qtd. Produzida</th><th>Qtd. Refugada</th></tr></thead>
        <tbody>${blankRows}</tbody>
      </table>
      <div class="print-footer">Documento gerado pelo sistema SOSystem em ${fmtDateTime(nowISO())}</div>
    </div>
  `;
  if(window.QRCode){
    const qrHolder = document.getElementById(qrHolderId);
    if(qrHolder) new QRCode(qrHolder, { text: orderLabel(order), width:104, height:104, colorDark:'#111', colorLight:'#fff' });
  }
  setTimeout(()=>{ window.print(); }, 150);
}

/* ===================== ENGENHARIA DE PRODUTO ===================== */
let engSearch = '';
function renderEngenharia(){
  const el = document.getElementById('panel-engenharia');
  el.innerHTML = `
    <div class="section-title">${icon('gear',19)} Engenharia de Produto</div>
    <div class="section-sub">Consulta dos itens. O código interno é AA e o ERP fica separado: <b>30.2000.XXXX</b> para PI e <b>30.3000.XXXX</b> para PF. Incluir e alterar é em Cadastro, na opção Item.</div>
    <div class="toolbar">
      <div class="search-box"><span class="search-ic">${icon('search',15)}</span><input placeholder="Buscar código ou descrição..." oninput="engSearch=this.value; renderEngenhariaTable();"></div>
      <button class="btn btn-primary" data-edit="engenharia" onclick="openCadastroItem()">${icon('plus',14)} Novo item</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Código</th><th>ERP</th><th>Descrição</th><th>Família</th><th>Setor</th><th style="width:90px;"></th></tr></thead>
        <tbody id="engTbody"></tbody>
      </table>
    </div>
  `;
  renderEngenhariaTable();
}
function renderCadastro(){
  const el = document.getElementById('panel-cadastro');
  if(!el) return;
  const options = [
    ['setor', 'Setor', 'Lugar da fábrica. Ex.: Chaparia, Usinagem.'],
    ['grupo', 'Grupo', 'Categoria acima da família. Ex.: Separação.'],
    ['familia', 'Família', 'Linha do produto e o conjunto padrão de peças.'],
    ['item', 'Item', 'Peça unitária, material, máquinas e rota.'],
    ['operacao', 'Operação', 'Etapas como cortar, dobrar e soldar.'],
    ['operador', 'Operador', 'Pessoa, turno e máquinas.'],
    ['maquina', 'Máquina', 'Setor, operações e operadores.'],
    ['equipamento', 'Equipamento', 'Um modelo da família, com as peças copiadas.']
  ];
  el.innerHTML = `
    <div class="section-title">${icon('plus',19)} Cadastro</div>
    <div class="section-sub">Ordem sugerida: setor, operação e máquina; depois grupo, família e item; por último o equipamento, que herda as peças da família.</div>
    <div class="cadastro-choices">${options.map(function(choice){
      const active = cadastroChoice === choice[0] ? ' active' : '';
      return `<button type="button" class="settings-choice${active}" onclick="setCadastroChoice('${choice[0]}')"><b>${choice[1]}</b><span>${choice[2]}</span></button>`;
    }).join('')}</div>
    <div class="card" id="cadastroBody"></div>
  `;
  renderCadastroBody();
}
let itemSearch = '';
let itemGroupFilter = '';
let itemFamilyFilter = '';
let editingProductCode = '';
function productGroup(product){
  const family = state.families.find(function(item){ return item.id === (product && product.familiaId); });
  const group = family && state.groups.find(function(item){ return item.id === family.grupoId; });
  return { family: family || null, group: group || null };
}
function familyOptionsHtml(groupId, selectedId){
  const families = state.families.filter(function(family){ return !groupId || family.grupoId === groupId; });
  if(!families.length) return '<option value="">Nenhuma família neste grupo</option>';
  return families.map(function(family){
    return `<option value="${family.id}" ${family.id===selectedId?'selected':''}>${escapeHtml(family.nome)}</option>`;
  }).join('');
}
function syncProductOnOrders(oldCode, oldDescricao, product){
  const link = productGroup(product);
  const grupoId = link.group ? link.group.id : '';
  state.orders.forEach(function(order){
    (order.itens || []).forEach(function(item){
      if(item.codigo !== oldCode) return;
      item.codigo = product.codigo;
      if(item.descricao === oldDescricao) item.descricao = product.descricao;
      item.familiaId = product.familiaId || '';
      item.grupoId = product.grupoId || grupoId;
      item.pintura = !!product.pintura;
      item.montagem = !!product.montagem;
    });
    if(order.codigo === oldCode){
      order.codigo = product.codigo;
      if(order.descricao === oldDescricao) order.descricao = product.descricao;
    }
  });
  state.equipments.forEach(function(equipment){
    (equipment.itens || []).forEach(function(part){
      if(part.codigo === oldCode) part.codigo = product.codigo;
    });
  });
  state.families.forEach(function(family){
    (family.itens || []).forEach(function(part){
      if(part.codigo === oldCode) part.codigo = product.codigo;
    });
  });
}
function renderProductCatalog(){
  const box = document.getElementById('productCatalog');
  if(!box) return;
  const editing = state.products.find(function(product){ return product.codigo === editingProductCode; });
  const editLink = productGroup(editing);
  const editGroupId = editLink.group ? editLink.group.id : ((state.groups[0] && state.groups[0].id) || '');
  const classificacao = editing ? (editing.classificacao || 'PF') : 'PF';
  const suggestedCode = editing ? editing.codigo : genErpCode(classificacao);
  const groupOptions = state.groups.map(function(group){
    return `<option value="${group.id}" ${group.id===editGroupId?'selected':''}>${escapeHtml(group.nome)}</option>`;
  }).join('');
  const filterGroups = state.groups.map(function(group){
    return `<option value="${group.id}" ${group.id===itemGroupFilter?'selected':''}>${escapeHtml(group.nome)}</option>`;
  }).join('');
  box.innerHTML = `
    <div class="section-title" style="font-size:16px;">${editing ? 'Editar Produto/Item' : 'Cadastro Produto/Item'}</div>
    ${editing ? `<div class="section-sub">Corrigindo ${escapeHtml(editing.codigo)}.</div>` : ''}
    <form onsubmit="saveProductItem(event)">
      <div class="field-row">
        <div class="field"><label>Nome do item</label><input id="itemDescricao" data-edit="engenharia" required maxlength="120" placeholder="Ex: Ponteira 20mm" value="${escapeHtml(editing ? editing.descricao : '')}"></div>
        <div class="field"><label>Código <span class="field-hint">automático, editável</span></label><input id="itemCodigo" data-edit="engenharia" data-auto="${escapeHtml(suggestedCode)}" value="${escapeHtml(suggestedCode)}" maxlength="40"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Grupo</label>
          <select id="itemGrupo" data-edit="engenharia" onchange="fillItemFamilies()">${groupOptions || '<option value="">Cadastre um grupo</option>'}</select>
        </div>
        <div class="field"><label>Família</label>
          <select id="itemFamilia" data-edit="engenharia">${familyOptionsHtml(editGroupId, editing ? editing.familiaId : '')}</select>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>Classificação</label>
          <select id="itemClasse" data-edit="engenharia" onchange="refreshItemCode()"><option value="PI" ${classificacao==='PI'?'selected':''}>PI — intermediário</option><option value="PF" ${classificacao==='PF'?'selected':''}>PF — final</option></select>
        </div>
        <div class="field"><label>Tempo (min/peça)</label><input id="itemTempo" data-edit="engenharia" type="number" min="0" step="0.1" value="${editing ? (Number(editing.tempoFabricacaoMin) || 0) : 1}"></div>
      </div>
      <div class="field-row">
        <label style="display:flex;align-items:center;gap:8px;"><input id="itemPintura" data-edit="engenharia" type="checkbox" ${editing && editing.pintura ? 'checked' : ''}> Vai para pintura no fim</label>
        <label style="display:flex;align-items:center;gap:8px;"><input id="itemMontagem" data-edit="engenharia" type="checkbox" ${editing && editing.montagem ? 'checked' : ''}> Vai para montagem no fim</label>
      </div>
      <button class="btn btn-primary" data-edit="engenharia" type="submit">${editing ? 'Salvar alterações' : 'Salvar produto'}</button>
      ${editing ? '<button class="btn btn-ghost" type="button" style="margin-left:8px;" onclick="cancelItemEdit()">Cancelar</button>' : ''}
    </form>
    <div class="filter-bar" style="margin-top:16px;">
      <div class="field grow">
        <label>Buscar</label>
        <input id="itemFilterText" placeholder="Código, nome, grupo ou família" value="${escapeHtml(itemSearch)}" oninput="onItemFilterText(this.value)">
      </div>
      <div class="field">
        <label>Grupo</label>
        <select id="itemFilterGrupo" onchange="onItemFilterGroup()"><option value="">Todos</option>${filterGroups}</select>
      </div>
      <div class="field">
        <label>Família</label>
        <select id="itemFilterFamilia" onchange="onItemFilterFamily()"></select>
      </div>
    </div>
    <div class="table-wrap" style="margin-top:12px;">
      <table>
        <thead><tr><th>Código</th><th>Item</th><th>Grupo</th><th>Família</th><th>Classe</th><th>Tempo</th><th style="width:90px;"></th></tr></thead>
        <tbody id="itemTbody"></tbody>
      </table>
    </div>`;
  fillItemFilterFamilies();
  renderProductList();
}
function fillItemFamilies(){
  const group = document.getElementById('itemGrupo');
  const family = document.getElementById('itemFamilia');
  if(!group || !family) return;
  const selected = family.value;
  family.innerHTML = familyOptionsHtml(group.value, selected);
}
function fillItemFilterFamilies(){
  const family = document.getElementById('itemFilterFamilia');
  if(!family) return;
  const families = state.families.filter(function(item){ return !itemGroupFilter || item.grupoId === itemGroupFilter; });
  family.innerHTML = '<option value="">Todas</option>' + families.map(function(item){
    return `<option value="${item.id}" ${item.id===itemFamilyFilter?'selected':''}>${escapeHtml(item.nome)}</option>`;
  }).join('');
}
function onItemFilterText(value){
  itemSearch = value;
  renderProductList();
}
function onItemFilterGroup(){
  itemGroupFilter = document.getElementById('itemFilterGrupo').value;
  const stillValid = state.families.some(function(family){ return family.id === itemFamilyFilter && (!itemGroupFilter || family.grupoId === itemGroupFilter); });
  if(!stillValid) itemFamilyFilter = '';
  fillItemFilterFamilies();
  renderProductList();
}
function onItemFilterFamily(){
  itemFamilyFilter = document.getElementById('itemFilterFamilia').value;
  renderProductList();
}
function renderProductList(){
  const tbody = document.getElementById('itemTbody');
  if(!tbody) return;
  const words = itemSearch.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const list = state.products.filter(function(product){
    const link = productGroup(product);
    if(itemGroupFilter && (!link.group || link.group.id !== itemGroupFilter)) return false;
    if(itemFamilyFilter && product.familiaId !== itemFamilyFilter) return false;
    const hay = [product.codigo, product.descricao, link.group && link.group.nome, link.family && link.family.nome, product.classificacao].join(' ').toLowerCase();
    return words.every(function(word){ return hay.indexOf(word) >= 0; });
  });
  tbody.innerHTML = list.length ? list.map(function(product){
    const link = productGroup(product);
    return `<tr>
      <td class="mono">${escapeHtml(product.codigo)}</td>
      <td>${escapeHtml(product.descricao || '')}${[product.pintura ? 'Pintura' : '', product.montagem ? 'Montagem' : ''].filter(Boolean).length ? `<div style="font-size:11px;color:var(--text-faint);">${[product.pintura ? 'Pintura' : '', product.montagem ? 'Montagem' : ''].filter(Boolean).join(' · ')}</div>` : ''}</td>
      <td>${escapeHtml(link.group ? link.group.nome : '—')}</td>
      <td>${escapeHtml(link.family ? link.family.nome : '—')}</td>
      <td>${escapeHtml(product.classificacao || '')}</td>
      <td class="mono">${Number(product.tempoFabricacaoMin) || 0}</td>
      <td style="white-space:nowrap;">
        <button class="icon-btn" data-edit="engenharia" type="button" data-code="${escapeHtml(product.codigo)}" onclick="editProduct(this.getAttribute('data-code'))" title="Editar item">${icon('gear',14)}</button>
        <button class="icon-btn danger" data-edit="engenharia" type="button" data-code="${escapeHtml(product.codigo)}" onclick="removeProductByCode(this.getAttribute('data-code'))" title="Excluir produto">${icon('trash',14)}</button>
      </td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="7">${state.products.length ? 'Nenhum item com esses filtros.' : 'Nenhum produto cadastrado.'}</td></tr>`;
  applyAccess();
}
function editProduct(codigo){
  if(deny('engenharia')) return;
  editingProductCode = codigo;
  renderProductCatalog();
  applyAccess();
  const name = document.getElementById('itemDescricao');
  if(name) name.focus();
}
function cancelItemEdit(){
  editingProductCode = '';
  renderProductCatalog();
  applyAccess();
}
async function saveProductItem(event){
  event.preventDefault();
  if(deny('engenharia')) return;
  const descricao = document.getElementById('itemDescricao').value.trim();
  const classificacao = document.getElementById('itemClasse').value || 'PF';
  let codigo = document.getElementById('itemCodigo').value.trim();
  const tempo = Math.max(0, Number(document.getElementById('itemTempo').value) || 0);
  const grupoId = document.getElementById('itemGrupo').value;
  const familiaId = document.getElementById('itemFamilia').value;
  const pintura = !!document.getElementById('itemPintura').checked;
  const montagem = !!document.getElementById('itemMontagem').checked;
  const family = state.families.find(function(item){ return item.id === familiaId && item.grupoId === grupoId; });
  if(!descricao){ toast('Informe o nome do produto.', 'error'); return; }
  if(!family){ toast('Informe o grupo e a família.', 'error'); return; }
  if(!codigo) codigo = genErpCode(classificacao);
  const editIndex = editingProductCode ? state.products.findIndex(function(product){ return product.codigo === editingProductCode; }) : -1;
  if(productCodeTaken(codigo, editIndex >= 0 ? editIndex : undefined)){
    toast('Já existe um produto com este código.', 'error');
    return;
  }
  if(editIndex >= 0){
    const product = state.products[editIndex];
    const oldCode = product.codigo;
    const oldDescricao = product.descricao;
    product.codigo = codigo;
    product.descricao = descricao;
    product.tempoFabricacaoMin = tempo || 1;
    product.classificacao = classificacao;
    product.familiaId = familiaId;
    product.pintura = pintura;
    product.montagem = montagem;
    syncProductOnOrders(oldCode, oldDescricao, product);
    editingProductCode = '';
    await persist();
    renderProductCatalog();
    if(typeof renderEngenhariaTable === 'function') renderEngenhariaTable();
    applyAccess();
    toast('Produto atualizado.', 'success');
    return;
  }
  state.products.push({ codigo: codigo, descricao: descricao, tempoFabricacaoMin: tempo || 1, classificacao: classificacao, familiaId: familiaId, pintura: pintura, montagem: montagem });
  await persist();
  renderProductCatalog();
  if(typeof renderEngenhariaTable === 'function') renderEngenhariaTable();
  applyAccess();
  toast('Produto cadastrado.', 'success');
}
function refreshItemCode(){
  const input = document.getElementById('itemCodigo');
  const classe = document.getElementById('itemClasse');
  if(!input || !classe) return;
  const current = input.value.trim();
  const auto = input.getAttribute('data-auto') || '';
  if(current && current !== auto) return;
  let next = genErpCode(classe.value || 'PF');
  if(editingProductCode){
    const parts = current.split('.');
    const last4 = (parts[2] && /^\d{4}$/.test(parts[2])) ? parts[2] : '';
    const candidate = last4 ? ('30.' + (classe.value==='PI'?'2000':'3000') + '.' + last4) : '';
    const idx = state.products.findIndex(function(product){ return product.codigo === editingProductCode; });
    if(candidate && !productCodeTaken(candidate, idx)) next = candidate;
  }
  input.value = next;
  input.setAttribute('data-auto', next);
}
function renderEngenhariaTable(){
  const tbody = document.getElementById('engTbody');
  if(!tbody) return;
  const q = engSearch.trim().toLowerCase();
  const list = state.products.filter(function(product){
    const blob = [product.codigo, product.codigoErp, product.descricao].join(' ').toLowerCase();
    return !q || blob.indexOf(q) >= 0;
  });
  tbody.innerHTML = list.length ? list.map(function(product){
    const family = familyById(product.familiaId);
    const setor = setorById(product.setorId);
    return `<tr>
      <td class="mono">${escapeHtml(product.codigo || '')}</td>
      <td class="mono">${escapeHtml(product.codigoErp || '')}</td>
      <td>${escapeHtml(product.descricao || '')}</td>
      <td>${escapeHtml(family ? recordLabel(family) : '—')}</td>
      <td>${escapeHtml(setor ? recordLabel(setor) : '—')}</td>
      <td><button class="btn btn-sm" type="button" data-edit="engenharia" onclick="openCadastroItem('${escapeHtml(product.codigo)}')">Editar</button></td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="6">Nenhum item cadastrado. Abra Cadastro e escolha Item.</td></tr>`;
  applyAccess();
}
async function addProductRow(){
  openCadastroItem();
}
async function updateProduct(idx, field, value){
  if(deny('engenharia')) return;
  const p = state.products[idx]; if(!p) return;
  if(field==='codigo'){
    value = String(value || '').trim();
    if(!value){ toast('Informe o código.', 'error'); renderEngenhariaTable(); return; }
    if(productCodeTaken(value, idx)){ toast('Já existe um produto com este código.', 'error'); renderEngenhariaTable(); return; }
  }
  if(field==='tempoFabricacaoMin') value = Math.max(0, Number(value)||0);
  const oldCode = p.codigo;
  const oldDescricao = p.descricao;
  p[field] = value;
  syncProductOnOrders(oldCode, oldDescricao, p);
  await persist();
  if(typeof renderProductList === 'function') renderProductList();
  toast('Código atualizado.', 'success');
}
async function updateClassificacao(idx, newClass){
  if(deny('engenharia')) return;
  const p = state.products[idx]; if(!p) return;
  const oldCode = p.codigo;
  const oldDescricao = p.descricao;
  p.classificacao = newClass;
  const source = String(p.codigoErp || (String(p.codigo || '').indexOf('.') >= 0 ? p.codigo : '') || '');
  const parts = source.split('.');
  const last4 = (parts[2] && /^\d{4}$/.test(parts[2])) ? parts[2] : '';
  let codigo = last4 ? ('30.' + (newClass==='PI'?'2000':'3000') + '.' + last4) : genErpCode(newClass);
  if(productCodeTaken(codigo, idx)) codigo = genErpCode(newClass);
  p.codigoErp = codigo;
  syncProductOnOrders(oldCode, oldDescricao, p);
  await persist();
  renderEngenhariaTable();
  toast('Classificação atualizada — código ' + p.codigo, 'success');
}
async function removeProductByCode(codigo){
  const idx = state.products.findIndex(function(product){ return product.codigo === codigo; });
  if(idx >= 0) await removeProduct(idx);
}
async function removeProduct(idx){
  if(deny('engenharia')) return;
  if(!confirm('Excluir este produto?')) return;
  if(state.products[idx] && state.products[idx].codigo === editingProductCode) editingProductCode = '';
  state.products.splice(idx,1);
  await persist();
  renderEngenhariaTable();
  if(typeof renderProductCatalog === 'function') renderProductCatalog();
}

/* ===================== FUNCIONÁRIOS ===================== */
let funcSearch = '';
function renderFuncionarios(){
  const el = document.getElementById('panel-funcionarios');
  el.innerHTML = `
    <div class="section-title">${icon('users',19)} Funcionários</div>
    <div class="section-sub">Cadastro de colaboradores do chão de fábrica com identificação visual, função, turno, vínculo e férias.</div>
    <div class="toolbar">
      <div class="search-box"><span class="search-ic">${icon('search',15)}</span><input placeholder="Buscar por número ou nome..." oninput="funcSearch=this.value; renderFuncionariosTable();"></div>
      <button class="btn btn-primary" data-edit="funcionarios" onclick="openEmployeeModal()">${icon('plus',14)} Adicionar Funcionário</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th style="width:70px;">Código</th><th style="width:70px;">Nº</th><th>Nome</th><th>Função</th><th>Turno</th><th>Vínculo</th><th>Situação</th><th style="width:110px;"></th></tr></thead>
        <tbody id="funcTbody"></tbody>
      </table>
    </div>
  `;
  renderFuncionariosTable();
}
function renderFuncionariosTable(){
  const tbody = document.getElementById('funcTbody');
  if(!tbody) return;
  const q = funcSearch.trim().toLowerCase();
  const list = state.employees.filter(e => !q || (e.nome+' '+e.sobrenome).toLowerCase().includes(q) || e.funcao.toLowerCase().includes(q) || (e.numero||'').includes(q) || String(e.codigo || '').toLowerCase().includes(q));
  tbody.innerHTML = list.length ? list.map(e=>{
    const vac = isOnVacation(e);
    const loc = employeeLocation(e.id);
    return `<tr class="${vac?'row-vacation':''}">
      <td class="mono">${escapeHtml(e.codigo || '—')}</td>
      <td class="mono" style="font-weight:800; color:${vac?'var(--red-dark)':'var(--blue)'};">${e.numero||'—'}</td>
      <td>
        <div style="display:flex; align-items:center; gap:11px;">
          ${employeeAvatarHTML(e,'table-emp-avatar')}
          <span>${e.nome} ${e.sobrenome}</span>
        </div>
      </td>
      <td>${e.funcao}</td>
      <td><span class="badge badge-blue">${e.turno}</span></td>
      <td><span class="badge badge-gray">${e.vinculo}</span></td>
      <td>${vac ? '<span class="badge badge-red">Férias</span>' : (loc ? `<span class="badge badge-green">Em ${loc}</span>` : '<span class="badge badge-gray">Disponível</span>')}</td>
      <td>
        <button class="icon-btn" data-edit="funcionarios" onclick="openEmployeeModal('${e.id}')" title="Editar">${icon('edit',14)}</button>
        <button class="icon-btn danger" data-edit="funcionarios" onclick="removeEmployee('${e.id}')" title="Remover">${icon('trash',14)}</button>
      </td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="8">Nenhum funcionário cadastrado ainda.</td></tr>`;
  applyAccess();
}
function toggleFeriasFields(){
  document.getElementById('feriasFields').style.display = document.getElementById('empFeriasToggle').checked ? 'flex' : 'none';
}
function openEmployeeModal(id){
  if(deny('funcionarios')) return;
  document.getElementById('empId').value = id || '';
  if(id){
    const e = state.employees.find(x=>x.id===id);
    document.getElementById('empModalTitle').textContent = 'Editar Funcionário';
    document.getElementById('empNumero').value = e.numero || '';
    document.getElementById('empCodigo').value = e.codigo || '';
    document.getElementById('empNome').value = e.nome;
    document.getElementById('empSobrenome').value = e.sobrenome;
    document.getElementById('empFuncao').value = e.funcao;
    document.getElementById('empTurno').value = e.turno;
    document.getElementById('empVinculo').value = e.vinculo || 'Efetivo';
    document.getElementById('empFeriasToggle').checked = !!e.ferias;
    document.getElementById('empFeriasInicio').value = e.ferias ? e.ferias.inicio : '';
    document.getElementById('empFeriasFim').value = (e.ferias && e.ferias.fim) ? e.ferias.fim : '';
  } else {
    document.getElementById('empModalTitle').textContent = 'Novo Funcionário';
    document.getElementById('empNumero').value = formatEmployeeNumber(state.nextEmployeeNum);
    document.getElementById('empCodigo').value = suggestAlpha(state.employees);
    document.getElementById('empNome').value = '';
    document.getElementById('empSobrenome').value = '';
    document.getElementById('empFuncao').value = '';
    document.getElementById('empTurno').value = '1º Turno';
    document.getElementById('empVinculo').value = 'Efetivo';
    document.getElementById('empFeriasToggle').checked = false;
    document.getElementById('empFeriasInicio').value = '';
    document.getElementById('empFeriasFim').value = '';
  }
  toggleFeriasFields();
  const selected = id ? employeeMachines(id).map(function(resource){ return resource.id; }) : [];
  renderMachineChoices('empMaquinas', selected);
  openModal('modalEmployee');
}
async function saveEmployee(){
  if(deny('funcionarios')) return;
  const id = document.getElementById('empId').value;
  const nome = document.getElementById('empNome').value.trim();
  const sobrenome = document.getElementById('empSobrenome').value.trim();
  const funcao = document.getElementById('empFuncao').value.trim();
  const turno = document.getElementById('empTurno').value;
  const vinculo = document.getElementById('empVinculo').value;
  const feriasOn = document.getElementById('empFeriasToggle').checked;
  const fi = document.getElementById('empFeriasInicio').value;
  const ff = document.getElementById('empFeriasFim').value;
  if(!nome || !sobrenome || !funcao){ toast('Preencha todos os campos.', 'error'); return; }
  if(feriasOn && !fi){ toast('Informe a data de início das férias.', 'error'); return; }
  const ferias = (feriasOn && fi) ? {inicio:fi, fim: ff || null} : null;
  const machineIds = Array.from(document.querySelectorAll('#empMaquinas input:checked')).map(function(input){ return input.value; });
  const assignedNumber = assignEmployeeNumber(document.getElementById('empNumero').value, id);
  if(assignedNumber.error){ toast(assignedNumber.error, 'error'); return; }
  const claimed = claimCode(state.employees, document.getElementById('empCodigo').value || suggestAlpha(state.employees), id);
  if(claimed.error){ toast(claimed.error, 'error'); return; }
  const novoNumero = assignedNumber.numero;
  let employeeId = id;
  if(id){
    const e = state.employees.find(x=>x.id===id);
    Object.assign(e, {codigo:claimed.codigo, numero:novoNumero, nome,sobrenome,funcao,turno,vinculo,ferias});
  } else {
    employeeId = uid();
    state.employees.push({id:employeeId, codigo:claimed.codigo, numero:novoNumero, nome, sobrenome, funcao, turno, vinculo, ferias});
  }
  syncEmployeeMachines(employeeId, machineIds);
  await persist();
  closeModal('modalEmployee');
  renderFuncionariosTable();
  refreshApontamentoDatalist();
  if(activeTab==='dashboard') renderDashLists();
  toast(novoNumero ? `Funcionário salvo — número ${novoNumero}.` : 'Funcionário salvo com sucesso.', 'success');
}
async function removeEmployee(id){
  if(deny('funcionarios')) return;
  if(!confirm('Remover este funcionário?')) return;
  state.employees = state.employees.filter(e=>e.id!==id);
  state.resources.forEach(r=>{ r.funcionarios = (r.funcionarios || []).filter(eid=>eid!==id); });
  await persist();
  renderFuncionariosTable();
  refreshApontamentoDatalist();
}

/* ===================== APONTAMENTO DE PRODUÇÃO (TABLET) ===================== */
let finFuncionarioId = '';
let finPunchId = '';

function renderApontamento(){
  const el = document.getElementById('panel-apontamento');
  const openCount = state.punches.filter(p=>p.status==='Aberto').length;
  el.innerHTML = `
    <div class="ap-hero">
      <div class="ap-hero-icon">${icon('helmet',26)}</div>
      <div>
        <div class="ap-hero-title">Apontamento de Produção</div>
        <div class="ap-hero-sub">Toque em um dos botões abaixo</div>
      </div>
      <div class="ap-clock" id="apClockDisplay">--:--:--</div>
    </div>
    <div class="ap-main-actions">
      <button type="button" class="ap-big-btn ap-btn-green" data-edit="apontamento" onclick="openIniciarModal()">
        <div class="ap-big-icon">${icon('play',36)}</div>
        <div>INICIAR</div>
        <div class="ap-big-sub">Começar a produção em uma máquina</div>
      </button>
      <button type="button" class="ap-big-btn ap-btn-red" data-edit="apontamento" onclick="openFinalizarModal()">
        <span class="ap-big-badge" id="apOpenBadge" style="${openCount>0?'':'display:none;'}">${openCount}</span>
        <div class="ap-big-icon">${icon('stop',36)}</div>
        <div>FINALIZAR</div>
        <div class="ap-big-sub">Encerrar um apontamento em aberto</div>
      </button>
    </div>
  `;
}

/* --- Iniciar (modal) --- */
let apShowNewEmployee = false;
let apShowNewMachine = false;
function openIniciarModal(){
  if(deny('apontamento')) return;
  apFuncionarioId=''; apRecurso=''; apRecursoCustom=''; apEmpFilterQuery='';
  apShowNewEmployee = false;
  apShowNewMachine = false;
  renderIniciarModalBody();
  openModal('modalIniciar');
}
function closeIniciarModal(){ closeModal('modalIniciar'); }
function renderIniciarModalBody(){
  const holder = document.getElementById('iniciarModalBody');
  const openOrders = state.orders.filter(o=>o.status!=='Concluída').slice(-8).reverse();
  holder.innerHTML = `
    <div class="ap-step" style="margin-bottom:14px;">
      <div class="ap-step-head"><div class="ap-step-num">1</div><div class="ap-step-title">Quem está trabalhando?</div></div>
      <div class="field" style="margin-bottom:14px;">
        <label>Digite seu número ou nome</label>
        <input id="apEmpFilterInput" placeholder="Ex: 0007 ou Carlos" oninput="apEmpFilterQuery=this.value; renderApEmpGrid();">
      </div>
      <div class="ap-emp-grid" id="apEmpGrid"></div>
      <button type="button" class="btn btn-ghost btn-sm" style="margin-top:10px;" onclick="toggleQuickEmployee()">Cadastrar funcionário</button>
      <div id="quickEmployeeBox" style="display:${apShowNewEmployee?'block':'none'}; margin-top:10px;">
        <div class="field-row">
          <div class="field"><label>Nome</label><input id="quickEmpNome"></div>
          <div class="field"><label>Sobrenome</label><input id="quickEmpSobrenome"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Número <span class="field-hint">automático, editável</span></label><input id="quickEmpNumero" value="${formatEmployeeNumber(state.nextEmployeeNum)}" maxlength="8"></div>
          <div class="field"><label>Função</label><input id="quickEmpFuncao" placeholder="Ex: Operador"></div>
        </div>
        <div class="field"><label>Máquinas</label><div id="quickEmpMaquinas" style="display:flex; flex-wrap:wrap;"></div></div>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveQuickEmployee()">Salvar funcionário</button>
      </div>
    </div>
    <div class="ap-step step-purple" style="margin-bottom:14px;">
      <div class="ap-step-head"><div class="ap-step-num">2</div><div class="ap-step-title">Em qual máquina ou recurso?</div></div>
      <div class="ap-res-grid" id="apResGrid"></div>
      <button type="button" class="btn btn-ghost btn-sm" style="margin-top:10px;" onclick="toggleQuickMachine()">Cadastrar máquina</button>
      <div id="quickMachineBox" style="display:${apShowNewMachine?'block':'none'}; margin-top:10px;">
        <div class="field-row">
          <div class="field"><label>Código <span class="field-hint">automático, editável</span></label><input id="quickResNome" value="${escapeHtml(suggestAlpha(state.resources))}" maxlength="12"></div>
          <div class="field"><label>Descrição</label><input id="quickResDescricao" placeholder="Ex: Torno"></div>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveQuickMachine()">Salvar máquina</button>
      </div>
    </div>
    <div class="ap-step step-orange" style="margin-bottom:14px;">
      <div class="ap-step-head"><div class="ap-step-num">3</div><div class="ap-step-title">Qual é a ordem de produção?</div></div>
      <button class="ap-scan-btn" onclick="openScanner()">${icon('qrscan',20)} Ler QR Code da Ordem</button>
      <div class="ap-or-divider">— ou digite o número da ordem —</div>
      <input id="pOrdem" class="ap-order-input" list="ordensList" placeholder="000.001">
      <datalist id="ordensList"></datalist>
      ${openOrders.length ? `<div class="ap-recent-ops">${openOrders.map(o=>`<button type="button" class="ap-op-chip" onclick="document.getElementById('pOrdem').value='${orderLabel(o)}';">${orderLabel(o)} · ${o.codigo}</button>`).join('')}</div>` : ''}
    </div>
    <button class="ap-start-btn" onclick="startPunch()">${icon('play',22)} INICIAR APONTAMENTO</button>
  `;
  refreshApontamentoDatalist();
  renderApEmpGrid();
  renderApResGrid();
  renderMachineChoices('quickEmpMaquinas', []);
}
function renderApEmpGrid(){
  const holder = document.getElementById('apEmpGrid');
  if(!holder) return;
  const q = apEmpFilterQuery.trim().toLowerCase();
  let availableEmps = state.employees.filter(e=>!isOnVacation(e));
  if(q){ availableEmps = availableEmps.filter(e => (e.numero||'').includes(q) || (e.nome+' '+e.sobrenome).toLowerCase().includes(q)); }
  if(/^\d{1,4}$/.test(q)){
    const padded = q.padStart(4,'0');
    const exact = state.employees.find(e=>e.numero===padded && !isOnVacation(e));
    if(exact && apFuncionarioId !== exact.id){
      apFuncionarioId = exact.id;
      applyEmployeeMachine(exact.id);
      renderApResGrid();
    }
  }
  holder.innerHTML = availableEmps.length ? availableEmps.map(e=>{
    const sel = apFuncionarioId === e.id;
    return `<button type="button" class="ap-emp-btn ${sel?'selected':''}" onclick="selectApFuncionario('${e.id}')">
      ${sel?`<span class="ap-check">${icon('checkCircle',18)}</span>`:''}
      ${employeeAvatarHTML(e,'ap-emp-avatar')}
      <div class="ap-emp-btn-name">${e.nome}<br>${e.sobrenome}</div>
      <div class="ap-emp-num">Nº ${e.numero||'—'}</div>
    </button>`;
  }).join('') : `<div class="empty-state" style="grid-column:1/-1; padding:20px;">Nenhum funcionário encontrado.</div>`;
}
function renderApResGrid(){
  const holder = document.getElementById('apResGrid');
  if(!holder) return;
  const linked = employeeMachines(apFuncionarioId);
  const linkedIds = linked.map(function(resource){ return resource.id; });
  const resources = state.resources.slice().sort(function(a, b){
    return (linkedIds.indexOf(a.id) >= 0 ? 0 : 1) - (linkedIds.indexOf(b.id) >= 0 ? 0 : 1);
  });
  holder.innerHTML = resources.length ? resources.map(r=>{
    const sel = apRecurso === r.nome && !apRecursoCustom;
    const mine = linkedIds.indexOf(r.id) >= 0;
    return `<button type="button" class="ap-res-btn ${sel?'selected':''}" data-nome="${escapeHtml(r.nome)}" onclick="selectApRecurso(this.getAttribute('data-nome'))">
      ${sel?`<span class="ap-check">${icon('checkCircle',18)}</span>`:''}
      <div class="ap-res-code-big">${escapeHtml(r.nome)}</div>
      <div class="ap-res-desc-small">${escapeHtml(r.descricao || '')}${mine ? ' · vínculo' : ''}</div>
    </button>`;
  }).join('') : `<div class="empty-state" style="grid-column:1/-1; padding:20px;">Nenhuma máquina cadastrada.</div>`;
}
function applyEmployeeMachine(empId){
  const machines = employeeMachines(empId);
  if(machines.length === 1){
    apRecurso = machines[0].nome;
    apRecursoCustom = '';
    return;
  }
  if(machines.length > 1 && !machines.some(function(resource){ return resource.nome === apRecurso; })){
    apRecurso = '';
    apRecursoCustom = '';
  }
}
function selectApFuncionario(id){
  apFuncionarioId = id;
  applyEmployeeMachine(id);
  renderApEmpGrid();
  renderApResGrid();
}
function selectApRecurso(nome){
  apRecurso = nome;
  apRecursoCustom = '';
  renderApResGrid();
}
function rememberIniciarFields(){
  const ordem = document.getElementById('pOrdem');
  const filter = document.getElementById('apEmpFilterInput');
  return { ordem: ordem ? ordem.value : '', filter: filter ? filter.value : apEmpFilterQuery };
}
function rerenderIniciar(saved){
  renderIniciarModalBody();
  const ordem = document.getElementById('pOrdem');
  const filter = document.getElementById('apEmpFilterInput');
  if(ordem && saved) ordem.value = saved.ordem;
  if(filter && saved){ filter.value = saved.filter; apEmpFilterQuery = saved.filter; renderApEmpGrid(); }
}
function toggleQuickEmployee(){
  apShowNewEmployee = !apShowNewEmployee;
  rerenderIniciar(rememberIniciarFields());
}
function toggleQuickMachine(){
  apShowNewMachine = !apShowNewMachine;
  rerenderIniciar(rememberIniciarFields());
}
async function saveQuickEmployee(){
  if(deny('apontamento')) return;
  const nome = document.getElementById('quickEmpNome').value.trim();
  const sobrenome = document.getElementById('quickEmpSobrenome').value.trim();
  const funcao = document.getElementById('quickEmpFuncao').value.trim() || 'Operador';
  if(!nome || !sobrenome){ toast('Informe nome e sobrenome.', 'error'); return; }
  const assignedNumber = assignEmployeeNumber(document.getElementById('quickEmpNumero') ? document.getElementById('quickEmpNumero').value : '', '');
  if(assignedNumber.error){ toast(assignedNumber.error, 'error'); return; }
  const numero = assignedNumber.numero;
  const id = uid();
  state.employees.push({ id: id, codigo: suggestAlpha(state.employees), numero: numero, nome: nome, sobrenome: sobrenome, funcao: funcao, turno: '1º Turno', vinculo: 'Efetivo', ferias: null });
  const machineIds = Array.from(document.querySelectorAll('#quickEmpMaquinas input:checked')).map(function(input){ return input.value; });
  syncEmployeeMachines(id, machineIds);
  await persist();
  apFuncionarioId = id;
  apShowNewEmployee = false;
  applyEmployeeMachine(id);
  rerenderIniciar(rememberIniciarFields());
  toast('Funcionário cadastrado — número ' + numero + '.', 'success');
}
async function saveQuickMachine(){
  if(deny('apontamento')) return;
  let nome = document.getElementById('quickResNome').value.trim().toUpperCase();
  if(!nome) nome = suggestAlpha(state.resources);
  const descricao = document.getElementById('quickResDescricao').value.trim() || nome;
  if(state.resources.some(function(resource){ return String(resource.codigo || resource.nome).toLowerCase() === nome.toLowerCase(); })){
    toast('Já existe uma máquina com este código.', 'error');
    return;
  }
  const setor = state.setores[0] || null;
  const resource = { id: uid(), codigo: nome, nome: nome, descricao: descricao, setorId: setor ? setor.id : '', setor: setor ? recordLabel(setor) : '', restricao: '', status: 'Parada', funcionarios: [], operacoes: [], grupos: [] };
  if(apFuncionarioId) resource.funcionarios.push(apFuncionarioId);
  state.resources.push(resource);
  await persist();
  apRecurso = nome;
  apRecursoCustom = '';
  apShowNewMachine = false;
  rerenderIniciar(rememberIniciarFields());
  toast('Máquina cadastrada.', 'success');
}
function refreshApontamentoDatalist(){
  const ord = document.getElementById('ordensList');
  if(ord){ ord.innerHTML = state.orders.filter(function(order){ return !orderIsClosed(order); }).map(o=>`<option value="${orderLabel(o)}">${orderLabel(o)} — ${o.codigo} — ${o.descricao}</option>`).join(''); }
}
function stepQty(inputId, delta){
  const el = document.getElementById(inputId);
  if(!el) return;
  el.value = Math.max(0, (Number(el.value)||0) + delta);
}
function punchQtyBlockHTML(p){
  const order = orderById(p.ordemId);
  const options = order ? orderItems(order).map(function(item){
    const stage = itemOpenStage(item, order);
    if(!stage) return '';
    const machine = item.equipamentoNome ? item.equipamentoNome + ' · ' : '';
    return `<option value="${item.id}">${escapeHtml(machine + (item.descricao || item.codigo) + ' · ' + stage.nome + ' · falta ' + stage.falta)}</option>`;
  }).join('') : '';
  return `
    <div class="field" style="margin-bottom:10px;">
      <label>Peça deste apontamento</label>
      <select id="qtd-item-${p.id}">${options || '<option value="">Nenhuma peça pendente</option>'}</select>
    </div>
    <div class="ap-qty-grid">
      <div>
        <div class="ap-qty-label">${icon('checkCircle',15)} Peças Produzidas</div>
        <div class="ap-stepper">
          <button type="button" onclick="stepQty('qtd-prod-${p.id}',-1)">−</button>
          <input type="number" min="0" id="qtd-prod-${p.id}" value="0">
          <button type="button" onclick="stepQty('qtd-prod-${p.id}',1)">+</button>
        </div>
        <div class="ap-quick-row">
          <button type="button" class="ap-quick-btn" onclick="stepQty('qtd-prod-${p.id}',10)">+10</button>
          <button type="button" class="ap-quick-btn" onclick="stepQty('qtd-prod-${p.id}',50)">+50</button>
        </div>
      </div>
      <div>
        <div class="ap-qty-label">${icon('alertTriangle',15)} Peças Refugadas</div>
        <div class="ap-stepper">
          <button type="button" onclick="stepQty('qtd-scrap-${p.id}',-1)">−</button>
          <input type="number" min="0" id="qtd-scrap-${p.id}" value="0">
          <button type="button" onclick="stepQty('qtd-scrap-${p.id}',1)">+</button>
        </div>
        <div class="ap-quick-row">
          <button type="button" class="ap-quick-btn" onclick="stepQty('qtd-scrap-${p.id}',5)">+5</button>
          <button type="button" class="ap-quick-btn" onclick="stepQty('qtd-scrap-${p.id}',10)">+10</button>
        </div>
      </div>
    </div>`;
}
async function startPunch(){
  if(deny('apontamento')) return;
  const funcionarioId = apFuncionarioId;
  const recurso = (apRecursoCustom||'').trim() || apRecurso;
  const ordemId = document.getElementById('pOrdem').value.trim().toUpperCase();
  if(!funcionarioId){ toast('Toque no seu nome no passo 1.', 'error'); beepError(); return; }
  if(!recurso){ toast('Selecione a máquina no passo 2.', 'error'); beepError(); return; }
  const order = orderById(ordemId);
  if(!order){ toast('Ordem de produção não encontrada: ' + ordemId, 'error'); beepError(); return; }
  if(order.status === 'Concluída'){ toast('Esta ordem já está concluída.', 'error'); beepError(); return; }
  state.punches.push({ id: uid(), ordemId: order.id, funcionarioId, recurso, inicio: nowISO(), fim:null, quantidadeProduzida:0, quantidadeRefugada:0, status:'Aberto' });
  recalcOrderStatus(order);
  await persist();
  beepStart();
  toast('Apontamento iniciado — ' + orderLabel(order), 'success');
  apFuncionarioId=''; apRecurso=''; apRecursoCustom='';
  closeIniciarModal();
  renderApontamento();
  renderNav();
}
async function endPunch(punchId){
  if(deny('apontamento')) return;
  const p = state.punches.find(x=>x.id===punchId);
  if(!p) return;
  const prod = Number(document.getElementById('qtd-prod-'+punchId).value) || 0;
  const scrap = Number(document.getElementById('qtd-scrap-'+punchId).value) || 0;
  p.quantidadeProduzida = prod;
  p.quantidadeRefugada = scrap;
  p.fim = nowISO();
  p.status = 'Fechado';
  const order = orderById(p.ordemId);
  if(order){
    const chosen = document.getElementById('qtd-item-'+punchId);
    const item = chosen && (order.itens || []).find(function(entry){ return entry.id === chosen.value; });
    if(prod > 0 && orderUsesRoute(order) && !item){
      toast('Escolha a peça deste apontamento.', 'error');
      p.fim = null;
      p.status = 'Aberto';
      p.quantidadeProduzida = 0;
      p.quantidadeRefugada = 0;
      return;
    }
    if(item && prod > 0){
      const resource = state.resources.find(function(entry){ return entry.nome === p.recurso || entry.codigo === p.recurso; });
      const product = productByCode(item.codigo);
      const allowed = product && Array.isArray(product.maquinas) && product.maquinas.length ? product.maquinas : null;
      const stage = itemOpenStage(item, order);
      const step = stage && stage.key === 'etapa' ? item.rota[stage.index] : null;
      const blocked = (step && step.maquinaId && (!resource || resource.id !== step.maquinaId)) || (allowed && resource && allowed.indexOf(resource.id) < 0);
      if(blocked){
        toast('Esta peça não pode ser feita nesta máquina.', 'error');
        p.fim = null;
        p.status = 'Aberto';
        p.quantidadeProduzida = 0;
        p.quantidadeRefugada = 0;
        return;
      }
      applyItemQty(item, prod, order);
    }
    recalcOrderStatus(order);
  }
  await persist();
  beepEnd();
  toast('Apontamento encerrado — ' + punchOrderLabel(p), 'success');
  renderNav();
}

/* --- Finalizar (modal: operador -> recurso -> quantidades) --- */
function openPunchesForFuncionario(empId){ return state.punches.filter(p=>p.status==='Aberto' && p.funcionarioId===empId); }
function openFinalizarModal(){
  if(deny('apontamento')) return;
  finFuncionarioId=''; finPunchId=''; finEmpFilterQuery='';
  renderFinalizarStep1();
  openModal('modalFinalizar');
}
function closeFinalizarModal(){ closeModal('modalFinalizar'); }
function renderFinalizarStep1(){
  const holder = document.getElementById('finalizarModalBody');
  const openPunches = state.punches.filter(p=>p.status==='Aberto');
  const empIds = Array.from(new Set(openPunches.map(p=>p.funcionarioId)));
  let emps = empIds.map(id=>state.employees.find(e=>e.id===id)).filter(Boolean);
  if(!emps.length){
    holder.innerHTML = `<div class="empty-state" style="padding:30px 10px;"><div class="ic">${icon('clock',30)}</div>Nenhum apontamento em aberto no momento.</div>`;
    return;
  }
  const q = finEmpFilterQuery.trim().toLowerCase();
  if(q){ emps = emps.filter(e => (e.numero||'').includes(q) || (e.nome+' '+e.sobrenome).toLowerCase().includes(q)); }
  if(/^\d{1,4}$/.test(q)){
    const padded = q.padStart(4,'0');
    const exact = empIds.map(id=>state.employees.find(e=>e.id===id)).find(e=>e && e.numero===padded);
    if(exact){ finEmpFilterQuery=''; selectFinFuncionario(exact.id); return; }
  }
  holder.innerHTML = `
    <div class="ap-step" style="margin-bottom:0; border-left-color:var(--red);">
      <div class="ap-step-head"><div class="ap-step-num" style="background:var(--red);">1</div><div class="ap-step-title">Quem está finalizando?</div></div>
      <div class="field" style="margin-bottom:14px;">
        <label>Digite seu número ou nome</label>
        <input id="finEmpFilterInput" value="${finEmpFilterQuery}" placeholder="Ex: 0007 ou Carlos" oninput="finEmpFilterQuery=this.value; renderFinalizarStep1();">
      </div>
      <div class="ap-emp-grid">
        ${emps.length ? emps.map(e=>`<button type="button" class="ap-emp-btn" onclick="selectFinFuncionario('${e.id}')">
          ${employeeAvatarHTML(e,'ap-emp-avatar')}
          <div class="ap-emp-btn-name">${e.nome}<br>${e.sobrenome}</div>
          <div class="ap-emp-num">Nº ${e.numero||'—'}</div>
        </button>`).join('') : `<div class="empty-state" style="grid-column:1/-1; padding:20px;">Ninguém encontrado com esse número/nome entre os apontamentos abertos.</div>`}
      </div>
    </div>
  `;
}
function selectFinFuncionario(empId){
  finFuncionarioId = empId;
  const punches = openPunchesForFuncionario(empId);
  if(punches.length===1){ finPunchId = punches[0].id; renderFinalizarStep3(); }
  else{ renderFinalizarStep2(); }
}
function renderFinalizarStep2(){
  const holder = document.getElementById('finalizarModalBody');
  const punches = openPunchesForFuncionario(finFuncionarioId);
  holder.innerHTML = `
    <div class="ap-step" style="margin-bottom:0; border-left-color:var(--red);">
      <div class="ap-step-head"><div class="ap-step-num" style="background:var(--red);">2</div><div class="ap-step-title">Qual máquina?</div></div>
      <div class="ap-res-grid">
        ${punches.map(p=>`<button type="button" class="ap-res-btn" onclick="selectFinPunch('${p.id}')">
          <div class="ap-res-code-big">${p.recurso}</div>
          <div class="ap-res-desc-small">${punchOrderLabel(p)} · ${elapsedLabel(p.inicio)}</div>
        </button>`).join('')}
      </div>
    </div>
  `;
}
function selectFinPunch(punchId){ finPunchId = punchId; renderFinalizarStep3(); }
function renderFinalizarStep3(){
  const holder = document.getElementById('finalizarModalBody');
  const p = state.punches.find(x=>x.id===finPunchId);
  if(!p){ renderFinalizarStep1(); return; }
  holder.innerHTML = `
    <div class="ap-punch-card" style="margin-bottom:0;">
      <div class="ap-punch-top">
        <div>
          <div class="ap-punch-op">${punchOrderLabel(p)}</div>
          <div class="ap-punch-meta" style="display:flex; align-items:center; gap:7px; flex-wrap:wrap;">${employeeIdentityHTML(p.funcionarioId,true)}<span>· ${p.recurso} · iniciado ${elapsedLabel(p.inicio)}</span></div>
        </div>
      </div>
      ${punchQtyBlockHTML(p)}
      <button class="ap-end-btn" onclick="confirmFinalize('${p.id}')">${icon('stop',18)} CONFIRMAR FINALIZAÇÃO</button>
    </div>
  `;
}
async function confirmFinalize(punchId){
  if(deny('apontamento')) return;
  await endPunch(punchId);
  closeFinalizarModal();
  renderApontamento();
}

/* ===================== QR SCANNER ===================== */
let scannerStream = null;
let scannerRAF = null;
function openScanner(){
  openModal('modalScanner');
  document.getElementById('scannerStatus').textContent = 'Solicitando acesso à câmera…';
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    document.getElementById('scannerStatus').textContent = 'Câmera não disponível neste dispositivo. Digite o código da OP manualmente.';
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream=>{
    scannerStream = stream;
    const video = document.getElementById('scannerVideo');
    video.srcObject = stream; video.play();
    document.getElementById('scannerStatus').textContent = 'Aponte a câmera para o QR Code da ordem…';
    scanLoop();
  }).catch(()=>{ document.getElementById('scannerStatus').textContent = 'Não foi possível acessar a câmera. Digite o código da OP manualmente.'; });
}
function scanLoop(){
  const video = document.getElementById('scannerVideo');
  const canvas = document.getElementById('hiddenCanvas');
  if(!video || video.readyState !== video.HAVE_ENOUGH_DATA){ scannerRAF = requestAnimationFrame(scanLoop); return; }
  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  try{
    if(window.jsQR){
      const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if(code && code.data){
        document.getElementById('pOrdem').value = code.data.trim().toUpperCase();
        document.getElementById('scannerStatus').textContent = 'QR Code lido: ' + code.data;
        beepStart();
        closeScanner();
        return;
      }
    }
  }catch(e){}
  scannerRAF = requestAnimationFrame(scanLoop);
}
function closeScanner(){
  closeModal('modalScanner');
  if(scannerRAF) cancelAnimationFrame(scannerRAF);
  if(scannerStream){ scannerStream.getTracks().forEach(t=>t.stop()); scannerStream = null; }
}

/* ===================== ACOMPANHAMENTO DE PRODUÇÃO ===================== */
let acompSearch = '';
function renderAcompanhamento(){
  recalcAllOrderStatuses();
  const el = document.getElementById('panel-acompanhamento');
  el.innerHTML = `
    <div class="section-title">${icon('search',19)} Acompanhamento de Produção</div>
    <div class="section-sub">Pesquise por ordem de produção ou código da peça para verificar o status.</div>
    <div class="toolbar">
      <div class="search-box"><span class="search-ic">${icon('search',15)}</span><input placeholder="Buscar OP ou código..." oninput="acompSearch=this.value; renderAcompTable();"></div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Ordem</th><th>Código</th><th>Descrição</th><th>Progresso</th><th>Status</th><th>Refugo</th><th></th></tr></thead>
        <tbody id="acompTbody"></tbody>
      </table>
    </div>
    <div id="acompDetail" style="margin-top:20px;"></div>
    <div id="taskBoard"></div>
    <div id="studyBoard"></div>
  `;
  renderAcompTable();
  renderTaskBoard();
  renderStudyBoard();
}
function renderAcompTable(){
  const tbody = document.getElementById('acompTbody');
  if(!tbody) return;
  const q = acompSearch.trim().toLowerCase();
  const list = state.orders.filter(o=> !q || orderLabel(o).toLowerCase().includes(q) || o.codigo.toLowerCase().includes(q)).sort((a,b)=>b.criadoEm.localeCompare(a.criadoEm));
  tbody.innerHTML = list.length ? list.map(o=>{
    const progress = orderProgress(o);
    const produced = progress.produced;
    const scrap = orderScrapQty(o.id);
    const pct = Math.min(100, progress.pct);
    return `<tr style="cursor:pointer;" onclick="showAcompDetail('${o.id}')">
      <td style="color:var(--blue); font-weight:700;">${orderLabel(o)}</td>
      <td>${o.codigo}</td>
      <td>${o.descricao}</td>
      <td style="min-width:140px;">
        <div class="progress-track" style="margin-bottom:4px;"><div class="progress-fill" style="width:${pct}%;"></div></div>
        <div style="font-size:10.5px; color:var(--text-faint);">${progress.pct}% · ${produced}/${progress.planned}</div>
      </td>
      <td>${orderStatusBadge(o.status)}</td>
      <td class="mono">${scrap}</td>
      <td style="white-space:nowrap;">
        <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); showOrderInfo('${o.id}')">${icon('info',13)} INFO</button>
        <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); showOrderQR('${o.id}')">${icon('qrscan',13)} QR</button>
        <button class="icon-btn" onclick="event.stopPropagation(); printOrder('${o.id}')" title="Imprimir Ordem">${icon('printer',15)}</button>
      </td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="7">Nenhuma ordem encontrada.</td></tr>`;
}
function showAcompDetail(orderId){
  const order = orderById(orderId);
  const detail = document.getElementById('acompDetail');
  const punches = state.punches.filter(p=>p.ordemId===orderId).sort((a,b)=>b.inicio.localeCompare(a.inicio));
  detail.innerHTML = `
    <div class="card">
      <div class="section-title" style="font-size:14px;">Histórico de Apontamentos — ${orderLabel(order)}</div>
      <div class="table-wrap" style="margin-top:10px;">
        <table>
          <thead><tr><th>Funcionário</th><th>Recurso</th><th>Início</th><th>Fim</th><th>Produzido</th><th>Refugo</th><th>Status</th></tr></thead>
          <tbody>
          ${punches.length ? punches.map(p=>`
            <tr>
              <td>${employeeIdentityHTML(p.funcionarioId,true)}</td>
              <td>${p.recurso}</td>
              <td class="mono">${fmtDateTime(p.inicio)}</td>
              <td class="mono">${p.fim ? fmtDateTime(p.fim) : '—'}</td>
              <td class="mono">${p.quantidadeProduzida}</td>
              <td class="mono">${p.quantidadeRefugada}</td>
              <td>${p.status==='Aberto' ? '<span class="badge badge-blue">Aberto</span>' : '<span class="badge badge-green">Fechado</span>'}</td>
            </tr>`).join('') : `<tr class="empty-row"><td colspan="7">Nenhum apontamento registrado para esta ordem.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ===================== CONFIGURAÇÕES E LOGIN ===================== */
const MODULE_OPTIONS = NAV.filter(function(entry){ return entry.module !== 'configuracoes' && entry.module !== 'suporte'; });
function showLoginMessage(text){
  const box = document.getElementById('loginMessage');
  if(!box) return;
  box.hidden = !text;
  box.textContent = text || '';
}
function showLogin(needsSetup){
  const gate = document.getElementById('loginGate');
  const app = document.getElementById('prodfy-app');
  if(gate) gate.hidden = false;
  if(app) app.classList.add('is-locked');
  const setup = document.getElementById('setupForm');
  const login = document.getElementById('loginForm');
  if(setup) setup.hidden = !needsSetup;
  if(login) login.hidden = !!needsSetup;
  const forgot = document.getElementById('forgotForm');
  const force = document.getElementById('forcePasswordForm');
  if(forgot) forgot.hidden = true;
  if(force) force.hidden = true;
  const hint = document.getElementById('loginHint');
  if(hint) hint.textContent = needsSetup
    ? 'Ainda não existe conta. A primeira pessoa vira administrador suporte e tem acesso completo.'
    : 'Use o e-mail e a senha da sua conta para abrir o chão de fábrica.';
  if(location.pathname !== '/login'){
    returnPath = location.pathname;
    history.replaceState({}, '', '/login');
  }
}
function hideLogin(){
  const gate = document.getElementById('loginGate');
  const app = document.getElementById('prodfy-app');
  if(gate) gate.hidden = true;
  if(app) app.classList.remove('is-locked');
}
function endSession(message){
  localStorage.removeItem('prodfy_jwt');
  knownCompanies = [];
  companyListLoaded = false;
  companyListReady = false;
  supportTickets = [];
  notifications = [];
  rememberSession(null);
  showLogin(false);
  if(message) showLoginMessage(message);
}
function kickIfCompanyClosed(error){
  if(!error || (error.code !== 'COMPANY_BLOCKED' && error.code !== 'COMPANY_EXPIRED')) return false;
  if(sessionUser && sessionUser.role === 'administrador_suporte') return false;
  endSession(error.message);
  return true;
}
async function accountApi(path, options){
  options = options || {};
  const headers = Object.assign({ 'Content-Type': 'application/json' }, companyHeaders(), options.headers || {});
  if(authToken()) headers.Authorization = 'Bearer ' + authToken();
  const response = await fetch(apiBase() + path, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if(!response.ok){
    const detail = payload && payload.error && Array.isArray(payload.error.details) && payload.error.details[0] && payload.error.details[0].message;
    const error = new Error(detail || (payload && payload.error ? payload.error.message : 'Falha na API.'));
    error.status = response.status;
    error.code = payload && payload.error ? payload.error.code : '';
    if(error.code === 'SESSION_REPLACED'){
      endSession(error.message);
      throw error;
    }
    kickIfCompanyClosed(error);
    throw error;
  }
  return payload;
}
function checkedModules(containerId){
  const boxes = document.querySelectorAll('#' + containerId + ' input:checked');
  const chosen = [];
  Array.prototype.forEach.call(boxes, function(box){
    if(chosen.indexOf(box.value) < 0) chosen.push(box.value);
  });
  return chosen;
}
function syncSameModule(input){
  const grid = input.closest('.perm-grid');
  if(!grid) return;
  grid.querySelectorAll('input[value="' + input.value + '"]').forEach(function(box){ box.checked = input.checked; });
}
function permissionGrid(id, selected){
  return `<div class="perm-grid" id="${id}">${MODULE_OPTIONS.map(function(item){
    const checked = selected.indexOf(item.module) >= 0 ? 'checked' : '';
    return `<label class="perm-item"><input type="checkbox" value="${item.module}" ${checked} onchange="syncSameModule(this)"> ${item.label}</label>`;
  }).join('')}</div>`;
}
let accessUserCache = null;
let profileRole = 'visualizador';
let companyProfiles = [];
let draftBlocked = false;
let editingBlocked = false;
function nextAlphaCode(codes){
  let max = -1;
  (codes || []).forEach(function(code){
    const text = String(code || '').trim().toUpperCase();
    if(!/^[A-Z]+$/.test(text)) return;
    let current = 0;
    for(let index = 0; index < text.length; index++) current = current * 26 + (text.charCodeAt(index) - 65);
    if(current > max) max = current;
  });
  return alphaCode(max + 1);
}
function alphaCode(index){
  let value = Math.max(0, index);
  let text = '';
  do {
    text = String.fromCharCode(65 + (value % 26)) + text;
    value = Math.floor(value / 26);
  } while(value > 0);
  while(text.length < 2) text = 'A' + text;
  return text;
}
function companyProfileRoles(){
  return ['visualizador','operador','administrador'];
}
function currentCompanyProfile(){
  return companyProfiles.find(function(profile){ return profile.role === profileRole; }) || { view: [], edit: [], sectors: [] };
}
function sectorCheckMarkup(selected){
  const names = [];
  (state.setores || []).forEach(function(setor){
    const name = recordLabel(setor);
    if(name && names.indexOf(name) < 0) names.push(name);
  });
  if(!names.length) return '<div class="section-sub">Ainda não há setores. Cadastre em Cadastro, na opção Setor. Sem marcação, o perfil vê todos os setores.</div>';
  return `<div class="perm-grid" id="profileSectors">${names.map(function(name){
    const checked = (selected || []).some(function(item){ return sectorKey(item) === sectorKey(name); }) ? 'checked' : '';
    return `<label class="perm-item"><input type="checkbox" value="${escapeHtml(name)}" ${checked}> ${escapeHtml(name)}</label>`;
  }).join('')}</div>
    <div class="section-sub">Nenhum setor marcado libera todos. Marcado, o perfil só vê esses setores. Ex.: Chaparia não vê Usinagem.</div>`;
}
function roleCheckMarkup(){
  const current = currentCompanyProfile();
  return `<div class="section-sub">Pode ver. Desmarque tudo para esconder os módulos.</div>${permissionGrid('profileView', current.view || [])}
    <div class="section-sub">Pode editar. Vazio deixa o perfil só visualizar.</div>${permissionGrid('profileEdit', current.edit || [])}
    <div class="section-sub">Setores que este perfil pode ver</div>${sectorCheckMarkup(current.sectors || [])}`;
}
let settingsChoice = 'usuario';
function renderConfiguracoes(){
  const el = document.getElementById('panel-configuracoes');
  if(!el || !sessionUser) return;
  const choices = [
    ['usuario', 'Usuários', 'Código, nome, perfil, bloqueio e acessos.'],
    ['empresa', 'Empresa', 'Código, descrição e perfis desta empresa.']
  ];
  if(settingsChoice !== 'usuario' && settingsChoice !== 'empresa' && settingsChoice !== 'perfis') settingsChoice = 'usuario';
  el.innerHTML = `
    <div class="section-title">${icon('sliders',19)} Configurações</div>
    <div class="section-sub">Escolha um assunto. Os outros ficam fora desta tela.</div>
    <div class="settings-choices">${choices.map(function(choice){
      const active = (settingsChoice === 'perfis' ? 'empresa' : settingsChoice) === choice[0];
      return `<button class="settings-choice${active?' active':''}" type="button" onclick="setSettingsChoice('${choice[0]}')"><b>${choice[1]}</b><span>${choice[2]}</span></button>`;
    }).join('')}</div>
    <div id="settingsPanel"></div>`;
  renderSettingsPanel();
}
function setSettingsChoice(id){
  settingsChoice = id;
  renderConfiguracoes();
}
function renderSettingsPanel(){
  const panel = document.getElementById('settingsPanel');
  if(!panel || !sessionUser) return;
  if(settingsChoice === 'perfis'){
    panel.innerHTML = '<div id="companyProfiles" class="card">Carregando perfis…</div>';
    loadCompanyProfiles();
    return;
  }
  if(settingsChoice === 'usuario'){
    const roles = sessionUser.role === 'administrador_suporte'
      ? ['visualizador','operador','administrador','administrador_suporte']
      : ['visualizador','operador','administrador'];
    panel.innerHTML = canManageUsers() ? `
      <form id="accessUserForm" class="card" style="margin-bottom:14px;" onsubmit="saveAccessUser(event)">
        <div class="section-title" style="font-size:16px;">Usuários</div>
        <div class="section-sub">O perfil escolhido aqui usa as regras da empresa. O que ele vê e edita fica em Empresa → Perfis de usuário.</div>
        <input type="hidden" id="editingUserId" value="">
        <div class="field-row">
          <div class="field"><label>Código</label><input id="userCode" maxlength="12" autocomplete="off" oninput="this.dataset.touched='1'"></div>
          <div class="field"><label>Descrição</label><input id="userName" required minlength="2" maxlength="80"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>E-mail</label><input id="userEmail" type="email" required></div>
          <div class="field"><label>Perfil de usuário</label>
            <select id="userRole" onchange="fillUserCompanySelect(); suggestUserCode();">${roles.map(function(role){ return `<option value="${role}">${ROLE_LABELS[role]}</option>`; }).join('')}</select>
          </div>
        </div>
        <div class="field-row">
          <div class="field"><label>Senha provisória</label>
            <div class="password-field">
              <input id="userPassword" type="password" maxlength="72" autocomplete="new-password" placeholder="Opcional. Vazio gera uma senha ao criar.">
              <button class="eye-btn" type="button" onclick="togglePassword('userPassword', this)" aria-label="Mostrar senha">${icon('eye',16)}</button>
            </div>
          </div>
          <div class="field"><label>Bloqueado</label>
            <button class="btn" id="userBlockedBtn" type="button" onclick="toggleDraftBlocked()">Não</button>
          </div>
        </div>
        <div class="field" id="userCompanyField">
          <label>Empresa</label>
          <select id="userCompany" onchange="suggestUserCode()"><option value="">Escolha a empresa</option></select>
        </div>
        <button class="btn btn-primary" type="submit">Salvar usuário</button>
      </form>
      <div class="card"><div class="table-wrap"><table>
        <thead><tr><th>Código</th><th>Descrição</th><th>Perfil</th><th>Empresa</th><th>Bloqueado</th><th>Cadastro</th><th>Último acesso</th><th style="width:90px;"></th></tr></thead>
        <tbody id="accessUsersBody"><tr class="empty-row"><td colspan="8">Carregando contas…</td></tr></tbody>
      </table></div></div>
      <div class="card" style="margin-top:14px;" id="passwordRequestList">Carregando pedidos de senha…</div>` : `<div class="card">Contas novas são criadas por um administrador. Os seus dados ficam em Perfil de Usuário.</div>`;
    if(canManageUsers()){
      draftBlocked = false;
      editingBlocked = false;
      fillUserCompanySelect();
      loadAccessUsers();
      loadPasswordRequests();
    }
    return;
  }
  panel.innerHTML = '<div id="companySettings"></div>';
  renderCompanySettings();
}
let accessCompanies = [];
function userCompanyLabel(user){
  if(user.role === 'administrador_suporte') return 'Todas';
  const company = accessCompanies.find(function(item){ return item.id === user.companyId; });
  return company ? company.name : 'Sem empresa';
}
function fillUserCompanySelect(selectedId){
  const select = document.getElementById('userCompany');
  const field = document.getElementById('userCompanyField');
  const role = document.getElementById('userRole');
  if(!select || !field || !role) return;
  const show = sessionUser && sessionUser.role === 'administrador_suporte' && role.value !== 'administrador_suporte';
  field.style.display = show ? '' : 'none';
  const current = selectedId !== undefined ? selectedId : select.value;
  select.innerHTML = '<option value="">Escolha a empresa</option>' + accessCompanies.map(function(company){
    return `<option value="${company.id}" ${company.id===current?'selected':''}>${escapeHtml(company.name)}</option>`;
  }).join('');
}
async function loadAccessUsers(){
  const body = document.getElementById('accessUsersBody');
  if(!body) return;
  try{
    try{ accessCompanies = companiesByName((await accountApi('/api/companies')).data || []); }catch(e){ accessCompanies = []; }
    fillUserCompanySelect();
    const result = await accountApi('/api/users');
    accessUserCache = result.data || [];
    body.innerHTML = accessUserCache.map(function(user){
      const mine = sessionUser && sessionUser.id === user.id;
      const missing = user.role !== 'administrador_suporte' && !user.companyId;
      return `<tr>
        <td class="mono">${escapeHtml(user.code || '—')}</td>
        <td>${escapeHtml(user.name)}</td>
        <td>${escapeHtml(ROLE_LABELS[user.role] || user.role)}</td>
        <td${missing ? ' style="color:var(--red-dark); font-weight:700;"' : ''}>${escapeHtml(userCompanyLabel(user))}</td>
        <td>${mine ? (user.blocked ? 'Sim' : 'Não') : `<button class="btn btn-sm" type="button" onclick="toggleUserBlock('${user.id}', ${user.blocked ? 'false' : 'true'})">${user.blocked ? 'Sim' : 'Não'}</button>`}</td>
        <td class="mono">${fmtDateTime(user.createdAt)}</td>
        <td class="mono">${fmtDateTime(user.lastAccessAt)}</td>
        <td>
          <button class="icon-btn" type="button" onclick="editAccessUser('${user.id}')" title="Editar">${icon('edit',14)}</button>
          <button class="icon-btn danger" type="button" onclick="deleteAccessUser('${user.id}')" ${mine ? 'disabled' : ''} title="Excluir">${icon('trash',14)}</button>
        </td>
      </tr>`;
    }).join('') || `<tr class="empty-row"><td colspan="8">Nenhuma conta.</td></tr>`;
    suggestUserCode();
  }catch(error){
    body.innerHTML = `<tr class="empty-row"><td colspan="8">${escapeHtml(error.message)}</td></tr>`;
  }
}
function toggleDraftBlocked(){
  draftBlocked = !draftBlocked;
  const button = document.getElementById('userBlockedBtn');
  if(button) button.textContent = draftBlocked ? 'Sim' : 'Não';
}
function suggestUserCode(){
  const input = document.getElementById('userCode');
  const editing = document.getElementById('editingUserId');
  if(!input || (editing && editing.value) || input.dataset.touched === '1') return;
  const role = document.getElementById('userRole');
  const company = document.getElementById('userCompany');
  const companyId = role && role.value === 'administrador_suporte' ? null : (company && company.value ? company.value : (sessionUser && sessionUser.companyId));
  const codes = (accessUserCache || []).filter(function(user){ return (user.companyId || null) === (companyId || null); }).map(function(user){ return user.code; });
  input.value = nextAlphaCode(codes);
}
async function editAccessUser(id){
  try{
    const result = await accountApi('/api/users/' + id);
    const user = result.data;
    document.getElementById('editingUserId').value = user.id;
    const code = document.getElementById('userCode');
    code.value = user.code || '';
    code.dataset.touched = '1';
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = user.role;
    draftBlocked = !!user.blocked;
    editingBlocked = !!user.blocked;
    const blocked = document.getElementById('userBlockedBtn');
    if(blocked) blocked.textContent = draftBlocked ? 'Sim' : 'Não';
    fillUserCompanySelect(user.companyId || '');
  }catch(error){
    toast(error.message, 'error');
  }
}
function profileCompanyId(){
  if(sessionUser && sessionUser.role === 'administrador_suporte') return activeCompanyId();
  return sessionUser ? sessionUser.companyId : '';
}
function showProfileRole(role){
  profileRole = role;
  const box = document.getElementById('profileChecks');
  if(box) box.innerHTML = roleCheckMarkup();
}
async function loadCompanyProfiles(){
  const box = document.getElementById('companyProfiles');
  if(!box) return;
  const companyId = profileCompanyId();
  if(!companyId){
    box.innerHTML = '<div class="section-sub">Escolha a empresa antes de configurar os perfis.</div>';
    return;
  }
  try{
    companyProfiles = (await accountApi('/api/companies/' + companyId + '/profiles')).data || [];
    if(companyProfileRoles().indexOf(profileRole) < 0) profileRole = 'visualizador';
    box.innerHTML = `<form onsubmit="saveCompanyProfile(event)">
      <div class="section-title" style="font-size:16px;">Perfil de usuário por empresa</div>
      <div class="section-sub">Cada empresa tem o próprio ADM, operador e visualizador. Dá para liberar tudo, só visualizar ou esconder módulos e setores.</div>
      <div class="field"><label>Perfil</label>
        <select id="roleProfile" onchange="showProfileRole(this.value)">${companyProfileRoles().map(function(role){
          return `<option value="${role}" ${role===profileRole?'selected':''}>${ROLE_LABELS[role]}</option>`;
        }).join('')}</select>
      </div>
      <div id="profileChecks">${roleCheckMarkup()}</div>
      <button class="btn" type="button" onclick="setSettingsChoice('empresa')">Voltar</button>
      <button class="btn btn-primary" type="submit">Salvar perfil</button>
    </form>`;
  }catch(error){
    box.textContent = error.message;
  }
}
async function saveCompanyProfile(event){
  event.preventDefault();
  if(!canManageUsers()) return;
  const companyId = profileCompanyId();
  const role = document.getElementById('roleProfile').value;
  const permissions = {
    view: checkedModules('profileView'),
    edit: checkedModules('profileEdit'),
    sectors: checkedModules('profileSectors')
  };
  try{
    await accountApi('/api/companies/' + companyId + '/profiles/' + role, { method:'PUT', body: permissions });
    if(sessionUser && sessionUser.companyId === companyId && sessionUser.role === role){
      const me = await accountApi('/api/auth/me');
      rememberSession(me.data);
      renderNav();
      await syncNow();
    }
    toast('Perfil salvo nesta empresa.', 'success');
    await loadCompanyProfiles();
  }catch(error){
    toast(error.message, 'error');
  }
}
async function saveAccessUser(event){
  event.preventDefault();
  const id = document.getElementById('editingUserId').value;
  const role = document.getElementById('userRole').value;
  const code = document.getElementById('userCode').value.trim().toUpperCase();
  if(!/^[A-Z0-9]{1,12}$/.test(code)){
    toast('O código usa até 12 letras ou números.', 'error');
    return;
  }
  const body = {
    code: code,
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    role: role
  };
  const password = document.getElementById('userPassword').value.trim();
  if(password && (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password))){
    toast('A senha precisa ter 8 caracteres, uma maiúscula, um número e um caractere especial.', 'error');
    return;
  }
  try{
    if(sessionUser.role === 'administrador_suporte' && role !== 'administrador_suporte'){
      body.companyId = document.getElementById('userCompany').value;
      if(!body.companyId){
        toast('Escolha a empresa do usuário.', 'error');
        return;
      }
    }
    if(password) body.password = password;
    if(id){
      await accountApi('/api/users/' + id, { method:'PUT', body: body });
      if(draftBlocked !== editingBlocked){
        await accountApi('/api/users/' + id + '/block', { method:'POST', body:{ blocked: draftBlocked } });
      }
      toast('Usuário salvo.', 'success');
    }else{
      body.blocked = draftBlocked;
      const created = await accountApi('/api/users', { method:'POST', body: body });
      if(!password && created.data.provisionalPassword){
        window.alert('Senha provisória, mostrada uma vez:\n' + created.data.provisionalPassword + '\nA pessoa troca no primeiro acesso.');
      }
      toast(password ? 'Usuário criado. No primeiro acesso a pessoa troca essa senha.' : 'Usuário criado. A senha provisória foi mostrada nesta tela.', 'success');
    }
    event.target.reset();
    document.getElementById('editingUserId').value = '';
    document.getElementById('userCode').dataset.touched = '';
    draftBlocked = false;
    editingBlocked = false;
    const blocked = document.getElementById('userBlockedBtn');
    if(blocked) blocked.textContent = 'Não';
    fillUserCompanySelect();
    await loadAccessUsers();
  }catch(error){
    toast(error.message, 'error');
  }
}
async function deleteAccessUser(id){
  if(!confirm('Excluir esta conta?')) return;
  try{
    await accountApi('/api/users/' + id, { method:'DELETE' });
    toast('Conta excluída.', 'success');
    await loadAccessUsers();
  }catch(error){
    toast(error.message, 'error');
  }
}
async function logout(){
  supportTickets = [];
  notifications = [];
  unreadNotified = -1;
  localStorage.removeItem('prodfy_jwt');
  knownCompanies = [];
  companyListLoaded = false;
  companyListReady = false;
  rememberSession(null);
  showLogin(false);
  renderNotifButton();
}
async function enterApp(){
  if(sessionUser && sessionUser.mustChangePassword){
    showForcePassword();
    return;
  }
  hideLogin();
  renderShell();
  renderNav();
  await loadData();
  startClock();
  const requested = tabFromPath(returnPath || location.pathname) || firstVisibleTab();
  returnPath = '';
  setTab(requested, { replace:true });
  if(!navigator.onLine) toast('Sem internet. Dá para continuar; as alterações sobem quando a conexão voltar.', 'success');
  else if(sessionUser.role === 'visualizador') toast('Perfil visualizador. As áreas liberadas ficam só para consulta.', 'success');
  else if(syncError) toast('As alterações ficaram neste aparelho e sobem quando a API responder.', 'error');
  else toast('Produção ligada ao banco. O mesmo conteúdo aparece nos outros aparelhos.', 'success');
  refreshSupportInbox();
}
async function boot(){
  window.addEventListener('popstate', function(){
    if(!sessionUser){ showLogin(false); return; }
    const tab = tabFromPath(location.pathname) || firstVisibleTab();
    setTab(tab, { quiet:true });
  });
  const cached = readSessionCache();
  if(!authToken()){
    let needsSetup = false;
    if(navigator.onLine){
      try{
        const status = await accountApi('/api/auth/status');
        needsSetup = !!(status.data && status.data.needsSetup);
      }catch(e){}
    }
    showLogin(needsSetup);
    return;
  }
  if(!navigator.onLine && cached){
    rememberSession(cached);
    await enterApp();
    return;
  }
  try{
    const me = await accountApi('/api/auth/me');
    rememberSession(me.data);
    await enterApp();
  }catch(error){
    if(!navigator.onLine && cached){
      rememberSession(cached);
      await enterApp();
      return;
    }
    localStorage.removeItem('prodfy_jwt');
    rememberSession(null);
    showLoginMessage(error.message);
    showLogin(false);
  }
}
function bindLoginForms(){
  const login = document.getElementById('loginForm');
  const setup = document.getElementById('setupForm');
  if(login) login.addEventListener('submit', async function(event){
    event.preventDefault();
    showLoginMessage('');
    try{
      const result = await accountApi('/api/auth/login', {
        method:'POST',
        body:{ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPassword').value }
      });
      localStorage.setItem('prodfy_jwt', result.data.accessToken);
      rememberSession(result.data.user);
      await enterApp();
    }catch(error){
      showLoginMessage(error.message);
    }
  });
  const forgot = document.getElementById('forgotForm');
  if(forgot) forgot.addEventListener('submit', async function(event){
    event.preventDefault();
    showLoginMessage('');
    try{
      const result = await accountApi('/api/auth/password-requests', { method:'POST', body:{ email: document.getElementById('forgotEmail').value } });
      showLoginMessage(result.data.message);
    }catch(error){
      showLoginMessage(error.message);
    }
  });
  const force = document.getElementById('forcePasswordForm');
  if(force) force.addEventListener('submit', async function(event){
    event.preventDefault();
    showLoginMessage('');
    try{
      const updated = await accountApi('/api/users/' + sessionUser.id, { method:'PUT', body:{ password: document.getElementById('forcePassword').value } });
      rememberSession(Object.assign({}, sessionUser, updated.data, { mustChangePassword:false }));
      await enterApp();
    }catch(error){
      showLoginMessage(error.message);
    }
  });
  if(setup) setup.addEventListener('submit', async function(event){
    event.preventDefault();
    showLoginMessage('');
    try{
      const result = await accountApi('/api/auth/register', {
        method:'POST',
        body:{
          name: document.getElementById('setupName').value,
          email: document.getElementById('setupEmail').value,
          password: document.getElementById('setupPassword').value
        }
      });
      localStorage.setItem('prodfy_jwt', result.data.accessToken);
      rememberSession(result.data.user);
      await enterApp();
    }catch(error){
      showLoginMessage(error.message);
    }
  });
}

/* ===================== INIT ===================== */
async function init(){
  bindLoginForms();
  document.addEventListener('click', function(event){
    const wrap = document.querySelector('.notif-wrap');
    if(!notifOpen || !wrap || wrap.contains(event.target)) return;
    notifOpen = false;
    renderNotifPanel();
  });
  await boot();
  setInterval(function(){
    if(activeTab==='dashboard') renderRankingAndCharts();
    if(activeTab==='apontamento'){ renderApontamento(); applyAccess(); }
    refreshSupportInbox();
  }, 15000);
  const notifButton = document.getElementById('notifButton');
  if(notifButton && !notifButton.innerHTML) notifButton.innerHTML = icon('bell', 16);
}

function showForgotPassword(open){
  const forgot = document.getElementById('forgotForm');
  const login = document.getElementById('loginForm');
  if(!forgot || !login) return;
  const visible = open !== false;
  forgot.hidden = !visible;
  login.hidden = visible;
}
function showForcePassword(){
  const gate = document.getElementById('loginGate');
  const app = document.getElementById('prodfy-app');
  if(gate) gate.hidden = false;
  if(app) app.classList.add('is-locked');
  ['loginForm','setupForm','forgotForm'].forEach(function(id){
    const form = document.getElementById(id);
    if(form) form.hidden = true;
  });
  const force = document.getElementById('forcePasswordForm');
  if(force) force.hidden = false;
}
function togglePassword(id, button){
  const input = document.getElementById(id);
  if(!input) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.innerHTML = icon(show ? 'eyeOff' : 'eye', 16);
  button.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  button.setAttribute('aria-pressed', show ? 'true' : 'false');
}
async function changeOrderStatus(id, next, selectEl){
  if(deny('ordens')){
    if(selectEl) selectEl.value = normalizeOrderStatus((orderById(id) || {}).status);
    return;
  }
  const order = orderById(id);
  if(!order) return;
  const previous = normalizeOrderStatus(order.status);
  if(next === previous) return;
  if(ORDER_STATUSES.indexOf(next) < 0){
    toast('Escolha um status da lista.', 'error');
    if(selectEl) selectEl.value = previous;
    return;
  }
  let motivo = order.motivo || '';
  if(next === 'Iniciado/Parado' || next === 'Bloqueado'){
    showStatusReason(order, next, selectEl);
    return;
  }
  await commitOrderStatus(order, next, motivo);
}
function showStatusReason(order, next, selectEl){
  const cell = selectEl && selectEl.closest ? selectEl.closest('td') : null;
  if(!cell) return;
  const existing = cell.querySelector('.status-reason');
  if(existing) existing.remove();
  const box = document.createElement('div');
  box.className = 'status-reason';
  box.style.marginTop = '6px';
  box.innerHTML = `<input placeholder="Motivo" value="${escapeHtml(order.motivo || '')}" style="margin-bottom:6px;"><button type="button" class="btn btn-sm btn-primary">Salvar</button>`;
  cell.appendChild(box);
  const input = box.querySelector('input');
  box.querySelector('button').onclick = async function(){
    const motivo = input.value.trim();
    if(!motivo){ toast('Informe o motivo.', 'error'); input.focus(); return; }
    await commitOrderStatus(order, next, motivo);
  };
  if(input) input.focus();
}
async function commitOrderStatus(order, next, motivo){
  order.status = next;
  order.setor = orderSector(order);
  order.motivo = (motivo || '').trim();
  await persist();
  if(activeTab === 'ordens') renderOrdensTable();
  if(activeTab === 'acompanhamento') renderAcompTable();
  toast('Status atualizado.', 'success');
}
let cadastroChoice = 'setor';
let cadastroEditId = '';
let kitDraft = [];
let routeDraft = [];
let textDraft = {};
const TURNO_OPTIONS = ['1º Turno', '2º Turno', '3º Turno', 'Turno Comercial', 'Administrativo'];

function claimCode(list, raw, exceptId){
  const codigo = String(raw || '').trim().toUpperCase();
  if(!codigo) return { error: 'Informe o código.' };
  const taken = (list || []).some(function(item){
    if(exceptId && (item.id === exceptId || item.codigo === exceptId)) return false;
    return String(item.codigo || '').trim().toUpperCase() === codigo;
  });
  if(taken) return { error: 'Este código já existe.' };
  return { codigo: codigo };
}
function cadastroInput(id){
  const el = document.getElementById(id);
  return el ? String(el.value || '').trim() : '';
}
function readChecks(id){
  return Array.from(document.querySelectorAll('#' + id + ' input:checked')).map(function(input){ return input.value; });
}
function fieldValue(id, fallback){
  if(Object.prototype.hasOwnProperty.call(textDraft, id)) return textDraft[id];
  return fallback == null ? '' : fallback;
}
function checkedDraft(key, fallback){
  if(Object.prototype.hasOwnProperty.call(textDraft, key)) return textDraft[key];
  return fallback || [];
}
function rememberTexts(){
  ['cadCodigo','cadDescricao','cadErp','cadGrupo','cadFamilia','cadSetor','cadMaterial','cadTurno','cadClasse','cadTempo'].forEach(function(id){
    const el = document.getElementById(id);
    if(el) textDraft[id] = el.value;
  });
  if(document.getElementById('cadMaquinas')) textDraft.maquinas = readChecks('cadMaquinas');
  if(document.getElementById('cadOperacoes')) textDraft.operacoes = readChecks('cadOperacoes');
  if(document.getElementById('cadOperadores')) textDraft.operadores = readChecks('cadOperadores');
}
function pullKitDraft(){
  document.querySelectorAll('[data-kit-index]').forEach(function(row){
    const index = Number(row.getAttribute('data-kit-index'));
    if(!kitDraft[index]) return;
    const item = row.querySelector('.kit-item');
    const qty = row.querySelector('.kit-qty');
    const setor = row.querySelector('.kit-setor');
    if(item) kitDraft[index].codigo = item.value;
    if(qty) kitDraft[index].quantidade = Math.max(0, Number(qty.value) || 0);
    if(setor) kitDraft[index].setorId = setor.value;
  });
}
function pullRouteDraft(){
  document.querySelectorAll('[data-route-index]').forEach(function(row){
    const index = Number(row.getAttribute('data-route-index'));
    if(!routeDraft[index]) return;
    const operation = row.querySelector('.route-op');
    const setor = row.querySelector('.route-setor');
    const machine = row.querySelector('.route-maq');
    if(operation) routeDraft[index].operacaoId = operation.value;
    if(setor) routeDraft[index].setorId = setor.value;
    if(machine) routeDraft[index].maquinaId = machine.value;
  });
}
function resetCadastroForm(){
  cadastroEditId = '';
  kitDraft = [];
  routeDraft = [];
  textDraft = {};
}
function setCadastroChoice(choice){
  cadastroChoice = choice;
  resetCadastroForm();
  renderCadastro();
  applyAccess();
}
function guardCadastro(){
  if(cadastroChoice === 'operador' && (canEdit('funcionarios') || canEdit('engenharia'))) return false;
  if(cadastroChoice === 'maquina' && (canEdit('recursos') || canEdit('engenharia'))) return false;
  if(cadastroChoice !== 'operador' && cadastroChoice !== 'maquina' && canEdit('engenharia')) return false;
  const module = cadastroChoice === 'operador' ? 'funcionarios' : (cadastroChoice === 'maquina' ? 'recursos' : 'engenharia');
  return deny(module);
}
function suggestedCadastroCode(){
  if(cadastroChoice === 'setor') return nextNumericCode(state.setores);
  if(cadastroChoice === 'grupo') return nextNumericCode(state.groups);
  if(cadastroChoice === 'familia') return suggestAlpha(state.families);
  if(cadastroChoice === 'item') return suggestAlpha(state.products);
  if(cadastroChoice === 'operacao') return suggestAlpha(state.operacoes);
  if(cadastroChoice === 'operador') return suggestAlpha(state.employees);
  if(cadastroChoice === 'maquina') return suggestAlpha(state.resources);
  return suggestAlpha(state.equipments);
}
function cadastroRecord(id){
  if(!id) return null;
  if(cadastroChoice === 'setor') return setorById(id);
  if(cadastroChoice === 'grupo') return groupById(id);
  if(cadastroChoice === 'familia') return familyById(id);
  if(cadastroChoice === 'item') return state.products.find(function(item){ return item.codigo === id; }) || null;
  if(cadastroChoice === 'operacao') return operacaoById(id);
  if(cadastroChoice === 'operador') return state.employees.find(function(item){ return item.id === id; }) || null;
  if(cadastroChoice === 'maquina') return resourceById(id);
  return equipmentById(id);
}
function selectOptions(items, selected, blank){
  const head = blank ? `<option value="">${escapeHtml(blank)}</option>` : '';
  return head + (items || []).map(function(item){
    return `<option value="${escapeHtml(item.id)}" ${item.id === selected ? 'selected' : ''}>${escapeHtml(recordLabel(item))}</option>`;
  }).join('');
}
function productOptions(selected){
  const head = '<option value="">Selecione o item</option>';
  return head + state.products.map(function(product){
    return `<option value="${escapeHtml(product.codigo)}" ${product.codigo === selected ? 'selected' : ''}>${escapeHtml((product.codigo || '') + ' — ' + (product.descricao || ''))}</option>`;
  }).join('');
}
function checkGrid(id, items, selected, label){
  if(!items.length) return '<div class="section-sub">Nenhum cadastro ainda.</div>';
  return `<div class="perm-grid" id="${id}">${items.map(function(item){
    const checked = (selected || []).indexOf(item.id) >= 0 ? 'checked' : '';
    return `<label class="perm-item"><input data-edit="engenharia" type="checkbox" value="${escapeHtml(item.id)}" ${checked}> ${escapeHtml(label(item))}</label>`;
  }).join('')}</div>`;
}
function rowActions(id){
  return `<button class="btn btn-sm" type="button" onclick="editCadastro('${escapeHtml(id)}')">Editar</button> <button class="icon-btn danger" data-edit="engenharia" type="button" onclick="deleteCadastro('${escapeHtml(id)}')" title="Excluir">${icon('trash',14)}</button>`;
}
function codeField(value){
  return `<div class="field"><label>Código <span class="field-hint">automático, editável</span></label><input id="cadCodigo" data-edit="engenharia" maxlength="12" value="${escapeHtml(value || '')}"></div>`;
}
function descriptionField(value, label){
  return `<div class="field"><label>${label || 'Descrição'}</label><input id="cadDescricao" data-edit="engenharia" maxlength="120" value="${escapeHtml(value || '')}"></div>`;
}
function saveButtons(){
  return `<div style="display:flex; gap:8px; margin-top:12px;"><button class="btn btn-primary" data-edit="engenharia" type="button" onclick="saveCadastro()">Salvar</button><button class="btn btn-ghost" type="button" onclick="setCadastroChoice('${cadastroChoice}')">Limpar</button></div>`;
}
function kitEditor(){
  const head = '<div class="kit-head"><span>Id do item</span><span>Descrição</span><span>Qtd.</span><span>Setor</span><span></span></div>';
  const rows = kitDraft.map(function(part, index){
    const product = productByCode(part.codigo);
    return `<div class="kit-row" data-kit-index="${index}">
      <select class="kit-item" data-edit="engenharia" onchange="refreshCadastroDraft()">${productOptions(part.codigo)}</select>
      <span>${escapeHtml(product ? product.descricao : '—')}</span>
      <input class="kit-qty" data-edit="engenharia" type="number" min="0" step="1" value="${Number(part.quantidade) || 0}">
      <select class="kit-setor" data-edit="engenharia">${selectOptions(state.setores, part.setorId || '', 'Setor')}</select>
      <button class="icon-btn danger" data-edit="engenharia" type="button" onclick="removeKitRow(${index})" title="Tirar peça">${icon('trash',14)}</button>
    </div>`;
  }).join('');
  return head + rows + `<button class="btn btn-ghost btn-sm" data-edit="engenharia" type="button" style="margin-top:8px;" onclick="addKitRow()">Adicionar peça</button>`;
}
function routeEditor(){
  const rows = routeDraft.map(function(step, index){
    const machines = state.resources.map(function(resource){
      return `<option value="${escapeHtml(resource.id)}" ${resource.id === step.maquinaId ? 'selected' : ''}>${escapeHtml((resource.codigo || resource.nome) + ' — ' + (resource.descricao || ''))}</option>`;
    }).join('');
    return `<div class="kit-row" data-route-index="${index}">
      <select class="route-op" data-edit="engenharia">${selectOptions(state.operacoes, step.operacaoId || '', 'Operação')}</select>
      <select class="route-setor" data-edit="engenharia">${selectOptions(state.setores, step.setorId || '', 'Setor')}</select>
      <select class="route-maq" data-edit="engenharia"><option value="">Máquina opcional</option>${machines}</select>
      <span></span>
      <span style="display:flex; gap:4px;">
        <button class="btn btn-sm" type="button" onclick="moveRouteRow(${index},-1)">↑</button>
        <button class="btn btn-sm" type="button" onclick="moveRouteRow(${index},1)">↓</button>
        <button class="icon-btn danger" data-edit="engenharia" type="button" onclick="removeRouteRow(${index})">${icon('trash',14)}</button>
      </span>
    </div>`;
  }).join('');
  return `<div class="kit-head"><span>Operação</span><span>Setor</span><span>Máquina</span><span></span><span></span></div>${rows}
    <button class="btn btn-ghost btn-sm" data-edit="engenharia" type="button" style="margin-top:8px;" onclick="addRouteRow()">Adicionar etapa</button>
    <div class="section-sub">A ordem é a sequência: 1 cortar, 2 dobrar, 3 soldar.</div>`;
}
function listTable(headers, body){
  const cols = headers.length + 1;
  return `<div class="table-wrap" style="margin-top:14px;"><table><thead><tr>${headers.map(function(header){ return '<th>' + header + '</th>'; }).join('')}<th style="width:120px;"></th></tr></thead><tbody>${body || '<tr class="empty-row"><td colspan="' + cols + '">Nenhum cadastro ainda.</td></tr>'}</tbody></table></div>`;
}
function renderCadastroBody(){
  const box = document.getElementById('cadastroBody');
  if(!box) return;
  const record = cadastroRecord(cadastroEditId);
  const codigo = fieldValue('cadCodigo', record ? (record.codigo || '') : suggestedCadastroCode());
  const descricao = fieldValue('cadDescricao', record ? (cadastroChoice === 'operador' ? ((record.nome || '') + ' ' + (record.sobrenome || '')).trim() : recordLabel(record)) : '');
  if(cadastroChoice === 'setor'){
    const rows = state.setores.map(function(setor){
      return `<tr><td class="mono">${escapeHtml(setor.codigo || '')}</td><td>${escapeHtml(recordLabel(setor))}</td><td>${rowActions(setor.id)}</td></tr>`;
    }).join('');
    box.innerHTML = `<div class="section-title" style="font-size:16px;">Setor</div><div class="section-sub">Lugar da fábrica. O código é numérico.</div><div class="grid grid-2">${codeField(codigo)}${descriptionField(descricao)}</div>${saveButtons()}${listTable(['Código','Descrição'], rows)}`;
    return;
  }
  if(cadastroChoice === 'grupo'){
    const rows = state.groups.map(function(group){
      const families = state.families.filter(function(family){ return family.grupoId === group.id; }).map(recordLabel).join(', ');
      return `<tr><td class="mono">${escapeHtml(group.codigo || '')}</td><td>${escapeHtml(recordLabel(group))}</td><td>${escapeHtml(families || '—')}</td><td>${rowActions(group.id)}</td></tr>`;
    }).join('');
    const detail = state.groups.map(function(group){
      const families = state.families.filter(function(family){ return family.grupoId === group.id; });
      const blocks = families.map(function(family){
        const items = state.products.filter(function(product){ return product.familiaId === family.id; }).map(function(product){ return product.codigo + ' ' + (product.descricao || ''); }).join(', ');
        return `<div>${escapeHtml(recordLabel(family))}: ${escapeHtml(items || 'sem itens')}</div>`;
      }).join('') || '<div class="section-sub">Nenhuma família neste grupo.</div>';
      return `<div style="margin-top:8px;"><b>${escapeHtml((group.codigo || '') + ' ' + recordLabel(group))}</b>${blocks}</div>`;
    }).join('');
    box.innerHTML = `<div class="section-title" style="font-size:16px;">Grupo</div><div class="section-sub">Categoria acima da família. Ex.: Separação reúne Decanter e Prensa. O código é numérico.</div><div class="grid grid-2">${codeField(codigo)}${descriptionField(descricao)}</div>${saveButtons()}${listTable(['Código','Descrição','Famílias'], rows)}<div style="margin-top:12px;">${detail}</div>`;
    return;
  }
  if(cadastroChoice === 'familia'){
    const grupoId = fieldValue('cadGrupo', record ? (record.grupoId || '') : '');
    const rows = state.families.map(function(family){
      const group = groupById(family.grupoId);
      return `<tr><td class="mono">${escapeHtml(family.codigo || '')}</td><td>${escapeHtml(recordLabel(family))}</td><td>${escapeHtml(group ? recordLabel(group) : '—')}</td><td>${(family.itens || []).length}</td><td>${rowActions(family.id)}</td></tr>`;
    }).join('');
    box.innerHTML = `<div class="section-title" style="font-size:16px;">Família</div><div class="section-sub">Linha do produto. Ex.: Decanter é a família; os tamanhos ficam no equipamento. Aqui fica o conjunto padrão de peças.</div>
      <div class="grid grid-2">${codeField(codigo)}${descriptionField(descricao)}
        <div class="field"><label>Grupo</label><select id="cadGrupo" data-edit="engenharia">${selectOptions(state.groups, grupoId, 'Selecione o grupo')}</select></div>
      </div>
      <div class="section-sub" style="margin-top:8px;">Conjunto padrão</div>${kitEditor()}${saveButtons()}${listTable(['Código','Descrição','Grupo','Peças'], rows)}`;
    return;
  }
  if(cadastroChoice === 'item'){
    const grupoId = fieldValue('cadGrupo', record ? (record.grupoId || '') : '');
    const familiaId = fieldValue('cadFamilia', record ? (record.familiaId || '') : '');
    const families = state.families.filter(function(family){ return !grupoId || family.grupoId === grupoId; });
    const classe = fieldValue('cadClasse', record ? (record.classificacao || 'PI') : 'PI');
    const erp = fieldValue('cadErp', record ? (record.codigoErp || '') : genErpCode(classe));
    const setorId = fieldValue('cadSetor', record ? (record.setorId || '') : '');
    const material = fieldValue('cadMaterial', record ? (record.material || '') : '');
    const tempo = fieldValue('cadTempo', record ? (record.tempoFabricacaoMin || 1) : 1);
    const machines = checkedDraft('maquinas', record ? (record.maquinas || []) : []);
    const rows = state.products.map(function(product){
      const family = familyById(product.familiaId);
      const setor = setorById(product.setorId);
      return `<tr><td class="mono">${escapeHtml(product.codigo || '')}</td><td class="mono">${escapeHtml(product.codigoErp || '')}</td><td>${escapeHtml(product.descricao || '')}</td><td>${escapeHtml(family ? recordLabel(family) : '—')}</td><td>${escapeHtml(setor ? recordLabel(setor) : '—')}</td><td>${rowActions(product.codigo)}</td></tr>`;
    }).join('');
    box.innerHTML = `<div class="section-title" style="font-size:16px;">Item</div><div class="section-sub">Peça unitária, como tambor ou rosca. O tamanho não entra aqui. O código interno é AA e o ERP fica no outro campo.</div>
      <div class="grid grid-2">${codeField(codigo)}
        <div class="field"><label>Código ERP</label><input id="cadErp" data-edit="engenharia" maxlength="20" value="${escapeHtml(erp)}"></div>
        ${descriptionField(descricao)}
        <div class="field"><label>Material</label><input id="cadMaterial" data-edit="engenharia" maxlength="80" value="${escapeHtml(material)}" placeholder="Ex.: aço inox"></div>
        <div class="field"><label>Grupo</label><select id="cadGrupo" data-edit="engenharia" onchange="onItemGroupChange()">${selectOptions(state.groups, grupoId, 'Selecione o grupo')}</select></div>
        <div class="field"><label>Família</label><select id="cadFamilia" data-edit="engenharia">${selectOptions(families, familiaId, 'Selecione a família')}</select></div>
        <div class="field"><label>Setor</label><select id="cadSetor" data-edit="engenharia">${selectOptions(state.setores, setorId, 'Selecione o setor')}</select></div>
        <div class="field"><label>Classificação</label><select id="cadClasse" data-edit="engenharia"><option value="PI" ${classe === 'PI' ? 'selected' : ''}>PI — intermediário</option><option value="PF" ${classe === 'PF' ? 'selected' : ''}>PF — final</option></select></div>
        <div class="field"><label>Tempo (min/peça)</label><input id="cadTempo" data-edit="engenharia" type="number" min="0" step="0.1" value="${escapeHtml(tempo)}"></div>
      </div>
      <div class="section-sub">Máquinas em que esta peça pode ser feita. As outras ficam proibidas.</div>
      ${checkGrid('cadMaquinas', state.resources, machines, function(resource){ return (resource.codigo || resource.nome) + ' — ' + (resource.descricao || ''); })}
      <div class="section-sub" style="margin-top:8px;">Rota ordenada</div>${routeEditor()}${saveButtons()}${listTable(['Código','ERP','Descrição','Família','Setor'], rows)}`;
    return;
  }
  if(cadastroChoice === 'operacao'){
    const rows = state.operacoes.map(function(operation){
      return `<tr><td class="mono">${escapeHtml(operation.codigo || '')}</td><td>${escapeHtml(recordLabel(operation))}</td><td>${rowActions(operation.id)}</td></tr>`;
    }).join('');
    box.innerHTML = `<div class="section-title" style="font-size:16px;">Operação</div><div class="section-sub">Etapa de processo. Ex.: cortar, dobrar, calandrar, soldar, jatear, tornear, montar. A sequência fica no item.</div><div class="grid grid-2">${codeField(codigo)}${descriptionField(descricao)}</div>${saveButtons()}${listTable(['Código','Descrição'], rows)}`;
    return;
  }
  if(cadastroChoice === 'operador'){
    const turno = fieldValue('cadTurno', record ? (record.turno || '1º Turno') : '1º Turno');
    const machines = checkedDraft('maquinas', record ? employeeMachines(record.id).map(function(resource){ return resource.id; }) : []);
    const rows = state.employees.map(function(employee){
      const names = employeeMachines(employee.id).map(function(resource){ return resource.codigo || resource.nome; }).join(', ');
      return `<tr><td class="mono">${escapeHtml(employee.codigo || '')}</td><td>${escapeHtml(((employee.nome || '') + ' ' + (employee.sobrenome || '')).trim())}</td><td>${escapeHtml(employee.turno || '')}</td><td>${escapeHtml(names || '—')}</td><td>${rowActions(employee.id)}</td></tr>`;
    }).join('');
    box.innerHTML = `<div class="section-title" style="font-size:16px;">Operador</div><div class="section-sub">A mesma pessoa do cadastro de funcionários. O vínculo com a máquina aparece dos dois lados.</div>
      <div class="grid grid-2">${codeField(codigo)}${descriptionField(descricao)}
        <div class="field"><label>Turno</label><select id="cadTurno" data-edit="engenharia">${TURNO_OPTIONS.map(function(item){ return `<option ${item === turno ? 'selected' : ''}>${escapeHtml(item)}</option>`; }).join('')}</select></div>
      </div>
      <div class="section-sub">Máquinas deste operador</div>
      ${checkGrid('cadMaquinas', state.resources, machines, function(resource){ return (resource.codigo || resource.nome) + ' — ' + (resource.descricao || ''); })}
      ${saveButtons()}${listTable(['Código','Descrição','Turno','Máquinas'], rows)}`;
    return;
  }
  if(cadastroChoice === 'maquina'){
    const setorId = fieldValue('cadSetor', record ? (record.setorId || '') : '');
    const operations = checkedDraft('operacoes', record ? (record.operacoes || []) : []);
    const operators = checkedDraft('operadores', record ? (record.funcionarios || []) : []);
    const rows = state.resources.map(function(resource){
      const setor = setorById(resource.setorId);
      return `<tr><td class="mono">${escapeHtml(resource.codigo || resource.nome || '')}</td><td>${escapeHtml(resource.descricao || '')}</td><td>${escapeHtml(setor ? recordLabel(setor) : (resource.setor || '—'))}</td><td>${rowActions(resource.id)}</td></tr>`;
    }).join('');
    box.innerHTML = `<div class="section-title" style="font-size:16px;">Máquina</div><div class="section-sub">Recurso de produção: setor, operações que executa e operadores vinculados.</div>
      <div class="grid grid-2">${codeField(codigo)}${descriptionField(descricao)}
        <div class="field"><label>Setor</label><select id="cadSetor" data-edit="engenharia">${selectOptions(state.setores, setorId, 'Selecione o setor')}</select></div>
      </div>
      <div class="section-sub">Operações que esta máquina executa</div>
      ${checkGrid('cadOperacoes', state.operacoes, operations, recordLabel)}
      <div class="section-sub">Operadores vinculados</div>
      ${checkGrid('cadOperadores', state.employees, operators, function(employee){ return ((employee.codigo || '') + ' ' + (employee.nome || '') + ' ' + (employee.sobrenome || '')).trim(); })}
      ${saveButtons()}${listTable(['Código','Descrição','Setor'], rows)}`;
    return;
  }
  const familiaId = fieldValue('cadFamilia', record ? (record.familiaId || '') : '');
  const rows = state.equipments.map(function(equipment){
    const family = familyById(equipment.familiaId);
    return `<tr><td class="mono">${escapeHtml(equipment.codigo || '')}</td><td>${escapeHtml(recordLabel(equipment))}</td><td>${escapeHtml(family ? recordLabel(family) : '—')}</td><td>${(equipment.itens || []).length}</td><td>${rowActions(equipment.id)}</td></tr>`;
  }).join('');
  box.innerHTML = `<div class="section-title" style="font-size:16px;">Equipamento</div><div class="section-sub">Um modelo da família. Ex.: Decanter 220. Ao escolher a família, as peças padrão são copiadas e podem ser ajustadas.</div>
    <div class="grid grid-2">${codeField(codigo)}${descriptionField(descricao)}
      <div class="field"><label>Família</label><select id="cadFamilia" data-edit="engenharia" onchange="onEquipmentFamilyChange()">${selectOptions(state.families, familiaId, 'Selecione a família')}</select></div>
    </div>
    ${kitEditor()}${saveButtons()}${listTable(['Código','Descrição','Família','Peças'], rows)}`;
}
function refreshCadastroDraft(){
  pullKitDraft();
  pullRouteDraft();
  rememberTexts();
  renderCadastro();
  applyAccess();
}
function addKitRow(){
  pullKitDraft();
  rememberTexts();
  kitDraft.push({ codigo: '', quantidade: 1, setorId: '' });
  renderCadastro();
  applyAccess();
}
function removeKitRow(index){
  pullKitDraft();
  rememberTexts();
  kitDraft.splice(index, 1);
  renderCadastro();
  applyAccess();
}
function addRouteRow(){
  pullRouteDraft();
  rememberTexts();
  routeDraft.push({ operacaoId: '', setorId: '', maquinaId: '' });
  renderCadastro();
  applyAccess();
}
function removeRouteRow(index){
  pullRouteDraft();
  rememberTexts();
  routeDraft.splice(index, 1);
  renderCadastro();
  applyAccess();
}
function moveRouteRow(index, delta){
  pullRouteDraft();
  rememberTexts();
  const next = index + delta;
  if(next < 0 || next >= routeDraft.length) return;
  const step = routeDraft.splice(index, 1)[0];
  routeDraft.splice(next, 0, step);
  renderCadastro();
  applyAccess();
}
function onItemGroupChange(){
  pullRouteDraft();
  rememberTexts();
  renderCadastro();
  applyAccess();
}
function onEquipmentFamilyChange(){
  rememberTexts();
  const family = familyById(cadastroInput('cadFamilia'));
  kitDraft = ((family && family.itens) || []).map(function(part){
    return { codigo: part.codigo, quantidade: Number(part.quantidade) || 1, setorId: part.setorId || '' };
  });
  renderCadastro();
  applyAccess();
}
function editCadastro(id){
  cadastroEditId = id;
  textDraft = {};
  const record = cadastroRecord(id);
  kitDraft = ((record && record.itens) || []).map(function(part){
    return { codigo: part.codigo, quantidade: Number(part.quantidade) || 1, setorId: part.setorId || '' };
  });
  routeDraft = ((record && record.rota) || []).map(function(step){
    return { operacaoId: step.operacaoId || '', setorId: step.setorId || '', maquinaId: step.maquinaId || '' };
  });
  renderCadastro();
  applyAccess();
}
function openCadastroItem(codigo){
  cadastroChoice = 'item';
  textDraft = {};
  kitDraft = [];
  if(codigo){
    cadastroEditId = codigo;
    const product = state.products.find(function(item){ return item.codigo === codigo; });
    routeDraft = ((product && product.rota) || []).map(function(step){
      return { operacaoId: step.operacaoId || '', setorId: step.setorId || '', maquinaId: step.maquinaId || '' };
    });
  } else {
    cadastroEditId = '';
    routeDraft = [];
  }
  setTab('cadastro');
}
function cleanKit(){
  return kitDraft.filter(function(part){ return part.codigo && Number(part.quantidade) > 0; }).map(function(part){
    return { codigo: part.codigo, quantidade: Number(part.quantidade) || 1, setorId: part.setorId || '' };
  });
}
function cleanRoute(){
  return routeDraft.filter(function(step){ return step.operacaoId; }).map(function(step){
    return { operacaoId: step.operacaoId, setorId: step.setorId || '', maquinaId: step.maquinaId || '' };
  });
}
function setorUsed(id){
  if(state.products.some(function(product){ return product.setorId === id || (product.rota || []).some(function(step){ return step.setorId === id; }); })) return true;
  if(state.resources.some(function(resource){ return resource.setorId === id; })) return true;
  if(state.families.some(function(family){ return (family.itens || []).some(function(part){ return part.setorId === id; }); })) return true;
  return state.equipments.some(function(equipment){ return (equipment.itens || []).some(function(part){ return part.setorId === id; }); });
}
async function saveCadastro(){
  if(guardCadastro()) return;
  pullKitDraft();
  pullRouteDraft();
  const descricao = cadastroInput('cadDescricao');
  if(!descricao){ toast('Informe a descrição.', 'error'); return; }
  const claimed = claimCode(cadastroChoice === 'item' ? state.products : (cadastroChoice === 'operador' ? state.employees : (cadastroChoice === 'maquina' ? state.resources : (cadastroChoice === 'setor' ? state.setores : (cadastroChoice === 'grupo' ? state.groups : (cadastroChoice === 'familia' ? state.families : (cadastroChoice === 'operacao' ? state.operacoes : state.equipments)))))), cadastroInput('cadCodigo') || suggestedCadastroCode(), cadastroEditId);
  if(claimed.error){ toast(claimed.error, 'error'); return; }
  const codigo = claimed.codigo;
  if(cadastroChoice === 'setor'){
    if(cadastroEditId){
      const setor = setorById(cadastroEditId);
      if(setor) Object.assign(setor, { codigo: codigo, descricao: descricao, nome: descricao });
    } else state.setores.push({ id: uid(), codigo: codigo, descricao: descricao, nome: descricao });
  } else if(cadastroChoice === 'grupo'){
    if(cadastroEditId){
      const group = groupById(cadastroEditId);
      if(group) Object.assign(group, { codigo: codigo, descricao: descricao, nome: descricao });
    } else state.groups.push({ id: uid(), codigo: codigo, descricao: descricao, nome: descricao });
  } else if(cadastroChoice === 'familia'){
    const grupoId = cadastroInput('cadGrupo');
    if(!grupoId){ toast('Escolha o grupo da família.', 'error'); return; }
    const payload = { codigo: codigo, descricao: descricao, nome: descricao, grupoId: grupoId, itens: cleanKit() };
    if(cadastroEditId){
      const family = familyById(cadastroEditId);
      if(family) Object.assign(family, payload);
    } else state.families.push(Object.assign({ id: uid() }, payload));
  } else if(cadastroChoice === 'item'){
    const codigoErp = cadastroInput('cadErp') || genErpCode(cadastroInput('cadClasse') || 'PI');
    if(state.products.some(function(product){ return product.codigo !== cadastroEditId && String(product.codigoErp || '').toLowerCase() === codigoErp.toLowerCase(); })){
      toast('Este código ERP já existe.', 'error');
      return;
    }
    const rota = cleanRoute();
    const flags = routeFlags(rota);
    const payload = {
      codigo: codigo,
      codigoErp: codigoErp,
      descricao: descricao,
      grupoId: cadastroInput('cadGrupo'),
      familiaId: cadastroInput('cadFamilia'),
      setorId: cadastroInput('cadSetor'),
      material: cadastroInput('cadMaterial'),
      classificacao: cadastroInput('cadClasse') === 'PF' ? 'PF' : 'PI',
      tempoFabricacaoMin: Math.max(0, Number(cadastroInput('cadTempo')) || 0),
      maquinas: readChecks('cadMaquinas'),
      rota: rota,
      pintura: flags.pintura,
      montagem: flags.montagem
    };
    if(!payload.grupoId && payload.familiaId){
      const family = familyById(payload.familiaId);
      payload.grupoId = family ? (family.grupoId || '') : '';
    }
    if(!payload.familiaId || !payload.setorId){ toast('Escolha a família e o setor do item.', 'error'); return; }
    const current = cadastroEditId ? state.products.find(function(product){ return product.codigo === cadastroEditId; }) : null;
    if(current){
      const oldCode = current.codigo;
      const oldDescricao = current.descricao;
      Object.assign(current, payload);
      syncProductOnOrders(oldCode, oldDescricao, current);
    } else state.products.push(payload);
  } else if(cadastroChoice === 'operacao'){
    if(cadastroEditId){
      const operation = operacaoById(cadastroEditId);
      if(operation) Object.assign(operation, { codigo: codigo, descricao: descricao, nome: descricao });
    } else state.operacoes.push({ id: uid(), codigo: codigo, descricao: descricao, nome: descricao });
  } else if(cadastroChoice === 'operador'){
    const turno = cadastroInput('cadTurno') || '1º Turno';
    const machines = readChecks('cadMaquinas');
    if(cadastroEditId){
      const employee = state.employees.find(function(item){ return item.id === cadastroEditId; });
      if(employee) Object.assign(employee, { codigo: codigo, nome: descricao, sobrenome: '', turno: turno, funcao: employee.funcao || 'Operador' });
      syncEmployeeMachines(cadastroEditId, machines);
    } else {
      const assigned = assignEmployeeNumber('', '');
      if(assigned.error){ toast(assigned.error, 'error'); return; }
      const employeeId = uid();
      state.employees.push({ id: employeeId, codigo: codigo, numero: assigned.numero, nome: descricao, sobrenome: '', funcao: 'Operador', turno: turno, vinculo: 'Efetivo', ferias: null });
      syncEmployeeMachines(employeeId, machines);
    }
  } else if(cadastroChoice === 'maquina'){
    const setorId = cadastroInput('cadSetor');
    if(!setorId){ toast('Escolha o setor da máquina.', 'error'); return; }
    const setor = setorById(setorId);
    const current = cadastroEditId ? resourceById(cadastroEditId) : null;
    const payload = {
      codigo: codigo,
      nome: codigo,
      descricao: descricao,
      setorId: setorId,
      setor: setor ? recordLabel(setor) : '',
      operacoes: readChecks('cadOperacoes'),
      funcionarios: readChecks('cadOperadores'),
      grupos: [],
      restricao: current ? (current.restricao || '') : '',
      status: current ? (current.status || 'Parada') : 'Parada'
    };
    if(current) Object.assign(current, payload);
    else state.resources.push(Object.assign({ id: uid() }, payload));
  } else {
    const familiaId = cadastroInput('cadFamilia');
    if(!familiaId){ toast('Escolha a família do equipamento.', 'error'); return; }
    const payload = { codigo: codigo, descricao: descricao, nome: descricao, familiaId: familiaId, itens: cleanKit() };
    if(cadastroEditId){
      const equipment = equipmentById(cadastroEditId);
      if(equipment) Object.assign(equipment, payload);
    } else state.equipments.push(Object.assign({ id: uid() }, payload));
  }
  resetCadastroForm();
  await persist();
  renderCadastro();
  if(activeTab === 'engenharia') renderEngenhariaTable();
  applyAccess();
  toast('Cadastro salvo.', 'success');
}
async function deleteCadastro(id){
  if(guardCadastro()) return;
  const record = cadastroRecord(id);
  if(!record) return;
  const label = recordLabel(record) || record.codigo || id;
  if(cadastroChoice === 'setor' && setorUsed(id)){
    toast('Este setor está em uso. Tire o vínculo antes de excluir.', 'error');
    return;
  }
  if(!confirm('Excluir ' + label + '? Pedidos já gerados continuam com a composição gravada.')) return;
  if(cadastroChoice === 'setor') state.setores = state.setores.filter(function(item){ return item.id !== id; });
  else if(cadastroChoice === 'grupo'){
    state.families.forEach(function(family){ if(family.grupoId === id) family.grupoId = ''; });
    state.products.forEach(function(product){ if(product.grupoId === id) product.grupoId = ''; });
    state.groups = state.groups.filter(function(item){ return item.id !== id; });
  } else if(cadastroChoice === 'familia'){
    state.products.forEach(function(product){ if(product.familiaId === id) product.familiaId = ''; });
    state.equipments.forEach(function(equipment){ if(equipment.familiaId === id) equipment.familiaId = ''; });
    state.families = state.families.filter(function(item){ return item.id !== id; });
  } else if(cadastroChoice === 'item'){
    state.families.forEach(function(family){ family.itens = (family.itens || []).filter(function(part){ return part.codigo !== id; }); });
    state.equipments.forEach(function(equipment){ equipment.itens = (equipment.itens || []).filter(function(part){ return part.codigo !== id; }); });
    state.products = state.products.filter(function(product){ return product.codigo !== id; });
  } else if(cadastroChoice === 'operacao'){
    state.products.forEach(function(product){ product.rota = (product.rota || []).filter(function(step){ return step.operacaoId !== id; }); });
    state.resources.forEach(function(resource){ resource.operacoes = (resource.operacoes || []).filter(function(operationId){ return operationId !== id; }); });
    state.operacoes = state.operacoes.filter(function(item){ return item.id !== id; });
  } else if(cadastroChoice === 'operador'){
    state.employees = state.employees.filter(function(employee){ return employee.id !== id; });
    state.resources.forEach(function(resource){ resource.funcionarios = (resource.funcionarios || []).filter(function(employeeId){ return employeeId !== id; }); });
  } else if(cadastroChoice === 'maquina'){
    state.products.forEach(function(product){
      product.maquinas = (product.maquinas || []).filter(function(resourceId){ return resourceId !== id; });
      product.rota = (product.rota || []).map(function(step){ return step.maquinaId === id ? Object.assign({}, step, { maquinaId: '' }) : step; });
    });
    state.resources = state.resources.filter(function(resource){ return resource.id !== id; });
  } else state.equipments = state.equipments.filter(function(equipment){ return equipment.id !== id; });
  if(cadastroEditId === id) resetCadastroForm();
  await persist();
  renderCadastro();
  applyAccess();
  toast('Cadastro excluído.', 'success');
}

function renderTaskBoard(){
  const board = document.getElementById('taskBoard');
  if(!board) return;
  const byOperator = {};
  const bySector = {};
  state.orders.filter(function(order){ return !orderIsClosed(order); }).forEach(function(order){
    orderItems(order).forEach(function(item){
      const stage = itemOpenStage(item, order);
      if(!stage) return;
      const equipmentName = item.equipamentoNome ? item.equipamentoNome + ' · ' : '';
      const line = `${orderLabel(order)} · ${equipmentName}${item.descricao || order.descricao} · falta ${stage.falta}`;
      const operator = item.funcionarioNome || 'Sem operador';
      if(!byOperator[operator]) byOperator[operator] = [];
      if(!bySector[stage.nome]) bySector[stage.nome] = [];
      byOperator[operator].push(line);
      bySector[stage.nome].push(line);
    });
  });
  function column(title, groups){
    return `<div class="card"><div class="section-title" style="font-size:16px;">${title}</div>${Object.keys(groups).map(function(name){
      return `<div style="margin-top:8px;"><b>${escapeHtml(name)}</b>${groups[name].map(function(line){ return `<div>${escapeHtml(line)}</div>`; }).join('')}</div>`;
    }).join('') || '<div class="section-sub">Nenhuma tarefa aberta.</div>'}</div>`;
  }
  board.innerHTML = `<div class="section-title" style="margin-top:18px;">Lista de tarefas</div>
    <button class="btn btn-sm" type="button" onclick="printTasks()">Imprimir</button>
    <div class="grid grid-2" style="margin-top:10px;">${column('Por operador', byOperator)}${column('Por setor', bySector)}</div>`;
}
function printTasks(){
  const board = document.getElementById('taskBoard');
  const printArea = document.getElementById('printArea');
  if(!board || !printArea) return;
  printArea.innerHTML = `<div class="print-page"><div class="print-brand">SOSYSTEM</div><div class="print-doc-title">Lista de tarefas PPCP</div>${board.innerHTML}</div>`;
  setTimeout(function(){ window.print(); }, 100);
}
let pendingStudy = null;
function renderStudyBoard(){
  const board = document.getElementById('studyBoard');
  if(!board) return;
  const options = state.orders.filter(function(order){ return !orderIsClosed(order); }).map(function(order){
    return `<option value="${order.id}">${escapeHtml(orderLabel(order))} — ${escapeHtml(order.descricao || '')}</option>`;
  }).join('');
  const result = pendingStudy ? `<div class="card" style="margin-top:10px;">
      <div class="section-title" style="font-size:16px;">Sugestão</div>
      ${(pendingStudy.gargalos || []).map(function(item){ return `<div>${escapeHtml(item.orderLabel)} · ${escapeHtml(item.itemLabel)} · ${item.percentual}% · ${escapeHtml(item.motivo)}</div>`; }).join('')}
      ${(pendingStudy.suggestions || []).map(function(item){ return `<div style="margin-top:6px;"><b>${item.prioridade}. ${escapeHtml(item.orderLabel)}</b> · ${escapeHtml(item.itemLabel)} · ${escapeHtml(item.recursoNome)} · ${escapeHtml(item.funcionarioNome)}<div class="section-sub">${escapeHtml(item.motivo)}</div></div>`; }).join('') || '<div>Nenhuma sugestão com as máquinas e operadores atuais.</div>'}
      <div style="margin-top:10px;">
        <button class="btn btn-primary" data-edit="ordens" type="button" onclick="applyStudy()">OK — aplicar</button>
        <button class="btn" type="button" onclick="discardStudy()">Descartar</button>
      </div>
    </div>` : '';
  board.innerHTML = `<div class="card" style="margin-top:14px;">
      <div class="section-title" style="font-size:16px;">Estudo por IA</div>
      <div class="section-sub">Sugere máquina e operador para entregar um pedido e ocupar as máquinas. Nada muda no sistema até o OK.</div>
      <div class="field"><label>Pedido prioritário</label><select id="studyOrder">${options}</select></div>
      <button class="btn btn-primary" data-edit="ordens" type="button" onclick="createStudy()">Gerar estudo</button>
    </div>${result}`;
}
function createStudy(){
  if(deny('ordens')) return;
  const select = document.getElementById('studyOrder');
  if(!select || !select.value || !window.ProdifyStudy){ toast('Não há pedido para estudar.', 'error'); return; }
  const orders = state.orders.map(function(order){
    return Object.assign({}, order, { itens: orderItems(order) });
  });
  pendingStudy = window.ProdifyStudy.buildProductionStudy({
    targetOrderId: select.value,
    orders: orders,
    employees: state.employees,
    resources: state.resources,
    today: new Date().toISOString().slice(0, 10)
  });
  renderStudyBoard();
  applyAccess();
}
async function applyStudy(){
  if(deny('ordens')) return;
  if(!pendingStudy) return;
  if(sessionUser && sessionUser.role === 'visualizador'){ toast('O visualizador não aplica o estudo.', 'error'); return; }
  pendingStudy.suggestions.forEach(function(item){
    const order = orderById(item.orderId);
    if(!order) return;
    if(!order.itens) order.itens = orderItems(order);
    const target = order.itens.find(function(entry){ return entry.id === item.itemId; }) || order.itens[0];
    if(!target) return;
    target.recursoId = item.recursoId;
    target.recursoNome = item.recursoNome;
    target.funcionarioId = item.funcionarioId;
    target.funcionarioNome = item.funcionarioNome;
  });
  pendingStudy = null;
  await persist();
  toast('Estudo aplicado.', 'success');
  renderAcompanhamento();
}
function discardStudy(){
  pendingStudy = null;
  renderStudyBoard();
  toast('Estudo descartado.', 'success');
}
async function renderCompanySettings(){
  const box = document.getElementById('companySettings');
  if(!box || !sessionUser) return;
  let companies = [];
  try{ companies = companiesByName((await accountApi('/api/companies')).data || []); }catch(e){ companies = []; }
  const selected = activeCompanyId();
  const current = companies.find(function(company){ return company.id === selected; }) || companies[0] || null;
  const suporte = sessionUser.role === 'administrador_suporte';
  const manager = canManageUsers();
  box.innerHTML = `
    <div class="card" style="margin-top:14px;">
      <div class="section-title" style="font-size:16px;">Dados da empresa</div>
      <div class="section-sub">Versão ${escapeHtml((window.PRODIFY_CONFIG && window.PRODIFY_CONFIG.version) || '')}</div>
      ${current && current.blocked ? '<div class="section-sub" style="color:var(--red-dark);font-weight:700;">Esta empresa está bloqueada. Quem pertence a ela não entra, e a produção fica parada.</div>' : ''}
      ${suporte ? `<div class="field"><label>Empresa ativa</label><select id="activeCompany" onchange="selectCompany(this.value)"><option value="">Escolha</option>${companies.map(function(company){ return `<option value="${company.id}" ${company.id===selected?'selected':''}>${escapeHtml((company.code ? company.code + ' — ' : '') + company.name)}${company.blocked ? ' — bloqueada' : ''}</option>`; }).join('')}</select></div>
        <form onsubmit="createCompany(event)"><div class="field-row"><div class="field"><label>Id</label><input id="newCompanyCode" maxlength="12" value="${escapeHtml(nextAlphaCode(companies.map(function(company){ return company.code; })))}"></div><div class="field"><label>Descrição</label><input id="newCompanyName" required minlength="2"></div></div><button class="btn btn-primary" type="submit">Criar empresa</button></form>` : ''}
      ${current ? `<form onsubmit="saveCompany(event, '${current.id}')">
        <div class="field-row">
          <div class="field"><label>Id</label><input id="companyCode" maxlength="12" value="${escapeHtml(current.code || nextAlphaCode(companies.filter(function(company){ return company.id !== current.id; }).map(function(company){ return company.code; })))}" ${manager ? '' : 'disabled'}></div>
          <div class="field"><label>Descrição</label><input id="companyName" value="${escapeHtml(current.name)}" ${manager ? '' : 'disabled'}></div>
        </div>
        ${manager ? `<button class="btn" type="button" onclick="setSettingsChoice('perfis')">Perfis de usuário</button>` : ''}
        ${suporte ? `<div class="field-row">
          <div class="field"><label>Máximo de usuários</label><input id="maxUsers" type="number" min="1" value="${current.maxUsers}"></div>
          <div class="field"><label>Máximo de máquinas</label><input id="maxMachines" type="number" min="1" value="${current.maxMachines}"></div>
          <div class="field"><label>Máximo de cadastros</label><input id="maxRegistrations" type="number" min="1" value="${current.maxRegistrations}"></div>
        </div>
        <div class="field"><label>Data limite de uso</label><input id="usageUntil" type="date" value="${current.usageUntil || ''}"></div>
        <button class="btn" type="button" onclick="toggleCompanyBlock('${current.id}', ${current.blocked ? 'false' : 'true'})">${current.blocked ? 'Desbloquear empresa' : 'Bloquear empresa'}</button>` : ''}
        ${manager ? '<button class="btn btn-primary" type="submit">Salvar empresa</button>' : ''}
      </form>` : '<div class="section-sub">Nenhuma empresa cadastrada.</div>'}
    </div>
    <div class="card" style="margin-top:14px;" id="logList">Carregando logs…</div>`;
  loadOwnLogs();
}
async function selectCompany(id){
  if(!id || (sessionUser && sessionUser.role !== 'administrador_suporte')) return;
  localStorage.setItem('prodfy_company', id);
  state = emptyState();
  sectorHold = null;
  fingerprints = {};
  pendingDeletes = [];
  renderCompanyFoot();
  await renderCompanySettings();
  await syncNow();
  renderNav();
  renderActiveTab();
}
async function createCompany(event){
  event.preventDefault();
  try{
    const code = document.getElementById('newCompanyCode').value.trim().toUpperCase();
    const created = await accountApi('/api/companies', { method:'POST', body:{ name: document.getElementById('newCompanyName').value, code: code || undefined } });
    localStorage.setItem('prodfy_company', created.data.id);
    toast('Empresa criada.', 'success');
    await refreshCompanyFoot();
    await renderCompanySettings();
    await syncNow();
    renderActiveTab();
  }catch(error){ toast(error.message, 'error'); }
}
async function saveCompany(event, id){
  event.preventDefault();
  const body = { name: document.getElementById('companyName').value, code: document.getElementById('companyCode').value.trim().toUpperCase() };
  if(sessionUser.role === 'administrador_suporte'){
    body.maxUsers = Number(document.getElementById('maxUsers').value);
    body.maxMachines = Number(document.getElementById('maxMachines').value);
    body.maxRegistrations = Number(document.getElementById('maxRegistrations').value);
    body.usageUntil = document.getElementById('usageUntil').value || null;
  }
  try{
    await accountApi('/api/companies/' + id, { method:'PUT', body: body });
    toast('Empresa salva.', 'success');
    await renderCompanySettings();
  }catch(error){ toast(error.message, 'error'); }
}
async function toggleCompanyBlock(id, blocked){
  try{
    await accountApi('/api/companies/' + id, { method:'PUT', body:{ blocked: blocked } });
    toast(blocked ? 'Empresa bloqueada.' : 'Empresa desbloqueada.', 'success');
    await refreshCompanyFoot();
    await renderCompanySettings();
  }catch(error){ toast(error.message, 'error'); }
}
async function loadPasswordRequests(){
  const box = document.getElementById('passwordRequestList');
  if(!box) return;
  try{
    const result = await accountApi('/api/password-requests');
    box.innerHTML = `<div class="section-title" style="font-size:16px;">Pedidos de senha</div>` + (result.data.length ? result.data.map(function(item){
      return `<div style="margin-top:8px;">${escapeHtml(item.email)} · ${escapeHtml(ROLE_LABELS[item.role] || item.role)}
        <button class="btn btn-sm" type="button" onclick="resolvePasswordRequest('${item.id}')">Gerar senha provisória</button></div>`;
    }).join('') : '<div class="section-sub">Nenhum pedido pendente.</div>');
  }catch(error){ box.textContent = error.message; }
}
async function resolvePasswordRequest(id){
  try{
    const result = await accountApi('/api/password-requests/' + id + '/resolve', { method:'POST', body:{ action:'reset' } });
    window.alert('Senha provisória, mostrada uma vez:\n' + result.data.provisionalPassword);
    await loadPasswordRequests();
  }catch(error){ toast(error.message, 'error'); }
}
async function loadOwnLogs(){
  const box = document.getElementById('logList');
  if(!box) return;
  try{
    const result = await accountApi('/api/logs');
    const title = sessionUser.role === 'administrador_suporte' ? 'Logs do sistema' : 'Meus logs';
    box.innerHTML = `<div class="section-title" style="font-size:16px;">${title}</div>` + (result.data.length ? result.data.slice(0, 40).map(function(entry){
      return `<div style="margin-top:8px;"><b>${escapeHtml(entry.action)}</b> · ${escapeHtml(entry.entityKind)} · ${escapeHtml(entry.createdAt)}
        <pre style="white-space:pre-wrap; font-size:12px;">${escapeHtml(JSON.stringify({ valor_anterior: entry.valorAnterior, valor_atual: entry.valorAtual }))}</pre></div>`;
    }).join('') : '<div class="section-sub">Nenhum evento ainda.</div>');
  }catch(error){ box.textContent = error.message; }
}
async function toggleUserBlock(id, blocked){
  try{
    await accountApi('/api/users/' + id + '/block', { method:'POST', body:{ blocked: blocked } });
    toast(blocked ? 'Usuário bloqueado.' : 'Usuário desbloqueado.', 'success');
    await loadAccessUsers();
  }catch(error){ toast(error.message, 'error'); }
}

const SUPPORT_STATUS = [
  ['aberto', 'Aberto'],
  ['em_andamento', 'Em andamento'],
  ['resolvido', 'Resolvido']
];
function supportStatusLabel(status){
  const found = SUPPORT_STATUS.find(function(item){ return item[0] === status; });
  return found ? found[1] : status;
}
function renderNotifButton(){
  const button = document.getElementById('notifButton');
  if(!button) return;
  const unread = notifications.filter(function(item){ return !item.readAt; }).length;
  button.innerHTML = icon('bell', 16) + (unread ? `<span class="notif-badge">${unread}</span>` : '');
  button.setAttribute('aria-label', unread ? unread + ' notificações novas' : 'Notificações');
  if(notifOpen) renderNotifPanel();
}
function renderNotifPanel(){
  const panel = document.getElementById('notifPanel');
  if(!panel) return;
  panel.hidden = !notifOpen;
  if(!notifOpen) return;
  const items = notifications.length ? notifications.map(function(item){
    return `<button class="notif-item${item.readAt ? '' : ' unread'}" type="button" onclick="openNotification('${item.id}')"><b>${escapeHtml(item.title)}</b><span>${escapeHtml(item.body)}</span></button>`;
  }).join('') : '<div class="notif-empty">Nenhuma notificação.</div>';
  panel.innerHTML = `<div class="notif-head"><b>Notificações</b><button class="btn btn-sm" type="button" onclick="markAllNotifications()">Marcar lidas</button></div>${items}`;
}
function toggleNotifications(){
  notifOpen = !notifOpen;
  renderNotifPanel();
}
async function openNotification(id){
  const item = notifications.find(function(entry){ return entry.id === id; });
  try{
    if(item && !item.readAt) await accountApi('/api/notifications/' + id + '/read', { method:'POST' });
  }catch(error){ toast(error.message, 'error'); }
  notifOpen = false;
  renderNotifPanel();
  setTab('suporte');
  refreshSupportInbox();
}
async function markAllNotifications(){
  try{ await accountApi('/api/notifications/read', { method:'POST' }); }
  catch(error){ toast(error.message, 'error'); }
  refreshSupportInbox();
}
async function refreshSupportInbox(){
  if(!sessionUser || !authToken() || (sessionUser.mustChangePassword)) return;
  try{
    const tickets = await accountApi('/api/support');
    const notes = await accountApi('/api/notifications');
    const unread = (notes.data || []).filter(function(item){ return !item.readAt; }).length;
    if(unreadNotified >= 0 && unread > unreadNotified){
      const newest = (notes.data || []).find(function(item){ return !item.readAt; });
      if(newest) toast(newest.title + ' — ' + newest.body, 'success');
    }
    unreadNotified = unread;
    const previousTickets = JSON.stringify(supportTickets);
    const previousBadge = navBadge('suporte');
    supportTickets = tickets.data || [];
    notifications = notes.data || [];
    renderNotifButton();
    if(navBadge('suporte') !== previousBadge) renderNav();
    const panel = document.getElementById('panel-suporte');
    const typing = panel && document.activeElement && panel.contains(document.activeElement);
    if(activeTab === 'suporte' && !typing && previousTickets !== JSON.stringify(supportTickets)) renderSuporte();
  }catch(error){
    if(error && error.code === 'SESSION_REPLACED') return;
  }
}
function renderSuporte(){
  const el = document.getElementById('panel-suporte');
  if(!el || !sessionUser) return;
  const suporte = sessionUser.role === 'administrador_suporte';
  if(suporte){
    const columns = SUPPORT_STATUS.map(function(status){
      const cards = supportTickets.filter(function(ticket){ return ticket.status === status[0]; }).map(function(ticket){
        return `<article class="support-card">
          <b>${escapeHtml(ticket.subject)}</b>
          <div class="section-sub" style="margin:4px 0 8px;">${escapeHtml(ticket.authorName)} · ${escapeHtml(ticket.authorEmail)}</div>
          <div>${escapeHtml(ticket.message)}</div>
          ${ticket.reply ? `<div class="support-reply">${escapeHtml(ticket.reply)}</div>` : ''}
          <label class="field" style="margin-top:8px;">Resposta<textarea id="reply-${ticket.id}" maxlength="4000">${escapeHtml(ticket.reply || '')}</textarea></label>
          <div class="support-actions">${SUPPORT_STATUS.filter(function(option){ return option[0] !== ticket.status; }).map(function(option){
            return `<button class="btn btn-sm" type="button" onclick="updateSupportTicket('${ticket.id}','${option[0]}')">${option[1]}</button>`;
          }).join('')}</div>
        </article>`;
      }).join('');
      return `<section class="support-col"><div class="support-col-title">${status[1]}</div>${cards || '<div class="section-sub">Nenhum chamado.</div>'}</section>`;
    }).join('');
    el.innerHTML = `<div class="section-title">${icon('message',19)} Quadro de suporte</div>
      <div class="section-sub">Chamados de todas as empresas. Ao atualizar, quem abriu o chamado recebe uma notificação.</div>
      <div class="support-board">${columns}</div>`;
    return;
  }
  const mine = supportTickets.map(function(ticket){
    return `<article class="support-card">
      <div style="display:flex;justify-content:space-between;gap:8px;"><b>${escapeHtml(ticket.subject)}</b><span class="badge badge-blue">${escapeHtml(supportStatusLabel(ticket.status))}</span></div>
      <div style="margin-top:6px;">${escapeHtml(ticket.message)}</div>
      ${ticket.reply ? `<div class="support-reply">${escapeHtml(ticket.reply)}</div>` : '<div class="section-sub" style="margin-top:6px;">Aguardando o administrador suporte.</div>'}
    </article>`;
  }).join('');
  el.innerHTML = `<div class="section-title">${icon('message',19)} Suporte</div>
    <div class="section-sub">Abra um chamado. O administrador suporte recebe no quadro dele e você é avisado quando houver atualização.</div>
    <form class="card" onsubmit="createSupportTicket(event)">
      <div class="field"><label>Assunto</label><input id="supportSubject" required minlength="3" maxlength="120" placeholder="Ex: Não consigo apontar"></div>
      <div class="field"><label>Mensagem</label><textarea id="supportMessage" required minlength="3" maxlength="4000" placeholder="Descreva o que aconteceu"></textarea></div>
      <button class="btn btn-primary" type="submit">Enviar chamado</button>
    </form>
    <div class="support-list">${mine || '<div class="card section-sub">Nenhum chamado ainda.</div>'}</div>`;
}
async function createSupportTicket(event){
  event.preventDefault();
  try{
    await accountApi('/api/support', { method:'POST', body:{
      subject: document.getElementById('supportSubject').value,
      message: document.getElementById('supportMessage').value
    }});
    toast('Chamado enviado ao administrador suporte.', 'success');
    await refreshSupportInbox();
  }catch(error){ toast(error.message, 'error'); }
}
async function updateSupportTicket(id, status){
  const replyField = document.getElementById('reply-' + id);
  try{
    await accountApi('/api/support/' + id, { method:'PUT', body:{ status: status, reply: replyField ? replyField.value : '' } });
    toast('Chamado atualizado.', 'success');
    await refreshSupportInbox();
  }catch(error){ toast(error.message, 'error'); }
}

const CSV_COLUMNS = ['modulo','codigo','nome','sobrenome','descricao','funcao','turno','vinculo','grupo','familia','classificacao','tempo_min','pintura','montagem','peca','quantidade','restricao','setor','exemplo'];
const CSV_EXAMPLES = [
  ['setor','1','Chaparia','','','','','','','','','','','','','','','','sim'],
  ['operacao','','Cortar','','','','','','','','','','','','','','','','sim'],
  ['grupo','1','Separação','','','','','','','','','','','','','','','','sim'],
  ['familia','','Decanter','','','','','','Separação','','','','','','','','','','sim'],
  ['item','30.2000.0001','Tambor','','','','','','Separação','Decanter','PI','1','nao','nao','','','','Chaparia','sim'],
  ['funcionario','0001','Ana','Souza','','Operadora','1º Turno','Efetivo','','','','','','','','','','','sim'],
  ['maquina','','','','Torno','','','','','','','','','','','','','Chaparia','sim'],
  ['equipamento','','Decanter 220','','','','','','','Decanter','','','','','30.2000.0001','2','','','sim']
];
function updateCsvActions(){
  const box = document.getElementById('csvActions');
  if(!box) return;
  const visible = !!sessionUser && (canView('engenharia') || canView('funcionarios') || canView('recursos'));
  box.hidden = !visible;
  const importButton = document.getElementById('csvImportButton');
  if(importButton) importButton.hidden = !(canEdit('engenharia') || canEdit('funcionarios') || canEdit('recursos'));
}
function csvEscape(value){
  const text = value == null ? '' : String(value);
  if(/[;"\n]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
  return text;
}
function exportCadastroModelo(){
  const lines = [CSV_COLUMNS.join(';')].concat(CSV_EXAMPLES.map(function(row){
    return row.map(csvEscape).join(';');
  }));
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'sosystem-cadastro.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function(){ URL.revokeObjectURL(link.href); }, 1000);
  toast('Modelo baixado. Apague "sim" da coluna exemplo nas linhas que devem entrar.', 'success');
}
function parseCsv(text){
  const source = String(text || '').replace(/^\uFEFF/, '');
  const headerLine = (source.split(/\r?\n/)[0] || '');
  const delimiter = (headerLine.match(/;/g) || []).length >= (headerLine.match(/,/g) || []).length ? ';' : ',';
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for(let i = 0; i < source.length; i++){
    const char = source[i];
    if(quoted){
      if(char === '"'){
        if(source[i + 1] === '"'){ cell += '"'; i++; }
        else quoted = false;
      } else cell += char;
    } else if(char === '"') quoted = true;
    else if(char === delimiter){ row.push(cell); cell = ''; }
    else if(char === '\n'){ row.push(cell); rows.push(row); row = []; cell = ''; }
    else if(char !== '\r') cell += char;
  }
  if(cell.length || row.length){ row.push(cell); rows.push(row); }
  if(!rows.length) return [];
  const header = rows.shift().map(function(name){ return String(name || '').trim().toLowerCase(); });
  return rows.filter(function(columns){ return columns.some(function(value){ return String(value || '').trim(); }); }).map(function(columns){
    const record = {};
    header.forEach(function(name, index){ record[name] = String(columns[index] == null ? '' : columns[index]).trim(); });
    return record;
  });
}
function csvModule(value){
  const key = String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const aliases = {
    grupo:'grupo', grupos:'grupo',
    familia:'familia', familias:'familia',
    item:'item', produto:'item', produtos:'item', peca:'item',
    funcionario:'funcionario', funcionarios:'funcionario', colaborador:'funcionario',
    recurso:'recurso', recursos:'recurso', celula:'recurso', maquina:'recurso', maquinas:'recurso',
    equipamento:'equipamento', equipamentos:'equipamento',
    setor:'setor', setores:'setor',
    operacao:'operacao', operacoes:'operacao',
    operador:'funcionario', operadores:'funcionario'
  };
  return aliases[key] || '';
}
function csvYes(value){
  const key = String(value || '').trim().toLowerCase();
  return key === 'sim' || key === 's' || key === '1' || key === 'true' || key === 'x' || key === 'yes';
}
function csvExample(row){
  const flag = String(row.exemplo || '').trim().toLowerCase();
  return flag === 'sim' || flag === 'exemplo' || flag === 'example';
}
function normalizeTurno(value){
  const key = String(value || '').trim().toLowerCase();
  if(!key) return '1º Turno';
  if(key.indexOf('comercial') >= 0) return 'Turno Comercial';
  if(key.indexOf('admin') >= 0) return 'Administrativo';
  if(key.charAt(0) === '2') return '2º Turno';
  if(key.charAt(0) === '3') return '3º Turno';
  if(key.charAt(0) === '1') return '1º Turno';
  return String(value).trim();
}
function findGroupByName(nome){
  const key = String(nome || '').trim().toLowerCase();
  return state.groups.find(function(group){ return recordLabel(group).toLowerCase() === key; }) || null;
}
function ensureNamed(list, nome, errors, label){
  const clean = String(nome || '').trim();
  if(!clean) return null;
  let found = list.find(function(item){ return recordLabel(item).toLowerCase() === clean.toLowerCase(); });
  if(found) return found;
  if(!canEdit('engenharia')){ errors.push('Sem permissão para criar ' + label + ' ' + clean + '.'); return null; }
  const numeric = list === state.setores || list === state.groups;
  found = { id: uid(), codigo: numeric ? nextNumericCode(list) : suggestAlpha(list), descricao: clean, nome: clean };
  if(list === state.families) found.itens = [];
  list.push(found);
  return found;
}
function ensureGroup(nome, errors){
  return ensureNamed(state.groups, nome, errors, 'o grupo');
}
function ensureSetor(nome, errors){
  return ensureNamed(state.setores, nome, errors, 'o setor');
}
function findFamily(nome, groupId){
  const key = String(nome || '').trim().toLowerCase();
  return state.families.find(function(family){
    return recordLabel(family).toLowerCase() === key && (!groupId || family.grupoId === groupId);
  }) || null;
}
async function importCadastroCsv(input){
  const file = input.files && input.files[0];
  input.value = '';
  if(!file) return;
  if(!(canEdit('engenharia') || canEdit('funcionarios') || canEdit('recursos'))){
    toast('Seu perfil não importa cadastros.', 'error');
    return;
  }
  let rows = [];
  try{ rows = parseCsv(await file.text()); }
  catch(error){ toast('Não foi possível ler o CSV.', 'error'); return; }
  const order = { setor: 1, operacao: 2, grupo: 3, familia: 4, item: 5, funcionario: 6, recurso: 7, equipamento: 8 };
  rows.sort(function(a, b){ return (order[csvModule(a.modulo)] || 9) - (order[csvModule(b.modulo)] || 9); });
  const counts = { setor: 0, operacao: 0, grupo: 0, familia: 0, item: 0, funcionario: 0, recurso: 0, equipamento: 0 };
  const errors = [];
  let skipped = 0;
  const equipmentRows = [];
  rows.forEach(function(row){
    if(csvExample(row)){ skipped++; return; }
    const module = csvModule(row.modulo);
    if(!module){ if(row.modulo) errors.push('Módulo desconhecido: ' + row.modulo + '.'); else skipped++; return; }
    if(module === 'setor'){
      if(!canEdit('engenharia')){ errors.push('Sem permissão para setores.'); return; }
      const nome = row.nome || row.descricao;
      if(!nome){ errors.push('Setor sem descrição.'); return; }
      if(!state.setores.some(function(item){ return recordLabel(item).toLowerCase() === nome.toLowerCase(); })){
        const codigo = row.codigo || nextNumericCode(state.setores);
        state.setores.push({ id: uid(), codigo: String(codigo), descricao: nome, nome: nome });
        counts.setor++;
      }
      return;
    }
    if(module === 'operacao'){
      if(!canEdit('engenharia')){ errors.push('Sem permissão para operações.'); return; }
      const nome = row.nome || row.descricao;
      if(!nome){ errors.push('Operação sem descrição.'); return; }
      if(!state.operacoes.some(function(item){ return recordLabel(item).toLowerCase() === nome.toLowerCase(); })){
        state.operacoes.push({ id: uid(), codigo: (row.codigo || suggestAlpha(state.operacoes)).toUpperCase(), descricao: nome, nome: nome });
        counts.operacao++;
      }
      return;
    }
    if(module === 'grupo'){
      if(!canEdit('engenharia')){ errors.push('Sem permissão para grupos.'); return; }
      const nome = row.nome || row.descricao;
      if(!nome){ errors.push('Grupo sem descrição.'); return; }
      if(!findGroupByName(nome)){
        state.groups.push({ id: uid(), codigo: String(row.codigo || nextNumericCode(state.groups)), descricao: nome, nome: nome });
        counts.grupo++;
      }
      return;
    }
    if(module === 'familia'){
      if(!canEdit('engenharia')){ errors.push('Sem permissão para famílias.'); return; }
      const nome = row.nome || row.descricao;
      if(!nome){ errors.push('Família sem descrição.'); return; }
      const group = ensureGroup(row.grupo, errors);
      if(row.grupo && !group) return;
      if(!findFamily(nome, group && group.id)){
        state.families.push({ id: uid(), codigo: (row.codigo || suggestAlpha(state.families)).toUpperCase(), descricao: nome, nome: nome, grupoId: group ? group.id : '', itens: [] });
        counts.familia++;
      }
      return;
    }
    if(module === 'item'){
      if(!canEdit('engenharia')){ errors.push('Sem permissão para itens.'); return; }
      const descricao = row.nome || row.descricao;
      if(!descricao){ errors.push('Item sem nome.'); return; }
      const group = ensureGroup(row.grupo, errors);
      let family = row.familia ? findFamily(row.familia, group && group.id) : null;
      if(row.familia && !family){
        family = { id: uid(), codigo: suggestAlpha(state.families), descricao: row.familia, nome: row.familia, grupoId: group ? group.id : '', itens: [] };
        state.families.push(family);
        counts.familia++;
      }
      const setor = ensureSetor(row.setor, errors);
      const classificacao = String(row.classificacao || 'PI').toUpperCase() === 'PF' ? 'PF' : 'PI';
      const rawCode = String(row.codigo || '').trim();
      const codigoErp = rawCode.indexOf('.') >= 0 ? rawCode : genErpCode(classificacao);
      const codigo = rawCode.indexOf('.') >= 0 ? suggestAlpha(state.products) : (rawCode || suggestAlpha(state.products)).toUpperCase();
      const existing = state.products.find(function(product){
        return String(product.codigo).toLowerCase() === codigo.toLowerCase() || String(product.codigoErp || '').toLowerCase() === codigoErp.toLowerCase();
      });
      const flags = { pintura: csvYes(row.pintura), montagem: csvYes(row.montagem) };
      const payload = {
        codigo: existing ? existing.codigo : codigo,
        codigoErp: codigoErp,
        descricao: descricao,
        tempoFabricacaoMin: Number(String(row.tempo_min || '1').replace(',', '.')) || 1,
        classificacao: classificacao,
        familiaId: family ? family.id : '',
        grupoId: group ? group.id : '',
        setorId: setor ? setor.id : '',
        material: '',
        maquinas: existing ? (existing.maquinas || []) : [],
        rota: existing ? (existing.rota || []) : [],
        pintura: flags.pintura,
        montagem: flags.montagem
      };
      if(existing){
        const oldCode = existing.codigo;
        const oldDescricao = existing.descricao;
        Object.assign(existing, payload);
        syncProductOnOrders(oldCode, oldDescricao, existing);
      } else state.products.push(payload);
      counts.item++;
      return;
    }
    if(module === 'funcionario'){
      if(!canEdit('funcionarios')){ errors.push('Sem permissão para funcionários.'); return; }
      if(!row.nome || !row.sobrenome){ errors.push('Funcionário sem nome e sobrenome.'); return; }
      const current = state.employees.find(function(employee){ return row.codigo && (String(employee.numero) === row.codigo || String(employee.numero) === formatEmployeeNumber(parsePositiveInt(row.codigo))); });
      const assigned = assignEmployeeNumber(row.codigo, current ? current.id : '');
      if(assigned.error){ errors.push(assigned.error); return; }
      const data = { codigo: (current && current.codigo) || suggestAlpha(state.employees), numero: assigned.numero, nome: row.nome, sobrenome: row.sobrenome, funcao: row.funcao || 'Operador', turno: normalizeTurno(row.turno), vinculo: /terceir/i.test(row.vinculo) ? 'Terceiro' : 'Efetivo', ferias: current ? current.ferias : null };
      if(current) Object.assign(current, data);
      else state.employees.push(Object.assign({ id: uid() }, data));
      counts.funcionario++;
      return;
    }
    if(module === 'recurso'){
      if(!canEdit('recursos')){ errors.push('Sem permissão para recursos.'); return; }
      const codigo = (row.codigo || suggestAlpha(state.resources)).toUpperCase();
      const descricao = row.descricao || row.nome || codigo;
      const setor = ensureSetor(row.setor || row.grupo, errors);
      if(!setor){ errors.push('Máquina sem setor: ' + codigo + '.'); return; }
      const current = state.resources.find(function(resource){ return String(resource.codigo || resource.nome).toLowerCase() === codigo.toLowerCase(); });
      const payload = { codigo: codigo, nome: codigo, descricao: descricao, setorId: setor.id, setor: recordLabel(setor), restricao: row.restricao || (current && current.restricao) || '', grupos: [], operacoes: current ? (current.operacoes || []) : [], funcionarios: current ? (current.funcionarios || []) : [], status: current ? (current.status || 'Parada') : 'Parada' };
      if(current) Object.assign(current, payload);
      else state.resources.push(Object.assign({ id: uid() }, payload));
      counts.recurso++;
      return;
    }
    if(module === 'equipamento') equipmentRows.push(row);
  });
  const byEquipment = {};
  equipmentRows.forEach(function(row){
    if(!canEdit('engenharia')){ errors.push('Sem permissão para equipamentos.'); return; }
    const nome = row.nome || row.codigo;
    if(!nome){ errors.push('Equipamento sem nome.'); return; }
    if(!byEquipment[nome]) byEquipment[nome] = { familia: row.familia || '', itens: [] };
    if(row.familia) byEquipment[nome].familia = row.familia;
    if(row.peca){
      const product = productByCode(row.peca);
      byEquipment[nome].itens.push({ codigo: product ? product.codigo : row.peca, quantidade: Number(row.quantidade) || 1, setorId: product ? (product.setorId || '') : '' });
    }
  });
  Object.keys(byEquipment).forEach(function(nome){
    const parts = byEquipment[nome].itens.filter(function(part){
      if(productByCode(part.codigo)) return true;
      errors.push('Peça não cadastrada no equipamento ' + nome + ': ' + part.codigo + '.');
      return false;
    });
    if(!parts.length) return;
    const current = state.equipments.find(function(equipment){ return recordLabel(equipment).toLowerCase() === nome.toLowerCase() || String(equipment.codigo || '').toLowerCase() === nome.toLowerCase(); });
    const family = findFamily(byEquipment[nome].familia || '', '');
    if(current){
      if(!current.codigo) current.codigo = suggestAlpha(state.equipments);
      current.nome = current.descricao || nome;
      current.descricao = current.descricao || nome;
      parts.forEach(function(part){
        const existing = (current.itens || []).find(function(item){ return item.codigo === part.codigo; });
        if(existing) existing.quantidade = part.quantidade;
        else current.itens.push(part);
      });
    } else state.equipments.push({ id: uid(), codigo: suggestAlpha(state.equipments), nome: nome, descricao: nome, familiaId: family ? family.id : '', itens: parts });
    counts.equipamento++;
  });
  const applied = counts.setor + counts.operacao + counts.grupo + counts.familia + counts.item + counts.funcionario + counts.recurso + counts.equipamento;
  if(!applied && !errors.length){ toast('Nenhuma linha nova. As linhas de exemplo ficam de fora.', 'error'); return; }
  if(applied){
    await persist();
    renderActiveTab();
    applyAccess();
  }
  const summary = ['setores ' + counts.setor, 'operações ' + counts.operacao, 'grupos ' + counts.grupo, 'famílias ' + counts.familia, 'itens ' + counts.item, 'funcionários ' + counts.funcionario, 'máquinas ' + counts.recurso, 'equipamentos ' + counts.equipamento].join(', ');
  toast('Cadastros aplicados: ' + summary + (skipped ? '. Exemplos ignorados: ' + skipped + '.' : ''), errors.length ? 'error' : 'success');
  if(errors.length) toast(errors.slice(0, 3).join(' '), 'error');
}

window.setTab = setTab;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.closeModal = closeModal;
window.toggleSound = toggleSound;
window.openOrderModal = openOrderModal;
window.renderOrderPreview = renderOrderPreview;
window.saveOrder = saveOrder;
window.showOrderQR = showOrderQR;
window.printOrder = printOrder;
window.showOrderInfo = showOrderInfo;
window.addProductRow = addProductRow;
window.updateProduct = updateProduct;
window.updateClassificacao = updateClassificacao;
window.removeProduct = removeProduct;
window.openEmployeeModal = openEmployeeModal;
window.saveEmployee = saveEmployee;
window.removeEmployee = removeEmployee;
window.toggleFeriasFields = toggleFeriasFields;
window.startPunch = startPunch;
window.endPunch = endPunch;
window.stepQty = stepQty;
window.toggleQuickEmployee = toggleQuickEmployee;
window.toggleQuickMachine = toggleQuickMachine;
window.saveQuickEmployee = saveQuickEmployee;
window.saveQuickMachine = saveQuickMachine;
window.selectApFuncionario = selectApFuncionario;
window.renderApEmpGrid = renderApEmpGrid;
window.selectApRecurso = selectApRecurso;
window.openIniciarModal = openIniciarModal;
window.closeIniciarModal = closeIniciarModal;
window.openFinalizarModal = openFinalizarModal;
window.closeFinalizarModal = closeFinalizarModal;
window.selectFinFuncionario = selectFinFuncionario;
window.renderFinalizarStep1 = renderFinalizarStep1;
window.selectFinPunch = selectFinPunch;
window.confirmFinalize = confirmFinalize;
window.openScanner = openScanner;
window.closeScanner = closeScanner;
window.showAcompDetail = showAcompDetail;
window.renderOrdensTable = renderOrdensTable;
window.renderEngenhariaTable = renderEngenhariaTable;
window.renderFuncionariosTable = renderFuncionariosTable;
window.renderAcompTable = renderAcompTable;
window.clearDashFilters = clearDashFilters;
window.zerarAlocacoes = zerarAlocacoes;
window.openResourceModal = openResourceModal;
window.saveResource = saveResource;
window.removeResource = removeResource;
window.renderRecursosTable = renderRecursosTable;
window.removeResourceFromRecursos = removeResourceFromRecursos;
window.changeResourceStatus = changeResourceStatus;
window.onEmpDragStart = onEmpDragStart;
window.onResourceDrop = onResourceDrop;
window.unassignEmployee = unassignEmployee;
window.openAssignModal = openAssignModal;
window.confirmAssign = confirmAssign;
window.openEmployeePhoto = openEmployeePhoto;
window.closeEmployeePhoto = closeEmployeePhoto;
window.showForgotPassword = showForgotPassword;
window.togglePassword = togglePassword;
window.changeOrderStatus = changeOrderStatus;
window.addOrderEquipment = addOrderEquipment;
window.removeOrderDraftItem = removeOrderDraftItem;
window.setCadastroChoice = setCadastroChoice;
window.saveCadastro = saveCadastro;
window.editCadastro = editCadastro;
window.deleteCadastro = deleteCadastro;
window.addKitRow = addKitRow;
window.removeKitRow = removeKitRow;
window.addRouteRow = addRouteRow;
window.removeRouteRow = removeRouteRow;
window.moveRouteRow = moveRouteRow;
window.refreshCadastroDraft = refreshCadastroDraft;
window.onItemGroupChange = onItemGroupChange;
window.onEquipmentFamilyChange = onEquipmentFamilyChange;
window.openCadastroItem = openCadastroItem;
window.refreshItemCode = refreshItemCode;
window.fillItemFamilies = fillItemFamilies;
window.onItemFilterText = onItemFilterText;
window.onItemFilterGroup = onItemFilterGroup;
window.onItemFilterFamily = onItemFilterFamily;
window.editProduct = editProduct;
window.cancelItemEdit = cancelItemEdit;
window.removeProductByCode = removeProductByCode;
window.saveProductItem = saveProductItem;
window.printTasks = printTasks;
window.createStudy = createStudy;
window.applyStudy = applyStudy;
window.discardStudy = discardStudy;
window.selectCompany = selectCompany;
window.createCompany = createCompany;
window.saveCompany = saveCompany;
window.toggleCompanyBlock = toggleCompanyBlock;
window.resolvePasswordRequest = resolvePasswordRequest;
window.toggleUserBlock = toggleUserBlock;
window.logout = logout;
window.syncSameModule = syncSameModule;
window.showProfileRole = showProfileRole;
window.saveCompanyProfile = saveCompanyProfile;
window.setSettingsChoice = setSettingsChoice;
window.toggleDraftBlocked = toggleDraftBlocked;
window.saveAccessUser = saveAccessUser;
window.deleteAccessUser = deleteAccessUser;
window.editAccessUser = editAccessUser;
window.fillUserCompanySelect = fillUserCompanySelect;
window.toggleNotifications = toggleNotifications;
window.openNotification = openNotification;
window.markAllNotifications = markAllNotifications;
window.createSupportTicket = createSupportTicket;
window.updateSupportTicket = updateSupportTicket;
window.exportCadastroModelo = exportCadastroModelo;
window.importCadastroCsv = importCadastroCsv;

init();
})();
