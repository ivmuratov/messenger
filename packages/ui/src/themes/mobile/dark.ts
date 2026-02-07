import { StyleSheet } from "react-native";

import { darkToken } from "../tokens";

export const dark = StyleSheet.create({
  default: {
    backgroundColor: darkToken.bg.default,
    color: darkToken.fg.default,
    borderColor: darkToken.border.default,
  },
  subtle: {
    backgroundColor: darkToken.bg.subtle,
    color: darkToken.fg.subtle,
    borderColor: darkToken.border.subtle,
  },
  strong: {
    backgroundColor: darkToken.bg.strong,
    color: darkToken.fg.strong,
    borderColor: darkToken.border.strong,
  },
});
