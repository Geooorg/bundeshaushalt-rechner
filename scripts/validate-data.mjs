// Prüft, ob die Summe aller Datenzeilen (annähernd) den amtlichen Kontrollsummen
// aus meta.js entspricht. Läuft mit: npm run validate-data
// Bei der jährlichen Aktualisierung unbedingt nach jeder Änderung erneut ausführen.

import { REVENUE_ITEMS } from "../src/data/revenue.js";
import { EXPENSE_ITEMS } from "../src/data/expenses.js";
import { OFFICIAL_TOTALS, TOLERANCE } from "../src/data/meta.js";

function computeFor(year) {
  const key = year === "2025" ? "v25" : "v26";
  const bySection = (list, section) =>
    list.filter((i) => i.section === section).reduce((s, i) => s + i[key], 0);

  const steuernBrutto = bySection(REVENUE_ITEMS, "steuern");
  const abzuege = bySection(REVENUE_ITEMS, "abzuege");
  const sonstige = bySection(REVENUE_ITEMS, "sonstige");
  const steuernNetto = steuernBrutto - abzuege;
  const einnahmen = steuernNetto + sonstige;
  const ausgaben = EXPENSE_ITEMS.reduce((s, i) => s + i[key], 0);
  const saldo = einnahmen - ausgaben;

  return { steuernNetto, einnahmen, ausgaben, saldo };
}

let failed = false;

for (const year of Object.keys(OFFICIAL_TOTALS)) {
  const computed = computeFor(year);
  const official = OFFICIAL_TOTALS[year];

  console.log(`\n--- ${year} ---`);
  for (const field of Object.keys(official)) {
    const diff = Math.abs(computed[field] - official[field]);
    const ok = diff <= TOLERANCE;
    if (!ok) failed = true;
    console.log(
      `${ok ? "OK  " : "FAIL"} ${field}: berechnet ${computed[field].toFixed(3)} vs. amtlich ${official[field].toFixed(3)} (Diff ${diff.toFixed(3)})`
    );
  }
}

const allIds = [...REVENUE_ITEMS, ...EXPENSE_ITEMS].map((i) => i.id);
const dupes = allIds.filter((id, idx) => allIds.indexOf(id) !== idx);
if (dupes.length) {
  failed = true;
  console.log(`\nFAIL doppelte IDs gefunden: ${[...new Set(dupes)].join(", ")}`);
}

console.log(failed ? "\nValidierung fehlgeschlagen." : "\nAlle Summen stimmen innerhalb der Toleranz.");
process.exit(failed ? 1 : 0);
