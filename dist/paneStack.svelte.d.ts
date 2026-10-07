/**
 * pane registry per container, so that at phone width the panes in one container stack as
 * bottom sheets (one open sheet, the rest as bars beneath it) instead of overlapping.
 */
export interface PaneEntry {
    uid: string;
    title: string;
    collapsed: () => boolean;
    collapse: () => void;
}
declare class PaneStack {
    entries: PaneEntry[];
    add(e: PaneEntry): () => PaneEntry[];
    /** collapse every other pane (accordion, used in sheet mode) */
    only(uid: string): void;
    /** uid of the first open entry */
    firstOpen(): string | undefined;
    /** layout of a pane in sheet mode: its slot among collapsed bars, and how many bars there are */
    layout(uid: string): {
        barIndex: number;
        bars: number;
    };
}
export declare function stackFor(container: Element): PaneStack;
/** viewport bucket used to remember pane positions separately per screen class */
export declare function viewportBucket(width?: number): string;
/** height of a collapsed bottom-sheet bar, px */
export declare const SHEET_BAR_H = 44;
/** media query for sheet mode */
export declare function sheetQuery(below: number): MediaQueryList | null;
/** a z-index above every pane raised so far */
export declare const raise: () => number;
export {};
