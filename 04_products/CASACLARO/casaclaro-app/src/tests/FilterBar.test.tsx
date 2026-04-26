import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "@/components/listings/FilterBar";
import { DEFAULT_FILTERS } from "@/types/listings";

const cities = [
  { slug: "medellin", label: "Medellín" },
  { slug: "bogota", label: "Bogotá" },
];

describe("FilterBar", () => {
  it("changing listing_type select calls onChange with listing_type: sale", async () => {
    const onChange = vi.fn();
    render(
      <FilterBar filters={DEFAULT_FILTERS} cities={cities} onChange={onChange} />
    );
    const select = screen.getByRole("combobox", { name: /Listing Type/i });
    await userEvent.selectOptions(select, "sale");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ listing_type: "sale" })
    );
  });

  it("changing city select calls onChange with correct city_slug", async () => {
    const onChange = vi.fn();
    render(
      <FilterBar filters={DEFAULT_FILTERS} cities={cities} onChange={onChange} />
    );
    const select = screen.getByRole("combobox", { name: /City/i });
    await userEvent.selectOptions(select, "medellin");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ city_slug: "medellin" })
    );
  });

  it("changing vetting_level select calls onChange with correct level", async () => {
    const onChange = vi.fn();
    render(
      <FilterBar filters={DEFAULT_FILTERS} cities={cities} onChange={onChange} />
    );
    const select = screen.getByRole("combobox", { name: /Vetting Level/i });
    await userEvent.selectOptions(select, "fully_vetted");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ vetting_level: "fully_vetted" })
    );
  });

  it("clicking Reset calls onChange with DEFAULT_FILTERS", async () => {
    const onChange = vi.fn();
    render(
      <FilterBar filters={DEFAULT_FILTERS} cities={cities} onChange={onChange} />
    );
    const reset = screen.getByRole("button", { name: /reset/i });
    await userEvent.click(reset);
    expect(onChange).toHaveBeenCalledWith(DEFAULT_FILTERS);
  });

  it("all five filter selects are present in the DOM", () => {
    render(
      <FilterBar filters={DEFAULT_FILTERS} cities={cities} onChange={vi.fn()} />
    );
    expect(screen.getByRole("combobox", { name: /Listing Type/i })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /City/i })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /Property Type/i })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /Price Range/i })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /Vetting Level/i })).toBeTruthy();
  });
});
