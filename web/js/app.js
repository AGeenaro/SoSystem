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
  printer: '<path d="M7 8V3h10v5"/><rect x="4" y="8" width="16" height="9" rx="1.5"/><path d="M7 13h10v8H7z"/><line x1="8" y1="17" x2="16" y2="17"/>'
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
  ['family', 'families', item => item.id]
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
function genErpCode(classificacao){
  const mid = classificacao==='PI' ? '2000' : '3000';
  const last4 = String(Math.floor(1000 + Math.random()*9000));
  return '30.' + mid + '.' + last4;
}
function formatOrderNumber(n){ const s = String(n).padStart(6,'0'); return s.slice(0,3) + '.' + s.slice(3); }
function formatEmployeeNumber(n){ return String(n).padStart(4,'0'); }

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
  return { employees:[], products:[], orders:[], punches:[], resources:[], groups:[], families:[], nextOrderNum:1, nextEmployeeNum:1 };
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
    if(!raw) return;
    const parsed = JSON.parse(raw);
    state = Object.assign(emptyState(), parsed.state || {});
    PRODUCTION_COLLECTIONS.forEach(([, key])=>{ if(!Array.isArray(state[key])) state[key] = []; });
    fingerprints = parsed.fingerprints || {};
    pendingDeletes = Array.isArray(parsed.pendingDeletes) ? parsed.pendingDeletes : [];
  }catch(e){
    state = emptyState();
  }
}
function buildChanges(){
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
  rebuildFingerprints();
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
    const viewing = sessionUser && sessionUser.role === 'visualizador';
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
    if(!response.ok) throw new Error('Falha ao sincronizar');
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
  {id:'engenharia', module:'engenharia', path:'/engenharia', label:'Engenharia de Produto', icn:'gear'},
  {id:'funcionarios', module:'funcionarios', path:'/funcionarios', label:'Funcionários', icn:'users'},
  {id:'acompanhamento', module:'acompanhamento', path:'/acompanhamento', label:'Acompanhamento', icn:'search'},
  {id:'configuracoes', module:'configuracoes', path:'/configuracoes', label:'Configurações', icn:'sliders'}
];
const ROLE_LABELS = {
  visualizador:'Visualizador',
  operador:'Operador',
  administrador:'Administrador',
  administrador_suporte:'Administrador suporte'
};
const SESSION_KEY = 'prodfy_session';
let sessionUser = null;
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
  sessionUser = user;
  if(user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}
function moduleOf(id){
  const item = NAV.find(function(entry){ return entry.id === id; });
  return item ? item.module : id;
}
function permissionList(user){
  const all = NAV.filter(function(entry){ return entry.module !== 'configuracoes'; }).map(function(entry){ return entry.module; });
  if(!user) return { view: [], edit: [] };
  if(user.role === 'administrador' || user.role === 'administrador_suporte') return { view: all, edit: all };
  const stored = user.permissions || {};
  const view = Array.isArray(stored.view) ? stored.view : all;
  const edit = user.role === 'visualizador' ? [] : (Array.isArray(stored.edit) ? stored.edit : []);
  return { view: view, edit: edit };
}
function canView(module){
  if(module === 'configuracoes') return true;
  return permissionList(sessionUser).view.indexOf(module) >= 0;
}
function canEdit(module){
  if(!sessionUser || sessionUser.role === 'visualizador') return false;
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
}
function setTab(id, options){
  options = options || {};
  if(!canView(moduleOf(id))) id = firstVisibleTab();
  activeTab = id;
  renderNav();
  const meta = NAV.find(n=>n.id===id);
  document.getElementById('topTitle').textContent = meta.label;
  document.getElementById('topEyebrow').textContent = 'Prodfy · Chão de Fábrica';
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
  else if(activeTab==='engenharia') renderEngenharia();
  else if(activeTab==='funcionarios') renderFuncionarios();
  else if(activeTab==='acompanhamento') renderAcompanhamento();
  else if(activeTab==='configuracoes') renderConfiguracoes();
}
function openSidebar(){ document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarScrim').classList.add('open'); }
function closeSidebar(){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarScrim').classList.remove('open'); }
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }

/* ===================== HELPERS ===================== */
function employeeName(id){ const e = state.employees.find(x=>x.id===id); return e ? (e.nome+' '+e.sobrenome) : '—'; }
function productByCode(codigo){ return state.products.find(p=>p.codigo===codigo); }
function orderLabel(order){ return (order && (order.numero || order.id)) || ''; }
function orderById(id){ return state.orders.find(o=>o.id===id || o.numero===id); }
function punchOrderLabel(punch){ const order = orderById(punch && punch.ordemId); return order ? orderLabel(order) : ((punch && punch.ordemId) || ''); }
function resourceById(id){ return state.resources.find(r=>r.id===id); }
function orderProducedQty(orderId){ return state.punches.filter(p=>p.ordemId===orderId).reduce((s,p)=>s+(Number(p.quantidadeProduzida)||0), 0); }
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
    const group = state.groups.find(function(entry){ return entry.id === item.grupoId; });
    const name = group ? group.nome : 'Sem grupo';
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
function recalcOrderStatus(order){
  order.status = normalizeOrderStatus(order.status);
}
function recalcAllOrderStatuses(){ state.orders.forEach(recalcOrderStatus); }
function isOnVacation(emp){
  if(!emp.ferias || !emp.ferias.inicio) return false;
  const today = todayISODate();
  if(today < emp.ferias.inicio) return false;
  if(emp.ferias.fim && today > emp.ferias.fim) return false;
  return true;
}
function employeeLocation(empId){ const r = state.resources.find(r=>r.funcionarios.includes(empId)); return r ? r.nome : null; }

/* ===================== RENDER SHELL ===================== */
function renderShell(){
  document.getElementById('content').innerHTML = `
    <div class="tab-panel" id="panel-dashboard"></div>
    <div class="tab-panel" id="panel-ordens"></div>
    <div class="tab-panel" id="panel-apontamento"></div>
    <div class="tab-panel" id="panel-recursos"></div>
    <div class="tab-panel" id="panel-engenharia"></div>
    <div class="tab-panel" id="panel-funcionarios"></div>
    <div class="tab-panel" id="panel-acompanhamento"></div>
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
          <input id="dashSearchInput" placeholder="Busque por célula, setor ou funcionário" value="${dashSearch}" oninput="dashSearch=this.value; renderDashLists();">
        </div>
        <div class="field fixed">
          <label>Setor monitorado</label>
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
  const setores = Array.from(new Set(state.resources.map(r=>r.setor))).sort();
  sel.innerHTML = ['Todos', ...setores].map(s=>`<option value="${s}" ${s===dashSetor?'selected':''}>${s}</option>`).join('');
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
  const list = state.employees.filter(e => !q || (e.nome+' '+e.sobrenome).toLowerCase().includes(q) || e.funcao.toLowerCase().includes(q) || (e.numero||'').includes(q));
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
    const matchesSearch = !q || r.nome.toLowerCase().includes(q) || r.descricao.toLowerCase().includes(q);
    const matchesSetor = dashSetor==='Todos' || r.setor===dashSetor;
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
        <span class="badge badge-gray">${r.setor}</span>
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
function openResourceModal(id){
  if(deny('recursos')) return;
  document.getElementById('resId').value = id || '';
  if(id){
    const r = resourceById(id);
    document.getElementById('resModalTitle').textContent = 'Editar Célula';
    document.getElementById('resNome').value = r.nome;
    document.getElementById('resDescricao').value = r.descricao;
    document.getElementById('resSetor').value = r.setor;
    document.getElementById('resRestricao').value = r.restricao || '';
  } else {
    document.getElementById('resModalTitle').textContent = 'Nova Célula / Recurso';
    document.getElementById('resNome').value = '';
    document.getElementById('resDescricao').value = '';
    document.getElementById('resSetor').value = '';
    document.getElementById('resRestricao').value = '';
  }
  openModal('modalResource');
}
async function saveResource(){
  if(deny('recursos')) return;
  const id = document.getElementById('resId').value;
  const nome = document.getElementById('resNome').value.trim();
  const descricao = document.getElementById('resDescricao').value.trim();
  const setor = document.getElementById('resSetor').value.trim() || 'Geral';
  const restricao = document.getElementById('resRestricao').value.trim();
  if(!nome || !descricao){ toast('Preencha código e descrição.', 'error'); return; }
  if(id){ Object.assign(resourceById(id), {nome,descricao,setor,restricao}); }
  else{ state.resources.push({id:uid(), nome, descricao, setor, restricao, status:'Parada', funcionarios:[], grupos:[]}); }
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
  state.resources.forEach(r=>{ r.funcionarios = r.funcionarios.filter(id=>id!==empId); });
  const target = resourceById(resId);
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
      <div class="search-box"><span class="search-ic">${icon('search',15)}</span><input placeholder="Buscar código, descrição ou setor..." oninput="recSearch=this.value; renderRecursosTable();"></div>
      <button class="btn btn-primary" data-edit="recursos" onclick="openResourceModal()">${icon('plus',14)} Novo Recurso</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Código</th><th>Descrição</th><th>Setor</th><th>Status</th><th>Funcionários</th><th style="width:110px;"></th></tr></thead>
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
  const list = state.resources.filter(r => !q || r.nome.toLowerCase().includes(q) || r.descricao.toLowerCase().includes(q) || r.setor.toLowerCase().includes(q));
  tbody.innerHTML = list.length ? list.map(r=>{
    const statusBadgeClass = r.status==='Produzindo' ? 'badge-green' : (r.status==='Manutenção' ? 'badge-amber' : 'badge-red');
    const nomes = r.funcionarios.map(id=>{ const e=state.employees.find(x=>x.id===id); return e ? (e.nome+' '+e.sobrenome) : null; }).filter(Boolean);
    return `<tr>
      <td style="font-weight:700;">${r.nome}</td>
      <td>${r.descricao}</td>
      <td><span class="badge badge-gray">${r.setor}</span></td>
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
    <div class="section-sub">Gere ordens com base nos códigos cadastrados na Engenharia de Produto e seus tempos de fabricação.</div>
    <div class="toolbar">
      <div class="search-box"><span class="search-ic">${icon('search',15)}</span><input placeholder="Buscar por OP ou código..." oninput="ordensSearch=this.value; renderOrdensTable();"></div>
      <button class="btn btn-primary" data-edit="ordens" onclick="openOrderModal()">${icon('plus',14)} Nova Ordem de Produção</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Ordem</th><th>Código</th><th>Descrição</th><th>Qtd. Planejada</th><th>Produzido</th><th>Tempo Estimado</th><th>Status</th><th></th></tr></thead>
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
    const produced = orderProducedQty(o.id);
    return `<tr>
      <td style="color:var(--blue); font-weight:700;">${orderLabel(o)}</td>
      <td>${o.codigo}</td>
      <td>${o.descricao}</td>
      <td class="mono">${o.quantidadePlanejada}</td>
      <td class="mono">${produced}</td>
      <td class="mono">${o.tempoEstimadoTotalMin.toFixed(0)} min</td>
      <td>${orderStatusBadge(o.status)}</td>
      <td style="white-space:nowrap;">
        <button class="btn btn-sm btn-ghost" data-edit="ordens" onclick="openOrderStatus('${o.id}')">Status</button>
        <button class="btn btn-sm btn-ghost" onclick="showOrderQR('${o.id}')">${icon('qrscan',13)} QR Code</button>
        <button class="icon-btn" onclick="printOrder('${o.id}')" title="Imprimir Ordem">${icon('printer',15)}</button>
      </td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="8">Nenhuma ordem de produção encontrada. Clique em "Nova Ordem de Produção" para começar.</td></tr>`;
}
function openOrderModal(){
  if(deny('ordens')) return;
  const sel = document.getElementById('ordProduto');
  if(!state.products.length){ toast('Cadastre ao menos um código na Engenharia de Produto primeiro.', 'error'); return; }
  sel.innerHTML = state.products.map(p=>`<option value="${p.codigo}">${p.codigo} — ${p.descricao} (${p.classificacao})</option>`).join('');
  const geradoSel = document.getElementById('ordGeradoPor');
  geradoSel.innerHTML = state.employees.length ? state.employees.map(e=>`<option value="${e.nome} ${e.sobrenome}">${e.nome} ${e.sobrenome}</option>`).join('') : '<option value="">Nenhum funcionário cadastrado</option>';
  document.getElementById('ordQtd').value = 100;
  renderOrderPreview();
  openModal('modalOrder');
}
function renderOrderPreview(){
  const codigo = document.getElementById('ordProduto').value;
  const qtd = Number(document.getElementById('ordQtd').value) || 0;
  const prod = productByCode(codigo);
  const prev = document.getElementById('ordPreview');
  if(!prod){ prev.innerHTML=''; return; }
  const total = prod.tempoFabricacaoMin * qtd;
  prev.innerHTML = `<div><b>${prod.descricao}</b> <span class="badge ${prod.classificacao==='PI'?'badge-purple':'badge-green'}">${prod.classificacao}</span></div>
    <div style="margin-top:6px; color:var(--text-muted);">Tempo unitário: ${prod.tempoFabricacaoMin} min/peça</div>
    <div style="color:var(--blue); font-weight:700;">Tempo total estimado: ${total.toFixed(0)} min (${(total/60).toFixed(1)} h)</div>`;
}
async function saveOrder(shouldPrint){
  if(deny('ordens')) return;
  const codigo = document.getElementById('ordProduto').value;
  const qtd = Number(document.getElementById('ordQtd').value);
  const prod = productByCode(codigo);
  const geradoPor = document.getElementById('ordGeradoPor').value || 'Não informado';
  if(!prod || !qtd || qtd<=0){ toast('Informe uma quantidade válida.', 'error'); return; }
  const numero = formatOrderNumber(state.nextOrderNum);
  const opId = uid();
  state.nextOrderNum++;
  const familia = state.families.find(function(item){ return item.id === prod.familiaId; });
  state.orders.push({ id: opId, numero, codigo: prod.codigo, descricao: prod.descricao, quantidadePlanejada: qtd, tempoEstimadoTotalMin: prod.tempoFabricacaoMin*qtd, status:'Não iniciado', setor:'', motivo:'', criadoEm: nowISO(), geradoPor, itens:[{ id: uid(), descricao: prod.descricao, grupoId: familia ? familia.grupoId : '', familiaId: prod.familiaId || '', quantidade: qtd, produzida: 0 }] });
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
      <div style="margin-top:8px;">${orderStatusBadge(order.status)} ${order.motivo ? `<span class="section-sub">${escapeHtml(order.setor || '')} · ${escapeHtml(order.motivo)}</span>` : ''}</div>
      <div style="margin-top:10px;">${groupProgress(order).map(function(row){ return `<div>${escapeHtml(row.name)}: ${row.pct}%${row.pct < 100 ? ' · pendente' : ''}</div>`; }).join('')}</div>
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
          <div class="print-brand">PRODFY</div>
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
      <div class="print-section-title">Apontamento de Produção — preenchimento manual</div>
      <table class="print-table">
        <thead><tr><th>Funcionário</th><th>Recurso</th><th>Início</th><th>Fim</th><th>Qtd. Produzida</th><th>Qtd. Refugada</th></tr></thead>
        <tbody>${blankRows}</tbody>
      </table>
      <div class="print-footer">Documento gerado pelo sistema Prodfy em ${fmtDateTime(nowISO())}</div>
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
    <div class="section-sub">Cadastro de códigos ERP, descrições, classificação e tempos de fabricação utilizados para gerar as ordens de produção. Padrão de código: <b>30.2000.XXXX</b> para PI (produto intermediário) e <b>30.3000.XXXX</b> para PF (produto final).</div>
    <div class="toolbar">
      <div class="search-box"><span class="search-ic">${icon('search',15)}</span><input placeholder="Buscar código ou descrição..." oninput="engSearch=this.value; renderEngenhariaTable();"></div>
      <button class="btn btn-primary" data-edit="engenharia" onclick="addProductRow()">${icon('plus',14)} Novo Código</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th style="width:16%;">Código ERP</th><th style="width:10%;">Classificação</th><th>Descrição</th><th style="width:16%;">Tempo (min/peça)</th><th style="width:16%;">Família</th><th style="width:60px;"></th></tr></thead>
        <tbody id="engTbody"></tbody>
      </table>
    </div>
    <div class="grid grid-2" style="margin-top:18px;">
      <div class="card" id="groupCatalog"></div>
      <div class="card" id="familyCatalog"></div>
    </div>
    <div class="card" id="groupItems" style="margin-top:14px;"></div>
  `;
  renderEngenhariaTable();
  renderCatalogs();
}
function renderEngenhariaTable(){
  const tbody = document.getElementById('engTbody');
  if(!tbody) return;
  const q = engSearch.trim().toLowerCase();
  const list = state.products.filter(p=> !q || p.codigo.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q));
  tbody.innerHTML = list.length ? list.map((p)=>{
    const realIdx = state.products.indexOf(p);
    return `<tr>
      <td class="editable-td mono"><input data-edit="engenharia" value="${p.codigo}" onchange="updateProduct(${realIdx},'codigo',this.value)"></td>
      <td><select data-edit="engenharia" class="class-select class-${p.classificacao}" onchange="updateClassificacao(${realIdx}, this.value)">
        <option value="PI" ${p.classificacao==='PI'?'selected':''}>PI</option>
        <option value="PF" ${p.classificacao==='PF'?'selected':''}>PF</option>
      </select></td>
      <td class="editable-td"><input data-edit="engenharia" value="${p.descricao}" onchange="updateProduct(${realIdx},'descricao',this.value)"></td>
      <td class="editable-td"><input data-edit="engenharia" type="number" step="0.1" min="0" value="${p.tempoFabricacaoMin}" onchange="updateProduct(${realIdx},'tempoFabricacaoMin',this.value)"></td>
      <td class="editable-td"><select data-edit="engenharia" onchange="updateProduct(${realIdx},'familiaId',this.value)"><option value="">Família</option>${state.families.map(function(family){ return `<option value="${family.id}" ${p.familiaId===family.id?'selected':''}>${escapeHtml(family.nome)}</option>`; }).join('')}</select></td>
      <td><button class="icon-btn danger" data-edit="engenharia" onclick="removeProduct(${realIdx})" title="Remover">${icon('trash',14)}</button></td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="5">Nenhum código cadastrado. Clique em "Novo Código" para começar.</td></tr>`;
  applyAccess();
}
async function addProductRow(){
  if(deny('engenharia')) return;
  state.products.push({codigo: genErpCode('PF'), descricao:'Nova peça', tempoFabricacaoMin:1, classificacao:'PF'});
  await persist();
  renderEngenhariaTable();
}
async function updateProduct(idx, field, value){
  if(deny('engenharia')) return;
  const p = state.products[idx]; if(!p) return;
  if(field==='tempoFabricacaoMin') value = Math.max(0, Number(value)||0);
  p[field] = value;
  await persist();
  toast('Código atualizado.', 'success');
}
async function updateClassificacao(idx, newClass){
  if(deny('engenharia')) return;
  const p = state.products[idx]; if(!p) return;
  p.classificacao = newClass;
  const parts = (p.codigo||'').split('.');
  const last4 = (parts[2] && /^\d{4}$/.test(parts[2])) ? parts[2] : String(Math.floor(1000+Math.random()*9000));
  p.codigo = '30.' + (newClass==='PI'?'2000':'3000') + '.' + last4;
  await persist();
  renderEngenhariaTable();
  toast('Classificação atualizada — código ' + p.codigo, 'success');
}
async function removeProduct(idx){
  if(deny('engenharia')) return;
  if(!confirm('Remover este código da Engenharia de Produto?')) return;
  state.products.splice(idx,1);
  await persist();
  renderEngenhariaTable();
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
        <thead><tr><th style="width:70px;">Nº</th><th>Nome</th><th>Função</th><th>Turno</th><th>Vínculo</th><th>Situação</th><th style="width:110px;"></th></tr></thead>
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
  const list = state.employees.filter(e => !q || (e.nome+' '+e.sobrenome).toLowerCase().includes(q) || e.funcao.toLowerCase().includes(q) || (e.numero||'').includes(q));
  tbody.innerHTML = list.length ? list.map(e=>{
    const vac = isOnVacation(e);
    const loc = employeeLocation(e.id);
    return `<tr class="${vac?'row-vacation':''}">
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
  }).join('') : `<tr class="empty-row"><td colspan="6">Nenhum funcionário cadastrado ainda.</td></tr>`;
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
    document.getElementById('empNumeroField').style.display = 'block';
    document.getElementById('empNumeroDisplay').value = e.numero || '—';
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
    document.getElementById('empNumeroField').style.display = 'none';
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
  let novoNumero = null;
  if(id){
    const e = state.employees.find(x=>x.id===id);
    Object.assign(e, {nome,sobrenome,funcao,turno,vinculo,ferias});
  } else {
    novoNumero = formatEmployeeNumber(state.nextEmployeeNum);
    state.nextEmployeeNum++;
    state.employees.push({id:uid(), numero:novoNumero, nome, sobrenome, funcao, turno, vinculo, ferias});
  }
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
  state.resources.forEach(r=>{ r.funcionarios = r.funcionarios.filter(eid=>eid!==id); });
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
function openIniciarModal(){
  if(deny('apontamento')) return;
  apFuncionarioId=''; apRecurso=''; apRecursoCustom=''; apEmpFilterQuery='';
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
    </div>
    <div class="ap-step step-purple" style="margin-bottom:14px;">
      <div class="ap-step-head"><div class="ap-step-num">2</div><div class="ap-step-title">Em qual máquina ou recurso?</div></div>
      <div class="ap-res-grid" id="apResGrid"></div>
      <div class="field" style="margin-top:14px; margin-bottom:0;">
        <label>Outra máquina (se não estiver na lista acima)</label>
        <input id="apRecursoCustomInput" placeholder="Digite o nome da máquina ou recurso" oninput="apRecursoCustom=this.value;">
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
    if(exact) apFuncionarioId = exact.id;
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
  holder.innerHTML = state.resources.length ? state.resources.map(r=>{
    const sel = apRecurso === r.nome && !apRecursoCustom;
    return `<button type="button" class="ap-res-btn ${sel?'selected':''}" onclick="selectApRecurso('${r.nome}')">
      ${sel?`<span class="ap-check">${icon('checkCircle',18)}</span>`:''}
      <div class="ap-res-code-big">${r.nome}</div>
      <div class="ap-res-desc-small">${r.descricao}</div>
    </button>`;
  }).join('') : `<div class="empty-state" style="grid-column:1/-1; padding:20px;">Nenhuma célula cadastrada. Adicione na aba Recursos.</div>`;
}
function selectApFuncionario(id){ apFuncionarioId = id; renderApEmpGrid(); }
function selectApRecurso(nome){ apRecurso = nome; apRecursoCustom=''; const c = document.getElementById('apRecursoCustomInput'); if(c) c.value=''; renderApResGrid(); }
function refreshApontamentoDatalist(){
  const ord = document.getElementById('ordensList');
  if(ord){ ord.innerHTML = state.orders.filter(o=>o.status!=='Concluída').map(o=>`<option value="${orderLabel(o)}">${orderLabel(o)} — ${o.codigo} — ${o.descricao}</option>`).join(''); }
}
function stepQty(inputId, delta){
  const el = document.getElementById(inputId);
  if(!el) return;
  el.value = Math.max(0, (Number(el.value)||0) + delta);
}
function punchQtyBlockHTML(p){
  return `
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
  if(order) recalcOrderStatus(order);
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
    const produced = orderProducedQty(o.id);
    const scrap = orderScrapQty(o.id);
    const pct = Math.min(100, (produced/o.quantidadePlanejada)*100);
    return `<tr style="cursor:pointer;" onclick="showAcompDetail('${o.id}')">
      <td style="color:var(--blue); font-weight:700;">${orderLabel(o)}</td>
      <td>${o.codigo}</td>
      <td>${o.descricao}</td>
      <td style="min-width:140px;">
        <div class="progress-track" style="margin-bottom:4px;"><div class="progress-fill" style="width:${pct}%;"></div></div>
        <div style="font-size:10.5px; color:var(--text-faint);">${produced}/${o.quantidadePlanejada}</div>
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
const MODULE_OPTIONS = NAV.filter(function(entry){ return entry.module !== 'configuracoes'; });
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
    const error = new Error(payload && payload.error ? payload.error.message : 'Falha na API.');
    error.status = response.status;
    throw error;
  }
  return payload;
}
function selectedPermissions(role){
  const boxes = Array.prototype.slice.call(document.querySelectorAll('#userPerms input:checked'));
  const chosen = boxes.map(function(box){ return box.value; });
  if(role === 'visualizador') return { view: chosen, edit: [] };
  if(role === 'operador') return { view: chosen, edit: chosen };
  return undefined;
}
function permissionChecks(role, current){
  if(role !== 'visualizador' && role !== 'operador') {
    return '<div class="section-sub">Este perfil cobre a produção inteira. O administrador suporte também cria outros administradores suporte.</div>';
  }
  const key = role === 'visualizador' ? 'view' : 'edit';
  const selected = current && current[key] ? current[key] : MODULE_OPTIONS.map(function(item){ return item.module; });
  const title = role === 'visualizador' ? 'Pode ver' : 'Pode alterar';
  return `<div class="section-sub">${title}</div><div class="perm-grid" id="userPerms">${MODULE_OPTIONS.map(function(item){
    const checked = selected.indexOf(item.module) >= 0 ? 'checked' : '';
    return `<label class="perm-item"><input type="checkbox" value="${item.module}" ${checked}> ${item.label}</label>`;
  }).join('')}</div>`;
}
function renderConfiguracoes(){
  const el = document.getElementById('panel-configuracoes');
  if(!el || !sessionUser) return;
  const roles = sessionUser.role === 'administrador_suporte'
    ? ['visualizador','operador','administrador','administrador_suporte']
    : ['visualizador','operador','administrador'];
  el.innerHTML = `
    <div class="section-title">${icon('sliders',19)} Configurações</div>
    <div class="section-sub">Perfil de acesso e contas que entram no sistema.</div>
    <form id="profileForm" class="card" style="margin-bottom:14px;" onsubmit="saveProfile(event)">
      <div class="section-title" style="font-size:16px;">Meu perfil</div>
      <div class="section-sub">${escapeHtml(ROLE_LABELS[sessionUser.role] || sessionUser.role)}</div>
      <div class="field-row">
        <div class="field"><label>Nome</label><input id="cfgName" required minlength="2" maxlength="80" value="${escapeHtml(sessionUser.name)}"></div>
        <div class="field"><label>E-mail</label><input id="cfgEmail" type="email" required value="${escapeHtml(sessionUser.email)}"></div>
      </div>
      <div class="field"><label>Nova senha</label>
        <div class="password-field">
          <input id="cfgPassword" type="password" minlength="8" maxlength="72" autocomplete="new-password" placeholder="Deixe em branco para manter">
          <button class="eye-btn" type="button" onclick="togglePassword('cfgPassword', this)">mostrar</button>
        </div>
      </div>
      <button class="btn btn-primary" type="submit">Salvar perfil</button>
    </form>
    ${canManageUsers() ? `
    <form id="accessUserForm" class="card" style="margin-bottom:14px;" onsubmit="saveAccessUser(event)">
      <div class="section-title" style="font-size:16px;">Usuários do sistema</div>
      <div class="section-sub">Visualizador só consulta o que for marcado. Operador altera as áreas marcadas e não mexe em contas. Administrador conduz o sistema, sem o acesso de suporte.</div>
      <input type="hidden" id="editingUserId" value="">
      <div class="field-row">
        <div class="field"><label>Nome</label><input id="userName" required minlength="2"></div>
        <div class="field"><label>E-mail</label><input id="userEmail" type="email" required></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Senha provisória</label><input id="userPassword" disabled placeholder="Gerada ao salvar e mostrada uma vez"></div>
        <div class="field"><label>Perfil</label>
          <select id="userRole" onchange="renderPermissionChoices()">${roles.map(function(role){ return `<option value="${role}">${ROLE_LABELS[role]}</option>`; }).join('')}</select>
        </div>
      </div>
      <div id="permissionChoices"></div>
      <button class="btn btn-primary" type="submit">Salvar usuário</button>
    </form>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th style="width:140px;"></th></tr></thead>
      <tbody id="accessUsersBody"><tr class="empty-row"><td colspan="4">Carregando contas…</td></tr></tbody>
    </table></div></div>` : `<div class="card">Seu perfil consulta e, quando permitido, altera a produção. Contas novas são criadas por um administrador.</div>`}
  `;
  if(canManageUsers()){
    renderPermissionChoices();
    loadAccessUsers();
  }
  const extra = document.createElement('div');
  extra.id = 'companySettings';
  el.appendChild(extra);
  renderCompanySettings();
}
function renderPermissionChoices(current){
  const holder = document.getElementById('permissionChoices');
  const role = document.getElementById('userRole');
  if(!holder || !role) return;
  holder.innerHTML = permissionChecks(role.value, current);
}
async function loadAccessUsers(){
  const body = document.getElementById('accessUsersBody');
  if(!body) return;
  try{
    const result = await accountApi('/api/users');
    body.innerHTML = result.data.map(function(user){
      const mine = sessionUser && sessionUser.id === user.id;
      return `<tr>
        <td>${escapeHtml(user.name)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${escapeHtml(ROLE_LABELS[user.role] || user.role)}</td>
        <td>
          <button class="icon-btn" type="button" onclick="editAccessUser('${user.id}')" title="Editar">${icon('edit',14)}</button>
          ${mine ? '' : `<button class="btn btn-sm" type="button" onclick="toggleUserBlock('${user.id}', ${user.blocked ? 'false' : 'true'})">${user.blocked ? 'Desbloquear' : 'Bloquear'}</button>`}
          <button class="icon-btn danger" type="button" onclick="deleteAccessUser('${user.id}')" ${mine ? 'disabled' : ''} title="Excluir">${icon('trash',14)}</button>
        </td>
      </tr>`;
    }).join('') || `<tr class="empty-row"><td colspan="4">Nenhuma conta.</td></tr>`;
  }catch(error){
    body.innerHTML = `<tr class="empty-row"><td colspan="4">${escapeHtml(error.message)}</td></tr>`;
  }
}
async function editAccessUser(id){
  try{
    const result = await accountApi('/api/users/' + id);
    const user = result.data;
    document.getElementById('editingUserId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = user.role;
    renderPermissionChoices(user.permissions);
  }catch(error){
    toast(error.message, 'error');
  }
}
async function saveProfile(event){
  event.preventDefault();
  try{
    const body = {
      name: document.getElementById('cfgName').value,
      email: document.getElementById('cfgEmail').value
    };
    const password = document.getElementById('cfgPassword').value;
    if(password) body.password = password;
    const updated = await accountApi('/api/users/' + sessionUser.id, { method:'PUT', body: body });
    rememberSession(Object.assign({}, sessionUser, updated.data));
    document.getElementById('cfgPassword').value = '';
    toast('Perfil salvo.', 'success');
    renderNav();
  }catch(error){
    toast(error.message, 'error');
  }
}
async function saveAccessUser(event){
  event.preventDefault();
  const id = document.getElementById('editingUserId').value;
  const role = document.getElementById('userRole').value;
  const body = {
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    role: role
  };
  const password = document.getElementById('userPassword').value;
  const permissions = selectedPermissions(role);
  if(permissions) body.permissions = permissions;
  try{
    if(sessionUser.role === 'administrador_suporte') body.companyId = activeCompanyId();
    if(id){
      if(password) body.password = password;
      await accountApi('/api/users/' + id, { method:'PUT', body: body });
      toast('Usuário salvo.', 'success');
    }else{
      if(role !== 'administrador_suporte' && !activeCompanyId() && sessionUser.role === 'administrador_suporte'){
        toast('Escolha a empresa antes de criar o usuário.', 'error');
        return;
      }
      const created = await accountApi('/api/users', { method:'POST', body: body });
      window.alert('Senha provisória, mostrada uma vez:\n' + created.data.provisionalPassword + '\nA pessoa troca no primeiro acesso.');
      toast('Usuário criado. A senha provisória foi mostrada nesta tela.', 'success');
    }
    event.target.reset();
    document.getElementById('editingUserId').value = '';
    renderPermissionChoices();
    toast('Usuário salvo.', 'success');
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
  localStorage.removeItem('prodfy_jwt');
  rememberSession(null);
  showLogin(false);
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
  await boot();
  setInterval(()=>{ if(activeTab==='dashboard') renderRankingAndCharts(); if(activeTab==='apontamento'){ renderApontamento(); applyAccess(); } }, 15000);
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
  button.textContent = show ? 'ocultar' : 'mostrar';
}
async function openOrderStatus(id){
  if(deny('ordens')) return;
  const order = orderById(id);
  if(!order) return;
  const next = window.prompt('Novo status:\n' + ORDER_STATUSES.join('\n'), normalizeOrderStatus(order.status));
  if(!next) return;
  if(ORDER_STATUSES.indexOf(next) < 0){ toast('Status desconhecido.', 'error'); return; }
  let setor = order.setor || '';
  let motivo = order.motivo || '';
  if(next === 'Iniciado/Parado' || next === 'Bloqueado'){
    setor = window.prompt('Setor', setor) || '';
    motivo = window.prompt('Motivo', motivo) || '';
    if(!setor.trim() || !motivo.trim()){ toast('Informe o setor e o motivo.', 'error'); return; }
  }
  order.status = next;
  order.setor = setor.trim();
  order.motivo = motivo.trim();
  await persist();
  if(activeTab === 'ordens') renderOrdens();
  if(activeTab === 'acompanhamento') renderAcompanhamento();
}
function readImageFile(input, done){
  const file = input.files && input.files[0];
  if(!file){ done(''); return; }
  if(file.size > 180000){ toast('Use uma imagem de até 180 KB.', 'error'); input.value = ''; return; }
  const reader = new FileReader();
  reader.onload = function(){ done(String(reader.result || '')); };
  reader.readAsDataURL(file);
}
function renderCatalogs(){
  const groups = document.getElementById('groupCatalog');
  const families = document.getElementById('familyCatalog');
  if(!groups || !families) return;
  groups.innerHTML = `<div class="section-title" style="font-size:16px;">Grupos</div>
    <div class="section-sub">Ex.: Usinagem, Chaparia, Pintura, Almoxarifado.</div>
    <div class="field"><label>Nome</label><input id="groupName" data-edit="engenharia"></div>
    <div class="field"><label>Imagem</label><input id="groupImage" type="file" accept="image/*" data-edit="engenharia"></div>
    <button class="btn btn-primary" data-edit="engenharia" type="button" onclick="saveGroup()">Salvar grupo</button>
    <div style="margin-top:12px;">${state.groups.map(function(group){
      return `<button class="btn btn-sm" type="button" style="margin:4px;" onclick="showGroupItems('${group.id}')">${group.imagem ? `<img alt="" src="${group.imagem}" style="width:22px;height:22px;object-fit:cover;border-radius:4px;vertical-align:middle;"> ` : ''}${escapeHtml(group.nome)}</button>`;
    }).join('') || '<div class="section-sub">Nenhum grupo.</div>'}</div>`;
  families.innerHTML = `<div class="section-title" style="font-size:16px;">Famílias</div>
    <div class="section-sub">Ex.: Ponteiras, Chapas, Tubos, Arruelas.</div>
    <div class="field"><label>Nome</label><input id="familyName" data-edit="engenharia"></div>
    <div class="field"><label>Grupo</label><select id="familyGroup" data-edit="engenharia">${state.groups.map(function(group){ return `<option value="${group.id}">${escapeHtml(group.nome)}</option>`; }).join('')}</select></div>
    <div class="field"><label>Imagem</label><input id="familyImage" type="file" accept="image/*" data-edit="engenharia"></div>
    <button class="btn btn-primary" data-edit="engenharia" type="button" onclick="saveFamily()">Salvar família</button>
    <div style="margin-top:12px;">${state.families.map(function(family){
      return `<button class="btn btn-sm" type="button" style="margin:4px;" onclick="showFamilyModels('${family.id}')">${escapeHtml(family.nome)}</button>`;
    }).join('') || '<div class="section-sub">Nenhuma família.</div>'}</div>`;
}
async function saveGroup(){
  if(deny('engenharia')) return;
  const nome = document.getElementById('groupName').value.trim();
  if(!nome){ toast('Informe o nome do grupo.', 'error'); return; }
  readImageFile(document.getElementById('groupImage'), async function(imagem){
    state.groups.push({ id: uid(), nome: nome, imagem: imagem });
    await persist();
    renderCatalogs();
    applyAccess();
  });
}
async function saveFamily(){
  if(deny('engenharia')) return;
  const nome = document.getElementById('familyName').value.trim();
  const grupoId = document.getElementById('familyGroup').value;
  if(!nome || !grupoId){ toast('Informe a família e o grupo.', 'error'); return; }
  readImageFile(document.getElementById('familyImage'), async function(imagem){
    state.families.push({ id: uid(), nome: nome, grupoId: grupoId, imagem: imagem });
    await persist();
    renderCatalogs();
    renderEngenhariaTable();
    applyAccess();
  });
}
function showGroupItems(groupId){
  const group = state.groups.find(function(item){ return item.id === groupId; });
  const box = document.getElementById('groupItems');
  if(!group || !box) return;
  const families = state.families.filter(function(item){ return item.grupoId === groupId; });
  const familyIds = families.map(function(item){ return item.id; });
  const models = state.products.filter(function(item){ return familyIds.indexOf(item.familiaId) >= 0; });
  box.innerHTML = `<div class="section-title" style="font-size:16px;">${escapeHtml(group.nome)}</div>
    <div class="section-sub">Famílias e modelos vinculados.</div>
    <div>${families.map(function(item){ return escapeHtml(item.nome); }).join(', ') || 'Nenhuma família.'}</div>
    <div style="margin-top:8px;">${models.map(function(item){ return `<div>${escapeHtml(item.codigo)} — ${escapeHtml(item.descricao)}</div>`; }).join('') || 'Nenhum modelo.'}</div>`;
}
function showFamilyModels(familyId){
  const family = state.families.find(function(item){ return item.id === familyId; });
  const box = document.getElementById('groupItems');
  if(!family || !box) return;
  const models = state.products.filter(function(item){ return item.familiaId === familyId; });
  box.innerHTML = `<div class="section-title" style="font-size:16px;">${escapeHtml(family.nome)}</div>
    ${models.map(function(item){ return `<div>${escapeHtml(item.codigo)} — ${escapeHtml(item.descricao)}</div>`; }).join('') || '<div>Nenhum modelo nesta família.</div>'}`;
}
function renderTaskBoard(){
  const board = document.getElementById('taskBoard');
  if(!board) return;
  const byOperator = {};
  const byMachine = {};
  state.orders.filter(function(order){ return !orderIsClosed(order); }).forEach(function(order){
    orderItems(order).forEach(function(item){
      const produced = Number(item.produzida) || 0;
      const planned = Number(item.quantidade) || 0;
      if(planned && produced >= planned) return;
      const line = `${orderLabel(order)} · ${item.descricao || order.descricao} · falta ${Math.max(planned - produced, 0)}`;
      const operator = item.funcionarioNome || 'Sem operador';
      const machine = item.recursoNome || 'Sem máquina';
      if(!byOperator[operator]) byOperator[operator] = [];
      if(!byMachine[machine]) byMachine[machine] = [];
      byOperator[operator].push(line);
      byMachine[machine].push(line);
    });
  });
  function column(title, groups){
    return `<div class="card"><div class="section-title" style="font-size:16px;">${title}</div>${Object.keys(groups).map(function(name){
      return `<div style="margin-top:8px;"><b>${escapeHtml(name)}</b>${groups[name].map(function(line){ return `<div>${escapeHtml(line)}</div>`; }).join('')}</div>`;
    }).join('') || '<div class="section-sub">Nenhuma tarefa aberta.</div>'}</div>`;
  }
  board.innerHTML = `<div class="section-title" style="margin-top:18px;">Lista de tarefas</div>
    <button class="btn btn-sm" type="button" onclick="printTasks()">Imprimir</button>
    <div class="grid grid-2" style="margin-top:10px;">${column('Por operador', byOperator)}${column('Por máquina', byMachine)}</div>`;
}
function printTasks(){
  const board = document.getElementById('taskBoard');
  const printArea = document.getElementById('printArea');
  if(!board || !printArea) return;
  printArea.innerHTML = `<div class="print-page"><div class="print-brand">PRODFY</div><div class="print-doc-title">Lista de tarefas PPCP</div>${board.innerHTML}</div>`;
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
  try{ companies = (await accountApi('/api/companies')).data || []; }catch(e){ companies = []; }
  const selected = activeCompanyId();
  const current = companies.find(function(company){ return company.id === selected; }) || companies[0] || null;
  const suporte = sessionUser.role === 'administrador_suporte';
  const manager = canManageUsers();
  box.innerHTML = `
    <div class="card" style="margin-top:14px;">
      <div class="section-title" style="font-size:16px;">Empresa</div>
      <div class="section-sub">Versão ${escapeHtml((window.PRODIFY_CONFIG && window.PRODIFY_CONFIG.version) || '')}</div>
      ${suporte ? `<div class="field"><label>Empresa ativa</label><select id="activeCompany" onchange="selectCompany(this.value)"><option value="">Escolha</option>${companies.map(function(company){ return `<option value="${company.id}" ${company.id===selected?'selected':''}>${escapeHtml(company.name)}</option>`; }).join('')}</select></div>
        <form onsubmit="createCompany(event)"><div class="field-row"><div class="field"><label>Nova empresa</label><input id="newCompanyName" required minlength="2"></div></div><button class="btn btn-primary" type="submit">Criar empresa</button></form>` : ''}
      ${current ? `<form onsubmit="saveCompany(event, '${current.id}')">
        ${current.logo ? `<img class="logo-preview" alt="Logo" src="${current.logo}">` : ''}
        <div class="field"><label>Nome</label><input id="companyName" value="${escapeHtml(current.name)}" ${manager ? '' : 'disabled'}></div>
        <div class="field"><label>Logo</label><input id="companyLogo" type="file" accept="image/*" ${manager ? '' : 'disabled'}></div>
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
    ${manager ? '<div class="card" style="margin-top:14px;" id="passwordRequestList">Carregando pedidos de senha…</div>' : ''}
    <div class="card" style="margin-top:14px;" id="logList">Carregando logs…</div>`;
  if(manager) loadPasswordRequests();
  loadOwnLogs();
}
async function selectCompany(id){
  localStorage.setItem('prodfy_company', id || '');
  state = emptyState();
  fingerprints = {};
  pendingDeletes = [];
  await renderCompanySettings();
  await syncNow();
  renderNav();
}
async function createCompany(event){
  event.preventDefault();
  try{
    const created = await accountApi('/api/companies', { method:'POST', body:{ name: document.getElementById('newCompanyName').value } });
    localStorage.setItem('prodfy_company', created.data.id);
    toast('Empresa criada.', 'success');
    await renderCompanySettings();
  }catch(error){ toast(error.message, 'error'); }
}
async function saveCompany(event, id){
  event.preventDefault();
  const body = { name: document.getElementById('companyName').value };
  if(sessionUser.role === 'administrador_suporte'){
    body.maxUsers = Number(document.getElementById('maxUsers').value);
    body.maxMachines = Number(document.getElementById('maxMachines').value);
    body.maxRegistrations = Number(document.getElementById('maxRegistrations').value);
    body.usageUntil = document.getElementById('usageUntil').value || null;
  }
  const file = document.getElementById('companyLogo').files && document.getElementById('companyLogo').files[0];
  const send = async function(logo){
    if(logo) body.logo = logo;
    try{
      await accountApi('/api/companies/' + id, { method:'PUT', body: body });
      toast('Empresa salva.', 'success');
      await renderCompanySettings();
    }catch(error){ toast(error.message, 'error'); }
  };
  if(file) readImageFile(document.getElementById('companyLogo'), send);
  else send('');
}
async function toggleCompanyBlock(id, blocked){
  try{
    await accountApi('/api/companies/' + id, { method:'PUT', body:{ blocked: blocked } });
    toast(blocked ? 'Empresa bloqueada.' : 'Empresa desbloqueada.', 'success');
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
window.openOrderStatus = openOrderStatus;
window.saveGroup = saveGroup;
window.saveFamily = saveFamily;
window.showGroupItems = showGroupItems;
window.showFamilyModels = showFamilyModels;
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
window.saveProfile = saveProfile;
window.saveAccessUser = saveAccessUser;
window.deleteAccessUser = deleteAccessUser;
window.editAccessUser = editAccessUser;
window.renderPermissionChoices = renderPermissionChoices;

init();
})();
