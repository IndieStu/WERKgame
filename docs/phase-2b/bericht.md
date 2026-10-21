# Phase 2B – UX Gameplay Prototype: Reviewstand

21.10.2026 · **Implementiert und technisch geprüft; menschliches Review offen. Phase 3 bleibt gesperrt.** Phaser + TypeScript + Vite unverändert gesetzt. Ein erfundener Placeholder-Raum, keine realen WERK-Assets, keine Raumaufnahme, keine Produktions-Pixelart und kein Character Creator. Alle visuellen Maße bleiben vorläufig.

## Ergebnis und Bedienung

[Lokale Vorschau auf dem Mac](http://localhost:4180/) · [Online im selben WLAN](http://192.168.178.22:4180/) – der zweite Link gilt nur für die aktuelle LAN-Adresse dieses Mac. Der Mac und der lokale Vorschauprozess müssen laufen. Kein öffentlicher Testhost. Für Offline auf iPhone/iPad wird vertrauenswürdiges HTTPS benötigt; LAN-HTTP ist dafür nicht geeignet.

„Neues Spiel“ → Preset → „Los geht’s“. Die Spielwelt füllt das Fenster. Jonas und Objekte werden direkt in der Welt aufgesucht; Notizen und Menü sind die einzigen dauerhaften HTML-Bedienelemente. Kurze Gespräche erscheinen unten. F2 bzw. `?debug=1` öffnet die sekundäre Entwickleransicht. Im Menü gibt es Einstellungen, größere Schrift, alternative direkte Bewegung, zugängliche Orte-/Objektliste und Export.

| Gewünschte Erfahrung | Umsetzung |
|---|---|
| Jonas selbst aufsuchen | Objektklick löst Wegfindung und Gespräch erst nach Annäherung aus. Kein zentraler Auftrag-Weiter-Button. |
| Freiwillig erkunden | Tasse mit kurzer atmosphärischer Reaktion; Material-/Maschinenobjekte mit kurzem Text und freiwilliger Vertiefung. |
| Standort untersuchen / messen | Freier Umriss wird räumlich aufgesucht; Anfang und Ende des Maßbands wählen, 90 cm ablesen/eingeben, Jonas berichten. Falsche Eingabe ist wiederholbar. Simulation, kein reales Messen behauptet. |
| Informationen vor Entscheidungen | Mindestens zwei der drei Proben ansehen; nur bekannte Materialien wählbar. Vor Verfahrenswahl beide Infopunkte untersuchen. Frühe Erkundung bleibt erhalten. |
| Sinnvolle Alternativen | Drei Materialwege mit Kontext, Zuschnitt oder CNC; keine erzwungene einzige Maschinenantwort. |
| Eigenständiges Planungs-Minispiel | An der Werkbank zwei Böden setzen, zwei verschieden hohe Kisten mit Luft in eigene Fächer stellen. Auswahl → Zielklick statt Pflichtziehen; zu kleine/belegte Fächer geben Feedback. Mehrere Lösungen. |
| Sichtbare Folge | Nach fertigem Plan zu Jonas, gemeinsam virtuell bauen: Regal erscheint mit Materialfarbe und Aufteilung; Bodenkisten wandern hinein. Bei reduzierter Bewegung direktes Umstellen. |
| Berufsbezug freiwillig | Nach Abschluss bei Jonas nachfragen, kein Abschlussformular oder Eignungsscore. |
| Unterbrechbar / offline | Lokaler Stand enthält Entdeckungen und unvollständigen Plan. Erneutes Ansprechen/Öffnen der Werkbank führt weiter. Vollständiger Produktionsbuild wird offline gecacht. |

Die Planungszeit von 30–60 Sekunden ist **weiterhin unbestätigtes UX-Ziel**. Es gibt weder Timer noch Mindestwartezeit. Material-/Verfahrenswahl und Planung sind vereinfachte Beispiele, keine reale Konstruktions- oder Maschinenfreigabe.

## Technische Nachweise

`pnpm test`: **9 Tests bestanden**, darunter sechs Material-/Verfahrenskombinationen, Checkpoint-Saves, Erkundungsvoraussetzungen, falsche Eingaben, doppelte/stale Aktionen, mehrere Planlösungen und ungültige Layouts. `pnpm build`: Schema-/Referenz-/Erreichbarkeitsprüfung, TypeScript und Produktionsbuild erfolgreich. Der Contentvalidator prüft jetzt auch bekannte Entdeckungen und erfüllbare Mindestanzahlen in Voraussetzungen.

`pnpm test:browser`: Produktionsbuild mit Chrome 155.0.8059.86 auf Mac, headless/SwiftShader; Desktop 1280×900, Tablet 810×1080 mit Chromium-Touchereignissen und vollständiger zusätzlicher Ablauf bei 390×844. Alle Fälle bestanden. [Rohdaten](browser-results.json), [Größen](build-sizes.json), [Screenshots](screenshots/).

Geprüft: fensterfüllender Canvas ohne permanentes Dashboard; Boden-Tap und gehaltene direkte Bewegung; Annäherung und freiwillige Tasse; Messpunkte, falsche Eingabe und Retry; Erkundung vor Entscheidungen; alternative Wahlwege; Böden/Kisten mit Fehlversuch; passende Planung nach Reload weiter nutzbar; Bau und Entfernung der Bodenkisten-Hotspots; freiwilliges Berufsgespräch; Offline-Reload und neuer Offline-Tab. Ein getrenntes persistentes Browserprofil wurde vollständig beendet und offline mit gespeichertem Maß im Materialschritt neu gestartet. Keine JavaScript-Pageerrors in Desktop-/Tablet-Durchläufen.

Früherer Save v2 wird vollständig unter `backup-before-2b` gesichert, Einstellungen bleiben erhalten, alte 40-cm-Kistenmessung wird **nicht** als 90-cm-Standortmessung übernommen. Die Geschichte beginnt ausdrücklich neu. Unbekannte Saveversion 99 bleibt beim Laden unverändert und erzeugt eine sichtbare Meldung. Gesperrter IndexedDB-Zugriff erzeugt eine sichtbare Warnung; die Sitzung kann ohne Speicherung weiterlaufen. Neue Runde ist ein bewusster Ersatz der aktuellen Runde, Sicherung früherer Teststände bleibt erhalten.

## Messwerte und Grenzen

| Messung | Desktop | Tablet-Emulation |
|---|---:|---:|
| Zeitpunkt `werk-ready` ab Navigation | 3.635 s | 0.333 s |
| Letzte etwa einsekündige FPS-Stichprobe | 60 fps | 59 fps |
| Fenster / Canvas | 1280×900 | 810×1080 |

Einzelmessungen im lokalen automatisierten Lauf, keine Verteilungen. Der erste Browserstart enthält Initialisierung; der zweite ist kein unabhängiger Kaltstart. SwiftShader/Chromium ist weder reales Safari noch das schwächste Zieltablet. FPS-Stichproben sind keine Garantie für stabile Mindest-FPS. Die 10-Mbit/s-/100-ms-Bedingung aus Phase 0 wurde hier nicht simuliert.

Build insgesamt **1.443.430 Bytes**, rechnerisch **392.723 Bytes gzip** inklusive Service Worker und Drittanbieterhinweisen. Keine neuen Bilddownloads. Dies ist eine Dateigrößenmessung, kein gemessener Netztransfer. Vite meldet weiterhin den großen Phaser-JavaScript-Chunk (ca. 1,43 MB unkomprimiert); keine zusätzliche Aufteilung für diesen Placeholder-Prototyp. Größenbudget unter 5 MB ist rechnerisch eingehalten, Geräte-/Netzstartbudget bleibt separat zu prüfen.

## Visuelle Prüfung und bekannte Grenzen

Desktop-, Tablet- und Telefon-Screenshots wurden visuell angesehen: kompakte Dialoge, Welt vor/nach Bau, Regalplan mit passenden Kisten. Auf dem Telefon folgt die nähere Kamera der Figur. Nicht alle Objekte passen gleichzeitig ins Bild; Menü → Orte und Dinge und Kamera-Zoom bleiben verfügbar. Der Plan kann auf schmalen/kurzen Ansichten vertikal scrollen. Schrift, Bildschirmtastatur, Safe Areas, Touchziele und Kameranachführung müssen auf dem iPhone 15 und später Schul-iPad menschlich geprüft werden. Der lange Einstiegsspruch über Jonas kann im engen Bildausschnitt abgeschnitten sein; der eigentliche Dialog bleibt lesbar.

Placeholder-Blöcke unterscheiden Proben/Maschinen nur grob. Das ist bewusst keine Bewertung von Produktionsgrafik; ob Jugendliche die Interaktionsmöglichkeiten ohne Vorwissen entdecken, bleibt Teil des Nutzungstests. Tastaturbedienbare HTML-Buttons, Formulare und native Dialoge, sichtbarer Fokus, vergrößerbare Schrift und reduzierte Bewegung sind vorhanden; ein vollständiger Screenreader-/Accessibility-Audit ist nicht erfolgt.

Die technische Grundlage ist weiterhin auf **eine Quest** begrenzt. Regal und freie Bodenzelle lesen noch direkt deren Abschluss. Die [WERK-Fest-Architekturprüfung](../design/werk-fest.md) benennt Registry, unabhängige Weltbeiträge und additive Save-Migrationen als spätere Arbeit vor weiterem Content. Kein Festfinale, Multiplayer oder Klassen-Synchronisation implementiert.

## Review und nächster Freigabepunkt

[Selbstbedienung und menschlicher Nutzungstest](nutzungstest.md) liegen bereit. Noch keine menschliche Spielbarkeit, pädagogische Qualität oder unterhaltsame Experience als nachgewiesen behaupten. Fachreview der vereinfachten Material-/Verfahrensinhalte und reale iPad-Prüfung stehen aus. Die ursprüngliche Schätzung von 6–9 PT ist Planungsaufwand, keine aus Agentlaufzeit abgeleitete Ist-Zeiterfassung.

Empfehlung: Auftraggeber spielt ohne Debug durch, danach kurze Beobachtung mit unvorbereiteten Personen. Finden sie Jonas, Messung und Werkbank, verstehen sie das Planen und erkennen sie ihre Folge? Erst dann gezielte UX-Korrekturen bzw. Freigabe entscheiden. **Hier stoppen. Phase 3 bleibt bis zur ausdrücklichen Freigabe gesperrt.**
