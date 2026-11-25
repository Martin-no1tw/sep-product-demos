(()=>{
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=new URLSearchParams(location.search);
const sheet=(window.SEP_SHEETS||[]).find(s=>s.id===p.get('sheet'));
const rowParam=p.get('row'), rowIndex=Number(rowParam), expected=p.get('part');
function error(message){$('detailError').hidden=false;$('detailError').textContent=message;$('detailPage').hidden=true;}
if(!sheet||rowParam===null||!Number.isSafeInteger(rowIndex)||rowIndex<0||rowIndex>=sheet.rows.length){
 error('Part not found. Please open the Product Center and select a part number.');return;
}
const partIndex=sheet.headers.indexOf('Part Number');
if(partIndex<0){error('Part Number field is not available in this source template.');return;}
let index=rowIndex;
if(expected&&String(sheet.rows[index][partIndex]||'').toUpperCase()!==expected.toUpperCase()){
 const found=sheet.rows.findIndex(row=>String(row[partIndex]||'').toUpperCase()===expected.toUpperCase());
 if(found<0){error('This part number does not match the source data.');return;}
 index=found;
}
const row=sheet.rows[index], data={};
sheet.headers.forEach((field,i)=>data[field]=row[i]);
const part=String(data['Part Number']||'').trim();
if(!part){error('Missing part number in source data.');return;}
document.title=part+' | SEP Electronics Product Details';
$('detailPage').hidden=false;
$('detailGroup').textContent=sheet.group;
$('detailFamily').textContent=sheet.subcategory;
$('detailPart').textContent=part;
$('detailSummary').textContent=sheet.subcategory+' · '+sheet.group;
const visuals={'Bridge Rectifiers':'bridge','Diode Rectifiers':'diode','Schottky Rectifiers':'schottky','Protection Devices':'protection','MOSFETs':'mosfet','Transistors':'transistor'};
$('detailImage').src='assets/img/product-'+(visuals[sheet.group]||'diode')+'.svg';
const primary=['Package','Status','Product Status','VRRM (V)','IO (A)','VF (V)','IR (µA)'];
const populated=[...new Set([...primary,...sheet.headers.filter(x=>x!=='Part Number')])].filter(k=>String(data[k]??'').trim()&&String(data[k])!=='-').slice(0,6);
$('detailQuickSpecs').innerHTML=populated.map(k=>'<div class="quick-spec"><span>'+esc(k)+'</span><strong>'+esc(data[k])+'</strong></div>').join('');
$('detailSpecRows').innerHTML=sheet.headers.map(k=>'<tr><th scope="row">'+esc(k)+'</th><td>'+esc(data[k]??'—')+'</td></tr>').join('');
const duplicates=sheet.rows.filter(r=>String(r[partIndex]||'').toUpperCase()===part.toUpperCase()).length;
if(duplicates>1){$('duplicateNote').hidden=false;$('duplicateNote').textContent='Source Excel includes '+duplicates+' rows with this part number in the selected family. Verify records before production import.';}
$('inquireBtn').href='mailto:sales@sep-semi.com?subject='+encodeURIComponent('SEP Product Inquiry: '+part);
const pkgIndex=sheet.headers.indexOf('Package'),pkg=pkgIndex>=0?String(row[pkgIndex]||''):'';
const related=sheet.rows.map((r,i)=>({row:r,index:i})).filter(x=>x.index!==index&&String(x.row[partIndex]||'').toUpperCase()!==part.toUpperCase());
related.sort((a,b)=>Number(pkgIndex>=0&&String(b.row[pkgIndex]||'')===pkg)-Number(pkgIndex>=0&&String(a.row[pkgIndex]||'')===pkg));
$('relatedParts').innerHTML=related.slice(0,8).map(x=>{
 const label=String(x.row[partIndex]||''),url='product.html?sheet='+encodeURIComponent(sheet.id)+'&row='+x.index+'&part='+encodeURIComponent(label);
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