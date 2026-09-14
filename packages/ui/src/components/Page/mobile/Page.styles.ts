import { StyleSheet } from "react-native";

import { pageBodyStylesToken, pageHeaderStylesToken } from "../tokens";

export const pageStyles = StyleSheet.create({
  header: pageHeaderStylesToken,
  body: pageBodyStylesToken,
  root: {
    flex: 1,
  },
});
