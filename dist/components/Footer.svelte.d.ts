import type { Snippet } from "svelte";
interface Props {
    /** source code link */
    sourceHref?: string;
    sourceLabel?: string;
    builtByHref?: string;
    /** data release line, e.g. "OBIS export 2026-09 · 142 M records" */
    release?: Snippet;
    /** timing / bytes, e.g. "query 212 ms · 3.1 MB" */
    timing?: Snippet;
    children?: Snippet;
}
declare const Footer: import("svelte").Component<Props, {}, "">;
type Footer = ReturnType<typeof Footer>;
export default Footer;
