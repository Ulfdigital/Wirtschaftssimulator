// Verpackungen in klein (für Regale) und groß (für Listen). Ursprung: Mitte unten.
import {product} from '../../lib/data.mjs';
import {shade} from './iso.js';
const L='rgba(0,0,0,.25)';
export function Pack({id,x=0,y=0,s=1}){const p=product(id);if(!p)return null;const a=p.c1,b=p.c2,d=shade(a,-0.25);let el;
 switch(p.pack){
  case'box':el=<><rect x="-3.5" y="-11" width="7" height="11" fill={a}/><rect x="-3.5" y="-7" width="7" height="3" fill={b}/><rect x="1.8" y="-11" width="1.7" height="11" fill={d} opacity=".6"/></>;break;
  case'bag':el=<><path d="M-3.6 0 L-3.8 -9 Q-3.5 -11 -2 -11 L2 -11 Q3.5 -11 3.8 -9 L3.6 0Z" fill={a}/><rect x="-3" y="-6.5" width="6" height="3" rx=".6" fill={b}/><path d="M2 -10 V0" stroke={d} strokeWidth="1.2" opacity=".5"/></>;break;
  case'bottle':el=<><rect x="-1" y="-15" width="2" height="4" fill={b}/><path d="M-1 -11 Q-3 -10 -3 -7 V0 H3 V-7 Q3 -10 1 -11Z" fill={a}/><rect x="-3" y="-6" width="6" height="3" fill="#fff" opacity=".7"/></>;break;
  case'pet':el=<><rect x="-.9" y="-16" width="1.8" height="2" fill={b}/><path d="M-1 -14 Q-3 -13 -3 -10 V0 H3 V-10 Q3 -13 1 -14Z" fill={a} opacity=".85"/><rect x="-3" y="-8" width="6" height="3.4" fill={b}/><rect x="-2.4" y="-12" width="1" height="10" fill="#fff" opacity=".35"/></>;break;
  case'carton':el=<><path d="M-3 0 V-10 L0 -13 L3 -10 V0Z" fill={a}/><rect x="-3" y="-8" width="6" height="4" fill={b}/><path d="M0 -13 V0" stroke={L} strokeWidth=".5"/><rect x="0" y="-10" width="3" height="10" fill="#000" opacity=".08"/></>;break;
  case'tub':el=<><path d="M-4 0 L-4.5 -5 H4.5 L4 0Z" fill={a}/><rect x="-4.7" y="-6.4" width="9.4" height="1.6" rx=".5" fill={b}/></>;break;
  case'cup':el=<><path d="M-3 0 L-3.5 -7 H3.5 L3 0Z" fill={a}/><rect x="-3.7" y="-8" width="7.4" height="1.4" fill={b}/><circle cx="0" cy="-3.6" r="1.3" fill={b}/></>;break;
  case'tray':el=<><path d="M-4.5 0 L-5 -4 H5 L4.5 0Z" fill="#e8e4dc"/><rect x="-4" y="-4.5" width="8" height="3" rx="1" fill={a}/><rect x="-4.6" y="-1.5" width="9.2" height="1.5" fill={b}/></>;break;
  case'eggbox':el=<><path d="M-5 0 V-4 Q-5 -6 -3 -6 H3 Q5 -6 5 -4 V0Z" fill={a}/><path d="M-3.5 -6 q1 -1.5 2 0 q1 -1.5 2 0 q1 -1.5 2 0" fill="none" stroke={b} strokeWidth=".6"/></>;break;
  case'loaf':el=<><path d="M-4.5 0 Q-5 -7 0 -7 Q5 -7 4.5 0Z" fill={a}/><path d="M-2 -6 l1 2 M1 -6.5 l1 2" stroke={shade(a,0.4)} strokeWidth=".8"/>{b!=='#f0e0c0'&&<rect x="-4.5" y="-2.5" width="9" height="2" fill={b} opacity=".8"/>}</>;break;
  case'can':el=<><rect x="-2.8" y="-8" width="5.6" height="8" fill={a}/><rect x="-2.8" y="-5.5" width="5.6" height="3" fill={b}/><ellipse cx="0" cy="-8" rx="2.8" ry=".8" fill="#c9ccd1"/><rect x="1.2" y="-8" width="1.6" height="8" fill="#000" opacity=".12"/></>;break;
  case'jar':el=<><rect x="-3" y="-7" width="6" height="7" rx="1" fill={a}/><rect x="-3.2" y="-8.5" width="6.4" height="1.8" fill="#c9a24a"/><rect x="-2.4" y="-5" width="4.8" height="2.4" fill={b}/></>;break;
  case'brick':el=<><rect x="-3" y="-10" width="6" height="10" fill={a}/><rect x="-3" y="-6.5" width="6" height="2.6" fill={b}/><rect x="1.5" y="-10" width="1.5" height="10" fill="#000" opacity=".2"/></>;break;
  case'bar':el=<><rect x="-4" y="-5" width="8" height="5" fill={a}/><rect x="-4" y="-3.2" width="8" height="1.2" fill={b}/></>;break;
  case'pizza':el=<><rect x="-5" y="-3.5" width="10" height="3.5" fill={a}/><circle cx="-1" cy="-1.8" r="1.2" fill={b}/><rect x="2" y="-3" width="2.5" height="2" fill="#fff" opacity=".6"/></>;break;
  case'net':el=<>{[[-2,-2.2],[2,-2.2],[0,-5]].map(([cx,cy],k)=><circle key={k} cx={cx} cy={cy} r="2.4" fill={a}/>)}<path d="M-4 -1 L4 -6 M-4 -6 L4 -1" stroke={b} strokeWidth=".4" opacity=".7"/></>;break;
  case'produce':el=<>{[[-2.6,-2],[0,-2.4],[2.6,-2],[-1.3,-4.6],[1.3,-4.6]].map(([cx,cy],k)=>p.id.includes('banana')?<path key={k} d={`M${cx-2.5} ${cy} q2.5 3 5 0`} stroke={a} strokeWidth="1.8" fill="none"/>:p.id==='cucumber'?<rect key={k} x={cx-2.5} y={cy-0.9} width="5" height="1.8" rx=".9" fill={a}/>:<circle key={k} cx={cx} cy={cy} r="2" fill={a}/>)}</>;break;
  case'wine':el=<><rect x="-.8" y="-18" width="1.6" height="5" fill={a}/><rect x="-1" y="-18.5" width="2" height="1.6" fill={b}/><path d="M-.8 -13 Q-2.6 -12 -2.6 -9 V0 H2.6 V-9 Q2.6 -12 .8 -13Z" fill={a}/><rect x="-2.2" y="-6" width="4.4" height="3.2" fill={b}/></>;break;
  case'whisky':el=<><rect x="-1" y="-15" width="2" height="3" fill="#1a1a1a"/><rect x="-3" y="-12" width="6" height="12" rx="1" fill={a} opacity=".9"/><rect x="-2.4" y="-7" width="4.8" height="3" fill="#f2e8d0"/></>;break;
  case'pack':el=<><rect x="-5" y="-9" width="10" height="9" rx="1" fill={a}/><rect x="-5" y="-6" width="10" height="2.4" fill={b}/>{[-2.5,2.5].map(cx=><circle key={cx} cx={cx} cy="-1.6" r="1" fill="#000" opacity=".08"/>)}</>;break;
  default:el=<rect x="-3" y="-8" width="6" height="8" fill={a}/>;}
 return <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})`}>{el}</g>;}
export function ProductIcon({id,size=40}){return <svg width={size} height={size} viewBox="-10 -18 20 20" aria-hidden="true"><ellipse cx="0" cy="0" rx="7" ry="1.2" fill="#000" opacity=".25"/><Pack id={id}/></svg>;}
