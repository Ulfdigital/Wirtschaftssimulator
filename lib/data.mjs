// Wirtschaftssimulator 1.0 – Inhalte und Preise.
// Geld in ganzen Cent. Verkaufspreise = typische Ladenpreise in Deutschland (Herbst 2026, Markenware/Eigenmarke gemischt),
// Einkaufspreise (EK) = Großhandelspreise netto, Handelsspanne meist 20–40 %.
export const START_CASH=500000;         // 5.000 €
export const MIN_WAGE=1390;             // Mindestlohn 13,90 €/h (2026)
export const OPEN_MIN=7*60, CLOSE_MIN=21*60, DAY_MIN=CLOSE_MIN-OPEN_MIN; // 7–21 Uhr
export const LEVEL_XP=l=>Math.round(100*Math.pow(l,2.1)); // EP-Schwelle für Level l → l+1 (kumulativ)

// ---------- Ladenstufen: vom Tante-Emma-Laden zum Verbrauchermarkt ----------
// slots = Regalplätze, checkouts = Kassen, base = mögliche Kunden pro Tag, rent = Miete/Tag, size m²
export const TIERS=[
 {id:'emma',stockFactor:1,name:'Tante-Emma-Laden',level:1,price:0,slots:2,checkouts:1,base:110,rent:2500,size:35,basket:[1,4],storage:400,desc:'Holzdielen, Ladentheke, die alte Registrierkasse. Hier fängt alles an.'},
 {id:'dorf',stockFactor:1,name:'Dorfladen',level:3,price:250000,slots:4,checkouts:1,base:240,rent:4500,size:80,basket:[1,6],storage:700,desc:'Mehr Platz für Frische: Kühlregal und Backwaren passen jetzt rein.'},
 {id:'nachbar',stockFactor:1.3,name:'Nachbarschaftsmarkt',level:6,price:900000,slots:6,checkouts:2,base:480,rent:9000,size:200,basket:[2,8],storage:1200,desc:'Heller Verkaufsraum, zwei Kassen und Platz für Getränke.'},
 {id:'lebensmittel',stockFactor:1.6,name:'Lebensmittelmarkt',level:10,price:3000000,slots:9,checkouts:3,base:900,rent:18000,size:450,basket:[2,10],storage:2000,desc:'Ein richtiger Markt mit Gängen, Kühlstrecke und Lager im Hinterhof.'},
 {id:'super',stockFactor:2,name:'Supermarkt',level:15,price:9000000,slots:12,checkouts:4,base:1500,rent:32000,size:900,basket:[3,12],storage:3200,desc:'Vollsortiment, Kassenzone mit Laufbändern, Parkplatz vor der Tür.'},
 {id:'gross',stockFactor:2.5,name:'Großer Supermarkt',level:22,price:25000000,slots:16,checkouts:6,base:2400,rent:60000,size:1600,basket:[3,14],storage:5000,desc:'Breite Gänge, Bedientheken-Feeling, Kunden aus der ganzen Stadt.'},
 {id:'verbraucher',stockFactor:3,name:'Verbrauchermarkt',level:30,price:65000000,slots:20,checkouts:8,base:3600,rent:110000,size:3000,basket:[4,16],storage:8000,desc:'Das Flaggschiff: 3.000 m², acht Kassen, alles unter einem Dach.'}
];

// ---------- Regaltypen ----------
// facings = Warenplätze pro Regal, cap = Stück pro Warenplatz, power = Strom €/Tag (Cent)
export const SHELVES=[
 {id:'dry',name:'Trockenregal',level:1,price:45000,facings:4,cap:30,power:0,cats:['grund','konserven','suess','kaffee','feinkost']},
 {id:'bakery',name:'Brotregal',level:2,price:60000,facings:3,cap:24,power:0,cats:['back']},
 {id:'chill',name:'Kühlregal',level:3,price:240000,facings:4,cap:24,power:900,cats:['molkerei','fleisch','bio']},
 {id:'produce',name:'Obst- & Gemüsestand',level:4,price:70000,facings:4,cap:25,power:0,cats:['obst','bio']},
 {id:'drinks',name:'Getränkeregal',level:6,price:80000,facings:3,cap:36,power:0,cats:['getraenke','wein']},
 {id:'freezer',name:'Tiefkühltruhe',level:12,price:190000,facings:3,cap:24,power:1200,cats:['tk']},
 {id:'drug',name:'Drogerieregal',level:14,price:55000,facings:4,cap:24,power:0,cats:['drogerie','tier']},
 {id:'wine',name:'Weinregal',level:20,price:90000,facings:3,cap:18,power:0,cats:['wein']}
];

// ---------- Sortimente (Lizenzen) ----------
export const CATEGORIES=[
 {id:'grund',name:'Grundnahrung',level:1,price:0},{id:'back',name:'Backwaren',level:2,price:30000},{id:'molkerei',name:'Molkerei & Eier',level:3,price:120000},
 {id:'obst',name:'Obst & Gemüse',level:4,price:150000},{id:'konserven',name:'Konserven & Fertiges',level:5,price:200000},{id:'getraenke',name:'Getränke',level:6,price:300000},
 {id:'suess',name:'Süßwaren & Snacks',level:7,price:350000},{id:'kaffee',name:'Kaffee & Tee',level:9,price:500000},{id:'fleisch',name:'Fleisch & Wurst',level:10,price:800000},
 {id:'tk',name:'Tiefkühlkost',level:12,price:1000000},{id:'drogerie',name:'Drogerie & Haushalt',level:14,price:1200000},{id:'feinkost',name:'Feinkost',level:17,price:2000000},
 {id:'wein',name:'Wein & Spirituosen',level:20,price:3000000},{id:'bio',name:'Bio-Sortiment',level:24,price:4000000},{id:'tier',name:'Tierbedarf',level:27,price:3500000}
];

// ---------- Waren ----------
// [id, Name, Sortiment, EK €, VK €, Karton (Stück), Verpackung, Farbe 1, Farbe 2, Beliebtheit]
const P=[
 ['flour','Weizenmehl 1 kg','grund',0.52,0.79,10,'bag','#f3efe4','#2f6db5',8],['sugar','Zucker 1 kg','grund',0.68,0.99,10,'bag','#ffffff','#2f8f5a',6],
 ['pasta','Spaghetti 500 g','grund',0.58,0.99,20,'box','#1f4e9a','#f2c230',9],['rice','Langkornreis 1 kg','grund',1.15,1.79,12,'bag','#f4f1e8','#d0352f',6],
 ['oats','Haferflocken 500 g','grund',0.52,0.89,12,'box','#e8d6a8','#3d7a3a',6],['salt','Speisesalz 500 g','grund',0.24,0.45,24,'box','#2f6db5','#ffffff',3],
 ['oil','Sonnenblumenöl 1 l','grund',1.25,1.89,12,'bottle','#f2c21b','#2f8f3a',6],
 ['toast','Buttertoast 500 g','back',0.82,1.29,12,'loaf','#e8c27a','#d0352f',9],['bread','Bauernbrot 750 g','back',1.50,2.49,10,'loaf','#a8692f','#f0e0c0',7],
 ['rolls','Brötchen 6 Stück','back',0.78,1.49,15,'bag','#e6b56a','#ffffff',8],['croissant','Croissants 4 Stück','back',1.10,1.99,12,'bag','#e9a94a','#7a4a1a',5],
 ['milk','Frische Vollmilch 1 l','molkerei',0.82,1.09,12,'carton','#ffffff','#2f6db5',12],['butter','Deutsche Markenbutter 250 g','molkerei',1.50,1.99,20,'tub','#f2d34a','#2f6db5',8],
 ['yogurt','Naturjoghurt 500 g','molkerei',0.52,0.89,12,'cup','#ffffff','#5a9ad6',7],['gouda','Gouda jung 400 g','molkerei',2.35,3.49,12,'tray','#f2c94a','#d0352f',6],
 ['eggs','Eier Freiland 10 Stück','molkerei',2.00,2.79,10,'eggbox','#d8c8a6','#6a5a3a',9],['quark','Speisequark 500 g','molkerei',0.48,0.79,12,'cup','#ffffff','#2f8f5a',4],
 ['bananas','Bananen 1 kg','obst',1.05,1.69,18,'produce','#f2d23a','#7a5a1a',10],['apples','Äpfel Elstar 1 kg','obst',1.55,2.49,15,'produce','#d63a2f','#f2c23a',8],
 ['potatoes','Speisekartoffeln 2,5 kg','obst',1.85,2.99,8,'net','#c9a36a','#7a5a2a',7],['tomatoes','Rispentomaten 500 g','obst',1.20,1.99,12,'produce','#e0382c','#3f8f2a',7],
 ['cucumber','Salatgurke','obst',0.42,0.79,20,'produce','#2f7f2a','#5fa84a',6],['carrots','Möhren 1 kg','obst',0.72,1.29,12,'net','#ef8a2a','#4f9a3c',5],['onions','Zwiebeln 1 kg','obst',0.66,1.29,12,'net','#d9a35a','#7a5a2a',5],
 ['tomatocan','Gehackte Tomaten 400 g','konserven',0.46,0.79,24,'can','#d0352f','#3f8f2a',6],['corncan','Gemüsemais 285 g','konserven',0.60,0.99,24,'can','#f2c21b','#2f8f3a',4],
 ['tuna','Thunfisch in Öl 185 g','konserven',1.10,1.79,24,'can','#2f6db5','#e8e2d6',5],['ravioli','Ravioli 800 g','konserven',1.25,1.99,12,'can','#c0392b','#f2d34a',4],['soup','Erbseneintopf 800 g','konserven',1.30,2.19,12,'can','#3f7f2a','#f2d34a',3],
 ['water','Mineralwasser 1,5 l','getraenke',0.17,0.39,6,'pet','#bfe3f2','#2f6db5',10],['cola','Cola 1,5 l','getraenke',1.00,1.69,6,'pet','#3a1a10','#d0352f',8],
 ['ojuice','Orangensaft 1 l','getraenke',1.25,1.99,12,'carton','#f6a21c','#2f8f3a',6],['ajuice','Apfelsaft 1 l','getraenke',0.92,1.49,12,'carton','#e8b23a','#d0352f',5],['beer','Pils 0,5 l','getraenke',0.52,0.89,20,'bottle','#5a3a1a','#2f8f3a',8],
 ['choco','Vollmilchschokolade 100 g','suess',0.85,1.39,20,'bar','#5a2a8a','#ffffff',9],['gummy','Fruchtgummi 200 g','suess',0.78,1.29,18,'bag','#f2c21b','#d0352f',7],
 ['chips','Kartoffelchips 175 g','suess',1.12,1.89,15,'bag','#d0352f','#f2c21b',8],['cookies','Butterkekse 200 g','suess',0.90,1.49,16,'box','#f2d34a','#a8692f',6],
 ['coffee','Röstkaffee gemahlen 500 g','kaffee',4.90,6.99,12,'brick','#2a1a10','#c9a24a',8],['beans','Espresso Bohnen 1 kg','kaffee',10.80,14.99,6,'brick','#1a1a1a','#d0352f',4],
 ['tea','Schwarzer Tee 25 Btl.','kaffee',1.15,1.99,12,'box','#c0392b','#f2d34a',4],['cocoa','Kakaopulver 400 g','kaffee',1.85,2.99,10,'can','#7a3a1a','#f2c21b',3],
 ['chicken','Hähnchenbrustfilet 400 g','fleisch',3.55,4.99,10,'tray','#f2c4a8','#2f6db5',8],['mince','Hackfleisch gemischt 500 g','fleisch',3.15,4.49,10,'tray','#c0453a','#2f6db5',8],
 ['salami','Salami 100 g','fleisch',1.05,1.79,20,'tray','#9a2a2a','#f2d34a',6],['ham','Kochschinken 200 g','fleisch',1.25,1.99,16,'tray','#f0a090','#2f8f3a',6],['bratwurst','Rostbratwürstchen 400 g','fleisch',1.90,2.99,12,'tray','#c8743a','#2f6db5',5],
 ['pizza','Steinofenpizza Salami','tk',1.55,2.49,10,'pizza','#d0352f','#f2d34a',8],['fries','Pommes frites 1 kg','tk',1.35,2.29,12,'bag','#f2c21b','#d0352f',6],
 ['spinach','Rahmspinat 450 g','tk',0.72,1.29,12,'box','#2f7f2a','#ffffff',4],['fishsticks','Fischstäbchen 15 Stück','tk',1.85,2.99,12,'box','#2f6db5','#f2a21c',6],['icecream','Vanilleeis 1 l','tk',1.75,2.99,8,'tub','#f6efd8','#7a3a1a',5],
 ['toothpaste','Zahncreme 75 ml','drogerie',0.72,1.29,24,'box','#ffffff','#2f6db5',5],['showergel','Duschgel 250 ml','drogerie',0.82,1.45,16,'bottle','#5ac08a','#ffffff',5],
 ['toiletpaper','Toilettenpapier 8 Rollen','drogerie',2.60,3.95,6,'pack','#ffffff','#5a9ad6',7],['dishsoap','Spülmittel 500 ml','drogerie',0.68,1.25,16,'bottle','#9ad65a','#2f6db5',4],['detergent','Waschmittel 20 WL','drogerie',3.95,5.99,6,'box','#f26a1c','#2f6db5',4],
 ['oliveoil','Natives Olivenöl 0,75 l','feinkost',6.90,9.99,6,'bottle','#4a6a1a','#e8d29a',4],['parmesan','Parmigiano Reggiano 200 g','feinkost',3.40,4.99,10,'tray','#f2e2a8','#2a5a2a',4],
 ['pesto','Pesto Genovese 190 g','feinkost',1.50,2.49,12,'jar','#3f7f2a','#e8e2d6',4],['salmon','Räucherlachs 200 g','feinkost',2.60,3.99,10,'tray','#f08a5a','#1a3a5a',5],
 ['redwine','Rotwein Spätburgunder 0,75 l','wein',3.00,4.99,6,'wine','#5a1a2a','#e8d29a',6],['whitewine','Riesling trocken 0,75 l','wein',2.70,4.49,6,'wine','#d9cf7a','#2f5a8a',5],
 ['sekt','Sekt trocken 0,75 l','wein',2.40,3.99,6,'wine','#1a3a2a','#c9a24a',4],['whisky','Scotch Whisky 0,7 l','wein',16.80,24.99,6,'whisky','#b8782a','#1a1a1a',2],
 ['biomilk','Bio-Vollmilch 1 l','bio',1.02,1.39,12,'carton','#ffffff','#3f8f2a',5],['bioeggs','Bio-Eier 10 Stück','bio',2.85,3.99,10,'eggbox','#c9b88a','#3f8f2a',4],
 ['biobananas','Bio-Bananen 1 kg','bio',1.50,2.29,18,'produce','#e8d23a','#3f8f2a',4],['oatdrink','Bio-Haferdrink 1 l','bio',1.25,1.99,12,'carton','#e8d6a8','#3f8f2a',4],
 ['catfood','Katzennassfutter 100 g','tier',0.38,0.69,24,'can','#7a5ab0','#f2d34a',5],['dogfood','Hundefutter 800 g','tier',1.20,1.99,12,'can','#a8692f','#2f6db5',4],['litter','Katzenstreu 10 l','tier',2.60,3.99,4,'pack','#e8e2d6','#7a5ab0',3]
];
export const PRODUCTS=P.map(([id,name,cat,ek,vk,carton,pack,c1,c2,pop])=>({id,name,cat,ek:Math.round(ek*100),vk:Math.round(vk*100),carton,pack,c1,c2,pop}));
export const product=id=>PRODUCTS.find(p=>p.id===id);
export const category=id=>CATEGORIES.find(c=>c.id===id);
export const shelfType=id=>SHELVES.find(s=>s.id===id);
export const tier=id=>TIERS.find(t=>t.id===id);

// ---------- Personal ----------
export const STAFF=[
 {id:'cashier',name:'Kassierer/in',level:4,hours:14,desc:'Öffnet eine weitere Kasse. Kürzere Schlangen, weniger Kunden gehen.'},
 {id:'filler',name:'Regalbetreuer/in',level:5,hours:14,desc:'Füllt leere Warenplätze automatisch aus dem Lager auf (bis 400 Stück pro Stunde).'},
 {id:'buyer',name:'Disponent/in',level:12,hours:8,desc:'Bestellt abends automatisch nach, was im Lager knapp wird.'}
];
export const wagePerDay=s=>s.hours*MIN_WAGE;

// ---------- Lager ----------
export const STORAGE_STEP=300;
export const storageUpgradeCost=lvl=>150000*(lvl+1); // 1.500 € · 3.000 € · …

// ---------- Werbegemeinschaft (Gemeinschaftshaus) ----------
export const COMMUNITY_LEVEL=8, COMMUNITY_PRICE=1500000;
export const NEIGHBOURS=[['Bäckerei Krüger','Backstube'],['Blumen Lehmann','Floristik'],['Apotheke am Markt','Apotheke'],['Fleischerei Brandt','Metzgerei'],['Café Linde','Café'],['Schuhhaus Peters','Schuhe'],['Buchhandlung Seitenweise','Bücher'],['Optik Schulz','Optiker'],['Eisdiele Venezia','Eiscafé'],['Elektro Wagner','Elektro']];
export const COMMUNITY_SUGGESTIONS=[{name:'Werbering Altstadt',members:14,text:'Gemeinsame Stadtfeste und Prospekte'},{name:'Händlerbund Nord',members:9,text:'Einkaufsgemeinschaft für bessere Preise'},{name:'Marktplatz e. V.',members:21,text:'Wochenmarkt und verkaufsoffene Sonntage'}];
// Gemeinsame Aktionen, freigeschaltet durch Gemeinschaftspunkte
export const PERKS=[
 {id:'flyer',name:'Gemeinsamer Prospekt',cost:1,days:2,effect:{customers:0.15},text:'+15 % Kunden für 2 Tage'},
 {id:'fest',name:'Stadtfest',cost:3,days:1,effect:{customers:0.45},text:'+45 % Kunden für 1 Tag'},
 {id:'einkauf',name:'Einkaufsgemeinschaft',cost:2,days:5,effect:{ek:-0.04},text:'4 % günstiger einkaufen für 5 Tage'}
];

// ---------- Shop mit echtem Geld (noch nicht aktiv) ----------
export const PACKAGES=[{id:'start',name:'Gründerpaket',price:'4,99 €',content:'10.000 € Startkapital und ein Kühlregal'},{id:'filiale',name:'Filialpaket',price:'14,99 €',content:'50.000 € und eine Woche Großhandelsrabatt'},{id:'premium',name:'Premium-Händler',price:'2,99 € / Monat',content:'+10 % Kunden und Statistiken'}];
