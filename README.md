# WERK – Berufsorientierung als Spiel

Ein webbasiertes isometrisches Spiel verbindet virtuelle Aufträge mit sicheren Entdeckungsaufgaben im realen WERK Bremerhaven. Zielgruppe: Jugendliche von etwa 13 bis 18 Jahren.

**Status:** Phase 1 bleibt technisch abgenommen. Der vorhandene Phase-2-Build ist nützliche technische Questvorarbeit, aber **inhaltlich und UX-seitig nicht freigegeben**. Die permanente Weboberfläche ist Developer-/Test-UI und keine Vorlage für das Produkt. Vor Phase 3 liegt jetzt eine Creative-Direction-/Player-Experience-Revision zum Review vor. In diesem Zwischenschritt werden nur Dokumente geändert.

[Creative Direction / Player Experience](docs/design/creative-direction.md) · [Konkretes Regalquest-Storyboard](docs/design/regalquest-storyboard.md) · [Technischer Phase-2-Bericht](docs/phase-2/bericht.md)

**Repository:** [IndieStu/WERKgame](https://github.com/IndieStu/WERKgame) · SSH: `git@github.com:IndieStu/WERKgame.git`.

## Technische Vorarbeit starten

Node **24.19.0**, pnpm **11.25.0**. Alle direkten Paketversionen und die Lockdatei sind fixiert.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm preview --port 4175
```

Auf dem Mac `http://localhost:4175/` öffnen. `pnpm dev` ist für Entwicklung; Offlineprüfung immer am Produktionsbuild. Für Mobilgeräte im WLAN die LAN-Adresse des Mac verwenden; Offline-Service-Worker benötigen dort vertrauenswürdiges HTTPS. Siehe [Gerätetest](docs/phase-1/geraetetest.md).

A = Tap-to-Move, B = gehaltene direkte Richtungstasten entlang der schrägen Raumachsen. Beide sind Experimente, keine endgültige Steuerungsentscheidung. Tastatur: Pfeile/WASD; E öffnet den Questdialog. Die HTML-Objektliste löst dieselbe Annäherung wie der Objektklick aus. Questdialog pausiert die Bewegung; Queststand, Antworten, Hinweise, Avatarpreset, Variante und letzte erreichte Zelle werden lokal in IndexedDB gespeichert. Nach dem Abschluss verändert sich das Regal sichtbar. Keine Accounts und kein Upload.

## Prüfen

```sh
pnpm check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

Der Browsercheck startet selbst einen lokalen Produktionsserver auf Port 4174. Alternativ kann `CHROME_PATH` auf ein bereits installiertes Chrome zeigen. Aktuelle Screenshots und Rohmessungen liegen in `docs/phase-2/`; historische Nachweise bleiben in `docs/phase-1/`. Chromium-Touchemulation ist kein iPad-/Safari-Test. GitHub Actions ist für Build, Logik- und Browsercheck eingerichtet; ein erfolgreicher CI-Lauf wird erst nach dessen tatsächlicher Ausführung behauptet.

## Dokumentation

- [Phase-2-Bericht](docs/phase-2/bericht.md): technische Abläufe und Tests; kein Nachweis für Gameplay oder Player Experience
- [Phase-1-Bericht](docs/phase-1/bericht.md): Ergebnisse, Messwerte, Screenshots und offene Prüfungen
- [Manueller Gerätevergleich](docs/phase-1/geraetetest.md): MacBook, iPhone und später iPad
- [Phase-0-Analyse](docs/phase-0.md): recherchierte Entscheidung und Architektur
- [Roadmap und Vertical Slice](docs/roadmap.md): Phasen und Abnahmekriterien
- [Raumaufnahme](docs/templates/raumaufnahme.md): erst nach Perspektivtest nutzen
- [NFC und Fundquests](docs/nfc-pruefung.md): mögliche spätere Ergänzung, nicht Phase 1
- [Questbeispiel](content/examples/shelf-problem.json): historisches Phase-0-Konzept; aktive Quest unter `content/quests/shelf-problem.json`

## Grenzen und vorgemerkte Entscheidungen

Alle visuellen Maße bleiben vorläufig. Keine finalen WERK-Assets, keine reale Raumproduktion und kein Character Creator. Die kleine QuestEngine verarbeitet fünf feste Schritttypen aus JSON. Abgeschlossene Werkstattquests sollen später die gemeinsame WERK-/Festivalwelt sichtbar verändern und XP-/Levelsysteme ersetzen; im Slice wird dieses Prinzip erstmals durch Festkisten im fertigen Regal sichtbar.

Die Projektlizenz ist noch nicht entschieden. Vorschlag: MIT für eigenen Code, getrennte Rechte für Content, Personen und Logos. Hinweise für enthaltene Drittsoftware liegen in [THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt) und werden mit dem statischen Build ausgeliefert.

Nach der Creative-Direction-/UX-Revision stoppen und auf Review warten. Kein Produktionscode, keine finalen Assets und kein Beginn von Phase 3 in diesem Zwischenschritt. Technische Questlogik, spielbare Quest, pädagogische Qualität und unterhaltsame Player Experience werden getrennt beurteilt.
