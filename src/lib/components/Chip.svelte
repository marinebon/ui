<!--
  Chip: a word in a Sentence that opens a popover. the popover content is a slot (usually the
  same Picker the Controls pane uses); it receives a close() function. `open` is bindable.
  Esc or a click outside closes it and focus returns to the chip.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { facetVar, focusables, nextId, onFacetVar, onPointerOutside, type Facet } from "../utils.js";

  interface Props {
    /** the chip text (the current choice) */
    label: string;
    /** colour from the facet / pipeline palette */
    facet?: Facet;
    open?: boolean;
    /** accessible name of the popover, e.g. "choose a place" */
    title?: string;
    /** popover content, gets close() */
    children?: Snippet<[() => void]>;
    /** popover width in px or css length */
    width?: string;
    onopen?: () => void;
    onclose?: () => void;
  }
  let { label, facet, open = $bindable(false), title, children, width = "20rem", onopen, onclose }: Props = $props();

  const id = nextId("chip");
  let btn: HTMLButtonElement | undefined = $state();
  let pop: HTMLDivElement | undefined = $state();
  let shift = $state(0);

  export function close(refocus = true) {
    if (!open) return;
    open = false;
    onclose?.();
    if (refocus) btn?.focus();
  }

  function toggle() {
    if (open) close(false);
    else {
      open = true;
      onopen?.();
    }
  }

  $effect(() => {
    if (!open) return;
    shift = 0;
    queueMicrotask(() => {
      // keep the popover on screen
      if (pop && typeof window !== "undefined") {
        const r = pop.getBoundingClientRect();
        const over = r.right - (window.innerWidth - 8);
        if (over > 0) shift = -Math.min(over, Math.max(0, r.left - 8));
      }
      focusables(pop)[0]?.focus();
    });
    return onPointerOutside(() => [btn, pop], () => close(false));
  });

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && !e.defaultPrevented) {
      e.stopPropagation();
      close();
    }
  }
</script>

<span class="mbon-chip">
  <button
    bind:this={btn}
    type="button"
    class="chip"
    style:--chip-bg={facetVar(facet)}
    style:--chip-fg={onFacetVar(facet)}
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-controls={open ? id : undefined}
    onclick={toggle}
  >
    {label}<span class="caret" aria-hidden="true">▾</span>
  </button>
  {#if open}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      bind:this={pop}
      {id}
      class="pop"
      role="dialog"
      tabindex="-1"
      aria-label={title ?? label}
      style:width
      style:transform="translateX({shift}px)"
      {onkeydown}
    >
      {@render children?.(() => close())}
    </div>
  {/if}
</span>

<style>
  .mbon-chip { position: relative; display: inline-block; }
  .chip {
    display: inline-flex;
    align-items: baseline;
    vertical-align: baseline;
    gap: 0.2em;
    font: inherit;
    font-size: 0.9em;
    letter-spacing: inherit;
    color: var(--chip-fg);
    background: var(--chip-bg);
    border: 1px solid var(--facet-outline);
    border-radius: var(--radius-sm);
    padding: 0.05em 0.35em;
    margin: 0.05em 0;
    cursor: pointer;
    line-height: 1.15;
  }
  .chip:hover { filter: brightness(1.12); }
  .chip[aria-expanded="true"] { box-shadow: 0 0 0 2px var(--bg-surface), 0 0 0 4px var(--accent); }
  .caret { font-size: 0.55em; opacity: 0.85; transform: translateY(-0.2em); }
  .pop {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: var(--z-overlay);
    max-width: min(90vw, 32rem);
    padding: var(--space-3);
    background: var(--popover-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    font: var(--type-body);
    letter-spacing: normal;
    color: var(--text-body);
    text-align: left;
    white-space: normal;
  }
</style>
