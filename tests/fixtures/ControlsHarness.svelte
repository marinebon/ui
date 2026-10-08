<script lang="ts">
  import Controls from "../../src/lib/components/Controls.svelte";
  import type { ControlsTab } from "../../src/lib/types.js";

  const tabs: ControlsTab[] = [
    { id: "dataset", label: "Dataset" },
    { id: "place", label: "Place" },
    { id: "method", label: "Method" },
    { id: "delivery", label: "Delivery" },
  ];
  let active = $state("dataset");
</script>

<Controls {tabs} bind:active>
  {#snippet panel(id)}<p>panel for {id}</p>{/snippet}
</Controls>
<output data-testid="active">{active}</output>
