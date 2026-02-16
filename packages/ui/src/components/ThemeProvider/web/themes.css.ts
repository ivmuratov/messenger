import { createTheme, createThemeContract } from "@vanilla-extract/css";

import { darkThemeToken, lightThemeToken } from "@/tokens";
import type { Theme, ThemeContract } from "@/types";

export const theme = createThemeContract({
  background: {
    default: null,
    subtle: null,
    strong: null,
  },
  foreground: {
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

const light = createTheme(theme, lightThemeToken);
const dark = createTheme(theme, darkThemeToken);

export const themes = {
  dark,
  light,
} as const satisfies Record<Theme, string>;
