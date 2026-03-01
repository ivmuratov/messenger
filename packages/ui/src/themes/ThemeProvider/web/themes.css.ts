import { createGlobalTheme, createGlobalThemeContract } from "@vanilla-extract/css";

import { darkThemeToken, lightThemeToken } from "../../tokens";
import type { ThemeContract } from "../../types";

export const theme = createGlobalThemeContract(
  {
    background: {
      primary: null,
      secondary: null,
    },
    foreground: {
      primary: null,
      secondary: null,
    },
    border: {
      primary: null,
      secondary: null,
    },
  } satisfies NullableTokens<ThemeContract>,
  (_, path) => `theme-${path.join("-")}`
);

createGlobalTheme('[data-theme="light"]', theme, lightThemeToken);
createGlobalTheme('[data-theme="dark"]', theme, darkThemeToken);
