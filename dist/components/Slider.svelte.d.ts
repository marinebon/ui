type Tick = number | {
    value: number;
    label: string;
};
interface Props {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    label: string;
    ticks?: Tick[];
    format?: (v: number) => string;
    /** show − / + buttons */
    buttons?: boolean;
    disabled?: boolean;
    oninput?: (value: number) => void;
}
declare const Slider: import("svelte").Component<Props, {}, "value">;
type Slider = ReturnType<typeof Slider>;
export default Slider;
