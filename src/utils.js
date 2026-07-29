export const fmt = (n, d = 1) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

export const safeShare = (v, total) => (total > 0 ? (v / total) * 100 : 0);

export const sliderMax = (item) => Math.ceil((Math.max(item.v25, item.v26) * 2.3 + 4) / 5) * 5;

export const deltaLabel = (v25, v26) => {
  if (v25 === 0 && v26 === 0) return "–";
  if (v25 === 0) return "neu";
  const d = ((v26 - v25) / v25) * 100;
  return `${d > 0 ? "+" : ""}${fmt(d, 1)} %`;
};
