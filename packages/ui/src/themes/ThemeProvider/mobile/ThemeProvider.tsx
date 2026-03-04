import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { transitionsToken } from "@/tokens";

import { SetThemeContext, ThemeContext } from "../../context";
import type { ThemeProviderProps } from "../types";
import { AnimatedThemeContext, type AnimatedThemeStyles } from "./animatedContext";
import { themes } from "./themes.styles";

const interpolateColor = (
  animatedValue: Animated.Value,
  lightColor: string,
  darkColor: string
): Animated.AnimatedInterpolation<string> =>
  animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [lightColor, darkColor],
  });

export const ThemeProvider = ({ children, defaultTheme }: ThemeProviderProps): ReactNode => {
  const [theme, setTheme] = useState(defaultTheme);
  const themeAnimatedValue = useRef(new Animated.Value(defaultTheme === "dark" ? 1 : 0)).current;

  const animatedStyles = useMemo<AnimatedThemeStyles>(
    () => ({
      primary: {
        backgroundColor: interpolateColor(
          themeAnimatedValue,
          themes.light.primary.backgroundColor,
          themes.dark.primary.backgroundColor
        ),
        color: interpolateColor(
          themeAnimatedValue,
          themes.light.primary.color,
          themes.dark.primary.color
        ),
        borderColor: interpolateColor(
          themeAnimatedValue,
          themes.light.primary.borderColor,
          themes.dark.primary.borderColor
        ),
      },
      secondary: {
        backgroundColor: interpolateColor(
          themeAnimatedValue,
          themes.light.secondary.backgroundColor,
          themes.dark.secondary.backgroundColor
        ),
        color: interpolateColor(
          themeAnimatedValue,
          themes.light.secondary.color,
          themes.dark.secondary.color
        ),
        borderColor: interpolateColor(
          themeAnimatedValue,
          themes.light.secondary.borderColor,
          themes.dark.secondary.borderColor
        ),
      },
    }),
    [themeAnimatedValue]
  );

  useEffect(() => {
    const animation = Animated.timing(themeAnimatedValue, {
      toValue: theme === "dark" ? 1 : 0,
      duration: transitionsToken.durationMs,
      easing: Easing.ease,
      useNativeDriver: false,
    });
    animation.start();

    return () => animation.stop();
  }, [theme, themeAnimatedValue]);

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>
        <AnimatedThemeContext.Provider value={animatedStyles}>
          <SafeAreaProvider>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
            <SafeAreaView>{children}</SafeAreaView>
          </SafeAreaProvider>
        </AnimatedThemeContext.Provider>
      </SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};
