# Inhalte des Vertical Slice bearbeiten

**Reviewstatus:** Die bestehende Präsentation ist inhaltlich und UX-seitig nicht freigegeben. [Creative Direction](../design/creative-direction.md) und [Storyboard](../design/regalquest-storyboard.md) definieren den Entwurf für das Review. Diese Anleitung beschreibt die erhaltene Technik und ist keine Anweisung zum sofortigen Contentumbau.

Der Raum und die Quest sind Placeholder. Es gibt noch keinen grafischen Editor und keine ausführbaren Ausdrücke in Contentdateien.

## Dateien

- `content/quests/shelf-problem.json`: laufende Regalquest, kurze Texte, Optionen, Feedback und Hinweise.
- `content/rooms/prototype-room.json`: anklickbare Dinge, Beschreibungen, Bodenkoordinaten und vorläufige Grundformen.
- `content/schemas/quest.schema.json`: JSON-Schema des Questformats.
- `content/examples/shelf-problem.json`: historisches Phase-0-Beispiel, wird nicht ausgeführt.

## Vorgehen

1. Bestehende Schritt- und Options-IDs nicht umbenennen, solange gespeicherte Spielstände dazu existieren.
2. Texte oder Hinweise im aktiven Quest-JSON bearbeiten. Die Engine liegt getrennt in `game/source/quest.ts`; sie enthält keine Regaltexte und keine Phaser-Abhängigkeit.
3. Pro Karte wenige Sätze schreiben. Fachbegriffe erklären. Bei Entscheidungen Randbedingungen angeben und begründbare Alternativen zulassen.
4. Die fünf Schritttypen verwenden: `dialogue`, `real_world_task`, `measurement`, `choice`, `result`.
5. `choice` verbindet jede Option mit Feedback und einem Folgeschritt. Ein Folgeschritt auf die eigene ID bedeutet erneuter Versuch. Mindestens ein Abschluss muss von jedem Schritt erreichbar bleiben.
6. Eine Messung enthält Einheit, Beispielwert und Toleranz. Diese Toleranz ist nur eine Spielregel für eine vorbereitete Probe, keine technische Fertigungsfreigabe.
7. Hinweise reichen von Suchstrategie über Eingrenzung bis zum konkreten Lösungsweg. Maximal drei; ohne Punktabzug. „Mehr Unterstützung“ zeigt den ersten Hinweis sofort.
8. Reale Aufgaben sind im aktuellen Slice ausschließlich `mode: simulated`. Andere Modi oder echte Stationsintegration benötigen Phase 3.
9. `pnpm validate:content`, `pnpm test` und `pnpm build` ausführen, danach im Browser durchspielen. Die CLI prüft Schema, IDs, Verweise, Erreichbarkeit, Abschlussmöglichkeiten und grundlegende Raumreferenzen.

## Versionierung und Saves

Das Format verwendet `schemaVersion: 1`; die konkrete Quest hat zusätzlich `revision: 1`. Formatänderungen sind etwas anderes als Textkorrekturen. Bei semantisch geänderten Schritten oder Antwort-IDs die Revision erhöhen und eine gezielte Migration planen. Bis dahin verweigert die Anwendung das automatische Überschreiben eines unpassenden Spielstands und bietet einen bewussten Reset an.

Phase-1-Saves werden in das Saveformat 2 übernommen: gültige Position, Steuerungsvariante und alter Testwert bleiben erhalten. Neue Objektbelegung kann eine frühere Position ungültig machen; dann wird der sichere Spawn verwendet. Die neue Quest beginnt immer beim Briefing. Neue Profile erhalten einen von zwei Presets, keinen Character Creator.

Abschlusszustand und sichtbare Welt werden aus demselben gespeicherten Queststand abgeleitet. Es gibt keine zusätzliche Belohnungsbuchung und keinen XP-Zähler. Ein doppeltes Abschlussereignis bewirkt deshalb keinen zweiten Fortschritt.

## Noch nicht enthalten

Mehrere Räume/Quests parallel, Foto-/QR-/NFC-Adapter, inventarbasierte Sammelquests und frei kombinierbare Avatare sind nicht Teil von Phase 2. Erst bei Freigabe der entsprechenden späteren Phase ergänzen.
