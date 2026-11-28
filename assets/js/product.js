(()=>{
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=new URLSearchParams(location.search),context=window.SEP_PRODUCT_CONTEXT||{},allSheets=window.SEP_SHEETS||[];
const localeMap={'en':'en','zh-tw':'zh','zh-cn':'zhs','ja':'ja'};
const localeCode=String(context.lang||p.get('lang')||window.SEP_CURRENT_LANG||'en').toLowerCase();
const lang=localeMap[localeCode]||'en';
const langCode={en:'en',zh:'zh-tw',zhs:'zh-cn',ja:'ja'}[lang];
const nav=window.SEP_NAV||[];
const translate=key=>nav.find(x=>x.en===key)?.[lang]||key;
const translations={
 en:{home:'Home',products:'Products',overview:'Product Overview',documents:'Technical Documents',specs:'Electrical & Product Specifications',related:'Related Part Numbers',help:'Need more information?'},
 zh:{home:'首頁',products:'產品資訊',overview:'產品概覽',documents:'技術文件',specs:'產品與電氣規格',related:'相關產品型號',help:'需要更多資訊？'},
 zhs:{home:'首页',products:'产品信息',overview:'产品概览',documents:'技术文档',specs:'产品及电气规格',related:'相关产品型号',help:'需要更多信息？'},
 ja:{home:'ホーム',products:'製品情報',overview:'製品概要',documents:'技術文書',specs:'製品・電気仕様',related:'関連品番',help:'詳細について'}
};
document.documentElement.lang=langCode;
document.querySelectorAll('[data-pi18n]').forEach(el=>el.textContent=translations[lang][el.dataset.pi18n]||translations.en[el.dataset.pi18n]||el.textContent);
$('detailHomeLink').textContent=translations[lang].home;
$('detailProductsLink').textContent=translations[lang].products;
$('detailHomeLink').href='index.html?lang='+langCode+'#home';
$('detailProductsLink').href='index.html?lang='+langCode+'#products';
const expected=String(context.part||p.get('part')||'').trim();
const hint=p.get('sheet'),rawRow=p.get('row'),idx=rawRow===null?null:Number(rawRow);
function error(message){$('detailError').hidden=false;$('detailError').textContent=message;$('detailPage').hidden=true;}
let sheet=null,index=-1;
const candidates=[...allSheets].sort((a,b)=>Number(b.id===hint)-Number(a.id===hint));
if(expected){
 for(const sh of candidates){
  const pi=sh.headers.indexOf('Part Number');if(pi<0)continue;
  const found=sh.rows.findIndex(row=>String(row[pi]||'').toUpperCase()===expected.toUpperCase());
  if(found>=0){sheet=sh;index=found;break;}
 }
}else if(hint&&Number.isSafeInteger(idx)&&idx>=0){
 sheet=allSheets.find(x=>x.id===hint)||null;
 if(sheet&&idx<sheet.rows.length)index=idx;
}
if(!sheet||index<0){
 error('This product number is not in the supplied Excel catalog. Please check the number or contact SEP.');return;
}
const partIndex=sheet.headers.indexOf('Part Number');
const row=sheet.rows[index], data={};
sheet.headers.forEach((field,i)=>data[field]=row[i]);
const part=String(data['Part Number']||'').trim();
if(!part){error('Missing part number in source data.');return;}
document.title=part+' | SEP Electronics · '+(translations[lang].overview||'Product Details');
$('detailPage').hidden=false;
$('detailGroup').textContent=translate(sheet.group);
$('detailFamily').textContent=translate(sheet.subcategory);
$('detailPart').textContent=part;
$('detailSummary').textContent=translate(sheet.subcategory)+' · '+translate(sheet.group);
const visuals={'Bridge Rectifiers':'bridge','Diode Rectifiers':'diode','Schottky Rectifiers':'schottky','Protection Devices':'protection','MOSFETs':'mosfet','Transistors':'transistor'};
$('detailImage').src='assets/img/product-'+(visuals[sheet.group]||'diode')+'.svg';
const primary=['Package','Status','Product Status','VRRM (V)','IO (A)','VF (V)','IR (µA)'];
const populated=[...new Set([...primary,...sheet.headers.filter(x=>x!=='Part Number')])].filter(k=>String(data[k]??'').trim()&&String(data[k])!=='-').slice(0,6);
$('detailQuickSpecs').innerHTML=populated.map(k=>'<div class="quick-spec"><span>'+esc(k)+'</span><strong>'+esc(data[k])+'</strong></div>').join('');
$('detailSpecRows').innerHTML=sheet.headers.map(k=>'<tr><th scope="row">'+esc(k)+'</th><td>'+esc(data[k]??'—')+'</td></tr>').join('');
const duplicates=sheet.rows.filter(r=>String(r[partIndex]||'').toUpperCase()===part.toUpperCase()).length;
if(duplicates>1){$('duplicateNote').hidden=false;$('duplicateNote').textContent='Source Excel includes '+duplicates+' rows with this part number in the selected family. Verify records before production import.';}
$('inquireBtn').href='mailto:sales@sep-semi.com?subject='+encodeURIComponent('SEP Product Inquiry: '+part);
$('backResults').href=(window.SEP_FIXED_PRODUCT_BASE||'index.html')+'?lang='+langCode+'#products/'+encodeURIComponent(sheet.id);
const pkgIndex=sheet.headers.indexOf('Package'),pkg=pkgIndex>=0?String(row[pkgIndex]||''):'';
const related=sheet.rows.map((r,i)=>({row:r,index:i})).filter(x=>x.index!==index&&String(x.row[partIndex]||'').toUpperCase()!==part.toUpperCase());
related.sort((a,b)=>Number(pkgIndex>=0&&String(b.row[pkgIndex]||'')===pkg)-Number(pkgIndex>=0&&String(a.row[pkgIndex]||'')===pkg));
$('relatedParts').innerHTML=related.slice(0,8).map(x=>{
 const label=String(x.row[partIndex]||''),url=window.SEP_FIXED_PRODUCT_BASE?window.SEP_FIXED_PRODUCT_BASE+langCode+'/products/'+encodeURIComponent(label)+'/':label.toUpperCase()==='BAT42W'&&(langCode==='en'||langCode==='zh-tw')?langCode+'/products/BAT42W/':'product.html?part='+encodeURIComponent(label)+'&lang='+encodeURIComponent(langCode);
 return '<a class="related-part" href="'+esc(url)+'"><strong>'+esc(label)+'</strong><span>'+esc(sheet.subcategory)+'</span><small>'+esc(pkgIndex>=0?x.row[pkgIndex]||'—':'See specifications')+' ↗</small></a>';
}).join('');
$('backResults').addEventListener('click',e=>{
 if(document.referrer.startsWith(location.origin)&&(/\/sep-product-demos\/(?:index\.html)?$/.test(new URL(document.referrer).pathname))){
  e.preventDefault();history.back();
 }
});
function csvCell(v){let s=String(v??'');if(/^[=+@\t\r]/.test(s)||/^-[^0-9.]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
$('detailCSV').addEventListener('click',()=>{
 const csv=[sheet.headers,row].map(items=>items.map(csvCell).join(',')).join('\r\n');
 const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
 const uri=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=uri;a.download='SEP_'+part.replace(/[^a-zA-Z0-9_-]/g,'_')+'_spec.csv';
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(uri),1000);
});
})();