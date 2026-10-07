/** small shared helpers for the components */
export declare const clamp: (v: number, lo: number, hi: number) => number;
/** ①…⑳ for 1…20, else the plain number */
export declare const circled: (n: number) => string;
/** a document-unique id for aria wiring */
export declare const nextId: (prefix?: string) => string;
/** call `cb` on a pointerdown outside every element in `els()`; returns a cleanup */
export declare function onPointerOutside(els: () => (Element | null | undefined)[], cb: (e: PointerEvent) => void): () => void;
/** focusable descendants, in DOM order */
export declare function focusables(root: Element | null | undefined): HTMLElement[];
/** the facet and pipeline colours, by name */
export type Facet = "place" | "method" | "org" | "type" | "portal" | "content" | "topic" | "dataset" | "delivery";
export declare const FACETS: Facet[];
export declare const facetVar: (f: Facet | undefined) => string;
/** text colour on a facet fill (coral delivery takes dark ink) */
export declare const onFacetVar: (f: Facet | undefined) => string;
/** Picker search: every whitespace-separated term must appear in label, group or keywords */
export declare function pickerMatches(it: {
    label: string;
    group?: string;
    keywords?: string;
}, q: string): boolean;
