/**
 * pane registry per container: at phone width the panes in one container stack as bottom sheets (one
 * open sheet, the rest as bars beneath it) instead of overlapping, and wider, it is the one place the
 * panes and an overlay TimeStrip keep their gaps: the strip reports the height it covers (`floor`), a
 * Pane ends `margin` px above it, and a Pane that reaches down beside it (`fill`, or resized that tall)
 * reports its side (`insets()`), so the strip starts `margin` px clear of it.
 */
/** the container edge a pane takes from an overlay TimeStrip beside it: the strip starts at `left` px
 * from the container's left edge, or ends `right` px from its right edge */
export interface PaneSide {
    left?: number;
    right?: number;
}
export interface PaneEntry {
    uid: string;
    title: string;
    collapsed: () => boolean;
    collapse: () => void;
    /** the side this pane takes from the strip, or null when it ends above the strip (or is folded) */
    side?: () => PaneSide | null;
}
/** which side a pane at `x`..`x + w` (reaching `bottom`) takes from a strip whose top is `ch - floor`;
 * null when it ends above the strip. The side is the half of the container holding the pane's centre. */
export declare function paneSide(r: {
    x: number;
    w: number;
    bottom: number;
}, cw: number, ch: number, floor: number, margin: number): PaneSide | null;
/** the narrowest overlay TimeStrip drawn beside the panes; below it the strip spans its container */
export declare const STRIP_MIN_WIDTH = 320;
/** an overlay strip's left and right edges (px from the container's sides) beside the panes' sides, at
 * least `margin`; null (span the container) when that would leave it narrower than STRIP_MIN_WIDTH */
export declare function stripEdges(sides: PaneSide[], cw: number, margin: number): {
    left: number;
    right: number;
} | null;
declare class PaneStack {
    entries: PaneEntry[];
    /** px of the container's bottom covered by an overlay TimeStrip (from its top edge down); Panes end above it */
    floor: number;
    add(e: PaneEntry): () => PaneEntry[];
    /** collapse every other pane (accordion, used in sheet mode) */
    only(uid: string): void;
    /** the sides the panes take from an overlay TimeStrip (read inside a $derived: it follows them) */
    sides(): PaneSide[];
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
