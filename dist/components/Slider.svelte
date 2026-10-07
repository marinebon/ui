<!--
  Slider: a range input with a mono label, the current value, optional ticks and ± step buttons.
  `value` is bindable.
-->
<script lang="ts">import { clamp, nextId } from "../utils.js";
let { value = $bindable(0), min = 0, max = 100, step = 1, label, ticks = [], format = (v) => String(v), buttons = true, disabled = false, oninput } = $props();
const id = nextId("slider");
const norm = $derived(ticks.map((t) => typeof t === "number" ? {
	value: t,
	label: format(t)
} : t));
const pct = (v) => (v - min) / (max - min || 1) * 100;
function nudge(dir) {
	const decimals = (String(step).split(".")[1] ?? "").length;
	value = +clamp(value + dir * step, min, max).toFixed(decimals);
	oninput?.(value);
}
</script>

<div class="mbon-slider" class:disabled>
  <div class="head">
    <label for={id} class="mbon-label">{label}</label>
    <output for={id} class="val">{format(value)}</output>
  </div>
  <div class="row">
    {#if buttons}
      <button type="button" class="pm" aria-label="decrease {label}" disabled={disabled || value <= min} onclick={() => nudge(-1)}>−</button>
    {/if}
    <div class="track">
      <input
        {id}
        type="range"
        {min}
        {max}
        {step}
        {disabled}
        bind:value
        aria-valuetext={format(value)}
        oninput={() => oninput?.(value)}
        style:--fill="{pct(value)}%"
      />
      {#if norm.length}
        <div class="ticks" aria-hidden="true">
          {#each norm as t (t.value)}
            <span class="tick" style:left="{pct(t.value)}%"><span class="tl">{t.label}</span></span>
          {/each}
        </div>
      {/if}
    </div>
    {#if buttons}
      <button type="button" class="pm" aria-label="increase {label}" disabled={disabled || value >= max} onclick={() => nudge(1)}>+</button>
    {/if}
  </div>
</div>

<style>
  .mbon-slider { display: flex; flex-direction: column; gap: var(--space-1); min-width: 12rem; }
  .head { display: flex; justify-content: space-between; align-items: baseline; }
  .val { font: var(--fw-semibold) var(--text-sm) / 1 var(--font-mono); color: var(--text-strong); }
  .row { display: flex; align-items: flex-start; gap: var(--space-2); }
  .track { position: relative; flex: 1; padding-bottom: 1.3rem; }
  input[type="range"] {
    width: 100%;
    margin: 0.35rem 0 0;
    appearance: none;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(to right, var(--brand) var(--fill), var(--border-strong) var(--fill));
    cursor: pointer;
  }
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--bg-surface);
    border: 2px solid var(--brand);
  }
  input[type="range"]::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--bg-surface);
    border: 2px solid var(--brand);
  }
  .ticks { position: absolute; left: 8px; right: 8px; top: 1.05rem; height: 1rem; }
  .tick { position: absolute; top: 0; width: 1px; height: 5px; background: var(--border-strong); }
  .tl { position: absolute; top: 6px; transform: translateX(-50%); font: var(--text-xs) / 1 var(--font-mono); color: var(--text-muted); white-space: nowrap; }
  .pm {
    flex: none;
    width: 1.6rem;
    height: 1.6rem;
    display: grid;
    place-items: center;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    background: var(--control-bg);
    color: var(--text-heading);
    font: var(--fw-semibold) var(--text-sm) / 1 var(--font-mono);
    cursor: pointer;
    padding: 0;
  }
  .pm:hover:not(:disabled) { background: var(--control-hover); }
  .pm:disabled { opacity: 0.4; cursor: not-allowed; }
  .disabled { opacity: 0.6; }
</style>
