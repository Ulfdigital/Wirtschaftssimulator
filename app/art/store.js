'use client';
// Der Laden als isometrischer Verkaufsraum. Größe, Wände, Boden und Einrichtung wachsen mit der Ladenstufe.
import {memo} from 'react';
import {P,iso,pts,shade,Box,Shadow,faceI} from './iso.js';
import {Pack} from './products.js';
import {product,shelfType,category,tier as tierOf} from '../../lib/data.mjs';

const COLS={emma:2,dorf:2,nachbar:3,lebensmittel:3,super:4,gross:4,verbraucher:5};
export const SH={w:2.2,d:0.9};
export function storeLayout(tierId){const t=tierOf(tierId),cols=COLS[tierId],rows=Math.ceil(t.slots/cols);
 const w=0.9+cols*2.8+0.7,d=0.3+rows*2.3+3.4;const slots=[];for(let k=0;k<t.slots;k++){const r=Math.floor(k/cols),c=k%cols;slots.push({i:0.9+c*2.8,j:0.3+r*2.3,row:r});}
 const checkouts=Array.from({length:t.checkouts},(_,k)=>({i:w-2.3-k*2.0,j:d-2.3}));return{w,d,rows,cols,slots,checkouts,door:{i:w-1.4,j:d}};}
const CLASSIC=['emma','dorf'];
const CAT_COLOR={grund:'#b8873a',back:'#a8692f',molkerei:'#3f7fb5',obst:'#4f8f3a',konserven:'#b5452f',getraenke:'#2f6f9f',suess:'#8a3a7a',kaffee:'#5a3a22',fleisch:'#a83a3a',tk:'#3a8ab5',drogerie:'#3aa58a',feinkost:'#6a7a2a',wein:'#6a1a2a',bio:'#3f8f3a',tier:'#7a5ab0'};
const WALL_H=100;

export function Defs(){return <defs>
 <filter id="blur4" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
 <filter id="blur2"><feGaussianBlur stdDeviation="1.5"/></filter>
 <radialGradient id="lightWarm"><stop offset="0" stopColor="#ffd9a0" stopOpacity=".55"/><stop offset="1" stopColor="#ffd9a0" stopOpacity="0"/></radialGradient>
 <radialGradient id="lightCool"><stop offset="0" stopColor="#ffffff" stopOpacity=".55"/><stop offset="1" stopColor="#ffffff" stopOpacity="0"/></radialGradient>
 <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8f0ff" stopOpacity=".38"/><stop offset=".5" stopColor="#d8f0ff" stopOpacity=".08"/><stop offset="1" stopColor="#d8f0ff" stopOpacity=".28"/></linearGradient>
 <linearGradient id="daylight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfe6f2"/><stop offset="1" stopColor="#9cc2d6"/></linearGradient>
</defs>;}

// ---------- Raum ----------
const Room=memo(function Room({tierId,w,d,name}){const classic=CLASSIC.includes(tierId);const floor=classic?'#7a5236':'#d6d8da',wall=classic?'#e7dcc6':'#eef0f1',wallR=classic?'#d9ccb3':'#e1e4e6';
 const lines=[];if(classic){for(let j=0.25;j<d;j+=0.25)lines.push(<polyline key={'p'+j} points={iso([0,j],[w,j])} stroke={j*4%3===0?'#5e3e28':'#6a4730'} strokeWidth=".8" fill="none" opacity=".7"/>);}
 else{for(let i=1;i<w;i++)lines.push(<polyline key={'i'+i} points={iso([i,0],[i,d])} stroke="#c3c6c9" strokeWidth=".7" fill="none"/>);for(let j=1;j<d;j++)lines.push(<polyline key={'j'+j} points={iso([0,j],[w,j])} stroke="#c3c6c9" strokeWidth=".7" fill="none"/>);}
 const lights=[];const step=classic?3:2.8;for(let i=1.4;i<w;i+=step)for(let j=1.2;j<d-1;j+=step){const[x,y]=P(i,j);lights.push(<ellipse key={i+'_'+j} cx={x} cy={y} rx="80" ry="40" fill={classic?'url(#lightWarm)':'url(#lightCool)'}/>);}
 return <g>
  {/* Außenkante/Sockel des Gebäudes */}
  <polygon points={iso([0,d,0],[w,d,0],[w,d,-14],[0,d,-14])} fill={classic?'#4a3322':'#8a9096'}/><polygon points={iso([w,0,0],[w,d,0],[w,d,-14],[w,0,-14])} fill={classic?'#3a281b':'#6e747a'}/>
  <polygon points={iso([0,0],[w,0],[w,d],[0,d])} fill={floor}/>{lines}<g style={{mixBlendMode:'soft-light'}}>{lights}</g>
  {/* Rückwand (entlang i) und linke Wand (entlang j) */}
  <polygon points={iso([0,0,0],[w,0,0],[w,0,WALL_H],[0,0,WALL_H])} fill={wall}/><polygon points={iso([0,0,0],[0,d,0],[0,d,WALL_H],[0,0,WALL_H])} fill={wallR}/>
  {classic?<><polygon points={iso([0,0,0],[w,0,0],[w,0,34],[0,0,34])} fill="#5b3c27"/><polygon points={iso([0,0,0],[0,d,0],[0,d,34],[0,0,34])} fill="#4c3221"/>
   <polyline points={iso([0,0,34],[w,0,34])} stroke="#3a2618" strokeWidth="2"/><polyline points={iso([0,d,34],[0,0,34],[w,0,34])} stroke="#3a2618" strokeWidth="2" fill="none"/></>
  :<><polygon points={iso([0,0,0],[w,0,0],[w,0,6],[0,0,6])} fill="#9aa1a7"/><polygon points={iso([0,0,0],[0,d,0],[0,d,6],[0,0,6])} fill="#8a9197"/><polygon points={iso([0,0,WALL_H-16],[w,0,WALL_H-16],[w,0,WALL_H-8],[0,0,WALL_H-8])} fill="#1f5f4a"/></>}
  {/* Wandkante oben */}<polyline points={iso([0,d,WALL_H],[0,0,WALL_H],[w,0,WALL_H])} stroke={classic?'#3a2618':'#7a8288'} strokeWidth="3" fill="none"/>
  {/* Fenster in der linken Wand */}{Array.from({length:Math.max(1,Math.floor(d/3.2))},(_,k)=>{const j0=1+k*3.2;return <g key={k}><polygon points={iso([0,j0,44],[0,j0+1.6,44],[0,j0+1.6,86],[0,j0,86])} fill="url(#daylight)" stroke={classic?'#f3ead8':'#cfd4d8'} strokeWidth="3"/><polyline points={iso([0,j0+0.8,44],[0,j0+0.8,86])} stroke={classic?'#f3ead8':'#cfd4d8'} strokeWidth="2"/></g>;})}
  {/* Ladenname an der Rückwand */}<g transform={faceI(Math.max(0.4,w*0.5-name.length*0.16),0,WALL_H-22)}><text x="0" y="0" fontSize="15" fontFamily="var(--serif)" fontWeight="600" fill={classic?'#5b3c27':'#1f3b33'} letterSpacing="1.5">{name.toUpperCase()}</text></g>
  {classic&&[1.6,w-1.6].map((i,k)=>{const[x,y]=P(i,1.5,WALL_H+20);return <g key={k}><line x1={x} y1={y-60} x2={x} y2={y+18} stroke="#2a1d14" strokeWidth="1"/><path d={`M${x-9} ${y+18} Q${x} ${y+4} ${x+9} ${y+18}Z`} fill="#3a2618"/><ellipse cx={x} cy={y+19} rx="6" ry="2" fill="#ffd27a"/></g>;})}
 </g>;});

// ---------- Personen ----------
const OUTFITS=[['#2f3e4f','#1c232b','#e8c9a8','#3a2a1e'],['#7a2f2f','#2b2b33','#d8a882','#1a1410'],['#4a5a3a','#3a3a40','#f0d2b4','#8a6a3a'],['#c9b38a','#2a3340','#c08a62','#2a1a12'],['#3f5f7f','#4a4a4a','#e8c9a8','#c9a87a'],['#6a4a6a','#2b2b33','#e0b896','#4a2a1a'],['#d0d4d8','#2f3e4f','#a87452','#111'],['#8a6a3a','#2a2a2a','#f0d2b4','#6a6a6a']];
export function Person({x=0,y=0,k=0,basket,apron,s=1}){const[top,legs,skin,hair]=OUTFITS[k%OUTFITS.length];
 return <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})`}><ellipse cx="0" cy="0" rx="7" ry="2.6" fill="#000" opacity=".25"/>
  <rect x="-3.6" y="-14" width="3" height="14" rx="1.3" fill={legs}/><rect x=".6" y="-14" width="3" height="14" rx="1.3" fill={shade(legs,-0.15)}/>
  <path d="M-5 -14 L-5.4 -25 Q-5 -29 0 -29 Q5 -29 5.4 -25 L5 -14Z" fill={apron?'#1f5f4a':top}/>{apron&&<rect x="-3" y="-25" width="6" height="11" fill="#e9e4d8" opacity=".9"/>}
  <rect x="-1.5" y="-31" width="3" height="3" fill={skin}/><circle cx="0" cy="-34" r="4" fill={skin}/><path d="M-4.2 -34.5 Q-4 -39 0 -39 Q4 -39 4.2 -34.5 Q2 -36.5 -4.2 -34.5Z" fill={hair}/>
  {basket&&<g><path d="M5 -17 v-5" stroke="#555" strokeWidth=".8"/><path d="M2.5 -17 h7 l-1 5 h-5z" fill="#c0392b"/></g>}</g>;}
function Walker({path,dur,begin,k}){return <g><Person k={k} basket/><animateMotion dur={dur+'s'} begin={begin+'s'} repeatCount="indefinite" path={path} calcMode="linear"/></g>;}

// ---------- Regale ----------
function priceTag(x,y){return <rect x={x-2.2} y={y} width="4.4" height="2.6" fill="#fff" opacity=".9"/>;}
export function ShelfUnit({type,facings,pos,cap,selected,tierId}){const t=shelfType(type),{i,j}=pos,w=SH.w,d=SH.d;const classic=CLASSIC.includes(tierId);
 const n=facings.length,col=CAT_COLOR[product(facings.find(f=>f.product)?.product)?.cat]||'#6b7378';
 const frame=classic||type==='bakery'||type==='wine'?'#6b4a30':'#c8ccd0',back=classic||type==='wine'?'#4a3322':'#3d434a';
 const items=[];const levelsZ=type==='chill'?[8,22,36]:type==='drinks'?[6,26]:[7,21,35];const per=type==='drinks'?2:(facings.length>=4?2:3);
 facings.forEach((f,fi)=>{if(!f.product)return;const share=Math.min(1,f.qty/cap);const total=levelsZ.length*per;let show=Math.ceil(share*total);
  for(let L=0;L<levelsZ.length&&show>0;L++)for(let c=0;c<per&&show>0;c++,show--){const u=(fi+(c+0.5)/per)*w/n;const[x,y]=P(i+u,j+0.62,levelsZ[L]+2);items.push(<Pack key={fi+'-'+L+'-'+c} id={f.product} x={x} y={y} s={type==='drinks'?1.25:1.3}/>);}
  const[tx,ty]=P(i+(fi+0.5)*w/n,j+d,levelsZ[0]);items.push(<g key={'t'+fi}>{priceTag(tx,ty)}</g>);});
 if(type==='freezer'){const prods=[];facings.forEach((f,fi)=>{if(!f.product)return;const share=Math.min(1,f.qty/cap);const cnt=Math.ceil(share*6);for(let c=0;c<cnt;c++){const[x,y]=P(i+(fi+0.2+(c%3)*0.28)*w/n,j+0.25+Math.floor(c/3)*0.35,20);prods.push(<Pack key={fi+'-'+c} id={f.product} x={x} y={y+4} s={0.95}/>);}});
  return <g><Shadow i={i} j={j} w={w} d={d}/><Box i={i} j={j} w={w} d={d} h={20} front="#e9ecee" side="#cfd4d8" top="#bcc6cc"/><polygon points={iso([i+0.1,j+0.1,20],[i+w-0.1,j+0.1,20],[i+w-0.1,j+d-0.1,20],[i+0.1,j+d-0.1,20])} fill="#9fc3d6"/>{prods}
   <polygon points={iso([i+0.1,j+0.1,21],[i+w-0.1,j+0.1,21],[i+w-0.1,j+d-0.1,21],[i+0.1,j+d-0.1,21])} fill="url(#glass)" stroke="#fff" strokeWidth=".6"/><polygon points={iso([i,j+d,2],[i+w,j+d,2],[i+w,j+d,6],[i,j+d,6])} fill={col}/>{selected&&<Sel i={i} j={j} h={20}/>}</g>;}
 if(type==='produce'){const crates=[];facings.forEach((f,fi)=>{const u0=fi*w/n+0.04,uw=w/n-0.08;crates.push(<Box key={'c'+fi} i={i+u0} j={j+0.15} w={uw} d={0.7} h={8} z={12} front="#b88a55" side="#9a7040" top="#7a5a3a"/>);
   if(f.product){const share=Math.min(1,f.qty/cap),cnt=Math.ceil(share*6);for(let c=0;c<cnt;c++){const[x,y]=P(i+u0+0.12+(c%3)*uw/3.2,j+0.3+Math.floor(c/3)*0.28,20);crates.push(<Pack key={fi+'p'+c} id={f.product} x={x} y={y+2} s={1}/>);}}});
  return <g><Shadow i={i} j={j} w={w} d={d}/><Box i={i} j={j} w={w} d={d} h={12} front="#8a6440" side="#6e4f32" top="#9a7450"/>{crates}<polygon points={iso([i,j+d,8],[i+w,j+d,8],[i+w,j+d,11],[i,j+d,11])} fill={col} opacity=".9"/>{selected&&<Sel i={i} j={j} h={20}/>}</g>;}
 const H=type==='chill'?56:type==='drinks'?46:50;
 return <g><Shadow i={i} j={j} w={w} d={d}/>
  <Box i={i} j={j} w={w} d={d} h={4} front="#2a2f35" side="#22272c" top="#3a3f45"/>
  <polygon points={iso([i,j+0.35,4],[i+w,j+0.35,4],[i+w,j+0.35,H],[i,j+0.35,H])} fill={type==='chill'?'#1d2f3d':back}/>
  {levelsZ.map(z=><g key={z}><Box i={i} j={j+0.35} w={w} d={d-0.35} z={z} h={1.6} front={type==='chill'?'#cfd8de':frame} top={type==='chill'?'#dfe7ec':shade(frame,0.15)}/></g>)}
  {items}
  {/* Seitenwangen */}<Box i={i-0.05} j={j} w={0.07} d={d} h={H} front={type==='chill'?'#f2f4f5':frame}/><Box i={i+w-0.02} j={j} w={0.07} d={d} h={H} front={type==='chill'?'#f2f4f5':frame}/>
  {type==='chill'&&<><polygon points={iso([i,j+d,4],[i+w,j+d,4],[i+w,j+d,H],[i,j+d,H])} fill="url(#glass)"/>{[0.55,1.1,1.65].map(u=><polyline key={u} points={iso([i+u,j+d,4],[i+u,j+d,H])} stroke="#f2f4f5" strokeWidth="1.4"/>)}<polygon points={iso([i,j+d,H-4],[i+w,j+d,H-4],[i+w,j+d,H],[i,j+d,H])} fill="#e9f6ff" opacity=".9"/></>}
  {/* Kopfschild */}<Box i={i} j={j+0.2} w={w} d={0.2} z={H} h={8} front={col} side={shade(col,-0.25)} top={shade(col,0.2)}/>
  <g transform={faceI(i+0.12,j+0.4,H+2.2)}><text fontSize="5.2" fill="#fff" fontWeight="600" letterSpacing=".3">{t.name.toUpperCase()}</text></g>
  {selected&&<Sel i={i} j={j} h={H+8}/>}</g>;}
function Sel({i,j,h}){return <polygon points={iso([i-0.1,j-0.1],[i+SH.w+0.1,j-0.1],[i+SH.w+0.1,j+SH.d+0.1],[i-0.1,j+SH.d+0.1])} fill="none" stroke="#e8b84a" strokeWidth="2.5" strokeDasharray="6 4"><animate attributeName="stroke-dashoffset" values="0;20" dur="1s" repeatCount="indefinite"/></polygon>;}
function EmptySlot({pos,canBuy}){const{i,j}=pos;const[x,y]=P(i+SH.w/2,j+SH.d/2);return <g><polygon points={iso([i,j],[i+SH.w,j],[i+SH.w,j+SH.d],[i,j+SH.d])} fill={canBuy?'rgba(232,184,74,.12)':'rgba(0,0,0,.06)'} stroke={canBuy?'#e8b84a':'#9aa1a7'} strokeWidth="1.4" strokeDasharray="5 4"/>
 <circle cx={x} cy={y} r="9" fill={canBuy?'#e8b84a':'#9aa1a7'}/><path d={`M${x-4} ${y}h8M${x} ${y-4}v8`} stroke="#14171c" strokeWidth="2"/></g>;}

// ---------- Kasse ----------
function Checkout({pos,staffed,classic,queue,k}){const{i,j}=pos;if(classic){return <g><Shadow i={i-0.4} j={j} w={2} d={0.9}/><Box i={i-0.4} j={j} w={2} d={0.9} h={26} front="#6b4a30" side="#563b26" top="#8a6440"/>
  <Box i={i+0.6} j={j+0.15} w={0.6} d={0.5} z={26} h={10} front="#b8913a" side="#8a6c2a" top="#d4ad4a"/>{(()=>{const[x,y]=P(i+0.5,j-0.5);return <Person x={x} y={y} k={6} apron/>;})()}
  {Array.from({length:queue},(_,q)=>{const[x,y]=P(i+0.4-q*0.1,j+1.5+q*0.7);return <Person key={q} x={x} y={y} k={q+k+1} basket/>;})}</g>;}
 return <g><Shadow i={i} j={j} w={1.5} d={0.75}/><Box i={i} j={j} w={1.5} d={0.75} h={18} front="#d7dbde" side="#b7bcc0" top="#2a2f35"/>
  <polygon points={iso([i+0.1,j+0.15,18.5],[i+1.1,j+0.15,18.5],[i+1.1,j+0.6,18.5],[i+0.1,j+0.6,18.5])} fill="#15181c"/><Box i={i+1.15} j={j+0.1} w={0.3} d={0.3} z={18} h={9} front="#3a3f45"/>
  {(()=>{const[x,y]=P(i+1.3,j-0.35);return staffed?<Person x={x} y={y} k={6} apron/>:null;})()}
  {(()=>{const[x,y]=P(i+0.75,j-0.1,30);return <g><rect x={x-5} y={y-6} width="10" height="7" rx="1.5" fill={staffed?'#1f5f4a':'#6b7378'}/><text x={x} y={y-0.5} fontSize="5" fill="#fff" textAnchor="middle" fontWeight="700">{k+1}</text></g>;})()}
  {staffed&&Array.from({length:queue},(_,q)=>{const[x,y]=P(i+0.3-q*0.05,j+1.35+q*0.7);return <Person key={q} x={x} y={y} k={q+k*3+2} basket/>;})}</g>;}

// ---------- Gesamter Laden ----------
export default function StoreScene({g,registers,activity,selected,onShelf,onSlot,onCheckout,canBuyShelf}){const L=storeLayout(g.tier),t=tierOf(g.tier),classic=CLASSIC.includes(g.tier);
 const [x0]=P(0,L.d),[x1]=P(L.w,0),[,y0]=P(0,0,WALL_H+40),[,y1]=P(L.w,L.d);const vb=`${x0-50} ${y0-20} ${x1-x0+100} ${y1-y0+70}`;
 const capOf=type=>Math.round(shelfType(type).cap*t.stockFactor);
 // Kunden pro Gang: je mehr Betrieb, desto mehr Personen sind unterwegs
 const walkers=[];const perAisle=g.phase==='open'?Math.min(4,Math.max(1,Math.round(activity))):0;
 for(let r=0;r<L.rows;r++){const jj=L.slots.find(s=>s.row===r).j+SH.d+0.65;const a=P(0.5,jj),b=P(L.w-0.6,jj);
  for(let k=0;k<perAisle;k++){const dur=16+((r*7+k*5)%9);walkers.push({row:r,el:<Walker key={r+'-'+k} k={r*3+k} dur={dur} begin={-(k*dur/perAisle+r*2)} path={`M${a[0].toFixed(0)} ${a[1].toFixed(0)} L${b[0].toFixed(0)} ${b[1].toFixed(0)} L${a[0].toFixed(0)} ${a[1].toFixed(0)}`}/>});}}
 const queuePer=Math.min(3,Math.round((g.queue||0)/Math.max(1,registers)));
 return <svg className="scene" viewBox={vb} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Verkaufsraum: ${t.name}`}>
  <Defs/><Room tierId={g.tier} w={L.w} d={L.d} name={t.name}/>
  {Array.from({length:L.rows},(_,r)=><g key={r}>
   {L.slots.map((p,k)=>p.row!==r?null:<g key={k} className="hit" onClick={()=>g.shelves[k]?onShelf(k):onSlot(k)}>{g.shelves[k]?<ShelfUnit type={g.shelves[k].type} facings={g.shelves[k].facings} pos={p} cap={capOf(g.shelves[k].type)} selected={selected===k} tierId={g.tier}/>:<EmptySlot pos={p} canBuy={canBuyShelf}/>}</g>)}
   {walkers.filter(w=>w.row===r).map(w=>w.el)}</g>)}
  {/* Kassenzone */}
  {L.checkouts.slice().reverse().map((c,k)=>{const idx=L.checkouts.length-1-k;return <g key={idx} className="hit" onClick={onCheckout}><Checkout pos={c} staffed={idx<registers} classic={classic} queue={g.phase==='open'?queuePer:0} k={idx}/></g>;})}
  {/* Eingang */}{(()=>{const{i,j}=L.door;return <g><polygon points={iso([i-0.8,j-0.05],[i+0.6,j-0.05],[i+0.6,j+0.6],[i-0.8,j+0.6])} fill={classic?'#5b3c27':'#3a3f45'}/><polygon points={iso([i-0.7,j-0.6],[i+0.5,j-0.6],[i+0.5,j-0.05],[i-0.7,j-0.05])} fill="#2a2f35" opacity=".55"/></g>;})()}
  {/* Pflanze */}{(()=>{const[x,y]=P(L.w-0.4,0.5);return <g><rect x={x-6} y={y-12} width="12" height="12" rx="2" fill={classic?'#8a5a3a':'#3a3f45'}/><circle cx={x-4} cy={y-20} r="7" fill="#3f6f3a"/><circle cx={x+4} cy={y-22} r="7" fill="#4a7f42"/><circle cx={x} cy={y-28} r="7" fill="#568f4a"/></g>;})()}
 </svg>;}

// Kleine Vorschau einer Ladenstufe (leerer Raum mit Regalplätzen und Kassen)
export function RoomPreview({tierId}){const L=storeLayout(tierId),t=tierOf(tierId),classic=CLASSIC.includes(tierId);const [x0]=P(0,L.d),[x1]=P(L.w,0),[,y0]=P(0,0,WALL_H+10),[,y1]=P(L.w,L.d);
 return <svg className="preview" viewBox={`${x0-20} ${y0-10} ${x1-x0+40} ${y1-y0+40}`} role="img" aria-label={`Vorschau ${t.name}`}><Defs/><Room tierId={tierId} w={L.w} d={L.d} name={t.name}/>
  {L.slots.map((p,k)=><polygon key={k} points={iso([p.i,p.j],[p.i+SH.w,p.j],[p.i+SH.w,p.j+SH.d],[p.i,p.j+SH.d])} fill="rgba(232,184,74,.18)" stroke="#e8b84a" strokeWidth="1.5" strokeDasharray="5 4"/>)}
  {L.checkouts.map((c,k)=>classic?<Box key={k} i={c.i-0.4} j={c.j} w={2} d={0.9} h={26} front="#6b4a30" side="#563b26" top="#8a6440"/>:<Box key={k} i={c.i} j={c.j} w={1.5} d={0.75} h={18} front="#d7dbde" side="#b7bcc0" top="#2a2f35"/>)}</svg>;}
