import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
interface Props extends Omit<HTMLButtonAttributes, "children"> {
    variant?: "primary" | "action" | "quiet";
    size?: "sm" | "md";
    href?: string;
    target?: string;
    pressed?: boolean;
    children?: Snippet;
}
declare const Button: import("svelte").Component<Props, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
