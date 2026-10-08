# @marinebon/ui 0.2.0

- `Sentence` is smaller: size `md` is now 22 px (was 28) and `lg` 28 px (was 36); on phones (640 px and
  narrower) `md` is 18 px and `lg` 22 px.
- `Chip` renders slightly smaller than the words around it (0.9em, tighter padding, 6 px radius) and stays on
  the text baseline; the open ring and facet colours are unchanged.
- `Controls`: the selected tab is easier to see: semibold accent text and number with a 1 px accent ring
  (teal-600 on light, teal-300 on dark, both pass 4.5:1 on the tab surface). Unselected numbers are muted.
- New `Controls` tests (selected state, arrow keys, Home/End).

# @marinebon/ui 0.1.0

- First release: MBON brand tokens (`tokens.css`, names from marinebon.org/brand/v1), self-hosted
  Space Grotesk / IBM Plex fonts (`fonts.css`), `base.css`, and `theme.ts` (light/dark with
  `prefers-color-scheme` and `?theme=`).
- Components (Svelte 5): Header, Footer, ThemeToggle, Pane, Controls, TimeStrip, Sentence, Chip,
  Picker, Menu, Select, Toggle, Slider, Button, Notice, Legend, PipelineChips, Stat, Kbd.
- Demo page at https://marinebon.org/ui/ and Playwright screenshots (`npm run screenshots`).
