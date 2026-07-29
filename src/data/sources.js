// Zentrale Quellenverwaltung. Jeder Datenpunkt in revenue.js / expenses.js referenziert
// einen dieser Schlüssel über `sourceKey`, damit Herkunft und Abrufdatum an einer Stelle
// gepflegt werden können (wichtig für die jährliche Aktualisierung).

export const SOURCES = {
  bmfSollbericht2026: {
    label: "BMF-Monatsbericht Februar 2026 – Sollbericht 2026",
    url: "https://www.bundesfinanzministerium.de/Monatsberichte/Ausgabe/2026/02/Inhalte/Kapitel-2-Analysen/2-3-sollbericht-2026.html",
    note: "Tabelle 1 (Gesamtübersicht), Tabelle 3 (Ausgaben nach Aufgabenbereichen), Tabelle 4 (Einnahmen). Amtlicher Vergleich Ist 2025 / Soll 2026.",
    retrieved: "2026-07-29",
  },
  einzelplan60_2026: {
    label: "Bundeshaushaltsplan 2026, Einzelplan 60, Kapitel 6001 (Steuern)",
    url: "https://www.bundeshaushalt.de/static/daten/2026/soll/epl60.pdf",
    note: "Titelscharfe Aufschlüsselung der Steuerarten nach Bundesanteil, inkl. Erläuterungen zu Verteilungsschlüsseln.",
    retrieved: "2026-07-29",
  },
  gesamtplan2026: {
    label: "Gesamtplan des Bundeshaushaltsplans 2026 (Regierungsentwurf)",
    url: "https://www.bundeshaushalt.de/static/daten/2026/soll/draft/Gesamtplan_und_Uebersichten.pdf",
    note: "Einzelplan-Summen; teils durch die Bereinigungssitzung im November 2025 leicht überholt, siehe bmfSollbericht2026 für finale Zahlen.",
    retrieved: "2026-07-29",
  },
  rentenversicherungsbericht2025: {
    label: "Rentenversicherungsbericht 2025 (BMAS/Bundesregierung, § 154 SGB VI)",
    url: "https://www.bmas.de/DE/Service/Presse/Pressemitteilungen/2025/bundeskabinett-beschliesst-rentenversicherungsbericht-2025.html",
    note: "Kabinettsbeschluss 19.11.2025. Beitragssatz, Nachhaltigkeitsrücklage, Vorausberechnung Einnahmen/Ausgaben.",
    retrieved: "2026-07-29",
  },
  bundestagEtat2026Arbeit: {
    label: "Deutscher Bundestag – Etat 2026: Arbeit und Soziales",
    url: "https://www.bundestag.de/presse/hib/kurzmeldungen-1105602",
    note: "Aufschlüsselung Einzelplan 11 (Bundeszuschüsse Rente, Bürgergeld, KdU) für 2025 und 2026.",
    retrieved: "2026-07-29",
  },
};

// Durchnummerierte Liste in fester Reihenfolge (Objekt-Insertion-Order), für die
// Quellenliste im UI und für Verweise `#quelle-<key>` aus den Budget-Sektionen.
export const SOURCE_LIST = Object.keys(SOURCES).map((key, i) => ({
  key,
  number: i + 1,
  ...SOURCES[key],
}));

export const sourceAnchor = (key) => `quelle-${key}`;
