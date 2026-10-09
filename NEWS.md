# @marinebon/ui 0.4.0

- **One layout for the panes and the TimeStrip.** `Pane` (and `Controls`) take `fill`: the pane runs
  the full height of its container, and an overlay `TimeStrip` starts 12 px beside it instead of under
  it. The strip also moves beside any pane resized down past its top. It spans the container again when
  the pane is folded, shortened above it or dragged to the other half, or when the strip would be
  narrower than 320 px (`STRIP_MIN_WIDTH`). Phone sheets and an expanded strip are unchanged. Apps no
  longer size panes around the strip by hand (obis-hex and erddap-places did).
- In a fill pane the body is a column, so content can grow with it. With `Controls fill` the tabs stay
  put and the tab panel takes the rest of the height, scrolling itself. `Picker fill` gives its list the
  height left (at least 8 rem) instead of `maxHeight`. `.mbon-fill` (base.css) goes on each wrapper in
  between. On a phone sheet, `maxHeight` applies as before.
- `paneSide()`, `stripEdges()`, `STRIP_MIN_WIDTH` and the `PaneSide` type are exported; `PaneStack` has
  `sides()`. New `tests/PaneFill.test.ts`.
- Demo: the Controls use `fill`, with fill Pickers for datasets and places.

# @marinebon/ui 0.3.1

- `Pane` ends 12 px (`margin`) above an overlay `TimeStrip` in the same container instead of running under
  it: the strip reports the height it covers at the container's bottom, and a pane's `max-height`, a
  bottom-anchored home and a pill docked to the bottom edge stay above it. An expanded strip or the phone
  bottom sheets leave the panes as before.

# @marinebon/ui 0.3.0

- `TimeStrip` takes `tabs` (2 or more) and `bind:active`: a tab strip in the header, for example Plot and
  Table. You switch the strip content on `active`; the brush works on the first tab.
- `TimeStrip` has an Expand button (`expandable`, default true; `bind:expanded`) like Pane and Controls:
  it fills its positioned container, Esc restores, and `height` is unchanged so restore returns to the
  previous height.
- Controls and TimeStrip now share one internal tab strip, so the tabs look and behave the same.
- Demo: the time strip has Plot and Table tabs and the Expand button.

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
