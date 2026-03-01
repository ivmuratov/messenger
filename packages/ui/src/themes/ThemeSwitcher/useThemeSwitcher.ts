import { useContext } from "react";

import { SetThemeContext, ThemeContext } from "../context";

export const useThemeSwitcher = () => {
  const theme = useContext(ThemeContext);
  const setTheme = useContext(SetThemeContext);

  if (!setTheme) throw new Error("useThemeSwitcher must be used within ThemeProvider");

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return {
    theme,
    handleToggleTheme,
  };
};
