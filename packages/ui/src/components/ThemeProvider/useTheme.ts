import { useContext } from "react";

import { SetThemeContext, ThemeContext } from "./context";

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  const setTheme = useContext(SetThemeContext);

  const handleSwitchTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return { theme, handleSwitchTheme };
};
