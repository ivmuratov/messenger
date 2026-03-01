import { useContext, useMemo } from "react";

import { ThemeContext } from "../../context";
import { themes } from "./themes.styles";

export const useThemedNativeStyles = () => {
  const theme = useContext(ThemeContext);

  return useMemo(() => themes[theme], [theme]);
};
