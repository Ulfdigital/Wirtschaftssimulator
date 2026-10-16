# Wirtschaftssimulator 1.0

Vom Tante-Emma-Laden zum Verbrauchermarkt: Regale bestücken, im Großhandel einkaufen, Preise setzen, Personal einstellen und den Laden Stufe für Stufe ausbauen. Browser-Spiel, gespeichert auf dem Gerät (`wirtschaftssimulator-v2`). Version 1.0 ist ein kompletter Neustart; alte Spielstände werden nicht übernommen.

## So läuft ein Tag
Der Laden ist von 7 bis 21 Uhr geöffnet. Eine echte Sekunde ist eine Spielminute (Tempo 1×, 2×, 4×, 8×). Vor dem Öffnen räumst du Regale ein und bestellst Ware (bei geschlossenem Laden kommt sie sofort, sonst nach 30 Minuten). Kunden kommen je nach Ladengröße, Sortimentsbreite, Zufriedenheit und Tageszeit, nehmen Ware aus den Regalen und stellen sich an die Kassen. Um 21 Uhr folgt der Tagesabschluss mit Umsatz, Wareneinsatz, Miete, Löhnen und Strom.

## Ladenstufen
| Stufe | Level | Kosten | Regale | Kassen | Kunden/Tag |
| --- | --- | --- | --- | --- | --- |
| Tante-Emma-Laden | 1 | Start | 2 | 1 | ~110 |
| Dorfladen | 3 | 2.500 € | 4 | 1 | ~240 |
| Nachbarschaftsmarkt | 6 | 9.000 € | 6 | 2 | ~480 |
| Lebensmittelmarkt | 10 | 30.000 € | 9 | 3 | ~900 |
| Supermarkt | 15 | 90.000 € | 12 | 4 | ~1.500 |
| Großer Supermarkt | 22 | 250.000 € | 16 | 6 | ~2.400 |
| Verbrauchermarkt | 30 | 650.000 € | 20 | 8 | ~3.600 |

## Inhalte
- 72 Artikel in 15 Sortimenten (Lizenzen nach Level), echte Ladenpreise und Großhandelspreise mit täglicher Schwankung von ±6 %.
- 8 Regaltypen: Trocken-, Brot-, Kühl-, Getränke-, Drogerie- und Weinregal, Obst- & Gemüsestand, Tiefkühltruhe (Kühlung kostet Strom).
- Preisgefühl der Kunden: bis etwa 5 % über Marktpreis kaufen fast alle, ab 60 % niemand.
- Personal zum Mindestlohn 13,90 €/h: Kassierer, Regalbetreuer, Disponent.
- Karriere mit 17 Zielen, täglich drei Tagesziele.
- Gemeinschaftshaus: Werbegemeinschaft ab Level 8 (15.000 €) mit Wochenziel und gemeinsamen Aktionen (Prospekt, Stadtfest, Einkaufsgemeinschaft). Echte Mitspieler kommen mit der App.
- Shop für Pakete vorbereitet, aber nicht aktiv.

## Entwicklung
`npm ci`, `npm run dev`, `npm test`, `npm run build`. Spiellogik in `lib/engine.mjs` (reine Funktionen), Inhalte und Preise in `lib/data.mjs`, Grafik in `app/art/`.
