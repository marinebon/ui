<script lang="ts">
  import Pane from "../../src/lib/components/Pane.svelte";
  import TimeStrip from "../../src/lib/components/TimeStrip.svelte";
  let { strip = true }: { strip?: boolean } = $props();
  let expanded = $state(false);
</script>

<div data-stage style="position: relative; width: 1000px; height: 600px">
  <Pane title="controls"><p>pane body</p></Pane>
  {#if strip}
    <TimeStrip title="series" bind:expanded>
      {#snippet children()}<p>the plot</p>{/snippet}
    </TimeStrip>
  {/if}
</div>
