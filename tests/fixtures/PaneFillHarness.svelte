<script lang="ts">
  import Controls from "../../src/lib/components/Controls.svelte";
  import Picker from "../../src/lib/components/Picker.svelte";
  import TimeStrip from "../../src/lib/components/TimeStrip.svelte";
  import type { PaneAnchor } from "../../src/lib/types.js";
  let { fill = true, anchor = "top-left" as PaneAnchor }: { fill?: boolean; anchor?: PaneAnchor } = $props();
  let collapsed = $state(false);
</script>

<div data-stage style="position: relative; width: 1000px; height: 600px">
  <Controls title="controls" {fill} {anchor} width={320} bind:collapsed tabs={[{ id: "a", label: "A" }]}>
    {#snippet panel()}
      <div class="mbon-fill"><Picker fill label="things" items={[{ id: "x", label: "X" }]} /></div>
    {/snippet}
  </Controls>
  <TimeStrip title="series">
    {#snippet children()}<p>the plot</p>{/snippet}
  </TimeStrip>
</div>
