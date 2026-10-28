# Lesbarkeit und Pixeldichte · 28. Oktober 2026

Die Gesamtansicht verkleinerte detailreiche Rastergrafiken auf sehr wenige Bildpunkte (Figuren: 78 Weltpixel, durch die Übersichtskamera teils noch kleiner). Nearest-Neighbor-Abtastung beim starken Verkleinern verwarf dünne Konturen. Der Canvas nutzte zudem nur CSS-Pixel statt der höheren Bildschirmdichte.

Die Besuchsdemo startet jetzt mit einer mitlaufenden Kamera bei 2,25-facher Vergrößerung auf Desktop, 1,65 auf schmalen Geräten. Desktop-Figuren erscheinen damit etwa 176 CSS-Pixel hoch. Gesamtansicht und Rückkehr zur Spielfigur sind direkt erreichbar; Plus/Minus verändern die Detailansicht. Die Gesamtansicht bleibt naturgemäß weniger detailreich.

Phaser 4 rendert im Demo-Modus in einer entsprechend größeren Zeichenfläche mit inverser Scale-Manager-Skalierung. Die Pixeldichte ist auf 2 begrenzt, damit die Zeichenfläche auf hochauflösenden Geräten nicht unbegrenzt wächst. DOM-Sprechblasen und Interaktionsflächen bleiben in CSS-Pixeln. Fenstergrößen- und Pixeldichteänderungen werden beim Resize neu ausgewertet. Rastergrafiken werden gefiltert verkleinert; Canvas-Texte erhalten höhere interne Textauflösung. Der bestehende Phase-2B-Modus bleibt bei seiner bisherigen Darstellung.

Prüfung: `tools/display-check.mjs` prüft DPR 1 und 2, Zeichenflächenmaße, Touch-Auswahl von Jonas und Auswahl nach Resize auf 1024 × 768. Ergebnisse und echte Browser-Screenshots liegen in diesem Verzeichnis. `tools/visit-check.mjs` prüft den vollständigen Questablauf in der Gesamtansicht sowie Offline-Speicherung und Browser-Neustart. Detailkamera und Retina-Darstellung werden separat geprüft. Build und 11 Fachtests bestehen.

Die Browserprüfungen verwenden Chrome mit Software-Grafiktreiber und simulierten Touch-Ereignissen. Sie belegen keine Bildrate oder Lesbarkeit am tatsächlichen externen Touchscreen. Diesen Gerätetest bitte vor der Vorführung durchführen.

Bereits geöffnete Offline-Tabs können noch die alte Fassung anzeigen: Alle Tabs dieses lokalen Demo-Ursprungs schließen und die Demo erneut öffnen. Bei einem bereitstehenden Update kann ein erster Besuch den Download anstoßen; anschließend nochmals alle Demo-Tabs schließen und neu öffnen. Der Spielstand bleibt erhalten.
