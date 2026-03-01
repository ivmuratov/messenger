import { StyleSheet } from "react-native";

import { darkThemeToken, lightThemeToken } from "../../tokens";

export const light = StyleSheet.create({
  primary: {
    backgroundColor: lightThemeToken.background.primary,
    color: lightThemeToken.foreground.primary,
  },
});

export const dark = StyleSheet.create({
  primary: {
    backgroundColor: darkThemeToken.background.primary,
    color: darkThemeToken.foreground.primary,
  },
});
