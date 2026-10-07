<!--
  Menu: a small disclosure menu (e.g. Help ▾, Export ▾). the content is a slot: put links and
  buttons in it, they get menu-row styling. arrow keys move between them, Esc closes and returns
  focus to the trigger. `open` is bindable.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { focusables, nextId, onPointerOutside } from "../utils.js";

  interface Props {
    label: string;
    open?: boolean;
    align?: "start" | "end";
    /** quiet (default) or plain (text-only, for headers) trigger */
    variant?: "quiet" | "plain";
    /** an accessible name when the visible label is short, e.g. an icon */
    ariaLabel?: string;
    /** menu content; receives a close() function */
    children: Snippet<[() => void]>;
  }
  let { label, open = $bindable(false), align = "start", variant = "quiet", ariaLabel, children }: Props = $props();

  const id = nextId("menu");
  let trigger: HTMLButtonElement | undefined = $state();
  let panel: HTMLDivElement | undefined = $state();

  function close(refocus = true) {
    open = false;
    if (refocus) trigger?.focus();
  }

  $effect(() => {
    if (!open) return;
    queueMicrotask(() => focusables(panel)[0]?.focus());
    return onPointerOutside(() => [trigger, panel], () => close(false));
  });

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
      const list = focusables(panel);
      if (!list.length) return;
      e.preventDefault();
      const i = list.indexOf(document.activeElement as HTMLElement);
      const n = list.length;
      const next =
        e.key === "Home" ? 0 : e.key === "End" ? n - 1 : e.key === "ArrowDown" ? (i + 1) % n : (i - 1 + n) % n;
      list[next].focus();
    }
    if (e.key === "Tab") open = false;
  }
</script>

<div class="mbon-menu">
  <button
    bind:this={trigger}
    type="button"
    class="trigger {variant}"
    aria-expanded={open}
    aria-controls={id}
    aria-label={ariaLabel}
    onclick={() => (open = !open)}
    onkeydown={(e) => {
      if (e.key === "ArrowDown" && !open) {
        e.preventDefault();
        open = true;
      }
    }}
  >
    {label}<span class="caret" aria-hidden="true">▾</span>
  </button>
  {#if open}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div bind:this={panel} {id} class="panel {align}" {onkeydown}>
      {@render children(() => close())}
    </div>
  {/if}
</div>

<style>
  .mbon-menu { position: relative; display: inline-block; }
  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    font: var(--fw-medium) var(--text-sm) / 1 var(--font-sans);
    color: var(--text-heading);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.5em 0.75em;
    cursor: pointer;
  }
  .trigger.plain { border-color: transparent; }
  .trigger:hover, .trigger[aria-expanded="true"] { background: var(--control-hover); }
  .caret { font-size: 0.8em; color: var(--text-muted); }
  .panel {
    position: absolute;
    top: calc(100% + 4px);
    z-index: var(--z-overlay);
    min-width: 12rem;
    padding: var(--space-1);
    background: var(--popover-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    font: var(--type-small);
    color: var(--text-body);
    text-align: left;
  }
  .panel.start { left: 0; }
  .panel.end { right: 0; }
  .panel :global(:is(a, button)) {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5em 0.75em;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-heading);
    font: inherit;
    text-decoration: none;
    cursor: pointer;
  }
  .panel :global(:is(a, button):hover), .panel :global(:is(a, button):focus-visible) { background: var(--control-hover); text-decoration: none; }
  .panel :global(hr) { margin: var(--space-1) 0; }
  .panel :global(.mbon-label) { padding: 0.5em 0.75em 0.25em; }
</style>
