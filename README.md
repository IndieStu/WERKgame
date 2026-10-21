# WERK – Berufsorientierung als Spiel

Phase 0 · Konzept und technische Vorplanung · 21. Oktober 2026

Ein webbasiertes isometrisches Spiel verbindet kurze virtuelle Aufträge mit sicheren Entdeckungsaufgaben im realen WERK Bremerhaven. Zielgruppe: Jugendliche von etwa 13 bis 18 Jahren.

**Status:** Phase 0 abgeschlossen. Phaser ist als Engine vom Auftraggeber bestätigt. Produktionsmaße bleiben bis zum Gerätetest vorläufig. NFC bleibt eine mögliche spätere Ergänzung und gehört nicht zum ersten Prototyp. Noch keine Spielimplementierung, keine installierten Abhängigkeiten und kein Deployment.

**Repository:** [IndieStu/WERKgame](https://github.com/IndieStu/WERKgame) · SSH: `git@github.com:IndieStu/WERKgame.git`. Dieses Repository ist ab jetzt die gemeinsame Projektbasis.

- [Phase-0-Analyse](docs/phase-0.md): Ziel, Recherche, Architektur, Content, Sicherheit, Datenschutz und Entscheidungen
- [Roadmap und Vertical Slice](docs/roadmap.md): Phasen, Aufwand und Abnahmekriterien
- [NFC und Fundquests](docs/nfc-pruefung.md): iPad-Grenzen, Tagvorbereitung und alternative Scanwege
- [Raumaufnahme](docs/templates/raumaufnahme.md): Vorlage und Foto-Shotlist
- [Questbeispiel](content/examples/shelf-problem.json): vorgeschlagenes Inhaltsformat, noch kein ausführbarer Content

Beschlossene Engine: **Phaser**. Vorgesehener Webstack: TypeScript + Vite, HTML/CSS für die Benutzeroberfläche, JSON für Inhalte, statisches Selfhosting. Die Engineentscheidung ist freigegeben; die Umsetzung von Phase 1 benötigt weiterhin eine eigene Freigabe. Tests auf echten Zielgeräten bleiben Teil der Technikabnahme.

## Lizenzstatus

Noch keine Projektlizenz erteilt. Vorschlag: MIT für eigenen Programmcode, getrennte Entscheidung für Texte und Grafiken; Referenzbilder, reale Personen, Logos und zugelieferte Fotos separat behandeln. Vor Veröffentlichung Rechte und Zuständigkeit mit M2C/WERK klären. Siehe Analyse, Abschnitt Q.

## Nächster Schritt

Nach Freigabe ausschließlich Phase 1: technischer Prototyp für Isometrie, Touch, Browser, Speichern und Offline-Wiederstart. Noch keine finale Werkstatt und keine Serienproduktion von Assets.
