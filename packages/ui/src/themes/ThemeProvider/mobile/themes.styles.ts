import { StyleSheet } from "react-native";

import { darkThemeToken, lightThemeToken } from "../../tokens";

const light = StyleSheet.create({
  primary: {
    backgroundColor: lightThemeToken.background.primary,
    color: lightThemeToken.foreground.primary,
  },
});

const dark = StyleSheet.create({
  primary: {
    backgroundColor: darkThemeToken.background.primary,
    color: darkThemeToken.foreground.primary,
  },
});

export const themes = { light, dark } as const;
