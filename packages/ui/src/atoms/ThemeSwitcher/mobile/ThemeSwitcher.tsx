import { Moon, Sun } from "lucide-react-native";
import { type ReactNode, useCallback } from "react";
import { type GestureResponderEvent, Pressable } from "react-native";
import switchTheme from "react-native-theme-switch-animation";

import { useThemedNativeStyles } from "@/shared/hooks";
import { marginNativeSprinkles } from "@/shared/sprinkles/mobile";
import { transitionsToken } from "@/shared/tokens";

import { useThemeSwitcher } from "../hooks";
import type { ThemeSwitcherBaseProps } from "../types";

export const ThemeSwitcher = (props: ThemeSwitcherBaseProps): ReactNode => {
  const { theme, handleSwitchTheme } = useThemeSwitcher();
  const { foreground } = useThemedNativeStyles();

  const handleSwitch = useCallback(
    (event: GestureResponderEvent) => {
      event.currentTarget.measure((_, __, width, height, px, py) => {
        switchTheme({
          switchThemeFunction: handleSwitchTheme,
          animationConfig: {
            type: theme === "light" ? "circular" : "inverted-circular",
            duration: transitionsToken.durationMs,
            startingPoint: {
              cy: py + height / 2,
              cx: px + width / 2,
            },
          },
        });
      });
    },
    [handleSwitchTheme, theme]
  );

  return (
    <Pressable
      role="button"
      accessibilityLabel="Toggle theme"
      onPress={handleSwitch}
      style={marginNativeSprinkles(props)}
    >
      {theme === "light" ? <Moon color={foreground.primary} /> : <Sun color={foreground.primary} />}
    </Pressable>
  );
};
