import { useState } from "react";

export default function InfoPanel({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.target.open)}
      className="rounded-2xl p-5 mb-4 bg-card border border-line"
    >
      <summary className="font-display text-sm font-semibold flex items-center justify-between text-ink">
        <span>{title}</span>
        <span className="font-mono text-xs text-muted">{open ? "\u2212 einklappen" : "+ ausklappen"}</span>
      </summary>
      <div className="font-body text-sm mt-3 space-y-3 text-muted">{children}</div>
    </details>
  );
}
