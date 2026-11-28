(()=>{
'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const langs={en:'en',zh:'zh-tw',zhs:'zh-cn',ja:'ja'};
const states={'en':'en','zh-tw':'zh','zh-cn':'zhs','ja':'ja'};
const query=new URLSearchParams(location.search);
const context=window.SEP_PRODUCT_CONTEXT||{};
let lang=states[String(context.lang||query.get('lang')||'en').toLowerCase()]||'en';
window.SEP_CURRENT_LANG=langs[lang];
const nav=window.SEP_NAV||[],sheets=window.SEP_SHEETS||[];
const groups=nav.filter(x=>x.parent==='Products'&&x.level===2);
const apps=nav.filter(x=>x.parent==='Applications'&&x.level===2);
const support=nav.filter(x=>x.parent==='Support'&&x.level===2);
const about=[['Company Profile','company-profile'],['Business Philosophy','business-philosophy'],['Capability','capability'],['Careers','careers'],['News','news'],['Privacy Policy','privacy-policy']];
const icons=[
 `<svg viewBox="0 0 48 48"><path d="M24 5 42 24 24 43 6 24Z"/><circle cx="24" cy="5" r="3"/><circle cx="42" cy="24" r="3"/><circle cx="24" cy="43" r="3"/><circle cx="6" cy="24" r="3"/><path d="M24 10V38M10 24H38"/></svg>`,
 `<svg viewBox="0 0 48 48"><path d="M6 24H20M30 24H42M19 11V37L33 24Z"/><path d="M34 11V37M26 7V2M26 46V41"/></svg>`,
 `<svg viewBox="0 0 48 48"><path d="M5 24H16M32 24H43M16 11V37L32 24Z"/><path d="M33 11V37M5 8l4 4M39 39l4 4"/></svg>`,
 `<svg viewBox="0 0 48 48"><path d="M24 3 40 10v15c0 10-7 16-16 20C15 41 8 35 8 25V10Z"/><path d="m16 24 6 7 12-15"/></svg>`,
 `<svg viewBox="0 0 48 48"><path d="M5 9V39M17 3V45M32 3V45M43 9V39M5 20H17M32 20H43"/><path d="M17 12h15M17 34h15"/></svg>`,
 `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"/><path d="M20 11v25M14 24h17m-7-7 7 7-7 7"/></svg>`
];

const images=['bridge','diode','schottky','protection','mosfet','transistor'];
const focus={
 'Automotive':['Vehicle Power Management','Automotive Lighting','On-board Charging','Infotainment & Displays','Battery Management'],
 'Computer & Peripherals':['PC Power Conversion','Server Hardware','Display & Monitor','Storage & Peripherals','Notebook Adapters'],
 'Consumer':['Home Appliances','Smart Home Devices','Portable Electronics','LED Lighting','Audio & Video'],
 'Industrial':['Factory Automation','Motor Control','Industrial Power Supply','Instrumentation','UPS / Backup Power'],
 'Power Supply':['AC-DC Power Supply','DC-DC Conversion','Adapter & Charger','Industrial Power Supply','Server Power','UPS / Backup Power'],
 'Telecommunication':['Telecom Power Supply','Network Equipment','Base Station Systems','Communication Protection','Routers & Gateways']
};
const related={
'Automotive':['MOSFETs','Diode Rectifiers','Protection Devices'],
'Computer & Peripherals':['Schottky Rectifiers','Protection Devices','MOSFETs'],
'Consumer':['Diode Rectifiers','MOSFETs'],
'Industrial':['Bridge Rectifiers','Diode Rectifiers','MOSFETs'],
'Power Supply':['Bridge Rectifiers','Diode Rectifiers','Schottky Rectifiers','Protection Devices','MOSFETs'],
'Telecommunication':['Protection Devices','MOSFETs','Schottky Rectifiers']};
const appIcons={Automotive:"🚘","Computer & Peripherals":"▣",Consumer:"⌂",Industrial:"⚙","Power Supply":"ϟ",Telecommunication:"◉"};
const appImg={Automotive:'automotive','Computer & Peripherals':'computer',Consumer:'consumer',Industrial:'industrial','Power Supply':'power',Telecommunication:'communications'};
const labels={en:['Home','Products','Applications','Support','About SEP','Contact'],zh:['首頁','產品資訊','應用領域','技術支援','關於 SEP','聯絡我們'],zhs:['首页','产品信息','应用领域','技术支持','关于 SEP','联系我们'],ja:['ホーム','製品情報','用途','サポート','SEPについて','お問い合わせ']};
const loc=n=>n?.[lang]||n?.en||'',lookup=x=>loc(nav.find(n=>n.en===x))||x;
const home=path=>(window.SEP_FIXED_PRODUCT_BASE||'index.html')+'?lang='+encodeURIComponent(langs[lang])+'#'+path;
const leaf=g=>nav.filter(x=>x.parent==='Products'&&x.level===3&&x.group===g);
let selected=0,appSelected=0;
function render(){
 const group=groups[selected]?.en||groups[0]?.en;
 $('megaMenu').innerHTML=
 '<div class="mega-pane mega-major"><h2 class="mega-section-title">Product Family</h2><div class="mega-choice-list" role="tablist">'+groups.map((n,i)=>
 '<button type="button" role="tab" aria-selected="'+(i===selected)+'" data-detail-group="'+i+'" class="mega-rail-item '+(i===selected?'selected':'')+'"><span class="mega-app-icon">'+(icons[i]||'◇')+'</span><span class="mega-choice-label">'+esc(loc(n))+'</span><span class="mega-arrow">›</span></button>').join('')+'</div></div>'+
 '<div class="mega-pane mega-minor"><h2 class="mega-section-title">Category</h2><div class="mega-choice-list mega-family-list">'+leaf(group).map(n=>{
 const sheet=sheets.find(x=>x.group===group&&x.subcategory===n.en);
 return '<a class="mega-family" href="'+esc(home('products/'+encodeURIComponent(sheet?.id||'')))+'">'+esc(loc(n))+' <span>↗</span></a>';
 }).join('')+'</div></div>'+
 '<div class="mega-pane mega-overview"><h2 class="mega-section-title">Overview</h2><div class="mega-overview-layout"><img class="mega-overview-image" src="assets/img/product-'+images[selected%images.length]+'.svg" alt="'+esc(group)+' illustration"><div class="mega-overview-copy"><p>'+esc(lookup(group))+'</p><a class="mega-overview-link" href="'+esc(home('products'))+'">View Products ↗</a><small>Concept imagery · official documents pending</small></div></div></div>';
 const app=apps[appSelected]?.en||'Power Supply';
 $('appMegaMenu').innerHTML=
 '<div class="mega-pane mega-major"><h2 class="mega-section-title">Application</h2><div class="mega-choice-list" role="tablist">'+apps.map((n,i)=>
 '<button type="button" role="tab" aria-selected="'+(i===appSelected)+'" data-detail-app="'+i+'" class="mega-rail-item '+(i===appSelected?'selected':'')+'"><span class="mega-app-icon">'+esc(appIcons[n.en]||'◇')+'</span><span class="mega-choice-label">'+esc(loc(n))+'</span><span class="mega-arrow">›</span></button>').join('')+'</div></div>'+
 '<div class="mega-pane mega-minor"><h2 class="mega-section-title">Application Focus</h2><div class="mega-choice-list mega-family-list">'+(focus[app]||[]).map(x=>'<a class="mega-family" href="'+esc(home('applications'))+'">'+esc(x)+' <span>↗</span></a>').join('')+'</div></div>'+
 '<div class="mega-pane mega-overview"><h2 class="mega-section-title">Related Product Families</h2><div class="mega-overview-layout"><img class="mega-overview-image" src="assets/img/app-'+(appImg[app]||'power')+'.svg" alt="'+esc(app)+' illustration"><div class="mega-overview-copy"><div class="mega-related-list">'+(related[app]||[]).map(x=>'<a class="mega-related-link" href="'+esc(home('products'))+'">'+esc(lookup(x))+' ↗</a>').join('')+'</div><a class="mega-overview-primary" href="'+esc(home('applications'))+'">Explore Solutions ↗</a></div></div></div>';
 $('supportDropdown').innerHTML=support.map(x=>'<a href="'+esc(home('support'))+'">'+esc(loc(x))+'</a>').join('');
 $('aboutDropdown').innerHTML=about.map(([name,slug])=>'<a href="'+esc(home('about/'+slug))+'">'+esc(lookup(name))+'</a>').join('');
 const names=labels[lang]||labels.en;
 const links=[...document.querySelectorAll('.primary-nav > .nav-link,.primary-nav > .nav-product .nav-link,.primary-nav > .nav-simple-wrap .nav-link')];
 links.forEach((el,i)=>{el.innerHTML=esc(names[i]||'')+(i>0&&i<5?' <span class="nav-chevron">⌄</span>':'');});
 document.querySelectorAll('a[data-nav]').forEach(el=>{el.href=home(el.dataset.nav);});
 links.forEach(el=>el.classList.toggle('active',el.dataset.nav==='products'));
 $('langSwitch').value=lang;
}
function dismiss(){
 document.body.classList.add('nav-dismissed');
 document.querySelectorAll('.mega-menu,.simple-menu').forEach(el=>el.classList.remove('open'));
 document.querySelectorAll('.nav-expand').forEach(el=>el.setAttribute('aria-expanded','false'));
}
$('langSwitch').addEventListener('change',event=>{
 const code=langs[event.target.value]||'en';
 const part=context.part||query.get('part')||'';
 if(window.SEP_FIXED_PRODUCT_BASE)location.href=window.SEP_FIXED_PRODUCT_BASE+code+'/products/'+encodeURIComponent(part)+'/';
 else if(part.toUpperCase()==='BAT42W'&&(code==='en'||code==='zh-tw'))location.href=new URL(code+'/products/BAT42W/',document.baseURI).href;
 else location.href=new URL('product.html?lang='+encodeURIComponent(code)+'&part='+encodeURIComponent(part),document.baseURI).href;
});
$('mobileMenuToggle').addEventListener('click',()=>{
 const open=$('primaryNav').classList.toggle('open');$('mobileMenuToggle').setAttribute('aria-expanded',String(open));
});
$('headerSearch').addEventListener('click',()=>{location.href=home('products');});
document.addEventListener('click',event=>{
 const btn=event.target.closest('[data-expand],[data-detail-group],[data-detail-app]');
 if(!btn){if(!event.target.closest('#primaryNav'))dismiss();return;}
 if(btn.hasAttribute('data-detail-group')){selected=Number(btn.dataset.detailGroup);render();}
 else if(btn.hasAttribute('data-detail-app')){appSelected=Number(btn.dataset.detailApp);render();}
 else{
  document.body.classList.remove('nav-dismissed');
  const panel=$(btn.dataset.expand),open=!panel.classList.contains('open');
  document.querySelectorAll('.mega-menu,.simple-menu').forEach(el=>el.classList.remove('open'));
  document.querySelectorAll('.nav-expand').forEach(el=>el.setAttribute('aria-expanded','false'));
  if(open){panel.classList.add('open');btn.setAttribute('aria-expanded','true');}
 }
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){dismiss();document.activeElement?.blur?.();}});
document.querySelector('.main-header')?.addEventListener('pointerleave',()=>document.body.classList.remove('nav-dismissed'));
render();
})();