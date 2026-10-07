import type { Snippet } from "svelte";
interface Props {
    kind?: "info" | "warn" | "error";
    children?: Snippet;
    /** show a dismiss button and call this when pressed */
    ondismiss?: () => void;
}
declare const Notice: import("svelte").Component<Props, {}, "">;
type Notice = ReturnType<typeof Notice>;
export default Notice;
