# Ergänzung Phase 0: NFC und Fundquests

Stand: 21.10.2026. Rechercheergänzung auf Wunsch des Auftraggebers. **Aktuelle Entscheidung:** NFC bleibt als mögliche spätere Ergänzung vorgemerkt. Keine NFC-Hardwarebeschaffung, kein NFC-Techniktest und keine NFC-Implementierung im ersten Prototyp. QR/Kurzcode bleibt die Basis für iPads. Phaser ist als Engine bestätigt.

## Ergebnis für M2C und Schul-iPads

**NFC ist für die Idee interessant, aber kein einfacher Ersatz für QR-Codes auf euren iPads.** Zwei Voraussetzungen müssen gleichzeitig erfüllt sein: ein zugänglicher NFC-Tagreader im Gerät und eine Schnittstelle zur laufenden Anwendung. Safari/iPadOS stellt Web NFC derzeit nicht bereit. Auch die Installation als PWA fügt diese Schnittstelle nicht hinzu. Die [MDN-Kompatibilitätsdaten für NDEFReader](https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/NDEFReader.json) führen Safari und Safari iOS ohne Unterstützung.

Für die üblichen Schul-iPads darf außerdem kein integrierter, für solche Tags nutzbarer NFC-Reader vorausgesetzt werden. Beispielsweise führt Apple beim aktuellen [iPad A16](https://www.apple.com/ipad-11/specs/) keinen NFC-Tagreader auf; Apple Pay wird dort für Apps und Web beschrieben. Das ist kein Nachweis für kontaktloses Taglesen. Die konkrete M2C-Geräteliste fehlt noch; deshalb keine pauschale Zusage für unbekannte Modelle. Bereits die fehlende Safari-Schnittstelle verhindert jedoch die geplante direkte Weblösung unabhängig davon.

Ein anderer Engineexport löst das nicht. Auch eine native App ergänzt keine fehlende Hardware. Ein als „für iPad“ gelisteter NFC-App-Download ist ebenfalls kein Beleg dafür, dass das iPad selbst Tags lesen kann.

## Welche Varianten funktionieren können?

| Variante | Eignung | Konsequenz |
|---|---|---|
| iPad + Safari/PWA + NFC-Aufkleber | Nicht als direkte Standardlösung geeignet | Kein Web-NFC-Zugriff; Reader nicht voraussetzen |
| iPad + Kamera + QR | Passende Basis | In-App-Scan testen, manuellen Stationscode erhalten |
| Android mit NFC + Chrome | Gute optionale NFC-Variante | Vorhandene Hardware, Berechtigung und verwaltete Geräteeinstellungen prüfen |
| iPhone + NFC-URL | Kann Taglink öffnen | Unterstützte Geräte; kein kontinuierlicher Web-NFC-Scanner und kein automatischer Übertrag zum iPad |
| iPad + externer Reader | Nur nach gesondertem Test | Zusatzhardware, Strom/Adapter, MDM und Eingabemodus; keine einfache Plug-and-play-Zusage |
| Separate native App/Reader-Brücke | Technisch projektspezifisch möglich | Zusätzliche Entwicklung und Geräteverwaltung; für V1 unverhältnismäßig |

[Chrome dokumentiert Web NFC für Android ab Version 89](https://developer.chrome.com/docs/capabilities/nfc). Gelesen/geschrieben werden NDEF-Daten; Unterstützung der API allein garantiert keine NFC-Hardware. Start per Nutzeraktion, Berechtigung und aktivierter Reader sind nötig. Die Anwendung muss HTTPS verwenden und im aktiven passenden Browserkontext laufen. Ablehnung, Lesefehler und Unterbrechung erhalten einen Fallback.

Apple beschreibt [Hintergrundlesen von NFC-Tags auf iPhone XS und neuer](https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading). Dabei kann ein URL-Tag einen Link anbieten. Das ist etwas anderes als mehrere Tags direkt im laufenden Safari-Spiel einzulesen. Ein Scan auf einem zweiten Telefon setzt den Spielstand auf dem iPad nicht automatisch fort; ohne Server/Synchronisation bleibt er auf diesem Telefon. Private Smartphones sind daher keine Voraussetzung für den Pilot.

Externe Reader sind nur dann interessant, wenn ein konkretes Modell auf dem verwalteten iPad eine stabile lokale Eingabe liefert, beispielsweise tatsächlich als unterstützte Tastatureingabe. Viele Reader verwenden andere Protokolle oder liefern nur eine UID statt des NDEF-Inhalts. Bluetooth allein bedeutet keine Safari-Anbindung; WebUSB/WebBluetooth nicht als pauschalen iPad-Ausweg einplanen. Readerauswahl und Test wären ein eigener optionaler Technikauftrag.

## Die Questidee übernehmen wir unabhängig vom Lesemedium

Die sinnvolle Mechanik ist **Gegenstände passend zu einem Auftrag entdecken und auswählen**. QR, NFC und manuelle Codes sind austauschbare Eingänge für dieselbe Objekt-ID. Keine getrennten Quests je Scantechnik.

Beispiel Nähwerkstatt: „Wir wollen eine robuste Tasche vorbereiten. Finde eine passende Stoffprobe, ein Schneidwerkzeug und den vorgesehenen Nähplatz.“ Die Jugendlichen vergleichen vorbereitete Proben und Informationen, erfassen ihre Auswahl und erhalten eine sichtbare Sammlung. Jonas kommentiert, warum ein Gegenstand passt oder welche Eigenschaft noch fehlt. Sobald eine gültige Kombination vorliegt, wird ein kleines virtuelles Anordnungs-/Planungsminigame freigeschaltet. Danach erscheint die fertige Tasche im Spiel.

Ein passender Stoff ist nicht automatisch der einzige Stoff mit einem richtigen Tag. Alternativen nach Anforderungen zulassen: Reißfestigkeit, Verwendungszweck und vorhandene Informationen bestimmen die Eignung. Ein Scan zeigt nur „Dieses Objekt wurde erfasst“, nicht „Du hast es verstanden“. Deshalb nach Auswahl eine kurze Zuordnung oder begründete Entscheidung vorsehen.

Weitere Beispiele: 3D-Drucker + geeignetes Filament + vorbereitete Bauteilprobe → Druckablauf planen; Holzprobe + Messwerkzeug + sichere Infostation zum Zuschnitt → virtuelles Regal planen. Keine Maschine bedienen, keine Schere herumtragen und keine Filamentrolle aus einem laufenden Drucker entfernen. Tags an sicher erreichbaren Infoflächen oder Probenhaltern platzieren; gesperrte Geräte erhalten ein Duplikat am freigegebenen Beobachtungspunkt.

## Kleines Datenmodell statt neuer Infrastruktur

Eine Station erhält eine stabile ID, etwa `sewing_fabric_canvas_01`. Der Eingangsadapter wandelt QR/NDEF/Code in `objectObserved(id)` um. Der vorhandene Questzustand speichert eine Menge eindeutiger IDs. Wiederholte Scans erhöhen keinen Zähler; unbekannte oder für die aktuelle Quest unpassende Objekte geben hilfreiches Feedback. Beim Reload bleibt die Sammlung lokal erhalten, beim Rundenreset wird sie gelöscht.

Zusätzlicher Schritttyp nur bei tatsächlicher Umsetzung: `collect_objects` mit Slotanforderungen, zulässigen Objekt-IDs oder redaktionell zugeordneten Eigenschaften, Hinweisen und `next`. Beispielhafte Slots: Stoff / Schneidwerkzeug / Nähplatz. Eine feste Liste oder kleine Slotregel reicht; kein allgemeiner Regelinterpreter. `completion` prüft gültige Kombinationen und löst die Freischaltung genau einmal aus. Fortschritt etwa „2 von 3 Dingen gefunden“, mit Bildern und korrigierbarer Auswahl. Minigames sind eigene kleine Ansichten und kein beliebiger Code im Quest-JSON.

Tags enthalten nur eine eigene kurze HTTPS-Stations-URL als NDEF-URI-Record, z. B. `https://spiel.example.org/#/station/sewing-fabric-01`. QR und aufgedruckter Kurzcode zeigen auf dieselbe Zuordnung. Keine Spielstände, Geheimnisse oder Namen auf Tags. Origin, Pfad und ID prüfen; keine fremden URLs automatisch öffnen. Tags sind kopierbar und kein Anwesenheits-/Prüfungsnachweis. Seriennummern nicht als personenbezogene Trackingkennung verwenden.

## Tags beschreiben und montieren

Die Datenvorbereitung ist einfach: Stations-ID vergeben, kurzen Link erzeugen, mit einem geeigneten NFC-Schreibgerät beziehungsweise NFC-fähigen Smartphone als NDEF-URL schreiben, wieder einlesen und Inventarliste pflegen. Ein Schreibgerät genügt für die Vorbereitung; nicht jedes Schülergerät muss schreiben können.

Für einen Versuch kommen NFC-Forum-Type-2-Tags wie NTAG213/215 in Betracht. [NXP nennt für NTAG213/215/216 144/504/888 Byte Nutzspeicher](https://www.nxp.com/products/NTAG213_215_216?tab=Package_Quality_Tab). Die kurze URL muss inklusive NDEF-Struktur hineinpassen; tatsächlichen Schreib-/Lesetest durchführen. Nach Testfreigabe kann Schreibschutz gegen versehentliche Änderungen sinnvoll sein; permanenten Lock nicht schon während der Einrichtung setzen.

Auf Metall sind passend ausgelegte On-Metal-Tags erforderlich beziehungsweise geeignete Montageflächen zu testen. Der [Hersteller Seritag beschreibt die Ferritbarriere seiner On-Metal-Tags](https://seritag.com/nfc-tags/22mm-onmetal-ntag213). Maschinengehäuse, Scheren und Metallregale daher nicht mit beliebigen Papierstickern planen. An Stoffproben eine markierte Probenkarte oder einen Anhänger nutzen; Haltbarkeit und eindeutige Zuordnung prüfen. Tags nicht dicht stapeln: Ein bewusstes Objekt nach dem anderen erfassen.

## Aufwand und Entscheidung

**Beschlossener Scope:** iPad-first beibehalten, Fundquests mit QR plus Kurzcode planen und NFC ausschließlich als mögliche spätere Ergänzung offenhalten. Keine NFC-Tagserie kaufen, bevor ein vorhandenes geeignetes NFC-Gerät und die Montage getestet wurden. Ein Gerätewechsel allein wegen NFC ist derzeit nicht begründet.

Nur bei einer späteren gesonderten NFC-Freigabe und verfügbarem NFC-fähigem Androidgerät: 0,5–1 PT begrenzter Technikversuch mit drei Tags, derselben Spielseite und denselben IDs. Danach etwa 2–4 PT für einen robusten optionalen Web-NFC-Adapter samt Fehlerfällen, ohne neue Minigames/Questredaktion. Eine Sammlung mit Slots benötigt grob 2–4 zusätzliche PT; ein kleines spezifisches Minigame weitere 2–5 PT je nach Gestaltung. Diese Zusatzarbeit ist nicht in den bisherigen Slice-/Releasezahlen enthalten. Externe iPad-Reader oder native Brücken sind mangels ausgewählter Hardware nicht seriös schätzbar.

Tests: richtiges/falsches Objekt, Duplikat, beliebige Reihenfolge, Reload nach zwei Funden, fehlende Berechtigung, unbekannter/manipulierter Tag, Offlinebetrieb, Readerunterbrechung und Einmaligkeit der Freischaltung. Metalletikett am tatsächlichen Montageort testen. Dieselbe Quest muss mit Kamera oder Kurzcode auf dem iPad abschließbar bleiben.

Für Phase 1 benötigen wir Modellbezeichnungen und iPadOS-Versionen der tatsächlichen M2C-/Schulgeräte. Die Frage nach einem NFC-fähigen Testgerät wird erst bei einer späteren Wiederaufnahme von NFC relevant. Sie blockiert weder Phase 1 noch den QR-/Kurzcode-Workflow.
