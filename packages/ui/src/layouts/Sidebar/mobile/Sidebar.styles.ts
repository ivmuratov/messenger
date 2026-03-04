import { StyleSheet } from "react-native";

import { sidebarStylesToken } from "../tokens";

export const sidebarStyles = StyleSheet.create({
  sidebar: {
    ...sidebarStylesToken,
    width: 150,
    height: "100%",
  },
});
