import { useState } from "react";
import { rowAnchor } from "../utils.js";

export default function SearchField({ items, placeholder, onBeforeJump }) {
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);

  const jump = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = items.find((i) => i.label.toLowerCase().includes(q));
    if (!match) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    if (onBeforeJump) onBeforeJump(match);
    // defer until a group opened by onBeforeJump has re-rendered
    requestAnimationFrame(() => {
      const el = document.getElementById(rowAnchor(match.id));
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("row-highlight");
      // force reflow so the animation restarts on repeated jumps to the same row
      void el.offsetWidth;
      el.classList.add("row-highlight");
    });
  };

  return (
    <div className="relative mb-4">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setNotFound(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") jump();
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className={
          "w-full font-body text-sm pl-9 pr-3 py-2 rounded-full border bg-card text-ink placeholder:text-muted focus:outline-none " +
          (notFound ? "border-sealRed" : "border-line")
        }
      />
      {notFound && (
        <p className="font-body text-xs mt-1 text-sealRed">Kein Treffer für „{query}“.</p>
      )}
    </div>
  );
}
