<!-- ThemeToggle: switch light/dark; persists the choice (theme.ts). -->
<script lang="ts">
  import { onMount } from "svelte";
  import { currentTheme, onThemeChange, toggleTheme, type Theme } from "../theme.js";

  let theme = $state<Theme>("light");
  onMount(() => {
    theme = currentTheme();
    return onThemeChange((t) => (theme = t));
  });
  const next = $derived(theme === "dark" ? "light" : "dark");
</script>

<button
  type="button"
  class="mbon-theme-toggle"
  aria-label="Switch to {next} theme"
  title="Switch to {next} theme"
  onclick={() => (theme = toggleTheme())}
>
  {#if theme === "dark"}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor" /><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></g></svg>
  {:else}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" /></svg>
  {/if}
</button>

<style>
  .mbon-theme-toggle {
    display: inline-grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-heading);
    cursor: pointer;
    padding: 0;
  }
  .mbon-theme-toggle:hover { background: var(--control-hover); }
</style>
