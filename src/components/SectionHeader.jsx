import { fmt } from "../utils.js";

export default function SectionHeader({ title, total, color = "#16233B", description }) {
  return (
    <div className="flex items-baseline justify-between mb-1 mt-6 first:mt-0">
      <div>
        <h3 className="font-display text-xs uppercase tracking-widest text-muted">{title}</h3>
        {description && <p className="font-body text-xs mt-0.5 max-w-xs text-muted">{description}</p>}
      </div>
      <div className="font-mono text-sm font-semibold" style={{ color }}>
        {fmt(total)} Mrd. €
      </div>
    </div>
  );
}
