import { useContext } from "react";

import { AnimatedThemeContext, type AnimatedThemeStyles } from "./animatedContext";

export const useThemedNativeStyles = (): AnimatedThemeStyles => {
  const animatedStyles = useContext(AnimatedThemeContext);

  if (!animatedStyles) {
    throw new Error("useThemedNativeStyles must be used within ThemeProvider");
  }

  return animatedStyles;
};
