import { Moon, Sun } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable } from "react-native";

import { marginNativeSprinkles } from "@/sprinkles";

import type { ThemeSwitcherBaseProps } from "../types";
import { useThemeSwitcher } from "../useThemeSwitcher";

export const ThemeSwitcher = (props: ThemeSwitcherBaseProps): ReactNode => {
  const { theme, handleToggleTheme } = useThemeSwitcher();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      onPress={handleToggleTheme}
      style={marginNativeSprinkles(props)}
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </Pressable>
  );
};
