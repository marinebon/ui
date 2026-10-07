import type { LegendItem } from "../types.js";
interface Props {
    type?: "continuous" | "categorical";
    /** mono label above the legend */
    title?: string;
    /** continuous: colour stops, low → high */
    colors?: string[];
    /** continuous: [min, max] */
    domain?: [number, number];
    /** continuous: extra tick values inside the domain */
    ticks?: number[];
    format?: (v: number) => string;
    /** continuous: unit after the max label */
    unit?: string;
    /** categorical: swatches */
    items?: LegendItem[];
    /** categorical: called with an item when its swatch is pressed */
    onselect?: (item: LegendItem) => void;
}
declare const Legend: import("svelte").Component<Props, {}, "">;
type Legend = ReturnType<typeof Legend>;
export default Legend;
