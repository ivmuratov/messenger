import { type ReactNode, useState } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { SetThemeContext, ThemeContext } from "@/shared/contexts";
import { themes } from "@/shared/tokens";

import type { ThemeProviderProps } from "../types";

export const ThemeProvider = ({ children, defaultTheme }: ThemeProviderProps): ReactNode => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <GestureHandlerRootView>
      <ThemeContext.Provider value={theme}>
        <SetThemeContext.Provider value={setTheme}>
          <SafeAreaProvider>
            <SystemBars style={theme === "dark" ? "light" : "dark"} />
            <SafeAreaView style={{ flex: 1, backgroundColor: themes[theme].background.secondary }}>
              {children}
            </SafeAreaView>
          </SafeAreaProvider>
        </SetThemeContext.Provider>
      </ThemeContext.Provider>
    </GestureHandlerRootView>
  );
};
