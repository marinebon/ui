// a `fill` pane runs its container's full height and an overlay TimeStrip starts `margin` (12) px beside
// it, instead of the pane ending above the strip (oceanmetrics/obis-hex#2, erddap-places). The same
// stubs as PaneFloor.test.ts: the container is 1000 × 600 and the strip's top is at 400.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import PaneFillHarness from "./fixtures/PaneFillHarness.svelte";
import { paneSide, stripEdges, STRIP_MIN_WIDTH } from "../src/lib/paneStack.svelte.js";

const proto = HTMLElement.prototype;
const savedRect = Element.prototype.getBoundingClientRect;
const box = (top: number, bottom: number) => ({ top, bottom, left: 0, right: 1000, x: 0, y: top, width: 1000, height: bottom - top, toJSON() {} }) as DOMRect;

beforeEach(() => {
  Object.defineProperty(proto, "clientWidth", { configurable: true, get() { return "stage" in this.dataset ? 1000 : 0; } });
  Object.defineProperty(proto, "clientHeight", { configurable: true, get() { return "stage" in this.dataset ? 600 : 0; } });
  Element.prototype.getBoundingClientRect = function () {
    if (this instanceof HTMLElement && "stage" in this.dataset) return box(0, 600);
    if (this.classList.contains("mbon-timestrip")) return box(400, 588);
    return box(0, 0);
  };
});
afterEach(() => {
  delete (proto as any).clientWidth;
  delete (proto as any).clientHeight;
  Element.prototype.getBoundingClientRect = savedRect;
});

const pane = () => screen.getByRole("region", { name: "controls" });
const strip = () => document.querySelector<HTMLElement>(".mbon-timestrip")!;

describe("fill pane beside a TimeStrip", () => {
  it("runs the full height (600 − 12 top − 12 bottom) and the strip starts 12 px right of it (12 + 320 + 12)", async () => {
    render(PaneFillHarness);
    await tick();
    expect(pane().style.height).toBe("576px");
    expect(pane().classList.contains("fill")).toBe(true);
    expect(strip().style.left).toBe("344px");
    expect(strip().style.right).toBe("12px");
  });

  it("at the top right, the strip ends 12 px left of it", async () => {
    render(PaneFillHarness, { props: { anchor: "top-right" } });
    await tick();
    expect(strip().style.left).toBe("12px");
    expect(strip().style.right).toBe("344px");
  });

  it("folded, it gives the strip its full width back", async () => {
    const user = userEvent.setup();
    render(PaneFillHarness);
    await tick();
    await user.click(screen.getByRole("button", { name: "Collapse controls" }));
    await tick();
    expect(strip().style.left).toBe("");
  });

  it("without fill the pane ends above the strip (0.3.1) and the strip spans", async () => {
    render(PaneFillHarness, { props: { fill: false } });
    await tick();
    expect(pane().style.maxHeight).toBe("376px");
    expect(pane().classList.contains("fill")).toBe(false);
    expect(strip().style.left).toBe("");
  });

  it("the fill Picker and its .mbon-fill wrapper are inside a .fill pane, where they grow", async () => {
    render(PaneFillHarness);
    await tick();
    expect(pane().querySelector(".mbon-fill .mbon-picker.fill")).not.toBeNull();
  });
});

describe("pane sides and strip edges", () => {
  it("a pane reaching below the strip's top takes the side its centre is on", () => {
    expect(paneSide({ x: 12, w: 320, bottom: 588 }, 1000, 600, 200, 12)).toEqual({ left: 344 });
    expect(paneSide({ x: 668, w: 320, bottom: 588 }, 1000, 600, 200, 12)).toEqual({ right: 344 });
  });
  it("a pane ending above the strip, or no strip, takes nothing", () => {
    expect(paneSide({ x: 12, w: 320, bottom: 388 }, 1000, 600, 200, 12)).toBeNull();
    expect(paneSide({ x: 12, w: 320, bottom: 588 }, 1000, 600, 0, 12)).toBeNull();
  });
  it("the strip keeps the widest side on each edge, and spans when it would be too narrow", () => {
    expect(stripEdges([], 1000, 12)).toBeNull();
    expect(stripEdges([{ left: 344 }, { left: 300 }, { right: 200 }], 1000, 12)).toEqual({ left: 344, right: 200 });
    expect(stripEdges([{ left: 344 }], 344 + 12 + STRIP_MIN_WIDTH, 12)).toEqual({ left: 344, right: 12 });
    expect(stripEdges([{ left: 344 }], 344 + 12 + STRIP_MIN_WIDTH - 1, 12)).toBeNull();
  });
});
