import { useContext } from "react";

import { ThemeContext } from "@/shared/contexts";
import { themes } from "@/shared/tokens";

export const useThemedNativeStyles = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useThemedNativeStyles must be used within ThemeProvider");
  }

  return themes[theme];
};
