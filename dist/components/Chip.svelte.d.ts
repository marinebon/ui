import type { Snippet } from "svelte";
import { type Facet } from "../utils.js";
interface Props {
    /** the chip text (the current choice) */
    label: string;
    /** colour from the facet / pipeline palette */
    facet?: Facet;
    open?: boolean;
    /** accessible name of the popover, e.g. "choose a place" */
    title?: string;
    /** popover content, gets close() */
    children?: Snippet<[() => void]>;
    /** popover width in px or css length */
    width?: string;
    onopen?: () => void;
    onclose?: () => void;
}
declare const Chip: import("svelte").Component<Props, {
    close: (refocus?: boolean) => void;
}, "open">;
type Chip = ReturnType<typeof Chip>;
export default Chip;
