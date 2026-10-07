<script lang="ts">
  import { Button, Notice, Toggle, Select, Slider, Legend, PipelineChips, Stat, Kbd, Picker, Menu, type PickerItem } from "@marinebon/ui";

  let { theme }: { theme: "light" | "dark" } = $props();

  let on = $state(true);
  let res = $state("5");
  let year = $state(2015);
  let picked = $state<string | null>("rich");
  let step = $state<"dataset" | "place" | "method" | "delivery">("place");
  let notice = $state(true);

  const metrics: PickerItem[] = [
    { id: "rich", label: "Species richness", group: "Biodiversity", icon: "◆", count: 18204 },
    { id: "shan", label: "Shannon index", group: "Biodiversity", icon: "◆", count: 18204 },
    { id: "es50", label: "ES50", group: "Biodiversity", icon: "◆", count: 9310 },
    { id: "sst", label: "Sea surface temperature", group: "Environment", color: "#f2683f", count: 412 },
    { id: "chl", label: "Chlorophyll-a", group: "Environment", color: "#1a7a4e", count: 388, keywords: "ocean colour" },
    { id: "rec", label: "Records", group: "Effort", icon: "#", count: 142000000 },
  ];
</script>

<div class="demo-theme" data-theme={theme}>
  <span class="mbon-label">{theme} theme</span>

  <div class="demo-row">
    <Button>Primary</Button>
    <Button variant="action">Download</Button>
    <Button variant="quiet">Quiet</Button>
    <Button variant="quiet" pressed>Pressed</Button>
    <Button size="sm">Small</Button>
  </div>

  <div style="display:flex;flex-direction:column;gap:var(--space-2)">
    {#if notice}<Notice kind="info" ondismiss={() => (notice = false)}>Hexagons below 3 records are hidden.</Notice>{/if}
    <Notice kind="warn">ERDDAP server is slow; showing cached tiles.</Notice>
    <Notice kind="error">Could not read the Parquet footer.</Notice>
  </div>

  <PipelineChips values={{ dataset: "OBIS", place: "Monterey Bay", method: "richness", delivery: "map" }} active={step} onselect={(s) => (step = s)} />

  <div class="demo-grid">
    <Toggle bind:checked={on} label="Show sanctuaries" hint="NOAA ONMS boundaries" />
    <Select label="Resolution" bind:value={res} options={[{ value: "3", label: "H3 res 3 (~12,000 km²)" }, { value: "5", label: "H3 res 5 (~250 km²)" }, { value: "7", label: "H3 res 7 (~5 km²)" }]} />
  </div>
  <Slider label="Year" bind:value={year} min={2000} max={2025} ticks={[2000, 2005, 2010, 2015, 2020, 2025]} />

  <div class="demo-grid">
    <Legend title="species richness" domain={[0, 1200]} ticks={[600]} />
    <Legend
      type="categorical"
      title="facets"
      items={[
        { label: "place", color: "var(--facet-place)" },
        { label: "method", color: "var(--facet-method)" },
        { label: "org", color: "var(--facet-org)" },
        { label: "type", color: "var(--facet-type)" },
        { label: "portal", color: "var(--facet-portal)" },
        { label: "content", color: "var(--facet-content)" },
        { label: "topic", color: "var(--facet-topic)" },
      ]}
    />
  </div>

  <div class="demo-row" style="gap:var(--space-6)">
    <Stat value={18204} label="species" />
    <Stat value="142 M" label="records" note="OBIS 2026-09" />
    <Stat value={4.2} label="mean ES50" unit="σ" />
  </div>

  <div class="mbon-card">
    <span class="mbon-label">picker</span>
    <Picker items={metrics} bind:value={picked} label="metrics" maxHeight="14rem" />
  </div>

  <div class="demo-row">
    <Menu label="Export">
      {#snippet children(close)}
        <button type="button" onclick={close}>PNG image</button>
        <button type="button" onclick={close}>CSV table</button>
        <a href="#top" onclick={close}>Link to this view</a>
      {/snippet}
    </Menu>
    <span>Press <Kbd>Esc</Kbd> to restore, <Kbd>?</Kbd> for help.</span>
  </div>

  <div class="mbon-card mbon-card--tint">
    <span class="mbon-label">card</span>
    <h4 style="margin:0 0 var(--space-1)">Monterey Bay NMS</h4>
    <p style="margin:0">White or foam surface, 10–16 px radius, 1 px line-200 border, a mono label on top. No stripes.</p>
  </div>
</div>
