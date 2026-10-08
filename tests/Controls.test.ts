import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import ControlsHarness from "./fixtures/ControlsHarness.svelte";

const selected = () => screen.getAllByRole("tab").map((t) => t.getAttribute("aria-selected"));

describe("Controls tabs", () => {
  it("marks only the active tab aria-selected=true", () => {
    render(ControlsHarness);
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(selected()).toEqual(["true", "false", "false", "false"]);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("panel for dataset");
  });

  it("a click moves the selection", async () => {
    const user = userEvent.setup();
    render(ControlsHarness);
    await user.click(screen.getByRole("tab", { name: /Method/ }));
    expect(selected()).toEqual(["false", "false", "true", "false"]);
    expect(screen.getByTestId("active")).toHaveTextContent("method");
  });

  it("arrow keys, Home and End move selection and focus, wrapping around", async () => {
    const user = userEvent.setup();
    render(ControlsHarness);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(selected()).toEqual(["false", "true", "false", "false"]);
    expect(tabs[1]).toHaveFocus();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(selected()).toEqual(["false", "false", "false", "true"]);
    await user.keyboard("{ArrowRight}");
    expect(selected()).toEqual(["true", "false", "false", "false"]);
    await user.keyboard("{End}");
    expect(selected()).toEqual(["false", "false", "false", "true"]);
    await user.keyboard("{Home}");
    expect(selected()).toEqual(["true", "false", "false", "false"]);
    expect(tabs[0]).toHaveFocus();
  });

  it("only the selected tab is in the tab order", () => {
    render(ControlsHarness);
    expect(screen.getAllByRole("tab").map((t) => t.getAttribute("tabindex"))).toEqual(["0", "-1", "-1", "-1"]);
  });
});
