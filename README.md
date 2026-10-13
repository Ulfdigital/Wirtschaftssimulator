# Wirtschaftssimulator

Ein eigenständiges Next.js-Grundgerüst für einen Wirtschaftssimulator. Im Mittelpunkt stehen vorhandene Betriebe, Einkauf, Lagerbestände, Produktion, Verkauf und laufende Kosten.

## Kategorien

1. **Handel:** Tante-Emma-Laden und Supermarkt.
2. **Farmwirtschaft:** Ackerbetrieb und Tabakfarm; Erzeugnisse für Handel und Großhandel.
3. **Tierwirtschaft:** Milchbetrieb, Geflügelbetrieb und Schafbetrieb.

Weitere Kategorien können über die Datenlisten in `lib/economy.mjs` ergänzt werden. Es gibt keinen Gebäudebau oder Farmkartenmodus.

## Erste spielbare Funktionen

- Startkapital 100.000 Euro und ein vorhandener Tante-Emma-Laden mit Anfangswaren.
- Bestehende Betriebe übernehmen, Waren einkaufen, Ladenkunden und Großhandel beliefern.
- Gemeinsames Warenlager, Mengenwahl, begrenzte Nachfrage im Laden.
- Produktionsaufträge mit Futterbedarf, Kosten und Fertigstellung nach Geschäftstagen.
- Tagesabschluss, Betriebskosten, Ergebnisübersicht und Betriebstagebuch.
- Spielstand im Browser auf diesem Gerät; keine Anmeldung oder Cloud-Synchronisierung.
- Deutschsprachige Oberfläche für Computer, Tablet und Smartphone.

Die Geldbeträge und Erträge sind Spielwerte. Die erste Tagesrechnung ist eine einfache Einnahmen-Ausgaben-Rechnung: Auch Betriebsübernahmen werden sofort als Ausgabe erfasst; Abschreibung, Steuern, Verderb, Personalplanung und dynamische Marktpreise sind noch nicht umgesetzt. Die Startwaren sind Teil der Spielausstattung. Ein Tag vergeht über den Knopf „Tag abschließen“, nicht während das Spiel geschlossen ist. Zahlungen sind ausschließlich Spielgeld.

## Start

```bash
npm ci
npm run dev
```

Danach `http://localhost:3000` öffnen. Produktionsbuild: `npm run build`, anschließend `npm start`. Prüfungen: `npm test`.

Für Vercel: Dieses Repository als Next.js-Projekt importieren. Es benötigt für das Grundgerüst keine Umgebungsvariablen und keine Datenbank.

Version 0.1 – Erstes Grundgerüst.
