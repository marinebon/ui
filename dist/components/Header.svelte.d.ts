import type { Snippet } from "svelte";
interface Props {
    appName: string;
    tagline?: string;
    /** link for the app name (default: none) */
    appHref?: string;
    logoHref?: string;
    /** navy: the dark brand surface with the white wordmark */
    tone?: "light" | "navy";
    /** lens / mode word next to the app name */
    lens?: Snippet;
    /** Help ▾ menu content (gets close()) */
    help?: Snippet<[() => void]>;
    helpLabel?: string;
    feedback?: Snippet;
    /** anything else on the right, before Help */
    right?: Snippet;
    themeToggle?: boolean;
}
declare const Header: import("svelte").Component<Props, {}, "">;
type Header = ReturnType<typeof Header>;
export default Header;
