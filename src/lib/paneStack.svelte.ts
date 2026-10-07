/**
 * pane registry per container, so that at phone width the panes in one container stack as
 * bottom sheets (one open sheet, the rest as bars beneath it) instead of overlapping.
 */

import { untrack } from "svelte";

export interface PaneEntry {
  uid: string;
  title: string;
  collapsed: () => boolean;
  collapse: () => void;
}

class PaneStack {
  entries: PaneEntry[] = $state([]);
  // untrack: callers run inside effects, which must not depend on the whole stack
  add(e: PaneEntry) {
    untrack(() => (this.entries = [...this.entries, e]));
    return () => untrack(() => (this.entries = this.entries.filter((x) => x.uid !== e.uid)));
  }
  /** collapse every other pane (accordion, used in sheet mode) */
  only(uid: string) {
    untrack(() => {
      for (const e of this.entries) if (e.uid !== uid && !e.collapsed()) e.collapse();
    });
  }
  /** layout of a pane in sheet mode: its slot among collapsed bars, and how many bars there are */
  layout(uid: string): { barIndex: number; bars: number } {
    const bars = this.entries.filter((e) => e.collapsed());
    return { barIndex: bars.findIndex((e) => e.uid === uid), bars: bars.length };
  }
}

const stacks = new WeakMap<Element, PaneStack>();

export function stackFor(container: Element): PaneStack {
  let s = stacks.get(container);
  if (!s) stacks.set(container, (s = new PaneStack()));
  return s;
}

/** viewport bucket used to remember pane positions separately per screen class */
export function viewportBucket(width: number = typeof window !== "undefined" ? window.innerWidth : 1280): string {
  return width < 640 ? "phone" : width < 1024 ? "tablet" : width < 1600 ? "laptop" : "wide";
}

let z = 10;
/** a z-index above every pane raised so far */
export const raise = (): number => ++z;
