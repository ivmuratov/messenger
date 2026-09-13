import { describe, expect, it } from "vitest";

import { nativeRecipe } from "../nativeRecipe";

describe("nativeRecipe", () => {
  it("возвращает base и стили выбранных variants", () => {
    const recipe = nativeRecipe({
      base: { display: "flex" },
      variants: {
        direction: {
          row: { flexDirection: "row" },
          column: { flexDirection: "column" },
        },
        align: {
          center: { alignItems: "center" },
        },
      },
    });

    const styles = recipe({ direction: "row", align: "center" });

    expect(styles).toHaveLength(3);
    expect(styles[0]).toEqual(expect.objectContaining({ display: "flex" }));
    expect(styles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flexDirection: "row" }),
        expect.objectContaining({ alignItems: "center" }),
      ])
    );
  });

  it("пропускает falsy значения variant", () => {
    const recipe = nativeRecipe({
      variants: {
        direction: {
          row: { flexDirection: "row" },
        },
      },
    });

    const styles = recipe({ direction: "" as "row" });

    expect(styles).toHaveLength(0);
  });
});
