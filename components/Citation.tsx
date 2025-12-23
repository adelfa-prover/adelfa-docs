import {
  formatBibliographyEntries,
  formatEntry,
  getAdelfaPublications,
} from "../util/citations";

export function CiteRef({ num, citeKey }: { num: number; citeKey: string }) {
  return (
    <a
      href={`#ref-${citeKey}`}
      className="x:text-primary-600 x:no-underline x:hover:underline"
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
        `<li id="ref-${key}" class="x:scroll-mt-20">[${
          index + 1
        }] ${formatEntry(formatted)}</li>`,
    )
    .join("");

  return (
    <section className="x:mt-8 x:pt-4 x:border-t nextra-border">
      <h2 className="x:text-lg x:text-slate-900 x:dark:text-slate-100 x:font-semibold x:mb-2">
        References
      </h2>
      <ol
        className="x:space-y-3 x:text-sm x:leading-relaxed x:list-none x:pl-0"
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
      className="x:my-6 x:ml-6 x:list-decimal x:space-y-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
