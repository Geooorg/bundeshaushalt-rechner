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
  {
    key: "soziales",
    label: "Soziale Sicherung, Familie, Arbeitsmarkt",
    color: "#2E5E45",
    description: "Größter Ausgabenblock — Rente, Gesundheit, Bürgergeld u. a.",
  },
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
  const [openAusgaben, setOpenAusgaben] = useState(() =>
    Object.fromEntries(EXPENSE_SECTIONS.map((s) => [s.key, false]))
  );
  const [openEinnahmen, setOpenEinnahmen] = useState({ sonstige: false, abzuege: false });

  const update = (id, v) => setValues((prev) => ({ ...prev, [id]: v }));
  const toggleAusgabenSection = (key) => setOpenAusgaben((prev) => ({ ...prev, [key]: !prev[key] }));
  const expandAusgabenSection = (key) =>
    setOpenAusgaben((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  const toggleEinnahmenSection = (key) => setOpenEinnahmen((prev) => ({ ...prev, [key]: !prev[key] }));
  const expandEinnahmenSection = (key) =>
    setOpenEinnahmen((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  const expandForRevenueSegment = (segment) => {
    const item = REVENUE_ITEMS.find((i) => i.id === segment.key);
    if (item) expandEinnahmenSection(item.section);
  };
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

  // Größte Ausgabenblöcke zuerst — sowohl in der Gruppenliste als auch im Kuchendiagramm.
  const sortedExpenseSections = useMemo(() => {
    const withTotals = EXPENSE_SECTIONS.map((s) => ({
      ...s,
      total: EXPENSE_ITEMS.filter((i) => i.section === s.key).reduce((sum, i) => sum + values[i.id], 0),
    }));
    return withTotals.sort((a, b) => b.total - a.total);
  }, [values]);

  const expenseSegments = useMemo(
    () =>
      sortedExpenseSections.map((s) => ({
        ...s,
        value: s.total,
        anchorId: sectionAnchor(s.key),
      })),
    [sortedExpenseSections]
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
            <DonutChart
              title="Einnahmen"
              segments={revenueSegments}
              total={sums.einnahmen}
              onBeforeJump={expandForRevenueSegment}
            />
            <DonutChart
              title="Ausgaben"
              segments={expenseSegments}
              total={sums.ausgaben}
              onBeforeJump={(segment) => expandAusgabenSection(segment.key)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
          <section>
            <div className="sticky top-0 z-10 bg-paper pt-2 pb-3 mb-1 border-b border-line">
              <h2 className="font-display text-lg font-semibold mb-1">Einnahmen</h2>
              <p className="font-body text-xs mb-4 text-muted">Basis: {baseYear}.</p>
              <SearchField
                items={REVENUE_ITEMS}
                placeholder="Einnahmen durchsuchen… (z.B. „UmsatzSt“)"
                onBeforeJump={(item) => expandEinnahmenSection(item.section)}
              />
            </div>
            <BudgetGroup items={REVENUE_ITEMS} section="steuern" values={values} onChange={update} color="#2E5E45" total={sums.einnahmen} title="Steuern (Bundesanteil)" />
            <BudgetGroup items={REVENUE_ITEMS} section="sonstige" values={values} onChange={update} color="#2E5E45" total={sums.einnahmen} title="Sonstige Einnahmen" collapsible open={openEinnahmen.sonstige} onToggle={() => toggleEinnahmenSection("sonstige")} />
            <BudgetGroup items={REVENUE_ITEMS} section="abzuege" values={values} onChange={update} color="#9C7A2A" total={sums.einnahmen} title="Abzüge vor dem Bundeshaushalt" description="Wird von den Steuereinnahmen abgezogen." negative collapsible open={openEinnahmen.abzuege} onToggle={() => toggleEinnahmenSection("abzuege")} />
          </section>

          <section>
            <div className="sticky top-0 z-10 bg-paper pt-2 pb-3 mb-1 border-b border-line">
              <h2 className="font-display text-lg font-semibold mb-1">Ausgaben</h2>
              <p className="font-body text-xs mb-4 text-muted">Nach Aufgabenbereich (Funktionenplan). Basis: {baseYear}.</p>
              <SearchField
                items={EXPENSE_ITEMS}
                placeholder="Ausgaben durchsuchen… (z.B. „Verteidigung“)"
                onBeforeJump={(item) => expandAusgabenSection(item.section)}
              />
            </div>
            {sortedExpenseSections.map((s) => (
              <BudgetGroup
                key={s.key}
                items={EXPENSE_ITEMS}
                section={s.key}
                values={values}
                onChange={update}
                color="#35566E"
                total={sums.ausgaben}
                title={s.label}
                description={s.description}
                collapsible
                open={openAusgaben[s.key]}
                onToggle={() => toggleAusgabenSection(s.key)}
              />
            ))}
          </section>
        </div>

        <Explanations />

        <div className="mt-8">
        <InfoPanel id="faq-tool-zweck" title="Wofür dient dieses Tool, und was kann ich mit den Reglern machen?">
          <p>
            Dieses Werkzeug macht den Bundeshaushalt 2025/2026 zum Anfassen: Statt abstrakter
            Milliardensummen in einer Tabelle sehen Sie jede Einnahme- und Ausgabeposition als
            verschiebbaren Regler. Ziel ist, ein Gefühl für die Größenordnungen zu bekommen — was
            wiegt wie viel im Vergleich zueinander, und wie hängen Einnahmen, Ausgaben und
            Neuverschuldung zusammen.
          </p>
          <p>
            Jeder Regler zeigt den amtlichen Wert einer Position (Ist 2025 oder Soll 2026, je nach
            gewähltem Basisjahr) und lässt sich frei verschieben. Bewegen Sie einen Regler, ändert
            sich sofort: die Summen oben (Einnahmen, Ausgaben, Saldo/Neuschulden), der Anteil der
            jeweiligen Gruppe im Kuchendiagramm sowie der Prozentanteil an der Gesamtsumme neben
            dem Regler selbst. So lassen sich eigene Szenarien durchspielen — etwa: „Was, wenn ich
            die Verteidigungsausgaben um 10 Mrd. € kürze — wie stark verändert das den Saldo, und
            wie groß ist dieser Betrag im Vergleich zu anderen Posten?“ Mit „Zurücksetzen“ kehren
            Sie jederzeit zu den amtlichen Werten des gewählten Basisjahres zurück; die amtlichen
            Zahlen selbst werden dabei nie verändert.
          </p>
        </InfoPanel>

        <InfoPanel id="faq-zahlen-quelle" title="Woher kommen die Zahlen, und wie verlässlich sind die Soll-Werte für 2026?">
          <p>
            Alle Zahlen stammen aus dem BMF-Monatsbericht Februar 2026 („Sollbericht 2026“, siehe
            Abschnitt „Quellen“ unten). „Ist 2025“ ist der vorläufige Haushaltsabschluss — was
            tatsächlich eingenommen und ausgegeben wurde. „Soll 2026“ ist dagegen der im
            Haushaltsgesetz 2026 beschlossene Planwert: das, was der Bundestag für das laufende
            Jahr bewilligt hat, nicht das, was am Jahresende tatsächlich verausgabt sein wird.
          </p>
          <p>
            Solche Planwerte können sich im Jahresverlauf noch ändern, etwa durch einen
            Nachtragshaushalt oder über- bzw. unterplanmäßige Ausgaben. Erst der spätere
            Kassenabschluss zeigt die endgültigen Ist-Zahlen — so wie „Ist 2025“ hier bereits ein
            solcher (vorläufiger) Abschluss ist.
          </p>
        </InfoPanel>

        <InfoPanel id="faq-ist-soll-abweichungen" title="Warum unterscheiden sich Ist 2025 und Soll 2026 bei einzelnen Posten teils stark?">
          <p>
            Nicht jede große Veränderung zwischen 25 und 26 bedeutet eine politische
            Kurskorrektur — oft stecken Basis- oder Einmaleffekte dahinter. Beispiel Eisenbahnen
            und ÖPNV: Der Wert sinkt von 15,1 Mrd. € (2025) auf 5,5 Mrd. € (2026), weil 2025
            einmalig eine Eigenkapitalzuführung von 8,3 Mrd. € an die Deutsche Bahn enthalten war,
            die 2026 entfällt. Umgekehrt kann ein Sprung nach oben eine neue Belastung markieren,
            etwa bei Arbeitslosen- und Pflegeversicherung, wo die Darlehen des Bundes 2026 deutlich
            steigen.
          </p>
          <p>
            Ein Blick auf die Notiz unter der jeweiligen Zeile (falls vorhanden) verrät meist den
            Grund für ungewöhnlich große Sprünge.
          </p>
        </InfoPanel>

        <InfoPanel id="faq-neuschulden-zinsen" title="Wie berechnen sich die Neuschulden? Wie hoch ist der Anteil der Zinsen?">
          <p>
            Die „Neuen Schulden“ oben im Siegel sind schlicht die Differenz aus Einnahmen und
            Ausgaben (Saldo). Für 2026 (Plan): 426,4 Mrd. € Einnahmen − 524,5 Mrd. € Ausgaben =
            −98,1 Mrd. €. Diese Deckungslücke muss der Bund über neue Kredite am Kapitalmarkt
            schließen (Nettokreditaufnahme). Verschieben Sie einen Regler, ändert sich der Saldo im
            Siegel oben live mit.
          </p>
          <p>
            Ein Teil der Ausgaben ist selbst eine Folge früherer Schulden: die Zinsen für die
            Bundesschuld. Sie stecken in der Gruppe „Finanzwirtschaft & Zinsen“ und betragen 30,2
            Mrd. € (2026) bzw. 29,9 Mrd. € (2025) — rund 80 % dieser gesamten Gruppe. Gemessen an
            den gesamten Ausgaben sind das knapp 6 %, gemessen an den neuen Schulden aber fast ein
            Drittel: Von jedem Euro, den der Bund 2026 neu leiht, gehen rund 31 Cent allein für
            Zinsen auf bereits bestehende Schulden drauf.
          </p>
        </InfoPanel>

        <InfoPanel id="faq-rente-transparenz" title="Wie transparent sind Rente & Sozialversicherung im Bundeshaushalt?">
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

        <InfoPanel id="faq-rentenpaket-kosten" title="Wie teuer war die letzte Rentenerhöhung — und was hat die aktuelle Rentenreform gekostet?">
          <p>
            Zwei verschiedene Dinge werden hier oft vermischt. Die reguläre Rentenanpassung zum 1.
            Juli 2026 (+4,24 %, Standardrente +77,85 €/Monat) ist keine politische Entscheidung im
            engeren Sinn, sondern folgt einer gesetzlich vorgeschriebenen Formel, die sich vor
            allem an der Lohnentwicklung orientiert — das passiert jedes Jahr, unabhängig davon,
            wer gerade Kanzler ist.
          </p>
          <p>
            Das eigentliche politische Rentenpaket 2025 der Regierung Merz (im Dezember 2025 von
            Bundestag und Bundesrat beschlossen) ist da schon eher gemeint und enthält mehrere
            kostenträchtige Maßnahmen. Größter Posten ist die{" "}
            <strong className="text-ink">Haltelinie beim Rentenniveau</strong> (48 % bis 2031,
            Nachhaltigkeitsfaktor ausgesetzt): Laut Regierungsschätzung steigt der dafür nötige
            zusätzliche Bundeszuschuss von 3,6 Mrd. € (2029) über 9,3 Mrd. € (2030) auf 11 Mrd. €
            (2031). Kritiker aus der Unionsfraktion selbst rechnen damit, dass die Kosten nach 2031
            auf rund 15 Mrd. € jährlich weiterlaufen, falls die Haltelinie nicht ausläuft. Dazu
            kommen die <strong className="text-ink">Aktivrente</strong> (steuerfreier
            Hinzuverdienst bis 2.000 €/Monat für Beschäftigte über der Regelaltersgrenze, ab 2026:
            laut BMAS rund 890 Mio. € jährliche Entlastung), eine Ausweitung der{" "}
            <strong className="text-ink">Mütterrente</strong> sowie die neue{" "}
            <strong className="text-ink">Frühstart-Rente</strong> (10 €/Monat in ein
            kapitalgedecktes Konto für 6- bis 18-Jährige) — für beide gibt es keine offizielle
            Einzelbezifferung.
          </p>
          <p>
            Ein von der arbeitgebernahen Initiative Neue Soziale Marktwirtschaft (INSM) in Auftrag
            gegebenes Prognos-Gutachten kommt für das gesamte Paket auf Gesamtkosten von rund 480
            Mrd. € bis 2050 — deutlich mehr als die von der Regierung selbst genannten
            Einzeljahres-Beträge. Solche Langfrist-Schätzungen hängen stark von Annahmen zu Lohn-,
            Preis- und Bevölkerungsentwicklung ab, stammen zudem von einer wirtschaftsnahen,
            kritischen Quelle und sollten daher als Bandbreite, nicht als feste Zahl gelesen
            werden.
          </p>
          <p>
            Bezug zu diesem Rechner: Der Bundeszuschuss zur Rentenversicherung (123,8 Mrd. € 2026,
            siehe Zeile „Rentenversicherung" oben) steigt zwar auch 2026 gegenüber 2025 — das liegt
            aber vor allem an der allgemeinen Lohn- und Rentenentwicklung. Die zusätzlichen Kosten
            der Haltelinie beim Rentenniveau schlagen laut Regierungsschätzung erst ab 2029
            spürbar zu Buche und stecken in diesem 2026er-Datensatz daher noch kaum drin.
          </p>
        </InfoPanel>

        <InfoPanel id="faq-wer-zahlt-was" title="Wer zahlt eigentlich was? Bund, Länder, Kommunen">
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

        <InfoPanel id="faq-staatsausgaben-gesamt" title="Warum ist der Bundeshaushalt nur ein Teil der gesamten Staatsausgaben in Deutschland?">
          <p>
            Der hier gezeigte Bundeshaushalt ist nur eine von mehreren staatlichen Kassen. Daneben
            gibt es die 16 Länderhaushalte, die kommunalen Haushalte (Städte, Gemeinden,
            Landkreise) sowie die Sozialversicherungsträger — gesetzliche Renten-, Kranken-,
            Pflege- und Arbeitslosenversicherung —, die jeweils eigene, vom Bundeshaushalt
            getrennte Haushalte mit eigenen Beitragseinnahmen führen.
          </p>
          <p>
            Der Bund zahlt diesen Sozialversicherungsträgern zwar Zuschüsse (die im Bundeshaushalt
            als Ausgabe erscheinen, siehe „Soziale Sicherung“ oben) — die eigentlichen
            Versicherungsleistungen, etwa die tatsächlich ausgezahlten Renten, laufen aber über
            deren eigene Haushalte und tauchen im Bundeshaushalt nicht auf. Wer die gesamten
            Staatsausgaben Deutschlands sehen will, müsste Bund, Länder, Kommunen und
            Sozialversicherung zusammenrechnen — den „Staatshaushalt“ im gesamtstaatlichen Sinne,
            wie ihn z. B. das Statistische Bundesamt ausweist.
          </p>
        </InfoPanel>

        <InfoPanel id="faq-sondervermoegen" title="Tauchen die Sondervermögen für Bundeswehr und Infrastruktur hier im Haushalt auf?">
          <p>
            Nein. Sondervermögen sind eigene Nebenhaushalte mit eigener Kreditaufnahme, die
            außerhalb des „Kernhaushalts“ laufen — und genau diesen Kernhaushalt zeigt dieser
            Rechner (524,5 Mrd. € Gesamtausgaben 2026 entsprechen exakt der amtlichen
            Kernhaushalts-Summe, ohne Sondervermögen).
          </p>
          <p>
            <strong className="text-ink">Sondervermögen Bundeswehr</strong> (2022 beschlossen, 100
            Mrd. €, mittlerweile weitgehend verplant): 2026 fließen daraus zusätzlich 25,5 Mrd. €
            in die Streitkräfte — obendrauf auf die 82,7 Mrd. € des regulären Wehretats (Einzelplan
            14). Zusammengerechnet ergibt das die in den Medien oft genannten rund 108 Mrd. €
            Verteidigungsausgaben 2026. Die „Verteidigung“-Zeile in diesem Rechner (93,5 Mrd. €
            2026) zeigt dagegen nur den Kernhaushalts-Anteil nach Funktionenplan — der zwar etwas
            breiter gefasst ist als Einzelplan 14 allein (er schließt einige verteidigungsnahe
            Posten aus anderen Einzelplänen mit ein), aber vollständig ohne die
            Sondervermögen-Mittel auskommt.
          </p>
          <p>
            <strong className="text-ink">Sondervermögen Infrastruktur und Klimaneutralität</strong>{" "}
            (im März 2025 beschlossen, 500 Mrd. € Gesamtvolumen über gut ein Jahrzehnt): 2026 werden
            daraus 58,1 Mrd. € Kredite aufgenommen, davon 21,3 Mrd. € zusätzlich für
            Verkehrsinvestitionen. Die „Verkehr“-Zeile hier (21,4 Mrd. €) zeigt auch dabei nur den
            Kernhaushalt — real kommt noch einmal etwa derselbe Betrag aus dem Sondervermögen oben
            drauf.
          </p>
          <p>
            Politisch genutzt werden Sondervermögen vor allem, weil ihre Kreditaufnahme von der
            grundgesetzlichen Schuldenbremse ausgenommen ist: Sie erlauben höhere Investitionen, ohne
            dass sie auf den Kernhaushalts-Saldo — und damit die „Neuen Schulden“ oben im Siegel —
            durchschlagen. Wer die tatsächliche Gesamtverschuldung des Bundes sehen will, muss
            Kernhaushalt und Sondervermögen zusammen betrachten.
          </p>
        </InfoPanel>

        <InfoPanel id="faq-stellschrauben" title="Welche Stellschrauben gäbe es, um Ausgaben zu senken oder Einnahmen zu erhöhen?">
          <p>
            Eine unvollständige, unbewertete Übersicht über Ansatzpunkte, die in der politischen
            Debatte immer wieder genannt werden — dieses Tool nimmt dazu keine Position, sondern
            liefert nur die Größenordnungen zum Einordnen:
          </p>
          <p className="text-ink">Ausgabenseite:</p>
          <ul className="space-y-1.5 list-none m-0 p-0">
            <li>— <strong className="text-ink">Subventionsabbau</strong>, z. B. bei klima- oder umweltschädlichen Subventionen</li>
            <li>— <strong className="text-ink">Aufgabenkritik</strong> beim Leistungsniveau einzelner Sozialleistungen</li>
            <li>— <strong className="text-ink">Verwaltungseffizienz</strong> und Bürokratieabbau</li>
            <li>— <strong className="text-ink">Priorisierung</strong> innerhalb einzelner Ressorts, z. B. Beschaffungsvorhaben strecken</li>
          </ul>
          <p className="text-ink">Einnahmenseite:</p>
          <ul className="space-y-1.5 list-none m-0 p-0">
            <li>— <strong className="text-ink">Steuersatz-Änderungen</strong>, z. B. beim Einkommensteuer-Spitzensatz</li>
            <li>— <strong className="text-ink">Abbau von Steuervergünstigungen</strong>, etwa beim Ehegattensplitting oder Dienstwagenprivileg</li>
            <li>— <strong className="text-ink">Neue oder wiedereingeführte Steuern</strong>, z. B. eine Vermögensteuer</li>
            <li>— <strong className="text-ink">Verbreiterung der Bemessungsgrundlage</strong> und bessere Bekämpfung von Steuervermeidung</li>
          </ul>
          <p>
            Jede dieser Optionen hat eigene wirtschaftliche und verteilungspolitische
            Nebenwirkungen, die hier bewusst nicht bewertet werden — probieren Sie die
            Größenordnungen stattdessen selbst mit den Reglern oben aus.
          </p>
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
