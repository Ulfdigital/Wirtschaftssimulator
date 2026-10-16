// Isometrische Grundformen für den Laden. Kachel = 64 × 32 px; i nach rechts unten, j nach links unten, z nach oben.
export const TW=64, TH=32;
export const P=(i,j,z=0)=>[(i-j)*TW/2,(i+j)*TH/2-z];
const f1=v=>v.toFixed(1);
export const pts=list=>list.map(([x,y])=>f1(x)+','+f1(y)).join(' ');
export const iso=(...c)=>pts(c.map(a=>P(...a)));
export function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
 const f=v=>Math.max(0,Math.min(255,Math.round(amt<0?v*(1+amt):v+(255-v)*amt)));return'#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);}
export function Quad({a,b,c,d,fill,stroke,sw=0.6,op,...r}){return <polygon points={iso(a,b,c,d)} fill={fill} stroke={stroke} strokeWidth={stroke?sw:undefined} opacity={op} {...r}/>;}
// Quader: sichtbar sind Vorderseite (j = j+d), rechte Seite (i = i+w) und Deckel
export function Box({i,j,w,d,h,z=0,front,side,top,stroke='rgba(0,0,0,.18)',noTop}){const S=side||shade(front,-0.2),T=top||shade(front,0.12);return <g>
 <polygon points={iso([i,j+d,z],[i+w,j+d,z],[i+w,j+d,z+h],[i,j+d,z+h])} fill={front} stroke={stroke} strokeWidth=".6"/>
 <polygon points={iso([i+w,j,z],[i+w,j+d,z],[i+w,j+d,z+h],[i+w,j,z+h])} fill={S} stroke={stroke} strokeWidth=".6"/>
 {!noTop&&<polygon points={iso([i,j,z+h],[i+w,j,z+h],[i+w,j+d,z+h],[i,j+d,z+h])} fill={T} stroke={stroke} strokeWidth=".6"/>}</g>;}
export function Shadow({i,j,w,d,blur=true,op=.28}){return <polygon points={iso([i-0.08,j-0.05],[i+w+0.35,j-0.05],[i+w+0.35,j+d+0.25],[i-0.08,j+d+0.25])} fill="#0c0f14" opacity={op} filter={blur?'url(#blur4)':undefined}/>;}
// Transformationsmatrix: 2D-Zeichnung auf eine Fläche entlang i legen (Vorderseiten, Rückwand)
export const faceI=(i,j,z)=>{const[x,y]=P(i,j,z);return`matrix(1 .5 0 1 ${f1(x)} ${f1(y)})`;};
export const faceJ=(i,j,z)=>{const[x,y]=P(i,j,z);return`matrix(1 -.5 0 1 ${f1(x)} ${f1(y)})`;};
