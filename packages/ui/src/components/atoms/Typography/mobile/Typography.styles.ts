import { StyleSheet } from "react-native";

import { fontWeightToken, textSizeToken } from "@/tokens";

export const textSizeStyles = StyleSheet.create(
  Object.fromEntries(Object.entries(textSizeToken).map(([key, value]) => [key, value]))
);

export const fontWeightStyles = StyleSheet.create(
  Object.fromEntries(
    Object.entries(fontWeightToken).map(([key, value]) => [key, { fontWeight: value }])
  )
);
