import { Moon, Sun } from "lucide-react-native";
import type { ReactNode } from "react";
import type { GestureResponderEvent } from "react-native";
import { Pressable } from "react-native";
import switchTheme from "react-native-theme-switch-animation";

import { marginNativeSprinkles } from "@/sprinkles/index.native";
import { useThemedNativeStyles } from "@/themes/ThemeProvider/index.native";
import { transitionsToken } from "@/tokens/transitions";

import type { ThemeSwitcherBaseProps } from "../types";
import { useThemeSwitcher } from "../useThemeSwitcher";

export const ThemeSwitcher = (props: ThemeSwitcherBaseProps): ReactNode => {
  const { theme, handleSwitchTheme } = useThemeSwitcher();
  const { primary } = useThemedNativeStyles();

  const handleSwitch = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;

    switchTheme({
      switchThemeFunction: handleSwitchTheme,
      animationConfig: {
        type: theme === "light" ? "circular" : "inverted-circular",
        duration: transitionsToken.durationMs,
        startingPoint: {
          cx: pageX,
          cy: pageY,
        },
      },
    });
  };

  return (
    <Pressable
      role="button"
      accessibilityLabel="Toggle theme"
      onPress={handleSwitch}
      style={marginNativeSprinkles(props)}
    >
      {theme === "light" ? <Moon color={primary.color} /> : <Sun color={primary.color} />}
    </Pressable>
  );
};
