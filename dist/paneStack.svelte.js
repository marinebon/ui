/**
 * pane registry per container: at phone width the panes in one container stack as bottom sheets (one
 * open sheet, the rest as bars beneath it) instead of overlapping, and wider, it is the one place the
 * panes and an overlay TimeStrip keep their gaps: the strip reports the height it covers (`floor`), a
 * Pane ends `margin` px above it, and a Pane that reaches down beside it (`fill`, or resized that tall)
 * reports its side (`insets()`), so the strip starts `margin` px clear of it.
 */
import { untrack } from "svelte";
/** which side a pane at `x`..`x + w` (reaching `bottom`) takes from a strip whose top is `ch - floor`;
 * null when it ends above the strip. The side is the half of the container holding the pane's centre. */
export function paneSide(r, cw, ch, floor, margin) {
    if (!cw || !floor || r.bottom <= ch - floor)
        return null;
    return r.x + r.w / 2 < cw / 2 ? { left: Math.round(r.x + r.w + margin) } : { right: Math.round(cw - r.x + margin) };
}
/** the narrowest overlay TimeStrip drawn beside the panes; below it the strip spans its container */
export const STRIP_MIN_WIDTH = 320;
/** an overlay strip's left and right edges (px from the container's sides) beside the panes' sides, at
 * least `margin`; null (span the container) when that would leave it narrower than STRIP_MIN_WIDTH */
export function stripEdges(sides, cw, margin) {
    const left = Math.max(margin, ...sides.map((s) => s.left ?? 0));
    const right = Math.max(margin, ...sides.map((s) => s.right ?? 0));
    if (left === margin && right === margin)
        return null;
    if (cw && cw - left - right < STRIP_MIN_WIDTH)
        return null;
    return { left, right };
}
class PaneStack {
    entries = $state([]);
    /** px of the container's bottom covered by an overlay TimeStrip (from its top edge down); Panes end above it */
    floor = $state(0);
    // untrack: callers run inside effects, which must not depend on the whole stack
    add(e) {
        untrack(() => (this.entries = [...this.entries, e]));
        return () => untrack(() => (this.entries = this.entries.filter((x) => x.uid !== e.uid)));
    }
    /** collapse every other pane (accordion, used in sheet mode) */
    only(uid) {
        untrack(() => {
            for (const e of this.entries)
                if (e.uid !== uid && !e.collapsed())
                    e.collapse();
        });
    }
    /** the sides the panes take from an overlay TimeStrip (read inside a $derived: it follows them) */
    sides() {
        return this.entries.map((e) => e.side?.()).filter((s) => !!s);
    }
    /** uid of the first open entry */
    firstOpen() {
        return untrack(() => this.entries.find((e) => !e.collapsed())?.uid);
    }
    /** layout of a pane in sheet mode: its slot among collapsed bars, and how many bars there are */
    layout(uid) {
        const bars = this.entries.filter((e) => e.collapsed());
        return { barIndex: bars.findIndex((e) => e.uid === uid), bars: bars.length };
    }
}
const stacks = new WeakMap();
export function stackFor(container) {
    let s = stacks.get(container);
    if (!s)
        stacks.set(container, (s = new PaneStack()));
    return s;
}
/** viewport bucket used to remember pane positions separately per screen class */
export function viewportBucket(width = typeof window !== "undefined" ? window.innerWidth : 1280) {
    return width < 640 ? "phone" : width < 1024 ? "tablet" : width < 1600 ? "laptop" : "wide";
}
/** height of a collapsed bottom-sheet bar, px */
export const SHEET_BAR_H = 44;
/** media query for sheet mode */
export function sheetQuery(below) {
    return typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia(`(max-width: ${below - 0.02}px)`)
        : null;
}
let z = 10;
/** a z-index above every pane raised so far */
export const raise = () => ++z;
