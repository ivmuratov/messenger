import { StyleSheet } from "react-native";

import {
  drawerLayoutAsideStylesToken,
  drawerLayoutMainStylesToken,
  drawerLayoutRootStylesToken,
} from "../tokens";

export const drawerLayoutStyles = StyleSheet.create({
  root: {
    ...drawerLayoutRootStylesToken,
    alignSelf: "flex-start",
    flex: 1,
    minHeight: "100%",
    overflow: "hidden",
    position: "relative",
  },
  aside: drawerLayoutAsideStylesToken,
  main: drawerLayoutMainStylesToken,
});
