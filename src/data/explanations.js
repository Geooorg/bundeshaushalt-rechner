// Erläuterungen zu Datenzeilen, die im Rechner nur mit einem kurzen Hinweis
// (z. B. „Rest") auskommen, aber einen ausführlicheren Kontext brauchen. Zeilen
// verweisen per `explainKey` hierher; siehe Row.jsx und Explanations.jsx.

export const EXPLANATIONS = [
  {
    key: "rente",
    title: "Rentenversicherung: nur der Bundeszuschuss, nicht die Rentenzahlungen",
    text:
      "Die Zeile zeigt ausschließlich, was der Bund an Zuschüssen und Erstattungen an die " +
      "Rentenversicherung zahlt (118,8 Mrd. € 2025 / 123,8 Mrd. € 2026). Nicht enthalten sind " +
      "die Pflichtbeiträge von rund 21 Mio. Beschäftigten und ihren Arbeitgebern " +
      "(Beitragssatz 18,6 %), die direkt an die Deutsche Rentenversicherung fließen. 2023 lagen " +
      "die gesamten Rentenausgaben bei 340,4 Mrd. € — deutlich mehr als im Bundeshaushalt " +
      "sichtbar. Details in der Infobox „Wie transparent sind Rente & Sozialversicherung im " +
      "Bundeshaushalt?“ oben.",
  },
  {
    key: "restPositionen",
    title: "„Sonstige/Rest“-Zeilen: Differenz zur amtlichen Gruppensumme",
    text:
      "Manche Aufgabenbereiche sind laut BMF nur „auszugsweise“ dargestellt. Wo die einzeln " +
      "benannten Unterpositionen einer Gruppe nicht exakt zur amtlichen Gruppensumme " +
      "aufaddieren, macht diese Zeile die Differenz transparent, statt sie zu verstecken.",
  },
];

export const explanationAnchor = (key) => `erlaeuterung-${key}`;

export const explanationNumber = (key) => EXPLANATIONS.findIndex((e) => e.key === key) + 1;
