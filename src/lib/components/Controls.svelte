<!--
  Controls: a Pane with numbered tabs (① ② ③ ④). tab labels and panels are slots; ← → Home End
  move between tabs (automatic activation). `active` (tab id) and the Pane states are bindable.
  by convention the tabs follow the pipeline: dataset → place → method → delivery.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ControlsTab, PaneAnchor } from "../types.js";
  import { nextId } from "../utils.js";
  import TabStrip from "./TabStrip.svelte";
  import Pane from "./Pane.svelte";

  interface Props {
    tabs: ControlsTab[];
    active?: string;
    /** panel content for the active tab id */
    panel: Snippet<[string]>;
    /** custom tab label (default: tab.label) */
    tabLabel?: Snippet<[ControlsTab, number]>;
    /** counts / sources line */
    footer?: Snippet;
    actions?: Snippet;
    title?: string;
    id?: string;
    open?: boolean;
    collapsed?: boolean;
    expanded?: boolean;
    anchor?: PaneAnchor;
    offset?: { x: number; y: number };
    width?: number;
    height?: number;
    numbered?: boolean;
    onchange?: (id: string) => void;
  }
  let {
    tabs,
    active = $bindable(undefined),
    panel,
    tabLabel,
    footer,
    actions,
    title = "controls",
    id,
    open = $bindable(true),
    collapsed = $bindable(false),
    expanded = $bindable(false),
    anchor = "top-left",
    offset,
    width = 340,
    height,
    numbered = true,
    onchange,
  }: Props = $props();

  const uid = nextId("controls");
  const current = $derived(active ?? tabs[0]?.id);
  const panelId = `${uid}-panel`;
</script>

<Pane {title} {id} bind:open bind:collapsed bind:expanded {anchor} {offset} {width} {height} {actions} {footer}>
  <div class="mbon-controls">
    <TabStrip {tabs} bind:active idPrefix={uid} {panelId} label={title} {numbered} {tabLabel} {onchange} />
    <div class="panel" role="tabpanel" id={panelId} aria-labelledby="{uid}-tab-{current}" tabindex="-1">
      {#if current}{@render panel(current)}{/if}
    </div>
  </div>
</Pane>

<style>
  .mbon-controls { display: flex; flex-direction: column; gap: var(--space-3); }
  .panel { min-height: 4rem; }
  .panel:focus { outline: none; }
</style>
