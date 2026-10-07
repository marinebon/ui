<!--
  Footer: small and quiet. "built by Ocean Metrics", a release/data line slot, a timing/bytes slot,
  and a source link.
-->
<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    /** source code link */
    sourceHref?: string;
    sourceLabel?: string;
    builtByHref?: string;
    /** data release line, e.g. "OBIS export 2026-09 · 142 M records" */
    release?: Snippet;
    /** timing / bytes, e.g. "query 212 ms · 3.1 MB" */
    timing?: Snippet;
    children?: Snippet;
  }
  let { sourceHref, sourceLabel = "source", builtByHref = "https://oceanmetrics.io", release, timing, children }: Props = $props();
</script>

<footer class="mbon-footer">
  <span class="item">built by <a href={builtByHref}>Ocean Metrics</a></span>
  {#if release}<span class="item">{@render release()}</span>{/if}
  {#if timing}<span class="item timing">{@render timing()}</span>{/if}
  {#if children}<span class="item">{@render children()}</span>{/if}
  {#if sourceHref}<span class="item"><a href={sourceHref}>{sourceLabel}</a></span>{/if}
</footer>

<style>
  .mbon-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 var(--space-2);
    padding: var(--space-2) var(--space-4);
    font: var(--fw-regular) var(--text-xs) / 1.6 var(--font-mono);
    color: var(--text-muted);
  }
  .item + .item::before { content: "·"; margin-right: var(--space-2); color: var(--text-muted); }
  .timing { font-variant-numeric: tabular-nums; }
  a { color: var(--text-body); }
  a:hover { color: var(--link); }
</style>
