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
      primaryBackgroundColor: themes[theme].primary.backgroundColor,
      primaryColor: themes[theme].primary.color,
    }),
    [theme]
  );
};
