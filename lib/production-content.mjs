// All monetary values are game cents. Seed packets are the only market purchases.
export const EXTRA_CROPS=[
 ['tulip','Tulpen','Tulpensamen','tulip',4,24,250,180],['lavender','Lavendel','Lavendelsamen','lavender',6,30,280,160],['strawberry','Erdbeeren','Erdbeersamen','strawberry',5,45,300,170],['raspberry','Himbeeren','Himbeersamen','raspberry',6,40,320,190],['blueberry','Heidelbeeren','Heidelbeersamen','blueberry',6,40,320,190],['apple','Äpfel','Apfelkerne','apple',7,50,350,150],['pear','Birnen','Birnenkerne','pear',7,45,350,180],['corn','Mais','Maissamen','corn',4,70,220,100],['oat','Hafer','Hafersaat','oat',4,70,220,95],['beet','Zuckerrüben','Zuckerrübensaat','beet',5,55,250,120],['rice','Reis','Reissaat','rice',5,65,250,240],['coffeePlant','Kaffee','Kaffeesamen','coffeeBean',8,35,400,230],['tobaccoPlant','Tabak','Tabaksamen','tobacco',8,40,400,null],['rapeseed','Raps','Rapssaat','rapeseed',5,60,250,110],['flax','Flachs','Leinsamen','flax',5,55,250,120],['onion','Zwiebeln','Zwiebelsamen','onion',4,50,200,110],['pumpkin','Kürbisse','Kürbissamen','pumpkin',6,30,280,250],['cucumber','Gurken','Gurkensamen','cucumber',4,50,230,140]
].map(([id,name,seedName,output,minutes,yieldCount,seedCost,retail])=>({id,name,seed:id+'Seed',seedName,output,minutes,yield:yieldCount,seedCost,retail}));
export const EXTRA_GOODS=[
 ['feed','Tierfutter',null,60],['coffeeBean','Kaffeebohnen',null,180],['water','Wasser',90,50],['cream','Sahne',220,120],['cake','Kuchen',650,360],['bun','Brötchen',85,50],['strawberryJam','Erdbeermarmelade',440,250],['raspberryJam','Himbeermarmelade',460,270],['blueberryJam','Heidelbeermarmelade',460,270],['appleJam','Apfelkonfitüre',380,220],['duckEgg','Enteneier',90,55],['goatMilk','Ziegenmilch',230,130],['rabbitMeat','Kaninchenfleisch',680,400],['beef','Rindfleisch',850,500],['poultryMeat','Geflügelfleisch',590,350],['oil','Pflanzenöl',320,180],['cloth','Leinenstoff',450,260],['candle','Bienenwachskerze',380,210],['wax','Bienenwachs',null,120]
].map(([id,name,retail,wholesale])=>({id,name,retail,wholesale,buy:Math.max(1,Math.floor(wholesale*.8))}));
export const PRODUCTION_BUSINESSES=[
 ['well','Brunnen & Wasserversorgung','ressourcen',1,5000,'Wasser für Landwirtschaft und Lebensmittel selbst fördern.'],
 ['mill','Mühle & Futtermischerei','verarbeitung',2,50000,'Weizen mahlen und aus eigenem Getreide Tierfutter herstellen.'],
 ['pigfarm','Schweinehof','tiere',3,160000,'Ein Schweinebestand mit Futterversorgung und Fleischerzeugung.'],
 ['goatfarm','Ziegenhof','tiere',3,130000,'Ziegen halten und eigene Ziegenmilch erzeugen.'],
 ['duckfarm','Entenhof','tiere',4,110000,'Enten halten und Enteneier erzeugen.'],
 ['rabbitfarm','Kaninchenhof','tiere',4,120000,'Kaninchen halten und Fleisch für den Verkauf gewinnen.'],
 ['beefFarm','Rinderhof','tiere',5,220000,'Rinder mit selbst erzeugtem Tierfutter versorgen.'],
 ['meatPoultry','Geflügelmast','tiere',4,130000,'Geflügelfleisch aus eigener Tierhaltung.'],
 ['bakery','Bäckerei','verarbeitung',3,140000,'Eigenes Mehl zu Brot, Brötchen und Kuchen verarbeiten.'],
 ['sugarworks','Zuckerfabrik','verarbeitung',3,100000,'Aus eigenen Zuckerrüben Zucker herstellen.'],
 ['jamfactory','Marmeladenfabrik','verarbeitung',4,180000,'Eigene Früchte mit selbst erzeugtem Zucker einkochen.'],
 ['apiary','Imkerei & Honigfabrik','tiere',3,140000,'Bienen mit eigenen Blüten versorgen; Honig und Wachs gewinnen.'],
 ['juicery','Mosterei','verarbeitung',4,150000,'Äpfel zu eigenem Apfelsaft pressen.'],
 ['roastery','Kaffeerösterei','verarbeitung',5,180000,'Selbst geerntete Kaffeebohnen rösten.'],
 ['oilpress','Ölmühle','verarbeitung',5,160000,'Raps zu Pflanzenöl pressen.'],
 ['weaving','Weberei','verarbeitung',6,180000,'Flachs zu Leinenstoff verarbeiten.'],
 ['soapworks','Seifenmanufaktur','verarbeitung',6,170000,'Pflanzenöl und Lavendel zu Seife verarbeiten.'],
 ['saltworks','Salzwerk','verarbeitung',5,130000,'Salzhaltiges Quellwasser aus der Spielwelt zu Salz verarbeiten.']
].map(([id,name,group,level,cost,description])=>({id,name,group,category:group==='tiere'?'tiere':'farm',level,cost,fixed:group==='ressourcen'?0:300,description}));
const recipe=(id,business,name,inputs,outputs,minutes,level=1)=>({id,business,name,inputs,outputs,minutes,level});
export const RECIPES=[
 recipe('water','well','Wasser fördern',{}, {water:150},1),
 recipe('flour','mill','Mehl mahlen',{wheat:30},{flour:24},2),
 recipe('feedCorn','mill','Maisfutter mischen',{corn:30,wheat:10},{feed:100},2),
 recipe('feedOat','mill','Haferfutter mischen',{oat:30,wheat:10},{feed:100},2),
 recipe('pigMeat','pigfarm','Schweinefleisch erzeugen',{feed:30},{meat:25},6),
 recipe('milk','dairyfarm','Milchkühe versorgen',{feed:20},{milk:60},4),
 recipe('eggs','poultry','Hühner versorgen',{feed:10},{egg:80},3),
 recipe('wool','sheepfarm','Schafe versorgen',{feed:20},{wool:35},5),
 recipe('goatMilk','goatfarm','Ziegen versorgen',{feed:15},{goatMilk:40},4),
 recipe('duckEgg','duckfarm','Enten versorgen',{feed:15},{duckEgg:50},4),
 recipe('rabbitMeat','rabbitfarm','Kaninchen versorgen',{feed:20,carrot:10},{rabbitMeat:25},5),
 recipe('beef','beefFarm','Rinder versorgen',{feed:40},{beef:30},7),
 recipe('poultryMeat','meatPoultry','Mastgeflügel versorgen',{feed:25},{poultryMeat:35},5),
 recipe('bread','bakery','Brot backen',{flour:20,water:10},{bread:30},3),
 recipe('bun','bakery','Brötchen backen',{flour:20,water:10},{bun:60},3),
 recipe('cake','bakery','Kuchen backen',{flour:15,egg:10,sugar:10,milk:10},{cake:20},5),
 recipe('sugar','sugarworks','Zucker gewinnen',{beet:40},{sugar:30},3),
 recipe('strawberryJam','jamfactory','Erdbeermarmelade kochen',{strawberry:30,sugar:10,water:5},{strawberryJam:25},4),
 recipe('raspberryJam','jamfactory','Himbeermarmelade kochen',{raspberry:30,sugar:10,water:5},{raspberryJam:25},4),
 recipe('blueberryJam','jamfactory','Heidelbeermarmelade kochen',{blueberry:30,sugar:10,water:5},{blueberryJam:25},4),
 recipe('appleJam','jamfactory','Apfelkonfitüre kochen',{apple:30,sugar:10,water:5},{appleJam:25},4),
 recipe('honey','apiary','Honig gewinnen',{sunflower:10},{honey:25,wax:10},5),
 recipe('roseHoney','apiary','Blütenhonig gewinnen',{rose:10},{honey:25,wax:10},5),
 recipe('candle','apiary','Wachskerzen gießen',{wax:10},{candle:15},3),
 recipe('cheese','cheeseshop','Käse herstellen',{milk:30},{cheese:20},3),
 recipe('goatCheese','cheeseshop','Käse aus Ziegenmilch',{goatMilk:30},{cheese:22},3),
 recipe('butter','cheeseshop','Butter schlagen',{milk:30},{butter:20},3),
 recipe('yogurt','cheeseshop','Joghurt herstellen',{milk:30},{yogurt:35},3),
 recipe('cream','cheeseshop','Sahne gewinnen',{milk:30},{cream:25},3),
 recipe('sausage','butcher','Wurst herstellen',{meat:20},{sausage:35},3),
 recipe('juice','juicery','Apfelsaft pressen',{apple:40},{juice:30},3),
 recipe('coffee','roastery','Kaffee rösten',{coffeeBean:30},{coffee:25},4),
 recipe('oil','oilpress','Rapsöl pressen',{rapeseed:40},{oil:25},3),
 recipe('cloth','weaving','Leinen weben',{flax:40},{cloth:25},4),
 recipe('soap','soapworks','Lavendelseife herstellen',{oil:10,lavender:15,water:5},{soap:30},4),
 recipe('salt','saltworks','Quellsalz gewinnen',{water:60},{salt:30},3),
 recipe('pasta','mill','Nudeln formen',{flour:20,water:10},{pasta:30},3)
];
export const fieldLimit=g=>Math.min(16,1+Math.floor((g.xp||0)/100));
export const warehouseUpgradeCost=g=>50000*((g.warehouseLevel||0)+1);
