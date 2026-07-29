# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev            # lokaler Dev-Server (Vite)
npm run build           # Produktions-Build nach dist/ (base path /bundeshaushalt/, siehe vite.config.js)
npm run preview         # Build lokal ansehen
npm run validate-data   # prüft, ob alle Datenzeilen zu den amtlichen Summen passen
```

Es gibt keinen Test-Runner; `npm run validate-data` (`scripts/validate-data.mjs`) ist die
einzige automatisierte Prüfung. Nach jeder Änderung an `src/data/revenue.js`,
`src/data/expenses.js` oder `src/data/meta.js` muss dieses Skript erneut laufen.
`.github/workflows/ci.yml` führt bei jedem Push/PR auf `main` `validate-data` und
`build` automatisch aus.

## Architektur

Interaktiver Rechner für den deutschen Bundeshaushalt, der Einnahmen/Ausgaben als
verschiebbare Regler darstellt und Ist 2025 gegen Soll 2026 vergleicht. Nachfolger
eines Single-File-React-Artefakts (~600 Zeilen); die Struktur hier trennt bewusst
Daten von UI:

- `src/data/revenue.js`, `src/data/expenses.js` — die eigentlichen Budgetzeilen. Jede
  Zeile hat `id`, `section`, `v25`/`v26` (Werte für beide Jahrgänge) und `sourceKey`
  (Verweis auf `sources.js`).
- `src/data/sources.js` — zentrale Quellenverwaltung (URL, Abrufdatum, Anmerkung) pro
  `sourceKey`, damit Herkunftsnachweise nicht als Fließtext verstreut sind.
- `src/data/meta.js` — amtliche Kontrollsummen (`OFFICIAL_TOTALS`) und Toleranz, gegen
  die `scripts/validate-data.mjs` die Summe aller Datenzeilen prüft.
- `src/data/funktionen.js` — Kurzbeschreibungen der amtlichen Funktionenplan-Kategorien
  (Anlage zu § 13 BHO), als Hover-Hinweis für die „Funktion NN"-Badges in `Row.jsx`.
- `src/data/explanations.js` — ausführlichere Erläuterungen zu Datenzeilen, die im
  Rechner nur einen kurzen Hinweis (z. B. „Rest") bekommen; Zeilen verweisen per
  `explainKey` dorthin, dargestellt von `Explanations.jsx`.
- `src/App.jsx` — hält den gesamten State (aktuelle Regler-Werte pro Zeile, Basisjahr)
  in einer flachen `{id: value}`-Map; wechselt man das Basisjahr, wird diese Map aus
  `datasets["2025"|"2026"]` neu befüllt. Summen (Steuern brutto/netto, Einnahmen,
  Ausgaben, Saldo) werden aus dieser Map per `useMemo` neu berechnet, nicht aus den
  Rohdaten.
- Ausgaben sind nach **Funktionenplan** (Aufgabenbereich) gegliedert, nicht nach
  Einzelplan/Ressort — eine bewusste Abweichung vom Original-Artefakt, damit
  Rente/Kranken-/Arbeitslosen-/Pflegeversicherung und Bürgergeld einzeln sichtbar sind.
  Manche Funktionsgruppen sind laut BMF nur „auszugsweise" dargestellt; wo Unterzeilen
  nicht exakt zur amtlichen Gruppensumme aufaddieren, gibt es eine „Sonstige/Rest"-Zeile.
- Styling über Tailwind (echter Compiler, `tailwind.config.js`), keine
  CSS-Variablen-Konstruktion mehr wie im ursprünglichen Artefakt.
- `src/components/` — `SearchField.jsx` (Live-Suche über Einnahme-/Ausgabezeilen),
  `DonutChart.jsx` (Kuchendiagramm für Einnahmen/Ausgaben in `App.jsx`),
  `Explanations.jsx` (rendert `src/data/explanations.js`) und `Sources.jsx` (rendert
  `src/data/sources.js`) ergänzen die bestehenden `BudgetGroup.jsx`, `Row.jsx`,
  `SectionHeader.jsx`, `InfoPanel.jsx`.

## Deployment

Die App läuft produktiv unter dem Pfad `/bundeshaushalt` (nicht Root). Deshalb ist
`base: "/bundeshaushalt/"` in `vite.config.js` fest gesetzt — `npm run build` erzeugt
damit bereits korrekte Asset-Pfade, ohne zusätzliche Flags.

## Jährliche Aktualisierung

Bei einem neuen Sollbericht: zuerst `src/data/meta.js` mit den neuen Eckwerten
füllen, dann `src/data/revenue.js`/`expenses.js` ergänzen, danach
`npm run validate-data` laufen lassen, um Tippfehler/Rundungsdifferenzen zu finden.
