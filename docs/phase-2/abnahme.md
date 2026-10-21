# Phase 2 – technische Funktionsprüfung

**Aktuelle Einordnung:** Dieser Ablauf prüft technische Zustände. Er ist kein Nachweis für spielbare oder unterhaltsame Quests. Die inhaltliche/UX-Abnahme steht aus; zuerst [Creative Direction](../design/creative-direction.md) und [Storyboard](../design/regalquest-storyboard.md) prüfen. Kein Produktionscode in diesem Revisionsschritt.

Lokale Vorschau aktuell: `http://localhost:4175/`. Der eigene Port vermeidet einen noch aktiven Phase-1-Service-Worker auf Port 4173. Verschiedene Ports haben getrennte Browserdaten; Savemigration im selben Origin wird separat automatisiert geprüft.

Für einen frischen Start „Neue Runde“ nutzen. Avatarpreset und Hinweisunterstützung auswählen; beide Bewegungsvarianten sind weiter verfügbar. Keine Altersangabe erforderlich.

## Technischer Ablauf; Spielrundendauer noch nicht validiert

1. Jonas im Raum oder über die HTML-Liste ansprechen; alternativ den Auftrag rechts fortsetzen.
2. Auftrag annehmen. Messkarte öffnen und die Breite der fiktiven Kiste merken. Dieser Schritt simuliert die spätere reale Messaufgabe.
3. Absichtlich `400` oder `30` eingeben. Jonas gibt Kontext; erneuter Versuch und Hinweise bleiben verfügbar.
4. Mit `40`, `40,0` oder `40.0` weitergehen. Hinweise stufenweise ausprobieren; mehrmaliges Öffnen darf keinen Fortschritt kosten.
5. Alle drei Materialkarten lesen. Eine Auswahl mit Begründung treffen. Es gibt mehrere vertretbare Entscheidungen.
6. Ein Verfahren wählen. Den ungeeigneten Druckvorschlag ausprobieren und anschließend eine der beiden passenden Möglichkeiten wählen.
7. Regal virtuell fertigstellen. Im Raum erscheinen Festkisten im Regal; die Ergebnisansicht verknüpft die Tätigkeiten mit Berufsfeldern.
8. Reload und Offline-Neustart nach vollständigem Paketdownload. Das Ergebnis bleibt erhalten. Neue Runde löscht Antworten, Hinweise und Abschluss.

## Was noch menschlich geprüft werden muss

- Ist der Ablauf ohne Erklärung verständlich? Finden drei bis fünf freiwillige Testpersonen Jonas, Messkarte, Hinweise und Abschluss?
- Wie lange dauert eine normale Runde? Nicht künstlich auf 5–10 Minuten verzögern; tatsächliche Beobachtungen protokollieren.
- Sind Material- und Verfahrensannahmen fachlich angemessen und verständlich? Vor einem Jugendpilot durch eine fachkundige Person gegenlesen lassen.
- Sind Bewegung, Dialoge, Bildschirmtastatur und Textgröße auf dem iPhone und später dem realen Schul-iPad nutzbar?
- Ist eine Variante A/B leichter? Erst nach vergleichbaren Aufgaben auf echten Geräten entscheiden.
- Fühlt sich der sichtbare Beitrag zum Fest verständlich an? Keine Punkte oder Berufsdiagnose erwarten.

## Protokoll

- Datum / Gerät / OS / Browser / Orientierung:
- Steuerung A oder B / Hilfeeinstellung:
- Zeit / benötigte Starthilfe / unklare Stellen:
- Gefundene Objekte / übersehene Schaltflächen:
- Verständlichkeit von Maß, Material, Verfahren:
- Ergebnis und Weltveränderung erkannt:
- Reload / Offline / neue Runde:
- Änderungswünsche und Blocker:

Auf dem iPhone ist HTTP im WLAN nur für den Online-Touchversuch geeignet. Für den Offline-Service-Worker wird vertrauenswürdiges HTTPS benötigt. Es wurde kein öffentlicher Testhost eingerichtet. Das reale iPad ist weiterhin nicht verfügbar; Chromium-Emulation ersetzt es nicht.
