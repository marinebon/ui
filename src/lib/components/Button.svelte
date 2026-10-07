<!--
  Button: primary (cobalt), action (coral, the ONE call to action, keep it rare), quiet.
  renders an <a> when `href` is given.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLButtonAttributes, "children"> {
    variant?: "primary" | "action" | "quiet";
    size?: "sm" | "md";
    href?: string;
    target?: string;
    pressed?: boolean;
    children?: Snippet;
  }

  let {
    variant = "primary",
    size = "md",
    href,
    target,
    pressed,
    type = "button",
    children,
    class: cls = "",
    ...rest
  }: Props = $props();
</script>

{#if href}
  <a class="mbon-btn {variant} {size} {cls}" {href} {target} rel={target === "_blank" ? "noopener" : undefined}>
    {@render children?.()}
  </a>
{:else}
  <button class="mbon-btn {variant} {size} {cls}" {type} aria-pressed={pressed} {...rest}>
    {@render children?.()}
  </button>
{/if}

<style>
  .mbon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font: var(--fw-semibold) var(--text-sm) / 1 var(--font-sans);
    padding: 0.6em 1.05em;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background var(--dur-fast) var(--ease-out),
      border-color var(--dur-fast) var(--ease-out),
      color var(--dur-fast) var(--ease-out);
  }
  .sm { font-size: var(--text-xs); padding: 0.5em 0.8em; }
  .mbon-btn:hover { text-decoration: none; }
  .mbon-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .primary { background: var(--brand); color: var(--on-brand); }
  .primary:hover:not(:disabled) { background: var(--brand-hover); color: var(--on-brand); }

  .action { background: var(--action); color: var(--on-action); }
  .action:hover:not(:disabled) { background: var(--action-hover); color: var(--on-action); }

  .quiet { background: transparent; color: var(--text-heading); border-color: var(--border); }
  .quiet:hover:not(:disabled) { background: var(--control-hover); color: var(--text-strong); }
  .quiet[aria-pressed="true"] { background: var(--selected-bg); border-color: var(--accent); }
</style>
