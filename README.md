# Wirtschaftssimulator 0.6

Ein Browser-Spiel mit eigenem Tante-Emma-Laden, Saatgutmarkt, Äckern, Tierhöfen und Produktionsketten. Preise, Erträge und Kosten orientieren sich an echten deutschen Marktwerten (Stand Oktober 2026, siehe docs/UPDATE-0.6.md); keine echten Bestellungen oder Zahlungen.

## Einstieg und Fortschritt
Neue Unternehmen beginnen mit 25.000 Euro und einem kleinen Laden mit sechs leeren Regalen. Ein Acker ist ab Level 1 zum Kauf freigeschaltet; pro Level kommt ein weiterer hinzu, maximal 16. Vorhandene größere Ackerbestände bleiben auch bei niedrigerem Level erhalten. Äcker kosten zuerst 150 Euro und je weiterem Acker 50 Euro mehr. Saatpakete reichen für einen Acker; nach jeder Ernte ist die Pflanze frei wählbar. Wachstum dauert vier bis acht echte Minuten. Ernten geben 25 EP, Ladenverkäufe 1 EP je Stück, Produktionsabholungen 10 EP. Alle 100 EP folgt ein Level.

## Saatgut und Warenkreislauf
Der Saatgutmarkt verkauft ausschließlich 24 Saatgutsorten. 83 Waren einschließlich Saatgut und 37 Herstellungsrezepte bilden einen geschlossenen Warenkreislauf. Alle Nicht-Saatgut-Waren sind aus Saatgut und eigener Herstellung erreichbar; Wasser kommt aus einem kaufbaren Brunnen. Vorhandene alte Marktbestände bleiben nutzbar.

Mais oder Hafer und Weizen werden in der Mühle zu Tierfutter. Dieses versorgt Hühner, Milchkühe, Schweine, Ziegen, Enten, Kaninchen, Rinder und Mastgeflügel. Tierhöfe enthalten abstrakt ihren Tierbestand; eine Runde verbraucht Futter und liefert die beschriebenen Erzeugnisse. Tiere werden nicht als einzeln steuerbare 3D-Objekte dargestellt. Die Mühle stellt außerdem Mehl und Nudeln her. Bäckerei, Zuckerfabrik, Marmeladenfabrik, Imkerei/Honigfabrik, Käserei, Fleischerei, Mosterei, Kaffeerösterei, Öl-/Salzwerk, Weberei und Seifenmanufaktur verarbeiten eigene Zutaten. Rezeptkosten sind die tatsächlichen Einstandskosten der verbrauchten Zutaten; laufende Tageskosten decken Betriebsmittel. Mehrere Ausgänge wie Honig und Wachs teilen ihre Kosten centgenau auf.

Pro Betrieb läuft eine neue Charge gleichzeitig (1–10 Chargenmengen, Dauer proportional). Fertige Ware bleibt bei vollem Lager erhalten und wird erst beim Abholen eingebucht. Alte Produktionsaufträge behalten ihre bisherigen 24/48/72-Stunden-Zeitstempel und lassen sich über dieselbe Betriebsansicht abholen. Tierhöfe und Fabriken sind nach Leveln kaufbar. Höhere Levelbetriebe oder falsche Rezeptzutaten werden auch in der Spielaktion abgewiesen.

## Lager und Verkauf
Das Lager hat 5.000 Plätze. Zehn Ausbauten bringen je 2.500 Plätze, erster Ausbau 500 Euro, jeder weitere 500 Euro teurer. Ein Supermarkt bringt zusätzlich 5.000 Plätze. Lagerplätze umfassen auch reservierte Regalware. Ausbaukosten werden als Investitionen geführt. Die Lageransicht zeigt standardmäßig nur vorhandene Waren, mit Suche und Gruppenfilter; freie Lagerware und reservierte Regalware sind getrennt sichtbar. Direktverkauf ist je Aktion bis 500 Stück und je Geschäftstag ab 2.000 Stück (zuzüglich vorhandener bisheriger Produktionsbetriebe) möglich. Die Gewinnspanne wird vor dem Verkauf angezeigt.

Ladenkunden kaufen nur aus bestückten Regalen. Eigene Preise werden je Laden und Ware gespeichert. Höhere Preise verlangsamen die Nachfrage; oberhalb des doppelten Richtpreises bleiben Kunden aus. Öffnungszeiten: 06:00–23:00 Europe/Berlin mit automatischer Schließung und einmaliger Tagesabrechnung. Offline wird nur der letzte aktive Geschäftstag abgewickelt, keine Kette übersprungener Tageskosten. Wareneinkäufe, Investitionen und Bestand sind vom operativen Gewinn getrennt.

## Spielstände und Prüfung
Der Speicherschlüssel wirtschaftssimulator-v1 bleibt erhalten. Geld, Äcker, Betriebe, Waren, Preise, Konten, Regalreservierungen und alte Produktionen werden übernommen. Neue Waren werden mit null Bestand ergänzt, neue Lagerstufe ohne Zukauf freigeschaltet. Ein freiwilliger Neustart sichert den alten Stand lokal und bietet Wiederherstellung; dieses Update erfordert keinen Neustart. Es gibt noch keine Anmeldung oder geräteübergreifende Synchronisierung.

npm ci · npm run dev · npm test · npm run build. 34 Tests prüfen Finanzrechnung, Speicherung, Zeitgrenzen, Freischaltungen, Lagerausbau, Saatgut-only-Kauf und die Erreichbarkeit aller Produkte sowie die kompletten Ketten Saatgut → Futter → Schweinefleisch und Honig → Wachs → Kerzen. Zusätzliche Bedienprüfung der fertigen Veröffentlichung.
