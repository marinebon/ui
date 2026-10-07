<!-- Select: a styled native <select> with a mono label; `value` is bindable; options may be grouped. -->
<script lang="ts">
  import { nextId } from "../utils.js";
  import type { SelectOption } from "../types.js";

  interface Props {
    value?: string;
    options: SelectOption[];
    label?: string;
    /** hide the label visually (still read by screen readers) */
    hideLabel?: boolean;
    disabled?: boolean;
    onchange?: (value: string) => void;
  }
  let { value = $bindable(""), options, label, hideLabel = false, disabled = false, onchange }: Props = $props();
  const id = nextId("select");

  const groups = $derived.by(() => {
    const out: { group?: string; options: SelectOption[] }[] = [];
    for (const o of options) {
      const last = out.at(-1);
      if (last && last.group === o.group) last.options.push(o);
      else out.push({ group: o.group, options: [o] });
    }
    return out;
  });
</script>

<div class="mbon-select">
  {#if label}<label for={id} class="mbon-label" class:mbon-sr-only={hideLabel}>{label}</label>{/if}
  <div class="wrap">
    <select {id} bind:value {disabled} onchange={() => onchange?.(value)}>
      {#each groups as g, gi (gi)}
        {#if g.group}
          <optgroup label={g.group}>
            {#each g.options as o (o.value)}<option value={o.value} disabled={o.disabled}>{o.label}</option>{/each}
          </optgroup>
        {:else}
          {#each g.options as o (o.value)}<option value={o.value} disabled={o.disabled}>{o.label}</option>{/each}
        {/if}
      {/each}
    </select>
    <span class="caret" aria-hidden="true">▾</span>
  </div>
</div>

<style>
  .mbon-select { display: flex; flex-direction: column; gap: var(--space-1); }
  .wrap { position: relative; }
  select {
    appearance: none;
    width: 100%;
    padding: 0.5em 2em 0.5em 0.75em;
    font: var(--type-small);
    color: var(--text-strong);
    background: var(--control-bg);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    cursor: pointer;
  }
  select:hover { border-color: var(--accent); }
  .caret { position: absolute; right: 0.7em; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); font-size: 0.8em; }
</style>
