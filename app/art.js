'use client';
// Wirtschaftssimulator 0.7 – gezeichnete Grafiken (SVG) für Waren, Regale, Äcker und Pflanzen.
// Alle Grafiken sind reine Vektorzeichnungen ohne fremde Bilddateien.
import {GOODS,CROPS} from '../lib/economy.mjs';

const rnd=seed=>{let x=Math.sin(seed*999.13)*43758.5453;return x-Math.floor(x);};
const shade=(hex,amt)=>{const n=parseInt(hex.slice(1),16),c=[n>>16,n>>8&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v+amt*255))));return '#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');};

// Gemeinsame Verläufe und Schatten – einmal im Dokument eingebunden.
export function ArtDefs(){return <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true"><defs>
 <linearGradient id="ws-wood" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d9b382"/><stop offset=".45" stopColor="#c49865"/><stop offset="1" stopColor="#9c7246"/></linearGradient>
 <linearGradient id="ws-wood-edge" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#e8c899"/><stop offset="1" stopColor="#b48654"/></linearGradient>
 <linearGradient id="ws-back" x1="0" x2="1"><stop offset="0" stopColor="#d7cfbf"/><stop offset=".5" stopColor="#ece6da"/><stop offset="1" stopColor="#d2c9b8"/></linearGradient>
 <linearGradient id="ws-metal" x1="0" x2="1"><stop offset="0" stopColor="#1e1f21"/><stop offset=".5" stopColor="#4a4c50"/><stop offset="1" stopColor="#1b1c1e"/></linearGradient>
 <linearGradient id="ws-glass" x1="0" x2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".55"/><stop offset=".3" stopColor="#ffffff" stopOpacity=".08"/><stop offset=".75" stopColor="#ffffff" stopOpacity=".02"/><stop offset="1" stopColor="#ffffff" stopOpacity=".35"/></linearGradient>
 <linearGradient id="ws-sheen" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".18"/><stop offset=".35" stopColor="#fff" stopOpacity=".22"/><stop offset=".6" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".22"/></linearGradient>
 <linearGradient id="ws-sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8ec3ea"/><stop offset=".7" stopColor="#cfe6f5"/><stop offset="1" stopColor="#eef4e8"/></linearGradient>
 <linearGradient id="ws-soil" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6d5236"/><stop offset="1" stopColor="#4a3523"/></linearGradient>
 <linearGradient id="ws-soil-dry" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8a6b48"/><stop offset="1" stopColor="#5d4430"/></linearGradient>
 <linearGradient id="ws-foil" x1="0" x2="1"><stop offset="0" stopColor="#f4f6f7"/><stop offset=".5" stopColor="#ffffff" stopOpacity=".55"/><stop offset="1" stopColor="#dfe6ea"/></linearGradient>
 <radialGradient id="ws-round" cx=".35" cy=".3" r=".75"><stop offset="0" stopColor="#fff" stopOpacity=".55"/><stop offset=".45" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".28"/></radialGradient>
 <filter id="ws-shadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6"/></filter>
</defs></svg>;}

// ---------- Warenzeichnungen (Ursprung: unten Mitte, Breite ca. 40, Höhe je nach Form) ----------
const label=(x,y,w,h,text,bg='#fffdf6',fg='#3b2f22',size=5)=><g><rect x={x} y={y} width={w} height={h} rx="1.5" fill={bg}/><text x={x+w/2} y={y+h/2+size*.36} fontSize={size} fontWeight="700" fill={fg} textAnchor="middle" fontFamily="Arial">{text}</text></g>;
const dots=(n,cx,cy,rx,ry,r,color,seed=1,stroke)=>Array.from({length:n},(_,i)=>{const a=rnd(seed+i)*Math.PI*2,d=Math.sqrt(rnd(seed+i*7.1));return <circle key={i} cx={cx+Math.cos(a)*rx*d} cy={cy+Math.sin(a)*ry*d} r={r*(0.85+rnd(i+seed*3)*.3)} fill={color} stroke={stroke||shade(color,-.18)} strokeWidth=".5"/>;});
function Bag({color='#c9a46c',window,fill,text,mesh}){return <g><path d="M-17 0 L-19 -46 Q-19 -52 -14 -52 L14 -52 Q19 -52 19 -46 L17 0 Z" fill={color} stroke={shade(color,-.2)} strokeWidth=".8"/><path d="M-14 -52 L-12 -57 L12 -57 L14 -52Z" fill={shade(color,-.12)}/>{window&&<g><rect x="-11" y="-36" width="22" height="24" rx="3" fill="#fff" opacity=".35"/>{dots(9,0,-24,9,10,4,fill,3)}</g>}{text&&label(-13,-48,26,9,text)}<rect x="-19" y="-52" width="38" height="52" fill="url(#ws-sheen)" opacity=".6"/></g>;}
function Net({fill='#c9862e',net='#c0392b'}){return <g>{dots(10,0,-20,13,15,6,fill,5)}{Array.from({length:7},(_,i)=><path key={i} d={`M${-16+i*5} -40 L${-12+i*5} 0`} stroke={net} strokeWidth=".9" opacity=".8"/>)}{Array.from({length:7},(_,i)=><path key={'h'+i} d={`M-16 ${-36+i*5.5} Q0 ${-33+i*5.5} 16 ${-36+i*5.5}`} stroke={net} strokeWidth=".9" fill="none" opacity=".8"/>)}<path d="M-4 -42 L0 -48 L4 -42" fill={net}/>{label(-9,-12,18,7,'1 kg','#fff','#c0392b',4.5)}</g>;}
function Tray({fill,size=3.2,count=16,leaf}){return <g><path d="M-19 0 L-21 -18 L21 -18 L19 0Z" fill="#f2f4f2" stroke="#c8d1cf" strokeWidth=".8"/>{dots(count,0,-20,16,5,size,fill,9)}{leaf&&<path d="M-5 -24 q5 -6 10 0 q-5 3 -10 0" fill={leaf}/>}<path d="M-21 -18 L21 -18 L19 0 L-19 0Z" fill="url(#ws-glass)"/><rect x="-19" y="-9" width="38" height="5" fill="#fff" opacity=".7"/></g>;}
function Jar({fill,lid='#c0392b',check=true,text}){return <g><rect x="-13" y="-38" width="26" height="38" rx="4" fill={fill}/><rect x="-13" y="-38" width="26" height="38" rx="4" fill="url(#ws-round)"/><rect x="-14" y="-45" width="28" height="8" rx="2" fill={lid}/><path d="M-14 -43 h28" stroke="#fff" strokeOpacity=".5" strokeWidth="1"/>{label(-11,-28,22,12,text||'',`#fffaf0`,'#5a3b1a',4.2)}<rect x="-10" y="-36" width="4" height="30" rx="2" fill="#fff" opacity=".35"/></g>;}
function Bottle({fill='#c98b1d',cap='#2e7d32',tall=1,text,clear}){const h=50*tall;return <g><path d={`M-9 0 L-9 ${-h+14} Q-9 ${-h+6} -4 ${-h+2} L-4 ${-h-4} L4 ${-h-4} L4 ${-h+2} Q9 ${-h+6} 9 ${-h+14} L9 0Z`} fill={fill} opacity={clear?.55:1} stroke={shade(fill,-.25)} strokeWidth=".6"/><rect x="-4.5" y={-h-8} width="9" height="5" rx="1" fill={cap}/>{label(-8,-h*0.55,16,h*0.28,text||'','#fff','#333',3.8)}<rect x="-7" y={-h+12} width="3" height={h-16} rx="1.5" fill="#fff" opacity=".4"/></g>;}
function Carton({color='#1e74b8',text='Milch',top='#ffffff'}){return <g><path d="M-12 0 L-12 -44 L0 -50 L12 -44 L12 0Z" fill={top}/><path d="M-12 -44 L0 -50 L12 -44 L0 -38Z" fill={shade(top,-.08)}/><rect x="-12" y="-38" width="24" height="38" fill={top}/><path d="M-12 -28 Q0 -34 12 -28 L12 0 L-12 0Z" fill={color}/><text x="0" y="-12" fontSize="6" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Arial">{text}</text><rect x="-12" y="-44" width="24" height="44" fill="url(#ws-sheen)" opacity=".5"/><rect x="2" y="-53" width="5" height="4" fill="#e3e3e3"/></g>;}
function Cup({color='#f6f1e6',band='#4f8ec9',text}){return <g><path d="M-12 -24 L-10 0 L10 0 L12 -24Z" fill={color} stroke="#d6d0c2" strokeWidth=".6"/><ellipse cx="0" cy="-24" rx="12.5" ry="3" fill="#e8ecef"/><rect x="-11.5" y="-18" width="23" height="8" fill={band}/><text x="0" y="-12.3" fontSize="4.6" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Arial">{text}</text><path d="M-12 -24 L-10 0 L10 0 L12 -24Z" fill="url(#ws-sheen)" opacity=".5"/></g>;}
function Eggs({color='#e7cfaa',box='#cbbf9e'}){return <g><path d="M-22 0 L-24 -14 L24 -14 L22 0Z" fill={box} stroke={shade(box,-.2)} strokeWidth=".6"/>{[-15,-5,5,15].map((x,i)=><ellipse key={i} cx={x} cy="-16" rx="4.6" ry="5.6" fill={color} stroke={shade(color,-.15)} strokeWidth=".5"/>)}{[-15,-5,5,15].map((x,i)=><ellipse key={'h'+i} cx={x-1.3} cy="-18" rx="1.4" ry="2" fill="#fff" opacity=".5"/>)}<path d="M-24 -14 L24 -14 L23 -22 L-23 -22Z" fill={shade(box,.06)} opacity=".35"/></g>;}
function Loaf(){return <g><path d="M-20 0 Q-24 -16 -8 -22 Q4 -26 16 -20 Q24 -14 20 0Z" fill="#a8672d"/><path d="M-20 0 Q-24 -16 -8 -22 Q4 -26 16 -20 Q24 -14 20 0Z" fill="url(#ws-round)"/>{[-10,-2,6].map((x,i)=><path key={i} d={`M${x} -18 q4 6 8 0`} stroke="#e9c48c" strokeWidth="1.6" fill="none"/>)}</g>;}
function Bun(){return <g>{[-9,9].map((x,i)=><g key={i}><ellipse cx={x} cy="-7" rx="9" ry="7" fill="#c98a45"/><ellipse cx={x} cy="-7" rx="9" ry="7" fill="url(#ws-round)"/><path d={`M${x-5} -8 q5 -4 10 0`} stroke="#f0d3a4" strokeWidth="1.3" fill="none"/></g>)}</g>;}
function Cake(){return <g><rect x="-20" y="-16" width="40" height="16" rx="2" fill="#e5b778"/><rect x="-20" y="-20" width="40" height="6" rx="2" fill="#7b3f1d"/>{dots(10,0,-20,16,1.5,1.6,'#c0392b',11,'#8e2a1f')}<rect x="-20" y="-20" width="40" height="20" fill="url(#ws-sheen)" opacity=".4"/></g>;}
function Butter(){return <g><path d="M-18 0 L-18 -10 L-12 -16 L18 -16 L18 -6 L12 0Z" fill="#e9c234"/><path d="M-18 -10 L-12 -16 L18 -16 L12 -10Z" fill="#f7da59"/><path d="M12 -10 L18 -16 L18 -6 L12 0Z" fill="#c9a221"/><rect x="-18" y="-10" width="30" height="10" fill="#e9c234"/>{label(-14,-8,22,6,'Butter','#2e6fb7','#fff',4.2)}</g>;}
function Cheese(){return <g><path d="M-20 0 L-20 -14 L18 -24 L20 -10 L20 0Z" fill="#f1c447"/><path d="M-20 -14 L18 -24 L20 -10 L-20 0Z" fill="#f6d35f" opacity=".5"/><path d="M-20 0 L-20 -14 L-17 -14.6 L-17 0Z" fill="#b4342b"/>{dots(5,2,-8,12,4,1.8,'#d9a52e',13,'#c39023')}</g>;}
function MeatTray({meat='#d8707a',fat='#f4d3cf',text}){return <g><path d="M-21 0 L-23 -12 L23 -12 L21 0Z" fill="#1d1d1d"/><path d="M-18 -12 Q-14 -24 0 -22 Q14 -24 18 -12Z" fill={meat}/><path d="M-12 -15 Q0 -20 12 -15" stroke={fat} strokeWidth="2" fill="none"/><path d="M-23 -12 L23 -12 L21 0 L-21 0Z" fill="url(#ws-glass)"/>{label(4,-10,17,7,text||'kg','#fff','#333',3.8)}</g>;}
function Sausage(){return <g>{[-12,0,12].map((x,i)=><g key={i}><rect x={x-5} y="-30" width="10" height="30" rx="5" fill="#9b3a2d"/><rect x={x-5} y="-30" width="10" height="30" rx="5" fill="url(#ws-sheen)" opacity=".6"/></g>)}<path d="M-18 -16 h36" stroke="#fff" strokeWidth="2" opacity=".85"/></g>;}
function Sack({color='#b79a6a',text}){return <g><path d="M-20 0 Q-24 -24 -16 -40 L-10 -44 L10 -44 L16 -40 Q24 -24 20 0Z" fill={color} stroke={shade(color,-.22)} strokeWidth=".8"/><path d="M-10 -44 Q0 -48 10 -44 L8 -49 L-8 -49Z" fill={shade(color,-.1)}/><path d="M-12 -44 h24" stroke="#7a5b33" strokeWidth="1.5"/>{Array.from({length:6},(_,i)=><path key={i} d={`M-18 ${-6-i*6} q18 2 36 0`} stroke={shade(color,-.12)} strokeWidth=".5" fill="none"/>)}{text&&label(-12,-28,24,10,text,'#f7f1e2','#5a4224',4.6)}</g>;}
function Crate({fill,small=4}){return <g><rect x="-21" y="-16" width="42" height="16" fill="#c79a5c" stroke="#8d6a3c" strokeWidth=".8"/>{[-14,0,14].map(x=><rect key={x} x={x-1} y="-16" width="2" height="16" fill="#8d6a3c" opacity=".5"/>)}{dots(14,0,-18,18,5,small,fill,17)}</g>;}
function Head({color='#7cb342',inner,size=1}){return <g transform={`scale(${size})`}><ellipse cx="0" cy="-11" rx="15" ry="11" fill={shade(color,-.1)}/>{[-9,9,-4,4].map((x,i)=><path key={i} d={`M${x} -4 Q${x*1.8} -18 ${x*.4} -22 Q${x*.1} -12 ${x} -4Z`} fill={shade(color,.05*i)} opacity=".95"/>)}{inner&&<circle cx="0" cy="-13" r="7.5" fill={inner}/>}<ellipse cx="0" cy="-11" rx="15" ry="11" fill="url(#ws-round)"/></g>;}
function Florets(){return <g><Head color="#7a9e5a"/>{dots(9,0,-15,7,5,3.2,'#f4f0dd',19,'#d8d0b0')}</g>;}
function Broccoli(){return <g><rect x="-3" y="-12" width="6" height="12" fill="#9cc177"/>{dots(10,0,-18,10,7,4,'#2f6b2f',23,'#1f4f1f')}</g>;}
function Kohlrabi(){return <g><circle cx="0" cy="-11" r="10" fill="#c5e1a5"/><circle cx="0" cy="-11" r="10" fill="url(#ws-round)"/>{[-6,0,6].map(x=><path key={x} d={`M${x*.5} -20 Q${x} -30 ${x*1.6} -36`} stroke="#6b9e45" strokeWidth="1.6" fill="none"/>)}{[-6,0,6].map(x=><ellipse key={'l'+x} cx={x*1.6} cy="-37" rx="4" ry="2.5" fill="#6b9e45"/>)}</g>;}
function Long({color='#3f7d35',len=40,thick=8,stripes}){return <g transform="rotate(-8)"><rect x={-len/2} y={-thick-2} width={len} height={thick} rx={thick/2} fill={color}/>{stripes&&Array.from({length:5},(_,i)=><path key={i} d={`M${-len/2+6+i*7} ${-thick} h4`} stroke={shade(color,.18)} strokeWidth="1"/>)}<rect x={-len/2} y={-thick-2} width={len} height={thick} rx={thick/2} fill="url(#ws-sheen)" opacity=".6"/><rect x={len/2-3} y={-thick/2-3} width="4" height="3" fill="#6d8f3a"/></g>;}
function Pumpkin(){return <g>{[-7,0,7].map((x,i)=><ellipse key={i} cx={x} cy="-11" rx="9" ry="11" fill={i===1?'#e8792b':'#d9681f'}/>)}<ellipse cx="0" cy="-11" rx="16" ry="11" fill="url(#ws-round)"/><path d="M0 -21 q2 -6 5 -7" stroke="#6b5a2b" strokeWidth="2.4" fill="none"/></g>;}
function Pepper(){return <g><path d="M-11 -2 Q-15 -20 -6 -24 Q0 -26 6 -24 Q15 -20 11 -2 Q6 2 0 0 Q-6 2 -11 -2Z" fill="#d32f2f"/><path d="M-11 -2 Q-15 -20 -6 -24 Q0 -26 6 -24 Q15 -20 11 -2 Q6 2 0 0 Q-6 2 -11 -2Z" fill="url(#ws-round)"/><path d="M0 -24 q0 -5 3 -6" stroke="#3b7d2c" strokeWidth="2.6" fill="none"/></g>;}
function Bunch({head,leaf='#5a9a3c',band='#d32f2f',count=7,headR=4.2,stem='#7fae55'}){return <g>{Array.from({length:count},(_,i)=>{const x=-12+i*(24/(count-1));return <g key={i}><path d={`M${x*.4} -14 Q${x*.7} -26 ${x} -34`} stroke={stem} strokeWidth="1.3" fill="none"/><path d={`M${x} -34 q-4 -7 0 -10 q4 3 0 10`} fill={leaf}/></g>;})}{dots(count,0,-8,10,4,headR,head,29)}<rect x="-5" y="-17" width="10" height="3" fill={band}/></g>;}
function Flowers({color='#e53950',wrap='#f3ece0',tulip,lav}){return <g><path d="M-14 0 L-20 -30 L20 -30 L14 0Z" fill={wrap} stroke="#d8ccb3" strokeWidth=".6"/>{Array.from({length:lav?11:7},(_,i)=>{const x=-15+i*(30/(lav?10:6)),h=36+rnd(i+41)*8;return <g key={i}><path d={`M${x*.3} -12 L${x} ${-h}`} stroke="#4c8a3a" strokeWidth="1.2"/>{lav?<rect x={x-1.4} y={-h-10} width="2.8" height="11" rx="1.4" fill={color}/>:tulip?<path d={`M${x-3.5} ${-h} q0 -7 3.5 -8 q3.5 1 3.5 8 q-3.5 2 -7 0`} fill={color}/>:<circle cx={x} cy={-h-2} r="4" fill={color} stroke={shade(color,-.2)}/>}</g>;})}<path d="M-20 -30 L20 -30 L14 0 L-14 0Z" fill="url(#ws-sheen)" opacity=".5"/><path d="M-12 -12 h24" stroke="#c9a46c" strokeWidth="2"/></g>;}
function Asparagus(){return <g>{Array.from({length:9},(_,i)=><rect key={i} x={-12+i*3} y="-40" width="2.8" height="40" rx="1.4" fill={i%3?'#f0ead2':'#e4dcb8'}/>)}{Array.from({length:9},(_,i)=><path key={'t'+i} d={`M${-12+i*3} -40 l1.4 -3 l1.4 3`} fill="#cdbf8f"/>)}<rect x="-14" y="-14" width="28" height="5" fill="#2e7d32"/></g>;}
function Coffee(){return <g><path d="M-13 0 L-13 -40 L13 -40 L13 0Z" fill="#3e2a1e"/><path d="M-13 -40 L-10 -45 L10 -45 L13 -40Z" fill="#2b1d14"/>{label(-11,-30,22,14,'Kaffee','#c89b5d','#2b1d14',4.6)}<rect x="-13" y="-45" width="26" height="45" fill="url(#ws-sheen)" opacity=".7"/></g>;}
function Candle(){return <g><rect x="-8" y="-34" width="16" height="34" rx="2" fill="#e7b84a"/><rect x="-8" y="-34" width="16" height="34" rx="2" fill="url(#ws-sheen)" opacity=".7"/><path d="M0 -34 v-4" stroke="#333" strokeWidth="1"/><path d="M0 -38 q-3 -4 0 -8 q3 4 0 8" fill="#ffb300"/></g>;}
function Soap(){return <g><rect x="-16" y="-12" width="32" height="12" rx="3" fill="#b39ddb"/><rect x="-10" y="-12" width="12" height="12" fill="#f6f1e8"/><text x="-4" y="-4" fontSize="4" fontWeight="800" fill="#6a4fa3" textAnchor="middle" fontFamily="Arial">Seife</text><rect x="-16" y="-12" width="32" height="12" rx="3" fill="url(#ws-sheen)" opacity=".5"/></g>;}
function Cloth(){return <g><rect x="-20" y="-16" width="40" height="16" rx="8" fill="#d8cdb6"/>{Array.from({length:6},(_,i)=><path key={i} d={`M${-14+i*6} -16 v16`} stroke="#bfb193" strokeWidth=".8"/>)}<ellipse cx="20" cy="-8" rx="4" ry="8" fill="#c7b999"/><ellipse cx="20" cy="-8" rx="1.5" ry="3" fill="#9e8f6e"/></g>;}
function WoolBale(){return <g>{dots(9,0,-12,16,10,6,'#ece4d4',31,'#d0c6b0')}</g>;}
function SeedPacket({cropId}){return <g><rect x="-15" y="-44" width="30" height="44" rx="1.5" fill="#f5eedf" stroke="#cdbf9f" strokeWidth=".8"/><rect x="-12" y="-40" width="24" height="24" rx="1" fill="#cfe3b8"/><g transform="translate(0 -18) scale(.42)"><PlantIcon cropId={cropId}/></g>{label(-12,-13,24,8,'1 ha','#2e7d32','#fff',4.4)}</g>;}

const JAM={strawberryJam:['#c62828','#c0392b'],raspberryJam:['#ad1457','#8e244d'],blueberryJam:['#3b2f6b','#3949ab'],appleJam:['#e0a32e','#6d4c41']};
const TRAY={strawberryTray:['#d7263d',3.2,15,'#4caf50'],raspberryTray:['#c2185b',2.6,22],blueberryTray:['#3f4a8a',2.2,30],cherryTray:['#8e0e1a',3,16],tomatoTray:['#e53935',4.2,10,'#3b7d2c'],grapeTray:['#7cb342',2.8,22]};
const BAGFRUIT={potatoBag:['#c9a46c','#d9b46f','2,5 kg'],carrotBag:['#ffffff','#ef7d1a','1 kg'],appleBag:['#ffffff','#c62828','1 kg'],pearBag:['#ffffff','#b5c22b','1 kg'],plumBag:['#ffffff','#5b2a63','1 kg'],riceBag:['#f6f3ec',null,'Reis']};
const RAW={wheat:'#d8b45a',ryeGrain:'#a9895a',barleyGrain:'#e1c47a',triticaleGrain:'#c9a85e',speltGrain:'#c79f5d',oat:'#e6d6a3',corn:'#f2c12e',rapeseed:'#333',sunflower:'#555',pea:'#c7b55a',fababean:'#9a7b4f',soy:'#e3cf96',rice:'#f3eedf',coffeeBean:'#6b8f47',feed:'#a88a5a',beet:'#e9dcc3',hops:'#a7c46b'};
const CRATE={potato:'#c9a15f',carrot:'#ef7d1a',onion:'#c9862e',lettuce:'#7cb342',radish:'#d32f2f',cucumber:'#3f7d35',kohlrabi:'#c5e1a5',cabbage:'#b7d58f',redcabbage:'#6a2c70',cauliflower:'#f4f0dd',broccoli:'#2f6b2f',zucchini:'#2f5e2a',pumpkin:'#e8792b',tomato:'#e53935',pepper:'#d32f2f',strawberry:'#d7263d',raspberry:'#c2185b',blueberry:'#3f4a8a',apple:'#c62828',pear:'#b5c22b',cherry:'#8e0e1a',plum:'#5b2a63',grape:'#7cb342',asparagus:'#f0ead2',tulip:'#e53950',rose:'#c2185b',lavender:'#8e6cc4',flax:'#c9b37f',tobacco:'#9b7b3c'};
export function ProductShape({id}){
 const p=GOODS.find(g=>g.id===id);if(!p)return <Sack/>;
 if(p.seed)return <SeedPacket cropId={CROPS.find(c=>c.seed===id)?.id}/>;
 if(JAM[id])return <Jar fill={JAM[id][0]} lid={JAM[id][1]} text="Konfitüre"/>;
 if(TRAY[id]){const [c,s,n,l]=TRAY[id];return <Tray fill={c} size={s} count={n} leaf={l}/>;}
 if(BAGFRUIT[id]){const [c,f,t]=BAGFRUIT[id];return <Bag color={c} window={!!f} fill={f} text={t}/>;}
 switch(id){
  case 'onionNet':return <Net/>;
  case 'lettuceHead':return <Head color="#8bc34a"/>;case 'cabbageHead':return <Head color="#b7d58f" inner="#d7e8b5"/>;case 'redcabbageHead':return <Head color="#6a2c70" inner="#8e4b8f"/>;
  case 'cauliflowerHead':return <Florets/>;case 'broccoliPiece':return <Broccoli/>;case 'kohlrabiPiece':return <Kohlrabi/>;
  case 'cucumberPiece':return <Long color="#3f7d35" stripes/>;case 'zucchiniPiece':return <Long color="#2f5e2a" len={34} thick={9}/>;case 'pumpkinPiece':return <Pumpkin/>;case 'pepperPiece':return <Pepper/>;
  case 'radishBunch':return <Bunch head="#d32f2f"/>;case 'asparagusBunch':return <Asparagus/>;
  case 'tulipBunch':return <Flowers color="#e53950" tulip/>;case 'roseBunch':return <Flowers color="#b0103a"/>;case 'lavenderBouquet':return <Flowers color="#8e6cc4" lav wrap="#efe6d6"/>;
  case 'bread':return <Loaf/>;case 'bun':return <Bun/>;case 'cake':return <Cake/>;
  case 'flour':return <Bag color="#f7f4ec" text="Mehl"/>;case 'sugar':return <Bag color="#ffffff" text="Zucker"/>;case 'salt':return <Cup color="#ffffff" band="#1565c0" text="Salz"/>;case 'pasta':return <Bag color="#ffffff" window fill="#f2c94c" text="Nudeln"/>;
  case 'milk':return <Carton/>;case 'goatMilk':return <Carton color="#2e7d32" text="Ziege"/>;case 'cream':return <Cup band="#c62828" text="Sahne"/>;case 'yogurt':return <Cup band="#4f8ec9" text="Joghurt"/>;
  case 'butter':return <Butter/>;case 'cheese':return <Cheese/>;case 'egg':return <Eggs/>;case 'duckEgg':return <Eggs color="#e8eee6"/>;
  case 'meat':return <MeatTray text="Schwein"/>;case 'beef':return <MeatTray meat="#a83a3a" text="Rind"/>;case 'poultryMeat':return <MeatTray meat="#f0b9a5" fat="#fbe3d8" text="Hähnchen"/>;case 'rabbitMeat':return <MeatTray meat="#e6a29b" text="Kaninchen"/>;case 'sausage':return <Sausage/>;
  case 'juice':return <Bottle fill="#e3a21a" text="Saft"/>;case 'mineralWater':return <Bottle fill="#b9e0f5" cap="#1565c0" tall={1.15} text="Wasser" clear/>;case 'oil':return <Bottle fill="#f2c12e" cap="#2e7d32" text="Öl"/>;
  case 'honey':return <Jar fill="#d8901a" lid="#f2c94c" text="Honig"/>;case 'coffee':return <Coffee/>;case 'candle':return <Candle/>;case 'soap':return <Soap/>;case 'cloth':return <Cloth/>;case 'wool':return <WoolBale/>;case 'wax':return <Crate fill="#e7b84a" small={5}/>;case 'water':return <Bottle fill="#b9e0f5" cap="#90a4ae" clear text=""/>;
 }
 if(RAW[id])return <Sack color={id==='feed'?'#a88a5a':'#b79a6a'} text={p.name.slice(0,10)}/>;
 if(CRATE[id])return <Crate fill={CRATE[id]}/>;
 return <Sack text={p.name.slice(0,10)}/>;
}
export function ProductArt({id,size=70,title}){return <svg viewBox="-30 -62 60 66" width={size} height={size*1.1} role="img" aria-label={title||GOODS.find(g=>g.id===id)?.name||'Ware'}><ellipse cx="0" cy="1" rx="22" ry="3" fill="#000" opacity=".18" filter="url(#ws-shadow)"/><ProductShape id={id}/></svg>;}

// ---------- Regal ----------
export function ShelfArt({productId,quantity,max,price}){
 const facings=4,rows=3,cap=facings*rows,shown=quantity?Math.max(1,Math.ceil(quantity/max*cap)):0;
 const boardY=[62,122,182];
 return <svg viewBox="0 0 260 215" className="shelf-svg" role="img" aria-label={quantity?`${quantity} Stück im Regal`:'Leeres Regal'}>
  <rect x="0" y="0" width="260" height="215" fill="url(#ws-back)"/>
  {Array.from({length:12},(_,i)=><circle key={i} cx={28+i*18.5} cy="10" r="1.4" fill="#b9ae99"/>)}
  <rect x="10" y="0" width="7" height="205" fill="url(#ws-metal)"/><rect x="243" y="0" width="7" height="205" fill="url(#ws-metal)"/>
  {boardY.map((y,r)=><g key={y}>
   <rect x="17" y={y-52} width="226" height="52" fill="#000" opacity=".04"/>
   {Array.from({length:facings},(_,f)=>{const n=r*facings+f;if(n>=shown)return null;const x=45+f*57;return <g key={f}><g transform={`translate(${x+5} ${y-2}) scale(1.05)`} opacity=".72"><ProductShape id={productId}/></g><g transform={`translate(${x} ${y}) scale(1.1)`}><ellipse cx="0" cy="0" rx="21" ry="2.5" fill="#000" opacity=".22" filter="url(#ws-shadow)"/><ProductShape id={productId}/></g></g>;})}
   <rect x="14" y={y} width="232" height="9" fill="url(#ws-wood)"/><rect x="14" y={y} width="232" height="2" fill="url(#ws-wood-edge)"/>
   <rect x="14" y={y+9} width="232" height="4" fill="#000" opacity=".12"/>
   {price&&quantity>r*facings*(max/cap)?<g><rect x="200" y={y+1.5} width="38" height="10" rx="1" fill="#fff8d6" stroke="#d6c06a" strokeWidth=".5"/><text x="219" y={y+9} fontSize="7" fontWeight="800" fill="#222" textAnchor="middle" fontFamily="Arial">{price}</text></g>:null}
  </g>)}
  {!quantity&&<text x="130" y="120" fontSize="11" fill="#8c7d69" textAnchor="middle" fontFamily="Arial">Freier Regalplatz</text>}
  <rect x="10" y="203" width="240" height="12" fill="url(#ws-metal)"/>
 </svg>;
}

// ---------- Pflanzen ----------
const HABIT={grain:'grain',rye:'grain',barley:'grain',oat:'grain',triticale:'grain',spelt:'grain',rice:'grain',corn:'corn',rapeseed:'rapeseed',sunflower:'sunflower',pea:'legume',fababean:'legume',soy:'legume',potato:'potato',beet:'beet',carrot:'carrot',onion:'onion',lettuce:'head',kohlrabi:'kohlrabi',cabbage:'head',redcabbage:'head',cauliflower:'head',broccoli:'head',radish:'radish',cucumber:'vine',zucchini:'vine',pumpkin:'vine',tomato:'greenhouse',pepper:'greenhouse',coffeePlant:'greenhouse',rose:'greenhouse',strawberry:'strawberry',raspberry:'bush',blueberry:'bush',apple:'tree',pear:'tree',cherry:'tree',plum:'tree',grape:'trellis',hops:'trellis',asparagus:'asparagus',tulip:'flower',lavender:'lavender',flax:'flax',tobaccoPlant:'tobacco'};
const FRUIT={apple:'#c62828',pear:'#c0ca33',cherry:'#8e0e1a',plum:'#5b2a63',raspberry:'#c2185b',blueberry:'#3f4a8a',grape:'#7cb342',hops:'#c5e1a5',tomato:'#e53935',pepper:'#d32f2f',coffeePlant:'#b71c1c',rose:'#c2185b',cucumber:'#3f7d35',zucchini:'#2f5e2a',pumpkin:'#e8792b',tulip:'#e53950',cabbage:'#cfe3a8',redcabbage:'#6a2c70',cauliflower:'#f4f0dd',broccoli:'#2f6b2f',lettuce:'#8bc34a'};
function Plant({cropId,s=1,ready,i=0}){
 const h=HABIT[cropId]||'legume',g=ready?'#5b8f35':'#4f9a3a',fruit=FRUIT[cropId];
 switch(h){
  case 'grain':{const col=ready?(cropId==='rye'?'#b8a072':'#d8b45a'):'#7fb049';return <g transform={`scale(${s})`}>{[-4,-1.5,1,3.5].map((x,k)=><g key={k}><path d={`M${x} 0 Q${x+.6} -12 ${x+1} -22`} stroke={col} strokeWidth="1.1" fill="none"/>{s>.6&&<ellipse cx={x+1.1} cy="-24" rx="1.4" ry="4" fill={col}/>}</g>)}</g>;}
  case 'corn':return <g transform={`scale(${s})`}><path d="M0 0 V-40" stroke="#6a9a3a" strokeWidth="2.4"/>{[-30,-20,-10].map((y,k)=><path key={k} d={`M0 ${y} Q${k%2?10:-10} ${y-4} ${k%2?14:-14} ${y+4}`} stroke="#6fae3f" strokeWidth="2" fill="none"/>)}{ready&&<ellipse cx="3" cy="-22" rx="2.6" ry="6" fill="#f2c12e"/>}<path d="M0 -40 l-2 -5 M0 -40 l2 -5" stroke="#c9b07a" strokeWidth="1"/></g>;
  case 'rapeseed':return <g transform={`scale(${s})`}><path d="M0 0 V-26" stroke="#5f8f3a" strokeWidth="1.4"/>{s>.5&&dots(5,0,-28,5,3,2.2,ready?'#b9a24a':'#f5d90a',i+3,'#e0c400')}</g>;
  case 'sunflower':return <g transform={`scale(${s})`}><path d="M0 0 V-38" stroke="#5f8f3a" strokeWidth="2"/><path d="M0 -18 q-8 -2 -10 4 M0 -24 q8 -2 10 4" stroke="#5f8f3a" strokeWidth="2.4" fill="none"/>{s>.55&&<g><circle cx="0" cy="-41" r="7" fill={ready?'#c9a12e':'#f6c437'}/><circle cx="0" cy="-41" r="3.6" fill="#5d3b1a"/></g>}</g>;
  case 'legume':return <g transform={`scale(${s})`}>{dots(6,0,-7,7,5,3.2,g,i+5,'#3b7a2a')}{ready&&dots(3,0,-8,5,3,1.5,'#9ccc65',i+9)}</g>;
  case 'potato':return <g transform={`scale(${s})`}>{dots(8,0,-8,9,6,3.6,ready?'#7a8f3a':g,i+11,'#3b7a2a')}{s>.7&&!ready&&dots(3,0,-13,6,2,1.3,'#ffffff',i+13,'#ddd')}</g>;
  case 'beet':return <g transform={`scale(${s})`}>{[-30,-10,10,30].map((a,k)=><ellipse key={k} cx="0" cy="-8" rx="3.5" ry="9" fill={g} transform={`rotate(${a} 0 0)`}/>)}{ready&&<ellipse cx="0" cy="0" rx="4" ry="2" fill="#efe3c6"/>}</g>;
  case 'carrot':return <g transform={`scale(${s})`}>{[-3,-1,1,3].map(x=><path key={x} d={`M0 0 Q${x*2} -8 ${x*3} -16`} stroke="#5fae3a" strokeWidth="1" fill="none"/>)}{dots(5,0,-14,6,3,1.6,'#6abf45',i+17)}{ready&&<path d="M-2 0 L0 4 L2 0Z" fill="#ef7d1a"/>}</g>;
  case 'onion':return <g transform={`scale(${s})`}>{[-2,0,2].map(x=><path key={x} d={`M0 0 L${x*2} -18`} stroke={ready?'#a5a35a':'#62a845'} strokeWidth="1.6"/>)}{ready&&<ellipse cx="0" cy="-1" rx="3.6" ry="3" fill="#c9862e"/>}</g>;
  case 'radish':return <g transform={`scale(${s})`}>{dots(4,0,-6,4,3,2.6,'#5fae3a',i+19)}{ready&&<circle cx="0" cy="0" r="2.6" fill="#d32f2f"/>}</g>;
  case 'head':return <g transform={`scale(${s})`}><ellipse cx="0" cy="-5" rx="9" ry="6" fill={shade(fruit||g,-.12)}/><circle cx="0" cy="-6" r={ready?5:3} fill={fruit||g}/><ellipse cx="0" cy="-5" rx="9" ry="6" fill="url(#ws-round)"/></g>;
  case 'kohlrabi':return <g transform={`scale(${s})`}><circle cx="0" cy="-4" r={ready?5:3} fill="#c5e1a5"/>{[-8,0,8].map(x=><path key={x} d={`M0 -6 Q${x} -14 ${x*1.3} -18`} stroke="#6b9e45" strokeWidth="1.4" fill="none"/>)}</g>;
  case 'vine':return <g transform={`scale(${s})`}>{dots(5,0,-5,12,4,4.8,'#4f9a3a',i+23,'#356b27')}{ready&&(cropId==='pumpkin'?<g><circle cx="5" cy="-3" r="5" fill="#e8792b"/><circle cx="5" cy="-3" r="5" fill="url(#ws-round)"/></g>:<rect x="-3" y="-4" width="12" height="3.4" rx="1.7" fill={fruit}/>)}</g>;
  case 'strawberry':return <g transform={`scale(${s})`}><ellipse cx="0" cy="0" rx="11" ry="2.5" fill="#d9c27a"/>{dots(5,0,-5,8,3,3.4,'#4f9a3a',i+29,'#356b27')}{ready&&dots(3,0,-2,7,2,1.6,'#d7263d',i+31)}</g>;
  case 'bush':return <g transform={`scale(${s})`}>{dots(10,0,-14,9,12,4,'#4a8a35',i+37,'#33682a')}{ready&&dots(6,0,-14,8,10,1.6,fruit,i+41)}</g>;
  case 'tree':return <g transform={`scale(${s})`}><path d="M0 0 V-22" stroke="#6d4c33" strokeWidth="3"/><circle cx="0" cy="-32" r="15" fill="#4c8a35"/><circle cx="-6" cy="-36" r="9" fill="#5a9a3f"/><circle cx="0" cy="-32" r="15" fill="url(#ws-round)"/>{ready&&dots(9,0,-31,11,10,2.1,fruit,i+43)}{!ready&&s>.6&&dots(6,0,-33,11,10,1.4,'#f8f3f0',i+47,'#e7d9d9')}</g>;
  case 'trellis':return <g transform={`scale(${s})`}><path d="M0 0 V-38" stroke="#6d4c33" strokeWidth="1.6"/>{dots(7,0,-22,6,14,3.6,'#4f9a3a',i+53,'#356b27')}{ready&&dots(5,0,-20,5,10,2,fruit,i+59)}</g>;
  case 'asparagus':return <g><ellipse cx="0" cy="0" rx="12" ry="4" fill="#7d6042"/>{s>.5&&[-5,0,5].map(x=><rect key={x} x={x-1} y={ready?-9:-5} width="2" height={ready?9:5} rx="1" fill="#efe6cc"/>)}{!ready&&s<.5&&dots(4,0,-14,6,8,1,'#7fb049',i+61)}</g>;
  case 'flower':return <g transform={`scale(${s})`}><path d="M0 0 V-16" stroke="#4c8a3a" strokeWidth="1.2"/><ellipse cx="-3" cy="-6" rx="1.6" ry="5" fill="#5f9a40"/>{s>.6&&<path d="M-3.4 -16 q0 -6 3.4 -7 q3.4 1 3.4 7 q-3.4 2 -6.8 0" fill={['#e53950','#f6c437','#ff7043','#ab47bc','#ffffff'][i%5]}/>}</g>;
  case 'lavender':return <g transform={`scale(${s})`}>{dots(6,0,-6,8,4,3.4,'#7f9a6c',i+67,'#617a52')}{s>.6&&[-6,-3,0,3,6].map(x=><rect key={x} x={x-1} y="-18" width="2" height="8" rx="1" fill={ready?'#7e57c2':'#a58fd4'}/>)}</g>;
  case 'flax':return <g transform={`scale(${s})`}>{[-2,0,2].map(x=><path key={x} d={`M${x} 0 V-22`} stroke={ready?'#c9b37f':'#6aa646'} strokeWidth=".8"/>)}{!ready&&s>.6&&dots(3,0,-23,3,1,1.6,'#5c8ee6',i+71)}</g>;
  case 'tobacco':return <g transform={`scale(${s})`}><path d="M0 0 V-30" stroke="#6a9a3a" strokeWidth="2"/>{[-24,-14,-4].map((y,k)=><ellipse key={k} cx={k%2?6:-6} cy={y} rx="8" ry="4" fill={ready?'#9b9b3c':'#5fa046'} transform={`rotate(${k%2?20:-20} ${k%2?6:-6} ${y})`}/>)}</g>;
  case 'greenhouse':return <g transform={`scale(${s})`}><path d="M0 0 V-24" stroke="#5f8f3a" strokeWidth="1.4"/>{dots(6,0,-14,6,10,3.4,'#4f9a3a',i+73,'#356b27')}{ready&&dots(4,0,-12,5,8,2.2,fruit,i+79)}</g>;
 }
 return null;
}
export function PlantIcon({cropId}){return <g transform="translate(0 0)"><Plant cropId={cropId} s={1} ready i={3}/></g>;}

const GREENHOUSE=new Set(['tomato','pepper','coffeePlant','rose']);
const DENSE={grain:{h:16,green:'#6fa543',ripe:'#d2aa52'},rapeseed:{h:20,green:'#5f9a3c',ripe:'#e7cf2a'},flax:{h:16,green:'#6aa646',ripe:'#bfa873'},lavender:{h:9,green:'#7f9a6c',ripe:'#8f6fcc'}};
// Acker in Perspektive: Himmel, Baumreihe, Furchen; Pflanzen wachsen mit dem Fortschritt.
export function FieldArt({cropId,progress=0,ready=false,compact=false}){
 const H=compact?110:150,horizon=compact?30:42,rows=compact?5:7;
 const rowsY=Array.from({length:rows},(_,r)=>horizon+8+(H-horizon-8)*Math.pow((r+1)/rows,1.35));
 const growth=cropId?(ready?1:Math.max(.18,Math.min(1,progress))):0;
 const habit=HABIT[cropId],perRow=habit==='tree'?4:habit==='trellis'?6:habit==='corn'||habit==='sunflower'?9:12;
 return <svg viewBox={`0 0 320 ${H}`} className="field-svg" role="img" aria-label={cropId?'Acker mit Kultur':'Leerer, gepflügter Acker'} preserveAspectRatio="xMidYMid slice">
  <rect width="320" height={horizon+2} fill="url(#ws-sky)"/>
  <circle cx="270" cy={horizon*.45} r="8" fill="#fff6c9" opacity=".9"/>
  {Array.from({length:22},(_,i)=><ellipse key={i} cx={i*15+rnd(i)*8} cy={horizon-4} rx={9+rnd(i+2)*6} ry={6+rnd(i+4)*4} fill={i%3?'#4e7a3a':'#5d8a45'}/>)}
  <rect y={horizon} width="320" height="3" fill="#7da35a"/>
  <path d={`M0 ${horizon+2} L320 ${horizon+2} L320 ${H} L0 ${H}Z`} fill={cropId?'url(#ws-soil)':'url(#ws-soil-dry)'}/>{cropId==='rice'&&<path d={`M0 ${horizon+2} L320 ${horizon+2} L320 ${H} L0 ${H}Z`} fill="#6fa3c0" opacity=".45"/>}
  {Array.from({length:17},(_,k)=>{const x0=160+(k-8)*9,x1=160+(k-8)*46;return <path key={k} d={`M${x0} ${horizon+2} L${x1} ${H}`} stroke="#3d2b1c" strokeOpacity=".35" strokeWidth="1"/>;})}
  {rowsY.map((y,r)=><path key={'r'+r} d={`M0 ${y} L320 ${y}`} stroke="#000" strokeOpacity=".08" strokeWidth={1+r*.4}/>)}
  {cropId&&habit==='strawberry'&&rowsY.map((y,r)=><rect key={'s'+r} x="0" y={y-2} width="320" height={2+r*.6} fill="#d9c27a" opacity=".55"/>)}
  {cropId&&DENSE[habit]&&growth>0&&rowsY.map((y,r)=>{const sc=(0.35+r/rows*.95)*(compact?.8:1),top=y-DENSE[habit].h*sc*growth;const col=ready?DENSE[habit].ripe:DENSE[habit].green;return <path key={'c'+r} d={`M0 ${y+1} L0 ${top+2} Q80 ${top-1.5} 160 ${top+1} T320 ${top} L320 ${y+1}Z`} fill={col} opacity=".92"/>;})}
  {cropId&&rowsY.map((y,r)=>{const sc=(0.35+r/rows*.95)*(compact?.8:1);const perRow2=DENSE[habit]?perRow*2:perRow;return Array.from({length:perRow2},(_,k)=>{const x=(k+.5)*(320/perRow2)+(r%2?320/perRow2/2:0)-160/perRow2+rnd(r*31+k)*4;return <g key={r+'-'+k} transform={`translate(${x} ${y})`}><Plant cropId={cropId} s={sc*growth} ready={ready} i={r*13+k}/></g>;});})}
  {(habit==='trellis')&&<path d={`M0 ${horizon+12} L320 ${horizon+12}`} stroke="#8a7a66" strokeWidth=".8" opacity=".6"/>}
  {GREENHOUSE.has(cropId)&&<g><path d={`M8 ${H} L8 ${horizon+14} Q160 ${horizon-22} 312 ${horizon+14} L312 ${H}Z`} fill="#eaf4f8" opacity=".33" stroke="#ffffff" strokeOpacity=".8"/>{Array.from({length:7},(_,k)=><path key={k} d={`M${8+k*50.7} ${H} L${8+k*50.7} ${horizon+14-Math.sin(k/6*Math.PI)*28}`} stroke="#fff" strokeOpacity=".6"/>)}</g>}
  {ready&&!compact&&<g><rect x="10" y={H-26} width="94" height="18" rx="9" fill="#ffffffe6"/><text x="57" y={H-13.5} fontSize="10" fontWeight="800" fill="#2e7d32" textAnchor="middle" fontFamily="Arial">Erntereif ✓</text></g>}
 </svg>;
}
