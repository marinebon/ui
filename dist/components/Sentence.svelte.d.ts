import type { Snippet } from "svelte";
interface Props {
    /** heading level announced to screen readers */
    level?: 1 | 2 | 3;
    size?: "md" | "lg";
    children: Snippet;
    /** second line: legend, counts */
    sub?: Snippet;
}
declare const Sentence: import("svelte").Component<Props, {}, "">;
type Sentence = ReturnType<typeof Sentence>;
export default Sentence;
