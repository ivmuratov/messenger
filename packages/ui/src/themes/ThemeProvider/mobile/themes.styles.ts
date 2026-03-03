import { StyleSheet } from "react-native";

import { darkThemeToken, lightThemeToken } from "../../tokens";

const light = StyleSheet.create({
  primary: {
    backgroundColor: lightThemeToken.background.primary,
    color: lightThemeToken.foreground.primary,
    borderColor: lightThemeToken.border.primary,
  },
  secondary: {
    backgroundColor: lightThemeToken.background.secondary,
    color: lightThemeToken.foreground.secondary,
    borderColor: lightThemeToken.border.secondary,
  },
});

const dark = StyleSheet.create({
  primary: {
    backgroundColor: darkThemeToken.background.primary,
    color: darkThemeToken.foreground.primary,
    borderColor: darkThemeToken.border.primary,
  },
  secondary: {
    backgroundColor: darkThemeToken.background.secondary,
    color: darkThemeToken.foreground.secondary,
    borderColor: darkThemeToken.border.secondary,
  },
});

export const themes = { light, dark } as const;
