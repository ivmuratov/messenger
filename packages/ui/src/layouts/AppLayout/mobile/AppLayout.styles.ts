import { StyleSheet } from "react-native";

import {
  appLayoutAsideStylesToken,
  appLayoutMainStylesToken,
  appLayoutRootStylesToken,
} from "../tokens";

export const appLayoutStyles = StyleSheet.create({
  root: {
    flex: 1,
    ...appLayoutRootStylesToken,
  },
  aside: appLayoutAsideStylesToken,
  main: appLayoutMainStylesToken,
});
