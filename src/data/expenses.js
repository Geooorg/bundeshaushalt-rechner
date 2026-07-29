// v25 = Ist 2025 (vorläufiger Haushaltsabschluss) · v26 = Soll 2026 (Haushaltsgesetz 2026)
// Alle Werte in Mrd. Euro, gegliedert nach Funktionenplan (Aufgabenbereiche), nicht nach Einzelplan/Ressort.

export const EXPENSE_ITEMS = [
  { id: "fuehrung", section: "dienste", label: "Politische Führung und zentrale Verwaltung", tag: "Funktion 01", v25: 24.117, v26: 26.003, sourceKey: "bmfSollbericht2026" },
  { id: "auswaertig", section: "dienste", label: "Auswärtige Angelegenheiten", tag: "Funktion 02", v25: 15.113, v26: 15.351, sourceKey: "bmfSollbericht2026" },
  { id: "verteidigung", section: "dienste", label: "Verteidigung", tag: "Funktion 03", v25: 66.999, v26: 93.457, note: "Bundeswehr: Personal, Betrieb, Beschaffung — größter Zuwachs im Haushalt 2026", sourceKey: "bmfSollbericht2026" },
  { id: "sicherheit", section: "dienste", label: "Öffentliche Sicherheit und Ordnung", tag: "Funktion 04", v25: 8.635, v26: 9.938, note: "Davon Bundespolizei/BKA: 6,4 Mrd. € (2025) / 7,0 Mrd. € (2026). Landespolizei ist darin nicht enthalten.", sourceKey: "bmfSollbericht2026" },
  { id: "finanzverwaltung", section: "dienste", label: "Finanzverwaltung", tag: "Funktion 06", v25: 7.577, v26: 7.502, note: "Bundeszoll- und Steuerverwaltung — die Finanzämter selbst sind Landesbehörden", sourceKey: "bmfSollbericht2026" },
  { id: "sonstDienste", section: "dienste", label: "Sonstige allgemeine Dienste", tag: "Rest", v25: 0.793, v26: 0.889, note: "Nicht einzeln ausgewiesene Positionen (Differenz zur Gruppensumme)", sourceKey: "bmfSollbericht2026", explainKey: "restPositionen" },

  { id: "bildung", section: "bildung", label: "Bildung, Wissenschaft, Forschung, Kultur", tag: "Funktion 1", v25: 30.343, v26: 30.156, sourceKey: "bmfSollbericht2026" },

  { id: "rente", section: "soziales", label: "Rentenversicherung (allgemein + knappschaftlich)", tag: "Funktion 22", v25: 118.800, v26: 123.821, note: "Bundeszuschüsse und Erstattungen — nicht die Rentenzahlungen selbst.", sourceKey: "bmfSollbericht2026", explainKey: "rente" },
  { id: "kranken", section: "soziales", label: "Krankenversicherung", tag: "Funktion 22", v25: 18.365, v26: 18.388, note: "Bundeszuschuss an den Gesundheitsfonds (fest: 14,5 Mrd. €) zzgl. Darlehen", sourceKey: "bmfSollbericht2026" },
  { id: "alv", section: "soziales", label: "Arbeitslosenversicherung", tag: "Funktion 22", v25: 1.437, v26: 3.971, note: "Darlehen des Bundes an die Bundesagentur für Arbeit wegen Defizits", sourceKey: "bmfSollbericht2026" },
  { id: "pv", section: "soziales", label: "Pflegeversicherung", tag: "Funktion 22", v25: 0.500, v26: 3.200, note: "Darlehen an den Ausgleichsfonds der sozialen Pflegeversicherung", sourceKey: "bmfSollbericht2026" },
  { id: "landwirteRente", section: "soziales", label: "Alterssicherung der Landwirte", tag: "Funktion 22", v25: 2.399, v26: 2.425, sourceKey: "bmfSollbericht2026" },
  { id: "sonstSV", section: "soziales", label: "Sonstige Sozialversicherungen", tag: "Funktion 22", v25: 6.514, v26: 6.710, sourceKey: "bmfSollbericht2026" },
  { id: "familie", section: "soziales", label: "Familienhilfe, Wohlfahrtspflege", tag: "Funktion 23", v25: 14.770, v26: 15.205, note: "U. a. Elterngeld: 7,1 Mrd. € (2025) / 7,5 Mrd. € (2026)", sourceKey: "bmfSollbericht2026" },
  { id: "kriegsfolgen", section: "soziales", label: "Soziale Entschädigung (Kriegsfolgen)", tag: "Funktion 24", v25: 2.334, v26: 2.394, sourceKey: "bmfSollbericht2026" },
  { id: "buergergeld", section: "soziales", label: "Bürgergeld (SGB II)", tag: "Funktion 251", v25: 29.049, v26: 28.050, sourceKey: "bmfSollbericht2026" },
  { id: "kdu", section: "soziales", label: "Kosten der Unterkunft (SGB II)", tag: "Funktion 252", v25: 12.458, v26: 13.000, sourceKey: "bmfSollbericht2026" },
  { id: "amp", section: "soziales", label: "Aktive Arbeitsmarktpolitik & sonstige Grundsicherung", tag: "Funktion 253/259", v25: 10.082, v26: 10.428, sourceKey: "bmfSollbericht2026" },
  { id: "grundsicherungAlter", section: "soziales", label: "Grundsicherung im Alter und bei Erwerbsminderung", tag: "Funktion 28", v25: 11.827, v26: 12.450, note: "Komplett vom Bund an die Kommunen erstattet", sourceKey: "bmfSollbericht2026" },
  { id: "sonstSoziales", section: "soziales", label: "Sonstige soziale Angelegenheiten", tag: "Funktion 29", v25: 1.186, v26: 1.141, sourceKey: "bmfSollbericht2026" },
  { id: "sonstSozialSicherung", section: "soziales", label: "Weitere soziale Leistungen", tag: "Rest", v25: 4.387, v26: 3.907, note: "Nicht einzeln ausgewiesene Positionen, u. a. Kinderbetreuung", sourceKey: "bmfSollbericht2026", explainKey: "restPositionen" },

  { id: "gesundheitUmwelt", section: "wirtschaft", label: "Gesundheit, Umwelt, Sport, Erholung", tag: "Funktion 3", v25: 4.892, v26: 5.104, sourceKey: "bmfSollbericht2026" },
  { id: "wohnen", section: "wirtschaft", label: "Wohnungswesen, Städtebau", tag: "Funktion 4", v25: 4.490, v26: 4.639, sourceKey: "bmfSollbericht2026" },
  { id: "landwirtschaft", section: "wirtschaft", label: "Landwirtschaft, Ernährung, Forsten", tag: "Funktion 5", v25: 1.258, v26: 1.692, sourceKey: "bmfSollbericht2026" },
  { id: "energie", section: "wirtschaft", label: "Energie- und Wasserwirtschaft, Gewerbe", tag: "Funktion 6", v25: 24.305, v26: 25.292, sourceKey: "bmfSollbericht2026" },

  { id: "strassen", section: "verkehr", label: "Straßen (Autobahnen, Bundesstraßen)", tag: "Funktion 71", v25: 7.429, v26: 7.695, sourceKey: "bmfSollbericht2026" },
  { id: "wasserstrassen", section: "verkehr", label: "Wasserstraßen, Häfen, Schifffahrt", tag: "Funktion 72", v25: 2.541, v26: 2.291, sourceKey: "bmfSollbericht2026" },
  { id: "bahn", section: "verkehr", label: "Eisenbahnen und ÖPNV", tag: "Funktion 73", v25: 15.109, v26: 5.477, note: "U. a. Zuschüsse an die Deutsche Bahn — 2025 inkl. 8,3 Mrd. € Eigenkapitalzuführung, die 2026 entfällt", sourceKey: "bmfSollbericht2026" },
  { id: "luftfahrt", section: "verkehr", label: "Luftfahrt und sonstiges Verkehrswesen", tag: "Funktion 74", v25: 4.171, v26: 4.279, sourceKey: "bmfSollbericht2026" },
  { id: "sonstVerkehr", section: "verkehr", label: "Sonstiges Verkehrswesen", tag: "Rest", v25: 1.621, v26: 1.661, sourceKey: "bmfSollbericht2026", explainKey: "restPositionen" },

  { id: "finanzwirtschaft", section: "finanz", label: "Finanzwirtschaft", tag: "Funktion 8", v25: 39.779, v26: 38.025, note: "Davon Zinsausgaben für die Bundesschuld: 29,9 Mrd. € (2025) / 30,2 Mrd. € (2026)", sourceKey: "bmfSollbericht2026" },
];
