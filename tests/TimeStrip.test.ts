import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import TimeStripHarness from "./fixtures/TimeStripHarness.svelte";

const selected = () => screen.getAllByRole("tab").map((t) => t.getAttribute("aria-selected"));
const val = (id: string) => screen.getByTestId(id).textContent;

describe("TimeStrip tabs", () => {
  it("renders tabs with aria-selected and the tabpanel labelled by the active tab", () => {
    render(TimeStripHarness);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(selected()).toEqual(["true", "false"]);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("the plot");
    expect(panel.getAttribute("aria-labelledby")).toBe(screen.getByRole("tab", { name: "Plot" }).id);
  });

  it("a click switches active and the content", async () => {
    const user = userEvent.setup();
    render(TimeStripHarness);
    await user.click(screen.getByRole("tab", { name: "Table" }));
    expect(selected()).toEqual(["false", "true"]);
    expect(val("active")).toBe("table");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("the table");
  });

  it("arrow keys, Home and End switch active and move focus", async () => {
    const user = userEvent.setup();
    render(TimeStripHarness);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(val("active")).toBe("table");
    expect(tabs[1]).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(val("active")).toBe("plot");
    await user.keyboard("{End}");
    expect(val("active")).toBe("table");
    await user.keyboard("{Home}");
    expect(val("active")).toBe("plot");
  });

  it("without tabs there is no tablist and the plot stays a group", () => {
    render(TimeStripHarness, { withTabs: false });
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.getByRole("group", { name: /selection/ })).toBeInTheDocument();
  });
});

describe("TimeStrip expand", () => {
  it("Expand toggles expanded, fills the container, keeps height; Esc restores", async () => {
    const user = userEvent.setup();
    render(TimeStripHarness);
    const btn = screen.getByRole("button", { name: "Expand records per year" });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).toHaveAttribute("title", "Expand");
    const section = screen.getByRole("region", { name: "records per year" });
    await user.click(btn);
    expect(val("expanded")).toBe("true");
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveAttribute("aria-label", "Restore records per year");
    expect(btn).toHaveAttribute("title", "Restore (Esc)");
    expect(section.style.top).toBe("0px");
    expect(section.style.bottom).toBe("0px");
    expect(section.style.height).toBe("auto");
    expect(screen.queryByRole("button", { name: /Resize/ })).toBeNull();
    expect(val("height")).toBe("140");
    await user.keyboard("{Escape}");
    expect(val("expanded")).toBe("false");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).toHaveFocus();
    expect(section.style.top).toBe("");
    expect(val("height")).toBe("140");
    expect(screen.getByRole("button", { name: /Resize/ })).toBeInTheDocument();
  });

  it("the Expand button toggles back to restore", async () => {
    const user = userEvent.setup();
    render(TimeStripHarness);
    await user.click(screen.getByRole("button", { name: "Expand records per year" }));
    await user.click(screen.getByRole("button", { name: "Restore records per year" }));
    expect(val("expanded")).toBe("false");
  });
});
