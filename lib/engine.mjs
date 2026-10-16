// Wirtschaftssimulator 1.0 – Spiellogik als reine Funktionen: act(game, action, now) → {game, error, message}
import {START_CASH,OPEN_MIN,CLOSE_MIN,DAY_MIN,LEVEL_XP,TIERS,SHELVES,CATEGORIES,PRODUCTS,STAFF,STORAGE_STEP,storageUpgradeCost,wagePerDay,
 COMMUNITY_LEVEL,COMMUNITY_PRICE,NEIGHBOURS,PERKS,product,category,shelfType,tier} from './data.mjs';

export const SAVE_KEY='wirtschaftssimulator-v2';
export const VERSION=2;
export const SPEEDS=[1,2,4,8];
export const DELIVERY_MIN=30;   // Lieferzeit während der Öffnungszeit (Spielminuten)
export const WEEK=7;

// ---------- Hilfen ----------
export function rand(g){let t=(g.seed=(g.seed+0x6D2B79F5)>>>0);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}
const hash=(a,b)=>{let h=2166136261;for(const c of a+'|'+b)h=Math.imul(h^c.charCodeAt(0),16777619);return((h>>>0)%10000)/10000;};
const fmt=c=>(c/100).toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
export function levelOf(g){let l=1;while(g.xp>=LEVEL_XP(l))l++;return l;}
export function levelProgress(g){const l=levelOf(g),from=l===1?0:LEVEL_XP(l-1),to=LEVEL_XP(l);return{level:l,from,to,share:(g.xp-from)/(to-from)};}
export const curTier=g=>tier(g.tier);
export const nextTier=g=>TIERS[TIERS.findIndex(t=>t.id===g.tier)+1]||null;
export const facingCap=(g,type)=>Math.round(shelfType(type).cap*curTier(g).stockFactor);
export const storageCap=g=>curTier(g).storage+g.storageLevel*STORAGE_STEP;
export const stockUsed=g=>Object.values(g.stock).reduce((s,n)=>s+n,0);
export const pendingUnits=g=>g.orders.reduce((s,o)=>s+o.units,0);
export const price=(g,id)=>g.prices[id]??product(id).vk;
export const registers=g=>Math.min(curTier(g).checkouts,1+g.staff.cashier);
export const staffLimit=(g,id)=>id==='cashier'?curTier(g).checkouts-1:id==='filler'?1+Math.floor(curTier(g).slots/6):1;
export const boost=(g,key)=>g.boosts.filter(b=>b.untilDay>=g.day).reduce((s,b)=>s+(b.effect[key]||0),0);
// Großhandelspreis des Tages: schwankt ±6 % je Ware und Tag
export const ekToday=(g,id)=>Math.round(product(id).ek*(0.94+0.12*hash(id,g.day))*(1+boost(g,'ek')));
export function allowedShelves(p){if(p.cat==='bio')return[p.pack==='produce'?'produce':'chill'];if(p.cat==='wein')return['wine','drinks'];return SHELVES.filter(s=>s.cats.includes(p.cat)).map(s=>s.id);}
export const canPlace=(p,shelfId)=>allowedShelves(p).includes(shelfId);
export const absMin=g=>(g.day-1)*1440+g.minute;
export function clock(g){const h=Math.floor(g.minute/60),m=Math.floor(g.minute%60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');}
// Nachfragekurve über den Tag (Mittel ≈ 1)
export function hourCurve(minute){const h=minute/60;if(h<9)return 0.75;if(h<12)return 0.85;if(h<14)return 1.2;if(h<16)return 0.8;if(h<19)return 1.45;return 0.85;}
// Kaufbereitschaft nach Preis im Verhältnis zum üblichen Ladenpreis
export function priceAppeal(ratio){if(ratio<=0.85)return 1;if(ratio<=1)return 1-(ratio-0.85)*0.2;if(ratio<=1.15)return 0.97-(ratio-1)*2;if(ratio<=1.35)return 0.67-(ratio-1.15)*2.5;if(ratio<=1.6)return Math.max(0,0.17-(ratio-1.35)*0.68);return 0;}
// Wie viele Kunden der Laden heute anlockt
export function shelfProducts(g){const m=new Map();g.shelves.forEach((s,si)=>s&&s.facings.forEach((f,fi)=>{if(f.product){const e=m.get(f.product)||{qty:0,spots:[]};e.qty+=f.qty;e.spots.push([si,fi]);m.set(f.product,e);}}));return m;}
export function assortmentFactor(g){const n=shelfProducts(g).size,t=curTier(g);return Math.max(0.35,Math.min(1.25,0.35+0.9*n/(t.slots*2.6)));}
export const repFactor=g=>0.5+g.rep/100;
export function expectedCustomers(g){return Math.round(curTier(g).base*assortmentFactor(g)*repFactor(g)*(1+boost(g,'customers')));}
export const dailyCosts=g=>({rent:curTier(g).rent,wages:STAFF.reduce((s,x)=>s+g.staff[x.id]*wagePerDay(x),0),power:g.shelves.reduce((s,x)=>s+(x?shelfType(x.type).power:0),0)});

function log(g,text){g.log.unshift({day:g.day,time:clock(g),text});g.log=g.log.slice(0,40);}
function stat(g,k,n=1){g.stats[k]=(g.stats[k]||0)+n;}
function gainXp(g,n){const before=levelOf(g);g.xp+=n;const after=levelOf(g);for(let l=before+1;l<=after;l++){const bonus=l*10000;g.cash+=bonus;g.levelUps.push(l);log(g,`Level ${l} erreicht – Bonus ${fmt(bonus)}.`);}}
function addStock(g,id,n){g.stock[id]=(g.stock[id]||0)+n;if(g.stock[id]<=0)delete g.stock[id];}
function emptyToday(){return{revenue:0,cogs:0,customers:0,lost:0,missed:0,items:0,priceSkips:0,sold:{}};}

// ---------- Neues Spiel ----------
export function newGame(now=Date.now(),seed=20261016){
 const g={version:VERSION,seed:seed>>>0,createdAt:now,lastReal:now,cash:START_CASH,xp:0,day:1,minute:OPEN_MIN,phase:'closed',speed:1,
  tier:'emma',shelves:[mkShelf('dry'),mkShelf('dry')],licenses:['grund'],prices:{},stock:{},avgCost:{},
  storageLevel:0,orders:[],staff:{cashier:0,filler:0,buyer:0},rep:60,queue:0,acc:0,fillAcc:0,today:emptyToday(),history:[],stats:{},boosts:[],
  quests:{story:0,base:{},daily:[]},community:null,levelUps:[],log:[],lastReport:null};
 // Startregale: Grundnahrung ist eingeräumt, je ein Karton liegt im Lager
 const start=['pasta','flour','sugar','oil','rice','oats','salt'];g.stock={};start.forEach((id,k)=>{g.shelves[Math.floor(k/4)].facings[k%4]={product:id,qty:30};g.stock[id]=product(id).carton;g.avgCost[id]=product(id).ek;});
 makeDaily(g);log(g,'Willkommen in deinem Tante-Emma-Laden! Fülle die Regale, prüfe die Preise und öffne den Laden.');return g;}
export function mkShelf(type){const t=shelfType(type);return{type,facings:Array.from({length:t.facings},()=>({product:null,qty:0}))};}
export function restoreGame(raw){try{const g=typeof raw==='string'?JSON.parse(raw):raw;if(!g||g.version!==VERSION||!Number.isFinite(g.cash)||!Array.isArray(g.shelves)||!tier(g.tier))return null;
 for(const[id,n]of Object.entries(g.stock))if(!product(id)||!Number.isFinite(n)||n<0)return null;g.levelUps=g.levelUps||[];return g;}catch{return null;}}

// ---------- Simulation ----------
function deliver(g){const t=absMin(g);const due=g.orders.filter(o=>o.arrive<=t);if(!due.length)return;g.orders=g.orders.filter(o=>o.arrive>t);
 for(const o of due){const have=g.stock[o.product]||0,old=g.avgCost[o.product]??o.unitCost;g.avgCost[o.product]=Math.round((old*have+o.unitCost*o.units)/(have+o.units));addStock(g,o.product,o.units);}
 if(g.phase==='open')log(g,`Lieferung angekommen: ${due.map(o=>`${o.units}× ${product(o.product).name}`).join(', ')}.`);}
function customer(g,t){const regs=registers(g);
 if(g.queue>=5*regs){g.today.lost++;satisfy(g,0);return;}
 const wish=shelfProducts(g);if(!wish.size){g.today.lost++;satisfy(g,10);return;}
 const list=[...wish.entries()].map(([id,e])=>{const p=product(id),r=price(g,id)/p.vk;return{id,e,p,appeal:priceAppeal(r),ratio:r,w:p.pop};});
 const total=list.reduce((s,x)=>s+x.w,0);const k=t.basket[0]+Math.floor(rand(g)*(t.basket[1]-t.basket[0]+1));let basket=0,items=0,missed=0;
 for(let n=0;n<k;n++){let r=rand(g)*total,pick=list[0];for(const x of list){r-=x.w;if(r<=0){pick=x;break;}}
  if(rand(g)>pick.appeal){g.today.priceSkips++;if(pick.ratio>1.15)g.today._complain=true;continue;}
  const spot=pick.e.spots.find(([si,fi])=>g.shelves[si].facings[fi].qty>0);if(!spot){missed++;continue;}
  g.shelves[spot[0]].facings[spot[1]].qty--;pick.e.qty--;const pr=price(g,pick.id);basket+=pr;items++;g.today.revenue+=pr;g.today.cogs+=g.avgCost[pick.id]??pick.p.ek;g.today.sold[pick.id]=(g.today.sold[pick.id]||0)+1;}
 g.today.missed+=missed;satisfy(g,100-30*missed-(g.today._complain?25:0));g.today._complain=false;
 if(!items){g.today.lost++;return;}
 g.today.customers++;g.today.items+=items;g.cash+=basket;g.queue++;stat(g,'customers');stat(g,'items',items);stat(g,'revenue',basket);gainXp(g,Math.max(1,Math.round(basket/500)));}
// Zufriedenheit: gleitender Mittelwert aus den Erlebnissen der Kunden
function satisfy(g,s){g.rep=Math.max(0,Math.min(100,g.rep+(Math.max(0,s)-g.rep)*0.012));}
function refill(g,budget){for(const s of g.shelves){if(!s)continue;const cap=facingCap(g,s.type);for(const f of s.facings){if(budget<1)return budget;if(!f.product||f.qty>cap*0.5)continue;const n=Math.min(cap-f.qty,g.stock[f.product]||0,Math.floor(budget));if(n>0){f.qty+=n;addStock(g,f.product,-n);budget-=n;}}}return budget;}
function stepMinute(g){const t=curTier(g);deliver(g);
 const lambda=t.base/DAY_MIN*hourCurve(g.minute)*assortmentFactor(g)*repFactor(g)*(1+boost(g,'customers'));g.acc+=lambda*(0.7+rand(g)*0.6);
 while(g.acc>=1){g.acc-=1;customer(g,t);}
 g.queue=Math.max(0,g.queue-registers(g)*0.85);
 if(g.staff.filler){g.fillAcc+=g.staff.filler*400/60;g.fillAcc=refill(g,g.fillAcc);if(g.fillAcc>200)g.fillAcc=200;}
 g.minute++;}
function closeDay(g){const c=dailyCosts(g);const costs=c.rent+c.wages+c.power;g.cash-=costs;
 const d=g.today,gross=d.revenue-d.cogs,profit=gross-costs;
 const report={day:g.day,revenue:d.revenue,cogs:d.cogs,gross,...c,profit,customers:d.customers,lost:d.lost,missed:d.missed,items:d.items,priceSkips:d.priceSkips,rep:Math.round(g.rep),
  top:Object.entries(d.sold).sort((a,b)=>b[1]-a[1]).slice(0,5)};
 g.history.unshift(report);g.history=g.history.slice(0,30);g.lastReport=report;stat(g,'days');if(profit>(g.stats.bestProfit||0))g.stats.bestProfit=profit;
 // Disponent: knappe Waren für morgen nachbestellen
 if(g.staff.buyer){const wish=shelfProducts(g);const bought=[];for(const[id,e]of wish){const p=product(id),cap=e.spots.length*facingCap(g,g.shelves[e.spots[0][0]].type),have=(g.stock[id]||0);
   if(have<cap){const cartons=Math.ceil((cap*1.5-have)/p.carton);const units=cartons*p.carton,cost=units*ekToday(g,id);if(cost<=g.cash&&stockUsed(g)+pendingUnits(g)+units<=storageCap(g)){g.cash-=cost;g.today.orderSpend=(g.today.orderSpend||0)+cost;g.orders.push({id:'o'+g.day+id,product:id,units,unitCost:ekToday(g,id),arrive:absMin(g)+1});bought.push(`${cartons}× ${p.name}`);}}}
  if(bought.length)log(g,'Disponentin hat bestellt: '+bought.join(', ')+'.');}
 // Werbegemeinschaft: Nachbarn tragen ihren Teil bei
 if(g.community){const w=g.community.goal;w.others+=Math.round(w.target*0.6/WEEK);if(!w.done&&w.mine+w.others>=w.target){w.done=true;g.community.points+=3;g.cash+=w.reward;log(g,`Wochenziel der Werbegemeinschaft geschafft! +3 Aktionspunkte und ${fmt(w.reward)}.`);}}
 log(g,`Tagesabschluss Tag ${g.day}: Umsatz ${fmt(d.revenue)}, Gewinn ${fmt(profit)}.`);g.phase='report';}
// Spielzeit fortschreiben (nur bei geöffnetem Laden); 1 echte Sekunde = 1 Spielminute × Tempo
export function tick(game,now){if(game.phase!=='open'){if(game.lastReal===now)return game;const g={...game,lastReal:now};return g;}
 let minutes=Math.floor((now-game.lastReal)/1000*game.speed);if(minutes<1)return game;const g=structuredClone(game);
 g.lastReal+=Math.round(minutes/g.speed*1000);minutes=Math.min(minutes,CLOSE_MIN-g.minute);
 for(let k=0;k<minutes;k++)stepMinute(g);if(g.minute>=CLOSE_MIN){closeDay(g);g.lastReal=now;}return g;}

// ---------- Aufgaben ----------
export const STORY=[
 {title:'Der erste Verkaufstag',text:'Öffne deinen Laden.',key:'opened',n:1,cash:20000,xp:20},
 {title:'Die ersten Kunden',text:'Bediene 25 Kunden.',key:'customers',n:25,cash:15000,xp:20},
 {title:'Preisgefühl',text:'Passe einen Verkaufspreis an.',key:'priceSet',n:1,cash:10000,xp:10},
 {title:'Frisches Brot',text:'Erwirb das Sortiment Backwaren.',key:'license:back',n:1,cash:30000,xp:30},
 {title:'Stammkundschaft',text:'Bediene insgesamt 300 Kunden.',key:'customers',n:300,cash:50000,xp:50},
 {title:'Mehr Platz',text:'Baue zum Dorfladen aus.',key:'tier:dorf',n:1,cash:100000,xp:80},
 {title:'Kühlkette',text:'Stelle ein Kühlregal auf.',key:'shelf:chill',n:1,cash:80000,xp:60},
 {title:'Verstärkung',text:'Stelle eine Kassiererin oder einen Kassierer ein.',key:'hire:cashier',n:1,cash:100000,xp:60},
 {title:'Ein guter Tag',text:'Erziele an einem Tag 300 € Gewinn.',key:'bestProfit',n:30000,cash:150000,xp:100},
 {title:'Nachbarschaftsmarkt',text:'Baue zum Nachbarschaftsmarkt aus.',key:'tier:nachbar',n:1,cash:300000,xp:150},
 {title:'Gemeinsam stark',text:'Gründe die Werbegemeinschaft im Gemeinschaftshaus.',key:'community',n:1,cash:500000,xp:200},
 {title:'Lebensmittelmarkt',text:'Baue zum Lebensmittelmarkt aus.',key:'tier:lebensmittel',n:1,cash:800000,xp:300},
 {title:'Beliebter Laden',text:'Bediene insgesamt 10.000 Kunden.',key:'customers',n:10000,cash:1000000,xp:400},
 {title:'Supermarkt',text:'Baue zum Supermarkt aus.',key:'tier:super',n:1,cash:2000000,xp:600},
 {title:'Starke Zahlen',text:'Erziele an einem Tag 3.000 € Gewinn.',key:'bestProfit',n:300000,cash:3000000,xp:800},
 {title:'Großer Supermarkt',text:'Baue zum Großen Supermarkt aus.',key:'tier:gross',n:1,cash:5000000,xp:1200},
 {title:'Das Flaggschiff',text:'Eröffne deinen Verbrauchermarkt.',key:'tier:verbraucher',n:1,cash:10000000,xp:2000}
];
function statValue(g,key){if(key==='community')return g.community?1:0;return g.stats[key]||0;}
export function storyQuest(g){const q=STORY[g.quests.story];if(!q)return null;const abs=q.key==='bestProfit'||q.key.includes(':')||q.key==='community';return{...q,progress:Math.max(0,Math.min(q.n,statValue(g,q.key)-(abs?0:g.quests.base[q.key]||0)))};}
// Tagesziele: drei kleine Ziele pro Tag
function makeDaily(g){const t=curTier(g),exp=expectedCustomers(g);const goods=[...shelfProducts(g).keys()];const L=levelOf(g);const list=[];
 list.push({id:'c',title:'Volle Kasse',text:`Bediene heute ${Math.max(10,Math.round(exp*0.7/5)*5)} Kunden.`,key:'customers',n:Math.max(10,Math.round(exp*0.7/5)*5)});
 const rev=Math.max(5000,Math.round(exp*0.7*(t.basket[0]+t.basket[1])/2*150/1000)*1000);list.push({id:'r',title:'Umsatzziel',text:`Mache heute ${fmt(rev)} Umsatz.`,key:'revenue',n:rev});
 if(goods.length){const id=goods[Math.floor(rand(g)*goods.length)];const n=Math.max(5,Math.round(exp*0.15/5)*5);list.push({id:'s',title:'Aktionsware',text:`Verkaufe heute ${n}× ${product(id).name}.`,key:'sold:'+id,n});}
 g.quests.daily=list.map(q=>({...q,cash:2000+L*1500,xp:10+L*3,claimed:false}));}
export function dailyQuests(g){return g.quests.daily.map(q=>{const v=q.key.startsWith('sold:')?(g.today.sold[q.key.slice(5)]||0):q.key==='customers'?g.today.customers:g.today.revenue;return{...q,progress:Math.min(q.n,v)};});}

// ---------- Aktionen ----------
const A={
 open(g,_,now){if(g.phase!=='closed')return'Der Laden ist schon geöffnet oder der Tag ist vorbei.';g.phase='open';g.lastReal=now;stat(g,'opened');log(g,`Tag ${g.day}: Laden geöffnet.`);return'Laden geöffnet – die ersten Kunden kommen.';},
 nextDay(g,_,now){if(g.phase!=='report')return'Der Tag läuft noch.';g.day++;g.minute=OPEN_MIN;g.phase='closed';g.today=emptyToday();g.queue=0;g.acc=0;g.lastReal=now;
  for(const o of g.orders)o.arrive=absMin(g);deliver(g);g.boosts=g.boosts.filter(b=>b.untilDay>=g.day);
  if(g.community&&g.day-g.community.goal.start>=WEEK)g.community.goal=newGoal(g);makeDaily(g);return`Tag ${g.day} beginnt. Bereite den Laden vor.`;},
 speed(g,{speed}){if(!SPEEDS.includes(speed))return'Ungültiges Tempo.';if(g.speed===speed)return'';g.speed=speed;return`Tempo ${speed}×.`;},
 buyShelf(g,{slot,shelf}){const t=curTier(g),s=shelfType(shelf);if(!s)return'Unbekanntes Regal.';if(slot<0||slot>=t.slots)return'Kein Regalplatz.';if(g.shelves[slot])return'Hier steht schon ein Regal.';
  if(s.level>levelOf(g))return`${s.name} ab Level ${s.level}.`;if(g.cash<s.price)return`${s.name} kostet ${fmt(s.price)}.`;g.cash-=s.price;g.shelves[slot]=mkShelf(shelf);stat(g,"shelf:"+shelf);return`${s.name} aufgestellt.`;},
 sellShelf(g,{slot}){const s=g.shelves[slot];if(!s)return'Kein Regal.';const back=s.facings.reduce((n,f)=>n+f.qty,0);if(stockUsed(g)+back>storageCap(g))return'Im Lager ist kein Platz für die Ware aus dem Regal.';
  for(const f of s.facings)if(f.qty)addStock(g,f.product,f.qty);const refund=Math.round(shelfType(s.type).price/2);g.cash+=refund;g.shelves[slot]=null;return`Regal verkauft (+${fmt(refund)}), Ware zurück im Lager.`;},
 setFacing(g,{slot,facing,productId}){const s=g.shelves[slot];if(!s||!s.facings[facing])return'Warenplatz nicht gefunden.';const f=s.facings[facing];
  if(productId===null){if(f.qty&&stockUsed(g)+f.qty>storageCap(g))return'Lager voll.';if(f.qty)addStock(g,f.product,f.qty);s.facings[facing]={product:null,qty:0};return'Warenplatz geleert.';}
  const p=product(productId);if(!p)return'Unbekannte Ware.';if(!g.licenses.includes(p.cat))return`Dafür brauchst du das Sortiment „${category(p.cat).name}“.`;if(!canPlace(p,s.type))return`${p.name} passt nicht in ein ${shelfType(s.type).name}.`;
  if(f.product===productId)return'';if(f.qty)addStock(g,f.product,f.qty);const n=Math.min(facingCap(g,s.type),g.stock[productId]||0);s.facings[facing]={product:productId,qty:n};if(n)addStock(g,productId,-n);
  return n?`${p.name} eingeräumt (${n} Stück).`:`${p.name} eingeplant – im Lager ist noch nichts davon.`;},
 fill(g,{slot,facing}){const s=g.shelves[slot],f=s?.facings[facing];if(!f||!f.product)return'Kein Warenplatz.';const n=Math.min(facingCap(g,s.type)-f.qty,g.stock[f.product]||0);if(n<=0)return(g.stock[f.product]||0)?'Schon voll.':'Nichts mehr im Lager – bestelle im Großhandel nach.';
  f.qty+=n;addStock(g,f.product,-n);return`${n}× ${product(f.product).name} aufgefüllt.`;},
 fillAll(g){const before=stockUsed(g);refill(g,1e9);for(const s of g.shelves){if(!s)continue;const cap=facingCap(g,s.type);for(const f of s.facings){if(!f.product)continue;const n=Math.min(cap-f.qty,g.stock[f.product]||0);if(n>0){f.qty+=n;addStock(g,f.product,-n);}}}
  const moved=before-stockUsed(g);return moved?`${moved} Artikel in die Regale geräumt.`:'Alles ist voll oder das Lager ist leer.';},
 order(g,{productId,cartons}){const p=product(productId);if(!p)return'Unbekannte Ware.';if(!g.licenses.includes(p.cat))return`Sortiment „${category(p.cat).name}“ fehlt.`;cartons=Math.floor(cartons);if(cartons<1||cartons>100)return'1 bis 100 Kartons.';
  const units=cartons*p.carton,uc=ekToday(g,productId),cost=units*uc;if(g.cash<cost)return`Die Bestellung kostet ${fmt(cost)}.`;if(stockUsed(g)+pendingUnits(g)+units>storageCap(g))return`Zu wenig Platz im Lager (${storageCap(g)-stockUsed(g)-pendingUnits(g)} frei).`;
  g.cash-=cost;g.today.orderSpend=(g.today.orderSpend||0)+cost;g.orders.push({id:'o'+absMin(g)+productId+g.orders.length,product:productId,units,unitCost:uc,arrive:absMin(g)+(g.phase==='open'?DELIVERY_MIN:0)});deliver(g);stat(g,'orders');
  return g.phase==='open'?`${cartons} Karton(s) ${p.name} bestellt – Lieferung in ${DELIVERY_MIN} Minuten.`:`${cartons} Karton(s) ${p.name} sind im Lager.`;},
 setPrice(g,{productId,cents}){const p=product(productId);if(!p)return'Unbekannte Ware.';cents=Math.round(cents);if(!(cents>=1&&cents<=p.vk*3))return`Preis zwischen 0,01 € und ${fmt(p.vk*3)}.`;if(price(g,productId)===cents)return'';g.prices[productId]=cents;stat(g,'priceSet');return`${p.name} kostet jetzt ${fmt(cents)}.`;},
 buyLicense(g,{catId}){const c=category(catId);if(!c)return'Unbekanntes Sortiment.';if(g.licenses.includes(catId))return'Schon im Sortiment.';if(c.level>levelOf(g))return`${c.name} ab Level ${c.level}.`;if(g.cash<c.price)return`Das Sortiment kostet ${fmt(c.price)}.`;
  g.cash-=c.price;g.licenses.push(catId);stat(g,'license:'+catId);return`Neues Sortiment: ${c.name}.`;},
 upgradeTier(g){const t=nextTier(g);if(!t)return'Größer geht es nicht.';if(t.level>levelOf(g))return`${t.name} ab Level ${t.level}.`;if(g.phase==='open')return'Umbauen geht nur, wenn der Laden geschlossen ist.';if(g.cash<t.price)return`Der Ausbau kostet ${fmt(t.price)}.`;
  g.cash-=t.price;g.tier=t.id;while(g.shelves.length<t.slots)g.shelves.push(null);stat(g,'tier:'+t.id);log(g,`Umbau fertig: ${t.name}!`);return`Willkommen im ${t.name}!`;},
 hire(g,{staffId}){const s=STAFF.find(x=>x.id===staffId);if(!s)return'Unbekannt.';if(s.level>levelOf(g))return`${s.name} ab Level ${s.level}.`;if(g.staff[staffId]>=staffLimit(g,staffId))return staffId==='cashier'?'Für mehr Kassen braucht der Laden einen Ausbau.':'Mehr geht in dieser Ladengröße nicht.';
  g.staff[staffId]++;stat(g,'hire:'+staffId);return`${s.name} eingestellt (${fmt(wagePerDay(s))} pro Tag).`;},
 fire(g,{staffId}){if(!g.staff[staffId])return'Niemand angestellt.';g.staff[staffId]--;return'Arbeitsvertrag beendet.';},
 upgradeStorage(g){const c=storageUpgradeCost(g.storageLevel);if(g.cash<c)return`Der Lagerausbau kostet ${fmt(c)}.`;g.cash-=c;g.storageLevel++;return`Lager ausgebaut: ${storageCap(g)} Stück Platz.`;},
 claimStory(g){const q=storyQuest(g);if(!q)return'Alles erledigt.';if(q.progress<q.n)return'Noch nicht geschafft.';g.quests.story++;const nx=STORY[g.quests.story];if(nx)g.quests.base[nx.key]=g.stats[nx.key]||0;g.cash+=q.cash;gainXp(g,q.xp);return`„${q.title}“ geschafft: +${fmt(q.cash)}.`;},
 claimDaily(g,{questId}){const q=dailyQuests(g).find(x=>x.id===questId);if(!q||q.claimed)return'Schon abgeholt.';if(q.progress<q.n)return'Noch nicht geschafft.';g.quests.daily.find(x=>x.id===questId).claimed=true;g.cash+=q.cash;gainXp(g,q.xp);return`Tagesziel geschafft: +${fmt(q.cash)}.`;},
 foundCommunity(g,{name}){if(g.community)return'Schon gegründet.';if(levelOf(g)<COMMUNITY_LEVEL)return`Ab Level ${COMMUNITY_LEVEL}.`;name=String(name||'').trim().slice(0,32);if(name.length<3)return'Bitte einen Namen mit mindestens 3 Zeichen.';if(g.cash<COMMUNITY_PRICE)return`Die Gründung kostet ${fmt(COMMUNITY_PRICE)}.`;
  g.cash-=COMMUNITY_PRICE;const members=NEIGHBOURS.slice().sort(()=>rand(g)-0.5).slice(0,6).map(([n,b])=>({name:n,branch:b}));g.community={name,founded:g.day,members,points:2,goal:null};g.community.goal=newGoal(g);stat(g,'community');gainXp(g,100);return`Werbegemeinschaft „${name}“ gegründet!`;},
 perk(g,{perkId}){const c=g.community,p=PERKS.find(x=>x.id===perkId);if(!c||!p)return'Nicht möglich.';if(c.points<p.cost)return`Dafür brauchst du ${p.cost} Aktionspunkte.`;if(g.boosts.some(b=>b.id===p.id&&b.untilDay>=g.day))return'Diese Aktion läuft schon.';
  c.points-=p.cost;g.boosts.push({id:p.id,name:p.name,effect:p.effect,untilDay:g.day+p.days-(g.phase==='report'?0:1)});return`${p.name} gestartet: ${p.text}.`;},
 ackLevelUp(g){g.levelUps=[];return'';}
};
function newGoal(g){const exp=expectedCustomers(g);const target=Math.round(exp*WEEK*1.6/100)*100;return{start:g.day,target,mine:0,others:0,reward:Math.round(target*30/100)*100,done:false};}
export const ACTIONS=Object.keys(A);

function credit(g,before){if(!g.community)return;const d=(g.stats.customers||0)-before;if(d<=0)return;const w=g.community.goal;w.mine+=d;
 if(!w.done&&w.mine+w.others>=w.target){w.done=true;g.community.points+=3;g.cash+=w.reward;log(g,`Wochenziel der Werbegemeinschaft geschafft! +3 Aktionspunkte und ${fmt(w.reward)}.`);}}
export function act(game,action,now=Date.now()){const fn=A[action?.type];if(!fn)return{game,error:'Unbekannte Aktion.',message:null};
 const b0=game.stats.customers||0;const g=structuredClone(tick(game,now));credit(g,b0);const before=JSON.stringify(g);const res=fn(g,action,now);
 if(JSON.stringify(g)===before)return{game,error:res||null,message:null,unchanged:true};
 if(res)log(g,res);return{game:g,error:null,message:res};}
// Uhr weiterlaufen lassen (vom Bildschirm jede Sekunde aufgerufen)
export function advance(game,now){const b0=game.stats.customers||0;const g=tick(game,now);if(g!==game)credit(g,b0);return g;}
