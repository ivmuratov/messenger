import "./styles";

import { type FC, useLayoutEffect, useState } from "react";

import { SetThemeContext, ThemeContext } from "../context";
import type { ThemeProviderProps } from "../types";
import { themes } from "./themes.css";

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, defaultTheme }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useLayoutEffect(() => {
    document.body.className = themes[theme];
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>{children}</SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
