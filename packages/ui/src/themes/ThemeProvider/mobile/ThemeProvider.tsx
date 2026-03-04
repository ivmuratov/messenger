import { type ReactNode, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { SetThemeContext, ThemeContext } from "../../context";
import type { ThemeProviderProps } from "../types";

export const ThemeProvider = ({ children, defaultTheme }: ThemeProviderProps): ReactNode => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>
        <SafeAreaProvider>
          <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
          <SafeAreaView>{children}</SafeAreaView>
        </SafeAreaProvider>
      </SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
