interface Props {
    checked?: boolean;
    label: string;
    /** small text under the label */
    hint?: string;
    disabled?: boolean;
    onchange?: (checked: boolean) => void;
}
declare const Toggle: import("svelte").Component<Props, {}, "checked">;
type Toggle = ReturnType<typeof Toggle>;
export default Toggle;
