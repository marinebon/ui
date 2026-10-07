import type { Snippet } from "svelte";
interface Props {
    value: string | number;
    label: string;
    unit?: string;
    /** small line under the numeral */
    note?: string | Snippet;
    size?: "md" | "lg";
    /** number formatter used when value is a number */
    format?: (v: number) => string;
}
declare const Stat: import("svelte").Component<Props, {}, "">;
type Stat = ReturnType<typeof Stat>;
export default Stat;
