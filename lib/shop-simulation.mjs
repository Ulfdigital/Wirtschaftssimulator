import {BUSINESSES,GOODS,act,restoreGame,warehouseStock,shelfCount,shelfCapacity,retailAllowed} from './economy.mjs';
export const OPEN_HOUR=6,CLOSE_HOUR=23,SALE_INTERVAL=30000;
const formatter=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
export function localClock(now){const p=Object.fromEntries(formatter.formatToParts(now).map(x=>[x.type,x.value]));return {date:`${p.year}-${p.month}-${p.day}`,text:`${p.hour}:${p.minute}:${p.second}`,seconds:Number(p.hour)*3600+Number(p.minute)*60+Number(p.second),hour:Number(p.hour)};}
export const isBusinessHours=now=>{const h=localClock(now).hour;return h>=OPEN_HOUR&&h<CLOSE_HOUR;};
const legalTime=n=>Number.isSafeInteger(n)&&n>0;
function sellUntil(game,until){let g=game;for(const b of BUSINESSES.filter(b=>b.category==='handel'&&g.owned.includes(b.id)&&g.storeOpen[b.id])){
 let due=g.clock.nextSaleAt[b.id]||until+SALE_INTERVAL,visits=g.clock.visits[b.id]||0,count=g.storeSold[b.id]||0;
 const slots=[...(g.shelves[b.id]||[])];let steps=0;
 while(due<=until&&count<b.demand&&steps++<b.demand){const available=slots.map((s,i)=>({s,i})).filter(x=>x.s.quantity>0);if(!available.length){due=until+SALE_INTERVAL;break;}const {s,i}=available[visits%available.length];const sale=act(g,{type:'sell',id:s.productId,quantity:1,channel:'retail'});if(sale.error){due=until+SALE_INTERVAL;break;}const updated=(g.shelves[b.id]||[]).map((s,index)=>index===i?{...s,quantity:s.quantity-1}:s);slots[i]=updated[i];g={...sale.game,shelves:{...g.shelves,[b.id]:updated},lastSale:{...sale.game.lastSale,at:due,storeId:b.id}};count++;visits++;due+=SALE_INTERVAL;}
 if(count>=b.demand)due=until+SALE_INTERVAL;
 g={...g,storeSold:{...g.storeSold,[b.id]:count},clock:{...g.clock,nextSaleAt:{...g.clock.nextSaleAt,[b.id]:due},visits:{...g.clock.visits,[b.id]:visits}}};
 }return g;}
function close(game,date){if(game.clock.closedDate===date)return game;const result=act(game,{type:'nextDay'}).game;return {...result,lastDay:{...result.lastDay,date},storeOpen:Object.fromEntries(Object.keys(game.shelves).map(id=>[id,false])),clock:{...game.clock,closedDate:date}};}
export function advanceClock(game,now){if(!legalTime(now)||now<game.clock.lastAt)return game;const t=localClock(now);let g=game;
 if(!g.clock.date){g={...g,jobs:Object.fromEntries(Object.entries(g.jobs).map(([id,j])=>[id,{...j,readyAt:j.readyAt||now+Math.max(0,j.readyDay-g.day)*86400000}])),clock:{...g.clock,date:t.date,lastAt:now,closedDate:t.hour>=CLOSE_HOUR?t.date:null}};return g;}
 if(g.clock.date!==t.date){const old=localClock(g.clock.lastAt),end=g.clock.lastAt+(CLOSE_HOUR*3600-old.seconds)*1000;g=sellUntil(g,Math.max(g.clock.lastAt,end-1));g=close(g,g.clock.date);g={...g,storeSold:Object.fromEntries(Object.keys(g.shelves).map(id=>[id,0])),clock:{...g.clock,date:t.date,lastAt:now,nextSaleAt:{},visits:{},closedDate:t.hour>=CLOSE_HOUR?t.date:null}};return g;}
 if(g.clock.closedDate!==t.date){const previous=localClock(g.clock.lastAt),end=g.clock.lastAt+(CLOSE_HOUR*3600-previous.seconds)*1000;if(t.hour>=OPEN_HOUR)g=sellUntil(g,Math.min(now,end-1));if(t.hour>=CLOSE_HOUR)g=close(g,t.date);}
 return {...g,clock:{...g.clock,lastAt:now}};
}
export function dispatch(game,action,now){let g=advanceClock(game,now);const b=BUSINESSES.find(b=>b.id===action.storeId),slots=g.shelves[action.storeId];
 if(action.type==='nextDay')return{game:g,error:'Der Geschäftstag endet automatisch um 23:00 Uhr.'};
 if(action.type==='stockShelf'){
 const p=GOODS.find(p=>p.id===action.id),i=action.index,q=action.quantity;if(!b||!g.owned.includes(b.id)||!slots||!Number.isInteger(i)||i<0||i>=slots.length||!p||!retailAllowed(p)||!Number.isInteger(q)||q<1)return{game:g,error:'Bitte ein eigenes Regal, eine Verkaufsware und eine gültige Menge wählen.'};
 const s=slots[i];if(s.quantity>0&&s.productId!==p.id)return{game:g,error:'Räume zuerst die bisherige Ware aus diesem Regal.'};if(s.quantity+q>shelfCapacity(b.id))return{game:g,error:'Diese Menge passt nicht mehr ins Regal.'};if(warehouseStock(g,p.id)<q)return{game:g,error:'Diese Menge liegt nicht frei im Warenlager.'};return{game:{...g,shelves:{...g.shelves,[b.id]:slots.map((s,index)=>index===i?{productId:p.id,quantity:s.quantity+q}:s)}},error:null};
 }
 if(action.type==='clearShelf'){if(!slots||!Number.isInteger(action.index)||action.index<0||action.index>=slots.length)return{game:g,error:'Regal nicht gefunden.'};return{game:{...g,shelves:{...g.shelves,[action.storeId]:slots.map((s,i)=>i===action.index?{productId:null,quantity:0}:s)}},error:null};}
 if(action.type==='openStore'){if(!b||!slots||!g.owned.includes(b.id))return{game:g,error:'Kaufe zuerst einen Laden.'};if(!isBusinessHours(now)||g.clock.closedDate===g.clock.date)return{game:g,error:'Öffnungszeiten: 06:00 bis 23:00 Uhr deutscher Zeit.'};if(!slots.some(s=>s.quantity>0))return{game:g,error:'Bestücke zuerst mindestens ein Regal.'};if(g.storeOpen[b.id])return{game:g,error:'Der Laden ist bereits geöffnet.'};return{game:{...g,storeOpen:{...g.storeOpen,[b.id]:true},clock:{...g.clock,nextSaleAt:{...g.clock.nextSaleAt,[b.id]:now+SALE_INTERVAL}}},error:null};}
 if(action.type==='closeStore'){if(!slots)return{game:g,error:'Laden nicht gefunden.'};return{game:{...g,storeOpen:{...g.storeOpen,[action.storeId]:false}},error:null};}
 if(action.type==='sell'&&(action.channel!=='wholesale'||warehouseStock(g,action.id)<action.quantity))return{game:g,error:'Nur freie Lagerware kann an den Großhandel verkauft werden. Ladenkunden kaufen aus den Regalen.'};
 if(action.type==='payDebt'){const paid=Math.min(g.cash,g.debt);return{game:{...g,cash:g.cash-paid,debt:g.debt-paid,totalExpenses:g.totalExpenses+paid},error:null};}
 if(action.type==='collect'){const job=g.jobs[action.id];if(!job||!job.readyAt||now<job.readyAt)return{game:g,error:'Die Produktion ist noch nicht fertig.'};g={...g,jobs:{...g.jobs,[action.id]:{...job,readyDay:g.day}}};}
 const result=act(g,action);if(result.error)return result;let next=result.game;
 if(action.type==='acquire')next=restoreGame(next);
 if(action.type==='produce'){const business=BUSINESSES.find(b=>b.id===action.id);next={...next,jobs:{...next.jobs,[action.id]:{...next.jobs[action.id],readyAt:now+business.duration*86400000}}};}
 return{game:next,error:null};
}
