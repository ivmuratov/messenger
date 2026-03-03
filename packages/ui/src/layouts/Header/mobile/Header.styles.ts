import { StyleSheet } from "react-native";

import {
  headerCenterStylesToken,
  headerLeftStylesToken,
  headerRightStylesToken,
  headerRootStylesToken,
} from "../tokens";

export const headerStyles = StyleSheet.create({
  header: headerRootStylesToken,
  left: headerLeftStylesToken,
  center: headerCenterStylesToken,
  right: headerRightStylesToken,
});
