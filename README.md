# WERK – Berufsorientierung als Spiel

Ein webbasiertes isometrisches Spiel verbindet virtuelle Aufträge mit sicheren Entdeckungsaufgaben im realen WERK Bremerhaven. Zielgruppe: Jugendliche von etwa 13 bis 18 Jahren.

**Status · 28.10.2026:** Phase 2B ist gemergt; **Phase 3 ist ausdrücklich freigegeben**. Zuerst werden Holzwerkstatt und 1. OG als isolierter Raum-/Orientierungstest vorbereitet, die reale Quest folgt später. Grundriss und Umfang liegen vor: A–R sind Wandreferenzen für Fotos; Treppenankunft, Flur und Holzwerkstatt werden begehbar, weitere Räume zunächst leer und geschlossen. [Aktueller Plan](docs/phase-3/plan.md) · [Raumaufnahme](docs/phase-3/raumgrundlage.md). Der vorhandene Spielbuild bleibt bis zur Blockout-Implementierung der technisch geprüfte Phase-2B-Prototyp.

**Besuchsdemo:** [Holzwerkstatt mit Regalquest öffnen](http://localhost:4190/?demo=visit) · [Start / Vorführablauf](docs/visit-demo/vorfuehrung.md) · [Nachweise und Grenzen](docs/visit-demo/bericht.md). Im Projektordner kann `Besuchsdemo-starten.command` die lokale Fassung öffnen. Verdichteter Raum nach den Fotos, eigener Demospielstand, virtuelle Messung, kein fertiges 1. OG.

[Creative Direction / Player Experience](docs/design/creative-direction.md) · [Konkretes Regalquest-Storyboard](docs/design/regalquest-storyboard.md) · [Visuelle Inspiration](docs/design/visual-reference-01.md) · [Technischer Phase-2-Bericht](docs/phase-2/bericht.md)

**Repository:** [IndieStu/WERKgame](https://github.com/IndieStu/WERKgame) · SSH: `git@github.com:IndieStu/WERKgame.git`.

## Prototyp starten

Node **24.19.0**, pnpm **11.25.0**. Alle direkten Paketversionen und die Lockdatei sind fixiert.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm preview --port 4180
```

Auf dem Mac `http://localhost:4180/` öffnen. `pnpm dev` ist für Entwicklung; Offlineprüfung immer am Produktionsbuild. Für Mobilgeräte im WLAN die LAN-Adresse des Mac verwenden; Offline-Service-Worker benötigen dort vertrauenswürdiges HTTPS. Siehe [Gerätetest](docs/phase-1/geraetetest.md).

„Neues Spiel“ → Preset wählen → „Los geht’s“. Personen und Dinge in der Welt antippen: Die Figur geht hin und untersucht sie. Auf freien Boden tippen zum Gehen. Im Menü lassen sich direkte Richtungstasten, größere Schrift und Hinweise wählen. Beide Bewegungsvarianten bleiben Experimente. Tastatur: Pfeile/WASD, E am Objekt; Tab/Enter erreicht Weltobjekte und Menüs. Notizen erinnern an die aktuelle Frage. Die Entwickleroberfläche ist über F2 oder `?debug=1` erreichbar.

[Ergebnisse, Messwerte und Grenzen](docs/phase-2b/bericht.md) · [Anleitung und menschlicher Nutzungstest](docs/phase-2b/nutzungstest.md) · [Umfang und Aufwand](docs/phase-2b/plan.md). Ein erfundener Raum, eine Regalquest und ausschließlich Placeholder. Kein Account, keine automatische Übertragung von Spielständen. Lokales Speichern umfasst Entdeckungen und halbfertige Regalplanung. Frühere Teststände werden gesichert; die neue Standortmessung beginnt ausdrücklich neu.

## Prüfen

```sh
pnpm check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

Der Browsercheck startet selbst einen lokalen Produktionsserver auf Port 4184. Alternativ kann `CHROME_PATH` auf ein bereits installiertes Chrome zeigen. Aktuelle Screenshots und Rohmessungen liegen in `docs/phase-2b/`; historische Nachweise bleiben in `docs/phase-1/` und `docs/phase-2/`. Chromium-Touchemulation ist kein iPad-/Safari-Test. GitHub Actions ist für Build, Logik- und Browsercheck eingerichtet; ein erfolgreicher CI-Lauf wird erst nach dessen tatsächlicher Ausführung behauptet.

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

Alle visuellen Maße bleiben vorläufig. Keine finalen WERK-Assets, keine reale Raumproduktion und kein Character Creator. Die kleine Questlogik verarbeitet sechs konkrete Schritttypen aus JSON; das Regal-Minispiel ist ein begrenztes Modul. Abgeschlossene Werkstattquests sollen später die gemeinsame WERK-/Festivalwelt sichtbar verändern und XP-/Levelsysteme ersetzen; im Slice wird dieses Prinzip erstmals durch Festkisten im fertigen Regal sichtbar.

Die Projektlizenz ist noch nicht entschieden. Vorschlag: MIT für eigenen Code, getrennte Rechte für Content, Personen und Logos. Hinweise für enthaltene Drittsoftware liegen in [THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt) und werden mit dem statischen Build ausgeliefert.

Phase 3 beginnt mit Raumstruktur und Blockout; Produktionsmaße bleiben vorläufig. Weitere Werkstätten, Questketten und Fest-Systeme werden dadurch nicht automatisch freigegeben. Technische Questlogik, spielbare Quest, pädagogische Qualität und unterhaltsame Player Experience werden getrennt beurteilt.
