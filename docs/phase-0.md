# Phase 0: WERK-Spiel

Stand: 21.10.2026 · Phase 0 abgeschlossen und nach Auftraggeberentscheidungen aktualisiert. Phaser ist als Engine bestätigt; NFC bleibt eine mögliche spätere Ergänzung. Phase 0 ist freigegeben; ausschließlich Phase 1 ist zur Umsetzung freigegeben. Phase 2 bleibt gesperrt.

Projektbasis: [IndieStu/WERKgame](https://github.com/IndieStu/WERKgame).

## A. Executive Summary

Das Vorhaben ist als kleines, statisch gehostetes Webspiel technisch machbar. Die anspruchsvollsten Teile sind die Bedienbarkeit auf realen Tablets, eine konsistente isometrische Assetproduktion und die Verzahnung mit sicher zugänglichen realen Stationen. Die Spiellogik selbst bleibt überschaubar.

**Beschlossene Engine: Phaser.** Geplanter Versions-/Stackstart: Phaser 4.2.1 mit TypeScript und Vite; zugängliche HTML/CSS-Oberfläche über beziehungsweise neben dem Spielcanvas; JSON-Inhalte mit JSON Schema; Tiled für Raumlayouts; zunächst ein lokaler Spielstand in IndexedDB. Keine Accounts, kein Backend, keine KI-Laufzeitdienste. Versionen werden vor Phase 1 überprüft und exakt fixiert.

**Dokumentierte zweite Wahl aus der Recherche:** Godot 4.7.2 mit GDScript, Compatibility-Renderer und Single-Thread-Webexport. Die vorhandene Erfahrung und der visuelle Editor sind echte Vorteile. Phaser gewinnt für diesen Auftrag durch die unmittelbare Anbindung an Browserformulare, URLs, Speicher und barriereärmere DOM-Oberflächen. Das ist eine projektspezifische Bewertung, kein allgemeines Engine-Ranking.

**Darstellung:** feste 2:1-Pixel-Dimetrie, vorläufig 64×32-Pixel-Bodentiles, Figuren in 48×80-Pixel-Zellen, etwa 56–64 Pixel sichtbare Körperhöhe. Vor einer Assetproduktion werden diese Maße im Testraum auf Tablets geprüft.

**Erster Slice:** ein erfundener Raum, Jonas und ein Avatar, eine 5–10-Minuten-Regalquest, simuliertes Messen, begründete Material- und Verfahrenswahl, Hinweise und lokaler Fortschritt. Die reale Verzahnung muss anschließend gesondert vor Ort erprobt werden: Eine simulierte Aufgabe beweist noch keinen funktionierenden Gebäuderundgang.

## B. Interpretation und pädagogische Grenzen

Das Spiel ist eine Brücke zum Lernort. Langfristig verändern abgeschlossene Werkstattquests die gemeinsame WERK-/Festivalwelt sichtbar. Dies ersetzt XP-/Levelsysteme; die Umsetzung gehört ausdrücklich nicht zu Phase 1.

Ein Erfolg ist eine nachvollziehbare Entscheidung nach einer realen Beobachtung, nicht das Einsammeln von Quizpunkten. Jede Quest braucht einen Zweck, zugängliche Informationen, eine Handlung und eine verständliche Konsequenz. Berufsfelder werden erst danach mit den erlebten Tätigkeiten verknüpft.

Die Festival-Rahmenhandlung passt: Verschiedene Werkstätten tragen zu einem gemeinsamen Ergebnis bei. Empfehlung: ein kleines offenes WERK-Fest als Rahmen, drei unabhängige Aufträge im ersten Pilot und ein sichtbar wachsender Veranstaltungsraum. Keine strikte Kette, in der eine gesperrte Werkstatt alle weiteren Aufträge blockiert. Das Finale darf auch nach einer ausgewählten Route erreichbar sein.

13–18 Jahre rechtfertigen unterschiedliche Hilfen, aber keine Altersdiagnose. Niemand wird aufgrund von Fehlern oder Lesedauer als ungeeignet für einen Beruf dargestellt. Interessen werden höchstens freiwillig reflektiert. Selbstauskunft „Das hat mir gefallen“ ist aussagekräftiger für die Reflexion als erzwungene Multiple-Choice-Antworten. Kein automatisches Berufsprofil aus richtigen Antworten ableiten.

„Weitgehend unbeaufsichtigt“ bedeutet selbstständige Spielbedienung innerhalb eines organisatorisch freigegebenen Besuchs. Ein Webspiel ersetzt keine Einweisung, Aufsichtspflichten oder betriebliche Zutrittsregeln. Die sichere Route und erreichbare Hilfe werden vor Ort festgelegt.

## C. Technische Machbarkeit und Nachweisgrenzen

Einzelräume, kleine Spriteatlanten und wenige gleichzeitig aktive NPCs benötigen keine 3D-Engine. Statische Dateien reichen. Fotos, QR-Scanner und PWA sind optionale Browserfunktionen und müssen als ausfallbare Erweiterungen gestaltet werden.

Noch gibt es keine Messwerte für Downloadgröße, Framerate oder Gerätekompatibilität. Aussagen zur konkreten Zuverlässigkeit wären vor einem Prototyp verfrüht. Phase 1 testet mindestens ein tatsächlich eingesetztes iPad/Safari, ein Android-Tablet/Chrome und einen Laptop mit Chrome/Edge beziehungsweise Firefox. Modell, Betriebssystem und Browserversion werden protokolliert; Safari auf macOS ersetzt keinen iPad-Test.

Vorgeschlagene Budgets: erster spielbarer Raum höchstens 5 MB komprimierter Netztransfer; vollständiger Slice höchstens 15 MB ohne optionale Medien; Spielstart innerhalb von 10 Sekunden bei 10 Mbit/s und 100 ms Latenz; auf dem schwächsten Zieltablet stabile 30 fps, 60 fps als Wunsch. Das sind Abnahmeziele, keine Engine-Zusagen. Speicher und Hintergrund-/Vordergrundwechsel mitmessen. Initialer Offline-Erstbesuch ist nicht möglich; Vorbereitung im WLAN gehört zum Betriebskonzept.

## D. Recherche und Enginevergleich

### Versionsstand

Die am 21.10.2026 gelesenen offiziellen Quellen nennen Phaser **4.2.1** vom 09.07.2026 im [Releasearchiv](https://phaser.io/download/archive), Godot **4.7.2 stable** vom 18.08.2026 und **4.8 beta1** im [Godot-Archiv](https://godotengine.org/download/archive/), sowie Defold **1.14.0** vom 12.10.2026 in der [Releaseankündigung](https://defold.com/2026/10/12/Defold-1-14-0/). Keine Beta als Projektbasis. Rollierende Dokumentation ist nicht automatisch identisch mit einem fixierten Release.

Phaser 4 ist seit April 2026 veröffentlicht und besitzt einen neuen Renderer; ältere Phaser-3-Beispiele müssen geprüft werden. Standard-Sprites und Tilemaps bleiben zentrale Konzepte. Quelle: [offizieller Vergleich Phaser 3/4](https://phaser.io/news/2026/05/phaser-3-vs-phaser-4). Die [API-Dokumentation 4.0.0](https://docs.phaser.io/api-documentation/4.0.0/namespace/tilemaps-orientation) führt isometrische Orientierung ausdrücklich auf. Daraus folgt keine automatische Iso-Kollision. Normale Tilemap-Layer verwenden; die GPU-Speziallayer nicht ungeprüft für Iso einplanen.

Godots Webexport verlangt laut [Webexport-Dokumentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) WebAssembly und WebGL 2. C#-Projekte werden dort weiterhin als nicht webexportfähig beschrieben. Single-Thread-Export ist seit 4.3 möglich und Standard; Threads benötigen besondere Isolation. Für eine Alternative würden wir GDScript und Compatibility verwenden, ohne Threads beginnen und Safari besonders testen. Godot ist damit keineswegs grundsätzlich ungeeignet für iPads.

Defold erzeugt ebenfalls statische HTML5-Bundles über WebAssembly; die [HTML5-Dokumentation](https://defold.com/manuals/html5/) beschreibt ungethreadete und gethreadete Ziele sowie deren Hostingbedingungen. Die [Defold-Lizenz](https://defold.com/license/) erlaubt Spielevertrieb, beschränkt aber die Kommerzialisierung der Engine/des Editors. Deshalb nicht mit einer uneingeschränkt permissiven MIT-Lizenz gleichsetzen.

### Vergleich aller geforderten Kriterien

Bewertungen sind eigene Einschätzungen für dieses Projekt, keine Benchmarks. „Eigenbau“ meint kleine anwendungsspezifische Logik.

| Kriterium | Phaser 4 | Godot 4 | Defold |
|---|---|---|---|
| 1 Iso-Pixel-Art | Iso-Tilemaps; Tiefensortierung selbst planen | Sehr guter 2D-Editor und Iso-Layouts | Möglich; Layout/Sortierung stärker selbst aufbauen |
| 2 Webexport | Browser ist direkte Laufzeit | WASM/WebGL2-Export | HTML5/WASM-Bundle |
| 3 Tablet-Browser | Gute Ausgangsbasis; Gerätetest erforderlich | Machbar; Export-/Safari-Test wichtig | Machbar; Speicher-/Browser-Test wichtig |
| 4 Touch | Pointer-Ereignisse plus DOM | Touch/InputMap | Touch-Input |
| 5 Maus/Tastatur | Direkt plus Browser-Fokusregeln | Sehr guter InputMap-Workflow | Input-Bindings |
| 6 Assets | Loader/Atlanten plus Dateipipeline | Integrierter Import/Editor | Atlanten/Editor |
| 7 Tilemaps | Tiled-Import; Iso unterstützt | Integriertes TileMapLayer/TileSet | Tilemaps; Iso-Workflow zusätzlich prüfen |
| 8 Animation | Gut für Spriteframes | Sehr gute Editorwerkzeuge | Gut für Spriteanimation |
| 9 Dialog | Eigene DOM-Komponente | Eigene Control-Oberfläche | Eigene GUI |
| 10 Quests | Reine TypeScript-Zustandslogik | GDScript/Resources oder JSON | Lua/JSON |
| 11 Lokale Saves | IndexedDB direkt | Browserpersistenz/Bridge prüfen | Browserdateisystem/Persistenz prüfen |
| 12 PWA/Offline | Service Worker direkt integrierbar | Export-/Shell-Integration | Eigene Web-Shell-Integration |
| 13 Ladezeit | Kleine Anwendung gut steuerbar | Enginepayload zusätzlich | Schlanke Bundles möglich; messen |
| 14 Performance | Für kleine 2D-Räume plausibel | Für kleine 2D-Räume plausibel | Für kleine 2D-Räume plausibel |
| 15 Browser | Direkte Webintegration | WASM/WebGL2-Bedingungen | WASM/Grafikbedingungen |
| 16 Selfhosting | Statische Dateien | Statischer Export | Statisches Bundle |
| 17 GitHub/CI | npm und gängige Webtests | Headless-Build plus Exporttemplates | Bob-Buildwerkzeug |
| 18 Wartbarkeit | Gut bei kleinen TS-Modulen | Gut mit Szenendisziplin | Gut; zusätzliche Lua-Einarbeitung |
| 19 Automatisierte Entwicklung | Textdateien, schnelle Logik-/DOM-Tests | Skripte gut; Szenen visuell prüfen | Skripte gut; zusätzliche Toolchain |
| 20 Vorwissen | Neue API/TS-Arbeitsweise | Klarer Vorteil vorhandener Erfahrung | Neue Engine und Lua |
| 21 Offenheit | MIT-Framework; Zusatzprodukte optional | MIT | Eigene Lizenz mit Einschränkungen |
| 22 Debugging | Browser-DevTools direkt | Engine-Debugger plus Browser | Enginewerkzeuge plus Browser |
| 23 Contentpflege | JSON/Schema/Tiled | Editor/Resources oder JSON | Editor/Lua/JSON |
| 24 Modularer Avatar | Layer oder vorberechneter Atlas | Layer/Animation gut machbar | Layer/Atlanten machbar |
| 25 QR/URL | Browser-URL direkt | JavaScript-Bridge | JavaScript-Bridge |

## E. Technologieentscheidung und Alternativen

Phaser + TypeScript gewinnt, weil das Produkt gleichermaßen Spiel und webbasierte Lernoberfläche ist. Native HTML-Eingabefelder, responsive Textansichten und URLs sind wesentliche Produktfunktionen. Ein separates UI-Framework ist zunächst unnötig; kleine DOM-Komponenten reichen. Vite übernimmt Entwicklung und statischen Build. Kein ECS, keine Microservices, keine Pluginplattform.

Phaser ist vom Auftraggeber abgenommen. Der Godot-Vergleich bleibt als Entscheidungsbegründung erhalten; eine parallele Engineevaluation ist nicht vorgesehen. Nur bei einem nachgewiesenen, nicht sinnvoll behebbaren Blocker in Phase 1 wird die Enginefrage gemeinsam erneut geöffnet.

Defold wird nicht gewählt: Die gute 2D-/Webbasis rechtfertigt hier weder eine dritte neue Arbeitsweise noch zusätzlichen Aufwand für Iso-Layouts und Browser-UI. Auch die Lizenz ist weniger offen als MIT. PixiJS wäre als Renderer möglich, verlangt aber mehr eigene Spielsysteme; Unity und vollwertiges 3D bringen keinen angemessenen Nutzen. Kein Bedarf an einer weiteren Engine-Evaluation.

## F. Architektur: kleine Module, klare Datenflüsse

```text
JSON-Inhalte + Raumlayout → Validierung → ContentRepository
                                            ↓
Browser-URL / Eingabe → QuestEngine → ProgressState → SaveStore
                            ↓               ↓
                     Dialogue/Hint      HTML-Oberfläche
                            ↓
                 RoomScene / Interaktionsobjekte
```

- **QuestEngine:** reine Zustandsübergänge, Bedingungen und Antwortfeedback; keine Phaser-Abhängigkeit.
- **DialogueView:** Text, Optionen, Fokus, Fortsetzen. Inhalte kommen aus Daten.
- **HintSystem:** zeigt die nächste redaktionell geschriebene Hilfestufe zum aktuellen Schritt.
- **RoomSystem:** lädt einen Raum, Spawnpunkte, Türen und Interaktionsobjekte.
- **InteractionSystem:** Objekt-ID, Erreichbarkeit und zulässige Aktion; Objektklick lässt zur sicheren Nachbarzelle laufen und interagiert erst bei Ankunft.
- **PlayerProfile:** Avatar-Konfiguration und freiwillige Hilfeeinstellungen, keine Personendaten erforderlich.
- **ProgressState:** aktuelle Questschritte, Antworten, Freischaltungen, nicht das gesamte Szenenobjekt.
- **SaveStore:** Lesen, Validieren, Migration und atomisches Speichern.

Das sind Verantwortlichkeiten, keine Pflicht zu acht Klassen oder globalen Managern. Zunächst wenige Dateien und explizite Funktionsaufrufe. Phaser rendert die Welt; HTML rendert Dialog, Questlog, Einstellungen und Formulare. Ein gemeinsamer Zustand verhindert widersprüchliche Fortschrittsanzeigen. Während modaler Dialoge keine Bewegung; beim Schließen Fokus zurückgeben.

## G. Quest-Datenmodell

Empfehlung: JSON pro Quest plus JSON Schema. Weniger bequem als YAML bei langen Texten, dafür direkt lesbar im Browser, klar typisiert und ohne zusätzlichen Parser. Texte bleiben kurz. Noch kein grafischer Editor, keine Skripte in Contentdateien.

[Beispieldaten](../content/examples/shelf-problem.json) zeigen die beabsichtigte Struktur. Das Beispiel ist ein Designartefakt; Schema und Laufzeit werden erst nach Freigabe implementiert.

Gemeinsame Felder: `schemaVersion`, stabile `id`, `revision`, `roomId`, `npcId`, `startStepId`, `steps`. Jeder Schritt hat `id`, `type`, Text, optionale Hinweise und erlaubte Folgeschritte. Kleine feste Typmenge: `dialogue`, `real_world_task`, `measurement`, `choice`, `result`. Erst bei tatsächlichem Bedarf `sequence` oder `photo` ergänzen.

`real_world_task` beschreibt sichere Tätigkeit, Station, Alternative bei Nichtverfügbarkeit und explizite Rückkehr. `measurement` speichert Einheit, erwartete Dimension, redaktionell begründete Toleranz und Feedback. Komma/Punkt akzeptieren, Zahlen endlich prüfen, Einheiten sichtbar halten. Ein Zahlendreher ist kein Beleg fehlender Kompetenz. Der Slice nutzt eine fiktive 40-cm-Kiste; Werte sind keine Planung eines belastbaren realen Regals.

`choice`-Optionen enthalten eigenes Feedback und einen benannten Folgeschritt. Mehrere Antworten dürfen begründet weiterführen. Kein universelles `correct: true`, wenn Abwägungen gemeint sind. Keine freie Ausdruckssprache, `eval` oder beliebige Funktionsnamen in JSON. Benötigte Bedingungen als kleine Whitelist, etwa `questCompleted` und `stationAvailable`.

Vor dem Build prüfen: Schema, eindeutige IDs, gültige Referenzen, erreichbarer Start und Abschluss, erkennbare unbeabsichtigte Sackgassen, vorhandene Assets und maximal zulässige Schrittarten. Laufzeittests prüfen Wiederholen, Rückkehr, Reload, ungültige Eingaben und doppelte Ereignisse. Ein Abschluss darf bei wiederholtem Tap keine Belohnung duplizieren. Inhaltsänderungen erhalten Revisionen; neue Schritt-IDs statt stiller Bedeutungsänderung bestehender IDs.

## H. Dialoge

Ein bis drei kurze Sätze pro Karte, höchstens drei bis vier gut unterscheidbare Optionen. Sprechername und optional Portrait; kein Tippeffekt als Pflichtwartezeit. Text sofort vollständig anzeigen oder vollständig einblendbar machen. Vertiefung hinter „Mehr erfahren“. Freie Texteingabe zunächst vermeiden; eine knappe Auswahlbegründung ist zugänglicher und leichter redaktionell zu prüfen.

Jonas kommentiert Entscheidungen mit konkretem Kontext. Beispiel: „Für eine leichte Deko wäre das denkbar. Unsere Kisten sind schwerer. Schau noch einmal auf die vorbereitete Belastungsangabe.“ Humor richtet sich auf Situation und NPC, nicht auf Jugendliche. Ein Begriff wird erklärt, bevor seine Kenntnis vorausgesetzt wird.

## I. Hinweise

Drei vom Content geschriebene Stufen: Ort/Strategie → Beobachtung eingrenzen → fast vollständiger Lösungsweg. Hinweise bleiben abrufbar und kosten keine Punkte. Nach zwei erfolglosen Versuchen Hilfe aktiv anbieten, nicht ungefragt die Lösung aufdecken. Realweltzeit und Lesedauer sind keine Fehlersignale. Pausen, Hintergrundwechsel und Gebäudesuche dürfen keine automatische Abwertung auslösen.

Hilfestufe und Versuche nur im aktuellen lokalen Questzustand speichern; kein dauerhaftes Kompetenzprofil. „Schritt überspringen / Alternative“ ermöglicht Fortsetzung bei unzugänglichen Stationen und enthält dieselbe fachliche Reflexion.

## J. Charaktere und Creator

### Jonas-Referenz

Die beigefügte Grafik zeigt starke Wiedererkennung durch blaue Arbeitsjacke, blaue Cap mit gelblichem Schirm, Brille und dunkle Hose. Warme Haut-/Haarfarben setzen sich vom Blau ab; der Werkstattlook wirkt freundlich und eher jugendlich als autoritär. Die Detaildichte ist für Dialogportraits geeignet, für kleine laufende Figuren teilweise zu hoch: Brille, Cap und Jackensilhouette priorisieren, winzige Jackentexturen reduzieren.

Die Ansichten sind keine konsistenten isometrischen Produktionsframes. Unterschiedliche Posen, Abstände, Beleuchtung und Ansichten verhindern ungeprüftes Ausschneiden als Atlas. Aus dem Referenzbild lässt sich keine verlässliche Original-Pixelauflösung ableiten. Rechte und Zustimmung zur wiedererkennbaren Darstellung realer Personen vor Veröffentlichung dokumentieren.

### Vorläufige Produktionsspezifikation

| Element | Vorschlag |
|---|---|
| Figurenraster | 48×80 px, einheitlicher Fußanker, sichtbare Höhe 56–64 px |
| Bewegung | Vier Richtungen entlang der projizierten Raumachsen: NE, SE, SW, NW |
| Walk | Vier Frames pro Richtung, zunächst 6–8 fps |
| Idle | Ein Frame pro Richtung; optional zwei später |
| Talk | Ein bis zwei Front-Dreiviertelposen; Portraitwechsel statt Vollanimation |
| Point / Think | Je eine Pose bei konkretem Questbedarf |
| Use/Work | Zunächst eine Pose plus Effekt am Objekt; keine maschinenspezifische Serie |
| Carry | Nicht im Slice; später zwei Layer-/Armvarianten nur bei Bedarf |
| Portrait | 96×96 oder 128×128 px, getrennt von Weltfigur |

Vier Richtungen statt acht reduzieren Kosten. Spiegelung nur nach Sichtprüfung: Cap, Werkzeuge und asymmetrische Kleidung dürfen nicht beliebig die Seite wechseln. Im Slice genügen 16 Walkframes plus vier Standbilder je Figur; Talk kann auf Standbild und UI beruhen. Keine Lauf-/Sitz-/Hebesammlung aus der Referenz nachbauen.

Creator zunächst mit sechs Hautpaletten, drei Frisuren, vier Haarfarben, Brille an/aus, zwei Oberteilformen und wenigen Kleidungsfarben. Keine Geschlechtsauswahl als Voraussetzung; Name und Pronomen freiwillig und unabhängig, zunächst auch ganz weglassbar. Größere körperliche Vielfalt sollte später bewusst geplant werden, statt durch den ersten begrenzten Baukasten als abgeschlossen zu gelten.

Empfehlung: synchronisierte Layer für Körper, Kleidung, Haare und Zubehör; Palettevarianten beim Export erzeugen. Sämtliche Layer teilen Framegrößen und Fußanker. Unter-/Überlagerung von Armen und getragenen Objekten erst bei Bedarf ergänzen. Kein Shader-Palettentausch im ersten Slice. Bei wenigen Avataren Layer einmal in einen lokalen Atlas komponieren, falls Laufzeitlayer unnötige Komplexität erzeugen.

Die Arbeit wächst mit Varianten × Richtungen × Frames, auch wenn Dateien geteilt werden. Beispiel: drei Frisuren × vier Richtungen × fünf Grundposen ergeben schon 60 zu kontrollierende Frisurframes. Daher Creator erst nach stabiler Basisanimation, im Slice nur zwei vorkonfigurierte Avatare.

## K. Isometrie- und Pixel-Art-Pipeline

Echte Isometrie verkürzt alle drei Achsen gleich; Bodenachsen liegen in der klassischen Darstellung bei ungefähr 30°. Die übliche 2:1-Pixelansicht mit Steigung 1:2 ist geometrisch dimetrisch und erleichtert saubere Pixelkanten. Freie Pseudo-Isometrie lässt mehr zeichnerische Freiheit, riskiert aber inkonsistente Objektwinkel. Empfehlung: feste **2:1-Dimetrie**, keine Rotation, keine wechselnden Projektionen.

Logische Koordinaten bleiben ein quadratisches Bodenraster. Für Tilegröße 64×32 gilt vor Kameraoffset: `screenX = (u-v)*32`, `screenY = (u+v)*16`. Rückrichtung: `u = screenX/64 + screenY/32`, `v = screenY/32 - screenX/64`. Kamera, Zoom, Mapursprung und Objektanker müssen vor dem Picking herausgerechnet werden; Mapeditor-Konventionen am Testtile prüfen.

Kollision und A*-Wegefindung arbeiten in Bodenkoordinaten. Vier Nachbarn verhindern Eckenschneiden; später acht nur mit geprüfter Diagonalregel. Tastaturrichtungen werden konsistent auf Bildschirmrichtungen abgebildet und im Test erklärt. Einfache Gridbewegung mit glatter visueller Interpolation reicht, keine Iso-Physiksimulation.

Bodentiles liegen unten. Möbel, Figuren und Vorderteile werden anhand ihres Bodenankers sortiert. Große Möbel in Grundkörper und Vorderteil teilen oder geordnete Teilobjekte nutzen: reines `depth = y` löst nicht jede Überdeckung großer Flächen. Hinterwände bleiben sichtbar, Vorderwände sind ausgespart oder transparent. Testfall: Figur läuft vor, hinter und neben dem Regal sowie durch eine Tür.

Vorläufige Basisansicht 480×270 logische Pixel für die Welt, typischerweise zweifach auf 960×540; HTML-UI in CSS-Pixeln unabhängig davon. Nicht den gesamten Dialog auf die niedrige Pixelauflösung reduzieren. Nearest-Neighbour, keine Texturglättung, gerundete Renderpositionen; flexible Kamerafläche/Letterboxing bei anderen Seitenverhältnissen. Das endgültige Kamera-/UI-Verhältnis entscheidet der Tabletversuch, nicht der Desktop-Screenshot.

Pipeline: Skizze → begrenzte Palette → Maß-/Ankerblatt → Pixelquelle → PNG/Atlas plus Metadaten → Importtest → Kollisions-/Interaktionsdaten → Gerätesichtung. 24–32 Grundfarben als Start, Hautfarben passend erweitern. Eine Lichtquelle, konsistente Konturen, gut getrennte Interaktionsmarker. PNGs selbst hosten; editierbare Quellen erhalten. KI-Bilder höchstens als Entwurf mit Rechteprüfung, nicht als ungeprüfte konsistente Animationsserie.

Tiled dient als Layoutwerkzeug: Bodenlayer, Dekoration, Objektlayer für Spawn, Tür, Landmarken, Interaktionspunkte und begehbare/blockierte Flächen. Objekt-IDs verbinden Karte und Content. [Tiled beschreibt Objektlayer und eigene Eigenschaften](https://doc.mapeditor.org/en/stable/manual/objects/). Tiled-JSON zunächst über einen kleinen geprüften Adapter lesen; keine universelle Importbibliothek selbst entwickeln. Pixelwerkzeug frei wählen, beispielsweise vorhandenes Aseprite oder ein alternatives Werkzeug; für Phase 1 reicht ein einfacher Placeholder-Export.

## L. Raumdokumentation

Die [Vorlage](templates/raumaufnahme.md) ist der verbindliche Erfassungsstart nach dem Perspektivtest. Ablauf: Zugänglichkeit und Fotorechte klären → Raum-ID vergeben → Shotlist und Skizze → drei bis fünf Wiedererkennungsmerkmale wählen → kompakter Iso-Blockout → Assetliste mit Prioritäten → Kollision und sichere Interaktionsstellen → Questintegration → Abgleich mit realem Raum.

Reale Maße dienen der Orientierung und Größenrelation, nicht der Bauvermessung. Originalfotos getrennt von Webassets halten; keine Personen, Namenslisten, privaten Displays oder Zugangsinformationen aufnehmen. Sicherheitszonen werden redaktionell markiert und vom Standort bestätigt. Ein Raum wird erst produziert, wenn ein lesbarer Blockout und die reale Route freigegeben sind.

## M. QR und reale Aufgaben

**Ergänzung nach Nutzerinput:** NFC und Fundquests sind in der [NFC-Prüfung](nfc-pruefung.md) untersucht. iPads sind nun die primäre konkrete Geräteannahme. Beschlossener Scope: QR/Kurzcode als Basis; NFC nur als mögliche spätere Ergänzung, ohne Hardwaretest oder Implementierung im ersten Prototyp. Mehrere passende Objektfunde dürfen ein Minigame oder NPC-Ereignis freischalten. Die Fundquest-Idee bleibt unabhängig vom Scanmedium nutzbar; eine NFC-Umsetzung wird erst später gesondert entschieden.

Empfehlung für gedruckte Codes: dauerhafte eigene Origin mit Fragment, etwa `https://spiel.example.org/#/station/holz-material-01`. Fragmente gehören nicht zum HTTP-Request; Standortparameter landen dadurch nicht automatisch im üblichen URL-Pfad-/Query-Log. Keine Namen, Saves oder personenbezogenen Daten in URLs. Queryparameter wären technisch möglich, bringen hier aber keinen Vorteil.

Nur erlaubte Station-IDs auflösen. Ein Link öffnet Station/Information, bestätigt aber nicht automatisch eine erledigte Aufgabe. Die QuestEngine prüft aktuellen Schritt und fordert eine bewusste Bestätigung oder Entscheidung. Unbekannte Codes zeigen eine neutrale Meldung; kein beliebiger Codepfad, keine Weiterleitung auf ungeprüfte Ziele. Ein QR-Code beweist keine Anwesenheit und ist kein Sicherheits- oder Prüfungsnachweis.

Wichtiger Gerätefall: Die Systemkamera kann einen anderen Browser oder Tab öffnen, mit anderem Speicher als die laufende PWA. Für den Pilot ist ein kurzer Stationscode zur manuellen Eingabe in der laufenden Anwendung der robuste Standard-Fallback. In-App-Scanning kann später denselben Stationsresolver verwenden; nativen BarcodeDetector nicht als einzige Lösung voraussetzen. Kamera nur nach ausdrücklichem Start, mit verständlicher Berechtigungsfrage und anschließendem Stoppen des Streams. [getUserMedia verlangt einen sicheren Kontext und Zugriffsberechtigung](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

Offline funktioniert ein gedruckter URL-Code nur dann zuverlässig, wenn Anwendung und Station bereits im passenden Browsercache vorhanden sind. Ein erstmals gestarteter externer Browser ohne Cache kann daran scheitern. Kurzer Code, Stationsübersicht und Spielinteraktion dürfen deshalb alle ohne Kamera funktionieren. Laptopnutzer können denselben Code direkt eingeben. QR bleibt ein gelegentliches Hilfsmittel, kein Pflichtschritt jedes Objekts.

Jede reale Aufgabe enthält: freigegebene Station, sichere Tätigkeit, eindeutiges Objekt, benötigtes Hilfsmittel, erwartete Rückkehr und Alternative bei Sperrung. Vor Ort nur Beobachten, vorbereitete Proben vergleichen, ungefährliche Objekte messen. Maschinen laufen ausschließlich virtuell. Aufgaben niemals so formulieren, dass Jugendliche Schutzzonen betreten oder Geräte einschalten müssen. Tablet beim Gehen weglegen; Aufgabe merken oder kurze Karte mitnehmen. Erreichbare Kontaktperson und Hilfeort sind Teil des Starts.

## N. Spielstand und Datenschutz

IndexedDB speichert einen kleinen versionierten Datensatz: `saveVersion`, `contentVersion`, Avatar-IDs, Hilfeeinstellungen, Raum-/Spawn-ID, Questschritt-IDs und nötige Antworten. Keine vollständigen Klickprotokolle, exakten Alterswerte oder Cloudprofile. Ein einzelner aktueller Save reicht im Pilot. Transaktional nach bestätigten Übergängen schreiben; bei Raumwechsel auf sicheren Spawn zurücksetzen.

Migrationen einzeln `v1 → v2 → v3`, vor Änderung validieren und letzten lesbaren Stand bewahren. Unbekannt neuere Saves nicht überschreiben. Bei entfallenen Schritten auf einen redaktionell definierten Checkpoint zurücksetzen, mit Erklärung. Speicherfehler sichtbar melden; Spielen ohne Speicherung weiter erlauben. Export/Import eines kleinen JSON-Saves später optional, mit Schema-/Größenprüfung und ohne Bilder.

Browserdaten sind keine garantierte dauerhafte Sicherung. Nutzer können sie löschen, Browser können Daten verdrängen, Privatmodus und Gerätewechsel ändern das Verhalten. `navigator.storage.persist()` ist höchstens eine Anfrage. [MDN erläutert Quoten und Eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria). Shared-Tablet-Start bietet „Fortsetzen“ oder „Neue Runde“; Reset löscht Profil, Antworten und optionale Medien, aber kann reine Offlineassets behalten. Nicht so tun, als sei ein lokales Profil vor der nächsten Person geschützt.

Fotoquests erst nach dem Slice. Standard: Aufnahme nur vorübergehend im Arbeitsspeicher, auf Wunsch lokal in IndexedDB; nie automatischer Upload. Bilder verkleinern, technische Metadaten beim Neucodieren entfernen und das Ergebnis prüfen. Betriebssystemkamera oder Dateiauswahl können trotzdem eigene Originale erzeugen; darauf knapp hinweisen. Keine Gesichter als Aufgabe, kein Biometriesystem. Kamera ablehnen führt zu einer gleichwertigen Alternative. Auf gemeinschaftlichen Geräten keine Fotogalerie zwischen Gruppen erhalten.

Auch statisches Hosting erzeugt potenziell IP-/Zugriffslogs. Drittanbieterfonts, Analytics, Tracking und externe Assets vermeiden; Logging und Aufbewahrung mit Betreiber minimieren. Verantwortliche Stelle, Datenschutzhinweise, Foto-/Darstellungsrechte und organisatorische Regeln vor Pilot klären. Dies ist ein technisches Minimierungskonzept, keine abschließende rechtliche Bewertung.

## O. Adaptive Unterstützung

Zwei unabhängige Schalter statt verstecktem Schwierigkeitsscore: **Hilfen: mehr / normal / auf Anfrage** und **Tiefe: kompakt / vertiefend**. Jederzeit veränderbar. Startfrage: „Wie möchtest du starten?“ mit Beispielen. Alter ist für den Pilot technisch nicht nötig; weglassen, solange kein nachgewiesener Nutzen besteht.

Gleiche Kernaufgabe und gleichwertiger Abschluss für alle. „Mehr Hilfen“ zeigt Bilder, Einheitenbeispiele und eine kleinere erste Auswahl; „vertiefend“ bietet technische Abwägungen und zweite begründbare Lösungen. Zwei gescheiterte Eingaben lösen ein Hilfeangebot aus; keine automatische dauerhafte Einstufung. Nicht während einer Entscheidung Antwortmöglichkeiten überraschend ändern. So bleiben Aufwand und redaktionelle Varianten kontrollierbar.

## P. Accessibility und Steuerung

Für Phase 1 werden Tap-to-Move und eine einfache direkte Touchsteuerung ausdrücklich verglichen. Keine Variante ist bislang als Produktstandard festgelegt. Laptop: Klick und WASD/Pfeile; sichtbare Interaktion per Enter/E. Joystick benötigt Dauerberührung und verdeckt Welt, Richtungstasten beanspruchen Platz; beide zunächst nur als späterer Vergleich bei beobachteten Problemen. A/B-Test im Slice mit wenigen Jugendlichen: Ziel finden, zum Regal laufen, Jonas ansprechen, Questlog öffnen. Fehler, benötigte Hinweise und subjektive Verständlichkeit erfassen, ohne verdeckte Telemetrie.

HTML-Oberfläche mit sichtbarem Fokus, sinnvollen Überschriften, Buttons und Formularlabels. Bedienung ohne Hover, ohne verpflichtendes Drag-and-drop und ohne Zeitdruck. Text üblicherweise 18–20 CSS-Pixel, skalierbar; UI-Touchziele mindestens 44×44 CSS-Pixel als Projektziel. [WCAG 2.2 beschreibt ein niedrigeres AA-Minimum von 24×24 mit Ausnahmen](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum); unser Ziel ersetzt keine vollständige Accessibility-Prüfung.

Canvasobjekte sind nicht automatisch für Screenreader zugänglich. Zusätzlich eine HTML-Liste „Orte und Dinge im Raum“ anbieten, die dieselben Interaktionen auslöst; Quest kann darüber vollständig abgeschlossen werden. Fokussteuerung, Textvergrößerung, Kontraste und Screenreader praktisch testen. Farbe immer mit Symbol/Text kombinieren. Bewegung reduzieren, keine Kameraschocks oder Blitze; Audio optional, gesprochene Informationen auch als Text. Lange Wege im realen Gebäude und Messaufgaben benötigen gleichwertige zugängliche Varianten, gegebenenfalls Teamspiel oder vorbereitete Messkarten. Kein Anspruch vollständiger Barrierefreiheit allein durch Enginewahl.

## Q. GitHub-Struktur und Zusammenarbeit

Das vom Auftraggeber benannte Repository [IndieStu/WERKgame](https://github.com/IndieStu/WERKgame) ist die gemeinsame Projektbasis. SSH-Remote: `git@github.com:IndieStu/WERKgame.git`. Die Phase-0-Dateien bilden den ersten Dokumentationsstand; es werden noch keine Spiel- oder CI-Abhängigkeiten eingeführt.

Vorgeschlagenes Ziel, nicht bereits implementierte Verzeichnisse:

```text
README.md
LICENSE                         # erst nach Rechte-/Lizenzentscheidung
THIRD_PARTY_NOTICES.md
package.json + package-lock.json
.github/workflows/check.yml
.github/ISSUE_TEMPLATE/{bug,quest}.yml
docs/{phase-0,roadmap}.md
docs/templates/raumaufnahme.md
game/source/{main,world,ui,domain,storage}/
assets/source/                  # editierbare Pixelquellen
assets/runtime/                 # kleine PNG-/Atlasdateien
content/{quests,dialogues,rooms,stations}/
content/schemas/
tools/                          # Validierung/Export nur bei Bedarf
tests/                          # Questzustände, Migration, Browserkernabläufe
dist/                           # generiert, nicht committen
```

Kleines Team: `main` soll baubar bleiben, kurze Featurebranches und Pull Requests, keine zusätzliche develop-/release-Branchhierarchie. Kleine verständliche Commits; kein zwingendes Conventional-Commits-Regelwerk. Milestones: Techniknachweis, Slice, Vor-Ort-Pilot, erste Veröffentlichung. Releases z. B. `v0.1.0-prototype`, `v0.2.0-slice`, `v0.3.0-pilot`. Issues für Fehler mit Gerät/Browser/Schritten; Questtemplate mit Zweck, realer Station, Sicherheit und Done-Kriterien.

CI nach Freigabe: festgelegte Node-Version, `npm ci`, Typecheck, Contentvalidierung, Zustands-/Migrationstests, Webbuild und ein kurzer Browserdurchlauf. Artefakt archivieren. Externe Actions auf Commit-SHA fixieren. Geräteprüfungen ergänzen automatisierte Desktoptests. Keine CI-Scheinläufe ohne vorhandenes Spiel anlegen.

Empfohlene Lizenztrennung: MIT für eigenen Code, möglicherweise CC BY 4.0 für freigegebene Lerntexte und eigene generische Grafiken. Logos, Personenportraits, Referenzen und Fremdassets separat mit Herkunft/Nutzungsrecht dokumentieren; nicht automatisch unter eine pauschale Repositorylizenz stellen. Bis zur Entscheidung keine Lizenz durch Platzhalter vortäuschen. Git LFS erst bei tatsächlich großen Quelldateien; Originalfotos nicht ungeprüft ins öffentliche Repository.

## R. Deployment, Offlinebetrieb und Updates

GitHub → CI → geprüftes statisches Artefakt → versioniertes Releaseverzeichnis auf VPS → atomarer Wechsel des Webroots. Caddy oder nginx genügt, HTTPS vorausgesetzt. Kein Docker für das Spiel erforderlich. Bei vorhandenem Containerbetrieb darf der Webserver darin laufen; kein neuer Dienst allein dafür.

Gehashten Assets lange unveränderliche Cachezeiten geben; HTML, Manifest und Service Worker auf Aktualität prüfen. Keine Abhängigkeit von einem CDN. CSP schrittweise auf eigenes Hosting begrenzen und testen; Berechtigungen für Kamera nur bei deren Nutzung. Rollback auf vorheriges Release vorsehen; Saveversionen und alte Releasekompatibilität berücksichtigen. Keine produktiven Deploy-Schlüssel in PR-Workflows; erste Veröffentlichung manuell freigeben.

Service Worker precacht Shell und komplette Slice-Inhalte; „Offline bereit“ erst nach erfolgreichem vollständigem Download anzeigen. Später einzelne Raumpakete vor Betreten herunterladen, fehlende Pakete klar kennzeichnen. [Service Worker und Cache-Strategien](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) ermöglichen diese Offlinebasis über HTTPS; eine PWA-Installation ist keine Voraussetzung dafür.

Updates nur an sicherem Checkpoint anbieten, nicht mitten in einer Messaufgabe erzwingen. Ein Release verwendet konsistente Asset-/Contentversionen; alte Caches erst nach erfolgreichem Wechsel entfernen. Fehler beim Download belassen die letzte funktionierende Version. Ein VPS-Rollback allein entfernt einen bereits aktiven Service Worker nicht: zusätzlich die Update-/Cache-Strategie und Saveverträglichkeit testen. Kein automatisches `skipWaiting` ohne Zustandskonzept.

Betriebsprobe: im WLAN vollständig laden, Offlinebereitschaft prüfen, WLAN ausschalten, Browser schließen und neu öffnen, Aufgabe abschließen und Reload durchführen. Danach Onlineupdate und Rückkehr prüfen. Cachelöschung und Storage-Verweigerung müssen eine verständliche Start-/Speichermeldung ergeben.

## S. Risiken und Gegenmaßnahmen

| Risiko | Bedeutung | Gegenmaßnahme / Nachweis |
|---|---|---|
| Reale Station gesperrt/umgebaut | Quest blockiert | Ersatzpfad, täglicher Stationscheck, lokale Verfügbarkeitskonfiguration |
| Maschinenzugang missverständlich | Unzulässige reale Handlung | Freigegebene Stationskarten, eindeutige sichere Route, Standortreview |
| Assetaufwand unterschätzt | Kalender dominiert durch Grafik | Placeholder zuerst, vier Richtungen, ein Raum, begrenzter Creator |
| Iso-Überdeckung | Figur/Objekt unlesbar | Regal-/Tür-Test, Vorderteile trennen, transparente Wände |
| Browser-/iPad-Probleme | Zielgruppe kann nicht starten | Früher Test auf schwächstem echten Gerät, Enginefrage nur bei belegtem Blocker erneut öffnen |
| QR öffnet anderes Profil | Fortschritt scheinbar weg | Manuelle Codes in laufender Anwendung, Mehrtabtest |
| Offlinepaket unvollständig | Ausfall im Gebäude | Vollständige Downloadbestätigung und Flugmodustest |
| Save verloren/geteiltes Gerät | Frust/Privatsphäre | Kurze Quests, Fortsetzen/Reset, Speicherfehler sichtbar |
| Textlast/Altersannahmen | Ausschluss oder Langeweile | Hilfen/Tiefe freiwillig, kurze Karten, Nutzertest |
| Fachlich vereinfachte Materialwahl | Falsches Berufsbild | Zweck und Randbedingungen nennen, Fachreview, mehrere Lösungen |
| Versionsmix/Service Worker | Defekte Updates | Atomare Pakete, Updatecheckpoint, Migration-/Rollbacktest |
| Personen-/Bildrechte ungeklärt | Veröffentlichung verzögert | Herkunft/Einwilligung früh dokumentieren, Ersatzfigur bereithalten |

Das Regalbeispiel muss präzisiert werden: „Welche Maschine macht gleiche Bretter?“ ist ohne Material, Ausgangsformat und Genauigkeitsziel mehrdeutig. Eine CNC ist nicht automatisch die richtige Wahl. Im Slice geht es um begründetes Verfahren bei vorbereiteten Bedingungen, nicht um reale Maschinenanleitung oder tragfähige Bauplanung.

## T. Offene Entscheidungen und vorgeschlagene Defaults

| Entscheidung | Default | Vor welchem Schritt nötig? |
|---|---|---|
| Engine | Phaser ist bestätigt; Versionspin und TS/Vite-Setup in Phase 1 | Engineentscheidung abgeschlossen |
| NFC | Nur mögliche spätere Ergänzung; QR/Kurzcode als Basis | Gesonderte spätere Entscheidung |
| Zielgeräte | Tatsächlich vorhandenes schwächstes Tablet plus Laptop | Technikabnahme |
| Orientierung | Tablet quer, responsive UI; Hochformat mit angepasster Ansicht | Slice-Layout |
| Nutzung | Einzelperson oder Zweierteam an einem Gerät | Vor-Ort-Questdesign |
| Pilotumfang | Eine reale Werkstatt, 2–3 kurze Quests, 20–30 Minuten | Contentproduktion |
| Reale Route | Freigegebene vorbereitete Stationen | Raumaufnahme/Pilot |
| Save auf Leihgeräten | Eine Runde pro Gerät, bewusster Reset | Pilotbetrieb |
| Jonas-Darstellung | Referenzmerkmale, Zustimmung vor Veröffentlichung | Finale Grafik |
| Lizenzen/Betreiber | Getrennte Code-/Contentrechte | Veröffentlichung |
| Fotos | Außerhalb des ersten Slice | Spätere Medienquest |
| Interessen | Freiwillige Tätigkeitsreflexion, keine Scores | Nach Kernpilot |

Die Enginefreigabe für Phaser liegt vor. Vor Umsetzung von Phase 1 fehlen die Geräte-/Browserinformationen für die spätere Technikabnahme. Für Phase 3 brauchen wir die ausgewählte Werkstatt, sichere Besucherroute, Ansprechpartner:in, Stationsverfügbarkeit, Grundrissskizze und Fotos nach Vorlage. Noch keine komplette Fotodokumentation aller Räume erstellen.

## U. Roadmap und Abschluss

Die vollständige [Roadmap](roadmap.md) enthält Ziele, Liefergegenstände, Technik, Content, Assets, Abhängigkeiten, Risiken und Done-Kriterien pro Phase. Aufwand ist eine Planungsspanne, keine Zusage. Größter Unsicherheitsfaktor ist Grafik-/Contentproduktion mit Vor-Ort-Abstimmung.

**Nächster vorgeschlagener Schritt:** Phase 1 als begrenzter Techniknachweis. Erst nach dessen Abnahme den Vertical Slice, danach reale Räume produzieren. Phase 0 endet hier; keine Entwicklung weiterer Phasen ohne Freigabe.
