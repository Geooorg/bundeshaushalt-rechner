import { useState } from "react";

export default function InfoPanel({ id, title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      id={id}
      open={open}
      onToggle={(e) => setOpen(e.target.open)}
      className="rounded-2xl p-5 mb-4 bg-card border border-line scroll-mt-4"
    >
      <summary className="font-display text-sm font-semibold flex items-center justify-between text-ink">
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="truncate">{title}</span>
          {id && (
            <a
              href={`#${id}`}
              onClick={(e) => e.stopPropagation()}
              title="Link zu diesem Abschnitt"
              aria-label="Link zu diesem Abschnitt"
              className="text-muted hover:text-ink shrink-0"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </a>
          )}
        </span>
        <span className="font-mono text-xs text-muted shrink-0">{open ? "\u2212 einklappen" : "+ ausklappen"}</span>
      </summary>
      <div className="font-body text-sm mt-3 space-y-3 text-muted">{children}</div>
    </details>
  );
}
