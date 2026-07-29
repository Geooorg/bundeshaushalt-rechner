import { fmt } from "../utils.js";

const R = 60;
const STROKE = 22;
const CIRC = 2 * Math.PI * R;

export default function DonutChart({ title, segments, total }) {
  let cumulative = 0;
  const arcs = segments.map((s) => {
    const pct = total > 0 ? s.value / total : 0;
    const dash = pct * CIRC;
    const arc = { ...s, pct, dash, offset: cumulative };
    cumulative += dash;
    return arc;
  });

  const jump = (anchorId) => {
    const el = document.getElementById(anchorId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="rounded-2xl p-5 bg-card border border-line">
      <h3 className="font-display text-xs uppercase tracking-widest text-muted mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 140 140" width="140" height="140" className="shrink-0">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#DAD6C6" strokeWidth={STROKE} />
          <g transform="rotate(-90 70 70)">
            {arcs.map((a) => (
              <circle
                key={a.key}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={STROKE}
                strokeDasharray={`${a.dash} ${CIRC - a.dash}`}
                strokeDashoffset={-a.offset}
                onClick={() => a.anchorId && jump(a.anchorId)}
                className={a.anchorId ? "cursor-pointer" : ""}
              >
                <title>{`${a.label}: ${fmt(a.value)} Mrd. € (${fmt(a.pct * 100, 1)} %)`}</title>
              </circle>
            ))}
          </g>
          <text x="70" y="66" textAnchor="middle" className="font-mono font-semibold" style={{ fontSize: "17px", fill: "#16233B" }}>
            {fmt(total, 0)}
          </text>
          <text x="70" y="82" textAnchor="middle" className="font-mono" style={{ fontSize: "9px", fill: "#6B6A5C" }}>
            Mrd. €
          </text>
        </svg>
        <ul className="space-y-1.5 flex-1 min-w-0">
          {arcs.map((a) => (
            <li key={a.key}>
              <button
                type="button"
                onClick={() => a.anchorId && jump(a.anchorId)}
                className="flex items-center gap-2 w-full text-left group"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                <span className="font-body text-xs text-muted flex-1 truncate group-hover:text-ink">{a.label}</span>
                <span className="font-mono text-xs text-muted shrink-0">{fmt(a.pct * 100, 0)} %</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
