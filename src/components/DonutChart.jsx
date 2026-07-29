import { useState } from "react";
import { fmt } from "../utils.js";

const R = 72;
const STROKE = 26;
const CIRC = 2 * Math.PI * R;

function lighten(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

export default function DonutChart({ title, segments, total, onBeforeJump }) {
  const [hovered, setHovered] = useState(null);
  const [active, setActive] = useState(null);

  let cumulative = 0;
  const arcs = segments.map((s) => {
    const pct = total > 0 ? s.value / total : 0;
    const dash = pct * CIRC;
    const arc = { ...s, pct, dash, offset: cumulative };
    cumulative += dash;
    return arc;
  });

  const jump = (segment) => {
    if (onBeforeJump) onBeforeJump(segment);
    const el = document.getElementById(segment.anchorId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="rounded-2xl p-5 bg-card border border-line">
      <h3 className="font-display text-xs uppercase tracking-widest text-muted mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 168 168" width="168" height="168" className="shrink-0">
          <circle cx="84" cy="84" r={R} fill="none" stroke="#DAD6C6" strokeWidth={STROKE} />
          <g transform="rotate(-90 84 84)">
            {arcs.map((a) => {
              const isActive = active === a.key;
              const isHovered = hovered === a.key;
              const stroke = isActive ? lighten(a.color, 70) : isHovered ? lighten(a.color, 40) : a.color;
              const strokeWidth = isHovered || isActive ? STROKE + 6 : STROKE;
              return (
                <circle
                  key={a.key}
                  cx="84"
                  cy="84"
                  r={R}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${a.dash} ${CIRC - a.dash}`}
                  strokeDashoffset={-a.offset}
                  onMouseEnter={() => setHovered(a.key)}
                  onMouseLeave={() => setHovered(null)}
                  onMouseDown={() => setActive(a.key)}
                  onMouseUp={() => setActive(null)}
                  onClick={() => a.anchorId && jump(a)}
                  className={a.anchorId ? "cursor-pointer" : ""}
                  style={{ transition: "stroke-width 120ms ease, stroke 120ms ease" }}
                >
                  <title>{`${a.label}: ${fmt(a.value)} Mrd. € (${fmt(a.pct * 100, 1)} %)`}</title>
                </circle>
              );
            })}
          </g>
          <text x="84" y="79" textAnchor="middle" className="font-mono font-semibold" style={{ fontSize: "20px", fill: "#16233B" }}>
            {fmt(total, 0)}
          </text>
          <text x="84" y="98" textAnchor="middle" className="font-mono" style={{ fontSize: "11px", fill: "#6B6A5C" }}>
            Mrd. €
          </text>
        </svg>
        <ul className="space-y-1.5 flex-1 min-w-0">
          {arcs.map((a) => {
            const isHighlighted = hovered === a.key || active === a.key;
            return (
              <li key={a.key}>
                <button
                  type="button"
                  onClick={() => a.anchorId && jump(a)}
                  onMouseEnter={() => setHovered(a.key)}
                  onMouseLeave={() => setHovered(null)}
                  onMouseDown={() => setActive(a.key)}
                  onMouseUp={() => setActive(null)}
                  className="flex items-center gap-2 w-full text-left group"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: isHighlighted ? lighten(a.color, 40) : a.color,
                      transition: "background-color 120ms ease",
                    }}
                  />
                  <span
                    className={
                      "font-body text-xs flex-1 truncate transition-colors " +
                      (isHighlighted ? "text-ink" : "text-muted group-hover:text-ink")
                    }
                  >
                    {a.label}
                  </span>
                  <span className="font-mono text-xs text-muted shrink-0">{fmt(a.pct * 100, 0)} %</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
