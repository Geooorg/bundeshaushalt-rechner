import { fmt, safeShare, sliderMax, deltaLabel, rowAnchor } from "../utils.js";
import { explanationAnchor, explanationNumber } from "../data/explanations.js";

export default function Row({ item, value, onChange, color, total, negative }) {
  const max = sliderMax(item);
  const pct = Math.min(100, (value / max) * 100);
  const share = safeShare(value, total);

  return (
    <div id={rowAnchor(item.id)} className="py-3 border-b border-line scroll-mt-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-sm font-medium text-ink">{item.label}</span>
            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-tagbg text-muted">
              {item.tag}
            </span>
            {item.explainKey && (
              <a
                href={`#${explanationAnchor(item.explainKey)}`}
                title="Erläuterung dazu"
                className="font-mono text-xs px-1.5 py-0.5 rounded-full border border-line text-muted hover:text-ink hover:border-ink"
              >
                Erläuterung [{explanationNumber(item.explainKey)}]
              </a>
            )}
          </div>
          {item.note && <p className="font-body text-xs mt-0.5 text-muted">{item.note}</p>}
          <p className="font-mono text-xs mt-1 text-muted">
            25: {fmt(item.v25)} · 26: {fmt(item.v26)} ({deltaLabel(item.v25, item.v26)})
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-sm font-semibold" style={{ color }}>
            {negative ? "\u2212 " : ""}
            {fmt(value)}
          </div>
          <div className="font-mono text-xs text-muted">{fmt(share, 1)} %</div>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={0.1}
        value={value}
        onChange={(e) => onChange(item.id, parseFloat(e.target.value))}
        className="w-full mt-2 range-input"
        style={{ background: `linear-gradient(to right, ${color} ${pct}%, #DAD6C6 ${pct}%)` }}
        aria-label={item.label}
      />
    </div>
  );
}
