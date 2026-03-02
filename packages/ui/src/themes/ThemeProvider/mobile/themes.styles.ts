import { StyleSheet } from "react-native";

import { darkThemeToken, lightThemeToken } from "../../tokens";

const light = StyleSheet.create({
  primary: {
    backgroundColor: lightThemeToken.background.primary,
    color: lightThemeToken.foreground.primary,
  },
  secondary: {
    backgroundColor: lightThemeToken.background.secondary,
    color: lightThemeToken.foreground.secondary,
  },
});

const dark = StyleSheet.create({
  primary: {
    backgroundColor: darkThemeToken.background.primary,
    color: darkThemeToken.foreground.primary,
  },
  secondary: {
    backgroundColor: darkThemeToken.background.secondary,
    color: darkThemeToken.foreground.secondary,
  },
});

export const themes = { light, dark } as const;
