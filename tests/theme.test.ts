import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  THEME_STORAGE_KEY,
  clearTheme,
  initTheme,
  onThemeChange,
  readTheme,
  systemTheme,
  toggleTheme,
  urlTheme,
  writeTheme,
} from "../src/lib/theme";

function mockSystem(dark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: dark && q.includes("dark"),
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("theme", () => {
  beforeEach(() => mockSystem(false));

  it("parses ?theme= and ignores junk", () => {
    expect(urlTheme("?theme=dark")).toBe("dark");
    expect(urlTheme("?a=1&theme=light")).toBe("light");
    expect(urlTheme("?theme=purple")).toBeNull();
    expect(urlTheme("")).toBeNull();
  });

  it("follows prefers-color-scheme when nothing else is set", () => {
    expect(readTheme("")).toBe("light");
    mockSystem(true);
    expect(systemTheme()).toBe("dark");
    expect(readTheme("")).toBe("dark");
  });

  it("precedence: URL > stored > system", () => {
    mockSystem(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    expect(readTheme("")).toBe("light");
    expect(readTheme("?theme=dark")).toBe("dark");
  });

  it("writeTheme sets data-theme, stores, and announces", () => {
    const seen: string[] = [];
    const off = onThemeChange((t) => seen.push(t));
    writeTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    writeTheme("light", { persist: false });
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    off();
    writeTheme("dark");
    expect(seen).toEqual(["dark", "light"]);
  });

  it("toggleTheme flips and persists", () => {
    writeTheme("light");
    expect(toggleTheme()).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(toggleTheme()).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("clearTheme forgets the choice and returns to the system theme", () => {
    mockSystem(true);
    writeTheme("light");
    expect(clearTheme()).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("initTheme applies the resolved theme", () => {
    mockSystem(true);
    const stop = initTheme();
    expect(document.documentElement.dataset.theme).toBe("dark");
    stop();
  });
});
