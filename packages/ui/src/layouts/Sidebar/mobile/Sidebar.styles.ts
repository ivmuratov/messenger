import { StyleSheet } from "react-native";

import { sidebarStylesToken } from "../tokens";

export const sidebarStyles = StyleSheet.create({
  sidebar: {
    ...sidebarStylesToken,
    flexGrow: 1,
    height: "100%",
    width: "100%",
  },
});
