<!--
  Pane: a floating panel inside a positioned container (e.g. over a map).
  - title bar with a mono label; drag it to move (mouse, pen or touch), double-click or Home to send it home,
    arrow keys move it when the title is focused (Shift = 50 px)
  - collapse to a labelled pill docked to the nearest container edge; click the pill to restore
  - expand to fill the container; Esc restores
  - resize from the right edge, bottom edge or corner grip (the grip also takes arrow keys)
  - `actions` slot in the title bar for an export menu
  - position and size remembered per viewport class in localStorage (key mbon-pane:<id>:<bucket>)
  - `open`, `collapsed`, `expanded` are bindable so the app can mirror them in the URL
  - below `sheetBelow` px of viewport width panes become stacked bottom sheets
  - an overlay TimeStrip in the same container keeps the panes above it (`margin` px clear of its top)
  the container must be positioned (position: relative/absolute) and sized.
-->
<script lang="ts">import { onMount, tick, untrack } from "svelte";
import { clamp, nextId } from "../utils.js";
import { raise, sheetQuery, SHEET_BAR_H, stackFor, viewportBucket } from "../paneStack.svelte.js";
let { title, id, open = $bindable(true), collapsed = $bindable(false), expanded = $bindable(false), anchor = "top-left", offset = {
	x: 0,
	y: 0
}, width = 320, height, minWidth = 200, minHeight = 96, margin = 12, draggable = true, resizable = true, collapsible = true, expandable = true, closable = false, pillLabel, sheetBelow = 640, children, actions, footer, onclose, class: cls = "" } = $props();
const uid = nextId("pane");
const PILL_H = 34;
const BAR_H = SHEET_BAR_H;
let probe = $state();
let paneEl = $state();
let pillEl = $state();
let handleEl = $state();
let container = $state(null);
let cw = $state(0);
let ch = $state(0);
let sheet = $state(false);
let z = $state(10);
let rect = $state({
	x: 0,
	y: 0,
	w: 320,
	h: 0
});
let moved = $state(false);
const key = $derived(id ? `mbon-pane:${id}:${viewportBucket()}` : null);
function homeRect() {
	const w = Math.min(width, Math.max(minWidth, cw - 2 * margin));
	const h = height ?? 0;
	const right = anchor.endsWith("right");
	const bottom = anchor.startsWith("bottom");
	const x = right ? cw - w - margin - offset.x : margin + offset.x;
	const hh = h || paneEl?.offsetHeight || 200;
	const y = bottom ? ch - floor - hh - margin - offset.y : margin + offset.y;
	return {
		x: Math.max(0, x),
		y: Math.max(0, y),
		w,
		h
	};
}
function clampRect(r) {
	const w = clamp(r.w, minWidth, cw || r.w);
	const h = r.h ? clamp(r.h, minHeight, ch || r.h) : 0;
	return {
		w,
		h,
		x: clamp(r.x, 0, (cw || r.x + w) - w),
		y: clamp(r.y, 0, (ch || r.y + 40) - 40)
	};
}
function save() {
	if (!key) return;
	try {
		localStorage.setItem(key, JSON.stringify(rect));
	} catch {}
}
function load() {
	if (!key) return null;
	try {
		const v = JSON.parse(localStorage.getItem(key) ?? "null");
		if (v && [
			v.x,
			v.y,
			v.w,
			v.h
		].every((n) => typeof n === "number")) return v;
	} catch {}
	return null;
}
/** send the pane back to its anchor corner and forget the stored position */
export function home() {
	moved = false;
	rect = homeRect();
	if (key) {
		try {
			localStorage.removeItem(key);
		} catch {}
	}
}
onMount(() => {
	container = probe?.parentElement ?? null;
	const measure = () => {
		cw = container?.clientWidth ?? 0;
		ch = container?.clientHeight ?? 0;
		rect = moved ? clampRect(rect) : homeRect();
	};
	const stored = load();
	measure();
	if (stored) {
		moved = true;
		rect = clampRect(stored);
	}
	const ro = typeof ResizeObserver !== "undefined" && container ? new ResizeObserver(measure) : null;
	if (container) ro?.observe(container);
	const mq = sheetQuery(sheetBelow);
	const onmq = () => sheet = !!mq?.matches;
	onmq();
	mq?.addEventListener?.("change", onmq);
	return () => {
		ro?.disconnect();
		mq?.removeEventListener?.("change", onmq);
	};
});
// register in the container's stack while open
const stack = $derived(container ? stackFor(container) : null);
$effect(() => {
	if (!stack || !open) return;
	return stack.add({
		uid,
		title,
		collapsed: () => collapsed,
		collapse: () => collapsed = true
	});
});
// sheet mode is an accordion: one open sheet. a pane the user restores claims it; otherwise the
// first open pane keeps it and later ones fold into bars.
let claim = false;
$effect(() => {
	if (!(sheet && open && !collapsed && stack)) return;
	untrack(() => {
		if (claim) stack.only(uid);
		else if (stack.firstOpen() !== uid) collapsed = true;
		claim = false;
	});
});
const sheetLayout = $derived(sheet && stack ? stack.layout(uid) : {
	barIndex: -1,
	bars: 0
});
// what an overlay TimeStrip covers at the container's bottom (sheets stack instead): the pane ends above it
const floor = $derived(sheet ? 0 : stack?.floor ?? 0);
$effect(() => {
	void floor;
	untrack(() => {
		if (!moved && anchor.startsWith("bottom") && cw) rect = homeRect();
	});
});
// Esc restores an expanded pane
$effect(() => {
	if (!expanded) return;
	const h = (e) => {
		if (e.key === "Escape" && !e.defaultPrevented) {
			expanded = false;
			handleEl?.focus();
		}
	};
	window.addEventListener("keydown", h);
	return () => window.removeEventListener("keydown", h);
});
// ---- drag ----------------------------------------------------------------
let drag = null;
function startDrag(e, kind) {
	if (e.button !== 0 || expanded || sheet) return;
	if (kind === "move") {
		if (!draggable) return;
		if (e.target.closest("button, a, input, select, textarea, [data-no-drag]")) return;
	}
	const r = { ...rect };
	if (kind !== "move" && !r.h) r.h = paneEl?.offsetHeight ?? 200;
	drag = {
		px: e.clientX,
		py: e.clientY,
		r,
		kind
	};
	e.currentTarget.setPointerCapture?.(e.pointerId);
	e.preventDefault();
}
function onDrag(e) {
	if (!drag) return;
	const dx = e.clientX - drag.px;
	const dy = e.clientY - drag.py;
	const r = drag.r;
	moved = true;
	if (drag.kind === "move") rect = clampRect({
		...r,
		x: r.x + dx,
		y: r.y + dy
	});
	else rect = clampRect({
		...r,
		w: drag.kind === "s" ? r.w : Math.min(r.w + dx, cw - r.x),
		h: drag.kind === "e" ? r.h : Math.min(r.h + dy, ch - r.y)
	});
}
function endDrag(e) {
	if (!drag) return;
	e.currentTarget.releasePointerCapture?.(e.pointerId);
	drag = null;
	save();
}
function onHandleKey(e) {
	if (e.key === "Home") {
		e.preventDefault();
		home();
		return;
	}
	if (!draggable || expanded || sheet) return;
	const d = e.shiftKey ? 50 : 10;
	const mv = {
		ArrowLeft: [-d, 0],
		ArrowRight: [d, 0],
		ArrowUp: [0, -d],
		ArrowDown: [0, d]
	};
	const m = mv[e.key];
	if (!m) return;
	e.preventDefault();
	moved = true;
	rect = clampRect({
		...rect,
		x: rect.x + m[0],
		y: rect.y + m[1]
	});
	save();
}
function onGripKey(e) {
	const d = e.shiftKey ? 50 : 10;
	const mv = {
		ArrowLeft: [-d, 0],
		ArrowRight: [d, 0],
		ArrowUp: [0, -d],
		ArrowDown: [0, d]
	};
	const m = mv[e.key];
	if (!m) return;
	e.preventDefault();
	moved = true;
	const h = rect.h || paneEl?.offsetHeight || 200;
	rect = clampRect({
		...rect,
		w: rect.w + m[0],
		h: h + m[1]
	});
	save();
}
// ---- collapse / expand --------------------------------------------------
async function collapse() {
	collapsed = true;
	expanded = false;
	await tick();
	pillEl?.focus();
}
async function restore() {
	claim = true;
	collapsed = false;
	await tick();
	handleEl?.focus();
}
function toggleExpand() {
	expanded = !expanded;
}
function close() {
	open = false;
	onclose?.();
}
/** nearest container edge to the pane centre, for docking the pill */
const edge = $derived.by(() => {
	const h = rect.h || paneEl?.offsetHeight || 200;
	const cx = rect.x + rect.w / 2;
	const cy = rect.y + h / 2;
	const d = {
		left: cx,
		right: cw - cx,
		top: cy,
		bottom: ch - floor - cy
	};
	return Object.entries(d).sort((a, b) => a[1] - b[1])[0]?.[0] ?? "left";
});
const pillStyle = $derived.by(() => {
	if (sheet) {
		const k = sheetLayout.bars - 1 - sheetLayout.barIndex;
		return `left:0;right:0;bottom:${k * BAR_H}px;`;
	}
	const y = clamp(rect.y, margin, ch - floor - PILL_H - margin);
	const x = clamp(rect.x, margin, cw - 120 - margin);
	switch (edge) {
		case "left": return `left:${margin}px;top:${y}px;`;
		case "right": return `right:${margin}px;top:${y}px;`;
		case "top": return `top:${margin}px;left:${x}px;`;
		default: return `bottom:${margin + floor}px;left:${x}px;`;
	}
});
const paneStyle = $derived.by(() => {
	if (expanded) return `left:${margin}px;top:${margin}px;right:${margin}px;bottom:${margin}px;z-index:${z};`;
	if (sheet) return `left:0;right:0;bottom:${sheetLayout.bars * BAR_H}px;max-height:60%;z-index:${z};`;
	const h = rect.h ? `height:${rect.h}px;` : `max-height:${Math.max(minHeight, ch - floor - rect.y - margin)}px;`;
	return `left:${rect.x}px;top:${rect.y}px;width:${rect.w}px;${h}z-index:${z};`;
});
</script>

<span bind:this={probe} class="probe" aria-hidden="true"></span>

{#if open}
  {#if collapsed}
    <button
      bind:this={pillEl}
      type="button"
      class="mbon-pane-pill edge-{edge}"
      class:sheet
      style={pillStyle}
      aria-expanded="false"
      aria-label="Show {title} pane"
      onclick={restore}
    >
      <span class="mbon-label">{pillLabel ?? title}</span><span class="pm" aria-hidden="true">+</span>
    </button>
  {:else}
    <section
      bind:this={paneEl}
      class="mbon-pane {cls}"
      class:expanded
      class:sheet
      class:fit={!rect.h && !expanded}
      style={paneStyle}
      aria-labelledby="{uid}-t"
      onpointerdowncapture={() => (z = raise())}
    >
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <header
        class="bar"
        class:grab={draggable && !expanded && !sheet}
        onpointerdown={(e) => startDrag(e, "move")}
        onpointermove={onDrag}
        onpointerup={endDrag}
        onpointercancel={endDrag}
        ondblclick={(e) => {
          if (!(e.target as Element).closest("button, a, input")) home();
        }}
      >
        <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
        <h2
          bind:this={handleEl}
          id="{uid}-t"
          class="mbon-label handle"
          tabindex="0"
          aria-keyshortcuts={draggable ? "ArrowUp ArrowDown ArrowLeft ArrowRight Home" : "Home"}
          onkeydown={onHandleKey}
        >
          {title}
        </h2>
        <div class="tools">
          {#if actions}<div class="actions" data-no-drag>{@render actions()}</div>{/if}
          {#if expandable}
            <button type="button" class="tool" aria-pressed={expanded} aria-label={expanded ? `Restore ${title}` : `Expand ${title}`} title={expanded ? "Restore (Esc)" : "Expand"} onclick={toggleExpand}>
              {#if expanded}
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 2v4H2M10 14v-4h4M14 6h-4V2M2 10h4v4" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
              {:else}
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 6V2h4M14 10v4h-4M10 2h4v4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
              {/if}
            </button>
          {/if}
          {#if collapsible}
            <button type="button" class="tool" aria-expanded="true" aria-label="Collapse {title}" title="Collapse" onclick={collapse}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" stroke-width="1.8" /></svg>
            </button>
          {/if}
          {#if closable}
            <button type="button" class="tool" aria-label="Close {title}" title="Close" onclick={close}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" /></svg>
            </button>
          {/if}
        </div>
      </header>
      <div class="body">{@render children?.()}</div>
      {#if footer}<footer class="foot">{@render footer()}</footer>{/if}
      {#if resizable && !expanded && !sheet}
        <div class="edge e" aria-hidden="true" onpointerdown={(e) => startDrag(e, "e")} onpointermove={onDrag} onpointerup={endDrag} onpointercancel={endDrag}></div>
        <div class="edge s" aria-hidden="true" onpointerdown={(e) => startDrag(e, "s")} onpointermove={onDrag} onpointerup={endDrag} onpointercancel={endDrag}></div>
        <button
          type="button"
          class="grip"
          aria-label="Resize {title} (arrow keys)"
          onpointerdown={(e) => startDrag(e, "se")}
          onpointermove={onDrag}
          onpointerup={endDrag}
          onpointercancel={endDrag}
          onkeydown={onGripKey}
        >
          <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M9 3L3 9M9 6L6 9" stroke="currentColor" stroke-width="1.3" /></svg>
        </button>
      {/if}
    </section>
  {/if}
{/if}

<style>
  .probe { display: none; }
  .mbon-pane {
    position: absolute;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--pane-bg);
    border: 1px solid var(--pane-border);
    border-radius: var(--radius-md);
    box-shadow: var(--pane-shadow);
    color: var(--text-body);
    font: var(--type-small);
    overflow: hidden;
  }
  .mbon-pane.expanded { border-radius: var(--radius-md); }
  .bar {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-2) var(--space-2) var(--space-3);
    flex: none;
    user-select: none;
  }
  .bar.grab { cursor: grab; touch-action: none; }
  .bar.grab:active { cursor: grabbing; }
  .handle { flex: 1; min-width: 0; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-radius: var(--radius-xs); }
  .tools { display: flex; align-items: center; gap: 2px; flex: none; }
  .actions { display: flex; align-items: center; margin-right: var(--space-1); }
  .tool {
    display: grid;
    place-items: center;
    width: 1.75rem;
    height: 1.75rem;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0;
  }
  .tool:hover { background: var(--control-hover); color: var(--text-strong); }
  .body { flex: 1; min-height: 0; overflow: auto; padding: 0 var(--space-3) var(--space-3); overscroll-behavior: contain; }
  .foot {
    flex: none;
    padding: var(--space-2) var(--space-3);
    background: var(--bg-tint);
    font: var(--text-xs) / 1.4 var(--font-mono);
    color: var(--text-muted);
  }
  .edge { position: absolute; touch-action: none; }
  .edge.e { top: 0; right: 0; width: 6px; bottom: 12px; cursor: ew-resize; }
  .edge.s { left: 0; bottom: 0; height: 6px; right: 12px; cursor: ns-resize; }
  .grip {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    cursor: nwse-resize;
    touch-action: none;
  }

  .mbon-pane-pill {
    position: absolute;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    height: 34px;
    padding: 0 var(--space-3);
    background: var(--pane-bg);
    border: 1px solid var(--pane-border);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
  }
  .mbon-pane-pill:hover { background: var(--control-hover); }
  .mbon-pane-pill .pm { font: var(--fw-semibold) var(--text-sm) / 1 var(--font-mono); color: var(--text-muted); }

  /* phone: stacked bottom sheets */
  .mbon-pane.sheet {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    border-bottom: 0;
  }
  .mbon-pane-pill.sheet {
    height: 44px;
    border-radius: 0;
    border-width: 1px 0 0;
    justify-content: space-between;
    box-shadow: none;
  }
</style>
