<script lang="ts">
  import Sentence from "../../src/lib/components/Sentence.svelte";
  import Chip from "../../src/lib/components/Chip.svelte";
  import Picker from "../../src/lib/components/Picker.svelte";
  import type { PickerItem } from "../../src/lib/types.js";

  const places: PickerItem[] = [
    { id: "mb", label: "Monterey Bay", group: "Sanctuaries" },
    { id: "fk", label: "Florida Keys", group: "Sanctuaries" },
    { id: "gom", label: "Gulf of Mexico", group: "Regions" },
  ];
  let place = $state("mb");
  const label = $derived(places.find((p) => p.id === place)?.label ?? "");
</script>

<Sentence>
  Species richness in
  <Chip label={label} facet="place" title="choose a place">
    {#snippet children(close)}
      <Picker items={places} bind:value={place} label="places" onselect={() => close()} />
    {/snippet}
  </Chip>
  since 2000
  {#snippet sub()}<span>42 hexagons</span>{/snippet}
</Sentence>
<button type="button">outside</button>
