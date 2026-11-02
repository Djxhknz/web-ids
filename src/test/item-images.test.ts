import { describe, expect, it } from "vitest";
import { itemImageUrl } from "@/lib/item-images";

describe("Official Highrise item pictures", () => {
  it("maps the user's item ID to the official catalog avatar source", () => {
    expect(itemImageUrl("bag-n_landsalegrabkawaiigothsailor2022giantanchor")).toBe(
      "https://cdn.highrisegame.com/avatar/bag-n_landsalegrabkawaiigothsailor2022giantanchor.png",
    );
  });

  it("keeps IDs within the image path rather than accepting URL parameters", () => {
    const url = new URL(itemImageUrl("item?other=1#fragment"));
    expect(url.hostname).toBe("cdn.highrisegame.com");
    expect(url.search).toBe("");
    expect(url.hash).toBe("");
    expect(url.pathname).toBe("/avatar/item%3Fother%3D1%23fragment.png");
  });
});