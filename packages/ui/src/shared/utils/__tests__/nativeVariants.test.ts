import { describe, expect, it } from "vitest";

import { nativeVariants } from "../nativeVariants";

describe("nativeVariants", () => {
  it("создаёт стили из токена без mapData", () => {
    const token = {
      sm: { fontSize: 12 },
      md: { fontSize: 16 },
    };

    const result = nativeVariants(token);

    expect(Object.keys(result)).toEqual(["sm", "md"]);
    expect(result.sm).toEqual(expect.objectContaining({ fontSize: 12 }));
    expect(result.md).toEqual(expect.objectContaining({ fontSize: 16 }));
  });

  it("преобразует значения токена через mapData", () => {
    const token = { sm: 12, md: 16 };

    const result = nativeVariants(token, (value) => ({ fontSize: value as number }));

    expect(Object.keys(result)).toEqual(["sm", "md"]);
    expect(result.sm).toEqual(expect.objectContaining({ fontSize: 12 }));
    expect(result.md).toEqual(expect.objectContaining({ fontSize: 16 }));
  });
});
