# Wirtschaftssimulator 0.3

Next.js-Spiel mit Ladenkauf, befüllbaren Regalen, Wareneinkauf und laufendem Kundenverkauf. Standort- und Ladenillustrationen zeigen bezugsfertige, unbestückte Geschäfte. Der tatsächliche Bestand steht an jedem bedienbaren Regal.

Ein neues Unternehmen startet mit 25.000 Euro Spielkapital, ohne Laden und ohne Waren. Der Tante-Emma-Laden kostet 18.000 Euro und bietet sechs Regale mit je 40 Stück; der Supermarkt kostet 35.000 Euro und bietet zwölf Regale mit je 80 Stück. Waren können bei drei fiktiven Lieferanten bestellt werden. Einkaufspreise, Kundenpreise und Spanne stehen direkt am Produkt. Einräumen reserviert Lagerware für den Laden; Ausräumen gibt sie ohne Geld- oder Bestandsverlust zurück.

Die Uhr folgt Europe/Berlin einschließlich Sommer-/Winterzeit. Öffnung ist zwischen 06:00 und 23:00 Uhr möglich, nachdem mindestens ein Regal bestückt wurde. Kunden kaufen alle 30 Sekunden eine verfügbare Einheit bis zur Tagesnachfrage des jeweiligen Ladens. Um 23:00 Uhr endet der Verkauf, die Betriebskosten werden einmal gebucht und die Abrechnung wird gespeichert. Es gibt keinen Knopf mehr zum manuellen Wechseln des Tages. Einkaufen und Bestücken sind auch abends möglich. Am nächsten Morgen kann der Laden erneut geöffnet werden. Bei einer Rückkehr wird der letzte aktive Geschäftstag abgewickelt; für übersprungene, nicht gespielte Tage wird keine Kette von Betriebskosten nachberechnet. Farm- und Tierproduktionen laufen dagegen mit absoluten Zeitstempeln von 24/48/72 Stunden und sind danach einmal abholbar.

Die Geldübersicht trennt verfügbares Kapital, Umsatz, Verkaufsgewinn, Betriebsgewinn und Warenwert. Investments und Wareneinkäufe sind kein unmittelbarer Verkaufsverlust. Der tatsächliche Wareneinsatz wird beim Verkauf aus dem durchschnittlichen Bestandswert abgezogen. Bei nicht ausreichendem Geld werden offene Betriebskosten sichtbar als Verbindlichkeit geführt; sie verhindern die automatische Schließung nicht und lassen sich später bezahlen.

Bestehende Spielstände unter wirtschaftssimulator-v1 werden mit ihrem Geld, ihren Betrieben, Waren und Produktionsaufträgen übernommen. Alte Waren liegen zunächst frei im Lager. Neue-Regal-Konfiguration und Uhr werden ergänzt, vorhandene Waren werden nicht dupliziert. Wer die neue Anfangssituation ausprobieren möchte, kann „Neues Unternehmen beginnen“ wählen: Der bisherige Stand wird zuvor lokal gesichert und lässt sich über „Letzte Sicherung wiederherstellen“ zurückholen. Speicherfehler oder ungültige vorhandene Stände werden angezeigt und nicht überschrieben.

Entwicklung: npm ci, npm run dev. Prüfung: npm test und npm run build. Keine Datenbank oder Zugangsdaten erforderlich. Preise, Lieferanten und Kunden sind Spielwerte.

22 Logiktests prüfen Kostenrechnung, alte Spielstände, Ladenkauf, Regale, reservierte Ware, automatischen Verkauf, Zeit-/Schließgrenzen, einmalige Abrechnung, Neuladen und Produktionszeitstempel. Build und veröffentlichte Bedienung zusätzlich prüfen.
