import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Picker from "../src/lib/components/Picker.svelte";
import PickerQueryHarness from "./fixtures/PickerQueryHarness.svelte";
import { PICKER_MIN_QUERY, pickerFilter, pickerMatches } from "../src/lib/utils";
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

  describe("match: always / query", () => {
    const tail: PickerItem[] = [
      ...items,
      { id: "f1", label: "Balaenidae", group: "Families", match: "query" },
      { id: "f2", label: "Balaenopteridae", group: "Families", match: "query" },
      { id: "f3", label: "Delphinidae", group: "Families", match: "query" },
      { id: "any", label: "Search everything…", group: "Any", match: "always" },
    ];

    it("pickerFilter: query rows only for a long enough matching search, always rows always", () => {
      const ids = (q: string, lim?: number) => pickerFilter(tail, q, lim).items.map((i) => i.id);
      expect(ids("")).toEqual(["sst", "chl", "rich", "sal", "any"]);
      expect(ids("b".repeat(PICKER_MIN_QUERY - 1))).toEqual(["chl", "rich", "any"]); // too short for the families
      expect(ids("balaen")).toEqual(["f1", "f2", "any"]);
      expect(ids("zzz")).toEqual(["any"]);
      // the limit applies to query rows only and counts the rest
      expect(pickerFilter(tail, "idae", 1)).toEqual({ items: [tail[4], tail[7]], hidden: 2 });
    });

    it("lists query rows while searching, keeps the always row, and binds the search text", async () => {
      const user = userEvent.setup();
      render(PickerQueryHarness, { props: { items: tail.slice(0, -1), queryLimit: 2 } });
      expect(names()).not.toContain("Balaenidae");
      expect(names()).toContain("Search everything…");
      await user.type(screen.getByRole("combobox"), "idae");
      expect(screen.getByTestId("q")).toHaveTextContent("idae");
      expect(names()).toEqual(["Balaenidae", "Balaenopteridae", "Search everything for “idae”…"]);
      expect(screen.getByText("1 more match: keep typing")).toBeInTheDocument();
    });
  });
});
