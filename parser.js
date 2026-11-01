/* Macros 2.0 — parser de lenguaje natural (español rioplatense). Sin dependencias. */
(function(root){
'use strict';
const FOODS=root.FOODS||(typeof require!=='undefined'?require('./foods.js'):[]);
const norm=s=>(s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
FOODS.forEach(f=>{f.key=f.n+'|'+f.st;f.nn=norm(f.n);f.hay=norm(f.n+' '+f.s.replace(/,/g,' ')+' '+f.cat);f.words=f.hay.split(/[^a-z0-9%]+/).filter(Boolean)});
const BYKEY=Object.fromEntries(FOODS.map(f=>[f.key,f]));
const variants=n=>FOODS.filter(f=>f.n===n);
const POP=['Pechuga de pollo (sin piel)','Huevo entero','Arroz blanco','Avena arrollada','Banana','Leche descremada','Queso de máquina (tybo)','Carne picada magra (95/5)','Fideos secos (trigo)','Papa hervida','Manzana','Yogur natural descremado','Pan integral','Tomate','Atún al natural (lata)','Lechuga','Aceite de oliva','Clara de huevo','Ricota descremada','Batata','Nalga','Lentejas','Naranja','Zanahoria'];
const ALIAS={pollo:'pechuga pollo',pechuga:'pechuga pollo',huevo:'huevo entero',huevos:'huevo entero',clara:'clara huevo',claras:'clara huevo',tostada:'pan integral',tostadas:'pan integral',pan:'pan integral',carne:'nalga',bife:'nalga',milanesa:'nalga',fideos:'fideos secos',pasta:'fideos secos',arroz:'arroz blanco',yogur:'yogur natural descremado',yogurt:'yogur natural descremado',leche:'leche descremada',queso:'queso maquina tybo',atun:'atun natural',aceite:'aceite oliva',oliva:'aceite oliva',papas:'papa',papa:'papa',mani:'mani tostado',palta:'palta',cafe:'cafe',te:'te negro',jamon:'jamon cocido magro',picada:'carne picada magra',ricota:'ricota descremada',lomito:'lomo',suprema:'pechuga pollo',porotos:'porotos negros',lentejas:'lentejas',garbanzos:'garbanzos',fruta:'manzana'};
const NUMW={un:1,uno:1,una:1,medio:.5,media:.5,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,quince:15,veinte:20,treinta:30,cuarenta:40,cincuenta:50,cien:100,ciento:100,doscientos:200,doscientas:200,trescientos:300,trescientas:300,cuatrocientos:400,cuatrocientas:400,quinientos:500,quinientas:500,cuarto:.25,par:2};
const UNITS=[[/^(g|gr|grs|gramo|gramos)$/,'g'],[/^(kg|kgs|kilo|kilos)$/,'kg'],[/^(ml|cc|mililitros?)$/,'ml'],[/^(l|lt|litro|litros)$/,'l'],[/^(taza|tazas|tz)$/,'taza'],[/^(cda|cdas|cucharada|cucharadas|cuch)$/,'cda'],[/^(cdita|cditas|cucharadita|cucharaditas)$/,'cdita'],[/^(feta|fetas|rebanada|rebanadas|rodaja|rodajas|tajada|tajadas)$/,'feta'],[/^(u|un|unidad|unidades|unid)$/,'unidad'],[/^(porcion|porciones|plato|platos)$/,'porcion'],[/^(vaso|vasos)$/,'vaso'],[/^(puñado|punado|punados|puñados)$/,'puñado'],[/^(lata|latas)$/,'lata']];
const STOP=new Set(['de','del','la','el','los','las','al','a','unos','unas','en','mi','para','tipo','y','o','horno','plancha','grill','parrilla','sarten','hecho','hecha','hechos','hechas','natural'].filter(w=>w!=='natural'));
const COOK=/\b(cocid[oa]s?|hervid[oa]s?|al horno|a la plancha|plancha|grill(ad[oa]s?)?|asad[oa]s?|a la parrilla|hech[oa]s?|salteado|salteada|al vapor)\b/;
const RAW=/\b(crud[oa]s?|en crudo)\b/;
function lev(a,b){if(a===b)return 0;const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;let p=[...Array(n+1).keys()];for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
const sing=w=>w.length>4&&/es$/.test(w)&&!/(es)$/.test(w.slice(0,-2))?[w,w.slice(0,-2),w.slice(0,-1)]:w.length>3&&/s$/.test(w)?[w,w.slice(0,-1)]:[w];
function tokScore(t,f){let best=0;for(const v of sing(t)){if(f.words.includes(v))return 3;for(const w of f.words){if(w.startsWith(v)&&v.length>=3)best=Math.max(best,2.2);else if(v.length>=4){const d=lev(v,w.slice(0,Math.max(v.length,w.length)));const d2=lev(v,w);if(Math.min(d,d2)<=(v.length>=7?2:1))best=Math.max(best,1.5)}}}return best}
function matchFood(q){let toks=norm(q).split(/[^a-z0-9%]+/).filter(t=>t&&!STOP.has(t));if(!toks.length)return null;
 if(toks.length===1&&ALIAS[toks[0]])toks=ALIAS[toks[0]].split(' ');else toks=toks.flatMap(t=>ALIAS[t]&&toks.length===1?ALIAS[t].split(' '):[t]);
 let best=null,bs=0;const seen=new Set;for(const f of FOODS){if(seen.has(f.n))continue;seen.add(f.n);let s=0,miss=0;for(const t of toks){const x=tokScore(t,f);if(!x)miss++;s+=x}
 if(miss>Math.floor(toks.length/2)||s===0)continue;s-=miss*2;const nameHit=toks.filter(t=>f.nn.includes(t)).length;s+=nameHit*.8;if(f.nn.startsWith(toks[0]))s+=1.2;if(POP.includes(f.n))s+=1;s-=f.words.length*.02;if(s>bs){bs=s;best=f}}
 return best?{food:best,score:bs}:null}
const PORT={taza:/\bcups?\b/,cda:/\btbsp\b|tablespoon/,cdita:/\btsp\b|teaspoon/,feta:/\bslices?\b/,vaso:/\bcups?\b|fl oz/,lata:/\bcan\b/,puñado:/\b(oz|cup)\b/};
function portion(f,unit){const P=(f.por||[]).filter(p=>p[1]>0);let p;
 if(unit==='unidad'||unit==='porcion'){if(f.cat==='Huevos')p=P.find(x=>/^1 large$/.test(x[0]));if(!p)p=P.find(x=>/\bmedium\b/.test(x[0])&&!/cup|slice|tbsp/.test(x[0]))||P.find(x=>/\blarge\b/.test(x[0])&&!/cup|slice|tbsp/.test(x[0]))||P.find(x=>/\b(fruit|egg|whole|item|piece|breast|thigh|drumstick|fillet|steak|patty|tortilla|cake|nut|kernel|unit|slice|leg|bun|roll)\b/.test(x[0])&&!/cup|tbsp|oz/.test(x[0]))}
 else if(PORT[unit]){p=P.find(x=>PORT[unit].test(x[0])&&!/,|\(/.test(x[0]))||P.find(x=>PORT[unit].test(x[0]))}
 if(!p&&unit==='cdita'){const q=portion(f,'cda');if(q)return{g:q.g/3,label:'1/3 tbsp'}}
 if(!p&&unit==='cda'){const q=portion(f,'cdita');if(q)return{g:q.g*3,label:'3 tsp'}}
 if(!p)return null;const m=p[0].match(/^([\d.\/]+)/);let a=1;if(m){a=m[1].includes('/')?m[1].split('/').reduce((x,y)=>x/y):parseFloat(m[1])}return{g:p[1]/(a||1),label:p[0]}}
function pickVariant(f,seg,unit){const vs=variants(f.n);if(vs.length<2)return f;const s=norm(seg);
 if(RAW.test(s))return vs.find(v=>v.st==='crudo')||f;if(COOK.test(s))return vs.find(v=>v.st==='cocido')||f;
 if(['Cereales','Legumbres'].includes(f.cat)||unit==='taza')return vs.find(v=>v.st==='cocido')||f;return vs.find(v=>v.st==='crudo')||f}
function parseNum(t){if(t==null)return null;if(/^\d+(\.\d+)?$/.test(t))return parseFloat(t);if(/^\d+\/\d+$/.test(t)){const[a,b]=t.split('/');return a/b}if(t in NUMW)return NUMW[t];return null}
function unitOf(t){for(const[r,u]of UNITS)if(r.test(t))return u;return null}
let DISHES=[];
function setDishes(d){DISHES=d}
function matchDish(seg){const s=norm(seg).replace(/\b(\d+|una?|dos|tres|medi[oa])\b/g,' ').replace(/\b(porcion|porciones|plato|platos|de|del)\b/g,' ').trim();if(!s)return null;
 for(const d of DISHES){const names=[d.name,...(d.alias||[])].map(norm);for(const n of names){if(s===n||s.includes(n))return d;const st=s.split(/\s+/),nt=n.split(/\s+/).filter(w=>!['de','con','al','y'].includes(w));if(nt.length>1&&nt.every(w=>st.some(x=>lev(x,w)<=1)))return d}}return null}
function splitPhrase(text){let s=' '+norm(text)+' ';s=s.replace(/(\d),(\d)/g,'$1.$2').replace(/(\d)\s*(g|gr|grs|kg|ml|cc)\b/g,'$1 $2');
 s=s.replace(/\by medi[oa]\b/g,' +medio');
 // protect dish names containing separators
 const prot=[];DISHES.forEach(d=>[d.name,...(d.alias||[])].forEach(n=>{const nn=norm(n);if(/\b(con|y)\b/.test(nn)&&s.includes(nn)){const tok='§'+prot.length+'§';prot.push(nn);s=s.split(nn).join(tok)}}));
 let parts=s.split(/\s*(?:,|;|\+(?!medio)|\n|\.(?!\d)|\by\b|\be\b|\bcon\b|\bmas\b|\bmás\b|\bjunto a\b)\s*/).map(x=>x.trim()).filter(Boolean);
 return parts.map(p=>p.replace(/§(\d+)§/g,(_,i)=>prot[i]))}
function parseSegment(seg){const raw=seg;let toks=seg.split(/\s+/).filter(Boolean);let qty=null,unit=null,half=false;
 if(toks.includes('+medio')){half=true;toks=toks.filter(t=>t!=='+medio')}
 // leading quantity
 let i=0;let n=parseNum(toks[0]);if(n!=null){qty=n;i=1;
  if(toks[0]==='un'&&toks[1]==='cuarto'){qty=.25;i=2}
  else if(toks[0]==='un'&&toks[1]==='par'){qty=2;i=2;if(toks[2]==='de')i=3}
  else if(n>=100&&toks[1]==='y'){}
  const n2=parseNum(toks[i]);if(n2!=null&&n2<100&&qty>=100){qty+=n2;i++} // "ciento cincuenta"
  if(['medio','media'].includes(toks[i])&&qty>=1&&n<10){qty+=.5;i++}
 }
 const u=toks[i]&&unitOf(toks[i]);if(u&&!(u==='unidad'&&toks[i]==='un'&&qty==null)){unit=u;i++}
 if(qty==null&&unit&&toks[0]&&unitOf(toks[0])&&i===1)qty=1;
 if(toks[i]==='de'||toks[i]==='del')i++;
 let rest=toks.slice(i).join(' ');
 // trailing quantity: "pollo 150 g" / "pollo 150"
 if(qty==null){const m=rest.replace(COOK,' ').replace(RAW,' ').replace(/\s+/g,' ').trim().match(/^(.*?)\s+(\d+(?:\.\d+)?)\s*([a-z]+)?$/);if(m&&(!m[3]||unitOf(m[3]))){rest=m[1]+(COOK.test(rest)?' cocido':RAW.test(rest)?' crudo':'');qty=parseFloat(m[2]);unit=m[3]?unitOf(m[3]):null}}
 if(half)qty=(qty||1)+.5;
 if(!rest.trim())return null;
 const dish=matchDish(rest);if(dish)return{type:'dish',dish,mult:qty&&(!unit||unit==='porcion'||unit==='unidad')?qty:1,text:raw};
 const m=matchFood(rest.replace(COOK,' ').replace(RAW,' '));if(!m)return{type:'unknown',text:raw};
 const f=pickVariant(m.food,rest,unit);let g=null,how='',warn=false;
 if(unit==='g'||unit==='ml')g=qty;else if(unit==='kg'||unit==='l')g=qty*1000;
 else if(unit){const p=portion(f,unit)||(unit==='vaso'?portion(f,'taza'):null);if(p){g=(qty||1)*p.g;how=(qty||1)+' '+unit+(qty>1?'s':'')}else{g=qty&&qty>=15?qty:100;warn=true;how=unit+' sin medida en la tabla'}}
 else if(qty!=null){if(qty>=15)g=qty;else{const p=portion(f,'unidad');if(p){g=qty*p.g;how=qty+' u.'}else{g=100;warn=true;how='sin medida por unidad'}}}
 else{const p=['Frutas','Huevos','Panificados'].includes(f.cat)?portion(f,'unidad')||portion(f,'feta'):null;if(p){g=p.g;how='1 u.'}else{g=100;how='100 g (estimado)';warn=true}}
 return{type:'food',key:f.key,food:f,g:Math.round(g*10)/10,how,warn,text:raw,score:m.score}}
function parse(text){const out=[];for(const seg of splitPhrase(text)){const r=parseSegment(seg);if(!r)continue;if(r.type==='dish'){r.dish.items.forEach(([k,g])=>out.push({type:'food',key:k,food:BYKEY[k],g:Math.round(g*r.mult*10)/10,how:r.dish.name+(r.mult!==1?' ×'+r.mult:''),dish:r.dish.name,text:r.text}))}else out.push(r)}return out}
const calc=(f,g)=>({kcal:f.kcal*g/100,p:f.p*g/100,c:f.c*g/100,f:f.f*g/100,fib:f.fib*g/100});
const sum=items=>items.reduce((t,it)=>{const f=BYKEY[it.key];if(!f)return t;const m=calc(f,it.g);for(const k in m)t[k]+=m[k];return t},{kcal:0,p:0,c:0,f:0,fib:0});
const API={parse,matchFood,splitPhrase,portion,calc,sum,BYKEY,FOODS,variants,norm,setDishes};
if(typeof module!=='undefined')module.exports=API;else root.P=API;
})(typeof window!=='undefined'?window:globalThis);
