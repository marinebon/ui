import { type Snippet } from "svelte";
import type { BrushRange } from "../types.js";
interface Props {
    title?: string;
    collapsed?: boolean;
    height?: number;
    minHeight?: number;
    maxHeight?: number;
    /** [start, end] of the x axis (e.g. epoch ms or years) for v0/v1 in callbacks */
    domain?: [number, number];
    /** px of the plot reserved left/right of the x range (axis gutters) */
    plotLeft?: number;
    plotRight?: number;
    brush?: [number, number] | null;
    /** overlay over the container bottom (default) or in normal flow */
    overlay?: boolean;
    /** viewport width (px) below which the strip joins the Panes' bottom-sheet stack */
    sheetBelow?: number;
    children?: Snippet<[{
        width: number;
        height: number;
    }]>;
    actions?: Snippet;
    onbrush?: (r: BrushRange) => void;
    onbrushend?: (r: BrushRange) => void;
    onclear?: () => void;
}
declare const TimeStrip: import("svelte").Component<Props, {}, "height" | "collapsed" | "brush">;
type TimeStrip = ReturnType<typeof TimeStrip>;
export default TimeStrip;
