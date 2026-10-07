<!-- Stat: a big Space Grotesk numeral with a mono label (and optional unit / note). -->
<script lang="ts">let { value, label, unit, note, size = "md", format = (v) => v.toLocaleString() } = $props();
const shown = $derived(typeof value === "number" ? format(value) : value);
export {};
</script>

<div class="mbon-stat {size}">
  <span class="mbon-label">{label}</span>
  <span class="num">{shown}{#if unit}<span class="unit">{unit}</span>{/if}</span>
  {#if note}
    <span class="note">{#if typeof note === "string"}{note}{:else}{@render note()}{/if}</span>
  {/if}
</div>

<style>
  .mbon-stat { display: inline-flex; flex-direction: column; gap: var(--space-1); }
  .num {
    font-family: var(--font-display);
    font-weight: var(--fw-bold);
    font-size: var(--text-2xl);
    line-height: var(--lh-tight);
    letter-spacing: var(--ls-tight);
    color: var(--text-strong);
    font-variant-numeric: tabular-nums;
  }
  .lg .num { font-size: var(--text-4xl); }
  .unit { font-size: 0.5em; font-weight: var(--fw-medium); margin-left: 0.2em; color: var(--text-body); }
  .note { font: var(--type-small); color: var(--text-muted); }
</style>
