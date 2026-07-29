import { SOURCE_LIST, sourceAnchor } from "../data/sources.js";
import { formatDate } from "../utils.js";

export default function Sources() {
  return (
    <section id="quellen" className="mt-12 pt-6 border-t border-line scroll-mt-4">
      <h2 className="font-display text-lg font-semibold mb-4 text-ink">Quellen</h2>
      <ol className="space-y-2.5 list-none m-0 p-0">
        {SOURCE_LIST.map((s) => (
          <li key={s.key} id={sourceAnchor(s.key)} className="font-body text-sm text-muted scroll-mt-4">
            <span className="font-mono text-xs text-muted">[{s.number}]</span>{" "}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.note}
              className="text-ink underline decoration-dotted underline-offset-2 hover:decoration-solid"
            >
              {s.label}
            </a>
            , abgerufen am {formatDate(s.retrieved)}
          </li>
        ))}
      </ol>
    </section>
  );
}
