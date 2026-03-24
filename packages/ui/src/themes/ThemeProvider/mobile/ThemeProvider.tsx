import { type ReactNode, useState } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { SetThemeContext, ThemeContext } from "../../context";
import type { ThemeProviderProps } from "../types";
import { themes } from "./themes.styles";

export const ThemeProvider = ({ children, defaultTheme }: ThemeProviderProps): ReactNode => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>
        <SafeAreaProvider>
          <SystemBars style={theme === "dark" ? "light" : "dark"} />
          <SafeAreaView
            style={{ flex: 1, backgroundColor: themes[theme].secondary.backgroundColor }}
          >
            {children}
          </SafeAreaView>
        </SafeAreaProvider>
      </SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
