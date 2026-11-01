'use strict';
P.setDishes(DISHES);
const {BYKEY,calc,sum,variants,norm}=P;
const KEY='macros2-v1';
const DEF={targets:{kcal:2200,p:150,c:240,f:70},prof:{},days:{},draft:''};
let S;try{S=Object.assign({},DEF,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S={...DEF}}
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const pad=n=>String(n).padStart(2,'0'),ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),parseD=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const TODAY=()=>ymd(new Date());
const r0=Math.round,r1=x=>Math.round(x*10)/10;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s),V=$('#view');
const MEALS=[['desayuno','Desayuno'],['almuerzo','Almuerzo'],['merienda','Merienda'],['cena','Cena'],['snack','Snack']];
const defMeal=()=>{const h=new Date().getHours();return h<11?'desayuno':h<15?'almuerzo':h<19?'merienda':h<23?'cena':'snack'};
const dayItems=d=>(S.days[d]||[]).flatMap(e=>e.items);
const dayTot=d=>sum(dayItems(d));
const status=(v,t)=>{const r=v/t;return r>=.9&&r<=1.1?'ok':r>=.8&&r<=1.2?'warn':'bad'};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1700)}
const label=f=>f.n+(f.st!=='—'?' ('+f.st+')':'');
let tab='anotar',items=[],unknown=[],meal=defMeal(),sugOff=0;
function setTab(t){tab=t;document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));render();scrollTo(0,0)}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
$('#gear').onclick=()=>openTargets();
function header(){const t=dayTot(TODAY());$('#kleft').textContent=r0(Math.max(0,S.targets.kcal-t.kcal))+' kcal libres'}
function render(){header();({anotar:vAnotar,platos:vPlatos,falta:vFalta,historial:vHist})[tab]()}
function openModal(h){$('#mcard').innerHTML='<button class="x" id="mx" aria-label="Cerrar">✕</button>'+h;$('#modal').classList.remove('hidden');$('#mx').onclick=closeModal}
function closeModal(){$('#modal').classList.add('hidden')}
$('.modal-bg').onclick=closeModal;addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const totBox=t=>`<div class="tot"><div><b>${r0(t.kcal)}</b><span>kcal</span></div><div><b class="P">${r1(t.p)}</b><span>Proteína g</span></div><div><b class="C">${r1(t.c)}</b><span>Carbos g</span></div><div><b class="F">${r1(t.f)}</b><span>Grasas g</span></div></div>`;

/* ===== Anotar ===== */
const EX=['200 g de nalga, 2 huevos y una banana','1 taza de arroz cocido con 150 de pollo','milanesa al horno con ensalada completa','50 g de avena, 200 de yogur y una manzana','licuado proteico'];
function vAnotar(){const t=dayTot(TODAY());
 V.innerHTML=`<h1>¿Qué comiste?</h1><label for="say" class="sr">Escribí lo que comiste</label><textarea id="say" placeholder="Escribilo como lo decís… ej: 200 g de nalga, 2 huevos y una banana" autocomplete="off" enterkeyhint="done">${esc(S.draft)}</textarea>
 <div class="ex" aria-label="Ejemplos">${EX.map(e=>`<button data-ex="${esc(e)}">${esc(e)}</button>`).join('')}</div>
 <div id="out"></div>
 <div class="box"><div class="row between"><h2 style="margin:0">Hoy</h2><span class="small mut">${r0(t.kcal)} de ${S.targets.kcal} kcal</span></div><div class="meter" role="progressbar" aria-label="Calorías de hoy" aria-valuemin="0" aria-valuemax="${S.targets.kcal}" aria-valuenow="${r0(t.kcal)}"><i style="width:${Math.min(100,t.kcal/S.targets.kcal*100)}%;background:${t.kcal>S.targets.kcal*1.1?'var(--bad)':'var(--acc)'}"></i></div>
 <div id="today">${entriesHTML(TODAY())}</div></div>`;
 const ta=$('#say');let tm;ta.oninput=()=>{S.draft=ta.value;clearTimeout(tm);tm=setTimeout(()=>{save();doParse()},120)};
 V.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>{ta.value=b.dataset.ex;S.draft=ta.value;save();doParse()});
 bindEntries(TODAY());doParse();}
function doParse(){const r=P.parse(S.draft||'');items=r.filter(x=>x.type==='food').map(x=>({key:x.key,g:x.g,how:x.how,warn:x.warn,dish:x.dish}));unknown=r.filter(x=>x.type==='unknown').map(x=>x.text);drawOut()}
function drawOut(){const O=$('#out');if(!O)return;if(!items.length&&!unknown.length){O.innerHTML=S.draft?`<div class="empty">No reconocí ningún alimento. Probá con “150 g de pollo”.</div>`:`<div class="small mut" style="margin:6px 2px 14px">💡 Podés poner gramos (150 g), unidades (2 huevos), tazas, cucharadas o fetas. Separá con comas o “y”.</div>`;return}
 const t=sum(items);
 O.innerHTML=`<div class="chips">${items.map((it,i)=>{const f=BYKEY[it.key];const m=calc(f,it.g);return `<button class="chip ${it.warn?'warn':''}" data-i="${i}" aria-label="Editar ${esc(f.n)}"><span class="g">${r1(it.g)} g</span><span class="n"><b>${esc(f.n)}${f.st!=='—'?`<span class="badge">${f.st}</span>`:''}</b><span class="small mut">${it.warn?'⚠️ revisá los gramos · ':''}${esc(it.dish||it.how||'')} <span class="P">P ${r1(m.p)}</span> · <span class="C">C ${r1(m.c)}</span> · <span class="F">G ${r1(m.f)}</span></span></span><span class="k">${r0(m.kcal)}</span></button>`}).join('')}
 ${unknown.map(u=>`<div class="chip unk">❓ No reconocí “${esc(u)}”. Escribilo de otra forma.</div>`).join('')}</div>
 <div class="box">${totBox(t)}<div class="seg" role="group" aria-label="Comida">${MEALS.map(([k,l])=>`<button data-m="${k}" class="${k===meal?'on':''}" aria-pressed="${k===meal}">${l}</button>`).join('')}</div><button class="btn acc full" id="saveE">Guardar en hoy</button></div>`;
 O.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>editItem(+b.dataset.i));
 O.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{meal=b.dataset.m;drawOut()});
 $('#saveE').onclick=()=>{if(!items.length)return;(S.days[TODAY()]=S.days[TODAY()]||[]).push({id:Date.now().toString(36),t:new Date().toISOString(),meal,text:S.draft,items:items.map(({key,g})=>({key,g:r1(g)}))});S.draft='';save();toast('Guardado en '+MEALS.find(m=>m[0]===meal)[1]+' ✓');items=[];render()};
}
function editItem(i){const it=items[i];let f=BYKEY[it.key];let g=it.g;const alts=P.FOODS.filter(x=>x.n!==f.n&&x.cat===f.cat).map(x=>x.n).filter((n,j,a)=>a.indexOf(n)===j);
 const draw=()=>{const vs=variants(f.n);const m=calc(f,g||0);openModal(`<h2>${esc(f.n)}</h2>
 ${vs.length>1?`<div class="seg">${vs.map(v=>`<button data-st="${v.st}" class="${v===f?'on':''}" aria-pressed="${v===f}">${v.st==='crudo'?'Crudo':'Cocido'}</button>`).join('')}</div>`:''}
 <label>Gramos<input id="eg" type="number" inputmode="decimal" value="${r1(g)}" class="gbig"></label>
 <div class="seg">${[50,100,150,200].map(x=>`<button data-g="${x}">${x} g</button>`).join('')}</div>
 <div id="em">${totBox(m)}</div>
 <label style="margin-top:12px">¿Era otro alimento?<select id="alt"><option value="">— cambiar por… —</option>${alts.map(n=>`<option>${esc(n)}</option>`).join('')}</select></label>
 <div class="small mut">Fuente: ${esc(f.src)} — ${esc(f.usda)}</div>
 <div class="row" style="margin-top:14px"><button class="btn del" id="erm">Quitar</button><button class="btn pri" id="eok" style="flex:1">Listo</button></div>`);
 const eg=$('#eg');const upd=()=>{$('#em').innerHTML=totBox(calc(f,g||0))};eg.oninput=()=>{g=parseFloat(eg.value.replace(',','.'))||0;upd()};
 document.querySelectorAll('#mcard [data-g]').forEach(b=>b.onclick=()=>{g=+b.dataset.g;eg.value=g;upd()});
 document.querySelectorAll('#mcard [data-st]').forEach(b=>b.onclick=()=>{f=vs.find(v=>v.st===b.dataset.st);draw()});
 $('#alt').onchange=e=>{if(e.target.value){f=variants(e.target.value)[0];draw()}};
 $('#erm').onclick=()=>{items.splice(i,1);closeModal();drawOut()};
 $('#eok').onclick=()=>{items[i]={...it,key:f.key,g,warn:false};closeModal();drawOut()}};draw()}
function entriesHTML(d){const E=S.days[d]||[];if(!E.length)return '<div class="empty small">Todavía no anotaste nada.</div>';
 return E.map(e=>{const t=sum(e.items);return `<div class="entry"><div class="row between"><b>${MEALS.find(m=>m[0]===e.meal)?.[1]||''} · ${new Date(e.t).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</b><span class="row"><b>${r0(t.kcal)} kcal</b><button class="btn sm del" data-del="${e.id}" aria-label="Borrar">Borrar</button></span></div><div class="small mut">${esc(e.text||e.items.map(i=>BYKEY[i.key]?.n).join(', '))}</div><div class="small"><span class="P">P ${r0(t.p)}</span> · <span class="C">C ${r0(t.c)}</span> · <span class="F">G ${r0(t.f)}</span></div></div>`}).join('')}
function bindEntries(d){V.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(!confirm('¿Borrar esta comida?'))return;S.days[d]=S.days[d].filter(e=>e.id!==b.dataset.del);save();render();if(!$('#modal').classList.contains('hidden'))showDay(d)})}

/* ===== Platos ===== */
function vPlatos(){V.innerHTML=`<h1>Platos fitness</h1><p class="mut small" style="margin-top:-6px">Armados con alimentos de la tabla. Tocá uno para anotarlo (después podés cambiar los gramos).</p><div class="dishes">${DISHES.map((d,i)=>{const t=sum(d.items.map(([key,g])=>({key,g})));return `<button class="dish" data-d="${i}"><span class="e" aria-hidden="true">${d.emoji}</span><b>${esc(d.name)}</b><span class="m"><b style="color:var(--ink)">${r0(t.kcal)} kcal</b> · P ${r0(t.p)} · C ${r0(t.c)} · G ${r0(t.f)}</span></button>`}).join('')}</div>`;
 V.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const d=DISHES[+b.dataset.d];const t=sum(d.items.map(([key,g])=>({key,g})));
 openModal(`<h2>${d.emoji} ${esc(d.name)}</h2>${d.items.map(([k,g])=>{const f=BYKEY[k];return `<div class="entry row between"><span>${g} g ${esc(label(f))}</span><b>${r0(calc(f,g).kcal)}</b></div>`}).join('')}<div style="margin-top:10px">${totBox(t)}</div><button class="btn acc full" id="useD" style="margin-top:14px">Anotarlo</button>`);
 $('#useD').onclick=()=>{S.draft=(S.draft?S.draft.trim().replace(/[,y]$/,'')+', ':'')+d.name.toLowerCase();save();closeModal();setTab('anotar')}})}

/* ===== ¿Qué me falta? ===== */
const PF=['Pechuga de pollo (sin piel)|cocido','Atún al natural (lata)|cocido','Clara de huevo|crudo','Yogur griego descremado|—','Nalga|cocido','Queso cottage|—','Merluza|cocido','Lomo de cerdo|cocido'];
const CF=['Arroz blanco|cocido','Avena arrollada|crudo','Batata|cocido','Banana|—','Papa hervida|cocido','Fideos secos (trigo)|cocido','Pan integral|—','Quinoa|cocido'];
const FF=['Palta|—','Almendras|—','Aceite de oliva|—','Maní tostado|—','Nueces|—'];
const CAP={'Palta|—':100,'Almendras|—':40,'Aceite de oliva|—':15,'Maní tostado|—':40,'Nueces|—':40,'Banana|—':240,'Avena arrollada|crudo':100,'Pan integral|—':128,'Clara de huevo|crudo':300};const cap=(f,g)=>Math.min(g,CAP[f.key]||300);
const r5=x=>Math.max(0,Math.round(x/5)*5);
function suggest(rem,i){const pf=BYKEY[PF[i%PF.length]],cf=BYKEY[CF[i%CF.length]],ff=BYKEY[FF[i%FF.length]];const out=[];
 let gP=rem.p>5?cap(pf,r5(rem.p/pf.p*100)):0;if(gP)out.push([pf,gP]);
 const c1=rem.c-(gP*pf.c/100);let gC=c1>8?cap(cf,r5(c1/cf.c*100)):0;if(gC)out.push([cf,gC]);
 const f1=rem.f-(gP*pf.f+gC*cf.f)/100;let gF=f1>3?cap(ff,ff.f>90?Math.max(1,Math.round(f1/ff.f*100)):r5(f1/ff.f*100)):0;if(gF)out.push([ff,gF]);
 let k=out.reduce((a,[f,g])=>a+f.kcal*g/100,0);
 if(rem.kcal>0&&k>rem.kcal*1.08){const s=rem.kcal/k;out.forEach(x=>x[1]=r5(x[1]*s)||5);}
 return out.filter(x=>x[1]>0)}
function vFalta(){const T=S.targets,t=dayTot(TODAY());const rem={kcal:T.kcal-t.kcal,p:T.p-t.p,c:T.c-t.c,f:T.f-t.f};
 const bar=(l,v,tg,col)=>`<div class="row between small"><span>${l}</span><span><b>${r0(v)}</b> / ${tg} ${l==='Calorías'?'kcal':'g'} · ${tg-v>=0?'faltan '+r0(tg-v):'<span style="color:var(--bad)">+'+r0(v-tg)+'</span>'}</span></div><div class="meter"><i style="width:${Math.min(100,v/tg*100)}%;background:${col}"></i></div>`;
 const done=rem.kcal<60&&rem.p<8;
 const sugs=done?[]:[0,1,2].map(j=>suggest(rem,sugOff+j)).filter(s=>s.length);
 V.innerHTML=`<h1>¿Qué me falta hoy?</h1><div class="box">${bar('Calorías',t.kcal,T.kcal,'var(--acc)')}${bar('Proteína',t.p,T.p,'var(--p)')}${bar('Carbos',t.c,T.c,'var(--c)')}${bar('Grasas',t.f,T.f,'var(--f)')}<button class="btn sm" id="edT">Cambiar mis objetivos</button></div>
 ${done?'<div class="box" style="text-align:center"><div style="font-size:40px">🎉</div><b>¡Llegaste a tu objetivo de hoy!</b></div>':`<h2>Ideas para completar el día</h2>${sugs.map((s,j)=>{const tt=sum(s.map(([f,g])=>({key:f.key,g})));return `<div class="sug"><b>Opción ${j+1}</b>${s.map(([f,g])=>`<div class="row between" style="padding:4px 0"><span>${g} g ${esc(label(f))}</span><span class="small mut">${r0(calc(f,g).kcal)} kcal</span></div>`).join('')}<div class="small" style="margin:6px 0"><b>${r0(tt.kcal)} kcal</b> · <span class="P">P ${r0(tt.p)}</span> · <span class="C">C ${r0(tt.c)}</span> · <span class="F">G ${r0(tt.f)}</span></div><button class="btn sm pri" data-s="${j}">Anotar esta opción</button></div>`}).join('')}<button class="btn full" id="more">🔄 Otras ideas</button>`}`;
 $('#edT').onclick=openTargets;if($('#more'))$('#more').onclick=()=>{sugOff+=3;vFalta()};
 V.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const s=sugs[+b.dataset.s];S.draft=s.map(([f,g])=>`${g} g de ${f.n.toLowerCase()}${f.st!=='—'?' '+f.st:''}`).join(', ');save();setTab('anotar');toast('Revisalo y tocá Guardar')})}
function openTargets(){const T=S.targets,p=S.prof;openModal(`<h2>🎯 Mis objetivos diarios</h2><div class="grid2"><label>Calorías<input id="t_kcal" type="number" inputmode="numeric" value="${T.kcal}"></label><label>Proteína (g)<input id="t_p" type="number" inputmode="numeric" value="${T.p}"></label><label>Carbos (g)<input id="t_c" type="number" inputmode="numeric" value="${T.c}"></label><label>Grasas (g)<input id="t_f" type="number" inputmode="numeric" value="${T.f}"></label></div>
 <details><summary style="font-weight:700;cursor:pointer;padding:8px 0">Calcularlos con mis datos</summary><div class="grid2"><label>Peso (kg)<input id="q_w" type="number" inputmode="decimal" value="${p.w||''}"></label><label>Altura (cm)<input id="q_h" type="number" inputmode="decimal" value="${p.h||''}"></label><label>Edad<input id="q_a" type="number" inputmode="numeric" value="${p.a||''}"></label><label>Sexo<select id="q_s"><option value="m">Hombre</option><option value="f" ${p.s==='f'?'selected':''}>Mujer</option></select></label></div>
 <label>Actividad<select id="q_act">${[[1.2,'Poca'],[1.375,'Liviana (1-3 días)'],[1.55,'Moderada (3-5 días)'],[1.725,'Alta (6-7 días)']].map(([v,l])=>`<option value="${v}" ${(+p.act||1.55)===v?'selected':''}>${l}</option>`).join('')}</select></label>
 <label>Objetivo<select id="q_g"><option value="-0.2">Bajar grasa</option><option value="0" ${p.g==='0'?'selected':''}>Mantener</option><option value="0.1" ${p.g==='0.1'?'selected':''}>Ganar músculo</option></select></label><button class="btn" id="calc">Calcular (Mifflin-St Jeor)</button></details>
 <button class="btn pri full" id="tok" style="margin-top:14px">Guardar</button>`);
 $('#calc').onclick=()=>{const w=+$('#q_w').value,h=+$('#q_h').value,a=+$('#q_a').value,s=$('#q_s').value,act=+$('#q_act').value,g=$('#q_g').value;if(!w||!h||!a){toast('Completá peso, altura y edad');return}Object.assign(S.prof,{w,h,a,s,act,g});
  const bmr=10*w+6.25*h-5*a+(s==='f'?-161:5);const kcal=Math.round(bmr*act*(1+ +g)/10)*10;const pr=Math.round(w*(+g<0?2.2:+g>0?2:1.8));const fat=Math.round(kcal*.25/9);const carb=Math.max(0,Math.round((kcal-pr*4-fat*9)/4));
  $('#t_kcal').value=kcal;$('#t_p').value=pr;$('#t_c').value=carb;$('#t_f').value=fat;toast('Calculado: '+kcal+' kcal')};
 $('#tok').onclick=()=>{['kcal','p','c','f'].forEach(k=>T[k]=+$('#t_'+k).value||T[k]);save();closeModal();render();toast('Objetivos guardados ✓')}}

/* ===== Historial ===== */
function vHist(){const T=S.targets;const days=[...Array(14)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return ymd(d)});const last7=days.slice(0,7).filter(d=>(S.days[d]||[]).length);
 const avg=last7.reduce((a,d)=>{const t=dayTot(d);for(const k in a)a[k]+=t[k]/last7.length;return a},{kcal:0,p:0,c:0,f:0,fib:0});
 V.innerHTML=`<h1>Historial</h1><div class="box"><h2>Promedio de los últimos 7 días</h2>${last7.length?totBox(avg)+`<div class="small mut" style="margin-top:6px">${last7.length} de 7 días con registros · objetivo ${T.kcal} kcal</div>`:'<div class="empty small">Anotá comidas para ver tu promedio.</div>'}</div>
 <div class="box"><h2>Últimos 14 días</h2>${days.map(d=>{const has=(S.days[d]||[]).length;const t=dayTot(d);return `<button class="day" data-d="${d}"><span style="text-transform:capitalize;font-weight:700">${d===TODAY()?'Hoy':parseD(d).toLocaleDateString('es-AR',{weekday:'short',day:'numeric'})}</span><span><span class="meter" style="display:block;margin:0 0 2px"><i style="width:${Math.min(100,t.kcal/T.kcal*100)}%;background:${has?'var(--acc)':'transparent'}"></i></span><span class="small mut">${has?`P ${r0(t.p)} · C ${r0(t.c)} · G ${r0(t.f)}`:'Sin registros'}</span></span>${has?`<span class="st ${status(t.kcal,T.kcal)}">${r0(t.kcal)}</span>`:'<span></span>'}</button>`}).join('')}<div class="small mut" style="margin-top:8px"><span class="st ok">verde</span> ±10% del objetivo · <span class="st warn">amarillo</span> ±20% · <span class="st bad">rojo</span> más lejos</div></div>
 <div class="box"><h2>Copia de seguridad</h2><div class="row"><button class="btn sm" id="exp">Exportar</button><label class="btn sm" style="margin:0;color:var(--ink);display:inline-flex;align-items:center">Importar<input id="imp" type="file" accept=".json,application/json" style="display:none"></label></div></div>
 <p class="small mut">Datos: USDA FoodData Central (SR Legacy). Cortes argentinos asociados al corte más parecido. Orientativo, no reemplaza a un/a nutricionista.</p>`;
 V.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>showDay(b.dataset.d));
 $('#exp').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({app:'macros2',v:1,data:S})],{type:'application/json'}));a.download='macros2-backup-'+TODAY()+'.json';a.click()};
 $('#imp').onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text());if(j.app!=='macros2')throw 0;if(!confirm('¿Reemplazar tus datos con el backup?'))return;S=Object.assign({},DEF,j.data);save();render();toast('Restaurado ✓')}catch(_){alert('Archivo inválido')}}}
function showDay(d){const t=dayTot(d);openModal(`<h2 style="text-transform:capitalize">${parseD(d).toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'})}</h2>${totBox(t)}<div style="margin-top:10px">${entriesHTML(d)}</div>`);
 document.querySelectorAll('#mcard [data-del]').forEach(b=>b.onclick=()=>{if(!confirm('¿Borrar esta comida?'))return;S.days[d]=S.days[d].filter(e=>e.id!==b.dataset.del);save();render();showDay(d)})}

if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js');
window.__app={S:()=>S,dayTot,suggest};
render();
