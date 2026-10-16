'use client';
import {useState,memo} from 'react';
import {PRODUCTS,CATEGORIES,SHELVES,TIERS,STAFF,PERKS,PACKAGES,COMMUNITY_LEVEL,COMMUNITY_PRICE,COMMUNITY_SUGGESTIONS,storageUpgradeCost,wagePerDay,product,category,shelfType} from '../lib/data.mjs';
import {levelOf,curTier,nextTier,storageCap,stockUsed,pendingUnits,price,ekToday,priceAppeal,canPlace,facingCap,shelfProducts,staffLimit,registers,dailyCosts,expectedCustomers,storyQuest,dailyQuests,STORY,boost,WEEK} from '../lib/engine.mjs';
import {ProductIcon} from './art/products.js';
import {RoomPreview} from './art/store.js';
import {Icon} from './icons.js';
import {euro,euroK,num,pct,Bar,Section,Stat} from './ui.js';

const lock=l=>`ab Level ${l}`;
function appealLabel(r){if(r<=0.9)return['günstig','good'];if(r<=1.05)return['fair','good'];if(r<=1.2)return['teuer','warn'];if(r<=1.45)return['sehr teuer','bad'];return['zu teuer','bad'];}

// ---------- Regale ----------
export function RegalePanel({g,run,sel,setSel}){const L=levelOf(g),t=curTier(g);const order=sel!=null?[sel,...g.shelves.map((_,k)=>k).filter(k=>k!==sel)]:g.shelves.map((_,k)=>k);
 const filled=g.shelves.reduce((s,x)=>s+(x?x.facings.filter(f=>f.product&&f.qty>0).length:0),0),all=g.shelves.reduce((s,x)=>s+(x?x.facings.length:0),0);
 return <>
  <div className="toolbar"><div><b>{filled}/{all}</b> Warenplätze bestückt · {g.shelves.filter(Boolean).length}/{t.slots} Regale</div><button onClick={()=>run({type:'fillAll'})}>Alle auffüllen</button></div>
  {order.map(k=>g.shelves[k]?<ShelfCard key={k} k={k} g={g} run={run} active={sel===k} onSelect={()=>setSel(k)}/>:<EmptyCard key={k} k={k} g={g} L={L} run={run} active={sel===k}/>)}
  {t.slots<TIERS[TIERS.length-1].slots&&<p className="hint">Mehr Regalplätze bekommst du mit dem nächsten Ladenausbau.</p>}</>;}
function ShelfCard({k,g,run,active,onSelect}){const s=g.shelves[k],st=shelfType(s.type),cap=facingCap(g,s.type);const used=new Set([...shelfProducts(g).keys()]);
 const options=PRODUCTS.filter(p=>g.licenses.includes(p.cat)&&canPlace(p,s.type));
 return <article className={'card shelf'+(active?' active':'')} onClick={onSelect}><header><span className="tagline">Regal {k+1}</span><b>{st.name}</b>{st.power>0&&<small>Strom {euro(st.power)}/Tag</small>}
  <button className="ghost xs" onClick={e=>{e.stopPropagation();if(confirm('Regal verkaufen? Du bekommst die Hälfte des Preises zurück.'))run({type:'sellShelf',slot:k});}}>Verkaufen</button></header>
  {s.facings.map((f,fi)=>{const p=f.product&&product(f.product);return <div key={fi} className="facing">
   {p?<ProductIcon id={p.id} size={34}/>:<span className="slot-empty"/>}
   <div className="grow"><select value={f.product||''} onClick={e=>e.stopPropagation()} onChange={e=>run({type:'setFacing',slot:k,facing:fi,productId:e.target.value||null})} aria-label={`Ware für Platz ${fi+1}`}>
     <option value="">– leer –</option>{options.map(o=><option key={o.id} value={o.id}>{o.name}{used.has(o.id)&&o.id!==f.product?' (schon im Regal)':''} · {g.stock[o.id]||0} im Lager</option>)}</select>
    {p&&<div className="facing-meta"><Bar share={f.qty/cap} tone={f.qty===0?'bad':f.qty<cap*0.25?'warn':'good'}/><small>{f.qty}/{cap} · {euro(price(g,p.id))} · Lager {g.stock[p.id]||0}</small></div>}</div>
   {p&&<button className="xs" disabled={!(g.stock[p.id]>0)||f.qty>=cap} onClick={e=>{e.stopPropagation();run({type:'fill',slot:k,facing:fi});}}>Auffüllen</button>}</div>;})}
 </article>;}
function EmptyCard({k,g,L,run,active}){return <article className={'card shelf empty'+(active?' active':'')}><header><span className="tagline">Regalplatz {k+1}</span><b>frei</b></header>
 <div className="buy-grid">{SHELVES.map(s=>{const locked=s.level>L,cats=s.cats.map(c=>category(c).name).join(', ');return <button key={s.id} className="buy-shelf" disabled={locked||g.cash<s.price} onClick={()=>run({type:'buyShelf',slot:k,shelf:s.id})}>
  <b>{s.name}</b><small>{locked?lock(s.level):euro(s.price,0)}</small><i>{cats}</i></button>;})}</div></article>;}

// ---------- Einkauf ----------
export function EinkaufPanel({g,run}){const [q,setQ]=useState('');const [cat,setCat]=useState('alle');const cap=storageCap(g),used=stockUsed(g),pend=pendingUnits(g);
 const list=PRODUCTS.filter(p=>g.licenses.includes(p.cat)&&(cat==='alle'||p.cat===cat)&&p.name.toLowerCase().includes(q.toLowerCase()));
 return <>
  <div className="storage"><div className="row"><b>Lager</b><span>{num(used)} + {num(pend)} unterwegs / {num(cap)} Stück</span></div><Bar share={(used+pend)/cap} tone={(used+pend)/cap>0.9?'bad':'good'}/>
   {g.orders.length>0&&<small>{g.orders.length} Lieferung(en) unterwegs · Lieferzeit 30 Minuten während der Öffnungszeit</small>}</div>
  <div className="filters"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ware suchen …" aria-label="Ware suchen"/><select value={cat} onChange={e=>setCat(e.target.value)} aria-label="Sortiment"><option value="alle">Alle Sortimente</option>{CATEGORIES.filter(c=>g.licenses.includes(c.id)).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
  <div className="table">{list.map(p=>{const ek=ekToday(g,p.id),trend=ek/p.ek-1,carton=ek*p.carton,margin=(price(g,p.id)-ek)/price(g,p.id);return <div key={p.id} className="trow">
   <ProductIcon id={p.id} size={36}/><div className="grow"><b>{p.name}</b><small>EK {euro(ek)} <span className={trend>0.015?'neg':trend<-0.015?'pos':''}>{trend>0.015?'▲':trend<-0.015?'▼':'•'}</span> · VK {euro(price(g,p.id))} · Spanne {pct(margin)} · Lager {g.stock[p.id]||0}</small></div>
   <div className="buy"><small>Karton {p.carton} Stk. · {euro(carton)}</small><span><button className="xs" disabled={g.cash<carton} onClick={()=>run({type:'order',productId:p.id,cartons:1})}>+1</button><button className="xs ghost" disabled={g.cash<carton*5} onClick={()=>run({type:'order',productId:p.id,cartons:5})}>+5</button></span></div></div>;})}</div>
  {!list.length&&<p className="hint">Keine Ware gefunden. Neue Sortimente schaltest du unter „Sortiment“ frei.</p>}</>;}

// ---------- Preise ----------
export function PreisePanel({g,run}){const ids=[...new Set([...shelfProducts(g).keys(),...Object.keys(g.stock)])].map(product).filter(Boolean);
 return <><p className="hint">Der übliche Ladenpreis ist der Marktpreis. Bis etwa 5 % darüber kaufen fast alle, ab 20 % darüber springen viele ab, ab 60 % kauft niemand mehr.</p>
  <div className="table">{ids.map(p=><PriceRow key={p.id} p={p} g={g} run={run}/>)}</div></>;}
function PriceRow({p,g,run}){const cur=price(g,p.id),[v,setV]=useState((cur/100).toFixed(2));const ek=g.avgCost[p.id]??p.ek,r=cur/p.vk,[lab,tone]=appealLabel(r);
 const set=c=>{setV((c/100).toFixed(2));run({type:'setPrice',productId:p.id,cents:c});};
 return <div className="trow pr"><ProductIcon id={p.id} size={36}/><div className="grow"><b>{p.name}</b><small>Markt {euro(p.vk)} · Einstand {euro(ek)} · Spanne {pct((cur-ek)/cur)} · <span className={'chip '+tone}>{lab}</span></small></div>
  <div className="price-edit"><button className="xs ghost" onClick={()=>set(Math.max(1,Math.round(cur*0.95)))} aria-label="5 % günstiger">−5 %</button>
   <input type="number" step="0.01" min="0.01" value={v} onChange={e=>setV(e.target.value)} onBlur={()=>{const c=Math.round(parseFloat(String(v).replace(',','.'))*100);if(c>0&&c!==cur)run({type:'setPrice',productId:p.id,cents:c});else setV((cur/100).toFixed(2));}} aria-label={`Preis ${p.name}`}/>
   <button className="xs ghost" onClick={()=>set(Math.round(cur*1.05))} aria-label="5 % teurer">+5 %</button><button className="xs ghost" onClick={()=>set(p.vk)}>Markt</button></div></div>;}

// ---------- Sortiment ----------
export function SortimentPanel({g,run}){const L=levelOf(g);return <div className="cards">{CATEGORIES.map(c=>{const has=g.licenses.includes(c.id),locked=c.level>L;const prods=PRODUCTS.filter(p=>p.cat===c.id);const shelves=SHELVES.filter(s=>prods.some(p=>canPlace(p,s.id))).map(s=>s.name);
 return <article key={c.id} className={'card cat'+(has?' owned':'')+(locked?' locked':'')}><div className="icons">{prods.slice(0,5).map(p=><ProductIcon key={p.id} id={p.id} size={30}/>)}</div>
  <b>{c.name}</b><small>{prods.length} Artikel · braucht {shelves.join(' oder ')}</small>
  {has?<span className="chip good"><Icon name="check" size={14}/> im Sortiment</span>:locked?<span className="chip"><Icon name="lock" size={14}/> {lock(c.level)}</span>:<button className="xs" disabled={g.cash<c.price} onClick={()=>run({type:'buyLicense',catId:c.id})}>Lizenz {c.price?euro(c.price,0):'gratis'}</button>}</article>;})}</div>;}

// ---------- Ausbau ----------
export function AusbauPanel({g,run}){const L=levelOf(g),t=curTier(g),n=nextTier(g);const idx=TIERS.findIndex(x=>x.id===t.id);return <>
 {n?<article className="card hero"><RoomPreview tierId={n.id}/><div><span className="tagline">Nächste Stufe</span><h3>{n.name}</h3><p>{n.desc}</p>
  <div className="facts"><span><b>{n.slots}</b> Regalplätze</span><span><b>{n.checkouts}</b> Kassen</span><span><b>{num(n.size)}</b> m²</span><span><b>~{num(n.base)}</b> Kunden/Tag</span><span><b>{euro(n.rent,0)}</b> Miete/Tag</span></div>
  {n.level>L?<span className="chip"><Icon name="lock" size={14}/> {lock(n.level)}</span>:<button disabled={g.cash<n.price||g.phase==='open'} onClick={()=>run({type:'upgradeTier'})}>Ausbauen für {euro(n.price,0)}</button>}
  {g.phase==='open'&&n.level<=L&&<small>Umbauen geht nur bei geschlossenem Laden.</small>}</div></article>:<article className="card hero"><div><h3>Höchste Stufe erreicht</h3><p>Dein Verbrauchermarkt ist das Flaggschiff.</p></div></article>}
 <Section title="Dein Weg"><ol className="ladder">{TIERS.map((x,k)=><li key={x.id} className={k<idx?'done':k===idx?'now':''}><span>{k+1}</span><div><b>{x.name}</b><small>{x.slots} Regale · {x.checkouts} {x.checkouts>1?'Kassen':'Kasse'} · {x.size} m² · {k===0?'Start':`Level ${x.level} · ${euro(x.price,0)}`}</small></div></li>)}</ol></Section>
 <Section title="Lager"><div className="storage"><div className="row"><b>{num(storageCap(g))} Stück Platz</b><span>{num(stockUsed(g))} belegt</span></div><Bar share={stockUsed(g)/storageCap(g)}/>
  <button className="ghost" disabled={g.cash<storageUpgradeCost(g.storageLevel)} onClick={()=>run({type:'upgradeStorage'})}>+300 Stück für {euro(storageUpgradeCost(g.storageLevel),0)}</button></div></Section></>;}

// ---------- Personal ----------
export function PersonalPanel({g,run}){const L=levelOf(g);return <>{STAFF.map(s=>{const n=g.staff[s.id],lim=staffLimit(g,s.id),locked=s.level>L;return <article key={s.id} className={'card staff'+(locked?' locked':'')}>
 <div className="grow"><b>{s.name}</b><small>{s.desc}</small><small>{s.hours} h × 13,90 € Mindestlohn = <b>{euro(wagePerDay(s))}</b> pro Tag</small></div>
 <div className="col"><span className="count">{n}<small>/{lim}</small></span>{locked?<span className="chip"><Icon name="lock" size={14}/> {lock(s.level)}</span>:<><button className="xs" disabled={n>=lim} onClick={()=>run({type:'hire',staffId:s.id})}>Einstellen</button><button className="xs ghost" disabled={!n} onClick={()=>run({type:'fire',staffId:s.id})}>Entlassen</button></>}</div></article>;})}
 <p className="hint">Kassen im Laden: {curTier(g).checkouts}. Geöffnet: {registers(g)} (du selbst stehst an Kasse 1).</p></>;}

// ---------- Werbegemeinschaft ----------
export function GemeinschaftPanel({g,run}){const L=levelOf(g),c=g.community;const [name,setName]=useState('');
 if(!c)return <><article className="card hero"><div><span className="tagline">Gemeinschaftshaus</span><h3>Werbegemeinschaft gründen</h3><p>Schließ dich mit den Geschäften deiner Straße zusammen: gemeinsame Prospekte, Stadtfeste und eine Einkaufsgemeinschaft. Jede Woche gibt es ein gemeinsames Kundenziel.</p>
  <div className="found"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name, z. B. Werbering Altstadt" maxLength={32} aria-label="Name der Werbegemeinschaft"/><button disabled={L<COMMUNITY_LEVEL||g.cash<COMMUNITY_PRICE||name.trim().length<3} onClick={()=>run({type:'foundCommunity',name})}>Gründen · {euro(COMMUNITY_PRICE,0)}</button></div>
  {L<COMMUNITY_LEVEL&&<small>Ab Level {COMMUNITY_LEVEL} (du bist Level {L}).</small>}</div></article>
  <Section title="Gemeinschaften in der Nähe">{COMMUNITY_SUGGESTIONS.map(s=><article key={s.name} className="card"><div className="grow"><b>{s.name}</b><small>{s.members} Mitglieder · {s.text}</small></div><span className="chip">Beitritt mit der App</span></article>)}</Section><MultiNote/></>;
 const w=c.goal,daysLeft=Math.max(0,w.start+WEEK-g.day);
 return <><article className="card hero"><div><span className="tagline">Werbegemeinschaft</span><h3>{c.name}</h3><p>{c.members.length+1} Mitglieder · gegründet an Tag {c.founded}</p></div><div className="points"><b>{c.points}</b><small>Aktionspunkte</small></div></article>
  <Section title="Wochenziel"><article className="card col-card"><b>Gemeinsam {num(w.target)} Kunden bedienen</b><Bar share={(w.mine+w.others)/w.target} tone="good"/><small>Du {num(w.mine)} · Nachbarn {num(w.others)} · {w.done?'geschafft!':`noch ${daysLeft} Tag(e)`} · Belohnung {euro(w.reward,0)} + 3 Aktionspunkte</small></article></Section>
  <Section title="Gemeinsame Aktionen">{PERKS.map(p=>{const on=g.boosts.find(b=>b.id===p.id&&b.untilDay>=g.day);return <article key={p.id} className="card"><div className="grow"><b>{p.name}</b><small>{p.text}{on?` · läuft bis Tag ${on.untilDay}`:''}</small></div><button className="xs" disabled={!!on||c.points<p.cost} onClick={()=>run({type:'perk',perkId:p.id})}>{p.cost} Punkt{p.cost>1?'e':''}</button></article>;})}</Section>
  <Section title="Mitglieder"><ul className="members"><li className="me"><b>Du</b><small>{curTier(g).name}</small><span className="chip good">Vorsitz</span></li>{c.members.map(m=><li key={m.name}><b>{m.name}</b><small>{m.branch}</small><span className="chip">virtuell</span></li>)}</ul></Section><MultiNote/></>;}
function MultiNote(){return <div className="note"><b>Mehrspieler kommt mit der App</b><p>Später triffst du hier echte Händler, gründest gemeinsame Aktionen und vergleichst dich in Ranglisten. Bis dahin sind deine Nachbarn virtuell.</p></div>;}

// ---------- Bilanz ----------
export function BilanzPanel({g}){const d=g.today,c=dailyCosts(g),gross=d.revenue-d.cogs;const h=g.history.slice(0,14).reverse();const max=Math.max(1,...h.map(x=>Math.abs(x.profit)));
 return <>
  <Section title={`Heute · Tag ${g.day}`}><dl className="pnl"><div><dt>Umsatz</dt><dd>{euro(d.revenue)}</dd></div><div><dt>Wareneinsatz</dt><dd>− {euro(d.cogs)}</dd></div><div className="sum"><dt>Rohertrag</dt><dd>{euro(gross)}</dd></div>
   <div><dt>Miete</dt><dd>− {euro(c.rent)}</dd></div><div><dt>Löhne</dt><dd>− {euro(c.wages)}</dd></div><div><dt>Strom Kühlung</dt><dd>− {euro(c.power)}</dd></div><div className="total"><dt>Ergebnis (bei Ladenschluss)</dt><dd className={gross-c.rent-c.wages-c.power>=0?'pos':'neg'}>{euro(gross-c.rent-c.wages-c.power)}</dd></div></dl>
   <small className="hint">Wareneinkäufe sind Investitionen ins Lager und zählen erst als Wareneinsatz, wenn die Ware verkauft ist.</small></Section>
  {h.length>0&&<Section title="Gewinn der letzten Tage"><svg className="chart" viewBox={`0 0 ${h.length*24} 120`} preserveAspectRatio="none" role="img" aria-label="Tagesgewinne">{h.map((x,k)=>{const v=x.profit/max*50;return <g key={k}><rect x={k*24+4} y={v>=0?60-v:60} width="16" height={Math.max(1,Math.abs(v))} rx="2" className={v>=0?'up':'down'}/><title>{`Tag ${x.day}: ${euro(x.profit)}`}</title></g>;})}<line x1="0" x2={h.length*24} y1="60" y2="60" className="axis"/></svg></Section>}
  <Section title="Kennzahlen"><div className="stats3"><Stat label="Kunden gesamt" value={num(g.stats.customers||0)}/><Stat label="Umsatz gesamt" value={euroK(g.stats.revenue||0)}/><Stat label="Bester Tag" value={euroK(g.stats.bestProfit||0)}/><Stat label="Erwartete Kunden/Tag" value={num(expectedCustomers(g))}/><Stat label="Lagerwert" value={euroK(Object.entries(g.stock).reduce((s,[id,n])=>s+n*(g.avgCost[id]??product(id).ek),0))}/><Stat label="Geschäftstage" value={num(g.stats.days||0)}/></div></Section>
  {g.history.length>0&&<Section title="Letzte Abschlüsse"><table className="hist"><thead><tr><th>Tag</th><th>Kunden</th><th>Umsatz</th><th>Gewinn</th></tr></thead><tbody>{g.history.slice(0,10).map(x=><tr key={x.day}><td>{x.day}</td><td>{x.customers}</td><td>{euro(x.revenue,0)}</td><td className={x.profit>=0?'pos':'neg'}>{euro(x.profit,0)}</td></tr>)}</tbody></table></Section>}</>;}

// ---------- Ziele ----------
export function ZielePanel({g,run}){const q=storyQuest(g);return <>
 {q?<article className="card story"><span className="tagline">Karriere · {g.quests.story+1}/{STORY.length}</span><h3>{q.title}</h3><p>{q.text}</p><Bar share={q.progress/q.n}/><div className="row"><small>{q.key==='bestProfit'?`${euro(q.progress)} / ${euro(q.n)}`:`${num(q.progress)} / ${num(q.n)}`} · Belohnung {euro(q.cash,0)} · {q.xp} EP</small><button className="xs" disabled={q.progress<q.n} onClick={()=>run({type:'claimStory'})}>Abholen</button></div></article>:<article className="card story"><h3>Alle Karriereziele erreicht.</h3></article>}
 <Section title={`Tagesziele · Tag ${g.day}`}>{dailyQuests(g).map(d=><article key={d.id} className={'card'+(d.claimed?' done':'')}><div className="grow"><b>{d.title}</b><small>{d.text}</small><Bar share={d.progress/d.n} tone="good"/><small>{d.key==='revenue'?`${euro(d.progress)} / ${euro(d.n)}`:`${num(d.progress)} / ${num(d.n)}`} · {euro(d.cash,0)} · {d.xp} EP</small></div>
  {d.claimed?<span className="chip good"><Icon name="check" size={14}/> erledigt</span>:<button className="xs" disabled={d.progress<d.n} onClick={()=>run({type:'claimDaily',questId:d.id})}>Abholen</button>}</article>)}</Section>
 <Section title="Karriere"><ol className="ladder small">{STORY.map((s,k)=><li key={k} className={k<g.quests.story?'done':k===g.quests.story?'now':''}><span>{k<g.quests.story?'✓':k+1}</span><div><b>{s.title}</b><small>{s.text}</small></div></li>)}</ol></Section></>;}

// ---------- Shop ----------
export function ShopPanel(){return <><div className="note"><b>Noch nicht aktiv</b><p>Hier wird es später Pakete für echtes Geld geben. Bis zur Veröffentlichung als App kann nichts gekauft werden – alles ist auch ohne Bezahlung erreichbar.</p></div>
 <div className="cards">{PACKAGES.map(p=><article key={p.id} className="card cat locked"><b>{p.name}</b><small>{p.content}</small><span className="price">{p.price}</span><button className="xs" disabled>Demnächst</button></article>)}</div></>;}
