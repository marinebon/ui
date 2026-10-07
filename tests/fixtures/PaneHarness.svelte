<script lang="ts">
  import Pane from "../../src/lib/components/Pane.svelte";
  let { onstate }: { onstate?: (s: { open: boolean; collapsed: boolean; expanded: boolean }) => void } = $props();
  let open = $state(true);
  let collapsed = $state(false);
  let expanded = $state(false);
  $effect(() => onstate?.({ open, collapsed, expanded }));
</script>

<div style="position: relative; width: 800px; height: 600px">
  <Pane title="layers" id="test" bind:open bind:collapsed bind:expanded>
    <p>pane body</p>
    <button type="button">inner</button>
  </Pane>
</div>
