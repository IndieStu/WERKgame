# WERK – Berufsorientierung als Spiel

Ein webbasiertes isometrisches Spiel verbindet virtuelle Aufträge mit sicheren Entdeckungsaufgaben im realen WERK Bremerhaven. Zielgruppe: Jugendliche von etwa 13 bis 18 Jahren.

**Status:** Phase 0 freigegeben. Phaser + TypeScript + Vite bestätigt. Ausschließlich Phase 1 umgesetzt: technischer Placeholder-Raum mit zwei vergleichbaren Bewegungsvarianten, HTML-Formular, lokalem Teststand und Offlinepaket. Die reale iPad-Abnahme ist offen; aktuell sind nur MacBook Pro und iPhone 15 verfügbar. Phase 2 ist nicht begonnen.

**Repository:** [IndieStu/WERKgame](https://github.com/IndieStu/WERKgame) · SSH: `git@github.com:IndieStu/WERKgame.git`.

## Prototyp starten

Node **24.19.0**, pnpm **11.25.0**. Alle direkten Paketversionen und die Lockdatei sind fixiert.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm preview --port 4173
```

Auf dem Mac `http://localhost:4173/` öffnen. `pnpm dev` ist für Entwicklung; Offlineprüfung immer am Produktionsbuild. Für Mobilgeräte im WLAN die LAN-Adresse des Mac verwenden; Offline-Service-Worker benötigen dort vertrauenswürdiges HTTPS. Siehe [Gerätetest](docs/phase-1/geraetetest.md).

A = Tap-to-Move, B = gehaltene direkte Richtungstasten entlang der schrägen Raumachsen. Beide sind Experimente, keine endgültige Steuerungsentscheidung. Tastatur: Pfeile/WASD; E öffnet den Testdialog. Die HTML-Objektliste löst dieselbe Annäherung wie der Objektklick aus. Testdialog pausiert die Bewegung; Messwert, Variante und letzte erreichte Zelle werden lokal in IndexedDB gespeichert. Keine Accounts und kein Upload.

## Prüfen

```sh
pnpm check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

Der Browsercheck startet selbst einen lokalen Produktionsserver auf Port 4174. Alternativ kann `CHROME_PATH` auf ein bereits installiertes Chrome zeigen. Screenshots und Rohmessungen liegen in `docs/phase-1/`. Chromium-Touchemulation ist kein iPad-/Safari-Test. GitHub Actions ist für Build, Logik- und Browsercheck eingerichtet; ein erfolgreicher CI-Lauf wird erst nach dessen tatsächlicher Ausführung behauptet.

## Dokumentation

- [Phase-1-Bericht](docs/phase-1/bericht.md): Ergebnisse, Messwerte, Screenshots und offene Prüfungen
- [Manueller Gerätevergleich](docs/phase-1/geraetetest.md): MacBook, iPhone und später iPad
- [Phase-0-Analyse](docs/phase-0.md): recherchierte Entscheidung und Architektur
- [Roadmap und Vertical Slice](docs/roadmap.md): Phasen und Abnahmekriterien
- [Raumaufnahme](docs/templates/raumaufnahme.md): erst nach Perspektivtest nutzen
- [NFC und Fundquests](docs/nfc-pruefung.md): mögliche spätere Ergänzung, nicht Phase 1
- [Questbeispiel](content/examples/shelf-problem.json): reines Phase-0-Konzept; nicht vom Prototyp ausgeführt

## Grenzen und vorgemerkte Entscheidungen

Alle visuellen Maße bleiben vorläufig. Keine finalen WERK-Assets, keine reale Raumproduktion, keine QuestEngine, kein Character Creator. Abgeschlossene Werkstattquests sollen später die gemeinsame WERK-/Festivalwelt sichtbar verändern und XP-/Levelsysteme ersetzen; in Phase 1 ist das ausschließlich dokumentiert.

Die Projektlizenz ist noch nicht entschieden. Vorschlag: MIT für eigenen Code, getrennte Rechte für Content, Personen und Logos. Hinweise für enthaltene Drittsoftware liegen in [THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt) und werden mit dem statischen Build ausgeliefert.

Nach den Phase-1-Prüfungen stoppen. Kein Beginn von Phase 2 ohne Freigabe; offene reale Geräteprüfungen im Bericht sichtbar belassen.
