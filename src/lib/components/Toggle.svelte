<!-- Toggle: an on/off switch (role="switch"); `checked` is bindable. -->
<script lang="ts">
  import { nextId } from "../utils.js";

  interface Props {
    checked?: boolean;
    label: string;
    /** small text under the label */
    hint?: string;
    disabled?: boolean;
    onchange?: (checked: boolean) => void;
  }
  let { checked = $bindable(false), label, hint, disabled = false, onchange }: Props = $props();
  const id = nextId("toggle");

  function flip() {
    if (disabled) return;
    checked = !checked;
    onchange?.(checked);
  }
</script>

<div class="mbon-toggle" class:disabled>
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby="{id}-l"
    aria-describedby={hint ? `${id}-h` : undefined}
    {disabled}
    onclick={flip}
  >
    <span class="knob"></span>
  </button>
  <span class="text">
    <span id="{id}-l" class="label">{label}</span>
    {#if hint}<span id="{id}-h" class="hint">{hint}</span>{/if}
  </span>
</div>

<style>
  .mbon-toggle { display: inline-flex; align-items: flex-start; gap: var(--space-2); }
  button {
    position: relative;
    flex: none;
    width: 2.25rem;
    height: 1.25rem;
    border-radius: var(--radius-pill);
    border: 1px solid var(--border-strong);
    background: var(--control-bg);
    padding: 0;
    cursor: pointer;
    transition: background var(--dur-fast) var(--ease-out);
  }
  .knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
    background: var(--text-muted);
    transition: transform var(--dur-base) var(--ease-out), background var(--dur-fast);
  }
  button[aria-checked="true"] { background: var(--brand); border-color: var(--brand); }
  button[aria-checked="true"] .knob { transform: translateX(1rem); background: var(--white); }
  .text { display: flex; flex-direction: column; }
  .label { font: var(--type-small); color: var(--text-heading); line-height: 1.25rem; }
  .hint { font-size: var(--text-xs); color: var(--text-muted); }
  .disabled { opacity: 0.5; }
  .disabled button { cursor: not-allowed; }
</style>
