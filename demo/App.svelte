<script lang="ts">
  import {
    Header,
    Footer,
    Pane,
    Controls,
    TimeStrip,
    Sentence,
    Chip,
    Picker,
    Legend,
    Slider,
    Select,
    Toggle,
    Menu,
    Button,
    Stat,
    type PickerItem,
    type BrushRange,
  } from "@marinebon/ui";
  import Gallery from "./Gallery.svelte";

  const datasets: PickerItem[] = [
    { id: "obis", label: "OBIS occurrences", group: "Portals", count: 142000000, keywords: "biodiversity" },
    { id: "gbif", label: "GBIF marine", group: "Portals", count: 98000000 },
    { id: "erddap", label: "ERDDAP gridded", group: "Servers", count: 2140 },
    { id: "calcofi", label: "CalCOFI larvae", group: "Programs", count: 1200000 },
  ];
  const places: PickerItem[] = [
    { id: "mbnms", label: "Monterey Bay", group: "Sanctuaries", color: "#01375f" },
    { id: "fknms", label: "Florida Keys", group: "Sanctuaries", color: "#01375f" },
    { id: "cinms", label: "Channel Islands", group: "Sanctuaries", color: "#01375f" },
    { id: "pmnm", label: "Papahānaumokuākea", group: "Monuments", color: "#01375f" },
    { id: "gom", label: "Gulf of America", group: "Large marine ecosystems", color: "#15788f" },
    { id: "ccs", label: "California Current", group: "Large marine ecosystems", color: "#15788f" },
  ];
  const methods: PickerItem[] = [
    { id: "rich", label: "species richness", group: "Diversity" },
    { id: "shan", label: "Shannon index", group: "Diversity" },
    { id: "es50", label: "ES50", group: "Diversity" },
    { id: "rec", label: "record density", group: "Effort" },
  ];
  const label = (list: PickerItem[], id: string) => list.find((x) => x.id === id)?.label ?? id;

  let dataset = $state("obis");
  let place = $state("mbnms");
  let method = $state("rich");
  let res = $state("5");
  let minRecords = $state(3);
  let sanctuaries = $state(true);
  let tab = $state("dataset");
  let legendCollapsed = $state(false);
  let brushText = $state("drag across the chart");
  let brush = $state<[number, number] | null>(null);
  let stripTab = $state("plot");
  let stripExpanded = $state(false);

  const years = Array.from({ length: 26 }, (_, i) => 2000 + i);
  const counts = years.map((y, i) => Math.round(400 + 300 * Math.sin(i / 3) + i * 40 + ((y * 7919) % 97)));
  const maxCount = Math.max(...counts);

  function onbrush(r: BrushRange) {
    brushText = `${Math.round(r.v0!)}–${Math.round(r.v1!)}`;
  }

  // a hex texture for the fake map
  const hexes = Array.from({ length: 22 * 14 }, (_, k) => {
    const c = k % 22;
    const r = Math.floor(k / 22);
    const x = c * 60 + (r % 2) * 30;
    const y = r * 52;
    const v = (Math.sin(c / 3) + Math.cos(r / 2.5) + 2) / 4;
    return { x, y, v };
  });
  const ramp = ["#082336", "#15788f", "#38a7bb", "#f5b53f"];
  const color = (v: number) => ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))];
  const hexPath = "M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z";
</script>

<Header appName="UI kit" tagline="brand tokens and Svelte components for MBON web apps" appHref="./">
  {#snippet lens()}demo{/snippet}
  {#snippet help(close)}
    <span class="mbon-label">help</span>
    <a href="https://github.com/marinebon/ui#readme" onclick={close}>README</a>
    <a href="https://github.com/marinebon/ui/blob/main/AGENTS.md" onclick={close}>AGENTS.md</a>
    <a href="https://marinebon.org/brand/v1/" onclick={close}>MBON brand</a>
  {/snippet}
  {#snippet feedback()}
    <Button variant="quiet" size="sm" href="https://github.com/marinebon/ui/issues">Feedback</Button>
  {/snippet}
</Header>

<main class="demo-main" id="top">
  <span class="mbon-label">@marinebon/ui · v0.1.0</span>
  <h1 style="margin-top:var(--space-2)">MBON UI kit</h1>
  <p class="demo-lead">
    Brand tokens, self-hosted fonts and Svelte 5 components shared by MBON web apps. Every component on this page
    follows the <a href="https://marinebon.org/brand/v1/">MBON brand</a>: cobalt for the brand, teal for links and the
    active state, coral for the one call to action. Switch the theme with the toggle in the header or
    <code>?theme=dark</code>.
  </p>
  <pre class="demo-code">npm i github:marinebon/ui#v0.1.0

import "@marinebon/ui/styles.css";
import &#123; Header, Pane, Picker &#125; from "@marinebon/ui";</pre>

  <section class="demo-section">
    <span class="mbon-label">sentence · chips · panes · time strip</span>
    <h2>An app, assembled</h2>
    <div class="demo-sentence">
      <Sentence>
        <Chip label={label(methods, method)} facet="method" title="choose a method">
          {#snippet children(close)}<Picker items={methods} bind:value={method} label="methods" onselect={() => close()} />{/snippet}
        </Chip>
        of
        <Chip label={label(datasets, dataset)} facet="dataset" title="choose a dataset">
          {#snippet children(close)}<Picker items={datasets} bind:value={dataset} label="datasets" onselect={() => close()} />{/snippet}
        </Chip>
        in
        <Chip label={label(places, place)} facet="place" title="choose a place">
          {#snippet children(close)}<Picker items={places} bind:value={place} label="places" onselect={() => close()} />{/snippet}
        </Chip>
        {#snippet sub()}
          <Legend domain={[0, 1200]} ticks={[600]} title="species per hexagon" />
          <span class="mbon-mono">1,284 hexagons · 18,204 species · {brushText}</span>
        {/snippet}
      </Sentence>
    </div>

    <div class="demo-stage">
      <svg class="demo-hex" viewBox="0 0 1300 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {#each hexes as h, i (i)}<path d={hexPath} transform="translate({h.x},{h.y})" fill={color(h.v)} stroke="rgba(255,255,255,0.35)" stroke-width="1" />{/each}
      </svg>

      <Controls
        id="demo-controls"
        tabs={[
          { id: "dataset", label: "dataset" },
          { id: "place", label: "place" },
          { id: "method", label: "method" },
          { id: "delivery", label: "delivery" },
        ]}
        bind:active={tab}
        fill
      >
        {#snippet panel(id)}
          {#if id === "dataset"}
            <Picker items={datasets} bind:value={dataset} label="datasets" maxHeight="12rem" fill />
          {:else if id === "place"}
            <Picker items={places} bind:value={place} label="places" maxHeight="12rem" fill />
          {:else if id === "method"}
            <div style="display:flex;flex-direction:column;gap:var(--space-4)">
              <Picker items={methods} bind:value={method} label="methods" maxHeight="9rem" />
              <Select label="Resolution" bind:value={res} options={[{ value: "3", label: "H3 res 3" }, { value: "5", label: "H3 res 5" }, { value: "7", label: "H3 res 7" }]} />
              <Slider label="Min records" bind:value={minRecords} min={1} max={10} ticks={[1, 5, 10]} />
            </div>
          {:else}
            <div style="display:flex;flex-direction:column;gap:var(--space-3);align-items:flex-start">
              <Toggle bind:checked={sanctuaries} label="Sanctuary outlines" />
              <Button variant="action">Download GeoParquet</Button>
            </div>
          {/if}
        {/snippet}
        {#snippet footer()}OBIS 2026-09 · 142 M records{/snippet}
      </Controls>

      <Pane title="legend" id="demo-legend" anchor="top-right" width={240} bind:collapsed={legendCollapsed}>
        {#snippet actions()}
          <Menu label="Export" align="end">
            {#snippet children(close)}
              <button type="button" onclick={close}>PNG</button>
              <button type="button" onclick={close}>SVG</button>
            {/snippet}
          </Menu>
        {/snippet}
        <div style="display:flex;flex-direction:column;gap:var(--space-4)">
          <Legend domain={[0, 1200]} ticks={[600]} title="richness" />
          <Stat value={18204} label="species" />
        </div>
      </Pane>

      <TimeStrip title="records per year" tabs={[{ id: "plot", label: "Plot" }, { id: "table", label: "Table" }]} bind:active={stripTab} bind:expanded={stripExpanded} domain={[2000, 2026]} bind:brush {onbrush} onclear={() => (brushText = "drag across the chart")} height={110}>
        {#snippet children({ width, height })}
          {#if stripTab === "plot"}
          <svg {width} {height} aria-hidden="true" style="display:block">
            {#each counts as c, i (i)}
              {@const bw = width / counts.length}
              <rect x={i * bw + 1} y={height - (c / maxCount) * (height - 14)} width={Math.max(1, bw - 2)} height={(c / maxCount) * (height - 14)} fill="var(--teal-600)" opacity="0.85" />
            {/each}
            <text x="0" y="10" font-size="10" font-family="var(--font-mono)" fill="var(--text-muted)">2000</text>
            <text x={width} y="10" font-size="10" font-family="var(--font-mono)" fill="var(--text-muted)" text-anchor="end">2025</text>
          </svg>
          {:else}
            <table class="demo-table">
              <thead><tr><th scope="col">year</th><th scope="col">records</th></tr></thead>
              <tbody>
                {#each counts as c, i (i)}<tr><td>{2000 + i}</td><td>{c.toLocaleString()}</td></tr>{/each}
              </tbody>
            </table>
          {/if}
        {/snippet}
      </TimeStrip>
    </div>
  </section>

  <section class="demo-section">
    <span class="mbon-label">controls · light and dark</span>
    <h2>Components in both themes</h2>
    <div class="demo-pair">
      <Gallery theme="light" />
      <Gallery theme="dark" />
    </div>
  </section>

  <section class="demo-section">
    <span class="mbon-label">tokens</span>
    <h2>Colour</h2>
    <div class="demo-swatches">
      {#each [["--brand", "cobalt-500 · brand"], ["--cobalt-600", "cobalt-600 · hover"], ["--teal-400", "teal-400 · accent"], ["--teal-600", "teal-600 · link, label"], ["--coral-500", "coral-500 · the one CTA"], ["--sun-400", "sun-400 · data highlight"], ["--navy-700", "navy-700 · dark surface"], ["--abyss-800", "abyss-800"], ["--abyss-900", "abyss-900"], ["--ink-900", "ink-900"], ["--ink-500", "ink-500 · body"], ["--line-200", "line-200 · borders"], ["--foam-100", "foam-100 · tint"], ["--foam-50", "foam-50 · page"]] as [v, name] (v)}
        <div class="demo-swatch"><div style:background="var({v})"></div><p>{name}</p></div>
      {/each}
    </div>
    <h3 style="margin-top:var(--space-5)">Facets and pipeline</h3>
    <div class="demo-swatches">
      {#each ["place", "method", "org", "type", "portal", "content", "topic"] as f (f)}
        <div class="demo-swatch"><div style:background="var(--facet-{f})"></div><p>facet-{f}</p></div>
      {/each}
      {#each ["dataset", "place", "method", "delivery"] as p (p)}
        <div class="demo-swatch"><div style:background="var(--pipe-{p})"></div><p>pipe-{p}</p></div>
      {/each}
    </div>
    <h3 style="margin-top:var(--space-5)">Type</h3>
    <div class="demo-type">
      <p style="font:var(--fw-bold) var(--text-4xl)/1 var(--font-display);color:var(--text-strong);letter-spacing:var(--ls-tight)">142,000,000</p>
      <h1>Space Grotesk 48 · titles</h1>
      <h2>Space Grotesk 36 · section</h2>
      <h3>Space Grotesk 28 · subhead</h3>
      <p style="font:var(--type-lead)">IBM Plex Sans 18 · lead body, <em>with italic</em>.</p>
      <p>IBM Plex Sans 16 · body and UI. <a href="#top">A teal link.</a></p>
      <p class="mbon-mono" style="font-size:var(--text-sm)">IBM Plex Mono 14 · 36.80°N 121.90°W · res 5 · 8528a7fffffffff</p>
      <span class="mbon-label">IBM Plex Mono 12 · the label</span>
    </div>
  </section>
</main>

<Footer sourceHref="https://github.com/marinebon/ui">
  {#snippet release()}@marinebon/ui v0.1.0{/snippet}
  {#snippet timing()}demo data, no network{/snippet}
</Footer>
