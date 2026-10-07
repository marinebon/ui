# AGENTS.md: adding a control to an MBON app with @marinebon/ui

For agents (and people) changing erddap-places, obis-hex or any other MBON app that imports
`@marinebon/ui`. Read this before adding a button, a picker or a panel. Component props and snippets
are in [README.md](README.md); the demo at <https://marinebon.org/ui/> shows each one.

## Rules that do not bend

1. **One brand colour, one accent, one call to action.** Cobalt (`--brand`) for buttons and the
   logo; teal (`--accent`, `--link`) for links and the active state; coral (`--action`,
   `<Button variant="action">`) for the single most important action on screen, usually Download.
   Do not add a second coral button, a second accent colour, or a new hex value. If you need a
   colour, it is already a token (`tokens.css`); categories use the facet palette in order
   (place, method, org, type, portal, content, topic).
2. **Never a stripe, never a line under a title.** No coloured left border on a card or notice, no
   `border-bottom` under a heading. Separate with space, a surface change (`--bg-tint`), or a mono
   label (`.mbon-label`) on top.
3. **Labels are mono.** A section or pane title is `.mbon-label` (IBM Plex Mono 12 px, uppercase,
   0.14em, teal-600). Big numbers are `Stat` (Space Grotesk). Body text is IBM Plex Sans.
4. **Use the semantic tokens** (`--bg-surface`, `--text-body`, `--border`, `--pane-bg`, …), never the
   raw palette, in app CSS, so `[data-theme=dark]` keeps working. Check every change in both themes
   (`?theme=dark`).
5. **The pipeline order is dataset → place → method → delivery.** Tabs in `Controls`, chips in the
   title `Sentence`, and `PipelineChips` all follow it, with these colours: dataset `#6d4aa7`,
   place `#01375f`, method `#15788f`, delivery `#f2683f`.
6. **Keyboard and screen reader first.** Every control must be reachable with Tab, operable with
   Enter/Space/arrows, and named (a visible label or `aria-label`). The kit's components already do
   this; do not wrap them in clickable `<div>`s.

## Which component for which job

| job | component | notes |
|---|---|---|
| app chrome: logo, app name, help, feedback, theme | `Header` | `lens` slot for the current mode word; Help items go in the `help` snippet |
| credits, data release, timings, source link | `Footer` | keep it one line; "built by Ocean Metrics" is built in |
| the title that says what the map shows | `Sentence` + `Chip` | each variable part of the title is a Chip; its popover holds the same picker as the Controls tab |
| choose one of many (datasets, places, metrics) | `Picker` | give `group` for a "by group" view, `count` when known, `color` for facet swatches |
| choose one of a few (≤ 7) fixed options | `Select` | or a row of `Button variant="quiet" pressed` for 2–3 options |
| on/off | `Toggle` | |
| a number in a range (year, threshold, opacity) | `Slider` | `ticks` for landmarks; ± buttons step precisely |
| the step-by-step control panel | `Controls` | one tab per pipeline step, numbered ① ② ③ ④ |
| any other floating panel (legend, details, table) | `Pane` | give it an `id` so its position is remembered; bind `open`/`collapsed`/`expanded` to the URL state |
| export / download options | `Menu` in a Pane's `actions` slot | the one coral Download button lives in the delivery tab |
| colour scale | `Legend` | continuous for numbers, categorical for classes; put one in the Sentence `sub` line |
| a status line (slow server, empty result, error) | `Notice` | one line; `error` is announced |
| a headline number | `Stat` | |
| a time chart with a range brush | `TimeStrip` | the chart is yours (slot); the strip gives you `onbrush`/`onbrushend` with `v0`/`v1` |
| keyboard hints in help text | `Kbd` | |

If no component fits, compose existing ones and the tokens before writing new CSS. A new widget that
two apps need belongs in this kit, not in an app.

## Adding a control: the sequence

1. **Decide the pipeline step** it belongs to: dataset (what data), place (where), method (how it is
   summarised: metric, resolution, thresholds, time), or delivery (how it leaves: map style,
   download, link). That decides the Controls tab.
2. **Add it to that tab's `panel` snippet** with the component from the table above, bound to the app
   state (`bind:value`, `bind:checked`).
3. **If it changes what the map means, add it to the title Sentence** as a Chip whose popover shows
   the same control (reuse the component, not a copy of the logic).
4. **Put the state in the URL** the same way the app's other controls do (the Pane and Picker states
   are bindable for this).
5. **Show the effect** in the Sentence `sub` line or the Footer (counts, sources, timings) rather than
   in a new panel.
6. **Test**: keyboard only (Tab to it, operate it, Esc out of any popover), both themes, and phone
   width (390 px), where panes become stacked bottom sheets.

## Example: a "minimum records" threshold in obis-hex

```svelte
<!-- method tab of Controls -->
{#snippet panel(id)}
  {#if id === "method"}
    <Picker items={metrics} bind:value={state.metric} label="metrics" />
    <Slider label="Min records" bind:value={state.minRecords} min={1} max={50} ticks={[1, 10, 50]} />
  {/if}
{/snippet}

<!-- the title says it too -->
<Sentence>
  <Chip label={metricLabel} facet="method">{#snippet children(close)}<Picker items={metrics} bind:value={state.metric} label="metrics" onselect={() => close()} />{/snippet}</Chip>
  where hexagons have at least
  <Chip label={String(state.minRecords)} facet="method" width="16rem">{#snippet children()}<Slider label="Min records" bind:value={state.minRecords} min={1} max={50} />{/snippet}</Chip>
  records
</Sentence>
```

## Updating the kit itself

Change `src/lib/`, add or update a test in `tests/`, run `npm test`, `npm run check`,
`npm run package` (commits `dist/`), `npm run screenshots`, add a `NEWS.md` entry with the version
bump, tag `vX.Y.Z`. Apps move to the new tag in their `package.json`.
