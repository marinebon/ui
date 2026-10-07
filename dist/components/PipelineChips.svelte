<!--
  PipelineChips: the MBON motif, dataset · place · method · delivery, in that order and colour.
  give `values` to show the current choice in each step; `onselect` makes the chips buttons.
-->
<script lang="ts">let { values = {}, labels = {}, active, onselect, size = "md" } = $props();
const STEPS = [
	"dataset",
	"place",
	"method",
	"delivery"
];
export {};
</script>

<ol class="mbon-pipeline {size}" aria-label="pipeline">
  {#each STEPS as step, i (step)}
    <li class="step">
      {#if onselect}
        <button
          type="button"
          class="chip {step}"
          class:active={active === step}
          aria-current={active === step ? "step" : undefined}
          onclick={() => onselect(step)}
        >
          <span class="k">{labels[step] ?? step}</span>{#if values[step]}<span class="v">{values[step]}</span>{/if}
        </button>
      {:else}
        <span class="chip {step}" class:active={active === step} aria-current={active === step ? "step" : undefined}>
          <span class="k">{labels[step] ?? step}</span>{#if values[step]}<span class="v">{values[step]}</span>{/if}
        </span>
      {/if}
      {#if i < STEPS.length - 1}<span class="sep" aria-hidden="true">›</span>{/if}
    </li>
  {/each}
</ol>

<style>
  .mbon-pipeline { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-1); list-style: none; margin: 0; padding: 0; }
  .step { display: inline-flex; align-items: center; gap: var(--space-1); }
  .chip {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5em;
    border: 1px solid var(--facet-outline);
    border-radius: var(--radius-pill);
    padding: 0.35em 0.85em;
    color: var(--on-facet);
    font: var(--fw-medium) var(--text-xs) / 1.2 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: var(--ls-label);
  }
  .md .chip { font-size: var(--text-xs); }
  .sm .chip { padding: 0.25em 0.6em; font-size: 0.6875rem; }
  button.chip { cursor: pointer; }
  button.chip:hover { filter: brightness(1.12); }
  .dataset { background: var(--pipe-dataset); }
  .place { background: var(--pipe-place); }
  .method { background: var(--pipe-method); }
  .delivery { background: var(--pipe-delivery); color: var(--on-action); }
  .v { text-transform: none; letter-spacing: 0; font-family: var(--font-sans); font-weight: var(--fw-semibold); }
  .active { box-shadow: 0 0 0 2px var(--bg-surface), 0 0 0 4px var(--accent); }
  .sep { color: var(--text-muted); font-family: var(--font-mono); }
</style>
