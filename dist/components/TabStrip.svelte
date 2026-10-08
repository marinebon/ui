<!--
  TabStrip (internal, not exported): the segmented tablist shared by Controls and TimeStrip so their
  look and keyboard behaviour cannot drift. role=tablist/tab, roving tabindex, ← → Home End move
  (automatic activation). tab ids are `<idPrefix>-tab-<tab.id>`; `panelId` is the aria-controls target.
  selected = semibold accent text + 1px accent ring (never an underline bar).
-->
<script lang="ts">import { circled } from "../utils.js";
let { tabs, active = $bindable(undefined), idPrefix, panelId, label = "tabs", numbered = false, fill = true, tabLabel, onchange } = $props();
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

<div class="tabs" class:fill role="tablist" aria-label={label}>
  {#each tabs as t, i (t.id)}
    <button
      bind:this={tabEls[i]}
      type="button"
      role="tab"
      id="{idPrefix}-tab-{t.id}"
      aria-selected={t.id === current}
      aria-controls={panelId}
      tabindex={t.id === current ? 0 : -1}
      onclick={() => select(i)}
      onkeydown={(e) => onkeydown(e, i)}
    >
      {#if numbered}<span class="num" aria-hidden="true">{circled(i + 1)}</span>{/if}
      {#if tabLabel}{@render tabLabel(t, i)}{:else}<span class="tl">{t.label}</span>{/if}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    gap: 2px;
    padding: 2px;
    min-width: 0;
    background: var(--bg-tint);
    border-radius: var(--radius-sm);
  }
  [role="tab"] {
    flex: 0 1 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35em;
    min-width: 0;
    padding: 0.45em 0.7em;
    border: 0;
    border-radius: calc(var(--radius-sm) - 2px);
    background: transparent;
    color: var(--text-body);
    font: var(--fw-medium) var(--text-xs) / 1.1 var(--font-sans);
    cursor: pointer;
  }
  .fill [role="tab"] { flex: 1; padding: 0.45em 0.4em; }
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
</style>
