import { fmt, sectionAnchor } from "../utils.js";
import { sourceAnchor } from "../data/sources.js";

export default function SectionHeader({
  title,
  total,
  color = "#16233B",
  description,
  sources,
  section,
  collapsible = false,
  open = true,
  onToggle,
}) {
  const header = (
    <div className="flex items-baseline justify-between gap-3">
      <h3
        className={
          "font-display uppercase tracking-widest flex items-center gap-1.5 " +
          (collapsible ? "text-sm font-bold text-ink" : "text-xs text-muted")
        }
      >
        {collapsible && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className="shrink-0"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 120ms ease" }}
            aria-hidden="true"
          >
            <path d="M2 1 L8 5 L2 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {title}
      </h3>
      <div className="font-mono text-sm font-semibold shrink-0" style={{ color }}>
        {fmt(total)} Mrd. €
      </div>
    </div>
  );

  return (
    <div id={section ? sectionAnchor(section) : undefined} className="mb-1 scroll-mt-4">
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="w-full text-left cursor-pointer hover:opacity-70 transition-opacity"
        >
          {header}
        </button>
      ) : (
        header
      )}
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
  );
}
