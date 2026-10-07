import type { SelectOption } from "../types.js";
interface Props {
    value?: string;
    options: SelectOption[];
    label?: string;
    /** hide the label visually (still read by screen readers) */
    hideLabel?: boolean;
    disabled?: boolean;
    onchange?: (value: string) => void;
}
declare const Select: import("svelte").Component<Props, {}, "value">;
type Select = ReturnType<typeof Select>;
export default Select;
