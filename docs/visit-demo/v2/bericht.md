# Besuchsdemo V2 – Raum- und Grafikkorrektur

28.10.2026 · Reaktion auf das Review: Die erste Besuchsfassung war ein grafisch gefärbter Blockout, traf die gewünschte Optik nicht, ließ wichtige Maschinen aus und setzte Fenster falsch. Ihre Funktionstests waren kein Nachweis räumlicher oder gestalterischer Richtigkeit. Die erste Fassung ist **nicht visuell abgenommen**.

Aktuelle Vorschau: [Holzwerkstatt V2](http://localhost:4193/?demo=visit). Neuer Port vermeidet den alten Service-Worker-Stand. `Besuchsdemo-starten.command` öffnet jetzt diesen Port. Eigener Speicher `werk-visit-demo-v2`; der alte Demostand wird nicht überschrieben.

## Raumgrundlage statt freier Fensterplatzierung

[Prüfbare Draufsicht / Wandzuordnung](raumzuordnung.svg). Die Wandbuchstaben beziehen sich auf die vom Auftraggeber markierten Wände, nicht auf Maschinen-IDs. Die Geometrie unterscheidet nun Lager, kleinen Eingangsbereich, Hobelraum, CNC-/Laserraum und Absaugraum anhand des Grundrisses. P/Q/R sind für den Durchgang noch vereinfacht, das weitere 1. OG ist nicht vorweggenommen.

Fenster sind Daten ihrer tatsächlichen Host-Wand und werden nur entlang dieses Segments gerendert:

| Referenz | Aus Plan/Fotos abgeleitete Darstellung |
|---|---|
| M | Zwei hohe Fenster an der Lageraußenwand |
| E | Ein hohes Fenster an der Außenwand über der Hobelbank |
| C | Fenster im CNC-/Laserraum hinter den Lasergeräten |
| F, G, H | Keine zusätzlich erfundenen Fenster |

Die Öffnungen liegen auf Außengrenzen der Bodenflächen. Ein Test prüft Host-Wand, Segmentgrenzen, Fensterhöhe und Boden innen/außen. Das bestätigt die technische Verankerung; die genaue metrische Position und finale spielerische Verdichtung bleiben im gemeinsamen Raumreview zu prüfen. Vorderwände werden als niedrige Schnittwände dargestellt. Die Fenster selbst stehen nicht als unabhängige Objekte im Raum.

## Maschinen und Orientierungspunkte

| Wand / Quelle | Enthaltene Geräte und Einrichtung |
|---|---|
| A / D | CNC-Bett, Portal, orange Fräseinheit, Absaugschlauch; Durchgang zum Hobelraum |
| B | Ablage und hohe Holzablage im CNC-Raum |
| C | Blauer geschlossener Laser **und** offener schwarzer Diodenlaser |
| E | Hobelbank mit Schraubstock am Fenster |
| F | Schmale Bandsäge beim Eingang |
| G | Kapp-/Gehrungssäge sowie separate Tischkreissäge mit Verstellrad und roter Absaugung darunter |
| H | Gläserner Werkzeugschrank und Tischbohrmaschine auf hellem Schubladenschrank |
| I | Hohe zylindrische Absaugung im kleinen Nebenraum |
| L / N | Holz-/Restmateriallager, nicht eine leere Musterfläche |

Lose Stapel sind aufgeräumt; Geräte sind stilisierte Übersetzungen und keine maßhaltigen CAD-Modelle. Für J/K/O/P fehlen noch getrennte Detailansichten; daraus werden keine unbekannten Maschinen erfunden. Kleinere Elektrowerkzeuge, jedes Fach und die gesamte Wanddekoration sind noch nicht vollständig nachgebildet.

## Tatsächliche Bildgestaltung

Die flächigen Block-Maschinen und Block-Figuren sind durch generierte Raster-Sprites ersetzt: differenzierte Geräteformen, Holzmaserung, Metall, Werkzeugdetails, Jonas mit Cap/Brille und ein eigenständiger Spieler. Auch Regalrahmen, einzelne Böden und Kisten verwenden passende Rasterbauteile; deren Positionen folgen weiterhin dem gewählten Plan. Boden und Putz verwenden Rastermaterialien auf den isometrischen Flächen. Der Raumplan kommt aus Grundriss/Fotos, die gestalterische Richtung aus den Inspirationsbildern; deren erfundene Raumaufteilung wird nicht übernommen.

[Assetdateien, Referenzrollen und Promptset](assets-und-prompts.md). Erzeugung mit dem eingebauten Imagegen-Tool. PNG-Originale der gewählten Assets bleiben unverändert; Phaser nutzt Atlas-Frames. Eine gezielte zweite Atlasgenerierung schafft Abstand zwischen den Maschinen, damit keine Nachbarsprite-Fragmente erscheinen. Die Figuren sind vorläufige statische Sprites mit Bewegungsreaktion, noch kein vollständiges Richtungs-/Laufanimationsset.

## Funktionsnachweise und verbleibendes Review

Die bestehende Regalquest läuft weiterhin räumlich ab: Jonas, simulierter Messort, Proben, Verfahren, Planungsinteraktion und sichtbarer Bau. Messen/Bauen sind weiterhin ausdrücklich Simulation; keine reale Station oder Maschinenbedienung freigegeben.

11 Logik-/Geometrietests bestehen. TypeScript und Produktionsbuild bestehen. Der vollständige Touch-Questlauf bei 1600×900, Dialogdarstellung bei 1024×768, Retry, Planung, Weltveränderung, separater Speicher, Neustart und Offline-Browserneustart werden im [V2-Browserprotokoll](browser-results.json) dokumentiert. Der alte technische Einstieg wird weiterhin separat geladen. Diese Nachweise bestätigen Funktion; sie ersetzen kein visuelles Review durch den Auftraggeber.

Screenshots werden auf Fenster, fehlende/zusätzliche Maschinen, Atlasreste, Maßstabsverhältnisse und eine in der Welt plausibel stehende Figur geprüft. Der reale externe Touchscreen, reale iPads und die tatsächliche Vorführung bleiben menschliche Prüfungen. Eine endgültige Übereinstimmung mit der angestrebten Grafik wird nicht aus bestandenen Tests abgeleitet.

## Datenumfang

Der aktuelle Build umfasst 10.293.094 Bytes, rechnerisch 9.097.957 Bytes gzip; [Rohgrößen](build-sizes.json). Die PNG-Rastergrafik ist damit wesentlich größer als der frühere Blockout. Das vorgeschlagene 5-MB-Erststartbudget wird in dieser lokalen Besuchsfassung überschritten; das 15-MB-Slicebudget liegt darüber. Vor einem späteren öffentlichen Rollout sind verlustfreie Assetoptimierung und paketweises Laden erneut zu bearbeiten. Für diesen Stand wird kein Geräte-/Netz-Performancebudget als nachgewiesen behauptet.
