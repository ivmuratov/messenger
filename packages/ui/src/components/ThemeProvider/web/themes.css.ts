import { createGlobalTheme, createGlobalThemeContract } from "@vanilla-extract/css";

import { darkThemeToken, lightThemeToken } from "@/tokens";
import type { ThemeContract } from "@/types";

export const theme = createGlobalThemeContract(
  {
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
  } satisfies NullableTokens<ThemeContract>,
  (_, path) => `theme-${path.join("-")}`
);

createGlobalTheme('[data-theme="light"]', theme, lightThemeToken);
createGlobalTheme('[data-theme="dark"]', theme, darkThemeToken);
