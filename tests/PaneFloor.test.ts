// an overlay TimeStrip covers the bottom of its container: the Panes there end `margin` (12) px above its
// top instead of running under it (erddap-places issue #6). jsdom lays nothing out, so the container is
// 1000 × 600 and the strip's top is at 400 by stubs.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import PaneStripHarness from "./fixtures/PaneStripHarness.svelte";

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
  // the stubs shadow Element.prototype's getters; deleting them brings those back
  delete (proto as any).clientWidth;
  delete (proto as any).clientHeight;
  Element.prototype.getBoundingClientRect = savedRect;
});

describe("Pane over a TimeStrip", () => {
  it("ends 12 px above the strip's top (600 − 200 covered − 12 top − 12 gap)", async () => {
    render(PaneStripHarness);
    await tick();
    expect(screen.getByRole("region", { name: "controls" }).style.maxHeight).toBe("376px");
  });

  it("without a strip it runs to the container's bottom, as before", async () => {
    render(PaneStripHarness, { props: { strip: false } });
    await tick();
    expect(screen.getByRole("region", { name: "controls" }).style.maxHeight).toBe("576px");
  });

  it("an expanded strip covers everything, so the pane gets the whole container back", async () => {
    const user = userEvent.setup();
    render(PaneStripHarness);
    await tick();
    await user.click(screen.getByRole("button", { name: "Expand series" }));
    await tick();
    expect(screen.getByRole("region", { name: "controls" }).style.maxHeight).toBe("576px");
  });
});
