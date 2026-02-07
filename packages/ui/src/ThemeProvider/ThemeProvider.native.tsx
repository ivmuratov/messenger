import { type FC, useState } from "react";
import { View } from "react-native";

import { dark, light } from "@/themes/index.native";

import { SetThemeContext, ThemeContext } from "./context";
import type { Theme, ThemeProviderProps } from "./types";

const themes = {
  dark,
  light,
} as const;

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, defaultTheme }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>
        <View style={[{ flex: 1 }, themes[theme].default]}>{children}</View>
      </SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
