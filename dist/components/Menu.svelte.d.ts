import type { Snippet } from "svelte";
interface Props {
    label: string;
    open?: boolean;
    align?: "start" | "end";
    /** quiet (default) or plain (text-only, for headers) trigger */
    variant?: "quiet" | "plain";
    /** an accessible name when the visible label is short, e.g. an icon */
    ariaLabel?: string;
    /** menu content; receives a close() function */
    children: Snippet<[() => void]>;
}
declare const Menu: import("svelte").Component<Props, {}, "open">;
type Menu = ReturnType<typeof Menu>;
export default Menu;
