import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import SentenceHarness from "./fixtures/SentenceHarness.svelte";

describe("Sentence + Chip", () => {
  it("renders the sentence as a heading with a second line", () => {
    render(SentenceHarness);
    const h = screen.getByRole("heading", { level: 1 });
    expect(h).toHaveTextContent(/Species richness in\s+Monterey Bay\s*▾?\s*since 2000/);
    expect(screen.getByText("42 hexagons")).toBeInTheDocument();
  });

  it("opens the popover on click and moves focus into it", async () => {
    const user = userEvent.setup();
    render(SentenceHarness);
    const chip = screen.getByRole("button", { name: /Monterey Bay/ });
    expect(chip).toHaveAttribute("aria-expanded", "false");
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog", { name: "choose a place" });
    expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());
  });

  it("Escape closes and returns focus to the chip", async () => {
    const user = userEvent.setup();
    render(SentenceHarness);
    const chip = screen.getByRole("button", { name: /Monterey Bay/ });
    await user.click(chip);
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(chip).toHaveFocus();
  });

  it("first Escape clears the search, the second closes", async () => {
    const user = userEvent.setup();
    render(SentenceHarness);
    await user.click(screen.getByRole("button", { name: /Monterey Bay/ }));
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());
    await user.keyboard("flor");
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("a click outside closes", async () => {
    const user = userEvent.setup();
    render(SentenceHarness);
    await user.click(screen.getByRole("button", { name: /Monterey Bay/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("picking in the popover updates the chip and closes", async () => {
    const user = userEvent.setup();
    render(SentenceHarness);
    await user.click(screen.getByRole("button", { name: /Monterey Bay/ }));
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());
    await user.keyboard("keys{Enter}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: /Florida Keys/ })).toHaveFocus();
  });
});
