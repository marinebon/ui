/**
 * theme: read and write the light/dark theme.
 *
 * precedence: `?theme=light|dark` in the URL > a stored choice (localStorage) > the
 * system `prefers-color-scheme`. the result is written to `data-theme` on <html>, which
 * switches every token in tokens.css.
 */
export type Theme = "light" | "dark";
export declare const THEME_STORAGE_KEY = "mbon-theme";
export declare const THEME_EVENT = "mbon-theme-change";
/** the system preference, `light` when unknown */
export declare function systemTheme(): Theme;
/** the `?theme=` override in a query string, or null */
export declare function urlTheme(search?: string): Theme | null;
/** the stored choice, or null */
export declare function storedTheme(): Theme | null;
/** resolve the theme: URL override, then stored choice, then system */
export declare function readTheme(search?: string): Theme;
/** the theme currently applied to <html>, falling back to readTheme() */
export declare function currentTheme(): Theme;
/** set `data-theme` on an element (default <html>) and announce the change */
export declare function applyTheme(theme: Theme, el?: HTMLElement): void;
/** apply a theme and remember it (pass `persist: false` to skip storage) */
export declare function writeTheme(theme: Theme, { persist }?: {
    persist?: boolean;
}): void;
/** forget the stored choice and follow the system again */
export declare function clearTheme(): Theme;
/** flip light/dark, persist, and return the new theme */
export declare function toggleTheme(): Theme;
/** subscribe to theme changes; returns an unsubscribe function */
export declare function onThemeChange(cb: (theme: Theme) => void): () => void;
/**
 * apply the resolved theme now and follow system changes while the user has no
 * explicit choice (URL or stored). call once at app start; returns a cleanup.
 */
export declare function initTheme(): () => void;
