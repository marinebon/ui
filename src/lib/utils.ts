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
