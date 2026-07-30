import { EXPLANATIONS, explanationAnchor } from "../data/explanations.js";

export default function Explanations() {
  return (
    <section id="erlaeuterungen" className="mt-12 pt-6 border-t border-line scroll-mt-4">
      <h2 className="font-display text-lg font-semibold mb-4 text-ink">Erläuterungen und FAQ</h2>
      <ol className="space-y-3 list-none m-0 p-0">
        {EXPLANATIONS.map((e, i) => (
          <li key={e.key} id={explanationAnchor(e.key)} className="font-body text-sm text-muted scroll-mt-4">
            <span className="font-mono text-xs text-muted">[{i + 1}]</span>{" "}
            <strong className="text-ink font-display font-medium">{e.title}:</strong> {e.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
