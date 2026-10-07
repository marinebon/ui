import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import PaneHarness from "./fixtures/PaneHarness.svelte";

type S = { open: boolean; collapsed: boolean; expanded: boolean };

function setup() {
  const states: S[] = [];
  const r = render(PaneHarness, { props: { onstate: (s: S) => states.push({ ...s }) } });
  return { ...r, last: () => states.at(-1)! };
}

describe("Pane", () => {
  it("renders a labelled region with the title as a mono label", () => {
    setup();
    const region = screen.getByRole("region", { name: "layers" });
    expect(region).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "layers" })).toHaveClass("mbon-label");
    expect(screen.getByText("pane body")).toBeInTheDocument();
  });

  it("collapses to a labelled pill and restores, keeping `collapsed` bound", async () => {
    const user = userEvent.setup();
    const { last } = setup();
    await user.click(screen.getByRole("button", { name: "Collapse layers" }));
    const pill = screen.getByRole("button", { name: "Show layers pane" });
    expect(pill).toHaveAttribute("aria-expanded", "false");
    expect(pill).toHaveTextContent("layers");
    expect(pill).toHaveFocus();
    expect(screen.queryByText("pane body")).toBeNull();
    expect(last().collapsed).toBe(true);

    await user.click(pill);
    expect(screen.getByText("pane body")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "layers" })).toHaveFocus();
    expect(last().collapsed).toBe(false);
  });

  it("expands to fill the container and Esc restores", async () => {
    const user = userEvent.setup();
    const { last } = setup();
    await user.click(screen.getByRole("button", { name: "Expand layers" }));
    expect(screen.getByRole("region", { name: "layers" })).toHaveClass("expanded");
    expect(screen.getByRole("button", { name: "Restore layers" })).toHaveAttribute("aria-pressed", "true");
    expect(last().expanded).toBe(true);

    await user.keyboard("{Escape}");
    expect(screen.getByRole("region", { name: "layers" })).not.toHaveClass("expanded");
    expect(last().expanded).toBe(false);
  });

  it("moves with arrow keys on the title, remembers it, and Home sends it home", async () => {
    setup();
    const region = screen.getByRole("region", { name: "layers" });
    const handle = screen.getByRole("heading", { name: "layers" });
    const left0 = parseFloat(region.style.left);
    handle.focus();
    await fireEvent.keyDown(handle, { key: "ArrowRight" });
    await fireEvent.keyDown(handle, { key: "ArrowRight", shiftKey: true });
    await tick();
    expect(parseFloat(region.style.left)).toBe(left0 + 60);
    const stored = Object.keys(localStorage).find((k) => k.startsWith("mbon-pane:test:"));
    expect(stored).toBeDefined();
    expect(JSON.parse(localStorage.getItem(stored!)!).x).toBe(left0 + 60);

    await fireEvent.keyDown(handle, { key: "Home" });
    await tick();
    expect(parseFloat(region.style.left)).toBe(left0);
    expect(localStorage.getItem(stored!)).toBeNull();
  });

  it("restores a remembered position on mount", async () => {
    const bucket = window.innerWidth < 640 ? "phone" : window.innerWidth < 1024 ? "tablet" : window.innerWidth < 1600 ? "laptop" : "wide";
    localStorage.setItem(`mbon-pane:test:${bucket}`, JSON.stringify({ x: 123, y: 45, w: 300, h: 0 }));
    setup();
    await tick();
    const region = screen.getByRole("region", { name: "layers" });
    expect(region.style.left).toBe("123px");
    expect(region.style.top).toBe("45px");
  });

  it("the resize grip takes arrow keys", async () => {
    setup();
    const region = screen.getByRole("region", { name: "layers" });
    const w0 = parseFloat(region.style.width);
    const grip = screen.getByRole("button", { name: /Resize layers/ });
    await fireEvent.keyDown(grip, { key: "ArrowRight" });
    await tick();
    expect(parseFloat(region.style.width)).toBe(w0 + 10);
  });
});
