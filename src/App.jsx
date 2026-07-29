import { useMemo, useState } from "react";
import { REVENUE_ITEMS } from "./data/revenue.js";
import { EXPENSE_ITEMS } from "./data/expenses.js";
import { fmt, sectionAnchor, rowAnchor } from "./utils.js";
import BudgetGroup from "./components/BudgetGroup.jsx";
import InfoPanel from "./components/InfoPanel.jsx";
import SearchField from "./components/SearchField.jsx";
import DonutChart from "./components/DonutChart.jsx";
import Explanations from "./components/Explanations.jsx";
import Sources from "./components/Sources.jsx";

const OFFICIAL_SALDO = { "2025": -65.355, "2026": -98.110 };

const EXPENSE_SECTIONS = [
  { key: "dienste", label: "Allgemeine Dienste & Sicherheit", color: "#35566E" },
  { key: "bildung", label: "Bildung, Wissenschaft, Forschung", color: "#9C7A2A" },
  { key: "soziales", label: "Soziale Sicherung, Familie, Arbeitsmarkt", color: "#2E5E45" },
  { key: "wirtschaft", label: "Wirtschaft, Umwelt, Wohnen, Landwirtschaft", color: "#6B4226" },
  { key: "verkehr", label: "Verkehr", color: "#7B3F61" },
  { key: "finanz", label: "Finanzwirtschaft & Zinsen", color: "#4A6C6F" },
];

// Anteil an den Einnahmen, ab dem eine Einnahmequelle im Kuchendiagramm einen eigenen
// Slice bekommt statt in "Sonstige Einnahmen" aufzugehen.
const REVENUE_SLICE_THRESHOLD = 0.05;

const REVENUE_PALETTE = ["#2E5E45", "#3E7C5B", "#6B8E4E", "#9C7A2A", "#B79A4B", "#5B7F62", "#7A9E6E", "#C2A46B"];

export default function App() {
  const datasets = useMemo(() => {
    const all = [...REVENUE_ITEMS, ...EXPENSE_ITEMS];
    const y25 = {}, y26 = {};
    all.forEach((i) => {
      y25[i.id] = i.v25;
      y26[i.id] = i.v26;
    });
    return { "2025": y25, "2026": y26 };
  }, []);

  const [baseYear, setBaseYear] = useState("2026");
  const [values, setValues] = useState(datasets["2026"]);

  const update = (id, v) => setValues((prev) => ({ ...prev, [id]: v }));
  const loadYear = (y) => {
    setBaseYear(y);
    setValues(datasets[y]);
  };
  const reset = () => setValues(datasets[baseYear]);

  const sums = useMemo(() => {
    const bySection = (list, section) =>
      list.filter((i) => i.section === section).reduce((s, i) => s + values[i.id], 0);
    const steuernBrutto = bySection(REVENUE_ITEMS, "steuern");
    const abzuege = bySection(REVENUE_ITEMS, "abzuege");
    const sonstige = bySection(REVENUE_ITEMS, "sonstige");
    const steuernNetto = steuernBrutto - abzuege;
    const einnahmen = steuernNetto + sonstige;
    const ausgaben = EXPENSE_ITEMS.reduce((s, i) => s + values[i.id], 0);
    const saldo = einnahmen - ausgaben;
    return { steuernBrutto, abzuege, sonstige, steuernNetto, einnahmen, ausgaben, saldo };
  }, [values]);

  const perSecond = (sums.ausgaben * 1e9) / (365 * 24 * 3600);
  const sealColor = sums.saldo < 0 ? "#9B2F22" : "#2E5E45";

  const revenueSegments = useMemo(() => {
    const threshold = sums.einnahmen * REVENUE_SLICE_THRESHOLD;
    const bigItems = REVENUE_ITEMS.filter((i) => i.section !== "abzuege" && values[i.id] >= threshold).sort(
      (a, b) => values[b.id] - values[a.id]
    );
    const bigSum = bigItems.reduce((s, i) => s + values[i.id], 0);
    const rest = Math.max(0, sums.einnahmen - bigSum);

    const segments = bigItems.map((i, idx) => ({
      key: i.id,
      label: i.label,
      value: values[i.id],
      color: REVENUE_PALETTE[idx % REVENUE_PALETTE.length],
      anchorId: rowAnchor(i.id),
    }));
    if (rest > 0) {
      segments.push({ key: "sonstige-rest", label: "Sonstige Einnahmen", value: rest, color: "#B8AE8C" });
    }
    return segments;
  }, [values, sums.einnahmen]);

  const expenseSegments = useMemo(
    () =>
      EXPENSE_SECTIONS.map((s) => ({
        ...s,
        value: EXPENSE_ITEMS.filter((i) => i.section === s.key).reduce((sum, i) => sum + values[i.id], 0),
        anchorId: sectionAnchor(s.key),
      })),
    [values]
  );

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-24 pt-8 md:pt-12">
        <header className="mb-6">
          <p className="font-mono text-xs tracking-widest uppercase text-muted">
            Bundeshaushalt · Ist 2025 im Vergleich zum Plan 2026
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mt-1">
            Der Bundeshaushalt zum Selbst-Rechnen
          </h1>
          <p className="font-body text-sm md:text-base mt-3 max-w-2xl text-muted">
            Ausgangswerte: BMF-Monatsbericht Februar 2026 ("Sollbericht 2026"). Wählen Sie ein
            Basisjahr und verschieben Sie die Regler, um eigene Szenarien durchzuspielen.
          </p>
          <div className="flex gap-2 mt-4">
            {["2025", "2026"].map((y) => (
              <button
                key={y}
                onClick={() => loadYear(y)}
                className={
                  "font-display text-xs uppercase tracking-wide px-4 py-2 rounded-full border border-ink " +
                  (baseYear === y ? "bg-ink text-card" : "bg-transparent text-ink")
                }
              >
                {y === "2025" ? "2025 (Ist)" : "2026 (Plan)"}
              </button>
            ))}
          </div>
        </header>

        <div className="rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 mb-8 bg-card border border-line">
          <div className="seal" style={{ "--sealcolor": sealColor }}>
            <div className="text-center px-2">
              <div className="font-display text-xs uppercase tracking-wide" style={{ color: sealColor }}>
                {sums.saldo < 0 ? "Neue Schulden" : "Überschuss"}
              </div>
              <div className="font-mono text-2xl font-bold" style={{ color: sealColor }}>
                {fmt(Math.abs(sums.saldo))}
              </div>
              <div className="font-mono text-xs" style={{ color: sealColor }}>
                Mrd. € · Basis {baseYear}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 flex-1 w-full">
            <div>
              <div className="font-mono text-xs uppercase tracking-wide text-muted">Einnahmen</div>
              <div className="font-mono text-xl font-semibold text-ledgerGreen">
                {fmt(sums.einnahmen)} <span className="text-sm font-normal">Mrd. €</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-wide text-muted">Ausgaben</div>
              <div className="font-mono text-xl font-semibold text-slateBlue">
                {fmt(sums.ausgaben)} <span className="text-sm font-normal">Mrd. €</span>
              </div>
            </div>
            <div className="col-span-2">
              <p className="font-body text-xs text-muted">
                Das entspricht rund {fmt(perSecond, 0)} € Ausgaben — jede Sekunde. Amtlicher Saldo:
                2025 Ist {fmt(OFFICIAL_SALDO["2025"])} Mrd. € · 2026 Soll {fmt(OFFICIAL_SALDO["2026"])} Mrd. €.
              </p>
            </div>
          </div>

          <button
            onClick={reset}
            className="font-display text-xs uppercase tracking-wide px-4 py-2 rounded-full shrink-0 border border-ink text-ink bg-transparent"
          >
            Zurücksetzen
          </button>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4">Zusammensetzung (gr&ouml;&szlig;te Positionen)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DonutChart title="Einnahmen" segments={revenueSegments} total={sums.einnahmen} />
            <DonutChart title="Ausgaben" segments={expenseSegments} total={sums.ausgaben} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
          <section>
            <h2 className="font-display text-lg font-semibold mb-1">Einnahmen</h2>
            <p className="font-body text-xs mb-4 text-muted">Basis: {baseYear}.</p>
            <SearchField items={REVENUE_ITEMS} placeholder="Einnahmen durchsuchen… (z.B. „UmsatzSt“)" />
            <BudgetGroup items={REVENUE_ITEMS} section="steuern" values={values} onChange={update} color="#2E5E45" total={sums.einnahmen} title="Steuern (Bundesanteil)" />
            <BudgetGroup items={REVENUE_ITEMS} section="abzuege" values={values} onChange={update} color="#9C7A2A" total={sums.einnahmen} title="Abzüge vor dem Bundeshaushalt" description="Wird von den Steuereinnahmen abgezogen." negative />
            <BudgetGroup items={REVENUE_ITEMS} section="sonstige" values={values} onChange={update} color="#2E5E45" total={sums.einnahmen} title="Sonstige Einnahmen" />
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-1">Ausgaben</h2>
            <p className="font-body text-xs mb-4 text-muted">Nach Aufgabenbereich (Funktionenplan). Basis: {baseYear}.</p>
            <SearchField items={EXPENSE_ITEMS} placeholder="Ausgaben durchsuchen… (z.B. „Verteidigung“)" />
            <BudgetGroup items={EXPENSE_ITEMS} section="dienste" values={values} onChange={update} color="#35566E" total={sums.ausgaben} title="Allgemeine Dienste & Sicherheit" />
            <BudgetGroup items={EXPENSE_ITEMS} section="bildung" values={values} onChange={update} color="#35566E" total={sums.ausgaben} title="Bildung, Wissenschaft, Forschung" />
            <BudgetGroup items={EXPENSE_ITEMS} section="soziales" values={values} onChange={update} color="#35566E" total={sums.ausgaben} title="Soziale Sicherung, Familie, Arbeitsmarkt" description="Größter Ausgabenblock — Rente, Gesundheit, Bürgergeld u. a." />
            <BudgetGroup items={EXPENSE_ITEMS} section="wirtschaft" values={values} onChange={update} color="#35566E" total={sums.ausgaben} title="Wirtschaft, Umwelt, Wohnen, Landwirtschaft" />
            <BudgetGroup items={EXPENSE_ITEMS} section="verkehr" values={values} onChange={update} color="#35566E" total={sums.ausgaben} title="Verkehr" />
            <BudgetGroup items={EXPENSE_ITEMS} section="finanz" values={values} onChange={update} color="#35566E" total={sums.ausgaben} title="Finanzwirtschaft & Zinsen" />
          </section>
        </div>

        <Explanations />

        <div className="mt-8">
        <InfoPanel title="Wie transparent sind Rente & Sozialversicherung im Bundeshaushalt?">
          <p>
            Nur bedingt. Der Bundeshaushalt zeigt bei „Rentenversicherung" nur, was der{" "}
            <strong className="text-ink">Bund an Zuschüssen zahlt</strong> — 123,8 Mrd. € 2026
            (2025: 118,8 Mrd. €). Nicht sichtbar sind die Pflichtbeiträge von rund 21 Mio.
            Beschäftigten und ihren Arbeitgebern (Beitragssatz 18,6 %), die direkt an die
            Deutsche Rentenversicherung fließen. 2023 lagen die gesamten Rentenausgaben bei
            340,4 Mrd. € — deutlich mehr als im Bundeshaushalt sichtbar.
          </p>
          <p className="text-ink">Weiterführende Quellen:</p>
          <ul className="space-y-1.5 list-none m-0 p-0">
            <li>— <strong className="text-ink">Rentenversicherungsbericht</strong> (jährlich, § 154 SGB VI)</li>
            <li>— <strong className="text-ink">Deutsche Rentenversicherung Bund</strong> ("Aktuelle Daten", statistik-rente.de)</li>
            <li>— <strong className="text-ink">Sozialbudget</strong> (BMAS)</li>
            <li>— <strong className="text-ink">GKV-Schätzerkreis</strong> für die Krankenversicherung</li>
            <li>— <strong className="text-ink">Haushalt der Bundesagentur für Arbeit</strong></li>
            <li>— <strong className="text-ink">Bundesrechnungshof</strong>-Prüfberichte zur Rentenversicherung</li>
          </ul>
        </InfoPanel>

        <InfoPanel title="Wer zahlt eigentlich was? Bund, Länder, Kommunen">
          <p>
            Viele Aufgaben, die man intuitiv „dem Staat" zuordnet, finanzieren in Deutschland
            gar nicht der Bund, sondern die 16 Bundesländer oder die Kommunen:
          </p>
          <ul className="space-y-2 list-none m-0 p-0">
            <li>— <strong className="text-ink">Polizei:</strong> Landespolizei ist Ländersache.</li>
            <li>— <strong className="text-ink">Feuerwehr:</strong> fast vollständig kommunal finanziert.</li>
            <li>— <strong className="text-ink">Finanzämter:</strong> sind Landesbehörden.</li>
            <li>— <strong className="text-ink">Schulen:</strong> Bildung ist Ländersache.</li>
            <li>— <strong className="text-ink">Krankenhäuser:</strong> Länder (Investitionen) und Krankenkassen (Betrieb).</li>
          </ul>
        </InfoPanel>
        </div>

        <Sources />

        <footer className="mt-8 pt-6 border-t border-line">
          <p className="font-body text-xs text-muted">
            Erläuterungen und Quellen: siehe Abschnitte{" "}
            <a href="#erlaeuterungen" className="underline decoration-dotted hover:decoration-solid">„Erläuterungen“</a>{" "}
            und <a href="#quellen" className="underline decoration-dotted hover:decoration-solid">„Quellen“</a>.
            Dieses Werkzeug dient der Veranschaulichung.
            &copy; 2026 Georg Stach
          </p>
        </footer>
      </div>
    </div>
  );
}
