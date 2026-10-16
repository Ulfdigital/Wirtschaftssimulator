import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,act,advance,restoreGame,levelOf,storageCap,stockUsed,price,expectedCustomers,priceAppeal,canPlace,staffLimit,storyQuest,dailyQuests,curTier,facingCap,ekToday} from './engine.mjs';
import {PRODUCTS,TIERS,SHELVES,CATEGORIES,START_CASH,LEVEL_XP,COMMUNITY_PRICE,product} from './data.mjs';
const T=Date.parse('2026-10-16T09:00:00+02:00');
const ok=(g,a,t=T)=>{const r=act(g,a,t);assert.equal(r.error,null,JSON.stringify(a)+' → '+r.error);return r.game;};
const bad=(g,a,t=T)=>{const r=act(g,a,t);assert.ok(r.error,JSON.stringify(a)+' sollte scheitern');assert.equal(r.game,g);};
const runDay=(g,t=T)=>{g=ok(g,{type:'open'},t);return advance(g,t+15*60*1000);};

test('Daten: eindeutige IDs, echte Spannen, jede Ware passt in ein Regal',()=>{for(const l of [PRODUCTS,TIERS,SHELVES,CATEGORIES])assert.equal(new Set(l.map(x=>x.id)).size,l.length);
 for(const p of PRODUCTS){assert.ok(p.vk>p.ek,p.id);const m=(p.vk-p.ek)/p.vk;assert.ok(m>0.15&&m<0.6,p.id+' Spanne '+m);assert.ok(CATEGORIES.some(c=>c.id===p.cat),p.id);assert.ok(SHELVES.some(s=>canPlace(p,s.id)),p.id);}
 assert.equal(product('milk').vk,109);assert.equal(TIERS[0].slots,2);for(let i=1;i<TIERS.length;i++)assert.ok(TIERS[i].slots>TIERS[i-1].slots&&TIERS[i].level>TIERS[i-1].level);});

test('Start: Tante-Emma-Laden mit genau zwei Regalen, 5.000 €, geschlossen',()=>{const g=newGame(T);assert.equal(g.tier,'emma');assert.equal(g.shelves.length,2);assert.ok(g.shelves.every(Boolean));assert.equal(g.cash,START_CASH);assert.equal(g.phase,'closed');
 assert.ok(restoreGame(JSON.stringify(g)));assert.equal(restoreGame('{"version":1}'),null);});

test('Ein Verkaufstag: Kunden kaufen aus den Regalen, Abschluss zieht Miete ab und gibt EP',()=>{let g=runDay(newGame(T));assert.equal(g.phase,'report');const r=g.lastReport;
 assert.ok(r.customers>20,String(r.customers));assert.ok(r.revenue>0);assert.equal(r.rent,curTier(g).rent);assert.equal(r.profit,r.revenue-r.cogs-r.rent);assert.ok(g.xp>0);
 bad(g,{type:'open'});g=ok(g,{type:'nextDay'});assert.equal(g.day,2);assert.equal(g.phase,'closed');});

test('Zu teure Ware bleibt liegen',()=>{assert.equal(priceAppeal(1.7),0);assert.ok(priceAppeal(0.9)>0.95);let g=newGame(T);for(const p of ['pasta','flour','sugar','rice','oats','oil','salt'])g=ok(g,{type:'setPrice',productId:p,cents:Math.round(product(p).vk*1.65)});
 g=runDay(g);assert.equal(g.lastReport.items,0);assert.ok(g.lastReport.priceSkips>0);});

test('Einkauf: Karton kommt bei geschlossenem Laden sofort, offen nach 30 Minuten; Lager hat Grenzen',()=>{let g=newGame(T);const before=g.stock.pasta||0;g=ok(g,{type:'order',productId:'pasta',cartons:2});assert.equal(g.stock.pasta,before+40);
 assert.equal(g.cash,START_CASH-40*ekToday(g,'pasta'));bad(g,{type:'order',productId:'milk',cartons:1});
 g=ok(g,{type:'open'});g=ok(g,{type:'order',productId:'flour',cartons:1});assert.equal(g.orders.length,1);g=advance(g,T+31*1000);assert.equal(g.orders.length,0);
 g.cash=1e9;bad(g,{type:'order',productId:'rice',cartons:100});assert.ok(stockUsed(g)<=storageCap(g));});

test('Regale: Plätze nach Ladenstufe, Waren nur ins passende Regal, Ausbau nur mit Level, Geld und geschlossen',()=>{let g=newGame(T);g.cash=1e8;
 bad(g,{type:'buyShelf',slot:2,shelf:'dry'});bad(g,{type:'upgradeTier'});g.xp=LEVEL_XP(2);g=ok(g,{type:'upgradeTier'});assert.equal(g.shelves.length,4);
 bad(g,{type:'buyShelf',slot:2,shelf:'freezer'});g=ok(g,{type:'buyShelf',slot:2,shelf:'chill'});
 bad(g,{type:'setFacing',slot:2,facing:0,productId:'milk'});g=ok(g,{type:'buyLicense',catId:'molkerei'});bad(g,{type:'setFacing',slot:0,facing:3,productId:'milk'});
 g=ok(g,{type:'order',productId:'milk',cartons:3});g=ok(g,{type:'setFacing',slot:2,facing:0,productId:'milk'});assert.equal(g.shelves[2].facings[0].qty,facingCap(g,'chill'));
 g=ok(g,{type:'open'});bad(g,{type:'upgradeTier'});});

test('Personal: Kassen begrenzt durch Ladengröße, Löhne am Tagesende',()=>{let g=newGame(T);g.xp=LEVEL_XP(5);g.cash=1e8;bad(g,{type:'hire',staffId:'cashier'});assert.equal(staffLimit(g,'cashier'),0);
 g=ok(g,{type:'upgradeTier'});g=ok(g,{type:'upgradeTier'});g=ok(g,{type:'hire',staffId:'cashier'});bad(g,{type:'hire',staffId:'cashier'});g=runDay(g);assert.equal(g.lastReport.wages,14*1390);});

test('Aufgaben und Werbegemeinschaft',()=>{let g=newGame(T);assert.equal(storyQuest(g).key,'opened');g=ok(g,{type:'open'});g=ok(g,{type:'claimStory'});assert.equal(g.quests.story,1);assert.equal(dailyQuests(g).length,3);
 g=advance(g,T+15*60*1000);g.xp=LEVEL_XP(7);g.cash=COMMUNITY_PRICE+1000;bad(g,{type:'foundCommunity',name:'xy'});g=ok(g,{type:'foundCommunity',name:'Werbering Altstadt'});
 assert.equal(g.community.members.length,6);g=ok(g,{type:'perk',perkId:'flyer'});assert.ok(expectedCustomers(g)>0);bad(g,{type:'perk',perkId:'fest'});});
