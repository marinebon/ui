<!--
  Controls: a Pane with numbered tabs (① ② ③ ④). tab labels and panels are slots; ← → Home End
  move between tabs (automatic activation). `active` (tab id) and the Pane states are bindable.
  by convention the tabs follow the pipeline: dataset → place → method → delivery.
-->
<script lang="ts">import { circled, nextId } from "../utils.js";
import Pane from "./Pane.svelte";
let { tabs, active = $bindable(undefined), panel, tabLabel, footer, actions, title = "controls", id, open = $bindable(true), collapsed = $bindable(false), expanded = $bindable(false), anchor = "top-left", offset, width = 340, height, numbered = true, onchange } = $props();
const uid = nextId("controls");
const current = $derived(active ?? tabs[0]?.id);
let tabEls = $state([]);
function select(i, focus = false) {
	const t = tabs[i];
	if (!t) return;
	active = t.id;
	onchange?.(t.id);
	if (focus) tabEls[i]?.focus();
}
function onkeydown(e, i) {
	const n = tabs.length;
	const next = {
		ArrowRight: (i + 1) % n,
		ArrowLeft: (i - 1 + n) % n,
		Home: 0,
		End: n - 1
	}[e.key];
	if (next === undefined) return;
	e.preventDefault();
	select(next, true);
}
</script>

<Pane {title} {id} bind:open bind:collapsed bind:expanded {anchor} {offset} {width} {height} {actions} {footer}>
  <div class="mbon-controls">
    <div class="tabs" role="tablist" aria-label={title}>
      {#each tabs as t, i (t.id)}
        <button
          bind:this={tabEls[i]}
          type="button"
          role="tab"
          id="{uid}-tab-{t.id}"
          aria-selected={t.id === current}
          aria-controls="{uid}-panel"
          tabindex={t.id === current ? 0 : -1}
          onclick={() => select(i)}
          onkeydown={(e) => onkeydown(e, i)}
        >
          {#if numbered}<span class="num" aria-hidden="true">{circled(i + 1)}</span>{/if}
          {#if tabLabel}{@render tabLabel(t, i)}{:else}<span class="tl">{t.label}</span>{/if}
        </button>
      {/each}
    </div>
    <div class="panel" role="tabpanel" id="{uid}-panel" aria-labelledby="{uid}-tab-{current}" tabindex="-1">
      {#if current}{@render panel(current)}{/if}
    </div>
  </div>
</Pane>

<style>
  .mbon-controls { display: flex; flex-direction: column; gap: var(--space-3); }
  .tabs {
    display: flex;
    gap: 2px;
    padding: 2px;
    background: var(--bg-tint);
    border-radius: var(--radius-sm);
  }
  [role="tab"] {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35em;
    min-width: 0;
    padding: 0.45em 0.4em;
    border: 0;
    border-radius: calc(var(--radius-sm) - 2px);
    background: transparent;
    color: var(--text-body);
    font: var(--fw-medium) var(--text-xs) / 1.1 var(--font-sans);
    cursor: pointer;
  }
  [role="tab"]:hover { color: var(--text-strong); }
  /* selected: accent text (--link = teal-600 on light, teal-300 on dark; --accent itself is only 2.8:1 on white),
     semibold, and a 1px accent ring. never an underline bar. */
  [role="tab"][aria-selected="true"] {
    background: var(--bg-surface);
    color: var(--link);
    font-weight: var(--fw-semibold);
    box-shadow: var(--shadow-xs), inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent);
  }
  .num { font-size: 1.15em; color: var(--text-muted); }
  [role="tab"][aria-selected="true"] .num { color: var(--link); }
  .tl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .panel { min-height: 4rem; }
  .panel:focus { outline: none; }
</style>
