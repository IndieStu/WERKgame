# Phase 1 – Technikprototyp und Validierungsstand

Stand: 21.10.2026. **Die technische Implementierung ist zur Prüfung bereit; die reale Zielgeräteabnahme ist noch nicht abgeschlossen.** Phase 2 wurde nicht begonnen. Es gibt derzeit kein Schul-iPad; verfügbar sind laut Auftraggeber MacBook Pro und iPhone 15. Ein manueller iPhone-/Safari-Test wurde noch nicht durchgeführt.

## Ergebnis

Ein einzelner erfundener 9×9-Raum mit Boden, zwei Wänden, Türmarker, drei unterschiedlich hohen Objektblöcken und einer beweglichen geometrischen Figur ist implementiert. Alle visuellen Maße bleiben vorläufig. Es wurden keine finalen WERK-Grafiken, keine realen Räume und kein Character Creator produziert.

Zwei umschaltbare Steuerungen stehen gleichberechtigt zur Prüfung bereit:

- **A: Tap-to-Move** mit Raster-Picking und A*-Wegfindung um belegte Zellen.
- **B: direkte Richtungstasten** mit gedrückt gehaltenen Touchbuttons entlang der vier schrägen Raumachsen. Bodentaps lösen in B keine Bewegung aus; Objektinteraktionen bleiben verfügbar.

Tastatur-Pfeile/WASD ergänzen beide Varianten. Ein Button in der HTML-Objektliste führt zur selben Objektannäherung wie der Objektklick im Canvas. Die Figur läuft erst zu einer freien Nachbarzelle, dann öffnet der Testdialog. Die vier Bildschirm-Pfeiltasten sind auf die vier Raumachsen abgebildet; dies muss hinsichtlich Verständlichkeit praktisch getestet werden.

**Keine Steuerung ist als Produktentscheidung festgelegt.** Automatisierte Funktionstests belegen nicht, welche Variante Jugendliche bevorzugen oder sicherer bedienen.

## Aufbau und Dateien

| Bereich | Implementierung |
|---|---|
| Toolchain | Node 24.19.0, pnpm 11.25.0, Phaser 4.2.1, TypeScript 5.9.3, Vite 7.2.2; direkte Versionen und pnpm-Lockfile fixiert |
| Projektion/Kollision | `game/source/domain.ts`: 64×32-Testprojektion, Rückprojektion, Vier-Nachbar-A*, belegte Objektzellen |
| Darstellung/Eingaben | `game/source/main.ts`: ein Phaser-Raum, skalierbarer 800×500-Testcanvas, Fußanker und Sortierung nach projizierter Fußhöhe |
| HTML | `index.html`, `game/source/style.css`: Steuerungswechsel, Objektliste, modaler Testdialog, Zahlenfeld, technische Statusanzeigen |
| Save | `game/source/storage.ts`: IndexedDB, versionierter minimaler Teststand, transaktionale Schreibvorgänge |
| Offline | `tools/offline-build.mjs`: generierter Service Worker mit Hash aus Build und Workerquelle; vollständiges statisches Paket vor Offlinebereitschaft |
| Tests | `tests/domain.test.ts`, `tools/browser-check.mjs`; CI in `.github/workflows/check.yml` |

Die Testgrafiken werden aus Grundformen gezeichnet. Es gibt keine importierten Produktionssprites. Ein einheitlicher Bodenanker und Ein-Zellen-Objektfußabdrücke erlauben hier die einfache Sortierung. Das validiert noch nicht beliebig große, mehrteilige Werkstattmaschinen.

Der HTML-Dialog blockiert die Weltbewegung und Eingaben. Das Eingabefeld akzeptiert Komma/Punkt, weist leere, negative, nicht endliche und übergroße Werte zurück. Es geht ausschließlich um Eingabe-/Speicherverhalten; keine Regalquest und keine Berufsorientierungslogik laufen im Prototyp.

Der Save enthält Version 1, letzte vollständig erreichte Zelle, Steuerungsvariante und optionalen Messwert. Unbekannte neuere oder beschädigte Saves werden nicht automatisch überschrieben. Ein umfassendes Migrationssystem ist in Phase 1 nicht nötig; unbekannte Versionen werden erklärt und können bewusst zurückgesetzt werden. Fehler beim Speichern werden angezeigt. Kein Account, Backend oder Upload.

## Ausgeführte Prüfungen

### Logik und Build

`pnpm test`: **4 Tests bestanden**, keine Fehler:

1. Projektion/Rückprojektion einschließlich halber Koordinaten.
2. Weg um den Regalblock, keine blockierten Zellen und kein diagonales Eckenschneiden.
3. Zahleneingabe einschließlich Komma/Punkt und ungültiger Werte.
4. Savevalidierung, beschädigte Positionen und unbekannte Versionen.

`pnpm build`: TypeScriptprüfung und statischer Vite-Build bestanden. `pnpm install --frozen-lockfile` wurde lokal erfolgreich ausgeführt. CI ist eingerichtet; ein erfolgreicher GitHub-Lauf ist damit noch nicht belegt.

### Browser auf dem Mac-Host

Ausgeführt mit installiertem **Chrome 155.0.8059.86 im Headless-Modus**, WebGL über **SwiftShader**. Zweiter Kontext mit Tabletviewport und Touchereignissen in **Chromium**, ausdrücklich kein reales iPad und kein Safari. Der emulierte Safari-User-Agent in der Rohdatei stammt vom Playwright-Geräteprofil und ist kein Beleg für verwendetes WebKit.

Beide Kontexte bestanden:

- Wegwahl per Klick beziehungsweise Touch auf das Canvas.
- Gedrückte direkte Bewegung per Maus beziehungsweise Chromium-Touchereignissen.
- Annäherung an ein Objekt mit anschließendem Dialog.
- Ungültige Zahl wird zurückgewiesen; `40,5` wird lokal gespeichert.
- Pfeiltaste im modalen Dialog bewegt die Figur nicht.
- Reload erhält Messwert und Steuerungsvariante; Position wird aus der letzten erreichten Zelle geladen.
- Offline-Reload nach vollständigem Paketdownload.
- Neuer Tab im bestehenden Browserprofil startet offline.
- Keine erfassten JavaScript-Laufzeitfehler während dieser Abläufe.

Zusätzlich: **Chrome vollständig geschlossen und mit demselben persistenten Testprofil offline neu gestartet.** Die Anwendung startet aus dem Cache und der zuvor gespeicherte Messwert **55,5 cm** bleibt erhalten. Das ist ein Desktop-Chrome-Nachweis, kein Safari-/iPad-Nachweis.

Rohdaten: [browser-results.json](browser-results.json). Reproduzierbarer Ablauf: `pnpm build && pnpm test:browser` nach Installation eines Playwright-Chromium oder mit gesetztem `CHROME_PATH`.

## Messwerte und Grenzen

| Messung | Ergebnis | Aussagegrenze |
|---|---|---|
| Statischer Build insgesamt | 1.409.188 Byte unkomprimiert | Dateien einschließlich Service Worker und Lizenzhinweisen |
| Summe lokal gzip-komprimierter Dateien | 381.002 Byte, etwa 0,38 MB | Kein vollständiger gemessener HTTP-Transfer; Header/Mehrfachdownload nicht enthalten |
| JS-Bundle | 1.400.598 Byte roh / 377.019 Byte gzip | Vite meldet deshalb einen Chunk über 500 kB |
| Start bis `werk-ready`, Desktopkontext | 3.431 ms | Einzelmessung auf localhost, Headless/Softwaregrafik, keine Netz-Drosselung |
| Start bis `werk-ready`, Touchkontext | 261 ms | Späterer Kontext im selben Browserprozess; CPU-/Laufzeitaufwärmung möglich |
| Momentane FPS vor Interaktion, Desktop | 24 fps | Kurzes Fenster, Headless/SwiftShader; kein GPU-Benchmark |
| Momentane FPS vor Interaktion, Touchkontext | 28 fps | Chromium-Emulation auf Mac, keine Tabletleistung |

Dateigrößen: [build-sizes.json](build-sizes.json). Die Browsermessung erfolgte vor der letzten Ergänzung des EventEmitter-Lizenztexts; Anwendungscode und JavaScript-/CSS-Hashes sind identisch, die oben genannte Gesamtgröße stammt aus dem abschließenden Build.

Das Downloadbudget von 5 MB ist auf Dateiebene deutlich unterschritten. **Das Ziel stabiler 30 fps auf dem schwächsten Tablet ist noch nicht nachgewiesen.** Die niedrigen Headless-Werte sind sichtbar dokumentiert; eine reale GPU-Messung muss klären, ob überhaupt ein Produktproblem vorliegt. Auch der Start unter 10 Mbit/s/100 ms Latenz wurde nicht gemessen. Keine Leistungszusage aus den beiden lokalen Einzelwerten ableiten.

## Screenshots und Sichtprüfung

- [Desktop / Tap-to-Move](screenshots/desktop.png)
- [Desktop / HTML-Dialog](screenshots/desktop-dialog.png)
- [Touch-Emulation / direkte Steuerung](screenshots/touch-direct.png)
- [Touch-Emulation / Dialog](screenshots/touch-dialog.png)
- [Figur hinter dem Regalblock](screenshots/depth-behind.png)
- [Figur vor dem Regalblock](screenshots/depth-front.png)

Die Vor-/Hinteransichten wurden visuell geprüft: Der Regalblock überdeckt die Figur hinten; vorne steht die Figur davor. Der Bodenanker bleibt der Sortierbezug. Ein-Zellen-Blöcke decken nur den einfachen Fall ab. Die Screenshots zeigen einen technischen Testaufbau, keinen Stilvorschlag für das finale Spiel.

## Behobener Fehler im Testlauf

Der erste Offlinetest scheiterte, obwohl das Paket vollständig gecacht war. Der Previewserver variiert Antworten nach `Origin`; der Precacherequest und die späteren Modul-/CSS-Anfragen hatten unterschiedliche Variationswerte. Der Worker berücksichtigt für die manifestierten, ausschließlich eigenen statischen Antworten diese Variation nicht mehr (`ignoreVary`). Danach bestanden Offline-Reload, neuer Tab und kompletter Browserneustart. Der Worker cached weder Formulare noch Spielstände oder fremde Requests.

## Bekannte Grenzen und ausstehende Tests

| Punkt | Status / nächster Nachweis |
|---|---|
| Reales Schul-iPad | Nicht verfügbar; Abnahme offen |
| Reales iPhone 15 | Gerät vorhanden, noch kein manueller Test; Anleitung vorbereitet |
| Safari auf MacBook | Noch nicht praktisch geprüft; Headless-Chrome ersetzt diesen Test nicht |
| Bildschirmtastatur, Fingerergonomie | Noch keine reale Prüfung; Chromium-Touch deckt nur Ereignislogik ab |
| Steuerungsvergleich | Technische Funktion beider Varianten geprüft; Nutzerpräferenz und Trefferquote offen |
| Kleine Bodenfelder | Auf schmalen Geräten potenziell zu kleine Tapziele; Maßstab/Kamera erst nach realem Test festlegen |
| Direkter Modus | Vier schräge Raumachsen statt acht freier Richtungen; Verständlichkeit und Erreichbarkeit der Buttons prüfen |
| Grafikkontextverlust | Hinweis-/Stop-Handler vorhanden; Verlust/Wiederherstellung nicht praktisch injiziert |
| Speicherfehler/Privatmodus | Fehlerpfade vorhanden, noch keine vollständige Browser-/Safari-Fehlersimulation |
| Mehrere aktive Tabs | Kein tabübergreifendes Spielstandslocking; letzter Schreibvorgang gewinnt. Pilot künftig auf einen Spieltab begrenzen |
| Service-Worker-Update | Kein erzwungenes `skipWaiting`; Update erst nach Schließen alter Spieltabs. Versionswechsel/Rollback noch nicht als Mehrrelease-Test ausgeführt |
| Alte Offlinecaches | Für Phase-1-Rollback behalten; automatische sichere Bereinigung später nach Updateprüfung |
| HTTP im WLAN | Touchversuch möglich; Offline auf dem iPhone braucht vertrauenswürdiges HTTPS |
| Reale Raum-/Questlogik | Absichtlich nicht enthalten; gehört frühestens zum Slice beziehungsweise späteren Phasen |

## Empfehlungen und nächster Freigabepunkt

1. Mit dem verfügbaren MacBook Safari/Chrome manuell vergleichen und auf dem iPhone zunächst beide Touchvarianten ausprobieren. [Gerätetest und Protokollvorlage](geraetetest.md) verwenden.
2. Für einen vollständigen iPhone-Offlineversuch einen vertrauenswürdigen HTTPS-Testhost festlegen. Es wurde weder ein öffentliches Deployment noch ein Tunnel angelegt.
3. Sobald ein Schul-iPad verfügbar ist, dieselben Aufgaben mit A und B durchführen und OS/Browser, Orientierung, Treffer, Korrekturbewegungen, FPS und Bildschirmtastatur dokumentieren.
4. Danach über Steuerung, Maßstab und Kamerafläche entscheiden. Bis dahin sind alle Produktionsmaße und beide Steuerungen vorläufig.
5. Phase 2 erst nach gesonderter Freigabe. Falls bewusst ohne vollständige iPadabnahme weitergearbeitet werden soll, muss dieses verbleibende Risiko ausdrücklich als offene Bedingung stehen bleiben.

Langfristiges Designprinzip vorgemerkt: Abgeschlossene Werkstattquests verändern die gemeinsame WERK-/Festivalwelt sichtbar und ersetzen XP/Level. In Phase 1 nicht implementiert.

**Hier endet die freigegebene Umsetzung. Phase 1 ist technisch prüfbereit, aber nicht vollständig auf realen Zielgeräten abgenommen.**
