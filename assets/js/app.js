(() => {
'use strict';
const sheets=(window.SEP_SHEETS||[]).sort((a,b)=>a.id.localeCompare(b.id));
const nav=window.SEP_NAV||[];
const allGroups=nav.filter(x=>x.parent==='Products'&&x.level===2);
const appRows=nav.filter(x=>x.parent==='Applications'&&x.level===2);
const localeKey={en:'en',zh:'zh',zhs:'zhs',ja:'ja'};
const state={route:'home',lang:'en',group:'all',sub:'all',q:'',pkg:'',status:'',ranges:{},page:1,size:20,sort:'part',homeGroup:'Diode Rectifiers',hero:0,modalRecord:null,application:null,facets:{},supportGroups:[],supportKeyword:'',megaProductGroup:'Bridge Rectifiers',megaApplication:0,megaApplicationFocus:0,aboutSection:'company-profile',selectedRows:new Set()};
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

/* V4.2 P1 content and navigation */
const productOverview={
 'Bridge Rectifiers':{image:'product-bridge.svg',text:'Single-phase and three-phase bridge rectifiers for AC to DC conversion.'},
 'Diode Rectifiers':{image:'product-diode.svg',text:'Standard, fast recovery, high efficiency, super-fast and switching rectifier diode families.'},
 'Schottky Rectifiers':{image:'product-schottky.svg',text:'Small-signal and power Schottky devices organized by electrical characteristics.'},
 'Protection Devices':{image:'product-protection.svg',text:'Explore Zener, ESD and transient voltage protection device categories.'},
 'MOSFETs':{image:'product-mosfet.svg',text:'N-channel, P-channel, dual channel and small-signal MOSFET families.'},
 'Transistors':{image:'product-transistor.svg',text:'General-purpose bipolar and digital transistor product families.'}
};
const appFocus={
 'Automotive':['Vehicle Power Management','Automotive Lighting','On-board Charging','Infotainment & Displays','Battery Management'],
 'Computer & Peripherals':['PC Power Conversion','Server Hardware','Display & Monitor','Storage & Peripherals','Notebook Adapters'],
 'Consumer':['Home Appliances','Smart Home Devices','Portable Electronics','LED Lighting','Audio & Video'],
 'Industrial':['Factory Automation','Motor Control','Industrial Power Supply','Instrumentation','UPS / Backup Power'],
 'Power Supply':['AC-DC Power Supply','DC-DC Conversion','Adapter & Charger','Industrial Power Supply','Server Power','UPS / Backup Power'],
 'Telecommunication':['Telecom Power Supply','Network Equipment','Base Station Systems','Communication Protection','Routers & Gateways']
};
const aboutPages=[
 {label:'Company Profile',slug:'company-profile',lead:'SEP Electronics company overview',body:'This page provides a dedicated location for the official company introduction, background and history.',note:'Official company profile copy and history are pending SEP approval.',route:'products',action:'View Products'},
 {label:'Business Philosophy',slug:'business-philosophy',lead:'Company values and philosophy',body:'SEP-approved business principles and quality commitments will be published in this section.',note:'The final wording must be approved by SEP before release.',route:'contact',action:'Contact SEP'},
 {label:'Capability',slug:'capability',lead:'Engineering and product capabilities',body:'Browse the product catalog while verified capability statements, facilities and certification details are prepared.',note:'No manufacturing, testing or certification claims have been added without verified documents.',route:'products',action:'Browse Product Center'},
 {label:'Careers',slug:'careers',lead:'Careers and opportunities',body:'This section is prepared for verified vacancies and recruiting instructions. No active job openings are published in this prototype.',note:'Job listings and recruitment details are pending SEP materials.',route:'contact',action:'Contact SEP'},
 {label:'News',slug:'news',lead:'News and announcements',body:'This is the destination for verified company news, product announcements and future publications.',note:'There are no SEP-approved news articles in the current prototype.',route:'products',action:'Explore Products'},
 {label:'Privacy Policy',slug:'privacy-policy',lead:'Privacy and data protection information',body:'The final text must be based on actual website data processing, contact forms, cookies and SEP-approved legal terms.',note:'This is a placeholder and not an official privacy policy.',route:'contact',action:'Contact SEP'}
];
function aboutSlug(v){return aboutPages.find(p=>p.slug===v||p.label===v)?.slug||'company-profile'}
function renderAboutPage(){
 const p=aboutPages.find(x=>x.slug===state.aboutSection)||aboutPages[0];state.aboutSection=p.slug;
 $('aboutNav').innerHTML=aboutPages.map(x=>`<a href="#about/${x.slug}" data-about-section="${x.slug}" class="${x.slug===p.slug?'active':''}" ${x.slug===p.slug?'aria-current="page"':''}>${esc(lookup(x.label))} <span aria-hidden="true">↗</span></a>`).join('');
 $('aboutContent').innerHTML=`<div class="about-detail-heading"><span class="overline">ABOUT SEP · ${esc(p.label)}</span><h3>${esc(lookup(p.label))}</h3><p>${esc(p.lead)}</p></div><div class="about-detail-body"><p>${esc(p.body)}</p><p class="about-pending-note">${esc(p.note)}</p><a href="#${p.route}" data-nav="${p.route}" class="btn btn-primary">${esc(p.action)} ↗</a></div>`;
}
function renderNavigation(){
 const selected=groups.includes(state.megaProductGroup)?state.megaProductGroup:groups[0];state.megaProductGroup=selected;
 const items=leaf(selected),overview=productOverview[selected];
 $('megaMenu').innerHTML=`
  <div class="mega-pane mega-major"><h2 class="mega-section-title">Product Family</h2><div class="mega-choice-list" role="tablist" aria-label="Product groups">${groups.map(g=>`<button type="button" role="tab" aria-selected="${g===selected}" data-mega-cat="${esc(g)}" class="mega-rail-item ${g===selected?'selected':''}"><span class="mega-choice-icon" aria-hidden="true">${groupIcon[g]}</span><span class="mega-choice-label">${esc(lookup(g))}</span><span class="mega-arrow">›</span></button>`).join('')}</div></div>
  <div class="mega-pane mega-minor"><h2 class="mega-section-title">Category</h2><div class="mega-choice-list mega-family-list">${items.map(s=>{const sheet=sheets.find(x=>x.group===selected&&x.subcategory===s.en);return `<a class="mega-family" href="#products" data-sub="${esc(sheet?.id||'')}">${esc(lookup(s.en))}<span>↗</span></a>`}).join('')}</div></div>
  <div class="mega-pane mega-overview"><h2 class="mega-section-title">Overview</h2><div class="mega-overview-layout">
   <img class="mega-overview-image" src="assets/img/${overview.image}" alt="Concept illustration for ${esc(selected)}" loading="lazy">
   <div class="mega-overview-copy"><p>${esc(overview.text)}</p>
    <button type="button" class="mega-overview-link" data-go-products="${esc(selected)}">View all ${esc(lookup(selected))} <span>↗</span></button>
    <button type="button" class="mega-overview-link mega-outline-link" data-datasheets-pending="${esc(selected)}">Download Datasheets <span>↗</span></button>
    <small>Concept illustration · Official PDF files not yet supplied</small>
   </div></div></div>`;
 state.megaApplication=Math.min(Math.max(state.megaApplication,0),apps.length-1);
 const a=apps[state.megaApplication],focuses=appFocus[a.key]||[];
 state.megaApplicationFocus=Math.min(Math.max(state.megaApplicationFocus||0,0),Math.max(0,focuses.length-1));
 const currentFocus=focuses[state.megaApplicationFocus]||a.key;
 const related=a.key==='Power Supply'?['Bridge Rectifiers','Diode Rectifiers','Schottky Rectifiers','Protection Devices','MOSFETs']:a.suggest;
 $('appMegaMenu').innerHTML=`
  <div class="mega-pane mega-major"><h2 class="mega-section-title">Application</h2><div class="mega-choice-list" role="tablist" aria-label="Application industries">${apps.map((item,i)=>`<button type="button" role="tab" aria-selected="${i===state.megaApplication}" data-mega-app="${i}" class="mega-rail-item ${i===state.megaApplication?'selected':''}"><span class="mega-app-icon" aria-hidden="true">${item.ico}</span><span class="mega-choice-label">${esc(lookup(item.key))}</span><span class="mega-arrow">›</span></button>`).join('')}</div></div>
  <div class="mega-pane mega-minor"><h2 class="mega-section-title">Application Focus</h2><div class="mega-choice-list mega-family-list" role="tablist" aria-label="Application focus areas">${focuses.map((s,i)=>`<button type="button" role="tab" aria-selected="${i===state.megaApplicationFocus}" class="mega-family ${i===state.megaApplicationFocus?'selected':''}" data-mega-focus="${i}">${esc(s)}<span>↗</span></button>`).join('')}</div></div>
  <div class="mega-pane mega-overview"><h2 class="mega-section-title">Related Product Families</h2><div class="mega-overview-layout">
   <img class="mega-overview-image" src="assets/img/app-${esc(a.image)}.svg" alt="${esc(a.key)} concept illustration" loading="lazy">
   <div class="mega-overview-copy">
    <strong class="mega-active-focus">${esc(currentFocus)}</strong>
    <div class="mega-related-list">${related.map(g=>`<button type="button" class="mega-related-link" data-go-products="${esc(g)}">${esc(lookup(g))} <span>↗</span></button>`).join('')}</div>
    <button type="button" class="mega-overview-primary" data-app-focus-link="${esc(a.key)}" data-focus-label="${esc(currentFocus)}">Explore ${esc(lookup(a.key))} Solutions ↗</button>
    <small>Proposed application categories and product associations · SEP technical review pending</small>
   </div></div></div>`;
 const sc=nav.filter(x=>x.parent==='Support'&&x.level===2);
 $('supportDropdown').innerHTML=sc.map(x=>`<button type="button" data-supportcat="${esc(x.en)}">${esc(lookup(x.en))}</button>`).join('');
 $('aboutDropdown').innerHTML=aboutPages.map(x=>`<a href="#about/${x.slug}" data-about-section="${x.slug}">${esc(lookup(x.label))}</a>`).join('');
 const t={en:['Home','Products','Applications','Support','About SEP','Contact'],zh:['首頁','產品資訊','應用領域','技術支援','關於 SEP','聯絡我們'],zhs:['首页','产品信息','应用领域','技术支持','关于 SEP','联系我们'],ja:['ホーム','製品情報','用途','サポート','SEPについて','お問い合わせ']}[state.lang];
 document.querySelectorAll('.primary-nav .nav-link').forEach((el,i)=>{el.innerHTML=esc(t[i]||el.textContent)+(i>0&&i<5?' <span class="nav-chevron">⌄</span>':'')});
}

function renderHomeGroups(){const root=$('categoryCards');root.innerHTML=groups.map(g=>`<button class="category-card ${state.homeGroup===g?'active':''}" data-homegroup="${esc(g)}">${groupIcon[g]}<span>${esc(lookup(g))}</span></button>`).join('');const subs=leaf(state.homeGroup);$('subCategoryLinks').innerHTML=subs.map(sub=>{const s=sheets.find(s=>s.group===state.homeGroup&&s.subcategory===sub.en);return `<button class="subcat-link" data-sub="${s?.id||''}">${esc(lookup(sub.en))} <small>(${s?.rows.length||0})</small></button>`}).join('');}
function renderHero(){const s=heroSlides[state.hero];$('heroTitle').textContent=s.title;$('heroSub').textContent=s.sub;$('heroBullets').innerHTML=s.list.map(x=>`<li>${esc(x)}</li>`).join('');$('heroButton').dataset.goProducts=s.group;$('heroDots').innerHTML=heroSlides.map((_,i)=>`<button class="${i===state.hero?'active':''}" data-hero-index="${i}" aria-label="Go to slide ${i+1}"></button>`).join('');}
function renderApplications(target){target.innerHTML=apps.map(a=>`<button class="application-card" data-app="${esc(a.key)}"><img alt="Illustrated ${esc(a.title)} application" src="assets/img/app-${a.image}.svg" loading="lazy"><span class="application-label"><span>${a.ico}</span>${esc(lookup(a.key))}</span></button>`).join('')}
function renderSupport(){
 const categories=nav.filter(n=>n.parent==='Support'&&n.level===2);
 const facet=$('supportFacetColumns');
 facet.innerHTML=`<div class="filter-column support-facet"><strong>Document Category</strong><div class="filter-options" role="group" aria-label="Document categories">${categories.map(x=>`<label><input type="checkbox" data-support-group="${esc(x.en)}" ${state.supportGroups.includes(x.en)?'checked':''}><span>${esc(lookup(x.en))}</span></label>`).join('')}</div></div>`;
 $('supportKeyword').value=state.supportKeyword;
 filterSupport();
}
function filterSupport(){
 const list=nav.filter(x=>x.parent==='Support'&&x.level===3)
  .filter(x=>!state.supportGroups.length||state.supportGroups.includes(x.group))
  .filter(x=>!state.supportKeyword||[x.en,x.group,lookup(x.en),lookup(x.group)].join(' ').toLowerCase().includes(state.supportKeyword.toLowerCase()));
 $('supportCount').textContent=list.length;
 $('supportRows').innerHTML=list.length?list.map(x=>`<tr><td>${esc(lookup(x.group))}</td><td>${esc(lookup(x.en))}</td><td class="pending-doc">PDF pending</td><td><button class="doc-pending" disabled aria-label="PDF pending for ${esc(x.en)}">Awaiting file</button></td></tr>`).join(''):'<tr><td colspan="4" class="table-empty">No matching document categories.</td></tr>';
}

function go(route){document.body.classList.add('nav-dismissed');state.route=route||'home';document.querySelectorAll('.page-view').forEach(el=>el.hidden=el.id!==`view-${state.route}`);document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.nav===state.route));$('primaryNav').classList.remove('open');document.querySelectorAll('.mega-menu,.simple-menu').forEach(x=>x.classList.remove('open'));document.querySelectorAll('.nav-expand').forEach(x=>x.setAttribute('aria-expanded','false'));$('mobileMenuToggle').setAttribute('aria-expanded','false');window.scrollTo(0,0);if(state.route==='products')renderCatalog(true);if(state.route==='support')filterSupport();if(state.route==='about')renderAboutPage();}
function openCatalog(group='all',sub='all',q=''){state.group=group;state.sub=sub;state.q=q||'';state.pkg='';state.status='';state.facets={};state.ranges={};state.selectedRows.clear();state.page=1;location.hash='#products';go('products');}
function showApplication(key,focusLabel){const a=apps.find(x=>x.key===key);if(!a)return;state.application=key;location.hash='#applications';go('applications');const el=$('applicationDetail');el.hidden=false;el.innerHTML=`<h3>${esc(a.title)}${focusLabel?' / '+esc(focusLabel):''}</h3><p>${esc(a.desc)}</p><div class="group-pills">${a.suggest.map(x=>`<button data-go-products="${esc(x)}">${esc(x)} ↗</button>`).join('')}</div><div class="source-info">Suggested relationships are for demonstrating navigation only; final application-to-product associations require SEP technical confirmation.</div>`;el.scrollIntoView({block:'nearest',behavior:'smooth'});}
function selectedSheets(){return sheets.filter(s=>(state.group==='all'||s.group===state.group)&&(state.sub==='all'||s.id===state.sub))}
function possibleRecords(){return flatten.filter(r=>(state.group==='all'||r.sheet.group===state.group)&&(state.sub==='all'||r.sheet.id===state.sub))}
function numericalHeaders(){
 const selected=selectedSheets();if(!selected.length)return [];
 // For mixed templates use fields shared by the chosen sheets. For one family expose every applicable field.
 const common=selected[0].headers.filter(h=>selected.every(s=>s.headers.includes(h)))
   .filter(h=>!['Part Number','Replacement','Product Family'].includes(h));
 return common;
}
function renderCatalog(reset=false){
 const list=possibleRecords();const current=selectedSheets();
 $('catalogTitle').textContent=state.sub!=='all'?(current[0]?.subcategory||'Products'):(state.group==='all'?'All Products':state.group);
 $('catalogDescription').textContent='Source: customer-provided Excel · Documents and stock integration pending';
 $('catalogSourceRows').textContent=list.length.toLocaleString();
 $('catalogFamilyCount').textContent=new Set(list.map(r=>String(r.data.Family||r.sheet.subcategory||'')).filter(Boolean)).size.toLocaleString();
 const params=numericalHeaders().filter(h=>!['Status','Product Status','Mounting Type'].includes(h));
 $('catalogParameters').textContent=params.length?params.slice(0,9).map(h=>h.replace(/\s*\([^)]*\)/g,'').replace(/ Max\./g,'').trim()).join(', ')+(params.length>9?'…':''):'Choose a product family';
 $('breadcrumbSub').textContent=(state.group==='all'?'':' / '+state.group)+(state.sub==='all'?'':' / '+(current[0]?.subcategory||''));
 $('groupPills').innerHTML=`<button data-go-products="all" class="${state.group==='all'?'active':''}">All Products</button>`+groups.map(g=>`<button data-go-products="${esc(g)}" class="${state.group===g?'active':''}">${esc(lookup(g))}</button>`).join('');
 $('catalogSearch').value=state.q;
 $('subcategorySelect').innerHTML='<option value="all">All Product Families</option>'+sheets.filter(s=>state.group==='all'||s.group===state.group).map(s=>`<option value="${s.id}">${esc(lookup(s.subcategory))}</option>`).join('');$('subcategorySelect').value=state.sub;
 const headers=numericalHeaders();
 // If a field has only a small number of distinct values, offer checkboxes. Otherwise use Min/Max for numeric fields.
 const facets=headers.map(h=>{
  const raw=list.map(x=>x.data[h]).filter(v=>v!==undefined&&v!==null&&String(v).trim()!==''&&v!=='-');
  const uniques=[...new Set(raw.map(v=>String(v)))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  const numericRatio=raw.length?raw.filter(v=>num(v)!==null).length/raw.length:0;
  const isNumeric=numericRatio>.85 && (uniques.length>15 || /\(V\)|\(A\)|mW|µA|μA|°C|℃|mΩ|kΩ|MHz|nC|PPPM|pF|TRR|VRWM|VRRM|VBR|VDS|RDS|VCE|\bIC\b/i.test(h));
  return {name:h,values:uniques,type:isNumeric?'range':'multi',count:uniques.length};
 });
 $('filterColumnCount').textContent=`${facets.length} parameters`;
 $('dynamicFilters').innerHTML=facets.map(f=>{
  if(f.type==='range'){
   const values=list.map(r=>num(r.data[f.name])).filter(x=>x!==null);
   const min=values.length?Math.min(...values):0,max=values.length?Math.max(...values):0;
   return `<div class="filter-column filter-numeric" data-filter-field="${esc(f.name)}" style="--filter-w:195px"><strong title="${esc(f.name)}">${esc(f.name)}</strong><div class="filter-options range-options"><span class="filter-meta">${esc(String(min))} – ${esc(String(max))}</span><label class="range-label">Min<input inputmode="decimal" type="number" step="any" data-range="${esc(f.name)}" data-bound="min" placeholder="Min" value="${esc(state.ranges[f.name]?.min??'')}"></label><label class="range-label">Max<input inputmode="decimal" type="number" step="any" data-range="${esc(f.name)}" data-bound="max" placeholder="Max" value="${esc(state.ranges[f.name]?.max??'')}"></label><div class="range-available" data-available-list aria-live="polite"></div></div></div>`;
  }
  const selected=state.facets[f.name]||[];const width=(f.count<=3?150:f.name==='Package'||f.name==='Family'?224:190);
  return `<div class="filter-column" data-filter-field="${esc(f.name)}" style="--filter-w:${width}px"><strong title="${esc(f.name)}">${esc(f.name)}</strong>${f.count>7?`<input type="search" class="filter-search" data-filter-search="${esc(f.name)}" placeholder="Find option…" aria-label="Search ${esc(f.name)} options">`:''}<div class="filter-options" role="group" aria-label="${esc(f.name)} options">${f.values.map(v=>`<label class="filter-choice"><input type="checkbox" data-facet="${esc(f.name)}" value="${esc(v)}" ${selected.includes(v)?'checked':''}><span>${esc(v)}</span><small class="facet-availability" aria-hidden="true"></small></label>`).join('')}</div></div>`;
 }).join('')||'<p class="no-facets">Choose a product family to display specific parameters.</p>';
 // Remember filters only for currently visible parameters.
 const valid=new Set(headers);for(const key of Object.keys(state.facets)){if(!valid.has(key))delete state.facets[key]}for(const key of Object.keys(state.ranges)){if(!valid.has(key))delete state.ranges[key]}
 filterRows();
}
function num(value){if(value===null||value===undefined||value===''||value==='-')return null;const n=parseFloat(String(value).replace(/,/g,''));return Number.isFinite(n)?n:null;}
function valuesFromUI(){state.q=$('catalogSearch').value.trim();state.size=Number($('pageSize').value);state.sort=$('sortSelect').value;state.page=1;filterRows();}
let matches=[];
/* V4.3: for each filter calculate availability with all OTHER constraints applied.
   Removing this column's own selection preserves checkbox multi-select. */
function matchesFilters(r,ignore=null){
 if(state.q&&!r.pn.toLowerCase().includes(state.q.toLowerCase()))return false;
 for(const [field,selected] of Object.entries(state.facets)){
  if(field===ignore||!selected?.length)continue;
  if(!selected.includes(String(r.data[field]??'')))return false;
 }
 for(const [field,lim] of Object.entries(state.ranges)){
  if(field===ignore)continue;
  const v=num(r.data[field]);
  if(v===null)return false;
  if(lim.min!==undefined&&v<lim.min)return false;
  if(lim.max!==undefined&&v>lim.max)return false;
 }
 return true;
}
function updateLinkedAvailability(){
 const all=possibleRecords();
 $('dynamicFilters').querySelectorAll('.filter-column[data-filter-field]').forEach(column=>{
  const field=column.dataset.filterField;
  const eligible=all.filter(r=>matchesFilters(r,field));
  const inputs=column.querySelectorAll('input[data-facet]');
  if(inputs.length){
   const counts=new Map();
   for(const r of eligible){
    const v=String(r.data[field]??'');
    counts.set(v,(counts.get(v)||0)+1);
   }
   inputs.forEach(el=>{
    const n=counts.get(el.value)||0;
    const label=el.closest('label');
    el.disabled=n===0&&!el.checked;
    label?.classList.toggle('is-unavailable',n===0&&!el.checked);
    label?.classList.toggle('is-selected',el.checked);
    const count=label?.querySelector('.facet-availability');
    if(count)count.textContent=n.toLocaleString();
    if(label)label.title=n?n+' matching records with other filters':'Unavailable under current filters';
   });
  }else{
   const nums=eligible.map(r=>num(r.data[field])).filter(n=>n!==null);
   const low=nums.length?Math.min(...nums):null;
   const high=nums.length?Math.max(...nums):null;
   const hint=column.querySelector('.filter-meta');
   if(hint)hint.textContent=low===null?'No values available':'Available: '+low+' – '+high+' ('+nums.length+' records)';
   column.querySelectorAll('input[data-range]').forEach(el=>{
    el.dataset.availableMin=low===null?'':String(low);
    el.dataset.availableMax=high===null?'':String(high);
    if(low!==null){el.min=String(low);el.max=String(high);}
    else{el.removeAttribute('min');el.removeAttribute('max');}
    el.disabled=low===null&&!el.value;
   });
  }
 });
}

function filterRows(){
 const q=state.q.toLowerCase();
 matches=possibleRecords().filter(r=>matchesFilters(r));
 matches.sort((a,b)=>state.sort==='partdesc'?b.pn.localeCompare(a.pn,undefined,{numeric:true}):a.pn.localeCompare(b.pn,undefined,{numeric:true}));
 const duplicateCount=new Set(matches.filter(r=>countParts.get(r.pn.toUpperCase())>1).map(r=>r.pn)).size;
 $('resultCount').textContent=new Set(matches.map(r=>r.pn.toUpperCase())).size.toLocaleString();$('resultSourceCount').textContent=`(${matches.length.toLocaleString()} source rows · ${possibleRecords().length.toLocaleString()} total)`;$('dupTag').textContent=duplicateCount?`· ${duplicateCount} repeated part numbers in source`:'';
 const tokens=[];for(const [field,items] of Object.entries(state.facets))for(const value of items)tokens.push({field,value,kind:'facet'});for(const [field,lims] of Object.entries(state.ranges))for(const [bound,value] of Object.entries(lims))tokens.push({field,value,kind:bound});
 $('selectedFilterChips').innerHTML=tokens.map(t=>`<button data-remove-filter="${esc(t.field)}" data-remove-kind="${esc(t.kind)}" data-remove-value="${esc(String(t.value))}" aria-label="Remove filter ${esc(t.field)} ${esc(String(t.value))}">${esc(t.field)}: ${t.kind==='facet'?'':t.kind+' '}${esc(String(t.value))} ×</button>`).join('');
 $('activeFiltersCount').textContent=tokens.length?`${tokens.length} active parameter${tokens.length===1?'':'s'}`:'No active filters';$('compareCount').textContent=state.selectedRows.size?`(${state.selectedRows.size})`:'';
 renderRows();
 updateLinkedAvailability();
}
function columnsForResults(){const one=state.sub!=='all'&&byId.has(state.sub);if(one){const sheet=byId.get(state.sub);return ['Part Number','Package',...sheet.headers.filter(x=>x!=='Part Number'&&x!=='Package'&&x!=='Status'&&x!=='Product Status').slice(0,5),'Status'];}return ['Part Number','Product Family','Package','Electrical Specs','Status'];}
function specShort(r){return Object.entries(r.data).filter(([k,v])=>k!=='Part Number'&&k!=='Package'&&k!=='Status'&&k!=='Replacement'&&k!=='Product Status'&&/\(V\)|\(A\)|\(mW\)|\(W\)|（W）|\(mA\)/.test(k)&&v!==null&&v!=='-').slice(0,2).map(([k,v])=>k.replace(/\s+/g,' ')+' '+v).join(' / ') || '—';}
function renderRows(){const cols=columnsForResults();$('resultsHead').innerHTML='<tr>'+cols.map(x=>`<th>${esc(x)}</th>`).join('')+'</tr>';const max=Math.max(1,Math.ceil(matches.length/state.size));state.page=Math.min(max,Math.max(1,state.page));const rows=matches.slice((state.page-1)*state.size,state.page*state.size);$('resultsBody').innerHTML=rows.length?rows.map(r=>`<tr>${cols.map(c=>{let v=c==='Product Family'?r.sheet.subcategory:c==='Electrical Specs'?specShort(r):c==='Status'?r.status:r.data[c];if(c==='Part Number')return `<td><a class="part-detail-link" href="product.html?sheet=${encodeURIComponent(r.sheet.id)}&row=${r.index}&part=${encodeURIComponent(r.pn)}">${esc(r.pn)} <span aria-hidden="true">↗</span></a></td>`;return `<td class="${c==='Status'&&v==='Active'?'status-active':c==='Status'&&v==='NRND'?'status-nrnd':''}">${esc(v??'—')}</td>`}).join('')}</tr>`).join(''):`<tr><td colspan="${cols.length}" class="table-empty">No matching products. Try removing a filter or searching another part number.</td></tr>`;$('pageInfo').textContent=matches.length?`Showing ${(state.page-1)*state.size+1}–${Math.min(matches.length,state.page*state.size)} of ${matches.length.toLocaleString()}`:'No results';$('pageNumber').textContent=`${state.page} / ${max}`;$('pagePrev').disabled=state.page<=1;$('pageNext').disabled=state.page>=max;}
function openDetail(id){const [key,index]=id.split(':');const s=byId.get(key);if(!s)return;const i=Number(index),row=s.rows[i];if(!row)return;const r=flatten.find(x=>x.sheet.id===key&&x.index===i);state.modalRecord=r;$('modalTitle').textContent=r.pn;$('modalDesc').textContent=`${s.group} / ${s.subcategory}`;$('modalSpec').innerHTML='<div class="detail-grid">'+s.headers.map((h,j)=>`<div class="detail-row"><span>${esc(h)}</span><strong>${esc(row[j]??'—')}</strong></div>`).join('')+'</div>'+((countParts.get(r.pn.toUpperCase())||0)>1?'<p class="source-info">Note: This part number appears in more than one row of the provided product spreadsheets. Please validate before production import.</p>':'');$('partModal').hidden=false;document.body.style.overflow='hidden';$('modalClose').focus();}
function closeDetail(){$('partModal').hidden=true;document.body.style.overflow='';state.modalRecord=null;}
function csvValue(v){let str=String(v??'');if(/^[=+@\t\r]/.test(str)||(/^-[^0-9.]/.test(str)))str="'"+str;return '"'+str.replace(/"/g,'""')+'"';}
function downloadCSV(records,filename,full=false){const headers=full&&records[0]?records[0].sheet.headers:['Part Number','Category','Family','Package','Specifications','Status','Source'];const csv=[headers.map(csvValue).join(',')];for(const r of records){const data=full?headers.map(h=>r.data[h]??''):[r.pn,r.group,r.sheet.subcategory,r.pkg,specShort(r),r.status,r.sheet.source];csv.push(data.map(csvValue).join(','));}const blob=new Blob(['\ufeff',csv.join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function toProductsFromSub(sub){const s=byId.get(sub);if(s)openCatalog(s.group,s.id);}
function switchLang(lang){state.lang=localeKey[lang]?lang:'en';renderNavigation();renderHomeGroups();renderCatalog();}
function setNavFromHash(){const parts=(location.hash||'#home').slice(1).split('/');const hash=parts[0];if(hash==='about')state.aboutSection=aboutSlug(parts[1]||'company-profile');go(['home','products','applications','support','about','contact'].includes(hash)?hash:'home');}
function init(){renderNavigation();renderHomeGroups();renderHero();renderApplications($('homeApplicationGrid'));renderApplications($('applicationsPageGrid'));renderSupport();setNavFromHash();document.body.classList.remove('nav-dismissed');}
document.addEventListener('click',event=>{
 const e=event.target.closest('button,a,[data-nav],[data-go-products]');if(!e)return;
 if(e.matches('[data-mega-cat]')){event.preventDefault();state.megaProductGroup=e.dataset.megaCat;renderNavigation();return;}
 if(e.matches('[data-mega-app]')){event.preventDefault();state.megaApplication=Number(e.dataset.megaApp);state.megaApplicationFocus=0;renderNavigation();return;}
 if(e.matches('[data-mega-focus]')){event.preventDefault();state.megaApplicationFocus=Number(e.dataset.megaFocus);renderNavigation();return;}
 if(e.matches('[data-app-focus-link]')){event.preventDefault();showApplication(e.dataset.appFocusLink,e.dataset.focusLabel);return;}
 if(e.matches('[data-datasheets-pending]')){event.preventDefault();toast('Official Datasheets have not yet been provided for '+e.dataset.datasheetsPending+'.');return;}
 if(e.matches('[data-supportcat]')){event.preventDefault();state.supportGroups=[e.dataset.supportcat];state.supportKeyword='';location.hash='#support';go('support');renderSupport();return;}
 if(e.matches('[data-about-section]')){event.preventDefault();state.aboutSection=aboutSlug(e.dataset.aboutSection);location.hash='#about/'+state.aboutSection;go('about');return;}
 if(e.matches('[data-expand]')){event.preventDefault();document.body.classList.remove('nav-dismissed');const target=$(e.dataset.expand),was=target.classList.contains('open');document.querySelectorAll('.mega-menu,.simple-menu').forEach(x=>x.classList.remove('open'));document.querySelectorAll('.nav-expand').forEach(x=>x.setAttribute('aria-expanded','false'));if(!was){target.classList.add('open');e.setAttribute('aria-expanded','true');}return;}
 if(e.matches('[data-homegroup]')){state.homeGroup=e.dataset.homegroup;renderHomeGroups();return;}
 if(e.matches('[data-hero-index]')){state.hero=Number(e.dataset.heroIndex);renderHero();return;}
 if(e.matches('[data-go-products]')){event.preventDefault();openCatalog(e.dataset.goProducts);return;}
 if(e.matches('[data-sub]')){event.preventDefault();toProductsFromSub(e.dataset.sub);return;}
 if(e.matches('[data-app]')){event.preventDefault();showApplication(e.dataset.app);return;}
 if(e.matches('[data-nav]')){event.preventDefault();const route=e.dataset.nav;location.hash='#'+route;go(route);return;}
 if(e.matches('[data-detail]')){event.preventDefault();const [sid,idx]=e.dataset.detail.split(':');location.href='product.html?sheet='+encodeURIComponent(sid)+'&row='+encodeURIComponent(idx);return;}
 if(e.matches('[data-close-modal]')){closeDetail();return;}
 if(e.matches('[data-toast]')){toast(e.dataset.toast);return;}
});
document.addEventListener('mouseover',e=>{const a=e.target.closest('[data-mega-cat]');if(a&&state.megaProductGroup!==a.dataset.megaCat){state.megaProductGroup=a.dataset.megaCat;renderNavigation();}const b=e.target.closest('[data-mega-app]');if(b&&state.megaApplication!==Number(b.dataset.megaApp)){state.megaApplication=Number(b.dataset.megaApp);state.megaApplicationFocus=0;renderNavigation();}const f=e.target.closest('[data-mega-focus]');if(f&&state.megaApplicationFocus!==Number(f.dataset.megaFocus)){state.megaApplicationFocus=Number(f.dataset.megaFocus);renderNavigation();}});
 document.addEventListener('focusin',e=>{const a=e.target.closest('[data-mega-cat]');if(a&&state.megaProductGroup!==a.dataset.megaCat){state.megaProductGroup=a.dataset.megaCat;renderNavigation();}const b=e.target.closest('[data-mega-app]');if(b&&state.megaApplication!==Number(b.dataset.megaApp)){state.megaApplication=Number(b.dataset.megaApp);state.megaApplicationFocus=0;renderNavigation();}const f=e.target.closest('[data-mega-focus]');if(f&&state.megaApplicationFocus!==Number(f.dataset.megaFocus)){state.megaApplicationFocus=Number(f.dataset.megaFocus);renderNavigation();}});
function dismissAllMenus(){
 document.body.classList.add('nav-dismissed');
 document.querySelectorAll('.mega-menu,.simple-menu').forEach(el=>el.classList.remove('open'));
 document.querySelectorAll('.nav-expand').forEach(el=>el.setAttribute('aria-expanded','false'));
}
document.querySelector('.main-header').addEventListener('pointerleave',()=>document.body.classList.remove('nav-dismissed'));
document.addEventListener('click',e=>{if(!e.target.closest('#primaryNav'))dismissAllMenus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){dismissAllMenus();if(document.activeElement?.closest('#primaryNav'))document.activeElement.blur();}});
$('mobileMenuToggle').addEventListener('click',()=>{let menu=$('primaryNav');let open=menu.classList.toggle('open');$('mobileMenuToggle').setAttribute('aria-expanded',String(open));});
$('headerSearch').addEventListener('click',()=>{openCatalog();$('catalogSearch').focus();});
$('heroPrevious').addEventListener('click',()=>{state.hero=(state.hero+heroSlides.length-1)%heroSlides.length;renderHero();});
$('heroNext').addEventListener('click',()=>{state.hero=(state.hero+1)%heroSlides.length;renderHero();});
$('homeSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){openCatalog('all','all',e.currentTarget.value);}});
$('crossRefButton').addEventListener('click',()=>toast('Cross Reference 是預留功能，目前產品 Excel 未包含競品替代料對照表。'));
$('langSwitch').addEventListener('change',e=>{state.lang=e.target.value;renderNavigation();renderHomeGroups();renderCatalog();renderSupport();if(state.route==='about')renderAboutPage();toast('Menu translations loaded from client hierarchy workbook. Main demo copy remains English.');});
$('subcategorySelect').addEventListener('change',e=>{state.sub=e.target.value;state.facets={};state.ranges={};state.page=1;renderCatalog();});
let filterDebounce=null;
$('catalogSearch').addEventListener('input',()=>{clearTimeout(filterDebounce);filterDebounce=setTimeout(valuesFromUI,120);});
$('catalogSearch').addEventListener('keydown',e=>{if(e.key==='Enter')valuesFromUI();});
$('resetFilters').addEventListener('click',()=>{state.q='';state.facets={};state.ranges={};state.page=1;renderCatalog();});
$('pageSize').addEventListener('change',valuesFromUI);$('sortSelect').addEventListener('change',valuesFromUI);
$('dynamicFilters').addEventListener('change',e=>{
 const el=e.target;if(el.matches('[data-facet]')){const field=el.dataset.facet;const a=state.facets[field]||[];state.facets[field]=el.checked?[...new Set([...a,el.value])]:a.filter(v=>v!==el.value);state.page=1;filterRows();}
 if(el.matches('[data-range]'))updateRange(el,true);
});
function updateRange(el,commit=false){
 const field=el.dataset.range,bound=el.dataset.bound,raw=el.value.trim();
 const low=el.dataset.availableMin===''?null:Number(el.dataset.availableMin);
 const high=el.dataset.availableMax===''?null:Number(el.dataset.availableMax);
 const val=raw===''?null:Number(raw);
 const opposite=state.ranges[field]?.[bound==='min'?'max':'min'];
 const invalid=raw!==''&&(!Number.isFinite(val)||(low!==null&&val<low)||(high!==null&&val>high)||(opposite!==undefined&&(bound==='min'?val>opposite:val<opposite)));
 if(invalid){
  el.classList.add('range-invalid');
  el.title='Valid available range: '+(low??'–')+' to '+(high??'–')+'; Min cannot exceed Max';
  if(commit){el.value=state.ranges[field]?.[bound]??'';el.classList.remove('range-invalid');el.title='';}
  return;
 }
 el.classList.remove('range-invalid');el.title='';
 state.ranges[field] ||= {};
 if(val!==null)state.ranges[field][bound]=val;
 else delete state.ranges[field][bound];
 if(!Object.keys(state.ranges[field]).length)delete state.ranges[field];
 state.page=1;
 filterRows();
}
$('dynamicFilters').addEventListener('input',e=>{const el=e.target;if(el.matches('[data-filter-search]')){const term=el.value.toLowerCase().trim();const parent=el.closest('.filter-column');parent.querySelectorAll('.filter-choice').forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(term)});}if(el.matches('[data-range]')){clearTimeout(filterDebounce);filterDebounce=setTimeout(()=>updateRange(el),180);}});
$('selectedFilterChips').addEventListener('click',e=>{const el=e.target.closest('[data-remove-filter]');if(!el)return;const field=el.dataset.removeFilter;if(el.dataset.removeKind==='facet'){state.facets[field]=(state.facets[field]||[]).filter(x=>x!==el.dataset.removeValue);const input=[...$('dynamicFilters').querySelectorAll('input[data-facet]')].find(x=>x.dataset.facet===field&&x.value===el.dataset.removeValue);if(input)input.checked=false;}else{delete state.ranges[field]?.[el.dataset.removeKind];const input=[...$('dynamicFilters').querySelectorAll('input[data-range]')].find(x=>x.dataset.range===field&&x.dataset.bound===el.dataset.removeKind);if(input)input.value='';}state.page=1;filterRows();});
$('dynamicFilters').addEventListener('focusout',e=>{if(e.target.matches('input[data-range]')&&e.target.classList.contains('range-invalid'))updateRange(e.target,true);});
document.querySelectorAll('[data-scroll-filters]').forEach(btn=>btn.addEventListener('click',()=>$('filterScroll').scrollBy({left:Number(btn.dataset.scrollFilters)*330,behavior:'smooth'})));
$('filterToggle').addEventListener('click',()=>{const collapsed=$('parametricPanel').classList.toggle('collapsed');$('filterToggle').setAttribute('aria-expanded',String(!collapsed));$('filterToggleIcon').textContent=collapsed?'+':'−';});
$('supportKeyword').addEventListener('input',e=>{state.supportKeyword=e.target.value;filterSupport();});
$('supportFacetColumns').addEventListener('change',e=>{const el=e.target;if(!el.matches('[data-support-group]'))return;state.supportGroups=el.checked?[...new Set([...state.supportGroups,el.dataset.supportGroup])]:state.supportGroups.filter(x=>x!==el.dataset.supportGroup);filterSupport();});
$('supportClear').addEventListener('click',()=>{state.supportGroups=[];state.supportKeyword='';renderSupport();});
$('supportToggle').addEventListener('click',()=>{const collapsed=$('supportFilterBody').classList.toggle('collapsed');$('supportToggle').setAttribute('aria-expanded',String(!collapsed));$('supportToggleIcon').textContent=collapsed?'+':'−';});
$('pagePrev').addEventListener('click',()=>{state.page--;renderRows();});$('pageNext').addEventListener('click',()=>{state.page++;renderRows();});
$('exportResults').addEventListener('click',()=>{if(!matches.length){toast('No results to export.');return;}downloadCSV(matches,`SEP_products_${state.sub==='all'?'all':state.sub}_${new Date().toISOString().slice(0,10)}.csv`);});
$('modalClose').addEventListener('click',closeDetail);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('partModal').hidden)closeDetail()});
$('modalDownload').addEventListener('click',()=>{if(!state.modalRecord)return;downloadCSV([state.modalRecord],`SEP_${state.modalRecord.pn.replace(/[^a-zA-Z0-9_-]/g,'_')}_spec.csv`,true);});
$('contactForm').addEventListener('submit',e=>{e.preventDefault();toast('Demo only — no information was sent. The live contact form will be connected after approval.');});
window.addEventListener('hashchange',setNavFromHash);
init();
})();
