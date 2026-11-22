(() => {
'use strict';
const sheets=(window.SEP_SHEETS||[]).sort((a,b)=>a.id.localeCompare(b.id));
const nav=window.SEP_NAV||[];
const allGroups=nav.filter(x=>x.parent==='Products'&&x.level===2);
const appRows=nav.filter(x=>x.parent==='Applications'&&x.level===2);
const localeKey={en:'en',zh:'zh',zhs:'zhs',ja:'ja'};
const state={route:'home',lang:'en',group:'all',sub:'all',q:'',pkg:'',status:'',ranges:{},page:1,size:20,sort:'part',homeGroup:'Diode Rectifiers',hero:0,modalRecord:null,application:null};
const $=(id)=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(s)=>String(s??'');
const lookup=(label)=>{let e=nav.find(n=>n.en===label); return e?.[localeKey[state.lang]]||label;};
const groups=allGroups.map(n=>n.en);
const leaf=(g)=>nav.filter(x=>x.parent==='Products'&&x.level===3&&x.group===g);
const byId=new Map(sheets.map(s=>[s.id,s]));
const flatten=[];
for(const sheet of sheets){let names=sheet.headers;sheet.rows.forEach((row,i)=>{let data={};names.forEach((n,idx)=>{if(n)data[n]=row[idx]});flatten.push({sheet,row,index:i,data,pn:String(data['Part Number']||''),pkg:String(data.Package||''),status:String(data.Status||data['Product Status']||''),group:sheet.group});});}
const countParts=new Map();for(const r of flatten){const key=r.pn.toUpperCase();countParts.set(key,(countParts.get(key)||0)+1)}
const getStats=(sub)=>sub==='all'?flatten.length:(byId.get(sub)?.rows.length||0);
const icons=[
 `<svg viewBox="0 0 48 48"><path d="M24 5 42 24 24 43 6 24Z"/><circle cx="24" cy="5" r="3"/><circle cx="42" cy="24" r="3"/><circle cx="24" cy="43" r="3"/><circle cx="6" cy="24" r="3"/><path d="M24 10V38M10 24H38"/></svg>`,
 `<svg viewBox="0 0 48 48"><path d="M6 24H20M30 24H42M19 11V37L33 24Z"/><path d="M34 11V37M26 7V2M26 46V41"/></svg>`,
 `<svg viewBox="0 0 48 48"><path d="M5 24H16M32 24H43M16 11V37L32 24Z"/><path d="M33 11V37M5 8l4 4M39 39l4 4"/></svg>`,
 `<svg viewBox="0 0 48 48"><path d="M24 3 40 10v15c0 10-7 16-16 20C15 41 8 35 8 25V10Z"/><path d="m16 24 6 7 12-15"/></svg>`,
 `<svg viewBox="0 0 48 48"><path d="M5 9V39M17 3V45M32 3V45M43 9V39M5 20H17M32 20H43"/><path d="M17 12h15M17 34h15"/></svg>`,
 `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"/><path d="M20 11v25M14 24h17m-7-7 7 7-7 7"/></svg>`
];
const groupIcon=Object.fromEntries(groups.map((x,i)=>[x,icons[i]]));
const apps=[
 {key:'Automotive',title:'Automotive',image:'automotive',ico:'🚘',desc:'Power management, switching, and protective semiconductor solutions for vehicle electronics.',suggest:['MOSFETs','Diode Rectifiers','Protection Devices']},
 {key:'Computer & Peripherals',title:'Computer & Peripherals',image:'computer',ico:'▣',desc:'Reliable rectifiers and protection components for computing systems and peripherals.',suggest:['Schottky Rectifiers','Protection Devices','MOSFETs']},
 {key:'Consumer',title:'Consumer',image:'consumer',ico:'⌂',desc:'Component technologies supporting consumer and home electronic products.',suggest:['Diode Rectifiers','MOSFETs']},
 {key:'Industrial',title:'Industrial',image:'industrial',ico:'⚙',desc:'High-efficiency components for industrial power and control applications.',suggest:['Bridge Rectifiers','Diode Rectifiers','MOSFETs']},
 {key:'Power Supply',title:'Power Supply',image:'power',ico:'ϟ',desc:'Power conversion and protection components for reliable power supply design.',suggest:['Bridge Rectifiers','Schottky Rectifiers','Protection Devices']},
 {key:'Telecommunication',title:'Telecommunication',image:'communications',ico:'◉',desc:'Semiconductor solutions used in high-availability communications infrastructure.',suggest:['Protection Devices','MOSFETs','Schottky Rectifiers']},
];
const heroSlides=[
 {title:'Advanced Diode Rectifiers',sub:'Efficient power conversion for applications that matter.',list:['Standard and Fast Recovery','High Efficiency & Super Fast','Dependable Power Components'],group:'Diode Rectifiers'},
 {title:'Power MOSFET Solutions',sub:'Reliable switching technology for next-generation electronics.',list:['N-Channel and P-Channel','Dual Channel Designs','High-performance Power Applications'],group:'MOSFETs'},
 {title:'Protection Devices',sub:'Designed to safeguard sensitive electronic circuits.',list:['Zener and ESD Protection','Transient Voltage Suppressors','Broad Package Availability'],group:'Protection Devices'},
];
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3300)}
function renderNavigation(){const mega=$('megaMenu');mega.innerHTML=groups.map(group=>`<div class="mega-group"><a href="#products" class="mega-group-title" data-go-products="${esc(group)}">${esc(lookup(group))}<span>↗</span></a>${leaf(group).map(sub=>`<a href="#products" class="mega-sub" data-sub="${esc(sheets.find(s=>s.group===group&&s.subcategory===sub.en)?.id||'')}">${esc(lookup(sub.en))}</a>`).join('')}</div>`).join('');
const t={en:['Home','Products','Applications','Support','About SEP','Contact'],zh:['首頁','產品資訊','應用領域','技術支援','關於 SEP','聯絡我們'],zhs:['首页','产品信息','应用领域','技术支持','关于 SEP','联系我们'],ja:['ホーム','製品情報','用途','サポート','SEPについて','お問い合わせ']}[state.lang];document.querySelectorAll('.primary-nav > [data-nav],.nav-product > [data-nav]').forEach((e,i)=>{const base=t[i]||t[1]; if(i===1) e.innerHTML=esc(base)+' <span class="nav-chevron">⌄</span>';else e.textContent=base;});}
function renderHomeGroups(){const root=$('categoryCards');root.innerHTML=groups.map(g=>`<button class="category-card ${state.homeGroup===g?'active':''}" data-homegroup="${esc(g)}">${groupIcon[g]}<span>${esc(lookup(g))}</span></button>`).join('');const subs=leaf(state.homeGroup);$('subCategoryLinks').innerHTML=subs.map(sub=>{const s=sheets.find(s=>s.group===state.homeGroup&&s.subcategory===sub.en);return `<button class="subcat-link" data-sub="${s?.id||''}">${esc(lookup(sub.en))} <small>(${s?.rows.length||0})</small></button>`}).join('');}
function renderHero(){const s=heroSlides[state.hero];$('heroTitle').textContent=s.title;$('heroSub').textContent=s.sub;$('heroBullets').innerHTML=s.list.map(x=>`<li>${esc(x)}</li>`).join('');$('heroButton').dataset.goProducts=s.group;$('heroDots').innerHTML=heroSlides.map((_,i)=>`<button class="${i===state.hero?'active':''}" data-hero-index="${i}" aria-label="Go to slide ${i+1}"></button>`).join('');}
function renderApplications(target){target.innerHTML=apps.map(a=>`<button class="application-card" data-app="${esc(a.key)}"><img alt="Illustrated ${esc(a.title)} application" src="assets/img/app-${a.image}.svg" loading="lazy"><span class="application-label"><span>${a.ico}</span>${esc(lookup(a.key))}</span></button>`).join('')}
function renderSupport(){const list=nav.filter(n=>n.parent==='Support'&&n.level===2);$('supportDirectory').innerHTML=list.map(e=>`<div class="support-group"><h3>${esc(lookup(e.en))}</h3>${nav.filter(x=>x.parent==='Support'&&x.group===e.en&&x.level===3).map(x=>`<button data-toast="${esc(x.en)}：尚待正式文件上傳">${esc(lookup(x.en))}</button>`).join('')}</div>`).join('')}
function go(route){state.route=route||'home';document.querySelectorAll('.page-view').forEach(el=>el.hidden=el.id!==`view-${state.route}`);document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.nav===state.route));$('primaryNav').classList.remove('open');$('megaMenu').classList.remove('open');$('mobileMenuToggle').setAttribute('aria-expanded','false');window.scrollTo(0,0);if(state.route==='products')renderCatalog(true);}
function openCatalog(group='all',sub='all',q=''){state.group=group;state.sub=sub;state.q=q||'';state.pkg='';state.status='';state.ranges={};state.page=1;location.hash='#products';go('products');}
function showApplication(key){const a=apps.find(x=>x.key===key);if(!a)return;state.application=key;location.hash='#applications';go('applications');const el=$('applicationDetail');el.hidden=false;el.innerHTML=`<h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><div class="group-pills">${a.suggest.map(x=>`<button data-go-products="${esc(x)}">${esc(x)} ↗</button>`).join('')}</div><div class="source-info">Suggested relationships are for demonstrating navigation only; final application-to-product associations require SEP technical confirmation.</div>`;el.scrollIntoView({block:'nearest',behavior:'smooth'});}
function selectedSheets(){return sheets.filter(s=>(state.group==='all'||s.group===state.group)&&(state.sub==='all'||s.id===state.sub))}
function possibleRecords(){return flatten.filter(r=>(state.group==='all'||r.sheet.group===state.group)&&(state.sub==='all'||r.sheet.id===state.sub))}
function numericalHeaders(){const selected=selectedSheets();if(!selected.length)return [];const first=selected[0].headers.filter(x=>x!=='Part Number'&&x!=='Package'&&x!=='Status'&&x!=='Replacement');const common=first.filter(h=>selected.every(s=>s.headers.includes(h))&&/\(V\)|\(A\)|\(mW\)|\(W\)|\(nS\)|\(µA\)|\(mA\)|\(°C\)|\(PF\)|\(Ω\)|\(pF\)|（W）|\(V\)|PPPM|hFE/.test(h));const target=state.sub==='all'?common.slice(0,2):common.slice(0,3);return target;}
function renderCatalog(reset=false){const list=possibleRecords();const current=selectedSheets();$('catalogTitle').textContent=state.sub!=='all'?(current[0]?.subcategory||'Products'):(state.group==='all'?'All Products':state.group);$('catalogDescription').textContent=`${list.length.toLocaleString()} Excel source rows · ${current.length} product ${current.length===1?'family':'families'}`;$('breadcrumbSub').textContent=(state.group==='all'?'':' / '+state.group)+(state.sub==='all'?'':' / '+(current[0]?.subcategory||''));$('groupPills').innerHTML=`<button data-go-products="all" class="${state.group==='all'?'active':''}">All Products</button>`+groups.map(g=>`<button data-go-products="${esc(g)}" class="${state.group===g?'active':''}">${esc(lookup(g))}</button>`).join('');$('catalogSearch').value=state.q;
$('subcategorySelect').innerHTML='<option value="all">All Product Families</option>'+sheets.filter(s=>state.group==='all'||s.group===state.group).map(s=>`<option value="${s.id}">${esc(lookup(s.subcategory))}</option>`).join('');$('subcategorySelect').value=state.sub;
const pkgs=[...new Set(list.map(x=>x.pkg).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));$('packageSelect').innerHTML='<option value="">All Packages</option>'+pkgs.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');$('packageSelect').value=state.pkg;
const statuses=[...new Set(list.map(x=>x.status).filter(Boolean))].sort();$('statusSelect').innerHTML='<option value="">All Status</option>'+statuses.map(x=>`<option>${esc(x)}</option>`).join('');$('statusSelect').value=state.status;
$('dynamicFilters').innerHTML=numericalHeaders().map(h=>`<div class="dynamic-filter"><label>${esc(h)}</label><div class="range-input"><input type="number" step="any" placeholder="Min" data-range="${esc(h)}" data-bound="min" value="${esc(state.ranges[h]?.min??'')}"><span>—</span><input type="number" step="any" placeholder="Max" data-range="${esc(h)}" data-bound="max" value="${esc(state.ranges[h]?.max??'')}"></div></div>`).join('');filterRows();}
function num(value){if(value===null||value===undefined||value===''||value==='-')return null;const n=parseFloat(String(value).replace(/,/g,''));return Number.isFinite(n)?n:null;}
function valuesFromUI(){state.q=$('catalogSearch').value.trim();state.pkg=$('packageSelect').value;state.status=$('statusSelect').value;state.size=Number($('pageSize').value);state.sort=$('sortSelect').value;state.ranges={};document.querySelectorAll('[data-range]').forEach(el=>{if(el.value.trim()){state.ranges[el.dataset.range] ||= {};state.ranges[el.dataset.range][el.dataset.bound]=Number(el.value)}});state.page=1;filterRows();}
let matches=[];
function filterRows(){const q=state.q.toLowerCase();matches=possibleRecords().filter(r=>{if(q&&!r.pn.toLowerCase().includes(q))return false;if(state.pkg&&r.pkg!==state.pkg)return false;if(state.status&&r.status!==state.status)return false;for(const [field,lim] of Object.entries(state.ranges)){const v=num(r.data[field]);if(v===null)return false;if(lim.min!==undefined&&v<lim.min)return false;if(lim.max!==undefined&&v>lim.max)return false;}return true;});matches.sort((a,b)=>state.sort==='partdesc'?b.pn.localeCompare(a.pn,undefined,{numeric:true}):a.pn.localeCompare(b.pn,undefined,{numeric:true}));const duplicateCount=new Set(matches.filter(r=>countParts.get(r.pn.toUpperCase())>1).map(r=>r.pn)).size;$('resultCount').textContent=matches.length.toLocaleString();$('dupTag').textContent=duplicateCount?`· ${duplicateCount} repeated part numbers in source`:'';renderRows();}
function columnsForResults(){const one=state.sub!=='all'&&byId.has(state.sub);if(one){const sheet=byId.get(state.sub);return ['Part Number','Package',...sheet.headers.filter(x=>x!=='Part Number'&&x!=='Package'&&x!=='Status'&&x!=='Product Status').slice(0,5),'Status'];}return ['Part Number','Product Family','Package','Electrical Specs','Status'];}
function specShort(r){return Object.entries(r.data).filter(([k,v])=>k!=='Part Number'&&k!=='Package'&&k!=='Status'&&k!=='Replacement'&&k!=='Product Status'&&/\(V\)|\(A\)|\(mW\)|\(W\)|（W）|\(mA\)/.test(k)&&v!==null&&v!=='-').slice(0,2).map(([k,v])=>k.replace(/\s+/g,' ')+' '+v).join(' / ') || '—';}
function renderRows(){const cols=columnsForResults();$('resultsHead').innerHTML='<tr>'+cols.map(x=>`<th>${esc(x)}</th>`).join('')+'</tr>';const max=Math.max(1,Math.ceil(matches.length/state.size));state.page=Math.min(max,Math.max(1,state.page));const rows=matches.slice((state.page-1)*state.size,state.page*state.size);$('resultsBody').innerHTML=rows.length?rows.map(r=>`<tr>${cols.map(c=>{let v=c==='Product Family'?r.sheet.subcategory:c==='Electrical Specs'?specShort(r):c==='Status'?r.status:r.data[c];if(c==='Part Number')return `<td><button data-detail="${esc(r.sheet.id)}:${r.index}">${esc(r.pn)}</button></td>`;return `<td class="${c==='Status'&&v==='Active'?'status-active':c==='Status'&&v==='NRND'?'status-nrnd':''}">${esc(v??'—')}</td>`}).join('')}</tr>`).join(''):`<tr><td colspan="${cols.length}" class="table-empty">No matching products. Try removing a filter or searching another part number.</td></tr>`;$('pageInfo').textContent=matches.length?`Showing ${(state.page-1)*state.size+1}–${Math.min(matches.length,state.page*state.size)} of ${matches.length.toLocaleString()}`:'No results';$('pageNumber').textContent=`${state.page} / ${max}`;$('pagePrev').disabled=state.page<=1;$('pageNext').disabled=state.page>=max;}
function openDetail(id){const [key,index]=id.split(':');const s=byId.get(key);if(!s)return;const i=Number(index),row=s.rows[i];if(!row)return;const r=flatten.find(x=>x.sheet.id===key&&x.index===i);state.modalRecord=r;$('modalTitle').textContent=r.pn;$('modalDesc').textContent=`${s.group} / ${s.subcategory}`;$('modalSpec').innerHTML='<div class="detail-grid">'+s.headers.map((h,j)=>`<div class="detail-row"><span>${esc(h)}</span><strong>${esc(row[j]??'—')}</strong></div>`).join('')+'</div>'+((countParts.get(r.pn.toUpperCase())||0)>1?'<p class="source-info">Note: This part number appears in more than one row of the provided product spreadsheets. Please validate before production import.</p>':'');$('partModal').hidden=false;document.body.style.overflow='hidden';$('modalClose').focus();}
function closeDetail(){$('partModal').hidden=true;document.body.style.overflow='';state.modalRecord=null;}
function csvValue(v){let str=String(v??'');if(/^[=+@\t\r]/.test(str)||(/^-[^0-9.]/.test(str)))str="'"+str;return '"'+str.replace(/"/g,'""')+'"';}
function downloadCSV(records,filename,full=false){const headers=full&&records[0]?records[0].sheet.headers:['Part Number','Category','Family','Package','Specifications','Status','Source'];const csv=[headers.map(csvValue).join(',')];for(const r of records){const data=full?headers.map(h=>r.data[h]??''):[r.pn,r.group,r.sheet.subcategory,r.pkg,specShort(r),r.status,r.sheet.source];csv.push(data.map(csvValue).join(','));}const blob=new Blob(['\ufeff',csv.join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function toProductsFromSub(sub){const s=byId.get(sub);if(s)openCatalog(s.group,s.id);}
function switchLang(lang){state.lang=localeKey[lang]?lang:'en';renderNavigation();renderHomeGroups();renderCatalog();}
function setNavFromHash(){const hash=(location.hash||'#home').slice(1).split('/')[0];go(['home','products','applications','support','about','contact'].includes(hash)?hash:'home');}
function init(){renderNavigation();renderHomeGroups();renderHero();renderApplications($('homeApplicationGrid'));renderApplications($('applicationsPageGrid'));renderSupport();setNavFromHash();}
document.addEventListener('click',event=>{
 const e=event.target.closest('button,a,[data-nav],[data-go-products]');if(!e)return;
 if(e.matches('[data-homegroup]')){state.homeGroup=e.dataset.homegroup;renderHomeGroups();return;}
 if(e.matches('[data-hero-index]')){state.hero=Number(e.dataset.heroIndex);renderHero();return;}
 if(e.matches('[data-go-products]')){event.preventDefault();openCatalog(e.dataset.goProducts);return;}
 if(e.matches('[data-sub]')){event.preventDefault();toProductsFromSub(e.dataset.sub);return;}
 if(e.matches('[data-app]')){event.preventDefault();showApplication(e.dataset.app);return;}
 if(e.matches('[data-nav]')){event.preventDefault();const route=e.dataset.nav;location.hash='#'+route;go(route);return;}
 if(e.matches('[data-detail]')){openDetail(e.dataset.detail);return;}
 if(e.matches('[data-close-modal]')){closeDetail();return;}
 if(e.matches('[data-toast]')){toast(e.dataset.toast);return;}
});
$('mobileMenuToggle').addEventListener('click',()=>{let menu=$('primaryNav');let open=menu.classList.toggle('open');$('mobileMenuToggle').setAttribute('aria-expanded',String(open));});
$('headerSearch').addEventListener('click',()=>{openCatalog();$('catalogSearch').focus();});
$('heroPrevious').addEventListener('click',()=>{state.hero=(state.hero+heroSlides.length-1)%heroSlides.length;renderHero();});
$('heroNext').addEventListener('click',()=>{state.hero=(state.hero+1)%heroSlides.length;renderHero();});
$('homeSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){openCatalog('all','all',e.currentTarget.value);}});
$('crossRefButton').addEventListener('click',()=>toast('Cross Reference 是預留功能，目前產品 Excel 未包含競品替代料對照表。'));
$('langSwitch').addEventListener('change',e=>{state.lang=e.target.value;renderNavigation();renderHomeGroups();renderCatalog();toast('Menu translations loaded from client hierarchy workbook. Main demo copy remains English.');});
$('subcategorySelect').addEventListener('change',e=>{const id=e.target.value;state.sub=id;state.pkg='';state.status='';state.ranges={};state.page=1;renderCatalog();});
$('packageSelect').addEventListener('change',valuesFromUI);$('statusSelect').addEventListener('change',valuesFromUI);
$('catalogSearch').addEventListener('keydown',e=>{if(e.key==='Enter')valuesFromUI();});
$('filterApply').addEventListener('click',valuesFromUI);
$('resetFilters').addEventListener('click',()=>{state.q='';state.pkg='';state.status='';state.ranges={};state.page=1;renderCatalog();});
$('pageSize').addEventListener('change',valuesFromUI);$('sortSelect').addEventListener('change',valuesFromUI);
$('pagePrev').addEventListener('click',()=>{state.page--;renderRows();});$('pageNext').addEventListener('click',()=>{state.page++;renderRows();});
$('exportResults').addEventListener('click',()=>{if(!matches.length){toast('No results to export.');return;}downloadCSV(matches,`SEP_products_${state.sub==='all'?'all':state.sub}_${new Date().toISOString().slice(0,10)}.csv`);});
$('modalClose').addEventListener('click',closeDetail);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('partModal').hidden)closeDetail()});
$('modalDownload').addEventListener('click',()=>{if(!state.modalRecord)return;downloadCSV([state.modalRecord],`SEP_${state.modalRecord.pn.replace(/[^a-zA-Z0-9_-]/g,'_')}_spec.csv`,true);});
$('contactForm').addEventListener('submit',e=>{e.preventDefault();toast('Demo only — no information was sent. The live contact form will be connected after approval.');});
window.addEventListener('hashchange',setNavFromHash);
init();
})();
