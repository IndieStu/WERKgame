# Entwicklungsplan und erster Vertical Slice

Stand 21.10.2026. Phase 0 und die technische Phase 1 sind abgenommen. Creative Direction und Regalquest-Storyboard sind inhaltlich freigegeben. **Phase 2B – UX Gameplay Prototype ist implementiert und technisch geprüft**, mit Placeholdern und noch offenem menschlichen Review; **Phase 3 bleibt gesperrt**. Phaser + TypeScript + Vite bleiben gesetzt. Alle visuellen Produktionsmaße sind vorläufig. Ein Personentag entspricht etwa sechs konzentrierten Arbeitsstunden; Spannen sind Planungsannahmen, keine gemessenen Ist-Aufwände.

Die langfristige Leitidee [Das WERK-Fest](design/werk-fest.md) ist aufgenommen: frei gewählte Interessen, mehrere Quests pro Raum, unabhängige sichtbare Weltbeiträge und spätere Content-Erweiterungen. Die dortige Architekturprüfung benennt aktuelle Grenzen und den erforderlichen Ausbau vor einer zweiten aktiven Quest. Sie gibt keine weiteren Quests oder Produktionsassets frei.

## Phase 0 – Analyse und Entscheidungen

- **Ziel:** tragfähiger, begrenzter Projektplan.
- **Deliverables:** Analyse, Quellen/Versionsstände, Architektur, Questbeispiel, Raumvorlage, Roadmap.
- **Technik:** Frameworkvergleich, Web-/Offline-/Savekonzept.
- **Content:** Lernprinzip, Festivalrahmen, sichere Aufgabentypen und Unterstützung.
- **Assets:** Jonas-Referenz auswerten; keine Produktionsgrafik.
- **Abhängigkeiten:** Projektauftrag; keine Gebäudeaufnahme nötig.
- **Risiken:** zu frühe Festlegung ohne Geräteprüfung.
- **Done:** Ergebnisse dokumentiert, Annahmen erkennbar, Freigabepunkt vor Entwicklung. Dies ist der aktuelle Stand.

## Phase 1 – Technischer Prototyp · 4–7 PT

Status: vom Auftraggeber abgenommen. Technische Nachweise: [Phase-1-Bericht](phase-1/bericht.md). Reale iPad-Abnahme bleibt offen, da aktuell nur MacBook Pro und iPhone 15 verfügbar sind.

- **Ziel:** die risikoreichsten technischen Annahmen auf echten Geräten prüfen.
- **Deliverables:** ein kleiner grauer Iso-Raum, klick-/touchfähige Bewegung, Testprotokoll und reproduzierbarer statischer Build.
- **Technik:** Phaser/TS/Vite exakt fixieren; 64×32-Tiles, Kamera, Grid/A*, Fußanker, Tiefensortierung, HTML-Dialog/Formular, ausdrücklich vergleichbare Varianten Tap-to-Move und direkte Richtungstasten, IndexedDB-Minimalsave und erster Service Worker. CI für Build und kleine relevante Logiktests.
- **Content:** ein Testdialog und ein Eingabeschritt, keine fertige Quest.
- **Assets:** Bodenraute, zwei Wandteile, Türmarker, drei Objektblöcke, eine einfache bewegte Figur; keine finalen Portraits.
- **Abhängigkeiten:** Phaser-/TypeScript-/Vite-Entscheidung und Phase-1-Freigabe liegen vor; mindestens ein reales Zieltablet und ein Laptop, HTTPS-Testadresse oder geeignete lokale sichere Testumgebung.
- **Risiken:** Pointerkoordinaten, Safari, WebGL-Verlust, Speicherverweigerung, UI über Canvas.
- **Done:** Bewegung und Interaktion auf Zieltablet/Laptop; Regalüberdeckung korrekt; Formular mit Bildschirmtastatur nutzbar; Save über Reload; vollständiger Download und Offline-Wiederstart; Framerate/Transfer/Startzeit protokolliert. Bleiben Blocker, Blocker dokumentieren und das weitere Vorgehen gemeinsam festlegen.

## Phase 2 – Vertical Slice · 8–14 PT

Status und technische Nachweise: [Phase-2-Bericht](phase-2/bericht.md). Technische Questvorarbeit bleibt erhalten, Player Experience und Inhalt sind nicht abgenommen. Die permanente Debug-UI und Placeholder sind keine Produktvorlage.

- **Ziel:** eine Adventure-Sequenz mit freiwilliger Erkundung, NPC-Gespräch, virtueller/realer Handlung, selbst gefundenen Informationen, kurzem Planungsproblem und sichtbarem Ergebnis. Technisch ausführbare Dialogfolgen allein erfüllen dieses Ziel nicht. 5–10 Minuten bleiben ein zu prüfendes Dauerziel.
- **Deliverables:** ein Raum, zwei Figuren, Regalquest, Questlog, Hinweise, Antwortfeedback, Abschluss und Reset.
- **Technik:** generische Questzustände, JSON Schema, Contentprüfung, Dialog-/Hint-UI, versionierte Saves, HTML-Objektliste, Eingabevalidierung; Zustands- und Browserkernabläufe testen.
- **Content:** kurze charaktervolle RPG-Dialoge, Objektinformationen in drei Ebenen, sichere reale Aufgabe mit räumlichem Prototyp-Stellvertreter, freiwillige natürliche Berufsbezüge. Fachreview separat; kein Pflicht-Abschlussbogen.
- **Assets:** Placeholderliste unten; zwei Avatarpresets statt Creator.
- **Abhängigkeiten:** abgenommene Phase 1.
- **Risiken:** aus einer Miniquest einen Werkstattsimulator machen; überlange Texte; vermeintlich eindeutige Maschinenantwort.
- **Done:** technische Checks separat bestanden; zusätzlich Spielbarkeit und unterhaltsame Experience mit Personen beobachten und pädagogischen Inhalt fachlich prüfen. Finden sie aus eigener Neugier Informationen, verstehen sie Handlungen und Folgen und möchten sie einen weiteren Raum erkunden? Ein Completed-State genügt nicht. Die formative Probe ist kein Wirksamkeitsnachweis.

## Zwischenschritt: Creative Direction und Player Experience revidieren · inhaltlich freigegeben

- **Ziel:** die technische Questvorarbeit als Adventure statt Web-/E-Learning-UI weiterdenken, bevor Phase 3 beginnt.
- **Deliverables:** [Creative-Direction-/Player-Experience-Revision](design/creative-direction.md), [konkretes Regalquest-Storyboard](design/regalquest-storyboard.md), korrigierte Einordnung der bisherigen Nachweise.
- **Technik:** keine Implementierung. Phaser, TypeScript, Vite, Questlogik, alternative Lösungen, Retries, IndexedDB, Migration, Offline, Accessibility, Tests und Weltzustände bleiben erhalten.
- **Content:** Einstieg, kurze RPG-Gespräche, Erkundung, Informationsschichten, reale Aufgabe, räumliche Planung und freiwillige Berufseinblicke spezifizieren.
- **Assets:** keine neuen Produktionsassets; Pixel-Art-Zielrichtung nur beschreiben.
- **Abhängigkeiten:** Testfeedback zum vorhandenen Build.
- **Risiko:** technische Ausführbarkeit erneut mit Gameplay oder Experience verwechseln. Vier Nachweise strikt trennen.
- **Done:** Dokumente zur Durchsicht bereitstellen und stoppen. Ein Umbau folgt erst nach Review/Freigabe; Phase 3 bleibt gesperrt.

## Phase 2B – UX Gameplay Prototype · 6–9 PT

[Konkreter Umfang, Aufwand und Abnahme](phase-2b/plan.md) · [Reviewbericht](phase-2b/bericht.md) · [Nutzungstest](phase-2b/nutzungstest.md). Die freigegebene Experience wird in einem erfundenen Placeholder-Raum spielbar: Weltansicht, räumliche Gespräche/Erkundung/Messung, Material- und Verfahrenswahl, echtes Regalplanungs-Minispiel, sichtbare eingeräumte Kisten. Technische Prüfung und menschlicher Nutzungstest bleiben getrennte Nachweise. Danach stoppen und Review abwarten. Keine Fest-Gesamtwelt, weiteren Werkstätten oder Produktionsassets in diesem Schritt.

## Phase 3 – Eine reale Werkstatt · 6–10 PT

- **Ziel:** reale Entdeckung und virtuelle Entscheidung vor Ort verbinden.
- **Deliverables:** dokumentierter Raum, kompakter wiedererkennbarer Blockout, eine echte sichere Regal-/Materialquest und Stationskarten.
- **Technik:** Raumpaket, Tür/Spawn, Stationsresolver, manuelle Codes, Deep Links; reale statt simulierter Messaufgabe.
- **Content:** tatsächliche Proben, Toleranzen und Verfahrensinfos festlegen; Sperrungs-/Alternativpfad; Besucherroute und Hilfeort.
- **Assets:** Fotos/Skizze laut Vorlage, drei bis fünf Landmarken, wenige charakteristische Maschinen-/Möbelsprites. Fotooriginale bleiben Arbeitsmaterial.
- **Abhängigkeiten:** Perspektive und Maßstab aus Phase 2 bestätigt; Standortzugang und Raumaufnahme.
- **Risiken:** Umbau, fehlende sichere Station, falsche Maßannahmen.
- **Done:** Standort bestätigt sichere Route; Jugendliche finden vorbereitete Stationen; Quest funktioniert bei abgeschaltetem WLAN und bei gesperrter Station über Alternative.

## Phase 4 – Content-System stabilisieren · bisherige Schätzung 4–7 PT, neu zu schätzen

- **Ziel:** neue Quests überwiegend redaktionell hinzufügen. Vor einer zweiten aktiven Quest die im [WERK-Fest-Architekturreview](design/werk-fest.md) benannten Einzelquest-/Save-/Weltkopplungen lösen; neue Schätzung nach 2B und konkreter Contentwahl.
- **Deliverables:** zwei weitere datenbasierte Quests, Autor:innenanleitung und Migrationsbeispiel.
- **Technik:** Referenz-/Erreichbarkeitsprüfung, wiederholbare Übergänge, Savevorgänger-Test; nur nachgewiesene neue Schritttypen ergänzen.
- **Content:** Werkzeugdetektiv und eine zweite Abwägungsaufgabe; Hilfen/Tiefe für alle drei Quests.
- **Assets:** wenige Werkzeug-/Materialicons, vorhandene Figuren wiederverwenden.
- **Abhängigkeiten:** reale Quest aus Phase 3.
- **Risiken:** zu allgemeine Questskriptsprache, Verzweigungsexplosion.
- **Done:** eine weitere Quest lässt sich mit vorhandenen Schrittarten ohne neue Spiellogik hinzufügen; ungültige Referenzen scheitern in CI mit verständlicher Meldung; alte Saves bleiben lesbar oder erhalten erklärten Checkpoint.

## Phase 5 – Kleiner Character Creator · 5–9 PT

- **Ziel:** in 30–90 Sekunden einen passenden Avatar wählen.
- **Deliverables:** kleine frei kombinierbare Auswahl, Vorschau und lokale Speicherung.
- **Technik:** synchrone Sprite-Layer, Palettenexport, Presets, Atlas-/Frameprüfung.
- **Content:** neutrale Beschriftungen, optionaler Nickname unabhängig vom Aussehen; Vielfalt mit Testpersonen beurteilen.
- **Assets:** ein Basisrig mit vier Richtungen, wenige Frisuren/Kleidungsformen/Paletten und Brille.
- **Abhängigkeiten:** Figurenmaßstab und Walkzyklus stabil; keine neue Körperbasis mitten in der Produktion.
- **Risiken:** Layerdurchbrüche und vervielfachte Animationsarbeit.
- **Done:** Auswahl ohne Geschlechtsvorgabe; jede freigegebene Kombination ohne sichtbare Layerfehler; Creator auf Tablet innerhalb der Zielzeit nutzbar; Preset bleibt als schneller Einstieg.

## Phase 6 – Vor-Ort-Pilot und optionale Reflexion · 5–8 PT

- **Ziel:** Nutzbarkeit und sicheren Betriebsablauf prüfen.
- **Deliverables:** Pilot mit etwa 6–10 Jugendlichen verschiedener Vorerfahrung, priorisierte Befunde und überarbeitete Quests. Freiwillige Abschlussreflexion zu Tätigkeiten.
- **Technik:** Fehlerbehebung, Hilfe-/Alternativewege, verständlicher Reset, Offline-Vorbereitung. Keine Analytikplattform.
- **Content:** drei Quests für 20–30 Minuten; kurze Reflexion „Was möchtest du weiter ausprobieren?“ mit passenden Berufsfeldern, keine Berufsempfehlungsdiagnose.
- **Assets:** lesbare Stationskarten, UI-Verbesserungen, wenige fehlende Landmarken.
- **Abhängigkeiten:** freigegebene Route, organisatorische Zustimmung zum Test, Ansprechpartner:in; Creator darf bei Verzögerung durch Presets ersetzt werden.
- **Risiken:** kleine Stichprobe, Gruppeneffekte, Raum-/Geräteausfälle.
- **Done:** Kernabläufe beobachtet, Barrieren und Hilfeereignisse dokumentiert, keine ungelösten sicherheitskritischen Aufgaben; keine behauptete pädagogische Wirksamkeit aus wenigen Tests.

## Phase 7 – UX, Accessibility und Release · 4–7 PT

- **Ziel:** belastbarer erster lokaler Release.
- **Deliverables:** geprüfter statischer VPS-Release, Betriebsanleitung, Datenschutzhinweise, Quellen-/Rechtenachweise und Rollbackpaket.
- **Technik:** Zielgeräte-Regressionsprüfung, Tastatur/Screenreader/Textzoom, Performancebudget, Offlineupdate und Savemigration; Caddy/nginx-Deployment mit sicherem CI-Artefakt.
- **Content:** Fach-/Sprachreview, Hilfe- und Kontaktinformationen, Betreibertexte.
- **Assets:** nur Korrekturen und nötige Credits; keine neue Raumserie.
- **Abhängigkeiten:** Pilotbefunde bearbeitet, Betreiber-/Lizenzentscheidung, VPS-Zugang erst für Deployment nötig.
- **Risiken:** Service-Worker-Altstände, unvollständige Rechte, Veröffentlichung vor Geräteabnahme.
- **Done:** keine Blocker in Kernroute, Offline/Reset/Update/Rollback getestet, Release getaggt, Betriebsperson kann neue Runde und Rückfall eigenständig durchführen.

## Phase 8 – Erweiterungen nach Pilot · je Raum grob 5–12 PT

- **Ziel:** nur belegten Bedarf ausbauen.
- **Deliverables:** Raumweise Erweiterungen, gegebenenfalls Festivalfinale, später Foto-/KI-Ethikquests.
- **Technik:** vorhandene Systeme wiederverwenden; neuen Schritttyp erst für konkrete Aufgabe; vollständige Raum-Offlinepakete.
- **Content:** zwei bis drei sorgfältige Quests pro neuem Bereich, fachlich geprüfte Abwägungen und Berufsbezüge.
- **Assets:** neue Raumaufnahme und Landmarken; Figuren/Standards wiederverwenden.
- **Abhängigkeiten:** Pilot positiv beurteilt, jede neue Station freigegeben.
- **Risiken:** lineare Contentkosten, Medienrechte, Fotoaufwand. 5–12 PT gelten nur bei hohem Wiederverwendungsgrad; komplexe Werkstätten können deutlich mehr benötigen.
- **Done:** jeder Raum hat dokumentierte sichere Route, alternativen Abschluss, fachliche Prüfung und Geräte-/Offlinetest. Fotoquests und KI-Themen erhalten eigene begrenzte Planung; keine Live-KI als stillschweigende Erweiterung.

## NFC-Ergänzung

Die [NFC-Prüfung](nfc-pruefung.md) ergänzt die Planung: Sammlung mehrerer passender Gegenstände ist medienunabhängig möglich. iPad/Safari bleibt mit QR/Kurzcode die Basis. NFC ist zurückgestellt: kein NFC-Gerätetest, keine Beschaffung und keine NFC-Implementierung im ersten Prototyp. Die Zusatzaufwände im Rechercheanhang dienen ausschließlich einer möglichen späteren Entscheidung und sind nicht in den folgenden Summen enthalten. Phase 1 protokolliert konkrete iPadmodelle; Phase 3 kann später eine begrenzte Fundquest erproben.

## Aufwand und Reihenfolge

Bis zum Placeholder-Slice: etwa **12–21 PT** nach Phase 0. Bis zum Pilot einschließlich Creator: **32–55 PT**; bis zu einem kleinen ersten Release: **36–62 PT**. Bei fünf produktiven PT pro Woche etwa 7–13 Arbeitswochen, bei zwei PT pro Woche etwa 18–31 Wochen, jeweils plus externe Wartezeiten. Eine zusätzliche Planungsreserve von 20–30 % ist bei noch unbekannten Geräten und eigener Assetproduktion sinnvoll. Kein fester Liefertermin vor Phase 1.

Die Schätzung umfasst Technik, begrenzte Content-/Grafikarbeit und Tests einer Werkstatt. Sie umfasst weder sämtliche WERK-Bereiche noch aufwendige Individualanimationen oder wissenschaftliche Evaluation. Nach Phase 1 und Phase 3 anhand tatsächlicher Zeiten neu schätzen. Ist Zeit knapp, Creator und Reflexion verschieben; sichere Aufgaben, Hilfe, Offlinebasis und Geräteprüfung bleiben.

## Vertical Slice: verbindlicher Scopevorschlag

Ein erfundener etwa 8×8 bis 10×10 Zellen großer Raum, zwei hintere Wände, eine Tür, Werkbank, Regal und eine dekorative Maschine. Drei bis fünf anklickbare Dinge: Materialprobe, Maßband, Maschine, Kaffeetasse und Kiste. Tür kann für den Slice zum gleichen Start-/Informationspunkt führen, ohne zweiten Raum.

Ablauf:

1. Start mit Avatarpreset und Hilfewahl; Bewegung in einem Satz erklären.
2. Jonas schildert das Regalproblem und kennzeichnet die Messaufgabe im Slice klar als Simulation.
3. Eine beschriftete fiktive Kiste liefert ein Testmaß; Eingabe in cm mit toleranter Komma-/Punktverarbeitung. Bei ungeeigneten Werten Kontext und erneuter Versuch.
4. Drei vorbereitete Materialinfos mit Preis-/Oberflächen-/Tragfähigkeitsannahmen vergleichen. Mindestens eine begründete Alternative kann zulässig sein; keine realen Belastungszusagen.
5. Passendes Fertigungsverfahren unter gegebenen Bedingungen auswählen. Maschineninfos sind rein virtuell und keine Bedienanleitung.
6. Kurze virtuelle Fertigstellung: Regalzustand wechselt, Jonas gibt fachliches Feedback.
7. Erlebte Tätigkeiten benennen und beispielhafte Berufsfelder zeigen; lokal speichern, fortsetzen oder neue Runde.

### Nur hierfür benötigte Assets

| Asset | Menge / Umfang |
|---|---|
| Boden | Ein Tile plus optional zwei Varianten, 64×32 px |
| Wände/Tür | Zwei Richtungen und ein Türmodul |
| Möbel | Werkbank, Regal leer/gefüllt, Maschinenplaceholder |
| Kleine Objekte | Kiste, drei Materialproben, Maßband, Kaffeetasse |
| Figuren | Jonas-Placeholder und ein gemeinsamer Avatarrig mit zwei Presets |
| Animation | Vier Richtungen × vier Walkframes plus ein Idle pro Richtung |
| UI | Interaktionssymbol, Hinweis, Queststatus; lesbare System-/lokale Schrift |
| Portrait | Optional Jonas-Placeholder; kein finales Portrait erforderlich |
| Effekt | Ein kurzer Bau-/Zustandswechsel, ohne verpflichtenden Ton |

Keine kompletten Workshoptilesets, keine Sitz-/Trageanimationen, keine große Garderobe, keine Fotos, keine Filmclips und kein echter Maschinenbetrieb.

### Technische Abnahmecheckliste – kein Gameplay-/Experience-Nachweis

- [ ] Zielgeräte und Versionen protokolliert; keine bloße Desktopemulation.
- [ ] Tap/Klick erreichen freie Ziele; blockierte Ziele erzeugen verständliches Verhalten.
- [ ] Figur läuft korrekt vor/hinter Möbeln; keine Wege durch Maschinen.
- [ ] Objektinteraktion, Dialog und Formular auch mit Tastatur bedienbar.
- [ ] Text bleibt bei vergrößerter Schrift und eingeblendeter Bildschirmtastatur erreichbar.
- [ ] Raumobjekte zusätzlich als HTML-Liste erreichbar; Quest darüber abschließbar.
- [ ] Hilfen in drei Stufen, erneute Versuche ohne Strafe, keine Sackgasse.
- [ ] Eingaben wie `40`, `40,0` und `40.0` sinnvoll behandelt; leere/negative/extreme Werte abgefangen.
- [ ] Alternative Materialentscheidungen erhalten inhaltliches Feedback.
- [ ] Reload in jedem Schritt, mehrfaches Tippen und Wiederaufnahme verändern Fortschritt nicht unzulässig.
- [ ] Savefehler werden sichtbar, Reset löscht die vorherige Runde.
- [ ] Nach vollständigem Download offline neu starten und Quest abschließen.
- [ ] Update unterbricht keine aktive Entscheidung; kein Mix alter/neuer Inhalte.
- [ ] Daten-/Zustandschecks und Build erfolgreich; Transfer-/Start-/Frameratebudget gemessen.
- [ ] Nutzungsprobe dokumentiert; reale Aufgabe ausdrücklich noch nicht als vor Ort validiert dargestellt.

## Vorgemerktes Fortschrittsprinzip für spätere Phasen

Abgeschlossene Werkstattquests sollen die gemeinsame WERK-/Festivalwelt sichtbar verändern, etwa durch ein fertiges Regal, ausgestellte Produkte oder vorbereitete Festivalbereiche. Diese Veränderungen ersetzen ein klassisches XP-/Levelsystem. In Phase 1 wird das nicht implementiert; der technische Teststand bleibt davon unabhängig.
