'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import StoreScene from './art/store.js';
import {act,advance,newGame,restoreGame,SAVE_KEY,SPEEDS,levelProgress,curTier,clock,registers,expectedCustomers,hourCurve,dailyCosts,storyQuest,dailyQuests,levelOf} from '../lib/engine.mjs';
import {TIERS,SHELVES,DAY_MIN,OPEN_MIN,product} from '../lib/data.mjs';
import {RegalePanel,EinkaufPanel,PreisePanel,SortimentPanel,AusbauPanel,PersonalPanel,GemeinschaftPanel,BilanzPanel,ZielePanel,ShopPanel} from './panels.js';
import {Icon} from './icons.js';
import {euro,euroK,num,pct,Bar} from './ui.js';

const TABS=[['regale','Regale','shelves'],['einkauf','Einkauf','cart'],['preise','Preise','tag'],['sortiment','Sortiment','grid'],['ausbau','Ausbau','build'],['personal','Personal','people'],['gemeinschaft','Gemeinschaft','hand'],['bilanz','Bilanz','chart'],['ziele','Ziele','flag'],['shop','Shop','bag']];

export default function Page(){
 const [game,setGame]=useState(null);const [tab,setTab]=useState('regale');const [sel,setSel]=useState(null);const [toast,setToast]=useState(null);const [showReport,setShowReport]=useState(false);
 const ref=useRef(null);ref.current=game;
 useEffect(()=>{let g=null;try{g=restoreGame(localStorage.getItem(SAVE_KEY));}catch{}const now=Date.now();setGame(g?advance(g,now):newGame(now,Math.floor(Math.random()*2**31)));
  const t=setInterval(()=>{const g=ref.current;if(!g)return;const n=advance(g,Date.now());if(n!==g)setGame(n);},1000);return()=>clearInterval(t);},[]);
 useEffect(()=>{if(game)try{localStorage.setItem(SAVE_KEY,JSON.stringify(game));}catch{}},[game]);
 useEffect(()=>{if(game?.phase==='report')setShowReport(true);},[game?.phase]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),toast.err?4200:2600);return()=>clearTimeout(t);},[toast]);
 const run=useCallback(a=>{const g=ref.current;if(a.type==='__reset'){setGame(newGame(Date.now(),Math.floor(Math.random()*2**31)));setSel(null);setShowReport(false);return;}
  const r=act(g,a,Date.now());if(r.error)setToast({text:r.error,err:true});else if(!r.unchanged){setGame(r.game);if(r.message)setToast({text:r.message});}},[]);
 if(!game)return <main className="boot"><div className="mark">WS</div><p>Laden wird aufgeschlossen …</p></main>;
 const g=game,t=curTier(g),lp=levelProgress(g),c=dailyCosts(g),gross=g.today.revenue-g.today.cogs;
 const progress=(g.minute-OPEN_MIN)/DAY_MIN;const activity=g.phase==='open'?expectedCustomers(g)/DAY_MIN*hourCurve(g.minute)*6:0;
 const badges={ziele:(()=>{const s=storyQuest(g);return(s&&s.progress>=s.n?1:0)+dailyQuests(g).filter(d=>!d.claimed&&d.progress>=d.n).length;})(),regale:g.shelves.reduce((s,x)=>s+(x?x.facings.filter(f=>f.product&&f.qty===0).length:0),0)};
 const P={g,run,sel,setSel};
 const panel={regale:<RegalePanel {...P}/>,einkauf:<EinkaufPanel {...P}/>,preise:<PreisePanel {...P}/>,sortiment:<SortimentPanel {...P}/>,ausbau:<AusbauPanel {...P}/>,personal:<PersonalPanel {...P}/>,gemeinschaft:<GemeinschaftPanel {...P}/>,bilanz:<BilanzPanel {...P}/>,ziele:<ZielePanel {...P}/>,shop:<ShopPanel/>}[tab];
 const r=g.lastReport;
 return <main className="app">
  <header className="top">
   <div className="brand"><div className="mark">WS</div><div><small>Wirtschaftssimulator</small><b>{t.name}</b></div></div>
   <div className="clock"><div className={'dot '+g.phase}/><div><b>{clock(g)}</b><small>Tag {g.day} · {g.phase==='open'?'geöffnet':g.phase==='closed'?'geschlossen':'Ladenschluss'}</small></div>
    <div className="speed" role="group" aria-label="Spieltempo">{SPEEDS.map(s=><button key={s} className={g.speed===s?'on':''} onClick={()=>run({type:'speed',speed:s})}>{s}×</button>)}</div></div>
   <div className="kpis">
    <div className="kpi cash"><span>Kontostand</span><b>{euroK(g.cash)}</b></div>
    <div className="kpi"><span>Umsatz heute</span><b>{euroK(g.today.revenue)}</b><small>Rohertrag {euroK(gross)}</small></div>
    <div className="kpi"><span>Kunden heute</span><b>{num(g.today.customers)}</b><small>{g.today.lost?`${g.today.lost} gegangen`:`~${num(expectedCustomers(g))} erwartet`}</small></div>
    <div className="kpi"><span>Zufriedenheit</span><b>{Math.round(g.rep)} %</b><Bar share={g.rep/100} tone={g.rep>70?'good':g.rep>45?'warn':'bad'}/></div>
    <div className="kpi level"><span>Level {lp.level}</span><Bar share={lp.share}/><small>{num(g.xp-lp.from)} / {num(lp.to-lp.from)} EP</small></div>
   </div>
  </header>
  <section className="stage">
   <div className="daybar"><span style={{width:Math.max(0,Math.min(1,progress))*100+'%'}}/><i>7:00</i><i>21:00</i></div>
   <StoreScene g={g} registers={registers(g)} activity={activity} selected={tab==='regale'?sel:null} canBuyShelf={g.cash>=SHELVES[0].price}
    onShelf={k=>{setTab('regale');setSel(k);}} onSlot={k=>{setTab('regale');setSel(k);}} onCheckout={()=>setTab('personal')}/>
   <div className="cta">{g.phase==='closed'&&<><button className="primary big" onClick={()=>run({type:'open'})}><Icon name="play"/> Laden öffnen</button><small>Kosten heute: Miete {euro(c.rent,0)}{c.wages?` · Löhne ${euro(c.wages,0)}`:''}{c.power?` · Strom ${euro(c.power,0)}`:''}</small></>}
    {g.phase==='open'&&<div className="live"><span><b>{Math.round(g.queue||0)}</b> in der Schlange</span><span><b>{registers(g)}</b>/{t.checkouts} Kassen offen</span><span>{g.today.items} Artikel verkauft</span></div>}
    {g.phase==='report'&&!showReport&&<button className="primary big" onClick={()=>setShowReport(true)}><Icon name="chart"/> Tagesabschluss</button>}</div>
  </section>
  <aside className="side">
   <nav className="tabs" aria-label="Bereiche">{TABS.map(([id,label,icon])=><button key={id} className={tab===id?'on':''} onClick={()=>setTab(id)} aria-current={tab===id}><Icon name={icon}/><span>{label}</span>{badges[id]>0&&<i className="badge">{badges[id]}</i>}</button>)}</nav>
   <div className="panel"><h2>{TABS.find(x=>x[0]===tab)[1]}</h2>{panel}
    {tab==='bilanz'&&<button className="ghost danger" onClick={()=>{if(confirm('Wirklich neu anfangen? Dein Laden wird gelöscht.'))run({type:'__reset'});}}>Spiel neu starten</button>}</div>
  </aside>
  {showReport&&g.phase==='report'&&r&&<div className="modal" role="dialog" aria-label="Tagesabschluss"><div className="sheet report">
   <span className="tagline">Tagesabschluss · Tag {r.day}</span><h2 className={r.profit>=0?'pos':'neg'}>{r.profit>=0?'+':''}{euro(r.profit)}</h2>
   <dl className="pnl"><div><dt>Umsatz ({r.customers} Kunden, {r.items} Artikel)</dt><dd>{euro(r.revenue)}</dd></div><div><dt>Wareneinsatz</dt><dd>− {euro(r.cogs)}</dd></div><div className="sum"><dt>Rohertrag</dt><dd>{euro(r.gross)}</dd></div>
    <div><dt>Miete</dt><dd>− {euro(r.rent)}</dd></div>{r.wages>0&&<div><dt>Löhne</dt><dd>− {euro(r.wages)}</dd></div>}{r.power>0&&<div><dt>Strom</dt><dd>− {euro(r.power)}</dd></div>}<div className="total"><dt>Tagesergebnis</dt><dd className={r.profit>=0?'pos':'neg'}>{euro(r.profit)}</dd></div></dl>
   <div className="insights">{r.lost>0&&<p>⚠ {r.lost} Kunden sind ohne Einkauf gegangen{r.lost>r.customers*0.05?' – mehr Kassen oder volle Regale helfen.':'.'}</p>}{r.missed>0&&<p>⚠ {r.missed}× war ein gewünschter Artikel ausverkauft.</p>}{r.priceSkips>r.items*0.15&&<p>⚠ Viele Kunden fanden Preise zu hoch.</p>}
    {r.top.length>0&&<p>Bestseller: {r.top.slice(0,3).map(([id,n])=>`${product(id).name} (${n})`).join(', ')}</p>}</div>
   <button className="primary big" onClick={()=>{setShowReport(false);run({type:'nextDay'});}}>Nächster Tag</button></div></div>}
  {g.levelUps.length>0&&!showReport&&<div className="modal" role="dialog" aria-label="Level-Aufstieg"><div className="sheet levelup"><span className="tagline">Aufstieg</span><h2>Level {Math.max(...g.levelUps)}</h2><p>Bonus gutgeschrieben. Schau unter „Sortiment“, „Ausbau“ und „Personal“, was neu freigeschaltet ist.</p><button className="primary big" onClick={()=>run({type:'ackLevelUp'})}>Weiter</button></div></div>}
  {toast&&<div className={'toast'+(toast.err?' err':'')} role="status">{toast.text}</div>}
 </main>;}
