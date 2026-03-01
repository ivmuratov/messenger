import { type ReactNode, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { SetThemeContext, ThemeContext } from "../../context";
import type { ThemeProviderProps } from "../types";
import { styles } from "./ThemeProvider.styles";
import { themes } from "./themes.styles";

export const ThemeProvider = ({ children, defaultTheme }: ThemeProviderProps): ReactNode => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={theme}>
        <SetThemeContext.Provider value={setTheme}>
          <SafeAreaView
            style={[styles.container, { backgroundColor: themes[theme].primary.backgroundColor }]}
          >
            {children}
          </SafeAreaView>
        </SetThemeContext.Provider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
};
