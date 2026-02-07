import { StyleSheet } from "react-native";

import { lightToken } from "./tokens";

export const light = StyleSheet.create({
  default: {
    backgroundColor: lightToken.bg.default,
    color: lightToken.fg.default,
    borderColor: lightToken.border.default,
  },
  subtle: {
    backgroundColor: lightToken.bg.subtle,
    color: lightToken.fg.subtle,
    borderColor: lightToken.border.subtle,
  },
  strong: {
    backgroundColor: lightToken.bg.strong,
    color: lightToken.fg.strong,
    borderColor: lightToken.border.strong,
  },
});
