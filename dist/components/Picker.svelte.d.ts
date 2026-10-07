import type { Snippet } from "svelte";
import type { PickerItem } from "../types.js";
interface Props {
    items: PickerItem[];
    value?: string | null;
    mode?: "az" | "group";
    /** accessible name; also shown as a mono label when `showLabel` */
    label?: string;
    showLabel?: boolean;
    placeholder?: string;
    /** show the A–Z / by group switch (default: when any item has a group) */
    modeToggle?: boolean;
    /** max list height (css length) */
    maxHeight?: string;
    emptyText?: string;
    /** custom row content */
    row?: Snippet<[PickerItem]>;
    onselect?: (item: PickerItem) => void;
}
declare const Picker: import("svelte").Component<Props, {}, "value" | "mode">;
type Picker = ReturnType<typeof Picker>;
export default Picker;
