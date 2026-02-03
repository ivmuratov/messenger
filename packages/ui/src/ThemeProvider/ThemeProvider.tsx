import "@/styles/reset.css";

import { useState } from "react";

import { SetThemeContext, ThemeContext } from "./context";
import type { Theme, ThemeProviderProps } from "./types";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>{children}</SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
