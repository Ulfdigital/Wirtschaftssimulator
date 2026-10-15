// Wirtschaftssimulator 0.6 – realistische Wirtschaftsdaten.
// Alle Geldwerte im Spiel sind ganze Cent. In dieser Datei stehen Euro-Beträge, die unten in Cent umgerechnet werden.
// Quellen/Richtwerte (Stand Oktober 2026): Erzeugerpreise agrarheute 42. KW 2026 (Weizen 209 €/t, Raps 519 €/t,
// Körnermais 234 €/t, Braugerste 201 €/t, Futtergerste 184 €/t, Roggen 169 €/t, Speisekartoffeln 28,87 €/dt),
// Bodenpreis Ackerland MV 2025: 24.176 €/ha, Pacht MV: rund 280 €/ha und Jahr. Erträge, Saatgut- und
// Bewirtschaftungskosten sind typische Durchschnittswerte für Deutschland (ohne Förderung).
// Ein Acker ist immer 1 Hektar. Eine Aussaat entspricht einem Anbaujahr (eine Saison), die Spielzeit ist verkürzt:
// rund 1 echte Minute je Monat Kulturdauer.
const cent=euro=>Math.round(euro*100);
export const LAND={buyPrice:cent(24176),lease:cent(280),hectares:1};

// [id, Name, Level, Gruppe, Einheit, Ertrag je ha, Saatgut-Name, Saatgut €/ha, Bewirtschaftung €/ha, Erzeugerpreis €/Einheit, Minuten, Erzeugnis-ID, Abpackung]
// Abpackung: [Waren-ID, Name, Packungen je Einheit, Ladenpreis €]
const CROP_ROWS=[
 // Level 1
 ['grain','Winterweizen',1,'Getreide','dt',75,'Weizen-Saatgut',120,850,20.86,10,'wheat'],
 ['potato','Speisekartoffeln',1,'Hackfrüchte','dt',400,'Pflanzkartoffeln',1800,3000,28.87,5,'potato',['potatoBag','Kartoffeln 2,5-kg-Beutel',40,2.99]],
 ['carrot','Möhren',1,'Gemüse','dt',550,'Möhren-Saatgut',900,5500,30,4,'carrot',['carrotBag','Möhren 1-kg-Beutel',100,1.29]],
 ['onion','Speisezwiebeln',1,'Gemüse','dt',500,'Steckzwiebeln',700,3500,25,5,'onion',['onionNet','Zwiebeln 1-kg-Netz',100,1.49]],
 ['rye','Winterroggen',1,'Getreide','dt',60,'Roggen-Saatgut',110,650,16.86,10,'ryeGrain'],
 // Level 2
 ['barley','Wintergerste',2,'Getreide','dt',70,'Gersten-Saatgut',110,750,18.37,9,'barleyGrain'],
 ['oat','Hafer',2,'Getreide','dt',50,'Hafer-Saatgut',90,550,22,5,'oat'],
 ['lettuce','Kopfsalat',2,'Gemüse','Tsd. Köpfe',50,'Salat-Jungpflanzen',1500,8000,350,2,'lettuce',['lettuceHead','Kopfsalat · Stück',1000,0.99]],
 ['radish','Radieschen',2,'Gemüse','Tsd. Bund',120,'Radieschen-Saatgut',600,10500,200,2,'radish',['radishBunch','Radieschen · Bund',1000,0.89]],
 // Level 3
 ['rapeseed','Winterraps',3,'Ölfrüchte & Hülsenfrüchte','dt',38,'Raps-Saatgut',90,1000,51.93,11,'rapeseed'],
 ['corn','Körnermais',3,'Getreide','dt',95,'Mais-Saatgut',230,900,23.42,6,'corn'],
 ['sunflower','Sonnenblumen',3,'Ölfrüchte & Hülsenfrüchte','dt',28,'Sonnenblumen-Saatgut',150,600,45,5,'sunflower'],
 ['pea','Futtererbsen',3,'Ölfrüchte & Hülsenfrüchte','dt',40,'Erbsen-Saatgut',160,500,26,4,'pea'],
 ['tulip','Tulpen',3,'Blumen','Tsd. Stiele',250,'Tulpenzwiebeln',20000,10000,150,4,'tulip',['tulipBunch','Tulpen · Bund (10 Stiele)',100,2.99]],
 // Level 4
 ['beet','Zuckerrüben',4,'Hackfrüchte','t',75,'Zuckerrüben-Saatgut',300,1300,40,7,'beet'],
 ['strawberry','Erdbeeren',4,'Obst & Beeren','dt',150,'Erdbeer-Jungpflanzen',9000,40000,450,3,'strawberry',['strawberryTray','Erdbeeren 500-g-Schale',200,2.99]],
 ['cucumber','Salatgurken',4,'Gemüse','Tsd. Stück',120,'Gurken-Jungpflanzen',3000,20000,250,3,'cucumber',['cucumberPiece','Salatgurke · Stück',1000,0.69]],
 ['kohlrabi','Kohlrabi',4,'Gemüse','Tsd. Stück',55,'Kohlrabi-Jungpflanzen',1800,8000,300,2,'kohlrabi',['kohlrabiPiece','Kohlrabi · Stück',1000,0.79]],
 ['triticale','Triticale',4,'Getreide','dt',65,'Triticale-Saatgut',100,650,18,10,'triticaleGrain'],
 // Level 5
 ['cabbage','Weißkohl',5,'Gemüse','dt',700,'Weißkohl-Jungpflanzen',900,4500,15,5,'cabbage',['cabbageHead','Weißkohl · Kopf (ca. 1,5 kg)',65,1.49]],
 ['redcabbage','Rotkohl',5,'Gemüse','dt',500,'Rotkohl-Jungpflanzen',900,4500,20,5,'redcabbage',['redcabbageHead','Rotkohl · Kopf (ca. 1,5 kg)',65,1.79]],
 ['cauliflower','Blumenkohl',5,'Gemüse','Tsd. Köpfe',30,'Blumenkohl-Jungpflanzen',1800,9000,700,3,'cauliflower',['cauliflowerHead','Blumenkohl · Kopf',1000,1.99]],
 ['fababean','Ackerbohnen',5,'Ölfrüchte & Hülsenfrüchte','dt',45,'Ackerbohnen-Saatgut',150,500,25,5,'fababean'],
 // Level 6
 ['apple','Tafeläpfel',6,'Obst & Beeren','dt',350,'Apfelanlage (Jahreskosten)',4000,12000,60,6,'apple',['appleBag','Äpfel 1-kg-Beutel',100,2.49]],
 ['pear','Tafelbirnen',6,'Obst & Beeren','dt',250,'Birnenanlage (Jahreskosten)',4000,12000,80,6,'pear',['pearBag','Birnen 1-kg-Beutel',100,2.99]],
 ['broccoli','Brokkoli',6,'Gemüse','dt',120,'Brokkoli-Jungpflanzen',1500,9000,120,3,'broccoli',['broccoliPiece','Brokkoli 500 g',200,1.29]],
 ['zucchini','Zucchini',6,'Gemüse','dt',400,'Zucchini-Jungpflanzen',1500,12000,70,3,'zucchini',['zucchiniPiece','Zucchini · Stück (ca. 300 g)',330,0.79]],
 ['pumpkin','Hokkaido-Kürbisse',6,'Gemüse','dt',350,'Kürbis-Saatgut',1200,6000,60,5,'pumpkin',['pumpkinPiece','Hokkaido-Kürbis · Stück (ca. 1,2 kg)',80,1.99]],
 ['spelt','Dinkel',6,'Getreide','dt',45,'Dinkel-Saatgut',140,600,35,10,'speltGrain'],
 // Level 7
 ['tomato','Tomaten (Folientunnel)',7,'Gemüse','dt',600,'Tomaten-Jungpflanzen',8000,60000,140,5,'tomato',['tomatoTray','Tomaten 500-g-Schale',200,1.79]],
 ['raspberry','Himbeeren',7,'Obst & Beeren','dt',80,'Himbeer-Jungpflanzen',8000,45000,900,4,'raspberry',['raspberryTray','Himbeeren 250-g-Schale',400,2.99]],
 ['blueberry','Heidelbeeren',7,'Obst & Beeren','dt',90,'Heidelbeer-Anlage (Jahreskosten)',10000,40000,800,4,'blueberry',['blueberryTray','Heidelbeeren 250-g-Schale',400,2.99]],
 ['lavender','Lavendel',7,'Blumen','dt',30,'Lavendel-Jungpflanzen',3000,8000,600,5,'lavender',['lavenderBouquet','Lavendelstrauß',1000,3.99]],
 // Level 8
 ['asparagus','Spargel',8,'Gemüse','dt',60,'Spargelanlage (Jahreskosten)',3000,30000,900,4,'asparagus',['asparagusBunch','Spargel 500-g-Bund',200,6.99]],
 ['cherry','Süßkirschen',8,'Obst & Beeren','dt',80,'Kirschanlage (Jahreskosten)',5000,25000,500,4,'cherry',['cherryTray','Kirschen 500-g-Schale',200,3.99]],
 ['plum','Pflaumen',8,'Obst & Beeren','dt',200,'Pflaumenanlage (Jahreskosten)',4000,10000,100,5,'plum',['plumBag','Pflaumen 1-kg-Beutel',100,2.99]],
 ['rose','Rosen (Gewächshaus)',8,'Blumen','Tsd. Stiele',100,'Rosen-Jungpflanzen',15000,15000,350,5,'rose',['roseBunch','Rosen · Bund (10 Stiele)',100,5.99]],
 ['flax','Faserlein (Flachs)',8,'Sonderkulturen','dt',12,'Leinsaat',150,900,150,4,'flax'],
 // Level 9
 ['pepper','Paprika (Gewächshaus)',9,'Gemüse','dt',700,'Paprika-Jungpflanzen',12000,100000,200,6,'pepper',['pepperPiece','Paprika · Stück (ca. 200 g)',500,0.99]],
 ['hops','Hopfen',9,'Sonderkulturen','dt',20,'Hopfengarten (Jahreskosten)',3000,9000,800,6,'hops'],
 ['soy','Sojabohnen',9,'Ölfrüchte & Hülsenfrüchte','dt',30,'Soja-Saatgut',200,600,45,5,'soy'],
 // Level 10 und höher
 ['grape','Tafeltrauben',10,'Obst & Beeren','dt',120,'Rebanlage (Jahreskosten)',5000,12000,180,6,'grape',['grapeTray','Trauben 500-g-Schale',200,2.49]],
 ['tobaccoPlant','Tabak',12,'Sonderkulturen','dt',25,'Tabak-Jungpflanzen',1000,8000,500,6,'tobacco'],
 ['rice','Reis (Versuchsanbau)',14,'Sonderkulturen','dt',60,'Reis-Saatgut',150,2500,45,6,'rice',['riceBag','Reis 1-kg-Packung',100,2.29]],
 ['coffeePlant','Kaffee (Tropenhaus)',15,'Sonderkulturen','dt',10,'Kaffee-Jungpflanzen',3000,20000,600,8,'coffeeBean']
];
export const CROP_GROUPS=['Getreide','Hackfrüchte','Gemüse','Ölfrüchte & Hülsenfrüchte','Obst & Beeren','Blumen','Sonderkulturen'];
export const CROP_DATA=CROP_ROWS.map(([id,name,level,group,unit,yieldCount,seedName,seedCost,work,price,minutes,output,pack])=>({id,name,level,group,unit,yield:yieldCount,seed:id+'Seed',seedName,seedCost:cent(seedCost),workCost:cent(work),price:cent(price),minutes,output,pack:pack&&{id:pack[0],name:pack[1],per:pack[2],retail:cent(pack[3])}}));
// Die Erzeugnis-IDs „wheat“ und „potato“ waren schon im ersten Spielstand enthalten und behalten ihre Position.
const CROP_OUTPUT_NAMES={wheat:'Weizen',ryeGrain:'Roggen',barleyGrain:'Gerste',triticaleGrain:'Triticale',speltGrain:'Dinkel',coffeeBean:'Rohkaffee',tobacco:'Rohtabak',flax:'Leinfasern',hops:'Hopfen',lavender:'Lavendelblüten'};
export const cropGoods=()=>CROP_DATA.flatMap(c=>{
 const raw={id:c.output,name:CROP_OUTPUT_NAMES[c.output]||c.name.replace(/ \(.*\)$/,''),unit:c.unit,buy:Math.round(c.price*.9),retail:null,wholesale:c.price,group:c.group};
 const seed={id:c.seed,name:c.seedName+' · 1 ha',unit:'Paket (1 ha)',buy:c.seedCost,retail:null,wholesale:Math.round(c.seedCost*.6),seed:true,group:'Saatgut'};
 const pack=c.pack&&{id:c.pack.id,name:c.pack.name,unit:'Stück',buy:Math.round(c.pack.retail*.45),retail:c.pack.retail,wholesale:Math.max(1,Math.round(c.price/c.pack.per*1.25)),group:c.group==='Blumen'?'Blumen':'Obst & Gemüse (abgepackt)'};
 return [seed,raw,...(pack?[pack]:[])];
});
// Verarbeitete Waren: [ID, Name, Einheit, Ladenpreis €, Großhandelspreis €, Gruppe]
const PROCESSED_ROWS=[
 ['bread','Bauernbrot 750 g','Stück',2.99,1.40,'Backwaren'],
 ['bun','Brötchen','Stück',0.40,0.18,'Backwaren'],
 ['cake','Blechkuchen (ganzer Kuchen)','Stück',8.99,4.50,'Backwaren'],
 ['flour','Weizenmehl 1 kg','Stück',0.89,0.45,'Grundnahrungsmittel'],
 ['pasta','Nudeln 500 g','Stück',1.29,0.65,'Grundnahrungsmittel'],
 ['sugar','Zucker 1 kg','Stück',1.19,0.70,'Grundnahrungsmittel'],
 ['salt','Speisesalz 500 g','Stück',0.49,0.20,'Grundnahrungsmittel'],
 ['oil','Rapsöl 1 L','Flasche',2.49,1.10,'Grundnahrungsmittel'],
 ['coffee','Röstkaffee 500 g','Packung',7.99,4.50,'Grundnahrungsmittel'],
 ['water','Brunnenwasser','Liter',null,0.01,'Rohstoffe & Futter'],
 ['mineralWater','Mineralwasser 1,5 L','Flasche',0.59,0.20,'Getränke'],
 ['juice','Apfelsaft 1 L','Flasche',1.49,0.60,'Getränke'],
 ['milk','Vollmilch 1 L','Liter',1.15,0.45,'Tierprodukte'],
 ['goatMilk','Ziegenmilch 1 L','Liter',2.49,1.00,'Tierprodukte'],
 ['butter','Butter 250 g','Stück',2.29,1.40,'Tierprodukte'],
 ['cheese','Käse am Stück 1 kg','kg',11.99,6.50,'Tierprodukte'],
 ['yogurt','Joghurt 500 g','Becher',0.99,0.40,'Tierprodukte'],
 ['cream','Schlagsahne 200 ml','Becher',1.19,0.55,'Tierprodukte'],
 ['egg','Eier 10er-Packung','Packung',2.99,1.60,'Tierprodukte'],
 ['duckEgg','Enteneier 6er-Packung','Packung',3.49,2.00,'Tierprodukte'],
 ['meat','Schweinefleisch','kg',8.99,2.10,'Fleisch & Wurst'],
 ['beef','Rindfleisch','kg',16.99,5.00,'Fleisch & Wurst'],
 ['poultryMeat','Hähnchenfleisch','kg',7.99,1.40,'Fleisch & Wurst'],
 ['rabbitMeat','Kaninchenfleisch','kg',14.99,6.00,'Fleisch & Wurst'],
 ['sausage','Wurst','kg',12.99,5.50,'Fleisch & Wurst'],
 ['wool','Rohwolle','kg',null,1.00,'Rohstoffe & Futter'],
 ['feed','Mischfutter','dt',null,32,'Rohstoffe & Futter'],
 ['honey','Blütenhonig 500 g','Glas',5.99,3.50,'Grundnahrungsmittel'],
 ['wax','Bienenwachs','kg',null,12,'Rohstoffe & Futter'],
 ['candle','Bienenwachskerze','Stück',6.99,3.00,'Haushalt'],
 ['soap','Lavendelseife 100 g','Stück',3.49,1.20,'Haushalt'],
 ['cloth','Leinenstoff','Meter',14.99,7.00,'Haushalt'],
 ['strawberryJam','Erdbeerkonfitüre 450 g','Glas',2.49,1.10,'Grundnahrungsmittel'],
 ['raspberryJam','Himbeerkonfitüre 450 g','Glas',2.79,1.25,'Grundnahrungsmittel'],
 ['blueberryJam','Heidelbeerkonfitüre 450 g','Glas',2.79,1.25,'Grundnahrungsmittel'],
 ['appleJam','Apfelgelee 450 g','Glas',2.29,1.00,'Grundnahrungsmittel']
];
export const PROCESSED_GOODS=PROCESSED_ROWS.map(([id,name,unit,retail,wholesale,group])=>({id,name,unit,retail:retail==null?null:cent(retail),wholesale:cent(wholesale),buy:Math.max(1,Math.round(cent(wholesale)*.8)),group}));

// Betriebe: realistische Investitionen für kleine Hofbetriebe (Übernahme bzw. Einrichtung).
export const PRODUCTION_BUSINESSES=[
 ['packstation','Hofladen-Packstation','verarbeitung',1,3500,'Eigene Ernte waschen, sortieren und für den Laden abpacken (Beutel, Schalen, Bunde).'],
 ['well','Brunnen & Wasserversorgung','ressourcen',1,6000,'Eigener Brunnen für Landwirtschaft, Lebensmittel und Abfüllung.'],
 ['mill','Hofmühle & Futtermischerei','verarbeitung',2,25000,'Getreide zu Mehl mahlen und eigenes Mischfutter herstellen.'],
 ['pigfarm','Schweinestall (10 Plätze)','tiere',3,30000,'Schweine mit eigenem Futter mästen; je Charge ein Mastschwein.'],
 ['goatfarm','Ziegenhof','tiere',3,20000,'Ziegen halten und Ziegenmilch erzeugen.'],
 ['duckfarm','Entenhof','tiere',4,8000,'Enten halten und Enteneier erzeugen.'],
 ['rabbitfarm','Kaninchenstall','tiere',4,6000,'Kaninchen mit Futter und Möhren versorgen.'],
 ['beefFarm','Rinderstall','tiere',5,60000,'Rinder mit eigenem Futter mästen; je Charge ein Mastrind.'],
 ['meatPoultry','Hähnchenmaststall','tiere',4,15000,'Masthähnchen aus eigenem Futter.'],
 ['bakery','Bäckerei','verarbeitung',3,45000,'Mehl, Wasser und Zutaten zu Brot, Brötchen und Kuchen backen.'],
 ['sugarworks','Zuckersiederei','verarbeitung',4,80000,'Aus Zuckerrüben Zucker gewinnen (ca. 16 % Zuckergehalt).'],
 ['jamfactory','Konfitürenküche','verarbeitung',4,30000,'Eigene Früchte mit eigenem Zucker zu Konfitüre einkochen.'],
 ['apiary','Imkerei (20 Völker)','tiere',3,6000,'Bienen an deinen Blühflächen; Honig schleudern und Wachs gewinnen.'],
 ['juicery','Mosterei','verarbeitung',6,25000,'Äpfel zu Apfelsaft pressen und abfüllen.'],
 ['roastery','Kaffeerösterei','verarbeitung',15,35000,'Rohkaffee rösten und abpacken.'],
 ['oilpress','Ölmühle','verarbeitung',5,20000,'Raps kalt pressen (ca. 40 % Ölgehalt).'],
 ['weaving','Leinenweberei','verarbeitung',8,40000,'Leinfasern zu Leinenstoff weben.'],
 ['soapworks','Seifenmanufaktur','verarbeitung',7,15000,'Rapsöl und Lavendel zu Seife verarbeiten.'],
 ['saltworks','Salzsiederei','verarbeitung',5,50000,'Salzhaltiges Quellwasser zu Speisesalz sieden.']
].map(([id,name,group,level,cost,description])=>({id,name,group,category:group==='tiere'?'tiere':'farm',level,cost:cent(cost),fixed:group==='ressourcen'?0:300,description}));

const recipe=(id,business,name,inputs,outputs,minutes,level=1)=>({id,business,name,inputs,outputs,minutes,level});
export const RECIPES=[
 recipe('water','well','Wasser fördern',{},{water:1000},1),
 recipe('mineralWater','well','Mineralwasser abfüllen',{water:20},{mineralWater:12},1),
 // Mühle: 1 dt Weizen ergibt rund 75 kg Mehl (Ausmahlung Type 405).
 recipe('flour','mill','Mehl mahlen (1 dt Weizen → 75 kg)',{wheat:1},{flour:75},2),
 recipe('feedCorn','mill','Maisfutter mischen',{corn:8,wheat:2},{feed:10},2),
 recipe('feedOat','mill','Haferfutter mischen',{oat:8,wheat:2},{feed:10},2),
 recipe('feedBarley','mill','Gerstenfutter mischen',{barleyGrain:6,pea:4},{feed:10},2),
 recipe('pasta','mill','Nudeln herstellen',{flour:25,water:5},{pasta:50},3),
 // Tiere: Futterbedarf je Charge nach typischer Futterverwertung.
 recipe('pigMeat','pigfarm','Mastschwein (3 dt Futter → 95 kg)',{feed:3},{meat:95},6),
 recipe('milk','dairyfarm','Milchkühe füttern (1 dt → 200 L)',{feed:1},{milk:200},4),
 recipe('eggs','poultry','Legehennen füttern (1 dt → 70 Packungen)',{feed:1},{egg:70},3),
 recipe('wool','sheepfarm','Schafe scheren',{feed:1},{wool:20},5),
 recipe('goatMilk','goatfarm','Ziegen melken (1 dt → 200 L)',{feed:1},{goatMilk:200},4),
 recipe('duckEgg','duckfarm','Enten füttern',{feed:1},{duckEgg:20},4),
 recipe('rabbitMeat','rabbitfarm','Kaninchenmast',{feed:1,carrot:1},{rabbitMeat:30},5),
 recipe('beef','beefFarm','Mastrind (30 dt Futter → 380 kg)',{feed:30},{beef:380},7),
 recipe('poultryMeat','meatPoultry','Hähnchenmast (1 dt → 45 kg)',{feed:1},{poultryMeat:45},5),
 recipe('bread','bakery','Bauernbrot backen',{flour:45,water:30,salt:2},{bread:100},3),
 recipe('bun','bakery','Brötchen backen',{flour:30,water:20},{bun:600},3),
 recipe('cake','bakery','Blechkuchen backen',{flour:10,egg:4,sugar:8,milk:10,butter:4},{cake:30},5),
 recipe('sugar','sugarworks','Zucker gewinnen (1 t Rüben → 160 kg)',{beet:1},{sugar:160},3),
 recipe('strawberryJam','jamfactory','Erdbeerkonfitüre kochen',{strawberry:1,sugar:60},{strawberryJam:350},4),
 recipe('raspberryJam','jamfactory','Himbeerkonfitüre kochen',{raspberry:1,sugar:60},{raspberryJam:350},4),
 recipe('blueberryJam','jamfactory','Heidelbeerkonfitüre kochen',{blueberry:1,sugar:60},{blueberryJam:350},4),
 recipe('appleJam','jamfactory','Apfelgelee kochen',{apple:1,sugar:50},{appleJam:300},4),
 recipe('honey','apiary','Sonnenblumentracht schleudern',{sunflower:1},{honey:80,wax:2},5),
 recipe('roseHoney','apiary','Lavendeltracht schleudern',{lavender:1},{honey:60,wax:2},5),
 recipe('candle','apiary','Wachskerzen gießen',{wax:1},{candle:8},3),
 recipe('cheese','cheeseshop','Käse herstellen (10 L → 1 kg)',{milk:100},{cheese:10},3),
 recipe('goatCheese','cheeseshop','Ziegenkäse herstellen',{goatMilk:100},{cheese:12},3),
 recipe('butter','cheeseshop','Butter schlagen (22 L → 1 kg)',{milk:220},{butter:40},3),
 recipe('yogurt','cheeseshop','Joghurt ansetzen',{milk:50},{yogurt:100},3),
 recipe('cream','cheeseshop','Sahne abschöpfen',{milk:100},{cream:50},3),
 recipe('sausage','butcher','Wurst herstellen',{meat:80,salt:4},{sausage:100},3),
 recipe('juice','juicery','Apfelsaft pressen (1 dt → 70 L)',{apple:1},{juice:70},3),
 recipe('coffee','roastery','Kaffee rösten (1 dt → 84 kg)',{coffeeBean:1},{coffee:168},4),
 recipe('oil','oilpress','Rapsöl pressen (1 dt → 40 L)',{rapeseed:1},{oil:40},3),
 recipe('cloth','weaving','Leinen weben',{flax:1},{cloth:40},4),
 recipe('soap','soapworks','Lavendelseife sieden',{oil:20,lavender:1,water:10},{soap:300},4),
 recipe('salt','saltworks','Quellsalz sieden',{water:500},{salt:30},3),
 // Abpacken für den Laden
 ...CROP_DATA.filter(c=>c.pack).map(c=>recipe('pack_'+c.id,'packstation',`${c.pack.name} abpacken`,{[c.output]:1},{[c.pack.id]:c.pack.per},1,c.level))
];
export const fieldLimit=g=>Math.min(16,1+Math.floor((g.xp||0)/100));
export const warehouseUpgradeCost=g=>500000*((g.warehouseLevel||0)+1);
// Alte Erträge (Version 0.5) für die einmalige Umrechnung bestehender Spielstände.
export const LEGACY_YIELDS={rose:20,wheat:40,potato:35,sunflower:20,carrot:30,tomato:30,tulip:24,lavender:30,strawberry:45,raspberry:40,blueberry:40,apple:50,pear:45,corn:70,oat:70,beet:55,rice:65,coffeeBean:35,tobacco:40,rapeseed:60,flax:55,onion:50,pumpkin:30,cucumber:50,feed:100};
