import type { PipelineStep } from "../types.js";
interface Props {
    /** current choice per step, e.g. { dataset: "OBIS", place: "Monterey Bay NMS" } */
    values?: Partial<Record<PipelineStep, string>>;
    /** override the step words */
    labels?: Partial<Record<PipelineStep, string>>;
    /** highlight one step (the one being edited) */
    active?: PipelineStep;
    /** makes each chip a button */
    onselect?: (step: PipelineStep) => void;
    size?: "sm" | "md";
}
declare const PipelineChips: import("svelte").Component<Props, {}, "">;
type PipelineChips = ReturnType<typeof PipelineChips>;
export default PipelineChips;
