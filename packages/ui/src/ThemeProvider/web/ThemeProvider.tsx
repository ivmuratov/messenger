import "@/styles";

import { type FC, useLayoutEffect, useState } from "react";

import { dark, light } from "@/themes";

import { SetThemeContext, ThemeContext } from "../context";
import type { Theme, ThemeProviderProps } from "../types";

const themes = {
  dark,
  light,
} as const;

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, defaultTheme }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useLayoutEffect(() => {
    document.body.className = themes[theme];
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>{children}</SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
