import { StyleSheet } from "react-native";

import { darkThemeToken, lightThemeToken } from "../../tokens";

export const light = StyleSheet.create({
  default: {
    backgroundColor: lightThemeToken.background.default,
    color: lightThemeToken.foreground.default,
  },
});

export const dark = StyleSheet.create({
  default: {
    backgroundColor: darkThemeToken.background.default,
    color: darkThemeToken.foreground.default,
  },
});
