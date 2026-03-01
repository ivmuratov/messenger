import { useContext, useMemo } from "react";

import { ThemeContext } from "../../context";
import { dark, light } from "./themes.styles";

const themes = {
  light,
  dark,
} as const;

export const useThemedStyles = () => {
  const theme = useContext(ThemeContext);

  return useMemo(
    () => ({
      defaultBackgroundColor: themes[theme].default.backgroundColor,
      defaultColor: themes[theme].default.color,
    }),
    [theme]
  );
};
