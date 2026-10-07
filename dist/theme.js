/**
 * theme: read and write the light/dark theme.
 *
 * precedence: `?theme=light|dark` in the URL > a stored choice (localStorage) > the
 * system `prefers-color-scheme`. the result is written to `data-theme` on <html>, which
 * switches every token in tokens.css.
 */
export const THEME_STORAGE_KEY = "mbon-theme";
export const THEME_EVENT = "mbon-theme-change";
const isTheme = (v) => v === "light" || v === "dark";
/** the system preference, `light` when unknown */
export function systemTheme() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
        return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
/** the `?theme=` override in a query string, or null */
export function urlTheme(search = typeof location !== "undefined" ? location.search : "") {
    const v = new URLSearchParams(search).get("theme");
    return isTheme(v) ? v : null;
}
/** the stored choice, or null */
export function storedTheme() {
    try {
        const v = localStorage.getItem(THEME_STORAGE_KEY);
        return isTheme(v) ? v : null;
    }
    catch {
        return null;
    }
}
/** resolve the theme: URL override, then stored choice, then system */
export function readTheme(search) {
    return urlTheme(search) ?? storedTheme() ?? systemTheme();
}
/** the theme currently applied to <html>, falling back to readTheme() */
export function currentTheme() {
    const v = typeof document !== "undefined" ? document.documentElement.dataset.theme : undefined;
    return isTheme(v) ? v : readTheme();
}
/** set `data-theme` on an element (default <html>) and announce the change */
export function applyTheme(theme, el) {
    if (typeof document === "undefined")
        return;
    (el ?? document.documentElement).dataset.theme = theme;
    if (!el && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
    }
}
/** apply a theme and remember it (pass `persist: false` to skip storage) */
export function writeTheme(theme, { persist = true } = {}) {
    if (persist) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
        catch {
            /* storage blocked: still apply */
        }
    }
    applyTheme(theme);
}
/** forget the stored choice and follow the system again */
export function clearTheme() {
    try {
        localStorage.removeItem(THEME_STORAGE_KEY);
    }
    catch {
        /* ignore */
    }
    const t = urlTheme() ?? systemTheme();
    applyTheme(t);
    return t;
}
/** flip light/dark, persist, and return the new theme */
export function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    writeTheme(next);
    return next;
}
/** subscribe to theme changes; returns an unsubscribe function */
export function onThemeChange(cb) {
    if (typeof window === "undefined")
        return () => { };
    const h = (e) => cb(e.detail);
    window.addEventListener(THEME_EVENT, h);
    return () => window.removeEventListener(THEME_EVENT, h);
}
/**
 * apply the resolved theme now and follow system changes while the user has no
 * explicit choice (URL or stored). call once at app start; returns a cleanup.
 */
export function initTheme() {
    applyTheme(readTheme());
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
        return () => { };
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const h = (e) => {
        if (!urlTheme() && !storedTheme())
            applyTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
}
