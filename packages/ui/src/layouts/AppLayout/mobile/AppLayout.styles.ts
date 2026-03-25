import { StyleSheet } from "react-native";

import { appLayoutAsideStylesToken, appLayoutMainStylesToken } from "../tokens";

export const appLayoutStyles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
  },
  row: {
    alignSelf: "flex-start",
    flexDirection: "row",
    minHeight: "100%",
  },
  aside: appLayoutAsideStylesToken,
  main: appLayoutMainStylesToken,
});
