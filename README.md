# Bundeshaushalt-Rechner

Interaktiver Rechner, der zeigt, wie sich Einnahmen und Ausgaben des deutschen
Bundeshaushalts zusammensetzen — mit Vergleich zwischen dem vorläufigen
Haushaltsabschluss 2025 (Ist) und dem Haushaltsgesetz 2026 (Soll).

Dieses Repo ist der Nachfolger eines Claude.ai-Artefakts (Single-File-React-Komponente).
Die fachliche Recherche und Quellenprüfung ist bereits erledigt — hier geht es um die
technische Weiterentwicklung.

## Schnellstart

```bash
npm install
npm run dev            # lokaler Dev-Server
npm run validate-data  # prüft, ob alle Datenzeilen zu den amtlichen Summen passen
npm run build           # Produktions-Build nach dist/
```

## Deployment

Die Anwendung läuft auf dem Webserver unter dem Pfad `/bundeshaushalt` (nicht im
Root). Dafür ist `base: "/bundeshaushalt/"` in `vite.config.js` gesetzt, damit alle
Asset-Pfade im Build korrekt auf `/bundeshaushalt/...` verweisen. Der Build-Befehl
bleibt dadurch unverändert:

```bash
npm run build
```

Das Ergebnis in `dist/` muss auf dem Webserver unter `/bundeshaushalt/` ausgeliefert
werden (z. B. als Unterverzeichnis, Alias oder Subpath-Route), damit die Pfade
zusammenpassen.

## Projektstruktur

```
src/
  data/
    revenue.js    # Einnahmen-Zeilen (Steuern, Abzüge, Sonstiges), je mit sourceKey
    expenses.js   # Ausgaben-Zeilen nach Funktionenplan, je mit sourceKey
    sources.js    # Zentrale Quellenverwaltung (URL, Abrufdatum, Anmerkung)
    meta.js       # Amtliche Kontrollsummen für die Validierung
  components/     # Row, SectionHeader, BudgetGroup, InfoPanel
  App.jsx
scripts/
  validate-data.mjs   # node scripts/validate-data.mjs — Summenabgleich
```

## Warum diese Struktur?

Das ursprüngliche Artefakt war eine einzelne .jsx-Datei mit ~600 Zeilen — für ein
Tool mit ~65 Datenzeilen und zwei Jahrgängen nicht mehr wartbar. Die wichtigsten
Änderungen gegenüber dem Artefakt:

- **Daten von UI getrennt** (`src/data/*.js`), damit die jährliche Aktualisierung
  keine Komponenten anfassen muss.
- **Quellen sind strukturierte Daten** (`sourceKey` pro Zeile → `sources.js`), nicht
  nur Fließtext in einer Fußnote.
- **Ein Validierungsskript** ersetzt das manuelle Nachrechnen, das während der
  Recherche nötig war, um Rundungsfehler und Tippfehler zu finden.
- **Echtes Tailwind** (mit Compiler) statt der Konstruktion aus CSS-Variablen und
  Klassennamen, die im Artefakt nötig war, weil dort nur vordefinierte
  Tailwind-Klassen ohne Compiler zur Verfügung standen.

## Datenherkunft

Primärquelle für beide Jahrgänge: BMF-Monatsbericht Februar 2026, Beitrag
„Sollbericht 2026: Bundeshaushalt, KTF und SVIK" — der amtliche Vergleich zwischen
dem vorläufigen Haushaltsabschluss 2025 und dem Haushaltsgesetz 2026. Tabelle 1
(Gesamtübersicht), Tabelle 3 (Ausgaben nach Aufgabenbereichen/Funktionenplan) und
Tabelle 4 (Einnahmen). Ergänzt um den Rentenversicherungsbericht 2025 (BMAS) für die
Einordnung der Renten-Zahlen. Vollständige Liste mit URLs: `src/data/sources.js`.

Wichtige methodische Hinweise (siehe auch die Kommentare in den Datendateien):

- Die Ausgaben sind nach **Funktionenplan** gegliedert (Aufgabenbereiche), nicht nach
  Einzelplan/Ressort. Das ist eine bewusste Abweichung vom ursprünglichen Artefakt,
  weil sich darüber Rente/Kranken-/Arbeitslosen-/Pflegeversicherung und Bürgergeld
  einzeln ausweisen lassen — das war explizit der Wunsch, der zu dieser Version
  geführt hat.
- Manche Funktionsgruppen sind laut BMF nur „auszugsweise" dargestellt. Wo die
  benannten Unterpositionen nicht exakt zur amtlichen Gruppensumme aufaddieren,
  gibt es eine Zeile „Sonstige/Rest", die die Differenz transparent macht, statt sie
  zu verstecken.
- „Ist 2025" und „Soll 2026" sind nicht direkt vergleichbar mit „Soll 2025" (dem
  ursprünglich geplanten Betrag) — das Budget wurde 2025 nicht vollständig
  ausgeschöpft. Für eine reine Plan-zu-Plan-Betrachtung wäre eine dritte Datenreihe
  nötig.

## Offene Aufgaben / Ideen für Claude Code

Sinnvolle nächste Schritte, grob nach Aufwand sortiert:

1. **Jährliche Aktualisierung vorbereiten**: Sobald der Sollbericht 2027 erscheint
   (voraussichtlich Februar 2027), `data/revenue.js`, `data/expenses.js` und
   `data/meta.js` aktualisieren und `npm run validate-data` laufen lassen.
2. **Persistenz**: Aktuell verpufft jede Slider-Einstellung beim Reload. Ein Szenario
   in der URL kodieren (Query-Parameter) oder in localStorage speichern wäre ein
   naheliegender erster Schritt.
3. **Zusammenfassende Visualisierung**: Ein gestapeltes Balkendiagramm oder
   Sankey-Diagramm für Einnahmen → Ausgaben würde die Zahlenkolonnen ergänzen.
   Kandidaten: recharts oder d3.
4. **Tests**: `scripts/validate-data.mjs` ist ein Node-Skript, kein Test-Runner.
   Migration zu vitest würde CI-Integration (GitHub Actions) vereinfachen.
5. **Deployment**: Statischer Build (`npm run build` → `dist/`), passt auf Vercel,
   Netlify oder GitHub Pages. Noch nicht eingerichtet.
6. **Barrierefreiheit prüfen**: Slider haben `aria-label`, aber Screenreader-Verhalten
   bei den `<details>`-Infoboxen wurde nicht getestet.
7. **Weitere Aufgabenbereiche einzeln ausweisen**: Aktuell sind z. B. „Bildung" oder
   „Energie- und Wasserwirtschaft" noch als ein Block ohne Unterpositionen erfasst.

## Vorschlag für den Einstiegs-Prompt in Claude Code

```
Lies zuerst README.md und src/data/sources.js komplett, damit du die
Datenherkunft und die methodischen Einschränkungen verstehst, bevor du
etwas an den Zahlen änderst. Führe dann npm install und npm run
validate-data aus, um den aktuellen Stand zu bestätigen. Schlag mir
danach vor, mit welcher der in der README unter "Offene Aufgaben"
gelisteten Ideen wir anfangen sollten.
```
