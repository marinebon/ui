<!--
  TimeStrip: a bottom pane shell for a time chart. the chart is the app's (a slot that receives
  the plot width and height); the strip adds a title bar, a height grip, collapse, and a brush:
  drag across the plot to select, click to clear, or use the keyboard (← → move, Shift+← → resize,
  Esc clears). callbacks get pixels, fractions of the plot width, and domain values when `domain`
  is given. `brush` ([f0, f1] fractions), `collapsed` and `height` are bindable.
-->
<script lang="ts">import { onMount, untrack } from "svelte";
import { clamp, nextId } from "../utils.js";
import { sheetQuery, SHEET_BAR_H, stackFor } from "../paneStack.svelte.js";
let { title = "time", collapsed = $bindable(false), height = $bindable(140), minHeight = 72, maxHeight = 420, domain, plotLeft = 0, plotRight = 0, brush = $bindable(null), overlay = true, sheetBelow = 640, children, actions, onbrush, onbrushend, onclear } = $props();
// phone: join the container's bottom-sheet stack with the Panes
const uid = nextId("timestrip");
let probe = $state();
let container = $state(null);
let sheet = $state(false);
let claim = false;
onMount(() => {
	container = probe?.parentElement ?? null;
	const mq = sheetQuery(sheetBelow);
	const on = () => sheet = !!mq?.matches && overlay;
	on();
	mq?.addEventListener?.("change", on);
	return () => mq?.removeEventListener?.("change", on);
});
const stack = $derived(container && overlay ? stackFor(container) : null);
$effect(() => {
	if (!stack) return;
	return stack.add({
		uid,
		title,
		collapsed: () => collapsed,
		collapse: () => collapsed = true
	});
});
$effect(() => {
	if (!(sheet && !collapsed && stack)) return;
	untrack(() => {
		if (claim) stack.only(uid);
		else if (stack.firstOpen() !== uid) collapsed = true;
		claim = false;
	});
});
const sheetStyle = $derived.by(() => {
	if (!sheet || !stack) return undefined;
	const { barIndex, bars } = stack.layout(uid);
	const bottom = collapsed ? (bars - 1 - barIndex) * SHEET_BAR_H : bars * SHEET_BAR_H;
	return `left:0;right:0;bottom:${bottom}px;`;
});
function toggle() {
	if (collapsed) claim = true;
	collapsed = !collapsed;
}
let pw = $state(0);
let ph = $state(0);
const span = $derived(Math.max(1, pw - plotLeft - plotRight));
function range(f0, f1) {
	const a = Math.min(f0, f1);
	const b = Math.max(f0, f1);
	const r = {
		f0: a,
		f1: b,
		x0: plotLeft + a * span,
		x1: plotLeft + b * span
	};
	if (domain) {
		r.v0 = domain[0] + a * (domain[1] - domain[0]);
		r.v1 = domain[0] + b * (domain[1] - domain[0]);
	}
	return r;
}
let start = null;
const toF = (e, el) => clamp((e.clientX - el.getBoundingClientRect().left - plotLeft) / span, 0, 1);
function down(e) {
	if (e.button !== 0) return;
	const el = e.currentTarget;
	start = {
		f: toF(e, el),
		x: e.clientX
	};
	el.setPointerCapture?.(e.pointerId);
}
function move(e) {
	if (!start || Math.abs(e.clientX - start.x) < 3) return;
	const f = toF(e, e.currentTarget);
	const r = range(start.f, f);
	brush = [r.f0, r.f1];
	onbrush?.(r);
}
function up(e) {
	if (!start) return;
	const moved = Math.abs(e.clientX - start.x) >= 3;
	start = null;
	if (moved && brush) onbrushend?.(range(brush[0], brush[1]));
	else clear();
}
function clear() {
	if (brush === null) return;
	brush = null;
	onclear?.();
}
function key(e) {
	if (e.key === "Escape" && brush) {
		e.preventDefault();
		clear();
		return;
	}
	const d = e.key === "ArrowRight" ? .02 : e.key === "ArrowLeft" ? -.02 : 0;
	if (!d) return;
	e.preventDefault();
	let [a, b] = brush ?? [.4, .6];
	if (e.shiftKey) b = clamp(b + d, a + .01, 1);
	else {
		const w = b - a;
		a = clamp(a + d, 0, 1 - w);
		b = a + w;
	}
	brush = [a, b];
	const r = range(a, b);
	onbrush?.(r);
	onbrushend?.(r);
}
// height grip
let hs = null;
function hdown(e) {
	hs = {
		y: e.clientY,
		h: height
	};
	e.currentTarget.setPointerCapture?.(e.pointerId);
	e.preventDefault();
}
function hmove(e) {
	if (hs) height = clamp(hs.h - (e.clientY - hs.y), minHeight, maxHeight);
}
function hkey(e) {
	const d = e.key === "ArrowUp" ? 10 : e.key === "ArrowDown" ? -10 : 0;
	if (!d) return;
	e.preventDefault();
	height = clamp(height + d, minHeight, maxHeight);
}
</script>

<span bind:this={probe} style="display:none" aria-hidden="true"></span>
<section class="mbon-timestrip" class:overlay class:collapsed class:sheet style={sheetStyle} aria-label={title}>
  {#if !collapsed}
    <button type="button" class="hgrip" aria-label="Resize {title} height (arrow keys)" onpointerdown={hdown} onpointermove={hmove} onpointerup={() => (hs = null)} onkeydown={hkey}><span></span></button>
  {/if}
  <header class="bar">
    <h2 class="mbon-label t">{title}</h2>
    {#if brush && !collapsed}
      <button type="button" class="clear" onclick={clear}>clear selection</button>
    {/if}
    <div class="tools">
      {#if actions}{@render actions()}{/if}
      <button type="button" class="tool" aria-expanded={!collapsed} aria-label={collapsed ? `Show ${title}` : `Collapse ${title}`} onclick={toggle}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          {#if collapsed}<path d="M3 10l5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" />{:else}<path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" />{/if}
        </svg>
      </button>
    </div>
  </header>
  {#if !collapsed}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
    <div
      class="plot"
      style:height="{height}px"
      bind:clientWidth={pw}
      bind:clientHeight={ph}
      role="group"
      aria-label="{title} selection: drag to select, arrow keys move, Shift+arrows resize, Esc clears"
      tabindex="0"
      onpointerdown={down}
      onpointermove={move}
      onpointerup={up}
      onkeydown={key}
    >
      {@render children?.({ width: pw, height: ph })}
      {#if brush}
        <div class="brush" style:left="{plotLeft + brush[0] * span}px" style:width="{(brush[1] - brush[0]) * span}px" aria-hidden="true"></div>
      {/if}
    </div>
  {/if}
</section>

<style>
  .mbon-timestrip {
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--pane-bg);
    border: 1px solid var(--pane-border);
    border-radius: var(--radius-md);
    box-shadow: var(--pane-shadow);
    color: var(--text-body);
  }
  .mbon-timestrip.overlay { position: absolute; left: 12px; right: 12px; bottom: 12px; z-index: 4; }
  .hgrip {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 48px;
    height: 12px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: ns-resize;
    display: grid;
    place-items: center;
    touch-action: none;
  }
  .hgrip span { width: 32px; height: 4px; border-radius: 2px; background: var(--border-strong); }
  .bar { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-2) var(--space-1) var(--space-3); }
  .t { margin: 0; }
  .clear {
    border: 0;
    background: transparent;
    color: var(--link);
    font: var(--text-xs) / 1 var(--font-sans);
    cursor: pointer;
    padding: 0.25em 0.4em;
  }
  .tools { margin-left: auto; display: flex; align-items: center; gap: var(--space-1); }
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
  .plot { position: relative; margin: 0 var(--space-3) var(--space-3); touch-action: pan-y; cursor: crosshair; border-radius: var(--radius-xs); }
  .brush {
    position: absolute;
    top: 0;
    bottom: 0;
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    border-left: 1px solid var(--accent);
    border-right: 1px solid var(--accent);
    pointer-events: none;
  }
  .mbon-timestrip.sheet { border-radius: var(--radius-lg) var(--radius-lg) 0 0; border-bottom: 0; box-shadow: none; }
  .mbon-timestrip.sheet.collapsed { border-radius: 0; height: 44px; justify-content: center; }
</style>
