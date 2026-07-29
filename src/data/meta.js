// Amtliche Kontrollsummen aus dem BMF-Sollbericht 2026, Tabelle 1 (Gesamtübersicht).
// Werden von scripts/validate-data.mjs genutzt, um Tippfehler in den Datenzeilen zu
// erkennen: die Summe aller REVENUE_ITEMS / EXPENSE_ITEMS muss (bis auf Rundung)
// mit diesen Zahlen übereinstimmen. Bei der jährlichen Aktualisierung zuerst diese
// Datei mit den neuen Eckwerten füllen, dann die Detailzeilen ergänzen.

export const OFFICIAL_TOTALS = {
  "2025": {
    steuernNetto: 388.564,
    einnahmen: 427.923,
    ausgaben: 493.278,
    saldo: -65.355,
  },
  "2026": {
    steuernNetto: 387.214,
    einnahmen: 426.431,
    ausgaben: 524.540,
    saldo: -98.110,
  },
};

export const TOLERANCE = 0.05; // Mrd. € zulässige Rundungsdifferenz
