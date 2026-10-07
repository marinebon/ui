<!--
  Notice: a one-line info / warn / error message. errors are announced assertively.
-->
<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    kind?: "info" | "warn" | "error";
    children?: Snippet;
    /** show a dismiss button and call this when pressed */
    ondismiss?: () => void;
  }
  let { kind = "info", children, ondismiss }: Props = $props();
  const ICON = { info: "i", warn: "!", error: "×" } as const;
</script>

<div class="mbon-notice {kind}" role={kind === "error" ? "alert" : "status"}>
  <span class="icon" aria-hidden="true">{ICON[kind]}</span>
  <span class="msg">{@render children?.()}</span>
  {#if ondismiss}
    <button type="button" class="x" aria-label="Dismiss" onclick={ondismiss}>×</button>
  {/if}
</div>

<style>
  .mbon-notice {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    font: var(--type-small);
    color: var(--text-strong);
    border: 1px solid var(--border);
  }
  .info { background: var(--notice-info-bg); }
  .warn { background: var(--notice-warn-bg); }
  .error { background: var(--notice-err-bg); }
  .icon {
    flex: none;
    display: inline-grid;
    place-items: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    font: var(--fw-bold) var(--text-xs) / 1 var(--font-mono);
    color: var(--white);
  }
  .info .icon { background: var(--info); }
  .warn .icon { background: var(--warn); }
  .error .icon { background: var(--err); }
  .msg { flex: 1; min-width: 0; }
  .x {
    flex: none;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    padding: 0 var(--space-1);
  }
  .x:hover { color: var(--text-strong); }
</style>
