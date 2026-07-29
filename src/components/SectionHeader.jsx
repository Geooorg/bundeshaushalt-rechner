import { fmt, sectionAnchor } from "../utils.js";
import { sourceAnchor } from "../data/sources.js";

export default function SectionHeader({ title, total, color = "#16233B", description, sources, section }) {
  return (
    <div id={section ? sectionAnchor(section) : undefined} className="flex items-baseline justify-between mb-1 mt-6 first:mt-0 scroll-mt-4">
      <div>
        <h3 className="font-display text-xs uppercase tracking-widest text-muted">{title}</h3>
        {description && <p className="font-body text-xs mt-0.5 max-w-xs text-muted">{description}</p>}
        {sources?.length > 0 && (
          <p className="font-mono text-xs mt-0.5 text-muted">
            Quelle:{" "}
            {sources.map((s, i) => (
              <span key={s.key}>
                <a href={`#${sourceAnchor(s.key)}`} className="underline decoration-dotted hover:decoration-solid">
                  [{s.number}]
                </a>
                {i < sources.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="font-mono text-sm font-semibold" style={{ color }}>
        {fmt(total)} Mrd. €
      </div>
    </div>
  );
}
