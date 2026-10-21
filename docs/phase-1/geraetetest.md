# Manuelle Geräteprüfung Phase 1

**Status:** noch nicht durchgeführt. Verfügbar laut Auftraggeber: MacBook Pro und iPhone 15. Schul-iPad aktuell nicht verfügbar. Chromium-Emulation ist kein Safari-/iPad-Nachweis.

## Starten auf dem MacBook

Node 24.19.0 und pnpm 11.25.0 verwenden, dann im Projekt:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm preview --port 4173
```

`http://localhost:4173` in Safari und Chrome öffnen. Für Offline immer den Produktionsbuild, nicht `pnpm dev` verwenden. Der erste Download benötigt eine Verbindung. Ein eigenständiger PWA-Installationsdialog ist in Phase 1 nicht enthalten.

## iPhone 15

Für einen ersten Touchvergleich kann das iPhone im selben WLAN die vom Previewserver angezeigte LAN-Adresse öffnen. Der aktuelle lokale Server zeigt `http://192.168.0.216:4173/`; diese Adresse kann sich ändern. Mac-Firewall, WLAN-Clientisolation und VPN können den Zugriff verhindern. Keine Routerfreigabe einrichten.

**Über diese HTTP-LAN-Adresse ist der Offline-Service-Worker nicht verfügbar.** Für Offline/Safari auf dem iPhone wird ein vom Gerät vertrauter HTTPS-Testhost benötigt. Kein Zertifikatwarnungs-Bypass als erfolgreicher Test zählen. Öffentliches Hosting oder ein Tunnel wurden nicht eingerichtet; dafür ist eine gesonderte Hostingentscheidung nötig. Bis dahin Touch über LAN und Offline auf Mac-localhost separat testen, nicht als vollständige iPhone-Abnahme zusammenfassen.

## Vergleich A/B · jeweils 3–5 Minuten

Alle Maße, Raumgröße und Steuerungen sind experimentell. A ist nur der erste Eintrag im Auswahlfeld, keine Produktentscheidung. Reihenfolge beim zweiten Test umdrehen, um Gewöhnung nicht mit besserer Steuerung zu verwechseln.

1. Gerät, Betriebssystem, Browser-/Version, Orientierung und Eingabemethode notieren.
2. A wählen. Fünf benannte freie Bodenfelder erreichen, dann den Regalblock und die beiden anderen Objekte ansprechen. Reaktion auf blockierte Felder prüfen.
3. B wählen. Dieselben Ziele mit gedrückt gehaltenen schrägen Richtungstasten erreichen. Loslassen außerhalb des Buttons, Unterbrechung durch Appwechsel und versehentliche Berührung prüfen. Bei B darf ein Bodentap keine Bewegung auslösen.
4. Pro Variante Zieltreffer, Fehltaps, Korrekturbewegungen, Zeit bis zum ersten Ziel und subjektive Verständlichkeit 1–5 notieren. Keine allgemeine Überlegenheit aus einer Person ableiten.
5. Testdialog öffnen, `40,5` speichern. Prüfen, ob Bildschirmtastatur Feld und Buttons erreichbar lässt. Während Dialog und Tastatur darf sich die Welt nicht weiterbewegen. Escape auf Laptop; Schließen auf Touch.
6. Vor/hinter das Regal laufen: Figur wird hinten verdeckt und steht vorne davor. Screenshots beider Positionen aufnehmen. Keine Produktmaßstäbe aus diesen Blöcken ableiten.
7. Reload: Position, Steuerungsvariante und Messwert bleiben erhalten. Teststand zurücksetzen: Messwert und alte Position verschwinden.
8. Auf einem HTTPS-Testhost beziehungsweise Mac-localhost „Offlinepaket vollständig“ abwarten. Flugmodus beziehungsweise Netzwerk offline, Tab schließen, Seite erneut öffnen. Auch nach Browserbeenden prüfen. Formular erneut öffnen und Wert kontrollieren.
9. Falls möglich wenig Speicher/privaten Modus, Orientierung ändern, Bildschirm zoomen, Appwechsel und erneute Aktivierung prüfen. Fehler konkret protokollieren.
10. „Testbericht herunterladen“ speichert technische Angaben lokal. Nur nach eigener Sichtung weitergeben. Keine automatische Telemetrie.

## Protokollvorlage

- Datum / Testperson-Kürzel (optional):
- Gerät / OS / Browser-Version:
- Normalmodus oder privat / URL / HTTP oder HTTPS:
- Auflösung / Orientierung / Browserzoom:
- A: Ziele geschafft / Fehltaps / Verständlichkeit / Zeit:
- B: Ziele geschafft / Fehltaps / Verständlichkeit / Zeit:
- Favorit und Grund / keine klare Präferenz:
- Grafiküberdeckung vor/hinter Regal:
- Dialog / Bildschirmtastatur / Fokus:
- Reload / Reset / Fehler beim Speichern:
- Offline nach Reload / neuem Tab / Browser-Neustart:
- FPS mehrere Sekunden im Vordergrund / Ladezeit / Netzwerkbedingungen:
- Screenshot-/Berichtdateien:
- Blocker / Beobachtungen / Empfehlung:

iPhone-Ergebnisse später separat ergänzen. Die endgültige Tabletsteuerung erst nach vergleichbarem realem iPad-Test festlegen.
