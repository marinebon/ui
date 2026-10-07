<!--
  Legend: a continuous colour bar with domain labels, or a categorical swatch list.
-->
<script lang="ts">let { type = "continuous", title, colors = [
	"#082336",
	"#15788f",
	"#38a7bb",
	"#f5b53f"
], domain = [0, 1], ticks = [], format = (v) => Math.abs(v) >= 1e3 ? v.toLocaleString(undefined, { maximumFractionDigits: 0 }) : String(+v.toPrecision(3)), unit, items = [], onselect } = $props();
const gradient = $derived(`linear-gradient(to right, ${colors.join(", ")})`);
const pct = (v) => (v - domain[0]) / (domain[1] - domain[0] || 1) * 100;
const desc = $derived(`${title ?? "colour scale"} from ${format(domain[0])} to ${format(domain[1])}${unit ? " " + unit : ""}`);
export {};
</script>

<div class="mbon-legend {type}">
  {#if title}<span class="mbon-label">{title}</span>{/if}
  {#if type === "continuous"}
    <div class="bar" style:background={gradient} role="img" aria-label={desc}></div>
    <div class="labels" aria-hidden="true">
      <span class="lo">{format(domain[0])}</span>
      {#each ticks as t (t)}
        <span class="tick" style:left="{pct(t)}%">{format(t)}</span>
      {/each}
      <span class="hi">{format(domain[1])}{unit ? ` ${unit}` : ""}</span>
    </div>
  {:else}
    <ul>
      {#each items as it (it.label)}
        <li>
          {#if onselect}
            <button type="button" class="item" onclick={() => onselect(it)}>
              <span class="sw" style:background={it.color}></span><span class="lab">{it.label}</span>{#if it.count != null}<span class="n">{it.count.toLocaleString()}</span>{/if}
            </button>
          {:else}
            <span class="item">
              <span class="sw" style:background={it.color}></span><span class="lab">{it.label}</span>{#if it.count != null}<span class="n">{it.count.toLocaleString()}</span>{/if}
            </span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .mbon-legend { display: flex; flex-direction: column; gap: var(--space-1); min-width: 10rem; }
  .bar { height: 10px; border-radius: var(--radius-xs); border: 1px solid var(--border); }
  .labels { position: relative; height: 1.1em; font: var(--fw-regular) var(--text-xs) / 1 var(--font-mono); color: var(--text-body); }
  .lo { position: absolute; left: 0; }
  .hi { position: absolute; right: 0; }
  .tick { position: absolute; transform: translateX(-50%); }
  ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--space-1) var(--space-3); }
  .item {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font: var(--type-small);
    color: var(--text-body);
    background: none;
    border: 0;
    padding: 0;
  }
  button.item { cursor: pointer; border-radius: var(--radius-xs); }
  button.item:hover .lab { color: var(--text-strong); }
  .sw { width: 0.8rem; height: 0.8rem; border-radius: 3px; border: 1px solid rgba(0, 0, 0, 0.12); }
  .n { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); }
</style>
