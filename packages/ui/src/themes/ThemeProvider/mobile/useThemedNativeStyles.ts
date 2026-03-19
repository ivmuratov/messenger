import { useContext } from "react";

import { ThemeContext } from "@/themes/context";

import { themes } from "./themes.styles";

export const useThemedNativeStyles = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useThemedNativeStyles must be used within ThemeProvider");
  }

  return themes[theme];
};
