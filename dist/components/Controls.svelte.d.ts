import type { Snippet } from "svelte";
import type { ControlsTab, PaneAnchor } from "../types.js";
interface Props {
    tabs: ControlsTab[];
    active?: string;
    /** panel content for the active tab id */
    panel: Snippet<[string]>;
    /** custom tab label (default: tab.label) */
    tabLabel?: Snippet<[ControlsTab, number]>;
    /** counts / sources line */
    footer?: Snippet;
    actions?: Snippet;
    title?: string;
    id?: string;
    open?: boolean;
    collapsed?: boolean;
    expanded?: boolean;
    anchor?: PaneAnchor;
    offset?: {
        x: number;
        y: number;
    };
    width?: number;
    height?: number;
    /** run the container's full height, the TimeStrip beside it (see Pane `fill`) */
    fill?: boolean;
    numbered?: boolean;
    onchange?: (id: string) => void;
}
declare const Controls: import("svelte").Component<Props, {}, "open" | "collapsed" | "expanded" | "active">;
type Controls = ReturnType<typeof Controls>;
export default Controls;
