<!--
  Header: MBON wordmark (links to marinebon.org), app name + one-line tagline, a `lens` slot for the
  current lens/mode word, and on the right a Help ▾ menu (`help` slot), a `feedback` slot and the
  theme toggle.
-->
<script lang="ts">import logo from "../img/mbon-logo.png";
import logoWhite from "../img/mbon-logo-white.png";
import Menu from "./Menu.svelte";
import ThemeToggle from "./ThemeToggle.svelte";
let { appName, tagline, appHref, logoHref = "https://marinebon.org", tone = "light", lens, help, helpLabel = "Help", feedback, right, themeToggle = true } = $props();
</script>

<header class="mbon-header {tone}" data-theme={tone === "navy" ? "dark" : undefined}>
  <a class="logo" href={logoHref} aria-label="MBON, Marine Biodiversity Observation Network (marinebon.org)">
    <img class="logo-dark" src={logo} alt="" width="586" height="60" />
    <img class="logo-white" src={logoWhite} alt="" width="586" height="60" />
  </a>
  <div class="app">
    <div class="name-row">
      {#if appHref}<a class="name" href={appHref}>{appName}</a>{:else}<span class="name">{appName}</span>{/if}
      {#if lens}<span class="lens">{@render lens()}</span>{/if}
    </div>
    {#if tagline}<p class="tagline">{tagline}</p>{/if}
  </div>
  <div class="right">
    {#if right}{@render right()}{/if}
    {#if help}
      <Menu label={helpLabel} align="end" variant="plain">
        {#snippet children(close)}{@render help(close)}{/snippet}
      </Menu>
    {/if}
    {#if feedback}{@render feedback()}{/if}
    {#if themeToggle}<ThemeToggle />{/if}
  </div>
</header>

<style>
  .mbon-header {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-2) var(--space-4);
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    color: var(--text-body);
    min-height: 56px;
  }
  .mbon-header.navy { background: var(--navy-700); border-bottom-color: transparent; }
  :global([data-theme="dark"]) .mbon-header.light { background: var(--abyss-800); }
  .logo { flex: none; display: block; padding: var(--space-1) 0; }
  .logo img { height: 20px; width: auto; }
  .logo-white { display: none !important; }
  :global([data-theme="dark"]) .logo-dark, .navy .logo-dark { display: none !important; }
  :global([data-theme="dark"]) .logo-white, .navy .logo-white { display: block !important; }
  .app { min-width: 0; display: flex; flex-direction: column; padding-left: var(--space-4); border-left: 1px solid var(--border); }
  .name-row { display: flex; align-items: baseline; gap: var(--space-2); min-width: 0; }
  .name {
    font: var(--fw-bold) var(--text-md) / 1.2 var(--font-display);
    letter-spacing: var(--ls-tight);
    color: var(--text-strong);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a.name:hover { text-decoration: none; color: var(--brand-hover); }
  .lens { font: var(--type-label); text-transform: uppercase; letter-spacing: var(--ls-label); color: var(--label-color); }
  .tagline { margin: 0; font: var(--type-small); line-height: 1.3; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .right { margin-left: auto; display: flex; align-items: center; gap: var(--space-2); flex: none; }
  @media (max-width: 640px) {
    .mbon-header { gap: var(--space-2); padding: var(--space-2) var(--space-3); }
    .logo img { height: 11px; }
    .app { padding-left: var(--space-2); flex: 1; }
    .right { gap: var(--space-1); }
    .lens { display: none; }
    .tagline { display: none; }
  }
</style>
