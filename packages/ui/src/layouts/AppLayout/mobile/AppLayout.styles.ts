import { StyleSheet } from "react-native";

import { appLayoutAsideStylesToken, appLayoutMainStylesToken } from "../tokens";

export const appLayoutStyles = StyleSheet.create({
  root: {
    alignSelf: "flex-start",
    flex: 1,
    flexDirection: "row",
    minHeight: "100%",
    overflow: "hidden",
    position: "relative",
  },
  aside: appLayoutAsideStylesToken,
  main: appLayoutMainStylesToken,
});
