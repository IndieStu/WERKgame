# Creative Direction und Player Experience – Revision zu Phase 2

21.10.2026 · **Entscheidungsvorlage, noch nicht freigegeben.** Dieser Zwischenschritt folgt auf den technischen Phase-2-Build und liegt vor Phase 3. Er ersetzt keine historische Abnahme von Phase 1. Phase 2 ist inhaltlich und UX-seitig nicht abgenommen. Bis zum Review werden weder Produktionscode noch finale Assets ergänzt.

## Leitentscheidung und Aussagegrenzen

**The game is the interface. Die Welt ist der Fortschrittsbalken.**

Das Ziel ist ein charmantes, modernes isometrisches Pixel-Art-Adventure/RPG für etwa 13–18-Jährige. Die Person kommt wegen eines Ortes, seiner Menschen und kleiner Probleme ins Spiel. Berufsorientierung entsteht durch Tätigkeiten und Entscheidungen in dieser Welt und im echten WERK.

Der aktuelle Build ist eine nützliche technische Questvorarbeit mit Developer UI. Die Bezeichnung „durchspielbar“ war zu weitgehend. Vier Ebenen sind künftig getrennt zu beurteilen:

| Ebene | Erforderlicher Nachweis |
|---|---|
| Technisch vollständig ausführbare Quest-State-Machine | Zustandsübergänge, alternative Lösungen, Retry, Save, Migration und Offline verhalten sich wie geprüft. Darauf beziehen sich Browser-/Integrationstests. |
| Spielbare Quest | Erkundung, Beobachtung, Entscheidung und eine eigene Handlung ergeben einen verständlichen Ablauf mit sichtbaren Folgen. Eine vollständige Buttonfolge genügt nicht. |
| Pädagogisch sinnvolle Quest | Aufgabe, Eigenschaften und Konsequenzen sind fachlich stimmig; Verständnis wird durch die Handlung unterstützt. Eigenes Fachreview und Beobachtung. |
| Unterhaltsame Player Experience | Neugier, Figuren, Rhythmus und freiwillige Erkundung tragen. Personen wollen ohne Kenntnis der Bildungsziele weitermachen. Das muss getestet werden. |

Für die letzten drei Ebenen liegt noch keine positive Abnahme vor. Die bisherigen Tests werden dadurch nicht wertlos, aber ihre Aussage wird begrenzt.

## 1. Einstieg bis zum ersten Auftrag

Zielbild des Produkts: kurzes WERK-Logo → **Neues Spiel / Fortsetzen** → einfacher Avatar → Einstieg direkt in die Welt. Kein Dashboard vor dem Raum, keine Technik-Erklärung als Startseite. Das Logo hält niemanden künstlich auf.

„Fortsetzen“ zeigt die gespeicherte Welt und ihren zuletzt sinnvollen Standort; ein kurzer situativer Hinweis reicht. „Neues Spiel“ erklärt vor dem Löschen einer bestehenden Runde die Konsequenz. Accessibility und Sprache sind bereits vom Startmenü erreichbar, bevor Text gelesen oder eine Figur bedient werden muss.

Der langfristige Character Creator bleibt im Zielbild. Eine spätere Überarbeitung des kleinen Slice kann weiter zwei Presets als Stellvertreter verwenden. Diese UX-Revision zieht keine neue Creator- oder Assetproduktion vor.

Im ersten Raum stehen Kisten im Weg. Jonas ist daneben beschäftigt. Ein kurzer Blickfang und ein beiläufiger Satz schaffen Anlass, ihn anzusprechen. Die Person darf zunächst etwas anderes ansehen; weder Questfenster noch Gespräch öffnen ungefragt.

## 2. Primäre Spielansicht

Die isometrische Welt belegt die verfügbare Fläche. Ein kleines Menü und ein Notizbuchsymbol sind sekundär erreichbar. Touchsteuerung wird nur im gewählten direkten Modus eingeblendet; Tap-Ziele erhalten bei Bedarf eine dezente Orts-/Objektmarkierung. Maus und Tastatur bleiben gleichwertig.

Kein permanenter rechter Questbereich, Fortschrittsbalken oder Schrittzähler. Eine neue Aufgabe erscheint kurz als kleine Notiz. Die Person kann sie später im Notizbuch nachlesen. Keine Pflichtanzeige, welche Taste als Nächstes zu klicken ist.

Die Welt gibt Orientierung durch Standorte, Silhouetten, Reaktionen und wiedererkennbare Gegenstände. Objektname oder Interaktionshinweis erscheint bei Annäherung, Auswahl beziehungsweise Fokus, nicht als ständige Beschriftungswolke. Kamera, Textgröße und Maßstab bleiben bis zu realen Geräteprüfungen vorläufig. Beide Bewegungsvarianten bleiben für einen vergleichbaren Test verfügbar.

## 3. NPC-Gespräche

Ansprache erfolgt in der Welt. Eine kompakte Dialogbox am unteren Rand lässt Figur und Gesprächsort sichtbar. Sprechername, höchstens ein bis zwei kurze Sätze und wenige situative Antworten bilden einen Gesprächswechsel. Auf schmalen Displays darf sich die Box vergrößern, ohne zum langen Informationsblatt zu werden.

Jonas spricht aus einer konkreten Situation:

> „Fürs Fest haben wir schon wieder mehr Kisten als Plätze.“
>
> **Was brauchst du?**
>
> „Ein Regal. Aber schau erst mal, wie viel Platz an der Wand ist.“

Die Person kann das Gespräch verlassen und später wieder anknüpfen. Wiederaufnahme greift den Sachstand auf, statt das ganze Briefing zu wiederholen. Texte erscheinen sofort lesbar; kein erzwungenes Warten auf einen Schreibeffekt. Ein Dialogabschluss übernimmt eine Aufgabe nur bei bewusster Zusage.

## 4. Objekte und Informationsschichten

Ein Objekt wird durch Annähern und Interaktion untersucht; Touch nutzt Auswahl/Bestätigung ohne Hoverpflicht. Eine kurze Sprechblase oder kompakte Untersuchungskarte liefert die erste Reaktion. Drei Ebenen trennen unterschiedliche Interessen:

1. **Entdeckung:** kurz, spielerisch, neugierig machend. Jonas’ Tasse: „Noch warm.“
2. **Relevante Beobachtung:** konkrete Eigenschaft für die aktuelle Frage, zum Beispiel Oberfläche oder Kante einer Probe.
3. **Vertiefung:** freiwillig über „Mehr erfahren“, mit Bild, Begriffserklärung oder längerer Information.

Nicht jedes Objekt braucht Ebene 2 oder 3. Dekoration, Insider und nutzlose Dinge dürfen einfach Atmosphäre schaffen. Sie erklären weder Punkte noch Freischaltungen. Maschinenkurztexte richten sich nach der tatsächlich dargestellten Maschine; Kappsäge und Plattenzuschnitt dürfen bei der späteren Dokumentation nicht verwechselt werden.

## 5. Aufgaben und Notizbuch

Jonas bietet einen Auftrag im Gespräch an. Nach Annahme bleibt die Welt im Vordergrund. Das Notizbuch enthält knapp: Was braucht jemand? Was habe ich herausgefunden? Wo könnte ich anknüpfen? Keine technische Schrittfolge oder Prozentanzeige.

Konkrete Erkenntnisse können als Skizze, Materialnotiz oder gemerkte Eigenschaft auftauchen. Die Person entscheidet weiter selbst. Das Notizbuch ist ein Gedächtnis, kein dauernder Regieassistent. Ein zugänglicher Alternativzugang zu Orten und Dingen bleibt zusätzlich erreichbar.

## 6–7. Reale Aufgabe und Rückkehr

Der virtuelle vorgesehene Regalplatz und die reale vorbereitete Messstation müssen erkennbar zusammengehören. Jonas fragt nach dem verfügbaren Platz. Eine kurze Auftragskarte nennt den sicheren Ort, das vorbereitete Messhilfsmittel und die gesuchte Größe. Die Person legt das Gerät beim Gehen weg; keine neue Bildschirmpflicht während der realen Handlung.

Nach der Rückkehr wird die Aufgabe über Jonas oder die Notiz wieder aufgenommen. Die Eingabe erfolgt auf einer kleinen Maßskizze in der Welt, mit sichtbarer Einheit. Auffällige Werte führen zu einem konkreten Rückfragehinweis und einem neuen Versuch. Kein Timer, keine Abwertung.

Im nächsten Prototyp bleibt die reale Handlung simuliert: Die Person untersucht den virtuellen vorgesehenen Standort und führt die stellvertretende Messhandlung dort aus. Eine zentral aufgerufene Text-Messkarte allein ist nicht die beabsichtigte Experience. Die spätere echte Route, sichere Station und QR-/NFC-Anbindung brauchen eigene Freigaben und Vor-Ort-Prüfungen.

## 8. Kurzes räumliches Planungsproblem

Vorschlag für die Regalquest: zwei Regalböden in einem einfachen Regalrahmen so platzieren, dass die vorbereiteten Festkisten hineinpassen. Auswahl eines Bodens und Auswahl einer markierten Höhe reichen; optionales Ziehen darf eine zusätzliche Bedienart sein. Tastatur und Touch können dieselbe Handlung ohne Drag-and-drop ausführen.

Bei zu engem Abstand stößt eine Kistensilhouette sichtbar an. Die Person kann den Boden versetzen. Es gibt mehrere passende Anordnungen; kein dekoratives Quiz mit einer geheimen richtigen Reihenfolge. Das Planungsproblem soll ungefähr 30–60 Sekunden tragen, ohne Mindestwartezeit oder Zeitlimit.

Erst prüfen, ob diese Interaktion für sich verständlich und befriedigend ist. Kein komplexer Konstruktions-, Statik- oder Maschinenbedienungssimulator. Bedingungen und verwendete Kisten sind vorbereitet.

## 9. Sichtbare Veränderung

Vorher stehen Kisten am Boden, der vorgesehene Standort ist leer. Nach dem Planungsabschluss erscheint dort das gewählte Regal; dieselben Kisten stehen darin. Eine kurze Aufbau-/Umräumsequenz und Jonas’ Reaktion machen Ursache und Folge sichtbar. Reduzierte Animation zeigt denselben Endzustand direkt.

Material und mögliche Anordnung sollen innerhalb eines kleinen, beherrschbaren Variantenumfangs im Ergebnis wiedererkennbar sein. Der Effekt ist nicht nur ein Farbrechteck oder eine Erfolgsmeldung. Das genaue Aussehen wird erst nach Freigabe gestaltet.

Später füllt sich die gemeinsame Festivalwelt mit Bannern, Textilien, Teilen, einsatzbereiten Fahrrädern, Filmen und Recyclingobjekten. Gespeichert wird die Weltveränderung; eine zusätzliche XP-Währung ist nicht nötig.

## 10. Berufsbezüge im Gespräch

Nach dem Ergebnis darf Jonas eine passende Tür öffnen:

> „Erst planen, dann weniger Gefluche. Wenn dir das Spaß gemacht hat: In Tischlereien und in der Produktgestaltung wird ständig so abgewogen.“
>
> **Was machen die da eigentlich?** / **Zeig mir erst mal den nächsten Raum.**

Die Vertiefung ist freiwillig. Keine automatisch zugeschriebene Begabung aus einer Antwort, kein Pflicht-Evaluationsbogen und kein Diagnose-Disclaimer in der normalen Figurenrede. Fachliche und pädagogische Zielbeschreibungen bleiben in Projekt-/Begleitmaterialien.

## 11–12. Hilfe und zugängliche Einstellungen

Hilfe heißt beispielsweise „Jonas fragen“ oder „Eine Idee?“. Sie beginnt mit einer Suchstrategie, zeigt auf Wunsch einen Ort und erklärt erst zuletzt konkret weiter. Hilfe kostet nichts und erhält keinen „Easy Mode“-Stempel. Nach wiederholten Schwierigkeiten wird sie angeboten, nicht ungefragt aufgezwungen. Unterstützung kann jederzeit verändert werden.

Das kleine, benannte Menü ist dauerhaft erreichbar: per Touch, Tastatur und Screenreader. Dort liegen Textgröße, Kontrastoptionen, reduzierte Bewegung, Steuerung, Hilfepräferenz und eine optionale Orts-/Objektliste. Wichtige Zugänglichkeit ist außerdem schon am Start erreichbar. „Sekundär“ bedeutet nicht versteckt hinter einer präzisen Geste oder einem unbeschrifteten winzigen Icon. Dialoge, Planungsinteraktion und Notizbuch erhalten klare Fokusführung und große Touchziele.

## 13–14. Phaser, HTML und Debug-Modus

| Bereich | Vorgesehene Rolle |
|---|---|
| Phaser | Welt, Figuren, Bewegung, Interaktionsstellen, Objektzustände, visuelle Planungsreaktion und Aufbau |
| HTML/DOM | Zugängliche RPG-Dialogbox, Notizbuch, Maßskizzen-Eingabe, Menüs und semantische Alternativbedienung – innerhalb der Spielansicht gestaltet |
| Developer UI | Permanente Questspalte, Balken/Schrittnummer, Varianten-/Preset-/Hilfedropdowns, Reset-Testbutton, Rohzustände, technische Speicher-/Offline-/FPS-Anzeigen und umfassende Objekt-Testliste |

HTML wird nicht entfernt, um künstlich „spieliger“ zu wirken. Die Technik bleibt; die primäre Kommunikation ändert sich. Speicherdetails stehen im Debug-Modus. Ein echter Speicherfehler muss trotzdem verständlich und zugänglich gemeldet werden, damit die Person keinen vermeintlich gesicherten Fortschritt verliert.

Der reguläre Einstieg zeigt keine Debugoberfläche. Ein späterer ausdrücklich aktivierter Debug-Modus kann die bisherigen Werkzeuge wiederverwenden. Diese Trennung wird hier nur spezifiziert, noch nicht implementiert.

## 15. Pixel Art und UI-Richtung

Ziel sind detaillierte, charmante isometrische Pixel Art, moderne Lesbarkeit, begrenzte stimmige Palette, charaktervolle NPCs und kleine Animationen. WERK-Räume werden später über reale Landmarken wiedererkennbar; Maschinen und Werkzeuge brauchen erkennbare Silhouetten. Jonas’ gebrauchte blaue Arbeitsjacke, Cap und Brille tragen seine Wiedererkennbarkeit.

Die UI unterstützt die Welt durch ruhige kleine Flächen, klare Typografie und wenige sichtbare Bedienelemente. Lesetext muss nicht pixelig sein. Kein Habbo-Nachbau und kein Dashboard-Look. Die jetzigen Farben, Quader, Figuren, Labels sowie Tile-/Sprite-/Viewportmaße sind keine akzeptierte Art Direction. Fotos, Grundrisse und Referenzen werden später gemeinsam erhoben. In dieser Revision entstehen keine Produktionsgrafiken.

## Review und nächster Freigabepunkt

Das [Storyboard der Regalquest](regalquest-storyboard.md) konkretisiert diese Richtung. Zuerst Einstieg, primäre Weltansicht, Gesprächsform, reale/virtuelle Handlung und kleines Planungsproblem freigeben. Danach kann ein eng begrenzter Umbau der vorhandenen technischen Vorarbeit geplant werden; keine Neuimplementierung der funktionierenden Basis.

Bei einer späteren Beobachtungsprobe getrennt prüfen: Was entdecken Personen freiwillig? Welche Handlung verstehen sie ohne Regie? Können sie ihre Materialwahl mit einer beobachteten Eigenschaft verbinden? Erkennen sie ihren Beitrag im Ergebnis? Wollen sie den nächsten Raum erkunden? Technische Tests, Fachreview und Gameplay-/Experience-Beobachtung bleiben getrennt.

**„Würde ein 13- bis 18-jähriger Mensch, der nicht wegen unserer pädagogischen Ziele hier ist, freiwillig noch die nächste Werkstatt erkunden wollen?“**

Solange darauf kein überzeugendes Ja vorliegt, bleibt die Experience eine offene Entwurfsfrage. Nach dieser Dokumentationsrevision stoppen und auf Review warten. Kein Produktionscode, keine finalen Assets und kein Beginn von Phase 3.
