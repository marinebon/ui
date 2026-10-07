<!-- Kbd: a keyboard key, e.g. <Kbd>Esc</Kbd> -->
<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children?: Snippet } = $props();
</script>

<kbd class="mbon-kbd">{@render children?.()}</kbd>

<style>
  .mbon-kbd {
    display: inline-block;
    min-width: 1.6em;
    padding: 0.1em 0.45em;
    font: var(--fw-medium) 0.8em / 1.4 var(--font-mono);
    text-align: center;
    color: var(--text-heading);
    background: var(--bg-surface);
    border: 1px solid var(--border-strong);
    border-bottom-width: 2px;
    border-radius: var(--radius-xs);
  }
</style>
