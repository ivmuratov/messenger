import { useContext } from "react";

import { SetThemeContext, ThemeContext } from "../context";

export const useThemeSwitcher = () => {
  const theme = useContext(ThemeContext);
  const setTheme = useContext(SetThemeContext);

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return {
    theme,
    handleToggleTheme,
  };
};
