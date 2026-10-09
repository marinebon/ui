import { type Snippet } from "svelte";
import type { PaneAnchor } from "../types.js";
interface Props {
    title: string;
    /** storage key; omit to not remember position */
    id?: string;
    open?: boolean;
    collapsed?: boolean;
    expanded?: boolean;
    anchor?: PaneAnchor;
    /** extra offset from the anchor corner, px */
    offset?: {
        x: number;
        y: number;
    };
    width?: number;
    /** fixed height in px; default fits the content */
    height?: number;
    /** run the container's full height (top to bottom, `margin` px clear) instead of ending above an
     * overlay TimeStrip, which then starts beside the pane; its content can grow to fill it */
    fill?: boolean;
    minWidth?: number;
    minHeight?: number;
    margin?: number;
    draggable?: boolean;
    resizable?: boolean;
    collapsible?: boolean;
    expandable?: boolean;
    closable?: boolean;
    /** pill text when collapsed (default: title) */
    pillLabel?: string;
    /** viewport width (px) below which panes become bottom sheets */
    sheetBelow?: number;
    children?: Snippet;
    /** title-bar slot, e.g. an export Menu */
    actions?: Snippet;
    footer?: Snippet;
    onclose?: () => void;
    class?: string;
}
declare const Pane: import("svelte").Component<Props, {
    home: () => void;
}, "open" | "collapsed" | "expanded">;
type Pane = ReturnType<typeof Pane>;
export default Pane;
