# WERK – Berufsorientierung als Spiel

Ein webbasiertes isometrisches Spiel verbindet virtuelle Aufträge mit sicheren Entdeckungsaufgaben im realen WERK Bremerhaven. Zielgruppe: Jugendliche von etwa 13 bis 18 Jahren.

**Status:** Phase 1 ist technisch abgenommen, Creative Direction und Regalquest-Storyboard sind inhaltlich freigegeben. **Phase 2B – UX Gameplay Prototype ist implementiert und technisch geprüft**; das menschliche Review steht aus. **Phase 3 bleibt gesperrt.** Die langfristige Leitidee [Das WERK-Fest](docs/design/werk-fest.md) samt Architekturprüfung ist dokumentiert; zusätzliche Quests und Fest-Systeme werden jetzt nicht implementiert.

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

Nach Phase 2B stoppen und auf Review warten. Nur Placeholder, keine finalen Assets und kein Beginn von Phase 3. Technische Questlogik, spielbare Quest, pädagogische Qualität und unterhaltsame Player Experience werden getrennt beurteilt.
