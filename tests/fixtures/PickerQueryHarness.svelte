<script lang="ts">
  // a Picker whose search text the app reads: the "always" row is built from it
  import Picker from "../../src/lib/components/Picker.svelte";
  import type { PickerItem } from "../../src/lib/types.js";

  let { items, queryLimit = 2 }: { items: PickerItem[]; queryLimit?: number } = $props();
  let query = $state("");
  const all = $derived([
    ...items,
    { id: "any", label: query ? `Search everything for “${query}”…` : "Search everything…", group: "Any", match: "always" as const },
  ]);
</script>

<Picker items={all} bind:query {queryLimit} label="taxa" />
<output data-testid="q">{query}</output>
