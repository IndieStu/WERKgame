# Phase 2B – UX Gameplay Prototype

21.10.2026 · Vom Auftraggeber zur Planung und anschließenden Umsetzung freigegeben. Creative Direction und Regalquest-Storyboard sind inhaltlich bestätigt. Phase 3 bleibt gesperrt. Implementierung und technische Checks liegen im [Reviewbericht](bericht.md); das menschliche Review steht aus.

## Aufwand vor Umsetzung

Grobe Spanne: **6–9 Personentage**, entsprechend etwa 36–54 konzentrierten Arbeitsstunden. Einordnung der Pakete: Spielansicht/Menüs/Debug 1–2 PT; kurze Gespräche und Erkundung 2–3 PT; räumliche Messung und Regalplanung 1–2 PT; Save/Offline, Tests und Dokumentation etwa 2 PT. Pakete überschneiden sich; Gesamtschätzung nicht als Summe unabhängiger Maxima verstehen. Menschliche Nutzungsprobe, Wartezeiten und echte iPad-Prüfung sind nicht enthalten. Nach dem ersten Nutzungsfeedback neu schätzen.

## Begrenzter Umbau

| Bereich | Konkrete Änderung |
|---|---|
| Oberfläche | Welt füllt Browserfenster; Start/Fortsetzen, kompaktes Menü und Notizbuch. Kein dauerhaftes Dashboard. |
| Debug | Bisherige Varianten-/Preset-/Hilfefelder, Status, Questschritte, Reset und Rohdaten nur ausdrücklich im Debug-Modus. |
| NPC | Jonas wird in der Welt aufgesucht. Kurze situative RPG-Dialoge unten im Bild statt großer Informationsfenster. |
| Erkundung | Tasse als reine Atmosphäre; drei getrennte Materialproben und zwei Verfahren als untersuchbare Quellen. Entscheidungen erst mit den nötigen Beobachtungen. |
| Messung | Verfügbaren Standort untersuchen; dort zwei Messpunkte wählen, Breite ablesen/eingeben und Jonas berichten. Stellvertreter der späteren realen Handlung, keine zentrale Messkarte. |
| Planung | Zwei Böden im vereinfachten Rahmen setzen und zwei unterschiedlich hohe Kisten in passende Fächer stellen. Auswahl und Zielklick, kein Pflichtziehen; Touch und Tastatur. Ziel etwa 30–60 Sekunden, keine Stoppuhr oder Mindestdauer. |
| Konsequenz | Leerer Standort und Bodenkisten vorher; Regal mit gewählter Materialfarbe, angeordneten Böden und eingeräumten Kisten danach. |
| Berufsbezug | Freiwillige Nachfrage bei Jonas nach dem Ergebnis, keine Abschlussbewertung. |
| Basis | Projektion, Wegfindung, reine Questübergänge, IndexedDB, Service Worker und zugängliches HTML weiterverwenden. Saveformat für Entdeckungen und Plan erweitern; alte Teststände sichern und ausdrücklich neu beginnen, da bisher Kistenbreite statt Standortbreite gemessen wurde. |

Ein Raum, Jonas, ein Avatar mit zwei Presets, drei Proben, zwei Infopunkte, eine Tasse, zwei Kisten und eine einzige Quest. Alle Formen bleiben Placeholder. Keine echte Maschine bedienen, keine reale Raumaufnahme, keine Produktions-Pixelart, kein Backend und kein neuer Creator.

## Abnahme

Technisch: Gate- und Retrytests, alternative Entscheidungen, Save/Migration, Offline-Wiederstart, Tastatur/Touch, keine Layoutsackgasse, keine doppelte Fertigstellung. Screenshots und Messbedingungen dokumentieren.

Menschlich: Auftraggeber kann ohne Entwicklerwissen starten, Jonas finden, Standort messen, Informationen entdecken, planen und die veränderte Welt erkennen. Eine kurze Nutzungsprobe mit unvorbereiteten Personen wird ermöglicht und separat protokolliert. Automatisierte Tests behaupten keine unterhaltsame Experience und keine bestätigte 30–60-Sekunden-Dauer.

Nach Phase 2B stoppen und Review abwarten. Phase 3 bleibt gesperrt.

## Ergänzung: WERK-Fest als langfristige Richtung

[Story-Arc und Architekturfolgen](../design/werk-fest.md) sind aufgenommen. Phase 2B validiert weiterhin nur die Regalquest und ihre lokale sichtbare Folge. Keine zusätzlichen Quests, Festkomposition oder allgemeine Mehrquest-Engine. Der aktuelle Einzelquest-Save und die direkte Kopplung von Regal/Kollision an den Questabschluss sind ausdrücklich Prototypgrenzen; vor weiterem Content müssen unabhängige Weltbeiträge und additive Save-Migrationen folgen.
