/** small shared helpers for the components */

export const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), Math.max(lo, hi));

/** ①…⑳ for 1…20, else the plain number */
export const circled = (n: number): string => (n >= 1 && n <= 20 ? String.fromCodePoint(0x2460 + n - 1) : String(n));

let uid = 0;
/** a document-unique id for aria wiring */
export const nextId = (prefix = "mbon"): string => `${prefix}-${++uid}`;

/** call `cb` on a pointerdown outside every element in `els()`; returns a cleanup */
export function onPointerOutside(els: () => (Element | null | undefined)[], cb: (e: PointerEvent) => void): () => void {
  const h = (e: PointerEvent) => {
    const t = e.target as Node | null;
    if (!t) return;
    if (els().some((el) => el?.contains(t))) return;
    cb(e);
  };
  document.addEventListener("pointerdown", h, true);
  return () => document.removeEventListener("pointerdown", h, true);
}

/** focusable descendants, in DOM order */
export function focusables(root: Element | null | undefined): HTMLElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

/** the facet and pipeline colours, by name */
export type Facet =
  | "place"
  | "method"
  | "org"
  | "type"
  | "portal"
  | "content"
  | "topic"
  | "dataset"
  | "delivery";

export const FACETS: Facet[] = ["place", "method", "org", "type", "portal", "content", "topic"];

export const facetVar = (f: Facet | undefined): string =>
  !f ? "var(--brand)" : f === "dataset" || f === "delivery" ? `var(--pipe-${f})` : `var(--facet-${f})`;

/** text colour on a facet fill (coral delivery takes dark ink) */
export const onFacetVar = (f: Facet | undefined): string => (f === "delivery" ? "var(--on-action)" : "var(--on-facet)");

/** characters a search needs before `match: "query"` rows are listed */
export const PICKER_MIN_QUERY = 2;

/** Picker rows for a search: the matching rows in their order, `match: "always"` rows whatever the
 * search, and `match: "query"` rows only for a search of at least `PICKER_MIN_QUERY` characters, the
 * first `queryLimit` of them; `hidden` counts the query rows that matched past the limit */
export function pickerFilter<T extends { label: string; group?: string; keywords?: string; match?: "always" | "query" }>(
  items: T[],
  q: string,
  queryLimit = 50,
): { items: T[]; hidden: number } {
  const long = q.trim().length >= PICKER_MIN_QUERY;
  const out: T[] = [];
  let shown = 0;
  let hidden = 0;
  for (const it of items) {
    if (it.match === "always") out.push(it);
    else if (it.match === "query") {
      if (!long || !pickerMatches(it, q)) continue;
      if (shown < queryLimit) {
        out.push(it);
        shown++;
      } else hidden++;
    } else if (pickerMatches(it, q)) out.push(it);
  }
  return { items: out, hidden };
}

/** Picker search: every whitespace-separated term must appear in label, group or keywords */
export function pickerMatches(
  it: { label: string; group?: string; keywords?: string },
  q: string,
): boolean {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = `${it.label} ${it.group ?? ""} ${it.keywords ?? ""}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}
