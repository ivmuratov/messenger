import { Moon, Sun } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable } from "react-native";

import { marginNativeSprinkles } from "@/sprinkles/index.native";
import { useThemedNativeStyles } from "@/themes/ThemeProvider/index.native";

import type { ThemeSwitcherBaseProps } from "../types";
import { useThemeSwitcher } from "../useThemeSwitcher";

export const ThemeSwitcher = (props: ThemeSwitcherBaseProps): ReactNode => {
  const { theme, handleSwitchTheme } = useThemeSwitcher();
  const { primary } = useThemedNativeStyles();

  return (
    <Pressable
      role="button"
      accessibilityLabel="Toggle theme"
      onPress={handleSwitchTheme}
      style={marginNativeSprinkles(props)}
    >
      {theme === "light" ? <Moon color={primary.color} /> : <Sun color={primary.color} />}
    </Pressable>
  );
};
