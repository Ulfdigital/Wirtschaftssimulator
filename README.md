# Wirtschaftssimulator

Ein eigenständiger Next.js-Wirtschaftssimulator mit vorhandenen Betrieben, Einkauf, Lagerverwaltung, Produktion und Verkauf. Aktuell: Version 0.2.

## Kategorien

1. Handel: Tante-Emma-Laden und Supermarkt.
2. Farmwirtschaft: Ackerbetrieb und Tabakfarm.
3. Tierwirtschaft: Milch-, Geflügel- und Schafbetrieb.

Du übernimmst fertige Betriebe und wirtschaftest damit. Die Datenlisten in `lib/economy.mjs` ermöglichen weitere Kategorien und Betriebe.

## Gewinn und Kapital

- Verkaufsgewinn = Verkaufserlös minus Einkaufs- oder Herstellungskosten der tatsächlich verkauften Einheiten.
- Betriebsergebnis = Verkaufsgewinn minus laufende Betriebskosten.
- Wareneinkauf senkt das verfügbare Kapital und erhöht den Lagerwert. Kosten der Ware werden erst bei deren Verkauf im Gewinn berücksichtigt.
- Produktionskosten einschließlich Futter werden zunächst als Kosten der laufenden Charge gespeichert, dann auf den Lagerbestand übertragen und beim Verkauf anteilig abgezogen.
- Gemischte Bestände verwenden einen gewichteten durchschnittlichen Einstandspreis. Teilverkäufe verteilen die Kosten auf ganze Cent; beim letzten Verkauf wird der Rest exakt ausgebucht.
- Betriebsübernahmen werden separat als Investitionen ausgewiesen. Sie reduzieren Kapital, jedoch nicht sofort den operativen Verkaufsgewinn. Abschreibung und Steuern sind noch nicht umgesetzt.
- Gewinnvorschau direkt an den Verkaufsbuttons; Abrechnung jedes Verkaufs; tägliche und gesamte Ergebnisübersicht sowie separate Geldbewegungen.
- Der Startladen hat 120 Kundenverkäufe pro Tag und 8 Euro tägliche Betriebskosten. Der Großhandel hat ebenfalls ein Tageslimit, damit wiederholtes Einkaufen und Verkaufen nicht unbegrenzt Kapital erzeugt.

Beispiel ohne weitere Betriebe: 25 Brot zu 0,90 Euro einkaufen und zu 1,55 Euro verkaufen ergibt 38,75 Euro Erlös, 22,50 Euro Wareneinsatz und 16,25 Euro Verkaufsgewinn. Nach 8 Euro Tageskosten bleiben 8,25 Euro Tagesgewinn. Tage ohne genügend Verkäufe können Verlust machen.

Alle Preise und Erträge sind Spielwerte. Geschäftstage werden über „Tag abschließen“ weitergeschaltet. Das Spiel verwendet ausschließlich Spielgeld.

## Vorhandene Spielstände

Der Speicherschlüssel `wirtschaftssimulator-v1` bleibt erhalten. Geld, Geschäftstag, vorhandene Betriebe, Waren und laufende Produktionen werden aus Version 0.1 übernommen. Da die erste Version keine Wareneinsatzhistorie gespeichert hat, startet die neue Gewinnrechnung ab dem Update. Vorhandene Waren werden einmalig zu den bisherigen Einkaufspreisen bewertet; ältere Tagesabrechnungen bleiben im Spielstand archiviert und werden nicht nachträglich als neue Gewinne ausgegeben. Die Übernahme erfolgt genau einmal.

Speicherung erfolgt auf diesem Gerät im Browser. Anmeldung und Cloud-Synchronisierung sind noch nicht eingebaut. Die Oberfläche unterstützt Computer, Tablet und Smartphone.

## Start und Prüfung

```bash
npm ci
npm run dev
npm test
npm run build
```

Danach `http://localhost:3000` öffnen. Nach dem Produktionsbuild kann `npm start` verwendet werden. Für Vercel dieses Repository als Next.js-Projekt importieren; keine Datenbank oder Umgebungsvariablen erforderlich.

11 Logikprüfungen prüfen Gewinne, Kapitalfluss, Lagerbewertung, Teilverkäufe, Futterkosten, Tageslimits und die Übernahme alter Spielstände. Der Produktionsbuild wurde erfolgreich geprüft.
