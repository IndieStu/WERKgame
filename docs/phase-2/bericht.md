# Phase 2 – technische Questvorarbeit und Reviewstatus

Stand der technischen Nachweise: 21.10.2026. **Aktuelle Einordnung nach Testfeedback:** Phase 2 ist inhaltlich und UX-seitig nicht abgenommen. Der Build ist eine technisch vollständig ausführbare Quest-State-Machine mit Developer UI, kein Nachweis einer spielbaren Quest, pädagogischer Qualität oder unterhaltsamer Player Experience. Die frühere Bezeichnung „durchspielbarer Slice“ war zu weitgehend.

Die technischen Grundlagen und folgenden Nachweise bleiben erhalten. Maßgeblich für den nächsten Entwurf sind die [Creative-Direction-/Player-Experience-Revision](../design/creative-direction.md) und das [Regalquest-Storyboard](../design/regalquest-storyboard.md). Diese Dokumentationsrevision wartet vor jeder weiteren Umsetzung auf Review. Kein neuer Produktionscode, keine finalen Assets und kein Beginn von Phase 3.

Phase 1 wurde zuvor technisch akzeptiert; diese Korrektur setzt die Chronologie nicht zurück. Fachreview, Nutzungsprobe und reale iPad-/Safari-Prüfung bleiben getrennte offene Nachweise.

## Technisch ausführbarer Umfang

Ein kleiner erfundener WERK-Raum mit Boden, Wänden, Türmarker, Werkbank, Regal, Maschinen-Infopunkt, Kiste, Materialproben und Kaffeetasse. Zwei Figuren: beweglicher Avatar und Jonas mit blauer Jacke, Cap und Brille als geometrische Placeholder. Zwei vorgefertigte Avatarfarben; kein Character Creator und keine finalen Assets. Raummaß, 64×32-Projektion und Figurenmaßstab bleiben vorläufig.

Ablauf der Quest:

1. Jonas schildert das Regalproblem fürs gemeinsame Fest.
2. Eine Messkarte simuliert die spätere Aufgabe im echten WERK. Sie zeigt die Beispielkiste und unterscheidet Breite, Tiefe und Höhe.
3. Die Breite wird eingegeben. Komma/Punkt sind möglich; unpassende Eingaben geben Kontext und erlauben einen neuen Versuch.
4. Drei Materialien werden unter ausdrücklich vereinfachten Bedingungen abgewogen. Multiplex, MDF und OSB dürfen jeweils mit einer passenden Priorität gewählt werden.
5. Wiederholbarer Plattenzuschnitt und CNC sind unter den genannten Bedingungen mögliche Verfahren mit unterschiedlichen Vorbereitungsaufwänden. Der Filamentdrucker verarbeitet keine Holzplatte; diese Antwort führt mit Erklärung zum erneuten Versuch.
6. Das Regal wird virtuell fertiggestellt. Festkisten erscheinen sichtbar im Regal, der Auftrag gilt als abgeschlossen und eine kurze Tätigkeits-/Berufsfeldreflexion folgt.

Der Abschluss verändert die Welt statt einen XP-/Levelzähler zu erhöhen. Der Zustand wird aus dem gespeicherten Questabschluss abgeleitet; Reloads und doppelte Ereignisse erzeugen keine zweite Belohnung. Das ist die kleine erste Umsetzung des langfristigen Festivalprinzips, noch kein System für mehrere Werkstätten.

## Systeme und Verantwortlichkeiten

| Datei | Aufgabe |
|---|---|
| `content/quests/shelf-problem.json` | Aktive Texte, Schritte, Alternativen, Hinweise und Feedback |
| `content/rooms/prototype-room.json` | Objekt-IDs, Beschreibungen, Positionen und Placeholderparameter |
| `content/schemas/quest.schema.json` | JSON-Schema mit fünf festen Schritttypen |
| `game/source/quest.ts` | Reine, testbare Zustandsübergänge ohne Phaser oder DOM |
| `game/source/domain.ts` | Projektion, Wegfindung, aktuelles Saveformat und Migration |
| `game/source/room.ts` | Phaser-Szene, Bewegung, Überdeckung und sichtbares Ergebnis |
| `game/source/main.ts` | HTML-Dialog, Questlog, Hinweise, Einstellungen und Kopplung an Raum/Speicher |
| `game/source/storage.ts` | Transaktionaler IndexedDB-Zugriff |
| `tools/validate-content.mjs` | Schema, IDs, Referenzen, Erreichbarkeit, Abschlussmöglichkeiten und grundlegende Raumprüfung vor dem Build |

Neue Quests innerhalb der fünf Schrittarten können überwiegend als Daten entstehen. Es gibt keine Skriptausdrücke in JSON und keine Pro-Quest-Skriptdateien. Das System ist absichtlich klein; mehrere gleichzeitig laufende Quests oder neue Minigames sind nicht implementiert. [Content-Anleitung](content-guide.md).

## Hinweise, Steuerung und Accessibility

Beide Bewegungsvarianten aus Phase 1 bleiben umschaltbar. Die direkte Steuerung benutzt ein räumlich angeordnetes 2×2-Feld schräger Richtungstasten. Es wurde keine endgültige Produktsteuerung festgelegt.

Die HTML-Objektliste löst eine automatische Annäherung aus; der Auftrag kann zudem direkt über das Questlog fortgesetzt werden. Der gesamte Questablauf ist dadurch ohne gezieltes Canvas-Picking möglich. Modale Dialoge pausieren die Welt. Eingabefelder haben Labels, Fokus bleibt im nativen Dialog und kehrt beim Schließen zurück. Buttons sind mindestens 48 CSS-Pixel hoch; Informationen stehen auch als Text bereit.

Drei Hinweisschritte pro Aufgabe, jederzeit ohne Abzug. Optional zeigt „Erste Hinweise direkt zeigen“ sofort die erste Hilfestufe. Nach mehreren erfolglosen Versuchen wird zusätzliche Hilfe angeboten, ohne einen verborgenen Kompetenzscore zu erzeugen. Keine Zeitlimits oder Strafpunkte. Keine Altersdaten nötig. Reduzierte Systemanimation deaktiviert die kleine Placeholder-Laufbewegung.

Die reale Fingerergonomie, Bildschirmtastatur und Screenreaderbedienung sind damit noch nicht vollständig geprüft. [Manueller Abnahmelauf](abnahme.md).

## Speichern und Offline

Saveformat 2 speichert Position, Steuerungsvariante, Avatarpreset, Hilfewahl, Schritt-ID, Antworten, Hinweise, Versuche und Abschluss. Der bestehende IndexedDB-Datenbankname `werk-phase1` bleibt bewusst erhalten, damit Daten am selben Origin übernommen werden können.

Phase-1-Saves behalten gültige Einstellungen und den alten Testwert; die neue Quest beginnt beim Briefing. Ist eine frühere Position durch ein neues Placeholderobjekt belegt, wird ein sicherer Spawn verwendet. Unbekannte neuere Saveversionen und inkompatible Questrevisionen werden nicht automatisch überschrieben. Ein bewusst bestätigter Rundenreset setzt alles zurück. Keine Accounts, Cloudprofile oder Telemetrie.

Der statische Produktionsbuild enthält die Quest-/Raumdaten im JavaScript-Bundle. Der Service Worker precacht das ganze Paket und meldet erst danach Offlinebereitschaft. Aktive Runden werden nicht per `skipWaiting` unterbrochen; ein Update wird für das nächste Öffnen nach Schließen der alten Spieltabs angeboten. Automatische Altcachebereinigung und vollständige Mehrrelease-Rollbacktests bleiben spätere Härtung.

## Ausgeführte technische Prüfung

- TypeScriptprüfung, JSON-/Raumvalidierung und Vite-Produktionsbuild bestanden.
- **Neun automatisierte Tests** bestanden: Projektion, Wege/Kollision, Zahlen und Savevalidierung; Schema-/Verweisfehler; alle sechs gültigen Material-/Verfahrenskombinationen; erneute Versuche und Hinweisgrenzen; alte Ereignisse und doppelter Abschluss; Save-Roundtrips pro Schritt und Phase-1-Migration.
- Vollständiger Browserablauf auf installiertem Chrome 155 im Headless-Modus auf dem Mac, mit SwiftShader. Zweiter Kontext mit Tabletviewport und Chromium-Touchereignissen. Das ist ausdrücklich keine Safari- oder reale iPadprüfung.
- Beide Bewegungsvarianten, Annäherung an Jonas, falsche Messung, gespeicherte Hinweise, Material-/Verfahrensalternativen und Wiederaufnahme nach jedem Questschritt geprüft.
- Regalabschluss, Reload ohne Netzwerk, neuer Offline-Tab und Rundenreset geprüft.
- Separates persistentes Profil: Browser vollständig schließen und offline neu starten; die Quest setzt beim Materialschritt mit gespeichertem Maß 40 cm fort.
- Schmale Ansicht mit 390×844 CSS-Pixeln auf horizontalen Überlauf geprüft. Keine echte iPhone-Bildschirmtastatur simuliert.
- Phase-1-Save im Browser übernommen; unbekannte Saveversion bleibt beim Weiterspielen unverändert erhalten.

Rohdaten und Messbedingungen: [browser-results.json](browser-results.json). Dateigrößen: [build-sizes.json](build-sizes.json). Reproduzierbar mit `pnpm test`, `pnpm build` und `pnpm test:browser`; letzterer startet selbst einen lokalen Produktionsserver auf Port 4174. Die historischen Phase-1-Nachweise liegen unverändert unter `docs/phase-1/`; zum exakten Nachstellen des alten Prototyps dessen Git-Branch verwenden.

## Messwerte des abschließenden Laufs

| Messung | Ergebnis |
|---|---|
| Statische Dateien insgesamt | 1,424,771 Byte roh |
| Summe lokal gzip-komprimierter Dateien | 386,751 Byte (etwa 0,39 MB) |
| Chrome headless on Mac, SwiftShader | Start 3853 ms; Momentaufnahme 34 fps · WebGL |
| Chromium touch emulation, NOT Safari or real iPad | Start 308 ms; Momentaufnahme 44 fps · WebGL |

Einzellauf auf localhost mit Softwaregrafik, ohne Netz-Drosselung. Der zweite Kontext profitiert möglicherweise vom bereits warmen Browserprozess. Die FPS sind kurze Momentaufnahmen, kein Nachweis stabiler Hardwareleistung. Ein realer iPad-Test mit 30-fps-Ziel und ein 10-Mbit/s-/100-ms-Ladetest bleiben offen. Das 5-MB-Dateibudget ist deutlich unterschritten; gzip-Dateigrößen sind nicht der komplette HTTP-Netztransfer.

## Screenshots

- [Desktop: Raum vor dem Abschluss](screenshots/desktop-room.png)
- [Messkarte als simulierte reale Aufgabe](screenshots/desktop-observation.png)
- [Materialentscheidung auf Touch-Viewport](screenshots/touch-material.png)
- [Ergebnis und Berufsbezug](screenshots/desktop-result.png)
- [Sichtbar verändertes Regal](screenshots/desktop-changed-world.png)
- [Schmale Smartphoneansicht](screenshots/phone-emulation-measurement.png)

Raum-/Ergebnisansicht und Dialoge wurden visuell geprüft. Die Grafiken sind einfache Grundformen. Der Regalabschluss ist an den zusätzlichen farbigen Festkisten erkennbar; die Objektliste ergänzt die kleinen Weltbeschriftungen.

## Offene Abnahme und bekannte Grenzen

| Punkt | Stand |
|---|---|
| Nutzungsprobe mit 3–5 Personen | Noch nicht durchgeführt. Dauerziel 5–10 Minuten und Verständlichkeit nicht als empirisch bestätigt ausweisen. |
| Fachreview | Material-/Verfahrensannahmen müssen vor einem Jugendpilot von einer fachkundigen Person gegengelesen werden. |
| Reales Schul-iPad | Derzeit nicht verfügbar. Kein Nachweis stabiler 30 fps oder der Fingerergonomie auf dem Zielgerät. |
| iPhone 15 / Safari | Manueller Test weiterhin nötig; ein Chromium-Viewport ist kein WebKitnachweis. |
| Reale Aufgabe | Nur Messkarte; noch keine sichere Gebäuderoute oder echte Probe eingebunden. |
| Bildschirmtastatur / Screenreader | Semantische HTML-Grundlage vorhanden; reale Bedienprüfung ausstehend. |
| Automatisierter Offlinecheck | Ein früherer Wiederholungslauf meldete beim Lesen der Ergebnisanzeige nach Offline-Reload einen Timeout. Mit ergänzter Seitendiagnose bestand der vollständige Wiederholungslauf; Ursache nicht reproduziert. Als offene Testinstabilität dokumentiert, im manuellen Offlinecheck mitprüfen. |
| Mehrere Tabs | Kein Profil-/Tablocking. Ein Spieltab pro Runde bleibt die Betriebsannahme. |
| Inhaltsrevisionen | Unbekannte Revision wird abgefangen; darüber hinausgehende Migrationen erst bei konkreter Inhaltsänderung. |
| Offlineupdates | Kein erzwungener Wechsel; vollständiger Test mehrerer Releaseversionen und Altcachebereinigung noch offen. |
| Canvasmaßstab | Tapfelder auf schmalen Geräten potenziell klein. Maßstab nach realem Gerätetest festlegen. |
| Dateien | Das Phaser-Bundle löst weiterhin Vites 500-kB-Chunkhinweis aus; komprimierte Paketgröße bleibt klein. |

Es wurden keine echten Werkstätten produziert, keine QR-/NFC-Laufzeitadapter, Fotos, Accounts oder ein Backend ergänzt. Phase 3 benötigt eine eigene Freigabe und die Auswahl/Dokumentation der ersten realen Werkstatt.

## Reviewstand

Phase 1 liegt auf `phase-1-technical-prototype`. Phase 2 liegt darauf aufbauend auf `phase-2-vertical-slice`; beide werden mit ausdrücklich erteilter Uploadfreigabe bereitgestellt. `main` wird nicht eigenmächtig gemergt. Die GitHub-Integration meldet beim Anlegen eines Pull Requests HTTP 403 („Resource not accessible by integration“); Branchupload per SSH ist davon unabhängig.

**Hier stoppen:** zuerst Creative Direction und Storyboard prüfen und freigeben. Die bisherige Oberfläche definiert weder Player UI noch Art Direction. Kein Produktionscode in diesem Revisionsschritt und kein Beginn von Phase 3.
