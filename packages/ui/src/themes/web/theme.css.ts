import { createThemeContract } from "@vanilla-extract/css";

import type { ThemeContract } from "../types";

export const theme = createThemeContract({
  bg: {
    default: null,
    subtle: null,
    strong: null,
  },
  fg: {
    default: null,
    subtle: null,
    strong: null,
  },
  border: {
    default: null,
    subtle: null,
    strong: null,
  },
} satisfies NullableTokens<ThemeContract>);
