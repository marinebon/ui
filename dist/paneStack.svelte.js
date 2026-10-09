/**
 * pane registry per container, so that at phone width the panes in one container stack as
 * bottom sheets (one open sheet, the rest as bars beneath it) instead of overlapping.
 */
import { untrack } from "svelte";
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
