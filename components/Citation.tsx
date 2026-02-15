import {
  formatBibliographyEntries,
  formatEntry,
  getAdelfaPublications,
} from "../util/citations";

export function CiteRef({ num, citeKey }: { num: number; citeKey: string }) {
  return (
    <a
      href={`#ref-${citeKey}`}
      className="font-medium underline decoration-fd-primary decoration-[1.5px] underline-offset-[3.5px] transition-opacity duration-200 hover:opacity-80"
      title={`Citation ${num}`}
    >
      [{num}]
    </a>
  );
}

export async function Bibliography({ keys = [] }: { keys?: string[] }) {
  if (keys.length === 0) {
    return null;
  }

  const entries = await formatBibliographyEntries(keys);

  const html = entries
    .map(
      ([key, formatted], index) =>
        `<li id="ref-${key}" class="scroll-mt-20">[${
          index + 1
        }] ${formatEntry(formatted)}</li>`,
    )
    .join("");

  return (
    <section className="mt-8 pt-4 border-t border-fd-border">
      <h2 className="text-lg text-fd-foreground font-semibold mb-2">
        References
      </h2>
      <ol
        className="space-y-3 text-sm leading-relaxed list-none pl-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}

export async function AdelfaPublications() {
  const pubs = await getAdelfaPublications();
  const html = pubs
    .map(([, entry]) => `<li>${formatEntry(entry)}</li>`)
    .join("");
  return (
    <ol
      className="my-6 ml-6 list-decimal space-y-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
