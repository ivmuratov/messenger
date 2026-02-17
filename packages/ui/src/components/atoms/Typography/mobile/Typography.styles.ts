import { StyleSheet } from "react-native";

import { fontWeightToken, textSizeToken } from "@/tokens";

export const textSizeVariants = StyleSheet.create(
  Object.fromEntries(Object.entries(textSizeToken).map(([key, value]) => [key, value]))
);

export const fontWeightVariants = StyleSheet.create(
  Object.fromEntries(
    Object.entries(fontWeightToken).map(([key, value]) => [key, { fontWeight: value }])
  )
);
