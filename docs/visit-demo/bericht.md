# Besuchsdemo V1 – historischer Funktionsstand

**Durch Review verworfen:** Raum-/Fensterfehler, fehlende Maschinen und unzureichende Grafik. Aktueller Korrekturstand: [V2](v2/bericht.md). Die folgenden Angaben dokumentieren ausschließlich den ersten Funktionsstand.

28.10.2026 · Separater kurzer Demonstrator neben der laufenden Phase 3. [Start und Vorführung](vorfuehrung.md). Der tatsächliche externe Touchscreen und die menschliche Vorführung sind noch zu prüfen.

## Begrenzter Umfang

Ein spielerisch verdichteter Holzwerkstatt-Ausschnitt mit angeschlossenem Lager und CNC-/Laserbereich. Kein vollständiges 1. OG. Grundriss und 16 HEIC-Ansichten aus `Holzwerkstatt_Bilder_Proto.zip` dienen als Arbeitsreferenzen; die Originalfotos wurden nicht ins Repository oder den Build übernommen.

Wiedererkennbar übernommen: helle Wände, hohe Fenster, Holzboden, Hobelbank mit Schraubstock am Fenster, oberes Holzregal, Werkzeugschrank, Holzlager, dunkles CNC-Bett mit Portal/orangener Fräseinheit und Absaugrohr sowie blauer Laser im Nebenraum. Lose Stapel und Unordnung sind weggelassen. Exakte Objektmaße, reale sichere Wege und vollständige Orientierung des Stockwerks sind damit nicht abgenommen.

Die Raumaufteilung ist für die kurze Vorführung verdichtet: A–D informieren den CNC-/Laserbereich, E–H den Hobelbankbereich, L–N das Holzlager; Absaugung ist über die Rohrform angedeutet. Das ist keine maßgetreue Wiedergabe aller Wände A–R. Vor einer weiteren realen Quest müssen Grundriss und Einrichtung gemeinsam abgeglichen werden.

## Weiterverwendbare Änderungen

- `content/rooms/workshop-demo.json`: getrennte Raumdaten, begehbare Flächen, niedrige Trennwände, Objektstandorte und mehrzellige Grundflächen.
- `game/source/demo-art.ts`: wiederverwendbare codegezeichnete Formen für Fenster, Holzboden, Hobelbank, Schrank, Lager, CNC, Laser und einfache Figuren. Keine Foto-Texturen, externe Bilddownloads oder finalen Produktionssprites.
- Wegfindung berücksichtigt vollständige Objektgrundflächen; Annäherung wählt einen erreichbaren Randpunkt.
- Figurengebundene HTML-Sprechblasen mit Antwortfeldern, großer Touchbedienung und begrenzter Position am Bildschirmrand. Menü-/Dialogsemantik bleibt erhalten.
- Bestehende Regalquest, Planung, Weltveränderung und Offlinebasis wiederverwendet. Demo-spezifische Hinweise passen zu den geänderten Orten.
- `?demo=visit` aktiviert die Fassung; eigener IndexedDB-Speicher `werk-visit-demo`. Der bisherige Einstieg und Speicher `werk-phase1` bleiben unabhängig.
- Startdatei und eigener Browsercheck für den Vorführstand.

Messen und Bauen bleiben **simuliert**. Das Demo-Maß von 90 cm ist keine Aufnahme eines real vorbereiteten Messorts. Reale Maschinen werden weder ferngesteuert noch als unbeaufsichtigte Bedienaufgabe angeboten. Das weitere Teststockwerk und die reale Queststation werden durch diesen Termin nicht stillschweigend als fertig erklärt.

## Prüfung

10 Logiktests einschließlich erreichbarer Ränder sämtlicher Demoobjekte und ihrer Kollisionen bestanden. TypeScript, Contentprüfung und Produktionsbuild bestanden. `pnpm test:visit` prüft den kompletten Ablauf mit Chromium-Touchereignissen bei 1600×900 sowie die Darstellung bei 1024×768. [Rohdaten](browser-results.json).

Geprüft: freiwillige Tasse/Laser, Jonas und räumliche Annäherung, Sprechblase innerhalb des Bildschirms, Messung mit falscher und anschließend korrekter Eingabe, drei Materialproben, beide Verfahren, interaktive Regalplanung, sichtbarer Bau und Entfernung der Bodenkisten-Hotspots, Offline-Reload, vollständiger Offline-Browserneustart mit Fortsetzen, eigener Neustartablauf und weiterhin ladbarer alter Einstieg. Keine JavaScript-Pageerrors im Hauptlauf.

Die erste Touchprüfung fand eine Überlappung zwischen Regalplatz und Werkzeugschrank; der Standort wurde für getrennte Tippflächen verschoben und der vollständige Test danach bestanden. Screenshots von Raum, Jonas, Planung und Bau wurden visuell geprüft. Zusätzlich wurde der vollständige bisherige Phase-2B-Browsercheck erneut bestanden, einschließlich Desktop, Tablet-/Telefon-Emulation, Migration, Speicherfehlern und Offline-Browserneustart: [aktueller Vergleichslauf](baseline-results.json). Die alten Nachweise bleiben unverändert als historische Ergebnisse erhalten.

Dateiumfang des gesamten Builds: 1.458.840 Bytes, rechnerisch 398.233 Bytes gzip. [Größendaten](build-sizes.json). Kein gemessener Netztransfer oder Performanceversprechen für das tatsächliche externe Display.

## Grenzen und nächste Schritte

Automatisierte Touchereignisse auf Chrome/Mac ersetzen nicht den tatsächlichen externen Touchscreen, dessen Zuordnung oder eine beobachtete Nutzung. Reale Safari-/iPad-Prüfung bleibt offen. Keine gemessene menschliche Planungsdauer oder Lernwirkung. Die niedrigen Trennwände sind ein bewusst offener Cutaway und keine reale Sicherheitsabsperrung. Grafik und Maßstab sind vorläufig; insbesondere Produktionsanimationen, exakte Möblierung und gesamte Stockwerksgeometrie folgen nach dem Besuch.

Vor dem Termin einmal auf dem wirklichen Bildschirm komplett ausprobieren und dann den Stand einfrieren. Nach dem Besuch Feedback in die reguläre Phase-3-Raumaufnahme übernehmen; kein Ausbau aller Werkstattquests unter Zeitdruck.
