<script lang="ts">
  import TimeStrip from "../../src/lib/components/TimeStrip.svelte";

  let { withTabs = true }: { withTabs?: boolean } = $props();
  const tabs = [
    { id: "plot", label: "Plot" },
    { id: "table", label: "Table" },
  ];
  let active = $state("plot");
  let expanded = $state(false);
  let height = $state(140);
  let brush = $state<[number, number] | null>(null);
</script>

<div style="position:relative;height:400px">
  <TimeStrip title="records per year" tabs={withTabs ? tabs : undefined} bind:active bind:expanded bind:height bind:brush>
    {#snippet children()}
      {#if active === "plot"}<p>the plot</p>{:else}<p>the table</p>{/if}
    {/snippet}
  </TimeStrip>
</div>
<output data-testid="active">{active}</output>
<output data-testid="expanded">{expanded}</output>
<output data-testid="height">{height}</output>
