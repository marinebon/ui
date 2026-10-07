import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Picker from "../src/lib/components/Picker.svelte";
import { pickerMatches } from "../src/lib/utils";
import type { PickerItem } from "../src/lib/types";

const items: PickerItem[] = [
  { id: "sst", label: "Sea surface temperature", group: "Physical", count: 12 },
  { id: "chl", label: "Chlorophyll-a", group: "Biological", keywords: "ocean colour", count: 7 },
  { id: "rich", label: "Species richness", group: "Biological", count: 3 },
  { id: "sal", label: "Salinity", group: "Physical" },
];

const names = () => screen.getAllByRole("option").map((o) => o.textContent?.replace(/\d+$/, "").trim());

describe("Picker", () => {
  it("matches every search term in label, group or keywords", () => {
    expect(pickerMatches(items[1], "colour")).toBe(true);
    expect(pickerMatches(items[1], "bio chl")).toBe(true);
    expect(pickerMatches(items[1], "bio sst")).toBe(false);
    expect(pickerMatches(items[0], "  ")).toBe(true);
  });

  it("groups by default with group labels, and A–Z sorts flat", async () => {
    const user = userEvent.setup();
    render(Picker, { props: { items, label: "variables" } });
    const listbox = screen.getByRole("listbox", { name: "variables" });
    expect(within(listbox).getAllByRole("group")).toHaveLength(2);
    expect(within(screen.getAllByRole("group", { name: "Physical" })[0]).getAllByRole("option")).toHaveLength(2);
    expect(names()).toEqual(["Sea surface temperature", "Salinity", "Chlorophyll-a", "Species richness"]);
    await user.click(screen.getByRole("button", { name: "A–Z" }));
    expect(screen.getByRole("button", { name: "A–Z" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryAllByRole("group", { name: "Physical" })).toHaveLength(0);
    expect(names()).toEqual(["Chlorophyll-a", "Salinity", "Sea surface temperature", "Species richness"]);
  });

  it("filters as you type and announces the count", async () => {
    const user = userEvent.setup();
    render(Picker, { props: { items, label: "variables" } });
    await user.type(screen.getByRole("combobox"), "s");
    expect(screen.getAllByRole("option")).toHaveLength(3); // Chlorophyll-a has no "s"
    await user.type(screen.getByRole("combobox"), "al");
    expect(names()).toEqual(["Salinity"]);
    expect(screen.getByText("1 result")).toBeInTheDocument();
    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("arrow keys move the active option and Enter selects", async () => {
    const user = userEvent.setup();
    const onselect = vi.fn();
    render(Picker, { props: { items, label: "variables", onselect } });
    const input = screen.getByRole("combobox");
    await user.click(input);
    const first = screen.getAllByRole("option")[0];
    expect(input).toHaveAttribute("aria-activedescendant", first.id);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    const third = screen.getAllByRole("option")[2];
    expect(input).toHaveAttribute("aria-activedescendant", third.id);
    await user.keyboard("{ArrowUp}{Enter}");
    expect(onselect).toHaveBeenCalledWith(expect.objectContaining({ id: "sal" }));
    expect(screen.getByRole("option", { name: /Salinity/ })).toHaveAttribute("aria-selected", "true");
    // clamps at the ends
    await user.keyboard("{PageDown}{ArrowDown}{ArrowDown}");
    const last = screen.getAllByRole("option").at(-1)!;
    expect(input).toHaveAttribute("aria-activedescendant", last.id);
  });

  it("Escape clears the search", async () => {
    const user = userEvent.setup();
    render(Picker, { props: { items, label: "variables" } });
    const input = screen.getByRole("combobox");
    await user.type(input, "chl");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("shows counts", () => {
    render(Picker, { props: { items, label: "variables" } });
    expect(screen.getByRole("option", { name: /Sea surface temperature/ })).toHaveTextContent("12");
  });
});
