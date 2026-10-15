# Update 0.3 – Laden, Regale und echte Uhrzeit

- Geldübersicht dauerhaft oben: Kapital, Tagesumsatz, Verkaufsgewinn, Betriebsgewinn und Warenwert.
- Neuer Spielbeginn: 25.000 Euro, kein Laden und keine Waren. Ladenkauf ist eine echte Investition innerhalb des Spiels.
- Sechs beziehungsweise zwölf einzeln bestückbare Regale. Gesamtbestand und reservierte Ware bleiben konsistent.
- Lieferantenansicht mit Stückpreisen, Mengenwahl, Gesamtpreis und Handelsspanne; freie Lagerware separat verwalten.
- Simulierte Kunden kaufen automatisch aus Regalen, nur während der geöffneten Geschäftszeit. Schließung und Tagesabrechnung erfolgen automatisch um 23:00 deutscher Zeit.
- Echte Uhrzeit statt manuellem Tageswechsel; Farmen und Tierbetriebe nutzen feste Produktionszeitstempel.
- Bestehende Stände übernehmen. Freiwilliger neuer Start mit lokalem Backup und Wiederherstellung im Spiel.

Grafiken wurden mit dem eingebauten Bildgenerator erstellt und im Repository gespeichert:
public/art/neighborhood-shop.png – realistischer isometrischer Laden mit sechs leeren Regalen, Kasse, Holzfußboden, Backsteinfassade und natürlichem Tageslicht; ohne Personen, Marken, Text oder Benutzeroberfläche.
public/art/supermarket.png – größerer moderner Supermarkt mit leeren Regalen, Kühlbereich und Kassen, Glasfassade, Fliesenboden und Parkplatz; realistische Architektur ohne Personen, Marken, Text oder Benutzeroberfläche.
Die Illustrationen sind statische Ladenansichten. Die individuell bestückbaren Regale darunter zeigen und verändern den tatsächlichen Spielbestand.

21 Logiktests sowie Produktionsbuild. Keine echten Zahlungen und keine externen Lieferantenbestellungen.
