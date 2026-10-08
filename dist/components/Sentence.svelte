<!--
  Sentence: the title line, plain words and Chips, with a second line slot (`sub`) for the
  colour scale and counts.
-->
<script lang="ts">let { level = 1, size = "md", children, sub } = $props();
export {};
</script>

<div class="mbon-sentence {size}">
  <div class="line" role="heading" aria-level={level}>{@render children()}</div>
  {#if sub}<div class="sub">{@render sub()}</div>{/if}
</div>

<style>
  .mbon-sentence { display: flex; flex-direction: column; gap: var(--space-2); }
  .line {
    font-family: var(--font-display);
    font-weight: var(--fw-semibold);
    font-size: var(--text-lg);
    line-height: 1.35;
    letter-spacing: var(--ls-tight);
    color: var(--text-heading);
    text-wrap: balance;
  }
  .lg .line { font-size: var(--text-xl); }
  .sub {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-5);
    font: var(--type-small);
    color: var(--text-body);
  }
  @media (max-width: 640px) {
    .line { font-size: var(--text-md); }
    .lg .line { font-size: var(--text-lg); }
  }
</style>
