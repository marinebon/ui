<!--
  Picker: a searchable list with optional groups, icons/swatches and counts. the search box is a
  combobox: ↑ ↓ PgUp PgDn move, Enter picks, Esc clears the search (a second Esc reaches the
  enclosing Chip). "A–Z / by group" switches between a flat sorted list and groups.
  `value` (selected id) and `mode` are bindable.
-->
<script lang="ts">import { clamp, nextId, pickerMatches } from "../utils.js";
let { items, value = $bindable(null), mode = $bindable(undefined), label = "options", showLabel = false, placeholder = "Search…", modeToggle, maxHeight = "18rem", fill = false, emptyText = "No matches", row, onselect } = $props();
const id = nextId("picker");
const hasGroups = $derived(items.some((it) => it.group));
const effMode = $derived(mode ?? (hasGroups ? "group" : "az"));
const showToggle = $derived(modeToggle ?? hasGroups);
let query = $state("");
let active = $state(0);
let listEl = $state();
const filtered = $derived(items.filter((it) => pickerMatches(it, query)));
const sections = $derived.by(() => {
	if (effMode === "az" || !hasGroups) {
		return [{
			group: "",
			items: [...filtered].sort((a, b) => a.label.localeCompare(b.label))
		}];
	}
	const order = [];
	const by = new Map();
	for (const it of filtered) {
		const g = it.group ?? "Other";
		if (!by.has(g)) {
			by.set(g, []);
			order.push(g);
		}
		by.get(g).push(it);
	}
	return order.map((g) => ({
		group: g,
		items: by.get(g)
	}));
});
const flat = $derived(sections.flatMap((s) => s.items));
const optId = (it) => `${id}-o-${it.id.replace(/[^\w-]/g, "_")}`;
// reset the active row when the list changes
$effect(() => {
	void query;
	void effMode;
	const i = flat.findIndex((it) => it.id === value);
	active = query ? 0 : Math.max(0, i);
});
$effect(() => {
	const it = flat[active];
	if (!it || !listEl) return;
	// scroll only the list (scrollIntoView would also scroll the page)
	const el = listEl.querySelector(`[id="${optId(it)}"]`);
	if (!el) return;
	const top = el.offsetTop - listEl.offsetTop;
	if (top < listEl.scrollTop) listEl.scrollTop = top;
	else if (top + el.offsetHeight > listEl.scrollTop + listEl.clientHeight) listEl.scrollTop = top + el.offsetHeight - listEl.clientHeight;
});
function pick(it) {
	if (!it || it.disabled) return;
	value = it.id;
	onselect?.(it);
}
function onkeydown(e) {
	const n = flat.length;
	switch (e.key) {
		case "ArrowDown":
			e.preventDefault();
			active = clamp(active + 1, 0, n - 1);
			break;
		case "ArrowUp":
			e.preventDefault();
			active = clamp(active - 1, 0, n - 1);
			break;
		case "PageDown":
			e.preventDefault();
			active = clamp(active + 8, 0, n - 1);
			break;
		case "PageUp":
			e.preventDefault();
			active = clamp(active - 8, 0, n - 1);
			break;
		case "Enter":
			e.preventDefault();
			pick(flat[active]);
			break;
		case "Escape":
			if (query) {
				e.preventDefault();
				e.stopPropagation();
				query = "";
			}
			break;
	}
}
</script>

<div class="mbon-picker" class:fill>
  {#if showLabel}<span class="mbon-label" id="{id}-lab">{label}</span>{/if}
  <div class="bar">
    <input
      type="search"
      class="q"
      role="combobox"
      aria-label="Search {label}"
      aria-expanded="true"
      aria-controls="{id}-list"
      aria-autocomplete="list"
      aria-activedescendant={flat[active] ? optId(flat[active]) : undefined}
      {placeholder}
      autocomplete="off"
      spellcheck="false"
      bind:value={query}
      {onkeydown}
    />
    {#if showToggle}
      <div class="mode" role="group" aria-label="sort">
        <button type="button" aria-pressed={effMode === "az"} onclick={() => (mode = "az")}>A–Z</button>
        <button type="button" aria-pressed={effMode === "group"} onclick={() => (mode = "group")}>by group</button>
      </div>
    {/if}
  </div>
  <div class="list" bind:this={listEl} style:max-height={maxHeight}>
    <div id="{id}-list" role="listbox" aria-label={label}>
      {#each sections as s (s.group)}
        {#if s.group}
          <div role="group" aria-labelledby="{id}-g-{s.group.replace(/\W/g, '_')}">
            <div class="ghead mbon-label" id="{id}-g-{s.group.replace(/\W/g, '_')}" role="presentation">{s.group}</div>
            {@render rows(s.items)}
          </div>
        {:else}
          {@render rows(s.items)}
        {/if}
      {/each}
    </div>
    {#if !flat.length}<p class="empty">{emptyText}</p>{/if}
  </div>
  <span class="mbon-sr-only" aria-live="polite">{flat.length} {flat.length === 1 ? "result" : "results"}</span>
</div>

{#snippet rows(list: PickerItem[])}
  {#each list as it (it.id)}
    {@const i = flat.indexOf(it)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      id={optId(it)}
      role="option"
      class="opt"
      class:active={i === active}
      aria-selected={it.id === value}
      aria-disabled={it.disabled || undefined}
      tabindex="-1"
      onclick={() => pick(it)}
      onpointermove={() => (active = i)}
    >
      {#if row}
        {@render row(it)}
      {:else}
        {#if it.color}<span class="sw" style:background={it.color} aria-hidden="true"></span>{/if}
        {#if it.icon}<span class="icon" aria-hidden="true">{it.icon}</span>{/if}
        <span class="lab">{it.label}</span>
        {#if it.count != null}<span class="n">{it.count.toLocaleString()}</span>{/if}
      {/if}
    </div>
  {/each}
{/snippet}

<style>
  .mbon-picker { display: flex; flex-direction: column; gap: var(--space-2); min-width: 0; }
  .bar { display: flex; gap: var(--space-2); align-items: center; }
  .q {
    flex: 1;
    min-width: 0;
    padding: 0.5em 0.75em;
    font: var(--type-small);
    color: var(--text-strong);
    background: var(--control-bg);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
  }
  .q::placeholder { color: var(--text-muted); }
  .mode { display: inline-flex; border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; flex: none; }
  .mode button {
    border: 0;
    background: transparent;
    padding: 0.45em 0.6em;
    font: var(--fw-medium) var(--text-xs) / 1 var(--font-mono);
    color: var(--text-body);
    cursor: pointer;
  }
  .mode button[aria-pressed="true"] { background: var(--selected-bg); color: var(--text-strong); }
  .list { position: relative; overflow: auto; overscroll-behavior: contain; margin: 0 calc(-1 * var(--space-1)); }
  :global(.mbon-pane.fill) .mbon-picker.fill { flex: 1; min-height: 0; }
  :global(.mbon-pane.fill) .mbon-picker.fill .list { flex: 1; min-height: 8rem; max-height: none !important; }
  .ghead { padding: var(--space-2) var(--space-2) var(--space-1); }
  .opt {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0.4em var(--space-2);
    border-radius: var(--radius-sm);
    font: var(--type-small);
    color: var(--text-heading);
    cursor: pointer;
  }
  .opt.active { background: var(--control-hover); }
  .opt[aria-selected="true"] { background: var(--selected-bg); color: var(--text-strong); font-weight: var(--fw-semibold); }
  .opt[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; }
  .sw { flex: none; width: 0.75rem; height: 0.75rem; border-radius: 3px; }
  .icon { flex: none; width: 1.2em; text-align: center; }
  .lab { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .n { flex: none; font: var(--text-xs) / 1 var(--font-mono); color: var(--text-muted); font-variant-numeric: tabular-nums; }
  .empty { margin: var(--space-2); font: var(--type-small); color: var(--text-muted); }
</style>
