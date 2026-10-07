/** shared component types */
export type PipelineStep = "dataset" | "place" | "method" | "delivery";
export interface LegendItem {
    label: string;
    color: string;
    count?: number;
}
export interface SelectOption {
    value: string;
    label: string;
    group?: string;
    disabled?: boolean;
}
export interface PickerItem {
    id: string;
    label: string;
    /** group name for the "by group" view */
    group?: string;
    /** short text or emoji shown before the label */
    icon?: string;
    /** a colour swatch shown before the label */
    color?: string;
    count?: number;
    /** extra words matched by the search but not shown */
    keywords?: string;
    disabled?: boolean;
}
export interface ControlsTab {
    id: string;
    label: string;
}
/** a brush selection on the TimeStrip: pixels, fractions of the width, and domain values */
export interface BrushRange {
    x0: number;
    x1: number;
    f0: number;
    f1: number;
    /** present when TimeStrip has a `domain` */
    v0?: number;
    v1?: number;
}
export interface PaneRect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export type PaneAnchor = "top-left" | "top-right" | "bottom-left" | "bottom-right";
