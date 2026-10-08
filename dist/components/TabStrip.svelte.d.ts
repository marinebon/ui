import type { Snippet } from "svelte";
import type { ControlsTab } from "../types.js";
interface Props {
    tabs: ControlsTab[];
    active?: string;
    idPrefix: string;
    panelId: string;
    label?: string;
    numbered?: boolean;
    /** tabs share the width equally (Controls); false sizes them to their label (TimeStrip bar) */
    fill?: boolean;
    tabLabel?: Snippet<[ControlsTab, number]>;
    onchange?: (id: string) => void;
}
declare const TabStrip: import("svelte").Component<Props, {}, "active">;
type TabStrip = ReturnType<typeof TabStrip>;
export default TabStrip;
