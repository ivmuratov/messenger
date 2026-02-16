import { type FC, useState } from "react";

import { SetThemeContext, ThemeContext } from "../context";
import type { ThemeProviderProps } from "../types";

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, defaultTheme }) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>{children}</SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
