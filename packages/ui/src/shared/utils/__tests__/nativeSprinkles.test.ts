import { describe, expect, it } from "vitest";

import { createNativeSprinkles, defineNativeProperties } from "../nativeSprinkles";

const spacing = { sm: 4, md: 8, lg: 16 };

const spacingProperties = defineNativeProperties({
  properties: {
    marginTop: spacing,
    marginRight: spacing,
    marginBottom: spacing,
    marginLeft: spacing,
    paddingTop: spacing,
  },
  shorthands: {
    m: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
  },
});

const sprinkles = createNativeSprinkles(spacingProperties);

describe("createNativeSprinkles", () => {
  it("применяет прямой проп", () => {
    const styles = sprinkles({ paddingTop: "sm" });

    expect(styles).toHaveLength(1);
    expect(styles[0]).toEqual(expect.objectContaining({ paddingTop: 4 }));
  });

  it("разворачивает shorthand в несколько свойств", () => {
    const styles = sprinkles({ m: "sm" });

    expect(styles).toHaveLength(4);
    expect(styles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ marginTop: 4 }),
        expect.objectContaining({ marginRight: 4 }),
        expect.objectContaining({ marginBottom: 4 }),
        expect.objectContaining({ marginLeft: 4 }),
      ])
    );
  });

  it("игнорирует неизвестный scale", () => {
    const styles = sprinkles({ paddingTop: "xl" as "sm" });

    expect(styles).toHaveLength(0);
  });
});
